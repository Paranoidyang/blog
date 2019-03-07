/**
 *
 * Created by paranoidyang on 2019/3/5
 */

var express = require('express')
var router = express.Router()

var User = require('../models/User')

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
  /*从数据库中读取所有的用户数据*/
  User.find().then(function (users) {
    res.render('admin/user_index', {
      userInfo: req.userInfo,
      users: users
    })

  })


});


module.exports = router