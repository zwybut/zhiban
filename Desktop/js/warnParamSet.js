/**
 * Created by Dell on 2017/8/15.
 */
var warnParamHash = null;
$(function(){
    //tab切换
    $('.stnmRule ul li').click(function(){
        var sttp = $(this).attr("sttp");
        var phcd = "";
        $(this).addClass('active').siblings().removeClass('active');
        getStationInfo(sttp,phcd);
        $("#searchIpt").val("");
    });
    $("#searchBtn").click(function(){
		var sttp = $('.stnmRule ul li.active').attr("sttp");
		var phcd = $("#searchIpt").val();
        getStationInfo(sttp,phcd);
	})
    
    $("#searchIpt").focus(function(ev){
    	document.onkeydown = function(ev){
    		var ev = ev || window.event;
    		if(ev && ev.keyCode==13){
    			var sttp = $('.stnmRule ul li.active').attr("sttp");
				var phcd = $("#searchIpt").val();
		        getStationInfo(sttp,phcd);
    		}
    	}
    }); 
    
    //批量改弹框
	$("#multiRewBtn").click(function(){
		var flag = false;
		$(".regular-checkbox").each(function(){
			if($(this).prop("checked")){
				flag = true;
			}
		});
		if(!flag){
	    		$.toast({
		            text: "请选择需要修改的站点！",
		            icon: 'info',
		            position: "mid-center",
		            stack: false,
		            allowToastClose: false,
		            loader: false,
		            bgColor: "#840101",
		            textColor: "#000000"
	        	});
	   }
        if(flag){
	        $.confirmWin({
	            width:400,
	            height:255,
	            title:"<div>批量修改</div>",
	            text:"<div class='rowWrap'>报警类型</div>"+
	                 "<div class='rowWrap'><select id='warnType'>" +
	                 "<option value='YJP1'>1H雨量</option>" +
	                 "<option value='YJP3'>3H雨量</option>" +
	                 "<option value='YJP6'>6H雨量</option>" +
	                 "<option value='YJZ' >报警水位</option>" +
	                 "<option value='WJZ' >危急水位</option>" +
	                 "</select></div>" +
	                 "<div class='rowWrap'>参数设置</div>"+
	                 "<div class='rowWrap'><input class='changeValue' type='text' placeholder='请输入修改数值' name='reWriteText'></div>",
	            btnVal:"确定",
	            submitFn:function(){
	            	var data = {};
	            	var stcds = "";
	            	var slcd  = $(".select_option .selected").attr("value");
	            	var changeValue = $(".changeValue").val();
	            	console.log(slcd,changeValue); 
	            	var reg = /^\d+(.\d+)?$/g;
	            	if(reg.test(changeValue)){
	            		if(changeValue != ""){
		            		switch(slcd){
			            		case "YJP1" : data.YJP1 = changeValue;
			            		break;
			            		case "YJP3" : data.YJP3 = changeValue;
			            		break;
			            		case "YJP6" : data.YJP6 = changeValue;
			            		break;
			            		case "YJZ" : data.YJZ = changeValue;
			            		break;
			            		case "WJZ" : data.WJZ = changeValue;
			            		break;         		
			            	}
	            		
			            	$(".regular-checkbox").each(function(){
			            		if($(this).prop("checked")){
			            			stcds += $(this).parents().siblings(".stcd").text()+",";
			            			$(this).parents().siblings("."+slcd.toLowerCase()).html(changeValue);		
			            		}           		           		        			           		
			            	})
	            		}
	            	}
	            	
	            	
	            	data.stcds = stcds; 	
					batchAmendUpdate(data)
	            }
        	});
			var warnType = $("#warnType").customSelect({width:355,lineHeight:28});
		}
    });
    	
    $.when(tabContentCreate()).done(function(){
    	$('.stnmRule ul li').eq(0).addClass('active').trigger('click');
    	//切头   赋宽度
		$(".tabContent table").fixHeaderTable({
		    colsWidth:["11%","11%","11%","11%","11%","11%","11%","11%","11%"],
		    height:$(".tabContent").height() - 1,
		    colsDataType:["string","string","string","number","number","number","number","number","string"],
		    colsCanSort:[false,true,true,true,true,true,true,true,false],
		    colsContentType:["","text","text","text","text","text","text","text",""]
		});
		$(".fixHeaderTable_mainTableWrap").mCustomScrollbar({
			update:true,
		    scrollButtons:{enable:true},
		    theme:"inset-2-dark",
		    axis:"y",
		    autoHideScrollbar:true,
		    setLeft:0,
		    mouseWheel:true
		});
    });
});

