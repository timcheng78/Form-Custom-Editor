import { ATTRIBUTE_NAMES_PRINT } from '../../descriptionModule/utils-object.js'
import { PrintComponent } from "../print-component.js"

export class PageTitleComponent extends PrintComponent {
    static dragName        = 'pageTitle'
    static dragDescription = '頁首元件'
    constructor () {
        /** 建構式創建 */
        super('print-component', 'true', '頁首元件', 'pageTitle')
        /** 各類型客製化預設設置 */
        this.dataset.textAlign = 'center'
        this.dataset.beanName = 'beanName'
        /** 元件預設呈現結構 - 無 */
        /** 註冊屬性 */
        super.attributes = [
            ATTRIBUTE_NAMES_PRINT.BEAN_NAME,
            ATTRIBUTE_NAMES_PRINT.TEXT_ALIGN
        ]
        super.modifyAttribute()
        super.init()
    }

    /** 設定標題文字 */
    setTitle() {
        this.fullComponent.textContent = this.dataset.beanName
    }

    /** 合併元件元素 */
    mergeComponent(element) {
        this.dataset.beanName = element.dataset.beanName
        super.modifyAttribute()
        return true
    }
}