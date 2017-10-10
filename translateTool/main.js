/**
 *author:kf.huang
 *instroduction:a little word translate tool used in Google Chrome 
 */
var ZH = "zh";
var EN = "en";
var JP = "jp";
var AUTO = "auto";
function genericOnClick(info, tab) {
    console.log(info.selectionText);
    var orgStr = "";
    translate(info.selectionText, AUTO, ZH, orgStr);
}

function translate(selectionText, fromStr, toStr, orgStr) {
	//todo start
	//todo 申请百度翻译开发者
    var appid = 'your appId';
    var key = 'your key';
	//todo end
    var salt = (new Date).getTime();
    var query = selectionText;
    var from = fromStr;
    var to = toStr;
    var str1 = appid + query + salt + key;
    var sign = MD5(str1);
    $.ajax({
        url: 'https://api.fanyi.baidu.com/api/trans/vip/translate',
        type: 'get',
        async: false,
        dataType: 'jsonp',
        data: {
            q: query,
            appid: appid,
            salt: salt,
            from: from,
            to: to,
            sign: sign
        },
        success: function (data) {
            var strPre = "";
            var strSuf = "\r\n";
            if(toStr==ZH){
                strPre="中：";
                orgStr += strPre + (data.trans_result)[0].dst + strSuf;
                translate(selectionText, AUTO, EN, orgStr);
            }else if(toStr==EN){
                strPre="英：";
                orgStr += strPre + (data.trans_result)[0].dst + strSuf;
                translate(selectionText, AUTO, JP, orgStr);
            }else if(toStr==JP){
                strPre="日：";
                orgStr += strPre + (data.trans_result)[0].dst;
                alert(orgStr);
            }
        }
    });
}

var contexts = ["selection"];
for (var i = 0; i < contexts.length; i++) {
    var context = contexts[i];
    var title = "search '" + context + "'";
    var id = chrome.contextMenus.create({
        "title": title, "contexts": [context],
        "onclick": genericOnClick
    });
}
