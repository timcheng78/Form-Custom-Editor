
//List特有區段

//轉譯所有formItemValue為FormItemDesc
var versionNos = [];
var formIDs = [];
var formIDs2 = [];
var formTypes = [];
var versionNosCounts = 0;
var dFTemplates = {};
//動態表單模板
var dynamicFormTemplate = null;
//動態表單 第三版 dynamicForm
function list_dynamicFormTransefer(completeCall, errorCall){
    //找到所有有用到的formVersionId
    versionNos = [];
    formIDs = [];
    formTypes = [];
    versionNosCounts = 0;
    dFTemplates = {};
    if (dForms.length==0){
        goPageReady(completeCall);
    }
    for (var i = 0, len = dForms.length; i < len; i++) {
        dForm = dForms[i].dynamicForm;
        if (versionNos[versionNos.length - 1] != dForm.versionNo && dForm.versionNo!=undefined){
            versionNos.push(dForm.versionNo);
            formTypes.push(dForm.formType);
        }
        formIDs[dForm.formId]=parseInt(dForm.versionNo);
        formIDs2[dForm.formId]=0;
    }
    transeferItemValueToItemDesc(doShowElementUiDesc, completeCall, errorCall);

    //轉譯所有formItemValue為FormItemDesc
    function doShowElementUiDesc(completeCall){
        $(".pFormItem").each(function() {
            var bean = getDataset(this).bean;
            var index = getDataset(this).index;
            // var formVersionId = getDataset(this).formversionid;
            var formId = dForms[index].dynamicForm.formId;
            var itemMaps = dForms[index].dynamicForm.formItems;
            var dFTemplate = dFTemplates[formId];
            dynamicFormTemplate = dFTemplate;
            if (dFTemplate) {
                dynamicForm.showElementUiDesc(this, itemMaps[bean], dFTemplate.hashItems?dFTemplate.hashItems[bean]:undefined, itemMaps);
            }
        });
        goPageReady(completeCall);
    }
}
//動態表單 第四版 gForm
function list_gFormTransefer(completeCall, errorCall, $selector){
    //找到所有有用到的formVersionId
    versionNos = [];
    formIDs = [];
    formIDs2 = [];
    formTypes = [];
    versionNosCounts = 0;
    dFTemplates = {};
    if (gForms.length==0){
        goPageReady(completeCall);
    }
    for (var i = 0, len = gForms.length; i < len; i++) {
        gForm = gForms[i].gForm;
        if (versionNos[versionNos.length - 1] != gForm.versionNo && gForm.versionNo!=undefined){
            versionNos.push(gForm.versionNo);
            formTypes.push(gForm.formType);
        }
        formIDs[gForm.formId]=parseInt(gForm.versionNo);
        formIDs2[gForm.formId]=0;
    }
    doShowElementUiDesc(completeCall);

    //轉譯所有formItemValue為FormItemDesc
    function doShowElementUiDesc(completeCall){
        $selector = ($selector) ? $selector : $("#listPage .pFormItem");
        $selector.each(function() {
            var bean = getDataset(this).bean;
            var index = getDataset(this).index;
            // var formVersionId = getDataset(this).formversionid;
            var itemMaps = gForms[index].gForm.gformItemMap;
            if (dynamicFormTemplate) {
                dynamicForm.showElementUiDesc(this, itemMaps[bean], dynamicFormTemplate.hashItems ? dynamicFormTemplate.hashItems[bean] : undefined, itemMaps);
            }
        });
        goPageReady(completeCall);
    }
}
function transeferItemValueToItemDesc(doShowElementUiDesc, completeCall, errorCall){
    //查詢所有form的XML模板 (以formType及versionNo為key)
    for (var i2 = 0, len2=versionNos.length; i2<len2; i2++) {
        dynamicForm.searchParamDF.versionNo = versionNos[i2];
        dynamicForm.searchParamDF.formType = formTypes[i2];
        basicParam.getDynamicFormTemplateByFormModelVersionNo(dynamicForm, function(dFTemplate) {
            dFTemplate = dFTemplate[0].basicParam.dynamicFormTemplate;
            // dFTemplates[dFTemplate.formVersionId] = dFTemplate;
            for(var fID in formIDs){
                if (formIDs[fID]>=dFTemplate.version && formIDs2[fID]<=dFTemplate.version){
                    formIDs2[fID]=dFTemplate.version;
                    dFTemplates[fID] = dFTemplate;
                }
            }
            //查完之後就轉譯所有formItemValue為FormItemDesc
            if (++versionNosCounts==versionNos.length){
                doShowElementUiDesc(completeCall);
            }
        }, function(err) {++versionNosCounts;errorCall(err);});
    }
}
//处理gform相关数据
function autoProcessGFormDataForList(dynamicForm, paramMap,successCall,errorCall){
    paramMap = paramMap || {};
    basicParam.getCurrDynamicFormTemplateV3(dynamicForm, function(dFTemplate) {
        paramMap.versionParamMap = paramMap.versionParamMap||{formType: dFTemplate[0].basicParam.dynamicFormTemplate.formType,formModel:dFTemplate[0].basicParam.dynamicFormTemplate.formType,versionNo:dFTemplate[0].basicParam.dynamicFormTemplate.version};
        gFormJS.autoProcessGFormData(paramMap, function (result) {
            var gformData = result;
            successCall(gformData);
        }, function(e) {eNursing.error(e);errorCall(e)});
    }, function(err) {++versionNosCounts;errorCall(err);});

}