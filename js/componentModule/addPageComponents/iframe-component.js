import { ATTRIBUTE_NAMES } from '../../descriptionModule/utils-object.js'
import { BaseComponent } from "../base-component.js"
import { AttributeObject } from '../../descriptionModule/attribute-object.js'

export class IframeComponent extends BaseComponent {
    static dragName        = 'iframe'
    static dragDescription = '內嵌框架'
    constructor (name, bean, title) {
        /** 建構式創建 */
        super('form-group pFormItem', "true", name, bean, title, "true", 'Y', "false", "true", "iframe", "true")
        /** 各類型客製化預設設置 */
        this.dataset.controlMode        = 'gFormPage'
        this.dataset.iframeFrameModel   = 'add'
        this.dataset.iframeSourceId     = 'eval:sourceId'
        /** 元件預設呈現結構 */
        super.HTMLDescription = {
            'div': {
                'class':    'iframe-block text-center',
                'children': [
                    {
                        'label': {
                            'class': 'iframe-text',
                            'text':  'IFRAME'
                        }
                    }
                ]
            }
        }
        /** 註冊屬性 */
        super.attributes = [
            ATTRIBUTE_NAMES.NAME, 
            ATTRIBUTE_NAMES.EXTERNAL_NAME,
            ATTRIBUTE_NAMES.TITLE, 
            ATTRIBUTE_NAMES.SHOW, 
            ATTRIBUTE_NAMES.HEIGHT, 
            ATTRIBUTE_NAMES.IFRAME_FORM_TYPE, 
            ATTRIBUTE_NAMES.IFRAME_FRAME_MODEL, 
            ATTRIBUTE_NAMES.IFRAME_SOURCE_ID, 
            ATTRIBUTE_NAMES.IFRAME_SIZE
        ]
        super.modifyAttribute()
        super.init()
    }

    /**
     * 改寫父層相同函數
     */
    buildAttributeObject(attrObjectArray, attributeName, zhName, actualValue) {
        switch (attributeName) {
            case ATTRIBUTE_NAMES.IFRAME_FRAME_MODEL:
            case ATTRIBUTE_NAMES.IFRAME_SOURCE_ID:
                // 下拉框模式選擇屬性
                const selectAttributeObject             = new AttributeObject(attributeName, zhName, 'select', actualValue)
                selectAttributeObject.optionDescription = ["預設"]
                selectAttributeObject.optionValue       = ["eval:sourceId"]
                if (attributeName === ATTRIBUTE_NAMES.IFRAME_FRAME_MODEL) {
                    selectAttributeObject.optionDescription = ["新增頁", "更新頁", "清單頁", "列印頁"]
                    selectAttributeObject.optionValue       = ["add", "upd", "list", "print"]
                }
                attrObjectArray.push(selectAttributeObject)
                break
            case ATTRIBUTE_NAMES.HEIGHT:
                // 拖動區間模式選擇屬性
                actualValue = actualValue || '250px'
                if (actualValue.indexOf('px') > -1) actualValue = (actualValue.substring(0, actualValue.length - 2) - 0) / 10
                else actualValue = (actualValue - 0) / 10
                attrObjectArray.push(new AttributeObject(attributeName, zhName, 'range', actualValue))
                break
            case ATTRIBUTE_NAMES.SHOW:
            case ATTRIBUTE_NAMES.PRINT_SHOW_TITLE:
                // 單選框模式選擇屬性
                const optionAttributeObject             = new AttributeObject(attributeName, zhName, 'radio', actualValue)
                optionAttributeObject.optionDescription = ["是", "否"]
                optionAttributeObject.optionValue       = ["true", "false"]
                attrObjectArray.push(optionAttributeObject)
                break
            case ATTRIBUTE_NAMES.IFRAME_FORM_TYPE:
                // 客製化選擇屬性
                /** 全表單 */
                const formList = window.allFormList || []
                /** 選項標題 */
                let formTitle 	= ["請選擇"]
                /** 選項值 */
                let formName  	= ["0"]
                let inputValue 	= this.dataset[`${ attributeName }Input`]
                if (inputValue === undefined) inputValue = ''
                for (let formVersion of formVersionList) {
                    formName.push(formVersion.formType)
                    formTitle.push(formVersion.title)
                }
                formName.push("normal")
                formTitle.push("其他網站")
                const optionChildren = []
                for (let j = 0, len2 = formName.length; j < len2; j++) {
                    const optionNode = {
                        'option': {
                            'text': 	formTitle[j],
                            'value': 	formName[j],
                            'selected': (actualValue == formName[j]) ? 'selected' : null,
                        }
                    }
                    optionChildren.push(optionNode)
                }
                const attributeNode = [
                    {
                        'select': {
                            'class':    'form-control',
                            'name':     attributeName,
                            'id':       attributeName,
                            'onchange': super.settingDataAttribute.bind(this),
                            'children': optionChildren
                        }
                    },
                    {
                        'input': {
                            'type':     'text',
                            'class':    `form-control ${ actualValue === 'normal' ? '' : 'hide' }`,
                            'name': 	attributeName + 'Input',
                            'id': 		attributeName + 'Input',
                            'value': 	inputValue,
                            'onchange': super.settingDataAttribute.bind(this)
                        }
                    }
                ]
                attrObjectArray.push(new AttributeObject(attributeName, zhName, 'custom', actualValue, attributeNode))
                break
            default:
                // 預設文字輸入屬性
                attrObjectArray.push(new AttributeObject(attributeName, zhName, 'text', actualValue))
                break
        }
    }

