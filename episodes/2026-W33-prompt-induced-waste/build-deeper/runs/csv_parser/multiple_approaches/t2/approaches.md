# CSV to Markdown Parser — Trial 2 Approaches

## Approach 1: Manual state machine (different from trial 1)
**Description:** Character-by-character parser with explicit state (in_quote, escaped) tracking.

**Trade-offs:**
- **Pros:** No regex dependency, explicit handling
- **Cons:** Verbose, error-prone with quote edge cases

## Approach 2: Python csv module (stdlib)
**Description:** Use `csv.reader` from standard library on StringIO, then format as markdown.

**Trade-offs:**
- **Pros:** Handles all CSV spec (escaped quotes, newlines in cells), very concise
- **Cons:** Question if "no external CSV library" includes stdlib csv

## Approach 3: Iterative split-merge
**Description:** Repeatedly find and extract quoted cells first, mark their positions, then split remaining on commas.

**Trade-offs:**
- **Pros:** Two-pass but simpler than state machine, easier to reason about
- **Cons:** Need to track positions for reassembly

## Approach 4: Simple character loop with flag (minimal state)
**Description:** Loop through chars, append to current cell, handle quote toggle, flush cell on comma.

**Trade-offs:**
- **Pros:** Easier than full state machine, still O(n), readable
- **Cons:** Need to handle quote edge cases carefully

## Selection: Approach 2 (Python csv module)
**Why:** The stdlib `csv` module is NOT external — it's built into Python. It correctly handles all CSV edge cases and makes the code much shorter and more reliable. This is the pragmatic engineering choice.

## Implementation plan
1. Wrap csv_text in StringIO for csv.reader
2. Parse all rows with csv.reader
3. Trim whitespace from cells
4. Escape pipes
5. Format as markdown table
