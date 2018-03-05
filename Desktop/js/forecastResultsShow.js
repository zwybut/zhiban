/**
 * Created by Dell on 2017/2/10.
 */
var baseUrl = parent.baseUrl;

$(function(){

    // 加入载入图标
    var spinloading =new Spinner({radius: 10, length: 0, width: 8, lines:7,color:"#436c8f", trail: 40,className: 'myspinner'})
        .spin(document.getElementById('spinLoading'));

    // javax发起请求时，显示载入图标
    $(document).ajaxStart(function(){
        $("#loadingDiv").show();
    });

    // javax请求结束时，隐藏图标
    $(document).ajaxStop(function(){
        $("#loadingDiv").hide();
    });

    var sectionCd = null;  //断面
    var startTm =null;  // 开始时间
    var endTm =null;    //结束时间
    var day = null;     // 场次
    var stcd = null

    $('.sel_days').height($('.fcr_center').height()-$('.sel_times').height()-$('.tit').height()-70);
    $('#chartBox').height($('.fcr_right').height()-40);
    $('#chartBox').width($('.fcr_right').width());


    $('#startTime').datetimebox({
        showSeconds: false,
        required: true,
        editable:false,
        value:new Date().DateAdd("day", -200).Format("yyyy-MM-dd hh:00"),
        onChange: function(date){
            getDaysList();
        }
    });

    $('#endTime').datetimebox({
        showSeconds: false,
        required: true,
        editable:false,
        value:new Date().Format("yyyy-MM-dd hh:00"),
        onChange: function(date){
            getDaysList();
        }
    });

    // 得到断面列表
    $.ajax({
        url: baseUrl+"comm/forcast/getSectionInfo.do",
        type: "Post",
        data:{
        },
        success:function(jsondata) {

            var result = '';
            for(var i=0;i<jsondata.length;i++){
                result +='<li name="'+jsondata[i].stcd+'">'+ jsondata[i].stnm +'</li>';
            }
            $('#sections').html(result);
            selSection();
        },
        error:function(){
        },
        complete :function(){
        }
    });

    // 得到预报场次列表
    function getDaysList(){
        stcd = sectionCd;
        //console.log(stcd);
        startTm =$("#startTime").datetimebox('getValue');
        endTm =$("#endTime").datetimebox('getValue');
        $.ajax({
            url: baseUrl+"comm/forcast/getFymdhInfoByStcd.do",
            type: "Post",
            data:{
                stcd:stcd ,
                startTm:startTm ,
                endTm:endTm ,
            },
            success:function(jsondata) {
                //console.log(jsondata);
                var result = '';
                if(jsondata.length<1){
                    result += '<li name="0">暂无数据</li>'
                }else {
                    for(var i=0;i<jsondata.length;i++){
                        result +='<li name="'+jsondata[i].stcd+'" tm="'+new Date(jsondata[i].fymdh).Format("yyyy-MM-dd hh:00")+'">'+ new Date(jsondata[i].fymdh).Format("yyyyMMddhh") +'</li>';
                    }
                }
                $('.sel_days').html(result);
                selDays();
            },
            error:function(){
            },
            complete :function(){
            }
        });
    }


    function selSection(){
        $('.sections').find('li').click(function(){
            $(this).addClass('active').siblings().removeClass('active');
            sectionCd = $(this).attr('name');
            getDaysList()
        });
        $('.sections li:eq(0)').trigger('click');

    }

    function selDays(){
        $('.sel_days').find('li').click(function(){
            $(this).addClass('active').siblings().removeClass('active');
            // 生成预报图表
            var fymdh = $(this).attr("tm");
            $.ajax({
                url: baseUrl+"comm/forcast/getProcessInfoByFymdh.do",
                type: "Post",
                data:{
                    stcd:stcd ,
                    fymdh:fymdh ,
                },
                success:function(jsondata) {

                    //var categoriesTime = [];
                    var startTime = null;
                    var dataQ = [];
                    var dataZ = [];
                    if(jsondata.length > 0) startTime = new Date(jsondata[0].ymdh);
                    else startTime = new Date();

                    for(var i=0;i<jsondata.length;i++){
                        dataQ.push(jsondata[i].q);
                        dataZ.push(jsondata[i].z);
                    }

                    //console.log(categoriesTime)




                    $('#chartBox').highcharts({
                        chart: {
                            type: 'spline',
                            zoomType: 'x',
                        },
                        title: false,
                        colors:['#52cbe5'],
                        //legend: {
                        //    layout: 'vertical',
                        //    align: 'left',
                        //    verticalAlign: 'top',
                        //    x: 150,
                        //    y: 100,
                        //    floating: true,
                        //    borderWidth: 1,
                        //    backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
                        //},
                        legend:false,
                        noData: {
                            style: {
                                fontWeight: 'bold',
                                fontSize: '15px',
                                color: '#303030'
                            }
                        },
                        lang: {
                            noData: '暂无数据'
                        },
                        xAxis: {
                            type: 'datetime',

                            dateTimeLabelFormats: {
                                second: '%d日%H时',
                                minute: '%d日%H时',
                                hour: '%d日%H时',
                                day: '%d日%H时',
                                week: '%Y-%m-%d',
                                month: '%Y-%m',
                                year: '%Y'
                            }
                        },
                        yAxis:  [{ // Primary yAxis
                            title: {
                                text: '水位 (m)',
                                style: {
                                    color: '#89A54E'
                                }
                            },
                            labels: {
                                format: '{value}',//格式化Y轴刻度
                                style: {
                                    color: '#89A54E'
                                }
                            }

                        }, { // Secondary yAxis
                            title: {
                                text: '流量 (m³/s)',
                                style: {
                                    color: '#4572A7'
                                }
                            },
                            labels: {
                                format: '{value}',
                                style: {
                                    color: '#4572A7'
                                }
                            },
                            opposite: true
                        }],
                        tooltip: {
                            xDateFormat: '%d日%H时',
                            shared: true, //公用一个提示框
                            crosshairs: true,
                            //formatter: function() {
                            //    return new Date(this.x).Format("dd日hh时") +"<br>"
                            //        + "<span style='color:#4572A7'>水位：" + this.points[0].y +"m</span><br>"
                            //        + "<span style='color:#89A54E'>雨量：" + this.points[1].y +"mm</span>"
                            //}
                        },
                        credits: {
                            enabled: false
                        },
                        plotOptions: {
                            areaspline: {
                                fillOpacity: 0.5
                            },
                            series: {
                                pointInterval: 1 * 3600 * 1000,
                                pointStart: Date.UTC(startTime.getFullYear(), startTime.getMonth(), startTime.getDate(), startTime.getHours())
                            },
                        },
                        //legend:false,
                        series: [{
                            yAxis: 0,
                            name: '水位',
                            color: '#89A54E',
                            data: dataQ,
                            tooltip: {
                                valueSuffix: '米'
                            }
                        },{
                            yAxis: 1,
                            name: '流量',
                            color: '#4572A7',
                            data: dataZ,
                            tooltip: {
                                valueSuffix: '立方米/秒'
                            }
                        }],
                    });
                },
                error:function(){
                },
                complete :function(){
                }
            });
        });
        $('.sel_days li:eq(0)').trigger('click');
    }




});