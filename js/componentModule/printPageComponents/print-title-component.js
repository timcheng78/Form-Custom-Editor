import { ATTRIBUTE_NAMES_PRINT } from '../../descriptionModule/utils-object.js'
import { PrintComponent } from "../print-component.js"

export class PrintTitleComponent extends PrintComponent {
    static dragName        = 'printTitle'
    static dragDescription = '標題'
    constructor () {
        /** 建構式創建 */
        super('print-component canEditDiv', 'true', '標題', 'printTitle')
        /** 各類型客製化預設設置 */
        this.dataset.textAlign = 'center'
        /** 元件預設呈現結構 - 無 */
        /** 註冊屬性 */
        super.attributes = [ATTRIBUTE_NAMES_PRINT.TEXT_ALIGN]
        super.modifyAttribute()
        super.init()
    }

    /** 合併元件元素 */
    mergeComponent(element) {
        this.dataset.textAlign = element.dataset.textAlign
        super.modifyAttribute()
        return true
    }
}