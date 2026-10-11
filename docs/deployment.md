# Deployment

The site is a static Next.js app in `/web`, deployed to Vercel. There is no
server-side Python in production — `web/src/data/resume.json` is generated
ahead of time by `scripts/export_resume_json.py` and committed.

## First-time Vercel setup (manual, one-time)

1. Install the CLI if you don't have it: `npm install -g vercel`
2. From the repo root: `vercel login`
3. From `/web`: `vercel link` — when prompted:
   - Link to an existing project? **No** (first time)
   - What's your project's name? `linkedin-resume` (or your choice)
   - In which directory is your code located? `./` (you're already in `web/`)
   - Vercel auto-detects Next.js — no build command overrides needed.

   If linking from the **repo root** instead via the Vercel dashboard
   ("Add New Project" → import the GitHub repo), set **Root Directory** to
   `web` in the project's Settings → General before the first deploy —
   otherwise Vercel will try to build the repo root, which has no
   `package.json`.

4. Deploy a preview: `vercel` (from `/web`)
5. Promote to production: `vercel --prod`

After this, pushing to `main` on GitHub triggers an automatic production
deploy if the project is connected via Vercel's GitHub integration (enabled
by default when you import from GitHub in the dashboard) — the CLI steps
above are only needed once to create the project.

## Connecting bidamia.ca

1. Vercel dashboard → the project → **Settings → Domains**
2. Add `bidamia.ca` (and `www.bidamia.ca` if desired)
3. Vercel shows the DNS records to add. For an apex domain (`bidamia.ca`)
   it's typically an `A` record to Vercel's anycast IP, or `ALIAS`/`ANAME`
   if your DNS provider supports it; for `www` it's a `CNAME` to
   `cname.vercel-dns.com`. Add these at your domain registrar/DNS provider
   for bidamia.ca.
4. Wait for DNS propagation (Vercel's dashboard shows a ✓ once it verifies)
   — usually minutes, can take up to 24–48h depending on the registrar.
5. Vercel provisions the TLS certificate automatically once DNS resolves.

This step requires access to the bidamia.ca DNS settings and the Vercel
account — neither of which an agent can do on your behalf.

## Updating resume content

```bash
source .venv/bin/activate   # or: .venv/bin/python directly
python scripts/export_resume_json.py
git add web/src/data/resume.json
git commit -m "Update resume data"
git push
```

Pushing to `main` redeploys automatically via Vercel's GitHub integration.
