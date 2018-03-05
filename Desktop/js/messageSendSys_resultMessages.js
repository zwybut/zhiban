/**
 * Created by Dell on 2017/7/10.
 */
var sel_node = "";
var userId = "";
var addId = "";
var groupName = "";
var rightSelectId ="";
var sel_nodeChange = true;
var topGroupArr = {};
var userArr = {};
var userMap = [];
var userInfo = [];
var branchArr = {};
var topArr = {};
var basinArr = {};
var basinMap = {};
var dataReg = [];
var basinReg = [];
var acceptReg = [];
var stationBaseInfo = {};
var userStcdRelation = {};


var node = null;
var addvcd = "";
var addvnm = "";
var hasListArry = {};
var controlSel;
var sttp = 'PP';
var vipNode = 0;
var attentionStationArr = {};
var zoneStationArr = {};
var basinStationArr = {};

$(function(){

    //// 加入载入图标
    //var spinloading =new Spinner({radius: 10, length: 0, width: 8, lines:7,color:"#436c8f", trail: 40,className: 'myspinner'})
    //    .spin(document.getElementsByClassName('spinLoading')[0]);
    //
    //// javax发起请求时，显示载入图标
    //$(document).ajaxStart(function(){
    //    //$(".loadingDiv").show();
    //});
    //
    //// javax请求结束时，隐藏图标
    //$(document).ajaxStop(function(){
    //    //$(".loadingDiv").hide();
    //});

    controlSel = $("#controlSel").customSelect({width:105  ,lineHeight:24});


    //设置流域选择下面的tree展示区域的最大高度
    var basin_tree_maxHeight = $('.userList').height() -$('.userListTitle').height()-42;
    $(".userList .easyui-panel").css("height",basin_tree_maxHeight+"px");

    var tabContent_maxHeight = $('.relatedSites').height() -$('.relatedSitesTitle').height()-$('.relatedSitesNotice').height();
    $(".relatedSitesContent").css("height",tabContent_maxHeight+"px");

    //设置站点选择下面的tree展示区域的最大高度
    var site_tree_maxHeight = $('.siteSelect').height() -$('.userListTitle').height()-$('.siteSelectMenu').height()-$('.importRainST').height()-40;
    $(".siteSelect .easyui-panel").css("height",site_tree_maxHeight+"px");

    //获取流域管理关联站点所在div的自适应宽度
    var relatedSites_width = $(this).width() - 320 * 2 - 4;
    $(".relatedSites").css("width",relatedSites_width+"px");

    //关注站点和短信接收站点tab切换
    $('.siteUl li').click(function(){
        var index = $('.siteUl li').index(this);
        $(this).addClass('active').siblings().removeClass('active');
        $('.main').removeClass('active').eq(index).addClass('active');
        var oName = $('.siteUl li.active').attr('name');
        if(oName == 'SMSreceive'){

        }else{

        }
    });

    //得到流域列表树
    getBasinTree();

    //得到区域列表树
    getRegionTree();

    getAllStationInfo();

    //点击导入短信接收站点
    $('#acceptNotesBtn').click(function(){
        var selectUser = $('#Basin2List').tree('getSelected');
        var UID = "";
        if(selectUser != null && selectUser.children == null){
            UID = $('#Basin2List').tree('getSelected').id;
        }else if(selectUser == null){
            $.toast({
                text: '请在左侧选择一个人进行关联！',
                icon: 'info',
                position: 'mid-center',
                stack: false,
                allowToastClose: false,
                loader: false,
                bgColor: "#e97c75"
            });
        }
        var basinChecked = $("#messageSiteList").tree('getChecked');
        var stcd = "";
        if(basinChecked.length > 0){
            for(var i = 0; i < basinChecked.length; i++){
                if(null != basinChecked[i].children){
                    continue;
                }
                stcd += basinChecked[i].id+"/";
            }
            $.ajax({
                url: noteUrl + '/StcdUserRelation/updateStcdUserRelationByUIDAndStcd.do',
                type: "post",
                dataType: "json",
                data:{
                    UID:UID,
                    stcd:stcd
                } ,
                success: function (jsondata) {
                    var node = $('#Basin2List').tree("find", UID);
                    $('#Basin2List').tree("select", node.target);
                    $.toast({
                        text: '导入成功！',
                        icon: 'info',
                        position: 'mid-center',
                        stack: false,
                        allowToastClose: false,
                        loader: false,
                        bgColor: "#e97c75"
                    });
                }
            });
        }
    });

    //点击导入关联关注站点
    $('#attentionBtn').click(function(){
        var selectUser = $('#BasinList').tree('getSelected');
        var UID = "";
        if(selectUser != null && selectUser.children == null){
            UID = $('#BasinList').tree('getSelected').id;
        }else if(selectUser == null){
            $.toast({
                text: '请在左侧选择一个人进行关联！',
                icon: 'info',
                position: 'mid-center',
                stack: false,
                allowToastClose: false,
                loader: false,
                bgColor: "#e97c75"
            });
        }
        var sttp = $('.queryUl li.active').attr('value');
        if(sttp == 'PP'){
            var basinChecked = $("#StationList").tree('getChecked');
            console.log(basinChecked);
            var stcd = "";
            if(basinChecked.length > 0){
                for(var i = 0; i < basinChecked.length; i++){
                    if(null != basinChecked[i].children){
                        continue;
                    }
                    stcd += basinChecked[i].id+"/";
                }
                $.ajax({
                    url: noteUrl + '/StcdUserRelation/addStcdUserRelation.do',
                    type: "post",
                    dataType: "json",
                    data:{
                        UID:UID,
                        stcd:stcd
                    } ,
                    success: function (jsondata) {
                        var node = $('#BasinList').tree("find", UID);
                        $('#BasinList').tree("select", node.target);
                        $.toast({
                            text: '导入成功！',
                            icon: 'info',
                            position: 'mid-center',
                            stack: false,
                            allowToastClose: false,
                            loader: false,
                            bgColor: "#e97c75"
                        });
                    }
                });
            }
        }else{
            var basinChecked = $("#regionList").tree('getChecked');
            var stcd = "";
            if(basinChecked.length > 0){
                for(var i = 0; i < basinChecked.length; i++){
                    if(null != basinChecked[i].children){
                        continue;
                    }
                    stcd += basinChecked[i].id+"/";
                }
                $.ajax({
                    url: noteUrl + '/StcdUserRelation/addStcdUserRelation.do',
                    type: "post",
                    dataType: "json",
                    data:{
                        UID:UID,
                        stcd:stcd
                    } ,
                    success: function (jsondata) {
                        var node = $('#BasinList').tree("find", UID);
                        $('#BasinList').tree("select", node.target);
                        $.toast({
                            text: '导入成功！',
                            icon: 'info',
                            position: 'mid-center',
                            stack: false,
                            allowToastClose: false,
                            loader: false,
                            bgColor: "#e97c75"
                        });
                    }
                });
            }
        }
    });

    //得到人员列表信息
    $('#BasinList').tree({
        url: noteUrl+"/UserGroup/selectUserGroups.do",
        lines:true,
        animate:true,
        checkbox:false,
        loadFilter: function(result) {
            //console.log(result)
            if(result.state == 0){
                var userGroup = result.data;
                if(userGroup==null){
                    return [];
                }else{
                    $('#BasinList').empty();
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
                                userMap.push(user.mobile);
                                userInfo[userId] = user.linkName;
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
                    id:"TOP3306",
                    text:"嵊州市",
                    children:topData
                });
                return parentObj;
            }
        },
        onLoadSuccess:function(){
            var parent_node = $(this).tree('getRoot');
            if(parent_node.children!=null && parent_node.children.length>0 && sel_nodeChange == true){
                for(var i = 0; i < parent_node.children.length; i++){
                    if(parent_node.children[i].children != null && parent_node.children[i].children.length > 0){
                        sel_nodeChange = false;
                        sel_node =  parent_node.children[0].children[0].children[0].id;
                        var node = $('#BasinList').tree('find', sel_node);// 找到第一个子节点
                        $('#BasinList').tree('select', node.target);
                        //return;
                    }
                }
            }
        },
        onSelect:function(node){
            var parent_node = $(this).tree('getRoot');
            var _note = node;
            userId = node.id;
            var selectedId = node.id;
            addId = userId;
            sel_node = userId;
            groupName = node.text;
            //if(_note == parent_node || node.children == null || node.children.length == 0) return;
            //if(node == parent_node){
            //    if(parent_node.children!=null && parent_node.children.length>0){
            //        for(var i = 0; i < parent_node.children.length; i++){
            //            if(parent_node.children[i].children != null && parent_node.children[i].children.length > 0){
            //                sel_node =  parent_node.children[i].id;
            //                var node = $('#userList').tree('find', sel_node);// 找到第一个子节点
            //                $(this).tree('select', node.target);
            //                return;
            //            }
            //        }
            //    }
            //}
            if(userId.indexOf("top") >= 0 && node.children != null && node.children.length != 0){
                //for(var i = 0; i < node.children.length; i++){
                //    console.log(node.children[i]);
                //    if(node.children[i] != null && node.children[i].length > 0){
                //        console.log(333333);
                //    }
                //}
                userId = _note.children[0].id;
                groupName = _note.children[0].text;
            }
            if(selectedId.indexOf("top") >= 0){
                $('#attentionList').empty();
            }else if(selectedId.indexOf("branch") >= 0){
                $('#attentionList').empty();
            }else if(selectedId.indexOf("TOP3306") >= 0){
                $('#attentionList').empty();
            }else{
                refreshSites(selectedId);
            }

        },
        onContextMenu: function(e, node){
            e.preventDefault();
            //var parent_node = $(this).tree('getRoot');
            //var sel_node = $('#userList').tree('getSelected');
            //console.log(sel_node);
            rightSelectId = node.id;
            if(rightSelectId == "3306"){
                $('#addBasin').show();
                $('#delBasin').hide();
            }else if(rightSelectId.indexOf("top") >= 0){
                $('#addBasin').show();
                $('#delBasin').show();
            }else{
                $('#addBasin').hide();
                $('#delBasin').show();
            }

            $('#BasinList').tree('select', node.target);
            $('#mm').menu('show', {
                left: e.pageX,
                top: e.pageY
            });

        }
    });

    //得到短信接收人员列表
    $('#Basin2List').tree({
        url: noteUrl+"/UserGroup/listUserGroups.do",
        lines:true,
        animate:true,
        checkbox:false,
        loadFilter: function(result) {
            if(result.state == 0){
                var userGroup = result.data;
                console.log(userGroup);
                if(userGroup==null){
                    return [];
                }else{
                    $('#Basin2List').empty();
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
                    id:"TOP3306",
                    text:"所有分组",
                    children:topData
                });
                return parentObj;
            }
        },
        onLoadSuccess:function(){
            var parent_node = $(this).tree('getRoot');
            if(parent_node.children!=null && parent_node.children.length>0){
                for(var i = 0; i < parent_node.children.length; i++){
                    if(parent_node.children[i].children != null && parent_node.children[i].children.length > 0){
                        //sel_nodeChange = false;
                        var selNode =  parent_node.children[0].children[0].children[0].id;
                        var node = $('#Basin2List').tree('find', selNode);// 找到第一个子节点
                        $('#Basin2List').tree('select', node.target);
                    }
                }
            }
        },
        onSelect:function(node){
            console.log(node.id);
            $('#userInfo').text("");
            var parent_node = $(this).tree('getRoot');
            var _note = node;
            userId = node.id;
            var selectedId = node.id;
            addId = userId;
            sel_node = userId;
            groupName = node.text;
            //if(_note == parent_node || node.children == null || node.children.length == 0) return;
            //if(node == parent_node){
            //    if(parent_node.children!=null && parent_node.children.length>0){
            //        for(var i = 0; i < parent_node.children.length; i++){
            //            if(parent_node.children[i].children != null && parent_node.children[i].children.length > 0){
            //                sel_node =  parent_node.children[i].id;
            //                var node = $('#userList').tree('find', sel_node);// 找到第一个子节点
            //                $(this).tree('select', node.target);
            //                return;
            //            }
            //        }
            //    }
            //}
            if(userId.indexOf("top") >= 0 && node.children != null && node.children.length != 0){
                //for(var i = 0; i < node.children.length; i++){
                //    console.log(node.children[i]);
                //    if(node.children[i] != null && node.children[i].length > 0){
                //        console.log(333333);
                //    }
                //}
                userId = _note.children[0].id;
                groupName = _note.children[0].text;
            }
            if(selectedId.indexOf("top") >= 0){
                $('#acceptNoteStation').empty();
                getAttentionTree(selectedId);
            }else if(selectedId.indexOf("branch") >= 0){
                $('#acceptNoteStation').empty();
                getAttentionTree(selectedId);
            }else if(selectedId.indexOf("TOP3306") >= 0){
                $('#acceptNoteStation').empty();
                getAttentionTree(selectedId);
            }else{
                refreshAcceptSites(selectedId);
                getAttentionTree(selectedId);
            }
        },
        onContextMenu: function(e, node){
            e.preventDefault();
            //var parent_node = $(this).tree('getRoot');
            //var sel_node = $('#userList').tree('getSelected');
            //console.log(sel_node);
            rightSelectId = node.id;
            if(rightSelectId == "3306"){
                $('#addBasin2').show();
                $('#delBasin2').hide();
            }else if(rightSelectId.indexOf("top") >= 0){
                $('#addBasin2').show();
                $('#delBasin2').show();
            }else{
                $('#addBasin2').hide();
                $('#delBasin2').show();
            }

            $('#Basin2List').tree('select', node.target);
            $('#mm').menu('show', {
                left: e.pageX,
                top: e.pageY
            });

        }
    });

    // 流域、区域tab切换选择
    $('.queryUl li').click(function(){
        var index = $('.queryUl li').index(this);
        $(this).addClass('active').siblings().removeClass('active');
        $('.siteTree').removeClass('active').eq(index).addClass('active');
        var sttp = $('.queryUl li.active').attr('value');
        if(sttp == 'PP'){
            $('.irst').text('导入流域站点');
        }else{
            $('.irst').text('导入区域站点');
        }

    });

    //点击全部删除，删除所有关注站点
    $("#attentionDel").click(function(){
        var sel = $('#BasinList').tree("getSelected");
        if(sel != null && sel.children == null){
            var UID = $('#BasinList').tree("getSelected").id;
            $.confirmWin({
                width:520,
                height:160,
                title:"删除信息",
                text:"<div class='removeWarnContent'>您确定要删除<b>"+ userInfo[UID] +"</b>关注的所有站点吗？</div>",
                btnVal:"删除",
                submitFn:function(){
                    $.ajax({
                        url: noteUrl + '/StcdUserRelation/deleteStcdUserRelationByUID.do',
                        type : "POST",
                        dataType : "json",
                        data:{
                            UID:UID,
                        } ,
                        success : function(jsonData){
                            $('#attentionList').empty();
                            $('#attentionList').append("<li>暂无关注站点！</li>")
                        }
                    })
                }
            });
        }else{
            $.toast({
                text: '请选择需要删除的人员！',
                icon: 'info',
                position: 'mid-center',
                stack: false,
                allowToastClose: false,
                loader: false,
                bgColor: "#e97c75"
            });
        }

    }) ;

    //点击全部删除，删除所有短信接收站点
    $("#acceptDel").click(function(){
        var sel = $('#Basin2List').tree("getSelected");
        if(sel != null && sel.children == null){
            var UID = $('#Basin2List').tree("getSelected").id;
            $.confirmWin({
                width:520,
                height:160,
                title:"删除信息",
                text:"<div class='removeWarnContent'>您确定要删除<b>"+ userInfo[UID] +"</b>关注的所有接收短信的站点吗？</div>",
                btnVal:"删除",
                submitFn:function(){

                }
            });
        }else{
            $.toast({
                text: '请选择需要删除的人员！',
                icon: 'info',
                position: 'mid-center',
                stack: false,
                allowToastClose: false,
                loader: false,
                bgColor: "#e97c75"
            });
        }
    }) ;

});

