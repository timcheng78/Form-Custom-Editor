/** 創建類函數 */
var CreateUtils = {
    /** 
	 * Example Node and Attribute
	 * node: {
	 * 		controlType: 	'String',
	 * 		style: 			'style',
	 * 		attribute: 		[Object]
	 * }
	 * attribute: {
	 * 		'class': 		'class',
	 * 		'children': 	[ElementJson],
	 * 		'childrenAtt': 	[Object]
	 * }
	 */
	/**
	 * Node Properties
	 * controlType 	元件控制項(查閱config.js elementObjectList)
	 * style 		元件類型(不輸入則預設)
	 * attribute 	元件屬性
	 * Attribute Properties
	 * attribute	所有可以放入 Element 的參數
	 * children 	子項目
	 * childrenAtt 	子項目屬性(非前面放入的而是原有預設的)
	 * @param {Object} node 
	 * @param {Boolean} isElement 預設true
	 * @returns {Array} 
	 */
    createBeanElement (node, isElement = true) {
        /** 控制類型 */
		const type 		= node.controlType
        /** 屬性列 */
		const attribute = node.attribute
        /** 回傳元素 */
		let element
		if (node.style) element = $.extend(true, {}, elementObjectList[node.style])
		else element = $.extend(true, {}, elementObjectList[type])
		element = element.createElemental()
		if (attribute !== undefined) {
			if (element.length !== attribute.length) {
				console.error("please use same size [Attribute Object Array]")
				return
			}
			endowAttribute(element, attribute)
		}
		if (isElement) return element
		else return element.convertToJson(true)
		/**
		 * 遞迴物件結構，將屬性賦予物件
		 * @param {Object} ele 
		 * @param {Object} att 
		 */
		function endowAttribute(ele, att) {
			// 判斷是否為陣列，若陣列則轉換成物件進行遞迴解構
			if (Array.isArray(ele) && Array.isArray(att)) {
				for (let i = 0; i < ele.length; i++) {
					endowAttribute(ele[i], att[i])
				}
			} else {
				// 解構屬性進行賦予
				for (let key in att) {
					switch (key) {
						case 'children':
							const childrenElements = att[key].createElemental()
							childrenElements.forEach(element => ele.appendChild(element))
							break
						case 'childrenAtt':
							if (ele.children.length > 0) {
								if (ele.children.length === att[key].length) {
									let childArray = []
									for (let i = 0; i < ele.children.length; i++) {
										childArray.push(ele.children[i])
									}
									endowAttribute(childArray, att[key])
								}
							} else {
								console.error("please use same size [Children Attribute Object Array]")
							}
							break
						case 'text':
							ele.textContent = att[key]
							break
						default:
							ele.setAttribute(key, att[key])
							break
					}
				}
			}
		}
	},

    /**
	 * 新增分頁頁籤
     * =
	 * @param {number} index
	 * @return {[Element]} [固定頁籤物件(0)與內頁物件(1)]
	 */
    createNewPage (index) {
		let timestamp 		= new Date().getTime()
		const tabObj 		= $.extend(true, {}, elementObjectList.tab)
		const contentObj 	= $.extend(true, {}, elementObjectList.content)
		const tableObj 		= $.extend(true, {}, elementObjectList.table)
		let tdArr 			= []
		for (let i = 0; i < 2; i++) {
			tdArr 	= tdArr.concat(this.createBeanElement({
				'controlType': 'tabledata',
				'attribute': 	[
					{
						'data-role': 'drag-drop-container'
					}
				]
			}, false))
		}
		const trRow = this.createBeanElement({'controlType': 'tablerow', 'attribute': [{'children': tdArr}]}, false)
		tabObj.li.children[0].a.id 					+= index + timestamp
		tabObj.li.children[0].a.href 				+= index + timestamp
		tabObj.li.children[0].a["aria-controls"] 	+= index + timestamp
		tableObj.table.children[1].tbody.children 	 = trRow
		contentObj.div.id 							+= index + timestamp
		contentObj.div["aria-labelledby"] 			+= index + timestamp
		contentObj.div.children.push(tableObj)
		
		return [tabObj.createElemental(), contentObj.createElemental()]
	},

    /**
	 * 創建新的表單所需頁面
     * =
	 * @param {String} style		[表單樣式(add,list,print)] 
	 * @param {String} formName		[表單英文名稱] 
	 * @param {String} formTitle 	[表單中文名稱]
	 * @returns {Element} 			[Element]
	 */
    createPage (style, formName, formTitle) {
		/** 引入工廠 */
		const factory = window.ComponentFactory
		let tarObj  = $.extend(true, {}, pageFormat[style])
		tarObj = tarObj.createElemental()
		const firstElement 		= tarObj[0]
		const firstContainer 	= (firstElement.tagName.toLowerCase() === 'div' ? firstElement : firstElement.querySelector('div'))
		const titleBarText 		= firstContainer.querySelector('div.title-bar-text')
		switch (style) {
			case 'add':
			case 'list':
			case 'print':
				firstContainer.dataset.formModel = 'web'
				firstContainer.dataset.formType = style
				break
			case 'appadd':
			case 'applist':
				firstContainer.dataset.formModel = 'app'
				firstContainer.dataset.formType = style.replace(/^app/, '')
				break
			default:
				firstContainer.dataset.formType = style
				break
		}
		
		if (formTitle !== undefined && titleBarText !== null) {
			const formTitleSpan = this.createBeanElement({
				'controlType': 'span',
				'attribute': 	[
					{
						'class': 'h4 d-inline-block canEditDiv',
						'text': formTitle
					}
				]
			})[0]
			firstContainer.dataset.formTitle = formTitle
			titleBarText.appendChild(formTitleSpan)
		} 
		if (formName !== undefined && titleBarText !== null) {
			const formNameSpan = this.createBeanElement({
				'controlType': 'span',
				'attribute': 	[
					{
						'class': 'sub-title d-inline-block canEditDiv',
						'text': formName
					}
				]
			})[0]
			firstContainer.dataset.formName = formName
			titleBarText.appendChild(formNameSpan)
		}
		firstContainer.dataset.version = beanAttributeVersion
		firstContainer.dataset.formToolVersion = FORM_TOOL_VERSION
		// 清單元件需製作
		if (style === 'list') {
			tarObj.forEach(objects => {
				const listElements = objects.querySelectorAll('.listEle')
				listElements.forEach(element => {
					const type 	= element.dataset.eleName
					const listComponent = factory.createList(`__${ type }`)
					const thElement = element.closest('th')
					element.replaceWith(listComponent.fullComponent)
					if (thElement) thElement.dataset.mobileTitle = listComponent.dataset.title
				})
			})
			
		}
		return tarObj
	},

    /**
	 * createModal Example
	 * sample alert modal:
	 * 	createModal(`alert`, {body: 'bodyText'})
	 * sample confirm modal:
	 *  createModal(`confirm`, {
	 *		'title':    `title`,
	 *		'body':     `bodyText`,
	 *		'callback': function(result) {
	 * 			// if result is true then click sure, or click cancel
	 *			if (result) {
	 *				return true
	 *			}
	 *		}
	 *	})
	 * sample custom modal see dnd.js addScript() or formFile.js openForm()
	 */
	/**
	 * 製作彈出視窗
	 * arguments information
	 * style: 		針對彈出視窗本身進行樣式調整
	 * size: 		視窗大小(modal-sm,modal-lg,modal-xl)(可加入css進行客製)
	 * title:		視窗標題文字
	 * titleColor:	視窗標題文字顏色
	 * body: 		視窗文字區域內容(可放入html)
	 * bodyColor:	若為純文字可調整內容文字顏色
	 * btn: 		視窗下方按鈕(Object)
	 * callback: 	按鈕回調(Function)
	 * @param {String} type			[彈出視窗類型] 
	 * @param {Object} modalDescription 	[相關設定參數]
	 * @return {Element} modalElement
	 */
    createModal (type, modalDescription) {
		// alert 在 Modal 存在時要進入排程呼叫
		const modalElement = document.querySelector('#momentModal')
		if (type === 'alert') {
			if (modalElement) {
				setTimeout(() => {
					this.createModal(type, modalDescription)
				}, 1000)
				return
			}
		}
		// start
		let tarObj 		= $.extend(true, {}, modalTypeList[type])
		tarObj 			= tarObj.createElemental()[0]
		for (let key in modalDescription) {
			const modalHeader = tarObj.querySelector('.modal-header')
			const modalBody = tarObj.querySelector('.modal-body')
			const modalFooter = tarObj.querySelector('.modal-footer')
			switch (key) {
				case 'style':
					const styleText = modalDescription[key].split(';')
					for (let i = 0, len = styleText.length; i < len; i++) {
						const styleArr = styleText[i].split(':')
						tarObj.children[0].style(styleArr[0], styleArr[1])
					}
					break
				case 'size':
					tarObj.children[0].classList.remove('modal-xl')
					tarObj.children[0].classList.add(modalDescription[key])
					break
				case 'title':
				case 'titleColor':
					let titleH5 = this.createBeanElement({
						'controlType': 'h5',
						'attribute':	[
							{
								'class': 'modal-title',
								'text': modalDescription['title'] || 'Modal title',
								'style': `color:${ modalDescription['titleColor'] || (type === 'custom' ? 'black' : 'white') }`
							}
						]
					})[0]
					if (modalHeader) {
						modalHeader.children[0].remove()
						modalHeader.prepend(titleH5)
					}
					break
				case 'body':
				case 'bodyColor':
					if (type === 'custom') {
						if (modalDescription['body'] === undefined) break
						if (modalBody.children.length > 0) modalBody.innerHTML = ''
						const bodyChildren = modalDescription['body'].createElemental()
						bodyChildren.forEach(element => modalBody.appendChild(element))
					} else if (type === 'prompt') {
						const input = modalBody.querySelector('input')
						input.placeholder = modalDescription['body']
					} else {
						let bodyP = this.createBeanElement({
							'controlType': 'p',
							'attribute': 	[
								{
									'class': 'modal-body-paragraph',
									'text': modalDescription['body'] || '',
									'style': `color:${ modalDescription['bodyColor'] || 'black' }`
								}
							]
						})[0]
						modalBody.innerHTML = ''
						modalBody.appendChild(bodyP)
					}
					break
				case 'footer':
					if (modalDescription[key] instanceof Element) modalFooter.prepend(modalDescription[key])
					break
				case 'btn':
					if (Array.isArray(modalDescription[key])) {
						if (type === 'custom' && modalFooter.children.length > 0) modalFooter.innerHTML = ''
						for (let i = 0; i < modalDescription[key].length; i++) {
							let btnNode = {
								'controlType': 'button',
								'attribute': 	[
									{
										'type':  'button',
										'class': 'btn btn-primary',
										'text':  'OK'
									}
								]
							}
							for (let btnKey in modalDescription[key][i]) {
								let original = modalDescription[key][i]
								switch (btnKey) {
									case 'class':
										btnNode.attribute[0].class = original[btnKey]
										break
									default:
										btnNode.attribute[0][btnKey] = original[btnKey]
										break
								}
							}
							let footerBtn = this.createBeanElement(btnNode)[0]
							if (type === 'custom') modalFooter.appendChild(footerBtn)
							else {
								modalFooter.children[i].after(footerBtn)
								modalFooter.children[i].remove()
							}
						}
					} else {
						let btnNode 		= {
							'controlType': 'button',
							'attribute': 	[
								{
									'type':  'button',
									'class': 'btn btn-primary',
									'text':  'OK'
								}
							]
						}
						for (let btnKey in modalDescription[key]) {
							let original = modalDescription[key]
							switch (btnKey) {
								case 'class':
									btnNode.attribute[0].class = original[btnKey]
									break
								default:
									btnNode.attribute[0][btnKey] = original[btnKey]
									break
							}
						}
						let footerBtn = this.createBeanElement(btnNode)[0]
						if (type === 'custom') {
							if (type === 'custom' && modalFooter.children.length > 0) modalFooter.innerHTML = ''
							modalFooter.appendChild(footerBtn)
						} else {
							modalFooter.children[0].after(footerBtn)
							modalFooter.children[0].remove()
						}
					}
					break
				case 'callback':
					const buttons = modalFooter.querySelectorAll('button')
					if (typeof modalDescription[key] === 'function') {
						let originalFunction = modalDescription[key]
						switch (type) {
							case 'alert':
								buttons.forEach(button => {
									button.addEventListener('click', function () {
										originalFunction(true)
										const modal = document.querySelector('#momentModal')
										if (modal) {
											setTimeout(() => {
												modal.remove()
											}, 200)
										}
									})
								})
								break
							case 'confirm':
							case 'prompt':
								buttons[0].addEventListener('click', function () {
									originalFunction(false)
									const modal = document.querySelector('#momentModal')
									if (modal) {
										setTimeout(() => {
											modal.remove()
										}, 200)
									}
								})
								buttons[1].addEventListener('click', function() {
									const input = modalBody.querySelector('input')
									if (input) originalFunction(true, input.value)
									else originalFunction(true)
									const modal = document.querySelector('#momentModal')
									if (modal) {
										setTimeout(() => {
											modal.remove()
										}, 200)
									}
								})
								break
							case 'custom':
								const footChildren = modalFooter.children
								for (let i = 0, len = footChildren.length; i < len; ++i) {
									const child = footChildren[i]
									child.addEventListener('click', function() {
										let pass = originalFunction(i, tarObj)
										if (pass === undefined) pass = true
										if (pass) {
											const modal = document.querySelector('#momentModal')
											if (modal) {
												$(modal).modal('hide')
												setTimeout(() => {
													modal.remove()
												}, 200)
											}
										}
									})
								}
								break
						}
					}
					break
			}
		}
		tarObj.id = 'momentModal'
		document.body.appendChild(tarObj)
		$(tarObj).modal('show')
		return tarObj
	},

    /**
	 * 創建小提示窗
     * =
	 * arguments information
	 * 	target(required): selector|element [目標位置](以目標位置右方生成)
	 * 	content(required): string|element  [提示窗內容]
	 * @param {Object} toolTipDescription 
	 */
    createToolTip (toolTipDescription) {
		try {
			if (!toolTipDescription.target) throw 'toolTipDescription.target required.'
			if (!toolTipDescription.content) throw 'toolTipDescription.content required.'
			const toolTipBox = this.createBeanElement({'controlType': 'toolTip'})[0]
			const innerSide  = toolTipBox.querySelector('.tooltip-inner')
			const element 	 = toolTipDescription.target
			const content 	 = toolTipDescription.content
			const react 	 = element.getBoundingClientRect();
			let x 			 = react.x + react.width + 5
			let y 			 = react.y - react.height
			innerSide.appendChild(content)
			toolTipBox.style.transform = `translate3d(${ x }px, ${ y }px, 0)`
			document.appendChild(toolTipBox)
		} catch (e) {
			console.error(`createToolTip() error: ${ e }`)
		}
	},

	/**
	 * 產生唯一亂數代碼
	 * @returns {String} 
	 */
	createRandomCode () {
		return new Date().format('yyyyMMddHHmmsss') + Math.random().toString(16).slice(2)
	},

	/**
	 * 添加表頭
	 */
	addPrintTitle (e) {
		const pageHeader = e.target
        const printTitleModal = CreateUtils.createModal(`custom`, {
            'title':    `編輯表頭`,
            'body':     printTitleBody,
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
            'callback': printTitleCallBack
        })

		const apiSelectName 	= printTitleModal.querySelector('#modalApiSelectName')
		const optGroup 			= apiSelectName.querySelectorAll('optgroup')
		const sendParamBox 		= printTitleModal.querySelector('#modalSendParamEditBox')
		const createTableButton = printTitleModal.querySelector('#createTableButton')
		const resourceSource 	= printTitleModal.querySelectorAll('input[name="modalResourceSource"]')
		const chooseSource 		= printTitleModal.querySelector('input[name="modalResourceSource"]:checked')
		const tableView 		= printTitleModal.querySelector('#tableView')
		const col 				= printTitleModal.querySelector('#col')
		const row 				= printTitleModal.querySelector('#row')

		// 設定彈出視窗資料
		APIModule.buildAPISelectOption(optGroup)
		createTableButton.addEventListener('click', createTable)
		apiSelectName.addEventListener('change', apiSelectNameChanged)
		sendParamBox.addEventListener('click', (e) => {
			const divContainer = printTitleModal.querySelector(e.target.dataset.tar)
			if (!divContainer) return 
			if (e.target.checked) divContainer.classList.remove('hide')
			else divContainer.classList.add('hide')
		})
		resourceSource.forEach(radio => {
			radio.addEventListener('click', function () {
				if (this.checked && this.value === 'api') apiSelectName.classList.remove('hide')
				else apiSelectName.classList.add('hide')
			})
		})
		if (chooseSource && chooseSource.value !== 'api') apiSelectName.classList.add('hide')
		else apiSelectName.classList.remove('hide')

		/** 帶入編輯表頭 */
		if (pageHeader.tagName.toLowerCase() === 'table') {
			/** setting col and row */
			const editTableRows = pageHeader.querySelectorAll('tr')
			row.value = editTableRows.length
			editTableRows.forEach(tr => {
				const editTableData = tr.querySelectorAll('td')
				col.value = editTableData.length
				editTableData.forEach(td => {
					if (td.dataset && td.dataset.bean) {
						const beanDiv = document.createElement('label')
						beanDiv.classList.add('canEditDiv', 'bean-name', 'pFormItem')
						beanDiv.textContent = td.dataset.bean
						td.textContent = ''
						td.appendChild(beanDiv)
						td.classList.remove('pFormItem')
						delete td.dataset.bean
					}
				})
				
			})
			if (pageHeader.dataset.apiSeq) APIModule.tempComponent = APIModule.registerAPIComponents[pageHeader.dataset.apiSeq]
			/** setting api resource */
			try {
				const desc = JSON.parse(pageHeader.dataset.apiStructure)
				let descString = ''
				for (let tag in desc) {
					if (descString.length > 0) descString += '||'
					descString += desc[tag]
				}
				apiSelectName.value = descString
				if ('createEvent' in document) {
					var evt = document.createEvent('HTMLEvents')
					evt.initEvent('change', false, true)
					apiSelectName.dispatchEvent(evt)
				}
			} catch (e) {console.error(e)}
			/** setting api send param */
			if (APIModule.tempComponent && APIModule.tempComponent.sendParam) sendParamBox.click()
			/** setting table */
			const cloneTable = pageHeader.cloneNode(true)
			cloneTable.classList.remove('apiResultTable', 'output-table', 'context-menu-active')
			cloneTable.classList.add('table', 'table-bordered', 'modal-table')
			/** append table */
			tableView.appendChild(cloneTable)
		}

		$.contextMenu({
			selector: '.modal-table td', 
			callback: function(key, options) {
				/** 選擇區域 */
				const targetSite 	= options.$trigger[0]
				switch (key) {
					case 'addText':
						if (targetSite.children.length > 0) break
						const textLabel = document.createElement('label')
						textLabel.classList.add('canEditDiv', 'bean-title')
						textLabel.textContent = '雙擊編輯'
						targetSite.appendChild(textLabel)
						break
					case 'addBean':
						if (targetSite.children.length > 0) break
						const beanDiv = document.createElement('label')
						beanDiv.classList.add('canEditDiv', 'bean-name', 'pFormItem')
						beanDiv.textContent = '雙擊編輯'
						targetSite.appendChild(beanDiv)
						break
					case 'delete':
						targetSite.innerHTML = ''
						break
					case 'alignLeft':
						targetSite.classList.remove('text-center', 'text-right')
						targetSite.classList.add('text-left')
						break
					case 'alignCenter':
						targetSite.classList.remove('text-left', 'text-right')
						targetSite.classList.add('text-center')
						break
					case 'alignRight':
						targetSite.classList.remove('text-left', 'text-center')
						targetSite.classList.add('text-right')
						break
				}
				initEditDiv()
			},
			items: {
				"addText": {name: "添加文字", icon: "bi bi-fonts"},
				"addBean": {name: "添加元件", icon: "bi bi-plus"},
				"delete": {name: "清空欄位", icon: "bi bi-x"},
				"sep1": "---------",
				"alignLeft": {name: "靠左對齊", icon: "bi bi-text-left"},
				"alignCenter": {name: "置中對齊", icon: "bi bi-text-center"},
				"alignRight": {name: "靠右對齊", icon: "bi bi-text-right"},
			}
		});

		function apiSelectNameChanged(e) {
			APIModule.apiSelectValueChangedEvent(e)
			const sendTable 	= printTitleModal.querySelector('#modalSendTable')
			Array.from(sendTable.childNodes).forEach((node, index) => {
				if (index > 0) node.remove()
			})
			APIModule.tempComponent.sendStructure.forEach(tr => sendTable.appendChild(tr.cloneNode(true)))
		}

		/** 添加表頭彈出視窗回調 */
		function printTitleCallBack(index, modalElement) {
			let sendEdit = false
			const modalForm = modalElement.querySelector('form')
            if (index === 1) {
				let resourceType
				const apiSendParam = {}
				if (tableView.children.length === 0) return false
				for (let element of modalForm.elements) {
					const elementName 	= element.name
					const elementValue 	= element.value
					let isValid 		= true
					if (element.tagName.toLowerCase() === 'button' || elementName === '') continue
					switch (elementName) {
						case 'modalResourceSource':
							if (element.checked) resourceType = elementValue
							break
						case 'modalApiSelectName':
							if (element.classList.contains('hide')) continue
							if (elementValue === '0') isValid = false
							break
						case 'modalSendParamEditBox':
							if (element.checked) sendEdit = true
							else sendEdit = false
							break
						default:
							if (!elementName.includes('-') || element.classList.contains('hide')) continue
							const elementType 		= element.type
							const elementNameArray 	= elementName.split('-')
							/** 動作 ( send) */
							let isModal 			= false
							let action 				= elementNameArray[0] 
							if (action === 'modal') { 
								isModal = true
								action = elementNameArray[1]
							}
							if (action === 'send' && !sendEdit) continue
							// 過濾輸入框為空或下拉選單沒選擇
							if (elementValue === '' || (elementType === 'select-one' && elementValue === '0')) isValid = false
							else {
								// 一般輸入框及選項 (包含對應元件及來源參數)
								if (elementNameArray.length > 0 && !isModal) {
									elementNameArray.shift()
									elementNameArray.shift()
									let paramName = elementNameArray.join('-')
									let paramObject = {
										paramValue: elementValue,
										paramMapping: []
									}
									if (action === 'send' && sendEdit) apiSendParam[paramName] = paramObject
								}
								// 對照內容
								if (elementNameArray.length > 0 && isModal) {
									elementNameArray.shift()
									elementNameArray.shift()
									elementNameArray.pop()
									let paramName = elementNameArray.join('-')
									if (action === 'send' && sendEdit) apiSendParam[paramName].paramMapping.push(elementValue)
								}
							}
							break
					}
					if (!isValid) {
						element.classList.add('is-invalid')
						return false
					}
				}
				const outputTable 	= tableView.children[0]
				const allTableData 	= tableView.querySelectorAll('td')
				if (resourceType === 'none') {
					outputTable.classList.remove('table', 'table-bordered', 'modal-table')
					outputTable.classList.add('output-table')
					pageHeader.replaceWith(outputTable)
				} else if (resourceType === 'api') {
					const description 	= apiSelectName.value.split('||')
					allTableData.forEach(td => {
						if (td.textContent.trim() === '') td.html = '&nbsp;'
						else {
							const labelElement = td.querySelector('label')
							if (labelElement.classList.contains('bean-name')) {
								td.classList.add('pFormItem')
								td.dataset.bean = labelElement.textContent
								td.textContent = labelElement.textContent
								labelElement.remove()
							}
						}
					})
					resourceSource.forEach(radioBox => {
						if (radioBox.checked && radioBox.value === 'api') outputTable.classList.add('apiResultTable')
					})
					const apiStructure = {
						apiName: description[0],
						runMode: description[1],
						sourceId: description[2]
					}
					outputTable.dataset.apiStructure = JSON.stringify(apiStructure)
					if (Object.keys(apiSendParam).length > 0) {
						const sendParam = {}
						for (let key in apiSendParam) {
							sendParam[key] = {
								source: apiSendParam[key].paramValue
							}
						}
						outputTable.dataset.sendParam = JSON.stringify(sendParam)
					}
					outputTable.classList.remove('table', 'table-bordered', 'modal-table')
					outputTable.classList.add('output-table')
					APIModule.tempComponent.sendParam = (Object.keys(apiSendParam).length === 0) ? undefined : apiSendParam
					APIModule.tempComponent.generateShell()
					pageHeader.replaceWith(outputTable)
					let component = APIModule.tempComponent
					const apiList = document.querySelector('#api-list-list')
					if (!APIModule.tempComponent.apiSeq) {
						component = APIModule.create(APIModule.tempComponent)
						APIModule.tempComponent = null
						component.formType = 'gFormWebPRINT'
						apiList.appendChild(component.container)
					} else {
						const apiRow = apiList.querySelector(`[data-api-seq="${ component.apiSeq }"]`)
						if (apiRow) apiRow.replaceWith(component.container)
					}
					component.container.classList.remove('hide')
					outputTable.dataset.apiSeq = component.apiSeq
				}
				
				return true
			}
		}

		/** 創建表格 */
		function createTable(e) {
			tableView.innerHTML = ''
			let tableRow, tableData
			const printTitleTable = document.createElement('table')
			printTitleTable.classList.add('table', 'table-bordered', 'modal-table')
			for (let i = 0, lenI = row.value; i < lenI; ++i) {
				tableRow = printTitleTable.insertRow(i)
				for (let j = 0, lenJ = col.value; j < lenJ; ++j) {
					tableData = tableRow.insertCell(j)
				}
			}
			tableView.appendChild(printTitleTable)
			initEditDiv()
		}
	},
	/**
	 * 創建當前所有元件的選項
	 * @param {Boolean} hasTitle [請選擇選項，預設false]
	 * @param {Boolean} isElement [內部存放元素，預設false]
	 * @return {Object[]}
	 */
	createBeanOptions(hasTitle = false, isElement = false) {
		/** 引入工廠 */
		const factory = window.ComponentFactory
		let option = []
		if (hasTitle) option = option.concat(CreateUtils.createBeanElement({
			'controlType': 'option',
				'attribute': 	[
					{
						'text': 	'請選擇',
						'value': 	'0'
					}
				]
		}))
		for (let bean in factory.registerComponent) {
			const component = factory.registerComponent[bean]
			if (component.dataset.abandoned) continue
			/** 下拉框其餘選項 */
			option = option.concat(CreateUtils.createBeanElement({
				'controlType': 'option',
				'attribute': 	[
					{
						'text': 	`${ component.dataset.title }(${ component.externalName })`,
						'value': 	component.dataset.name
					}
				]
			}))
		}
		if (isElement) return option
		else {
			const result = []
			option.forEach(opt => result.push(opt.convertToJson()))
			return result
		}
	},
	/**
	 * 創建參數選擇包
	 * 統一規範:
	 * 	輸入框 => 雙擊 => 下拉框(選擇類型) => 各類型結果選擇/輸入 => 輸入框 
	 * @param {String} name 
	 * @param {String} id 
	 * @return {HTMLCollection}
	 */
	createParamSelectPackage(name, id = SharedUtils._uuid()) {
		const paramPackage = CreateUtils.createBeanElement({'controlType': 'paramValuePackage'})
		const container = document.createElement('div')
		paramPackage.forEach(element => container.appendChild(element))
		/** 元件選項清單 */
		const beanOptions = CreateUtils.createBeanOptions(true, true)
		/** 本地暫存清單 */
		const cloneLocalStorageOptions = $.extend(true, [], localStorageOptions)
		if (localStorageParam) {
			const paramName = localStorageParam.paramName
			const remark 	= localStorageParam.remark
			if (paramName) {
				for (let i = 0, len = paramName.length; i < len; ++i) {
					const option = {
						'option': {
							'value':	paramName[i],
							'text': 	remark[i] || paramName[i]
						}
					}
					cloneLocalStorageOptions.push(option)
				}
			}
		}
		/** 參數值輸入框 */
		const paramValue = container.querySelector('.param-value-input')
		/** 選擇類型下拉框 */
		const selectStep1 = container.querySelector('.select-step-1')
		/** 暫存清單下拉框 */
		const selectLocal = container.querySelector('.local')
		/** 表單相關下拉框 */
		const selectGFormData = container.querySelector('.gFormData')
		/** 表單元件下拉框 */
		const selectEleId = container.querySelector('.eleId')
		/** 輸入框按鈕 */
		const defaultBtn = container.querySelector('button.default')
		// 相關參數及選項設定
		paramValue.id = id
		paramValue.name = name
		sourceTypeOptions.forEach(option => selectStep1.appendChild(option.createElemental()[0]))
		cloneLocalStorageOptions.forEach(option => selectLocal.appendChild(option.createElemental()[0]))
		gFormDataOptions.forEach(option => selectGFormData.appendChild(option.createElemental()[0]))
		beanOptions.forEach(option => selectEleId.appendChild(option))
		// 事件綁定
		paramValue.addEventListener('dblclick', sendParamEdit)
		selectStep1.addEventListener('change', sendParamStepOne)
		selectLocal.addEventListener('change', sendParamStepTwoEnd)
		selectGFormData.addEventListener('change', sendParamStepTwoEnd)
		selectEleId.addEventListener('change', sendParamStepTwoEnd)
		defaultBtn.addEventListener('click', sendParamStepTwoInput)

		return container.children

		/** ================ 下方皆為函數 ================ */

		/**
		 * 輸入參數 - 來源參數編輯
		 * =
		 * 綁定雙擊事件開始編輯模式
		 * 元件擺放順序：
		 *  - input(顯示值無法編輯)
		 *  - select(選擇來源值類型)
		 *  - select(網頁暫存)
		 *  - select(進階用法)
		 *  - select(元件選擇)
		 *  - input(自定義輸入)
		 *  - button(輸入完成按鈕)
		 * @param {Event} e 
		 */
		function sendParamEdit(e) {
			e.target.classList.add('hide')
			e.target.nextElementSibling.classList.remove('hide')
		}

		/**
		 * 步驟一編輯結束
		 * =
		 * 依照步驟一結果呈現步驟二選擇
		 * @param {Event} e 
		 */
		function sendParamStepOne(e) {
			let value = e.target.value
			if (value === 0) return
			e.target.previousElementSibling.value = `${ value }:`
			e.target.classList.add('hide')
			switch(value) {
				case 'local':
					e.target.nextElementSibling.classList.remove('hide')
					break
				case 'gFormData':
					e.target.nextElementSibling.nextElementSibling.classList.remove('hide')
					break
				case 'form':
					e.target.nextElementSibling.nextElementSibling.nextElementSibling.classList.remove('hide')
					break
				default:
					e.target.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.classList.remove('hide')
					e.target.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.classList.remove('hide')
					break
			}
		}

		/**
		 * 步驟二下拉框完成
		 * =
		 * @param {Event} e 
		 */
		function sendParamStepTwoEnd(e) {
			let value = e.target.value
			if (value === 0) return
			const parentElement = e.target.parentElement
			parentElement.children[0].value += value
			parentElement.children[0].classList.remove('hide')
			e.target.classList.add('hide')
		}

		/**
			 * 步驟二輸入完成
			 * =
			 * @param {Event} e 
			 */
		function sendParamStepTwoInput(e) {
			let buttonElement = e.target
			if (buttonElement.tagName.toLowerCase() === 'i') buttonElement = buttonElement.parentElement
			let value = buttonElement.previousElementSibling.value
			if (value === '') {
				buttonElement.previousElementSibling.classList.add('is-invalid')
				return
			}
			buttonElement.previousElementSibling.classList.remove('is-invalid')
			const parentElement = buttonElement.parentElement
			parentElement.children[0].value += value
			parentElement.children[0].classList.remove('hide')
			buttonElement.classList.add('hide')
			buttonElement.previousElementSibling.classList.add('hide')
		}
	},
	/**
	 * 建立表格欄位群組
	 */
	createTableColGroup() {
		const tables = document.querySelectorAll('.tab-pane > table')
		tables.forEach(table => {
			if (table.querySelector('colgroup')) return
			let maxNumber = getTableMaxCell(table)
			const colGroup = document.createElement('colgroup')
			for (let i = 0; i < maxNumber; ++i) {
				const col = document.createElement('col')
				colGroup.appendChild(col)
			}
			table.prepend(colGroup)
		})
	}
}