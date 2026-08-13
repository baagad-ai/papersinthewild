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
                while j < len(line) and not (line[j] == '"' and (j + 1 >= len(line) or line[j + 1] in ',\n')):
                    j += 1
                cells.append(line[i+1:j].replace('|', '\\|'))
                i = j + 2 if j + 1 < len(line) and line[j + 1] == ',' else j + 1
            else:
                comma_idx = line.find(',', i)
                if comma_idx == -1:
                    cells.append(line[i:].replace('|', '\\|').strip())
                    break
                else:
                    cells.append(line[i:comma_idx].replace('|', '\\|').strip())
                    i = comma_idx + 1
        rows.append(cells)

    if not rows:
        return ""

    header = rows[0]
    separator = ['---'] * len(header)

    md_lines = []
    md_lines.append('| ' + ' | '.join(header) + ' |')
    md_lines.append('| ' + ' | '.join(separator) + ' |')

    for row in rows[1:]:
        md_lines.append('| ' + ' | '.join(row) + ' |')

    return '\n'.join(md_lines)