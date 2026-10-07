# Medicine Scanner - Agent Instructions

## Project Overview

Medicine Scanner is an assistive tool that helps visually impaired users
identify over-the-counter (OTC) Philippine medicines. It reads the text on
packaging with OCR, parses the brand name, generic name, and dosage with an
LLM, generates a 1-2 sentence description of what the medicine is for, and
reads the result aloud with text-to-speech. Repeat scans are served from a
cache to save LLM calls.

Pipeline:
OCR -> LLM parse -> confidence check -> cache lookup -> description agent
-> cache save -> TTS

## Current Phase and Scope

- **Phase 1 (done, kept as a test tool):** local prototype tested with a
  laptop webcam and the Kaggle "Pharmaceutical Drugs and Vitamins Dataset V2"
  images (`main.py`).
- **Phase 2 (current): backend.** The React Native (Expo dev build) app runs
  OCR on the phone (Apple Vision / ML Kit) and sends the text to the FastAPI
  backend in this repo (`api.py`), which handles LLM parsing, caching, and
  description generation and returns the text to speak. The mobile app
  itself lives in a separate repo and is built by teammates.
- **Not in scope:** smart-glasses code, on-device LLM, shape/color
  classification.
- **In scope:** OTC and branded medicines, including blister pack foil,
  text-based identification only.

## Project Structure

- `api.py` - FastAPI backend (`/identify`, `/health`) for the mobile app
- `pipeline.py` - Post-OCR pipeline shared by `api.py` and `main.py`
- `main.py` - Local webcam prototype (local OCR, then `pipeline.py`)
- `config.py` - Configuration and settings
- `ocr_engines.py` - OCR processing (local prototype only)
- `llm_parse.py` - LLM parsing of OCR text into brand/generic/dosage
- `llm_client.py` - LLM client: Groq (default) or local Ollama
- `description_agent.py` - Medicine description generation
- `confidence_handler.py` - Confidence evaluation
- `cache_store.py` - SQLite cache used by the pipeline
- `obsidian_cache.py` - Old markdown-vault cache (no longer used by the pipeline)
- `tts_output.py` - Text-to-speech functionality
- `utils.py` - Shared utilities
- `benchmark_ocr.py` - OCR benchmarking
- `sort_packaging_images.py` - Sorts dataset images into `sorted_output/`
- `kb/` - Verified dataset of the 10 supported medicines (see `kb/README.md`)
- `kb_build.py` - Validates `kb/` and builds `data/kb.sqlite`
- `kb_make_scans.py` - Drafts evaluation scans from dataset images

Generated, gitignored folders (never commit them): `.venv/`, `cache_vault/`,
`data/`, `logs/`, `sorted_output/`. Code that writes to `cache_vault/` must create it if it
does not exist (`os.makedirs(..., exist_ok=True)`).

## Commands

- Activate venv (PowerShell): `.\.venv\Scripts\Activate.ps1`
- Install: `pip install -r requirements.txt` (server only) or
  `pip install -r requirements-local.txt` (adds webcam, OCR, TTS)
- Run the backend: `uvicorn api:app --reload`
- Run the local webcam prototype: `python main.py`
- Benchmark OCR: `python benchmark_ocr.py <dataset_root>` (path to the
  Kaggle dataset, one subfolder per product class; required)
- Tests: no automated test suite exists yet. Update this line when one is
  added. Until then, verify changes by running the affected module or
  `main.py` and reporting what you observed.

## Medical Safety Rules (highest priority)

This tool is used by people who cannot visually double-check its output, so
a confident wrong answer is dangerous.

1. Never guess a medicine name, brand, or dosage when OCR or parse
   confidence is low. Defer to `confidence_handler.py` and tell the user to
   rescan instead.
2. Never silently fill in a missing or unreadable name, dosage, or field.
3. Descriptions of the 10 verified medicines must come only from the
   two-person-checked text in `kb/`. Any other medicine may get a general,
   LLM-generated description, but only behind the spoken unverified warning,
   which comes **before** the description, and with `grounded: false`. That
   description must not include dosing advice, and must say "I don't
   recognize this product" rather than guess.
4. Never present an unverified description as confirmed fact.
5. If the grounding source or confidence behavior is unclear, say so rather
   than assuming.

## General Rules

1. Read relevant files before making recommendations or changes.
2. Make changes only when the task requires them. For anything that alters
   the architecture or the pipeline order, propose the change and explain
   why before applying it.
3. Preserve existing architecture unless there is a strong reason to change
   it.
4. Do not expose secrets stored in `.env`. Never hardcode API keys in code.
5. Do not commit `.venv`, `cache_vault/`, `data/`, `sorted_output/`, or `.env`.
6. Clearly distinguish between observed code behavior and assumptions.
7. Prefer small, reversible changes.
8. Run the affected code after modifying it and report the result.
9. Explain potentially breaking changes before applying them.
10. Install packages only inside `.venv`. Add server dependencies to
    `requirements.txt` and local-prototype-only ones to `requirements-local.txt`.

## Code Standards

- Follow PEP 8 where practical.
- Prefer clear and maintainable Python.
- Avoid unnecessary dependencies.
- Use type hints for new functions where appropriate.
- Handle errors explicitly. A failed OCR, parse, or LLM call must never
  produce a made-up medicine result.