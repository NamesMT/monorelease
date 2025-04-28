import { existsSync, promises as fsp } from 'node:fs'
import process from 'node:process'
import { bumpVersion, generateMarkDown, loadChangelogConfig, parseCommits } from 'changelogen'
import consola from 'consola'
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
}

function packageLatestTag(name: string, lastAt = -1): string {
  const tag = execCommand(`git tag -l '${name}-*'`)
    .split('\n')
    .filter((tag) => tag)
    .at(lastAt)

  if (!tag || !tag?.includes(name)) {
    return 'v0.0.0'
  }

  return tag.replace(`${name}-`, '')
}

export async function processPackage(config: ProcessPackageConfig) {
  const latestTag = packageLatestTag(config.name)
  const changelogenConfig = await loadChangelogConfig(config.path, {
    from: `${config.name}-${latestTag}`,
    templates: {
      commitMessage: `chore(release): ${config.name} v{{newVersion}}`,
      tagMessage: `${config.name}-v{{newVersion}}`,
      tagBody: `${config.name}-v{{newVersion}}`,
    },
  })

  const rawCommits = getGitDiff(
    latestTag === 'v0.0.0' ? undefined : changelogenConfig.from,
    changelogenConfig.to,
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

  const markdown = await generateMarkDown(commits, changelogenConfig)

  const displayOnly = !config.bump && !config.release
  if (displayOnly) {
    consola.log(`\n\n${markdown}\n\n`)
  }

  // Update changelog file (only when bumping or releasing or when --output is specified as a file)
  if (typeof changelogenConfig.output === 'string' && (config.output || !displayOnly)) {
    let changelogMD: string
    if (existsSync(changelogenConfig.output)) {
      changelogMD = await fsp.readFile(changelogenConfig.output, 'utf8')
    } else {
      changelogMD = '# Changelog\n\n'
    }

    const lastEntry = changelogMD.match(/^###?\s+(?:\S.*)?$/m)

    if (lastEntry) {
      changelogMD
        = `${changelogMD.slice(0, lastEntry.index)
        + markdown
        }\n\n${
          changelogMD.slice(lastEntry.index)}`
    } else {
      changelogMD += `\n${markdown}\n\n`
    }

    await fsp.writeFile(changelogenConfig.output, changelogMD)
  }

  // Commit and tag changes for release mode
  if (config.release) {
    if (config.commit !== false) {
      const filesToAdd = [changelogenConfig.output, `${config.path}/package.json`].filter((f) => f && typeof f === 'string') as string[]
      execCommand(`git add ${filesToAdd.map((f) => `"${f}"`).join(' ')}`, config.cwd)

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
        version: `${config.name}-v${changelogenConfig.newVersion}`,
        body: markdown.split('\n').slice(2).join('\n'),
      })
    }

    if (config.publish) {
      await npmPublish(changelogenConfig)
    }
  }
}
