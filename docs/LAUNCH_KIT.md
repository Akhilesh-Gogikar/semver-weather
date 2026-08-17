# Launch kit

This is an internal readiness checklist, not authorization to make the repository public.

## Proof package

- Run `npm test` on every documented runtime/platform through CI.
- Run `npm run demo` twice and compare `demo-output/weather.json` byte for byte.
- Install into an isolated prefix and run `semver-weather --help` plus the offline filter.
- Review the synthetic report for keyboard, zoom, color-independent meaning, and screen-reader structure.
- Run path/link, workflow syntax, secret/private-identifier, dependency-license, provenance, and git-history checks.

## Release review

- Confirm ownership, MIT license, repository name, default branch, branch protection, security advisories, and private/public decision.
- Ensure `package.json` and `CHANGELOG.md` agree with the intended `v0.1.0` tag.
- Verify the tag-triggered workflow only tests and creates a source release; it must not publish a registry package.
- Draft release notes from demonstrated behavior and limitations, not adoption or ecosystem-wide claims.
- Capture a report using only `fixtures/demo`; never use a customer, partner, or private repository screenshot.

## Honest launch copy

**Short description:** “Replay public npm package availability across sampled dates, classify install/build/test outcomes, and render deterministic dependency weather.”

**Demo claim:** “The included offline fixture demonstrates one failure at each stage and one passing date.”

**Required caveat:** “Semver Weather filters public packument versions; it does not reconstruct historical tag events or reimplement npm resolution.”

## After launch

Watch security advisories and issue templates, reproduce incoming reports with public/synthetic inputs, publish corrections quickly, and measure useful artifacts and independent reproductions rather than stars or attention.
