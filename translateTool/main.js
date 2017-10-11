/**
 *author:kf.huang
 *instroduction:a little word translate tool used in Google Chrome
 */
var ZH = "zh";
var EN = "en";
var JP = "jp";
var AUTO = "auto";
var STEP = [ZH,EN,JP,"out"];
var STEPDESC = ["中：","英：","日：","输出"];
function genericOnClick(info, tab) {
    translate(info.selectionText, AUTO, 0, "");
}

function translate(selectionText, fromStr, stepCount, orgStr) {
    //todo start
    //todo 申请百度翻译开发者
    var appid = 'your appId';
    var key = 'your key';
    //todo end
    var salt = (new Date).getTime();
    var query = selectionText;
    var from = fromStr;
    var to = STEP[stepCount];
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
            var strPre=STEPDESC[stepCount];
            var strSuf = "\r\n";
            if(STEP.length == (stepCount+2)){
                orgStr += strPre + (data.trans_result)[0].dst;
                alert(orgStr);
            }else{
                orgStr += strPre + (data.trans_result)[0].dst + strSuf;
                translate(selectionText, AUTO, stepCount+1, orgStr);
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
