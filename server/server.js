const app = require('./app.js')
const nodemon = require('nodemon')

let globalData = {}

nodemon({ script: 'server/app.js' }).on('start', () => {
	app.hook.listen('start', globalData)
}).on('restart', () => {
	app.hook.listen('restart', globalData)
})