var append = function(){
    $.confirmWin({
        width:480,
        height:160,
        title:"添加流域",
        text:"<div class='save_popup'>" +
        "<p>名&nbsp;&nbsp;&nbsp;&nbsp;称:</p>" +
        "<input class='report' id='secondListName' value=''></div>",
        btnVal:"保存",
        submitFn:function(){
            var id = (new Date()).getTime();
            var basinName = $('#secondListName').val();
            $.ajax({
                url: baseUrl + 'floodProfAnalyzSys/backStageManageShow/basinManage/addBasinNode.do',
                type : "POST",
                dataType : "json",
                data:{
                    id:id,
                    name:basinName,
                    vipNode:0
                },
                success : function(data){
                    var selected = $('#BasinList').tree('getSelected');
                    $("#BasinList").tree('append',{
                        parent: selected.target,
                        data: {
                            id:id,
                            text:basinName,
                        }
                    });
                }
            });

        }
    });
};

var remove = function(){
    $.confirmWin({
        width:520,
        height:160,
        title:"删除流域",
        text:"<div class='removeWarnContent'>您确定要删除<b>"+ addvnm +"</b>流域嘛？</div>",
        btnVal:"确定",
        submitFn:function(){
            $.ajax({
                url: baseUrl + 'floodProfAnalyzSys/backStageManageShow/basinManage/deleteBasinNode.do',
                type : "POST",
                dataType : "json",
                data:{
                    id:addvcd,
                },
                success : function(data){
                    var selected = $('#BasinList').tree('getSelected');
                    $("#BasinList").tree('remove', selected.target)
                }
            });
        }
    });
};

