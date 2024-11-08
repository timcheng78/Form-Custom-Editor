(function() {
	beforeOnload()
	initBaseLayout()
	initBaseBean()
	initButton()
})()

/**
 * CS-Form 初始化
 * ==================
 * 重新整理顯示提示(防止未儲存進行重新整理)\
 * 複製貼上刪除按鍵 Binding\
 * 左側 menu 動態事件(收縮、滑動)\
 * 各種模式切換(線上、debug)、切換 port、清除暫存數據\
 * 獲取預設動態表單初始化腳本\
 * 設定本地表單樹的元件進入表單樹內
 */
function beforeOnload() {
	// 重新整理提示
	window.onbeforeunload = function(e) {
		const drawPage = document.querySelector('#drawPage')
		if (drawPage && drawPage.innerHTML.length > 0) return false
		return null
	}
	// 複製貼上刪除綁定事件
	document.addEventListener('copy', copyElementEvent)
	document.addEventListener('paste', pasteElementEvent)
	document.addEventListener('keydown', pageKeydownEvent)
	/** 左側清單元素 */
	const leftMenu 		= document.querySelector('#leftMenu')
	/** 左側上方區塊元素 */
	const leftTopBox 	= document.querySelector('.left-top-box')
	/** 左側下方區塊元素 */
	const leftBottomBox = document.querySelector('.left-bottom-box')
	/** 線上模式選取方塊 */
	// const onlineBox 	= document.querySelector('#onlineMode')
	/** debug 模式選取方塊 */
	// const debugBox 		= document.querySelector('#debuggerModeToggle')
	/** 切換連接埠下拉選單 */
	const dynamicPort 	= document.querySelector('#dynamicPort')
	/** 清除本地暫存數據 */
	const cleanLocalBtn = document.querySelector('#cleanLocalBtn')
	leftMenu.addEventListener('mouseenter', leftMenuHover)
	leftMenu.addEventListener('mousemove', leftMenuHover)
	leftMenu.addEventListener('mouseleave', leftBoxHover)
	leftMenu.addEventListener('click', leftMenuClick)
	leftTopBox.addEventListener('mouseenter', leftBoxHover)
	leftTopBox.addEventListener('mousemove', leftBoxHover)
	leftTopBox.addEventListener('click', leftMenuClick)
	leftBottomBox.addEventListener('mousemove', leftBoxHover)
	leftBottomBox.addEventListener('mousemove', leftBoxHover)
	leftBottomBox.addEventListener('click', leftMenuClick)
	// debugBox.addEventListener('change', debugModeToggle)
	dynamicPort.addEventListener('change', debugPortChanged)
	dynamicPort.children[0].value = const_gformServiceUrl
	// onlineBox.addEventListener('change', onlineModeToggle)
	cleanLocalBtn.addEventListener('click', cleanLocalStorage)
	SharedUtils.initVariable()
	initEditMirror = CodeMirror.fromTextArea(document.querySelector('#codemirror'), {
		mode: 'javascript',
		lineNumbers: true,
		theme: 'abcdef'
	});
	window.template = new TemplateModule()
	// new ToolPackModule()
	// 設定本地表單樹的元件進入表單樹內
	// settingLocalFormTemplate()
	// 判斷系統是否為轉址使用
	gettingUrlFormType()

	/** ================ 下方皆為函數 ================ */

	/**
	 * 設定本地表單樹模板
	 * ※需調整※
	 */
	function settingLocalFormTemplate() {
		/** 本地全部表單清單 */
		const formList = SharedUtils.getAllLocalFormAndBean()
		/** 表單樹區塊元素 */
		const $beanTreeList = $('#bean-tree-list')
		/** (全域) 全部表單 */
		window.allFormList = formList
		if (formList.length > 0) { 
			// 組合表單樹結構所需節點
			formList.forEach(form => {
				const beanList 		= form.beanList
				const localBeanList = []
				for (let key in beanList) {
					const beanObject = {
						text: 			beanList[key].title,
						type: 			beanList[key].controlType,
						value: 			key,
						default: 		false,
						structure: 		beanList[key].structure,
						information: 	beanList[key],
						draggable: 		true,
						onclick: 		''	
					}
					localBeanList.push(beanObject)
				}
				const treeNode = {
					text: 	form.formTitle,
					type: 	"form",
					value: 	form.formName,
					nodes: 	localBeanList
				}
				beanTreeStructure[1].nodes.push(treeNode)
			})
			
			$beanTreeList.html('').data('plugin_bstreeview', null)
			$beanTreeList.bstreeview({data: beanTreeStructure})
			initButton()
		}
	}

	/**
	 * 左側菜單滑入效果
	 * @param {Event} e 
	 */
	function leftMenuHover(e) {
		if (e.target === leftMenu) e.target.classList.add('hover')
	}

	/**
	 * 左側區塊滑入效果
	 * @param {Event} e 
	 */
	function leftBoxHover(e) {
		leftMenu.classList.remove('hover')
	}

	/**
	 * 左側菜單點擊縮放效果
	 * @param {Event} e 
	 */
	function leftMenuClick(e) {
		if (e.target === leftTopBox || e.target === leftBottomBox || e.target === leftMenu) {
			if (leftMenu.classList.contains('active'))
				leftMenu.classList.remove('active')
			else 
				leftMenu.classList.add('active')
			leftBoxHover(e)
		}
	}

	/**
	 * debug 模式切換
	 * =
	 * 影響匯出表單[關閉則不會匯出表單至動態表單]
	 * 
	 * 人形圖切換
	 * @param {Event} e 
	 */
	function debugModeToggle(e) {
		if (e.target.checked) {
			dynamicPort.classList.remove('hide')
			isTest = true
			// 人形圖取用線上資料
			setCsCanvasOnlineData()
		} else {
			dynamicPort.classList.add('hide')
			isTest = false
			// 人形圖取用本地資料
			dataCsCanvas = $.extend(true, [], dataCsCanvasDefault)
		}
	}

	/**
	 * port 切換
	 * @param {Event} e 
	 */
	function debugPortChanged(e) {
		const_gformServiceUrl = e.target.value
		hospitalName = const_gformServiceUrl.split('/')[3]
		hospitalTitle = e.target.querySelector(`option[value="${ const_gformServiceUrl }"]:not(:first-child)`).textContent
		// 人形圖取用線上資料
		setCsCanvasOnlineData()
		SharedUtils.requestAPIList()
		SharedUtils.requestLocalstorageList()
	}

	/**
	 * 線上模式切換
	 * =
	 * switch on => 開啟 debug 模式\
	 * switch off => 關閉 debug 模式\
	 * 啟用線上模式將會開啟
	 *  > 人形圖線上資料
	 * 
	 *  > 表單雲載入
	 * 
	 * @param {Event} e 
	 */
	function onlineModeToggle(e) {
		if (e.target.checked) SharedUtils.onlineModeToggle(true)
		else SharedUtils.onlineModeToggle(false)
	}

	/**
	 * 清空本地暫存數據
	 * @param {Event} e 
	 */
	function cleanLocalStorage(e) {
		CreateUtils.createModal(`confirm`, {
			'title':    `警告`,
			'body':     `確定要清除嗎？(清除後無法復原)`,
			'callback': function(result) {
				if (result) {
					const allForm 	= window.localStorage
					const regexTool = new RegExp(/^formTool+/)
					const regexUUID = new RegExp(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)
					for (let key in allForm) {
						if (regexTool.test(key)) {
							allForm.removeItem(key)
							continue
						}
						if (regexUUID.test(key)) {
							allForm.removeItem(key)
							continue
						}
					}
					allForm.removeItem('clipboard')
					return true
				}
			}
		})
	}

	/**
	 * 取得網址列表單名稱	
	 */
	function gettingUrlFormType() {
		/** 引入工廠 */
		const factory 	= window.ComponentFactory
		/** API列表 */
		const apiList       = document.querySelector('#api-list-list')
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
		/** 目錄主鍵 */
		// dircataId = url.searchParams.get("dircataId")
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
		
		if (!templateId) return
		fileModeTest = true
		const p = TemplateModule.getSingleTemplate(templateId)
		SharedUtils.loadingToggle()
		p.then(result => {
			let needDraw = false
			if (result.data) {
				if (window.template) template = new TemplateModule(result.data)
				template.container.operation = operation
				template.container.templates = result.data.templates
				const templateObject = template.container.getTemplateByType('add')
				if (templateObject) {
					const content = templateObject.content
					const toolFrame = content.toolFrame.createElemental()
					const formFrame = content.formFrame
					let apiStructure = content.apiStructure
					// isCodeControl = content.isCodeControl === 'true' || content.isCodeControl === true ? true : false
					addInit = content.initFrame
					const components = content.components
					toolFrame.forEach(frame => drawPage.appendChild(frame))
					components.forEach(component => {
						component.seq = component.dataset.seq
						factory.assign(component)
					})
					const containerComponent = drawPage.querySelectorAll('.container-component')
					containerComponent.forEach(component => {
						factory.mergeLayoutComponent(component)
					})
					for (let seq in factory.registerComponent) {
						const component = factory.registerComponent[seq]
						component.structureExtraction()
						if (component.dataset.parent) continue
						component.buildLevelStructure()
						/** 渲染元件 */
						const pageBean = drawPage.querySelector(`.pFormItem[data-bean="${ component.dataset.name }"], .pFormItemGroup[data-bean="${ component.dataset.name }"]`)
						if (pageBean !== null) pageBean.replaceWith(component.fullComponent)
					}
					if (isCodeControl) {
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
							drawPage.classList.add('hide')
							codeBlock.classList.remove('hide')
							frameEditMirror.getDoc().setValue(formFrame)
						}, 500)
					}
					if (initEditMirror) initEditMirror.getDoc().setValue(addInit)
					if (apiStructure) {
						if (typeof apiStructure === 'string') {
							try {
								apiStructure = SharedUtils.onionStringDecode(apiStructure)
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
				} else needDraw = true
			} else needDraw = true
			if (needDraw) {
				if (!window.template) window.template = new TemplateModule()
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
				pageContainer.forEach(page => drawPage.appendChild(page))
				if (initEditMirror) initEditMirror.getDoc().setValue(addInit)
			}
			const formData = drawPage.querySelector('div')
			const version = formData.dataset.formToolVersion
			const versionModule = new VersionModule({frameElement: drawPage, initContent: addInit, version: version})
			versionModule.then((bol) => {
				// resolve
				SharedUtils.loadingToggle(true)
			}, (bol) => {
				// reject
				SharedUtils.loadingToggle(true)
			})
			beanToListEvent()
			initDrawPageEvent(true)
		})
		.catch(error => {
			console.log(error)
		})
		const p2 = TemplateModule.getAllTemplates({hospitalName: hospitalName, template_type: 'GForm'})
		p2.then(result => {
			formVersionList = []
			if (result.code === 0 && result.data) {
				result.data.forEach(template => {
					if (formVersionList.some(e => e.formType === template.template_name)) return
					formVersionList.push({
						formType: template.template_name,
						title: template.template_title
					})
				})
			}
		})
		.catch(error => {
			console.error(error)
		})
	}

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
			initEditDiv()
		},
		items: {
			"editTable": {name: "編輯表頭", icon: "bi bi-pencil"},
		}
	});
}

/**
 * 初始化布局相關
 */
function initBaseLayout() {
	try {
		/** 基礎元件區塊 */
		const baseLayoutContent = document.querySelector('#base-layout-content')
		/** 暫存節點物件 */
		let node
		/** 基礎元件清單 */
		const layoutComponents = window.ComponentFactory.layoutComponent
		// 基礎元件
		for(let components in layoutComponents) {
			const component = layoutComponents[components]
			node = CreateUtils.createBeanElement({
				'controlType': 'button',
				'attribute': [
					{
						'draggable': 'true',
						'type': 'button',
						'class': 'btn btn-outline-info',
						'data-role': 'layout',
						'value': component.dragName,
						'text': `${component.dragDescription}(${component.dragName})`
					}
				]
			})[0]
			baseLayoutContent.append(node, '\n')
		}
	} catch (e) {
		CreateUtils.createModal(`alert`, {body: errorCodeDescription.ED0001})
		console.error(`error: ${ e }`)
	}
}
/**
 * 初始化元件相關
 * =
 *  > 基礎元件\
 *  > 清單元件\
 *  > 預設元件\
 *  > 列印元件 (尚未實作)
 */
function initBaseBean() {
	try {
		/** 基礎元件區塊 */
		const baseBeanContent = document.querySelector('#base-bean-content')
		/** 清單元件區塊 */
		const listBeanContent = document.querySelector('#list-bean-content')
		/** 列印元件區塊 */
		const printBeanContent = document.querySelector('#print-bean-content')
		/** 預設元件區塊 */
		const $defaultBeanList = $('#default-bean-list')
		/** 暫存節點物件 */
		let node
		/** 基礎元件清單 */
		const baseComponents = window.ComponentFactory.baseComponent
		/** 清單元件清單 */
		const listComponents = window.ComponentFactory.listComponent
		/** 列印元件清單 */
		const printComponents = window.ComponentFactory.printComponent
		// 基礎元件
		for(let components in baseComponents) {
			const component = baseComponents[components]
			node = CreateUtils.createBeanElement({
				'controlType': 	'button',
				'attribute': 	[
					{
						'draggable': 	'true',
						'type':  		'button',
						'class': 		'btn btn-outline-info',
						'value': 		component.dragName,
						'text': 		`${ component.dragDescription }(${ component.dragName })`
					}
				]
			})[0]
			baseBeanContent.append(node, '\n')
		}
		// 清單元件
		for(let components in listComponents) {
			const component = listComponents[components]
			node = CreateUtils.createBeanElement({
				'controlType': 	'button',
				'attribute': 	[
					{
						'draggable': 		'true',
						'type':  			'button',
						'class': 			'btn btn-outline-info',
						'value': 			component.dragName,
						'text': 			component.dragDescription,
						'data-ele-role':	'list'
					}
				]
			})[0]
			listBeanContent.append(node, '\n')
		}
		for (let components in printComponents) {
			const component = printComponents[components]
			node = CreateUtils.createBeanElement({
				'controlType': 	'button',
				'attribute': 	[
					{
						'draggable': 		'true',
						'type':  			'button',
						'class': 			'btn btn-outline-info',
						'value': 			component.dragName,
						'text': 			component.dragDescription,
						'data-ele-role': 	'print'
					}
				]
			})[0]
			printBeanContent.append(node, '\n')
		}
		// 預設元件
		// if (defaultWebComponent === undefined || zhDefaultWebComponent === undefined || typeDefaultWebComponent === undefined || structureDefaultWebComponent === undefined) throw "not defined"
		// for (let bean in defaultWebComponent) {
		// 	node = {
		// 		'controlType': 'button',
		// 		'attribute': 	[
		// 			{
		// 				'draggable': 		'true',
		// 				'type':  			'button',
		// 				'class': 			'btn btn-outline-info',
		// 				'value': 			defaultWebComponent[bean],
		// 				'text': 			zhDefaultWebComponent[defaultWebComponent[bean]],
		// 				'data-type': 		typeDefaultWebComponent[defaultWebComponent[bean]],
		// 				'data-count': 		'0',
		// 				'data-default': 	'true',
		// 				'data-structure': 	structureDefaultWebComponent[defaultWebComponent[bean]]
		// 			}
		// 		]
		// 	}
		// 	$defaultBeanList.append(CreateUtils.createBeanElement(node)).append('\n')
		// }
		// 列印元件
	} catch (e) {
		CreateUtils.createModal(`alert`, {body: errorCodeDescription.ED0001})
		console.error(`error: ${ e }`)
	}
}

/**
 * 初始化按鈕相關事件 
 * =
 */
function initButton() {
	/** 全部可拖動元素 */
	const dragSources 		= document.querySelectorAll('[draggable="true"]')
	/** Api 清單 */
	const apiRow 			= document.querySelectorAll('#api-list-list .list-group-item')
	/** 工具包按鈕 */
	const toolPackBtn 		= document.querySelector('#toolPack')
	/** 合併欄位按鈕 */
	const combineBtn  		= document.querySelector('#combineCell')
	/** 解除合併欄位按鈕 */
	const disassembleBtn 	= document.querySelector('#disassemble')
	/** 移除按鈕 */
	const deleteBeanBtn 	= document.querySelector('#deleteBean')
	/** 腳本按鈕 */
	const scriptBtn 		= document.querySelector('#scriptBtn')
	/** 計分按鈕 */
	const scoreBtn 			= document.querySelector('#scoreBtn')
	/** 群組按鈕 */
	const groupUpBtn 		= document.querySelector('#groupUpBtn')
	/** 解除群組按鈕 */
	const groupDownBtn 		= document.querySelector('#groupDownBtn')
	/** 複製按鈕 */
	const copyBtn 			= document.querySelector('#copyBtn')
	/** 貼上按鈕 */
	const pasteBtn 			= document.querySelector('#pasteBtn')
	/** 預設元件查詢下拉框 */
	const searchSelect 		= document.querySelector('#search-type')
	/** 匯入元件樹按鈕 */
	const importBeanBtn 	= document.querySelector('#bean-tree-import-btn')
	/** 刷新元件樹按鈕 */
	// const reloadTreeBtn 	= document.querySelector('#bean-tree-reload-btn')
	/** 元件樹查詢輸入框 */
	const searchBox 		= document.querySelector('#bean-tree-search-box')
	/** 元件樹上傳元素 */
	const fileUploadChg 	= document.querySelector('#bean-tree-file')
	/** Api 清單查詢按鈕 */
	const searchApiSelect 	= document.querySelector('#api-list-search-btn')
	/** Api 新增按鈕 */
	const apiAddBtn 		= document.querySelector('#api-list-add-btn')
	/** 腳本清單按鈕 */
	const initBtn 			= document.querySelector('#initBtn')
	try {
		dragSources.forEach(dragSource => {
			// 非元件拖曳存入屬性不同
			if (dragSource.dataset.isBean === undefined && !dragSource.classList.contains('container-component')) 
				dragSource.addEventListener('dragstart', dragStart)
			else if (dragSource.dataset.isBean === 'Y')
				dragSource.addEventListener('dragstart', dragBeanStart)
		})
		apiRow.forEach(row => {
			row.addEventListener('click', addApiScript)
		})
		toolPackBtn.addEventListener('click', toolPackTrigger)
		toolPackBtn.addEventListener('dragstart', toolPackDragstart)
		document.body.addEventListener('dragover', (e) => e.preventDefault());
		document.body.addEventListener('drop', toolPackDropped)
		combineBtn.addEventListener('click', tableSpan)
		disassembleBtn.addEventListener('click', disassembleCell)
		deleteBeanBtn.addEventListener('click', deleteSelectedBean)
		scoreBtn.addEventListener('click', scoreScript)
		groupUpBtn.addEventListener('click', groupBean)
		groupDownBtn.addEventListener('click', unGroupBean)
		scriptBtn.addEventListener('click', addScript)
		copyBtn.addEventListener('click', copyElementEvent)
		pasteBtn.addEventListener('click', pasteElementEvent)
		searchSelect.addEventListener('change', searchDefaultBean)
		importBeanBtn.addEventListener('click', importBeanTree)
		// reloadTreeBtn.addEventListener('click', setFormCloudTree)
		searchBox.addEventListener('change', searchBeanTree)
		fileUploadChg.addEventListener('change', fileUploadEvent)
		searchApiSelect.addEventListener('click', apiSearchEvent)
		apiAddBtn.addEventListener('click', addApiScript)
		initBtn.addEventListener('click', foldTriggerInit)
	} catch (e) {
		CreateUtils.createModal(`alert`, {body: errorCodeDescription.ED0002})
		console.error(`error: ${ e }`)
	}
	
}

/**
 * 頁面拖拉事件綁定
 * =
 */
function initDrawPageEvent(firstInit = false) {
	/** 全部表格 */
	// const tables 			= document.querySelectorAll('#drawPage .table')
	/** 表格全部列 */
	const tableRow 			= document.querySelectorAll('#drawPage .table tbody tr')
	/** 表格全部資料格 */
	const tabledata 		= document.querySelectorAll('#drawPage .table tbody td')
	/** 表格全部標題格 */
	const tablehead 		= document.querySelectorAll('#drawPage .table tbody th')
	/** 列印頁表格 */
	const printResultTable 	= document.querySelectorAll('#drawPage .resultTable tbody td, #drawPage .resultTable tbody th')
	/** 頁籤對應容器 */
	const tableSelect 		= document.querySelectorAll('#tabContent .tab-pane, #drawPage #listContent')
	/** 可編輯元素 (包含元件、非元件) */
	const beans 			= document.querySelectorAll('[data-edit="true"]')
	/** 可編輯清單元素 */
	const listBeans 		= document.querySelectorAll('[data-web-component="list"]')
	/** 可編輯列印元素 */
	const printBeans 		= document.querySelectorAll('[data-web-component="print"]')
	/** 頁籤超連結元素 */
	const navLink  			= document.querySelectorAll('#drawPage .nav-link')
	/** 頁籤項目元素 */
	const navItem 			= document.querySelectorAll('#drawPage .nav-item')
	/** 畫面上選取的元素 */
	const selectedElement 	= document.querySelectorAll('div.selected')
	/** 新增頁籤按鈕 */
	const plusBtn 			= document.querySelector('#plus-tab')
	/** 表頭區塊 */
	const formTitle 		= document.querySelector('.form-title-div')
	/** 頁籤展開縮放觸發器 */
	const menuToggle 		= document.querySelector('.tab-menu-toggle')
	/** 表頭開關 */
	const headSwitch 		= document.querySelector('#headSwitch')
	/** 程式碼切換 */
	const codeSwitch 		= document.querySelector('#codeSwitch')
	/** 結構檢查開關 */
	const pluginSwitch 		= document.querySelector('#pluginSwitch')
	/** 布局全部資料格 */
	// const flexLayout 		= document.querySelectorAll('#drawPage .d-flex.flex-column > .flex-row')
	try {
		if (selectedElement.length > 0) beanFocusStopDrop(false)
		else beanFocusStopDrop(true)
		// tables.forEach(table => {
		// 	new TableModule({tableSelector: table})
		// })
		// flexLayout.forEach(flexRowSource => {
		// 	flexRowSource.addEventListener('click', flexRowSelect)
		// 	for (let flexColSource of flexRowSource.children) {
		// 		flexColSource.addEventListener('mouseenter', flexColMouseEnter)
		// 		flexColSource.addEventListener('mousemove', flexColMouseMove)
		// 		flexColSource.addEventListener('mouseleave', flexColMouseLeave)
		// 		flexColSource.addEventListener('click', flexColSelect)
		// 	}
		// })
		tabledata.forEach(tableSource => {
			tableSource.addEventListener('mouseenter', tableMouseEnter)
			tableSource.addEventListener('mousemove', tableMouseMove)
			tableSource.addEventListener('mouseleave', tableMouseLeave)
			tableSource.addEventListener('click', tdSelect)
		})
		tablehead.forEach(tableSource => {
			tableSource.addEventListener('mouseenter', tableMouseEnter)
			tableSource.addEventListener('mousemove', tableMouseMove)
			tableSource.addEventListener('mouseleave', tableMouseLeave)
			tableSource.addEventListener('click', thSelect)
		})
		tableRow.forEach(rowSource => {
			rowSource.addEventListener('mouseenter', rowMouseEnter)
			rowSource.addEventListener('mousemove', rowMouseMove)
			rowSource.addEventListener('mouseleave', rowMouseLeave)
			rowSource.addEventListener('click', rowSelect)
		})
		printResultTable.forEach(tableSource => {
			tableSource.addEventListener('mouseenter', tableMouseEnter)
			tableSource.addEventListener('mousemove', tableMouseMove)
			tableSource.addEventListener('mouseleave', tableMouseLeave)
			tableSource.addEventListener('click', tdSelect)
		})
		tableSelect.forEach(tabDivSource => {
			tabDivSource.addEventListener('click', drawPageClick)
		})
		beans.forEach(beanSource => {
			beanSource.addEventListener('click', elementSelected)
			beanSource.addEventListener('mouseenter', elementHover)
			beanSource.addEventListener('mousemove', elementHover)
			beanSource.addEventListener('mouseleave', elementLeave)
		})
		listBeans.forEach(beanSource => {
			beanSource.addEventListener('click', listElementSelected)
			beanSource.addEventListener('mouseenter', elementHover)
			beanSource.addEventListener('mousemove', elementHover)
			beanSource.addEventListener('mouseleave', elementLeave)
		})
		printBeans.forEach(beanSource => {
			beanSource.addEventListener('click', printElementSelected)
			beanSource.addEventListener('mouseenter', elementHover)
			beanSource.addEventListener('mousemove', elementHover)
			beanSource.addEventListener('mouseleave', elementLeave)
		})
		navLink.forEach(nav => {
			if (nav === plusBtn) return
			nav.addEventListener('click', showTab)
		})
		navItem.forEach(nav => {
			if (nav.childNodes.length > 0 && nav.childNodes[0] === plusBtn) return
			nav.addEventListener('contextmenu', removeTab)
		})
		if (formTitle) {
			headSwitch.parentNode.classList.remove('hide')
			if (formTitle.classList.contains('closed')) headSwitch.checked = false
			else headSwitch.checked = true
		} else {
			headSwitch.parentNode.classList.add('hide')
			headSwitch.checked = false
		}
		headSwitch.addEventListener('click', togglePageHead)
		codeSwitch.addEventListener('click', toggleCodeOrReview)
		pluginSwitch.addEventListener('change', (e) => e.target.checked ? structurePass = true : structurePass = false)
		if (plusBtn) plusBtn.addEventListener('click', addTabs)
		if (menuToggle) menuToggle.addEventListener('click', function (e) {
			this.parentNode.classList.toggle('active')
		})
	} catch (e) {
		CreateUtils.createModal(`alert`, {body: errorCodeDescription.ED0003})
		console.error(`error: ${ e }`)
	}
	if (firstInit) SharedUtils.beansNavDisplay()
	initEditDiv()
}

/**
 * 元件放置位置觸發器
 * =
 * true => 將表格拖拉開啟，關閉元件拖拉\
 * false => 將元件拖拉開啟，關閉表格拖拉
 * @param {Boolean} trigger 
 */
 function beanFocusStopDrop(trigger) {
	/** 拖曳後放置容器 (表格) */
	const dropSources 		= document.querySelectorAll('[data-role="drag-drop-container"]')
	/** 拖曳後放置容器 (元件內) */
	const beanDropSources 	= document.querySelectorAll('[data-role="drag-drop-container-bean"]')
	/** 頁籤元素 */
	const navItems 			= document.querySelectorAll('#tabs a.nav-link[role="tab"]')
	try {
		// 觸發器開啟 - 表格開放容器放置元件
		if (trigger) {
			dropSources.forEach(dropSource => {
				dropSource.addEventListener('drop', dropped)
				dropSource.addEventListener('dragenter', dropEnter)
				dropSource.addEventListener('dragover', dropOver)
				dropSource.addEventListener('dragleave', dropLeave)
			})
			beanDropSources.forEach(beanDropSource => {
				beanDropSource.removeEventListener('drop', dropped)
				beanDropSource.removeEventListener('dragenter', dropEnter)
				beanDropSource.removeEventListener('dragover', dropOver)
				beanDropSource.removeEventListener('dragleave', dropLeave)
			})
		// 觸發器關閉 - 元件開放容器放置元件
		} else {
			dropSources.forEach(dropSource => {
				dropSource.removeEventListener('drop', dropped)
				dropSource.removeEventListener('dragenter', dropEnter)
				dropSource.removeEventListener('dragover', dropOver)
				dropSource.removeEventListener('dragleave', dropLeave)
			})
			beanDropSources.forEach(beanDropSource => {
				beanDropSource.addEventListener('drop', dropped)
				beanDropSource.addEventListener('dragenter', dropEnter)
				beanDropSource.addEventListener('dragover', dropOver)
				beanDropSource.addEventListener('dragleave', dropLeave)
			})
		}
		navItems.forEach(navItem => navItem.addEventListener('dragenter', dropEnter))
	} catch (e) {
		CreateUtils.createModal(`alert`, {body: errorCodeDescription.ED0004})
		console.error(`error: ${ e }`)
	}
}

/**
 * 標題表頭收縮觸發器
 * =
 * @param {Event} e 
 */
function togglePageHead(e) {
	/** 標題列 */
	const formTitle = document.querySelector('.form-title-div')
	if (formTitle !== null && e.target.checked) formTitle.classList.remove('closed')
	else if (formTitle !== null && !e.target.checked) formTitle.classList.add('closed')
}

/**
 * 切換程式碼呈現及畫面呈現
 * @param {*} e 
 */
