"""URL slug generation."""

import re

def slugify(text: str) -> str:
    # Step 1: Lowercase all characters
    text = text.lower()

    # Step 2: Replace all non-alphanumeric characters (except hyphen) with hyphens
    # This treats symbols like whitespace separators
    text = re.sub(r'[^a-z0-9-]+', '-', text)

    # Step 3: Collapse multiple hyphens into one
    text = re.sub(r'-+', '-', text)

    # Step 4: Strip leading and trailing hyphens
    text = text.strip('-')

    return text
