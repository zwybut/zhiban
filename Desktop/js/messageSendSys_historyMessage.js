/**
 * Created by Dell on 2017/6/23.
 */

$(function(){

    //消息内容的高度
    $('.wrap').height($(window).height() - $('.title').outerHeight() - $('.timeSet').outerHeight() -14*2 - $('.listTitle').outerHeight());

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

    $('#startTime').datetimebox('setValue',new Date().DateAdd("day",-30).Format("yyyy-MM-dd 08:00"));
    $('#endTime').datetimebox('setValue',new Date().Format("yyyy-MM-dd hh:mm"));

    $('#searchBtn').click(function(){
        var startTime = $('#startTime').datetimebox('getValue');
        var endTime = $('#endTime').datetimebox('getValue');
        var content = $('#searchIpt').val();
        var telReg = /^[0-9]{0,13}$/;
        var nameReg = /^[\u4E00-\u9FA5]{1,4}$/;
        var telphone = "";
        var userName = "";
        if(telReg.test(content)){
            telphone = content;
        }else if(nameReg.test(content)){
            userName = content;
        }
        $.ajax({
            url: baseUrl+"/Note/selectNotesByContition.do",
            data:{telphone:telphone,
                userName:userName,
                startTime:startTime,
                endTime:endTime
            },
            success: function (result) {
                var noteList = result.data;
                console.log(noteList);
                var noteDiv = $('.listContent').empty();
                var content = "";
                if(noteList.length == 0 && noteList == null){
                    var span ='<span id="notice">暂无数据！</span>';
                    noteDiv.append(span);
                }else{
                    for(var i = 0 ; i < noteList.length; i++){
                        var sendState = noteList[i].sendState;
                        var sendType = noteList[i].sendType;
                        if(sendState == "1"){
                            sendState = "已发送";
                        }else{
                            sendState = "未发送";
                        }
                        if(sendType == "1"){
                            sendType = "即时发送";
                        }else{
                            sendType = "定时发送";
                        }
                        content += '<li>'+
                            '<div>'+new Date(noteList[i].acceptTime).Format("yyyy-MM-dd hh:mm")+'</div>'+
                            '<div>系统发送</div>'+
                            '<div>'+noteList[i].userName+'</div>'+
                            '<div>'+noteList[i].telphone+'</div>'+
                            '<div>'+sendState+'</div>'+
                            '<div>'+sendType+'</div>'+
                            '<div>'+noteList[i].noteContent+'</div>'+
                            '</li>';
                    }
                    noteDiv.append(content);
                }
            }
        });
    });

    initHistoryMessage();

});

var initHistoryMessage = function(){
    var startTime = $('#startTime').datetimebox('getValue');
    var endTime = $('#endTime').datetimebox('getValue');
    $.ajax({
        url: baseUrl+"/Note/selectAllNoteByTime.do",
        data:{startTime:startTime,
            endTime:endTime
        },
        success: function (result) {
            var noteList = result.data;
            console.log(noteList);
            var noteDiv = $('.listContent').empty();
            var content = "";
            if(noteList.length == 0 && noteList == null){
                var span ='<span id="notice">暂无数据！</span>';
                noteDiv.append(span);
            }else{
                for(var i = 0 ; i < noteList.length; i++){
                    var sendState = noteList[i].sendState;
                    var sendType = noteList[i].sendType;
                    if(sendState == "1"){
                        sendState = "已发送";
                    }else{
                        sendState = "已发送至短信库";
                    }
                    if(sendType == "1"){
                        sendType = "即时发送";
                    }else{
                        sendType = "定时发送";
                    }
                    content += '<li>'+
                        '<div>'+new Date(noteList[i].acceptTime).Format("yyyy-MM-dd hh:mm")+'</div>'+
                        '<div>系统发送</div>'+
                        '<div>'+noteList[i].userName+'</div>'+
                        '<div>'+noteList[i].telphone+'</div>'+
                        '<div>'+sendState+'</div>'+
                        '<div>'+sendType+'</div>'+
                        '<div>'+noteList[i].noteContent+'</div>'+
                        '</li>';
                }
                noteDiv.append(content);
            }
        }
    });
};












