import { ATTRIBUTE_NAMES_QUERY_LIST } from '../../descriptionModule/utils-object.js'
import { AttributeObject } from '../../descriptionModule/attribute-object.js'
import { QueryListComponent } from "../query-list-component.js"

export class QueryListSearchComponent extends QueryListComponent {
    constructor (nodeValue, title, template) {
        /** 建構式創建 */
        super('form-group', CreateUtils.createRandomCode() + Math.floor(Math.random() * 99), '', 'true', 'search')
        /** 各類型客製化預設設置 */
        this.dataset.searchBean     = 'true'
        this.dataset.controlType    = 'text'
        this.dataset.nodeValue      = nodeValue
        this.dataset.title          = title
        this.dataset.template       = template
        this.dataset.uiValue        = '選項'
        this.dataset.uiDesc         = '選項'
        this.dataset.defaultValue   = ''
        this.dataset.show           = 'show'
        this.dataset.dateType       = 'single'
        this.dataset.dateFormat     = 'date'
        this.dataset.defaultDate    = '-0y-0M-0d'
        this.dataset.defaultDate2   = '-0y-0M-0d'
        /** 元件預設呈現結構 - 無 */
        /** 註冊屬性 */
        super.attributes = [
            ATTRIBUTE_NAMES_QUERY_LIST.CONTROL_TYPE,
            ATTRIBUTE_NAMES_QUERY_LIST.FUNCTIONS,
            ATTRIBUTE_NAMES_QUERY_LIST.FORM_DATABASE,
            ATTRIBUTE_NAMES_QUERY_LIST.UI_DESC,
            ATTRIBUTE_NAMES_QUERY_LIST.UI_VALUE,
            ATTRIBUTE_NAMES_QUERY_LIST.DATE_TYPE,
            ATTRIBUTE_NAMES_QUERY_LIST.DATE_FORMAT,
            ATTRIBUTE_NAMES_QUERY_LIST.DEFAULT_DATE,
            ATTRIBUTE_NAMES_QUERY_LIST.DEFAULT_DATE2,
            ATTRIBUTE_NAMES_QUERY_LIST.DEFAULT_VALUE,
            ATTRIBUTE_NAMES_QUERY_LIST.SHOW
        ]
        super.modifyAttribute()
        super.init()
    }

    /** 重製元件 */
    reGenerateComponent(attributeObject) {
        if (!super.container) {
            const container = CreateUtils.createBeanElement({
                'controlType': 'div',
                'attribute': [attributeObject]
            })
            super.container = container
        }
        this.generateInnerComponent()
        super.fullComponent = super.container[0]
        return super.fullComponent
    }

