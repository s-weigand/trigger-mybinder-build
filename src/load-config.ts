import * as core from '@actions/core'

const serviceNames = ['gh', 'gist', 'gl', 'git', 'zenodo', 'figshare'] as const

export type ServiceName = typeof serviceNames[number]
export interface TriggerBinderConfig {
  targetRepo: string
  serviceName: ServiceName
  targetState: string
  useDefaultBuildServers: boolean
  additionalBuildServers: string[]
  debug: boolean
}

export const loadConfig = (): TriggerBinderConfig => {
  const targetRepo = core.getInput('target-repo', { required: true })
  const serviceName = core.getInput('service-name', {
    required: true,
  }) as ServiceName
  const targetState = core.getInput('target-state')
  const useDefaultBuildServers =
    core.getInput('use-default-build-servers') === 'true'
  const additionalBuildServers = core
    .getInput('additional-build-servers')
    .split('\n')
    .map(additionalBuildServer => additionalBuildServer.trim())
    .filter(additionalBuildServer => additionalBuildServer !== '')

  const debug = core.getInput('debug') === 'true'
  const config = {
    targetRepo,
    serviceName,
    targetState,
    useDefaultBuildServers,
    additionalBuildServers,
    debug,
  }
  validateConfig(config)
  return config
}

export const validateConfig = (config: TriggerBinderConfig): void => {
  const serviceName = config.serviceName
  if (!validServiceName(serviceName)) {
    throw new Error(`The value for 'service-name' provided (${serviceName})
    was not valid. The value of 'service-name' needs to be one of the following values ${serviceNames}.`)
  }
  const servicesWithNoFixedState = ['zenodo', 'figshare']
  if (servicesWithNoFixedState.indexOf(serviceName) > -1) {
    throw new Error(`The service ${serviceName} providing the repo
    is not compatible with the option 'target-state'.
    Have a look at https://mybinder.org/.`)
  }
  const useDefaultBuildServers = config.useDefaultBuildServers
  const additionalBuildServers = config.additionalBuildServers
  if (useDefaultBuildServers === false && additionalBuildServers.length === 0) {
    throw new Error(`If the setting 'use-default-build-servers' is 'false', 'additional-build-server'
    needs to be set to a not empty value.`)
  }
}

/**
 *
 * This solution is taken from:
 * https://stackoverflow.com/a/57065680/3990615
 *
 * @param serviceName
 */
export function validServiceName(
  serviceName: string,
): serviceName is ServiceName {
  return (serviceNames as readonly string[]).includes(serviceName)
}
