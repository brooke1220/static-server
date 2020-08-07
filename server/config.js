module.exports = {
    porxy: {
        '/demo': {
            target: 'http://106.54.14.206',  //目标接口域名
            changeOrigin: true,  //是否跨域
            pathRewrite: {
                '^/demo': ''   //重写接口
            }
        }
    }
}