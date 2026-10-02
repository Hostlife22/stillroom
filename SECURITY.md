# Security Policy

## Supported code

Security fixes target the latest code on `main`. Older commits, forks, and separate release lines are not maintained for security fixes. Deployments should use the latest reviewed code and its committed dependency lockfile.

## Reporting a vulnerability

Do not publish exploit details, credentials, or sensitive information in a public issue or pull request.

If private vulnerability reporting is enabled, open the repository's [Security tab](https://github.com/Hostlife22/stillroom/security), choose **Report a vulnerability**, and submit a private report.

If that option is unavailable, open a public issue titled **Request for a private security contact**. Include only a request for a confidential reporting channel. Wait for a private channel before sharing technical details. This repository does not currently document a dedicated security email address.

A useful private report includes:

- The affected commit, dependency, or deployment URL.
- A description of the impact and the conditions needed to trigger it.
- Minimal reproduction steps or a proof of concept using your own data.
- Browser, operating system, and relevant configuration.
- A possible fix, if you have one.

Please allow time for investigation and coordinate public disclosure with the maintainer. There is no guaranteed response time or bug bounty program.

## Project scope

Stillroom is a static browser application hosted on GitHub Pages. The application code does not implement accounts, a backend API, a database, or an upload service. Rendering, physics, generated ambient audio, and PNG exports run in the browser.

The page loads fonts from Google Fonts, and delivery of the site involves GitHub Pages. Those services have their own network and privacy behavior. Frontend source and build artifacts are public; they must never contain secrets.

Relevant reports include browser-side code execution, unsafe handling of input, exposed credentials, compromised dependencies, and vulnerabilities in the build or deployment workflow. Visual defects and ordinary performance problems can be reported through regular issues unless they have a demonstrable security impact.

## Changes affecting security

- Keep dependency updates reviewable and include lockfile changes.
- Retain minimal GitHub Actions token permissions and pinned action revisions.
- Do not expose deployment credentials to untrusted pull requests.
- Avoid introducing remote scripts, user-generated HTML, or new data collection without documenting their purpose and handling.

For general development guidance, see [CONTRIBUTING.md](CONTRIBUTING.md).
