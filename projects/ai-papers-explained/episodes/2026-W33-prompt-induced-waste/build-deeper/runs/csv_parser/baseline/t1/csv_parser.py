import re

def csv_to_markdown(csv_text: str) -> str:
    if not csv_text.strip():
        return ""

    lines = csv_text.strip().split('\n')
    rows = []

    for line in lines:
        cells = []
        i = 0
        while i < len(line):
            if line[i] == '"':
                j = i + 1
                while j < len(line) and line[j] != '"':
                    j += 1
                cells.append(line[i+1:j].strip())
                i = j + 2 if j + 1 < len(line) and line[j+1] == ',' else j + 1
            else:
                j = i
                while j < len(line) and line[j] != ',':
                    j += 1
                cells.append(line[i:j].strip())
                i = j + 1
        rows.append(cells)

    if not rows:
        return ""

    header = rows[0]
    sep_row = ['---'] * len(header)

    md_lines = []
    md_lines.append('| ' + ' | '.join(header) + ' |')
    md_lines.append('| ' + ' | '.join(sep_row) + ' |')

    for row in rows[1:]:
        escaped = [cell.replace('|', '\\|') for cell in row]
        md_lines.append('| ' + ' | '.join(escaped) + ' |')

    return '\n'.join(md_lines)