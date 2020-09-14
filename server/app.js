const express = require('express')
const browsersync = require('./lib/browsersync.js')
const httpPorxtMiddleware = require('./lib/proxy.js')
const config = require('./config.js')
const hook = require('./lib/hook')
const { args } = require('./lib/util.js')
const server = args.browsersync ? browsersync : express
const app = server()

app.use(server.static(config.static_path))

httpPorxtMiddleware(config.proxy, middleware => {
	app.use(middleware)
});

hook.add(['start', 'app'], (globalData) => {
	app.listen(config.port, () => {
		console.log("监听成功地址为 http://localhost:" + config.port)
		hook.listen('app_start', globalData)
	});
})

app.hook = hook

module.exports = app