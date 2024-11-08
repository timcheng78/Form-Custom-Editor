/** 全域函數 */
class GlobalFunctions {
    /**
     * 複製事件
     * @param {Event} e 
     */
    static globalCopy (e) {
        if (SharedUtils.isEditing()) return
        DrawPageFunctions.copy()
    }

    /**
     * 貼上事件
     * @param {Event} e 
     */
    static globalPaste (e) {
        if (SharedUtils.isEditing()) return
        DrawPageFunctions.paste()
    }

    /**
     * 按鍵按下事件
     * @param {Event} e 
     */
    static globalKeydown (e) {
	    if (SharedUtils.isEditing()) return
        switch (e.keyCode) {
            case 46:
                DrawPageFunctions.delete()
                break
            default: 
                return
        }
    }

    /** 滑鼠進入事件 */
    static mouseEnter (e) {
        if (e.target.classList.contains('left-block')) e.target.classList.add('hover')
        else leftMenu.classList.remove('hover')
    }

    /** 滑鼠移動事件 */
    static mouseMove (e) {
        if (e.target.classList.contains('left-block')) e.target.classList.add('hover')
        else leftMenu.classList.remove('hover')
    }

    /** 滑鼠離開事件 */
    static mouseLeave (e) {
        leftMenu.classList.remove('hover')
    }

    /** 點擊事件 */
    static click (e) {
        if (e.target !== leftMenu) return
        if (e.target.classList.contains('active')) e.target.classList.remove('active')
        else e.target.classList.add('active')
    }

    /** 初始化變數(模組、文件類) */
    static initVariable () {
        window.template = new TemplateModule()
        /** 新增/更新頁初始化頁面 */
		const addPromise = SharedUtils.asyncGetFile('./template/addINIT.html')
		/** 清單頁初始化頁面 */
		const listPromise = SharedUtils.asyncGetFile('./template/listINIT.html')
		/** 列印頁初始化頁面 */
		const printPromise = SharedUtils.asyncGetFile('./template/printINIT.html')
		addPromise.then((resultMsg) => addInit = resultMsg)
		listPromise.then((resultMsg) => listInit = resultMsg)
		printPromise.then((resultMsg) => printInit = resultMsg)
    }

    /** 初始化右鍵菜單 */
    static initContextMenu () {
        /** 綁定列印頁表頭右鍵功能 */
        $.contextMenu({
            selector: '.output-table', 
            callback: function(key, options) {
                /** 選擇區域 */
                const targetSite 	= options.$trigger[0]
                switch (key) {
                    case 'editTable':
                        CreateUtils.addPrintTitle({target: targetSite})
                        break
                }
            },
            items: {
                "editTable": {name: "編輯表頭", icon: "bi bi-pencil"},
            }
        });
    }

    /** 初始化元件區塊 */
    static initBasicBeanBlock () {
        /** 基礎元件區塊 */
		const baseBeanContent = document.querySelector('#base-bean-content')
		/** 清單元件區塊 */
		const listBeanContent = document.querySelector('#list-bean-content')
		/** 列印元件區塊 */
		const printBeanContent = document.querySelector('#print-bean-content')
        /** 基礎元件清單 */
		const baseComponents = ComponentFactory.baseComponent
		/** 清單元件清單 */
		const listComponents = ComponentFactory.listComponent
		/** 列印元件清單 */
		const printComponents = ComponentFactory.printComponent
		// 基礎元件
		for(let components in baseComponents) {
			baseBeanContent.append(CreateUtils.createBeanElement({
				'controlType': 	'button',
				'attribute': 	[
					{
						'draggable': 	'true',
						'type':  		'button',
						'class': 		'btn btn-outline-info',
						'value': 		baseComponents[components].dragName,
						'text': 		`${ baseComponents[components].dragDescription }(${ baseComponents[components].dragName })`,
                        'data-title':   baseComponents[components].dragDescription,
                        'data-type':    'add',
                        'data-basic':   'true'
					}
				]
			})[0], '\n')
		}
        // 清單元件
		for(let components in listComponents) {
			listBeanContent.append(CreateUtils.createBeanElement({
				'controlType': 	'button',
				'attribute': 	[
					{
						'draggable': 		'true',
						'type':  			'button',
						'class': 			'btn btn-outline-info',
						'value': 			listComponents[components].dragName,
						'text': 			listComponents[components].dragDescription,
                        'data-title':       listComponents[components].dragDescription,
                        'data-type':        'list',
                        'data-basic':       'true'
					}
				]
			})[0], '\n')
		}
        // 列印元件
		for (let components in printComponents) {
			printBeanContent.append(CreateUtils.createBeanElement({
				'controlType': 	'button',
				'attribute': 	[
					{
						'draggable': 		'true',
						'type':  			'button',
						'class': 			'btn btn-outline-info',
						'value': 			printComponents[components].dragName,
						'text': 			printComponents[components].dragDescription,
                        'data-title':       printComponents[components].dragDescription,
                        'data-type':        'print',
                        'data-basic':       'true'
					}
				]
			})[0], '\n')
		}
    }

