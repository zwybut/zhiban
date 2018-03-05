var baseUrl = "http://www.zjszsw.com:8011/SMSServer";
$(document).ready(function(){
	
    $('#calendar').fullCalendar({
        eventClick: function(event) {
            window.open(event.url, 'gcalevent', 'width=700,height=600');
            return false;
        }
    });
    var IND = $(".fc-today").parent().index();
    var Height  =  -IND*($(".fc-week0").height()+1)+52;
    $("#scrollBox").css({"top":Height});
    $(".fc-button-today").click(function(){
        $("#scrollBox").css({"top":Height});
    });   
    setTimeout(function(){
        getAllPeopleAtOpen();		
        var job;
        $(".fc-day-content").mousedown(function(){
            var getYear = $("h2").html().substring(0,4);
            var getMonth= $(this).parent().parent().find(".fc-day-number").html().split("-")[0];
            if(getMonth<10){
                getMonth = "0"+getMonth
            }
            var getDay = $(this).parent().parent().find(".fc-day-number").html().split("-")[1];
            if(getDay<10){
                getDay = "0"+getDay
            }
            if($(this).hasClass("fc-day-content1")){
                if($(this).index() == "0"){
                    job = "am-leader"
                }else if($(this).index() == "1"){
                    job = "am-worker"
                }
            }
            if($(this).hasClass("fc-day-content2")){
                if($(this).index() == "0"){
                    job = "pm-leader"
                }else if($(this).index() == "1"){
                    job = "pm-worker"
                }
            }
            //点击表格事件

            $(".tree-checkbox").unbind("click").click(function(){
                var str = "";
                var amLeader = "";
                var amWorker = "";
                var pmLeader = "";
                var pmWorker = "";
                //点击树
                var calssStr = $(this)[0].className;
                var This = $(this);
                if($(this).siblings().hasClass("tree-expanded")){
                	return;
                }
                if(calssStr.endsWith("tree-checkbox1")){
                    //删除
                    var classes="";
                    var perName="";
                    var perType="";
                    $(".touched").find("p").each(function(){
                        if(This.next().html()==$(this).html()){
                            $(this).remove();
                        }
                    });
                    str = str.replace("<p class='name'>"+$(this).next().html()+"</p>","");
                    perName = $(this).next().html();
                    switch(job){
                        case "am-leader":
                            amLeader = amLeader.replace($(this).next().html(),"");
                            perType = "leader";
                            classes = "1";
                            break;
                        case "am-worker":
                            amWorker = amWorker.replace($(this).next().html(),"");
                            perType = "people";
                            classes = "1";
                            break;
                        case "pm-leader":
                            pmLeader = pmLeader.replace($(this).next().html(),"");
                            perType = "leader";
                            classes = "2";
                            break;
                        case "pm-worker":
                            pmWorker = pmWorker.replace($(this).next().html(),"");
                            perType = "people";
                            classes = "2";
                            break;
                    }
                    $.ajax({
                        type:"post",
                        url:baseUrl + "/Onduty/deleteOndutyByUserNameAndTime.do",
                        data:{
                            time: getYear+"-"+getMonth+"-"+getDay,
                            classes:classes,
                            name:perName,
                            type:perType
                        },
                        async:true,
                        success:function(res){
                        }
                    });
                }else{
                    //添加
                    switch(job){
                        case "am-leader":
                            amLeader = $(this).next().html();
                            str ="<p class='name'>"+$(this).next().html()+"</p>";
                   			$(".touched").html(str);
                            break;
                        case "am-worker":
                            amWorker += $(this).next().html();
                            str +="<p class='name'>"+$(this).next().html()+"</p>";
                    		$(".touched").append(str);
                            break;
                        case "pm-leader":
                            pmLeader = $(this).next().html();
                            str ="<p class='name'>"+$(this).next().html()+"</p>";
                   			$(".touched").html(str);
                            break;
                        case "pm-worker":
                            pmWorker += $(this).next().html();
                            str +="<p class='name'>"+$(this).next().html()+"</p>";
                    		$(".touched").append(str);
                            break;
                    }
                    console.log(amLeader)
                     console.log(amWorker)
                      console.log(pmLeader)                     
                       console.log(pmWorker)
                    console.log(getYear+"-"+getMonth+"-"+getDay);
                    $.ajax({
                        type:"post",
                        url:baseUrl + "/Onduty/addOnduty.do",
                        data:{
                            time: getYear+"-"+getMonth+"-"+getDay,
                            amLeader:amLeader,
                            amPeople:amWorker,
                            pmLeader:pmLeader,
                            pmPeople:pmWorker
                        },
                        async:true,
                        success:function(res){
                            if(res.data>0){
                                console.log("添加成功")
                            }else{
                                console.log("添加失败")
                            }
                        }
                    });
                }


            });
            $(".tree-checkbox").attr("class","tree-checkbox tree-checkbox0")  //清点击样式
            $(this).find("p").each(function(){
                var That = $(this);
                $(".tree-title").each(function(){
                    if($(this).html()==That.html()){
                        $(this).prev().attr("class","tree-checkbox tree-checkbox1")  //添加点击样式
                    }
                })
            })

        });


        var hovernames = [];
        var LinkNames = "";
        hoverbox(".am");
        hoverbox(".pm");
        var phoneNumber = "";
        var onOff=true
        var oBox=document.getElementById("scrollBox");
        
        if(oBox.addEventListener){
			oBox.addEventListener('DOMMouseScroll',function(ev){		
				var oDiv=oBox.getElementsByTagName("tr");
                ev = ev || event;	                
                var detail = ev.detail;
                	detail = detail>0?1:0;
	                var index = oBox.getAttribute("index");
					console.log(index)
	
	                var maxLength=oDiv.length-1;
	                if(detail){
	                    if(++index > maxLength){
	                        return;
	                    }
	                }else{
	                    if(--index < 0){
	                        return;
	                    }
	                }
	                if(onOff){	                	
	                    onOff = false;
	                    var Dheight = -index*($(".fc-week0").height()+1)+52;
	
	                    timeMove(oBox,{"top":Dheight},500,"linear",function(){
	                        onOff = true;
	                        

	                    });
	
	                    oBox.setAttribute("index",index);
	
	                }
                
            },false)
		}
        var IND = $(".fc-today").parent().index();
        oBox.setAttribute("index",IND);
        
        function hoverbox(x){$(x).mouseover(function(){
            var This = $(this);
            var oDiv=oBox.getElementsByTagName("tr");
            var onOff=true;
            oBox.onmousewheel=function(ev){

                ev = ev || event;
                var dir = ev.wheelDelta;
                dir = dir>0?0:1;
                            	console.log(dir)
                var index = this.getAttribute("index");


                var maxLength=oDiv.length-1;
                if(dir){
                    if(++index > maxLength){
                        return;
                    }
                }else{
                    if(--index < 0){
                        return;
                    }
                }
                if(onOff){
                    onOff = false;
                    var Dheight = -index*($(".fc-week0").height()+1)+52;

                    timeMove(oBox,{"top":Dheight},500,"linear",function(){
                        onOff = true;
                    });

                    this.setAttribute("index",index);

                }
            };
            $(".hover-box").attr({"display":"none"});

            $(this).parent().next().find(".hover-timer").html($("h2").html().substring(0,4)+"年"+$(this).parent().find(".fc-day-number").html().substring(0,1)+"月"+$(this).parent().find(".fc-day-number").html().substring(2)+"日");
			
			if( $(this).find("p").html() != undefined){
				if(x == ".am"){
	                $(this).parent().next().find(".hover-timer").append("（早班）");
	                $(this).parent().next().css({"top":"31%"}).stop(false, true).fadeIn(300).find(".hover-header").css({"background":"#3bb9d4"});
            	}else{
	                $(this).parent().next().find(".hover-timer").append("（晚班）");
	                $(this).parent().next().css({"top":"75%"}).stop(false, true).fadeIn(300).find(".hover-header").css({"background":"#ff8327"});
            	}
			}
            
            $(this).parent().next().find(".leader-name .leadername").html($(this).children("div:first").find("p").html());
            LinkNames = $(this).parent().next().find(".leadername").html();

            $(this).children("div:last").find("p").each(function(){
                hovernames.push($(this).html());

            });

            if(hovernames.length > 1){
                $(".workername").html("");
                $(this).parent().next().find(".workername").each(function(index){
                    $(this).html(hovernames[index]);
                    LinkNames += "/"+$(this).html();
                })
            }else{
                $(".workername").html("");
                $(this).parent().next().find(".workername").eq(0).html(hovernames[0]);
                LinkNames += "/"+$(this).parent().next().find(".workername").eq(0).html();
            }

            hovernames = [];

            if(LinkNames == "/"){
                LinkNames = "";
            }
            //if(This.find($("p"))[0] == ""){}
            $.ajax({
                type:"post",
                url:baseUrl + "/Onduty/selectUserInfoByUserName.do",
                data:{
                    LinkNames : LinkNames
                },
                async:true,
                success:function(res){
                    var Data = res.data;
                    This.parent().next().find(".leader-phone").find("i").remove();
                    This.parent().next().find(".worker-phone").find("i").remove();
                    for(var i=0;i<Data.length;i++){
                        if(Data[i] !=null){
                            if(Data[i].LinkName == This.parent().next().find(".leadername").html()){
                                phoneNumber = "<i>"+Data[i].Mobile+"</i>";
                                This.parent().next().find(".leader-phone .phone-number").html(phoneNumber);
                                phoneNumber = ""
                            }
                            This.parent().next().find(".workername").each(function(){
                                if(Data[i].LinkName == $(this).html()){
                                    phoneNumber = "<i>"+Data[i].Mobile+"</i>";
                                    if($(this).parent().next().find(".worker-phone")){                              
                                    	$(this).parent().next().find(".phone-number").html(phoneNumber);
                                    	  phoneNumber = ""
                                    }
                                }
                            })
                        }

                    }
                }
            });

        }).mouseleave(function(){
            $(".hover-box").attr("display","none");
            $(this).parent().next().stop(false, true).fadeOut();;
        });}
        $(".tree-icon").remove();

        $(".am").mouseover(function(){
            $(this).css({"border":"1px dotted #00aeff"})
        }).mouseout(function(){
            $(this).css({"border":"0","border-bottom":"1px dotted #e6e6e6"})
        });
        $(".pm").mouseover(function(){
            $(this).prev().css({"border-bottom":"0"});
            $(this).css({"height":"100px","border":"1px dotted #ff8327"})
        }).mouseout(function(){
            $(this).prev().css({"border-bottom":"1px dotted #e6e6e6"});
            $(this).css({"height":"101px","border":"0"})
        });
        var onoff = true;

        var res = [];
        var peopledata = [];
        var timesData = [];
        
        $(".getchart").mousedown(function(){	        	     				    	
            var thisMonth=$("h2").html().substring(7,9);
            var thisYear =$("h2").html().substring(0,4);
            var Month = "";
            var x=0;
            var workTime = [];
            $(".am").each(function(){
                Month = $(this).prev().html().split("-")[0];
                if(Month<10){
                    Month = "0"+Month;
                }
                if(Month == thisMonth){    
                	$(this).find("p").each(function(){
						if($(this).html() != ""){
							peopledata.push($(this).html())
							peopledata = $.unique(peopledata.sort())					
						}				
					})
					$(this).next().find("p").each(function(){
						if($(this).html() != ""){
							peopledata.push($(this).html())
							peopledata = $.unique(peopledata.sort())					
						}
					})   
                    for(var i=0;i<peopledata.length;i++){
                        $(this).parent().find("p").each(function(){
                            if($(this).html()==peopledata[i]){
                                workTime.push($(this).html());
                                workTime.sort();
                            }
                        })
                    }
                }	
            });
            for(var i = 0;i<workTime.length;)
            {

                var count = 0;
                for(var j=i;j<workTime.length;j++)
                {

                    if(workTime[i] == workTime[j])
                    {
                        count++;
                    }

                }
                res.push([workTime[i],count]);
                i+=count;

            }

            for(var i=0;i<res.length;i++){
                var ind = res[i][0];
                var index = peopledata.indexOf(ind);
                timesData[index] = res[i][1];
            }
            res = [];
            var myChart = echarts.init(document.getElementById('mychart'));
            // 指定图表的配置项和数据
            var option = {
                color: ['#3398DB'],
                legend: {
                    data: ['值班天数'],
                    align: 'right',
                    right: -10
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        data : peopledata,
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name:'值班天数',
                        type:'bar',
                        barWidth: '30%',
                        label: {
                            normal: {
                                show: true,
                                position: 'top'
                            }
                        },
                        data:timesData
                    }

                ]
            };
            // 使用刚指定的配置项和数据显示图
            myChart.setOption(option);
            workTime = [];
            peopledata = [];
            $(".chartYear").click(function(){   
            	$("#mychart").remove();
                $.ajax({
                    type : "post",
                    url : baseUrl + "/Onduty/selectAllOnduty.do",
                    success : function(res){
                        var Data = res.data;
                        peopledata = [];
                        workTime = [];
                        timesData = [];                      
                        for(var i=0;i<Data.length;i++){
                            if(Data[i].time.substring(0,4) == $("h2").html().substring(0,4)){                   			
                    			if(Data[i].leader !=""){
                    				peopledata.push(Data[i].leader);
                    				workTime.push(Data[i].leader);
                    				peopledata = $.unique(peopledata.sort());
                    			}
                    			if(Data[i].people !=""){      
                    				var arr = Data[i].people.split(",");
                    				for(var j=0;j<arr.length;j++){
                    					peopledata.push(arr[j])
                    					peopledata = $.unique(peopledata.sort());
                    					workTime.push(arr[j]);
                    				}                   				
                    				
                    			}
                    			
                            }
                            
                        }
                        peopledata = $.unique(peopledata.sort());
                        console.log(peopledata)
                        workTime.sort();
                        var res = [];
                        for(var i = 0;i<workTime.length;){			
			                var count = 0;
			                for(var j=i;j<workTime.length;j++){			
			                    if(workTime[i] == workTime[j]){
			                        count++;
			                    }			
			                }
			                res.push([workTime[i],count]);
			                i+=count;
			
			            }			
			            for(var i=0;i<res.length;i++){
			                var ind = res[i][0];
			                var index = peopledata.indexOf(ind);
			                timesData[index] = res[i][1];
			            }
			            res = [];
                        var option1 = {
			                color: ['#3398DB'],
			                legend: {
			                    data: ['值班天数'],
			                    align: 'right',
			                    right: -10
			                },
			                tooltip : {
			                    trigger: 'axis',
			                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
			                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
			                    }
			                },
			                grid: {
			                    left: '3%',
			                    right: '4%',
			                    bottom: '3%',
			                    containLabel: true
			                },
			                xAxis : [
			                    {
			                        type : 'category',
			                        data : peopledata,
			                        axisTick: {
			                            alignWithLabel: true
			                        }
			                    }
			                ],
			                yAxis : [
			                    {
			                        type : 'value'
			                    }
			                ],
			                series : [
			                    {
			                        name:'值班天数',
			                        type:'bar',
			                        barWidth: '30%',
			                        label: {
			                            normal: {
			                                show: true,
			                                position: 'top'
			                            }
			                        },
			                        data:timesData
			                    }
			
			                ]
			            };
			            $(".chartbox").append("<div id='mychart'><div>")
			            var myChart1 = echarts.init(document.getElementById('mychart'));
			            myChart1.setOption(option1);
                    }
                });	       
                
            });
            if(onoff){
                $(this).css({"background-image":"url(../images/work_form.png)"});
                $(".chartbox").fadeIn({"display":"black"},1000);
                onoff = false;
            }else{
                $(this).css({"background-image":"url(../images/unduty_data.png)"});
                onoff = true;
                $(".chartbox").fadeOut({"display":"none"},1000)
            }
            $(".btn-effect").click(function(){
                $(".getchart").css({"background-image":"url(../images/unduty_data.png)"});
                $(".chartbox").fadeOut({"display":"none"},1000);
                onoff = true;
                $(".fc-day-content1").removeClass("touched");
                $(".fc-day-content2").removeClass("touched");
                
            })






        })
        $(".btn-effect").click(function(){
        	$(".am").find("p").remove();
        	$(".pm").find("p").remove();
        	getAllPeopleAtOpen();
        	$(".fc-day-content1").removeClass("touched");
            $(".fc-day-content2").removeClass("touched");           
        })
        //导出Excal.
        $(".Print").click(function(){
        	var option={};
			var dateTime = $("h2").html();
			var thisMonth=$("h2").html().substring(7,9);
			var fileName = dateTime+"人员值班表";
			var sheetData = []//[{time:'一行一列',workType:'一行二列',name:'一行二列'},{time:'一行一列',workType:'一行二列',name:'一行二列'}];//1.time;2.workType;3.name;
			var Month = '';
			$(".am").each(function(){
				var obj = {};
				var obj1 = {};
				var leaderName = '';
				var workerName = '';
				var leaderName1 = '';
				var workerName1 = '';
                var workType = '早班';
                var workType1 = '晚班';
                Month = $(this).prev().html().split("-")[0];
                if(Month<10){
                    Month = "0"+Month;
                }
                if(Month == thisMonth){   
                	leaderName = $(this).find('.content1-leader p').html();
                	
                	$(this).find('.content1-worker p').each(function(){
                		workerName += $(this).html()+" ";
                	});
                	leaderName1 = $(this).next().find('.content2-leader p').html();
                	$(this).next().find('.content2-worker p').each(function(){
                		workerName1 += $(this).html()+" ";
                	});
                	var time = $(this).prev().html().split("-")[0]+"月"+$(this).prev().html().split("-")[1]+"日"; 
                	obj.time = time;
	                obj.workType = workType;
	                obj.leaderName = leaderName;
	                obj.workerName = workerName;
	                
	                obj1.time = time;
	                obj1.workType = workType1;
	                obj1.leaderName = leaderName1;
	                obj1.workerName = workerName1;
	                
	                sheetData.push(obj);
	                sheetData.push(obj1);
                }	
                
          });
			option.fileName = fileName;
			option.datas=[
			  {
			    sheetData : sheetData,
			    sheetName : 'sheet',
			    sheetFilter : ['time','workType','leaderName','workerName'],
			    sheetHeader : ['日期','早晚班','带班领导','值班人员']			    
			  }
			];
			var toExcel=new ExportJsonExcel(option);
			toExcel.saveExcel();
        })
        $(".options").mousedown(function(){
        	$(".optionsPage").fadeIn();       	
        })
        var onOff = true;
        $(".willSend").mousedown(function(){	        
	        if(onOff){
	        	onOff = false;  
	        	$(this).addClass("wontSend");       		        	
	        }else{
	        	onOff = true;
	        	$(this).removeClass("wontSend");
	        }
        })
        $(".reduce").mousedown(function(){
        	var time = $(".timeInput").val();
        	if(time != ""){
        		if( time > 0 ){
	        		time = parseInt(time) - 1;
	        	}else{
	        		time = 0;
	        	}
	        	
        	}else{
				time = 0;
        	}
        	$(".timeInput").val(time)
        })
        $(".add").mousedown(function(){       	
        	var time = $(".timeInput").val();
        	if(time != ""){
        		if( time < 24 ){
	        		time = parseInt(time) + 1;
	        	}else{
	        		time = 24;
	        	}
	        	
        	}else{
				time = 0;
        	}
        	$(".timeInput").val(time)
        	
        })
        $(".cancelBtn").mousedown(function(){
        	$(".optionsPage").fadeOut();  
        })
        $(".sureBtn").mousedown(function(){
        	$(".optionsPage").fadeOut();  
        	var data = {};
        	var isSend = "";
        	var sendTime = "";
        	if($(".willSend").hasClass("wontSend")){
        		isSend = 2;
        	}else{
        		isSend = 1;
        	}
        	data.isSend = isSend;
        	data.sendTime = $(".timeInput").val();
        	data.messageContent = $(".massagePromptIpt").val();
        	console.log(data);
        	sendOption(data);
        })
        $(".closeBtn").mousedown(function(){
        	$(".optionsPage").fadeOut(); 
        })
        
    },100);
    $("<div class='people_choise'><span class='people_pic'></span><span>人员安排</span></div>").prependTo("#treebox");
    $(".fc-button-prev .fc-button-content").empty().html("<");
    $(".fc-button-next .fc-button-content").empty().html(">");
    $(".fc-header-center").append("<span class='options'>设置</span><span class='ondutyBtn'>查看</span><span class='getchart'></span><span class='Print'></span>");
    $(".fc-content").prepend("<div class='introduce'><div class='int-sb'></div></div>");
    $(".int-sb").append("<div class='introduce_header'></div><div class='introduce_content' index='0'><div class='int_content'></div><div class='int_content'></div><div class='int_content'></div></div>");
    $(".int_content").append("<div class='work_time'><div class='morning'><p>早</p><p>班</p></div><div class='afternoon'><p>晚</p><p>班</p></div></div><div class='status'><div class='empty_date'></div><div class='jobs'></div></div>");
    $(".jobs").append("<div class='leader'>带班领导</div><div class='workers'>值班人员</div><div class='leader'>带班领导</div><div class='workers'>值班人员</div>");
    $("#calendar").append("<div class='chartbox'><div id='mychart'></div><div>");
    $(".hover-box").append("<div class='hover-header' style='height:40px;color:#fff;'><span class='hover-timer'></span></div><div class='hover-content' style='height:223px;zoom:1;'></div>");
    $(".hover-content").append("<div id='sds'></div><p class='leader-name'></p><p class='phone leader-phone'></p><p class='worker-name'></p><p class='phone worker-phone'></p><p class='worker-name'></p><p class='phone worker-phone'></p>");
    $(".leader-name").append("<span>带班领导</span><br/><span class='leadername'></span>");
    $(".worker-name").append("<span>值班人员</span><br/><span class='workername'></span>");
    $(".phone").append("<span>联系电话</span><br/><span class='phone-number'><span>");
    $(".chartbox").prepend("<span class='chartYear' style='position:absolute;'>本年度<span>")
	$(".wrap").append("<div class='optionsPage'><div class='optionsCover'></div><div class='optionsBox'><div class='optionsHeader'><p class='headerTitle'>排班信息发送设置<span class='closeBtn'>X</span></p></div><div class='sendSMS'><span class='willSend'></span><span class='sendText'>是否发送短信</span></div><div class='sendTimeOption'><i class='reduce'>-</i><input name='time' class='timeInput' type='text' value='8'/><label for='time'>时</label><i class='add'>+</i><span class='sendTimeText'>短信定时发送时间</span></div><div class='massagePrompt'><p>短信发送内容</p><textarea class='massagePromptIpt' > 温馨提示：您将于明天值班，请按时到岗。</textarea></div><div class='sureOrCancel'><span class='cancelBtn'>取消</span><span class='sureBtn'>确定</span></div></div>")
    var sel_node = "";
    var userId = "";
    var addId = "";
    var groupName = "";
    var rightSelectId ="";
    var sel_nodeChange = true;
    var topGroupArr = {};
    var userArr = {};
    var userMap = [];
    var userInfo = [];
    var branchArr = {};
    var topArr = {};

    $('#tt').tree({
    	onlyLeafCheck:true,
        lines:true,
        animate:true,
        checkbox:true,
        url:baseUrl + "/UserGroup/selectUserGroups.do",
        loadFilter: function(result){
            if(result.state == 0){
                var userGroup = result.data;
                if(userGroup == null){
                    return [];
                }else{
                    $('#tt').empty();
                    var topData = [];
                    for(var i in userGroup){
                        var topObj = {};
                        var topGroupName = i.split("/")[0];
                        var topGroupId = i.split("/")[1];
                        topGroupArr[topGroupId] = topGroupName;
                        var branchGroup = userGroup[i];
                        topObj.id = topGroupId;
                        topObj.text = topGroupName;
                        var branchData = [];
                        var topMobileList = [];
                        for(var j in branchGroup){
                            var branchObj = {};
                            var branchGroupName = j.split("/")[0];
                            var branchGroupId = j.split("/")[1];
                            branchObj.id = branchGroupId;
                            branchObj.text = branchGroupName;
                            var userList = branchGroup[j];
                            var userData = [];
                            var userMobile = [];
                            for(var n = 0; n < userList.length; n++){
                                var userObj = {};
                                var user = userList[n];
                                var userName = user.linkName;
                                var userId = user.aid;
                                userArr[userId] = user.mobile;
                                userMap.push(user.mobile);
                                userMobile.push(user.mobile);
                                topMobileList.push(user.mobile);
                                userObj.id = userId;
                                userObj.text = userName;
                                userObj.flag = true;
                                userData.push(userObj);
                            }
                            branchArr[branchGroupId] = userMobile;
                            branchData.push({
                                id:branchGroupId,
                                text:branchGroupName,
                                children:userData,
                                flag:false
                            });
                        }
                        topArr[topGroupId] = topMobileList;
                        topData.push({
                            id:topGroupId,
                            text:topGroupName,
                            children:branchData,
                            flag:false
                        });
                    }
                }
                var parentObj = [];
                parentObj.push({
                    id:"3306",
                    text:"所有分组",
                    children:topData
                });
                return parentObj;
            }
        },
        onCheck:function(node){
        	var childs = node.children;
        	var flag = node.flag;
        }
    });

    $('.ondutyBtn').click(function(){
        window.location = "personnelSchedule1.html";
        getAllPeopleAtOpen();
        
    });
});

