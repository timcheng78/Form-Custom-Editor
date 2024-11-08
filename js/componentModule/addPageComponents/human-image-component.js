import { ATTRIBUTE_NAMES } from '../../descriptionModule/utils-object.js'
import { BaseComponent } from "../base-component.js"
import { AttributeObject } from '../../descriptionModule/attribute-object.js'

export class HumanBodyComponent extends BaseComponent {
    static dragName        = 'humanBody'
    static dragDescription = '人形圖'
    constructor (name, bean, title) {
        /** 建構式創建 */
        super('form-row-div pFormItem', "true", name, bean, title, "true", 'Y', "false", "true", "csCanvas", "true")
        /** 各類型客製化預設設置 */
        this.dataset.width 					= '600'
        this.dataset.height 				= '600'
        this.dataset.typeFormat 			= '[]'
        this.dataset.selectMode 			= 'radio'
        this.dataset.controlMode 			= 'default'
        this.dataset.templateDiv 			= 'false'
        this.dataset.templateDivPosition 	= 'right'
        this.dataset.templateDivIsShowDiv 	= 'true'
        this.dataset.templateDivDisPlayMode = 'vertical'
        /** 元件預設呈現結構 */
        super.HTMLDescription = {
            'img': {
                'type':     'csCanvas',
                'class':    'form-control-csCanvas img-fluid image-default',
                'src':      'img/csCanvasExample.jpg',
                'name':     name,
            }
        }
        /** 註冊屬性 */
        super.attributes = [
            ATTRIBUTE_NAMES.NAME, 
            ATTRIBUTE_NAMES.EXTERNAL_NAME,
            ATTRIBUTE_NAMES.TITLE, 
            ATTRIBUTE_NAMES.DONT_DITTO, 
            ATTRIBUTE_NAMES.SHOW, 
            ATTRIBUTE_NAMES.REQUIRED, 
            ATTRIBUTE_NAMES.TYPE_FORMAT, 
            ATTRIBUTE_NAMES.CONTROL_MODE, 
            ATTRIBUTE_NAMES.SELECT_MODE, 
            ATTRIBUTE_NAMES.WIDTH, 
            ATTRIBUTE_NAMES.HEIGHT, 
            ATTRIBUTE_NAMES.TEMPLATE_DIV_IS_SHOW_DIV, 
            ATTRIBUTE_NAMES.TEMPLATE_DIV_DISPLAY_MODE, 
            ATTRIBUTE_NAMES.TEMPLATE_DIV_POSITION
        ]
        super.modifyAttribute()
        super.init()
    }

