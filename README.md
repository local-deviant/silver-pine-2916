[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/local-deviant/silver-pine-2916/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/local-deviant/silver-pine-2916/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

# Leonida Platinum Planner

A single offline page that plans your road to the GTA VI platinum for the make.fun bounty `gta6-trophy-guide-01`: the full trophy list, a staged route through it, and a checklist that keeps your progress between visits.

## What is inside

- **Every trophy — 55 of them.** Each one carries its official name, description and grade: 1 platinum, 2 gold, 6 silver and 46 bronze. Every entry also gets a short how-to written for this planner, and the sources it leans on are Exophase and PSNProfiles.
- **A route in five stages.** Story (12 trophies) first, then Stranger strands (7), Activities (8), Collectibles & counts (5), and finally Cleanup & platinum (23). Each stage tracks its own completion and calls out the trophies you can miss in it.
- **Missables, flagged plainly.** 9 trophies can be missed; for each one the guide explains why, working from what the official description actually says.
- **A checklist that remembers.** Ticks are stored in localStorage, so progress survives a reload. A progress bar and per-grade counts sit on top, and you can export your progress as JSON or import a file back in (imports are validated first).
- **Find things fast.** Search and filter by grade, kind, status and stage. A spoiler toggle hides the 17 story trophies you have not unlocked yet, so the page does not spoil the plot.
- **"Next up" picks for you.** One button jumps to the next trophy worth chasing — earliest stage first, missable ones before the rest.

Two things this guide does not pretend to know: whether each trophy is hidden (no public source records that per trophy, so the flag is left blank rather than invented) and whether a trophy is truly missable (those calls are reasoned readings of the official text, not confirmed facts — the guide marks them as such wherever it matters).

## Run it locally

```sh
node serve.ts
# open http://localhost:8080
```

## What is in this repo

- `app/` — the planner itself: HTML, CSS, ES modules, and the trophy data at `app/data/trophies.json`
- `screenshots/` — 4 screenshots taken from the running app
- `main.ts` — the entrypoint: passes `app/` and `screenshots/` to the grader and writes `dossier.json`
- `serve.ts` — a small static server for trying it out

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Built on Node 22 with the standard library only. It makes no network requests and does no tracking.

> **New to make.fun? Sign up with my referral link:** [https://make.fun/r/njrtxptt](https://make.fun/r/njrtxptt)
> My referral code is `njrtxptt`.
