// Leonida Platinum Planner — entrypoint (Node 22, standard library only).
//
// The guide itself is plain static files under app/ (HTML, CSS, ES modules, JSON data),
// with 3–4 screenshots under screenshots/. This program hands the guide in: it copies
// app/ and screenshots/ from beside this file into the output directory and writes
// output/dossier.json with the vendored make.fun library, which summarises the app
// (its screenshots, first-load files and bytes, and source) for the judge.
//
// The vendor library must stay exactly as the kit shipped it: the scorer rebuilds the
// dossier with its own copy and compares the two byte for byte.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

// The scorer's caps, from the kit's gate: the dossier text is capped at 160 KiB,
// at most 4 screenshots of at most 256 KiB each, app/ at most 993 files and
// directories and 48 MiB. Anything past a cap fails the entry, so refuse it here
// with the library's own error instead of handing in a broken dossier.
writeFileSync(
  join(outputDir, 'dossier.json'),
  buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);