    /** 初始化固定事件 (非重複使用) */
    static initFixedEvent () {
        /** Api 清單查詢按鈕 */
	    const searchApiButton 	= document.querySelector('#api-list-search-btn')
        /** Api 新增按鈕 */
	    const apiAddButton 		= document.querySelector('#api-list-add-btn')
        /** init 編輯框按鈕 */
	    const initButton 		= document.querySelector('#initBtn')
        /** 表頭開關 */
        const headSwitch 		= document.querySelector('#headSwitch')
        /** 程式碼切換 */
        const codeSwitch 		= document.querySelector('#codeSwitch')
        /**　菜單底下可拖曳元件 */
        const basicDragObjects  = document.querySelectorAll('#leftMenu [draggable="true"]')
        searchApiButton.addEventListener('click', APIModule.apiSearchEvent)
        apiAddButton.addEventListener('click', APIModule.addAPI)
        initButton.addEventListener('click', (e) => {
            const listBlock = e.target.closest('.list-block')
            listBlock.classList.toggle('active')
        })
        document.body.addEventListener('dragover', (e) => e.preventDefault())
		document.body.addEventListener('drop', (e) => {
            /** 座標(x,y) */
            let offset                              = e.dataTransfer.getData("text/plain").split(',')
            let barRight                            = window.innerWidth - (e.clientX + parseInt(offset[0], 10) + ToolPack.toolPackButton.offsetWidth) + 120
            ToolPack.toolPackButton.style.left      = (e.clientX + parseInt(offset[0], 10)) + 'px'
            ToolPack.toolPackButton.style.top       = (e.clientY + parseInt(offset[1], 10)) + 'px'
            ToolPack.toolPackBar.style.right        = barRight + 'px'
            ToolPack.toolPackBar.style.top          = (e.clientY + parseInt(offset[1], 10)) + 'px'
            e.preventDefault()
            return false
        })
        headSwitch.addEventListener('click', (e) => {
            /** 標題列 */
            const formTitle = DrawPageFunctions.drawPage.querySelector('.form-title-div')
            if (formTitle !== null && e.target.checked) formTitle.classList.remove('closed')
            else if (formTitle !== null && !e.target.checked) formTitle.classList.add('closed')
        })
        /** 需要調整 0201 */
        codeSwitch.addEventListener('click', (e) => {
            const codeBlock = document.querySelector('#codeBlock')
            if (!e.target.checked) {
                // 關閉程式碼切換
                codeBlock.classList.add('hide')
		        DrawPageFunctions.drawPage.classList.remove('hide')
            } else {
                // 開啟程式碼切換
                if (isCodeControl) {
                    // 判斷是否已經開啟過
                    DrawPageFunctions.drawPage.classList.add('hide')
			        codeBlock.classList.remove('hide')
                } else {
                    CreateUtils.createModal(`confirm`, {
                        'title':    `警告`,
                        'body':     `切換後將會以程式碼內容為主，無法切換回去，請確認後再點選確定。`,
                        'callback': function(result) {
                            if (result) {
                                isCodeControl = true
                                if (!frameEditMirror) {
                                    frameEditMirror = CodeMirror.fromTextArea(document.querySelector('#codeArea'), {
                                        mode: 'htmlmixed',
                                        lineNumbers: true,
                                        theme: 'abcdef'
                                    })
                                }
                                setTimeout(() => {
                                    if (frameEditMirror.getDoc().getValue() === '') {
                                        const frame   = DrawPageFunctions.drawPage.convertToJson().div.children
                                        let formFrame = SharedUtils.convertIntoFormFrame(frame, DrawPageFunctions.formData)
                                        DrawPageFunctions.drawPage.classList.add('hide')
                                        codeBlock.classList.remove('hide')
                                        frameEditMirror.getDoc().setValue(SharedUtils.style_html(formFrame))
                                    } else {
                                        DrawPageFunctions.drawPage.classList.add('hide')
                                        codeBlock.classList.remove('hide')
                                    }
                                }, 500)
                                return true
                            } else e.target.checked = false
                        }
                    })
                }
            }
        })
        basicDragObjects.forEach(dragObject => {
            dragObject.addEventListener('dragstart', DragNDrop.basicDragStart.bind(DragNDrop))
        })
    }

