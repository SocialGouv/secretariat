import env from '@kosko/env'
import environments from '@socialgouv/kosko-charts/environments'
import { create } from '@socialgouv/kosko-charts/components/hasura'
import { getManifests as getBackendManifests } from './backend'
import { addEnv } from '@socialgouv/kosko-charts/utils/addEnv'
import { getManifestByKind } from '@socialgouv/kosko-charts/utils/getManifestByKind'
import { EnvVar } from 'kubernetes-models/v1/EnvVar'
import { Deployment } from 'kubernetes-models/apps/v1/Deployment'
import { Service } from 'kubernetes-models/v1'

declare type Manifests = Promise<{ kind: string }[] | []>

export async function getManifests () {
  const probesPath = '/healthz'
  const hasura = 'exposed'

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
          port: 3000
        },
        initialDelaySeconds: 37,
        periodSeconds: 15
      }
    }),
    {}
  )

  const config = {
    config: { ingress: hasura === 'exposed' },
    deployment: {
      image: `ghcr.io/socialgouv/secretariat/hasura:${version}`,
      resources: {
        limits: {
          cpu: '1000m',
          memory: '1024Mi'
        },
        requests: {
          cpu: '200m',
          memory: '128Mi'
        }
      },
      // startupProbe: {
      //   initialDelaySeconds: 370
      // }
      container: {
        ...podProbes
      }
    },
    env
  }
  return await create('hasura', config)
}

export default async (): Manifests => {
  const manifests = await getManifests()

  /* pass dynamic deployment URL as env var to the container */
  // @ts-expect-error
  const deployment = getManifestByKind(manifests, Deployment) as Deployment

  const appManifests = await getBackendManifests()
  const appService = appManifests.find((m) => m.kind === 'Service') as Service
  let upstream = ''
  if (appService && appService?.spec?.ports && appService?.spec?.ports.length) {
    const serviceName = appService.metadata?.name
    const servicePort = appService?.spec?.ports[0].port
    upstream = `http://${serviceName}:${servicePort}`
  }

  const hasuraUrl = new EnvVar({
    name: 'BACKEND_URL',
    value: upstream
  })

  addEnv({ deployment, data: hasuraUrl })

  return manifests
}
