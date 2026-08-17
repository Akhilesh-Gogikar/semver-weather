# Semver Weather

[![CI](https://github.com/akigogikar/semver-weather/actions/workflows/ci.yml/badge.svg)](https://github.com/akigogikar/semver-weather/actions/workflows/ci.yml)
[![License](https://img.shields.io/github/license/akigogikar/semver-weather)](LICENSE)

> **Status:** 0.1.0 launch candidate in a private repository. It is usable for synthetic and public-package experiments, but has not completed the owner’s public-launch review and is not published to a package registry.

Semver Weather asks a narrow question: **would this npm project have installed, built, and tested on each sampled date?** It filters public registry packuments at a publication cutoff, delegates dependency resolution to native npm, classifies the first failing stage, and emits deterministic JSON plus a static weather calendar.

## Install from a local checkout

Requires Node.js 20 or newer. CI tests Node.js 20, 22, and 24 on Linux, plus the current Node.js 24 line on macOS and Windows. There are no runtime dependencies.

```sh
git clone https://github.com/akigogikar/semver-weather.git
cd semver-weather
npm install --global .
semver-weather --help
```

For a repository-only workflow, replace `semver-weather` below with `node src/semver-weather.js` and skip the global install.

## One-command offline demo

```sh
npm run demo
```

Open `demo-output/weather.html` locally. The synthetic four-date fixture intentionally produces install, build, test, and passing outcomes. It performs no registry access, and repeated runs produce byte-identical JSON.

Filter a captured packument without network access:

```sh
semver-weather filter fixtures/demo/packument.json \
  --cutoff 2025-02-15 --output filtered.json
```

## Sample a project

Commands are argv arrays, never shell strings. `{date}` and `{registry}` placeholders are replaced by the runner.

```json
{
  "name": "my-project",
  "sampling": { "start": "2024-01-01", "end": "2024-06-01", "stepDays": 30 },
  "cwd": "../project",
  "commands": {
    "install": ["npm", "install", "--ignore-scripts"],
    "build": ["npm", "run", "build"],
    "test": { "argv": ["npm", "test"], "timeoutMs": 120000 }
  }
}
```

```sh
semver-weather run manifest.json --json weather.json --html weather.html
```

`dates: ["YYYY-MM-DD", ...]` can replace `sampling`. Date-only cutoffs include the entire UTC day. The runner exports `SEMVER_WEATHER_DATE`; without `--allow-network`, it also sets npm’s offline flag.

## Opt-in public-registry proxy

Registry access is refused unless explicitly enabled:

```json
{
  "name": "public-registry-sample",
  "dates": ["2024-01-01"],
  "cwd": "../project",
  "registry": { "upstream": "https://registry.npmjs.org/" },
  "commands": { "install": ["npm", "install", "--ignore-scripts"] }
}
```

```sh
semver-weather run manifest.json --allow-network
```

The runner starts a loopback packument proxy, changes its cutoff for each sequential sample, and points native npm at it. A standalone proxy is available for controlled experiments:

```sh
semver-weather proxy --cutoff 2024-01-01 --allow-network --port 4873
```

## Output

The versioned result JSON records runtime, network mode, sample date, argv, bounded stdout/stderr, exit status, and a single-date repro command. A sample is `pass`, `install-failure`, `build-failure`, or `test-failure`; later stages are `blocked` after the first failure. HTML reports are escaped, keyboard-readable, script-free, and contain no remote assets.

## Honest boundaries

- This is an evidence-producing MVP, not a historical dependency resolver. Native npm resolves the filtered metadata.
- Public packuments expose version publication times, not historical tag mutations. If `latest` points to an excluded version, v0 uses the most recently published retained version.
- Non-version packument metadata is current rather than historically reconstructed.
- Tarballs can be downloaded directly from URLs inside packuments. `--allow-network` is a consent gate, not a network sandbox.
- The proxy supports unauthenticated reads; it does not forward credentials, audit writes, private registries, or registry mutations.
- Reproducibility still requires a pinned source revision, Node/npm, operating environment, and lifecycle behavior. Wall-clock timings are intentionally omitted.
- PyPI, Cargo, private registries, and ecosystem-wide claims are out of scope for 0.1.x.

## Project navigation

- Design: [architecture](docs/ARCHITECTURE.md), [API stability](docs/API_STABILITY.md), [roadmap](ROADMAP.md)
- Operations: [troubleshooting](docs/TROUBLESHOOTING.md), [privacy](docs/PRIVACY.md), [accessibility](docs/ACCESSIBILITY.md)
- Community: [contributing](CONTRIBUTING.md), [conduct](CODE_OF_CONDUCT.md), [support](SUPPORT.md), [governance](GOVERNANCE.md)
- Safety: [security policy](SECURITY.md), [provenance](PROVENANCE.md), [scope](SCOPE.md)
- Release: [changelog](CHANGELOG.md), [launch kit](docs/LAUNCH_KIT.md), [MIT license](LICENSE)
- Related experiments: [optional ecosystem map](ECOSYSTEM.md)

Security vulnerabilities should be reported through a [private security advisory](https://github.com/akigogikar/semver-weather/security/advisories/new), never a public issue.
