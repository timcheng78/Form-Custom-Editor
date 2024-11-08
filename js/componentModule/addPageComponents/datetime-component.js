import { ATTRIBUTE_NAMES } from '../../descriptionModule/utils-object.js'
import { BaseComponent } from "../base-component.js"
import { AttributeObject } from '../../descriptionModule/attribute-object.js'

export class DatetimeComponent extends BaseComponent {
    static dragName        = 'datetime'
    static dragDescription = '日期方塊'
    constructor (name, bean, title) {
        /** 建構式創建 */
        super('form-row-div pFormItem', "true", name, bean, title, "true", 'Y', "false", "true", "datetime", "true")
        /** 各類型客製化預設設置 */
        this.dataset.typeFormat 		= 'yyyy-MM-dd HH:mm'
        this.dataset.defaultValue 		= '-0y-0M-0d-0h-0m'
        this.dataset.minLimit 			= '-999y-0M-0d-0h-0m'
        this.dataset.maxLimit 			= '+999-0M-0d-0h-0m'
        this.dataset.datetimeType 		= 'datetime'
        this.dataset.moreThanInHosDate  = false
        this.dataset.moreThanNowDate 	= false
        this.dataset.lessThanBirthday 	= false
        /** 元件預設呈現結構 */
        super.HTMLDescription = {
            'input': {
                'type':     'text',
                'class':    'form-control datetime-default',
                'name':     name,
                'value':    new Date().format(this.dataset.typeFormat),
                'readonly': 'readonly'
            }
        }
        /** 註冊屬性 */
        super.attributes = [
            ATTRIBUTE_NAMES.NAME, 
            ATTRIBUTE_NAMES.EXTERNAL_NAME,
            ATTRIBUTE_NAMES.TITLE, 
            ATTRIBUTE_NAMES.WIDTH, 
            ATTRIBUTE_NAMES.DEFAULT_VALUE, 
            ATTRIBUTE_NAMES.DONT_DITTO, 
            ATTRIBUTE_NAMES.TYPE_FORMAT, 
            ATTRIBUTE_NAMES.MIN_LIMIT, 
            ATTRIBUTE_NAMES.MAX_LIMIT, 
            ATTRIBUTE_NAMES.REQUIRED, 
            ATTRIBUTE_NAMES.PROMPT_TIPS, 
            ATTRIBUTE_NAMES.PLACEHOLDER,
            ATTRIBUTE_NAMES.DATETIME_TYPE, 
            ATTRIBUTE_NAMES.SHOW, 
            ATTRIBUTE_NAMES.MORE_THAN_IN_HOS_DATE, 
            ATTRIBUTE_NAMES.LESS_THAN_BIRTHDAY, 
            ATTRIBUTE_NAMES.MORE_THAN_NOW_DATE
        ]
        super.modifyAttribute()
        super.init()
    }

    /**
     * 改寫父層相同函數
     */
    buildAttributeObject(attrObjectArray, attributeName, zhName, actualValue) {
        switch (attributeName) {
            case ATTRIBUTE_NAMES.TYPE_FORMAT:
                // 下拉框模式選擇屬性
                const selectAttributeObject             = new AttributeObject(attributeName, zhName, 'select', actualValue)
                selectAttributeObject.optionDescription = ["yyyy-MM-dd", "yyyy/MM/dd", "yyyy-MM-dd HH:mm", "yyyy/MM/dd HH:mm", "HH:mm"]
                selectAttributeObject.optionValue       = ["yyyy-MM-dd", "yyyy/MM/dd", "yyyy-MM-dd HH:mm", "yyyy/MM/dd HH:mm", "HH:mm"]
                attrObjectArray.push(selectAttributeObject)
                break
            case ATTRIBUTE_NAMES.WIDTH:
                // 拖動區間模式選擇屬性
                actualValue = actualValue || '250px'
                if (actualValue.indexOf('px') > -1) actualValue = (actualValue.substring(0, actualValue.length - 2) - 0) / 10
                else actualValue = (actualValue - 0) / 10
                attrObjectArray.push(new AttributeObject(attributeName, zhName, 'range', actualValue))
                break
            case ATTRIBUTE_NAMES.DONT_DITTO:
            case ATTRIBUTE_NAMES.REQUIRED:
            case ATTRIBUTE_NAMES.SHOW:
            case ATTRIBUTE_NAMES.MORE_THAN_IN_HOS_DATE:
            case ATTRIBUTE_NAMES.LESS_THAN_BIRTHDAY:
            case ATTRIBUTE_NAMES.MORE_THAN_NOW_DATE:
            case ATTRIBUTE_NAMES.DATETIME_TYPE:
            case ATTRIBUTE_NAMES.PRINT_SHOW_TITLE:
                // 單選框模式選擇屬性
                const optionAttributeObject             = new AttributeObject(attributeName, zhName, 'radio', actualValue)
                optionAttributeObject.optionDescription = ["是", "否"]
                optionAttributeObject.optionValue       = ["true", "false"]
                if (attributeName === 'datetimeType') {
                    optionAttributeObject.optionDescription = ["只有日期", "只有時間", "日期+時間"]
                    optionAttributeObject.optionValue       = ["date", "time", "datetime"]
                } else if (attributeName === 'dontDitto') optionAttributeObject.optionValue = ["false", "true"]
                attrObjectArray.push(optionAttributeObject)
                break
            default:
                // 預設文字輸入屬性
                attrObjectArray.push(new AttributeObject(attributeName, zhName, 'text', actualValue))
                break
        }
    }

