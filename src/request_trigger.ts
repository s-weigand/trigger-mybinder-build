import * as core from '@actions/core'

import EventSource from 'eventsource'

import { TriggerBinderConfig } from './load-config'

interface BuildServerResponse {
  phase: string
  message: string
  [propName: string]: any
}

export const requestBuild = (url: string, debug: boolean): Promise<string> => {
  const timeOut = 30000
  const maxTimeOut = timeOut + 10000
  const startTime = new Date().getTime()
  const source = new EventSource(url)
  return new Promise((resolve, reject) => {
    source.onmessage = ((event: MessageEvent) => {
      const eventData = JSON.parse(event.data) as BuildServerResponse
      if (debug) {
        console.log(`BuildServerResponse(${url}): \n${eventData.message}\n`)
      }
      if (checkDone(startTime, timeOut, eventData)) {
        if (['launching', 'ready'].indexOf(eventData.phase) > -1) {
          console.log(`${url}\nYour binder build is done.\n`)
          resolve('success')
        } else if (eventData.phase === 'building') {
          console.log(`${url}\nBinder build started.\nCheck back soon.\n`)
          resolve('success')
        } else {
          source.close()
          reject(
            `Build Error ${url}\nYour binder build failed with the following
          message:\n${eventData.message}`,
          )
        }
        source.close()
      }
    }) as EventListener

    source.onerror = (event: MessageEvent) => {
      source.close()
      reject(`Request Error ${url}\nAn Error occurred requesting a binder build:\n
    ${event.data}`)
    }
    // fail save in case there are no messages and no errors
    setTimeout(() => {
      source.close()
      reject(
        `Request Error ${url}\nConnection timed out, via fail save after ${
          maxTimeOut / 1000
        }s.`,
      )
    }, maxTimeOut)
  })
}

const checkDone = (
  startTime: number,
  timeOut: number,
  eventData: BuildServerResponse,
): boolean => {
  if (
    new Date().getTime() - startTime > timeOut &&
    eventData.phase === 'building'
  ) {
    return true
  } else if (['launching', 'ready', 'failed'].indexOf(eventData.phase) > -1) {
    return true
  } else {
    return false
  }
}

export const triggerBuilds = (config: TriggerBinderConfig): void => {
  const defaultBaseUrls: string[] = [
    'https://mybinder.org',
    'https://gke.mybinder.org',
    'https://ovh.mybinder.org',
    'https://gesis.mybinder.org',
    'https://turing.mybinder.org',
  ]
  const targetRepo: string = config.targetRepo
  const targetState: string = config.targetState
  const serviceName: string = config.serviceName
  const useDefaultBuildServers: boolean = config.useDefaultBuildServers
  const additionalBuildServers: string[] = config.additionalBuildServers
  const baseUrls: string[] = useDefaultBuildServers
    ? [...defaultBaseUrls, ...additionalBuildServers]
    : [...additionalBuildServers]
  const responses: Promise<boolean>[] = []
  for (let baseUrl of baseUrls) {
    let url: string = `${baseUrl}/build/${serviceName}/${targetRepo}`
    if (targetState !== '') {
      url += '/' + targetState
    }
    responses.push(
      requestBuild(url, config.debug)
        .then(() => true)
        .catch((reason) => {
          core.error(`Error for ${url}:\n${reason}\n`)
          return false
        }),
    )
  }
  // tslint:disable-next-line no-floating-promises
  Promise.all(responses).then((values) => {
    if (values.indexOf(true) === -1) {
      throw new Error('All requests to build the binder image have failed.')
    }
  })
}
