/**
 * Notify background.js that the APK downloader icon should be shown. The icon
 * should be shown when a free application download is available (assume a price
 * containing digits is non-free). To avoid breakage in the future, also show
 * the button if the price cannot be determined.
 */
function triggerButtonVisibility() {
    var price = document.querySelector("meta[itemprop=price]");
    var showButton = !price || !/\d/.test(price.getAttribute("content"));
    console.log("APK Downloader button will be " +
            (showButton ? "shown" : "hidden"));
    chrome.extension.sendMessage({
        action: "showIcon",
        show: showButton
    });
}

triggerButtonVisibility();

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
