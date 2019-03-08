/**
 * Created by paranoidyang on 2019/3/5
 */

var express = require('express')
var router = express.Router()

var Category = require('../models/Category')
var Content = require('../models/Content')

var data
/*通用数据*/
router.use(function (req, res, next) {
  data = {
    userInfo: req.userInfo,
    categories: [],
  }
  Category.find().then(function (categories) {
    data.categories = categories
    next()
  })
})

/**
 * 首页
 */
router.get('/', function (req, res, next) {

    data.category = req.query.category || '',
    data.count = 0,
    data.page = Number(req.query.page || 1),
    data.limit = 4,
    data.pages = 0

  var where = {}
  if(data.category) {
    where.category = data.category

  }

  Content.where(where).count().then(function (count) {

    data.count = count
    //计算总页数
    data.pages = Math.ceil(count / data.limit);
    //取值不能超过data.pages
    data.page = Math.min( data.page, data.pages );
    //取值不能小于1
    data.page = Math.max( data.page, 1 );

    var skip = (data.page - 1) * data.limit;

    return Content.where(where).find().sort({_id: -1}).limit(data.limit).skip(skip).populate(['category', 'user']).sort({
      addTime: -1
    })

  }).then(function (contents) {
    data.contents = contents
    console.log('data', data)
    res.render('main/index', data)
  })


})

/**
 * 详情页
 */
router.get('/detail', function (req, res){

  var contentId = req.query.contentid || '';

  Content.findOne({
    _id: contentId
  }).then(function (content) {

    data.content = content;
    console.log('文章信息', data.userInfo.username)

    /*记录阅读数*/
    content.views++;
    content.save();

    res.render('main/detail', data);
  });

})

module.exports = router