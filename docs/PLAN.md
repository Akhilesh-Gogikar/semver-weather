# Initial plan

## Phase 0 — falsify before building

1. Confirm the first proof gate in SCOPE.md with synthetic or public inputs.
2. Identify the three closest existing OSS projects and document the exact delta.
3. Freeze one machine-checkable invariant for v0.
4. Record public sources and terms in PROVENANCE.md.
5. Stop if the proposed wedge is already covered or crosses an IP exclusion.

## Phase 1 — smallest credible artifact

1. Proxy npm packuments and filter versions by publication timestamp.
2. Run the native npm resolver in pinned Node/npm environments across sampled dates.
3. Classify install/build/test failures and render a reproducibility calendar with copyable repro commands.

## Launch prerequisites

- Deterministic fixtures and one-command local demo.
- Explainable failure output and documented limitations.
- Secret, private-domain, provenance, dependency-license, and git-history review.
- Ownership and OSS-license approval.
- No public launch until the repository owner explicitly approves visibility.
