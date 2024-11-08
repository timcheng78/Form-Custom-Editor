!function () {
    eNursing.Nursing.extend = function (){
        var target=eNursing.extend({},arguments[0]);
        for (var i=1, len=arguments.length; i<len; i++){
            target=eNursing.extend(target, arguments[i]);
        }
        return target;
    };
    eNursing.Nursing.leftJoin = function (){
        var target = {};
        for (var i=0, len=arguments.length; i<len; i++){
            target=arguments[i];
            if (eNursing.isObject(target)) {
                for (key in this) {
                    if (target.hasOwnProperty(key)){
                        if (!eNursing.isObject(target[key])||(eNursing.isObject(target[key])&&eNursing.getModules()[key.replace(/^\S/,function(s){return s.toUpperCase();})]))
                            this[key]=target[key];
                    }
                }
            }
        }
        return this;
    };
    eNursing.Nursing.clearObj = function(){
        this.leftJoin(new eNursing.getModules()[this.nodeId]());
    };

    eNursing.Nursing.commonCRUD = function (process, argument, node, action, successCall, errorCall, completeCall, rewrite) {
        eNursing.info("process: "+process);
        eNursing.info("argument: "+argument);
        var arg = this.extend(argument);
        for (i in arg){
            clearJson(arg[i]);
        }
        function clearJson(obj){
            for (key in obj){
                if (key=="add"){
                    obj[key]="clear by commonCRUD.clearJson ...";
                }else if(eNursing.isFunction(obj[key])){
                    delete obj[key];
                }else if (eNursing.isObject(obj[key])){
                    clearJson(obj[key]);
                }
            }
        }
        eNursing.info(JSON.stringify(arg));
        eNursing.info("node: "+node);
        eNursing.info("action: "+action);

        var param = {
            node: node,
            action: action
        };
        eNursing.sendMsg(process, argument, param, "", function (_data) {
            var result=_data;
            if (!eNursing.isObject(_data))
                result=JSON.parse(_data);
            if (result.resultMsg.success) {
                eNursing.info("success: "+JSON.stringify(result));
                if(eNursing.isFunction(successCall))
                    successCall(result);
            } else {
                eNursing.error("commonCRUD: "+JSON.stringify(result));
                if(eNursing.isFunction(errorCall))
                    errorCall(result);
            }
            if(eNursing.isFunction(completeCall))
                completeCall();

        }, function (error) {
            eNursing.error("commonCRUD: "+error);
            if(eNursing.isFunction(errorCall))
                errorCall(error);
        },action, rewrite);
    };
    /** @function nursing.createGForm*/
    /** @function nursing.getGForm*/
    function GForm() {
        this.nodeId = eNursing.getFnName(GForm);
        //searchParamGF 查询条件
        this.searchParamGF = new SearchParamGF();
        //String 未知
        this.sourceId = null;
        //String 主健
        this.formId = null;
        //String 未知
        this.formType = null;
        //Date 未知
        this.evaluationTime = null;
        //String 未知
        this.totalScore = null;
        //String 未知
        this.formVersionId = null;
        //String 未知
        this.status = "Y";
        //String 未知
        this.creatorId = null;
        //String 未知
        this.creatorName = null;
        //Date 未知
        this.createTime = null;
        //String 未知
        this.modifyUserId = null;
        //String 未知
        this.modifyUserName = null;
        //Date 未知
        this.modifyTime = null;
        //String 未知
        this.versionNo = null;
        //String 未知
        this.content = null;
        //GFormItem[] 未知
        this.gformItems=[];
        //Map<String, GFormItem> 未知
        this.gformItemMap={};

        //將 gformItems(arr)轉為 gformItemMap(json)
        this.setGFormItemMap = function (gForm){
            var gformItemMap = {};
            if (gForm && gForm.gformItems){
                var items = gForm.gformItems;
                for (i2=0, len2=items.length; i2<len2; i2++){
                    if (items[i2] && items[i2].itemKey){
                        gformItemMap[items[i2].itemKey]={
                            "itemValue" : (items[i2].itemValue) ? items[i2].itemValue.trim() : items[i2].itemValue,
                            "otherValue" : items[i2].otherValue
                        };
                    }
                }
            }
            gForm.gformItemMap=gformItemMap;
            return gForm;
        };

        //將 gformItemMap(json)轉為 gformItems(arr)
        this.setGFormItems = function (gForm){
            var items = [];
            if (gForm && gForm.gformItemMap){
                var gformItemMap = gForm.gformItemMap;
                for (key in gformItemMap){
                    var json = gformItemMap[key];
                    json.itemKey = key;
                    items.push(json);
                }
            }
            gForm.gformItems=items;
            return gForm;
        };

        //依據 sourceId、formType 取得所有Gform表單
        this.getGFormList = function (gFormParam, successCall, errorCall) {
            // if (!checkObjectFormat.check(this.nodeId+".getGFormList", arguments[0])) return false;
            var param = {
                /**不同数据*/
                node: "GFormList."+gFormParam.searchParamGF.formType+"."+gFormParam.searchParamGF.sourceId,
                /**动作*/
                action: "select"
            };

            eNursing.sendMsg("gFormService.getGFormList", [{"gForm":gFormParam}], param, "", function (result) {
                if (result.resultMsg.success) {
                    var gForms = result.data;
                    if (window.console) console.log(gForms);
                    successCall(gForms);
                } else {
                    eNursing.F2ReportErrorMsg(result.resultMsg);
                }

            }, errorCall);
        };

        //依據 sourceId、formType 取得最後一筆Gform表單
        this.getLastGFormList = function (gFormParam, successCall, errorCall) {
            var param = {
                /**不同数据*/
                node: "getLastGFormList."+gFormParam.searchParamGF.formType+"."+gFormParam.searchParamGF.sourceId,
                /**动作*/
                action: "select"
            };

            eNursing.sendMsg("gFormService.getLastGFormList", [{"gForm":gFormParam}], param, "", function (result) {
                if (result.resultMsg.success) {
                    var gForms = result.data;
                    if (window.console) console.log(gForms);
                    successCall(gForms);
                } else {
                    eNursing.F2ReportErrorMsg(result.resultMsg);
                }

            }, errorCall);
        };

        //查询GForm清單 (根據篩選條件)
        /**
         *
         * String formType (必要)
         * String sourceId (必要，與sourceIds擇一)
         * String[] sourceIds (必要，與sourceId擇一)
         * String formId
         * Date beginDate (evaluationTime)
         * Date endDate (evaluationTime)
         * String beginTotalScore (totalScore)
         * String endTotalScore (totalScore)
         * Date beginCreateTime (createTime)
         * Date endCreateTime (createTime)
         * String status (Y N D)
         * String[] statusArr (Y,N,D)
         * String modifyUserId
         * String modifyUserName
         * Date beginModifyTime (modifyTime)
         * Date endModifyTime (modifyTime)
         * int beginVersionNo (versionNo)
         * int endVersionNo (versionNo)
         *
         * String itemCondition
         * (ex. ({AssessmentDate}>='2018-01-01'AND {AssessmentDate}<='2019-12-31') )
         *    轉換↓↓↓
         * (ex. (gfi2.itemkey='AssessmentDate' AND gfi2.itemvalue >= '2019-06-29')AND (gfi2.itemkey='AssessmentDate' AND gfi2.itemvalue <= '2019-06-29 24') )
         *
         * int itemConditionHitCounts (至少命中幾項)
         *
         * Boolean hasContent (是否查詢Gform的content欄位)
         *
         * @param map(String,Object)
         * @author JhengJyun
         * @date 2019/7/3 15:23
         */
        this.getGFormListWithCondition = function (gFormParam, successCall, errorCall) {
            var param = {
                /**不同数据*/
                node: "getGFormListWithCondition."+eNursing.UUID(),
                /**动作*/
                action: "select"
            };

            var itemCondition = gFormParam.searchParamGF.itemCondition;

            //計算至少命中數量
            gFormParam.searchParamGF.itemConditionHitCounts = this.calItemConditionHitCounts(gFormParam.searchParamGF.itemConditionHitCounts, itemCondition);

            //轉換 itemCondition
            gFormParam.searchParamGF.itemCondition=this.convertToItemCondition(itemCondition);

            eNursing.sendMsg("gFormService.getGFormListWithCondition", [{"gForm":gFormParam}], param, "", function (result) {
                if (result.resultMsg.success) {
                    var gForms = result.data;
                    if (window.console) console.log(gForms);
                    successCall(gForms);
                } else {
                    eNursing.F2ReportErrorMsg(result.resultMsg);
                }
                gFormParam.searchParamGF.itemConditionHitCounts=0;
            }, errorCall);
        };

        //查询GForm清單 (增強版) (根據篩選條件)
        /**
         * 同 getGFormListWithCondition
         * 拔掉 hasContent 屬性 (一律查詢content)
         *
         * ##多了以下
         * 查詢sql第n筆~第m筆
         * 從 beginIndex 開始查 counts筆
         * 僅限 getGFormListWithConditionPlus()
         * String counts; //查詢c筆
         * String beginIndex; //從第n筆開始查
         *
         * @param map(String,Object)
         * @author JhengJyun
         * @date 2020/4/19 17:47
         */
        this.getGFormListWithConditionPlus = function (gFormParam, successCall, errorCall) {
            var param = {
                /**不同数据*/
                node: "getGFormListWithConditionPlus."+eNursing.UUID(),
                /**动作*/
                action: "select"
            };

            var itemCondition = gFormParam.searchParamGF.itemCondition;

            //計算至少命中數量
            gFormParam.searchParamGF.itemConditionHitCounts = this.calItemConditionHitCounts(gFormParam.searchParamGF.itemConditionHitCounts, itemCondition);

            //轉換 itemCondition
            gFormParam.searchParamGF.itemCondition=this.convertToItemCondition(itemCondition);

            eNursing.sendMsg("gFormService.getGFormListWithConditionPlus", [{"gForm":gFormParam}], param, "", function (result) {
                if (result.resultMsg.success) {
                    var gForms = result.data;
                    if (window.console) console.log(gForms);
                    successCall(gForms);
                } else {
                    eNursing.F2ReportErrorMsg(result.resultMsg);
                }
                gFormParam.searchParamGF.itemConditionHitCounts=0;
            }, errorCall);
        };

        //計算至少命中數量
        this.calItemConditionHitCounts = function (itemConditionHitCounts, itemCondition) {
            if (itemConditionHitCounts){
                return itemConditionHitCounts;
            }else{
                var hitCounts = itemCondition.toLowerCase().match(/\{\w+\}/gi);
                hitCounts = (hitCounts!=null) ? hitCounts.filter(function(element, index, arr){
                    return arr.indexOf(element) === index;
                }) : [""];
               return hitCounts.length; //至少命中幾項
            }
        };

        //轉換 itemCondition
        this.convertToItemCondition = function (st) {

            var regex;
            console.log(st);

            //between
            regex = /\{(\w+)\}\s*between\s*\'([^\']*)\'\s+and\s+\'([^\']*)\'/gi;  //["{tr_date} between '2019-06-29' and '2019-06-29 24'"]
            st = st.replace(regex, "(gfi2.itemkey='$1' AND gfi2.itemvalue BETWEEN '$2' AND '$3')");

            //=,>=,<=,<>,>,<,like
            //{rep_nurse} like '%T31371%'
            //{site}>='700'
            regex = /\{(\w+)\}\s*([>|=|<|like]+)\s*\'([^\']*)\'/gi;
            st = st.replace(regex, "(gfi2.itemkey='$1' AND gfi2.itemvalue $2 '$3')");

            //in
            regex = /\{(\w+)\}\s*in\s*\(([^\)]*)\)/gi;  //{formcode} in ('FRC','LDC','DFC','HPI','DPA','DFA','VAC')
            st = st.replace(regex, "(gfi2.itemkey='$1' AND gfi2.itemvalue in ($2))");

            //||
            regex = /\|\|/gi;
            st = st.replace(regex, " OR ");
            console.log(st);
            return st;
        };

        //依據 formId、formType 取得單張Gform
        this.getSingleGForm = function (gFormParam, successCall, errorCall) {
            var param = {
                /**不同数据*/
                node: "SingleGForm."+gFormParam.searchParamGF.formType+"."+gFormParam.searchParamGF.formId,
                /**动作*/
                action: "select"
            };
            gFormParam.searchParamGF.encounterId="getSingleGForm";

            eNursing.sendMsg("gFormService.getSingleGForm", [{"gForm":gFormParam}], param, "", function (result) {
                if (result.resultMsg.success) {
                    var gForms = result.data;
                    if (window.console) console.log(gForms);
                    successCall(gForms);
                } else {
                    eNursing.F2ReportErrorMsg(result.resultMsg);
                }

            }, errorCall);
        };


        //刪除GForm  (表單主鍵 oldFormId, sourceId, 是否不要提示訊息)
        this.deleteGForm = function (gFormParam, successCall, errorCall, isDontConfirm) {
            var msg = (languageMode=="Traditional Chinese") ? "確定要刪除嗎?" : (languageMode=="Simplified Chinese") ? "确定要删除吗?" : "确定要删除吗?";

            if (isDontConfirm || confirm(msg)){
                var param = {
                    /**不同数据*/
                    node: "deleteGForm."+gFormParam.formType+"."+gFormParam.formId,
                    /**动作*/
                    action: "delete"
                };
                var data=[];
                var gFormData={"gForm":gFormParam};
                if(gForm_Title){
                    gFormData.title=gForm_Title; //app--title离线缓存使用
                }
                data.push(gFormData);
                eNursing.sendMsg("gFormService.deleteGForm", data, param, "", function (result) {
                    if (result.resultMsg.success) {
                        successCall();
                    } else {
                        eNursing.F2ReportErrorMsg(result.resultMsg);
                    }
                }, errorCall);
            }
        };

        this.autoProcessGFormData = function (paramMap, successCall, errorCall) {
            var param = {
                /**不同数据*/
                node: "autoProcessGFormData."+paramMap.action+"."+paramMap.formType+"."+paramMap.formVersionId,
                /**动作*/
                action: "select"
            };

            eNursing.sendMsg("gFormService.autoProcessGFormData", paramMap, param, "", function (result) {
                if (result.resultMsg.success) {
                    var gForms = result.data;
                    if (window.console) console.log(gForms);
                    successCall(gForms);
                } else {
                    eNursing.F2ReportErrorMsg(result.resultMsg);
                }

            }, errorCall);
        };

        this.getExtendGFormData = function (paramMap, successCall, errorCall) {
            var param = {
                /**不同数据*/
                node: "getExtendGFormData."+paramMap.action+"."+paramMap.formType+"."+paramMap.formVersionId,
                /**动作*/
                action: "select"
            };

            eNursing.sendMsg("gFormService.getExtendGFormData", paramMap, param, "", function (result) {
                if (window.console)console.log('gForm.getExtendGFormData',paramMap,result);
                if (result.resultMsg.success) {
                    var gForms = result.data;
                    successCall(gForms);
                } else {
                    eNursing.F2ReportErrorMsg(result.resultMsg);
                }

            }, errorCall);
        };


        //新增或修改 GForm
        this.addOrUpdateGForm = function (gFormParam, successCall, errorCall) {
            gFormParam.gformItemMap={};
            var param = {
                /**不同数据*/
                node: "addOrUpdateGForm."+gFormParam.formType+"."+(gFormParam.formId||""),
                /**动作*/
                action: (gForm_Title||thisPageStatus==="UPD")?"update":"add"
            };
            var data=[];
            var gFormData={"gForm":gFormParam};
            if(gForm_Title){
                gFormData.title=gForm_Title; //app--title离线缓存使用
            }
            data.push(gFormData);
            eNursing.sendMsg("gFormService.addOrUpdateGForm", data, param, "", function (result) {
                if (result.resultMsg.success) {
                    if (window.console) console.log(result);
                    var gForms = result.data;
                    if (window.console) console.log(gForms);
                    if(gForms){
                        for (i=0, len=gForms.length; i<len; i++){
                            var gForm = gForms[i].gForm;
                            var items = gForm.gformItems;
                            var formItems = {};
                            if (items){
                                for (i2=0, len2=items.length; i2<len2; i2++){
                                    formItems[items[i2].itemKey]={
                                        "itemValue" : items[i2].itemValue,
                                        "otherValue" : items[i2].otherValue
                                    };
                                }
                            }
                            gForm.gformItemMap=formItems;
                        }
                        if (window.console) console.log(gForms);
                    }
                    successCall(gForms);
                } else {
                    eNursing.F2ReportErrorMsg(result.resultMsg);
                    if (errorCall) errorCall(result.resultMsg);
                }

            }, errorCall);
        };

        //把url上，get的參數取出變成json (如沒有multiLevel，自動補上)
        this.getUrlSessionToJson = function(){
            var params=location.href.split("?")[1];
            if (params){
                params=params.split(/[&=]/g);
                var json={};
                for (var i=0, len=params.length; i<len; i+=2){
                    json[params[i]]=params[i+1];
                }
                json.multiLevel=json.multiLevel?json.multiLevel:"";
                return json;
            }else{
                return {multiLevel:""};
            }
        }

        //產生GForm的formId
        this.getGFormId = function (gFormParam, successCall, errorCall) {
            var param = {
                /**不同数据*/
                node: "GForm.getGFormId."+UUID(),
                /**动作*/
                action: "select"
            };

            eNursing.sendMsg("gFormService.getGFormId", [{"gForm":gFormParam}], param, "", function (result) {
                if (result.resultMsg.success) {
                    if (window.console) console.log(result);
                    successCall(result.data[0].gForm.searchParamGF.formId);
                } else {
                    eNursing.F2ReportErrorMsg(result.resultMsg);
                }

            }, errorCall);

            function UUID(len, radix) {
                var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
                var uuid = [], i;
                radix = radix || chars.length;

                if (len) {
                    // Compact form
                    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
                } else {
                    // rfc4122, version 4 form
                    var r;

                    // rfc4122 requires these characters
                    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
                    uuid[14] = '4';

                    // Fill in random data. At i==19 set the high bits of clock sequence as
                    // per rfc4122, sec. 4.1.5
                    for (i = 0; i < 36; i++) {
                        if (!uuid[i]) {
                            r = 0 | Math.random() * 16;
                            uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
                        }
                    }
                }
                return uuid.join('');
            }
        };

        this.uploadToMergerGform=function (eleFileId, fileInfo, successCall, errorCall) {
            var fileStore = nursing.getFileStore();
            fileStore.doUploadFile(eleFileId, fileInfo, successCall, errorCall); //改走統一入口

            //暫時拿掉試試看 by jhengjyun 20201026
            /*
            var files = document.getElementById(eleFileId);

            var emptyMsg = (languageMode=="Traditional Chinese") ? "請選擇檔案" : (languageMode=="Simplified Chinese") ? "请选择档案" : "请选择档案";
            //2019.10.04 正峻 為規避大檔案產生的記憶體問題，目前已統一走下面那段
            { //無FileReader可用，以form上傳的方式 (不支援離線)
                try{
                    if (files.value===""){
                        alert(emptyMsg);
                        return false;
                    }
                    var form = $('<form method="POST" enctype="multipart/form-data" style="display:none" target="_blank"></form>');
                    form.attr("action", eNursing.serviceUrl.replace(/send\.do/, "fileUpload.do"));
                    $(files).before($(files).clone());
                    form.append($(files));
                    form.append($("input[name='statusIfError']:checked").clone());
                    form.append('<input type="text" name="states" value="'+fileInfo.states+'"/>');
                    form.append('<input type="text" name="sysModel" value="'+fileInfo.sysModel+'"/>');
                    form.append('<input type="text" name="storeType" value="'+fileInfo.storeType+'"/>');
                    form.append('<input type="text" name="gformServiceUrl" value="'+const_gformServiceUrl+'"/>');

                    $("body").append(form);
                    form.submit();
                    form.remove();
                    if (successCall) successCall();
                }catch(e){
                    if (errorCall) errorCall(e);
                }
            }
            */
        };
        this.downloadGformToFile=function (gFormParam, successCall, errorCall) {
            var param = {
                /**不同数据*/
                node: "downloadGformToFile."+eNursing.UUID(),
                /**动作*/
                action: "select"
            };

            /*********轉換 itemCondition 開始********/
            var itemCondition = gFormParam.searchParamGF.itemCondition;
            var regex;


            //計算至少命中數量
            gFormParam.searchParamGF.itemConditionHitCounts = this.calItemConditionHitCounts(gFormParam.searchParamGF.itemConditionHitCounts, itemCondition);

            //轉換 itemCondition
            gFormParam.searchParamGF.itemCondition=this.convertToItemCondition(itemCondition);
            /*********轉換 itemCondition 結束********/

            try{
                var form = $('<form method="POST" enctype="multipart/form-data" style="display:none" target="_blank"></form>');
                form.attr("action", eNursing.serviceUrl.replace(/send\.do/, "fileDownload.do"));
                form.append('<textarea name="gFormParam">'+eNursing.toJson(gFormParam)+'</textarea>');
                form.append('<input type="text" name="gformServiceUrl" value="'+const_gformServiceUrl+'"/>');
                $("body").append(form);
                form.submit();
                form.remove();
                if (successCall) successCall();
            }catch(e){
                if (errorCall) errorCall(e);
            }
        };
        /**
         * [用 getExtendGFormList 查詢並下載成excel]
         * @type {JSON}
         * gFormParam = {
                fileName : 檔名,
                formType : gForm表單formType,
                action : 此路徑下的 [formType].[action] -> /WEB-INF/formTemplate/formConfig.properties,
                [param] : (可選N個)其他你在XML裡定義要傳入的參數
            }
         * Ex:
            gFormParam = {
                fileName : "TSR_個案資料",
                formType : "TSR-Form",
                action : "exportExcel",
                encId : "aa",
                docId : "bb"
            }
         */
        this.downLoadGformToFile_byGetExtendGFormList=function (gFormParam, successCall, errorCall) {
            var param = {
                /**不同数据*/
                node: "downLoadGformToFile_byGetExtendGFormList."+eNursing.UUID(),
                /**动作*/
                action: "select"
            };

            try{
                var form = $('<form method="POST" enctype="multipart/form-data" style="display:none" target="_blank"></form>');
                form.attr("action", eNursing.serviceUrl.replace(/send\.do/, "fileDownload.do"));
                form.append('<textarea name="gFormParam">'+eNursing.toJson(gFormParam)+'</textarea>');
                form.append('<input type="text" name="gformServiceUrl" value="'+const_gformServiceUrl+'"/>');
                form.append('<input type="text" name="method" value="downLoadGformToFile_byGetExtendGFormList"/>');
                $("body").append(form);
                form.submit();
                form.remove();
                if (successCall) successCall();
            }catch(e){
                if (errorCall) errorCall(e);
            }
        };
        this.checkPermissions=function (userPermInfo, successCall, errorCall) {
            userPermInfo.userId = window.localStorage["gForm_userId"];
            var param = {
                /**不同数据*/
                node: "checkPermissions."+userPermInfo.userId+"."+userPermInfo.permApp+"."+userPermInfo.permRes,
                /**动作*/
                action: "select"
            };
            eNursing.sendMsg("gFormService.checkPermissions", userPermInfo, param, "", function (result) {
                if (result.resultMsg.success) {
                    if (successCall) successCall(result.data[0].userPermInfo);
                } else {
                    eNursing.F2ReportErrorMsg(result.resultMsg);
                }

            }, errorCall);

        };
    }
    eNursing.addModule(GForm);

    /**查尋條件**/
    function SearchParamGF() {
        this.nodeId = eNursing.getFnName(SearchParamGF);
        //String 查询sourceId
        this.sourceId = null;
        //String[] 查询sourceIds
        this.sourceIds = [];
        //String 查询表單类型
        this.formType = null;
        //Date 查询开始时间
        this.beginDate = null;
        //Date 查询结束时间
        this.endDate = null;
        //String 查询表單對應頁面
        this.frameModel = null;
        //String 查询表單ID
        this.formId = null;
        //String 查询表單版本號
        this.versionNo = null;
        //String 登入者ID
        this.userId = null;
        //String 登入者姓名
        this.userName = null;
        //暫時的
        this.encounterId = null;
        //是否包含content--true,false
        this.hasContent = null;
        //String 查询分數區間 (小)
        this.beginTotalScore = null;
        //String 查询分數區間 (大)
        this.endTotalScore = null;
        //Date 查询創建日期區間 (開始)
        this.beginCreateTime = null;
        //Date 查询創建日期區間 (結束)
        this.endCreateTime = null;
        //String 查询表單狀態 Y N D
        this.status = null;
        //String[] 查询表單狀態 Y,N,D
        this.statusArr = null;
        //String 查询表單編輯者ID
        this.modifyUserId = null;
        //String 查询表單編輯者姓名
        this.modifyUserName = null;
        //Date 查询編輯日期區間 (開始)
        this.beginModifyTime = null;
        //Date 查询編輯日期區間 (結束)
        this.endModifyTime = null;
        //int 查询表單版本號區間(小)
        this.beginVersionNo = -1;
        //int 查询表單版本號區間(大)
        this.endVersionNo = -1;
        //查询表單formItem(篩選條件 ex. (itemkey='pt_code' AND itemvalue = '') OR (itemkey='site' AND itemvalue = '7String 00')
        this.itemCondition = null;
        //int 查询表單formItem(至少命中幾項)
        this.itemConditionHitCounts = 0;
    }
    eNursing.addModule(SearchParamGF);

    /**GFormItem**/
    function GFormItem() {
        this.nodeId = eNursing.getFnName(GFormItem);
        //String 主键
        this.formItemId = null;
        //String 未知
        this.formId = null;
        //String 未知
        this.itemKey = null;
        //String 未知
        this.itemValue = null;
        //String 未知
        this.otherValue = null;
        //Date 未知
        this.modifyTime = null;
    }
    eNursing.addModule(GFormItem);
}(eNursing);
