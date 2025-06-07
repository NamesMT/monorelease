# changelogen monorepo

Generate Beautiful Changelogs using [changelogen](https://github.com/unjs/changelogen)

>[!NOTE]
> This repository will help you generate a changelog for your monorepo project.
> Just a heads-up: I originally built it for myself, so if you need extra features,
> feel free to fork it and add your own!

## CLI Usage

```bash
npx changelogen-monorepo [...args]
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

## License

MIT
