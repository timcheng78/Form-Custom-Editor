import { ATTRIBUTE_ZH_NAMES_LIST } from '../descriptionModule/utils-object.js'
import { AttributeObject } from '../descriptionModule/attribute-object.js'
import { BaseComponent } from './base-component.js'

export class ListComponent extends BaseComponent {

    constructor (className, draggable, title, edit, listElement, type, webComponent) {
        super()
        /** 一般屬性 */
        this.attribute              = { }
        /** 元件屬性 */
        this.dataset                = { }
        /** 類別屬性 */
        this.attribute.class        = className
        /** 可拖曳屬性 */
        this.attribute.draggable    = draggable
        /** 元件標題 */
        this.dataset.title          = title
        /** 元件編輯狀態 */
        this.dataset.edit           = edit
        /** 元件為清單元件 */
        this.dataset.listEle        = listElement
        /** 元件類型 */
        this.dataset.type           = type
        /** 清單元件 */
        this.dataset.webComponent   = webComponent
    }

    /** 設定元件序號 */
    set printSeq(printSeq) {
        this._printSeq = printSeq
        this.dataset.printSeq = printSeq
        this.modifyAttribute()
    }

    /** 取得元件序號 */
    get printSeq() {
        return this._printSeq
    }

    // =============== functions start ===============

    /**
     * 初始化元件設定並製做殼及元件
     */
    init() {
        this.generateComponent()
    }

    generateComponent() {
        /** 屬性容器 */
        const attributeObject = {}
        // 將所有目前模組內全部屬性遍歷
        for (let attribute in this) {
            // 針對 attribute 與 dataset 進行數據綁定
            switch (attribute) {
                case 'attribute':
                case 'dataset':
                    for (let dataAttribute in this[attribute]) {
                        let datasetData = this[attribute][dataAttribute]
                        if (attribute === 'attribute') {
                            attributeObject[dataAttribute.replace(/([A-Z])/g, "-$1").toLowerCase()] = datasetData
                            if (this.fullComponent && dataAttribute === 'class' && this.fullComponent.classList.contains('selected')) {
                                this.fullComponent.classList.value = datasetData + ' selected'
                            }
                        } else if (attribute === 'dataset') {
                            attributeObject[`data-${ dataAttribute.replace(/([A-Z])/g, "-$1").toLowerCase() }`] = datasetData
                            if (this.fullComponent) this.fullComponent.dataset[dataAttribute] = datasetData
                            if (dataAttribute === 'title') attributeObject.text = datasetData
                        }
                    }
                    break
            }            
        }

        if (!this.fullComponent || !(this.fullComponent instanceof Element)) this.fullComponent = CreateUtils.createBeanElement({controlType: 'div', attribute: [attributeObject]})[0]
        return this.fullComponent
    }

    /**
     * 設計屬性列標題及參數
     */
    modifyAttribute() {
        /** 屬性物件存放陣列 */
        const attrObjectArr = []
        /** 各屬性自訂區域 */
        for (let attributeName of this.attributes) {
            /** 屬性標題 */
            const zhName        = ATTRIBUTE_ZH_NAMES_LIST[attributeName]
            /** 實際屬性資料 */
            let actualValue     = this.dataset[attributeName]
            if (actualValue === undefined) actualValue = ''
            // 預設文字輸入屬性
            this.buildAttributeObject(attrObjectArr, attributeName, zhName, `${ actualValue }`)
        }
        this.generateComponent()
        super.generateAttributeRow(attrObjectArr)
    }

    /**
     * 建立屬性物件陣列
     * =
     * 依照屬性名稱及標題
     * 若有預設值將值也一併帶出
     * 若需要客製化
     * 繼承後進行修改該函數
     * @param {Object[]} attrObjectArray 
     * @param {String} attributeName 
     * @param {String} zhName 
     * @param {String} actualValue 
     */
    buildAttributeObject(attrObjectArray, attributeName, zhName, actualValue) {
        // default
        attrObjectArray.push(new AttributeObject(attributeName, zhName, 'text', actualValue))
    }

    /** 合併元件元素 */
    mergeComponent(element) {
        return true
    }

    // =============== functions end ===============

}