const express = require('express')
const router = express.Router()
const axios = require('axios')

async function adduser (username) {
  try {
    const getUserIdResponse = await axios({
      url: `https://api.github.com/users/${username}`,
      method: 'get'
    })
    await axios({
      url: 'https://api.github.com/orgs/SocialGouv/invitations',
      method: 'post',
      headers: { Authorization: 'token ' + process.env.GITHUB_TOKEN },
      data: { invitee_id: getUserIdResponse.data.id }
    })
    console.log('Added user successfully')
    return {
      status: 200
    }
  } catch (error) {
    console.error(error)
    return {
      status: error.response.status,
      text: error.response.data.message
    }
  }
}

router.post('/add-user', function (expressRequest, expressResponse, next) {
  adduser(expressRequest.body.input.username).then((result) => {
    expressResponse.status(result.status).json(result)
  })
})

module.exports = router
