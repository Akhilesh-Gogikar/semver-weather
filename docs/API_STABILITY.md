# API stability

Semver Weather is pre-1.0. Compatibility is deliberate but not yet permanent.

## Stable within 0.1.x

- CLI command names: `filter`, `proxy`, `run`, and `render`.
- Exit status: zero on success and nonzero on rejected input or failed operation.
- Manifest concepts: explicit dates/sampling, argv-based install/build/test, optional public upstream, and bounded output.
- Result `schemaVersion: 1`, sample classifications, stage status, and canonical JSON encoding.

Patch releases may add optional fields or commands, improve validation, and fix behavior without changing existing field meaning. Consumers must ignore unknown object fields.

## Allowed before 1.0

A minor release may remove an unsafe approximation, tighten validation, or change a pre-1.0 field after changelog and migration notes. File ordering, human-readable stderr text, HTML markup/classes, CSS, and internal exported JavaScript helpers are not stable APIs. The HTML remains a report for people, not a scraping contract.

Deprecations should span at least one minor release when security and correctness allow. Security fixes may require immediate breaking changes.