    generateInnerComponent() {
        super.componentElement = []
        super.container[0].innerHTML = ''
        this.container[0].classList.value = this.container[0].classList.value.replace('form-inline', 'form-group')
        switch (this.dataset.controlType) {
            case 'text':
                const inputElement = CreateUtils.createBeanElement({
                    'controlType': 'text',
                    'attribute': 	[
                        {
                            'type': 	'text',
                            'name': 	this.dataset.nodeValue,
                            'id':       this.dataset.nodeValue,
                            'class': 	'form-control',
                            'readonly': 'readonly'
                        }
                    ]
                })[0]
                super.componentElement.push(inputElement)
                break
            case 'datetime':
                if (this.dataset.dateType === 'single') {
                    const dateElement = CreateUtils.createBeanElement({
                        'controlType': 'text',
                        'attribute': 	[
                            {
                                'type': 			'text',
                                'name': 			this.dataset.nodeValue,
                                'id':               `${ this.dataset.nodeValue }_date`,
                                'class': 			'form-control dateTimeTool dateInput',
                                'data-date-format': 'yyyy-mm-dd',
                                'readonly': 		'readonly',
                            }
                        ]
                    })[0]
                    dateElement.value = new Date().setDefaultDate(`{${ this.dataset.defaultDate }}`, 'yyyy-MM-dd')
                    const timeElement = CreateUtils.createBeanElement({
                        'controlType': 'text',
                        'attribute': 	[
                            {
                                'type': 			'text',
                                'name':				this.dataset.nodeValue,
                                'id':               `${ this.dataset.nodeValue }_time`,
                                'class': 			'form-control dateTimeTool timeInput',
                                'data-date-format': 'hh:ii',
                                'value':            '00:00',
                                'readonly': 		'readonly'
                            }
                        ]
                    })[0]
                    // timeElement.value = new Date().setDefaultDate(`{${ this.dataset.defaultDate }}`, 'HH:mm')
                    if (this.dataset.dateFormat === 'date' || this.dataset.dateFormat === 'datetime') {
                        super.componentElement.push(dateElement)
                        if (this.dataset.dateFormat === 'datetime') {
                            super.componentElement.push(timeElement)
                        }
                    } else if (this.dataset.dateFormat === 'time') {
                        super.componentElement.push(timeElement)
                    }
                } else if (this.dataset.dateType === 'interval') {
                    const dateElementFirst = CreateUtils.createBeanElement({
                        'controlType': 'text',
                        'attribute': 	[
                            {
                                'type': 			'text',
                                'name': 			this.dataset.nodeValue,
                                'id':               `${ this.dataset.nodeValue }_start_date`,
                                'class': 			'form-control dateTimeTool dateInput',
                                'data-date-format': 'yyyy-mm-dd',
                                'readonly': 		'readonly'
                            }
                        ]
                    })[0]
                    dateElementFirst.value = new Date().setDefaultDate(`{${ this.dataset.defaultDate }}`, 'yyyy-MM-dd')
                    const timeElementFirst = CreateUtils.createBeanElement({
                        'controlType': 'text',
                        'attribute': 	[
                            {
                                'type': 			'text',
                                'name': 			this.dataset.nodeValue,
                                'id':               `${ this.dataset.nodeValue }_start_time`,
                                'class': 			'form-control dateTimeTool timeInput',
                                'data-date-format': 'hh:ii',
                                'value':            '00:00',
                                'readonly': 		'readonly'
                            }
                        ]
                    })[0]
                    // timeElementFirst.value = new Date().setDefaultDate(`{${ this.dataset.defaultDate }}`, 'HH:mm')
                    if (this.dataset.dateFormat === 'date' || this.dataset.dateFormat === 'datetime') {
                        super.componentElement.push(dateElementFirst)
                        if (this.dataset.dateFormat === 'datetime') {
                            super.componentElement.push(timeElementFirst)
                        }
                    } else if (this.dataset.dateFormat === 'time') {
                        super.componentElement.push(timeElementFirst)
                    }
                    super.componentElement.push(CreateUtils.createBeanElement({
                        'controlType': 'span',
                        'attribute': 	[
                            {
                                'text': '～'
                            }
                        ]
                    })[0])
                    const dateElementSecond = CreateUtils.createBeanElement({
                        'controlType': 'text',
                        'attribute': 	[
                            {
                                'type': 			'text',
                                'name':				this.dataset.nodeValue,
                                'id':               `${ this.dataset.nodeValue }_end_date`,
                                'class': 			'form-control dateTimeTool dateInput',
                                'data-date-format': 'yyyy-mm-dd',
                                'readonly': 		'readonly'
                            }
                        ]
                    })[0]
                    dateElementSecond.value = new Date().setDefaultDate(`{${ this.dataset.defaultDate2 }}`, 'yyyy-MM-dd')
                    const timeElementSecond = CreateUtils.createBeanElement({
                        'controlType': 'text',
                        'attribute': 	[
                            {
                                'type': 			'text',
                                'name': 			this.dataset.nodeValue,
                                'id':               `${ this.dataset.nodeValue }_end_time`,
                                'class': 			'form-control dateTimeTool timeInput',
                                'data-date-format': 'hh:ii',
                                'value':            '23:59',
                                'readonly': 		'readonly'
                            }
                        ]
                    })[0]
                    // timeElementSecond.value = new Date().setDefaultDate(`{${ this.dataset.defaultDate2 }}`, 'HH:mm')
                    if (this.dataset.dateFormat === 'date' || this.dataset.dateFormat === 'datetime') {
                        super.componentElement.push(dateElementSecond)
                        if (this.dataset.dateFormat === 'datetime') {
                            super.componentElement.push(timeElementSecond)
                        }
                    } else if (this.dataset.dateFormat === 'time') {
                        super.componentElement.push(timeElementSecond)
                    }
                }
                break
            case 'checkbox':
            case 'radio':
                this.container[0].classList.value = this.container[0].classList.value.replace('form-group', 'form-inline')
                const newOptionsArray   = this.dataset.uiDesc.split(',')
                const newValueArray     = this.dataset.uiValue.split(',')
                const newCheckArray     = this.dataset.defaultValue.split(',')
                // 長度一樣則不建立任何新元件，純粹修改原有參數
                for (let i = 0, len = newOptionsArray.length; i < len; ++i) {
                    /** deep copy */
                    const cloneDescription = {
                        'div': {
                            'class':    'form-check form-check-inline',
                            'children': [
                                {
                                    "input": {
                                        "type":     this.dataset.controlType,
                                        "class":    "form-check-input checkbox-default",
                                        "value":    newValueArray[i],
                                        "name":     this.dataset.nodeValue,
                                        "id":       this.dataset.nodeValue + i,
                                        "checked":  newCheckArray[i] === 'true' ? 'true' : undefined
                                    }
                                },
                                {
                                    "label": {
                                        "class":    "form-check-label radio-label-default",
                                        "for":      this.dataset.nodeValue + i,
                                        "text":     newOptionsArray[i]
                                    }
                                }
                            ]
                        }
                    }
                    const optionElement = cloneDescription.createElemental()[0]
                    super.componentElement.push(optionElement)
                }
                super.componentElement.forEach((element, index) => {
                    const labelElement  = element.querySelector('.form-check-label')
                    const uiDesc        = this.dataset.uiDesc
                    labelElement.textContent = uiDesc.split(',')[index]
                })
                try {
                    super.container.forEach(element => {
                        element.innerHTML = ''
                        super.componentElement.forEach(innerElement => {
                            element.appendChild(innerElement)
                        })
                        throw { } // break
                    })
                } catch (e) { }
                break
            case 'select':
                const selectElement  = {
                    'select': {
                        'class':     'form-control select-default',
                        'name':      this.dataset.nodeValue,
                        'id':        this.dataset.nodeValue,
                        'children':  []
                    }
                }.createElemental()[0]
                super.componentElement.push(selectElement)
                const allSelectOption = {
                    'option': {
                        'text':  '全部',
                        'value': 'all-options-selected'
                    }
                }
                const selectOptionElement = allSelectOption.createElemental()[0]
                super.componentElement[0].appendChild(selectOptionElement)
                const optionsArray   = this.dataset.uiDesc.split(',')
                const valueArray     = this.dataset.uiValue.split(',')
                for (let i = 0, len = valueArray.length; i < len; ++i) {
                    /** deep copy */
                    const cloneDescription = {
                        'option': {
                            'text':  optionsArray[i],
                            'value': valueArray[i]
                        }
                    }
                    const optionElement = cloneDescription.createElemental()[0]
                    super.componentElement[0].appendChild(optionElement)
                }
                super.componentElement[0].childNodes.forEach((element, index) => {
                    if (index === 0) return
                    const uiDesc        = this.dataset.uiDesc
                    element.textContent = uiDesc.split(',')[index - 1]
                })
                try {
                    super.container.forEach(element => {
                        element.innerHTML = ''
                        super.componentElement.forEach(innerElement => {
                            element.appendChild(innerElement)
                        })
                        throw { } // break
                    })
                } catch (e) { }
                break
        }
        super.componentElement.forEach(component => {
            super.container.forEach(element => {
                element.appendChild(component)
            })
        })
        super.fullComponent = super.container[0]
        return super.fullComponent
    }

