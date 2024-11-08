import { ATTRIBUTE_ZH_NAMES } from '../descriptionModule/utils-object.js'
import { ATTRIBUTE_NAMES } from '../descriptionModule/utils-object.js'
import { AttributeObject } from '../descriptionModule/attribute-object.js'

export class BaseComponent {

    constructor (className, draggable, name, bean, title, edit, isBean, dontDitto, required, controlType, show) {
        /** 一般屬性 */
        this.attribute              = { }
        /** 元件屬性 */
        this.dataset                = { }
        /** 類別屬性 */
        this.attribute.class        = className
        /** 可拖曳屬性 */
        this.attribute.draggable    = draggable
        /** 元件名稱 */
        this.dataset.name           = name
        /** 元件名稱 */
        this.dataset.bean           = bean
        /** 元件標題 */
        this.dataset.title          = title
        /** 元件編輯狀態 */
        this.dataset.edit           = edit
        /** 元件是否為元件 */
        this.dataset.isBean         = isBean
        /** 元件ditto */
        this.dataset.dontDitto      = dontDitto
        /** 元件必填 */
        this.dataset.required       = required
        /** 元件類型 */
        this.dataset.controlType    = controlType
        /** 元件顯示 */
        this.dataset.show           = show
        /** 元件列印標題 */
        this.dataset.printShowTitle = true
        /** 元件棄用狀態(true:棄用/false:啟用) */
        this.abandoned              = false
        /** 元件預設敘述 */
        this.HTMLDescription        = {
            'label': {
                'class': 'h6',
                'text': `${ title }(${ name })`
            }
        }
        /** 基礎屬性 */
        this.attributes = [
            ATTRIBUTE_NAMES.EXTERNAL_NAME,
            ATTRIBUTE_NAMES.NAME, 
            ATTRIBUTE_NAMES.TITLE, 
            ATTRIBUTE_NAMES.SHOW
        ]
        /** 列印屬性 */
        this.printAttributes = [
            ATTRIBUTE_NAMES.PRINT_SHOW_TITLE
        ]
    }

    // =============== getter and setter start ===============

    /** 設定元件預設呈現結構 */
    set HTMLDescription(HTMLDescription) {
        this._HTMLDescription = HTMLDescription
    }

    /** 取得元件預設呈現結構 */
    get HTMLDescription() {
        return this._HTMLDescription
    }

    /** 設定元件呈現元素 */
    set componentElement(componentElement) {
        this._componentElement = componentElement
    }

    /** 取得元件呈現元素 */
    get componentElement() {
        return this._componentElement
    }

    /** 設定容器 */
    set container(container) {
        this._container = container
    }

    /** 取得容器 */
    get container() {
        return this._container
    }

    /** 設定元件完整結構元素 */
    set fullComponent(fullComponent) {
        this._fullComponent = fullComponent
    } 

    /** 取得元件完整結構元素 */
    get fullComponent() {
        return this._fullComponent
    }

    /** 設定元件完整清單結構 */
    set listComponent(listComponent) {
        this._listComponent = listComponent
    }

    /** 取得元件完整清單結構 */
    get listComponent() {
        return this._listComponent
    }

    /** 設定元件完整列印結構 */
    set printComponent(printComponent) {
        this._printComponent = printComponent
    }

    /** 取得元件完整列印結構 */
    get printComponent() {
        return this._printComponent
    }

    /** 設定元件結構 */
    set structure(structure) {
        this._structure = structure
    }

    /** 取得元件結構 */
    get structure() {
        return this._structure
    }

    /** 設定屬性 */
    set attributes(attributes) {
        this._attributes = attributes
    }

    /** 取得屬性 */
    get attributes() {
        return this._attributes
    }

    /** 設定列印屬性 */
    set printAttributes(printAttributes) {
        this._printAttributes = printAttributes
    }

    /** 設定列印屬性 */
    get printAttributes() {
        return this._printAttributes
    }

    /** 設定樹狀結構 */
    set treeStructure(treeStructure) {
        this._treeStructure = treeStructure
    }

    /** 取得樹狀結構 */
    get treeStructure() {
        return this._treeStructure
    }

    /** 設定屬性模組 */
    set attributesModules(modules) {
        this._attributesModules = modules
    }

    /** 取得屬性模組 */
    get attributesModules() {
        return this._attributesModules
    }

    /** 設定屬性模組 */
    set listAttributeModules(modules) {
        this._listAttributeModules = modules
    }

    /** 取得屬性模組 */
    get listAttributeModules() {
        return this._listAttributeModules
    }

    /** 設定屬性模組 */
    set printAttributeModules(modules) {
        this._printAttributeModules = modules
    }

    /** 取得屬性模組 */
    get printAttributeModules() {
        return this._printAttributeModules
    }

    /** 設定棄用狀態 */
    set abandoned(abandoned) {
        this._abandoned = abandoned
    }

    /** 取得棄用狀態 */
    get abandoned() {
        return this._abandoned
    }

    /** 設定元件序號 */
    set seq(seq) {
        this._seq = seq
        this.dataset.seq = seq
        this.generateShell()
        this.generateComponent()
    }

    /** 取得元件序號 */
    get seq() {
        return this._seq
    }

    /** 設定工具專屬名稱 */
    set tId(tId) {
        this.dataset.tId = tId
    }

    /** 取得工具專屬名稱 */
    get tId() {
        return this.dataset.tId
    }
    
    /** 設定內部名稱 */
    set externalName(externalName) {
        this.dataset.externalName = externalName
    }

    /** 取得內部名稱 */
    get externalName() {
        return this.dataset.externalName
    }

    /** 設定匯出結構 */
    set versionStructure(versionStructure) {
        this._versionStructure = versionStructure
    }

    /** 取得匯出結構 */
    get versionStructure() {
        return this._versionStructure
    }

    /** 取得選項標題陣列 */
    get uiDesc() {
        if (typeof this.dataset.uiDesc === 'string') return this.dataset.uiDesc.split(',')
        else return `${ this.dataset.uiDesc }`.split(',')
    }

    /** 取得選項值陣列 */
    get uiValue() {
        if (typeof this.dataset.uiValue === 'string') return this.dataset.uiValue.split(',')
        else return `${ this.dataset.uiValue }`.split(',')
    }

    /** 取得選項分數陣列 */
    get uiScore() {
        if (this.dataset.uiScore === undefined) return null
        if (typeof this.dataset.uiScore === 'string') return this.dataset.uiScore.split(',')
        else return `${ this.dataset.uiScore }`.split(',')
    }
    
    /** 取得選取陣列 */
    get checked() {
        if (this.dataset.checked === undefined) return null
        if (typeof this.dataset.checked === 'string') return this.dataset.checked.split(',')
        else return `${ this.dataset.checked }`.split(',')
    }

    /** 取得控制類型 */
    get controlType() {
        return this.dataset.controlType
    }

    /** GUID */
    get controllerGuid() {
        return this.dataset.controllerGuid
    }

    /** GUID */
    set controllerGuid(controllerGuid) {
        this.dataset.controllerGuid = controllerGuid
    }

    // =============== getter and setter end ===============

    // =============== functions start ===============

    /**
     * 初始化元件設定並製做殼及元件
     */
    init() {
        if (!this.HTMLDescription) {
            this.HTMLDescription = {
                'label': {
                    'class': 'description-text'
                }
            }
        }
        this.generateShell()
        this.generateComponent()
    }

