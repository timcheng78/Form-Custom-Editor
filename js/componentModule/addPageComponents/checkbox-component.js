import { ATTRIBUTE_NAMES } from '../../descriptionModule/utils-object.js'
import { BaseComponent } from "../base-component.js"
import { AttributeObject } from '../../descriptionModule/attribute-object.js'

export class CheckboxComponent extends BaseComponent {
    static dragName        = 'checkbox'
    static dragDescription = '多選方塊'
    constructor (name, bean, title) {
        /** 建構式創建 */
        super('form-group pFormItem', "true", name, bean, title, "true", 'Y', "false", "true", "checkbox", "true")
        /** 各類型客製化預設設置 */
        this.dataset.displayMode 	= 'horizontal'
        this.dataset.uiDesc 		= '選項'
        this.dataset.uiValue 		= '選項'
        this.dataset.checked 		= 'false'
        /** 元件預設呈現結構 */
        super.HTMLDescription       = []
        this.repeatDescription      = {
            'div': {
                'class':    'form-check form-check-inline',
                'children': [
                    {
                        "input": {
                            "type":     "checkbox",
                            "class":    "form-check-input checkbox-default checkboxFormItem",
                            "value":    "選項",
                            "name":     name,
                            "id":       name,
                        }
                    },
                    {
                        "label": {
                            "class":    "form-check-label radio-label-default ckLabelFormItem",
                            "for":      name,
                            "text":     "選項"
                        }
                    }
                ]
            }
        }
        
        /** 註冊屬性 */
        super.attributes = [
            ATTRIBUTE_NAMES.NAME, 
            ATTRIBUTE_NAMES.EXTERNAL_NAME,
            ATTRIBUTE_NAMES.TITLE, 
            ATTRIBUTE_NAMES.DONT_DITTO, 
            ATTRIBUTE_NAMES.OPTION_EDIT,
            // ATTRIBUTE_NAMES.UI_DESC, 
            // ATTRIBUTE_NAMES.UI_VALUE, 
            // ATTRIBUTE_NAMES.UI_SCORE, 
            ATTRIBUTE_NAMES.DISPLAY_MODE, 
            // ATTRIBUTE_NAMES.CHECKED, 
            ATTRIBUTE_NAMES.REQUIRED, 
            ATTRIBUTE_NAMES.PROMPT_TIPS, 
            ATTRIBUTE_NAMES.SHOW, 
            ATTRIBUTE_NAMES.UI_CLASS
        ]
        super.modifyAttribute()
        super.init()
    }

    /** 設定重複元素屬性結構 */
    set repeatDescription(repeatDescription) {
        this._repeatDescription = repeatDescription
    }

    /** 取得重複元素屬性結構 */
    get repeatDescription() {
        return this._repeatDescription
    }

    get horizontalFormItem() {
        if (this.dataset.horizontalFormItem) {
            if (typeof this.dataset.horizontalFormItem === 'string')
                return this.dataset.horizontalFormItem.split('|,|')
            else 
                return `${ this.dataset.horizontalFormItem }`.split('|,|')
        } else return this.dataset.horizontalFormItem
    }

    /**
     * 製作元件前處理
     * 若有客製化需要
     * 繼承後修改即可
     * @returns 
     */
    generateBeforeChanged() {
        const resultArray   = []
        let count           = this.uiDesc.length > this.uiValue.length ? this.uiDesc.length : this.uiValue.length
        for (let i = 0; i < count; ++i) {
            /** deep copy */
            const cloneDescription = JSON.parse(JSON.stringify(this.repeatDescription))
            cloneDescription.div.children[0].input.value    = this.uiValue[i]
            cloneDescription.div.children[0].input.id       += i
            cloneDescription.div.children[1].label.for      += i
            cloneDescription.div.children[1].label.text     = this.uiDesc[i]
            resultArray.push(cloneDescription)
        }
        super.HTMLDescription = resultArray
        return true
    }

