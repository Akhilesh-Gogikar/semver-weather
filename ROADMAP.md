# Roadmap

This roadmap is directional, not a delivery promise. Evidence gates outrank dates.

## 0.1.x — harden the npm proof

- Publish and document a versioned result schema.
- Add public-package benchmarks that can be independently reproduced without private data.
- Exercise proxy edge cases: scoped packages, redirects, missing timestamps, large packuments, and interrupted children.
- Improve accessible report navigation and machine-readable failure explanations.
- Document pinned runtime/container recipes without hiding native npm behavior.

The contribution-ready slice is maintained in [ISSUE_SEEDS.md](docs/ISSUE_SEEDS.md). Small validation and documentation issues come first; proxy/process hardening follows; schema work requires a design review. An item moves into 0.1.x only with a synthetic/public proof, deterministic test, and named reviewer.

## Candidate 0.2 work

- Compare multiple npm versions while keeping the resolver native.
- Make result-to-result comparison explicit and deterministic.
- Explore a local read-through cache with clear integrity and privacy rules.

## Not planned in this roadmap

Other package ecosystems, private-registry authentication, hosted execution, automatic lifecycle-script trust, and claims about the whole ecosystem remain out of scope. They require a new proof and governance decision rather than incremental scope creep.
