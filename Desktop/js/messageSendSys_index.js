/**
 * Created by Dell on 2017/6/23.
 */

var dhxLayout;
var CurModel = "messageSend"; // 当前所在模块

$(function(){

    //用户注销下拉菜单
    $('.userName').click(function(){
        $('.slideDiv').slideToggle();
    });

    // 点击之外的区域，用户框隐藏
    $("body").bind("click", function (event) {
        if ($(event.target).parent('.loginDiv').length == 0) {
            $('.slideDiv').slideUp();
        }
    });

    //左侧导航栏选中
    $('.nav_left ul li').click(function(){
        $('.nav_left ul li').find('.mes_icon').removeClass('active');
        $(this).find('.mes_icon').addClass('active');
    });

    // 用于菜单的浮动提示
    $('.nav_left li').mousemove(function(e){
        var index=$('.nav_left li').index(this);
        $('.tip').eq(index).show();

        var boxX=$(this).offset().left;
        var boxY=$(this).offset().top;
        var x = e.pageX+20;
        var y = e.pageY;
        if($(this).height()-(e.pageY-boxY)<25) y = e.pageY-25;
        var top=y-boxY;
        var left=x-boxX;
        $('.tip').eq(index).css({
            'top' : top + 'px',
            'left': left+ 'px'
        });
    });

    // 鼠标移出，菜单的浮动提示消失
    $('.nav_left li').mouseout(function(){
        $('.tip').hide();
    });

    //点击添加新用户弹框右上角的"X",弹框关闭
    $('#closeBtn').click(function(){
        $('.modelbg').hide();
        $('#newUserPopup').hide();
    });

    //点击单独修改弹框右上角的"X",弹框关闭
    $('#closeUpBtn').click(function(){
        $('.modelbg').hide();
        $('#singleRewritePopup').hide();
    });

    //点击添加新模板弹框右上角的"X",弹框关闭
    $('#shutBtn').click(function(){
        $('.modelbg').hide();
        $('#newTemplatePopup').hide();
    });



    dhxLayout = new dhtmlXLayoutObject("mainBody", "1C");
    dhxLayout.cells("a").hideHeader();

    progressOn();
    dhxLayout.cells("a").attachURL("messageSend.html");

    dhxLayout.attachEvent("onContentLoaded", function (id) {
        progressOff();
    });

});
function selectShow(){
    regionSelect1 = $("#regionSelect1").customSelect({width:165,lineHeight:26});
}
function scrollShow(){
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
}


function newTemplateBoxShow(){
    $('.modelbg').show();
    $('#newTemplatePopup').show();
}

function hideTemplateBox(){
    $('.modelbg').hide();
    $('#newTemplatePopup').hide();
}

// 显示模块载入图标
function progressOn() {
    dhxLayout.cells("a").progressOn();
}

// 隐藏模块载入图标
function progressOff() {
    dhxLayout.cells("a").progressOff();
}

// 短信报送
function messageSendShow(){
    if (CurModel == "messageSend") return;
    else {
        progressOn();
        dhxLayout.cells("a").attachURL("messageSend.html");
        CurModel = "messageSend";
    }
}

// 定时发送
function timedSendShow(){
    if (CurModel == "timedSend") return;
    else {
        progressOn();
        dhxLayout.cells("a").attachURL("timedSend.html");
        CurModel = "timedSend";
    }
}

// 历史消息
function historyMessageShow(){
    if (CurModel == "historyMessage") return;
    else {
        progressOn();
        dhxLayout.cells("a").attachURL("historyMessage.html");
        CurModel = "historyMessage";
    }
}

// 人员分组
function personGroupShow(){
    if (CurModel == "personGroup") return;
    else {
        progressOn();
        dhxLayout.cells("a").attachURL("personGroup.html");
        CurModel = "personGroup";
    }
}

// 人员管理
function personManageShow(){
    if (CurModel == "personManage") return;
    else {
        progressOn();
        dhxLayout.cells("a").attachURL("personManage.html");
        CurModel = "personManage";
    }
}

// 通讯录管理
function mailListManageShow(){
    if (CurModel == "mailListManage") return;
    else {
        progressOn();
        dhxLayout.cells("a").attachURL("mailListManage.html");
        CurModel = "mailListManage";
    }
}

// 模板消息
function templateMessageShow(){
    if (CurModel == "templateMessage") return;
    else {
        progressOn();
        dhxLayout.cells("a").attachURL("templateMessage.html");
        CurModel = "templateMessage";
    }
}

// 报警短信管理
function resultMessagesShow(){
    if (CurModel == "resultMessages") return;
    else {
        progressOn();
        dhxLayout.cells("a").attachURL("resultMessages.html");
        CurModel = "resultMessages";
    }
}

// 预警短信配置
function SMSconfigShow(){
    if (CurModel == "SMSconfig") return;
    else {
        progressOn();
        dhxLayout.cells("a").attachURL("SMSconfig.html");
        CurModel = "SMSconfig";
    }
}

// 预警预警参数配置
function warnParamSetShow(){
    if (CurModel == "warnParamSet") return;
    else {
        progressOn();
        dhxLayout.cells("a").attachURL("warnParamSet.html");
        CurModel = "warnParamSet";
    }
}

var addMessageModel = function(){

};