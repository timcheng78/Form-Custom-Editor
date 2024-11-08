
//判斷使否為chrome瀏覽器
var isChrome = window.navigator.userAgent.indexOf("Chrome") !== -1;
//判斷chrome版本是否大於60 (2019.5.8實測打包apk是30.0.0.0版、電腦是74.0.3729.131版)
isChrome = (!isChrome)?false:parseInt(window.navigator.userAgent.split("Chrome/")[1].split(".")[0])>60;

//加載CSS或JS文件
function loadjscssfile(filename, filetype, deferOrAsync) {
    var fileref="";
    if (filetype == "js") {
        // fileref+='<script src="'+filename+'"';
        // if (deferOrAsync=="defer"){
        //     fileref+=' defer';
        // }else if (deferOrAsync=="async"){
        //     fileref+=' async';
        // }
        // fileref+="></script>";
        if (deferOrAsync=="defer"){
            $.ajax({url: filename, cache: false, async: true}).done(function( context ) {if (!isChrome && !eNursing.isIE(11)) appendScriptToHead(context);}).fail(function(err){/*error*/});
        }else if (deferOrAsync=="async"){
            $.ajax({url: filename, cache: false, async: true}).done(function( context ) {if (!isChrome && !eNursing.isIE(11)) appendScriptToHead(context);}).fail(function(err){/*error*/});
        }else{
            $.ajax({url: filename, cache: false, async: false}).done(function( context ) {if (!isChrome && !eNursing.isIE(11)) appendScriptToHead(context);}).fail(function(err){/*error*/});
        }
    } else if (filetype == "css") {
        $.ajax({url: filename, cache: false, async: false}).done(function( context ) { appendStyleToHead(context);}).fail(function(err){/*error*/});
        // fileref+='<link rel="stylesheet" href="'+filename+'">';
        // if (typeof fileref != "") document.write(fileref);
    }
    // if (typeof fileref != "") document.write(fileref);

}

//append Style 至 head
function appendStyleToHead(context){
    $("head").append("<style>" + context + "</style>");
}

//append Script 至 head
function appendScriptToHead(context){
    $("head").append("<script>"+context+"</script>");
}

//append Script 至 body
function appendScriptToBody(context){
    $("body").append("<script>"+context+"</script>");
}

//頁面刷新
function refresh(){
    var thisPage=window.localStorage["previousPage"]; //當前頁
    var headerTitle = window.localStorage["d_headerTitle"]; //Title
    var formType = window.localStorage["d_formType"]; //此form的beanName
    var frameModel = window.localStorage["d_frameModel"];  //此page的對應功能頁面
    var frameModel_INIT = window.localStorage["d_frameModel_INIT"];  //此page的對應功能頁面程式
    doURL_dynamicForm(thisPage,headerTitle,formType,frameModel,frameModel_INIT);
}

//防止iframe的cache
function stopIframeCache(url){
    //$("#previewIframe")[0].contentWindow.location.href = menu[frameModel].url+"&noCache="+Math.random();
    var regex = /\?\W/;
    if (regex.test(url)){
        return url+"&noCache="+eNursing.UUID(20);
    }else{
        return url+"?noCache="+eNursing.UUID(20);
    }
}


