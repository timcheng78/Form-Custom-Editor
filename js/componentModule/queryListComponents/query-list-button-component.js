import { ATTRIBUTE_NAMES_QUERY_LIST } from '../../descriptionModule/utils-object.js'
import { AttributeObject } from '../../descriptionModule/attribute-object.js'
import { QueryListComponent } from "../query-list-component.js"

export class QueryListButtonComponent extends QueryListComponent {
    constructor () {
        /** 建構式創建 */
        super('btn btn-primary', CreateUtils.createRandomCode() + Math.floor(Math.random() * 99), '按鈕', 'true', 'button')
        /** 各類型客製化預設設置 - 無 */
        /** 元件預設呈現結構 - 無 */
        /** 註冊屬性 */
        super.attributes = [
            ATTRIBUTE_NAMES_QUERY_LIST.TEXT,
            ATTRIBUTE_NAMES_QUERY_LIST.STYLE,
            ATTRIBUTE_NAMES_QUERY_LIST.FUNCTIONS
        ]
        super.modifyAttribute()
        super.init()
    }

    /** 重製元件 */
    reGenerateComponent(attributeObject) {
        if (!super.fullComponent) {
            const button = CreateUtils.createBeanElement({
                'controlType': 'button',
                'attribute': [attributeObject]
            })[0]
            super.fullComponent = button
        }
        return super.fullComponent
    }

    /**
     * 改寫父層相同函數
     */
    buildAttributeObject(attrObjectArray, attributeName, zhName, actualValue) {
        switch (attributeName) {
            case ATTRIBUTE_NAMES_QUERY_LIST.STYLE:
                // 下拉框模式選擇屬性
                const selectAttributeObject             = new AttributeObject(attributeName, zhName, 'select', actualValue)
                selectAttributeObject.optionDescription = ["藍色", "灰色", "綠色", "紅色", "黃色", "藍綠色", "白色", "黑色"]
                selectAttributeObject.optionValue       = ["btn btn-primary", "btn btn-secondary", "btn btn-success", "btn btn-danger", "btn btn-warning", "btn btn-info", "btn btn-light", "btn btn-dark"]
                attrObjectArray.push(selectAttributeObject)
                break
            case ATTRIBUTE_NAMES_QUERY_LIST.FUNCTIONS:
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
            case ATTRIBUTE_NAMES_QUERY_LIST.TEXT:
                this.fullComponent.textContent = actualValue
                break
            case ATTRIBUTE_NAMES_QUERY_LIST.STYLE:
                if (this.fullComponent.classList.contains('selected')) this.fullComponent.classList.value = actualValue + ' selected'
                else this.fullComponent.classList.value = actualValue
                this.attribute.class = this.fullComponent.classList.value
                break
        }
    }

    /** 合併元件元素 */
    mergeComponent(element) {
        super.modifyAttribute()
        return true
    }
}