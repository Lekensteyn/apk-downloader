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
}, MarketSession = {
    download: function(c, tabUrl, tabId) {
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
            this.executeRawHttpsQuery(this.generateAssetRequest(b), tabUrl, tabId)
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
    executeRawHttpsQuery: function(c, tabUrl, tabId) {
        chrome.tabs.update(tabId, {
            url: tabUrl + "&download=apk#" + c
        })
    }
};
