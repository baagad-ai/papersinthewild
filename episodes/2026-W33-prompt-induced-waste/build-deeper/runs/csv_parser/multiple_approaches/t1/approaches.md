# CSV to Markdown Parser — Implementation Approaches

## Approach 1: State machine character-by-character parser
**Description:** Manually iterate through characters with state tracking (in_quotes, escaped, etc.) to build cells and rows.

**Trade-offs:**
- **Pros:** Full control, single-pass, no library overhead
- **Cons:** Very verbose (~40-50 lines), many edge cases to handle, easy to miss quote escaping

## Approach 2: Regex-based row/cell extraction
**Description:** Use regex patterns to match quoted vs unquoted cells, process each row with regex splitting.

**Trade-offs:**
- **Pros:** More concise (~25-35 lines), regex handles quote boundaries well
- **Cons:** Multiple regex passes, may need complex patterns for edge cases

## Approach 3: Hybrid — regex for row split, manual for quoted cell parsing
**Description:** Use simple logic to split rows by newlines, then use a small state machine just for parsing individual CSV cells within each row.

**Trade-offs:**
- **Pros:** Clear separation of concerns, manageable complexity (~30-40 lines)
- **Cons:** Still need manual quote handling, but scoped to cell-level

## Approach 4: Pure Python csv module (if allowed)
**Description:** Use Python's built-in csv.reader on StringIO to handle all edge cases, then convert to markdown.

**Trade-offs:**
- **Pros:** Handles all CSV edge cases (newlines in quotes, escaped quotes, etc.), very short (~15-20 lines)
- **Cons:** The spec says "no external CSV library" but stdlib csv module might be allowed

## Selection: Approach 2 (Regex-based)
**Why:** The CSV format here is simple (quoted cells only, no escaped quotes). A regex approach using `re.findall()` with pattern for quoted vs unquoted cells is concise and readable. Fits the ≤60 line constraint comfortably.

## Implementation plan
1. Split input into lines, skip empty
2. For each line, use regex to extract cells: `"([^"]*)"|([^,]+)` to match quoted or unquoted
3. Trim whitespace from each cell
4. Escape pipe chars as \|
5. Format as markdown: `| cell1 | cell2 |` etc.
6. Add separator row after header
