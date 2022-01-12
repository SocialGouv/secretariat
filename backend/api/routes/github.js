const express = require('express')
const router = express.Router()

router.post('/add-user', function (req, res, next) {
  res.status(200).json({
    status: 200,
    text: 'received Github username : ' + req.body.input.username
  })
})

module.exports = router
