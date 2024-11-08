/**
 * Query List 查詢清單
 * ==================
 * ------ 主要處理事務
 * > 頁面載入
 * > 左側 menu tree 建構
 * > 畫面動態效果
 * > 拖拉事件
 * > 腳本設計
 * > 按鈕設計
 * > 查詢設計
 */
(function() {
	beforeOnload()
	contextMenuListener()
	reloadSql()
    initButton()
    initDrawPageEvent()
}) ()

/**
 * CS-Form Query List 初始化
 * ==================
 * 重新整理顯示提示(防止未儲存進行重新整理)
 * 
 * 切換線上模式、切換 port、清除暫存數據
 * 
 * 獲取 queryList 專屬初始化 js
 * 
 */
function beforeOnload() {
	// 重新整理提示
	window.onbeforeunload = () => {
		const queryPage = document.querySelector('#queryPage')
		if (queryPage.innerHTML !== '') return false
		return null
	}
	const onlineBox 	= document.querySelector('#onlineMode')
	const cleanLocalBtn = document.querySelector('#cleanLocalBtn')
	const dynamicPort 	= document.querySelector('#dynamicPort')
	const queryPromise 	= SharedUtils.asyncGetFile('./template/queryINIT.html')
	document.addEventListener('keydown', pageKeydownEvent)
	onlineBox.addEventListener('change', onlineModeToggle)
	cleanLocalBtn.addEventListener('click', cleanLocalStorage)
	dynamicPort.addEventListener('change', debugPortChanged)
	dynamicPort.children[0].value = const_gformServiceUrl
	queryPromise.then((resultMsg) => queryInit = resultMsg)

	/** ================ 下方皆為函數 ================ */
	
	/**
	 * 切換線上模式開關
	 * ===
	 * 
	 * @param {Event} e 
	 */
	function onlineModeToggle(e) {
		const onlineModes = document.querySelectorAll('.onlineMode')
		if (e.target.checked) {
			onlineMode = true
			basicParam = nursing.createBasicParam()
        	dynamicForm = nursing.createDynamicForm()
			onlineModes.forEach(mode => mode.classList.remove('hide'))
		} else {
			onlineMode = false 
			onlineModes.forEach(mode => mode.classList.add('hide'))
		}
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
					let allpass = true
					let allForm = window.localStorage
					let regexTool = new RegExp(/^formTool+/)
					let regexUUID = new RegExp(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)
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
					return allpass
				}
			}
		})
	}

	/**
	 * port 切換
	 * @param {Event} e 
	 */
	function debugPortChanged(e) {
		const_gformServiceUrl = e.target.value
	}
}

/**
 * 頁面右鍵綁定事件
 * ==
 */
function contextMenuListener() {
	$.contextMenu({
		selector: 'td[data-role="drag-drop-container-data"]', 
		callback: function(key, options) {
			console.log(options)
			/** 引入工廠 */
			const factory 		= window.ComponentFactory
			/** 選擇區域 */
			const targetSite 	= options.$trigger
			switch (key) {
				case 'addButton':
					const component = factory.createQueryList(`__queryListButton`)
					targetSite.append(component.fullComponent)
					break
			}
			initButton()
		},
		items: {
			"addButton": {name: "添加按鈕", icon: "bi bi-plus"}
		}
	});
	$.contextMenu({
		selector: 'label.selected[data-is-bean="Y"]', 
		callback: function(key, options) {
			console.log(options)
			const targetSite = options.$trigger
			switch (key) {
				case 'addParam':
					$('.selected').each(function() {
						if (this === targetSite[0]) addParamModal(this)
						else $(this).removeClass('selected')
					})
					
					break
				case 'addConnectIcon':
					$('.selected').each(function(index) {
						if (index > 0) {
							$(this).before(CreateUtils.createBeanElement({
								'controlType': 'span',
								'attribute': 	[
									{
										"class": "connectIcon canEditDiv",
										"text": "-"
									}
								]
							}))
						}
					})
					break
			}
			initButton()
			initEditDiv()
		},
		items: {
			"addParam": {name: "加入參數轉換值", icon: "bi bi-shuffle"},
			"addConnectIcon": {name: "加入連接符號", icon: "bi bi-bezier"}
		}
	});
	$.contextMenu({
		selector: '[data-xml-bean="Y"]', 
		callback: function(key, options) {
			const targetSite = options.$trigger
			switch (key) {
				case 'addScript':
					addScriptModal(options)
					break
			}
			initButton()
		},
		items: {
			"addScript": {name: "添加腳本", icon: "bi bi-plus"}
		}
	});
}

/**
 * 初始化按鈕相關事件 
 * ==
 * 設定重新整理按鈕事件\
 * 設定新增條件按鈕事件\
 * 設定全部可拖曳元素綁定對應關係\
 * 設定查詢條件元件事件(左、右鍵)\
 * 設定表格內按鈕及元件事件(左、右鍵)
 * 
 */
function initButton() {
    const tableAddBtn = document.getElementById('table-tree-import-btn')
	const tableRleBtn = document.getElementById('table-tree-add-rule')
    const dragSources = document.querySelectorAll('[draggable="true"]')
    const searchBeans = document.querySelectorAll('[data-search-bean="true"]')
    const dataBeans   = document.querySelectorAll('[data-is-bean="Y"]')
	const beansButton = document.querySelectorAll('[data-edit="true"]')
    tableAddBtn.addEventListener('click', reloadSql)
	tableRleBtn.addEventListener('click', addRule)
    dragSources.forEach(source => source.addEventListener('dragstart', dragStart))
    dataBeans.forEach(bean => bean.addEventListener('click', beanSelected))
	beansButton.forEach(btn => btn.addEventListener('click', editBeanButton))
    searchBeans.forEach(bean => {
        bean.addEventListener('click', editBeanButton)
		bean.addEventListener('contextmenu', dataBeanDelete)
    })
}

/**
 * 頁面拖拉事件綁定
 * ==
 * 設定表格動態效果滑鼠事件\
 * 設定可拖曳放置範圍\
 * 包含查詢條件\
 * 包含表格
 */
function initDrawPageEvent() {
	const queryPage 			= document.querySelector('#queryPage')
	const dropSearchContainer 	= queryPage.querySelector('#dropSearchContainer, div[data-role="drag-drop-container-search"]')
	const searchBar 			= queryPage.querySelector('#search-bar')
	if (dropSearchContainer === null && searchBar !== null) 
		searchBar.prepend(CreateUtils.createBeanElement({
			"controlType": "div",
			"attribute": [
				{
					"class": 		"flex border not-export",
					"style": 		"min-width: 5rem;",
					"data-role": 	"drag-drop-container-search",
					"text": 		"drop here",
					"id": 			"dropSearchContainer"
				}
			]
		})[0])
    const tableData 			= queryPage.querySelectorAll('table tbody tr td')
    const dropData 	    		= queryPage.querySelectorAll('td[data-role="drag-drop-container-data"]')
	const searchData 			= queryPage.querySelector('#dropSearchContainer, div[data-role="drag-drop-container-search"]')
	queryPage.addEventListener('click', queryPageClick)
    tableData.forEach(tableSource => {
        tableSource.addEventListener('mouseenter', tableMouseEnter)
        tableSource.addEventListener('mousemove', tableMouseMove)
        tableSource.addEventListener('mouseleave', tableMouseLeave)
    })
	if (searchData !== null) {
		searchData.addEventListener('drop', searchDropped)
		searchData.addEventListener('dragenter', dropEnter)
		searchData.addEventListener('dragover', dropOver)
		searchData.addEventListener('dragleave', dropLeave)
	}
    dropData.forEach(data => {
		data.addEventListener('click', editTableData)
        data.addEventListener('drop', dataDropped)
        data.addEventListener('dragenter', dropEnter)
        data.addEventListener('dragover', dropOver)
        data.addEventListener('dragleave', dropLeave)
    })
    initEditDiv()
}

/**
 * 拖曳放置查詢條件區塊
 * =
 * 依照拖曳元素敘述\
 * 生成對應查詢元件並綁定元件編輯事件
 * @param {Event} e 
 */
function searchDropped(e) {
    this.classList.remove('drag-hover')
	/** 引入工廠 */
	const factory 		= window.ComponentFactory
	/** 拖曳編號 */
    const plain 		= e.dataTransfer.getData('text/plain')
	/** 特定編號字串 */
	const targetId 		= `#${ plain.replace(/\./g, '\\.') }`
	/** 編號對應元素 */
	const targetElement = document.querySelector(targetId)
	/** 對應元素編號 */
	const nodeId 		= targetElement.id
	/** 對應元素值 */
	const nodeValue 	= targetElement.getAttribute('value')
	/** 對應元素敘述 */
	const nodeDesc 		= targetElement.getAttribute('description')
	/** 標題元素 */
    const labelElement 	= CreateUtils.createBeanElement({'controlType': 'label', 'attribute': [{'class': 'canEditDiv', 'text': nodeDesc + '：'}]})[0]
	/** 查詢元件製作 */
	const component 	= factory.createQueryList(`__queryListSearch`, nodeValue, nodeDesc, nodeId)
	this.after(labelElement, component.fullComponent)
    initEditDiv()
    initButton()
}

/**
 * 拖曳放置表格區塊
 * =
 * 依照拖曳元素敘述\
 * 生成對應標題元件\
 * 查詢清單與xml模板生成差異元件\
 * 查詢清單生成一般標題元件\
 * xml模板生成可編輯腳本的標題元件
 * 
 * @param {Event} e 
 */
 function dataDropped(e) {
    this.classList.remove('drag-hover')
    const plain 		= e.dataTransfer.getData('text/plain')
	const targetId 		= `#${ plain.replace(/\./g, '\\.') }`
	const targetElement = document.querySelector(targetId)
	const parentTable 	= this.closest('.table')
	const nodeType 		= targetElement.id
	const nodeValue 	= targetElement.getAttribute('value')
	const nodeDesc 		= targetElement.getAttribute('description')
	const nodeParent 	= targetElement.dataset.nodeParent
    const position 		= this.parentNode.children.indexOf(this)
	const labelElement 	= CreateUtils.createBeanElement({
		'controlType': 'label',
		'attribute': 	[
			{
				'class': 			'h5',
				'data-is-bean': 	'Y',
				'data-template': 	`{{tableForm['${ nodeType }']}}`,
				'data-table': 		nodeParent,
				'text': 			nodeValue
			}
		]
	})[0]
	if (isTemplatePage()) {
		const parentId = targetElement.closest('.bstreeview').id
		labelElement.dataset.isBean 	= undefined
		labelElement.dataset.template 	= undefined
		labelElement.dataset.xmlBean 	= 'Y'
		labelElement.dataset.node 		= nodeType
		labelElement.textContent 		= nodeDesc
		if (parentId === 'selected-main-list') {
			labelElement.dataset.script = `getMap(mainFile, '${ nodeValue }')`
			labelElement.dataset.level = 'main'
		} else if (parentId === 'selected-sub-list') {
			labelElement.dataset.script = `getListValue(resultMap, '${ nodeParent }', '${ nodeValue }')`
			labelElement.dataset.level = 'sub'
		}
	}
    if (this.innerHTML.indexOf('&nbsp;') === 0) this.innerHTML = this.innerHTML.substring(6)
	this.appendChild(labelElement)
	// 欄位標題帶入
	if (isQueryPage() && parentTable.id === 'tableData') {
		const tableData = parentTable.querySelector('tr').childNodes[position]
		tableData.innerHTML = nodeDesc
	}
	if (isTemplatePage()) this.previousElementSibling.textContent = nodeValue
    initEditDiv()
    initButton()
}

/**
 * 拖曳滑入事件
 * =
 * 針對頁籤拖曳滑入切換頁籤
 * @param {Event} e 
 */
 function dropEnter(e) {
	SharedUtils.cancelDefault(e)
	if (e.target.tagName.toLowerCase() === 'a') this.click()
}

/**
 * 拖曳滑動效果事件
 * =
 * 滑入效果，強化使用者體驗
 * @param {Event} e 
 */
 function dropOver(e) {
	SharedUtils.cancelDefault(e)
	this.classList.add('drag-hover')
}

