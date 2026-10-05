# Architecture

Semver Weather is one Node.js standard-library CLI with four commands. The small shape is intentional: it keeps dependency resolution delegated to native npm and makes the trust boundary reviewable.

## Components

1. **`filter`** reads a captured packument, validates `versions` and `time`, retains versions published by the cutoff, repairs an excluded `latest` tag with the newest retained publication, and writes canonical JSON.
2. **`proxy`** accepts loopback GET/HEAD requests, fetches an explicitly configured upstream, filters packument-shaped JSON, and returns other successful bodies unchanged. It never forwards credentials.
3. **`run`** expands explicit UTC dates, optionally starts one sequential cutoff-aware proxy, substitutes `{date}`/`{registry}` in argv arrays, executes install/build/test, and stops later stages after the first failure.
4. **`render`** converts result JSON to escaped, static, accessible HTML without scripts or remote assets.

## Data flow

`manifest → dates → optional proxy cutoff → child stages → classified samples → canonical JSON → static HTML`

Stable output excludes wall-clock duration and generation timestamps. Object keys are recursively sorted; arrays preserve semantic order. Child stdout and stderr are bounded. The same fixture, source, environment, and runtime should therefore produce byte-identical result JSON.

## Trust boundaries

- Manifests choose executable argv and working directory; only trusted manifests and repositories should be run.
- `--allow-network` permits network use but does not confine child processes or tarball URLs.
- Registry JSON, child output, and result JSON are escaped/validated at their next boundary.
- The proxy is loopback-only and public/unauthenticated by design.

See [PRIVACY.md](PRIVACY.md), [SECURITY.md](../SECURITY.md), and [API_STABILITY.md](API_STABILITY.md).
