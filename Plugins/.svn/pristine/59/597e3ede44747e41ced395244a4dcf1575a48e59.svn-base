

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}


//数字转换为字符,加前导0
function getStr(num) {

    if ( parseInt( num ) >= 10)
        return num + "";
    else
        return "0" + num;

}

//根据旬月标识返回对应的汉字
function getPrdtp(prdtp) {

    prdtp = parseInt( prdtp );
    if (prdtp == 1)
        return "上旬";
    else if (prdtp == 2)
        return "中旬";
    else if (prdtp == 3)
        return "下旬";
    else if (prdtp == 4)
        return "全月";
    else return "未知";
}

//数组排序
function listSortBy(arr, field, order) {
    var refer = [], result = [], order = order == 'asc' ? 'asc' : 'desc', index;
    for (i = 0; i < arr.length; i++) {
        refer[i] = arr[i][field] + ':' + i;
    }
    refer.sort();
    if (order == 'desc') refer.reverse();
    for (i = 0; i < refer.length; i++) {
        index = refer[i].split(':')[1];
        result[i] = arr[index];
    }
    return result;
}

function setSelected(id) {

    $("#" + id).addClass("active");
    $("#" + id).siblings().removeClass("active");
}