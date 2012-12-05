function requestAsset(f) {
    var a = new XMLHttpRequest;
    a.open("POST", "https://android.clients.google.com/market/api/ApiRequest", !0);
    a.responseType = "arraybuffer";
    a.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    a.onreadystatechange = function() {
        if (4 == this.readyState) {
            if (0 == this.status) {
                alert("ERROR:\n- Please disable SSL error warnings\n- Check your account information ( email and device ID )")
            } else {
                for (var a = [], b = "", c, e = new Uint8Array(this.response), d = 0; d < e.byteLength; d++) {
                    a.push(e[d]), c = e[d], b = 32 > c || 122 < c ? b + "~" : b + String.fromCharCode(c)
                }
                (a = /(https?:\/\/[^:]+)/gi.exec(b)) ? (c = a[1], (a = /MarketDA.*?(\d+)/gi.exec(b)) ? (cookieValue = a[1], window.location.href = c + "#" + cookieValue) : (console.log("COOKIE: " + b), alert("ERROR: Cannot download this app!"))) : (console.log("HTTP: " + b), alert("ERROR: Cannot download this app!"))
            }
        }
    };
    a.send("version=2&request=" + f)
}
var request64 = window.location.hash.substr(1, window.location.hash.length - 1);
requestAsset(request64);
