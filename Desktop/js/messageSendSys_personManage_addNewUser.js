/**
 * Created by Dell on 2017/6/23.
 */
var regionSelect
$(function(){

    // 下拉选择框
    getRegionSelect();
    // 地区选择框


    $('#cancelBtn').click(function(){
        parent.$('.modelbg').hide();
        parent.$('#newUserPopup').hide();
    });

    //$("#regionSelect ").get(0).selectedIndex = 1;

    $('#addUserBtn').click(function(){

        var LinkName = $('.inputText').val();
        if(LinkName == ""){
            $.toast({
                text: '姓名不能为空!',
                icon: 'info',
                position: "mid-center",
                stack: false,
                allowToastClose: false,
                loader: false,
                bgColor: "#e97c75",
                textColor: "#fff"
            });
            return;
        }
        var Gender = $('input:radio:checked').val();
        var Zone = regionSelect.getText();
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
                bgColor: "#e97c75",
                textColor: "#fff"
            });
            return;
        }
        var ADDVCD = regionSelect.getValue();
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
                bgColor: "#e97c75",
                textColor: "#fff"
            });
            return;
        }
        var Position = $('#position').val();
        var Job = $('#jobSelect').val();
        var Unit = $('#unit').val();
        var Statement = $('#departmentSelect').val();
        var Tel = $('#tel').val();
        var Address = $('#address').val();
        var Memo = $('#memo').val();
        $.when($.ajax({
            url: baseUrl + "/NoteUser/addNoteUser.do",
            data: {
                LinkName:LinkName,
                Gender:Gender,
                ADDVNM:Zone,
                ADDVCD:ADDVCD,
                Mobile:Mobile,
                JobTitle:Position,
                Job:Job,
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
                var AID = result.data.UserID;
                var userObj = result.data;
                console.log(AID);
                parent.$('.modelbg').hide();
                parent.$('#newUserPopup').hide();
                parent.showToast1();
                parent.addUser(Zone,Unit,LinkName,Mobile,Statement,Position,AID,userObj);
            }else{
                $.toast({
                    text: '添加人员失败！',
                    icon: 'info',
                    position: "mid-center",
                    stack: false,
                    allowToastClose: false,
                    loader: false,
                    bgColor: "#e97c75",
                    textColor: "#fff"
                });
            }
        });

    });

});

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
            var content = '<option value="地区选择" selected="selected">地区选择</option>';
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