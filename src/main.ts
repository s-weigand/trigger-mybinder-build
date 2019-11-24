import * as core from '@actions/core'
import { loadConfig } from './load-config'
import { triggerBuilds } from './request_trigger'

const run = async (): Promise<void> => {
  try {
    const config = loadConfig()
    await triggerBuilds(config)
  } catch (error) {
    core.setFailed(error.message)
  }
}

/* tslint:disable-next-line:no-floating-promises */
run()
