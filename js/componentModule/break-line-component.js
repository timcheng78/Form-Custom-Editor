import { BaseComponent } from "./base-component.js"

export class BreakLineComponent extends BaseComponent {
    static dragName        = 'breakLine'
    static dragDescription = '換行'
    constructor (name, bean, title) {
        /** 建構式創建 */
        super('', "true", name, bean, title, "true", 'N', "false", "true", "breakLine", "true")
        /** 各類型客製化預設設置 - 無 */
        /** 元件預設呈現結構 */
        super.HTMLDescription = {
            'div': {
                'class':        'break-line-div',
                'draggable':    'true',
                'data-edit':    'true',
                'children':     [
                    {
                        'br': { }
                    }
                ]
            }
        }
        /** 註冊屬性 - 非元件不用註冊屬性 */
        super.init()
    }
}