# Provenance log

This repository must remain independently developed from public sources and synthetic fixtures.

## Rules

- Record every specification, dataset, fixture, snippet, dependency, and generated asset before it enters the repository.
- Prefer public primary sources and link the exact version or commit.
- Do not copy from private, partner, customer, or unpublished research repositories.
- Public visibility is not a copyright license; record applicable terms.
- Stop and request ownership review when provenance is uncertain.

## Sources

| Date | Source/version | Purpose | License or terms | Notes |
|---|---|---|---|---|
| 2026-08-16 | Project brief derived from public-landscape research | Initial scope only | Owner's personal planning notes (not included) | No implementation or copied source |
| 2026-08-16 | [npm registry API package metadata](https://github.com/npm/registry/blob/main/docs/REGISTRY-API.md) | Public packument field conventions | npm registry repository terms | Implementation is independent; synthetic package data only |
| 2026-08-16 | Node.js 20 standard library documentation | CLI, HTTP proxy, process runner, tests | MIT | No runtime dependencies; no copied snippets |
| 2026-08-16 | Locally authored synthetic fixtures | Offline proof gate and demo | Original work under this repository’s MIT License | No private, customer, partner, or production data |
| 2026-08-17 | [MIT License template](https://opensource.org/license/mit) | Repository license text | MIT | Copyright line set by repository owner |
| 2026-08-17 | Node package metadata and GitHub workflow public documentation | Local install, CI, release, and community metadata | Documentation terms | Independently authored configuration; no runtime dependency added |
| 2026-08-17 | Locally authored community, architecture, privacy, and accessibility documentation | 0.1.0 readiness | MIT repository contribution | Tailored to this repository and its existing synthetic/public boundary |
| 2026-08-17 | Locally authored deterministic social-preview SVG | Repository preview and README identity | Original work under this repository’s MIT License | No external logos, fonts, screenshots, adoption claims, or partner assets; adjacent PNG is rendered from the SVG |
| 2026-10-05 | [sharp](https://sharp.pixelplumbing.com/) PNG export of the social-preview SVG | 0.1.1 social-preview raster | Apache-2.0 | Build-time rendering only with palette quantization; not a project dependency |
