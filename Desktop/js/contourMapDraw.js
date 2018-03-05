/**
 * Created by Dell on 2016/11/29.
 */
{
    var RainInfo = L.Class.FloodInfo.extend({

        RainIcon: {
            blueIcon: L.icon({
                iconUrl: '../images/rain_icon1_03.png', // 0-30
                iconSize: [14, 14] // 图标尺寸
            }),
            yellowIcon: L.icon({
                iconUrl: '../images/rain_icon2_03.png', // 30-50
                iconSize: [14, 14] // 图标尺寸
            }),
            orangeIcon: L.icon({
                iconUrl: '../images/rain_icon3_03.png', // 50-80
                iconSize: [14, 14] // 图标尺寸
            }),
            purpleIcon: L.icon({
                iconUrl: '../images/rain_icon4_03.png', // 80-100
                iconSize: [14, 14] // 图标尺寸
            }),
            redIcon: L.icon({
                iconUrl: '../images/rain_icon5_03.png', // 100以上
                iconSize: [14, 14] // 图标尺寸
            })
        }


    });


    //绘制图层图标
    RainInfo.prototype.DrawStationInfo = function (jsonData) {
        var lttd =0 ;
        var lgtd=0;
        var count =0;
        var sttp_img;
        //console.log(jsonData)
        for (var i = 0; i < jsonData.length; i++) {
            if(jsonData[i].lttd==null && jsonData[i].lgtd==null){
                continue;
            }
            lttd += jsonData[i].lttd;
            lgtd += jsonData[i].lgtd;
            count++;

            if(jsonData[i].sttp == 'PP'){         //雨情
                sttp_img = 's_pp.png';
            }else if(jsonData[i].sttp == 'ZZ'){  //河道
                sttp_img = 's_zz.jpg';
            }else if(jsonData[i].sttp == 'DD'){  //闸坝
                sttp_img = 's_dd.jpg';
            }else if(jsonData[i].sttp == 'RR'){  //水库
                sttp_img = 's_rr.jpg';
            }else if(jsonData[i].sttp == 'TT'){  //潮位
                sttp_img = 's_tt.jpg';
            }

            var iconImg =this.RainIcon.blueIcon;

            if(jsonData[i].rn_0!="-"&&jsonData[i].rn_0!="")
            {
                if(jsonData[i].rn_0>=0&&jsonData[i].rn_0<30) iconImg = this.RainIcon.blueIcon;
                else if(jsonData[i].rn_0>=30&&jsonData[i].rn_0<50)iconImg = this.RainIcon.yellowIcon;
                else if(jsonData[i].rn_0>=50&&jsonData[i].rn_0<80)iconImg = this.RainIcon.orangeIcon;
                else if(jsonData[i].rn_0>=80&&jsonData[i].rn_0<100)iconImg = this.RainIcon.purpleIcon;
                else iconImg = this.RainIcon.redIcon;
            }
            var aa = L.marker([jsonData[i].lttd, jsonData[i].lgtd], {
                    icon:iconImg,
                    draggable: false,        // 使图标可拖拽
                    //title: jsonData[i].stnm  // 添加一个标题
                    //opacity: 1            // 设置透明度
                })
                .bindPopup('<div class="mapPopup"><h3>' + jsonData[i].stnm + '(雨情信息)</h3>' +
                    '<a href="#" style="">' +
                    '<img src="../images/'+sttp_img +'">' +
                    '</a>' +
                    '<ul class="clearfix"><li>1小时雨量<span>' + jsonData[i].rn_1 + 'mm</span></li>' +
                    '<li>3小时雨量<span>' + jsonData[i].rn_3 + 'mm</span></li>' +
                    '<li>6小时雨量<span>' + jsonData[i].rn_6 + 'mm</span></li></ul>' +
                    '</div>',{onHide:true})
                .bindTooltip("<b style='color:royalblue'>"+jsonData[i].stnm+"</b>",{offset: L.point(0, -10),direction:"top"})
                .addTo(this._pointLayer);

            //aa.on("mouseout",function(){ this.closeTooltip()});

            //console.log(aa);
            //aa.mouseOver('alert("ok")');

        }
        //定位中心点
        if(lttd==0 || lgtd==0){
            this._CenterPoint=null;
        }else{
            this._CenterPoint=L.latLng(lttd/count,lgtd/count);
        }

    }

}

