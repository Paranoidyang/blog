/**
 * Created by paranoidyang on 2019/3/5
 */

var express = require('express')
var router = express.Router()
var User = require('../models/User')
var Content = require('../models/Content')

/*统一返回格式*/
var responseData
router.use(function (req, res, next) {
  responseData = {
    code: 0,
    message: ''
  }
  next()

})

/*注册*/
router.post('/user/register', function (req, res, next) {
  /*获取post提交过来的数据*/
  var username = req.body.username;
  var password = req.body.password;
  var repassword = req.body.repassword;

  //用户是否为空
  if ( username == '' ) {
    responseData.code = 1;
    responseData.message = '用户名不能为空';
    res.json(responseData);
    return;
  }
  //密码不能为空
  if (password == '') {
    responseData.code = 2;
    responseData.message = '密码不能为空';
    res.json(responseData);
    return;
  }
  //两次输入的密码必须一致
  if (password != repassword) {
    responseData.code = 3;
    responseData.message = '两次输入的密码不一致';
    res.json(responseData);
    return;
  }

  /*查询数据库判断用户名是否已经被注册*/
  User.findOne({
    username: username
  }).then(function (userinfo) {
    console.log(userinfo)
    if(userinfo) {
      /*表示已注册*/
      responseData.code = 4
      responseData.message = '用户名已经被注册了'
      res.json(responseData)
    }else {
      var user= new User({
        username: username,
        password: password
      })
      return user.save()
    }
  }).then(function (newUserInfo) {
    console.log('哈哈哈', newUserInfo)
    responseData.message = '注册成功'
    responseData.userInfo = {
      _id: newUserInfo.id,
      username: newUserInfo.username
    }
    req.cookies.set('userInfo', JSON.stringify(responseData.userInfo))
    res.json(responseData)
    return
  })
})

/*登录*/
router.post('/user/login', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  if ( username == '' || password == '' ) {
    responseData.code = 1;
    responseData.message = '用户名和密码不能为空';
    res.json(responseData);
    return;
  }

  //查询数据库中相同用户名和密码的记录是否存在，如果存在则登录成功
  User.findOne({
    username: username,
    password: password
  }).then(function(userInfo) {
    if (!userInfo) {
      responseData.code = 2;
      responseData.message = '用户名或密码错误';
      res.json(responseData);
      return;
    }
    //用户名和密码是正确的
    responseData.message = '登录成功';
    responseData.userInfo = {
      _id: userInfo.id,
      username: userInfo.username
    }
    req.cookies.set('userInfo', JSON.stringify(responseData.userInfo))
    res.json(responseData);
    return;
  })

});

/*退出*/
router.get('/user/logout', function(req, res) {
  req.cookies.set('userInfo', null);
  res.json(responseData);
})

/*评论提交*/
router.post('/comment/post', function(req, res) {
  //内容的id
  var contentId = req.body.contentid || '';
  var postData = {
    username: req.userInfo.username,
    postTime: new Date(),
    content: req.body.content
  };

  //查询当前这篇内容的信息
  Content.findOne({
    _id: contentId
  }).then(function(content) {
    content.comments.push(postData);
    return content.save();
  }).then(function(newContent) {
    responseData.message = '评论成功';
    responseData.data = newContent;
    res.json(responseData);
  });
})

/*获取文章的所有评论*/
router.get('/comment', function(req, res) {
  var contentId = req.query.contentid || '';

  Content.findOne({
    _id: contentId
  }).then(function(content) {
    responseData.data = content.comments;
    res.json(responseData);
  })
});

module.exports = router