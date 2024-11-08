import { ATTRIBUTE_NAMES_LIST } from '../../descriptionModule/utils-object.js'
import { ListComponent } from "../list-component.js"

export class CreateTimeComponent extends ListComponent {
    static dragName        = 'createTime'
    static dragDescription = '創建時間'
    constructor (type) {
        /** 建構式創建 */
        super('web-component', 'true', '創建時間', 'true', 'Y', 'createTime', type)
        /** 各類型客製化預設設置 */
        this.dataset.format = 'yyyy-MM-dd HH:mm'
        /** 元件預設呈現結構 - 無 */
        /** 註冊屬性 */
        super.attributes = [ATTRIBUTE_NAMES_LIST.FORMAT]
        super.modifyAttribute()
        super.init()
    }

    /** 合併元件元素 */
    mergeComponent(element) {
        this.dataset.format = element.dataset.format
        super.modifyAttribute()
        return true
    }
}