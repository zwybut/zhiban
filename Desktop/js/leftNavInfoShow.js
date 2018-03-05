/**
 * Created by Dell on 2016/12/1.
 */
$(function(){


    // 左侧导航栏选中状态
    $('.detailInfo div').each(function(){
        var li_Index=0;
        $(this).find('li').hover(function(){
            $(this).parent().find('li:not(:eq('+li_Index+'))').removeClass('active');
            $(this).addClass('active');
        },function(){
            $(this).parent().find('li:not(:eq('+li_Index+'))').removeClass('active');
        });
        $(this).find('li').click(function(){
            var index=$(this).index();
            $(this).parent().find('li').removeClass('active');
            $(this).addClass('active');
            li_Index=index;

            loadModel($(this).text(),$(this).attr("modelId"),$(this).parent().parent().attr("BigClass"));
            toggleDetailInfo();
        });
    });

    // 菜单内容弹出和收进切换
    var toggleDetailInfo = function(){
        if(detailContentMenuOut){
            $('.detailInfo').animate({left:'-247px'},500);  // 弹出内容容器
            detailContentMenuOut=false;
        }
        else{
            $('.detailInfo').animate({left:'52px'},500);  // 弹出内容容器
            detailContentMenuOut=true;
        }
    };

    // 报表点击之后状态变化
    $('#resultList a').on('click',function(){
        $(this).addClass('visited')
    });

    //全局状态标记变量
    var allInfoMenuOut=false;       //全部菜单内容
    var detailContentMenuOut=false; //详细内容
    var tab_index=0;


    // 鼠标点击main的区域，左侧弹出内容全部隐藏
    $('.main').click(function(){
        $('#allInfo').animate({left: '-248px'},500);
        allInfoMenuOut=false;
        if(detailContentMenuOut) toggleDetailInfo();
    });



    //鼠标悬浮在左侧导航栏选项向右滑出对应的子菜单
    var detailInfoIn=function(){
        var index=$('.nav_').index(this);
        // 当前模块的菜单不变色
        $('.nav_left:not(:eq('+tab_index+'))').removeClass('active');
        $('.nav_left').eq(index).addClass('active');

        if((!allInfoMenuOut)&&(!detailContentMenuOut)){ // 如果没有弹出窗口
            // 显示菜单提示弹出框
            //console.log("detailInfoIn");
            if($('.hoverInfoDiv').eq(index).is(":hidden")) {
                $('.hoverInfoDiv').eq(index).show();
            }
            $('.hoverInfoDiv').eq(index).animate({width: '300px', height: '52px'}, 500);
            $('.hoverInfo').eq(index).show();
        }
    };


    var detailInfoOut=function(){
        var index=$('.nav_').index(this);
        // 当前模块的菜单不变色
        $('.nav_left:not(:eq('+tab_index+'))').removeClass('active');
        if((!allInfoMenuOut)&&(!detailContentMenuOut)){// 如果没有弹出窗口
            $('.hoverInfoDiv').eq(index).css("width","0").css("height","52").stop();
            $('.hoverInfo').eq(index).hide();
        }

    };

    $('.nav_').hover(detailInfoIn,detailInfoOut);

    //点击左侧导航栏头部右滑出综合应用,再次点击向左滑回
    $('.nav_map1').click(function(){
        if (!allInfoMenuOut) {
            $('#allInfo').animate({left: '52px'},500);
            allInfoMenuOut=true;
        } else {
            $('#allInfo').animate({left: '-248px'},500);
            allInfoMenuOut=false;
            toggleDetailInfo();
        }
    });

    // 用于菜单的浮动提示
    $('.nav_').mousemove(function(e){
        var index=$('.nav_').index(this);

        if(detailContentMenuOut){
            $('.tip').eq(index).show();
        }

        var boxX=$(this).offset().left;   //获取父元素距离左边的距离；
        var boxY=$(this).offset().top;    //获取父元素距离上方的距离
        var x = e.pageX+20;               //获取鼠标位置距离浏览器左边的距离
        var y = e.pageY;                  //获取鼠标位置距离浏览器上方的距离
        if($(this).height()-(e.pageY-boxY)<25) y = e.pageY-25;
        var top=y-boxY;
        var left=x-boxX;
        $('.tip').eq(index).css({
            'top' : top + 'px',
            'left': left+ 'px'
        });
    });

    // 鼠标移出，菜单的浮动提示消失
    $('.nav_').mouseout(function(){
        $('.tip').hide();
    });

    //点击左侧导航栏选项右滑出对应的详细菜单
    $('.nav_').click(function(){
        var index=$('.nav_').index(this);
        //detailContentMenuOut=false;

        // 收回所有的弹出菜单提示框
        $('.hoverInfoDiv').eq(index).hide();

        if(allInfoMenuOut){ // 如果菜单弹出框是弹出时，收回菜单弹出框
            $('#allInfo').animate({left: '-248px'},500);
            allInfoMenuOut=false;
        }

        // 恢复其它未选中菜单的状态
        $('.nav_left:not(:eq('+index+'))').removeClass("active");
        $('.al_:not(:eq('+index+'))').removeClass("active");
        $('.rightTriangle').hide();

        // 标记选中菜单，用白色的三角
        $('.rightTriangle').eq(index).show();


        if(!detailContentMenuOut)    // 如果内容容器没有弹出
        {
            $('.rightTriangle').eq(index).show(); // 弹出的指示图标
            toggleDetailInfo();

        }
        ModelLoad(index); // 载入内容
        tab_index = index;
    })


    $('.al_').eq(0).children('.al3').hide();
    $('.al_').eq(0).children('.al4').show();
    //综合应用子类选项鼠标滑动背景颜色切换
    $('.al_').hover(function(){
        var index = $('.nav_').index(this);
        $(this).addClass('active');
        $(this).children('.al3').hide();
        $(this).children('.al4').show();

    },function(){
        var index = $('.nav_').index(this);
        $('.nav_left:not(:eq('+tab_index+'))').removeClass('active');
        $(".al_:not(:eq("+tab_index+"))").removeClass('active');
        $(".al_:not(:eq("+tab_index+"))").children('.al3').show();
        $(".al_:not(:eq("+tab_index+"))").children('.al4').hide();
    });

    //鼠标悬浮在allInfo菜单的选项上，左边的导航栏选项背景色和图标相应的改变
    $('.al_').each(function(index){
        $(this).mouseover(function(){
            $(".nav_left:eq("+index+")").addClass('active');
        })
    })

    $('.al_').each(function(index){
        $(this).mouseout(function(){
            if(index!=tab_index)
                $(".nav_left:eq("+index+")").removeClass('active');
        })
    })

    //鼠标悬浮在左侧导航栏菜单的选项上，右滑出的allInfo菜单背景色和图标相应的改变
    $('.nav_').each(function(index){
        $(this).mouseover(function(){
            $(".al_:eq("+index+")").addClass('active');
            $('.nav_left').eq(index).addClass('active');   //详细信息页面左边对应的导航栏选项颜色
            $('.al_').eq(index).children('.al3').hide();
            $('.al_').eq(index).children('.al4').show();
        })
    })

    $('.nav_').each(function(index){
        $(this).mouseout(function(){
            if(index!=tab_index)
                $(".al_:eq("+index+")").removeClass('active');

        })
    });

    //点击右滑出的综合应用子类选项右滑出对应的详细菜单，同时综合应用左滑消失
    $('.al_').click(function(){
        var index=$('.al_').index(this);
        // 收回所有的弹出菜单提示框
        $('.hoverInfoDiv').eq(index).hide();
        $('#allInfo').animate({left: '-248px'},500);
        allInfoMenuOut=false;
        // 恢复其它未选中菜单的状态
        $('.nav_left:not(:eq('+index+'))').removeClass("active");
        $('.rightTriangle').hide();
        // 标记选中菜单，用白色的三角
        $('.rightTriangle').eq(index).show();
        $('.detailInfo').animate({left:'52px'},500);  // 弹出内容容器
        $('.rightTriangle').eq(index).show(); // 弹出的指示图标
        detailContentMenuOut=true;

        ModelLoad(index); // 载入内容
        tab_index = index;
    });

    function ModelLoad(index) {
        if(index==tab_index) return;
        else{
            $('.detailInfo div').hide();
            $('.detailInfo div:eq('+index+')').show();
            //console.log(index)
        }
    }
})



















