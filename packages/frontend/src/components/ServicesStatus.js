import React from 'react'
import PropTypes from 'prop-types'

import GithubStatus from 'components/services/GithubStatus'

function ServicesStatus ({ user }) {
  const servicesComponents = []
  for (const service of user.user_services) {
    switch (service.service_name) {
      case 'github':
        servicesComponents.push(<GithubStatus user={user} />)
        break
      default:
        console.error('Unknown service name', service.service_name)
    }
  }

  return (
    <div className="col-span-7">
      <div className="font-medium">Status des services</div>
      {servicesComponents}
    </div>
  )
}

ServicesStatus.propTypes = {
  user: PropTypes.object
}

export default ServicesStatus
