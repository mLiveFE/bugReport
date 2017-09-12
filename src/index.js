var defaultOptions = {
    reportUrl: 'http://localhost:8092/api/bug/handleBugReport',
    reportKey: 'mlrMsg',
    port: 0
}
var env = (typeof window !== 'undefined') ? 'browser' : 'node'

/**
 * type 1,2  1代表未捕获的异常，2是已经捕获的异常
 * @param {*} errorMsg 
 * @param {*} type 
 */
function report(errorMsg, type) {
    if (defaultOptions.reportUrl) {
        errorMsg = encodeURIComponent(errorMsg)
        var url = defaultOptions.reportUrl + '?' + defaultOptions.reportKey + '=' + errorMsg + '&type=' + type + '&from=' + env + '&time=' + new Date().getTime()
        if (env === 'browser') {
            url += '&env=' + encodeURIComponent(navigator.userAgent)
            new Image().src = url
        } else {
            url += '&env=' + encodeURIComponent(global.process.version)
            if (defaultOptions.ip && defaultOptions.port) {
                var http = require('http')
                var URL = require('url')
                var options = URL.parse(url)
                options.headers = {
                    referer: 'http://' + defaultOptions.ip + ':' + defaultOptions.port
                }
                http.get(options)
            }
        }
    }
}
var bugReport = {}
bugReport.config = function (options) {
    for (var i in options) {
        if (options.hasOwnProperty(i) && defaultOptions.hasOwnProperty(i)) {
            defaultOptions[i] = options[i]
        }
    }
}
bugReport.report = function (error) {
    if (error && error.stack) {
        error = error.stack.toString().replace(/\n/gi, '').split(/\bat\b/).slice(0, 9).join('@').replace(/\?[^:]+/gi, '')
        report(error, 1)
    }
}
if (env === 'browser') {
    window.onerror = function (msg, url, line, col, error) {
        if (msg.toLowerCase().indexOf('script error') > -1) {
            return
        }
        if (error && error.stack) {
            var stack = error.stack.replace(/\n/gi, '').split(/\bat\b/).slice(0, 9).join('@').replace(/\?[^:]+/gi, '')
            msg = (msg + '(' + url + ':' + line + ':' + col + ')' + '@' + stack).substr(0, 1000)
        }
        report(msg, 1)
    }
} else {
    defaultOptions.ip = getIPAdress()
    global.process.on('uncaughtException', function (error) {
        if (error && error.stack) {
            error = error.stack.toString().replace(/\n/gi, '').split(/\bat\b/).slice(0, 9).join('@').replace(/\?[^:]+/gi, '')
            report(error, 1)
        }
    })
}

function getIPAdress() {
    try {
        var interfaces = require('os').networkInterfaces()
        for (var devName in interfaces) {
            var iface = interfaces[devName]
            for (var i = 0; i < iface.length; i++) {
                var alias = iface[i]
                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                    return alias.address
                }
            }
        }
    } catch (error) {
        return ''
    }

}
module.exports = bugReport