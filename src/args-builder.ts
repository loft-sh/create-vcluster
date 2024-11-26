export class ArgsBuilder {
  constructor(private readonly _args: string[] = []) {
    this._args = []
  }

  addSubcommand(name: string): void {
    if (!name) {
      return
    }

    this._args.push(name)
  }

  addFlag(name: string, value: string | boolean): void {
    if (!value) {
      return
    }

    try {
      const flag = Boolean(JSON.parse(value as string))
      if (!flag) {
        return
      }

      this._args.push(`--${name}`)
    } catch {
      throw new Error(`${name} must be true or false`)
    }
  }

  addNumeric(name: string, value: string): void {
    if (!value) {
      return
    }

    if (isNaN(parseInt(value, 10))) {
      throw new Error(`${name} must be numeric.`)
    }

    this._args.push(`--${name}=${value}`)
  }

  add(name: string, value: string): void {
    if (!value) {
      return
    }

    this._args.push(`--${name}=${value}`)
  }

  build(): string[] {
    return this._args
  }
}
