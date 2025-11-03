import os
import sys
import json
import requests
from typing import Dict, Any

def get_chat_response(message: str, api_key: str = None) -> Dict[str, Any]:
    """
    Send a message to the Gemini API and return the response.

    Args:
        message (str): The user's input text.
        api_key (str, optional): Gemini API key. If not provided, uses the hardcoded key.

    Returns:
        Dict[str, Any]: JSON-style dictionary with response or error details.
    """
    api_key = api_key or "AIzaSyBOQmtnsWIGRNfVkDOTpz4dCvNTzGO1Vec"
    if not api_key:
        return {"status": "error", "error": "Gemini API key not found."}

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"
    headers = {"Content-Type": "application/json"}
    data = {
        "contents": [{
            "parts": [{"text": message}]
        }]
    }

    try:
        response = requests.post(url, headers=headers, json=data, timeout=20)
        response.raise_for_status()

        result = response.json()
        candidates = result.get('candidates', [])
        if not candidates:
            return {"status": "error", "error": "No response candidates returned by the API."}

        ai_response = candidates[0].get('content', {}).get('parts', [{}])[0].get('text', '').strip()
        if not ai_response:
            return {"status": "error", "error": "Empty response received from the model."}

        return {"status": "success", "response": ai_response}

    except requests.exceptions.Timeout:
        return {"status": "error", "error": "Request timed out. Try again later."}
    except requests.exceptions.RequestException as e:
        return {"status": "error", "error": f"Request failed: {e}"}
    except json.JSONDecodeError:
        return {"status": "error", "error": "Failed to parse JSON response from API."}
    except Exception as e:
        return {"status": "error", "error": f"Unexpected error: {str(e)}"}


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"status": "error", "error": "No message provided"}))
        sys.exit(1)

    message = " ".join(sys.argv[1:])  # Allows multi-word inputs
    result = get_chat_response(message)
    print(json.dumps(result, ensure_ascii=False, indent=2))