function getAllPeopleAtOpen(){
    $.ajax({
        type : "post",
        url : baseUrl + "/Onduty/selectAllOnduty.do",
        success : function(res){
            var Data = res.data;
            var arr = [];
            for(var i=0;i<Data.length;i++){
                if(Data[i].time.substring(0,4) == $("h2").html().substring(0,4)){
                    $(".fc-widget-content").each(function(){
                        var Month = $(this).find(".fc-day-number").html().split("-")[0];
                        if(Month<10){
                            Month = "0"+Month
                        }
                        if(Data[i].time.substring(5,7 )== Month){
                            var Day = $(this).find(".fc-day-number").html().split("-")[1];
                            if(Day<10){
                                Day = "0"+Day
                            }
                            if(Data[i].time.substring(8) == Day){
                                if(Data[i].classes=="1"){
                                    var leader = "";
                                    var people = "";
                                    var peopleDiv;
                                    arr = Data[i].people.split(",");
                                    for(var j=0;j<arr.length;j++){
                                        if(arr[j]!=""){
                                            people += "<p>"+arr[j]+"</p>";
                                            $(this).find(".fc-day-content1").eq(1).append(peopleDiv).html(people);
                                        }
                                    }

                                    leader += "<p>"+Data[i].leader+"</p>";

                                    $(this).find(".fc-day-content1").eq(0).html(leader);

                                }
                                if(Data[i].classes=="2"){
                                    var leader = "";
                                    var people = "";
                                    arr = Data[i].people.split(",");
                                    for(var j=0;j<arr.length;j++){
                                        if(arr[j]!=""){
                                            people += "<p>"+arr[j]+"</p>";
                                            $(this).find(".fc-day-content2").eq(1).html(people);
                                        }

                                    }

                                    leader += "<p>"+Data[i].leader+"</p>";

                                    $(this).find(".fc-day-content2").eq(0).html(leader);

                                }
                            }
                        }
                    })
                }
            }
        }

    })
}
function sendOption(data){
	$.ajax({
		type : "post",
		url : baseUrl + "/Onduty/updateSendTime.do",
		async : true,
		data : data ,
		success : function(res){
			console.log(res)
		}
	});
}



