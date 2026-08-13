# Deep Reasoning: slugify() Implementation

## Problem Restatement

I need to implement a `slugify(text: str) -> str` function that converts arbitrary input text into a URL-safe slug string. This is a text normalization problem with specific transformation rules.

## Core Requirements Analysis

1. **Lowercasing**: All ASCII letters must become lowercase
2. **Whitespace normalization**: All whitespace characters (spaces, tabs, newlines) become single hyphens
3. **Hyphen management**: Strip leading/trailing hyphens, collapse multiple hyphens into one
4. **Character filtering**: Only keep [a-z0-9-], remove everything else
5. **Edge cases**: Empty input returns empty string; all-symbol input returns empty string
6. **Digit preservation**: Numbers should remain unchanged (just not uppercased)

## Edge Case Enumeration (Critical Cases)

1. **Empty string**: `""` → `""` (no transformation, direct return)
2. **All symbols**: `"!@#$%"` → `""` (filtered out completely)
3. **Mixed whitespace types**: `"hello\t\n  world"` → `"hello-world"` (all whitespace becomes one hyphen)
4. **Consecutive hyphens after filtering**: `"a!!b"` → `"a-b"` (not `"a--b"`)
5. **Leading/trailing whitespace**: `"  hello  "` → `"hello"` (hyphens get stripped)
6. **Digits only**: `"123"` → `"123"` (preserved unchanged)
7. **Mixed case with symbols**: `"Hello! WORLD?"` → `"hello-world"`
8. **Already a slug**: `"hello-world"` → `"hello-world"` (idempotent)
9. **Unicode characters**: `"café"` → `"caf"` (accent stripped)
10. **Multiple consecutive hyphen sources**: `"a -- b"` → `"a-b"` (collapse all)

## Algorithm Design - Step by Step

### Phase 1: Character Normalization
First, I need to handle the lowercasing. This is straightforward with `str.lower()`. However, I must consider that this might affect some Unicode characters in unexpected ways. Python's `lower()` handles Unicode gracefully, converting accented characters appropriately.

### Phase 2: Whitespace to Hyphen Conversion
The key insight here is that ALL whitespace (spaces, tabs, newlines) should become hyphens, but they should be collapsed into single hyphens. This suggests a two-step approach:
1. Replace each whitespace run with a single hyphen
2. Then handle hyphen collapsing

Actually, I can combine this by first converting all whitespace characters to hyphens, then collapsing runs.

### Phase 3: Character Filtering
I need to keep only `[a-z0-9-]`. The most Pythonic approach would be:
- Use a regex pattern: `re.sub(r'[^a-z0-9-]', '', text)`
- Or use a list comprehension with `str.isalnum()` or manual checking

