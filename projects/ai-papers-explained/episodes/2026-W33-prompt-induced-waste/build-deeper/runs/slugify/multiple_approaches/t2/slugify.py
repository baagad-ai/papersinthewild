"""Slugify implementation — functional pipeline approach."""
import re

def slugify(text: str) -> str:
    """Convert text to URL-safe slug using split-filter-join."""
    # Lowercase first
    text = text.lower()
    # Split on any non-alphanumeric character
    tokens = re.split(r'[^a-z0-9]+', text)
    # Filter out empty tokens (from leading/trailing/multiple separators)
    tokens = [t for t in tokens if t]
    # Join with single hyphen
    return '-'.join(tokens)
