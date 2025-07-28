import { existsSync, promises as fsp } from 'node:fs'
import process from 'node:process'
import { bumpVersion, generateMarkDown, loadChangelogConfig, parseCommits } from 'changelogen'
import consola from 'consola'
import semver from 'semver'
import { execCommand } from './exec'
import { getGitDiff } from './git'
import { githubRelease } from './github'
import { npmPublish } from './npm'

export interface ProcessPackageConfig {
  name: string
  path: string
  cwd: string
  commit?: boolean
  tag?: boolean
  push?: boolean
  github?: boolean
  release?: boolean
  bump?: boolean
  output?: boolean
  publish?: boolean
  version?: string
}

function packageLatestVersion(name: string): string {
  const tag = execCommand(`git tag -l '${name}@*'`)
    .split('\n')
    .filter(tag => tag)
    .sort((a, b) => semver.gt(a.replace(`${name}@`, ''), b.replace(`${name}@`, '')) ? 1 : -1)
    .pop()

  return tag ? tag.replace(`${name}@`, '') : '0.0.0'
}

export async function processPackage(config: ProcessPackageConfig): Promise<void> {
  const latestVersion = packageLatestVersion(config.name)
  const changelogenConfig = await loadChangelogConfig(config.path, {
    from: `${config.name}@${latestVersion}`,
    newVersion: config.version,
    templates: {
      commitMessage: `chore(release): ${config.name}@{{newVersion}}`,
      tagMessage: `${config.name}@{{newVersion}}`,
      tagBody: `${config.name}@{{newVersion}}`,
    },
  })

  const rawCommits = getGitDiff(
    latestVersion === '0.0.0' ? undefined : changelogenConfig.from,
    'HEAD',
    [config.path],
  )
  const commits = parseCommits(rawCommits, changelogenConfig)

  if (config.bump || config.release) {
    const newVersion = await bumpVersion(commits, changelogenConfig)

    if (!newVersion) {
      consola.error('Unable to bump version based on changes.')
      process.exit(1)
    }

    changelogenConfig.newVersion = newVersion
  }

  const markdown = await generateMarkDown(commits, {
    ...changelogenConfig,
    from: latestVersion === '0.0.0' ? 'main' : changelogenConfig.from,
  })

  const displayOnly = !config.bump && !config.release
  if (displayOnly) {
    consola.log(`\n\n${markdown}\n\n`)
  }

  // Update changelog file (only when bumping or releasing or when --output is specified as a file)
  if (typeof changelogenConfig.output === 'string' && (config.output || !displayOnly)) {
    let changelogMD: string
    if (existsSync(changelogenConfig.output)) {
      changelogMD = await fsp.readFile(changelogenConfig.output, 'utf8')
    }
    else {
      changelogMD = '# Changelog\n\n'
    }

    const lastEntry = changelogMD.match(/^###?\s+(?:\S.*)?$/m)

    if (lastEntry) {
      changelogMD
        = `${changelogMD.slice(0, lastEntry.index)
        + markdown
        }\n\n${
          changelogMD.slice(lastEntry.index)}`
    }
    else {
      changelogMD += `\n${markdown}\n\n`
    }

    await fsp.writeFile(changelogenConfig.output, changelogMD)
  }

  // Commit and tag changes for release mode
  if (config.release) {
    if (config.commit !== false) {
      const filesToAdd = [changelogenConfig.output, `${config.path}/package.json`].filter(f => f && typeof f === 'string') as string[]
      execCommand(`git add ${filesToAdd.map(f => `"${f}"`).join(' ')}`, config.cwd)

      const msg = changelogenConfig.templates.commitMessage!.replaceAll('{{newVersion}}', changelogenConfig.newVersion!)
      execCommand(`git commit -m "${msg}"`, config.cwd)
    }

    if (config.tag !== false) {
      const msg = changelogenConfig.templates.tagMessage!.replaceAll('{{newVersion}}', changelogenConfig.newVersion!)
      const body = changelogenConfig.templates.tagBody!.replaceAll('{{newVersion}}', changelogenConfig.newVersion!)

      execCommand(`git tag ${changelogenConfig.signTags ? '-s' : ''} -am "${msg}" "${body}"`, config.cwd)
    }

    if (config.push === true) {
      execCommand('git push --follow-tags', config.cwd)
    }

    if (config.github !== false && changelogenConfig.repo?.provider === 'github') {
      await githubRelease(changelogenConfig, {
        version: `${config.name}@${changelogenConfig.newVersion}`,
        body: markdown.split('\n').slice(2).join('\n'),
      })
    }

    if (config.publish) {
      await npmPublish(changelogenConfig)
    }
  }
}
