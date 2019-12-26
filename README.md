# NodeJs_WebSocket_express-ws
   NodeJs_WebSocket_express-ws  NodeJs实现WebSocket——express-ws接口
#### 参考链接：
###### https://www.jianshu.com/p/b0700d4162e7
###### https://www.npmjs.com/package/express-ws
###### https://github.com/HenningM/express-ws

###### WebSocket是tcp/ip协议之上的一个Socket协议，是为了解决服务器向浏览器主动推送的场景而生，关于该协议的其它内容，本文不做赘述。今天主要讲述一下使用express-ws在NodeJs中如何实现WebSocket 通讯。
 ## 必备知识：

    NodeJs 基础
    Express 框架
    H5 WebSocket API

## 基本使用：

要想使用express-ws，首先要安装express以及express-ws：

npm i -S express express-ws

然后，将上面两个包引入到我们的主模块app.js中，并创建服务：

var express = require('express');
var expressWs = require('express-ws');

var app = express();

接下来一部就是最重要的一步了，执行我们引入的expressWs方法将app对象传入：

expressWs(app);

通过执行以上的方法，会在现有的app实例上绑定websocket协议的封装方法，在调用该方法时，其语法类似express提供的get、post、put等方法：

app.ws('/socketTest', function (ws, req){
    ws.send('你连接成功了')
    ws.on('message', function (msg) {
        // 业务代码
        ...
    })
})

回调函数中，我们可以拿到两个参数：

    ws：websocket实例，该实例可以监听来自客户端的消息发送事件（message事件）；
    req：浏览器请求（request）实例，我们可以通过解析这个对象拿到相应的参数。

ws实例提供了send方法，用于向浏览器socket发送数据。通过监听message事件，我们可以拿到浏览器通过websocket为我们发送的数据。

好了，大功告成。是不是超级简单？
###### 模块化开发

一般在大型应用中，我们不会将所有的代码都写在一个文件中，所以express为我们提供了模块化路由。在模块化路由中，express允许我们创建一个迷你app实例，最后将其挂载于我们的主模块实例上即可。如果我们想单独在module1模块上实现websocket，该怎么办呢？之前在npmjs的文档上没有查到方法，经过一番试验后发现，需要分别在主模块的app以及module1模块的子路由中分别进行绑定，才可以开开心心地在module1中使用ws方法：

// module1.js
var express = require('express');
var expressWs = require('express-ws');

var router = express.Router();
expressWs(router);

router.ws('/user', (ws, req) => {
        ws.on('message', (msg) => {
            console.log("connection 已经连接啦")
            //处理数据开始
            var setval = setInterval(() => {
                var arr = []
                for (var i = 0; i < 96; i++) {
                    arr.push(parseInt(Math.random() * 2330))
                }
                // 业务代码开始
                ws.send(JSON.stringify(arr));
                // 业务代码结束
            }, 1000)
            //处理数据结束
        })
        ws.on("close", (code, reason) => {
            // 断开连接触发 //
            console.log("connection closed")
            clearInterval(setval)
        })
        ws.on("error", (err) => {
            // 出错触发 //
            console.log("header err")
            console.log(err)
            clearInterval(setval)
        })
    })
    .get('/user', (req, resp) => {
        resp.send('Hello GET');
    })
    .post('/user', (req, resp) => {})


module.exports = router;

// app.js
var express = require("express");
var expressWs = require("express-ws");
var module1 = require("./module1");
var port=3000

var app = express();
expressWs(app);
app.use("/ifc", module1);

app.listen(port);
console.log("websocket server listen port is" + port)

## 页面代码

将以上的代码通过nodejs启动之后，我们便可以编写前端代码进行测试：

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <style>
        .box {
            width: 230px;
        }
    </style>
</head>

<body>
    <div class="box"></div>
    <script>
        if ("WebSocket" in window) {
            console.log("您的浏览器支持 WebSocket!");

            // 打开一个 web socket
            var ws = new WebSocket("ws://localhost:3000/ifc/user");

            ws.onopen = () => {
                // Web Socket 已连接上，使用 send() 方法发送数据
                ws.send("发送数据");
                console.log("数据发送中...");
            };

            ws.onmessage = (evt) => {
                var received_msg = evt.data;
                console.log(evt)
                console.log("数据已接收...");
                document.querySelector(".box").innerHTML = evt.data
                /* ws.close() */
            };

            ws.onclose = () => {
                // 关闭 websocket
                console.log("连接已关闭...");
            };
        } else {
            // 浏览器不支持 WebSocket
            console.log("您的浏览器不支持 WebSocket!");
        }
    </script>
</body>

</html>

socket实例中send方法，用于向服务器发送数据。close方法用于关闭该socket连接。
