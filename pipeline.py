"""
Everything after OCR: parse -> confidence check -> cache -> description ->
spoken text. Shared by the FastAPI backend (api.py), which gets OCR text from
the phone, and the local webcam prototype (main.py), which runs OCR itself.

identify() returns the API response shape:
    status       "ok" | "low_confidence" | "rescan"
    brand_name / generic_name / dosage   (None when not read)
    description, grounded, source_url
    warnings     stages that need a caveat (e.g. "name extraction", "FDA verification")
    spoken_text  exactly what the client should read aloud
    cache        "hit" | "miss" | None
"""
from typing import Optional

import config
from cache_store import CacheStore
from confidence_handler import build_spoken_caveat, check_confidence
from description_agent import get_description
from llm_parse import parse_medicine_text
from utils import append_jsonl, normalize_key

NO_TEXT_MESSAGE = ("I couldn't read any text on that packaging. "
                   "Please try again with better lighting or a closer shot.")
NO_NAME_MESSAGE = "I read some text but couldn't identify a medicine name from it. Please try again."


def _rescan(message: str, run_record: dict, outcome: str) -> dict:
    run_record["outcome"] = outcome
    run_record["final_spoken_text"] = message
    append_jsonl(config.RUN_LOG_PATH, run_record)
    return {
        "status": "rescan",
        "brand_name": None, "generic_name": None, "dosage": None,
        "description": None, "grounded": False, "source_url": None,
        "warnings": [], "spoken_text": message, "cache": None,
    }


def identify(raw_text: str, ocr_confidence: Optional[float], cache: CacheStore,
             meta: Optional[dict] = None) -> dict:
    """Run the post-OCR pipeline on text read from medicine packaging.

    ocr_confidence may be None when the client's OCR doesn't report one; the
    OCR confidence check is then skipped (and logged as skipped), not failed.
    Raises llm_client.LLMUnavailableError if the LLM can't be reached.
    """
    run_record = {**(meta or {}), "raw_ocr_text": raw_text, "ocr_confidence": ocr_confidence}
    low_stages = []

    # 1. OCR confidence (computed by the caller)
    if ocr_confidence is None:
        run_record["ocr_confidence_skipped"] = True
    elif check_confidence("ocr", ocr_confidence, {"meta": meta}):
        low_stages.append("OCR")

    if not raw_text.strip():
        return _rescan(NO_TEXT_MESSAGE, run_record, "no_text_detected")

    # 2. LLM parse
    parsed = parse_medicine_text(raw_text)
    run_record["parsed"] = parsed
    if check_confidence("parse", parsed.get("confidence", 0.0), {"parsed": parsed}):
        low_stages.append("name extraction")

    generic_name = parsed.get("generic_name")
    brand_name = parsed.get("brand_name")
    dosage = parsed.get("dosage")

    if not generic_name and not brand_name:
        return _rescan(NO_NAME_MESSAGE, run_record, "parse_failed")

    # 3. Cache lookup, or 4. description agent on a miss
    cache_key = normalize_key(generic_name or "", brand_name or "", dosage or "")
    cached = cache.get(cache_key)

    if cached:
        description = cached.get("description", "")
        grounded = cached.get("grounded", False)
        source_url = cached.get("source_url")
        desc_confidence = cached.get("confidence", 0.0)
        cache_status = "hit"
    else:
        desc_result = get_description(generic_name or "", brand_name or "", dosage or "")
        description = desc_result["description"]
        grounded = desc_result["grounded"]
        source_url = desc_result.get("source_url")
        desc_confidence = desc_result["confidence"]
        cache.set(
            cache_key=cache_key,
            generic_name=generic_name or "",
            brand_name=brand_name or "",
            dosage=dosage or "",
            description=description,
            grounded=grounded,
            source_url=source_url,
            confidence=desc_confidence,
        )
        run_record["description_result"] = desc_result
        cache_status = "miss"
    run_record["cache"] = cache_status

    if check_confidence("description", desc_confidence, {"cache_key": cache_key}):
        low_stages.append("description")
    # Low confidence in any stage is reported as such; a missing FDA match
    # only adds a caveat, since no description is FDA-grounded yet.
    status = "low_confidence" if low_stages else "ok"
    if not grounded:
        low_stages.append("FDA verification")

    # 5. Spoken output
    label = brand_name or generic_name
    # TTS needs the sentence break before the caveat; models often drop it.
    spoken_description = description if description.endswith((".", "!", "?")) else f"{description}."
    spoken = f"{label}. {spoken_description} {build_spoken_caveat(low_stages)}".strip()

    run_record["outcome"] = "success"
    run_record["status"] = status
    run_record["final_spoken_text"] = spoken
    append_jsonl(config.RUN_LOG_PATH, run_record)

    return {
        "status": status,
        "brand_name": brand_name, "generic_name": generic_name, "dosage": dosage,
        "description": description, "grounded": grounded, "source_url": source_url,
        "warnings": low_stages, "spoken_text": spoken, "cache": cache_status,
    }
