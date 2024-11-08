import { ATTRIBUTE_NAMES } from '../../descriptionModule/utils-object.js'
import { BaseComponent } from "../base-component.js"
import { AttributeObject } from '../../descriptionModule/attribute-object.js'

export class ScoreComponent extends BaseComponent {
    static dragName        = 'score'
    static dragDescription = '記分元件'
    constructor (name, bean, title, scoreRule, totalScoreBeans) {
        /** 建構式創建 */
        super('pFormItem', "true", name, bean, title, "true", 'Y', "false", "true", "totalScore", "true")
        /** 各類型客製化預設設置 */
        this.dataset.scoreRule      = scoreRule
        this.dataset.totalScoreCons = totalScoreBeans
        /** 元件預設呈現結構 */
        super.HTMLDescription = {
            'label': {
                'class':    '',
                'text':     '0'
            }
        }
        /** 註冊屬性 */
        super.attributes = [
            ATTRIBUTE_NAMES.NAME, 
            ATTRIBUTE_NAMES.EXTERNAL_NAME,
            ATTRIBUTE_NAMES.TITLE, 
            ATTRIBUTE_NAMES.SHOW
        ]
        super.modifyAttribute()
        super.init()
    }
}