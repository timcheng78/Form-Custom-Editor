/**
 * 檔案 -> 開新表單
 * =
 * 新建表單功能
 */
function newForm(selector) {
    // 確認當前是否有檔案存在，若有則進行詢問
    if (!checkingSaveForm(newForm)) return
    try {
        if (newFormBody === undefined) throw "not defined"
        let drawPage = document.querySelector('#drawPage')
        if (selector !== undefined) drawPage = selector
        const newFormModal = CreateUtils.createModal(`custom`, {
            'title':    `新增表單`,
            'body':     newFormBody,
            'btn': [
                {
                    'class':        'btn btn-secondary',
                    'data-dismiss': 'modal',
                    'type':  	    'button',
                    'text':         '取消',
                },
                {
                    'class': 'btn btn-success',
                    'type':  'button',
                    'text':  '新增'
                }
            ],
            'callback': newFormCallBack
        })
        const newFormType = newFormModal.querySelector('#modalNewFormType')
        if (drawPage.id === 'queryPage') {
            newFormType.innerHTML = ''
            const options = qlNewFormOptions.createElemental()
            options.forEach(option => newFormType.appendChild(option))
        }

        /**
         * 新增表單按鈕回調
         * =
         * @param {*} index 
         * @param {*} result 
         * @param {*} modalElement 
         * @returns 
         */
        function newFormCallBack(index, modalElement) {
            const modalForm = modalElement.querySelector('form')
            if (index === 1) {
                let formName, formTitle, formType
                for (let element of modalForm.elements) {
                    const elementValue  = element.value
                    const elementName   = element.name
                    let isValid         = true
                    let regex
                    switch (elementName) {
                        case 'modalNewFormName':
                            if (elementValue === '') isValid = false
                            else {
                                regex       = new RegExp(/^\w+$/g)
                                isValid     = regex.test(elementValue)
                                formName    = elementValue
                            }
                            break
                        case 'modalNewFormTitle':
                            if (elementValue === '') isValid = false
                            else {
                                regex       = new RegExp(/^[\w\u4e00-\u9fa5]+$/g)
                                isValid     = regex.test(elementValue)
                                formTitle   = elementValue
                            }
                            break
                        case 'modalNewFormType':
                            if (elementValue === '') isValid = false
                            else formType = elementValue
                            break
                    }
                    if (!isValid) {
                        element.classList.add('is-invalid')
                        return false
                    }
                }
                const pageContainer = CreateUtils.createPage(formType, formName, formTitle)
                pageContainer.forEach(page => drawPage.appendChild(page))
                if (initEditMirror) initEditMirror.getDoc().setValue(addInit)
                initDrawPageEvent(true)
                // DrawPageFunctions.bindEventRepeat()
                return true
            }
        }
    } catch (e) {
        console.error(e)
        console.error(`config didn't setting success...`)
    }
}

/**
 * 檔案 -> 開啟舊檔
 * =
 * 開啟暫存表單功能
 * 查詢 client 端是否有暫存資料
 * 若有則彈出視窗供選擇
 * 6.25 添加線上模式提供查詢系統
 */
function openForm(selector) {
    // 確認當前是否有檔案存在，若有則進行詢問
    if (!checkingSaveForm(openForm)) return
    let drawPage = document.querySelector('#drawPage')
    if (selector !== undefined) drawPage = selector
    const formList = []
    if (onlineMode) {
        SharedUtils.loadingToggle()
        basicParam.getFormVersionAllList(dynamicForm, successCall, errorCall)
        return
    }
    const allForm = window.localStorage
    let regex
    for (let key in allForm) {
        regex = new RegExp(/^formTool+/)
        if (regex.test(key)) {
            if (key === 'formTool.noDownload') continue
            const tmpArr = key.split('.')
            if (tmpArr.length === 2) {
                try {
                    const forms = JSON.parse(allForm[key])
                    for (let form of forms) {
                        if (form.available === 9 || (form.formType !== 'add' && form.formType !== 'query')) continue
                        formList.push({
                            'uuid':     form.uuid,
                            'formName': form.formName,
                            'formType': form.formType,
                            'dateTime': form.creatTime,
                            'version':  form.beanAttributeVersion
                        })
                    }
                } catch (e) {
                    console.error(`error: ${ e }. key: ${ key }`)
                    console.log(allForm)
                }
            }
        }
    }
    if (formList.length === 0) {
        CreateUtils.createModal(`alert`, {body: '目前無任何檔案可以開啟'})
        return
    }

    formList.sortJson({key: 'dateTime', orderby: 'desc'}, {key: 'formType', orderby: 'asc'}, {key: 'formName', orderby: 'asc'})
    openFormModalBuild(formList)

    function successCall(result) {
        if (result === null || result.formVersion.length === 0) result = {"formVersion": []}
        formVersionList = result.formVersion
        openFormModalBuild(formVersionList)
        SharedUtils.loadingToggle()
    }

    function errorCall(error) {
        console.error(`getFormVersionAllList error: ${ error }`)
        SharedUtils.loadingToggle()
        CreateUtils.createModal(`alert`, {body: '發生錯誤！請查看 F12 Console 紀錄並連繫相關人員。'})
    }

    function openFormModalBuild(dataList) {
        if (dataList.length === 0) {
            CreateUtils.createModal(`alert`, {body: '目前無任何檔案可以開啟'})
            return
        }
        const formBody      = $.extend(true, {}, openFormBody)
        const formDataList  = []
        for (let dataFormObject of dataList) {
            const tableRow = CreateUtils.createBeanElement({'controlType': 'tablerow', 'attribute': [{'class': 'text-center'}]})[0]
            let clickEvent
            if (onlineMode) 
                clickEvent = `chooseThisFormOnlineMode(document.getElementById("${ drawPage.id }"), '${ dataFormObject.id }', '${ dataFormObject.formType }'); return false`
            else
                clickEvent = `chooseThisForm(document.getElementById("${ drawPage.id }"), '${ dataFormObject.formName }', '${ dataFormObject.uuid }', '${ dataFormObject.version }'); return false`
            const button = CreateUtils.createBeanElement({
                'controlType': 'button',
                'attribute':    [
                    {
                        'class':    'btn btn-success',
                        'type':     'button',
                        'text':     '選擇', 
                        'onclick':  clickEvent
                    }
                ]
            })[0]
            for (let j = 0; j < 5; j++) {
                let text = ''
                switch (j) {
                    case 0:
                        text = onlineMode ? dataFormObject.formType : dataFormObject.formName
                        break
                    case 1:
                        text = onlineMode ? dataFormObject.title : (dataFormObject.formType === 'add' ? '新增/更新頁' : dataFormObject.formType === 'list' ? '清單頁' : (dataFormObject.formType === 'query' ? '查詢清單' : '列印頁'))
                        break
                    case 2:
                        text = onlineMode ? dataFormObject.version : dataFormObject.dateTime
                        break
                    case 3:
                        text = ''
                        break
                }
                const tableData = CreateUtils.createBeanElement({'controlType': 'tabledata', 'attribute': [{'text': text}]})[0]
                if (j === 3) tableData.appendChild(button) 
                tableRow.appendChild(tableData)
            }
            formDataList.push(tableRow)
        }
        const openFormModal = CreateUtils.createModal(`custom`, {
            'title':    `開啟表單`,
            'body':     formBody
        })

        const openFormTable     = openFormModal.querySelector('#openFormTable > tbody')
        const searchFormInput   = openFormModal.querySelector('#modalSearchForm')
        formDataList.forEach(tr => openFormTable.appendChild(tr))
        searchFormInput.addEventListener('blur', searchFormEvent)
        searchFormInput.addEventListener('keyup', keyupSearchEvent)

        /**
         * 查詢開啟舊表清單
         * =
         * @param {*} e 
         */
        function searchFormEvent(e) {
            const value             = e.target.value.toLowerCase()
            const allTableRows      = openFormModal.querySelectorAll('tbody > tr')
            const breakException    = { }
            allTableRows.forEach(tr => {
                const tableData = tr.childNodes
                try {
                    tableData.forEach((td, index) => {
                        if (index === 0 || index === 1) {
                            const textValue = td.textContent.toLowerCase()
                            if (textValue.includes(value)) { 
                                tr.classList.remove('hide')
                                throw breakException
                            } else tr.classList.add('hide')
                        }
                    })
                } catch (e) { }
            })
        }

        /**
         * Enter 按鍵監聽
         * =
         * 按 Enter 進入查詢事件
         * @param {*} e 
         */
        function keyupSearchEvent(e) {
            if (e.which === 13) searchFormEvent(e)
        }
    }
}

/**
 * 檔案 -> 儲存表單
 * =
 * 表單暫時存檔功能
 * 將當前表單暫存至 client 端 (session)
 * @param {Element} selector
 * @param {Boolean} modal [如不需要彈窗則不用填參數] 
 * @param {Boolean} needSave
 * @returns {Boolean} true
 */
