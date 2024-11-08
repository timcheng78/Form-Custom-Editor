import { ListComponent } from "../list-component.js"

export class SerialNumberComponent extends ListComponent {
    static dragName        = 'serialNumber'
    static dragDescription = '序號'
    constructor (type) {
        /** 建構式創建 */
        super('web-component', 'true', '序號', 'true', 'Y', 'serialNumber', type)
        /** 各類型客製化預設設置 - 無 */
        /** 元件預設呈現結構 - 無 */
        /** 註冊屬性 - 無 */
        super.init()
    }
}