import * as core from '@actions/core'
import {exec} from '@actions/exec'

import {ArgsBuilder} from './args-builder'

async function run(): Promise<void> {
  try {
    const name: string = core.getInput('name', {required: true})
    const postDeleteVCluster: boolean = core.getBooleanInput(
      'post-delete-vcluster'
    )
    const postDeleteSpace: boolean = core.getBooleanInput('post-delete-space')

    if (postDeleteSpace && !postDeleteVCluster) {
      core.warning(
        'Using post-delete-space: true and post-delete-vcluster: false has no effect.'
      )
    }

    if (postDeleteVCluster) {
      const args: ArgsBuilder = new ArgsBuilder()
      args.addSubcommand('delete')
      args.addSubcommand('vcluster')
      args.addSubcommand(name)
      args.add('cluster', core.getInput('cluster'))
      args.add('space', core.getInput('space'))
      args.addFlag('delete-context', true)
      args.addFlag('delete-space', postDeleteSpace)
      await exec('loft', args.build())
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
