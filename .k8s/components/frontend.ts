import env from '@kosko/env'
import { create } from '@socialgouv/kosko-charts/components/app'
import environments from '@socialgouv/kosko-charts/environments'
import { getManifests as getHasuraManifests } from './hasura'
import { addEnv } from '@socialgouv/kosko-charts/utils/addEnv'
import { getIngressHost } from '@socialgouv/kosko-charts/utils/getIngressHost'
import { getManifestByKind } from '@socialgouv/kosko-charts/utils/getManifestByKind'
import { EnvVar } from 'kubernetes-models/v1/EnvVar'
import { Deployment } from 'kubernetes-models/apps/v1/Deployment'

export const getManifests = async () => {
  const name = 'frontend'
  const probesPath = '/'
  const subdomain = 'secretariat'

  const ciEnv = environments(process.env)
  const version = ciEnv.isPreProduction
    ? `preprod-${ciEnv.sha}`
    : ciEnv.tag || `sha-${ciEnv.sha}`

  const podProbes = ['livenessProbe', 'readinessProbe', 'startupProbe'].reduce(
    (probes, probe) => ({
      ...probes,
      [probe]: {
        httpGet: {
          path: probesPath,
          port: 'http'
        },
        initialDelaySeconds: 30,
        periodSeconds: 15
      }
    }),
    {}
  )

  const manifests = await create(name, {
    env,
    config: {
      subdomain,
      ingress: true,
      containerPort: 80
    },
    deployment: {
      image: `ghcr.io/socialgouv/secretariat/frontend:${version}`,
      container: {
        ...podProbes
      }
    }
  })

  return manifests
}

export default async () => {
  const manifests = await getManifests()

  /* pass dynamic deployment URL as env var to the container */
  // @ts-expect-error
  const deployment = getManifestByKind(manifests, Deployment) as Deployment

  const hasuraManifests = await getHasuraManifests()

  const hasuraUrl = new EnvVar({
    name: 'HASURA_API_URL',
    value: `https://${getIngressHost(hasuraManifests)}/v1/graphql`
  })

  addEnv({ deployment, data: hasuraUrl })

  return manifests
}