function saveForm(selector, modal, needSave = false) {
    SharedUtils.clearSelectedElements()
    SharedUtils.clearTableActiveData()
    SharedUtils.clearTableActiveHead()
    SharedUtils.clearTableHoverButton()
    SharedUtils.clearHover()
    let drawPage = document.querySelector('#drawPage')
    if (selector !== undefined) drawPage = selector
    if (drawPage.innerHTML === '') return null
    const factory       = window.ComponentFactory
    const jsonObject    = drawPage.convertToJson()
    const dataset       = drawPage.querySelector('div').dataset
    // const formName      = dataset.formName
    // const formTitle     = dataset.formTitle
    let formType      = dataset.formType
    const formModel     = dataset.formModel
    const frame         = drawPage.convertToJson().div.children
    // if (same && !needSave) return null
    // const formData    = {
    //     'uuid':         uuid,
    //     'formName':     formName,
    //     'formTitle':    formTitle,
    //     'formType':     formType,
    //     'creator':      'AUTO CREATED',
    //     'desc':         'SAVE FORM ACTION',
    //     'isBean':       'N'
    // }
    if (initEditMirror && formType === 'add') addInit = initEditMirror.getDoc().getValue()
    if (initEditMirror && formType === 'list') listInit = initEditMirror.getDoc().getValue()
    if (initEditMirror && formType === 'print') printInit = initEditMirror.getDoc().getValue()
    if (formModel !== 'web') formType = formModel + formType
    if (!checkingDiff(formType)) return null
    if (!window.template) window.template = new TemplateModule()
    let formFrame           = SharedUtils.convertIntoFormFrame(frame, dataset)
    const dynamicVersion    = SharedUtils.convertIntoFormVersion(dataset, false)
    const oldFormVersion    = SharedUtils.convertIntoOldFormVersion(dataset, false)
    let selectIniit
    switch (formType) {
        case 'add':
            selectIniit = addInit
            break
        case 'appadd':
            selectIniit = appAddInit
            break
        case 'list':
            selectIniit = listInit
            break
        case 'applist':
            selectIniit = appListInit
            break
        case 'print':
            selectIniit = printInit
            break
        case 'print_old':
            selectIniit = printOldInit
            break
    }
    template.save(formType, {
        toolFrame: jsonObject.div.children,
        formFrame: frameEditMirror ? frameEditMirror.getDoc().getValue() : SharedUtils.style_html(formFrame),
        components: factory.exportComponents(),
        // formVersion: JSON.stringify(dynamicVersion.toXml()),
        initFrame: selectIniit,
        // apiStructure: JSON.parse(dynamicVersion.DynamicFormTemplate.apiStructure.replace(/&amp;/g, '&').replace(/&quot;/g,'"')),
        // verification: dynamicVersion.DynamicFormTemplate.verification ? JSON.parse(dynamicVersion.DynamicFormTemplate.verification) : '',
        isCodeControl: false
    })
    console.log(oldFormVersion.toXml());
    if (formType === 'add') {
        template.setContentKey(formType, 'oldFormVersion', JSON.stringify(oldFormVersion.toXml()))
        template.setContentKey(formType, 'formVersion', JSON.stringify(dynamicVersion.toXml()))
        template.setContentKey(formType, 'apiStructure', JSON.parse(dynamicVersion.DynamicFormTemplate.apiStructure.replace(/&amp;/g, '&').replace(/&quot;/g,'"')))
        template.setContentKey(formType, 'verification', dynamicVersion.DynamicFormTemplate.verification ? JSON.parse(dynamicVersion.DynamicFormTemplate.verification) : '')
    }
    // formSaveAndLoad('save', formData, jsonObject.div.children)
    // if (isAddPage()) saveFormBean(formData)
    if (modal !== undefined) CreateUtils.createModal(`alert`, {body: '儲存成功'})
    return true
}

/**
 * 檢查是否有變化
 * @param { string } formType 
 * @return { boolean }
 */
function checkingDiff (formType) {
    const drawPage = document.querySelector('#drawPage')
    const oldTemp  = template.load(formType)
    if (oldTemp === null) return true
    const newFrame = drawPage.convertToJson().div.children
    const oldFrame = oldTemp.toolFrame
    if (!Object.deepEqual(newFrame, oldFrame)) return true
    const newInit  = initEditMirror.getDoc().getValue()
    const oldInit  = oldTemp.initFrame
    if (newInit !== oldInit) return true
    const dataset  = drawPage.querySelector('div').dataset
    const newApi   = JSON.parse(SharedUtils.convertIntoFormVersion(dataset, false).DynamicFormTemplate.apiStructure.replace(/&amp;/g, '&').replace(/&quot;/g,'"'))
    const oldApi   = oldTemp.apiStructure
    if (!Object.deepEqual(newApi, oldApi)) return true

    return false
}

/**
 * 檔案 -> 預覽表單
 * 表單預覽操作功能
 */
function viewForm() {
    saveForm()
    const addTemplate = template.load('add')
    // let testUrl = `http://172.16.100.21:8086/CSFormAPI/dynamic/getFormTemplate`
    let realUrl = `${ window.location.origin }/CSFormAPI/dynamic/getFormTemplate`
    const data = new FormData()
    data.append('content', JSON.parse(addTemplate.formVersion))
    return fetch (realUrl,
        {
            method: 'POST',
            body: data
        })
        .then(response => response.json())
        .then(result => {
            addTemplate.dynamicFormObject = result
            return addTemplate
        })
    // const drawPage = document.querySelector('#drawPage')
    // if (selector !== undefined) drawPage = selector
    // const formData = drawPage.querySelector('div').dataset
    // if (drawPage.innerHTML === '') {
    //     CreateUtils.createModal(`alert`, {body: '目前無任何表單可以進行預覽'})
    //     return false
    // }
    // const addFormRecord     = formSaveAndLoad('load', {'formName': formData.formName, 'formType': 'add'})
    // const listFormRecord    = formSaveAndLoad('load', {'formName': formData.formName, 'formType': 'list'})
    // const printFormRecord   = formSaveAndLoad('load', {'formName': formData.formName, 'formType': 'print'})
    // if (!addFormRecord) {
    //     CreateUtils.createModal(`alert`, {body: '目前無任何表單可以進行預覽，請儲存表單重新再試'})
    //     return false
    // }
    // window['formType'] = formData.formType
    // if (addFormRecord) {
    //     window['addFormFrame']      = SharedUtils.convertIntoFormFrame(JSON.parse(addFormRecord[0]), 'add', true)
    //     window['formBeanData']      = SharedUtils.convertIntoFormVersion(formData, false)
    // }
    // if (listFormRecord)
    //     window['listFormFrame']     = SharedUtils.convertIntoFormFrame(JSON.parse(listFormRecord[0]), 'list', true)
    // if (printFormRecord)
    //     window['printFormFrame']    = SharedUtils.convertIntoFormFrame(JSON.parse(printFormRecord[0]), 'print', true)
    // window.open('viewForm.html', '_blank')
}

/**
 * 檔案 -> 匯入表單
 * 表單匯入功能
 * [目前先實作本工具使用的表單格式]
 */