    /**
     * 製作外殼
     * @returns {Element[]} container
     */
    generateShell() {
        /** 屬性容器 */
        const attributeObject = {}
        // 將所有目前模組內全部屬性遍歷
        for (let attribute in this) {
            // 針對 attribute 與 dataset 進行數據綁定
            switch (attribute) {
                case 'attribute':
                case 'dataset':
                    for (let dataAttribute in this[attribute]) {
                        let datasetData = this[attribute][dataAttribute]
                        if (attribute === 'attribute') {
                            attributeObject[dataAttribute.replace(/([A-Z])/g, "-$1").toLowerCase()] = datasetData
                            if (this.container) {
                                this.container.forEach(element => {
                                    if (!(element instanceof Element)) return false
                                    if (dataAttribute === 'class' && element.classList.contains('selected')) datasetData += ' selected'
                                    if (element.classList.contains('pFormItem') || element.classList.contains('pFormItemGroup')) element.setAttribute(dataAttribute.replace(/([A-Z])/g, "-$1").toLowerCase(), datasetData)
                                })
                            }
                        } else if (attribute === 'dataset') {
                            attributeObject[`data-${ dataAttribute.replace(/([A-Z])/g, "-$1").toLowerCase() }`] = datasetData
                            if (this.container) {
                                this.container.forEach(element => {
                                    if (!(element instanceof Element)) return false
                                    if (element.classList.contains('pFormItem') || element.classList.contains('pFormItemGroup')) {
                                        if (datasetData) element.dataset[dataAttribute] = datasetData
                                        else delete element.dataset[dataAttribute]
                                    }
                                })
                            }
                        }
                    }
                    break
            }            
        }
        /**
         * 幾種情況需要重新製作外殼
         * 1. 殼原本就是空的
         * 2. 空陣列
         * 3. 空物件陣列
         */
        if (!this.container || 
            (Array.isArray(this.container) && this.container.length === 0) || 
            (Array.isArray(this.container) && this.container.length > 0 && !(this.container[0] instanceof Element))
        ) this.container = CreateUtils.createBeanElement({controlType: 'div', attribute: [attributeObject]})
        return this.container
    }
    
    /**
     * 製作元件前處理
     * 若有客製化需要
     * 繼承後修改即可
     * @returns 
     */
    generateBeforeChanged() {
        return true
    }

    /**
     * 製作元件後處理
     * 若有客製化需要
     * 繼承後修改即可
     * @returns 
     */
    generateAfterChanged() {
        return true
    }

    /**
     * 初次製作元件
     * @returns {Element} 
     */
    generateComponent() {
        if (!this.container) this.generateShell()
        this.generateBeforeChanged()
        const HTMLElement           = this.HTMLDescription.createElemental()
        this.componentElement       = HTMLElement
        try {
            this.container.forEach(element => {
                if (element.classList.contains('pFormItem')) {
                    element.innerHTML   = ''
                    HTMLElement.forEach(innerElement => {
                        element.appendChild(innerElement)
                    })
                    this.fullComponent  = element
                    throw { } // break
                }
            })
            if (!this.fullComponent) this.fullComponent = this.componentElement[0]
        } catch (e) { }
        this.generateAfterChanged() 
        this.generateListComponent()
        this.generatePrintComponent()
        return this.fullComponent
    }

    /** 
     * 製作清單元件
     * =
     * 若需客製化清單元件結構
     * 可利用 listHTMLDescription 進行修改
     */
    generateListComponent() {
        if (!this.container) this.generateShell()
        this.listHTMLDescription = {
            'label': {
                'class': 'h6',
                'text': `${ this.dataset.title }(${ this.externalName })`
            }
        }
        const listContainer     = this.container[0].cloneNode(true)
        listContainer.classList.remove('selected')
        listContainer.innerHTML = ''
        listContainer.append(this.listHTMLDescription.createElemental()[0])
        this.listComponent = listContainer
    }

    /**
     * 製作列印元件
     * =
     * 若需客製化清單元件結構
     * 可利用 printHTMLDescription 進行修改
     */
    generatePrintComponent() {
        if (!this.container) this.generateShell()
        this.printHTMLDescription = {
            'label': {
                'class': 'h6',
                'text': `${ this.dataset.title }(${ this.externalName })`
            }
        }
        const printContainer = this.container[0].cloneNode(true)
        printContainer.classList.remove('selected', 'form-group')
        printContainer.classList.add('form-row-div')
        printContainer.innerHTML = ''
        printContainer.append(this.printHTMLDescription.createElemental()[0])
        if (this.printComponent && this.printComponent instanceof Element) {
            this.printComponent.innerHTML = ''
            for (let dataName in printContainer.dataset) {
                this.printComponent.dataset[dataName] = printContainer.dataset[dataName]
            }
            this.printComponent.appendChild(this.printHTMLDescription.createElemental()[0])
        } else this.printComponent = printContainer
    }

