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

    const pkg = await consola.prompt('Select packages', {
      type: 'select',
      options: Object.keys(workspaces),
    })

    processPackage({
      name: pkg,
      path: workspaces[pkg],
      cwd,
      push: args.push,
      release: args.release,
      publish: args.publish,
    })

    consola.success('Done!')
  },
})

runMain(cli)
  .catch((err) => {
    consola.error(err)
    process.exit(1)
  })
