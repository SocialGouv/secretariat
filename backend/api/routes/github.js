const express = require('express')
const router = express.Router()

router.put('/add', function (_, res, next) {
  res.status(200).send({ text: 'PUT' })
})

module.exports = router
