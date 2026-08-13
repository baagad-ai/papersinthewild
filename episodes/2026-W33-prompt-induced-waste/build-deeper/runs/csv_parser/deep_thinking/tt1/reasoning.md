# Deep Reasoning: csv_to_markdown() Implementation

## Problem Restatement

I need to implement a `csv_to_markdown(csv_text: str) -> str` function that converts CSV-formatted text into GitHub-flavored Markdown tables. This is a parsing and transformation problem with specific quoting rules.

## Core Requirements Analysis

1. **CSV Parsing**: Must handle quoted cells that preserve internal commas
2. **Markdown Formatting**: Convert to pipe-separated table format
3. **Whitespace Handling**: Trim whitespace around cells
4. **Special Characters**: Escape pipe characters in cell content
5. **Structure**: Header row, separator row, data rows
6. **Edge Cases**: Empty input, header-only input, single column

## Detailed Edge Case Enumeration

### Input Structure Cases:
1. **Empty string**: `""` → `""` (no transformation)
2. **Header only**: `"a,b,c"` → header + separator (no data rows)
3. **Single column**: `"only\na\nb"` → single column table
4. **Multiple columns, multiple rows**: Standard case

### Cell Content Cases:
5. **Quoted with comma**: `"`Alice, B"` → preserves the comma inside
6. **Quoted without comma**: `"`simple""` → quotes removed, content preserved
7. **Unquoted with spaces**: `" a, b, c"` → trimmed to `"a | b | c"`
8. **Pipe in content**: `"foo|bar"` → escaped to `"foo\|bar"`
9. **Mixed quoted/unquoted**: `"a,"b c",d"` → handle correctly

### CSV Parsing Edge Cases:
10. **Empty fields**: `"a,,c"` → empty cell in middle
11. **Trailing comma**: `"a,b,"` → empty field at end
12. **Leading comma**: `",a,b"` → empty field at start
13. **Comma at start and end**: `",a,"` → empty fields at boundaries
14. **Multiple consecutive commas**: `"a,,,b"` → multiple empty fields
15. **Quotes inside quotes**: `"`""` → single quote (escaped quote)
16. **Empty quoted cell**: `""""` → empty string

## Algorithm Design - Step by Step

### Phase 1: CSV Parsing

This is the most critical part. I need a proper CSV parser that handles quoted cells. A simple `split(',')` won't work.

**State Machine Approach:**
I'll iterate through characters and maintain state:
- **Normal mode**: Outside quotes, comma separates cells
- **Quote mode**: Inside quotes, commas are literal
- **Quote escape**: Two consecutive quotes `""` represent one quote

**State Transitions:**
- Start in Normal mode
- On `"` in Normal mode → switch to Quote mode
- On `"` in Quote mode → next char determines if it's escaped quote or end of quote
- On `,` in Normal mode → cell boundary
- On `,` in Quote mode → literal comma, not a boundary

### Phase 2: Cell Processing

For each parsed cell:
1. **Trim whitespace**: `cell.strip()`
2. **Handle quoted cells**: Remove outer quotes if present
3. **Escape pipes**: Replace `|` with `\|`
4. **Handle escaped quotes**: Replace `""` with `"`

### Phase 3: Table Structure Construction

1. **Header row**: First row of CSV → `| col1 | col2 | ... |`
2. **Separator row**: Always present (even for header-only) → `| --- | --- | ... |`
3. **Data rows**: Remaining CSV rows → same format as header

## Detailed Algorithm Design

### CSV Parser State Machine

```python
def parse_csv_line(line: str) -> List[str]:
    cells = []
    current_cell = []
    in_quotes = False

    i = 0
    while i < len(line):
        char = line[i]

        if in_quotes:
            if char == '"':
                # Check if next char is also quote (escaped quote)
                if i + 1 < len(line) and line[i + 1] == '"':
                    current_cell.append('"')  # Escaped quote
                    i += 2
                    continue
                else:
                    # End of quoted section
                    in_quotes = False
            else:
                current_cell.append(char)  # Literal character in quotes
        else:
            if char == '"':
                # Start of quoted section
                in_quotes = True
            elif char == ',':
                # Cell boundary
                cell_content = ''.join(current_cell).strip()
                cells.append(cell_content)
                current_cell = []
            else:
                current_cell.append(char)

        i += 1

    # Don't forget the last cell
    cell_content = ''.join(current_cell).strip()
    cells.append(cell_content)

    return cells
```

### Markdown Table Builder