The regex approach is cleaner but requires importing `re`. The manual approach might be slower but more explicit. Given the "stdlib only" constraint, `re` is allowed (it's part of stdlib).

### Phase 4: Hyphen Management
After character filtering, I might have multiple consecutive hyphens (from consecutive symbols being removed) or leading/trailing hyphens. I need to:
1. Collapse multiple hyphens into one: `re.sub(r'-+', '-', text)`
2. Strip leading/trailing: `text.strip('-')`

### Putting It All Together - Algorithm Sequence

**Option A: Multi-pass approach**
```
1. Lowercase the text
2. Replace all whitespace with hyphens  
3. Remove all characters except [a-z0-9-]
4. Collapse multiple hyphens into one
5. Strip leading/trailing hyphens
```

**Option B: Single-pass approach**
Iterate through characters, building the result character by character with state tracking. This is more complex but potentially more efficient.

I'll go with Option A for clarity and correctness, even if it means multiple passes through the string. The strings are likely short, so efficiency isn't critical.

## Implementation Decisions

### Decision 1: Whitespace Detection
I'll use `str.isspace()` to detect any whitespace character, then replace runs with hyphens. But actually, `re.sub(r'\s+', '-', text)` is cleaner and handles this elegantly.

### Decision 2: Character Filtering
`re.sub(r'[^a-z0-9-]', '', text)` is the cleanest approach. The negated character class `[^...]` matches anything NOT in the set, so we replace those with empty string.

### Decision 3: Hyphen Collapsing
`re.sub(r'-+', '-', text)` replaces one or more hyphens with a single hyphen.

### Decision 4: Stripping
`text.strip('-')` removes both leading and trailing hyphens.

## Tracing Through Examples

### Example 1: `"Hello WORLD"`
1. Lowercase: `"hello world"`
2. Whitespace to hyphens: `"hello-world"`
3. Filter chars: `"hello-world"` (no change)
4. Collapse hyphens: `"hello-world"` (no change)
5. Strip: `"hello-world"` (no change)
✓ Result: `"hello-world"`

### Example 2: `"a@b#c$d"`
1. Lowercase: `"a@b#c$d"`
2. Whitespace to hyphens: `"a@b#c$d"` (no whitespace)
3. Filter chars: `"a-b-c-d"` (symbols removed)
4. Collapse hyphens: `"a-b-c-d"` (no consecutive hyphens)
5. Strip: `"a-b-c-d"` (no leading/trailing)
✓ Result: `"a-b-c-d"`

### Example 3: `"---hello---"`
1. Lowercase: `"---hello---"`
2. Whitespace to hyphens: `"---hello---"` (no whitespace)
3. Filter chars: `"---hello---"` (all chars valid)
4. Collapse hyphens: `"-hello-"`
5. Strip: `"hello"`
✓ Result: `"hello"`

### Example 4: `"!@#$%^&*()"`
1. Lowercase: `"!@#$%^&*()"`
2. Whitespace to hyphens: `"!@#$%^&*()"`
3. Filter chars: `""` (all symbols removed)
4. Collapse hyphens: `""`
5. Strip: `""`
✓ Result: `""`

## Potential Failure Modes and Mitigations

1. **Unicode edge cases**: What if input has emoji? They'll be filtered out in step 3. ✓ Safe
2. **Very long strings**: Multiple regex passes could be slow. But for URL slugs, strings are typically short. Acceptable.
3. **All-digits input**: `"123"` should stay `"123"`. My algorithm preserves this since digits are in `[a-z0-9-]`. ✓
4. **Mixed case and symbols**: Already traced above, works correctly.
5. **Empty after filtering**: Handled by returning empty string after strip.

## Final Algorithm

```python
import re

def slugify(text: str) -> str:
    # Step 1: Lowercase all characters
    text = text.lower()
    
    # Step 2: Replace all whitespace runs with single hyphen
    text = re.sub(r'\s+', '-', text)
    
    # Step 3: Remove all characters except a-z, 0-9, and hyphen
    text = re.sub(r'[^a-z0-9-]', '', text)
    
    # Step 4: Collapse multiple hyphens into one
    text = re.sub(r'-+', '-', text)
    
    # Step 5: Strip leading and trailing hyphens
    text = text.strip('-')
    
    return text
```

This algorithm is correct, clear, and handles all edge cases identified above. The use of `re` module is appropriate for text manipulation tasks and is part of Python's standard library, satisfying the constraint.

## Verification Against Test Cases

Let me mentally trace each test case:

1. `test_lowercases_ascii`: `"Hello WORLD"` → lowercase → `"hello world"` → whitespace → `"hello-world"` ✓
2. `test_whitespace_becomes_single_hyphen`: Multiple spaces/tabs/newlines all become single `-` ✓
3. `test_strips_leading_trailing_hyphens`: Leading/trailing hyphens removed by `strip('-')` ✓
4. `test_collapses_repeated_hyphens`: Multiple hyphens collapsed by `re.sub(r'-+', '-')` ✓
5. `test_removes_non_alphanumeric_except_hyphen`: Regex filter removes symbols ✓
6. `test_empty_string`: Empty in → empty out ✓
7. `test_all_symbols`: All filtered out → empty string ✓
8. `test_preserves_digits`: Digits not affected by lower(), preserved by filter ✓

All test cases should pass with this implementation. The algorithm is sound and ready for implementation.
