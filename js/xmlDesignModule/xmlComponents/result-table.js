import { XMLComponent } from './xml-component.js'

export class ResultTable extends XMLComponent {
    constructor(name, where, description, data) {
        super()
        /** 名稱 */
        this.name = name
        /** 查詢條件 */
        this.where = where
        /** 中文敘述 */
        this.description = description
        /** 參數存放區塊 (Field[]) */
        this.field = this.buildingField(data)
        this.structure = [
            {
                "div": {
                    "class": "d-flex flex-column",
                    "data-seq": "",
                    "children": [
                        {
                            "div": {
                                "class": "attribute-block form-group row",
                                "children": [
                                    {
                                        "label": {
                                            "class": "col-sm-2 col-form-label",
                                            "for": "name",
                                            "text": "名稱(NAME)"
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
                                                        "name": "name",
                                                        "id": "name",
                                                        "value": "",
                                                        "onchange": super.valueChanged.bind(this)
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        "label": {
                                            "class": "col-sm-2 col-form-label",
                                            "for": "description",
                                            "text": "敘述(description)"
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
                                                        "name": "description",
                                                        "id": "description",
                                                        "value": "",
                                                        "onchange": super.valueChanged.bind(this)
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        "label": {
                                            "class": "col-sm-2 col-form-label",
                                            "for": "where",
                                            "text": "條件(where)"
                                        }
                                    },
                                    {
                                        "div": {
                                            "class": "col-sm-10",
                                            "children": [
                                                {
                                                    "input": {
                                                        "class": "form-control",
                                                        "type": "text",
                                                        "name": "where",
                                                        "id": "where",
                                                        "value": "",
                                                        "onchange": super.valueChanged.bind(this)
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                ]
                            }
                        },
                        {
                            "div": {
                                "class": "field-block row",
                                "children": [
                                    {
                                        "label": {
                                            "class": "col-sm-2 col-form-label",
                                            "for": "sql",
                                            "text": "查詢參數(Field)"
                                        }
                                    },
                                    {
                                        "div": {
                                            "class": "col-sm-10",
                                            "children": [
                                                {
                                                    "button": {
                                                        "class": "btn btn-primary",
                                                        "onclick": "addField(this)",
                                                        "text": "添加查詢參數"
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        "div": {
                                            "class": "col-sm-12 row field-list",
                                            "children": []
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        ]
        this.generateContainer()
    }

    set name(name) {
        this._name = name
    }

    get name() {
        return this._name
    }

    set where(where) {
        this._where = where
    }

    get where() {
        return this._where
    }

    set description(description) {
        this._description = description
    }

    get description() {
        return this._description
    }

    generateContainer() {
        const fullComponent = this.structure.createElemental()
        fullComponent.forEach(element => {
            const nameInput = element.querySelector('#name')
            const whereInput = element.querySelector('#where')
            const descriptionInput = element.querySelector('#description')
            const fieldList = element.querySelector('.field-list')
            if (this.seq) element.dataset.seq = this.seq
            if (nameInput && this.name) nameInput.value = this.name
            if (whereInput && this.where) whereInput.value = this.where
            if (descriptionInput && this.description) descriptionInput.value = this.description
            if (fieldList && this.field) this.field.forEach(element => fieldList.appendChild(element.fullComponent[0]))
        })
        this.fullComponent = fullComponent
    }

    deleteNodes(seq) {
        const factory = window.ComponentFactory
        if (this.field) {
            if (seq) {
                for (let index in this.field) {
                    const object = this.field[index]
                    if (object.seq === seq) {
                        factory.removeNodeBySeq(seq)
                        this.field.splice(index, 1)
                        break
                    }
                }
            } else {
                for (let object of this.field) {
                    factory.removeNodeBySeq(object.seq)
                }
            }
        }
    }

    buildingField(jsonObject) {
        if (!jsonObject) return false
        const factory = window.ComponentFactory
        const resultArray = []
        for (let node of jsonObject.nodes) {
            const field = factory.create(`__field`, node.value, node.text, factory.getMainTable(), factory.getProcessDetail())
            field.queryData = this
            resultArray.push(field)
        }
        return resultArray
    }

    assignNode(object, session, parentComponent) {
        const factory = window.ComponentFactory
        if (object._name) this.name = object._name
        if (object._where) this.where = object._where
        if (object._description) this.description = object._description
        if (parentComponent) this.field = parentComponent.field
        if (this.field[0]) {
            const data = this.field[0].findSession(session)
            const dataParent = data.parent
            const continueArray = []
            this.field.forEach(fieldObject => {
                for (let node of dataParent.nodes) {
                    if (node.value === fieldObject.name) {
                        continueArray.push(node.value)
                        break
                    }
                }
            })
            dataParent.nodes.forEach(node => {
                if (continueArray.includes(node.value)) return false
                const field = factory.create(`__field`, node.value, node.text, factory.getMainTable(), factory.getProcessDetail())
                this.field.push(field)
            })
            this.field.forEach(fieldObject => fieldObject.queryData = this)
        }
        this.generateContainer()
    }

    bindingTableAction(tail) {
        for (let node in tail) {
            if (!Array.isArray(tail[node])) continue
            if (tail[node].length === 0) continue
            for (let data of tail[node]) {
                if (data.name === this.name) {
                    data.resultTable = this
                    data.generateContainer()
                    break
                }
            }
        }
    }
}