import { ListComponent } from "../list-component.js"

export class ParentVersionComponent extends ListComponent {
    static dragName        = 'parentVersion'
    static dragDescription = '來源'
    constructor (type) {
        /** 建構式創建 */
        super('web-component', 'true', '來源', 'true', 'Y', 'parentVer', type)
        /** 各類型客製化預設設置 - 無 */
        /** 元件預設呈現結構 - 無 */
        /** 註冊屬性 - 無 */
        super.init()
    }
}