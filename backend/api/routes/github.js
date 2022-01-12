const express = require('express')
const router = express.Router()

router.post('/add', function (req, res, next) {
  res.status(200).json({ text: req.body })
})

module.exports = router