function toggleCodeOrReview(e) {
	SharedUtils.clearTableHoverButton()
	const drawPage = document.querySelector('#drawPage')
	const codeBlock = document.querySelector('#codeBlock')
	if (e.target.checked) {
		// if (!isCodeControl) {
		// 	const confirmModal = CreateUtils.createModal(`confirm`, {
		// 		'title':    `警告`,
		// 		'body':     `切換後將會以程式碼內容為主，無法切換回去，請確認後再點選確定。`,
		// 		'callback': function(result) {
		// 			if (result) {
		// 				isCodeControl = true
		// 				if (!frameEditMirror) {
		// 					frameEditMirror = CodeMirror.fromTextArea(document.querySelector('#codeArea'), {
		// 						mode: 'htmlmixed',
		// 						lineNumbers: true,
		// 						theme: 'abcdef'
		// 					})
		// 				}
		// 				setTimeout(() => {
		// 					if (frameEditMirror.getDoc().getValue() === '') {
		// 						const formDataContainer = drawPage.querySelector('div')
		// 						const formData = formDataContainer.dataset
		// 						const frame   = drawPage.convertToJson().div.children
		// 						let formFrame = SharedUtils.convertIntoFormFrame(frame, formData.formType)
		// 						drawPage.classList.add('hide')
		// 						codeBlock.classList.remove('hide')
		// 						frameEditMirror.getDoc().setValue(SharedUtils.style_html(formFrame))
		// 					} else {
		// 						drawPage.classList.add('hide')
		// 						codeBlock.classList.remove('hide')
		// 						drawPage.innerHTML = frameEditMirror.getDoc().getValue()
		// 						beanToListEvent()
		// 						initDrawPageEvent()
		// 					}
		// 				}, 500)
		// 				return true
		// 			} else e.target.checked = false
		// 		}
		// 	})
		// } else {
		if (!frameEditMirror) {
			frameEditMirror = CodeMirror.fromTextArea(document.querySelector('#codeArea'), {
				mode: 'htmlmixed',
				lineNumbers: true,
				theme: 'abcdef'
			})
		}
		const formDataContainer = drawPage.querySelector('div')
		const formData = formDataContainer.dataset
		const frame   = drawPage.convertToJson().div.children
		let formFrame = SharedUtils.convertIntoFormFrame(frame, formData)
		drawPage.classList.add('hide')
		codeBlock.classList.remove('hide')
		if (structurePass) return
		frameEditMirror.getDoc().setValue(SharedUtils.style_html(formFrame))
		// }
	} else {
		if (!frameEditMirror) {
			frameEditMirror = CodeMirror.fromTextArea(document.querySelector('#codeArea'), {
				mode: 'htmlmixed',
				lineNumbers: true,
				theme: 'abcdef'
			})
		}
		codeBlock.classList.add('hide')
		drawPage.classList.remove('hide')
		if (isPrintPage()) {
			const tempContainer     = CreateUtils.createBeanElement({'controlType': 'div'})[0]
			tempContainer.innerHTML = frameEditMirror.getDoc().getValue()
			const tempTable = tempContainer.querySelectorAll('.resultTable')
			const templateScript = tempContainer.querySelectorAll('.resultTableTemplate')
			// const outputTable = tempContainer.querySelector('.output-table')
			const printTitleRow  = tempContainer.querySelectorAll('.print-title-row')
			tempTable.forEach(table => SharedUtils.deconstructTableData(table))
			templateScript.forEach(ts => ts.remove())
			if (printTitleRow.length > 0) {
				const reverseRow = Array.from(printTitleRow).reverse()
				const tbody 	 = tempTable[0].tBodies[0]
				reverseRow.forEach(tr => tbody.prepend(tr))
			}
			const pageTitle = tempContainer.querySelector('.pageTitle')
			if (pageTitle) pageTitle.appendChild(customizeButton.createElemental()[0])
			drawPage.innerHTML = tempContainer.innerHTML
			// const printComponents = drawPage.querySelectorAll('.print-component')
			// printComponents.forEach(component => {
			// 	const seq = component.dataset.printSeq
			// 	const printComponent = window.ComponentFactory.getPrintComponent(seq)
			// 	printComponent.fullComponent = component
			// })
		} else if (isListPage()) {
			const tempContainer     = CreateUtils.createBeanElement({'controlType': 'div'})[0]
			tempContainer.innerHTML = frameEditMirror.getDoc().getValue()
			const tempTable = tempContainer.querySelector('#tableListTr_Template')
			if (tempTable) tempTable.remove()
			drawPage.innerHTML = tempContainer.innerHTML
		} else if (isAddPage()) drawPage.innerHTML = frameEditMirror.getDoc().getValue()
		
		beanToListEvent()
		initDrawPageEvent()
		newCustomizeColInitial()
	}
}

/**
 * 編輯框雙擊事件
 * =
 */
function initEditDiv() {
	/** 可編輯元素 */
	const allSources = document.querySelectorAll('.canEditDiv')
	allSources.forEach(dataSource => {
		dataSource.addEventListener('dblclick', editTrigger)
	})
}

/**
 * 啟用編輯
 * =
 * 插入編輯元件並進行畫面集中效果\
 * (可調整，目前問題：區間太小顯示的有限，須想更好的方法處理此問題)
 * @param  {Event} e [事件]
 */
function editTrigger(e) {
	if (!e.target.classList.contains("canEditDiv")) return
	if (isPrintPage()) {
		const parentEle = this.parentElement
		if (parentEle.dataset.isBean) return
	}
	SharedUtils.cancelDefault(e)
	/** 目標元素屬性(若有) */
	const targetAttribute 	= this.dataset.attribute || ''
	/** 目標元素原始內容 */
	const targetValue 		= this.innerHTML
	/** 創建編輯區塊元素 */
	const input 			= CreateUtils.createBeanElement({'controlType': 'editBox'})[0]
	/** 輸入框 */
	const inputElement 		= input.querySelector('input')
	/** 輸入完成按鈕 */
	const successButton 	= input.querySelector('.btn.btn-success')
	/** 輸入取消按鈕 */
	const cancelButton 		= input.querySelector('.btn.btn-danger')
	this.innerHTML 			= ''
	this.appendChild(input)
	try {
		inputElement.value 					= targetValue
		inputElement.dataset.defaultValue 	= targetValue
		successButton.dataset.attribute 	= targetAttribute
		inputElement.focus()
		inputElement.select()
		inputElement.addEventListener('mouseenter', SharedUtils.cancelDefault)
		inputElement.addEventListener('mousemove', SharedUtils.cancelDefault)
		inputElement.addEventListener('mouseleave', SharedUtils.cancelDefault)
		inputElement.addEventListener('click', SharedUtils.cancelDefault)
		inputElement.addEventListener('keydown', e => {
			if (e.which === 13) successButton.click()
			else if (e.key === 'Escape') cancelButton.click()
		})
	} catch (e) {
		CreateUtils.createModal(`alert`, {body: errorCodeDescription.ED0005})
		console.error(`error: ${ e }`)
	}
}

/**
 * 網頁複製事件
 * =
 * 若編輯中則無法複製元件
 * @param {Event} e 
 * @returns 
 */
function copyElementEvent(e) {
	if (SharedUtils.isEditing()) return
	copySelectElement()
}

/**
 * 網頁貼上事件
 * =
 * 若編輯中則無法貼上元件
 * @param {Event} e 
 * @returns 
 */
function pasteElementEvent(e) {
	if (SharedUtils.isEditing()) return
	pasteSelectElement()
}

/**
 * 網頁按鍵點擊事件
 * =
 * 偵測點擊 delete 執行刪除動作
 * @param {Event} e 
 */
function pageKeydownEvent(e) {
	if (e.keyCode === 113 && e.ctrlKey && e.shiftKey) {
		const pluginSwitch = document.querySelector('#pluginSwitch')
		if (pluginSwitch) pluginSwitch.parentNode.classList.remove('hide')
		return
	}
	if (e.keyCode !== 46) return
	if (SharedUtils.isEditing()) return
	deleteSelectedBean(e)
}

/**
 * 複製函數
 * =
 * 將所選擇的全部物件進行複製
 */
function copySelectElement() {
	/** 所有被選取元件/元素 */
	const selectedElement = document.querySelectorAll('.selected')
	const selectedArr = []
	try {
		selectedElement.forEach(element => {
			selectedArr.push(element.convertToJson())
		})
		window.localStorage["clipboard"] = JSON.stringify(selectedArr)
	} catch (e) {
		CreateUtils.createModal(`alert`, {body: errorCodeDescription.ED0006})
		console.error(`error: ${ e }`)
	}
}

/**
 * 貼上函數
 * =
 * 將複製的暫存讀取並進行貼上\
 * 貼上規則：
 *  > 一對一則直接將原本複製的資料貼上\
 *  > 多對一則將原本全部資料貼上同一個地方\
 *  > 一對多則多重複製將全部選取的地方都貼上\
 *  > 多對多
 *  >> 情況一: 數量一樣   => 各自依順序放入各自欄位\
 *  >> 情況二: 數量不一樣 => 將所有欄位都放入全部資料
 */
function pasteSelectElement() {
	/** 引入工廠 */
	const factory 			= window.ComponentFactory
	/** 所有被選取元件/元素 */
	const selectedElement 	= document.querySelectorAll('.selected')
	/** 已選取欄位 */
	const activeTableData 	= document.querySelectorAll('.tab-pane.show.active td.active')
	/** 剪貼簿資料 */
	let tempElement 		= window.localStorage["clipboard"]
	if (tempElement === undefined) return
	try {
		tempElement = SharedUtils.onionStringDecode(tempElement)
		// 若有選取元素將資料放入元素後
		if (selectedElement.length > 0) {
			selectedElement.forEach(element => {
				switch(element.tagName.toLowerCase()) {
					case 'div':
						const nodeList = tempElement.createElemental()
						nodeList.forEach(node => {
							if (node.dataset.isBean === 'Y') {
								const seq 			= node.dataset.seq
								const component 	= factory.getRegisterComponentBySeq(seq)
								const newComponent 	= component.cloneComponent()
								element.after(newComponent.fullComponent)
							} else element.after(node)
						})
						break
				}
			})
			beanToListEvent()
			initDrawPageEvent()
			return
		}
		// 若有已選取欄位則對應放入欄位
		if (activeTableData.length > 0) {
			let bean = tempElement.createElemental()
			// 選取數量與欄位數量相同，依序補入對應欄位
			if (bean.length === activeTableData.length) {
				activeTableData.forEach((td, index) => {
					if (td.innerHTML.trim().indexOf('&nbsp;') === 0) td.innerHTML = td.innerHTML.substring(6)
					const element 	= bean[index]
					if (element.dataset.isBean === 'Y') {
						const seq 			= element.dataset.seq
						const component 	= factory.getRegisterComponentBySeq(seq)
						const newComponent 	= component.cloneComponent()
						td.appendChild(newComponent.fullComponent)
					} else {
						const beans 		= td.querySelectorAll('[data-is-bean="Y"]')
						// 若單一標題則加入標題標籤
						if (element.classList.contains('h6') && beans.length === 0) td.classList.add('table-data-title')
						td.appendChild(element)
					}
				})
			// 選取數量不一樣則全部欄位都放入資料
			} else {
				activeTableData.forEach((td, index) => {
					if (td.innerHTML.trim().indexOf('&nbsp;') === 0) td.innerHTML = td.innerHTML.substring(6)
					const beans = td.querySelectorAll('[data-is-bean="Y"]')
					// 若單一標題則加入標題標籤
					if (bean.length === 1 && bean[0].classList.contains('h6') && beans.length === 0) td.classList.add('table-data-title')
					bean.forEach(element => {
						if (element.dataset.isBean === 'Y') {
							const seq 			= element.dataset.seq
							const component 	= factory.getRegisterComponentBySeq(seq)
							const newComponent 	= component.cloneComponent()
							td.appendChild(newComponent.fullComponent)
						} else td.appendChild(element)
					})
				})
			}
			SharedUtils.clearTableActiveData()
			beanToListEvent()
			initDrawPageEvent()
			return
		}
	} catch (e) {
		CreateUtils.createModal(`alert`, {body: errorCodeDescription.ED0007})
		console.error(`error: ${ e }`)
	}
}

/**
 * 拖曳開始事件
 * [紀錄拖曳物件值]
 * @param {Event} e 
 */
function dragStart(e) {
	// 若拖曳對象為標題且沒有編號
	if (this.tagName.toLowerCase() === 'label' && this.id === '') {
		const timestamp = new Date().format('HHmmsss')
		const tempUID = 'label' + timestamp
		this.id = tempUID
		e.dataTransfer.setData('text/plain', `${ tempUID },title`)
	} else if (this.dataset.type || this.getAttribute('value') || this.id) e.dataTransfer.setData('text/plain', `${ this.tagName.toLowerCase() },${ this.getAttribute('value') || this.id || this.dataset.type }`)
}

/**
 * 元件拖曳開始事件
 * [紀錄拖曳物件值]
 * @param {Event} e 
 */
function dragBeanStart(e) {
	e.dataTransfer.setData('text/plain', `${ this.dataset.seq },bean`)
	e.stopPropagation()
}

/**
 * 拖曳結束放置事件
 * =
 * 依據物件拖曳時設置的類別進行分類\
 * 將元件屬性設定完成後放入元素內
 * @param {Event} e 
 */
function dropped(e) {
	SharedUtils.cancelDefault(e)
	/** 引入元件工廠 */
	const factory = window.ComponentFactory
	this.classList.remove('drag-hover')
	/** 拖曳元素 / 元件的參數 (a,b) */
	let plain 		= e.dataTransfer.getData('text/plain')
	if (plain.indexOf(',') > -1) plain = plain.split(',')
	/** 拖曳標籤 / 拖曳元件名稱 / 拖曳編號 */
	const dragTag 	= plain[0]
	/** 拖曳元素 / 元件類型 */
	const type 		= plain[1]
	/** 直接拖曳元件或標題 */
	if (type === 'bean' || type === 'title' || type === 'container') {
		let parentContainer 
		if (type === 'bean') {
			// 拖曳元件類型：將原本元件直接移動至該位置，並檢核相關動態效果
			try {
				const targetComponent = factory.getRegisterComponentBySeq(dragTag)
				parentContainer 	  = targetComponent.fullComponent.parentNode
				if (parentContainer.classList.contains('divInlineBlock-group')) parentContainer = parentContainer.parentNode
				if (isListPage()) parentContainer = targetComponent.listComponent.parentNode 
				if (isPrintPage()) parentContainer = targetComponent.printComponent.parentNode 
				if (this.innerHTML.indexOf('&nbsp;') === 0) this.innerHTML = this.innerHTML.substring(6)
				if (isAddPage()) {
					if (this.classList.contains('bean-drop')) {
						if (this.classList.contains('drop-before')) 
							this.after(targetComponent.fullComponent)
						else if (this.classList.contains('drop-after')) {
							targetComponent.container[0].classList.add('view-hide')
							this.before(targetComponent.fullComponent)
						}
					} else {
						if (this.querySelector('.divInlineBlock-group')) this.querySelector('.divInlineBlock-group').appendChild(targetComponent.fullComponent)
						else {
							const childBean = this.querySelectorAll('.pFormItem[data-name], .pFormItemGroup[data-name]')
							if (childBean.length > 0 && this.tagName.toLowerCase() !== 'div') {
								let count = 0
								childBean.forEach(bean => {
									if (bean.parentNode === this) count++
								})
								if (count >= 1) {
									const divInlineBlock = document.createElement('div')
									divInlineBlock.classList.add('divInlineBlock-group')
									do {
										divInlineBlock.appendChild(this.firstChild)
									} while (this.hasChildNodes())
									divInlineBlock.appendChild(targetComponent.fullComponent)
									this.replaceChildren(divInlineBlock)
								} else this.appendChild(targetComponent.fullComponent)
							} else this.appendChild(targetComponent.fullComponent)
						}
					}
					if (this.classList.contains('table-data-title')) this.classList.remove('table-data-title')
				}
				if (isListPage()) this.appendChild(targetComponent.listComponent)
				if (isPrintPage()) this.appendChild(targetComponent.printComponent)
			} catch (e) {
				CreateUtils.createModal(`alert`, {body: errorCodeDescription.ED0009})
				console.error(`error: ${ e }`)
			}
		} else if (type === 'title') {
			// 拖曳標題類型：將原本標題移動至該位置，並檢核相關動態效果
			const targetLabel = document.querySelector(`#${ dragTag }`)
			parentContainer = targetLabel.parentNode
			targetLabel.id = ''
			if (this.innerHTML.indexOf('&nbsp;') === 0) this.innerHTML = this.innerHTML.substring(6)
			if (parentContainer.querySelectorAll('td > label.h6').length === 1) parentContainer.classList.remove('table-data-title')
			if (this.classList.contains('bean-drop')) {
				if (this.classList.contains('drop-before')) this.after(targetLabel)
				else if (this.classList.contains('drop-after')) this.before(targetLabel)
			} else this.appendChild(targetLabel)
			const childBean = this.querySelectorAll('.pFormItem[data-name], .pFormItemGroup[data-name]')
			if (childBean.length === 0) this.classList.add('table-data-title')
		} else if (type === 'container') {
			const targetContainer = factory.getLayoutComponent(dragTag)
			parentContainer = targetContainer.fullComponent.parentNode
			if (this.innerHTML.indexOf('&nbsp;') === 0 && this.tagName.toLowerCase() === 'td') this.innerHTML = this.innerHTML.substring(6)
			this.appendChild(targetContainer.fullComponent)
		}
		SharedUtils.clearTableHoverButton()
		// 若原欄位為空則補空白
		if (parentContainer.childNodes.length === 0) parentContainer.innerHTML = '&nbsp;'
		const inlineBlock = parentContainer.querySelector('.divInlineBlock-group')
		if (inlineBlock && inlineBlock.children.length > 0 && inlineBlock.children.length < 2) {
			for (let bean of inlineBlock.children) {
				parentContainer.prepend(bean)
			}
			inlineBlock.remove()
		} 
		beanToListEvent()
		return
	}
	/** 左側菜單元素 */
	const leftMenu 	= document.querySelector('#leftMenu')
	/** 元件按鈕選取 (可能選不到) */
	const eleObject = leftMenu.querySelector(`${ dragTag }[value="${ type }"]`)
	/** 元件名稱與標題 */
	let buttonName 	= ''
	/** 元件類型所屬 */
	let eleRole
	/** 元件適用頁面 */
	let role
	/** 元件編號 */
	let seq  
	if (eleObject) {
		buttonName 		= eleObject.textContent
		role 			= eleObject.dataset.role
		seq 			= eleObject.dataset.seq
		if (eleObject.dataset.eleRole === 'list' || eleObject.dataset.eleRole === 'print') eleRole = isListPage() ? 'list' : isPrintPage() ? 'print' : 'add'
		else eleRole 	= eleObject.dataset.eleRole
	}
	if (!this.classList.contains('container-component')) this.innerHTML = this.innerHTML.trim()
	if (this.innerHTML.indexOf('&nbsp;') === 0) this.innerHTML = this.innerHTML.substring(6)
	/** 清單元件拖曳進清單頁 */
	if (this.tagName.toLowerCase() === 'th' && eleRole === 'list') {
		const listComponent = factory.createList(`__${ type }`)
		this.appendChild(listComponent.fullComponent)
		this.dataset.mobileTitle = listComponent.dataset.title
		settingListPageTitle(this, listComponent.dataset.title)
	/** 基礎元件拖曳進清單頁 */
	} else if (this.tagName.toLowerCase() === 'th') {
		if (seq) {
			const alreadyComponent = factory.getRegisterComponentBySeq(seq)
			this.appendChild(alreadyComponent.listComponent)
			this.dataset.mobileTitle = alreadyComponent.dataset.title
			settingListPageTitle(this, alreadyComponent.dataset.title)
		} else {
			const listComponent = factory.getListComponent(type)
			this.dataset.mobileTitle = listComponent.dataset.title
			this.appendChild(listComponent.fullComponent)
		}
	}
	else if (eleRole === 'print') {
		if (this.querySelector('.print-component')) {
			CreateUtils.createModal(`alert`, {body: errorCodeDescription.ED0016})
			return
		}
		const parentContainer = this.closest('tr')
		if (parentContainer && parentContainer.classList.contains('print-title-row')) {
			this.appendChild(CreateUtils.createBeanElement({
				'controlType': 'label',
				'attribute': 	[
					{
						'class': 'h6 canEditDiv',
						'draggable': 'true',
						'data-edit': 'true'
					}
				]
			})[0])
			if (this.querySelectorAll('.pFormItem[data-name], .pFormItemGroup[data-name]').length === 0 && this.querySelector('label.h6')) this.classList.add('table-data-title')
			else this.classList.remove('table-data-title')
		} else {
			const printComponent = factory.createPrint(`__${ type }`)
			this.appendChild(printComponent.fullComponent) 
		}
	}
	else if (role === 'layout') {
		const layoutComponent = factory.createLayout(`__${ type }`)
		if (this.classList.contains('drop-before')) this.after(layoutComponent.fullComponent)
		else if (this.classList.contains('drop-after')) this.before(layoutComponent.fullComponent)
		else this.appendChild(layoutComponent.fullComponent)
	}
	/** 基礎元件拖曳進新增頁 */
	else {
		/** 預設元件名稱 */
		const defaultBeanName = `${ type }_${ CreateUtils.createRandomCode() }`
		/** 創建元件(若有編號直接導出原本元件，若無則創建新的元件) */
		let component
		if (seq) component = factory.getRegisterComponentBySeq(seq)
		else component = factory.create(`__${ type }`, defaultBeanName, defaultBeanName, buttonName.replace(/\(+\w+\)/, ''))
		// 新增頁自動協助生成標題 (只限定表格右側新增左側標題)
		if (isAddPage() && type !== 'breakLine' && type !== 'label') {
			/** 左側容器 */
			let leftTableData = getPreviousElement(this)
			if (leftTableData !== null && leftTableData.tagName.toLowerCase() === 'td') {
				if (leftTableData.innerHTML.trim() === "&nbsp;" || leftTableData.innerHTML.trim() === '') {
					leftTableData.classList.add('table-data-title')
					leftTableData.append(CreateUtils.createBeanElement({
						'controlType': 'label',
						'attribute': 	[
							{
								'class': 'h6 canEditDiv',
								'draggable': 'true',
								'data-edit': 'true',
								'data-connect': defaultBeanName
							}
						]
					})[0])
				}
			}
		}
		if (this.classList.contains('drop-before')) this.after(component.fullComponent)
		else if (this.classList.contains('drop-after')) this.before(component.fullComponent)
		else if (component) {
			if (isPrintPage()) {
				const parentTableRow = this.closest('tr')
				const tableDataIndex = parentTableRow.children.indexOf(this)
				if (parentTableRow.previousElementSibling && parentTableRow.previousElementSibling.classList.contains('print-title-row')) {
					const titleContainer = parentTableRow.previousElementSibling.children[tableDataIndex]
					if (titleContainer.innerHTML.indexOf('&nbsp;') === 0) titleContainer.innerHTML = titleContainer.innerHTML.substring(6)
					if (titleContainer.innerHTML.trim() === '') titleContainer.appendChild(CreateUtils.createBeanElement({
						'controlType': 'label',
						'attribute': 	[
							{
								'class': 'h6 canEditDiv',
								'draggable': 'true',
								'data-edit': 'true',
								'text': component.dataset.title
							}
						]
					})[0])
					
				}
				this.appendChild(component.printComponent)
			} else if (isListPage()) this.appendChild(component.listComponent)
			else if (this.querySelector('.divInlineBlock-group')) this.querySelector('.divInlineBlock-group').appendChild(component.fullComponent)
			else this.appendChild(component.fullComponent)
		} 
		const childBean = this.querySelectorAll('.pFormItem[data-name], .pFormItemGroup[data-name]')
		if (childBean.length === 0 && this.querySelector('label.h6')) this.classList.add('table-data-title')
		else this.classList.remove('table-data-title')
		/** add container */
		if (this.tagName.toLowerCase() !== 'div') {
			let count = 0
			childBean.forEach(bean => {
				if (bean.parentNode === this) count++
			})
			if (count > 1) {
				let divInlineBlock = document.createElement('div')
				divInlineBlock.classList.add('divInlineBlock-group')
				if (this.querySelector('.divInlineBlock-group')) divInlineBlock = this.querySelector('.divInlineBlock-group')
				do {
					divInlineBlock.appendChild(this.firstChild)
				} while (this.hasChildNodes())
				this.replaceChildren(divInlineBlock)
			}
		}
	}
	
	beanToListEvent()
	initDrawPageEvent()

	/** 設定清單頁標題 */
	function settingListPageTitle(tdElement, titleText) {
		const index = tdElement.parentNode.children.indexOf(tdElement)
		const table = tdElement.closest('table')
		const thead = table.querySelector('thead tr')
		if (thead.children[index]) {
			if (thead.children[index].innerHTML.indexOf('&nbsp;') === 0) thead.children[index].innerHTML = thead.children[index].innerHTML.substring(6)
			if (thead.children[index].innerHTML === '') thead.children[index].innerHTML = titleText
		}
	}

	/** 取得左側不為空的欄位 */
	function getPreviousElement(element) {
		if (element.previousElementSibling) {
			if (element.previousElementSibling.classList.contains('hide')) return getPreviousElement(element.previousElementSibling)
			else return element.previousElementSibling
		} 
		return null
	}
}

/**
 * 拖曳滑入事件
 * =
 * 針對頁籤拖曳滑入切換頁籤
 * @param {Event} e 
 */
function dropEnter(e) {
	SharedUtils.cancelDefault(e)
	if (e.target.tagName.toLowerCase() === 'a') e.target.click()
}

/**
 * 拖曳滑動效果事件
 * =
 * 滑入效果，強化使用者體驗
 * @param {Event} e 
 */
function dropOver(e) {
	SharedUtils.cancelDefault(e)
	const tableCell = e.target.closest('th, td')
	if (e.target.tagName.toLowerCase() === 'div') {
		if (e.target.classList.contains('bean-drop') ||
			e.target.classList.contains('block-drop-container') || 
			e.target.classList.contains('print-container')) e.target.classList.add('drag-hover')
		else if (tableCell !== null) tableCell.classList.add('drag-hover')
		
	} else if (tableCell !== null) e.target.closest('th, td').classList.add('drag-hover')
}

/**
 * 拖曳滑出事件
 * =
 * 移除滑入效果
 * @param {Event} e 
 */
function dropLeave(e) {
	SharedUtils.cancelDefault(e)
	e.target.classList.remove('drag-hover')
}

/**
 * 表格滑入事件
 * =
 * @param {Event} e 
 */
function rowMouseEnter(e) {
	if (e.target.tagName.toLowerCase() === 'tr') e.target.classList.add('hover')
}

/**
 * 表格整列滑入效果
 * =
 * @param {Event} e 
 */
function rowMouseMove(e) {
	if (e.target.tagName.toLowerCase() === 'tr') e.target.classList.add('hover')
	else if (e.target.tagName.toLowerCase() === 'td') e.target.parentElement.classList.remove('hover')
}

/**
 * 表格整列滑出事件
 * =
 * @param {Event} e 
 */
function rowMouseLeave(e) {
	SharedUtils.clearHover()
}

/**
 * 表格整列選取事件
 * =
 * @param {Event} e 
 */
function rowSelect(e) {
	if (e.target.tagName.toLowerCase() === 'tr') {
		/** 選取的表格 */
		const firstTableData 	= document.querySelector('td.active')
		/** 全部資料表格 */
		const targetTableData 	= e.target.querySelectorAll('td')
		/** 跳出迴圈例外用 */
		const breakException 	= { }
		if (firstTableData !== null) firstTableData.click()
		try {
			targetTableData.forEach(td => {
				if (td.rowSpan > 1 || td.colSpan > 1) {
					if (firstTableData !== null)
						firstTableData.click()
					CreateUtils.createModal(`alert`, {body: errorCodeDescription.ED0017})
					throw breakException
				}
				td.click()
			})
		} catch (e) { /* break exception */ }
		SharedUtils.cancelDefault(e)
	}
}

/**
 * 布局滑入事件
 * =
 * 滑鼠滑入 div 內將顯示新增欄位按鈕
 *
 * 並綁定按鈕點擊事件
 * @param {Event} e
 */
function flexColMouseEnter(e) {
	if (e.target!==this) return
	SharedUtils.cancelDefault(e)
	/** 表格內新增欄位按鈕 */
	const buttons = e.target.querySelectorAll('button.icon')
	if (buttons.length === 4) return
	/** 方位 */
	const director 			= ['top', 'bottom', 'left', 'right']
	/** 新增欄位按鈕 */
	const buttonElement 	= CreateUtils.createBeanElement({
		'controlType': 'button',
		'attribute': 	[
			{
				'class': 	'icon plus hide',
				'title': 	'新增欄位',
				'text': 	'',
				'children': [
					{
						'i': {
							'class': 'bi bi-plus-circle-fill'
						}
					}
				]
			}
		]
	})[0]
	try {
		for (let i = 0; i < 4; ++i) {
			if (i > 0) buttonElement.classList.remove([director[i - 1]])
			buttonElement.classList.add(director[i])
			if (e.target.offsetWidth <= 200 || e.target.offsetHeight <= 200) buttonElement.classList.add('icon-sm')
			e.target.appendChild(buttonElement.cloneNode(true))
		}
		let buttonIcon = document.querySelectorAll('button.icon.plus')
		buttonIcon.forEach(iconSource => {
			iconSource.addEventListener('mouseenter', SharedUtils.cancelDefault)
			iconSource.addEventListener('mousemove', SharedUtils.cancelDefault)
			iconSource.addEventListener('mouseleave', SharedUtils.cancelDefault)
			iconSource.addEventListener('click', addFlexCol)
		})
	} catch (e) {
		CreateUtils.createModal(`alert`, {body: errorCodeDescription.ED0011})
		console.error(`error: ${ e }`)
	}

}

