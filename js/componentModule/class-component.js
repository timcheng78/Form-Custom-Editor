import { AttributeObject } from '../descriptionModule/attribute-object.js'

export class ClassComponent {

    /**
     * @param {Element} element
     * @param {[String]}classList
     * @param {[String]}classZhList
     */
    constructor(element, classList, classZhList) {
        this.element = element
        this.classList = classList
        this.classZhList = classZhList
        this.modifyAttribute()
    }

    /**
     * 樣式切換
     * @param {Element} element
     */
    classChanged(element) {
        let clazz = element.target.value;
        if (clazz) {
            if (element.target.checked) {
                if (!this.element.classList.contains(clazz)) {
                    this.element.classList.add(clazz);
                }
            } else {
                if (this.element.classList.contains(clazz)) {
                    this.element.classList.remove(clazz);
                }
            }
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
                            'onchange': this.classChanged.bind(this)
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
                                                'checked': 	this.element.classList.contains(optionValueArray[i])?'checked' : null ,
                                                'onclick': this.classChanged.bind(this)
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
                            'oninput':  this.classChanged.bind(this)
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
            const attributeName = 'class'
            /** 屬性標題 */
            const zhName        = '樣式'
            // 預設 複選框屬性
            this.buildAttributeObject(attrObjectArr, attributeName, zhName)
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
     */
    buildAttributeObject(attrObjectArray, attributeName, zhName) {
        let attributeObject = new AttributeObject(attributeName, zhName, 'checkbox');
        attributeObject.optionDescription = this.classZhList;
        attributeObject.optionValue = this.classList;
        attrObjectArray.push(attributeObject)
    }

}