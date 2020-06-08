import {
  loadConfig,
  validateConfig,
  TriggerBinderConfig,
} from '../src/load-config'

const testEnvVars = {
  'INPUT_TARGET-REPO': 'user_name/repo_name',
  'INPUT_SERVICE-NAME': 'gist',
  'INPUT_TARGET-STATE': 'bar',
  'INPUT_USE-DEFAULT-BUILD-SERVERS': 'true',
  'INPUT_ADDITIONAL-BUILD-SERVERS': '',
  INPUT_DEBUG: 'true',
}

const defaultConfig = {
  targetRepo: 'user_name/repo_name',
  serviceName: 'gist',
  targetState: 'bar',
  useDefaultBuildServers: true,
  additionalBuildServers: [],
  debug: true,
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
    expect(config.targetRepo).toEqual(defaultConfig.targetRepo)
    expect(config.serviceName).toEqual(defaultConfig.serviceName)
    expect(config.targetState).toEqual(defaultConfig.targetState)
    expect(config.useDefaultBuildServers).toBe(
      defaultConfig.useDefaultBuildServers,
    )
    expect(config.additionalBuildServers).toMatchObject(
      defaultConfig.additionalBuildServers,
    )
    expect(config.debug).toEqual(defaultConfig.debug)
  })
  it('test additional-build-servers none empty values', () => {
    process.env['INPUT_ADDITIONAL-BUILD-SERVERS'] = 'foo\nbar'
    const config = loadConfig()
    expect(config.additionalBuildServers).toMatchObject(['foo', 'bar'])
  })
})

describe('Validation of the config', () => {
  it('test serviceName error', () => {
    const wrongServiceNameConfig = { ...defaultConfig }
    wrongServiceNameConfig.serviceName = 'foo-bar'
    expect(() => {
      validateConfig(wrongServiceNameConfig as any)
    }).toThrow('service-name')
  })
  it('test servicesWithNoFixedState error', () => {
    const wrongServiceWithNoFixedState = { ...defaultConfig }
    wrongServiceWithNoFixedState.serviceName = 'zenodo'
    expect(() => {
      validateConfig(wrongServiceWithNoFixedState as any)
    }).toThrow('target-state')
  })
  it('test wrongBuildServerCongig', () => {
    const wrongBuildServerCongig = { ...defaultConfig }
    wrongBuildServerCongig.useDefaultBuildServers = false
    expect(() => {
      validateConfig(wrongBuildServerCongig as any)
    }).toThrow('use-default-build-servers')
  })
})
