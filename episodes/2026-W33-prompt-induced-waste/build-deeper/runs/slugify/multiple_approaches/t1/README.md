# Task — `slugify(text: str) -> str` *(trivial)*

## What to build

A single Python function `slugify(text: str) -> str` that converts arbitrary text into a URL-safe slug.

## Acceptance criteria

The function MUST pass `test_slugify.py`. Behavior:
1. Lowercases ASCII letters
2. Replaces runs of whitespace with a single hyphen
3. Strips leading/trailing hyphens
4. Collapses repeated hyphens into one
5. Removes characters that are not `[a-z0-9-]`
6. Returns `""` for empty or all-symbol input
7. Preserves digits

## Constraints

- Python 3.11+ · stdlib only · single file `slugify.py` · pure function · ≤30 lines

## Files

- `slugify.py` — stub
- `test_slugify.py` — 8 unit tests (all currently fail)

## Verify

```bash
python -m pytest test_slugify.py -v
```
