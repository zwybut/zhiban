/**
 * Created by Dell on 2016/12/2.
 */

var baseUrl = parent.baseUrl;
var curModelId = "ZoneRainInfo";
var curBigClass = "RainReport";
var ZoneType = null;
var FixTimeSel = null;
var ZoneStcdSel = null;
var StcdSel = null;
var AllStcdSel = null;
var editor1;
var zoneName = "嵊州市";
var departName = "嵊州市水文站";
var ReportName = "";
var reportClassList = {};  // 报表类列表
var reportName = "";
var allStation = {};
$(function(){
    var myeditor_maxHeight=$('.AnalyzeBox').height()-$('.AnalyzeBox h3').height()-($('.category').height()+1)-$('.operation').height();

    $("#myeditorbox").css("height",myeditor_maxHeight+"px");
    $('#myeditor').height($("#myeditorbox").height()-2);
    $('#myeditor').width($("#myeditorbox").width()-2);


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

    ZoneType = $("#ZoneType").customSelect({width:72,lineHeight:24});       //分乡镇
    FixTimeSel = $("#FixTimeSel").customSelect({width:72,lineHeight:24});   //时间选择
    ZoneStcdSel = $("#ZoneStcdSel").customSelect({width:72,lineHeight:24}); //计算站点
    StcdSel = $("#Stcd").customSelect({width:72,lineHeight:24});             //站点选择


    $('.reportFormContent').eq(0).show();
    $(".rft3").eq(0).addClass('active');

    //报表选择菜单
    $('.reportFormTitle').click(function() {
        var index=$('.reportFormTitle').index(this);
        if ($('.reportFormContent').eq(index).css('display') == 'none') {
            $(".rft3").removeClass('active').eq(index).addClass('active');
            $('.reportFormContent').slideUp().eq(index).slideDown();
            $(this).addClass('active').siblings().removeClass('active');
        } else {
            $(".rft3").removeClass('active');
            $('.reportFormContent').slideUp();
            $(this).removeClass('active');
        }
    });

    $('.reportFormContent').find('li').click(function(){
        $(".reportFormContent").find("li").removeClass('active');
        $(this).addClass('active');
        loadModel($(this).text(),$(this).attr("modelId"),$(this).parent().parent().attr("type"));
    });


    getAllStationList();

    FixTimeSel.change(function(){
        var fixTime = parseInt(FixTimeSel.getValue());
        if(fixTime==-2){
            $('#setTime').fadeIn();
        }else {
            $('#setTime').fadeOut();
            var startTime, endTime;
            var nowTime = new Date();
            switch (fixTime) {
                case 0:
                    if (nowTime.getHours() >= 8) startTime = nowTime.Format("yyyy-MM-dd 08:00");
                    else startTime = nowTime.DateAdd("day", -1).Format("yyyy-MM-dd 08:00");
                    endTime = nowTime.Format("yyyy-MM-dd hh:00");
                    break;
                case 1:
                    if (nowTime.getHours() >= 8) {
                        startTime = nowTime.DateAdd("day", -1).Format("yyyy-MM-dd 08:00");
                        endTime = nowTime.Format("yyyy-MM-dd 08:00");
                    } else {
                        startTime = nowTime.DateAdd("day", -2).Format("yyyy-MM-dd 08:00");
                        endTime = nowTime.DateAdd("day", -1).Format("yyyy-MM-dd 08:00");
                    }
                    break;
                case 2:
                    if (new Date().getHours() >= 8) {
                        startTime = new Date().DateAdd("day", -2).Format("yyyy-MM-dd 08:00");
                        endTime = new Date().Format("yyyy-MM-dd 08:00");
                    } else {
                        startTime = new Date().DateAdd("day", -3).Format("yyyy-MM-dd 08:00");
                        endTime = new Date().DateAdd("day", -1).Format("yyyy-MM-dd 08:00");
                    }
                    break;
                case 3:
                    if (new Date().getHours() >= 8) {
                        startTime = new Date().DateAdd("day", -3).Format("yyyy-MM-dd 08:00");
                        endTime = new Date().Format("yyyy-MM-dd 08:00");
                    } else {
                        startTime = new Date().DateAdd("day", -4).Format("yyyy-MM-dd 08:00");
                        endTime = new Date().DateAdd("day", -1).Format("yyyy-MM-dd 08:00");
                    }
                    break;
                case 4:
                    if (new Date().getHours() >= 8) {
                        startTime = new Date().DateAdd("day", -4).Format("yyyy-MM-dd 08:00");
                        endTime = new Date().Format("yyyy-MM-dd 08:00");
                    } else {
                        startTime = new Date().DateAdd("day", -5).Format("yyyy-MM-dd 08:00");
                        endTime = new Date().DateAdd("day", -1).Format("yyyy-MM-dd 08:00");
                    }
                    break;
                default:
                    if (nowTime.getHours() >= 8) {
                        startTime = nowTime.DateAdd("day", -1).Format("yyyy-MM-dd 08:00");
                        endTime = nowTime.Format("yyyy-MM-dd 08:00");
                    } else {
                        startTime = nowTime.DateAdd("day", -2).Format("yyyy-MM-dd 08:00");
                        endTime = nowTime.DateAdd("day", -1).Format("yyyy-MM-dd 08:00");
                    }

            }
            $("#StartTime").textbox('setValue', startTime);
            $("#EndTime").textbox('setValue', endTime);
        }
    });

    $('#StartTime').datetimebox({
        showSeconds: false,
        required: true,
        editable:false,
        value: new Date().DateAdd("day", -1).Format("yyyy-MM-dd 08:00")
    });

    $('#EndTime').datetimebox({
        showSeconds: false,
        required: true,
        editable:false,
        value: new Date().Format("yyyy-MM-dd hh:00")
    });

    $('#StartDate').datebox({
        required: true,
        editable:false,
        value: new Date().DateAdd("day", -1).Format("yyyy-MM-dd")
    });

    $('#EndDate').datebox({
        required: true,
        editable:false,
        value: new Date().Format("yyyy-MM-dd")
    });

    $('#FixTime').datetimebox({
        showSeconds: false,
        required: true,
        editable:false,
        value: new Date().Format("yyyy-MM-dd 08:00")
    });

    $('#MinRain').numberbox({
        min: 0,
        max: 100
    });

    $('#Blc').numberbox({
        min: 0.5,
        max: 1,
        precision: 2
    });
    $.extend($.fn.textbox.defaults.rules, {
        equals: {
            validator: function(value){
                return value.split(',').length == 5;
            },
            message: '必须输入5个数值，用逗号隔开'
        }
    });
    $('#BlcList').textbox({
        required: true,
        validType:'equals',
        initValue:'0.5,0.6,0.65,0.7,0.8'
    });

    KindEditor.ready(function (K) {
        editor1 = K.create('#myeditor', {
            cssPath: '../../Plugins/kindeditor/plugins/code/prettify.css',
            uploadJson: '../../FloodAnalyze/upload_json.ashx',
            fileManagerJson: '../../FloodAnalyze/file_manager_json.ashx',
            allowFileManager: true,
            afterCreate: function () {
                var self = this;
                K.ctrl(document, 13, function () {
                    self.sync();
                    K('form[name=ReportForm]')[0].submit();
                });
                K.ctrl(self.edit.doc, 13, function () {
                    self.sync();
                    K('form[name=ReportForm]')[0].submit();
                });
                produceReport();
            }
        });
    });

    // 点击发布公告
    $("#submitInfo").on("click",function(){
        produceReport();
    });

    // 得到所有报表类别信息
    getReportClassList();



});

// 得信到所有报表类别息
var getReportClassList = function(){
    var dtd = $.Deferred();
    $.ajax({
        url: baseUrl+"floodProfAnalyzSys/backStageManageShow/resultManage/getFloodAchieveClassInfo.do",
        type:"get",
        success:function(jsonData){
            // 得到报表中所有的大类
            reportClassList = {};
            for(var i=0;i<jsonData.length;i++){
                var ClassObj = {};
                if(jsonData[i].rptClass=="Large"){
                    ClassObj.name = jsonData[i].name;
                    ClassObj.id = jsonData[i].id;
                    ClassObj.children = [];
                    reportClassList[ClassObj.id] = ClassObj;
                }
            }
            //　把小类入到大类中
            for(var i=0;i<jsonData.length;i++){
                var ClassObj = {};
                if(jsonData[i].rptClass=="small"){
                    ClassObj.name = jsonData[i].name;
                    ClassObj.id = jsonData[i].id;
                    reportClassList[jsonData[i].parentId].children.push(ClassObj);
                }
            }
            dtd.resolve();
        },
        error:function(){

        },
        complete:function(){

        }
    });
    return dtd;
};

// 得到所有站点的信息
var getAllStationList = function(){
    $.ajax({
        url:baseUrl+"comm/baseInfo/getStationBaseInfoByCondition.do",
        data:{},
        type: "Post",
        success: function (jsonData) {
            var options = [];
            var phcd = "";
            if(jsonData.stationBaseInfo==null) return;
            var jsonData = jsonData.stationBaseInfo;
            for(var i=0;i<jsonData.length;i++){
                if(jsonData[i].phcd!=""||jsonData[i].phcd!=null) phcd = jsonData[i].phcd+"";
                else phcd = "";
                if(phcd!="") phcd = $.trim(phcd).toUpperCase().substr(0,1);
                var option = $("<option value='"+jsonData[i].stcd+"' phcd='" + phcd + "'>("+phcd+")"+jsonData[i].stnm+"</option>");
                options.push(option);
            }
            options.sort(function(a,b){
               if(a.attr("phcd") >= b.attr("phcd")) return 1;
                else return -1;
            });
            for(i=0;i<options.length;i++)
                options[i].appendTo($("#AllStcd"));

            AllStcdSel = $("#AllStcd").customSelect({width:110,lineHeight:24,height:200});

        },
        error: function () {

        },
        complete: function () {


        }
    });
};

// 载入模块
var loadModel = function(modelName,modelId,bigClass){
    $(".AnalyzeBox h3").text(modelName);
    curModelId = modelId;
    curBigClass = bigClass;
    produceReport();
};

// 生成报表
var produceReport = function(){
    var modelId = curModelId;
    var bigClass = curBigClass;
    var fixTime = parseInt(FixTimeSel.getValue());
    (fixTime==-2)?$('#setTime').fadeIn():$('#setTime').fadeOut();
    switch (bigClass) {
        case "RainReport": //雨情

            $("#StcdDiv").hide();// 站点选择的控制

            // 对分区的控制
            if (modelId == "ZoneRainInfo")
            {   ZoneType.show();
                $("#ZoneStcdSelDiv").show();
            }
            else
            {   ZoneType.hide();
                $("#ZoneStcdSelDiv").hide();
            }

            //启止时间控制
            if (modelId == "ZoneStormRain")
                $("#FixTimeSelDiv").hide();
            else
                $("#FixTimeSelDiv").show();

            // 固定时间控制
            if (modelId == "ZoneStormRain")
                $("#FixTimeDiv").show();
            else
                $("#FixTimeDiv").hide();

            // 启止日期的控制
            if (modelId == "RainDayJZ")
                $("#StartEndDateDiv").show();
            else
                $("#StartEndDateDiv").hide();

            // 最小雨量控制
            if (modelId == "StationSumRain")
                $("#MinRainDiv").show();
            else
                $("#MinRainDiv").hide();

            //所有站点选择控制
            if (modelId == "SingleRainJZ")
                $("#AllStcdDiv").show();
            else
                $("#AllStcdDiv").hide();

            if(modelId == "RainDayJZ")
            {
                $("#setDate").show();
                $('#setTime').hide();
            }
            else
                $("#setDate").hide();


            // 经流系数
            $("#BlcDiv").hide();
            // 经流系数列表
            $("#BlcListDiv").hide();

            break;
        case "WaterReport":
            ZoneType.hide(); // 分区选择控制
            $("#ZoneStcdSelDiv").hide(); // 对分区面雨量选择控制
            $("#MinRainDiv").hide(); // 最小雨量控制
            $("#AllStcdDiv").hide(); //所有站点选择


            //启止时间控制
            if (modelId == "FixRiverPLInfo" || modelId == "RsvrPLInfo" ) $("#FixTimeSelDiv").show();
            else $("#FixTimeSelDiv").hide();

            //启止日期控制
            if (modelId == "TideAddZInfo") $("#setDate").show();
            else $("#setDate").hide();

            // 固定时间控制
            if (modelId == "RsvrWarnInfo" || modelId == "RiverWarnInfo" || modelId == "LargeMiddleRsvrAddRain") {$("#FixTimeDiv").show();$('#setTime').hide();}
            else $("#FixTimeDiv").hide();

            // 经流系数
            if (modelId == "LargeMiddleRsvrAddRain") $("#BlcDiv").show();
            else $("#BlcDiv").hide();

            // 经流系数列表
            if (modelId == "LargeMiddleRsvrAddRain") $("#BlcListDiv").show();
            else $("#BlcListDiv").hide();

            // 站点
            $("#StcdDiv").hide();

            break;
        case "FloodReport":
            ZoneType.hide(); // 分区选择控制
            $("#MinRainDiv").hide(); // 最小雨量控制
            $("#AllStcdDiv").hide(); //所有站点选择
            $("#BlcDiv").hide(); // 经流系数
            $("#BlcListDiv").hide(); // 经流系数列表
            $("#ZoneStcdSelDiv").hide(); //计算面雨量站点
            $("#StcdDiv").hide();// 潮位站点控制
            $("#FixTimeDiv").hide(); // 固定时间控制

            //if(modelId == "FloodDetailInfo") $("#setTime").show();
            //else  $("#setTime").hide();
            //
            //if(modelId == "LastFloodInfo") $("#FixTimeSelDiv").show();
            //else  $("#FixTimeSelDiv").hide();
            //
            //if(modelId == "TyphoonFloodInfo") $("#setTime").show();
            //else  $("#setTime").hide();
            //
            //if(modelId == "FloodInfo") $("#setTime").show();
            //else  $("#setTime").hide();
            //
            //if(modelId == "dayRainfallInfo") $("#setTime").show();
            //else  $("#setTime").show();
            //
            //if(modelId == "hourRainfallInfo") $("#setTime").show();
            //else  $("#setTime").show();

            break;
    }

    eval(modelId+"()");
};

// 得到报表内容
function getReportContent(url) {
    //parent.progressOn();
    //console()
    $.get(url, function (data, status) {
        if (data != "") {
            if (data.lastIndexOf("|||") >= 0) {
                var fullData = data.split("|||");
                ReportName = fullData[1];
                $('#ReportName').textbox('setValue', ReportName);
                editor1.html(fullData[0]);
            }
        }
        else
            editor1.html("");
        //parent.progressOff();
    });
}

// 打印报表
function ReportPrint() {
    if (editor1.html() == "") {
        $.messager.show({
            title: '提示',
            msg: '报表内容不能为空，生成报表内容后再打印！！',
            timeout: 3000,
            showType: 'fade'
        });
    }
    else
        editor1.exec("print");
}

// 保存报表
function ReportSave() {
    if (editor1.html() == "") {
        $.messager.show({
            title: '提示',
            msg: '报表内容不能为空，生成报表内容后再保存！！',
            timeout: 3000,
            showType: 'fade'
        });
    }
    else{
        // 保存弹框
        $.when(getReportClassList()).done(function(){
            $.confirmWin({
                width:480,
                height:265,
                title:"保存成果",
                text:"<div class='save_popup'><p>栏&nbsp;&nbsp;&nbsp;&nbsp;目:</p>" +
                "<select id='menu'>" +
                getClassOption(true,null)+
                "</select>" +
                "<p>子栏目:</p>" +
                "<select id='secondMenu'>" +
                getClassOption(false,null)+
                "</select>" +
                "<p>名称:</p>" +
                "<input class='report' id='reportName' value='"+reportName+"'></div>",
                btnVal:"保存",
                submitFn:function(){
                    // 保存报表信息
                    if($("#reportName").val()==""){
                        $.messager.show({
                            title: '提示',
                            msg: '报表名称不能为空，请输入报表名！！',
                            timeout: 3000,
                            showType: 'fade'
                        });
                        return false;
                    }
                    else{
                        return saveReportInfo($("#reportName").val(),secondMenu.getValue());

                    }
                }
            });
            var secondMenu = $("#secondMenu").customSelect({
                width:440,lineHeight:30
            });

            var menu = $("#menu").customSelect({
                width:440,lineHeight:30
            });

            menu.change(function(){
                $("#secondMenu").html(getClassOption(false,this.getValue()));
                secondMenu.refresh();
            });
        });

    }
}

//  保存报表信息
var saveReportInfo = function(reportName,classId){
    var guId = new Date().Format("yyyyMMddhhssS");
    $.ajax({
        url:baseUrl + "floodProfAnalyzSys/floodAnalyzeShow/addFloodAchieveInfo.do",
        type:"Post",
        data:{
            id:guId,
            name:reportName,
            htmlContent:editor1.html(),
            rptClass:"file",
            parentId:classId,
            visitCount:0

        },
        success:function(jsonData){
            if(jsonData==1){
                $.messager.show({
                    title: '提示',
                    msg: '报表保存成功！！',
                    timeout: 3000,
                    showType: 'fade'
                });
            }
        },
        error:function(){
            return false;
        },
        complete:function(){

        }
    });
};

 // 得到报表类型选项
var getClassOption = function(isParent,parentId){
    var optionStr = "";
    if(isParent==true){
        for(var ev in reportClassList){
            optionStr +="<option value='"+ reportClassList[ev].id+"'>"+reportClassList[ev].name+"</option>"
        }
    }else{
        if(parentId==null) {// 如果父结点为空，得到第一个结点
            for (var ev in reportClassList) {
                parentId = ev;
                break;
            }
        }
        for(var i=0;i<reportClassList[parentId].children.length;i++){
            var ev = reportClassList[parentId].children[i];
            optionStr +="<option value='"+ev.id+"'>"+ev.name+"</option>"
        }
    }
    return optionStr;
};

// 导出报表
function ReportExport() {
    if (editor1.html() == "") {
        $.messager.show({
            title: '提示',
            msg: '报表内容不能为空，生成报表内容后再导出！！',
            timeout: 3000,
            showType: 'fade'
        });
    } else {
        $.when(getReportClassList()).done(function(){
            var file;

            try {
                file = new Blob(["\ufeff" + editor1.html()], { type: "application/x-xls;charset=utf-8" });
                saveAs(file, reportName+".xls");
            }
            catch (e) {
                saveTextAs("\ufeff" + editor1.html(), reportName + ".xls");
            }

            $.messager.show({
                title: '提示',
                msg: '报表内容成功导出！！',
                timeout: 3000,
                showType: 'fade'
            });
        })
    }
}

// 得到时间字符串
var getTimeStr = function(startTime,endTime){
    var timeStr = "";
    var StartPointTime = new Date(startTime);
    var EndPointTime = new Date(endTime);
    // 得到开始与结束时间
    if (StartPointTime.getFullYear() != EndPointTime.getFullYear()) //如果不是同一年，显示年份
    {
        timeStr = StartPointTime.Format("yyyy年M月d日h时") + "～" + EndPointTime.Format("yyyy年M月d日h时");
    }
    else
    {
        if (StartPointTime.getMonth() != EndPointTime.getMonth())
            timeStr = StartPointTime.Format("yyyy年M月d日h时") + "～" + EndPointTime.Format("M月d日h时");
        else
            timeStr = StartPointTime.Format("yyyy年M月d日h时") + "～" + EndPointTime.Format("d日h时");
    }
    return timeStr;
};

