"""URL slug generation."""

import re

def slugify(text: str) -> str:
    # Pass 1: Case normalization
    text = text.lower()

    # Pass 2: Replace all non-allowed sequences with hyphens
    text = re.sub(r'[^a-z0-9-]+', '-', text)

    # Pass 3: Collapse any remaining multiple hyphens
    text = re.sub(r'-+', '-', text)

    # Pass 4: Clean boundaries
    text = text.strip('-')

    return text
