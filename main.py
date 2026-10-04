"""
Local prototype pipeline (handoff Section 5).

Run:
    python main.py

Controls:
    SPACE  - capture frame and run the pipeline on it
    q      - quit

Requires: run benchmark_ocr.py at least once first, so config/ocr_engine_choice.json
exists (falls back to 'easyocr' if missing, with a warning).
"""
import json
import sys
import time
from pathlib import Path

import cv2

import config
from ocr_engines import run_ocr
from llm_parse import parse_medicine_text
from obsidian_cache import ObsidianCache
from description_agent import get_description
from confidence_handler import check_confidence, build_spoken_caveat
from tts_output import speak
from utils import normalize_key, append_jsonl


def load_ocr_engine_choice() -> str:
    if config.OCR_ENGINE_CHOICE_PATH.exists():
        data = json.loads(config.OCR_ENGINE_CHOICE_PATH.read_text(encoding="utf-8"))
        return data.get("engine", "paddleocr")
    print("⚠️  No benchmark result found (run benchmark_ocr.py first). Defaulting to paddleocr.")
    return "paddleocr"

def process_frame(image_path: str, engine_name: str, cache: ObsidianCache) -> None:
    run_record = {"image_path": image_path, "ocr_engine": engine_name}
    low_stages = []

    # 1. OCR
    print("Running OCR...")
    raw_text, ocr_confidence = run_ocr(engine_name, image_path)
    run_record["raw_ocr_text"] = raw_text
    run_record["ocr_confidence"] = ocr_confidence
    if check_confidence("ocr", ocr_confidence, {"image_path": image_path}):
        low_stages.append("OCR")

    if not raw_text.strip():
        speak("I couldn't read any text on that packaging. Please try again with better lighting or a closer shot.")
        run_record["outcome"] = "no_text_detected"
        append_jsonl(config.RUN_LOG_PATH, run_record)
        return

    # 2. LLM parse
    print("Parsing extracted text...")
    parsed = parse_medicine_text(raw_text)
    run_record["parsed"] = parsed
    if check_confidence("parse", parsed.get("confidence", 0.0), {"parsed": parsed}):
        low_stages.append("name extraction")

    generic_name = parsed.get("generic_name")
    brand_name = parsed.get("brand_name")
    dosage = parsed.get("dosage")

    if not generic_name and not brand_name:
        speak("I read some text but couldn't identify a medicine name from it. Please try again.")
        run_record["outcome"] = "parse_failed"
        append_jsonl(config.RUN_LOG_PATH, run_record)
        return

    # 3. Cache lookup
    cache_key = normalize_key(generic_name or "", brand_name or "", dosage or "")
    cached = cache.get(cache_key)

    if cached:
        print(f"Cache HIT ({cache_key}) — skipping description agent call.")
        description = cached.get("description", "")
        grounded = cached.get("grounded", False)
        desc_confidence = cached.get("confidence", 0.0)
        run_record["cache"] = "hit"
    else:
        print(f"Cache MISS ({cache_key}) — calling description agent...")
        desc_result = get_description(generic_name or "", brand_name or "", dosage or "")
        description = desc_result["description"]
        grounded = desc_result["grounded"]
        desc_confidence = desc_result["confidence"]
        cache.set(
            cache_key=cache_key,
            generic_name=generic_name or "",
            brand_name=brand_name or "",
            dosage=dosage or "",
            description=description,
            grounded=grounded,
            source_url=desc_result.get("source_url"),
            confidence=desc_confidence,
        )
        run_record["cache"] = "miss"
        run_record["description_result"] = desc_result

    if check_confidence("description", desc_confidence, {"cache_key": cache_key}):
        low_stages.append("description")
    if not grounded:
        low_stages.append("FDA verification")

    # 4. Output
    label = brand_name or generic_name or "Unidentified medicine"
    caveat = build_spoken_caveat(low_stages)
    spoken = f"{label}. {description} {caveat}".strip()

    print(f"\n--- Result ---\nBrand: {brand_name}\nGeneric: {generic_name}\nDosage: {dosage}")
    print(f"Description: {description}")
    print(f"Grounded in PH FDA source: {grounded}")

    speak(spoken)

    run_record["outcome"] = "success"
    run_record["final_spoken_text"] = spoken
    append_jsonl(config.RUN_LOG_PATH, run_record)


def main():
    engine_name = load_ocr_engine_choice()
    print(f"Using OCR engine: {engine_name}")
    cache = ObsidianCache()

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Could not open webcam. Exiting.")
        sys.exit(1)

    print("Press SPACE to capture and identify, or 'q' to quit.")
    capture_dir = Path("captures")
    capture_dir.mkdir(exist_ok=True)

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                print("Failed to read frame from webcam.")
                break

            cv2.imshow("Medicine Scanner (SPACE=capture, q=quit)", frame)
            key = cv2.waitKey(1) & 0xFF

            if key == ord("q"):
                break
            elif key == ord(" "):
                image_path = str(capture_dir / f"capture_{int(time.time())}.jpg")
                cv2.imwrite(image_path, frame)
                print(f"\nCaptured {image_path}")
                try:
                    process_frame(image_path, engine_name, cache)
                except Exception as e:
                    print(f"Pipeline error: {e}")
                print("\nPress SPACE to capture again, or 'q' to quit.")
    finally:
        cap.release()
        cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