    /** 處理網址列參數 */
    static handleUrlParam () {
        /** 當前網址列 */
		const urlString = window.location.href
        /** 網址 */
		const url = new URL(urlString)
        /** 模板編號 */
		const templateId = url.searchParams.get("templateId")
		/** 表單名稱 */
		const formType = url.searchParams.get("formType")
		/** 表單標題 */
		const formTitle = url.searchParams.get("formTitle")
		/** 登入者Id */
		dirUserId = url.searchParams.get("userId")
		/** 操作模式 */
		operation = url.searchParams.get("operation")
		/** 醫院名稱 */
		hospitalName = url.searchParams.get("hospitalName")
		/** 醫院標題 */
		hospitalTitle = url.searchParams.get("hospitalTitle")
		/** token */
		token = url.searchParams.get("authorization")
        // 依據模板編號判斷為雲模式進行
        if (!templateId) return
        fileModeTest = true
        const promise = TemplateModule.getSingleTemplate(templateId)
        promise.then(result => {
            /** 模板初始化 */
            template = new TemplateModule()
            template.container = new TemplateContainer({
                operation:          operation,
                version: 			0,
                hospital_name:      hospitalName,
                hospital_title:     hospitalTitle,
                template_type:      'GForm',
                template_name:      formType,
                template_title:     formTitle
            })
            const pageContainer = CreateUtils.createPage('add', formType, formTitle)
            pageContainer.forEach(page => DrawPageFunctions.drawPage.appendChild(page))
            if (initEditMirror) initEditMirror.getDoc().setValue(addInit)
            
            if (!result.data) return 
            /** 若有取得版本模板則覆蓋先前初始化內容 */
            template = new TemplateModule(result.data)
            template.container.operation = operation
            template.container.templates = result.data.templates
            const templateObject = template.container.getTemplateByType('add')
            if (!templateObject) return 
            /** 取得模板內容 */
            const content = templateObject.content
            /** 模板頁面 */
            const toolFrame = content.toolFrame.createElemental()
            /** 代碼頁面 */
            const formFrame = content.formFrame
            /** 代碼控制 */
            // isCodeControl = content.isCodeControl === 'true' || content.isCodeControl === true ? true : false
            addInit = content.initFrame
            if (initEditMirror) initEditMirror.getDoc().setValue(addInit)
            const components = content.components
            SharedUtils.clearPage(DrawPageFunctions.drawPage)
            toolFrame.forEach(frame => DrawPageFunctions.drawPage.appendChild(frame))
            components.forEach(component => {
                component.seq = component.dataset.seq
                ComponentFactory.assign(component)
            })
            for (let seq in ComponentFactory.registerComponent) {
                const component = ComponentFactory.registerComponent[seq]
                component.structureExtraction()
                if (component.dataset.parent) continue
                component.buildLevelStructure()
                /** 渲染元件 */
                const pageBean = DrawPageFunctions.drawPage.querySelector(`.pFormItem[data-bean="${ component.dataset.name }"], .pFormItemGroup[data-bean="${ component.dataset.name }"]`)
                if (pageBean !== null) pageBean.replaceWith(component.fullComponent)
            }
			const versionModule = new VersionModule({frameElement: DrawPageFunctions.drawPage, initContent: addInit, version: DrawPageFunctions.formData.formToolVersion})
			versionModule.then((bol) => {
				// resolve
				SharedUtils.loadingToggle(true)
			}, (bol) => {
				// reject
				SharedUtils.loadingToggle(true)
			})
            if (!isCodeControl) return
            const codeSwitch = document.querySelector('#codeSwitch')
            if (!frameEditMirror) {
                frameEditMirror = CodeMirror.fromTextArea(document.querySelector('#codeArea'), {
                    mode: 'htmlmixed',
                    lineNumbers: true,
                    theme: 'abcdef'
                })
            }
            setTimeout(() => {
                codeSwitch.checked = true
                DrawPageFunctions.drawPage.classList.add('hide')
                codeBlock.classList.remove('hide')
                frameEditMirror.getDoc().setValue(formFrame)
            }, 500)
		})
		.catch(error => {
			console.log(error)
		})
    }
}

