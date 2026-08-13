"""Slugify implementation — regex-based approach."""
import re

def slugify(text: str) -> str:
    """Convert text to URL-safe slug."""
    # Lowercase first
    text = text.lower()
    # Replace any whitespace sequence with single hyphen
    text = re.sub(r'\s+', '-', text)
    # Collapse multiple hyphens into one
    text = re.sub(r'-+', '-', text)
    # Replace non-alphanumeric chars with hyphen (then collapse later)
    text = re.sub(r'[^a-z0-9]+', '-', text)
    # Strip leading/trailing hyphens
    text = text.strip('-')
    return text
