# Scope

## Purpose

Dependency manifests are time-varying programs: the same semver ranges can resolve differently on different dates, while old projects without complete lockfiles are difficult to reconstruct.

## v0 boundary

- Proxy npm packuments and filter versions by publication timestamp.
- Run the native npm resolver in user-pinned Node/npm environments across sampled dates.
- Classify install/build/test failures and render a reproducibility calendar with copyable repro commands.

## Explicit non-goals

- Reimplementing npm dependency resolution.
- Supporting PyPI, Cargo, or private registries in v0.
- Claiming ecosystem-wide results before a reproducible benchmark exists.

## Clean-room exclusions

- No source, fixtures, prompts, traces, schemas, requirements, or examples from private company, partner, customer, or unpublished research repositories.
- No customer or partner names, data, incidents, screenshots, or derived requirements.
- No public release until ownership, license, trademark, security, and contractual reviews are recorded (see the 2026-10-05 launch review in [PROVENANCE.md](PROVENANCE.md)).

## First proof gate

The same repository, date, and runtime image yield byte-identical result JSON across repeated runs.
