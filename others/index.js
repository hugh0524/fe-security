/**
 * Created by yinhe on 19/9/21.
 */

const express = require('express')
const app = express()

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


app.listen(3000, () => console.log('Example app listening on port 3000!'))