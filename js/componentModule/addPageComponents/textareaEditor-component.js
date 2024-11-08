import { ATTRIBUTE_NAMES } from '../../descriptionModule/utils-object.js'
import { BaseComponent } from "../base-component.js"
import { AttributeObject } from '../../descriptionModule/attribute-object.js'

export class TextareaEditorComponent extends BaseComponent {
    static dragName        = 'textareaEditor'
    static dragDescription = '文字編輯器'
    constructor (name, bean, title) {
        /** 建構式創建 */
        super('form-group pFormItem', "true", name, bean, title, "true", 'Y', "false", "true", "textareaEditor", "true")
        /** 元件預設呈現結構 */
        super.HTMLDescription = {
            'div': {
                'class':    'iframe-block text-center',
                'children': [
                    {
                        'label': {
                            'class': 'iframe-text',
                            'text':  'TextareaEditor'
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
            ATTRIBUTE_NAMES.CONTROL_MODE,
            ATTRIBUTE_NAMES.SHOW,
            ATTRIBUTE_NAMES.WIDTH,
            ATTRIBUTE_NAMES.HEIGHT,
            ATTRIBUTE_NAMES.DEFAULT_VALUE,
            ATTRIBUTE_NAMES.DONT_DITTO,
            ATTRIBUTE_NAMES.REQUIRED
        ];
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
                selectAttributeObject.optionDescription = ["預設", "唯獨模式"]
                selectAttributeObject.optionValue       = ["normal", "readOnly"]
                attrObjectArray.push(selectAttributeObject)
                break
            case ATTRIBUTE_NAMES.WIDTH:
            case ATTRIBUTE_NAMES.HEIGHT:
                // 拖動區間模式選擇屬性
                if (attributeName === ATTRIBUTE_NAMES.WIDTH) actualValue = actualValue || '250px'
                else if (attributeName === ATTRIBUTE_NAMES.HEIGHT) actualValue = actualValue || '250px'
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
            case ATTRIBUTE_NAMES.WIDTH:
                this.componentElement[0].style.width = actualValue
                break
            case ATTRIBUTE_NAMES.HEIGHT:
                if (actualValue === '500px') actualValue = '100%'
                this.fullComponent.style.height = actualValue || '250px'
                this.componentElement[0].style.height = actualValue || '250px'
                break
        }
    }

}