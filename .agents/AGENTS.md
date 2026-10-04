# Medicine Scanner - Agent Instructions

## Project Overview

Medicine Scanner is a Python application that uses OCR,
LLM-based parsing, medicine descriptions, confidence handling,
caching, and text-to-speech functionality.

## Project Structure

- `main.py` - Application entry point
- `ocr_engines.py` - OCR processing
- `llm_parse.py` - LLM parsing
- `description_agent.py` - Medicine description generation
- `confidence_handler.py` - Confidence evaluation
- `obsidian_cache.py` - Cache management
- `tts_output.py` - Text-to-speech functionality
- `utils.py` - Shared utilities
- `benchmark_ocr.py` - OCR benchmarking

## General Rules

1. Read relevant files before making recommendations.
2. Do not modify files unless explicitly requested.
3. Preserve existing architecture unless there is a strong reason
   to recommend a change.
4. Do not expose secrets stored in `.env`.
5. Do not commit `.venv`.
6. Do not fabricate medical information.
7. Clearly distinguish between observed code behavior and assumptions.
8. Prefer small, reversible changes.
9. Run appropriate tests after modifying code.
10. Explain potentially breaking changes before applying them.

## Code Standards

- Follow PEP 8 where practical.
- Prefer clear and maintainable Python.
- Avoid unnecessary dependencies.
- Use type hints for new functions where appropriate.
- Handle errors explicitly.