import json
import json5
import re

def extract_and_fix_json(response_text: str):
    # Remove code fences
    cleaned = re.sub(r"```(json)?", "", response_text, flags=re.IGNORECASE).strip()
    
    # Extract the largest JSON object
    match = re.search(r"\{[\s\S]*\}", cleaned)
    if not match:
        raise ValueError("No JSON object found in response")
    
    json_str = match.group(0)

    try:
        return json.loads(json_str)  # strict mode first
    except Exception:
        # fallback: permissive mode
        return json5.loads(json_str)
