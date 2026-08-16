# Semver Weather

> **Private incubation repository. Do not publish or announce yet.**

Semver Weather answers a narrow question: **would this npm project have installed, built, and tested on each sampled date?** It filters public npm packuments at a publication cutoff, delegates resolution to native npm, classifies the first failing stage, and emits deterministic JSON plus a static weather calendar.

## Quickstart (offline)

Requires Node.js 20 or newer. There are no runtime or test dependencies.

```sh
npm test
npm run demo
open demo-output/weather.html
```

The demo is entirely synthetic. Its four dates intentionally produce install, build, test, and passing outcomes. Running it twice produces byte-identical JSON.

Filter a captured public packument without network access:

```sh
node src/semver-weather.js filter fixtures/demo/packument.json \
  --cutoff 2025-02-15 --output filtered.json
```

## Sampling manifest

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
node src/semver-weather.js run manifest.json --json weather.json --html weather.html
```

`dates: ["YYYY-MM-DD", ...]` can replace `sampling`. Date-only cutoffs include that entire UTC day. The runner exports `SEMVER_WEATHER_DATE`; without `--allow-network`, it also sets npm's offline flag.

## Native npm with the time-filter proxy

Network access is deliberately refused unless it is explicitly enabled:

```json
{
  "name": "public-npm-sample",
  "dates": ["2024-01-01"],
  "cwd": "../project",
  "registry": { "upstream": "https://registry.npmjs.org/" },
  "commands": { "install": ["npm", "install", "--ignore-scripts"] }
}
```

```sh
node src/semver-weather.js run manifest.json --allow-network
```

The runner starts a loopback packument proxy, changes its cutoff for each sequential sample, and points native npm at it. A standalone proxy is also available:

```sh
node src/semver-weather.js proxy --cutoff 2024-01-01 --allow-network --port 4873
```

## Output and classifications

The JSON schema records runtime, network mode, sample date, argv, bounded stdout/stderr, exit status, and a copyable single-date repro command. A sample is `pass`, `install-failure`, `build-failure`, or `test-failure`; later stages are `blocked` after the first failure. Reports contain no JavaScript or remote assets.

## Important limitations

- This is an evidence-producing MVP, not a historical npm resolver. Native npm still resolves the filtered metadata.
- npm packuments expose version publication times, not historical tag mutations. If `latest` points to a future version, the proxy uses the most recently published retained version.
- Non-version packument metadata is current, not historically reconstructed.
- Tarball downloads can go directly to URLs in packuments. `--allow-network` is a consent gate, not a network sandbox; trusted child commands can access anything the host permits.
- The proxy supports public, unauthenticated packument reads only. It does not forward credentials, audit POSTs, private registries, or registry writes.
- Reproducibility still requires pinning Node/npm, OS/container, source revision, environment, and any package lifecycle behavior. The report intentionally omits wall-clock timings.
- No public license is granted. Ownership, license, trademark, security, contractual, and provenance review remain release gates.

See [SCOPE.md](SCOPE.md), [PROVENANCE.md](PROVENANCE.md), and [docs/PLAN.md](docs/PLAN.md).
