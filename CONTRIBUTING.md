# Contributing to Papers in the Wild

Thanks for being interested. This is a one-author publication, but suggestions, corrections, and replication reports are very welcome.

## Ways to contribute

### Suggest a paper

The most useful contribution. Open an issue with the `paper-suggestion:` prefix. Include:

- **arXiv link** (free to read, no paywalls)
- **One sentence on why it is bizarre-but-real.** Surprising result, weird implication, useful fix, anything that makes a reader lean in.
- **(Optional) A use case you would like to see tested.** "It would be fun to see this tested on..." is enough.

Papers are more likely to be picked if they have:
- A free arXiv link
- A GitHub repo with code (preferred) or a Hugging Face demo
- A result accessible enough to explain in plain English
- A real-world test that is feasible in a week

Papers are less likely to be picked if they are pure theory with no implementable angle.

### Report a correction

If you spot a factual error, a broken link, or a misread of a paper, open an issue with the `correction:` prefix. Be specific about what is wrong and what the correct claim is. Cite the source for the correction.

### Replicate an episode

If you replicate an episode's experiment on your own setup and get different numbers, that is gold. Open an issue with the `replication:` prefix. Include:

- Which episode you replicated
- Your setup (model, harness, OS, anything relevant)
- Your numbers vs. the episode's numbers
- Your trial outputs (gist, repo link, or attachment)

Replications that confirm the original numbers are also welcome. They sharpen the result.

### Improve the code

The site and experiment scripts are MIT licensed. Pull requests that fix bugs, improve accessibility, or sharpen the experiment harness are welcome.

For cosmetic changes to the site (typography, spacing, motion), please open an issue first to discuss. The visual system is intentional and small changes can break cohesion.

## What is not a good fit

- **Rewrites of episode voice or structure.** The voice is the project. If you do not like it, fork it.
- **Additions of new episodes.** Each episode is a week of one person's work. The author picks, builds, and writes them.
- **Marketing materials** (LinkedIn posts, Instagram carousels, etc.). These are not in the public repo. They are produced privately per episode.
- **Brand or design doc additions.** The brand system is internal to the project. Public feedback on the rendered site is welcome; PRs against internal docs are not applicable.

## How to submit

- **Issues**: open one any time. Expect a reply within a week (usually faster).
- **Pull requests**: please open an issue first for anything beyond a small fix. PRs that touch the experiment code or the site should reference an existing issue.

## Code style

For the site:

- TypeScript strict
- Tailwind utility classes (no CSS files unless tokens demand it)
- shadcn-style owned components (no UI kit dependency)
- No em-dashes in source code, copy, or comments. Period, comma, colon, parens, or regular hyphen instead.

For experiment scripts:

- Python 3.11+
- Type hints
- `pytest` for tests
- Comments that explain why, not what

## Licensing your contribution

By submitting a pull request, you agree that your contribution will be licensed under the same terms as the rest of the repository: **MIT** for code, **CC BY 4.0** for content. You retain authorship; the commit log is the record.

---

*This is a small project. Be kind. Be specific. Be honest about uncertainty.*
