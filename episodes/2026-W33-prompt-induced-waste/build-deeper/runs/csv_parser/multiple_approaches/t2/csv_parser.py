"""CSV to Markdown parser — Python stdlib csv module approach."""
import csv
from io import StringIO

def csv_to_markdown(csv_text: str) -> str:
    """Convert CSV text to GitHub-flavored Markdown table using csv module."""
    if not csv_text.strip():
        return ""

    # Parse CSV using stdlib
    reader = csv.reader(StringIO(csv_text.strip()))
    rows = list(reader)

    if not rows:
        return ""

    # Trim whitespace from all cells
    rows = [[cell.strip() for cell in row] for row in rows]

    # Build markdown
    md_lines = []

    # Header row
    md_lines.append('| ' + ' | '.join(rows[0]) + ' |')

    # Separator row
    md_lines.append('| ' + ' | '.join(['---'] * len(rows[0])) + ' |')

    # Data rows
    for row in rows[1:]:
        escaped = [cell.replace('|', r'\|') for cell in row]
        md_lines.append('| ' + ' | '.join(escaped) + ' |')

    return '\n'.join(md_lines)
