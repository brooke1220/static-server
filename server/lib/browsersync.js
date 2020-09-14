const browserSync = require('browser-sync')
const hook = require('./hook.js')
const serveStatic = require('serve-static')
const resolve = require('path').resolve

let defailt_option = {
	ui: false,
	open: false,
	notify: false,
	index: "index.html",
	baseDir: resolve()
}

const middlewares = Symbol('middlewares')

class Browsersync {
	constructor(options = {}){
		this.hook = hook
		this[middlewares] = []
		this.options = Object.assign(defailt_option, options)
		this.hook.add(['restart', 'browsersync_restart'], browserSync.reload)
	}
	
	static root(root){
		defailt_option.baseDir = root
	}
	
	use(middleware){
		this[middlewares].push(middleware)
	}
	
	listen(port, cb){
		this.hook.add(['app_start', 'browsersync'], globalData => {
			if(globalData.start) return 

			browserSync.init({
				ui: this.options.ui,
				port: port,
				open: this.options.open,
				notify: this.options.notify,
				server: {
					baseDir: this.getStaticPath(),
					index: this.options.index,
					middleware: this.getMiddlewares()
					
				}
			})
		
			globalData.start = true
		});
		
		cb()
	}
	
	getMiddlewares(){
		return this[middlewares]
	}
	
	getStaticPath(){
		return this.options.baseDir
	}
}

function factory(options){
	return new Browsersync(options)
}

factory.static = (root) => {
	Browsersync.root(root)
	
	return serveStatic(root)
}

module.exports = factory