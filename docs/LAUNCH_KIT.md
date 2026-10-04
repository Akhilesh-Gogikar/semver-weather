# Launch kit

This is an internal readiness and response plan, not authorization to make the repository public. Every public statement must be backed by the synthetic demo or a reproducible public input.

## Positioning guardrails

**One line:** Replay public package availability across sampled dates, run the project’s native install/build/test commands, and render deterministic dependency weather.

**Differentiator:** Time-filtered metadata is fed to the native resolver; Semver Weather does not implement a second dependency solver.

**Demo claim:** The included offline fixture intentionally produces one install failure, one build failure, one test failure, and one passing date.

**Required caveat:** Public packuments do not contain historical tag-event history. The `latest` fallback is based on retained publication time, not reconstructed tag truth.

Do not claim adoption, speedups, ecosystem coverage, production readiness, or failures in a named third-party project without independent evidence and disclosure review.

## Proof package before launch

- Run `npm test` and `npm run demo` twice; compare result JSON byte for byte.
- Install into an isolated prefix; run `semver-weather --version`, `--help`, and the offline filter.
- Confirm CI definitions cover the documented runtime/platform matrix and retain pinned action SHAs.
- Check relative links, YAML, secrets/private paths, provenance, package contents, and git history.
- Manually review keyboard flow, 200% zoom, focus, color-independent meaning, and screen-reader heading order.
- Confirm ownership, MIT license, advisory route, default branch, and the explicit repository-visibility decision.

## Three-minute demo script

1. **Frame the problem (20 seconds).** “A manifest with ranges is a time-varying program. Without a complete lockfile, the same source can resolve differently as packages appear.”
2. **Show the boundary (20 seconds).** Open `fixtures/demo/manifest.json`: explicit dates and argv-based install/build/test; no shell and no network.
3. **Run the proof (20 seconds).** Execute `npm run demo`.
4. **Read the report (45 seconds).** Open `demo-output/weather.html`; point to the four classifications, stage statuses, and keyboard-focusable repro command.
5. **Show deterministic evidence (30 seconds).** Open `demo-output/weather.json`; emphasize `schemaVersion`, omitted wall-clock timing, bounded output, and explicit network mode.
6. **Show time filtering (30 seconds).** Run the documented filter command and show that the February cutoff retains `1.0.0` and `1.1.0` but excludes `2.0.0`.
7. **State limits (30 seconds).** Native resolution, no historical tag events, no private-registry credentials, and `--allow-network` is consent rather than sandboxing.
8. **Invite one action (15 seconds).** Point to [prepared issue seeds](ISSUE_SEEDS.md), especially the offline proxy integration test.

## Copy for launch channels

Use one primary launch and adapt responses rather than posting the same text repeatedly. Disclose that you are the maintainer.

### Hacker News

**Title:** `Show HN: Semver Weather – replay dependency availability by date`

**Text:**

> I built Semver Weather to test a narrow reproducibility question: if a project has version ranges and no complete lockfile, would it have installed, built, and tested on a given date?
>
> It filters public package metadata at a cutoff, then delegates resolution to the native package manager. The output is deterministic JSON plus a static calendar that classifies the first failing stage and includes a repro command.
>
> The repository includes an offline synthetic demo with four dates: install failure, build failure, test failure, and pass. It does not reconstruct historical tag events or sandbox lifecycle scripts. I would value feedback on the evidence model and the prepared proxy/process/schema issues.

### Reddit

**Title:** `I made an offline-first tool to show how dependency ranges change across dates`

**Text:**

> Maintainer here. Semver Weather makes date an explicit input to dependency resolution: it filters versions published after a cutoff, runs the project’s real install/build/test argv, and emits a replayable report.
>
> The demo is synthetic and offline; it proves the four stage outcomes without claiming ecosystem-wide results. The biggest known limitation is that public metadata has publication times but not historical tag-event history.
>
> I’m looking for technical critique and contributors for five scoped issues, including an offline proxy integration test and deterministic schema work. Please use synthetic or public inputs only.

### LinkedIn

