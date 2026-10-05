# Security policy

## Supported versions

| Version | Security fixes |
|---|---|
| 0.1.x | Supported while it is the current line |
| Earlier prototypes | Not supported |

## Report privately

Use a [private GitHub security advisory](https://github.com/Akhilesh-Gogikar/semver-weather/security/advisories/new). Do not open a public issue for credential exposure, proxy/request handling flaws, command-execution problems, path traversal, report injection, or dependency-chain vulnerabilities.

Include the affected version or commit, impact, a minimal synthetic reproduction, and any suggested mitigation. Never send real credentials or private registry data. You should receive an acknowledgement when practical; investigation and remediation timing depend on severity and maintainer availability. Please allow coordinated remediation before disclosure.

## Security model

Semver Weather treats packuments, manifests, child-process output, and upstream responses as untrusted inputs. Network access and command execution still occur with the invoking user’s host permissions. The tool is not a sandbox, credential broker, or safe way to execute an untrusted repository. The runner does not inject `--ignore-scripts`: an install command without it executes dependency lifecycle scripts from every sampled date. See [PRIVACY.md](docs/PRIVACY.md) and [ARCHITECTURE.md](docs/ARCHITECTURE.md).
