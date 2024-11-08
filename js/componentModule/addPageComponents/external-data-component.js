import { ATTRIBUTE_NAMES } from '../../descriptionModule/utils-object.js'
import { BaseComponent } from "../base-component.js"
import { AttributeObject } from '../../descriptionModule/attribute-object.js'

export class ExternalDataComponent extends BaseComponent {
    static dragName        = 'externalData'
    static dragDescription = '彈出外部資料'
    constructor (name, bean, title) {
        /** 建構式創建 */
        super('form-row-div pFormItem', "true", name, bean, title, "true", 'Y', "false", "true", "externalData", "true")
        /** 各類型客製化預設設置 */
        this.dataset.placeholder    = '彈出外部資料'
        this.dataset.style          = 'btn btn-primary'
        this.dataset.typeFormat     = '{}'
        /** 元件預設呈現結構 */
        super.HTMLDescription = {
            'button': {
                'type':     'button',
                'class':    'btn btn-primary btn-default',
                'name':     name,
                'text':     '彈出外部資料'
            }
        }
        /** 註冊屬性 */
        super.attributes = [
            ATTRIBUTE_NAMES.NAME, 
            ATTRIBUTE_NAMES.EXTERNAL_NAME,
            ATTRIBUTE_NAMES.TITLE,
            ATTRIBUTE_NAMES.DONT_DITTO,  
            ATTRIBUTE_NAMES.PLACEHOLDER, 
            ATTRIBUTE_NAMES.STYLE, 
            ATTRIBUTE_NAMES.INFORMATION, 
            ATTRIBUTE_NAMES.ICON_POSITION, 
            ATTRIBUTE_NAMES.REQUIRED, 
            ATTRIBUTE_NAMES.SHOW
        ]
        super.modifyAttribute()
        super.init()
    }

    /**
     * 改寫父層相同函數
     */
    buildAttributeObject(attrObjectArray, attributeName, zhName, actualValue) {
        switch (attributeName) {
            case ATTRIBUTE_NAMES.STYLE:
                // 下拉框模式選擇屬性
                const selectAttributeObject             = new AttributeObject(attributeName, zhName, 'select', actualValue)
                selectAttributeObject.optionDescription = ["藍色", "灰色", "綠色", "紅色", "黃色", "藍綠色", "白色", "黑色"]
                selectAttributeObject.optionValue       = ["btn btn-primary", "btn btn-secondary", "btn btn-success", "btn btn-danger", "btn btn-warning", "btn btn-info", "btn btn-light", "btn btn-dark"]
                attrObjectArray.push(selectAttributeObject)
                break
            case ATTRIBUTE_NAMES.DONT_DITTO:
            case ATTRIBUTE_NAMES.REQUIRED:
            case ATTRIBUTE_NAMES.INFORMATION:
            case ATTRIBUTE_NAMES.ICON_POSITION:
            case ATTRIBUTE_NAMES.SHOW:
            case ATTRIBUTE_NAMES.PRINT_SHOW_TITLE:
                // 單選框模式選擇屬性
                const optionAttributeObject             = new AttributeObject(attributeName, zhName, 'radio', actualValue)
                optionAttributeObject.optionDescription = ["是", "否"]
                optionAttributeObject.optionValue       = ["true", "false"]
                if (attributeName === ATTRIBUTE_NAMES.DONT_DITTO) optionAttributeObject.optionValue = ["false", "true"]
                else if (attributeName === ATTRIBUTE_NAMES.INFORMATION) {
                    optionAttributeObject.optionDescription = ["無", "<i class='bi bi-check'></i>", "<i class='bi bi-exclamation-circle'></i>", "<i class='bi bi-eye'></i>", "<i class='bi bi-info-circle'></i>", "<i class='bi bi-info'></i>", "<i class='bi bi-plus'></i>", "<i class='bi bi-dash'></i>", "<i class='bi bi-question-circle'></i>", "<i class='bi bi-x'></i>"]
                    optionAttributeObject.optionValue       = ["", "bi bi-check", "bi bi-exclamation-circle", "bi bi-eye", "bi bi-info-circle", "bi bi-info", "bi bi-plus", "bi bi-dash", "bi bi-question-circle", "bi bi-x"]
                } else if (attributeName === ATTRIBUTE_NAMES.ICON_POSITION) {
                    optionAttributeObject.optionDescription = ["前", "後"]
                    optionAttributeObject.optionValue       = ["before", "after"]
                }
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
            case ATTRIBUTE_NAMES.PLACEHOLDER:
                this.componentElement[0].childNodes.forEach(node => {
                    if (node instanceof Text) node.textContent = actualValue
                })
                break
            case ATTRIBUTE_NAMES.STYLE:
                this.componentElement[0].classList.value = `${ actualValue } btn-default`
                break
            case ATTRIBUTE_NAMES.INFORMATION:
                if (this.componentElement[0].querySelector('i') === null) {
                    this.componentElement[0].appendChild({
                        'i': {
                            'class': actualValue
                        }
                    }.createElemental()[0])
                }
                this.componentElement[0].childNodes.forEach(node => {
                    if (node instanceof Element) node.classList.value = actualValue
                })
                break
            case ATTRIBUTE_NAMES.ICON_POSITION:
                if (actualValue === 'before') {
                    this.componentElement[0].childNodes.forEach((node, index) => {
                        if (node instanceof Element && index === 1) this.componentElement[0].insertBefore(this.componentElement[0].childNodes[1], this.componentElement[0].childNodes[0]) 
                    })
                } else {
                    this.componentElement[0].childNodes.forEach((node, index) => {
                        if (node instanceof Element && index === 0) this.componentElement[0].insertBefore(this.componentElement[0].childNodes[1], this.componentElement[0].childNodes[0]) 
                    })
                }
                break
        }
    }

    /**
     * 依照各類型轉換特殊屬性節點
     * @param {Object} verStructure
     * @returns 
     */
    convertItByType(verStructure) {
        if (this.dataset.script) {
            const script = SharedUtils.onionStringDecode(this.dataset.script)
            if ((typeof script[0].externalData.isShowDiv === 'boolean' && script[0].externalData.isShowDiv) || (script[0].externalData.isShowDiv === 'true')) 
                script[0].externalData.isShowDiv = true
            else script[0].externalData.isShowDiv = false
            if ((typeof script[0].externalData.isKeepDataNewest === 'boolean' && script[0].externalData.isKeepDataNewest) || (script[0].externalData.isKeepDataNewest === 'true')) 
                script[0].externalData.isKeepDataNewest = true
            else script[0].externalData.isKeepDataNewest = false
            verStructure.typeFormat = JSON.stringify(script[0].externalData)
        }
    }

    /**
     * 轉置格式屬性
     * @param {String} attribute 
     * @param {Object} typeFormat 
     */
    convertTypeFormat(attribute, typeFormat) {
        if (!this.dataset.script) {
            const script = {
                name: '自動生成腳本名稱',
				type: 'import',
				options: '[]',
				range: '[]',
				weightBean: undefined,
				heightBean: undefined,
				externalData: typeFormat
            }
            this.dataset.script = JSON.stringify([script])
        }
    }
}