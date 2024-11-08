import { ListComponent } from "../list-component.js"

export class CurrentVersionComponent extends ListComponent {
    static dragName        = 'currentVersion'
    static dragDescription = '版本'
    constructor (type) {
        /** 建構式創建 */
        super('web-component', 'true', '版本', 'true', 'Y', 'currVer', type)
        /** 各類型客製化預設設置 - 無 */
        /** 元件預設呈現結構 - 無 */
        /** 註冊屬性 - 無 */
        super.init()
    }
}