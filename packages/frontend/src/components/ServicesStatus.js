import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { gql, useQuery } from '@apollo/client'

function ServicesStatus ({ user }) {
  const [elements, setElements] = useState([])

  useQuery(
    gql`
      query GetGithubUsername($user_id: Int!) {
        github_usernames_by_pk(user_id: $user_id) {
          username
        }
      }
    `,
    {
      variables: { user_id: user.id },
      onCompleted: (data) => {
        if (data.github_usernames_by_pk !== null) {
          setElements([
            ...elements,
            <div key={data.github_usernames_by_pk.username}>
              {data.github_usernames_by_pk.username}
            </div>
          ])
        }
      }
    }
  )

  return <div className="col-span-7">{elements}</div>
}

ServicesStatus.propTypes = {
  user: PropTypes.object
}

export default ServicesStatus
