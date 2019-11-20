import * as core from '@actions/core'

const testEnvVars = {
  INPUT_BRANCH: 'mybranch'
}

describe('Reading of the config', () => {
  beforeEach(() => {
    for (const key in testEnvVars) {
      process.env[key] = testEnvVars[key as keyof typeof testEnvVars]
    }

    process.stdout.write = jest.fn()
  })

  afterEach(() => {
    for (const key in testEnvVars) Reflect.deleteProperty(testEnvVars, key)
  })

  it('test config values', () => {
    const branch = core.getInput('branch')
    expect(branch).toEqual('mybranch')
  })
})
