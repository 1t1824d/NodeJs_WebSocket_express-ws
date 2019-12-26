// module1.js
var express = require('express');
var expressWs = require('express-ws');

var router = express.Router();
expressWs(router);

router
    .ws('/user', (ws, req) => {
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