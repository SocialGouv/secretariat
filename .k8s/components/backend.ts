import env from '@kosko/env'
import { create } from '@socialgouv/kosko-charts/components/app'
import environments from '@socialgouv/kosko-charts/environments'

export const getManifests = async () => {
  const name = 'backend'
  const probesPath = '/healthz'
  const subdomain = 'secretariat-backend'

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
      subDomainPrefix: `${subdomain}-`,
      ingress: true,
      withPostgres: true,
      containerPort: 3000
    },
    deployment: {
      image: `ghcr.io/socialgouv/secretariat/backend:${version}`,
      container: {
        ...podProbes
      }
    }
  })

  return manifests
}

export default async () => {
  const manifests = await getManifests()

  return manifests
}
