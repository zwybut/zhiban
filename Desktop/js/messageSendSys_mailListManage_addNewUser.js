/**
 * Created by Dell on 2017/8/22.
 */
var regionSelect;
var regionSelect2;
var regionSelect3;
var baseInfoArr = {};
var baseDetailArr = {};
var attentionSTCDStr = "";
var warnSTCDStr = "";
$(function(){

    // 下拉选择框
    getRegionSelect();
    getZoneSelect();
    getBasinSelect();

    //streetSelect = $("#streetSelect").customSelect({width:301,lineHeight:28});
    //unitSelect = $("#unitSelect").customSelect({width:234,lineHeight:28});

    //取消
    $('#cancelBtn').click(function(){
        parent.$('.modelbg').hide();
        parent.$('#addNewUserPopup').hide();
    });

    //下一步
    $('#nextBtn').click(function(){
        var LinkName = $('#trueName').val();
        if(LinkName == ""){
            $.toast({
                text: '姓名不能为空!',
                icon: 'info',
                position: "mid-center",
                stack: false,
                allowToastClose: false,
                loader: false,
                bgColor: "#3bb9d4",
                textColor: "#fff"
            });
            return;
        }
        var Zone = regionSelect.getValue();
        if(Zone == "地区选择"){
            Zone = "";
        }
        if(Zone == ""){
            $.toast({
                text: '请选择地区!',
                icon: 'info',
                position: "mid-center",
                stack: false,
                allowToastClose: false,
                loader: false,
                bgColor: "#3bb9d4",
                textColor: "#fff"
            });
            return;
        }
        var Mobile = $('#telPhone').val();
        var reg = /^1[34578]\d{9}$/;
        if(!reg.test(Mobile)){
            $.toast({
                text: '请输入正确的13位手机号码!',
                icon: 'info',
                position: "mid-center",
                stack: false,
                allowToastClose: false,
                loader: false,
                bgColor: "#3bb9d4",
                textColor: "#fff"
            });
            return;
        }
        $.ajax({
            url: baseUrl + "/NoteUser/selectNoteUserByTelphone.do",
            type: "Post",
            data: {
                Mobile: Mobile
            },
            success: function (result) {
                console.log(result);
                if(result.state == 0 && result.data == null){
                    $('#addNewUser').hide();
                    $('#SMSconcern').show();
                }else if(result.state == 0 && result.data != null){
                    $.toast({
                        text: '手机号码已存在!',
                        icon: 'info',
                        position: "mid-center",
                        stack: false,
                        allowToastClose: false,
                        loader: false,
                        bgColor: "#3bb9d4",
                        textColor: "#fff"
                    });
                }
            }
        });
    });


    //添加新人员
    $('#confirmBtn').click(function(){
        var LinkName = $('#trueName').val();
        var Gender = $('input:radio:checked').val();
        var addvcd = regionSelect.getValue();
        var addvnm = regionSelect.getText();
        var Mobile = $('#telPhone').val();
        var Position = $('#position').val();
        var Unit = $('#unitSelect').val();
        var Statement = $('#departmentSelect').val();
        var Tel = $('#tel').val();
        var Address = $('#address').val();
        var Memo = $('#memo').val();
        $.when($.ajax({
            url: baseUrl + "/NoteUser/addNoteUser.do",
            data: {
                LinkName:LinkName,
                Gender:Gender,
                ADDVCD:addvcd,
                ADDVNM:addvnm,
                Mobile:Mobile,
                JobTitle:Position,
                Organization:Unit,
                Department:Statement,
                Tel:Tel,
                Address:Address,
                Memo:Memo
            },
            dataType: 'Json',
            type: 'post'
        })).done(function(result){
            if(result.state == 0){
                var AID = result.data.userID;
                var STCD_Interests = attentionSTCDStr;
                var STCD_Warns = warnSTCDStr;
                $.ajax({
                    url: baseUrl + "/StcdUserRelation/addStcdUserRelation.do",
                    data: {
                        UserID:AID,
                        STCD_Interests:STCD_Interests,
                        STCD_Warns:STCD_Warns
                    },
                    type: "Post",
                    success: function (result) {
                        console.log(result);
                        if(result.state == 0){
                            parent.$('.modelbg').hide();
                            parent.$('#addNewUserPopup').hide();
                            parent.showToastAddNewUser();
                            parent.addUserToP();
                            //$.ajax({
                            //    url: baseUrl + "/NoteUser/selectAllUserInfo.do",
                            //    type: "Post",
                            //    success: function (result) {
                            //        var userInfo = result.data;
                            //        var userObj;
                            //        for(var i = 0; i < userInfo.length; i++){
                            //            if(AID == userInfo[i].UserID){
                            //                userObj = userInfo[i];
                            //            }
                            //        }
                            //        parent.$('.modelbg').hide();
                            //        parent.$('#addNewUserPopup').hide();
                            //        parent.showToastAddNewUser();
                            //        parent.addUserToP(addvnm,Unit,LinkName,Mobile,Statement,Position,AID,userObj);
                            //    }
                            //});
                        }
                    }
                });
            }else{
                $.toast({
                    text: '添加人员失败！',
                    icon: 'info',
                    position: "mid-center",
                    stack: false,
                    allowToastClose: false,
                    loader: false,
                    bgColor: "#3bb9d4",
                    textColor: "#fff"
                });
            }
        });

    });

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
    zoneSelect.change(function(){
        var state = zoneSelect.getValue();
        if(state == 0){
            regionSelect2.show();
            regionSelect3.hide();
        }else if(state == 1){
            regionSelect3.show();
            regionSelect2.hide();
        }
    });

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
        attentionStation()
    });

    $('.noticeSite').on('click','.attentionSta',function(){
        //attentionStation()
        if($(this).is(':checked')){
            var stcd = $(this).attr('id');
            if(attentionSTCDStr.indexOf(stcd) < 0){
                attentionSTCDStr += stcd+";";
                var station = baseDetailArr[stcd];
                var content = '<li stcd="att'+station.stcd+'"> ' +
                                '<input type="checkbox" class="regular-checkbox" id="att'+station.stcd+'"><label for="att'+station.stcd+'"></label> ' +
                                '<span>'+station.stnm+'('+station.sttp+')'+'</span> ' +
                                '</li>';
                $('#attentionStation').append(content);
            }
        }else{
            var stcd = $(this).attr('id');
            var removeStation = $('#attentionStation').find('li[stcd=att'+stcd+']');
            removeStation.remove();
            attentionSTCDStr = attentionSTCDStr.replace(stcd+";","");
        }
    });
    $('.warnSite').on('click','.warnSta',function(){
        if($(this).is(':checked')){
            var stcd = $(this).attr('id');
            stcd = stcd.substring(4);
            if(warnSTCDStr.indexOf(stcd) < 0){
                warnSTCDStr += stcd+";";
                var station = baseDetailArr[stcd];
                var content = '<li stcd="tip'+station.stcd+'"> ' +
                                '<input type="checkbox" class="regular-checkbox" id="tip'+station.stcd+'"><label for="tip'+station.stcd+'"></label> ' +
                                '<span>'+station.stnm+'('+station.sttp+')'+'</span> ' +
                                '</li>';
                $('#warnStation').append(content);
            }
        }else{
            var stcd = $(this).attr('id');
            stcd = stcd.substring(4);
            var removeStation = $('#warnStation').find('li[stcd=tip'+stcd+']');
            removeStation.remove();
            console.log(warnSTCDStr);
            warnSTCDStr = warnSTCDStr.replace(stcd+";","");
            console.log(warnSTCDStr);
        }
    });
    function attentionStation(){
        var ul = $('#attentionStation');
        var content = "";
        $('.attentionSta').each(function(){
            if($(this).is(':checked')){
                var stcd = $(this).attr('id');
                if(attentionSTCDStr.indexOf(stcd) < 0){
                    attentionSTCDStr += stcd+";";
                    var station = baseDetailArr[stcd];
                    content += '<li stcd="att'+station.stcd+'"> ' +
                        '<input type="checkbox" class="regular-checkbox" id="att'+station.stcd+'"><label for="att'+station.stcd+'"></label> ' +
                        '<span>'+station.stnm+'('+station.sttp+')'+'</span> ' +
                        '</li>'
                }
            }
        });
        ul.append(content);
    }
    function warnStation(){
        var ul = $('#warnStation').empty();
        var content = "";
        $('.warnSta').each(function(){
            if($(this).is(':checked')){
                var wstcd = $(this).attr('id');
                var stcd = wstcd.substring(4);
                if(warnSTCDStr.indexOf(stcd) < 0){
                    warnSTCDStr += stcd+";";
                    var station = baseDetailArr[stcd];
                    content += '<li stcd="tip'+station.stcd+'"> ' +
                        '<input type="checkbox" class="regular-checkbox" id="tip'+station.stcd+'"><label for="tip'+station.stcd+'"></label> ' +
                        '<span>'+station.stnm+'('+station.sttp+')'+'</span> ' +
                        '</li>'
                }
            }
        });
        ul.append(content);
    }


    //预警站点全选
    $('#checkbox-2-all').click(function(){
        if(this.checked){
            $('.warnSite li input').prop('checked',true);
        }else{
            $('.warnSite li input').prop('checked',false);
        }
        warnStation()
    });

    //点击模糊搜索进行过滤
    $('#searchBtn').click(function(){
        var stnm = $('#searchIpt').val().trim();
        var noticeSiteUl = $('.noticeSite').empty();
        var warnSiteUl = $('.warnSite').empty();
        var content = "";
        var content1 = "";
        for(var m in baseInfoArr){
            if(m.indexOf(stnm) >= 0){
                content += '<li>'+
                    '<input type="checkbox" class="regular-checkbox attentionSta" id="'+baseInfoArr[m].stcd+'"><label for="'+baseInfoArr[m].stcd+'"></label>'+
                    '<span>'+baseInfoArr[m].stnm+'('+baseInfoArr[m].sttp+')'+'</span>'+
                    '</li>';
                content1 += '<li>'+
                    '<input type="checkbox" class="regular-checkbox warnSta" id="warn'+baseInfoArr[m].stcd+'"><label for="warn'+baseInfoArr[m].stcd+'"></label>'+
                    '<span>'+baseInfoArr[m].stnm+'('+baseInfoArr[m].sttp+')'+'</span>'+
                    '</li>';
            }
        }
        noticeSiteUl.append(content);
        warnSiteUl.append(content1);
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
        $('#addNewUser').show();
        $('#SMSconcern').hide();

    });

    //取消
    $('#cancelBtn2').click(function(){
        parent.$('.modelbg').hide();
        parent.$('#addNewUserPopup').hide();
    });


    initInfo();

});

