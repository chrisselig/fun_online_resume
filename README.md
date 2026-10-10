# fun_online_resume

> My resume, rebuilt as a web app, because a PDF doesn't say much about how I actually think.

Hi — I'm Chris Selig, a data & analytics professional based in Calgary. This repo is my resume, reimagined as an infographic site. If you're a hiring manager reading this, skip to [What This Demonstrates](#what-this-demonstrates) — that's written for you.

**Status:** Actively building — this branch is one of several visual directions I explored before converging on a final one. Not deployed yet — the plan is Vercel at a custom domain, documented in [docs/deployment.md](docs/deployment.md), pending a DNS/Vercel setup step. Run it locally in the meantime (30 seconds, see below).

---

## What's actually in here

- **An infographic resume**, not a document — real stats, a bubble chart of my tools sized by how often I've actually used them (not vanity LinkedIn endorsements), a real career timeline, and real portfolio links.
- **Every number is real.** Stats, industries, companies — no padded claims.
- **A few honest asides** — a section on technically-irrelevant skills (NES Punch-Out!!, hand-tool woodworking), because a resume that's only ever serious is a resume nobody remembers.

## What This Demonstrates

If you're evaluating me as a candidate, here's what building this actually required:

| Area | What you'd be hiring |
|---|---|
| **Frontend engineering** | Next.js + TypeScript + Tailwind, hand-rolled SVG data visualization (a deterministic circle-packing layout, not a charting library dependency) |
| **Product judgment** | Chose a restrained, typography-driven visual language over decoration for its own sake; iterated through multiple design directions before settling |
| **Craft & attention to detail** | Consistent, considered visual language across every page section; real data checked against source material rather than invented |
| **Engineering hygiene** | Typed code throughout, unit tests on the non-trivial logic rather than boilerplate coverage, CI running lint/typecheck/test/build on every change, feature branches, PR workflow, GitHub issues for tracked work |
| **Self-direction** | Built iteratively — explored several visual directions, kept what worked, cut what didn't, incorporated real-time feedback and corrected real data as details came back to me from 18 years of work |

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
│   ├── src/components/           # Infographic sections (hero, stats, skills, experience, …)
│   ├── src/lib/                  # Typed resume loader, circle-pack layout math (unit tested)
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
