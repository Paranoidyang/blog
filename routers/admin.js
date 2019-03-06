/**
 *
 * Created by paranoidyang on 2019/3/5
 */

var express = require('express')
var router = express.Router()

router.get('/user', function (req, res, next) {
  res.send('Admin-User')

})

module.exports = router