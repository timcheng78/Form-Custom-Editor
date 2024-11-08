import { ATTRIBUTE_NAMES_LIST } from '../../descriptionModule/utils-object.js'
import { ListComponent } from "../list-component.js"

export class StatusComponent extends ListComponent {
    static dragName        = 'status'
    static dragDescription = '狀態'
    constructor (type) {
        /** 建構式創建 */
        super('web-component', 'true', '狀態', 'true', 'Y', 'status', type)
        /** 各類型客製化預設設置 */
        this.dataset.statusArr 	    = 'Y,N'
        this.dataset.statusDescArr 	= '完成,未完成'
        /** 元件預設呈現結構 - 無 */
        /** 註冊屬性 */
        super.attributes = [
            ATTRIBUTE_NAMES_LIST.STATUS_ARR, 
            ATTRIBUTE_NAMES_LIST.STATUS_DESC_ARR
        ]
        super.modifyAttribute()
        super.init()
    }

    /** 合併元件元素 */
    mergeComponent(element) {
        this.dataset.statusArr      = element.dataset.statusArr
        this.dataset.statusDescArr  = element.dataset.statusDescArr
        super.modifyAttribute()
        return true
    }
}