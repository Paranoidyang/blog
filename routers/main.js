/**
 * Created by paranoidyang on 2019/3/5
 */

var express = require('express')
var router = express.Router()

router.get('/', function (req, res, next) {
  console.log('type', req.userInfo)
  res.render('main/index', {
    userInfo: req.userInfo
  })

})

module.exports = router