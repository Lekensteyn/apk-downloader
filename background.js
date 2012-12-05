/**
 * Copyright: redphoenix89 <http://codekiem.com/>, Stephan Schmitz <eyecatchup@gmail.com>
 */
// regex to match urls against pattern

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
    stringToByteArray: function(str) {
        var b = [];
        for (var pos = 0; pos < str.length; ++pos) {
            b.push(str.charCodeAt(pos));
        }
        return b;
    },
    serializeInt32: function(num) {
        var data = [];
        for (var times = 0; times < 5; times++) {
            var elm = num % 128;
            if ((num >>>= 7)) {
                elm += 128;
            }
            data.push(elm);
            if (num == 0) {
                break;
            }
        }
        return data;
    },
    serializeData: function(arr, value, data_type) {
        var new_data = [];
        switch (data_type) {
            case "string":
                new_data = new_data.concat(this.serializeInt32(value.length));
                new_data = new_data.concat(this.stringToByteArray(value));
                break;
            case "int32":
                new_data = new_data.concat(this.serializeInt32(value));
                break;
            case "bool":
                new_data.push(value ? 1 : 0);
                break;
        }
        return arr.concat(new_data)
    }
};

var MarketSession = {
    download: function(packageName, tabId) {
        if (!localStorage.getItem("simCountry") || !localStorage.getItem("simOperator") || !localStorage.getItem("simOperatorCode")) {
            alert("Please set Sim Operator in the Options page first");
            chrome.tabs.create({
                url: "options.html"
            });
        } else {
            var options = {};
            options.authToken = localStorage.authToken;
            options.isSecure = true;
            options.sdkVersion = 2009011;
            options.deviceId = localStorage.deviceId;
            options.deviceAndSdkVersion = "passion:15";
            options.locale = "en";
            options.country = "us";
            options.operatorAlpha = localStorage.simOperator;
            options.simOperatorAlpha = localStorage.simOperator;
            options.operatorNumeric = localStorage.simOperatorCode;
            options.simOperatorNumeric = localStorage.simOperatorCode;
            options.packageName = packageName;
            this.executeRawHttpsQuery(this.generateAssetRequest(options), packageName, tabId)
        }
    },
    generateAssetRequest: function(options, tabUrl) {
        /* some constants to avoid magic numbers */
        var FIELD_AUTHTOKEN = 0;
        var FIELD_ISSECURE = 2;
        var FIELD_SDKVERSION = 4;
        var FIELD_DEVICEID = 6;
        var FIELD_DEVICEANDSDKVERSION = 8;
        var FIELD_LOCALE = 10;
        var FIELD_COUNTRY = 12;
        var FIELD_OPERATORALPHA = 14;
        var FIELD_SIMOPERATORALPHA = 16;
        var FIELD_OPERATORNUMERIC = 18;
        var FIELD_SIMOPERATORNUMERIC = 20;
        var FIELD_PACKAGENAME_LENGTH = 22;
        var FIELD_PACKAGENAME = 24;
        /* describes format of request, numbers will be filled in, arrays of
         * numbers will be appended as-is */
        var desc = [FIELD_AUTHTOKEN, [16], FIELD_ISSECURE, [24],
        FIELD_SDKVERSION, [34], FIELD_DEVICEID, [42],
        FIELD_DEVICEANDSDKVERSION, [50], FIELD_LOCALE, [58],
        FIELD_COUNTRY, [66], FIELD_OPERATORALPHA, [74],
        FIELD_SIMOPERATORALPHA, [82], FIELD_OPERATORNUMERIC, [90],
        FIELD_SIMOPERATORNUMERIC, [19, 82],
        FIELD_PACKAGENAME_LENGTH, [10], FIELD_PACKAGENAME, [20]];
        var out = [];
        var simOperatorLength = 0;
        for (var i = 0; i<desc.length; i++) {
            if ("object" == typeof desc[i]) {
                /* array, just append it as raw numbers to the output */
                out = out.concat(desc[i]);
                continue;
            }
            switch (desc[i]) {
                case FIELD_AUTHTOKEN:
                    out = Utils.serializeData(out, options.authToken, "string");
                    break;
                case FIELD_ISSECURE:
                    out = Utils.serializeData(out, options.isSecure, "bool");
                    break;
                case FIELD_SDKVERSION:
                    out = Utils.serializeData(out, options.sdkVersion, "int32");
                    break;
                case FIELD_DEVICEID:
                    out = Utils.serializeData(out, options.deviceId, "string");
                    break;
                case FIELD_DEVICEANDSDKVERSION:
                    out = Utils.serializeData(out, options.deviceAndSdkVersion, "string");
                    break;
                case FIELD_LOCALE:
                    out = Utils.serializeData(out, options.locale, "string");
                    break;
                case FIELD_COUNTRY:
                    out = Utils.serializeData(out, options.country, "string");
                    break;
                case FIELD_OPERATORALPHA:
                    out = Utils.serializeData(out, options.operatorAlpha, "string");
                    break;
                case FIELD_SIMOPERATORALPHA:
                    out = Utils.serializeData(out, options.simOperatorAlpha, "string");
                    break;
                case FIELD_OPERATORNUMERIC:
                    out = Utils.serializeData(out, options.operatorNumeric, "string");
                    break;
                case FIELD_SIMOPERATORNUMERIC:
                    out = Utils.serializeData(out, options.simOperatorNumeric, "string");
                    simOperatorLength = out.length + n1;
                    break;
                case FIELD_PACKAGENAME_LENGTH:
                    out = out.concat(Utils.serializeInt32(options.packageName.length + FIELD_ISSECURE));
                    break;
                case FIELD_PACKAGENAME:
                    out = Utils.serializeData(out, options.packageName, "string");
                    break;
            }
        }
        out = [10].concat(Utils.serializeInt32(simOperatorLength)).concat([10]).concat(out);
        return base64.encode(out, false, true)
    },
    executeRawHttpsQuery: function(asset_query_base64, packageName, tabId) {
        var psUrl = "https://play.google.com/store/apps/details?id=" + packageName;
        /* processed in download.js */
        psurl += "&download=apk#" + asset_query_base64;
        chrome.tabs.update(tabId, {
            url: psUrl
        });
    }
};
// tab onUpdated listeners
chrome.tabs.onUpdated.addListener(function(tabId, change) {
    if (change.status == "complete") {
        chrome.tabs.query({
            active: true
        }, function (tabs) {
            // FIXME: parseUri is not defined
            if (parseUri(tabs[0].url) !== false) {
                chrome.pageAction.show(tabs[0].id);
            } else {
                chrome.pageAction.hide(tabs[0].id);
            }
        });
    }
});


