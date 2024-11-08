import { ATTRIBUTE_NAMES } from '../../descriptionModule/utils-object.js'
import { BaseComponent } from "../base-component.js"
import { AttributeObject } from '../../descriptionModule/attribute-object.js'

export class FileUploadComponent extends BaseComponent {
    static dragName        = 'fileUpload'
    static dragDescription = '上傳檔案'
    constructor (name, bean, title) {
        /** 建構式創建 */
        super('form-row-div pFormItem', "true", name, bean, title, "true", 'Y', "false", "true", "file", "true")
        /** 各類型客製化預設設置 */
        this.dataset.fileMode = 'fileDefaultMultiple'
        /** 元件預設呈現結構 */
        super.HTMLDescription = {
            'input': {
                'type':     'file',
                'class':    'form-control-file',
                'name':     name,
                'onclick': 'return false'
            }
        }
        /** 註冊屬性 */
        super.attributes = [
            ATTRIBUTE_NAMES.NAME, 
            ATTRIBUTE_NAMES.EXTERNAL_NAME,
            ATTRIBUTE_NAMES.TITLE, 
            ATTRIBUTE_NAMES.DONT_DITTO, 
            ATTRIBUTE_NAMES.REQUIRED, 
            ATTRIBUTE_NAMES.SHOW, 
            ATTRIBUTE_NAMES.FILETYPE, 
            ATTRIBUTE_NAMES.FILE_MODE
        ]
        super.modifyAttribute()
        super.init()
    }

    /**
     * 改寫父層相同函數
     */
    buildAttributeObject(attrObjectArray, attributeName, zhName, actualValue) {
        switch (attributeName) {
            case ATTRIBUTE_NAMES.FILE_MODE:
                // 下拉框模式選擇屬性
                const selectAttributeObject             = new AttributeObject(attributeName, zhName, 'select', actualValue)
                selectAttributeObject.optionDescription = ["基礎多檔案上傳", "含管理功能的檔案上傳"]
                selectAttributeObject.optionValue       = ["fileDefaultMultiple", "fileManageUpload"]
                attrObjectArray.push(selectAttributeObject)
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
            case ATTRIBUTE_NAMES.FILETYPE:
                // 多選框模式選擇屬性
                const checkboxAttributeObject             = new AttributeObject(attributeName, zhName, 'checkbox', actualValue)
                checkboxAttributeObject.optionDescription = ["圖案", "影片", "聲音", "word類", "excel類", "ppt類", "pdf"]
                checkboxAttributeObject.optionValue       = ["image/*", "video/*", "audio/*", "application/msword|@@|application/vnd.openxmlformats-officedocument.wordprocessingml.document", ".csv|@@|application/vnd.ms-excel|@@|application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-powerpoint|@@|application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/pdf"]
                attrObjectArray.push(checkboxAttributeObject)
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
            case ATTRIBUTE_NAMES.FILETYPE:
                this.componentElement.forEach(element => {
                    element.accept = actualValue
                })
                break
        }
    }
}