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
	document.addEventListener('keydown', pageKeydownEvent)
}

/**
 * 頁面右鍵綁定事件
 * ==
 */
function contextMenuListener() {
	
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
    const addMainTableBtn = document.querySelector('#add-main-table-btn')
	const addSubTableBtn = document.querySelector('#add-sub-table-btn')
	const skipBtn = document.querySelector('#skip-btn')
	const addResultBtn = document.querySelector('#add-result-btn')
    // const tableAddBtn = document.getElementById('table-tree-import-btn')
	// const tableRleBtn = document.getElementById('table-tree-add-rule')
    const dragSources = document.querySelectorAll('[draggable="true"]')
    const searchBeans = document.querySelectorAll('[data-search-bean="true"]')
    const dataBeans   = document.querySelectorAll('[data-is-bean="Y"]')
	const beansButton = document.querySelectorAll('[data-edit="true"]')
    addMainTableBtn.addEventListener('click', addMainTable)
	addSubTableBtn.addEventListener('click', addSubTable)
	skipBtn.addEventListener('click', skipSubTable)
	addResultBtn.addEventListener('click', addResultTable)
    // tableAddBtn.addEventListener('click', reloadSql)
	// tableRleBtn.addEventListener('click', addRule)
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
	const dropContainer 		= queryPage.querySelectorAll('div[data-role="drag-drop-container"]')
    const tableData 			= queryPage.querySelectorAll('table tbody tr td')
	queryPage.addEventListener('click', queryPageClick)
    tableData.forEach(tableSource => {
        tableSource.addEventListener('mouseenter', tableMouseEnter)
        tableSource.addEventListener('mousemove', tableMouseMove)
        tableSource.addEventListener('mouseleave', tableMouseLeave)
    })
	dropContainer.forEach(container => {
		if (!container.querySelector('.drop-text'))
			removeDragListener(container) 
		else {
			container.addEventListener('drop', dropped)
			container.addEventListener('dragenter', dropEnter)
			container.addEventListener('dragover', dropOver)
			container.addEventListener('dragleave', dropLeave)
		}
		
	})
    initEditDiv()
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
 * 拖曳放置事件
 * =
 * @param {Event} e 
 */
function dropped(e) {
	SharedUtils.clearHover()
	const titleBlock = this.previousElementSibling
	const factory = window.ComponentFactory
	const type 	= this.dataset.type
	const plain	= e.dataTransfer.getData('text/plain')
	switch (type) {
		case 'main':
		case 'sub':
			const schema = plain.split('.')[0]
			const tableName = plain.split('.')[1]
			const tableObject = findSessionTable(queryListLocalSession, tableName)
			const joinButton = titleBlock.querySelector('.join-connect-table-button')
			if (tableObject.join) {
				tableObject.conTable = []
				tableObject.join.forEach(name => {
					tableObject.conTable.push(findSessionTable(queryListLocalSession, name))
				})
				joinButton.classList.remove('hide')
			}
			const queryData = factory.create(`__queryData`, tableObject.value, schema, tableObject, '')
			this.innerHTML = ''
			if (type === 'main') {
				const key = factory.create(`__key`, 1, tableObject)
				const mainFile = factory.create(`__mainFile`, 2, queryData, key, tableObject)
				mainFile.fullComponent.forEach(element => this.appendChild(element))
			} else if (type === 'sub') {
				const titleSpan = titleBlock.querySelector('.h5')
				titleSpan.textContent = `${ titleSpan.textContent } - ${ tableName }`
				if (factory.getProcessDetail()) factory.getProcessDetail().queryData.push(queryData)
				else factory.create(`__processDetail`, queryData)
				queryData.fullComponent.forEach(element => this.appendChild(element))
			}
			break
		case 'delete':
			const deleteSchema = plain.split('.')[0]
			const deleteName = plain.split('.')[1]
			const deleteObject = findSessionTable(queryListLocalSession, deleteName)
			const deleteData = factory.create(`__deleteData`, deleteName, deleteSchema, deleteObject)
			this.innerHTML = ''
			factory.setBeforeDelete(deleteData)
			deleteData.fullComponent.forEach(element => this.appendChild(element))
			break
		case 'result':
			const plainArray = plain.split('.')
			let tableFormName = plainArray[0]
			if (plainArray.length > 1) tableFormName = plainArray[1]
			const formObject = findSessionTable(queryListLocalSession, tableFormName)
			if (formObject.join) {
				formObject.conTable = []
				formObject.join.forEach(name => {
					formObject.conTable.push(findSessionTable(queryListLocalSession, name))
				})
			}
			const titleSpan = titleBlock.querySelector('.h5')
			const chooseResultCallBack = (index, modalElement) => {
				const modalForm = modalElement.querySelector('form')
				if (index === 1) { 
					let chooseType
					for (let element of modalForm.elements) {
						const elementValue 	= element.value
						let isValid			= true
						if (elementValue === '') isValid = false
						else chooseType = elementValue
						if (!isValid) {
							element.classList.add('is-invalid')
							return false
						}
					}
					titleSpan.textContent = `${ titleSpan.textContent } - ${ tableFormName } - ${ getName(chooseType) }`
					const component = factory.create(`__${ chooseType }`, `${ tableFormName } as ${ chooseType }`)
					this.innerHTML = ''
					component.fullComponent.forEach(element => this.appendChild(element))
					if (chooseType !== 'deleteData') {
						const resultTable = factory.create(`__resultTable`, `${ tableFormName } as ${ chooseType }`, '', formObject.text, formObject)
						component.resultTable = resultTable
						const resultTableBlock = this.querySelector('.result-table-block')
						if (resultTableBlock) resultTable.fullComponent.forEach(element => resultTableBlock.appendChild(element))
					} else {
						component.dataSource = plainArray[0]
						component.sql = component.setStatement()
					}
					if (factory.getProcessHeadTail()) factory.getProcessHeadTail()[chooseType].push(component)
					else {
						const processTail = factory.create(`__processHeadTail`, 1)
						processTail[chooseType].push(component)
					}
					return true
				}
			}
			const chooseResultTypeModal = CreateUtils.createModal(`custom`, {
				'title':    `選擇結果集類型`,
				'body':     {
					"form": {
						"onsubmit": "return false",
						"children": [
							{
								'div': {
									'class': 	'form-group row',
									'children': [
										{
											'label': {
												'class': 	'col-sm-3 col-form-label',
												'text': 	'選擇類型'
											}
										},
										{
											'div': {
												'class': 	'col-sm-7 toggle-block',
												'children': [
													{
														'select': {
															'class':        'form-control',
															'id':           'modalTypeSelect',
															'name': 		'modalTypeSelect',
															'children': 	[
																{
																	'option': {
																		'value': 	'0',
																		'text': 	'請選擇'
																	}
																},
																{
																	'option': {
																		'value': 	'newData',
																		'text': 	'新增'
																	}
																},
																{
																	'option': {
																		'value': 	'updateData',
																		'text': 	'更新'
																	}
																},
																{
																	'option': {
																		'value': 	'deleteData',
																		'text': 	'刪除'
																	}
																},
																{
																	'option': {
																		'value': 	'gFormData',
																		'text': 	'gForm資料'
																	}
																}
															]
														}
													}
												]
											}
										}
									]
								}
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
						'text':  '確定'
					}
				],
				'callback': chooseResultCallBack
			})
			break
	}

	function getName(name) {
		switch (name) {
			case 'newData':
				return '新增資料'
			case 'updateData': 
				return '更新資料'
			case 'deleteData':
				return '刪除資料'
			case 'gFormData':
				return '填充資料'
		}
	}
	stepTrigger()
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

function addBeforeDelete(that) {
	const queryPage = document.querySelector('#queryPage')
	const mainSearchTitle = queryPage.querySelector('.main-search-title')
	const deleteBlockTitle = {
		"div": {
			"class": "col-12 delete-title d-flex",
			"children": [
				{
					"span": {
						"class": "h5",
						"text": "查詢前刪除區域"
					}
				},
				{
					"button": {
						"class": "btn btn-info",
						"style": "margin-left: 1rem;",
						"onclick": "collapse(this)",
						"text": "收起"
					}
				},
				{
					"button": {
						"class": "close",
						"type": "button",
						"style": "margin-left: auto",
						"onclick": "removeContainer(this, 'delete')",
						"children": [
							{
								"span": {
									"aria-hidden": 	"true",
									"text": 		"&times;"
								}
							}
						]
					}
				}
			]
		}
	}.createElemental()[0]
	const deleteBlock = {
		"div": {
			"class": "col-12 flex-column delete-block active",
			"data-role": "drag-drop-container",
			"data-type": "delete",
			"children": [
				{
					"span": {
						"class": "drop-text",
						"text": "請將需要作為查詢前刪除的表拖入此處"
					}
				}
			]
		}
	}.createElemental()[0]
	mainSearchTitle.before(deleteBlockTitle, deleteBlock)
	initDrawPageEvent()
	that.disabled = true
}

/**
 * 添加主表
 * @param {Event} e
 */
function addMainTable(e) {
	const treeGroup = document.querySelector('.tree-group')
	const mainSearchTitle = document.querySelector('.main-search-title')
	const mainSearchBlock = document.querySelector('.main-search-block')
	treeGroup.classList.add('active')
	mainSearchTitle.classList.add('active')
	mainSearchBlock.classList.add('active')
}

function addSubTable() {
	const queryPage = document.querySelector('#queryPage')
	const subBox = queryPage.querySelectorAll('.sub-search-block')
	const subBlockTitle = {
		"div": {
			"class": "col-12 sub-search-title d-flex",
			"children": [
				{
					"span": {
						"class": "h5",
						"text": "次要查詢區域"
					}
				},
				{
					"button": {
						"class": "btn btn-info",
						"style": "margin-left: 1rem;",
						"onclick": "collapse(this)",
						"text": "收起"
					}
				},
				{
					"button": {
						"class": "btn btn-outline-info join-connect-table-button hide",
						"style": "margin-left: 1rem;",
						"onclick": "joinConnectTable(this)",
						"text": "引入相關表"
					}	
				},
				{
					"button": {
						"class": "close",
						"type": "button",
						"style": "margin-left: auto",
						"onclick": "removeContainer(this, 'subTableHead')",
						"children": [
							{
								"span": {
									"aria-hidden": 	"true",
									"text": 		"&times;"
								}
							}
						]
					}
				}
			]
		}
	}.createElemental()[0]
	const subBlock = {
		"div": {
			"class": "col-12 flex-column sub-search-block active",
			"data-role": "drag-drop-container",
			"data-type": "sub",
			"children": [
				{
					"span": {
						"class": "drop-text",
						"text": "請將需要作為次要查詢的表拖入此處"
					}
				}
			]
		}
	}.createElemental()[0]
	if (subBox[subBox.length - 1]) subBox[subBox.length - 1].after(subBlockTitle, subBlock)
	else {
		queryPage.appendChild(subBlockTitle)
		queryPage.appendChild(subBlock)
	}
	
	initDrawPageEvent()
}

function skipSubTable() {
	stepTrigger(true)
}

function addResultTable(e) {
	const queryPage = document.querySelector('#queryPage')
	const resultBox = queryPage.querySelectorAll('.result-block')
	const resultBlockTitle = {
		"div": {
			"class": "col-12 result-title d-flex",
			"children": [
				{
					"span": {
						"class": "h5",
						"text": "結果集區域"
					}
				},
				{
					"button": {
						"class": "btn btn-info",
						"style": "margin-left: 1rem;",
						"onclick": "collapse(this)",
						"text": "收起"
					}
				},
				{
					"button": {
						"class": "close",
						"type": "button",
						"style": "margin-left: auto",
						"onclick": "removeContainer(this, 'result')",
						"children": [
							{
								"span": {
									"aria-hidden": 	"true",
									"text": 		"&times;"
								}
							}
						]
					}
				}
			]
		}
	}.createElemental()[0]
	const resultBlock = {
		"div": {
			"class": "col-12 flex-column result-block active",
			"data-role": "drag-drop-container",
			"data-type": "result",
			"children": [
				{
					"span": {
						"class": "drop-text",
						"text": "請將需要作為結果集的表拖入此處"
					}
				}
			]
		}
	}.createElemental()[0]
	if (resultBox[resultBox.length - 1]) resultBox[resultBox.length - 1].after(resultBlockTitle, resultBlock)
	else {
		queryPage.appendChild(resultBlockTitle)
		queryPage.appendChild(resultBlock)
	}
	initDrawPageEvent()
}

function addField(that) {
	const fieldBlock = that.closest('.field-block')
	const outerBlock = that.closest('div[data-type]')
	const queryBlock = that.closest('.query-data-block, .sub-search-block[data-type="sub"], .result-table-block, .result-block[data-type="result"], .delete-block')
	const fieldList = fieldBlock.querySelector('.field-list')
	const factory = window.ComponentFactory
	const queryData = factory.getRegisterComponentBySeq(queryBlock.firstChild.dataset.seq)
	let fieldComponent
	if (outerBlock.dataset.type === 'main' || outerBlock.dataset.type === 'delete') fieldComponent = factory.create(`__field`, '', '')
	else if (outerBlock.dataset.type === 'sub') fieldComponent = factory.create(`__field`, '', '', factory.getMainTable())
	else if (outerBlock.dataset.type === 'result') fieldComponent = factory.create(`__field`, '', '', factory.getMainTable(), factory.getProcessDetail())
	fieldComponent.queryData = queryData
	queryData.field.push(fieldComponent)
	fieldComponent.fullComponent.forEach(component => fieldList.appendChild(component))
}

function joinConnectTable(that) {
	const factory = window.ComponentFactory
	const titleBlock = that.parentNode
	const dataBlock = titleBlock.nextElementSibling
	const seq = dataBlock.firstChild.dataset.seq
	const component = factory.getRegisterComponentBySeq(seq)
	component.joinTable()
}

/**
 * 重新載入 SQL tree 清單
 * ==
 * 依照線上模式開啟給予不同樹狀結構\
 * 若開啟線上模式則呼叫 nis api 獲取全部庫數據\
 * 若未開啟線上模式則獲取本地預設庫數據
 */
function reloadSql() {
	const sqlTreeList = document.querySelectorAll('.sql-tree-list')
	const formTreeList = document.querySelectorAll('.form-tree-list')
	SharedUtils.loadingToggle()
    const queryPromise 	= SharedUtils.asyncGetFile('./template/xmlTable.json')
    queryPromise.then((resultMsg) => {
        const queryJson = JSON.parse(resultMsg)
        processData(queryJson)
        queryListLocalSession = queryJson
		sqlTreeList.forEach(tree => {
			tree.innerHTML = ''
			$(tree).data('plugin_bstreeview', null)
			$(tree).bstreeview({data: queryJson.database})
		})
        formTreeList.forEach(tree => {
			tree.innerHTML = ''
			$(tree).data('plugin_bstreeview', null)
			$(tree).bstreeview({data: queryJson.form})
		})
        window.formList = queryJson.form
        SharedUtils.loadingToggle(true)
		initButton()
    })

	/** 處理讀取出來的資料 */
    function processData(jsonObject) {
        if (Array.isArray(jsonObject)) {
			for (let i = 0, len = jsonObject.length; i < len; ++i) {
				if (jsonObject[i].type !== 'table' && jsonObject[i].type !== 'form') jsonObject[i].draggable = false
				if (jsonObject[i].nodes) processData(jsonObject[i].nodes)
				if (jsonObject[i].type === 'form') jsonObject[i].id = jsonObject[i].value
			}
		} else {
			for (let key in jsonObject) {
				processData(jsonObject[key])
			}
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

function stepTrigger(skip = false) {
	const factory = window.ComponentFactory
	const mainFile = factory.getMainTable()
	const subDetail = factory.getProcessDetail()
	const step2 = document.querySelector('#step-tab-2')
	const step3 = document.querySelector('#step-tab-3')
	if (mainFile) step2.classList.remove('disabled')
	else step2.classList.add('disabled')
	if (subDetail) step3.classList.remove('disabled')
	else step3.classList.add('disabled')
	if (skip) step3.classList.remove('disabled')
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

function findSessionTable(jsonObject, name) {
	if (Array.isArray(jsonObject)) {
		for (let object of jsonObject) {
			const result = findSessionTable(object, name)
			if (result) return result
		}
	} else if (typeof jsonObject === 'object') {
		for (let key in jsonObject) {
			if (jsonObject[key] === name && key === 'value') {
				return jsonObject
			} else {
				if (key === 'database' || key === 'form' || key === 'nodes') {
					const result = findSessionTable(jsonObject[key], name)
					if (result) return result
				}
			}
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

/**
 * 移除區塊
 */
function removeContainer(that, type) {
	const factory = window.ComponentFactory
	const container = that.closest('div[data-type][data-role="drag-drop-container"]')
	if (container) container.innerHTML = '<span class="drop-text">請將需要作為主要查詢的表拖入此處</span>'
	switch (type) {
		case 'mainTable':
			factory.removeMainTable()
			break
		case 'delete':
			const addBeforeDelete = document.querySelector('#addBeforeDelete')
			addBeforeDelete.disabled = false
			factory.removeBeforeDelete()
			const deleteTitle = that.closest('.delete-title')
			if (deleteTitle) {
				const block = deleteTitle.nextElementSibling
				if (block) block.remove()
				deleteTitle.remove()
			}
			break
		case 'subTableHead':
			const searchTitle = that.closest('.sub-search-title')
			if (searchTitle) {
				const block = searchTitle.nextElementSibling
				const child = block.firstChild
				if (child) {
					const seq = child.dataset.seq - 0 
					if (seq) {
						const processDetail = factory.getProcessDetail()
						processDetail.deleteNodes(seq)
						factory.removeNodeBySeq(seq)
					}
				}
				if (block) block.remove()
				searchTitle.remove()
			}
			break
		case 'result':
			const resultTitle = that.closest('.result-title')
			if (resultTitle) {
				const block = resultTitle.nextElementSibling
				const child = block.firstChild
				if (child) {
					const seq = child.dataset.seq - 0 
					if (seq) {
						const component = factory.getProcessHeadTail()
						component.deleteNodes(seq)
						factory.removeNodeBySeq(seq)
					}
				}
				if (block) block.remove()
				resultTitle.remove()
			}
			break
	}
	stepTrigger()
	initDrawPageEvent()
}

/**
 * 移除拖入事件
 */
function removeDragListener(element) {
	element.removeEventListener('drop', dropped)
	element.removeEventListener('dragenter', dropEnter)
	element.removeEventListener('dragover', dropOver)
	element.removeEventListener('dragleave', dropLeave)
}

/**
 * 區塊收合
 */
function collapse(that) {
	const parentNode = that.parentNode
	if (!parentNode) return false
	const viewBlock = parentNode.nextElementSibling
	if (!viewBlock) return false
	if (viewBlock.classList.contains('active')) {
		viewBlock.classList.remove('active')
		that.textContent = '展開'
	} else {
		viewBlock.classList.add('active')
		that.textContent = '收起'
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