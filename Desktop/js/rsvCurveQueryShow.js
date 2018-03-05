/**
 * Created by Dell on 2017/1/11.
 */
var baseUrl = parent.baseUrl;

$(function () {

    // 加入载入图标
    var spinloading = new Spinner({radius: 10, length: 0, width: 8, lines:7,color:"#436c8f", trail: 40,className: 'myspinner'})
        .spin(document.getElementById('spinLoading'));

    // javax发起请求时，显示载入图标
    $(document).ajaxStart(function(){
        $("#loadingDiv").show();
    });

    // javax请求结束时，隐藏图标
    $(document).ajaxStop(function(){
        $("#loadingDiv").hide();
    });

    // 得到水库站列表
    $.ajax({
        url: baseUrl+"comm/baseInfo/getStationBaseInfoByCondition.do",
        type: "Post",
        data:{
            sttp:"RR",
            rsvrtp:"2,3,4,5"
        },
        success:function(data) {
            var sta = data.stationBaseInfo;
            var result = '';
            for(var i=0;i<sta.length;i++){
                result +='<li name="'+sta[i].stcd+'">'+ sta[i].stnm +'</li>';
            }
            $('#rvtList').html(result);
            clickShowChart();
        },
        error:function(){


        },
        complete :function(){

        }
    });

    // 点击显示图表
    function clickShowChart(){
        $('#rvtList').find('li').click(function(){
            $(this).addClass('active').siblings().removeClass('active');
            var val = $(this).attr('name');
            var stnm = $(this).text();
            $.ajax({
                url: baseUrl+"comm/baseInfo/getZVLineByStcd.do",
                type: "Post",
                data:{
                    stcd:val
                },
                success:function(jsonData) {
                    //console.log(jsonData)
                    var maxVal = 0;
                    var dataInfo = jsonData.st_zvral_b;
                    var datas = [];
                    for(var i=0;i<dataInfo.length;i++){
                        var data=[dataInfo[i].w,dataInfo[i].rz];
                        datas.push(data);
                        if(maxVal<dataInfo[i].w){
                            maxVal = dataInfo[i].w
                        }
                    }
                    //console.log(parseFloat(maxVal.toFixed(1)))
                    Highcharts.setOptions({
                        lang: {
                            noData: '暂无数据'
                        }
                    });
                    var myCharts = $('#container').highcharts({
                        chart: {
                            type: 'area',
                            zoomType: 'x',
                        },
                        colors:['#52cbe5'],
                        credits: {
                            enabled: false
                        },
                        title: {
                            text: stnm+'库容曲线图',
                            style:{
                                fontSize:'16px'
                            }
                        },
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
                        legend:false,
                        xAxis: {
                            //type:'linear',
                            title: {
                                text: '蓄水量 (百万方)'
                            },
                            max:parseFloat(maxVal.toFixed(1)),
                            labels: {
                                formatter: function () {
                                    return this.value;
                                }
                            },
                            //tickInterval:0.1,
                            //tickAmount: 8
                        },
                        yAxis: {
                            title: {
                                text: '水位 (米)'
                            },
                            labels: {
                                formatter: function () {
                                    return this.value ;
                                }
                            }
                        },
                        tooltip: {
                            crosshairs: true,
                            shared: true,
                            valueSuffix: '米',
                            formatter: function() {
                                return "蓄水量：<b>"+ this.x +" 万方</b><br>"
                                    + "<span style='color:#4572A7'>水\n位：<b>" + this.y +" 米</b></span><br>"
                            }
                        },
                        plotOptions: {
                            //spline: {
                            //    marker: {
                            //        radius: 4,
                            //        lineColor: '#666666',
                            //        lineWidth: 0,
                            //        symbol:"circle",
                            //        enabled:true,
                            //    }
                            //}
                            area: {
                                marker: {
                                    enabled: false,
                                },
                                fillColor: {
                                    linearGradient: {
                                        x1: 0,
                                        y1: 0,
                                        x2: 0,
                                        y2: 1
                                    },
                                    stops: [
                                        [0, Highcharts.getOptions().colors[0]],
                                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                                    ]
                                },
                                //marker: {
                                //    radius: 2
                                //},
                                lineWidth: 2,
                                states: {
                                    hover: {
                                        lineWidth: 2
                                    }
                                },
                                threshold: null
                            }
                        },
                        series: [{
                            name: '水位',
                            //marker: {
                            //    symbol: 'circle',
                            //    radius: 4
                            //},
                            data: datas
                        }]
                    });
                },
                error:function(){

                },
                complete :function(){

                }
            });

        });
        $('#rvtList').find('li').eq(0).trigger('click');
    }



});
