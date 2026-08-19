#!/usr/bin/env python3
"""mdx-to-md.py: episode MDX -> plain-markdown mirror (blog-post.md).

The site renders the canonical MDX; the episode folder keeps a JSX-free
markdown mirror for GitHub-native reading. This script converts every
registered component to a markdown equivalent and FAILS LOUDLY if any JSX
remains (per the ship-guard philosophy: never publish a broken mirror).

Usage: python3 scripts/mdx-to-md.py content/episodes/<slug>.mdx <episode-number>
Writes to ../episodes/<folder>/blog-post.md (derives folder from the slug's
date prefix: YYYY-WW-slug -> YYYY-WW-slug).
"""
import re
import sys
from pathlib import Path

SITE = Path(__file__).resolve().parent.parent
Eps_ROOT = SITE.parent / "episodes"


def convert(src: str, meta: dict) -> str:
    # ---- data visualization components (2026-08-19)
    def faceoff(m):
        body = m.group(0)

        def side(key):
            s = re.search(rf'{key}=\{{\{{\s*speaker: "([^"]+)",\s*quote: "([^"]+)"(?:,\s*note: "([^"]+)")?', body, re.S)
            out = f'> **{s.group(1)}:**\n>\n> "{s.group(2)}"'
            if s.group(3):
                out += f'\n>\n> *({s.group(3)})*'
            return out

        caption = re.search(r'caption="([^"]*)"', body)
        out = side("left") + "\n\n" + side("right") + "\n"
        if caption:
            out += f'\n*{caption.group(1)}*\n'
        return out

    src = re.sub(r"<QuoteFaceoff[^>]*?/>", faceoff, src, flags=re.S)

    def stepchart(m):
        body = m.group(0)
        caption = re.search(r'caption="([^"]*)"', body)
        series = re.findall(r'\{ label: "([^"]+)", color: "[^"]+", data: \[([^\]]+)\]([^}]*)\}', body)
        out = "| Run | Values by round |\n|---|---|\n"
        for label, data, _ in series:
            out += f'| {label} | {" → ".join(v.strip() for v in data.split(","))} |\n'
        if caption:
            out += f'\n*{caption.group(1)}*\n'
        return out

    src = re.sub(r"<StepChart[^>]*?/>", stepchart, src, flags=re.S)

    def spreadring(m):
        body = m.group(0)
        caption = re.search(r'caption="([^"]*)"', body)
        vac = re.findall(r'\{ name: "([^"]+)", vaccinated: true \}', body)
        rounds = re.findall(r"\{ round: (\d+), infected: \[([^\]]*)\] \}", body)
        out = "| Round | Infected |\n|---|---|\n"
        for r, inf in rounds:
            names = ", ".join(n.strip().strip('"') for n in inf.split(",") if n.strip())
            out += f"| {r} | {names} |\n"
        if vac:
            out += f'\nVaccinated agents: {", ".join(vac)}.\n'
        if caption:
            out += f'\n*{caption.group(1)}*\n'
        return out

    src = re.sub(r"<SpreadRing[^>]*?/>", spreadring, src, flags=re.S)

    def deltable(m):
        body = m.group(0)
        caption = re.search(r'caption="([^"]*)"', body)
        um = re.search(r'unit="([^"]*)"', body)
        unit = um.group(1) if um else "$"
        rows = re.findall(r'\{ label: "([^"]+)", estimate: ([\d.]+), actual: ([\d.]+) \}', body)
        out = "| Run | Estimated | Actual |\n|---|---|---|\n"
        for label, est, act in rows:
            out += f"| {label} | {unit}{float(est):.2f} | {unit}{float(act):.2f} |\n"
        if caption:
            out += f'\n*{caption.group(1)}*\n'
        return out

    src = re.sub(r"<DeltaTable[^>]*?/>", deltable, src, flags=re.S)

    def propbar(m):
        body = m.group(0)
        caption = re.search(r'caption="([^"]*)"', body)
        segs = re.findall(r'\{ label: "([^"]+)", value: ([\d.]+)', body)
        total = sum(float(v) for _, v in segs) or 1
        out = "| Segment | Share |\n|---|---|\n"
        for label, v in segs:
            out += f"| {label} | {round(float(v) / total * 100)}% |\n"
        if caption:
            out += f'\n*{caption.group(1)}*\n'
        return out

    src = re.sub(r"<ProportionBar[^>]*?/>", propbar, src, flags=re.S)

    def sparkline(m):
        data = re.search(r"data=\{?\[([^\]]+)\]", m.group(0)).group(1)
        vals = [v.strip() for v in data.split(",")]
        return f"*({' → '.join(vals)})*"

    src = re.sub(r"<Sparkline[^>]*/>", sparkline, src)

    # ---- storytelling components (2026-08-13)
    src = re.sub(r"<DropCap>(.*?)</DropCap>", lambda m: m.group(1), src, flags=re.S)
    src = src.replace("<InkRule />", "---")
    src = re.sub(
        r'<PromptBlock label="([^"]+)" tone="[^"]+">\s*\n(.*?)\n</PromptBlock>',
        lambda m: f'> **{m.group(1)}**\n>\n> ' + "\n> ".join(m.group(2).strip().split("\n")) + "\n",
        src, flags=re.S,
    )
    src = re.sub(
        r'<AgentLine task="([^"]+)">\s*\n(.*?)\n</AgentLine>',
        lambda m: f'> **AI, {m.group(1)}:**\n>\n> {m.group(2).strip()}\n',
        src, flags=re.S,
    )
    src = re.sub(r'<BigStat value="([^"]+)" label="([^"]+)" />', lambda m: f"**{m.group(1)}** {m.group(2)}\n", src)

    def translation(m):
        out = "| | |\n|---|---|\n"
        for k, v in [("Term", m.group(1)), ("Plain English", m.group(2)), ("Analogy", m.group(3)), ("Data", m.group(4))]:
            out += f"| **{k}** | {v} |\n"
        return out

    src = re.sub(r'<Translation\s+term="([^"]*)"\s+plain="([^"]*)"\s+analogy="([^"]*)"\s+data="([^"]*)"\s+/>', translation, src)

    def receipt(m):
        headers = re.findall(r'"([^"]*)"', m.group(2))
        rows_raw = re.findall(r"\[([^\]]+)\]", m.group(3))
        out = "| " + " | ".join(headers) + " |\n|" + "---|" * len(headers) + "\n"
        for r in rows_raw:
            out += "| " + " | ".join(re.findall(r'"([^"]*)"', r)) + " |\n"
        return out + f'\n*{m.group(1)}*\n'

    src = re.sub(r'<ReceiptTable\s+caption="([^"]*)"\s+headers=\{(\[[^\]]*\])\}\s+rows=\{(\[.*?\])\}\s+/>', receipt, src, flags=re.S)
    src = re.sub(r'<Scene title="([^"]+)">\s*\n(.*?)\n</Scene>', lambda m: f"### {m.group(1)}\n\n{m.group(2).strip()}\n", src, flags=re.S)
    src = re.sub(
        r'<Callout variant="[^"]+" label="([^"]+)">\s*\n(.*?)\n</Callout>',
        lambda m: f"### {m.group(1)}\n\n{m.group(2).strip()}\n",
        src, flags=re.S,
    )

    # ---- frontmatter + H1
    front = (
        "---\n"
        f'title: "{meta["title"]}"\n'
        f'subtitle: "{meta["subtitle"]}"\n'
        f'date: {meta["date"]}\n'
        f'episode: {meta["episode"]}\n'
        f'paper: "{meta["paper"]}"\n'
        f'paper_url: "{meta["paperUrl"]}"\n'
        "tags: [ai, papers-in-the-wild]\n"
        "---\n\n"
        f'# {meta["title"]}\n\n'
    )
    return front + src.lstrip()


