<div align="center">

<h1>Monorelease</h1>

<h3>Release monorepo (sub)projects with ease</h3>
<img src="./branding.svg" alt="Project's branding image" width="320"/>

</div>

# monorelease ![TypeScript heart icon](https://img.shields.io/badge/♡-%23007ACC.svg?logo=typescript&logoColor=white)

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Codecov][codecov-src]][codecov-href]
[![Bundlejs][bundlejs-src]][bundlejs-href]
[![TypeDoc][TypeDoc-src]][TypeDoc-href]

* [monorelease ](#monorelease-)
  * [Overview](#overview)
  * [CLI Usage and Features](#cli-usage-and-features)
  * [License](#license)
  * [Credits](#credits)

## Overview

**monorelease** helps you generate changelogs, bump versions, and publish GitHub releases + npm packages for your monorepo (sub)projects.

## CLI Usage and Features

```bash
npx monorelease [...args]
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

E.g.: for fast shortcut usage, you can create a `monorelease` script at your monorepo root for `npx -y monorelease@latest --release --bump --push --pkg=`, you can then `npm run monorelease --publish` or `npm run monorelease <pkg-name> --publish` to release/publish a package in your monorepo.

## License

[![License][license-src]][license-href]

## Credits

https://github.com/hywax/changelogen-monorepo - amazing work by @hywax, this package is a fork that is more aligned with my needs/opinions.

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/monorelease?labelColor=18181B&color=F0DB4F
[npm-version-href]: https://npmjs.com/package/monorelease
[npm-downloads-src]: https://img.shields.io/npm/dm/monorelease?labelColor=18181B&color=F0DB4F
[npm-downloads-href]: https://npmjs.com/package/monorelease
[codecov-src]: https://img.shields.io/codecov/c/gh/namesmt/monorelease/main?labelColor=18181B&color=F0DB4F
[codecov-href]: https://codecov.io/gh/namesmt/monorelease
[license-src]: https://img.shields.io/github/license/namesmt/monorelease.svg?labelColor=18181B&color=F0DB4F
[license-href]: https://github.com/namesmt/monorelease/blob/main/LICENSE
[bundlejs-src]: https://img.shields.io/bundlejs/size/monorelease?labelColor=18181B&color=F0DB4F
[bundlejs-href]: https://bundlejs.com/?q=monorelease
[jsDocs-src]: https://img.shields.io/badge/Check_out-jsDocs.io---?labelColor=18181B&color=F0DB4F
[jsDocs-href]: https://www.jsdocs.io/package/monorelease
[TypeDoc-src]: https://img.shields.io/badge/Check_out-TypeDoc---?labelColor=18181B&color=F0DB4F
[TypeDoc-href]: https://namesmt.github.io/monorelease/
