class DragNDrop {

    static get dragTempArray () {
        return this._dragTempArray
    }

    static set dragTempArray (dragTempArray) {
        this._dragTempArray = dragTempArray
    }

    /**
     * 記憶元素
     * @param {Element} element 
     * @returns {number} index
     */
    static memoryDragElement (element) {
        if (!this.dragTempArray) this.dragTempArray = []
        let index = this.dragTempArray.indexOf(element)
        if (index === -1) {
            this.dragTempArray.push(element)
            index = this.dragTempArray.length - 1
        }
        return index
    }

    /**
     * 基礎拖曳
     * 包含 基礎元件,清單元件,列印元件,表單元件樹
     * @param {Event} e 
     */
    static basicDragStart (e) {
        let index = this.memoryDragElement(e.target)
        e.dataTransfer.setData('text/plain', `${ e.target.tagName.toLowerCase() },${ index }`)
        e.stopPropagation()
    }
    
    /**
     * 物件拖曳
     * 包含 畫布上元件,標題
     * @param {Event} e 
     */
    static objectDragStart (e) {
        let index = this.memoryDragElement(e.target)
        e.dataTransfer.setData('text/plain', `object,${ index }`)
        e.stopPropagation()
    }
    
    /**
     * 基礎拖曳進入
     * 包含 基礎元件,清單元件,列印元件,表單元件樹,畫布上元件,標題
     * @param {Event} e 
     */
    static basicDragEnter (e) {
        SharedUtils.cancelDefault(e)
        /** 若進入頁籤則需點擊切換 */
        if (e.target.tagName.toLowerCase() === 'a' && e.target.classList.contains('nav-link')) e.target.click()
    }

    /**
     * 基礎拖曳中
     * 包含 基礎元件,清單元件,列印元件,表單元件樹,畫布上元件,標題
     * @param {Event} e 
     */
    static basicDragOver (e) {
        SharedUtils.cancelDefault(e)
        /** 判斷拖曳中元素，若為元件內則直接在該元素添加類別，若為表格則在表格添加類別 */
        if (e.target.tagName.toLowerCase() === 'div' && 
            (e.target.classList.contains('bean-drop') || e.target.classList.contains('block-drop-container') || e.target.classList.contains('print-container'))) {
            e.target.classList.add('drag-hover')
        } else {
            const tableCell = e.target.closest('th, td')
            if (tableCell) tableCell.classList.add('drag-hover')
        }
    }

    /**
     * 基礎拖曳離開元素
     * 包含 基礎元件,清單元件,列印元件,表單元件樹,畫布上元件,標題
     * @param {Event} e 
     */
    static basicDragLeave (e) {
        SharedUtils.cancelDefault(e)
        e.target.classList.remove('drag-hover')
    }

    /**
     * 基礎放置
     * 由此分類放置類型
     * 分別處理各事件
     * @param {Event} e 
     */
    static basicDrop (e) {
        SharedUtils.cancelDefault(e)
        e.target.classList.remove('drag-hover')
        /** 拖曳元素,元件的參數 (a,b)轉為陣列 */
        const plainArray    = e.dataTransfer.getData('text/plain').split(',')
        /** 拖曳類型 */
        const dragTag 	    = plainArray[0]
        /** 拖曳參數 */
        const index 		= plainArray[1]
        /** 預設放置為元件區 */
        let container       = e.target
        /** 判斷是否為放置為表格區 */
        if (!container.classList.contains('bean-drop')) container = e.target.closest('td, th')
        /** 清掉空格 */
        if (container.firstChild instanceof Text) container.firstChild.remove()
        /** 取得元素 */
        const element = this.dragTempArray[index]
        switch (dragTag) {
            case 'object': 
                this.objectDrop(element, container)
                break
            default:
                this.beanDrop(element, container)
                break
        }
    } 

    /**
     * 物件放置
     * @param {Element} element 
     * @param {Element} container
     */
    static objectDrop (element, container) {
        /** 原本放標題的容器 */
        let originContainer = element.parentNode
        if (element.tagName.toLowerCase() === 'label') {
            // 標題放置
            /** 原有容器判斷是否需移除標題樣式 */
            if (originContainer.querySelectorAll('td > label.h6, th > label.h6').length === 1) originContainer.classList.remove('table-data-title')
            this.checkingTableDataTitleAdd(container)
        } else {
            // 元件放置
            /** 若原有容器包含同行群組類別 則判斷數量是否需移除 */
            if (originContainer.classList.contains('divInlineBlock-group') && 
                originContainer.querySelectorAll('.divInlineBlock-group > .pFormItem[data-name], .divInlineBlock-group > .pFormItemGroup[data-name]').length === 2) {
                const outsideContainer = originContainer.parentNode
                do {
                    outsideContainer.appendChild(originContainer.firstChild)
                } while (originContainer.hasChildNodes())
                originContainer.remove()
            }
            this.checkingTableDataTitleAdd(originContainer)
            this.checkingInlineGroupAdd(container)
            /** 移除標題樣式 */
            if (container.classList.contains('table-data-title')) container.classList.remove('table-data-title')
        }
        /** 若新的容器包含同行群組類別 則調整容器 */
        if (container.querySelector('.divInlineBlock-group')) container = container.querySelector('.divInlineBlock-group')
        this.appendRightPosition(container, element)
    }

