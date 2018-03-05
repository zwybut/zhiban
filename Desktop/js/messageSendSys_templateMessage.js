/**
 * Created by Dell on 2017/6/23.
 */

$(function(){

    //模板内容wrap的高度
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

    //添加新模板弹框
    $('#importUserBtn').click(function(){
        parent.$.confirmWin({
            width:650,
            height:280,
            title:"添加新模板",
            text:"<div class='modelTitle'>模板名称</div>"+
            "<div class='modelBox'><input type='text' placeholder='请输入消息名称' id='newModelName'></div>"+
            "<div class='modelTitle'>模板内容</div>"+
            "<textarea  id='newModelContent'></textarea>",
            btnVal:"确定",
            submitFn:function(){
                var Name = parent.$('#newModelName').val();
                var Content = parent.$('#newModelContent').val();
                $.ajax({
                    url:baseUrl+"/NoteTemplate/addNoteTemplate.do",
                    data:{Name:Name,
                        Content:Content},
                    dataType:"Json",
                    type:"post",
                    success:function(result){
                        console.log(result);
                        var id = result.data.id;
                        var name = result.data.name;
                        var content = result.data.content;
                        if(result.state == 0){
                            var li = '<li sid="'+id+'">'+
                                '<div><input type="checkbox" class="regular-checkbox checkPart" id="'+id+'"><label for="'+id+'"></label></div>'+
                                '<div class="modelName">'+name+'</div>'+
                                '<div class="modelContent">'+content+'</div>'+
                                '<div>'+
                                '<div class="operBox">'+
                                '<div class="editBtn"></div>'+
                                '<div class="delBtn"></div>'+
                                '</div>'+
                                '</div>'+
                                '</li>';

                            $('.listContent').prepend(li);
                        }
                    }
                });
            }
        });
    });

    //点击搜索刷新页面
    $('#searchBtn').click(function(){
        var Name = $('#searchIpt').val();
        $.ajax({
            url:baseUrl+"/NoteTemplate/selectAllNoteTemplateByTemplateName.do",
            data:{Name:Name},
            dataType:"Json",
            type:"post",
            success:function(result){
                if(result.state == 0){
                    var modelArr = result.data;
                    $('.listContent').empty();
                    var content = "";
                    for(var i = 0; i < modelArr.length; i++){
                        content += '<li sid="'+modelArr[i].id+'">'+
                            '<div><input type="checkbox" class="regular-checkbox checkPart" id="'+modelArr[i].id+'"><label for="'+modelArr[i].id+'"></label></div>'+
                            '<div class="modelName">'+modelArr[i].Name+'</div>'+
                            '<div class="modelContent">'+modelArr[i].Content+'</div>'+
                            '<div>'+
                            '<div class="operBox">'+
                            '<div class="editBtn"></div>'+
                            '<div class="delBtn"></div>'+
                            '</div>'+
                            '</div>'+
                            '</li>';
                    }
                    $('.listContent').append(content);
                }
            }
        });
    });


    //批量删除提示框
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
            title:"删除提示",
            text:"<div class='delIcon'></div>"+
            "<div class='delWrap'><div class='delTitle'><b>您已选中<span>"+idArr.length+"个模板</span>,确定<span>删除</span>选中模板吗？</b></div>"+
            "<div class='delContent'>删除后，模板将不在本分组内显示</div></div>",
            btnVal:"确定",
            submitFn:function(){
                $.ajax({
                    url:baseUrl+"/NoteTemplate/batchDeleteTemplate.do",
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
    initModel();

    //单个删除按钮
    $('.listContent').on('click','.delBtn',function(){
        var mName = $(this).parent().parent().siblings('.modelName').text();
        var id = $(this).parent().parent().parent().attr("sid");
        deleteModel(mName,id)
    });

    //编辑模板消息
    $('.listContent').on('click','.editBtn',function(){
        var id = $(this).parent().parent().parent().attr("sid");
        var mName = $(this).parent().parent().siblings('.modelName').text();
        var mContent = $(this).parent().parent().siblings('.modelContent').text();
        var _this = $(this);
        editModel(mName,mContent,id,_this);
    });
});

var initModel = function(){
    $.ajax({
        url:baseUrl+"/NoteTemplate/selectAllNoteTemplate.do",
        dataType:"Json",
        type:"get",
        success:function(result){
            if(result.state == 0){
                $('.listContent').empty();
                var noteModelArr = result.data;
                var content = "";
                for(var i = 0; i < noteModelArr.length; i++){
                    content += '<li sid="'+noteModelArr[i].id+'">'+
                        '<div><input type="checkbox" class="regular-checkbox checkPart" id="'+noteModelArr[i].id+'"><label for="'+noteModelArr[i].id+'"></label></div>'+
                        '<div class="modelName">'+noteModelArr[i].Name+'</div>'+
                        '<div class="modelContent">'+noteModelArr[i].Content+'</div>'+
                        '<div>'+
                        '<div class="operBox">'+
                        '<div class="editBtn"></div>'+
                        '<div class="delBtn"></div>'+
                        '</div>'+
                        '</div>'+
                        '</li>';
                }
                $('.listContent').append(content);
            }
        }
    });
};

//单个删除提示框
var deleteModel = function(mName,id){
    parent.$.confirmWin({
        width:460,
        height:170,
        title:"删除提示",
        text:"<div class='delIcon'></div>"+
        "<div class='delWrap'><div class='delTitle'><b>您已选中模板<span>"+mName+"</span>,确定<span>删除</span>该模板吗？</b></div>"+
        "<div class='delContent'>删除后，该模板将不在模板内容显示</div></div>",
        btnVal:"确定",
        submitFn:function(){
            $.ajax({
                url:baseUrl+"/NoteTemplate/deleteNoteTemplateById.do",
                data:{id:id},
                dataType:"Json",
                type:"post",
                success:function(result){
                    if(result.state == 0){
                        $('li[sid='+id+']').remove();
                    }
                }
            });
        }
    });
};

//编辑模板内容
var editModel = function(mName,mContent,id,_this){
    parent.$.confirmWin({
        width:650,
        height:280,
        title:"编辑模板内容",
        text:"<div class='modelTitle'>模板名称</div>"+
        "<div class='modelBox'><input type='text' value="+mName+" id='newModelName'></div>"+
        "<div class='modelTitle'>模板内容</div>"+
        "<textarea  name='modelContent' id='newModelContent'>"+mContent+"</textarea>",
        btnVal:"确定",
        submitFn:function(){
            var Name = $(this).find('#newModelName').val();
            var Content = $(this).find('#newModelContent').val();
            $.ajax({
                url:baseUrl+"/NoteTemplate/updateNoteTemplateById.do",
                data:{id:id,
                    Name:Name,
                    Content:Content},
                dataType:"Json",
                type:"post",
                success:function(result){
                    var name1 = result.data.Name;
                    var content1 = result.data.Content;
                    console.log(result.data);
                    if(result.state == 0){
                        $('li[sid='+id+']').find('.modelName').text(name1);
                        $('li[sid='+id+']').find('.modelContent').text(content1);
                    }
                }
            });
        }
    });
};
