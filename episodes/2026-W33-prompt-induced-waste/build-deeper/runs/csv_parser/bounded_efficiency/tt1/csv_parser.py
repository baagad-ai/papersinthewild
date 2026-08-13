import csv
from io import StringIO

def csv_to_markdown(csv_text: str) -> str:
    if not csv_text.strip():
        return ""
    reader = csv.reader(StringIO(csv_text))
    rows = list(reader)
    if not rows:
        return ""
    header = rows[0]
    cols = len(header)
    # Escape pipes in all cells
    escaped_rows = []
    for row in rows:
        escaped_row = [cell.strip().replace('|', '\\|') for cell in row]
        escaped_rows.append(escaped_row)
    # Build markdown
    md_lines = []
    md_lines.append('| ' + ' | '.join(escaped_rows[0]) + ' |')
    md_lines.append('| ' + ' | '.join(['---'] * cols) + ' |')
    for row in escaped_rows[1:]:
        md_lines.append('| ' + ' | '.join(row) + ' |')
    return '\n'.join(md_lines)
