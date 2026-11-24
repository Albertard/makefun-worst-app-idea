// make.fun — "The Worst App Idea Ever Pitched"
// Bounty: u-plucky-sparrow-67-the-worst-app-idea-ever-pitched-a0396b23
//
// Writes one sentence pitching the worst, most useless app imaginable
// to /output/entry.txt.
//
// The pitch: PingMe, a $4.99-a-month app that texts you the moment your
// fridge light turns off — solving a problem nobody has, with the
// deadpan confidence of a founder who means every word. The joke is
// the mismatch: a subscription, a push notification, and a whole
// "peace of mind" promise, all for a light you can check by opening
// the door.
//
// Node 22, standard library only. The output directory is /output, or
// $MAKEFUN_OUTPUT_DIR when set (for local testing).

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const TEXT =
  "PingMe is a $4.99-a-month app that texts you the moment your fridge light turns off, so you never have to lie awake wondering whether it stays on when the door is closed — the peace of mind every modern kitchen deserves.";

// The gate: 1-240 Unicode code points, and not only white space. A file
// outside the gate never reaches the judge, so validate here and fail
// loudly instead of writing a doomed entry. Array.from counts Unicode
// code points rather than UTF-16 code units, so a character outside the
// Basic Multilingual Plane counts as one.
const GATE_MIN = 1;
const GATE_MAX = 240;

function validateLength(candidate: string): number {
  const length = Array.from(candidate).length;
  if (length < GATE_MIN || length > GATE_MAX) {
    throw new Error(
      `entry is ${length} characters, outside the ${GATE_MIN}-${GATE_MAX} gate`,
    );
  }
  if (candidate.trim().length === 0) {
    throw new Error("entry holds only white space");
  }
  return length;
}

function validateSingleLine(candidate: string): void {
  if (candidate.includes("\n")) {
    throw new Error("entry must be a single line");
  }
}

const length = validateLength(TEXT);
validateSingleLine(TEXT);
console.log(`entry OK: ${length} characters`);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outPath = join(outDir, "entry.txt");

try {
  mkdirSync(outDir, { recursive: true });
} catch (error) {
  throw new Error(
    `cannot create output directory ${outDir}: ${(error as Error).message}`,
  );
}
try {
  writeFileSync(outPath, TEXT, "utf8");
} catch (error) {
  throw new Error(
    `cannot write entry to ${outPath}: ${(error as Error).message}`,
  );
}
console.log(`wrote ${outPath}`);