/**
 * 表格內滑動事件
 * =
 * 依照滑鼠位置顯示對應新增欄位按鈕
 * @param {Event} e
 */
function flexColMouseMove(e) {
	/** 表格容器 */
	const flexCol 	= e.target
	// 過濾掉非本元素 滑動效果
	if (flexCol!==this) return
	/** 指定欄位高度 */
	let targetHeight 		= flexCol.offsetHeight
	/** 指定欄位寬度 */
	let targetWidth 		= flexCol.offsetWidth
	/** 滑鼠位置 X 軸 */
	let offsetX 			= e.offsetX
	/** 滑鼠位置 Y 軸 */
	let offsetY 			= e.offsetY
	/** 當前表格所有資料列 */
	const flexRow = flexCol.closest('.flex-row')

	const flexContainer = flexRow.closest('.flex-column')
	/** 當前表格所有存在滑入效果的欄位 */
	const hoverFlexCol 	= flexContainer.querySelectorAll('.flex-row>div.hover')
	/** 表格容器內全部新增欄位按鈕 */
	const iconButtons 		= flexCol.querySelectorAll('button.icon')
	hoverFlexCol.forEach(col => col.classList.remove('hover'))
	// 若滑入位置為外則整列選取
	if (offsetY < -1) {
		flexCol.classList.add('hover')
	} else {
		flexCol.classList.remove('hover')
	}
	iconButtons.forEach(button => button.classList.add('hide'))
	// 依照滑鼠位置顯示靠近的新增欄位按鈕
	if (offsetY > targetHeight / 2) {
		iconButtons.forEach(button => {
			if (button.classList.contains('bottom')) button.classList.remove('hide')
		})
	}
	if (offsetY < targetHeight / 2) {
		iconButtons.forEach(button => {
			if (button.classList.contains('top')) button.classList.remove('hide')
		})
	}
	if (offsetX > targetWidth / 2) {
		iconButtons.forEach(button => {
			if (button.classList.contains('right')) button.classList.remove('hide')
		})
	}
	if (offsetX < targetWidth / 2) {
		iconButtons.forEach(button => {
			if (button.classList.contains('left')) button.classList.remove('hide')
		})
	}
	if (e.offsetY < -1)
		iconButtons.forEach(button => button.classList.add('hide'))
}

/**
 * 表格滑出事件
 * =
 * 移出滑鼠後新增欄位按鈕移除
 * @param {Event} e
 */
function flexColMouseLeave(e) {
	SharedUtils.clearHover()
	SharedUtils.clearTableHoverButton()
	SharedUtils.cancelDefault(e)
}
/**
 * 資料欄位選取事件
 * =
 * td 點擊選取效果\
 * 取消所有元件選取\
 * 若重複選取取消全部表格選取\
 * ※Bug註記 - 選取連續儲存格 + 單一儲存格沒有彈出錯誤訊息
 * @param {Event} e
 */
function flexColSelect(e) {
	// 取消所有有選取的元件事件
	SharedUtils.clearSelectedElements()
	SharedUtils.cancelDefault(e)
	/** 當前點擊的資料格 */
	const flexCol 	= this
	/** 該資料所在容器 */
	const flexContainer 	= flexCol.closest('.flex-column')
	// 欄位選取提示，若重複點擊移除所有提示
	if (flexCol.classList.contains('active')) SharedUtils.clearFlexActiveData()
	else flexCol.classList.add('active','selected')

	let toolSetting 		= {}
	let isOpen 				= false

    /** 當前表格所有選取的資料表格 */
    const selectedCell 	= flexContainer.querySelectorAll('.flex-row>div.active')
	// 刪除按鈕
	if (selectedCell.length > 0) {
		toolSetting["#deleteBean"] = true
		isOpen = true
	}
	// 貼上按鈕
	if (flexCol.classList.contains('active') && window.localStorage["clipboard"] !== undefined) {
		toolSetting["#pasteBtn"] = true
		isOpen = true
	}
	if (selectedCell.length === 1) {
		/** 引入工廠 */
		const factory = window.ComponentFactory
		/** 屬性清單元素 */
		const materialList = document.querySelector('#materialList')
		const styleComponent = factory.modifyStyleComponent(flexCol)
		for (let moduleName in styleComponent.attributesModules) {
			const moduleElement = styleComponent.attributesModules[moduleName]
			materialList.appendChild(moduleElement)
		}
	}
	toolPackActive(isOpen, toolSetting)
	beanFocusStopDrop(true)
}
/**
 * 資料欄位選取事件
 * =
 * td 點擊選取效果\
 * 取消所有元件選取\
 * 若重複選取取消全部表格選取\
 * ※Bug註記 - 選取連續儲存格 + 單一儲存格沒有彈出錯誤訊息
 * @param {Event} e
 */
function flexRowSelect(e) {
	// 取消所有有選取的元件事件
	SharedUtils.clearSelectedElements()
	SharedUtils.cancelDefault(e)
	/** 當前點擊的資料格 */
	const flexRow 	= this
	/** 該資料所在容器 */
	const flexContainer 	= flexRow.closest('.flex-column')
	// 欄位選取提示，若重複點擊移除所有提示
	if (flexRow.classList.contains('active')) SharedUtils.clearFlexActiveData()
	else flexRow.classList.add('active','selected')

	let toolSetting 		= {}
	let isOpen 				= false

    /** 當前表格所有選取的資料表格 */
    const selectedRow 	= flexContainer.querySelectorAll('.flex-row.active')
	// 刪除按鈕
	if (selectedRow.length > 0) {
		toolSetting["#deleteBean"] = true
		isOpen = true
	}
	// 貼上按鈕
	if (flexRow.classList.contains('active') && window.localStorage["clipboard"] !== undefined) {
		toolSetting["#pasteBtn"] = true
		isOpen = true
	}
	if (selectedRow.length === 1) {
		/** 引入工廠 */
		const factory = window.ComponentFactory
		/** 屬性清單元素 */
		const materialList = document.querySelector('#materialList')
		/** 暫時棄用 */
		// const classComponent = factory.modifyClassComponent(flexRow,['flex-wrap'],['自動換行'])
		// for (let moduleName in classComponent.attributesModules) {
		// 	const moduleElement = classComponent.attributesModules[moduleName]
		// 	materialList.appendChild(moduleElement)
		// }
		const styleComponent = factory.modifyStyleComponent(flexRow)
		for (let moduleName in styleComponent.attributesModules) {
			const moduleElement = styleComponent.attributesModules[moduleName]
			materialList.appendChild(moduleElement)
		}
	}
	toolPackActive(isOpen, toolSetting)
	beanFocusStopDrop(true)
}
/**
 * 新增欄位
 * =
 * 包含上下左右新增欄位\
 * 依照整列或整欄表格數量進行新增\
 * 每次新增一整欄或一整列
 * @param {Event} e
 */
function addFlexCol(e) {
	SharedUtils.cancelDefault(e)
	SharedUtils.clearTableActiveData()
	/** 新增欄位按鈕元素 */
	const button 			= this
	/** 按鈕最近的所在列 (row) */
	const flexRow 		= button.closest('.flex-row')
	/** 按鈕所在的表格欄位 (td / th) */
	const flexCol 		= button.parentNode
	// 判斷點擊按鈕為上、下新增按鈕
	if (button.classList.contains('top') || button.classList.contains('bottom')) {
		try {
			// 進行 tableRow 新增並找尋適當位置放置
			const rowClone	 	= CreateUtils.createBeanElement({'controlType': 'flexRow'})[0]
			if (button.classList.contains('top')) flexRow.before(rowClone)
			else flexRow.after(rowClone)
		} catch (e) {
			CreateUtils.createModal(`alert`, {body: errorCodeDescription.ED0012})
			console.error(`error: ${ e }`)
		}
	}
	/** 左右方新增欄位  */
	if (button.classList.contains('left') || button.classList.contains('right')) {
		try {
			// 進行 tableRow 新增並找尋適當位置放置
			const colClone	 	= CreateUtils.createBeanElement({'controlType': 'flexCol'})[0]
			if (button.classList.contains('left')) flexCol.before(colClone)
			else flexCol.after(colClone)
		} catch (e) {
			CreateUtils.createModal(`alert`, {body: errorCodeDescription.ED0012})
			console.error(`error: ${ e }`)
		}
	}
	initDrawPageEvent()
	initEditDiv()
}
/**
 * 表格滑入事件
 * =
 * 滑鼠滑入 td 內將顯示新增欄位按鈕
 * 
 * 並綁定按鈕點擊事件
 * @param {Event} e 
 */
function tableMouseEnter(e) {
	SharedUtils.cancelDefault(e)
	/** 表格內新增欄位按鈕 */
	const buttons = e.target.querySelectorAll('button.icon')
	if (e.target.tagName.toLowerCase() !== 'td' && e.target.tagName.toLowerCase() !== 'th') return
	if (buttons.length === 4) return
	if (e.target.rowSpan > 1 || e.target.colSpan > 1) return
	/** 表格容器 */
	const parentContainer 	= e.target.parentNode
	/** 方位 */
	const director 			= ['top', 'bottom', 'left', 'right']
	/** 新增欄位按鈕 */
	const buttonElement 	= CreateUtils.createBeanElement({
		'controlType': 'button',
		'attribute': 	[
			{
				'class': 	'icon plus hide',
				'title': 	'新增欄位',
				'text': 	'',
				'children': [
					{
						'i': {
							'class': 'bi bi-plus-circle-fill'
						}
					}
				]
			}
		]
	})[0]
	SharedUtils.clearAllInterval()
	timer = setInterval(() => {
		try {
			for (let i = 0; i < 4; ++i) {
				// 過濾掉清單頁第一格表格左方新增欄位及最後一格新增欄位，並過濾上下新增欄位
				if (isListPage() && (e.target.tagName.toLowerCase() === 'th' && 
					(i < 2 || (parentContainer.children.indexOf(e.target) === 0 && i < 3) || 
					((parentContainer.children.indexOf(e.target) === (parentContainer.children.length - 1) && i === 3))))) continue
				if (i > 0) buttonElement.classList.remove([director[i - 1]])
				buttonElement.classList.add(director[i])
				if (e.target.offsetWidth <= 200 || e.target.offsetHeight <= 200) buttonElement.classList.add('icon-sm')
				e.target.appendChild(buttonElement.cloneNode(true))
			}
			let buttonIcon = document.querySelectorAll('button.icon.plus')
			buttonIcon.forEach(iconSource => {
				iconSource.addEventListener('mouseenter', SharedUtils.cancelDefault)
				iconSource.addEventListener('mousemove', SharedUtils.cancelDefault)
				iconSource.addEventListener('mouseleave', SharedUtils.cancelDefault)
				iconSource.addEventListener('click', addTd)
			})
		} catch (e) {
			CreateUtils.createModal(`alert`, {body: errorCodeDescription.ED0011})
			console.error(`error: ${ e }`)
		}
		SharedUtils.clearAllInterval()
	}, 1000);
}

/**
 * 表格內滑動事件
 * =
 * 依照滑鼠位置顯示對應新增欄位按鈕
 * @param {Event} e 
 */
function tableMouseMove(e) {
	/** 表格容器 */
	const tableContainer 	= e.target
	// 過濾掉非 td / th 滑動效果
	if (tableContainer.tagName.toLowerCase() !== 'td' && tableContainer.tagName.toLowerCase() !== 'th') return
	/** 指定欄位高度 */
	let targetHight 		= tableContainer.offsetHeight
	/** 指定欄位寬度 */
	let targetWidth 		= tableContainer.offsetWidth
	/** 滑鼠位置 X 軸 */
	let offsetX 			= e.offsetX
	/** 滑鼠位置 Y 軸 */
	let offsetY 			= e.offsetY
	/** 當前欄位索引位置 */
	let index 				= tableContainer.parentElement.children.indexOf(tableContainer)
	/** 當前欄位所在表身 */
	const parentBody 		= tableContainer.closest('tbody')
	/** 當前表格所有資料列 */
	const tableRow 			= parentBody.querySelectorAll('tr')
	/** 當前表格所有存在滑入效果的欄位 */
	const hoverTableData 	= parentBody.querySelectorAll('td.hover')
	/** 表格容器內全部新增欄位按鈕 */
	const iconButtons 		= tableContainer.querySelectorAll('button.icon')
	hoverTableData.forEach(td => td.classList.remove('hover'))
	// 若滑入位置為外則整列選取
	if (offsetY < -1) {
		tableRow.forEach(tr => {
			const childTableData = tr.children
			if (childTableData[index]) childTableData[index].classList.add('hover')
		})
	} else {
		tableRow.forEach(tr => {
			const childTableData = tr.children
			if (childTableData[index]) childTableData[index].classList.remove('hover')
		})
	}
	iconButtons.forEach(button => button.classList.add('hide'))
	// 依照滑鼠位置顯示靠近的新增欄位按鈕
	if (offsetY > targetHight / 2) {
		iconButtons.forEach(button => {
			if (button.classList.contains('bottom')) button.classList.remove('hide')
		})
	}
	if (offsetY < targetHight / 2) {
		iconButtons.forEach(button => {
			if (button.classList.contains('top')) button.classList.remove('hide')
		})
	}
	if (offsetX > targetWidth / 2) {
		iconButtons.forEach(button => {
			if (button.classList.contains('right')) button.classList.remove('hide')
		})
	}
	if (offsetX < targetWidth / 2) {
		iconButtons.forEach(button => {
			if (button.classList.contains('left')) button.classList.remove('hide')
		})
	}
	if (e.offsetY < -1) 
		iconButtons.forEach(button => button.classList.add('hide'))
}

/**
 * 表格滑出事件
 * =
 * 移出滑鼠後新增欄位按鈕移除
 * @param {Event} e 
 */
function tableMouseLeave(e) {
	SharedUtils.clearHover()
	SharedUtils.clearTableHoverButton()
	SharedUtils.cancelDefault(e)
	SharedUtils.clearAllInterval()
}

/**
 * 新增欄位
 * =
 * 包含上下左右新增欄位\
 * 依照整列或整欄表格數量進行新增\
 * 每次新增一整欄或一整列
 * @param {Event} e 
 */
function addTd(e) {
	SharedUtils.cancelDefault(e)
	SharedUtils.clearTableActiveData()
	/** 新增欄位按鈕元素 */
	const button 			= this
	/** 按鈕最近的所在列 (tr) */
	const targetRow 		= button.closest('tr')
	/** 按鈕最近的所在表格 (table) */
	const table 			= button.closest('table')
	/** 表格所有的列 (trs) */
	let allTableRows 		= table.querySelectorAll('tbody > tr')
	/** 按鈕所在的表格欄位 (td / th) */
	const tableCell 		= button.parentNode
	/** 表格欄位標籤 (td / th) */
	const tagName 			= tableCell.tagName.toLowerCase()
	/** 計數器 (用於計算與欄位合併數量) */
	let count = 0
	/** 當前欄位合併數量 */
	let colspan = 1
	/** 當前列合併數量 */
	let rowspan = 1
	/** 是否新增過 */
	let isAdded = false
	if (isListPage()) allTableRows = table.querySelectorAll('tr')
	// 判斷點擊按鈕為上、下新增按鈕
	if (button.classList.contains('top') || button.classList.contains('bottom')) {
		try {
			/** 表格最大數量欄位 */
			let maxCell 			= getTableMaxCell(table)
			// 進行 tableRow 新增並找尋適當位置放置
			const trClone	 	= CreateUtils.createBeanElement({'controlType': 'tablerow'})[0]
			/** 選取資料表格所在列 */
			/** 判定是否為雙向合併欄位點擊下方新增欄位 */
            if ((tableCell.rowSpan > 1 || tableCell.colSpan > 1) && button.classList.contains('bottom')) 
				targetRow = targetRow.parentNode.children[targetRow.parentNode.children.indexOf(targetRow) + tableCell.rowSpan - 1]
			// 依目前最多的欄位數量進行填充欄位，將判斷是否當格有被點擊及欄位合併是否需要隱藏
			for (let i = 0; i < maxCell; ++i) {
				const tdClone = CreateUtils.createBeanElement({
					'controlType': tagName === 'td' ? 'tabledata' : 'tablehead',
					'attribute': 	[
						{
							'class': '',
							'data-role': 'drag-drop-container',
						}
					]
				})[0]
				tdClone.innerHTML = '&nbsp;'
				/** 當前列的選取欄 */
                const tdInPosition = targetRow.children[i]
                /** 應該不會發生、可能發生原因會是非常舊的表單 */
                if (!tdInPosition) continue
				if (tdInPosition.classList.contains('print-title-col')) tdClone.classList.add('print-title-col')
				if (tdInPosition.rowSpan > 1) {
                    /** 
                     * 處理非當前格並點擊下方欄位新增按鈕狀況
                     * 範例：
                     *  ↓ 此格向下新增時，循環至欄合併且與當前欄位不同，需要進行調整
                     *  __ __ __
                     * |__|__ __|
                     * |__|__|__|
                     */
                    if (tdInPosition !== tableCell && button.classList.contains('bottom')) {
                        if (!isAdded) tdInPosition.rowSpan++
                        tdClone.classList.add('hide')
                        isAdded = true
                        count++
                    }
                    colspan = tdInPosition.colSpan
                /** 判斷隱藏格 */
                } else if (tdInPosition.classList.contains('hide')) {
                    /** 
                     * 處理邏輯
                     * 由表格左至右
                     * 判斷當前觸發按鈕是上方或下方
                     * 依照按鈕方位查詢上下方欄位是否有隱藏格或合併格進行處理
                     */
                    let otherCell
                    /** 點擊上方欄位新增，判斷欄位上方格 */
                    if (button.classList.contains('top')) 
						otherCell = targetRow.previousElementSibling ? targetRow.previousElementSibling.children[i] : null
                    /** 點擊下方欄位新增，判斷欄位下方格 */
                    if (button.classList.contains('bottom')) 
						otherCell = targetRow.nextElementSibling ? targetRow.nextElementSibling.children[i] : null
                    /** 欄位格存在且為隱藏或有存在合併欄位 */
                    if (otherCell && (otherCell.classList.contains('hide') || otherCell.rowSpan > 1)) {
                        tdClone.classList.add('hide')
                        /** X 軸定位 */
                        let xAxis = i
                        /** 迴圈閘 */
                        let startLoop = true
                        /** 位移欄位 */
                        let tempTd = tdInPosition
                        /** 位移列 */
                        let tempTr = targetRow
                        do {
                            const frontElement = tempTd
                            if (!frontElement) break
                            if (frontElement.rowSpan > 1 || frontElement.colSpan > 1) {
                                /** 處理非為相同合併欄位時，需新增新的一列 */
                                let y = frontElement.parentNode.parentNode.children.indexOf(frontElement.parentNode)
                                if (((frontElement !== otherCell) && 
                                    (((y + frontElement.rowSpan - 1) < otherCell.parentNode.parentNode.children.indexOf(otherCell.parentNode)) || 
                                    (y > otherCell.parentNode.parentNode.children.indexOf(otherCell.parentNode)))) || 
                                    (frontElement.rowSpan === 1 && frontElement.colSpan > 1)) {
                                    tdClone.classList.remove('hide')
                                    break
                                }
                                if (!isAdded) frontElement.rowSpan++
                                colspan = frontElement.colSpan
                                startLoop = false
                                isAdded = true
                                count++
                            } else if (!frontElement.classList.contains('hide')) startLoop = false
                            /** 
                             * 循環查詢邏輯：
                             * 從當前表格查無後先向上查詢
                             * 向上查超出範圍後
                             * 回到原位向左一欄繼續查詢
                             * 範例：
                             *  _ _ _ _
                             * | 4   2 |
                             * |_3_ _1_|
                             */
                            tempTr = tempTr.previousElementSibling
                            if (!tempTr || (!tempTr.children[xAxis].classList.contains('hide') && tempTr.children[xAxis].rowSpan === 1) && startLoop) {
                                tempTr = targetRow
                                tempTd = targetRow.children[--xAxis]
                            } else tempTd = tempTr.children[xAxis]
                        } while (startLoop)
                    }
                }
				if (colspan === count) {
                    count = 0
                    isAdded = false
                }
				trClone.appendChild(tdClone)
			}
			trClone.classList.value = targetRow.classList.value
			if (button.classList.contains('top')) targetRow.before(trClone)
            else targetRow.after(trClone)
		} catch (e) {
			CreateUtils.createModal(`alert`, {body: errorCodeDescription.ED0012})
			console.error(`error: ${ e }`)
		}
	}
	/** 左右方新增欄位 概念相似上下方新增欄位 */
	if (button.classList.contains('left') || button.classList.contains('right')) {
		/** 當前表格 X 軸 */
		let position = targetRow.children.indexOf(tableCell)
		let isPrintTitle = false
		if ((tableCell.rowSpan > 1 || tableCell.colSpan > 1) && button.classList.contains('right')) position += (tableCell.colSpan - 1)
		allTableRows.forEach((tr, index) => {
			let tdInPosition = tr.children[position]
			const tdClone = CreateUtils.createBeanElement({
				'controlType': tdInPosition.tagName.toLowerCase() === 'td' ? 'tabledata' : 'tablehead',
				'attribute': 	[
					{
						'class': tdInPosition.classList.contains('print-title-col') ? 'print-title-col' : '',
						'data-role': 'drag-drop-container',
					}
				]
			})[0]
			tdClone.innerHTML = '&nbsp;'
			if (tdInPosition.classList.contains('print-title-col')) isPrintTitle = true
			if (tagName === 'th') {
				tdClone.classList.add('text-center')
				if (index === 0) {
					tdClone.classList.add('canEditDiv')
					delete tdClone.dataset.role
				}
			}
			if (tdInPosition.colSpan > 1) {
				if (tdInPosition !== tableCell && button.classList.contains('right')) {
					if (!isAdded) tdInPosition.colSpan++
					tdClone.classList.add('hide')
					isAdded = true
					count++
				} else if (tdInPosition === tableCell && button.classList.contains('right')) {
					tdInPosition = tr.children[position + tdInPosition.colSpan - 1]
				}
				rowspan = tdInPosition.rowSpan
			} else if (tdInPosition.classList.contains('hide')) {
				let otherCell
				if (button.classList.contains('right')) otherCell = tdInPosition.nextElementSibling
				if (button.classList.contains('left')) otherCell = tdInPosition.previousElementSibling
				if (otherCell && (otherCell.classList.contains('hide') || otherCell.colSpan > 1)) {
					tdClone.classList.add('hide')
					let startLoop = true
					let tempTd = tdInPosition
					let tempTr = tr
					do {
						const frontElement = tempTd
						if (!frontElement) break
						if (frontElement.colSpan > 1 || frontElement.rowSpan > 1) {
							if (((frontElement !== otherCell) && 
								(((frontElement.cellIndex + frontElement.colSpan - 1) < otherCell.cellIndex) || 
								(frontElement.cellIndex > otherCell.cellIndex))) || 
								(frontElement.colSpan === 1 && frontElement.rowSpan > 1)) {
								tdClone.classList.remove('hide')
								break
							}
							if (!isAdded) frontElement.colSpan++
							rowspan = frontElement.rowSpan
							startLoop = false
							isAdded = true
							count++
						} else if (!frontElement.classList.contains('hide')) startLoop = false
						/** 
						 * 循環查詢邏輯：
						 * 從當前表格查無後先向左查詢
						 * 向左查超出範圍後
						 * 回到原位向上一列繼續查詢
						 * 範例：
						 *  _ _ _ _
						 * | 4   3 |
						 * |_2_ _1_|
						 */
						tempTd = frontElement.previousElementSibling
						if (((!tempTd || (!tempTd.classList.contains('hide') && tempTd.colSpan === 1)) && startLoop) && (tempTr && tempTr.previousElementSibling)) {
							tempTd = tempTr.previousElementSibling.children[position]
							tempTr = tempTr.previousElementSibling
						}
					} while (startLoop)
				}
			}
			if (rowspan === count) {
				count = 0
				isAdded = false
			}
			if (button.classList.contains('left')) tdInPosition.before(tdClone)
			else tdInPosition.after(tdClone)
		})
		const trWordCount = table.querySelector('.trWordCountSetting')
		if (trWordCount) {
			// trWordCountSetting欄位跟著增加td
			const wordCountColumn = CreateUtils.createBeanElement({
				'controlType': 'tabledata',
				'attribute': 	[
					{
						'class': `CustomizeColWidth ${ isPrintTitle ? 'print-title-col' : '' }`,
						'data-word-count': '',
						'children':  [
							{
								'div': {
									'class': 'fillWordsCol',
									'children': []
								}
							},
							{
								'div': {
									'class': 'displayCounts',
									'children': []
								}
							}
						]
					}
				]
			})[0]

			if (button.classList.contains('left')) trWordCount.children[position].before(wordCountColumn)
			else if (button.classList.contains('right')) trWordCount.children[position].after(wordCountColumn)
			newCustomizeColInitial()
		}
	}
	initDrawPageEvent()
	initEditDiv()
}

/**
 * 資料欄位選取事件
 * =
 * td 點擊選取效果\
 * 取消所有元件選取\
 * 若連續選取影響工具包合併顯示\
 * 若重複選取取消全部表格選取\
 * ※Bug註記 - 選取連續儲存格 + 單一儲存格沒有彈出錯誤訊息
 * @param {Event} e 
 */
