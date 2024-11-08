export class ApiComponent {

    constructor(options) {
        this.apiName = options.apiName || ''
        this.apiUrl = options.apiUrl || ''
        this.sendParam = options.sendParam || null
        this.receiveParam = options.receiveParam || null
        this.runMode = options.runMode || null
        this.sourceId = options.sourceId || null
        this.needAutoSetting = options.needAutoSetting || false
        this.needGFormStructure = options.needGFormStructure || false
        this.paramsObject = {
            sendObject: {},
            sendStructure: [],
            receiveObject: {},
            receiveStructure: []
        }
    }
    
    /** 設定 API 編號 */
    set apiSeq (apiSeq) {
        this._apiSeq = apiSeq
    }

    /** 取得 API 編號 */
    get apiSeq () {
        return this._apiSeq
    }

    /** 設定 API 名稱 */
    set apiName (apiName) {
        this._apiName = apiName
    }

    /** 取得 API 名稱 */
    get apiName () {
        return this._apiName
    }

    /** 設定 API 網址 */
    set apiUrl (apiUrl) {
        this._apiUrl = apiUrl
    }

    /** 取得 API 網址 */
    get apiUrl () {
        return this._apiUrl
    }

    /** 設定 API 入參 */
    set sendParam (sendParam) {
        this._sendParam = sendParam
    }

    /** 取得 API 入參 */
    get sendParam () {
        return this._sendParam
    }

    /** 設定 API 出參 */
    set receiveParam (receiveParam) {
        this._receiveParam = receiveParam
    }

    /** 取得 API 出參 */
    get receiveParam () {
        return this._receiveParam
    }

    /** 設定 API 執行模式 */
    set runMode (runMode) {
        this._runMode = runMode
    }

    /** 取得 API 執行模式 */
    get runMode () {
        return this._runMode
    }

    /** 設定 API 來源編號 */
    set sourceId (sourceId) {
        this._sourceId = sourceId
    }

    /** 取得 API 來源編號 */
    get sourceId () {
        return this._sourceId
    }

    /** 設定 API 是否自動設定 */
    set needAutoSetting (needAutoSetting) {
        this._needAutoSetting = needAutoSetting
    }

    /** 取得 API 是否自動設定 */
    get needAutoSetting () {
        return this._needAutoSetting
    }

    /** 設定 API 是否結構化 */
    set needGFormStructure (needGFormStructure) {
        this._needGFormStructure = needGFormStructure
    }

    /** 取得 API 是否結構化 */
    get needGFormStructure () {
        return this._needGFormStructure
    }

    /** 設定eNursing API模組 */
    set eApiModule (eApiModule) {
        this._eApiModule = eApiModule
        this.buildParamObject()
    }

    /** 取得eNusring API模組 */
    get eApiModule () {
        return this._eApiModule
    }

    /** 設定表單類型 */
    set formType(formType) {
        this._formType = formType
        this.generateShell()
    }

    /** 取得表單類型 */
    get formType() {
        return this._formType
    }

    /** 設定容器 */
    set container(container) {
        this._container = container
    }

    /** 取得容器 */
    get container() {
        return this._container
    }

    /** 設定輸入參數 */
    set sendObject (sendObject) {
        this.paramsObject.sendObject = sendObject
    }

    /** 取得輸入參數 */
    get sendObject () {
        return this.paramsObject.sendObject
    }

    /** 設定輸入結構 */
    set sendStructure (sendStructure) {
        this.paramsObject.sendStructure = sendStructure
    }

    /** 取得輸入結構 */
    get sendStructure () {
        return this.paramsObject.sendStructure
    }

    /** 設定輸出參數 */
    set receiveObject (receiveObject) {
        this.paramsObject.receiveObject = receiveObject
    }

    /** 取得輸出參數 */
    get receiveObject () {
        return this.paramsObject.receiveObject
    }

    /** 設定輸出結構 */
    set receiveStructure (receiveStructure) {
        this.paramsObject.receiveStructure = receiveStructure
    }

    /** 取得輸出結構 */
    get receiveStructure () {
        return this.paramsObject.receiveStructure
    }

    /** 取得執行時機 */
    get runModeText() {
        return this.runMode.replace('F', '前').replace('M', '中').replace('BY', '後(正式)').replace('B', '後').replace('DY', '後(正式刪除)').replace('D', '後(刪除)')
    }

    /** 製作 API 清單外殼 */
    generateShell() {
        const container = {
            'div': {
                'class': 	'list-group-item hide',
                'text': 	'',
                'children': [
                    {
                        'i': {
                            'class': 'bi bi-trash text-danger float-right',
                            'onclick': this.deleteApi.bind(this)
                        }
                    }
                ]
            }
        }.createElemental()[0]
        const label 	= CreateUtils.createBeanElement({
            'controlType': 'label',
            'attribute': 	[
                {
                    'class': 	'text-danger',
                    'text': 	this.runModeText
                }
            ]
        })[0]
        container.classList.add(`apiFrameModel-${ this.formType }`)
        container.dataset.apiSeq = this.apiSeq
        container.dataset.apiFrameModel = this.formType
        container.prepend(label, this.apiName)
        this.container = container
        return this.container
    }

    /**
     * API 名稱元件改變
     * @param {string} originName  原始名稱
     * @param {string} newName 新名稱
     */
    beanNameChanged(originName, newName) {
        if (this.sendParam) {
            for (let key in this.sendParam) {
                const object = this.sendParam[key]
                const paramValue = object.paramValue
                const valueArray = paramValue.split(':')
                if (valueArray[0] !== 'form') continue
                if (valueArray[1] === originName) {
                    valueArray[1] = newName
                    object.paramValue =  valueArray.join(':')
                }
            }
        }
        if (this.receiveParam) {
            for (let key in this.receiveParam) {
                if (key !== originName) continue
                const object = this.receiveParam[key]
                this.receiveParam[newName] = object
                delete this.receiveParam[key]
            }
        }
    }

    /** 刪除 API */
    deleteApi(e) {
        SharedUtils.cancelDefault(e)
        CreateUtils.createModal(`confirm`, {
            'title':    `詢問`,
            'body':     `是否要刪除此API?`,
            'callback': (result) => {
                if (result) {
                    this.container.remove()
                    APIModule.deleteOne(this.apiSeq)
                    return true
                }
            }
        })
    }

    /** 建構入出參物件 */
    buildParamObject () {
        const sendObject = {
            nameParam: [],
            descriptionParam: [],
            sendSource: [],
            receiveSource: []
        }
        if (this.sendParam) {
            for (let sNode in this.eApiModule.sendParam) {
                const paramObject 	= this.eApiModule.sendParam[sNode]
                const nodeArray 	= Object.keys(this.sendParam)
                if (nodeArray.some(node => node === sNode)) continue
                else {
                    sendObject.nameParam.push(sNode)
                    sendObject.descriptionParam.push(paramObject.desc)
                    sendObject.sendSource.push(paramObject.source)
                }
            }
            for (let node in this.sendParam) {
                let desc = ''
                if (this.eApiModule.sendParam[node]) desc = this.eApiModule.sendParam[node].desc
                sendObject.nameParam.push(node)
                sendObject.descriptionParam.push(desc)
                sendObject.sendSource.push(this.sendParam[node].source)
            }
        } else {
            for (let node in this.eApiModule.sendParam) {
                sendObject.nameParam.push(node)
                sendObject.descriptionParam.push(this.eApiModule.sendParam[node].desc)
                sendObject.sendSource.push(this.eApiModule.sendParam[node].source)
            }
        }
        this.sendObject = sendObject
        const receiveObject = {
            nameParam: [],
            descriptionParam: [],
            sendSource: [],
            receiveSource: []
        }
        /**
         * 出參結構:
         * node: {
         * 	node: 'x.x.x.x'
         * }
         * 實際使用標題參數為 node.node 最後一個 x
         * node 節點為元件名稱
         */
        const dataMapping = this.eApiModule.fn.getDataMapping()
        if (this.receiveParam) {
            /** 真實節點名稱 */
            const truthNodeArray = []
            for (let node in this.receiveParam) {
                const truthNode = this.receiveParam[node].node.split('.')
                truthNodeArray.push(truthNode.at(-1))
            }
            // 遍歷線上節點比對不同並加載進入編輯過的結構
            for (let sNode in dataMapping) {
                const mappingNode 	= dataMapping[sNode].node.split('.')
                if (truthNodeArray.some(node => node === mappingNode.at(-1))) continue
                else {
                    receiveObject.nameParam.push(mappingNode.at(-1))
                    receiveObject.descriptionParam.push(dataMapping[sNode].desc)
                    receiveObject.receiveSource.push(sNode)
                }
            }
            for (let node in this.receiveParam) {
                let mappingDesc = ''
                const mappingNodeParent = this.receiveParam[node].node.split('.')
                for (let sNode in dataMapping) {
                    const mappingNode = dataMapping[sNode].node.split('.')
                    if (mappingNodeParent.at(-1) === mappingNode.at(-1))
                        mappingDesc = dataMapping[sNode].desc
                }
                receiveObject.nameParam.push(mappingNodeParent.at(-1))
                receiveObject.descriptionParam.push(this.receiveParam[node].desc || mappingDesc)
                receiveObject.receiveSource.push(node)
            }
        } else {
            for (let node in dataMapping) {
                const mappingNode = dataMapping[node].node.split('.')
                receiveObject.nameParam.push(mappingNode.at(-1))
                receiveObject.descriptionParam.push(dataMapping[node].desc)
                receiveObject.receiveSource.push(node)
            }
        }
        this.receiveObject = receiveObject
    }

    /** 建構參數表格 */
    buildParamTable (action) {
        const targetObject      = action === 'send' ? this.sendObject : action === 'receive' ? this.receiveObject : undefined
        if (!targetObject) return
        const dataArray 		= targetObject.nameParam
        const descriptionArray 	= targetObject.descriptionParam
        const sourceArray 		= action === 'send' ? targetObject.sendSource : action === 'receive' ? targetObject.receiveSource : undefined
        const resultTr 			= []
        for (let i = 0, len = dataArray.length; i < len; ++i) {
            /** api param 容器 */
            const nodeElement = CreateUtils.createBeanElement({
                'controlType':  'div',
                'attribute': 	[
                    {
                        'class': 	'col-sm-12 row table-like-container',
                        'children': []
                    }
                ]
            })[0]
            // 總共最多五個欄位
            for (let j = 0; j < 5; ++j) {
                if (j === 3 && action === 'send') continue
                const container = CreateUtils.createBeanElement({'controlType': 'div', 'attribute': [{'children': []}]})[0]
                if (action === 'receive' && this.receiveParam && !this.receiveParam[sourceArray[i]]) break
                switch(j) {
                    case 0:
                        container.classList.add('col-sm-3')
                        const titleElement = CreateUtils.createBeanElement({'controlType': 'label', 'attribute': [{'text': `${ dataArray[i] }(${ descriptionArray[i] })`}]})[0]
                        container.appendChild(titleElement)
                        break
                    case 1:
                        container.classList.add('input-group', 'col-sm-3')
                        let valueData = sourceArray[i]
                        if (action === 'receive' && this.eApiModule.beanMapping && this.eApiModule.beanMapping.itemValue) {
                            let beanMap
                            try {
                                beanMap = JSON.parse(this.eApiModule.beanMapping.itemValue)
                            } catch (e) {}
                            if (beanMap[dataArray[i]]) valueData = beanMap[dataArray[i]]
                        }
                        if (action === 'send' && this.sendParam) 
                            if (this.sendParam[dataArray[i]] && this.sendParam[dataArray[i]].paramValue) valueData = this.sendParam[dataArray[i]].paramValue
                        /** 元件下拉框第一個選項 */
                        const beanOptions = CreateUtils.createBeanOptions(true)
                        beanOptions.forEach(option => {
                            if (option.option.value === valueData) option.option.selected = 'true'
                        })
                        if (action === 'receive') {
                            /** 元件選取下拉框 */
                            const beanSelectElement = CreateUtils.createBeanElement({
                                'controlType': 'select', 
                                'attribute': [
                                    {
                                        'class': 	 'form-control toggle-switch',
                                        'id': 		 `modalSelect${ dataArray[i] }${ CreateUtils.createRandomCode() }`,
                                        'name': 	 `${ action }-select-${ dataArray[i] }`,
                                        'children':  beanOptions
                                    }
                                ]
                            })[0]
                            /** 元件輸入框 */
                            const beanInputElement = CreateUtils.createBeanElement({
                                'controlType': 'text', 
                                'attribute': [
                                    {
                                        'class': 	 'form-control toggle-switch hide',
                                        'id': 		 `modalInput${ dataArray[i] }${ CreateUtils.createRandomCode() }`,
                                        'name': 	 `${ action }-input-${ dataArray[i] }`,
                                        'value': 	 valueData
                                    }
                                ]
                            })[0]
                            /** 切換下拉框及輸入框按鈕 */
                            const switchButtonElement = CreateUtils.createBeanElement({
                                'controlType': 'button', 
                                'attribute': [
                                    {
                                        'class': 	 'btn btn-secondary',
                                        'name': 	 `modalBeanInputSelectSwitch`,
                                        'text': 	 '',
                                        'onclick': 	 'SharedUtils.switchSelectAndInput(event)',
                                        'children':  [
                                            {
                                                'i': {
                                                    'class': 'bi bi-arrow-left-right'
                                                }
                                            }
                                        ]
                                    }
                                ]
                            })[0]
                            container.append(beanSelectElement, beanInputElement, switchButtonElement)
                        } else {
                            const paramSelectPackage = CreateUtils.createParamSelectPackage(`${ action }-input-${ dataArray[i] }`)
                            paramSelectPackage[0].value = valueData || ''
                            while (paramSelectPackage.length > 0) {
                                container.append(paramSelectPackage[0])
                            }
                        }
                        break
                    case 2:
                        container.classList.add(`${ action === 'receive' ? 'col-sm-4' : 'col-sm-5'}`)
                        const buttonFoldElement = CreateUtils.createBeanElement({
                            'controlType': 'button', 
                            'attribute': [
                                {
                                    'type': 'button', 
                                    'class': 'btn btn-info btn-fold', 
                                    'data-fold': 'true', 
                                    'onclick': this.foldParamBlock.bind(this),
                                    'text': '展開'
                                }
                            ]
                        })[0]
                        const buttonAddElement 	= CreateUtils.createBeanElement({
                            'controlType': 'button', 
                            'attribute': [
                                {
                                    'type': 'button', 
                                    'class': 'btn btn-primary btn-add hide', 
                                    'style': 'margin-left: .5rem', 
                                    'data-action': action, 
                                    'data-info': dataArray[i], 
                                    'onclick': this.paramBlockAddRow.bind(this),
                                    'text': '新增對照組'
                                }
                            ]
                        })[0]
                        container.append(buttonFoldElement, buttonAddElement)
                        break
                    case 3:
                        container.classList.add('col-sm-1')
                        const deleteButton = CreateUtils.createBeanElement({
                            'controlType': 'button', 
                            'attribute': [
                                {
                                    'class': 	 'btn btn-danger',
                                    'onclick': 	 'this.closest(".table-like-container").remove()',
                                    'text': 	 '',
                                    'title': 	 '刪除參數',
                                    'children':  [
                                        {
                                            'i': {
                                                'class': 'bi bi-x'
                                            }
                                        }
                                    ]
                                }
                            ]
                        })[0]
                        container.appendChild(deleteButton)
                        break
                    case 4:
                        container.classList.add('col-sm-12', 'param-row', 'no-padding', 'row', 'hide')
                        if (action === 'send' && this.sendParam && this.sendParam[dataArray[i]]) {
                            /** 對照行元素, 結構參照函數內說明 */
                            const paramRows = this.addParamMappingRow(action, dataArray[i], this.sendParam[dataArray[i]].paramMapping)
                            paramRows.forEach(rows => rows.forEach(row => container.appendChild(row.cloneNode(true))))
                        }
                        if (action === 'receive' && this.receiveParam) {
                            for (let nodeName in this.receiveParam) {
                                const mappingName = this.receiveParam[nodeName].node.split('.')
                                if (mappingName.includes(dataArray[i])) {
                                    const paramRows = this.addParamMappingRow(action, dataArray[i], this.receiveParam[nodeName].paramMapping)
                                    paramRows.forEach(rows => rows.forEach(row => container.appendChild(row.cloneNode(true))))
                                }
                            }
                        }
                        break
                }
                nodeElement.appendChild(container)
            }
            resultTr.push(nodeElement)
        }
        if (action === 'send') this.sendStructure = resultTr
        else if (action === 'receive') this.receiveStructure = resultTr
    }

    /**
     * 展開與收合事件
     * @param {Event} e 
     */
    foldParamBlock (e) {
        const tableContainer 	= e.target.closest('.table-like-container')
        const paramRows 		= tableContainer.querySelector('.param-row')
        if (e.target.dataset.fold === 'true') {
            e.target.nextElementSibling.classList.remove('hide')
            e.target.textContent = '收起'
            e.target.dataset.fold = 'false'
            if (paramRows !== null)
                paramRows.classList.remove('hide')
        } else {
            e.target.nextElementSibling.classList.add('hide')
            e.target.textContent = '展開'
            e.target.dataset.fold = 'true'
            if (paramRows !== null)
                paramRows.classList.add('hide')
        }
    }

    /**
     * 新增對照組
     * @param {Event} e 
     */
    paramBlockAddRow(e) {
        const tableContainer = e.target.closest('.table-like-container')
        const node = CreateUtils.createBeanElement({
            'controlType':  'div',
            'attribute': 	[
                {
                    'class': 	'col-sm-12 param-row no-padding row',
                    'children': []
                }
            ]
        })[0]
        const paramRow = this.addParamMappingRow(e.target.dataset.action, e.target.dataset.info)[0]
        paramRow.forEach(element => node.appendChild(element.cloneNode(true)))
        tableContainer.appendChild(node)
    }

    /**
     * 增加參數對照行
     * =
     * 回傳結構會是陣列內陣列
     * return [[...Element], [], [], []]
     * @param {String} action (send, receive) 
     * @param {String} paramName 參數名稱 
     * @returns {Array[Array[Element]]} 
     */
    addParamMappingRow(action, paramName, inputData) {
        const result = []
        let len = 1
        if (inputData) len = inputData.length
        for (let i = 0; i < len; ++i) {
            const rows = CreateUtils.createBeanElement({'controlType': 'apiLine'})
            let count = 0
            rows.forEach(row => {
                const inputElements = row.querySelectorAll('input')
                inputElements.forEach(input => input.name = `modal-${ action }-${ paramName }-${ CreateUtils.createRandomCode() }`)
                if (inputData && count === 0 && inputElements.length > 0) {
                    inputElements.forEach(input => input.value = inputData[i])
                    count++
                } else if (inputData && count === 1 && inputElements.length > 0)inputElements.forEach(input => input.value = inputData[i + 1])
            })
            result.push(rows)
            i++
        }
        return result
    }

    exportData () {
        return JSON.stringify({
            apiName: this.apiName,
            sendParam: this.sendParam || null,
            receiveParam: this.receiveParam || null,
            runMode: this.runMode,
            sourceId: this.sourceId,
            needAutoSetting: this.needAutoSetting,
            needGFormStructure: this.needGFormStructure
        })
    }
}