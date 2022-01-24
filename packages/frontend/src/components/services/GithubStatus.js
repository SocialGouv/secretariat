import React from 'react'
import PropTypes from 'prop-types'
import { gql, useQuery } from '@apollo/client'

function GithubStatus ({ user }) {
  const getGithubUsername = useQuery(
    gql`
      query GetGithubUsername($user_id: Int!) {
        github_usernames_by_pk(user_id: $user_id) {
          username
        }
      }
    `,
    {
      variables: { user_id: user.id }
    }
  )

  const getGithubUserStatus = useQuery(
    gql`
      query GetGithubUserStatus($github_username: String!) {
        get_github_user_status(github_username: $github_username) {
          status
          message
        }
      }
    `,
    {
      skip: !getGithubUsername.data,
      variables: {
        github_username: getGithubUsername.data?.github_usernames_by_pk.username
      }
    }
  )

  if (getGithubUsername.error) {
    console.error(getGithubUsername.error)
  }

  if (getGithubUserStatus.error) {
    console.error(getGithubUserStatus.error)
  }

  if (getGithubUsername.loading || getGithubUserStatus.loading) {
    return <div>Loading...</div>
  } else {
    return (
      <div>
        Github status :{' '}
        <span className='font-bold'>{getGithubUserStatus.data.get_github_user_status.message}</span>
      </div>
    )
  }
}

GithubStatus.propTypes = {
  user: PropTypes.object
}

export default GithubStatus
