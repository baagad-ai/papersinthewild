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
            s = re.search(rf"{key}=\{{\{{\s*speaker: [\"']([^\"']+)[\"'],\s*quote: ([\"'])(.+?)\2(?:,\s*note: [\"']([^\"']*)[\"'])?", body, re.S)
            out = f'> **{s.group(1)}:**\n>\n> "{s.group(3)}"'
            if s.group(4):
                out += f'\n>\n> *({s.group(4)})*'
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

    src = re.sub(r"<(?:StepChart|ChartExplorer)[^>]*?/>", stepchart, src, flags=re.S)

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


    # ---- fun-scroller layer (BLOG-FLOW.md, 2026-08-19)
    # Reveal: passthrough (strip wrapper, keep inner)
    src = re.sub(r"<Reveal>\s*\n?(.*?)\n?\s*</Reveal>", lambda m: m.group(1).strip() + "\n", src, flags=re.S)
    # ChartExplorer: same transform as StepChart
    def chartexplorer(m):
        return stepchart(m)

    # ---- storytelling components (2026-08-13)
    src = re.sub(r"<DropCap>(.*?)</DropCap>", lambda m: m.group(1), src, flags=re.S)
    src = src.replace("<InkRule />", "---")
    src = re.sub(
        r'<PromptBlock label="([^"]+)"(?: tone="[^"]+")?>\s*\n(.*?)\n</PromptBlock>',
        lambda m: f'> **{m.group(1)}**\n>\n> ' + "\n> ".join(m.group(2).strip().removeprefix("{`").removesuffix("`}").split("\n")) + "\n",
        src, flags=re.S,
    )
    src = re.sub(
        r'<Callout[^>]*>\s*\n(.*?)\n</Callout>',
        lambda m: "> " + "\n> ".join(m.group(1).strip().split("\n")) + "\n",
        src, flags=re.S,
    )

    # ---- v5 story-shaped interactives (2026-08-29)
    def chatreplay(m):
        caption, body = m.group(1), m.group(2)
        out = f"*{caption}*\n\n" if caption else ""
        msg_re = re.findall(
            r'\{\s*role:\s*["\'](user|model|system)["\'](?:,\s*modelId:\s*["\']([^"\']*)["\'])?,\s*text:\s*(["\'])(.*?)\3\s*\}',
            body,
        )
        for role, model_id, _, text in msg_re:
            who = model_id or ("the grader" if role == "system" else "me")
            out += f"> **{who}:**\n>\n> {text}\n>\n"
        return out + "\n"

    src = re.sub(r'<ChatReplay\s+caption="((?:[^"\\]|\\.)*)"\s+messages=\{\[(.*?)\]\}\s*/>', chatreplay, src, flags=re.S)

    def tallyboard(m):
        caption, body = m.group(1), m.group(2)
        out = "| Model | Pick accuracy | In plain numbers |\n|---|---|---|\n"
        for value, _dec, label, household in re.findall(
            r'\{ value: ([\d.]+)(?:, decimals: (\d+))?, label: "([^"]*)"(?:, household: "([^"]*)")?\s*\}', body
        ):
            out += f'| {label} | {value} | {household or ""} |\n'
        return out + (f"\n*{caption}*\n" if caption else "")

    src = re.sub(r'<TallyBoard\s+caption="((?:[^"\\]|\\.)*)"\s+items=\{\[(.*?)\]\}\s*/>', tallyboard, src, flags=re.S)

    def plotchart(m):
        caption = m.group(1)
        body = m.group(2)
        conds: list[str] = []
        rows: dict[str, dict[str, str]] = {}
        for cond, value, model in re.findall(r'\{ cond: "([^"]*)", pickAcc: ([\d.]+), model: "([^"]*)"\s*\}', body):
            if cond not in conds:
                conds.append(cond)
            rows.setdefault(model, {})[cond] = value
        out = "| Model | " + " | ".join(conds) + " |\n|" + "---|" * (len(conds) + 1) + "\n"
        for model, vals in rows.items():
            out += f"| {model} | " + " | ".join(vals.get(c, "") for c in conds) + " |\n"
        return out + (f"\n*{caption}*\n" if caption else "")

    src = re.sub(r'<PlotChart[^>]*caption="((?:[^"\\]|\\.)*)"\s+data=\{\[(.*?)\]\}\s+fallback="[^"]*"\s*/>', plotchart, src, flags=re.S)

    src = re.sub(
        r'<MomentCard\s+quote=(["\'])(.+?)\1\s+ts="([^"]*)"\s+context=(["\'])(.+?)\4\s+source="([^"]*)"\s*/>',
        lambda m: f'> **{m.group(3)}**\n>\n> `{m.group(2)}`\n>\n> {m.group(5)}\n\n*Source: {m.group(6)}*\n',
        src,
    )

    src = re.sub(
        r'<TryIt\s+label="([^"]*)"\s+prompt="((?:[^"\\]|\\.)*)"\s*/>',
        lambda m: f"**{m.group(1)}**\n\n```\n{m.group(2)}\n```\n",
        src,
    )

    src = re.sub(r'<DrawerTrap[^>]*/>', "*Interactive: the lying-drawer pick, playable on the site. The two entries and what each produces for the chore are shown below.*\n", src)
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

    # ---- v5.1 World tier (scenario episodes, 2026-08-29)
    def castboard(m):
        body = m.group(0)
        caption = re.search(r'caption="([^"]*)"', body)
        members = re.findall(r'\{ name: "([^"]+)"(?:, role: "([^"]*)")?, model: "([^"]+)"(?:, status: "([^"]+)")?\s*\}', body)
        out = "| Persona | Role | Real model | Status |\n|---|---|---|---|\n"
        for name, role, model, status in members:
            out += f"| {name} | {role or ''} | {model} | {status or ''} |\n"
        return out + (f"\n*{caption.group(1)}*\n" if caption else "")

    src = re.sub(r"<CastBoard[^>]*?/>", castboard, src, flags=re.S)

    def incidentcard(m):
        body = m.group(0)
        num = re.search(r'n=\{(\d+)\}', body)
        day = re.search(r'day="([^"]*)"', body)
        who = re.search(r'who="([^"]*)"', body)
        quote = re.search(r'quote="((?:[^"\\]|\\.)*)"', body)
        receipt = re.search(r'receipt="([^"]*)"', body)
        source = re.search(r'source="([^"]*)"', body)
        head = f"**Incident Nº {num.group(1)}**" if num else "**Incident**"
        if day:
            head += f" ({day.group(1)})"
        out = f"> {head}\n>\n> \"{quote.group(1)}\"\n>\n"
        if who:
            out += f"> {who.group(1)}\n>\n"
        if receipt:
            out += f"> *{receipt.group(1)}*\n>\n"
        if source:
            out += f"> `{source.group(1)}`\n"
        return out + "\n"

    src = re.sub(r"<IncidentCard[^>]*?/>", incidentcard, src, flags=re.S)

    def eventfeed(m):
        caption, body = m.group(1), m.group(2)
        out = "| When | Actor | Model | Event |\n|---|---|---|---|\n"
        for day, ts, actor, model, text in re.findall(
            r'\{ day: "([^"]*)"(?:, ts: "([^"]*)")?, actor: "([^"]+)"(?:, model: "([^"]*)")?, text: "((?:[^"\\]|\\.)*)"(?:, kind: "[^"]+")?\s*\}',
            body,
        ):
            when = " ".join(x for x in (day, ts) if x)
            out += f"| {when} | {actor} | {model or ''} | {text} |\n"
        return out + (f"\n*{caption}*\n" if caption else "")

    src = re.sub(r'<EventFeed\s+caption="((?:[^"\\]|\\.)*)"\s+events=\{\[(.*?)\]\}\s*/>', eventfeed, src, flags=re.S)

    def bakeoffboard(m):
        caption, body = m.group(1), m.group(2)
        out = "| Model | Value | Note |\n|---|---|---|\n"
        for model, label, value, note in re.findall(
            r'\{ model: "([^"]+)"(?:, label: "([^"]*)")?, value: ([\d.]+)(?:, note: "([^"]*)")?\s*\}',
            body,
        ):
            out += f"| {model} | {value} | {note or label or ''} |\n"
        return out + (f"\n*{caption}*\n" if caption else "")

    src = re.sub(r'<BakeoffBoard\s+caption="((?:[^"\\]|\\.)*)"\s+rows=\{\[(.*?)\]\}\s*/>', bakeoffboard, src, flags=re.S)

    def agentinspector(m):
        caption, body = m.group(1), m.group(2)
        agent_re = re.findall(
            r'name: "([^"]+)", model: "([^"]+)",\s*thought: "((?:[^"\\]|\\.)*)",\s*memory: \[([^\]]*)\]',
            body,
        )
        out = ""
        for name, model, thought, membody in agent_re:
            out += f"**{name}** (runs on {model})\n\n> \"{thought}\"\n\n"
            out += "| Memory | Held |\n|---|---|\n"
            for text, held in re.findall(r'\{ text: "((?:[^"\\]|\\.)*)", held: (true|false)\s*\}', membody):
                out += f"| {text} | {'yes' if held == 'true' else 'dropped'} |\n"
            out += "\n"
        return out + (f"\n*{caption}*\n" if caption else "")

    src = re.sub(r'<AgentInspector\s+caption="((?:[^"\\]|\\.)*)"\s+agents=\{\[(.*?)\]\}\s*/>', agentinspector, src, flags=re.S)

    def chronicle(m):
        caption, body = m.group(1), m.group(2)
        rows = re.findall(
            r'day: "([^"]+)", title: "([^"]+)"(?:, detail: "((?:[^"\\]|\\.)*)")?(?:, quote: "((?:[^"\\]|\\.)*)")?(?:, kind: "[^"]+")?\s*\}',
            body,
        )
        out = "| Day | What | Detail |\n|---|---|---|\n"
        for day, title, detail, quote in rows:
            cell = title + (f' (\"{quote}\")' if quote else "")
            out += f"| {day} | {cell} | {detail or ''} |\n"
        return out + (f"\n*{caption}*\n" if caption else "")

    src = re.sub(r'<ChronicleTimeline\s+caption="((?:[^"\\]|\\.)*)"\s+days=\{\[(.*?)\]\}\s*/>', chronicle, src, flags=re.S)

    def relmap(m):
        body = m.group(0)
        caption = re.search(r'caption="([^"]*)"', body)
        nodes = re.findall(r'\{ name: "([^"]+)"(?:, model: "([^"]*)")?\s*\}', body)
        links = re.findall(r'\{ from: "([^"]+)", to: "([^"]+)"(?:, kind: "([^"]+)")?\s*\}', body)
        out = "| Who | Model | Links |\n|---|---|---|\n"
        for name, model in nodes:
            mine = [f"{a} -{k or 'trust'}-> {b}" for a, b, k in links if a == name or b == name]
            out += f"| {name} | {model or ''} | {', '.join(mine)} |\n"
        return out + (f"\n*{caption.group(1)}*\n" if caption else "")

    src = re.sub(r"<RelationshipMap[^>]*?/>", relmap, src, flags=re.S)

    def memorybook_md(caption, body, book=None):
        out = (f"**{book}**\n\n" if book else "")
        out += "| Page | Text | Fades by day |\n|---|---|---|\n"
        for label, text, fades in re.findall(
            r'label: "([^"]+)", text: "((?:[^"\\]|\\.)*)"(?:, fadesAt: (\d+))?\s*\}',
            body,
        ):
            out += f"| {label} | {text} | {fades or ''} |\n"
        return out + (f"\n*{caption}*\n" if caption else "")

    src = re.sub(
        r'<MemoryBook\s+caption="((?:[^"\\]|\\.)*)"\s+book="([^"]*)"\s+maxDay=\{?(\d+)\}?\s+pages=\{\[(.*?)\]\}\s*/>',
        lambda m: memorybook_md(m.group(1), m.group(4), m.group(2)),
        src, flags=re.S,
    )
    # fallback shape without book/maxDay attrs
    src = re.sub(
        r'<MemoryBook\s+caption="((?:[^"\\]|\\.)*)"\s+pages=\{\[(.*?)\]\}\s*/>',
        lambda m: memorybook_md(m.group(1), m.group(2)),
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

    leftover = re.findall(r"<(?:DropCap|InkRule|PromptBlock|AgentLine|BigStat|Translation|ReceiptTable|Scene|Callout|StepChart|SpreadRing|QuoteFaceoff|DeltaTable|ProportionBar|Sparkline|Reveal|ChartExplorer|ChatReplay|TallyBoard|PlotChart|MomentCard|TryIt|DrawerTrap|ModelExplorer|StickyStep|Timeline|ChapterProgress|CastBoard|AgentInspector|ChronicleTimeline|EventFeed|IncidentCard|BakeoffBoard|RelationshipMap|MemoryBook)[^>]*>", out)
    if leftover:
        sys.exit(f"ERROR: unconverted JSX in mirror: {leftover}")
    if re.search(r"[—–]", out):
        sys.exit("ERROR: em-dash found in mirror")

    dest = Eps_ROOT / folder / "blog-post.md"
    dest.write_text(out)
    print(f"mirror written: {dest} ({len(out.split())} words, no leftover JSX, no em-dashes)")


if __name__ == "__main__":
    main()
