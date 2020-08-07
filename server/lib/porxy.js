const { createProxyMiddleware: httpProxyMiddleware } = require('http-proxy-middleware');

function formatPorxy(porxys){
    return Object.keys(porxys).map((context) => {
        let proxyOptions;
        const correctedContext = context.replace(/^\*$/, '**').replace(/\/\*$/, '');
        if (typeof porxys[context] === 'string') {
          proxyOptions = {
            context: correctedContext,
            target: porxys[context]
          };
        } else {
          proxyOptions = Object.assign({}, porxys[context]);
          proxyOptions.context = correctedContext;
        }
        proxyOptions.logLevel = proxyOptions.logLevel || 'warn';
        return proxyOptions;
    })
}

function getProxyMiddleware (proxyConfig) {
    const context = proxyConfig.context || proxyConfig.path;

    if (proxyConfig.target) {
        return httpProxyMiddleware(context, proxyConfig);
    }
}


function porxyMiddleware(porxys, middleware){
    porxys.forEach((proxyConfigOrCallback) => {
        let proxyConfig;

        if (typeof proxyConfigOrCallback === 'function') {
          proxyConfig = proxyConfigOrCallback();
        } else {
          proxyConfig = proxyConfigOrCallback;
        }

        let proxyMiddleware = getProxyMiddleware(proxyConfig);

        middleware((req, res, next) => {
            if (typeof proxyConfigOrCallback === 'function') {
                const newProxyConfig = proxyConfigOrCallback();
                if (newProxyConfig !== proxyConfig) {
                  proxyConfig = newProxyConfig;
                  proxyMiddleware = getProxyMiddleware(proxyConfig);
                }
            }
              
            const bypass = typeof proxyConfig.bypass === 'function';
            const bypassUrl = bypass && proxyConfig.bypass(req, res, proxyConfig) || false;

            if (bypassUrl) {
                req.url = bypassUrl;
                next();
            } else if (proxyMiddleware) {
                return proxyMiddleware(req, res, next);
            } else {
                next();
            }
        })
    });
}

module.exports = function(porxys, middleware){
    if (!Array.isArray(porxys)) porxys = formatPorxy(porxys)
    porxyMiddleware(porxys, porxyCallback => middleware(porxyCallback))
}