/**
 * 拖曳滑出事件
 * =
 * 移除滑入效果
 * @param {Event} e 
 */
 function dropLeave(e) {
	SharedUtils.cancelDefault(e)
	this.classList.remove('drag-hover')
}

/**
 * 表格滑入事件
 * =
 * 滑鼠滑入 td 內將顯示新增欄位按鈕\
 * 並綁定按鈕點擊事件\
 * 依照表單類型區分\
 * 查詢清單顯示左右新增表格按鈕\
 * xml模板顯示上下新增表格按鈕
 * @param {Event} e 
 */

function tableMouseEnter(e) {
	SharedUtils.cancelDefault(e)
	const buttons = e.target.querySelectorAll('button.icon')
	if (this.tagName.toLowerCase() !== 'td' && this.tagName.toLowerCase() !== 'th') return
	if (buttons.length === 4) return
	if (this.rowSpan > 1 || this.colSpan > 1) return
	const parentContainer 	= e.target.parentNode
	const queryPage 		= document.querySelector('#queryPage')
	const formDataContainer = queryPage.querySelector('div')
	const director 			= ['top', 'bottom', 'left', 'right']
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
	for (let i = 0; i < 4; ++i) {
		// 過濾掉清單頁第一格表格左方新增欄位及最後一格新增欄位，並過濾上下新增欄位
		if (this.tagName.toLowerCase() === 'th' && 
			(i < 2 || ((parentContainer.children.indexOf(e.target) === 0) && i < 3) || 
			((parentContainer.children.indexOf(e.target) === parentContainer.children.length - 1) && i === 3))) continue
		if ((isQueryPage() && i < 2) || (isTemplatePage() && i > 1)) continue
		if (i > 0) buttonElement.classList.remove([director[i - 1]])
		buttonElement.classList.add(director[i])
		if (e.target.offsetWidth <= 40) buttonElement.classList.add('icon-sm')
		e.target.appendChild(buttonElement.cloneNode(true))
	}
	const buttonIcon = document.querySelectorAll('button.icon.plus')
	buttonIcon.forEach(iconSource => {
		iconSource.addEventListener('mouseenter', SharedUtils.cancelDefault)
		iconSource.addEventListener('mousemove', SharedUtils.cancelDefault)
		iconSource.addEventListener('mouseleave', SharedUtils.cancelDefault)
		iconSource.addEventListener('click', addTd)
	})
}

/**
 * 表格內滑動事件
 * =
 * 依照滑鼠位置顯示對應新增欄位按鈕
 * @param {Event} e 
 */
 function tableMouseMove(e) {
	// SharedUtils.cancelDefault(e)
	if (this.tagName.toLowerCase() !== 'td' && this.tagName.toLowerCase() !== 'th') return
	const targetHight 		= this.offsetHeight
	const targetWidth 		= this.offsetWidth
	const offsetX 			= e.offsetX
	const offsetY 			= e.offsetY
	const iconButtons 		= this.querySelectorAll('button.icon')
	SharedUtils.clearHover()
	iconButtons.forEach(button => button.classList.add('hide'))
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
}

/**
 * 表格滑出事件
 * =
 * 移出滑鼠後新增欄位按鈕移除
 * @param {Event} e 
 */
 function tableMouseLeave(e) {
	SharedUtils.clearTableHoverButton()
	SharedUtils.clearHover()
	SharedUtils.cancelDefault(e)
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
	/** 新增欄位按鈕元素 */
	const button 			= this
	/** 按鈕最近的所在列 (tr) */
	const tr 				= button.closest('tr')
	/** 按鈕最近的所在表格 (table) */
	const table 			= button.closest('table')
	/** 表格所有的列 (trs) */
	const allTableRows 		= table.querySelectorAll('tr')
	/** 按鈕所在的表格欄位 (td / th) */
	const tableContainer 	= button.parentNode
	/** 表格位置 */
	const position 			= tr.children.indexOf(tableContainer)
	// 判斷點擊按鈕為上、下新增按鈕
	if (button.classList.contains('top') || button.classList.contains('bottom')) {
		// 依目前最多的欄位數量進行填充欄位，將判斷是否當格有被點擊及欄位合併是否需要隱藏
		/** 表格列容器 */
		const row = CreateUtils.createBeanElement({'controlType': 'tablerow', 'attribute': [{'class': 'text-center'}]})[0]
		/** 標題欄位 */
		const titleData = CreateUtils.createBeanElement({
			'controlType': 'tabledata',
			'attribute': 	[
				{
					'class': `canEditDiv`,
					'text': '標題'
				}
			]
		})[0]
		/** 資料欄位 */
		const tableData = CreateUtils.createBeanElement({
			'controlType': 'tabledata',
			'attribute': 	[
				{
					'class': ``,
					'data-role': 'drag-drop-container-data'
				}
			]
		})[0]
		row.append(titleData, tableData)
		if (button.classList.contains('top')) tr.before(row)
		else if (button.classList.contains('bottom')) tr.after(row)
	}
	// 判斷點擊按鈕為左、右新增按鈕
	if (button.classList.contains('left') || button.classList.contains('right')) {
		// 直接於每行進行新增欄位，依照左右在行內前後填充欄位
		allTableRows.forEach((tr, index) => {
			const tableData = CreateUtils.createBeanElement({
				'controlType': 'tabledata',
				'attribute': 	[
					{
						'class': `text-center ${ index === 0 ? 'canEditDiv' : '' }`,
						'data-role': index > 0 ? 'drag-drop-container-data' : '',
						'text': index === 0 ? '標題' : ''
					}
				]
			})[0]
			const td = tr.children[position]
			if (button.classList.contains('left')) td.before(tableData)
			else if (button.classList.contains('right')) td.after(tableData)
		})
	}
	initDrawPageEvent()
    initEditDiv()
}


/**
 * 拖曳開始事件
 * [紀錄拖曳物件值]
 * @param {Event} e 
 */
 function dragStart(e) {
	e.dataTransfer.setData('text/plain', this.id)
}

/**
 * 重新載入 SQL tree 清單
 * ==
 * 依照線上模式開啟給予不同樹狀結構\
 * 若開啟線上模式則呼叫 nis api 獲取全部庫數據\
 * 若未開啟線上模式則獲取本地預設庫數據
 */
function reloadSql() {
	const sqlTreeList = document.querySelector('#sql-tree-list')
	const formTreeList = document.querySelector('#form-tree-list')
	const $sqlTreeList = $(sqlTreeList)
	const $formTreeList = $(formTreeList)
	SharedUtils.loadingToggle()
	if (onlineMode) {
		const databaseObject = nursing.createDBQueryModule()
		databaseObject.getAllDataBase(
			function(result) {
				console.log(result)
				queryListLocalSession = result
				dataProcess(result)
				sqlTreeList.innerHTML 	= ''
				formTreeList.innerHTML 	= ''
				$sqlTreeList.data('plugin_bstreeview', null)
				$sqlTreeList.bstreeview({data: result.database})
				$formTreeList.data('plugin_bstreeview', null)
				$formTreeList.bstreeview({data: result.form})
				window.formList = result.form
				SharedUtils.loadingToggle(true)
				initButton()
			}, 
			function(error) {
				console.error(`reloadSql() error: ${ error }`)
				CreateUtils.createModal(`alert`, {body: '取得SQL清單出錯'})
				SharedUtils.loadingToggle(true)
			}
		)
	} else {
		const queryPromise 	= SharedUtils.asyncGetFile('./template/queryListLocal.json')
		queryPromise.then((resultMsg) => {
			const queryJson = JSON.parse(resultMsg)
			queryListLocalSession = queryJson
			dataProcess(queryJson)
			sqlTreeList.innerHTML 	= ''
			formTreeList.innerHTML 	= ''
			$sqlTreeList.data('plugin_bstreeview', null)
			$sqlTreeList.bstreeview({data: queryJson.database})
			$formTreeList.data('plugin_bstreeview', null)
			$formTreeList.bstreeview({data: queryJson.form})
			window.formList = queryJson.form
			SharedUtils.loadingToggle(true)
		})
	}

	/**
	 * 數據處理 綁定各節點事件
	 * ==
	 * @param {*} jsonObject 
	 */
	function dataProcess(jsonObject) {
		if (Array.isArray(jsonObject)) {
			for (let i = 0, len = jsonObject.length; i < len; ++i) {
				jsonObject[i].draggable = false
				switch (jsonObject[i].type) {
					case 'schema':
						break
					case 'table':
						jsonObject[i].oncontextmenu = "setMainTable(event)"
						break
					case 'column':
						break
					case 'form':
						jsonObject[i].oncontextmenu = "setMainTable(event)"
						break
				}
				if (jsonObject[i].nodes) dataProcess(jsonObject[i].nodes)
			}
		} else {
			for (let key in jsonObject) {
				dataProcess(jsonObject[key])
			}
		}
	}
}

/**
 * 添加條件事件
 * == 
 * 依照選取的結構
 * 
 * 取出對應標題名稱
 * 
 * 彈出視窗供使用者輸入查詢條件及排序條件
 * 
 * @param {*} e 
 */
function addRule(e) {
	const mainTable 	= window.mainTable || []
	const subTable 		= window.subTable || []
	const gatherTable 	= mainTable.concat(subTable)
	if (gatherTable.length === 0) {
		CreateUtils.createModal(`alert`, {body: '未選取任何的表，無法新增條件'})
		return
	}
	const addRuleModal = CreateUtils.createModal(`custom`, {
		'title':    `添加查詢條件`,
		'body':     qlSqlModalBody,
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
		'callback': allRuleCallBack
	})

	const formContainer = addRuleModal.querySelector('form')
	for (let tableRow of gatherTable) {
		const ruleRow 		= CreateUtils.createBeanElement({'controlType': 'qlSqlConditionRow'})[0]
		const labels 		= ruleRow.querySelectorAll('label')
		const whereInput 	= ruleRow.querySelector('#modalWhereStatement') 
		const orderInput 	= ruleRow.querySelector('#modalOrderStatement') 
		labels[0].textContent = `${ tableRow.value }查詢條件`
		labels[1].textContent = `${ tableRow.value }排序條件`
		whereInput.dataset.targetTable = tableRow.value
		orderInput.dataset.targetTable = tableRow.value
		if (qlSQLCondition[tableRow.value] !== undefined && qlSQLCondition[tableRow.value].where !== undefined) whereInput.value = qlSQLCondition[tableRow.value].where
		if (qlSQLCondition[tableRow.value] !== undefined && qlSQLCondition[tableRow.value].order !== undefined) orderInput.value = qlSQLCondition[tableRow.value].order
		formContainer.appendChild(ruleRow)
	}


	/** ================ 下方皆為函數 ================ */

	/**
	 * 新增主表次表條件回調
	 * =
	 * @param {*} index 
	 * @param {*} result 
	 * @param {*} modalElement 
	 * @returns 
	 */
	function allRuleCallBack(index, modalElement) {
		const modalForm = modalElement.querySelector('form')
		if (index === 1) {
			for (let element of modalForm.elements) {
				const elementValue 	= element.value
				const elementName 	= element.name
				const targetTable 	= element.dataset.targetTable
				if (qlSQLCondition[targetTable] === undefined) qlSQLCondition[targetTable] = { }
				switch (elementName) {
					case 'modalWhereStatement':
						qlSQLCondition[targetTable].where = elementValue
						break
					case 'modalOrderStatement':
						qlSQLCondition[targetTable].order = elementValue
						break
				}
			}
			return true
		}
	}
}

/**
 * 網頁按鍵點擊事件
 * =
 * 偵測點擊 delete 執行刪除動作
 * @param {Event} e 
 */
 function pageKeydownEvent(e) {
	if (e.keyCode === 46) {
		if (SharedUtils.isEditing()) return
		deleteSelectedBean(e)
	}
}

/**
 * 元件刪除事件
 * =
 * 依元件點選右鍵即刪除該元件
 * 
 * @param {*} e 
 */
function dataBeanDelete(e) {
	const targetBean = e.target
	if (e.target.tagName.toLowerCase() === 'input' || e.target.tagName.toLowerCase() === 'select') {
		const parentContainer = targetBean.parentNode
		if (parentContainer.classList.contains('selected')) editBeanButton(e)
		const labelElement = parentContainer.previousElementSibling
		if (labelElement !== null && labelElement.tagName.toLowerCase() === 'label') labelElement.remove()
		parentContainer.remove()
	} else targetBean.remove()
    SharedUtils.cancelDefault(e)
}