```python
def build_markdown_table(rows: List[List[str]]) -> str:
    if not rows:
        return ""

    # Process all cells: escape pipes, handle quoted content
    processed_rows = []
    for row in rows:
        processed_cells = []
        for cell in row:
            # Escape pipes
            cell = cell.replace('|', '\\|')
            processed_cells.append(cell)
        processed_rows.append(processed_cells)

    # Build markdown
    output_lines = []

    # Header row
    header = processed_rows[0]
    output_lines.append('| ' + ' | '.join(header) + ' |')

    # Separator row
    num_cols = len(header)
    separator = '| ' + ' | '.join(['---'] * num_cols) + ' |'
    output_lines.append(separator)

    # Data rows
    for row in processed_rows[1:]:
        output_lines.append('| ' + ' | '.join(row) + ' |')

    return '\n'.join(output_lines)
```

### Edge Case Handling Analysis

Let me trace through the edge cases:

#### Empty Input: `""`
1. Split lines: `[""]`
2. Parse first line: `[""]` (single empty cell)
3. But wait - this should return `""`, not a table
- **FIX**: Check if input is empty string upfront

#### Header Only: `"a,b,c"`
1. Split lines: `["a,b,c"]`
2. Parse: `[["a", "b", "c"]]`
3. Build: header + separator only
4. No data rows to iterate over
✓ Correct

#### Single Column: `"only\na\nb"`
1. Split lines: `["only", "a", "b"]`
2. Parse each: `[["only"], ["a"], ["b"]]`
3. Build: single column format
✓ Correct

#### Quoted Cell: `'name,city\n"Alice, B","Mumbai, MH"'`
1. Split lines: `['name,city', '"Alice, B","Mumbai, MH"']`
2. Parse header: `["name", "city"]`
3. Parse data line:
   - Start with "Alice"
   - Enter quote mode
   - Append "Alice, B" (comma is literal in quotes)
   - Exit quote mode at closing "
   - Next char is , (cell boundary)
   - Start "Mumbai, MH"
   - Similar parsing
   - Result: `["Alice, B", "Mumbai, MH"]`
✓ Commas preserved

#### Pipe Escaping: `"a,b\nfoo|bar,baz"`
1. Parse: `[["a", "b"], ["foo|bar", "baz"]]`
2. Process cells: `"foo|bar"` → `"foo\\|bar"` (escaped for markdown)
3. Build: `"| a | b |\n| --- | --- |\n| foo\\|bar | baz |"`
✓ Pipes escaped

#### Whitespace Trimming: `"a, b, c\n1, 2, 3"`
1. Parse: `[["a", "b", "c"], ["1", "2", "3"]]` (whitespace trimmed during parsing)
2. Build with proper spacing
✓ Handles correctly

#### Three Columns Three Rows:
1. Parse 4 rows total (1 header + 3 data)
2. Build: header + separator + 3 data = 5 lines total
✓ Correct line count

## Potential Failure Modes and Mitigations

1. **Malformed CSV**: What if quotes are unbalanced?
   - The state machine would stay in quote mode to end
   - For this exercise, assuming well-formed input per test cases

2. **Empty lines in input**: What if input has blank lines?
   - `split('\n')` would include them
   - Parsing empty line: `[[""]]` (single empty cell)
   - This might create unwanted rows
   - **FIX**: Filter out empty lines after splitting

3. **Windows vs Unix line endings**: `\r\n` vs `\n`
   - Could leave `\r` in cell content
   - **FIX**: Normalize line endings first

4. **Very wide tables**: Performance concerns
   - String concatenation in loops is slow
   - **FIX**: Use list comprehension and join (already doing this)

5. **Unicode content**: Non-ASCII characters
   - Python 3 handles Unicode strings natively
   - Should work transparently

## Final Algorithm Structure

```python
def csv_to_markdown(csv_text: str) -> str:
    # Edge case: empty input
    if not csv_text or not csv_text.strip():
        return ""

    # Normalize line endings
    csv_text = csv_text.replace('\r\n', '\n').replace('\r', '\n')

    # Split into lines, filter empty lines
    lines = [line for line in csv_text.split('\n') if line.strip()]

    if not lines:
        return ""

    # Parse each line into cells
    rows = []
    for line in lines:
        cells = parse_csv_line(line)
        rows.append(cells)

    # Build markdown table
    return build_markdown_table(rows)
```

This comprehensive approach handles all the test cases and edge cases identified above. The state machine for CSV parsing is robust and handles quoted cells correctly, while the markdown builder properly formats the output table.

## Complexity Analysis

- **Time Complexity**: O(n) where n is total characters in input
  - Each character is processed once during parsing
  - Each cell is processed once during markdown building
- **Space Complexity**: O(n) for storing intermediate rows and cells
- **String Operations**: Using lists and join() to avoid quadratic concatenation

This is efficient and correct for the given problem constraints.