// 得到选择站点
var refreshStationList = function(){
    $("#StationList").tree({
        url: baseUrl + 'comm/baseInfo/getStationBaseInfoByCondition.do',
        lines:true,
        checkbox:true,
        loadFilter: function(jsondata) {
            var jsonData = jsondata.stationBaseInfo;
            var parentNode = [];
            var ppNodeData = [];
            var zzNodeData = [];
            for(var i=0;i<jsonData.length;i++) {
                if(hasListArry[jsonData[i].stcd]!=null) continue;
                var obj = {};
                obj.text = jsonData[i].stnm;
                obj.checked = false;
                obj.id = jsonData[i].stcd;
                switch (jsonData[i].sttp) {
                    case "ZZ":
                    case "ZQ":
                    case "ZG":
                        zzNodeData.push(obj);
                        break;
                    case "PP":
                        ppNodeData.push(obj);
                }
            }
            var ppNode = {
                id:"ppNode",
                text:"雨量站",
                children:ppNodeData,
            };
            var zzNode = {
                id:"zzNode",
                text:"水位站",
                children:zzNodeData,
            };

            if(sttp=="ZZ"){
                parentNode = [zzNode];
            }else{
                parentNode = [zzNode,ppNode];
            }
            var index = -1;
            $.each(parentNode,function(i,item){
                if(item.children.length > 0){
                    item.state = "closed";
                    if(index < 0) index = i;
                }
            });
            if(index >= 0) parentNode[index].state = "open";
            return parentNode;
        },
        onLoadSuccess:function(){
        }
    });
};

