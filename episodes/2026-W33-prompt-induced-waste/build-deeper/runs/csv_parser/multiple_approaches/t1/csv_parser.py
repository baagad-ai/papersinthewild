"""CSV to Markdown parser — regex-based approach."""
import re

def csv_to_markdown(csv_text: str) -> str:
    """Convert CSV text to GitHub-flavored Markdown table."""
    if not csv_text.strip():
        return ""

    lines = csv_text.strip().split('\n')
    rows = []

    for line in lines:
        # Match quoted cells "..." or unquoted cells (anything between commas)
        # Pattern: "([^"]*)" for quoted, ([^,]+) for unquoted
        cells = re.findall(r'"([^"]*)"|([^,]+)', line)
        # flatten tuples, take first non-empty group from each match
        parsed = []
        for quoted, unquoted in cells:
            cell = quoted if quoted else unquoted
            parsed.append(cell.strip())
        rows.append(parsed)

    if not rows:
        return ""

    # Build markdown
    md_rows = []
    # Header row
    md_rows.append('| ' + ' | '.join(rows[0]) + ' |')
    # Separator row
    md_rows.append('| ' + ' | '.join(['---'] * len(rows[0])) + ' |')
    # Data rows
    for row in rows[1:]:
        # Escape pipes in cells
        escaped = [cell.replace('|', r'\|') for cell in row]
        md_rows.append('| ' + ' | '.join(escaped) + ' |')

    return '\n'.join(md_rows)
