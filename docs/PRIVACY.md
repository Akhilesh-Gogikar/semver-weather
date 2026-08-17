# Privacy

Semver Weather has no telemetry, analytics, remote assets, or hosted service. Offline fixture commands do not use the registry proxy.

## Data processed

- Manifest names, dates, cwd, argv, and environment values supplied by the user.
- Public registry responses when `--allow-network` is present.
- Child-process stdout/stderr, exit codes, and signals.
- Result JSON and HTML written to paths selected by the user.

The result records argv and bounded process output. Those can contain source paths, package names, usernames, tokens printed by a child, or other sensitive material. Review reports before sharing. Do not pass secrets in argv or commit private inputs.

## Network behavior

The built-in proxy binds loopback and does not forward authorization headers. Packument tarball URLs and arbitrary trusted child commands can still make direct requests. `--allow-network` records intent; it is not egress enforcement.

## Retention and deletion

The tool keeps no database. Generated files remain wherever the user wrote them until the user deletes them. Local package-manager caches are controlled by those tools, not Semver Weather.

Use only public or synthetic inputs in project issues and fixtures. Follow [SECURITY.md](../SECURITY.md) if a report reveals sensitive data.
