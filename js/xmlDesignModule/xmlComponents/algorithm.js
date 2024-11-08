import { XMLComponent } from './xml-component.js'

export class Algorithm extends XMLComponent {
    constructor(deleteData, mainFile, processDetail, /** processHead, */ processTail) {
        super()
        /** 刪除資料區塊 (DeleteData[]) */
        this.deleteData = deleteData
        /** 主要查詢區塊 (MainFile) */
        this.mainFile = mainFile
        /** 次要查詢區塊 (ProcessDetails) */
        this.processDetail = processDetail
        /** 處理表頭區塊 (ProcessHeadTail[]) */
        // this.processHead = processHead
        /** 刪除資料區塊 (ProcessHeadTail[]) */
        this.processTail = processTail
    }

    assignNode(object, session, parentComponent) {
        if (parentComponent.deleteData) this.deleteData = parentComponent.deleteData
        if (parentComponent.mainFile) this.mainFile = parentComponent.mainFile
        if (parentComponent.processDetail) this.processDetail = parentComponent.processDetail
        if (parentComponent.processHeadTail) this.processTail = parentComponent.processHeadTail
    }

    showView() {
        const queryPage = document.querySelector('#queryPage')
        const treeGroup = document.querySelector('.tree-group')
        const mainSearchTitle = document.querySelector('.main-search-title')
        const mainSearchBlock = document.querySelector('.main-search-block')
        const subBox = queryPage.querySelectorAll('.sub-search-block')
        const resultBox = queryPage.querySelectorAll('.result-block')
        treeGroup.classList.add('active')
        mainSearchTitle.classList.add('active')
        mainSearchBlock.classList.add('active')
        mainSearchBlock.innerHTML = ''
        mainSearchBlock.appendChild(this.mainFile.fullComponent[0])
        for (let data of this.processDetail.queryData) {
            const subBlockTitle = {
                "div": {
                    "class": "col-12 sub-search-title d-flex",
                    "children": [
                        {
                            "span": {
                                "class": "h5",
                                "text": `次要查詢區域 - ${ data.name }`
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
                    "children": []
                }
            }.createElemental()[0]
            subBlock.appendChild(data.fullComponent[0])
            if (subBox[subBox.length - 1]) subBox[subBox.length - 1].after(subBlockTitle, subBlock)
            else {
                queryPage.appendChild(subBlockTitle)
                queryPage.appendChild(subBlock)
            }
        }
        for (let key in this.processTail) {
            if (!Array.isArray(this.processTail[key])) continue
            if (this.processTail[key].length === 0) continue
            for (let data of this.processTail[key]) {
                const resultBlockTitle = {
                    "div": {
                        "class": "col-12 result-title d-flex",
                        "children": [
                            {
                                "span": {
                                    "class": "h5",
                                    "text": `結果集區域 - ${ data.name } - ${ getName(key) }`
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
                        "children": []
                    }
                }.createElemental()[0]
                resultBlock.appendChild(data.fullComponent[0])
                if (resultBox[resultBox.length - 1]) resultBox[resultBox.length - 1].after(resultBlockTitle, resultBlock)
                else {
                    queryPage.appendChild(resultBlockTitle)
                    queryPage.appendChild(resultBlock)
                }
            }
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
    }
}