var baseUrl = parent.baseUrl;
var baseObj = {};  // 所有的基础数据
var stcdObj = {}; // 时间选择时切换的数据
var subData = []; // 需要提交的经纬度，雨量数据
var subObjs =[];
var selectTimeVal;
var step ;
var opacity = 0.5;
var newTime;
var ZVColors = [];
$(function(){
    var curTab = 0;
    $('.hideBox').css('top',($('.drawBox').height()-$('.hideBox').height()-50)/2+'px');

    var resolutions = [
        1.40625,
        0.703125,
        0.3515625,
        0.17578125,
        0.087890625,
        0.0439453125,
        0.02197265625,
        0.01098632812,
        0.005493164062,
        0.00274658203125,
        0.001373291015625,
        0.0006866455078125,
        0.00034332275390625,
        0.000171661376953125,
        8.58306884765625E-05,
        4.29153442382813E-05,
        2.14576721191406E-05,
        1.0728836060E-05,
        5.3644180298E-06,
        2.6822090149E-06
    ];

    var crs = new L.Proj.CRS(
        '',
        '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs' , {
            origin:  [-180, 90],
            resolutions: resolutions,
            //bounds:this.bounds
        }
    );

    var BaseLayer_eMap = new TdtTileLayer({
        imgType:"chinaemap",
        imgUrl:"http://tmap.smjs.com.cn/",
        minZoom:7,
        maxZoom:19
    });//bringToBack

    // 加入TDT瓦片图层
    var myMap = L.map('myMap',{
        crs: crs,
        continuousWorld: true,
        worldCopyJump: false,
        scrollWheelZoom:true,
    }).setView([29.02,121.54], 11);
    BaseLayer_eMap.tileLayer.addTo(myMap);

    // 加入境界晕线瓦片图层
    var RingsTileLayer = new AgTileLayer(mapUrl+'MapTiles/Map_SM/Lyr_rings/');
    RingsTileLayer.tileLayer.addTo(myMap);

    test_getSTBPRP();

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

    var chooseTime = $("#chooseTime").customSelect({width:70,lineHeight:18});
    var choosePic = $("#choosePic").customSelect({width:70,lineHeight:18});
    //var chooseAlpha = $("#chooseAlpha").customSelect({width:90,lineHeight:18});
    var selectTime = $('#selectTime').customSelect({width:220,lineHeight:18});
    var selectAlpha = new scale('selectAlpha','透明度',parseInt(opacity*100),0,100,false,'%',function(){
        opacity = parseFloat($('.ec1_6').text()/100,2);
        //console.log(opacity)
    });


    // 点击箭头 绘制窗口显示隐藏
    var showOrHide = true ;
    $('.hideBox').click(function(){
        if(showOrHide){
            $('.drawBox').animate({left:'-300px'},500);
            $('.hideIcon').addClass('hide');
            showOrHide = false;
        }else {
            $('.drawBox').animate({left:'0px'},500);
            $('.hideIcon').removeClass('hide');
            showOrHide = true;
        }
    });

    $('#startTime').datetimebox({
        showSeconds: false,
        required: true,
        editable:false,
        value: new Date().DateAdd("day", -3).Format("yyyy-MM-dd hh:00")
    });

    $('#endTime').datetimebox({
        showSeconds: false,
        required: true,
        editable:false,
        value: new Date().Format("yyyy-MM-dd hh:00")
    });

    $(".rainDrawContent,.rainShroudContent").mCustomScrollbar({
        scrollButtons:{enable:true},
        theme:"inset-2-dark",
        axis:"xy",
        autoHideScrollbar:true,
        setLeft:0,
        mouseWheel:true,
        callbacks:{
            whileScrolling:function(){
            }
        }
    });

    //js获取rainDrawContent和rainShroudContent的绝对定位的top；
    var tab_content_top = $('.detailInfoTitle').height()+2+$('.conditionQuery').height() *2+ $('.timeselect').height() +$('.drawType').height() *7 +2 +5 +$('#myTab2').height();

    //时间选择下拉菜单选择自定义时，下面出现日期选择框
    chooseTime.change(function(){
        if(chooseTime.getValue()=='-1'){
            $('.customTime').show();
            $('.tab-content').css('top',tab_content_top+$('.customTime').height());
        }else{
            $('.customTime').hide();
            $('.tab-content').css('top',tab_content_top);
        }
    });

    //绘制类型中点击序列图和累计序列图出现时间选择条
    choosePic.change(function(){
       if(choosePic.getValue()!=0){
           $('.sequeDiagram').show();
       }else{
           $('.sequeDiagram').hide();
       }
   });

    //点击时间选择条，背景颜色和字体颜色相应改变
    $('.sqd').click(function(){
        var index=$('.sqd').index(this);
        $('.sqd').removeClass('active');
        $(this).addClass('active');
        $('#interval').attr("value",$(this).attr('value'));

    });
    $('.sqd[value=6]').trigger('click');

    //点击雨量级别右侧"+"和"-"，选择雨量级别数值,以及下面的雨量范围值做出相应的改变
    $('.rl1').click(function () {
        if ($('#rainLev').val() < 1000) {
            var num = parseInt($('#rainLev').val());  //将获取的内容转换为整型数据
            num += 1;                                          //自增量
            $('#rainLev').val(num);
            $('.rrc2_1').val(num);
            $('.rrc2_2').val(2*num);
            $('.rrc2_3').val(3*num);
            $('.rrc2_4').val(4*num);
            $('.rrc2_5').val(5*num);
            $('.rrc2_6').val(6*num);
        }
    });

    $('.rl2').click(function () {
        if ($('#rainLev').val() > 1) {
            var num = parseInt($('#rainLev').val());
            num -= 1;
            $('#rainLev').val(num);
            $('.rrc2_1').val(num);
            $('.rrc2_2').val(2*num);
            $('.rrc2_3').val(3*num);
            $('.rrc2_4').val(4*num);
            $('.rrc2_5').val(5*num);
            $('.rrc2_6').val(6*num);
        }
    });

    //让input文本输入框只能输入数字
    $('#rainLev').keyup(function(){
        if($('#rainLev').val() == ''){
            $('#rainLev').val(1);
        }
        var num = parseInt($('#rainLev').val());
        $('.rrc2_1').val(num);
        $('.rrc2_2').val(2*num);
        $('.rrc2_3').val(3*num);
        $('.rrc2_4').val(4*num);
        $('.rrc2_5').val(5*num);
        $('.rrc2_6').val(6*num);
    });

    $('.rrc2').keydown(function(){
        //根据键盘上每个按键对应的keyCode进行判断
        if(!((event.keyCode>=48&&event.keyCode<=57)||(event.keyCode>=96&&event.keyCode<=105)
            ||(event.keyCode==8)||(event.keyCode==37)||(event.keyCode==38)||(event.keyCode==39)||(event.keyCode==40))){
            event.returnValue = false;
        }
    });

    //分别点击绘制的雨量站点和各雨量级笼罩面积，背景颜色相应改变
    $('.navBtn').click(function(){
        var index=$('.navBtn').index(this);
        $('.navBtn').removeClass('active');
        $('.navBtn').eq(index).addClass('active');
        $('.nav_content').eq(index).show().addClass('active').siblings().removeClass('active').hide();
    });
    $('.navBtn').eq(0).trigger('click');

    //点击绘制雨量站点站名左边的复选框，勾选下面所有的站点,再次点击全部清除所有勾选
    $('.rdt1 input').click(function(){
        if(this.checked){
            $('.rdc input').prop('checked',true);
        }else{
            $('.rdc input').prop('checked',false);
        }
    });



    /**
     * 等值绘制功能区
     */
    var fixColor = [[4, 162, 244], [4, 238, 236], [4, 254, 4], [4, 202, 4], [4, 146, 4], [252, 254, 4], [228, 194, 4], [252, 146, 4], [252, 2, 4], [204, 2, 4], [124, 2, 132]];

    var startColor = [[255, 251, 125], [252, 216, 215], [200, 201, 101], [201, 199, 255], [175, 231, 240], [200, 201, 101]];
    var endColor = [[117, 22, 4], [150, 23, 17], [25, 79, 16], [34, 20, 227], [17, 26, 156], [69, 18, 89]];

    //颜色数组
    var zvColors = [];

    //雨量等级设置
    var rain_class_array = [0, 10, 25, 50, 75, 100, 125, 150, 200, 250, 500, 750, 1000, 1250, 2000, 2500, 5000, 10000, 15000, 20000, 25000, 50000, 100000];

    var imageLayerArray = null;


    var groups = L.layerGroup().addTo(myMap);
    // 单击统计雨量
    $("#btn_statistic").click(function() {
        groups.clearLayers();
        var jsonParameters = {};
        stcdObj = {};
        // 得到时间类型
        var timeType = chooseTime.getValue();
        var st = "";// 开始时间
        var et = "";	// 始束时间

        //计算开始时间与结束时间字符串
        if (timeType >= 0) {     // 如果不是自定义时间

            //计算开始时间和结束时间
            var time_now = new Date();
            if (time_now.getHours() < 8) {//如果小于8点钟，开始时间推到前一天的８时
                et = time_now.Format("yyyy-MM-dd hh:00");
                time_now = time_now.DateAdd("DAY", -1 * (1 + timeType));
                time_now.setHours(8);
                st = time_now.Format("yyyy-MM-dd hh:00");
            }
            else { //大于8点时，当日8点到现在
                if (timeType > 0) time_now.setHours(8);
                et = time_now.Format("yyyy-MM-dd hh:00");
                if (timeType > 0) time_now = time_now.DateAdd("DAY", -1 * (timeType));
                time_now.setHours(8);
                st = time_now.Format("yyyy-MM-dd hh:00");
            }
        } else {      //直接获取开始时间与结束时间
            st = new Date($("#startTime").datetimebox('getValue')).Format("yyyy-MM-dd hh:00");
            et = new Date($("#endTime").datetimebox('getValue')).Format("yyyy-MM-dd hh:00");
        }

        jsonParameters.Tm1 = new Date(st).Format("yyyyMMddhh00");
        jsonParameters.Tm2 = new Date(et).Format("yyyyMMddhh00");

        //系列图、累计图
        var imgType = choosePic.getValue();
        var selHour = parseInt($("#interval").attr("value"));

        jsonParameters.Addvcd = "331022";
        jsonParameters.MinDist = 10;

        var maxdata = [];

        if (imgType > 0) {   // 序列图，累计图
            maxdata = [];
            var diff = new Date(et).getTime() - new Date(st).getTime();
            //var selHour:int=int(toggleButtonBar_hour_array.getItemAt(selIdx).value);
            //判断时间选择跨度
            if (diff * 1.0 / 1000 / 60 / 60 / selHour > 15) {
                //  最大允许15个时间段！";
                //fadehide.play();
                $.toast({
                    text: '最大允许15个时间段!',
                    icon: 'info',
                    position: "mid-left",
                    stack: false,
                    allowToastClose: false,
                    loader: false,
                    bgColor: "#FF0000",
                    textColor: "#fff"
                });
                return;
            }

            jsonParameters.Freq = imgType;
            jsonParameters.FreqHour = selHour;
            subData = [];
            var params = {};
            params = jsonParameters;

            url = DZXUrl+"api/getdatas";
            $.post(url, {
                    DATA: params
                },
                function (jsondata) {
                    console.log(jsondata);
                    if(jsondata.STCDs){
                        var opt = '';
                        newTime = [];
                        $('.dataSelect').find('.select_box').remove();
                        for(var i = 0; i < jsondata.STCDs.GID.length; i++){
                            opt += '<option value="'+jsondata.STCDs.GID[i]+'" index="'+ i +'">'+jsondata.STCDs.GID[i]+'</option>';
                            newTime.push(jsondata.STCDs.GID[i]);
                        }
                        selectTime = $('#selectTime').html(opt).customSelect({width:220,lineHeight:18});
                        selectTimeVal = selectTime.getValue();
                        var firstObj;
                        subObjs = {};
                        for(var j = 0; j < jsondata.STCDs.GID.length;j++){
                            var newArr = [];
                            var newObjsData = [];
                            for(var i = 0; i < jsondata.STCDs.STCD1.length; i++){
                                var newObj = {};
                                var subArrs = [];
                                var id = jsondata.STCDs.STCD1[i].ID;
                                newObj.ID = jsondata.STCDs.STCD1[i].ID;
                                newObj.InSelected = jsondata.STCDs.STCD1[i].InSelected[j];
                                newObj.Z = jsondata.STCDs.STCD1[i].Z[j];
                                newArr.push(newObj);
                                maxdata.push(jsondata.STCDs.STCD1[i].Z[j]);
                                subArrs = [baseObj[id].LGTD,baseObj[id].LTTD,jsondata.STCDs.STCD1[i].Z[j]];
                                newObjsData.push(subArrs)
                            }
                            subObjs[jsondata.STCDs.GID[j]] = newObjsData;
                            stcdObj[jsondata.STCDs.GID[j]] = newArr;
                            firstObj = stcdObj[jsondata.STCDs.GID[0]]
                        }
                        //console.log(baseObj);
                        //console.log(stcdObj)
                        var str = '';
                        for(var i = 0; i < firstObj.length; i++){
                            //var firstObjData = {};
                            var id = firstObj[i].ID;
                            //firstObjData.stnm = baseObj[id].STNM;
                            //firstObjData.lgtd = baseObj[id].LGTD;
                            //firstObjData.lttd = baseObj[id].LTTD;
                            //subArr = [baseObj[id].LGTD,baseObj[id].LTTD,firstObj[i].Z];
                            //subData.push(subArr);
                            str +='<div class="rdc"> ' +
                                '<div class="rdc1"><input type="checkbox" id="checkbox-3-'+i+'" class="regular-checkbox" inSelected="'+firstObj[i].InSelected +'"/><label for="checkbox-3-'+i+'"></label></div> ' +
                                '<div class="rdc2 stnm">'+baseObj[id].STNM+'</div> ' +
                                '<div class="rdc2">嵊州市</div> ' +
                                '<div class="rdc2">'+firstObj[i].Z+'</div> ' +
                                '</div>';
                        }
                        $('.rainDrawContent').html(str);
                        $(".rdc1 input[inSelected='1']").attr("checked","'true'");
                        step = true;
                        $('.rr2').text('0~'+maxdata.sort(sortNum)[0]);
                        getLevVal(maxdata.sort(sortNum)[0]);
                    }
                }
            );

        }
        else{   // 单张图
            maxdata= [];
            subData = [];
            jsonParameters.DataType = "ALL";
            var param = {};
            param.DATA = JSON.stringify(jsonParameters);
            //console.log(param);
            $('.dataSelect').find('.select_box').remove();
            var opt = '<option value="'+jsonParameters.Tm1+'_'+jsonParameters.Tm2+'" index="0">'+jsonParameters.Tm1+'_'+jsonParameters.Tm2+'</option>'
            $('#selectTime').html(opt).customSelect({width:220,lineHeight:18});

            $.ajax({
                url: DZXUrl+"api/getdata",
                data: param,
                type: "Post",
                success: function (jsondata) {
                    //console.log(jsondata);
                    newTime = [1];
                    var newArr = [];
                    var str = '';
                    if(jsondata.STCD){
                        for(var i = 0; i < jsondata.STCD.length; i++){
                            var newObj = {};
                            var subArr = [];
                            var id = jsondata.STCD[i].ID;
                            newObj.stnm = baseObj[id].STNM;
                            newObj.lgtd = baseObj[id].LGTD;
                            newObj.lttd = baseObj[id].LTTD;
                            newArr.push(newObj);
                            subArr = [baseObj[id].LGTD,baseObj[id].LTTD,jsondata.STCD[i].Z];
                            subData.push(subArr);
                            if(jsondata.STCD[i].Inside == 1){
                                str +='<div class="rdc"> ' +
                                    '<div class="rdc1"><input type="checkbox" id="checkbox-3-'+i+'" class="regular-checkbox" inSelected="'+jsondata.STCD[i].InSelected +'"/><label for="checkbox-3-'+i+'"></label></div> ' +
                                    '<div class="rdc2 stnm">'+baseObj[id].STNM+'</div> ' +
                                    '<div class="rdc2">嵊州市</div> ' +
                                    '<div class="rdc2">'+jsondata.STCD[i].Z+'</div> ' +
                                    '</div>';
                                maxdata.push(jsondata.STCD[i].Z);
                            }
                        }
                        $('.rainDrawContent').html(str);
                        $(".rdc1 input[inSelected='1']").attr("checked","'true'");
                    }else{
                        $.toast({
                            text: '暂无数据!',
                            icon: 'info',
                            position: "mid-left",
                            stack: false,
                            allowToastClose: false,
                            loader: false,
                            bgColor: "#FF0000",
                            textColor: "#fff"
                        });
                    }
                    step = true;
                    $('.rr2').text('0~'+maxdata.sort(sortNum)[0]);
                    getLevVal(maxdata.sort(sortNum)[0]);
                },
                error: faultFunction,
                complete: function () {

                }
            });

        }
        $(".rainDrawContent").mCustomScrollbar({
            scrollButtons:{enable:true},
            theme:"inset-2-dark",
            axis:"xy",
            autoHideScrollbar:true,
            setLeft:0,
            mouseWheel:true,
        });

    });

    var selectIndex = 0;

    $("#drawBtn").click(function() {
        groups.clearLayers();
        ZVColors = [];
        getZVColors();
        if(step == true){
            var imgUrlArray = [];
            imageLayerArray = [];
            var imageLayer;
            var imageBounds;
            for(var i=0;i<newTime.length;i++){
                //console.log(newTime[i]);
                //console.log(stcdObj[newTime[i]]);
                var imageUrl = '';
                imageBounds = [];
                var XYZdata;
                if(newTime.length>1){
                    XYZdata = subObjs[newTime[i]]
                }else{
                    XYZdata = subData ;
                }
                var imgUrl ;
                var extent ;
                if(ZVColors.length>0){
                    url = DZXUrl+"api/getMap";
                    $.ajax({
                        url: url,
                        type:"post",
                        data:{"DATA": {
                            "Addvcd": "331022",
                            "outType": "DZM",
                            "ZVColors":ZVColors,
                            //"ZVColors":[
                            //{ "ZClass": 11, "ZV2": (lev/5).toFixed(1), "ZV1": 0, "Color": "a8e68a" },
                            //{ "ZClass": 12, "ZV2": (lev/5*2).toFixed(1), "ZV1": (lev/5).toFixed(1), "Color": "a1e67e" },
                            //{ "ZClass": 13, "ZV2": (lev/5*3).toFixed(1), "ZV1": (lev/5*2).toFixed(1), "Color": "99e673" },
                            //{ "ZClass": 14, "ZV2": (lev/5*4).toFixed(1), "ZV1": (lev/5*3).toFixed(1), "Color": "91e667" },
                            //{ "ZClass": 15, "ZV2": (lev/5*5).toFixed(1), "ZV1": (lev/5*4).toFixed(1), "Color": "8ae65c" },
                            //{ "ZClass": 21, "ZV2": (lev*2/5*1).toFixed(1), "ZV1": (lev/5*5).toFixed(1), "Color": "b3d1ff" },
                            //{ "ZClass": 22, "ZV2": (lev*2/5*2).toFixed(1), "ZV1": (lev*2/5*1).toFixed(1), "Color": "a6c9ff" },
                            //{ "ZClass": 23, "ZV2": (lev*2/5*3).toFixed(1), "ZV1": (lev*2/5*3).toFixed(1), "Color": "99c2ff" },
                            //{ "ZClass": 24, "ZV2": (lev*2/5*4).toFixed(1), "ZV1": (lev*2/5*3).toFixed(1), "Color": "8cbaff" },
                            //{ "ZClass": 25, "ZV2": (lev*2/5*5).toFixed(1), "ZV1": (lev*2/5*4).toFixed(1), "Color": "80b3ff" },
                            //{ "ZClass": 31, "ZV2": (lev*3/5*1).toFixed(1), "ZV1": (lev*2/5*5).toFixed(1), "Color": "ffff80" },
                            //{ "ZClass": 32, "ZV2": (lev*3/5*2).toFixed(1), "ZV1": (lev*3/5*1).toFixed(1), "Color": "ffff6e" },
                            //{ "ZClass": 33, "ZV2": (lev*3/5*3).toFixed(1), "ZV1": (lev*3/5*2).toFixed(1), "Color": "ffff5c" },
                            //{ "ZClass": 34, "ZV2": (lev*3/5*4).toFixed(1), "ZV1": (lev*3/5*3).toFixed(1), "Color": "ffff47" },
                            //{ "ZClass": 35, "ZV2": (lev*3/5*5).toFixed(1), "ZV1": (lev*3/5*4).toFixed(1), "Color": "ffff33" },
                            //{ "ZClass": 41, "ZV2": (lev*4/5*1).toFixed(1), "ZV1": (lev*3/5*5).toFixed(1), "Color": "ffdfb3" },
                            //{ "ZClass": 42, "ZV2": (lev*4/5*2).toFixed(1), "ZV1": (lev*4/5*1).toFixed(1), "Color": "ffdaa6" },
                            //{ "ZClass": 43, "ZV2": (lev*4/5*3).toFixed(1), "ZV1": (lev*4/5*2).toFixed(1), "Color": "ffd599" },
                            //{ "ZClass": 44, "ZV2": (lev*4/5*4).toFixed(1), "ZV1": (lev*4/5*3).toFixed(1), "Color": "ffcf8c" },
                            //{ "ZClass": 45, "ZV2": (lev*4/5*5).toFixed(1), "ZV1": (lev*4/5*4).toFixed(1), "Color": "ffca80" },
                            //{ "ZClass": 51, "ZV2": (lev*5/5*1).toFixed(1), "ZV1": (lev*4/5*5).toFixed(1), "Color": "ff8080" },
                            //{ "ZClass": 52, "ZV2": (lev*5/5*2).toFixed(1), "ZV1": (lev*5/5*1).toFixed(1), "Color": "ff7573" },
                            //{ "ZClass": 53, "ZV2": (lev*5/5*3).toFixed(1), "ZV1": (lev*5/5*2).toFixed(1), "Color": "ff6966" },
                            //{ "ZClass": 54, "ZV2": (lev*5/5*4).toFixed(1), "ZV1": (lev*5/5*4).toFixed(1), "Color": "ff5c59" },
                            //{ "ZClass": 55, "ZV2": (lev*5/5*5).toFixed(1), "ZV1": (lev*5/5*4).toFixed(1), "Color": "ff4d4d" }
                            //],
                            "XYZ":XYZdata
                        }},
                        dataType:"json",
                        async : false,
                        success: function (jsondata) {
                            //console.log(jsondata);
                            if(jsondata.Success == true){
                                imgUrl = jsondata.Map.DZM.Img1;
                                extent = jsondata.Map.DZM.Extent.split(',');
                                imageUrl = DZXUrl+'OutPut/'+imgUrl;
                                var chunk = function (array, size) {
                                    var result = [];
                                    for (var x = 0; x < Math.ceil(array.length / size); x++) {
                                        var start = x * size;
                                        var end = start + size;
                                        result.push(array.slice(start, end).reverse());
                                    }
                                    return result;
                                };
                                imageBounds = chunk(extent, 2);
                                imgUrlArray.push(imageUrl);
                                imageLayer = L.imageOverlay(imageUrl, imageBounds,{
                                    opacity:opacity
                                });
                                imageLayerArray.push(imageLayer);

                                var arer = jsondata.Map.AREA.replace(/\|/g,'-').split(';');
                                //console.log(jsondata.Map.AREA);
                                var str = '';
                                for(var i = 0; i<arer.length;i++){
                                    var aaa = arer[i].split(',');
                                    str += '<div class="rsc"> ' +
                                        '<div class="rsc1">'+(i+1)+'</div> ' +
                                        '<div class="rsc2">'+aaa[0]+'</div> ' +
                                        '<div class="rsc2">'+aaa[1]+'</div> ' +
                                        '</div>'
                                }
                                $('.rainShroudContent').html(str);

                            }else {
                                $.toast({
                                    text: '绘制过程出错!',
                                    icon: 'info',
                                    position: "mid-left",
                                    stack: false,
                                    allowToastClose: false,
                                    loader: false,
                                    bgColor: "#FF0000",
                                    textColor: "#fff"
                                });
                            }
                        }
                    });

                }else{
                    $.toast({
                        text: '请选择绘制级别!',
                        icon: 'info',
                        position: "mid-left",
                        stack: false,
                        allowToastClose: false,
                        loader: false,
                        bgColor: "#FF0000",
                        textColor: "#fff"
                    });
                    return
                }
            }

            groups.addLayer(imageLayerArray[0]);
        }else {
            $.toast({
                text: '请按步骤执行!',
                icon: 'info',
                position: "mid-left",
                stack: false,
                allowToastClose: false,
                loader: false,
                bgColor: "#FF0000",
                textColor: "#fff"
            });
        }


    });


    $('.barBtn').mousemove(function(){
        //console.log(selectIndex);

        opacity = parseFloat($('.ec1_6').text()/100,2);
        //console.log(opacity);
        if(imageLayerArray != null) {
            imageLayerArray[selectIndex].setOpacity(opacity);
        }
    });

    // 清空等值面
    $('#clearBtn').click(function(){
        groups.clearLayers();
    });

    // 时间选择 数据切换
    selectTime.change(function(){
        groups.clearLayers();
        subData = [];
        var newData = stcdObj[selectTime.getValue()];
        selectIndex = selectTime.getIndex();
        console.log(selectIndex);
        //console.log(imageLayerArray[selectIndex]);
        groups.addLayer(imageLayerArray[selectIndex]);
        var str = '';
        for(var i = 0; i < newData.length; i++){
            var subArr = [];
            var newObj = {};
            var id = newData[i].ID;
            newObj.stnm = baseObj[id].STNM;
            newObj.lgtd = baseObj[id].LGTD;
            newObj.lttd = baseObj[id].LTTD;
            subArr = [baseObj[id].LGTD,baseObj[id].LTTD,newData[i].Z];
            subData.push(subArr);
            str +='<div class="rdc"> ' +
                '<div class="rdc1"><input type="checkbox" id="checkbox-3-'+i+'" class="regular-checkbox" inSelected="'+newData[i].InSelected +'" /><label for="checkbox-3-'+i+'"></label></div> ' +
                '<div class="rdc2 stnm">'+newObj.stnm+'</div> ' +
                '<div class="rdc2">嵊州市</div> ' +
                '<div class="rdc2">'+newData[i].Z+'</div> ' +
                '</div>';
        }
        $('.rainDrawContent').html(str);
        $(".rdc1 input[inSelected='1']").attr("checked","'true'");
    });

    var faultFunction = function(){

    };

    // 鼠标移动到站名上，显示提示信息
    $('.nav_content').on('mousemove','.stnm',function(e){
        $('.tdTips p').html("点击站点定位");
        $('.tdTips').show().css({
            left:(e.pageX-5)+'px',
            top: (e.pageY -$('.tdTips').height()-30 )+'px'
        });
    });

    // 鼠标移动出站名，隐藏提示信息
    $('.nav_content').on('mouseout','.stnm',function(e){
        $('.tdTips').hide();
    });
    //test_getData()

});

