const browserSync = require('browser-sync')
const nodemon = require('nodemon')
const httpPorxtMiddleware = require('./lib/proxy.js')

nodemon({ script: 'server/app.js' }).on('start', function () {
	browserSync.init({
        server: {
            baseDir: './public',
			index: "index.htm"
        },
		port: 8888,
		ui: false
    })
}).on('restart', browserSync.reload)