var initInfo = function(){
    $.ajax({
        url: GTUrl + "comm/baseInfo/getStationBaseInfoByCondition.do",
        type: "Post",
        success: function (result) {
            console.log(result);
            var baseInfo = result.stationBaseInfo;
            var noticeSiteUl = $('.noticeSite').empty();
            var warnSiteUl = $('.warnSite').empty();
            var allStationContent = "";
            var allStationContent1 = "";
            for(var i = 0; i < baseInfo.length; i++){
                baseInfoArr[baseInfo[i].stnm] = baseInfo[i];
                baseDetailArr[baseInfo[i].stcd] = baseInfo[i];
                allStationContent += '<li>'+
                                        '<input type="checkbox" class="regular-checkbox attentionSta" id="'+baseInfo[i].stcd+'"><label for="'+baseInfo[i].stcd+'"></label>'+
                                        '<span>'+baseInfo[i].stnm+'('+baseInfo[i].sttp+')'+'</span>'+
                                     '</li>';
                allStationContent1 += '<li>'+
                    '<input type="checkbox" class="regular-checkbox warnSta" id="warn'+baseInfo[i].stcd+'"><label for="warn'+baseInfo[i].stcd+'"></label>'+
                    '<span>'+baseInfo[i].stnm+'('+baseInfo[i].sttp+')'+'</span>'+
                    '</li>';
            }
            noticeSiteUl.append(allStationContent);
            warnSiteUl.append(allStationContent1);
        }
    });
};

