"""
Tiny helper for talking to a local Ollama server over HTTP.
Uses `requests` (already installed), so there's nothing new to download.
"""
import requests

import config


def chat(system: str, user: str, schema: dict | None = None, max_tokens: int = 300) -> str:
    """Send one chat turn and return the raw text reply.

    If `schema` is given, Ollama constrains the output to that JSON schema
    (much more reliable for small models); otherwise it just forces valid JSON.
    """
    payload = {
        "model": config.OLLAMA_MODEL,
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        "stream": False,
        "format": schema if schema else "json",
        "options": {"temperature": 0, "num_predict": max_tokens},
    }
    try:
        resp = requests.post(f"{config.OLLAMA_HOST}/api/chat", json=payload, timeout=180)
        resp.raise_for_status()
    except requests.ConnectionError:
        raise RuntimeError(
            f"Can't reach Ollama at {config.OLLAMA_HOST}. Is it running? "
            f"Try `ollama list` in a terminal, or open the Ollama app."
        )
    except requests.HTTPError as e:
        raise RuntimeError(
            f"Ollama returned an error: {e}. Check that the model "
            f"'{config.OLLAMA_MODEL}' appears in `ollama list`."
        )
    return resp.json()["message"]["content"]