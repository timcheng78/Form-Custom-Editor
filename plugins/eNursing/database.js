!function () {

    function DBQueryModule() {
        this.getAllDataBase = function (successCall, errorCall) {
            var dbQueryModule = this
            var param = {
                /**不同数据*/
                node: "allDataBase",
                /**动作*/
                action: "select"
            };
            eNursing.sendMsg("databaseService.getAllDataBase", [], param, "", function (result) {
                console.log(result)
                if (result.resultMsg.success) {
                    var dataObject = result.data[0]
                    if (dataObject.title)
                        delete dataObject.title
                    // setting database structure
                    if (dataObject.database) {
                        dbQueryModule.processDatabaseStructure(dataObject.database, 0)
                    }

                    successCall(dataObject);
                } else {
                    eNursing.F2ReportErrorMsg(result);
                    errorCall(result.resultMsg.message);
                }
            }, errorCall, false, false);
        }

        this.processDatabaseStructure = function(object, level) {
            for (let i = 0, len = object.length; i < len; ++i) {
                switch (level) {
                    case 0:
                        object[i].draggable = false
                        break
                    case 1:
                        object[i].draggable = false
                        object[i].oncontextmenu = 'setMainTable(event)'
                        break
                    case 2:
                        object[i].onclick = 'setColor(event)'
                        object[i].oncontextmenu = 'setColor(event)'
                        break
                }
                if (object[i].nodes) this.processDatabaseStructure(object[i].nodes, (level + 1))
            }
        }
    }

    eNursing.addModule(DBQueryModule);
}(eNursing);