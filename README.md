<p style="text-align: center;">
  <a href="https://github.com/loft-sh/create-vcluster/actions">
    <img alt="create-loft-space status" src="https://github.com/loft-sh/create-vcluster/workflows/build-test/badge.svg">
  </a>
</p>

# create-vcluster

This is a GitHub Action to create a VCluster in vCluster Platform. It is intended
to be used with the [setup-vcluster GitHub Action](https://github.com/loft-sh/setup-vcluster)
to first install the vCluster CLI.

## Usage

This action will create a vCluster Platform-managed vCluster for use in job steps.

### Example: Create a vCluster named `staging` on commits to `main`

```yaml
name: Create Staging Cluster
on:
  push:
    branches:
      - 'main'

jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    steps:
      - name: Install vCluster CLI
        uses: loft-sh/setup-vcluster@main
        with:
          url: ${{ secrets.VCLUSTER_PLATFORM_URL }}
          access-key: ${{ secrets.VCLUSTER_PLATFORM_ACCESS_KEY }}
      - name: Create staging VCluster
        uses: loft-sh/create-vcluster@main
        with:
          name: staging
```

## Customizing

### inputs

The following inputs can be used as `step.with` keys

| Name                              | Type    | Description                                                                                                                |
| --------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------- |
| `name`                            | String  | The name of the virtual cluster to create                                                                                  |
| `account`                         | String  | The cluster account to create the virtual cluster with if it doesn't exist                                                 |
| `cluster`                         | String  | The cluster to create the virtual cluster in                                                                               |
| `project`                         | String  | The project to use (requires vCluster Platform v4.0 and above)                                                             |
| `space`                           | String  | The space to create the virtual cluster in                                                                                 |
| `delete-after`                    | Number  | If set to non zero, will tell vCluster Platform to delete the space after specified seconds of inactivity                  |
| `sleep-after`                     | Number  | If set to non zero, will tell the space to sleep after specified seconds of inactivity                                     |
| `disable-direct-cluster-endpoint` | Boolean | When enabled does not use an available direct cluster endpoint to connect to the vcluster                                  |
| `team`                            | String  | The team to create the virtual cluster for                                                                                 |
| `user`                            | String  | The user to create the virtual cluster for                                                                                 |
| `template`                        | String  | The virtual cluster template to use to create the virtual cluster                                                          |
| `parameters`                      | String  | Embedded YAML array of App Parameters. The contents of this input will be written to a file and passed to the vCluster CLI |
| `auto-cleanup`                    | Boolean | Delete the virtual cluster after the job run (default false)                                                               |
| `auto-cleanup-space`              | Boolean | Delete the space after the job run (defaults to same value as `auto-cleanup`)                                              |
| `use`                             | Boolean | If vCluster Platform should use the virtual cluster if its already there (default false)                                   |