function tdSelect(e) {
	// 取消所有有選取的元件事件
	SharedUtils.clearSelectedElements()
	SharedUtils.cancelDefault(e)
	/** 當前點擊的資料表格 */
	const tableData 	= this
	/** 該資料表格所在列 */
	const tableRow		= tableData.closest('tr')
	/** 該資料表格所在表格 */
	const tableParent 	= tableData.closest('table')
	/** 該資料表格所在表身 */
	const parentBody 	= tableData.closest('tbody')
	/** 當前列所有選取的資料表格 */
	const rowSelected 	= tableRow.querySelectorAll('td.active')
	/** 當前表格所有選取的資料表格 */
	const selectedCell 	= tableParent.querySelectorAll('td.active')
	/** 當前表格位置 */
	let x 				= tableData.parentNode.children.indexOf(tableData)
	/** 當前所在列位置 */
	let y 				= tableRow.parentNode.children.indexOf(tableRow)
	/** 當前欄位直向合併數量 */
	let rowSpan 		= this.rowSpan || 1
	/** 當前欄位橫向合併數量 */
	let colSpan 		= this.colSpan || 1
	/** 滑鼠位置 */
	let offsetY 		= e.offsetY
	/** 跳出迴圈例外用 */
	const breakException = {errorMsg: ''}
	// 檢查是否是整欄選取
	if (offsetY < 0) {
		SharedUtils.clearTableActiveData()
		for (let tr of parentBody.children) {
			const targetTd = tr.children[x]
			if (targetTd.rowSpan > 1 || targetTd.colSpan > 1) {
				SharedUtils.clearTableActiveData()
				CreateUtils.createModal(`alert`, {body: errorCodeDescription.ED0017})
				break
			}
			targetTd.click()
		}
		return
	}
	// 檢查是否選取連續的儲存格 (檢查當前點擊是否為上一次點擊的上下左右欄位，若非則彈出警告訊息)
	if (!tableData.classList.contains('active') && selectedCell.length > 0) {
		let count 			= 0 
		let notClass 		= 0
		let positionY 		= 0
		const positionArray = getSideCellPosition(x, y) 
		for (let tr of parentBody.children) {
			let positionX 	= 0
			for (let td of tr.children) {
				for (let value of positionArray) {
					if (value[0] === positionX && value[1] === positionY) {
						if (!td.classList.contains('active')) notClass++
						count++
						if (count === positionArray.length) continue
						break
					}
				}
				positionX++
			}
			if (count === positionArray.length) break
			positionY++
		}
			
		if (notClass === count) { 
			CreateUtils.createModal(`alert`, {body: errorCodeDescription.ED0018})
			console.log(`只能選擇這些欄位 => ${ positionArray }`)
			return false
		}
	}
	// 檢查是否選取連續的垂直或水平儲存格 (依據之前的選取方式進行檢查，若前兩格為水平則都只能選擇水平，反之亦然)
	if (!tableData.classList.contains('active') && selectedCell.length > 1) {
		let result 			= ''
		let checkPosition 	= isColRow(tableParent)
		try {
			selectedCell.forEach(td => {
				const parentTr 		= td.parentNode
				const parentTBody 	= td.closest('tbody')
				let positionX = parentTr.children.indexOf(td)
				let positionY = parentTBody.children.indexOf(parentTr)
				let errorMsg  = ''
				if (checkPosition === 'col') { 
					if (positionY !== y) {
						result = errorCodeDescription.ED0019
						errorMsg = result
						breakException.errorMsg = errorMsg
						throw breakException
					}
				} else if (checkPosition === 'row') {
					if (positionX !== x) {
						result = errorCodeDescription.ED0020
						errorMsg = result
						breakException.errorMsg = errorMsg
						throw breakException
					}
				}
			})
		} catch (e) { console.error(e) }
		if (result.length > 0) {
			CreateUtils.createModal(`alert`, {body: result})
			return false
		}
	}
	// 欄位選取提示，若重複點擊移除所有提示
	if (tableData.classList.contains('active')) SharedUtils.clearTableActiveData()
	else tableData.classList.add('active')

	// 列印頁額外檢查規則
	if (isPrintPage()) {
		const allResultTable 		= document.querySelectorAll('.resultTable')
		const allSelectedTableData 	= document.querySelectorAll('.resultTable tbody td.active')
		allResultTable.forEach(table => table.classList.remove('active'))
		allSelectedTableData.forEach(activeTd => {
			const activeTable = activeTd.closest('table')
			if (activeTable === tableParent) activeTable.classList.add('active')
			else activeTd.classList.remove('active')
		})
	}
	
	// 檢查合併欄位不能再次點擊其他欄位，需要進行分解後才可多欄位選取，合併欄位不能再次與其他欄位合併
	if (selectedCell.length > 1) {
		let unPass = false
		try {
			selectedCell.forEach(td => {
				if ((td.rowSpan || 1 - 0) > 1 || ((td.colSpan || 1 - 0) > 1)) {
					unPass = true
					throw breakException
				}
			})
		} catch (e) { }
		if (unPass) {
			tableData.classList.remove('active')
			CreateUtils.createModal(`alert`, {body: errorCodeDescription.ED0021})
		}
	}
	// 工具包按鈕顯示控制
	let positionSelected 	= isColRow(tableParent)
	let toolSetting 		= {}
	let isOpen 				= false
	const combineCellButton = document.querySelector('#combineCell')
	const disassembleButton = document.querySelector('#disassemble')
	// 合併按鈕
	if (positionSelected === 'col' || positionSelected === 'row') {
		if (positionSelected === 'col') combineCellButton.classList.add('rotate')
		else combineCellButton.classList.remove('rotate')
		toolSetting["#combineCell"] = true
		isOpen = true
	} else {
		combineCellButton.classList.remove('rotate')
		toolSetting["#combineCell"] = false
	}
	// 分解按鈕
	if ($(this).hasClass('active') && (rowSpan > 1 || colSpan > 1)) {
		if (rowSpan > 1) disassembleButton.classList.remove('rotate')
		else disassembleButton.classList.add('rotate')
		toolSetting["#disassemble"] = true
		isOpen = true
	} else {
		disassembleButton.classList.remove('active', 'rotate')
		toolSetting["#disassemble"] = false
	}
	// 刪除按鈕
	if ((positionSelected === 'col' && rowSelected.length === tableRow.children.length) ||
		(positionSelected === 'row' && parentBody.children.length === (selectedCell.length + 1))) {
		toolSetting["#deleteBean"] = true
		isOpen = true
	}
	// 貼上按鈕
	if (tableData.classList.contains('active') && window.localStorage["clipboard"] !== undefined) {
		toolSetting["#pasteBtn"] = true
		isOpen = true
	}
	if (selectedCell.length === 0) {
		/** 引入工廠 */
		const factory = window.ComponentFactory
		/** 屬性清單元素 */
		const materialList = document.querySelector('#materialList')
		const styleComponent = factory.modifyStyleComponent(tableData)
		for (let moduleName in styleComponent.attributesModules) {
			const moduleElement = styleComponent.attributesModules[moduleName]
			materialList.appendChild(moduleElement)
		}
	}
	toolPackActive(isOpen, toolSetting)
	beanFocusStopDrop(true)
}

/**
 * 標題欄位選取事件
 * =
 * @param {Event} e 
 */
function thSelect(e) {
	SharedUtils.cancelDefault(e)
	/** 當前點擊的標題表格 */
	const tableHead 	= this
	/** 該標題表格所在表格 */
	const table 		= tableHead.closest('table')
	/** 所有選取的標題表格 */
	const activeHeads 	= table.querySelectorAll('th.active')
	/** 工具包設定參數 */
	const toolSetting 	= {}
	/** 工具包是否開啟 */
	let isOpen 			= false
	if (tableHead.classList.contains('active')) activeHeads.forEach(th => th.classList.remove('active'))
	else tableHead.classList.add('active')
	// 刪除按鈕
	if (activeHeads.length > 0) {
		toolSetting["#deleteBean"] = true
		isOpen = true
	}
	toolPackActive(isOpen, toolSetting)
}

/**
 * 元件(元素)選取
 * =
 * 若沒點擊 ctrl，則單一選取\
 * 單一選取將其餘原本選取的物件取消\
 * 顯示屬性區塊全部屬性\
 * 加入前後拖曳框\
 * 若點擊 ctrl，則多重選取\
 * 多重選取用於複製及工具包內的計分工具
 * 
 * @param {Event} e 
 */
function elementSelected(e) {
	/** 引入元件工廠 */
	const factory = window.ComponentFactory
	// 若目前為編輯狀態則不進行元素選取、移除欄位選取狀態
	if (SharedUtils.isEditing()) return
	SharedUtils.clearTableActiveData()
	beanFocusStopDrop(true)
	/** 選取元素 / selector */
	let $selectedTarget, selectedTarget
	if (e instanceof Element) { 
		$selectedTarget = $(e)
		selectedTarget = $selectedTarget[0]
	} else {
		$selectedTarget = $(this)
		selectedTarget = $selectedTarget[0]
		if (selectedTarget.dataset.edit === undefined) {
			if (selectedTarget.parentNode.dataset.edit === undefined) return
			else {
				$selectedTarget = $selectedTarget.parent()
				selectedTarget = $selectedTarget[0]
			}
		}
		// 解除下拉框顯示狀態
		const selectElement = selectedTarget.querySelectorAll('select')
		if(selectElement.length > 0) {
			setTimeout(() => {
				selectElement.forEach(select => select.blur())
			}, 1200)
		}
		SharedUtils.cancelDefault(e)
	}
	if (selectedTarget.dataset.webComponent && selectedTarget.dataset.webComponent === "print") return
	try {
		/** 屬性清單元素 */
		const materialList = document.querySelector('#materialList')
		/** 相同區塊內 */
		let isSameParent = true
		materialList.innerHTML = ''
		// 判斷是否重複選取
		if (selectedTarget.classList.contains('selected')) {
			if (document.querySelectorAll('.selected').length === 1) {
				SharedUtils.clearSelectedElements()
				toolPackActive(false)
				return false
			}
		}
		// 非元件類選取
		if (selectedTarget.dataset.edit === undefined || selectedTarget.dataset.isBean === undefined) {
			SharedUtils.clearSelectedElements()
			selectedTarget.classList.add('selected')
			const styleComponent = factory.modifyStyleComponent(selectedTarget)
			for (let moduleName in styleComponent.attributesModules) {
				const moduleElement = styleComponent.attributesModules[moduleName]
				materialList.appendChild(moduleElement)
			}
		} else {
		// 元件類選取
			// 新增頁選取
			if (isListPage()) {
				// 若需要在清單頁自訂編輯屬性去對應區域新增
				SharedUtils.clearSelectedElements()
				selectedTarget.classList.add('selected')
				/** 取得元件序號 */
				const seq 				= selectedTarget.dataset.seq
				/** 取得元件 */
				const selectedComponent = factory.getRegisterComponentBySeq(seq)
				/** 製成元件屬性模組並渲染(若有) */
				if (selectedComponent.listAttributeModules) {
					for (let moduleName in selectedComponent.listAttributeModules) {
						const moduleElement = selectedComponent.listAttributeModules[moduleName]
						materialList.appendChild(moduleElement)
					}
				} else {
					const titleNode = CreateUtils.createBeanElement({
						'controlType': 'div',
						'attribute': 	[
							{
								'class': 'col-12 text-center',
								'text': '無任何屬性可以編輯'
							}
						]
					})[0]
					materialList.appendChild(titleNode)
				}
			}
			if (isPrintPage()) {
				SharedUtils.clearSelectedElements()
				selectedTarget.classList.add('selected')
				/** 取得元件序號 */
				const seq 				= selectedTarget.dataset.seq
				/** 取得元件 */
				const selectedComponent = factory.getRegisterComponentBySeq(seq)
				if (selectedComponent.printAttributeModules) {
					for (let moduleName in selectedComponent.printAttributeModules) {
						const moduleElement = selectedComponent.printAttributeModules[moduleName]
						materialList.appendChild(moduleElement)
					}
				} else {
					const styleComponent = factory.modifyStyleComponent(selectedTarget)
					for (let moduleName in styleComponent.attributesModules) {
						const moduleElement = styleComponent.attributesModules[moduleName]
						materialList.appendChild(moduleElement)
					}
					// const titleNode = CreateUtils.createBeanElement({
					// 	'controlType': 'div',
					// 	'attribute': 	[
					// 		{
					// 			'class': 'col-12 text-center',
					// 			'text': '無任何屬性可以編輯'
					// 		}
					// 	]
					// })[0]
					// materialList.appendChild(titleNode)
				}
			} 
			if (isAddPage()) {
				if (e.ctrlKey) {
					// 單一多重選取 (controlKey)
					if (selectedTarget.classList.contains('selected')) selectedTarget.classList.remove('selected')
					else selectedTarget.classList.add('selected')
					const allSelectedElement 	= document.querySelectorAll('.selected')
					let lastParentElement
					allSelectedElement.forEach(element => {
						if (lastParentElement && lastParentElement !== element.closest('td')) isSameParent = false
						const dropContainer = element.querySelectorAll('.bean-drop')
						dropContainer.forEach(container => container.remove())
						lastParentElement = element.closest('td')
					})
				} else if (e.shiftKey) { 
					/**
					 * 連續多重選取 (shiftKey)
					 * 規則:
					 * 		依照表格的 x, y 距離進行多選元件
					 */
					/** 當前選取元件的頂層 table */
					const closestTable 		= selectedTarget.closest('table')
					/** 當前選取元件的頂層 td */
					const closestTableData 	= selectedTarget.closest('td')
					/** 當前選取元件的頂層 tr */
					const closestTableRow 	= selectedTarget.closest('tr')
					/** 當前選取元件方位 x */
					const x 				= closestTableRow.children.indexOf(closestTableData)
					/** 當前選取元件方位 y */
					const y 				= closestTableRow.parentNode.children.indexOf(closestTableRow)
					/** 最後一筆元素父層 */
					let lastParentElement
					/** 所有選取元素 */
					const allElements 		= document.querySelectorAll('.selected')
					allElements.forEach(element => {
						const dropContainer = element.querySelectorAll('.bean-drop')
						dropContainer.forEach(container => container.remove())
					})
					// 若包含 selected 則將後續的 selected 移除
					if (selectedTarget.classList.contains('selected')) {
						const position = allElements.indexOf(selectedTarget)
						allElements.forEach((element, index) => {
							if (index > position) element.classList.remove('selected')
						})
					} else {
						// 若沒包含則是經過的都添加 selected
						if (allElements.length === 0) selectedTarget.classList.add('selected')
						else {
							/** 最初選取元件的頂層 td */
							const originTableData 	= allElements[0].closest('td')
							/** 最初選取元件的頂層 tr */
							const originTableRow 	= allElements[0].closest('tr')
							/** 最初選取元件的方位 x */
							const originX 			= originTableRow.children.indexOf(originTableData)
							/** 最初選取元件的方位 y */
							const originY 			= originTableRow.parentNode.children.indexOf(originTableRow)
							for (let i = originY; i <= y; ++i) {
								for (let j = originX; j <= x; ++j) {
									const tableRows = closestTable.querySelectorAll('tr')
									const targetTableData = tableRows[i].children[j]
									const insideBeans = targetTableData.querySelectorAll('div[draggable="true"]')
									insideBeans.forEach(bean => bean.classList.add('selected'))
								}
							}
						}
					}
					document.querySelectorAll('.selected').forEach(element => {
						if (lastParentElement && lastParentElement !== element.parentNode) isSameParent = false
						lastParentElement = element.parentNode
					})
				} else {
					// 一般元件選取
					SharedUtils.clearSelectedElements()
					selectedTarget.classList.add('selected')
					/** 取得元件 */
					const controlType 		= selectedTarget.dataset.controlType
					/** 取得元件序號 */
					const seq 				= selectedTarget.dataset.seq
					/** 取得元件 */
					const selectedComponent = factory.getRegisterComponentBySeq(seq)
					/** 製成元件屬性模組並渲染 */
					for (let moduleName in selectedComponent.attributesModules) {
						const moduleElement = selectedComponent.attributesModules[moduleName]
						materialList.appendChild(moduleElement)
					}
					/** 元件前放置區域 */
					const beanBefore = CreateUtils.createBeanElement({
						'controlType': 'div',
						'attribute': 	[
							{
								'class': 		'bean-drop drop-before',
								'data-role':	'drag-drop-container-bean'
							}
						]
					})[0]
					/** 元件後放置區域 */
					const beanAfter = CreateUtils.createBeanElement({
						'controlType': 'div',
						'attribute': 	[
							{
								'class': 		'bean-drop drop-after',
								'data-role':	'drag-drop-container-bean'
							}
						]
					})[0]
					if (controlType === 'checkbox' || controlType === 'radio') {
						for (let node of selectedTarget.children) {
							node.prepend(beanBefore.cloneNode(true))
							node.appendChild(beanAfter.cloneNode(true))
						}
					} else {
						if (controlType !== 'button' && controlType !== 'iframe') {
							selectedTarget.prepend(beanBefore.cloneNode(true))
							selectedTarget.appendChild(beanAfter.cloneNode(true))
						} 
					}
					beanFocusStopDrop(false)
				}
			}
		}
		if (selectedTarget.tagName.toLowerCase() !== 'table') {
			const toolSetting = {'#deleteBean': true, '#copyBtn': true}
			if (window.localStorage["clipboard"] !== undefined) toolSetting["#pasteBtn"] = true
			if (e.ctrlKey || e.shiftKey || selectedTarget.dataset.controlType === 'totalScore') toolSetting["#scoreBtn"] = true
			else toolSetting["#scriptBtn"] = true
			if (isSameParent) toolSetting["#groupUpBtn"] = true
			else toolSetting["#groupUpBtn"] = false
			if (selectedTarget.dataset.controlType === 'group') toolSetting["#groupDownBtn"] = true
			else toolSetting["#groupDownBtn"] = false
			toolPackActive(true, toolSetting)
		} else toolPackActive(false)
		initEditDiv()
	} catch (e) {
		console.log(e)
		console.error(`config didn't setting success...`)
	}
}

/**
 * list清單元件(元素)選取
 * =
 * 對應素材資訊及提供可編輯參數顯示
 * @param {Event} e
 */
function listElementSelected(e) {
	/** 引入元件工廠 */
	const factory = window.ComponentFactory
	// 若目前為編輯狀態則不能進行元素選取、移除欄位選取狀態
	if (SharedUtils.isEditing()) return
	SharedUtils.clearTableActiveHead()
	// 依據選取判斷是否為元素或元件進行物件綁定
	let selectedTarget 	= this
	let $selectedTarget = $(this)
	if (selectedTarget.dataset.edit === undefined) {
		if (selectedTarget.parentNode.dataset.edit === undefined) return
		else { 
			$selectedTarget = $selectedTarget.parent()
			selectedTarget 	= $selectedTarget[0]
		}
	}
	const selectElement = selectedTarget.querySelectorAll('select')
	if(selectElement.length > 0) {
		setTimeout(() => {
			selectElement.forEach(select => select.blur())
		}, 1200)
	}
	SharedUtils.cancelDefault(e)
	try {
		const materialList = document.querySelector('#materialList')
		materialList.innerHTML = ''
		// if (selectedTarget.classList.contains('selected')) {
		// 	if (document.querySelectorAll('.selected').length === 1) {
		// 		if (selectedTarget.dataset.controlType === 'csCanvas')  // csCanvas 人形圖要取消style寬高
		// 			selectedTarget.removeAttribute('style')
		// 		selectedTarget.classList.remove('selected', 'hover')
		// 		toolPackActive(false)
		// 		return false
		// 	}
		// }
		SharedUtils.clearSelectedElements()
		selectedTarget.classList.add('selected')
		// if (selectedTarget.dataset.controlType === 'csCanvas') { // csCanvas 人形圖要賦予style寬高
		// 	let style 	 = ""
		// 	style 		+= `width: ${ selectedTarget.dataset.width }px;`
		// 	style 		+= `height: ${ selectedTarget.dataset.height }px;`
		// 	selectedTarget.setAttribute('style', style)
		// }
		/** 元件類型 */
		const controlType = selectedTarget.dataset.type
		/** 取得元件 */
		const selectedComponent = factory.getListComponent(controlType)
		/** 製成元件屬性模組並渲染(若有) */
		if (selectedComponent.attributesModules) {
			for (let moduleName in selectedComponent.attributesModules) {
				const moduleElement = selectedComponent.attributesModules[moduleName]
				materialList.appendChild(moduleElement)
			}
		} else {
			const titleNode = CreateUtils.createBeanElement({
				'controlType': 'div',
				'attribute': 	[
					{
						'class': 'col-12 text-center',
						'text': '無任何屬性可以編輯'
					}
				]
			})[0]
			materialList.appendChild(titleNode)
		}
		
		// for (let i = 0, len = listAttributesList[controlType].length; i < len; ++i) {
		// 	switch (attribute) {
		// 		case 'width':
		// 		case 'height':
		// 			let widthPixel = selectedTarget.dataset[attribute] || '250px'
		// 			let widthNum, widthMin = 0, widthMax = 50
		// 			widthPixel += ''
		// 			widthNum = widthPixel
		// 			widthMin = 200
		// 			widthMax = 1500
		// 			let elementRange = CreateUtils.createBeanElement({
		// 				'controlType': 'text',
		// 				'attribute': 	[
		// 					{
		// 						'class': 	'form-control-range',
		// 						'type': 	'range',
		// 						'name': 	attribute,
		// 						'min': 		widthMin,
		// 						'max': 		widthMax,
		// 						'value':  	widthNum,
		// 						'oninput': 'settingDataAttribute(this)'
		// 					}
		// 				]
		// 			}, false)
		// 			finalArray = row.concat(CreateUtils.createBeanElement({
		// 				'controlType': 'div',
		// 				'attribute': 	[
		// 					{
		// 						'class': 			'col-9 subContent',
		// 						'children': 		elementRange,
		// 						'data-attribute': 	attribute
		// 					}
		// 				]
		// 			}))
		// 			break

		// 		case 'templateDivIsShowDiv':
		// 		case 'templateDivDisPlayMode':
		// 			let txtArr 		= ["垂直", "水平"]
		// 			let valArr 		= ["vertical", "horizontal"]
		// 			let nodeChild 	= []
		// 			for (let j = 0, len2 = txtArr.length; j < len2; j++) {
		// 				let chkId  		= SharedUtils._uuid()
		// 				let actualValue = selectedTarget.dataset[attribute]
		// 				if (actualValue === undefined) actualValue = ''
		// 				let radioNode 	= {
		// 					'controlType': 'radio',
		// 					'attribute': 	[
		// 						{
		// 							'class': 'form-check form-check-inline',
		// 							'childrenAtt': [
		// 								{
		// 									'id': 		chkId,
		// 									'name': 	attribute,
		// 									'value': 	valArr[j],
		// 									'checked': 	(actualValue == valArr[j]) ? 'checked' : null,
		// 									'onclick': 'settingDataAttribute(this)'
		// 								},
		// 								{
		// 									'for': 	chkId,
		// 									'text': txtArr[j]
		// 								}
		// 							]
		// 						}
		// 					]
		// 				}
		// 				let dittoBox = CreateUtils.createBeanElement(radioNode, false)
		// 				nodeChild 	 = nodeChild.concat(dittoBox)
		// 			}
		// 			let element = CreateUtils.createBeanElement({
		// 				'controlType': 'div',
		// 				'attribute': 	[
		// 					{
		// 						'class': 	'form-row',
		// 						'children': nodeChild
		// 					}
		// 				]
		// 			}, false)
		// 			finalArray = row.concat(CreateUtils.createBeanElement({
		// 				'controlType': 'div',
		// 				'attribute': 	[
		// 					{
		// 						'class': 			'col-9 subContent',
		// 						'children': 		element,
		// 						'data-attribute': 	attribute
		// 					}
		// 				]
		// 			}))
		// 			break
		// 		case 'controlMode':
		// 		case 'templateDivPosition':
		// 		case 'format':
		// 		case 'allSelect': // 所有 select 元件共用
		// 			let optionsValue 	= []
		// 			let optionsText		= []
		// 			if (attribute === 'controlMode') {
		// 				optionsValue 	= ["canvas", "text"]
		// 				optionsText 	= ["一般人形圖", "純文字顯示"]
		// 			} else if (attribute === 'format') {
		// 				optionsValue 	= ["yyyy-MM-dd", "yyyy/MM/dd", "yyyy-MM-dd HH:mm", "yyyy/MM/dd HH:mm"]
		// 				optionsText 	= optionsValue
		// 			} else if (attribute === 'templateDivPosition') {
		// 				optionsValue 	= ["top", "bottom", "left", "right"]
		// 				optionsText 	= ["上", "下", "左", "右"]
		// 			}
		// 			let optionArray  = []
		// 			for (let j = 0, len2 = optionsValue.length; j < len2; j++) {
		// 				let actualValue = selectedTarget.dataset[attribute]
		// 				if (actualValue === undefined) actualValue = ''
		// 				let optionBox = CreateUtils.createBeanElement({
		// 					'controlType': 'option',
		// 					'attribute': 	[
		// 						{
		// 							'text': 	optionsText[j],
		// 							'value': 	optionsValue[j],
		// 							'selected': (actualValue == optionsValue[j]) ? 'selected' : null
		// 						}
		// 					]
		// 				}, false)
		// 				optionArray = optionArray.concat(optionBox)
		// 			}
		// 			let selectBox = CreateUtils.createBeanElement({
		// 				'controlType': 'select',
		// 				'attribute': 	[
		// 					{
		// 						'name': 	attribute,
		// 						'id': 		attribute,
		// 						'onchange': 'settingDataAttribute(this)',
		// 						'children': optionArray
		// 					}
		// 				]
		// 			}, false)
		// 			finalArray = row.concat(CreateUtils.createBeanElement({
		// 				'controlType': 'div',
		// 				'attribute': 	[
		// 					{
		// 						'class': 			'col-9 subContent',
		// 						'children': 		selectBox,
		// 						'data-attribute': 	attribute
		// 					}
		// 				]
		// 			}))
		// 			break
		// 		default:
		// 			finalArray = row.concat(CreateUtils.createBeanElement({
		// 				'controlType': 'div',
		// 				'attribute': 	[
		// 					{
		// 						'class': 			'col-9 subContent',
		// 						'text': 			selectedTarget.dataset[attribute] || '施工中',
		// 						'data-attribute': 	attribute
		// 					}
		// 				]
		// 			}))
		// 			break
		// 	}
		// 	finalArray.forEach(ele => materialList.appendChild(ele))
		// }
		// 設定當元件參數修改時要做的事
		// let selectedChangeFunc = null
		// let type = selectedTarget.dataset.type
		// switch (type) {
		// 	case 'lastUpdTime':
		// 	case 'createTime':
		// 		selectedChangeFunc = function() {
		// 			localStorage.listEleChangeEvent = "has listener";
		// 			this.innerHTML = `${ this.dataset.title }(${ this.dataset.format })`
		// 		}
		// 		break
		// 	case 'status':
		// 		selectedChangeFunc = function() {
		// 			localStorage.listEleChangeEvent = "has listener";
		// 			this.innerHTML = `${ this.dataset.title }(${ this.dataset.statusDescArr })`
		// 		}
		// 		break
		// 	default:
		// 		break
		// }
		// if (selectedChangeFunc) {
		// 	// 防止重複 addListener
		// 	delete localStorage.listEleChangeEvent
		// 	if ('createEvent' in document) {
		// 		var evt = document.createEvent('HTMLEvents')
		// 		evt.initEvent('listEleChangeEvent', false, true)
		// 		selectedTarget.dispatchEvent(evt)
		// 	} else console.error('Not Support CreateEvent')
		// 	if (!localStorage.listEleChangeEvent) selectedTarget.addEventListener('listEleChangeEvent', selectedChangeFunc, false)
		// }
		// if (selectedTarget.tagName.toLowerCase() !== 'table') {
		// 	let toolSetting = {'#deleteBean': true, '#copyBtn': true}
		// 	if (window.localStorage["clipboard"] !== undefined) toolSetting["#pasteBtn"] = true
		// 	toolPackActive(true, toolSetting)
		// } else toolPackActive(false)
		initEditDiv()
	} catch (e) {
		console.error(`config didn't setting success...`, e)
	}
}

/**
 * print列印元件(元素)選取
 * =
 * 對應素材資訊及提供可編輯參數顯示
 * @param {Event} e
 */
function printElementSelected(e) {
	/** 引入元件工廠 */
	const factory = window.ComponentFactory
	// 若目前為編輯狀態則不能進行元素選取、移除欄位選取狀態
	if (SharedUtils.isEditing()) return
	SharedUtils.cancelDefault(e)
	SharedUtils.clearTableActiveHead()
	beanFocusStopDrop(true)
	// 依據選取判斷是否為元素或元件進行物件綁定
	const materialList = document.querySelector('#materialList')
	materialList.innerHTML = ''
	if (this.classList.contains('selected')) {
		this.classList.remove('selected')
		return 
	} else {
		SharedUtils.clearSelectedElements()
		this.classList.add('selected')
	}
	/** 元件類型 */
	const printSeq = this.dataset.printSeq
	/** 取得元件 */
	const component = factory.getPrintComponent(printSeq)
	/** 製成元件屬性模組並渲染(若有) */
	if (component.attributesModules) {
		for (let moduleName in component.attributesModules) {
			const moduleElement = component.attributesModules[moduleName]
			materialList.appendChild(moduleElement)
		}
	} else {
		const titleNode = CreateUtils.createBeanElement({
			'controlType': 'div',
			'attribute': 	[
				{
					'class': 'col-12 text-center',
					'text': '無任何屬性可以編輯'
				}
			]
		})[0]
		materialList.appendChild(titleNode)
	}
	initEditDiv()
}

/**
 * 點擊移除事件
 * =
 * @param {Event} e 
 */
function deleteSelectedBean(e) {
	/** 表單畫布 */
	const drawPage 		= document.querySelector('#drawPage')
	/** 屬性清單區塊 */
	const materialList 	= document.querySelector('#materialList')
	/** 所有選取的元素 */
	const selectedBean 	= drawPage.querySelectorAll('.selected')
	// 選取元件數量若大於零則判定為元件移除事件
	if (selectedBean.length > 0) {
		// 如果是 csCanvas 還要移除 select
		selectedBean.forEach(bean => {
			const controlType 	= bean.dataset.controlType
			const beanName 		= bean.dataset.bean
			// 移除所選元件
			if (controlType === 'csCanvas') { 
				// 若元件類型為 csCanvas
				const canvasProp = drawPage.querySelector(`#${ beanName }_selectCsCanvasProp`)
				if (canvasProp !== null) canvasProp.remove()
			}
			removeParameterBean(bean)
		})
		materialList.innerHTML = ''
		beanFocusStopDrop(true)
		initButton()
		initDrawPageEvent()
	} else {
		// 其餘判定是否表格有選取，若有則移除
		const activeTableHead 	= drawPage.querySelectorAll('th.active')
		const activeTableData 	= drawPage.querySelectorAll('td.active')
		if (activeTableHead.length > 0) {
			activeTableHead.forEach(th => {
				const position 	= th.parentNode.children.indexOf(th)
				const thead 	= drawPage.querySelectorAll('thead tr th')
				thead[position].classList.add('active')
			})
			drawPage.querySelectorAll('th.active').forEach(th => {
				removeParameterBean(th)
			})
		} else {
			const activeTable 	= drawPage.querySelector('div.tab-pane.active > table')
			if (activeTable) {
				const allTableData 	= activeTable.querySelectorAll('td')
				if (activeTableData.length > 1 && (allTableData.length !== activeTableData.length)) {
					activeTableData.forEach(td => {
						removeParameterBean(td)
					})
					const tableRows = drawPage.querySelectorAll('tbody tr')
					tableRows.forEach(tr => {
						if (tr.children.length === 0)
							removeParameterBean(tr)
					})
				}
			} else {
				drawPage.querySelectorAll('td.active').forEach(td => {
					removeParameterBean(td)
				})
				const tableRows = drawPage.querySelectorAll('tbody tr')
				tableRows.forEach(tr => {
					if (tr.children.length === 0)
						removeParameterBean(tr)
				})
			}
		}
	}
	beanToListEvent()
	toolPackActive(false)
	SharedUtils.clearTableHoverButton()
	SharedUtils.cancelDefault(e)
	checkCustomizeColSetting();
}