    /**
     * 製作屬性列
     * =
     * 依照屬性物件相關規則進行製作
     * 
     * @param {AttributeObject[]} objectArguments
     * @return {Element}
     */
    generateAttributeRow(objectArguments, type = '') {
        const attributesModuleArray = {}
        for (let objectArgument of objectArguments) {
            /** 屬性標題元素 */
            const titleRow              = objectArgument.titleNode
            /** 屬性項目元素 */
            const descRow               = objectArgument.contentNode
            /** 屬性名稱 */
            const attributeName         = objectArgument.attributeName
            /** 屬性標題 */
            const zhAttributeName       = objectArgument.zhAttributeName
            /** 屬性類別 */
            const attributeType         = objectArgument.type
            /** 屬性預設值 */
            const defaultValue          = objectArgument.defaultValue
            titleRow.textContent        = zhAttributeName
            descRow.dataset.attribute   = attributeName
            switch (attributeType) {
                case 'text':
                    if (attributeName !== 'name') descRow.classList.add('canEditDiv')
                    descRow.innerHTML = defaultValue || '請點擊兩下進行編輯'
                    break
                case 'select':
                    const selectDescArray   = objectArgument.optionDescription
                    const selectValueArray  = objectArgument.optionValue
                    const selectElement     = {
                        'select': {
                            'class':    'form-control',
                            'name':     attributeName,
                            'id':       attributeName,
                            'onchange': this.settingDataAttribute.bind(this)
                        }
                    }.createElemental()[0]
                    if (selectDescArray && selectValueArray) {
                        let len = selectDescArray.length > selectValueArray.length ? selectDescArray.length : selectValueArray.length
                        for (let i = 0; i < len; ++i) {
                            const optionElement = {
                                'option': {
                                    'text':     selectDescArray[i] || selectValueArray[i],
                                    'value':    selectValueArray[i] || selectDescArray[i],
                                    'selected': defaultValue === selectValueArray[i] ? 'selected' : undefined
                                }
                            }.createElemental()[0]
                            selectElement.appendChild(optionElement)
                        }
                    } 
                    descRow.appendChild(selectElement)
                    break
                case 'radio':
                case 'checkbox':
                case 'imageRadio':
                    const optionDescArray   = objectArgument.optionDescription
                    const optionValueArray  = objectArgument.optionValue
                    const inputContainer = {
                        'div': {
                            'class': 'form-row'
                        }
                    }.createElemental()[0]
                    if (optionDescArray && optionValueArray) {
                        let len = optionDescArray.length > optionValueArray.length ? optionDescArray.length : optionValueArray.length
                        for (let i = 0; i < len; ++i) {
                            let checkedBoolean = false
                            let checkInputClassName = `form-check-input ${ attributeType.replace('image', '').toLowerCase() }-default`
                            if (attributeType === 'imageRadio') checkInputClassName += ` image-radio ${ optionDescArray[i] }`
                            if (attributeType === 'checkbox' && defaultValue.indexOf(',') > -1) {
                                const checkValueArray = defaultValue.split(',')
                                checkedBoolean = checkValueArray.includes(optionValueArray[i])
                            } else checkedBoolean = defaultValue ? (defaultValue === optionValueArray[i] ? true : false ) : false
                            const inputElement = {
                                'div': {
                                    'class': 'form-check d-flex align-items-center form-check-inline',
                                    'children': [
                                        {
                                            'input': {
                                                'type':     attributeType.replace('image', '').toLowerCase(),
                                                'class':    checkInputClassName,
                                                'value':    optionValueArray[i] || optionDescArray[i],
                                                'name':     attributeName,
                                                'id':       `${ attributeName }_${ i }`,
                                                'checked': 	checkedBoolean ? 'checked' : null, 
                                                'onclick':  this.settingDataAttribute.bind(this)
                                            }
                                        },
                                        {
                                            'label': {
                                                'class':    'form-check-label',
                                                'for':      `${ attributeName }_${ i }`,
                                                'text':     optionDescArray[i] || optionValueArray[i]
                                            }
                                        }
                                    ]
                                }
                            }.createElemental()[0]
                            if (attributeType === 'imageRadio') inputElement.querySelector('label').remove()
                            inputContainer.appendChild(inputElement)
                        }
                    }
                    descRow.appendChild(inputContainer)
                    break
                case 'range':
                    const minNumber = objectArgument.minNumber || 0
                    const maxNumber = objectArgument.maxNumber || 50
                    const newVal    = Number((((defaultValue || 25) - minNumber) * 100) / (maxNumber - minNumber))
                    const rangeElement = {
                        'input': {
                            'type':     'range',
                            'class':    'form-control-range',
                            'name':     attributeName,
                            'min':      minNumber,
                            'max':      maxNumber,
                            'value':    defaultValue || 25,
                            'oninput':  this.settingDataAttribute.bind(this),
                            'oncontextmenu': function (e) {
                                e.preventDefault()
                                console.log(this)
                                delete this.dataset.width
                                e.target.value = 25
                                e.target.nextElementSibling.style.left = `${ Number(((25 - minNumber) * 100) / (maxNumber - minNumber)) }%`
                                e.target.nextElementSibling.textContent = `250`
                            }.bind(this)
                        }
                    }.createElemental()[0]
                    const bubbleElement = {
                        'output': {
                            'class': 'range-bubble',
                            'style': `left: ${ newVal }%`
                        }
                    }.createElemental()[0]
                    bubbleElement.textContent = (defaultValue || 25) <= 50 ? (defaultValue || 25) * 10 : (defaultValue || 25)
                    descRow.appendChild(rangeElement)
                    descRow.appendChild(bubbleElement)
                    break
                case 'custom':
                    if (objectArgument.HTMLDescription) {
                        const customElement = objectArgument.HTMLDescription.createElemental()
                        customElement.forEach(element => descRow.appendChild(element))
                    }
                    break
            }
            const container = {
                'div': {
                    'class':    'col-12 row attribute-row-line no-padding',
                    'name':     attributeName
                }
            }.createElemental()[0]
            container.append(titleRow, descRow)
            attributesModuleArray[attributeName] = container
        }
        switch (type) {
            case 'list':
                this.listAttributeModules = attributesModuleArray
                break
            case 'print':
                this.printAttributeModules = attributesModuleArray
                break
            default:
                this.attributesModules = attributesModuleArray
                break
        }
        return attributesModuleArray
    }

    /**
     * 屬性列非雙擊編輯事件綁定
     * @param {Event} e 
     */
    settingDataAttribute(e) {
        /** 目前選取的元件 */
        this.attributeDataSelected(e.target)
        beanToListEvent()
    }

    /**
     * 創建元件物件(若需客製繼承修改即可)
     * @param {Class} componentClass 
     * @returns 
     */
    createCustomComponent(componentClass) {
        const timeStamp = CreateUtils.createRandomCode()
        return new componentClass(`${ this.dataset.name }_clone_${ timeStamp }`, `${ this.dataset.bean }_clone_${ timeStamp }`, this.dataset.title)
    }

    /**
     * 克隆元件(若需客製繼承修改即可)
     */
    cloneComponent() {
        /** 引入工廠 */
        const factory = window.ComponentFactory 
        for (let type in factory.baseComponent) {
            if (this instanceof factory.baseComponent[type]) {
                const component = this.createCustomComponent(factory.baseComponent[type])
                component.attribute = this.attribute.deepClone()
                for (let data in this.dataset) {
                    if (data === 'bean' || data === 'name') continue
                    if (typeof this.dataset[data] !== 'object')
                        component.dataset[data] = this.dataset[data]
                    else if (typeof this.dataset[data] === 'object')
                        component.dataset[data] = this.dataset[data].deepClone()
                }
                component.seq = ++factory.seq
                component.structure = this.structure
                component.structureExtraction()
                factory.setRegisterComponent(component)
                return component
            }
        }
    }

    /**
     * 結構萃取
     * =
     * 取得結構內非元件類的元素(標題)
     * 若須依照元件客製
     * 繼承修改即可
     */
    structureExtraction() {
        if (!this.structure) return false
        if (this.dataset.controlType === 'group') return false
        const element       = this.structure.createElemental()[0]
        const internal      = SharedUtils.onionStringDecode(element.dataset.structure)
        if (!internal) return false
        const beans         = internal.createElemental()
        let before          = true
        beans.forEach(bean => {
            if (bean.tagName.toLowerCase() === 'label' && bean.classList.contains('h6') && bean.classList.contains('canEditDiv')) {
                if (before) this.fullComponent.prepend(bean)
                else this.fullComponent.appendChild(bean)
            } else before = false
        })
    }

    /**
     * 設計屬性列標題及參數
     */
    modifyAttribute() {
        /** 屬性物件存放陣列 */
        const attrObjectArr = []
        /** 列印屬性物件存放陣列 */
        const printAttrObjectArr = []
        /** 各屬性自訂區域 */
        for (let attributeName of this.attributes) {
            /** 屬性標題 */
            const zhName        = ATTRIBUTE_ZH_NAMES[attributeName]
            /** 實際屬性資料 */
            let actualValue     = this.dataset[attributeName]
            if (actualValue === undefined) actualValue = ''
            // 預設文字輸入屬性
            this.buildAttributeObject(attrObjectArr, attributeName, zhName, `${ actualValue }`)
            // 屬性改變元件呈現方式
            if (this.componentElement) this.componentAttributeChanged(attributeName, `${ actualValue }`)
        }
        /** 列印各屬性自訂區域 */
        for (let attributeName of this.printAttributes) {
            /** 屬性標題 */
            const zhName        = ATTRIBUTE_ZH_NAMES[attributeName]
            /** 實際屬性資料 */
            let actualValue     = this.dataset[attributeName]
            if (actualValue === undefined) actualValue = ''
            // 預設文字輸入屬性
            this.buildAttributeObject(printAttrObjectArr, attributeName, zhName, `${ actualValue }`)
            // 屬性改變元件呈現方式
            if (this.componentElement) this.componentAttributeChanged(attributeName, `${ actualValue }`)
        }
        this.generateShell()
        this.generateListComponent()
        this.generatePrintComponent()
        this.generateAttributeRow(attrObjectArr)
        this.generateAttributeRow(printAttrObjectArr, 'print')
    }

