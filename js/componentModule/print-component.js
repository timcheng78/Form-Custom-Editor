import { ATTRIBUTE_NAMES_PRINT } from '../descriptionModule/utils-object.js'
import { ATTRIBUTE_ZH_NAMES_PRINT } from '../descriptionModule/utils-object.js'
import { AttributeObject } from '../descriptionModule/attribute-object.js'
import { BaseComponent } from './base-component.js'

export class PrintComponent extends BaseComponent {

    constructor (className, draggable, title, type) {
        super()
        /** 一般屬性 */
        this.attribute              = { }
        /** 元件屬性 */
        this.dataset                = { }
        /** 類別屬性 */
        this.attribute.class        = className
        /** 可拖曳屬性 */
        this.attribute.draggable    = draggable
        /** 元件標題 */
        this.dataset.title          = title
        /** 元件類型 */
        this.dataset.type           = type
        /** 列印元件 */
        this.dataset.webComponent   = 'print'
        /** 元件編輯 */
        this.dataset.edit           = 'true'
    }
    
    /** 設定元件序號 */
    set printSeq(printSeq) {
        this._printSeq = printSeq
        this.dataset.printSeq = printSeq
        this.modifyAttribute()
    }

    /** 取得元件序號 */
    get printSeq() {
        return this._printSeq
    }

    // =============== functions start ===============

    /**
     * 初始化元件設定並製做殼及元件
     */
    init() {
        this.generateComponent()
    }

    generateComponent() {
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
                            if (this.fullComponent && dataAttribute === 'class' && this.fullComponent.classList.contains('selected')) {
                                this.fullComponent.classList.value = datasetData + ' selected'
                            }
                        } else if (attribute === 'dataset') {
                            attributeObject[`data-${ dataAttribute.replace(/([A-Z])/g, "-$1").toLowerCase() }`] = datasetData
                            if (this.fullComponent) this.fullComponent.dataset[dataAttribute] = datasetData
                        }
                    }
                    break
            }            
        }

        if (!this.fullComponent || !(this.fullComponent instanceof Element)) this.fullComponent = CreateUtils.createBeanElement({controlType: 'div', attribute: [attributeObject]})[0]
        this.setTitle()
        return this.fullComponent
    }

    /** 設定標題文字 */
    setTitle() {
        this.fullComponent.textContent = this.dataset.title
    }

    /**
     * 屬性切換
     * @param {Element} element 
     */
    attributeChanged(e) {
        switch (e.target.name) {
            case ATTRIBUTE_NAMES_PRINT.TEXT_ALIGN:
                this.fullComponent.style.textAlign = e.target.value
                break
            default:
                this.dataset[e.target.name] = e.target.value
                break
        }
    }

    /**
     * 製作屬性列
     * =
     * 依照屬性物件相關規則進行製作
     * 
     * @param {AttributeObject[]} objectArguments
     * @return {Element}
     */
    generateAttributeRow(objectArguments) {
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
                    descRow.classList.add('canEditDiv')
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
                            'onchange': this.attributeChanged.bind(this)
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
                            let checkInputClassName = `form-check-input ${ attributeType.replace('image', '').toLowerCase() }-default`
                            if (attributeType === 'imageRadio') checkInputClassName += ` image-radio ${ optionDescArray[i] }`
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
                                                'checked': 	(defaultValue ? (defaultValue === optionValueArray[i] ? 'checked' : null) : null ), 
                                                'onclick': this.attributeChanged.bind(this)
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
                    const rangeElement = {
                        'input': {
                            'type':     'range',
                            'class':    'form-control-range',
                            'name':     attributeName,
                            'min':      minNumber,
                            'max':      maxNumber,
                            'value':    defaultValue || 25,
                            'oninput':  this.attributeChanged.bind(this)
                        }
                    }.createElemental()[0]
                    descRow.appendChild(rangeElement)
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
        this.attributesModules = attributesModuleArray
        return attributesModuleArray
    }

    /**
     * 設計屬性列標題及參數
     */
    modifyAttribute() {
        /** 屬性物件存放陣列 */
        const attrObjectArr = []
        /** 各屬性自訂區域 */
        for (let attributeName of this.attributes) {
            /** 屬性標題 */
            const zhName        = ATTRIBUTE_ZH_NAMES_PRINT[attributeName]
            /** 實際屬性資料 */
            let actualValue     = this.dataset[attributeName]
            if (actualValue === undefined) actualValue = ''
            // 預設文字輸入屬性
            this.buildAttributeObject(attrObjectArr, attributeName, zhName, `${ actualValue }`)
            // 屬性改變元件呈現方式
            if (this.fullComponent) this.componentAttributeChanged(attributeName, `${ actualValue }`)
        }
        this.generateComponent()
        this.generateAttributeRow(attrObjectArr)
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
            case ATTRIBUTE_NAMES_PRINT.TEXT_ALIGN:
                // 單選框模式選擇屬性
                const optionAttributeObject             = new AttributeObject(attributeName, zhName, 'radio', actualValue)
                optionAttributeObject.optionDescription = ["靠左對齊", "置中對齊", "靠右對齊"]
                optionAttributeObject.optionValue       = ["left", "center", "right"]
                attrObjectArray.push(optionAttributeObject)
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
			case ATTRIBUTE_NAMES_PRINT.TEXT_ALIGN:
                this.fullComponent.style.textAlign = actualValue
                break
        }
    }

    /** 合併元件元素 */
    mergeComponent(element) {
        return true
    }

    // =============== functions end ===============

}