def main():
    if len(sys.argv) < 2:
        sys.exit("usage: mdx-to-md.py <slug>  (reads episodes.ts metadata + content/episodes/<slug>.mdx)")
    slug = sys.argv[1]
    ts = (SITE / "content" / "episodes.ts").read_text()
    block = re.search(rf'slug: "{slug}",(.*?)\n  \}}', ts, re.S).group(1)

    def grab(key):
        m = re.search(rf'{key}:\s*"?(.+?)"?,?\s*\n', block)
        return m.group(1).strip().strip('"')

    meta = {
        "title": grab("title"),
        "subtitle": grab("subtitle"),
        "date": grab("date"),
        "episode": re.search(r"episode: (\d+)", block).group(1),
        "paper": grab("paper"),
        "paperUrl": grab("paperUrl"),
    }
    folder = slug  # episode folders share the slug (e.g. 2026-w34-mind-viruses)
    mdx = (SITE / "content" / "episodes" / f"{slug}.mdx").read_text()
    out = convert(mdx, meta)

    leftover = re.findall(r"<(?:DropCap|InkRule|PromptBlock|AgentLine|BigStat|Translation|ReceiptTable|Scene|Callout|StepChart|SpreadRing|QuoteFaceoff|DeltaTable|ProportionBar|Sparkline)[^>]*>", out)
    if leftover:
        sys.exit(f"ERROR: unconverted JSX in mirror: {leftover}")
    if re.search(r"[—–]", out):
        sys.exit("ERROR: em-dash found in mirror")

    dest = Eps_ROOT / folder / "blog-post.md"
    dest.write_text(out)
    print(f"mirror written: {dest} ({len(out.split())} words, no leftover JSX, no em-dashes)")


if __name__ == "__main__":
    main()