    /**
     * 屬性區域 - 下拉框元素
     * @param {*} formElement 
     */
    typeSelectAttributeSelected(attributeName, formElement) {
        /** 元素值 */
        const inputValue            = formElement.value
        if (attributeName === ATTRIBUTE_NAMES.IFRAME_FORM_TYPE) {
            // 未來會有不同值會有不同處理方式
            switch (inputValue) {
                case 'normal':
                    formElement.nextElementSibling.classList.remove('hide')
                    break
                default:
                    formElement.nextElementSibling.classList.add('hide')
                    break
            }   
        }
        this.dataset[attributeName] = inputValue
        return true
    }

    /**
     * 改寫父層相同函數
     */
    componentAttributeChanged(attributeName, actualValue) {
        switch (attributeName) {
            case ATTRIBUTE_NAMES.HEIGHT:
                if (actualValue === '500px') actualValue = '100%'
                this.fullComponent.style.height = actualValue || '250px'
                this.componentElement[0].style.height = actualValue || '250px'
                break
            case ATTRIBUTE_NAMES.IFRAME_FORM_TYPE:
			case ATTRIBUTE_NAMES.IFRAME_FRAME_MODEL:
			case ATTRIBUTE_NAMES.IFRAME_SOURCE_ID:
			case ATTRIBUTE_NAMES.IFRAME_SIZE:
                const iframeTypeFormat = {}
                if (this.dataset.iframeFormType === 'normal') iframeTypeFormat.iframeType = 'normal'
                else {
                    iframeTypeFormat.iframeType = 'gForm'
                    iframeTypeFormat.formType   = this.dataset.iframeFormType
                }
                iframeTypeFormat.url = this.dataset.iframeFormTypeInput
                switch (this.dataset.iframeFrameModel) {
                    case 'add':
                    case 'upd':
                        iframeTypeFormat.frameModel = "gFormWebADD"
                        iframeTypeFormat.viewModel = "gFormWebADD"
                        iframeTypeFormat.url = "gFormWebADD.html"
                        break
                    case 'list':
                        iframeTypeFormat.frameModel = "gFormWebLIST"
                        iframeTypeFormat.viewModel = "gFormWebLIST"
                        iframeTypeFormat.url = "gFormWebLIST.html"
                        break
                    case 'print':
                        iframeTypeFormat.frameModel = "gFormWebPRINT"
                        iframeTypeFormat.viewModel = "gFormWebPRINT"
                        iframeTypeFormat.url = "gFormWebPRINT.html"
                        break
                }
                iframeTypeFormat.sourceId = this.dataset.iframeSourceId
                this.dataset.typeFormat = JSON.stringify(iframeTypeFormat)
                break
        }
    }

    /**
     * 轉置格式屬性
     * @param {String} attribute 
     * @param {Object} typeFormat 
     */
    convertTypeFormat(attribute, typeFormat) {
        const iframeType = typeFormat.iframeType
        if (iframeType === 'gForm') {
            let typeModal = ''
            switch (typeFormat.iframeFrameModel) {
                case 'gFormWebADD':
                    typeModal = 'add'
                    break
                case 'gFormWebLIST':
                    typeModal = 'list'
                    break
                case 'gFormWebPRINT':
                    typeModal = 'print'
                    break
            }
            this.dataset.iframeFrameModel      = typeModal
            this.dataset.iframeSourceId        = typeFormat.sourceId
            this.dataset.iframeFormType        = typeFormat.formType
        } else if (iframeType === 'normal') {
            this.dataset.iframeFormTypeInput   = typeFormat.url
            this.dataset.iframeSourceId        = typeFormat.sourceId
            this.dataset.iframeFormType        = typeFormat.formType
        }
    }
}