/** 畫布函數 */
class DrawPageFunctions {

    /** 取得畫布 */
    static get drawPage () {
        return document.querySelector('#drawPage')
    }

    /** 取得資訊存放區 */
    static get formData () {
        return this.drawPage.querySelector('div').dataset
    }

    /** 判斷新增頁 */
    static isAddPage () {
        return this.formData.formType === 'add' ? true : false
    }

    /** 判斷清單頁 */
    static isListPage () {
        return this.formData.formType === 'list' ? true : false
    }

    /** 判斷列印頁 */
    static isPrintPage () {
        return this.formData.formType === 'print' ? true : false
    }

    /** 複製事件 */
    static copy () {
        /** 所有被選取元件/元素 */
        const selectedElement   = this.drawPage.querySelectorAll('.selected')
        const selectedArr       = []
        try {
            selectedElement.forEach(element => {
                selectedArr.push(element.convertToJson())
            })
            navigator.clipboard.writeText(JSON.stringify(selectedArr))
                .then(
                    () => console.log('copy success'),
                    () => console.error('copy error')
                )
        } catch (e) {
            CreateUtils.createModal(`alert`, {body: errorCodeDescription.ED0006})
            console.error(`error: ${ e }`)
        }
    }

    /** 貼上事件 */
    static async paste () {
        const clipText = await navigator.clipboard.readText()
        try {
            /** 剪貼簿資料 */
            const clipObject        = SharedUtils.onionStringDecode(clipText)
            if (!clipObject || clipObject.length === 0) throw 'clipboard no data'
            /** 所有被選取元件/元素 */
            const selectedElement 	= document.querySelectorAll('.selected')
            /** 已選取欄位 */
            const activeTableData 	= document.querySelectorAll('.tab-pane.show.active td.active')
            /** 剪貼簿資料轉換為元素 */
            const elementList = clipObject.createElemental()
            selectedElement.forEach(sElement => {
                switch(sElement.tagName.toLowerCase()) {
                    case 'div':
                        elementList.forEach(element => {
                            if (element.dataset.isBean === 'Y') cloneAndAppendBean(element, sElement, 'after')
                            else sElement.after(element)
                        })
                        break
                }
            })
            if (selectedElement.length > 0) return 
            if (activeTableData.length === 0) return
            if (elementList.length === activeTableData.length) {
                // 選取數量與欄位數量相同，依序補入對應欄位
                activeTableData.forEach((td, index) => {
                    /** 移除空格 */
                    if (td.innerHTML.trim().indexOf('&nbsp;') === 0) td.innerHTML = td.innerHTML.substring(6)
                    const element = elementList[index]
                    if (element.dataset.isBean === 'Y') cloneAndAppendBean(element, td)
                    else {
                        const insideComponent = td.querySelector('[data-is-bean="Y"]')
                        // 若單一標題則加入標題標籤
                        if (element.classList.contains('h6') && !insideComponent) td.classList.add('table-data-title')
                        td.appendChild(element)
                    }
                })
            } else {
                // 選取數量不一樣則全部欄位都放入資料
                activeTableData.forEach(td => {
                    /** 移除空格 */
                    if (td.innerHTML.trim().indexOf('&nbsp;') === 0) td.innerHTML = td.innerHTML.substring(6)
                    const insideComponent = td.querySelector('[data-is-bean="Y"]')
                    // 若單一標題則加入標題標籤
                    if (elementList.length === 1 && elementList[0].classList.contains('h6') && !insideComponent) td.classList.add('table-data-title')
                    bean.forEach(element => {
                        if (element.dataset.isBean === 'Y') cloneAndAppendBean(element, td)
                        else td.appendChild(element)
                    })
                })
            }
            SharedUtils.clearTableActiveData()
        } catch (error) {
            console.error(error)
        }

        /**
         * 元件處理方式
         * @param {Element} element 元件
         * @param {Element} parent 操作位置
         * @param {string} action 動作
         */
        function cloneAndAppendBean (element, parent, action) {
            /** 取得原元件 */
            const component 	= ComponentFactory.getRegisterComponentBySeq(element.dataset.seq)
            /** 製作新元件克隆 */
            const newComponent 	= component.cloneComponent()
            switch (action) {
                case 'after':
                    parent.after(newComponent.fullComponent)
                    break
                case 'before':
                    parent.before(newComponent.fullComponent)
                    break
                default:
                    parent.appendChild(newComponent.fullComponent)
                    break
            }
        }
    }

