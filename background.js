/**
 * Copyright: redphoenix89 <http://codekiem.com/>, Stephan Schmitz <eyecatchup@gmail.com>
 */
// regex to match urls against pattern

function checkForValidUrl(a, b, c) {
    "complete" == b.status && /play\.google\.com\/store\/apps\/details\?id=[\w\d\.\_]+/.test(c.url) && chrome.tabs.sendRequest(a, {
        action: "getHtml"
    }, function(b) {
        b && b.html && -1 < b.html.indexOf('data-isfree="true"') && chrome.pageAction.show(a)
    })
}
// base64 helper functions
var base64 = function() {};
base64.classID = function() {
    return "system.utility.base64"
};
base64.isFinal = function() {
    return !0
};
base64.encString = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
base64.encStringS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
base64.encode = function(e, g, j) {
    if (1 > arguments.length) return null;
    var l = [];
    if (3 <= arguments.length && !0 != j && !1 != j) return null;
    var h = 3 <= arguments.length && j ? this.encStringS : this.encString,
        k = "string" == typeof e;
    if (!k && "object" != typeof e && !(e instanceof Array)) return null;
    2 > arguments.length && (g = !0);
    if (!0 != g && !1 != g) return null;
    for (var m = !k || !g ? 1 : 2, a = "", b = 0, f = 1, c = 0, i = b = 0; i < e.length; i++) {
        for (var b = k ? e.charCodeAt(i) : e[i], d = m - 1; 0 <= d; d--) l[d] = b & 255, b >>= 8;
        for (d = 0; d < m; d++) c = c << 8 & 65280 | l[d], b = 63 << 2 * f & c, c -= b, a += h.charAt(b >> 2 * f), f++, 4 == f && (a += h.charAt(c & 63), f = 1)
    }
    switch (f) {
        case 2:
            a += h.charAt(63 & 16 * c);
            a += "==";
            break;
        case 3:
            a += h.charAt(63 & 4 * c), a += "="
    }
    return a
};
// main functions to generate requests
var Utils = {
    stringToByteArray: function(c) {
        for (var b = [], a = 0; a < c.length; ++a) {
            b.push(c.charCodeAt(a))
        }
        return b
    },
    serializeInt32: function(c) {
        for (var b = [], a = 0; 0 == a || c && 5 > a; a++) {
            var d = c % 128;
            (c >>>= 7) && (d += 128);
            b.push(d)
        }
        return b
    },
    serializeData: function(c, b, a) {
        var d = [];
        "string" == a ? (d = d.concat(this.serializeInt32(b.length)), d = d.concat(this.stringToByteArray(b))) : "int32" == a ? d = d.concat(this.serializeInt32(b)) : "bool" == a && d.push(b ? 1 : 0);
        return c.concat(d)
    }
},
MarketSession = {
    download: function(c, tabId) {
        if (!localStorage.getItem("simCountry") || !localStorage.getItem("simOperator") || !localStorage.getItem("simOperatorCode")) {
            alert("Please set Sim Operator in the Options page first"), chrome.tabs.create({
                url: "options.html"
            })
        } else {
            var b = {};
            b.authToken = localStorage.authToken;
            b.isSecure = !0;
            b.sdkVersion = 2009011;
            b.deviceId = localStorage.deviceId;
            b.deviceAndSdkVersion = "passion:15";
            b.locale = "en";
            b.country = "us";
            b.operatorAlpha = localStorage.simOperator;
            b.simOperatorAlpha = localStorage.simOperator;
            b.operatorNumeric = localStorage.simOperatorCode;
            b.simOperatorNumeric = localStorage.simOperatorCode;
            b.packageName = c;
            this.executeRawHttpsQuery(this.generateAssetRequest(b), c, tabId)
        }
    },
    generateAssetRequest: function(c, tabUrl) {
        var b = [0, [16], 2, [24], 4, [34], 6, [42], 8, [50], 10, [58], 12, [66], 14, [74], 16, [82], 18, [90], 20, [19, 82], 22, [10], 24, [20]],
            a = [],
            d, f = 0,
            e;
        for (e in b) {
            if ("object" == typeof b[e]) {
                a = a.concat(b[e])
            } else {
                switch (d = b[e], d) {
                    case 0:
                        a = Utils.serializeData(a, c.authToken, "string");
                        break;
                    case 2:
                        a = Utils.serializeData(a, c.isSecure, "bool");
                        break;
                    case 4:
                        a = Utils.serializeData(a, c.sdkVersion, "int32");
                        break;
                    case 6:
                        a = Utils.serializeData(a, c.deviceId, "string");
                        break;
                    case 8:
                        a = Utils.serializeData(a, c.deviceAndSdkVersion, "string");
                        break;
                    case 10:
                        a = Utils.serializeData(a, c.locale, "string");
                        break;
                    case 12:
                        a = Utils.serializeData(a, c.country, "string");
                        break;
                    case 14:
                        a = Utils.serializeData(a, c.operatorAlpha, "string");
                        break;
                    case 16:
                        a = Utils.serializeData(a, c.simOperatorAlpha, "string");
                        break;
                    case 18:
                        a = Utils.serializeData(a, c.operatorNumeric, "string");
                        break;
                    case 20:
                        a = Utils.serializeData(a, c.simOperatorNumeric, "string");
                        f = a.length + 1;
                        break;
                    case 22:
                        a = a.concat(Utils.serializeInt32(c.packageName.length + 2));
                        break;
                    case 24:
                        a = Utils.serializeData(a, c.packageName, "string")
                }
            }
        }
        a = [10].concat(Utils.serializeInt32(f)).concat([10]).concat(a);
        return base64.encode(a, !1, !0)
    },
    executeRawHttpsQuery: function(c, packageName, tabId) {
        var psUrl = "https://play.google.com/store/apps/details?id=" + packageName + "&download=apk#" + c;
        chrome.tabs.update(tabId, {
            url: psUrl
        })
    }
};
// tab onUpdated listeners
chrome.tabs.onUpdated.addListener(function(tabId, change) {
    if (change.status == "complete") {
        chrome.tabs.query({
            active: true
        }, function(tabs) {
            if (parseUri(tabs[0].url) !== false) {
                chrome.pageAction.show(tabs[0].id);
            } else {
                chrome.pageAction.hide(tabs[0].id);
            }
        });
    }
});
chrome.tabs.onUpdated.addListener(checkForValidUrl);
// webRequest onBeforeSendHeaders listeners
chrome.webRequest.onBeforeSendHeaders.addListener(

function(a) {
    return {
        requestHeaders: [{
            name: "Cookie",
            value: "MarketDA=" + /#(\d+)$/.exec(a.url)[1]
        }, {
            name: "User-Agent",
            value: "Android-Market/2"
        }]
    }
}, {
    urls: [
        "*://android.clients.google.com/market/download/*",
        "*://*.android.clients.google.com/market/GetBinary/*"]
}, ["requestHeaders", "blocking"]);
chrome.webRequest.onHeadersReceived.addListener(

function(a) {
    var b = a.responseHeaders;
    if (a = /GetBinary\/([^\/]+)\/(\d+)/i.exec(a.url)) {
        b.push({
            name: "Content-Disposition",
            value: "attachment; filename=" + a[1] + "-" + a[2] + ".apk"
        })
    }
    return {
        responseHeaders: b
    }
}, {
    urls: ["*://*.android.clients.google.com/market/GetBinary/*"]
}, ["responseHeaders", "blocking"]);
chrome.webRequest.onBeforeSendHeaders.addListener(

function() {
    return {
        requestHeaders: [{
            name: "Content-Type",
            value: "application/x-www-form-urlencoded"
        }, {
            name: "Cookie",
            value: "ANDROIDSECURE=" + localStorage.authToken
        }, {
            name: "User-Agent",
            value: "Android-Market/2"
        }]
    }
}, {
    urls: ["https://android.clients.google.com/market/api/*"],
    types: ["xmlhttprequest"]
}, ["requestHeaders", "blocking"]);
chrome.webRequest.onHeadersReceived.addListener(

function(a) {
    a = a.responseHeaders;
    for (index in a) {
        "content-type" == a[index].name.toLowerCase() && (a[index].value = "text/plain")
    }
    a.push({
        name: "Access-Control-Allow-Origin",
        value: "*"
    });
    a.push({
        name: "Content-Encoding",
        value: "gzip"
    });
    return {
        responseHeaders: a
    }
}, {
    urls: ["https://android.clients.google.com/market/api/*"],
    types: ["xmlhttprequest"]
}, ["responseHeaders", "blocking"]);
// page actoin onclick listener
chrome.pageAction.onClicked.addListener(function(tab) {
    var match = /play\.google\.com\/store\/apps\/details\?id=([\w\d\.\_]+)/i.exec(tab.url);
    if (match) {
        MarketSession.download(match[1], tab.id);
    }
});
