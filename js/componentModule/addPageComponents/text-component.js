import { ATTRIBUTE_NAMES } from '../../descriptionModule/utils-object.js'
import { BaseComponent } from "../base-component.js"
import { AttributeObject } from '../../descriptionModule/attribute-object.js'

export class TextComponent extends BaseComponent {
    static dragName        = 'text'
    static dragDescription = '輸入方塊'
    constructor (name, bean, title) {
        /** 建構式創建 */
        super('form-row-div pFormItem', "true", name, bean, title, "true", 'Y', "false", "true", "text", "true")
        /** 各類型客製化預設設置 */
        this.dataset.controlMode = 'normal'
        /** 元件預設呈現結構 */
        super.HTMLDescription = {
            'input': {
                'type':     'text',
                'class':    'form-control input-default',
                'name':     name,
                'readonly': 'readonly'
            }
        }
        /** 註冊屬性 */
        super.attributes = [
            ATTRIBUTE_NAMES.NAME, 
            ATTRIBUTE_NAMES.EXTERNAL_NAME,
            ATTRIBUTE_NAMES.TITLE, 
            ATTRIBUTE_NAMES.CONTROL_MODE, 
            ATTRIBUTE_NAMES.WIDTH, 
            ATTRIBUTE_NAMES.DEFAULT_VALUE, 
            ATTRIBUTE_NAMES.DONT_DITTO, 
            ATTRIBUTE_NAMES.REQUIRED, 
            ATTRIBUTE_NAMES.PROMPT_TIPS, 
            ATTRIBUTE_NAMES.MAX_LENGTH, 
            ATTRIBUTE_NAMES.PLACEHOLDER, 
            ATTRIBUTE_NAMES.SHOW, 
            ATTRIBUTE_NAMES.INPUT_TYPE
        ]
        super.modifyAttribute()
        super.init()
    }

    /**
     * 改寫父層相同函數
     */
    buildAttributeObject(attrObjectArray, attributeName, zhName, actualValue) {
        switch (attributeName) {
            case ATTRIBUTE_NAMES.CONTROL_MODE:
                // 下拉框模式選擇屬性
                const selectAttributeObject             = new AttributeObject(attributeName, zhName, 'select', actualValue)
                selectAttributeObject.optionDescription = ["預設", "唯讀模式"]
                selectAttributeObject.optionValue       = ["normal", "readOnly"]
                attrObjectArray.push(selectAttributeObject)
                break
            case ATTRIBUTE_NAMES.WIDTH:
                // 拖動區間模式選擇屬性
                actualValue = actualValue || ''
                if (actualValue.indexOf('px') > -1) actualValue = (actualValue.substring(0, actualValue.length - 2) - 0) / 10
                else actualValue = (actualValue - 0) / 10
                attrObjectArray.push(new AttributeObject(attributeName, zhName, 'range', actualValue))
                break
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
            case ATTRIBUTE_NAMES.INPUT_TYPE:
                // 客製化模式選擇屬性
                const buttonNode = {
                    'button': {
                        'class':    'btn btn-primary',
                        'name':     attributeName,
                        'id':       attributeName,
                        'text':     '設定',
                        'onclick':  'inputRuleSetting()'
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
            case ATTRIBUTE_NAMES.WIDTH:
                this.componentElement[0].style.width = actualValue || '100%'
                break
            case ATTRIBUTE_NAMES.DEFAULT_VALUE:
                this.componentElement[0].value = actualValue
                break
            case ATTRIBUTE_NAMES.PLACEHOLDER:
                this.componentElement[0].placeholder = actualValue
                break
        }
    }
}