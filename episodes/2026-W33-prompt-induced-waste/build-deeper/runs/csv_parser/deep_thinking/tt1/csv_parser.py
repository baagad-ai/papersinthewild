"""CSV to Markdown table converter."""

def csv_to_markdown(csv_text: str) -> str:
    # Edge case: empty input
    if not csv_text or not csv_text.strip():
        return ""

    # Normalize line endings and split into lines
    csv_text = csv_text.replace('\r\n', '\n').replace('\r', '\n')
    lines = [line for line in csv_text.split('\n') if line.strip()]

    if not lines:
        return ""

    # Parse CSV lines into rows of cells
    rows = []
    for line in lines:
        cells = parse_csv_line(line)
        rows.append(cells)

    # Build markdown table
    return build_markdown_table(rows)

def parse_csv_line(line: str):
    """Parse a CSV line using state machine for quoted cells."""
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
                    current_cell.append('"')
                    i += 2
                    continue
                else:
                    in_quotes = False
            else:
                current_cell.append(char)
        else:
            if char == '"':
                in_quotes = True
            elif char == ',':
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

def build_markdown_table(rows):
    """Build GitHub-flavored Markdown table from parsed rows."""
    if not rows:
        return ""

    # Process all cells: escape pipes
    processed_rows = []
    for row in rows:
        processed_cells = []
        for cell in row:
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
