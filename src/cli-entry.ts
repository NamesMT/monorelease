#!/usr/bin/env node

import process from 'node:process'
import { defineCommand, runMain } from 'citty'
import consola from 'consola'
// @ts-expect-error no TS definition
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
    pkg: {
      type: 'string',
    },
    bump: {
      type: 'boolean',
    },
    r: {
      type: 'string',
    },
  },
  async run({ args }) {
    const {
      push,
      release,
      publish,
      pkg,
      bump,
      r,
    } = args

    const cwd = process.cwd()
    const workspaces = workspace.resolve({
      workspacePath: cwd,
    })

    const selectedPkg = pkg || await consola.prompt('Select packages', {
      type: 'select',
      options: Object.keys(workspaces),
      cancel: 'reject',
    })

    if (!(selectedPkg in workspaces)) {
      throw new Error(`Package ${selectedPkg} not found in workspace`)
    }

    let version: string | undefined = r
    const versionType: 'custom' | 'auto' = version
      ? 'custom'
      : bump
        ? 'auto'
        : await consola.prompt('Select version bump type', {
            type: 'select',
            options: ['auto', 'custom'] as const,
            cancel: 'reject',
          })

    if (versionType === 'custom') {
      if (!version) {
        version = await consola.prompt('Enter version, e.g. 1.0.0', {
          type: 'text',
          cancel: 'reject',
        })
      }

      if (!version.match(/^\d+\.\d+\.\d+(-[\w.]+)?$/)) {
        consola.error('Invalid version format, must be in the format of X.Y.Z[-*]')
        process.exit(1)
      }
    }

    processPackage({
      name: selectedPkg,
      path: workspaces[selectedPkg],
      cwd,
      push,
      release,
      publish,
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
