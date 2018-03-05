/**
 * Created by Dell on 2017/6/23.
 */
var regionSelect;
$(function(){
    // 下拉选择框
    getRegionSelect();
    //streetSelect = $("#streetSelect").customSelect({width:296,lineHeight:28});
    //jobSelect    = $("#jobSelect").customSelect({width:234,lineHeight:28});
    //departmentSelect = $("#departmentSelect").customSelect({width:234,lineHeight:28});
    initEditInfo();

    $('#cancelBtn').click(function(){
        parent.$('.modelbg').hide();
        parent.$('#singleRewritePopup').hide();
    });

    $('#updateUserBtn').click(function(){
        var UserID = GetQueryString("aid");
        var LinkName = $('#userId').val();
        var Gender = $('input:radio:checked').val();
        var ADDVCD = regionSelect.getValue();
        var Zone = regionSelect.getText();
        console.log(ADDVCD);
        console.log(Zone);
        var Mobile = $("#mobileNum").val();
        var Position = $("#positionName").val();
        var Job = $("#jobSelect").val();
        var Unit = $("#unit").val();
        var Statement = $("#departmentSelect").val();
        var Tel = $("#tel").val();
        var Address = $("#address").val();
        var Memo = $("#memo").val();
        $.ajax({
            url:baseUrl+"/NoteUser/updateUser.do",
            data:{UserID:UserID,
                LinkName:LinkName,
                Gender:Gender,
                ADDVCD:ADDVCD,
                ADDVNM:Zone,
                Mobile:Mobile,
                JobTitle:Position,
                Job:Job,
                Organization:Unit,
                Department:Statement,
                Tel:Tel,
                Address:Address,
                Memo:Memo
            },
            dataType:"Json",
            type:"post",
            success:function(result){
                var AID = result.data.userID;
                var Zone = result.data.addvnm;
                var LinkName = result.data.linkName;
                var Gender = result.data.gender;
                var Mobile = result.data.mobile;
                var Position = result.data.jobTitle;
                var Job = result.data.job;
                var Unit = result.data.organization;
                var Statement = result.data.department;
                var Tel = result.data.tel;
                var Address = result.data.address;
                var Memo = result.data.memo;
                parent.updateToast();
                parent.updateUser(AID,Zone,LinkName,Mobile,Position,Gender,Job,Unit,Statement,Tel,Address,Memo);
            }
        });
        parent.$('.modelbg').hide();
        parent.$('#singleRewritePopup').hide();
    });

});

var getRegionSelect = function(){
    $.ajax({
        url: GTUrl + "comm/addvcd/getAddvcdChildersByFind.do",
        type: "Post",
        async: false,
        data: {
            addvcd: addvcd,
            rank:'d'
        },
        success: function (result) {
            console.log(2)
            console.log(result);
            var regionArr = result;
            var regionCus = $('#regionSelect').empty();

            var content = '<option value="所有地区" selected="selected">所有地区</option>';
            for(var i = 0; i < regionArr.length; i++){
                content += '<option value="'+regionArr[i].addvcd+'">'+regionArr[i].addvnm+'</option>';
            }
            content += '<option value="">其他地区</option>';
            regionCus.append(content);
            // 地区选择框
            regionSelect = $("#regionSelect").customSelect({width:230,lineHeight:28});
        }
    });
};

// 获取url地址的参数
function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null) return r[2];
    return null;
}

var initEditInfo = function(){
    var UserID = GetQueryString("aid");
    if(UserID == null || UserID == ""){
        return;
    }else{
        $.ajax({
            url: baseUrl + "/NoteUser/selectNoteUserById.do",
            type: "Post",
            data: {
                UserID: UserID
            },
            success: function (result) {
                var userObj = result.data;
                console.log(userObj.addvcd);
                $('#userId').val(userObj.linkName);
                $("input[name='0'][value='"+userObj.gender+"']").attr("checked", true);
                regionSelect.setValue(userObj.addvcd);
                $('#mobileNum').val(userObj.mobile);
                $('#positionName').val(userObj.jobTitle);
                $('#jobSelect').val(userObj.job);
                $('#unit').val(userObj.organization);
                $('#departmentSelect').val(userObj.department);
                $('#tel').val(userObj.tel);
                $('#address').val(userObj.address);
                $('#memo').val(userObj.memo);
            }
        });
    }
};