    /** 
     * 檢查任何需要再製作結構前的函數
     * 若需要客製化繼承修改即可
     */
    checkingByItself() {
        // 檢查是否存在在表單上
        if (!this.fullComponent.closest('html') && !this.printComponent.closest('html')) this.abandoned = true
        else this.abandoned = false
        // 檢查父層是否還存在
        if (this.dataset.parent && !this.fullComponent.closest(`div[data-name="${ this.dataset.parent }"]`)) this.dataset.parent = undefined
        if (this.dataset.treeParent && !this.fullComponent.closest(`div[data-name="${ this.dataset.treeParent }"]`)) this.dataset.treeParent = undefined
        return true
    }

    /**
     * 建立層級結構
     * =
     * 用於載入表單建構元件結構
     */
    buildLevelStructure() {
        /** 引入工廠 */
        const factory = window.ComponentFactory
        if (this.horizontalFormItem) {
            for (let i = 0, len = this.horizontalFormItem.length; i < len; ++i) {
                const itemArray = this.horizontalFormItem[i].split(',')
                for (let item of itemArray) {
                    const childComponent = factory.getRegisterComponentByName(item)
                    if (!childComponent) continue
                    childComponent.buildLevelStructure()
                    if (this.componentElement[i].querySelector(`.pFormItem[data-name="${ childComponent.dataset.name }"], .pFormItemGroup[data-name="${ childComponent.dataset.name }"]`))
                        this.componentElement[i].querySelector(`.pFormItem[data-name="${ childComponent.dataset.name }"], .pFormItemGroup[data-name="${ childComponent.dataset.name }"]`).replaceWith(childComponent.fullComponent)
                    else this.componentElement[i].appendChild(childComponent.fullComponent)
                }
            }
        }
        if (this.treeChildren) {
            for (let child of this.treeChildren) {
                const childComponent = factory.getRegisterComponentByName(child)
                if (!childComponent) continue
                childComponent.buildLevelStructure()
                if (this.fullComponent.querySelector(`.pFormItem[data-name="${ childComponent.dataset.name }"], .pFormItemGroup[data-name="${ childComponent.dataset.name }"]`))
                    this.fullComponent.querySelector(`.pFormItem[data-name="${ childComponent.dataset.name }"], .pFormItemGroup[data-name="${ childComponent.dataset.name }"]`).replaceWith(childComponent.fullComponent)
                else if (this.controlType !== 'group') this.fullComponent.appendChild(childComponent.fullComponent)
                else this.generateComponent()
            }
        }
    }

    /**
     * 建立結構
     */
    buildStructure() {
        this.checkingByItself()
        this.modifyAttribute()
        this.structure = this.fullComponent.convertToJson()
    }

    /** 建立樹狀結構物件 */
    buildTreeObject() {
        /** 引入工廠 */
        const factory = window.ComponentFactory
        /** 樹狀結構物件創建 */
        const treeObject = factory.createTreeObject(
            this.dataset.title, 
            this.dataset.controlType, 
            this.dataset.name, 
            [],
            false, 
            isAddPage() ? this.abandoned : true, 
            'beanBtnSelected(this)',
        )
        treeObject.seq = this.seq
        if (this.horizontalFormItem) {
            for (let items of this.horizontalFormItem) {
                const itemArray = items.split(',')
                for (let item of itemArray) {
                    const childComponent = factory.getRegisterComponentByName(item)
                    if (!childComponent) continue
                    treeObject.nodes.push(childComponent.buildTreeObject())
                }
            }
        }
        if (this.treeChildren) {
            for (let child of this.treeChildren) {
                const childComponent = factory.getRegisterComponentByName(child)
                if (!childComponent) continue
                treeObject.nodes.push(childComponent.buildTreeObject())
            }
        }
        this.treeStructure = treeObject
        return treeObject
    }

    /**
     * 建立屬性物件陣列
     * =
     * 依照屬性名稱及標題
     * 若有預設值將值也一併帶出
     * 若需要客製化
     * 繼承後進行修改該函數
     * @param {Object[]} attrObjectArray 
     * @param {String} attributeName 
     * @param {String} zhName 
     * @param {String} actualValue 
     */
    buildAttributeObject(attrObjectArray, attributeName, zhName, actualValue) {
        switch (attributeName) {
            case ATTRIBUTE_NAMES.DONT_DITTO:
            case ATTRIBUTE_NAMES.REQUIRED:
            case ATTRIBUTE_NAMES.SHOW:
            case ATTRIBUTE_NAMES.PRINT_SHOW_TITLE:
                // 單選框模式選擇屬性
                const optionAttributeObject             = new AttributeObject(attributeName, zhName, 'radio', actualValue)
                optionAttributeObject.optionDescription = ["是", "否"]
                optionAttributeObject.optionValue       = ["true", "false"]
                if (attributeName === ATTRIBUTE_NAMES.DONT_DITTO) optionAttributeObject.optionValue = ["false", "true"]
                attrObjectArray.push(optionAttributeObject)
                break
            case ATTRIBUTE_NAMES.OPTION_EDIT:
                // 客製化模式選擇屬性
                const buttonNode = {
                    'button': {
                        'class':    'btn btn-primary',
                        'name':     attributeName,
                        'id':       attributeName,
                        'text':     '調整選項',
                        'onclick':  this.adjustOptions.bind(this)
                    }
                }
                attrObjectArray.push(new AttributeObject(attributeName, zhName, 'custom', actualValue, buttonNode))
                break
            default:
                // 預設文字輸入屬性
                attrObjectArray.push(new AttributeObject(attributeName, zhName, 'text', actualValue))
                break
        }
    }

    /**
     * 依照屬性改變元件呈現
     * @param {String} attributeName 
     * @param {String} zhName 
     * @param {String} actualValue 
     */
    componentAttributeChanged(attributeName, actualValue) {
        switch (attributeName) {
            /** 元件後方標題(預設放入第一個位置後方) */
			case ATTRIBUTE_NAMES.BACK_TITLE:
                const labelComponent = {
                    'label': {
                        'class':        'h6 canEditDiv',
                        'draggable':    'true',
                        'data-edit':    'true',
                        'text':         actualValue
                    }
                }.createElemental()[0]
                this.componentElement[0].appendChild(labelComponent)
                break
        }
    }

    /**
     * 編輯框事件結束尚未賦值前觸發
     * =
     * 需要插入特定判斷請繼承並客製
     * @param {String} attributeName 
     * @param {String} attributeValue 
     */
    boxEditBeforeChanged(attributeName, attributeValue) {
        return true
    }

    /**
     * 編輯框事件結束賦值後觸發
     * =
     * 客製化函數引入 editingAfter 繼承修改即可
     * 製作屬性列
     * @param {String} attributeName 
     * @param {String} attributeValue 
     */
    boxEditAfterChanged(attributeName, attributeValue) {
        this.editingAfter(attributeName, attributeValue)
        this.modifyAttribute()
    }

    /** 編輯框事件編輯結束賦值後觸發 如需客製化引用後進行修改 */
    editingAfter(attributeName, attributeValue) {
        return true
    }

