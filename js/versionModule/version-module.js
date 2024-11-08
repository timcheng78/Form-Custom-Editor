import { AdvanceFunctions } from './advance-module.js'

/** 版本號陣列 */
const advanceModelOption = []
/** 更版彈窗內容 */
const advanceModelBody = {
    form: {
		onsubmit: "return false",
		children: [
			{
				div: {
					class: 	'form-group row',
					children: [
						{
							label: {
								class: 	'col-sm-3 col-form-label',
								text: 	'進版版號'
							}
						},
						{
							div: {
								class: 	'col-sm-9',
								children: [
									{
										select: {
											class: 	    'custom-select',
											id: 		'modalAdvanceVersion',
											name: 	    'modalAdvanceVersion',
											children:   advanceModelOption
										}
									}
								]
							}
						}
					]
				}
			}
        ]
    }
}

/** 版本模組 */
window.VersionModule = function (options) {
    this.frameElement = options.frameElement
    this.initContent = options.initContent
    this.version = options.version ? options.version - 0 : 0
    this.versionControl = VersionModule.checkVersion(this.version)
    return this.init()
}


/**
 * 檢查版本號並回傳相關使用參數
 * @param { Number } version 
 * @return { Object } result
 */
VersionModule.checkVersion = function (version = 0) {
    /**
     * 參數說明：
     * version: 表單傳入版本號
     * currentVersion: 工具當前使用版本號
     * status: 狀態 (0: 版本一致, 1: 需進版)
     * description: 進版存在進版相關敘述
     */
    const result = {
        version: version,
        currentVersion: FORM_TOOL_VERSION,
        status: 0,
        description: []
    }
    /** 工具版號大於表單記錄版號 (需進版) */
    if (FORM_TOOL_VERSION > version) {
        result.status = 1
        for (let i = (version + 1); i <= FORM_TOOL_VERSION; ++i) {
            const versionObject = {
                version: i,
                description: FORM_TOOL_VERSION_DESCRIPTION[i]
            }
            result.description.push(versionObject)
        }
    }
    return result
}

/**
 * 進版處理
 * @param { Number } advanceVersion 
 * @param { VersionModule } module 
 */
VersionModule.advanceEdition = function (advanceVersion, module) {
    for (let i = module.versionControl.version; i <= advanceVersion; ++i) {
        AdvanceFunctions[i].bind(module)()
    }
}

/**
 * 版本模組初始化
 * @returns 
 */
VersionModule.prototype.init = function () {
    const module = this
    return new Promise((resolve, reject) => {
        if (this.versionControl.status === 0) resolve(false)
        else {
            advanceModelOption.length = 0 
            advanceModelOption.push({
                option: {
                    value: 	'0',
                    text: 	'請選擇'
                }
            })
            for (let i = 0, len = this.versionControl.description.length; i < len; ++i) {
                const descriptionObject = this.versionControl.description[i]
                const optionObject = {
                    option: {
                        value: 	descriptionObject.version,
                        text: 	descriptionObject.description
                    }
                }
                advanceModelOption.push(optionObject)
            }
            CreateUtils.createModal(`custom`, {
                'title':    `版本選擇 (表單版本：${ this.versionControl.version }；當前版本：${ this.versionControl.currentVersion })`,
                'body':     advanceModelBody,
                'btn': [
                    {
                        'class':        'btn btn-secondary',
                        'data-dismiss': 'modal',
                        'text':         '取消',
                    },
                    {
                        'class': 'btn btn-success',
                        'text':  '確定'
                    }
                ],
                'callback': (index, modalElement) => {
                    const modalForm = modalElement.querySelector('form')
                    SharedUtils.loadingToggle()
                    if (index === 1) {
                        const advanceVersion = modalForm.querySelector('#modalAdvanceVersion').value
                        VersionModule.advanceEdition(advanceVersion, module)
                        module.frameElement.querySelector('div').dataset.formToolVersion = advanceVersion
                        resolve(true)
                        return true
                    } else {
                        if (module.version === 0) VersionModule.advanceEdition(0, module)
                        module.frameElement.querySelector('div').dataset.formToolVersion = module.version
                        reject(false)
                    }
                }
            })
        }
    })
}