// 分区雨量统计
var ZoneRainInfo = function(){
    var startTime = $("#StartTime").textbox('getValue');
    var endTime = $("#EndTime").textbox('getValue');
    var timeStr = getTimeStr(startTime,endTime);

    //parent.progressOn();
    $.ajax({
       url:baseUrl+"floodProfAnalyzSys/floodAnalyzeShow/getZoneRain.do",
        data:{
            zoneType:ZoneType.getValue(),
            startTime:startTime,
            endTime:endTime,
            zoneStcd:ZoneStcdSel.getValue()
        },
        type:"Post",
        success: function (jsonData) {
            console.log(jsonData)
            var ReportContent = "";
            var rCount =jsonData.length;
            var ZoneTypeValue = ZoneType.getValue();
            // 生成报表内容
            if (rCount > 0)
            {
                var i;
                ReportContent += "<table border=0.5 align=center id='ReportTable'>";
                if (ZoneTypeValue == "XS"){
                    ReportContent += "<tr><td style='font-size:21px'align=center><b>" + zoneName + timeStr + "各乡镇雨量统计表</b></td></tr>";
                    reportName = zoneName + timeStr + "各乡镇雨量统计表";
                }
                else{
                    ReportContent += "<tr><td style='font-size:21px'align=center><b>" + zoneName + timeStr + "各河流雨量统计表</b></td></tr>";
                    reportName = zoneName + timeStr + "各河流雨量统计表";
                }

                ReportContent += "<tr><td style='font-size:13px' align=right><b>数据类型：遥测数据&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;单位：毫米</b><td></tr>";
                ReportContent += "<tr><td>";

                ReportContent += "<table border='1' align=center style='border-collapse: collapse;font-size:13px;' bordercolor='#000000' width='790' >";

                // 输出表头
                ReportContent += "<tr style='Font-size:14px'>";
                if (ZoneTypeValue == "XS")
                    ReportContent += "<td  width='65' align='center' height=40><b>乡镇名</b></td>";
                else
                    ReportContent += "<td  width='65' align='center'><b>流域名</b></td>";

                ReportContent += "<td  width='60' align='center'><b>面雨量</b></td>";

                ReportContent += "<td  width='600' align='center'><b>累计最大雨量站点</b></td>";

                for (i = 0; i < rCount; i++)
                {
                    ReportContent += "<tr style='font-size:15px'>";
                    ReportContent += "<td height=40 align=center>" + jsonData[i].name + "</td>";
                    if (jsonData[i].avValue!=null) ReportContent += "<td align=center>" + jsonData[i].avValue + "</td>";
                    else ReportContent += "<td align=center>-</td>";
                    if (jsonData[i].stationLis!=null) ReportContent += "<td align=left>" + jsonData[i].stationLis + "</td>";
                    else ReportContent += "<td align=left>&nbsp;-</td>";
                    ReportContent += "</tr>";
                }

                ReportContent += "</table>";

                ReportContent += "</td></tr>";

                ReportContent += "<tr><td style='font-size:14px'align=right >"+departName+"&nbsp;&nbsp;</td></tr>";
                ReportContent += "<tr><td style='font-size:14px'align=right>" + new Date().Format("yyyy-MM-dd hh:mm") + "&nbsp;&nbsp;</td></tr>";
                ReportContent += "</table>";

            }else{
                ReportContent += "<table border=0 align=center>";
                ReportContent += "<tr><td style='font-size:15px'align=center><b>该时间段没有下雨</b></td></tr>";
                ReportContent += "</table>";
            }
            editor1.html(ReportContent);

        },
        error: function () {

        },
        complete: function () {
            //parent.progressOff();
        }

    });
};

// 雨量时段极值
var RainHourJZ = function(){
    var startTime = $("#StartTime").textbox('getValue');
    var endTime = $("#EndTime").textbox('getValue');
    var timeStr = getTimeStr(startTime,endTime);
    var nntStr = "1,3,6,12";
    //parent.progressOn();
    $.ajax({
        url:baseUrl+"floodProfAnalyzSys/floodAnalyzeShow/getHourJZ.do",
        data:{
            nntStrs:nntStr,
            startTime:startTime,
            endTime:endTime,
        },
        type:"Post",
        success: function (jsonData) {

            var ReportContent = "";
            var rCount =jsonData.length;
            var i;
            reportName = zoneName + timeStr + "时段雨量极值统计表";
            // 生成报表内容
            if (rCount > 0)
            {
                ReportContent += "<table border=0.5 align=center width='710'>";
                ReportContent += "<tr><td></td></tr>";
                ReportContent += "<tr><td style='font-size:20px'align=center><b>" + zoneName + timeStr + "时段雨量极值统计表</b></td></tr>";
                ReportContent += "<tr><td>";

                ReportContent += "<table border='1' align=center style='border-collapse: collapse;font-size:13px' bordercolor='#000000' >";
                // 输出表头
                ReportContent += "<tr style='Font-size:13px'>";
                ReportContent += "<td  width='60' align='center' height=30><b>时段名</b></td>";
                ReportContent += "<td  width='80' align='center'><b>列名</b></td>";
                ReportContent += "<td  width='95' align='center'><b>第一位</b></td>";
                ReportContent += "<td  width='95' align='center'><b>第二位</b></td>";
                ReportContent += "<td  width='95' align='center'><b>第三位</b></td>";
                ReportContent += "<td  width='95' align='center'><b>第四位</b></td>";
                ReportContent += "<td  width='95' align='center'><b>第五位</b></td>";
                ReportContent += "<td  width='95' align='center'><b>第六位</b></td>";
                ReportContent += "</tr>";
                var nntArray = nntStr.split(",");
                var ResultStr = "";

                for(var j=0;j<nntArray.length;j++){
                    ResultStr += "<tr style='font-size:13px'>";

                    // 输出第一行-站名
                    ResultStr += "<td rowspan=3 align='center'>" + nntArray[j] + "小时</td>";
                    ResultStr += "<td align='center'>站点</td>";
                    for (i = 0; i < 6; i++)
                    {
                        if(typeof jsonData[j].value[i]!=undefined && jsonData[j].value[i]!=null){
                            if (typeof jsonData[j].value[i].stnm !=undefined && jsonData[j].value[i].stnm!=null)
                                ResultStr += "<td align='center'>" + jsonData[j].value[i].stnm + "</td>";
                            else ResultStr += "<td ></td>";
                        }else ResultStr += "<td ></td>";

                    }
                    ResultStr += "</tr>";
                    // 输出第二行-时间
                    ResultStr += "<tr style='font-size:13px'>";
                    ResultStr += "<td align='center'>出现时间</td>";
                    for (i = 0; i < 6; i++)
                    {
                        if(typeof jsonData[j].value[i]!=undefined && jsonData[j].value[i]!=null){
                            if (typeof jsonData[j].value[i].tm1 !=undefined &&typeof jsonData[j].value[i].tm2 !=undefined && jsonData[j].value[i].tm1!=null&&jsonData[j].value[i].tm2!=null){
                                var jzTimeStr = new Date(jsonData[j].value[i].tm1).Format("M月d日h时") + "～" + new Date(jsonData[j].value[i].tm2).Format("M月d日h时");
                                ResultStr += "<td align='center'>" +jzTimeStr + "</td>";
                            }else ResultStr += "<td ></td>";
                        }else ResultStr += "<td ></td>";
                    }
                    ResultStr += "</tr>";

                    // 输出第三行-雨量
                    ResultStr += "<tr style='font-size:13px'>";
                    ResultStr += "<td align='center'>极值</td>";
                    for (i = 0; i < 6; i++)
                    {
                        if(typeof jsonData[j].value[i]!=undefined && jsonData[j].value[i]!=null){
                            if (typeof jsonData[j].value[i].zr !=undefined && jsonData[j].value[i].zr!=null)
                                ResultStr += "<td align='center'>" + jsonData[j].value[i].zr + "</td>";
                            else ResultStr += "<td ></td>";
                        }else ResultStr += "<td ></td>";
                    }
                    ResultStr += "</tr>";
                }

                ReportContent+=ResultStr;

                ReportContent += "</table>";

                ReportContent += "</td></tr>";

                ReportContent += "<tr><td style='font-size:14px'align=right >"+departName+"&nbsp;&nbsp;</td></tr>";
                ReportContent += "<tr><td style='font-size:14px'align=right>" + new Date().Format("yyyy-MM-dd hh:mm") + "&nbsp;&nbsp;</td></tr>";
                ReportContent += "</table>";

            }else{
                ReportContent += "<table border=0 align=center>";
                ReportContent += "<tr><td style='font-size:15pt'align=center><b>该时间段没有下雨</b></td></tr>";
                ReportContent += "</table>";
            }
            editor1.html(ReportContent);


        },
        error: function () {

        },
        complete: function () {
            //parent.progressOff();
        }
    });
};

// 雨量日极值
var RainDayJZ = function(){
    var startTime = $("#StartDate").datebox('getValue');
    var endTime = $("#EndDate").datebox('getValue');
    var timeStr = getTimeStr(startTime,endTime);
    var nntStr = "1,3,7,15";
    //parent.progressOn();
    $.ajax({
        url:baseUrl+"floodProfAnalyzSys/floodAnalyzeShow/getDayRainJZ.do",
        data:{
            nntStrs:nntStr,
            startTime:startTime,
            endTime:endTime,
        },
        type:"Post",
        success: function (jsonData) {
            var ReportContent = "";
            var rCount =jsonData.length;
            var i;
            // 生成报表内容
            reportName = zoneName + timeStr + "日雨量极值统计表";
            if (rCount > 0)
            {
                ReportContent += "<table border=0.5 align=center width='710'>";
                ReportContent += "<tr><td></td></tr>";
                ReportContent += "<tr><td style='font-size:20px'align=center><b>" + zoneName + timeStr + "日雨量极值统计表</b></td></tr>";
                ReportContent += "<tr><td>";

                ReportContent += "<table border='1' align=center style='border-collapse: collapse;font-size:13px' bordercolor='#000000' >";
                // 输出表头
                ReportContent += "<tr style='Font-size:13px'>";
                ReportContent += "<td  width='60' align='center' height=30><b>时段名</b></td>";
                ReportContent += "<td  width='80' align='center'><b>列名</b></td>";
                ReportContent += "<td  width='95' align='center'><b>第一位</b></td>";
                ReportContent += "<td  width='95' align='center'><b>第二位</b></td>";
                ReportContent += "<td  width='95' align='center'><b>第三位</b></td>";
                ReportContent += "<td  width='95' align='center'><b>第四位</b></td>";
                ReportContent += "<td  width='95' align='center'><b>第五位</b></td>";
                ReportContent += "<td  width='95' align='center'><b>第六位</b></td>";
                ReportContent += "</tr>";
                var nntArray = nntStr.split(",");
                var ResultStr = "";

                for(var j=0;j<nntArray.length;j++){
                    ResultStr += "<tr style='font-size:13px'>";

                    // 输出第一行-站名
                    ResultStr += "<td rowspan=3 align='center'>" + nntArray[j] + "天</td>";
                    ResultStr += "<td align='center'>站点</td>";
                    for (i = 0; i < 6; i++)
                    {
                        if(typeof jsonData[j].value[i]!=undefined && jsonData[j].value[i]!=null){
                            if (typeof jsonData[j].value[i].stnm !=undefined && jsonData[j].value[i].stnm!=null)
                                ResultStr += "<td align='center'>" + jsonData[j].value[i].stnm + "</td>";
                            else ResultStr += "<td ></td>";
                        }else ResultStr += "<td ></td>";

                    }
                    ResultStr += "</tr>";
                    // 输出第二行-时间
                    ResultStr += "<tr style='font-size:13px'>";
                    ResultStr += "<td align='center'>出现时间</td>";
                    for (i = 0; i < 6; i++)
                    {
                        if(typeof jsonData[j].value[i]!=undefined && jsonData[j].value[i]!=null){
                            if (typeof jsonData[j].value[i].tm1 !=undefined &&typeof jsonData[j].value[i].tm2 !=undefined && jsonData[j].value[i].tm1!=null&&jsonData[j].value[i].tm2!=null){
                                var jzTimeStr = new Date(jsonData[j].value[i].tm1).Format("M月d日h时") + "～" + new Date(jsonData[j].value[i].tm2).Format("M月d日h时");
                                ResultStr += "<td align='center'>" +jzTimeStr + "</td>";
                            }else ResultStr += "<td ></td>";
                        }else ResultStr += "<td ></td>";
                    }
                    ResultStr += "</tr>";

                    // 输出第三行-雨量
                    ResultStr += "<tr style='font-size:13px'>";
                    ResultStr += "<td align='center'>极值</td>";
                    for (i = 0; i < 6; i++)
                    {
                        if(typeof jsonData[j].value[i]!=undefined && jsonData[j].value[i]!=null){
                            if (typeof jsonData[j].value[i].zr !=undefined && jsonData[j].value[i].zr!=null)
                                ResultStr += "<td align='center'>" + jsonData[j].value[i].zr + "</td>";
                            else ResultStr += "<td ></td>";
                        }else ResultStr += "<td ></td>";
                    }
                    ResultStr += "</tr>";
                }

                ReportContent+=ResultStr;

                ReportContent += "</table>";

                ReportContent += "</td></tr>";

                ReportContent += "<tr><td style='font-size:14px'align=right >"+departName+"&nbsp;&nbsp;</td></tr>";
                ReportContent += "<tr><td style='font-size:14px'align=right>" + new Date().Format("yyyy-MM-dd hh:mm") + "&nbsp;&nbsp;</td></tr>";
                ReportContent += "</table>";

            }else{
                ReportContent += "<table border=0 align=center>";
                ReportContent += "<tr><td style='font-size:15pt'align=center><b>该时间段没有下雨</b></td></tr>";
                ReportContent += "</table>";
            }
            editor1.html(ReportContent);



        },
        error: function () {

        },
        complete: function () {
            //parent.progressOff();
        }
    });
};

// 分区暴雨统计表
var ZoneStormRain = function(){
    var startTime = $("#StartTime").textbox('getValue');
    var endTime = $("#EndTime").textbox('getValue');
    var nntStr = "1,3,6,12";
    //parent.progressOn();
    $.ajax({
        url:baseUrl+"floodProfAnalyzSys/floodAnalyzeShow/getDayRainJZ.do",
        data:{
            nnt:nntStr,
            startTime:startTime,
            endTime:endTime,
        },
        type:"Post",
        success: function (jsonData) {
            console.log(jsonData);

        },
        error: function () {

        },
        complete: function () {
            //parent.progressOff();
        }
    });
};

// 累计雨量统计表
var StationSumRain = function(){
    var startTime = $("#StartTime").textbox('getValue');
    var endTime = $("#EndTime").textbox('getValue');
    var minRain = $("#MinRain").textbox('getValue');
    //parent.progressOn();
    $.ajax({
        url:baseUrl+"/comm/lastRainInfo/getRainListByCondition.do",
        data:{
            minRain:minRain,
            hours:-1,
            startTime:startTime,
            endTime:endTime,
        },
        type:"Post",
        success: function (jsonData) {
            var ReportContent = "";
            var rCount =jsonData.pptnList.length;
            var jsonData = jsonData.pptnList;
            var timeStr = getTimeStr(startTime,endTime);
            // 生成报表内容
            reportName = zoneName + timeStr + "累积雨量超过" + minRain + "毫米站点统计表";
            if (rCount > 0){
                ReportContent += "<table border=0.5 align=center id='ReportTable'>";
                ReportContent += "<tr><td style='font-size:21px'align=center><b>" + zoneName + timeStr + "累积雨量超过" + minRain + "毫米站点统计表</b></td></tr>";
                ReportContent += "<tr><td style='font-size:11px' align=center><b>" + timeStr + "</b><td></tr>";
                ReportContent += "<tr><td>";
                ReportContent += "<table border='1' align=center style='border-collapse: collapse;font-size:13px' bordercolor='#000000' >";
                // 输出表头
                ReportContent += "<tr style='Font-size:13px'>";
                ReportContent += "<td  width='80' align='center' height=30><b>所属市市</b></td>";
                ReportContent += "<td  width='70' align='center'><b>站名</b></td>";
                ReportContent += "<td  width='70' align='center'><b>累计雨量</b></td>";
                ReportContent += "</tr>";
                // 输出平均雨量
                var avgRain = 0.0;
                for(var i = 0;i < jsonData.length;i++){
                    avgRain += jsonData[i].drp;
                }
                avgRain = avgRain / jsonData.length;
                ReportContent += "<tr style='font-size:13px'>";
                ReportContent += "<td height=25 align=center colspan=2><b>雨量平均值</b></td>";
                ReportContent += "<td align=center><b>" + RthyinfoFormat.formatP(avgRain) + "</b></td>";
                ReportContent += "</tr>";
                // 输出各站雨量
                for(var i = 0;i < jsonData.length;i++){
                    ReportContent += "<tr style='font-size:13px'>";
                    ReportContent += "<td height=25 align=center>" + jsonData[i].addvnm + "</td>";
                    ReportContent += "<td align=center>" + jsonData[i].stnm + "</td>";
                    ReportContent += "<td align=center><b>" + RthyinfoFormat.formatP(jsonData[i].drp) + "</b></td>";
                    ReportContent += "</tr>";
                }
                ReportContent += "</table>";
                ReportContent += "</td></tr>";
                ReportContent += "<tr><td style='font-size:14px'align=right >"+departName+"&nbsp;&nbsp;</td></tr>";
                ReportContent += "<tr><td style='font-size:14px'align=right>" + new Date().Format("yyyy-MM-dd hh:mm") + "&nbsp;&nbsp;</td></tr>";
                ReportContent += "</table>";
            }else{
                ReportContent += "<table border=0 align=center>";
                ReportContent += "<tr><td style='font-size:15pt'align=center><b>该时间段没有降雨</b></td></tr>";
                ReportContent += "</table>";
            }

            editor1.html(ReportContent);

        },
        error: function () {

        },
        complete: function () {
            //parent.progressOff();
        }
    });
};


var filterStnm = function(str){
    return str.substr(3)
};

// 单站暴雨统计表
var SingleRainJZ = function(){
    var startTime = $("#StartTime").textbox('getValue');
    var endTime = $("#EndTime").textbox('getValue');
    var stcd = AllStcdSel.getValue();
    var stnm = filterStnm(AllStcdSel.getText());

    console.log(stnm)
    //parent.progressOn();
    $.ajax({
        url:baseUrl+"floodProfAnalyzSys/floodAnalyzeShow/getSingleHourJZ.do",
        data:{
            stcd:stcd,
            startTime:startTime,
            endTime:endTime,
        },
        type:"Post",
        success: function (jsonData) {
            var ReportContent = "";
            var rCount =jsonData.length;
            var timeStr = getTimeStr(startTime,endTime);
            // 生成报表内容
            reportName = stnm + "站"+ timeStr + "暴雨统计表";
            var i;
            ReportContent += "<table border=0.5 align=center id='ReportTable'>";
            ReportContent += "<tr><td style='font-size:21px'align=center><b>" + stnm + "站"+ timeStr + "暴雨统计表</b></td></tr>";
            ReportContent += "<tr><td>";

            ReportContent += "<table border='1' align=center style='border-collapse: collapse;font-size:13px' bordercolor='#000000' >";

            // 输出表头
            ReportContent += "<tr style='Font-size:13px'>";
            ReportContent += "<td  width='70' align='center' height=30><b>时段</b></td>";
            ReportContent += "<td  width='80' align='center'><b>雨量</b></td>";
            ReportContent += "<td  width='250' align='center'><b>时间</b></td>";
            ReportContent += "</tr>";

            for (i = 0; i < rCount; i++) {
                ReportContent += "<tr style='font-size:13px'>";

                var timeFlag = jsonData[i].timeFlag == "0"?"小时":"天";

                var HourFlag = jsonData[i].hourFlag;

                ReportContent += "<td align='center' height='25'>" + HourFlag + timeFlag + "</td>";
                if(jsonData[i].rainValue >= 30){
                    ReportContent += "<td align='center'>" + RthyinfoFormat.formatP(jsonData[i].rainValue) + "</td>";
                }else{
                    ReportContent += "<td align='center'>-</td>";
                }

                var tmStr = "";
                if(jsonData[i].rainValue >= 30&& jsonData[i].tm1!=null&&jsonData[i].tm2!=null){
                    tmStr = new Date(jsonData[i].tm1).Format("yyyy-MM-dd hh:00")+"~"+new Date(jsonData[i].tm2).Format("MM-dd hh:00")
                }else{
                    tmStr = "-";
                }

                ReportContent += "<td align='center'>" + tmStr + "</td>";

                ReportContent += "</tr>";


            }

            ReportContent += "</table>";

            ReportContent += "</td></tr>";

            ReportContent += "<tr><td style='font-size:14px'align=right >"+departName+"&nbsp;&nbsp;</td></tr>";
            ReportContent += "<tr><td style='font-size:14px'align=right>" + new Date().Format("yyyy-MM-dd hh:mm") + "&nbsp;&nbsp;</td></tr>";
            ReportContent += "</table>";

            editor1.html(ReportContent);


        },
        error: function () {
            editor1.html("");
        },
        complete: function () {
            //parent.progressOff();
        }
    });
};

