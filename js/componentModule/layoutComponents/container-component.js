import { BaseComponent } from "../base-component.js"

export class ContainerComponent extends BaseComponent {
    static dragName        = 'layout'
    static dragDescription = '容器'
    constructor (seq) {
        /** 建構式創建 */
        super('', "true", '', '', '', "true", 'N', "false", "false", "layout", "true")
        /** 各類型客製化預設設置 - 無 */
        /** 元件預設呈現結構 */
        super.HTMLDescription = {
            'div': {
                'class':            'd-flex container-component',
                'draggable':        'true',
                'data-edit':        'true',
                'data-layout-type': 'layout',
                'data-seq':         seq,
                'children': []
            }
        }
        super.seq = seq
        super.init()
    }

    generateAfterChanged() {
        if (!this.fullComponent.dataset.bindedEvent) {
            this.fullComponent.addEventListener('dragstart', this.layoutDragStart.bind(this))
            this.fullComponent.addEventListener('dragenter', this.layoutDragEnter.bind(this))
            this.fullComponent.addEventListener('dragover', this.layoutDragOver.bind(this))
            this.fullComponent.addEventListener('dragleave', this.layoutDragLeave.bind(this))
            this.fullComponent.addEventListener('drop', this.layoutDropped.bind(this))
            this.fullComponent.dataset.bindedEvent = true
        }
    }

    layoutDragStart (e) {
        e.dataTransfer.setData('text/plain', `${ this.seq },container`)
        e.stopPropagation()
    }

    layoutDragEnter (e) {
        SharedUtils.cancelDefault(e)
    }

    layoutDragOver (e) {
        SharedUtils.cancelDefault(e)
        this.fullComponent.classList.add('drag-hover')
    }

    layoutDragLeave (e) {
        SharedUtils.cancelDefault(e)
        this.fullComponent.classList.remove('drag-hover')
    }

    layoutDropped (e) {
        SharedUtils.cancelDefault(e)
        dropped.bind(this.fullComponent)(e)
    }

}