function importForm() {
    // if (fileModeTest) {
    // if (!checkingSaveForm(importForm)) return

    // let testUrl = `http://172.16.100.21:8086/NoteSystem/iqNote2gform4zr/listTemplate`
    let realUrl = `${ window.location.origin }/NoteSystem/iqNote2gform4zr/listTemplate`
    fetch (realUrl, 
        {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(result => {
            const dataSource = result.resultSet
            const formBody   = $.extend(true, {}, openFormBody)
            const formDataList  = []
            for (let dataFormObject of dataSource) {
                const tableRow = CreateUtils.createBeanElement({'controlType': 'tablerow', 'attribute': [{'class': 'text-center'}]})[0]
                const buttonElement = {
                    'button': {
                        'type': 'button',
                        'class': 'btn btn-success',
                        'text': '匯入',
                        'data-template-id': dataFormObject.id,
                        'data-template-version': dataFormObject.version,
                        'onclick': importTemplate
                    }
                }.createElemental()[0]
                for (let j = 0; j < 4; j++) {
                    let text = ''
                    switch (j) {
                        case 0:
                            text = dataFormObject.id
                            break
                        case 1:
                            text = dataFormObject.title
                            break
                        case 2:
                            text = dataFormObject.version
                            break
                        case 3:
                            text = ''
                            break
                    }
                    const tableData = CreateUtils.createBeanElement({'controlType': 'tabledata', 'attribute': [{'text': text}]})[0]
                    if (j === 3) tableData.appendChild(buttonElement)
                    tableRow.appendChild(tableData)
                }
                formDataList.push(tableRow)
            }
            const importFormModal = CreateUtils.createModal(`custom`, {
                'title':    `匯入作業`,
                'body':     formBody
            })

            const openFormTable     = importFormModal.querySelector('#openFormTable > tbody')
            const searchFormInput   = importFormModal.querySelector('#modalSearchForm')
            searchFormInput.addEventListener('blur', searchFormEvent)
            searchFormInput.addEventListener('keyup', keyupSearchEvent)
            formDataList.forEach(tr => {
                openFormTable.appendChild(tr)
            })

            /**
             * 查詢開啟舊表清單
             * =
             * @param {*} e 
             */
            function searchFormEvent(e) {
                const value             = e.target.value.toLowerCase()
                const allTableRows      = importFormModal.querySelectorAll('tbody > tr')
                const breakException    = { }
                allTableRows.forEach(tr => {
                    const tableData = tr.childNodes
                    try {
                        tableData.forEach((td, index) => {
                            if (index === 0 || index === 1) {
                                const textValue = td.textContent.toLowerCase()
                                if (textValue.includes(value)) { 
                                    tr.classList.remove('hide')
                                    throw breakException
                                } else tr.classList.add('hide')
                            }
                        })
                    } catch (e) { }
                })
            }

            /**
             * Enter 按鍵監聽
             * =
             * 按 Enter 進入查詢事件
             * @param {*} e 
             */
            function keyupSearchEvent(e) {
                if (e.which === 13) searchFormEvent(e)
            }


        })

    function importTemplate(e) {
        console.log(e.target.dataset)
        // let testUrl = `http://172.16.100.21:8086/NoteSystem/iqNote2gform4zr/xml2json`
        let realUrl = `${ window.location.origin }/NoteSystem/iqNote2gform4zr/xml2json`
        const URLParams = new URLSearchParams({
            id: e.target.dataset.templateId,
            version: e.target.dataset.templateVersion,
        })
        
        fetch(`${realUrl}?${URLParams}`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(result => {
                processResponse(result)
            })
    }

    
    
    // const importFile = document.querySelector('#import-file')
    // if (importFile !== null) importFile.remove()
    // const inputNode = {
    //     'input': {
    //         class:  'hide',
    //         type:   'file',
    //         id:     'import-file',
    //         accept: '.json'
    //     }
    // }
    // const inputElement = inputNode.createElemental()[0]
    // document.body.appendChild(inputElement)
    // inputElement.addEventListener('change', importFormChanged)
    // inputElement.click()
    // } else {
    //     CreateUtils.createModal(`alert`, {body: '目前功能暫停使用！'})
    //     return false
    // }

    // const importFormModal = CreateUtils.createModal(`custom`, {
    //     'title':    `匯入表單`,
    //     'body':     importFormBody,
    //     'btn': [
    //         {
    //             'class':        'btn btn-secondary',
    //             'data-dismiss': 'modal',
    //             'type':  	    'button',
    //             'text':         '取消',
    //         },
    //         {
    //             'class': 'btn btn-success',
    //             'type':  'button',
    //             'text':  '匯入'
    //         }
    //     ],
    //     'callback': importFormCallBack
    // })

    // const importTemplateInput = importFormModal.querySelector('#modalImportTemplate')
    // const importSubTemplatesInput = importFormModal.querySelector('#modalImportSubTemplates')

    // importTemplateInput.addEventListener('change', (e) => {
    //     e.target.nextElementSibling.textContent = e.target.files[0].name
    // })
    // importSubTemplatesInput.addEventListener('change', (e) => {
    //     let fileName = ''
    //     console.log(e.target.files)
    //     Array.from(e.target.files).forEach(file => {
    //         if (fileName.length > 0) fileName += ','
    //         fileName += file.name
    //     })
    //     e.target.nextElementSibling.textContent = fileName
    // })

    // function importFormCallBack(index, modalElement) {
    //     const modalForm = modalElement.querySelector('form')
    //     if (index === 1) {
    //         let formFiles, subTemplates
    //         for (let element of modalForm.elements) {
    //             const elementValue  = element.value
    //             const elementName   = element.name
    //             let isValid         = true
    //             switch (elementName) {
    //                 case 'modalImportTemplate':
    //                     if (elementValue === '') isValid = false
    //                     else formFiles = element.files
    //                     break
    //                 case 'modalImportSubTemplates':
    //                     subTemplates = element.files
    //                     break
    //             }
    //             if (!isValid) {
    //                 element.classList.add('is-invalid')
    //                 return false
    //             }
    //         }
    //         const data = new FormData()
    //         data.append('file', formFiles[0], formFiles[0].name)
    //         if (subTemplates.length > 0) {
    //             Array.from(subTemplates).forEach(file => {
    //                 data.append('childFiles', file, file.name)
    //             })
    //         } else data.append('childFiles', '')
    //         fetch(`${ const_csFormApiUrl }/iqNote2gform4zr/xml2json`, {
    //             method: 'POST',
    //             body: data
    //         }).then(
    //             response => response.json() // if the response is a JSON object
    //           ).then(
    //             success => processResponse(success) // Handle the success response object
    //           ).catch(
    //             error => console.log(error) // Handle the error response object
    //           )
    //         return true
    //     }
    // }

    function processResponse(jsonObject) {
        /** 引入工廠 */
        const factory = window.ComponentFactory
        /** 彈出視窗關閉按鈕 */
        const closeButton = document.querySelector('.modal-header button')
        const drawPage  = document.querySelector('#drawPage')
        const sortObject = {}
        let tabIndex = 0
        for (let data of jsonObject) {
            if (!sortObject[data.tabGuid]) sortObject[data.tabGuid] = {}
            if (!sortObject[data.tabGuid][data.containerGuid]) sortObject[data.tabGuid][data.containerGuid] = []
            sortObject[data.tabGuid][data.containerGuid].push(data)
        }
        console.log(sortObject)
        if (initEditMirror) initEditMirror.getDoc().setValue(addInit)
        for (let tabUUID in sortObject) {
            // 頁籤層
            const tabContent = sortObject[tabUUID]
            const tableArray = []
            for (let containerUUID in tabContent) {
                // 內容層
                const beanArray = tabContent[containerUUID]
                const checkBoxItems = []
                const radioBoxItems = []
                // 進行 tableRow 新增並找尋適當位置放置
                const trClone = CreateUtils.createBeanElement({
                    'controlType': 'tablerow',
                    'attribute': 	[
                        {
                            'children': [
                                {
                                    'td': {
                                        'class': '',
                                        'data-role': 'drag-drop-container',
                                    }
                                }
                            ]
                        }
                    ]
                })[0]
                for (let beanObject of beanArray) {
                    if (!tabContent.tabName) tabContent.tabName = beanObject.tabTitle
                    let controlType = ''
                    let rowTitle = ''
                    switch(beanObject.controller.toLowerCase()) {
                        case 'checkbox':
                            controlType = 'checkbox'
                            break
                        case 'choice':
                        case 'choicecontainer':
                            controlType = 'radio'
                            break
                        case 'combobox':
                            controlType = 'select'
                            break
                        case 'date':
                            controlType = 'datetime'
                            break
                        case 'label':
                            controlType = 'label'
                            break
                        case 'number':
                        case 'signature':
                        case 'textfield':
                            controlType = 'text'
                            break
                        case 'textarea':
                            controlType = 'textarea'
                            break
                        default:
                            controlType = 'label'
                            continue
                    }
                    if (controlType === 'checkbox') {
                        checkBoxItems.push(beanObject)
                        continue
                    } else if (controlType === 'radio' && (!beanObject.UIValue || !beanObject.UIDesc)) {
                        radioBoxItems.push(beanObject)
                        continue
                    }
                    let dataTitle = beanObject.controllerTitle ? beanObject.controllerTitle.replace(/：/g, '') : beanObject.containerTitle.replace(/：/g, '')
                    let defaultBeanName = beanObject.controllerGuid
                    const component = factory.create(`__${ controlType }`, defaultBeanName, defaultBeanName, dataTitle)
                    beanObject.seq = component.seq
                    component.controllerGuid = beanObject.controllerGuid
                    if (beanObject.PROP) component.dataset.PROP = beanObject.PROP
                    if (beanObject.Ext_PROP) component.dataset.Ext_PROP = beanObject.Ext_PROP
                    if (beanObject.required !== undefined) component.dataset.required = beanObject.required
                    if (component.controlType !== 'radio' && component.controlType !== 'checkbox' && controlType !== 'label') {
                        component.fullComponent.prepend(CreateUtils.createBeanElement({
                            'controlType': 'label',
                            'attribute': 	[
                                {
                                    'class': 'h6 canEditDiv',
                                    'draggable': 'true',
                                    'data-edit': 'true',
                                    'text': beanObject.controllerTitle
                                }
                            ]
                        })[0])
                        if (beanObject.tail) {
                            component.fullComponent.append(CreateUtils.createBeanElement({
                                'controlType': 'label',
                                'attribute': 	[
                                    {
                                        'class': 'h6 canEditDiv',
                                        'draggable': 'true',
                                        'data-edit': 'true',
                                        'text': beanObject.tail
                                    }
                                ]
                            })[0])
                        }
                    }
                    switch(component.controlType) {
                        case 'select':
                        case 'radio':
                        case 'checkbox':
                            component.dataset.uiValue = beanObject.UIValue ? beanObject.UIValue : beanObject.controllerTitle
                            component.dataset.uiDesc = beanObject.UIDesc ? beanObject.UIDesc : beanObject.controllerTitle
                            break
                    }
                    component.modifyAttribute()
                    if (beanObject.parentID) {
                        const parentNode = findObjectByGuid(sortObject, beanObject.parentID)
                        console.log(parentNode)
                        if (parentNode.seq) {
                            const parentComponent = factory.getRegisterComponentBySeq(parentNode.seq)
                            for (let i = 0, len = parentComponent.uiValue.length; i < len; ++i) {
                                if (parentComponent.uiValue[i] === beanObject.parentValue) {
                                    parentComponent.componentElement[i].appendChild(component.fullComponent)
                                    parentComponent.modifyAttribute()
                                    break
                                }
                            }
                        }
                    } else {
                        if (beanObject.containerTitle && beanObject.containerTitle) rowTitle = beanObject.containerTitle.replace(/：/g, '')
                        const dataTd = trClone.querySelectorAll('td')[0]
                        if (rowTitle) {
                            dataTd.appendChild(CreateUtils.createBeanElement({
                                'controlType': 'label',
                                'attribute': 	[
                                    {
                                        'class': 'h6 canEditDiv',
                                        'draggable': 'true',
                                        'data-edit': 'true',
                                        'text': rowTitle
                                    }
                                ]
                            })[0])
                        }
                        dataTd.appendChild(component.fullComponent)
                    }
                }
                if (checkBoxItems.length > 0) {
                    let uiDesc = checkBoxItems.map(x => x.controllerTitle ? x.controllerTitle : x.containerTitle).join(',')
                    let uiValue = uiDesc
                    let uiGuid = checkBoxItems.map(x => x.controllerGuid).join(',')
                    let dataTitle = checkBoxItems[0].controllerTitle ? checkBoxItems[0].controllerTitle.replace(/：/g, '') : checkBoxItems[0].containerTitle.replace(/：/g, '')
                    let defaultBeanName = checkBoxItems[0].controllerGuid
                    let rowTitle = ''
                    if (checkBoxItems[0].containerTitle && checkBoxItems[0].containerTitle) rowTitle = checkBoxItems[0].containerTitle.replace(/：/g, '')
                    const component = factory.create(`__checkbox`, defaultBeanName, defaultBeanName, dataTitle)
                    component.dataset.uiValue = uiValue
                    component.dataset.uiDesc = uiDesc
                    component.controllerGuid = uiGuid
                    if (checkBoxItems[0].PROP) component.dataset.PROP = checkBoxItems[0].PROP
                    if (checkBoxItems[0].Ext_PROP) component.dataset.Ext_PROP = checkBoxItems[0].Ext_PROP
                    if (checkBoxItems[0].required !== undefined) component.dataset.required = checkBoxItems[0].required
                    component.modifyAttribute()
                    checkBoxItems.forEach(item => item.seq = component.seq)
                    if (checkBoxItems[0].parentID) {
                        const parentNode = findObjectByGuid(sortObject, checkBoxItems[0].parentID)
                        if (parentNode.seq) {
                            const parentComponent = factory.getRegisterComponentBySeq(parentNode.seq)
                            for (let i = 0, len = parentComponent.uiValue.length; i < len; ++i) {
                                if (parentComponent.uiValue[i] === checkBoxItems[0].parentValue) {
                                    console.log(parentComponent.componentElement[i])
                                    parentComponent.componentElement[i].appendChild(component.fullComponent)
                                    parentComponent.modifyAttribute()
                                    break
                                }
                            }
                        }
                    } else {
                        const dataTd = trClone.querySelectorAll('td')[0]
                        if (rowTitle) {
                            dataTd.appendChild(CreateUtils.createBeanElement({
                                'controlType': 'label',
                                'attribute': 	[
                                    {
                                        'class': 'h6 canEditDiv',
                                        'draggable': 'true',
                                        'data-edit': 'true',
                                        'text': rowTitle
                                    }
                                ]
                            })[0])
                        }
                        dataTd.appendChild(component.fullComponent)
                    }
                }
                if (radioBoxItems.length > 0) {
                    let uiDesc = radioBoxItems.map(x => x.controllerTitle ? x.controllerTitle : x.containerTitle).join(',')
                    let uiValue = uiDesc
                    let uiGuid = radioBoxItems.map(x => x.controllerGuid).join(',')
                    let dataTitle = radioBoxItems[0].controllerTitle ? radioBoxItems[0].controllerTitle.replace(/：/g, '') : radioBoxItems[0].containerTitle.replace(/：/g, '')
                    let defaultBeanName = radioBoxItems[0].controllerGuid
                    let rowTitle = ''
                    if (radioBoxItems[0].containerTitle && radioBoxItems[0].containerTitle) rowTitle = radioBoxItems[0].containerTitle.replace(/：/g, '')
                    const component = factory.create(`__radio`, defaultBeanName, defaultBeanName, dataTitle)
                    component.dataset.uiValue = uiValue
                    component.dataset.uiDesc = uiDesc
                    component.controllerGuid = uiGuid
                    if (radioBoxItems[0].PROP) component.dataset.PROP = radioBoxItems[0].PROP
                    if (radioBoxItems[0].Ext_PROP) component.dataset.Ext_PROP = radioBoxItems[0].Ext_PROP
                    if (radioBoxItems[0].required !== undefined) component.dataset.required = radioBoxItems[0].required
                    component.modifyAttribute()
                    radioBoxItems.forEach(item => item.seq = component.seq)
                    if (radioBoxItems[0].parentID) {
                        const parentNode = findObjectByGuid(sortObject, radioBoxItems[0].parentID)
                        console.log(parentNode)
                        if (parentNode.seq) {
                            const parentComponent = factory.getRegisterComponentBySeq(parentNode.seq)
                            for (let i = 0, len = parentComponent.uiValue.length; i < len; ++i) {
                                if (parentComponent.uiValue[i] === radioBoxItems[0].parentValue) {
                                    console.log(parentComponent.componentElement[i])
                                    parentComponent.componentElement[i].appendChild(component.fullComponent)
                                    parentComponent.modifyAttribute()
                                    break
                                }
                            }
                        }
                    } else {
                        const dataTd = trClone.querySelectorAll('td')[0]
                        if (rowTitle) {
                            dataTd.appendChild(CreateUtils.createBeanElement({
                                'controlType': 'label',
                                'attribute': 	[
                                    {
                                        'class': 'h6 canEditDiv',
                                        'draggable': 'true',
                                        'data-edit': 'true',
                                        'text': rowTitle
                                    }
                                ]
                            })[0])
                        }
                        dataTd.appendChild(component.fullComponent)
                    }
                }
                tableArray.push(trClone)
            }
            if (tabIndex > 0) addTabs()
            const navItem = drawPage.querySelectorAll(`.nav-item`)[tabIndex]
            const tabPane = drawPage.querySelector(navItem.firstChild.getAttribute('href'))
            const tbody = tabPane.querySelector('.table tbody')
            navItem.firstChild.textContent = tabContent.tabName
            tbody.children[0].remove()
            tableArray.forEach(data => tbody.appendChild(data))
            tabIndex++
        }
        initDrawPageEvent(true)
        beanToListEvent()
        if (closeButton) closeButton.click()
    }

    function findObjectByGuid (data, controllerGuid) {
        if (Array.isArray(data)) {
            for(let x of data) {
                if (findObjectByGuid(x, controllerGuid)) return findObjectByGuid(x, controllerGuid)
            }
        } else {
            for (let uuid in data) {
                const obj = data[uuid]
                if (Array.isArray(obj) && findObjectByGuid(obj, controllerGuid)) return findObjectByGuid(obj, controllerGuid)
                else if (uuid === 'controllerGuid' && obj === controllerGuid) return data
                else if (typeof obj === 'object') {
                    if (findObjectByGuid(obj, controllerGuid)) return findObjectByGuid(obj, controllerGuid)
                }
            }
        }
    }
}

/**
 * 檔案 -> 匯出表單
 * 表單匯出功能
 * Step1. 儲存表單
 * Step2. 檢查是否有表單存在(使用 data-form-name & data-form-type)
 * Step3. 取得最新版的表單資料(form & bean)
 * Step4. 轉換 form 為 formFrame
 * Step5. 轉換 bean 為 formVersion
 * Step6. 檢查是否開啟線上模式進行線上匯出
 */
function exportForm() {
    /** 引入工廠 */
    const factory           = window.ComponentFactory
    /** 表單畫布 */
    const drawPage          = document.querySelector('#drawPage')
    /** 表單資訊存放區 */
    const formDataContainer = drawPage.querySelector('div')
    // saveForm(drawPage, undefined, true)
    saveForm()
    if (formDataContainer === null) {
        CreateUtils.createModal(`alert`, {body: '目前無任何表單可以匯出'})
        return false
    }
    /** 表單資訊 */
    const formData          = formDataContainer.dataset
    const frame             = drawPage.convertToJson().div.children
    let formFrame           = SharedUtils.convertIntoFormFrame(frame, formData)
    let versionXml          = SharedUtils.convertIntoFormVersion(formData)
    const warningCheckbox = {
        'div': {
            'class':    'flex-fill form-check',
            'children': [
                {
                    'input': {
                        'class':    'form-check-input',
                        'type':     'checkbox',
                        'id':       'warningCheckbox'
                    }
                },
                {
                    'label': {
                        'class':    'form-check-label',
                        'for':      'warningCheckbox',
                        'text':     '不再顯示'
                    }
                }
            ]
        }
    }
    console.log(formFrame, versionXml)
    if (fileModeTest) {
        // 24 文件模式
        // Step.1 create js
        // let dVersion = pdVersion + 1
        // let jsFileText = ''
        // const xmlString = JSON.stringify(versionXml)
        // const jsonString = {
        //     addFrame: '',
        //     addInit: '',
        //     listFrame: '',getCurrDynamicFormTemplateV3
        //     listInit: '',
        //     printFrame: '',
        //     printInit
        // }
        // jsFileText += 'syncTryCount = 0;'
        // jsFileText += 'syncCount = -1;'
        // jsFileText += 'versionArr = [],'
        // jsFileText += 'frameArr = [];'
        // jsFileText += `dVersion = ${ dVersion };`;
        // jsFileText += 'var c=-1;'
        // jsFileText += 'var c2=-1;'
        // jsFileText += `versionArr[++c]={"formType":"${ formData.formName }","version":"${ ++lastVersionRecord }","ts":"${ new Date().format('yyyy-MM-dd HH:mm:ss') }","content":"${ xmlString.substring(1, xmlString.length - 1) }"};`
        // // add
        // if (addFrame && addInit) {
        //     jsonString.addFrame = addFrame
        //     jsonString.addInit = addInit
        //     const addFrameString = JSON.stringify(addFrame)
        //     const addInitString = JSON.stringify(addInit)
        //     jsFileText += `frameArr[++c2]={"formType":"${ formData.formName }","frameModel":"gFormWebADD","version":"${ ++lastVersionRecord }","note":"工具匯出產生","ts":"${ new Date().format('yyyy-MM-dd HH:mm:ss') }","content":"${ addFrameString.substring(1, addFrameString.length - 1) }"};`
        //     jsFileText += `frameArr[++c2]={"formType":"${ formData.formName }","frameModel":"gFormWebADD_INIT","version":"${ ++lastVersionRecord }","note":"工具匯出產生","ts":"${ new Date().format('yyyy-MM-dd HH:mm:ss') }","content":"${ addInitString.substring(1, addInitString.length - 1) }"};`
        // }
        // // list
        // if (listFrame && listInit) {
        //     jsonString.listFrame = listFrame
        //     jsonString.listInit = listInit
        //     const listFrameString = JSON.stringify(listFrame)
        //     const listInitString = JSON.stringify(listInit)
        //     jsFileText += `frameArr[++c2]={"formType":"${ formData.formName }","frameModel":"gFormWebLIST","version":"${ ++lastVersionRecord }","note":"工具匯出產生","ts":"${ new Date().format('yyyy-MM-dd HH:mm:ss') }","content":"${ listFrameString.substring(1, listFrameString.length - 1) }"};`
        //     jsFileText += `frameArr[++c2]={"formType":"${ formData.formName }","frameModel":"gFormWebLIST_INIT","version":"${ ++lastVersionRecord }","note":"工具匯出產生","ts":"${ new Date().format('yyyy-MM-dd HH:mm:ss') }","content":"${ listInitString.substring(1, listInitString.length - 1) }"};`
        // }
        // // print
        // if (printFrame && printInit) {
        //     jsonString.printFrame = printFrame
        //     jsonString.printInit = printInit
        //     const printFrameString = JSON.stringify(printFrame)
        //     const printInitString = JSON.stringify(printInit)
        //     jsFileText += `frameArr[++c2]={"formType":"${ formData.formName }","frameModel":"gFormWebPRINT2","version":"${ ++lastVersionRecord }","note":"工具匯出產生","ts":"${ new Date().format('yyyy-MM-dd HH:mm:ss') }","content":"${ printFrameString.substring(1, printFrameString.length - 1) }"};`
        //     jsFileText += `frameArr[++c2]={"formType":"${ formData.formName }","frameModel":"gFormWebPRINT2_INIT","version":"${ ++lastVersionRecord }","note":"工具匯出產生","ts":"${ new Date().format('yyyy-MM-dd HH:mm:ss') }","content":"${ printInitString.substring(1, printInitString.length - 1) }"};`
        // }
        // jsFileText += `formToolJsonData = \`${ JSON.stringify(jsonString) }\`;`
        // jsFileText += 'doSyncFormVersion(true);'
        // // Step.2 upload js
        // const MIME_TYPE = 'text/html';
        // const sendData = new FormData()
        // const blob = new Blob([jsFileText])
        // const file = new File([blob], `${ formData.formName }_${ dVersion }_1.js`, {
        //     type: MIME_TYPE,
        //     lastModifiedDate: new Date(),
        // })
        // sendData.append("file_Agreement", file)
        // sendData.append("sysModel", "db")
        // sendData.append("states", "Y")
        // //去除前部格式信息（如果有需求）
        // const fileStore = nursing.getFileStore()
        // fileStore.uploadFilePromise(sendData)
        //     .then(response => {
        //         return response.json()
        //     })
        //     .then(result => {
        //         const fileStoreId = result.data[0].fileStore.id
        //         // Step.3 advance edition 
        //         const editionControlObject = {
        //             dircataId: dircataId,
        //             fileStoreId: fileStoreId,
        //             sysModel: "db",
        //             dVersion: dVersion,
        //             pdVersion: pdVersion,
        //             dType: "1", // 1. 進版 2. 修正 3. 分支 4. 複製
        //             userId: dirUserId,
        //             pcvctId: pcvctId || ''
        //         }
        //         fetch(`${ const_csFormApiUrl }/editionControl`, {
        //             method: 'POST',
        //             body: JSON.stringify(editionControlObject),
        //             headers: {
        //                 'content-type': 'application/json',
        //                 'Authorization': `Basic ${ token }`
        //             }
        //         })
        //         .then(response => {
        //             CreateUtils.createModal(`alert`, {body: '匯出成功！'})
        //         })
        //     })
        // if (window.localStorage['formTool.noDownload'] === undefined) {
        //     const confirmModal = CreateUtils.createModal(`confirm`, {
        //         'title':    `詢問`,
        //         'body':     `是否需要順便下載表單文檔？`,
        //         'footer':   warningCheckbox.createElemental()[0],
        //         'callback': function(result) {
        //             if (result) {
        //                 SharedUtils.downloadFile(jsFileText, `${ formData.formName }_${ dVersion }_1.js`)
        //                 return true
        //             }
        //         }
        //     })
        //     const warningElement = confirmModal.querySelector('#warningCheckbox')
        //     if (warningElement !== null) warningElement.addEventListener('click', (e) => {
        //         if (e.target.checked) window.localStorage['formTool.noDownload'] = "on"
        //     })
        // }
        let templateContainer
        if (template.container) 
            templateContainer = template.container
        else 
            templateContainer = new TemplateContainer({
                operation:          operation,
                version:            0,
                hospital_name:      hospitalName,
                hospital_title:     hospitalTitle,
                template_type:      'GForm',
                template_name:      formData.formName,
                template_title:     formData.formTitle
            })
        const tempArray = []
        if (template.content) {
            for (let type in template.content) {
                const temp = new TemplateObject({
                    type:           type,
                    content:        template.content[type],
                    creator:        dirUserId,
                    create_time:    new Date().getTime(),
                    description:    ''
                })
                temp.isChanged = 1
                tempArray.push(temp)
            }
            if (tempArray.length !== templateContainer.templates) {
                tempArray.forEach(temp => {
                    let changed = false
                    for (let i = 0, len = templateContainer.templates.length; i < len; ++i) {
                        if (temp.type === templateContainer.templates[i].type) {
                            templateContainer.templates[i] = temp
                            changed = true
                            break
                        }
                    }
                    if (!changed) templateContainer.templates.push(temp)
                })
            }
        }
        const exportModal = CreateUtils.createModal(`custom`, {
			'title':    `準備匯出作業`,
			'body':     exportConfirmBody,
			'btn': [
				{
					'class':        'btn btn-secondary',
					'data-dismiss': 'modal',
					'type':  		'button',
					'text':         '取消',
				},
				{
					'class': 'btn btn-success',
					'type':  'button',
					'text':  '確定'
				}
			],
			'callback': exportCallBack
		})
        const formVersionBlock = exportModal.querySelector('.form-version-block')
        const addDescriptionRow = exportModal.querySelector('.add-row')
        const listDescriptionRow = exportModal.querySelector('.list-row')
        const printDescriptionRow = exportModal.querySelector('.print-row')
        let keyupValue = ''
        let versionMirror
        exportModal.addEventListener('keyup', (e) => {
            if (e.target.id === 'momentModal') {
                if (e.which === 27) keyupValue = ''
                else if (e.which >= 65 && e.which <= 90) keyupValue += e.key
            }
            if (keyupValue === 'formversionedit') {
                keyupValue = ''
                const formVersionArea  = exportModal.querySelector('#formVersion')
                formVersionBlock.classList.remove('hide')
                versionMirror = CodeMirror.fromTextArea(formVersionArea, {
                    mode: 'application/xml',
                    lineNumbers: true,
                    lineWrapping: true,
                    theme: 'abcdef'
                })
                try {
                    let formVersion = template.load('add').formVersion
                    versionMirror.setValue(JSON.parse(formVersion))
                } catch (e) {
                    console.log('新增頁必須要調整才可手動更改formversion')
                }
            }
        })
        tempArray.forEach(template => {
            switch (template.type) {
                case 'add':
                    addDescriptionRow.classList.remove('hide')
                    break
                case 'list':
                    listDescriptionRow.classList.remove('hide')
                    break
                case 'print':
                    printDescriptionRow.classList.remove('hide')
                    break
            }
        })
        function exportCallBack(index, modalElement) {
            const modalForm = modalElement.querySelector('form')
			if (index === 1) {
                let description = {
                    add: '',
                    list: '',
                    print: ''
                }
                let formal = 0
                let exportMode = 0
                for (let element of modalForm.elements) {
                    if (element.closest('.row').classList.contains('hide')) continue
                    let isValid = true
                    const elementName 	= element.name
					const elementValue 	= element.value
                    switch (elementName) {
                        case 'modalAddDescription':
                            if (elementValue === '') isValid = false
                            else description.add = elementValue
                            break
                        case 'modalListDescription':
                            if (elementValue === '') isValid = false
                            else description.list = elementValue
                            break
                        case 'modalPrintDescription':
                            if (elementValue === '') isValid = false
                            else description.print = elementValue
                            break
                        case 'modalTemplateStatus':
                            if (element.checked && element.value === '1') formal = 1
                            break
                        case 'modalTemplateType':
                            if (element.checked && element.value === '1') exportMode = 1
                            break;
                    }
                    if (!isValid) {
                        element.classList.add('is-invalid')
                        return false
                    }
                }
                templateContainer.templates.forEach(template => {
                    if (description[template.type] !== '') template.description = description[template.type]
                    if (template.type === 'add' && versionMirror) template.content.formVersion = versionMirror.getDoc().getValue()
                    if (template.type === 'add') {
                        switch (exportMode) {
                            case 0:
                                if (template.content.oldFormVersion) delete template.content.oldFormVersion
                                break;
                            case 1:
                                delete template.content.formVersion
                                delete template.content.formFrame
                                break;
                        }
                    }
                })
                templateContainer.status = formal
                console.log(templateContainer)
                TemplateModule.addTemplate(templateContainer)
                    .then(data => {
                        console.log('Success: ', data)
                        if (data.code === 0 && data.data) {
                            template.container = new TemplateContainer(data.data)
                            template.container.templates = data.data.templates
                            CreateUtils.createModal(`alert`, {body: '匯出成功！'})
                        }
                    })
                    .catch(error => {
                        console.error('Error: ', error)
                    })
            }
        }
        
    } else {
        if (isTest && onlineMode) {
            // upload dynamicForm
            // formVersion
            let totalLength = 3
            if (initEditMirror && formData.formType === 'add' && (formData.formModel === 'web' || !formData.formModel)) addInit = initEditMirror.getDoc().getValue()
            if (initEditMirror && formData.formType === 'add' && formData.formModel === 'app') appAddInit = initEditMirror.getDoc().getValue()
            if (initEditMirror && formData.formType === 'list' && (formData.formModel === 'web' || !formData.formModel)) listInit = initEditMirror.getDoc().getValue()
            if (initEditMirror && formData.formType === 'list' && formData.formModel === 'app') appListInit = initEditMirror.getDoc().getValue()
            if (initEditMirror && formData.formType === 'print') printInit = initEditMirror.getDoc().getValue()
            if (formData.formType === 'add' && (formData.formModel === 'web' || !formData.formModel) || 
                formData.formType === 'list' && (formData.formModel === 'web' || !formData.formModel) ||
                formData.formType === 'print') {
                var version = eNursing.extend({}, nursing.createFormVersion())
                    version.formType = formData.formName
                    version.content = versionXml
                    version.creatorId = 'toolAuto'
                    version.creatorName = 'toolAuto'
                    version.modifyUserId = 'toolAuto'
                    version.modifyUserName = 'toolAuto'
                    basicParam.addFormVersion(version, addOrUpdSuccess, addOrUpdError)
            } else totalLength--
            // formFrame
            let frameModel = 'gFormWebADD'
            if (formData.formType === 'add' && formData.formModel === 'app') frameModel = 'gFormAppADD'
            else if (formData.formType === 'list' && formData.formModel === 'app') frameModel = 'gFormAppLIST'
            else if (formData.formType === 'list' && (formData.formModel === 'web' || !formData.formModel)) frameModel = 'gFormWebLIST'
            else if (formData.formType === 'print') frameModel = 'gFormWebPRINT2'
            
            var exportFrame = eNursing.extend({}, nursing.createFormFrame())
                exportFrame.formType = formData.formName
                exportFrame.frameModel = frameModel
                exportFrame.content = formFrame
                exportFrame.note = 'auto create'
                exportFrame.creatorId = 'toolAuto'
                exportFrame.creatorName = 'toolAuto'
                exportFrame.modifyUserId = 'toolAuto'
                exportFrame.modifyUserName = 'toolAuto'
                basicParam.addFormFrame(exportFrame, addOrUpdSuccess, addOrUpdError)
            // checking init
            frameModel = 'gFormWebADD_INIT'
            if (formData.formType === 'add' && formData.formModel === 'app') frameModel = 'gFormAppADD_INIT'
            else if (formData.formType === 'list' && formData.formModel === 'app') frameModel = 'gFormAppLIST_INIT'
            else if (formData.formType === 'list' && (formData.formModel === 'web' || !formData.formModel)) frameModel = 'gFormWebLIST_INIT'
            else if (formData.formType === 'print') frameModel = 'gFormWebPRINT2_INIT'
            let formInit = addInit
            if (formData.formType === 'add' && formData.formModel === 'app') formInit = appAddInit
            else if (formData.formType === 'list' && formData.formModel === 'app') formInit = appListInit
            else if (formData.formType === 'list' && (formData.formModel === 'web' || !formData.formModel)) formInit = listInit
            else if (formData.formType === 'print') formInit = printInit
            if (formInit) {
                var frameInit = eNursing.extend({}, nursing.getFormFrame())
                frameInit.formType = formData.formName
                frameInit.frameModel = frameModel
                frameInit.content = formInit
                frameInit.note = 'auto create'
                frameInit.creatorId = 'toolAuto'
                frameInit.creatorName = 'toolAuto'
                frameInit.modifyUserId = 'toolAuto'
                frameInit.modifyUserName = 'toolAuto'
                basicParam.addFormFrame(frameInit, addOrUpdSuccess, addOrUpdError)
            } else totalLength--
            var c = 0
            function addOrUpdSuccess(result) {
                if (++c < totalLength) return
                console.log(result)
                if (window.localStorage['formTool.noDownload']) 
                    CreateUtils.createModal(`alert`, {body: '匯出成功！'})
            }
            
            function addOrUpdError(result) {
                console.error(result)
            }
        }
        if (window.localStorage['formTool.noDownload'] === undefined) {
            const confirmModal = CreateUtils.createModal(`confirm`, {
                'title':    `詢問`,
                'body':     `是否需要順便下載表單文檔？`,
                'footer':   warningCheckbox.createElemental()[0],
                'callback': function(result) {
                    if (result) {
                        const outputObject = {
                            content: frame,
                            components: factory.registerComponent
                        }
                        SharedUtils.downloadFile(JSON.stringify(outputObject), `${ formData.formName }_${ new Date().format('HHmmsss')}.json`)
                        return true
                    }
                }
            })
            const warningElement = confirmModal.querySelector('#warningCheckbox')
            if (warningElement !== null) warningElement.addEventListener('click', (e) => {
                if (e.target.checked) window.localStorage['formTool.noDownload'] = "on"
            })
        }
    }
}

/**
 * 表單批次匯出
 */
function batchExport() {
    if (onlineMode) {
        SharedUtils.loadingToggle()
        basicParam.getFormVersionAllList(dynamicForm, (result) => {
            SharedUtils.loadingToggle()
            if (result === null || result.formVersion.length === 0) {
                CreateUtils.createModal(`alert`, {body: '目前無任何檔案可以開啟'})
                return
            }
            const dataList      = result.formVersion
            const formBody      = $.extend(true, {}, openFormBody)
            const formDataList  = []
            for (let dataFormObject of dataList) {
                const tableRow = CreateUtils.createBeanElement({'controlType': 'tablerow', 'attribute': [{'class': 'text-center'}]})[0]
                const checkBoxElement = {
                    'input': {
                        'type': 'checkbox',
                        'class': 'form-check-input',
                        'name': 'selectForm'
                    }
                }.createElemental()[0]
                for (let j = 0; j < 4; j++) {
                    let text = ''
                    switch (j) {
                        case 0:
                            text = dataFormObject.formType
                            break
                        case 1:
                            text = dataFormObject.title
                            break
                        case 2:
                            text = dataFormObject.version
                            break
                        case 3:
                            text = ''
                            break
                    }
                    const tableData = CreateUtils.createBeanElement({'controlType': 'tabledata', 'attribute': [{'text': text}]})[0]
                    if (j === 3) tableData.appendChild(checkBoxElement) 
                    tableRow.appendChild(tableData)
                }
                formDataList.push(tableRow)
            }
            const batchExportModal = CreateUtils.createModal(`custom`, {
                'title':    `批次匯出`,
                'body':     formBody,
                'btn': [
                    {
                        'class':        'btn btn-secondary',
                        'data-dismiss': 'modal',
                        'type':  	    'button',
                        'text':         '取消',
                    },
                    {
                        'class': 'btn btn-success',
                        'type':  'button',
                        'text':  '確認匯出'
                    }
                ],
                'callback': batchExportCallBack
            })
            
            const openFormTable     = batchExportModal.querySelector('#openFormTable > tbody')
            const searchFormInput   = batchExportModal.querySelector('#modalSearchForm')
            searchFormInput.addEventListener('blur', searchFormEvent)
            searchFormInput.addEventListener('keyup', keyupSearchEvent)
            formDataList.forEach(tr => {
                const selectFormCheckbox = tr.querySelector('input[type="checkbox"][name="selectForm"]')
                tr.addEventListener('click', (e) => {
                    if (!(e.target.tagName.toLowerCase() === 'input' && e.target.name === 'selectForm')) {
                        if (selectFormCheckbox.checked) selectFormCheckbox.checked = false
                        else selectFormCheckbox.checked = true
                    } 
                    selectLine(e)
                })
                openFormTable.appendChild(tr)

                function selectLine(e) {
                    if (selectFormCheckbox.checked) tr.classList.add('active')
                    else tr.classList.remove('active')
                    
                }
            })

            function batchExportCallBack(index, modalElement) {
                if (index === 1) {
                    SharedUtils.loadingToggle()
                    const activeRows = openFormTable.querySelectorAll('tr.active')
                    let callback1 = 0
                    let callback2 = 0
                    if (activeRows.length > 0) {
                        const versionResult = {}
                        let formFrameList = []
                        const syncParam = {
                            formType: {
                                isLastFormVersion: true,
                                isLastFormFrame: true,
                                syncParam: []
                            },
                            prop: ""
                        }
                        activeRows.forEach(row => {
                            const position = row.parentNode.children.indexOf(row)
                            syncParam.formType.syncParam.push({
                                formType: dataList[position].formType,
                                ts: '1990/01/01 00:00:00'
                            })  
                            dynamicForm.searchParamDF.formType = dataList[position].formType
                            dynamicForm.searchParamDF.versionNo = "1070"
                            basicParam.getDynamicFormTemplateByFormModelVersionNo(dynamicForm, (result) => {
                                const formName = result[0].basicParam.dynamicFormTemplate.formType
                                versionResult[formName] = result[0].basicParam.dynamicFormTemplate
                                if (++callback1 < activeRows.length) return
                                nextStepMethod()
                            }, function(error) {
                                console.error(`chooseThisFormOnlineMode.getCurrDynamicFormTemplateV3() error: ${ error }`)
                                CreateUtils.createModal(`alert`, {body: '查詢【FormVersion】發生錯誤！請查看 F12 Console 紀錄並連繫相關人員。'})
                                SharedUtils.loadingToggle(true)
                            })
                        })
                        
                        // basicParam.getFormVersionListByFormTypeTs(syncParam.formType, 
                        //     (result) => {
                        //         console.log(result)
                        //     }, 
                        //     (error) => {
                        //         console.error(error)
                        //     }
                        // )
                        
                        basicParam.getDynamicFormFrameListByformTypeTs(syncParam.formType, 
                            (result) => {
                                formFrameList = result.data[0].basicParam.formFormFrameList.dynamicFormFrame
                                if (callback2 < 2) nextStepMethod()
                            }, 
                            (error) => {
                                console.error(error)
                            }
                        )

                        function nextStepMethod() {
                            if (++callback2 < 2) return false
                            for (let frameObject of formFrameList) {
                                const formType = frameObject.formType
                                const frameModel = frameObject.frameModel
                                if (!versionResult[formType].formFrame) versionResult[formType].formFrame = {}
                                versionResult[formType].formFrame[frameModel] = frameObject.content
                            }
                            
                            buildExportData(versionResult)
                        }
                    }
                    return false
                }
            }

            /**
             * 查詢開啟舊表清單
             * =
             * @param {*} e 
             */
            function searchFormEvent(e) {
                const value             = e.target.value.toLowerCase()
                const allTableRows      = openFormModal.querySelectorAll('tbody > tr')
                const breakException    = { }
                allTableRows.forEach(tr => {
                    const tableData = tr.childNodes
                    try {
                        tableData.forEach((td, index) => {
                            if (index === 0 || index === 1) {
                                const textValue = td.textContent.toLowerCase()
                                if (textValue.includes(value)) { 
                                    tr.classList.remove('hide')
                                    throw breakException
                                } else tr.classList.add('hide')
                            }
                        })
                    } catch (e) { }
                })
            }

            /**
             * Enter 按鍵監聽
             * =
             * 按 Enter 進入查詢事件
             * @param {*} e 
             */
            function keyupSearchEvent(e) {
                if (e.which === 13) searchFormEvent(e)
            }
        }, 
        (error) => {
            console.error(`getFormVersionAllList error: ${ error }`)
            SharedUtils.loadingToggle()
            CreateUtils.createModal(`alert`, {body: '發生錯誤！請查看 F12 Console 紀錄並連繫相關人員。'})
        })
    } else CreateUtils.createModal(`alert`, {body: '需開啟線上模式才可進行批次匯出。'})
}

function buildExportData(templateStructure) {
    /** 彈出視窗關閉按鈕 */
    const closeButton = document.querySelector('.modal-header button')
    /** 引入工廠 */
    const factory = window.ComponentFactory
    const finalResult = {
        exportType: '1',
        data: []
    }
    for (let formName in templateStructure) {
        factory.clearRegisterComponents()
        const tempArray = []
        const templateItem = templateStructure[formName]
        const formFrame = templateItem.formFrame
        const apiString = templateItem.apiStructure || ''
        const verifyString = templateItem.verification || ''
        const apiStructure = SharedUtils.onionStringDecode(apiString.replace(/&amp;/g, '&').replace(/&quot;/g,'"'))
        const verification = SharedUtils.onionStringDecode(verifyString.replace(/&amp;/g, '&').replace(/&quot;/g,'"'))
        SharedUtils.rebuildComponents(templateItem)
        console.log(templateItem)
        for (let frameModelName in formFrame) {
            const frameString = formFrame[frameModelName]
            const tempContainer = document.createElement('div')
            tempContainer.innerHTML = frameString
            let type = ''
            switch (frameModelName) {
                case 'gFormWebADD':
                    type = 'add'
                    break
                case 'gFormAppADD':
                    type = 'appadd'
                    break
                case 'gFormWebLIST':
                    type = 'list'
                    break
                case 'gFormAppLIST':
                    type = 'applist'
                    break
                case 'gFormWebPRINT':
                    type = 'print_old'
                    break
                case 'gFormWebPRINT2':
                    type = 'print'
                    break
            }
            if (type === '') continue
            const dataContainer = tempContainer.querySelector('div')
            const formData          = dataContainer.dataset
            if (!formData.formName) formData.formName = templateItem.formType
            if (!formData.formTitle) formData.formTitle = templateItem.formName
            if (!formData.formType) formData.formType = type
            if (!formData.formToolVersion) formData.formToolVersion = 0
            const containerObject = tempContainer.convertToJson()
            const temp = new TemplateObject({
                type:           type,
                content:        {
                    toolFrame: containerObject.div.children,
                    formVersion: JSON.stringify(SharedUtils.convertIntoFormVersion({formName: templateItem.formType, formTitle: templateItem.formName})),
                    formFrame: frameString,
                    components: factory.exportComponents(),
                    initFrame: formFrame[`${ frameModelName }_INIT`],
                    apiStructure: apiStructure,
                    verification: verification,
                    isCodeControl: false
                },
                creator:        'TOOL ADMIN',
                create_time:    new Date().getTime(),
                description:    'AUTO CREATED'
            })
            temp.isChanged = 1
            tempArray.push(temp)
        }
        const templateContainer = new TemplateContainer({
            operation:          1,
            hospital_name:      hospitalName,
            hospital_title:     hospitalTitle,
            template_type:      'GForm',
            template_name:      templateItem.formType,
            template_title:     templateItem.formName,
            version:            templateItem.newVersionNo,
            keep_version:       1,
            status:             1
        })
        templateContainer.templates = tempArray
        console.log(templateContainer.templates)
        finalResult.data.push(templateContainer.exportData())
    }
    SharedUtils.downloadFile(JSON.stringify(finalResult, null, 4), `batchExport_${ new Date().format('HHmmsss')}.json`)
    SharedUtils.loadingToggle()
    if (closeButton) closeButton.click()
}

/**
 * 表單元件暫存
 * =
 * @param {Object} formData [Form Object]
 * @returns {Boolean} true
 */
function saveFormBean(formData) {
    /** 引入工廠 */
    const factory   = window.ComponentFactory
    try {
        formData.isBean = 'Y'
        formSaveAndLoad('save', formData, factory.registerComponent)
	} catch (e) {
		console.error(`config didn't setting success... error: ${e}`)
	}
    return true
}

/**
 * 檢查表單是否需要儲存與彈窗提醒
 * @param {Function} type [點選確定後須執行的函數] 
 * @returns {Boolean} result [若有需要儲存為 false]
 */
function checkingSaveForm(type) {
    try {
        let drawPage = document.querySelector('#drawPage')
        if (type.arguments.length > 0) drawPage = type.arguments[0]
        if (drawPage.innerHTML !== '') {
            CreateUtils.createModal(`confirm`, {
                'title':    `提示`,
                'body':     `目前有正在編輯的表單，若確定開新檔案會自動儲存現有表單。`,
                'callback': function(result) {
                    ComponentFactory.clearRegisterComponents()
                    APIModule.clearRegisterComponent()
                    if (result) {
                        let allpass = true
                        saveForm(drawPage)
                        SharedUtils.clearPage(drawPage)
                        setTimeout(() => {
                            type(drawPage)
                        }, 500)
                        return allpass
                    } else {
                        SharedUtils.clearPage(drawPage)
                        setTimeout(() => {
                            type(drawPage)
                        }, 500)
                    }
                }
            })
            return false
        }
    } catch (e) {
        console.error(e)
        console.error(`config didn't setting success...`)
    }
    return true
}

/**
 * 選擇該暫存表單載入
 * @param {String} formName [表單名稱] 
 * @param {String} uuid     [編號]
 * @param {Number} version  [版本號]
 */
async function chooseThisForm(selector, formName, uuid, version) {
    /** 引入工廠 */
    const factory           = window.ComponentFactory
    /** 彈出視窗關閉按鈕 */
    const closeButton       = document.querySelector('.modal-header button')
    /** 取得表單存取內容 */
    const formDescription   = formSaveAndLoad('load', {'formName': formName, 'formType': 'add'})
    /** 表單結構 */
    const formFrame         = SharedUtils.onionStringDecode(formDescription[0])
    /** 元件結構 */
    const beanArray         = SharedUtils.onionStringDecode(formDescription[1])
    try {
        /** 表單注入 */
        const frameArray    = formFrame.createElemental()
        frameArray.forEach(frame => selector.appendChild(frame))
        if (selector.querySelector('.col-4.block-drop-container')) selector.classList.remove('flex-column')
        /** 元件注入 */
        if (Array.isArray(beanArray)) {
            // 舊版
            for (let bean of beanArray) {
                let controlType = bean.controlType
                if (controlType === 'date' || controlType === 'time') controlType = 'datetime'
                if (controlType === 'csCanvas') controlType = 'humanBody'
                if (controlType === 'totalScore') controlType = 'score'
			    if (controlType === 'file') controlType = 'fileUpload'
                /** 製作元件 */
                const component = factory.create(`__${ controlType }`, bean.bean, bean.bean, bean.title)
                for (let dataNode in bean) {
                    if (dataNode === 'abandoned') {
                        if (typeof bean[dataNode] === 'boolean') component.abandoned = bean[dataNode]
                        else component.abandoned = bean[dataNode] === 'true'
                    } else if (dataNode === 'structure') {
                        component.structure = bean[dataNode]
                        component.structureExtraction()
                    } else component.dataset[dataNode] = bean[dataNode]
                }
            }
        } else {
            // 新版
            for (let bean in beanArray) {
                const componentDescription = beanArray[bean]
                factory.assign(componentDescription)
            }
        }
        for (let seq in factory.registerComponent) {
            const component = factory.registerComponent[seq]
            component.structureExtraction()
            if (component.dataset.parent) continue
            component.buildLevelStructure()
            /** 渲染元件 */
            const pageBean = selector.querySelector(`.pFormItem[data-bean="${ component.dataset.name }"], .pFormItemGroup[data-bean="${ component.dataset.name }"]`)
            if (pageBean !== null) pageBean.replaceWith(component.fullComponent)
        }
        listFrame   = undefined
        printFrame  = undefined
    } catch (e) {
        console.log(e)
    }
    if (selector.id === 'queryPage') {
        initDrawPageEvent()
        initButton()
        closeButton.click()
        return
    }
    // 元件結構製作
    beanToListEvent()
    // 畫面事件效果
    initDrawPageEvent(true)
    closeButton.click()
    return false
}

/**
 * 表單載入線上版
 * =
 * @param {Element} selector 
 * @param {String} uuid 
 * @param {String} formName 
 * @returns 
 */
function chooseThisFormOnlineMode(selector, uuid, formName) {
    const closeButton   = document.querySelector('.modal-header button')
    const resultArray   = []
    let callback        = 0
    SharedUtils.loadingToggle()
    dynamicForm.searchParamDF.formType = formName
    dynamicForm.searchParamDF.versionNo = "999998"
    basicParam.getCurrDynamicFormTemplateV3(dynamicForm, successFormat, function(error) {
        console.error(`chooseThisFormOnlineMode.getCurrDynamicFormTemplateV3() error: ${ error }`)
        CreateUtils.createModal(`alert`, {body: '查詢【FormVersion】發生錯誤！請查看 F12 Console 紀錄並連繫相關人員。'})
        SharedUtils.loadingToggle(true)
    })
    if (selector.id === 'queryPage')
        dynamicForm.searchParamDF.frameModel = 'gFormWebLIST'
    else
        dynamicForm.searchParamDF.frameModel = 'gFormWebADD'
    basicParam.getCurrDynamicFormFrameByformTypeFrameModel(dynamicForm, successFormat, function(error) {
        console.error(`chooseThisFormOnlineMode.getCurrDynamicFormFrameByformTypeFrameModel error: ${ error }`)
        if (!$('.mask').hasClass('hide')) {
            CreateUtils.createModal(`alert`, {body: '查詢【FormFrame】發生錯誤！請查看 F12 Console 紀錄並連繫相關人員。'})
        }
        SharedUtils.loadingToggle(true)
    })
    const initDynamic = $.extend(true, {}, dynamicForm)
    if (selector.id === 'queryPage')
        initDynamic.searchParamDF.frameModel = 'gFormWebLIST_INIT'
    else
        initDynamic.searchParamDF.frameModel = 'gFormWebADD_INIT'
    basicParam.getCurrDynamicFormFrameByformTypeFrameModel(initDynamic, (result) => {
        addInit = result.content
        successFormat(addInit)
    }, function(error) {
        console.error(`chooseThisFormOnlineMode.getCurrDynamicFormFrameByformTypeFrameModel error: ${ error }`)
        if (!$('.mask').hasClass('hide')) {
            CreateUtils.createModal(`alert`, {body: '查詢【FromInit】發生錯誤！請查看 F12 Console 紀錄並連繫相關人員。'})
        }
        SharedUtils.loadingToggle(true)
    })

    function successFormat(list) {
        resultArray.push(list)
        if (++callback < 3 || callback > 3) return
        if (resultArray.length === 0) {
            CreateUtils.createModal(`alert`, {body: '當前這張表並無任何版本號'})
            return
        }
        let formVersionObject, formFrameObject, formName, formTitle
        for (let i = 0, len = resultArray.length; i < len; i++) {
            if (resultArray[i] === undefined) continue
            if (resultArray[i].frameModel !== undefined) {
                // frame
                formFrameObject = resultArray[i].content
                formName = resultArray[i].formType
            }
            if (Array.isArray(resultArray[i])) {
                // formVersion
                formVersionObject = resultArray[i][0].basicParam.dynamicFormTemplate
                formTitle = formVersionObject.formName
            }
        }
        
        SharedUtils.setupFromOnlineVersion(selector, formVersionObject, formFrameObject, addInit)
        if (closeButton) closeButton.click()
        SharedUtils.loadingToggle()
        const formData = selector.querySelector('div')
        const version = formData.dataset.formToolVersion
        /** 檢查版號並詢問是否進版 */
        if (selector.id === 'drawPage') {
            const versionModule = new VersionModule({frameElement: selector, initContent: addInit, version: version})
            versionModule.then((bol) => {
                // resolve
                SharedUtils.loadingToggle(true)
            }, (bol) => {
                // reject
                SharedUtils.loadingToggle(true)
            })
        }
    }
    return false
}

/**
 * 顯示 queryList apiStructure
 * ==
 * 解構原有結構並選擇欄位
 * @param {*} apiStructure 
 */
function showQueryList(apiStructure) {
    if (apiStructure) {
        const joinArray     = []
        const structure     = SharedUtils.onionStringDecode(apiStructure)
        const sqlTreeList   = document.querySelector('#sql-tree-list')
        const formTreeList  = document.querySelector('#form-tree-list')
        const stepTwo       = document.querySelector('#step-2')
        for (let node in structure) {
            switch (node) {
                case 'database':
                    for (let databaseObject of structure[node]) {
                        const schema = databaseObject.schema
                        const tables = databaseObject.tables
                        for (let tableObject of tables) {
                            const table         = tableObject.table
                            const join          = tableObject.join
                            const targetSchema  = sqlTreeList.querySelector(`.list-group-item[aria-level="1"][value="${ schema }"]`)
                            if (targetSchema === null) continue
                            const tableContent  = targetSchema.nextElementSibling
                            if (tableContent === null) continue
                            const tableList     = tableContent.querySelector(`.list-group-item[value="${ table }"]`)
                            if (tableList === null) continue
                            if ('createEvent' in document) {
                                var evt = document.createEvent('HTMLEvents')
                                evt.initEvent('contextmenu', false, true)
                                tableList.dispatchEvent(evt)
                            }
                            if (join) joinArray.push(join)
                            qlSQLCondition[table] = {
                                where: tableObject.where,
                                order: tableObject.order
                            }
                        }
                    }
                    break
                case 'form':
                    for (let formObject of structure[node]) {
                        const tables = formObject.tables
                        for (let form of tables) {
                            const table = form.table
                            const join  = form.join
                            const targetSchema  = formTreeList.querySelector(`.list-group-item[aria-level="1"][value="${ table }"]`)
                            if (targetSchema === null) continue
                            if ('createEvent' in document) {
                                var evt = document.createEvent('HTMLEvents')
                                evt.initEvent('contextmenu', false, true)
                                targetSchema.dispatchEvent(evt)
                            }
                            if (join) joinArray.push(join)
                            qlSQLCondition[table] = {
                                where: form.where,
                                order: form.order
                            }
                        }
                    }
                    break
            }
        }
        for (let join of joinArray) {
            for (let joinTableArray of join) {
                const joinTable = joinTableArray.split(',')
                for (let joinString of joinTable) {
                    const joinStringArray = joinString.split('.')
                    const row = stepTwo.querySelector(`.list-group-item[data-node-parent="${ joinStringArray[0] }"][value="${ joinStringArray[1] }"]`)
                    if (row !== null) row.click()
                }
            }
        }
    } else {
        CreateUtils.createModal(`alert`, {body: 'queryList結構錯誤'})
        console.error(`showQueryList() error: ${ error }`)
    }
}

/**
 * 建立 API 模組
 * @param {String} apiStructure 
 * @returns 
 */
function buildAPIModule (apiStructure) {
    /** API清單 */
    const apiList       = document.querySelector('#api-list-list')
    if (!apiStructure) return
    try {
        apiStructure = SharedUtils.onionStringDecode(apiStructure.replace(/&amp;/g, '&').replace(/&quot;/g,'"'))
        if (apiStructure.database) return false
        for (let key in apiStructure) {
            if (apiStructure[key].length > 0) {
                apiStructure[key].forEach(function(item, i){
                    apiStructure[key][i] = JSON.parse(item)
                })
            }
        }
    } catch (e) {
        apiStructure = {}
    }
    apiList.innerHTML = ''
    for (let frameModel in apiStructure) {
        for (let i = 0, len = apiStructure[frameModel].length; i < len; i++) {
            const structure = SharedUtils.onionStringDecode(apiStructure[frameModel][i])
            const component = APIModule.create(structure)
            component.formType = frameModel
            apiList.appendChild(component.container)
        }
    }
    showAPIList()
}

/**
 * 顯示 API 清單
 */
function showAPIList () {
    let frameModel = 'gFormWebADD'
    if (isAddPage()) frameModel = 'gFormWebADD'
    else if (isListPage()) frameModel = 'gFormWebLIST'
    else if (isPrintPage()) frameModel = 'gFormWebPRINT'
    const apiFrameModels = document.querySelectorAll(`.apiFrameModel-${ frameModel }`)
    apiFrameModels.forEach(apiRow => apiRow.classList.remove('hide'))
    initButton()
}

/**
 * 檢查當前目標表單是否與上一版表單相同
 * @param {String} formName [表單名稱]
 * @param {String} formType [表單類型]
 * @param {Object} data     [比較資料]
 * @returns {Boolean} boolean 
 */
// function checkingLastSameForm(formName, formType, data) {
//     let allForm = window.localStorage
//     let regex
//     for (let key in allForm) {
//         regex = new RegExp(/^formTool+/)
//         if (regex.test(key)) {
//             if (key === 'formTool.noDownload') continue
//             let tmpArr = key.split('.')
//             if (tmpArr.length === 2) {
//                 let form = JSON.parse(allForm[key])
//                 for (let i = 0; i < form.length; i++) {
//                     if (form[i].available === 9) continue
//                     if (form[i].formName === formName && form[i].formType === formType) {
//                         let objSession = JSON.parse(window.localStorage[form[i].uuid])
//                         return Object.deepEqual(data, objSession)
//                     }
//                 }
//             }
//         }
//     }
// }

/**
 * 表單存檔與讀取控制規則
 * @param {String} action   [save or load] 
 * @param {Object} formData [Form Object]
 * @param {Object} data     [need to save Data]
 * @param {number} version  [option][load version]
 * @returns 
 */
function formSaveAndLoad(action, formData, data, version) {
    console.log(action, formData, data, version)
    // const sessionName = `formTool.${ formData.formName }`
    // let sessionForm = window.localStorage[`${ sessionName }${ formData.isBean === 'Y' ? '.bean' : '' }`] || ''
    // switch (action) {
    //     case 'save':
    //         let lastVersion = 0
    //         let uuid = SharedUtils._uuid()
    //         if (sessionForm === '') {
    //             sessionForm = formData.isBean === 'Y' ? {} : []
    //         } else {
    //             sessionForm = JSON.parse(sessionForm)
    //         }
    //         if (formData.isBean === 'Y') {
    //             for (let key in sessionForm) {
    //                 sessionForm[key].available = 9
    //                 lastVersion = sessionForm[key].version
    //             }
    //             sessionForm[formData.uuid] = {
    //                 'uuid':         uuid,
    //                 'formName':     formData.formName,
    //                 'formTitle':    formData.formTitle,
    //                 'version':      ++lastVersion,
    //                 'creatTime':    new Date().format('yyyy-MM-dd HH:mm:ss'),
    //                 'creator':      formData.creator,
    //                 'desc':         formData.desc,
    //                 'available':    1,
    //                 'beanAttributeVersion': beanAttributeVersion
    //             }
    //         } else {
    //             for (let i = 0; i < sessionForm.length; i++) {
    //                 if (sessionForm[i].formType === formData.formType) {
    //                     sessionForm[i].available = 9
    //                     lastVersion = sessionForm[i].version
    //                 }
    //             }
    //             sessionForm.push(
    //                 {
    //                     'uuid':         formData.uuid,
    //                     'formName':     formData.formName,
    //                     'formTitle':    formData.formTitle,
    //                     'formType':     formData.formType,
    //                     'version':      ++lastVersion,
    //                     'creatTime':    new Date().format('yyyy-MM-dd HH:mm:ss'),
    //                     'creator':      formData.creator,
    //                     'desc':         formData.desc,
    //                     'available':    1,
    //                     'beanAttributeVersion': beanAttributeVersion

    //                 }
    //             )
    //             uuid = formData.uuid
    //             let frames = data
    //             if (typeof data === 'object') frames = SharedUtils.convertIntoFormFrame(data, formData.formType)
    //             switch(formData.formType) {
    //                 case 'add':
    //                     addFrame = frames
    //                     if (initEditMirror) addInit = initEditMirror.getDoc().getValue()
    //                     break
    //                 case 'list':
    //                     listFrame = frames
    //                     if (initEditMirror) listInit = initEditMirror.getDoc().getValue()
    //                     break
    //                 case 'print':
    //                     printFrame = frames
    //                     if (initEditMirror) printInit = initEditMirror.getDoc().getValue()
    //                     break
    //             }
    //         }
    //         window.localStorage[`formTool.${ formData.formName }${ formData.isBean === 'Y' ? '.bean' : '' }`] = JSON.stringify(sessionForm)
    //         window.localStorage[uuid] = (typeof data === 'string') ? data : JSON.stringify(data)
    //         break
    //     case 'load':
    //         if (sessionForm === '') return false
    //         let sessionBean = window.localStorage[`${ sessionName }.bean`]
    //         try {
    //             sessionForm = JSON.parse(sessionForm)
    //         } catch (e) {}
    //         try {
    //             sessionBean = JSON.parse(sessionBean)
    //         } catch (e) {}
    //         let id, beanId
    //         for (let i = 0; i < sessionForm.length; i++) {
    //             if (version === undefined) {
    //                 if (sessionForm[i].available === 9 || sessionForm[i].formType !== formData.formType) continue
    //                 id = sessionForm[i].uuid
    //                 if (formData.formType === 'add') {
    //                     beanId = sessionBean[id].uuid
    //                 } else { // list print 頁面要回傳自己的 frame 和 add 的 bean
    //                     const lastFormArray = formSaveAndLoad("load", {'formName': formData.formName, 'formType': 'add'})
    //                     return [window.localStorage[id], lastFormArray[1]]
    //                 }
    //             } else {
    //                 if (sessionForm[i].version === version && sessionForm[i].formType === formData.formType) {
    //                     id = sessionForm[i].uuid
    //                     beanId = sessionBean[id].uuid
    //                 }
    //             }
    //         }
    //         if (id === undefined && beanId === undefined) return false
    //         return [window.localStorage[id], window.localStorage[beanId]]
    //     default:
    //         break
    // }
}