// 江河水位过程表
var FixRiverPLInfo = function(){
    var startTime = $("#StartTime").textbox('getValue');
    var endTime = $("#EndTime").textbox('getValue');

    //parent.progressOn();
    $.ajax({
        url:baseUrl+"floodProfAnalyzSys/floodAnalyzeShow/getFixRiverPLInfo.do",
        data:{
            startTime:startTime,
            endTime:endTime,
        },
        type:"Post",
        success: function (jsonData) {
            console.log(jsonData);
            var reportContent = "";
            var rCount =jsonData.length;
            var timeStr = getTimeStr(startTime,endTime);
            // 生成报表内容
            reportName = zoneName + timeStr + "主要江河水位过程表";
            if (rCount > 0) {
                var i;
                reportContent += "<table border=0.5 align=center width='1030'>";
                reportContent += "<tr><td style='font-size:20px'align=center><b>" + zoneName + timeStr + "主要江河水位过程表</b></td></tr>";
                var  noteStr = "水位单位：米";
                reportContent += "<tr><td style='font-size:11px' align=right valign=bottom><b>" + noteStr + "</b><td></tr>";
                reportContent += "<tr><td>";

                reportContent += "<table border='1' align=center style='border-collapse: collapse;font-size:13px' bordercolor='#000000' >";
                // 输出表头
                reportContent += "<tr style='Font-size:13px'>";
                reportContent += "<td  width='80' align='center' rowspan=2><b>所属市市</b></td>";
                reportContent += "<td  width='80' align='center' rowspan=2><b>河名</b></td>";
                reportContent += "<td  width='120' align='center' rowspan=2><b>站名</b></td>";
                reportContent += "<td  width='60' align='center' rowspan=2><b>警戒</b></td>";
                reportContent += "<td  width='60' align='center' rowspan=2><b>保证</b></td>";
                reportContent += "<td  align='center' ><b>" + new Date(startTime).Format("M月d日h时") + "</b></td>";
                reportContent += "<td  align='center' colspan=3><b>" +  new Date(endTime).Format("M月d日h时") + "</b></td>";
                reportContent += "<td  align='center' colspan=2　><b>过程最高水位</b></td>";
                reportContent += "<td  align='center' colspan=2><b>过程最低水位</b></td>";
                reportContent += "<td  align='center' colspan=2><b>历史最高水位</b></td>";
                reportContent += "</tr>";
                reportContent += "<tr style='Font-size:13px'>";
                reportContent += "<td  width='90' align='center' height=25><b>水位</b></td>";
                reportContent += "<td  width='70' align='center' ><b>水位</b></td>";
                reportContent += "<td  width='80' align='center' ><b>超警戒</b></td>";
                reportContent += "<td  width='80' align='center' ><b>涨幅</b></td>";
                reportContent += "<td  width='70' align='center' ><b>水位</b></td>";
                reportContent += "<td  width='90' align='center' ><b>发生时间</b></td>";
                reportContent += "<td  width='70' align='center' ><b>水位</b></td>";
                reportContent += "<td  width='95' align='center' ><b>发生时间</b></td>";
                reportContent += "<td  width='70' align='center' ><b>水位</b></td>";
                reportContent += "<td  width='95' align='center' ><b>发生时间</b></td>";
                reportContent += "</tr>";

                for(i=0;i<jsonData.length;i++){
                    reportContent += "<tr style='Font-size:13px'>";
                    // 输出所属乡镇
                    reportContent += "<td  align=center>" + jsonData[i].xian + "</td>";
                    // 输出河流
                    reportContent += "<td  align=center>" + jsonData[i].rvnm + "</td>";
                    // 输出站名
                    reportContent += "<td  align=center>" + jsonData[i].stnm + "</td>";

                    // 输出警戒水位
                    if (jsonData[i].jjz!=null)
                        reportContent += "<td  align=center>" + RthyinfoFormat.formatIn(jsonData[i].jjz) + "</td>";
                    else reportContent += "<td></td>";

                    // 输出保证水位
                    if (jsonData[i].jjz!=null)
                        reportContent += "<td  align=center>" + RthyinfoFormat.formatIn(jsonData[i].bzz) + "</td>";
                    else reportContent += "<td></td>";

                    // 输出开始时间水位
                    if (jsonData[i].z_1!=null)
                        reportContent += "<td  align=center>" + RthyinfoFormat.formatIn(jsonData[i].z_1) + "</td>";
                    else reportContent += "<td></td>";

                    // 输出结束时间水位
                    if (jsonData[i].z_2!=null)
                        reportContent += "<td  align=center>" + RthyinfoFormat.formatIn(jsonData[i].z_2) + "</td>";
                    else reportContent += "<td></td>";

                    // 输出注释
                    if(jsonData[i].z_2!=null&&jsonData[i].jjz!=null){
                        if(jsonData[i].z_2 > jsonData[i].jjz ) reportContent += "<td  align=center>"+RthyinfoFormat.formatIn(jsonData[i].z_2-jsonData[i].jjz)+"</td>";
                        else reportContent += "<td  align=center>未超</td>";
                    }else reportContent += "<td  ></td>";

                    // 输出涨幅
                    if(jsonData[i].z_1!=null&&jsonData[i].z_2!=null){
                        reportContent += "<td  align=center>"+RthyinfoFormat.formatIn(jsonData[i].z_2-jsonData[i].z_1)+"</td>";
                    }else reportContent += "<td  ></td>";

                    // 输出最高水位
                    if (jsonData[i].z_h!=null)
                        reportContent += "<td align=center>" + RthyinfoFormat.formatIn(jsonData[i].z_h) + "</td>";
                    else
                        reportContent += "<td ></td>";


                    // 输出最高水位时间
                    if (jsonData[i].tm_h!=null)
                        reportContent += "<td align=center>" + RthyinfoFormat.formatTMNoYear(jsonData[i].tm_h) + "</td>";
                    else
                        reportContent += "<td ></td>";

                    // 输出最低水位
                    if (jsonData[i].z_l!=null)
                        reportContent += "<td align=center>" + RthyinfoFormat.formatIn(jsonData[i].z_l) + "</td>";
                    else
                        reportContent += "<td ></td>";


                    // 输出最低水位时间
                    if (jsonData[i].tm_l!=null)
                        reportContent += "<td align=center>" + RthyinfoFormat.formatTMNoYear(jsonData[i].tm_l) + "</td>";
                    else
                        reportContent += "<td ></td>";

                    // 输出历史最高水位
                    if (jsonData[i].z_h_his!=null)
                        reportContent += "<td align=center>" + RthyinfoFormat.formatIn(jsonData[i].z_h_his) + "</td>";
                    else
                        reportContent += "<td ></td>";


                    // 输出历史最高水位时间
                    if (jsonData[i].tm_h_his!=null)
                        reportContent += "<td align=center>" + RthyinfoFormat.formatTM(jsonData[i].tm_h_his) + "</td>";
                    else
                        reportContent += "<td ></td>";


                    reportContent += "</tr>";

                }
                reportContent += "</table>";

                reportContent += "</td></tr>";

                reportContent += "<tr><td style='font-size:14px'align=right >"+departName+"&nbsp;&nbsp;</td></tr>";
                reportContent += "<tr><td style='font-size:14px'align=right>" + new Date().Format("yyyy-MM-dd hh:mm") + "&nbsp;&nbsp;</td></tr>";
                reportContent += "</table>";


            }
            else{
                reportContent += "<table border=0 align=center>";
                reportContent += "<tr><td style='font-size:15pt'align=center><b>无相关数据</b></td></tr>";
                reportContent += "</table>";
            }

            editor1.html(reportContent);


        },
        error: function () {
            editor1.html("出错了！！");
        },
        complete: function () {
            //parent.progressOff();
        }
    });
};

// 水库水位过程表
var RsvrPLInfo = function(){
    var startTime = $("#StartTime").textbox('getValue');
    var endTime = $("#EndTime").textbox('getValue');
    //parent.progressOn();
    $.ajax({
        url:baseUrl+"floodProfAnalyzSys/floodAnalyzeShow/getRsvrPLInfo.do",
        data:{
            startTime:startTime,
            endTime:endTime,
            rsvrType:"小一"
        },
        type:"Post",
        success: function (jsonData) {
            //console.log(jsonData);
            var ReportContent = "";
            var rCount =jsonData.length;
            var timeStr = getTimeStr(startTime,endTime);
            // 生成报表内容
            reportName = zoneName + timeStr + "水库水位过程表";
            if (rCount > 0) {
                //ReportTitle = "台州市" + TimeStr + "水库水位过程表";
                ReportContent += "<table border=0.5 align=center width='1140'>";
                ReportContent += "<tr><td style='font-size:20px'align=center><b>"+ zoneName + timeStr + "水库水位过程表</b></td></tr>";
                var noteStr = "水位单位：米；蓄水量单位：百万m³";
                ReportContent += "<tr><td style='font-size:11px' align=right valign=bottom><b>" + noteStr + "</b><td></tr>";
                ReportContent += "<tr><td>";

                // 输出表头
                ReportContent += "<table border='1' align=center style='border-collapse: collapse;font-size:13px' bordercolor='#000000' >";
                ReportContent += "<tr style='Font-size:13px'>";
                ReportContent += "<td  width='70' align='center' rowspan=2><b>所在地</b></td>";
                ReportContent += "<td  width='90' align='center' rowspan=2><b>水库名称</b></td>";
                ReportContent += "<td  align='center' colspan=2><b>汛限</b></td>";
                ReportContent += "<td  align='center' colspan=2 height=25><b>" + new Date(startTime).Format("M月d日h时") + "</b></td>";
                ReportContent += "<td  align='center' colspan=2><b>" +  new Date(endTime).Format("M月d日h时") + "</b></td>";


                ReportContent += "<td  align='center' colspan=3><b>过程最高水位</b></td>";
                ReportContent += "<td  align='center' colspan=3><b>过程最低水位</b></td>";
                ReportContent += "</tr>";
                ReportContent += "<tr style='Font-size:13px'>";
                ReportContent += "<td  align='center' width='70' height=25><b>水位</b></td>";
                ReportContent += "<td  align='center' width='70'><b>库容</b></td>";
                ReportContent += "<td  align='center' width='70'><b>水位</b></td>";
                ReportContent += "<td  align='center' width='70'><b>库容</b></td>";
                ReportContent += "<td  align='center' width='70'><b>水位</b></td>";
                ReportContent += "<td  align='center' width='70'><b>库容</b></td>";
                ReportContent += "<td  align='center' width='70'><b>水位</b></td>";
                ReportContent += "<td  align='center' width='70'><b>库容</b></td>";
                ReportContent += "<td  align='center' width='100'><b>时间</b></td>";
                ReportContent += "<td  align='center' width='70'><b>水位</b></td>";
                ReportContent += "<td  align='center' width='70'><b>库容</b></td>";
                ReportContent += "<td  align='center' width='100'><b>时间</b></td>";
                ReportContent += "</tr>";


                for(var i=0;i<jsonData.length;i++) {
                    ReportContent += "<tr>";
                    // 输出所属乡镇
                    ReportContent += "<td  align=center>" + jsonData[i].xian + "</td>";
                    // 输出站名
                    ReportContent += "<td  align=center>" + jsonData[i].stnm + "</td>";

                    // 输出汛限水位
                    if (jsonData[i].czz!=null)
                        ReportContent += "<td align=center>" + RthyinfoFormat.formatIn(jsonData[i].czz) + "</td>";
                    else
                        ReportContent += "<td ></td>";

                    // 输出汛限库容
                    if (jsonData[i].czz_pt!=null)
                        ReportContent += "<td align=center>" + RthyinfoFormat.formatW(jsonData[i].czz_pt) + "</td>";
                    else
                        ReportContent += "<td ></td>";

                    // 输出开始时间水位
                    if (jsonData[i].rz_1!=null)
                        ReportContent += "<td align=center>" + RthyinfoFormat.formatIn(jsonData[i].rz_1) + "</td>";
                    else
                        ReportContent += "<td ></td>";

                    // 输出开始时间库容
                    if (jsonData[i].pt_1!=null)
                        ReportContent += "<td align=center>" + RthyinfoFormat.formatW(jsonData[i].pt_1) + "</td>";
                    else
                        ReportContent += "<td ></td>";


                    // 输出结束时间水位
                    if (jsonData[i].rz_2!=null)
                        ReportContent += "<td align=center>" + RthyinfoFormat.formatIn(jsonData[i].rz_2) + "</td>";
                    else
                        ReportContent += "<td ></td>";

                    // 输出结束时间库容
                    if (jsonData[i].pt_2!=null)
                        ReportContent += "<td align=center>" + RthyinfoFormat.formatW(jsonData[i].pt_2) + "</td>";
                    else
                        ReportContent += "<td ></td>";

                    // 输出最高水位
                    if (jsonData[i].rz_h!=null)
                        ReportContent += "<td align=center>" + RthyinfoFormat.formatIn(jsonData[i].rz_h) + "</td>";
                    else
                        ReportContent += "<td ></td>";

                    // 输出最高水位库容
                    if (jsonData[i].pt_h!=null)
                        ReportContent += "<td align=center>" + RthyinfoFormat.formatW(jsonData[i].pt_h) + "</td>";
                    else
                        ReportContent += "<td ></td>";

                    // 输出最高水位时间
                    if (jsonData[i].tm_h!=null)
                        ReportContent += "<td align=center>" + RthyinfoFormat.formatTMNoYear(jsonData[i].tm_h) + "</td>";
                    else
                        ReportContent += "<td ></td>";

                    // 输出最低水位
                    if (jsonData[i].rz_l!=null)
                        ReportContent += "<td align=center>" + RthyinfoFormat.formatIn(jsonData[i].rz_l) + "</td>";
                    else
                        ReportContent += "<td ></td>";

                    // 输出最低水位库容
                    if (jsonData[i].pt_l!=null)
                        ReportContent += "<td align=center>" + RthyinfoFormat.formatW(jsonData[i].pt_l) + "</td>";
                    else
                        ReportContent += "<td ></td>";

                    // 输出最低水位时间
                    if (jsonData[i].tm_l!=null)
                        ReportContent += "<td align=center>" + RthyinfoFormat.formatTMNoYear(jsonData[i].tm_l) + "</td>";
                    else
                        ReportContent += "<td ></td>";


                    ReportContent += "</tr>";

                }
                ReportContent += "</table>";

                ReportContent += "</td></tr>";

                ReportContent += "<tr><td style='font-size:14px'align=right >"+departName+"&nbsp;&nbsp;</td></tr>";
                ReportContent += "<tr><td style='font-size:14px'align=right>" + new Date().Format("yyyy-MM-dd hh:mm") + "&nbsp;&nbsp;</td></tr>";
                ReportContent += "</table>";


            }
            else{
                ReportContent += "<table border=0 align=center>";
                ReportContent += "<tr><td style='font-size:15pt'align=center><b>无相关数据</b></td></tr>";
                ReportContent += "</table>";
            }

            editor1.html(ReportContent);


            },
        error: function () {

        },
        complete: function () {
            //parent.progressOff();
        }
    });
};

// 水库超警情况表
var RsvrWarnInfo = function(){
    var fixTime = $("#FixTime").textbox('getValue');
    //parent.progressOn();
    $.ajax({
        url:baseUrl+"comm/waterInfo/getWaterList.do",
        data:{
            isLargeMid:false,
            isWarn:true,
            tm:fixTime,
            sttp:"RR"
        },
        type:"Post",
        success: function (jsondata) {
            //console.log(jsondata);
            var jsonData = jsondata.waterList;
            var ReportContent = "";
            var rCount =jsonData.length;
            var timeStr = new Date(fixTime).Format("MM月dd日hh时");
            // 生成报表内容
            reportName = zoneName + timeStr + "水库超汛情况表";
            if (rCount > 0) {
                ReportContent += "<table border=0.5 align=center width='500'>";
                ReportContent += "<tr><td style='font-size:20px'align=center><b>"+ zoneName + timeStr + "水库超汛情况表</b></td></tr>";
                var noteStr = "水位单位：米";
                ReportContent += "<tr><td style='font-size:11px' align=right valign=bottom><b>" + noteStr + "</b><td></tr>";
                ReportContent += "<tr><td>";

                ReportContent += "<table border='1' align=center style='border-collapse: collapse;font-size:13px' bordercolor='#000000' >";
                // 输出表头
                ReportContent += "<tr style='Font-size:13px'>";
                ReportContent += "<td  width='80' align='center'><b>所在乡镇</b></td>";
                ReportContent += "<td  width='80' align='center'><b>水库名称</b></td>";
                ReportContent += "<td  width='80' align='center'><b>汛限水位</b></td>";
                ReportContent += "<td  width='80' align='center'><b>水位</b></td>";
                ReportContent += "<td  width='100' align='center'><b>超汛限情况</b></td>";
                ReportContent += "</tr>";

                for (var i = 0; i < rCount; i++)
                {

                    ReportContent += "<tr style='font-size:13px'>";

                    // 输出所属乡镇
                    ReportContent += "<td  align=center>" + jsonData[i].xian + "</td>";
                    // 输出站名
                    ReportContent += "<td  align=center>" + jsonData[i].stnm + "</td>";

                    // 输出汛限水位
                    if (jsonData[i].czz!=null)
                        ReportContent += "<td align=center>" + RthyinfoFormat.formatIn(jsonData[i].czz) + "</td>";
                    else
                        ReportContent += "<td ></td>";

                    // 输出水位
                    if (jsonData[i].z!=null)
                        ReportContent += "<td align=center>" + RthyinfoFormat.formatIn(jsonData[i].z) + "</td>";
                    else
                        ReportContent += "<td ></td>";

                    // 得到超汛限信息
                    if(jsonData[i].z!=null&&jsonData[i].czz!=null)
                        ReportContent += "<td align=center>超" + RthyinfoFormat.formatIn(jsonData[i].z-jsonData[i].czz) + "</td>";
                    else ReportContent += "<td ></td>";

                    ReportContent += "</tr>";
                }

                ReportContent += "</table>";

                ReportContent += "</td></tr>";

                ReportContent += "<tr><td style='font-size:14px'align=right >"+departName+"&nbsp;&nbsp;</td></tr>";
                ReportContent += "<tr><td style='font-size:14px'align=right>" + new Date().Format("yyyy-MM-dd hh:mm") + "&nbsp;&nbsp;</td></tr>";
                ReportContent += "</table>";

            }
            else{
                ReportContent += "<table border=0 align=center>";
                ReportContent += "<tr><td style='font-size:15pt'align=center><b>无超警水库</b></td></tr>";
                ReportContent += "</table>";
            }

            editor1.html(ReportContent);

        },
        error: function () {
            editor1.html("出错了！！");
        },
        complete: function () {
            //parent.progressOff();
        }
    });
};

// 河道超警情况表
var RiverWarnInfo = function(){
    var fixTime = $("#FixTime").textbox('getValue');
    //parent.progressOn();
    $.ajax({
        url:baseUrl+"comm/waterInfo/getWaterList.do",
        data:{
            isLargeMid:false,
            isWarn:true,
            tm:fixTime,
            sttp:"Z"
        },
        type:"Post",
        success: function (initJsonData) {
            //console.log(initJsonData);
            var jsonData = initJsonData.waterList;
            var ReportContent = "";
            var rCount =jsonData.length;
            var timeStr = new Date(fixTime).Format("MM月dd日hh时");;
            // 生成报表内容
            reportName = zoneName + timeStr + "河道超警情况表";
            if (rCount > 0) {
                ReportContent += "<table border=0.5 align=center width='500'>";
                ReportContent += "<tr><td style='font-size:20px'align=center><b>"+ zoneName + timeStr + "河道超警情况表</b></td></tr>";
                var noteStr = "水位单位：米";
                ReportContent += "<tr><td style='font-size:11px' align=right valign=bottom><b>" + noteStr + "</b><td></tr>";
                ReportContent += "<tr><td>";

                ReportContent += "<table border='1' align=center style='border-collapse: collapse;font-size:13px' bordercolor='#000000' >";

                // 输出表头
                ReportContent += "<tr style='Font-size:13px'>";
                ReportContent += "<td  width='80' align='center' height=25><b>乡镇名</b></td>";
                ReportContent += "<td  width='80' align='center'><b>名称</b></td>";
                ReportContent += "<td  width='80' align='center'><b>水位</b></td>";
                ReportContent += "<td  width='80' align='center'><b>警戒</b></td>";
                ReportContent += "<td  width='80' align='center'><b>保证</b></td>";
                ReportContent += "<td  width='100' align='center'><b>备注</b></td>";
                ReportContent += "</tr>";

                for (var i = 0; i < rCount; i++)
                {

                    ReportContent += "<tr style='font-size:13px'>";


                    ReportContent += "<tr style='font-size:13px'>";

                    // 输出所属乡镇
                    ReportContent += "<td  align=center>" + jsonData[i].xian + "</td>";
                    // 输出站名
                    ReportContent += "<td  align=center>" + jsonData[i].stnm + "</td>";

                    // 输出水位
                    if (jsonData[i].z!=null)
                        ReportContent += "<td align=center>" + RthyinfoFormat.formatIn(jsonData[i].z) + "</td>";
                    else
                        ReportContent += "<td ></td>";

                    // 输出警戒
                    if (jsonData[i].jjz!=null)
                        ReportContent += "<td align=center>" + RthyinfoFormat.formatIn(jsonData[i].jjz) + "</td>";
                    else
                        ReportContent += "<td ></td>";

                    // 输出警戒
                    if (jsonData[i].bzz!=null)
                        ReportContent += "<td align=center>" + RthyinfoFormat.formatIn(jsonData[i].bzz) + "</td>";
                    else
                        ReportContent += "<td ></td>";


                    // 输出备注
                    if (jsonData[i].z!=null){
                        if(jsonData[i].bzz!=null&&jsonData[i].z-jsonData[i].bzz>=0){
                            ReportContent += "<td align=center>超保证" + RthyinfoFormat.formatIn(jsonData[i].z - jsonData[i].bzz) + "</td>";
                        }else if(jsonData[i].jjz!=null&&jsonData[i].z-jsonData[i].jjz>=0){
                            ReportContent += "<td align=center>超警戒" + RthyinfoFormat.formatIn(jsonData[i].z - jsonData[i].jjz) + "</td>";
                        }else
                            ReportContent += "<td align=center>未超警</td>";

                    }else ReportContent += "<td ></td>";

                    ReportContent += "</tr>";
                }

                ReportContent += "</table>";

                ReportContent += "</td></tr>";

                ReportContent += "<tr><td style='font-size:14px'align=right >"+departName+"&nbsp;&nbsp;</td></tr>";
                ReportContent += "<tr><td style='font-size:14px'align=right>" + new Date().Format("yyyy-MM-dd hh:mm") + "&nbsp;&nbsp;</td></tr>";
                ReportContent += "</table>";

            }else{
                ReportContent += "<table border=0 align=center>";
                ReportContent += "<tr><td style='font-size:15pt'align=center><b>无超警河道</b></td></tr>";
                ReportContent += "</table>";
            }

            editor1.html(ReportContent);

        },
        error: function () {
            editor1.html("出错了！！");
        },
        complete: function () {
            //parent.progressOff();
        }
    });
};