var getRegionSelect = function(){
    $.ajax({
        url: GTUrl + "comm/addvcd/getAddvcdChildersByFind.do",
        type: "Post",
        data: {
            addvcd: addvcd,
            rank:'d'
        },
        success: function (result) {
            console.log(result);
            var regionArr = result;
            var regionCus = $('#regionSelect').empty();
            var content = '<option value="地区选择" selected="selected">地区选择</option>'+
                            '<option value="330683">嵊州市</option>';
            for(var i = 0; i < regionArr.length; i++){
                content += '<option value="'+regionArr[i].addvcd+'">'+regionArr[i].addvnm+'</option>';
            }
            content += '<option value="">其他地区</option>';
            regionCus.append(content);
            // 地区选择框
            regionSelect = $("#regionSelect").customSelect({width:234,lineHeight:28});
        }
    });
};

var getZoneSelect = function(){
    $.ajax({
        url: GTUrl + "comm/addvcd/getAddvcdChildersByFind.do",
        type: "Post",
        data: {
            addvcd: addvcd,
            rank:'d'
        },
        success: function (result) {
            console.log(result);
            var regionArr = result;
            var regionCus = $('#regionSelect2').empty();
            var content = '<option value="330683">所有地区</option>';
            for(var i = 0; i < regionArr.length; i++){
                content += '<option value="'+regionArr[i].addvcd+'">'+regionArr[i].addvnm+'</option>';
            }
            regionCus.append(content);
            // 地区选择框
            regionSelect2 = $("#regionSelect2").customSelect({width:98,lineHeight:26});
            regionSelect2.change(function(){
                if(regionSelect2.getText() != "所有地区"){
                    $.ajax({
                        url: GTUrl + 'comm/baseInfo/getStationBaseInfoByCondition.do',
                        type: "post",
                        dataType: "json",
                        data:{
                            addvcd:regionSelect2.getValue()
                        } ,
                        success: function (jsondata) {
                            var baseInfo = jsondata.stationBaseInfo;
                            var noticeSiteUl = $('.noticeSite').empty();
                            var warnSiteUl = $('.warnSite').empty();
                            var content = "";
                            var content1 = "";
                            for(var i = 0; i < baseInfo.length; i++){
                                content += '<li>'+
                                    '<input type="checkbox" class="regular-checkbox attentionSta" id="'+baseInfo[i].stcd+'"><label for="'+baseInfo[i].stcd+'"></label>'+
                                    '<span>'+baseInfo[i].stnm+'('+baseInfo[i].sttp+')'+'</span>'+
                                    '</li>';
                                content1 += '<li>'+
                                    '<input type="checkbox" class="regular-checkbox warnSta" id="warn'+baseInfo[i].stcd+'"><label for="warn'+baseInfo[i].stcd+'"></label>'+
                                    '<span>'+baseInfo[i].stnm+'('+baseInfo[i].sttp+')'+'</span>'+
                                    '</li>';
                            }
                            noticeSiteUl.append(content);
                            warnSiteUl.append(content1);
                        }
                    });
                }else{
                    $.ajax({
                        url: GTUrl + "comm/baseInfo/getStationBaseInfoByCondition.do",
                        type: "Post",
                        success: function (result) {
                            console.log(result);
                            var baseInfo = result.stationBaseInfo;
                            var noticeSiteUl = $('.noticeSite').empty();
                            var warnSiteUl = $('.warnSite').empty();
                            var allStationContent = "";
                            var allStationContent1 = "";
                            for(var i = 0; i < baseInfo.length; i++){
                                baseInfoArr[baseInfo[i].stnm] = baseInfo[i];
                                allStationContent += '<li>'+
                                    '<input type="checkbox" class="regular-checkbox attentionSta" id="'+baseInfo[i].stcd+'"><label for="'+baseInfo[i].stcd+'"></label>'+
                                    '<span>'+baseInfo[i].stnm+'('+baseInfo[i].sttp+')'+'</span>'+
                                    '</li>';
                                allStationContent1 += '<li>'+
                                    '<input type="checkbox" class="regular-checkbox warnSta" id="warn'+baseInfo[i].stcd+'"><label for="warn'+baseInfo[i].stcd+'"></label>'+
                                    '<span>'+baseInfo[i].stnm+'('+baseInfo[i].sttp+')'+'</span>'+
                                    '</li>';
                            }
                            noticeSiteUl.append(allStationContent);
                            warnSiteUl.append(allStationContent1);
                        }
                    });
                }
            });
        }
    });
};