    /**
     * 改寫父層相同函數
     */
    buildAttributeObject(attrObjectArray, attributeName, zhName, actualValue) {
        switch (attributeName) {
            case ATTRIBUTE_NAMES_QUERY_LIST.CONTROL_TYPE:
                // 下拉框模式選擇屬性
                const selectAttributeObject             = new AttributeObject(attributeName, zhName, 'select', actualValue)
                selectAttributeObject.optionDescription = ["輸入框", "日期框", "多選框", "單選框", "下拉框"]
                selectAttributeObject.optionValue       = ["text", "datetime", "checkbox", "radio", "select"]
                attrObjectArray.push(selectAttributeObject)
                break
            case ATTRIBUTE_NAMES_QUERY_LIST.DATE_FORMAT:
            case ATTRIBUTE_NAMES_QUERY_LIST.DATE_TYPE:
            case ATTRIBUTE_NAMES_QUERY_LIST.DEFAULT_DATE:
            case ATTRIBUTE_NAMES_QUERY_LIST.DEFAULT_DATE2:
                if (this.dataset.controlType === 'datetime') {
                    // 預設文字輸入屬性
                    if (attributeName === ATTRIBUTE_NAMES_QUERY_LIST.DEFAULT_DATE) {
                        attrObjectArray.push(new AttributeObject(attributeName, zhName, 'text', actualValue))
                        break
                    }
                    if (this.dataset.dateType === 'interval' && attributeName === ATTRIBUTE_NAMES_QUERY_LIST.DEFAULT_DATE2) {
                        attrObjectArray.push(new AttributeObject(attributeName, zhName, 'text', actualValue))
                        break
                    } else if (attributeName === ATTRIBUTE_NAMES_QUERY_LIST.DEFAULT_DATE2) break
                    // 單選框模式選擇屬性
                    const optionAttributeObject             = new AttributeObject(attributeName, zhName, 'radio', actualValue)
                    if (attributeName === ATTRIBUTE_NAMES_QUERY_LIST.DATE_FORMAT) {
                        optionAttributeObject.optionDescription = ["日期", "日期時間", "時間"]
                        optionAttributeObject.optionValue = ["date", "datetime", "time"]
                    } else if (attributeName === ATTRIBUTE_NAMES_QUERY_LIST.DATE_TYPE) {
                        optionAttributeObject.optionDescription = ["單一", "區間"]
                        optionAttributeObject.optionValue       = ["single", "interval"]
                    }
                    attrObjectArray.push(optionAttributeObject)
                }
                break
            case ATTRIBUTE_NAMES_QUERY_LIST.SHOW:
                if (this.dataset.controlType === 'text') {
                    const attributeObject             = new AttributeObject(attributeName, zhName, 'radio', actualValue)
                    attributeObject.optionDescription = ["顯示", "隱藏"]
                    attributeObject.optionValue       = ["show", "hide"]
                    attrObjectArray.push(attributeObject)
                }
                break
            case ATTRIBUTE_NAMES_QUERY_LIST.FORM_DATABASE:
                if (this.dataset.controlType === 'select' || this.dataset.controlType === 'checkbox' || this.dataset.controlType === 'radio') {
                    const attributeObject             = new AttributeObject(attributeName, zhName, 'radio', actualValue)
                    attributeObject.optionDescription = ["是", "否"]
                    attributeObject.optionValue       = ["true", "false"]
                    attrObjectArray.push(attributeObject)
                }
                break
            case ATTRIBUTE_NAMES_QUERY_LIST.UI_DESC:
            case ATTRIBUTE_NAMES_QUERY_LIST.UI_VALUE:
                if (this.dataset.fromDatabase === 'true') break
                if (this.dataset.controlType === 'select' || this.dataset.controlType === 'checkbox' || this.dataset.controlType === 'radio') {
                    attrObjectArray.push(new AttributeObject(attributeName, zhName, 'text', actualValue))
                }
                break
            case ATTRIBUTE_NAMES_QUERY_LIST.FUNCTIONS:
                // 客製化模式選擇屬性
                const buttonNode = {
                    'button': {
                        'class':    'btn btn-primary',
                        'name':     attributeName,
                        'id':       attributeName,
                        'text':     '設定',
                        'onclick':  'inputRuleSetting()'
                    }
                }
                attrObjectArray.push(new AttributeObject(attributeName, zhName, 'custom', actualValue, buttonNode))
                break
            default:
                // 預設文字輸入屬性
                attrObjectArray.push(new AttributeObject(attributeName, zhName, 'text', actualValue))
                break
        }
    }

