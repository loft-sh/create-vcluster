<p align="center">
  <a href="https://github.com/lizardruss/create-loft-vcluster/actions"><img alt="create-loft-space status" src="https://github.com/lizardruss/create-loft-vcluster/workflows/build-test/badge.svg"></a>
</p>

# Create Loft VCluster Action

This is a GitHub Action to create a VCluster in loft. It is intended to be used with the [Install Loft CLI GitHub Action](https://github.com/lizardruss/install-loft-cli) to first install the Loft CLI.

## Usage

This action will create a Loft VCluster for use in job steps.

### Example: Create a VCluster named `staging` on commits to `main`.
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
      - name: Install Loft CLI
        uses: lizardruss/install-loft-cli@main
        with:
          loft-url: ${{ secrets.LOFT_URL }}
          loft-access-key: ${{ secrets.LOFT_ACCESS_KEY }}
      - name: Create staging VCluster
        uses: lizardruss/create-loft-vcluster@main
        with:
          name: staging
```

## Customizing

### inputs

The following inputs can be used as `step.with` keys

| Name                | Type     | Description                        |
|---------------------|----------|------------------------------------|
| `name`              | String   | The name of the virtual cluster to create
| `account`           | String   | The cluster account to create the virtual cluster with if it doesn't exist
| `cluster`           | String   | The cluster to create the virtual cluster in
| `space`             | String    | The space to create the virtual cluster in
| `delete-after`      | Number   | If set to non zero, will tell loft to delete the space after specified seconds of inactivity
| `sleep-after`       | Number   | If set to non zero, will tell the space to sleep after specified seconds of inactivity
| `disable-direct-cluster-endpoint`       | Boolean   | When enabled does not use an available direct cluster endpoint to connect to the vcluster
| `post-delete-vcluster`       | Boolean   | Delete the virtual cluster after the job run (default true)
| `post-delete-space`          | Boolean   | Delete the Space after the job run  (default true)