/**
 * 欄位元件移除
 * ==
 * 移除所選取的欄位元件
 * @param {*} e 
 */
function deleteSelectedBean(e) {
	const selectedElements = document.querySelectorAll('.selected')
	const activeTableData = document.querySelectorAll('td.active')
	selectedElements.forEach(element => {
		if (element.dataset.searchBean === "true" && 
			element.previousElementSibling !== null && 
			element.previousElementSibling.getAttribute('for') === element.id) 
			element.previousElementSibling.remove()
		element.remove()
	})
	activeTableData.forEach(element => {
		const position = element.parentNode.children.indexOf(element)
		if (isQueryPage()) element.closest('tbody').querySelector('tr').children[position].remove()
		element.remove()		
	})
	SharedUtils.clearSelectedElements()
}

/**
 * 欄位元件選取
 * ==
 * 用於移除用
 * @param {*} e 
 */
function beanSelected(e) {
	const selectedElements = document.querySelectorAll('.selected')
	const controlPress = e.ctrlKey
	selectedElements.forEach(element => {
		if (element === e.target) return
		else {
			if (!controlPress || element.dataset.isBean !== 'Y' || element.parentNode !== e.target.parentNode) 
				element.classList.remove('selected')
		}
	})
	if (e.target.classList.contains('selected')) e.target.classList.remove('selected')
	else e.target.classList.add('selected')
	
	SharedUtils.cancelDefault(e)
} 

/**
 * 編輯查詢元件
 * =
 * 該元件點擊觸發\
 * 依照 config.js 設定的屬性顯示對應元件屬性\
 * 將對應元件屬性設定至左側清單內
 * @param {Event} e 
 */
function editBeanButton(e) {
	
	/** 選取的元素 */
	const selectedElement 	= document.querySelector('.selected')
	let selectTargetElement = e.target
	if (selectTargetElement.dataset.type !== 'qlSearch' && 
		selectTargetElement.dataset.type !== 'qlButton' &&
		selectTargetElement.dataset.type !== 'search' && 
		selectTargetElement.dataset.type !== 'button') 
		selectTargetElement = selectTargetElement.closest('div[data-type="search"], div[data-type="qlSearch"]')
	if (selectedElement === selectTargetElement) {
		SharedUtils.clearSelectedElements()
		return
	}
	/** 左側清單 */
	const leftBottomBox = document.querySelector('.left-bottom-box')
	
	SharedUtils.clearSelectedElements()
	leftBottomBox.classList.add('active')
	selectTargetElement.classList.add('selected')
	selectTargetElement.blur()
	refreshMaterialList(selectTargetElement)
	SharedUtils.cancelDefault(e)
}

function refreshMaterialList(selectTargetElement) {
	/** 引入工廠 */
	const factory 			= window.ComponentFactory
	/** 屬性區域 */
	const materialList 		= document.querySelector('#materialList')
	/** 取得元件序號 */
	const uid 				= selectTargetElement.dataset.uid
	/** 取得元件 */
	const selectedComponent = factory.getQueryListRegisterComponent(uid)
	materialList.innerHTML 	= ''
	/** 製成元件屬性模組並渲染 */
	for (let moduleName in selectedComponent.attributesModules) {
		const moduleElement = selectedComponent.attributesModules[moduleName]
		materialList.appendChild(moduleElement)
	}
	initEditDiv()
}

/**
 * 表格編輯選取
 * ==
 * @param {*} e 
 */
function editTableData(e) {
	SharedUtils.clearSelectedElements()
	const selectTargetElement 	= e.target
	const activeData 			= document.querySelector('td.active')
	if (activeData === selectTargetElement) {
		SharedUtils.clearTableActiveData()
		return
	} else SharedUtils.clearTableActiveData()
	e.target.classList.add('active')
	SharedUtils.cancelDefault(e)
}

/**
 * 結構設定對照關係
 * =
 * 結構樹點擊綁定對照關係\
 * 依照數量運算補上對應屬性
 * @param {*} e 
 */
function setColor(e) {
	if (e.type === 'click') {
		for (let i = 1; i < 6; ++i) {
			const joinColorSelector = document.querySelectorAll(`.join-color-${ i }`)
			if (joinColorSelector.length === 0) {
				e.target.classList.add(`join-color-${ i }`)
				break
			} else if (joinColorSelector.length === 1) {
				if (e.target !== joinColorSelector[0]) {
					e.target.classList.add(`join-color-${ i }`)
				} else e.target.classList.remove(`join-color-${ i }`)
				break
			}
		}
	} else if (e.type === 'contextmenu') {
		for (let i = 5; i > 0; --i) {
			if (e.target.classList.contains(`join-color-${ i }`)) {
				e.target.classList.remove(`join-color-${ i }`)
				break
			}
		}
	}
	SharedUtils.cancelDefault(e)
}

/**
 * 設定主表、次表
 * =
 * 結構點選右鍵觸發\
 * 依照主表次表順序進行屬性添加\
 * 若主表存在皆為次表\
 * 並將選取的結構轉至步驟二進行拖拉事件
 * @param {*} e 
 */
function setMainTable(e) {
	const targetId 		= e.target.dataset.target
	const targetElement = document.querySelector(targetId)
	const stepTwoTab 	= document.querySelector('#step-tab-2')
	if (e.target.classList.contains('select-table-color')) {
		e.target.classList.remove('select-table-color', 'select-main-table')
		targetElement.childNodes.forEach(node => {
			for (let i = 1; i < 6; ++i) {
				node.classList.remove(`join-color-${ i }`)
			}
			node.classList.remove('select-table-color')
		})
	} else {
		const hadMainTable = document.querySelector('.select-main-table')
		if (hadMainTable) {
			e.target.classList.add('select-table-color')
			for (let child of targetElement.children) {
				child.classList.add('select-table-color')
			}
		} else {
			e.target.classList.add('select-main-table', 'select-table-color')
			for (let child of targetElement.children) {
				child.classList.add('select-table-color')
			}
		}
	}
	const selectedRows = document.querySelectorAll(`#sql-tree-list div.select-table-color[aria-level="2"], #form-tree-list div.select-table-color[aria-level="1"]`)
	if (selectedRows.length > 0) stepTwoTab.classList.remove('disabled')
	else stepTwoTab.classList.add('disabled')
	const selectMain 		= []
	const selectSub 		= []
	const selectedMainList 	= document.querySelector('#selected-main-list')
	const selectedSubList 	= document.querySelector('#selected-sub-list')
	const $selectedMainList = $(selectedMainList)
	const $selectedSubList 	= $(selectedSubList)
	selectedRows.forEach(row => {
		const isSqlTree 		= row.closest('#sql-tree-list')
		const isFormTree 		= row.closest('#form-tree-list')
		if (isSqlTree) {
			const position 		= Math.floor(row.parentNode.children.indexOf(row) / 2)
			const nodeParent 	= row.dataset.nodeParent
			if (row.classList.contains('select-main-table'))
				selectMain.push(findSessionData(position, nodeParent, 'database'))
			else 
				selectSub.push(findSessionData(position, nodeParent, 'database'))
		}
		if (isFormTree) {
			const position 		= Math.floor(row.parentNode.children.indexOf(row) / 2)
			const nodeParent 	= row.dataset.nodeParent || row.getAttribute('value')
			if (row.classList.contains('select-main-table'))
				selectMain.push(findSessionData(position, nodeParent, 'form'))
			else 
				selectSub.push(findSessionData(position, nodeParent, 'form'))
		}
	})
	selectedMainList.innerHTML 			= ''
	selectedSubList.innerHTML 			= ''
	selectedMainList.dataset.treeData 	= JSON.stringify(selectMain)
	selectedSubList.dataset.treeData 	= JSON.stringify(selectSub)
	$selectedMainList.data('plugin_bstreeview', null)
	$selectedSubList.data('plugin_bstreeview', null)
	$selectedMainList.bstreeview({data: selectMain})
	$selectedSubList.bstreeview({data: selectSub})
	window.mainTable = selectMain
	window.subTable = selectSub
	initButton()
	SharedUtils.cancelDefault(e)

	/** ================ 下方皆為函數 ================ */
	
	/**
	 * 查詢暫存資料
	 * =
	 * 比對暫存的表單及資料庫的樹狀結構
	 * 並將對應結構依照查詢規則回傳
	 * @param {Number} index 所在位置 
	 * @param {String} node  節點名稱
	 * @param {String} type  表單/資料表
	 * @returns 
	 */
	function findSessionData(index, node, type) {
		const tempQueryTree = $.extend(true, {}, queryListLocalSession)
		for (let key in tempQueryTree) {
			for (let i = 0, len = tempQueryTree[key].length; i < len; ++i) {
				if (tempQueryTree[key][i].value === node) {
					if (type === 'database') {
						for (let j = 0, len2 = tempQueryTree[key][i].nodes[index].nodes.length; j < len2; ++j) {
							tempQueryTree[key][i].nodes[index].nodes[j].draggable = true
							tempQueryTree[key][i].nodes[index].nodes[j].onclick = 'setColor(event)'
							tempQueryTree[key][i].nodes[index].nodes[j].oncontextmenu = 'setColor(event)'
							tempQueryTree[key][i].nodes[index].schema = node
						}
						return tempQueryTree[key][i].nodes[index]
					} else if (type === 'form') {
						for (let j = 0, len2 = tempQueryTree[key][i].nodes.length; j < len2; ++j) {
							tempQueryTree[key][i].nodes[j].draggable = true
							tempQueryTree[key][i].nodes[j].onclick = 'setColor(event)'
							tempQueryTree[key][i].nodes[j].oncontextmenu = 'setColor(event)'
						}
						return tempQueryTree[key][i]
					}
				}
			}
		}
	}
}

/**
 * 編輯框雙擊事件
 * =
 * [allSources 	=> 綁定元素可修改雙擊事件]
 */
 function initEditDiv() {
	let allSources 	= document.querySelectorAll('.canEditDiv')
	allSources.forEach(dataSource => {
		dataSource.addEventListener('dblclick', editTrigger)
	})
}

/**
 * 啟用編輯
 * =
 * [插入編輯元件並進行畫面集中效果]\
 * (可調整，目前問題：區間太小顯示的有限，須想更好的方法處理此問題)
 * 
 * @param  {Event} e [事件]
 */
 function editTrigger(e) {
	if (!e.target.classList.contains("canEditDiv")) return
    tableMouseLeave(e)
	const targetValue 	= this.innerHTML
	const input 		= CreateUtils.createBeanElement({'controlType': 'editBox'})[0]
	const inputChildren = input.querySelectorAll('input')
	const successButton = input.querySelector('.btn.btn-success')
	this.innerHTML = ''
	this.appendChild(input)
	inputChildren.forEach(inputElement => {
		inputElement.value = targetValue
		inputElement.dataset.defaultValue = targetValue
		inputElement.focus()
		inputElement.select()
		inputElement.addEventListener('mouseenter', SharedUtils.cancelDefault)
		inputElement.addEventListener('mousemove', SharedUtils.cancelDefault)
		inputElement.addEventListener('mouseleave', SharedUtils.cancelDefault)
		inputElement.addEventListener('click', SharedUtils.cancelDefault)
		inputElement.addEventListener('keypress', (e) => {
			if (e.which === 13) {
				successButton.click()
			}
		})
	})
	SharedUtils.maskToggle()
}

/**
 * 編輯輸入框完成事件
 * =
 * @param  {Event} 	 e    [事件]
 * @param  {Element} that [元素]
 * @param  {Boolean} bol  [取消或確定]
 */
 function editEnd(e, bol) {
	/** 引入元件工廠 */
	const factory 			= window.ComponentFactory
	/** 選取的元件 */
	const selectedElement 	= document.querySelector('.selected')
	/** 整個輸入框容器 */
	const block 			= e.target.closest('.focus-edit')
	/** 容器內的輸入框 */
	const input 			= block.querySelector('input')
	/** 外層框(進行編輯的元素) */
	const attributeBlock 	= block.parentNode
	/** 元素的屬性(若有) */
	const attribute 		= attributeBlock.dataset.attribute
	if (bol) {
        if (attribute !== undefined) {
			/** 元件編號 */
			const uid 		= selectedElement.dataset.uid
			const component = factory.getQueryListRegisterComponent(uid)
			if (component) {
				component.dataset[attribute] 	= input.value
				attributeBlock.innerHTML 		= input.value
				component.modifyAttribute()
				refreshMaterialList(selectedElement)
			}
		}
		if (input.value === '' && attributeBlock.tagName.toLowerCase() === 'span') attributeBlock.remove()
        else attributeBlock.innerHTML = input.value
	} else attributeBlock.innerHTML = input.dataset.defaultValue
	
	SharedUtils.clearHover()
	SharedUtils.maskToggle()
	SharedUtils.cancelDefault(e)
}