var getBasinSelect = function(){
    $.ajax({
        url: GTUrl + "floodProfAnalyzSys/backStageManageShow/basinManage/getBasinNodeInfo.do",
        type: "Post",
        success: function (result) {
            console.log(result);
            var regionArr = result;
            var regionCus = $('#regionSelect3').empty();
            var content = '<option value="330683">所有流域</option>';
            for(var i = 0; i < regionArr.length; i++){
                var id = regionArr[i].id;
                var firstStr = id.slice(2,4);
                var secondStr = id.slice(4,6);
                if(firstStr === '00'){

                }else if(firstStr != '00' && secondStr == '00'){

                }else{
                    if(regionArr[i].name != "曹娥江"){
                        content += '<option value="'+regionArr[i].id+'">'+regionArr[i].name+'</option>';
                    }
                }
            }
            regionCus.append(content);
            // 地区选择框
            regionSelect3 = $("#regionSelect3").customSelect({width:98,lineHeight:26,show:false});
            regionSelect3.change(function(){
                if(regionSelect3.getText() != "所有流域"){
                    $.ajax({
                        url: GTUrl + '/floodProfAnalyzSys/backStageManageShow/basinManage/getStationfoById.do',
                        type: "post",
                        dataType: "json",
                        data:{
                            basinId:regionSelect3.getValue()
                        } ,
                        success: function (jsondata) {
                            var baseInfo = jsondata;
                            console.log(baseInfo);
                            var noticeSiteUl = $('.noticeSite').empty();
                            var warnSiteUl = $('.warnSite').empty();
                            var content = "";
                            var content1 = "";
                            for(var i = 0; i < baseInfo.length; i++){
                                content += '<li>'+
                                    '<input type="checkbox" class="regular-checkbox attentionSta" id="'+baseInfo[i].stcd+'"><label for="'+baseInfo[i].stcd+'"></label>'+
                                    '<span>'+baseInfo[i].stnm+'('+baseInfo[i].item+')'+'</span>'+
                                    '</li>';
                                content1 += '<li>'+
                                    '<input type="checkbox" class="regular-checkbox warnSta" id="warn'+baseInfo[i].stcd+'"><label for="warn'+baseInfo[i].stcd+'"></label>'+
                                    '<span>'+baseInfo[i].stnm+'('+baseInfo[i].item+')'+'</span>'+
                                    '</li>';
                            }
                            noticeSiteUl.append(content);
                            warnSiteUl.append(content1);
                        }
                    });
                }else{
                    $.ajax({
                        url: GTUrl + "comm/baseInfo/getStationBaseInfoByCondition.do",
                        type: "Post",
                        success: function (result) {
                            console.log(result);
                            var baseInfo = result.stationBaseInfo;
                            var noticeSiteUl = $('.noticeSite').empty();
                            var warnSiteUl = $('.warnSite').empty();
                            var allStationContent = "";
                            var allStationContent1 = "";
                            for(var i = 0; i < baseInfo.length; i++){
                                baseInfoArr[baseInfo[i].stnm] = baseInfo[i];
                                allStationContent += '<li>'+
                                    '<input type="checkbox" class="regular-checkbox attentionSta" id="'+baseInfo[i].stcd+'"><label for="'+baseInfo[i].stcd+'"></label>'+
                                    '<span>'+baseInfo[i].stnm+'('+baseInfo[i].sttp+')'+'</span>'+
                                    '</li>';
                                allStationContent1 += '<li>'+
                                    '<input type="checkbox" class="regular-checkbox warnSta" id="warn'+baseInfo[i].stcd+'"><label for="warn'+baseInfo[i].stcd+'"></label>'+
                                    '<span>'+baseInfo[i].stnm+'('+baseInfo[i].sttp+')'+'</span>'+
                                    '</li>';
                            }
                            noticeSiteUl.append(allStationContent);
                            warnSiteUl.append(allStationContent1);
                        }
                    });
                }
            });
        }
    });
};

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