    /**
     * 屬性區域非輸入類的編輯完成
     * @param {Element} formElement 
     */
    attributeDataSelected(formElement) {
        /** 屬性區塊類型 */
	    const formElementType   = formElement.type || formElement.getAttribute('type')
        /** 屬性區塊 */
	    const subContent 		= formElement.closest('.subContent')
        /** 屬性名稱 */
        const attributeName     = subContent.dataset.attribute   
        switch (formElementType) {
            case 'range':
                this.typeRangeAttributeSelected(attributeName, formElement)
                break
            case 'radio':
                this.typeRadioAttributeSelected(attributeName, formElement)
                break
            case 'checkbox':
                this.typeCheckboxAttributeSelected(attributeName, formElement)
                break
            case 'select-one':
                this.typeSelectAttributeSelected(attributeName, formElement)
                break
            case 'button':
                this.typeButtonAttributeSelected(attributeName, formElement)
                break
            case 'text':
                this.typeTextAttributeSelected(attributeName, formElement)
                break
        }
        this.modifyAttribute()
    }

    /**
     * 屬性區域 - 改變區間元素
     * @param {String} attributeName
     * @param {Element} formElement 
     */
    typeRangeAttributeSelected(attributeName, formElement) {
        /** 元素值 */
        const inputValue            = formElement.value
        /** 最小值 */
        const min                   = formElement.min ? formElement.min : 0
        /** 最大值 */
        const max                   = formElement.max ? formElement.max : 50
        /** 比例尺 */
        const newVal                = Number(((inputValue - min) * 100) / (max - min))
        this.dataset[attributeName] = `${ ((inputValue - 0) * 10) }px`
        formElement.nextElementSibling.textContent = (inputValue - 0) * 10
        formElement.nextElementSibling.style.left  = newVal + '%'
        return true
    }

    /**
     * 屬性區域 - 單選框元素
     * @param {String} attributeName
     * @param {Element} formElement 
     */
    typeRadioAttributeSelected(attributeName, formElement) {
        /** 屬性區塊 */
        const subContent 		    = formElement.closest('.subContent')
        /** 被選取的單選框元素 */
        const radioElements         = subContent.querySelector(`input[type="radio"][name="${ attributeName }"]:checked`)
        /** 元素值 */
        const inputValue            = radioElements.value
        this.dataset[attributeName] = inputValue
        return true
    }

    /**
     * 屬性區域 - 多選框元素
     * @param {String} attributeName
     * @param {Element} formElement 
     */
    typeCheckboxAttributeSelected(attributeName, formElement) {
        /** 屬性區塊 */
        const subContent 		    = formElement.closest('.subContent')
        /** 被選取的單選框元素 */
        const checkboxElements      = subContent.querySelectorAll(`input[type="checkbox"][name="${ attributeName }"]:checked`)
        /** 存放值 */
        let inputValue              = ''
        checkboxElements.forEach(element => {
            if (inputValue.length > 0) inputValue += ','
            inputValue += element.value
        })
        this.dataset[attributeName] = inputValue
        return true
    }

    /**
     * 屬性區域 - 下拉框元素
     * @param {String} attributeName
     * @param {Element} formElement 
     */
    typeSelectAttributeSelected(attributeName, formElement) {
        /** 元素值 */
        const inputValue            = formElement.value
        this.dataset[attributeName] = inputValue
        return true
    }

    /**
     * 屬性區域 - 按鈕元素
     * @param {String} attributeName
     * @param {Element} formElement 
     */
    typeButtonAttributeSelected(attributeName, formElement) {
        return true
    }

    /**
     * 屬性區域 - 輸入框元素
     * @param {String} attributeName
     * @param {Element} formElement 
     */
    typeTextAttributeSelected(attributeName, formElement) {
        /** 元素值 */
        const inputValue = formElement.value
        this.dataset[attributeName] = inputValue
        return true
    }

