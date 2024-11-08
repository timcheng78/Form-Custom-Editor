export class AttributeObject {

    constructor(attributeName, zhAttributeName, type, defaultValue, HTMLDescription) {
        /** 屬性名稱 */
        this.attributeName      = attributeName
        /** 屬性標題 */
        this.zhAttributeName    = zhAttributeName
        /** 屬性物件類型(text, radio, checkbox, select, range, custom) */
        this.type               = type
        /** 預設值 */
        this.defaultValue       = defaultValue
        /** 屬性物件HTML敘述 */
        this.HTMLDescription    = HTMLDescription
        /** 屬性標題HTML預設結構 */
        this.titleNode          = {
            'div': {
                'class': 'col-3 subTitle'
            }
        }
        /** 屬性項目HTML預設結構 */
        this.contentNode        = {
            'div': {
                'class': 'col-9 subContent'
            }
        }
    }

    /** 設定各式多選項標題 */
    set optionDescription(optionDescription) {
        this._optionDescription = optionDescription
    }

    /** 取得各式多選項標題 */
    get optionDescription() {
        return this._optionDescription
    }

    /** 設定各式多選項值 */
    set optionValue(optionValue) {
        this._optionValue = optionValue
    }

    /** 取得各式多選項值 */
    get optionValue() {
        return this._optionValue
    }

    /** 設定區域範圍選取最小值 */
    set minNumber(minNumber) {
        this._minNumber = minNumber
    }

    /** 取得區域範圍選取最小值 */
    get minNumber() {
        return this._minNumber
    }

    /** 設定區域範圍選取最大值 */
    set maxNumber(maxNumber) {
        this._maxNumber = maxNumber
    }

    /** 取得區域範圍選取最小值 */
    get maxNumber() {
        return this._maxNumber
    }

    /** 設定屬性標題物件結構 */
    set titleNode(titleNode) {
        this._titleNode = titleNode
    }

    /** 取得屬性標題物件結構 @return {Element} */
    get titleNode() {
        return this._titleNode.createElemental()[0]
    }

    /** 設定屬性項目物件結構 */
    set contentNode(contentNode) {
        this._contentNode = contentNode
    }

    /** 取得屬性項目物件結構 @return {Element} */
    get contentNode() {
        return this._contentNode.createElemental()[0]
    }
}