#!/usr/bin/env node

import process from 'node:process'
import { defineCommand, runMain } from 'citty'
import consola from 'consola'
import workspace from 'workspace-resolver'
import packageJson from '../package.json'
import { processPackage } from './package'

const cli = defineCommand({
  meta: {
    name: `${packageJson.name} cli`,
    description: packageJson.description,
    version: packageJson.version,
  },
  args: {
    push: {
      type: 'boolean',
    },
    release: {
      type: 'boolean',
    },
    publish: {
      type: 'boolean',
    },
  },
  async run({ args }) {
    const cwd = process.cwd()
    const workspaces = workspace.resolve({
      workspacePath: cwd,
    })
    let version: string | undefined

    const pkg = await consola.prompt('Select packages', {
      type: 'select',
      options: Object.keys(workspaces),
    })

    const versionType = await consola.prompt('Select version bump type', {
      type: 'select',
      options: ['auto', 'custom'],
    })

    if (versionType === 'custom') {
      version = await consola.prompt('Enter version, e.g. 1.0.0', {
        type: 'text',
      })

      if (!(version || '').match(/^\d+\.\d+\.\d+$/)) {
        consola.error('Invalid version format, must be in the format of X.Y.Z')
        process.exit(1)
      }
    }

    processPackage({
      name: pkg,
      path: workspaces[pkg],
      cwd,
      push: args.push,
      release: args.release,
      publish: args.publish,
      version,
    })

    consola.success('Done!')
  },
})

runMain(cli)
  .catch((err) => {
    consola.error(err)
    process.exit(1)
  })