// 潮位增水分析表
var TideAddZInfo = function(){
    var startDate = $("#StartDate").textbox('getValue');
    var endDate = $("#EndDate").textbox('getValue');

    $.ajax({
        url:baseUrl+"floodProfAnalyzSys/floodAnalyzeShow/getTideHourPLInfo.do",
        data:{
            stcd:"70705200",
            startTime:startDate,
            endTime:endDate
        },
        type:"Post",
        success: function (jsonData) {
            //console.log(jsonData);
            var ReportContent = "";
            var timeStr = "";
            var StartPointTime = new Date(startDate);
            var EndPointTime = new Date(endDate);
            var stnm = "健跳";
            reportName = timeStr +  + stnm + "站天文潮增水统计表";
            if (StartPointTime.getFullYear() != EndPointTime.getFullYear()) //如果不是同一年，显示年份
            {
                timeStr = StartPointTime.Format("yyyy年M月d日") + "～" + EndPointTime.Format("yyyy年M月d日");
            }
            else
            {
                if (StartPointTime.getMonth() != EndPointTime.getMonth())
                    timeStr = StartPointTime.Format("yyyy年M月d日") + "～" + EndPointTime.Format("M月d日");
                else
                    timeStr = StartPointTime.Format("yyyy年M月d日") + "～" + EndPointTime.Format("d日");
            }


            ReportContent += "<table border=0.5 align=center width='2080'>";
            ReportContent += "<tr><td style='font-size:20px'align=center><b>" + timeStr +  + stnm + "站天文潮增水统计表";
            var  noteStr = ""
            //NoteStr = " 表内（测站基面以上厘米数）-1.860 cm= 85高程基面以上厘米数";
            ReportContent += "<tr><td style='font-size:11px' align=center valign=bottom><b>" + noteStr + "</b><td></tr>";
            ReportContent += "<tr><td>";

            ReportContent += "<table border='1' align=center style='border-collapse: collapse;font-size:13px' bordercolor='#000000' >";

            // 输出表头
            ReportContent += "<tr style='Font-size:13px'>";
            ReportContent += "<td  width='80' align='center' rowspan=2><b>日期</b></td>";
            ReportContent += "<td  width='80' align='center' rowspan=2><b>项目</b></td>";
            ReportContent += "<td colspan=24 align='center'><b>潮&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;位</b></td>";
            ReportContent += "<td colspan=2 align='center'><b>高潮</b></td>";
            ReportContent += "<td colspan=2 align='center'><b>高潮</b></td>";
            ReportContent += "<td colspan=2 align='center'><b>低潮</b></td>";
            ReportContent += "<td colspan=2 align='center'><b>低潮</b></td>";
            ReportContent += "</tr>";
            ReportContent += "<tr style='Font-size:13px'>";
            for (i = 0; i < 24; i++)
            {
                ReportContent += "<td align='center' width='60'><b>" + i + "</b></td>";
            }
            ReportContent += "<td align='center' width='60'><b>时分</b></td>";
            ReportContent += "<td align='center' width='60'><b>潮位</b></td>";
            ReportContent += "<td align='center' width='60'><b>时分</b></td>";
            ReportContent += "<td align='center' width='60'><b>潮位</b></td>";
            ReportContent += "<td align='center' width='60'><b>时分</b></td>";
            ReportContent += "<td align='center' width='60'><b>潮位</b></td>";
            ReportContent += "<td align='center' width='60'><b>时分</b></td>";
            ReportContent += "<td align='center' width='60'><b>潮位</b></td>";
            ReportContent += "</tr>";

            var TableContent = "";
             // 得到小时潮位
            var dayCount = RthyinfoFormat.dateDiff("day",new Date(startDate),new Date(endDate));
            var TempTime = new Date(startDate);
            var RCount_HourTide = jsonData.length; // 小时潮位的记录数
            var HourTide_Index = 0;
            var RowsContent_YC = "";
            var RowsContent_TW = "";
            var RowsContent_AddZ = "";
            var RowsContent_Wind = "";//风速
            var RowsContent_Pressure = "";// 气压
            for (var i = 0; i < dayCount; i++) {
                RowsContent_YC = RowsContent_TW = RowsContent_AddZ = RowsContent_Wind = RowsContent_Pressure = "<tr style='Font-size:13px' align='center'>";

                RowsContent_YC += "<td rowspan=5 align='center'>" + TempTime.Format("MM月dd日") + "</td>";

                // ************小时潮位************************************
                RowsContent_YC += "<td height=25 align='center'>实测</td>";
                RowsContent_TW += "<td height=25 align='center'>天文潮</td>";
                RowsContent_AddZ += "<td height=25 align='center'>增水值</td>";
                RowsContent_Wind += "<td height=25 align='center'>风速/风向</td>";
                RowsContent_Pressure += "<td height=25 align='center'>气压</td>";
                for (var j = 0; j < 24; j++) {
                    if (HourTide_Index < RCount_HourTide) {
                        if (jsonData[HourTide_Index].z_yc != null) RowsContent_YC += "<td align='center'>" + parseInt(jsonData[HourTide_Index].z_yc * 100) + "</td>";
                        else RowsContent_YC += "<td></td>";

                        if (jsonData[HourTide_Index].z_tw != null) RowsContent_TW += "<td align='center'>" + parseInt(jsonData[HourTide_Index].z_tw * 100) + "</td>";
                        else RowsContent_TW += "<td></td>";

                        if (jsonData[HourTide_Index].addz != null) RowsContent_AddZ += "<td align='center'>" + parseInt(jsonData[HourTide_Index].addz * 100) + "</td>";
                        else RowsContent_AddZ += "<td></td>";

                        HourTide_Index++;
                    }
                    else {
                        RowsContent_YC += "<td></td>";
                        RowsContent_TW += "<td></td>";
                        RowsContent_AddZ += "<td></td>";
                    }

                    RowsContent_Wind += "<td></td>";
                    RowsContent_Pressure += "<td></td>";

                }

                // 得到高低潮信息
                $.ajax({
                   url: baseUrl+"floodProfAnalyzSys/floodAnalyzeShow/getTideHLPLInfo.do",
                    data:{
                        stcd:"70705200",
                        startTime:TempTime.Format("yyyy-MM-dd 0:00"),
                        endTime:TempTime.DateAdd("day",1).Format("yyyy-MM-dd 0:00")
                    },
                    type:"Post",
                    async: false,
                    success:function(hlData){
                        var RCount_HLTide = hlData.length;
                        var HLTDMK = -1;
                        for (var k = 1; k < 5; k++) {
                            // 得到标识
                            if (k <= RCount_HLTide)
                            {
                                if(hlData[k-1].hltdmk!=null)HLTDMK = hlData[k-1].hltdmk;
                                else HLTDMK = -1;
                            }
                            else HLTDMK = -1;

                            if (HLTDMK == k)
                            {
                                if(hlData.tm_yc!=null) RowsContent_YC += "<td align='center'>" + new Date(hlData.tm_yc).Format("hh:mm") + "</td>";
                                else RowsContent_YC += "<td></td>";

                                if(hlData.yc_z!=null) RowsContent_YC += "<td align='center'>" + parseInt(hlData.yc_z * 100) + "</td>";
                                else RowsContent_YC += "<td></td>";

                                if(hlData.tm_tw!=null) RowsContent_TW += "<td align='center'>" + new Date(hlData.tm_tw).Format("hh:mm") + "</td>";
                                else RowsContent_TW += "<td></td>";

                                if(hlData.tw_z!=null) RowsContent_TW += "<td align='center'>" + parseInt(hlData.tw_z * 100) + "</td>";
                                else RowsContent_TW += "<td></td>";

                                RowsContent_AddZ += "<td></td>";

                                if(hlData.diff_z!=null) RowsContent_AddZ += "<td align='center'>" + parseInt(hlData.diff_z * 100) + "</td>";
                                else RowsContent_AddZ += "<td></td>";

                            }
                            else
                            {
                                RowsContent_YC += "<td></td><td></td>";
                                RowsContent_TW += "<td></td><td></td>";
                                RowsContent_AddZ += "<td></td><td></td>";
                            }
                            if (k == 1)
                            {
                                RowsContent_Wind += "<td colspan=2 align='center'>最大风速</td>";
                                RowsContent_Pressure += "<td colspan=2 align='center'>最低气压</td>";
                            }
                            else if (k == 3)
                            {
                                RowsContent_Wind += "<td colspan=2 align='center'>日降雨量</td>";
                                RowsContent_Pressure += "<td colspan=2 align='center'></td>";
                            }
                            else
                            {
                                RowsContent_Wind += "<td colspan=2 align='center'></td>";
                                RowsContent_Pressure += "<td colspan=2 align='center'></td>";
                            }
                        }

                    },
                    error:function(){}
               });

                RowsContent_YC += "</tr>";
                RowsContent_TW += "</tr>";
                RowsContent_AddZ += "</tr>";
                RowsContent_Wind += "</tr>";
                RowsContent_Pressure += "</tr>";

                TableContent += RowsContent_YC;
                TableContent += RowsContent_TW;
                TableContent += RowsContent_AddZ;
                TableContent += RowsContent_Wind;
                TableContent += RowsContent_Pressure;
                TempTime = TempTime.DateAdd("day",1)
            }
            ReportContent += TableContent;
            ReportContent += "</table>";

            ReportContent += "</td></tr>";

            ReportContent += "<tr><td style='font-size:14px'align=right >"+departName+"&nbsp;&nbsp;</td></tr>";
            ReportContent += "<tr><td style='font-size:14px'align=right>" + new Date().Format("yyyy-MM-dd hh:mm") + "&nbsp;&nbsp;</td></tr>";
            ReportContent += "</table>";

            editor1.html(ReportContent);

        },
        error: function () {
            editor1.html("出错了！！");
        },
        complete: function () {
            //parent.progressOff();
        }
    });
};

// 大中型水库雨量水位分析表
var LargeMiddleRsvrAddRain = function(){
    var fixTime = $("#FixTime").textbox('getValue');
    var blc = $("#BlcList").textbox('getValue');
    if($('#BlcList').textbox('isValid') == false){
        $.toast({
            text: '内容格式错误!',
            width:100,
            icon: 'info',
            position: "mid-center",
            stack: false,
            allowToastClose: false,
            loader: false,
            bgColor: "#FF0000",
            textColor: "#fff"
        });
        return
    };
    //parent.progressOn();
    $.ajax({
        url:baseUrl+"floodProfAnalyzSys/floodAnalyzeShow/getLargeMiddleRsvrAddRain.do",
        data:{
            fixTime:fixTime,
            blcList:blc,
            //stcd:70705200,
        },
        type:"Post",
        success: function (jsonData) {
            //console.log(jsonData);
            var ReportContent = "";
            var rCount =jsonData.length;
            reportName = zoneName + new Date(fixTime).Format("MM月d日h时") + "大中型水库不同降雨量水位变化分析表";
            if(rCount>0) {
                ReportContent += "<table border=0.5 align=center width='1035'>";
                ReportContent += "<tr><td style='font-size:20px'align=center><b>"+zoneName + new Date(fixTime).Format("MM月d日h时") + "大中型水库不同降雨量水位变化分析表</b></td></tr>";
                var noteStr = "水位单位：米；库容：百万m³；雨量：毫米";
                ReportContent += "<tr><td style='font-size:11px' align=right valign=bottom><b>" + noteStr + "</b><td></tr>";
                ReportContent += "<tr><td>";
                ReportContent += "<table border='1' align=center style='border-collapse: collapse;font-size:13px' bordercolor='#000000' >";

                // 输出表头
                ReportContent += "<tr style='font-size:13px'　align='center'>";
                ReportContent += "<td  width='60' rowspan=2 align='center'><b>库名</b></td>";
                ReportContent += "<td  width='65' rowspan=2 align='center'><b>集雨面积Km²</b></td>";
                ReportContent += "<td  colspan=2 height=25 align='center'><b>正常</b></td>";
                ReportContent += "<td  colspan=2 align='center'><b>汛限</b></td>";
                ReportContent += "<td  align='center' colspan=2 ><b>" + new Date(fixTime).Format("M月d日h时") + "</b></td>";
                ReportContent += "<td  colspan=2 align='center'><b>降雨50mm</b></td>";
                ReportContent += "<td  colspan=2 align='center'><b>降雨100mm</b></td>";
                ReportContent += "<td  colspan=2 align='center'><b>降雨150mm</b></td>";
                ReportContent += "<td  colspan=2 align='center'><b>降雨200mm</b></td>";
                ReportContent += "<td  colspan=2 align='center'><b>降雨300mm</b></td>";
                ReportContent += "<td  colspan=2 align='center'><b>可纳雨量</b></td>";
                ReportContent += "</tr>";
                ReportContent += "<tr style='Font-size:13px'　align='center'>";
                ReportContent += "<td height=25 align='center' width=50><b>水位</b></td>";
                ReportContent += "<td width=50 align='center'><b>库容</b></td>";
                ReportContent += "<td width=50 align='center'><b>水位</b></td>";
                ReportContent += "<td width=50 align='center'><b>库容</b></td>";
                ReportContent += "<td width=50 align='center'><b>水位</b></td>";
                ReportContent += "<td width=50 align='center'><b>库容</b></td>";
                ReportContent += "<td width=50 align='center'><b>水位</b></td>";
                ReportContent += "<td width=50 align='center'><b>库容</b></td>";
                ReportContent += "<td width=50 align='center'><b>水位</b></td>";
                ReportContent += "<td width=50 align='center'><b>库容</b></td>";
                ReportContent += "<td width=50 align='center'><b>水位</b></td>";
                ReportContent += "<td width=50 align='center'><b>库容</b></td>";
                ReportContent += "<td width=50 align='center'><b>水位</b></td>";
                ReportContent += "<td width=50 align='center'><b>库容</b></td>";
                ReportContent += "<td width=50 align='center'><b>水位</b></td>";
                ReportContent += "<td width=50 align='center'><b>库容</b></td>";
                ReportContent += "<td width=55 align='center'><b>至正常</b></td>";
                ReportContent += "<td width=55 align='center'><b>至汛限</b></td>";
                ReportContent += "</tr>";

                var TableContent = "";
                for (var i = 0; i < rCount; i++)
                {
                    TableContent += "<tr style='font-size:13px'>";

                    // 输出水库名称
                    TableContent += "<td align=center height=30>" + jsonData[i].stnm.replace("水库", "") + "</td>";

                    // 输出集雨面积
                    if(jsonData[i].drna!=null) TableContent += "<td align=center>" + RthyinfoFormat.formatP(jsonData[i].drna) + "</td>";
                    else TableContent += "<td ></td>";

                    // 输出正常水位
                    if(jsonData[i].normalz!=null) TableContent += "<td align=center>" + RthyinfoFormat.formatIn(jsonData[i].normalz) + "</td>";
                    else TableContent += "<td ></td>";

                    // 输出正常库容
                    if(jsonData[i].normal_pt!=null) TableContent += "<td align=center>" + RthyinfoFormat.formatW(jsonData[i].normal_pt) + "</td>";
                    else TableContent += "<td ></td>";

                    // 输出汛限水位
                    if(jsonData[i].czz!=null) TableContent += "<td align=center>" + RthyinfoFormat.formatIn(jsonData[i].czz) + "</td>";
                    else TableContent += "<td ></td>";

                    // 输出汛限库容
                    if(jsonData[i].czz_pt!=null) TableContent += "<td align=center>" + RthyinfoFormat.formatW(jsonData[i].czz_pt) + "</td>";
                    else TableContent += "<td ></td>";

                    // 输出当前水位
                    if(jsonData[i].rz!=null) TableContent += "<td align=center>" + RthyinfoFormat.formatIn(jsonData[i].rz) + "</td>";
                    else TableContent += "<td ></td>";

                    // 输出当前库容
                    if(jsonData[i].pt!=null) TableContent += "<td align=center>" + RthyinfoFormat.formatW(jsonData[i].pt) + "</td>";
                    else TableContent += "<td ></td>";

                    // 降雨50水位
                    if(jsonData[i].z_50!=null){
                        if(jsonData[i].pt_50!=null&&jsonData[i].pt_50>99000) TableContent += "<td align=center>已溢洪</td>";
                        else TableContent += "<td align=center>" +RthyinfoFormat.formatIn(jsonData[i].z_50) + "</td>";
                    }else TableContent += "<td ></td>";

                    // 降雨50库容
                    if(jsonData[i].pt_50!=null){
                        if(jsonData[i].pt_50>99000) TableContent += "<td align=center>已溢洪</td>";
                        else TableContent += "<td align=center>" + RthyinfoFormat.formatW(jsonData[i].pt_50) + "</td>";
                    }else TableContent += "<td ></td>";


                    // 降雨100水位
                    if(jsonData[i].z_100!=null){
                        if(jsonData[i].pt_100!=null&&jsonData[i].pt_100>99000) TableContent += "<td align=center>已溢洪</td>";
                        else TableContent += "<td align=center>" +RthyinfoFormat.formatIn(jsonData[i].z_100) + "</td>";
                    }else TableContent += "<td ></td>";

                    // 降雨100库容
                    if(jsonData[i].pt_100!=null){
                        if(jsonData[i].pt_100>99000) TableContent += "<td align=center>已溢洪</td>";
                        else TableContent += "<td align=center>" + RthyinfoFormat.formatW(jsonData[i].pt_100) + "</td>";
                    }else TableContent += "<td ></td>";

                    // 降雨150水位
                    if(jsonData[i].z_150!=null){
                        if(jsonData[i].pt_150!=null&&jsonData[i].pt_150>99000) TableContent += "<td align=center>已溢洪</td>";
                        else TableContent += "<td align=center>" +RthyinfoFormat.formatIn(jsonData[i].z_150) + "</td>";
                    }else TableContent += "<td ></td>";

                    // 降雨150库容
                    if(jsonData[i].pt_150!=null){
                        if(jsonData[i].pt_150>99000) TableContent += "<td align=center>已溢洪</td>";
                        else TableContent += "<td align=center>" + RthyinfoFormat.formatW(jsonData[i].pt_150) + "</td>";
                    }else TableContent += "<td ></td>";

                    // 降雨200水位
                    if(jsonData[i].z_200!=null){
                        if(jsonData[i].pt_200!=null&&jsonData[i].pt_200>99000) TableContent += "<td align=center>已溢洪</td>";
                        else TableContent += "<td align=center>" +RthyinfoFormat.formatIn(jsonData[i].z_200) + "</td>";
                    }else TableContent += "<td ></td>";

                    // 降雨200库容
                    if(jsonData[i].pt_200!=null){
                        if(jsonData[i].pt_200>99000) TableContent += "<td align=center>已溢洪</td>";
                        else TableContent += "<td align=center>" + RthyinfoFormat.formatW(jsonData[i].pt_200) + "</td>";
                    }else TableContent += "<td ></td>";

                    // 降雨300水位
                    if(jsonData[i].z_300!=null){
                        if(jsonData[i].pt_300!=null&&jsonData[i].pt_300>99000) TableContent += "<td align=center>已溢洪</td>";
                        else TableContent += "<td align=center>" +RthyinfoFormat.formatIn(jsonData[i].z_300) + "</td>";
                    }else TableContent += "<td ></td>";

                    // 降雨200库容
                    if(jsonData[i].pt_300!=null){
                        if(jsonData[i].pt_300>99000) TableContent += "<td align=center>已溢洪</td>";
                        else TableContent += "<td align=center>" + RthyinfoFormat.formatW(jsonData[i].pt_300) + "</td>";
                    }else TableContent += "<td ></td>";


                    // 至正常可纳雨量
                    var AddRain = 0.0;
                    if(jsonData[i].rain_Normal!=null){
                        if(jsonData[i].rain_Normal>=99000){
                            TableContent += "<td align=center>>300mm/td>"
                        }else
                            TableContent += "<td align=center>" + RthyinfoFormat.formatP(jsonData[i].rain_Normal) + "</td>";
                    }else TableContent += "<td ></td>";

                    // 至汛限可纳雨量
                    if(jsonData[i].rain_CZZ!=null){
                        if(jsonData[i].rain_CZZ>=99000){
                            TableContent += "<td align=center>>300mm/td>"
                        }else
                            TableContent += "<td align=center>" + RthyinfoFormat.formatP(jsonData[i].rain_CZZ) + "</td>";
                    }else TableContent += "<td ></td>";

                    TableContent += "</tr >";
                }

                ReportContent += TableContent;

                ReportContent += "</table>";

                ReportContent += "</td></tr>";

                ReportContent += "<tr><td style='font-size:14px'align=right >"+departName+"&nbsp;&nbsp;</td></tr>";
                ReportContent += "<tr><td style='font-size:14px'align=right>" + new Date().Format("yyyy-MM-dd hh:mm") + "&nbsp;&nbsp;</td></tr>";
                ReportContent += "</table>";

            }
            else{
                ReportContent += "<table border=0 align=center>";
                ReportContent += "<tr><td style='font-size:15pt'align=center><b>无相关水库</b></td></tr>";
                ReportContent += "</table>";
            }

            editor1.html(ReportContent);

        },
        error: function () {
            editor1.html("出错了！！");
        },
        complete: function () {
            //parent.progressOff();
        }
    });
};