// 添加关联站点
var addStationByAddvcd = function(){
    var checkItem  = $("#StationList").tree('getChecked');
    var stcds = "";
    for(var i=0;i<checkItem.length;i++){
        if(null != checkItem[i].children){
            continue;
        }
        stcds+=checkItem[i].id;
        stcds+=",";
    }
    stcds = stcds.substring(0,stcds.length-1);
    $.ajax({
        url: baseUrl+"floodProfAnalyzSys/backStageManageShow/basinManage/addBasinToStation.do",
        type: "post",
        dataType:"json",
        data:JSON.stringify({
            basinId:addvcd,
            stcds:stcds,
            item:sttp
        }),
        success:function(jsondata){
            getRainLists();
            $.toast({
                text: '添加成功!',
                icon: 'info',
                position: "mid-center",
                stack: false,
                allowToastClose: false,
                loader: false,
                bgColor: "#3bb9d4",
                textColor: "#fff"
            });
        }
    });
};

//得到流域树
var getBasinTree = function(){
    $.ajax({
        url: baseUrl + 'floodProfAnalyzSys/backStageManageShow/basinManage/getBasinNodeInfo.do',
        type : "POST",
        dataType : "json",
        success : function(jsonData){
            if(jsonData==null) return [];
            if(jsonData!=null){
                for(var i=0;i<jsonData.length;i++){
                    var basinData = [];
                    var obj = {};
                    obj.id = "station"+jsonData[i].id;
                    obj.text = "加载中";
                    basinData.push(obj);
                    basinReg.push({
                        id:jsonData[i].id,
                        text:jsonData[i].name,
                        children:basinData,
                        state:'closed'
                    });
                }
            }
        }
    }).complete(function(){
        getBasinList();
    });
};