    /**
     * 改寫父層相同函數
     */
    componentAttributeChanged(attributeName, actualValue) {
        switch (attributeName) {
            case ATTRIBUTE_NAMES_QUERY_LIST.UI_DESC:
                if (actualValue.split(',').length !== this.dataset.uiValue.split(',').length) this.dataset.uiValue = actualValue
                super.generateComponent()
                break
            case ATTRIBUTE_NAMES_QUERY_LIST.UI_VALUE:
                this.dataset.uiValue = actualValue
                super.generateComponent()
                break
            case ATTRIBUTE_NAMES_QUERY_LIST.DEFAULT_VALUE:
                if (this.dataset.controlType === 'checkbox' || this.dataset.controlType === 'radio') {
                    if (!actualValue.includes(',')) {
                        actualValue = actualValue.replace(/T|t/g, ',true').replace(/f|F/g, ',false')
                        actualValue = actualValue.substring(1)
                    }
                    const valueArray = actualValue.split(',')
                    valueArray.forEach((checked, i) => {
                        this.componentElement.forEach((box, j) => {
                            if (i === j && checked === 'true') box.querySelector('input').checked = true
                        })
                    })
                    this.dataset.defaultValue = valueArray.join(',')
                }
                break
            case ATTRIBUTE_NAMES_QUERY_LIST.CONTROL_TYPE:
            case ATTRIBUTE_NAMES_QUERY_LIST.DATE_FORMAT:
            case ATTRIBUTE_NAMES_QUERY_LIST.DATE_TYPE:
            case ATTRIBUTE_NAMES_QUERY_LIST.DEFAULT_DATE:
            case ATTRIBUTE_NAMES_QUERY_LIST.DEFAULT_DATE2:
            case ATTRIBUTE_NAMES_QUERY_LIST.SHOW:
                super.generateComponent()
                break
        }
    }

    /** 合併元件元素 */
    mergeComponent(element) {
        super.modifyAttribute()
        return true
    }
}