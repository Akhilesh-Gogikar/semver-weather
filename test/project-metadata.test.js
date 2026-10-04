"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const required = [
  "LICENSE", "CONTRIBUTING.md", "CODE_OF_CONDUCT.md", "SECURITY.md", "SUPPORT.md",
  "GOVERNANCE.md", "ROADMAP.md", "CHANGELOG.md", "ECOSYSTEM.md",
  "docs/ARCHITECTURE.md", "docs/TROUBLESHOOTING.md", "docs/API_STABILITY.md",
  "docs/PRIVACY.md", "docs/ACCESSIBILITY.md", "docs/LAUNCH_KIT.md", "docs/ISSUE_SEEDS.md", ".github/workflows/ci.yml",
  ".github/workflows/release.yml", ".github/dependabot.yml",
  ".github/CODEOWNERS",
  ".github/ISSUE_TEMPLATE/bug.yml", ".github/ISSUE_TEMPLATE/feature.yml",
  ".github/ISSUE_TEMPLATE/config.yml", ".github/pull_request_template.md",
];

test("release and community metadata is internally consistent", () => {
  for (const relative of required) assert.ok(fs.existsSync(path.join(root, relative)), `missing ${relative}`);
  const metadata = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  assert.equal(metadata.version, "0.1.0");
  assert.equal(metadata.license, "MIT");
  assert.equal(metadata.private, true);
  assert.equal(metadata.bin["semver-weather"], "src/semver-weather.js");
  assert.match(fs.readFileSync(path.join(root, metadata.bin["semver-weather"]), "utf8"), /const VERSION = "0\.1\.0"/);
  const license = fs.readFileSync(path.join(root, "LICENSE"), "utf8");
  assert.match(license, /Copyright \(c\) 2026 Akhilesh Gogikar/);
  assert.equal(
    fs.readFileSync(path.join(root, ".github/CODEOWNERS"), "utf8").trim(),
    "* @Akhilesh-Gogikar",
  );
  const release = fs.readFileSync(path.join(root, ".github/workflows/release.yml"), "utf8");
  assert.match(release, /gh release create/);
  assert.doesNotMatch(release, /npm publish|publish[- ]to[- ]pypi/i);
});
