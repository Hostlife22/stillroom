# Stillroom

An interactive cloth simulation built with React, Vite, and Three.js. Drag a linen curtain, add wind, or cut its structural and shear constraints in a sunlit room.

## Development

Requires Node.js 22.13 or later.

```sh
npm ci
npm run dev
```

## Code quality

```sh
npm run format        # Format source files with Prettier
npm run format:check  # Check formatting without changing files
npm run lint          # Run ESLint, including React Hooks rules
npm run lint:fix      # Apply automatic ESLint fixes
npm test              # Run cloth stability and cutting tests
npm run build         # Build the production app into dist/
npm run check         # Run all checks above, without modifying source files
```

## Controls

- **G**: grab and drag the curtain.
- **W**: hold to apply wind.
- **C**: drag to cut constraints.
- **Space**: pause or resume.
- **R**: restore the curtain.

The side panel controls wind, stiffness, damping, fabric color, lighting, and wireframe visibility. The simulation uses fixed physics steps, damped particle motion, iterative structural and shear constraints, and floor and wall collision bounds.