    /** 刪除事件 */
    static delete () {
        /** 所有選取的元素 */
        const selectedElements 	= this.drawPage.querySelectorAll('.selected')
        /** 所有選取的表格 */
        const activeTableHead 	= this.drawPage.querySelectorAll('th.active')
        const activeTableData 	= this.drawPage.querySelectorAll('td.active')
        /** 當前顯示頁籤 */
        const activeTable 	    = this.drawPage.querySelector('div.tab-pane.active > table')
        selectedElements.forEach(element => {
            /** 取得選取元件 */
            const component     = ComponentFactory.getRegisterComponentBySeq(element.dataset.seq)
            // 若元件類型為 csCanvas
            if (component.dataset.controlType === 'csCanvas') { 
                const canvasProp = this.drawPage.querySelector(`#${ component.dataset.bean }_selectCsCanvasProp`)
                if (canvasProp) canvasProp.remove()
            }
            removeParameterBean(component)
        })
        activeTableHead.forEach(th => {
            if (th.classList.contains('button-block')) return
            /** x 軸 */
            const position 	= th.parentNode.children.indexOf(th)
            /** 同樣 x 軸的表頭也一併移除 */
            const thead 	= this.drawPage.querySelectorAll('thead tr th')
            removeParameterBean([th, thead[position]])
        })
        if (!activeTable) return
        const allTableData 	= activeTable.querySelectorAll('td')
        /** 表格必須整排選取或整列選取才可刪除 (防止表格跑版) */
        if (activeTableData.length > 1 && (allTableData.length !== activeTableData.length)) {
            removeParameterBean(activeTableData)
            const tableRows = this.drawPage.querySelectorAll('tbody tr')
            tableRows.forEach(tr => {
                if (tr.children.length === 0) removeParameterBean(tr)
            })
        }
    }

