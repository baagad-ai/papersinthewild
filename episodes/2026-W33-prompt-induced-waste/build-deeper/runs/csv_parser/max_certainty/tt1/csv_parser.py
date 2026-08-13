"""CSV to Markdown converter - pure string processing."""

def csv_to_markdown(csv_text: str) -> str:
    if not csv_text or not csv_text.strip():
        return ""

    # Parse CSV rows with quoted field support
    rows = []
    for line in csv_text.strip().split('\n'):
        if not line:
            continue
        cells = parse_csv_line(line)
        if cells:
            processed_cells = []
            for cell in cells:
                # Trim whitespace
                cell = cell.strip()
                # Remove surrounding quotes if present
                if len(cell) >= 2 and cell.startswith('"') and cell.endswith('"'):
                    cell = cell[1:-1]
                # Escape pipe characters for Markdown
                cell = cell.replace('|', '\\|')
                processed_cells.append(cell)
            rows.append(processed_cells)

    if not rows:
        return ""

    # Build markdown table
    header = rows[0]
    num_cols = len(header)

    # Header row
    md_lines = ["| " + " | ".join(header) + " |"]

    # Separator row
    separator = " | ".join(["---"] * num_cols)
    md_lines.append("| " + separator + " |")

    # Data rows
    for row in rows[1:]:
        md_lines.append("| " + " | ".join(row) + " |")

    return "\n".join(md_lines)


def parse_csv_line(line: str) -> list:
    """Parse a CSV line, handling quoted fields with commas."""
    cells = []
    current = []
    in_quotes = False

    i = 0
    while i < len(line):
        char = line[i]

        if char == '"':
            # Handle escaped quotes
            if i + 1 < len(line) and line[i + 1] == '"':
                current.append('"')
                i += 2
            else:
                in_quotes = not in_quotes
                i += 1
        elif char == ',' and not in_quotes:
            cells.append(''.join(current))
            current = []
            i += 1
        else:
            current.append(char)
            i += 1

    # Don't forget the last cell
    cells.append(''.join(current))

    return cells
