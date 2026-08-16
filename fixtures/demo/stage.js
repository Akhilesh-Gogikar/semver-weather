#!/usr/bin/env node
"use strict";

const [stage, date] = process.argv.slice(2);
const failures = {
  "2025-01-01": "install",
  "2025-02-01": "build",
  "2025-03-01": "test"
};
if (failures[date] === stage) {
  process.stderr.write(`synthetic ${stage} failure on ${date}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(`${stage} passed on ${date}\n`);
}
