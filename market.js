/**
 * Notify background.js that the APK downloader icon should be shown. The icon
 * should be shown when a free application download is available.
 */
if (document.querySelector("[data-isfree=true]") != null) {
    chrome.extension.sendMessage({
        action: "showIcon"
    });
}

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
