# MedSight — Medicine Identification Backend

An assistive tool that helps visually impaired users identify Philippine OTC
and branded medicines, including blister pack foil, from the text printed on
the packaging.

- **Mobile app** (React Native, Expo dev build, separate repo): runs OCR on
  the phone (Apple Vision on iOS, Google ML Kit on Android), sends the text to
  this backend, and speaks the reply with `expo-speech`. No photos leave the
  phone.
- **Backend** (this repo, FastAPI): parses the brand, generic name and dosage
  with an LLM, checks confidence, serves repeat scans from a cache, writes a
  short description, and returns the exact text to speak.

```
phone OCR → POST /identify → parse (LLM) → confidence check → cache (SQLite)
          → description (LLM, on a cache miss) → spoken_text → phone TTS
```

## Setup

```bash
python -m venv .venv
.venv\Scripts\activate             # macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt    # server only
cp .env.example .env               # then fill in GROQ_API_KEY and MEDSIGHT_API_KEY
```

For the local webcam prototype and OCR benchmark, install
`requirements-local.txt` instead. It adds OpenCV, PaddleOCR, EasyOCR and
pyttsx3.

### Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `LLM_PROVIDER` | `groq` | `groq`, or `ollama` for offline work |
| `GROQ_API_KEY` | — | Groq API key |
| `GROQ_MODEL` | `qwen/qwen3.8-27b` | Any Groq chat model that supports JSON mode |
| `OLLAMA_HOST` / `OLLAMA_MODEL` | `http://localhost:11434` / `llama3.2:3b` | Used when `LLM_PROVIDER=ollama` |
| `MEDSIGHT_API_KEY` | — | Shared secret the app sends as `X-API-Key`. If unset, `/identify` refuses every request. |
| `LOW_CONFIDENCE_THRESHOLD` | `0.55` | Any stage below this gets a spoken caveat |
| `MEDSIGHT_DATA_DIR` / `MEDSIGHT_LOGS_DIR` | `data/` / `logs/` | Point at a persistent disk on the cloud host |

## Run the backend

```bash
uvicorn api:app --reload                     # local
uvicorn api:app --host 0.0.0.0 --port $PORT  # cloud host
```

Interactive API docs are served at `/docs`.

## API contract (for the mobile team)

`POST /identify`, with header `X-API-Key: <MEDSIGHT_API_KEY>`.

```json
{
  "text": "BIOGESIC\nParacetamol 500mg ...",
  "lines": [{"text": "BIOGESIC", "confidence": 0.93}],
  "ocr_confidence": 0.88,
  "frames_merged": 4,
  "platform": "android",
  "app_version": "0.1.0"
}
```

- `text` is all recognized text, joined with newlines (max 5000 characters).
  If it's empty, the server joins `lines` instead.
- `ocr_confidence` is optional. Send `null` if the OCR library doesn't report
  one; the server then skips the OCR confidence check rather than treating it
  as 0.

Response (200):

```json
{
  "status": "ok | low_confidence | rescan",
  "brand_name": "Biogesic", "generic_name": "Paracetamol", "dosage": "500mg",
  "description": "A pain reliever and fever reducer.",
  "grounded": false, "source_url": null,
  "warnings": ["FDA verification"],
  "spoken_text": "Biogesic. A pain reliever and fever reducer. Note: ...",
  "cache": "hit | miss | null"
}
```

- **Always speak `spoken_text` exactly as sent.** It already includes the
  safety caveats.
- `rescan`: no text was read, or no medicine name was found. All name fields
  are `null`, and `spoken_text` asks the user to try again.
- `low_confidence`: at least one stage was below the threshold. `warnings`
  lists which ones.

Other responses:
- **401:** missing or wrong API key.
- **422:** the request body is invalid.
- **503:** the LLM is busy or down (for example, the Groq rate limit), or the
  server's API key isn't configured. When the LLM is the cause, the body
  includes a `spoken_text` asking the user to retry.

`GET /health` returns `{"status": "ok", "llm_provider": "..."}`.

## Local webcam prototype

`main.py` runs OCR on the laptop and then the same pipeline as the backend.
It's useful for testing without the phone.

```bash
python benchmark_ocr.py /path/to/kaggle_dataset_root   # once: picks PaddleOCR vs EasyOCR
python main.py                                         # SPACE = capture, q = quit
```

The benchmark uses the Kaggle
[Pharmaceutical Drugs and Vitamins Dataset V2](https://www.kaggle.com/datasets/vencerlanz09/pharmaceutical-drugs-and-vitamins-dataset-v2).
It has one subfolder per product, and the folder names are used as labels.
The benchmark writes `config/ocr_engine_choice.json`, which `main.py` reads.
There's no OCR ground truth in this dataset, so spot-check the results.

## Logs

Every scan, from the app or the webcam, appends a full record to
`logs/run_log.jsonl`: the OCR text, parsed fields, confidences, cache hit or
miss, and the final spoken text. Low-confidence stages also go to
`logs/warnings_log.jsonl`. These logs are how accuracy is scored by hand.

## Known limitations

- **Descriptions are not FDA-verified yet.** They come from the LLM's
  general knowledge, so `grounded` is always `false` and every reply carries a
  "please double-check the label" caveat. The planned fix is to match names
  against the PH FDA registered drug products list.
- The confidence threshold is a starting guess. Tune it from real run logs.
- Not built: smart-glasses integration, shape/color classification.
