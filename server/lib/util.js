exports.args = ((args) => {
	let argv = {}
	
	for(var arg of args){
		let matchs = arg.match(/^--(\w+)(=(\w+))?$/)
		if(matchs) argv[matchs[1]] = matchs[3] || true
	}
	
	return argv
})(process.argv)

