import { ListComponent } from "../list-component.js"

export class CreatorIdComponent extends ListComponent {
    static dragName        = 'creatorId'
    static dragDescription = '創建者編號'
    constructor (type) {
        /** 建構式創建 */
        super('web-component', 'true', '創建者編號', 'true', 'Y', 'creatorId', type)
        /** 各類型客製化預設設置 - 無 */
        /** 元件預設呈現結構 - 無 */
        /** 註冊屬性 - 無 */
        super.init()
    }
}