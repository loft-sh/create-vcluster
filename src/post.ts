import * as core from '@actions/core'
import {exec} from '@actions/exec'

import {ArgsBuilder} from './args-builder'

async function run(): Promise<void> {
  try {
    const name: string = core.getInput('name', {required: true})
    const autoCleanupVCluster: boolean = core.getBooleanInput('auto-cleanup')
    let autoCleanupSpace = false
    if (!core.getInput('auto-cleanup-space')) {
      autoCleanupSpace = autoCleanupVCluster
    } else {
      autoCleanupSpace = core.getBooleanInput('auto-cleanup-space')
    }

    if (autoCleanupSpace && !autoCleanupVCluster) {
      core.warning(
        'Using auto-cleanup-space: true and auto-cleanup: false has no effect.'
      )
    }

    if (autoCleanupVCluster) {
      const args: ArgsBuilder = new ArgsBuilder()
      args.addSubcommand('delete')
      args.addSubcommand('vcluster')
      args.addSubcommand(name)
      args.add('cluster', core.getInput('cluster'))
      args.add('space', core.getInput('space'))
      args.addFlag('delete-context', true)
      args.addFlag('delete-space', autoCleanupSpace)
      await exec('loft', args.build())
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
  }
}

run()
