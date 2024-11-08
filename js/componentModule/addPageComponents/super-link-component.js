import { ATTRIBUTE_NAMES } from '../../descriptionModule/utils-object.js'
import { BaseComponent } from "../base-component.js"
import { AttributeObject } from '../../descriptionModule/attribute-object.js'

export class SuperLinkComponent extends BaseComponent {
    static dragName        = 'superLink'
    static dragDescription = '超連結'
    constructor (name, bean, title) {
        /** 建構式創建 */
        super('form-row-div pFormItem', "true", name, bean, title, "true", 'Y', "false", "true", "superLink", "true")
        /** 各類型客製化預設設置 */
        this.dataset.superLinkIcon      = 'icon/book.png'
        this.dataset.superLinkModel     = '1'
        this.dataset.superLinkUrl       = ''
        this.dataset.superLinkOpenModel = '_blank' 
        /** 元件預設呈現結構 */
        super.HTMLDescription = {
            'img': {
                'class':    'img-fluid image-default',
                'src':      'icon/book.png',
                'name':     name,
                'width':    '50px',
                'height':   '50px'
            }
        }
        /** 註冊屬性 */
        super.attributes = [
            ATTRIBUTE_NAMES.NAME, 
            ATTRIBUTE_NAMES.EXTERNAL_NAME,
            ATTRIBUTE_NAMES.TITLE, 
            ATTRIBUTE_NAMES.SHOW, 
            ATTRIBUTE_NAMES.SUPER_LINK_ICON, 
            ATTRIBUTE_NAMES.SUPER_LINK_MODEL, 
            ATTRIBUTE_NAMES.SUPER_LINK_URL, 
            ATTRIBUTE_NAMES.SUPER_LINK_MODEL
        ]
        super.modifyAttribute()
        super.init()
    }

    /**
     * 改寫父層相同函數
     */
    buildAttributeObject(attrObjectArray, attributeName, zhName, actualValue) {
        switch (attributeName) {
            case ATTRIBUTE_NAMES.SUPER_LINK_MODEL:
            case ATTRIBUTE_NAMES.SUPER_LINK_OPEN_MODEL:
                // 下拉框模式選擇屬性
                const selectAttributeObject             = new AttributeObject(attributeName, zhName, 'select', actualValue)
                selectAttributeObject.optionDescription = ["特定網址", "當前系統下的路徑", "系統內已上傳檔案的檔案"]
                selectAttributeObject.optionValue       = ["1", "2", "3"]
                if (attributeName === 'superLinkOpenModel') {
                    selectAttributeObject.optionDescription = ["開新窗口(_blank)", "最上層窗口(_top)", "相同窗口(_self)", "父窗口(_parent)"]
                    selectAttributeObject.optionValue       = ["_blank", "_top", "_self", "_parent"]
                }
                attrObjectArray.push(selectAttributeObject)
                break
            case ATTRIBUTE_NAMES.SHOW:
            case ATTRIBUTE_NAMES.PRINT_SHOW_TITLE:
                // 單選框模式選擇屬性
                const optionAttributeObject             = new AttributeObject(attributeName, zhName, 'radio', actualValue)
                optionAttributeObject.optionDescription = ["是", "否"]
                optionAttributeObject.optionValue       = ["true", "false"]
                attrObjectArray.push(optionAttributeObject)
                break
            case ATTRIBUTE_NAMES.SUPER_LINK_ICON:
                // 單選框圖案模式選擇屬性
                const imageAttributeObject              = new AttributeObject(attributeName, zhName, 'imageRadio', actualValue)
                imageAttributeObject.optionDescription  = ["book", "link1", "link2"]
                imageAttributeObject.optionValue        = ["icon/book.png", "icon/link1.png", "icon/link2.png"]
                attrObjectArray.push(imageAttributeObject)
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
            case ATTRIBUTE_NAMES.SUPER_LINK_ICON:
                this.componentElement[0].setAttribute('src', actualValue)
                break
        }
        const json = {
            "superLinkIcon": 		this.dataset.superLinkIcon,
            "superLinkModel": 		this.dataset.superLinkModel,
            "superLinkUrl": 		this.dataset.superLinkUrl,
            "superLinkOpenModel": 	this.dataset.superLinkOpenModel
        }
        this.dataset.typeFormat = JSON.stringify(json)
    }
}