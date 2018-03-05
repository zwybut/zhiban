/**
 * Created by Dell on 2017/3/29.
 */

var userInfo = {};
$(function(){

    // 地区选择框
    var regionSelect = $("#regionSelect").customSelect({width:165,lineHeight:26});

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
                    }
                });
            }
        });
    });

    $('#searchBtn').click(function(){
        var Mobile = $('#enterPosition').val();
        var LinkName = $('#searchIpt').val();
        console.log(Mobile);
        console.log(LinkName);
        $.ajax({
            url:baseUrl+"/NoteUser/selectUserByContition.do",
            data:{
                Mobile:Mobile,
                LinkName:LinkName
            },
            dataType:"Json",
            type:"get",
            success:function(result){
                var userArr = result.data;
                $(".listContent").empty();
                var userContent = "";
                for(var i = 0; i < userArr.length; i++){
                    userInfo[userArr[i].AID] = userArr[i];
                    userContent += '<li aid="'+userArr[i].AID+'">'+
                        '<div><input type="checkbox" class="regular-checkbox checkPart" id="'+userArr[i].AID+'"><label for="'+userArr[i].AID+'"></label></div>'+
                        '<div class="zone">'+userArr[i].Zone+'</div>'+
                        '<div class="userId">'+userArr[i].LinkName+'</div>'+
                        '<div class="mobileNum">'+userArr[i].Mobile+'</div>'+
                        '<div class="positionName">'+userArr[i].Position+'</div>'+
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
    $('#closeUpBtn').click(function(){
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
            $(".listContent").empty();
            var userContent = "";
            for(var i = 0; i < userArr.length; i++){
                userInfo[userArr[i].AID] = userArr[i];
                userContent += '<li aid="'+userArr[i].AID+'">'+
                    '<div class="zone">'+userArr[i].Zone+'</div>'+
                    '<div class="userId">'+userArr[i].LinkName+'</div>'+
                    '<div class="mobileNum">'+userArr[i].Mobile+'</div>'+
                    '<div class="positionName">'+userArr[i].Position+'</div>'+
                    '<div>'+
                    '<div class="operBox">'+
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
            var userId = userInfo[aid].LinkName;
            var gender = userInfo[aid].Gender;
            var zone = userInfo[aid].Zone;
            var street = userInfo[aid].Street;
            var mobileNum = userInfo[aid].Mobile;
            var positionName = userInfo[aid].Position;
            var job = userInfo[aid].Job;
            var unit = userInfo[aid].Unit;
            var statement = userInfo[aid].Statement;
            var tel = userInfo[aid].Tel;
            var address = userInfo[aid].Address;
            var memo = userInfo[aid].Memo;
            singleReBoxShow(userId,gender,zone,street,mobileNum,positionName,job,unit,statement,tel,address,memo,aid);
        });
    });
};

//修改用户信息
var updateUser = function(AID,Zone,LinkName,Mobile,Position,Gender,Street,Job,Unit,Statement,Tel,Address,Memo){
    var thisUser = $("li[aid='" + AID + "']");
    thisUser.find('.userId').text(LinkName);
    thisUser.find('.mobileNum').text(Mobile);
    thisUser.find('.positionName').text(Position);
    thisUser.find('.zone').text(Zone);
    userInfo[AID].LinkName = LinkName;
    userInfo[AID].Mobile = Mobile;
    userInfo[AID].Position = Position;
    userInfo[AID].Zone = Zone;
    userInfo[AID].Gender = Gender;
    userInfo[AID].Street = Street;
    userInfo[AID].Job = Job;
    userInfo[AID].Unit = Unit;
    userInfo[AID].Statement = Statement;
    userInfo[AID].Tel = Tel;
    userInfo[AID].Address = Address;
    userInfo[AID].Memo = Memo;
    editInfo();
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
                        data:{AID:AID},
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

function singleReBoxShow(userId,gender,zone,street,mobileNum,positionName,job,unit,statement,tel,address,memo,aid){
    $('.modelbg').show();
    $('#singleRewritePopup').show();
    $('#singleRewriteHtml').contents().find("#userId").val(userId);
    $('#singleRewriteHtml').contents().find("input[name='0'][value='"+gender+"']").attr("checked", true);//"+gender+"
    $('#singleRewriteHtml').contents().find("#regionSelect").val(zone);
    $('#singleRewriteHtml').contents().find("#streetSelect").val(street);
    $('#singleRewriteHtml').contents().find("#mobileNum").val(mobileNum);
    $('#singleRewriteHtml').contents().find("#positionName").val(positionName);
    $('#singleRewriteHtml').contents().find("#jobSelect").val(job);
    $('#singleRewriteHtml').contents().find("#unit").val(unit);
    $('#singleRewriteHtml').contents().find("#departmentSelect").val(statement);
    $('#singleRewriteHtml').contents().find("#tel").val(tel);
    $('#singleRewriteHtml').contents().find("#address").val(address);
    $('#singleRewriteHtml').contents().find("#memo").val(memo);
    $('#singleRewriteHtml').contents().find("#updateUserBtn").attr("aid",aid);
}

//添加新用户
var addUser = function(Zone,LinkName,Mobile,Position,AID,userObj){
    userInfo[AID] = userObj;
    var userContent = "";
    userContent += '<li aid="'+AID+'">'+
        '<div><input type="checkbox" class="regular-checkbox checkPart" id="checkbox-1"><label for="checkbox-1"></label></div>'+
        '<div>'+Zone+'</div>'+
        '<div class="userId">'+LinkName+'</div>'+
        '<div class="mobileNum">'+Mobile+'</div>'+
        '<div class="positionName">'+Position+'</div>'+
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
        bgColor: "#e97c75"
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
        bgColor: "#e97c75"
    });
}