/**
 * Called when the URL of a tab is changed.
 */
function checkForValidUrl(message, sender, sendResponse) {
    /* when a page is fully loaded and the page is really about an app */
    if ("complete" == sender.status &&
        /play\.google\.com\/store\/apps\/details\?id=[\w\d\.\_]+/.test(sendResponse.url)) {
        /* HTML response by market.js */
        chrome.tabs.sendRequest(message, {
            action: "getHtml"
        }, function(data) {
            if (data && data.html && data.html.indexOf('data-isfree="true"') != -1) {
                chrome.pageAction.show(message);
            }
        });
    }
}
chrome.tabs.onUpdated.addListener(checkForValidUrl);

/**
 * Always add session cookies and change User Agent when trying to download
 * an APK.
 */
chrome.webRequest.onBeforeSendHeaders.addListener(
    function (details) {
        return {
            requestHeaders: [{
                name: "Cookie",
                value: "MarketDA=" + /#(\d+)$/.exec(details.url)[1]
            }, {
                name: "User-Agent",
                value: "Android-Market/2"
            }]
        };
    }, {
        urls: [
        "*://android.clients.google.com/market/download/*",
        "*://*.android.clients.google.com/market/GetBinary/*"]
    }, ["requestHeaders", "blocking"]);

/**
 * Force file download dialog for APKs.
 */
chrome.webRequest.onHeadersReceived.addListener(
    function (details) {
        var headers = details.responseHeaders;
        details = /GetBinary\/([^\/]+)\/(\d+)/i.exec(details.url);
        if (details) {
            headers.push({
                name: "Content-Disposition",
                value: "attachment; filename=" + details[1] + "-" + details[2] + ".apk"
            });
        }
        return {
            responseHeaders: headers
        };
    }, {
        urls: ["*://*.android.clients.google.com/market/GetBinary/*"]
    }, ["responseHeaders", "blocking"]);

/**
 * Always add session cookie, force Android User Agent and emulate form
 * submission when trying to access Google Play API.
 */
chrome.webRequest.onBeforeSendHeaders.addListener(
    function () {
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
        };
    }, {
        urls: ["https://android.clients.google.com/market/api/*"],
        types: ["xmlhttprequest"]
    }, ["requestHeaders", "blocking"]);

/**
 * Enable CORS for all scripts to https://android.clients.google.com/market/api/
 * and force a gzipped text response.
 * TODO: maybe this tries to make Chromium ungzip stuff?
 */
chrome.webRequest.onHeadersReceived.addListener(
    function (details) {
        var headers = details.responseHeaders;
        for (var index in headers) {
            if ("content-type" == headers[index].name.toLowerCase()) {
                headers[index].value = "text/plain";
            }
        }
        headers.push({
            name: "Access-Control-Allow-Origin",
            value: "*"
        });
        headers.push({
            name: "Content-Encoding",
            value: "gzip"
        });
        return {
            responseHeaders: headers
        };
    }, {
        urls: ["https://android.clients.google.com/market/api/*"],
        types: ["xmlhttprequest"]
    }, ["responseHeaders", "blocking"]);

// page action onclick listener
chrome.pageAction.onClicked.addListener(function (tab) {
    var match = /play\.google\.com\/store\/apps\/details\?id=([\w\d\.\_]+)/i.exec(tab.url);
    if (match) {
        MarketSession.download(match[1], tab.id);
    }
});
