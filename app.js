/**
 * Created by paranoidyang on 2019/3/5
 */

/*加载express模块*/
var express = require('express')
/*加载模板处理模块*/
var swig = require('swig')
/*加载数据库模块*/
var mongoose = require('mongoose')
/*加载body-parse，用来处理post提交过来的数据*/
var bodyParse = require('body-parser')
/*加载cookies模块*/
var Cookies = require('cookies')
/*创建app应用 =》NodeJs Http.createServer()*/
var app = express()

var User = require('./models/User')
/*设置静态文件托管：当用户访问的url以/public开始，那么直接返回对应的__dirname + '/public'下的文件*/
app.use('/public', express.static(__dirname + '/public'))

/*配置模板：第一个参数是模板文件的后缀，第二个参数是解析模板文件的方法*/
app.engine('html', swig.renderFile)
/*设置模板文件存放目录*/
app.set('views', './views')
/*注册模板引擎*/
app.set('view engine', 'html')
/*在开发过程中，取消模板缓存*/
swig.setDefaults({
  cache: false
})

/*body-parse的配置*/
app.use(bodyParse.urlencoded({extended: true}))

/*cookies的配置*/
app.use(function (req, res, next) {
  req.cookies = new Cookies(req, res)

  /*解析登录用户的cookie信息*/
  req.userInfo = {}
  if(req.cookies.get('userInfo')) {
    try {
      req.userInfo = JSON.parse(req.cookies.get('userInfo'))
      /*获取当前用户的类型，判断是否是管理员*/
      User.findById(req.userInfo._id).then(function (userInfo) {
        req.userInfo.isAdmin = Boolean(userInfo.isAdmin)
        next()

      })
    }catch(e) {
      next()
    }



  } else {
    next()
  }

})

/*根据不同功能划分模块*/
app.use('/admin', require('./routers/admin'))
app.use('/api', require('./routers/api'))
app.use('/', require('./routers/main'))


/*监听http请求*/
mongoose.connect('mongodb://localhost:27018/blog', function (err) {
  if(err) {
    console.log('数据库连接失败')
  }else {
    console.log('数据库连接成功')
    app.listen(80)
  }
})