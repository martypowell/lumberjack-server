/**
 * Public Methods
 */
const getBrowserInfoFromUserAgent = (userAgent, shouldReturnVersion) => {
    const browserInfoArr = parseUserAgentString(userAgent);
    const browserInfoExist  = browserInfoArr & browserInfoArr.length > 0;

    if (shouldReturnVersion && browserInfoExist) {
        return browserInfoArr.join(' ');
    }
    return browserInfoExist ? browserInfoArr[0] : null;
};

/**
 * Private Methods
 */
const parseUserAgentString = (userAgent) => {
    let tem;
    let M = userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
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
};


module.exports = {
    getBrowserInfoFromUserAgent: getBrowserInfoFromUserAgent
};