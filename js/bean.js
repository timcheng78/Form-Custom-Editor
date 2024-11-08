(function() {
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
	this.createBeanElement = function(node, isElement = true) {
		let type 		= node.controlType
		let attribute 	= node.attribute
		let element
		if (node.style)
			element 	= $.extend(true, {}, elementObjectList[node.style])
		else 
			element 	= $.extend(true, {}, elementObjectList[type])
		element = element.createElemental()
		if (attribute !== undefined) {
			if (element.length !== attribute.length) {
				console.error("please use same size [Attribute Object Array]")
				return
			}

			endowAttribute(element, attribute)
		}

		if (isElement)
			return element
		else
			return element.convertToJson(true)

		
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
							$(ele).append(att[key].createElemental())
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
							$(ele).text(att[key])
							break
						default:
							$(ele).attr(key, att[key])
							break
					}
				}
			}
		}
	}

	/**
	 * [新增分頁頁籤]
	 * [斟酌調整]
	 * @return {[Element]} [固定頁籤物件(0)與內頁物件(1)]
	 */
	this.createNewPage = function() {
		let tabObj 			= $.extend(true, {}, elementObjectList.tab)
		let contentObj 		= $.extend(true, {}, elementObjectList.content)
		let tableObj 		= $.extend(true, {}, elementObjectList.table)
		let tdArr 	= []
		for (let i = 0; i < 2; i++) {
			tdArr 	= tdArr.concat(createBeanElement({
				'controlType': 'tabledata',
				'attribute': 	[
					{
						'data-role': 'drag-drop-container'
					}
				]
			}, false))
		}
		let trRow 	= createBeanElement({'controlType': 'tablerow', 'attribute': [{'children': tdArr}]}, false)
		tabObj.li.children[0].a.id 					+= $('#tabs').find('.nav-item').length
		tabObj.li.children[0].a.href 				+= $('#tabs').find('.nav-item').length
		tabObj.li.children[0].a["aria-controls"] 	+= $('#tabs').find('.nav-item').length
		tableObj.table.children[1].tbody.children 	 = trRow
		contentObj.div.id 							+= $('#tabs').find('.nav-item').length
		contentObj.div["aria-labelledby"] 			+= $('#tabs').find('.nav-item').length
		contentObj.div.children.push(tableObj)
		
		return [tabObj.createElemental(), contentObj.createElemental()]
	}

	/**
	 * [創建新的表單所需頁面]
	 * @param {String} style		[表單樣式(add,list,print)] 
	 * @param {String} formName		[表單英文名稱] 
	 * @param {String} formTitle 	[表單中文名稱]
	 * @returns {Element} 			[Element]
	 */
	this.createPage = function(style, formName, formTitle) {
		/** 引入工廠 */
		const factory = window.ComponentFactory
		let tarObj  = $.extend(true, {}, pageFormat[style])
		tarObj = tarObj.createElemental()
		const firstElement 		= tarObj[0]
		const firstContainer 	= (firstElement.tagName.toLowerCase() === 'div' ? firstElement : firstElement.querySelector('div'))
		const titleBarText 		= firstContainer.querySelector('div.title-bar-text')
		firstContainer.dataset.formType = style
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
						'class': 'h4 d-inline-block canEditDiv',
						'text': formName
					}
				]
			})[0]
			firstContainer.dataset.formName = formName
			titleBarText.appendChild(formNameSpan)
		}
		firstContainer.dataset.version = beanAttributeVersion
		//清單元件
		if (style === 'list') {
			tarObj.forEach(objects => {
				const listElements = objects.querySelectorAll('.listEle')
				listElements.forEach(element => {
					const type 	= element.dataset.eleName
					const listComponent = factory.createList(`__${ type }`)
					element.replaceWith(listComponent.fullComponent)
				})
			})
			
		}
		return tarObj
	}

	/**
	 * 清除頁面相關資訊(包含元件、畫面)
	 */
	this.clearPage = function(selector) {
		/** 引入工廠 */
		const factory = window.ComponentFactory
		let drawPage = $('#drawPage')
		if (selector) drawPage = $(selector)
		drawPage.html('')
		factory.clearRegisterComponents()
		if (drawPage[0].id === 'drawPage') beanToListEvent()
		if (drawPage[0].id === 'queryPage') resetSqlTreeEvent()
	}

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
	 * @param {Object} arguments 	[相關設定參數]
	 * @return {Element} modalElement
	 */
	this.createModal = function(type, arguments) {
		// alert 在 Modal 存在時要進入排程呼叫
		if (type === 'alert') {
			if ($('#momentModal').length > 0) {
				var args = arguments
				setTimeout(function(){
					this.createModal(type, args)
				}, 1000)
				return
			}
		}
		// start
		let tarObj 		= $.extend(true, {}, modalTypeList[type])
		tarObj 			= tarObj.createElemental()
		for (let key in arguments) {
			switch (key) {
				case 'style':
					let styleText = arguments[key].split(';')
					for (let i = 0, len = styleText.length; i < len; i++) {
						let styleArr = styleText[i].split(':')
						$(tarObj).children().css(styleArr[0], styleArr[1])
					}
					break
				case 'size':
					$(tarObj).children().removeClass('modal-xl').addClass(arguments[key])
					break
				case 'title':
				case 'titleColor':
					let titleH5 = this.createBeanElement({
						'controlType': 'h5',
						'attribute':	[
							{
								'class': 'modal-title',
								'text': arguments['title'] || 'Modal title',
								'style': `color:${ arguments['titleColor'] || (type === 'custom' ? 'black' : 'white') }`
							}
						]
					})
					$(tarObj).find('.modal-header').children().eq(0).remove()
					$(tarObj).find('.modal-header').prepend(titleH5)
					break
				case 'body':
				case 'bodyColor':
					if (type === 'custom') {
						if (arguments['body'] === undefined) break
						if ($(tarObj).find('.modal-body').children().length > 0) $(tarObj).find('.modal-body').html('')
						$(tarObj).find('.modal-body').append(arguments['body'].createElemental())
					} else if (type === 'prompt') {
						$(tarObj).find('.modal-body').find('input').attr('placeholder', arguments['body'])
					} else {
						let bodyP = this.createBeanElement({
							'controlType': 'p',
							'attribute': 	[
								{
									'class': 'modal-body-paragraph',
									'text': arguments['body'] || '',
									'style': `color:${ arguments['bodyColor'] || 'black' }`
								}
							]
						})
						$(tarObj).find('.modal-body').html('')
						$(tarObj).find('.modal-body').append(bodyP)
					}
					break
				case 'footer':
					if (arguments[key] instanceof Element) $(tarObj).find('.modal-footer').prepend(arguments[key])
					break
				case 'btn':
					if (Array.isArray(arguments[key])) {
						if (type === 'custom' && $(tarObj).find('.modal-footer').children().length > 0) $(tarObj).find('.modal-footer').html('')
						for (let i = 0; i < arguments[key].length; i++) {
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
							for (let btnKey in arguments[key][i]) {
								let original = arguments[key][i]
								switch (btnKey) {
									case 'class':
										btnNode.attribute[0].class = original[btnKey]
										break
									default:
										btnNode.attribute[0][btnKey] = original[btnKey]
										break
								}
							}
							let footerBtn = this.createBeanElement(btnNode)
							if (type === 'custom') {
								$(tarObj).find('.modal-footer').append(footerBtn)
							} else {
								$(tarObj).find('.modal-footer').children().eq(i).addClass('needRemove').after(footerBtn)
								$('.needRemove').remove()
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
						for (let btnKey in arguments[key]) {
							let original = arguments[key]
							switch (btnKey) {
								case 'class':
									btnNode.attribute[0].class = original[btnKey]
									break
								default:
									btnNode.attribute[0][btnKey] = original[btnKey]
									break
							}
						}
						let footerBtn = this.createBeanElement(btnNode)
						if (type === 'custom') {
							if (type === 'custom' && $(tarObj).find('.modal-footer').children().length > 0) $(tarObj).find('.modal-footer').html('')
							$(tarObj).find('.modal-footer').append(footerBtn)
						} else {
							$(tarObj).find('.modal-footer').children().eq(0).addClass('needRemove').after(footerBtn)
							$('.needRemove').remove()
						}
					}
					break
				case 'callback':
					if (typeof arguments[key] === 'function') {
						let originalFunction = arguments[key]
						switch (type) {
							case 'alert':
								$(tarObj).find('.modal-footer').find('button').click(function () {
									originalFunction(true)
									setTimeout(() => {
										$('#momentModal').remove()
									}, 200)
								})
								break
							case 'confirm':
							case 'prompt':
								$(tarObj).find('.modal-footer').find('button').eq(0).click(function () {
									originalFunction(false)
									setTimeout(() => {
										$('#momentModal').remove()
									}, 200)
								})
								$(tarObj).find('.modal-footer').find('button').eq(1).click(function () {
									let queryString = $('.modal-body form').serializeArray()
									if (queryString.length > 0)
										originalFunction(true, queryString)
									else
										originalFunction(true)
									setTimeout(() => {
										$('#momentModal').remove()
									}, 200)
								})
								break
							case 'custom':
								$(tarObj).find('.modal-footer').children().each(function(index) {
									$(this).click(function() {
										let queryString = $('.modal-body form').serializeArray()
										let pass 		= originalFunction(index, queryString, tarObj[0])
										if (pass === undefined) pass = true
										if (pass) {
											$('#momentModal').modal('hide')
											setTimeout(() => {
												$('#momentModal').remove()
											}, 200)
										}
									})
								})
								break
						}
					}
					break
			}
		}
		$(tarObj).attr('id', 'momentModal')
		$('body').append(tarObj)
		$('#momentModal').modal('show')
		return tarObj[0]
	}

	/**
	 * [創建小提示窗]
	 * arguments information
	 * 	target(required): selector|element [目標位置](以目標位置右方生成)
	 * 	content(required): string|element  [提示窗內容]
	 * @param {Object} arguments 
	 */
	this.createToolTip = function(arguments) {
		try {
			if (!arguments.target) throw 'arguments.target required.'
			if (!arguments.content) throw 'arguments.content required.'
			const toolTipBox = this.createBeanElement({'controlType': 'toolTip'})[0]
			const element 	 = $(arguments.target)
			const content 	 = $(arguments.content)
			const react 	 = element[0].getBoundingClientRect();
			let x 			 = react.x + react.width + 5
			let y 			 = react.y - react.height
			$(toolTipBox).find('.tooltip-inner').append(content)
			$(toolTipBox).css('transform', `translate3d(${ x }px, ${ y }px, 0)`)
			$('body').append($(toolTipBox))
		} catch (e) {
			console.error(`createToolTip() error: ${ e }`)
		}
	}

	/**
	 * [移除小提示窗]
	 */
	this.removeToolTip = function() {
		const toolTip = document.querySelector('[role="tooltip"]')
		$(toolTip).remove()
	}

	this.getFormTypeFormSelect = function(select) {
		const pageData = select.querySelector('div')
		if (pageData === null) return null
		const formType = pageData.dataset.formType
		return formType
	}

	/**
	 * 取得本地表單清單與元件
	 * return structure:
	 * uuid: 		String [編號]
	 * formName:	String [表單名稱](En)
	 * formTitle:	String [表單標題](zh-TW)
	 * formType:	String [表單類型] add|list|print
	 * dataTime:	String [創建時間]
	 * version:		number [版本號]
	 * beanList:	Object [表單內元件清單]
	 * @returns {Object[]}
	 */
	this.getAllLocalFormAndBean = function() {
		const resultList = []
		let allForm = window.localStorage
		let regex
		for (let key in allForm) {
			regex = new RegExp(/^formTool+/)
			if (regex.test(key)) {
				if (key === 'formTool.noDownload') continue
				let tmpArr = key.split('.')
				if (tmpArr.length === 2) {
					try {
						let form = JSON.parse(allForm[key])
						for (let i = 0; i < form.length; i++) {
							if (form[i].available === 9 || form[i].formType !== 'add') continue
							let beanArray = formSaveAndLoad('load', {'formName': form[i].formName, 'formType': 'add'})[1]
							const beanObject = {}
							try {
								beanArray = JSON.parse(beanArray)
								for (let i = 0; i < beanArray.length; i++) {
									beanObject[beanArray[i].name] = beanArray[i]
								}
							} catch (e) {
								console.log(e)
							}
							resultList.push({
								'uuid':     form[i].uuid,
								'formName': form[i].formName,
								'formTitle': form[i].formTitle,
								'formType': form[i].formType,
								'dateTime': form[i].creatTime,
								'version':  form[i].beanAttributeVersion,
								'beanList': beanObject
							})
						}
					} catch (e) {
						console.error(`error: ${ e }. key: ${ key }`)
						console.log(allForm)
					}
				}
			}
		}
	
		return resultList
	}

	/**
	 * 比對元件是否一致
	 * 若一致回傳 true
	 * 否則回傳不一致的元件陣列
	 * 以 beanTree1 為主要參照對象
	 * @param {Array} beanTree1 
	 * @param {Array} beanTree2
	 * @returns {[mixed Object]} boolean or Array
	 */
	this.checkingBeanDifferent = function(beanTree1, beanTree2) {
		if (!Array.isArray(beanTree1) || !Array.isArray(beanTree2)) {
			console.error('not array parameter...')
			return false
		}
		const resultArray = []
		for (let i = 0, len = beanTree1.length; i < len; i++) {
			let position = treeSearching(beanTree2, beanTree1[i].name)
			if (position > -1) {
				if (beanTree1[i].abandoned !== beanTree2[position].abandoned) resultArray.push(beanTree1[i])
			} else {
				resultArray.push(beanTree1[i])
			}
		}
		
		if (resultArray.length > 0) 
			return resultArray
		else 
			return true

		function treeSearching(mainTree, searchTarget) {
			for (let i = 0, len = mainTree.length; i < len; i++) {
				if (mainTree[i].name === searchTarget) return i
			}
			return -1
		}
	}

	/**
	 * 進版同步執行函數
	 * @param {Object[]} beanList 	元件陣列 
	 * @param {Number} version  	版本號
	 */
	this.advanceVersion = function(beanList, version = 0) {
		// 讀取進版檔案(*.jsonc)
		const advancePromise = asyncGetFile('./advanceVersionDescription.jsonc')
		return new Promise((resolve, reject) => {
			advancePromise.then((resultJson) => {
				// 過濾註解規則(/**內都直接取代掉*/)
				let regex = new RegExp(/(\/\*(.|\r\n)*\*\/)|(\r\n)/g)
				try {
					const advanceJson = JSON.parse(resultJson.replace(regex, ''))
					for (let i = 0, lenI = advanceJson.length; i < lenI; ++i) {
						// 初步檢查進版結構(條件不達成都不進行進版)(available = 1, 小於version, 寫入進版資訊)
						if (advanceJson[i].available === 9 || 
							version > advanceJson[i].version || 
							(advanceJson[i].description === '' || advanceJson[i].description === undefined))
								continue
						const advanceItem = advanceJson[i].advance
						for (let j = 0, lenJ = advanceItem.length; j < lenJ; ++j) {
							let action 			= advanceItem[j].action
							let attributeName 	= advanceItem[j].attributeName
							let attributeValue 	= advanceItem[j].attributeValue
							let controlType 	= advanceItem[j].controlType
							let originValue 	= advanceItem[j].originValue
							if (action === undefined || attributeName === undefined || attributeValue === undefined || controlType === undefined) continue
							// 依照新增、更新、移除進行各個對應的屬性變更
							for (let key in beanList) {
								switch (action) {
									case 'add':
										if (beanList[key].controlType === controlType)
										beanList[key][attributeName] = attributeValue
										break
									case 'upd':
										if (beanList[key].controlType === controlType) {
											if (originValue === undefined || originValue === '') {
												beanList[key][attributeName] = attributeValue
											} else {
												if (beanList[key][attributeName] !== undefined && beanList[key][attributeName] === originValue) {
													beanList[key][attributeName] = attributeValue
												}
											}
										}
										break
									case 'delete':
										// 尚未實作
										break
								}
								
							}
						}
						const drawPage = document.querySelector('#drawPage')
						if (drawPage !== null) {
							const formDataContainer = drawPage.querySelector('div')
							formDataContainer.dataset.version = advanceJson[i].version
						}
						resolve()
					}
				} catch (e) {
					console.error(e)
					reject()
				}
			})
		})
	}

	/**
	 * 左側元件菜單顯示調整
	 * 【依照 data-show-type 進行顯示調整】
	 */
	this.beansNavDisplay = function() {
		const beanNav 	= document.querySelectorAll('#bean-tabs .nav-link')
		const drawPage 	= document.querySelector('#drawPage')
		const dataBar 	= drawPage.querySelector('div')
		if (dataBar === null) return
		const formType 	= dataBar.dataset.formType
		let first 	 	= true
		if (formType === undefined) return
		beanNav.forEach(nav => {
			let showType 	= nav.dataset.showType
			let needOnline 	= nav.dataset.onlineMode
			if (showType.includes(formType)) {
				if (needOnline === 'true') {
					if (onlineMode) nav.classList.remove('hide')
					else nav.classList.add('hide')
				} else nav.classList.remove('hide')
				if (first) {
					nav.click()
					first = false
				}
			} else nav.classList.add('hide')
		})
	}

	/**
	 * 切換下拉框及輸入框
	 * =
	 * @param {Event} that 
	 */
	this.switchSelectAndInput = function(e) {
		const button 			= e.target.closest('button')
		const container 		= button.parentNode
		const toggleElements 	= container.querySelectorAll('.toggle-switch')
		toggleElements.forEach(element => {
			if (element.classList.contains('hide')) element.classList.remove('hide')
			else element.classList.add('hide')
		})
	}

	/**
	 * 獲取表單樹物件結構
	 * @returns {beanTreeStructure}
	 */
	this.getTree = function() {
		//節點上的資料遵循如下的格式：
		try {
			if (beanTreeStructure === undefined) throw "not defined"
			return beanTreeStructure
		} catch (e) {
			console.error(`config didn't setting success... error: ${e}`)
		}
	}

	/**
	 * 讀取檔案函數
	 * @param {File} file 
	 */
	this.readFile = function(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader()
			reader.addEventListener('load', (event) => {
				const result = event.target.result
				resolve(result)
			})
			reader.addEventListener('error', reject)
			reader.addEventListener('progress', (event) => {
				if (event.loaded && event.total) {
					const percent = (event.loaded / event.total) * 100
					console.log(`Progress: ${Math.round(percent)}`)
				}
			})
			reader.readAsText(file)
		})
	}

	/**
	 * 將物件存成json檔案並進行下載
	 * @param {String} exportObj 
	 * @param {String} exportName 
	 */
	this.downloadFile = function(exportObj, exportName) {
		var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(exportObj);
		var downloadAnchorNode = document.createElement('a');
		downloadAnchorNode.setAttribute("href",     dataStr);
		downloadAnchorNode.setAttribute("download", exportName + ".json");
		document.body.appendChild(downloadAnchorNode); // required for firefox
		downloadAnchorNode.click();
		downloadAnchorNode.remove();
	}
	
	/**
	 * 整理html文檔排版
	 * @param {String} html 
	 * @returns {String}
	 */
	this.style_html = function(html) {
		html = html.trim()
		var result = '',
			indentLevel = 0,
			tokens = html.split(/</)
		for (var i = 0, l = tokens.length; i < l; i++) {
			var parts = tokens[i].split(/>/)
			if (parts.length === 2) {
				if (tokens[i][0] === '/') {
					indentLevel--
				}
				result += getIndent(indentLevel)
				if (tokens[i][0] !== '/') {
					indentLevel++
				}
				if (i > 0) {
					result += '<'
				}
				result += parts[0].trim() +">\n"
				if (parts[1].trim() !== '') {
					result += getIndent(indentLevel) + parts[1].trim().replace(/\\s+/g, ' ') +"\n"
				}	
				if (parts[0].match(/^(img|hr|br)/)) {
					indentLevel--
				}
			} else {
				result += getIndent(indentLevel) + parts[0] + "\n"
			}
		}
		return result

		function getIndent(level) {
			var result = '',
				i = level * 4
			if (level < 0) {
				throw "Level is below 0"
			}
			while (i--) {
				result += ' '
			}
			return result
		}
	}

	/**
	 * 讀取檔案
	 * 回傳需要使用then進行獲取
	 * @param {String} url 
	 * @returns 
	 */
	this.asyncGetFile = function(url) {
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest()
			xhr.open("GET", url)
			xhr.onload = () => resolve(xhr.responseText)
			xhr.onerror = () => reject(xhr.statusText)
			xhr.send();
		})
	}

	/**
	 * loading 頁面觸發器 (toggle)
	 * =
	 * 重複呼叫進行關閉
	 * @param {Boolean} isClose 強制關閉[預設false] 
	 */
	this.loadingToggle = function(isClose = false) {
		const loadingMask = document.querySelector('.loading-mask')
		const loadingElement = document.querySelector('.spinner-container')
		if (loadingMask.classList.contains('hide')) {
			loadingMask.classList.remove('hide')
			loadingElement.classList.remove('hide')
			setTimeout(() => {
				loadingMask.classList.add('show')
				loadingElement.classList.add('show')
			}, 150)
		} else {
			loadingMask.classList.remove('show')
			loadingElement.classList.remove('show')
			setTimeout(() => {
				loadingElement.classList.add('hide')
				loadingMask.classList.add('hide')
			}, 150)
		}
		if (isClose) {
			loadingMask.classList.remove('show')
			loadingElement.classList.remove('show')
			setTimeout(() => {
				loadingElement.classList.add('hide')
				loadingMask.classList.add('hide')
			}, 150)
		}
	}

	/**
	 * 遮罩觸發器(toggle)
	 * =
	 * @param {*} isClose 
	 */
	this.maskToggle = function(isClose = false) {
		const mask = document.querySelector('.mask')
		if (mask.classList.contains('hide')) mask.classList.remove('hide')
		else mask.classList.add('hide')
		if (isClose) mask.classList.add('hide')
	}

	/**
	 * 清除全部滑入效果
	 */
	this.clearHover = function() {
		const hoverElements = document.querySelectorAll('.hover')
		const dragHover 	= document.querySelectorAll('.drag-hover')
		hoverElements.forEach(element => element.classList.remove('hover'))
		dragHover.forEach(element => element.classList.remove('drag-hover'))
	}

	/**
	 * 局部 loading 觸發器
	 * @param {String|Element} target 
	 * @param {Boolean} isClose 強制關閉[預設false] 
	 */
	this.partialLoading = function(element, isClose = false) {
		if (!loadingStyle) return false
		const ldsEllipsisParent = element.querySelectorAll('.lds-ellipsis-parent')
		if (isClose) ldsEllipsisParent.forEach(container => container.remove())
		else {
			ldsEllipsisParent.forEach(container => container.remove())
			const loadingElement = loadingStyle.createElemental()[0]
			element.appendChild(loadingElement)
		}
	}

	/**
	 * 清除全部元件的選取狀態
	 * =
	 */
	this.clearSelectedElements = function() {
		const selectedElements 	= document.querySelectorAll('.selected')
		const materialList 		= document.querySelector('#materialList')
		const leftBottomBox 	= document.querySelector('.left-bottom-box')
		materialList.innerHTML  = ''
		leftBottomBox.classList.remove('active')
		selectedElements.forEach(element => {
			const dropContainer = element.querySelectorAll('.bean-drop')
			dropContainer.forEach(container => container.remove())
			element.classList.remove('selected')
		})
	}

	/**
	 * 清除全部表格的選取狀態
	 * =
	 */
	this.clearTableActiveData = function() {
		const activeData = document.querySelectorAll('td.active')
		activeData.forEach(td => td.classList.remove('active'))
	}

	/**
	 * 清除全部表頭的選取狀態
	 * =
	 */
	this.clearTableActiveHead = function() {
		const activeHead = document.querySelectorAll('th.active')
		activeHead.forEach(th => th.classList.remove('active'))
	}

	/**
	 * 清除表格內所有的新增表格按鈕
	 * =
	 */
	this.clearTableHoverButton = function() {
		const plusButtons = document.querySelectorAll('td > button.icon.plus, th > button.icon.plus')
		plusButtons.forEach(button => button.remove())
	}

	/**
	 * 判斷當前是否處於編輯狀態
	 * =
	 */
	this.isEditing = function() {
		const mask = document.querySelector('.mask')
		if (mask.classList.contains('hide')) return false
		else return true
	}

	/**
	 * 解構字串
	 * =
	 * @param {*} jsonString 
	 */
	this.onionStringDecode = function(jsonString) {
		try {
			if (typeof jsonString === 'string') return this.onionStringDecode(JSON.parse(jsonString))
			else if (typeof jsonString === 'object') return jsonString
		} catch (e) { 
			return jsonString
		}
		return null
	}

	/**
	 * [RGBA轉換器]
	 * @param 	{String} color_value 	[rgba(0,0,0,0)] 
	 * @returns {String} hex 			[#000000]
	 */
	this.rgba2hex = function(color_value) {
		if (!color_value) return
		let parts = color_value.toLowerCase().match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/),
		    length = color_value.indexOf('rgba') ? 3 : 2 // Fix for alpha values
		if (parts === null) return
		delete(parts[0])
		for (let i = 1; i <= length; i++) {
			parts[i] = parseInt(parts[i]).toString(16)
			if (parts[i].length == 1) parts[i] = '0' + parts[i]
		}
		return '#' + parts.join('').toUpperCase();
	}

	/**
	 * [UUID產生器]
	 * @returns {String} [UUID]
	 */
	this._uuid = function(stringLength = 36) {
		var d = Date.now()
		if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
			d += performance.now()
		}
		if (stringLength === 36) return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = (d + Math.random() * 16) % 16 | 0
			d = Math.floor(d / 16)
			return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
		})
		if (stringLength === 32) return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = (d + Math.random() * 16) % 16 | 0
			d = Math.floor(d / 16)
			return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
		})
	}

	/**
	 * 取消各種事件重複點擊或重疊元素點擊效果
	 * =
	 * @param {Event} e 事件
	 */
	this.cancelDefault = function(e) {
		e.preventDefault()
		e.stopPropagation()
		return false
	}


	/**
	 * ===========================================
	 * =============== deprecation ===============
	 * ===============  以下已棄用  ===============
	 * ===========================================
	 */

	/**
	 * =============== deprecation ===============
	 * [創建基礎元素]
	 * @param  {String}  kind       [元素類型，參照config.js]
	 * @param  {String}  classes    [綁定的類別][預設空]
	 * @param  {Object}  attributes [內表格的類別][預設空]
	 * @param  {Boolean} isElement  [是否為Element]
	 * @return {[Mixed Object]}     [Element][Object][undefined]
	 */
	this.createBaseElement = function(kind, classes = '', attributes = {}, isElement = true) {
		if (kind === undefined) {
			console.error('請帶入對應類型的元素，詳情參照config.js')
			return undefined
		}
		if (elementObjectList[kind] === undefined) {
			console.error('無此類型元素，詳情參照config.js或進行新增')
			return undefined
		}
		let tarObj = $.extend(true, {}, elementObjectList[kind])
		if (classes !== '') tarObj[kind].class = classes
		if (Object.keys(attributes).length > 0) {
			for (let attribute in attributes) {
				tarObj[kind][attribute] = attributes[attribute]
			}
		}
		if (isElement)
			return tarObj.createElemental()
		else
			return tarObj
	}

	/**
	 * =============== deprecation ===============
	 * [創建非節點基礎元素]
	 * @param {String} kind 		[元素類型，參照config.js]
	 * @param {String} classes 		[綁定的類別][預設空]
	 * @param {String} name 		[元素名稱][預設UUID]
	 * @param {Boolean} isElement 	[是否為Element]
	 * @return {[Mixed Object]}     [Element][Object][undefined]
	 */
	this.createBoxElement = function(kind, classes = ``, name = _uuid(), isElement = true) {
		if (kind === undefined) {
			console.error('請帶入對應類型的元素，詳情參照config.js')
			return undefined
		}
		if (elementObjectList[kind] === undefined) {
			console.error('無此類型元素，詳情參照config.js或進行新增')
			return undefined
		}
		let tarObj 	= $.extend(true, {}, elementObjectList[kind])
		try {
			if (classes !== '') tarObj.div.class = classes

			let id = _uuid()
			tarObj.div.children[0].input.name = name
			tarObj.div.children[0].input.id = id
			tarObj.div.children[1].label.for = id
		} catch (e) {
			console.log(e)
		}
		if (isElement)
			return tarObj.createElemental()
		else
			return tarObj
	}

	/**
	 * =============== deprecation ===============
	 * [創建一列預設 table row]
	 * @param  {[String]} classes 		[綁定的類別][預設空]
	 * @param  {[Object]} attributes  	[元素的屬性][預設空]
	 * @param  {[String]} tdClasses 	[內表格的類別][預設空]
	 * @param  {[Object]} tdAttributes	[內表格的屬性][預設空]
	 * @param  {[Number]} thCount 		[table head 數量][預設 0]
	 * @param  {[Number]} tdCount 		[table data 數量][預設 0]
	 * @param  {[Boolean]} isElement 	[是否為Element][預設 true]
	 * @return {[Mixed Object]} 		[Element][Object]
	 */
	this.createRowElement = function(classes = '', attributes = {}, tdClasses = '', tdAttributes = {}, thCount = 0, tdCount = 0, isElement = true) {
		let tarObj = $.extend(true, {}, elementObjectList.tablerow)
		if (classes !== '') tarObj.tr.class = classes
		if (Object.keys(attributes).length > 0) {
			for (let attribute in attributes) {
				tarObj.tr[attribute] = attributes[attribute]
			}
		}
		for (let i = 0; i < thCount; ++i) {
			if (tarObj.tr.children === undefined) tarObj.tr.children = []
			tarObj.tr.children.push(this.createCellElement('head', tdClasses, tdAttributes, false))
		}
		for (let i = 0; i < tdCount; ++i) {
			if (tarObj.tr.children === undefined) tarObj.tr.children = []
			tarObj.tr.children.push(this.createCellElement('data', tdClasses, tdAttributes, false))
		}
		if (isElement) 
			return tarObj.createElemental()
		else 
			return tarObj
	}
	
	/**
	 * =============== deprecation ===============
	 * [創建表格]
	 * @param  {[String]} headOrData 	[head or data]
	 * @param  {[String]} classes    	[綁定的類別][預設空]
	 * @param  {[Object]} attributes 	[元素的屬性][預設空]
	 * @param  {[Boolean]} isElement 	[是否為Element][預設 true]
	 * @return {[mixed Object]} 		[Element][Object]
	 */
	this.createCellElement = function(headOrData, classes = '', attributes = {}, isElement = true) {
		let hod 	= headOrData === 'head' ? 'th' : 'td'
		let tarObj  = $.extend(true, {}, elementObjectList['table' + headOrData])
		if (classes !== '') tarObj[hod].class = classes
		if (Object.keys(attributes).length > 0) {
			for (let attribute in attributes) {
				tarObj[hod][attribute] = attributes[attribute]
			}
		}
		if (isElement) 
			return tarObj.createElemental()
		else 
			return tarObj
	}

	/**
	 * =============== deprecation ===============
	 * (new) 元件生成
	 * =
	 * 依照 formItemElement 節點上的參數進行生成
	 * 隨後放入 container 內
	 * @param {Element} container 
	 * @param {Element} formItemElement 
	 * @returns 
	 */
	this.generateBean = function(container, formItemElement) {
		/** 元件類型 */
		const controlType   = formItemElement.dataset.controlType
		/** 元件名稱(En) */
		const beanName      = formItemElement.dataset.name
		/** 元件標題(zh-TW) */
		const beanTitle     = formItemElement.dataset.title
		try {
			switch (controlType) {
				case 'input':
				case 'text':
				case 'textarea':
					/** 元件提示文字 */
					const placeholder = formItemElement.dataset.placeholder
					/** 元件文字長度限制 */
					const maxlength = formItemElement.dataset.maxlength
					/** 元件預設值 */
					const defaultValue = formItemElement.dataset.defaultValue
					/** 元件寬度 */
					const width = formItemElement.dataset.width
					const textElement = createBeanElement({
						'controlType': 	controlType === 'input' ? 'text' : controlType,
						'attribute': 	[
							{
								'name': 		beanName,
								'placeholder': 	placeholder,
								'maxlength': 	maxlength,
								'value': 		defaultValue,
								'style': 		width ? `width: ${ width }` : '',
								'readonly': 	'true',
								'id': 			_uuid()
							}
						]
					})[0]
					formItemElement.appendChild(textElement)
					break
				case 'checkbox':
				case 'radio':
					/** 顯示樣式 */
					const displayMode   = formItemElement.dataset.displayMode
					/** 選項標題 */
					const uiDescChk 	= formItemElement.dataset.uiDesc || ''
					/** 選項值 */
					const uiValueChk 	= formItemElement.dataset.uiValue || ''
					/** 選項分數 */
					const uiScoreChk 	= formItemElement.dataset.uiScore || ''
					const descChkArray 	= uiDescChk.split(',')
					const valueChkArray = uiValueChk.split(',')
					const scoreChkArray = uiScoreChk.split(',')
					let chkLength       = descChkArray.length
					if (descChkArray.length !== valueChkArray.length) {
						console.error(`選項項目不一致... 建立元件 ${ beanName }失敗...`)
						return false
					}
					for (let i = 0; i < chkLength; ++i) {
						const chkId = _uuid()
						const chkRdoElement = createBeanElement({
							'controlType': 	controlType,
							'attribute': 	[
								{
									'childrenAtt': [
										{
											'name': 		beanName,
											'value': 		valueChkArray[i],
											'data-score': 	((scoreChkArray.length > 0) ? scoreChkArray[i] : 0),
											'id': 			chkId
										},
										{
											'for': 	chkId,
											'text': descChkArray[i]
										}
									]
								}
							]
						})[0]
						if (displayMode === 'horizontal') chkRdoElement.classList.value = 'form-check form-check-inline'
						formItemElement.appendChild(chkRdoElement)
					}
					break
				case 'select':
					/** 選項標題 */
					const uiDescSelect 		= formItemElement.dataset.uiDesc || ''
					/** 選項值 */
					const uiValueSelect 	= formItemElement.dataset.uiValue || ''
					const descSelectArray 	= uiDescSelect.split(',')
					const valueSelectArray 	= uiValueSelect.split(',')
					let selectLength        = descSelectArray.length
					if (descSelectArray.length !== valueSelectArray.length) {
						console.error(`選項項目不一致... 建立元件 ${ beanName }失敗...`)
						return false
					}
					const selectElement = createBeanElement({
						'controlType': 	controlType,
						'attribute': 	[
							{
								'id': 		_uuid(),
								'name': 	beanName
							}
						]
					})[0]
					for (let i = 0; i < selectLength; ++i) {
						const optionElement = createBeanElement({
							'controlType': 	'option',
							'attribute': 	[
								{
									'value': 	valueSelectArray[i],
									'text': 	descSelectArray[i],
								}
							]
						})[0]
						selectElement.appendChild(optionElement)
					}
					formItemElement.appendChild(selectElement)
					break
				case 'datetime':
					/** 日期格式 */
					const typeFormat    = formItemElement.dataset.typeFormat || 'yyyy-MM-dd HH:mm:ss'
					/** 日期下限 */
					const minLimit      = formItemElement.dataset.minLimit
					/** 日期上限 */
					const maxLimit      = formItemElement.dataset.maxLimit
					let minDate, maxDate
					if (minLimit) minDate = new Date().setDefaultDate(`{${ minLimit }}`, typeFormat)
					if (maxLimit) maxDate = new Date().setDefaultDate(`{${ maxLimit }}`, typeFormat)
					const datetimeElement = createBeanElement({
						'controlType': 	'text',
						'attribute': 	[
							{
								'class': 				'form-control datetime-default',
								'data-date-time': 		'true', 
								'data-date-format': 	'yyyy-mm-dd hh:ii', 
								'data-date-language': 	'zh-TW', 
								'data-date-autoclose': 	'true', 
								'data-date-today-btn': 	'true',
								'data-date-startdate': 	minDate,
								'date-date-enddate': 	maxDate,
								'readonly': 			'',
								'name': 				beanName,
								'id':					_uuid()
							}
						]
					})[0]
					formItemElement.appendChild(datetimeElement)
					break
				case 'addressTW':
					for (let i = 0; i < 4; i++) {
						const addressElement = createBeanElement({
							'controlType': 	(i === 0 || i === 3) ? 'text' : 'select',
							'attribute': 	[
								{
									'class': 			'form-control address-default',
									'data-is-address': 	'true',
									'id': 				_uuid(),
									'readonly': 		'true',
									'placeholder': 		(i === 0 ? '郵遞區號' : '地址')
								}
							]
						})[0]
						const divElement = createBeanElement({
							'controlType': 'div',
							'attribute': 	[
								{
									'class': 	`col${ i < 2 ? '-2' : ( i === 3 ? ' flex-fill' : '-3') }`
								}
							]
						})[0]
						divElement.appendChild(addressElement)
						formItemElement.appendChild(divElement)
					}
					break
				case 'label':
					const labelElement = createBeanElement({
						'controlType': 	controlType,
						'attribute': 	[
							{
								'draggable': 'true',
								'data-edit': 'true'
							}
						]
					})[0]
					// 自動設定標題 規則：右邊欄位的第一個元件標題
					const rightTableData = container.nextElementSibling
					if (rightTableData !== null && rightTableData.tagName.toLowerCase() === 'td') {
						const beans = rightTableData.querySelectorAll('.pFormItem[data-name]')
						if (beans.length > 0) {
							const title = beans[0].dataset.title
							labelElement.textContent = title
						}
					}
					// 若沒有任何元件則當作標題呈現
					if (container.classList.contains('drop-before')) container.after(labelElement)
					else if (container.classList.contains('drop-after')) container.before(labelElement)
					else {
						const hasBean = container.querySelectorAll('.pFormItem[data-name], .pFormItemGroup[data-name]')
						if (hasBean.length === 0) container.classList.add('table-data-title')
						container.appendChild(labelElement)
					}
					return
				case 'breakLine':
					const breakDiv = createBeanElement({
						'controlType': 	'div',
						'attribute': 	[
							{
								'class': 		'break-line-div',
								'data-edit': 	'true',
								'children':     [
									{
										'br': {}
									}
								]
							}
						]
					})[0]
					if (container.classList.contains('drop-before')) container.after(breakDiv)
					else if (container.classList.contains('drop-after')) container.before(breakDiv)
					else container.appendChild(breakDiv)
					return
				case 'button':
					/** 元件按鈕標題 */
					const buttonText   = formItemElement.dataset.placeholder
					/** 元件按鈕樣式 */
					const style         = formItemElement.dataset.style
					/** 元件提示圖示 */
					const information   = formItemElement.dataset.information
					const buttonElement = createBeanElement({
						'controlType': 	controlType,
						'attribute': 	[
							{
								'type':  	'button',
								'name': 	beanName,
								'text': 	buttonText === undefined ? '按鈕' : buttonText,
								'class': 	style ? style : 'btn btn-primary btn-default',
								'id': 		_uuid()
							}
						]
					})[0]
					if (information) {
						const iconPosition          = formItemElement.dataset.iconPosition
						const informationElement    = createBeanElement({
							'controlType': 'i',
							'attribute': 	[
								{
									'class': information
								}
							]
						})[0]
						if (iconPosition === 'before') buttonElement.prepend(informationElement)
						else buttonElement.appendChild(informationElement)
					}
					formItemElement.appendChild(buttonElement)
					break
				case 'superLink':
				case 'file':
				case 'csCanvas':
					const multiBeans = createBeanElement({
						'controlType': 	controlType,
						'attribute': 	[
							{
								'id': 		_uuid(),
								'onclick': 'return false'
							}
						]
					})[0]
					formItemElement.appendChild(multiBeans)
					break
				case 'iframe':
					const iframeElement = createBeanElement({'controlType': controlType})[0]
					formItemElement.appendChild(iframeElement)
					break
			}
			if (container.classList.contains('drop-before')) container.after(formItemElement)
			else if (container.classList.contains('drop-after')) container.before(formItemElement)
			else container.appendChild(formItemElement)
			// 整理 container
			if (container.innerHTML.indexOf('&nbsp;') === 0) container.innerHTML = container.innerHTML.substring(6)
			if (!container.classList.contains('bean-drop') && 
				container.querySelectorAll('.pFormItem[data-name], .pFormItemGroup[data-name]').length > 0) container.classList.remove('table-data-title')
			if (controlType === 'datetime') {
				const datetimeBeans = container.parentNode.querySelectorAll('.datetime-default')
				datetimeBeans.forEach(bean => bean.value = new Date().format(bean.parentNode.dataset.typeFormat))
			}
			if (controlType === 'addressTW') {
				const addressBeans = container.parentNode.querySelectorAll('.address-default[data-is-address="true"]')
					$(formItemElement).twzipcode32({ },
						{
							zipcode: addressBeans[0].id, 
							county: addressBeans[1].id, 
							district: addressBeans[2].id, 
							address: addressBeans[3].id
						}
					)
			}
		} catch (e) {
			console.error('function generateBean error:' + e)
		}
	}
})();