    /**
     * 屬性區域 - 單選框元素
     * 繼承父層客製化屬性
     * @param {*} formElement 
     */
    typeRadioAttributeSelected(attributeName, formElement) {
        /** 屬性清單 */
	    const materialList 		    = document.querySelector('#materialList')
        /** 屬性區塊 */
        const subContent 		    = formElement.closest('.subContent')
        /** 被選取的單選框元素 */
        const radioElements         = subContent.querySelector(`input[type="radio"][name="${ attributeName }"]:checked`)
        /** 元素值 */
        const inputValue            = radioElements.value
        if (attributeName === ATTRIBUTE_NAMES.DATETIME_TYPE) {
            /** typeFormat 屬性區域 */
            const typeFormatContainer 	= materialList.querySelector('div[data-attribute="typeFormat"]')
            /** typeFormat 屬性下拉框 */
            const selectElement 		= typeFormatContainer.querySelector('#typeFormat')
            switch (inputValue) {
                case 'date':
                    if (selectElement.value !== 'yyyy/MM/dd' && selectElement.value !== 'yyyy-MM-dd') {
                        this.dataset.typeFormat = 'yyyy-MM-dd'
                        selectElement.value = 'yyyy-MM-dd'
                    }
                    break
                case 'time':
                    if (selectElement.value !== 'HH:mm') {
                        this.dataset.typeFormat = 'HH:mm'
                        selectElement.value = 'HH:mm'
                    }
                    break
                case 'datetime':
                    if (selectElement.value !== 'yyyy/MM/dd HH:mm' && selectElement.value !== 'yyyy-MM-dd HH:mm') {
                        this.dataset.typeFormat = 'yyyy-MM-dd HH:mm'
                        selectElement.value = 'yyyy-MM-dd HH:mm'
                    }
                    break
            }
        }
        this.dataset[attributeName] = inputValue
        return true
    }

