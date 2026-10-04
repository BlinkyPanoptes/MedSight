# Medicine Identification Assistant — Local Prototype

Implements the pipeline from `medicine-scanner-handoff.md`, Section 5, plus the
three decisions from this round:

1. **Description agent** — locked prompt (`description_agent.py`) that uses
   Gemini's built-in `google_search` grounding tool, instructed to only trust
   PH FDA sources (`fda.gov.ph`, `verification.fda.gov.ph`). It reports
   whether it actually found/verified the product there (`grounded:
   true/false`), rather than guessing. (Parse + description both run on
   Gemini now instead of Claude — see the "LLM provider" note below.)
2. **OCR engine** — decided by `benchmark_ocr.py`, not hardcoded. Whichever
   of PaddleOCR / EasyOCR scores higher gets written to
   `config/ocr_engine_choice.json`, which `main.py` reads at startup.
3. **Low confidence** — any stage (OCR, name parsing, description) below
   `LOW_CONFIDENCE_THRESHOLD` triggers a console warning, a spoken caveat,
   and a line in `logs/warnings_log.jsonl`.

## Setup

```bash
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env          # then fill in GEMINI_API_KEY
```

## LLM provider

Both the parse step (`llm_parse.py`) and the description agent
(`description_agent.py`) run on Gemini (`google-genai` SDK), not Anthropic —
swapped to use an existing near-unlimited Gemini plan and save on tokens.
Grounding for the description agent uses Gemini's built-in `google_search`
tool rather than Anthropic's `web_search`; behavior (search → ground in PH
FDA sources → report `grounded: true/false`) is otherwise unchanged. Default
model is `gemini-2.5-flash`, configurable via `GEMINI_MODEL` in `.env`.

## 1. Benchmark OCR engines (run once, or whenever you want to re-check)

Download the Kaggle dataset locally first:
https://www.kaggle.com/datasets/vencerlanz09/pharmaceutical-drugs-and-vitamins-dataset-v2

It ships as one subfolder per product class (e.g. `Biogesic/`, `Bioflu/`, ...),
which the benchmark uses as a proxy label for scoring hit-rate.

```bash
python benchmark_ocr.py /path/to/kaggle_dataset_root
```

This writes:
- `config/ocr_benchmark_results.json` — full per-image results, for you to
  spot-check manually (there's no real OCR ground truth in this dataset, so
  treat the automatic winner as a strong hint, not gospel — see the note the
  script prints at the end).
- `config/ocr_engine_choice.json` — the winning engine, read by `main.py`.

## 2. Run the live pipeline

```bash
python main.py
```

- `SPACE` — capture the current webcam frame and run it through the full
  pipeline (OCR → parse → cache check → description if needed → speak).
- `q` — quit.

Each run appends a full record (raw OCR text, parsed JSON, description,
confidences, cache hit/miss) to `logs/run_log.jsonl`, per Section 5.7 of the
handoff — this is what you'll use to manually score accuracy against the 20
known Kaggle products.

## 3. The Obsidian cache

`cache_vault/` is a plain folder of markdown notes with YAML frontmatter —
open it directly in Obsidian if you want to browse, tag, or manually correct
cached descriptions. Each note is keyed by a hash of
`generic_name + brand_name + dosage` (normalized), so repeat scans of the same
product skip the (paid) description-agent call entirely — that's the token
savings from note #1.

`cache_vault/index.json` is an internal key→filename map for fast lookups;
don't hand-edit it (delete it and it'll silently rebuild as empty — cached
notes will still be there but will need to be re-indexed manually or by
clearing the vault and re-running).

## Still open (per handoff Section 6)

- Benchmark results should be spot-checked manually before fully trusting the
  auto-picked OCR engine, since scoring is a heuristic (no ground-truth OCR
  labels exist in the Kaggle set).
- Confidence threshold (`0.55` default) is a starting guess — tune it once
  you have real run logs to look at.

## Explicitly not built here (Section 7)

Mobile app, FastAPI server, server-side caching, smart glasses integration,
shape/color classification — all still deferred.
