/**
 * Notify background.js that the APK downloader icon should be shown. The icon
 * should be shown when a free application download is available.
 */
if (document.querySelector("[data-isfree=true]") != null) {
    chrome.extension.sendMessage({
        action: "showIcon"
    });
}
