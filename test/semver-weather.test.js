"use strict";

const assert = require("node:assert/strict");
const path = require("node:path");
const test = require("node:test");
const { canonicalStringify, expandDates, filterPackument, renderHtml, runSampling } = require("../src/semver-weather.js");

const root = path.resolve(__dirname, "..");

test("packument filtering is timestamp bounded and byte deterministic", () => {
  const packument = require("../fixtures/demo/packument.json");
  const filtered = filterPackument(packument, "2025-02-15");
  assert.deepEqual(Object.keys(filtered.versions), ["1.0.0", "1.1.0"]);
  assert.equal(filtered["dist-tags"].latest, "1.1.0");
  assert.equal(filtered["dist-tags"].stable, "1.1.0");
  assert.equal(canonicalStringify(filtered), canonicalStringify(filterPackument(packument, "2025-02-15")));
});

test("date sampling expands in UTC", () => {
  assert.deepEqual(expandDates({ sampling: { start: "2025-01-01", end: "2025-01-05", stepDays: 2 } }), ["2025-01-01", "2025-01-03", "2025-01-05"]);
});

test("offline runner classifies each failing stage and renders static HTML", async () => {
  const manifest = path.join(root, "fixtures/demo/manifest.json");
  const first = await runSampling(manifest);
  const second = await runSampling(manifest);
  assert.equal(canonicalStringify(first), canonicalStringify(second));
  assert.deepEqual(first.samples.map(({ classification }) => classification), ["install-failure", "build-failure", "test-failure", "pass"]);
  assert.equal(first.networkEnabled, false);
  const html = renderHtml(first);
  assert.match(html, /4 sampled dates/);
  assert.match(html, /install-failure/);
  assert.doesNotMatch(html, /<script/i);
  assert.match(html, /href="#main-content"/);
  assert.match(html, /aria-labelledby="sample-1"/);
  assert.match(html, /tabindex="0" aria-label="Reproduction command/);
});

test("registry-backed sampling requires explicit network consent", async () => {
  const fs = require("node:fs");
  const os = require("node:os");
  const source = path.join(root, "fixtures/demo/manifest.json");
  const manifest = require(source);
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "semver-weather-"));
  const guarded = path.join(temporary, "manifest.json");
  fs.writeFileSync(guarded, JSON.stringify({
    ...manifest,
    cwd: path.dirname(source),
    registry: { upstream: "https://registry.npmjs.org/" },
  }));
  await assert.rejects(runSampling(guarded), /--allow-network/);
});