function sortNum(a,b) {
    return b - a; //降序 ，如升序，把“b - a”该成“a - b”
}

//获取单张图数据
function test_getData() {
    url = DZXUrl+"api/getdata";
    $.post(url, {
            DATA: {
                "Addvcd": "331022",
                "Tm1": "201703220800",
                "Tm2": "201703250800",
                "DataType": "ALL",
                "MinDist": 30,
            }
        },
        function (jsondata) {
            //console.log(jsondata)
        });
}

//获取多张图数据
function test_getDatas() {
    url = DZXUrl+"api/getdatas";
    $.post(url, {
            DATA: {
                "Addvcd": "331022",
                "Tm1": "201703220800",
                "Tm2": "201703250800",
                "Freq": 1,
                "FreqHour":8,
                "MinDist": 30,
            }
        },
        function (jsondata) {
            //console.log(jsondata)
            for(var i = 0; i < jsondata.STCD.length; i++){
                var stcd = jsondata.STCD[i].ID;
                var stnm = ee[stcd].STNM;
            }
        });
}

//获取所有站点的详细信息，坐标，名称
function test_getSTBPRP() {
    url = DZXUrl+"api/getstbprp";
    $.post(url, {
            DATA: {
                "RegionType":"XZ",
                "RegionContent": ["331022"],
            }
        },
        function (jsondata) {
            //console.log(jsondata);
            var baseArr = jsondata.STBPRP;
            for(var i = 0; i < baseArr.length; i++){
                baseObj[baseArr[i].STCD] = baseArr[i];
            }
        });
}

