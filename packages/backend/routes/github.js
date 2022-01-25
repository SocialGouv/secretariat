const express = require('express')
const router = express.Router()
const axios = require('axios')

// Github throws 4xx status as "normal" responses
axios.defaults.validateStatus = function () {
  return true
}

async function registerUser (githubUsername) {
  const getUserIdResponse = await axios({
    url: `https://api.github.com/users/${githubUsername}`,
    method: 'get'
  })
  const registerUserResponse = await axios({
    url: 'https://api.github.com/orgs/SocialGouv/invitations',
    method: 'post',
    headers: { Authorization: 'token ' + process.env.GITHUB_TOKEN },
    data: { invitee_id: getUserIdResponse.data.id }
  })
  console.log('Registered user', registerUserResponse)
  return {
    status: 200,
    message: ''
  }
}

async function deleteUser (githubUsername) {
  const deleteUserResponse = await axios({
    url: `https://api.github.com/orgs/SocialGouv/memberships/${githubUsername}`,
    method: 'delete',
    headers: { Authorization: 'token ' + process.env.GITHUB_TOKEN }
  })
  console.log('Deleted user', deleteUserResponse)
  return {
    status: 200,
    message: ''
  }
}

async function getUserStatus (githubUsername) {
  const getUserStatusResponse = await axios({
    url: `https://api.github.com/orgs/SocialGouv/memberships/${githubUsername}`,
    method: 'get',
    headers: { Authorization: 'token ' + process.env.GITHUB_TOKEN }
  })
  console.log("Got user's status", getUserStatusResponse)
  return {
    status: 200,
    message: getUserStatusResponse.data.state || getUserStatusResponse.data.message
  }
}

router.post('/register-user', function (expressRequest, expressResponse, next) {
  registerUser(expressRequest.body.input.github_username).then((result) => {
    expressResponse.status(result.status).json(result)
  })
})

router.get('/user-status', function (expressRequest, expressResponse, next) {
  getUserStatus(expressRequest.body.input.github_username).then((result) => {
    expressResponse.status(result.status).json(result)
  })
})

router.delete('/delete-user', function (expressRequest, expressResponse, next) {
  deleteUser(expressRequest.body.input.github_username).then((result) => {
    expressResponse.status(result.status).json(result)
  })
})

module.exports = router
