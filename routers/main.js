/**
 * Created by paranoidyang on 2019/3/5
 */

var express = require('express')
var router = express.Router()

var Category = require('../models/Category')


router.get('/', function (req, res, next) {

  /*读取所有的分类请求*/
  Category.find().then(function (categories) {
    console.log(categories)
    res.render('main/index', {
      userInfo: req.userInfo,
      categories: categories
    })


  })



})

module.exports = router