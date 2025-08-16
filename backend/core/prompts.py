STORY_PROMPT = """You are an expert story writer. Create a choose-your-own-adventure story for the given theme.

CRITICAL: Return ONLY valid JSON. No explanations, no comments, no extra text.

Requirements:
- Compelling title
- Root node with 2-3 options  
- 3-4 levels deep branching paths
- At least one winning ending (isWinningEnding: true)
- At least one losing ending (isWinningEnding: false)
- Ending nodes have empty options array: []

JSON Schema (follow exactly):
{{
    "title": "Your Story Title",
    "rootNode": {{
        "content": "Starting scenario description (2-3 sentences)",
        "isEnding": false,
        "isWinningEnding": false,
        "options": [
            {{
                "text": "Choice description",
                "nextNode": {{
                    "content": "Consequence of this choice",
                    "isEnding": true,
                    "isWinningEnding": true,
                    "options": []
                }}
            }},
            {{
                "text": "Another choice",
                "nextNode": {{
                    "content": "Different consequence", 
                    "isEnding": false,
                    "isWinningEnding": false,
                    "options": [
                        {{
                            "text": "Sub-choice A",
                            "nextNode": {{
                                "content": "Final outcome A",
                                "isEnding": true,
                                "isWinningEnding": false,
                                "options": []
                            }}
                        }}
                    ]
                }}
            }}
        ]
    }}
}}

Rules:
- isEnding: true = story ends here
- isEnding: false = story continues  
- isWinningEnding: true = positive outcome
- isWinningEnding: false = negative outcome
- Ending nodes must have "options": []
- Non-ending nodes must have 2-3 options

Theme: {format_instructions}

Return valid JSON only:"""