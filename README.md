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

## License

MIT
