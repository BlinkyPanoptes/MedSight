"""
Central configuration for the Medicine Identification Assistant prototype.
Reads secrets from environment variables (.env) and defines fixed paths/constants.
"""
import os
from pathlib import Path

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass  # python-dotenv is optional; env vars can also be set directly

# --- Paths ---
BASE_DIR = Path(__file__).resolve().parent
CACHE_VAULT_DIR = BASE_DIR / "cache_vault"          # Obsidian-compatible vault
CACHE_INDEX_PATH = CACHE_VAULT_DIR / "index.json"    # key -> note filename
LOGS_DIR = BASE_DIR / "logs"
RUN_LOG_PATH = LOGS_DIR / "run_log.jsonl"
WARNINGS_LOG_PATH = LOGS_DIR / "warnings_log.jsonl"
OCR_ENGINE_CHOICE_PATH = BASE_DIR / "config" / "ocr_engine_choice.json"
BENCHMARK_RESULTS_PATH = BASE_DIR / "config" / "ocr_benchmark_results.json"

for d in (CACHE_VAULT_DIR, LOGS_DIR, OCR_ENGINE_CHOICE_PATH.parent):
    d.mkdir(parents=True, exist_ok=True)

# --- API ---
# Using Gemini instead of the Anthropic API for the parse + description
# agent steps (cheaper/near-unlimited on an existing Gemini plan).
OLLAMA_HOST = os.environ.get("OLLAMA_HOST", "http://localhost:11434")
OLLAMA_MODEL = os.environ.get("OLLAMA_MODEL", "llama3.2:3b")

# --- Confidence handling (Section 6 / open item #3) ---
# OCR/parse confidence is normalized to 0.0-1.0 before this check.
LOW_CONFIDENCE_THRESHOLD = float(os.environ.get("LOW_CONFIDENCE_THRESHOLD", "0.55"))

# --- Description agent grounding (Section 6 / open item #1) ---
# Locked prompt instructs the model to ground descriptions in the PH FDA
# Drug Product Registration / verification portal rather than free-generating.
PH_FDA_REFERENCE_DOMAINS = [
    "fda.gov.ph",
    "verification.fda.gov.ph",
]

# --- Cache ---
# Cache key = normalized hash of generic_name + brand_name + dosage (see utils.py)
