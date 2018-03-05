/**
 * js数据格式化各种数据， 如日期，数字等。
 * 也有对应相应的业务格式化输出如水位、超警戒、流量等
 */
/**
 * 
 */
/**
 * 
 */

// 对时间进行加减一个间隔
// TimeUnit:间隔单位：HOUR：小时，DAY：天
//　DiffValue：间隔值
Date.prototype.DateAdd = function (TimeUnit, DiffValue) {
	var todayInMS = this.getTime();
	var TimeUnit = TimeUnit.toUpperCase();
	var ResultTodayInMS;
	switch (TimeUnit) {
		case "MINUTE":
			ResultTodayInMS = todayInMS + (60 * (DiffValue) * 1000);
			break;
		case "HOUR":
			ResultTodayInMS = todayInMS + (60 * 60 * (DiffValue) * 1000);
			break;
		case "DAY":
			ResultTodayInMS = todayInMS + (60 * 60 * 24 * (DiffValue) * 1000);
			break;
	}
	return new Date(ResultTodayInMS);
};


// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function (fmt) {
	var o = {
		"M+": this.getMonth() + 1,                 //月份
		"d+": this.getDate(),                    //日
		"h+": this.getHours(),                   //小时
		"m+": this.getMinutes(),                 //分
		"s+": this.getSeconds(),                 //秒
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度
		"S": this.getMilliseconds()             //毫秒
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
};


