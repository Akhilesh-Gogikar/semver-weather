# Contributing to Semver Weather

Semver Weather accepts narrowly scoped contributions that improve reproducible evidence for public npm package history. Start with an issue before substantial work so a proposal can be checked against [SCOPE.md](SCOPE.md) and the current [roadmap](ROADMAP.md).

## Local setup

1. Use Node.js 20, 22, or 24.
2. Run `npm install --ignore-scripts`; the project has no runtime dependencies.
3. Run `npm test` and `npm run demo` before editing.
4. Make the smallest change that demonstrates the behavior with a synthetic or public input.

## Contributor pathways

Choose the smallest rung that matches your confidence; movement between rungs is expected, not ranked.

1. **Reproducer / documenter (`good first issue`)** — run the offline demo, improve a failure explanation, add one validation case, or make a report easier to use. Typical scope: a few hours and one or two files.
2. **Fixture / implementation contributor (`help wanted`)** — add a synthetic edge case, proxy integration test, diagnostic, or bounded process behavior. Typical scope: one to two focused days.
3. **Design contributor (`advanced`)** — propose versioned schemas, compatibility policy, or cross-platform process semantics. Start with a written design and proof fixture before code.
4. **Reviewer / steward** — reproduce pull requests, check clean-room provenance, accessibility, privacy, and deterministic output, then help triage related reports.

The [prepared issue seeds](docs/ISSUE_SEEDS.md) describe five concrete starting points with acceptance criteria and likely files. When a corresponding issue exists, comment with your intended approach before coding. A claim is coordination, not ownership; if no update appears for 14 days, another contributor may ask to continue it.

## Triage and recognition

The maintainer targets an initial label/scope response within seven calendar days, but this is not an SLA. Security reports use the private route and a separate timetable. Triage favors reproducible public/synthetic evidence, v0 scope, and the smallest reviewable change.

Merged contributors are credited in commit history and material release notes. Repeated reviewers and fixture authors may be named in release acknowledgements and invited to review within their demonstrated area. Recognition never requires sharing a real name or employer.

## Clean-room requirements

- Do not contribute private packages, lockfiles, prompts, traces, customer/partner material, credentials, or unpublished requirements.
- Record every new public specification, fixture, dataset, or generated asset in [PROVENANCE.md](PROVENANCE.md), including terms.
- Do not add private-registry support, credential forwarding, or another package ecosystem in a drive-by change.
- Report a suspected vulnerability privately under [SECURITY.md](SECURITY.md).

## Engineering expectations

- Prefer Node’s standard library and argv arrays; a new dependency needs a concrete security and maintenance justification.
- Keep network access explicit. Offline tests must remain offline.
- Preserve canonical JSON and exclude nondeterministic timestamps or durations from stable results.
- Add one small runnable test for non-trivial logic. Update accessibility and privacy documentation when report or capture behavior changes.
- Run `npm test`, `npm run demo`, and `git diff --check` before opening a pull request.

## Pull requests

Describe the user-visible behavior, fixture provenance, risk, and rollback; link the issue with `Closes #…`. Keep unrelated refactors out. Maintainers may ask for a smaller proof before accepting broader support. By contributing, you agree that your contribution is licensed under the repository’s [MIT License](LICENSE) and that you have the right to submit it.
