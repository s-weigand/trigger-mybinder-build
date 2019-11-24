import * as core from '@actions/core'
import * as exec from '@actions/exec'

import { TriggerBinderConfig } from './load-config'
const requestBuild = async (url: string, silent: boolean): Promise<void> => {
  let errorMsg = ''
  const options = {
    listeners: {
      stdout: (data: Buffer) => {
        errorMsg += data.toString()
      }
    },
    silent
  }

  try {
    await exec.exec(
      'curl',
      ['-L', '--connect-timeout', '10', '--max-time', '30', url],
      options
    )
    console.log('Your binder build isa done.')
  } catch (statusCode) {
    if (statusCode === 28) {
      console.log('Binder build started.\nCheck back soon.\n')
    } else {
      // console.log(errorMsg)
      // core.setFailed(
      //   `Something when wrong and the build could not be triggered at
      //   ${url}`
      // )
      throw new Error(`Something when wrong and the build could not be triggered at
        ${url}:\n\n${errorMsg}`)
    }
  }
}

export const triggerBuilds = (config: TriggerBinderConfig): void => {
  const baseUrls: string[] = [
    'https://gke.mybinder.org/build',
    'https://ovh.mybinder.org/build'
  ]
  const targetRepo: string = config.targetRepo
  const targetState: string = config.targetState
  const serviceName: string = config.serviceName
  for (let baseUrl of baseUrls) {
    let url: string = `${baseUrl}/${serviceName}/${targetRepo}`
    if (targetState !== '') {
      url += '/' + targetState
    }
    console.log(url)
    requestBuild(url, !config.debug)
  }
}
