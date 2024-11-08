import { ApiComponent } from './api-component.js'

/** API模組 */
window.APIModule = {
    _apiSeq: 1,
    _apiGFormData: [],
    _apiNameList: [],
    _registerAPIComponents: {},
    _tempComponent: null,
    /** 創建 API */
    create (options) {
        const apiComponent = new ApiComponent(options)
        apiComponent.apiSeq = this.apiSeq
        this.registerAPIComponents[this.apiSeq++] = apiComponent
        return apiComponent
    },
    /** 移除指定編號API */
    deleteOne (seq) {
        delete this.registerAPIComponents[seq]
    },
    /** 清空已註冊的API */
    clearRegisterComponent () {
        this.registerAPIComponents = {}
        this.apiSeq = 1
    },
    /**
	 * 建立API選擇群組選項
	 * @param {Element[]} optGroup 
	 * @returns {Element[]} optGroup
	 */
	buildAPISelectOption (optGroup) {
        this.apiNameList = []
		if (!this.apiGFormData) return null
		for (let gFormObject of this.apiGFormData) {
			const sourceId = gFormObject.gForm.sourceId
			const gformItemMap = gFormObject.gForm.gformItemMap || {}
			if (Object.keys(gformItemMap).length === 0) continue
            this.apiNameList.push(gformItemMap.apiName.itemValue)
			const runModeArray = gformItemMap.runMode.itemValue.split(',')
			for (let runModeString of runModeArray) {
				const optionElement = CreateUtils.createBeanElement({
					'controlType': 'option',
					'attribute': 	[
						{
							'value': 		`${ gformItemMap.apiName.itemValue }||${ runModeString }||${ sourceId }`,
							'data-type': 	runModeString,
							'text': 		gformItemMap.apiDescription.itemValue
						}
					]
				})[0]
				switch (runModeString) {
					case 'F':
						optGroup[0].appendChild(optionElement)
						break
					case 'M':
						optGroup[1].appendChild(optionElement)
						break
					case 'B':
						optGroup[2].appendChild(optionElement)
						break
					case 'BY':
						optGroup[3].appendChild(optionElement)
						break
					case 'D':
						optGroup[4].appendChild(optionElement)
						break
					case 'DY':
						optGroup[5].appendChild(optionElement)
						break
				}
			}
		}
		return optGroup
	},
    /** API 下拉框切換事件 */
    apiSelectValueChangedEvent (e) {
        const apiValue = e.target.value
        const valueArray = apiValue.split('||')
        const position = this.apiNameList.indexOf(valueArray[0])
        const apiModule = nursing.createApiModule()
        const targetGFormData = this.apiGFormData[position].gForm
        if (!this.tempComponent) this.tempComponent = new ApiComponent({})
        apiModule.fn.setApiModule(targetGFormData)
        this.tempComponent.apiName = valueArray[0]
        this.tempComponent.runMode = valueArray[1]
        this.tempComponent.sourceId = valueArray[2]
        this.tempComponent.eApiModule = apiModule
        this.tempComponent.buildParamTable('send')
        this.tempComponent.buildParamTable('receive')
        return this.tempComponent
    },
    /** API 查詢事件 */
    apiSearchEvent (e) {
        /** API 查詢輸入框 */
        const apiSearchBox 		= document.querySelector('#api-list-search-box')
        /** API 清單 */
		const apiList 			= document.querySelector('#api-list-list')
        /** API 輸入框值 */
		const apiSearchValue  	= apiSearchBox.value
		apiList.childNodes.forEach(node => {
			if (node.innerText.includes(apiSearchValue)) node.classList.remove('hide')
			else node.classList.add('hide')
		})
    },
    /** 設定 API 元件 */
    set registerAPIComponents (registerAPIComponents) {
        this._registerAPIComponents = registerAPIComponents
    },
    /** 取得 API 元件 */
    get registerAPIComponents () {
        return this._registerAPIComponents
    },
    /** 設定序號 */
    set apiSeq (apiSeq) {
        this._apiSeq = apiSeq
    },
    /** 取得序號 */
    get apiSeq () {
        return this._apiSeq
    },
    /** 設定 API GForm 資料 */
    set apiGFormData (apiGFormData) {
        this._apiGFormData = apiGFormData
    },
    /** 取得 API GForm 資料 */
    get apiGFormData () {
        return this._apiGFormData
    },
    /** 設定 API 名稱陣列 */
    set apiNameList (apiNameList) {
        this._apiNameList = apiNameList
    },
    /** 取得 API 名稱陣列 */
    get apiNameList () {
        return this._apiNameList
    },
    /** 設定 API 暫存 */
    set tempComponent (tempComponent) {
        this._tempComponent = tempComponent
    },
    /** 取得 API 暫存 */
    get tempComponent () {
        return this._tempComponent
    }
}