/**
 * 移除傳入參數元素元件及相關處理
 * =
 * @param {Element} element 
 */
function removeParameterBean(element) {
	/** 引入工廠 */
	const factory 		= window.ComponentFactory
	/** 表單畫布 */
	const drawPage 		= document.querySelector('#drawPage')
	/** 元素父層 */
	let elementParent = element.parentNode
	if (element) {
		/** 準備被移除元素的類型 */
		const tagName = element.tagName.toLowerCase()
		switch (tagName) {
			case 'table':
				CreateUtils.createModal(`alert`, {body: errorCodeDescription.ED0022})
				return
			case 'li':
				// 頁籤移除 連同頁籤底下區塊也一併移除
				if (element.classList.contains('nav-item')) {
					for (let a of element.children) {
						if (a.tagName.toLowerCase() === 'a') {
							const targetTabPane = drawPage.querySelector(a.getAttribute('href'))
							removeParameterBean(targetTabPane)
						}
					}
				}
				break
			case 'td':
				// 若有合併的儲存格點移除，進行儲存格分割
				const insideBeans = element.querySelectorAll('.pFormItem[data-name], .pFormItemGroup[data-name]')
				if ((element.rowSpan && element.rowSpan > 1) || (element.colSpan && element.colSpan > 1)) {
					disassembleCell()
					return
				}
				if (element.classList.contains('hide')) {
					let className
					element.classList.forEach(cls => {
						if (cls.includes('rowspan')) {
							let clsArr = cls.split('-')
							clsArr.pop()
							clsArr.push('0')
							className = clsArr.join('-')
							return
						}
					})
					const rowSpanParent = drawPage.querySelector(`.${ className }`)
					if (rowSpanParent !== null)
						rowSpanParent.rowSpan--
				}
				if (insideBeans.length > 0) {
					insideBeans.forEach(bean => {
						if (bean.parentNode === element) removeParameterBean(bean)
					})
				}
				break
			case 'th':
				// 清單頁的刪除
				if (element.classList.contains('button-block')) {
					element.classList.remove('active')
					return
				}
				break
			case 'tr':
				// 清除完td後，tr如果為空需刪除，若不為空則不動作
				if (element.children.length > 0) return
				break
			case 'div':
				if (isListPage()) {
					if (element.dataset.listEle === 'Y') {
						const type = element.dataset.type
						factory.deleteListComponent(type)
					}
				} else if (isAddPage()) {
					if (element.dataset.isBean === 'Y') {
						const seq 		= element.dataset.seq
						const component = factory.getRegisterComponentBySeq(seq)
						if (!component) break
						component.abandoned = true
						if (component.treeChildren) {
							component.treeChildren.forEach(childName => {
								const childComponent = factory.getRegisterComponentByName(childName)
								childComponent.abandoned = true
							})
						}
						if (component.horizontalFormItem) {
							for (let option of component.horizontalFormItem) {
								if (option === '') continue
								const childOptions = option.split(',')
								childOptions.forEach(childName => {
									const childComponent = factory.getRegisterComponentByName(childName)
									childComponent.abandoned = true
								})
							}
						}
						if (component.dataset.parent) component.dataset.parent = undefined
						if (component.dataset.treeParent) component.dataset.treeParent = undefined
					} else {
						if (element.dataset.seq && element.classList.contains('container-component')) factory.deleteRegisterLayout(element.dataset.seq)
						const beanInsideBean = element.querySelectorAll('.pFormItem[data-name], .pFormItemGroup[data-name]')
						beanInsideBean.forEach(bean => removeParameterBean(bean))
					}
				}
				break
			case 'label':
				if (element.classList.contains('h6')) {
					const isTitle = element.closest('.table-data-title')
					if (isTitle) {
						const titleNodes = isTitle.querySelectorAll('label.h6')
						if (titleNodes.length === 1) isTitle.classList.remove('table-data-title')
					}
				}
				break
		}
		SharedUtils.clearHover()
		SharedUtils.clearSelectedElements()
		element.remove()
		if (elementParent.tagName.toLowerCase() === 'tr') 
		if (elementParent.classList.contains('divInlineBlock-group')) elementParent = elementParent.parentNode
		const childBeans = elementParent.querySelectorAll('.pFormItem[data-name], .pFormItemGroup[data-name]')
		if (childBeans.length === 0 && elementParent.querySelectorAll('label.h6').length > 0) elementParent.classList.add('table-data-title')
		/** remove container */
		const blockGroupBlockBeans = elementParent.querySelectorAll('.divInlineBlock-group > .pFormItem[data-name], .divInlineBlock-group > .pFormItemGroup[data-name]')
		if (blockGroupBlockBeans.length > 0 && blockGroupBlockBeans.length < 2) {
			blockGroupBlockBeans.forEach(bean => elementParent.prepend(bean))
			if (elementParent.querySelector('.divInlineBlock-group')) elementParent.querySelector('.divInlineBlock-group').remove()
		}
	}
}

/**
 * 計分腳本
 * =
 * 需選取多個多選框或單選框\
 * 彈出計分規則設定視窗\
 * 若選取的元件為記分元件則進行編輯\
 * 否則都是新增
 * @param {Event} e 
 */
function scoreScript(e) {
	/** 引入工廠 */
	const factory 			= window.ComponentFactory
	/** 表單畫布 */
	const drawPage 			= document.querySelector('#drawPage')
	/** 選取的元件 */
	const selectedElement 	= drawPage.querySelectorAll('.selected')
	try {
        if (scoreScriptBody === undefined) throw "not defined"
		// 計分的編輯模式
		let editMode = false
		if (selectedElement.length === 1 && selectedElement[0].dataset.controlType === 'totalScore') editMode = true
		const scoreModel = CreateUtils.createModal(`custom`, {
			'title':    `新增計分規則`,
			'body':     scoreScriptBody,
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
			'callback': scoreScriptCallBack
		})
		const addRuleBtn 			= scoreModel.querySelector('#addRuleBtn')
		const modalScoreBeanName 	= scoreModel.querySelector('#modalScoreBeanName')
		const modalScoreBeanTitle 	= scoreModel.querySelector('#modalScoreBeanTitle')
		const ruleList 				= scoreModel.querySelector('#ruleList')
		addRuleBtn.addEventListener('click', modalAddRule)

		// 編輯模式設定資料
		if (editMode) {
			const seq 					= selectedElement[0].dataset.seq
			const component 			= factory.getRegisterComponentBySeq(seq)
			const scoreRule 			= SharedUtils.onionStringDecode(component.dataset.scoreRule)
			modalScoreBeanName.value 	= component.externalName
			modalScoreBeanTitle.value 	= component.dataset.title
			for (let scoreObject of scoreRule) {
				if (Object.keys(scoreObject).length === 0) continue
				addRuleBtn.click()
				const ruleRow 		= ruleList.children[ruleList.children.length - 1]
				const minLimit 		= ruleRow.querySelector('[name="min-limit"]')
				const maxLimit 		= ruleRow.querySelector('[name="max-limit"]')
				const warningText 	= ruleRow.querySelector('[name="warning-text"]')
				const ruleColor 	= ruleRow.querySelector('[name="rule-color"]')
				minLimit.value 		= scoreObject["min-limit"]
				maxLimit.value 		= scoreObject["max-limit"]
				warningText.value 	= scoreObject["warning-text"] || ''
				ruleColor.value 	= scoreObject["rule-color"] || scoreObject["ruleColor"] // 舊版名稱改名
			}
		}

		/** ================ 下方皆為函數 ================ */

		/**
		 * 新增條件欄位創建
		 * @param {*} e 
		 */
		function modalAddRule(e) {
			const ruleDiv = CreateUtils.createBeanElement({'controlType': 'ruleLine'})[0]
			ruleList.appendChild(ruleDiv)
			SharedUtils.cancelDefault(e)
		}

		/**
		 * 彈窗按鈕回調
		 * @param {Number} index 
		 * @param {Array} result 
		 * @param {Element} modalElement
		 * @returns 
		 */
		function scoreScriptCallBack(index, modalElement) {
			const modalForm = modalElement.querySelector('form')
			if (index === 1) {
				let beanName, beanTitle, rule = [{}]
				// 計分初步檢核
				for (let element of modalForm.elements) {
					if (element.tagName.toLowerCase() === 'button') continue
					let regex, isValid = true
					const elementName 	= element.name
					const elementValue 	= element.value
					switch (elementName) {
						case 'modalScoreBeanName':
							regex       = new RegExp(/^\w+$/g)
							isValid     = regex.test(elementValue)
							beanName   	= elementValue
							if (editMode) {
								if (selectedElement[0].externalName === beanName) break
								if (factory.checkComponentExist(beanName)) isValid = false
							} else if (factory.checkComponentExist(beanName)) isValid = false
							if (elementValue === '') isValid = false
							break
						case 'modalScoreBeanTitle':
							regex       = new RegExp(/^[\w\u4e00-\u9fa5]+$/g)
							isValid     = regex.test(elementValue)
							beanTitle   = elementValue
							if (elementValue === '') isValid = false
							break
						case 'warning-text':
							if (elementValue !== '') {
								if (rule[rule.length - 1][elementName] === undefined) 
									rule[rule.length - 1][elementName] = elementValue
								else {
									rule.push({})
									rule[rule.length - 1][elementName] = elementValue
								}
							}
							continue
						default:
							if (elementValue === '') isValid = false
							else {
								if (rule[rule.length - 1][elementName] === undefined) 
									rule[rule.length - 1][elementName] = elementValue
								else {
									rule.push({})
									rule[rule.length - 1][elementName] = elementValue
								}
							}
							break
					}
					if (!isValid) {
						element.classList.add('is-invalid')
						return false
					}
				}
				const totalScoreCons = []
				if (editMode) {
					const seq 		= selectedElement[0].dataset.seq
					const component = factory.getRegisterComponentBySeq(seq)
					const allBeans 	= component.dataset.totalScoreCons
					const beanArray = allBeans.split(',')
					component.externalName = beanName
					// component.dataset.bean = beanName
					component.dataset.title = beanTitle
					component.dataset.scoreRule = JSON.stringify(rule)
					for (let name of beanArray) {
						const beanComponent = factory.getRegisterComponentByName(name)
						beanComponent.dataset.scoreBean = beanName
					}
				} else {
					selectedElement.forEach(element => {
						const beanComponent = factory.getRegisterComponentByName(element.dataset.name)
						beanComponent.dataset.scoreBean = beanName
						totalScoreCons.push(beanComponent.dataset.name)
					})
					const activeTable 		= drawPage.querySelector('div.tab-pane.active > table')
					const parentBody 		= activeTable.querySelector('tbody')
					let colNum 				= getTableMaxCell(activeTable)
					let colSpan 			= (colNum > 2) ? (colNum - 1) : 1
					const label 			= CreateUtils.createBeanElement({'controlType': 'label', 'attribute': [{'data-edit': 'true', 'text': beanTitle}]}, false)
					const scoreComponent 	= factory.create(`__score`, beanName, beanName, beanTitle, JSON.stringify(rule), totalScoreCons.join(','))
					const trRow 			= CreateUtils.createBeanElement({'controlType': 'tablerow'})[0]
					for (let i = 0; i < colNum; i++) {
						const tableData = CreateUtils.createBeanElement({
							'controlType': 'tabledata',
							'attribute': 	[
								{
									'class': ((i === 0) ? 'table-data-title' : '') + ((i > 0 && i < (colNum - 1)) ? 'hide': ''),
									'text': '',
									'children': ((i === 0) ? label : []),
									'colspan': (((i + 1) === colNum) ? colSpan : 1),
								}
							]
						})[0]
						if (i === (colNum - 1)) tableData.appendChild(scoreComponent.fullComponent)
						trRow.appendChild(tableData)
					}
					parentBody.appendChild(trRow)
					beanToListEvent()
					initDrawPageEvent()
				}
				return true
			}
		}
	} catch (e) {
        console.error(e)
        console.error(`config didn't setting success...`)
    }
}

/**
 * 元件群組事件
 * =
 * 將所選的元件進行群組\
 * 所選元件必須都在同個欄位內\
 * 並創建出新的原件 - group\
 * 並給予一組新增及移除按鈕
 * @param {Event} e 
 */
function groupBean(e) {
	/** 引入工廠 */
	const factory 			= window.ComponentFactory
	/** 表單畫布 */
	const drawPage 			= document.querySelector('#drawPage')
	/** 所選取的元件群 */
	const selectedElements 	= Array.from(drawPage.querySelectorAll('.selected'))
	/** 第一個元件的父層區域(判斷是否同一層) */
	const parentContainer 	= selectedElements[0].parentNode
	/** 第一個元件的上一個元素 */
	const beforeElement 	= selectedElements[0].previousElementSibling
	/** 組別名稱 */
	const parentName 		= `group_${ CreateUtils.createRandomCode() }`
	/** 組別標題 */
	const parentTitle 		= `組別_${ new Date().format('HHmmss') }`
	/** 樹狀結構 */
	const treeChildren 		= [`${ parentName }_btn_sub`]
	/** 層級結構 */
	const children 			= [`${ parentName }_btn_sub`]
	selectedElements.forEach(element => {
		element.dataset.parent = parentName
		element.dataset.treeParent = parentName
		treeChildren.push(element.dataset.name)
		children.push(element.dataset.name)
		if (element.horizontalFormItem) {
			for (let nodeValue of element.horizontalFormIte) {
				const items = nodeValue.split(',')
				for (let item of items) {
					const beans = element.querySelector(`.pFormItem[data-name="${ item }"], .pFormItemGroup[data-name="${ item }"]`)
					if (beans !== null) beans.dataset.parent = parentName
					children.push(item)
				}
			}
		}
	})
	treeChildren.filter(x => x !== undefined)
	children.filter(x => x !== undefined)
	const addButtonComponent = factory.create(`__button`, `${ parentName }_btn_add`, `${ parentName }_btn_add`, `${ parentTitle }_按鈕_新增`)
	addButtonComponent.dataset.uiClass = `createGroupBtn group_${ parentName }_add`
	addButtonComponent.dataset.iconPosition = 'before'
	addButtonComponent.dataset.information = 'bi bi-plus'
	addButtonComponent.dataset.placeholder = ''
	addButtonComponent.dataset.click = `createFormItemGroup(this, '${ parentName }')`
	addButtonComponent.attribute.targetGroup = parentName
	addButtonComponent.modifyAttribute()
	const subButtonComponent = factory.create(`__button`, `${ parentName }_btn_sub`, `${ parentName }_btn_sub`, `${ parentTitle }_按鈕_移除`)
	subButtonComponent.dataset.uiClass = `createGroupBtn group_${ parentName }_sub`
	subButtonComponent.dataset.iconPosition = 'before'
	subButtonComponent.dataset.information = 'bi bi-dash'
	subButtonComponent.dataset.style = 'btn btn-danger'
	subButtonComponent.dataset.placeholder = ''
	subButtonComponent.dataset.click = `removeFormItemGroup(this, '${ parentName }')`
	subButtonComponent.attribute.targetGroup = parentName
	subButtonComponent.modifyAttribute()
	selectedElements.unshift(subButtonComponent.fullComponent)
	const groupComponent 	= factory.create(`__group`, parentName, parentName, parentTitle, treeChildren.join(','), children.join(','), selectedElements)
	if (beforeElement) beforeElement.after(addButtonComponent.fullComponent, groupComponent.fullComponent)
	else parentContainer.prepend(addButtonComponent.fullComponent, groupComponent.fullComponent)
	SharedUtils.clearSelectedElements()
	beanToListEvent()
	initDrawPageEvent()
	toolPackActive(false)
}

/**
 * 解除群組的元件
 * =
 * 將按鈕元件收回\
 * 並將群組後的新元件移除\
 * 還原原本元件結構
 * @param {Event} e 
 */
function unGroupBean(e) {
	/** 引入工具 */
	const factory 			= window.ComponentFactory
	/** 表單畫布 */
	const drawPage 			= document.querySelector('#drawPage')
	/** 選取的元件 */
	const selectedElement 	= drawPage.querySelector('.selected')
	/** 選取的元件編號 */
	const seq 				= selectedElement.dataset.seq
	/** 選取的元件物件 */
	const component 	 	= factory.getRegisterComponentBySeq(seq)
	/** 元件名稱 */
	const beanName 			= component.dataset.name
	/** 組別綁定依據 */
	const targetGroup 		= drawPage.querySelectorAll(`[target-group="${ beanName }"]`)
	targetGroup.forEach(element => {
		const childSeq = element.dataset.seq
		factory.deleteRegisterComponent(childSeq)
		element.remove()
	})
	const selectChildren = Array.from(selectedElement.children)
	selectChildren.reverse()
	for (let i = 0, len = selectChildren.length; i < len; ++i) {
		if (selectChildren[i] === undefined) break
		const childElement = selectChildren[i]
		if (childElement.dataset.isBean === 'Y') {
			const childSeq 			= childElement.dataset.seq
			const childComponent 	= factory.getRegisterComponentBySeq(childSeq)
			childComponent.dataset.treeParent 	= undefined
			childComponent.dataset.parent 		= undefined
			selectedElement.after(childComponent.fullComponent)
		} else if (!childElement.classList.contains('bean-drop')) 
			selectedElement.after(childElement)
	}
	selectedElement.remove()
	factory.deleteRegisterComponent(seq)
	SharedUtils.clearSelectedElements()
	beanToListEvent()
	toolPackActive(false)
}

/**
 * 新增元件腳本
 * =
 * 彈出設定腳本視窗\
 * 詳見選項參照 config.js
 * 
 * @param {Event} e
 */
