import { ListComponent } from "../list-component.js"

export class LastUpdNameComponent extends ListComponent {
    static dragName        = 'lastUpdName'
    static dragDescription = '最後修改者'
    constructor (type) {
        /** 建構式創建 */
        super('web-component', 'true', '最後修改者', 'true', 'Y', 'lastUpdName', type)
        /** 各類型客製化預設設置 - 無 */
        /** 元件預設呈現結構 - 無 */
        /** 註冊屬性 - 無 */
        super.init()
    }
}