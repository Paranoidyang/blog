/**
 * Created by paranoidyang on 2019/3/5
 */

var express = require('express')
var router = express.Router()

var Category = require('../models/Category')
var Content = require('../models/Content')


router.get('/', function (req, res, next) {

  var data = {
    userInfo: req.userInfo,
    categories: [],

    count: 0,
    page: Number(req.query.page || 1),
    limit: 10,
    pages: 0
  }

  /*读取所有的分类请求*/
  Category.find().then(function (categories) {

    data.categories = categories
    return Content.count()

  }).then(function (count) {

    data.count = count
    //计算总页数
    data.pages = Math.ceil(count / data.limit);
    //取值不能超过data.pages
    data.page = Math.min( data.page, data.pages );
    //取值不能小于1
    data.page = Math.max( data.page, 1 );

    var skip = (data.page - 1) * data.limit;

    return Content.find().sort({_id: -1}).limit(data.limit).skip(skip).populate(['category', 'user']).sort({
      addTime: -1
    })

  }).then(function (contents) {
    data.contents = contents
    console.log('data', data)
    res.render('main/index', data)
  })


})

module.exports = router