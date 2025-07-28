<div align="center">

<h1>repo-release</h1>

<h3>Release monorepo (sub)projects with ease</h3>
<img src="./branding.svg" alt="Project's branding image" width="320"/>

</div>

# repo-release ![TypeScript heart icon](https://img.shields.io/badge/♡-%23007ACC.svg?logo=typescript&logoColor=white)

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Codecov][codecov-src]][codecov-href]
[![Bundlejs][bundlejs-src]][bundlejs-href]
[![TypeDoc][TypeDoc-src]][TypeDoc-href]

* [repo-release ](#repo-release-)
  * [Overview](#overview)
  * [CLI Usage and Features](#cli-usage-and-features)
  * [License](#license)
  * [Credits](#credits)

## Overview

**repo-release** helps you generate changelogs, bump versions, and publish GitHub releases + npm packages for your monorepo (sub)projects.

## CLI Usage and Features

```bash
npx repo-release [...args]
```

**Arguments**

- `--push`: Automatic push of the new tag and release commit to your git repository
- `--release`: Bumps version in `package.json` and creates commit and git tags using local `git`.
- `--publish`: Publishes package as a new version on `npm`. You will need to set authorisation tokens separately via .npmrc or environment variables.
- `--pkg <package>`: Select the target package in the monorepo, if not specified, the CLI will prompt you to select the package.
- `-r <version>` | `--bump`:
  - If `--bump` is present, the version will be bumped automatically.
  - If `-r` is supplied, the version will be set to the specified version.
  - By default, the CLI will prompt you to select the version bump type.

E.g.: for fast shortcut usage, you can create a `repo-release` script at your monorepo root for `npx -y repo-release@latest --release --bump --push --pkg=`, you can then `npm run repo-release --publish` or `npm run repo-release <pkg-name> --publish` to release/publish a package in your monorepo.

## License

[![License][license-src]][license-href]

## Credits

https://github.com/hywax/changelogen-monorepo - amazing work by @hywax, this package is a fork that is more aligned with my needs/opinions.

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/repo-release?labelColor=18181B&color=F0DB4F
[npm-version-href]: https://npmjs.com/package/repo-release
[npm-downloads-src]: https://img.shields.io/npm/dm/repo-release?labelColor=18181B&color=F0DB4F
[npm-downloads-href]: https://npmjs.com/package/repo-release
[codecov-src]: https://img.shields.io/codecov/c/gh/namesmt/repo-release/main?labelColor=18181B&color=F0DB4F
[codecov-href]: https://codecov.io/gh/namesmt/repo-release
[license-src]: https://img.shields.io/github/license/namesmt/repo-release.svg?labelColor=18181B&color=F0DB4F
[license-href]: https://github.com/namesmt/repo-release/blob/main/LICENSE
[bundlejs-src]: https://img.shields.io/bundlejs/size/repo-release?labelColor=18181B&color=F0DB4F
[bundlejs-href]: https://bundlejs.com/?q=repo-release
[jsDocs-src]: https://img.shields.io/badge/Check_out-jsDocs.io---?labelColor=18181B&color=F0DB4F
[jsDocs-href]: https://www.jsdocs.io/package/repo-release
[TypeDoc-src]: https://img.shields.io/badge/Check_out-TypeDoc---?labelColor=18181B&color=F0DB4F
[TypeDoc-href]: https://namesmt.github.io/repo-release/
