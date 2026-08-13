"""CSV to Markdown table converter with state machine parsing."""

def csv_to_markdown(csv_text: str) -> str:
    # Handle empty input upfront
    if not csv_text or not csv_text.strip():
        return ""

    # Normalize line endings
    normalized = csv_text.replace('\r\n', '\n').replace('\r', '\n')

    # Get non-empty lines
    lines = [ln for ln in normalized.split('\n') if ln.strip()]
    if not lines:
        return ""

    # Parse all lines into cell matrices
    parsed_rows = [parse_line(ln) for ln in lines]

    # Convert to markdown format
    return construct_markdown(parsed_rows)

def parse_line(line: str):
    """Parse CSV line into cells using quote-aware state machine."""
    result = []
    current = []
    in_quote = False
    idx = 0

    while idx < len(line):
        ch = line[idx]

        if in_quote:
            # Inside quoted section
            if ch == '"':
                # Could be end of quote or escaped quote
                if idx + 1 < len(line) and line[idx + 1] == '"':
                    current.append('"')
                    idx += 2
                    continue
                else:
                    in_quote = False
            else:
                current.append(ch)
        else:
            # Outside quoted section
            if ch == '"':
                in_quote = True
            elif ch == ',':
                result.append(''.join(current).strip())
                current = []
            else:
                current.append(ch)

        idx += 1

    # Add final cell
    result.append(''.join(current).strip())
    return result

def construct_markdown(rows):
    """Build GitHub-flavored markdown table from parsed rows."""
    if not rows:
        return ""

    # Process all cells to escape pipes
    processed = []
    for row in rows:
        processed_row = [cell.replace('|', '\\|') for cell in row]
        processed.append(processed_row)

    # Build output lines
    output = []

    # Header
    header = processed[0]
    output.append('| ' + ' | '.join(header) + ' |')

    # Separator
    sep_count = len(header)
    output.append('| ' + ' | '.join(['---'] * sep_count) + ' |')

    # Data rows
    for row in processed[1:]:
        output.append('| ' + ' | '.join(row) + ' |')

    return '\n'.join(output)
