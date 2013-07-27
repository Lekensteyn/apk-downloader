/**
 * Authors:
 *      Rob Wu <gwnRob@gmail.com>
 *      Peter Wu <lekensteyn@gmail.com>
 *
 * Released under the terms of GPLv3+.
 */

/**
 * URL used for requesting a special download token.
 */
var API_URL = "https://android.clients.google.com/market/api/ApiRequest";
var FDFE_URL_BASE = "https://android.clients.google.com/fdfe/";

function showLastError() {
    console.log("chrome.extension.lastError", chrome.extension.lastError);
}

/**
 * Functions for cookie management.
 */
function setCookie(storeId, cookie, callback) {
    cookie.httpOnly = true;
    cookie.storeId = storeId;
    chrome.cookies.set(cookie, function (data) {
        if (data === null) {
            showLastError();
        } else if (typeof callback == "function") {
            callback();
        }
    });
}
function setMDACookie(storeId, marketda, callback) {
    setCookie(storeId, {
        name: "MarketDA",
        value: marketda,
        url: "http://android.clients.google.com/market/",
        domain: "android.clients.google.com", /* set for subdomains too */
        path: "/market/"
    }, callback);
}
function setAPICookie(storeId, authToken, callback) {
    setCookie(storeId, {
        url: API_URL,
        name: "ANDROIDSECURE",
        value: authToken,
    }, callback);
}
function removeAPICookie(storeId, callback) {
    chrome.cookies.remove({
        name: "ANDROIDSECURE",
        url: API_URL,
        storeId: storeId
    }, function(data) {
        if (data === null) {
            showLastError();
        } else if (typeof callback == "function") {
            callback();
        }
    });
}

/**
 * Debugging utility: convert a (binary) string to a hexadecimal format.
 */
function strToHex(str) {
    return str.split("").map(function (c) {
        return ("0" + c.charCodeAt(0).toString(16)).substr(-2);
    }).join("");
}

/**
 * Try to retrieve download URL for a given base64-encoded query.
 */
function processAsset(asset_query_base64, packageName, tabId) {
    if (typeof tabId !== 'number') {
        throw Error('processAsset: tabId must be a number');
    }
    chrome.cookies.getAllCookieStores(function(cookieStores) {
        var i, cookieStore;
        for (i=0; i<cookieStores.length; i++) {
            cookieStore = cookieStores[i];
            if (cookieStore.tabIds.indexOf(tabId) !== -1) {
                _real_processAsset(asset_query_base64, packageName, cookieStore.id, tabId);
                return; // Found id. Return now!
            }
        }
        // At this point, no cookie store was found for the caller. Use default store:
        console.log('Cookiestore not found for tab ' + tabId + '. Using default store');
        _real_processAsset(asset_query_base64, packageName, "0");
    });
}
function _real_processAsset(asset_query_base64, packageName, storeId, tabId) {
    var payload = "version=2&request=" + asset_query_base64;
    var xhr = new XMLHttpRequest();
    xhr.responseType = "arraybuffer";
    xhr.open("POST", API_URL);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload = function() {
        removeAPICookie(storeId, function() {
            if (xhr.status == 403) {
                hasValidSession(function(isValid) {
                    if (isValid) {
                        alert("Cannot download app, maybe it is a paid one or something?");
                    } else {
                        alert("Session expired, please re-login");
                        openTab("options.html");
                    }
                });
                return;
            }
            if (xhr.status != 200) {
                alert("ERROR: Cannot download this app!\n" + xhr.status + " " +
                    xhr.statusText);
                return;
            }
            var chars = new Uint8Array(xhr.response);
            /* gzipped content, try to unpack */
            var data = (new JXG.Util.Unzip(chars)).unzip()[0][0];

            console.log("Response: " + data);
            console.log("Response (hex): " + strToHex(data));

            var url, marketda;
            if ((url = /https?:\/\/[^:]+/i.exec(data))) {
		/* not sure if decoding is even necessary */
                url = decodeURIComponent(url[0]);
                /* format: "MarketDA", 0x72 ('r'), length of data, data */
                if ((marketda = /MarketDA..(\d+)/.exec(data))) {
                    marketda = marketda[1];
                    var filename = packageName + ".apk";
                    downloadAPK(marketda, url, filename, storeId, tabId);
                    return;
                }
            }
            alert("ERROR: Cannot download this app!");
        });
    };
    xhr.onerror = removeAPICookie.bind(null, storeId);
    setAPICookie(storeId, localStorage.getItem("authToken"), function () {
        xhr.send(payload);
    });
}

/**
 * Tries to download an APK file given its URL and cookie.
 */
function downloadAPK(marketda, url, filename, storeId, tabId) {
    if (!filename) filename = "todo-pick-a-name.apk";

    setMDACookie(storeId, marketda, function() {
        console.log("Trying to download " + url + " and save it as " + filename);
        chrome.tabs.sendMessage(tabId, {
            action: "download",
            url: url,
            filename: filename
        });
    });
}

/**
 * Determine whether a valid session is available. If the callback is called
 * with "false" as first argument, then it is 100% sure that the session is
 * invalid.
 */
function hasValidSession(callback) {
    var authToken = localStorage.getItem("authToken");
    if (authToken == null) {
        callback(false);
        return;
    }

    var xhr = new XMLHttpRequest();
    xhr.open("GET", FDFE_URL_BASE + "delivery");
    /* GoogleLogin auth=... is required, otherwise you get a 302 which is
     * uncatchable */
    xhr.setRequestHeader("Authorization", "GoogleLogin auth=" + authToken);
    xhr.onload = function () {
        console.log("xhr status " + xhr.status);
        if (xhr.status == 401) {
            /* 401 Unauthorized: invalid login token */
            localStorage.removeItem("authToken");
            callback(false);
        } else {
            /* assume valid session for other status codes (400, ???) */
            callback(true);
        }
    };
    xhr.onerror = function () {
        console.log("Unable to test session for validity, assuming valid one");
        callback(true);
    };
    xhr.send(null);
}
/* Try to focus existing options page or open a new tab for it */
function openTab(url) {
    chrome.tabs.query({
        url: url
    }, function(tabs) {
        if (tabs.length > 0) {
            focusTab(tabs[0]);
        } else {
            chrome.tabs.create({
                url: url,
                active: true
            }, focusTab);
        }

        function focusTab(tab) {
            chrome.windows.update(tab.windowId, {
                focused: true
            });
        }
    });
}

/**
 * When a tab is loaded, show the APK Downloader icon if on the market page.
 */
chrome.extension.onMessage.addListener(function (message, sender, sendResponse) {
    if (message && message.action == "showIcon") {
        if (message.show) {
            chrome.pageAction.show(sender.tab.id);
        } else {
            chrome.pageAction.hide(sender.tab.id);
        }
    }
});

chrome.pageAction.onClicked.addListener(function (tab) {
    var match = /play\.google\.com\/store\/apps\/details\?(?:|.*&)id=([\w\d\.\_]+)/i.exec(tab.url);
    if (match) {
        MarketSession.download(match[1], tab.id);
    }
});
