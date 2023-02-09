import * as core from '@actions/core'
import {exec, getExecOutput} from '@actions/exec'
import {which} from '@actions/io'
import {promises as fs} from 'fs'
import {tmpdir} from 'os'
import path from 'path'
import {coerce, satisfies} from 'semver'

import {ArgsBuilder} from './args-builder'

const {mkdtemp, writeFile} = fs

async function run(): Promise<void> {
  try {
    const name: string = core.getInput('name', {required: true})

    // Check that the loft CLI is installed
    await which('loft', true)

    // Check that the loft CLI supports projects
    const project: string = core.getInput('project')
    const loftVersion = await getLoftVersion()
    if (project !== '' && !isProjectSupported(loftVersion)) {
      throw new Error(`Project input requires Loft CLI version 3.0 and above`)
    }

    const args: ArgsBuilder = new ArgsBuilder()
    args.addSubcommand('create')
    args.addSubcommand('vcluster')
    args.addSubcommand(name)
    args.add('account', core.getInput('account'))
    args.add('cluster', core.getInput('cluster'))
    args.add('project', project)
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

    if (isUseSupported(loftVersion)) {
      args.add('use', core.getInput('use'))
    }

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

async function getLoftVersion(): Promise<string> {
  const {stdout: loftVersionOutput = ''} = await getExecOutput('loft', [
    '--version'
  ])
  return loftVersionOutput.replace('loft version', '').trim()
}

function isProjectSupported(version: string): boolean {
  const coerced = coerce(version)
  if (coerced == null) {
    return false
  }
  return satisfies(coerced, '^3.0.0')
}

function isUseSupported(version: string): boolean {
  const coerced = coerce(version)
  if (coerced == null) {
    return false
  }
  return satisfies(coerced, '>= 3.0.0-alpha.5', {includePrerelease: true})
}

run()
