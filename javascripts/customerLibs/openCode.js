/**
 * Created by lenovo on 2015/2/8.
 */
function openCode() {
}

openCode.prototype.getOpenCode = function (url, callback) {
    var that = this;
    that.sendAjax('GET', url, callback);
};

openCode.prototype.sendAjax = function (method, url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            callback(xhr.responseText);
        }
    };
    xhr.send();
};

openCode.prototype.convertXML2JSON = function (xml) {
    var json = $.xml2json(xml);
    return json;
};