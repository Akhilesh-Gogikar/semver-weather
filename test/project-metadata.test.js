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
  "docs/PRIVACY.md", "docs/ACCESSIBILITY.md", "docs/ISSUE_SEEDS.md", ".github/workflows/ci.yml",
  ".github/workflows/release.yml", ".github/dependabot.yml",
  ".github/CODEOWNERS",
  ".github/ISSUE_TEMPLATE/bug.yml", ".github/ISSUE_TEMPLATE/feature.yml",
  ".github/ISSUE_TEMPLATE/config.yml", ".github/pull_request_template.md",
];

test("release and community metadata is internally consistent", () => {
  for (const relative of required) assert.ok(fs.existsSync(path.join(root, relative)), `missing ${relative}`);
  const metadata = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  assert.equal(metadata.version, "0.1.1");
  assert.equal(metadata.license, "MIT");
  assert.equal(metadata.private, true);
  assert.equal(metadata.bin["semver-weather"], "src/semver-weather.js");
  assert.match(fs.readFileSync(path.join(root, metadata.bin["semver-weather"]), "utf8"), /const VERSION = "0\.1\.1"/);
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

test("ecosystem map and docs name only public tools", () => {
  // Allowlist, never a denylist: unreleased sibling tools must not be named or
  // linked until they are public. Add a repository here only after it is public.
  const publicTools = new Set(["semver-weather", "releasefence", "directivegraph", "sdk-wirediff", "reviewbus"]);
  const ownerRepos = (text) => new Set([...text.matchAll(/github\.com\/Akhilesh-Gogikar\/([A-Za-z0-9-]+)/g)].map(([, name]) => name.toLowerCase()));
  const ecosystem = fs.readFileSync(path.join(root, "ECOSYSTEM.md"), "utf8");
  const entries = ecosystem.split("\n").filter((line) => /^\s*[-*|]/.test(line));
  assert.equal(entries.length, publicTools.size, "every ECOSYSTEM.md list item or table row must be an allowlisted public tool");
  assert.deepEqual(ownerRepos(ecosystem), publicTools);
  assert.match(ecosystem, /optional and informational/);

  const skip = new Set([".git", "node_modules", "demo-output"]);
  const docs = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (skip.has(entry.name)) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(md|ya?ml)$/i.test(entry.name)) docs.push(full);
    }
  };
  walk(root);
  for (const file of docs) {
    for (const name of ownerRepos(fs.readFileSync(file, "utf8"))) {
      assert.ok(publicTools.has(name), `${path.relative(root, file)} links unreleased Akhilesh-Gogikar/${name}`);
    }
  }
});

test("maintainer launch planning stays out of the repository", () => {
  for (const relative of ["docs/LAUNCH_KIT.md", "docs/PLAN.md"]) {
    assert.ok(!fs.existsSync(path.join(root, relative)), `${relative} should live outside the repository`);
  }
});
