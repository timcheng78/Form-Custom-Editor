import { XMLComponent } from './xml-component.js'

export class NewData extends XMLComponent {
    constructor(name, test) {
        super()
        /** 名稱 */
        this.name = name
        /** if 條件成立進行 (String) */
        this.test = test
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
                                                        "onchange": this.valueChanged.bind(this)
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
                                "class": "test-block row",
                                "children": [
                                    {
                                        "label": {
                                            "class": "col-sm-2 col-form-label",
                                            "for": "test",
                                            "text": "新增條件(test)"
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
                                                        "name": "test",
                                                        "id": "test",
                                                        "value": "",
                                                        "onchange": this.valueChanged.bind(this)
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
                                "class": "result-table-block",
                                "children": []
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

    set resultTable(resultTable) {
        this._resultTable = resultTable
    }

    get resultTable() {
        return this._resultTable
    }

    generateContainer() {
        const fullComponent = this.structure.createElemental()
        fullComponent.forEach(element => {
            const nameInput = element.querySelector('#name')
            const test = element.querySelector('#test')
            const resultBlock = element.querySelector('.result-table-block')
            if (this.seq) element.dataset.seq = this.seq
            if (nameInput && this.name) nameInput.value = this.name
            if (test && this.test) test.value = this.test
            if (resultBlock && this.resultTable) resultBlock.appendChild(this.resultTable.fullComponent[0])
        })
        this.fullComponent = fullComponent
    }

    valueChanged(e) {
        console.log(e)
        switch (e.target.name) {
            case 'name':
                this.name = e.target.value
                const resultTable = this.resultTable
                resultTable.name = this.name
                const resultTableNameInput = resultTable.fullComponent[0].querySelector('#name')
                if (resultTableNameInput) resultTableNameInput.value = this.name
                break
            default:
                this[e.target.name] = e.target.value
                break
        }
    }
    
    deleteNodes() {
        const factory = window.ComponentFactory
        if (this.resultTable) {
            this.resultTable.deleteNodes()
            factory.removeNodeBySeq(this.resultTable.seq)
        }
    }

    assignNode(object, session, parentComponent) {
        if (object._name) this.name = object._name
        if (object.test) this.test = object.test
        this.generateContainer()
    }
}