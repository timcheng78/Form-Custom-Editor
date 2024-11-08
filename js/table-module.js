/** 新增表格按鈕模組 */
class CardModule {

    constructor (options) {
        /** 寬度差距 */
        this.gap = 0
        /** 按鈕樣式 */
        this.cardStyle = {
            div: {
                class: 'card card-plus',
                children: [
                    {
                        i: {
                            class: 'bi bi-plus'
                        }
                    }
                ]
            }
        }
        /** 容器樣式 */
        this.tableContainerStyle = {
            div: {
                class: 'col-12 table-container'
            }
        }
        /** 表格樣式 */
        this.tableStyle = {
            table: {
                class: "table-fixed table table-tool table-bordered table-striped",
                style: "margin-bottom: 0",
                children: [
                    {
                        tbody: {
                            children: [
                                {
                                    tr: {
                                        children: [
                                            {
                                                td: {
                                                    class: '',
                                                    'data-role': "drag-drop-container",
                                                    text: "&nbsp;"
                                                }
                                            },
                                            {
                                                td: {
                                                    class: '',
                                                    'data-role': "drag-drop-container",
                                                    text: "&nbsp;"
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
        options.selector.forEach(container => {
            /** 卡片元素樣式 */
            const card = this.cardStyle.createElemental()[0]
            container.replaceWith(card)
            /** 綁定按鈕元素 */
            card.addEventListener('click', (e) => {
                /** 取得按鈕元素 */
                const button    = e.target.closest('.card')
                /** 取得寬度比例 */
                const percent   = this.percentwidth(button)
                /** 製作表格容器元素 */
                const container = this.tableContainerStyle.createElemental()[0]
                /** 製作表格元素 */
                const table     = this.tableStyle.createElemental()[0]
                container.style.width = `${ percent }%`
                container.appendChild(table)
                button.before(container)
                options.tableSelector = table
                options.container = container
                container.addEventListener('click', (e) => {
                    if (e.target.classList.contains('table-container')) {
                        if (container.classList.contains('active')) container.classList.remove('active')
                        else container.classList.add('active')
                    }
                    if (options.tableClickCallback) options.tableClickCallback(e)
                })
                container.addEventListener('mouseenter', (e) => container.classList.add('hover'))
                container.addEventListener('mouseleave', (e) => container.classList.remove('hover'))
                new TableModule(options)
            })
        })
    }

    /** 計算寬度 */
    percentwidth (cardButton) {
        let parent = cardButton.offsetParent || cardButton
        if (this.gap === 0) this.gap = parent.offsetWidth - cardButton.offsetWidth
        let totalWidth = cardButton.offsetWidth + this.gap
        if (totalWidth < parent.offsetWidth) totalWidth = totalWidth - (this.gap / 2) 
        return ((totalWidth / parent.offsetWidth) * 100).toFixed(2)
    }
}

class ToolPackModule {
    constructor () {
	    /** 工具包按鈕 */
        this._toolPackButton     = document.querySelector('#toolPack')
        /** 工具包 */
        this._toolPackBar        = document.querySelector('#toolPackBar')
        /** 合併欄位按鈕 */
        this._combineButton      = document.querySelector('#combineCell')
        /** 解除合併欄位按鈕 */
        this._disassembleButton  = document.querySelector('#disassemble')
        /** 移除按鈕 */
        this._deleteBeanButton   = document.querySelector('#deleteBean')
        /** 腳本按鈕 */
        this._scriptButton       = document.querySelector('#scriptBtn')
        /** 計分按鈕 */
        this._scoreButton        = document.querySelector('#scoreBtn')
        /** 群組按鈕 */
        this._groupUpButton      = document.querySelector('#groupUpBtn')
        /** 解除群組按鈕 */
        this._groupDownButton    = document.querySelector('#groupDownBtn')
        /** 複製按鈕 */
        this._copyButton         = document.querySelector('#copyBtn')
        /** 貼上按鈕 */
        this._pasteButton        = document.querySelector('#pasteBtn')
        /** 啟用狀態 */
        this.active              = false
        /** 註冊 toolPack 至全域供使用 */
        window.ToolPack = this
        /** 初始化事件 */
        this.bindEvent()
    }

    /** 取得工具包按鈕 */
    get toolPackButton () {
        return this._toolPackButton
    }

    /** 取得工具包 */
    get toolPackBar () {
        return this._toolPackBar
    }

    /** 取得合併欄位按鈕 */
    get combineButton () {
        return this._combineButton
    }

    /** 取得解除合併欄位按鈕 */
    get disassembleButton () {
        return this._disassembleButton
    }

    /** 取得移除按鈕 */
    get deleteBeanButton () {
        return this._deleteBeanButton
    }

    /** 取得腳本按鈕 */
    get scriptButton () {
        return this._scriptButton
    }

    /** 取得計分按鈕 */
    get scoreButton () {
        return this._scoreButton
    }

    /** 取得群組按鈕 */
    get groupUpButton () {
        return this._groupUpButton
    }

    /** 取得解除群組按鈕 */
    get groupDownButton () {
        return this._groupDownButton
    }

    /** 取得複製按鈕 */
    get copyButton () {
        return this._copyButton
    }

    /** 取得貼上按鈕 */
    get pasteButton () {
        return this._pasteButton
    }

    /** 取得所有按鈕元素 */
    get allButtons () {
        return [
            this.combineButton,
            this.disassembleButton,
            this.deleteBeanButton,
            this.scriptButton,
            this.scoreButton,
            this.groupUpButton,
            this.groupDownButton,
            this.copyButton,
            this.pasteButton
        ]
    }

    /** 設定取用狀態 */
    set active (active) {
        this._active = active
    }

    /** 取得取用狀態 */
    get active () {
        return this._active
    }
    
    /** 初始化事件 */
    bindEvent () {
        this.toolPackButton.addEventListener('click', this.initEvent.bind(this))
        this.toolPackButton.addEventListener('dragstart', this.toolPackDragstart.bind(this))
        this.combineButton.addEventListener('click', this.initEvent.bind(this))
        this.disassembleButton.addEventListener('click', this.initEvent.bind(this))
        this.deleteBeanButton.addEventListener('click', this.initEvent.bind(this))
        this.scriptButton.addEventListener('click', this.initEvent.bind(this))
        this.scoreButton.addEventListener('click', this.initEvent.bind(this))
        this.groupUpButton.addEventListener('click', this.initEvent.bind(this))
        this.groupDownButton.addEventListener('click', this.initEvent.bind(this))
        this.copyButton.addEventListener('click', this.initEvent.bind(this))
        this.pasteButton.addEventListener('click', this.initEvent.bind(this))
    }

    /**
     * 初始化事件
     * @param {Event} e 
     */
    initEvent (e) {
        switch (e.target.dataset.action) {
            case 'toolPack':
                this.toolPackButton.blur()
                if (this.toolPackBar.classList.contains('active')) {
                    this.toolPackBar.classList.remove('active')
                    setTimeout(() => {
                        this.toolPackBar.classList.add('hide')
                    }, 150)
                } else {
                    this.toolPackBar.classList.remove('hide')
                    setTimeout(() => {
                        this.toolPackBar.classList.add('active')
                    }, 150)
                }
                
                break
            case 'combine':
                break
            case 'disassemble':
                break
            case 'delete':
                if (SharedUtils.isEditing()) return
                DrawPageFunctions.delete()
                break
            case 'script':
                break
            case 'score':
                break
            case 'copy':
                if (SharedUtils.isEditing()) return
                DrawPageFunctions.copy()
                break
            case 'paste':
                if (SharedUtils.isEditing()) return
                DrawPageFunctions.paste()
                break
            case 'group':
                break
            case 'ungroup':
                break
        }
    }

    /**
     * 工具包拖曳
     * 紀錄當前位置
     * @param {Event} e 
     */
    toolPackDragstart (e) {
        let style = window.getComputedStyle(e.target, null)
        let x = parseInt(style.getPropertyValue("left"), 10) - e.clientX
        let y = parseInt(style.getPropertyValue("top"), 10) - e.clientY
        let position = `${ x },${ y }`
        e.dataTransfer.setData("text/plain", position)
    }

    /**
     * 工具包觸發器
     */
    toggleToolPack () {
        if (this.active) {
            this.toolPackButton.classList.remove('active')
            this.toolPackButton.disabled = true
            setTimeout(() => this.toolPackButton.classList.add('hide'), 150)
            this.active = false
        } else {
            this.toolPackButton.classList.remove('hide')
            setTimeout(() => this.toolPackButton.classList.add('active'), 150)
            this.toolPackButton.disabled = false
            this.active = true
        }
    }

    /**
     * 啟用按鈕狀態
     * @param {String[]} activeType 
     */
    triggerButton (activeType) {
        this.allButtons.forEach(button => button.classList.remove('active'))
        if (activeType.includes("combine")) this.combineButton.classList.add('active')
        if (activeType.includes("disassemble")) this.disassembleButton.classList.add('active')
        if (activeType.includes("delete")) this.deleteBeanButton.classList.add('active')
        if (activeType.includes("script")) this.scriptButton.classList.add('active')
        if (activeType.includes("score")) this.scoreButton.classList.add('active')
        if (activeType.includes("copy")) this.copyButton.classList.add('active')
        if (activeType.includes("paste")) this.pasteButton.classList.add('active')
        if (activeType.includes("group")) this.groupUpButton.classList.add('active')
        if (activeType.includes("ungroup")) this.groupDownButton.classList.add('active')
    }
}

/** 表格模組 */
class TableModule {

    constructor (options) {
        /** 表格選擇器 */
        this.selector           = options.tableSelector
        /** 表格容器 */
        this.container          = options.container
        /** 表格點擊事件回調 */
        this.clickCallback      = options.cellClickCallback
        /** 表格滑鼠進入事件回調 */
        this.mouseEnterCallback = options.cellMouseEnterCallback
        /** 表格滑鼠移動事件回調 */
        this.mouseMoveCallback  = options.cellMouseMoveCallback
        /** 表格滑鼠離開事件回調 */
        this.mouseLeaveCallback = options.cellMouseLeaveCallback
        /** 表格滑鼠按下判斷 */
        this.mousedown = false
        /** 按鈕樣式 */
        this.buttonStyle = {
            button: {
                class: 	'add-table-cell-button icon plus',
                title: 	'新增欄位',
                text: 	'',
                children: [
                    {
                        i: {
                            class: 'bi bi-plus-circle-fill'
                        }
                    }
                ]
            }
        }
        /** 表格樣式 */
        this.tdStyle = {
            td: {
                class: '',
                'data-role': "drag-drop-container",
                text: "&nbsp;"
            }
        }
        /** 表列樣式 */
        this.trStyle = {
            tr: {}
        }
        this.init()
    }

    /** 取得表格 */
    get selector () {
        return this._selector
    }

    /** 設定表格 */
    set selector (selector) {
        this._selector = selector
    }

    /** 取得容器 */
    get container () {
        return this._container
    }

    /** 設定表格 */
    set container (container) {
        this._container = container
    }

    /** 取得點擊狀態 */
    get mousedown () {
        return this._mousedown
    }

    /** 設定點擊狀態 */
    set mousedown (mousedown) {
        this._mousedown = mousedown
    }

    /** 取得新增欄位按鈕 */
    get buttons () {
        return this._buttons
    }

    /** 設定新增欄位按鈕 */
    set buttons (buttons) {
        this._buttons = buttons
    }

    /** 取得當前選取表格 */
    static get currentModule () {
        return this._currentModule
    }

    /** 設定當前選取表格 */
    static set currentModule (currentModule) {
        this._currentModule = currentModule
    }

    /** 初始化 */
    init () {
        this.selector.addEventListener('mouseleave', (e) => this.mousedown = false)
        this.selector.querySelectorAll('td, th').forEach(tableCell => {
            if (!tableCell.dataset.listener) {
                tableCell.addEventListener('click', this.clickEvent.bind(this))
                tableCell.addEventListener('mouseenter', this.mouseEnterEvent.bind(this))
                tableCell.addEventListener('mousemove', this.mouseMoveEvent.bind(this))
                tableCell.addEventListener('mouseleave', this.mouseLeaveEvent.bind(this))
                tableCell.addEventListener('mousedown', this.mouseDownEvent.bind(this))
                tableCell.addEventListener('mouseup', this.mouseUpEvent.bind(this))
                tableCell.dataset.listener = true
            }
        })
        // DrawPageFunctions.dropContainerTrigger(true)
        // initDrawPageEvent()
    }

    /** 表格點擊事件 */
    clickEvent (e) {
        e.stopPropagation()
        if (this.clickCallback) this.clickCallback(e)
    }

    /** 滑鼠進入事件 */
    mouseEnterEvent (e) {
        e.stopPropagation()
        if (this.container) this.container.classList.remove('hover')
        if (!this.mousedown) {
            this.clearTableHover(e)
            e.target.classList.add('hover')
            /** 按鈕存在則直接略過新增按鈕 */
            if (!this.buttons) this.buttonDraw(e)
            this.buttonReScale(e)
        } else {
            if (e.target.classList.contains('active')) e.target.classList.remove('active')
            else e.target.classList.add('active')
        }
        if (this.mouseEnterCallback) this.mouseEnterCallback(e)
    }

    /** 滑鼠移動事件 */
    mouseMoveEvent (e) {
        if (this.container) this.container.classList.remove('hover')
        if (!this.mousedown) {
            e.target.classList.add('hover')
            /** 按鈕存在則直接略過新增按鈕 */
            if (!this.buttons) this.buttonDraw(e)
            this.buttonReScale(e)
        } else this.buttons.forEach(button => button.classList.add('hide'))
        
        if (this.mouseMoveCallback) this.mouseMoveCallback(e)
    }

    /** 滑鼠離開事件 */
    mouseLeaveEvent (e) {
        /** 下個元素 */
        const toElement = e.toElement ? e.toElement.closest('button') : false
        /** 
         * 若下個元素非新增欄位按鈕則需要移除按鈕即滑入效果
         * 用意：
         * 表格上有新增欄位按鈕，若滑鼠移入按鈕會觸發表格離開事件
         * 但該滑鼠依然在表格內，故添加判斷使動態效果不會取消
         * 若確實移出則移除全部按鈕
         */
        if (!toElement || !toElement.classList.contains('add-table-cell-button')) {
            this.buttons.forEach(button => button.classList.add('hide'))
            e.target.classList.remove('hover')
        }
        if (e.toElement === this.container) this.container.classList.add('hover')
        if (this.mouseLeaveCallback) this.mouseLeaveCallback(e)
        e.stopPropagation()
    }

    /** 滑鼠按下事件 */
    mouseDownEvent (e) {
        e.stopPropagation()
        if (e.target.classList.contains('active')) e.target.classList.remove('active')
        else {
            this.clearTableActive()
            e.target.classList.add('active')
            TableModule.currentModule = this
        }
        this.mousedown = true
    } 
    
    /** 滑鼠放開事件 */
    mouseUpEvent (e) {
        e.stopPropagation()
        this.mousedown = false
    }

    /**
     * 表格新增欄位
     * 規則如下：
     * 各方向新增欄位每次都是新增一整列或一整欄
     * 若遇到合併欄位
     *  - 中間欄位會進行擴充合併
     *  - 靠外欄位會新增欄位
     * 若合併欄位向外新增都會增加新的一欄(列)
     */
    addCell (e) {
        e.stopPropagation()
        /** 點擊的新增欄位按鈕 */
        const addButton = e.target.closest('.add-table-cell-button')
        /** 當前表格 */
        const tableCell = this.selector.querySelector('td.hover')
        /** 當前列表 */
        const tableRow  = tableCell.parentNode
        /** 計數器 (用於計算與欄位合併數量) */
        let count = 0
        /** 當前欄位合併數量 */
        let colspan = 1
        /** 當前列合併數量 */
        let rowspan = 1
        /** 是否新增過 */
        let isAdded = false
        /** 上下方新增欄位 */
        if (addButton.classList.contains('top') || addButton.classList.contains('bottom')) {
            /** 當前表格一列欄位總數 */
            let maxCell = this.getTableMaxCell()
            /** 當前列 */
            let targetRow = tableRow
            /** 依照列的樣式製作克隆體 */
            const trClone = this.trStyle.createElemental()[0]
            /** 判定是否為雙向合併欄位點擊下方新增欄位 */
            if ((tableCell.rowSpan > 1 || tableCell.colSpan > 1) && addButton.classList.contains('bottom')) targetRow = tableRow.parentNode.children[tableRow.parentNode.children.indexOf(tableRow) + tableCell.rowSpan - 1]
            for (let i = 0; i < maxCell; ++i) {
                /** 依照欄位樣式製作客龍體 */
                const tdClone = this.tdStyle.createElemental()[0]
                /** 當前列的選取欄 */
                const tdInPosition = targetRow.children[i]
                /** 應該不會發生、可能發生原因會是非常舊的表單 */
                if (!tdInPosition) continue
                /** 判斷是否為表格合併欄位 */
                if (tdInPosition.rowSpan > 1) {
                    /** 
                     * 處理非當前格並點擊下方欄位新增按鈕狀況
                     * 範例：
                     *  ↓ 此格向下新增時，循環至欄合併且與當前欄位不同，需要進行調整
                     *  __ __ __
                     * |__|__ __|
                     * |__|__|__|
                     */
                    if (tdInPosition !== tableCell && addButton.classList.contains('bottom')) {
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
                    if (addButton.classList.contains('top')) otherCell = targetRow.previousElementSibling ? targetRow.previousElementSibling.children[i] : null
                    /** 點擊下方欄位新增，判斷欄位下方格 */
                    if (addButton.classList.contains('bottom')) otherCell = targetRow.nextElementSibling ? targetRow.nextElementSibling.children[i] : null
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
            if (addButton.classList.contains('top')) targetRow.before(trClone)
            else targetRow.after(trClone)
        }
        /** 左右方新增欄位 概念相似上下方新增欄位 */
        if (addButton.classList.contains('left') || addButton.classList.contains('right')) {
            /** 當前表格 X 軸 */
            let position = tableRow.children.indexOf(tableCell)
            /** 表格全部的列 */
            const tableRows = this.selector.querySelectorAll('tr')
            if ((tableCell.rowSpan > 1 || tableCell.colSpan > 1) && addButton.classList.contains('right')) position += (tableCell.colSpan - 1)
            tableRows.forEach(tr => {
                let tdInPosition = tr.children[position]
                const tdClone = this.tdStyle.createElemental()[0]
                if (tdInPosition.colSpan > 1) {
                    if (tdInPosition !== tableCell && addButton.classList.contains('right')) {
                        if (!isAdded) tdInPosition.colSpan++
                        tdClone.classList.add('hide')
                        isAdded = true
                        count++
                    } else if (tdInPosition === tableCell && addButton.classList.contains('right')) {
                        tdInPosition = tr.children[position + tdInPosition.colSpan - 1]
                    }
                    rowspan = tdInPosition.rowSpan
                } else if (tdInPosition.classList.contains('hide')) {
                    let otherCell
                    if (addButton.classList.contains('right')) otherCell = tdInPosition.nextElementSibling
                    if (addButton.classList.contains('left')) otherCell = tdInPosition.previousElementSibling
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
                if (addButton.classList.contains('left')) tdInPosition.before(tdClone)
                else tdInPosition.after(tdClone)
            })
        }
        this.init()
        this.buttonReScale(e)
        this.clearTableState()
    }

    /** 表格移除欄位 */
    subCell (e) {

    }

    /** 表格合併 */
    cellMerge () {
        const activeCells = this.selector.querySelectorAll('td.active, th.active')
        let firstCell, lastCell
        activeCells.forEach(cell => {
            if (lastCell) {
                let cellX = cell.cellIndex
                let cellY = cell.parentNode.parentNode.children.indexOf(cell.parentNode)
                let lastCellX = lastCell.cellIndex    
                let lastCellY = lastCell.parentNode.parentNode.children.indexOf(lastCell.parentNode)
                if (cellX === lastCellX && (cellY - lastCellY === 1)) {
                    /** rowspan */
                    if (!firstCell) firstCell = lastCell
                    if (firstCell.colSpan === 1) {
                        firstCell.rowSpan++
                        cell.classList.add('hide')
                    } else firstCell = null
                } else if (cellY === lastCellY && (cellX - lastCellX === 1)) {
                    /** colspan */
                    if (!firstCell) firstCell = lastCell
                    if (firstCell.rowSpan === 1) {
                        firstCell.colSpan++
                        cell.classList.add('hide')
                    } else firstCell = null
                } else firstCell = null
                
            }
            lastCell = cell
        })
        this.clearTableState()
    }

    /** 表格分解 */
    cellDivide () {
        const activeCells = this.selector.querySelectorAll('td.active, th.active')
        activeCells.forEach(cell => {
            if (cell.colSpan > 1 && cell.rowSpan > 1) {
                // rowspan and colspan
                let y = cell.parentNode.parentNode.children.indexOf(cell.parentNode)
                for (let i = y; i < y + cell.rowSpan; ++i) {
                    const tempRow = cell.parentNode.parentNode.children[i]
                    for (let j = cell.cellIndex; j < cell.cellIndex + cell.colSpan; ++j) {
                        const tempCell = tempRow.children[j]
                        tempCell.classList.remove('hide')
                    }
                }
            }
            if (cell.colSpan > 1) {
                // colspan
                for (let i = cell.cellIndex; i < cell.cellIndex + cell.colSpan; ++i) {
                    const tempCell = cell.parentNode.children[i]
                    tempCell.classList.remove('hide')
                }
                cell.colSpan = 1
            }
            if (cell.rowSpan > 1) {
                // rowspan
                let x = cell.cellIndex
                let y = cell.parentNode.parentNode.children.indexOf(cell.parentNode)
                for (let i = y; i < y + cell.rowSpan; ++i) {
                    const tempCell = cell.parentNode.parentNode.children[i].children[x]
                    tempCell.classList.remove('hide')
                }
                cell.rowSpan = 1
            }
        })
        this.clearTableState()
    }

    /** 繪製新增欄位按鈕並綁定事件 */
    buttonDraw (e) {
        /** 新增按鈕的方位類別 */
        const director 	    = ['top', 'bottom', 'left', 'right']
        /** 按鈕群 */
        const buttons       = []
        for (let i = 0; i < 4; ++i) {
            /** 按鈕元素 (依照按鈕樣式進行製作) */
            const button = this.buttonStyle.createElemental()[0]
            button.classList.add(director[i], 'hide')
            document.body.appendChild(button)
            buttons.push(button)
            /** 按鈕事件綁定 */
            button.addEventListener('click', this.addCell.bind(this))
            button.addEventListener('mouseenter', (e) => e.stopPropagation())
            button.addEventListener('mousemove', (e) => e.stopPropagation())
            button.addEventListener('mouseleave', (e) => {
                e.stopPropagation()
                /** 下個元素 */
                const toElement = e.toElement ? e.toElement : false
                /** 
                 * 若下個元素非表格欄位則需要移除按鈕即滑入效果
                 * 用意：
                 * 若滑鼠從新增欄位按鈕移出會觸發，
                 * 但如果移入的是表格則不觸發該效果
                 */
                if (!toElement || toElement.tagName.toLowerCase() !== 'td' || toElement.tagName.toLowerCase() !== 'th') {
                    this.buttons.forEach(button => button.classList.add('hide'))
                    this.clearTableHover()
                }
            })
        }
        this.buttons = buttons
    }

    /** 新增欄位按鈕位置調整 */
    buttonReScale (e) {
        /** 當前滑入的欄位 (供後續新增欄位按鈕事件綁定使用) */
        const tableCell = this.selector.querySelector('td.hover')
        /** 取得矩陣方位 */
        const rect = tableCell.getBoundingClientRect()
        /** 表格欄位高度，以便新增欄位按鈕黏住表格邊框 */
        let height = tableCell.offsetHeight
        /** 表格欄位寬度，以便新增欄位按鈕黏住表格邊框 */
        let width = tableCell.offsetWidth
        /** 滑鼠位置 X 軸 */
        let mouseX = e.offsetX
        /** 滑鼠位置 Y 軸 */
        let mouseY = e.offsetY
        /** 按鈕位置調整，依照表格寬度高度及上方左方距離計算位置，並依照滑鼠位置做動態顯示/隱藏效果 */
        this.buttons.forEach(button => {
            if (width <= 200) button.classList.add('icon-sm')
            if (button.classList.contains('top')) {
                // top
                button.style.top = rect.top + 'px'
                button.style.left = (rect.left + Math.floor((width / 2))) + 'px'
                if (mouseY < (height / 2)) button.classList.remove('hide')
                else button.classList.add('hide')
            }
            if (button.classList.contains('bottom')) {
                // bottom
                button.style.top = rect.top + height + 'px'
                button.style.left = (rect.left + Math.floor((width / 2))) + 'px'
                if (mouseY > (height / 2)) button.classList.remove('hide')
                else button.classList.add('hide')
            }
            if (button.classList.contains('left')) {
                // left
                button.style.top = (rect.top + Math.floor(height / 2)) + 'px'
                button.style.left = rect.left + 'px'
                if (mouseX < width / 2) button.classList.remove('hide')
                else button.classList.add('hide')
            }
            if (button.classList.contains('right')) {
                // right
                button.style.top = (rect.top + Math.floor(height / 2)) + 'px'
                button.style.left = rect.left + width + 'px'
                if (mouseX > width / 2) button.classList.remove('hide')
                else button.classList.add('hide')
            }
        })
    }

    /**
     * 取得當前表格最大欄位數量
     * =
     * @returns { Number } 數量
     */
    getTableMaxCell () {
        let cellCount 	= 0
        const tableRows = this.selector.querySelectorAll('tbody > tr')
        tableRows.forEach(tr => {
            const tableDataCount = tr.querySelectorAll(':scope > td, :scope > th').length
            if (tableDataCount > cellCount) cellCount = tableDataCount
        })
        return cellCount
    }

    /**
     * 取得當前欄位的上左右下方位位置(x, y)
     * =
     * @param { Number } x 座標
     * @param { Number } y 座標
     * @returns { Array[Array[Number]] } result [上, 左, 右, 下]
     */
    getSideCellPosition (x, y) {
        const resultArray = []
        if (y !== 0) resultArray.push([x , y - 1])
        if (x !== 0) resultArray.push([x - 1, y])
        resultArray.push([x + 1, y])
        resultArray.push([x, y + 1])
        return resultArray
    }

    /**
     * 取得當前表格選取的方位
     * =
     * @returns { String } result row: 橫向選取, col: 縱向選取, unset: 無法判別
     */
    selectDirection () {
        const positionArray 	= []
        const activeTable 		= this.selector.querySelectorAll('td.active')
        let result 				= 'unset'
        activeTable.forEach(td => {
            const tableRow 	= td.closest('tr')
            const x 		= td.parentNode.children.indexOf(td)
            const y 		= tableRow.parentNode.children.indexOf(tableRow)
            if (positionArray.length > 0) {
                if (positionArray[0][0] === x) result = 'row'
                else if (positionArray[0][1] === y) result = 'col'
            }
            positionArray.push([x, y])
        })
        return result
    }

    /** 整列選取 */
    selectRow () {

    }

    /** 整欄選取 */
    selectColumn () {

    }

    /** 清除表格狀態 */
    clearTableHover () {
        this.selector.querySelectorAll('td, th').forEach(tableCell => {
            tableCell.classList.remove('hover')
        })
    }

    /** 清除表格狀態 */
    clearTableState () {
        this.selector.querySelectorAll('td, th').forEach(tableCell => {
            tableCell.classList.remove('active')
        })
    }

    /** 清除全部表格點擊狀態 */
    clearTableActive () {
        const activeData = document.querySelector('#drawPage').querySelectorAll('td.active, th.active')
        activeData.forEach(td => td.classList.remove('active'))
    }
}