/**
 * 畫布選取
 */
function queryPageClick(e) {
	SharedUtils.clearTableActiveData()
	SharedUtils.clearTableActiveHead()
	SharedUtils.clearSelectedElements()
}

/**
 * 依據元件屬性生成元件
 * =
 * 主要生成類型\
 * 下拉框、多選、單選框、輸入框、日期框\
 * 
 * 依序進行對應結構建置
 * 
 * @param {Element} element 
 * @param {Object} optionObject 
 */
function generateOptionsBean(element, optionObject) {
	let beanObject = { }
	if (optionObject.desc === undefined || optionObject.value === undefined) {
		switch (optionObject.type) {
			case 'select':
				beanObject = {
					'controlType': 'select',
					'attribute': 	[
						{
							'class': 'form-control',
							'name': element.dataset.nodeValue || '',
							'children': [
								{
									'option': {
										'value': '0',
										'text': '請選擇'
									},
									'option': {
										'value': 'all-options-selected',
										'text': '全部'
									}
								}
							]
						}
					]
				}
				break
			case 'checkbox':
			case 'radio':
				let chkId = SharedUtils._uuid()
				beanObject = {
					'controlType': optionObject.type,
					'attribute': 	[
						{
							'class': 'form-check form-check-inline',
							'childrenAtt': [
								{
									'id': 		chkId,
									'name': 	element.dataset.nodeValue || element.name,
									'value': 	'0',
								},
								{
									'for': 		chkId,
									'text': 	'選項'
								}
							]
						}
					]
				}
				break
		}
		element.innerHTML = ''
		element.appendChild(CreateUtils.createBeanElement(beanObject)[0])
	} else {
		const descArray 	= optionObject.desc.split(',')
		const valueArray 	= optionObject.value.split(',')
		let len 			= (descArray.length >= valueArray.length) ? descArray.length : valueArray.length
		element.innerHTML 	= ''
		const allOptionElement = CreateUtils.createBeanElement({
			'controlType': 'option',
			'attribute': 	[
				{
					'text': 	'全部',
					'value': 	'all-options-selected'
				}
			]
		})[0]
		const selectElement = CreateUtils.createBeanElement({
			'controlType': 'select',
			'attribute': 	[
				{
					'class': 	'form-control',
					'name': 	element.dataset.nodeValue || ''
				}
			]
		})[0]
		selectElement.appendChild(allOptionElement)
		for (let i = 0; i < len; ++i) {
			switch (optionObject.type) {
				case 'select':
					selectElement.appendChild(CreateUtils.createBeanElement({
						'controlType': 'option',
						'attribute': 	[
							{
								'text': 	descArray[i] || '選項',
								'value': 	valueArray[i] || '0'
							}
						]
					})[0])
					break
				case 'checkbox':
				case 'radio':
					const chkId = SharedUtils._uuid()
					element.appendChild(CreateUtils.createBeanElement({
						'controlType': optionObject.type,
						'attribute': 	[
							{
								'class': 'form-check form-check-inline',
								'childrenAtt': [
									{
										'id': 		chkId,
										'name': 	element.dataset.nodeValue || element.name,
										'value': 	valueArray[i] || '0',
									},
									{
										'for': 		chkId,
										'text': 	descArray[i] || '選項'
									}
								]
							}
						]
					})[0])
					break
			}
		}
		if (optionObject.type === 'select') element.appendChild(selectElement)
	}
}

/**
 * 添加參數對照值
 * =
 * @param {*} beanElement 
 */
function addParamModal(beanElement) {
	const editData = beanElement.dataset.paramComparison
	const paramSwitchModal = CreateUtils.createModal(`custom`, {
		'title':    `添加參數轉換值`,
		'body':     qlAddParamComparison,
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
		'callback': paramSwitchCallBack
	})

	const addParamRowBtn 	= paramSwitchModal.querySelector('#addParamRow')
	const paramRowList 		= paramSwitchModal.querySelector('#paramRowList')
	addParamRowBtn.addEventListener('click', addParamRowEvent)

	if (editData) {
		const paramArray = SharedUtils.onionStringDecode(editData)
		const clickTimes = Math.ceil(paramArray.length / 2)
		for (let i = 0; i < clickTimes; ++i) {
			addParamRowBtn.click()
			const lastChild 	= paramRowList.lastElementChild
			const inParamInput 	= lastChild.querySelector('input[name="modalInParam"]')
			const outParamInput = lastChild.querySelector('input[name="modalOutParam"]')
			inParamInput.value 	= paramArray[i * 2]
			outParamInput.value = paramArray[i * 2 + 1]
		}
	}

	/** ================ 下方皆為函數 ================ */

	/**
	 * 新增參數對照組按鈕回調
	 * =
	 * @param {*} index 
	 * @param {*} result 
	 * @param {*} modalElement 
	 * @returns 
	 */
	function paramSwitchCallBack(index, modalElement) {
		const modalForm = modalElement.querySelector('form')
		if (index === 1) { 
			const finalArray = []
			for (let element of modalForm.elements) {
				if (element.tagName.toLowerCase() === 'button') continue
				const elementValue 	= element.value
				let isValid			= true
				if (elementValue === '') isValid = false
				else finalArray.push(elementValue)
				if (!isValid) {
					element.classList.add('is-invalid')
					return false
				}
			}
			beanElement.dataset.paramComparison = JSON.stringify(finalArray)
			return true
		}
	}

	/**
	 * 新增對照組列
	 * @param {Event} e 
	 */
	function addParamRowEvent(e) {
		const scriptRow = CreateUtils.createBeanElement({'controlType': 'qlAddParamRow'})[0]
		$(paramRowList).append(scriptRow)
	}
}

/**
 * 添加腳本事件
 * =
 * @param {*} options 
 */