//得到区域树
var getRegionTree = function(){
    $.ajax({
        url: baseUrl + 'comm/addvcd/getAddvcdChildersByFind.do?addvcd=330683&rank=d',
        type : "POST",
        dataType : "json",
        success : function(jsonData){
            console.log(jsonData);
            if(jsonData==null) return [];
            if(jsonData!=null){
                for(var i=0;i<jsonData.length;i++){
                    var zoneData = [];
                    var obj = {};
                    obj.id = "station"+jsonData[i].addvcd;
                    obj.text = "加载中";
                    zoneData.push(obj);
                    dataReg.push({
                        id:jsonData[i].addvcd,
                        text:jsonData[i].addvnm,
                        children:zoneData,
                        state:'closed'
                    });
                }
            }
        }
    }).complete(function(){
        getRegionList();
    });
};

//得到关注站点树
var getAttentionTree = function(selectedId){
    getAllStationInfo();
    $.ajax({
        url: noteUrl + '/StcdUserRelation/selectStcdByUserID.do',
        type : "POST",
        dataType : "json",
        data : {
            UID:selectedId
        },
        success : function(jsonData){
            var attentionStationData = jsonData.data;
            console.log(attentionStationData);
            if(attentionStationData==null) return [];
            if(attentionStationData!=null){
                acceptReg = [];
                for(var i=0;i<attentionStationData.length;i++){
                    var basinData = [];
                    var obj = {};
                    obj.id = attentionStationData[i].STCD;
                    obj.text = stationBaseInfo[attentionStationData[i].STCD];
                    basinData.push(obj);
                    acceptReg.push(obj);
                }
            }
        }
    }).complete(function(){
        refreshAcceptSitesByTree();
    });
};

