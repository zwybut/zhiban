/**
 * Created by Dell on 2017/8/17.
 */

var userId = "";
var topGroupArr = {};
var userArr = {};
var userIdArr = {};
var userMap = [];
var branchArr = {};
var topArr = {};
var basinSelect;
var ZoneSelect;
var regionSelect;
var allStationBaseInfo;
var contentMap;
var searchSelect;
$(function(){

    //下拉框
    getRegionSelect();
    getZoneSelect();
    getBasinSelect();
    searchSelect = $("#searchSelect").customSelect({width:118,lineHeight:26});

    //雨量站、水库站等站类多选
    $('.siteTypeTab li').click(function(){
        if($(this).hasClass('active')){
            $(this).removeClass('active');
        }else{
            $(this).addClass('active');
        }
        var objArr = new Array();
        for(var i = 0; i < contentMap.length; i++){
            $('.siteTypeTab li').each(function(){
                if($(this).hasClass('active')){
                    var sttp = $(this).attr('sttp');
                    if(sttp == contentMap[i].sttp){
                        objArr.push(contentMap[i]);
                    }
                }
            })
        }
        getContentDiv(objArr);
    });

    //点击模糊搜索
    $('#searchBtn').click(function(){
        //regionSelect.setValue("1");
        //ZoneSelect.setValue("330683");
        $('.siteTypeTab li').removeClass("active");
        var searchContent = $('#searchIpt').val().trim();
        var objArr = new Array();
        for(var i = 0; i < contentMap.length; i++){
            var stnm = contentMap[i].stnm;
            var stcd = contentMap[i].stcd;
            var sttp = contentMap[i].sttp;
            if(sttp == "PP"){
                sttp = "雨量站";
            }else if(sttp == "ZZ"){
                sttp = "河道";
            }else if(sttp == "RR"){
                sttp = "水库站";
            }else if(sttp == "DD"){
                sttp = "闸坝站";
            }
            var addvnm = contentMap[i].xian;
            var rvnm = contentMap[i].rvnm;
            if(stnm.indexOf(searchContent) >=0 || stcd.indexOf(searchContent) >=0 || sttp.indexOf(searchContent) >=0 || addvnm.indexOf(searchContent) >=0 || rvnm.indexOf(searchContent) >=0){
                objArr.push(contentMap[i]);
            }
        }
        getContentDiv(objArr);
    });

    $('.tableWrap').on('click','.attentionSta',function(){
        var userSel = $('#userList').tree('getSelected');
        var UserID = "";
        if(userSel != null){
            UserID = userSel.id;
        }else{
            $.toast({
                text: '请在右侧选择人员进行操作！',
                icon: 'info',
                position: "mid-center",
                stack: false,
                allowToastClose: false,
                loader: false,
                bgColor: "#3bb9d4",
                textColor: "#fff"
            });
            return;
        }
        var isChecked = $(this).is(':checked');
        var stcd = $(this).attr("id");
        if(!isChecked){
            if(UserID != ""){
                $.ajax({
                    url: baseUrl + "/StcdUserRelation/updateAttention.do",
                    type: "Post",
                    data: {
                        UserID: UserID,
                        STCD_Interest:stcd
                    },
                    success: function (result) {
                        console.log(result);
                    }
                });
            }
        }else{
            if(UserID != ""){
                $.ajax({
                    url: baseUrl + "/StcdUserRelation/addStcdUserRelation.do",
                    type: "Post",
                    data: {
                        UserID: UserID,
                        STCD_Interests:stcd,
                        STCD_Warns:""
                    },
                    success: function (result) {

                    }
                });
            }
        }
    });

    $('.tableWrap').on('click','.warnSta',function(){
        var isChecked = $(this).is(':checked');
        var stcd = $(this).attr("id");
        stcd = stcd.replace("warn","");
        console.log(stcd);
        var userSel = $('#userList').tree('getSelected');
        var UserID = "";
        if(userSel != null){
            UserID = userSel.id;
        }else{
            $.toast({
                text: '请在右侧选择人员进行操作！',
                icon: 'info',
                position: "mid-center",
                stack: false,
                allowToastClose: false,
                loader: false,
                bgColor: "#3bb9d4",
                textColor: "#fff"
            });
        }
        if(!isChecked){
            if(UserID != ""){
                $.ajax({
                    url: baseUrl + "/StcdUserRelation/updateWarn.do",
                    type: "Post",
                    data: {
                        UserID: UserID,
                        STCD_Warn:stcd
                    },
                    success: function (result) {
                        console.log(result);
                    }
                });
            }
        }else{
            if(UserID != ""){
                $.ajax({
                    url: baseUrl + "/StcdUserRelation/addWarn.do",
                    type: "Post",
                    data: {
                        UserID: UserID,
                        STCD_Warn:stcd
                    },
                    success: function (result) {

                    }
                });
            }
        }
    });

    $('.tableWrap').height($('.right').outerHeight() - $('.title').outerHeight() - $('.conditionType').outerHeight());
    //切头   赋宽度
    //$(".tableWrap table").fixHeaderTable({
    //    colsWidth:["5%","13%","13%","13%","13%","13%","15%","15%"],
    //    height:$(".tableWrap").height() - 1,
    //    colsDataType:["string","string","string","date","number","string"],
    //    colsCanSort:[false,true,true,true,true,false],
    //    colsContentType:["","text","text","date","input",""]
    //});
    //
    ////加滚动条
    //$(".fixHeaderTable_mainTableWrap").mCustomScrollbar({
    //    scrollButtons:{enable:true},
    //    theme:"inset-2-dark",
    //    axis:"y",
    //    autoHideScrollbar:true,
    //    setLeft:0,
    //    mouseWheel:true
    //});

    //点击右侧的下拉菜单，出现全部、关注站点、预警站点等不同的表格
    searchSelect.change(function(){
        var type = searchSelect.getValue();
        if(type == 0){
            var userSel = $('#userList').tree('getSelected');
            var UserID = "";
            if(userSel != null){
                UserID = userSel.id;
                if(UserID != "3306" && UserID.indexOf("top")<0 && UserID.indexOf("branch")<0){
                    $.ajax({
                        url: baseUrl + "/StcdUserRelation/selectStcdByUserID.do",
                        type: "Post",
                        data: {
                            UserID: UserID
                        },
                        success: function (result) {
                            var userToStation = result.data;
                            var STCD_Interest = userToStation.STCD_Interest;
                            var STCD_Warn = userToStation.STCD_Warn;
                            var inArr = STCD_Interest.split(";");
                            var warArr = STCD_Warn.split(";");
                            var objArr = new Array();
                            var attenArr = new Array();
                            var warnArr = new Array();
                            var conStr = "";
                            for(var i = 0; i < inArr.length; i++){
                                conStr += inArr[i];
                                if(inArr[i] != ""){
                                    for(var j = 0; j < allStationBaseInfo.length; j++){
                                        if(inArr[i] == allStationBaseInfo[j].stcd){
                                            objArr.push(allStationBaseInfo[j]);
                                            attenArr.push(allStationBaseInfo[j]);
                                        }
                                    }
                                }
                            }
                            for(var m = 0; m < warArr.length; m++){
                                if(warArr[m] != ""){
                                    if(conStr.indexOf(warArr[m]) < 0){
                                        conStr += warArr[m];
                                        for(var n = 0; n < allStationBaseInfo.length; n++){
                                            if(warArr[m] == allStationBaseInfo[n].stcd){
                                                objArr.push(allStationBaseInfo[n]);
                                            }
                                        }
                                    }
                                }
                            }
                            for(var m = 0; m < warArr.length; m++){
                                if(warArr[m] != ""){
                                    for(var n = 0; n < allStationBaseInfo.length; n++){
                                        if(warArr[m] == allStationBaseInfo[n].stcd){
                                            warnArr.push(allStationBaseInfo[n]);
                                        }
                                    }
                                }
                            }
                            var newObjArr = objArr;
                            var allStr = "";
                            for(var i = 0; i < objArr.length; i++){
                                allStr += objArr[i].stcd;
                            }
                            for(var i = 0; i < allStationBaseInfo.length; i++){
                                if(allStr.indexOf(allStationBaseInfo[i].stcd) < 0){
                                    newObjArr.push(allStationBaseInfo[i]);
                                }
                            }
                           getContentDiv(newObjArr);
                            for(var i = 0; i < inArr.length; i++){
                                if(inArr[i] != ""){
                                    $("#"+inArr[i]).attr("checked",true);
                                }
                            }
                            for(var i = 0; i < warArr.length; i++){
                                if(warArr[i] != ""){
                                    $("#warn"+warArr[i]).attr("checked",true);
                                }
                            }
                        }
                    });
                }
            }else{
                $.toast({
                    text: '请在右侧选择人员进行操作！',
                    icon: 'info',
                    position: "mid-center",
                    stack: false,
                    allowToastClose: false,
                    loader: false,
                    bgColor: "#3bb9d4",
                    textColor: "#fff"
                });
            }
        }else if(type == 1){
            var userSel = $('#userList').tree('getSelected');
            var UserID = "";
            if(userSel != null){
                UserID = userSel.id;
                if(UserID != "3306" && UserID.indexOf("top")<0 && UserID.indexOf("branch")<0){
                    $.ajax({
                        url: baseUrl + "/StcdUserRelation/selectStcdByUserID.do",
                        type: "Post",
                        data: {
                            UserID: UserID
                        },
                        success: function (result) {
                            var userToStation = result.data;
                            var STCD_Interest = userToStation.STCD_Interest;
                            var inArr = STCD_Interest.split(";");
                            var attenArr = new Array();
                            for(var i = 0; i < inArr.length; i++){
                                if(inArr[i] != ""){
                                    for(var j = 0; j < allStationBaseInfo.length; j++){
                                        if(inArr[i] == allStationBaseInfo[j].stcd){
                                            attenArr.push(allStationBaseInfo[j]);
                                        }
                                    }
                                }
                            }
                            var newObjArr = attenArr;
                            var allStr = "";
                            for(var i = 0; i < attenArr.length; i++){
                                allStr += attenArr[i].stcd;
                            }
                            for(var i = 0; i < allStationBaseInfo.length; i++){
                                if(allStr.indexOf(allStationBaseInfo[i].stcd) < 0){
                                    newObjArr.push(allStationBaseInfo[i]);
                                }
                            }
                            getAttentionDiv(newObjArr);
                            for(var i = 0; i < inArr.length; i++){
                                if(inArr[i] != ""){
                                    $("#"+inArr[i]).attr("checked",true);
                                }
                            }
                        }
                    });
                }

            }else{
                $.toast({
                    text: '请在右侧选择人员进行操作！',
                    icon: 'info',
                    position: "mid-center",
                    stack: false,
                    allowToastClose: false,
                    loader: false,
                    bgColor: "#3bb9d4",
                    textColor: "#fff"
                });
            }
        }else if(type == 2){
            var userSel = $('#userList').tree('getSelected');
            var UserID = "";
            if(userSel != null){
                UserID = userSel.id;
                if(UserID != "3306" && UserID.indexOf("top")<0 && UserID.indexOf("branch")<0){
                    $.ajax({
                        url: baseUrl + "/StcdUserRelation/selectStcdByUserID.do",
                        type: "Post",
                        data: {
                            UserID: UserID
                        },
                        success: function (result) {
                            var userToStation = result.data;
                            var STCD_Warn = userToStation.STCD_Warn;
                            var warArr = STCD_Warn.split(";");
                            var warnArr = new Array();
                            for(var i = 0; i < warArr.length; i++){
                                if(warArr[i] != ""){
                                    for(var j = 0; j < allStationBaseInfo.length; j++){
                                        if(warArr[i] == allStationBaseInfo[j].stcd){
                                            warnArr.push(allStationBaseInfo[j]);
                                        }
                                    }
                                }
                            }
                            var newObjArr = warnArr;
                            var allStr = "";
                            for(var i = 0; i < warnArr.length; i++){
                                allStr += warnArr[i].stcd;
                            }
                            for(var i = 0; i < allStationBaseInfo.length; i++){
                                if(allStr.indexOf(allStationBaseInfo[i].stcd) < 0){
                                    newObjArr.push(allStationBaseInfo[i]);
                                }
                            }
                            getWarnDiv(newObjArr);
                            for(var i = 0; i < warArr.length; i++){
                                if(warArr[i] != ""){
                                    $("#warn"+warArr[i]).attr("checked",true);
                                }
                            }
                        }
                    });
                }
            }else{
                $.toast({
                    text: '请在右侧选择人员进行操作！',
                    icon: 'info',
                    position: "mid-center",
                    stack: false,
                    allowToastClose: false,
                    loader: false,
                    bgColor: "#3bb9d4",
                    textColor: "#fff"
                });
            }
        }
    });

    initInfo();

});

