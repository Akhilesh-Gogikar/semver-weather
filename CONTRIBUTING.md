# Contributing to Semver Weather

Semver Weather accepts narrowly scoped contributions that improve reproducible evidence for public npm package history. Start with an issue before substantial work so a proposal can be checked against [SCOPE.md](SCOPE.md) and the current [roadmap](ROADMAP.md).

## Local setup

1. Use Node.js 20, 22, or 24.
2. Run `npm install --ignore-scripts`; the project has no runtime dependencies.
3. Run `npm test` and `npm run demo` before editing.
4. Make the smallest change that demonstrates the behavior with a synthetic or public input.

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

Describe the user-visible behavior, fixture provenance, risk, and rollback. Keep unrelated refactors out. Maintainers may ask for a smaller proof before accepting broader support. By contributing, you agree that your contribution is licensed under the repository’s [MIT License](LICENSE) and that you have the right to submit it.