    /**
     * 調整選項
     */
    adjustOptions() {
        console.log(this)
        const cutBoard = []
        const adjustModal = CreateUtils.createModal(`custom`, {
			'size': 	`modal-xl`,
            'title':    `調整選項`,
            'body':     adjustOptionsBody,
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
            'callback': adjustCallBack
        })

        const firstContent  = adjustModal.querySelector('#optionTab1')
        const plusTab       = adjustModal.querySelector('#plus-tab')

        plusTab.addEventListener('click', addBeanTab)

        tabContentEventBind(firstContent)

        const modalBeanSelect = firstContent.querySelector('select[name="modalBeanSelect"]')
        modalBeanSelect.value = this.dataset.name
        if ('createEvent' in document) {
            var evt = document.createEvent('HTMLEvents')
            evt.initEvent('change', false, true)
            modalBeanSelect.dispatchEvent(evt)
        }

        /** 新增元件頁籤 */
        function addBeanTab(e) {
            const tabs = adjustModal.querySelector('#tabs')
            const tabArray = CreateUtils.createNewPage(tabs.children.length)
            const navItem = tabs.querySelector('.nav-item:last-child')
            const tabContent = adjustModal.querySelector('#tabContent')
            tabArray[1][0].firstChild.remove()
            tabArray[0][0].firstChild.textContent = '新增元件'
            adjustOptionsTabContent.createElemental().forEach(ele => {
                tabArray[1][0].appendChild(ele)
            })
            navItem.before(tabArray[0][0])
            tabContent.appendChild(tabArray[1][0])
            tabContentEventBind(tabContent.lastChild)
        }

        /** 頁籤事件綁定 */
        function tabContentEventBind(tabContent) {
            const modalSwitchButton = tabContent.querySelector('button[name="modalSwitchButton"]')
            const modalBeanSelect   = tabContent.querySelector('select[name="modalBeanSelect"]')
            const addOption         = tabContent.querySelector('button[name="addOption"]')
            const removeOption      = tabContent.querySelector('button[name="removeOption"]')
            const returnOption      = tabContent.querySelector('button[name="returnOption"]')
            const cutOption         = tabContent.querySelector('button[name="cutOption"]')
            const pasteOption       = tabContent.querySelector('button[name="pasteOption"]')
            const optionUp          = tabContent.querySelector('button[name="optionUp"]')
            const optionDown        = tabContent.querySelector('button[name="optionDown"]')
            const optionsTable      = tabContent.querySelector('table[name="optionsTable"]')
            const tab               = adjustModal.querySelector(`#${ tabContent.getAttribute('aria-labelledby') }`)
            const beanOptions       = CreateUtils.createBeanOptions(false, true)

            /** set value */
            beanOptions.forEach(option => modalBeanSelect.appendChild(option))

            /** binding event */
            tab.addEventListener('click', (e) => buttonDisabledSetting(optionsTable))
            modalSwitchButton.addEventListener('click', SharedUtils.switchSelectAndInput)
            modalBeanSelect.addEventListener('change', beanNameChanged.bind(optionsTable))
            addOption.addEventListener('click', addOptionRow.bind(optionsTable))
            removeOption.addEventListener('click', removeOptionRow.bind(optionsTable))
            returnOption.addEventListener('click', returnOptionRow.bind(optionsTable))
            cutOption.addEventListener('click', cutOptionRow.bind(optionsTable))
            pasteOption.addEventListener('click', pasteOptionRow.bind(optionsTable))
            optionUp.addEventListener('click', optionRowUp.bind(optionsTable))
            optionDown.addEventListener('click', optionRowDown.bind(optionsTable))
        }

        /** 元件選取變更事件 */
        function beanNameChanged(e) {
            const tbody = this.querySelector('tbody')
            while (tbody.firstChild) {
                tbody.removeChild(tbody.lastChild)
            }
            const component = ComponentFactory.getRegisterComponentByName(e.target.value)
            if (!component) return
            const tabPane = this.closest('.tab-pane')
            const tab = adjustModal.querySelector(`#${ tabPane.getAttribute('aria-labelledby') }`)
            const uiGuid = component.controllerGuid && component.controllerGuid.indexOf(',') > -1 ? component.controllerGuid.split(',') : ''
            tab.textContent = `${ component.dataset.title }(${ component.externalName })`
            for (let i = 0, len = component.uiValue.length; i < len; ++i) {
                const value = component.uiValue[i]
                const desc = component.uiDesc[i]
                const score = component.uiScore ? component.uiScore[i] : null
                const checked = component.checked ? component.checked[i] : null
                const guid = uiGuid ? uiGuid[i] : null
                const row = adjustOptionsDataRow.createElemental()[0]
                for (let td of row.children) {
                    if (td.classList.contains('desc-column')) td.textContent = desc
                    if (td.classList.contains('value-column')) td.textContent = value
                    if (td.classList.contains('score-column')) td.textContent = score || ''
                    if (td.classList.contains('default-column') && (checked === 'true' || checked === true)) td.firstChild.checked = true
                    if (td.classList.contains('guid-column')) td.textContent = guid || ''
                }
                tbody.appendChild(row)
            }
            sortNumberSetting(this)
            initEditDiv()
        }

        /** 新增選項列 */
        function addOptionRow(e) {
            const row = adjustOptionsDataRow.createElemental()[0]
            this.tBodies[0].appendChild(row)
            sortNumberSetting(this)
            initEditDiv()
        }

        /** 移除選項列(需移除兩次才完整移除) */
        function removeOptionRow(e) {
            const selectedRow = this.querySelectorAll('tr.active')
            selectedRow.forEach(row => {
                if (row.classList.contains('delete')) {
                    row.remove()
                } else row.classList.add('delete')
            })
            sortNumberSetting(this)
            clearRowSelect(this)
            buttonDisabledSetting(this)
        }

        /** 還原選項 */
        function returnOptionRow(e) {
            const selectedRow = this.querySelectorAll('tr.active')
            selectedRow.forEach(row => {
                if (row.classList.contains('delete')) row.classList.remove('delete')
            })
            sortNumberSetting(this)
            clearRowSelect(this)
            buttonDisabledSetting(this)
        }

        /** 剪下選項 */
        function cutOptionRow(e) {
            cutBoard.length = 0
            const selectedRow = this.querySelectorAll('tr.active')
            selectedRow.forEach(row => {
                if (!row.classList.contains('delete')) {
                    cutBoard.push(row)
                    row.remove()
                }
            })
            sortNumberSetting(this)
            clearRowSelect(this)
            buttonDisabledSetting(this)
        }

        /** 貼上選項 */
        function pasteOptionRow(e) {
            cutBoard.forEach(row => {
                row.classList.remove('active')
                this.tBodies[0].appendChild(row)
            })
            cutBoard.length = 0
            sortNumberSetting(this)
            clearRowSelect(this)
            buttonDisabledSetting(this)
        }

        /** 選項往上移動 */
        function optionRowUp(e) {
            const selectedRow = this.querySelector('tr.active')
            this.tBodies[0].insertBefore(selectedRow, selectedRow.previousElementSibling)
            sortNumberSetting(this)
            buttonDisabledSetting(this)
        }

        /** 選項往下移動 */
        function optionRowDown(e) {
            const selectedRow = this.querySelector('tr.active')
            this.tBodies[0].insertBefore(selectedRow.nextElementSibling, selectedRow)
            sortNumberSetting(this)
            buttonDisabledSetting(this)
        }

        /** 預設選取檢查是否多選單選 */
        function checkingClick(e) {
            const tabPane = this.closest('.tab-pane')
            const formTypeRow = tabPane.querySelector('.form-type-group')
            const beanSelect = formTypeRow.querySelector('select[name="modalBeanSelect"]')
            let controlType
            if (beanSelect.classList.contains('hide')) {
                const controlTypeSelect = formTypeRow.querySelector('select[name="modalBeanControlType"]')
                if (controlTypeSelect.value !== '0') controlType = controlTypeSelect.value
            } else {
                const component = ComponentFactory.getRegisterComponentByName(beanSelect.value)
                if (component) controlType = component.controlType
            }
            switch (controlType) {
                case 'radio':
                case 'select':
                    const allDefaultColumns = this.querySelectorAll('.default-column')
                    allDefaultColumns.forEach(td => {
                        if (td.firstChild !== e.target) td.firstChild.checked = false
                    })
                    break
            }
        }

        /** 排序編號調整 */
        function sortNumberSetting(table) {
            const deleteRows = table.querySelectorAll('tbody > tr.delete')
            deleteRows.forEach(tr => {
                table.tBodies[0].appendChild(tr)
            })
            const rows = table.querySelectorAll('tbody > tr')
            rows.forEach((tr, index) => {
                const sortColumn = tr.querySelector('.sort-column')
                const defaultColumn = tr.querySelector('.default-column')
                if (!sortColumn.dataset.bindEvent) {
                    sortColumn.addEventListener('click', selectOptionRow.bind(table))
                    sortColumn.dataset.bindEvent = 'already'
                }
                if (!defaultColumn.dataset.bindEvent) {
                    defaultColumn.firstChild.addEventListener('click', checkingClick.bind(table))
                    defaultColumn.dataset.bindEvent = 'already'
                }
                if (tr.classList.contains('delete')) {
                    sortColumn.textContent = ''
                    return
                }
                sortColumn.textContent = (index - 0) + 1
            })
        }

        /** 選取選項列 */
        function selectOptionRow(e) {
            const tr = e.target.closest('tr')
            tr.classList.toggle('active')
            buttonDisabledSetting(this)
        }

        /** 按鈕控制事件 */
        function buttonDisabledSetting(table) {
            const isChecked = table.querySelectorAll('tr.active')
            const deleteRows = table.querySelectorAll('tr.delete')
            const deleteSelectedRows = table.querySelectorAll('tr.active.delete')
            const tableBlock = table.closest('.table-block')
            const buttonBlock = tableBlock.querySelector('.button-block')
            for (let i = 0, len = buttonBlock.children.length; i < len; ++i) {
                if (i === 0) continue
                const button = buttonBlock.children[i]
                if (i === 2 && deleteSelectedRows.length > 0 && deleteSelectedRows.length === isChecked.length) {
                    button.disabled = false
                    continue
                } else if (i === 2 && deleteSelectedRows.length !== isChecked.length) {
                    button.disabled = true
                    continue
                }
                if (i === 4 && cutBoard.length > 0) {
                    button.disabled = false
                    continue
                } else if (i === 4 && cutBoard.length === 0) {
                    button.disabled = true
                    continue
                }
                if (i > 4 && isChecked.length === 1) {
                    if ((isChecked[0].sectionRowIndex === 0 && i === 5) || 
                        (isChecked[0].sectionRowIndex > table.tBodies[0].children.length - 1 - deleteRows.length && i === 5) ||
                        (isChecked[0].sectionRowIndex >= table.tBodies[0].children.length - 1 - deleteRows.length && i === 6)) button.disabled = true
                    else button.disabled = false
                    continue
                } else if (i > 4 && isChecked.length > 1 || isChecked.length === 0) {
                    button.disabled = true
                    continue
                }
                if (isChecked.length > 0) button.disabled = false
                else button.disabled = true
            }
        }

        /** 清除選取列 */
        function clearRowSelect(table) {
            const selectedRows = table.querySelectorAll('tbody > tr.active')
            selectedRows.forEach(tr => {
                tr.classList.remove('active')
            })
        }

        /** 彈出視窗回調 */
        function adjustCallBack(index, modalElement) {
            const tabContent = modalElement.querySelector('#tabContent')
            if (index === 1) {
                for (let tabPane of tabContent.children) {
                    const formTypeGroup = tabPane.querySelector('.form-type-group')
                    const optionsTable = tabPane.querySelector('table[name="optionsTable"]')
                    const formControl = formTypeGroup.querySelectorAll('.form-control')
                    const uiDesc = [], uiValue = [], uiScore = [], checked = [], guid = [], uiDelete = []
                    let beanName, beanTitle, component, controlType
                    formControl.forEach(element => {
                        if (element.classList.contains('hide')) return
                        switch (element.name) {
                            case 'modalBeanSelect':
                                component = ComponentFactory.getRegisterComponentByName(element.value)
                                beanName = component.dataset.name
                                beanTitle = component.dataset.title
                                break
                            case 'modalBeanName':
                                beanName = element.value
                                break
                            case 'modalBeanTitle':
                                beanTitle = element.value
                                break
                            case 'modalBeanControlType':
                                controlType = element.value
                                break
                        }
                    })
                    optionsTable.tBodies[0].childNodes.forEach(tr => {
                        const descColumn = tr.querySelector('.desc-column')
                        const valueColumn = tr.querySelector('.value-column')
                        const scoreColumn = tr.querySelector('.score-column')
                        const defaultColumn = tr.querySelector('.default-column')
                        const guidColumn = tr.querySelector('.guid-column')
                        if (tr.classList.contains('delete')) {
                            const deleteRow = {
                                uiDesc: descColumn.textContent,
                                uiValue: valueColumn.textContent,
                                uiScore: scoreColumn.textContent,
                                checked: defaultColumn.firstChild.checked,
                                guid: guidColumn.textContent
                            }
                            uiDelete.push(deleteRow)
                        } else {
                            uiDesc.push(descColumn.textContent)
                            uiValue.push(valueColumn.textContent)
                            if (scoreColumn.textContent) uiScore.push(scoreColumn.textContent)
                            checked.push(defaultColumn.firstChild.checked)
                            if (guidColumn.textContent) guid.push(guidColumn.textContent)
                        }
                    })
                    if (!component) component = ComponentFactory.create(`__${ controlType }`, beanName, beanName, beanTitle)
                    component.dataset.uiDesc = uiDesc.join(',')
                    component.dataset.uiValue = uiValue.join(',')
                    component.dataset.uiScore = uiScore.join(',')
                    component.dataset.checked = checked.join(',')
                    component.dataset.controllerGuid = guid.join(',')
                    component.dataset.uiDelete = uiDelete.join(',')
                    component.modifyAttribute()
                    beanToListEvent()
                }
                return true
            }
        }

    }

