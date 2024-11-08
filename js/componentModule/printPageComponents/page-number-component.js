import { ATTRIBUTE_NAMES_PRINT } from '../../descriptionModule/utils-object.js'
import { PrintComponent } from "../print-component.js"

export class PageNumberComponent extends PrintComponent {
    static dragName        = 'pageNumber'
    static dragDescription = '頁碼'
    constructor () {
        /** 建構式創建 */
        super('print-component', 'true', '頁碼', 'pageNumber')
        /** 各類型客製化預設設置 */
        this.dataset.textAlign = 'center'
        this.dataset.pageFormat = '第${page.count}頁，共${page.total}頁'
        /** 元件預設呈現結構 - 無 */
        /** 註冊屬性 */
        super.attributes = [
            ATTRIBUTE_NAMES_PRINT.PAGE_FORMAT,
            ATTRIBUTE_NAMES_PRINT.TEXT_ALIGN
        ]
        super.modifyAttribute()
        super.init()
    }

    /** 設定標題文字 */
    setTitle() {
        this.fullComponent.textContent = this.dataset.pageFormat
    }

    /** 合併元件元素 */
    mergeComponent(element) {
        this.dataset.pageFormat = element.dataset.pageFormat
        super.modifyAttribute()
        return true
    }
}