import { ATTRIBUTE_NAMES } from '../../descriptionModule/utils-object.js'
import { BaseComponent } from "../base-component.js"
import { AttributeObject } from '../../descriptionModule/attribute-object.js'

export class GroupComponent extends BaseComponent {
    static dragName        = 'group'
    static dragDescription = '群組元件'
    constructor (name, bean, title, treeChildren, children, selectedElements) {
        /** 建構式創建 */
        super('form-row-div pFormItemGroup group-default', "true", name, bean, title, "true", 'Y', "false", "true", "group", "true")
        /** 各類型客製化預設設置 */
        this.dataset.treeChildren     = treeChildren
        this.dataset.children         = children
        this.selectedElements         = selectedElements
        /** 元件預設呈現結構 - 預設空 */
        super.HTMLDescription = ''
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

    get treeChildren() {
        if (this.dataset.treeChildren) {
            if (typeof this.dataset.treeChildren === 'string')
                return this.dataset.treeChildren.split(',')
            else 
                return `${ this.dataset.treeChildren }`.split(',')
        } else return this.dataset.treeChildren
    }

    get children() {
        if (this.dataset.children) {
            if (typeof this.dataset.children === 'string')
                return this.dataset.children.split(',')
            else 
                return `${ this.dataset.children }`.split(',')
        } else return this.dataset.children
    }

    set selectedElements(selectedElements) {
        this._selectedElements = selectedElements
    }

    get selectedElements() {
        return this._selectedElements
    }

    /**
     * 初次製作元件(改寫)
     * @returns {Element} 
     */
    generateComponent() {
        /** 引入工廠 */
        const factory = window.ComponentFactory
        if (!this.container) this.generateShell()
        this.container[0].innerHTML = ''
        this.componentElement = []
        try {
            if (this.selectedElements) {
                this.selectedElements.forEach(element => {
                    if (element.dataset.seq && !element.classList.contains('container-component')) {
                        const childComponent = factory.getRegisterComponentBySeq(element.dataset.seq)
                        if (!childComponent) return
                        this.componentElement.push(childComponent.fullComponent)
                        this.container[0].appendChild(childComponent.fullComponent)
                    } else {
                        this.componentElement.push(element)
                        this.container[0].appendChild(element)
                    }
                })
                this.fullComponent = this.container[0]
            } else {
                this.container.forEach(element => {
                    if (element.classList.contains('pFormItemGroup')) {
                        element.innerHTML = ''
                        this.dataset.treeChildren.split(',').forEach(childName => {
                            const childComponent = factory.getRegisterComponentByName(childName)
                            if (!childComponent) return
                            this.componentElement.push(childComponent.fullComponent)
                            element.appendChild(childComponent.fullComponent)
                        })
                        this.fullComponent  = element
                        throw { } // break
                    }
                })
            }
        } catch (e) { }
        return this.fullComponent
    }

    /**
     * 改寫父層相同函數
     */
    componentAttributeChanged(attributeName, actualValue) {
        switch (attributeName) {
			case ATTRIBUTE_NAMES.NAME:
                const originName    = this.dataset.originName || ''
                if (originName === '') break
                /** 引入工廠 */
                const factory       = window.ComponentFactory
                /** 對應有該組的元件 */
                const targetGroup   = document.querySelectorAll(`div[target-group="${ originName }"]`)
                targetGroup.forEach(element => {
                    const seq       = element.dataset.seq
                    const component = factory.getRegisterComponentBySeq(seq)
                    component.attribute.targetGroup = actualValue
                    component.dataset.click = component.dataset.click.replace(originName, actualValue)
                    component.modifyAttribute()
                })
                break
        }
    }

    /** 
     * 檢查任何需要再製作結構前的函數
     * 改寫父層相同函數
     */
    checkingByItself() {
        if (!this.fullComponent.closest('html') && !this.printComponent.closest('html')) this.abandoned = true
        else this.abandoned = false
        // 檢查父層是否還存在
        if (this.dataset.parent && !this.fullComponent.closest(`div[data-name="${ this.dataset.parent }"]`)) this.dataset.parent = undefined
        if (this.dataset.treeParent && !this.fullComponent.closest(`div[data-name="${ this.dataset.treeParent }"]`)) this.dataset.treeParent = undefined
        /** 引入工廠 */
        const factory       = window.ComponentFactory
        /** 樹狀結構 */
        const treeChildren  = []
        /** 基本結構 */
        const children      = []
        /** 所有組底下的元件 */
        const groupBeans    = this.fullComponent.querySelectorAll('.pFormItem[data-name], .pFormItemGroup[data-name]')
        groupBeans.forEach(groupBean => {
            if (groupBean.parentNode === this.fullComponent) {
                const seq = groupBean.dataset.seq
                const component = factory.getRegisterComponentBySeq(seq)
                component.dataset.parent        = this.dataset.name
                component.dataset.treeParent    = this.dataset.name
                treeChildren.push(component.dataset.name)
                children.push(component.dataset.name)
            }
            const horizontalFormItems = groupBean.dataset.horizontalFormItem
            if (horizontalFormItems) {
                const itemsArray = horizontalFormItems.split('|,|')
                for (let items of itemsArray) {
                    const itemArray = items.split(',')
                    for (let item of itemArray) {
                        if (!item) continue
                        const component = factory.getRegisterComponentByName(item)
                        if (component) component.dataset.parent = this.dataset.name
                        children.push(item)
                    }
                }
            }
        })
        if (treeChildren.length > 0) this.dataset.treeChildren = treeChildren.join(',')
        if (children.length > 0) this.dataset.children = children.join(',')
        return true
    }

    /**
     * 匯出轉換
     */
    exportExchange (cloneElement) {
        cloneElement = this.structure.createElemental({}, false, true)
        return cloneElement
    }
}