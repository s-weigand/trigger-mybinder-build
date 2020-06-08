# trigger-mybinder-build

[![Actions Status](https://github.com/s-weigand/trigger-mybinder-build/workflows/Tests/badge.svg)](https://github.com/s-weigand/trigger-mybinder-build/actions)

Github action to trigger a build on [binder](https://mybinder.org/),
so the build is always up to date with the targeted state and users don't have to wait.

## Use with care

Since [binder](https://mybinder.org/) is an none profit project, please use this action sparsely and
in a none spammy manner, to treat their resources with care.
An example would be a repository, where the branch which should be build is only changed via pull requests
and this action is only executed on that branch.
To not spam [binder](https://mybinder.org/) is also why, by design, `target-repo` is a required
input and not read from the environment, since this prevents unnecessary builds of forks.

## Inputs

| Name                        | Requirement | Default    | Description                                                                                                                                    |
| --------------------------- | ----------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `target-repo`               | _required_  |            | Repository which should be build by mybinder.org .                                                                                             |
| `service-name`              | _required_  | `'gh'`     | gh \| gist \| gl \| git \| zenodo \| figshare Name of the service that hosts the repo.                                                         |
| `target-state`              | _optional_  | `'master'` | Name of the branch, tag or commit which should be build, by mybinder.org.                                                                      |
| `use-default-build-servers` | _optional_  | `true`     | Whether or not to use the default mybinder.org build servers. If false and additional-build-server is not specified, this will throw an error. |
| `additional-build-servers`  | _optional_  | `''`       | Newline separated list of urls, which point do binder build servers base url.                                                                  |
| `debug`                     | _optional_  | `false`    | If this is true all server response messages will be printed to console.                                                                       |

## Usage

See [action.yml](action.yml)

### Basic:

```yaml
name: 'Trigger-Binder-build'
on:
  push:
    branches:
      - <binder-branch>

jobs:
  trigger-binder-build:
    runs-on: [ubuntu-latest]
    steps:
      - uses: s-weigand/trigger-mybinder-build@v1
        with:
          target-repo: <my-github-handle>/<my-repo-name>
```

### Customized:

```yaml
name: 'Trigger-Binder-build'
on:
  push:
    branches:
      - <binder-branch>

jobs:
  trigger-binder-build:
    runs-on: [ubuntu-latest]
    steps:
      - uses: s-weigand/trigger-mybinder-build@v1
        with:
          target-repo: <my-gitlab-handle>/<my-repo-name>
          service-name: gl
          target-state: <binder-branch-tag-commit>
          use-default-build-servers: false
          additional-build-servers: |
            <build-server-url-1>
            <build-server-url-2>
          debug: true
```
