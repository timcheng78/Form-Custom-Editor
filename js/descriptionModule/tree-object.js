export class TreeObject {

    constructor(text, type, value, nodes, defaultBean, draggable, onclick) {
        /** 顯示文字: String */
        this.text           = text
        /** 資料類型: String */
        this.type           = type
        /** 資料值: String */
        this.value          = value
        /** 子層結構: Object[] */
        this.nodes          = nodes
        /** 是否為預設元件: Boolean */
        this.defaultBean    = defaultBean 
        /** 是否可拖曳: Boolean */
        this.draggable      = draggable
        /** 點擊事件: String|Function */
        this.onclick        = onclick
    }

    /** 設定編號 */
    set seq(seq) {
        this._seq = seq
    }

    /** 取得編號 */
    get seq() {
        return this._seq
    }
}