    /**
     * 屬性區域 - 下拉框元素
     * 繼承父層客製化屬性
     * @param {*} formElement 
     */
    typeSelectAttributeSelected(attributeName, formElement) {
        /** 屬性清單 */
	    const materialList 		    = document.querySelector('#materialList')
        /** 元素值 */
        const inputValue            = formElement.value
        if (attributeName === ATTRIBUTE_NAMES.TYPE_FORMAT) {
            /** 日期時間型態選擇區域 */
            const datetimeTypeContainer = materialList.querySelector('div[data-attribute="datetimeType"]')
            /** 日期時間型態已選取的元素 */
            const inputCheckedElement 	= datetimeTypeContainer.querySelector('input[name="datetimeType"]:checked')
            switch (inputValue) {
                case 'yyyy/MM/dd HH:mm':
                case 'yyyy-MM-dd HH:mm':
                    if (inputCheckedElement.value !== 'datetime') datetimeTypeContainer.querySelector('input[name="datetimeType"][value="datetime"]').checked = true
                    this.dataset.datetimeType = 'datetime'
                    break
                case 'yyyy/MM/dd':
                case 'yyyy-MM-dd':
                    if (inputCheckedElement.value !== 'date') datetimeTypeContainer.querySelector('input[name="datetimeType"][value="date"]').checked = true
                    this.dataset.datetimeType = 'date'
                    break
                case 'HH:mm':
                    if (inputCheckedElement.value !== 'time') datetimeTypeContainer.querySelector('input[name="datetimeType"][value="time"]').checked = true
                    this.dataset.datetimeType = 'time'
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
			case ATTRIBUTE_NAMES.BACK_TITLE:
                const labelComponent = {
                    'label': {
                        'class':        'h6 canEditDiv',
                        'draggable':    'true',
                        'data-edit':    'true',
                        'text':         actualValue
                    }
                }.createElemental()[0]
                this.componentElement[0].appendChild(labelComponent)
                break
            case ATTRIBUTE_NAMES.WIDTH:
                this.componentElement[0].style.width = actualValue
                break
            case ATTRIBUTE_NAMES.TYPE_FORMAT:
            case ATTRIBUTE_NAMES.DATETIME_TYPE:
            case ATTRIBUTE_NAMES.DEFAULT_VALUE:
                const regex = new RegExp(/^[+-]\d+y[+-]\d+M[+-]\d+d[+-]\d+h[+-]\d+m$/)
                if (regex.test(this.dataset.defaultValue)) {
                    const d = new Date().setDefaultDate(`{${ this.dataset.defaultValue }}`, this.dataset.typeFormat)
                    this.componentElement[0].value = d
                } else this.componentElement[0].value = this.dataset.defaultValue
                break
            case ATTRIBUTE_NAMES.PLACEHOLDER:
                this.componentElement[0].placeholder = actualValue
                break
        }
    }

    /**
     * 依照各類型轉換特殊屬性節點
     * @param {Object} verStructure
     * @returns 
     */
    convertItByType(verStructure) {
        const regex = new RegExp(/^[+-]\d+y[+-]\d+M[+-]\d+d[+-]\d+h[+-]\d+m$/)
        const dateSetting = {'dateFormat': this.dataset.typeFormat.replace(/[m*]/g, 'i').replace(/[M*]/g, 'm').replace(/[H*]/g, 'h') || 'yyyy-mm-dd hh:ii'}
        let defaultValue = this.dataset.defaultValue
        if (regex.test(defaultValue)) {
            defaultValue = JSON.stringify({
                'date': `${ this.dataset.defaultValue.slice(0, this.dataset.defaultValue.indexOf('d') + 1) }`,
                'time': `${ this.dataset.defaultValue.slice(this.dataset.defaultValue.indexOf('d') + 1, this.dataset.defaultValue.length) }`
            })
        }
        const minLimit = {
            'date': `${ this.dataset.minLimit.slice(0, this.dataset.minLimit.indexOf('d') + 1) }`,
            'time': `${ this.dataset.minLimit.slice(this.dataset.minLimit.indexOf('d') + 1, this.dataset.minLimit.length) }`
        }
        const maxLimit = {
            'date': `${ this.dataset.maxLimit.slice(0, this.dataset.maxLimit.indexOf('d') + 1) }`,
            'time': `${ this.dataset.maxLimit.slice(this.dataset.maxLimit.indexOf('d') + 1, this.dataset.maxLimit.length) }`
        }
        const typeFormat = {}
        let startAndMinView = 2
        if (dateSetting.dateFormat.split(' ')[0] === 'yyyy/mm' || dateSetting.dateFormat.split(' ')[0] === 'yyyy-mm') startAndMinView = 3
        switch (this.dataset.datetimeType) {
            case 'datetime':
                typeFormat.date = {
                    'format': dateSetting.dateFormat.split(' ')[0],
                    'weekStart': 1,
                    'autoclose': 1,
                    'todayHighlight': 1,
                    'startView': 2,
                    'minView': 2,
                    'forceParse': 0,
                    'language': 'zh-TW'
                }
                typeFormat.time = {
                    'format': dateSetting.dateFormat.split(' ')[1],
                    'startDate': 'new Date(new Date().getFullYear()+\"/\"+new Date().getMonth()+\"/\"+new Date().getDate()+\" 00:00:00\")',
                    'datepicker': false,
                    'todayBtn': 1,
                    'autoclose': 1,
                    'todayHighlight': 1,
                    'startView': 1,
                    'minView': 0,
                    'maxView': 1,
                    'forceParse': 0,
                    'minuteStep': 1,
                    'language': 'zh-TW'
                }
                break
            case 'date':
                typeFormat.date = {
                    'format': dateSetting.dateFormat.split(' ')[0],
                    'weekStart': 1,
                    'autoclose': 1,
                    'todayHighlight': 1,
                    'startView': startAndMinView,
                    'minView': startAndMinView,
                    'forceParse': 0,
                    'language': 'zh-TW'
                }
                typeFormat.time = {
                    'startDate': 'new Date(new Date().getFullYear()+\"/\"+new Date().getMonth()+\"/\"+new Date().getDate()+\" 00:00:00\")',
                    'datepicker': false,
                    'todayBtn': 1,
                    'autoclose': 1,
                    'todayHighlight': 1,
                    'startView': 1,
                    'minView': 0,
                    'maxView': 1,
                    'forceParse': 0,
                    'minuteStep': 1,
                    'language': 'zh-TW'
                }
                break
            case 'time':
                typeFormat.time = {
                    'format': dateSetting.dateFormat.split(' ')[0],
                    'startDate': 'new Date(new Date().getFullYear()+\"/\"+new Date().getMonth()+\"/\"+new Date().getDate()+\" 00:00:00\")',
                    'datepicker': false,
                    'todayBtn': 1,
                    'autoclose': 1,
                    'todayHighlight': 1,
                    'startView': 1,
                    'minView': 0,
                    'maxView': 1,
                    'forceParse': 0,
                    'minuteStep': 1,
                    'language': 'zh-TW'
                }
                break
        }
        
        verStructure.defaultValue   = defaultValue
        verStructure.minLimit       = JSON.stringify(minLimit)
        verStructure.maxLimit       = JSON.stringify(maxLimit)
        verStructure.typeFormat     = JSON.stringify(typeFormat)
        return true
    }

    /**
     * 工具專屬屬性一般處理
     * 若有特殊處理引入後判斷解決
     * @param {String} attribute 
     * @param {Object} formToolAttributeValue 
     */
    formToolAttributeDefaultProcess(attribute, formToolAttributeValue, itemAttributes) {
        switch (attribute) {
            case ATTRIBUTE_NAMES.DATETIME_TYPE:
                /** 判定是否原生為 datetime 及 非原生不是 datetime 則使用非原生，否則都是使用原生 */
                const switchType = (itemAttributes.controlType === 'datetime' && formToolAttributeValue !== 'datetime') ? formToolAttributeValue : itemAttributes.controlType
                const dateTypeFormat = SharedUtils.onionStringDecode(itemAttributes.typeFormat)
                switch (switchType) {
                    case 'date':
                        this.dataset.typeFormat = `${ dateTypeFormat.date.format }`.replace(/[m*]/g, 'M')
                        break
                    case 'time':
                        this.dataset.typeFormat = `${ dateTypeFormat.time.format }`.replace(/[h*]/g, 'H').replace(/[i+]/g, 'm')
                        break
                    case 'datetime':
                        this.dataset.typeFormat = `${ dateTypeFormat.date.format.replace(/[m*]/g, 'M') } ${ dateTypeFormat.time.format }`.replace(/[h*]/g, 'H').replace(/[i+]/g, 'm')
                        break
                }
                this.dataset.datetimeType = formToolAttributeValue
                break
        }
    }

    /**
     * 轉置格式屬性
     * @param {String} attribute 
     * @param {Object} typeFormat 
     */
    convertTypeFormat(attribute, typeFormat) {
        return
    }

    /**
     * 轉置指定屬性
     * @param {String} attribute 
     * @param {Object} attributeValue 
     */
    convertLimitOrValue(attribute, attributeValue) {
        try {
            const dateFormat = SharedUtils.onionStringDecode(attributeValue)
            this.dataset[attribute] = dateFormat.date + dateFormat.time
        } catch (e) {
            this.dataset[attribute] = attributeValue
        } 
    }
}