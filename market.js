/* called by background.js */
chrome.extension.onRequest.addListener(function(message, sender, sendResponse) {
    if (message.action == "getHtml") {
        sendResponse({
            html: document.documentElement.outerHTML
        });
    } else {
        sendResponse({});
    }
});
