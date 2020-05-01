import { requestBuild } from '../src/request_trigger'

describe('Testing requests', () => {
  it('test dummy request', () => {
    return expect(
      requestBuild(
        'https://gke.mybinder.org/build/gh/s-weigand/ipynb-share/master',
        false,
      ),
    ).resolves.toBe('success')
  })
  it('test error request', () => {
    return expect(
      requestBuild(
        'https://gke.mybinder.org/build/gh/s-weigand/ipynb-share/not-a-branch',
        false,
      ),
    ).rejects.toMatch('Build Error')
  })
  it('test error request', () => {
    return expect(
      requestBuild('https://not-a-proper-url.failes', false),
    ).rejects.toMatch('Request Error')
  })
})
