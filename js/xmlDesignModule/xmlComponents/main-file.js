import { XMLComponent } from './xml-component.js'

export class MainFile extends XMLComponent {
    constructor(totalLevel, queryData, key, mainTree) {
        super()
        /** 階層 */
        this.totalLevel = totalLevel
        /** 處理表 欄位 (QueryData[]) */
        this.queryData = queryData
        /** 主要判斷欄位 (Key[]) */
        this.key = key
        /** 主查詢節點物件 (Object) */
        this.mainTree = mainTree
        this.structure = [
            {
                "div": {
                    "class": "d-flex flex-column",
                    "data-seq": "",
                    "children": [
                        {
                            "div": {
                                "class": "title-button-block",
                                "children": [
                                    {
                                        "button": {
                                            "class": "close",
                                            "type": "button",
                                            "onclick": "removeContainer(this, 'mainTable')",
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
                        },
                        {
                            "div": {
                                "class": "attribute-block form-group row",
                                "children": [
                                    {
                                        "label": {
                                            "class": "col-sm-2 col-form-label",
                                            "for": "totalLevel",
                                            "text": "TOTAL LEVEL"
                                        }
                                    },
                                    {
                                        "div": {
                                            "class": "col-sm-4",
                                            "children": [
                                                {
                                                    "input": {
                                                        "class": "form-control",
                                                        "type": "text",
                                                        "name": "totalLevel",
                                                        "id": "totalLevel",
                                                        "value": "2",
                                                        "onchange": super.valueChanged.bind(this)
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "div": {
                                "class": "query-data-block",
                                "children": []
                            }
                        },
                        {
                            "div": {
                                "class": "key-block",
                                "children": []
                            }
                        }
                    ]
                }
            }
        ]
        this.generateContainer()
    }

    get totalLevel() {
        return this._totalLevel
    }

    set totalLevel(totalLevel) {
        this._totalLevel = totalLevel
    }

    generateContainer() {
        const fullComponent = this.structure.createElemental()
        fullComponent.forEach(element => {
            const totalLevel = element.querySelector('#totalLevel')
            const queryBlock = element.querySelector('.query-data-block')
            const keyBlock = element.querySelector('.key-block')
            if (this.seq) element.dataset.seq = this.seq
            if (totalLevel && this.totalLevel) totalLevel.value = this.totalLevel
            if (queryBlock && this.queryData) this.queryData.fullComponent.forEach(component => queryBlock.appendChild(component))
            if (keyBlock && this.key) this.key.fullComponent.forEach(component => keyBlock.appendChild(component))
        })
        this.fullComponent = fullComponent
    }

    deleteNodes() {
        const factory = window.ComponentFactory
        if (this.key) factory.removeNodeBySeq(this.key.seq)
        if (this.queryData) factory.removeNodeBySeq(this.queryData.seq)
    }

    joinTable() {
        if (this.queryData) {
            const allJoinColumn = this.queryData.joinTable()
            allJoinColumn.forEach(columnArray => {
                columnArray.forEach(column => {
                    this.mainTree.nodes.push(column)
                })
            })
            this.key.setNameSelect(this.mainTree)
        }
    }

    assignNode(object, session, parentComponent) {
        if (object._totalLevel) this.totalLevel = object._totalLevel
        if (parentComponent.queryData) this.queryData = parentComponent.queryData
        if (this.queryData) this.mainTree = this.queryData.data
        if (parentComponent.key) {
            this.key = parentComponent.key
            this.key.setNameSelect(this.mainTree)
            this.key.generateContainer()
        }
        this.generateContainer()
    }
}
