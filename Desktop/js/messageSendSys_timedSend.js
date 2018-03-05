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
var userArr = {};
var userIdArr = {};
var userMap = [];
var branchArr = {};
var topArr = {};
$(function(){


    // 类型选择框
    var typeSelect = $("#typeSelect").customSelect({width:$('.typeSelectDiv').width()+2,lineHeight:27});

    //获取正文的高度
    $('.mainContentDiv').height($('.right').height() - $('.title').outerHeight() - $('.timeSendBox').outerHeight() - 20 - $('.addressBox').outerHeight() - 20 - $('.customBox').outerHeight() - 18*2 - 70);
    $('#newInfo').height($('.mainContentDiv').height() - 4);
    //点击收件人右侧的垃圾桶图标，全部删除收件人信息
    $('#delBtn').click(function(){
        $('#userInfo').prop('value','');
    });


    //div获取焦点框
    $('.addressDiv').click(function(){
        //$(this).css('borderColor','#3bb9d4');
        //$(this).find('#delBtn').css('borderLeftColor','#3bb9d4');
        $(this).find('.delIcon').css('background','url(../../images/mess_rub.png) no-repeat  0 bottom ');
    });

    $('.customDiv').click(function(){
        $(this).css('borderColor','#3bb9d4');
        $(this).find('#editBtn').css('borderLeftColor','#3bb9d4');
        $(this).find('.editIcon').css('background','url(../../images/mes_pen.png) no-repeat  center ');
    });

    //div失去焦点框
    $("body").bind("click", function (event) {
        if ($(event.target).parent('.addressDiv').length == 0) {
            //$('.addressDiv').css('borderColor','#eaeaeb');
            //$('.addressDiv').find('#delBtn').css('borderLeftColor','#eaeaeb');
            $(this).find('.delIcon').css('background','url(../../images/mess_rub.png) no-repeat  0 top ');
        }
    });

    $("body").bind("click", function (event) {
        if ($(event.target).parent('.customDiv').length == 0) {
            $('.customDiv').css('borderColor','#eaeaeb');
            $('.customDiv').find('#editBtn').css('borderLeftColor','#eaeaeb');
            $(this).find('.editIcon').css('background','url(../../images/mess_pen.png) no-repeat  0 bottom ');
        }
    });

    $('#sendBtn').click(function(){
        timeSend();
    });

    $('#startTime').datetimebox('setValue',new Date().DateAdd("minute", 5).Format("yyyy-MM-dd hh:mm"));

    initInfo();

});