    /**
     * 改寫父層相同函數
     */
    buildAttributeObject(attrObjectArray, attributeName, zhName, actualValue) {
        switch (attributeName) {
            case ATTRIBUTE_NAMES.CONTROL_MODE:
            case ATTRIBUTE_NAMES.SELECT_MODE:
                // 下拉框模式選擇屬性
                const selectAttributeObject             = new AttributeObject(attributeName, zhName, 'select', actualValue)
                selectAttributeObject.optionDescription = ["單選框(單選)", "下拉框(單選)", "多選框(多選)"]
                selectAttributeObject.optionValue       = ["radio", "select", "checkbox"]
                if (attributeName === ATTRIBUTE_NAMES.CONTROL_MODE) {
                    selectAttributeObject.optionDescription = ["一般人形圖", "純文字顯示"]
                    selectAttributeObject.optionValue       = ["canvas", "text"]
                }
                attrObjectArray.push(selectAttributeObject)
                break
            case ATTRIBUTE_NAMES.WIDTH:
            case ATTRIBUTE_NAMES.HEIGHT:
                // 拖動區間模式選擇屬性
                actualValue = actualValue || '600px'
                if (actualValue.indexOf('px') > -1) actualValue = actualValue.substring(0, actualValue.length - 2) - 0
                else actualValue = actualValue - 0
                const rangeAttributeObject = new AttributeObject(attributeName, zhName, 'range', actualValue)
                rangeAttributeObject.maxNumber = 1500
                rangeAttributeObject.minNumber = 200
                attrObjectArray.push(rangeAttributeObject)
                break
            case ATTRIBUTE_NAMES.TEMPLATE_DIV_IS_SHOW_DIV:
            case ATTRIBUTE_NAMES.TEMPLATE_DIV_DISPLAY_MODE:
            case ATTRIBUTE_NAMES.TEMPLATE_DIV_POSITION:
            case ATTRIBUTE_NAMES.DONT_DITTO:
            case ATTRIBUTE_NAMES.REQUIRED:
            case ATTRIBUTE_NAMES.SHOW:
            case ATTRIBUTE_NAMES.PRINT_SHOW_TITLE:
                // 單選框模式選擇屬性
                const optionAttributeObject             = new AttributeObject(attributeName, zhName, 'radio', actualValue)
                optionAttributeObject.optionDescription = ["是", "否"]
                optionAttributeObject.optionValue       = ["true", "false"]
                if (attributeName === ATTRIBUTE_NAMES.DONT_DITTO) optionAttributeObject.optionValue = ["false", "true"]
                else if (attributeName === ATTRIBUTE_NAMES.TEMPLATE_DIV_DISPLAY_MODE) {
                    optionAttributeObject.optionDescription = ["垂直", "水平"]
                    optionAttributeObject.optionValue       = ["vertical", "horizontal"]
                } else if (attributeName === ATTRIBUTE_NAMES.TEMPLATE_DIV_POSITION) {
                    optionAttributeObject.optionDescription = ["上", "下", "左", "右"]
                    optionAttributeObject.optionValue       = ["top", "bottom", "left", "right"]
                }
                attrObjectArray.push(optionAttributeObject)
                break
            case ATTRIBUTE_NAMES.TYPE_FORMAT:
                // 客製化模式選擇屬性
                const optionsChildren = [
                    {
                        'option': {
                            'value':    '0',
                            'text':     '請選擇'
                        }
                    }
                ]
                if (dataCsCanvas) {
                    dataCsCanvas.forEach(item => {
                        let v 		= `${ item.sourceId }|:|${ item.csName }-${ item.typeA }-${ item.typeB }`
                        let desc 	= `(${ item.sourceId })${ item.csName }-${ item.typeA }-${ item.typeB }`
                        desc 		= desc.replace(/^|[\-]+$/g, '') // 去除尾巴的"-"
                        const optionNode = {
                            'option': {
                                'value':    v,
                                'text':     desc
                            }
                        }
                        optionsChildren.push(optionNode)
                    })
                }
                const customObject = [
                    {
                        'select': {
                            'class':    'form-control',
                            'name':     attributeName,
                            'id':       attributeName,
                            'children': optionsChildren
                        }
                    },
                    {
                        'button': {
                            'type':     'button',
                            'class':    'btn btn-primary btn-csCanvas',
                            'onclick':  super.settingDataAttribute.bind(this),
                            'text':     '新增'
                        }
                    }
                ]
                const typeFormatValue = SharedUtils.onionStringDecode(actualValue)
                if (typeFormatValue) {
                    for (let value of typeFormatValue) {
                        const v = `${ value.sourceId }|:|${ value.csName }-${ value.typeA }-${ value.typeB }`
                        const csCanvasTypeFormatRow = {
                            'div': {
                                'class': 		'divCsCanvasTypeFormat col-12',
                                'data-value': 	v,
                                'value': 		v,
                                'text': 		`(${ value.sourceId })${ value.csName }`,
                                'children':		[
                                    {
                                        'button': {
                                            'type':     'button',
                                            'class': 	'icon trash',
                                            'onclick':  super.settingDataAttribute.bind(this),
                                            'style': 	'transform: unset; margin-left: 15px;',
                                            'children': [
                                                {
                                                    'i': {
                                                        'class': 'bi bi-trash'
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                        customObject.push(csCanvasTypeFormatRow)
                    }
                }
                const customNode = new AttributeObject(attributeName, zhName, 'custom', actualValue, customObject)
                customNode.contentNode = {
                    'div': {
                        'class': 'col-9 subContent'
                    }
                }
                attrObjectArray.push(customNode)
                break
            default:
                // 預設文字輸入屬性
                attrObjectArray.push(new AttributeObject(attributeName, zhName, 'text', actualValue))
                break
        }
    }

    /**
     * 編輯框事件結束尚未賦值前觸發
     * =
     * 人形圖客製化
     * 處理 selectCsCanvasProp
     * @param {String} attributeName 
     * @param {String} attributeValue 
     */
    boxEditBeforeChanged(attributeName, attributeValue) {
        if (attributeName === ATTRIBUTE_NAMES.NAME) {
            // 移除 selectCsCanvasProp 及 divCsCanvasTypeFormat 全部參數
            const propElement           = document.querySelector(`#${ this.dataset.bean }_selectCsCanvasProp`)
            if (propElement !== null) propElement.remove()
            const csCanvasTypeFormat 	= document.querySelectorAll('.divCsCanvasTypeFormat')
            csCanvasTypeFormat.forEach(ele => ele.remove())
        }
        return true
    }

    /**
     * 編輯框事件結束賦值後觸發
     * =
     * 人形圖客製化
     * 處理 selectCsCanvasProp
     * 新增
     * @param {String} attributeName 
     * @param {String} attributeValue 
     */
    editingAfter(attributeName, attributeValue) {
        if (attributeName === ATTRIBUTE_NAMES.NAME) {
            // 新增 divCsCanvasTypeFormat 參數
            const materialList 	= document.querySelector('#materialList')
            const selectElement = materialList.querySelector('#typeFormat')
            const addButton 	= materialList.querySelector('.btn-csCanvas')
            const typeFormat    = SharedUtils.onionStringDecode(this.dataset.typeFormat)
            typeFormat.forEach(item => {
                selectElement.value = `${ item.sourceId }|:|${ item.csName }-${ item.typeA }-${ item.typeB }`
                addButton.click()
            })
        }
        return true
    }

    /**
     * 屬性區域 - 改變區間元素
     * 繼承父層客製化屬性
     * @param {*} formElement 
     */
    typeRangeAttributeSelected(attributeName, formElement) {
        /** 元素值 */
        const inputValue            = formElement.value
        /** 最小值 */
        const min                   = formElement.min ? formElement.min : 0
        /** 最大值 */
        const max                   = formElement.max ? formElement.max : 50
        /** 比例尺 */
        const newVal                = Number(((inputValue - min) * 100) / (max - min))
        const materialList 	= document.querySelector('#materialList')
        const rangeElement  = materialList.querySelector('.subContent[data-attribute="height"] > input.form-control-range')
        this.dataset[attributeName] = inputValue
        formElement.nextElementSibling.textContent = inputValue
        formElement.nextElementSibling.style.left  = newVal + '%'
        rangeElement.nextElementSibling.textContent = inputValue
        rangeElement.nextElementSibling.style.left  = newVal + '%'
        return true
    }

    /**
     * 屬性區域 - 按鈕元素
     * 繼承父層客製化屬性
     * @param {*} formElement 
     */
    typeButtonAttributeSelected(attributeName, formElement) {
        if (formElement.classList.contains('trash')) {
            this.csCanvasRemove({target: formElement})
            return
        }
        /** 屬性區塊 */
        const subContent 		    = formElement.closest('.subContent')
        /** 人形圖格式下拉框 */
        const csCanvasSelect 		= subContent.querySelector(`#${ attributeName }`)
        /** 取得該人形圖格式是否存在 */
        const csCanvasTypeFormat 	= subContent.querySelectorAll(`.divCsCanvasTypeFormat[data-value="${ csCanvasSelect.value }"]`)
        /** 人形圖格式下拉框該選項 */
        const csCanvasOption 		= csCanvasSelect.querySelector(`option[value="${ csCanvasSelect.value }"]`)
        if (csCanvasSelect.value === '0') {
            CreateUtils.createModal(`alert`, {body: '請選擇人形圖'})
            return false
        } else if (csCanvasTypeFormat.length > 0) {
            CreateUtils.createModal(`alert`, {body: '請勿選擇重複的人形圖'})
            return false
        }
        // 新增人形圖格式設定
        const csCanvasTypeFormatRow = CreateUtils.createBeanElement({
            'controlType': 'div',
            'attribute': 	[
                {
                    'class': 		'divCsCanvasTypeFormat col-12',
                    'data-value': 	csCanvasSelect.value,
                    'value': 		csCanvasSelect.value,
                    'text': 		csCanvasOption.innerText,
                    'children':		[
                        {
                            'button': {
                                'class': 	'icon trash',
                                'style': 	'transform: unset; margin-left: 15px;',
                                'children': [
                                    {
                                        'i': {
                                            'class': 'bi bi-trash'
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            ]
        })[0]
        subContent.appendChild(csCanvasTypeFormatRow)

        this.settingCanvasSelect(this.getCanvasListData())

        this.dataset[attributeName] = this.getCanvasListData()

        const trashButton = csCanvasTypeFormatRow.querySelector('button.trash')
        trashButton.addEventListener('click', this.csCanvasRemove)

        
    }

    /**
     * 取得人形圖新增清單資料
     * =
     */
    getCanvasListData() {
        const vArr              = []
        const csCanvasContainer = document.querySelectorAll('.divCsCanvasTypeFormat')
        csCanvasContainer.forEach(row => {
            if (!row.dataset.value) return
            const arr = row.dataset.value.split('|:|').join('-').split('-')  //高雄民生|:|壓力性損傷-幼兒-外傷
            const json = {
                "sourceId": arr[0],
                "csName": 	arr[1],
                "typeA": 	arr[2],
                "typeB": 	arr[3]
            }
            vArr.push(json)
        })
        return JSON.stringify(vArr)
    }
    
    /**
     * 移除人形圖清單單列
     * =
     * @param {Event} e
     */
    csCanvasRemove(e) {
        const csCanvasContainer = e.target.closest('.divCsCanvasTypeFormat')
        if (csCanvasContainer !== null) csCanvasContainer.remove()
        // 取得要寫入formVersion的typeFormat
        const value = this.getCanvasListData()
        this.dataset.typeFormat = value
        // 新增切換人形圖的select
        this.settingCanvasSelect(value)
    }

    /**
     * 調整人形圖格式設定選項
     * =
     * @param {String} value 
     * @returns 
     */
    settingCanvasSelect(value) {
        const beanName 		= this.dataset.bean
        const targetId 		= `${ beanName }_selectCsCanvasProp`
        const targetSelect 	= document.querySelector(`#${ targetId }`)
        // 刪除原本的select
        if (targetSelect !== null) targetSelect.remove()
        // add頁面才新增
        if (!isAddPage()) return
        // 新增下拉框
        let arr             = JSON.parse(value)
        if (arr.length >= 2) { // 至少兩筆才要顯示下拉框
            const csCanvasSelectElement = CreateUtils.createBeanElement({
                'controlType': 'select',
                'attribute': 	[
                    {
                        'class': 		'selectCsCanvasProp form-control select-default',
                        'id': 			targetId,
                        'onchange': 	`document.querySelector('#${ beanName }').changeCsCanvasProp(this.value)`,
                        'children':		[
                            {
                                'button': {
                                    'class': 	'icon trash',
                                    'style': 	'transform: unset; margin-left: 15px;',
                                    'children': [
                                        {
                                            'i': {
                                                'class': 'bi bi-trash'
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                ]
            })[0]
            arr.forEach(item => {
                const v 		= `${ item.sourceId }|:|${ item.csName }-${ item.typeA }-${ item.typeB }`
                const desc 		= `(${ item.sourceId })${ item.csName }-${ item.typeA }-${ item.typeB }`.replace(/^|[\-]+$/g, '') // 去除尾巴的"-"
                const option 	= CreateUtils.createBeanElement({
                    'controlType': 'option',
                    'attribute': 	[
                        {
                            'value': 	v,
                            'text': 	desc
                        }
                    ]
                })[0]
                csCanvasSelectElement.appendChild(option)
            })
            // 須補
            this.fullComponent.parentNode.prepend(csCanvasSelectElement)
        }
    }

    /**
     * 改寫父層相同函數
     */
    componentAttributeChanged(attributeName, actualValue) {
        switch (attributeName) {
            case ATTRIBUTE_NAMES.WIDTH:
                const materialList 	= document.querySelector('#materialList')
                // 維持寬高比
                const originWidth 	= this.dataset.width - 0
                const newHeight     = originWidth - 0
                // 設定寬
                this.componentElement[0].style.width    = `${ actualValue }px`
                // 設定高
                const rangeElement = materialList.querySelector('.subContent[data-attribute="height"] > input.form-control-range')
                if (rangeElement !== null) rangeElement.value = newHeight
                this.componentElement[0].style.height 	= `${ newHeight }px`
                this.dataset.height                     = newHeight
                break
            case ATTRIBUTE_NAMES.HEIGHT:
                this.componentElement[0].style.height 	= `${ actualValue }px`
                break
        }
    }

    /**
     * 轉置格式屬性
     * @param {String} attribute 
     * @param {Object} typeFormat 
     */
    convertTypeFormat(attribute, typeFormat) {
        if (typeof typeFormat === 'object') this.dataset[attribute] = JSON.stringify(typeFormat)
    }

    /**
     * 依照各類型轉換特殊屬性節點
     * @param {Object} verStructure
     * @returns 
     */
    convertItByType(verStructure) {
        verStructure.typeFormat  = JSON.stringify(this.dataset.typeFormat).replace(/^[\"]+|[\"]+$/g, '')
        const templateDiv = {
            "displayMode":  this.dataset.templateDivDisPlayMode,
            "position":     this.dataset.templateDivPosition,
            "isShowDiv":    this.dataset.templateDivIsShowDiv
        }
        this.dataset.templateDiv = JSON.stringify(templateDiv)
        return true
    }
}