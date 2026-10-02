# Contributing to Stillroom

Thanks for helping improve Stillroom. Contributions can cover cloth physics, rendering performance, accessibility, interaction design, documentation, or bug fixes.

## Before you start

- Search [existing issues](https://github.com/Hostlife22/stillroom/issues) and pull requests for related work.
- For a large feature or change to the solver, open an issue describing the problem and proposed approach before implementing it.
- For a small bug or documentation fix, a focused pull request is welcome.
- Report vulnerabilities using [SECURITY.md](SECURITY.md), rather than a public bug report.

## Local setup

Use Node.js 22.13 or later and npm. Fork the repository on GitHub, clone your fork, then run:

```sh
npm ci
npm run dev
```

Open `http://localhost:5173/stillroom/`, or the address printed by Vite. The interactive scene requires a browser with WebGL support.

Create a branch from the latest `main` for your change:

```sh
git switch -c fix/short-description
```

## Working on the project

Read [Architecture](docs/ARCHITECTURE.md) for module boundaries. Use TypeScript for application code and colocated tests. Keep physics independent of React, Three.js, and the DOM.

| Area                                                       | Files                                            |
| ---------------------------------------------------------- | ------------------------------------------------ |
| Cloth particles, forces, constraints, and collision bounds | `src/simulation/physics/Cloth.ts`                |
| Three.js room, rendering, and pointer interactions         | `src/simulation/`                                |
| Controls, shortcuts, presets, and audio                    | `src/app/`, `src/components/`, `src/hooks/`      |
| Design tokens and responsive layout                        | `src/styles/`                                    |
| Physics tests                                              | `src/simulation/physics/Cloth.test.ts`           |
| GitHub Pages deployment                                    | `.github/workflows/deploy.yml`, `vite.config.ts` |

Keep changes focused. Follow the existing formatting, reuse interface components and CSS variables, and explain any changes to the solver's timestep or constraint behavior. Avoid adding dependencies for functionality already available in the project or browser.

Preserve pause, reset, pointer cancellation, and cleanup behavior. Read [ACCESSIBILITY.md](ACCESSIBILITY.md) before changing controls or interaction patterns.

## Checks before a pull request

```sh
npm run format
npm run check
```

`check` verifies formatting, runs ESLint, strict TypeScript checks, and the module tests, and builds the production site.

For changes to physics or interaction behavior, add a regression test when practical and exercise the affected tools in the browser. Check dragging, release, wind, cutting, pause/resume, and reset. Include strong wind and low damping when changing numerical behavior.

For interface changes, check narrow and wide layouts, keyboard focus, reduced motion, and touch input where available. For deployment changes, verify that the built assets work under `/stillroom/`.

Do not commit `node_modules/`, `dist/`, temporary recordings, credentials, or local environment files. Keep `package-lock.json` in sync when changing dependencies.

## Pull requests

Target `main` and include:

- The problem and what the change does.
- Reproduction steps for a bug fix.
- Checks you ran and their results.
- Screenshots for visible interface changes, when useful.
- Any known limitations or follow-up work.

A short, descriptive commit message is enough, for example `fix: preserve curtain drag coordinates` or `docs: clarify keyboard controls`.

## Bug reports

Include the browser and version, operating system, device or input method, steps to reproduce, and expected versus actual behavior. Mention the selected tool, preset, and relevant physics settings. Console errors and screenshots help, but remove personal information and credentials.

For an accessibility barrier, use the reporting guidance in [ACCESSIBILITY.md](ACCESSIBILITY.md).

## License

Contributions are provided under the project's [MIT License](LICENSE). Only submit material you have the right to contribute, and preserve applicable third-party notices.
