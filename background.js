/**
 * Copyright: redphoenix89 <http://codekiem.com/>, Stephan Schmitz <eyecatchup@gmail.com>
 */

/* used for serializing Javascript types in a special binary format used by
 * MarketSession. */
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

/* Starts an APK download attempt */
var MarketSession = {
    /**
     * Called when pressing the APK Downloader icon in the location bar.
     */
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
    /**
     * @returns base64 encoded binary data that can be passed to Google Play API.
     */
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
                    simOperatorLength = out.length + 1;
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
        /* Old code behaved like this: encode as base64, but use - instead of +
         * and / instead of _ */
        return btoa(out).replace(/\+/g, "-").replace(/\//g, "_");
    },
    executeRawHttpsQuery: function(asset_query_base64, packageName, tabId) {
        var psUrl = "https://play.google.com/store/apps/details?id=" + packageName;
        /* processed in download.js */
        psUrl += "&download=apk#" + asset_query_base64;
        chrome.tabs.update(tabId, {
            url: psUrl
        });
    }
};

/**
 * When a tab is loaded, show the APK Downloader icon if requested by market.js.
 */
chrome.extension.onMessage.addListener(function (message, sender, sendResponse) {
    if (message && message.action == "showIcon") {
        chrome.pageAction.show(sender.tab.id);
    }
});

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
