# Task — `slugify(text: str) -> str`

## What to build

A single Python function `slugify(text: str) -> str` that converts arbitrary text into a URL-safe slug.

## Acceptance criteria (verbatim)

The function MUST pass `test_slugify.py`. The tests check:

1. Lowercases all ASCII letters
2. Replaces runs of whitespace with a single hyphen
3. Strips leading and trailing hyphens
4. Collapses repeated hyphens into one
5. Removes characters that are not `[a-z0-9-]`
6. Returns `""` for empty or all-symbol input
7. Handles Unicode by ASCII-folding (e.g. `café` → `cafe`) — *bonus, may skip if too complex*
8. Preserves digits

## Constraints

- Python 3.11+
- Standard library only (no `python-slugify` import)
- Single file: `slugify.py`
- Function must be pure (no I/O, no globals)
- Implementation ≤ 30 lines

## Files

- `slugify.py` — stub with `def slugify(text: str) -> str: ...`
- `test_slugify.py` — 8 unit tests, all currently failing

## How to verify

```bash
cd build/task
python -m pytest test_slugify.py -v
```

All 8 tests must pass.
