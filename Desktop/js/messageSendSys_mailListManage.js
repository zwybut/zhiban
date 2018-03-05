/**
 * Created by Dell on 2017/8/18.
 */

var regionSelect;
var userInfoArr = {};
var sexSelect;
var zoneSelect;
var userInfoMap;
$(function(){

    // 地区选择框
    getRegionSelect();
    getZoneSelect();
    sexSelect = $("#sexSelect").customSelect({width:221,lineHeight:26});
    //streetSelect = $("#streetSelect").customSelect({width:221,lineHeight:26,enabled:false});

    //地区组类选择
    //regionSelect.change(function(){
    //    var type = regionSelect.getValue();
    //    if(type == 0){
    //        $('.groupUl').hide();
    //    }else if(type == 1){
    //        $('.groupUl').show().empty().append('<li>水文站</li>'+
    //            '<li>测量队</li>'+
    //            '<li>代班组</li>');
    //    }else if(type == 2){
    //        $('.groupUl').show().empty().append('<li>水文站</li>'+
    //            '<li>测量队</li>');
    //    }else if(type == 3){
    //        $('.groupUl').show().empty().append('<li>水文站</li>');
    //    }
    //
    //    $('.groupUl li').click(function(){
    //        if($(this).hasClass('active')){
    //            $(this).removeClass('active');
    //        }else{
    //            $(this).addClass('active');
    //        }
    //    });
    //});



    //批量删除弹框
    $('#batchRemoveBtn').click(function(){
        var checkedNum = $(".tableWrap input[class='regular-checkbox checkPart']:checked").length;
        var ids = "";
        var idArr = [];
        $('.checkPart').each(function(){
            if($(this).is(":checked")){
                ids += $(this).attr('id')+"/";
                idArr.push($(this).attr('id'))
            }
        });
        console.log(ids);
        console.log(idArr);
        console.log(checkedNum);
        if(checkedNum > 0){
            parent.$.confirmWin({
                width:460,
                height:170,
                title:"移除提示",
                text:"<div class='delIcon'></div>"+
                "<div class='delWrap'><div class='delTitle'><b>您已选中<span>"+checkedNum+"个用户</span>,确定<span>删除</span>选中用户吗？</b></div>"+
                "<div class='delContent'>删除后，用户将不在本分组内显示</div></div>",
                btnVal:"确定",
                submitFn:function(){
                    $.ajax({
                        url:baseUrl+"/NoteUser/batchDeleteUser.do",
                        data:{ids:ids},
                        dataType:"Json",
                        type:"post",
                        success:function(result){
                            console.log(result);
                            if(result.data > 0){
                                for(var i = 0; i < idArr.length; i++){
                                    $('#'+idArr[i]).parent().parent().remove();
                                }
                            }
                            $.toast({
                                text: '删除成功!',
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
        }
    });


    $('.tableWrap').height($(window).outerHeight() - $('.title').outerHeight() - $('.conditionType').outerHeight());



    //加滚动条
    $(".fixHeaderTable_mainTableWrap").mCustomScrollbar({
        scrollButtons:{enable:true},
        theme:"inset-2-dark",
        axis:"y",
        autoHideScrollbar:true,
        setLeft:0,
        mouseWheel:true
    });

    //全选
    $('#checkbox-0').click(function(){
        if(this.checked){
            $('.tableWrap tbody input').prop('checked',true);
        }else{
            $('.tableWrap tbody input').prop('checked',false);
        }
    });

    //peopleInfoShow();

    // 点击之外的区域，用户信息框收回
    //$("body").bind("click", function (event) {
    //    if ($(event.target).parent('td').length == 0) {
    //        $('.peopleInfo').animate({"right":-500},500);
    //    }
    //});
    //
    //$(".peopleInfo").click(function(e) {
    //    e.stopPropagation();
    //});

    //点击用户信息框左上角的返回按钮，收回信息框
    $('#backBtn').click(function(){
        $('.peopleInfo').animate({"right":-500},500);
    });

    // 菜单浮动提示
    $('#backBtn').add($('#editBtn')).add($('#delBtn')).mousemove(function(e){
        var $this = $(this);
        tipsShow($this,e);
    });

    // 菜单浮动提示消失
    $('#backBtn').add($('#editBtn')).add($('#delBtn')).mouseout(function(){
        $(this).find('.tip').hide();
    });

    //添加新用户弹框
    $('#importUserBtn').click(function(){
        addNewUserShow();
    });

    //点击弹出人员信息页面的删除按钮，删除当页人员信息
    $('#delBtn').click(function(){
        $('#pName').add($('.positionUl')).empty();
        $('.infoListUl li').find('.select_box > div').empty();
        $('#personName').add($('#mobile')).add($('#unit')).add($('#department')).add($('#position')).add($('#tel')).add($('#address')).add($('#concernSite')).add($('#warnSite')).prop('value','');

    });


    //点击添加新用户弹框右上角的"X",弹框关闭
    $('#shutbtn').click(function(){
        $('.modelbg').hide();
        $('#addNewUserPopup').hide();
    });


    initUserInfo();

    $('#searchBtn').click(function(){
        var searchCont = $('#searchIpt').val();
        var regionName = regionSelect.getText();
        var arrayObj = new Array();
        if(regionName == "所有地区"){
            if(searchCont == ""){
                arrayObj = userInfoMap;
            }else{
                for(var i = 0; i < userInfoMap.length; i++){
                    var name = userInfoMap[i].LinkName;
                    var Mobile = userInfoMap[i].Mobile;
                    var Organization = userInfoMap[i].Organization;
                    var Department = userInfoMap[i].Organization;
                    var JobTitle = userInfoMap[i].JobTitle;
                    if(name.indexOf(searchCont.trim())>=0 || Mobile.indexOf(searchCont.trim())>=0 || Organization.indexOf(searchCont.trim())>=0 || Department.indexOf(searchCont.trim())>=0 || JobTitle.indexOf(searchCont.trim())>=0){
                        arrayObj.push(userInfoMap[i]);
                    }
                }
            }
        }else{
            var zoneObj = new Array();
            for(var i = 0; i < userInfoMap.length; i++){
                if(regionName == userInfoMap[i].ADDVNM){
                    zoneObj.push(userInfoMap[i]);
                }
            }
            if(searchCont == ""){
                arrayObj = zoneObj;
            }else{
                for(var j = 0; j < zoneObj.length; j++){
                    var name = zoneObj[j].LinkName;
                    var Mobile = zoneObj[j].Mobile;
                    var Organization = zoneObj[j].Organization;
                    var Department = zoneObj[j].Organization;
                    var JobTitle = zoneObj[j].JobTitle;
                    if(name.indexOf(searchCont.trim())>=0 || Mobile.indexOf(searchCont.trim())>=0 || Organization.indexOf(searchCont.trim())>=0 || Department.indexOf(searchCont.trim())>=0 || JobTitle.indexOf(searchCont.trim())>=0){
                        arrayObj.push(zoneObj[j]);
                    }
                }
            }
        }
        var content = "";
        for(var i = 0; i < arrayObj.length; i++){
            var unit = arrayObj[i].Organization;
            var department = arrayObj[i].Department;
            if(unit == ""){
                unit="其他";
            }
            if(department == ""){
                department = "其他";
            }
            content += '<tr userID="'+arrayObj[i].UserID+'">'+
                '<td><input type="checkbox" class="regular-checkbox checkPart" id="'+arrayObj[i].UserID+'"><label for="'+arrayObj[i].UserID+'"></label></td>'+
                '<td>'+arrayObj[i].ADDVNM+'</td>'+
                '<td>'+arrayObj[i].LinkName+'</td>'+
                '<td>'+arrayObj[i].Mobile+'</td>'+
                '<td>'+unit+"-"+department+'</td>'+
                '<td>'+arrayObj[i].JobTitle+'</td>'+
                '<td>'+arrayObj[i].userToStation+'</td>'+
                '<td><div class="operDiv"></div></td>'+
                '</tr>';
        }
        var userInfoTB = $("#userInfo").empty();
        userInfoTB.append(content);
        //切头   赋宽度
        $(".tableWrap table").fixHeaderTable({
            colsWidth:["5%","10%","10%","10%","10%","15%","30%","10%"],
            height:$(".tableWrap").height() - 1,
            colsDataType:["string","string","string","date","number","string"],
            colsCanSort:[false,false,false,false,false,false],
            colsContentType:["","text","text","date","input",""]
        });
        operDivClick();
    });

    $('#saveBtn').click(function(){
        var LinkName = $('#personName').val();
        var Gender = sexSelect.getValue();
        var ADDVCD = zoneSelect.getValue();
        var ADDVNM = zoneSelect.getText();
        var Mobile = $('#mobile').val();
        var JobTitle = $('#position').val();
        var Organization = $('#unit').val();
        var Department = $('#department').val();
        var Tel = $('#tel').val();
        var Address = $('#address').val();
        var Memo = "";
        var UserID = $('#saveBtn').attr("userId");
        var reg = /^1[34578]\d{9}$/;
        if(!reg.test(Mobile.trim())){
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
        }
        if(LinkName.trim() == ""){
            $.toast({
                text: '姓名不能为空!',
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
        $.ajax({
            url: baseUrl + "/NoteUser/selectNoteUserByTelphone.do",
            type: "Post",
            data: {
                Mobile: Mobile
            },
            success: function (result) {
                console.log(result);
                if(result.data == null || result.data.userID == UserID){
                    $.ajax({
                        url: baseUrl + "/NoteUser/updateUser.do",
                        type: "Post",
                        data: {
                            UserID: UserID,
                            ADDVCD:ADDVCD,
                            ADDVNM:ADDVNM,
                            LinkName:LinkName,
                            Gender:Gender,
                            Mobile:Mobile,
                            Organization:Organization,
                            Department:Department,
                            JobTitle:JobTitle,
                            Address:Address,
                            Tel:Tel,
                            Memo:Memo
                        },
                        success: function (result) {
                            console.log(result);
                            if(result.state == 0){
                                $.toast({
                                    text: '信息修改成功!',
                                    icon: 'info',
                                    position: "mid-center",
                                    stack: false,
                                    allowToastClose: false,
                                    loader: false,
                                    bgColor: "#3bb9d4",
                                    textColor: "#fff"
                                });
                                $('.peopleInfo').animate({"right":-500},500);
                                initUserInfo();
                            }
                        }
                    });
                }else{
                    $.toast({
                        text: '该号码已存在!',
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
    });

});

var initUserInfo = function(){

    $.ajax({
        url: baseUrl + "/NoteUser/selectAllUserInfo.do",
        type: "get",
        success: function (result) {
            console.log(result);
            var userInfoTB = $("#userInfo").empty();
            var content = "";
            var userInfo = result.data;
            userInfoMap = userInfo;
            for(var i = 0; i < userInfo.length; i++){
                userInfoArr[userInfo[i].UserID] = userInfo[i];
                var unit = userInfo[i].Organization;
                var department = userInfo[i].Department;
                if(unit == ""){
                    unit="其他";
                }
                if(department == ""){
                    department = "其他";
                }
                content += '<tr userID="'+userInfo[i].UserID+'">'+
                            '<td><input type="checkbox" class="regular-checkbox checkPart" id="'+userInfo[i].UserID+'"><label for="'+userInfo[i].UserID+'"></label></td>'+
                            '<td>'+userInfo[i].ADDVNM+'</td>'+
                            '<td>'+userInfo[i].LinkName+'</td>'+
                            '<td>'+userInfo[i].Mobile+'</td>'+
                            '<td>'+unit+"-"+department+'</td>'+
                            '<td>'+userInfo[i].JobTitle+'</td>'+
                            '<td>'+userInfo[i].userToStation+'</td>'+
                            '<td><div class="operDiv"></div></td>'+
                           '</tr>';
            }
            userInfoTB.append(content);
            //切头   赋宽度
            $(".tableWrap table").fixHeaderTable({
                colsWidth:["5%","10%","10%","10%","10%","15%","30%","10%"],
                height:$(".tableWrap").height() - 1,
                colsDataType:["string","string","string","number","string","string"],
                colsCanSort:[false,true,true,true,true,true,true],
                colsContentType:["","text","text","date","input",""]
            });
            operDivClick();
        }
    });

};

function addNewUserShow(){
    $('.modelbg').show();
    $('#addNewUserPopup').show();
}

function tipsShow($this,e){
    $this.find('.tip').show();
    var boxX = $this.offset().left;
    var boxY = $this.offset().top;
    var x = e.pageX;
    var y = e.pageY-40;
    var top = y - boxY;
    var left = x - boxX;
    if($(window).width() -  e.pageX < 96) left = -96;
    $('.tip').css({
        'top' : top + 'px',
        'left': left+ 'px'
    });
}

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

            regionSelect.change(function(){
                var regionName = regionSelect.getText();
                var arrayObj = new Array();
                if(regionName == "所有地区"){
                    arrayObj = userInfoMap;
                }else{
                    for(var i = 0; i < userInfoMap.length; i++){
                        if(regionName == userInfoMap[i].ADDVNM){
                            arrayObj.push(userInfoMap[i]);
                        }
                    }
                }
                var content = "";
                for(var i = 0; i < arrayObj.length; i++){
                    var unit = arrayObj[i].Organization;
                    var department = arrayObj[i].Department;
                    if(unit == ""){
                        unit="其他";
                    }
                    if(department == ""){
                        department = "其他";
                    }
                    content += '<tr userID="'+arrayObj[i].UserID+'">'+
                        '<td><input type="checkbox" class="regular-checkbox checkPart" id="'+arrayObj[i].UserID+'"><label for="'+arrayObj[i].UserID+'"></label></td>'+
                        '<td>'+arrayObj[i].ADDVNM+'</td>'+
                        '<td>'+arrayObj[i].LinkName+'</td>'+
                        '<td>'+arrayObj[i].Mobile+'</td>'+
                        '<td>'+unit+"-"+department+'</td>'+
                        '<td>'+arrayObj[i].JobTitle+'</td>'+
                        '<td>'+arrayObj[i].userToStation+'</td>'+
                        '<td><div class="operDiv"></div></td>'+
                        '</tr>';
                }
                var userInfoTB = $("#userInfo").empty();
                userInfoTB.append(content);
                //切头   赋宽度
                $(".tableWrap table").fixHeaderTable({
                    colsWidth:["5%","10%","10%","10%","10%","15%","30%","10%"],
                    height:$(".tableWrap").height() - 1,
                    colsDataType:["string","string","string","date","number","string"],
                    colsCanSort:[false,false,false,false,false,false],
                    colsContentType:["","text","text","date","input",""]
                });
                operDivClick();
            });
        }
    });
};

var getZoneSelect = function(){
    $.ajax({
        url: GTUrl + "comm/addvcd/getAddvcdChildersByFind.do",
        type: "Post",
        async:false,
        data: {
            addvcd: addvcd,
            rank:'d'
        },
        success: function (result) {
            console.log(result);
            var regionArr = result;
            var regionCus = $('#zoneSelect').empty();

            var content = '';
            for(var i = 0; i < regionArr.length; i++){
                content += '<option value="'+regionArr[i].addvcd+'">'+regionArr[i].addvnm+'</option>';
            }
            content += '<option value="">其他地区</option>';
            regionCus.append(content);
            // 地区选择框
            zoneSelect = $("#zoneSelect").customSelect({width:221,lineHeight:26});

        }
    });
};

var operDivClick = function(){
    //点击表格中的操作按钮，右侧滑出人员详细信息
    $('.operDiv').click(function(){
        var $this = $(this);
        var userId = $this.parent().parent().attr("userId");
        //peopleInfoShow($this);
        var userInfo = userInfoArr[userId];
        var userToStation = userInfo.userToStation;
        var userToStationArr = userToStation.split(";");
        var userToStationContent = "";
        for(var i=0; i<userToStationArr.length; i++){
            userToStationContent += '<li>'+userToStationArr[i]+'</li>';
        }
        $('.peopleInfo').animate({"right":0},500);
        var baseContent = '<b>'+userInfo.LinkName+'</b>(<span>'+userInfo.Mobile+'</span>)';
        $('#pName').empty().append(baseContent);
        $('.positionUl').empty().append(userToStationContent);
        $('#personName').val(userInfo.LinkName);
        sexSelect.setValue(userInfo.Gender);
        $('#mobile').val(userInfo.Mobile);
        var unit = userInfo.Organization;
        if(unit == "" || unit == null){
            unit = "其他";
        }
        var Department = userInfo.Department;
        if(Department == "" || Department == null){
            Department = "其他";
        }
        var position = userInfo.JobTitle;
        if(position == "" || position == null){
            position = "其他";
        }
        $('#unit').val(unit);
        $('#department').val(Department);
        $('#position').val(position);
        $('#tel').val(userInfo.Tel);
        $('#address').val(userInfo.Address);
        $('#concernSite').val(userInfo.STCD_Interest);
        $('#warnSite').val(userInfo.STCD_Warn);
        zoneSelect.setValue(userInfo.ADDVCD);
        $('#saveBtn').attr("userId",userId);
    });
};

function showToastAddNewUser(){
    $.toast({
        text: '添加新成员成功!',
        icon: 'info',
        position: 'mid-center',
        stack: false,
        allowToastClose: false,
        loader: false,
        bgColor: "#3bb9d4"
    });
}

//添加新用户
var addUserToP = function(){
    //document.location.reload();
    initUserInfo();
};

//var editContent = function(){
//    //点击弹出人员信息页面的编辑按钮，可编辑人员信息,再次点击不可编辑
//    var isEdit = false;
//    $('#editBtn').click(function(){
//        if(!isEdit){
//            $('#personName').add($('#mobile')).add($('#unit')).add($('#department')).add($('#position')).add($('#tel')).add($('#address')).add($('#concernSite')).add($('#warnSite')).prop('readonly',false);
//            $('.infoListUl').find('.select_box').remove();
//            $("#sexSelect").customSelect({width:221,lineHeight:26,enabled:true});
//            $("#zoneSelect").customSelect({width:221,lineHeight:26,enabled:true});
//            console.log($(this));
//            //zoneSelect.setValue(userInfo.ADDVCD);
//            //$("#streetSelect").customSelect({width:221,lineHeight:26,enabled:true});
//            isEdit = true;
//            console.log(11);
//
//        }else{
//            $('#personName').add($('#mobile')).add($('#unit')).add($('#department')).add($('#position')).add($('#tel')).add($('#address')).add($('#concernSite')).add($('#warnSite')).prop('readonly',true);
//            $('.infoListUl').find('.select_box').remove();
//            $("#sexSelect").customSelect({width:221,lineHeight:26,enabled:false});
//            $("#zoneSelect").customSelect({width:221,lineHeight:26,enabled:false});
//            console.log($(this));
//            //$("#streetSelect").customSelect({width:221,lineHeight:26,enabled:false});
//            isEdit = false;
//            console.log(22);
//        }
//    });
//};