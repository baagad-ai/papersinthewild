"""URL-safe slugifier. Stdlib only."""
import re

_NON_ALNUM_RUN = re.compile(r'[^a-z0-9]+')


def slugify(text: str) -> str:
    """Convert text to a URL-safe slug.

    Algorithm:
      1. Lowercase ASCII.
      2. Replace every run of non-[a-z0-9] characters with a single hyphen.
      3. Strip leading and trailing hyphens.

    Edge cases handled:
      - Empty string -> empty string.
      - All-symbol input -> empty string.
      - Whitespace (space, tab, newline) collapses to one hyphen.
      - Repeated hyphens collapse to one.
      - Digits preserved.

    Args:
        text: Arbitrary input string.

    Returns:
        URL-safe slug; possibly empty.
    """
    if not isinstance(text, str):
        raise TypeError(f"text must be str, got {type(text).__name__}")
    lowered = text.lower()
    hyphenated = _NON_ALNUM_RUN.sub('-', lowered)
    return hyphenated.strip('-')
