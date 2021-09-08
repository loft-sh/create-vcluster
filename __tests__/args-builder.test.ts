import {ArgsBuilder} from '../src/args-builder'
import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {describe, expect, test} from '@jest/globals'

describe('ArgsBuilder', () => {
  describe('#addSubcommand(name: string)', () => {
    test('adds string', () => {
      const args: ArgsBuilder = new ArgsBuilder()
      args.addSubcommand('create')
      expect(args.build()).toEqual(['create'])
    })

    test('does not add empty string arg', () => {
      const args: ArgsBuilder = new ArgsBuilder()
      args.addSubcommand('')
      expect(args.build()).toEqual([])
    })

    test('does not add undefined arg', () => {
      const args: ArgsBuilder = new ArgsBuilder()
      args.addSubcommand((undefined as any) as string)
      expect(args.build()).toEqual([])
    })
  })

  describe('#addFlag(name: string, value: string)', () => {
    test('adds flag when true string', () => {
      const args: ArgsBuilder = new ArgsBuilder()
      args.addFlag('disable-direct-cluster-endpoint', 'true')
      expect(args.build()).toEqual(['--disable-direct-cluster-endpoint'])
    })

    test('adds flag when true', () => {
      const args: ArgsBuilder = new ArgsBuilder()
      args.addFlag('disable-direct-cluster-endpoint', true)
      expect(args.build()).toEqual(['--disable-direct-cluster-endpoint'])
    })

    test('does not add flag when false string', () => {
      const args: ArgsBuilder = new ArgsBuilder()
      args.addFlag('disable-direct-cluster-endpoint', 'false')
      expect(args.build()).toEqual([])
    })

    test('does not add flag when false', () => {
      const args: ArgsBuilder = new ArgsBuilder()
      args.addFlag('disable-direct-cluster-endpoint', false)
      expect(args.build()).toEqual([])
    })

    test('does not add flag when empty string', () => {
      const args: ArgsBuilder = new ArgsBuilder()
      args.addFlag('disable-direct-cluster-endpoint', '')
      expect(args.build()).toEqual([])
    })

    test('does not add flag when null', () => {
      const args: ArgsBuilder = new ArgsBuilder()
      args.addFlag('disable-direct-cluster-endpoint', (null as any) as string)
      expect(args.build()).toEqual([])
    })

    test('does not add undefined arg', () => {
      const args: ArgsBuilder = new ArgsBuilder()
      args.addFlag(
        'disable-direct-cluster-endpoint',
        (undefined as any) as string
      )
      expect(args.build()).toEqual([])
    })

    test('throws error on invalid value', () => {
      const args: ArgsBuilder = new ArgsBuilder()
      expect(() =>
        args.addFlag('disable-direct-cluster-endpoint', 'invalid')
      ).toThrow('disable-direct-cluster-endpoint must be true or false')
    })
  })

  describe('#addNumeric(name: string, value: string)', () => {
    test('adds arg when numeric', () => {
      const args: ArgsBuilder = new ArgsBuilder()
      args.addNumeric('sleep-after', '3600')
      expect(args.build()).toEqual(['--sleep-after=3600'])
    })

    test('does not arg flag when non-numeric', () => {
      const args: ArgsBuilder = new ArgsBuilder()
      args.addFlag('sleep-after', 'false')
      expect(args.build()).toEqual([])
    })

    test('does not add undefined arg', () => {
      const args: ArgsBuilder = new ArgsBuilder()
      args.addNumeric('sleep-after', (undefined as any) as string)
      expect(args.build()).toEqual([])
    })

    test('throws error on invalid value', () => {
      const args: ArgsBuilder = new ArgsBuilder()
      expect(() => args.addNumeric('sleep-after', 'foo')).toThrow(
        'sleep-after must be numeric'
      )
    })
  })

  describe('#add(name: string, value: string)', () => {
    test('adds arg when defined', () => {
      const args: ArgsBuilder = new ArgsBuilder()
      args.add('cluster', 'mine')
      expect(args.build()).toEqual(['--cluster=mine'])
    })

    test('does not arg flag when empty string', () => {
      const args: ArgsBuilder = new ArgsBuilder()
      args.add('cluster', '')
      expect(args.build()).toEqual([])
    })

    test('does not add undefined arg', () => {
      const args: ArgsBuilder = new ArgsBuilder()
      args.add('cluster', (undefined as any) as string)
      expect(args.build()).toEqual([])
    })

    test('does not add null arg', () => {
      const args: ArgsBuilder = new ArgsBuilder()
      args.add('cluster', (null as any) as string)
      expect(args.build()).toEqual([])
    })
  })
})