//得到区域列表
var getRegionList = function(){
    $("#regionList").tree({
        lines:true,
        animate:true,
        data: [{
            id:'3310',
            text: '区域列表',
            state: 'open',
            children: dataReg,
            item: "xz"
        }],
        onLoadSuccess:function(){
        },
        onClick:function(node){
        },
        onSelect:function(node){
            console.log(node.id);
        },
        onExpand:function(node){
            $.ajax({
                url: baseUrl + 'comm/baseInfo/getStationBaseInfoByCondition.do',
                type: "post",
                dataType: "json",
                data:{
                    addvcd:node.id,
                } ,
                success: function (jsondata) {

                    console.log(jsondata);
                    var baseInfo = jsondata.stationBaseInfo;
                    var baseData = [];
                    for(var i = 0; i < baseInfo.length; i++){
                        var obj = {};
                        obj.id = baseInfo[i].stcd;
                        obj.text = baseInfo[i].stnm;
                        baseData.push(obj);
                        zoneStationArr[baseInfo[i].stcd] = baseInfo[i].stnm;
                    }
                    console.log(baseData);
                    console.log(node.children[0]);
                    //var wrongId = node.children[0].id;
                    //if(wrongId.indexOf("station")){
                    //    var delWrong = $("#regionList").tree('find',"station"+node.id);
                    //    $("#regionList").tree('remove',delWrong.target);
                    //}
                    var delWrong = $("#regionList").tree('find',"station"+node.id);
                    $("#regionList").tree('remove',delWrong.target);
                    if(node.children.length < 2){
                        $("#regionList").tree('append', {
                            parent: node.target,
                            data: baseData
                        });
                    }

                }
            });
        }
    });
};

//得到流域列表
var getBasinList = function(){
    $("#StationList").tree({
        lines:true,
        animate:true,
        data: [{
            id:'331022',
            text: '流域列表',
            state: 'open',
            children: basinReg,
            item: "xz"
        }],
        onLoadSuccess:function(){
        },
        onClick:function(node){
        },
        onSelect:function(node){
            console.log(node.id);
        },
        onExpand:function(node){
            $.ajax({
                url: baseUrl + '/floodProfAnalyzSys/backStageManageShow/basinManage/getStationfoById.do',
                type: "post",
                dataType: "json",
                data:{
                    basinId:node.id,
                } ,
                success: function (jsondata) {
                    var baseInfo = jsondata;
                    var baseData = [];
                    for(var i = 0; i < baseInfo.length; i++){
                        var obj = {};
                        obj.id = baseInfo[i].stcd;
                        obj.text = baseInfo[i].stnm;
                        baseData.push(obj);
                        basinStationArr[baseInfo[i].stcd] = baseInfo[i].stnm;
                    }
                    //var wrongId = node.children[0].id;
                    //if(wrongId.indexOf("station")){
                    //    var delWrong = $("#regionList").tree('find',"station"+node.id);
                    //    $("#regionList").tree('remove',delWrong.target);
                    //}
                    var delWrong = $("#StationList").tree('find',"station"+node.id);
                    $("#StationList").tree('remove',delWrong.target);
                    if(node.children.length < 2){
                        $("#StationList").tree('append', {
                            parent: node.target,
                            data: baseData
                        });
                    }
                }
            });
        }
    });
};

