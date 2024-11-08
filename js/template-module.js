/** 
 * 模板內容
 */
class TemplateObject {
    constructor (options) {
        /** 表單版本: number */
        this._version        = options.version || 0
        /** 表單類型: string (add, list, print) */
        this._type           = options.type || ''
        /** 表單內容: object */
        this._content        = options.content || {}
        /** 創建者: string */
        this._creator        = options.creator || ''
        /** 創建時間: number */
        this._createTime     = options.create_time || 0
        /** 備註: string */
        this._description    = options.description || ''
        /** 改變狀態: boolean (0: 未改變, 1: 改變) */
        this._isChanged      = 0
    }

    get type () {
        return this._type
    }

    set type (type) {
        this._type = type
    }

    get content () {
        return this._content
    }

    set content (content) {
        this._content = content
    }

    get description () {
        return this._description
    }

    set description (description) {
        this._description = description
    }

    get isChanged () {
        return this._isChanged
    }

    set isChanged (isChanged) {
        this._isChanged = isChanged
    }

    exportData () {
        return {
            version: this._version,
            type: this._type,
            content: this._content,
            creator: this._creator,
            create_time: this._createTime,
            description: this._description,
            is_changed: this._isChanged
        }
    }
}

/**
 * 模板殼
 */
class TemplateContainer {
    constructor (options) {
        /** 模板編號 */
        this._id = options.id
        /** 操作類型 (1: 改版, 2: 分支, 3: 複製, 4: 修改) */
        this._operation = options.operation || 1
        /** 上個版本版號 (若新版會傳0) */
        this._parentVersion = options.parent_version || 0
        /** 當前版本版號 */
        this._version = options.version || 0
        /** 保留當前版本 */
        this._keepVersion = options.keep_version || 0
        /** 醫院名稱 */
        this._hospitalName = options.hospital_name || ''
        /** 醫院標題 */
        this._hospitalTitle = options.hospital_title || ''
        /** 模板類型 (GForm, XML, queryList) */
        this._templateType = options.template_type || ''
        /** 模板名稱 */
        this._templateName = options.template_name || ''
        /** 模板標題 */
        this._templateTitle = options.template_title || ''
        /** 狀態 */
        this._status = options.status || 0
        /** 模板區 */
        this._templates = []
    }

    set parentVersion (parentVersion) {
        this._parentVersion = parentVersion
    }

    get templates () {
        return this._templates
    }

    set operation (operation) {
        this._operation = operation
    }

    get operation () {
        return this._operation
    }

    set status (status) {
        this._status = status
    }

    get status () {
        return this._status
    }

    set templates (templates) {
        if (Array.isArray(templates)) {
            this._templates = []
            templates.forEach(template => {
                if (template instanceof TemplateObject) this._templates.push(template)
                else this._templates.push(new TemplateObject(template))
            })
        } else if (templates instanceof TemplateObject) 
            this._templates = [templates]
        else 
            this._templates = [new TemplateObject(templates)]
    }

    getTemplateByType (type) {
        for (let template of this.templates) {
            if (template.type === type) return template
        }
        return null
    }

    deleteTemplateByType (type) {
        for (let i = 0, len = this.templates.length; i < len; ++i) {
            let template = this.templates[i]
            if (template.type === type) {
                this.templates.splice(i, 1)
                break
            }
        }
    }
    
    exportTemplates () {
        const result = []
        this._templates.forEach(template => {
            result.push(template.exportData())
        })
        return result
    }

    exportData () {
        return {
            operation: this._operation,
            parent_version: this._version,
            keep_version: this._keepVersion,
            hospital_name: this._hospitalName,
            hospital_title: this._hospitalTitle,
            template_type: this._templateType,
            template_name: this._templateName,
            template_title: this._templateTitle,
            status: this._status,
            templates: this.exportTemplates()
        }
    }
}

/**
 * 模板模組 API
 */
class TemplateModule {
    constructor(options) {
        this._content = {}
        if (options) {
            this._container = new TemplateContainer(options)
            this._container.templates = options.templates
        }
    }

    get content () {
        return this._content
    }

    set content (content) {
        this._content = content
    }

    get container () {
        return this._container
    }

    set container (container) {
        this._container = container
    }

    hasType (type) {
        if (this.container && this.container.templates) {
            for (let template of this.container.templates) {
                if (type === template.type) return true
            }
        }
        for (let contentType in this.content) {
            if (type === contentType) return true
        }
        return false
    }

    save (key, value) {
        this.content[key] = value
    }

    load (key) {
        if (this.content[key]) return this.content[key]
        else if (this.container) {
            const templateObject = this.container.getTemplateByType(key)
            if (templateObject) return templateObject.content
        }
        return null
    }

    delete (key) {
        if (this.content[key]) delete this.content[key]
        else if (this.container) this.container.deleteTemplateByType(key)
        console.log(this)
    }

    setContentKey (key, node, value) {
        this.content[key][node] = value
    }

    /**
     * 取得所有模板
     * 依照不同參數給予不同結果
     * 1. {醫院名稱, 模板類型} => 所有該醫院的該類型的全部模板
     * 2. {醫院名稱, 模板名稱} => 所有該醫院的該模板全部版本
     * @param {Object} options
     * @returns {Promise}
     */
    static getAllTemplates(options) {
        if (!options.hospitalName)
            return
        const URLParams = new URLSearchParams({
            hospital_name: options.hospitalName,
            template_type: options.templateType || '',
            template_name: options.templateName || ''
        })
        return fetch(`${const_csFormApiUrl}/templates?${URLParams}`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            }
        })
            .then(response => response.json())
    }
    /**
     * 取得單一模板全部資料
     * @param {String} id
     * @returns {Promise}
     */
    static getSingleTemplate(id) {
        if (!id)
            return
        return fetch(`${const_csFormApiUrl}/templates/${id}`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
            }
        })
            .then(response => response.json())
    }
    /**
     * 新增模板
     * @param {TemplateContainer} templateContainer
     * @returns {Promise}
     */
    static addTemplate(templateContainer) {
        if (!templateContainer)
            return
        return fetch(`${const_csFormApiUrl}/templates`, {
            method: 'POST',
            body: JSON.stringify(templateContainer.exportData()),
            headers: {
                'content-type': 'application/json',
            }
        })
            .then(response => response.json())
    }
}