// 汛情通报
var FloodDetailInfo = function(){
    var startTime = $("#StartTime").textbox('getValue');
    var endTime = $("#EndTime").textbox('getValue');
    var time = new Date().Format("yyyy-MM-dd 08:00");
    var StartPointTime = new Date(startTime);
    var EndPointTime = new Date(endTime);

    $.when($.ajax({
            url: baseUrl + "floodProfAnalyzSys/floodAnalyzeShow/getAbstractRainInfo.do",
            data: {
                startTime: startTime,
                endTime: endTime
            }
        }),
        $.ajax({
            url: baseUrl + "floodProfAnalyzSys/floodAnalyzeShow/getZoneRain.do",
            data: {
                zoneType:"XS",
                startTime:startTime,
                endTime:endTime,
                zoneStcd:1
            }
        }),
        $.ajax({
            url: baseUrl + "floodProfAnalyzSys/floodAnalyzeShow/getAbstractRSVRInfo.do",
            data: {
                time:time
            }
        }),
        $.ajax({
            url: baseUrl + "floodProfAnalyzSys/floodAnalyzeShow/getAbstractRSVRInfo.do",
            data: {
                time:time
            }
        }),
        $.ajax({
            url:baseUrl + "comm/waterInfo/getWaterList.do",
            data:{
                stcd:"70704872,SM010209"
            }
        }),
        $.ajax({
            url:baseUrl + "floodProfAnalyzSys/floodAnalyzeShow/getTideHLPLInfo.do",
            data:{
                stcd:"70705200",
                endTime:endTime,
                startTime:EndPointTime.DateAdd('day',-2).Format("yyyy-MM-dd hh:mm"),
                sortType:"TM"
            }
        }),
        $.ajax({
            url:baseUrl + "floodProfAnalyzSys/floodAnalyzeShow/getTideHLPLInfo.do",
            data:{
                stcd:"SM003869",
                endTime:endTime,
                startTime:EndPointTime.DateAdd('day',-2).Format("yyyy-MM-dd hh:mm"),
                sortType:"TM"
            }
        })
    ).done(function(rainData,zoneRainData,riverData,waterData,ZData,tideData,tideData2){
        var reportContent = "";
        reportName = StartPointTime.getFullYear() + "年第**期"+ zoneName +"汛情通报";

        reportContent += "<style type='text/css'>hr{border:border:1px solid red;}</style><table border=0.5  align=center width='700'>";
        reportContent += "<tr><td style='font-size:50px;color:#FD6E0F' align=center colspan=2><b>"+ zoneName +"汛情通报</b></td></tr>";
        reportContent += "<tr ><td style='font-size:20px;' align=center colspan=2><b>(第**期)</b></td>";
        reportContent += "<tr ><td align=left style='font-size:19px;color:#FF6600;font-family:楷体_GB2312' valign=bottom><b>" + departName + "</b></td>";
        reportContent += "<td align=right style='font-size:19px;font-family:楷体_GB2312' valign=bottom>" + new Date(endTime).Format("yyyy年M月dd日") + "</td>";
        reportContent += "</tr>";

        //***********************分隔线******************************
        reportContent += "<tr><td align=center colspan=2 height='20px'><hr /></td></tr>";


        //**********************降雨情况***************************begin
        reportContent +=
            "<tr><td align=left colspan=2 style='font-size:18px' height=50 valign=bottom><b>1、降雨情况</b></td></tr>";

        //降雨详情
        var avgRainStr = "";
        var maxRainStr = "";
        if (StartPointTime.getMonth() != EndPointTime.getMonth()){
            avgRainStr += StartPointTime.Format("M月d日h时")+"至"+EndPointTime.Format("M月d日h时");
        }else{
            avgRainStr += StartPointTime.Format("M月d日h时")+"至"+EndPointTime.Format("d日h时");
        }
        if (StartPointTime.getDay() != EndPointTime.getDay()){
            maxRainStr += StartPointTime.Format("dd日hh:mm")+"-"+EndPointTime.Format("dd日hh:mm");
        }else{
            maxRainStr += StartPointTime.Format("dd日hh:mm")+"-"+EndPointTime.Format("hh:mm");
        }


        if(rainData!=null && rainData.length>0){
            raindata = rainData[0];
            console.log(raindata)
            t_AreaRainStr = "";
            t_maxRainStr = "";
            t_max1HRainStr = "";
            t_max3HRainStr = "";
            t_max1DRainStr = "";
            t_max3DRainStr = "";
            for(var i=0;i<raindata.length;i++){
                if(raindata[i].STCD=='00000000' && raindata[i].DRP){
                    if(raindata[i].DRP > 0.0){
                        t_AreaRainStr = "，全市累计面雨量" + RthyinfoFormat.formatP(raindata[i].DRP)+"毫米";
                    }else{
                        t_AreaRainStr = "，全市基本无降雨";
                        break;
                    }
                }
                if(raindata[i].STCD=='00000000' && !raindata[i].DRP){
                    t_AreaRainStr = "，暂无雨量数据";
                    break;
                }
                if(raindata[i].STCD!='00000000' && raindata[i].INTV=='0' && raindata[i].DRP){
                    if(t_maxRainStr.length == 0){
                        t_maxRainStr += "，其中最大为" + raindata[i].STNM.trim() +"站：" + RthyinfoFormat.formatP(raindata[i].DRP)+"毫米";
                    }else{
                        t_maxRainStr += "，" + raindata[i].STNM.trim() +"站：" + RthyinfoFormat.formatP(raindata[i].DRP)+"毫米";
                    }
                }
                if(raindata[i].STCD!='00000000' && raindata[i].INTV=='60'  && raindata[i].DRP){
                    if(t_max1HRainStr.length == 0){
                        t_max1HRainStr += ";最大1小时雨量为" + raindata[i].STNM.trim() +"站：" + RthyinfoFormat.formatP(raindata[i].DRP)+"毫米";
                    }else{
                        t_max1HRainStr += "，" + raindata[i].STNM.trim() +"站：" + RthyinfoFormat.formatP(raindata[i].DRP)+"毫米";
                    }
                }
                if(raindata[i].STCD!='00000000' && raindata[i].INTV=='180'  && raindata[i].DRP){
                    if(t_max3HRainStr.length == 0){
                        t_max3HRainStr += "；最大3小时雨量为" + raindata[i].STNM.trim() +"站：" + RthyinfoFormat.formatP(raindata[i].DRP)+"毫米";
                    }else{
                        t_max3HRainStr += "，" + raindata[i].STNM.trim() +"站：" + RthyinfoFormat.formatP(raindata[i].DRP)+"毫米";
                    }
                }
                if(raindata[i].STCD!='00000000' && raindata[i].INTV=='24'  && raindata[i].DRP){
                    if(t_max1DRainStr.length == 0){
                        t_max1DRainStr += "；最大1天雨量为" + raindata[i].STNM.trim() +"站：" + RthyinfoFormat.formatP(raindata[i].DRP)+"毫米";
                    }else{
                        t_max1DRainStr += "，" + raindata[i].STNM.trim() +"站：" + RthyinfoFormat.formatP(raindata[i].DRP)+"毫米";
                    }
                }
                if(raindata[i].STCD!='00000000' && raindata[i].INTV=='72'  && raindata[i].DRP){
                    if(t_max3DRainStr.length == 0){
                        t_max3DRainStr += "；最大3天雨量为" + raindata[i].STNM.trim() +"站：" + RthyinfoFormat.formatP(raindata[i].DRP)+"毫米";
                    }else{
                        t_max3DRainStr += "，" + raindata[i].STNM.trim() +"站：" + RthyinfoFormat.formatP(raindata[i].DRP)+"毫米";
                    }
                }
            }
            avgRainStr+=(t_AreaRainStr + t_maxRainStr + t_max1HRainStr + t_max3HRainStr + t_max1DRainStr + t_max3DRainStr);
        }else{
            avgRainStr += "，暂无雨量数据";
        }



        reportContent +=
            "<tr><td colspan=2 ><p align=left style='line-height:150%;font-size:16px '>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
            avgRainStr + "。</p></td></tr>";

        reportContent += "<tr><td style='font-size:18px' align=center colspan=2 height=60 valign=bottom>各乡镇(街道)降雨量</td></tr>";
        reportContent += "<tr><td align=right style='font-size:14px' valign=bottom>"+ maxRainStr +"</td>";
        reportContent += "<td align=right style='font-size:14px' valign=bottom>单位：mm</td><tr>";
        reportContent += "<table border=1 align=center width=700 style='border-collapse:collapse;margin:0 auto'><tr><td align=center height=30>乡镇(街道)</td>";

        if(zoneRainData!=null && zoneRainData.length>0){
            zoneRaindata = zoneRainData[0];
            console.log(zoneRaindata)
            var headName = "";
            var maxDrp = "";
            var maxDrpStnm = "";
            for(var i=0;i<zoneRaindata.length;i++){
                headName +="<td align=center>"+ zoneRaindata[i].name + "</td>";
                if(zoneRaindata[i].avValue!=null && zoneRaindata[i].avValue!="" || zoneRaindata[i].avValue ==0){
                    maxDrp +="<td align=center height=30>"+ zoneRaindata[i].avValue + "</td>";
                }else{
                    maxDrp +="<td align=center height=30>-</td>";
                }
                if(zoneRaindata[i].stationLis!=null && zoneRaindata[i].stationLis!=""){
                    if(zoneRaindata[i].stationLis.indexOf('，') >=0){
                        maxDrpStnm +="<td align=center height=30>"+ (zoneRaindata[i].stationLis).substring(0,(zoneRaindata[i].stationLis).indexOf('，')) + "</td>";
                    }else{
                        maxDrpStnm +="<td align=center height=30>"+ zoneRaindata[i].stationLis + "</td>";
                    }

                }else{
                    maxDrpStnm +="<td align=center height=30>-</td>";
                }

            }
        }

        reportContent += headName +"</tr><tr><td align=center>面雨量</td>"+ maxDrp +"</tr><tr><td align=center>最大雨量</td>"+ maxDrpStnm +"</tr></table>";


        //reportContent += "<tr><th align=center height=30>乡镇(街道)</th><th align=center>海游街道</th><th align=center>海润街道</th><th align=center>沙柳街道</th><th align=center>珠岙镇</th><th align=center>亭旁镇</th><th align=center>健跳镇</th><th align=center>浦坝港镇</th><th align=center>花桥镇</th><th align=center>横渡镇</th><th align=center>蛇蟠乡</th></tr>";
        //reportContent += "<tr><td rowspan=2 align=center>最大雨量</td><td align=center height=30>3</td><td align=center>4</td><td align=center>13</td><td align=center>0</td><td align=center>0</td><td align=center>0</td><td align=center>2</td><td align=center>0.2</td><td align=center>0</td><td align=center>0</td></tr>";
        //reportContent += "<tr><td align=center height=30>海游大桥</td><td align=center>龙皇殿水库</td><td align=center>大岙田水库</td><td align=center></td><td align=center></td><td align=center></td><td align=center>山场</td><td align=center>里院水库</td><td align=center></td><td align=center>巡检司(代)</td></tr>";
        //reportContent += "</table>";
        //********************降雨情况***************************end


        //******************河道水情************************begin
        reportContent +=
            "<table border=0.5  align=center width=700><tr><td align=left colspan=2 style='font-size:18px' height=70 valign=bottom><b>2、河道水情</b></td></tr>";
        var riverInfo = "";

        if(riverData!=null && riverData.length>0) {
            riverdata = riverData[0];
            var JJZNum = 0;
            var JJZName = "";
            var JJZDiff = "";
            for(var i = 0;i < riverdata.length;i++){
                if(riverdata[i].RZ != null && riverdata[i].RZ !="" &&riverdata[i].JJZ != null && riverdata[i].JJZ !=""){
                    if(riverdata[i].RZ > riverdata[i].JJZ){
                        JJZNum += 1;
                        JJZName += (riverdata[i].STNM).trim()+"、";
                        JJZDiff += (waterdata[i].RZ - waterdata[i].CZZ).toFixed(2) + "、";
                    }
                }
            }

            var jjzName = JJZName.split('、');
            var jjzDiff = JJZDiff.split('、');
            var jjzList = "";
            var jjzContent ="";
            for(var i=0;i<JJZNum;i++){
                jjzList += jjzName[i] +"站(超汛限" + jjzDiff[i] + "米)，";
            }
            var ojjzList = jjzList.substring(0,jjzList.length - 1);
            if(JJZNum ==0){
                jjzContent = "，河道水位均在警戒水位以下";
            }else{
                jjzContent = "，目前超汛限河道站点有" + JJZNum + "个，分别是" + ojjzList ;
            }


            riverInfo += "市域河道水位普遍XXXX" + jjzContent +"。<br>";


        }

        reportContent +=
            "<tr><td colspan=2 ><p align=left style='line-height:150%;font-size:16px'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
            riverInfo + "</p></td></tr>";
        reportContent += "<tr><td style='font-size:18px' align=center colspan=2 height=60 valign=bottom>各河道瞬时水位情况统计</td></tr>";
        reportContent += "<tr><td align=left style='font-size:14px' valign=bottom>"+ new Date(endTime).Format("yyyy年M月dd日8时") +"</td>";
        reportContent += "<td align=right style='font-size:14px' valign=bottom>单位：m</td><tr>";
        reportContent += "<table border=1 align=center width=700 style='border-collapse:collapse;margin:0 auto'>";
        reportContent += "<tr><td align=center height=30></td><td align=center></td><td align=center>瞬时水位</td><td align=center>汛限水位</td><td align=center>代表站点</td></tr>";
        reportContent += "<tr><td rowspan=3 align=center>一溪</td><td align=center height=30>上游</td><td align=center></td><td align=center></td><td align=center></td></tr>";
        reportContent += "<tr><td align=center height=30>中游</td><td align=center></td><td align=center></td><td align=center>一溪</td></tr>";
        reportContent += "<tr><td align=center height=30>下游</td><td align=center></td><td align=center></td><td align=center></td></tr>";
        reportContent += "<tr><td align=center height=30></td><td align=center></td><td align=center></td><td align=center></td><td align=center></td></tr>";
        reportContent += "<tr><td align=center height=30></td><td align=center></td><td align=center></td><td align=center></td><td align=center></td></tr>";
        reportContent += "</table>";

        //******************河道水情************************end


        //******************水库水情***********************begin
        reportContent +=
            "<table border=0.5  align=center width=700><tr><td align=left colspan=2 style='font-size:18px'  height=70 valign=bottom><b>3、水库水情</b></td></tr>";
        var rsvrInfo = "";
        if(waterData!=null && waterData.length>0) {
            waterdata = waterData[0];
            console.log(waterdata)
            var totalRZCP = 0;
            var totalACTCP = 0;
            var totalRAIN = 0;
            var bigRZCP = 0;
            var bigACTCP = 0;
            var bigRAIN = 0;
            var bigRZ = 0;
            var bigCZZ = 0;
            var middleRZCP = 0;
            var middleACTCP = 0;
            var middleRAIN = 0;
            var middleRZ = 0;
            var middleCZZ = 0;
            var smallOneRZCP = 0;
            var smallOneACTCP = 0;
            var smallOneRAIN = 0;
            var smallTwoRZCP = 0;
            var smallTwoACTCP = 0;
            var smallTwoRAIN = 0;
            var rainArryNum = [];
            var rainArryName = [];
            var CZZNum = 0;
            var CZZName = "";
            var CZZDiff = "";


            for(var i = 0;i < waterdata.length;i++){
                if(waterdata[i].RZCP != null && waterdata[i].RZCP != ""){
                    totalRZCP += waterdata[i].RZCP;
                }
                if(waterdata[i].ACTCP != null && waterdata[i].ACTCP !=""){
                    totalACTCP += waterdata[i].ACTCP;
                }


                var rsvrType;
                if(waterdata[i].RSVRTP){
                    rsvrType = waterdata[i].RSVRTP;
                }
                if(rsvrType.indexOf(4) >= 0){
                    if(waterdata[i].RZ != null && waterdata[i].RZ != ""){
                        bigRZ += waterdata[i].RZ;
                    }
                    if(waterdata[i].CZZ != null && waterdata[i].CZZ != ""){
                        bigCZZ += waterdata[i].CZZ;
                    }
                    if(waterdata[i].RZCP != null && waterdata[i].RZCP != ""){
                        bigRZCP+= waterdata[i].RZCP;
                    }
                    if(waterdata[i].ACTCP != null && waterdata[i].ACTCP != ""){
                        bigACTCP+= waterdata[i].ACTCP;
                    }
                    if(waterdata[i].RAIN != null && waterdata[i].RAIN !=""){
                        bigRAIN += waterdata[i].RAIN;
                    }
                }else if(rsvrType.indexOf(3) >= 0){
                    if(waterdata[i].RZ != null && waterdata[i].RZ != ""){
                        middleRZ += waterdata[i].RZ;
                    }
                    if(waterdata[i].CZZ != null && waterdata[i].CZZ != ""){
                        middleCZZ += waterdata[i].CZZ;
                    }
                    if(waterdata[i].RZCP != null && waterdata[i].RZCP != ""){
                        middleRZCP+= waterdata[i].RZCP;
                    }
                    if(waterdata[i].ACTCP != null && waterdata[i].ACTCP != ""){
                        middleACTCP+= waterdata[i].ACTCP;
                    }
                    if(waterdata[i].RAIN != null && waterdata[i].RAIN !=""){
                        middleRAIN += waterdata[i].RAIN;
                    }
                }else if(rsvrType.indexOf(1) >= 0){
                    if(waterdata[i].RZCP != null && waterdata[i].RZCP !=""){
                        smallTwoRZCP+= waterdata[i].RZCP;
                    }
                    if(waterdata[i].ACTCP != null && waterdata[i].ACTCP !=""){
                        smallTwoACTCP+= waterdata[i].ACTCP;
                    }
                    if(waterdata[i].RAIN != null && waterdata[i].RAIN !=""){
                        smallTwoRAIN += waterdata[i].RAIN;
                    }
                }else if(rsvrType.indexOf(2) >= 0){
                    if(waterdata[i].RZCP != null && waterdata[i].RZCP !=""){
                        smallOneRZCP+= waterdata[i].RZCP;
                    }
                    if(waterdata[i].ACTCP != null && waterdata[i].ACTCP !=""){
                        smallOneACTCP+= waterdata[i].ACTCP;
                    }
                    if(waterdata[i].RAIN != null && waterdata[i].RAIN !=""){
                        smallOneRAIN += waterdata[i].RAIN;
                    }
                }

                if(waterdata[i].RAIN != null && waterdata[i].RAIN !=""){
                    if(waterdata[i].RAIN){
                        rainArryNum.push(waterdata[i].RAIN);
                        rainArryName.push(waterdata[i].STNM);
                    }
                    totalRAIN += waterdata[i].RAIN;
                }

                if(riverdata[i].RZ != null && riverdata[i].RZ !="" &&riverdata[i].CZZ != null && riverdata[i].CZZ !=""){
                    if(riverdata[i].RZ > riverdata[i].CZZ){
                        CZZNum += 1;
                        CZZName += (riverdata[i].STNM).trim()+"、";
                        CZZDiff += (waterdata[i].RZ - waterdata[i].CZZ).toFixed(2) + "、";
                    }
                }


            }


            var totalRate = RthyinfoFormat.formatIn(totalRZCP/totalACTCP *100);
            var totalFlood = RthyinfoFormat.formatIn(totalACTCP - totalRZCP)>0 ? RthyinfoFormat.formatIn(totalACTCP - totalRZCP):0;
            var bigRate = RthyinfoFormat.formatIn(bigRZCP/bigACTCP *100);
            var bigFlood = RthyinfoFormat.formatIn(bigACTCP - bigRZCP)>0 ? RthyinfoFormat.formatIn(bigACTCP - bigRZCP):0;
            var middleRate = RthyinfoFormat.formatIn(middleRZCP/middleACTCP *100);
            var middleFlood = RthyinfoFormat.formatIn(middleACTCP - middleRZCP)>0 ? RthyinfoFormat.formatIn(middleACTCP - middleRZCP):0;
            var smallOneRate = RthyinfoFormat.formatIn(smallOneRZCP/smallOneACTCP *100);
            var smallOneFlood = RthyinfoFormat.formatIn(smallOneACTCP - smallOneRZCP)>0 ? RthyinfoFormat.formatIn(smallOneACTCP - smallOneRZCP):0;
            var smallTwoRate = RthyinfoFormat.formatIn(smallTwoRZCP/smallTwoACTCP *100);
            var smallTwoFlood = RthyinfoFormat.formatIn(smallTwoACTCP - smallTwoRZCP)>0 ? RthyinfoFormat.formatIn(smallTwoACTCP - smallTwoRZCP):0;

            var over300Num = 0;
            var over300Name = "";
            var over200Num = 0;
            var over200Name = "";
            var over100Num = 0;
            var over100Name = "";

            //可拦蓄水量
            for(var i=0;i<rainArryNum.length;i++){
                if(rainArryNum[i]>=300){
                    over300Num +=1;
                    over300Name += rainArryName[i] + "、";
                }else if(rainArryNum[i]>=200){
                    over200Num +=1;
                    over200Name += rainArryName[i] + "、"
                }else if(rainArryNum[i]>=100){
                    over100Num +=1;
                    over100Name += rainArryName[i] + "、"
                }
            }

            var o300Name = over300Name.substring(0,over300Name.length-1);
            var o200Name = over200Name.substring(0,over200Name.length-1);
            var o100Name = over100Name.substring(0,over100Name.length-1);
            var over300List = "";
            var over200List = "";
            var over100List = "";
            var allList = "";
            if(over300Num ==0){
                over300List = "";
            }else{
                over300List = "目前我市各水库可拦蓄水量>=300毫米的水库有"+ o300Name +"等" + over300Num +"座；"
            }
            if(over200Num ==0){
                over200List = "";
            }else{
                over200List = "介于200毫米到300毫米的水库有"+ o200Name +"等" + over200Num +"座；"
            }

            if(over100Num ==0){
                over100List = "";
            }else{
                over100List = "介于100毫米到200毫米的水库有"+ o100Name +"等" + over100Num +"座；"
            }
            if(over300Num ==0 && over200Num ==0 && over100Num ==0){
                allList = "水库可拦雨量都不超过100毫米。"
            }else{
                allList = "其他水库可拦雨量不超过100毫米。"
            }


            var czzName = CZZName.split('、');
            var czzDiff = CZZDiff.split('、');
            var czzList = "";
            var czzContent ="";
            for(var i=0;i<CZZNum;i++){
                czzList += czzName[i] +"(超汛限" + czzDiff[i] + "米)、";
            }
            var oczzList = czzList.substring(0,czzList.length - 1);
            if(CZZNum ==0){
                czzContent = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;全市汛情总体趋势平稳,水库水位均在汛限水位以下";
            }else{
                czzContent = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;目前超汛限的水库有" + CZZNum + "座：" + oczzList ;
            }



            rsvrInfo += "全市" + waterdata.length+ "座水库蓄水率" +totalRate +"%。" + "大型水库蓄水率" + bigRate + "%，可拦蓄水量" + RthyinfoFormat.formatIn(bigRAIN) + "百万m³。<br>";
            rsvrInfo += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;中型水库平均蓄水率" + middleRate + "%，可拦蓄水量" + RthyinfoFormat.formatIn(middleRAIN) + "百万m³。<br>";
            rsvrInfo += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;小(一)型水库平均蓄水率" + smallOneRate + "%，可拦蓄水量" + RthyinfoFormat.formatIn(smallOneRAIN) + "百万m³。<br>";
            rsvrInfo += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;小(二)型水库平均蓄水率" + smallTwoRate + "%，可拦蓄水量" + RthyinfoFormat.formatIn(smallTwoRAIN) + "百万m³。<br><br>";

            rsvrInfo += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;全市" + waterdata.length+ "座水库蓄水率" +totalRate +"%。" + "大型水库蓄水率" + bigRate + "%，可调用水量" + bigFlood + "百万m³。<br>";
            rsvrInfo += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;中型水库平均蓄水率" + middleRate + "%，可调用水量" + middleFlood + "百万m³。<br>";
            rsvrInfo += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;小(一)型水库平均蓄水率" + smallOneRate + "%，可调用水量" + smallOneFlood + "百万m³。<br>";
            rsvrInfo += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;小(二)型水库平均蓄水率" + smallTwoRate + "%，可调用水量" + smallTwoFlood + "百万m³。<br><br>";

            rsvrInfo += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;我市水库可拦截雨量情况：" + over300List + over200List + over100List + allList +"<br><br>";

            rsvrInfo += czzContent + "。";

        }

        reportContent +=
            "<tr><td colspan=2 ><p align=left style='line-height:150%;font-size:16px'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
            rsvrInfo + "</p></td></tr>";

        reportContent += "<tr><td style='font-size:18px' align=center colspan=2 height=60 valign=bottom>全市水库蓄水情况表</td></tr>";
        reportContent += "<table border=1 align=center width=700 style='border-collapse:collapse;margin:10px auto 0'>";
        reportContent += "<tr><td align=center height=30 width=5%></td><td colspan=4 align=center width=33%>总体情况</td><td colspan=3 align=center width=15%>大型水库</td><td colspan=3 align=center>中型水库</td><td colspan=2 align=center>小(一)型水库</td><td colspan=2 align=center>小(二)型水库</td></tr>";
        reportContent += "<tr><td align=center height=30>水情指标</td><td align=center>总蓄水量(百万m³)</td><td align=center>总蓄水率(%)</td><td align=center>还可拦蓄总量(百万m³)</td><td align=center>还可调用总量(百万m³)</td><td align=center>蓄水量(百万m³)</td><td align=center>蓄水率(%)</td><td align=center>水位(米)</td><td align=center>蓄水量(百万m³)</td><td align=center>蓄水率(%)</td><td align=center>水位(米)</td><td align=center>蓄水量(百万m³)</td><td align=center>蓄水率(%)</td><td align=center>蓄水量(百万m³)</td><td align=center>蓄水率(%)</td></tr>";
        reportContent += "<tr><td align=center height=30>正常情况</td><td align=center>"+ RthyinfoFormat.formatIn(totalACTCP) +"</td><td align=center></td><td align=center></td><td align=center></td><td align=center>"+ RthyinfoFormat.formatIn(bigACTCP) +"</td><td align=center></td><td align=center>"+ RthyinfoFormat.formatIn(bigCZZ) +"</td><td align=center>"+ RthyinfoFormat.formatIn(middleACTCP) +"</td><td align=center></td><td align=center>"+ RthyinfoFormat.formatIn(middleCZZ) +"</td><td align=center>"+ RthyinfoFormat.formatIn(smallOneACTCP) +"</td><td align=center></td><td align=center>"+ RthyinfoFormat.formatIn(smallTwoACTCP) +"</td><td align=center></td></tr>";
        reportContent += "<tr><td align=center height=30>目前情况</td><td align=center>"+ RthyinfoFormat.formatIn(totalRZCP) +"</td><td align=center>"+ totalRate +"</td><td align=center>"+ RthyinfoFormat.formatIn(totalRAIN) +"</td><td align=center>"+ totalFlood +"</td><td align=center>"+ RthyinfoFormat.formatIn(bigRZCP) +"</td><td align=center>"+ bigRate +"</td><td align=center>"+ RthyinfoFormat.formatIn(bigRZ) +"</td><td align=center>"+ RthyinfoFormat.formatIn(middleRZCP) +"</td><td align=center>"+ middleRate +"</td><td align=center>"+ RthyinfoFormat.formatIn(middleRZ) +"</td><td align=center>"+ RthyinfoFormat.formatIn(smallOneRZCP) +"</td><td align=center>"+ smallOneRate +"</td><td align=center>"+ RthyinfoFormat.formatIn(smallTwoRZCP) +"</td><td align=center>"+ smallTwoRate +"</td></tr>";
        reportContent += "</table>";


        //******************水库水情***********************end


        //******************潮位情况***********************end

        //reportContent +=
        //    "<table border=0.5  align=center width=700><tr><td align=left colspan=2 style='font-size:18px' height=70 valign=bottom><b>4、潮位情况</b></td></tr>";
        //
        //var tideInfo = "";
        //if(tideData!=null && tideData.length>0){
        //    var tidedata = tideData[0].reverse();
        //    if(tidedata !=null && tidedata !=""){
        //        for (var i = 0; i < tidedata.length; i++) {
        //            if (tidedata[i].hltdmk == 1 || tidedata[i].hltdmk == 2) {
        //                tideInfo += '健跳港(健跳站)实测高潮在' + new Date(tidedata[i].tm_yc).Format("hh:mm") + "，潮位" + RthyinfoFormat.formatIn(tidedata[i].yc_z) + "米(超黄色警戒XXXX米)，预计下次高潮出现在XX日XX：XX，潮位X.XX米；<br><br>";
        //                break
        //            }
        //        }
        //    }else{
        //        tideInfo += "健跳港(健跳站)没有潮位信息。<br><br>";
        //    }
        //}else{
        //    tideInfo += "健跳港(健跳站)没有潮位信息。<br><br>";
        //}
        //
        //
        //if(tideData2!=null && tideData2.length>0){
        //    var tidedata2 = tideData2[0].reverse();
        //    if(tidedata2 !=null && tidedata2 !=""){
        //        for (var i = 0; i < tidedata2.length; i++) {
        //            if (tidedata2[i].hltdmk == 1 || tidedata2[i].hltdmk == 2) {
        //                tideInfo += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;海游港(三山站)实测高潮在' + new Date(tidedata[i].tm_yc).Format("hh:mm") + "，潮位" + RthyinfoFormat.formatIn(tidedata[i].yc_z) + "米(超黄色警戒XXXX米)，预计下次高潮出现在XX日XX：XX，潮位X.XX米；<br>";
        //                break
        //            }
        //        }
        //    }else{
        //        tideInfo += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;海游港(三山站)没有潮位信息。<br>";
        //    }
        //}else{
        //    tideInfo += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;海游港(三山站)没有潮位信息。<br>";
        //}
        //
        //reportContent +=
        //    "<tr><td colspan=2 ><p align=left style='line-height:150%;font-size:16px'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
        //    tideInfo + "</p></td></tr>";
        //
        //reportContent += "<tr><td style='font-size:23px' align=center colspan=2 height=60 valign=bottom><b>未来三天潮位情况表(预测)</b></td></tr></table>";
        //reportContent += "<table border=1 align=center width=700 style='border-collapse:collapse;margin:10px auto 0'>";
        //reportContent += "<tr><th align=center height=40 width='10%'>站点</th><th align=center width='10%'>日期</th><th align=center width='10%'>第一次高潮时间</th><th align=center width='10%'>潮位</th><th align=center width='10%'>第二次高潮时间</th><th align=center width='10%'>潮位</th><th align=center width='10%'>第一次低潮时间</th><th align=center width='10%'>潮位</th><th align=center width='10%'>第二次低潮时间</th><th align=center width='10%'>潮位</th></tr>";
        //reportContent += "<tr><td align=center height=40>健跳</td><td align=center height=30>2017-07-29</td><td align=center>00:29</td><td align=center>2.82</td><td align=center>12:45</td><td align=center>2.24</td><td align=center>06:26</td><td align=center>-1.40</td><td align=center>18:45</td><td align=center>-1.43</td></tr>";
        //reportContent += "<tr><td align=center height=40>健跳</td><td align=center height=30>2017-07-30</td><td align=center>01:05</td><td align=center>2.49</td><td align=center>13:36</td><td align=center>1.96</td><td align=center>07:03</td><td align=center>-1.18</td><td align=center>19:26</td><td align=center>-0.99</td></tr>";
        //reportContent += "<tr><td align=center height=40>健跳</td><td align=center height=30>2017-07-31</td><td align=center>01:46</td><td align=center>2.14</td><td align=center>14:38</td><td align=center>1.70</td><td align=center>07:57</td><td align=center>-0.97</td><td align=center>20:29</td><td align=center>-0.60</td></tr>";
        //reportContent += "</table>";
        //


        //*********************潮位水情**************************end


        //********************下一步建议***********************begin
        reportContent +=
            "<table border=0.5  align=center width=700><tr><td align=left colspan=2 style='font-size:18px' height=70 valign=bottom><b>4、下一步建议</b></td></tr>";

        var measuresInfo = "";
        measuresInfo += "据气象预报，预计XXXX，请各乡镇(街道)和部门单位注意：<br>";
        measuresInfo += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1)根据市防指防台应急响应及时启动应急预案，切实做好防台工作。<br>";
        measuresInfo += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2)严防局地强降雨带来的次生灾害，加强地质灾害易发点的监测巡查，发现险情及时处置，及时转移危险区域群众，严防已转移人员回流，确保人员安全。<br>";
        measuresInfo += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3)严格执行水利工程调度方案和水库控运计划，确保水利工程安全运行。<br>";
        measuresInfo += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4)注意城镇低洼地带可能积水带来的安全隐患，电视台等新闻媒体要加强宣传，及时做好防台相关信息的播报。<br>";

        reportContent +=
            "<tr><td colspan=2 ><p align=left style='line-height:150%;font-size:16px'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
            measuresInfo + "</p></td></tr></table>";


        //********************下一步建议***********************end


        editor1.html(reportContent);

    }).fail(function(){
        editor1.html("请求数据出错了！！");
    });
};