var initInfo = function(){
    //初始化分组列表
    $('#userList').tree({
        url: baseUrl+"/UserGroup/selectUserGroups.do",
        lines:true,
        animate:true,
        checkbox:false,
        loadFilter: function(result) {
            if(result.state == 0){
                var userGroup = result.data;
                if(userGroup==null){
                    return [];
                }else{
                    $('#userList').empty();
                    var topData = [];
                    for(var i in userGroup){
                        var topObj = {};
                        var topGroupName = i.split("/")[0];
                        var topGroupId = i.split("/")[1];
                        topGroupArr[topGroupId] = topGroupName;
                        var branchGroup = userGroup[i];
                        topObj.id = topGroupId;
                        topObj.text = topGroupName;
                        var branchData = [];
                        var topMobileList = [];
                        for(var j in branchGroup){
                            var branchObj = {};
                            var branchGroupName = j.split("/")[0];
                            var branchGroupId = j.split("/")[1];
                            //console.log(j)
                            branchObj.id = branchGroupId;
                            branchObj.text = branchGroupName;
                            var userList = branchGroup[j];
                            var userData = [];
                            var userMobile = [];
                            for(var n = 0; n < userList.length; n++){
                                var userObj = {};
                                var user = userList[n];
                                var userName = user.linkName;
                                var userId = user.userID;
                                userArr[userId] = user.mobile;
                                userIdArr[user.mobile] = userId;
                                userMap.push(user.mobile);
                                userMobile.push(user.mobile);
                                topMobileList.push(user.mobile);
                                userObj.id = userId;
                                userObj.text = userName;
                                userData.push(userObj);
                            }
                            branchArr[branchGroupId] = userMobile;
                            branchData.push({
                                id:branchGroupId,
                                text:branchGroupName,
                                children:userData
                            });
                        }
                        topArr[topGroupId] = topMobileList;
                        topData.push({
                            id:topGroupId,
                            text:topGroupName,
                            children:branchData
                        });
                    }
                }
                var parentObj = [];
                parentObj.push({
                    id:"3306",
                    text:"所有分组",
                    children:topData
                });
                return parentObj;
            }
        },
        onLoadSuccess:function(){

        },
        onSelect:function(node){
            regionSelect.setValue("1");
            ZoneSelect.setValue("330683");
            $('.siteTypeTab li').removeClass("active");
            var nodeId = node.id;
            if(nodeId != "3306" && nodeId.indexOf("top")<0 && nodeId.indexOf("branch")<0){
                $.ajax({
                    url: baseUrl + "/StcdUserRelation/selectStcdByUserID.do",
                    type: "Post",
                    data: {
                        UserID: nodeId
                    },
                    success: function (result) {
                        var userToStation = result.data;
                        var STCD_Interest = userToStation.STCD_Interest;
                        var STCD_Warn = userToStation.STCD_Warn;
                        var inArr = STCD_Interest.split(";");
                        var warArr = STCD_Warn.split(";");
                        var objArr = new Array();
                        var attenArr = new Array();
                        var warnArr = new Array();
                        var conStr = "";
                        for(var i = 0; i < inArr.length; i++){
                            conStr += inArr[i];
                            if(inArr[i] != ""){
                                for(var j = 0; j < allStationBaseInfo.length; j++){
                                    if(inArr[i] == allStationBaseInfo[j].stcd){
                                        objArr.push(allStationBaseInfo[j]);
                                        attenArr.push(allStationBaseInfo[j]);
                                    }
                                }
                            }
                        }
                        for(var m = 0; m < warArr.length; m++){
                            if(warArr[m] != ""){
                                if(conStr.indexOf(warArr[m]) < 0){
                                    conStr += warArr[m];
                                    for(var n = 0; n < allStationBaseInfo.length; n++){
                                        if(warArr[m] == allStationBaseInfo[n].stcd){
                                            objArr.push(allStationBaseInfo[n]);
                                        }
                                    }
                                }
                            }
                        }
                        for(var m = 0; m < warArr.length; m++){
                            if(warArr[m] != ""){
                                for(var n = 0; n < allStationBaseInfo.length; n++){
                                    if(warArr[m] == allStationBaseInfo[n].stcd){
                                        warnArr.push(allStationBaseInfo[n]);
                                    }
                                }
                            }
                        }
                        var newObjArr = objArr;
                        var strlen = "";
                        for(var j = 0; j < objArr.length; j++){
                            strlen += objArr[j].stcd;
                        }
                        for(var i = 0; i < allStationBaseInfo.length; i++){
                            if(strlen.indexOf(allStationBaseInfo[i].stcd) < 0){
                                newObjArr.push(allStationBaseInfo[i]);
                            }
                        }
                        var newAttObjArr = attenArr;
                        var strAttLen = "";
                        for(var j = 0; j < attenArr.length; j++){
                            strAttLen += attenArr[j].stcd;
                        }
                        for(var i = 0; i < allStationBaseInfo.length; i++){
                            if(strAttLen.indexOf(allStationBaseInfo[i].stcd) < 0){
                                newAttObjArr.push(allStationBaseInfo[i]);
                            }
                        }
                        var newWarObjArr = warnArr;
                        var strWarlen = "";
                        for(var j = 0; j < warnArr.length; j++){
                            strWarlen += warnArr[j].stcd;
                        }
                        for(var i = 0; i < allStationBaseInfo.length; i++){
                            if(strWarlen.indexOf(allStationBaseInfo[i].stcd) < 0){
                                newWarObjArr.push(allStationBaseInfo[i]);
                            }
                        }
                        var type = searchSelect.getValue();
                        if(type == 0){
                            getContentDiv(newObjArr);
                        }else if(type == 1){
                            getAttentionDiv(newAttObjArr);
                        }else if(type == 2){
                            getWarnDiv(newWarObjArr);
                        }
                        for(var i = 0; i < inArr.length; i++){
                            if(inArr[i] != ""){
                                $("#"+inArr[i]).attr("checked",true);
                            }
                        }
                        for(var i = 0; i < warArr.length; i++){
                            if(warArr[i] != ""){
                                $("#warn"+warArr[i]).attr("checked",true);
                            }
                        }
                        contentMap = objArr;
                    }
                });
            }else{

            }
        },
        onContextMenu: function(e, node){
            e.preventDefault();
        }
    });

    getAllStationBaseInfo();
};

