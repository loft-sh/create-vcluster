import * as core from '@actions/core'
import {exec} from '@actions/exec'
import {which} from '@actions/io'
import {ArgsBuilder} from './args-builder'

async function run(): Promise<void> {
  try {
    const name: string = core.getInput('name', {required: true})

    // Check that the loft CLI is installed
    await which('loft', true)

    const args: ArgsBuilder = new ArgsBuilder()
    args.addSubcommand('create')
    args.addSubcommand('vcluster')
    args.addSubcommand(name)
    args.add('account', core.getInput('account'))
    args.add('cluster', core.getInput('cluster'))
    args.add('space', core.getInput('space'))
    args.addNumeric('delete-after', core.getInput('delete-after'))
    args.addNumeric('sleep-after', core.getInput('sleep-after'))
    args.addFlag(
      'disable-direct-cluster-endpoint',
      core.getInput('disable-direct-cluster-endpoint')
    )

    await exec('loft', args.build())
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