function addScriptModal(options) {
	let ruleList, optionsLevel, editData, scriptInputElement, scriptObject = {}, $trigger
	CreateUtils.createModal(`custom`, {
		'size': 	`modal-xl`,
		'title':    `新增腳本`,
		'body':     xmlTemplateAddScriptBody,
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
		'callback': function(index, modalElement) {
			const modalForm = modalElement.querySelector('form')
			if (index === 1) {
				for (let element of modalForm.elements) {
					const elementValue 	= element.value
					const elementName 	= element.name
					switch (elementName) {
						case 'modalScript':
							$trigger.data('script', elementValue)
							$trigger.text(elementValue)
							break
					}
				}
				return true
			}
		}
	})
	if (options) {
		$trigger = options.$trigger
		const script = $trigger.data('script')
		scriptInputElement = document.querySelector('.modal #modalScript')
		const addScriptBtn = document.querySelector('.modal #addScriptBtn')
		ruleList = document.querySelector('.modal #ruleList')
		optionsLevel = $trigger.data('level')
		addScriptBtn.addEventListener('click', addRuleLine)
		scriptInputElement.value = script
		const testFunction = new functionDisassemble()
		editData = testFunction[script.substring(0, script.indexOf('('))](script.substring(script.indexOf('(') + 1, script.length - 1))
	}

	function addRuleLine(e) {
		const addScriptBtn = e.target
		e.target.disabled = true
		const scriptRow = CreateUtils.createBeanElement({'controlType': 'qlAddScriptRow'})[0]
		let level = $(ruleList).children().length
		for (let i = 0; i < level; ++i) {
			const allElements = document.querySelectorAll(`.modal #modalCustomRow-${ i }`)
			if (allElements.length > 0) continue
			else {
				level = i
				break
			}
		}
		$(scriptRow).find('#modalSelectType').find('option').each(function() {
			let levelArray = $(this).data('level').split(',')
			if (levelArray.indexOf(optionsLevel) === -1) $(this).remove() 
		})
		$(scriptRow).find('#modalSelectType').attr('id', `modalSelectType-${ level }`).attr('name', `modalSelectType-${ level }`)
		$(scriptRow).find('#modalCustomRow').attr('id', `modalCustomRow-${ level }`)
		$(ruleList).append(scriptRow)

		// addEvent
		const customRow = document.querySelector(`.modal #modalCustomRow-${ level }`)
		const selectType = document.querySelector(`.modal #modalSelectType-${ level }`)
		const deleteBtn = document.querySelectorAll('.modal .btn.btn-danger')
		deleteBtn.forEach(btn => {
			btn.addEventListener('click', deleteRow)
		})
		selectType.addEventListener('change', typeChanged)

		function deleteRow(e) {
			addScriptBtn.disabled = false
			$(e.target).parents('.col-12.row.form-group').remove()
		}

		function typeChanged(e) {
			let treeData = $('#selected-main-list').data('treeData')
			let level = e.target.getAttribute("name").split('-')[1]
			if (optionsLevel === 'sub') treeData = $('#selected-sub-list').data('treeData')
			try {
				treeData = JSON.parse(treeData)
			} catch (e) {}
			let node
			let resultRow = []
			let options = []
			let firstOption = CreateUtils.createBeanElement({
				'controlType': 'option',
				'attribute': 	[
					{
						'text': 	'請選擇',
						'value': 	'0'
					}
				]
			}, false)
			let switchButton = CreateUtils.createBeanElement({
				'controlType': 'button', 
				'attribute': [
					{
						'class': 	 'btn btn-secondary',
						'name': 	 `modalBeanInputSelectSwitch`,
						'onclick': 	 'SharedUtils.switchSelectAndInput(event)',
						'text': 	 '',
						'children':  [
							{
								'i': {
									'class': 'bi bi-arrow-left-right'
								}
							}
						]
					}
				]
			}, false)
			const divNode = {
				'controlType': 'div',
				'attribute': [
					{
						'class': 'input-group col-md-9',
						'children': []
					}
				]
			}
			resultRow = resultRow.concat(CreateUtils.createBeanElement({
				'controlType': 'div',
				'attribute': [
					{
						'class': 'col-md-2 text-left',
						'children': [
							{
								'label': {
									'class': 'h6 align-middle no-margin text-break',
									'text': e.target.value
								}
							}
						]
					}
				]
			}, false))
			resultRow = resultRow.concat(CreateUtils.createBeanElement({
				'controlType': 'div',
				'attribute': [
					{
						'class': 'col-md-1 text-center',
						'children': [
							{
								'label': {
									'class': 'h6 align-middle no-margin',
									'text': `${ optionsLevel === 'main' ? 'mainFile' : 'resultMap' }`
								}
							}
						]
					}
				]
			}, false))
			switch (e.target.value) {
				case 'getMainListValue':
				case 'getListValueToJsonString':
				case 'getMapCount':
				case 'getMap':
					node = $.extend(true, {}, divNode)
					options = []
					options = options.concat(firstOption)
					for (let i = 0, len = treeData[0].nodes.length; i < len; ++i) {
						const optionObject = {
							'controlType': 'option',
							'attribute': 	[
								{
									'text': 	treeData[0].nodes[i].description || treeData[0].nodes[i].text,
									'value': 	treeData[0].nodes[i].value
								}
							]
						}
						let optionBox = CreateUtils.createBeanElement(optionObject, false)
						options = options.concat(optionBox)
					}
					node.attribute[0].children.push(CreateUtils.createBeanElement({
						'controlType': 'select', 
						'attribute': [
							{
								'class': 	 'form-control toggle-switch',
								'id': 		 `modalSelect-${ level }`,
								'name': 	 `modalSelect-${ level }`,
								'data-position': '1',
								'children':  options
							}
						]
					}, false))
					node.attribute[0].children.push(CreateUtils.createBeanElement({
						'controlType': 'text', 
						'attribute': [
							{
								'class': 	 'form-control toggle-switch hide',
								'id': 		 `modalInput-${ level }`,
								'name': 	 `modalInput-${ level }`,
								'data-position': '1'
							}
						]
					}, false))
					node.attribute[0].children.push(switchButton)
					resultRow = resultRow.concat(CreateUtils.createBeanElement(node, false))
					scriptObject = {}
					scriptObject[e.target.value === 'getMainListValue' ? 'getListValue' : e.target.value] = [optionsLevel === 'main' ? 'mainFile' : 'resultMap', '']
					break
				case 'getMainListToTm':
					node = $.extend(true, {}, divNode)
					node.attribute[0].class = 'input-group col-md-5'
					options = []
					options = options.concat(firstOption)
					for (let i = 0, len = treeData[0].nodes.length; i < len; ++i) {
						const optionObject = {
							'controlType': 'option',
							'attribute': 	[
								{
									'text': 	treeData[0].nodes[i].description || treeData[0].nodes[i].text,
									'value': 	treeData[0].nodes[i].value
								}
							]
						}
						let optionBox = CreateUtils.createBeanElement(optionObject, false)
						options = options.concat(optionBox)
					}
					node.attribute[0].children.push(CreateUtils.createBeanElement({
						'controlType': 'select', 
						'attribute': [
							{
								'class': 	 'form-control toggle-switch',
								'id': 		 `modalSelect-${ level }`,
								'name': 	 `modalSelect-${ level }`,
								'data-position': '1',
								'children':  options
							}
						]
					}, false))
					node.attribute[0].children.push(CreateUtils.createBeanElement({
						'controlType': 'text', 
						'attribute': [
							{
								'class': 	 'form-control toggle-switch hide',
								'id': 		 `modalInput-${ level }`,
								'name': 	 `modalInput-${ level }`,
								'data-position': '1'
							}
						]
					}, false))
					node.attribute[0].children.push(switchButton)
					resultRow = resultRow.concat(CreateUtils.createBeanElement(node, false))
					node = $.extend(true, {}, divNode)
					node.attribute[0].class = 'input-group col-md-4'
					node.attribute[0].children.push(CreateUtils.createBeanElement({
						'controlType': 'text',
						'attribute': [
							{
								'class': 'form-control',
								'name': `modalInputFormat-${ level }`,
								'id': `modalInputFormat-${ level }`,
								'data-position': '2',
								'placeholder': 'yyyy-MM-dd HH:mm:ss',
								'value': 'yyyy-MM-dd'
							}
						]
					}, false))
					resultRow = resultRow.concat(CreateUtils.createBeanElement(node, false))
					scriptObject = {
						getListToTm: [optionsLevel === 'main' ? 'mainFile' : 'resultMap', '', '"yyyy-MM-dd"']
					}
					break
				case 'getSubListValue':
				case 'getStrEmpVal':
					node = $.extend(true, {}, divNode)
					node.attribute[0].class = 'input-group col-md-5'
					options = []
					options = options.concat(firstOption)
					for (let i = 0, len = treeData.length; i < len; ++i) {
						const optionObject = {
							'controlType': 'option',
							'attribute': 	[
								{
									'text': 	treeData[i].description || treeData[i].text,
									'value': 	treeData[i].value,
									'data-next-value': JSON.stringify(treeData[i].nodes)
								}
							]
						}
						let optionBox = CreateUtils.createBeanElement(optionObject, false)
						options = options.concat(optionBox)
					}
					node.attribute[0].children.push(CreateUtils.createBeanElement({
						'controlType': 'select', 
						'attribute': [
							{
								'class': 	 'form-control toggle-switch',
								'id': 		 `modalSelectTable-${ level }`,
								'name': 	 `modalSelectTable-${ level }`,
								'onchange':  'selectLevelChanged(this)',
								'data-position': '1',
								'data-target': `modalSelectColumn-${ level }`,
								'children':  options
							}
						]
					}, false))
					node.attribute[0].children.push(CreateUtils.createBeanElement({
						'controlType': 'text', 
						'attribute': [
							{
								'class': 	 'form-control toggle-switch hide',
								'id': 		 `modalInputTable-${ level }`,
								'data-position': '1',
								'name': 	 `modalInputTable-${ level }`
							}
						]
					}, false))
					node.attribute[0].children.push(switchButton)
					resultRow = resultRow.concat(CreateUtils.createBeanElement(node, false))
					node = $.extend(true, {}, divNode)
					node.attribute[0].class = 'input-group col-md-4'
					options = []
					options = options.concat(firstOption)
					node.attribute[0].children.push(CreateUtils.createBeanElement({
						'controlType': 'select', 
						'attribute': [
							{
								'class': 	 'form-control toggle-switch',
								'id': 		 `modalSelectColumn-${ level }`,
								'name': 	 `modalSelectColumn-${ level }`,
								'data-position': '2',
								'children':  options
							}
						]
					}, false))
					node.attribute[0].children.push(CreateUtils.createBeanElement({
						'controlType': 'text', 
						'attribute': [
							{
								'class': 	 'form-control toggle-switch hide',
								'id': 		 `modalInputColumn-${ level }`,
								'name': 	 `modalInputColumn-${ level }`,
								'data-position': '2'
							}
						]
					}, false))
					node.attribute[0].children.push(switchButton)
					resultRow = resultRow.concat(CreateUtils.createBeanElement(node, false))
					scriptObject = {}
					scriptObject[e.target.value === 'getSubListValue' ? 'getListValue' : e.target.value] = [optionsLevel === 'main' ? 'mainFile' : 'resultMap', '', '']
					break
				case 'getSubListToTm':
				case 'searchListHasVal':
				case 'searchListFirstHasVal':
					node = $.extend(true, {}, divNode)
					node.attribute[0].class = 'input-group col-md-3'
					options = []
					options = options.concat(firstOption)
					for (let i = 0, len = treeData.length; i < len; ++i) {
						const optionObject = {
							'controlType': 'option',
							'attribute': 	[
								{
									'text': 	treeData[i].description || treeData[i].text,
									'value': 	treeData[i].value,
									'data-next-value': JSON.stringify(treeData[i].nodes)
								}
							]
						}
						let optionBox = CreateUtils.createBeanElement(optionObject, false)
						options = options.concat(optionBox)
					}
					node.attribute[0].children.push(CreateUtils.createBeanElement({
						'controlType': 'select', 
						'attribute': [
							{
								'class': 	 'form-control toggle-switch',
								'id': 		 `modalSelectTable-${ level }`,
								'name': 	 `modalSelectTable-${ level }`,
								'onchange':  'selectLevelChanged(this)',
								'data-position': '1',
								'data-target': `modalSelectColumn-${ level }`,
								'children':  options
							}
						]
					}, false))
					node.attribute[0].children.push(CreateUtils.createBeanElement({
						'controlType': 'text', 
						'attribute': [
							{
								'class': 	 'form-control toggle-switch hide',
								'id': 		 `modalInputTable-${ level }`,
								'name': 	 `modalInputTable-${ level }`,
								'data-position': '1'
							}
						]
					}, false))
					node.attribute[0].children.push(switchButton)
					resultRow = resultRow.concat(CreateUtils.createBeanElement(node, false))
					node = $.extend(true, {}, divNode)
					node.attribute[0].class = 'input-group col-md-3'
					options = []
					options = options.concat(firstOption)
					node.attribute[0].children.push(CreateUtils.createBeanElement({
						'controlType': 'select', 
						'attribute': [
							{
								'class': 	 'form-control toggle-switch',
								'id': 		 `modalSelectColumn-${ level }`,
								'name': 	 `modalSelectColumn-${ level }`,
								'data-position': '2',
								'children':  options
							}
						]
					}, false))
					node.attribute[0].children.push(CreateUtils.createBeanElement({
						'controlType': 'text', 
						'attribute': [
							{
								'class': 	 'form-control toggle-switch hide',
								'id': 		 `modalInputColumn-${ level }`,
								'name': 	 `modalInputColumn-${ level }`,
								'data-position': '2'
							}
						]
					}, false))
					node.attribute[0].children.push(switchButton)
					resultRow = resultRow.concat(CreateUtils.createBeanElement(node, false))
					node = $.extend(true, {}, divNode)
					node.attribute[0].class = 'input-group col-md-3'
					node.attribute[0].children.push(CreateUtils.createBeanElement({
						'controlType': 'text',
						'attribute': [
							{
								'class': 'form-control',
								'name': `modalInputFormat-${ level }`,
								'id': `modalInputFormat-${ level }`,
								'data-position': '3',
								'placeholder': e.target.value === 'getSubListToTm' ? 'yyyy-MM-dd HH:mm:ss' : '',
								'value': e.target.value === 'getSubListToTm' ? 'yyyy-MM-dd' : ''
							}
						]
					}, false))
					resultRow = resultRow.concat(CreateUtils.createBeanElement(node, false))
					scriptObject = {}
					scriptObject[e.target.value === 'getSubListToTm' ? 'getListToTm' : e.target.value] = [optionsLevel === 'main' ? 'mainFile' : 'resultMap', '', '', e.target.value === 'getSubListToTm' ? '"yyyy-MM-dd"' : '']
					break
				case 'getCheckboxItemValue':
				case 'getCheckboxOtherItemValue':
					// 4
					resultRow[0].div.class = 'col-md-3 text-left'
					node = $.extend(true, {}, divNode)
					node.attribute[0].class = 'col-md-2 text-center'
					node.attribute[0].children.push(CreateUtils.createBeanElement({
						'controlType': 'button',
						'attribute': 	[
							{
								'class': 'btn btn-success btn-fold-table-select',
								'data-target': `modalTableFolder-${ level }`,
								'onclick': 'modalFolderSwitch(event)',
								'text': '展開'
							}
						]
					}, false))
					node.attribute[0].children.push(CreateUtils.createBeanElement({
						'controlType': 'button',
						'attribute': 	[
							{
								'class': 'btn btn-primary btn-fold-table-select hide',
								'style': 'margin-left: .5rem',
								'data-target': `modalTableFolder-${ level }`,
								'text': '新增'
							}
						]
					}, false))
					resultRow = resultRow.concat(CreateUtils.createBeanElement(node, false))
					node = $.extend(true, {}, divNode)
					node.attribute[0].class = 'input-group col-md-4'
					node.attribute[0].children.push(CreateUtils.createBeanElement({
						'controlType': 'text',
						'attribute': [
							{
								'class': 'form-control',
								'name': `modalInputFormat-${ level }`,
								'id': `modalInputFormat-${ level }`,
								'placeholder': '分隔號',
								'value': e.target.value === 'getCheckboxItemValue' ? ',' : '|'
							}
						]
					}, false))
					resultRow = resultRow.concat(CreateUtils.createBeanElement(node, false))
					node = $.extend(true, {}, divNode)
					node.attribute[0].class = 'col-md-2 text-center'
					node.attribute[0].children.push(CreateUtils.createBeanElement({
						'controlType': 'button',
						'attribute': 	[
							{
								'class': 'btn btn-success btn-fold-param-comparison',
								'data-target': `modalParamFolder-${ level }`,
								'onclick': 'modalFolderSwitch(event)',
								'text': '展開'
							}
						]
					}, false))
					node.attribute[0].children.push(CreateUtils.createBeanElement({
						'controlType': 'button',
						'attribute': 	[
							{
								'class': 'btn btn-primary btn-fold-param-select hide',
								'style': 'margin-left: .5rem',
								'data-target': `modalParamFolder-${ level }`,
								'text': '新增'
							}
						]
					}, false))
					resultRow = resultRow.concat(CreateUtils.createBeanElement(node, false))
					node = $.extend(true, {}, divNode)
					node.attribute[0].class = 'col-md-6 modal-folder hide'
					node.attribute[0].id = `modalTableFolder-${ level }`
					resultRow = resultRow.concat(CreateUtils.createBeanElement(node, false))
					node = $.extend(true, {}, divNode)
					node.attribute[0].class = 'col-md-6 modal-folder hide'
					node.attribute[0].id = `modalParamFolder-${ level }`
					resultRow = resultRow.concat(CreateUtils.createBeanElement(node, false))
					scriptObject = {}
					scriptObject[e.target.value] = [optionsLevel === 'main' ? 'mainFile' : 'resultMap', [], e.target.value === 'getCheckboxItemValue' ? '\\,' : '|', []]
					break
				default:
					$(customRow).html('')
					return
			}
			$(customRow).html('')
			$(customRow).append(resultRow.createElemental())
			scriptInputElement.value = `${ Object.keys(scriptObject)[0] }(${ scriptObject[Object.keys(scriptObject)[0]].join(',') })`
			const modalSelect = customRow.querySelector(`#modalSelect-${ level }`)
			const modalInput = customRow.querySelector(`#modalInput-${ level }`)
			const modalSelectTable = customRow.querySelector(`#modalSelectTable-${ level }`)
			const modalInputTable = customRow.querySelector(`#modalInputTable-${ level }`)
			const modalSelectColumn = customRow.querySelector(`#modalSelectColumn-${ level }`)
			const modalInputColumn = customRow.querySelector(`#modalInputColumn-${ level }`)
			const addBlockButton = customRow.querySelectorAll('.btn.btn-primary')
			if (modalSelect) modalSelect.addEventListener('change', scriptInputChanged)
			if (modalInput) modalInput.addEventListener('change', scriptInputChanged)
			if (modalSelectTable) modalSelectTable.addEventListener('change', scriptInputChanged)
			if (modalInputTable) modalInputTable.addEventListener('change', scriptInputChanged)
			if (modalSelectColumn) modalSelectColumn.addEventListener('change', scriptInputChanged)
			if (modalInputColumn) modalInputColumn.addEventListener('change', scriptInputChanged)
			if (addBlockButton.length > 0) {
				addBlockButton.forEach(btn => {
					btn.addEventListener('click', modalFolderAddBlock)
				})
			}
		}
	}

	function scriptInputChanged(e) {
		const values = e.target.value
		const position = e.target.dataset.position
		scriptObject[Object.keys(scriptObject)[0]][position] = JSON.stringify(values)
		scriptInputElement.value = `${ Object.keys(scriptObject)[0] }(${ scriptObject[Object.keys(scriptObject)[0]].join(',') })`
	}

	function modalFolderAddBlock(e) {
		const target = e.target.dataset.target
		const level = target.split('-')[1]
		const element = $(e.target).parents(`#modalCustomRow-${ level }`).find(`#${ target }`)
		let treeData = $('#selected-sub-list').data('treeData')
		let secondLevel = 0
		let type = e.target.classList.contains('btn-fold-table-select') ? 'table' : 'param'
		secondLevel = element.children().length
		for (let i = 0; i < secondLevel; ++i) {
			if ($(element).find(`#modalFolder-${ type }-${ level }-${ i }`).length > 0) continue
			else {
				secondLevel = i
				break
			}
		}
		try {
			treeData = JSON.parse(treeData)
		} catch (e) { }
		const divNode = {
			'controlType': 'div',
			'attribute': 	[
				{
					'class': 'input-group col-md-5',
					'children': []
				}
			]
		}
		const firstOption = CreateUtils.createBeanElement({
			'controlType': 'option',
			'attribute': 	[
				{
					'text': 	'請選擇',
					'value': 	'0'
				}
			]
		}, false)
		const switchButton = CreateUtils.createBeanElement({
			'controlType': 'button', 
			'attribute': [
				{
					'class': 	 'btn btn-secondary',
					'name': 	 `modalBeanInputSelectSwitch`,
					'onclick': 	 'SharedUtils.switchSelectAndInput(event)',
					'text': 	 '',
					'children':  [
						{
							'i': {
								'class': 'bi bi-arrow-left-right'
							}
						}
					]
				}
			]
		}, false)
		const deleteDiv = {
			'controlType': 'div',
			'attribute': 	[
				{
					'class': 'col-md-2 text-center',
					'children': [
						{
							'button': {
								'class': 'btn btn-danger',
								'type': 'button',
								'children': [
									{
										'i': {
											'class': 'bi bi-x'
										}
									}
								]
							}
						}
					]
				}
			]
		}
		let options = []
		let resultRow = []
		resultRow = resultRow.concat(CreateUtils.createBeanElement(deleteDiv, false))
		switch (type) {
			case 'table':
				node = $.extend(true, {}, divNode)
				options = []
				options = options.concat(firstOption)
				for (let i = 0, len = treeData.length; i < len; ++i) {
					const optionObject = {
						'controlType': 'option',
						'attribute': 	[
							{
								'text': 	treeData[i].description || treeData[i].text,
								'value': 	treeData[i].value,
								'data-next-value': JSON.stringify(treeData[i].nodes)
							}
						]
					}
					let optionBox = CreateUtils.createBeanElement(optionObject, false)
					options = options.concat(optionBox)
				}
				node.attribute[0].children.push(CreateUtils.createBeanElement({
					'controlType': 'select', 
					'attribute': [
						{
							'class': 	 'form-control toggle-switch',
							'id': 		 `modalSelectTable-${ level }-${ secondLevel }`,
							'name': 	 `modalSelectTable-${ level }-${ secondLevel }`,
							'onchange':  'selectLevelChanged(this)',
							'data-position': '1',
							'data-target': `modalSelectColumn-${ level }-${ secondLevel }`,
							'children':  options
						}
					]
				}, false))
				node.attribute[0].children.push(CreateUtils.createBeanElement({
					'controlType': 'text', 
					'attribute': [
						{
							'class': 	 'form-control toggle-switch hide',
							'id': 		 `modalInputTable-${ level }-${ secondLevel }`,
							'name': 	 `modalInputTable-${ level }-${ secondLevel }`,
							'data-position': '1',
						}
					]
				}, false))
				node.attribute[0].children.push(switchButton)
				resultRow = resultRow.concat(CreateUtils.createBeanElement(node, false))
				node = $.extend(true, {}, divNode)
				options = []
				options = options.concat(firstOption)
				node.attribute[0].children.push(CreateUtils.createBeanElement({
					'controlType': 'select', 
					'attribute': [
						{
							'class': 	 'form-control toggle-switch',
							'id': 		 `modalSelectColumn-${ level }-${ secondLevel }`,
							'name': 	 `modalSelectColumn-${ level }-${ secondLevel }`,
							'data-position': '1',
							'children':  options
						}
					]
				}, false))
				node.attribute[0].children.push(CreateUtils.createBeanElement({
					'controlType': 'text', 
					'attribute': [
						{
							'class': 	 'form-control toggle-switch hide',
							'id': 		 `modalInputColumn-${ level }-${ secondLevel }`,
							'name': 	 `modalInputColumn-${ level }-${ secondLevel }`,
							'data-position': '1',
						}
					]
				}, false))
				node.attribute[0].children.push(switchButton)
				resultRow = resultRow.concat(CreateUtils.createBeanElement(node, false))
				break
			case 'param':
				node = $.extend(true, {}, divNode)
				node.attribute[0].children.push(CreateUtils.createBeanElement({
					'controlType': 'text', 
					'attribute': [
						{
							'class': 	 'form-control',
							'id': 		 `modalInputParam-${ level }-${ secondLevel }`,
							'name': 	 `modalInputParam-${ level }-${ secondLevel }`,
							'data-position': '3',
							'placeholder': '原始值'
						}
					]
				}, false))
				resultRow = resultRow.concat(CreateUtils.createBeanElement(node, false))
				node = $.extend(true, {}, divNode)
				node.attribute[0].children.push(CreateUtils.createBeanElement({
					'controlType': 'text', 
					'attribute': [
						{
							'class': 	 'form-control',
							'id': 		 `modalInputValue-${ level }-${ secondLevel }`,
							'name': 	 `modalInputValue-${ level }-${ secondLevel }`,
							'data-position': '3',
							'placeholder': '改變值'
						}
					]
				}, false))
				resultRow = resultRow.concat(CreateUtils.createBeanElement(node, false))
				break
		}
		const finalDiv = CreateUtils.createBeanElement({
			'controlType': 'div',
			'attribute': 	[
				{
					'class': 'col-md-12 modal-folder row',
					'id': 	 `modalFolder-${ type }-${ level }-${ secondLevel }`,
					'children': resultRow
				}
			]
		}, false)
		element.append(finalDiv.createElemental())
	
		// addEvent
		const deleteBtn = element[0].querySelector(`#modalFolder-${ type }-${ level }-${ secondLevel } .btn.btn-danger`)
		const selectTable = element[0].querySelector(`#modalSelectTable-${ level }-${ secondLevel }`)
		const inputTable = element[0].querySelector(`#modalInputTable-${ level }-${ secondLevel }`)
		const selectColumn = element[0].querySelector(`#modalSelectColumn-${ level }-${ secondLevel }`)
		const inputColumn = element[0].querySelector(`#modalInputColumn-${ level }-${ secondLevel }`)
		const inputParam = element[0].querySelector(`#modalInputParam-${ level }-${ secondLevel }`)
		const inputValue = element[0].querySelector(`#modalInputValue-${ level }-${ secondLevel }`)
		if (selectTable) selectTable.addEventListener('change', scriptInputChildChanged)
		if (inputTable) inputTable.addEventListener('change', scriptInputChildChanged)
		if (selectColumn) selectColumn.addEventListener('change', scriptInputChildChanged)
		if (inputColumn) inputColumn.addEventListener('change', scriptInputChildChanged)
		if (inputParam) inputParam.addEventListener('change', scriptInputChildChanged)
		if (inputValue) inputValue.addEventListener('change', scriptInputChildChanged)
		deleteBtn.addEventListener('click', deleteRow)
	
		function deleteRow(e) {
			$(e.target).parents(`#modalFolder-${ type }-${ level }-${ secondLevel }`).remove()
		}
	}

	function scriptInputChildChanged(e) {
		const values = e.target.value
		const position = e.target.dataset.position
		let level = e.target.getAttribute('name').split('-')[1]
		let secondLevel = e.target.getAttribute('name').split('-')[2]
		let secondArray = [], forthArray = []
		for (let i = 0; i <= secondLevel; ++i) {
			const selectTable = document.querySelector(`.modal #modalSelectTable-${ level }-${ i }`)
			const inputTable = document.querySelector(`.modal #modalInputTable-${ level }-${ i }`)
			const selectColumn = document.querySelector(`.modal #modalSelectColumn-${ level }-${ i }`)
			const inputColumn = document.querySelector(`.modal #modalInputColumn-${ level }-${ i }`)
			const inputParam = document.querySelector(`.modal #modalInputParam-${ level }-${ i }`)
			const inputValue = document.querySelector(`.modal #modalInputValue-${ level }-${ i }`)
			let firstValue = '', lastValue = ''
			if (selectTable && selectTable.classList.contains('hide')) firstValue = inputTable.value
			else if (inputTable && inputTable.classList.contains('hide')) firstValue = selectTable.value
			if (selectColumn && selectColumn.classList.contains('hide')) lastValue = inputColumn.value
			else if (inputColumn && inputColumn.classList.contains('hide')) lastValue = selectColumn.value
			if (firstValue !== '' || lastValue !== '')
				secondArray.push([`mapKey:${ firstValue },key:${ lastValue }`])
			firstValue = ''
			lastValue = ''
			if (inputParam) firstValue = inputParam.value
			if (inputValue) lastValue = inputValue.value
			if (firstValue !== '' || lastValue !== '')
				forthArray.push(`${ firstValue }:${ lastValue }`)
		}
		scriptObject[Object.keys(scriptObject)[0]][1] = JSON.stringify(secondArray)
		scriptObject[Object.keys(scriptObject)[0]][3] = JSON.stringify(forthArray)
		scriptInputElement.value = `${ Object.keys(scriptObject)[0] }(${ scriptObject[Object.keys(scriptObject)[0]].join(',') })`
	}
}

