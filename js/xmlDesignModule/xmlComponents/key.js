import { XMLComponent } from './xml-component.js'

export class Key extends XMLComponent {
    constructor(level, name) {
        super()
        /** 階層 */
        this.level = level
        /** 名稱 */
        this.name = ''
        this.setNameSelect(name)
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
                                            "for": "level",
                                            "text": "Level"
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
                                                        "name": "level",
                                                        "id": "level",
                                                        "value": "1",
                                                        "onchange": super.valueChanged.bind(this)
                                                    }
                                                }
                                            ]
                                        }
                                    },
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
                                                    "select": {
                                                        "class": "form-control select-default",
                                                        "name": "name",
                                                        "id": "name",
                                                        "onchange": super.valueChanged.bind(this),
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
                }
            }
        ]
    }

    set name(name) {
        this._name = name
    }

    get name() {
        return this._name
    }

    set level(level) {
        this._level = level
    }

    get level() {
        return this._level
    }

    set columnOptions(columnOptions) {
        this._columnOptions = columnOptions
    }

    get columnOptions() {
        return this._columnOptions
    }

    generateContainer() {
        const fullComponent = this.structure.createElemental()
        fullComponent.forEach(element => {
            const nameSelect = element.querySelector('#name')
            const levelInput = element.querySelector('#level')
            if (this.seq) element.dataset.seq = this.seq
            if (nameSelect && this.columnOptions) {
                nameSelect.innerHTML = ''
                this.columnOptions.forEach(option => nameSelect.appendChild(option))
            }
            if (nameSelect && this.name) nameSelect.value = this.name
            if (levelInput && this.level) levelInput.value = this.level
        })
        this.fullComponent = fullComponent
    }

    setNameSelect(jsonObject) {
        if (!jsonObject || !jsonObject.nodes) return false
        const optionsArray = []
        const chooseOption = document.createElement('option')
        chooseOption.value = '0'
        chooseOption.textContent = '請選擇'
        optionsArray.push(chooseOption)
        for (let node of jsonObject.nodes) {
            const text = node.text
            const value = node.value
            const option = document.createElement('option')
            option.value = value
            option.textContent = `${ value }(${ text })`
            optionsArray.push(option)
        }
        this.columnOptions = optionsArray
        if (!this.fullComponent) return false
        const nameSelect = this.fullComponent[0].querySelector('#name')
        nameSelect.innerHTML = ''
        this.columnOptions.forEach(option => nameSelect.appendChild(option))
    }

    assignNode(object, session, parentComponent) {
        if (object._name) this.name = object._name
        if (object._level) this.level = object._level
        this.generateContainer()
    }
}