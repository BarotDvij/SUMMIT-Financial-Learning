#!/usr/bin/env node
// Copies packages/games/compound-match/src/ → apps/web/public/games/compound-match/
// Idempotent; safe to re-run.

import { cp, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const src = resolve(here, '..', 'src');
const dest = resolve(here, '..', '..', '..', '..', 'apps', 'web', 'public', 'games', 'compound-match');

await mkdir(dest, { recursive: true });
await cp(src, dest, { recursive: true, force: true });
console.log(`Copied ${src} -> ${dest}`);