// 最新水雨情信息
var LastFloodInfo = function(){
    var startTime = $("#StartTime").textbox('getValue');
    var endTime = $("#EndTime").textbox('getValue');
    var time = new Date().Format("yyyy-MM-dd 08:00");
    var StartPointTime = new Date(startTime);
    var EndPointTime = new Date(endTime);

    $.when($.ajax({
            url: baseUrl + "floodProfAnalyzSys/floodAnalyzeShow/getAbstractRainInfo.do",
            data: {
                startTime: startTime,
                endTime: endTime
            }
        }),
        $.ajax({
            url: baseUrl + "floodProfAnalyzSys/floodAnalyzeShow/getAbstractRSVRInfo.do",
            data: {
                time:time
            }
        }),
        $.ajax({
            url:baseUrl + "comm/waterInfo/getWaterList.do",
            data:{
                stcd:"70704872,SM010209"
            }
        }),
        $.ajax({
            url:baseUrl + "floodProfAnalyzSys/floodAnalyzeShow/getTideHLPLInfo.do",
            data:{
                stcd:"70705200",
                endTime:endTime,
                startTime:EndPointTime.DateAdd('day',-2).Format("yyyy-MM-dd hh:mm"),
                sortType:"TM"
            }
        })
    ).done(function(rainData,waterData,ZData,tideData){
        console.log(tideData)
        var reportContent = "";
        reportName = StartPointTime.getFullYear() + "年第**期最新风水雨情";

        reportContent += "<style type='text/css'>hr{border:border:1px solid red;}</style><table border=0.5  align=center width='700'>";
        reportContent += "<tr><td style='font-size:60px;color:#FD6E0F' align=center colspan=2><b>最新风水雨情</b></td></tr>";
        reportContent += "<tr ><td style='font-size:20px;' align=center colspan=2><b>(" + StartPointTime.getFullYear() + "年第**期)</b></td>";
        reportContent += "<tr ><td align=left style='font-size:19px;color:#FF6600;font-family:楷体_GB2312' valign=bottom><b>" + departName + "</b></td>";
        reportContent += "<td align=right style='font-size:19px;font-family:楷体_GB2312' valign=bottom>截止" + new Date(endTime).Format("yyyy年MM月dd日hh时") + "</td>";
        reportContent += "</tr>";

        // 输出分隔线
        reportContent += "<tr><td align=center colspan=2 height='20px' ><hr /></td></tr>";


        //**********************输出雨情***************************begin
        reportContent +=
            "<tr><td align=left colspan=2 style='font-size:18px' ><b>&nbsp;&nbsp;&nbsp;&nbsp;一、雨情</b></td></tr>";

        //输出面雨最信息
        var avgRainStr = "";
        if (StartPointTime.getMonth() != EndPointTime.getMonth())
            avgRainStr += StartPointTime.Format("M月d日h时")+"至"+EndPointTime.Format("M月d日h时");
        else
            avgRainStr += StartPointTime.Format("M月d日h时")+"至"+EndPointTime.Format("d日h时");

        if(rainData!=null && rainData.length>0){
            raindata = rainData[0];
            for(var i=0;i<raindata.length;i++){
                if(raindata[i].STCD=='00000000' && raindata[i].DRP > 0.5){
                    avgRainStr += "，全市累计面雨量" + RthyinfoFormat.formatP(raindata[i].DRP)+"毫米";
                }
                if(raindata[i].STCD=='00000000' && raindata[i].DRP <= 0.5){
                    avgRainStr += "，全市基本无雨";
                    break;
                }

                if(raindata[i].STCD!='00000000' && raindata[i].INTV=='0' && raindata[i].DRP){
                    avgRainStr += "，其中最大为" + raindata[i].STNM.trim() +"站：" + RthyinfoFormat.formatP(raindata[i].DRP)+"毫米";
                }
                if(raindata[i].STCD!='00000000' && raindata[i].INTV=='60'  && raindata[i].DRP){
                    avgRainStr += "。最大1小时雨量为" + raindata[i].STNM.trim() +"站：" + RthyinfoFormat.formatP(raindata[i].DRP)+"毫米";
                }
                if(raindata[i].STCD!='00000000' && raindata[i].INTV=='180'  && raindata[i].DRP){
                    avgRainStr += "；最大3小时雨量为" + raindata[i].STNM.trim() +"站：" + RthyinfoFormat.formatP(raindata[i].DRP)+"毫米";
                }
            }
        }else{
            avgRainStr += "，暂无雨量数据";
        }

        reportContent +=
            "<tr><td colspan=2 ><p align=left style='line-height:150%;font-size:16px '>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
            avgRainStr + "。</p></td></tr>";
        //********************输出雨情*****************************end


        //******************输出水库水情************************begin
        reportContent +=
            "<tr><td align=left colspan=2 style='font-size:18px' ><b>&nbsp;&nbsp;&nbsp;&nbsp;二、水情</b></td></tr>";
        var rsvrInfo = "";
        var index = 0;
        index +=1;
        if(waterData!=null && waterData.length>0) {
            waterdata = waterData[0];
            console.log(waterdata)
            var totalRZCP = 0;
            var totalACTCP = 0;
            var smallOneRZCP = 0;
            var smallOneACTCP = 0;
            var smallOneFlood = 0;
            var smallTwoRZCP = 0;
            var smallTwoACTCP = 0;
            var smallTwoFlood = 0;
            var DDZNum = 0;
            var DDZName = "";
            var rsvrName = "";
            var waterLevel = "";
            var storage = "";
            var overDeadWater = "";
            var flood = "";

            for(var i = 0;i < waterdata.length;i++){
                if(waterdata[i].RZCP != null && waterdata[i].RZCP !="" &&waterdata[i].ACTCP != null && waterdata[i].ACTCP !=""){
                    totalRZCP+= waterdata[i].RZCP;
                    totalACTCP+= waterdata[i].ACTCP;
                }
                if(waterdata[i].RZ != null && waterdata[i].RZ !="" &&waterdata[i].DDZ != null && waterdata[i].DDZ !=""){
                    if(waterdata[i].RZ < waterdata[i].DDZ){
                        DDZNum += 1;
                        DDZName += (waterdata[i].STNM).trim()+"、";
                    }
                }

                var rsvrType;
                if(waterdata[i].RSVRTP){
                    rsvrType = waterdata[i].RSVRTP;
                }
                if(rsvrType.indexOf(3) >= 0){
                    rsvrName += waterdata[i].STNM.trim();
                    waterLevel = waterdata[i].RZ;
                    var rzcp = waterdata[i].RZCP;
                    var actcp = waterdata[i].ACTCP;
                    if(rzcp == null || actcp == null){
                        storage = "";
                        flood = "";
                    }else{
                        storage = "蓄水率"+RthyinfoFormat.formatIn((waterdata[i].RZCP/waterdata[i].ACTCP)*100) +"%，";
                        flood=((waterdata[i].ACTCP-waterdata[i].RZCP)>0 ? "，可拦蓄水量" + waterdata[i].ACTCP - waterdata[i].RZCP + "百万立方":0);
                    }
                    overDeadWater = RthyinfoFormat.formatIn((waterdata[i].RZ - waterdata[i].DDZ).toFixed(2));
                    console.log(waterdata[i].RZ - waterdata[i].DDZ)
                }else if(rsvrType.indexOf(1) >= 0){
                    if(waterdata[i].RZCP != null && waterdata[i].RZCP !=""&&waterdata[i].ACTCP != null && waterdata[i].ACTCP !=""){
                        smallTwoRZCP+= waterdata[i].RZCP;
                        smallTwoACTCP+= waterdata[i].ACTCP;
                        smallTwoFlood += (waterdata[i].ACTCP - waterdata[i].RZCP>0)?waterdata[i].ACTCP - waterdata[i].RZCP:0;
                    }
                }else if(rsvrType.indexOf(2) >= 0){
                    if(waterdata[i].RZCP != null && waterdata[i].RZCP !=""&&waterdata[i].ACTCP != null && waterdata[i].ACTCP !=""){
                        smallOneRZCP+= waterdata[i].RZCP;
                        smallOneACTCP+= waterdata[i].ACTCP;
                        smallOneFlood += (waterdata[i].ACTCP - waterdata[i].RZCP>0)?waterdata[i].ACTCP - waterdata[i].RZCP:0;
                    }
                }
            }

            var ddzName = DDZName.substring(0,DDZName-1);
            var ddzList ="";
            if(DDZNum ==0){
                ddzList = "没有水库在死水位以下";
            }else{
                ddzList = "水位在死水位以下水库有" + DDZNum + "座:" + ddzName ;
            }

            var overDDZlist = "";
            if(overDeadWater > 0){
                overDDZlist = "超过死水位" + overDeadWater +"米"
            }else{
                overDDZlist = "没有超过死水位"
            }

            var totalRate = (totalRZCP/totalACTCP *100).toFixed(2);
            var smallOneRate = (smallOneRZCP/smallOneACTCP *100).toFixed(2);
            var smallTwoRate = (smallTwoRZCP/smallTwoACTCP *100).toFixed(2);

            var waterlist = ZData[0].waterList;
            var Hlevel = "";
            var Dlevel ="";

            if(waterlist[0].jjz!=null&&waterlist[0].normalZ!=null){
                Hlevel = "(警戒水位"+ (waterlist[0].jjz).toFixed(1) +"米，正常水位"+ (waterlist[0].normalZ).toFixed(1) +"米)" ;
            }else if(waterlist[0].jjz!=null&&waterlist[0].normalZ==null){
                Hlevel = "(警戒水位"+ (waterlist[0].jjz).toFixed(1) +"米)" ;
            }else if(waterlist[0].jjz==null&&waterlist[0].normalZ!=null){
                Hlevel = "(正常水位"+ (waterlist[0].normalZ).toFixed(1) +"米)" ;
            }else if(waterlist[0].jjz==null&&waterlist[0].normalZ==null){
                Hlevel = "" ;
            }
            if(waterlist[1].jjz!=null&&waterlist[1].normalZ!=null){
                Dlevel = "(警戒水位"+ (waterlist[1].jjz).toFixed(1) +"米，正常水位"+ (waterlist[1].normalZ).toFixed(1) +"米)" ;
            }else if(waterlist[1].jjz!=null&&waterlist[1].normalZ==null){
                Dlevel = "(警戒水位"+ (waterlist[1].jjz).toFixed(1) +"米)" ;
            }else if(waterlist[1].jjz==null&&waterlist[1].normalZ!=null){
                Dlevel = "(正常水位"+ (waterlist[1].normalZ).toFixed(1) +"米)" ;
            }else if(waterlist[1].jjz==null&&waterlist[1].normalZ==null){
                Dlevel = "" ;
            }

            rsvrInfo += index +"、全市" + waterdata.length+ "座水库蓄水率" +RthyinfoFormat.formatIn(totalRate) +"%。" + ddzList +"。<br>";
            index += 1;
            rsvrInfo += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + index + "、" + rsvrName +"水位" + RthyinfoFormat.formatIn(waterLevel) + "米，" + storage + overDDZlist + flood + "。<br>";
            index += 1;
            rsvrInfo += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +  index + "、" + "小(一)型水库蓄水率" + RthyinfoFormat.formatIn(smallOneRate) + "%，可拦蓄水量" + smallOneFlood.toFixed(2) + "百万立方。<br>";
            index += 1;
            rsvrInfo += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +  index + "、" + "小(二)型水库平均蓄水率" + RthyinfoFormat.formatIn(smallTwoRate) + "%，可拦蓄水量" + smallTwoFlood.toFixed(2) + "百万立方。<br>";
            index += 1;
            rsvrInfo += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +  index + "、" + waterlist[0].stnm+ "水位"+ RthyinfoFormat.formatIn(waterlist[0].z) +"米"+ Hlevel +"。"+ waterlist[1].stnm +"水位"+ RthyinfoFormat.formatIn(waterlist[1].z) +"米"+ Dlevel + "。<br>";
        }

            reportContent +=
                "<tr><td colspan=2 ><p align=left style='line-height:150%;font-size:16px'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
                rsvrInfo + "</p></td></tr>";

        //********输出水库水情********************************end


        reportContent +=
            "<tr><td align=left colspan=2 style='font-size:18px' ><b>&nbsp;&nbsp;&nbsp;&nbsp;三、潮位</b></td></tr>";


        var tideInfo = new Date(endTime).Format("dd日");
        if(tideData!=null && tideData.length>0){
            var tidedata = tideData[0].reverse();
            if(tidedata !=null && tidedata !=""){
                for (var i = 0; i < tidedata.length; i++) {
                    if (tidedata[i].hltdmk == 1 || tidedata[i].hltdmk == 2) {
                        tideInfo += ',健跳潮位站实测高潮在' + new Date(tidedata[i].tm_yc).Format("hh:mm") + "，潮位" + RthyinfoFormat.formatIn(tidedata[i].yc_z) + "米。";
                        break
                    }
                }
            }else{
                tideInfo += "，健跳潮位站没有潮位信息。";
            }
        }else{
            tideInfo += "，健跳潮位站没有潮位信息。";
        }

        reportContent +=
                    "<tr><td colspan=2 ><p align=left style='line-height:150%;font-size:16px'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
                    tideInfo + "</p></td></tr>";

        //************************输出潮位水情******************************end

        editor1.html(reportContent);

    }).fail(function(){
        editor1.html("请求数据出错了！！");
    });
};

