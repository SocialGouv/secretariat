import env from '@kosko/env'
import environments from '@socialgouv/kosko-charts/environments'
import { create } from '@socialgouv/kosko-charts/components/hasura'

declare type Manifests = Promise<{ kind: string }[] | []>

export async function getManifests () {
  const hasura = 'exposed'

  const ciEnv = environments(process.env)
  const version = ciEnv.isPreProduction
    ? `preprod-${ciEnv.sha}`
    : ciEnv.tag || `sha-${ciEnv.sha}`

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
      startupProbe: {
        initialDelaySeconds: 120
      }
    },
    env
  }
  return await create('hasura', config)
}

export default async (): Manifests => {
  const manifests = await getManifests()
  return manifests
}
