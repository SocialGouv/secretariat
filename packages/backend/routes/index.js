const express = require('express')
const router = express.Router()

router.get('/', function (_, res, next) {
  res.status(200).send({ text: 'up and running!' })
})

router.get('/healthz', function (_, res, next) {
  res.status(200)
})

module.exports = router