// 台风汛情信息
var TyphoonFloodInfo = function(){
    var startTime = $("#StartTime").textbox('getValue');
    var endTime = $("#EndTime").textbox('getValue');
    var time = new Date().Format("yyyy-MM-dd 08:00");
    var StartPointTime = new Date(startTime);
    var EndPointTime = new Date(endTime);

    $.when($.ajax({
            url: baseUrl + "floodProfAnalyzSys/floodAnalyzeShow/getAbstractRainInfo.do",
            data: {
                startTime: startTime,
                endTime: endTime
            }
        }),
        $.ajax({
            url: baseUrl + "floodProfAnalyzSys/floodAnalyzeShow/getAbstractRSVRInfo.do",
            data: {
                time:time
            }
        }),
        $.ajax({
            url:baseUrl + "comm/waterInfo/getWaterList.do",
            data:{
                stcd:"70704872,SM010209"
            }
        }),
        $.ajax({
            url:baseUrl + "floodProfAnalyzSys/floodAnalyzeShow/getTideHLPLInfo.do",
            data:{
                stcd:"70705200",
                endTime:endTime,
                startTime:EndPointTime.DateAdd('day',-2).Format("yyyy-MM-dd hh:mm"),
                sortType:"TM"
            }
        })
    ).done(function(rainData,waterData,ZData,tideData){
        var reportContent = "";
        reportName = StartPointTime.getFullYear() + "年第**期台风汛情通告";

        reportContent += "<style type='text/css'>hr{border:border:1px solid red;}</style><table border=0.5  align=center width='700'>";
        reportContent += "<tr><td style='font-size:40px;color:#FD6E0F' align=center colspan=2><b>台风汛情通告</b></td></tr>";
        reportContent += "<tr ><td style='font-size:20px;' align=center colspan=2><b>(" + StartPointTime.getFullYear() + "年第**期)</b></td>";
        reportContent += "<tr ><td align=left style='font-size:19px;color:#FF6600;font-family:楷体_GB2312' valign=bottom><b>" + departName + "</b></td>";
        reportContent += "<td align=right style='font-size:19px;font-family:楷体_GB2312' valign=bottom>截止" + new Date(endTime).Format("yyyy年MM月dd日hh时") + "</td>";
        reportContent += "</tr>";

        // 输出分隔线
        reportContent += "<tr><td align=center colspan=2 height='20px' ><hr /></td></tr>";


        //********输出雨情********************************begin
        reportContent +=
            "<tr><td align=left colspan=2 style='font-size:18px' ><b>&nbsp;&nbsp;&nbsp;&nbsp;一、雨情</b></td></tr>";

        //输出面雨最信息
        var avgRainStr = "";
        if (StartPointTime.getMonth() != EndPointTime.getMonth())
            avgRainStr += StartPointTime.Format("M月d日h时")+"至"+EndPointTime.Format("M月d日h时");
        else
            avgRainStr += StartPointTime.Format("M月d日h时")+"至"+EndPointTime.Format("d日h时");

        if(rainData!=null && rainData.length>0){
            raindata = rainData[0];
            for(var i=0;i<raindata.length;i++){
                if(raindata[i].STCD=='00000000' && raindata[i].DRP > 0.5){
                    avgRainStr += "，全市面雨量" + RthyinfoFormat.formatP(raindata[i].DRP)+"毫米";
                }
                if(raindata[i].STCD=='00000000' && raindata[i].DRP <= 0.5){
                    avgRainStr += "，全市基本无雨";
                    break;
                }

                if(raindata[i].STCD!='00000000' && raindata[i].INTV=='0' && raindata[i].DRP){
                    avgRainStr += "，其中最大为" + raindata[i].STNM.trim() +"站，雨量" + RthyinfoFormat.formatP(raindata[i].DRP)+"毫米";
                }
                if(raindata[i].STCD!='00000000' && raindata[i].INTV=='60' && raindata[i].DRP){
                    avgRainStr += "。最大1小时为" + raindata[i].STNM.trim() +"站，雨量" + RthyinfoFormat.formatP(raindata[i].DRP)+"mm";
                }
                if(raindata[i].STCD!='00000000' && raindata[i].INTV=='180' && raindata[i].DRP){
                    avgRainStr += "；最大3小时为" + raindata[i].STNM.trim() +"站，雨量" + RthyinfoFormat.formatP(raindata[i].DRP)+"mm";
                }
            }
        }else{
            avgRainStr += "，暂无雨量数据";
        }

        reportContent +=
            "<tr><td colspan=2 ><p align=left style='line-height:150%;font-size:16px'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
            avgRainStr + "。</p></td></tr>";
        //*******************输出雨情**************************end


        //******************输出水情*************************begin
        reportContent +=
            "<tr><td align=left colspan=2 style='font-size:18px' ><b>&nbsp;&nbsp;&nbsp;&nbsp;二、水情</b></td></tr>";
        var rsvrInfo = "";
        var index = 0;
        index +=1;

        if(waterData!=null && waterData.length>0) {
            waterdata = waterData[0];
            console.log(waterdata)
            var totalRZCP = 0;
            var totalACTCP = 0;
            var smallOneRZCP = 0;
            var smallOneACTCP = 0;
            var smallOneFlood = 0;
            var smallTwoRZCP = 0;
            var smallTwoACTCP = 0;
            var smallTwoFlood = 0;
            var oCZZsmallOneNum = 0;
            var overCZZsmallOneName = "";
            var oCZZsmallTwoNum = 0;
            var overCZZsmallTwoName = "";
            var smallOneNum = 0;
            var smallTwoNum = 0;
            var rsvrName = "";
            var waterLevel = "";
            var storage = "";
            var frowCZZLevel = "";
            var flood = "";
            var rainArryNum = [];
            var rainArryName = [];
            for(var i=0;i<waterdata.length;i++){
                if(waterdata[i].RZCP != null && waterdata[i].RZCP !=""){
                    totalRZCP+= waterdata[i].RZCP;
                }
                if(waterdata[i].ACTCP != null && waterdata[i].ACTCP !=""){
                    totalACTCP+= waterdata[i].ACTCP;
                }
                var rsvrType;
                if(waterdata[i].RSVRTP){
                    rsvrType = waterdata[i].RSVRTP;
                }

                if(rsvrType.indexOf(3) >= 0){
                    rsvrName += waterdata[i].STNM.trim();
                    waterLevel = waterdata[i].RZ;
                    frowCZZLevel = (waterdata[i].CZZ - waterdata[i].RZ)>0 ? waterdata[i].CZZ - waterdata[i].RZ:"";
                    var rzcp = waterdata[i].RZCP;
                    var actcp = waterdata[i].ACTCP;
                    if(rzcp == null || actcp == null){
                        storage = "";
                        flood = "";
                    }else{
                        storage = "蓄水率"+RthyinfoFormat.formatIn((waterdata[i].RZCP/waterdata[i].ACTCP)*100) +"%。";
                        flood=((waterdata[i].ACTCP-waterdata[i].RZCP)>0 ? "可调蓄库容" + waterdata[i].ACTCP - waterdata[i].RZCP + "百万立方":0);
                    }
                }else if(rsvrType.indexOf(1) >= 0){
                    smallTwoNum +=1;
                    if(waterdata[i].RZCP != null && waterdata[i].RZCP !=""){
                        smallTwoRZCP+= waterdata[i].RZCP;
                    }
                    if(waterdata[i].ACTCP != null && waterdata[i].ACTCP !=""){
                        smallTwoACTCP+= waterdata[i].ACTCP;
                    }
                    smallTwoFlood += (waterdata[i].ACTCP - waterdata[i].RZCP>0)?waterdata[i].ACTCP - waterdata[i].RZCP:0;
                    if(waterdata[i].RZ != null && waterdata[i].RZ !="" && waterdata[i].CZZ != null && waterdata[i].CZZ !=""){
                        if(waterdata[i].RZ > waterdata[i].CZZ){
                            oCZZsmallTwoNum += 1;
                            overCZZsmallTwoName += (waterdata[i].STNM).trim()+"、";
                        }
                    }
                }else if(rsvrType.indexOf(2) >= 0){
                    smallOneNum +=1;
                    if(waterdata[i].RZCP != null && waterdata[i].RZCP !="" ){
                        smallOneRZCP+= waterdata[i].RZCP;
                    }
                    if(waterdata[i].ACTCP != null && waterdata[i].ACTCP !="" ){
                        smallOneACTCP+= waterdata[i].ACTCP;
                    }
                    smallOneFlood +=(waterdata[i].ACTCP - waterdata[i].RZCP>0)?waterdata[i].ACTCP - waterdata[i].RZCP:0;
                    if(waterdata[i].RZ != null && waterdata[i].RZ !="" && waterdata[i].CZZ != null && waterdata[i].CZZ !=""){
                        if(waterdata[i].RZ > waterdata[i].CZZ){
                            oCZZsmallOneNum += 1;
                            overCZZsmallOneName += (waterdata[i].STNM).trim()+"、";
                        }
                    }
                }

                if(waterdata[i].RAIN != null && waterdata[i].RAIN !=""){
                    if(waterdata[i].RAIN){
                        rainArryNum.push(waterdata[i].RAIN);
                        rainArryName.push(waterdata[i].STNM);
                    }
                }
            }

            var oCZZsmallOneName = overCZZsmallOneName.substring(0,overCZZsmallOneName.length-1);
            var oCZZsmallTwoName = overCZZsmallTwoName.substring(0,overCZZsmallTwoName.length-1);
            var totalRate = (totalRZCP/totalACTCP *100).toFixed(2);
            var smallOneRate = (smallOneRZCP/smallOneACTCP *100).toFixed(2);
            var smallTwoRate = (smallTwoRZCP/smallTwoACTCP *100).toFixed(2);

            var waterlist = ZData[0].waterList;
            var oCZZsmallOneList = "";
            var oCZZsmallTwoList = "";
            var over300Num = 0;
            var over300Name = "";
            var over200Num = 0;
            var over200Name = "";
            var over100Num = 0;
            var over100Name = "";

            //可拦蓄水量
            for(var i=0;i<rainArryNum.length;i++){
                if(rainArryNum[i]>=300){
                    over300Num +=1;
                    over300Name += rainArryName[i] + "、";
                }else if(rainArryNum[i]>=200){
                    over200Num +=1;
                    over200Name += rainArryName[i] + "、"
                }else if(rainArryNum[i]>=100){
                    over100Num +=1;
                    over100Name += rainArryName[i] + "、"
                }
            }

            var o300Name = over300Name.substring(0,over300Name.length-1);
            var o200Name = over200Name.substring(0,over200Name.length-1);
            var o100Name = over100Name.substring(0,over100Name.length-1);
            var over300List = "";
            var over200List = "";
            var over100List = "";
            var allList = "";
            if(over300Num ==0){
                over300List = "";
            }else{
                over300List = "目前我市各水库可拦蓄水量>=300毫米的水库有"+ o300Name +"等" + over300Num +"座；"
            }
            if(over200Num ==0){
                over200List = "";
            }else{
                over200List = "介于200毫米到300毫米的水库有"+ o200Name +"等" + over200Num +"座；"
            }

            if(over100Num ==0){
                over100List = "";
            }else{
                over100List = "介于100毫米到200毫米的水库有"+ o100Name +"等" + over100Num +"座；"
            }
            if(over300Num ==0 && over200Num ==0 && over100Num ==0){
                allList = "水库可拦雨量都不超过100毫米。"
            }else{
                allList = "其他水库可拦雨量不超过100毫米。"
            }

            //水库是否超汛限
            if(oCZZsmallOneNum == 0){
                oCZZsmallOneList = "";
            }else{
                oCZZsmallOneList = "超汛限水库" + oCZZsmallOneNum + "座：" + oCZZsmallOneName +"。";
            }
            if(oCZZsmallTwoNum == 0){
                oCZZsmallTwoList = "";
            }else{
                oCZZsmallTwoList = "超汛限水库" + oCZZsmallTwoNum + "座：" + oCZZsmallTwoName +"。";
            }

            var Hlevel = "";
            var Dlevel ="";

            if(waterlist[0].jjz!=null&&waterlist[0].normalZ!=null){
                Hlevel = "，在警戒水位"+ (waterlist[0].jjz).toFixed(1) +"米以下，正常水位"+ (waterlist[0].normalZ).toFixed(1) +"米" ;
            }else if(waterlist[0].jjz!=null&&waterlist[0].normalZ==null){
                Hlevel = "，在警戒水位"+ (waterlist[0].jjz).toFixed(1) +"米以下" ;
            }else if(waterlist[0].jjz==null&&waterlist[0].normalZ!=null){
                Hlevel = "，正常水位"+ (waterlist[0].normalZ).toFixed(1) +"米" ;
            }else if(waterlist[0].jjz==null&&waterlist[0].normalZ==null){
                Hlevel = "" ;
            }
            if(waterlist[1].jjz!=null&&waterlist[1].normalZ!=null){
                Dlevel = "，在警戒水位"+ (waterlist[1].jjz).toFixed(1) +"米以下，正常水位"+ (waterlist[1].normalZ).toFixed(1) +"米" ;
            }else if(waterlist[1].jjz!=null&&waterlist[1].normalZ==null){
                Dlevel = "，在警戒水位"+ (waterlist[1].jjz).toFixed(1) +"米以下" ;
            }else if(waterlist[1].jjz==null&&waterlist[1].normalZ!=null){
                Dlevel = "，正常水位"+ (waterlist[1].normalZ).toFixed(1) +"米" ;
            }else if(waterlist[1].jjz==null&&waterlist[1].normalZ==null){
                Dlevel = "" ;
            }

            rsvrInfo += '' + index + "、中型水库：" + rsvrName +"水位" + RthyinfoFormat.formatIn(waterLevel) + "米，" + storage + "离汛限水位还有" + RthyinfoFormat.formatIn(frowCZZLevel.toFixed(2)) +"米" + flood + "。<br>";
            index += 1;
            rsvrInfo += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + index + "、小(一)型水库共" + smallOneNum +"座，蓄水率" + RthyinfoFormat.formatIn(smallOneRate) + "%，可调蓄库容" + smallOneFlood.toFixed(2) + "百万立方。"+ oCZZsmallOneList +"<br>";
            index += 1;
            rsvrInfo += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + index + "、小(二)型水库共" + smallTwoNum +"座，蓄水率" + RthyinfoFormat.formatIn(smallTwoRate) + "%，可调蓄库容" + smallTwoFlood.toFixed(2) + "百万立方。"+ oCZZsmallTwoList +"<br>";
            index += 1;
            rsvrInfo += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + index + "、水库可拦截雨量情况：" + over300List + over200List + over100List + allList +"<br>";
            index += 1;
            rsvrInfo += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +  index + "、" + waterlist[0].stnm+ "水位"+ RthyinfoFormat.formatIn(waterlist[0].z) +"米"+ Hlevel +"；"+ waterlist[1].stnm +"水位"+ RthyinfoFormat.formatIn(waterlist[1].z) +"米"+ Dlevel + "。<br>";

        }

        reportContent +=
            "<tr><td colspan=2 ><p align=left style='line-height:150%;font-size:16px'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
            rsvrInfo + "</p></td></tr>";
        //********输出水库水情********************************end

        reportContent +=
            "<tr><td align=left colspan=2 style='font-size:18px' ><b>&nbsp;&nbsp;&nbsp;&nbsp;三、潮位</b></td></tr>";

        var tideInfo = new Date(endTime).Format("dd日");
        if(tideData!=null && tideData.length>0){
            var tidedata = tideData[0].reverse();
            if(tidedata !=null && tidedata !=""){
                for (var i = 0; i < tidedata.length; i++) {
                    if (tidedata[i].hltdmk == 1 || tidedata[i].hltdmk == 2) {
                        tideInfo += ',健跳潮位站实测高潮在' + new Date(tidedata[i].tm_yc).Format("hh:mm") + "，潮位" + RthyinfoFormat.formatIn(tidedata[i].yc_z) + "米。";
                        break
                    }
                }
            }else{
                tideInfo += "，健跳潮位站没有潮位信息。";
            }
        }else{
            tideInfo += "，健跳潮位站没有潮位信息。";
        }


        reportContent +=
            "<tr><td colspan=2 ><p align=left style='line-height:150%;font-size:16px'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
            tideInfo + "</p></td></tr>";

        //********************输出潮位水情*************************end

        editor1.html(reportContent);


    }).fail(function(){
        editor1.html("请求数据出错了！！");
    });
};