var getZoneSelect = function(){
    $.ajax({
        url: GTUrl + "comm/addvcd/getAddvcdChildersByFind.do",
        type: "Post",
        data: {
            addvcd: addvcd,
            rank:'d'
        },
        success: function (result) {
            var regionArr = result;
            var regionCus = $('#regionSelect').empty();
            var content = '<option value="330683">所有地区</option>';
            for(var i = 0; i < regionArr.length; i++){
                content += '<option value="'+regionArr[i].addvcd+'">'+regionArr[i].addvnm+'</option>';
            }
            regionCus.append(content);
            // 地区选择框
            ZoneSelect = $("#regionSelect").customSelect({width:98,lineHeight:26});
            ZoneSelect.change(function(){
                $('.siteTypeTab li').removeClass("active");
                var arrayObj = new Array();
                var addvnm = ZoneSelect.getText();
                console.log(addvnm);
                if(addvnm == "所有地区"){
                    arrayObj = allStationBaseInfo;
                }else{
                    for(var i = 0; i < allStationBaseInfo.length; i++){
                        if(addvnm == allStationBaseInfo[i].xian){
                            arrayObj.push(allStationBaseInfo[i]);
                        }
                    }
                }
                var type = searchSelect.getValue();
                if(type == 0){
                    getContentDiv(arrayObj);
                }else if(type == 1){
                    getAttentionDiv(arrayObj)
                }else if(type == 2){
                    getWarnDiv(arrayObj)
                }
                contentMap = arrayObj;
            });
        }
    });
};

