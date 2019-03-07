/**
 *
 * Created by paranoidyang on 2019/3/5
 */

var express = require('express')
var router = express.Router()

var User = require('../models/User')
var Category = require('../models/Category')

router.use(function(req, res, next) {
  if (!req.userInfo.isAdmin) {
    //如果当前用户是非管理员
    res.send('对不起，只有管理员才可以进入后台管理');
    return;
  }
  next();
})

/**
 * 首页
 */
router.get('/', function(req, res, next) {
  res.render('admin/index', {
    userInfo: req.userInfo
  })
});

/**
 * 用户管理
 */
router.get('/user', function(req, res, next) {
  /*
    * 从数据库中读取所有的用户数据
    *
    * limit(Number) : 限制获取的数据条数
    *
    * skip(2) : 忽略数据的条数
    *
    * 每页显示2条
    * 1 : 1-2 skip:0 -> (当前页-1) * limit
    * 2 : 3-4 skip:2
    * */

  var page = Number(req.query.page || 1);
  var limit = 10;
  var pages = 0;

  User.count().then(function(count) {

    //计算总页数
    pages = Math.ceil(count / limit);
    //取值不能超过pages
    page = Math.min( page, pages );
    //取值不能小于1
    page = Math.max( page, 1 );
    //跳过数据条数
    var skip = (page - 1) * limit;

    User.find().limit(limit).skip(skip).then(function(users) {
      res.render('admin/user_index', {
        userInfo: req.userInfo,
        users: users,
        count: count,
        pages: pages,
        limit: limit,
        page: page
      });
    });

  });


});

/**
 * 分类首页
 */
router.get('/category', function (req, res, next) {
  res.render('admin/category_index', {
    userInfo: req.userInfo
  })

})

/**
 * 分类首页
 */
router.get('/category/add', function (req, res, next) {
  res.render('admin/category_add', {
    userInfo: req.userInfo
  })

})

/**
 * 保存分类
 */
router.post('/category/add', function (req, res, next) {

  var name = req.body.name || ''

  if(name == '') {
    res.render('admin/error', {
      userInfo: req.userInfo,
      message: '名称不能为空'
    })
    return
  }

  /*判断数据库中是否已经存在同名分类*/
  Category.findOne({
    name: name
  }).then(function (rs) {
    if(rs) {
      res.render('admin/error', {
        userInfo: req.userInfo,
        message: '分类已经存在了'
      })
      return Promise.reject()
    }else {
      /*数据库中不存在，保存该分类（save是个对象方法，需要先实例化一个对象才能调用）*/
      return new Category({
        name: name
      }).save()

    }

  }).then(function (newCategory) {
    res.render('admin/success', {
      userInfo: req.userInfo,
      message: '分类保存成功',
      url: '/admin/category'
    })

  })

})

module.exports = router