/**
 * 按鈕腳本設定
 * =
 */
function inputRuleSetting() {
	const selectedElement 	= document.querySelector('.selected')
	const selectedComponent = ComponentFactory.getQueryListRegisterComponent(selectedElement.dataset.uid)
	const functions 		= selectedElement.dataset.functions
	const inputRuleModal = CreateUtils.createModal(`custom`, {
		'title':    `腳本設定`,
		'body':     qlButtonAddScriptBody,
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
		'callback': inputRuleCallBack
	})

	/** 選擇類型下拉框 */
	const scriptTypeSelect 	= inputRuleModal.querySelector('#modalScriptTypeSelect')
	/** 導頁規則下拉框 */
	const ruleSelect 		= inputRuleModal.querySelector('#modalGuideRuleSelect')
	/** 添加腳本按鈕 */
	const addRuleButton 	= inputRuleModal.querySelector('#modalAddRuleButton')
	/** 腳本清單區塊 */
	const ruleRowList 		= inputRuleModal.querySelector('#ruleRowList')
	/** 上層元件下拉框 */
	const groupComponentSelect = inputRuleModal.querySelector('#modalGroupComponentSelect')
	/** 選項群組 */
	const optionGroup 		= []
	/** 元件選項 */
	const componentSelect 	= [{
		option: {
			value: 0,
			text: '請選擇'
		}
	}]
	/** 主表陣列 */
	const mainTable 		= window.mainTable || []
	/** 次表陣列 */
	const subTable 			= window.subTable || []
	/** 表單清單 */
	let formList 			= window.formList || []

	scriptTypeSelect.addEventListener('change', typeChanged)
	ruleSelect.addEventListener('change', typeChanged)
	groupComponentSelect.addEventListener('change', typeChanged)
	addRuleButton.addEventListener('click', addRuleRowEvent)

	for (let key in ComponentFactory.queryListRegisterComponent) {
		if (!ComponentFactory.queryListRegisterComponent[key] instanceof ComponentFactory.queryListComponent.__queryListSearch) continue
		if (ComponentFactory.queryListRegisterComponent[key].dataset.nodeValue === selectedElement.dataset.nodeValue) continue
		const queryComponent = ComponentFactory.queryListRegisterComponent[key]
		componentSelect.push({
			option: {
				value: key,
				text: queryComponent.dataset.title || queryComponent.dataset.nodeValue
			}
		})
	}
	componentSelect.createElemental().forEach(element => groupComponentSelect.appendChild(element))

	// 設定主表與次表相關選擇至導頁規則
	if (mainTable) {
		const resultTable = mainTable.concat(subTable)
		for (let resultObject of resultTable) {
			const nodes 	= resultObject.nodes
			const optgroup 	= document.createElement('optgroup') 
			optgroup.label 	= `${ resultObject.text }${ resultObject.description ? '(' + resultObject.description + ')' : '' }`
			for (let node of nodes) {
				const option 		= document.createElement('option')
				option.value 		= `${ resultObject.value }.${ node.value }`
				option.innerText 	= `${ node.text }${ node.description ? '(' + node.description + ')' : '' }`
				optgroup.appendChild(option)
			}
			optionGroup.push(optgroup)
			ruleSelect.appendChild(optgroup)
		}
	}

	// 編輯資料帶入
	if (functions) {
		const editData 			= SharedUtils.onionStringDecode(functions)
		scriptTypeSelect.value 	= editData.scriptType
		if ('createEvent' in document) {
			var evt = document.createEvent('HTMLEvents')
			evt.initEvent('change', false, true)
			scriptTypeSelect.dispatchEvent(evt)
		}
		if (editData.scriptType === 'guide') {
			ruleSelect.value 		= editData.guideRule
			if ('createEvent' in document) {
				var evt = document.createEvent('HTMLEvents')
				evt.initEvent('change', false, true)
				ruleSelect.dispatchEvent(evt)
			}
			if (!editData.ruleList) return
			for (let ruleData of editData.ruleList) {
				addRuleButton.click()
				const element = ruleRowList.lastElementChild
				if (ruleData.ruleParam) element.querySelector('#modalRuleParamInput').value = ruleData.ruleParam
				if (ruleData.guideTarget) element.querySelector('#modalGuideTargetSelect').value = ruleData.guideTarget
				if (ruleData.guideType) element.querySelector('#modalGuideTypeSelect').value = ruleData.guideType
				if (ruleData.url) element.querySelector('#modalURLInput').value = ruleData.url
				if (ruleData.urlParam) {
					for (let j = 0, len2 = ruleData.urlParam.length; j < len2; ++j) {
						if (j % 2 === 0) element.querySelector('#modalURLAddParamButton').click()
						const urlParamRow = element.querySelector('#URLParamRowList').children[Math.floor(j / 2)]
						if (j % 2 === 0)
							urlParamRow.querySelector('#modalURLParamInput').value = ruleData.urlParam[j]
						else {
							const paramSelect = urlParamRow.querySelector('#modalURLParamSelect')
							if (paramSelect.querySelector(`option[value="${ ruleData.urlParam[j] }"]`) !== null)
								paramSelect.value = ruleData.urlParam[j]
							else {
								urlParamRow.querySelector('#modalSwitchButton').click()
								urlParamRow.querySelector('#modalURLParamValue').value = ruleData.urlParam[j]
							}
						}
					}
				}
				if (ruleData.formName) {
					element.querySelector('#modalFormSelect').value = ruleData.formName
					if (element.querySelector('#modalFormSelect').value === '') {
						const option = document.createElement('option')
						option.value = ruleData.formName
						option.innerText = ruleData.formName
						element.querySelector('#modalFormSelect').append(option)
						element.querySelector('#modalFormSelect').value = ruleData.formName
					}
				}
					
				if (ruleData.formType) element.querySelector('#modalFormTypeSelect').value = ruleData.formType
				if (ruleData.source) {
					element.querySelector('#modalFormSourceSelect').value = ruleData.source
					element.querySelector('#modalFormSourceValue').value = ruleData.source
					if (element.querySelector('#modalFormSourceSelect').value === '') element.querySelector('#modalSwitchButton').click()
				}
				if (ruleData.formId) element.querySelector('#modalFormIdSelect').value = ruleData.formId
				if ('createEvent' in document) {
					var evt = document.createEvent('HTMLEvents')
					evt.initEvent('change', false, true)
					element.querySelector('#modalGuideTypeSelect').dispatchEvent(evt)
				}
			}
		} else if (editData.scriptType === 'group') {
			groupComponentSelect.value = editData.groupComponent
			if ('createEvent' in document) {
				var evt = document.createEvent('HTMLEvents')
				evt.initEvent('change', false, true)
				groupComponentSelect.dispatchEvent(evt)
			}
			const groupRowList = inputRuleModal.querySelector('#groupRowList')
			for (let i = 0, len = Object.keys(editData.groupObject).length; i < len; ++i) {
				const key = Object.keys(editData.groupObject)[i]
				const value = editData.groupObject[key]
				const valueArray = value.split(',')
				valueArray.forEach(value => {
					groupRowList.children[i].querySelector(`input[value="${ value }"]`).checked = true
				})
			}
		}
	}

	/** ================ 下方皆為函數 ================ */

	/**
	 * 腳本設定按鈕回調
	 * @param {*} index 
	 * @param {*} result 
	 * @param {*} modalElement 
	 * @returns 
	 */
	function inputRuleCallBack(index, modalElement) {
		const modalForm = modalElement.querySelector('form')
		if (index === 1) {
			const resultObject = {}
			for (let element of modalForm.elements) {
				if (element.tagName.toLowerCase() === 'button') continue
				const elementValue 	= element.value
				const elementName 	= element.name
				let isValid 		= true
				switch (elementName) {
					case 'modalScriptTypeSelect':
						if (elementValue === '0') isValid = false
						else resultObject.scriptType = elementValue
						break
					case 'modalGuideRuleSelect':
						if (!element.closest('.guide').classList.contains('hide')) {
							if (elementValue === '0') isValid = false
							else resultObject.guideRule = elementValue
						}
						break
					case 'modalRuleParamInput':
						if (!resultObject.ruleList) resultObject.ruleList = []
						// 如果導頁規則有條件則需要檢核是否有輸入參數
						if (resultObject.guideRule !== 'none') {
							if (elementValue === '') isValid = false
							else {
								resultObject.ruleList.push({})
								resultObject.ruleList[resultObject.ruleList.length - 1].ruleParam = elementValue
							}
						} else resultObject.ruleList.push({})
						break
					case 'modalGuideTargetSelect':
						resultObject.ruleList[resultObject.ruleList.length - 1].guideTarget = elementValue
						break
					case 'modalGuideTypeSelect':
						if (elementValue === '0') isValid = false
						else resultObject.ruleList[resultObject.ruleList.length - 1].guideType = elementValue
						break
					case 'modalURLInput':
						// 若導頁選擇 url 則需檢核
						if (resultObject.ruleList[resultObject.ruleList.length - 1].guideType === 'url' ||
							resultObject.ruleList[resultObject.ruleList.length - 1].guideType === 'system') {
							if (elementValue === '') isValid = false
							else resultObject.ruleList[resultObject.ruleList.length - 1].url = elementValue
						}
						break
					case 'modalURLParamInput':
						if (resultObject.ruleList[resultObject.ruleList.length - 1].guideType === 'url' ||
							resultObject.ruleList[resultObject.ruleList.length - 1].guideType === 'system') {
							if (!resultObject.ruleList[resultObject.ruleList.length - 1].urlParam) resultObject.ruleList[resultObject.ruleList.length - 1].urlParam = []
							if (elementValue === '') isValid = false
							else resultObject.ruleList[resultObject.ruleList.length - 1].urlParam.push(elementValue)
						}
						break
					case 'modalURLParamSelect':
						if (resultObject.ruleList[resultObject.ruleList.length - 1].guideType === 'url' ||
							resultObject.ruleList[resultObject.ruleList.length - 1].guideType === 'system') {
							if (!element.classList.contains('hide')) {
								if (elementValue === '0') isValid = false
								else resultObject.ruleList[resultObject.ruleList.length - 1].urlParam.push(elementValue)
							}
						}
						break
					case 'modalURLParamValue':
						if (resultObject.ruleList[resultObject.ruleList.length - 1].guideType === 'url' ||
							resultObject.ruleList[resultObject.ruleList.length - 1].guideType === 'system') {
							if (!element.classList.contains('hide')) {
								if (elementValue === '') isValid = false
								else resultObject.ruleList[resultObject.ruleList.length - 1].urlParam.push(elementValue)
							}
						}
						break
					case 'modalFormSelect':
						if (resultObject.ruleList[resultObject.ruleList.length - 1].guideType === 'form') {
							if (elementValue === '0') isValid = false
							else resultObject.ruleList[resultObject.ruleList.length - 1].formName = elementValue
						}
						break
					case 'modalFormTypeSelect':
						if (resultObject.ruleList[resultObject.ruleList.length - 1].guideType === 'form') {
							if (elementValue === '0') isValid = false
							else resultObject.ruleList[resultObject.ruleList.length - 1].formType = elementValue
						}
						break
					case 'modalFormSourceSelect':
					case 'modalFormSourceValue':
						if (resultObject.ruleList[resultObject.ruleList.length - 1].guideType === 'form') {
							if (!element.classList.contains('hide')) {
								if (elementValue === '0') isValid = false
								else resultObject.ruleList[resultObject.ruleList.length - 1].source = elementValue
							}
						}
						break
					case 'modalFormIdSelect':
						if (resultObject.ruleList[resultObject.ruleList.length - 1].guideType === 'form') {
							if (!element.closest('.form-id-select').classList.contains('hide')) {
								if (elementValue === '0') isValid = false
								else resultObject.ruleList[resultObject.ruleList.length - 1].formId = elementValue
							}
						}
						break
					case 'modalGroupComponentSelect':
						if (!element.closest('.group').classList.contains('hide')) {
							if (elementValue === '0') isValid = false
							else resultObject.groupComponent = elementValue
						}
						break
				}
				if (!isValid) {
					element.classList.add('is-invalid')
					return false
				}
			}
			console.log(resultObject)
			if (resultObject.scriptType === 'group') {
				const groupList = modalForm.querySelector('#groupRowList')
				const compareObject = {}
				for (let i = 0, len = groupList.children.length; i < len; ++i) {
					let groupText = ''
					const groupRow = groupList.children[i]
					const isCheckedBoxs = groupRow.querySelectorAll('input:checked')
					const parentComponent = ComponentFactory.getQueryListRegisterComponent(resultObject.groupComponent)
					isCheckedBoxs.forEach(checkbox => {
						if (groupText.length > 0) groupText += ','
						groupText += checkbox.value
					})
					compareObject[parentComponent.uiValue[i]] = groupText
				}
				resultObject.groupObject = compareObject
			}
			selectedElement.dataset.functions = JSON.stringify(resultObject)
			return true
		}
	}

	/**
	 * 下拉框變換事件
	 * =
	 * @param {Event} e 
	 */
	function typeChanged(e) {
		const setRows 		= inputRuleModal.querySelectorAll('.set-row')
		const setSecondRows = inputRuleModal.querySelectorAll('.set-row-second')
		const guideRows 	= inputRuleModal.querySelectorAll('.guide')
		const groupRows		= inputRuleModal.querySelectorAll('.group')
		const groupList 	= inputRuleModal.querySelector('#groupRowList')
		const formTypeGroup = ruleRowList.querySelectorAll('.form-type-group')
		const ruleRows 		= ruleRowList.querySelectorAll('.has-rule')
		switch (e.target.value) {
			case 'guide':
				setRows.forEach(row => row.classList.add('hide'))
				guideRows.forEach(row => row.classList.remove('hide'))
				groupRows.forEach(row => row.classList.add('hide'))
				if (groupList) groupList.classList.add('hide')
				ruleRowList.classList.remove('hide')
				break
			case 'group':
				setRows.forEach(row => row.classList.add('hide'))
				setSecondRows.forEach(row => row.classList.add('hide'))
				groupRows.forEach(row => row.classList.remove('hide'))
				if (groupList) groupList.classList.remove('hide')
				ruleRowList.classList.add('hide')
				break
			case 'url':
			case 'form':
			case 'system':
				const ruleRow 	= e.target.closest('div.ruleRow')
				const typeRow 	= ruleRow.querySelectorAll('.type-row')
				const selectRow = ruleRow.querySelectorAll(`.${ e.target.value }`)
				typeRow.forEach(row => row.classList.add('hide'))
				selectRow.forEach(row => row.classList.remove('hide'))
				break
			case 'none':
				ruleRowList.classList.remove('hide')
				setSecondRows.forEach(row => row.classList.remove('hide'))
				ruleRows.forEach(row => row.classList.add('hide'))
				break
			case 'add':
			case 'list':
				formTypeGroup.forEach(group => {
					group.classList.remove('col-sm-3')
					group.classList.add('col-sm-5')
				})
				ruleRowList.querySelectorAll('.upd, .print, .print2').forEach(item => {
					item.classList.add('hide')
				})
				break
			case '0':
				if (e.target.id === 'modalGuideRuleSelect' || e.target.id === 'modalScriptTypeSelect') {
					ruleRowList.classList.add('hide')
					setSecondRows.forEach(row => row.classList.add('hide'))
					groupRows.forEach(row => row.classList.add('hide'))
					if (groupList) groupList.classList.add('hide')
					if (e.target.closest('.set-row') === null) setRows.forEach(row => row.classList.add('hide'))
				} else if (e.target.id === 'modalGroupComponentSelect') {
					ruleRowList.classList.add('hide')
					setSecondRows.forEach(row => row.classList.add('hide'))
					groupRows.forEach(row => row.classList.add('hide'))
					if (groupList) groupList.classList.remove('hide')
				}
				break
			default:
				if (e.target.id === 'modalGuideRuleSelect') {
					ruleRowList.classList.remove('hide')
					setSecondRows.forEach(row => row.classList.remove('hide'))
					ruleRows.forEach(row => row.classList.remove('hide'))
				} else if (e.target.id === 'modalGroupComponentSelect') {
					groupList.innerHTML = ''
					let indexP = 0
					const parentComponent = ComponentFactory.getQueryListRegisterComponent(e.target.value)
					const descArray = parentComponent.uiDesc
					for (let desc of descArray) {
						const checkBoxs = []
						let index = 0
						for (let selectedDesc of selectedComponent.uiDesc) {
							const checkBoxElement = CreateUtils.createBeanElement({'controlType': 'checkbox'})[0]
							checkBoxElement.querySelector('input').name = selectedElement.dataset.nodeValue + '_' + parentComponent.uiValue[indexP]
							checkBoxElement.querySelector('input').id = selectedElement.dataset.nodeValue + '_' + parentComponent.uiValue[indexP] + '_' + index
							checkBoxElement.querySelector('input').value = selectedComponent.uiValue[index]
							checkBoxElement.querySelector('label').textContent = selectedDesc
							checkBoxElement.querySelector('label').for = selectedElement.dataset.nodeValue + '_' + parentComponent.uiValue[indexP] + '_' + index
							checkBoxs.push(checkBoxElement)
							index++
						}
						const rowLine = {
							div: {
								class: 'col-sm-12 row form-group group-row',
								children: [
									{
										label: {
											class: 'col-sm-3 col-form-label',
											text: `選項值：${ desc }`
										}
									},
									{
										div: {
											class: 'col-sm-7 row',
											children: checkBoxs.convertToJson()
										}
									}
								]
							}
						}
						groupList.appendChild(rowLine.createElemental()[0])
						indexP++
					}
				} else if (e.target.id === 'modalFormTypeSelect') {
					formTypeGroup.forEach(group => {
						group.classList.add('col-sm-3')
						group.classList.remove('col-sm-5')
					})
					ruleRowList.querySelectorAll(`.${ e.target.value }`).forEach(item => {
						item.classList.remove('hide')
					})
				}
				break
			
		}
	}

	/**
	 * 添加腳本列事件
	 * =
	 * @param {Event}} e 
	 */
	function addRuleRowEvent(e) {
		/** 腳本列元素 */
		const ruleRow 			= CreateUtils.createBeanElement({'controlType': 'qlButtonAddRow'})[0]
		ruleRowList.appendChild(ruleRow)
		/** 條件參數值輸入框 */
		const ruleParamInput 	= ruleRow.querySelector('#modalRuleParamInput')
		/** 導頁類型(表單, 網址) */
		const guideTypeSelect 	= ruleRow.querySelector('#modalGuideTypeSelect')
		/** 表單選擇 */
		const formSelect 		= ruleRow.querySelector('#modalFormSelect')
		/** 表單類型選擇 */
		const formTypeSelect 	= ruleRow.querySelector('#modalFormTypeSelect')
		/** 表單來源選擇 */
		const formSource 		= ruleRow.querySelector('#modalFormSourceSelect')
		/** 網址參數值切換按鈕 */
		const formSourceSwitch  = ruleRow.querySelector('#modalSwitchButton')
		/** 表單編號選擇 */
		const formIdSelect 		= ruleRow.querySelector('#modalFormIdSelect')
		/** 網址添加參數按鈕 */
		const addParamButton 	= ruleRow.querySelector('#modalURLAddParamButton')
		/** 網址參數列區塊 */
		const paramRowList 		= ruleRow.querySelector('#URLParamRowList')
		if (ruleSelect.value !== '0' && ruleSelect.value !== 'none') ruleParamInput.parentElement.classList.remove('hide')
		guideTypeSelect.addEventListener('change', typeChanged)
		addParamButton.addEventListener('click', addParamRowEvent)
		formTypeSelect.addEventListener('click', typeChanged)
		formSourceSwitch.addEventListener('click', SharedUtils.switchSelectAndInput)
		// 設定表單下拉選單
		if (formList) {
			for (let form of formList) {
				const option 		= document.createElement('option')
				option.value 		= form.value
				option.innerText 	= `${ form.text }(${ form.description })`
				formSelect.appendChild(option)
			}
		}
		for (let option of optionGroup) {
			formSource.appendChild(option.cloneNode(true))
			formIdSelect.appendChild(option.cloneNode(true))
		}

		/**
		 * 添加網址參數按鈕事件
		 * =
		 * @param {*} e 
		 */
		function addParamRowEvent(e) {
			/** 參數列元素 */
			const paramRow 			= CreateUtils.createBeanElement({'controlType': 'qlURLParamRow'})[0]
			paramRowList.appendChild(paramRow)
			/** 網址參數 */
			const urlParamSelect 	= paramRow.querySelector('#modalURLParamSelect')
			/** 網址參數值切換按鈕 */
			const switchButton 		= paramRow.querySelector('#modalSwitchButton')
			
			for (let option of optionGroup) {
				urlParamSelect.append(option.cloneNode(true))
			}
			switchButton.addEventListener('click', SharedUtils.switchSelectAndInput)
		}
	}
}

