# Security Policy

## Supported versions

This is a single-branch portfolio project (no maintained release lines) - security fixes land on
`main` only, then roll out via the existing CI/CD pipeline to the live deployment. There is no
LTS/backport policy.

## Reporting a vulnerability

Please **do not** open a public GitHub issue for a suspected vulnerability. Instead, use
[GitHub's private vulnerability reporting](../../security/advisories/new) for this repository
(Security tab → "Report a vulnerability"), or contact the maintainer directly via the email on
the [GitHub profile](https://github.com/ronybrand).

Include, where applicable:

- A description of the vulnerability and its potential impact.
- Steps to reproduce (a minimal request/payload is ideal).
- The affected page/component.

This project is maintained on a best-effort basis (no SLA), but reports are taken seriously and
triaged as soon as possible. Since this frontend is live and publicly reachable, reports affecting
the running deployment get priority.

## Scope

In scope: the application code in this repository (`src/app`), and the CI/CD workflows that build
and ship it.

Out of scope: the [`estado`](https://github.com/ronybrand/estado) API it talks to and the
[`estado-ai-agent`](https://github.com/ronybrand/estado-ai-agent) it proxies to for the `/ask`
page, each covered by their own security policies. Dependency vulnerabilities are tracked
automatically via Dependabot and CodeQL (see badges in [README.md](README.md)) rather than manual
reports.

## What this project already does

- Automated dependency updates via Dependabot, auto-merged after CI passes, with a dedicated
  check (`dependabot-ignore-check.yml`) keeping intentional version pins from being silently
  bumped past.
- Static analysis on every push/PR via [CodeQL](.github/workflows/codeql.yml).
- No production secrets committed to the repository - the bundle is static and talks to the
  backend only through the same-origin `/api/*` path (CloudFront), never a hardcoded backend URL.
- Served over HTTPS end to end (S3 + CloudFront), with no inline secrets or API keys in the
  shipped JS bundle.
