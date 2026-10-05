# Issue seeds

These mirror the five scoped GitHub issues and keep their design context. The [live ready-for-contribution list](https://github.com/Akhilesh-Gogikar/semver-weather/issues?q=is%3Aissue+is%3Aopen+label%3A%22status%3A+ready%22) is authoritative for assignment and status, and the pinned [welcome issue](https://github.com/Akhilesh-Gogikar/semver-weather/issues/3) is the place to start. Confirm the code still matches a seed before contributing. All fixtures must be synthetic or public and all tests must remain offline unless the issue explicitly says otherwise.

## 1. Reject unknown CLI flags with an actionable error

**Title:** `Reject unknown CLI flags with an actionable error` — [#4](https://github.com/Akhilesh-Gogikar/semver-weather/issues/4), milestone `v0.2 — community evidence`

**Labels:** `good first issue`, `help wanted`, `cli`, `tests`, `difficulty: beginner`, `size: S`, `mentored`, `status: ready`

**Rationale:** `parseArgs` currently stores any `--name`; command handlers silently ignore flags they do not consume. A typo such as `--ouput` can appear successful while writing the default path. Command-specific allowlists would make the CLI safer without adding a dependency.

**Acceptance criteria:**

- Define global and command-specific allowed flags for `filter`, `proxy`, `run`, and `render`.
- Reject an unknown flag before file, process, or network work begins; include the flag and command in the error.
- Preserve `--help`, `--version`, boolean flags, and `--output -` behavior.
- Add tests for one typo per command and one successful command with every supported flag.
- Update the usage text only if validation exposes an undocumented flag.

**Test plan:** Run `npm test`; directly invoke a typo and assert nonzero exit/stderr; run `npm run demo` to prove valid manifests are unchanged.

**Skills:** Basic JavaScript, CLI argument validation, Node test runner.

**Estimated scope:** 3–5 hours.

**Likely files:** `src/semver-weather.js`, `test/semver-weather.test.js`, possibly `README.md`.

## 2. Add a fully offline integration test for the loopback packument proxy

**Title:** `Add a fully offline integration test for the loopback packument proxy` — [#5](https://github.com/Akhilesh-Gogikar/semver-weather/issues/5), milestone `v0.2 — community evidence`

**Labels:** `help wanted`, `proxy`, `tests`, `difficulty: intermediate`, `size: M`, `status: ready`

**Rationale:** Filtering is unit-tested, but the HTTP boundary—method handling, upstream response parsing, headers, and server cleanup—is not. A synthetic loopback upstream can exercise this without public network access.

**Acceptance criteria:**

- Start a loopback-only synthetic upstream and the Semver Weather proxy on ephemeral ports.
- Verify a packument response is cutoff-filtered and canonical JSON is returned.
- Verify a non-packument GET passes through, a POST returns 405, and malformed JSON advertised as JSON returns a bounded 502 error.
- Close both servers in test cleanup even when an assertion fails; leave no listening handles.
- Do not contact any external host or add a dependency.

**Test plan:** Run the new test repeatedly and under `npm test`; confirm the suite exits rather than hanging and `npm run demo` remains unchanged.

**Skills:** Node `http`, promises, lifecycle cleanup, integration testing.

**Estimated scope:** 1 focused day.

**Likely files:** `test/semver-weather.test.js`, `src/semver-weather.js` only if a boundary bug is exposed.

## 3. Emit deterministic sidecar diagnostics for excluded packument versions

**Title:** `Emit deterministic sidecar diagnostics for excluded packument versions` — [#6](https://github.com/Akhilesh-Gogikar/semver-weather/issues/6), milestone `v0.2 — community evidence`

**Labels:** `help wanted`, `observability`, `api`, `difficulty: intermediate`, `size: M`, `status: ready`

**Rationale:** `filterPackument` correctly excludes future, missing-time, and invalid-time versions, but users only see the filtered packument. A sidecar can explain exclusions without adding non-registry fields or changing existing output bytes.

**Acceptance criteria:**

- Design an optional `filter --diagnostics FILE` output; existing invocations and filtered JSON remain byte-identical.
- Report cutoff, retained count, excluded versions grouped by `future`, `missing-time`, and `invalid-time`, plus whether `latest` used the publication fallback.
- Sort all version lists and serialize diagnostics canonically; include a small schema version.
- Reject ambiguous use when both primary output and diagnostics target stdout.
- Document that diagnostics describe input validation, not historical tag truth.

**Test plan:** Add a synthetic packument containing one version in each exclusion group; assert exact diagnostics and unchanged existing fixture output; run demo/tests twice and compare bytes.

**Skills:** JavaScript data modeling, deterministic serialization, CLI UX.

**Estimated scope:** 1–2 days.

**Likely files:** `src/semver-weather.js`, `test/semver-weather.test.js`, `fixtures/demo/packument.json` or a new focused fixture, `README.md`, `docs/API_STABILITY.md`.

## 4. Test and harden child timeout escalation across supported platforms

**Title:** `Test and harden child timeout escalation across supported platforms` — [#7](https://github.com/Akhilesh-Gogikar/semver-weather/issues/7), milestone `v0.2 — community evidence`

**Labels:** `help wanted`, `advanced`, `reliability`, `cross-platform`, `difficulty: advanced`, `size: L`, `status: ready`

**Rationale:** `runCommand` sends a termination signal and escalates after two seconds, but that path is untested and process semantics differ across operating systems. A stuck child must not hang the runner or leave descendants behind.

**Acceptance criteria:**

- Add a synthetic child fixture that exceeds a short timeout without network or filesystem side effects.
- Assert `failureKind: "timeout"`, the stage classification, blocked later stages, bounded logs, and prompt suite completion.
- Document and implement the best available process-tree cleanup for each supported platform without using a shell.
- Avoid timing assertions tight enough to be flaky in shared CI; always clean up spawned children.
- Record any unavoidable platform limitation in troubleshooting/security docs.

**Test plan:** Run the focused test repeatedly on each CI platform, then the full matrix and offline demo. Inspect for orphan processes after a forced failure.

**Skills:** Advanced Node child processes, signals, Windows process behavior, race-resistant tests.

**Estimated scope:** 2–4 days.

**Likely files:** `src/semver-weather.js`, `test/semver-weather.test.js`, a new `fixtures/process/` script, `docs/TROUBLESHOOTING.md`, `docs/ARCHITECTURE.md`.

## 5. Define versioned JSON Schemas for manifests and result schemaVersion 1

**Title:** `Define versioned JSON Schemas for manifests and result schemaVersion 1` — [#8](https://github.com/Akhilesh-Gogikar/semver-weather/issues/8), milestone `v0.2 — community evidence`

**Labels:** `advanced`, `api`, `design`, `documentation`, `difficulty: advanced`, `size: L`, `status: ready`

**Rationale:** The README and runtime checks describe the contract, but integrators do not have a portable machine-readable schema. Schemas can stabilize tooling without moving resolution logic into this project.

**Acceptance criteria:**

- Propose separate, versioned schemas for the run manifest and result `schemaVersion: 1`; discuss the draft in the issue before implementation.
- Cover date-list versus sampling exclusivity, argv command forms, stage/result classifications, nullable process fields, bounded logs, and extensible unknown fields.
- Validate all repository fixtures/results in a dependency-free test or a clearly justified development-only approach.
- Document compatibility rules, schema locations, and how optional fields evolve before 1.0.
- Do not claim that schema validity makes commands safe or results reproducible.

**Test plan:** Positive checks for the demo manifest/result; negative checks for conflicting date sources, shell strings, invalid classifications, and missing schema version; existing tests and demo unchanged.

**Skills:** JSON Schema, API evolution, test design, technical writing.

**Estimated scope:** 2–3 days including design review.

**Likely files:** new `schemas/manifest-v1.json`, new `schemas/result-v1.json`, `test/project-metadata.test.js` or a focused schema test, `docs/API_STABILITY.md`, `README.md`.
