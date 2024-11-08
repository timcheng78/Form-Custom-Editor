!function () {
    function FileStore() {
        this.nodeId = eNursing.getFnName(FileStore);
        //String base64文件
        this.content = null;
        //String 文件名称
        this.fileName = null;
        //String 设定档流水号
        this.fileStoreSetId = null;
        //String 流水号
        this.id = null;
        //String 绝对路径
        this.path = null;
        //String 根目录
        this.rootPath = null;
        //String 状态
        this.states = null;
        //String 存取类型
        this.storeType = null;
        //String 系统模块
        this.sysModel = null;

        this.doUploadFile = function (eleFileId, fileInfo, successCall, errorCall) {
            var thatFileObject = this;
            var hasFileReader = true;
            var files = document.getElementById(eleFileId);
            try{
                var test = new FileReader();
                test = files.files.length;
            }catch(e){
                hasFileReader = false;
            }

            var emptyMsg = (languageMode=="Traditional Chinese") ? "請選擇檔案" : (languageMode=="Simplified Chinese") ? "请选择档案" : "请选择档案";
            //2019.10.04 正峻 為規避大檔案產生的記憶體問題，目前已統一走下面那段
            if (false && hasFileReader){ //有FileReader可用，先轉二進制後上傳 (未來可支援離線)
                if (files.files.length==0){
                    alert(emptyMsg);
                    return false;
                }
                var file = files.files[0];
                //FileReader可直接将上传文件转化为二进制流
                var reader = new FileReader();
                reader.onload = function() { //完成后this.result为二进制流
                    var base64Str = this.result;
                    console.log(base64Str);
                    var startNum = base64Str.indexOf("base64,");
                    startNum = startNum * 1 + 7;
                    //去除前部格式信息（如果有需求）
                    var baseStr = base64Str.slice(startNum);

                    // var fileInfo = {
                    //     id: "3b00c787-dedc-4030-82d7-fdb4e3f26b41"
                    //     fileName: file.name,
                    //     content: baseStr,
                    //     states: "Y",
                    //     sysModel: "staff",
                    //     storeType: "1"
                    // };
                    fileInfo.fileName=file.name;
                    fileInfo.content=baseStr;

                    thatFileObject.uploadFile(fileInfo, successCall, errorCall);
                };
                reader.readAsDataURL(file); //转化二进制流，异步方法

            }else{ //無FileReader可用，以form上傳的方式 (不支援離線)
                if (files.value==""){
                    alert(emptyMsg);
                    return false;
                }
                var form = $('<form method="POST" enctype="multipart/form-data" style="display:none"></form>');
                form.attr("action", eNursing.serviceUrl.replace(/send\.do/, "fileUpload.do"));
                $(files).before($(files).clone());
                form.append($(files));
                form.append('<input type="text" name="states" value="'+fileInfo.states+'"/>');
                form.append('<input type="text" name="sysModel" value="'+fileInfo.sysModel+'"/>');
                form.append('<input type="text" name="storeType" value="'+fileInfo.storeType+'"/>');
                form.append('<input type="text" name="gformServiceUrl" value="'+const_gformServiceUrl+'"/>');
                if (window.const_fileServiceUrl) {
                    form.append('<input type="text" name="fileServiceUrl" value="' + const_fileServiceUrl + '"/>');
                }
                var options = {
                    // beforeSubmit:  showRequest,  // pre-submit callback
                    success:       showResponse  // post-submit callback
                };

                // bind to the form's submit event

                form.submit(function() {
                    $(this).ajaxSubmit(options);
                    return false;
                });
                $("body").append(form);
                form.submit();
                // pre-submit callback
                // function showRequest(formData, jqForm, options) {
                //     return true;
                // }
                // post-submit callback
                function showResponse(responseText, statusText)  {
                    form.remove();
                    // console.log(statusText);
                    // console.log(responseText);
                    var result = JSON.parse(responseText);
                    console.log(result);
                    if (result.resultMsg&&result.resultMsg.success) {
                        var file = result.data;
                        successCall(file);
                    } else {
                        if (window.console) console.log(result.resultMsg);
                        errorCall(result);
                    }
                }

            }
        };

        this.uploadFile = function (fileInfo, successCall, errorCall) {
            var param = {
                node:  "fileUploadService.uploadFile." + fileInfo.fileName,
                action: "add"
            };

            eNursing.sendMsg("fileUploadService.uploadFile", fileInfo, param, "", function (result) {
                if (result.resultMsg.success) {
                    var file = result.data;
                    if (window.console) console.log(file);
                    successCall(file);
                } else {
                    if (window.console) console.log(result.resultMsg);
                }
            }, errorCall);
        };

        this.uploadFilePromise = function (formData) {
            return fetch(`${ const_fileApiUrl }/fileUpload.do`, {
                method: 'POST',
                body: formData
            })
        }

        this.downloadFilePromise = function (formData) {
            return fetch(`${ const_fileApiUrl }/fileDownload.do`, {
                method: 'POST',
                body: formData
            })
        }


        this.downloadFile = function (fileInfo, successCall, errorCall) {
            var param = {
                node:  "fileUploadService.downloadFile." + fileInfo.id,
                action: "select"
            };

            eNursing.sendMsg("fileUploadService.downloadFile", fileInfo, param, "", function (result) {
                if (result.resultMsg.success) {
                    var file = result.data;
                    if (window.console) console.log(file);
                    successCall(file);
                } else {
                    if (window.console) console.log(result.resultMsg);
                }
            }, errorCall);
        };

        //用octet-stream的方法下載檔案
        this.downloadFile_FileOutputStream = function (id, successCall, errorCall) {
            try{
                var form = $('<form method="POST" enctype="multipart/form-data" style="display:none" target="new"></form>');
                form.attr("action", eNursing.serviceUrl.replace(/send\.do/, "fileDownload.do"));
                form.append('<input type="text" name="id" value="'+id+'"/>');
                form.append('<input type="text" name="gformServiceUrl" value="'+const_gformServiceUrl+'"/>');
                if (window.const_fileServiceUrl) {
                    form.append('<input type="text" name="fileServiceUrl" value="'+const_fileServiceUrl+'"/>');
                }
                $("body").append(form);
                form.submit();
                form.remove();
                successCall();
            }catch(e){
                errorCall(e);
            }
        };


        this.deleteFile = function (fileInfo, successCall, errorCall) {
            var param = {
                node:  "fileUploadService.deleteFile." + fileInfo.id,
                action: "delete"
            };

            eNursing.sendMsg("fileUploadService.deleteFile", fileInfo, param, "", function (result) {
                if (result.resultMsg.success) {
                    // alert(result.resultMsg.message);
                    successCall(result);
                } else {
                    if (window.console) console.log(result.resultMsg);
                    errorCall(result);
                }
            }, errorCall);
        };


    }

    eNursing.addModule(FileStore);
}(eNursing);
