import { requestBuild } from '../src/request_trigger'

describe('Testing requests', () => {
  it('test dummy request', async () => {
    await requestBuild(
      'https://gke.mybinder.org/build/gh/s-weigand/ipynb-share/master',
      true,
    ).then(
      val => {
        console.log(`val: ${val}`)
      },
      error => {
        console.log(`error: ${error}`)
      },
    )
  })
})
