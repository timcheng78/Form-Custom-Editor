export const AdvanceFunctions = {
    0: version_zero,
    1: version_one,
}

function version_zero () {
    /** 畫布 */
    const drawPage      = document.querySelector('#drawPage')
    /** 內容區塊 */
    const tabContent    = document.querySelector('#tabContent')
    /** 頁籤 */
    const navLink       = document.querySelectorAll('#tabs .nav-link')
    /** 畫布移除RWD屬性 */
    drawPage.classList.remove('structure1')
    /** 內容區塊添加高度樣式 */
    if (tabContent) {
        tabContent.classList.remove('h-0')
        tabContent.classList.add('height-0')
    }
    navLink.forEach(tab => {
        tab.dataset.toggle = 'tab'
    })
}

function version_one () {
    /** 畫布 */
    const drawPage          = document.querySelector('#drawPage')
    /** 標題區塊 */
    const titleBar          = this.frameElement.querySelector('.title-bar')
    /** 頁籤區塊 */
    const tabs              = this.frameElement.querySelector('#tabs')
    /** 內容區塊 */
    const tabContent        = this.frameElement.querySelector('#tabContent')
    /** 側邊區塊 */
    const blockContainer    = this.frameElement.querySelector('.col-4.block-drop-container')
    /** 表格區塊 */
    const tableCells        = this.frameElement.querySelectorAll('td')
    /** 表元素 */
    const tableList         = this.frameElement.querySelector('#tableList')
    /** 表頭區塊 */
    const formTitle         = titleBar.querySelector('.form-title-div')
    /** 畫布添加RWD屬性 */
    drawPage.classList.add('structure1')
    /** 處理標題區塊 */
    if (titleBar !== null) {
        const titleBlock    = titleBar.querySelector('.title-block')
        const titleText     = titleBar.querySelector('.title-bar-text')
        const titleButton   = titleBar.querySelector('.title-bar-button')
        if (titleText) {
            titleBar.appendChild(titleText)
            const subTitle = titleText.querySelector('span.h4:last-child')
            if (subTitle) {
                subTitle.classList.remove('h4')
                subTitle.classList.add('sub-title')
            }
        }
        if (titleButton) {
            titleBar.appendChild(titleButton)
            titleButton.classList.remove('title-bar-button')
            titleButton.classList.add('mobile-fixed')
            titleButton.id = 'mobile-fixed'
            const buttons = titleButton.querySelectorAll('button')
            buttons.forEach(button => {
                const informationElement = document.createElement('i')
                switch (button.innerText.trim()) {
                    case '暫存':
                        button.classList.value = 'btn btn-sm btn-other btn-success'
                        informationElement.classList.add('feather-archive')
                        break
                    case '儲存':
                        button.classList.value = 'btn btn-sm btn-main btn-primary'
                        informationElement.classList.add('feather-save')
                        break
                    case '取消':
                        button.classList.value = 'btn btn-sm btn-other btn-secondary'
                        informationElement.classList.add('feather-x')
                        button.parentNode.insertBefore(button, buttons[0])
                        break
                    case '新增':
                        button.classList.value = 'btn btn-sm btn-main btn-primary'
                        informationElement.classList.add('feather-plus')
                        break
                }
                const spanElement = document.createElement('span')
                spanElement.innerText = button.innerText.trim()
                button.innerHTML = ''
                button.append(informationElement, spanElement)
            })
        }
        if (titleBlock) titleBlock.remove()
    }
    /** 清單頁處理表頭區塊 */
    if (formTitle) {
        formTitle.classList.value = 'form-title-div block-drop-container'
        titleBar.after(formTitle)
    }
    /** 新增頁處理內容區塊 */
    if (tabContent) tabContent.classList.remove('h-0', 'height-0')
    /** 新增頁處理頁籤及內容區塊 */
    if (tabs && tabContent) {
        const tabContentBlock = document.createElement('div')
        const tabMenu = document.createElement('div')
        const tabMenuToggle = document.createElement('div')
        const informationElement = document.createElement('i')
        tabContentBlock.classList.add('tab-content-block')
        drawPage.appendChild(tabContentBlock)
        tabMenu.classList.add('tab-menu')
        tabMenuToggle.classList.add('tab-menu-toggle', 'show')
        informationElement.classList.add('feather-chevron-down')
        tabMenuToggle.append(informationElement)
        if (formTitle) {
            formTitle.classList.value = 'form-title-div block-drop-container'
            tabContentBlock.appendChild(formTitle)
        }
        tabContentBlock.append(tabMenu, tabContent)
        tabMenu.append(tabMenuToggle, tabs)
        const plusTab = tabs.querySelector('#plus-tab')
        if (plusTab) plusTab.parentNode.classList.add('add-nav-item')
        if (tabs.classList.contains('hide')) {
            tabs.classList.remove('hide')
            tabMenu.classList.add('hide')
        }
    }
    /** 新增處理表格區塊 */
    tableCells.forEach(td => {
        let count = 0
        for (let i = 0, len = td.children.length; i < len; ++i) {
            if (td.children[i].classList.contains('pFormItem')) count++
        }
        if (count > 1) {
            const divInlineBlock = document.createElement('div')
            divInlineBlock.classList.add('divInlineBlock-group')
            do {
                divInlineBlock.appendChild(td.firstChild)
            } while (td.hasChildNodes())
            td.replaceChildren(divInlineBlock)
        }
    })
    /** 移除側邊區域 */
    if (blockContainer) blockContainer.remove()
    /** 清單頁處理表格區塊 */
    if (tableList) {
        tableList.classList.add('table-list')
        const tableButtonBlock = document.createElement('div')
        const tableButtonMobileShow = document.createElement('div')
        const tableMore = document.createElement('span')
        const informationHorizontal = document.createElement('i')
        const tableButtonMobileHide = document.createElement('div')
        const buttonBlock = tableList.querySelector('.button-block')
        buttonBlock.classList.add('table-td-btn')
        buttonBlock.querySelectorAll('button').forEach(button => {
            const informationElement = document.createElement('i')
            switch (button.innerText.trim()) {
                case '編輯':
                    button.classList.value = 'btn btn-other btn-success'
                    informationElement.classList.add('feather-edit-2')
                    break
                case '刪除':
                    button.classList.value = 'btn btn-other btn-secondary'
                    informationElement.classList.add('feather-trash-2')
                    break
                case '列印':
                    button.classList.value = 'btn btn-other btn-danger'
                    informationElement.classList.add('feather-printer')
                    break
            }
            const spanElement = document.createElement('span')
            spanElement.innerText = button.innerText.trim()
            button.innerHTML = ''
            button.append(informationElement, spanElement)
            tableButtonMobileHide.appendChild(button)
        })
        tableButtonBlock.classList.add('table-btn-block')
        tableButtonMobileShow.classList.add('table-btn-mobile-show')
        tableMore.classList.add('table-more', 'show')
        informationHorizontal.classList.add('feather-more-horizontal')
        tableButtonMobileHide.classList.add('table-btn-mobile-hide')
        tableMore.appendChild(informationHorizontal)
        tableButtonBlock.append(tableButtonMobileShow, tableMore, tableButtonMobileHide)
        buttonBlock.appendChild(tableButtonBlock)
    }
    /** init 文件處理 */
    if (this.initContent) this.initContent.replace(/DingTool/, 'CSForm_RWD')
}

/** 
    function version_two (o) {
    }

    function version_three (o) {
    }

    function version_four (o) {
    }

    function version_five (o) {
    }

    ....

    like this
*/