function addScript(e) {
	/** 引入工廠 */
	const factory 			= window.ComponentFactory
	/** 表單畫布 */
	const drawPage 			= document.querySelector('#drawPage')
	/** 選取的元件 */
	const selectedElement 	= drawPage.querySelector('.selected')
	/** 選取元件的編號 */
	const seq 				= selectedElement.dataset.seq
	/** 取得選取的元件物件 */
	const selectedComponent = factory.getRegisterComponentBySeq(seq)
	/** 元件選項清單 */
	const beanOptions 		= CreateUtils.createBeanOptions(false, true)
	let scriptList  		= selectedComponent.dataset.script || []
	try {
        if (beanScriptBody === undefined) throw "not defined"
		const cloneBeanElement 	= selectedElement.cloneNode(true)
		const cloneDrawPage 	= drawPage.cloneNode(true)
		const controlType 	  	= selectedElement.dataset.controlType
		try {
			scriptList = JSON.parse(scriptList)
		} catch (e) { }
        const scriptModel = CreateUtils.createModal(`custom`, {
			'size': 	`modal-lg`,
            'title':    `增加元件腳本`,
            'body':     beanScriptBody,
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
                },
				{
					'class': 'btn btn-danger disabled',
					'id': 	 'removeButton',
					'type':  'button',
					'text':  '移除'
				}
            ],
            'callback': scriptEditEndCallBack
        })

		/** 元件放置區塊 */
		const elementModalContainer = scriptModel.querySelector('#modalBeanContainer')
		/** 腳本類別下拉框 */
		const elementModalSelect 	= scriptModel.querySelector('#beanScriptType')
		/** 已註冊腳本清單 */
		const elementModalList  	= scriptModel.querySelector('#initScript')
		/** 表單選擇區域 */
		const elementSelectRange 	= scriptModel.querySelector('#selectRange')
		/** 身高元件選擇下拉框 */
		const elementHeightSelect 	= scriptModel.querySelector('#modalHeightBean')
		/** 重量元件選擇下拉框 */
		const elementWeightSelect 	= scriptModel.querySelector('#modalWeightBean')
		/** 新增參數按鈕 */
		const elementAddParam 		= scriptModel.querySelector('#addParam')
		/** 單選複選框區域 */
		const elementIsShowDiv 		= scriptModel.querySelectorAll('input[name="modalIsShowDiv"]')
		/** 已註冊腳本選項 */
		const options 				= processScriptList(scriptList)
		// 設定左側腳本清單資料
		options.forEach(option => elementModalList.appendChild(option))
		// 設定腳本選項顯示類型 (依照 dataType)
		elementModalSelect.childNodes.forEach(option => {
			const dataTypeString = option.dataset.type
			if (dataTypeString === undefined) return
			const dataTypeArray = dataTypeString.split(',')
			if (!dataTypeArray.includes(controlType)) option.classList.add('hide')
		})
		// 處理元件設定
		const cloneBeanDrop 	= cloneBeanElement.querySelectorAll('.bean-drop')
		const cloneBeansInBean 	= cloneBeanElement.querySelectorAll('.pFormItem[data-name]')
		const inputElement 		= cloneBeanElement.querySelector('input[type="text"]')
		const cloneBeanLabel 	= cloneBeanElement.querySelectorAll('label.h6.canEditDiv')
		cloneBeanDrop.forEach(beanDrop => beanDrop.remove())
		cloneBeanLabel.forEach(beanLabel => beanLabel.remove())
		cloneBeansInBean.forEach(bean => bean.remove())
		if (inputElement !== null) inputElement.placeholder = '這是選擇的元件不用輸入'
		cloneBeanElement.childNodes.forEach(node => elementModalContainer.appendChild(node.cloneNode(true)))
		// 處理克隆頁面的表格部分
		const cloneTabContent 	= cloneDrawPage.querySelector('#tabContent')
		const cloneBeans 		= cloneDrawPage.querySelectorAll('.pFormItem[data-name]')
		const cloneTabs 		= cloneDrawPage.querySelectorAll('a.nav-link')
		const cloneContainer 	= cloneDrawPage.querySelectorAll('.container-component')
		cloneTabContent.classList.remove('noHeight', 'h-0', 'height-0')
		cloneTabContent.setAttribute('style', null)
		cloneTabs.forEach(tab => {
			const tabTarget = tab.getAttribute('href')
			const tabContent = cloneDrawPage.querySelector(tabTarget)
			tab.id += 'modal'
			tab.setAttribute('href', tabTarget + 'modal')
			tab.setAttribute('aria-controls', tab.getAttribute('aria-controls') + 'modal')
			if (tab.id === 'plus-tabmodal') tab.classList.add('hide')
			else {
				tabContent.id += 'modal'
				tabContent.setAttribute("aria-labelledby", tabContent.getAttribute("aria-labelledby") + 'modal')
			}
		})
		cloneBeans.forEach(bean => {
			bean.classList.remove('selected', 'form-group')
			bean.classList.add('form-row-div')
			bean.innerHTML = `${ bean.dataset.title }(${ bean.externalName })`
		})
		cloneContainer.forEach(container => {
			container.classList.add('flex-wrap')
		})
		beanOptions.forEach(option => elementHeightSelect.appendChild(option.cloneNode(true)))
		beanOptions.forEach(option => elementWeightSelect.appendChild(option.cloneNode(true)))
		cloneDrawPage.childNodes.forEach((divElement, index) => {
			if (index > 0) elementSelectRange.appendChild(divElement.cloneNode(true))
		})
		if (!drawPage.classList.contains('structure1')) elementSelectRange.classList.remove('structure1')
		
		// 添加事件
		const elementModalTab   	= scriptModel.querySelectorAll('ul li.nav-item a')
		const elementModalTable 	= scriptModel.querySelectorAll('table td')
		const elementModalLabel 	= scriptModel.querySelectorAll('.pFormItem[data-is-bean="Y"]')
		const elementModalLayout 	= scriptModel.querySelectorAll('.container-component')
		const elementModalToggle 	= scriptModel.querySelector('.tab-menu-toggle')
		elementModalTab.forEach(ulTab => {
			ulTab.addEventListener('click', showTab)
			ulTab.addEventListener('dblclick', scriptSelect)
			ulTab.addEventListener('contextmenu', scriptSelect)
		})
		elementModalTable.forEach(tableData => {
			if (controlType === 'button')
				tableData.addEventListener('click', scriptSelect)
			else
				tableData.addEventListener('contextmenu', scriptSelect)
		})
		elementModalLabel.forEach(beanLabel => {
			beanLabel.addEventListener('click', scriptSelect)
			if (controlType !== 'button')
				beanLabel.addEventListener('contextmenu', scriptSelect)
		})
		elementModalLayout.forEach(container => {
			container.addEventListener('click', scriptSelect)
			container.addEventListener('contextmenu', scriptSelect)
		})
		elementIsShowDiv.forEach(radioBox => {
			radioBox.addEventListener('change', isDivShowChanged)
		})
		for (let bean of elementModalContainer.children) {
			bean.addEventListener('click', modalBeanSelect)
		}
		elementModalSelect.addEventListener('change', modalSelectChanged)
		elementModalList.addEventListener('change', modalScriptChanged)
		elementAddParam.addEventListener('click', addSendParam)
		if (elementModalToggle) {
			elementModalToggle.addEventListener('click', function (e) {
				console.log(this)
				this.parentNode.classList.toggle('active')
			})
		}
    } catch (e) {
        console.error(e)
        console.error(`config didn't setting success...`)
    }
	
	/** ================ 下方皆為函數 ================ */

	/**
	 * 新增腳本按鈕回調
	 * =
	 */
	function scriptEditEndCallBack(index, modalElement) {
		const modalForm = modalElement.querySelector('form')
		if (index === 1) {
			const modalBeanContainer = modalElement.querySelector('#modalBeanContainer')
			let scriptName, scriptType, weightBean, heightBean, selectForm, paramName, paramType, paramValue, checkObject = {}, noValue = false
			const paramObject = {
				'default': {},
				'add': {},
				'upd': {}
			}
			const scriptArray = [] 
			const rangeArray = []
			const externalData = {}
			modalBeanContainer.classList.remove('border', 'border-danger', 'border-dashed')
			// 初步動作 - 表單檢查
			for (let element of modalForm.elements) {
				if (element.closest('.modal-footer') || element.classList.contains('skip')) continue
				let isValid = true
				const eleName 	= element.name
				const eleValue 	= element.value
				switch (eleName) {
					case 'modalScriptName':
						if (eleValue === '') isValid = false
						else scriptName = eleValue
						break
					case 'beanScriptType':
						if (eleValue === '0') isValid = false
						else scriptType = eleValue
						break
					case 'initScript':
						// pass
						break
					case 'modalHeightBean':
						if (element.classList.contains('hide')) break
						if (eleValue === '0') isValid = false
						else heightBean = eleValue
						break
					case 'modalWeightBean':
						if (element.classList.contains('hide')) break
						if (eleValue === '0') isValid = false
						else weightBean = eleValue
						break 
					case 'modalSelectForm':
						if (element.classList.contains('hide')) break
						if (eleValue === '0') isValid = false
						else selectForm = eleValue
						break
					case 'modalIsShowDiv':
					case 'modalIsKeepDataNewest':
						if (element.closest('.import-external-data.hide')) break
						if (element.checked) checkObject[eleName] = eleValue
						else if (!element.checked && !checkObject[eleName]) checkObject[eleName] = 'uncheck'
						else if (!element.checked && checkObject[eleName] && checkObject[eleName] === 'uncheck') isValid = false
						break
					case 'modalCheckType':
						if (element.closest('.is-show-div.hide')) break
						if (element.checked) checkObject[eleName] = eleValue
						else if (!element.checked && !checkObject[eleName]) checkObject[eleName] = 'uncheck'
						else if (!element.checked && checkObject[eleName] && checkObject[eleName] === 'uncheck') isValid = false
						break
					default:
						// 處要處理元件
						if (element.classList.contains('hide')) break
						if (element.closest('#paramList')) {
							if (eleValue === '') isValid = false
							else {
								switch (eleName) {
									case 'paramName':
										paramName = eleValue
										break
									case 'paramType':
										paramType = eleValue
										paramObject[paramType][paramName] = paramValue
										break
									case 'paramValue':
										paramValue = eleValue
										paramObject[paramType][paramName] = paramValue
										break
								}
							}
						} else {
							const beanType = element.type
							switch (beanType) {
								case 'checkbox':
								case 'radio':
									const checked 	= element.closest('.active')
									const position 	= modalBeanContainer.children.indexOf(checked)
									if (checked) scriptArray.push(position)
									if (beanType === 'radio' && scriptArray.length > 1) isValid = false 
									break
								case 'select-one':
									if (eleValue === '0') isValid = false
									else scriptArray.push(eleValue)
									break
								default:
									noValue = true
									break
							}
						}
						break
				}
				if (!isValid) {
					if (element.classList.contains('form-check-input')) element.parentNode.parentNode.classList.add('border', 'border-danger', 'border-dashed')
					else element.classList.add('is-invalid')
					return false
				} else {
					element.classList.remove('is-invalid')
					if (element.classList.contains('form-check-input')) element.parentNode.parentNode.classList.remove('border', 'border-danger', 'border-dashed')
				}
			}
			// 若為多選單選類的元件需要有選取
			if (scriptArray.length === 0 && !noValue) {
				modalBeanContainer.classList.add('border', 'border-danger', 'border-dashed')
				return false
			}
			// 處理顯示區塊
			if (scriptType === 'display' || scriptType === 'create') {
				const selectRange 	= modalElement.querySelector('#selectRange')
				const navItem 		= selectRange.querySelectorAll('#tabs > .nav-item > a')
				navItem.forEach(a => {
					if (a.classList.contains('hide')) return
					const liElement 	= a.closest('li.nav-item')
					const ulElement 	= liElement.parentNode
					const href 			= a.getAttribute('href')
					const targetTabPane = selectRange.querySelector(href)
					const tableActives 	= targetTabPane.querySelectorAll('table td.need-hide, table td.need-show')
					const layoutActives = targetTabPane.querySelectorAll('.container-component.need-hide, .container-component.need-show')
					const beanActives 	= targetTabPane.querySelectorAll('.pFormItem.need-hide[data-name], .pFormItem.need-show[data-name], .pFormItemGroup.need-hide[data-name], .pFormItemGroup.need-show[data-name]')
					let tab = {
						tabIndex: ulElement.children.indexOf(liElement),
						hadData: false,
						hideTab: false,
						cloneTab: false,
						layoutControl: {},
						hidePosition: [],
						clonePosition: [],
						showBeanName: [],
						hideBeanName: [],
						cloneBeanName: []
					}
					// 先判斷頁籤是否隱藏
					if (a.classList.contains('need-hide') || a.classList.contains('need-show')) {
						if (scriptType === 'display') {
							tab.hideTab = a.classList.contains('need-hide') ? true : false
							tab.hadData = true
						} else tab.cloneTab = true
					}
					// 判斷選取的表格欄位
					tableActives.forEach(td => {
						const parentBody		= td.closest('tbody')
						const parentTableRow 	= td.closest('tr')
						const x 				= td.parentNode.children.indexOf(td)
						const y 				= parentBody.children.indexOf(parentTableRow)
						const positionObject 	= {
							'x': x,
							'y': y
						}
						if (scriptType === 'display') tab.hidePosition.push(positionObject)
						else tab.clonePosition.push(positionObject)
					})
					layoutActives.forEach(container => {
						const seq = container.dataset.seq
						tab.layoutControl[seq] = container.classList.contains('need-hide') ? false : true
					})
					// 判斷元件的選取
					beanActives.forEach(bean => {
						const beanName = bean.dataset.name
						if (bean.classList.contains('need-hide')) {
							tab.hideBeanName.push(beanName)
							return
						}
						if (bean.classList.contains('need-show')) {
							if (scriptType === 'display') tab.showBeanName.push(beanName)
							else tab.cloneBeanName.push(beanName)
							return
						}
					})
					if (checkHadData(tab)) rangeArray.push(tab)
				})
			}
			if (scriptType === 'import') {
				externalData.formType = selectForm
				externalData.isShowDiv = checkObject.modalIsShowDiv
				externalData.isKeepDataNewest = checkObject.modalIsKeepDataNewest
				externalData.checkType = checkObject.modalCheckType
				externalData.paramMap = paramObject
			}
			// 比對原始資料
			const script = {
				name: scriptName,
				type: scriptType,
				options: scriptArray,
				range: rangeArray,
				weightBean: weightBean,
				heightBean: heightBean,
				externalData: externalData
			}
			let needPush = true
			for (let nodeObject of scriptList) {
				if (nodeObject.name === script.name) {
					scriptList[scriptList.indexOf(nodeObject)] = script
					needPush = false
					break
				}
			}
			if (needPush) scriptList.push(script)
			selectedComponent.dataset.script = JSON.stringify(scriptList)
			beanToListEvent()
			return true
		}
		// 移除按鈕功能
		if (index === 2) {
			const initScriptSelect 	= modalForm.querySelector('#initScript')
			const removeButton 		= modalElement.querySelector('#removeButton')
			const scriptName 		= initScriptSelect.value
			if (scriptName === '') return false
			for (let nodeObject of scriptList) {
				if (nodeObject.name === scriptName) {
					const option 	= initScriptSelect.querySelector(`option[value="${ scriptName }"]`)
					const position 	= initScriptSelect.children.indexOf(option)
					if (option !== null) option.remove()
					scriptList.splice(position, 1)
					cleanModalData()
					selectedComponent.dataset.script = JSON.stringify(scriptList)
					break
				}
			}
			removeButton.classList.add('disabled')
			return false
		}
	}

	/**
	 * 檢查物件內是否有值(boolean = true, array.length > 0)
	 * @param {Object} tabObject
	 * @returns
	 */
	function checkHadData(tabObject) {
		for (let key in tabObject) {
			if (key === 'hadData' && tabObject[key]) return true
			if (Array.isArray(tabObject[key]) && tabObject[key].length > 0) return true
			if (typeof tabObject[key] === 'object' && !Array.isArray(tabObject[key])) return true
		}
		return false
	}
	
	/**
	 * 設定已存在腳本清單
	 * =
	 * 將已存在腳本整理並顯示於左側欄位
	 * 
	 * @param {Object} jsonObject 腳本物件
	 * @returns {Object[]} result
	 */
	function processScriptList(jsonObject) {
		let result = []
		for (let nodeObject of jsonObject) {
			result = result.concat(CreateUtils.createBeanElement({
				'controlType': 'option',
				'attribute': 	[
					{
						'text': 			nodeObject.name,
						'value': 			nodeObject.name,
						'data-type': 		nodeObject.type,
						'data-ops': 		JSON.stringify(nodeObject.options),
						'data-range': 		JSON.stringify(nodeObject.range),
						'data-weight-bean': nodeObject.weightBean,
						'data-height-bean': nodeObject.heightBean,
						'data-external-data': JSON.stringify(nodeObject.externalData)
					}
				]
			}))
		}
		return result
	}

	/**
	 * 腳本彈窗切換不同腳本
	 * =
	 * @param {Event} e 
	 */
	function modalScriptChanged(e) {
		cleanModalData()
		const selectElement 	= this
		const value 			= selectElement.value
		const targetOption 		= selectElement.querySelector(`option[value="${ value }"]`)
		const formElement 		= selectElement.closest('form')
		const modelElement 		= formElement.closest('.modal')
		const beanContainer 	= formElement.querySelector('#modalBeanContainer')
		const scriptName 		= formElement.querySelector('#modalScriptName')
		const scripType 		= formElement.querySelector('#beanScriptType')
		const heightSelect 		= formElement.querySelector('#modalHeightBean')
		const weightSelect 		= formElement.querySelector('#modalWeightBean')
		const formSelect 		= formElement.querySelector('#modalSelectForm')
		const isShowDivRadio 	= formElement.querySelectorAll('input[name="modalIsShowDiv"]')
		const isKeepRadio 		= formElement.querySelectorAll('input[name="modalIsKeepDataNewest"]')
		const checkTypeRadio 	= formElement.querySelectorAll('input[name="modalCheckType"]')
		const addParamButton 	= formElement.querySelector('#addParam')
		const paramList 		= formElement.querySelector('#paramList')
		const removeButton 		= modelElement.querySelector('#removeButton')
		const data  			= targetOption.dataset
		/** 腳本類型 */
		const type 				= data.type
		/** 腳本影響區域 */
		let range 				= data.range
		/** 腳本觸發選項 */
		let options 			= data.ops || []
		if (typeof options === 'string') options = JSON.parse(options)
		for (let position of options) {
			const childType 	= beanContainer.children[0].type
			switch (childType) {
				case 'select-one':
					const targetSelect = beanContainer.children[0]
					if (targetSelect) targetSelect.value = position
					break
				case undefined:
					const targetInput = beanContainer.children[position]
					if (targetInput) targetInput.classList.add('active')
					break
				default:
					break
			}
			
		}
		scriptName.value 	= targetOption.innerText
		scripType.value 	= type
		if ('createEvent' in document) {
			var evt = document.createEvent("HTMLEvents");
			evt.initEvent('change', false, true);
			scripType.dispatchEvent(evt);
		}
		if (type === 'display' || type === 'create') {
			try {
				range = JSON.parse(range)
			} catch (e) { }
			for (let rangeObject of range) {
				let isCreate 		= false
				let position 		= rangeObject.hidePosition
				let showNames 		= rangeObject.showBeanName || []
				const hideTab  		= rangeObject.hideTab
				const hadData 		= rangeObject.hadData
				const cloneTab 		= rangeObject.cloneTab
				const tabIndex 		= rangeObject.tabIndex
				const beanNames 	= rangeObject.hideBeanName
				const layoutControl = rangeObject.layoutControl
				const navItem  		= formElement.querySelectorAll('.nav-item')
				const targetItem 	= navItem[tabIndex]
				const href 			= targetItem.children[0].getAttribute('href')
				const targetTabPane = formElement.querySelector(href)
				if (position.length === 0) {
					// 若沒有需要隱藏的區域改為創建區域
					isCreate = true
					position = rangeObject.clonePosition
				}
				// 若沒有需要隱藏或顯示的元件則改為克隆元件名
				if (beanNames.length === 0 && showNames.length === 0) showNames = rangeObject.cloneBeanName
				// 需要隱藏的頁籤及克隆的頁籤
				if (hideTab || cloneTab) {
					targetItem.children[0].classList.add(`${ hideTab ? 'need-hide' : (cloneTab ? 'need-show' : '') }`)
					targetTabPane.classList.add(`${ hideTab ? 'need-hide' : (cloneTab ? 'need-show' : '') }`)
					continue
				} else if (hadData) {
					targetItem.children[0].classList.add(`need-show`)
					targetTabPane.classList.add(`need-show`)
				}
				// 需要顯示/隱藏的欄位
				for (let location of position) {
					const tableRows 	= targetTabPane.querySelectorAll('table tbody tr')
					const targetRow 	= tableRows[location.y]
					const targetData 	= targetRow.children[location.x]
					targetData.classList.add(`${ isCreate ? 'need-show' : 'need-hide'}`)
				}
				for (let seq in layoutControl) {
					const layoutComponent = targetTabPane.querySelector(`.container-component[data-seq="${ seq }"]`)
					if (layoutComponent && layoutControl[seq]) layoutComponent.classList.add('need-show')
					else if (layoutComponent && !layoutComponent[seq]) layoutComponent.classList.add('need-hide')
				}
				// 需要隱藏的元件
				for (let beanName of beanNames) {
					const targetBean 	= targetTabPane.querySelector(`.pFormItem[data-name="${ beanName }"], .pFormItemGroup[data-name="${ beanName }"]`)
					if (targetBean !== null) targetBean.classList.add('need-hide')
				}
				// 需要顯示的元件
				for (let showName of showNames) {
					const targetBean 	= targetTabPane.querySelector(`.pFormItem[data-name="${ showName }"], .pFormItemGroup[data-name="${ showName }"]`)
					if (targetBean !== null) targetBean.classList.add('need-show')
				}
			}
		} else if (type === 'bmi') {
			heightSelect.value = data.heightBean
			weightSelect.value = data.weightBean
		} else if (type === 'ibw') heightSelect.value = data.heightBean
		else if (type === 'import') {
			let externalData = data.externalData
			if (externalData) externalData = JSON.parse(externalData)
			const paramMap = externalData.paramMap
			formSelect.value = externalData.formType
			isShowDivRadio.forEach(radio => {
				if (radio.value == externalData.isShowDiv.toString()) radio.click()
			})
			isKeepRadio.forEach(radio => {
				if (radio.value == externalData.isKeepDataNewest.toString()) radio.checked = true
			})
			checkTypeRadio.forEach(radio => {
				if (radio.value == externalData.checkType) radio.checked = true
			})
			for (let type in paramMap) {
				const paramObject = paramMap[type]
				if (Object.keys(paramObject).length === 0) continue
				for (let node in paramObject) {
					addParamButton.click()
					const paramRow = paramList.lastChild
					const paramNameElement = paramRow.querySelector('input[name="paramName"]')
					const paramTypeElement = paramRow.querySelector('select[name="paramType"]')
					const paramValueElement = paramRow.querySelector('input[name="paramValue"]')
					paramNameElement.value = node
					paramTypeElement.value = type
					paramValueElement.value = paramObject[node]
				}
			}
		}
		removeButton.classList.remove('disabled')
	}

	/**
	 * 彈出視窗表格選取事件
	 * =
	 * 點擊左鍵綁定顯示\
	 * 點擊右鍵綁定隱藏
	 * @param {Event} e 
	 */
	function scriptSelect(e) {
		const element 		= this
		const selectRange 	= element.closest('#selectRange')
		if (e.type === 'click' || e.type === 'dblclick') {
			if (element.classList.contains('need-show')) {
				if (element.tagName.toLowerCase() === 'a' || element.tagName.toLowerCase() === 'li') {
					const targetId = element.getAttribute('href')
					const targetElement = selectRange.querySelector(targetId)
					if (targetElement !== null) targetElement.classList.remove('need-show')
				}
				element.classList.remove('need-show')
			} else {
				if (element.tagName.toLowerCase() === 'a' || element.tagName.toLowerCase() === 'li') {
					const targetId = element.getAttribute('href')
					const targetElement = selectRange.querySelector(targetId)
					if (targetElement !== null) {
						targetElement.classList.remove('need-hide')
						targetElement.classList.add('need-show')
					}
				}
				element.classList.remove('need-hide')
				element.classList.add('need-show')
			}
		}
		if (e.type === 'contextmenu') {
			if (element.classList.contains('need-hide')) {
				if (element.tagName.toLowerCase() === 'a' || element.tagName.toLowerCase() === 'li') {
					const targetId = element.getAttribute('href')
					const targetElement = selectRange.querySelector(targetId)
					if (targetElement !== null) targetElement.classList.remove('need-hide')
				}
				element.classList.remove('need-hide')
			} else {
				if (element.tagName.toLowerCase() === 'a' || element.tagName.toLowerCase() === 'li') {
					const targetId = element.getAttribute('href')
					const targetElement = selectRange.querySelector(targetId)
					if (targetElement !== null) {
						targetElement.classList.remove('need-show')
						targetElement.classList.add('need-hide')
					}
				}
				element.classList.add('need-hide')
				element.classList.remove('need-show')
			}
		}
		SharedUtils.cancelDefault(e)
	}

	/**
	 * 腳本彈窗元件選取
	 * =
	 * @param {Event} e 
	 */
	function modalBeanSelect(e) {
		const beanType = e.target.type
		switch (beanType) {
			case 'checkbox':
			case 'radio':
			case undefined:
				const formCheckParent = e.target.closest('.form-check')
				if (formCheckParent.classList.contains('active')) formCheckParent.classList.remove('active')
				else formCheckParent.classList.add('active')
				break
			default:
				break
		}
		
		SharedUtils.cancelDefault(e)
	}

	/**
	 * 腳本彈窗切換腳本下拉框事件
	 * =
	 * @param {Event} e 
	 */
	function modalSelectChanged(e) {
		const value 		= e.target.value
		const modalForm 	= e.target.closest('form')
		const selectRange 	= modalForm.querySelectorAll('.select-range')
		const countBmiBlock = modalForm.querySelectorAll('.count-bmi')
		const countIbwBlock = modalForm.querySelectorAll('.count-ibw')
		const importBlock 	= modalForm.querySelectorAll('.import-external-data')
		switch (value) {
			case 'display':
			case 'create':
				const needHides 	= modalForm.querySelectorAll('.need-hide')
				const needShows 	= modalForm.querySelectorAll('.need-show')
				needHides.forEach(element => element.classList.remove('need-hide'))
				needShows.forEach(element => element.classList.remove('need-show'))
				selectRange.forEach(range => range.classList.remove('hide'))
				countBmiBlock.forEach(block => block.classList.add('hide'))
				importBlock.forEach(block => block.classList.add('hide'))
				break
			case 'bmi':
				selectRange.forEach(range => range.classList.add('hide'))
				countIbwBlock.forEach(block => block.classList.add('hide'))
				countBmiBlock.forEach(block => block.classList.remove('hide'))
				importBlock.forEach(block => block.classList.add('hide'))
				break
			case 'ibw':
				selectRange.forEach(range => range.classList.add('hide'))
				countBmiBlock.forEach(block => block.classList.add('hide'))
				countIbwBlock.forEach(block => block.classList.remove('hide'))
				importBlock.forEach(block => block.classList.add('hide'))
				break
			case 'import':
				/** 表單選擇下拉框 */
				const elementSelectForm 	= modalForm.querySelector('#modalSelectForm')
				importBlock.forEach(block => block.classList.remove('hide'))
				selectRange.forEach(range => range.classList.add('hide'))
				countBmiBlock.forEach(block => block.classList.add('hide'))
				countIbwBlock.forEach(block => block.classList.add('hide'))
				// 處理表單清單
				settingFormOption(elementSelectForm, formVersionList)
				break
			default:
				selectRange.forEach(range => range.classList.add('hide'))
				countBmiBlock.forEach(block => block.classList.add('hide'))
				countIbwBlock.forEach(block => block.classList.add('hide'))
				importBlock.forEach(block => block.classList.add('hide'))
				break
		}
	}

	/**
	 * 設定選擇來源表單清單選項
	 * @param {Element} selectElement
	 * @param {Object[]} formVersionList 
	 */
	function settingFormOption(selectElement, formVersionList) {
		for (let i = 1, len = selectElement.children.length; i < len; ++i) {
			selectElement.children[i].remove()
		}
		for (let object of formVersionList) {
			const option = document.createElement('option')
			option.value = object.formType
			option.textContent = `${ object.title }(${ object.formType })`
			selectElement.appendChild(option)
		}
	}

	/**
	 * 彈出選擇視窗改變值觸發
	 * @param {Event} e 
	 */
	function isDivShowChanged(e) {
		const value 			= e.target.value
		const modalForm 		= e.target.closest('form')
		const showDivElements 	= modalForm.querySelectorAll('.is-show-div')
		switch (value) {
			case 'true':
				showDivElements.forEach(element => element.classList.remove('hide'))
				break
			case 'false':
				showDivElements.forEach(element => element.classList.add('hide'))
				break
		}
	}

	/**
	 * 添加查詢參數
	 * @param {Event} e 
	 */
	function addSendParam(e) {
		const addParamDiv 	= CreateUtils.createBeanElement({'controlType': 'scriptParamRow'})[0]
		const modalForm 	= e.target.closest('form')
		const paramRow 		= modalForm.querySelectorAll('.send-param-row')
		const paramList 	= modalForm.querySelector('#paramList')
		paramRow.forEach(element => element.classList.remove('hide'))
		paramList.appendChild(addParamDiv)
		/** 綁定事件及賦值 */
		const packageBlock = addParamDiv.querySelector('.param-package')
		const paramPackage = CreateUtils.createParamSelectPackage('paramValue')
		while (paramPackage.length > 0) {
			packageBlock.appendChild(paramPackage[0])
		}
		SharedUtils.cancelDefault(e)
	}
}

/**
 * 預設元件過濾查詢
 * =
 * @param {Event} e
 */
function searchDefaultBean(e) {
	const type = e.target.value
	const list = document.querySelector('#default-bean-list')
	list.childNodes.forEach(button => {
		if (type === '0') button.classList.remove('hide')
		else {
			button.classList.add('hide')
			if (button.dataset.type === type) button.classList.remove('hide')
		}
	})
}

/**
 * 匯入表單樹事件
 * =
 * @param {Event} e 
 */
function importBeanTree(e) {
	const beanTreeFileButton = document.querySelector('#bean-tree-file')
	beanTreeFileButton.click()
}

/**
 * 元件樹檔案上傳事件
 * =
 * 將檔案進行檢查後\
 * 確認無誤解析資料\
 * 組成表單樹結構
 * @param {Event} e 
 */
function fileUploadEvent(e) {
	const fileElement 	= this
	const fileList 		= fileElement.files
	let isInValid		= false
	for (let file of fileList) {
		let fileType = file.type
		if (fileType !== 'application/json') {
			isInValid = true
			break
		}
	}
	if (isInValid) {
		CreateUtils.createModal(`alert`, {body: errorCodeDescription.ED0024})
		fileElement.value = ''
		return
	}
	const promiseArray = []
	for (let file of fileList) {
		promiseArray.push(SharedUtils.readFile(file))
	}
	Promise.all(promiseArray)
		.then(result => {
			for (let jsonString of result) {
				try {
					const json = JSON.parse(jsonString)
					for (let key in beanTreeStructure) {
						if (beanTreeStructure[key].value === 'localBeans') {
							beanTreeStructure[key].nodes.push(json)
						}
					}
				} catch (e) { console.error(e) }
			}
			if (beanTreeStructure[1].nodes.length > 0) {
				const beanTreeList = document.querySelector('#bean-tree-list')
				const $beanTreeList = $(beanTreeList)
				beanTreeList.innerHTML = ''
				$beanTreeList.data('plugin_bstreeview', null)
				$beanTreeList.bstreeview({data: beanTreeStructure})
				initButton()
			}
			fileElement.value = ''
		})
		.catch(error => {
			CreateUtils.createModal(`alert`, {body: `讀取檔案發生錯誤!錯誤原因：${ error }`})
			console.error(`讀取檔案發生錯誤!錯誤原因：${ error }`)
			fileElement.value = ''
		})
}

/**
 * 表單樹查詢功能
 * =
 * 依照節點進行查詢\
 * 將有符合的內容顯示\
 * 其餘不符合都隱藏\
 * 父節點會依照子節點存在對應顯示
 * @param {Event} e 
 */
function searchBeanTree(e) {
	try {
		if (beanTreeStructure === undefined) throw "not defined"
		const beanTreeList 	= document.querySelector('#bean-tree-list')
		const $beanTreeList = $(beanTreeList)
		const searchContext = e.target.value
		diggingTree(beanTreeStructure, searchContext)
		beanTreeList.innerHTML = ''
		$beanTreeList.data('plugin_bstreeview', null)
		$beanTreeList.bstreeview({data: beanTreeStructure})
		initButton()
	} catch (e) {
		console.log(`searchBeanTree() error: ${ e }`)
	}

	/**
	 * 遞迴處理樹狀結構
	 * @param {Object} tree 樹狀結構 
	 * @param {String} text 所要查詢的文字
	 * @returns 
	 */
	function diggingTree(tree, text) {
		if (Array.isArray(tree)) {
			let finalHide = true
			for (let i = 0, len = tree.length; i < len; ++i) {
				let needHide = diggingTree(tree[i], text)
				if (!needHide) finalHide = false
			}
			return finalHide
		} else {
			let finalHide = true
			if (tree.text.indexOf(text) > -1) {
				tree.hide = false
				finalHide = false
			}
			else tree.hide = true
			if (tree.nodes) {
				let needHide = diggingTree(tree.nodes, text)
				if (needHide) tree.hide = true
				else {
					tree.hide = false
					finalHide = false
				}
			}
			return finalHide
		}
	}
}

/**
 * api 清單查詢功能
 * =
 * 目前尚未實作詳細查詢\
 * 簡略做個基礎查詢
 * @param {Event} e 
 */
function apiSearchEvent(e) {
	try {
		const apiSearchBox 		= document.querySelector('#api-list-search-box')
		const apiList 			= document.querySelector('#api-list-list')
		const apiSearchValue  	= apiSearchBox.value
		apiList.childNodes.forEach(node => {
			if (node.innerText.includes(apiSearchValue)) node.classList.remove('hide')
			else node.classList.add('hide')
		})
	} catch (e) {
		console.log(`apiSearchEvent() error: ${ e }`)
	}
}

/**
 * api 新增、編輯功能
 * =
 * @param {Event} e 
 */
function addApiScript(e) {
	// if (!onlineMode) {
	// 	CreateUtils.createModal(`alert`, {body: '請開啟線上模式才可使用API新增功能'})
	// 	return
	// }

	const apiThisRow = this
	const apiSeq = this.dataset.apiSeq
	if (apiSeq) APIModule.tempComponent = APIModule.registerAPIComponents[apiSeq]
	else APIModule.tempComponent = undefined
	SharedUtils.requestAPIList(successCallback)

	/** ================ 下方皆為函數 ================ */
	/**
	 * 查詢參數成功回調
	 * =
	 * 製作彈出視窗處理 api 操作
	 * @param {Object} result
	 */
	function successCallback(result) {
		if (result !== APIModule.apiGFormData) APIModule.apiGFormData = result 
		/** 新增 api 彈出視窗 element */
		const apiModel = CreateUtils.createModal(`custom`, {
			'size': 	`modal-xl`,
			'title':    `新增應用程式介面(API)`,
			'body':     apiAddBody,
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
			'callback': apiModalCallBack
		})
		// 添加彈出視窗的事件
		const apiSelectName = apiModel.querySelector('#modalApiSelectName')
		const optGroup 		= apiSelectName.querySelectorAll('optgroup')
		const editCheckbox 	= apiModel.querySelectorAll('.edit-checkbox')
		const combineBoxes 	= apiModel.querySelectorAll('input[name="modalCombineBean"]')
		apiSelectName.addEventListener('change', apiSelectNameChanged)
		editCheckbox.forEach(editBox => {
			editBox.addEventListener('click', modalEditToggle)
		})

		// 設定彈出視窗資料
		APIModule.buildAPISelectOption(optGroup)

		// 若有編輯資料則將編輯資料帶入
		if (APIModule.tempComponent) {
			apiSelectName.value = `${ APIModule.tempComponent.apiName }||${ APIModule.tempComponent.runMode }||${ APIModule.tempComponent.sourceId }`
			if (!apiSelectName.value) apiSelectName.value = `${ APIModule.tempComponent.apiName }||${ APIModule.tempComponent.runMode }Y`
			if ('createEvent' in document) {
				var evt = document.createEvent('HTMLEvents')
				evt.initEvent('change', false, true)
				apiSelectName.dispatchEvent(evt)
			}
			if (APIModule.tempComponent.needAutoSetting) combineBoxes[2].checked = true
			if (APIModule.tempComponent.needGFormStructure) combineBoxes[1].checked = true
			if (APIModule.tempComponent.sendParam) editCheckbox[0].click()
			if (APIModule.tempComponent.receiveParam) editCheckbox[1].click()
		}

		/**
		 * api 名稱 select 切換事件
		 * =
		 * 將各自 api 資料帶入至欄位中
		 * @param {Event} e 
		 */
		function apiSelectNameChanged(e) {
			APIModule.apiSelectValueChangedEvent(e)
			const allModalRow 	= apiModel.querySelectorAll('.form-group.row')
			const sendTable 	= apiModel.querySelector('#modalSendTable')
			const receiveTable 	= apiModel.querySelector('#modalReceiveTable')
			const runMode 		= APIModule.tempComponent.runMode
			Array.from(sendTable.childNodes).forEach((node, index) => {
				if (index > 0) node.remove()
			})
			Array.from(receiveTable.childNodes).forEach((node, index) => {
				if (index > 0) node.remove()
			})
			allModalRow.forEach(row => {
				const rowType = row.dataset.type || 'F,M,BY,B,DY,D'
				if (rowType.indexOf(runMode) === -1) row.classList.add('hide')
				else row.classList.remove('hide')
			})
			
			APIModule.tempComponent.sendStructure.forEach(tr => sendTable.appendChild(tr.cloneNode(true)))
			APIModule.tempComponent.receiveStructure.forEach(tr => receiveTable.appendChild(tr.cloneNode(true)))
		}

		/**
		 * 編輯框點擊啟用編輯事件(通用)
		 * @param {Event} e 
		 */
		function modalEditToggle(e) {
			let selectorElement = apiModel.querySelector(e.target.dataset.tar)
			let tagName = selectorElement.tagName.toLowerCase()
			if (tagName === 'input') {
				if (e.target.checked) selectorElement.removeAttribute('disabled')
				else selectorElement.setAttribute('disabled', 'disabled')
			} 
			if (tagName === 'div') {
				if (e.target.checked) selectorElement.classList.remove('hide')
				else selectorElement.classList.add('hide')
			}
		}
	}

	/**
	 * 彈出視窗回調事件
	 * =
	 * @param {Number} index
	 * @param {Object} result
	 * @param {Element} modalElement
	 */
	function apiModalCallBack(index, modalElement) {
		let sendEdit = false
		let receiveEdit = false
		const modalForm = modalElement.querySelector('form')
		if (index === 1) {
			const apiSendParam = {}
			const apiReceiveParam = {}
			const apiCombineBean = {}
			// 初步動作 - 表單檢查
			for (let element of modalForm.elements) {
				const elementName 	= element.name
				const elementValue 	= element.value
				let isValid 		= true
				if (element.tagName.toLowerCase() === 'button' || elementName === '') continue
				switch (elementName) {
					case 'modalApiSelectName':
						if (elementValue === '0') isValid = false
						break
					case 'modalCombineBean':
						const isCheck = element.checked
						if (isCheck) {
							switch (elementValue) {
								case '1':
									apiCombineBean.autoCreate = true
									break
								case '2':
									apiCombineBean.autoGFormStructure = true
									break
								case '3':
									apiCombineBean.autoSetValue = true
									break
							}
						}
						break
					case 'modalSendParamEditBox':
						if (element.checked) sendEdit = true
						else sendEdit = false
						break
					case "modalReceiveParamEditBox":
						if (element.checked) receiveEdit = true
						else receiveEdit = false
						break
					default:
						if (!elementName.includes('-') || element.classList.contains('hide')) continue
						const elementType 		= element.type
						const elementNameArray 	= elementName.split('-')
						/** 動作 (receive / send) */
						let isModal 			= false
						let action 				= elementNameArray[0] 
						if (action === 'modal') { 
							isModal = true
							action = elementNameArray[1]
						}
						if ((action === 'send' && !sendEdit) || (action === 'receive' && !receiveEdit)) continue
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
								if (action === 'receive') {
									if (Object.keys(APIModule.tempComponent.eApiModule.fn.getDataMapping()).length > 0) {
										const mappingObject = APIModule.tempComponent.eApiModule.fn.getDataMapping()
										for (let node in mappingObject) {
											const mappingNode = mappingObject[node].node.split('.')
											if (mappingNode.indexOf(paramName) === (mappingNode.length - 1)) {
												paramObject = mappingObject[node]
												paramObject.paramMapping = []
												break
											}
										}
									}
								}
								if (action === 'send' && sendEdit) apiSendParam[paramName] = paramObject
								if (action === 'receive' && receiveEdit) apiReceiveParam[elementValue] = paramObject
							}
							// 對照內容
							if (elementNameArray.length > 0 && isModal) {
								elementNameArray.shift()
								elementNameArray.shift()
								elementNameArray.pop()
								let paramName = elementNameArray.join('-')
								if (action === 'send' && sendEdit) apiSendParam[paramName].paramMapping.push(elementValue)
								if (action === 'receive' && receiveEdit) {
									for (let nodeName in apiReceiveParam) {
										const mappingNode = apiReceiveParam[nodeName].node.split('.')
										if (mappingNode.includes(paramName)) apiReceiveParam[nodeName].paramMapping.push(elementValue)
									}
								}
							}
						}
						break
				}
				if (!isValid) {
					element.classList.add('is-invalid')
					return false
				}
			}
			APIModule.tempComponent.sendParam = (Object.keys(apiSendParam).length === 0) ? undefined : apiSendParam
			APIModule.tempComponent.receiveParam = (Object.keys(apiReceiveParam).length === 0) ? undefined : apiReceiveParam
			APIModule.tempComponent.needAutoSetting = apiCombineBean.autoSetValue
			APIModule.tempComponent.needGFormStructure = apiCombineBean.autoGFormStructure
			APIModule.tempComponent.generateShell()
			let component = APIModule.tempComponent
			if (!APIModule.tempComponent.apiSeq) {
				component = APIModule.create(APIModule.tempComponent)
				APIModule.tempComponent = null
				let frameModel = 'gFormWebADD'
				if (isListPage()) frameModel = 'gFormWebLIST'
				else if (isPrintPage()) frameModel = 'gFormWebPRINT'
				component.formType = frameModel
				const apiList 		= document.querySelector('#api-list-list')
				apiList.appendChild(component.container)
			} else {
				apiThisRow.replaceWith(component.container)
			}
			component.container.classList.remove('hide')
			initButton()
			return true
		}
	}
}

