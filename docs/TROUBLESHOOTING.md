# Troubleshooting

## `registry access is disabled`

The manifest has `registry.upstream`, but the invocation omitted `--allow-network`. Confirm the input is public and the network run is intended, then add the flag. Do not solve this by placing credentials in the manifest.

## Every date fails at install

Inspect the bounded stderr and `failureKind`. Confirm the working directory, argv, pinned Node/npm version, package source, and whether offline mode has the needed tarballs. A missing historical version and an unavailable tarball are different failures.

## The historical `latest` tag looks surprising

The public packument has version publication times but no tag-event history. When the current tag points past the cutoff, v0 selects the newest retained publication. Treat that as an explicit approximation, not a reconstructed tag fact.

## A command is `blocked`

The runner stops after the first failing stage. Fix or isolate the earlier stage; `blocked` does not mean the later command was attempted.

## The child timed out or output was truncated

Increase a trusted command’s `timeoutMs` deliberately or raise `maxOutputBytes` up to the documented 1 MiB ceiling. Prefer smaller diagnostic output rather than removing bounds.

## The report differs across machines

Pin the source revision, manifest, dates, Node/npm, operating environment, environment variables, and lifecycle behavior. Result serialization is deterministic; the executed project may not be.

For a minimal report, run `npm run demo`. If the synthetic fixture passes but your public fixture does not, file a sanitized bug under [SUPPORT.md](../SUPPORT.md).
