
/**
 * 用于post data的生成
 * @param {*} data 
 */
function encodeFormData(data){
    if(!data) return "";
    var pairs = [];
    for(var name in data){
        if(!data.hasOwnProperty(name)) continue;
        if(typeof data[name] === "function") continue;
        var value = data[name].toString();
        name = encodeURIComponent(name.replace("%20","+"));
        value = encodeURIComponent(value.replace("%20","+"));
        pairs.push(name+"="+value);
    }
    return pairs.join("&");
}
function setcookie(name, value, expires, path, domain, secure) {
    var cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
    if(expires)
        cookie += "; expires=" + expires.toGMTString();
    if(path)
        cookie += "; path=" + path;
    if(domain)
        cookie += "; domain=" + domain;
    if(secure)
        cookie += "; scecure=" + secure;
    document.cookie = cookie;
}
function removeCookie(name, path, domain) {
    document.cookie = name + "="
     + "; path=" + path
     + "; domain=" + domain
     + "; max-age=0";
}
function getcookie(key) {
    var cookie = {};
    var all = document.cookie;
    if(all === "")
        return cookie;
    var list = all.split("; ");
    for(var i = 0; i < list.length; i++){
        var item = list[i];
        var p = item.indexOf("=");
        var name = item.substring(0,p);
        name = decodeURIComponent(name);
        var value = item.substring(p + 1);
        value = decodeURIComponent(value);
        cookie[name] = value;
    }
    if(key)
        return cookie[key];
    return cookie;
}

function post(content){
    var xhr = new XMLHttpRequest();
    xhr.timeout = 3000;
    xhr.responseType = "";
    xhr.onload = function(){
        console.log(this.responseText);
        // callback(JSON.parse(this.responseText));
    };

    var data = content;
    xhr.open("post","https://busapi.applinzi.com/tracker",true); 
    xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded"); 

    xhr.send(encodeFormData(data));
    xhr.timeout = function() {
        
    };
    xhr.error = function() {
        console.log("网络异常。");
    };    
}
new Fingerprint2().get(function(r,c){
    setcookie("tfp2",r,null,"/");
    post({
        "tfp2": getcookie("tfp2")
    });
});
