# trigger-mybinder-build

[![Actions Status](https://github.com/s-weigand/trigger-mybinder-build/workflows/Tests/badge.svg)](https://github.com/s-weigand/trigger-mybinder-build/actions)

Github action to trigger a build on [binder](https://mybinder.org/)

## Inputs

| Name           | Requirement | Description                                                                                              |
| -------------- | ----------- | -------------------------------------------------------------------------------------------------------- |
| `target-repo`  | _required_  | Repository which should be build by mybinder.org                                                         |
| `service-name` | _optional_  | gh \| gist \| gl \| git \| zenodo \| figshare Name of the service that hosts the repo. (`Default: 'gh'`) |
| `target-state` | _optional_  | Name of the branch, tag or commit which should be build, by mybinder.org. (`Default: 'master'`)          |

# Usage

## Basic:

```yaml
steps:
  - uses: actions/checkout@master
  - uses: s-weigand/github-action-template
```

## Matrix Testing:

```yaml
jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macOS-latest]
        python-version: [3.6, 3.7, 3.8]
    name: Python ${{ matrix.python-version }} example
    steps:
  - uses: actions/checkout@master
  - uses: s-weigand/github-action-template
```