// 汛情单
var FloodInfo = function(){
    var startTime = $("#StartTime").textbox('getValue');
    var endTime = $("#EndTime").textbox('getValue');
    var time = $("#FixTime").textbox('getValue');
    var StartPointTime = new Date(startTime);
    var EndPointTime = new Date(endTime);

    $.when( $.ajax({
            url: baseUrl + "floodProfAnalyzSys/floodAnalyzeShow/getAbstractRainInfo.do",
            data: {
                startTime: startTime,
                endTime: endTime
            }
        }),
        $.ajax({
            url: baseUrl + "floodProfAnalyzSys/floodAnalyzeShow/getAbstractRSVRInfo.do",
            data: {
                time:time
            }
        }),
        $.ajax({
            url:baseUrl + "comm/waterInfo/getWaterList.do",
            data:{
                stcd:"70704872,SM010209"
            }
        }),
        $.ajax({
            url:baseUrl + "floodProfAnalyzSys/floodAnalyzeShow/getTideHLPLInfo.do",
            data:{
                stcd:"70705200",
                endTime:endTime,
                startTime:EndPointTime.DateAdd('day',-2).Format("yyyy-MM-dd hh:mm"),
                sortType:"TM"
            }
        })
    ).done(function(rainData,waterData,ZData,tideData){
        if(rainData!=null && rainData.length>0){
            raindata = rainData[0];
            var avgRain = "";
            var avgRainStr = "";
            for(var i=0;i<raindata.length;i++){
                if(raindata[i].STCD.indexOf(00000000) >= 0){
                    if(raindata[i].STCD=='00000000' && raindata[i].DRP){
                        avgRain = RthyinfoFormat.formatP(raindata[i].DRP);
                    }
                }else{
                    avgRain += "-";
                }
                if(raindata[i].STCD!='00000000' && raindata[i].DRP && raindata[i].INTV=='0'){
                    avgRainStr += RthyinfoFormat.formatP(raindata[i].DRP)+"("+raindata[i].STNM+")";
                }
            }
        }else{
            avgRain += "-";
            avgRainStr += "-";
        }


        var index = 0;
        index +=1;
        var overCZZNum = 0;
        var overCZZName = "";
        var overCZZdiff = "";
        var DDZNum = 0;
        var DDZName = "";
        var totalRZCP = 0;
        var totalACTCP = 0;
        var totalRAIN = 0;
        var middleRZCP = 0;
        var middleACTCP = 0;
        var middleRZ = 0;
        var middleCZZ = 0;
        var smallOneRZCP = 0;
        var smallOneACTCP = 0;
        var smallTwoRZCP = 0;
        var smallTwoACTCP = 0;
        if(waterData!=null && waterData.length>0) {
            waterdata = waterData[0];
            //console.log(waterdata);
            for(var i=0;i<waterdata.length;i++){
                if(waterdata[i].RZCP != null && waterdata[i].RZCP != ""){
                    totalRZCP += waterdata[i].RZCP;
                }
                if(waterdata[i].ACTCP != null && waterdata[i].ACTCP !=""){
                    totalACTCP += waterdata[i].ACTCP;
                }
                if(waterdata[i].RAIN != null && waterdata[i].RAIN != ""){
                    totalRAIN += waterdata[i].RAIN;
                }
                if(waterdata[i].RZ != null && waterdata[i].RZ !="" && waterdata[i].DDZ != null && waterdata[i].DDZ !=""){
                    if(waterdata[i].RZ < waterdata[i].DDZ){
                        DDZNum += 1;
                        DDZName += (waterdata[i].STNM).trim()+"、";
                    }
                }
                if(waterdata[i].RZ != null && waterdata[i].RZ !="" && waterdata[i].CZZ != null && waterdata[i].CZZ !=""){
                    if(waterdata[i].RZ > waterdata[i].CZZ){
                        overCZZNum += 1;
                        overCZZName += (waterdata[i].STNM).trim()+"、";
                        overCZZdiff += (waterdata[i].RZ - waterdata[i].CZZ).toFixed(2) + "、";
                    }
                }
                var rsvrType;
                if(waterdata[i].RSVRTP){
                    rsvrType = waterdata[i].RSVRTP;
                }

                if(rsvrType.indexOf(3) >= 0){
                    if(waterdata[i].RZ != null && waterdata[i].RZ != ""){
                        middleRZ += waterdata[i].RZ;
                    }
                    if(waterdata[i].CZZ != null && waterdata[i].CZZ != ""){
                        middleCZZ += waterdata[i].CZZ;
                    }
                    if(waterdata[i].RZCP != null && waterdata[i].RZCP != ""){
                        middleRZCP+= waterdata[i].RZCP;
                    }
                    if(waterdata[i].ACTCP != null && waterdata[i].ACTCP != ""){
                        middleACTCP+= waterdata[i].ACTCP;
                    }
                }else if(rsvrType.indexOf(1) >= 0){
                    if(waterdata[i].RZCP != null && waterdata[i].RZCP != ""){
                        smallTwoRZCP+= waterdata[i].RZCP;
                    }
                    if(waterdata[i].ACTCP != null && waterdata[i].ACTCP != ""){
                        smallTwoACTCP+= waterdata[i].ACTCP;
                    }
                }else if(rsvrType.indexOf(2) >= 0){
                    if(waterdata[i].RZCP != null && waterdata[i].RZCP != ""){
                        smallOneRZCP+= waterdata[i].RZCP;
                    }
                    if(waterdata[i].ACTCP != null && waterdata[i].ACTCP != ""){
                        smallOneACTCP+= waterdata[i].ACTCP;
                    }
                }
            }
        }

        var ddzName = DDZName.substring(0,DDZName.length-1);
        var oCZZName = overCZZName.substring(0,overCZZName.length-1);
        var totalRate = RthyinfoFormat.formatIn(totalRZCP/totalACTCP *100);
        var middleRate = RthyinfoFormat.formatIn(middleRZCP/middleACTCP *100);
        var smallOneRate = RthyinfoFormat.formatIn(smallOneRZCP/smallOneACTCP *100);
        var smallTwoRate = RthyinfoFormat.formatIn(smallTwoRZCP/smallTwoACTCP *100);
        var overCZZList = "";
        var overCZZContent = "";
        var oCZZNameArry = oCZZName.split('、');
        var oZZdiff = overCZZdiff.split('、');

        for(var i=0;i<overCZZNum;i++){
            overCZZList += oCZZNameArry[i] +"超汛限" + oZZdiff[i] +"m、";
        }
        var oCZZList = overCZZList.substring(0,overCZZList.length-1);

        //是否有超汛限水库
        if(overCZZNum == 0){
            overCZZContent = "，全市汛情总体趋势平稳,水库水位均在汛限水位以下。";
        }else{
            overCZZContent = "，" + oCZZName+ "水位超汛限("+ oCZZList +")。";
        }


        var hyZ = "";
        var hyCzz = "";
        var dgZ = "";
        var dgCzz = "";
        var waterlist = ZData[0].waterList;
        for(var i=0;i<waterlist.length;i++) {
            if(waterlist[i].stcd=='70704872'){
                hyZ=(waterlist[i].z==null?'-':waterlist[i].z);
                hyCzz=(waterlist[i].czz==null?'-':waterlist[i].czz);
            }

            if(waterlist[i].stcd=='SM010209'){
                dgZ=(waterlist[i].z==null?'-':waterlist[i].z);
                dgCzz=(waterlist[i].czz==null?'-':waterlist[i].czz);
            }
        }

        var tideInfo = "";
        if(tideData!=null && tideData.length>0){
            var tidedata = tideData[0].reverse();
            if(tidedata !=null && tidedata !=""){
                for(var i=0 ;i<tidedata.length;i++){
                    if(tidedata[i].hltdmk == 1 || tidedata[i].hltdmk == 2){
                        tideInfo = RthyinfoFormat.formatIn(tidedata[i].yc_z) +"米("+new Date(tidedata[i].tm_yc).Format('hh:mm')+')';
                        break
                    }
                }
            }else{
                tideInfo = "-";
            }
        }else{
            tideInfo = "-";
        }


        var reportContent = "";

        reportContent += "<style type='text/css'>hr{border:border:1px solid red;}</style><table border=0.5  align=center width='800px'>";
        reportContent += "<tr><td style='font-size:40px;color:#FD6E0F' align=center colspan=2><b>"+ zoneName +"汛情通报</b></td></tr>";
        reportContent += "<tr ><td style='font-size:20px;' align=center colspan=2><b>(" + StartPointTime.getFullYear() + "年第**期)</b></td>";
        reportContent += "<tr ><td align=left style='font-size:19px;color:#FF6600;font-family:楷体_GB2312' valign=bottom><b>" + departName + "</b></td>";
        reportContent += "<td align=right style='font-size:19px;font-family:楷体_GB2312' valign=bottom>" + new Date(endTime).Format("yyyy年MM月dd日") + "</td>";
        reportContent += "</tr>";

        // 输出分隔线
        reportContent += "<tr><td align=center colspan=2 height='20px' ><hr /></td></tr>";


        //********输出雨情********************************begin
        reportContent +=
            "<tr><td align=left colspan=2 style='font-size:18px' height=80><b>一、汛情单</b></td></tr>";


        reportName = StartPointTime.getMonth() + 1 + "月" + StartPointTime.getDate() + "日"+ zoneName +"汛情通报";
        var reportTm = StartPointTime.getMonth() + 1 + "月" + StartPointTime.getDate() + "日" + StartPointTime.getHours() + "时";
        reportContent += "<table border=1 align=center width=800 style='border-collapse:collapse;margin:0 auto'>";
        reportContent += "<tr><th height=30>名称</th><th colspan=2>内容</th><th>正常值(警戒值)</th><th>"+new Date(endTime).Format("MM月dd日hh时")+"</th></tr>";
        reportContent += "<tr><td rowspan=3 align=center>风情</td><td colspan=2 align=center>沿海风力</td><td align=center height=30></td><td align=center></td></tr>";
        reportContent += "<tr><td colspan=2 align=center>内陆风力</td><td align=center height=30></td><td align=center></td></tr>";
        reportContent += "<tr><td colspan=2 align=center>最大风力</td><td align=center height=30></td><td align=center></td></tr>";
        reportContent += "<tr><td rowspan=2 align=center>雨情</td><td colspan=2 align=center>全市平均雨量(mm)</td><td align=center height=30></td><td align=center>" +avgRain +"</td></tr>";
        reportContent += "<tr><td colspan=2 align=center>最大雨量站点(mm)</td><td align=center height=30></td><td align=center>"+avgRainStr+"</td></tr>";
        reportContent += "<tr><td rowspan=12 align=center>水情</td><td rowspan=3 align=center>总体情况</td><td align=center height=30>总蓄水量(百万m³)</td><td align=center>"+RthyinfoFormat.formatIn(totalACTCP)+"</td><td align=center>"+RthyinfoFormat.formatIn(totalRZCP)+"</td></tr>";
        reportContent += "<tr><td align=center height=30>总蓄水率(%)</td><td align=center></td><td align=center>"+totalRate+"</td></tr>";
        reportContent += "<tr><td align=center height=30>可拦蓄水量(百万m³)</td><td align=center></td><td align=center>"+totalRAIN+"</td></tr>";
        reportContent += "<tr><td rowspan=3 align=center>中型水库(佃石水库)</td><td align=center height=30>储蓄量(百万m³)</td><td align=center>"+RthyinfoFormat.formatIn(middleACTCP)+"</td><td align=center>"+RthyinfoFormat.formatIn(middleRZCP)+"</td></tr>";
        reportContent += "<tr><td align=center height=30>储蓄率(%)</td><td align=center></td><td align=center>"+middleRate+"</td></tr>";
        reportContent += "<tr><td align=center height=30>水位(米)</td><td align=center>"+RthyinfoFormat.formatIn(middleCZZ)+"</td><td align=center>"+ RthyinfoFormat.formatIn(middleRZ) +"</td></tr>";
        reportContent += "<tr><td rowspan=2 align=center>小(一)型水库</td><td align=center height=30>储蓄量(百万m³)</td><td align=center>"+RthyinfoFormat.formatIn(smallOneACTCP)+"</td><td align=center>"+RthyinfoFormat.formatIn(smallOneRZCP)+"</td></tr>";
        reportContent += "<tr><td align=center height=30>储蓄率(%)</td><td align=center></td><td align=center>"+smallOneRate+"</td></tr>";
        reportContent += "<tr><td rowspan=2 align=center>小(二)型水库</td><td align=center height=30>储蓄量(百万m³)</td><td align=center>"+RthyinfoFormat.formatIn(smallTwoACTCP)+"</td><td align=center>"+RthyinfoFormat.formatIn(smallTwoRZCP)+"</td></tr>";
        reportContent += "<tr><td align=center height=30>储蓄率(%)</td><td align=center></td><td align=center>"+smallTwoRate+"</td></tr>";
        reportContent += "<tr><td rowspan=2 align=center>水位</td><td align=center height=30>深海大桥站(m)</td><td align=center>"+ hyCzz +"</td><td align=center>"+ hyZ +"</td></tr>";
        reportContent += "<tr><td align=center height=30>洞港内河(m)</td><td align=center>"+ dgCzz +"</td><td align=center>"+ dgZ +"</td></tr>";
        reportContent += "<tr><td rowspan=2 align=center>潮位</td><td rowspan=2 align=center>健跳</td><td align=center height=30>健跳站实测值(m)</td><td align=center></td><td align=center>"+ tideInfo +"</td></tr>";
        //reportContent += "<tr><td align=center height=30>健跳站预计高潮位(m)</td><td align=center></td><td align=center></td></tr>";
        reportContent += "</table>";

        reportContent += "<style type='text/css'>hr{border:border:1px solid red;}</style><table border=0.5  align=center width='800px'>";
        reportContent +=
            "<tr><td align=left colspan=2 style='font-size:18px' height=50><b>二、水雨情分析</b></td></tr>";
        var rsvrInfo = "";
        rsvrInfo += ''+ index + "、市域"+ waterdata.length +"座水库蓄水率" + totalRate +"%" + overCZZContent;

        reportContent +=
            "<tr><td colspan=2 ><p align=left style='line-height:150%;font-size:16px'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
            rsvrInfo + "</p></td></tr>";

        reportContent +=
            "<tr><td align=left colspan=2 style='font-size:18px' height=50><b>三、下一步措施</b></td></tr>";

        var measuresInfo = "";
        measuresInfo += "1、各防指成员单位务必加强值班巡查，严格按照预案要求做好应急准备工作。<br>";
        measuresInfo += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2、注意防范可能引发的小流域山洪、山体滑坡、城市积涝等次生灾害，及时报告汛情信息。<br>";
        measuresInfo += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3、严格执行水利工程调度方案和水库控运计划，确保水利工程安全运行。海润街道必须做好龙皇殿水库强排水工作，尽快将该水库降到汛限水位以下。<br>";

        reportContent +=
            "<tr><td colspan=2 ><p align=left style='font-size:16px'style='line-height:150%'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
            measuresInfo + "</p></td></tr>";
        editor1.html(reportContent);


    }).fail(function(){
        editor1.html("请求数据出错了！！");
    });
};

//日雨量统计表
var dayRainfallInfo = function(){
    var startTime = $("#StartTime").textbox('getValue');
    var endTime = $("#EndTime").textbox('getValue');

    var  tableHtml = "";
    tableHtml += "<h2 align=center>日雨量统计表</h2>";

    $.ajax({
            url:baseUrl+"floodProfAnalyzSys/floodAnalyzeShow/getDayRainInfo.do",
            data:{
                startTime: startTime,
                endTime: endTime
            },
            type:"post",
            dataType:"json",
            success:function(jsondata){
                //console.log(jsondata)
                var tr ="";
                var lastTm = null;
                var thead = "<thead><th align=center>时间</th>";
                var headArray = [];
                var data = {};
                for(var i=0;i<jsondata.length;i++){
                    if(headArray.indexOf(jsondata[i].stcd)<0){
                        headArray.push(jsondata[i].stcd);
                        data[jsondata[i].stcd] = 0;
                        thead+="<th align=center>"+jsondata[i].stnm+"</th>";
                    }
                }

                //console.log(data)
                //console.log(thead)
                thead+='<th align=center>平均雨量</th></thead>';
                var j=0;
                var sumRain = 0;
                headArray = headArray.sort();

                for(var i=0;i<jsondata.length;i++){
                    var stcd = jsondata[i].stcd;
                    var stnm = jsondata[i].stnm;
                    var tm = jsondata[i].tm;
                    var drp = jsondata[i].drp;
                    if(i==0){
                        tr +="<tr><td align=center>"+new Date(tm).DateAdd('day',-1).Format('yyyy-MM-dd')+"</td>";
                    }
                    if(lastTm!=tm && i!=0){
                        tr += "<td align=center>"+(sumRain/j).toFixed(1)+"</td></tr><tr><td align=center>"+new Date(tm).DateAdd('day',-1).Format('yyyy-MM-dd')+"</td>";
                        sumRain = 0;
                        j=0;
                    }
                    if(stcd!=headArray[j]){
                        tr += "<td align=center>-</td>";
                        i--;

                        if(j>2000){
                            break;
                        }

                    }else{
                        data[jsondata[i].stcd] += drp;
                        sumRain+=drp;
                        tr += "<td align=center>"+drp+"</td>";
                    }
                    lastTm = tm;
                    j++;
                }

                var sumTr = '<tr><td align=center>总雨量</td>';
                for(var i=0;i<headArray.length;i++){
                    var sumDrp = data[headArray[i]];
                    sumTr+='<td align=center>'+sumDrp+'</td>';
                }
                sumTr +='<td></td></tr>';
                tableHtml += "<table id='dayRainfallTab' border=1 align=center  width="+ (headArray.length + 2)*100 +"  style='border-collapse:collapse;margin:0 auto'>"+thead+"<tbody>"+tr+"<td align=center>"+(sumRain/j).toFixed(1)+"</td></tr>"+sumTr+"</tbody></table>";

                editor1.html(tableHtml);

            },
            error: function () {
                editor1.html("出错了！！");
            },
            complete: function () {

            }

        });


};

//时雨量统计表
var hourRainfallInfo = function(){
    var fixTime = $("#FixTime").textbox('getValue');

    var  tableHtml = "";
    tableHtml += "<h2 align=center>时雨量统计表</h2>";

    $.ajax({
        url:baseUrl+"comm/waterInfo/getWaterList.do",
        data:{
            tm:fixTime
        },
        type:"post",
        dataType:"json",
        success:function(jsondata){
            var  tableTr = "";
            var  nameStr = "";
            tableHtml += '<table id="hourRainfallTab"><thead><tr>';

            if(jsondata.success == "true"){
                for(var i=0;i<jsondata.data.fieldInfo.length ;i++){
                    var field = jsondata.data.fieldInfo[i];
                    var nameArray = [];
                    tableHtml += "<th>时间</th>";
                    tableHtml += '<th name="'+field.name.toLowerCase().trim()+'">'+field.hzsm.trim()+'</th>';
                    tableHtml += "<th>平均雨量</th>";
                    nameStr += field.name.toLowerCase().trim()+",";
                }
                if (nameStr.length > 0) {
                    nameStr = nameStr.substr(0,nameStr.length - 1);
                }
                nameArray = nameStr.split(',');
                for(var i=0;i<jsondata.data.tableInfo.length;i++){
                    var rowData = jsondata.data.tableInfo[i];
                    tableTr += '<tr>';
                    for(var j=0;j<nameArray.length + 1;j++){
                        tableTr += '<td>'+rowData[nameArray[j]]+'</td>';
                    }
                    tableTr += '</tr>';
                }
                tableTr += "<tr><td>总雨量</td>";

                //最后一行总雨量
                for ( var i = 0; i < nameArray.length ; i++) {
                    var sum = 0;
                    $ ('#hourRainfallTab tr:gt(0) td:nth-child(' + (i + 2) + ')').each (function (){
                        sum += parseFloat ($ (this).text ()).toFixed(1);
                    });
                    tableTr += "<td>" + sum + "</td>";
                }

                tableTr +="</tr>";

                //最后一列平均雨量
                $('#hourRainfallTab tr').each(function(i,dom) {
                    var rowTotal = 0;
                    $(this).find('td').each(function() {
                        rowTotal += parseFloat($(this).text()).toFixed(1);
                    });
                    //将一行的结果，写入合计列，直接追加到列尾
                    $(this).append('<td>'+rowTotal/i+'</td>');
                });

                tableHtml+="</tr></thead><tbody>"+tableTr+"</tbody></table>";

                //table加滚动条
                $(".tabWrap table").fixHeaderTable({    //切头   赋宽度
                    //colsWidth:["12.5%","12.5%","12.5%","12.5%","12.5%","12.5","12.5%","12.5%"],
                    height:editor1.height() - 1
                });

                $(".fixHeaderTable_mainTableWrap").mCustomScrollbar({
                    scrollButtons:{enable:true},
                    theme:"inset-2-dark",
                    axis:"y",
                    autoHideScrollbar:true,
                    setLeft:0,
                    mouseWheel:true,
                    callbacks:{}
                });
            }
            editor1.html(tableHtml);
        },
        error: function () {
            editor1.html("出错了！！");
        },
        complete: function () {

        }
    });
};

//var getWaterWarnList = function(waterList){
//    var waterWarnInfo = {
//      riverList:[],
//      rsvrList:[],
//      tideList:[]
//    };
//
//    for(var i=0;i<waterList.length;i++){
//        switch(waterList[i].sttp){
//            case "RR":
//                waterWarnInfo.rsvrList.push(waterList[i]);
//                break;
//            case "TT":
//                waterWarnInfo.tideList.push(waterList[i]);
//                break;
//            default:
//                waterWarnInfo.riverList.push(waterList[i]);
//        }
//    }
//
//    return waterWarnInfo;
//}