var initInfo = function(){
    //初始化分组列表
    $('#userList').tree({
        url: baseUrl+"/UserGroup/selectUserGroups.do",
        lines:true,
        animate:true,
        loadFilter: function(result) {
            //console.log(result)
            if(result.state == 0){
                var userGroup = result.data;
                console.log(userGroup);
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
            console.log(node.id);
        },
        onCheck:function(node,checked){
            if(checked){
                $('#userInfo').text("");
                var _note = node;
                userId = node.id;
                addId = userId;
                sel_node = userId;
                groupName = node.text;
                if(userId.indexOf("top") >= 0 && node.children != null && node.children.length != 0){
                    userId = _note.children[0].id;
                    groupName = _note.children[0].text;
                }
                if(addId.indexOf("3306") >= 0){
                    var numberContent = "";
                    for(var i = 0; i < userMap.length; i++){
                        if(numberContent.indexOf(userMap[i]) < 0){
                            var tel = userMap[i];
                            var telId = userIdArr[tel];
                            var checkeditem = $('#userList').tree('find', telId);
                            var name = checkeditem.text;
                            numberContent += name+"("+tel+");";
                        }
                    }
                    $('#userInfo').val(numberContent);
                }else if(addId.indexOf("top") >= 0){
                    var numberArr = topArr[addId];
                    var telContent = $('#userInfo').val();
                    for(var i = 0; i < numberArr.length; i++){
                        if(telContent.indexOf(numberArr[i]) < 0){
                            var tel = numberArr[i];
                            var telId = userIdArr[tel];
                            var checkeditem = $('#userList').tree('find', telId);
                            var name = checkeditem.text;
                            telContent += name+"("+tel+");";
                        }
                    }
                    $('#userInfo').val(telContent);
                }else if(addId.indexOf("branch") >= 0){
                    var userList = branchArr[addId];
                    var telContent = $('#userInfo').val();
                    for(var i = 0; i < userList.length; i++){
                        if(telContent.indexOf(userList[i]) < 0){
                            var tel = userList[i];
                            var telId = userIdArr[tel];
                            var checkeditem = $('#userList').tree('find', telId);
                            var name = checkeditem.text;
                            telContent += name+"("+tel+");";
                        }
                    }
                    $('#userInfo').val(telContent);
                }else{
                    var mobile = userArr[addId];
                    var telId = userIdArr[mobile];
                    var checkeditem = $('#userList').tree('find', telId);
                    var name = checkeditem.text;
                    var telTxt = $('#userInfo').val();
                    if(telTxt.indexOf(mobile) < 0){
                        $('#userInfo').val($('#userInfo').val() + name+"("+mobile+");");
                    }
                }
            }else{
                var cancleId = node.id;
                var mobile = userArr[cancleId];
                var telInfo = $('#userInfo').val();
                if(cancleId.indexOf("3306") >= 0){
                    $('#userInfo').val("");
                }else if(cancleId.indexOf("top") >= 0){
                    var numberArr = topArr[cancleId];
                    var telContent = $('#userInfo').val();
                    for(var i = 0; i < numberArr.length; i++){
                        if(telContent.indexOf(numberArr[i]) >= 0){
                            var telId = userIdArr[numberArr[i]];
                            var checkeditem = $('#userList').tree('find', telId);
                            var name = checkeditem.text;
                            telContent = telContent.replace(name+"("+numberArr[i]+");","");
                        }
                    }
                    $('#userInfo').val(telContent);
                    if(telContent == ""){
                        var checkedItem = $('#userList').tree('getChecked');
                        for(var s = 0; s < checkedItem.length; s++){
                            var checkedId =  checkedItem[s].id;
                            $('#userList').tree('uncheck', checkedItem[s].target);
                        }
                    }
                }else if(cancleId.indexOf("branch") >= 0){
                    var userList = branchArr[cancleId];
                    var telContent = $('#userInfo').val();
                    for(var p = 0; p < userList.length; p++){
                        if(telContent.indexOf(userList[p]) >= 0){
                            var telId = userIdArr[userList[p]];
                            var checkeditem = $('#userList').tree('find', telId);
                            var name = checkeditem.text;
                            telContent = telContent.replace(name+"("+userList[p]+");","");
                        }
                    }
                    $('#userInfo').val(telContent);
                    if(telContent == ""){
                        var checkedItem = $('#userList').tree('getChecked');
                        for(var s = 0; s < checkedItem.length; s++){
                            var checkedId =  checkedItem[s].id;
                            $('#userList').tree('uncheck', checkedItem[s].target);
                        }
                    }
                }else{
                    var mobile = userArr[cancleId];
                    var telTxt = $('#userInfo').val();
                    if(telTxt.indexOf(mobile) >= 0){
                        var telId = userIdArr[mobile];
                        var checkeditem = $('#userList').tree('find', telId);
                        var name = checkeditem.text;
                        telTxt = telTxt.replace(name+"("+mobile+");","");
                    }
                    $('#userInfo').val(telTxt);
                    if(telTxt == ""){
                        var checkedItem = $('#userList').tree('getChecked');
                        for(var s = 0; s < checkedItem.length; s++){
                            var checkedId =  checkedItem[s].id;
                            $('#userList').tree('uncheck', checkedItem[s].target);
                        }
                    }
                }
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

            $('#userList').tree('select', node.target);
            $('#mm').menu('show', {
                left: e.pageX,
                top: e.pageY
            });

        }
    });
};

var timeSend = function(){
    var time = $('#startTime').datetimebox("getValue");
    var nowTime = new Date();
    var newTime = nowTime.Format("yyyy-MM-dd hh:mm:ss");
    var d1 = new Date(time.replace(/\-/g, "\/"));
    var d2 = new Date(newTime.replace(/\-/g, "\/"));
    if(d1 >= d2){
        var telephoneContent = $('#userInfo').val();
        var textPhone = "";
        var telephoneArr = telephoneContent.split(";");
        if(telephoneArr.length > 0){
            for(var i = 0; i < telephoneArr.length; i++){
                var nameContent = telephoneArr[i];
                if(nameContent != ""){
                    var telSend = nameContent.substring(nameContent.length - 12,nameContent.length - 1);
                    textPhone += telSend + ";";
                }
            }
        }
        var SendToPhone = "";
        var customPhone = $('#telInfo').val();
        var reg = /^1[34578]\d{9}$/;
        console.log(textPhone);
        if(textPhone == "" && customPhone == ""){
            SendToPhone = "";
            $.toast({
                text: '发送短信的电话号码不能为空!',
                icon: 'info',
                position: "mid-center",
                stack: false,
                allowToastClose: false,
                loader: false,
                bgColor: "#3bb9d4",
                textColor: "#fff"
            });
            return;
        }else if(textPhone == "" && customPhone != ""){
            if(!reg.test(customPhone)){
                $.toast({
                    text: '请输入正确的13位手机号码!',
                    icon: 'info',
                    position: "mid-center",
                    stack: false,
                    allowToastClose: false,
                    loader: false,
                    bgColor: "#3bb9d4",
                    textColor: "#fff"
                });
                return;
            }else{
                SendToPhone = customPhone;
            }

        }else if(textPhone != "" && customPhone == ""){
            SendToPhone = textPhone;
        }else if(textPhone != "" && customPhone != ""){
            if(!reg.test(customPhone)){
                $.toast({
                    text: '请输入正确的13位手机号码!',
                    icon: 'info',
                    position: "mid-center",
                    stack: false,
                    allowToastClose: false,
                    loader: false,
                    bgColor: "#3bb9d4",
                    textColor: "#fff"
                });
                return;
            }else{
                SendToPhone = textPhone + customPhone;
            }
        }
        var SendContent = $('#newInfo').val();
        if(SendContent == ""){
            $.toast({
                text: '发送短信内容为空!',
                icon: 'info',
                position: "mid-center",
                stack: false,
                allowToastClose: false,
                loader: false,
                bgColor: "#3bb9d4",
                textColor: "#fff"
            });
        }else{
            $.ajax({
                url: baseUrl+"/Note/addTimeSMSs.do",
                data:{SendToPhone:SendToPhone,
                    SendContent:SendContent,
                    sendTime:time
                },
                success: function (result) {
                    console.log(result);
                    if(result.state == 0){
                        $.toast({
                            text: '定时短信发送成功!',
                            icon: 'info',
                            position: "mid-center",
                            stack: false,
                            allowToastClose: false,
                            loader: false,
                            bgColor: "#3bb9d4",
                            textColor: "#fff"
                        });
                        var noteMessageArr = result.data;
                        console.log(noteMessageArr);
                        if(noteMessageArr.length > 0){
                            for(var i = 0; i < noteMessageArr.length; i++){
                                var telPhoneToSend = noteMessageArr[i].destinationAddress;
                                var messageId = noteMessageArr[i].messageID;
                                var acceptTime = noteMessageArr[i].sendTime;
                                $.ajax({
                                    url: baseUrl+"/Note/addTimeSMNotes.do",
                                    data:{SendToPhone:telPhoneToSend,
                                        messageId:messageId,
                                        acceptTime:acceptTime,
                                        SendContent:SendContent},
                                    success: function (notes) {

                                    }
                                });
                            }
                        }
                    }else{
                        $.toast({
                            text: '定时短信发送失败!',
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
                }
            });
        }
    }else{
        $.toast({
            text: '请选择正确的发送时间!',
            icon: 'info',
            position: "mid-center",
            stack: false,
            allowToastClose: false,
            loader: false,
            bgColor: "#3bb9d4",
            textColor: "#fff"
        });
    }

};