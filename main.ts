// HomeLedger hand-in program (Node 22, standard library only).
//
// The site lives in app/ next to this file: plain static files a browser
// opens at app/index.html, with nothing fetched over the network. This
// program hands it in: it copies app/ and screenshots/ into the output
// directory and writes dossier.json there, the summary the judge reads
// (screenshots, first-load files and bytes, and the site's source), built
// with the make.fun library in vendor/makefun-frontend.ts. That vendor
// file is the kit's copy, unchanged: the scorer rebuilds the dossier with
// its own copy and requires the two to match byte for byte.
//
// HomeLedger is a household budget planner: monthly income and expenses,
// category budgets with progress bars, a transactions ledger with filters,
// and a reports view with charts — all state kept in localStorage, so a
// household's numbers stay on its own device. The four screenshots show
// the dashboard, the transactions ledger, the phone budgets view, and the
// reports charts.
//
// Run it outside the grader with MAKEFUN_OUTPUT_DIR standing in for
// /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the bytes; the others refuse an entry the
// scorer would refuse (more than 4 screenshots or one over 256 KiB; more than 993 files and directories in app/ or
// 16 MiB of app files: app/ counts beside /output's own 1000-entry cap, its screenshots/ and dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 }),
);
