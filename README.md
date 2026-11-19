[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/local-deviant/silver-pine-2916/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/local-deviant/silver-pine-2916/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

# Leonida Platinum Planner

A GTA VI trophy guide and platinum tracker for the make.fun bounty
`gta6-trophy-guide-01`: all 55 trophies, a 5-stage roadmap, and a
checklist that remembers your progress — in one offline page.

## What it does

- **55 trophies** with official names, descriptions and grades
  (1 platinum, 2 gold, 6 silver, 46 bronze), each with a short
  guide written for this planner and its sources (Exophase and
  PSNProfiles).
- **5-stage roadmap**: Story (12) → Stranger strands (7) →
  Activities (8) → Collectibles & counts (5) → Cleanup & platinum
  (23), each stage showing its own progress and its missable
  trophies.
- **9 missable trophies**, each with the reason it can be missed
  spelled out from its official description.
- **Checklist that persists** in localStorage, with a progress bar,
  per-grade counts, and JSON export / validated import.
- **Filters and search** by grade, kind, status and stage, plus a
  **spoiler toggle** that hides the 17 story trophies you have not
  earned yet.
- **Next up** button: the earliest stage first, missable trophies
  prioritised.

Two honest limits: the per-trophy hidden flags are left unset because
no public source marks them per trophy, and the missable flags are
reasoned interpretations, not officially confirmed facts — the guide
says so where it matters instead of guessing.

## Try it

```sh
node serve.ts
# open http://localhost:8080
```

## Files

- `app/` — the planner (HTML, CSS, ES modules, `app/data/trophies.json`)
- `screenshots/` — 4 renders from the app itself
- `main.ts` — entrypoint: hands `app/` and `screenshots/` to the
  grader and writes `dossier.json`
- `serve.ts` — tiny static server for local tries

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Node 22, standard library only. No network requests, no tracking.

> **New to make.fun? Sign up with my referral link:** [https://make.fun/r/njrtxptt](https://make.fun/r/njrtxptt)
> My referral code is `njrtxptt`.
