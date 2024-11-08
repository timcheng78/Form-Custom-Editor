import { STYLE_ATTRIBUTES } from '../descriptionModule/utils-object.js'
import { STYLE_ZH_ATTRIBUTES } from '../descriptionModule/utils-object.js'
import { AttributeObject } from '../descriptionModule/attribute-object.js'

export class StyleComponent {

    get cssValueRegex() {
        return new RegExp(/^([+-]?\d+(?:\.\d+)?)(.*)$/)
    }

    constructor (element) {
        this.element = element
        this.attributes = Object.keys(STYLE_ATTRIBUTES)
        this.modifyAttribute()
    }

    /**
     * 屬性切換
     * @param {Element} element 
     */
    styleChanged(element) {
        switch (element.target.name) {
            case STYLE_ATTRIBUTES.WIDTH:
            case STYLE_ATTRIBUTES.BORDER_WIDTH:
            case STYLE_ATTRIBUTES.FONT_SIZE:
            case STYLE_ATTRIBUTES.MARGIN:
            case STYLE_ATTRIBUTES.PADDING:
            case STYLE_ATTRIBUTES.LINE_HEIGHT:
                let numberValue, stringValue
                if (element.target.tagName.toLowerCase() === 'input') {
                    numberValue = element.target.value
                    stringValue = element.target.nextElementSibling.value
                } else if (element.target.tagName.toLowerCase() === 'select') {
                    stringValue = element.target.value
                    numberValue = element.target.previousElementSibling.value
                }
                if (numberValue === '') this.element.style[element.target.name] = ''
                else if (numberValue.trim().includes(' ')) {
                    const numberArray = numberValue.trim().split(' ')
                    this.element.style[element.target.name] = (numberArray.map(x => x + stringValue)).join(' ')
                } else this.element.style[element.target.name] = numberValue + stringValue
                break
            default:
                if (element.target.value === '') this.element.style[element.target.name] = ''
                else this.element.style[element.target.name] = element.target.value
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
                            'onchange': this.styleChanged.bind(this)
                        }
                    }.createElemental()[0]
                    if (selectDescArray && selectValueArray) {
                        let len = selectDescArray.length > selectValueArray.length ? selectDescArray.length : selectValueArray.length
                        for (let i = 0; i < len; ++i) {
                            const optionElement = {
                                'option': {
                                    'text':     selectDescArray[i] || selectValueArray[i],
                                    'value':    selectValueArray[i] || '',
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
                                                'onclick': this.styleChanged.bind(this)
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
                            'oninput':  this.styleChanged.bind(this)
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
        for (let attributeNameUppercase of this.attributes) {
            const attributeName = STYLE_ATTRIBUTES[attributeNameUppercase]
            /** 屬性標題 */
            const zhName        = STYLE_ZH_ATTRIBUTES[attributeName]
            /** 實際屬性資料 */
            let actualValue     = this.element.style[attributeName]
            if (actualValue === undefined) actualValue = ''
            // 預設文字輸入屬性
            this.buildAttributeObject(attrObjectArr, attributeName, zhName, `${ actualValue }`)
        }
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
        if (this.checkStyleHide(attributeName)) return
        let numberValue = '', stringValue = ''
        const regex = this.cssValueRegex
        let matchArray = regex.exec(actualValue)
        if (actualValue.trim().includes(' ')) {
            const valueArray = actualValue.trim().split(' ')
            const numberArray = [], stringArray = []
            valueArray.forEach(value => {
                const tempArray = regex.exec(value)
                numberArray.push(tempArray[1])
                stringArray.push(tempArray[2])
            })
            numberValue = numberArray.join(' ')
            stringValue = stringArray.join(' ')
            matchArray = ''
        }
        switch (attributeName) {
            case STYLE_ATTRIBUTES.WIDTH:
            case STYLE_ATTRIBUTES.BORDER_WIDTH:
            case STYLE_ATTRIBUTES.FONT_SIZE:
            case STYLE_ATTRIBUTES.MARGIN:
            case STYLE_ATTRIBUTES.PADDING:
            case STYLE_ATTRIBUTES.LINE_HEIGHT:
                if (Array.isArray(matchArray)) {
                    numberValue = matchArray[1]
                    stringValue = matchArray[2]
                }
                // 客製化模式選擇屬性
                const optionsChildren = [
                    {
                        'option': {
                            'value':    'px',
                            'text':     'px',
                            'selected': stringValue === 'px' ? 'selected' : undefined
                        }
                    },
                    {
                        'option': {
                            'value':    'rem',
                            'text':     'rem',
                            'selected': stringValue === 'rem' ? 'selected' : undefined
                        }
                    },
                    {
                        'option': {
                            'value':    '%',
                            'text':     '%',
                            'selected': stringValue === '%' ? 'selected' : undefined
                        }
                    }
                ]
                const customObject = [
                    {
                        'input': {
                            'type':     'text',
                            'class':    `form-control col`,
                            'name': 	attributeName,
                            'id': 		attributeName + 'Input',
                            'value': 	numberValue,
                            'onblur': this.styleChanged.bind(this)
                        }
                    },
                    {
                        'select': {
                            'class':    'form-control col-4',
                            'name':     attributeName,
                            'id':       attributeName,
                            'children': optionsChildren,
                            'onchange': this.styleChanged.bind(this)
                        }
                    }
                ]
                const customNode = new AttributeObject(attributeName, zhName, 'custom', actualValue, customObject)
                customNode.contentNode = {
                    'div': {
                        'class': 'col-9 subContent row'
                    }
                }
                attrObjectArray.push(customNode)
                break
            case STYLE_ATTRIBUTES.BORDER_STYLE:
            case STYLE_ATTRIBUTES.TEXT_ALIGN:
            case STYLE_ATTRIBUTES.WHITE_SPACE:
            case STYLE_ATTRIBUTES.FLEX_WRAP:
            case STYLE_ATTRIBUTES.FLEX_DIRECTION:
            case STYLE_ATTRIBUTES.JUSTIFY_CONTENT:
            case STYLE_ATTRIBUTES.ALIGN_ITEMS:
            case STYLE_ATTRIBUTES.FLEX_GROW:
            case STYLE_ATTRIBUTES.DISPLAY:
                // 下拉框模式選擇屬性
                const selectAttributeObject             = new AttributeObject(attributeName, zhName, 'select', actualValue)
                if (attributeName === STYLE_ATTRIBUTES.BORDER_STYLE) {
                    selectAttributeObject.optionDescription = ["無", "點", "實線", "虛線", "雙實線"]
                    selectAttributeObject.optionValue       = ["none", "dotted", "solid", "dashed", "double"]
                } else if (attributeName === STYLE_ATTRIBUTES.TEXT_ALIGN) {
                    selectAttributeObject.optionDescription = ["靠左", "置中", "靠右", "兩側對齊", "強制兩側對齊"]
                    selectAttributeObject.optionValue       = ["left", "center", "right", "justify", "justify-all"]
                } else if (attributeName === STYLE_ATTRIBUTES.WHITE_SPACE) {
                    selectAttributeObject.optionDescription = ["預設", "不換行"]
                    selectAttributeObject.optionValue       = ["", "nowrap"]
                } else if (attributeName === STYLE_ATTRIBUTES.FLEX_WRAP) {
                    selectAttributeObject.optionDescription = ["預設", "換行", "反向換行"]
                    selectAttributeObject.optionValue       = ["nowrap", "wrap", "wrap-reverse"]
                } else if (attributeName === STYLE_ATTRIBUTES.FLEX_DIRECTION) {
                    selectAttributeObject.optionDescription = ["橫向", "直向"]
                    selectAttributeObject.optionValue       = ["row", "column"]
                } else if (attributeName === STYLE_ATTRIBUTES.JUSTIFY_CONTENT) {
                    selectAttributeObject.optionDescription = ["起始對齊", "置中對齊", "結尾對齊", "分散對齊", "平均對齊"]
                    selectAttributeObject.optionValue       = ["flex-start", "center", "flex-end", "space-between", "space-around"]
                } else if (attributeName === STYLE_ATTRIBUTES.ALIGN_ITEMS) {
                    selectAttributeObject.optionDescription = ["起始對齊", "置中對齊", "結尾對齊", "基準線對齊", "展開對齊"]
                    selectAttributeObject.optionValue       = ["flex-start", "center", "flex-end", "baseline", "stretch"]
                } else if (attributeName === STYLE_ATTRIBUTES.FLEX_GROW) {
                    selectAttributeObject.optionDescription = ["展開", "緊縮"]
                    selectAttributeObject.optionValue       = ["1", "0"]
                } else if (attributeName === STYLE_ATTRIBUTES.DISPLAY) {
                    selectAttributeObject.optionDescription = ["區塊", "同行區塊", "柔性區塊", "同行柔性區塊"]
                    selectAttributeObject.optionValue       = ["block", "inline-block", "flex", "inline-flex"]
                }
                attrObjectArray.push(selectAttributeObject)
                break
            case STYLE_ATTRIBUTES.BORDER_COLOR:
            case STYLE_ATTRIBUTES.BACKGROUND_COLOR:
            case STYLE_ATTRIBUTES.COLOR:
                if (actualValue.includes('rgb')) actualValue = SharedUtils.rgba2hex(actualValue)
                const colorObject = [
                    {
                        'input': {
                            'type': 'color',
                            'name': attributeName,
                            'id':   attributeName,
                            'value': actualValue,
                            'onchange': this.styleChanged.bind(this)
                        }
                    },
                    {
                        'button': {
                            'class': 'btn btn-secondary',
                            'type': 'button',
                            'text': 'reset',
                            'name': attributeName,
                            'id': attributeName + 'Button',
                            'value': '',
                            'style': 'margin-left: 1rem;',
                            'onclick': this.styleChanged.bind(this)
                        }
                    }
                ]
                const colorNode = new AttributeObject(attributeName, zhName, 'custom', actualValue, colorObject)
                attrObjectArray.push(colorNode)
                break
            default:
                // 預設文字輸入屬性
                attrObjectArray.push(new AttributeObject(attributeName, zhName, 'text', actualValue))
                break
        }
    }

    /**
     * 檢查樣式是否隱藏
     * @param {String} attributeName 
     * @return {Boolean} result
     */
    checkStyleHide (attributeName) {
        const cssPropertiesMap = this.element.computedStyleMap()
        let result = false
        switch (attributeName) {
            case STYLE_ATTRIBUTES.FLEX_WRAP:
            case STYLE_ATTRIBUTES.FLEX_DIRECTION:
            case STYLE_ATTRIBUTES.JUSTIFY_CONTENT:
            case STYLE_ATTRIBUTES.ALIGN_ITEMS:
            case STYLE_ATTRIBUTES.FLEX_GROW:
                if (cssPropertiesMap.get("display") && cssPropertiesMap.get("display").value !== 'flex' && cssPropertiesMap.get("display").value !== 'inline-flex')
                    result = true
                break
        }
        return result
    }
}