# Slugify Implementation Approaches — Trial 2

## Approach 1: Character-by-character state machine
**Description:** Build output by iterating each character, tracking previous character type (alnum, hyphen, other) to decide whether to append, skip, or add hyphen.

**Trade-offs:**
- **Pros:** Single O(n) pass, no regex overhead, explicit handling of all cases
- **Cons:** Verbose (~20-25 lines), more branches to test, harder to read

## Approach 2: Functional pipeline (split + filter + join)
**Description:** Split text on all non-alphanumeric characters into tokens, filter out empty tokens, then rejoin with hyphens.

**Trade-offs:**
- **Pros:** Clean functional style, leverages str.isalnum(), elegant
- **Cons:** May need special handling for original hyphens, edge cases around leading/trailing

## Approach 3: Chain of str.replace + regex hybrid
**Description:** Use str.replace() for simple cases (whitespace normalization), then regex for complex cleanup.

**Trade-offs:**
- **Pros:** Mix of simple string ops and regex where needed
- **Cons:** Less consistent than pure regex, harder to maintain

## Approach 4: Single regex with callback (advanced)
**Description:** Use re.sub() with a callable to handle all transformations in one pass.

**Trade-offs:**
- **Pros:** Most powerful, single-pass regex
- **Cons:** Overkill for this task, callback adds complexity

## Selection: Approach 2 (Functional pipeline)
**Why:** The split-filter-join pattern is idiomatic Python, very readable, and naturally handles the collapse behavior through empty token filtering. Different from trial 1's pure regex approach.

## Implementation plan
1. Lowercase text
2. Use re.split() on non-alphanumeric to get tokens
3. Filter out empty tokens
4. Join with single hyphen
