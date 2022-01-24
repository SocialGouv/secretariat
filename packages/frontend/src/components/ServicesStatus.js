import React from 'react'
import PropTypes from 'prop-types'

import GithubStatus from 'components/services/GithubStatus'

function ServicesStatus ({ user }) {
  return (
    <div className="col-span-7">
      <div className="font-medium">Services</div>
      <GithubStatus user={user} />
    </div>
  )
}

ServicesStatus.propTypes = {
  user: PropTypes.object
}

export default ServicesStatus
