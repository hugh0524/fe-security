/**
 * Created by yinhe on 19/9/21.
 */

const express = require('express')
const app = express()
app.use('/static', express.static('public'))
app.get('/deny', (req, res) => {

    res.header("X-Frame-Options", "deny")
    res.send('deny X-Frame-Options')
})


app.get('/sameorigin', (req, res) => {

    res.header("X-Frame-Options", "sameorigin")
    res.send('sameorigin X-Frame-Options')
})

app.get('/url', (req, res) => {
    var url = req.query.url

    res.header("X-Frame-Options", `allow-from ${url}`)
    res.send(`allow-from ${url} X-Frame-Options`)
})




app.listen(3000, () => console.log('Example app listening on port 3000!'))