import { ATTRIBUTE_NAMES_PRINT } from '../../descriptionModule/utils-object.js'
import { PrintComponent } from "../print-component.js"

export class DateComponent extends PrintComponent {
    static dragName        = 'date'
    static dragDescription = '日期'
    constructor () {
        /** 建構式創建 */
        super('print-component', 'true', '日期', 'date')
        /** 各類型客製化預設設置 */
        this.dataset.textAlign = 'center'
        this.dataset.format = '列印日期:${now.yyyy/MM/dd HH:mm}'
        /** 元件預設呈現結構 - 無 */
        /** 註冊屬性 */
        super.attributes = [
            ATTRIBUTE_NAMES_PRINT.FORMAT,
            ATTRIBUTE_NAMES_PRINT.TEXT_ALIGN
        ]
        super.modifyAttribute()
        super.init()
    }

    /** 設定標題文字 */
    setTitle() {
        this.fullComponent.textContent = this.dataset.format
    }

    /** 合併元件元素 */
    mergeComponent(element) {
        this.dataset.format = element.dataset.format
        super.modifyAttribute()
        return true
    }
}