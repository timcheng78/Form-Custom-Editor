import { ATTRIBUTE_NAMES } from '../../descriptionModule/utils-object.js'
import { BaseComponent } from "../base-component.js"
import { AttributeObject } from '../../descriptionModule/attribute-object.js'

export class SelectComponent extends BaseComponent {
    static dragName        = 'select'
    static dragDescription = '下拉方塊'
    constructor (name, bean, title) {
        /** 建構式創建 */
        super('form-row-div pFormItem', "true", name, bean, title, "true", 'Y', "false", "true", "select", "true")
        /** 各類型客製化預設設置 */
        this.dataset.displayMode 	= 'horizontal'
        this.dataset.uiDesc 		= '選項'
        this.dataset.uiValue 		= '選項'
        this.dataset.checked 		= 'false'
        /** 元件預設呈現結構 */
        super.HTMLDescription       = {
           'select': {
               'class':     'form-control select-default',
               'name':      name,
               'id':        name,
               'children':  []
           }
        }
        this.repeatDescription      = {
            'option': {
                'text':  '選項',
                'value': '選項'
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
            // ATTRIBUTE_NAMES.CHECKED, 
            ATTRIBUTE_NAMES.REQUIRED, 
            ATTRIBUTE_NAMES.PROMPT_TIPS, 
            ATTRIBUTE_NAMES.SHOW
        ]
        super.modifyAttribute()
        super.init()
    }

    /**
     * 製作元件前處理
     * 若有客製化需要
     * 繼承後修改即可
     * @returns 
     */
    generateBeforeChanged() {
        const uiDesc        = this.dataset.uiDesc || '' 
        const uiValue       = this.dataset.uiValue || ''
        const descArray     = uiDesc.split(',')
        const valueArray    = uiValue.split(',')
        const resultArray   = []
        let count           = descArray.length > valueArray.length ? descArray.length : valueArray.length
        for (let i = 0; i < count; ++i) {
            /** deep copy */
            const cloneDescription = JSON.parse(JSON.stringify(this.repeatDescription))
            cloneDescription.option.value   = valueArray[i] || '選項'
            cloneDescription.option.text    = descArray[i] || '選項'
            resultArray.push(cloneDescription)
        }
        super.HTMLDescription.select.children = resultArray
        return true
    }

    /**
     * 改寫父層相同函數
     */
    componentAttributeChanged(attributeName, actualValue) {
        switch (attributeName) {
            case ATTRIBUTE_NAMES.OPTION_EDIT:
            case ATTRIBUTE_NAMES.UI_DESC:
			case ATTRIBUTE_NAMES.UI_VALUE:
                const newOptionsArray   = this.dataset.uiDesc.split(',')
                const newValueArray     = this.dataset.uiValue.split(',')
                let optionLength        = this.componentElement[0].children.length
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
                            cloneDescription.option.value   = newValueArray[i] || '選項'
                            cloneDescription.option.text    = newOptionsArray[i] || '選項'
                            const optionElement = cloneDescription.createElemental()[0]
                            this.componentElement[0].appendChild(optionElement)
                        }
                    }
                    if (optionLength > newOptionsArray.length) {
                        // 若原始長度 > 新建立長度，則盡可能智能減少差異數量
                        const differ = optionLength - newOptionsArray.length
                        for (let i = 0; i < differ; ++i) {
                            this.componentElement[0].removeChild(this.componentElement[0].lastElementChild)
                        }
                    }
                    this.makingOption()
                }
                break
            case ATTRIBUTE_NAMES.CHECKED:
                this.makingOption()
                break
        }
    }

    makingOption() {
        this.componentElement[0].childNodes.forEach((element, index) => {
            const uiDesc        = this.dataset.uiDesc
            const uiValue       = this.dataset.uiValue
            const checked       = this.dataset.checked || ''
            element.textContent = uiDesc.split(',')[index]
            element.selected    = checked.split(',')[index] === 'true'
            element.value       = uiValue.split(',')[index]
        })
        try {
            this.container.forEach(element => {
                if (element.classList.contains('pFormItem')) {
                    const selectElement = element.querySelector('select')
                    if (selectElement) selectElement = this.componentElement[0]
                    else element.appendChild(this.componentElement[0])
                    this.fullComponent  = element
                    throw { } // break
                }
            })
        } catch (e) { }
    }

    /**
     * 依照各類型轉換特殊屬性節點
     * @param {Object} verStructure
     * @returns 
     */
    convertItByType(verStructure) {
        verStructure.uiDesc  = this.uiDesc
        verStructure.uiValue = this.uiValue
        if (Array.isArray(this.checked) && this.checked.length > 0 && this.checked[0] === '') verStructure.checked = null
        else verStructure.checked = this.checked
        return true
    }
}