//计算雨量级别值
function getLevVal (num){
    var levVal ;
    if(num <= 5 ){
        levVal = 1;
    }else if(num > 5 && num <= 10){
        levVal = 2;
    }else if(num > 10 && num <= 25){
        levVal = 5;
    }else if(num > 25 && num <= 50){
        levVal = 10;
    }else if(num > 50 && num <= 75){
        levVal = 15;
    }else if(num > 75 && num <= 100){
        levVal = 20;
    }else if(num > 100 && num <= 125){
        levVal = 25;
    }else {
        levVal = 30;
    }

    $('#rainLev').val(levVal);
    $('.rrc2_1').val(levVal);
    $('.rrc2_2').val(2*levVal);
    $('.rrc2_3').val(3*levVal);
    $('.rrc2_4').val(4*levVal);
    $('.rrc2_5').val(5*levVal);
    $('.rrc2_6').val(6*levVal);
}

function getZVColors(){
    var lev_1 = parseInt($('.rrc2_1').val());
    var lev_2 = parseInt($('.rrc2_2').val()-$('.rrc2_1').val());
    var lev_3 = parseInt($('.rrc2_3').val()-$('.rrc2_2').val());
    var lev_4 = parseInt($('.rrc2_4').val()-$('.rrc2_3').val());
    var lev_5 = parseInt($('.rrc2_5').val()-$('.rrc2_4').val());
    var val_2 = parseInt($('.rrc2_2').val());
    var val_3 = parseInt($('.rrc2_3').val());
    var val_4 = parseInt($('.rrc2_4').val());
    var val_5 = parseInt($('.rrc2_5').val());

    if($('#checkbox-2-1').is(':checked')){

        ZVColors.push({ "ZClass": 11, "ZV2": (lev_1/5*1), "ZV1": 0, "Color": "a8e68a" });
        ZVColors.push({ "ZClass": 12, "ZV2": (lev_1/5*2), "ZV1": (lev_1/5*1), "Color": "a1e67e" });
        ZVColors.push({ "ZClass": 13, "ZV2": (lev_1/5*3), "ZV1": (lev_1/5*2), "Color": "99e673" });
        ZVColors.push({ "ZClass": 14, "ZV2": (lev_1/5*4), "ZV1": (lev_1/5*3), "Color": "91e667" });
        ZVColors.push({ "ZClass": 15, "ZV2": (lev_1/5*5), "ZV1": (lev_1/5*4), "Color": "8ae65c" });
    }else {
        console.log(1111111111)
    }
    if($('#checkbox-2-2').is(':checked')){

        ZVColors.push({ "ZClass": 21, "ZV2": (lev_1+parseFloat(lev_2/5*1)), "ZV1": (lev_1), "Color": "b3d1ff" });
        ZVColors.push({ "ZClass": 22, "ZV2": (lev_1+lev_2/5*2), "ZV1": (lev_1+parseFloat(lev_2/5*1)), "Color": "a6c9ff" });
        ZVColors.push({ "ZClass": 23, "ZV2": (lev_1+lev_2/5*3), "ZV1": (lev_1+lev_2/5*2), "Color": "99c2ff" });
        ZVColors.push({ "ZClass": 24, "ZV2": (lev_1+lev_2/5*4), "ZV1": (lev_1+lev_2/5*3), "Color": "8cbaff" });
        ZVColors.push({ "ZClass": 25, "ZV2": (lev_1+lev_2/5*5), "ZV1": (lev_1+lev_2/5*4), "Color": "80b3ff" });
    }else {
        console.log(222222222)
    }
    if($('#checkbox-2-3').is(':checked')){

        ZVColors.push({ "ZClass": 31, "ZV2": (val_2+lev_3/5*1), "ZV1": (val_2), "Color": "ffff80" });
        ZVColors.push({ "ZClass": 32, "ZV2": (val_2+lev_3/5*2), "ZV1": (val_2+lev_3/5*1), "Color": "ffff6e" });
        ZVColors.push({ "ZClass": 33, "ZV2": (val_2+lev_3/5*3), "ZV1": (val_2+lev_3/5*2), "Color": "ffff5c" });
        ZVColors.push({ "ZClass": 34, "ZV2": (val_2+lev_3/5*4), "ZV1": (val_2+lev_3/5*3), "Color": "ffff47" });
        ZVColors.push({ "ZClass": 35, "ZV2": (val_2+lev_3/5*5), "ZV1": (val_2+lev_3/5*4), "Color": "ffff33" });
    }else {
        console.log(33333333)
    }
    if($('#checkbox-2-4').is(':checked')){

        ZVColors.push({ "ZClass": 41, "ZV2": (val_3+lev_4/5*1), "ZV1": (val_3), "Color": "ffdfb3" });
        ZVColors.push({ "ZClass": 42, "ZV2": (val_3+lev_4/5*2), "ZV1": (val_3+lev_4/5*1), "Color": "ffdaa6" });
        ZVColors.push({ "ZClass": 43, "ZV2": (val_3+lev_4/5*3), "ZV1": (val_3+lev_4/5*2), "Color": "ffd599" });
        ZVColors.push({ "ZClass": 44, "ZV2": (val_3+lev_4/5*4), "ZV1": (val_3+lev_4/5*3), "Color": "ffcf8c" });
        ZVColors.push({ "ZClass": 45, "ZV2": (val_3+lev_4/5*5), "ZV1": (val_3+lev_4/5*4), "Color": "ffca80" });
    }else {
        console.log(444444444)
    }
    if($('#checkbox-2-5').is(':checked')){

        ZVColors.push({ "ZClass": 51, "ZV2": (val_4+lev_5/5*1), "ZV1": (val_4), "Color": "ff8080" });
        ZVColors.push({ "ZClass": 52, "ZV2": (val_4+lev_5/5*2), "ZV1": (val_4+lev_5/5*1), "Color": "ff7573" });
        ZVColors.push({ "ZClass": 53, "ZV2": (val_4+lev_5/5*3), "ZV1": (val_4+lev_5/5*2), "Color": "ff6966" });
        ZVColors.push({ "ZClass": 54, "ZV2": (val_4+lev_5/5*4), "ZV1": (val_4+lev_5/5*3), "Color": "ff5c59" });
        ZVColors.push({ "ZClass": 55, "ZV2": (val_4+lev_5/5*5), "ZV1": (val_4+lev_5/5*4), "Color": "ff4d4d" });
    }else {
        console.log(555555555555)
    }
}




