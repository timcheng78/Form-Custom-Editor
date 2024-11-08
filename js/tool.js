/**
 * 讀取舊表單
 */
function selectOldForm(selector) {
    // 確認當前是否有檔案存在，若有則進行詢問
    if (!checkingSaveForm(this.selectOldForm)) return
    let drawPage = document.querySelector('#drawPage')
    if (selector !== undefined) drawPage = selector
    const formList = []
    if (!onlineMode) SharedUtils.onlineModeToggle(true)
    SharedUtils.loadingToggle()
    basicParam.getFormVersionAllList(dynamicForm, (result) => {
        SharedUtils.loadingToggle()
        if (result === null || result.formVersion.length === 0) result = {"formVersion": []}
        formVersionList = result.formVersion
        if (formVersionList.length === 0) {
            CreateUtils.createModal(`alert`, {body: '目前無任何檔案可以開啟'})
            return
        }
        const formBody      = $.extend(true, {}, openFormBody)
        const formDataList  = []
        for (let dataFormObject of formVersionList) {
            const tableRow = CreateUtils.createBeanElement({'controlType': 'tablerow', 'attribute': [{'class': 'text-center'}]})[0]
            const button = CreateUtils.createBeanElement({
                'controlType': 'button',
                'attribute':    [
                    {
                        'class':    'btn btn-success',
                        'type':     'button',
                        'text':     '選擇', 
                        'onclick':  `selectedForm(document.getElementById("${ drawPage.id }"), '${ dataFormObject.id }', '${ dataFormObject.formType }'); return false`
                    }
                ]
            })[0]
            for (let j = 0; j < 5; j++) {
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
    }, (error) => {
        SharedUtils.loadingToggle()
        console.error(`getFormVersionAllList error: `, error)
        CreateUtils.createModal(`alert`, {body: '發生錯誤！請查看 F12 Console 紀錄並連繫相關人員。'})
    })
}

function selectedForm(selector, uuid, formName) {
    const closeButton   = document.querySelector('.modal-header button')
    SharedUtils.loadingToggle()
    dynamicForm.searchParamDF.formType = formName
    dynamicForm.searchParamDF.versionNo = "999998"
    basicParam.getCurrDynamicFormTemplateV3(dynamicForm, successCallBack, (error) => {
        console.error(`chooseThisFormOnlineMode.getCurrDynamicFormTemplateV3() error: `, error)
        CreateUtils.createModal(`alert`, {body: '查詢【FormVersion】發生錯誤！請查看 F12 Console 紀錄並連繫相關人員。'})
        SharedUtils.loadingToggle(true)
    })

    dynamicForm.getCustomFormJsp(formName, successCallBack, (error) => {
        console.error(`chooseThisFormOnlineMode.getCustomFormJsp() error: `, error)
        CreateUtils.createModal(`alert`, {body: '查詢【FormFrame】發生錯誤！請查看 F12 Console 紀錄並連繫相關人員。'})
        SharedUtils.loadingToggle(true)
    })

    let callback = 0
    const resultArray = []
    async function successCallBack(result) {
        resultArray.push(result)
        if (++callback < 2) return
        let formVersion, formFrame
        for (let object of resultArray) {
            if (Array.isArray(object)) {
                formVersion = object[0].basicParam.dynamicFormTemplate
            } else formFrame = object.printForm
        }
        /** 引入工廠 */
		const factory 			= window.ComponentFactory
        SharedUtils.loadingToggle()
        for (let beanName in formVersion.hashItems) {
            const dynamicItem = formVersion.hashItems[beanName]
            let controlType = dynamicItem.controlType
            if (controlType === 'date' || controlType === 'time') controlType = 'datetime'
            else if (controlType === 'csCanvas') controlType = 'humanBody'
			else if (controlType === 'totalScore') controlType = 'score'
			else if (controlType === 'file') controlType = 'fileUpload'
            /** 製作元件 */
            const component = factory.create(`__${ controlType }`, beanName, beanName, dynamicItem.title, dynamicItem.children, dynamicItem.children)
			component.convertDynamicFormItemToComponent(dynamicItem)
            component.modifyAttribute()
        }
        for (let seq in factory.registerComponent) {
            const component = factory.registerComponent[seq]
            if (component.dataset.parent) continue
            component.buildLevelStructure()
        }
        // const htmlJsp = await SharedUtils.asyncGetFile('./testjsp.html')
        selector.appendChild(jspConvertHtml(formFrame))
        /** 取得表單存放資料區 */
		const formDataContainer = selector.querySelector('div')
		/** 表單資料 */
        const formData          = formDataContainer.dataset
		/** 表單名稱賦值 */
        formData.formName       = formVersion.formType
		/** 表單標題賦值 */
        formData.formTitle      = formVersion.formName
		/** 表單類型賦值 */
        formData.formType       = 'print'
        beanToListEvent()
        // 畫面事件效果
        initDrawPageEvent(true)
        if (closeButton) closeButton.click()
    }
}

/**
 * 轉換jsp相關需移除字串
 * @param {String} jspString 
 */
function jspConvertHtml(jspString) {
    /** 引入工廠 */
    const factory 			= window.ComponentFactory
    const pageResultDOM = document.createElement('div')
    const resultGroupDOM = document.createElement('div')
    pageResultDOM.classList.add('pageResult')
    resultGroupDOM.classList.add('resultGroup')
    resultGroupDOM.innerHTML = jspString
    pageResultDOM.appendChild(resultGroupDOM)
    let titleNameDOM
    const noPrintDOM = pageResultDOM.querySelectorAll('.Noprint')
    const formDOM    = pageResultDOM.querySelectorAll('form')
    const tableDOM   = pageResultDOM.querySelectorAll('table.etable')
    const titleDOM   = pageResultDOM.querySelectorAll('tr[align="center"] > td > h3')
    const subTitDOM  = pageResultDOM.querySelector('td[align="left"] > h4')
    const cOutDOM    = pageResultDOM.querySelector('.c-out')
    const fmtDOM     = pageResultDOM.querySelector('tr[align="right"] > td > .fmt-format-date')
    const fmtsDOM    = pageResultDOM.querySelectorAll('.fmt-format-date')
    const beansDOM   = pageResultDOM.querySelectorAll('.pFormItem')
    const tdsDOM     = pageResultDOM.querySelectorAll('td')
    const thsDOM     = pageResultDOM.querySelectorAll('th')
    const labelDOM   = pageResultDOM.querySelectorAll('label')
    const contentDOM = pageResultDOM.querySelector('#content')
    noPrintDOM.forEach(element => element.remove())
    formDOM.forEach(form => {
        if (form.style.display === 'none') form.remove()
    })
    thsDOM.forEach(th => {
        const td = document.createElement('td')
        td.classList.add('nurstr1')
        td.innerHTML = th.innerHTML
        td.rowSpan = th.rowSpan
        td.colSpan = th.colSpan
        td.dataset.role = "drag-drop-container"
        if (td.children.length === 0 && td.textContent.length > 0) {
            const label = document.createElement('label')
            label.classList.add('canEditDiv', 'h6')
            label.draggable = true
            label.textContent = td.textContent
            td.replaceChildren(label)
        }
        th.parentNode.prepend(td)
        th.remove()
        if (td.colSpan > 1) {
            for (let i = 0, len = td.colSpan - 1; i < len; ++i) {
                const tempTableData = document.createElement('td')
                tempTableData.classList.add('hide')
                tempTableData.dataset.role = "drag-drop-container"
                tempTableData.innerHTML = '&nbsp;'
                td.after(tempTableData)
            }
        }
        if (td.rowSpan > 1) {
            const tdIndex = td.parentNode.children.indexOf(td)
            const tableRow = td.parentNode
            const trIndex = tableRow.parentNode.children.indexOf(tableRow)
            for (let i = trIndex + 1, len = trIndex + td.rowSpan; i < len; ++i) {
                const tr = tableRow.parentNode.children[i]
                const tempTableData = document.createElement('td')
                tempTableData.classList.add('hide')
                tempTableData.dataset.role = "drag-drop-container"
                tempTableData.innerHTML = '&nbsp;'
                tr.children[tdIndex > 0 ? tdIndex - 1 : tdIndex].after(tempTableData)
            }
        }
    })
    tdsDOM.forEach(td => {
        td.dataset.role = "drag-drop-container"
        if (td.colSpan > 1) {
            for (let i = 0, len = td.colSpan - 1; i < len; ++i) {
                const tempTableData = document.createElement('td')
                tempTableData.classList.add('hide')
                tempTableData.dataset.role = "drag-drop-container"
                tempTableData.innerHTML = '&nbsp;'
                td.after(tempTableData)
            }
        }
    })
    labelDOM.forEach(label => {
        label.classList.add('canEditDiv', 'h6', 'label-title')
        label.draggable = true
    })
    beansDOM.forEach(bean => {
        let beanName
        const pageString = bean.getAttribute('page')
        const urlPathArray = pageString.split('?')
        const paramArray = urlPathArray[1].split('&')
        for (let param of paramArray) {
            const attributeArray = param.split('=')
            if (attributeArray[0] === 'tag') {
                beanName = attributeArray[1]
                break
            }
        }
        const component = factory.getRegisterComponentByName(beanName)
        if (!component) {
            const labelElement = {
                'label': {
                    'class': 'h6',
                    'text': `${ beanName }`
                }
            }.createElemental()[0]
            bean.draggable = true
            bean.appendChild(labelElement)
            return
        }
        component.attribute.page = pageString
        component.attribute.class += ' jsp-include'
        component.modifyAttribute()
        bean.replaceWith(component.printComponent)
    })
    fmtsDOM.forEach(fmt => {
        fmt.classList.add('canEditDiv')
        fmt.draggable = true
    })
    for (let i = 0, len = titleDOM.length; i < len; ++i) {
        const title = titleDOM[i]
        if (title.children.length === 0) {
            titleNameDOM = title
            break
        }
    }
    const pageHeader = {
        "div": {
            "class": "pageHeader model",
            "style": "height: auto",
            "children": [
                {
                    "div": {
                        "class": "left print-container",
                        "data-role": "drag-drop-container"
                    }
                },
                {
                    "div": {
                        "class": "middle print-container",
                        "data-role": "drag-drop-container",
                        "children": [
                            {
                                "h2": {
                                    "children": cOutDOM ? [cOutDOM.convertToJson()] : []
                                }
                            },
                            titleNameDOM.convertToJson()
                        ]
                    }
                },
                {
                    "div": {
                        "class": "right print-container",
                        "data-role": "drag-drop-container"
                    }
                }
            ]
        }
    }.createElemental()[0]
    const pageTitle = {
        "div": {
            "class": "pageTitle model",
            "children": [
                subTitDOM.convertToJson(),
                {
                    "div": {
                        "style": "width: 100%",
                        "children": fmtDOM ? fmtDOM.parentNode.convertToJson().td.children : []
                    }
                }
            ]
        }
    }.createElemental()[0]
    const pageFooter = {
        "div": {
            "class": "pageFooter model",
            "children": [
                {
                    "div": {
                        "class": "left print-container",
                        "data-role": "drag-drop-container"
                    }
                },
                {
                    "div": {
                        "class": "middle print-container",
                        "data-role": "drag-drop-container",
                        "children": []
                    }
                },
                {
                    "div": {
                        "class": "right print-container",
                        "data-role": "drag-drop-container"
                    }
                }
            ]
        }
    }.createElemental()[0]
    console.log(fmtDOM)
    tableDOM.forEach(table => {
        table.classList.add('table-bordered', 'resultTable')
        const thead = table.querySelector('thead')
        thead.remove()
    })
    if (contentDOM) {
        tableDOM.forEach(table => contentDOM.before(table))
        const forEachDOM = contentDOM.querySelector('.c-for-each')
        const tbodyDOM = tableDOM[0].querySelector('tbody')
        tbodyDOM.classList.value = forEachDOM.classList.value
        tbodyDOM.setAttribute('var', forEachDOM.getAttribute('var'))
        tbodyDOM.setAttribute('items', forEachDOM.getAttribute('items'))
        tbodyDOM.setAttribute('varstatus', forEachDOM.getAttribute('varstatus'))
        contentDOM.remove()
    }
    resultGroupDOM.prepend(pageHeader, pageTitle, pageFooter)
    console.log(pageResultDOM)
    return pageResultDOM
}

/**
 * 匯出舊表
 * 匯出成Jsp
 */
function exportOldForm() {
    const drawPage = document.querySelector('#drawPage').cloneNode('true')
    const cOutDOM = drawPage.querySelectorAll('.c-out')
    const labelDOM = drawPage.querySelectorAll('.label-title')
    const fmtFormatDOM = drawPage.querySelectorAll('.fmt-format-date')
    const jspIncludeDOM = drawPage.querySelectorAll('.jsp-include.pFormItem')
    const tableTitle = drawPage.querySelectorAll('td.nurstr1 > label.h6, td.table-data-title > label.h6')

    cOutDOM.forEach(cOut => cOut.replaceWith(gettingJspString(cOut, 'c-out')))
    labelDOM.forEach(label => label.replaceWith(gettingJspString(label, 'label-title')))
    fmtFormatDOM.forEach(fmt => fmt.replaceWith(gettingJspString(fmt, 'fmt-format-date')))
    jspIncludeDOM.forEach(bean => bean.replaceWith(gettingJspString(bean, 'jsp-include')))
    tableTitle.forEach(label => label.replaceWith(gettingJspString(label, 'table-title')))

    const jspString   = drawPage.innerHTML.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\t|\n/g, '')
    const dataset     = drawPage.querySelector('div').dataset
    const formData    = {
        'uuid':         SharedUtils._uuid(),
        'formName':     dataset.formName,
        'formTitle':    dataset.formTitle,
        'formType':     dataset.formType,
        'creator':      'AUTO CREATED',
        'desc':         'SAVE FORM ACTION',
        'isBean':       'N'
    }
    formSaveAndLoad('save', formData, jspString)
    
    const beforeProcessModal = CreateUtils.createModal(`custom`, {
        'title':    `調整匯出格式`,
        'body':     {
            "form": {
                "onsubmit": "return false",
                "style": "height: 700px",
                "children": [
                    {
                        "textarea": {}
                    }
                ]
            }
        },
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
                'text':  '確定匯出'
            }
        ],
        'callback': beforeProcessCallBack
    })

    const editMirror = CodeMirror.fromTextArea(beforeProcessModal.querySelector('textarea'), {
		mode: 'javascript',
        autoRefresh: true,
		lineNumbers: true,
		theme: 'abcdef'
	})
    
    editMirror.getDoc().setValue(SharedUtils.style_html(jspString))
    setTimeout(() => editMirror.refresh(), 1)

    function beforeProcessCallBack(index, modalElement) {
        if (index === 1) {
            const editData = editMirror.getDoc().getValue()
            const sendParam = {
                formType: dataset.formName,
                printForm: editData
            }
            dynamicForm.updateCustomFormJsp(sendParam, (result) => console.log(result), (error) => console.log(error))
            SharedUtils.downloadFile(editData, `test_1.jsp`)
            return true
        }
    }


    // SharedUtils.downloadFile(SharedUtils.style_html(jspString), `test_1.jsp`)

    function gettingJspString(selectorDOM, tagName) {
        switch (tagName) {
            case 'c-out':
                return `<c:out value="${ selectorDOM.getAttribute('value') }"></c:out>`
            case 'label-title':
                return selectorDOM.textContent
            case 'fmt-format-date':
                return `<fmt:formatDate pattern="${ selectorDOM.textContent }" value="${ selectorDOM.getAttribute('value') }"></fmt:formatDate>`
            case 'jsp-include':
                return `<jsp:include page="${ selectorDOM.getAttribute('page') }"></jsp:include>`
            case 'table-title':
                return selectorDOM.textContent
        }
    }
}