/** 功能型函數 */
var SharedUtils = {

	/**
	 * 初始化 init 變數
	 */
	initVariable () {
		/** 新增/更新頁初始化頁面 */
		const addPromise = SharedUtils.asyncGetFile('./template/addINIT.html')
		/** 清單頁初始化頁面 */
		const listPromise = SharedUtils.asyncGetFile('./template/listINIT.html')
		/** 列印頁初始化頁面 */
		const printPromise = SharedUtils.asyncGetFile('./template/printINIT.html')
		addPromise.then((resultMsg) => {
			addInit = resultMsg
			appAddInit = resultMsg
		})
		listPromise.then((resultMsg) => {
			listInit = resultMsg
			appListInit = resultMsg
		})
		printPromise.then((resultMsg) => printInit = resultMsg)
	},

	/**
	 * 開啟/關閉線上模式設定
	 * @param {Boolean} start 
	 */
	onlineModeToggle (start = true) {
		/** debug 模式選取方塊 */
		// const debugBox 			= document.querySelector('#debuggerModeToggle')
		/** 線上模式全部元素 */
		const onlineModeElements = document.querySelectorAll('.onlineMode')
		/** 線上模式系統切換 */
		// const dynamicPort 		= document.querySelector('#dynamicPort')
		if (start) {
			onlineMode 			= true
			isTest 				= true
			// debugBox.checked 	= true
			basicParam 			= nursing.createBasicParam()
        	dynamicForm 		= nursing.createDynamicForm()
			onlineModeElements.forEach(element => element.classList.remove('hide'))
			// hospitalName 		= const_gformServiceUrl.split('/')[3]
			// hospitalTitle 		= dynamicPort.querySelector(`option[value="${ const_gformServiceUrl }"]:not(:first-child)`).textContent
			SharedUtils.requestAPIList()
			SharedUtils.requestLocalstorageList()
			// 設定表單樹內的表單雲資料
		} else {
			onlineMode 			= false 
			isTest 				= false
			// debugBox.checked 	= false
			onlineModeElements.forEach(element => element.classList.add('hide'))
			// 人形圖取用本地資料
			dataCsCanvas = $.extend(true, [], dataCsCanvasDefault)
		}
		// 調整左側主要功能清單顯示
		SharedUtils.beansNavDisplay()
	},

	/**
	 * 請求 API 清單並設定至全域變數 APIGFormData
	 * @param {function} successCallback 成功回調
	 * @param {function} errorCallback 失敗回調
	 */
	requestAPIList (successCallback, errorCallback) {
		const gFormJS = nursing.createGForm()
		gFormJS.searchParamGF.status = 'Y'
		gFormJS.searchParamGF.formType = 'propAPIListForm'
		gFormJS.searchParamGF.itemCondition = ''
		gFormJS.getGFormListWithConditionPlus(gFormJS, 
			(result) => {
				// success
				APIModule.apiGFormData = result
				if (successCallback) successCallback(result)
			}, 
			(error) => {
				// error
				CreateUtils.createModal(`alert`, {body: `查詢 propAPIListForm 表單發生錯誤：${ error }`})
				console.error(error)
				if (errorCallback) errorCallback(error)
			}
		)
	},

	/**
	 * 請求本地暫存設定清單
	 * @param {function} successCallback 成功回調
	 * @param {function} errorCallback 失敗回調
	 */
	requestLocalstorageList (successCallback, errorCallback) {
		const gFormJS = nursing.createGForm()
		gFormJS.searchParamGF.status = 'Y'
		gFormJS.searchParamGF.formType = 'propLocalStorage'
		gFormJS.searchParamGF.itemCondition = ''
		gFormJS.getGFormListWithConditionPlus(gFormJS, 
			(result) => {
				// success
				for (let gForm of result) {
					const form 		= gForm.gForm
					const map 		= form.gformItemMap
					map.getValue 	= function (key) { return (this[key]) ? this[key].itemValue : ''}
					localStorageParam = {
						paramName: map.getValue('paramName').split('||,||'),
						remark: map.getValue('remark').split('||,||')
					}
				}
				if (successCallback) successCallback(result)
			}, 
			(error) => {
				// error
				CreateUtils.createModal(`alert`, {body: `查詢 propLocalStorage 表單發生錯誤：${ error }`})
				console.error(error)
				if (errorCallback) errorCallback(error)
		})
	},

    /**
	 * 清除頁面相關資訊(包含元件、畫面)
     * @param {Element} selector
	 */
	clearPage (selector) {
		/** 引入工廠 */
		const factory = window.ComponentFactory
        /** 取得畫布 */
		let drawPage = document.querySelector('#drawPage')
		if (selector instanceof Element) drawPage = selector
		drawPage.classList.add('flex-column')
		drawPage.innerHTML = ''
		factory.clearRegisterComponents()
		listFrame = undefined
		printFrame = undefined
		verificationVersion = []
		SharedUtils.initVariable()
		if (drawPage.id === 'drawPage') beanToListEvent()
		if (drawPage.id === 'queryPage') resetSqlTreeEvent()
	},

	clearAllInterval() {
		clearInterval(timer)
	},

    /**
	 * 移除小提示窗
	 */
	removeToolTip () {
		const toolTip = document.querySelector('[role="tooltip"]')
        if (toolTip) toolTip.remove()
	},

    /**
     * 取得選擇器的表單類型
     * @param {Element} select 
     * @returns {string} formType
     */
    getFormTypeFormSelect (select) {
		const pageData = select.querySelector('div')
		if (pageData === null) return null 
		return pageData.dataset.formType
	},

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
	getAllLocalFormAndBean () {
		const resultList    = []
		const allForm       = window.localStorage
		const regex         = new RegExp(/^formTool+/)
		for (let key in allForm) {
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
	},

    /**
	 * 比對元件是否一致
	 * 若一致回傳 true
	 * 否則回傳不一致的元件陣列
	 * 以 beanTree1 為主要參照對象
	 * @param {Array} beanTree1 
	 * @param {Array} beanTree2
	 * @returns {[mixed Object]} boolean or Array
	 */
	checkingBeanDifferent (beanTree1, beanTree2) {
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
	},

    /**
	 * 左側元件菜單顯示調整
	 * 【依照 data-show-type 進行顯示調整】
	 */
	beansNavDisplay () {
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
	},

    /**
	 * 切換下拉框及輸入框
	 * @param {Event} that 
	 */
	switchSelectAndInput (e) {
		const button 			= e.target.closest('button')
		const container 		= button.parentNode
		const toggleElements 	= container.querySelectorAll('.toggle-switch')
		toggleElements.forEach(element => {
			if (element.classList.contains('hide')) element.classList.remove('hide')
			else element.classList.add('hide')
		})
	},

    /**
	 * 讀取檔案函數
	 * @param {File} file 
     * @returns {Promise} promise
	 */
	readFile (file) {
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
	},

	/**
	 * 將blob檔案轉成base64
	 * @param {blob} blob 
	 * @returns {Promise}
	 */
	blobFileToBase64 (blob) {
		return new Promise((resolve, _) => {
		  const reader = new FileReader()
		  reader.onloadend = () => resolve(reader.result)
		  reader.readAsDataURL(blob)
		})
	},

    /**
	 * 讀取url檔案
	 * @param {String} url 
	 * @returns {Promise} promise
	 */
	asyncGetFile (url) {
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest()
			xhr.open("GET", url)
			xhr.onload = () => resolve(xhr.responseText)
			xhr.onerror = () => reject(xhr.statusText)
			xhr.send();
		})
	},

    /**
	 * 將物件存成檔案並進行下載
	 * @param {String} exportObj 
	 * @param {String} exportName 
	 */
	downloadFile (exportObj, exportName) {
		var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(exportObj);
		var downloadAnchorNode = document.createElement('a');
		downloadAnchorNode.setAttribute("href", dataStr);
		downloadAnchorNode.setAttribute("download", exportName);
		document.body.appendChild(downloadAnchorNode); // required for firefox
		downloadAnchorNode.click();
		downloadAnchorNode.remove();
	},

	/**
	 * 依照表單名稱取得動態表單內容
	 * @param {String} formName 
	 * @param {Function} successCall 
	 */
	getDynamicFormByFormType (formName, successCall) {
		const basicParam = nursing.createBasicParam()
		const dynamicForm = nursing.createDynamicForm()
		const resultObject = {}
		let cb = 0
		dynamicForm.searchParamDF.formType = formName
    	dynamicForm.searchParamDF.versionNo = "999998"
		basicParam.getCurrDynamicFormTemplateV3(dynamicForm, 
			(result) => {
				const formVersion = result[0].basicParam.dynamicFormTemplate
				resultObject.formVersion = formVersion
				callback()
			}, 
			(error) => {
				resultObject.formVersion = ''
				console.error(`getDynamicFormByFormType.getCurrDynamicFormTemplateV3() error: ${ error }`)
				callback()
			}
		)
		dynamicForm.searchParamDF.frameModel = 'gFormWebADD'
		basicParam.getCurrDynamicFormFrameByformTypeFrameModel(dynamicForm, 
			(result) => {
				if (result) resultObject.frame = result.content
				callback()
			}, 
			(error) => {
				resultObject.frame = ''
				console.error(`getDynamicFormByFormType.getCurrDynamicFormFrameByformTypeFrameModel error: ${ error }`)
				callback()
			}
		)
        dynamicForm.searchParamDF.frameModel = 'gFormWebADD_INIT'
		basicParam.getCurrDynamicFormFrameByformTypeFrameModel(dynamicForm, 
			(result) => {
				if (result) resultObject.frameInit = result.content
				callback()
			}, 
			(error) => {
				resultObject.frameInit = ''
				console.error(`getDynamicFormByFormType.getCurrDynamicFormFrameByformTypeFrameModel error: ${ error }`)
				callback()
			}
		)
		function callback() {
			if (++cb < 3) return
			successCall(resultObject)
		}
	},
	
	/**
	 * 線上版本設定表單
	 * @param {Element} selector 
	 * @param {Object} formVersion 
	 * @param {String} formFrame 
	 * @param {String} formInit 
	 */
	setupFromOnlineVersion (selector, formVersion, formFrame, formInit) {
    	/** 引入工廠 */
		const factory 			= window.ComponentFactory
		/** 畫布渲染 */
		selector.innerHTML      = formFrame
		/** 表單腳本初始化 */
        addInit 				= formInit
		/** 取得表單存放資料區 */
		const formDataContainer = selector.querySelector('div')
		/** 表單資料 */
        const formData          = formDataContainer.dataset
		/** 表單名稱賦值 */
        formData.formName       = formVersion.formType
		/** 表單標題賦值 */
        formData.formTitle      = formVersion.formName
		/** 表單類型賦值 */
        formData.formType       = selector.id === 'queryPage' ? 'query' : 'add'
		if (formVersion.apiStructure) {
            if (selector.id === 'queryPage') showQueryList(formVersion.apiStructure)
            else buildAPIModule(formVersion.apiStructure)
        }
		// if (selector.id === 'drawPage') {
        //     // 結構更版 ver 1.0 -> ver 1.5 (更改表頭結構)
        //     const titleBar = selector.querySelector('.title-bar')
		// 	const blockContainer = selector.querySelector('.col-4.block-drop-container')
        //     if (titleBar !== null) {
        //         const titleBlock    = titleBar.querySelector('.title-block')
        //         const titleText     = titleBar.querySelector('.title-bar-text')
        //         const titleButton   = titleBar.querySelector('.title-bar-button')
        //         if (titleBlock === null && titleText !== null || titleButton !== null) {
        //             const blockNode = {
        //                 'div': {
        //                     'class': 'container-fluid row title-block',
        //                     'children': [titleText.convertToJson(), titleButton.convertToJson()]
        //                 }
        //             }
        //             const blockElement = blockNode.createElemental()[0]
        //             titleBar.innerHTML = ''
        //             titleBar.appendChild(blockElement)
        //         }
				
        //     }
        //     // 設定可放置規則
        //     const allTableData = selector.querySelectorAll('td')
        //     allTableData.forEach(td => td.dataset.role = 'drag-drop-container')
		// 	// 左側區塊調整畫面
		// 	if (blockContainer) selector.classList.remove('flex-column')
        // }
		// 註冊標題
		selector.querySelectorAll('label.h6.canEditDiv').forEach(label => label.dataset.edit = true)
		selector.querySelectorAll('.break-line-div').forEach(breakLine => {
			breakLine.dataset.edit = true
			breakLine.setAttribute('draggable', true)
		})
		if (formVersion.verification) verificationVersion = SharedUtils.onionStringDecode(formVersion.verification.replace(/&amp;/g, '&').replace(/&quot;/g,'"'))
		SharedUtils.rebuildComponents(formVersion)
		if (initEditMirror) initEditMirror.getDoc().setValue(formInit)
		if (selector.id === 'queryPage') {
            const resetButton = selector.querySelector('#reset-button')
			const queryBeans  = selector.querySelectorAll('button[data-type="qlButton"],div[data-type="qlSearch"],button[data-type="button"],div[data-type="search"]')
            if (resetButton === null) {
                const searchButton = selector.querySelector('#search-button')
                searchButton.before(CreateUtils.createBeanElement({
                    "controlType": "button",
                    "attribute": [
                        {
                            "class": "btn btn-outline-secondary my-2 my-sm-0",
                            "type": "button",
                            "id": "reset-button",
                            "text": "復原"
                        }
                    ]
                })[0])
            }
			if (queryBeans.length > 0) {
				/** 引入工廠 */
				const factory 		= window.ComponentFactory
				queryBeans.forEach(bean => {
					const type = bean.dataset.type
					const onclickEvent = bean.getAttribute('onclick')
					let component
					switch (type) {
						case 'qlButton':
						case 'button':
							component = factory.createQueryList(`__queryListButton`)
							component.dataset.text = bean.textContent
							component.dataset.style = bean.classList.value
							if (onclickEvent) component.attribute.onclick = onclickEvent
							break
						case 'qlSearch':
						case 'search':
							component = factory.createQueryList(`__queryListSearch`)
							break
					}
					const uid = component.dataset.uid
					component.dataset = Object.assign(component.dataset, bean.dataset)
					component.dataset.uid = uid
					component.modifyAttribute()
					bean.replaceWith(component.fullComponent)
				})
			}
			queryInit = formInit
			initDrawPageEvent()
            initButton()
        } else {
			const allTableData  = selector.querySelectorAll('td')
			allTableData.forEach(td => td.dataset.role = 'drag-drop-container')
			for (let seq in factory.registerComponent) {
				const component = factory.registerComponent[seq]
				if (component.dataset.parent) continue
				component.buildLevelStructure()
				/** 渲染元件 */
				const pageBean = selector.querySelector(`.pFormItem[data-bean="${ component.dataset.name }"], .pFormItemGroup[data-bean="${ component.dataset.name }"]`)
				if (pageBean !== null) pageBean.replaceWith(component.fullComponent)
			}
			beanToListEvent()
			// 畫面事件效果
			initDrawPageEvent(true)
		}
	},

	/** 重構元件 */
	rebuildComponents (templateItem) {
		/** 引入工廠 */
		const factory = window.ComponentFactory
		// checking hashItems and items
		if (!templateItem.hashItems && templateItem.items) {
			templateItem.hashItems = {}
			const dynamicFormItem = templateItem.items.DynamicFormItem
			if (Array.isArray(dynamicFormItem)) {
				for (let items of dynamicFormItem) {
					const beanName = items.name
					templateItem.hashItems[beanName] = items
				}
			} else templateItem.hashItems[dynamicFormItem.name] = dynamicFormItem
		}
		// rebuild component factory
		for (let beanName in templateItem.hashItems) {
            const dynamicItem = templateItem.hashItems[beanName]
            let controlType = dynamicItem.controlType
			let groupChildren
            if (controlType === 'date' || controlType === 'time') controlType = 'datetime'
            else if (controlType === 'csCanvas') controlType = 'humanBody'
			else if (controlType === 'totalScore') controlType = 'score'
			else if (controlType === 'file') controlType = 'fileUpload'
			else if (controlType === 'button' && !dynamicItem.placeholder) dynamicItem.placeholder = ''
			if (controlType === 'group') {
				const groupContainer = document.querySelector(` .pFormItemGroup[data-bean="${ beanName }"]`)
				if (groupContainer) groupChildren = Array.from(groupContainer.children)
			}
            /** 製作元件 */
            const component = factory.create(`__${ controlType }`, beanName, beanName, dynamicItem.title, dynamicItem.children, dynamicItem.children, groupChildren)
			if (component) {
				component.convertDynamicFormItemToComponent(dynamicItem)
				component.modifyAttribute()
			} else console.error('製作元件錯誤。錯誤類型', controlType)
        }
	},

    /**
	 * 整理html文檔排版
	 * @param {String} html 
	 * @returns {String}
	 */
	style_html (html) {
		const option = {
			"indent_size": "4",
			"indent_char": " ",
			"max_preserve_newlines": "5",
			"preserve_newlines": true,
			"keep_array_indentation": false,
			"break_chained_methods": false,
			"indent_scripts": "normal",
			"brace_style": "collapse",
			"space_before_conditional": true,
			"unescape_strings": false,
			"jslint_happy": false,
			"end_with_newline": false,
			"wrap_line_length": "0",
			"indent_inner_html": false,
			"comma_first": false,
			"e4x": false,
			"indent_empty_lines": false
		}
		return html_beautify(html, option)
		// html = html.trim()
		// var result = '',
		// 	indentLevel = 0,
		// 	tokens = html.split(/</)
		// for (var i = 0, l = tokens.length; i < l; i++) {
		// 	var parts = tokens[i].split(/>/)
		// 	if (parts.length === 2) {
		// 		if (tokens[i][0] === '/') {
		// 			indentLevel--
		// 		}
		// 		result += getIndent(indentLevel)
		// 		if (tokens[i][0] !== '/') {
		// 			indentLevel++
		// 		}
		// 		if (i > 0) {
		// 			result += '<'
		// 		}
		// 		result += parts[0].trim() +">\n"
		// 		if (parts[1].trim() !== '') {
		// 			result += getIndent(indentLevel)
		// 			result += parts[1].trim().replace(/\\s+/g, ' ')
		// 			if (parts[2] && parts[2].trim() !== '') {
		// 				result += '>'
		// 				result += parts[2].trim().replace(/\\s+/g, ' ')
		// 			}
		// 			result += "\n"
		// 		}	
		// 		if (parts[0].match(/^(img|hr|br|input)/)) {
		// 			indentLevel--
		// 		}
		// 	} else {
		// 		result += getIndent(indentLevel) + parts[0] + "\n"
		// 	}
		// }
		// return result

		// function getIndent(level) {
		// 	var result = '',
		// 		i = level * 4
		// 	if (level < 0) {
		// 		throw "Level is below 0"
		// 	}
		// 	while (i--) {
		// 		result += ' '
		// 	}
		// 	return result
		// }
	},

	/**
	 * 元件轉置表格綁定
	 * @param {Element} table 
	 * @param {Object} formData
	 */
	bindBeanToTableData (table, formData) {
		const pformItemGroup = table.querySelectorAll('.pFormItemGroup')
		pformItemGroup.forEach(group => {
			const seq = group.dataset.seq
			const component = window.ComponentFactory.getRegisterComponentBySeq(seq)
			if (component) group.replaceWith(component.exportExchange(group)[0])
		})
		if (formData.printFormatDirector === 'portrait' && formData.printFormat === 'report') {
			// 垂直報表列印
			const allTableData = table.querySelectorAll('td')
			allTableData.forEach(td => {
				const pFormItem = td.querySelectorAll('.pFormItem, .pFormItemGroup')
				if (pFormItem.length === 0) return
				td.classList.add('dontCut')
				let divInlineBlock = td.querySelector('.divInlineBlock-group')
				if (!divInlineBlock) {
					divInlineBlock = document.createElement('div')
       				divInlineBlock.classList.add('divInlineBlock-group')
					do {
						divInlineBlock.appendChild(td.firstChild)
					} while (td.hasChildNodes())
					td.appendChild(divInlineBlock)
				}
				pFormItem.forEach(bean => {
					for (let node in bean.dataset) {
						if (node !== 'bean' && node !== 'isBean' && node !== 'name') delete bean.dataset[node]
					}
					bean.dataset.index = "{{gForm.idx}}"
					bean.dataset.formversionid = "{{gForm.formVersionId}}"
				})
				return
			})
		} else {
			// 橫向報表列印,單張列印
			const allTableData = table.querySelectorAll('td')
			allTableData.forEach(td => {
				const pFormItem = td.querySelectorAll('.pFormItem, .pFormItemGroup')
				if (pFormItem.length === 0) return
				if (pFormItem.length > 1 || td.children.length > 1 || td.querySelector(':scope > .divInlineBlock-group')) {
					td.classList.add('dontCut')
					pFormItem.forEach(bean => {
						for (let node in bean.dataset) {
							if (node !== 'bean' && node !== 'isBean' && node !== 'name') delete bean.dataset[node]
						}
						bean.dataset.index = "{{gForm.idx}}"
						bean.dataset.formversionid = "{{gForm.formVersionId}}"
					})
					return
				}
				const bean = pFormItem[0]
				Object.keys(bean.dataset).forEach(dataKey => {
					if (dataKey === 'bean' || dataKey === 'isBean' || dataKey === 'name') td.dataset[dataKey] = bean.dataset[dataKey]
				})
				td.classList.add('pFormItem') 
				td.dataset.index = "{{gForm.idx}}"
				td.dataset.formversionid = "{{gForm.formVersionId}}"
				bean.remove()
			})
		}
	},

	/**
	 * 解構表格上資訊轉置元件
	 * @param {Element} table 
	 */
	deconstructTableData (table) {
		const factory = window.ComponentFactory
		const pFormItemTableData = table.querySelectorAll('td.pFormItem')
		const trWordCountSetting = table.querySelector('tr.trWordCountSetting')
		if (trWordCountSetting) {
			const customizeColWidth = trWordCountSetting.querySelectorAll('.CustomizeColWidth')
			customizeColWidth.forEach(td => {
				if (td.children.length === 0) {
					const childrenDiv = [{
						'div': {
							'class': 'fillWordsCol'
						}
					},
					{
						'div': {
							'class': 'displayCounts'
						}
					}].createElemental()
					childrenDiv.forEach(div => td.appendChild(div))
				}
			})
		}
		pFormItemTableData.forEach(td => {
			const beanName = td.dataset.name || td.dataset.bean
			const component = factory.getRegisterComponentByName(beanName)
			if (!component) return
			td.classList.remove('pFormItem')
			td.appendChild(component.printComponent)
			Object.keys(td.dataset).forEach(dataKey => {
				delete td.dataset[dataKey]
			});
		})
	},

    /**
	 * loading 頁面觸發器 (toggle)
	 * 重複呼叫進行關閉
	 * @param {Boolean} isClose 強制關閉[預設false] 
	 */
	loadingToggle (isClose = false) {
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
	},

    /**
	 * 局部 loading 觸發器
	 * @param {String|Element} target 
	 * @param {Boolean} isClose 強制關閉[預設false] 
	 */
	partialLoading (element, isClose = false) {
		if (!loadingStyle) return false
		const ldsEllipsisParent = element.querySelectorAll('.lds-ellipsis-parent')
		if (isClose) ldsEllipsisParent.forEach(container => container.remove())
		else {
			ldsEllipsisParent.forEach(container => container.remove())
			const loadingElement = loadingStyle.createElemental()[0]
			element.appendChild(loadingElement)
		}
	},

    /**
	 * 遮罩觸發器(toggle)
	 * @param {*} isClose 
	 */
	maskToggle (isClose = false) {
		const mask = document.querySelector('.mask')
		if (mask.classList.contains('hide')) mask.classList.remove('hide')
		else mask.classList.add('hide')
		if (isClose) mask.classList.add('hide')
	},

	/**
	 * 清除全部滑入效果
	 */
	clearHover () {
		const hoverElements = document.querySelectorAll('.hover')
		const dragHover 	= document.querySelectorAll('.drag-hover')
		hoverElements.forEach(element => element.classList.remove('hover'))
		dragHover.forEach(element => element.classList.remove('drag-hover'))
	},

    /**
	 * 清除全部元件的選取狀態
	 */
	clearSelectedElements () {
		const selectedElements 	= document.querySelectorAll('.selected')
		const materialList 		= document.querySelector('#materialList')
		const leftBottomBox 	= document.querySelector('.left-bottom-box')
		if (materialList) materialList.innerHTML  = ''
		leftBottomBox.classList.remove('active')
		selectedElements.forEach(element => {
			const dropContainer = element.querySelectorAll('.bean-drop')
			dropContainer.forEach(container => container.remove())
			element.classList.remove('selected')
		})
	},

    /**
	 * 清除全部表格的選取狀態
	 */
	clearFlexActiveData () {
		const activeData = document.querySelectorAll('.flex-row.active,.flex-row>div.active')
		activeData.forEach(col => col.classList.remove('active','selected'))
	},
    /**
	 * 清除全部表格的選取狀態
	 */
	clearTableActiveData () {
		const activeData = document.querySelectorAll('td.active')
		activeData.forEach(td => td.classList.remove('active'))
	},

	/**
	 * 清除全部表頭的選取狀態
	 */
	clearTableActiveHead () {
		const activeHead = document.querySelectorAll('th.active')
		activeHead.forEach(th => th.classList.remove('active'))
	},

	/**
	 * 清除表格內所有的新增表格按鈕
	 */
	clearTableHoverButton () {
		const plusButtons = document.querySelectorAll('td button.icon.plus, th button.icon.plus')
		plusButtons.forEach(button => button.remove())
	},

    /**
	 * 判斷當前是否處於編輯狀態
	 * @returns {boolean} boolean
	 */
	isEditing () {
		const editBlock = document.querySelector('.focus-edit')
		if (editBlock) return true
		else return false
	},

	/**
	 * 將傳入的內容轉至為formFrame所需要的格式
	 * @param {Object[]} frame 
	 * @param {Object} formData
	 * @param {Boolean} isViewPage
	 * @returns {Boolean|String} null|result
	 */
	convertIntoFormFrame (frame, formData, isViewPage = false) {
		if (!frame || frame.length === 0) return null
		/** 引入工廠 */
		const factory 	= window.ComponentFactory
		/** 輸出字串 */
		let result 		= ''
		/** 表單類型 */
		let formType 	= formData.formType
		/** 處理全部元素相關轉至 */
		frame.forEach(frameObject => {
			/** 物件轉換成元素進行處理 (新增頁需要把全部轉至的元素清除dataset) */
            const elements = frameObject.createElemental({}, false, (!isViewPage && formType === 'add'))
			elements.forEach(element => {
				/** ====== ↓ 處理標題按鈕 ↓ ====== */
				const titleBarButton    = element.querySelector('.title-bar-button, .mobile-fixed')
				if (titleBarButton) {
					const buttons           = titleBarButton.querySelectorAll('button')
					buttons.forEach(button => {
						const buttonText    = button.textContent.trim()
						let clickEvent      = button.getAttribute('onclick')
						switch (buttonText) {
							case '暫存':
								if (isViewPage) clickEvent = 'gFormJS.status=\'N\';viewFormSave(this, function() { changePage("list"); })'
								else if (clickEvent === null) clickEvent = 'addUpd_saveForm(this, \'N\')'
								break
							case '儲存':
								if (isViewPage) clickEvent = 'gFormJS.status=\'Y\';viewFormSave(this, function() { changePage("list"); })'
								else if (clickEvent === null) clickEvent = 'addUpd_saveForm(this, \'Y\')'
								break
							case '新增':
								if (isViewPage) clickEvent = 'clearGFormTemp(); changePage("add")'
								else if (clickEvent === null) clickEvent = 'list_addForm()'
								break
							case '列印':
								clickEvent = 'list_printFormPage()'
								break
							case '返回':
							case '取消':
								if (isViewPage) clickEvent = 'changePage("list")'
								else if (clickEvent === null) clickEvent = 'addUpd_cancelForm()'
								break
						}
						button.setAttribute('onclick', clickEvent) 
					})
				}
				/** ====== ↑ 處理標題按鈕 ↑ ====== */
				/** ====== ↓ 處理人形圖 ↓ ====== */
				const allBeans = element.querySelectorAll('.pFormItem[data-name]')
				allBeans.forEach(bean => {
					const beanName      = bean.dataset.name
					if (!beanName) return false
					const component     = factory.getRegisterComponentByName(beanName)
					if (!component) return false
					const controlType   = component.dataset.controlType
					if (controlType !== 'csCanvas') return false
					// 連動元件
					const templateDiv = {
						"displayMode":  component.dataset.templateDivDisPlayMode,
						"position":     component.dataset.templateDivPosition,
						"isShowDiv":    component.dataset.templateDivIsShowDiv
					}
					bean.removeAttribute('style')
					bean.dataset.controlMode    = component.dataset.controlMode
					bean.dataset.selectMode     = component.dataset.selectMode
					bean.dataset.width          = component.dataset.width
					bean.dataset.height         = component.dataset.height
					bean.dataset.templateDiv    = JSON.stringify(templateDiv)
				})
				/** ====== ↑ 處理人形圖 ↑ ====== */
				result += element.outerHTML
			})
		})
		/** ====== 清單頁處理 ====== */
		if (formType === 'list') {
			/** div 容器 */
            const container         = CreateUtils.createBeanElement({'controlType': 'div'})[0]
            container.innerHTML     = result
            /** 移除清單頁模板 */
            const template          = container.querySelector('#tableListTr_Template')
            if (template) template.remove()
            result         			= container.innerHTML
            const tableBody         = container.querySelector('#tableList tbody')
            const columnCount       = container.querySelectorAll('thead > tr > th').length
            const cloneTableBody    = tableBody.cloneNode(true)
            const buttonBlock       = cloneTableBody.querySelectorAll('.button-block')
            // 修改按鈕事件
            buttonBlock.forEach(block => {
                const buttons = block.querySelectorAll('.btn')
                buttons.forEach(button => {
                    let clickEvent = button.getAttribute('onclick')
                    if (clickEvent) return false
                    const buttonText = button.textContent.trim()
                    switch (buttonText) {
                        case '編輯':
                            clickEvent = 'list_updForm({{idx}});'
                            break
                        case '刪除':
                            clickEvent = 'list_delForm({{idx}});'
                            break
                        case '列印':
                            clickEvent = 'list_printForm({{idx}});'
                            break
                    } 
                    button.setAttribute('onclick', clickEvent)
                })
            })
            // 清單元件編譯成模板語言
            const components = cloneTableBody.querySelectorAll('.web-component')
            components.forEach(component => {
                const type      = component.dataset.type
                const format    = component.dataset.format
                let tplStr = '' 
                switch (type) {
                    case 'serialNumber': // 序號
                        tplStr = '{{ idx + 1 }}'
                        break
                    case 'createTime': // 建立時間
                        tplStr = `{{ dateFormat(gForm.createTime, "${ format }") }}`
                        break
                    case 'creatorName': // 創建者
                        tplStr = `{{ gForm.creatorName }}`
                        break
                    case 'creatorId': // 創建者ID
                        tplStr = `{{ gForm.creatorId }}`
                        break
                    case 'lastUpdTime': // 最後修改日
                        tplStr = `{{ if gForm.modifyTime }}
                                      {{ dateFormat(gForm.modifyTime, "${ format }") }}
                                  {{ else }}
                                      {{ dateFormat(gForm.createTime, "${ format }") }}
                                  {{ /if }}`
                        break
                    case 'lastUpdName': // 最後修改者
                        tplStr = `{{ if gForm.modifyUserName }}
                                      {{ gForm.modifyUserName }}
                                  {{ else }}
                                      {{ gForm.creatorName }}
                                  {{ /if }}`
                        break
                    case 'lastUpdId': // 最後修改者ID
                        tplStr = `{{ if gForm.modifyUserId }}
                                      {{ gForm.modifyUserId }}
                                  {{ else }}
                                      {{ gForm.creatorId }}
                                  {{ /if }}`
                        break
                    case 'status': // 狀態
                        const statusString      = component.dataset.statusArr || ''
                        const statusDescString  = component.dataset.statusDescArr || ''
                        let statusArr           = `['${ statusString.split(',').join("','") }']` // ['Y','N', ...]
                        let statusDescArr       = `['${ statusDescString.split(',').join("','") }']` // ['完成','未完成', ...]
                        tplStr                  = `{{ ${ statusDescArr }[${ statusArr }.indexOf(gForm.status)] }}`
                        break
					case 'currVer': // 版本
						tplStr = `{{ gForm.currVer }}`
						break
					case 'parentVer': // 來源
						tplStr = `{{ gForm.parentVer }}`
						break
                }
                component.replaceWith(tplStr)
            })
            // 編譯gForm元件模板語言
            const beans = cloneTableBody.querySelectorAll('.pFormItem')
            beans.forEach(bean => {
                const beanName                      = bean.dataset.name
                const controlType                   = bean.dataset.controlType
                const beanContainer                 = CreateUtils.createBeanElement({'controlType': 'div', 'attribute': [{'class': 'pFormItem'}]})[0]
                beanContainer.dataset.bean          = beanName
                beanContainer.dataset.index         = '{{ idx }}'
                beanContainer.dataset.formVersionId = '{{ gForm.formVersionId }}'
                if (controlType === 'csCanvas') {
                    // 人形圖
                    beanContainer.dataset.controlMode   = bean.dataset.controlMode
                    beanContainer.dataset.selectMode    = bean.dataset.selectMode
                    beanContainer.dataset.width         = bean.dataset.width
                    beanContainer.dataset.height        = bean.dataset.height
                    beanContainer.dataset.templateDiv   = bean.dataset.templateDiv
                }
                bean.replaceWith(beanContainer)
            })
            // 模版語言( art-template )
            let tpl = `
                <script id="tableListTr_Template" type="text/html">
                {{ if $data.length == 0 }}
                <tr>
                    <td class="text-center" colspan="${ columnCount }">
                        查無資料...
                    </td>
                </tr>
                {{ else }}
                    {{ each $data gForms idx }}
                    {{ set gForm = gForms.gForm }}
            `
            tpl += cloneTableBody.innerHTML
            tpl += `
                    {{ /each }}
                {{ /if }}
                </script>
            `
            result += tpl
		}
		/** ====== 列印頁處理 ====== */
		if (formType === 'print') {
			/** div 容器 */
            const container         = CreateUtils.createBeanElement({'controlType': 'div'})[0]
            container.innerHTML     = result
            let templateString      = ''
            /** 移除清單頁模板 */
            const template          = container.querySelectorAll('.resultTableTemplate')
            for (let i = 0, len = template.length; i < len; ++i) {
                if (!template[i]) break
                template[i].remove()
                i-- 
            }
			const titleButton 		= container.querySelector('.add-title-button')
			const customizeButton 	= container.querySelector('.customize-col-btn')
            const resultTables      = container.querySelectorAll('.resultTable')
			if (titleButton) titleButton.remove()
			if (customizeButton) customizeButton.remove()
            resultTables.forEach(table => {
                const allTableRows          = table.querySelectorAll(':scope > tbody > tr')
				const thead					= table.querySelector(':scope > thead')
                const trWordCountSetting    = table.querySelector(':scope > thead > tr.trWordCountSetting')
                let totalTdCount            = 0
                allTableRows.forEach(tr => {
					const labelTableData 	= tr.querySelectorAll(':scope > td > label.h6') 
                    const tdCount 			= tr.children.length
                    if (tdCount > totalTdCount) totalTdCount = tdCount
					labelTableData.forEach(label => {
						const tableData = label.parentNode
						tableData.classList.add('dontCut')
					})
					if (tr.classList.contains('print-title-row')) thead.appendChild(tr)
                })
				if (trWordCountSetting) {
					const CustomizeColWidth = trWordCountSetting.querySelectorAll('.CustomizeColWidth')
					let tempWordCount = 0
					CustomizeColWidth.forEach(child => {
						child.setAttribute("style", "")
						while (child.firstChild) {
							child.removeChild(child.lastChild)
						}
						child.removeAttribute('width')
						if (formData.printFormatDirector === 'portrait' && formData.printFormat === 'report' && !child.classList.contains('print-title-col')) {
							if (tempWordCount === 0) tempWordCount = child.dataset.wordCount
							child.dataset.wordCount = tempWordCount
						}
					})
				}
                const tbody = table.querySelector('tbody')
				const cloneTbody = tbody.cloneNode(true)
				SharedUtils.bindBeanToTableData(cloneTbody, formData)
				const components = cloneTbody.querySelectorAll('.web-component, .print-component')
				// 列印元件編譯成模板語言
				components.forEach(component => {
					const type      = component.dataset.type
					const format    = component.dataset.format
					let tplStr = '' 
					switch (type) {
						case 'serialNumber': // 序號
							tplStr = '{{ idx + 1 }}'
							break
						case 'createTime': // 建立時間
							tplStr = `{{ dateFormat(gForm.createTime, "${ format }") }}`
							break
						case 'creatorName': // 創建者
							tplStr = `{{ gForm.creatorName }}`
							break
						case 'creatorId': // 創建者ID
							tplStr = `{{ gForm.creatorId }}`
							break
						case 'lastUpdTime': // 最後修改日
							tplStr = `{{ if gForm.modifyTime }}
										  {{ dateFormat(gForm.modifyTime, "${ format }") }}
									  {{ else }}
										  {{ dateFormat(gForm.createTime, "${ format }") }}
									  {{ /if }}`
							break
						case 'lastUpdName': // 最後修改者
							tplStr = `{{ if gForm.modifyUserName }}
										  {{ gForm.modifyUserName }}
									  {{ else }}
										  {{ gForm.creatorName }}
									  {{ /if }}`
							break
						case 'lastUpdId': // 最後修改者ID
							tplStr = `{{ if gForm.modifyUserId }}
										  {{ gForm.modifyUserId }}
									  {{ else }}
										  {{ gForm.creatorId }}
									  {{ /if }}`
							break
						case 'status': // 狀態
							const statusString      = component.dataset.statusArr || ''
							const statusDescString  = component.dataset.statusDescArr || ''
							let statusArr           = `['${ statusString.split(',').join("','") }']` // ['Y','N', ...]
							let statusDescArr       = `['${ statusDescString.split(',').join("','") }']` // ['完成','未完成', ...]
							tplStr                  = `{{ ${ statusDescArr }[${ statusArr }.indexOf(gForm.status)] }}`
							break
						default:
							tplStr = document.createElement('label')
							tplStr.classList.add('h6')
							tplStr.textContent = component.textContent
							break
					}
					component.replaceWith(tplStr)
				})
                // 模版語言( art-template )
                let tpl = `
                    <script class="resultTableTemplate" type="text/html">
                    {{ if $data.length == 0 }}
                    <tr>
                        <td class="text-center" colspan="${ totalTdCount }">查無資料...</td>
                    </tr>
                    {{ else }}
                        {{ each $data gForms idx }}
                `
				if (formData.printFormatDirector === 'portrait' && formData.printFormat === 'report') {
					cloneTbody.childNodes.forEach((tr, index) => {
						tpl += `<tr class="${ tr.classList.value } ${ index === 0 ? '{{if idx != 0 }}pageBreak{{/if}}' : '' }"
									style="${ tr.getAttribute('style') ? tr.getAttribute('style') : '' }">`
						Array.from(tr.children).forEach(td => {
							if (td.classList.contains('print-title-col')) {
								td.classList.add('table-data-title', 'dontCut')
								tpl += td.outerHTML
							}
						})
						tpl += `
									{{each gForms gFormObj}}
						`
						Array.from(tr.children).forEach(td => {
							if (td.querySelector('.divInlineBlock-group')) {
								td.classList.add('dontCut')
								tpl += td.cloneNode(false).outerHTML.substring(0, td.cloneNode(false).outerHTML.length - 5)
								tpl += `
										{{set gForm = gFormObj.gForm}}
										{{if gForm != null}}
								`
								tpl += td.querySelector('.divInlineBlock-group').outerHTML
								tpl += `
										{{else}}&nbsp;{{/if}}
									</td>`
							}
						})
						tpl += `
									{{/each}}
								</tr>
								
						`
					})
				} else {
					tpl += `
							{{ set gForm = gForms.gForm }}
					`
					cloneTbody.childNodes.forEach(tr => {
						if (!tr.classList.contains('print-title-row')) tpl += tr.outerHTML
					})
				}
				tpl += `
                        {{ /each }}
                    {{ /if }}
                    </script>
                `
                templateString += tpl
            })
            result = container.innerHTML
            result += templateString
		}

		if (isViewPage) return result
		return SharedUtils.style_html(result)
	},

	/**
	 * 將工廠內元件轉至並產出formVersion
	 * @param {Object} formData 表單資訊 
	 * @param {Boolean} isXml 是否為Xml 
	 */
	convertIntoFormVersion (formData, isXml = true) {
		/** 引入工廠 */
		const factory   = window.ComponentFactory
		/** 表單名稱 */
		const formName  = formData.formName
		/** 表單標題 */
		const formTitle = formData.formTitle
		/** 動態表單元件陣列 */
		const dynamicFormItem = []
		for (let seq in factory.registerComponent) {
			// 各元件製作模板
			const component = factory.registerComponent[seq]
			dynamicFormItem.push(component.convertToDynamicFormItem())
		}
		/** 動態表單模板物件 */
		const items = {
			"DynamicFormTemplate": {
				"formName":     formTitle,
				"formType":     formName,
				"formModel":    formName,
				"ditto":        true,
				"version":      0,
				"items":        {"DynamicFormItem": dynamicFormItem}
			}
		}
		if (verificationVersion && verificationVersion.length > 0) 
			items.DynamicFormTemplate.verification = JSON.stringify(verificationVersion)
		// setting api list
		const apiStructureTpl = {
			gFormWebADD: [],
			gFormWebLIST: [],
			gFormWebPRINT: []
		}
		for (let seq in APIModule.registerAPIComponents) {
			const component = APIModule.registerAPIComponents[seq]
			if (!apiStructureTpl[component.formType]) apiStructureTpl[component.formType] = []
			apiStructureTpl[component.formType].push(component.exportData())
		}
		items.DynamicFormTemplate.apiStructure = JSON.stringify(apiStructureTpl).replace(/&/g, '&amp;').replace(/"/g,'&quot;')
		if (isXml) return items.toXml()
		else return items
	},

	convertIntoOldFormVersion (formData, isXml = true) {
		/** 引入工廠 */
		const factory   = window.ComponentFactory
		/** 表單名稱 */
		const formName  = formData.formName
		/** 表單標題 */
		const formTitle = formData.formTitle
		/** 動態表單元件陣列 */
		const dynamicFormItem = []
		for (let seq in factory.registerComponent) {
			// 各元件製作模板
			const component = factory.registerComponent[seq]
			dynamicFormItem.push(component.convertToOldDynamicFormItem())
		}
		/** 動態表單模板物件 */
		const items = {
			"DynamicFormTemplate": {
				"formName":     formTitle,
				"formType":     formName,
				"items":        {"DynamicFormItem": dynamicFormItem}
			}
		}
		if (isXml) return items.toXml()
		else return items
	},

    /**
	 * 解構字串
	 * @param {object|string} jsonString 
	 */
	onionStringDecode (jsonString) {
		try {
			if (typeof jsonString === 'string') return this.onionStringDecode(JSON.parse(jsonString))
			else if (typeof jsonString === 'object') return jsonString
		} catch (e) { 
			return jsonString
		}
		return null
	},

    /**
	 * RGBA轉換器
	 * @param 	{String} color_value 	[rgba(0,0,0,0)] 
	 * @returns {String} hex 			[#000000]
	 */
	rgba2hex (color_value) {
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
	},

    /**
	 * UUID產生器
	 * @returns {String} [UUID]
	 */
	_uuid (stringLength = 36) {
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
	},

    /**
     * 取消各種事件重複點擊或重疊元素點擊效果
     * @param {Event} e 
     * @returns {boolean} boolean
     */
    cancelDefault (e) {
		e.preventDefault()
		e.stopPropagation()
		return false
	}
}