    /**
     * 將元件轉換為 formVersion 結構
     */
    convertToDynamicFormItem() {
        const verStructure = {
            formToolAttribute: { }
        }
        this.beforeConvertProcess(verStructure)
        /** 過濾舊版 */
        if (this.dataset.controlType === 'input') verStructure.controlType = 'text'
        /** 腳本存在 */
        if (this.dataset.script) {
            const script = this.dataset.script
            if (typeof script === 'string') verStructure.script = script
            else if (typeof script === 'object') verStructure.script = JSON.stringify(verStructure)
        }
        // if (typeof this.structure === 'object' && this.controlType === 'group') verStructure.formToolAttribute.structure = JSON.stringify(this.structure)
        /** 過濾屬性 */
        for (let node in this.dataset) {
            if (node === 'formToolAttribute') continue
            if (gFormBaseAttribute.includes(node) && verStructure[node] === undefined) {
                verStructure[node] = this.dataset[node]
                continue
            } else if (gFormBaseAttribute.includes(node)) continue
            verStructure.formToolAttribute[node] = this.dataset[node]
            delete verStructure[node]
        }
        verStructure.formToolAttribute = JSON.stringify(verStructure.formToolAttribute)
        this.afterConvertProcess()
        this.versionStructure = verStructure
        return this.versionStructure
    }

    convertToOldDynamicFormItem() {
        const oldVerStructure = {
            showTitle: true,
        }
        /** 過濾舊版 */
        if (this.dataset.controlType === 'input') oldVerStructure.controlType = 'text'
        for (let node in this.dataset) {
            if (node === 'formToolAttribute') continue
            if (oldFormAttribute.includes(node) && oldVerStructure[node] === undefined) {
                if (node === 'dontDitto') oldVerStructure["dittoData"] = this.dataset[node]
                else if (node === 'horizontalFormItem') {
                    // 橫向展開調整
                    if (this.horizontalFormItem.length === 0) continue;
                    let hasOther = "";
                    for (let i = 0, len = this.horizontalFormItem.length; i < len; ++i) {
                        if (hasOther.length > 0) hasOther += ",";
                        if (this.horizontalFormItem[i].length > 0) {
                            hasOther += "true";
                        } else {
                            hasOther += "false";
                        }
                    }
                    oldVerStructure.hasOther = hasOther.split(',');
                }
                else if (node === 'uiValue') {
                    oldVerStructure.uiValue = this.uiValue;
                }
                else if (node === 'uiScore') {
                    oldVerStructure.uiScore = this.uiScore;
                }
                else if (node === 'uiDesc') {
                    oldVerStructure.uiDesc = this.uiDesc;
                }
                else oldVerStructure[node] = this.dataset[node]
                continue
            } else if (oldFormAttribute.includes(node)) continue
            delete oldVerStructure[node]
        }
        return oldVerStructure
    }

    /**
     * 轉置前處理
     * @param {Object} verStructure 
     */
    beforeConvertProcess(verStructure) {
        // 處理前標題後標題
        const labelElements = this.fullComponent.querySelectorAll('label.h6.canEditDiv')
        const frontTitleFamily = []
        const backTitleFamily = []
        if (this.controlType === 'checkbox' || this.controlType === 'radio') {
            for (let i = 0, len = this.uiValue.length; i < len; ++i) {
                frontTitleFamily.push([])
                backTitleFamily.push([])
            }
        }
        labelElements.forEach(element => {
            if ((element.closest('[data-name]').dataset.seq - 0) !== this.seq) return
            let after = false
            let nextElement = element.nextElementSibling
            do {
                if (nextElement && !nextElement.classList.contains('h6') && !nextElement.classList.contains('canEditDiv')) break
                else if (nextElement) nextElement = nextElement.nextElementSibling
                if (!nextElement) after = true
            } while (nextElement)
            const classArray = Array.from(element.classList).filter(x => x !== 'h6' && x !== 'canEditDiv' && x !== 'selected')
            classArray.push(element.firstChild instanceof Text ? '' : element.firstChild instanceof HTMLPreElement ? 'labelPreTitle' : 'labelSubTitle')
            const resultObject = {
                title: element.textContent.trim(),
                style: element.getAttribute('style') || '',
                uiClass: classArray.join(' ').trim()
            }
            if (this.controlType === 'checkbox' || this.controlType === 'radio') {
                const position = element.parentNode.selfPosition()
                if (after) backTitleFamily[position].push(resultObject) 
                else frontTitleFamily[position].push(resultObject)
            } else {
                if (after) backTitleFamily.push(resultObject) 
                else frontTitleFamily.push(resultObject)
            }
        })
        if (this.controlType === 'checkbox' || this.controlType === 'radio') {
            this.dataset.opBackTitleFamily = JSON.stringify(backTitleFamily)
            this.dataset.opFrontTitleFamily = JSON.stringify(frontTitleFamily)
        } else {
            this.dataset.backTitleFamily = JSON.stringify(backTitleFamily)
            this.dataset.frontTitleFamily = JSON.stringify(frontTitleFamily)
        }
        for (let node in this.dataset) {
            const datasetValue = this.dataset[node]
            if (!datasetValue || datasetValue === 'null' || datasetValue === 'undefined') delete this.dataset[node]
        }
        this.convertItByType(verStructure)
    }

