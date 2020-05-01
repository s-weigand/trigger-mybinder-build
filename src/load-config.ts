import * as core from '@actions/core'

const serviceNames = ['gh', 'gist', 'gl', 'git', 'zenodo', 'figshare'] as const

export type ServiceName = typeof serviceNames[number]
export interface TriggerBinderConfig {
  targetRepo: string
  serviceName: ServiceName
  targetState: string
  debug: boolean
}

export const loadConfig = (): TriggerBinderConfig => {
  const targetRepo = core.getInput('target-repo', { required: true })
  const serviceName = core.getInput('service-name', {
    required: true,
  }) as ServiceName
  const targetState = core.getInput('target-state')
  const debug = core.getInput('debug') === 'true'
  // const targetRepo = 's-weigand/python-tools-for-students'
  // const serviceName = 'gh' as ServiceName
  // const targetState = 'master'
  // const debug = true
  const config = { targetRepo, serviceName, targetState, debug }
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
