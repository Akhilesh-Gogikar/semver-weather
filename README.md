# Semver Weather

> **Private incubation repository. Do not publish or announce yet.**

Time-travel npm dependency resolution and reproducibility calendars.

## Problem

Dependency manifests are time-varying programs: the same semver ranges can resolve differently on different dates, while old projects without complete lockfiles are difficult to reconstruct.

## Planned v0

- Proxy npm packuments and filter versions by publication timestamp.
- Run the native npm resolver in pinned Node/npm environments across sampled dates.
- Classify install/build/test failures and render a reproducibility calendar with copyable repro commands.

## Non-goals

- Reimplementing npm dependency resolution.
- Supporting PyPI, Cargo, or private registries in v0.
- Claiming ecosystem-wide results before a reproducible benchmark exists.

## Repository state

This repository contains only the clean-room project brief and planning scaffold. No implementation has started.

- Scope and exclusions: [SCOPE.md](SCOPE.md)
- Source/provenance log: [PROVENANCE.md](PROVENANCE.md)
- Initial execution plan: [docs/PLAN.md](docs/PLAN.md)

## Licensing

No public license is granted while this repository is private. Select an OSS license only after ownership and third-party provenance review.