//根据人员列表刷新关注站点
var refreshSites = function(selectedId){
    $.ajax({
        url: noteUrl + '/StcdUserRelation/selectStcdByUserID.do',
        type: "post",
        dataType: "json",
        data:{
            UID:selectedId,
        } ,
        success: function (jsondata) {
            var stcdArr = jsondata.data;
            var ul = $('#attentionList').empty();
            if(stcdArr.length == 0 || stcdArr == null){
                ul.append("<li>暂无关注站点！</li>");
            }else{
                var stcd = "";
                for(var i = 0; i < stcdArr.length; i++){
                    userStcdRelation[stcdArr[i].STCD_Interest] = stcdArr[i];
                    stcd += stcdArr[i].STCD_Interest+",";
                    if(i == stcdArr.length - 1){
                        stcd += stcdArr[i].STCD_Interest;
                    }
                }
                $.ajax({
                    url: baseUrl + 'comm/baseInfo/getStationBaseInfoByStcds.do',
                    type: "post",
                    dataType: "json",
                    data: {
                        stcd: stcd
                    },
                    success: function (jsondata) {
                        console.log(jsondata);
                        var content = "";
                        var ul = $('#attentionList').empty();
                        var stationArr = jsondata.stationBaseInfo;
                        for(var i = 0; i < stationArr.length; i++){
                            var rel = userStcdRelation[stationArr[i].stcd];
                            var noteWarn = rel.NoteWarn;
                            if(noteWarn == "0"){
                                content += '<li id="'+rel.StcdUserRelationId+'">'+
                                    '<div class="rfsn1">'+stationArr[i].stnm+'</div>'+
                                    '<div class="phoneBtn fl">'+
                                    '<div class="noticeTip">点击图标关注或取消短信发送站点</div>'+
                                    '</div>'+
                                    '<div class="rfsn2" stcd="'+stationArr[i].stcd+'"></div>'+
                                    '</li>';
                            }else if(noteWarn == "1"){
                                content += '<li id="'+rel.StcdUserRelationId+'">'+
                                    '<div class="rfsn1">'+stationArr[i].stnm+'</div>'+
                                    '<div class="phoneBtn fl active">'+
                                    '<div class="noticeTip">点击图标关注或取消短信发送站点</div>'+
                                    '</div>'+
                                    '<div class="rfsn2" stcd="'+stationArr[i].stcd+'"></div>'+
                                    '</li>';
                            }

                        }
                        ul.append(content);
                        honverTips();
                        clickTips();
                        deleteAttentionStation();
                    }
                });
            }
        }
    });
};

//根据人员列表刷新短信接收站点
var refreshAcceptSites = function(selectedId){
    $.ajax({
        url: noteUrl + '/StcdUserRelation/selectStcdByUIDAndNoteWarn.do',
        type: "post",
        dataType: "json",
        data:{
            UID:selectedId
        } ,
        success: function (jsondata) {
            var stcdArr = jsondata.data;
            console.log(stcdArr);
            var ul = $('#acceptNoteStation').empty();
            if(stcdArr.length == 0 || stcdArr == null){
                ul.append("<div>暂无短信接收站点！</div>");
            }else{
                var stcd = "";
                for(var i = 0; i < stcdArr.length; i++){
                    stcd += stcdArr[i].STCD+",";
                    if(i == stcdArr.length - 1){
                        stcd += stcdArr[i].STCD;
                    }
                }
                $.ajax({
                    url: baseUrl + 'comm/baseInfo/getStationBaseInfoByStcds.do',
                    type: "post",
                    dataType: "json",
                    data: {
                        stcd: stcd
                    },
                    success: function (jsondata) {
                        var content = "";
                        var ul = $('#acceptNoteStation').empty();
                        var stationArr = jsondata.stationBaseInfo;
                        console.log(stationArr);
                        for(var i = 0; i < stationArr.length; i++){
                            content += '<li>'+
                                '<div class="rfsn1">'+stationArr[i].stnm+'</div>'+
                                '<div class="rfsn2" stcd="'+stationArr[i].stcd+'"></div>'+
                                '</li>';
                        }
                        ul.append(content);
                        deleteAcceptStation();
                    }
                });
            }
        }
    });
};

//根据人员列表刷关注站点树
var refreshAcceptSitesByTree = function(selectedId){
    $("#messageSiteList").tree({
        lines:true,
        animate:true,
        data: [{
            id:'attentionStation',
            text: '已关注站点',
            state: 'open',
            children: acceptReg,
            item: "xz"
        }],
        onLoadSuccess:function(){
        },
        onClick:function(node){
        },
        onSelect:function(node){
            console.log(node.id);
        }
    });
};

var deleteAttentionStation = function(){
    //点击关注站点右边小红点删除关注站点
    $('.rfsn2').each(function(){
        $(this).click(function(){
            var $this = $(this);
            console.log($(this).parent().find('.rfsn2').attr("stcd"));
            var STCD = $(this).parent().find('.rfsn2').attr("stcd");
            var UID = $('#BasinList').tree("getSelected").id;
            console.log(UID);
            $.ajax({
                url: noteUrl + '/StcdUserRelation/deleteStcdUserRelationByUIDAndSTCD.do',
                type: "post",
                dataType: "json",
                data: {
                    STCD:STCD,
                    UID:UID
                },
                success: function (jsondata) {
                    $this.parent().remove();
                    $.toast({
                        text: '删除关注站点成功',
                        icon: 'info',
                        position: 'mid-center',
                        stack: false,
                        allowToastClose: false,
                        loader: false,
                        bgColor: "#e97c75"
                    });
                }
            });
        });
    });
};

