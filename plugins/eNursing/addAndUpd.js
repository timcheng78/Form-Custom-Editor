//Add和Upd特有區段
//創建動態表單元件
function createElement(formItemsTemplate, pageReady) {
    var ele_totalScore = [];
    $pFormItem = $(".pFormItemGroup");
    $pFormItem.each(function () {
        var bean = getDataset(this).bean;
        var formItemTemplate = formItemsTemplate[bean];
        dynamicForm.createElement(this, formItemTemplate);
    });
    $pFormItem = $(".pFormItem");
    $pFormItem.each(function () {
        var bean = getDataset(this).bean;
        var formItemTemplate = formItemsTemplate[bean];
        if (formItemTemplate && formItemTemplate.controlType == "totalScore") { //totalScore要最後再創建表單元件
            ele_totalScore[ele_totalScore.length] = {
                ele: this
                , formItemTemplate: formItemTemplate
            };
        } else {
            dynamicForm.createElement(this, formItemTemplate, formItemsTemplate);
        }
    });
    //totalScore要最後再創建表單元件
    for (var i = 0, len = ele_totalScore.length; i < len; i++) {
        dynamicForm.createElement(ele_totalScore[i].ele, ele_totalScore[i].formItemTemplate);
    }
    //設定規則表showRules
    console.log("===================dynamicFormTemplate");
    console.log(dynamicFormTemplate);
    if (dynamicFormTemplate.interlocking) {
        try {
            showRules = JSON.parse(dynamicFormTemplate.interlocking);
        } catch (e) {
            console.log("dynamicFormTemplate.interlocking 解析錯誤");
            console.error(e);
        }
        //建置物件的顯示規則表索引
        ruleTools.showRules_compiler();
    }
    //設定物件的驗證規則表viryRules
    if (dynamicFormTemplate.verification) {
        try {
            viryRules = JSON.parse(dynamicFormTemplate.verification.replace(/&amp;/g, '&').replace(/&quot;/g,'"'));
        } catch (e) {
            console.log("dynamicFormTemplate.verification 解析錯誤");
            console.error(e);
        }
        //建置物件的驗證規則表
        ruleTools.viryRules_compiler();
    }
    if (dynamicFormTemplate.ditto && thisTimeIsAddTime) { //是否ditto+ADD頁面，是就查詢最後一筆資料
        thisTimeIsDittoTime = true;
        if (!thisTimeIsGform) { //V3 表單的Add頁面
            //查詢該病患下此formType的最後一筆數據
            var callditto = false;
            dynamicForm.searchParamDF.formType = formType;
            dynamicForm.searchParamDF.hasContent = true;
            dynamicForm.getLastDynamicFormByEncIdV3(dynamicForm, function (result) {
                if (callditto) return; else callditto = true;
                dittoData = result;
                goPageReady(pageReady);
            }, function () {
                goPageReady(pageReady)
            });
        } else if (thisTimeIsGform) { //V4 Gform表單的Add頁面
            //查詢該病患下此formType的最後一筆數據
            var callditto = false;
            gFormJS.searchParamGF.sourceId = sourceId;
            gFormJS.searchParamGF.formType = formType;
            gFormJS.searchParamGF.hasContent = true;
            gFormJS.getLastGFormList(gFormJS, function (result) {
                if (callditto) return; else callditto = true;
                dittoData = result;
                setApiSetting(dynamicFormTemplate, pageReady);
            }, function () {
                setApiSetting(dynamicFormTemplate, pageReady);
            });
        } else {
            setApiSetting(dynamicFormTemplate, pageReady);
        }
    } else {
        setApiSetting(dynamicFormTemplate, pageReady);
    }
}