> Open-source launch candidate: Semver Weather.
>
> Dependency ranges change meaning as new versions are published. Semver Weather samples explicit dates, filters public package metadata, runs native install/build/test commands, and renders deterministic evidence of where reproducibility breaks.
>
> The included offline fixture demonstrates one failure at each stage and one passing date. It is intentionally not a new resolver, hosted service, or historical-tag oracle.
>
> I’ve published a contributor ladder and five scoped issue drafts for people interested in reproducibility, CLI testing, cross-platform processes, or schema design. I’m the maintainer and welcome evidence-based feedback.

### X

**Post 1:** `A dependency manifest with ranges is a time-varying program. Semver Weather asks: would this exact project have installed, built, and tested on each sampled date?`

**Post 2:** `It filters public package metadata by publication cutoff, delegates to the native resolver, and emits deterministic JSON + a static calendar. The offline demo shows install/build/test failures and one pass—intentionally synthetic, no adoption claims.`

**Post 3:** `Known limits are explicit: no historical tag-event reconstruction, no private credentials, no sandbox. Feedback and five scoped contributor issues: https://github.com/Akhilesh-Gogikar/semver-weather`

## FAQ

**Why not just use a lockfile?** Use one when available and trustworthy. This tool targets incomplete historical reconstruction and evidence about how ranges changed.

**Is this another resolver?** No. It changes the version metadata visible at a cutoff and invokes the native resolver.

**Does a date reproduce historical tags exactly?** No. Version publication time is available; tag-event history generally is not. The fallback is documented.

**Is the demo online?** No. The repository demo is synthetic and offline. Public-registry operation requires `--allow-network`.

**Can I run an untrusted project safely?** No. Child commands and lifecycle scripts run with host permissions. Use a disposable environment you control.

**Which ecosystems are supported?** Version 0.1.x is intentionally limited to the npm packument model. Other ecosystems need a separate proof and governance decision.

## Launch-day checklist

- [ ] Re-run the proof package at the intended commit; save command results internally.
- [ ] Confirm repository visibility, advisory route, branch rules, CI, license detection, and `v0.1.0` metadata.
- [ ] Create the five issue seeds with exact titles/labels, then replace document-only references with issue links where useful.
- [ ] Prepare one synthetic screenshot with useful alt text; inspect it for paths or identifiers.
- [ ] Publish one primary post, stay available for technical questions, and disclose maintainer status.
- [ ] Answer limits before feature requests; move reproducible defects into issue forms.
- [ ] Record corrections in the README/changelog rather than arguing from intent.

## First 30 days

### Days 1–3

- Triage actionable reports daily when possible; route security privately.
- Reproduce every claimed defect with synthetic/public input before labeling it confirmed.
- Track repeated misunderstandings and fix the README/FAQ once, not in dozens of replies.

### Week 1

- Publish a correction release only if evidence requires it; do not tag for attention.
- Welcome first contributors with bounded issues and review against the documented seven-day target.
- Measure useful signals: successful demo reproductions, minimal repros, resolved false positives, and quality issue reports—not stars.

### Weeks 2–4

- Summarize verified findings and rejected assumptions transparently.
- Promote stable issue seeds from good-first to help-wanted only when acceptance tests are clear.
- Revisit roadmap priority using reproduced pain, maintenance cost, privacy, and reviewer capacity.
- Review dependencies, advisories, CI results, accessibility feedback, and contributor recognition.
- Decide whether evidence supports 0.1.x hardening, a narrow 0.2 design, or no expansion.

## Social preview and media

- Upload [the 1280 × 640 PNG](assets/social-preview.png) in **Settings → General → Social preview** immediately before the visibility change; GitHub does not read this repository file automatically.
- Keep the adjacent SVG as the editable source and follow the [asset notes](assets/README.md).
- Capture demos with synthetic inputs only. Remove usernames, home paths, tokens, partner names, and unrelated windows.
- Provide captions, a transcript, and descriptive alt text. Verify the README image, generated HTML, and demo at 200% zoom, by keyboard, and with a real screen reader before posting.
- Do not place download, adoption, company, performance, or compatibility counts on an asset unless the source and date are public and reproducible.

## Ethical cross-promotion

Cross-link only the seven related OSS tools named in ECOSYSTEM.md, and only where a link answers the reader's next technical question. Links stay optional, disclosed, and outside runtime output. Commercial products require exact owner-approved names, URLs, relationship wording, and trademark or partner permission before inclusion.