var getBasinSelect = function(){
    $.ajax({
        url: GTUrl + "floodProfAnalyzSys/backStageManageShow/basinManage/getBasinNodeInfo.do",
        type: "Post",
        success: function (result) {
            var regionArr = result;
            console.log(regionArr);
            var regionCus = $('#basinSelect').empty();
            var content = '<option value="330683">所有流域</option>';
            for(var i = 0; i < regionArr.length; i++){
                var id = regionArr[i].id;
                var firstStr = id.slice(2,4);
                var secondStr = id.slice(4,6);
                if(firstStr === '00'){

                }else if(firstStr != '00' && secondStr == '00'){

                }else{
                    if(regionArr[i].name != "曹娥江"){
                        content += '<option value="'+regionArr[i].id+'">'+regionArr[i].name+'</option>';
                    }
                }
            }
            regionCus.append(content);
            // 地区选择框
            basinSelect = $("#basinSelect").customSelect({width:98,lineHeight:26,show:false});
            basinSelect.change(function(){
                $('.siteTypeTab li').removeClass("active");
                var arrayObj = new Array();
                var rvnm = basinSelect.getText();
                if(rvnm == "所有流域"){
                    arrayObj = allStationBaseInfo;
                }else{
                    for(var i = 0; i < allStationBaseInfo.length; i++){
                        if(rvnm == allStationBaseInfo[i].rvnm){
                            arrayObj.push(allStationBaseInfo[i]);
                        }
                    }
                }
                var type = searchSelect.getValue();
                if(type == 0){
                    getContentDiv(arrayObj);
                }else if(type == 1){
                    getAttentionDiv(arrayObj)
                }else if(type == 2){
                    getWarnDiv(arrayObj)
                }
                contentMap = arrayObj;
            });
        }
    });
};

