# GitHub Setup

This project is ready to publish as a GitHub repository.

This local working copy is intentionally not initialized as a git repository by automation. If you decide to publish it, run git commands yourself from a terminal after reviewing the files.

## Recommended Repository Settings

- Default branch: `main`
- Enable issues
- Enable discussions if you want roadmap and feature conversations
- Enable private vulnerability reporting if the repository is public
- Require the `CI / Build and Check` workflow before merging pull requests
- Add branch protection for `main`
- Require pull request review before merge once collaborators join
- Enable Dependabot alerts for npm and Cargo dependencies
- Use repository topics such as `tauri`, `vite`, `typescript`, `rust`, `desktop-shell`, and `operating-system`

## Included GitHub Files

- `.github/workflows/ci.yml`
- `.github/pull_request_template.md`
- `.github/ISSUE_TEMPLATE/bug_report.md`
- `.github/ISSUE_TEMPLATE/feature_request.md`
- `.github/ISSUE_TEMPLATE/documentation.md`
- `.github/ISSUE_TEMPLATE/rfc_request.md`
- `.gitignore`
- `.gitattributes`
- `README.md`
- `release/README.md`
- `release/RELEASE_NOTES_v1.1.2.md`
- `release/SHA256SUMS.txt`
- `CONTRIBUTING.md`
- `CODE_OF_CONDUCT.md`
- `SECURITY.md`
- `SUPPORT.md`
- `CHANGELOG.md`
- `RELEASE.md`
- `GOVERNANCE.md`
- `MAINTAINERS.md`
- `LICENSE`
- `.github/CODEOWNERS`
- `.github/dependabot.yml`
- `.github/ISSUE_TEMPLATE/config.yml`
- `.editorconfig`
- `.vscode/extensions.json`
- `.vscode/settings.json`
- `.vscode/tasks.json`

## Optional First Push

```powershell
git init
git add .
git commit -m "Initial AetherOS desktop shell foundation"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/AetherOS.git
git push -u origin main
```

Do not run these commands unless you are intentionally creating the repository history.

## What Should Not Be Committed

The `.gitignore` excludes:

- `node_modules/`
- `dist/`
- `src-tauri/target/`
- logs
- local `.env` files
- generated installer bundles
- local release binaries under `release/`

The source tree may include release metadata files, but `.exe` and `.msi` artifacts should be attached to GitHub Releases instead of committed.

## Verification Before Publishing

```powershell
npm run build
cargo check --locked --manifest-path src-tauri/Cargo.toml
```

For a release build:

```powershell
npm run tauri:build
```

Current Windows x64 release artifacts are staged locally as:

```text
release/AetherOS-1.1.2-windows-x64-setup.exe
release/AetherOS-1.1.2-windows-x64-portable.exe
release/AetherOS-1.1.2-windows-x64.msi
release/SHA256SUMS.txt
```

Use `release/RELEASE_NOTES_v1.1.2.md` as the draft body for the GitHub Release.
