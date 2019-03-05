/**
 * Created by paranoidyang on 2019/3/5
 */

/*加载express模块*/
var express = require('express')
/*加载模板处理模块*/
var swig = require('swig')
/*创建app应用 =》NodeJs Http.createServer()*/
var app = express()

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

/*路由配置*/
app.get('/', function (req, res, next) {
  // res.send('<h1>欢迎光临我的博客</h1>')
  /*读取views目录下的指定文件，解析并返回给客户端*/
  res.render('index')
})


/*监听http请求*/
app.listen(8081)