var getRegionSelect = function(){
    var content = '<option value="1">区域选择</option>'+
                    '<option value="2">流域选择</option>';
    $('#zoneSelect').empty().append(content);
    regionSelect = $("#zoneSelect").customSelect({width:98,lineHeight:26});
    regionSelect.change(function(){
        $('.siteTypeTab li').removeClass("active");
        getAllStationBaseInfo();
        var state = regionSelect.getValue();
        if(state == 1){
            ZoneSelect.show();
            basinSelect.hide();
            ZoneSelect.setValue("330683");
        }else if(state == 2){
            basinSelect.show();
            ZoneSelect.hide();
            basinSelect.setValue("330683");
        }
    });
};

var getAllStationBaseInfo = function(){
    $.ajax({
        url: GTUrl + "comm/baseInfo/getStationBaseInfoByCondition.do",
        type: "Post",
        success: function (result) {
            allStationBaseInfo = result.stationBaseInfo;
            contentMap = result.stationBaseInfo;
            getContentDiv(allStationBaseInfo);
        }
    });
};

var getContentDiv = function(objArr){
    $('.tableWrap').html('<table><thead></thead><tbody></tbody></table>');
    var content_h = '<tr><th>站名</th><th>站码</th><th>站类</th><th>区域</th><th>流域</th><th><input type="checkbox" class="regular-checkbox" id="checkAttAll"><label for="checkAttAll"></label><span>关注站点</span></th><th><input type="checkbox" class="regular-checkbox" id="checkWarAll"><label for="checkWarAll"></label><span>预警站点</span></th></tr>'
    var content='';
    for(var i = 0; i < objArr.length; i++){
        var sttp = objArr[i].sttp;
        if(sttp == "ZZ"){
            sttp = "河道站";
        }else if(sttp == "PP"){
            sttp = "雨量站";
        }else if(sttp == "DD"){
            sttp = "闸坝站";
        }else if(sttp == "RR"){
            sttp = "水库站";
        }
        content += '<tr>'+
            '<td>'+objArr[i].stnm+'</td>'+
            '<td>'+objArr[i].stcd+'</td>'+
            '<td>'+sttp+'</td>'+
            '<td>'+objArr[i].xian+'</td>'+
            '<td>'+objArr[i].rvnm+'</td>'+
            '<td><input type="checkbox" class="regular-checkbox attentionSta" id="'+objArr[i].stcd+'"><label for="'+objArr[i].stcd+'"></label></td>'+
            '<td><input type="checkbox" class="regular-checkbox warnSta" id="warn'+objArr[i].stcd+'"><label for="warn'+objArr[i].stcd+'"></label></td></tr>';
    }
    $('.tableWrap table').find('thead').empty().append(content_h);
    $('.tableWrap table').find('tbody').empty().append(content);
    //加滚动条
    $(".tableWrap table").fixHeaderTable({    //切头   赋宽度
        colsWidth:["15%","15%","15%","15%","15%","12.5%","12.5%"],
        height:$(".tableWrap").height() - 1,
        colsDataType:["string","string","number","string","string","string"],
        colsCanSort:[false,true,true,false,false,false],
        colsContentType:["","text","text","date","input",""]
    });

    $(".fixHeaderTable_mainTableWrap").mCustomScrollbar({
        scrollButtons:{enable:true},
        theme:"inset-2-dark",
        axis:"y",
        autoHideScrollbar:true,
        setLeft:0,
        mouseWheel:true,
        callbacks:{}
    });
    $('#checkAttAll').click(function(){
        var userSel = $('#userList').tree('getSelected');
        var UserID = "";
        if(userSel != null){
            UserID = userSel.id;
        }else{
            $.toast({
                text: '请在右侧选择人员进行操作！',
                icon: 'info',
                position: "mid-center",
                stack: false,
                allowToastClose: false,
                loader: false,
                bgColor: "#3bb9d4",
                textColor: "#fff"
            });
            return;
        }
        if(this.checked){
            $('.tableWrap tbody .attentionSta').prop('checked',true);
            var type = "select";
            updateAllAttention(UserID,type);
        }else{
            $('.tableWrap tbody .attentionSta').prop('checked',false);
            var type = "cancel";
            updateAllAttention(UserID,type);
        }
    });
    $('#checkWarAll').click(function(){
        var userSel = $('#userList').tree('getSelected');
        var UserID = "";
        if(userSel != null){
            UserID = userSel.id;
        }else{
            $.toast({
                text: '请在右侧选择人员进行操作！',
                icon: 'info',
                position: "mid-center",
                stack: false,
                allowToastClose: false,
                loader: false,
                bgColor: "#3bb9d4",
                textColor: "#fff"
            });
            return;
        }
        if(this.checked){
            $('.tableWrap tbody .warnSta').prop('checked',true);
            var type = "select";
            updateAllWarn(UserID,type);
        }else{
            $('.tableWrap tbody .warnSta').prop('checked',false);
            var type = "cancel";
            updateAllWarn(UserID,type);
        }
    });
};

