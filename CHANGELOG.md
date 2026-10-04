# Changelog

All notable changes are recorded here. The project follows semantic versioning while pre-1.0 compatibility remains intentionally limited; see [API_STABILITY.md](docs/API_STABILITY.md).

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

[0.1.0]: https://github.com/Akhilesh-Gogikar/semver-weather/releases/tag/v0.1.0
