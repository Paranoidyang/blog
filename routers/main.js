/**
 * Created by paranoidyang on 2019/3/5
 */

var express = require('express')
var router = express.Router()

router.get('/', function (req, res, next) {
  res.render('main/index')

})

module.exports = router