var getAttentionDiv = function(objArr){
    $('.tableWrap').html('<table><thead></thead><tbody></tbody></table>');
    var content_h = '<tr><th>站名</th><th>站码</th><th>站类</th><th>区域</th><th>流域</th><th><input type="checkbox" class="regular-checkbox" id="checkAttAll"><label for="checkAttAll"></label><span>关注站点</span></th></tr>';
    var content = "";
    for(var i = 0; i < objArr.length; i++){
        var sttp = objArr[i].sttp;
        if(sttp == "ZZ"){
            sttp = "河道站";
        }else if(sttp == "PP"){
            sttp = "雨量站";
        }else if(sttp == "DD"){
            sttp = "闸坝站";
        }else if(sttp == "RR"){
            sttp = "水库站";
        }
        content += '<tr>'+
            '<td>'+objArr[i].stnm+'</td>'+
            '<td>'+objArr[i].stcd+'</td>'+
            '<td>'+sttp+'</td>'+
            '<td>'+objArr[i].xian+'</td>'+
            '<td>'+objArr[i].rvnm+'</td>'+
            '<td><input type="checkbox" class="regular-checkbox attentionSta" id="'+objArr[i].stcd+'"><label for="'+objArr[i].stcd+'"></label></td></tr>';
    }
    $('.tableWrap table').find('thead').empty().append(content_h);
    $('.tableWrap table').find('tbody').empty().append(content);
    //加滚动条
    $(".tableWrap table").fixHeaderTable({    //切头   赋宽度
        colsWidth:["16%","17%","17%","17%","17%","16%"],
        height:$(".tableWrap").height() - 1,
        colsDataType:["string","string","number","string","string","string"],
        colsCanSort:[false,true,true,false,false,false],
        colsContentType:["","text","text","date","input",""]
    });

    $(".fixHeaderTable_mainTableWrap").mCustomScrollbar({
        scrollButtons:{enable:true},
        theme:"inset-2-dark",
        axis:"y",
        autoHideScrollbar:true,
        setLeft:0,
        mouseWheel:true,
        callbacks:{}
    });
};

