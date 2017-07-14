var defaultOptions = {
    reportUrl: '',
    reportKey: 'mlrMsg'
}
var env = (typeof window !== 'undefined') ? 'browser' : 'node'

/**
 * type 1,2  1代表未捕获的异常，2是已经捕获的异常
 * @param {*} errorMsg 
 * @param {*} type 
 */
function report(errorMsg, type) {
    if (defaultOptions.reportUrl) {
        var url = defaultOptions.reportUrl + '?' + defaultOptions.reportKey + '=' + errorMsg + '&type=' + type + '&from=' + env + '&time=' + new Date().getTime()
        if (env === 'browser') {
            new Image().src = url
        } else {
            var http = require('http')
            http.get(url)
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
bugReport.report = function (msg) {
    report(msg, 2)
}

if (env === 'browser') {
    window.onerror = function (msg, url, line, col, error) {
        if (msg.toLowerCase().indexOf('script error') > -1) {
            return
        }
        if (error && error.stack) {
            var stack = error.stack.replace(/\n/gi, '').split(/\bat\b/).slice(0, 9).join('@').replace(/\?[^:]+/gi, '')
            if (stack.indexOf(msg) < 0) {
                msg = (msg + '(' + url + ':' + line + ':' + col + ')' + '@' + stack).substr(0, 1000)
            }
        }
        report(msg, 1)
    }
} else {
    global.process.on('uncaughtException', function (error) {
        if (error && error.stack) {
            error = error.stack.toString().replace(/\n/gi, '').split(/\bat\b/).slice(0, 9).join('@').replace(/\?[^:]+/gi, '')
            report(error, 1)
        }
    })
}
module.exports = bugReport