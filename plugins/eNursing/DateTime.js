
//js格式化日期方法
    Date.prototype.format  = function(fmt)   
    { //author: meizz   
      var o = {   
        "M+" : this.getMonth()+1,                 //月份   
        "d+" : this.getDate(),                    //日   
        "H+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分   
        "s+" : this.getSeconds(),                 //秒   
        "q+" : Math.floor((this.getMonth()+3)/3), //季度   
        "S"  : this.getMilliseconds()             //毫秒   
      };   
      if(/(y+)/.test(fmt))   
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
      for(var k in o)   
        if(new RegExp("("+ k +")").test(fmt))   
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
      return fmt;   
    }  ;

    //定义控件最早可选的日期时间
    var bootstrapstartD='2017/01/01';
    var now=new Date();
    var year=now.getFullYear();
    var month=now.getMonth()+1;
    if (month < 10) {//月份小于10补零
        month = '0' + month;
    }
    //现在系统日期
    var nowD = now.format("yyyy/MM/dd");
    //现在系统时间
    var nowT = now.format("HH:mm");
    var days = now.getDate()-1;
    var yesD = year+"/"+month+"/"+days;
    var dataOption={
            language:  'zh-TW',//指定语言中文
            autoclose: 1,//1选择日期后自动关闭，0选择后不关闭
            format:'yyyy/mm/dd',
            weekStart: 0,//设置每周从星期几开始0代表周日
            startDate:bootstrapstartD,//设定不在范围前的时间禁用
            endDate:nowD,//设定不在范围后的时间禁用
            startView:2,
            minView:2,
            todayBtn:0,//今日按钮
            todayHighlight:0,//今日时间高亮黄色
            keyboardNavigation:1,//允许键盘方向键选择日期
			forceParse: 0//纠正用户输入错误
        };
    var timeOption={
            language:  'zh-TW',//指定语言中文
            autoclose: 1,//1选择日期后自动关闭，0选择后不关闭
            format:'hh:ii',
     	    weekStart: 0, //一周从哪一天开始
            todayBtn:  1, //
            todayHighlight: 1,
            startView: 1,
            minuteStep:1,
            minView:0,
            forceParse: 0,
            keyboardNavigation:true,
            showMeridian: 1,
            'setStartDate': new Date().format("yyyy/MM/dd")
        };
    function bindDate(){
    	$("input[date='date']").click(function(){
            if ($(this).attr("createDTPicker")==undefined){
                $(this).datetimepicker(dataOption);
                $(this).attr("createDTPicker", "true");
                $(this).focus();
            }
        });
    	$("input[date='time']").click(function(){
            if ($(this).attr("createDTPicker")==undefined){
                $(this).datetimepicker(timeOption);
                $(this).attr("createDTPicker", "true");
                $(this).focus();
            }
        });
    }