var getWarnDiv = function(objArr){
    $('.tableWrap').html('<table><thead></thead><tbody></tbody></table>');
    console.log(objArr);
    var content_h = '<tr><th>站名</th><th>站码</th><th>站类</th><th>区域</th><th>流域</th><th><input type="checkbox" class="regular-checkbox" id="checkWarAll"><label for="checkWarAll"></label><span>预警站点</span></th></tr>';
    var content = "";
    for(var i = 0; i < objArr.length; i++){
        var sttp = objArr[i].sttp;
        if(sttp == "ZZ"){
            sttp = "河道站";
        }else if(sttp == "PP"){
            sttp = "雨量站";
        }else if(sttp == "DD"){
            sttp = "闸坝站";
        }else if(sttp == "RR"){
            sttp = "水库站";
        }
        content += '<tr>'+
            '<td>'+objArr[i].stnm+'</td>'+
            '<td>'+objArr[i].stcd+'</td>'+
            '<td>'+sttp+'</td>'+
            '<td>'+objArr[i].xian+'</td>'+
            '<td>'+objArr[i].rvnm+'</td>'+
            '<td><input type="checkbox" class="regular-checkbox warnSta" id="warn'+objArr[i].stcd+'"><label for="warn'+objArr[i].stcd+'"></label></td></tr>';
    }
    $('.tableWrap table').find('thead').empty().append(content_h);
    $('.tableWrap table').find('tbody').empty().append(content);
    //加滚动条
    $(".tableWrap table").fixHeaderTable({    //切头   赋宽度
        colsWidth:["16%","17%","17%","17%","17%","16%"],
        height:$(".tableWrap").height() - 1,
        colsDataType:["string","string","number","string","string","string"],
        colsCanSort:[false,true,true,false,false,false],
        colsContentType:["","text","text","date","input",""]
    });
    $(".fixHeaderTable_mainTableWrap").mCustomScrollbar({
        scrollButtons:{enable:true},
        theme:"inset-2-dark",
        axis:"y",
        autoHideScrollbar:true,
        setLeft:0,
        mouseWheel:true,
        callbacks:{}
    });
};

var updateAllAttention = function(UserID,type){
    $.ajax({
        url: baseUrl + "/StcdUserRelation/updateAllAttention.do",
        type: "Post",
        data: {
            UserID: UserID,
            type:type
        },
        success: function (result) {

        }
    });
};

var updateAllWarn = function(UserID,type){
    $.ajax({
        url: baseUrl + "/StcdUserRelation/updateAllWarn.do",
        type: "Post",
        data: {
            UserID: UserID,
            type:type
        },
        success: function (result) {

        }
    });
};