# Task - `csv_to_markdown(csv_text: str) -> str` *(medium)*

## What to build

A function `csv_to_markdown(csv_text: str) -> str` that converts CSV-formatted text into a GitHub-flavored Markdown table. Pure string processing, no external CSV library.

## Acceptance criteria

1. First line of CSV = header row → Markdown header row
2. Subsequent lines = data rows → Markdown data rows
3. Cells are split on commas. Quoted cells (`"a,b"`) preserve internal commas.
4. Empty input → returns `""`
5. Header-only input → returns just the header + separator
6. Whitespace around cells is trimmed (`a, b, c` → `a | b | c`)
7. Pipe characters inside cells are escaped as `\|` per Markdown spec
8. Output rows are joined by `\n`, columns by ` | `, separator row uses `---`

## Examples

Input:
```
name,age,city
Alice,30,Bangalore
Bob,25,"Mumbai, MH"
```

Output:
```
| name | age | city |
| --- | --- | --- |
| Alice | 30 | Bangalore |
| Bob | 25 | Mumbai, MH |
```

## Constraints

- Python 3.11+ · stdlib only · single file `csv_parser.py` · ≤60 lines
- Function must be pure

## Files

- `csv_parser.py` - stub with `def csv_to_markdown(csv_text: str) -> str: ...`
- `test_csv_parser.py` - 8 tests, all currently failing

## Verify

```bash
python -m pytest test_csv_parser.py -v
```
