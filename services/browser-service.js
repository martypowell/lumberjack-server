var BrowserService = (function() {
    function getBrowserInfoFromUserAgent(userAgent, shouldReturnVersion) {
        var browserInfoArr = parseUserAgentString(userAgent);

        if (shouldReturnVersion) {
            return browserInfoArr.join(' ');
        }
        return browserInfoArr[0];
    }

    function parseUserAgentString(userAgent) {
        var tem;
        var M = userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if (/trident/i.test(M[1])) {
            tem = /\brv[ :]+(\d+)/g.exec(userAgent) || [];
            return 'IE ' + (tem[1] || '');
        }
        if (M[1] === 'Chrome') {
            tem = userAgent.match(/\b(OPR|Edge)\/(\d+)/);
            if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
        }
        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ((tem = userAgent.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
        return M;
    }

    return {
        getBrowserInfoFromUserAgent: getBrowserInfoFromUserAgent
    };
})();

module.exports = BrowserService;