/**
 * 重置左側選取清單
 */
function resetSqlTreeEvent() {
	const step1 			= document.querySelector('#step-tab-1')
	const step2 			= document.querySelector('#step-tab-2')
	const selectMainList 	= document.querySelector('#selected-main-list')
	const selectSubList 	= document.querySelector('#selected-sub-list')
	const $selectMainList 	= $(selectMainList)
	const $selectSubList 	= $(selectSubList)
	step2.classList.add('disabled')
	selectMainList.innerHTML = ''
	selectSubList.innerHTML = ''
	$selectMainList.data('plugin_bstreeview', null)
	$selectSubList.data('plugin_bstreeview', null)
	step1.click()
	reloadSql()
}

/**
 * 下拉框變更影響次級下拉框事件
 * =
 * @param {*} that 
 */
function selectLevelChanged(that) {
	const target = $(that).data('target')
	let options = $(that).find(`option[value="${ that.value }"]`).data('nextValue')
	let level = target.split('-')[1]
	const $target = $(that).parents(`#modalCustomRow-${ level }`).find(`#${ target }`)
	try {
		options = JSON.parse(options)
	} catch (e) { }
	const firstOption = $target.children().first()
	let optionsBox = []
	for (let i = 0, len = options.length; i < len; ++i) {
		const optionObject = {
			'controlType': 'option',
			'attribute': 	[
				{
					'text': 	options[i].description || options[i].text,
					'value': 	options[i].value
				}
			]
		}
		let optionBox = CreateUtils.createBeanElement(optionObject)
		optionsBox = optionsBox.concat(optionBox)
	}
	$target.html('')
	$target.append(firstOption).append(optionsBox)
}