    /**
     * 移除傳入元素
     * @param {Element[]|Element} elements 
     */
    static deleteElement (elements) {
        if (!elements) return
        if (Array.isArray(elements)) elements.forEach(element => this.deleteElement(element))
        if (elements instanceof Element) {
            // 元素
            const tagName = elements.tagName.toLowerCase()
            switch (tagName) {
                case 'table':
                    CreateUtils.createModal(`alert`, {body: errorCodeDescription.ED0022})
                    return
                case 'li':
                    // 頁籤移除 連同頁籤底下區塊也一併移除
                    if (!elements.classList.contains('nav-item')) return
                    for (let childElement of elements.children) {
                        if (childElement.tagName.toLowerCase() === 'a') {
                            const targetTabPane = this.drawPage.querySelector(a.getAttribute('href'))
                            if (targetTabPane) this.deleteElement(targetTabPane)
                        }
                    }
                    break
                case 'td':
                    const insideBeans = elements.querySelectorAll('.pFormItem[data-name], .pFormItemGroup[data-name]')
                    insideBeans.forEach(bean => {
                        /** 取得選取元件 */
                        const component = ComponentFactory.getRegisterComponentBySeq(bean.dataset.seq)
                        this.deleteElement(component)
                    })
                    break
                case 'th':
                    const insideListBeans = elements.querySelectorAll('.web-component')
                    insideListBeans.forEach(bean => {
                        ComponentFactory.deleteListComponent(bean.dataset.type)
                    })
                    break
                case 'tr':
                    if (elements.children.length > 0) return
                    break
                case 'div':
                    if (this.isAddPage()) {
                        const pageInsideBeans = elements.querySelectorAll('.pFormItem[data-name], .pFormItemGroup[data-name]')
                        pageInsideBeans.forEach(bean => {
                            const component = ComponentFactory.getRegisterComponentBySeq(bean.dataset.seq)
                            this.deleteElement(component)
                        })
                    }
                    if (this.isListPage() && elements.dataset.listEle === 'Y') {
                        const type = elements.dataset.type
                        ComponentFactory.deleteListComponent(type)
                    }
                    break
                case 'label':
                    if (!elements.classList.contains('h6')) break
                    const isTitle = elements.closest('.table-data-title')
                    if (!isTitle) break
                    const titleNodes = isTitle.querySelectorAll('label.h6')
                    if (titleNodes.length === 1) isTitle.classList.remove('table-data-title')
                    break
            }
        } else {
            // 元件
            elements.abandoned = true
            if (elements.treeChildren) {
                elements.treeChildren.forEach(childName => {
                    const childComponent = factory.getRegisterComponentByName(childName)
                    childComponent.abandoned = true
                })
            }
            if (elements.horizontalFormItem) {
                for (let option of elements.horizontalFormItem) {
                    if (option === '') continue
                    const childOptions = option.split(',')
                    childOptions.forEach(childName => {
                        const childComponent = factory.getRegisterComponentByName(childName)
                        childComponent.abandoned = true
                    })
                }
            }
            if (elements.dataset.parent) elements.dataset.parent = undefined
            if (elements.dataset.treeParent) elements.dataset.treeParent = undefined
        }
        /** 元素父層 */
        let elementParent = elements.parentNode
        /** 移除元素 */
        elements.remove()
        if (elementParent.classList.contains('divInlineBlock-group')) elementParent = elementParent.parentNode
        const childBean = elementParent.querySelector('.pFormItem[data-name], .pFormItemGroup[data-name]')
        /** 加入標題樣式 */
        if (!childBean && elementParent.querySelector('label.h6')) elementParent.classList.add('table-data-title')
        /** 移除容器 */
        const blockGroupBlockBeans = elementParent.querySelectorAll('.divInlineBlock-group > .pFormItem[data-name], .divInlineBlock-group > .pFormItemGroup[data-name]')
        if (blockGroupBlockBeans.length > 0 && blockGroupBlockBeans.length < 2) {
            blockGroupBlockBeans.forEach(bean => elementParent.prepend(bean))
            if (elementParent.querySelector('.divInlineBlock-group')) elementParent.querySelector('.divInlineBlock-group').remove()
        }
        SharedUtils.clearHover()
        SharedUtils.clearSelectedElements()
    }

