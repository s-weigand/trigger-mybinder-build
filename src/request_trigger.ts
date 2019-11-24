import * as core from '@actions/core'
import * as exec from '@actions/exec'

import { TriggerBinderConfig } from './load-config'
const requestBuild = async (url: string): Promise<void> => {
  let response = ''
  let error = ''

  const options = { listeners: {} }
  options.listeners = {
    stdout: (data: Buffer) => {
      response += data.toString()
    },
    stderr: (data: Buffer) => {
      error += data.toString()
    }
  }

  const statusCode = await exec.exec('curl', [
    '-L',
    '--connect-timeout',
    '10',
    '--max-time',
    '30',
    url
  ])
  if (statusCode === 0 || statusCode === 28) {
    console.log(response)
  } else {
    console.log(error)
    core.setFailed(
      `Something when wrong and the build could not be triggered at
        ${url}`
    )
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
    requestBuild(url)
  }
}
