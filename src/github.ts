import type { GithubRelease, ResolvedChangelogConfig } from 'changelogen'
import process from 'node:process'
import { createGithubRelease, getGithubReleaseByTag, resolveGithubToken, updateGithubRelease } from 'changelogen'
import consola from 'consola'
import { colors } from 'consola/utils'

export async function syncGithubRelease(
  config: ResolvedChangelogConfig,
  release: { version: string, body: string },
): Promise<{
  status: string
  url: string
  id?: undefined
  error?: undefined
} | {
  status: string
  id: any
  url?: undefined
  error?: undefined
} | {
  status: string
  error: unknown
  url: string
  id?: undefined
}> {
  const currentGhRelease = await getGithubReleaseByTag(config, release.version).catch(() => {})

  const ghRelease: GithubRelease = {
    tag_name: release.version,
    name: release.version,
    body: release.body,
  }

  if (!config.tokens.github) {
    return {
      status: 'manual',
      url: githubNewReleaseURL(config, release),
    }
  }

  try {
    const newGhRelease = await (currentGhRelease
      ? updateGithubRelease(config, currentGhRelease.id!, ghRelease)
      : createGithubRelease(config, ghRelease))
    return {
      status: currentGhRelease ? 'updated' : 'created',
      id: newGhRelease.id,
    }
  }
  catch (error) {
    return {
      status: 'manual',
      error,
      url: githubNewReleaseURL(config, release),
    }
  }
}

export function githubNewReleaseURL(
  config: ResolvedChangelogConfig,
  release: { version: string, body: string },
): string {
  return `https://${config.repo.domain}/${config.repo.repo}/releases/new?tag=${release.version}&title=${release.version}&body=${encodeURIComponent(release.body)}`
}

export async function githubRelease(
  config: ResolvedChangelogConfig,
  release: { version: string, body: string },
): Promise<void> {
  if (!config.tokens.github) {
    config.tokens.github = await resolveGithubToken(config).catch(
      () => undefined,
    )
  }

  release = {
    ...release,
    body: release.body.replaceAll(/\(\[(@.+)\]\(.+\)\)/g, '($1)'),
  }

  const result = await syncGithubRelease(config, release)
  if (result.status === 'manual') {
    if (result.error) {
      consola.error(result.error)
      process.exitCode = 1
    }
    const open = await import('open').then(r => r.default)

    if (!result.url) {
      return
    }

    await open(result.url)
      .then(() => {
        consola.info(`Followup in the browser to manually create the release.`)
      })
      .catch(() => {
        consola.info(
          `Open this link to manually create a release: \n${
            colors.underline(colors.cyan(result.url))
          }\n`,
        )
      })
  }
  else {
    consola.success(
      `Synced ${colors.cyan(`${release.version}`)} to Github releases!`,
    )
  }
}