    /**
     * 改寫父層相同函數
     */
    buildAttributeObject(attrObjectArray, attributeName, zhName, actualValue) {
        switch (attributeName) {
            case ATTRIBUTE_NAMES.UI_CLASS:
                // 下拉框模式選擇屬性
                const selectAttributeObject             = new AttributeObject(attributeName, zhName, 'select', actualValue)
                selectAttributeObject.optionDescription = ["無", "按鈕樣式"]
                selectAttributeObject.optionValue       = ["0","checkbox-radio-style-1"]
                attrObjectArray.push(selectAttributeObject)
                break
            case ATTRIBUTE_NAMES.DONT_DITTO:
            case ATTRIBUTE_NAMES.REQUIRED:
            case ATTRIBUTE_NAMES.SHOW:
            case ATTRIBUTE_NAMES.DISPLAY_MODE:
            case ATTRIBUTE_NAMES.PRINT_SHOW_TITLE:
                // 單選框模式選擇屬性
                const optionAttributeObject             = new AttributeObject(attributeName, zhName, 'radio', actualValue)
                optionAttributeObject.optionDescription = ["是", "否"]
                optionAttributeObject.optionValue       = ["true", "false"]
                if (attributeName === ATTRIBUTE_NAMES.DONT_DITTO) optionAttributeObject.optionValue = ["false", "true"]
                else if (attributeName === ATTRIBUTE_NAMES.DISPLAY_MODE) {
                    optionAttributeObject.optionDescription = ["垂直", "水平"]
                    optionAttributeObject.optionValue       = ["vertical", "horizontal"]
                }
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
                        'onclick':  super.adjustOptions.bind(this)
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
     * 改寫父層相同函數
     */
    componentAttributeChanged(attributeName, actualValue) {
        switch (attributeName) {
            case ATTRIBUTE_NAMES.NAME:
                this.componentElement.forEach(element => {
                    const checkbox = element.querySelector('.form-check-input')
                    checkbox.name = actualValue
                })
                break
            case ATTRIBUTE_NAMES.OPTION_EDIT:
            case ATTRIBUTE_NAMES.UI_DESC:
			case ATTRIBUTE_NAMES.UI_VALUE:
                const newOptionsArray   = this.uiDesc
                const newValueArray     = this.uiValue
                let optionLength        = this.componentElement.length
                // 長度一樣則不建立任何新元件，純粹修改原有參數
                if (newOptionsArray.length === optionLength) {
                    this.makingOption()
                } else {
                    // 若長度不一樣則依照差異去增減
                    if (newOptionsArray.length > optionLength) {
                        // 若新建立長度 > 原始長度，則添加差異數量
                        const differ = newOptionsArray.length - optionLength
                        for (let i = 0; i < differ; ++i) {
                            /** deep copy */
                            const cloneDescription = JSON.parse(JSON.stringify(this.repeatDescription))
                            cloneDescription.div.children[0].input.value    = newValueArray[i] || '選項'
                            cloneDescription.div.children[0].input.id       += i + optionLength
                            cloneDescription.div.children[1].label.for      += i + optionLength
                            cloneDescription.div.children[1].label.text     = newOptionsArray[i] || '選項'
                            const optionElement = cloneDescription.createElemental()[0]
                            if (this.fullComponent.classList.contains('selected')) {
                                const beanBefore = CreateUtils.createBeanElement({
                                    'controlType': 'div',
                                    'attribute': 	[
                                        {
                                            'class': 'bean-drop drop-before',
                                            'data-role': 'drag-drop-container-bean'
                                        }
                                    ]
                                })[0]
                                const beanAfter = CreateUtils.createBeanElement({
                                    'controlType': 'div',
                                    'attribute': 	[
                                        {
                                            'class': 'bean-drop drop-after',
                                            'data-role': 'drag-drop-container-bean'
                                        }
                                    ]
                                })[0]
                                optionElement.prepend(beanBefore)
                                optionElement.appendChild(beanAfter)
                            }
                            this.componentElement.push(optionElement)
                        }
                    }
                    if (optionLength > newOptionsArray.length) {
                        // 若原始長度 > 新建立長度，則盡可能智能減少差異數量
                        const differ = optionLength - newOptionsArray.length
                        for (let i = 0; i < differ; ++i) {
                            this.componentElement.pop()
                        }
                    }
                    this.makingOption()
                }
                break
            case ATTRIBUTE_NAMES.CHECKED:
			case ATTRIBUTE_NAMES.UI_SCORE:
                this.makingOption()
                break
            case ATTRIBUTE_NAMES.DISPLAY_MODE:
                this.componentElement.forEach(element => {
                    if (actualValue === 'vertical') {
                        element.classList.remove('form-check-inline')
                        element.classList.add('d-flex', 'align-items-center')
                    }
                    if (actualValue === 'horizontal') {
                        element.classList.remove('d-flex', 'align-items-center')
                        element.classList.add('form-check-inline')
                    }
                })
                break
            case ATTRIBUTE_NAMES.UI_CLASS:
                this.componentElement.forEach(element => {
                    const checkbox = element.querySelector('.form-check-input')
                    if (actualValue === '' || actualValue === '0') checkbox.classList.value = 'form-check-input checkbox-default checkboxFormItem'
                    else checkbox.classList.add(actualValue)
                })
                break
        }
    }

    /**
     * 製作選項(相同數量製作)
     */
    makingOption() {
        this.componentElement.forEach((element, index) => {
            const labelElement  = element.querySelector('.form-check-label')
            const checkbox      = element.querySelector('.form-check-input')
            const uiDesc        = this.uiDesc
            const uiValue       = this.uiValue
            const checked       = this.dataset.checked || ''
            labelElement.textContent = uiDesc[index]
            checkbox.value = uiValue[index]
            checkbox.checked = checked.split(',')[index] === 'true'
        })
        try {
            this.container.forEach(element => {
                if (element.classList.contains('pFormItem')) {
                    element.innerHTML = ''
                    this.componentElement.forEach(innerElement => {
                        element.appendChild(innerElement)
                    })
                    // this.fullComponent  = element
                    throw { } // break
                }
            })
        } catch (e) { }
    }

    /**
     * 克隆元件(若需客製繼承修改即可)
     */
    cloneComponent() {
        /** 引入工廠 */
        const factory = window.ComponentFactory 
        for (let type in factory.baseComponent) {
            if (this instanceof factory.baseComponent[type]) {
                const component = super.createCustomComponent(factory.baseComponent[type])
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
                if (this.horizontalFormItem) {
                    for (let i = 0, len = this.horizontalFormItem.length; i < len; ++i) {
                        const itemArray = this.horizontalFormItem[i].split(',')
                        for (let item of itemArray) {
                            const childComponent = factory.getRegisterComponentByName(item)
                            if (!childComponent) continue
                            const cloneComponent = childComponent.cloneComponent()
                            component.componentElement[i].appendChild(cloneComponent.fullComponent)
                        }
                    }
                }
                factory.setRegisterComponent(component)
                return component
            }
        }
    }

    /** 
     * 檢查任何需要再製作結構前的函數
     * 改寫父層相同函數
     */
    checkingByItself() {
        // checkbox setting horizontalFormItem (設定選取框的展開元件屬性)
        if (!this.fullComponent.closest('html') && !this.printComponent.closest('html')) this.abandoned = true
        else this.abandoned = false
        // 檢查父層是否還存在
        if (this.dataset.parent && !this.fullComponent.closest(`div[data-name="${ this.dataset.parent }"]`)) this.dataset.parent = undefined
        if (this.dataset.treeParent && !this.fullComponent.closest(`div[data-name="${ this.dataset.treeParent }"]`)) this.dataset.treeParent = undefined
        /** 引入工廠 */
        const factory           = window.ComponentFactory
        /** 取得選項標題陣列 */
        const descArray         = this.uiDesc
        /** 製作一個相同數量的陣列便於儲存展開元件名稱 */
        const horizontalArray   = new Array(descArray.length).fill('')
        /** 取得選項底下的全部元件 */
        const checkboxBeans     = this.fullComponent.querySelectorAll('.pFormItem[data-name], .pFormItemGroup[data-name]')
        checkboxBeans.forEach(bean => {
            // checkbox 結構為兩層到父層
            if (bean.parentNode.parentNode === this.fullComponent) {
                const name                  = bean.dataset.name
                const component             = factory.getRegisterComponentByName(name)
                component.dataset.treeParent    = this.dataset.name
                if (horizontalArray[this.fullComponent.children.indexOf(bean.parentNode)].length > 0) horizontalArray[this.fullComponent.children.indexOf(bean.parentNode)] += ','
                    horizontalArray[this.fullComponent.children.indexOf(bean.parentNode)] += component.dataset.name
            }
        })
        this.dataset.horizontalFormItem = horizontalArray.join('|,|')
    }

    /**
     * 結構萃取
     * =
     * 取得結構內非元件類的元素(標題)
     * 改寫父層相同函數
     */
    structureExtraction() {
        if (!this.structure) return false
        const element       = this.structure.createElemental()[0]
        const internal      = SharedUtils.onionStringDecode(element.dataset.structure)
        if (!internal) return false
        const beans         = internal.createElemental()
        beans.forEach((bean, index) => {
            let before      = true
            const beforeArray   = []
            const afterArray    = []
            bean.childNodes.forEach(child => {
                if (!(child.classList.contains('form-check-input') || child.classList.contains('form-check-label'))) {
                    if (before) beforeArray.push(child)
                    else afterArray.push(child)
                } else before = false
            })
            beforeArray.forEach(child => {
                if (!this.componentElement[index].querySelector(`.pFormItem[data-name="${ child.dataset.name }"], .pFormItemGroup[data-name="${ child.dataset.name }"]`))
                    this.componentElement[index].prepend(child)
            })
            afterArray.forEach(child => {
                if (!this.componentElement[index].querySelector(`.pFormItem[data-name="${ child.dataset.name }"], .pFormItemGroup[data-name="${ child.dataset.name }"]`))
                    this.componentElement[index].appendChild(child)
            })
        })
    }

    /**
     * 依照各類型轉換特殊屬性節點
     * @param {Object} verStructure
     * @returns 
     */
    convertItByType(verStructure) {
        verStructure.uiDesc  = this.uiDesc
        verStructure.uiValue = this.uiValue
        verStructure.uiScore = this.uiScore
        if (Array.isArray(this.checked) && this.checked.length > 0 && this.checked[0] === '') verStructure.checked = null
        else verStructure.checked = this.checked
        return true
    }
}