var searchCount = 4; //要查詢資料的次數
var F2ReportErrorMsg = ""; //按F2可以回報ErrorMsg
document.onkeydown=function(event){
  var e = event || window.event || arguments.callee.caller.arguments[0];
  //自動輸入 F8
  if(e && e.keyCode==119){ // 按 F8
      //自動輸入
   var nm="";
   $(".radioFormItem").each(function(){
    if (isRequired(this)){ //檢查是否必填
      if (nm!=this.name){
       nm=this.name;
       if (this.checked!=true)
        this.click();
      }
    }
   });
   $(".checkboxFormItem").each(function(){
    if (isRequired(this)){ //檢查是否必填
      if (nm!=this.name){
       nm=this.name;
       if (this.checked!=true)
        this.click();
      }
    }
   });
   $(".selectFormItem").each(function(){
    if (isRequired(this)){ //檢查是否必填
      this.value=$(this).find("option:eq(1)").val();
      $(this).change();
    }
   });
   $(".dateFormItem").each(function(){
    if (isRequired(this)){ //檢查是否必填
      $(this).val(new Date().format(JSON.parse(getDataset(this).typeformat).date.format.replace("mm", "MM"))).blur();
    }
   });
   $(".timeFormItem").each(function(){
    if (isRequired(this)){ //檢查是否必填
      $(this).val(new Date().format(JSON.parse(getDataset(this).typeformat).time.format.replace("hh", "HH").replace("ii", "mm"))).blur();
    }
   });
   $(".dtFormItem").each(function(){
    if (isRequired(this)){ //檢查是否必填
      var dateFormat = JSON.parse(getDataset($("#"+this.id+"_date")[0]).typeformat).date.format.replace("mm", "MM");
      var timeFormat = JSON.parse(getDataset($("#"+this.id+"_time")[0]).typeformat).time.format.replace("hh", "HH").replace("ii", "mm");
      $(this).val(new Date().format(dateFormat+" "+timeFormat)).change();
    }
   });
   $(".textFormItem[data-required='true'], .textareaFormItem[data-required='true']").val("for test");

   //檢查是否必填
   function isRequired(e){
    return getDataset(e).required=="true";
   }
  }

  //顯示/隱藏 beanName  ctrl+F2
  if(e && (((e.ctrlKey || e.metaKey) && e.keyCode==113))){
    var pFormItemBeanName = $(".pFormItemBeanName");
    if (pFormItemBeanName.length>0){
      pFormItemBeanName.remove();
    }else{
      //beanName
      $(".pFormItem").each(function(){
        var st = getDataset(this).bean;
        $(this).prepend("<label class='pFormItemBeanName' style='background-color: #FCF9AB;'>"+st+"</label><br class='pFormItemBeanName'/>");
      });
      //單選複選uiValue
      $(".rdLabelFormItem, .ckLabelFormItem").each(function(){
        var st = $("#"+$(this).attr("for")).val();
        $(this).append("<label class='pFormItemBeanName' style='background-color: #FCF9AB;'>("+st+")</label><br class='pFormItemBeanName'/>");
      });
      //下拉框uiValue
      $(".selectFormItem option").each(function(){
        var st = this.value;
        $(this).append("<label class='pFormItemBeanName' style='background-color: #FCF9AB;'>("+st+")</label><br class='pFormItemBeanName'/>");
      });
      //hidden itemValue
      $(".hiddenFormItem").each(function(){
        var st = this.value;
        $(this).after("<label class='pFormItemBeanName' style='background-color: #FCF9AB;'>("+st+")</label><br class='pFormItemBeanName'/>");
      });
    }
  }
  //顯示頁面資訊 ctrl+F1 || F2
  else if(e && (((e.ctrlKey || e.metaKey) && e.keyCode==112)|| e.keyCode==113)){
    var divLogF = document.getElementById("divLogF");
    var divLogB = document.getElementById("divLogB");
    if (divLogF.style.display=="none"){
      var divLog = document.getElementById("divLog");
      divLog.innerHTML = "";
      try{
        divLog.innerHTML += "<font color='#5C8ADD'>url: </font>"+location.href;
        try{
          divLog.innerHTML += "<br/><font color='#5C8ADD'>sourceId: </font>"+sourceId;
        }catch(e){
          console.log(e);
        }
        try{
          divLog.innerHTML += "<br/><font color='#5C8ADD'>formId <font color='#50CE56'>(GForm)</font>: </font>"+gFormJS.formId;
        }catch(e){
          console.log(e);
        }
        try{
          divLog.innerHTML += "<br/><font color='#5C8ADD'>formId <font color='#50CE56'>(dynamicForm)</font>: </font>"+dynamicForm.formId;
        }catch(e){
          console.log(e);
        }
        divLog.innerHTML += "<br/><font color='#5C8ADD'>formType: </font>"+formType;
        divLog.innerHTML += "<br/><font color='#5C8ADD'>frameModel: </font>"+frameModel;
        divLog.innerHTML += "<br/><font color='#5C8ADD'>frameModel_INIT: </font>"+frameModel_INIT;
        try{
          divLog.innerHTML += "<br/><font color='#5C8ADD'>versionNo: </font>"+versionNo;
        }catch(e){
          console.log(e);
        }

        //回報ErrorMsg會產生log，先暫存，到時候覆蓋
        localStorage["divLog.innerHTML"] = divLog.innerHTML;

        //按F2可以回報ErrorMsg
        try{
          searchCount = 4;
          //暫時將效能的設定關閉
          localStorage["_pfm.formVersion"] = _pfm.formVersion;
          localStorage["_pfm.formFrame"] = _pfm.formFrame;
          _pfm.formVersion = false;
          _pfm.formFrame = false;
          //把divLog的資訊存起來
          F2ReportErrorMsg = divLog.innerHTML.replace(/(\<br\/\>)|(\<br\>)/g, "\n").replace(/(\<font color\=\"#5C8ADD\"\>)|(\<font color\=\"#50CE56\"\>)|(\<\/font\>)/g, "");
          //把錯誤訊息存起來
          F2ReportErrorMsg += "\n" + localStorage["F2ReportErrorMsg"];
          F2ReportErrorMsg += "\n\n==========產生表單資訊"+new Date().format("yyyy-MM-dd HH:mm:ss")+"\n";
          console.log("========回報錯誤訊息: ");
          console.log(F2ReportErrorMsg);
          downloadReport(F2ReportErrorMsg);

          //取得formVersion
          var vNo;
          try{
            vNo = versionNo;
          }catch(e){
            console.error(e);
            vNo = 9999;
          }
          var basicParam = nursing.getBasicParam();
          var searchParamDF = {"searchParamDF" : {
            "formType" : formType,
            "versionNo" : vNo
          }};
          basicParam.getFormVersionByFormTypeVersionNo(searchParamDF, function (formVersion, msg){
            if (formVersion!=null){
              F2ReportErrorMsg += "\n\n==========formVersion (version="+formVersion.version+")\n<!--\n\t" + formVersion.content.replace(/\n/g, "\n\t") + "\n-->";
            }else{
              F2ReportErrorMsg += "\n\n==========formVersion (fromVersion=null)\n" + msg;
            }
            downloadReport(F2ReportErrorMsg);
          }, function() {downloadReport(F2ReportErrorMsg);});

          //取得formFrame
          searchParamDF = {"searchParamDF" : {
            "formType" : formType,
            "frameModel" : frameModel,
            "versionNo" : vNo
          }};
          basicParam.getDynamicFormFrameByformTypeFrameModelVersionNo(searchParamDF, function (formFrame, msg){
            if (formFrame!=null){
              F2ReportErrorMsg += "\n\n==========formFrame (version="+formFrame.version+")\n<!--\n\t" + formFrame.content.replace(/\n/g, "\n\t") + "\n-->";
            }else{
              F2ReportErrorMsg += "\n\n==========formFrame (formFrame=null)\n" + msg;
            }
            downloadReport(F2ReportErrorMsg);
          }, function() {downloadReport(F2ReportErrorMsg);});

          //取得frameInit
          searchParamDF = {"searchParamDF" : {
            "formType" : formType,
            "frameModel" : frameModel_INIT,
            "versionNo" : vNo
          }};
          basicParam.getDynamicFormFrameByformTypeFrameModelVersionNo(searchParamDF, function (formFrame, msg){
            if (formFrame!=null){
              F2ReportErrorMsg += "\n\n==========frameInit (version="+formFrame.version+")\n<!--\n\t" + formFrame.content.replace(/\n/g, "\n\t") + "\n-->";
            }else{
              F2ReportErrorMsg += "\n\n==========frameInit (frameInit=null)\n" + msg;
            }
            downloadReport(F2ReportErrorMsg);
          }, function() {downloadReport(F2ReportErrorMsg);});

          //輸出成檔案下載
          function downloadReport(msg){
            console.error(searchCount);
            if (--searchCount>0) return;
            if (localStorage["_pfm.formVersion"]=="true") _pfm.formVersion = true;
            if (localStorage["_pfm.formFrame"]=="true") _pfm.formFrame = true;
            var MIME_TYPE = 'text/plain';
            var blob = new Blob([msg], {
                type: MIME_TYPE
            });
            var blobUrl = window.URL.createObjectURL(blob);
            var fileName = formType+"-"+frameModel+"錯誤訊息_"+new Date().format("yyyyMMdd HH:mm")+".txt";

            var $downloadDataHref = $('<a style="background-color: white;">下載(如果沒下載請按F12查看)</a>');
            $downloadDataHref.attr({
                href: blobUrl,
                download: fileName
            });
            setTimeout(function() {
              //回報ErrorMsg會產生log，拿之前的innerHTML覆蓋
              divLog.innerHTML = localStorage["divLog.innerHTML"];
              divLog.innerHTML += "<br/><br/><br/><font color='#5C8ADD'>回報錯誤訊息: </font>";
              $(divLog).append($downloadDataHref);
            }, 10);
          }
        }catch(e){
          if (localStorage["_pfm.formVersion"]=="true") _pfm.formVersion = true;
          if (localStorage["_pfm.formFrame"]=="true") _pfm.formFrame = true;
          console.error(e);
        }
      }catch(e){
        console.log(e);
      }
      eNursing.showLogC=100;
      divLogF.style.display = "";
      divLogB.style.display = "";
      eNursing.showLog();
      eNursing.showLogC=0;
    }else{
      divLogF.style.display = "none";
      divLogB.style.display = "none";
    }
  }
};

//跳轉至xml模板導入頁面
function doURL_tplImport(url, headerTitle, sourceId){
  var tpl_multiLevel = "tplImp";
  window.localStorage["import_headerTitle"] = headerTitle;
  window.localStorage["import_sourceId"] = sourceId;
  window.open(url,"_blank");
}

//為IE5 IE7 加上取得element的dataset方法
/**
 *
 * @param ele
 * @returns {DOMStringMap}
 */
function getDataset(ele){
  var dataset = {};
  if (!ele){
      return dataset;
  }
  if(ele.dataset){
      var eleDataset = ele.dataset;
      for (var key in eleDataset){
          dataset[key.toLowerCase()] = eleDataset[key];
      }
  }else{
      var attrs = ele.attributes,//元素的属性集合
          name,
          matchStr;
      if (attrs === undefined) return dataset;
      for(var i = 0;i<attrs.length;i++){
          //是否是data- 开头
          matchStr = attrs[i].name.match(/^data-(.+)/);
          if(matchStr){
              //data-auto-play 转成驼峰写法 autoPlay
              name = matchStr[1].replace(/-([\da-z])/gi,function(all,letter){
                  return letter.toLowerCase();
              });
              dataset[name] = attrs[i].value;
          }
      }
  }
  return dataset;
}

/**
 * 設定 dataset 至指定元素
 * @param {Element} ele 
 * @param {Object} node 
 */
function setDataset(ele, node) {
    if (ele && ele.dataset) {
        var eleDataset = ele.dataset;
        for (var key in node) {
            eleDataset[key] = node[key];
        }
    } else {
        for (var key in node) {
            var dataKey = 'data-' + key.replace(/[A-Z]/g, function (match, offset) {
                return (offset ? '-' : '') + match.toLowerCase()
            });
            ele.setAttribute(dataKey, node[key]);
        }
    }
}

//pageReady 之前，載入js檔案
function goPageReady(pageReady){
    if (pageReady){
        try{
            thisPageStatus = thisPageStatus;
        }catch(e){
            thisPageStatus = "";
        }
        // 動態表單各家獨立的js (表單建置完成後)
        loadjscssfile("../../../js/dynamicForm2/pageReady/common.js", "js"); //通用
        if (thisPageStatus==="LIST")
            loadjscssfile("../../../js/dynamicForm2/pageReady/list.js", "js"); //list專用
        else if (thisPageStatus==="ADD")
            loadjscssfile("../../../js/dynamicForm2/pageReady/add.js", "js"); //add專用
        else if (thisPageStatus==="UPD")
            loadjscssfile("../../../js/dynamicForm2/pageReady/upd.js", "js"); //upd專用
        else if (thisPageStatus==="PRINT")
            loadjscssfile("../../../js/dynamicForm2/pageReady/print.js", "js"); //print專用
        //導入完成後執行pageReady
        pageReady();
        if (thisPageStatus==="UPD")
            loadjscssfile("../../../js/dynamicForm2/pageReady/next/upd.js", "js"); //upd專用
    }
}

//init頁籤 a.nav-link
function initNavLink(){
    $(".nav.nav-tabs>.nav-item>.nav-link").click(function(){
        $(".nav.nav-tabs>.nav-item>.nav-link").each(function(){
            var controlID = $(this).attr("aria-controls");
            $(this).removeClass("active");
            $("#"+$(this).attr("aria-controls")).removeClass("active").removeClass("show");
        });
        $(this).addClass("active");
        $("#"+$(this).attr("aria-controls")).addClass("active").addClass("show");
        return false;
    });
}


var beforeApisCount = 0; //api表單前呼叫總數(不含 needAutoSetting 表單自動帶入)
var apiTotalCount = 0; //api總數
//取得api相關設定，存於全域變數apis中
function setApiSetting(dynamicFormTemplate, completeCall) {
    if (dynamicFormTemplate.apiStructure) {
        if (languageMode=="Traditional Chinese"){
            eNursing.processStatus.show("努力讀取資料中", 5000);
        }else{
            eNursing.processStatus.show("努力加载资料中", 5000);
        }
        apis = [];
        var apiStructure = dynamicFormTemplate.apiStructure;

        try {
            apiStructure = JSON.parse(apiStructure.replace(/&quot;/g, '\"').replace(/&amp;/g, '&'));
            apiStructure = apiStructure[frameModel]
        } catch (e) {
            console.error(e);
            apiStructure = [];
        }
        apiTotalCount = apiStructure.length;
        if (apiTotalCount === 0) {
            eNursing.processStatus.hide();
            goPageReady(completeCall);
        };
        for (var i = 0, len = apiStructure.length; i < len; ++i) {
            var module = nursing.createApiModule();
            module.fn.init(JSON.parse(apiStructure[i]), function(apiModule){
                apiInitEnd(apiModule, completeCall)
            }, function(error){
                apiInitError(error, completeCall)
            });
        }
    } else goPageReady(completeCall);
}

function apiInitEnd(apiModule, completeCall) {
    apis.push(apiModule);
    try{
        apis[apiModule.apiName] = apis[apis.length - 1];
    }catch(e){
        console.error(e);
    }
    if (apis[apis.length - 1].runMode.indexOf('F') > -1 && apis[apis.length - 1].needAutoSetting !== true) beforeApisCount++;
    if (--apiTotalCount > 0) return
    //api表單前需要執行的api (不包含 needAutoSetting 表單自動帶入，自動輸入留到ditto時再做)
    if (beforeApisCount > 0) {
        try{
            console.log("正在處理api表單前處理(不包含表單自動帶入)！ count="+beforeApisCount);
            if (languageMode=="Traditional Chinese"){
                eNursing.processStatus.show("努力讀取資料中", 5000);
            }else{
                eNursing.processStatus.show("努力加载资料中", 5000);
            }
            //賦予complete事件並最終導向pageReady
            for (var i = 0, len = apis.length; i < len; ++i) {
                if (apis[i].runMode.indexOf('F') > -1 && apis[i].needAutoSetting !== true) {
                    apis[i].complete = function(apiModule) {
                        if (apiModule.resultMsg && apiModule.resultMsg.error) {
                            console.error("call api error! -> "+apiModule.apiDescription + "\n\n"+apiModule.resultMsg.msg);
                            throw apiModule.resultMsg;
                        }
                        if (--beforeApisCount <= 0) {
                            eNursing.processStatus.hide();
                            goPageReady(completeCall);
                        }
                    }
                    apis[i].start();
                }
            }
        } catch(e) {
            console.error(e);
            if (languageMode=="Traditional Chinese"){
                alert("調用api發生不明原因錯誤");
            }else{
                alert("调用api不明原因错误");
            }
        }
    } else {
        eNursing.processStatus.hide();
        goPageReady(completeCall);
    }
}

function apiInitError(error, completeCall) {
    console.error('setApiSetting() error:' + error);
    if (--apiTotalCount > 0) return;
    eNursing.processStatus.hide();
    goPageReady(completeCall);
}