//設定Ditto的資料
function setDittoValue(successCall) {
    //api表單前呼叫總數(needAutoSetting 表單自動帶入必須為 true)
    var beforeApisCount = 0;
    for (var i = 0, len = apis.length; i < len; ++i) {
        if (apis[i].runMode.indexOf('F') > -1 && apis[i].needAutoSetting) ++beforeApisCount; //表單自動帶入=true
    }
    //ditto
    if (!dittoData || dittoData.length == 0) {
        console.log("沒有ditto資料！");
    } else if (!thisTimeIsGform) { //V3 表單的Add頁面
        setElementValue(dittoData[0].dynamicForm);
    } else if (thisTimeIsGform) { //V4 Gform表單的Add頁面
        setElementValue_GForm(dittoData[0].gForm, null);
    }
    //api表單前處理
    if (beforeApisCount>0){
        try{
            console.log("正在處理api表單前處理(包含表單自動帶入)！ count="+beforeApisCount);
            if (languageMode=="Traditional Chinese"){
                eNursing.processStatus.show("努力讀取資料中", 5000);
            }else{
                eNursing.processStatus.show("努力加载资料中", 5000);
            }
            for (var i = 0, len = apis.length; i < len; ++i) {
                if (apis[i].runMode.indexOf('F') > -1 && apis[i].needAutoSetting) { //表單自動帶入=true
                    apis[i].complete = function(apiModule) {
                        if (apiModule.resultMsg && apiModule.resultMsg.error) {
                            console.error("call api error! -> "+apiModule.apiDescription + "\n\n"+apiModule.resultMsg.msg);
                            throw apiModule.resultMsg;
                        }
                        if (--beforeApisCount <= 0) {
                            eNursing.processStatus.hide();
                            if (successCall) successCall();
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
        if (successCall) successCall();
    }
}

//处理gform相关数据
function autoProcessGFormData(paramMap, successCall, errorCall) {
    paramMap = paramMap || {};
    paramMap.versionParamMap = paramMap.versionParamMap || {
        formType: dynamicFormTemplate.formType,
        formModel: dynamicFormTemplate.formType,
        versionNo: dynamicFormTemplate.version
    };
    gFormJS.autoProcessGFormData(paramMap, function (result) {
        var gformData = result;
        if (!gformData || gformData.length == 0 || gformData[0] == null) {
            console.log("沒有gformData資料！");

        } else if (!thisTimeIsGform) { //V3 表單的Add頁面
            setElementValue(gformData[0].dynamicForm);
        } else if (thisTimeIsGform) { //V4 Gform表單的Add頁面
            gFormJS.setGFormItemMap(gformData[0].gForm);
            setElementValue_GForm(gformData[0].gForm, null);
        }
        if (successCall) {
            successCall(gformData);
        }
    }, function (e) {
        eNursing.error(e);
        if (errorCall) errorCall(e)
    });

}

//預設動態表單元件value
function setElementValue(dittoDForm) {
    if (dittoDForm != undefined) { //如果dittoDForm有值，代表是ditto的資料
        dynamicForm.items = dittoDForm.items;
        dynamicForm.formItems = dittoDForm.formItems;
    }
    if (!thisTimeIsAddTime) {
        var dt;
        if (dynamicForm.evaluationTime) {
            dt = new Date(dynamicForm.evaluationTime); //2021/03/31 11:01.320 ie有時毫秒會錯有時沒有毫秒會錯
            dt = (!dt.isValid()) ? new Date(dynamicForm.evaluationTime.split(".")[0]) : dt;
        }
        $("#datetimepicker1").val(dt.format('yyyy-MM-dd'));
        $("#datetimepicker2").val(dt.format('HH:mm'));
    }
    //拆解Gorup的Items
    var groupItems = setElementValue_GetGroupItems(dynamicFormTemplate.items, dynamicForm.formItems);
    //創建Gorup的元件
    setElementValue_CreateGroupElement(".pFormItemGroup", dynamicFormTemplate.hashItems, groupItems);
    //填值
    setElementValue_do($(".pFormItem"), dynamicFormTemplate.hashItems, dynamicForm.formItems);
}

/**
 * 預設GForm表單元件value
 * @param {gForm} dittoGForm 準備ditto的表單值，來源通常為該病人的最新的一張gForm
 * @param {gformItemMap} apiDittoGformItemMap 準備ditto的值，來源為api取得的資料
 */
function setElementValue_GForm(dittoGForm, apiDittoGformItemMap) {
    if (dittoGForm) { //如果dittoGForm有值，代表是ditto的資料
        if (!gForm) gForm = {};
        gForm.gformItems = dittoGForm.gformItems;
        gForm.gformItemMap = dittoGForm.gformItemMap;
    }
    //拆解Gorup的Items
    var groupItems = setElementValue_GetGroupItems(dynamicFormTemplate.items, apiDittoGformItemMap || gForm.gformItemMap);
    //創建Gorup的元件
    setElementValue_CreateGroupElement(".pFormItemGroup", dynamicFormTemplate.hashItems, groupItems);
    //api填值須放開dontDitto的限制 -> 放開限制
    var originalThisTimeIsDittoTime = thisTimeIsDittoTime;
    if (apiDittoGformItemMap) {
        thisTimeIsDittoTime = false;
    }
    //填值
    setElementValue_do($(".pFormItem"), dynamicFormTemplate.hashItems, apiDittoGformItemMap || gForm.gformItemMap);
    //api填值須放開dontDitto的限制 -> 復原
    if (apiDittoGformItemMap) {
        thisTimeIsDittoTime = originalThisTimeIsDittoTime;
    }
}

var StringUtils = {
    isEmpty: function (str) {
        return str === undefined || str === null || str === '';
    }
}

/**
 * [setElementValue_GetGroupItems 拆解Gorup的物件]
 * @param {gformItemMap} itemMap [formItem的json資料] [gForm.gformItemMap | dynamicForm.formItems]
 */
function setElementValue_GetGroupItems(dfItems, itemMap) {
    var items = []; //所有 group 的 itemValue (JSON)
    //找到所有 group 的 itemValue ，並轉譯為JSON
    if (dfItems != undefined) {
        for (var i = 0, len = dfItems.length; i < len; i++) {
            var dfItem = dfItems[i];
            if (dfItem.controlType === "group") {
                if (StringUtils.isEmpty(dfItem.parent) && !StringUtils.isEmpty(dfItem.children)) {
                    try {
                        if (!!itemMap[dfItem.name] && !StringUtils.isEmpty(itemMap[dfItem.name].itemValue)) {
                            items.push(JSON.parse(itemMap[dfItem.name].itemValue));
                        }
                    } catch (e) {
                        console.error("解析Group格式不正確！");
                        console.error(e);
                    }
                }
            }
        }
    }
    var itemKeys = []; //儲存打平後的 group[itemValue]
    parseItems(items);

    function parseItems(item) { //打平 group[itemValue]
        if (item.itemKey == undefined) {
            for (var key in item) {
                if (item.hasOwnProperty(key)) {
                    parseItems(item[key]);
                }
            }
        } else {
            itemKeys.push(item.itemKey);
            try {
                itemMap[item.itemKey] = item;
            } catch (e) {
                dynamicForm.formItems[item.itemKey] = item;
            }
        }
    }

    //由階層小的排到階層大的 (避免同個group因順序不同造成的錯誤) (不在乎不同group之間的順序)
    itemKeys.sort(function (a, b) {
        return a.split("-").length - b.split("-").length;
    });
    //利用JSON的key特性，將各個階層的資訊合併，並取得 parentNode groupBean groupIndex
    var itemKeyMap = {};
    for (var i = 0, len = itemKeys.length; i < len; i++) {
        var itemKey = itemKeys[i].split("-");
        var key = "", groupBean = "";
        for (var i2 = 0, len2 = itemKey.length - 1; i2 < len2; i2 += 2) {
            key += "-" + itemKey[i2] + "-" + itemKey[i2 + 1];
            groupBean += "-" + itemKey[i2];
            var parentNode = key.substring(1).split("-");
            parentNode.splice(parentNode.length - 2, 2);
            parentNode = parentNode.join("-");
            itemKeyMap[key.substring(1)] = {
                key: key.substring(1),
                parentNode: parentNode,
                groupBean: groupBean.substring(1),
                groupIndex: parseInt(itemKey[i2 + 1], 10)
            };
        }
    }
    //將JSON存入陣列 (因JSON做forEach時無法控制順序，group在create時的順序亂掉)
    itemKeys = [];
    for (var key in itemKeyMap) {
        if (itemKeyMap.hasOwnProperty(key)) {
            itemKeys.push(itemKeyMap[key]);
        }
    }
    //由階層小的排到階層大的 (同時比對groupIndex) (讓group照順率create) (不在乎不同group之間的順序)
    itemKeys.sort(function (a, b) {
        var lenA = a.key.split("-").length;
        var lenB = b.key.split("-").length;
        var idxA = a.groupIndex;
        var idxB = b.groupIndex;
        return ((lenA - lenB > 0) || ((lenA - lenB == 0) && (idxA - idxB > 0))) ? 1 : -1;
    });
    return itemKeys;
}

/**
 * [setElementValue_do 預設動態表單元件value (執行)]
 * @param {[$selecotr]} $pFormItem [p節點] ex. $(".pFormItem")
 * @param {[array]} dfHashItems [dynamicFormTemplate.hashItems模板] ex. dynamicFormTemplate.hashItems
 * @param {gformItemMap} itemMap [formItem的json資料] [gForm.gformItemMap | dynamicForm.formItems]
 */
function setElementValue_do($pFormItem, dfHashItems, itemMap) {
    $pFormItem.each(function () {
        var that = getDataset(this);
        var bean = that.bean;
        var nodeId = that.nodeid;
        if (nodeId == undefined) { //非group
            dynamicForm.setElementValue(this, itemMap[bean], dfHashItems[bean], itemMap, dfHashItems);
        } else { //group
            //設定beanName，讓id、name等關鍵屬性 = nodeId
            var formItemTemplate = $.extend(true, {}, dfHashItems[bean]);
            formItemTemplate.name = nodeId;
            dynamicForm.setElementValue(this, itemMap[nodeId], formItemTemplate, itemMap, dfHashItems);
        }
    });
}

/**
 * [setElementValue_CreateGroupElement 創建Gorup的元件]
 * @param {string} groupClass [指定的groupClass]
 * @param {[array]} dfItems [dynamicFormTemplate.items模板] ex. dynamicFormTemplate.hashItems
 * @param {[json]} groupItems   [拆解後的Gorup的items] ex. .pFormItemGroup
 */
function setElementValue_CreateGroupElement(groupClass, dfItems, groupItems) {
    //create group
    for (var i = 0, len = groupItems.length; i < len; i++) {
        var item = groupItems[i];
        var groupBean = item.groupBean.split("-");
        groupBean = groupBean[groupBean.length - 1];
        var parentNode = item.parentNode;
        var groupIndex = item.groupIndex;
        var $groupEle;
        if (parentNode != "") {
            $groupEle = $(groupClass + "[data-bean='" + groupBean + "'][data-parentnode='" + parentNode + "'][data-grouptemplate='true']");
        } else {
            $groupEle = $(groupClass + "[data-bean='" + groupBean + "'][data-grouptemplate='true']");
        }
        if ($groupEle.length > 0) {
            dynamicForm.groupCreate(groupIndex, groupBean, $groupEle, dfItems);
        } else {
            console.log("$groupEle.length==0 (groupBean=" + groupBean + ")");
        }
    }
}

//儲存 動態表單 第三版
var needCheck = true;

function dynamicFormSave(ele, successCall, errorCall) {
    ele.disabled = "disabled";
    needCheck = (dynamicForm.states == "N") ? false : (dynamicForm.states == "Y") ? true : true;
    var items = dynamicFormSave_getItems(ele); //取得 Items[]
    if (items) {
        if (items.rejected) {
            if (errorCall) {
                errorCall({"type": "rejected", "rejectedItem": items.rejectedItem});
            }
            return items.rejectedItem;
        } else {
            items = items.items;
        }
        dynamicForm.formVersionId = dynamicFormTemplate.formVersionId;
        dynamicForm.evaluationTime = new Date($("#datetimepicker1").val().replace(/-/g, "/") + " " + $("#datetimepicker2").val() + ":00").format('yyyy/MM/dd HH:mm:ss');
        dynamicForm.items = items;
        dynamicForm.totalScore = ($('#totalScoreToDb').val() == undefined) ? "0" : $('#totalScoreToDb').val();
        dynamicForm.versionNo = versionNo;
        dynamicForm.addOrUpdateDynamicForm(dynamicForm,
            function (rsDForms) {
                $("#pt-mpa-success").modal('show');
                if (successCall) {
                    $("#pt-mpa-success").modal("hide");
                    successCall(rsDForms);
                    return;
                }
                setTimeout(function () {
                    $("#pt-mpa-success").modal("hide");
                    doURL(window.localStorage["previousPage_addOrUpd"]);
                }, 1000);
            },
            function (e) {
                $("#pt-mpa-error").modal('show');
                setTimeout(function () {
                    $("#pt-mpa-error").modal("hide");
                }, 1000);
                if (errorCall) {
                    errorCall({"type": "saveError", "error": e});

                }
            }
        );
    }
}

/**
 * 儲存 動態表單 第四版 GForm
 * @param ele
 * @param successCall
 * @param errorCall
 * @param isCheckAll 是否要完整檢查並return所有未符合的item
 * @returns {*}
 */
function gFormSave(ele, successCall, errorCall, isCheckAll) {
    ele.disabled = "disabled";
    needCheck = (gFormJS.status == "N") ? false : (gFormJS.status == "Y") ? true : true;
    var items = dynamicFormSave_getItems(ele, isCheckAll); //取得 Items[]
    if (items) {
        if (items.rejected) {
            if (errorCall) {
                errorCall({"type": "rejected", "rejectedItem": items.rejectedItem});
            }
            return items.rejectedItem;
        } else {
            items = items.items;
        }
        gFormJS.formVersionId = dynamicFormTemplate.formVersionId;
        gFormJS.gformItems = items;
        gFormJS.versionNo = versionNo;
        if (gFormJS.formId == undefined || gFormJS.formId == "") {
            gFormJS.creatorId = userId;
            gFormJS.creatorName = userName;
        } else {
            gFormJS.modifyUserId = userId;
            gFormJS.modifyUserName = userName;
        }

        gFormJS.addOrUpdateGForm(gFormJS,
            function (rsGForms) {
                if (rsGForms) {
                    gFormJS.leftJoin(rsGForms[0].gForm);
                    if (typeof (multiLevel) != "undefined") {
                        window.localStorage["gForm" + multiLevel] = JSON.stringify(rsGForms[0].gForm);
                    }
                }

                //檢查是否有api調用 (表單後)
                var backApisCounts = 0;
                for (var i = 0, len = apis.length; i < len; ++i) {
                    if (apis[i].runMode.indexOf('B') > -1) {
                        ++backApisCounts;
                    }
                }
                //調用api
                if (backApisCounts > 0) {
                    try {
                        console.log("正在處理api表單後處理！ count="+backApisCounts);
                        if (languageMode=="Traditional Chinese"){
                            eNursing.processStatus.show("努力處理資料中", 5000);
                        }else{
                            eNursing.processStatus.show("努力处理资料中", 5000);
                        }
                        gForm = rsGForms[0].gForm;
                        for (var i = 0, len = apis.length; i < len; ++i) {
                            if (apis[i].runMode.indexOf('B') > -1) {
                                apis[i].complete = function(apiModule) {
                                    if (apiModule.resultMsg && apiModule.resultMsg.error) {
                                        console.error("call api error! -> "+apiModule.apiDescription + "\n\n"+apiModule.resultMsg.msg);
                                        throw apiModule.resultMsg;
                                    }
                                    if (--backApisCounts <= 0) {
                                        eNursing.processStatus.hide();
                                        if (successCall) {
                                            successCall(rsGForms);
                                            return;
                                        }
                                        doURL(window.localStorage["previousPage_addOrUpd"]);
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
                    //不須調用api
                    if (successCall) {
                        successCall(rsGForms);
                        return;
                    }
                    doURL(window.localStorage["previousPage_addOrUpd"]);
                }
            },
            function (e) {
                if (errorCall) {
                    errorCall({"type": "saveError", "error": e});

                }
            }
        );
    }
}

/**
 * 取得 Items
 * @param ele 用於檢查完成時的ele取消disabled
 * @param isCheckAll 是否要完整檢查並return所有未符合的item
 * @returns {{rejectedItem: *, rejected: boolean, rejectedItems: *[]}|{rejected: boolean, items: *[]}}
 */
function dynamicFormSave_getItems(ele, isCheckAll) {
    var formItems = {};
    var rejectedItems = [], rejectedItem = undefined;
    $(".formItem[data-upload='true']").each(function () {
        rejectedItem = undefined;
        if (needCheck && getDataset(this).required == "true") {
            ruleTools.viryElement(this); //執行驗證規則
        }
        var type = $(this).attr("type");
        var that = getDataset(this);
        var hasOther = that.id + "_otherText";
        var $hasOther = $("#" + hasOther);
        var otherValue = ($hasOther.length == 0) ? "" : $hasOther.val();
        if (!formItems[that.bean]) {
            formItems[that.bean] = {
                itemKey: that.bean
            };
        }
        var formItem = formItems[that.bean];
        if (type === "checkbox") {
            if (this.checked) {
                if (!formItem.itemValue) {
                    formItem.itemValue = this.value;
                    formItem.otherValue = otherValue;
                } else {
                    formItem.itemValue += "," + this.value;
                    formItem.otherValue += "|" + otherValue;
                }
            }
        } else if (type === "radio") {
            if (this.checked) {
                formItem.itemValue = this.value;
                formItem.otherValue = otherValue;
            }
        } else if (type === "select") {
            var $option = $(this).find("option:selected");
            if ($option.length == 0) {
                hasOther = "";
                $hasOther = $("#qwertyuiop123456789");
                formItem.itemValue = "";
                formItem.otherValue = "";
            } else {
                hasOther = getDataset($option[0]).id + "_otherText";
                $hasOther = $("#" + hasOther);
                otherValue = ($hasOther.length == 0) ? "" : $hasOther.val();
                formItem.itemValue = this.value;
                formItem.otherValue = otherValue;
            }
        } else if (type === "text") {
            formItem.itemValue = this.value;
            formItem.otherValue = otherValue;
        } else if (type === "hidden") {
            formItem.itemValue = this.value;
        } else if (type === "textarea") {
            formItem.itemValue = this.value;
        } else if (type === "textareaEditor") {
            formItem.itemValue = this.contentWindow.tinymce.get('file_content').getContent().replace(/\n/g, "");
        } else if (type === "label") {
            if ($(this).attr("data-itemvalue")) {
                formItem.itemValue = $(this).attr("data-itemvalue");
            } else {
                formItem.itemValue = this.innerHTML;
            }
            if ($(this).attr("data-othervalue")) {
                formItem.otherValue = $(this).attr("data-itemvalue");
            }
        }else if(type === "echarts"){
            //圖表 option 存入itemValue 圖表類型存入 otherValue
            formItem.itemValue =  $(this).attr("data-option");
            formItem.otherValue =  $(this).attr("data-echarttype");
        }else if(type === "csCanvas"){
            formItem.itemValue =  this.csCanvas.getValue();
            formItem.otherValue =  this.csCanvas.getOtherValue();
            formItems[that.bean+"_csCanvasParam"] = {
                "itemKey" : that.bean+"_csCanvasParam",
                "itemValue" : $(this).attr("data-cs-canvas-param"),
                "otherValue" : "",
                "nodeId" : (that.nodeid == undefined) ? "" : that.nodeid+"_csCanvasParam"
            };
        }
        formItem.nodeId = (that.nodeid == undefined) ? "" : that.nodeid;
        /*檢查條件*/
        if (needCheck && that.pass != undefined && that.pass == "false") {
            // if(that.required=="true"){
            rejectedItem = this;
            if (that.hint != undefined && that.hint != "") {
                rejectedItem.promptTips = that.title + ": " + that.hint;
            } else {
                if (languageMode == "Traditional Chinese") {
                    rejectedItem.promptTips = '欄位條件不符合';
                } else if (languageMode == "Simplified Chinese") {
                    rejectedItem.promptTips = '字段条件不符合';
                }
            }
            rejectedItems.push(rejectedItem);
            if (!isCheckAll) return false;
            // }
        }
        /*检查必填项是否已填写*/
        if (needCheck) {
            if (that.required == "true") {
                if ((!formItem.itemValue || (type === "hidden" && formItem.itemValue === " "))
                    && (
                        ((type === "radio" || type === "checkbox") && !$("input[name='" + this.name + "']:checked").length)
                        || type === "text" || type === "select" || type === "hidden" || type === "textarea" || type === "label"
                        || type === "echarts" || type === "csCanvas"
                    )
                ) {
                    rejectedItem = this;
                    rejectedItem.promptTips = that.prompttips;
                    rejectedItems.push(rejectedItem);
                    if (!isCheckAll) return false;
                } else if (($hasOther.length > 0) && ((type !== "radio" && type !== "checkbox") || this.checked) && !formItem.otherValue.split("|")[formItem.otherValue.split("|").length - 1]) {
                    rejectedItem = $hasOther[0];
                    rejectedItem.promptTips = that.prompttips + "-->其他值";
                    rejectedItems.push(rejectedItem);
                    if (!isCheckAll) return false;
                }
            }/*else if(hasOther&&!formItem.otherValue){
                rejectedItem = $hasOther;
                rejectedItem.promptTips = getDataset(this).prompttips+"-->其他值";
                return false;
            }*/
        }
    });
    //保留未pass的item
    $(".rejectedItem").each(function () {
        var pass = $(this).attr("data-pass");
        if (pass !== "false") {
            $(this).removeClass('rejectedItem');
        }
    });
    //datetime的reject項要把底下的date和time補回去
    $(".dtFormItem.rejectedItem").parent().find(".dtDateFormItem, .dtTimeFormItem").addClass("rejectedItem");
    //提示reject訊息
    if (rejectedItems.length > 0) {
        $(rejectedItems).each(function () {
            //點選或修改值之後要讓紅框消失
            var e = $(this), type = e.attr("type");
            if (type == "hidden") {
                e = e.parents("div:first");
            } else if (type == "radio" || type == "checkbox") {
                e = e.parents("div:first");
            }
            e.addClass("rejectedItem");
            if (type == "echarts") {
                e.bind("click.rejectedItem", function () {
                    $(this).removeClass("rejectedItem");
                    $(this).unbind("click.rejectedItem");
                });
            }else if (type == "radio" || type == "checkbox") {
                e.find("input").bind("click.rejectedItem", function () {
                    $(this).parents("div:first").removeClass("rejectedItem");
                    $(this).unbind("click.rejectedItem");
                });
            } else if (type != "text" && type != "textarea") {
                e.bind("keyup.rejectedItem", function () {
                    $(this).removeClass("rejectedItem");
                    $(this).unbind("keyup.rejectedItem").unbind("change.rejectedItem").unbind("click.rejectedItem");
                });
                e.bind("change.rejectedItem", function () {
                    $(this).removeClass("rejectedItem");
                    $(this).unbind("keyup.rejectedItem").unbind("change.rejectedItem").unbind("click.rejectedItem");
                });
                e.bind("click.rejectedItem", function () {
                    $(this).removeClass("rejectedItem");
                    $(this).unbind("keyup.rejectedItem").unbind("change.rejectedItem").unbind("click.rejectedItem");
                });
            } else {
                e.bind("keyup.rejectedItem", function () {
                    $(this).removeClass("rejectedItem");
                    $(this).unbind("keyup.rejectedItem").unbind("change.rejectedItem").unbind("click.rejectedItem");
                });
                e.bind("change.rejectedItem", function () {
                    $(this).removeClass("rejectedItem");
                    $(this).unbind("keyup.rejectedItem").unbind("change.rejectedItem").unbind("click.rejectedItem");
                });
            }
            //展開頁簽
            var div = e.parents('.tabcontent:first, #showPageDiv:first');
            if (div.length) {
                var divId = div.attr("id");
                if (divId !== "showPageDiv") {
                    $("#" + divId.replace(/^div/, 'btn')).click();
                }
            }
        });
        //顯示第一個reject
        rejectedItem = rejectedItems[0];
        //alert訊息
        var promptTips = "";
        if (isCheckAll) {
            var msg = "", promptArr = [], beanArr = [], i = 0, count = 5;
            //排除重複的bean 如 radio
            for (i = rejectedItems.length - 1; i >= 0; --i) {
                if (beanArr.indexOf(getDataset(rejectedItems[i]).bean) == -1) {
                    beanArr.push(getDataset(rejectedItems[i]).bean);
                } else {
                    rejectedItems.splice(i, 1);
                }
            }
            //提示前五項
            i = 0;
            while (count > 0 && rejectedItems[i]) {
                if (rejectedItems[i].promptTips) {
                    promptArr.push(rejectedItems[i].promptTips);
                    --count;
                }
                ++i;
            }
            msg = promptArr.join("\n");
            //如果要完整檢查 就提示尚餘n個檢查項目
            msg += (languageMode == "Traditional Chinese") ? "\n\n尚餘 " + rejectedItems.length + " 個檢查項目" : (languageMode == "Simplified Chinese") ? "\n\n尚余 " + rejectedItems.length + " 个检查项目" : "\n\n尚余 " + rejectedItems.length + " 个检查项目";
            alert(msg);
        } else if (rejectedItem.promptTips) {
            alert(rejectedItem.promptTips);
        }
        //捲到第一個被rejected的元件位置
        if (rejectedItem == "hidden") {
            $(rejectedItem).parents(":first").focus();
        } else {
            $(rejectedItem).focus();
        }
        //調整至適中位置
        if ($(rejectedItem).offset().top < 100) {
            var $scrollDiv = $(rejectedItem).parents(".scrollDiv:first");
            $scrollDiv.scrollTop($scrollDiv.scrollTop() - 100);
        }
        //捲到被rejected的元件位置 (解決有時候focus失效的bug)
        setTimeout(function () {
            var documentHeight = $(document).height();
            var $targetEle = $(rejectedItem);
            var offsetTop = $targetEle.offset().top;
            //如果元件被hide，offsetTop會為0，找到父層offsetTop不為0的ele為止
            while (offsetTop === 0) {
                $targetEle = $targetEle.parents(":first");
                offsetTop = $targetEle.offset().top;
            }
            //如果ele不在畫面中，要捲至該畫面
            if (offsetTop > documentHeight || offsetTop < 0) {
                $targetEle[0].scrollIntoView();
                //調整至適中位置
                var $scrollDiv = $(rejectedItem).parents(".scrollDiv:first");
                $scrollDiv.scrollTop($scrollDiv.scrollTop() - 100);
            }
            //防止提示訊息遮蔽元件的問題

            if (rejectedItem == "hidden") {
                $(rejectedItem).parents(":first").blur().mouseenter().focus();
            } else {
                $(rejectedItem).blur().mouseenter().focus();
            }
        }, 300);

        ele.disabled = "";
        return {rejected: true, rejectedItem: rejectedItem, rejectedItems: rejectedItems};
    }
    var items = [];
    for (var key in formItems) {
        if (formItems.hasOwnProperty(key) && formItems[key].itemValue !== undefined)
            items.push(formItems[key]);
    }
    //為group的formItem編寫物件結構
    var groupJson = {};
    for (var i = items.length - 1; i >= 0; i--) {
        var item = items[i];
        if (item.nodeId != "") {
            var node = item.nodeId.split("-");
            var target = groupJson;
            for (var i2 = 0, len2 = node.length; i2 < len2; i2++) {
                if (target[node[i2]] == undefined) {
                    target = target[node[i2]] = {};
                } else {
                    target = target[node[i2]];
                }
            }
            for (var key in item) {
                if (item.hasOwnProperty(key))
                    target[key] = item[key];
            }
            items.splice(i, 1);
        }
    }

    for (var key in groupJson) {
        if (groupJson.hasOwnProperty(key)) {
            var json = {};
            json[key] = groupJson[key];
            items.push({
                itemKey: key,
                itemValue: JSON.stringify(json)
            });
        }
    }
    return {rejected: false, items: items};
}

//創建group底下的元件
function createFormItemGroup(ele, groupBean) {
    var $groupEle;
    try {
        var parentNode = getDataset(ele).parentnode;
        var parent = getDataset(ele).parent;
        if (parentNode != undefined) {
            $groupEle = $(".pFormItemGroup[data-bean='" + groupBean + "'][data-parentnode='" + parentNode + "'][data-grouptemplate='true']");
        } else {
            $groupEle = $(".pFormItemGroup[data-bean='" + groupBean + "'][data-grouptemplate='true']");
        }
    } catch (e) {
        console.error(e);
        alert("不支援ele的 createFormItemGroup() 尚未完成....");
    }
    if ($groupEle.length > 0) {
        dynamicForm.groupCreate(-1, groupBean, $groupEle, dynamicFormTemplate.hashItems);
    } else {
        alert("找不到formItemGroup");
    }
}

//刪除group同層的上一個節點
function removeFormItemGroup(ele, groupBean) {
    // var $groupEle;
    // if (ele instanceof Element){
    //     var parentNode = getDataset(ele).parentnode;
    //     var parent = getDataset(ele).parent;
    //     if (parentNode!=undefined){
    //         $groupEle = $(".pFormItemGroup[data-bean='"+groupBean+"'][data-parentnode='"+parentNode+"'][data-grouptemplate!='true']:last");
    //     }else if (parent==""){
    //         $groupEle = $(".pFormItemGroup[data-bean='"+groupBean+"'][data-grouptemplate!='true']:last");
    //     }
    // }else{
    //     alert("沒給ele的 removeFormItemGroup() 尚未完成....");
    // }
    // if ($groupEle && $groupEle.length>0){
    //     $groupEle.remove();
    // }else{
    //     alert("找不到formItemGroup");
    // }
    var $groupEle;
    if (ele instanceof Element) { //pFormItemGroup
        var parentNode = $(ele).parents(".pFormItemGroup:first").attr("data-nodeid");
        if (parentNode != undefined) {
            $groupEle = $(".pFormItemGroup[data-bean='" + groupBean + "'][data-nodeid='" + parentNode + "'][data-grouptemplate!='true']");
        } else {
            $groupEle = $(".pFormItemGroup[data-bean='" + groupBean + "'][data-grouptemplate!='true']:last");
        }
    } else {
        alert("沒給ele的 removeFormItemGroup() 尚未完成....");
    }
    if ($groupEle && $groupEle.length > 0) {
        $groupEle.remove();
    } else {
        alert("找不到formItemGroup");
    }
}

//取得最後一個Group物件裡的itemKey
function getGroupLastItem(groupBean, itemKey) {
    var idx = $(".pFormItemGroup[data-bean='" + groupBean + "'][data-grouptemplate!='true']");
    idx = idx.find(".pFormItem[data-bean='" + itemKey + "']").last();
    return idx.find(".formItem");
}

/**
 * 显示其他文本框
 * @param tar
 */
function showOther(tar) {
    $("#div_" + tar.name + ", .multiId#div_" + tar.name).find("input[name='" + tar.name + "']").each(function () {
        var that = getDataset(this);
        var hasOther = that.hasother;
        var otherTitle = that.othertitle;
        var otherBackTitle = that.otherbacktitle;
        if (this.checked) {
            if (hasOther == "true") {
                document.getElementById(that.id + "_otherText").style.display = '';
                document.getElementById(that.id + "_otherText").removeAttribute('disabled');
                $("#" + that.id + "_otherText").attr("data-upload", "true");
                if (otherTitle == "true")
                    document.getElementById("label_otherTitle_" + that.id).style.display = '';
                if (otherBackTitle == "true")
                    document.getElementById("label_otherBackTitle_" + that.id).style.display = '';
            }
        } else {
            if (hasOther == "true") {
                document.getElementById(that.id + "_otherText").style.display = 'none';
                document.getElementById(that.id + "_otherText").disabled = 'disabled';
                $("#" + that.id + "_otherText").attr("data-upload", "false");
                if (otherTitle == "true")
                    document.getElementById("label_otherTitle_" + that.id).style.display = 'none';
                if (otherBackTitle == "true")
                    document.getElementById("label_otherBackTitle_" + that.id).style.display = 'none';
            }
        }
    });
}

/**
 * 顯示 橫向展開其他項
 * @param tar
 */
function showHor(tar, isVer) {
    var dataset, horArr = [], verArr = [];
    if ($(tar).attr("type") === "select") {
        $(tar).find("option").each(function () {
            dataset = getDataset(this);
            horArr = (!isVer && dataset.horizontalformitem) ? dataset.horizontalformitem.split(",") : [];
            verArr = (isVer && dataset.verticalformitem) ? dataset.verticalformitem.split(",") : [];
            //隱藏並更改upload為false
            hideHorAndVer(this, horArr, verArr);
        });
        $(tar).find("option:selected").each(function () {
            horArr = (!isVer && dataset.horizontalformitem) ? dataset.horizontalformitem.split(",") : [];
            verArr = (isVer && dataset.verticalformitem) ? dataset.verticalformitem.split(",") : [];
            //顯示並更改upload為true
            showHorAndVer(this, horArr, verArr);
        });
    } else {
        $("#div_" + tar.name + ", .multiId#div_" + tar.name).find("input[name='" + tar.name + "']").each(function () {
            dataset = getDataset(this);
            horArr = (!isVer && dataset.horizontalformitem) ? dataset.horizontalformitem.split(",") : [];
            verArr = (isVer && dataset.verticalformitem) ? dataset.verticalformitem.split(",") : [];
            if (this.checked) {
                //顯示並更改upload為true
                showHorAndVer(this, horArr, verArr);
            } else {
                //隱藏並更改upload為false
                hideHorAndVer(this, horArr, verArr);
            }
        });
    }

    //隱藏並更改upload為false
    function hideHorAndVer(that, horArr, verArr) {
        //橫向展開
        if (horArr.length > 0) {
            var $targetDiv = $("#div_" + horArr[0]);
            if ($targetDiv.length==0){ //group
                $targetDiv = $("#div_hor_"+that.id+"_"+horArr[0]);
                if ($targetDiv.length==0){
                    console.error("橫向展開找不到div->"+"#div_" + horArr[0]+" || "+"#div_hor_"+that.id+"_"+horArr[0]);
                }
            }
            ruleTools.hideEle($targetDiv.parents(".divHorFormItem:first"));
        }
        //向下展開
        if (verArr.length > 0) {
            var $targetDiv = $("#div_" + verArr[0]);
            if ($targetDiv.length==0){ //group
                $targetDiv = $("#div_ver_"+that.id+"_"+verArr[0]);
                if ($targetDiv.length==0){
                    console.error("橫向展開找不到div->"+"#div_" + verArr[0]+" || "+"#div_ver_"+that.id+"_"+verArr[0]);
                }
            }
            ruleTools.hideEle($targetDiv.parents(".divVerFormItem:first"));
        }
    }

    //顯示並更改upload為true，且照順序將div搬過來這個選項下
    function showHorAndVer(that, horArr, verArr) {
        var $thatDiv, $targetDiv;
        //橫向展開
        $thatDiv = $("#div_hor_" + that.id);
        for (var i = 0, len = horArr.length; i < len; ++i) {
            $targetDiv = $("#div_" + horArr[i]);
            if ($targetDiv.length==0){ //group
                $targetDiv = $("#div_hor_"+that.id+"_"+horArr[i]);
                if ($targetDiv.length==0){
                    console.error("橫向展開找不到div->"+"#div_" + horArr[i]+" || "+"#div_hor_"+that.id+"_"+horArr[i]);
                }
            }

            //將 replaceHorFormItemOk 改為 replaceHorFormItemRepeat
            $targetDiv.parents(".replaceHorFormItemOk:first")
                .removeClass("replaceHorFormItemOk")
                .addClass("replaceHorFormItemRepeat");
            //將div搬過來這個選項下 並將 replaceHorFormItemRepeat 改為 replaceHorFormItemOk
            $targetDiv.appendTo($thatDiv.find("#div_hor_" + that.id + "_" + horArr[i])
                .removeClass("replaceHorFormItemRepeat")
                .addClass("replaceHorFormItemOk")
            );
        }
        if (horArr.length > 0) {
            $targetDiv = $("#div_" + horArr[0]);
            if ($targetDiv.length==0){ //group
                $targetDiv = $("#div_hor_"+that.id+"_"+horArr[0]);
                if ($targetDiv.length==0){
                    console.error("橫向展開找不到div->"+"#div_" + horArr[0]+" || "+"#div_hor_"+that.id+"_"+horArr[i]);
                }
            }
            ruleTools.showEle($targetDiv.parents(".divHorFormItem:first"));
        }
        //向下展開
        $thatDiv = $("#div_ver_" + that.id);
        for (var i = 0, len = verArr.length; i < len; ++i) {
            $targetDiv = $("#div_" + verArr[i]);
            if ($targetDiv.length==0){ //group
                $targetDiv = $("#div_ver_"+that.id+"_"+verArr[i]);
                if ($targetDiv.length==0){
                    console.error("向下展開找不到div->"+"#div_" + verArr[i]+" || "+"#div_ver_"+that.id+"_"+verArr[i]);
                }
            }
            //將 replaceVerFormItemOk 改為 replaceVerFormItemRepeat
            $targetDiv.parents(".replaceVerFormItemOk:first")
                .removeClass("replaceVerFormItemOk")
                .addClass("replaceVerFormItemRepeat");
            //將div搬過來這個選項下 並將 replaceVerFormItemRepeat 改為 replaceVerFormItemOk
            $targetDiv.appendTo($thatDiv.find("#div_ver_" + that.id + "_" + verArr[i])
                .removeClass("replaceVerFormItemRepeat")
                .addClass("replaceVerFormItemOk")
            );
        }
        if (verArr.length > 0) {
            $targetDiv = $("#div_" + verArr[0]);
            if ($targetDiv.length==0){ //group
                $targetDiv = $("#div_ver_"+that.id+"_"+verArr[0]);
                if ($targetDiv.length==0){
                    console.error("向下展開找不到div->"+"#div_" + verArr[0]+" || "+"#div_ver_"+that.id+"_"+verArr[i]);
                }
            }
            ruleTools.showEle($targetDiv.parents(".divVerFormItem:first"));
        }
    }
}

/**
 * 顯示 向下展開其他項
 * @param tar
 */
function showVer(tar) {
    showHor(tar, true); //與 顯示 橫向展開其他項 同function
}

/**
 * 显示其他文本框 (select)
 * @param tar
 */
function showOther_select(tar) {
    $(tar).find("option").each(function () {
        var that = getDataset(this);
        var hasOther = that.hasother;
        var otherTitle = that.othertitle;
        var otherBackTitle = that.otherbacktitle;
        if (hasOther == "true") {
            document.getElementById(that.id + "_otherText").style.display = 'none';
            document.getElementById(that.id + "_otherText").disabled = 'disabled';
            $("#" + that.id + "_otherText").attr("data-upload", "false");
            if (otherTitle == "true")
                document.getElementById("label_otherTitle_" + that.id).style.display = 'none';
            if (otherBackTitle == "true")
                document.getElementById("label_otherBackTitle_" + that.id).style.display = 'none';
        }
    });
    var that = getDataset($(tar).find("option:selected")[0]);
    var hasOther = that.hasother;
    var otherTitle = that.othertitle;
    var otherBackTitle = that.otherbacktitle;
    if (hasOther == "true") {
        document.getElementById(that.id + "_otherText").style.display = '';
        document.getElementById(that.id + "_otherText").removeAttribute('disabled');
        $("#" + that.id + "_otherText").attr("data-upload", "true");
        if (otherTitle == "true")
            document.getElementById("label_otherTitle_" + that.id).style.display = '';
        if (otherBackTitle == "true")
            document.getElementById("label_otherBackTitle_" + that.id).style.display = '';
    }
}

/**
 * 控制顯示其他的選項內容
 * @param tar
 * @param index
 * @param state
 * @param divs
 */
function showOtherControl(tar, index, state, divs) {
    var ele = document.getElementById(getDataset(tar).bean + "_" + index);
    var items = divs.split(",");
    var targetEle;
    var titleTh = $(tar).closest("td").prev("th");
    //顯示(該元素被勾選且state為true，或沒被勾選且state為false)
    if ((ele.checked && state) || (!ele.checked && !state)) {
        titleTh.attr("rowspan", items.length + 1);
        for (var i = 0; i < items.length; i++) {
            var div = $("#div_" + items[i]);
            var td = div.closest("td");
            td.prev("th").hide();
            var parent = td.parent();
            if (parent.is("div")) {
                parent.wrap("<tr></tr>");
                td.unwrap("<div></div>");
            } else if (parent.is("tr")) {
                parent.show();
            }
            targetEle = document.getElementById(items[i]);
            if (targetEle != null && targetEle.getAttribute("type") == "text")
                targetEle.removeAttribute('disabled');
            div.find(">.formItem").each(function () {
                getDataset(this).upload = !(this.disabled == "disabled") + "";
            });
        }
    }
    //隱藏
    else {
        var click = $(tar).attr("onclick");
        if (!tar.checked && !/\d+,false/.test(click)) {
            titleTh.attr("rowspan", 1);
        } else {
            var tem = tar.id.split("_");
            if (click.indexOf(tem[tem.length - 1] + ",true") == -1) {
                titleTh.attr("rowspan", 1);
            }
        }

        for (var i = 0; i < items.length; i++) {
            var div = $("#div_" + items[i]);
            var td = div.closest("td");
            var parent = td.parent();
            if (parent.is("tr")) {
                parent.wrap("<div style='display: none'></div>");
                td.unwrap("<tr></tr>");
                targetEle = document.getElementById(items[i]);
                if (targetEle != null && targetEle.getAttribute("type") === "text") {
                    targetEle.disabled = "disabled";
                    targetEle.value = "";
                }
                div.find(">.formItem").each(function () {
                    var type = $(this).attr("type");
                    if (type === "checkbox") {
                        if (this.checked) {
                            $(this).click();
                            this.checked = false;
                        }
                    } else if (type === "radio") {
                        if (this.checked) {
                            $(this).attr("check", "true").prop('checked', false).triggerHandler('click');
                            this.checked = false;
                        }
                    }
                    getDataset(this).upload = "false";
                });
            }
        }
    }
}

/**
 * 验证用
 */
function selectOne() {

}

/**
 * 疼痛 数字量表显示图片
 */
function showFace() {

}

/**
 * 单选框支持取消选择
 * @param tar 当前点击的控件
 */
function toggleCheck(tar) {
    var checkStr = "check";
    if ($(tar).attr(checkStr) === "true") {
        tar.checked = false;
        $(tar).attr(checkStr, false);
    } else {
        $("input[name='" + tar.name + "'][" + checkStr + "='true']").attr(checkStr, false);
        $(tar).attr(checkStr, true);
    }
}

/**
 * 计算总分
 * @param tar 当前点击的控件
 * @param scoreId 存储总分数的文本框id
 * @param scoreLabelId 显示总分数的id
 * @param scoreDesc[] 分数各阶段描述(ScoreDesc对象)
 */
function countTotalScore(tar, scoreId, scoreLabelId, formToolAttribute, scoreDesc) {
    toggleCheck(tar);
    var $total = $("#" + scoreId);
    var score = $total.val();
    score = score ? score * 1 : 0;
    var checkStr = "prevCheck";
    if (tar.checked) {
        var $prev = $("input[name='" + tar.name + "'][" + checkStr + "='true']");
        if ($prev.length) {
            $prev.attr(checkStr, false);
            score -= getDataset($prev[0]).uiscore * 1;
        }
        $(tar).attr(checkStr, true);
        score += getDataset(tar).uiscore * 1;
    } else {
        $(tar).attr(checkStr, false);
        score -= getDataset(tar).uiscore * 1;
    }
    $total.val(score);
    var desc = score;
    var scoreLabel = $("#" + scoreLabelId);
    if (scoreDesc) {
        var age = dynamicForm.parent.patAge;
        for (var i = scoreDesc.length - 1; i > -1; i--) {
            var scoreEle = scoreDesc[i];
            if (eval(scoreEle.arithmetic)) {
                desc = score + " " + scoreEle.desc;
                if (!scoreEle.normal) {
                    scoreLabel.css("color", "rgb(255,0,0)");
                }
                break;
            }
        }
    }
    if (score == desc) {
        scoreLabel.css("color", "rgb(0, 0, 204)");
    }
    if (formToolAttribute) {
        var scoreRule = formToolAttribute.scoreRule;
        if (typeof formToolAttribute.scoreRule === 'string')
            scoreRule = JSON.parse(scoreRule)
        if (scoreRule.length > 0) {
            for (var j = 0; j < scoreRule.length; j++) {
                var max = $(scoreRule[j]).attr("max-limit");
                var min = $(scoreRule[j]).attr("min-limit");
                var color = $(scoreRule[j]).attr("rule-color") || $(scoreRule[j]).attr("ruleColor");
                var warn = $(scoreRule[j]).attr("warning-text");
                if (score >= min && score <= max) {
                    desc=score + " " + warn;
                    scoreLabel.css("color", color);
                    break
                }
            }
        }
    }
    scoreLabel.html(desc);
}

/**
 *  入院评估-->陪伴者-->选项专用
 * @param ele 当前点击的控件
 */
function disBrother(ele) {
    if (ele.value === '3') {
        if (ele.checked) {
            $('input[name=' + ele.name + ']').each(function () {
                $(this).attr('checked', false);
                $(this).attr('disabled', true);
                if (this.value === '2') {
                    return false;
                }
            });
        } else {
            $('input[name=' + ele.name + ']').each(function () {
                $(this).attr('disabled', false);
                if (this.value === '2') {
                    return false;
                }
            });
        }

    }
}

function getGFormLocal(patient, gFormJS, successCall) {
    gFormJS.searchParamGF.formType = gFormJS.formType;
    gFormJS.searchParamGF.sourceId = patient.patientId.trim() + ":" + patient.encId.trim();
    gFormJS.searchParamGF.hasContent = true;
    gFormJS.getGFormList(gFormJS,
        function (rsGForms) {
            setTimeout(function () {
                if (typeof (multiLevel) != "undefined" && rsGForms.length > 0) {
                    window.localStorage["gForm" + multiLevel] = JSON.stringify(rsGForms[0].gForm);
                    successCall(rsGForms[0].gForm);
                }
                if (successCall && rsGForms.length > 0) {
                    successCall(rsGForms[0]);
                }
            }, 1000);
        },
        function () {
        }
    );

}

//檢查日期時間格式
function checkDatetimeFormat(that) {
    var isReject = false;
    isReject = (isReject || checkDateFormat($("#" + that.id + "_date")[0])) ? true : false; //檢查日期格式
    isReject = (isReject || checkTimeFormat($("#" + that.id + "_time")[0])) ? true : false; //檢查時間格式

    // $(that).attr("data-pass", !isReject); //驗證沒過的話 pass要設為false
}

//檢查日期格式 驗證沒過回傳true
function checkDateFormat(that) {
    var v = that.value, dataset = getDataset(that), format = dataset.dateformat;
    var $that = $(that);
    //如果日期輸入8碼(yyyyMMdd)、6碼(yyyyMM)、4碼(MMdd)，自動補上"-"，4碼(yyyy)除外
    if (v.length === 8) { //8碼(yyyyMMdd)
        v = v.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3");
    } else if (v.length === 6) { //6碼(yyyyMM)
        v = v.replace(/^(\d{4})(\d{2})$/, "$1-$2");
    } else if (v.length === 4 && format !== "yyyy") { //4碼(MMdd)
        v = v.replace(/^(\d{2})(\d{2})$/, "$1-$2");
    }
    if (that.value !== v) {
        that.value = v;
        $that.change();
        return;
    }
    $that = ($that.hasClass('dtDateFormItem')) ? $("#" + $that.attr("id").replace(/_date$/, "")) : $that;
    var mch = format.split(/[-/.]/);
    var vArr = v.split(/[-/.]/);
    var m = "";
    //空值不算錯誤
    if (v === "") {
        ruleTools.reject($that, true, {"viryType": "checkDate", "hint": "空值不算錯誤"});
        return false;
    }
    //檢查長度是否一致
    if (vArr.length != mch.length || v.length != format.length) {
        ruleTools.reject($that, false, {"viryType": "checkDate", "hint": "格式不正確"});
        return true;
    }
    for (var i = 0, len = mch.length; i < len; ++i) {
        //檢查字串長度是否一致
        if (vArr[i].length != mch[i].length) {
            ruleTools.reject($that, false, {"viryType": "checkDate", "hint": "格式不正確"});
            return true;
        }
        //只能為數字
        if (!(/^(\d)+$/.test(vArr[i]))) {
            ruleTools.reject($that, false, {"viryType": "checkDate", "hint": "格式不正確"});
            return true;
        }
        //檢查年
        if (mch[i] === "yyyy") {
        }
        //檢查月
        if (mch[i] === "MM") {
            m = vArr[i];
            //只能是 01~12
            if ("01,02,03,04,05,06,07,08,09,10,11,12".indexOf(m) == -1) {
                ruleTools.reject($that, false, {"viryType": "checkDate", "hint": "月份只能是 01~12"});
                return true;
            }
        }
        //檢查日
        if (mch[i] === "dd") {
            var d = parseInt(vArr[i].replace(/^0+/, ""), 10); //ie低版本parseInt("08")會變成數字0
            //判斷月份與日期是否合法
            if (d < 1) {
                ruleTools.reject($that, false, {"viryType": "checkDate", "hint": "日期必須大於等於1"});
                return true;
            }
            //判斷月份與日期是否合法
            if (m !== "") {
                if ("01,03,05,07,08,10,12".indexOf(m) > -1 && d > 31) {
                    ruleTools.reject($that, false, {"viryType": "checkDate", "hint": "日期必須介於 01~31"});
                    return true;
                } else if ("04,06,09,11".indexOf(m) > -1 && d > 30) {
                    ruleTools.reject($that, false, {"viryType": "checkDate", "hint": "日期必須介於 01~30"});
                    return true;
                } else if (m == "02" && d > 29) {
                    ruleTools.reject($that, false, {"viryType": "checkDate", "hint": "日期必須介於 01~29"});
                    return true;
                }
            }
        }
    }
    ruleTools.reject($that, true, {"viryType": "checkDate", "hint": ""});
    return false;
}

//檢查時間格式 驗證沒過回傳true
function checkTimeFormat(that) {
    var v = that.value, dataset = getDataset(that), format = dataset.timeformat;
    var $that = $(that);
    //如果時間輸入4碼(HHmm)，自動補上":"
    if (v.length === 4) { //4碼(HHmm)
        v = v.replace(/^(\d{2})(\d{2})$/, "$1:$2");
    }
    if (that.value !== v) {
        that.value = v;
        $that.change();
        return;
    }
    $that = ($that.hasClass('dtTimeFormItem')) ? $("#" + $that.attr("id").replace(/_time$/, "")) : $that;
    var mch = format.split(":");
    var vArr = v.split(":");
    //空值不算錯誤
    if (v === "") {
        ruleTools.reject($that, true, {"viryType": "checkTime", "hint": "空值不算錯誤"});
        return false;
    }
    //檢查長度是否一致
    if (vArr.length != mch.length || v.length != format.length) {
        ruleTools.reject($that, false, {"viryType": "checkTime", "hint": "格式不正確"});
        return true;
    }
    for (var i = 0, len = mch.length; i < len; ++i) {
        //檢查字串長度是否一致
        if (vArr[i].length != mch[i].length) {
            ruleTools.reject($that, false, {"viryType": "checkTime", "hint": "格式不正確"});
            return true;
        }
        //只能為數字
        if (!(/^(\d)+$/.test(vArr[i]))) {
            ruleTools.reject($that, false, {"viryType": "checkTime", "hint": "格式不正確"});
            return true;
        }
        //檢查小時
        if (mch[i] === "HH") {
            var HH = parseInt(vArr[i], 10);
            if (HH < 0 || HH > 23) {
                ruleTools.reject($that, false, {"viryType": "checkTime", "hint": "小時只能是 00~23"});
                return true;
            }
        }
        //檢查分鐘
        if (mch[i] === "mm") {
            var mm = parseInt(vArr[i], 10);
            if (mm < 0 || mm > 59) {
                ruleTools.reject($that, false, {"viryType": "checkTime", "hint": "小時只能是 00~59"});
                return true;
            }
        }
    }
    ruleTools.reject($that, true, {"viryType": "checkTime", "hint": ""});
    return false;
}

//設置日期時間預設值
function setDatetimeDafaultValue(that, defaultValue, typeFormat) {
    var dataset = getDataset(that);
    var date = new Date(), limit;
    if (typeof (defaultValue) === "string") {
        try {
            defaultValue = JSON.parse(defaultValue);
        } catch (e) {
            defaultValue = {};
        }
    }
    if (dataset.datetime == "date") {
        //轉譯日期格式
        limit = transDateFormat(defaultValue.date);
        typeFormat.format = typeFormat.format.replace("mm", "MM");

        date.setYear(limit.year);
        date.setMonth(0); //避免 2月31日等狀況發生
        date.setDate(limit.date);
        date.setMonth(limit.month);
        that.value = date.format(typeFormat.format);
    } else if (dataset.datetime == "time") {
        //轉譯日期格式
        limit = transTimeFormat(defaultValue.time);
        typeFormat.format = typeFormat.format.replace("hh", "HH");
        typeFormat.format = typeFormat.format.replace("ii", "mm");

        date.setHours(limit.hour);
        date.setMinutes(limit.minute);
        that.value = date.format(typeFormat.format);
    }

}

//設置日期的 typeFormat 的 minDate maxDate (用於限縮日期控件的範圍)
function setDatetime_TypeformatLimit(that) {
    var dataset = getDataset(that);
    if (dataset.datetime == "date") {
        var minLimit = JSON.parse(dataset.minlimit).date;
        var maxLimit = JSON.parse(dataset.maxlimit).date;
        var typeFormat = JSON.parse(dataset.typeformat);
        var format = typeFormat.date;
        var dt = new Date(new Date().format("yyyy/MM/dd 00:00:00.000")); //ie有時毫秒會錯有時沒有毫秒會錯
        dt = (!dt.isValid()) ? new Date(new Date().format("yyyy/MM/dd 00:00:00")) : dt;
        //取出年月日的最小和最大值
        var limitYMD = getDateLimit(minLimit, maxLimit);
        //起始日期
        dt.setYear(limitYMD.minYear);
        dt.setMonth(0); //避免 2月31日等狀況發生
        dt.setDate(limitYMD.minDate);
        dt.setMonth(limitYMD.minMon);
        typeFormat.date.startDate = dt.format(format.format.replace("mm", "MM")); //yyyy/MM/dd
        //結束日期
        dt.setYear(limitYMD.maxYear);
        dt.setMonth(0); //避免 2月31日等狀況發生
        dt.setDate(limitYMD.maxDate);
        dt.setMonth(limitYMD.maxMon);
        typeFormat.date.endDate = dt.format(format.format.replace("mm", "MM")); //yyyy/MM/dd

        $(that).attr("data-typeformat", JSON.stringify(typeFormat));


    } else if (dataset.datetime == "time") {
        //尚未實作
    }
}

//設置日期時間範圍
function setDatetimeLimit(that) {
    var dataset = getDataset(that);
    if (dataset.datetime == "date") {
        //設置紀錄日期限制
        $(that).change(function () {
            //空值直接不判斷
            if (this.value == "") {
                ruleTools.reject($(that), true, {"viryType": "DateLimit", "hint": ""});
                return false;
            }
            //日期範圍變數宣告
            var minLimit = JSON.parse(getDataset(this).minlimit).date;
            var maxLimit = JSON.parse(getDataset(this).maxlimit).date;
            var typeFormat = JSON.parse(getDataset(this).typeformat).date;
            //取出年月日的最小和最大值
            var limitYMD = getDateLimit(minLimit, maxLimit);

            typeFormat.format = typeFormat.format.replace("mm", "MM");

            //開始判斷日期範圍
            var dateMin = new Date(new Date().format("yyyy/MM/dd 00:00:00.000")); //ie有時毫秒會錯有時沒有毫秒會錯
            dateMin = (!dateMin.isValid()) ? new Date(new Date().format("yyyy/MM/dd 00:00:00")) : dateMin;
            dateMin.setYear(limitYMD.minYear);
            dateMin.setMonth(0); //避免 2月31日等狀況發生
            dateMin.setDate(limitYMD.minDate);
            dateMin.setMonth(limitYMD.minMon);
            var dateMax = new Date(new Date().format("yyyy/MM/dd 00:00:00.000")); //ie有時毫秒會錯有時沒有毫秒會錯
            dateMax = (!dateMax.isValid()) ? new Date(new Date().format("yyyy/MM/dd 00:00:00")) : dateMax;
            dateMax.setYear(limitYMD.maxYear);
            dateMax.setMonth(0); //避免 2月31日等狀況發生
            dateMax.setDate(limitYMD.maxDate);
            dateMax.setMonth(limitYMD.maxMon);
            var fmt = typeFormat.format + "";
            var value = fmt.replace(/(yyyy)*[\-]*(MM)*[\-]*(dd)*/, function (st, y, m, d) {
                var arr = that.value.split("-");
                var i = 0;
                var st = "";
                var yyyy = new Date().format("yyyy");
                var MM = new Date().format("MM");
                var dd = new Date().format("dd");
                st += (y == undefined) ? yyyy + "/" : arr[i++] + "/";
                st += (m == undefined) ? MM + "/" : arr[i++] + "/";
                st += (d == undefined) ? dd : arr[i++];
                return st;
            });
            var dateThis = new Date(new Date(value).format("yyyy/MM/dd 00:00:00.000")); //ie有時毫秒會錯有時沒有毫秒會錯
            dateThis = (!dateThis.isValid()) ? new Date(new Date(value).format("yyyy/MM/dd 00:00:00")) : dateThis;
            if (dateMin > dateThis) {
                ruleTools.reject($(that), false, {
                    "viryType": "DateLimit",
                    "hint": "日期不能早於" + dateMin.format(typeFormat.format)
                });
                // alert("日期不能早於"+dateMin.format(typeFormat.format));
                // this.value=dateMin.format(typeFormat.format);
            } else if (dateMax < dateThis) {
                ruleTools.reject($(that), false, {
                    "viryType": "DateLimit",
                    "hint": "日期不能晚於" + dateMax.format(typeFormat.format)
                });
                // alert("日期不能晚於"+dateMax.format(typeFormat.format));
                // this.value=dateMax.format(typeFormat.format);
            } else {
                ruleTools.reject($(that), true, {"viryType": "DateLimit", "hint": ""});
            }

            //如果是datetime的話，需要再檢查time
            if ($(that).hasClass("dtDateFormItem")) {
                $("#" + that.id.replace(/_date$/, "_time")).change();
            }
        });
    } else if (dataset.datetime == "time") {
        //設置紀錄時間限制
        $(that).change(function () {
            //空值直接不判斷
            if (that.value == "") {
                ruleTools.reject($(that), true, {"viryType": "TimeLimit", "hint": ""});
                return false;
            }
            //時間範圍變數宣告
            var dateVal = null;
            var minLimit = JSON.parse(getDataset(this).minlimit).time;
            var maxLimit = JSON.parse(getDataset(this).maxlimit).time;
            var typeFormat = JSON.parse(getDataset(this).typeformat).time;
            //取出時分的最小和最大值
            var limitHM = getTimeLimit(minLimit, maxLimit);
            typeFormat.format = typeFormat.format.replace("hh", "HH");
            typeFormat.format = typeFormat.format.replace("ii", "mm");
            //開始判斷時間範圍
            var dateMin = new Date(new Date().format("yyyy/MM/dd HH:mm:00.000")); //ie有時毫秒會錯有時沒有毫秒會錯
            dateMin = (!dateMin.isValid()) ? new Date(new Date().format("yyyy/MM/dd HH:mm:00")) : dateMin;
            var dateMax = new Date(new Date().format("yyyy/MM/dd HH:mm:59.999")); //ie有時毫秒會錯有時沒有毫秒會錯
            dateMax = (!dateMax.isValid()) ? new Date(new Date().format("yyyy/MM/dd HH:mm:59")) : dateMax;
            if ($(that).hasClass("dtTimeFormItem")) { //如果是datetime的話，需要判斷日期區間
                dateVal = $("#" + that.id.replace(/_time$/, "_date")).val();
                //空值直接不判斷
                if (dateVal == "") {
                    ruleTools.reject($(that), true, {"viryType": "TimeLimit", "hint": ""});
                    return false;
                }
                var dtMinLimit = JSON.parse(getDataset(this).minlimit).date;
                var dtMaxLimit = JSON.parse(getDataset(this).maxlimit).date;
                //取出年月日的最小和最大值
                var limitYMD = getDateLimit(dtMinLimit, dtMaxLimit);
                dateMin.setYear(limitYMD.minYear);
                dateMin.setMonth(0); //避免 2月31日等狀況發生
                dateMin.setDate(limitYMD.minDate);
                dateMin.setMonth(limitYMD.minMon);

                dateMax.setYear(limitYMD.maxYear);
                dateMax.setMonth(0); //避免 2月31日等狀況發生
                dateMax.setDate(limitYMD.maxDate);
                dateMax.setMonth(limitYMD.maxMon);
            }
            dateMin.setHours(limitHM.minHour);
            dateMin.setMinutes(limitHM.minMinute);
            dateMax.setHours(limitHM.maxHour);
            dateMax.setMinutes(limitHM.maxMinute);
            var fmt = typeFormat.format + "";
            var value = fmt.replace(/(HH)*[\:]*(mm)*/, function (st, h, m) {
                var arr = that.value.split(":");
                var i = 0;
                var st = "";
                var HH = new Date().format("HH");
                var mm = new Date().format("mm");
                st += (h == undefined) ? HH + ":" : arr[i++] + ":";
                st += (m == undefined) ? mm : arr[i++];
                if (dateVal) {
                    return (new Date(dateVal.replace(/\-/g, "/")).format("yyyy/MM/dd")) + " " + st;
                } else {
                    return (new Date().format("yyyy/MM/dd")) + " " + st;
                }
            });
            var dateThis = new Date(new Date(value).format("yyyy/MM/dd HH:mm:00.000")); //ie有時毫秒會錯有時沒有毫秒會錯
            dateThis = (!dateThis.isValid()) ? new Date(new Date(value).format("yyyy/MM/dd HH:mm:00")) : dateThis;
            if (dateMin > dateThis) {
                if (dateVal) {
                    ruleTools.reject($(that), false, {
                        "viryType": "TimeLimit",
                        "hint": "時間不能早於" + dateMin.format("yyyy-MM-dd " + typeFormat.format)
                    });
                    // alert("時間不能早於"+dateMin.format("yyyy-MM-dd "+typeFormat.format));
                } else {
                    ruleTools.reject($(that), false, {
                        "viryType": "TimeLimit",
                        "hint": "時間不能早於" + dateMin.format(typeFormat.format)
                    });
                    // alert("時間不能早於"+dateMin.format(typeFormat.format));
                }
                // this.value=dateMin.format(typeFormat.format);
            } else if (dateMax < dateThis) {
                if (dateVal) {
                    ruleTools.reject($(that), false, {
                        "viryType": "TimeLimit",
                        "hint": "時間不能晚於" + dateMax.format("yyyy-MM-dd " + typeFormat.format)
                    });
                    // alert("時間不能晚於"+dateMax.format("yyyy-MM-dd "+typeFormat.format));
                } else {
                    ruleTools.reject($(that), false, {
                        "viryType": "TimeLimit",
                        "hint": "時間不能晚於" + dateMax.format(typeFormat.format)
                    });
                    // alert("時間不能晚於"+dateMax.format(typeFormat.format));
                }
                // this.value=dateMax.format(typeFormat.format);
            } else {
                ruleTools.reject($(that), true, {"viryType": "TimeLimit", "hint": ""});
            }
        });
    }
}

/**
 * [getDateLimit 取出年月日的最小和最大值]
 * @param  {[string]} minLimit [最小值 yyyy-MM-dd | -0y-0m-0d]
 * @param  {[string]} maxLimit [最大值 yyyy-MM-dd | -0y-0m-0d]
 * @return {minYear : int, minMon : int, minDate : int, maxYear : int, maxMon : int, maxDate : int}
 */
function getDateLimit(minLimit, maxLimit) {
    var limitYMD = {minYear: 0, minMon: 0, minDate: 0, maxYear: 0, maxMon: 0, maxDate: 0};
    var limit;
    //轉譯日期格式 min
    limit = transDateFormat(minLimit);
    limitYMD.minYear = limit.year;
    limitYMD.minMon = limit.month;
    limitYMD.minDate = limit.date;
    //轉譯日期格式 max
    limit = transDateFormat(maxLimit);
    limitYMD.maxYear = limit.year;
    limitYMD.maxMon = limit.month;
    limitYMD.maxDate = limit.date;
    return limitYMD;
}

/**
 * [transDateFormat 轉譯日期格式]
 * @param  {[string]} format [yyyy-MM-dd | -0y-0m-0d]
 * @return {year : int, month : int, date : int}
 */
function transDateFormat(format) {
    var limit = {year: 0, month: 0, date: 0}, match;
    //如果格式為 -0y-0m-0d 或 +0y+0m+0d
    match = format.match(/([\+\-]\d+)(\w)([\+\-]\d+)(\w)([\+\-]\d+)(\w)/);
    if (match) {
        var dt = new Date(new Date().format("yyyy/MM/dd 00:00:00.000")); //ie有時毫秒會錯有時沒有毫秒會錯
        dt = (!dt.isValid()) ? new Date(new Date().format("yyyy/MM/dd 00:00:00")) : dt;
        limit.year = dt.getFullYear() + parseInt(match[1], 10);
        limit.month = dt.getMonth() + parseInt(match[3], 10);
        limit.date = dt.getDate() + parseInt(match[5], 10);
    }
    //如果格式為 yyyy-MM-dd
    match = format.match(/([0-9]{4})(-)([0-9]{2})(-)([0-9]{2})/);
    if (match) {
        limit.year = parseInt(match[1], 10);
        limit.month = parseInt(match[3], 10) - 1;
        limit.date = parseInt(match[5], 10);
    }
    return limit;
}

/**
 * [getTimeLimit 取出時分的最小和最大值]
 * @param  {[string]} minLimit [最小值 00:00 | -0h-0m]
 * @param  {[string]} maxLimit [最大值 00:00 | -0h-0m]
 * @return {minHour : int, minMinute : int, maxHour : int, maxMinute : int}
 */
function getTimeLimit(minLimit, maxLimit) {
    var limitHM = {minHour: 0, minMinute: 0, maxHour: 0, maxMinute: 0};
    var limit;
    //轉譯日期格式 min
    limit = transTimeFormat(minLimit);
    limitHM.minHour = limit.hour;
    limitHM.minMinute = limit.minute;
    //轉譯日期格式 max
    limit = transTimeFormat(maxLimit);
    limitHM.maxHour = limit.hour;
    limitHM.maxMinute = limit.minute;
    return limitHM;
}

/**
 * [transTimeFormat 轉譯時間格式]
 * @param  {[string]} format [00:00 | -0h-0m]
 * @return {hour : int, minute : int}
 */
function transTimeFormat(format) {
    var limit = {hour: 0, minute: 0}, match;
    //如果格式為 -0y-0m-0d 或 +0y+0m+0d
    match = format.match(/([\+\-]\d+)(\w)([\+\-]\d+)(\w)/);
    if (match) {
        var dt = new Date(new Date().format("yyyy/MM/dd HH:mm:00.000")); //ie有時毫秒會錯有時沒有毫秒會錯
        dt = (!dt.isValid()) ? new Date(new Date().format("yyyy/MM/dd HH:mm:00")) : dt;
        limit.hour = dt.getHours() + parseInt(match[1], 10);
        limit.minute = dt.getMinutes() + parseInt(match[3], 10);
    }
    //如果格式為 00:00
    match = format.match(/([0-9]{2})(:)([0-9]{2})/);
    if (match) {
        limit.hour = parseInt(match[1], 10);
        limit.minute = parseInt(match[3], 10);
    }
    return limit;
}

/**
 * 設定日期時間在當機補輸時的日期限縮
 * @param {[jquery.selector]}  $eles     [要被設定的元件]
 * @param {Boolean} isMend   [是否勾選當機補輸]
 * @param  {[string]} minLimit [最小值 yyyy-MM-dd HH:mm | -0y-0m-0d -0h-0m]
 * @param  {[string]} maxLimit [最大值 yyyy-MM-dd HH:mm | -0y-0m-0d -0h-0m]
 * @ex  setDatetime_Mend($(".dtDateFormItem, .dtTimeFormItem"), true, "2020-02-01 02:20", "+1y+2m+3d -0h-0m")
 */
function setDatetime_Mend($eles, isMend, minLimit, maxLimit) {
    var json = {};
    json.date = minLimit.split(" ")[0];
    json.time = minLimit.split(" ")[1];
    var min = JSON.stringify(json);
    json.date = maxLimit.split(" ")[0];
    json.time = maxLimit.split(" ")[1];
    var max = JSON.stringify(json);
    $eles.attr({
        "data-minlimit": min,
        "data-maxlimit": max
    }).change();
    //datetime要設置date和time的limit
    $eles.each(function () {
        that = getDataset(this);
        if (that && that.datetime == "datetime") {
            $("#" + that.id + "_date" + ",#" + that.id + "_time").attr({
                "data-minlimit": min,
                "data-maxlimit": max
            }).change();
        }
        //編輯時候會判斷是否有預設minLimit, maxLimit，然後會預設他的limit為新增時的日期，因此要改變template的預設值
        if (that.bean && dynamicFormTemplate && dynamicFormTemplate.hashItems){
            if (dynamicFormTemplate.hashItems[that.bean]){
                dynamicFormTemplate.hashItems[that.bean].minLimit = min;
                dynamicFormTemplate.hashItems[that.bean].maxLimit = max;
            }
        }
    });
    if (isMend) {    //當機補輸
        //暫時還想不到應該寫什麼，先預留
    } else { //取消勾選
        //暫時還想不到應該寫什麼，先預留
    }
}

//設置datetime的hidden
function setDatetimeHidden(eleID, dateID, dateTypeFormat, timeID, timeTypeFormat, thisEleIsHidden) {
    var date = new Date();
    var ele = document.getElementById(eleID), eleDate = document.getElementById(dateID),
        eleTime = document.getElementById(timeID);
    dateTypeFormat.format = dateTypeFormat.format.replace("mm", "MM");
    timeTypeFormat.format = timeTypeFormat.format.replace("hh", "HH");
    timeTypeFormat.format = timeTypeFormat.format.replace("ii", "mm");
    if (thisEleIsHidden) {
        // var date = new Date(ele.value.replace(/\-/g, "/")).format(dateTypeFormat.format);
        // date = (date.indexOf("Na")>-1 || date.indexOf("aN")>-1) ? "" : date;
        // var time = new Date(ele.value.replace(/\-/g, "/")).format(timeTypeFormat.format);
        // time = (time.indexOf("Na")>-1 || time.indexOf("aN")>-1 || ele.value.split(" ")[1]=="") ? "" : time;
        $("#" + dateID).val(ele.value.split(" ")[0]);
        $("#" + timeID).val(ele.value.split(" ")[1]);
        //值有改變的時候，要觸發日期時間控件的change()事件
        if (localStorage[eleID + "_datetimeCheck"] !== ele.value) {
            $("#" + dateID).change();
            $("#" + timeID).change();
        }
    } else {
        var date = eleDate.value;
        var time = eleTime.value;

        var dateFmt = dateTypeFormat.format + "";
        date = dateFmt.replace(/(yyyy)*[\-]*(MM)*[\-]*(dd)*/, function (st, y, m, d) {
            var arr = eleDate.value.split("-");
            var i = 0;
            var st = "";
            var yyyy = "1990";
            var MM = "01";
            var dd = "01";
            st += (y == undefined) ? yyyy + "/" : arr[i++] + "/";
            st += (m == undefined) ? MM + "/" : arr[i++] + "/";
            st += (d == undefined) ? dd : arr[i++];
            return st;
        });
        date = new Date(date).format(dateTypeFormat.format);
        date = (date.indexOf("Na") > -1 || date.indexOf("aN") > -1) ? eleDate.value : date;

        var timeFmt = timeTypeFormat.format + "";
        time = timeFmt.replace(/(HH)*[\:]*(mm)*/, function (st, h, m) {
            var arr = eleTime.value.split(":");
            var i = 0;
            var st = "";
            var HH = "00";
            var mm = "00";
            HH = (h == undefined) ? HH : arr[i++];
            mm = (m == undefined) ? mm : arr[i++];
            HH = (/(\d){2}/.test(HH)) ? HH : null;
            mm = (/(\d){2}/.test(mm)) ? mm : null;
            return [1990, 1, 1, parseInt(HH, 10), parseInt(mm, 10), 0];
        });
        time = time.split(",");
        time = new Date(time[0], time[1], time[2], time[3], time[4], time[5]).format(timeTypeFormat.format);
        time = (date.indexOf("Na") > -1 || time.indexOf("aN") > -1) ? eleTime.value : time;

        //避免change事件的無窮迴圈
        localStorage[eleID + "_datetimeCheck"] = ele.value;

        ele.value = date + " " + time;
        $(ele).change();
    }
}

var fileTool = {};
fileTool.doUpload = function (beanName, fileInfo, fileMode, successCall, errorCall) {
    if (!fileInfo) {
        fileInfo = {
            states: "Y",
            sysModel: formType,
            storeType: "1"
        };
    }
    var fileStore = nursing.getFileStore();
    fileStore.doUploadFile("file_" + beanName, fileInfo, function (result) {
        // var fileStore = result[0].fileStore;
        // console.log(byteToString(fileStore.content));
        if (fileMode == "fileDefaultMultiple") { //基礎多檔上傳
            fileTool.fileDefaultMultiple_uploadComplete(beanName, result);
        } else if (fileMode == "fileManageUpload") { //管理功能檔案上傳
            fileTool.fileManageUpload_uploadComplete(beanName, result);
        } else {
            if (successCall) {
                successCall(result);
            }
        }

    }, function (err) {
        console.log(err);
        if (fileMode == "fileDefaultMultiple") { //基礎多檔上傳
        } else {
            if (errorCall) {
                errorCall(err);
            }
        }
    });
};
fileTool.doDownloadBase64 = function (id, fileMode, successCall, errorCall) {
    var fileInfo = [{
        id: id
    }];
    var fileStore = nursing.getFileStore();
    fileStore.downloadFile(fileInfo, function (result) {
        // var fileStore = result[0].fileStore;
        // console.log(byteToString(fileStore.content));
        if (fileMode == "fileDefaultMultiple") { //基礎多檔上傳
            successCall(result);
        }else if (fileMode == "fileManageUpload") { //管理功能檔案上傳
            successCall(result);
        } else {
            if (successCall) {
                successCall(result);
            }
        }
    }, function (err) {
        console.log(err);
        if (fileMode == "fileDefaultMultiple") { //基礎多檔上傳
        }else if (fileMode == "fileManageUpload") { //管理功能檔案上傳
        } else {
            if (errorCall) {
                errorCall(err);
            }
        }
    });
};
fileTool.doDelete = function (id, fileMode, successCall, errorCall) {
    var fileInfo = [{
        id: id
    }];
    var fileStore = nursing.getFileStore();
    fileStore.deleteFile(fileInfo, function (result) {
        // var fileStore = result[0].fileStore;
        // console.log(byteToString(fileStore.content));
        if (fileMode == "fileDefaultMultiple") { //基礎多檔上傳
            successCall(id);
        }else if (fileMode == "fileManageUpload") { //管理功能檔案上傳
            successCall(id);
        } else {
            if (successCall) {
                successCall(result);
            }
        }
    }, function (err) {
        console.log(err);
        if (fileMode == "fileDefaultMultiple") { //基礎多檔上傳
        }else if (fileMode == "fileManageUpload") { //管理功能檔案上傳
        } else {
            if (errorCall) {
                errorCall(err);
            }
        }
    });
};

fileTool.downloadFile_FileOutputStream = function (id, successCall, errorCall) {
    var st = (languageMode == "Traditional Chinese") ? "文件下載失敗" : (languageMode == "Simplified Chinese") ? "文件下载失败" : "文件下载失败";
    var fileStore = nursing.getFileStore();
    fileStore.downloadFile_FileOutputStream(id, function (result) {
        if (successCall) successCall();
    }, function (err) {
        console.log(err);
        alert(st);
        if (successCall) errorCall();
    });
    // var hasFileReader = true; //檢測是否支援 FileReader, atob, url下載等
    // try{
    //     var test = new FileReader();
    //     byteCharacters = atob("test");
    // }catch(e){
    //     hasFileReader = false;
    // }

    // if (hasFileReader){
    //     download_ie9AndLower();
    // }else{
    //     download_ie9AndLower();
    // }
    // // ie10以上 + chrome 用Blob的方法下載檔案 (反解base64後得到2進制的檔案)
    // function download_newBrowser(result){
    //     var st = (languageMode=="Traditional Chinese") ? "文件下載失敗" : (languageMode=="Simplified Chinese") ? "文件下载失败" : "文件下载失败";
    //     fileTool.doDownloadBase64(id, "fileDefaultMultiple", function(result){
    //         try{
    //             // console.log(result);
    //             var fileStore = result[0].fileStore;
    //             var blob = null; //下載用的blob
    //             var byteCharacters = atob(fileStore.content);
    //             var byteNumbers = new Array(byteCharacters.length);
    //             for (var i = 0; i < byteCharacters.length; ++i) {
    //                 byteNumbers[i] = byteCharacters.charCodeAt(i);
    //             }
    //             var byteArray = new Uint8Array(byteNumbers);
    //             //輸出成檔案下載
    //             blob = new Blob([byteArray], {
    //                 type: "octet/stream"
    //             });

    //             //觸發下載
    //             if (window.navigator && window.navigator.msSaveOrOpenBlob) { // for IE
    //                 window.navigator.msSaveOrOpenBlob(blob, fileStore.fileName);
    //             }else{
    //                 var $downloadDataHref = $('<a></a>');
    //                 // $downloadDataHref.show();
    //                 $downloadDataHref.attr({
    //                     href: window.URL.createObjectURL(blob),
    //                     download: fileStore.fileName
    //                 });
    //                 $downloadDataHref[0].click();
    //             }
    //             successCall();
    //         }catch(e){
    //             console.log(content);
    //             console.error(e);
    //             alert(st);
    //             errorCall();
    //         }
    //     }, function(){
    //         alert(st);
    //         errorCall();
    //     });

    // }
    // // ie9以下 用octet-stream的方法下載檔案
    // function download_ie9AndLower(){
    //     var st = (languageMode=="Traditional Chinese") ? "文件下載失敗" : (languageMode=="Simplified Chinese") ? "文件下载失败" : "文件下载失败";
    //     var fileStore = nursing.getFileStore();
    //     fileStore.downloadFile_ie9AndLower(id, function(result) {
    //         successCall();
    //     }, function(err) {
    //         console.log(err);
    //         alert(st);
    //         errorCall();
    //     });

    // }
};

fileTool.imgType = ["bmp", "iff", "ilbm", "tiff", "tif", "png", "gif", "jpeg", "jpg", "mng", "xpm", "psd", "sai", "psp", "ufo", "xcf", "pcx", "ppm", "WebP"];
fileTool.getFileExType = function (fileName) {
    fileName = (typeof (fileName) !== "string") ? "" : fileName;
    var fileExType = "doc";
    var fileEx = fileName.split("."); //副檔名
    fileEx = (fileEx.length == 1) ? "" : "|" + fileEx[fileEx.length - 1] + "|";

    var img = "|" + fileTool.imgType.join("|") + "|";
    if (img.indexOf(fileEx) > -1) {
        return "img";
    }
    return fileExType;
};
fileTool.byteToString = function (arr) {
    if (typeof arr === 'string') {
        return arr;
    }
    var str = '',
        _arr = arr;
    for (var i = 0; i < _arr.length; i++) {
        var one = _arr[i].toString(2),
            v = one.match(/^1+?(?=0)/);
        if (v && one.length == 8) {
            var bytesLength = v[0].length;
            var store = _arr[i].toString(2).slice(7 - bytesLength);
            for (var st = 1; st < bytesLength; st++) {
                store += _arr[st + i].toString(2).slice(2);
            }
            str += String.fromCharCode(parseInt(store, 2));
            i += bytesLength - 1;
        } else {
            str += String.fromCharCode(_arr[i]);
        }
    }
    return str;
};

fileTool.utf8ByteToUnicodeStr = function (utf8Bytes) {
    var unicodeStr = "";
    for (var pos = 0; pos < utf8Bytes.length;) {
        var flag = utf8Bytes[pos];
        var unicode = 0;
        if ((flag >>> 7) === 0) {
            unicodeStr += String.fromCharCode(utf8Bytes[pos]);
            pos += 1;

        } else if ((flag & 0xFC) === 0xFC) {
            unicode = (utf8Bytes[pos] & 0x3) << 30;
            unicode |= (utf8Bytes[pos + 1] & 0x3F) << 24;
            unicode |= (utf8Bytes[pos + 2] & 0x3F) << 18;
            unicode |= (utf8Bytes[pos + 3] & 0x3F) << 12;
            unicode |= (utf8Bytes[pos + 4] & 0x3F) << 6;
            unicode |= (utf8Bytes[pos + 5] & 0x3F);
            unicodeStr += String.fromCharCode(unicode);
            pos += 6;

        } else if ((flag & 0xF8) === 0xF8) {
            unicode = (utf8Bytes[pos] & 0x7) << 24;
            unicode |= (utf8Bytes[pos + 1] & 0x3F) << 18;
            unicode |= (utf8Bytes[pos + 2] & 0x3F) << 12;
            unicode |= (utf8Bytes[pos + 3] & 0x3F) << 6;
            unicode |= (utf8Bytes[pos + 4] & 0x3F);
            unicodeStr += String.fromCharCode(unicode);
            pos += 5;

        } else if ((flag & 0xF0) === 0xF0) {
            unicode = (utf8Bytes[pos] & 0xF) << 18;
            unicode |= (utf8Bytes[pos + 1] & 0x3F) << 12;
            unicode |= (utf8Bytes[pos + 2] & 0x3F) << 6;
            unicode |= (utf8Bytes[pos + 3] & 0x3F);
            unicodeStr += String.fromCharCode(unicode);
            pos += 4;

        } else if ((flag & 0xE0) === 0xE0) {
            unicode = (utf8Bytes[pos] & 0x1F) << 12;
            unicode |= (utf8Bytes[pos + 1] & 0x3F) << 6;
            unicode |= (utf8Bytes[pos + 2] & 0x3F);
            unicodeStr += String.fromCharCode(unicode);
            pos += 3;

        } else if ((flag & 0xC0) === 0xC0) { //110
            unicode = (utf8Bytes[pos] & 0x3F) << 6;
            unicode |= (utf8Bytes[pos + 1] & 0x3F);
            unicodeStr += String.fromCharCode(unicode);
            pos += 2;

        } else {
            unicodeStr += String.fromCharCode(utf8Bytes[pos]);
            pos += 1;
        }
    }
    return unicodeStr;
};
//基礎多檔上傳-上傳完成-合併資料並顯示
fileTool.fileDefaultMultiple_uploadComplete = function (beanName, result) {
    var fileInfos = $("#" + beanName).val();
    if (fileInfos == "") {
        fileInfos = [];
    } else {
        fileInfos = JSON.parse(fileInfos);
    }
    var fileStore = result[0].fileStore;
    var info = {
        fileName: fileStore.fileName,
        fileStoreSetId: fileStore.fileStoreSetId,
        id: fileStore.id,
        states: fileStore.states
    };
    fileInfos.push(info);
    $("#" + beanName).val(JSON.stringify(fileInfos)).change();
    // fileTool.fileDefaultMultiple_show(beanName);
};
//管理功能檔案上傳
fileTool.fileManageUpload_uploadComplete = function (beanName, result) {
    var fileInfos = $("#" + beanName).val();
    if (fileInfos == "") {
        fileInfos = [];
    } else {
        fileInfos = JSON.parse(fileInfos);
    }
    var fileStore = result[0].fileStore;
    var info = {
        fileName: fileStore.fileName,
        fileStoreSetId: fileStore.fileStoreSetId,
        id: fileStore.id,
        states: fileStore.states,
        fileInfo: $("#addFileInfo_" + beanName).val(),//檔案說明
        filePath: $("#addFilePath_" + beanName).val(),//檔案位置
    };
    fileInfos.push(info);
    $("#" + beanName).val(JSON.stringify(fileInfos)).change();
    var a=$("#uiBtn_"+beanName).find("a");
    if(a.length>0){
        a.html(fileInfos.length);
    }else{
        $("#uiBtn_"+beanName).append("<a>("+fileInfos.length+")</a>")
    }

    fileTool.hideAddFileBox(beanName);
};
//管理功能檔案上下移動調整順序
fileTool.changeFileSort=function (beanName,flag,index){

    var infos=$.extend(true,[],this.fileInfos);
    if(flag=="+"){
        if(index<infos.length-1){
            var target=infos[index];
            var findex=++index;
            var next=infos[findex];
            infos[findex]=target;
            infos[--findex]=next;

        }

    }else if(flag=="-"){
        if(index>0){
            var target=infos[index];
            var findex=--index;
            var prev=infos[findex];
            infos[findex]=target;
            infos[++findex]=prev;
        }
    }else if(flag=="top"){//置顶
        if(index>0){
            var newInfo=[];
            newInfo.push(infos[index]);
            for(var i=0;i<infos.length;i++){
                if(i!=index){
                    newInfo.push(infos[i]);
                }
            }
            infos=$.extend(true,[],newInfo);
        }
    }else if(flag=="down"){//置底
        if(index<infos.length-1){
            var newInfo=[];
            var maxIndex=infos.length-1;
            newInfo[maxIndex]=infos[index];
            var count=0;
            for(var i=0;i<infos.length;i++){
                if(i!=index){
                    newInfo[count]=infos[i];
                    count++;
                }
            }
            infos=$.extend(true,[],newInfo);
        }
    }
    $("#" + beanName).val(JSON.stringify(infos)).change();


};
//管理功能檔案排序保存
fileTool.saveFileSort=function (beanName){
   if(fileTool.fileInfos){
       for(var i=0;i<fileTool.fileInfos.length;i++){
           fileTool.fileInfos[i].fileInfo=$("#fileInfo"+beanName+i).val();
       }
       $("#" + beanName).val(JSON.stringify(fileTool.fileInfos));
   }
   if(gForm){
       gFormJS.leftJoin(gForm);
       if(gFormJS.status!="Y"){
           gFormJS.status='N';
       }
   }else{
       gFormJS.status='N';
   }

    gFormSave( $("#" + beanName)[0], function(rsGForms) {
        gFormJS.leftJoin(rsGForms);
        alert((languageMode == "Traditional Chinese") ?"存檔成功":"保存成功");
        fileTool.hideFileListBox(beanName);
    })
};
//管理功能檔案查閱
fileTool.fileManageUpload_viewFile=function(beanName,index,that){

   var fileInfo= fileTool.fileInfos[index];

   $(that).attr("disabled",true);
   if(fileTool.getFileExType(fileInfo.fileName) != "img") {
       fileTool.downloadFile_FileOutputStream(fileInfo.id, function (result) {
           $(that).attr("disabled",false);
       }, function (err) {
           $(that).attr("disabled",false);
       });
   }else{//圖片
       var info = {
           "fileId": fileInfo.id,
           "fileName": fileInfo.fileName,
           "divId": "viewDiv_" + fileInfo.id
       };
       fileTool.showDefaultImg(info, "fileManageUpload", function (result) {
           $(that).attr("disabled",false);
       }, function (err) {
           $(that).attr("disabled",false);
       });
   }
}
//管理功能檔案刪除
fileTool.fileManageUpload_delete=function(beanName,index){
    var fileInfo= fileTool.fileInfos[index];
    var st = (languageMode == "Traditional Chinese") ? "確定要刪除" + fileInfo.fileInfo + "嗎？"
        : (languageMode == "Simplified Chinese") ? "确定要删除" + fileInfo.fileInfo + "吗？"
            : "确定要删除" + fileInfo.fileInfo + "吗？";
    if (confirm(st)) {
        fileTool.doDelete(fileInfo.id, "fileManageUpload", function (delId) {
            fileTool.fileManageUpload_deleteComplete(beanName, delId);
        }, function (err) {
        });
    }
}
//管理功能檔案顯示
fileTool.fileManageUpload_show = function (beanName) {
    var fileInfos = $("#" + beanName).val();
    var fileBody= $("#fileDatas_" + beanName);
    fileBody.empty();
    try {
        if (fileInfos == "") {
            fileInfos = [];
        } else {
            fileInfos = JSON.parse(fileInfos);
        }
        console.log(fileInfos);
        fileTool.fileInfos=fileInfos;
        for(var i=0;i<fileInfos.length;i++){
            var info = fileInfos[i];
            var $tr=$("<tr>" +
               "<td style='width: calc(8vw);'>"+(i+1)+"</td>" +
               "<td style='width: calc(40vw);'> <input type='text' style='width: calc(39vw);' id='fileInfo"+beanName+i+"' value='"+info.fileInfo+"' /></td>" +
               "<td style='width: calc(16vw);'>" +
                   "<button title='置顶' type='button' class='btn' style='background-color: #6C6F7F;color: #ffffff;' onclick=\"fileTool.changeFileSort('"+beanName+"','top','"+i+"')\">∆</button>" +
                   "&nbsp;&nbsp;&nbsp;&nbsp;" +
                   "<button type='button' class='btn' style='background-color: #CDCDEF;' onclick=\"fileTool.changeFileSort('"+beanName+"','-','"+i+"')\">▲</button>" +
                   "&nbsp;&nbsp;&nbsp;&nbsp;" +
                   "<button type='button' class='btn' style='background-color: #CDCDEF;' onclick=\"fileTool.changeFileSort('"+beanName+"','+','"+i+"')\">▼</button>" +
                   "&nbsp;&nbsp;&nbsp;&nbsp;" +
                   "<button title='置底' type='button' class='btn' style='background-color: #6C6F7F;color: #ffffff;' onclick=\"fileTool.changeFileSort('"+beanName+"','down','"+i+"')\">∇</button>" +
               "</td>" +
               "<td style='width: calc(8vw);'><button type='button' class='btn' style='background-color: deeppink;color: white;' onclick=\"fileTool.fileManageUpload_viewFile('"+beanName+"','"+i+"',this)\">"+((languageMode == "Traditional Chinese") ? "查閱" : (languageMode == "Simplified Chinese") ? "预览" : "预览")+"</button></td>" +
               "<td style='width: calc(8vw);'><button type='button' class='btn' style='background-color: darkorange;color: white;' onclick=\"fileTool.fileManageUpload_delete('"+beanName+"','"+i+"')\">"+((languageMode == "Traditional Chinese") ? "刪除" : (languageMode == "Simplified Chinese") ? "删除" : "删除")+"</button></td>" +
               "</tr>");
            fileBody.append($tr)
        }

    } catch (e) {
       fileBody.append("<tr><td><font color='#FF2222'>顯示檔案出錯，請截圖並聯絡IT部門處理</font>");
       fileBody.append("<br/>fileTool.fileManageUpload_show -> beanName=" + beanName);
       fileBody.append("<br/>" + e.stack.replace(/(\n    )/g, "<br/>&nbsp;&nbsp;&nbsp;&nbsp;"));
       fileBody.append("</td></tr>");
        console.error("fileTool.fileManageUpload_show -> beanName=" + beanName);
        console.error(e);
        return;
    }

};
//管理功能檔案上傳-刪除完成-刪除資料並顯示
fileTool.fileManageUpload_deleteComplete = function (beanName, delId) {
    var st = (languageMode == "Traditional Chinese") ? "文件刪除成功" : (languageMode == "Simplified Chinese") ? "文件删除成功" : "文件删除成功";
    alert(st);
    var fileInfos = $("#" + beanName).val();
    if (fileInfos == "") {
        fileInfos = [];
    } else {
        fileInfos = JSON.parse(fileInfos);
    }
    console.log(delId);
    for (var i = 0, len = fileInfos.length; i < len; ++i) {
        if (fileInfos[i].id == delId) {
            fileInfos.splice(i, 1);
            break;
        }
    }
    $("#" + beanName).val(JSON.stringify(fileInfos)).change();
    var a=$("#uiBtn_"+beanName).find("a");
    if(a.length>0){
        a.html(fileInfos.length);
    }else{
        $("#uiBtn_"+beanName).append("<a>("+fileInfos.length+")</a>")
    }

};
/**
 *顯示檔案夾
 */
fileTool.showFileListBox=function(beanName){
    if($("#"+beanName).val()){
        this.fileManageUpload_show(beanName);
    }
    $("#fileListLayer_"+beanName+",#fileListBox_"+beanName).show();
};
/**
 *新增檔案
 */
fileTool.showAddFileBox=function(beanName){
    $("#addFileLayer_"+beanName+",#addFileBox_"+beanName).show();
    $("#file_"+beanName).change(function (){
        if(this.value){
            $("#addFilePath_"+beanName).val(this.value);
        }
    });
};
/**
 *取消新增檔案
 */
fileTool.hideAddFileBox=function(beanName){
    $("#addFileLayer_"+beanName+",#addFileBox_"+beanName).hide();
    $("#addFileBox_"+beanName).find("input").val("");

};
/**
 *隱藏檔案夾
 */
fileTool.hideFileListBox=function(beanName){
    $("#fileListLayer_"+beanName+",#fileListBox_"+beanName+",#addFileLayer_"+beanName+",#addFileBox_"+beanName).hide()
    $("#addFileBox_"+beanName).find("input").val("");
};
//基礎多檔上傳-刪除完成-刪除資料並顯示
fileTool.fileDefaultMultiple_deleteComplete = function (beanName, delId) {
    var st = (languageMode == "Traditional Chinese") ? "文件刪除成功" : (languageMode == "Simplified Chinese") ? "文件删除成功" : "文件删除成功";
    alert(st);
    var fileInfos = $("#" + beanName).val();
    if (fileInfos == "") {
        fileInfos = [];
    } else {
        fileInfos = JSON.parse(fileInfos);
    }
    console.log(delId);
    for (var i = 0, len = fileInfos.length; i < len; ++i) {
        if (fileInfos[i].id == delId) {
            fileInfos.splice(i, 1);
            break;
        }
    }
    $("#" + beanName).val(JSON.stringify(fileInfos)).change();
    // fileTool.fileDefaultMultiple_show(beanName);
};
//基礎多檔上傳-顯示檔名、下載、刪除按鈕
fileTool.fileDefaultMultiple_show = function (beanName) {
    var fileInfos = $("#" + beanName).val();
    var $fileDiv = $("#fileDiv_" + beanName);
    $fileDiv.empty();
    try {
        if (fileInfos == "") {
            fileInfos = [];
        } else {
            fileInfos = JSON.parse(fileInfos);
        }
    } catch (e) {
        $fileDiv.append("<font color='#FF2222'>顯示檔案出錯，請截圖並聯絡IT部門處理</font>");
        $fileDiv.append("<br/>fileTool.fileDefaultMultiple_show -> beanName=" + beanName);
        $fileDiv.append("<br/>" + e.stack.replace(/(\n    )/g, "<br/>&nbsp;&nbsp;&nbsp;&nbsp;"));
        console.error("fileTool.fileDefaultMultiple_show -> beanName=" + beanName);
        console.error(e);
        return;
    }
    for (var i = 0, len = fileInfos.length; i < len; ++i) {
        var info = fileInfos[i];
        var $label = $("<label class='fileLabelFormItem'>" + info.fileName + "</label>");
        var st = "";
        /**基礎圖片start**/
        var $viewDiv = $("<div class='fileViewDivFormItem' id='viewDiv_" + info.id + "' style='display: none;'></div>");
        st = (languageMode == "Traditional Chinese") ? "預覽" : (languageMode == "Simplified Chinese") ? "预览" : "预览";
        var $viewBtn = $("<input class='fileViewBtnFormItem' type='button' value='" + st + "' fileId='" + info.id + "' fileName='" + info.fileName + "' id='viewBtn_" + info.id + "' act='show'/>");
        $viewBtn.click(function () {
            if ($(this).attr("act") == "show") {
                $(this).attr("act", "hide");
                st = (languageMode == "Traditional Chinese") ? "隱藏" : (languageMode == "Simplified Chinese") ? "隐藏" : "隐藏";
                $(this).val(st);
                var info = {
                    "fileId": $(this).attr("fileId"),
                    "fileName": $(this).attr("fileName"),
                    "divId": "viewDiv_" + $(this).attr("fileId")
                };
                fileTool.showDefaultImg(info, "fileDefaultMultiple", function (result) {
                }, function (err) {
                });
            } else {
                $(this).attr("act", "show");
                st = (languageMode == "Traditional Chinese") ? "預覽" : (languageMode == "Simplified Chinese") ? "预览" : "预览";
                $(this).val(st);
                $("#viewDiv_" + $(this).attr("fileId")).hide();
            }
            return false;
        });
        /**基礎圖片end**/
        /**一般下載start**/
        st = (languageMode == "Traditional Chinese") ? "下載" : (languageMode == "Simplified Chinese") ? "下载" : "下载";
        var $dldBtn = $("<input class='fileDldBtnFormItem' type='button' value='" + st + "' fileId='" + info.id + "' fileName='" + info.fileName + "'/>");
        $dldBtn.click(function () {
            fileTool.downloadFile_FileOutputStream($(this).attr("fileId"), function (result) {
            }, function (err) {
            });
            return false;
        });
        st = (languageMode == "Traditional Chinese") ? "刪除" : (languageMode == "Simplified Chinese") ? "删除" : "删除";
        /**一般下載end**/
        /**一般刪除start**/
        var $delBtn = $("<input class='fileDelBtnFormItem' type='button' value='" + st + "' fileId='" + info.id + "'/>");
        $delBtn.attr("fileName", info.fileName);
        $delBtn.click(function () {
            var st = (languageMode == "Traditional Chinese") ? "確定要刪除" + $(this).attr("fileName") + "嗎？" : (languageMode == "Simplified Chinese") ? "确定要删除" + $(this).attr("fileName") + "吗？" : "确定要删除" + $(this).attr("fileName") + "吗？";
            if (confirm(st)) {
                fileTool.doDelete($(this).attr("fileId"), "fileDefaultMultiple", function (delId) {
                    fileTool.fileDefaultMultiple_deleteComplete(beanName, delId);
                }, function (err) {
                });
            }
            return false;
        });
        /**一般刪除end**/
        if (fileTool.getFileExType(info.fileName) != "img") {
            $fileDiv.append($label, "&nbsp;&nbsp;", $dldBtn, $delBtn, "<br/>");
        } else {
            $fileDiv.append($viewDiv, $label, "&nbsp;&nbsp;", $viewBtn, $dldBtn, $delBtn, "<br/>");
        }
    }
};

/**
 * 顯示基礎圖片
 * @param  {[json]} info {
        "fileId"   : 檔案ID,
        "fileName" : 檔名,
        "divId"    : 被顯示的divId
    }
 * @param  {[string]} fileMode    [檔案元件類型]
 * @param  {[functionCall]} successCall
 * @param  {[functionCall]} errorCall
 * @return {[functionCall]}
 */
fileTool.showDefaultImg = function (info, fileMode, successCall, errorCall) {
    var fileInfo = [{
        id: info.fileId
    }];
    console.log(fileInfo);
    var fileStore = nursing.getFileStore();
    fileStore.downloadFile(fileInfo, function (result) {
        // var fileStore = result[0].fileStore;
        console.log(result);
        if (fileMode == "fileDefaultMultiple") { //基礎多檔上傳
            var $div = $("#" + info.divId);
            var $img = $("<img class='fileViewImgFormItem' style='max-width: 100%;'></img>");
            $img.attr("src", "data:image/" + fileTool.imgType[fileTool.imgType.indexOf(info.fileName.split(".")[info.fileName.split(".").length - 1])] + ";base64, " + result[0].fileStore.content);
            var st = (languageMode == "Traditional Chinese") ? "點擊變換大小" : (languageMode == "Simplified Chinese") ? "点击变换大小" : "点击变换大小";
            $img.attr("title", info.fileName + "\n(" + st + ")");
            $img.attr("alt", "error");
            $img.attr("wd", "50%");
            $img.click(function () {
                var wd = $(this).attr("wd");
                if (wd === "50%") {
                    wd = "75%";
                } else if (wd === "75%") {
                    wd = "100%";
                } else if (wd === "100%") {
                    wd = "50%";
                }
                $(this).attr("wd", wd);
                $(this).width(wd);
            });
            $img.width("50%");
            $div.empty();
            $div.append($img);
            $div.show();
            successCall(result);
        } else if(fileMode=="fileManageUpload") {
            var $divLayer = $("<div class='Layer imageLayer' id='Layer_"+info.divId+"'></div>"  );
            var $divImg = $("<div class='fileBox imageStyle' id='image_"+info.divId+"'></div>"  );
            var $img = $("<img class='fileViewImgFormItem' style='max-width: 100%;'></img>");
            $img.attr("src", "data:image/" + fileTool.imgType[fileTool.imgType.indexOf(info.fileName.split(".")[info.fileName.split(".").length - 1])] + ";base64, " + result[0].fileStore.content);
            var st = (languageMode == "Traditional Chinese") ? "點擊變換大小" : (languageMode == "Simplified Chinese") ? "点击变换大小" : "点击变换大小";
            $img.attr("title", info.fileName + "\n(" + st + ")");
            $img.attr("alt", "error");
            $img.attr("wd", "50%");
            $img.click(function () {
                var wd = $(this).attr("wd");
                if (wd === "50%") {
                    wd = "75%";
                } else if (wd === "75%") {
                    wd = "100%";
                } else if (wd === "100%") {
                    wd = "50%";
                }
                $(this).attr("wd", wd);
                $(this).width(wd);
            });
            $img.width("50%");
            $divLayer.empty();
            $divLayer.click(function(){
                $($divImg).remove();
                $($divLayer).remove();
            });
            $divImg.append($img);
            $("body").append($divLayer).append($divImg);
            $divLayer.show();
            $divImg.show();
            $(document).keyup(function(event){
                if(event.keyCode==27){
                    $($divImg).remove();
                    $($divLayer).remove();
                }
            });
            successCall(result);
        } else {
            if (successCall) {
                successCall(result);
            }
        }
    }, function (err) {
        console.log(err);
        if (fileMode == "fileDefaultMultiple") { //基礎多檔上傳
        } else {
            if (errorCall) {
                errorCall(err);
            }
        }
    });
};



// 設定 keydown & blur function 條件式判斷
/**
 {
      "type": "類型",
      "condition": (regex),
      "option": {
        "min": 0,
        "max": 0
      }
    }
 **/
function settingCondition(that, json) {
    var func = that.value;
    var type = json.type;
    var hint = json.hint;
    if (hint != "") {
        $(that).attr('data-hint', hint);
    }
    var re = eval(json.condition);
    if (!re.test(func)) {
        $(that).parent().addClass("rejectedItem");
        $(that).focus();
        $(that).attr('data-pass', 'false');
    } else {
        $(that).parent().removeClass("rejectedItem");
        $(that).attr('data-pass', 'true');
    }
    if (type == 'number') {
        var min = parseInt(json.option.min, 10);
        var max = parseInt(json.option.max, 10);
        if (min != 0 && max != 0) {
            if (func > max || func < min) {
                $(that).parent().addClass("rejectedItem");
                $(that).focus();
                $(that).attr('data-pass', 'false');
            }
        } else if (min != 0) {
            if (func < min) {
                $(that).parent().addClass("rejectedItem");
                $(that).focus();
                $(that).attr('data-pass', 'false');
            }
        } else if (max != 0) {
            if (func > max) {
                $(that).parent().addClass("rejectedItem");
                $(that).focus();
                $(that).attr('data-pass', 'false');
            }
        } else {
            $(that).attr('data-pass', 'true');
        }
    }
}


//物件的顯示規則表
var showRules = [];
//物件的顯示規則表索引
var showRules_idx = {};
//物件的顯示規則表_元件value表
var showRules_val = {};
//物件的驗證規則表
var viryRules = [];
//物件的驗證規則表索引 (ifs: 觸發條件, events: 驗證規則)
var viryRules_idx = {"ifs": {}, "events": {}};
//物件的驗證規則表_元件value表
var viryRules_val = {};
var ruleTools = {};

//建置物件的顯示規則表索引
ruleTools.showRules_compiler = function () {
    showRules_idx = {};
    showRules_val = {};
    console.log("=======showRules========");
    console.log(showRules);
    for (var i = 0, len = showRules.length; i < len; ++i) {
        var vifs = showRules[i].ifs;
        for (var i2 = 0, len2 = vifs.length; i2 < len2; ++i2) {
            var bean = vifs[i2].bean;
            if (showRules_idx[bean] == undefined) {
                showRules_idx[bean] = [];
                showRules_val[bean] = [];
            }
            if (showRules_idx[bean].indexOf(i) < 0) {
                showRules_idx[bean].push(i);
            }
        }
    }
    console.log("=======showRules_idx========");
    console.log(showRules_idx);
    console.log("=======showRules_val========");
    console.log(showRules_val);
};
//依照現行所有物件狀態判斷並執行顯示規則
ruleTools.showRules_runAll = function () {
    for (var bean in showRules_idx) {
        var $text = $("#" + bean);
        var $rdoOrChk = $("#" + bean + "_0");
        if ($text.length > 0)
            ruleTools.showElement($text[0]);
        else if ($rdoOrChk.length > 0)
            ruleTools.showElement($rdoOrChk[0]);
        else
            console.error("找不到這個bean --> " + bean);
    }
};
//抄寫元件value至viryRules_val (radio, checkbox)
ruleTools.writeRulesIf = function (that, rulesIf) {
    if (that.type == "radio") {
        if (!that.checked) {
            if (rulesIf[getDataset(that).bean].indexOf(that.value) > -1) {
                rulesIf[getDataset(that).bean] = [];
            }
        } else
            rulesIf[getDataset(that).bean] = [that.value];
    } else if (that.type == "checkbox") {
        if (!that.checked) {
            if (rulesIf[getDataset(that).bean].indexOf(that.value) > -1) {
                rulesIf[getDataset(that).bean].splice(rulesIf[getDataset(that).bean].indexOf(that.value), 1);
            }
        } else {
            if (rulesIf[getDataset(that).bean].indexOf(that.value) == -1) {
                rulesIf[getDataset(that).bean].push(that.value);
            }
        }
    } else if (that.type == "text" || $(that).attr("type") == "select") {
        rulesIf[getDataset(that).bean] = [that.value];
    }
    // console.log(rulesIf);
};


//查出rules.ifs裡面各個條件為true或false -> countsIf
ruleTools.checkRules = function (vifs, rules_val) {
    var countsIf = [];
    for (var i2 = 0, len2 = vifs.length; i2 < len2; ++i2) {
        var vif = vifs[i2];
        var datatype = vif.datatype;    //資料型態(number / string / checked)
        var bean = vif.bean;            //主要元件(元件值會影響次要元件的顯示與否)
        var ifOperator = vif.operator;  //邏輯 (||,&&)
        if (datatype == "string") {
            var v = rules_val[bean], min = vif.min, max = vif.max;
            if (min == undefined && max == undefined) {
                console.error("當if.datatype為string時，應設置if.min或if.max\nbean : " + bean + "\nvalue: " + rules_val[bean] + "\nmin  : " + vif.min + "\nmax  : " + vif.max);
                countsIf[i2] = false;
                continue;
            }
            countsIf[i2] = (max == undefined) ? v >= min : (min == undefined) ? v <= max : v >= min && v <= max;
        } else if (datatype == "number") {
            var v = parseFloat(rules_val[bean]), min = parseFloat(vif.min), max = parseFloat(vif.max);
            if (isNaN(v) || (isNaN(min) && isNaN(max))) {
                console.error("當if.datatype為number時，應設置if.min及if.max，且應該為數字(包含value)\nbean : " + bean + "\nvalue: " + rules_val[bean] + "\nmin  : " + vif.min + "\nmax  : " + vif.max);
                countsIf[i2] = false;
                continue;
            }
            countsIf[i2] = (isNaN(max)) ? v >= min : (isNaN(min)) ? v <= max : v >= min && v <= max;
        } else if (datatype == "checked") {
            countsIf[i2] = (ifOperator == "||") ? false : true; // "||"預設為false，"&&"預設為true
            var uiValue = vif.uiValue;
            for (var i3 = 0, len3 = uiValue.length; i3 < len3; ++i3) {
                if (ifOperator == "||" && rules_val[bean] && rules_val[bean].indexOf(uiValue[i3]) > -1) {
                    countsIf[i2] = true;
                    i3 = len3;
                } else if (ifOperator == "&&" && rules_val[bean] && rules_val[bean].indexOf(uiValue[i3]) == -1) {
                    countsIf[i2] = false;
                    i3 = len3;
                }
            }
        } else {
            console.error("尚無支援此datatype:" + datatype);
            countsIf[i2] = false;

        }
    }
    return countsIf;
};


/**
 * ##查出eifs.ifs裡面各個條件為true或false -> countsIf2
 * ####回傳true表示符合驗證規則
 * ####如x=5, 0＜x＜10 -> true
 * @param v
 * @param eifs
 * @returns {boolean|*[]}
 */
ruleTools.viryRules = function (v, eifs) {
    var countsIf2 = [];
    for (var i2 = 0, len2 = eifs.length; i2 < len2; ++i2) {
        var eif = eifs[i2];
        var checktype = eif.checktype;
        if (checktype == "string") {
            var min = eif.min, max = eif.max;
            if (min == undefined && max == undefined) {
                console.error("當ifs.checktype為string時，應設置ifs.min或ifs.max\nvalue: " + v + "\nmin  : " + eif.min + "\nmax  : " + eif.max);
                countsIf2[i2] = false;
                continue;
            }
            countsIf2[i2] = (max == undefined) ? v >= min : (min == undefined) ? v <= max : v >= min && v <= max;
        } else if (checktype == "number") {
            var cf = ruleTools.func.checkFloat; //func.檢查是否為 實數float (格式正確回傳false)
            if (!cf(v) || (!cf(eif.min) && !cf(eif.max))) { //不為數字的話
                console.error("當ifs.checktype為number時，應設置ifs.min或ifs.max，且應該為數字\nvalue: " + v + "\nmin  : " + eif.min + "\nmax  : " + eif.max);
                countsIf2[i2] = false;
                continue;
            }
            v = parseFloat(v);
            var min = parseFloat(eif.min), max = parseFloat(eif.max);
            countsIf2[i2] = (isNaN(max)) ? v >= min : (isNaN(min)) ? v <= max : v >= min && v <= max;
        } else if (checktype == "int") {
            var ci = ruleTools.func.checkInt; //func.檢查是否為 實數int (格式正確回傳false)
            if (!ci(v) || (!ci(eif.min) && !ci(eif.max))) { //不為數字的話
                console.error("當ifs.checktype為int時，應設置ifs.min或ifs.max，且應該為整數(不能有小數點)\nvalue: " + v + "\nmin  : " + eif.min + "\nmax  : " + eif.max);
                countsIf2[i2] = false;
                continue;
            }
            v = parseInt(v, 10);
            var min = parseInt(eif.min, 10), max = parseInt(eif.max, 10);
            countsIf2[i2] = (isNaN(max)) ? v >= min : (isNaN(min)) ? v <= max : v >= min && v <= max;
        } else if (checktype == "float") {
            var cf = ruleTools.func.checkFloat; //func.檢查是否為 float (格式正確回傳false)
            if (!cf(v) || (!cf(eif.min) && !cf(eif.max))) { //不為數字的話
                console.error("當ifs.checktype為float時，應設置ifs.min或ifs.max，且應該為數字\nvalue: " + v + "\nmin  : " + eif.min + "\nmax  : " + eif.max);
                countsIf2[i2] = false;
                continue;
            }
            //檢查小數點數量
            var vDotCount = v.split(".")[1];
            vDotCount = (vDotCount) ? vDotCount.length : 0;
            var dotCount = 0;
            var minDot = eif.min.split(".")[1];
            var maxDot = eif.max.split(".")[1];
            dotCount = (minDot && minDot.length > dotCount) ? minDot.length : dotCount;
            dotCount = (maxDot && maxDot.length > dotCount) ? maxDot.length : dotCount;
            if (vDotCount > dotCount) {
                console.error("當ifs.checktype為float時，小數點的數量應小於min Or max的小數點數量 \nvalue: " + v + "\nmin  : " + eif.min + "\nmax  : " + eif.max);
                countsIf2[i2] = false;
                continue;
            }
            v = parseInt(v, 10);
            var min = parseInt(eif.min, 10), max = parseInt(eif.max, 10);
            countsIf2[i2] = (isNaN(max)) ? v >= min : (isNaN(min)) ? v <= max : v >= min && v <= max;
        } else if (checktype == "regex") {
            countsIf2[i2] = (new RegExp(eif.condition)).test(v);
        } else if (checktype == "array") { //在集合裡表示命中規則
            countsIf2[i2] = eif.condition.split(",").indexOf(v) > -1;
        } else if (checktype == "function") {
            try {
                countsIf2[i2] = (ruleTools.func[eif.condition]) ? ruleTools.func[eif.condition](v) : eval(eif.condition + "('" + v + "')");
            } catch (e) {
                console.error("checktype=func, condition=" + eif.condition);
                console.error(e);
            }
        } else {
            console.error("尚無支援此datatype:" + checktype);
            return false;
        }
    }
    return countsIf2;
};

//條件驗證function
ruleTools.func = {};
//func.tw身分證字號格式的驗證 (格式正確回傳true)
ruleTools.func.checkTwID = function (id) {
    //建立字母分數陣列(A~Z)
    var city = [1, 10, 19, 28, 37, 46, 55, 64, 39, 73, 82, 2, 11, 20, 48, 29, 38, 47, 56, 65, 74, 83, 21, 3, 12, 30];
    id = id.toUpperCase();
    //使用「正規表達式」檢驗格式
    if (id.search(/^[A-Z](1|2)\d{8}$/i) == -1) {
        return false;
    } else {
        //將字串分割為陣列(IE必需這麼做才不會出錯)
        id = id.split('');
        //計算總分
        var total = city[id[0].charCodeAt(0) - 65];
        for (var i = 1; i <= 8; i++) {
            total += eval(id[i]) * (9 - i);
        }
        //補上檢查碼(最後一碼)
        total += eval(id[9]);
        //檢查比對碼(餘數應為0);
        return ((total % 10 == 0));
    }
};
/**
 * ####func.tw新式外僑統一證號(2021.01.01~today)格式的驗證 (格式正確回傳true)
 * ####第1碼英文字母(區域碼) + 第2碼(性別碼7=無性別(未定案)8=男9=女) + 第3~9流水號 + 第10碼檢查碼
 * @param id
 * @returns {boolean}
 */
ruleTools.func.checkTwNewResidentID = function (id) {
    if (id.length != 10) return false;
    //使用「正規表達式」檢驗格式
    if (id.search(/^[A-Z](7|8|9)\d{8}$/i) == -1) {
        return false;
    }
    ///建立字母對應表(A~Z)
    ///A=10 B=11 C=12 D=13 E=14 F=15 G=16 H=17 J=18 K=19 L=20 M=21 N=22
    ///P=23 Q=24 R=25 S=26 T=27 U=28 V=29 X=30 Y=31 W=32  Z=33 I=34 O=35
    var alphabet = "ABCDEFGHJKLMNPQRSTUVXYWZIO";
    var firstLetter = id.substr(0, 1);
    if (alphabet.indexOf(firstLetter) == -1) return true;
    id = (alphabet.indexOf(firstLetter) + 10) + id.substr(1);
    //將字串分割為陣列(IE必需這麼做才不會出錯)
    id = id.split('');
    var weight = [1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1];
    var total = 0;
    for (var i = 0, len = weight.length; i < len; ++i) {
        total += (weight[i] * eval(id[i])) % 10;
    }
    return ((total % 10 == 0));
};
//func.tw舊式外僑統一證號(2011.01.01~2020.12.31)格式的驗證 (格式正確回傳true)
ruleTools.func.checkTwOldResidentID = function (id) {
    //建立字母分數陣列(A~Z)
    var city = [1, 10, 19, 28, 37, 46, 55, 64, 39, 73, 82, 2, 11, 20, 48, 29, 38, 47, 56, 65, 74, 83, 21, 3, 12, 30];
    id = id.toUpperCase();
    //使用「正規表達式」檢驗格式
    if (id.search(/^[A-Z][A-D]\d{8}$/i) == -1) {
        return false;
    } else {
        //將字串分割為陣列(IE必需這麼做才不會出錯)
        id = id.split('');
        //計算總分
        total = city[id[0].charCodeAt(0) - 65];
        // 外來人口的第2碼為英文A-D(10~13)，這裡把他轉為區碼並取個位數，之後就可以像一般身分證的計算方式一樣了。
        id[1] = id[1].charCodeAt(0) - 65;
        //計算總分
        var total = city[id[0].charCodeAt(0) - 65];
        for (var i = 1; i <= 8; i++) {
            total += eval(id[i]) * (9 - i);
        }
        //補上檢查碼(最後一碼)
        total += eval(id[9]);
        //檢查比對碼(餘數應為0);
        return ((total % 10 == 0));
    }
};
//func.檢查email格式是否正確 (格式正確回傳true)
ruleTools.func.checkEmail = function (v) {
    return (/^([A-Za-z0-9_\\-\\.])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,4})$/.test(v));
};
//func.tw檢查室話格式是否正確 (格式正確回傳true)
ruleTools.func.checkTwPhone = function (v) {
    return (/^([0-9]{2,3}-?|\\([0-9]{2,3}\\))[0-9]{3,4}-?[0-9]{4}$/.test(v));
};
//func.tw檢查手機格式是否正確 (格式正確回傳true)
ruleTools.func.checkTwCellPhone = function (v) {
    return (/^09[0-9]{2}[-]*[0-9]{3}[-]*[0-9]{3}$/.test(v));
};
//func.檢查是否為 實數float (格式正確回傳true)
ruleTools.func.checkFloat = function (v) {
    return (/^[-+]?\d+(\.\d+)?$/.test(v));
};
//func.檢查是否為 整數int (格式正確回傳true)
ruleTools.func.checkInt = function (v) {
    return (/^[-+]?[0-9][0-9]*$/.test(v));
};
//func.是否有重複的數字 ex: 246:false 2462:true 2246:true
ruleTools.func.numHasRepeat = function (v) {
    return (/^(?:(\d)(?!.*?\1))+$/.test(v));
};
//func.是否有重複的字母 ex: ABC:false ABCA:true AABC:true AaBC:false
ruleTools.func.engNotRepeat = function (v) {
    return (/^(?:([a-zA-Z])(?!.*?\1))+$/.test(v));
};
//選A,B,C...顯示D  完整版
/**
 showRules.push({
        "if" : [
            {
                "datatype": "checked",      //資料型態(number / string / checked)
                "bean" : "chk",             //主要元件(元件值會影響次要元件的顯示與否)
                "uiValue" : ["1","2","4"],  //選中其中的某個value
                "operator": "&&",           //邏輯 (||,&&)，所有上述uiValue都被選中，返回true
            },
            {
                "datatype": "checked",
                "bean" : "rdo",
                "uiValue" : ["1"],
                "operator": "||",           //任意上述uiValue被選中，返回true
            }
        ],
        "operator": "||",                   //邏輯 (|| [if內的任意條件為true] / && [if內的所有條件皆為true])
        "tar" : ["C","B","A"],              //次要元件(被影響的元件)，也可以是某id(以"#"開頭)，也可以是某class(以"."開頭)
        "parents" : [""],                   //指定至次要元件的某個parents，等同$().parents(parents[i]:first);
        "childrens" : [""],                 //指定至次要元件的某個childrens，等同$().parents(parents[i]:first).find(childrens[i]);
        "evt" : ["show","hide","show"],     //符合規則(true)時，每個元件個別要顯示(show)或隱藏(hide)，為false則相反
        "runMode" : "auto",                 //執行模式(auto [true時執行, false時逆執行] / onlyTrue [僅在true時執行] / onlyFalse [僅在false時執行])
        "eval_true" : "",                   //符合規則(true)時，要執行的eval程式
        "eval_false" : ""                   //不符合規則(false)時，要執行的eval程式
    });
 showRules.push({
        "if" : [
            {
                "datatype": "number",
                "bean" : "chk",
                "min": "1",                 //值域範圍
                "max": "999"                //值域範圍
            },
            {
                "datatype": "string",
                "bean" : "chk",
                "min": "2019-01-01",        //值域範圍
                "max": "9999-12-31"         //值域範圍
            }
        ],
        "operator": "&&",                   //if內的所有條件為true
        "tar" : ["A"],
        "parents" : [""],
        "childrens" : [""],
        "evt" : ["show"],
        "runMode" : "auto",
        "eval_true" : "alert(789)",
        "eval_false" : "alert(7899)"
    });
 */
ruleTools.showElement = function (that) {
    //查詢規則表索引
    var idxs = showRules_idx[getDataset(that).bean];
    if (!idxs) {
        // console.log("查無規則表索引: showRules_idx["+getDataset(that).bean+"]");
        return false;
    }
    ruleTools.writeRulesIf(that, showRules_val);
    // console.log(showRules);
    //依照規則表showRules顯示
    for (var i = 0, len = idxs.length; i < len; ++i) {
        var idx = idxs[i];
        var rule = showRules[idx];
        //查出rules.ifs裡面各個條件為true或false -> countsIf
        var vifs = rule.ifs;
        var countsIf = ruleTools.checkRules(vifs, showRules_val);
        if (countsIf === false) return false;
        //顯示或隱藏
        var tars = rule.tar;              //次要元件(被影響的元件)，也可以是某id(以"#"開頭)，也可以是某class(以"."開頭)
        var parents = rule.parents;       //指定至次要元件的某個parents，等同$().parents(parents[i]:first);
        var childrens = rule.childrens;   //指定至次要元件的某個childrens，等同$().parents(parents[i]:first).find(childrens[i]);
        var evts = rule.evt;              //動作 (顯示or隱藏)
        var runMode = rule.runMode;       //執行模式(auto [true時執行, false時逆執行] / onlyTrue [僅在true時執行] / onlyFalse [僅在false時執行])
        var operator = rule.operator;     //邏輯 (|| [if內的任意條件為true] / && [if內的所有條件皆為true])
        var eval_true = rule.eval_true;   //符合規則(true)時，要執行的eval程式
        var eval_false = rule.eval_false; //不符合規則(false)時，要執行的eval程式
        var counts = 0;
        for (var i2 = 0, len2 = countsIf.length; i2 < len2; ++i2) {
            if (countsIf[i2])
                ++counts;
        }
        for (var i3 = 0, len3 = tars.length; i3 < len3; ++i3) {
            //指定至物件
            var $ele = (tars[i3].indexOf("#") === 0 || tars[i3].indexOf(".") === 0) ? $(tars[i3]) : $("#div_" + tars[i3]);
            try {
                $ele = ($ele.length == 0 && !(tars[i3].indexOf("#") === 0 || tars[i3].indexOf(".") === 0)) ? $("#" + tars[i3]) : $ele;
                $ele = ($ele.hasClass("multiId") && !(tars[i3].indexOf("#") === 0 || tars[i3].indexOf(".") === 0)) ? $(".div_" + tars[i3]) : $ele; //當一個物件有設定uiDescItem或uiValueItem時，就擁有多個同名ID，此時用.multiId來查
            } catch (e) {
                console.error(e);
                $ele = null;
            }
            if ($ele === null || $ele.length == 0) {
                console.log("查無符合的element");
                console.log("tar=" + tars[i3]);
                console.log(rule);
                continue;
            }
            $ele = (parents[i3] != "") ? $ele.parents(parents[i3] + ":first") : $ele;
            $ele = (childrens[i3] != "") ? $ele.find(childrens[i3]) : $ele;

            //執行
            if ((countsIf.length == 0) || (operator == "||" && counts > 0) || (operator == "&&" && counts == countsIf.length)) {
                if (runMode === "onlyFalse") continue; //跳過false的情況
                if (evts[i3] === "hide") {
                    ruleTools.hideEle($ele);
                } else {
                    ruleTools.showEle($ele);
                }
            } else {
                if (runMode === "onlyTrue") continue; //跳過true的情況
                if (evts[i3] === "hide") {
                    ruleTools.showEle($ele);
                } else {
                    ruleTools.hideEle($ele);
                }
            }
        }
        if ((operator == "||" && counts > 0) || (operator == "&&" && counts == countsIf.length)) {
            if (eval_true != undefined && eval_true != "")
                eval(eval_true);
        } else {
            if (eval_false != undefined && eval_false != "")
                eval(eval_false);
        }
    }
};

//顯示並更改upload為true
ruleTools.showEle = function ($e) {
    $e.show().attr("data-upload", "true");
    if ($e.hasClass("divHorFormItem")) {
        $e.css('display', 'inline');
    }
    $uploadFalse = $e.find(".divHorFormItem, .divVerFormItem").find(".formItem[data-upload='false']"); //記錄showEle前，橫向展開其他項 及 向下展開其他項 原本就被註記不上傳的formItem
    $e.find(".formItem").attr("data-upload", "true"); //
    $uploadFalse.attr("data-upload", "false"); //還原被註記不上傳的formItem
    // $e.find(".divHorFormItem .formItem").attr("data-upload","false"); //橫向展開其他項 的formItem是隱藏狀態不該被上傳
    // $e.find(".divVerFormItem .formItem").attr("data-upload","false"); //向下展開其他項 的formItem是隱藏狀態不該被上傳
    ruleTools.hideEle($(".pFormItemGroup[data-grouptemplate='true']"));
};

//隱藏並更改upload為false
ruleTools.hideEle = function ($e) {
    $e.hide().attr("data-upload", "false");
    $e.find(".checkboxFormItem:checked").click();
    $e.find(".radioFormItem:checked").each(function () { //防止radio的checked錯亂 (用each+屬性設置)
        $(this).attr("check", "true").prop('checked', false).triggerHandler('click');
    });
    // $e.find(".radioFormItem:checked").attr("check", "true").prop('checked', false).triggerHandler('click');
    $e.find(".selectFormItem").val("").change();
    $e.find(".formItem").attr("data-upload", "false");
};


//物件的驗證規則表
var viryRules = [];
//物件的驗證規則表索引 (ifs: 觸發條件, events: 驗證規則)
var viryRules_idx = {"ifs": {}, "events": {}};
//物件的驗證規則表_元件value表
var viryRules_val = {};

/**
 * 依照現行所有物件狀態判斷並執行驗證規則
 * @param {boolean} isUntileReject 是否檢查到被reject的元件就停止
 * @returns {boolean}
 */
ruleTools.viryRules_runAll = function (isUntileReject) {
    var isReject = false;
    //執行viryRules_idx.ifs裡面的bean
    for (var bean in viryRules_idx.ifs) {
        var $text = $("#" + bean);
        var $rdoOrChk = $("#" + bean + "_0");
        if ($text.length > 0)
            isReject = (ruleTools.viryElement($text[0])) ? true : isReject;
        else if ($rdoOrChk.length > 0)
            isReject = (ruleTools.viryElement($rdoOrChk[0])) ? true : isReject;
        else
            console.error("找不到這個bean --> " + bean);

        if (isUntileReject && isReject) {
            return isReject;
        }
    }
    //執行viryRules_idx.events裡面的bean
    for (var bean in viryRules_idx.events) {
        var $text = $("#" + bean);
        var $rdoOrChk = $("#" + bean + "_0");
        if ($text.length > 0)
            isReject = (ruleTools.viryElement($text[0])) ? true : isReject;
        else if ($rdoOrChk.length > 0)
            isReject = (ruleTools.viryElement($rdoOrChk[0])) ? true : isReject;
        else
            console.error("找不到這個bean --> " + bean);

        if (isUntileReject && isReject) {
            return isReject;
        }
    }
    return isReject;
};
//建置物件的驗證規則表索引
ruleTools.viryRules_compiler = function () {
    viryRules_idx = {"ifs": {}, "events": {}};
    viryRules_val = {};
    console.log("=======viryRules========");
    console.log(viryRules);
    for (var i = 0, len = viryRules.length; i < len; ++i) {
        var vifs = viryRules[i].ifs;
        for (var i2 = 0, len2 = vifs.length; i2 < len2; ++i2) {
            var bean = vifs[i2].bean;
            if (viryRules_idx.ifs[bean] == undefined) {
                viryRules_idx.ifs[bean] = [];
                viryRules_val[bean] = [];
            }
            if (viryRules_idx.ifs[bean].indexOf(i) < 0) {
                viryRules_idx.ifs[bean].push(i);
            }
        }
        var events = viryRules[i].events;
        for (var i3 = 0, len3 = events.length; i3 < len3; ++i3) {
            var tar = events[i3].tar;
            if (viryRules_idx.events[tar] == undefined) {
                viryRules_idx.events[tar] = [];
            }
            if (viryRules_idx.events[tar].indexOf(i) < 0) {
                viryRules_idx.events[tar].push(i);
            }
        }
    }
    console.log("=======viryRules_idx========");
    console.log(viryRules_idx);
    console.log("=======viryRules_val========");
    console.log(viryRules_val);
};

/**
 * 選A,B,C...驗證D
 * @param that
 * @returns {boolean} 當 evt.mode=reject且未命中規則時，return true
 */
ruleTools.viryElement = function (that) {
    //查詢規則表索引
    var idxs = [];
    var idxs_if = viryRules_idx.ifs[getDataset(that).bean];
    var idxs_events = viryRules_idx.events[getDataset(that).bean];
    var isReject = false;
    if (!idxs_if && !idxs_events) {
        //console.log("查無規則表索引: viryRules_idx.ifs["+getDataset(that).bean+"]");
        return false;
    } else if (idxs_if) {
        idxs = idxs_if;
        //抄寫元件value至viryRules_val.ifs (radio, checkbox)
        ruleTools.writeRulesIf(that, viryRules_val);
    }
    //有可能被觸發的ele同時在規則表
    if (idxs_events) {
        if (idxs.length > 0) {
            for (var i = 0, len = idxs_events.length; i < len; ++i) {
                if (idxs.indexOf(idxs_events[i]) === -1) idxs.push(idxs_events[i]);
            }
        } else {
            idxs = idxs_events;
        }
    }

    //依照規則表viryRules顯示
    for (var i = 0, len = idxs.length; i < len; ++i) {
        var idx = idxs[i];
        var rule = viryRules[idx];
        //查出rules.ifs裡面各個條件為true或false -> countsIf
        var vifs = rule.ifs;
        var countsIf = ruleTools.checkRules(vifs, viryRules_val);
        if (countsIf === false) return false;

        //檢查符合條件的數量
        var counts = 0;
        for (var i2 = 0, len2 = countsIf.length; i2 < len2; ++i2) {
            if (countsIf[i2])
                ++counts;
        }

        //是否符合觸發條件
        var firstIsTrue = (countsIf.length == 0) || (rule.operator == "||" && counts > 0) || (rule.operator == "&&" && counts == countsIf.length);

        //開始驗證 驗證 events.ifs, 並執行 events.evts
        var events = rule.events;
        for (var i2 = 0, len2 = events.length; i2 < len2; ++i2) {
            var event = events[i2], tar = event.tar, operator = event.operator;
            var eifs = event.ifs, evts = event.evts, eval_true = event.eval_true, eval_false = event.eval_false;

            var $ele = $("#" + tar);
            if ($ele.length == 0) {
                console.log("查無符合的element");
                console.log("tar=" + tar);
                console.log(event);
                continue;
            }

            // console.log(countsIf.length);
            // console.log(counts);
            // console.log(operator);
            var viryResult = false; //最終驗證結果

            //是否符合觸發條件
            if (firstIsTrue) {
                //開始驗證
                var v = $ele.val();
                /**
                 * ##最終驗證結果
                 * ####true=符合驗證結果, false=不符合
                 * >####當x=6, 1＜x -> true
                 * >####在cgColor改變顏色時，代表須執行變色
                 * >####當reject阻止正式存檔時，邏輯反轉，取消reject
                 * @type {boolean}
                 */
                var countsIf2 = ruleTools.viryRules(v, eifs);
                if (countsIf2 === false) {
                    console.error("tar:" + tar);
                    return false;
                }
                //檢查符合條件的數量
                var counts2 = 0;
                for (var i3 = 0, len3 = countsIf2.length; i3 < len3; ++i3) {
                    if (countsIf2[i3])
                        ++counts2;
                }
                viryResult = (countsIf2.length == 0) || (operator == "||" && counts2 > 0) || (operator == "&&" && counts2 == countsIf2.length);
            } else {//最終驗證結果為不符合
                viryResult = false;
            }
            //沒有預設evts的話就自動reject
            if (evts && evts.length===0){
                evts.push({"mode":"reject", "hint":$ele.attr("data-title")+" 未通過驗證規則"});
            }
            //執行驗證已通過/未通過的event
            for (var i3 = 0, len3 = evts.length; i3 < len3; ++i3) {
                var evt = evts[i3];
                if (ruleTools[evt.mode] == undefined) {
                    console.log("尚不支援此驗證事件");
                    console.log("mode=" + evt.mode);
                    console.log(evt);
                    continue;
                }
                //執行觸發事件 (true為符合驗證規則, false為不符合)
                if (evt.mode == "reject") {
                    //邏輯反轉，符合規則時不執行要reject
                    evt.viryType = "viryElement-" + idx + "-" + i3;
                    // evt.viryType = "viryElement";
                    ruleTools[evt.mode]($ele, viryResult, evt);
                } else {
                    //符合驗證規則時要執行動作
                    ruleTools[evt.mode]($ele, viryResult, evt);
                }
                //當viryResult=false不符合規則時 -> 阻止上傳 -> return true，
                if (!isReject && !viryResult && evt.mode == "reject") {
                    isReject = true;
                }
            }
            if (viryResult) {
                if (eval_true != undefined && eval_true != "")
                    eval(eval_true);
            } else {
                if (eval_false != undefined && eval_false != "")
                    eval(eval_false);
            }
        }
    }
    return isReject;
};

/**
 * ##提示驗證失敗並阻止上傳
 * ####符合驗證規則(true)時，代表"取消"阻止上傳
 * ####不符合(false)時則"阻止"上傳
 * @param $e
 * @param {boolean} viryResult true 符合驗證規則 / false 不符合
 * @param json
 */
ruleTools.reject = function ($e, viryResult, json) {
    var viryType = (json.viryType) ? json.viryType : "default";
    $e.each(function () {
        var $that = $(this);
        //應該把rejectItem設定到datetime的hidden上
        $that = ($that.hasClass('dtDateFormItem')) ? $("#" + $that.attr("id").replace(/_date$/, "")) : $that;
        $that = ($that.hasClass('dtTimeFormItem')) ? $("#" + $that.attr("id").replace(/_time$/, "")) : $that;

        var $parent = $that.parent();
        var tarViryJson = $that.attr('data-viryjson'); //被reject的json組合
        tarViryJson = (tarViryJson) ? JSON.parse(tarViryJson) : {};
        if (viryResult) { //符合驗證規則，移除reject用的json
            delete tarViryJson[viryType];
        } else { //不符合驗證規則，新增reject用的json
            tarViryJson[viryType] = {
                "viryType": viryType,
                "hint": json.hint
            };
        }

        var viryJson = tarViryJson[Object.keys(tarViryJson)[0]]; //取得第一個值
        if (viryJson) { //有值，執行reject
            //移除提示框
            $parent.find(".hintMsg").remove();
            //創建提示框
            var $hintMsg = $("<div class='hintMsg'/>").html(viryJson.hint.replace(/\n/g, "<br/>"));
            $hintMsg = setHintMsgOffset($parent, $hintMsg);
            //將提示框擺在右方並貼齊
            if (!eNursing.isIE(5) && !eNursing.isIE(7)) {  //ie5 和ie7 設定top和left會壞掉
                $parent.mouseenter(function () {
                    $hintMsg = $parent.find(".hintMsg");
                    $hintMsg = setHintMsgOffset($parent, $hintMsg);
                    $parent.append($hintMsg);
                });
            }
            $hintMsg.css('position', ''); //ie會自動設定position:relative
            $parent.append($hintMsg);
            if (eNursing.isIE(5)) { //ie5 沒辦法吃進hover的css，直接顯示
                $hintMsg.show();
            }

            //適當的增加 rejectedItem
            if ($that.hasClass('dtFormItem')) {
                $("#" + $that.attr("id") + "_date, #" + $that.attr("id") + "_time").addClass("rejectedItem");
            }

            //設定 1.設定為rejected屬性 2.pass=false未命中 3.hint:提示訊息
            $that.addClass("rejectedItem").attr('data-pass', 'false').attr('data-hint', viryJson.hint).attr('data-viryjson', JSON.stringify(tarViryJson));

            function setHintMsgOffset($parent, $hintMsg) {
                if ($hintMsg.length == 0) {
                    return;
                }
                var hint = $hintMsg.html();
                var offset = {"top": 0, "left": 0};

                //取得msg寬
                var mWid = $hintMsg.width(); //msg寬
                var mHei = $hintMsg.height(); //msg高
                $hintMsg.remove();
                $hintMsg = $("<div class='hintMsg'/>").html(hint);
                //如果提示框超過右邊界或下邊界，調整顯示位置
                var bWid = document.body.clientWidth; //body可見寬
                var bHei = document.body.clientHeight; //body可見高
                var pWid = $parent.width(); //parent寬
                var pHei = $parent.height(); //parent高
                var pPosi = $parent.position();  //parent的相對top left
                var pOffs = $parent.offset();    //parent的絕對top left
                var check; //檢查是否超過

                offset.top = pPosi.top;
                offset.left = pPosi.left + pWid;

                //超過右邊界，調整至ele下方
                check = pOffs.left + offset.left - pPosi.left + mWid;
                if (check > bWid) {
                    offset.top = pPosi.top + pHei;
                    offset.left = pPosi.left;
                    //超過右邊界，調整至貼齊畫面右邊界
                    check = pOffs.left + offset.left - pPosi.left + mWid + 20; //多+卷軸寬
                    if (check > bWid) {
                        offset.left = offset.left - (check - bWid) - 20; //多-卷軸寬
                    }
                }
                //超過下邊界，調整至ele上方
                // check = pOffs.top+offset.top+mHei;
                // check -= (offset.top>=pOffs.top) ? pOffs.top : 0;
                // if (check > bHei){
                //     offset.top = pPosi.top-pHei-mHei;
                // }

                $hintMsg.offset(offset);
                $hintMsg.css('position', ''); //ie會自動設定position:relative

                return $hintMsg;
            }
        } else { //命中，移除reject
            //移除提示框
            $parent.find(".hintMsg").remove();

            //適當的移除 rejectedItem
            if ($that.hasClass('dtFormItem')) {
                $that = $("#" + $that.attr("id") + ", #" + $that.attr("id") + "_date, #" + $that.attr("id") + "_time");
            } else if ($that.hasClass('radioFormItem') || $that.hasClass('checkboxFormItem')) {
                $parent.removeClass("rejectedItem");
            }
            //設定 1.移除rejected屬性 2.pass=true命中驗證規則 3.移除hint
            $that.removeClass("rejectedItem").attr('data-pass', 'true').attr('data-hint', '').attr('data-viryjson', JSON.stringify(tarViryJson));
        }
    });
};

/**
 * ####符合驗證規則 -> 改變顏色
 * ####不符合 -> 還原顏色
 * @param $e
 * @param {boolean} viryResult true 符合驗證規則 / false 不符合
 * @param json
 */
ruleTools.cgcolor = function ($e, viryResult, json) {
    var bgColor = "", fontColor = "";
    if (!viryResult || (viryResult && json.runMode === "onlyFalse")) {
        var className = getDataset($e[0]).bean + "-cgcolor";
        $("#" + className).remove();
        $e.removeClass(className);
    } else if (viryResult && json.runMode === "auto") {
        bgColor = json.bgColor;
        fontColor = json.fontColor;

        var className = getDataset($e[0]).bean + "-cgcolor";
        $("#" + className).remove();
        if (bgColor == "" && fontColor == "") {
            $e.removeClass(className);
            return;
        }
        $e.addClass(className);

        var css = "." + className + "{";
        if (bgColor != "") {
            css += "background-color:" + bgColor + ";";
        }
        if (fontColor != "") {
            css += "color:" + fontColor + ";";
        }
        css += "}";
        $("head").append($("<style id='" + className + "'></style>").append(css));
    }
};

/**
 * 執行自定義方法
 * @param $e
 * @param {boolean} viryResult true 符合驗證規則 / false 不符合
 * @param json
 */
ruleTools.eval = function ($e, viryResult, json) {
    if (viryResult) {
        eval(json.eval_true);
    } else {
        eval(json.eval_false);
    }
};

/*隐藏select option*/
function hideOption(target, parent) {
    var superId = parent.val();
    target.find("option:not([super='" + superId + "'])").slice(1).wrap("<span style='display:none'></span>");
}

/*显示select option*/
function showChildren(origin, target) {
    var originS = $(origin);
    // ie中取到的是数组
    var val = originS.val().toString();
    var targetS = $(target);
    targetS.find("option").each(function (i) {
        if (i > 0) {
            var $this = $(this);
            var spans = $this.parent("span");
            if (spans.size()) {
                if (val === $this.attr("super")) {
                    $this.unwrap();
                }
            } else if (val !== $this.attr("super")) {
                $this.wrap("<span style='display:none'></span>");
            }
        }
    });
    targetS.change();
    targetS.show();
    targetS.closest("#div_" + targetS.attr("name") + ", .multiId#div_" + targetS.attr("name")).show();
}

/**
 * checkbox & radio 點擊 顯示,隱藏,Disabled 事件
 * script 結構說明：
 * [
 *      {
 *          name: '腳本名稱',
 *          options: Number[], // 選取的選項
 *          range: Object[], // 觸發相關事件的範圍(目前只設定 display，disabled 不使用 randge)
 *          type: '腳本類型(display, disabled)'
 *      }
 * ]
 * script.range 結構說明：
 * [
 *      {
 *          tabIndex: number, // 頁籤位置(數字)
 *          hideTab: boolean, // 頁籤是否隱藏(布林)
 *          hidePosition: Object[], // 隱藏欄位座標(x軸, y軸)({x: ?, y: ?})
 *          hideBeanName: String[], // 隱藏元件名稱
 *          showBeanName: String[], // 顯示元件名稱
 *      }
 * ]
 * @param {Element} tar inputElement
 * @returns
 */
function formToolClickEvent(tar) {
    /**
     * 參數說明：
     * beanDiv: p 節點 selector (為了取得 formToolAttribute)
     * formToolArrtibute: 新工具屬性，解析腳本用
     * script: 新工具屬性，腳本屬性
     * targetName: inputElement名稱
     * inputElements: 尋找節點底下所有checkbox or radio Element selector
     */
    var beanDiv = $(tar).parents('.pFormItem:first');
    if (beanDiv.length == 0) return;
    var formToolAttribute = getDataset(beanDiv[0]).formtoolattribute;
    if (!formToolAttribute) return
    try {
        formToolAttribute = JSON.parse(formToolAttribute);
    } catch (e) { }
    var script = formToolAttribute.script;
    if (!script) return
    try {
        script = JSON.parse(script);
    } catch (e) { }
    var targetName = $(tar).attr("name");
    var inputElements = beanDiv.find(".formItem[name='" + targetName + "']")
    for (var i = 0, len = script.length; i < len; ++i) {
        /**
         * 參數說明：
         * isSameChecked: 是否選項勾選與腳本條件一致(boolean)
         * 其餘參照 clickEventDisplay() 說明 ↑↑↑↑
         */
        var isSameChecked = false;
        var scriptType = script[i].type;
        var scriptRange = script[i].range;
        var scriptOptions = script[i].options;
        // 檢核選項勾選是否與腳本勾選一致；若一致後續啟用腳本，否則取消該腳本。
        if (scriptOptions.length > 0) {
            isSameChecked = checkSameOptions(targetName, scriptOptions)
        }
        switch (scriptType) {
            case 'disabled':
                if (isSameChecked) {
                    inputElements.each(function(index) {
                        // 若選項原本已勾選需要取消勾選並觸發對應的事件，故使用 click()，其餘 disabled
                        if (scriptOptions.indexOf(index) === -1 && this.checked) $(this).click();
                        $(this).attr('disabled', 'disabled');
                        if (scriptOptions.indexOf(index) > -1) {
                            $(this).attr('disabled', null);
                        }
                    })
                } else {
                    inputElements.each(function() {
                        $(this).attr('disabled', null);
                    })
                }
                break;
            case 'display':
                if (scriptRange) {
                    beanFactoryEvent(isSameChecked, scriptRange)
                }
                break;
        }
    }

    /**
     * 檢查選項是否一致
     * @param {String} targetName [Element名稱]
     * @param {Number[]} scriptOpts [數字陣列][腳本條件選項]
     * @returns {Boolean}
     */
    function checkSameOptions(targetName, scriptOpts) {
        var checkedArray = [];
        var sameCount = 0;
        var eles = beanDiv.find(".formItem[name='" + targetName + "']");
        eles.each(function(index) {
            if (this.checked) checkedArray.push(index);
        });
        for (var j = 0, lenJ = checkedArray.length; j < lenJ; ++j) {
            if (scriptOpts.indexOf(checkedArray[j]) > -1) sameCount++;
            if (sameCount == scriptOpts.length) break;
        }
        if (sameCount == scriptOpts.length) {
            return true;
        }
        return false;
    }

    /**
     * 元件隱藏顯示控制器
     * @param {Boolean} isSameChecked [是否條件一致]
     * @param {Object[]} scriptRange [參照 clickEventDisplay() 說明 ↑↑↑↑]
     */
    function beanFactoryEvent(isSameChecked, scriptRange) {
        for (var j = 0, lenJ = scriptRange.length; j < lenJ; ++j) {
            var tabIndex = scriptRange[j].tabIndex;
            var hideTab = scriptRange[j].hideTab;
            var hidePosition = scriptRange[j].hidePosition;
            var hideBeanName = scriptRange[j].hideBeanName;
            var showBeanName = scriptRange[j].showBeanName;
            var navTab = $('.tab-pane').eq(tabIndex);
            var navLink = $('#' + navTab.attr('aria-labelledby'))
            // 選項與腳本條件相符
            if (isSameChecked) {
                // 檢查頁籤是否隱藏(頁籤隱藏則其餘不檢查)(順位一)
                if (hideTab) {
                    navTab.addClass('hide');
                    navLink.addClass('hide');
                    navTab.find('.pFormItem').each(function() {
                        ruleTools.hideEle($(this));
                    })
                    navTab.find('.pFormItemGroup').each(function() {
                        ruleTools.hideEle($(this));
                    })
                } else {
                    // 頁籤若不隱藏，檢查下一個順位：表格座標(順位二)
                    for (var k = 0, lenK = hidePosition.length; k < lenK; k++) {
                        var xPosition = hidePosition[k].x;
                        var yPosition = hidePosition[k].y;
                        var tdElement = navTab.find('table tr').eq(yPosition).children().eq(xPosition);
                        tdElement.addClass('hide');
                        tdElement.find('.pFormItem').each(function() {
                            ruleTools.hideEle($(this));
                        })
                        tdElement.find('.pFormItemGroup').each(function() {
                            ruleTools.hideEle($(this));
                        })
                    }
                    // 表格隱藏完畢後檢查元件隱藏顯示(順位三、四)
                    for (var k = 0, lenK = hideBeanName.length; k < lenK; k++) {
                        var $bean = $('.pFormItem[data-bean="' + hideBeanName[k] + '"]');
                        if ($bean.length === 0) {
                            var $buttonAdd = $('[target-group="' + hideBeanName[k] + '"]').first();
                            $bean = $('.pFormItemGroup[data-bean="' + hideBeanName[k] + '"]');
                            ruleTools.hideEle($buttonAdd.children());
                        }
                        ruleTools.hideEle($bean);
                    }
                    for (var k = 0, lenK = showBeanName.length; k < lenK; k++) {
                        var $bean = $('.pFormItem[data-bean="' + showBeanName[k] + '"]');
                        if ($bean.length === 0) {
                            var $buttonAdd = $('[target-group="' + showBeanName[k] + '"]').first();
                            $bean = $('.pFormItemGroup[data-bean="' + showBeanName[k] + '"]');
                            ruleTools.showEle($buttonAdd.children());
                        }
                        ruleTools.showEle($bean);
                        ruleTools.showEle($bean.children());
                    }
                }
            } else {
                // 檢查頁籤是否隱藏(頁籤隱藏則其餘不檢查)(順位一)
                if (hideTab) {
                    navTab.removeClass('hide');
                    navLink.removeClass('hide');
                    navTab.find('.pFormItem').each(function() {
                        ruleTools.showEle($(this));
                    })
                    navTab.find('.pFormItemGroup').each(function() {
                        ruleTools.showEle($(this));
                    })
                } else {
                    // 頁籤若不隱藏，檢查下一個順位：表格座標(順位二)
                    for (var k = 0, lenK = hidePosition.length; k < lenK; k++) {
                        var xPosition = hidePosition[k].x;
                        var yPosition = hidePosition[k].y;
                        var tdElement = navTab.find('table tr').eq(yPosition).children().eq(xPosition);
                        tdElement.removeClass('hide');
                        tdElement.find('.pFormItem').each(function() {
                            ruleTools.showEle($(this));
                        })
                        tdElement.find('.pFormItemGroup').each(function() {
                            ruleTools.showEle($(this));
                        })
                    }
                    // 表格隱藏完畢後檢查元件隱藏顯示(順位三、四)
                    for (var k = 0, lenK = hideBeanName.length; k < lenK; k++) {
                        var $bean = $('.pFormItem[data-bean="' + hideBeanName[k] + '"]');
                        if ($bean.length === 0) {
                            var $buttonAdd = $('[target-group="' + hideBeanName[k] + '"]').first();
                            $bean = $('.pFormItemGroup[data-bean="' + hideBeanName[k] + '"]');
                            ruleTools.showEle($buttonAdd.children());
                        }
                        ruleTools.showEle($bean);
                    }
                    for (var k = 0, lenK = showBeanName.length; k < lenK; k++) {
                        var $bean = $('.pFormItem[data-bean="' + showBeanName[k] + '"]');
                        if ($bean.length === 0) {
                            var $buttonAdd = $('[target-group="' + showBeanName[k] + '"]').first()
                            $bean = $('.pFormItemGroup[data-bean="' + showBeanName[k] + '"]')
                            ruleTools.hideEle($buttonAdd.children());
                        }
                        ruleTools.hideEle($bean);
                    }
                }
            }
        }
    }
}

/**
 * =============== deprecation ===============
 * ===============    棄用    ================
 */
function clickEventDisabled(tar) {
    var beanDiv = $(tar).parents('.pFormItem:first');
    if (beanDiv.length == 0) {
        return;
    }
    var formToolAttribute = getDataset(beanDiv[0]).formToolAttribute;
    if (formToolAttribute) {
        formToolAttribute = JSON.parse(formToolAttribute);
    } else {
        return;
    }
    var type = $(tar).attr("type");
    var chk;
    if (type === 'radio') {
        var check = $(tar).attr("check");
        if (check === undefined || check === 'false') {
            chk = true;
        } else {
            chk = false;
        }
    } else if (type === 'checkbox') {
        chk = tar.checked;
    }
    var name = $(tar).attr("name");
    var position;
    var inputElements = beanDiv.find(".formItem[name='" + name + "']");
    for (var i = 0; i < inputElements.length; i++) {
        var inputElement = inputElements[i];
        if ($(tar).attr("id") == $(inputElement).attr("id")) {
            position = i;
            break;
        }
    }
    var script = formToolAttribute.script;
    var options = [];
    if (script === undefined) {
        return;
    }
    try {
        script = JSON.parse(script);
    } catch (e) {
    }
    for (var key in script) {
        if (script[key].type === 'disabled') {
            options = script[key].options;
            break;
        }
    }
    if (chk && options.indexOf(position) > -1) {
        beanDiv.find('input').attr('disabled', 'disabled');
        $(tar).attr('disabled', null);
        if (type === 'checkbox') {
            beanDiv.find('input').attr("checked", false);
            tar.checked=true;
        }
    } else {
        beanDiv.find('input').attr('disabled', null);
    }
}

/**
 * =============== deprecation ===============
 * ===============    棄用    ================
 */
function clickEventDisplay(tar) {
    var beanDiv = $(tar).parents('.pFormItem:first');
    if(beanDiv.length==0){
        return;
    }
    var formToolAttribute = getDataset(beanDiv[0]).formToolAttribute;
    if (formToolAttribute) {
        formToolAttribute = JSON.parse(formToolAttribute);
    } else {
        return;
    }
    var chk = tar.checked;
    var name = $(tar).attr("name");
    var id = $(tar).attr("id");
    var position;
    var inputElements = beanDiv.find(".formItem[name='" + name + "']");
    for (var i = 0; i < inputElements.length; i++) {
        var inputElement = inputElements[i];
        if ($(tar).attr("id") == $(inputElement).attr("id")) {
            position = i;
            break
        }
    }
    var script = formToolAttribute.script;
    if (script === undefined) {
        return;
    }
    try {
        script = JSON.parse(script);
    } catch (e) {
    }
    for (var i = 0; i < script.length; i++) {
        var rangeElement = script[i].range;
        if (rangeElement != undefined) {
            for (var r = 0; r < rangeElement.length; r++) {
                var tabIndex = rangeElement[r].tabIndex;
                var hideArr = rangeElement[r].hidePosition;
                var hideBean = rangeElement[r].hideBeanName;
                var showBean = rangeElement[r].showBeanName;
                for (var j = 0; j < hideArr.length; j++) {
                    var tabBean = $('.tab-pane').eq(tabIndex).find('table tr').eq(hideArr[j].y).find('td').eq(hideArr[j].x);
                    if (tabBean != undefined) {
                        if (!tabBean.hasClass("tabBean_" + id)) {
                            tabBean.addClass("tabBean_" + id);
                        }
                    }
                }
                for (var j = 0; j < hideBean.length; j++) {
                    if (!$('#div_' + hideBean[j]).hasClass("hideBean_" + id)) {
                        $('#div_' + hideBean[j]).addClass("hideBean_" + id);
                    }
                }
                for (var j = 0; j < showBean.length; j++) {
                    if (!$('#div_' + showBean[j]).hasClass("showBean_" + id)) {
                        $('#div_' + showBean[j]).addClass("showBean_" + id);
                    }
                }
            }
        }
    }
    $(".tabBean_" + id).show();
    $(".showBean_" + id).hide();
    for (var i = 0; i < script.length; i++) {
        var scriptElement = script[i];
        if (scriptElement != undefined && scriptElement.type === 'display') {
            options = scriptElement.options;
            if (options.indexOf(position) > -1) {
                var range = scriptElement.range;
                if (range != undefined) {
                    for (var r = 0; r < range.length; r++) {
                        var rangeElement = range[r];
                        var hideTab = rangeElement.hideTab;
                        var tabIndex = rangeElement.tabIndex;
                        var hideArr = rangeElement.hidePosition;
                        var hideBean = rangeElement.hideBeanName;
                        var showBean = rangeElement.showBeanName;
                        if (hideTab) {
                            if (chk) {
                                $('.nav-link').eq(tabIndex).addClass('hide');
                                $('.tab-pane').eq(tabIndex).addClass('hide');
                            } else {
                                $('.nav-link').eq(tabIndex).removeClass('hide');
                                $('.tab-pane').eq(tabIndex).removeClass('hide');
                            }
                            break
                        }
                        for (var j = 0; j < hideArr.length; j++) {
                            if (chk) {
                                $('.tab-pane').eq(tabIndex).find('table tr').eq(hideArr[j].y).find('td').eq(hideArr[j].x).addClass('hide');
                            } else {
                                $('.tab-pane').eq(tabIndex).find('table tr').eq(hideArr[j].y).find('td').eq(hideArr[j].x).removeClass('hide');
                            }
                        }
                        for (var j = 0; j < hideBean.length; j++) {
                            if (chk) {
                                $('#div_' + showBean[j]).hide();
                                $('#div_' + hideBean[j]).addClass('hide');
                            } else {
                                $('#div_' + showBean[j]).show();
                                $('#div_' + hideBean[j]).removeClass('hide');
                            }
                        }
                        for (var j = 0; j < showBean.length; j++) {
                            if (chk) {
                                $('#div_' + showBean[j]).show();
                                $('#div_' + showBean[j]).removeClass('hide');
                            } else {
                                $('#div_' + showBean[j]).hide();
                                $('#div_' + showBean[j]).addClass('hide');
                            }
                        }
                    }
                }
            }
        }
    }
}