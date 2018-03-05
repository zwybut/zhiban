/**
 * Created by Dell on 2017/6/23.
 */

var modelMessageList = {};
var selId = "";
$(function(){

    //tab切换
    $('.templateContent').eq(0).show();

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

    //鼠标悬浮在消息内容上，字体和背景颜色变化
    $('.wrap ul li').click(function(){
        $('.wrap ul li.active').removeClass('active');
        $(this).addClass('active');
    });

    $('#cancelBtn').click(function(){
        parent.hideTemplateBox();
    });

    // 选择框
    var typeSelect = $("#typeSelect").customSelect({width:100,lineHeight:28});

    initModel();

});

var initModel = function(){
    $.ajax({
        url: baseUrl+"/NoteTemplate/selectAllNoteTemplate.do",
        dataType:"Json",
        type:"get",
        success: function (result) {
            var modelArr = result.data;
            var ul = $('#modelMessage').empty();
            var content = "";
            for(var i = 0; i < modelArr.length; i++){
                modelMessageList[modelArr[i].id] = modelArr[i].Content;
                if(i == 0){
                    content += '<li class="active" id="'+modelArr[i].id+'">'+
                        '<div>'+modelArr[i].Name+'</div>'+
                        '<div>'+modelArr[i].Content+'</div>'+
                        '</li>';
                }else{
                    content += '<li id="'+modelArr[i].id+'">'+
                        '<div>'+modelArr[i].Name+'</div>'+
                        '<div>'+modelArr[i].Content+'</div>'+
                        '</li>';
                }

            }
            ul.append(content);
            $('#modelMessage li').click(function(){
                selId = $(this).attr("id");
                var messageConten = modelMessageList[selId];
                var index = $('#modelMessage li').index(this);
                $('#modelMessage li.active').removeClass('active');
                $(this).addClass('active');
                $('#addUserBtn').attr('listid',messageConten)
            });
            $('#modelMessage li').eq(0).trigger('click');
        }
    })



};