/**
 * 元件滑入事件
 * =
 * 增加滑入效果
 * @param {Event} e 
 */
function elementHover(e) {
	SharedUtils.cancelDefault(e)
	if (SharedUtils.isEditing()) return
	const element 		= this
	const targetParent 	= this.parentNode
	if (element.dataset.edit === undefined) {
		if (targetParent.dataset.edit === undefined) return
		else targetParent.classList.add('hover')
	} else element.classList.add('hover')
}

/**
 * 元件滑出事件
 * =
 * 移除滑入效果
 * @param {Event} e 
 */
function elementLeave(e) {
	SharedUtils.cancelDefault(e)
	this.classList.remove('hover')
}

/**
 * 清除腳本彈出視窗資料
 * =
 * - 新增腳本使用
 */
function cleanModalData() {
	const activeModal 	= document.querySelector('.modal.show')
	const beanContainer = activeModal.querySelector('#modalBeanContainer')
	const scriptName 	= activeModal.querySelector('#modalScriptName')
	const scriptType 	= activeModal.querySelector('#beanScriptType')
	const tableAddTags 	= activeModal.querySelectorAll('.need-hide, .need-show')
	scriptName.value = ''
	scriptType.value = '0'
	for (let bean of beanContainer.children) {
		bean.classList.remove('active')
	}
	tableAddTags.forEach(tag => tag.classList.remove('need-hide', 'need-show'))
	if ('createEvent' in document) {
		var evt = document.createEvent('HTMLEvents');
		evt.initEvent('change', false, true);
		scriptType.dispatchEvent(evt);
	}
}

/**
 * 編輯輸入框完成事件
 * =
 * @param  {Event} 	 e    [事件]
 * @param  {Boolean} bol  [取消或確定]
 */
function editEnd(e, bol) {
	/** 引入元件工廠 */
	const factory 			= window.ComponentFactory
	/** 表單框架 */
	const drawPage 			= document.querySelector('#drawPage')
	/** 被選取的元素 */
	const selectedElement 	= document.querySelector('.selected')
	/** 屬性清單 */
	const materialList 		= document.querySelector('#materialList')
	/** 完成按鈕 */
	const successButton 	= e.target.closest('button')
	/** 編輯區塊 */
	const block 			= e.target.closest('.focus-edit')
	/** 編輯區塊父層(裝載編輯區塊的元素) */
	const attributeBlock 	= block.parentNode
	/** 編輯輸入框 */
	const input 			= block.querySelector('input')
	/** 元件屬性 */
	const attribute 		= successButton.dataset.attribute
	/** 正則 - 判斷空格 */
	const regex 			= /\s/g
	// 若點擊取消則直接將原有資料復原
	if (!bol) attributeBlock.innerHTML = input.dataset.defaultValue
	else {
		const inputValue = input.value.replace(/\s/g, '')
		// 若無選取元件則直接將值放入區塊內
		if (selectedElement === null) attributeBlock.innerHTML = input.value
		else {
			// 若無屬性則直接將值放入區塊內
			if (attribute === undefined) attributeBlock.innerHTML = input.value
			else {
				/** 取得元件序號 */
				const seq 		= selectedElement.dataset.seq
				/** 目前選取的元件 */
				let component = factory.getRegisterComponentBySeq(seq)
				if (component) {
					// 調整元件名稱(En)
					if (attribute === 'externalName') {
						if (inputValue === '') {
							input.classList.add('is-invalid')
							return false
						}
						// if (factory.checkComponentExist(inputValue)) {
						// 	CreateUtils.createModal(`alert`, {body: '此名稱已有其他元件使用，請更換其他名稱'})
						// 	input.classList.add('is-invalid')
						// 	return false
						// }
						let nameFirstRegex = new RegExp(/^[a-zA-Z_][a-zA-Z0-9_]*$/)
						if (!nameFirstRegex.test(inputValue)) {
							CreateUtils.createModal(`alert`, {body: '此名稱不合法，命名規則：\n1.名稱只能包含英文數字及底線\n2.名稱開頭不能為數字'})
							input.value = input.dataset.defaultValue
							return false
						}
						if (regex.test(input.value)) CreateUtils.createModal(`alert`, {body: '標題包含空格，已自動將空格移除！'})
						// 連動標題改變
						// const connectWithLabel = drawPage.querySelector(`label.h6[data-connect="${ component.dataset.name }"]`)
						// if (connectWithLabel !== null) connectWithLabel.dataset.connect = inputValue
						// 設定原始標題
						// component.dataset.originName 	= component.dataset.name
						// component.dataset.bean 			= inputValue
						// 檢查驗證規則名稱對應調整名稱
						// if (verificationVersion) {
						// 	for (let verificationObject of verificationVersion) {
						// 		if (verificationObject.tar && verificationObject.tar !== component.dataset.originName) continue
						// 		if (verificationObject.events && verificationObject.events[0].tar && verificationObject.events[0].tar !== component.dataset.originName) continue
						// 		verificationObject.tar 				= inputValue
						// 		verificationObject.events[0].tar 	= inputValue
						// 	}
						// }
						// 檢查API是否有引用該元件並調整名稱
						// for (let seq in APIModule.registerAPIComponents) {
						// 	const apiComponent = APIModule.registerAPIComponents[seq]
						// 	apiComponent.beanNameChanged(component.dataset.name, inputValue)
						// }
						// 檢查腳本是否有引用該元件並調整名稱
						// const allComponents = factory.registerComponent
						// if (allComponents) {
						// 	for (let seq in allComponents) {
						// 		const registerComponent = allComponents[seq]
						// 		registerComponent.otherBeanNameChanged(component.dataset.name, inputValue)
						// 	}
						// }
						// 其餘元件內部是否使用
					}
					// 調整元件中文標題(zh-TW)
					if (attribute === 'title') {
						let promptTips 	= component.dataset.promptTips || ''
						// let placeholder = component.dataset.placeholder || ''
						// 必填提醒文字連動
						if (promptTips === '') {
							component.dataset.promptTips = `請輸入${ input.value }`
							const promptTipsText = materialList.querySelector('div[data-attribute="promptTips"]')
							if (promptTipsText !== null) promptTipsText.innerText = `請輸入${ input.value }`
						}
						// 輸入框提醒文字連動 (冠蓁提議不需要此操作 2022.03.21)
						// if (placeholder === '') {
						// 	component.dataset.placeholder = inputValue
						// 	const placeholderText = materialList.querySelector('div[data-attribute="placeholder"]')
						// 	if (placeholderText !== null) placeholderText.innerText = inputValue
						// }
						// 連動標題呈現
						const connectWithLabel = drawPage.querySelector(`label.h6[data-connect="${ component.dataset.name }"]`)
						if (connectWithLabel !== null) connectWithLabel.innerHTML = input.value
					}
					// 調整多選單選下拉框選項欄位
					if (attribute === 'uiDesc') {
						const uiValueInput 	= materialList.querySelector('div[data-attribute="uiValue"]')
						const uiValueText	= uiValueInput.innerText
						const optionsArray 	= uiValueText.split(',')
						const inputOptions 	= input.value.split(',')
						// 若欄位數量不一樣則將值欄位一並修改
						if (inputOptions.length > optionsArray.length) {
							uiValueInput.innerText 		= input.value
							component.dataset.uiValue 	= input.value
						} else if (inputOptions.length < optionsArray.length) 
							CreateUtils.createModal(`alert`, {body: '目前標題與值數量不同，記得修改標題的同時也修改值'})
					}
					// 調整多選單選下拉框值欄位 
					if (attribute === 'uiValue') {
						const uiDescInput 	= materialList.querySelector('div[data-attribute="uiDesc"]')
						const uiDescText	= uiDescInput.innerText
						const optionsArray 	= uiDescText.split(',')
						const inputOptions 	= input.value.split(',')
						const isSame 		= inputOptions.some((element, index) => inputOptions.indexOf(element) !== index)
						if (isSame) {
							CreateUtils.createModal(`alert`, {body: '選項值無法使用相同值'})
							return false
						}
						if (optionsArray.length !== inputOptions.length) 
							CreateUtils.createModal(`alert`, {body: '目前標題與值數量不同，記得修改值的同時也修改標題'})
					}
				} else {
					const webComponentType = selectedElement.dataset.webComponent
					switch (webComponentType) {
						case 'list':
							const type = selectedElement.dataset.type
							component = factory.getListComponent(type)
							break
						case 'print':
							const printSeq = selectedElement.dataset.printSeq
							component = factory.getPrintComponent(printSeq)
							break
					}
				}
				if (!component) attributeBlock.innerHTML = input.value
				else {
					component.boxEditBeforeChanged(attribute, input.value)
					// 設定屬性及區塊取代
					component.dataset[attribute] 	= attribute === 'externalName' ? inputValue : input.value
					attributeBlock.innerHTML 		= attribute === 'externalName' ? inputValue : input.value
					component.boxEditAfterChanged(attribute, input.value)
				}
				if (isAddPage()) beanFocusStopDrop(false)
			}
		}
	}
	beanToListEvent()
	SharedUtils.clearHover()
	SharedUtils.cancelDefault(e)
}

/**
 * 畫布選取
 * =
 * 選取該畫布的表格
 * @param  {Event} e [事件]
 */
function drawPageClick(e) {
	SharedUtils.clearTableActiveData()
	SharedUtils.clearTableActiveHead()
	SharedUtils.clearSelectedElements()
	beanFocusStopDrop(true)
	toolPackActive(false)
	SharedUtils.cancelDefault(e)
}

/**
 * 左側表單元件清單選取
 * =
 * 同表格內選取元件
 * @param {Element} that 
 */
function beanBtnSelected(that) {
	const name 			= that.getAttribute('value')
	const drawPage 		= document.querySelector('#drawPage')
	// 需調整為 seq select
	const targetElement = drawPage.querySelector(`.pFormItem[data-name="${ name }"], .pFormItemGroup[data-name="${ name }"]`)
	if (targetElement !== null) elementSelected(targetElement)
}

/**
 * 清空已棄用元件
 * =
 * @param {Element} that 
 */
function clearAbandonedBean() {
	const abandonedList = document.querySelector('#abandoned-bean-content')
	const listGroupItem = abandonedList.querySelectorAll('.list-group-item')
	listGroupItem.forEach(item => {
		removeTargetBean(item.dataset.seq)
	})
	beanToListEvent()
}

/**
 * 工具包點擊事件觸發器
 * =
 * @param  {Event} e 事件
 */
function toolPackTrigger(e) {
	const toolPackBar = document.querySelector('.tool-pack-bar')
	if (toolPackBar === null) return
	this.blur()
	if (toolPackBar.classList.contains('active')) {
		toolPackBar.classList.remove('active')
		setTimeout(() => {
			toolPackBar.classList.add('hide')
		}, 150)
	} else {
		toolPackBar.classList.remove('hide')
		setTimeout(() => {
			toolPackBar.classList.add('active')
		}, 150)
	}
}

function toolPackDragstart(e) {
	let style = window.getComputedStyle(this, null);
    e.dataTransfer.setData("text/plain",
    (parseInt(style.getPropertyValue("left"),10) - e.clientX) + ',' + (parseInt(style.getPropertyValue("top"),10) - e.clientY));
}

function toolPackDropped(e) {
	let offset = e.dataTransfer.getData("text/plain").split(',');
    let toolPack = document.querySelector('#toolPack');
	let toolPackBar = document.querySelector('.tool-pack-bar')
	let barRight = window.innerWidth - (e.clientX + parseInt(offset[0],10) + toolPack.offsetWidth) + 120
    toolPack.style.left = (e.clientX + parseInt(offset[0],10)) + 'px';
    toolPack.style.top = (e.clientY + parseInt(offset[1],10)) + 'px';
	toolPackBar.style.right = barRight + 'px';
    toolPackBar.style.top = (e.clientY + parseInt(offset[1],10)) + 'px';
    e.preventDefault();
    return false;
}

/**
 * 合併按鈕點擊事件
 * =
 * 將所選欄位進行合併
 * @param  {Event} e 事件
 */
function tableSpan(e) {
	/** 表單畫布 */
	const drawPage 			= document.querySelector('#drawPage')
	let activeTable, activeTableData
	if (isAddPage())
		/** 找到目前顯示頁籤的表格 */
		activeTable 		= drawPage.querySelector('div.tab-pane.active > table')
	else if (isPrintPage())
		/** 找到目前有選取表格的表 */
		activeTable 		= drawPage.querySelector('.resultTable.active')
	/** 目前選取的表格 */
	activeTableData 	= activeTable.querySelectorAll('td.active')
	/** 選取的方位 (col, row, unset) */
	const position 			= isColRow(activeTable)
	const breakException 	= {}
	if (position === 'unset') return false
	if (position === 'row') {
		try {
			activeTableData.forEach((td, index) => {
				if (index === 0 && td.colSpan > 1) throw breakException
				const className 	= `rowspan-${ index }`
				if (index === 0) {
					td.classList.add(className)
					td.rowSpan = activeTableData.length
				} else {
					td.classList.add(className, 'hide')
					const insideBeans = td.querySelectorAll('.pFormItem[data-name], .pFormItemGroup[data-name]')
					insideBeans.forEach(bean => {
						activeTableData[0].appendChild(bean)
					})
				} 
				td.classList.remove('active')
			})
		} catch (e) {
			CreateUtils.createModal(`alert`, {body: '已經合併的儲存格無法再與其他欄位合併。'})
		}
		toolPackActive(false)
		return false
	}
	if (position === 'col') {
		try {
			activeTableData.forEach((td, index) => {
				if (index === 0 && td.rowSpan > 1) throw breakException
				if (index === 0) td.colSpan = activeTableData.length
				else { 
					td.classList.add('hide')
					const insideBeans = td.querySelectorAll('.pFormItem[data-name], .pFormItemGroup[data-name]')
					insideBeans.forEach(bean => {
						activeTableData[0].appendChild(bean)
					})
				}
				td.classList.remove('active')
			})
		} catch (e) {
			CreateUtils.createModal(`alert`, {body: '已經合併的儲存格無法再與其他欄位合併。'})
		}
		toolPackActive(false)
		return false
	}
}

/**
 * 分解按鈕點擊事件
 * =
 * 將所選欄位進行分解
 * @param  {Event} e 事件
 */
function disassembleCell(e) {
	/** 表單畫布 */
	const drawPage 			= document.querySelector('#drawPage')
	let activeTable, parentBody, tableAllRows, activeTableData
	if (isAddPage())
		/** 找到目前顯示頁籤的表格 */
		activeTable 		= drawPage.querySelector('div.tab-pane.active > table')
	else if (isPrintPage())
		/** 找到目前有選取表格的表 */
		activeTable 		= drawPage.querySelector('.resultTable.active')
	/** 目前選取表格的錶身 */
	parentBody 			= activeTable.querySelector('tbody')
	/** 目前選取的表列 */
	tableAllRows 		= parentBody.querySelectorAll('tr')
	/** 目前選取的表格 */
	activeTableData 	= activeTable.querySelectorAll('td.active')
	if (activeTableData.length === 0) return false
	activeTableData.forEach(td => {
		if (td.rowSpan > 1 || td.colSpan > 1) {
			const rowSpan = td.rowSpan
			const colSpan = td.colSpan
			if (rowSpan > 1) {
				const tableRow 	= td.closest('tr')
				const x 		= td.parentNode.children.indexOf(td)
				const y 		= tableRow.parentNode.children.indexOf(tableRow)
				td.rowSpan 		= 1
				for (let i = (y + 1); i < (y + rowSpan); ++i) {
					tableAllRows[i].children[x].removeAttribute('class')
				}
				if (td.classList.contains('table-data-title')) {
					td.removeAttribute('class')
					td.classList.add('table-data-title')
				} else td.removeAttribute('class')
				toolPackActive(false)
				return
			}
			if (colSpan > 1) {
				const x 		= td.parentNode.children.indexOf(td)
				const tableData = td.parentNode.children
				td.colSpan 		= 1
				for (let i = (x + 1); i < (x + colSpan); ++i) {
					tableData[i].classList.remove('hide')
				}
				td.classList.remove('active')
				toolPackActive(false)
				return
			}
		}
	})
}

/**
 * 顯示頁籤事件
 * =
 * 切換頁籤
 * @param {Event} e 
 */
function showTab(e) {
	e.preventDefault()
	$(this).tab('show')
	return false
}

/**
 * 移除指定頁籤
 * =
 * @param {Event} e 
 */
