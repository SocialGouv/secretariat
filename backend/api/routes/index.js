const express = require('express')
const router = express.Router()

/* GET home page. */
router.get('/', function (_, res, next) {
  res.send({
    status: 200,
    body: process.env.GITHUB_TOKEN
  })
})

module.exports = router