    /**
     * 元件放置
     * @param {Element} element 
     * @param {Element} container
     */
    static beanDrop (element, container) {
        const isBasic = element.dataset.basic
        if (isBasic) {
            // 基礎元件類
            const type = element.dataset.type
            switch (type) {
                case 'add':
		            /** 預設元件名稱 */
                    const defaultName = `${ element.value }_${ new Date().getTime() }`
                    const addComponent = ComponentFactory.create(`__${ element.value }`, defaultName, defaultName, element.dataset.title)
                    if (element.value !== 'breakLine' && element.value !== 'label') settingPreviousTitle(container, defaultName, element.dataset.title)
                    this.checkingInlineGroupAdd(container)
                    /** 若新的容器包含同行群組類別 則調整容器 */
                    if (container.querySelector('.divInlineBlock-group')) container = container.querySelector('.divInlineBlock-group')
                    /** 移除標題樣式 */
                    if (container.classList.contains('table-data-title')) container.classList.remove('table-data-title')
                    this.appendRightPosition(container, addComponent.fullComponent)
                    break
                case 'list':
                    const listComponent = ComponentFactory.createList(`__${ element.value }`)
                    container.appendChild(listComponent.fullComponent)
                    settingListPageTitle(container, listComponent.dataset.title)
                    break
                case 'print':
                    const printComponent = ComponentFactory.createPrint(`__${ element.value }`)
                    container.appendChild(printComponent.fullComponent)
                    break
            }
        } else {
            // 元件樹
            const seq       = element.dataset.seq
            const component = ComponentFactory.getRegisterComponentBySeq(seq)
            if (!component) return
            if (DrawPageFunctions.isAddPage()) {
                /** 啟用元件 */
                component.abandoned = false
                this.checkingInlineGroupAdd(container)
                /** 若新的容器包含同行群組類別 則調整容器 */
                if (container.querySelector('.divInlineBlock-group')) container = container.querySelector('.divInlineBlock-group')
                /** 移除標題樣式 */
                if (container.classList.contains('table-data-title')) container.classList.remove('table-data-title')
                this.appendRightPosition(container, component.fullComponent)
            } else if (DrawPageFunctions.isListPage()) {
                container.appendChild(component.listComponent)
                settingListPageTitle(container, component.dataset.title)
            } else if (DrawPageFunctions.isPrintPage()) {
                container.appendChild(component.printComponent)
            }
        }

        /**
         * 設定清單頁標題
         * @param {Element} tdElement 
         * @param {string} titleText 
         */
        function settingListPageTitle (tdElement, titleText) {
            tdElement.dataset.mobileTitle = titleText
            const index = tdElement.parentNode.children.indexOf(tdElement)
            const table = tdElement.closest('table')
            const thead = table.querySelector('thead tr')
            if (thead.children[index]) {
                if (thead.children[index].innerHTML.indexOf('&nbsp;') === 0) thead.children[index].innerHTML = thead.children[index].innerHTML.substring(6)
                if (thead.children[index].innerHTML === '') thead.children[index].innerHTML = titleText
            }
        }

        /**
         * 設定新增頁左側標題
         * @param {Element} tdElement 
         * @param {string} componentName 
         * @param {string} titleText 
         */
        function settingPreviousTitle (tdElement, componentName, titleText) {
            if (tdElement.tagName.toLowerCase() !== 'td' || !tdElement.previousElementSibling) return
            let previousElement = tdElement.previousElementSibling
            if (previousElement.classList.contains('hide')) settingPreviousTitle(previousElement, titleText)
            // 確保空的才設定標題
            else if (previousElement.firstChild instanceof Text) {
                /**　清除空格 */
                previousElement.firstChild.remove()
                previousElement.classList.add('table-data-title')
                previousElement.appendChild(CreateUtils.createBeanElement({
                    'controlType': 'label',
                    'attribute': 	[
                        {
                            'class': 'h6 canEditDiv',
                            'draggable': 'true',
                            'data-edit': 'true',
                            'data-connect': componentName,
                            'text': titleText
                        }
                    ]
                })[0])

            }
        }
    }

    /**
     * 檢查是否需要添加標題樣式
     * @param {Element} container 
     */
    static checkingTableDataTitleAdd (container) {
        let selector = 'td > .pFormItem[data-name], td > .pFormItemGroup[data-name], th > .pFormItem[data-name], th > .pFormItemGroup[data-name]'
        if (container.querySelectorAll(selector).length !== 0) return
        container.classList.add('table-data-title')
    }

    /**
     * 檢查是否需要添加同行群組類別 
     * @param {Element} container 
     */
    static checkingInlineGroupAdd (container) {
        /** 若新的容器已有一個元件 則須建立同行群組類別 */
        let selector = 'td > .pFormItem[data-name], td > .pFormItemGroup[data-name], th > .pFormItem[data-name], th > .pFormItemGroup[data-name]'
        if (container.querySelectorAll(selector).length !== 1) return
        const divInlineBlock = document.createElement('div')
        divInlineBlock.classList.add('divInlineBlock-group')
        do {
            divInlineBlock.appendChild(container.firstChild)
        } while (container.hasChildNodes())
        container.appendChild(divInlineBlock)
    }

    /**
     * 放置正確位置
     * @param {Element} container 
     * @param {Element} element 
     */
    static appendRightPosition (container, element) {
        if (container.classList.contains('bean-drop')) {
            if (container.classList.contains('drop-before')) container.after(element)
            else if (container.classList.contains('drop-after')) container.before(element)
        } else container.appendChild(element)
    }
}