    /**
     * 轉置後處理
     */
    afterConvertProcess() {
        return true
    }

    /**
     * 依照各類型轉換特殊屬性節點
     * @param {Object} verStructure
     * @returns 
     */
    convertItByType(verStructure) {
        return true
    }

    /**
     * 將 formVersion 屬性轉換至元件內
     * @param {Object} itemAttributes
     */
    convertDynamicFormItemToComponent(itemAttributes) {
        for (let attribute in itemAttributes) {
            switch (attribute) {
                case ATTRIBUTE_NAMES.FORM_TOOL_ATTRIBUTE:
                    const formToolAttribute = SharedUtils.onionStringDecode(itemAttributes[attribute])
                    this.convertFormToolAttribute(formToolAttribute, itemAttributes)
                    break
                case ATTRIBUTE_NAMES.UI_DESC:
                case ATTRIBUTE_NAMES.UI_VALUE:
                case ATTRIBUTE_NAMES.UI_SCORE:
                case ATTRIBUTE_NAMES.CHECKED:
                    const uiNode = itemAttributes[attribute]
                    if (Array.isArray(uiNode)) this.dataset[attribute] = uiNode.join(',')
                    else if (Array.isArray(uiNode.string)) this.dataset[attribute] = uiNode.string.join(',')
                    this.dataset[attribute] = this.dataset[attribute].replace(/&lt;/g, '<').replace(/&gt;/g, '>')
                    break
                case ATTRIBUTE_NAMES.TYPE_FORMAT:
                    const typeFormat = SharedUtils.onionStringDecode(itemAttributes[attribute].replace(/\\/g, ''))
                    this.convertTypeFormat(attribute, typeFormat)
                    break
                case ATTRIBUTE_NAMES.MIN_LIMIT:
                case ATTRIBUTE_NAMES.MAX_LIMIT:
                case ATTRIBUTE_NAMES.DEFAULT_VALUE:
                    this.convertLimitOrValue(attribute, itemAttributes[attribute])
                    break
                default:
                    this.dataset[attribute] = itemAttributes[attribute]
                    break
            }
        }
    }

    /**
     * 轉置工具專屬屬性
     * @param {Object} formToolAttribute 
     * @param {Object} itemAttributes
     */
    convertFormToolAttribute(formToolAttribute, itemAttributes) {
        if (this.dataset.controlType === 'button' && (!formToolAttribute.placeholder && this.dataset.placeholder === '')) this.dataset.placeholder = ''
        for (let attribute in formToolAttribute) {
            switch (attribute) {
                case ATTRIBUTE_NAMES.ABANDONED:
                    if (typeof formToolAttribute[attribute] === 'boolean') this.abandoned = formToolAttribute[attribute]
                    else this.abandoned = formToolAttribute[attribute] === 'true'
                    break
                case ATTRIBUTE_NAMES.STRUCTURE:
                    if (typeof formToolAttribute[attribute] === 'string') this.structure = SharedUtils.onionStringDecode(formToolAttribute[attribute])
                    else if (typeof formToolAttribute[attribute] === 'object') this.structure = formToolAttribute[attribute]
                    this.modifyAttribute()
                    this.structureExtraction()
                    break
                case ATTRIBUTE_NAMES.SEQ:
                    // nothing
                    break
                default:
                    this.formToolAttributeDefaultProcess(attribute, formToolAttribute[attribute], itemAttributes)
                    break
            }
        }
    }
    
    /**
     * 工具專屬屬性一般處理
     * 若有特殊處理引入後判斷解決
     * @param {String} attribute 
     * @param {Object} formToolAttributeValue 
     */
    formToolAttributeDefaultProcess(attribute, formToolAttributeValue, itemAttributes) {
        this.dataset[attribute] = formToolAttributeValue
    }

    /**
     * 轉置格式屬性
     * @param {String} attribute 
     * @param {Object} typeFormat 
     */
    convertTypeFormat(attribute, typeFormat) {
        this.dataset[attribute] = typeFormat
    }

    /**
     * 轉置指定屬性
     * @param {String} attribute 
     * @param {Object} attributeValue 
     */
    convertLimitOrValue(attribute, attributeValue) {
        this.dataset[attribute] = attributeValue
    }

    /**
     * 當其餘元件改名時觸發
     * 需要改變腳本相關名稱引用
     * @param {String} originName
     * @param {String} newName
     */
    otherBeanNameChanged(originName, newName) {
        if (this.dataset.script) {
            const script = SharedUtils.onionStringDecode(this.dataset.script)
            for (let scriptObject of script) {
                if (!scriptObject.range) continue
                let range = scriptObject.range
                if (typeof range === 'string') range = JSON.parse(scriptObject.range)
                for (let rangeObejct of range) {
                    const cloneBeanName = rangeObejct.cloneBeanName || []
                    const hideBeanName = rangeObejct.hideBeanName || []
                    const showBeanName = rangeObejct.showBeanName || []
                    if (cloneBeanName.includes(originName)) cloneBeanName[cloneBeanName.indexOf(originName)] = newName
                    if (hideBeanName.includes(originName)) hideBeanName[hideBeanName.indexOf(originName)] = newName
                    if (showBeanName.includes(originName)) showBeanName[showBeanName.indexOf(originName)] = newName
                }
            }
            this.dataset.script = JSON.stringify(script)
        }
        if (this.horizontalFormItem && this.horizontalFormItem.length > 0) {
            for (let i = 0, len = this.horizontalFormItem.length; i < len; ++i) {
                const itemArray = this.horizontalFormItem[i].split(',')
                if (itemArray.includes(originName)) {
                    itemArray[itemArray.indexOf(originName)] = newName
                    this.horizontalFormItem[i] = itemArray.join(',')
                }
            }
        }
        if (this.dataset.parent && this.dataset.parent === originName) this.dataset.parent = newName
        if (this.children && this.children.length > 0 && this.children.includes(originName)) this.children[this.children.indexOf(originName)] = newName
        if (this.treeChildren && this.treeChildren.length > 0 && this.treeChildren.includes(originName)) this.treeChildren[this.treeChildren.indexOf(originName)] = newName
    }

    exportComponent() {
        return {
            attribute: this.attribute,
            dataset: this.dataset,
            structure: this.structure
        }
    }

    // =============== functions end ===============
}
