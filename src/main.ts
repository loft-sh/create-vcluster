import * as core from '@actions/core'
import {exec} from '@actions/exec'
import {which} from '@actions/io'
import {promises as fs} from 'fs'
import {tmpdir} from 'os'
import path from 'path'

import {ArgsBuilder} from './args-builder'

const {mkdtemp, writeFile} = fs

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
    args.add('team', core.getInput('team'))
    args.add('user', core.getInput('user'))
    args.add('template', core.getInput('template'))

    const parameters = core.getInput('parameters')
    if (parameters !== '') {
      const tmpDir = await mkdtemp(path.join(tmpdir(), 'loft-'))
      const parametersFile = path.join(tmpDir, 'parameters.yaml')
      await writeFile(parametersFile, parameters)
      args.add('parameters', parametersFile)
    }

    await exec('loft', args.build())
  } catch (error: unknown) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
  }
}

run()
