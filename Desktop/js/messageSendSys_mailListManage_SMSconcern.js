/**
 * Created by Dell on 2017/8/22.
 */
$(function(){


    //tab切换
    $('.siteTypeTab li').click(function(){
        var modeId = $(this).attr('modeId');
        $('.content').hide();
        $('#'+modeId).show();
       $(this).addClass('active').siblings().removeClass('active');
    });
    $('.siteTypeTab li').eq(0).trigger('click');

    //下拉框
    var zoneSelect = $("#zoneSelect").customSelect({width:98,lineHeight:26});
    var regionSelect = $("#regionSelect").customSelect({width:98,lineHeight:26});

    //滚动条样式js
    $(".allSiteContent").mCustomScrollbar({
        scrollButtons:{enable:true},
        theme:"inset-2-dark",
        axis:"y",
        autoHideScrollbar:true,
        setLeft:0,
        mouseWheel:true,
        callbacks:{

        }
    });

    $(".concernedSiteContent").mCustomScrollbar({
        scrollButtons:{enable:true},
        theme:"inset-2-dark",
        axis:"y",
        autoHideScrollbar:true,
        setLeft:0,
        mouseWheel:true,
        callbacks:{

        }
    });


    //关注站点全选
    $('#checkbox-1-all').click(function(){
       if(this.checked){
           $('.noticeSite li input').prop('checked',true);
       }else{
           $('.noticeSite li input').prop('checked',false);
       }
    });


    //预警站点全选
    $('#checkbox-2-all').click(function(){
        if(this.checked){
            $('.warnSite li input').prop('checked',true);
        }else{
            $('.warnSite li input').prop('checked',false);
        }
    });

    // 菜单浮动提示
    $('#delBtn').add($('#delBtn2')).mousemove(function(e){
        var $this = $(this);
        tipsShow($this,e);
    });

    // 菜单浮动提示消失
    $('#delBtn').add($('#delBtn2')).mouseout(function(){
        $(this).find('.tip').hide();
    });

    //点击删除已关注站点、预警站点
    $('#delBtn').add($('#delBtn2')).click(function(){
        var $this = $(this);
        delSite($this);
    });


    //上一步
    $('#prevBtn').click(function(){
        parent.$('#SMSconcernPopup').hide();
        parent.$('#addNewUserPopup').show();

    });

    //取消
    $('#cancelBtn').click(function(){
        parent.$('.modelbg').hide();
        parent.$('#SMSconcernPopup').hide();
    });




});

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

function delSite($this){
    $this.parent().siblings('.concernedSiteContent').find('li').remove();
}