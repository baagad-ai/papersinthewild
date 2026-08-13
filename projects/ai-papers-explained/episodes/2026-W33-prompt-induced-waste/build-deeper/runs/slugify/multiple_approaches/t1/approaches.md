# Slugify Implementation Approaches

## Approach 1: Regex-based (Single-pass pattern substitution)
**Description:** Use regex patterns sequentially to transform the text: lowercase, replace all whitespace sequences with hyphen, collapse multiple hyphens, strip non-alphanumeric chars, and trim edges.

**Trade-offs:**
- **Pros:** Concise (~5-10 lines), easy to read, standard practice for slug generation
- **Cons:** Multiple regex passes (4-5 patterns), slightly less performant than manual char-by-char

## Approach 2: State machine character iteration
**Description:** Iterate through characters manually, tracking state (last_was_hyphen, in_whitespace, etc.) to build output string one char at a time.

**Trade-offs:**
- **Pros:** Single-pass O(n) performance, precise control, no regex overhead
- **Cons:** More verbose (~25-30 lines), harder to read/debug, easy to miss edge cases

## Approach 3: Split-filter-join pipeline
**Description:** Use str.split() to break on whitespace, filter each token through cleaning function, then join with hyphens.

**Trade-offs:**
- **Pros:** Very readable, leverages Python's built-in string handling well
- **Cons:** Doesn't handle hyphens in original text naturally, requires pre/post processing for edge cases

## Approach 4: Unicode normalization + regex (production-style)
**Description:** Use unicodedata.normalize('NFKD') to decompose characters, then encode/decode to ASCII, then apply regex cleanup.

**Trade-offs:**
- **Pros:** Handles internationalization (é→e, ö→o), production-ready
- **Cons:** Overkill for ASCII-only requirement, adds ~3 lines for NFKD normalization

## Selection: Approach 1 (Regex-based)
**Why:** The task requires ASCII-only handling and ≤30 lines. Approach 1 is the most readable and maintainable, fits comfortably in 10-15 lines, and matches how Django/Python's slugify utilities work. The 4-5 regex passes are negligible for typical string lengths.

## Implementation plan
1. Lowercase text
2. Replace any whitespace sequence (\s+) with "-"
3. Collapse multiple hyphens into one
4. Remove any char not [a-z0-9-]
5. Strip leading/trailing hyphens
