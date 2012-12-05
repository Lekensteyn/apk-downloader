/**
 * Tries to download a file given a specially base64-encoded binary request.
 */
function requestAsset(asset_query_base64) {
    var xmlhttp = new XMLHttpRequest;
    xmlhttp.open("POST", "https://android.clients.google.com/market/api/ApiRequest", false);
    xmlhttp.responseType = "arraybuffer";
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 0) {
                alert("ERROR:\n- Please disable SSL error warnings\n- Check your account information ( email and device ID )")
            } else {
                var respArr = new Uint8Array(this.response);
                var data = "";
                for (var i = 0; i < respArr.byteLength; i++) {
                    var c = respArr[i];
                    data += c < 32 || c > 122 ? "~" : String.fromCharCode(c);
                }
                if ((match = /(https?:\/\/[^:]+)/gi.exec(data))) {
                    var baseURL = match[1];
                    if ((match = /MarketDA.*?(\d+)/gi.exec(data))) {
                        cookieValue = match[1];
                        window.location.href = baseURL + "#" + cookieValue;
                    } else {
                        console.log("COOKIE: " + data);
                        alert("ERROR: Cannot download this app!");
                    }
                } else {
                    console.log("HTTP: " + data);
                    alert("ERROR: Cannot download this app!");
                }
            }
        }
    };
    xmlhttp.send("version=2&request=" + asset_query_base64)
}
var request64 = window.location.hash.substr(1);
requestAsset(request64);
