# fun_online_resume

> My resume, rebuilt as a web app, because a PDF doesn't say much about how I actually think.

Hi — I'm Chris Selig, a data & analytics professional based in Calgary. This repo is my resume, reimagined as a brutalist-styled infographic site with three playable arcade mini-games built entirely out of my own career data. If you're a hiring manager reading this, skip to [What This Demonstrates](#what-this-demonstrates) — that's written for you.

**Status:** Actively building. Not deployed yet — the plan is Vercel at a custom domain, documented in [docs/deployment.md](docs/deployment.md), pending a DNS/Vercel setup step. Run it locally in the meantime (30 seconds, see below).

---

## What's actually in here

- **An infographic resume**, not a document — real stats, real industries, real tools, laid out the way you'd lay out data you wanted someone to actually read.
- **Three playable mini-games** built from the same real data, not placeholder text:
  - *Data Invaders* — shoot down real pain points from my accomplishments, armed with my actual top tools, each weapon firing differently (wave, spread, laser...). Clear a wave and it tells you what you get if you hire me, in concrete numbers pulled from real projects.
  - *Spreadsheet Breaker* — a brick-breaker where every brick is a tool I've used.
  - *Data Pipeline* — classic snake, where every "food" item is a real skill the pipeline picks up.
- **Every number is real.** 18+ years, 12 companies and consulting clients, 8 industries, each with real examples — no padded stats.
- **A few honest asides** — a section on technically-irrelevant skills (NES Punch-Out!!, hand-tool woodworking), because a resume that's only ever serious is a resume nobody remembers.

## What This Demonstrates

If you're evaluating me as a candidate, here's what building this actually required:

| Area | What you'd be hiring |
|---|---|
| **Frontend engineering** | Next.js + TypeScript + Tailwind, hand-rolled Canvas game loops (collision detection, pure-function physics, deterministic state), no framework crutch for anything custom |
| **Product judgment** | Chose depth over scope — three small, polished games beat one half-finished big one; cut a feature (a standalone chart section) in favor of a cleaner interaction when it didn't earn its space |
| **Craft & attention to detail** | Consistent, considered visual language across every page section, not just a template; real data checked against source material rather than invented |
| **Engineering hygiene** | Typed code throughout, unit tests on every non-trivial piece of logic (game physics, collision detection, data pipeline) rather than boilerplate coverage, CI running lint/typecheck/test/build on every change, feature branches, PR workflow, GitHub issues for tracked work |
| **Self-direction** | This was built iteratively — explored several visual directions, kept what worked, cut what didn't, incorporated real-time feedback and corrected real data as I remembered details from 18 years of work |

## Tech Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS — deployed as a static build, no server runtime
- **Content pipeline:** a small Python package (`src/linkedin_project`) holds the resume content as typed, hand-curated Python data (not scraped, not database-backed) and exports it to a static JSON file the frontend reads at build time
- **Testing:** Vitest (frontend logic), pytest (content pipeline)
- **CI:** GitHub Actions — lint, typecheck, test, and build on every change

See [docs/architecture.md](docs/architecture.md) for the full data flow.

## Running Locally

```bash
cd web
npm install
npm run dev   # http://localhost:3000
```

That's it — the resume content is already baked into `web/src/data/resume.json`. To change the content itself, edit `src/linkedin_project/pipelines/export_resume.py` and regenerate:

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt && pip install -e ".[dev]"
python scripts/export_resume_json.py
```

## Project Structure

```
.
├── web/                          # Next.js site (the actual app)
│   ├── src/app/                  # App Router page + layout
│   ├── src/components/           # Infographic sections + the 3 arcade games
│   ├── src/lib/                  # Typed resume loader, game physics/logic (unit tested)
│   └── src/data/resume.json      # Generated — do not edit by hand
├── src/linkedin_project/
│   └── pipelines/export_resume.py  # All resume content, hand-curated, single source of truth
├── scripts/export_resume_json.py   # Writes web/src/data/resume.json
├── tests/                        # Python content-pipeline tests
├── .github/workflows/ci.yml      # Lint + test on every PR, both halves of the stack
└── docs/
    ├── architecture.md           # Data flow and layer responsibilities
    └── deployment.md             # Vercel + custom domain setup
```

## Documentation

- [Architecture](docs/architecture.md)
- [Deployment](docs/deployment.md)