    /** 
     * 重複綁定的事件 
     * 包含 api list, draw page components
     */
    static bindEventRepeat () {
        /** 表格全部資料格 */
        const tabledata 		= this.drawPage.querySelectorAll('.table tbody td')
        /** 表格全部標題格 */
        const tablehead 		= this.drawPage.querySelectorAll('.table tbody th')
        /** 列印頁表格 */
	    const printResultTable 	= this.drawPage.querySelectorAll('.resultTable tbody td')
	    /** 頁籤對應容器 */
	    const tableSelect 		= this.drawPage.querySelectorAll('#tabContent .tab-pane, #listContent')
        /** 可編輯元素 (包含元件、非元件) */
        const beans 			= this.drawPage.querySelectorAll('.pFormItem[data-edit="true"]')
        /** 可編輯清單元素 */
        const listBeans 		= this.drawPage.querySelectorAll('.web-component[data-web-component="list"]')
        /** 可編輯列印元素 */
        const printBeans 		= this.drawPage.querySelectorAll('.print-component[data-web-component="print"]')
        /** 頁籤超連結元素 */
        const navLink  			= this.drawPage.querySelectorAll('.nav-link')
        /** 頁籤項目元素 */
        const navItem 			= this.drawPage.querySelectorAll('.nav-item')
        /** 新增表格卡 */
        const cards             = this.drawPage.querySelectorAll('.cards')
        /** 新增頁籤按鈕 */
	    const plusBtn 			= this.drawPage.querySelector('#plus-tab')
        /** 頁籤展開縮放觸發器 */
        const menuToggle 		= this.drawPage.querySelector('.tab-menu-toggle')
        navLink.forEach(nav => {
			if (nav === plusBtn) return
			nav.addEventListener('click', this.showTab.bind(this))
		})
        navItem.forEach(nav => {
			if (nav.childNodes.length > 0 && nav.childNodes[0] === plusBtn) return
			nav.addEventListener('contextmenu', this.removeTab.bind(this))
		})
        new CardModule({selector: cards})
		if (plusBtn) plusBtn.addEventListener('click', this.addTabs.bind(this))
		if (menuToggle) menuToggle.addEventListener('click', (e) => this.parentNode.classList.toggle('active'))

    }

    /**
     * 顯示頁籤事件
     * 切換頁籤
     * @param {Event} e 
     */
    static showTab (e) {
        e.preventDefault()
        $(e.target).tab('show')
        return false
    }

    /**
     * 移除指定頁籤
     * @param {Event} e 
     */
    static removeTab (e) {
        SharedUtils.cancelDefault(e)
        const tabList 	= this.drawPage.querySelector('#tabs')
        const aTag 		= e.target
        // 包含 plus-tab
        if (tabList.children.length === 2) {
            CreateUtils.createModal(`alert`, {body: '一個頁籤無法移除，若不需要頁籤請至【編輯->切換表單樣式】進行切換'})
            return
        } else {
            CreateUtils.createModal(`confirm`, {
                'title':    `警告`,
                'body':     `確定要移除頁籤嗎?(內容元件將會一並移除)`,
                'callback': removeModalCallBack
            })
        }

        /**
         * 移除頁籤彈出視窗回調
         * =
         * @param {Boolean} result 
         * @returns 
         */
        function removeModalCallBack(result) {
            if (result) {
                removeParameterBean(aTag)
                const firstTab = tabList.querySelector('li > a')
                if (firstTab !== null) firstTab.click()
                beanToListEvent()
                return true
            }
        }
    }

    /**
     * 新增頁籤
     * 需要新增頁籤以及頁面內容
     * @param  {Event} e 事件
     */
    static addTabs (e) {
        const tabList 		= this.drawPage.querySelector('#tabs')
        const tabLength 	= tabList.children.length
        const pageArray		= CreateUtils.createNewPage(tabLength)
        const tabContent 	= this.drawPage.querySelector('#tabContent')
        const navItem 		= tabList.querySelector('.nav-item:last-child')
        pageArray.forEach((contentArray, index) => {
            switch (index) {
                case 0:
                    contentArray.forEach(content => navItem.before(content))
                    break
                case 1:
                    contentArray.forEach(content => tabContent.appendChild(content))
                    break
            }
        })
        SharedUtils.cancelDefault(e)
    }

