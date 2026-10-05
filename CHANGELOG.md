# Changelog

All notable changes are recorded here. The project follows semantic versioning while pre-1.0 compatibility remains intentionally limited; see [API_STABILITY.md](docs/API_STABILITY.md).

## [Unreleased]

## [0.1.1] - 2026-10-05

### Added

- Contributor pathways, scoped issue seeds linked to live issues, a pull-request template, issue-form guidance, and a social-preview asset.

### Changed

- Move the repository to `Akhilesh-Gogikar`, keep maintainer launch planning out of the repository, and list related tools only after they are public.
- CLI help describes the tool as alpha rather than a private MVP.
- Clarify that only the opt-in registry proxy time-filters metadata, that child commands are not network-sandboxed, that `--allow-network` without `registry.upstream` resolves against today's registry, and that the runner never adds `--ignore-scripts`.
- Global install instructions use `--ignore-scripts`.

### Security

- CI and release checkouts no longer persist the GitHub token while project code runs.

## [0.1.0] - 2026-08-17

### Added

- Deterministic npm packument filtering by publication cutoff.
- Explicitly opt-in loopback registry proxy for public packument reads.
- Date sampler with argv-based install, build, and test stages.
- Stable JSON results, failure classification, repro commands, and script-free HTML calendar.
- Synthetic offline fixtures and tests for determinism, stages, and network consent.
- Local CLI package metadata, community policies, CI, and source-only tag release automation.

### Security and privacy

- Network-backed operation is disabled unless requested.
- Command output is bounded; credentials are not forwarded by the proxy.
- The tool remains unsuitable for untrusted projects or private registry data.

[Unreleased]: https://github.com/Akhilesh-Gogikar/semver-weather/compare/v0.1.1...HEAD
[0.1.1]: https://github.com/Akhilesh-Gogikar/semver-weather/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/Akhilesh-Gogikar/semver-weather/releases/tag/v0.1.0
