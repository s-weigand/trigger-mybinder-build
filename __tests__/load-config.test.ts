import { loadConfig } from '../src/load-config'

const testEnvVars = {
  'INPUT_TARGET-REPO': 'user_name/repo_name',
  'INPUT_SERVICE-NAME': 'gist',
  'INPUT_TARGET-STATE': 'bar',
  INPUT_DEBUG: 'true'
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
    const config = loadConfig()
    expect(config.targetRepo).toEqual('user_name/repo_name')
    expect(config.serviceName).toEqual('gist')
    expect(config.targetState).toEqual('bar')
    expect(config.debug).toEqual(true)
  })
})
