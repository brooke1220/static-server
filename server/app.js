const express = require('express');
const path = require('path')
const app = express();
const config = require('./config.js')
const httpPorxtMiddleware = require('./lib/porxy.js')

let staticPath = [
    path.join(__dirname, '../Views'),
    path.join(__dirname, '../')
]

staticPath.forEach(staticPath => app.use(express.static(staticPath)))

httpPorxtMiddleware(config.porxy, middleware => app.use(middleware));

app.listen(3000, () => {
    console.log('监听成功 地址为 http://localhost:3000')
});