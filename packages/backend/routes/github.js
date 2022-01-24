const express = require('express')
const router = express.Router()
const axios = require('axios')

async function registerUser (githubUsername) {
  try {
    const getUserIdResponse = await axios({
      url: `https://api.github.com/users/${githubUsername}`,
      method: 'get'
    })
    await axios({
      url: 'https://api.github.com/orgs/SocialGouv/invitations',
      method: 'post',
      headers: { Authorization: 'token ' + process.env.GITHUB_TOKEN },
      data: { invitee_id: getUserIdResponse.data.id }
    })
    console.log('Registered user successfully')
    return {
      status: 200,
      message: ''
    }
  } catch (error) {
    console.error(error)
    return {
      status: error.response.status,
      message: error.response.data.message
    }
  }
}

async function getUserStatus (githubUsername) {
  try {
    const getUserStatusResponse = await axios({
      url: `https://api.github.com/orgs/SocialGouv/memberships/${githubUsername}`,
      method: 'get',
      headers: { Authorization: 'token ' + process.env.GITHUB_TOKEN }
    })
    console.log("Got user's status successfully")
    console.log(getUserStatusResponse)
    return {
      status: 200,
      message: getUserStatusResponse.data.state
    }
  } catch (error) {
    console.error(error)
    return {
      status: error.response.status,
      message: error.response.data.message
    }
  }
}

router.post('/register-user', function (expressRequest, expressResponse, next) {
  registerUser(expressRequest.body.input.githubUsername).then((result) => {
    expressResponse.status(result.status).json(result)
  })
})

router.get('/user-status', function (expressRequest, expressResponse, next) {
  getUserStatus(expressRequest.query.username).then((result) => {
    expressResponse.status(result.status).json(result)
  })
})

module.exports = router
