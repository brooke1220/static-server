const path = require('path')

module.exports = {
	port: 3001,
	
	static_path: path.join(__dirname, '../public'),
	
    proxy: {
        '/demo': {
            target: 'https://a.qingxiaoyun.com',  //目标接口域名
            changeOrigin: true,  //是否跨域
            pathRewrite: {
                '^/demo': ''   //重写接口
            }
        }
    }
}
