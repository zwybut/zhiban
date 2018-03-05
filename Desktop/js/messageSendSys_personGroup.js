/**
 * Created by Dell on 2017/6/23.
 */

var sel_node = "";
var userId = "";
var addId = "";
var groupName = "";
var rightSelectId ="";
var sel_nodeChange = true;
var topGroupArr = {};
var regionSelect;
$(function(){

    //点击添加分组按钮，弹出添加分组弹框
    $('#addGroupBtn').click(function(){
        console.log(topGroupArr);
        for(var i in topGroupArr){
            console.log(topGroupArr[i]);
        }
        $.confirmWin({
            width:480,
            height:265,
            title:"添加分组",
            text:"<div class='save_popup'><p>栏&nbsp;&nbsp;&nbsp;&nbsp;目:</p>" +
            "<select id='menu'>" +
            "<option value='Large'>一级</option>"+
            "<option value='small' selected>二级</option>"+
            "</select><div class='secMe'>" +
            "<p>子栏目:</p>" +
            "<select id='secondMenu'>"+
            "<option selected='selected'>分组一</option>"+
            "<option>分组二</option>"+
            "<option>分组三</option>"+
            "</select></div>" +
            "<p>名&nbsp;&nbsp;&nbsp;&nbsp;称:<span class='tips'>分组名称不能为空!</span></p> " +
            "<input class='report' id='reportName' value='' placeholder='未命名'></div>",
            btnVal:"保存",
            submitFn:function(){
                // 保存报表信息
                if($("#reportName").val()==""){
                    $('.tips').show();
                    return false;
                }else{
                    var data = {};
                    var newName = $('#reportName').val();
                    var rptClass = menu.getValue();
                    var id = (new Date()).getTime();
                    data["id"] = id;
                    data["name"] = newName;
                    data["rptClass"] = rptClass;
                    if($('.secMe').css('display') == 'none'){
                        var parentId = null;
                    }else parentId = secondMenu.getValue();
                    data["parentId"] = parentId;
                    addSecList(data)
                }
            }
        });

        var secondMenu = $("#secondMenu").customSelect({
            width:440,lineHeight:30
        });

        var menu = $("#menu").customSelect({
            width:440,lineHeight:30
        });
        menu.change(function(){
            if(menu.getValue() == 'Large'){
                $('.secMe').hide();
                $('.confirmWin_winFrame').height(215);
            }else{
                $('.secMe').show();
                $('.confirmWin_winFrame').height(265);
            }
        });


    });

    getRegionSelect();

    //组内人员内容wrap的高度
    $('.wrap').height($('.right').outerHeight() - $('.title').outerHeight() - $('.operDiv').outerHeight() - $('.listTitle').outerHeight());

    //滚动条样式js
    $(".wrap").mCustomScrollbar({
        scrollButtons:{enable:true},
        theme:"inset-2-dark",
        axis:"y",
        autoHideScrollbar:true,
        setLeft:0,
        mouseWheel:true,
        callbacks:{

        }
    });

    //全选
    $('#checkAll').click(function(){
        if(this.checked){
            $('.checkPart').prop('checked',true);
        } else{
            $('.checkPart').prop('checked',false);
        }
    });

    //批量移除提示框
    $('#batchRemoveBtn').click(function(){
        var ids = "";
        var idArr = [];
        $('.checkPart').each(function(){
            if($(this).is(":checked")){
                ids += $(this).attr('id')+"/";
                idArr.push($(this).attr('id'));
            }
        });
        parent.$.confirmWin({
            width:460,
            height:170,
            title:"移除提示",
            text:"<div class='delIcon'></div>"+
            "<div class='delWrap'><div class='delTitle'><b>您已选中分组内<span>"+idArr.length+"个用户</span>,确定<span>移除</span>该用户吗？</b></div>"+
            "<div class='delContent'>移除后，用户将不在本分组内显示</div></div>",
            btnVal:"确定",
            submitFn:function(){
                $.ajax({
                    url: baseUrl + "/UserGroup/deleteRelationByUseridAndGid.do",
                    type: "Post",
                    data: {
                        ids: ids,
                        gid:userId
                    },
                    success: function (result) {
                        if(result.state == 0){
                            for(var i in idArr){
                                $('#'+idArr[i]).parent().parent().remove();
                            }
                        }
                    }
                });
            }
        });
    });

    //添加用户提示框
    $('#importUserBtn').click(function(){
        if(addId.indexOf("branch") >= 0){
            $.ajax({
                url: baseUrl + "/UserGroup/selectAllUserDeleteBranch.do",
                type: "Post",
                data: {
                    gid: addId
                },
                success: function (result) {
                    if(result.state == 0){
                        var userArr = result.data;
                        console.log(userArr);
                        var userContent = "";
                        for(var i = 0; i < userArr.length; i++){
                            userContent += '<li>'+
                                '<div><input type="checkbox" class="regular-checkbox checkPart1" id="'+userArr[i].UserID+'"><label for="'+userArr[i].UserID+'"></label></div>'+
                                '<div>'+userArr[i].ADDVNM+'</div>'+
                                '<div>'+userArr[i].LinkName+'</div>'+
                                '<div>'+userArr[i].Mobile+'</div>'+
                                '<div>'+userArr[i].JobTitle+'</div>'+
                                '</li>';
                        }
                        parent.$.confirmWin({
                            width:650,
                            height:360,
                            title:"导入用户",
                            text:'<div class="operDiv">'+
                            '<div class="searchDiv">'+
                            '<input type="text" placeholder="模糊搜索" id="searchIpt">'+
                            '<img src="../../images/search.png" alt="" id="searchIcon">'+
                            '</div></div>'+
                            '<ul class="listTitle">'+
                            '<li style="visibility: hidden">XXX</li>'+
                            '<li>所在地区</li><li>名称</li><li>电话</li><li>职位</li></ul>'+
                            '<div class="wrap">'+
                            '<ul class="listContent" id="userContentArr">'+userContent+
                            '</ul></div>',
                            btnVal:"确定",
                            submitFn:function($this){
                                console.log($this);
                                var ids = "";
                                var idArr = [];
                                var $this = this;
                                $this.find('.checkPart1').each(function(){
                                    if($(this).is(":checked")){
                                        console.log($(this).attr('id'))
                                        ids += $(this).attr('id')+"/";
                                        idArr.push($(this).attr('id'))
                                    }
                                });
                                $.ajax({
                                    url: baseUrl + "/UserGroup/addUsersToBranch.do",
                                    type: "Post",
                                    data: {
                                        ids: ids,
                                        GID:addId
                                    },
                                    success: function (result) {
                                        if(result.state == 0){
                                            console.log(result.data);
                                            var userArr = result.data;
                                            var userContent = "";
                                            if(userArr.length > 0){
                                                for(var i = 0; i < userArr.length; i++){
                                                    userContent += '<li aid="'+userArr[i].userID+'">'+
                                                        '<div><input type="checkbox" class="regular-checkbox checkPart" id="'+userArr[i].userID+'"><label for="'+userArr[i].userID+'"></label></div>'+
                                                        '<div>'+userArr[i].addvnm+'</div>'+
                                                        '<div class="userId">'+userArr[i].linkName+'</div>'+
                                                        '<div>'+userArr[i].mobile+'</div>'+
                                                        '<div>'+userArr[i].jobTitle+'</div>'+
                                                        '<div>'+
                                                        '<p class="operBtn"></p>'+
                                                        '</div>'+
                                                        '</li>';
                                                }
                                                $('.listContent').append(userContent);
                                                deleteInfo();
                                            }
                                        }
                                    }
                                });
                            }
                        });
                        var popup = parent.$('.confirmWin_winFrame');
                        popup.find('#searchIcon').click(function(){
                            var content = popup.find('#searchIpt').val();
                            $.ajax({
                                url: baseUrl + "/UserGroup/selectUser.do",
                                type: "Post",
                                data: {
                                    gid: addId,
                                    content:content.trim()
                                },
                                success: function (result) {
                                    var userArray = result.data;
                                    var ul = popup.find('#userContentArr').empty();
                                    var userContent = "";
                                    for(var i = 0; i < userArray.length; i++){
                                        userContent += '<li>'+
                                            '<div><input type="checkbox" class="regular-checkbox checkPart1" id="'+userArray[i].UserID+'"><label for="'+userArray[i].UserID+'"></label></div>'+
                                            '<div>'+userArray[i].ADDVNM+'</div>'+
                                            '<div>'+userArray[i].LinkName+'</div>'+
                                            '<div>'+userArray[i].Mobile+'</div>'+
                                            '<div>'+userArray[i].JobTitle+'</div>'+
                                            '</li>';
                                    }
                                    ul.append(userContent);
                                }
                            })
                        });

                        parent.selectShow();
                        parent.scrollShow();
                    }
                }
            });
        }else{
            $.toast({
                text: '请选择一个最底层的分组进行人员的导入!',
                icon: 'info',
                position: 'mid-center',
                stack: false,
                allowToastClose: false,
                loader: false,
                bgColor: "#e97c75"
            });
        }
    });

    $('#searchBtn').click(function(){
        var content = $('#searchIpt').val();
        var regionName = regionSelect.getText();
        if(regionName == "所有地区"){
            regionName = "";
        }
        var selId = userId;
        if(selId == "" || selId == null || selId == undefined){
            $.toast({
                text: '请选择一个最底层的分组进行人员的查询!',
                icon: 'info',
                position: 'mid-center',
                stack: false,
                allowToastClose: false,
                loader: false,
                bgColor: "#e97c75"
            });
        }else{
            $.ajax({
                url: baseUrl + "/UserGroup/selectUserByGidAndMobile.do",
                type: "Post",
                data: {
                    gid: userId,
                    content:content.trim(),
                    regionName:regionName
                },
                success: function (result) {
                    console.log(result);
                    if(result.state == 0){
                        var userArr = result.data;
                        console.log(userArr);
                        $('.listContent').empty();
                        if(userArr[0] != null){
                            var userContent = "";
                            for(var i = 0; i < userArr.length; i++){
                                userContent += '<li aid="'+userArr[i].userID+'">'+
                                    '<div><input type="checkbox" class="regular-checkbox checkPart" id="'+userArr[i].userID+'"><label for="'+userArr[i].userID+'"></label></div>'+
                                    '<div>'+userArr[i].addvnm+'</div>'+
                                    '<div class="userId">'+userArr[i].linkName+'</div>'+
                                    '<div>'+userArr[i].mobile+'</div>'+
                                    '<div>'+userArr[i].jobTitle+'</div>'+
                                    '<div>'+
                                    '<p class="operBtn"></p>'+
                                    '</div>'+
                                    '</li>';
                            }
                            $('.listContent').append(userContent);
                        }
                        deleteInfo();
                    }else{
                        console.log(111111);
                    }
                }
            });
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
        //checkbox:true,
        loadFilter: function(result) {
            //console.log(result)
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
                        for(var j in branchGroup){
                            var branchObj = {};
                            var branchGroupName = j.split("/")[0];
                            var branchGroupId = j.split("/")[1];
                            branchObj.id = branchGroupId;
                            branchObj.text = branchGroupName;
                            var userList = branchGroup[j];
                            var userData = [];
                            //for(var n = 0; n < userList.length; n++){
                            //    var userObj = {};
                            //    var user = userList[n];
                            //    var userName = user.linkName;
                            //    var userId = user.aid;
                            //    userObj.id = userId;
                            //    userObj.text = userName;
                            //    userData.push(userObj);
                            //}
                            branchData.push({
                                id:branchGroupId,
                                text:branchGroupName
                            });
                        }
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
            //var parent_node = $(this).tree('getRoot');
            //if(parent_node.children!=null && parent_node.children.length>0 && sel_nodeChange == true){
            //    for(var i = 0; i < parent_node.children.length; i++){
            //        if(parent_node.children[i].children != null && parent_node.children[i].children.length > 0){
            //            sel_nodeChange = false;
            //            sel_node =  parent_node.children[i].id;
            //            var node = $('#userList').tree('find', sel_node);// 找到第一个子节点
            //            $(this).tree('select', node.target);
            //            return;
            //        }
            //    }
            //}
        },
        onSelect:function(node){
            var parent_node = $(this).tree('getRoot');
            var _note = node;
            userId = node.id;
            console.log(node.id);
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
            getGroupLists();
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
                if(rightSelectId == "top27b7970a-24c1-4950-97fa-e1d6fdc4852a"){
                    $('#addBasin').hide();
                    $('#delBasin').hide();
                }else{
                    $('#addBasin').show();
                    $('#delBasin').show();
                }

            }else{
                if(rightSelectId == "branch21b6a36f-5502-41c8-b343-7a1fe6c51b37"){
                    $('#addBasin').hide();
                    $('#delBasin').hide();
                }else{
                    $('#addBasin').hide();
                    $('#delBasin').show();
                }

            }

            $('#userList').tree('select', node.target);
            $('#mm').menu('show', {
                left: e.pageX,
                top: e.pageY
            });

        }
    });
};

var append = function(){
    $.confirmWin({
        width:480,
        height:160,
        title:"添加分组",
        text:"<div class='save_popup'>" +
        "<p>名&nbsp;&nbsp;&nbsp;&nbsp;称:</p>" +
        "<input class='report' id='secondListName' value=''></div>",
        btnVal:"保存",
        submitFn:function(){
            var GroupName = $('#secondListName').val();
            if(rightSelectId.indexOf("top") >= 0){
                $.when($.ajax({
                    url: baseUrl + '/UserGroup/addBranchGroup.do',
                    type : "POST",
                    dataType : "json",
                    data:{
                        ParID:rightSelectId,
                        GroupName:GroupName
                    }
                })).done(function(branchGroup){
                    console.log(branchGroup);
                    var gid = branchGroup.data.gid;
                    console.log(gid);
                    //$.ajax({
                    //    url: baseUrl + 'UserGroup/addRelationshipByBranch.do',
                    //    type : "POST",
                    //    dataType : "json",
                    //    data:{
                    //        gid:gid,
                    //        pid:rightSelectId
                    //    }
                    //});
                    initInfo();
                });
            }else{
                $.ajax({
                    url: baseUrl + '/UserGroup/addTopGroup.do',
                    type : "POST",
                    dataType : "json",
                    data:{
                        GroupName:GroupName
                    },
                    success : function(result){
                        initInfo();
                    }
                });
            }
            //$.ajax({
            //    url: baseUrl + 'floodProfAnalyzSys/backStageManageShow/basinManage/addBasinNode.do',
            //    type : "POST",
            //    dataType : "json",
            //    data:{
            //        GroupName:GroupName
            //    },
            //    success : function(data){
            //        var selected = $('#BasinList').tree('getSelected');
            //        $("#BasinList").tree('append',{
            //            parent: selected.target,
            //            data: {
            //                id:id,
            //                text:GroupName,
            //            }
            //        });
            //    }
            //});
        }
    });
};

var remove = function(){
    $.confirmWin({
        width:520,
        height:160,
        title:"删除分组",
        text:"<div class='removeWarnContent'>您确定要删除<b>"+ groupName +"</b>分组嘛？</div>",
        btnVal:"确定",
        submitFn:function(){


            if(addId.indexOf("top") >= 0){
                $.when($.ajax({
                    url: baseUrl + '/UserGroup/deleteTopGroup.do',
                    type : "POST",
                    dataType : "json",
                    data:{
                        GID:addId
                    }
                }),$.ajax({
                    url:baseUrl+"/UserGroup/deleteRelationByPid.do",
                    type:"post",
                    dataType : "json",
                    data:{
                        pid:addId
                    }
                })).done(function(topGroup,relationship){
                    var selected = $('#userList').tree('getSelected');
                    $("#userList").tree('remove', selected.target);
                });
            }else if(addId.indexOf("branch") >= 0){
                $.ajax({
                    url: baseUrl + "/UserGroup/deleteBranchGroup.do",
                    type: "Post",
                    data: {
                        gid: addId
                    },
                    success: function (result) {
                        if(result.state == 0){
                            var selected = $('#userList').tree('getSelected');
                            $("#userList").tree('remove', selected.target);
                        }
                    }
                });
            }
        }
    });
};

var getGroupLists = function(){
    $.ajax({
        url: baseUrl + "/UserGroup/selectUserByGid.do",
        type: "Post",
        data: {
            gid: userId
        },
        success: function (result) {
            if(result.state == 0){
                var userArr = result.data;
                console.log(userArr);
                $('.listContent').empty();
                if(userArr[0] != null){
                    var userContent = "";
                    for(var i = 0; i < userArr.length; i++){
                        userContent += '<li aid="'+userArr[i].userID+'">'+
                            '<div><input type="checkbox" class="regular-checkbox checkPart" id="'+userArr[i].userID+'"><label for="'+userArr[i].userID+'"></label></div>'+
                            '<div>'+userArr[i].addvnm+'</div>'+
                            '<div class="userId">'+userArr[i].linkName+'</div>'+
                            '<div>'+userArr[i].mobile+'</div>'+
                            '<div>'+userArr[i].jobTitle+'</div>'+
                            '<div>'+
                            '<p class="operBtn"></p>'+
                            '</div>'+
                            '</li>';
                    }
                    $('.listContent').append(userContent);
                }
                deleteInfo();
            }
        }
    });
};
//单个移除提示框
var deleteInfo = function(){
    $('.operBtn').each(function(){
        $(this).click(function(){
            var _this = $(this);
            var uId = $(this).parent().siblings('.userId').text();
            var ids = $(this).parents('li').attr('aid');
            console.log(ids);
            parent.$.confirmWin({
                width:460,
                height:170,
                title:"移除提示",
                text:"<div class='delIcon'></div>"+
                "<div class='delWrap'><div class='delTitle'><b>您已选中分组内用户<span>"+uId+"</span>,确定<span>移除</span>该用户吗？</b></div>"+
                "<div class='delContent'>移除后，用户将不在本分组内显示</div></div>",
                btnVal:"确定",
                submitFn:function(){
                    $.ajax({
                        url: baseUrl + "/UserGroup/deleteRelationByUseridAndGid.do",
                        type: "Post",
                        data: {
                            ids: ids,
                            gid:userId
                        },
                        success: function (result) {
                            _this.parents("li").remove();
                        }
                    });
                }
            });
        });
    });
};

var getRegionSelect = function(){
    $.ajax({
        url: GTUrl + "comm/addvcd/getAddvcdChildersByFind.do",
        type: "Post",
        data: {
            addvcd: addvcd,
            rank:'d'
        },
        success: function (result) {
            console.log(result);
            var regionArr = result;
            var regionCus = $('.regionSelectDiv').empty();
            var content = '<select id="regionSelect">'+
                          '<option value="所有地区" selected="selected">所有地区</option>';
            for(var i = 0; i < regionArr.length; i++){
                content += '<option value="'+regionArr[i].addvcd+'">'+regionArr[i].addvnm+'</option>';
            }
            content += '<option value="">其他地区</option>';
            content += '</select>';
            regionCus.append(content);
            // 地区选择框
            regionSelect = $("#regionSelect").customSelect({width:165,lineHeight:26});
        }
    });
};