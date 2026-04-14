# Contributing

Thanks for helping improve DSK Timer. This project is open source under the [MIT License](LICENSE).

## Before you start

- **Bugs and ideas:** Open an [issue](https://github.com/ds-kimi/dsk_timer/issues) with enough detail to reproduce a problem or explain the feature (Windows version, steps, screenshots if UI-related).
- **Large changes:** For non-trivial work, opening an issue first avoids duplicate effort and keeps direction aligned with the maintainer.

## Development setup

1. Install [Node.js](https://nodejs.org/) (LTS is fine).
2. Clone the repository and install dependencies:

   ```bash
   git clone https://github.com/ds-kimi/dsk_timer.git
   cd dsk_timer
   npm install
   ```

3. Run the app:

   ```bash
   npm start
   ```

4. Optional: run with extra testing controls (speed multiplier, etc.):

   ```bash
   npm run dev
   ```

## Building the installer

The `build` script is written for **Windows** (`cmd` / `npm` on Windows). From the project root:

```bash
npm run build
```

Output appears under `dist\`. Release publishing and signing are out of scope for most contributors; see `README.md` if you maintain releases.

## Pull requests

- Use a **clear branch name** and **focused commits** (one concern per PR when possible).
- **Match existing style:** same patterns, naming, and file layout as nearby code; avoid unrelated refactors or formatting-only churn mixed with fixes.
- **Describe the change** in the PR: what it does, why, and how to verify it manually if there is no automated test.
- By submitting a PR, you agree your contribution is licensed under the same **MIT** terms as the rest of the repo.

## Icons

Icon assets are generated from `assets/clock-minimal.svg`:

```bash
npm run icons
```

Do not commit secrets (for example `.env` with tokens). `.env` is ignored by git.
