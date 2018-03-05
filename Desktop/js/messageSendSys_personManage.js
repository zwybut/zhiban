/**
 * Created by Dell on 2017/3/29.
 */

var userInfo = {};
var regionSelect;
var regionSelect1;
$(function(){
    // 地区选择框
    getRegionSelect();
    //单位选择框
    getUnitSelect();
    //组内人员内容wrap的高度
    $('.wrap').height($(window).outerHeight() - $('.title').outerHeight() - $('.operDiv').outerHeight() - $('.listTitle').outerHeight());

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
                idArr.push($(this).attr('id'))
            }
        });
        parent.$.confirmWin({
            width:460,
            height:170,
            title:"移除提示",
            text:"<div class='delIcon'></div>"+
            "<div class='delWrap'><div class='delTitle'><b>您已选中<span>"+idArr.length+"个用户</span>,确定<span>移除</span>选中用户吗？</b></div>"+
            "<div class='delContent'>移除后，用户将不在本分组内显示</div></div>",
            btnVal:"确定",
            submitFn:function(){
                $.ajax({
                    url:baseUrl+"/NoteUser/batchDeleteUser.do",
                    data:{ids:ids},
                    dataType:"Json",
                    type:"post",
                    success:function(result){
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
    });

    $('#searchBtn').click(function(){
        var searchCont = $('#searchIpt').val();
        var regionName = regionSelect.getText();
        if(regionName == "所有地区"){
            regionName = "";
        }
        $.ajax({
            url:baseUrl+"/NoteUser/selectUserByContition.do",
            data:{
                searchCont:searchCont,
                regionName:regionName
            },
            dataType:"Json",
            type:"get",
            success:function(result){
                var userArr = result.data;
                console.log(userArr);
                $(".listContent").empty();
                var userContent = "";
                for(var i = 0; i < userArr.length; i++){
                    var unit = userArr[i].Organization;
                    if(unit == ""){
                        unit = "其他";
                    }
                    var statement = userArr[i].Department;
                    if(statement == ""){
                        statement = "其他";
                    }
                    userInfo[userArr[i].UserID] = userArr[i];
                    userContent += '<li aid="'+userArr[i].UserID+'">'+
                        '<div><input type="checkbox" class="regular-checkbox checkPart" id="'+userArr[i].UserID+'"><label for="'+userArr[i].UserID+'"></label></div>'+
                        '<div class="zone">'+userArr[i].ADDVNM+'</div>'+
                        '<div class="company">'+unit+'</div>'+
                        '<div class="userId">'+userArr[i].LinkName+'</div>'+
                        '<div class="mobileNum">'+userArr[i].Mobile+'</div>'+
                        '<div class="department">'+statement+'</div>'+
                        '<div class="positionName">'+userArr[i].JobTitle+'</div>'+
                        '<div>'+
                        '<div class="operBox">'+
                        '<div class="editBtn"></div>'+
                        '<div class="delBtn"></div>'+
                        '</div>'+
                        '</div>'+
                        '</li>';
                }
                $(".listContent").append(userContent);
                editInfo();
                deleteInfo();
            }
        });
    });

    //添加新用户提示框
    $('#importUserBtn').click(function(){
        newUserBoxShow();
    });

    initNoteUser();


    //点击添加新用户弹框右上角的"X",弹框关闭
    $('#closeBtn').click(function(){
        $('.modelbg').hide();
        $('#newUserPopup').hide();
    });

    //点击修改用户弹框右上角的"X",弹框关闭
    $('#singleRewritePopup').on('click','#closeUpBtn',function(){
        $('.modelbg').hide();
        $('#singleRewritePopup').hide();
    });


});
function newUserBoxShow(){
    $('.modelbg').show();
    $('#newUserPopup').show();
}

//初始化用户
function initNoteUser(){
    $.ajax({
        url:baseUrl+"/NoteUser/selectAllUser.do",
        dataType:"Json",
        type:"get",
        success:function(result){
            var userArr = result.data;
            console.log(userArr);
            $(".listContent").empty();
            var userContent = "";
            for(var i = 0; i < userArr.length; i++){
                userInfo[userArr[i].UserID] = userArr[i];
                var unit = userArr[i].Organization;
                if(unit == ""){
                    unit = "其他";
                }
                var statement = userArr[i].Department;
                if(statement == ""){
                    statement = "其他";
                }
                var position = userArr[i].JobTitle;
                if(position == "" || position == null){
                    position = "其他";
                }
                var addvnm = userArr[i].ADDVNM;
                if(addvnm == "" || addvnm == null || addvnm == undefined){
                    addvnm = "其他";
                }
                userContent += '<li aid="'+userArr[i].UserID+'">'+
                    '<div><input type="checkbox" class="regular-checkbox checkPart" id="'+userArr[i].UserID+'"><label for="'+userArr[i].UserID+'"></label></div>'+
                    '<div class="zone">'+addvnm+'</div>'+
                    '<div class="company">'+unit+'</div>'+
                    '<div class="userId">'+userArr[i].LinkName+'</div>'+
                    '<div class="mobileNum">'+userArr[i].Mobile+'</div>'+
                    '<div class="department">'+statement+'</div>'+
                    '<div class="positionName">'+position+'</div>'+
                    '<div>'+
                    '<div class="operBox">'+
                    '<div class="editBtn"></div>'+
                    '<div class="delBtn"></div>'+
                    '</div>'+
                    '</div>'+
                    '</li>';
            }
            $(".listContent").append(userContent);
            editInfo();
            deleteInfo();
        }
    });
}
//单个修改提示框
var editInfo = function(){
    $('.editBtn').each(function(){
        $(this).click(function(){
            var _this = $(this);
            var aid = $(this).parent().parent().parent().attr("aid");
            singleReBoxShow(aid);
        });
    });
};

//修改用户信息
var updateUser = function(AID,Zone,LinkName,Mobile,Position,Gender,Job,Unit,Statement,Tel,Address,Memo){
    //document.location.reload();
    var thisUser = $("li[aid='" + AID + "']");
    thisUser.find('.userId').text(LinkName);
    thisUser.find('.mobileNum').text(Mobile);
    var position = Position;
    if(position == "" || position == null){
        position = "其他"
    }
    thisUser.find('.positionName').text(position);
    thisUser.find('.zone').text(Zone);
    thisUser.find('.company').text(Unit);
    thisUser.find('.department').text(Statement);
    userInfo[AID].LinkName = LinkName;
    userInfo[AID].Mobile = Mobile;
    userInfo[AID].JobTitle = Position;
    userInfo[AID].ADDVNM = Zone;
    userInfo[AID].Gender = Gender;
    userInfo[AID].Job = Job;
    userInfo[AID].Organization = Unit;
    userInfo[AID].Department = Statement;
    userInfo[AID].Tel = Tel;
    userInfo[AID].Address = Address;
    userInfo[AID].Memo = Memo;
};

//单个移除提示框
var deleteInfo = function(){
    $('.delBtn').each(function(){
        var _this = $(this);
        $(this).click(function(){
            var uId = $(this).parent().parent().siblings('.userId').text();
            parent.$.confirmWin({
                width:460,
                height:170,
                title:"移除提示",
                text:"<div class='delIcon'></div>"+
                "<div class='delWrap'><div class='delTitle'><b>您已选中分组内用户<span>"+uId+"</span>,确定<span>移除</span>该用户吗？</b></div>"+
                "<div class='delContent'>移除后，用户将不在本分组内显示</div></div>",
                btnVal:"确定",
                submitFn:function(){
                    var AID = _this.parent().parent().parent().attr("aid");
                    $.ajax({
                        url:baseUrl+"/NoteUser/deleteUser.do",
                        data:{UserID:AID},
                        dataType:"Json",
                        type:"post",
                        success:function(result){
                            if(result.state == 0){
                                $.toast({
                                    text: '删除成功!',
                                    icon: 'info',
                                    position: 'mid-center',
                                    stack: false,
                                    allowToastClose: false,
                                    loader: false,
                                    bgColor: "#e97c75"
                                });
                                _this.parent().parent().parent().remove();
                            }
                        }
                    });
                }
            });
        });
    });
};
function singleReBoxShow(aid){
    var popupHtml = $('<iframe src="personManage_singleRewrite.html?aid='+aid+'" width="650px" height="460px" frameborder="0" id="singleRewriteHtml"></iframe> <div id="closeUpBtn"></div>');
    $('#singleRewritePopup').empty().append(popupHtml).show();
    $('.modelbg').show();
}

//添加新用户
var addUser = function(Zone,Unit,LinkName,Mobile,Statement,Position,AID,userObj){
    userInfo[AID] = userObj;
    var userContent = "";
    var unit = Unit;
    if(unit == "" || unit == null){
        unit = "其他";
    }
    var statement = Statement;
    if(statement == ""){
        statement = "其他";
    }
    var position = Position;
    if(position == ""){
        position = "其他";
    }
    userContent += '<li aid="'+AID+'">'+
        '<div><input type="checkbox" class="regular-checkbox checkPart" id="checkbox-1"><label for="checkbox-1"></label></div>'+
        '<div>'+Zone+'</div>'+
        '<div class="company">'+unit+'</div>'+
        '<div class="userId">'+LinkName+'</div>'+
        '<div class="mobileNum">'+Mobile+'</div>'+
        '<div class="department">'+statement+'</div>'+
        '<div class="positionName">'+position+'</div>'+
        '<div>'+
        '<div class="operBox">'+
        '<div class="editBtn"></div>'+
        '<div class="delBtn"></div>'+
        '</div>'+
        '</div>'+
        '</li>';
    $(".listContent").prepend(userContent);
    editInfo();
    deleteInfo();
};

function showToast(){
    $.toast({
        text: '保存成功!',
        icon: 'info',
        position: 'mid-center',
        stack: false,
        allowToastClose: false,
        loader: false,
        bgColor: "#3bb9d4"
    });
}

function showToast1(){
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

function updateToast(){
    $.toast({
        text: '修改成功!',
        icon: 'info',
        position: 'mid-center',
        stack: false,
        allowToastClose: false,
        loader: false,
        bgColor: "#3bb9d4"
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
                content += '<option value="'+regionArr[i].addvnm+'">'+regionArr[i].addvnm+'</option>';
            }
            content += '<option value="">其他地区</option>';
            content += '</select>';
            regionCus.append(content);
            // 地区选择框
            regionSelect = $("#regionSelect").customSelect({width:165,lineHeight:26});
            regionSelect1 = $("#regionSelect1").customSelect({width:165,lineHeight:26});
        }
    });
};

var getUnitSelect = function(){
    $.ajax({
        url: baseUrl + "/NoteUser/selectAllUser.do",
        type: "Post",
        success: function (result) {
            console.log(result);
            var regionArr = result.data;
            var unitArr = [];
            for(var i = 0; i < regionArr.length; i++){
                if(regionArr[i].Organization != ""){
                    unitArr.push(regionArr[i].Organization);
                }
            }
            var regionCus = $('.regionSelectDiv1').empty();
            var content = '<select id="regionSelect1">'+
                '<option value="所有单位" selected="selected">所有单位</option>';

            for(var j = 0; j < unitArr.length; j++){
                content += '<option value="'+unitArr[i]+'">'+unitArr[i]+'</option>';
            }
            content += '</select>';
            regionCus.append(content);
            // 单位选择框
            regionSelect1 = $("#regionSelect1").customSelect({width:165,lineHeight:26});
        }
    });
};





















