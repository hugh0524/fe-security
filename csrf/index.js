/**
 * Created by yinhe on 19/9/21.
 */

const express = require('express')
var cookieParser = require('cookie-parser')
const app = express()
app.use('/static', express.static('./'))
app.use(cookieParser())

// app.use(function(req, res, next){
//     //设置跨域访问
//     res.header('Access-Control-Allow-Origin', 'http://localhost:63342');
//     res.header('Access-Control-Allow-Headers', '*');
//     res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
//     res.header('Access-Control-Allow-Credentials', 'true')
//
//     if (req.method == 'OPTIONS') {
//         res.send(200); /*让options请求快速返回*/
//     }else {
//         next();
//     }
// })

app.set('view engine', 'ejs')


app.get('/cookie/write', function (req, res) {
    res.cookie("test-cookie", "123")
    res.send("ok")
})
app.get('/cookie/read', function (req, res) {
   console.log(req.cookies)
   res.send("ok:" + req.cookies["test-cookie"])
})

app.get('/cookie/readWithToken', function (req, res) {
    console.log(req.cookies)
    if(req.cookies.jstoken) {
        res.send("ok: 含有token:" + req.cookies.jstoken)
    } else {
        res.send("bad: 缺少验证token" )
    }
})


app.listen(3000, () => console.log('Example app listening on port 3000!'))