var RthyinfoFormat = {
	/**
	 * 格式化由json-lib输出的日期格式 json-lib输出的日期格式如同：
	 * {"date":8,"day":3,"hours":0,"minutes":0,"month":7,"nanos":0,"seconds":0,"time":1186502400000,"timezoneOffset":-480,"year":107}
	 * 
	 * @param json-lib输出的日期对象。
	 * @param format
	 *            格式化模式，参考ExtJS的Date说明
	 * @return 格式化的日期字符串，如果dateObj为null则返回空。
	 */

	formatJSONDate:function(dateObj, format) {
		if (dateObj == null || dateObj == "") {
			return "";
		}

		var date = new Date(1900 + dateObj.year, dateObj.month, dateObj.date,
				dateObj.hours, dateObj.minutes, dateObj.seconds, dateObj.nanos);
		return date.format(format);
	},// end formatJSONDate

	dateDiff:function(datepart,startdate,enddate){
		var startDate = new Date(startdate);
		var endDate = new Date(enddate);

		var diffValue = (endDate.getTime()-startDate.getTime())/1000;
		var result = -1;
		switch(datepart.toUpperCase()){
			case "HOUR":
				result = parseInt(diffValue/3600);
				break;
			case "DAY":
				result = parseInt(diffValue / (24 * 3600 ));
				break;
			case "MINUTES":
				result = parseInt(diffValue/60);
				break;
			case "SECONDS":
				result = parseInt(diffValue);
				break;
		}

		return result;

	},
	
	/**
	 * 格式化雨量的输出。
	 * 
	 * @param v
	 *            雨量值。
	 */
	formatP : function(v) {
		if(v===0) return 0;
		if(v=="") return "";
		if (isNaN(v)||v == null) {
			return "";
		}
		return this.round(v, 1);
	},
	formatP_HaveZero : function(v) {
		if(v=="") return "";
		if(v===0) return 0;
		if (isNaN(v)||v == null) {
			return "";
		}
		return this.round(v, 1);
	},
	/**
	 * 土壤含水率.
	 * @param v
	 */
	formatSoil : function(v) {
		if (v == null || v == "" || isNaN(v) ) {
			return "";
		}
		return this.round(v, 1)+"%";
	}, //end formatSoil
	
	/**
	 * 格式化雨量的输出。
	 * 
	 * @param v雨量值。
	 * @param p 小于该雨量值的不显示
	 */
	//formatP : function(v , p) {
	//	if(undefined == p ){
	//		p = 0.1;
	//	}
	//	if (v == null || v == "" || isNaN(v) || v < p) {
	//		return "";
	//	}
	//	return this.round(v, 1);
	//}, //end formatP

	formatP_m : function(v) {
		if(v==0) return 0;
		if(v=="") return "-";
		if (isNaN(v)||v == null) {
			return "-";
		}
		return this.round(v, 1);
	},

	formatP_rank : function(v) {
		if(v=="" || v==0) return "-";
		else if (isNaN(v)||v == null) {
			return "-";
		}
		else return v;
	},
	format_Tm: function(v) {
		if(v=="" || v==0) return "-";
		else if (isNaN(v)||v == null ||v == 'NaN' || v == 'null'|| typeof(v) == "undefined") {
			return "-";
		}
		else return v;
	},
	/**
	 * 格式化水位的输出。
	 * 
	 * @param v
	 *            水位值。
	 */
	formatZ : function (v) {
		if (v == null || v == "" || isNaN(v)) {
			return "-";
		}
		return this.round(v, 2);
	}, //end formatZ
	formatV : function (v) {
		if (v == null || v == "" || isNaN(v)) {
			return "-";
		}
		return this.round(v, 2);
	},
	/*********格式化无穷*******/
	formatIn : function (v) {
		if (v == null || v == "" || isNaN(v) || v == Infinity) {
			return "-";
		}
		return this.round(v, 2);
	},
	/**
	 * 格式化水位的输出。
	 * 
	 * @param v
	 *            水位值。
	 */
	formatCmpEgz : function (v) {
		if(v == "" || typeof(v) == "undefined" || v == null) {
			return "";
		}
		if(v == 0 || v == 0.0){
			return '0.00';
		}else{
			return this.round(v, 2);
		}
	}, //end formatZ

	/**
	 * 格式化水势的输出。
	 * 
	 * @param wptn
	 *  水势值。
	 */
	formatWptn : function(wptn){
		if(wptn == null || wptn == "") {
			return "";
		}
		if(wptn=="5"){
			return  '<span style="font-size: 18px;color:#FF0000;"><b>↑</b></span>';
		}else if(wptn=="4"){
			return '<span style="font-size: 18px;color:#008000;"><b>↓</b></span>';
		}else if(wptn=="6"){
			return '<span style="font-size: 14px;color:#0000FF;"><b>-</b></span>';
		}else {
			return '';
		}
	},// end formatWptn
	
	/**
	 * 格式化水势的输出,带中文字符。
	 * 
	 * @param wptn
	 *            水势值。
	 */
    formatWptnCh : function(wptn){
    	if(wptn == null || wptn == "") {
			return "";
		}
    	if(wptn==5){
    		return '<span style="font-size: 12px;color:#FF0000;"><strong>涨↑</strong></span>';
    	}else if(wptn==4){
    		return '<span style="center;font-size: 12px;color:#008000;"><strong>落↓</strong></span>';
    	}else if(wptn==6){
    		return '<span style="font-size: 12px;color:#0000FF;"><strong>平-</strong></span>';
    	}else {
    		return '<span style="font-size: 12px;color:#0000FF;"><strong></strong></span>';
    	}
     },
     
     /**
 	 * excel导出格式化水势的输出,带中文字符。
 	 * 
 	 * @param wptn
 	 *            水势值。
 	 */
     formatExcelWptn : function(wptn) {
 		if(wptn == null || wptn == "") {
 			return "";
 		}
     	if(wptn==5){
     		return '涨↑';
     	}else if(wptn==4){
     		return '落↓';
     	}else if(wptn==6){
     		return '平-';
     	}else {
     		return '';
     	}
 	},

	formatrise : function(diffz) {

		if(diffz == null || diffz == "") {
			return "";
		}
		if(diffz>0.00001){
			return '<span style="font-size: 18px;color:#FF0000;"><b>↑</b></span>';
		}else if(diffz<0){
			return '<span style="center;font-size: 18px;color:#008000;"><strong>↓</strong></span>';
		}else{
			return '<span style="font-size: 18px;color:#0000FF;"><strong>-</strong></span>';
		}

	},



	 /**
	 * 格式化超警戒或者比警戒线的输出，背景颜色变黄色。
	 * 
	 * @param cmfsltd
	 *            超讯限或者比警戒线值。
	 */
    formatCmpwrz : function(cmpwrz){
    	if(cmpwrz == null || cmpwrz == "") {
			return "";
		}
    	return this.formatCmfsltd(cmpwrz);
	}, // end formatCmpwrz

	/**
	 * 格式化超讯限或者比警戒线的输出，背景颜色变黄色。
	 * 
	 * @param cmfsltd
	 *            超讯限或者比警戒线值。
	 */
	formatCmfsltd : function(cmfsltd){
		if(cmfsltd == null || cmfsltd == "") {
			return "";
		}
		if(cmfsltd > 0){
			return '<span style="background-color:#E6CF31;">'+this.round(cmfsltd, 2)+'</span>';
		}else {
			return '<span >'+this.round(cmfsltd, 2)+'</span>';
		}
		
	}, // end formatCmfsltd
	/**
	 * 格式化比枯警低显示，背景颜色变黄色。
	 * 
	 * @param cmplaz
	 *            比枯警低显示，背景颜色变黄色。
	 */
	formatCmplaz : function(cmplaz){
		if(cmplaz == null || cmplaz == "") {
			return "";
		}
		if(cmplaz < 0){
			return '<span style="background-color:#E6CF31;">'+this.round(cmplaz, 2)+'</span>';
		}else {
			return '<span >'+this.round(cmplaz, 2)+'</span>';
		}
		
	}, // end formatCmfsltd

	/**
	 * 格式化流量的输出。
	 * 
	 * @param v
	 *            流量值。
	 */
	formatQ : function(v) {
		if(v == 0 || v == null || typeof(v) == "undefined") {
			return "";
		}
		return this.pres(v, 3);
	},// end formatQ

	/**
	 * 格式化蓄水量的输出。
	 * 
	 * @param v
	 *            蓄水量值。
	 */
	formatW : function(v) {
		if(v == 0 || v == null || typeof(v) == "undefined") {
			return "";
		}
		return this.round(v, 2);
	}, // end formathW

	formatW_m : function(v) {
		if(v == null || typeof(v) == "undefined") {
			return "-";
		}
		if(v == 0 ) {
			return "";
		}
		return this.round(v, 2);
	},

	/**
	 * 格式化库容的输出。
	 * 
	 * @param v
	 *            库容值。
	 */
	formatCP :function (v){
		if(v == 0 || v == null || typeof(v) == "undefined") {
			return "";
		}
		return this.round(v, 2);
	},
	/**
	 * 格式输出权重值
	 * @param s
	 * @return
	 */
	formatScale : function(s){
		var val = this.round(s, 2);
		 if(val < 1){
	         return '<span style="color:green;">' + val + '</span>';
	     }else if(val > 1){
	         return '<span style="color:red;">' + val + '</span>';
	     }
	     return val;
	},
	
	/**
	 * 树形列表当值为''时会出现不显示表格行的问题。
	 * 对于值空''导致不显示表格线的， 格式化输出为&nbsp;
	 * @param s
	 * @return
	 */
	formatValNull : function(v){
		 if(typeof(v) == 'undefined' || v == ''){
			 return '&nbsp;';
		 }else{
			 return v;
		 }
	},
	/**
	 * 格式化河道水情时间的输出。
	 * @param tm 时间，格式为yyyy-MM-dd HH:mm:ss
	 * @return 输出的格式为：MM-dd HH:mm
	 */
	formatRiverTM : function(tm) {
		if(typeof(tm) == "undefined" || tm == null || tm.length == 0) {
			return "";
		}
		if(tm.length < 16) {
			return tm;
		}
		return tm.substring(5,16);
	},
	/**
	 * 格式化水库水情时间的输出。
	 * @param tm 时间，格式为yyyy-MM-dd HH:mm:ss
	 * @return 输出的格式为：MM-dd HH:mm
	 */
	formatRsvrTM : function(tm) {
		return this.formatRiverTM(tm);
	},

	/**
	 * 格式化时间的输出。
	 * @param tm 时间，
	 * @return 输出的格式为：yyyy-MM-dd HH:mm
	 */
	formatTM : function(tm) {
		if(null==tm || tm ==undefined ) {
			return "-";
		}
		var date = new Date(tm);
		var Minu
		if(date.getMinutes()<10) {
			Minu = '0'+date.getMinutes()
		}else {
			Minu =date.getMinutes();
		}
		return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+Minu;
	},

	formatTMAdd0 : function(tm) {
		if(null==tm || tm ==undefined ) {
			return "";
		}
		var date = new Date(tm);
		function add0(x){
			if(x<10) {
				x = '0'+x
			}else {
				x =x;
			}
			return x
		}

		return date.getFullYear()+"-"+add0(date.getMonth()+1)+"-"+add0(date.getDate())+" "+add0(date.getHours())+":"+add0(date.getMinutes());
	},

	formatTMNoYear : function(tm) {
		if(null==tm || tm ==undefined ) {
			return "-";
		}
		var date = new Date(tm);
		return date.Format("MM-dd hh:mm");
	},
	formatTMNoHours :function(tm) {
		if(null==tm || tm ==undefined ) {
			return "-";
		}
		var date = new Date(tm);
		return date.Format("yyyy-MM-dd");
	},
	/**
	 * 格式化站类
	 * @param sttp 站类，rvtype：水库类型
	 * @return 水库(小一)
	 */
	formateSttp:function(sttp,rvtype){
		var sttpStr = "";
		var rvTypeStr = "";
		switch(rvtype){
			case "3":
				rvTypeStr = "中型";
				break;
			case "4":
				rvTypeStr = "大一";
				break;
			case "5":
				rvTypeStr = "大二";
				break;
			case "1","2":
				rvTypeStr = "小型";
				break;
			default:
				rvTypeStr = "其它";
		}
		switch(sttp){
			case "PP":
				sttpStr = "雨量";
				break;
			case "ZZ":
				sttpStr = "水位";
				break;
			case "ZG":
				sttpStr = "地下水";
				break;
			case "ZQ":
				sttpStr = "水文";
				break;
			case "RR":
				sttpStr = "水库";
				if(rvTypeStr!="") sttpStr += "("+rvTypeStr+")"
				break;
			case "DD":
				sttpStr = "闸坝";
				break;
			case "TT":
				sttpStr = "潮位";
				break;
			default:
				sttpStr = "雨量";
		}

		return sttpStr;
	},

	formatAddvnm:function(addvnm){
		if(addvnm == null) {
			return '-'
		}
		return addvnm;
	},

	/**
	 * 保留数字的小数位。
	 * 
	 * @param v
	 *            被保留的数字。
	 * @param len
	 *            小数位长度。
	 * @return 保留结果。
	 */
	round :function (v, len) {
		if (v == null || v == "" || isNaN(v)) {
			return "";
		}
		if (isNaN(len) || len == null) {
			len = 0;
		} else if (len < 0) {
			len = 0;
		}
		var n = Math.round(v * Math.pow(10, len)) / Math.pow(10, len);
		if (len == 0) {
			return n;
		}
		var s = n.toString();
		var pos = s.indexOf(".");
		//如果小数位数不到指定的个数则在后面补0
		if (pos < 0) {
			s += ".";
			for ( var i = 0; i < len; i++) {
				s += "0";
			}
		} else {
			var digitLen = s.substring(pos + 1).length;
			for ( var i = digitLen; i < len; i++) {
				s += "0";
			}
		}
		return s;
	},// end round
	
	/**
	 * 获取有效位数
	 * @param v 被处理的数据
	 * @param len 保留有效位数
	 * 
	 */
	pres : function (v, len) {
		if (v == null || v == "" || isNaN(v)) {
			return "";
		}
		var a,b,c,d; 
	    a = v.toString();
	    n = parseInt(len);
	    b = "0000000000";
	    if(a.indexOf(".") > -1){
	    	d = a.substring(0,a.indexOf(".")).length;	//取整数部份位数
	    	a += b;
	    	n = n <= d?n:n+1;
	    	if(a.substring(0,a.indexOf("."))=="0"){	// 0有效数处理
	    		var count = 0;
	    		for(var i = 2;i < a.length;i++){
	    			if(a.substring(i,i+1)=="0"){	
	    				count++;
	    			}else
	    				break;
	    		}
	    		c = a.substring(0,count+n+1);
	    	}else{
	    		c = a.substring(0,n);
			    c += d > n?b.substring(0,d-n):" ";
	    	}
	    }else{
	    	d = a.length;
	    	if(d <= n) {
	    		return a;
	    	}
	    	a += "."+b;
	    	c = a.substring(0,n);
	    	if(d > n) {
	    		c += b.substring(0,d-n);
	    	}
		    
	    }
	    return c;
	}// end pres
};