    /**
     * 放置容器觸發器
     * true: 表格放置
     * false: 元件放置
     * @param {boolean} trigger 
     */
    static dropContainerTrigger (trigger) {
        /** 拖曳後放置容器 (表格) */
        const dropSources 		= this.drawPage.querySelectorAll('[data-role="drag-drop-container"]')
        /** 拖曳後放置容器 (元件內) */
        const beanDropSources 	= this.drawPage.querySelectorAll('[data-role="drag-drop-container-bean"]')
        dropSources.forEach(dropSource => {
            if (trigger && (!dropSource.dataset.binded || dropSource.dataset.binded === false)) {
                dropSource.addEventListener('drop', DragNDrop.basicDrop.bind(DragNDrop))
				dropSource.addEventListener('dragenter', DragNDrop.basicDragEnter.bind(DragNDrop))
				dropSource.addEventListener('dragover', DragNDrop.basicDragOver.bind(DragNDrop))
				dropSource.addEventListener('dragleave', DragNDrop.basicDragLeave.bind(DragNDrop))
                dropSource.dataset.binded = true
            } else if (!trigger && dropSource.dataset.binded) {
                dropSource.removeEventListener('drop', DragNDrop.basicDrop)
				dropSource.removeEventListener('dragenter', DragNDrop.basicDragEnter)
				dropSource.removeEventListener('dragover', DragNDrop.basicDragOver)
				dropSource.removeEventListener('dragleave', DragNDrop.basicDragLeave)
                dropSource.dataset.binded = false
            }
        })
        beanDropSources.forEach(beanDropSource => {
            if (!trigger) {
                beanDropSource.addEventListener('drop', DragNDrop.basicDrop.bind(DragNDrop))
				beanDropSource.addEventListener('dragenter', DragNDrop.basicDragEnter.bind(DragNDrop))
				beanDropSource.addEventListener('dragover', DragNDrop.basicDragOver.bind(DragNDrop))
				beanDropSource.addEventListener('dragleave', DragNDrop.basicDragLeave.bind(DragNDrop))
            } else {
                beanDropSource.removeEventListener('drop', DragNDrop.basicDrop)
				beanDropSource.removeEventListener('dragenter', DragNDrop.basicDragEnter)
				beanDropSource.removeEventListener('dragover', DragNDrop.basicDragOver)
				beanDropSource.removeEventListener('dragleave', DragNDrop.basicDragLeave)
            }
        })
    }
}

/** 防止編輯中直接退出瀏覽器 */
// window.onbeforeunload = function() {
//     if (DrawPageFunctions.drawPage && DrawPageFunctions.drawPage.innerHTML.length > 0) return false
//     return null
// }


// window.onload = function () {
//     addEventListener('copy', GlobalFunctions.globalCopy)
//     addEventListener('paste', GlobalFunctions.globalPaste)
//     addEventListener('keydown', GlobalFunctions.globalKeydown)
//     /** 左側清單元素 */
// 	const leftMenu 		= document.querySelector('#leftMenu')
//     /** 左側上方區塊元素 */
// 	const leftTopBox 	= document.querySelector('.left-top-box')
// 	/** 左側下方區塊元素 */
// 	const leftBottomBox = document.querySelector('.left-bottom-box')
//     // 綁定事件
//     leftMenu.addEventListener('mouseenter', GlobalFunctions.mouseEnter)
// 	leftMenu.addEventListener('mousemove', GlobalFunctions.mouseMove)
// 	leftMenu.addEventListener('mouseleave', GlobalFunctions.mouseLeave)
//     leftTopBox.addEventListener('mouseenter', GlobalFunctions.mouseEnter)
// 	leftTopBox.addEventListener('mousemove', GlobalFunctions.mouseMove)
// 	leftBottomBox.addEventListener('mouseenter', GlobalFunctions.mouseEnter)
// 	leftBottomBox.addEventListener('mousemove', GlobalFunctions.mouseMove)

//     GlobalFunctions.initVariable()
//     GlobalFunctions.initContextMenu()
//     GlobalFunctions.handleUrlParam()
//     GlobalFunctions.initBasicBeanBlock()
//     GlobalFunctions.initFixedEvent()
//     new ToolPackModule()

//     /** 設定 code mirror */
//     initEditMirror = CodeMirror.fromTextArea(document.querySelector('#codemirror'), {
// 		mode: 'javascript',
// 		lineNumbers: true,
// 		theme: 'abcdef'
// 	});
// }