!function () {
    function ApiModule() {
        this.nodeId = eNursing.getFnName(ApiModule);
        var thisApi = this
        //查詢propAPIListForm用---------------
        // sourceId 醫院英文代號 用於取得 API清單 propAPIListForm
        this.sourceId = null;
        // formType api設定清單
        this.formType = 'propAPIListForm';
        // formId 用於更新api清單
        this.formId = null;
        // runMode 執行模式(F:前,M:中,BT:後(正式),B:後,DY:刪除(正式),D:刪除)
        this.runMode = [];
        // status API清單 的status
        this.status = null;
        // 從api取得的原始資料
        this.result = null;
        // 從api取得的原始資料成功與否的資訊
        this.resultMsg = null;
        // API名稱
        this.apiName = null;
        // API中文敘述
        this.apiDescription = null;
        /**
         * 網域 - 每台公司伺服器的網域可能不同，與API路徑拆開的話方便統一replace
         * @type {object}
         * *
            {
              "cs": "(domain):(port)/(nis)",
              "cs": "{dynamicUrl}", //自身網域 -> url.split('/')[0]+url.split('/')[1]
              "domain1": "http://255.255.255.255/example",
              "domain2": "http://eip.sltung.com.tw",
              "domain3": "….",
            }
         */
        this.domain = {};
        /**
         * API路徑
         * @type {object}
             {
              "cs": "/user/login.do",
              "domain1": "/Controller/getPatient",
              "domain2": "/EIP/gows.php",
              "domain3": "….",
              …
            }
         */
        this.url = {};
        // method request方法
        this.method = 'POST';
        // contentType 傳入參數類型
        this.contentType = 'application/json; charset=utf-8';
        // async 非同步
        this.async = true;
        // dataType 接收參數類型
        this.dataType = 'json';
        // connectUrl api 連接路徑(最終溝通使用)
        this.connectUrl = '';
        /**
         * 轉換傳入參數 - key值即參數的key，照method順序轉換value
         * @type {object}
            method ->
                 trim=(null) 去掉前後空白
                 replace=(array) 替換指定文字a變為b，index(2n)為a、index(2n+1)為b
         ex.
            {
               "phistnum" : {
                  "method" : ["trim"]
               },
               "gender" : {
                  "method" : ["trim", "replace"],
                  "replace" : ["F","男生","M","女生"]
               }
            }
         */
        this.sendReplacing = {};

        /**
         * 傳入參數前處理 - 可為空陣列，按順序執行
         * @type {[]}
            base64 encode - base64編碼
            url encode - url編碼
            JSON to String - JSON to 字串
            ex.
            ["base64 encode", "JSON to String"]
         */
        this.sendPreProcessing = [];
        /**
         * 輸入參數(For Api) - key值即參數名 Ex: phistnum,pcaseno
         * @type {}
         *
            "phistnum":
            {
                "value": "104007",              //輸入參數範例	必要節點，為空時會保留空值(兩個雙引號) ""
                "desc": "病歷號",                //輸入參數說明(中文對照名稱)	Ex:病歷號,住院號
                "source": "local:patientId"     //輸入參數來源	"不輸入就依照輸入參數名稱取得
                                                    本地(localStorage)
                                                    local:參數名稱
                                                    表單上(formBean)
                                                    bean:元件名稱"
            },
            "pcaseno":
            {
                "value": "30470158",
                "desc": "住院號",
                "source": "local:caseNo"
            }
        */
        this.sendParam = {};

        /**
         * 轉換輸出資料 - key值即執行完dataMapping後的key，照method順序轉換value
         * @type {object}
         method -> 同sendReplacing的method
         ex.
         {
               "NOTE" : {
                  "method" : ["trim"]
               },
               "MTN_DEPT" : {
                  "method" : ["trim", "replace"],
                  "replace" : ["3058","3058門診"]
               }
            }
         */
        this.receiveReplacing = {};
        /**
         * 輸出資料前處理 - 可為空陣列，按順序執行
         * @type {[]}
         *   base64 decode - 反解base64
             url decode - 反解url編碼
             String to JSON - 字串 to JSON
             ex.
             ["base64 decode", "String to JSON"]
         */
        this.receivePreProcessing = [];
        /**
         * 輸出參數 - 結構依API不同而有不同
         * 目前根節點不接受array，因必須要有判定是否查詢成功的辨識節點(即targetCheck指定檢核位置)
         * 每個key值下都會有一段說明，其中'value'即原始的api回傳值
         * @type {object}
         *
             value	            (範例值) 原始的api回傳值 	必要節點，為空時會保留空值(兩個雙引號) ""
             type	            資料型態	                非必要節點
             desc	            範例值說明	            非必要節點
             ui-value	        (值域) 回傳值的組合	    非必要節點
             ui-desc	        值域說明	非必要節點

             is-check	        此節點是否是指定檢核位置	非必要節點，限定type不為array或json且ui-value有值的才可設定為true
             check-type	        根據ui-value設定每個value對應到api取得的狀態
                                非必要節點，與is-check共同存在
                                陣列，共三種值，success | error | other
                                success-> 成功，繼續完成後續動作
                                error-> 失敗，return {type: ""error"", msg: 訊息節點(check-message = true 的節點值)}
                                other-> 其他，return {type: ""other"", msg: 訊息節點(check-message = true 的節點值)}"
             is-check-message	此節點是否是api訊息節點
                                非必要節點，限定type不為array或json才可設定為true
                                當檢核位置的值為error或else時，將會return此節點的value"

             is-bean	        此節點是否作為資料取出	    非必要節點，可設為true
             bean-mapping	    取出後要轉換的key值	    非必要節點，與is-data共同存在
         {
          "val": {
            "value": {
              "WEIGHT": {
                "value": 78,
                "type": "float",
                "desc": "體重",
                "is-bean": "true",
                "bean-mapping": "weight"
              },
              "HEIGHT": {
                "value": 177,
                "type": "float",
                "desc": "身高",
                "is-bean": "true"
              }
            },
            "type": "object"
          },
          "sts": {
            "value": "000000",
            "type": "string",
            "desc": "狀態代碼",
            "ui-value": "000000|,|E00004|,|E00003|,|E00001",
            "ui-desc": "查詢成功|,|發生錯誤|,|查無資料|,|傳入參數有誤",
            "is-check": "true",
            "check-type": "success|,|error|,|other|,|other"
          },
          "msg": {
            "value": "查詢成功",
            "type": "string",
            "desc": "狀態說明",
            "is-check-message": "true"
          }
        }
         */
        this.receiveParam = {};
        /**
         * targetCheck 指定檢核位置
         * 三個參數說明：
         * errorKey     => 指定檢核錯誤代號或是否錯誤 (若無代號採直接顯示錯誤訊息的，則可不填)
         * isError      => 若有錯誤代碼及是否錯誤，則填入對應錯誤的結果 (若 errorKey 沒填，這裡也不用填)
         * errorMessage => 指定錯誤訊息的位置 (若 errorKey & isError 沒填則會以此為檢核點，若指定的位置有資料代表錯誤)
         * Ex: 內/外部 api 回傳資料格式
         * {
         *     errorCode: 0,
         *     errorMsg: "",
         *     data: []
         * }
         * defined Example:
         * targetCheck = {
         *     errorKey: "errorCode",       // 指定回傳格式內 errorCode 為檢核代號
         *     isError: "1",                // 錯誤代號 1 代表錯誤
         *     errorMessage: "errorMsg"     // 指定回傳格式內的 errorMsg 為錯誤訊息
         * }
         */
        this.targetCheck = null;
        /**
         * targetData 指定資料位置及所需要的名稱
         * 參數說明：
         * fn   =>  預設 default, 若需要自行寫 function 則可直接指定函數名稱
         * 依照所需要的結構名稱進行命名
         * 如範例一: 需要輸出結構為 user 則以 user 作為 Key 值
         * value 的部分採用點分割，依照節點名稱向下深入選取節點
         * 若為 gForm 格式可直接放入 gForm 名稱
         * 詳細看範例說明。
         * Ex1: 內/外部 api 回傳資料格式
         * {
         *     result: {
         *         user: {
         *             id: "a001",
         *             userName: "amen"
         *         },
         *         patient: [
         *             {
         *                 pcaseno: "12345678",
         *                 phistnum "87654321",
         *                 patientName: "xxx"
         *             },
         *             {
         *                 pcaseno: "87654321",
         *                 phistnum "12345678",
         *                 patientName: "yyy"
         *             }
         *         ]
         *     }
         * }
         * defined Example:
         * targetData = {
         *     fn: "default" | function() {},
         *     user: "result.user",         // key 為輸出節點 value 為上述回傳格式節點的名稱向內選取
         *     patient: "result.patient"
         * }
         * Ex2: gForm 格式
         * [
         *      {
         *          gForm: {
         *              formType: "",
         *              gformItemMap: {
         *                  a: {
         *                      itemKey: a,
         *                      itemValue: aValue
         *                  }
         *              },
         *              gformItems: [
         *
         *              ]
         *          }
         *      }
         * ]
         * defined Example:
         * targetData = {
         *     formType: "gForm.formType",          // 若回傳為陣列也一樣採取相同方式進行選取
         *     gformItemMap: "gForm.gformItemMap"
         * }
         * or
         * targetData: {
         *     gForm: "gForm"  // gForm 結構也可直接命名
         * }
         */
        this.targetData = null;
        /**
         * ============ Description ============
         * beanMapping 元件設定節點名稱
         * 參數說明：
         * fn   =>  預設 default, 若需要自行寫 function 則可直接指定函數名稱
         * 若輸出結構沒特別設定元件名稱，
         * 將會使用原有結構當作元件名稱，
         * 若在此物件有設定元件名稱，
         * 將會把節點上的名稱改變為使用此元件名稱
         * Ex:
         * {
         *     patient: {
         *         name: 'xxx',
         *         gender: 'female',
         *         birthday: '1999/01/01'
         *     }
         * }
         * beanMapping = {
         *     fn:  'default' | function() {},
         *     name: 'patientName',
         *     gender: 'patientSex',
         *     PCASENO: 'encId'
         * }
         * 之後輸出 gForm 節點時就會以 patientName & patientSex 為節點
         * gformItemMap: {
         *     patientName: {}, // 有命名使用命名
         *     patientSex: {},
         *     birthday: {}     // 無命名使用原本
         * }
         */
        this.beanMapping = null;
        // 指定資料位置及所需要的名稱 - 名稱也用作轉換gForm的itemKey，具體作法參照excel
        this.dataMapping = null;
        // 使用者自訂
        this.userDefined = {"dataMapping": null};
        // backend api and exchange api
        // sendData 傳入參數
        this.sendData = null;
        // needAutoSetting 是否要自動賦值 (須遵守 gForm 賦值規則) (預設 true)
        this.needAutoSetting = true;
        // needGFormStructure 是否需要 gForm 結構 (預設 true)
        this.needGFormStructure = true;

        // ============= function here =============
        this.fn = {};
        /**
         * 設定apiModule
         * @param {gForm} apiGform 從api設定庫裡拿到的gForm
         */
        this.fn.setApiModule = function (apiGform) {
            console.log(apiGform);
            var map = apiGform.gformItemMap;
            thisApi.sourceId = apiGform.sourceId || '';
            thisApi.formId = apiGform.formId || '';
            thisApi.apiName = (map.apiName) ? map.apiName.itemValue || thisApi.apiName : thisApi.apiName
            thisApi.apiDescription = (map.apiDescription) ? map.apiDescription.itemValue || '' : '';
            thisApi.runMode = (map.runMode && map.runMode.itemValue) ? map.runMode.itemValue.split(',') || [] : [];
            thisApi.domain = (map.domain && map.domain.itemValue) ? JSON.parse(map.domain.itemValue) : {};
            thisApi.url = (map.url && map.url.itemValue) ? JSON.parse(map.url.itemValue) : {};
            thisApi.method = (map.method) ? map.method.itemValue || 'POST' : 'POST';
            thisApi.contentType = (map.contentType) ? map.contentType.itemValue || 'application/json; charset=utf-8' : 'application/json; charset=utf-8';
            thisApi.async = (map.async && map.async.itemValue) ? map.async.itemValue !== "false" : true;
            thisApi.dataType = (map.dataType) ? map.dataType.itemValue || 'json' : 'json';
            thisApi.userDefined = (map.userDefined && map.userDefined.itemValue) ? JSON.parse(map.userDefined.itemValue) : {"dataMapping": null};
            thisApi.sendReplacing = (map.sendReplacing && map.sendReplacing.itemValue) ? JSON.parse(map.sendReplacing.itemValue) : {};
            thisApi.sendPreProcessing = (map.sendPreProcessing && map.sendPreProcessing.itemValue) ? JSON.parse(map.sendPreProcessing.itemValue) : [];
            thisApi.sendParam = (map.sendParam && map.sendParam.itemValue) ? JSON.parse(map.sendParam.itemValue) : {};
            thisApi.receivePreProcessing = (map.receivePreProcessing && map.receivePreProcessing.itemValue) ? JSON.parse(map.receivePreProcessing.itemValue) : [];
            thisApi.receiveParam = (map.receiveParam && map.receiveParam.itemValue) ? JSON.parse(map.receiveParam.itemValue) : {};
            thisApi.receiveReplacing = (map.receiveReplacing && map.receiveReplacing.itemValue) ? JSON.parse(map.receiveReplacing.itemValue) : {};
            thisApi.needAutoSetting = (map.needAutoSetting && map.needAutoSetting.itemValue) ? map.needAutoSetting.itemValue : true;
            thisApi.needGFormStructure = (map.needGFormStructure && map.needGFormStructure.itemValue) ? map.needGFormStructure.itemValue : true;
        };

        /**
         * 初始化 api
         * =
         * 1.讀入 formVersion apiStructure 節點
         *
         * 2.取得物件內的 formName 與 sourceId 進行查詢
         *
         * 3.將查詢出來的 gForm 與 api 物件結構進行差異比對
         *
         * 4.以 api 結構為主 gForm 結構為輔組成新的 gForm 結構
         *
         * 5.設定 api 觸發時機 (包含前、中、後)
         *
         * 6.處理前觸發的 api (呼叫)
         *
         * 7.完成 api 相關設定
         * @param {Object} apiStructure
         * @return {Object} apiModule
         */
        this.fn.init = function (apiStructure, successCall, errorCall) {
            // Step1. 檢核 apiStructure
            if (apiStructure === undefined) {
                console.error('init() error: apiStructure required.');
                return;
            }
            // Step2. 查詢
            // thisApi.formName = apiStructure.formName;
            thisApi.sourceId = apiStructure.sourceId;
            thisApi.apiName = apiStructure.apiName;
            thisApi.fn.getSingleApi(
                function(result) {
                    // Step3. 將查詢結果與原結構比對
                    var finalGForm = thisApi.fn.comparisonObjectWithGForm(apiStructure, result);
                    console.log("finalGForm");
                    console.log(finalGForm);
                    // Step4. 組成新的 gForm 結構並回綁 apiModule
                    thisApi.fn.setApiModule(finalGForm);
                    successCall(thisApi);
                },
                function(error) {
                    console.error('init() error: ' + error);
                    errorCall(error);
                }
            );
        }

        /**
         * 設定 api 網址
         */
        this.fn.setUrl = function() {
            var apiDomain = 'cs'
            try {
                if (const_apiDomainSetting === undefined) console.error('setUrl() error: apiDomainSetting undefined, use default setting.');
                apiDomain = const_apiDomainSetting;
            } catch (e) {
                console.error('setUrl() error: apiDomainSetting undefined, use default setting.');
            }
            thisApi.connectUrl = thisApi.domain[apiDomain] + thisApi.url[apiDomain];
            if (thisApi.connectUrl.indexOf('{dynamicUrl}')>-1) {
                thisApi.connectUrl = thisApi.connectUrl.replace(/\{dynamicUrl\}/g, location.origin + '/' + location.pathname.split('/')[1]);
            }
        }

        /**
         * 設定傳入參數
         * @returns {Boolean}
         */
        this.fn.setSendData = function () {
            var failMsg = '設定傳入參數 發生錯誤 -> ';
            var json = {};
            //取得gFormItemMap
            needCheck = false;
            var itemMap = nursing.createGForm().setGFormItemMap({"gformItems": dynamicFormSave_getItems($("<div/>")[0], false).items}).gformItemMap;
            // 根據apiModule拼裝傳參
            for (var node in thisApi.sendParam) {
                var nodeItem    = thisApi.sendParam[node];
                var nodeSource  = nodeItem.source; // local:phistnum | form:beanName | eleId:1003727 | gFormData | fixed
                if (nodeSource && nodeSource.indexOf(':') > -1) {
                    var nodeArray = nodeSource.split(':');
                    switch (nodeArray[0]) {
                        case 'local':
                            // 事先存於 localStorage 的值，如病歷號
                            if (localStorage[nodeArray[1]] === undefined) console.error(failMsg + 'localStorage undefined: ' + nodeArray[1]);
                            json[node] = localStorage[nodeArray[1]];
                            break;
                        case 'form':
                            // 從當前表單上取得bean的value
                            if (!itemMap[nodeArray[1]]) {
                                json[node] = '';
                            } else {
                                json[node] = itemMap[nodeArray[1]].itemValue || '';
                            }
                            break;
                        case 'eleId':
                            // 當前表單上的element
                            json[node] = $('#'+nodeArray[1]).val();
                            break;
                        case 'gFormData':
                            // 完整gForm結構上的值，通常用於儲存表單"後"
                            if (!gForm || !gForm.gformItemMap || !gForm.gformItemMap[nodeArray[1]]) {
                                if (gForm[nodeArray[1]]) {
                                    json[node] = gForm[nodeArray[1]];
                                } else {
                                    json[node] = '';
                                }
                            } else {
                                json[node] = gForm.gformItemMap[nodeArray[1]].itemValue || '';
                            }
                            break;
                        case 'fixed':
                            // 固定值，如狀態碼status
                            json[node] = nodeArray[1];
                            break;
                        default:
                            console.error(failMsg + '沒設定傳入參數來源方式: ' + nodeArray[0]);
                            return false
                            break
                    }
                }
            }
            thisApi.sendData = thisApi.fn.paramReplace(json, thisApi.sendReplacing);
        };

        //傳入參數前處理
        this.fn.setSendPreProcessing = function () {
            var failMsg = '傳入參數前處理 發生錯誤 -> ';
            for (var i = 0, len = thisApi.sendPreProcessing.length; i < len; ++i) {
                var method = thisApi.sendPreProcessing[i];
                try{
                    switch (method) {
                        //base64編碼
                        case 'base64 encode':
                            thisApi.sendData = base64.encode(thisApi.sendData);
                            break;
                        //url編碼
                        case 'url encode':
                            thisApi.sendData = encodeURI(thisApi.sendData);
                            break;
                        //JSON to 字串
                        case 'JSON to String':
                            thisApi.sendData = JSON.stringify(thisApi.sendData);
                            break;
                        default:
                            console.error(failMsg + '尚未註冊此方法: ' + method);
                            break;
                    }
                }catch(e){
                    console.error('sendData', thisApi.sendData, e);
                    throw failMsg + 'method=' + method;
                }
            }
        };

        //輸出資料前處理
        this.fn.setReceivePreProcessing = function () {
            var failMsg = '輸出資料前處理 發生錯誤 -> ';
            for (var i=0, len=thisApi.receivePreProcessing.length; i<len; ++i) {
                var method = thisApi.receivePreProcessing[i];
                try{
                    switch (method) {
                        //反解base64
                        case 'base64 decode':
                            thisApi.result = base64.decode(thisApi.result);
                            break;
                        //反解url編碼
                        case 'url decode':
                            thisApi.result = decodeURI(thisApi.result);
                            break;
                        //字串 to JSON
                        case 'String to JSON':
                            thisApi.result = JSON.parse(thisApi.result);
                            break;
                        default:
                            console.error(failMsg+'尚未註冊此方法: '+method);
                            break;
                    }
                }catch(e){
                    console.error('sendData', thisApi.result, e);
                    throw failMsg+'method='+method;
                }
            }
        };

        /**
         * 轉換參數，key值即參數的key，照method順序轉換value
         * @param {object} json 準備被替換的資料
         * @param {object} setting 替換的設定 sendReplacing receiveReplacing
         * @returns {{}}
         *
             method ->
                 trim=(null) 去掉前後空白
                 replace=(array) 替換指定文字a變為b，index(2n)為a、index(2n+1)為b
             {
               "phistnum" : {
                  "method" : ["trim"]
               },
               "gender" : {
                  "method" : ["trim", "replace"],
                  "replace" : ["F","男生","M","女生"]
               }
            }
         */
        this.fn.paramReplace = function (json, setting) {
            var failMsg = '轉換參數 發生錯誤 -> ';
            for (var key in setting) {
                var data = json[key];
                if (data===undefined||data===null) continue;
                for (var i=0, len=setting[key].method.length; i<len; ++i) {
                    var method = setting[key].method[i];
                    try{
                        switch (method) {
                            case 'trim':
                                data = data.trim();
                                break;
                            case 'replace':
                                var replaceArr = setting[key]['replace'+i];
                                for (var i2 = 0, len2 = replaceArr.length; i2 < len2; i2+=2) {
                                    var original = replaceArr[i2];
                                    var target = replaceArr[i2+1];
                                    if (eNursing.isString(data)) {
                                        data = (data==original) ? target : data;
                                    } else if (eNursing.isNumber(data)) {
                                        data = (data==original) ? target : data;
                                    } else if (eNursing.isBoolean(data)) {
                                        data = (data==original) ? target : data;
                                    } else if (Array.isArray(data)) {
                                        if (data.indexOf(original)>-1) {
                                            data[data.indexOf(original)] = target;
                                        }
                                    } else if (eNursing.isObject(data)) {
                                        console.error(failMsg+'尚未註冊此方法: '+method);
                                    } else {
                                        console.error(failMsg+'尚未註冊此方法: '+method);
                                    }
                                }
                                break;
                            default:
                                console.error(failMsg+'尚未註冊此方法: '+method);
                                break;
                        }
                    }catch(e){
                        console.error('data', data, e);
                        throw failMsg+'method='+method;
                    }
                }
                json[key] = data;
            }
            return json;
        };

        /**
         * 取得targetCheck檢核位置資訊
         * @returns {{typeKey: string[], typeDesc: string[], checkNode: string, msgNode: string, typeAttr: string[]}}
         */
        this.fn.getTargetCheck = function () {
            var failMsg = '取得targetCheck檢核位置資訊 發生錯誤 -> ';
            //從 receiveParam 中取得相關訊息
            /*
             目標路徑	checkNode	sts	來源：is-check
             檢核代號值域	typeKey	["000000", "E00001", "E00003", "E00004"]
                        陣列，每個值代表一種檢核代號
                        來源：ui-value"
             檢核代號屬性	typeAttr	["success", "error", "other", "other"]
                        陣列，每個值代表檢核代號所代表的意義
                        來源：check-type
                        success-> 成功，繼續完成後續動作
                        error-> 失敗，return {type: ""error"", msg: ""msgNode的值""}
                        other-> 其他，return {type: ""other"", msg: ""msgNode的值""}"
             檢核代號描述	typeDesc	["查詢成功", "傳入參數有誤", "查無資料", "發生錯誤"]
                        陣列，每個值代表一種檢核代號的中文描述
                        來源：ui-desc"
             訊息路徑	msgNode	msg
                        來源：is-check-message
             */
            // var json2 = {
            //     "checkNode": "sts",
            //     "typeKey": ["000000", "E00001", "E00003", "E00004"],
            //     "typeAttr": ["success", "error", "other", "other"],
            //     "typeDesc": ["查詢成功", "傳入參數有誤", "查無資料", "發生錯誤"],
            //     "msgNode": "msg"
            // };
            // console.log(json2);

            var json = {
                "checkNode": "",
                "typeKey": [],
                "typeAttr": [],
                "typeDesc": [],
                "msgNode": ""
            };
            //找到指定檢核位置
            var selector = thisApi.fn.findAttr(thisApi.receiveParam, 'is-check');
            if (selector.length===0) {
                throw failMsg+'尚未指定targetCheck檢核位置(is-check)'
            }else if (selector.length>1) {
                throw failMsg+'targetCheck檢核位置(is-check) 僅能指定1個'
            }
            selector = selector[0];
            //開始設定檢核位置
            if (!selector['ui-value']) throw failMsg+'尚未設定 值域(ui-value)';
            if (!selector['check-type']) throw failMsg+'尚未設定 檢查狀態(check-type)';
            json.checkNode = selector['node'];
            json.typeKey = selector['ui-value'].split('|,|');
            json.typeAttr = selector['check-type'].split('|,|');
            if (json.typeAttr.length!==json.typeKey.length) throw failMsg+'檢查狀態(check-type) 的數量必須與 值域(ui-value) 相同';
            if (!selector['ui-desc']){
                json.typeDesc = $.extend(true, [], json.typeAttr);
                } else {
                json.typeDesc = selector['ui-desc'].split('|,|');
            }
            if (json.typeDesc.length!==json.typeKey.length) throw failMsg+'值域說明(ui-desc) 的數量必須與 值域(ui-value) 相同';

            //找到api訊息節點
            var selector = thisApi.fn.findAttr(thisApi.receiveParam, 'is-check-message');
            if (selector.length===0) {
                throw '尚未指定api訊息節點(is-check-message)'
            }else if (selector.length>1) {
                throw 'api訊息節點(is-check-message) 僅能指定1個'
                }
            selector = selector[0];
            //開始設定api訊息節點
            json.msgNode = selector['node'];


            return json;
        };
        /**
         * 取得dataMapping指定資料位置及所需要的名稱 - 名稱也用作轉換gForm的itemKey，具體作法參照excel
         * @returns {{}}
         */
        this.fn.getDataMapping = function () {
            if (thisApi.userDefined.dataMapping !== null) return thisApi.userDefined.dataMapping;
            var failMsg = '取得dataMapping指定資料位置及所需要的名稱 發生錯誤 -> ';
            //有預設dataMapping的話就直接取用
            if (thisApi.dataMapping) {
                return thisApi.dataMapping;
            }
            //沒有預設，即時查找dataMapping
            var json = {};
            //從 receiveParam 中取得相關訊息
            /*
             key=轉換後的名稱
                來源：bean-mapping
                當bean-mapping沒設定時，預設以節點名稱當作key，當節點名稱有重複時，以節點路徑當作key
             node=api取得的節點路徑
                來源：is-bean
             type=資料型態
                來源：type
                當type未設定時，預設為string"
             */
            // json = {
            //     "no":        {
            //         "node": "val.SHT_NO",
            //         "type": "string"
            //     },
            //     "MTN_DEPT":    {
            //         "node": "val.MTN_DEPT",
            //         "type": "string"
            //     },
            // }
            //找到指定的bean節點
            var selector = thisApi.fn.findAttr(thisApi.receiveParam, 'is-bean');
            if (selector.length===0) {
                return json;
                // throw failMsg+'尚未指定作為資料取出的節點(is-bean)';
            }
            //開始設定bean節點
            for (var i=0, len=selector.length; i<len; ++i) {
                var node = selector[i], bean = {"node": "", "type": "", "desc": ""};
                var key = node.node.split('.');
                key = key[key.length-1].split('[')[0];
                bean.node = node.node;
                bean.desc = node.desc || '';
                bean.type = node.type || 'string';
                json[node['bean-mapping'] || key] = bean;
            }
            return json;
        };
        /**
         * 根據getDataMapping( )的轉換資訊，取得API上的值，並打平成新的key-value結構
         * @param {object} dataMapping 指定資料位置及所需要的名稱
         * @returns {object}
         */
        this.fn.getData = function (dataMapping) {
            var failMsg = '取得資料 發生錯誤 -> ';
            var json = {}, dataMapping = dataMapping || this.getDataMapping();
            var rs;
            if (Array.isArray(thisApi.result)) {
                rs = $.extend(true, [], thisApi.result);
            } else {
                rs = $.extend(true, {}, thisApi.result);
            }
            //從 result 中取得相關訊息
            // json = {
            //     "no":        "MR00-21",
            //     "MTN_DEPT":  "3058",
            //     "NOTE":      "2018.05.02經病委會同意新增CF1070501",
            //     "nam_a":     "腎臟科",
            //     "tObj":      {"tA":"1", "tB":2},
            //     "tA":        "1",
            //     "tB":        2,
            //     "tArr":      [10,23,77]
            // };

            for (var key in dataMapping) {
                var bean = thisApi.fn.findNode(rs, dataMapping[key].node);
                if (bean !== null) {
                    try {
                        switch (dataMapping[key].type) {
                            case 'string':
                                if (eNursing.isString(bean)) {
                                    bean = bean;
                                } else if (eNursing.isNumber(bean)) {
                                    bean = bean + '';
                                } else if (eNursing.isBoolean(bean)) {
                                    bean = bean + '';
                                } else if (Array.isArray(bean)) {
                                    bean = bean.join(',');
                                } else if (eNursing.isObject(bean)) {
                                    bean = JSON.stringify(bean);
                                } else {
                                    throw '轉換成string時發生錯誤'
                                }
                                break;
                            case 'int':
                                if (eNursing.isString(bean)) {
                                    bean = parseInt(bean, 10);
                                } else if (eNursing.isNumber(bean)) {
                                    bean = bean;
                                } else if (eNursing.isBoolean(bean)) {
                                    bean = (bean) ? 1 : 0;
                                } else if (Array.isArray(bean)) {
                                    throw '轉換成int時發生錯誤';
                                } else if (eNursing.isObject(bean)) {
                                    throw '轉換成int時發生錯誤';
                                } else {
                                    throw '轉換成int時發生錯誤'
                                }
                                break;
                                break;
                            case 'float':
                                if (eNursing.isString(bean)) {
                                    bean = parseFloat(bean);
                                } else if (eNursing.isNumber(bean)) {
                                    bean = bean;
                                } else if (eNursing.isBoolean(bean)) {
                                    bean = (bean) ? 1 : 0;
                                } else if (Array.isArray(bean)) {
                                    throw '轉換成float時發生錯誤';
                                } else if (eNursing.isObject(bean)) {
                                    throw '轉換成float時發生錯誤';
                                } else {
                                    throw '轉換成float時發生錯誤'
                                }
                                break;
                            case 'boolean':
                                if (eNursing.isString(bean)) {
                                    bean = (bean) ? true : false;
                                } else if (eNursing.isNumber(bean)) {
                                    bean = (bean) ? true : false;
                                } else if (eNursing.isBoolean(bean)) {
                                    bean = (bean) ? true : false;
                                } else if (Array.isArray(bean)) {
                                    bean = (bean.length > 0) ? true : false;
                                } else if (eNursing.isObject(bean)) {
                                    throw '轉換成boolean時發生錯誤';
                                } else {
                                    throw '轉換成boolean時發生錯誤'
                                }
                                break;
                            case 'array':
                                if (eNursing.isString(bean)) {
                                    bean = bean.split(',');
                                } else if (eNursing.isNumber(bean)) {
                                    bean = [bean];
                                } else if (eNursing.isBoolean(bean)) {
                                    bean = [bean];
                                } else if (Array.isArray(bean)) {
                                    bean = bean;
                                } else if (eNursing.isObject(bean)) {
                                    bean = [bean];
                                } else {
                                    throw '轉換成boolean時發生錯誤'
                                }
                                break;
                            case 'object':
                                if (eNursing.isString(bean)) {
                                    throw '轉換成object時發生錯誤'
                                } else if (eNursing.isNumber(bean)) {
                                    throw '轉換成object時發生錯誤'
                                } else if (eNursing.isBoolean(bean)) {
                                    throw '轉換成object時發生錯誤'
                                } else if (Array.isArray(bean)) {
                                    throw '轉換成object時發生錯誤'
                                } else if (eNursing.isObject(bean)) {
                                    bean = bean;
                                } else {
                                    throw '轉換成object時發生錯誤'
                                }
                                break;
                            default:
                                break;
                        }
                    } catch (e) {
                        console.error(failMsg + '轉換資料型態失敗(from ' + typeof bean + ' to ' + dataMapping[key].type + ')，不中斷繼續執行', dataMapping[key], bean, e);
                    }
                }
                json[key] = bean;
            }

            return thisApi.fn.paramReplace(json, thisApi.receiveReplacing);
        }
        /**
         * 根據getData( )的結果，生成gformItemMap格式
         * @param {object} dataMapping 指定資料位置及所需要的名稱
         * @returns {object}
         */
        this.fn.getDataGformItemMap = function (dataMapping) {
            var failMsg = '取得資料生成gformItemMap格式 發生錯誤 -> ';
            var json = this.getData(dataMapping);

            //從 getData( ) 取得資料後，轉換成gformItemMap格式
            // json = {
            //     "no":        {
            //         "itemKey":   "no",
            //         "itemValue": "MR00-21"
            //     },
            //     "MTN_DEPT":  {
            //         "itemKey":   "MTN_DEPT",
            //         "itemValue": "3058"
            //     },
            //     "NOTE":      {
            //         "itemKey":   "NOTE",
            //         "itemValue": "2018.05.02經病委會同意新增CF1070501"
            //     },
            //     "nam_a":     {
            //         "itemKey":   "nam_a",
            //         "itemValue": "腎臟科"
            //     },
            //     "tObj":      {
            //         "itemKey":   "tObj",
            //         "itemValue": "{\"tA\":\"1\", \"tB\":2}"
            //     },
            //     "tA":        {
            //         "itemKey":   "tA",
            //         "itemValue": "1"
            //     },
            //     "tB":        {
            //         "itemKey":   "tB",
            //         "itemValue": "2"
            //     },
            //     "tArr":      {
            //         "itemKey":   "tArr",
            //         "itemValue": "10,23,77"
            //     }
            // };
            for (var key in json) {
                var item = json[key];
                //轉換成string
                try{
                    if (eNursing.isString(item)) {
                        item = item;
                    }else if (eNursing.isNumber(item)) {
                        item = item+'';
                    }else if (eNursing.isBoolean(item)) {
                        item = item+'';
                    }else if (Array.isArray(item)) {
                        item = item.join(',');
                    }else if (eNursing.isObject(item)) {
                        item = JSON.stringify(item);
                    }else{
                        item = item+'';
                        throw '轉換成string時發生錯誤'
                    }
                }catch (e) {
                    console.error(failMsg+'轉換資料型態失敗(from '+typeof item+' to string)，不中斷繼續執行', item, e);
                }
                //轉換成gFormItem
                json[key] = {
                    "itemKey": key,
                    "itemValue": item
            };
            }
            return json;
        }
        /**
         * 取得所有 api 清單
         * @param successCall   callback success
         * @param errorCall     callback error
         */
        this.fn.getApiList = function (successCall, errorCall) {
            if (!gFormJS) var gFormJS = nursing.createGForm();
            gFormJS.sourceId = thisApi.sourceId;
            gFormJS.formType = thisApi.formType;
            gFormJS.getGFormListWithConditionPlus(gFormJS, successCall, errorCall);
        };

        /**
         * 依照 apis.apiName 取得單一 api
         * @param successCall   callback success
         * @param errorCall     callback error
         * @return gForm
         */
        this.fn.getSingleApi = function (successCall, errorCall) {
            if (!gFormJS) var gFormJS = nursing.createGForm();
            gFormJS.formType = 'propAPIListForm';
            gFormJS.sourceId = 'hospitalName';
            // gFormJS.getGFormListWithConditionPlus(gFormJS,
            //     function(result) {
            //         if (result === null || result.length === 0) {
            //             console.error('apiModule.getSingleApi() error: result no Data.');
            //             errorCall(e);
            //         }
            //         var gForm = result[0].gForm;
            //         successCall(gForm)
            //     }, function(e) {
            //         console.error('apiModule.getSingleApi() error: ' + e);
            //         errorCall(e);
            //     }
            // );
            //身高體重
            if (thisApi.apiName == 'getHeightAndWeightByPatientId' || thisApi.apiName == null) {

                successCall({
                    "sourceId": "xindian",
                    "formId": "3a00bef8-377d-40b4-ab16-66054da552f4",
                    "formType": "propAPIListForm",
                    "evaluationTime": "2021/09/07 23:44:14.282",
                    "formVersionId": "f520ae09-1d00-4e4c-a9e6-210909dfd496",
                    "status": "Y",
                    "creatorId": "administrator",
                    "creatorName": "管理者",
                    "createTime": "2021/09/07 23:44:14.282",
                    "versionNo": "10",
                    "gformItems": [],
                    "gformItemMap": {
                        "apiName": {
                            "itemKey": "apiName",
                            "itemValue": "getHeightAndWeightByPatientId"
                        },
                        "apiDescription": {
                            "itemKey": "apiDescription",
                            "itemValue": "取得身高體重(根據病歷號)"
                        },
                        "runMode": {
                            "itemKey": "runMode",
                            "itemValue": "F"
                        },
                        "domain": {
                            "itemKey": "domain",
                            "itemValue": '{"cs":"{dynamicUrl}", "domain1":"http://localhost:8082/xindian"}'
                        },
                        "url": {
                            "itemKey": "url",
                            "itemValue": '{"cs":"/m2/api/getHeightAndWeightByPatientId", "domain1":"/m2/api/getHeightAndWeightByPatientId"}'
                        },
                        "method": {
                            "itemKey": "method",
                            "itemValue": "POST"
                        },
                        "contentType": {
                            "itemKey": "contentType",
                            "itemValue": "application/json; charset=utf-8"
                        },
                        "async": {
                            "itemKey": "async",
                            "itemValue": "true"
                        },
                        "dataType": {
                            "itemKey": "dataType",
                            "itemValue": "json"
                        },
                        "sendPreProcessing": {
                            "itemKey": "sendPreProcessing",
                            "itemValue": '["JSON to String"]'
                        },
                        "sendParam": {
                            "itemKey": "sendParam",
                            "itemValue": "{\"patientId\":{\"value\":\"104007\",\"desc\":\"病歷號\",\"source\":\"local:patientId\"},\"pcaseno\":{\"value\":\"30470158\",\"desc\":\"住院號\",\"source\":\"local:caseNo\"}}"
                        },
                        "receivePreProcessing": {
                            "itemKey": "receivePreProcessing",
                            "itemValue": '[]'
                        },
                        "receiveParam": {
                            "itemKey": "receiveParam",
                            "itemValue": "{\"val\":{\"value\":{\"height\":{\"value\":177,\"type\":\"float\",\"desc\":\"身高\",\"is-bean\":true,\"bean-mapping\":\"HEIGHT\"},\"weight\":{\"value\":66,\"type\":\"float\",\"desc\":\"體重\",\"is-bean\":true,\"bean-mapping\":\"WEIGHT\"}},\"type\":\"object\",\"desc\":\"資料\"},\"sts\":{\"value\":\"000000\",\"type\":\"string\",\"desc\":\"狀態代碼\",\"ui-value\":\"000000|,|E00004|,|E00003|,|E00001\",\"ui-desc\":\"查詢成功|,|發生錯誤|,|查無資料|,|傳入參數有誤\",\"is-check\":\"true\",\"check-type\":\"success|,|error|,|other|,|other\"},\"msg\":{\"value\":\"查詢成功\",\"type\":\"string\",\"desc\":\"狀態說明\",\"is-check-message\":\"true\"}}"
                        }
                    },
                    "nodeId": "GForm"
                });
            }else if (thisApi.apiName === 'insertCicCase'){
                //insert CICCASE

                successCall({
                    "sourceId": "xindian",
                    "formId": "3a00bef8-377d-40b4-ab16-66054da552f5",
                    "formType": "propAPIListForm",
                    "evaluationTime": "2021/09/07 23:44:14.282",
                    "formVersionId": "f520ae09-1d00-4e4c-a9e6-210909dfd497",
                    "status": "Y",
                    "creatorId": "administrator",
                    "creatorName": "管理者",
                    "createTime": "2021/09/07 23:44:14.282",
                    "versionNo": "10",
                    "gformItems": [],
                    "gformItemMap": {
                        "apiName": {
                            "itemKey": "apiName",
                            "itemValue": "insertCicCase"
                        },
                        "apiDescription": {
                            "itemKey": "apiDescription",
                            "itemValue": "新增 CICCASE"
                        },
                        "runMode": {
                            "itemKey": "runMode",
                            "itemValue": "B"
                        },
                        "domain": {
                            "itemKey": "domain",
                            "itemValue": '{"cs":"{dynamicUrl}", "domain1":"http://localhost:8082/xindian"}'
                        },
                        "url": {
                            "itemKey": "url",
                            "itemValue": '{"cs":"/m2/api/insertCicCase", "domain1":"/m2/api/insertCicCase"}'
                        },
                        "method": {
                            "itemKey": "method",
                            "itemValue": "POST"
                        },
                        "contentType": {
                            "itemKey": "contentType",
                            "itemValue": "application/json; charset=utf-8"
                        },
                        "async": {
                            "itemKey": "async",
                            "itemValue": "true"
                        },
                        "dataType": {
                            "itemKey": "dataType",
                            "itemValue": "json"
                        },
                        "sendReplacing": {
                            "itemKey": "receiveReplacing",
                            "itemValue": "{\"NOTETEAM\":{\"method\":[\"replace\"],\"replace0\":[\"復健師\",\"0\",\"營養師\",\"1\",\"社工師\",\"2\",\"院牧關懷師\",\"10\",\"安寧共照師\",\"11\",\"藥師\",\"5\",\"失智個管師\",\"12\",\"居家護理/居家安寧\",\"7\",\"出院準備個管師\",\"8\",\"其他\",\"99\"]}}"
                        },
                        "sendPreProcessing": {
                            "itemKey": "sendPreProcessing",
                            "itemValue": '["JSON to String"]'
                        },
                        "sendParam": {
                            "itemKey": "sendParam",
                            "itemValue": "{\"SOURCEID\":{\"value\":\"104007\",\"desc\":\"SOURCEID\",\"source\":\"local:caseNo\"},\"FORMID\":{\"value\":\"104007\",\"desc\":\"FORMID\",\"source\":\"gFormData:formId\"},\"POID\":{\"value\":\"104007\",\"desc\":\"轉紀錄ID\",\"source\":\"fixed:\"},\"PCASENO\":{\"value\":\"104007\",\"desc\":\"住院號\",\"source\":\"local:caseNo\"},\"PHISTNUM\":{\"value\":\"104007\",\"desc\":\"病歷號\",\"source\":\"local:patientId\"},\"APTIME\":{\"value\":\"104007\",\"desc\":\"申請日期\",\"source\":\"gFormData:base_datetime_120640\"},\"NOTETEAM\":{\"value\":\"104007\",\"desc\":\"*照會團隊\",\"source\":\"gFormData:NoteTeam\"},\"STATIONID\":{\"value\":\"104007\",\"desc\":\"申請單位(護理站)\",\"source\":\"local:top_station\"},\"HADMDT\":{\"value\":\"104007\",\"desc\":\"*入院日期\",\"source\":\"local:top_indate\"},\"PDIAGTXT\":{\"value\":\"104007\",\"desc\":\"*入院診斷\",\"source\":\"local:top_diagnosis2\"},\"HVMDNO\":{\"value\":\"104007\",\"desc\":\"*主治醫師ID\",\"source\":\"local:top_employeeId\"},\"HVDOCNM\":{\"value\":\"104007\",\"desc\":\"*主治醫師\",\"source\":\"local:top_employeeName\"},\"BEDNO\":{\"value\":\"104007\",\"desc\":\"*床號\",\"source\":\"local:top_bed\"},\"PATNAME\":{\"value\":\"104007\",\"desc\":\"*姓名\",\"source\":\"local:top_patName\"},\"RESUGG\":{\"value\":\"104007\",\"desc\":\"*建議會診復科(復健師查詢時需顯示)\",\"source\":\"fixed:\"},\"RECLIST\":{\"value\":\"104007\",\"desc\":\"*是否轉收案清單\",\"source\":\"fixed:0\"},\"TANSLIST\":{\"value\":\"104007\",\"desc\":\"*是否轉長照轉介清單\",\"source\":\"fixed:0\"},\"FORMDN\":{\"value\":\"104007\",\"desc\":\"*是否來自於初篩表\",\"source\":\"fixed:0\"},\"TRANSFORMID\":{\"value\":\"104007\",\"desc\":\"轉介表單 Formid\",\"source\":\"gFormData:formId\"},\"CASETYPE\":{\"value\":\"104007\",\"desc\":\"案件類型\",\"source\":\"fixed:MSConsultNeed\"},\"CASESTATUS\":{\"value\":\"104007\",\"desc\":\"個案狀態\",\"source\":\"fixed:0\"},\"USERID\":{\"value\":\"104007\",\"desc\":\"建立者ID\",\"source\":\"local:gForm_userId\"},\"USERNAME\":{\"value\":\"104007\",\"desc\":\"建立者姓名\",\"source\":\"local:gForm_userName\"},\"NOTEREASON\":{\"value\":\"104007\",\"desc\":\"NOTEREASON\",\"source\":\"fixed:\"}}"
                        },
                        "receivePreProcessing": {
                            "itemKey": "receivePreProcessing",
                            "itemValue": '[]'
                        },
                        "receiveParam": {
                            "itemKey": "receiveParam",
                            "itemValue": "{\"sts\":{\"value\":\"000000\",\"type\":\"string\",\"desc\":\"狀態代碼\",\"ui-value\":\"000000|,|E00004|,|E00003|,|E00001\",\"ui-desc\":\"查詢成功|,|發生錯誤|,|查無資料|,|傳入參數有誤\",\"is-check\":\"true\",\"check-type\":\"success|,|error|,|other|,|other\"},\"msg\":{\"value\":\"執行完成提示\",\"type\":\"string\",\"desc\":\"狀態說明\",\"is-check-message\":\"true\"}}"
                        }
                    },
                    "nodeId": "GForm"
                });

            }else if (thisApi.apiName === 'updateCicCase'){
                //update CICCASE

                successCall({
                    "sourceId": "xindian",
                    "formId": "3a00bef8-377d-40b4-ab16-66054da552f5",
                    "formType": "propAPIListForm",
                    "evaluationTime": "2021/09/07 23:44:14.282",
                    "formVersionId": "f520ae09-1d00-4e4c-a9e6-210909dfd497",
                    "status": "Y",
                    "creatorId": "administrator",
                    "creatorName": "管理者",
                    "createTime": "2021/09/07 23:44:14.282",
                    "versionNo": "10",
                    "gformItems": [],
                    "gformItemMap": {
                        "apiName": {
                            "itemKey": "apiName",
                            "itemValue": "updateCicCase"
                        },
                        "apiDescription": {
                            "itemKey": "apiDescription",
                            "itemValue": "拋轉 CICCASE"
                        },
                        "runMode": {
                            "itemKey": "runMode",
                            "itemValue": "B"
                        },
                        "domain": {
                            "itemKey": "domain",
                            "itemValue": '{"cs":"{dynamicUrl}", "domain1":"http://localhost:8082/xindian"}'
                        },
                        "url": {
                            "itemKey": "url",
                            "itemValue": '{"cs":"/m2/api/updateCicCase", "domain1":"/m2/api/updateCicCase"}'
                        },
                        "method": {
                            "itemKey": "method",
                            "itemValue": "POST"
                        },
                        "contentType": {
                            "itemKey": "contentType",
                            "itemValue": "application/json; charset=utf-8"
                        },
                        "async": {
                            "itemKey": "async",
                            "itemValue": "true"
                        },
                        "dataType": {
                            "itemKey": "dataType",
                            "itemValue": "json"
                        },
                        "sendReplacing": {
                            "itemKey": "receiveReplacing",
                            "itemValue": "{\"RECLIST\":{\"method\":[\"replace\"],\"replace0\":[\"收案\",\"1\",\"不收案\",\"0\"]}}"
                        },
                        "sendPreProcessing": {
                            "itemKey": "sendPreProcessing",
                            "itemValue": '["JSON to String"]'
                        },
                        "sendParam": {
                            "itemKey": "sendParam",
                            "itemValue": "{\"RECLIST\":{\"value\":\"104007\",\"desc\":\"RECLIST\",\"source\":\"gFormData:base_radio_131332\"},\"CASESTATUS\":{\"value\":\"104007\",\"desc\":\"個案狀態\",\"source\":\"fixed:1\"},\"REUSERID\":{\"value\":\"104007\",\"desc\":\"*回覆人員帳號\",\"source\":\"local:gForm_userId\"},\"REUSERNAME\":{\"value\":\"104007\",\"desc\":\"*回覆人員姓名\",\"source\":\"gFormData:base_text_133757\"},\"RETM\":{\"value\":\"104007\",\"desc\":\"*回覆時間\",\"source\":\"gFormData:base_datetime_131315\"},\"MODIFYID\":{\"value\":\"104007\",\"desc\":\"異動者ID\",\"source\":\"local:gForm_userId\"},\"MODIFYNAME\":{\"value\":\"104007\",\"desc\":\"異動者姓名\",\"source\":\"local:gForm_userName\"},\"FORMID\":{\"value\":\"104007\",\"desc\":\"FORMID\",\"source\":\"gFormData:noteFormId\"}}"
                        },
                        "receivePreProcessing": {
                            "itemKey": "receivePreProcessing",
                            "itemValue": '[]'
                        },
                        "receiveParam": {
                            "itemKey": "receiveParam",
                            "itemValue": "{\"sts\":{\"value\":\"000000\",\"type\":\"string\",\"desc\":\"狀態代碼\",\"ui-value\":\"000000|,|E00004|,|E00003|,|E00001\",\"ui-desc\":\"查詢成功|,|發生錯誤|,|查無資料|,|傳入參數有誤\",\"is-check\":\"true\",\"check-type\":\"success|,|error|,|other|,|other\"},\"msg\":{\"value\":\"執行完成提示\",\"type\":\"string\",\"desc\":\"狀態說明\",\"is-check-message\":\"true\"}}"
                        }
                    },
                    "nodeId": "GForm"
                });

            }
        };

        /**
         * 比對 api 改變傳入資料與 gForm 取得的 api 預設資料
         * 由 api 傳入資料作為主要，gForm 輔佐建構最終結構
         * @param apiStructure
         * @param gFormObject
         * @return gForm
         */
        this.fn.comparisonObjectWithGForm = function (apiStructure, gFormObject) {
            var gFormItemMap = gFormObject.gformItemMap;
            if (!gFormItemMap.sendParam) gFormItemMap.sendParam = {"itemKey": "sendParam", "itemValue": ""};
            if (!gFormItemMap.receiveParam) gFormItemMap.receiveParam = {"itemKey": "receiveParam", "itemValue": ""};
            if (!gFormItemMap.targetData) gFormItemMap.targetData = {"itemKey": "targetData", "itemValue": ""};
            if (!gFormItemMap.targetCheck) gFormItemMap.targetCheck = {"itemKey": "targetCheck", "itemValue": ""};
            if (!gFormItemMap.needAutoSetting) gFormItemMap.needAutoSetting = {"itemKey": "needAutoSetting", "itemValue": ""};
            if (!gFormItemMap.needGFormStructure) gFormItemMap.needGFormStructure = {"itemKey": "needGFormStructure", "itemValue": ""};
            if (apiStructure.sendParam) {
                var gFormSendParam = gFormItemMap.sendParam.itemValue;
                try {
                    gFormSendParam = JSON.parse(gFormSendParam);
                } catch (e) { }
                for (var node in apiStructure.sendParam) {
                    if (gFormSendParam[node]) gFormSendParam[node].source = apiStructure.sendParam[node].paramValue;
                    if (apiStructure.sendParam[node].paramMapping.length > 0) {
                        thisApi.sendReplacing[node] = {
                            "method" : ["replace"],
                            "replace0": apiStructure.sendParam[node].paramMapping
                        }
                    }
                }
                gFormItemMap.sendParam.itemValue = JSON.stringify(gFormSendParam);
            }
            if (apiStructure.receiveParam) {
                var gFormReceiveParam = gFormItemMap.receiveParam.itemValue;
                try {
                    gFormReceiveParam = JSON.parse(gFormReceiveParam);
                } catch (e) { }
                for (var node in apiStructure.receiveParam) {
                    if (apiStructure.receiveParam[node].paramMapping.length > 0) {
                        thisApi.receiveReplacing[node] = {
                            "method" : ["replace"],
                            "replace0": apiStructure.receiveParam[node].paramMapping
                        }
                    }
                }
                gFormItemMap.userDefined = {"itemKey": "userDefined", "itemValue": JSON.stringify({"dataMapping": apiStructure.receiveParam})};
            }
            if (apiStructure.targetData) gFormItemMap.targetData.itemValue = apiStructure.targetData;
            if (apiStructure.targetCheck) gFormItemMap.targetCheck.itemValue = apiStructure.targetCheck;
            if (apiStructure.needAutoSetting) gFormItemMap.needAutoSetting.itemValue = apiStructure.needAutoSetting;
            if (apiStructure.needGFormStructure) gFormItemMap.needGFormStructure.itemValue = apiStructure.needGFormStructure;
            return gFormObject;
        };

        /**
         * 啟用 api 連線
         * 可使用 apiName 或 url 進行呼叫 api 動作
         * @param apis          apiModule Object
         * @param successCall   callback success
         * @param errorCall     callback error
         */
        this.fn.openConnection = function (apis, successCall, errorCall) {
            // 設定 ajax api 參數
            var settings = {
                url:         apis.connectUrl,
                method:      apis.method,
                dataType:    apis.dataType,
                async:       apis.async,
                contentType: apis.contentType,
                data:        apis.sendData
            };
            console.log(settings)
            var request = $.ajax(settings);
            request.done(function (result) {
                console.log(result);
                // if (typeof result === 'string') {
                //     try {
                //         result = JSON.parse(result);
                //     } catch (e) {
                //         console.error('apiModule.openConnection() error:' + e);
                //         return false;
                //     }
                // }
                // // 錯誤訊息查核
                // var errorCheck = thisApi.fn.check.checkingOutputError(result, apis.fn.getTargetCheck());
                // if (!errorCheck.success) {
                //     console.error('apiModule.openConnection() error:' + errorCheck.msg);
                //     errorCall(result);
                //     return false;
                // }
                successCall(result);
            });
            request.fail(errorCall);
        };

        this.fn.check = {}
        /**
         * 檢查此api的狀態
         * @param targetCheck
         * @returns {{msg: string, other: boolean, success: boolean, error: boolean}}
         */
        this.fn.doTargetCheck = function(targetCheck){
            var resultMsg = {
                "success": false,
                "error": false,
                "other": false,
                "msg":     ''
            };
            var check = eval("thisApi.result."+targetCheck.checkNode);
            var idx = targetCheck.typeKey.indexOf(check);
            switch (targetCheck.typeAttr[idx]) {
                case 'success':
                    resultMsg.success = true;
                    break;
                case 'error':
                    resultMsg.error = true;
                    break;
                case 'other':
                    resultMsg.other = true;
                    break;
                default:
                    resultMsg.other = true;
                    break;
            }
            if (!resultMsg.success) {
                resultMsg.msg = eval("thisApi.result."+targetCheck.msgNode);
            }
            return resultMsg;
        };
        /**
         * 檢查 apiModule 參數必填
         * @param apis apiModule Object
         * @param dataModify 是否需要轉換 apis data 參數
         * @returns {{msg: string, success: boolean}}
         */
        this.fn.check.checkApiModuleRequired = function (apis, dataModify) {
            var resultMsg = {
                success: false,
                msg:     ''
            }
            // 檢核 apiName 及 url 不能皆為空
            if (apis.apiName == null && apis.url == null) {
                resultMsg.msg = 'api 敘述錯誤：無效的url參數.(url error)';
            }
            // 檢核指定檢核位置不能為空
            if (apis.targetCheck == null) {
                if (resultMsg.msg.length > 0) {
                    resultMsg.msg += ',';
                } else {
                    resultMsg.msg += 'api 敘述錯誤：';
                }
                resultMsg.msg += '指定檢核位置未填寫.(targetCheck error)';
            } else {
                // 若指定檢核位置不為空，檢核內部參數不能全部不存在
                if (apis.targetCheck.errorKey === undefined && apis.targetCheck.isError === undefined && apis.targetCheck.errorMessage === undefined) {
                    if (resultMsg.msg.length > 0) {
                        resultMsg.msg += ',';
                    } else {
                        resultMsg.msg += 'api 敘述錯誤：';
                    }
                    resultMsg.msg +=
                        '指定檢核位置填寫錯誤,errorKey&isError&errorMessage需則一區填寫,詳見apiModule.js說明.(targetCheck error)';
                }
            }
            // 檢核指定資料位置及所需要的名稱不能為坑
            if (apis.targetData == null) {
                if (resultMsg.msg.length > 0) {
                    resultMsg.msg += ',';
                } else {
                    resultMsg.msg += 'api 敘述錯誤：';
                }
                resultMsg.msg += '指定資料位置及所需要的名稱未填寫.(targetData error)';
            }
            // 依照 dataModify (true/false) 進行 data 是否轉成字串
            if (typeof apis.data === 'object' && apis.data !== null && apis.data !== undefined) {
                try {
                    if (dataModify) apis.data = JSON.stringify(apis.data);
                } catch (e) {
                    console.error('apiModule.checkApiModuleRequired() error:' + e);
                }
            }
            if (resultMsg.msg.length === 0) resultMsg.success = true;
            return resultMsg;
        };

        /**
         * 檢查輸出錯誤函數
         * 必須全部資料皆為正確才會回傳成功，
         * 將資料(dataOutput)讀取，
         * 依照檢查錯誤結構(errorFormat)檢核資料，
         * 各結構參照 apiModule.js 內註解說明。
         * @param dataOutput    (Object) 輸入資料
         * @param errorFormat   (Object) 檢核錯誤結構
         * @returns {{msg: string, success: boolean}}
         */
        this.fn.check.checkingOutputError = function (dataOutput, errorFormat) {
            var resultMsg = {
                success: false,
                msg:     ''
            }
            try {
                var errorMessage = errorFormat.msgNode;
                var errorKey     = errorFormat.checkNode;
                var errorType    = errorFormat.typeAttr;
                var errorDesc    = errorFormat.typeDesc;
                var errorValue   = errorFormat.typeKey;
                // 若輸入資料為陣列，遍歷所有資料進行檢核錯誤，若有任何一筆資料出現錯誤則整筆退回
                if (Array.isArray(dataOutput)) {
                    for (var i = 0, len = dataOutput.length; i < len; ++i) {
                        var singleResult = this.fn.check.checkingOutputError(dataOutput[i], errorFormat);
                        if (!singleResult.success) {
                            resultMsg = singleResult;
                            break;
                        }
                    }
                    if (resultMsg.msg === '') resultMsg.success = true;
                } else {
                    var nodeValue = findNodeValue(dataOutput, errorKey);
                    if (errorValue.indexOf(nodeValue) > -1) {
                        var position = errorValue.indexOf(nodeValue);
                        if (errorType[position] === 'success') {
                            // success
                            resultMsg.success   = true;
                        } else {
                            // fail
                            resultMsg.success   = false;
                            resultMsg.msg       = errorDesc[position];
                        }
                    }
                }
            } catch (e) {
                console.error('apiModule.checkingOutputError() error:' + e);
                resultMsg.msg = e;
            }
            if (resultMsg.msg.length === 0) resultMsg.success = true;
            return resultMsg;

            /**
             * 物件結構查詢節點名稱
             * 依照 node 節點進行查詢並回傳該值
             * @param data {Object|Array}   原始資料
             * @param node {String}         節點名稱
             * @returns {Object[]|Object|boolean}    回傳物件(陣列)或布林
             */
            function findNodeValue(data, node) {
                var nodeArray = node.split('.')
                // 若遇到陣列，將全部資料遍歷，將資料存入陣列回傳
                if (Array.isArray(data)) {
                    var result = [];
                    for (var i = 0, len = data.length; i < len; ++i) {
                        result.push(findNodeValue(data[i], nodeArray[0]));
                    }
                    if (result.length > 0) return result;
                } else {
                    // 確認節點是否存在
                    if (data[nodeArray[0]] !== undefined) {
                        // 將結點資料存取，節點往下推一步 (Ex: a.b.c => b.c)，繼續進行查詢，最後回傳取得結果
                        var dataChild = data[nodeArray[0]];
                        nodeArray.shift();
                        if (nodeArray.length > 0) {
                            return findNodeValue(dataChild, nodeArray.join('.'));
                        } else {
                            return dataChild;
                        }
                    } else {
                        console.error('apiModule.checkingOutputError.findNodeValue() error: no kind of ' + nodeArray[0] + ' node name');
                        return false;
                    }
                }
                return false;
            }
        };

        /**
         * 結構轉換函數
         * 將資料(dataOutput)讀取，
         * 依照輸出格式(resultFormat)將資料轉換成該結構輸出，
         * 各結構參照 apiModule.js 內註解說明。
         * @param dataOutput    (Object) 輸入資料
         * @param resultFormat  (Object) 輸出結構
         * @returns {Object}
         */
        this.fn.structureExchange = function (dataOutput, resultFormat) {
            var resultObject;
            try {
                if (Array.isArray(dataOutput)) {
                    resultObject = [];
                    for (var i = 0, len = dataOutput.length; i < len; ++i) {
                        resultObject.push(this.structureExchange(dataOutput[i], resultFormat))
                    }
                } else {
                    resultObject = {};
                    for (var key in resultFormat) {
                        if (key === 'fn') {
                            if (resultFormat[key] !== 'default') {
                                resultFormat[key](dataOutput);
                            }
                        } else {
                            var node = resultFormat[key];
                            var singleData = findNodeValue(dataOutput, node);
                            if (singleData) {
                                resultObject[key] = singleData;
                            } else {
                                throw '讀取節點出錯,dataOutput 不存在 ' + node + ' 節點,請確認是否輸入正確';
                            }
                        }
                    }
                }
            } catch (e) {
                console.error('apiModule.structureExchange() error:' + e);
            }
            return resultObject;

            /**
             * 物件結構查詢節點名稱
             * 依照 node 節點進行查詢並回傳該值
             * @param data {Object|Array}   原始資料
             * @param node {String}         節點名稱
             * @returns {Object[]|Object|boolean}    回傳物件(陣列)或布林
             */
            function findNodeValue(data, node) {
                var nodeArray = node.split('.')
                // 若遇到陣列，將全部資料遍歷，將資料存入陣列回傳
                if (Array.isArray(data)) {
                    var result = [];
                    for (var i = 0, len = data.length; i < len; ++i) {
                        result.push(findNodeValue(data[i], nodeArray[0]));
                    }
                    if (result.length > 0) return result;
                } else {
                    // 確認節點是否存在
                    if (data[nodeArray[0]] !== undefined) {
                        // 將結點資料存取，節點往下推一步 (Ex: a.b.c => b.c)，繼續進行查詢，最後回傳取得結果
                        var dataChild = data[nodeArray[0]];
                        nodeArray.shift();
                        if (nodeArray.length > 0) {
                            return findNodeValue(dataChild, nodeArray.join('.'));
                        } else {
                            return dataChild;
                        }
                    } else {
                        console.error('apiModule.structureExchange.findNodeValue() error: no kind of ' + nodeArray[0] + ' node name');
                        return false;
                    }
                }
                return false;
            }
        };
        /**
         * 檢查是否為Json或ArrayJson
         * @param node 要檢查的節點
         * @returns {boolean} true=是Json或ArrayJson
         */
        this.fn.isJsonOrArrayJson = function (node) {
            if (Array.isArray(node)) {
                if (node.length === 0) {
                    return false
                } else if (Array.isArray(node[0])) {
                    return false
                } else if (typeof node[0] === 'object') {
                    return true
                } else {
                    return false
                }
            } else if (typeof node === 'object') {
                return true
            } else {
                false
            }
        }
        /**
         * 找到並回傳json裡符合targetAttr目標屬性的node節點
         * @param {object} json 節點
         * @param {string} targetAttr 要查詢的目標屬性
         * @returns {*[]} nodeJson
         */
        this.fn.findAttr = function(json, targetAttr) {
            var selector = [];
            deepFind(json, '');
            function deepFind (node, root) {
                for (var key in node) {
                    for (var attr in node[key]) {
                        //找到目標屬性
                        if (attr === targetAttr) {
                            //深拷貝
                            var newNode = $.extend(true, {}, node[key]);
                            //取得節點名，若有{index}則要將索引值換上
                            newNode.node = (root.indexOf('{index}') > -1) ? root.replace('{index}', key) : root+(root ? '.' : '')+key;
                            //node
                            selector.push(newNode);
                        }
                    }
                    //value如果是物件或陣列，則繼續下鑽
                    if (node[key].value && thisApi.fn.isJsonOrArrayJson(node[key].value)) {
                        //array要將root設為xxx[{index}]，其餘則xxx.yyy
                        deepFind(node[key].value, (root.indexOf('{index}') > -1) ? root.replace('{index}', key) : root + (root ? '.' : '') + key + (Array.isArray(node[key].value) ? '[{index}]' : ''));
                    }
                }
            }
            return selector;
        };
        /**
         * 找到並回傳json裡，該node節點的資料
         * @param {object} json 節點
         * @param {string} node 要查詢的節點
         * @returns {*}
         */
        this.fn.findNode = function(json, node) {
            try{
                return eval('json.'+node);
            }catch (e) {
                console.error(e);
                return null;
            }
        };


        // ============= control here =============
        this.options = {
            // 完成動作後的程式插入點
            "ready" : {
                // 設定完apiModule後
                "setApiModule" : function(apiModule){return apiModule;},
                // 設定完傳入參數後
                "setSendData" : function(apiModule, data){return data;},
                // 設定完資料前處理後
                "setSendPreProcessing" : function(apiModule, data){return data;},
                // 完成api連線後
                "openConnection" : function(apiModule, result){return result;},
                // api連線發生錯誤
                "openConnectionOnError" : function(apiModule, e){console.error(e);},
                // 取得資料且處理完資料後
                "setReceivePreProcessing" : function(apiModule, result){return result;},
                // 取得檢核位置資訊後
                "getTargetCheck" : function(apiModule, targetCheck){return targetCheck;},
                // 執行檢核後
                "doTargetCheck" : function(apiModule, resultMsg){return resultMsg;},
                // 檢查完必填參數後
                "checkApiModuleRequired" : function(apiModule, resultMsg){return resultMsg;},
                // 檢查出查詢程式不是success的狀態時
                "checkingOutputError" : function(apiModule, resultMsg){console.error(resultMsg);},
                // 取得dataMapping(指定資料位置及所需要的名稱)後
                "getDataMapping" : function(apiModule, dataMapping){return dataMapping;},
                // 取得資料後
                "getData" : function(apiModule, result){return result;},
                // 設定完gForm後
                "setGform" : function(apiModule, result){}
            },
            // 全部完成之前
            "completeBefore" : function(apiModule){}
        };
        /**
         * 用於回調 pageReady
         */
        this.complete = function(apiModule) {};
        /**
         * 設定完成後開始連線api
         * @param {gForm} apiGform 可選，從api設定庫裡拿到的gForm
         */
        this.start = function(apiGform) {
            var readyFn = this.options.ready;
            // 設定apiModule
            if (apiGform) {
                this.fn.setApiModule(apiGform);
            }
            // 設定完apiModule後
            thisApi = readyFn.setApiModule(thisApi);
            // 設定網址
            thisApi.fn.setUrl();
            // 設定傳入參數
            thisApi.fn.setSendData();
            thisApi.sendData = readyFn.setSendData(thisApi, thisApi.sendData);
            // 設定完資料前處理後
            thisApi.fn.setSendPreProcessing();
            thisApi.sendData = readyFn.setSendPreProcessing(thisApi, thisApi.sendData);
            // 完成api連線後
            thisApi.fn.openConnection(thisApi, function(result) {
                thisApi.result = result;
                thisApi.result = readyFn.openConnection(thisApi, thisApi.result);
                // 資料前處理
                thisApi.fn.setReceivePreProcessing();
                thisApi.result = readyFn.setReceivePreProcessing(thisApi, thisApi.result);
                // 取得檢核位置資訊
                var targetCheck = thisApi.fn.getTargetCheck();
                targetCheck = readyFn.getTargetCheck(thisApi, targetCheck);
                //執行檢核api成功與否
                thisApi.resultMsg = thisApi.fn.doTargetCheck(targetCheck);
                thisApi.resultMsg = readyFn.doTargetCheck(thisApi, thisApi.resultMsg);
                if (!thisApi.resultMsg.success) {
                    console.log(thisApi.resultMsg);
                    thisApi.options.completeBefore(thisApi);
                    thisApi.complete(thisApi);
                    return;
                }
                // 檢查必填參數
                // thisApi.resultMsg = thisApi.fn.check.checkApiModuleRequired();
                // thisApi.resultMsg = readyFn.checkApiModuleRequired(thisApi, thisApi.resultMsg);
                // 檢查出查詢程式不是success的狀態時
                // thisApi.resultMsg = thisApi.fn.check.checkingOutputError();
                // thisApi.resultMsg = readyFn.checkingOutputError(thisApi, thisApi.resultMsg);
                // 取得dataMapping
                var dataMapping = thisApi.fn.getDataMapping();
                dataMapping = readyFn.getDataMapping(thisApi, dataMapping);
                // 取得資料後
                var rs;
                if (thisApi.needGFormStructure) { //gForm結構
                    rs = thisApi.fn.getDataGformItemMap(dataMapping);
                }else {
                    rs= thisApi.fn.getData(dataMapping);
                }
                //自動填入gForm
                if (thisApi.needAutoSetting && gFormJS) {
                    setElementValue_GForm(null, thisApi.fn.getDataGformItemMap(dataMapping));
                    // 設定完gForm後
                    readyFn.setGform(rs);
                }
                thisApi.options.completeBefore(thisApi);
                thisApi.complete(thisApi);
            }, function(e){
                readyFn.openConnectionOnError(thisApi, e);
            });

        };
    }
    eNursing.addModule(ApiModule);
}(eNursing);
