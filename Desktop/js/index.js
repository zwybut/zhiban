                               /**
 * Created by king on 2016-11-18.
 */

var dhxLayout;
var CurModel = "floodAnalyzeShow"; // 当前所在模块

$(function(){
   // 导航切换
   
    $(".header_three .nav li").click(function(){
    	$(".header_three .nav li.active").removeClass("active");
        $(this).addClass("active");
    	var index = $(this).index();
    });


    //用户注销下拉菜单
    var show=true;
    $('#hst').click(function(){
        if(!show){
            $(this).css('background-image','url(../images/icon_down.png)');
            show =true;
        }else {
            $(this).css('background-image','url(../images/icon_up.png)');
            show =false;
        }
        $('.loginDiv').slideToggle();
    });
    // 点击之外的区域，用户框隐藏
    $("body").bind("click", function (event) {
        if ($(event.target).parent('.header_four').length == 0) {
            $('#hst').css('background-image','url(../images/icon_down.png)');
            show =true;
            $('.loginDiv').hide();
        }
    });

    //点击删除弹出提示框的"删除"按钮，删除对应的所有站点
    $('.rws1').click(function(){
        //console.log('abcd');

    });

    //点击删除弹出提示框右上角的"X"，遮罩图层和删除弹出框消失
    $('.cancleIcon').click(function(){
        $('.removeBg').hide();
        $('.removeWarn').hide();
    });


    dhxLayout = new dhtmlXLayoutObject("mainBody", "1C");
    dhxLayout.cells("a").hideHeader();

    //progressOn();
    dhxLayout.cells("a").attachURL("floodAnalyzeShow.html");


    //var name = $.cookie('name');
    //$('#hst').text(name);
    //$('.u_login,.u_logout').click(function(){
    //    logout();
    //});

});

function logout(){
   $.post(baseUrl+"login.do",{method:"logout"},function(jsondata){
       if(jsondata.code=="1"){
           window.location.href="login.html";
       }
   },"json");
};


// 显示模块载入图标
function progressOn() {
    dhxLayout.cells("a").progressOn();

}

// 隐藏模块载入图标
function progressOff() {
    dhxLayout.cells("a").progressOff();
}


// 水情报表生成
function floodAnalyzeShow(){

    if (CurModel == "floodAnalyzeShow") return;
    else {
        //progressOn();
        dhxLayout.cells("a").attachURL("floodAnalyzeShow.html");
        CurModel = "floodAnalyzeShow";
    }
}

// 短信平台
function messageSendSysShow(){

   if (CurModel == "index") return;
   else {
       //progressOn();
       dhxLayout.cells("a").attachURL("messageSendSysShow/index.html");
       CurModel = "index";
   }
}

// 值班管理
function personDutySysShow(){

   if (CurModel == "personnelSchedule1") return;
   else {
       //progressOn();
       dhxLayout.cells("a").attachURL("personnelSchedule1.html");
       CurModel = "personnelSchedule1";
   }
}

// 库容曲线查询
function rsvCurveQueryShow(){

    if (CurModel == "rsvCurveQueryShow") return;
    else {
        //progressOn();
        dhxLayout.cells("a").attachURL("rsvCurveQueryShow.html");
        CurModel = "rsvCurveQueryShow";
    }
}

// 水库水位估报
function rsvLevelForecastShow(){

   if (CurModel == "rsvLevelForecastShow") return;
   else {
       //progressOn();
       dhxLayout.cells("a").attachURL("rsvLevelForecastShow.html");
       CurModel = "rsvLevelForecastShow";
   }
}

// 预报成果查询
function forecastResultsShow(){

   if (CurModel == "forecastResultsShow") return;
   else {
       //progressOn();
       dhxLayout.cells("a").attachURL("forecastResultsShow.html");
       CurModel = "forecastResultsShow";
   }
}

// 等值面绘制
function contourMapDraw(){

   if (CurModel == "contourMapDraw") return;
   else {
       //progressOn();
       dhxLayout.cells("a").attachURL("contourMapDraw.html");
       CurModel = "contourMapDraw";
   }
}

// 后台管理
function backStageManageShow(){

   if (CurModel == "backStageManageShow") return;
   else {
       //progressOn();
       dhxLayout.cells("a").attachURL("backStageManageShow/backStageManageShow.html");
       CurModel = "backStageManageShow";
   }
}




//显示删除遮罩图层和删除弹出框
function ShowRemoveWarnWin1()
{
    $('.removeBg').show();
    $('.removeWarn').show();
    $('.removeWarnContent span').html('雨量根据站');
    $('.removeWarnContent span').css('color','#389bff');
}

function ShowRemoveWarnWin2()
{
    $('.removeBg').show();
    $('.removeWarn').show();
    $('.removeWarnContent span').html('水位控制站');
    $('.removeWarnContent span').css('color','#389bff');
}
