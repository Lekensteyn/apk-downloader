/**
 * Notify background.js that the APK downloader icon should be shown. The icon
 * should be shown when a free application download is available (assume a price
 * containing digits is non-free). To avoid breakage in the future, also show
 * the button if the price cannot be determined.
 */

/* jshint browser:true */
/* globals chrome, console, MutationObserver, WebKitMutationObserver */

'use strict';
var shownButton;
function triggerButtonVisibilityCheck() {
    var showButton = false;
    if (location.pathname.lastIndexOf('/store/apps/details', 0) === 0) {
        var price = document.querySelector("meta[itemprop=price]");
        showButton = !price || !/\d/.test(price.getAttribute("content"));
    }
    if (showButton !== shownButton) {
        console.log("APK Downloader button will be " +
                (showButton ? "shown" : "hidden"));
        chrome.extension.sendMessage({
            action: "showIcon",
            show: showButton
        });
        shownButton = showButton;
    }
}

if (typeof MutationObserver === 'undefined') { // Chrome 26-
    window.MutationObserver = WebKitMutationObserver;
}
var observer = new MutationObserver(function() {
    triggerButtonVisibilityCheck();
});
observer.observe(document.body, {
    childList: true,
    attributes: false,
    characterData: false,
    subtree: true
});
triggerButtonVisibilityCheck();

chrome.extension.onMessage.addListener(function (message, sender, sendResponse) {
    if (message && message.action == "download") {
        console.log("Requested download of " + message.filename + " from " +
            message.url);
        var a = document.createElement("a");
        a.href = message.url;
        a.download = message.filename;
        a.click();
    }
});