function removeTab(e) {
	SharedUtils.cancelDefault(e)
	const tabList 	= document.querySelector('#tabs')
	const aTag 		= this
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
 * =
 * 需要新增頁籤以及頁面內容
 * @param  {Event} e 事件
 */
function addTabs(e) {
	const tabList 		= document.querySelector('#tabs')
	const tabLength 	= tabList.children.length
	const pageArray		= CreateUtils.createNewPage(tabLength)
	const tabContent 	= document.querySelector('#tabContent')
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
	if (e) {
		initDrawPageEvent()
		SharedUtils.cancelDefault(e)
	}
}

/**
 * 取得當前表格最大欄位數量
 * =
 * @param {Element} table 目標表格
 */
function getTableMaxCell(table) {
	let cellCount 	= 0
	const tableRows = table.querySelectorAll('tbody > tr')
	tableRows.forEach(tr => {
		const tableDataCount = tr.querySelectorAll(':scope > td, :scope > th').length
		if (tableDataCount > cellCount) cellCount = tableDataCount
	})
	if (cellCount > 0) return cellCount
}

/**
 * 取得當前欄位的上左右下方位位置(x, y)
 * =
 * @param {Number} x x 座標
 * @param {Number} y y 座標
 * @returns {Array[Array[Number]]} result [上, 左, 右, 下]
 */
function getSideCellPosition(x, y) {
	const resultArray = []
	if (y !== 0) 
		resultArray.push([x , y - 1])
	if (x !== 0) 
		resultArray.push([x - 1, y])
	resultArray.push([x + 1, y])
	resultArray.push([x, y + 1])
	return resultArray
}

/**
 * 取得當前表格選取的方位
 * =
 * @param {Element} table 表格
 * @returns {String} result row: 橫向選取, col: 縱向選取, unset: 無法判別
 */
function isColRow(table) {
	const positionArray 	= []
	const activeTable 		= table.querySelectorAll('td.active')
	const breakException 	= {}
	let result 				= 'unset'
	try {
		activeTable.forEach(td => {
			const tableRow 	= td.closest('tr')
			const x 		= td.parentNode.children.indexOf(td)
			const y 		= tableRow.parentNode.children.indexOf(tableRow)
			if (positionArray.length > 0) {
				if (positionArray[0][0] === x) result = 'row'
				else if (positionArray[0][1] === y) result = 'col'
				throw breakException
			}
			positionArray.push([x, y])
		})
	} catch (e) { }
	return result
}

/**
 * 工具包啟用規則
 * =
 * @param {Boolean} isOpen 		是否展開
 * @param {Object} needToOpen  	展開物件的名稱
 */
function toolPackActive(isOpen, needToOpen) {
	const toolPack 		= document.querySelector('#toolPack')
	const toolPackBar 	= document.querySelector('.tool-pack-bar')
	const toolButtons 	= toolPackBar.querySelectorAll('button')
	toolButtons.forEach(button => button.classList.remove('active'))
	toolPackBar.classList.remove('active')
	toolPack.classList.remove('active')
	if (isOpen) {
		for (let id in needToOpen) {
			if (needToOpen[id]) toolPackBar.querySelector(id).classList.add('active')
		}
		toolPack.classList.remove('hide')
		toolPack.classList.add('active')
		toolPack.disabled = false
	} else {
		toolPack.classList.remove('active')
		toolPack.disabled = true
		toolPack.classList.add('hide')
	}
}

/**
 * 腳本視窗展開觸發器
 */
function foldTriggerInit(e) {
	const listBlock = e.target.closest('.list-block')
	if (listBlock.classList.contains('active')) listBlock.classList.remove('active')
	else listBlock.classList.add('active')
}

/**
 * 整理表單上元件至表單元件
 */
function beanToListEvent() {
	/** 引入工廠 */
	const factory = window.ComponentFactory
	const alreadyUsedBeanContent = document.querySelector('#already-used-bean-content')
	const $alreadyUsedBeanContent = $(alreadyUsedBeanContent)
	const abandonedBeanContent = document.querySelector('#abandoned-bean-content')
	const $abandonedBeanContent = $(abandonedBeanContent)
	let needCreateBean = false
	if (alreadyUsedBeanContent.children.length === 0) needCreateBean = true
	try {
		if (isAddPage() || needCreateBean) {
			alreadyUsedBeanContent.innerHTML = ''
			$alreadyUsedBeanContent.data('plugin_bstreeview', null)
			abandonedBeanContent.innerHTML = ''
			$abandonedBeanContent.data('plugin_bstreeview', null)
			// 第二階段 - 依照【元件物件對照表】進行樹狀結構建立
			// Step1. 【清空元件】按鈕建置並放入對應區域
			abandonedBeanContent.appendChild(CreateUtils.createBeanElement({
				'controlType': 'button',
				'attribute': 	[
					{
						'type':  	'button',
						'class': 	'btn btn-outline-danger col-12',
						'onclick': 	'clearAbandonedBean(this)',
						'text': 	'清空已棄用元件',
						'id': 		SharedUtils._uuid()
					}
				]
			})[0])
			/** 表單上的元建清單陣列 */
			const formBeanAlreadyList = []
			/** 不在表單上(已棄用元件)清單陣列 */
			const formBeanAbandonedList = []
			/** 表單全部元件 */
			const allComponents = factory.registerComponent
			if (allComponents) {
				factory.clearComponentTreeStructure()
				factory.checkingAllDone()
				factory.buildAllRegisterComponents()
				for (let component in allComponents) {
					if (allComponents[component].treeStructure || allComponents[component].dataset.parent || allComponents[component].dataset.treeParent) continue
					if (allComponents[component].abandoned) formBeanAbandonedList.push(allComponents[component].buildTreeObject())
					else formBeanAlreadyList.push(allComponents[component].buildTreeObject())
				}
			}
			$alreadyUsedBeanContent.bstreeview({data: formBeanAlreadyList})
			$abandonedBeanContent.bstreeview({data: formBeanAbandonedList})
		} 
		if (isListPage()) {
			if (factory.usedListComponent) {
				const listBeanContent = document.querySelector('#list-bean-content')
				listBeanContent.querySelectorAll('button').forEach(button => button.disabled = false)
				for (let type in factory.usedListComponent) {
					const buttonElement = listBeanContent.querySelector(`button[value="${ type }"]`)
					if (buttonElement) buttonElement.disabled = true
				}
			}
			/** 表單全部元件 */
			const allComponents = factory.registerComponent
			if (allComponents) {
				factory.checkingAllDone()
				for (let seq in allComponents) {
					const component = allComponents[seq]
					let barContainer
					if (component.listComponent && component.listComponent.parentNode) {
						if (component.abandoned) {
							barContainer = abandonedBeanContent.querySelector(`.list-group-item[data-seq="${ component.seq }"]`)
							if (barContainer) {
								barContainer.draggable = false
								barContainer.classList.add('disabled')
							}
						} else {
							barContainer = alreadyUsedBeanContent.querySelector(`.list-group-item[data-seq="${ component.seq }"]`)
							if (barContainer) {
								barContainer.draggable = false
								barContainer.classList.add('disabled')
							}
						}
					} else if (component.listComponent && !component.listComponent.parentNode) {
						if (component.abandoned) {
							barContainer = abandonedBeanContent.querySelector(`.list-group-item[data-seq="${ component.seq }"]`)
							if (barContainer) {
								barContainer.draggable = true
								barContainer.classList.remove('disabled')
							}
						} else {
							barContainer = alreadyUsedBeanContent.querySelector(`.list-group-item[data-seq="${ component.seq }"]`)
							if (barContainer) {
								barContainer.draggable = true
								barContainer.classList.remove('disabled')
							}
						}
					}
				}
			}
		}
		if (isPrintPage()) {
			const allComponents = factory.registerComponent
			const createdContent = document.querySelector('#created-inside-bean-tabContent')
			if (allComponents) {
				factory.checkingAllDone()
				for (let seq in allComponents) {
					const component = allComponents[seq]
					const treeItem = createdContent.querySelector(`.list-group-item[value="${ component.dataset.name }"]`)
					treeItem.classList.remove('disabled')
					if (!component.printComponent.closest('html') && treeItem) treeItem.setAttribute('draggable', 'true')
					else if (treeItem) treeItem.setAttribute('draggable', 'false')
				}
			}
		}
	} catch (e) {
		console.error(`config didn't setting success... error: ${e}`)
	}
	initButton()
}

/**
 * 驗證設定彈出視窗
 * =
 */
function inputRuleSetting() {
	/** 引入工廠 */
	const factory 			= window.ComponentFactory
	/** 取得選取的元件 */
	const selectedElement 	= document.querySelector('.selected')
	/** 選取元件的編號 */
	const seq 				= selectedElement.dataset.seq
	/** 取得元件物件 */
	const component 		= factory.getRegisterComponentBySeq(seq)
	/** 輸入規則 */
	const ruleStructure 	= component.dataset.ruleStructure
	const inputRuleModal = CreateUtils.createModal(`custom`, {
		'title':    `輸入類型設定`,
		'body':     inputTypeSettingBody,
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
				'text':  '設定'
			}
		],
		'callback': inputRuleModalCallBack
	})
	// addEvent
	const inputTypeSelect 	= inputRuleModal.querySelector('#modalInputTypeSelect')
	const numberType 		= inputRuleModal.querySelectorAll('input[name="modalNumberType"]')
	const numberTypeFloat 	= inputRuleModal.querySelector('#modalNumberTypeFloat')
	const numberMinLimit 	= inputRuleModal.querySelector('#modalNumberMinLimit')
	const numberMaxLimit 	= inputRuleModal.querySelector('#modalNumberMaxLimit')
	const pidSelect 		= inputRuleModal.querySelector('#modalPidSelect')
	const telSelect 		= inputRuleModal.querySelector('#modalTelSelect')
	const regexInput 		= inputRuleModal.querySelector('#modalRegexInput')
	const warningInput 		= inputRuleModal.querySelector('#modalWarningText')

	inputTypeSelect.addEventListener('change', typeChanged)
	numberType.forEach(input => input.addEventListener('click', numberDisplayEvent))

	// 設定編輯資料
	if (ruleStructure) {
		const ruleObj = SharedUtils.onionStringDecode(ruleStructure)
		inputTypeSelect.value = ruleObj.ruleType
		warningInput.value = ruleObj.warningText
		if ('createEvent' in document) {
			var evt = document.createEvent('HTMLEvents');
			evt.initEvent('change', false, true);
			inputTypeSelect.dispatchEvent(evt);
		}
		switch (ruleObj.ruleType) {
			case 'number':
				numberType.forEach(input => {
					if (input.value === ruleObj.numberType) {
						input.checked = true
						numberTypeFloat.classList.remove('hide')
					}
				})
				if (ruleObj.floatCount) numberTypeFloat.value = ruleObj.floatCount
				if (ruleObj.minLimit) numberMinLimit.value = ruleObj.minLimit
				if (ruleObj.maxLimit) numberMaxLimit.value = ruleObj.maxLimit
				break
			case 'pid':
				pidSelect.value = ruleObj.pidType
				break
			case 'tel':
				telSelect.value = ruleObj.telType
				break
			case 'regex':
				regexInput.value = ruleObj.regex
				break
		}
	}

	/** ================ 下方皆為函數 ================ */
	
	/**
	 * 驗證設定彈出視窗回調
	 * =
	 * @param {*} index 
	 * @param {*} result 
	 * @param {*} modalElement 
	 * @returns 
	 */
	function inputRuleModalCallBack(index, modalElement) {
		const modalForm = modalElement.querySelector('form')
		if (index === 1) {
			let checkType, condition, inputType, numberType, floatCount, pidType, telType, numberMinLimit, numberMaxLimit, warningText
			// 初步動作 - 表單檢查
			for (let element of modalForm.elements) {
				let isValid 		= true
				const elementValue 	= element.value
				const elementName 	= element.name
				switch (elementName) {
					case 'modalInputTypeSelect':
						if (elementValue === '0') isValid = false
						else {
							inputType = elementValue 
							switch (inputType) {
								case 'email':
									checkType = 'function'
									condition = 'checkEmail'
									break
								case 'pid':
								case 'tel':
									checkType = 'function'
									break
								case 'regex':
									checkType = 'regex'
									break
							}
						}
						break
					case 'modalNumberType':
						if (inputType === 'number' && modalForm.querySelectorAll(`input[name="${ elementName }"]:checked`).length === 0) isValid = false
						if (inputType === 'number' && element.checked) {
							numberType = elementValue
							switch (numberType) {
								case '0':
									checkType = 'number'
									break
								case '1':
									checkType = 'int'
									break
								case '2':
									checkType = 'float'
									break
							}
						}
						break
					case 'modalNumberTypeFloat':
						if (inputType === 'number' && numberType === '2' && elementValue === '') isValid = false
						else if (inputType === 'number' && numberType === '2' && elementValue !== '') floatCount = elementValue
						break
					case 'modalNumberMinLimit':
						if (inputType === 'number' && elementValue === '') isValid = false
						else {
							if (inputType === 'number' && numberType === '2' && elementValue !== '') {
								const valueArray = elementValue.split('.')
								if (valueArray.length > 1) {
									if (valueArray[1].length === floatCount) numberMinLimit = elementValue
									else if (valueArray[1].length > floatCount) {
										valueArray[1] = valueArray[1].substring(0, floatCount)
										numberMinLimit = valueArray.join('.')
									} else if (valueArray[1].length < floatCount) {
										numberMinLimit = elementValue 
										let c = floatCount - valueArray[1].length
										for (let i = 0; i < c; ++i) {
											numberMinLimit += '0'
										}
									}
								} else {
									numberMinLimit = elementValue + '.'
									for (let i = 0; i < floatCount; ++i) {
										numberMinLimit += '0'
									}
								}
							} else if (inputType === 'number' && elementValue !== '')
								numberMinLimit = elementValue
						}
						break
					case 'modalNumberMaxLimit':
						if (inputType === 'number' && elementValue === '') isValid = false
						else {
							if (inputType === 'number' && numberType === '2' && elementValue !== '') {
								const valueArray = elementValue.split('.')
								if (valueArray.length > 1) {
									if (valueArray[1].length === floatCount) numberMaxLimit = elementValue
									else if (valueArray[1].length > floatCount) {
										valueArray[1] = valueArray[1].substring(0, floatCount)
										numberMaxLimit = valueArray.join('.')
									} else if (valueArray[1].length < floatCount) {
										numberMaxLimit = elementValue 
										let c = floatCount - valueArray[1].length
										for (let i = 0; i < c; ++i) {
											numberMaxLimit += '0'
										}
									}
								} else {
									numberMaxLimit = elementValue + '.'
									for (let i = 0; i < floatCount; ++i) {
										numberMaxLimit += '0'
									}
								}
							} else if (inputType === 'number' && elementValue !== '')
								numberMaxLimit = elementValue
						}
						break
					case 'modalPidSelect':
						if (inputType === 'pid' && elementValue === '0') isValid = false
						else if (inputType === 'pid' && elementValue !== '0') {
							pidType = elementValue
							switch (pidType) {
								case 'origin':
									condition = 'checkTwID'
									break
								case 'newStyle':
									condition = 'checkTwNewResidentID'
									break
								case 'oldStyle':
									condition = 'checkTwOldResidentID'
									break
								case 'cnStyle':
									condition = 'checkCnID'
									break
							}
						}
						break
					case 'modalTelSelect':
						if (inputType === 'tel' && elementValue === '0') isValid = false
						else if (inputType === 'tel' && elementValue !== '0') {
							telType = elementValue
							switch (telType) {
								case 'phone':
									condition = 'checkTwPhone'
									break
								case 'cell':
									condition = 'checkTwCellPhone'
									break
								case 'phoneC':
									condition = 'checkCnPhone'
									break
								case 'cellC':
									condition = 'checkCnCellPhone'
									break
							}
						}
						break
					case 'modalRegexInput':
						if (inputType === 'regex' && elementValue === '') isValid = false
						else if (inputType === 'regex' && elementValue !== '') condition = elementValue
						break
					case 'modalWarningText':
						if (elementValue === '') isValid = false
						else warningText = elementValue
						break
				}
				if (!isValid) {
					element.classList.add('is-invalid')
					return false
				}
			}
			const rejectObject = {
				mode: "reject",
				hint: warningText
			}
			const ifs = {
				checktype: checkType,
				condition: condition
			}
			if (inputType === 'number') {
				ifs.min = numberMinLimit
				ifs.max = numberMaxLimit
			}
			const eventRule = {
				eval_false: '',
				eval_true: 	'',
				evts: 		[rejectObject],
				ifs: 		[ifs],
				operator: 	'||',
				tar: 		component.dataset.name
			}
			const ruleObject = {
				events: 	[eventRule],
				ifs: 		[],
				operator: 	'||',
				type: 		inputType,
				tar: 		component.dataset.name
			}
			const ruleStructure = {
				ruleType: 	inputType,
				numberType: numberType,
				floatCount: floatCount,
				minLimit: 	numberMinLimit,
				maxLimit: 	numberMaxLimit,
				pidType: 	pidType,
				telType: 	telType,
				regex: 		condition,
				warningText: warningText
			}
			component.dataset.ruleStructure = JSON.stringify(ruleStructure)
			if (verificationVersion) {
				let notExist = true
				for (let i = 0, len = verificationVersion.length; i < len; i++) {
					if (verificationVersion[i].tar && verificationVersion[i].tar !== component.dataset.name) continue
					if (verificationVersion[i].events && verificationVersion[i].events[0].tar && verificationVersion[i].events[0].tar !== component.dataset.name) continue
					notExist = false
					verificationVersion[i].events = [eventRule]
				}
				if (notExist) verificationVersion.push(ruleObject)
			}
			return true
		}
	}

	/**
	 * 選擇類型切換
	 * =
	 * @param {Event} e 
	 */
	function typeChanged(e) {
		const setRows 		= inputRuleModal.querySelectorAll('.set-row')
		const numberRows 	= inputRuleModal.querySelectorAll('.number')
		const pidRows 		= inputRuleModal.querySelectorAll('.pid')
		const telRows 		= inputRuleModal.querySelectorAll('.tel')
		const regexRows 	= inputRuleModal.querySelectorAll('.regex')
		setRows.forEach(row => row.classList.add('hide'))
		switch (e.target.value) {
			case 'number':
				numberRows.forEach(row => row.classList.remove('hide'))
				break
			case 'pid':
				pidRows.forEach(row => row.classList.remove('hide'))
				break
			case 'tel':
				telRows.forEach(row => row.classList.remove('hide'))
				break
			case 'regex':
				regexRows.forEach(row => row.classList.remove('hide'))
				break
		}
	}

	/**
	 * 數值顯示動態效果
	 * =
	 * 選擇小數點需要顯示小數點後幾位
	 * @param {Event} e 
	 */
	function numberDisplayEvent(e) {
		const value = e.target.value
		if (value === '2') numberTypeFloat.classList.remove('hide')
		else numberTypeFloat.classList.add('hide')
	}
}

/**
 * 檢查當頁是否為列印頁面
 * =
 * @returns {Boolean}
 */
function isAddPage() {
	const drawPage = document.querySelector('#drawPage')
	const formType = SharedUtils.getFormTypeFormSelect(drawPage)
	if (formType === 'add')
		return true
	return false
}

/**
 * 檢查當頁是否為列印頁面
 * =
 * @returns {Boolean} 
 */
function isPrintPage() {
	const drawPage = document.querySelector('#drawPage')
	const formType = SharedUtils.getFormTypeFormSelect(drawPage)
	if (formType === 'print') 
		return true
	return false
}

/**
 * 檢查當頁是否為清單頁面
 * =
 * @returns {Boolean} 
 */
function isListPage() {
	const drawPage = document.querySelector('#drawPage')
	const formType = SharedUtils.getFormTypeFormSelect(drawPage)
	if (formType === 'list')
		return true
	return false
}

/**
 * 完全移除元件
 * =
 * @param {String} beanName 
 */
function removeTargetBean(seq) {
	/** 引入工廠 */
	const factory = window.ComponentFactory
	factory.deleteRegisterComponent(seq)
}


/**
 * 設定 csCanvas 人形圖的設定資料
 * =
 */
function setCsCanvasOnlineData() {
	dataCsCanvasOnline = []
	// 查詢參數
	let gFormJS = nursing.createGForm()
	gFormJS.searchParamGF.status = 'Y'
	gFormJS.searchParamGF.formType = 'propCsCanvas'
	gFormJS.searchParamGF.itemCondition = ''

	// 取得資料
	gFormJS.getGFormListWithConditionPlus(gFormJS, function(result) {
		for (let i = 0, len = result.length; i < len; ++i) {
			let json = {}
			let form = result[i].gForm
			let map  = form.gformItemMap
			map.getValue = function(key) { return (this[key]) ? this[key].itemValue : ''}
			json.sourceId 	 = form.sourceId
			json.formType 	 = form.formType
			json.csName 	 = map.getValue('csName')
			json.typeA 		 = map.getValue('typeA')
			json.typeB 		 = map.getValue('typeB')
			json.templateDiv = (map.getValue('templateDiv')) ? JSON.parse(map.getValue('templateDiv')) : null
			json.areas 		 = (map.getValue('areas')) ? JSON.parse(map.getValue('areas')) : []
			json.imgSrc 	 = map.getValue('imgSrc')
			dataCsCanvasOnline.push(json)
		}
		console.log(dataCsCanvasOnline)
		dataCsCanvas = $.extend(true, [], dataCsCanvasOnline)
	}, function(e) {
		console.error(`setCsCanvasOnlineData() error: ${ e }`)
		CreateUtils.createModal(`alert`, {body: '取得人形圖設定資料發生錯誤'})
	})
}

/**
 * 設定表單樹內的表單雲資料
 * =
 * @param {Event} e
 */
function setFormCloudTree(e) {
	if (!onlineMode) {
		CreateUtils.createModal(`alert`, {body: '開啟線上模式才可讀取線上資料'})
		return
	}
	const tabContent = document.querySelector('#bean-tabContent')
	SharedUtils.partialLoading(tabContent)
	basicParam.getFormVersionAllList(dynamicForm, function(result) {
		if (result === null || result.formVersion.length === 0) {
			console.error('setFormCloudTree() error: no Data.')
			return
		}
        const formVersionList = result.formVersion
		for (let i = 0, len = formVersionList.length; i < len; ++i) {
			cloudGetFormVersion(formVersionList[i], len, i + 1)
		}
	}, function(error) {
		console.error(`setFormCloudTree() error: ${ error }`)
		SharedUtils.partialLoading(tabContent, true)
	})
}

/**
 * 取得動態表單元件清單
 * =
 * 將查詢到的 formversion 傳入\
 * 組件表單樹狀結構\
 * 若 len 與 count 數量一致為全部讀取完畢
 * 
 * @param {Object} formVersion  formversion物件
 * @param {number} len   總長度
 * @param {number} count 計數器
 */
function cloudGetFormVersion(formVersion, len, count) {
	const tabContent = document.querySelector('#bean-tabContent')
	dynamicForm.searchParamDF.formType = formVersion.formType
	dynamicForm.searchParamDF.versionNo = "999998"
	basicParam.getCurrDynamicFormTemplateV3(dynamicForm, function(result) {
		if (result === null) console.error(`cloudTreeFoldEvent.getCurrDynamicFormTemplateV3() error: result null`)
		if (result.length === 0) console.error(`cloudTreeFoldEvent.getCurrDynamicFormTemplateV3() error: result no Data.`)
		const cloudBeanList = []
		const template = result[0].basicParam.dynamicFormTemplate
		const items = template.hashItems
		let structure = {}
		for (let key in items) {
			const attribute = items[key]
			if (attribute.formToolAttribute) {
				const toolAttribute = SharedUtils.onionStringDecode(attribute.formToolAttribute)
				if (Object.keys(toolAttribute).length > 0) {
					for (let attribute in toolAttribute) {
						if (attribute === 'structure' && toolAttribute[attribute]) {
							const structureInside = SharedUtils.onionStringDecode(toolAttribute[attribute])
							structure = structureInside
							items[key][attribute] = structure
						} else items[key][attribute] = toolAttribute[attribute]
					}
				}
			}
			if (items[key].checked) items[key].checked 	= items[key].checked.join(',')
			if (items[key].uiDesc) 	items[key].uiDesc 	= items[key].uiDesc.join(',')
			if (items[key].uiValue) items[key].uiValue 	= items[key].uiValue.join(',')
			if (items[key].uiScore) items[key].uiScore 	= items[key].uiScore.join(',')
			const beanObject = {
				text: 		 items[key].title,
				type: 		 items[key].controlType,
				value: 		 key,
				default: 	 false,
				structure: 	 structure,
				information: items[key],
				draggable: 	 true,
				onclick: 	 ''
			}
			cloudBeanList.push(beanObject)
		}
		const treeNode = {
			text: 	formVersion.title,
			type: 	"form",
			value: 	formVersion.formType,
			nodes: 	cloudBeanList
		}
		beanTreeStructure[0].nodes.push(treeNode)
		if (count === len) {
			SharedUtils.partialLoading(tabContent, true)
			const beanTreeList = document.querySelector('#bean-tree-list')
			beanTreeList.innerHTML = ''
			$(beanTreeList).data('plugin_bstreeview', null)
			$(beanTreeList).bstreeview({data: beanTreeStructure})
			initButton()
		}
	}, function(error) {
		SharedUtils.partialLoading(tabContent, true)
		console.error(`cloudTreeFoldEvent.getCurrDynamicFormTemplateV3() error: ${ error }`)
	})
}

/**
 * 同步文件內 Function
 */
function doSyncFormVersion(bol) {
	const formVersion = versionArr.pop()
	let formFrame
	lastVersionRecord = formVersion.version - 0
	for (let i = 0; i < frameArr.length; ++i) {
		const model = frameArr[i].frameModel
		switch (model) {
			case 'gFormWebADD':
				formFrame = frameArr[i].content
				addFrame = formFrame
				break
			case 'gFormWebADD_INIT':
				addInit = frameArr[i].content
				break
			case 'gFormWebLIST':
				listFrame = frameArr[i].content
				break
			case 'gFormWebLIST_INIT':
				listInit = frameArr[i].content
				break
			case 'gFormWebPRINT':
				printFrame = frameArr[i].content
				break
			case 'gFormWebPRINT2':
				printFrame = frameArr[i].content
				break
			case 'gFormWebPRINT2_INIT':
				printInit = frameArr[i].content
				break
		}
		if (frameArr[i].version - 0 > lastVersionRecord) lastVersionRecord = frameArr[i].version - 0
	}
	const x2js = new X2JS();
	const jsonObj = x2js.xml_str2json(formVersion.content);
	SharedUtils.setupFromOnlineVersion(document.querySelector('#drawPage'), jsonObj.DynamicFormTemplate, formFrame, addInit)
}



/**
 * 開啟/關閉編輯欄寬功能列
 * @param {string} tableName [表格名稱]
 */
function toggleCustomizeCol(tableName){
	// 顯示功能列
	$('.trWordCountSetting').toggle();
	$(`.${ tableName }`).each(function(){
		customizeColWidth(this)
	})

}


/**
 * 變更欄寬
 * @param {element} table	[table element]
 */
function customizeColWidth(table) {
	let totalWidth = 2000;
	let fontSize = getFontSize(table);

	let hasWordsCount = false
	let i = 0;
	// 判斷是否已經有設定data-word-count
	$(table).find('.trWordCountSetting td').each(function () {
		i++
		if ($(this).attr('data-word-count') !== '') {
			// 有設定則設為true
			hasWordsCount = true
			return
		}
		// 因僅能留空1格，若兩個欄位都沒設定即可返回
		if (i === 2) return false;
	})

	// 沒有設定過data-word-count則進行初始化
	if(!hasWordsCount) initialWordCount();

	let  tTD; //用来存储当前更改宽度的Table Cell,避免快速移动鼠标的问题
	let isMouseDown = false;
	$(table).each(function(){
		$(this).find(".CustomizeColWidth").each(function(index) {
			let currWidth = 0
			this.onmousedown = function() {
				isMouseDown = true
				currWidth = $(this).find('.fillWordsCol').width()
				//记录单元格
				tTD = this;
				// 假設拖動到的是自動的欄位，則應用的欄位改為下一格
				if ($(this).attr('data-word-count') === '' ){
					if($(this).next().length === 0) return
					tTD = $(this).next()[0]

				}
				if (event.offsetX > tTD.offsetWidth - 10) {
					tTD.mouseDown = true;
					tTD.oldX = event.x;
					tTD.oldWidth = tTD.offsetWidth;
				}
				//记录Table宽度
				tTD.tableWidth = table.offsetWidth;

				// 拖動時暫時移除當前欄位與自動欄位填字，使欄位寬度可以移動
				$(tTD).children('.fillWordsCol').text('')
				$(tTD).siblings().each(function() {
					if ($(this).attr('data-word-count') === '') {
						$(this).find('.fillWordsCol').text('');
					}

				})
			};
			this.onmouseup = function() {
				isMouseDown = false
				//结束宽度调整
				if (tTD == undefined) tTD = this;
				tTD.mouseDown = false;
				tTD.style.cursor = 'default';
				checkColumnWidth($(tTD))
			};
			this.onmousemove = function() {
				//更改鼠标样式
				if (event.offsetX > this.offsetWidth - 10)
					this.style.cursor = 'col-resize';
				else
					this.style.cursor = 'default';
				//取出暂存的Table Cell
				if (tTD == undefined) tTD = this;
				//调整宽度
				if (tTD.mouseDown != null && tTD.mouseDown == true) {
					var tbWidth = $(table).width();
					tTD.style.cursor = 'default';
					if (tTD.oldWidth + (event.x - tTD.oldX) > 0 && tTD.oldWidth + (event.x - tTD.oldX) + tbWidth < totalWidth)
						tTD.width = tTD.oldWidth + (event.x - tTD.oldX);

					// 调整列宽
					// 貼齊字數大小
					var widthSnap = tTD.width % fontSize
					var tTDPadding = parseInt(window.getComputedStyle(tTD).paddingLeft);
					var tTDBorder = parseInt($(tTD).css('border-left-width'));
					tTD.width = tTD.width - widthSnap + tTDPadding * 2 + tTDBorder * 2;
					tTD.style.cursor = 'col-resize';
					currWidth = tTD.width;
				}
			};
			// 雙擊觸發 將自動欄位變更到點擊欄位
			this.ondblclick = function(){
				// 將現在的欄位標註為舊欄位
				$(tTD).attr('data-word-count', 'oldCol')
				// 找到原本為自動的欄位，將其標註為新的欄位
				$(tTD).siblings().each(function(){
					if($(this).attr('data-word-count') === ''){
						$(this).children('.fillWordsCol').text('')
						$(this).attr('data-word-count', 'newCol')
						checkColumnWidth(($(this)))
						$(this).trigger('mousedown').trigger('mouseup')
					}
				})
			}
		});
	})

	// 避免滑鼠在欄位外無法觸發mouseup
	window.addEventListener('mouseup', function(e){
		if(isMouseDown){
			e.preventDefault();
			isMouseDown = false;
			// 在正確欄位觸發mouseup事件
			$(tTD).mouseup()
		}
	})

	/**
	 * 獲取字體大小
	 */
	function getFontSize(table){
		let $table = $(table)
		let $measureCol = $table.find('.trWordCountSetting td:first-child .fillWordsCol')
		$measureCol.css('display', 'inline')
		// 將測量用欄位填入10個王
		$measureCol.text('王王王王王王王王王王')
		// 字體大小為欄寬/10
		let fontSize = $measureCol.width() / 10
		$measureCol.text('').removeAttr('style')
		return fontSize

	}

	/**
	 * 初始化字數
	 */
	function initialWordCount(){
		$('.resultTable').each(function(){
			let trLength = $(this).find('.trWordCountSetting td').length
			$(this).find('.trWordCountSetting td').each(function(index, td){
				let html = $(td).html()
				html = html.replace(/&nbsp;/g, '');
				$(td).html(html);
				$(this).children('.fillWordsCol').css('word-break', 'break-all')
				$(this).children('.fillWordsCol').text("王")
				let currHeight = $(this).height();
				if(index !== (trLength - 1)){
					// 依據每行可塞入的"王"判斷為多少word-count
					for (var i = 1; i < 999; i++) {
						$(td).find('.fillWordsCol').append('王')
						// 當超過原有欄寬時即為達到最高上限
						if ($(td).height() > currHeight) {
							let tdWidth = $(td).height()
							let text = $(td).children('.fillWordsCol').text()
							// 扣除超出目前欄寬的字元
							text = text.substr(0, text.length - 1);
							// 將字數放到data-word-count
							$(td).children('.fillWordsCol').text(text)
							$(td).attr('data-word-count', i)
							$(td).find('.displayCounts').text(i)
							$(td)[0].width = $(td).width()
							break
						}
					}
				}else{
					// 預設最後一欄為不設定word-count
					for (var i = 0; i < 999; i++) {
						if(i === 0) $(td).find('.fillWordsCol').text('|')
						// 填滿 "|"
						$(td).find('.fillWordsCol').append('|')
						// 當開始換行時即為達到最高上限
						if ($(td).height() > currHeight) {
							let text = $(td).children('.fillWordsCol').text()
							text = text.substr(0, text.length - 1);
							$(td).children('.fillWordsCol').text(text)
							// 扣除跑到第二欄的字元
							$(td).attr('data-word-count', '')
							$(td).find('.displayCounts').text('')
							break
						}
					}
				}
				$(this).children('.fillWordsCol').removeAttr('style')

			})
		})

	}

	/**
	 * 重新檢查欄寬
	 * @param {Element} that
	 */

	function checkColumnWidth(that) {
		if(that.attr('data-word-count') === '') return

		// 要更改自動欄位的情況
		if(that.attr('data-word-count') == 'newCol'){
			that.siblings().each(function(){
				// 找到舊的欄位，刪除原本設定
				if($(this).attr('data-word-count') == 'oldCol'){
					$(this).attr('data-word-count', '')
					$(this).removeAttr('width')
					$(this).children('div').text('')
				}
			})
		}

		that.find('.fillWordsCol').css('word-break', 'break-all')
		that.find('.fillWordsCol').text('王')
		let currHeight = that.height()
		// 先將"王"補回
		for (var i = 1; i < 100; i++) {
			that.find('.fillWordsCol').append('王')
			// 當開始換行(高度改變)時，即為超過原本欄寬
			if (that.height() > currHeight) {
				let text = that.children('.fillWordsCol').text()
				// 將跑到第二行的多於字元刪除
				text = text.substr(0, text.length - 1);
				that.children('.fillWordsCol').text(text)
				// word count = 總共填補幾個王
				that.attr('data-word-count', i)
				that.find('.displayCounts').text(i)
				that.find('.fillWordsCol').removeAttr('style')
				break
			}
		}

		// 再將剩餘欄位補上'|'
		that.siblings().each(function(){
			if($(this).attr('data-word-count') !== '') return

			$(this).find('.fillWordsCol').css('word-break', 'break-all');
			// $(this).width = that.width()
			$(this).children('.fillWordsCol').text('|')
			currHeight = $(this).height()
			for (let i = 1; i < 999; i++) {
				$(this).children('.fillWordsCol').append('|')
				// 當開始換行(高度改變)時，即為超過原本欄寬
				if ($(this).height() > currHeight) {
					let text = $(this).children('.fillWordsCol').text()
					text = text.substr(0, text.length - 1);
					// 將跑到第二行的多於字元刪除
					$(this).children('.fillWordsCol').text(text)
					$(this).find('.fillWordsCol').removeAttr('style')
					$(this).removeAttr('style')
					that[0].width = that.width()
					return false
				}
			}
		})
	}
}

/**
 * 檢查刪除欄位後表格長度
 */
function checkCustomizeColSetting(){
	let $table = $('.resultTable.active');
	// 最長tr度
	let maxLength = 0;
	$table.find('tbody tr').each(function(){
		// 當前tr長度
		let   trLength = 0;
		$(this).find('td').each(function(){
			if($(this).attr('class').indexOf('hide') !== -1) return true
			trLength++
			if($(this).attr('colspan') > 1){
				for(let i = 1; i < $(this).attr('colspan'); i++){
					trLength ++
				}
			}
		})
		if(trLength > maxLength) maxLength = trLength;
	})

	$settingRow = $table.find('.trWordCountSetting')
	// 如果編輯欄寬功能列長度大於最長tr長度，則進行多餘欄位刪減
	while($settingRow.children().length > maxLength){
		// 從最後一格開始刪，除非最後一格是自適應欄位
		var $deleteTd = $settingRow.find('td:last-child');
		if($deleteTd.attr("data-word-count") === ""){
			$deleteTd = $deleteTd.prev();
		}
		$deleteTd.remove();
	}
}

/**
 * 初始化新增的欄位
 */
function newCustomizeColInitial() {
	const table = document.getElementsByClassName('resultTable');
	// 紀錄編輯功能是否展開
	let isShow = $('.trWordCountSetting').is(":visible")
	// 為使測量是否換行正常, 顯示功能列
	$('.trWordCountSetting').show();

	customizeColWidth(table);
	$(table).each(function(){
		$(this).find('.trWordCountSetting .CustomizeColWidth').each(function(){
			if($(this).children('.fillWordsCol').text().trim() === ''){
				// 移除 &nbsp; (避免欄高不正確)
				let html = $(this).html()
				html = html.replace(/&nbsp;/g, '');
				$(this).html(html);
				// 填入預設值 data-word-count: 1
				let wordCount = $(this).attr('data-word-count')
				$(this).width(1);
				for (let i = 0; i < wordCount; ++i) {
					$(this).children('.fillWordsCol').append('王')
				}
				$(this).children('.displayCounts').text(wordCount);
				this.width = $(this).width();
			}
		})
		// 模擬點擊動作，使觸發checkColumnWidth 讓表格大小回復正常
		$(this).trigger('mousedown').trigger('mouseup')
	})
	// 若新增時未開啟功能列，則將功能列調回關閉狀態
	if(!isShow) $('.trWordCountSetting').hide()

}