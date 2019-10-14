/**
 * Created by yinhe on 19/9/21.
 */

const express = require('express')
const app = express()

const encodeUtil = require("./utils/encodeUtils")

app.use('/utils', express.static('utils'))
app.use('/assets', express.static('assets'))
app.set('view engine', 'ejs')

app.get('/queryXss', function (req, res) {
    res.render('queryXss', { title: 'hi,xss', content: req.query.cont })
})

app.get('/queryXssClient', function (req, res) {
    res.render('queryXssClient', { title: 'hi,xss', content: req.query.cont })
})

app.get('/charXss', function (req, res) {
    res.render('charXss', {})
})

app.get('/domXss', function (req, res) {
    res.render('domXss', {})
})

app.get('/domXss/:id', function (req, res) {
    var cont = req.query.cont || "";
    var needEncode = req.query.encode
    if(needEncode == "js") {
        cont = encodeUtil.javascriptEncode(cont)
    } else if(needEncode == "html") {
        cont = encodeUtil.htmlEncode(cont)
    }
    res.render('domXss'+req.params.id, {content: cont})
})

app.get('/mimeXss', function (req, res) {
    res.render('mimeXss', {})
})


app.listen(3000, () => console.log('Example app listening on port 3000!'))