var deleteAcceptStation = function(){
    //点击关注站点右边小红点删除关注站点
    $('.rfsn2').each(function(){
        $(this).click(function(){
            var $this = $(this);
            console.log($(this).parent().find('.rfsn2').attr("stcd"));
            var STCD = $(this).parent().find('.rfsn2').attr("stcd");
            var UID = $('#Basin2List').tree("getSelected").id;
            console.log(UID);
            $.ajax({
                url: noteUrl + '/StcdUserRelation/deleteStcdUserRelationByUIDAndSTCD.do',
                type: "post",
                dataType: "json",
                data: {
                    STCD:STCD,
                    UID:UID
                },
                success: function (jsondata) {
                    $this.parent().remove();
                    $.toast({
                        text: '删除接受短信站点成功',
                        icon: 'info',
                        position: 'mid-center',
                        stack: false,
                        allowToastClose: false,
                        loader: false,
                        bgColor: "#e97c75"
                    });
                }
            });
        });
    });
};

//得到所有站点信息
var getAllStationInfo = function(){
    $.ajax({
        url: baseUrl + 'comm/addvcd/getAddvcdChildersByFind.do?addvcd=330683&rank=d',
        type: "POST",
        dataType: "json",
        success: function (jsonData) {
            for(var i = 0; i < jsonData.length; i++){
                var addvcd = jsonData[i].addvcd;
                $.ajax({
                    url: baseUrl + 'comm/baseInfo/getStationBaseInfoByCondition.do',
                    type: "POST",
                    dataType: "json",
                    data:{
                        addvcd:addvcd
                    },
                    success: function (Data) {
                        var baseArr = Data.stationBaseInfo;
                        for(var j = 0; j < baseArr.length; j++){
                            stationBaseInfo[baseArr[j].stcd] = baseArr[j].stnm;
                        }
                    }
                })
            }
        }
    });
    getBasinStationInfo();
};

//得到流域所有站点信息
var getBasinStationInfo = function(){
    $.ajax({
        url: baseUrl + 'floodProfAnalyzSys/backStageManageShow/basinManage/getBasinNodeInfo.do',
        type : "POST",
        dataType : "json",
        success : function(jsonData){
            for(var i = 0; i < jsonData.length; i++){
                var basinId = jsonData[i].id;
                $.ajax({
                    url: baseUrl + '/floodProfAnalyzSys/backStageManageShow/basinManage/getStationfoById.do',
                    type: "post",
                    dataType: "json",
                    data:{
                        basinId:basinId
                    } ,
                    success: function (jsondata) {
                        for(var j = 0; j < jsondata.length; j++){
                            stationBaseInfo[jsondata[j].stcd] = jsondata[j].stnm;
                        }
                    }
                });
            }
        }
    })
};

var honverTips = function(){
    //小鼠标的浮动提示
    $('.phoneBtn').each(function(){
        $(this).hover(function(){
            $(this).find('.noticeTip').show();
        },function(){
            $(this).find('.noticeTip').hide();
        });
    });
};

var clickTips = function(){
    $('.phoneBtn').each(function(){
        $(this).click(function(){
            var $this = $(this);
            var StcdUserRelationId = $(this).parent().attr("id");
            var classContent = $(this).attr("class");
            var NoteWarn = "";
            if(classContent.indexOf("active") > 0){
                NoteWarn = "0";
                $.ajax({
                    url: noteUrl + '/StcdUserRelation/updateStcdUserRelationById.do',
                    type : "POST",
                    dataType : "json",
                    data:{
                        StcdUserRelationId:StcdUserRelationId,
                        NoteWarn:NoteWarn
                    },
                    success : function(jsonData){
                        $this.removeClass("active");
                    }
                })
            }else{
                NoteWarn = "1";
                $.ajax({
                    url: noteUrl + '/StcdUserRelation/updateStcdUserRelationById.do',
                    type : "POST",
                    dataType : "json",
                    data:{
                        StcdUserRelationId:StcdUserRelationId,
                        NoteWarn:NoteWarn
                    },
                    success : function(jsonData){
                        $this.addClass("active");
                    }
                });
            }
        });
    });
};













