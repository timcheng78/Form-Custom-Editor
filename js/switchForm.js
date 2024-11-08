/**
 * 編輯 -> 切換表單類型
 * =
 */
function switchFormat() {
    saveForm()
    /** 引入工廠 */
    const factory = window.ComponentFactory
    const drawPage = document.querySelector('#drawPage')
    if (drawPage.innerHTML === '') {
        CreateUtils.createModal(`alert`, {body: '目前無任何表單可以進行切換'})
        return false
    }
    const formDataContainer = drawPage.querySelector('div')
    const formData          = formDataContainer.dataset
    const formName          = formData.formName
    const formTitle         = formData.formTitle
    const formType          = formData.formType
    const formModel         = formData.formModel
    const formToolVersion   = formData.formToolVersion - 0
    /** 線上模式取得模板 */
    // if (onlineMode && (listFrame === undefined || printFrame === undefined)) loadingOnlineFormTemplate()
    try {
        if (formFormatBody === undefined) throw "not defined"
        const switchFormModal = CreateUtils.createModal(`custom`, {
            'title':    `切換表單類型`,
            'body':     formFormatBody,
            'btn': [
                {
                    'class':        'btn btn-secondary',
                    'data-dismiss': 'modal',
                    'text':         '取消',
                },
                {
                    'class': 'btn btn-success',
                    'text':  '確定'
                }
            ],
            'callback': switchFormCallBack
        })

        const formTypeElement = switchFormModal.querySelector('#formFormatFormType')

        formTypeElement.value = (formModel === 'app' ? formModel : '') + formType
        /** 過濾舊版列印 */
        if (template.hasType('print_old')) formTypeElement.querySelector(`option[value="print_old"]`).classList.remove('hide')
        else formTypeElement.querySelector(`option[value="print_old"]`).classList.add('hide')
    } catch (e) {
        console.error(e)
        console.error(`config didn't setting success...`)
    }

    /** ================ 下方皆為函數 ================ */

    /**
     * 切換表單類型按鈕回調
     * =
     * @param {*} index 
     * @param {*} result 
     * @param {*} modalElement 
     * @returns 
     */
    function switchFormCallBack(index,  modalElement) {
        const modalForm = modalElement.querySelector('form')
        if (index === 1) {
            let chooseType, lastVersionFrame
            // 檢查彈出視窗是否有選擇表單類型
            for (let element of modalForm.elements) {
                let isValid = true
                const elementValue  = element.value
                const elementName   = element.name
                switch (elementName) {
                    case 'formFormatFormType':
                        if (elementValue === '0') isValid = false
                        else chooseType = elementValue
                        break
                }
                if (!isValid) {
                    element.classList.add('is-invalid')
                    return false
                }
            }
            // if (onlineMode) {
            //     // 取得線上表單
            //     switch (chooseType) {
            //         case 'add':
            //             lastVersionFrame = formSaveAndLoad('load', {'formName': formName, 'formType': chooseType})[0]
            //             addFrame = lastVersionFrame
            //             if (lastVersionFrame && lastVersionFrame !== '') {
            //                 lastVersionFrame = SharedUtils.onionStringDecode(lastVersionFrame)
            //                 lastVersionFrame = lastVersionFrame.createElemental()
            //             }
            //             break
            //         case 'appadd':
            //             lastVersionFrame = appAddFrame
            //             if (lastVersionFrame && lastVersionFrame !== '') {
            //                 const tempContainer     = CreateUtils.createBeanElement({'controlType': 'div'})[0]
            //                 tempContainer.innerHTML = lastVersionFrame
            //                 lastVersionFrame        = tempContainer.children
            //             }
            //             break
            //         case 'list':
            //             lastVersionFrame = listFrame
            //             if (lastVersionFrame && lastVersionFrame !== '') {
            //                 const tempContainer     = CreateUtils.createBeanElement({'controlType': 'div'})[0]
            //                 tempContainer.innerHTML = lastVersionFrame
            //                 lastVersionFrame        = tempContainer.children
            //             }
            //             break
            //         case 'applist':
            //             lastVersionFrame = appListFrame
            //             if (lastVersionFrame && lastVersionFrame !== '') {
            //                 const tempContainer     = CreateUtils.createBeanElement({'controlType': 'div'})[0]
            //                 tempContainer.innerHTML = lastVersionFrame
            //                 lastVersionFrame        = tempContainer.children
            //             }
            //             break
            //         case 'print':
            //             lastVersionFrame = printFrame
            //             if (lastVersionFrame && lastVersionFrame !== '') {
            //                 const tempContainer     = CreateUtils.createBeanElement({'controlType': 'div'})[0]
            //                 tempContainer.innerHTML = lastVersionFrame
            //                 const tempTable = tempContainer.querySelectorAll('.resultTable')
            //                 const templateScript = tempContainer.querySelectorAll('.resultTableTemplate')
            //                 tempTable.forEach(table => SharedUtils.deconstructTableData(table))
            //                 templateScript.forEach(ts => ts.remove())
            //                 lastVersionFrame        = tempContainer.children
                            
            //             }
            //             break
            //     }
            // } else {
                // 取得本地暫存表單
                // lastVersionFrame = formSaveAndLoad('load', {'formName': formName, 'formType': chooseType})[0]
                const typeTemplate = template.load(chooseType)
                const codeSwitch = document.querySelector('#codeSwitch')
                if (typeTemplate) {
                    lastVersionFrame = typeTemplate.toolFrame
                    isCodeControl = typeTemplate.isCodeControl
                    const formFrame = typeTemplate.formFrame
                    if (frameEditMirror) frameEditMirror.getDoc().setValue(formFrame)
                    switch (chooseType) {
                        case 'add':
                            addInit = typeTemplate.initFrame
                            break
                        case 'appadd':
                            appAddInit = typeTemplate.initFrame
                            break
                        case 'list':
                            listInit = typeTemplate.initFrame
                            break
                        case 'applist':
                            appListInit = typeTemplate.initFrame
                            break
                        case 'print':
                            printInit = typeTemplate.initFrame
                            break
                        case 'print_old':
                            printOldInit = typeTemplate.initFrame
                            break
                    }
                }
                if (lastVersionFrame) {
                    lastVersionFrame = SharedUtils.onionStringDecode(lastVersionFrame)
                    lastVersionFrame = lastVersionFrame.createElemental()
                }
            // }
            const trList = []
            // 列印頁進行特殊比對
            if (chooseType === 'print' && !lastVersionFrame) {
                // 需要檢查差異，並進行元件差異比對
                // const addInformation = formSaveAndLoad('load', {'formName': formName, 'formType': 'add'})
                const addInformation = template.load('add').toolFrame
                processFormTable(addInformation, trList)
                // for (let i = 0, len = addInformation.length; i < len; i++) {
                //     const jsonObject = JSON.parse(addInformation[i])
                //     // 第一次進入列印頁面依照 add 頁面呈現相同畫面
                //     processFormTable(jsonObject.at(-1), trList)
                //     break
                // }
            }
            drawPage.innerHTML = ''
            if (!lastVersionFrame) {
                // 若第一次進入列印頁，將會使用新增頁的樣式進行渲染
                if (trList.length > 0) {
                    const pageContainer = CreateUtils.createPage(chooseType, formName, formTitle)
                    pageContainer.forEach(page => drawPage.appendChild(page))
                    const dataContainer = drawPage.querySelector('div')
                    Object.keys(formData).forEach(dataKey => {
                        dataContainer.dataset[dataKey] = formData[dataKey]
                    });
                    dataContainer.dataset.formType = chooseType
                    const resultGroup       = drawPage.querySelector('.resultGroup')
                    const outputTable       = drawPage.querySelector('.output-table')
                    const beanElements      = trList.createElemental()
                    beanElements.forEach(bean => resultGroup.appendChild(bean))
                    const inContianerBeans  = drawPage.querySelectorAll('.container-component > .pFormItem, .container-component > .pFormItemGroup')
                    const allContainer      = drawPage.querySelectorAll('.container-component')
                    if (outputTable) {
                        const tds = outputTable.querySelectorAll('td')
                        tds[1].appendChild(CreateUtils.createBeanElement({
                            'controlType': 'label', 
                            'attribute': [
                                {
                                    'text': formData.formTitle
                                }
                            ]})[0]
                        )
                    }
                    inContianerBeans.forEach(bean => {
                        const tdParent = bean.closest('td')
                        if (tdParent) tdParent.appendChild(bean)
                    })
                    allContainer.forEach(container => container.remove())
                } else {
                    let formModel = 'web'
                    switch (chooseType) {
                        case 'appadd':
                            template.load('add').toolFrame.createElemental().forEach(element => {
                                drawPage.appendChild(element.cloneNode(true))
                            })
                            formModel = 'app'
                            break
                        case 'applist':
                            const listPageContainer = CreateUtils.createPage('list', formName, formTitle)
                            listPageContainer.forEach(page => drawPage.appendChild(page))
                            formModel = 'app'
                            break
                        default:
                            const pageContainer = CreateUtils.createPage(chooseType, formName, formTitle)
                            pageContainer.forEach(page => drawPage.appendChild(page))
                            break
                    }
                    const dataContainer = drawPage.querySelector('div')
                    Object.keys(formData).forEach(dataKey => {
                        dataContainer.dataset[dataKey] = formData[dataKey]
                    });
                    dataContainer.dataset.formModel = formModel
                    dataContainer.dataset.formType = chooseType.replace(/^app/, '')
                }
            } else {
                for (let element of lastVersionFrame) {
                    drawPage.appendChild(element.cloneNode(true))
                }
                // 初始化清單元件
                if (isListPage()) {
                    const webComponent      = drawPage.querySelectorAll('.web-component')
                    const allListComponents = factory.usedListComponent
                    webComponent.forEach(component => {
                        if (allListComponents[component.dataset.type]) return
                        const listComponent = factory.createList(`__${ component.dataset.type }`)
                        if (!listComponent) return
                        listComponent.mergeComponent(component)
                        component.replaceWith(listComponent.fullComponent)
                    })
                }
            }
            if (!drawPage.querySelector('.col-4.block-drop-container')) drawPage.classList.add('flex-column')
            if (initEditMirror) {
                switch (chooseType) {
                    case 'add':
                        initEditMirror.getDoc().setValue(addInit)
                        break
                    case 'appadd':
                        initEditMirror.getDoc().setValue(appAddInit)
                        break
                    case 'list':
                        initEditMirror.getDoc().setValue(listInit)
                        break
                    case 'applist':
                        initEditMirror.getDoc().setValue(appListInit)
                        break
                    case 'print':
                        initEditMirror.getDoc().setValue(printInit)
                        break
                    case 'print_old':
                        initEditMirror.getDoc().setValue(printOldInit)
                        break
                }
            }
            if (isListPage()) {
                const listData = drawPage.querySelector('div')
                const version = (listData.dataset.formToolVersion || 0) - 0
                if (version !== formToolVersion) VersionModule.advanceEdition(formToolVersion, {frameElement: drawPage, initContent: listInit, version: version, versionControl: VersionModule.checkVersion(version)})
            }
            if (isPrintPage()) {
                const pageTitle = drawPage.querySelector('.pageTitle')
                if (pageTitle && !pageTitle.querySelector('button')) pageTitle.appendChild(customizeButton.createElemental()[0])
            }
            beanToListEvent()
            initDrawPageEvent(true)
            showAPIList()
            newCustomizeColInitial()
            return true
        }
    }

    /**
     * 線上模式讀取線上模板
     * =
     */
    function loadingOnlineFormTemplate() {
        if (!basicParam) basicParam = nursing.createBasicParam()
        if (!dynamicForm) dynamicForm = nursing.createDynamicForm()
        dynamicForm.searchParamDF.formType      = formName
        dynamicForm.searchParamDF.versionNo     = "999998"
        dynamicForm.searchParamDF.frameModel    = 'gFormAppADD'
        basicParam.getCurrDynamicFormFrameByformTypeFrameModel(dynamicForm, function(result) {
            if (result !== null) appAddFrame = result.content
            else appAddFrame = ''
        }, function(error) {
            console.error(`promiseOnlineForm.getCurrDynamicFormFrameByformTypeFrameModel error: ${ error }`)
            if (!$('.mask').hasClass('hide')) {
                CreateUtils.createModal(`alert`, {body: '查詢【FormFrame】發生錯誤！請查看 F12 Console 紀錄並連繫相關人員。'})
            }
        })
        dynamicForm.searchParamDF.frameModel    = 'gFormAppADD_INIT'
        basicParam.getCurrDynamicFormFrameByformTypeFrameModel(dynamicForm, function(result) {
            if (result !== null) appAddInit = result.content
            else appAddInit = ''
        }, function(error) {
            console.error(`promiseOnlineForm.getCurrDynamicFormFrameByformTypeFrameModel error: ${ error }`)
            if (!$('.mask').hasClass('hide')) {
                CreateUtils.createModal(`alert`, {body: '查詢【FromInit】發生錯誤！請查看 F12 Console 紀錄並連繫相關人員。'})
            }
        })
        dynamicForm.searchParamDF.frameModel    = 'gFormAppLIST'
        basicParam.getCurrDynamicFormFrameByformTypeFrameModel(dynamicForm, function(result) {
            if (result !== null) appListFrame = result.content
            else appListFrame = ''
        }, function(error) {
            console.error(`promiseOnlineForm.getCurrDynamicFormFrameByformTypeFrameModel error: ${ error }`)
            if (!$('.mask').hasClass('hide')) {
                CreateUtils.createModal(`alert`, {body: '查詢【FormFrame】發生錯誤！請查看 F12 Console 紀錄並連繫相關人員。'})
            }
        })
        dynamicForm.searchParamDF.frameModel    = 'gFormAppLIST_INIT'
        basicParam.getCurrDynamicFormFrameByformTypeFrameModel(dynamicForm, function(result) {
            if (result !== null) appListInit = result.content
            else appListInit = ''
        }, function(error) {
            console.error(`promiseOnlineForm.getCurrDynamicFormFrameByformTypeFrameModel error: ${ error }`)
            if (!$('.mask').hasClass('hide')) {
                CreateUtils.createModal(`alert`, {body: '查詢【FromInit】發生錯誤！請查看 F12 Console 紀錄並連繫相關人員。'})
            }
        })
        dynamicForm.searchParamDF.frameModel    = 'gFormWebLIST'
        basicParam.getCurrDynamicFormFrameByformTypeFrameModel(dynamicForm, function(result) {
            if (result !== null) listFrame = result.content
        }, function(error) {
            console.error(`promiseOnlineForm.getCurrDynamicFormFrameByformTypeFrameModel error: ${ error }`)
            if (!$('.mask').hasClass('hide')) {
                CreateUtils.createModal(`alert`, {body: '查詢【FormFrame】發生錯誤！請查看 F12 Console 紀錄並連繫相關人員。'})
            }
        })
        dynamicForm.searchParamDF.frameModel    = 'gFormWebLIST_INIT'
        basicParam.getCurrDynamicFormFrameByformTypeFrameModel(dynamicForm, function(result) {
            if (result !== null) listInit = result.content
        }, function(error) {
            console.error(`promiseOnlineForm.getCurrDynamicFormFrameByformTypeFrameModel error: ${ error }`)
            if (!$('.mask').hasClass('hide')) {
                CreateUtils.createModal(`alert`, {body: '查詢【FromInit】發生錯誤！請查看 F12 Console 紀錄並連繫相關人員。'})
            }
        })
        dynamicForm.searchParamDF.frameModel    = 'gFormWebPRINT2'
        basicParam.getCurrDynamicFormFrameByformTypeFrameModel(dynamicForm, function(result) {
            if (result !== null) printFrame = result.content

        }, function(error) {
            console.error(`promiseOnlineForm.getCurrDynamicFormFrameByformTypeFrameModel error: ${ error }`)
            if (!$('.mask').hasClass('hide')) {
                CreateUtils.createModal(`alert`, {body: '查詢【FormFrame】發生錯誤！請查看 F12 Console 紀錄並連繫相關人員。'})
            }
        })
        dynamicForm.searchParamDF.frameModel    = 'gFormWebPRINT2_INIT'
        basicParam.getCurrDynamicFormFrameByformTypeFrameModel(dynamicForm, function(result) {
            if (result !== null) printInit = result.content
        }, function(error) {
            console.error(`promiseOnlineForm.getCurrDynamicFormFrameByformTypeFrameModel error: ${ error }`)
            if (!$('.mask').hasClass('hide')) {
                CreateUtils.createModal(`alert`, {body: '查詢【FromInit】發生錯誤！請查看 F12 Console 紀錄並連繫相關人員。'})
            }
        })
    }

    /**
     * 處理列印類型的表單第一次進入的畫面
     * =
     * @param {Object} jsonObject 
     * @param {Array} listArray 
     * @param {Number} index
     */
    function processFormTable(jsonObject, listArray) {
        for (let key in jsonObject) {
			if (Array.isArray(jsonObject)) {
				processFormTable(jsonObject[key], listArray)
                if (jsonObject[key].tr !== undefined) listArray.at(-1).table.children[1].tbody.children.push(jsonObject[key])
			} else {
                // 處理 tab-pane
                if (key === 'div' && jsonObject[key].role === 'tabpanel') {
                    const tableObject = {
                        'table': {
                            'class': 'resultTable',
                            'data-search-param-g-f': `{"formType":"${ formName }", "sourceId":"eval:sourceId", "formId": "local:gFormWebPRINT2_formId"}`,
                            'children': [
                                {
                                    'thead': {
                                        'children': [
                                            {
                                                'tr': {
                                                    'class': 'trWordCountSetting',
                                                    'children': []
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    'tbody': {
                                        'class': 'tbody',
                                        'children': []
                                    }
                                }
                            ]
                        }
                    }
                    listArray.push(tableObject)
                }

                // 依照表格欄位數生成需要的thead data-word-count
                if (key === 'table') {
                    // 以第一行tr作為基準
                    const classChildren = jsonObject[key].children
                    let firstTr
                    let countTds = []
                    let i = 0;
                    while(countTds.length == 0){
                        if (classChildren[0].tbody) firstTr = classChildren[0].tbody.children[i].tr
                        else if (classChildren[1].tbody) firstTr = classChildren[1].tbody.children[i].tr
                        // 計算總共有幾個td
                        firstTr.children.forEach(element=>{
                            if(element.td.class && element.td.class.indexOf('hide') !== -1) return true
                            countTds.push({
                                'td': {
                                    'class': 'CustomizeColWidth',
                                    'data-word-count': '',
                                    'children': [
                                        {
                                            'div': {
                                                'class': 'fillWordsCol',
                                            }
                                        },{
                                            'div': {
                                                'class': 'displayCounts'
                                            }
                                        }

                                    ]
                                }
                            })
                            // 若是有colspan, 則計算有多少td需要在新增
                            if(element.td.colspan !== undefined){
                                // 需新增數為 colspan - 1
                                for(let i = 1; i < parseInt(element.td.colspan); i++){
                                    countTds.push({
                                        'td': {
                                            'class': 'CustomizeColWidth',
                                            'data-word-count': '',
                                            'children': [
                                                {
                                                    'div': {
                                                        'class': 'fillWordsCol',
                                                    }
                                                },{
                                                    'div': {
                                                    'class': 'displayCounts'
                                                    }
                                                }
                                            ]
                                        }
                                    })
                                }
                            }
                        })
                        // 將需要增加的 word-count欄位放入th
                        listArray[listArray.length-1].table.children[0].thead.children[0].tr.children = countTds
                        i++
                    }
                }
				if (jsonObject[key].children !== undefined) {
					processFormTable(jsonObject[key].children, listArray)
				}
			}
		}
    }
}

/**
 * 編輯 -> 切換表單樣式
 * =
 * =
 */
function switchStyle() {
    saveForm()
    const drawPage = document.querySelector('#drawPage')
    if (drawPage.innerHTML === '') {
        CreateUtils.createModal(`alert`, {body: '目前無任何表單可以進行切換'})
        return false
    }
    const formDataContainer = drawPage.querySelector('div')
    const formData          = formDataContainer.dataset
    try {
        if (formFormatBody === undefined) throw "not defined"
        const switchStyleModel = CreateUtils.createModal(`custom`, {
            'title':    `切換表單樣式`,
            'body':     formStyleBody,
            'btn': [
                {
                    'class':        'btn btn-secondary',
                    'data-dismiss': 'modal',
                    'text':         '取消',
                },
                {
                    'class': 'btn btn-success',
                    'text':  '確定'
                }
            ],
            'callback': styleChangeCallBack
        })

        const rows                  = switchStyleModel.querySelectorAll('.row')
        const formTitleStyleSelect  = switchStyleModel.querySelector('#modalFormTitleStyle')
        const formNavStyleSelect    = switchStyleModel.querySelector('#modalFormNavStyle')
        const formTitleSelect       = switchStyleModel.querySelector('#modalFormTitle')
        const formStyleSelect       = switchStyleModel.querySelector('#modalFormStyle')
        const printFormatSelect     = switchStyleModel.querySelector('#modalprintFormat')
        // const formBlock             = switchStyleModel.querySelector('#modalFormInformationBlock')
        
        formTitleStyleSelect.childNodes.forEach(childrenOptionsControl)
        formNavStyleSelect.childNodes.forEach(childrenOptionsControl)
        formTitleSelect.childNodes.forEach(childrenOptionsControl)
        formStyleSelect.childNodes.forEach(childrenOptionsControl)
        rows.forEach(childrenOptionsControl)
        // formBlock.childNodes.forEach(childrenOptionsControl)

        if (formData.pageStyle) {
            const pageStyle = SharedUtils.onionStringDecode(formData.pageStyle)
            formTitleStyleSelect.value = pageStyle[0]
            formNavStyleSelect.value = pageStyle[1]
            formTitleSelect.value = pageStyle[2]
            // formBlock.value = pageStyle[3]
            formStyleSelect.value = pageStyle[3]
            if (pageStyle[4]) printFormatSelect.value = pageStyle[4]
        }

        /** ================ 下方皆為函數 ================ */

        /**
         * 樣式切換按鈕回調
         * =
         * @param {*} index 
         * @param {*} result 
         * @param {*} modalElement 
         * @returns 
         */
        function styleChangeCallBack(index, modalElement) {
            const modalForm = modalElement.querySelector('form')
            if (index === 1) {
                let styleList           = []
                for (let element of modalForm.elements) {
                    let isValid         = true
                    const elementValue  = element.value
                    const elementName   = element.name
                    switch (elementName) {
                        case 'modalFormTitleStyle':
                            if (elementValue === '0') isValid = false
                            else styleList.push(elementValue)
                            break
                        case 'modalFormNavStyle':
                            if (element.closest('.row').classList.contains('hide'))  {
                                styleList.push('default')
                                continue
                            }
                            if (elementValue === '0') isValid = false
                            else styleList.push(elementValue)
                            break
                        case 'modalFormTitle':
                            if (elementValue === '0') isValid = false
                            else styleList.push(elementValue)
                            break
                        case 'modalFormInformationBlock':
                            if (elementValue === '0') isValid = false
                            else styleList.push(elementValue)
                            break
                        case 'modalFormStyle':
                            if (element.closest('.row').classList.contains('hide'))  {
                                styleList.push('style1-1')
                                continue
                            }
                            if (elementValue === '0') isValid = false
                            else styleList.push(elementValue)
                            break
                        case 'modalprintFormat':
                            if (element.closest('.row').classList.contains('hide'))  {
                                styleList.push('portrait')
                                continue
                            }
                            styleList.push(elementValue)
                            break
                    }
                    if (!isValid) {
                        element.classList.add('is-invalid')
                        return false
                    }
                }
                for (let i = 0; i < styleList.length; i++) {
                    const tabContent    = drawPage.querySelectorAll('.tab-content')
                    const titleBar      = drawPage.querySelector('.title-bar')
                    const tabMenu       = drawPage.querySelector('.tab-menu')
                    const tabs          = drawPage.querySelector('#tabs')
                    switch(i) {
                        case 0:
                            /** 標題樣式 */
                            if (titleBar === null) break
                            titleBar.classList.remove('hide')
                            if (styleList[i] === 'none')  titleBar.classList.add('hide')
                            if (styleList[i] === 'styleI')  titleBar.classList.remove('vertical')
                            if (styleList[i] === 'styleII') titleBar.classList.add('vertical')
                            if (!isListPage()) break
                            const mobileFixed = titleBar.querySelector('#mobile-fixed')
                            const tableButtonBlock = drawPage.querySelector('.table-btn-block')
                            if (styleList[i] === 'styleSearch') {
                                if (tableButtonBlock) {
                                    tableButtonBlock.querySelectorAll('button').forEach(button => {
                                        if (button.textContent.trim() === '列印') button.classList.add('hide')
                                    })
                                }
                                if (mobileFixed.querySelector('#search-bar')) break
                                const searchForm = {
                                    "form": {
                                        "class": "form-inline",
                                        "id": "search-bar",
                                        "onsubmit": "return false;",
                                        "children": [
                                            {
                                                "input": {
                                                    "class": "form-control input-default dtDateFormItem dateInput",
                                                    "data-date-format": "yyyy-mm-dd",
                                                    "data-default-value": "-0y-0M-0d",
                                                    "data-min-view": "3",
                                                    "data-max-view": "4",
                                                    "type": "text",
                                                    "id": "queryBeginDate"
                                                }
                                            },
                                            {
                                                "input": {
                                                    "class": "form-control input-default dtDateFormItem dateInput",
                                                    "data-date-format": "yyyy-mm-dd",
                                                    "data-default-value": "-0y-0M-0d",
                                                    "data-min-view": "3",
                                                    "data-max-view": "4",
                                                    "type": "text",
                                                    "id": "queryEndDate"
                                                }
                                            },
                                            {
                                                "button": {
                                                    "class": "btn btn-sm btn-main btn-primary",
                                                    "id": "search-button",
                                                    "type": "submit",
                                                    "text": "",
                                                    "children": [
                                                        {
                                                            "i": {
                                                                "class": "feather-printer"
                                                            }
                                                        },
                                                        {
                                                            "span": {
                                                                "text": "列印"
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                }.createElemental()[0]
                                mobileFixed.prepend(searchForm)
                            } else if (styleList[i] === 'default' && mobileFixed.querySelector('#search-bar')) {
                                mobileFixed.querySelector('#search-bar').remove()
                                if (tableButtonBlock) {
                                    tableButtonBlock.querySelectorAll('button').forEach(button => {
                                        if (button.textContent.trim() === '列印') button.classList.remove('hide')
                                    })
                                }
                            }
                            break
                        case 1:
                            /** 頁籤 */
                            if (styleList[i] === 'styleI') {
                                tabContent.forEach(tab => tab.classList.add('border'))
                                if (tabMenu) tabMenu.classList.remove('hide')
                                else if (tabs) break
                                else {
                                    const ulElement = CreateUtils.createBeanElement({'controlType': 'ul'})[0]
                                    if (titleBar !== null) titleBar.after(ulElement)
                                }
                            }
                            if (styleList[i] === 'styleII') {
                                if (tabMenu) {
                                    const liElements = tabMenu.querySelectorAll('li')
                                    tabMenu.classList.add('hide')
                                    liElements.forEach((li, index) => {
                                        if (index > 0 && index < (liElements.length - 1)) li.remove()
                                    })
                                    tabContent.forEach(tab => {
                                        const tabPanes = tab.querySelectorAll('.tab-pane')
                                        tab.classList.remove('border')
                                        tabPanes.forEach((pane, index) => {
                                            if (index > 0) pane.remove()
                                        })
                                    })
                                }
                            }
                            break
                        case 2:
                            /** 表頭(列印頁與其他頁不同) */
                            if (isPrintPage()) {
                                const outputTable = document.querySelector('.resultGroup .pageTitle.model .output-table')
                                switch (styleList[i]) {
                                    case 'styleI':
                                        outputTable.classList.remove('hide')
                                        break
                                    case 'styleII':
                                        outputTable.classList.add('hide')
                                        break
                                }
                            } else {
                                let tabContentBlock = document.querySelector('.tab-content-block, #listContent')
                                const formTitleDiv  = document.querySelector('.form-title-div')
                                const headSwitch    = document.querySelector('#headSwitch')
                                switch (styleList[i]) {
                                    case 'styleI':
                                        headSwitch.parentNode.classList.add('hide')
                                        if (formTitleDiv) break
                                        if (!tabContentBlock) tabContentBlock = document.querySelector('.title-bar')
                                        tabContentBlock.prepend(CreateUtils.createBeanElement({
                                            'controlType': 'div',
                                            'attribute':    [
                                                {
                                                    'class':        'form-title-div block-drop-container col-12',
                                                    'data-role':    'drag-drop-container'
                                                }
                                            ]
                                        })[0])
                                        headSwitch.parentNode.classList.remove('hide')
                                        break
                                    case 'styleII':
                                        headSwitch.parentNode.classList.add('hide')
                                        if (formTitleDiv) formTitleDiv.remove()
                                        break
                                }
                            }
                            break
                        case 3:
                            formData.styleVer = styleList[i]
                            break
                        case 4:
                            if (!isPrintPage()) break
                            const printFormatArray = styleList[i].split(',')
                            let printControll
                            if (!drawPage.querySelector('#printControll')) {
                                printControll = document.createElement('div')
                                printControll.id = 'printControll'
                                drawPage.appendChild(printControll)
                            } else printControll = drawPage.querySelector('#printControll')
                            printControll.dataset.size = `A4 ${ printFormatArray[0] }`
                            formData.printFormatDirector = printFormatArray[0]
                            formData.printFormat = printFormatArray[1]
                            const allResultTable = drawPage.querySelectorAll('.resultTable')
                            switch (printFormatArray[1]) {
                                case 'single':
                                    break
                                case 'report':
                                    
                                    allResultTable.forEach((table, index) => {
                                        if (printFormatArray[0] === 'portrait') table.classList.add('report')
                                        if (index > 0) table.remove()
                                        else {
                                            try {
                                                const searchParamGF = JSON.parse(table.dataset.searchParamGF)
                                                searchParamGF.beginDate = "local:printBeginDT"
                                                searchParamGF.endDate = "local:printEndDT"
                                                delete searchParamGF.formId
                                                table.dataset.searchParamGF = JSON.stringify(searchParamGF)
                                            } catch (e) {
                                                console.error(e)
                                            }
                                            const tbody = table.querySelector('tbody')
                                            const tableRowTitle = CreateUtils.createBeanElement({
                                                'controlType': 'tablerow',
                                                'attribute': 	[
                                                    {
                                                        'class': printFormatArray[0] === 'landscape' ? 'print-title-row' : ''
                                                    }
                                                ]
                                            })[0]
                                            const tableRow = CreateUtils.createBeanElement({
                                                'controlType': 'tablerow',
                                                'attribute': 	[
                                                    {
                                                        'class': ''
                                                    }
                                                ]
                                            })[0]
                                            const tdClone = CreateUtils.createBeanElement({
                                                'controlType': 'tabledata',
                                                'attribute': 	[
                                                    {
                                                        'class': '',
                                                        'data-role': 'drag-drop-container',
                                                    }
                                                ]
                                            })[0]
                                            switch (printFormatArray[0]) {
                                                case 'portrait':
                                                    tdClone.classList.add('print-title-col')
                                                    tableRowTitle.appendChild(tdClone.cloneNode(true))
                                                    tableRow.appendChild(tdClone.cloneNode(true))
                                                    tdClone.classList.remove('print-title-col')
                                                    tableRowTitle.appendChild(tdClone.cloneNode(true))
                                                    tableRow.appendChild(tdClone.cloneNode(true))
                                                    break
                                                case 'landscape':
                                                    tableRowTitle.appendChild(tdClone.cloneNode(true))
                                                    tableRow.appendChild(tdClone)
                                                    break
                                            }
                                            while (tbody.lastElementChild) {
                                                tbody.removeChild(tbody.lastElementChild)
                                            }
                                            tbody.append(tableRowTitle, tableRow)

                                            const settingRowTitle = CreateUtils.createBeanElement({
                                                'controlType': 'tablerow',
                                                'attribute': 	[
                                                    {
                                                        'class': 'trWordCountSetting'
                                                    }
                                                ]
                                            })[0]
                                            const settingTdClone = CreateUtils.createBeanElement({
                                                'controlType': 'tabledata',
                                                'attribute': 	[
                                                    {
                                                        'class': 'CustomizeColWidth',
                                                        'data-word-count': '',
                                                        'children': [
                                                            {
                                                                'div': {
                                                                    'class': 'fillWordsCol',
                                                                }
                                                            },{
                                                                'div': {
                                                                    'class': 'displayCounts'
                                                                }
                                                            }

                                                        ]
                                                    }
                                                ]
                                            })[0]

                                            const thead = table.querySelector('thead');
                                            thead.innerHTML = ''
                                            thead.append(settingRowTitle)
                                            if (printFormatArray[0] === 'portrait') settingTdClone.classList.add('print-title-col')
                                            settingRowTitle.appendChild(settingTdClone.cloneNode(true))
                                            if (printFormatArray[0] === 'portrait') {
                                                settingTdClone.classList.remove('print-title-col')
                                                settingRowTitle.appendChild(settingTdClone.cloneNode(true))
                                            }
                                        }
                                    })
                                    break
                            }
                            beanToListEvent()
                        case 7:
                            /** 側邊區域 */
                            if (isPrintPage()) break
                            if (styleList[i] === 'none') {
                                // step.1 add flex-column
                                drawPage.classList.add('flex-column')
                                // step.2 remove two div
                                let mainChild, firstBoolean = true
                                const drawPageChildren = drawPage.children
                                if (drawPageChildren.length > 2) break
                                for (let i = 0, len = drawPageChildren.length; i < len; ++i) {
                                    const child = drawPageChildren[i]
                                    if (!child) break
                                    if (child.children.length > 1) mainChild = child.children
                                    child.remove()
                                    i--
                                }
                                for (let i = 0, len = mainChild.length; i < len; ++i) {
                                    if (!mainChild[i]) break
                                    if (i === 0 && firstBoolean) {
                                        for (let data in formData) {
                                            mainChild[i].dataset[data] = formData[data]
                                        }
                                        mainChild[i].dataset.pageStyle = JSON.stringify(styleList)
                                        firstBoolean = false
                                    }
                                    drawPage.appendChild(mainChild[i])
                                    i--
                                }
                                break
                            } else {
                                // step.1 remove drawPage flex-column
                                drawPage.classList.remove('flex-column')
                                // step.2 add two div (one for side block, one for main block)
                                const dropContainer =  CreateUtils.createBeanElement({
                                    'controlType': 'div',
                                    'attribute':    [
                                        {
                                            'class':        'col-4 block-drop-container',
                                            'data-role':    'drag-drop-container'
                                        }
                                    ]
                                })[0]
                                const mainContainer =  CreateUtils.createBeanElement({
                                    'controlType': 'div',
                                    'attribute':    [
                                        {
                                            'class':        'col-8 d-flex flex-column',
                                            'data-role':    'drag-drop-container'
                                        }
                                    ]
                                })[0]
                                // step.3 append to drawPage
                                const drawPageChildren = drawPage.children
                                if (drawPageChildren.length > 2 && (isAddPage() || isPrintPage()) || (isListPage() && drawPageChildren[0].classList.contains('title-bar'))) {
                                    for (let i = 0, len = drawPageChildren.length; i < len; ++i) {
                                        const child = drawPageChildren[i]
                                        if (!child) break
                                        mainContainer.appendChild(child)
                                        i--
                                    }
                                    if (styleList[i] === 'left') {
                                        for (let data in formData) {
                                            dropContainer.dataset[data] = formData[data]
                                        }
                                        dropContainer.dataset.pageStyle = JSON.stringify(styleList)
                                        drawPage.appendChild(dropContainer)
                                        drawPage.appendChild(mainContainer)
                                    } else if (styleList[i] === 'right') {
                                        for (let data in formData) {
                                            mainContainer.dataset[data] = formData[data]
                                        }
                                        mainContainer.dataset.pageStyle = JSON.stringify(styleList)
                                        drawPage.appendChild(mainContainer)
                                        drawPage.appendChild(dropContainer)
                                    }
                                } else {
                                    if (styleList[i] === 'left' && drawPageChildren[1].classList.contains('block-drop-container') ||
                                        styleList[i] === 'right' && drawPageChildren[0].classList.contains('block-drop-container'))
                                        drawPageChildren[0].parentNode.insertBefore(drawPageChildren[1], drawPageChildren[0])
                                    for (let data in formData) {
                                        drawPageChildren[0].dataset[data] = formData[data]
                                    }
                                    drawPageChildren[0].dataset.pageStyle = JSON.stringify(styleList)
                                }
                            }
                            break
                        default:
                            break
                    }
                }
                formData.pageStyle = JSON.stringify(styleList)
                initDrawPageEvent()
                return true
            }
        }

        /**
         * 切換樣式選項動態效果
         * =
         * @param {Element} option 
         */
        function childrenOptionsControl(option) {
            const type = option.dataset.type
            if (type) {
                if (isAddPage() && !type.includes('add')) option.classList.add('hide')
                if (isListPage() && !type.includes('list')) option.classList.add('hide')
                if (isPrintPage() && !type.includes('print')) option.classList.add('hide')
            }
        }
    } catch (e) {
        console.error(e)
        console.error(`config didn't setting success...`)
    }
}

/**
 * 編輯 -> 匯出元件
 */
function exportBean() {
    if ($('.selected').length === 0) {
        CreateUtils.createModal(`alert`, {body: '目前沒選取任何元件，無法匯出'})
        return false
    }
    let selectedBean = $('.selected')
    let passGate     = true
    selectedBean.each(function(index) {
        if ($(this).data('name') === undefined) {
            passGate = false
            return false
        }
    })
    if (!passGate) {
        CreateUtils.createModal(`alert`, {body: '目前選取的含有非元件，無法匯出'})
        return false
    }
    let result = []
    selectedBean.each(function(index) {
        let node = {
            'text': $(this).data('title'),
            'type': $(this).data('controlType'),
            'value': $(this).data('name'),
            'structure': JSON.stringify(this.convertToJson())
        }
        result.push(node)
    })
    if (result.length > 0) {
        CreateUtils.createModal(`custom`, {
            'title':    `匯出元件`,
            'body':     {'textarea': {'style': 'width: 100%; height: 700px', 'text': JSON.stringify(result, null, '\t')}},
            'btn': [
                {
                    'class': 'btn btn-success',
                    'text':  '確定'
                }
            ],
            'callback': function(index) {
                return true
            }
        })
    }
}