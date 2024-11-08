import { ListComponent } from "../list-component.js"

export class LastUpdIdComponent extends ListComponent {
    static dragName        = 'lastUpdId'
    static dragDescription = '最後修改者編號'
    constructor (type) {
        /** 建構式創建 */
        super('web-component', 'true', '最後修改者編號', 'true', 'Y', 'lastUpdId', type)
        /** 各類型客製化預設設置 - 無 */
        /** 元件預設呈現結構 - 無 */
        /** 註冊屬性 - 無 */
        super.init()
    }
}