/**
 * 收合/展開切換器
 * =
 * @param {*} e 
 */
function modalFolderSwitch(e) {
	const target = e.target.dataset.target
	const level = target.split('-')[1]
	const element = $(e.target).parents(`#modalCustomRow-${ level }`).find(`#${ target }`)
	if (element.hasClass('hide') || element.hasClass('invisible')) {
		element.removeClass('hide').removeClass('invisible')
		e.target.textContent = '收起'
		$(e.target).next().removeClass('hide')
		if (element.prev().hasClass('modal-folder') && element.prev().hasClass('hide')) 
			element.prev().removeClass('hide').addClass('invisible')
	} else {
		element.addClass('hide')
		e.target.textContent = '展開'
		$(e.target).next().addClass('hide')
		if (element.next().hasClass('modal-folder') && !element.next().hasClass('hide')) 
			element.removeClass('hide').addClass('invisible')
		else if (element.prev().hasClass('modal-folder') && element.prev().hasClass('invisible'))
			element.prev().removeClass('invisible').addClass('hide')
	}
}

// 防止 bug 事件
function isAddPage() {
	return false
}
function queryListButtonEvent() {
	return false
}

function isQueryPage() {
	const queryPage = document.querySelector('#queryPage')
	const formType 	= SharedUtils.getFormTypeFormSelect(queryPage)
	if (formType === 'query') return true
	return false
}

function isTemplatePage() {
	const queryPage = document.querySelector('#queryPage')
	const formType 	= SharedUtils.getFormTypeFormSelect(queryPage)
	if (formType === 'xmlTemplate') return true
	return false
}

const functionDisassemble = function() {
	this.getListToTm = function () {
		return {getListToTm : arguments}
	}
	this.getListValue = function () {
		return {getListValue : arguments}
	}
	this.getListValueToJsonString = function () {
		return {getListValueToJsonString : arguments}
	}
	this.getStrEmpVal = function () {
		return {getStrEmpVal : arguments}
	}
	this.getMapCount = function () {
		return {getMapCount : arguments}
	}
	this.getMap = function () {
		return {getMap : arguments}
	}
	this.searchListHasVal = function () {
		return {searchListHasVal : arguments}
	}
	this.searchListFirstHasVal = function () {
		return {searchListFirstHasVal : arguments}
	}
	this.getCheckboxItemValue = function () {
		return {getCheckboxItemValue : arguments}
	}
	this.getCheckboxOtherItemValue = function () {
		return {getCheckboxOtherItemValue : arguments}
	}
}