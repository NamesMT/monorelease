import type { ChangelogConfig } from 'changelogen'
import type { PackageJson } from 'pkg-types'
import process from 'node:process'
import { resolve } from 'pathe'
import {
  readPackageJSON as _readPackageJSON,
} from 'pkg-types'
import { isCI, provider } from 'std-env'
import { execCommand } from './exec'

export function readPackageJSON(config: ChangelogConfig): Promise<PackageJson> {
  const path = resolve(config.cwd, 'package.json')

  return _readPackageJSON(path)
}

export async function npmPublish(config: ChangelogConfig): Promise<string> {
  const pkg = await readPackageJSON(config)

  const args = [...config.publish.args || []]

  if (!config.publish.private && !pkg.private) {
    args.push('--access', 'public')
  }

  if (config.publish.tag) {
    args.push('--tag', `"${config.publish.tag}"`)
  }

  if (
    isCI
    && provider === 'github_actions'
    && process.env.NPM_CONFIG_PROVENANCE !== 'false'
  ) {
    args.push('--provenance')
  }

  return execCommand(`npm publish ${args.join(' ')}`, config.cwd)
}
