const express = require('express')
const router = express.Router()

/* GET home page. */
router.get('/', function (_, res, next) {
  res.send({
    status: 200,
    body: 'oui'
  })
})

module.exports = router
