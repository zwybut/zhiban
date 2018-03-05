/**
 * Created by Dell on 2017/2/10.
 */
var title;
var baseUrl = parent.baseUrl;

$(function(){

    // 加入载入图标
    var spinloading =new Spinner({radius: 10, length: 0, width: 8, lines:7,color:"#436c8f", trail: 40,className: 'myspinner'})
        .spin(document.getElementsByClassName('spinLoading')[0]);

    // javax发起请求时，显示载入图标
    $(document).ajaxStart(function(){
        $(".loadingDiv").show();
    });

    // javax请求结束时，隐藏图标
    $(document).ajaxStop(function(){
        $(".loadingDiv").hide();
    });

    $('#chartBox').height($('.rsv_right').height()-40);
    $('#chartBox').width($('.rsv_right').width());

    getStationListInfo();

    $('#rsvrList').on('click','li',function(){
        $(this).addClass('active').siblings().removeClass('active');
        title = $(this).find('p').text();
        getChart()
    });




});

var getChart = function(){
    $('#chartBox').highcharts({
        chart: {
            type: 'areaspline'
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
        xAxis: {
            categories: [
                '07:00',
                '08:00',
                '09:00',
                '10:00',
                '11:00',
                '12:00',
            ],
        },
        yAxis: {
            title: false
        },
        tooltip: {
            shared: true,
            valueSuffix: ' mm'
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            areaspline: {
                fillOpacity: 0.5
            }
        },
        series: [{
            name: title,
            data: [3, 4, 3, 5, 4, 10]
        }]
    });
}

var getStationListInfo = function(){
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
                result +='<li stcd="'+sta[i].stcd+'"><span></span><p>'+ sta[i].stnm +'</p></li>';
            }
            $('#rsvrList').html(result);

            $('#rsvrList').find('li').eq(0).trigger('click');

        },
        error:function(){


        },
        complete :function(){

        }
    });



};