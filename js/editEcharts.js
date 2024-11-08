
(function() {
    $.editEchartsTools={
        width:500,
        height:500,
        options:null,
        formId:null,
        optionsMap:[],
        element:null,
        echartType:null,
        getTools:function (){
          return this;
        },
        modal:{
            ele:null,
            show:function(ele){
                ele.show();
                this.ele=ele;
            },
            hide:function(){
                if(this.ele){
                    this.ele.hide();
                    this.ele=null;
                }
            }
        },
        //默認色板
        color: ['#ff7f50','#87cefa','#da70d6','#32cd32','#6495ed',
            '#ff69b4','#ba55d3','#cd5c5c','#ffa500','#40e0d0',
            '#1e90ff','#ff6347','#7b68ee','#00fa9a','#ffd700',
            '#6699FF','#ff6666','#3cb371','#b8860b','#30e0e0'],
        //配置圖表屬性
         echartTypes: {
            "line": [0, 1, 2, 3,4,5,6],
            "bar": [0, 1, 2, 3,4,5,6],
            "pie": [0, 1, 2, 3]
        },
        //圖表第一層屬性
         echartFirstAttrs:[
            "title",      //0
            "tooltip",//1
            "legend", //2
            "toolbox", //3
            "dataRange", //4
            "dataZoom", //5
            "grid", //6
            "xAxis",      //7
            "yAxis"    //8
        ],
        //圖表第一層屬性名稱
         echartFirstAttrsDesc:[
            "標題",     //0
            "提示信息",//1
            "圖例組件", //2
            "工具箱", //3
            "值域",      //4
            "區域縮放控制器",      //5
            "網格",      //6
            "X軸",      //7
            "Y軸"      //8
        ],
        //圖表第二層屬性及對應第三層
         echartSecondAttrs:{
            "title":["show","text","subtext","x","y","backgroundColor","borderColor","borderWidth","borderRadius","padding","itemGap","textStyle","subtextStyle"],
            "tooltip":["show","trigger","showDelay","hideDelay","transitionDuration","borderColor","borderWidth","borderRadius","padding","axisPointer"],
            "legend":["show","orient","x","y","backgroundColor","borderColor","borderWidth","borderRadius","padding","itemGap","itemWidth","itemHeight","textStyle"],
            "toolbox":["show","orient","x","y","color","backgroundColor","borderColor","borderWidth","padding","itemGap","itemSize"],
            "dataRange":["show","orient","x","y","backgroundColor","borderColor","borderWidth","padding","itemGap","itemWidth","itemHeight","splitNumber","dataRange_text","min","max","calculable","dataRange_color"],
            "dataZoom":["show","orient","backgroundColor","dataBackgroundColor","fillerColor","handleColor"],
            "grid":["show","grid_x","grid_y"]
             /* ,
             "xAxis":["type","data"],
             "yAxis":["type","data"],*/
        },
        //第三層屬性及描述
         echartThirdAttrs:{
            "text":{
                "titleName":"標題名稱",
                "type":"text",
                "value":[],
                "valueDesc":[],
                "otherVal":[],
                "defaultValue":"我是標題",
                "otherForm":false
            },
            "subtext":{
                "titleName":"副標題名稱",
                "type":"text",
                "value":[],
                "valueDesc":[],
                "otherVal":[],
                "defaultValue":"",
                "otherForm":false
            },
            "x":{
                "titleName":"橫向位置",
                "type":"radio",
                "value":["left","center","right",""],
                "valueDesc":["left","center","right","其他"],
                "otherVal":[false,false,false,true],
                "defaultValue":"",
                "otherForm":false
            },
            "y":{
                "titleName":"縱向位置",
                "type":"radio",
                "value":["top","center","bottom",""],
                "valueDesc":["top","center","bottom","其他"],
                "otherVal":[false,false,false,true],
                "defaultValue":"",
                "otherForm":false
            },
            "grid_x":{
                "titleName":"橫向位置",
                "name":"x",
                "type":"text",
                "value":[],
                "valueDesc":[],
                "otherVal":[],
                "defaultValue":"80",
                "otherForm":false
            },
            "grid_y":{
                "titleName":"縱向位置",
                "name":"y",
                "type":"text",
                "value":[],
                "valueDesc":[],
                "otherVal":[],
                "defaultValue":"60",
                "otherForm":false
            },
            "show":{
                "titleName":"顯示",
                "type":"radio",
                "value":["true","false"],
                "valueDesc":["顯示","隱藏"],
                "otherVal":[false,false],
                "defaultValue":"true",
                "otherForm":false
            },

            "trigger":{
                "titleName":"觸發類型",
                "type":"radio",
                "value":["item","axis"],
                "valueDesc":["item","axis"],
                "otherVal":[false,false],
                "defaultValue":"axis",
                "otherForm":false
            },
            "orient":{
                "titleName":"布局方式",
                "type":"radio",
                "value":["horizontal","vertical"],
                "valueDesc":["水平","垂直"],
                "otherVal":[false,false],
                "defaultValue":"",
                "otherForm":false
            },
            "type":{
                "titleName":"類型",
                "type":"radio",
                "value":["category","value"],
                "valueDesc":["類別","值"],
                "otherVal":[false,false],
                "defaultValue":"",
                "otherForm":false

            },
            "data":{
                "titleName":"類型名稱",
                "type":"text",
                "value":[],
                "valueDesc":[],
                "otherVal":[],
                "defaultValue":"[\"小紅\", \"小橙\", \"小黃\", \"小綠\", \"小青\", \"小藍\", \"小紫\"]",
                "otherForm":true
            },
            "backgroundColor":{
                "titleName":"背景顏色",
                "type":"text",
                "value":[],
                "valueDesc":[],
                "otherVal":[],
                "defaultValue":"rgba(0,0,0,0)",
                "otherForm":false
            },
            "borderColor":{
                "titleName":"邊框顏色",
                "type":"text",
                "value":[],
                "valueDesc":[],
                "otherVal":[],
                "defaultValue":"#ccc",
                "otherForm":false
            },
            "borderWidth":{
                "titleName":"邊框線寬",
                "type":"text",
                "value":[],
                "valueDesc":[],
                "otherVal":[],
                "defaultValue":"0",
                "otherForm":false
            },
             "borderRadius":{
                 "titleName":"邊框圓角",
                 "type":"text",
                 "value":[],
                 "valueDesc":[],
                 "otherVal":[],
                 "defaultValue":"4",
                 "otherForm":false
             },
            "padding":{
                "titleName":"內邊距",
                "type":"text",
                "value":[],
                "valueDesc":[],
                "otherVal":[],
                "defaultValue":"5",
                "otherForm":false
            },
            "itemGap":{
                "titleName":"間隔",
                "type":"text",
                "value":[],
                "valueDesc":[],
                "otherVal":[],
                "defaultValue":"10",
                "otherForm":false
            },
            "itemWidth":{
                "titleName":"圖形寬度",
                "type":"text",
                "value":[],
                "valueDesc":[],
                "otherVal":[],
                "defaultValue":"20",
                "otherForm":false
            },
            "itemHeight":{
                "titleName":"圖形高度",
                "type":"text",
                "value":[],
                "valueDesc":[],
                "otherVal":[],
                "defaultValue":"14",
                "otherForm":false
            },
            "itemSize":{
                "titleName":"工具箱圖形寬度",
                "type":"text",
                "value":[],
                "valueDesc":[],
                "otherVal":[],
                "defaultValue":"16",
                "otherForm":false
            },
            "textStyle":{
                "titleName":"文字樣式",
                "type":"text",
                "value":[],
                "valueDesc":[],
                "otherVal":[],
                "defaultValue":"14",
                "otherItem":["color","fontSize","fontWeight"],
                "otherForm":true
            },
            "subtextStyle":{
                "titleName":"副標題樣式",
                "type":"text",
                "value":[],
                "valueDesc":[],
                "otherVal":[],
                "defaultValue":"",
                "otherItem":["color"],
                "otherForm":true
            },
            "fontSize":{
                "titleName":"字體大小",
                "type":"text",
                "value":[],
                "valueDesc":[],
                "otherVal":[],
                "defaultValue":"18",
                "otherForm":false
            },
            "fontWeight":{
                "titleName":"字體寬度",
                "type":"text",
                "value":[],
                "valueDesc":[],
                "otherVal":[],
                "defaultValue":"bolder",
                "otherForm":false
            },
            "splitNumber":{
                "titleName":"分割段數",
                "type":"text",
                "value":[],
                "valueDesc":[],
                "otherVal":[],
                "defaultValue":"5",
                "otherForm":false
            },
            "dataRange_text":{
                "titleName":"值域文本",
                "name":"text",
                "type":"text",
                "value":[],
                "valueDesc":[],
                "otherVal":[],
                "defaultValue":"[\"高\",\"低\"]",
                "otherForm":false
            },
            "dataRange_color":{
                "titleName":"值域文本",
                "name":"color",
                "type":"text",
                "value":[],
                "valueDesc":[],
                "otherVal":[],
                "defaultValue":"[\"#ff7f50\",\"#87cefa\",\"#da70d6\",\"#32cd32\",\"#6495ed\"]",
                "otherForm":false
            },
            "calculable":{
                "titleName":"值域可計算",
                "type":"radio",
                "value":["true","false"],
                "valueDesc":["true","false"],
                "otherVal":[false,false],
                "defaultValue":"false",
                "otherForm":false
            },
            "min":{
                "titleName":"值域最小值",
                "type":"text",
                "value":[],
                "valueDesc":[],
                "otherVal":[],
                "defaultValue":"0",
                "otherForm":false
            },
            "max":{
                "titleName":"值域最大值",
                "type":"text",
                "value":[],
                "valueDesc":[],
                "otherVal":[],
                "defaultValue":"40",
                "otherForm":false
            },
            "color":{
                "titleName":"顏色",
                "type":"text",
                "value":[],
                "valueDesc":[],
                "otherVal":[],
                "defaultValue":"#333",
                "otherForm":false
            },
             "showDelay":{
                 "titleName":"显示延遲(ms)",
                 "type":"text",
                 "value":[],
                 "valueDesc":[],
                 "otherVal":[],
                 "defaultValue":"20",
                 "otherForm":false
             },
             "hideDelay":{
                 "titleName":"隱藏延遲(ms)",
                 "type":"text",
                 "value":[],
                 "valueDesc":[],
                 "otherVal":[],
                 "defaultValue":"100",
                 "otherForm":false
             },
             "transitionDuration":{
                 "titleName":"動畫變換時間(s)",
                 "type":"text",
                 "value":[],
                 "valueDesc":[],
                 "otherVal":[],
                 "defaultValue":"0.4",
                 "otherForm":false
             },
             "axisPointer":{
                 "titleName":"坐標軸指示器",
                 "type":"text",
                 "value":[],
                 "valueDesc":[],
                 "otherVal":[],
                 "defaultValue":"",
                 "otherItem":["axisPointer_type"],
                 "otherForm":true
             },
             "axisPointer_type":{
                 "titleName":"坐標軸指示器",
                 "name":"type",
                 "type":"radio",
                 "value":["line","shadow","cross"],
                 "valueDesc":["直線","陰影","交叉"],
                 "otherVal":[false,false,false],
                 "defaultValue":"cross",
                 "otherForm":false
             },
             "dataBackgroundColor":{
                 "titleName":"數據背景顏色",
                 "type":"text",
                 "value":[],
                 "valueDesc":[],
                 "otherVal":[],
                 "defaultValue":"#eee",
                 "otherForm":false
             },
             "fillerColor":{
                 "titleName":"填充顏色",
                 "type":"text",
                 "value":[],
                 "valueDesc":[],
                 "otherVal":[],
                 "defaultValue":"rgba(144,197,237,0.2)",
                 "otherForm":false
             },
             "handleColor":{
                 "titleName":"手柄顏色",
                 "type":"text",
                 "value":[],
                 "valueDesc":[],
                 "otherVal":[],
                 "defaultValue":"rgba(70,130,180,0.8)",
                 "otherForm":false
             }


        },
        //显示其他輸入距離
         showXyModal:{
            show:function(arg){
                this.obj=arg;
                $("#bgXydiv,#otherXyDiv").remove();
                $("body").append("<div id='bgXydiv' style=' position: fixed; display: none;top: 0;left: 0; " +
                    "z-index: 1060; background-color: #000; opacity: 0.5; width: 100vw; height: 100vh; '></div>" +
                    "<div id='otherXyDiv' style= 'position: fixed;" +
                    "    top: 0;" +
                    "    left: 0;" +
                    "    z-index: 1100;" +
                    "    width: 100vw;" +
                    "    height: 100vh;" +
                    "    overflow: hidden;" +
                    "    outline: 0;   " +
                    "   '>" +
                    "<div style='max-width: calc(30vw);" +
                    "    z-index: 1100;" +
                    "    background-color: #fff;" +
                    "    height: calc(20vh);" +
                    "    opacity: 1;" +
                    "    margin: 5% 30%;" +
                    "    border-radius: 5px; overflow:hidden;   '>" +
                    "<div style='max-width: calc(30vw);margin-top: 40px;'>" +
                   "  <input id=\"xyval\" name=\"px\" type=\"text\" placeholder=\"請輸入數字單位px\">"+
                    "</div>" +
                    "<div style='text-align: right;margin-right: 18px;' >" +
                    "<button type='button'   style='margin-left: 15px;' class='btn btn-danger closeXyBtn'  >關閉</button>" +
                    "<button type=\"button\" style='margin-left: 15px;' class=\"btn btn-warning clearXy\" >清除</button>" +
                    "<button type=\"button\" style='margin-left: 15px;' class=\"btn btn-primary primaryXy\" >確認</button>" +
                    "</div>" +
                    "");

                $("#xyval").val("");
                $("#bgXydiv,#otherXyDiv").show();
                var modal=this;
                $(".clearXy,.closeXyBtn").click(function(){
                    modal.remove();
                })
                $(".primaryXy").click(function(){
                    modal.hide();
                })
            },
            hide:function(){
                if($("#xyval").val()===""){
                    alert("請輸入數字");
                }else{
                    this.obj.value=$("#xyval").val();
                    $(this.obj).next("label").html("其他"+$("#xyval").val());
                    $("#bgXydiv,#otherXyDiv").remove();

                }
            },
            remove:function(){
                this.obj.value="";
                this.obj.checked=false;
                $(this.obj).next("label").html("其他");
                $("#bgXydiv,#otherXyDiv").remove();
            }
        },
        //保存圖表到gform
         saveEchartToGform:function(){
            var that=this;
            var option=that.getEditOption();
            var gFormJS = nursing.createGForm();

            gFormJS.status = "Y";
            gFormJS.formVersionId = eNursing.UUID();
            var items = [];
            items.push({
                itemKey: "option",
                itemValue: JSON.stringify(option)
            })
            items.push({
                itemKey: "echartType",
                itemValue:that.echartType
            })
            if(window.console)console.log(items);

            gFormJS.formType="echarts";
            gFormJS.sourceId="echarts";
            gFormJS.searchParamGF.sourceId = "echarts";
            gFormJS.searchParamGF.formType = "echarts";
            gFormJS.gformItems = items;
            gFormJS.versionNo = 1;
            gFormJS.totalScore = 0;
            gFormJS.creatorId = "admin";
            gFormJS.creatorName ="admin";
            gFormJS.searchParamGF.userId ="admin";
            gFormJS.searchParamGF.userName ="admin";

            gFormJS.addOrUpdateGForm(gFormJS,
                function (rsGForms) {
                    if (rsGForms) {
                        alert("保存成功");
                        that.modal.hide();
                        that.init();
                    }
                },
                function (e) {
                    that.modal.hide();
                }
            );
        },
        //處理json數據
         processJsonData:function(jsonObj){
            var json={};
            for(var i in jsonObj){
                try{
                    json[i]=JSON.parse(jsonObj[i]);
                }catch (e){
                    json[i]=jsonObj[i];
                }
            }
            return json;
        },
        //取得編輯屬性
         getEditOption:function(){
            var that=this;
            var option={};
            var type=that.echartType;
            $("#leftDiv").find("form").each(function(){
                // if($(this).is(":visible")) {
                    var className = this.className;
                   /* if ($("." + className).length > 1) {
                        var obj = [];
                        $("." + className).each(function (ele) {
                            if($(this).is(":visible")) {
                                obj.push(that.processJsonData($(this).serializeJSON()));
                            }
                        })
                        option[className] = obj;
                    } else {*/
                        if(className.indexOf("_")!=-1){
                            var first=className.split("_")[0];
                            var second=className.split("_")[1];
                            var sd=that.processJsonData($("." + className).serializeJSON());
                            option[first][second]=sd;
                        }else{
                            option[className]  = that.processJsonData($("." + className).serializeJSON());
                        }
                    // }
                // }
            })
            if(type=="line"||type=="bar"){
                option["xAxis"]= {
                    data: ["襯衫","羊毛衫","雪紡衫","褲子","高跟鞋","襪子"]
                };
                option["yAxis"]={};
                option["series"]=[{
                    name: '銷量',
                    type:type,
                    data: [5, 20, 36, 10, 10, 20],
                    markLine: {
                        symbol: ['circle', 'none'],
                        silent: true,
                        itemStyle: {
                            normal: {
                                show: true,
                                color: '#2F4554'
                            }
                        },
                        label:{
                            normal:{
                                position:'middle'
                            }
                        },
                        data: [{
                            yAxis: 28
                        }]
                    }
                }];
                option["toolbox"]["feature"]= {
                    dataView: { //數據視圖
                        show: true
                    },
                    restore: { //重置
                        show: true
                    },
                    dataZoom: { //數據縮放視圖
                        show: true
                    },
                    magicType: {//動態類型切換
                        type: ['bar', 'line']
                    },
                    saveAsImage: {//保存圖片
                        show: true
                    }

                }
            }else if(type=="pie"){
                option["series"]=[
                    {
                        name: '訪問來源',
                        type: 'pie',    // 設置圖表類型為餅圖
                        radius: '55%',  // 餅圖的半徑，外半徑為可視區尺寸（容器高寬中較小一項）的 55% 長度。
                        data:[          // 數據數組，name 為數據項名稱，value 為數據項值
                            {value:235, name:'視頻廣告'},
                            {value:274, name:'聯盟廣告'},
                            {value:310, name:'郵件營銷'},
                            {value:335, name:'直接訪問'},
                            {value:400, name:'搜索引擎'}
                        ],
                        center : ['50%', '50%'],          // 默認全局居中
                        radius : [0, '45%'],
                        clockWise : true,             // 默認逆時針
                        startAngle: 90,
                        minAngle: 0,                 // 最小角度改為0
                        selectedOffset: 10        // 選中是扇區偏移量
                    }
                ];
                option["toolbox"]["feature"]= {
                    dataView: { //數據視圖
                        show: true
                    },
                    restore: { //重置
                        show: true
                    },
                    dataZoom: { //數據縮放視圖
                        show: true
                    },
                    saveAsImage: {//保存圖片
                        show: true
                    }
                }
            }

            return option;
        },
        //創建圖表屬性細項
         createItem:function(json,secoudName,thirdName){
            var html="";
            if(json){
                if(json.otherForm){
                    html +="</table></form><form class='"+secoudName+"_"+thirdName+"' style='position:relative;opacity:1 !important;font-size: 14pt'><table  style='border-collapse: collapse;width: 100%'>";



                }
               if(json.otherItem&&json.otherItem.length>0){
                    html += "<tr><td colspan='2' style='border: 1px solid #000;background-color: #fde19a'>" + json.titleName + "</td>";

                    for(var oit in json.otherItem){
                        if(oit!="sortJson"&&json.otherItem[oit]){
                            html += this.createItem(this.echartThirdAttrs[json.otherItem[oit]], thirdName,json.otherItem[oit]);
                        }
                    }
                }else {
                   html += "<tr><td width='30%' style='border: 1px solid #000'>" + json.titleName + "</td><td style='border: 1px solid #000'>";

                   if (json.name) {
                        thirdName = json.name;
                    }
                    if (json.type == "text") {
                        html += "<input type='" + json.type + "' name='" + thirdName + "' ";
                        if (json.defaultValue) {
                            html += "value='" + json.defaultValue + "'";
                        }
                        html += "/>";
                    } else {
                        for (var i = 0; i < json.valueDesc.length; i++) {
                            html += "<input  type='" + json.type + "' id='" + secoudName + "_" + thirdName + "_" + i + "' name='" + thirdName + "' value='" + json.value[i] + "'";
                            if (json.otherVal[i]) {
                                html += "onclick='$.editEchartsTools.showXyModal.show(this)'";
                            }
                            if (json.defaultValue && json.defaultValue == json.value[i]) {
                                html += "checked";
                            }
                            html += "/>" +
                                "<label  for='" + secoudName + "_" + thirdName + "_" + i + "'";
                            if (json.otherVal[i]) {
                                html += "onclick='$.editEchartsTools.showXyModal.show(this)'";
                            }
                            html += ">" + json.valueDesc[i] + "</label>";
                        }

                    }
                }
                html += "</td></tr>";

            }

            return html;
        },
        //創建圖表元素
         createEditElement:function(type){
            if(type) {
                this.echartType = type;
                var that = this;
                $("#leftDiv").empty();
                $("#rightDiv").empty();
                var html = "<table  style='width: 100%;border-collapse: collapse;'>";
                for (var ind in that.echartTypes[type]) {
                    html += "<tr><td width='13%' style='border: 1px solid #000'>"
                    var items = that.echartFirstAttrs[that.echartTypes[type][ind]];
                    if (items) {
                        html += that.echartFirstAttrsDesc[ind] + "</td>"
                        html += "<td width='87%'>"
                        var secoudItems = that.echartSecondAttrs[items];
                        html += "<form class='" + items + "' style='position:relative;opacity:1 !important;font-size: 14pt'><table  style='border-collapse: collapse;width: 100%'>";
                        for (var sit in secoudItems) {
                            if(sit!="sortJson"){
                                var third = that.echartThirdAttrs[secoudItems[sit]];
                                html += that.createItem(that.echartThirdAttrs[secoudItems[sit]], items, secoudItems[sit]);
                            }
                        }
                        html += "</table></form></td></tr>"
                    }
                }
                html += "</table>";
                $("#leftDiv").append(html);

            }
        },
        //顯示編輯圖表框
         showEchartsModal:function(ele){
            var that=this;
            var type="";
            if(ele){
                if( ele instanceof jQuery){
                    ele=$(ele)[0];
                };
                type=$(ele).attr("data-echarttype");
            }
            $("#bgdiv,#editEchartsDiv").remove();
            $("body").append("<div id='bgdiv' style=' position: fixed; display: none;top: 0;left: 0; " +
                "z-index: 1040; background-color: #000; opacity: 0.5; width: 100vw; height: 100vh; '></div>" +
                "<div id='editEchartsDiv' style= 'position: fixed;" +
                "    top: 0;" +
                "    left: 0;" +
                "    z-index: 1050;" +
                "    width: 100vw;" +
                "    height: 100vh;" +
                "    overflow: hidden;" +
                "    outline: 0;   " +
                "   '>" +
                "<div style='max-width: calc(100vw);" +
                "    z-index: 1050;" +
                "    background-color: #fff;" +
                "    height: calc(80vh);" +
                "    opacity: 1;" +
                "    margin: 5% 10%;" +
                "    border-radius: 5px; overflow:hidden;   '>" +
                "<div style='text-align: right;margin-right: 18px;' >" +
                "<button type='button'  style='margin-left: 15px;' echartType='line' class='btn btn-success editBtn'>折線圖</button>" +
                "<button type='button'  style='margin-left: 15px;' echartType='bar'  class='btn btn-success editBtn'>柱狀圖</button>" +
                "<button type='button'  style='margin-left: 15px;' echartType='pie'  class='btn btn-success editBtn'>餅圖</button>" +
                "<button type='button'  style='margin-left: 15px;' class='btn btn-danger' id='closebtn'  >關閉</button>" +
                "</div>" +
                "<div id='echartsContent' style='max-width: calc(100vw);height: calc(65vh)'>" +
                    "<div id='leftDiv' style='overflow-y: scroll;overflow-x:hidden;float: left;width: 50%;height: calc(65vh)'>" +
                   "</div>" +
                    "<div id='rightDiv' style='float: left;width: 50%;height: calc(65vh) '>" +
                    "</div>" +
                "</div>" +
                "<div style='text-align: right;margin-right: 18px;' >" +
                "<button id='viewBtn' type='button' class='btn btn-success'>預覽</button>" +
                "<button id='saveBtn'  type='button' class='btn btn-primary' style='margin-left:15px'>保存</button>" +
                "</div>" +
                "");
            var modal= that.modal;
            modal.show($("#bgdiv,#editEchartsDiv"));
            $(".editBtn").on("click",function(){

                that.createEditElement($(this).attr("echartType"));
            })
            $("#closebtn").click(function () {
                that.modal.hide();
            });
            $("#viewBtn").click(function () {
                $("#rightDiv").empty();
                $("#rightDiv").append("<div id='viewEcharts' style='width: 100%;height: 100%'></div>");
                var echart = echarts.init($("#viewEcharts")[0]);
                var option = that.getEditOption();
                if(window.console)console.log(option);
                echart.setOption(option);
                echart.on('click', function (params) {
                    if(window.console)console.log(params);
                    alert(params.name + params.seriesName + params.value)
                });

            });
             if(type){
                 that.createEditElement(type);
                 if(ele){
                     $("#rightDiv").empty();
                     $("#rightDiv").append("<div id='viewEcharts' style='width: 100%;height: 100%'></div>");
                     var echart = echarts.init($("#viewEcharts")[0]);
                     var option = JSON.parse($(ele).attr("data-option"));
                     if(window.console)console.log(option);
                     echart.setOption(option);
                     echart.on('click', function (params) {
                         if(window.console)console.log(params);
                         alert(params.name + params.seriesName + params.value)
                     });
                 }

             }
            $("#saveBtn").click(function () {
                if(type&&ele){
                    $(ele).attr("data-option",JSON.stringify(that.getEditOption()));
                    $(ele).attr("data-echarttype",that.echartType);
                    $(ele).empty().removeAttr("_echarts_instance_");
                    that.init(ele);
                    that.modal.hide();

                }else{
                    that.saveEchartToGform();
                }
            });


        },
        //初始化
         init:function(ele,id){
            this.clearData();
            if(ele) {
                if(ele instanceof jQuery){
                    ele=$(ele)[0];
                };
                this.element=ele;
                if ($(ele).width() == 0) {
                    $(ele).width(this.width);
                }
                if ($(ele).height() == 0) {
                    $(ele).height(this.width);
                }

            }
            if(id){
                this.formId=id;
            }
            if(ele&&$(ele).attr("data-option")){
                 var mychar=echarts.init(ele);
                 mychar.setOption(JSON.parse($(ele).attr("data-option")));
                 var that =this;
                $(ele).on("dblclick",function(){
                    that.showEchartsModal(this );
                })
                 mychar.on('click', function (params) {
                    if(window.console)console.log(params);
                    alert(params.name+params.seriesName+params.value)
                 });
            }else{
                this.getDatas(this,function(that){
                    if(ele&&that.options){
                       var mychar= echarts.init(ele);
                        mychar.setOption(that.options);
                        mychar.on('click', function (params) {
                            if(window.console)console.log(params);
                            alert(params.name+params.seriesName+params.value)
                        });
                        $(ele).attr("data-option",JSON.stringify(that.options));
                        $(ele).attr("data-echarttype",that.echartType);

                        $(ele).on("dblclick",function(){
                            that.showEchartsModal(this );
                        })
                    }else{
                        that.showDatas();
                    }
                });
            }
        },
         getOption:function(){
            return this.options;
         },
         setOption:function(opt){
            this.options= opt;
            echarts.init(this.element).setOption(this.options);
         },
         //顯示數據列表
         showDatas:function(){
            var that=this;
            $("#showEcharts").remove();
            if(this.optionsMap.length>0){
                $("body").append("<div id=\"showEcharts\"  style='z-index: 1300;top: 60px;right:10px;width:250px;height: calc(80vh);background-color: darkgray;opacity: 0.8;position: absolute;overflow-y: scroll;' ><div>")
                var map=this.optionsMap;
                $("#showEcharts").empty();
                $("#showEcharts").append("<div style='color:red;'>圖表可右鍵顯示id或刪除圖表</div>")
                $("#showEcharts").append("<div style='color:red;'>列表可任意拖拽,雙擊關閉</div>")
                this.moveDiv($("#showEcharts"));
                $("#showEcharts").on("dblclick",function(){
                    that.removeDatesList();
                });
                for(var m=0;m<  map.length;m++){
                    var formId=map[m].formId;
                    $("#showEcharts").append("<div  id='"+formId+"'></div>")
                    $("#"+formId).css({"width":$("#showEcharts").width()-20,"height":$("#showEcharts").width()-20});
                    if(m==0||m%2==0){
                        $("#"+formId).css("background-color","yellow");
                    }else{
                        $("#"+formId).css("background-color","yellowgreen");
                    }
                    var option=map[m].option;
                    echarts.init($("#"+formId)[0]).setOption(option);
                    // 显示菜單觸發器
                    $("#"+formId).bind("contextmenu", function (event) {
                        // 禁止瀏覽器默認右鍵菜單彈出
                        event.preventDefault();
                        event.stopPropagation();
                        var obj=this;
                        $(".context-menu").remove();
                        $("body").append("<div class='context-menu' style=' display: none;" +
                            "            z-index: 1500;" +
                            "            position: absolute;" +
                            "            overflow: hidden;" +
                            "            border: 1px solid #CCC;" +
                            "            white-space: nowrap;" +
                            "            font-family: sans-serif;" +
                            "            background: #FFF;" +
                            "            color: #333;" +
                            "            border-radius: 5px;" +
                            "            padding: 0;'>" +
                            "        <div class=\"showFormId\" style='  padding: 8px 12px;" +
                            "            cursor: pointer;" +
                            "            list-style-type: none;" +
                            "            transition: all .3s ease;" +
                            "            user-select: none;border: 1px solid #c4d7e0;' formid='"+obj.id+"'>顯示id</div>" +
                            "        <div class=\"deleteData\" style='  padding: 8px 12px;" +
                            "            cursor: pointer;" +
                            "            list-style-type: none;" +
                            "            transition: all .3s ease;" +
                            "            user-select: none;border: 1px solid #c4d7e0;' formid='"+obj.id+"'>刪除圖表</div>" +
                            "    </div>");
                        // 显示菜單
                        $(".context-menu")
                            .toggle(100)
                            .css({// 在鼠標點擊位置右側显示
                                top: event.pageY + "px",
                                left: event.pageX + "px"
                            });
                            $(".showFormId").click(function(){
                                that.showDataId($(this).attr("formid"));
                            });
                            $(".deleteData").click(function(){
                                that.deleteDbData($(this).attr("formid"))
                            });
                    });


                    // 當鼠標在頁面其它地方點擊時
                    $(document).bind("mousedown", function (e) {
                        // 當點擊的位置不是菜單所示的位置時
                        if (!$(e.target).parents(".context-menu").length > 0) {
                            // 隱藏菜單
                            $(".context-menu").hide(100);
                        }
                    });

                }
            }
        },
         //移動數據列表
         moveDiv:function(obj){

            obj.bind("mousedown",start);

            function start(event){
                if(event.button==0){
                    gapX=event.clientX-obj.offset().left;
                    gapY=event.clientY-obj.offset().top;
                    //movemove事件必須綁定到$(document)上，鼠標移動是在整個屏幕上的
                    $(document).bind("mousemove",move);
                    //此處的$(document)可以改為obj
                    $(document).bind("mouseup",stop);

                }
                return false;//阻止默認事件或冒泡
            }
            function move(event){
                obj.css({
                    "left":(event.clientX-gapX)+"px",
                    "top":(event.clientY-gapY)+"px"
                });
                return false;//阻止默認事件或冒泡
            }
            function stop(){
                //解綁定
                $(document).unbind("mousemove",move);
                $(document).unbind("mouseup",stop);

            }
        },
         //取得db圖表數據
         getDatas:function(that,callBack){
            var gFormJS = nursing.createGForm();
            gFormJS.searchParamGF.sourceId = "echarts";
            gFormJS.searchParamGF.formType = "echarts";
             gFormJS.searchParamGF.hasContent = true;
            gFormJS.getGFormList(gFormJS,function(data){
                if(data&&data.length>0){
                    for(var i=0;i<data.length;i++){
                        var echartType=data[i].gForm.gformItemMap.echartType.itemValue;
                        var option= JSON.parse(data[i].gForm.gformItemMap.option.itemValue)
                        if(that.formId&&that.formId==data[i].gForm.formId){
                            that.options=option;
                            that.echartType=echartType;
                        }
                        that.optionsMap.push({"echartType":echartType,"option":option,"formId":data[i].gForm.formId});
                    }
                }
                if(callBack){
                    callBack(that);
                }
            },function(err){
                if(callBack){
                    callBack(that);
                }
            })
        },
        //清除數據
         clearData:function(){
            this.optionsMap=[];
            this.options=null;
            this.formId=null;
            this.element=null;
            this.echartType=null;
        },
         removeDatesList:function(){
            this.clearData();
            $("#showEcharts").remove();
         },
         deleteDbData:function(formId){
             var that=this;
             if(confirm("確定刪除圖表？")){
                var gFormJS = nursing.createGForm();
                gFormJS.formId=formId;
                gFormJS.formType="echarts";
                gFormJS.deleteGForm(gFormJS,function(){
                    alert("刪除成功");
                    $(".context-menu").remove();
                    that.init();

                },function(){
                    alert("刪除失敗");
                    $(".context-menu").remove();
                },true);
             }else{
                $(".context-menu").remove();
             }
        },
        showDataId:function(id){
            alert(id);
            $(".context-menu").remove();
        }
    }
})(jQuery);

