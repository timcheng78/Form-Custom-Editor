import { BaseComponent } from "./base-component.js"

export class LabelComponent extends BaseComponent {
    static dragName        = 'label'
    static dragDescription = '標題'
    constructor (name, bean, title) {
        /** 建構式創建 */
        super('', "true", name, bean, title, "true", 'N', "false", "true", "label", "true")
        /** 各類型客製化預設設置 - 無 */
        /** 元件預設呈現結構 */
        super.HTMLDescription = {
            'label': {
                'class':        'h6 canEditDiv',
                'text':         title,
                'draggable':    'true',
                'data-edit':    'true',
            }
        }
        /** 註冊屬性 - 非元件不用註冊屬性 */
        super.init()
    }
}