//查询所有站点的规则
var tabContentCreate = function(STTP){
	var dfd = $.Deferred();
    $.ajax({
        url:baseUrl+'/WarnParam/selectAllWarnParamBySTTP.do',
        type: "post",
        dataType:"json",
        data:{
        	STTP:STTP
        },
        success:function(jsonData) {
        	//console.log(jsonData)
//          parent.jsonCode(jsonData);
//          var code = jsonData.code;
//          var note = jsonData.note;
//          if (code == 1) {
//              var jsondata = JSON.parse(note);
//              warnParamHash = parent.stationToMap(jsondata);
              dfd.resolve(jsonData);
//          }
        }
    });
    return dfd.promise();
};
var getStationInfo = function(STTP,Condition){
    var data = {STTP : STTP , Condition:Condition };
    var stationList = null;
    $.ajax({
        url:baseUrl+"/WarnParam/selectAllWarnParamBySTTPAndCondition.do",
        data:data,
        async: false,
        dataType:"json",
        success:function(jsondata){
        	//console.log(jsondata)
            var note =jsondata.data;
            var html = "";
                for (var i = 0; i < note.length; i++) {
                    var station = note[i];
                    var stcd = station.STCD;
                    var stnm = station.STNM;
                    var yjp1 = "-";
                    var yjp3 = "-";
                    var yjp6 = "-";
                    var yjz = "-";
                    var wjz = "-";
                    var wtm = "-";
                    if(null!=station){
                    	yjp1 = station.YJP1==""?"-":station.YJP1;
                    	yjp3 = station.YJP3==""?"-":station.YJP3;
                    	yjp6 = station.YJP6==""?"-":station.YJP6;
                    	yjz = station.YJZ==""?"-":station.YJZ;
                    	wjz = station.WJZ==""?"-":station.WJZ;
                    	wtm = station.WTM==""?"-":station.WTM;
                    }
                    
                    html += "<tr>" +
                    	"<td><input type='checkbox' class='regular-checkbox' id='checkbox-1-"+i+"'><label for='checkbox-1-"+i+"'></label></td>"+
                        "<td class='stcd'>" + stcd + "</td>" +
                        "<td class='stnm'>" + stnm + "</td>" +
                        "<td class='yjp1'>"+ yjp1 +"</td>" +
                        "<td class='yjp3'>"+ yjp3 +"</td>" +
                        "<td class='yjp6'>" + yjp6 + "</td>" +
                        "<td class='yjz'>" + yjz + "</td>" +
                        "<td class='wjz'>" + wjz + "</td>" +
                        "<td><div class='opeaBtn'></div></td>" +
                        "</tr>";
                }
                $(".tabContent tbody").html(html);
                
				$(".regular-checkbox").click(function(){				
					$(this).prop("checked")
				})
                //设置弹框
			    $(".opeaBtn").click(function(){
			    	var This = $(this);
			        var stcd = $(this).parents().siblings('.stcd').text();
			        var stnm = $(this).parents().siblings('.stnm').text();
			        var yjp1 = "";
			        var yjp3 = "";
			        var yjp6 = "";
			        var yjz = "";
			        var wjz = "";
			        if($(this).parents().siblings('.yjp1').text()!="-"){
			        	$(".inp_yjp1").attr({"placeholder":""})
			        	yjp1 = $(this).parents().siblings('.yjp1').text()
			        }
			        if($(this).parents().siblings('.yjp3').text()!="-"){
			        	$(".inp_yjp3").attr({"placeholder":""})
			        	yjp3 = $(this).parents().siblings('.yjp3').text()
			        }
			        if($(this).parents().siblings('.yjp6').text()!="-"){
			        	$(".inp_yjp6").attr({"placeholder":""})
			        	yjp6 = $(this).parents().siblings('.yjp6').text()
			        }
			        if($(this).parents().siblings('.yjz').text()!="-"){
			        	$(".inp_yjz").attr({"placeholder":""})
			        	yjz = $(this).parents().siblings('.yjz').text()
			        }
			        if($(this).parents().siblings('.wjz').text()!="-"){
			        	$(".inp_wjz").attr({"placeholder":""})
			        	wjz = $(this).parents().siblings('.wjz').text()
			        }
			        
			        $.confirmWin({
			            width:482,
			            height:276,
			            title:"<div>参数设置</div>",
			            text:"<div class='rowDiv'><span class='stnm'>测站名称</span><input type='text' placeholder='"+stnm+"' readonly><span class='stcd'>测站站码</span><input type='text' placeholder='"+stcd+"' readonly></div>"+
			            	 "<div class='rowDiv'><span class='ppWarn'>雨量报警</span><span class='zzWarn'>水位报警</span></div>"+
			                 "<div class='rowDiv'><span class='typeTitle'>1H雨量</span><i class='moreThen'>></i><input class='inp_yjp1' type='text' placeholder='请输入数值' value='"+yjp1+"' style='margin-bottom:0'><span class='typeTitle'>报警水位</span><i class='moreThen'>></i><input class='inp_yjz' type='text' placeholder='请输入数值' value='"+yjz+"'></div>"+
			                 "<div class='rowDiv'><span class='typeTitle'>3H雨量</span><i class='moreThen'>></i><input class='inp_yjp3' type='text' placeholder='请输入数值' value='"+yjp3+"'><span class='typeTitle typeTitle4'>危急水位</span><i class='moreThen moreThen4'>></i><input class='inp_wjz' type='text' placeholder='请输入数值' value='"+wjz+"'></div>"+
			                 "<div class='rowDiv'><span class='typeTitle typeTitle5'>6H雨量</span><i class='moreThen moreThen5'>></i><input class='inp_yjp6' type='text' placeholder='请输入数值' value='"+yjp6+"'><span class='space'></span></div>",
			            btnVal:"确定",
			            submitFn:function(){
							var data = {};
							var reg = /^\d+(.\d+)?$/g;
							var reg1 = /^\d+(.\d+)?$/g;
							var reg2 = /^\d+(.\d+)?$/g;
							var reg3 = /^\d+(.\d+)?$/g;
							var reg4 = /^\d+(.\d+)?$/g;
							if(reg.test($(".inp_yjp1").val())){
								data.YJP1 = $(".inp_yjp1").val();
							}	
							if(reg1.test($(".inp_yjp3").val())){
								data.YJP3 = $(".inp_yjp3").val();
							}	
							if(reg2.test($(".inp_yjp6").val())){
								data.YJP6 = $(".inp_yjp6").val();
							}	
							if(reg3.test($(".inp_yjz").val())){
								data.YJZ = $(".inp_yjz").val();
							}	
							if(reg4.test($(".inp_wjz").val())){
								data.WJZ = $(".inp_wjz").val();
							}	
							data.STCD = stcd;
							//console.log(data);
							setUpdate(data);
							if(data.YJP1 != ""){
								This.parents("tr").find('.yjp1').html(data.YJP1);
							}
							if(data.YJP3 != ""){
								This.parents("tr").find('.yjp3').html(data.YJP3);
							}
							if(data.YJP6 != ""){
								This.parents("tr").find('.yjp6').html(data.YJP6);
							}
							if(data.YJZ != ""){
								This.parents("tr").find('.yjz').html(data.YJZ);
							}
							if(data.WJZ != ""){
								This.parents("tr").find('.wjz').html(data.WJZ);
							}
												
			            }
			        });
			        $(".rowDiv input").focus(function(){
			        	$(this).css({"border-color":"#d2d6e1"});			       
			        })
			        $(".rowDiv input").hover(function(){
			        	$(this).css({"border-color":"#d2d6e1"});			       
			        })
			        $(".rowDiv input").focus(function(){
			        	$(this).css({"color":"black"})	
			        })
			        $(".rowDiv input").blur(function(){
				    	var reg = /^\d+(.\d+)?$/g;
				    	if(!reg.test($(this).val())){
				    		$(this).css({"color":"red"})				    	
				    	}else{
				    		$(this).css({"color":"color"})		
				    	}
			    	});
              })
          }
    });
};
function setUpdate(data){
	$.ajax({
		type:"post",
		url:baseUrl+"/WarnParam/updateWarnParam.do",
		async:true,
		data:data,
		success:function(res){
			//console.log(res);
		}
	});
}
function batchAmendUpdate(data){
	$.ajax({
		type:"post",
		url:baseUrl+"/WarnParam/batchUpdateWarnParam.do",
		async:true,
		data:data,
		success:function(res){
			//console.log(res);
		}
	});
}