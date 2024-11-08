import { XMLComponent } from './xml-component.js'

export class Field extends XMLComponent {
    constructor(name, title, mainFile, subFile) {
        super()
        /** 名稱 */
        this.name = name
        this.title = title
        /** 主表查詢欄位 (MainFile) */
        this.mainFile = mainFile
        /** 次表欄位 (ProcessDetail)*/
        this.subFile = subFile
        this.structure = [
            {
                "div": {
                    "class": "d-flex flex-column col-12",
                    "data-seq": "",
                    "children": [
                        {
                            "div": {
                                "class": "attribute-block form-group row",
                                "children": [
                                    {
                                        "div": {
                                            "class": "col-sm-2",
                                            "children": [
                                                {
                                                    "input": {
                                                        "class": "form-control",
                                                        "name": "name",
                                                        "id": "name",
                                                        "placeholder": "名稱(NAME)"
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        "div": {
                                            "class": "col-sm-2",
                                            "children": [
                                                {
                                                    "input": {
                                                        "class": "form-control",
                                                        "name": "description",
                                                        "id": "description",
                                                        "disabled": "disabled"
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        "div": {
                                            "class": "col-sm-4 row",
                                            "children": [
                                                {
                                                    "select": {
                                                        "class": "form-control select-default col-sm-5",
                                                        "name": "typeSelect",
                                                        "id": "typeSelect",
                                                        "onchange": this.valueChanged.bind(this),
                                                        "children": [
                                                            {
                                                                'option': {
                                                                    'value': '0',
                                                                    'text': '請選擇'
                                                                }
                                                            },
                                                            {
                                                                'option': {
                                                                    'value': 'local',
                                                                    'text': '網頁暫存'
                                                                }
                                                            },
                                                            {
                                                                'option': {
                                                                    'value': 'fixed',
                                                                    'text': '固定值'
                                                                }
                                                            },
                                                            {
                                                                'option': {
                                                                    'value': 'gFormData',
                                                                    'text': '表單來源'
                                                                }
                                                            },
                                                            {
                                                                'option': {
                                                                    'class': 'main-file',
                                                                    'value': 'mainFile',
                                                                    'text': '主表欄位'
                                                                }
                                                            },
                                                            {
                                                                'option': {
                                                                    'class': 'sub-file',
                                                                    'value': 'subFile',
                                                                    'text': '次表欄位'
                                                                }
                                                            },
                                                            {
                                                                'option': {
                                                                    'class': 'none-view',
                                                                    'value': 'noneView',
                                                                    'text': '不使用參數'
                                                                }
                                                            }
                                                        ]
                                                    }
                                                },
                                                {
                                                    "select": {
                                                        "class": "form-control select-default select-type local hide col-sm-7",
                                                        "name": "local",
                                                        "id": "local",
                                                        "onchange": this.valueChanged.bind(this),
                                                        "children": [
                                                            {
                                                                'option': {
                                                                    'value': '0',
                                                                    'text': '請選擇'
                                                                }
                                                            },
                                                            {
                                                                'option': {
                                                                    'value': 'PHISTNUM',
                                                                    'text': '病歷號 (PHISTNUM)',
                                                                    'data-description': '病歷號'
                                                                }
                                                            },
                                                            {
                                                                'option': {
                                                                    'value': 'PCASENO',
                                                                    'text': '住院號 (PCASENO)',
                                                                    'data-description': '住院號'
                                                                }
                                                            }
                                                        ]
                                                    }
                                                },
                                                {
                                                    "input": {
                                                        "class": "form-control select-type fixed hide col-sm-6",
                                                        "type": "text",
                                                        "name": "fixed",
                                                        "id": "fixed",
                                                        "value": "",
                                                        "onchange": this.valueChanged.bind(this)
                                                    }
                                                },
                                                {
                                                    "select": {
                                                        "class": "form-control select-default select-type gFormData hide col-sm-6",
                                                        "name": "gFormData",
                                                        "id": "gFormData",
                                                        "onchange": this.valueChanged.bind(this),
                                                        "children": [
                                                            {
                                                                'option': {
                                                                    'value': '0',
                                                                    'text': '請選擇'
                                                                }
                                                            },
                                                            {
                                                                'option': {
                                                                    'value': 'fdocId',
                                                                    'text': '表單主鍵 (fdocId)',
                                                                    'data-description': '表單主鍵'
                                                                }
                                                            },
                                                            {
                                                                'option': {
                                                                    'value': 'sourceId',
                                                                    'text': '表單來源 (sourceId)',
                                                                    'data-description': '表單來源'
                                                                }
                                                            },
                                                            {
                                                                'option': {
                                                                    'value': 'formId',
                                                                    'text': '表單編號 (formId)',
                                                                    'data-description': '表單編號'
                                                                }
                                                            },
                                                            {
                                                                'option': {
                                                                    'value': 'formType',
                                                                    'text': '表單名稱 (formType)',
                                                                    'data-description': '表單名稱'
                                                                }
                                                            }
                                                        ]
                                                    }
                                                },
                                                {
                                                    "select": {
                                                        "class": "form-control select-default select-type mainFile hide col-sm-6",
                                                        "name": "mainFile",
                                                        "id": "mainFile",
                                                        "onchange": this.valueChanged.bind(this),
                                                        "children": []
                                                    }
                                                },
                                                {
                                                    "select": {
                                                        "class": "form-control select-default select-type subFile hide col-sm-6",
                                                        "name": "subFile",
                                                        "id": "subFile",
                                                        "onchange": this.valueChanged.bind(this),
                                                        "children": []
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        "div": {
                                            "class": "col-sm-3",
                                            "children": [
                                                {
                                                    "input": {
                                                        "class": "form-control",
                                                        "type": "text",
                                                        "name": "fieldValue",
                                                        "id": "fieldValue",
                                                        "value": "fillEmp(PHISTNUM, 10)",
                                                        "onchange": this.valueChanged.bind(this)
                                                    }
                                                },
                                            ]
                                        }
                                    },
                                    {
                                        "div": {
                                            "class": "col-sm-1",
                                            "children": [
                                                {
                                                    "button": {
                                                        "class": "btn btn-danger",
                                                        "type": "button",
                                                        "name": "delete-field-button",
                                                        "onclick": this.deleteField.bind(this),
                                                        "children": [
                                                            {
                                                                "i": {
                                                                    "class": "bi bi-trash"
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

    set title(title) {
        this._title = title
    }

    get title() {
        return this._title
    }

    set queryData(queryData) {
        this._queryData = queryData
    }

    get queryData() {
        return this._queryData
    }

    set type(type) {
        this._type = type
    }

    get type() {
        return this._type
    }

    set mainFile(mainFile) {
        this._mainFile = mainFile
    }

    get mainFile() {
        return this._mainFile
    }

    set subFile(subFile) {
        this._subFile = subFile
    }

    get subFile() {
        return this._subFile
    }

    generateContainer() {
        const fullComponent = this.structure.createElemental()
        fullComponent.forEach(element => {
            const nameInput = element.querySelector('#name')
            const descriptionInput = element.querySelector('#description')
            const typeSelect = element.querySelector('#typeSelect')
            const fieldValue = element.querySelector('#fieldValue')
            const mainFile = element.querySelector('#mainFile')
            const subFile = element.querySelector('#subFile')
            if (this.name && nameInput) nameInput.value = this.name
            if (this.title && descriptionInput) descriptionInput.value = this.title
            if (this.seq) element.dataset.seq = this.seq
            if (this.type && this.name) {
                typeSelect.value = this.type
                const targetElement = element.querySelector(`.${ this.type }`)
                if (targetElement) targetElement.value = this.name
            }
            if (this.value) fieldValue.value = this.value
            if (this.mainFile && this.mainFile.mainTree) {
                const nodes = this.mainFile.mainTree.nodes
                const optionsArray = []
                const chooseOption = document.createElement('option')
                chooseOption.value = '0'
                chooseOption.textContent = '請選擇'
                optionsArray.push(chooseOption)
                for (let node of nodes) {
                    const text = node.text
                    const value = node.value
                    const option = document.createElement('option')
                    option.value = value
                    option.textContent = `${ text }(${ value })`
                    option.dataset.description = text
                    optionsArray.push(option)
                }
                mainFile.innerHTML = ''
                optionsArray.forEach(option => mainFile.appendChild(option))
            } else element.querySelector('.main-file').classList.add('hide')
            if (this.subFile) {
                const queryData = this.subFile.queryData
                const optionsArray = []
                const chooseOption = document.createElement('option')
                chooseOption.value = '0'
                chooseOption.textContent = '請選擇'
                optionsArray.push(chooseOption)
                for (let query of queryData) {
                    if (!query.data) continue
                    const nodes = query.data.nodes
                    const optionGroup = document.createElement('optgroup')
                    optionGroup.label = query.name
                    for (let node of nodes) {
                        const text = node.text
                        const value = node.value
                        const option = document.createElement('option')
                        option.dataset.group = query.name
                        option.value = value
                        option.textContent = `${ text }(${ value })`
                        option.dataset.description = text
                        optionGroup.appendChild(option)
                    }
                    optionsArray.push(optionGroup)
                }
                subFile.innerHTML = ''
                optionsArray.forEach(option => subFile.appendChild(option))
            } else element.querySelector('.sub-file').classList.add('hide')
            if (this.mainFile && this.subFile) fieldValue.value = ''
            if (this.fieldValue) fieldValue.value = this.fieldValue
        })
        this.fullComponent = fullComponent
    }

    valueChanged(e) {
        const attributeBlock = e.target.closest('.attribute-block')
        const dataTypeBlock = e.target.closest('[data-type]')
        switch (e.target.name) {
            case 'typeSelect':
                const allSelect = attributeBlock.querySelectorAll('.select-type')
                allSelect.forEach(select => select.classList.add('hide'))
                if (e.target.value !== '0') {
                    const targetInput = attributeBlock.querySelector(`.${ e.target.value }`)
                    if (targetInput) targetInput.classList.remove('hide')
                }
                this.type = e.target.value
                break
            case 'local':
            case 'fixed':
            case 'gFormData':
            case 'mainFile':
            case 'subFile':
                const nameInput = attributeBlock.querySelector('#name')
                const descriptionInput = attributeBlock.querySelector('#description')
                const option = e.target.querySelector(`option[value="${ e.target.value }"]`)
                if (dataTypeBlock && dataTypeBlock.dataset.type !== 'result') {
                    this.name = e.target.value
                    this.title = option.dataset.description || ''
                }
                nameInput.value = this.name
                descriptionInput.value = this.title || ''
                if (descriptionInput.value === '') descriptionInput.disabled = false
                const fieldValue = attributeBlock.querySelector('#fieldValue')
                fieldValue.value = e.target.value
                if (e.target.value === 'PHISTNUM' || e.target.value === 'PCASENO') {
                    fieldValue.value = `fillEmp(${ e.target.value }, 10)`
                }
                if (e.target.name === 'mainFile') {
                    fieldValue.value = `getMap(mainFile, "${ e.target.value }")`
                }
                if (e.target.name === 'subFile') {
                    const option = e.target.querySelector(`option[value="${ e.target.value }"]`)
                    fieldValue.value = `getListValue(resultMap, "${ option.dataset.group }", "${ e.target.value }")`
                }
                this.fieldValue = fieldValue.value
                break
            case 'fieldValue':
                this.fieldValue = e.target.value
                break
            case 'noneView':
                const filed = attributeBlock.querySelector('#fieldValue')
                this.fieldValue = ''
                filed.value = this.fieldValue
                break
            default:
                this[e.target.name] = e.target.value
                break
        }
    }

    deleteField(e) {
        this.fullComponent[0].remove()
        this.queryData.deleteNodes(this.seq)
    }

    assignNode(object, session, parentComponent) {
        const factory = window.ComponentFactory
        const mainFile = factory.getMainTable()
        const processDetail = factory.getProcessDetail()
        if (object._name) this.name = object._name
        if (object._title) this.title = object._title
        if (object.__text) this.fieldValue = object.__text
        if (mainFile) this.mainFile = mainFile
        if (processDetail) this.subFile = processDetail
        this.generateContainer()
    }
}