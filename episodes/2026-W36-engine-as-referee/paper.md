# Paper - My AI game studio has a physics engine for a boss.

**Title:** Agentic Game Development as a Verifiable Trajectory Data Engine for Scaling World Models
**Authors:** Pengfei Zhou, Hexin Wang, Zhengfeiyang Zhang, Yixing Ma, Zhenglin Wan, Kaipeng Zhang, Wangbo Zhao, Yang You (InfRec / Cardinal AI Lab, UC Berkeley, HKUST, HPC-AI Lab)
**arXiv:** 2608.25518
**PDF:** https://arxiv.org/pdf/2608.25518
**Published:** 2026-08 (August 2026)

Paper link: https://arxiv.org/abs/2608.25518
Code/agentic artifacts: https://github.com/LanceZPF/cardinal-preview

## Party pitch (C1 residue)

AI got good at code partly because compilers can instantly say which line is
broken and humans only have to say yes or no at the end. This paper says video
and 3D generation are stuck because nobody built that referee for worlds, and
then points at one everybody already owns: the game engine. It also names its
world model AWoMo, which the writers among us appreciate.

## Why this paper

- **The story:** an AI game studio where the physics engine is the art
  director - it never argues, it just returns exit codes, and the one human
  still gets the final yes or no.
- **We can test it:** the full propose-verify-repair-review loop at toy scale
  for INR 0: local LLM designers, a deterministic grid checker as the engine,
  the owner as the human acceptance channel, and the paper's exact three-arm
  comparison (human+engine vs engine-only vs vibes-only). Receipt = vibe
  consultant praising a level the playtest bot cannot walk.
- **Why now:** dropped this week (radar top NEW candidate, 132 upvotes,
  world-axis +8); it is the first v5.1 scenario-pipeline episode where the
  world (a game studio) literally IS the paper's apparatus (a game engine).
