import { BaseComponent } from './base-component.js'
import { TextComponent } from './addPageComponents/text-component.js'
import { TextareaComponent } from './addPageComponents/textarea-component.js'
import { DatetimeComponent } from './addPageComponents/datetime-component.js'
import { CheckboxComponent } from './addPageComponents/checkbox-component.js'
import { RadioComponent } from './addPageComponents/radio-component.js'
import { SelectComponent } from './addPageComponents/select-component.js'
import { AddressTWComponent } from './addPageComponents/addressTW-component.js'
import { ButtonComponent } from './addPageComponents/button-component.js'
import { FileUploadComponent } from './addPageComponents/file-upload-component.js'
import { SuperLinkComponent } from './addPageComponents/super-link-component.js'
import { IframeComponent } from './addPageComponents/iframe-component.js'
import { TextareaEditorComponent } from './addPageComponents/textareaEditor-component.js'
import { HumanBodyComponent } from './addPageComponents/human-image-component.js'
import { EvaluationTimeComponent } from './addPageComponents/evaluation-time-component.js'
import { ExternalDataComponent } from './addPageComponents/external-data-component.js'
import { ScoreComponent } from './addPageComponents/score-component.js'
import { GroupComponent } from './addPageComponents/group-component.js'
import { SerialNumberComponent } from './listPageComponents/serial-number-component.js'
import { CreateTimeComponent } from './listPageComponents/create-time-component.js'
import { CreatorIdComponent } from './listPageComponents/creator-id-component.js'
import { CreatorNameComponent } from './listPageComponents/creator-name-component.js'
import { LastUpdIdComponent } from './listPageComponents/last-upd-id-component.js'
import { LastUpdNameComponent } from './listPageComponents/last-upd-name-component.js'
import { LastUpdTimeComponent } from './listPageComponents/last-upd-time-component.js'
import { StatusComponent } from './listPageComponents/status-component.js'
import { CurrentVersionComponent } from './listPageComponents/current-version-component.js'
import { ParentVersionComponent } from './listPageComponents/parent-version-component.js'
import { PrintTitleComponent } from './printPageComponents/print-title-component.js'
import { DateComponent } from './printPageComponents/date-component.js'
import { PageNumberComponent } from './printPageComponents/page-number-component.js'
import { QueryListSearchComponent } from './queryListComponents/query-list-search-component.js'
import { QueryListButtonComponent } from './queryListComponents/query-list-button-component.js'
import { LabelComponent } from './label-component.js'
import { BreakLineComponent } from './break-line-component.js'
import { StyleComponent } from './style-component.js'
import { TreeObject } from '../descriptionModule/tree-object.js'
import { ContainerComponent } from "./layoutComponents/container-component.js"
// import { ClassComponent } from "./class-component.js";

window.ComponentFactory = {
    _seq: 0,
    _printSeq: 0,
    _layoutSeq: 0,
    _registerComponent: {},
    _usedPrintComponent: {},
    _usedListComponent: {},
    _usedLayoutComponent: {},
    _queryListRegisterComponent: {},
    layoutComponent: {
        /** ====== 布局元件 start ====== */
        /** 容器元件 */
        __layout: ContainerComponent,
        /** ====== 布局元件 end ====== */
    },
    baseComponent: {
        /** ====== 非元件類 start ====== */
        /** 標題元件 */
        __label:        LabelComponent,
        /** 換行元件 */
        __breakLine:    BreakLineComponent,
        /** ====== 非元件類 end ====== */
        /** ====== 元件類 start ====== */
        /** 輸入框元件 */
        __text:             TextComponent,
        /** 文字框元件 */
        __textarea:         TextareaComponent,
        /** 日期框元件 */
        __datetime:         DatetimeComponent,
        /** 多選框元件 */
        __checkbox:         CheckboxComponent,
        /** 單選框元件 */
        __radio:            RadioComponent,
        /** 下拉框元件 */
        __select:           SelectComponent,
        /** 台灣地址元件 */
        __addressTW:        AddressTWComponent,
        /** 按鈕元件 */
        __button:           ButtonComponent,
        /** 上傳檔案元件 */
        __fileUpload:       FileUploadComponent,
        /** 超連結元件 */
        __superLink:        SuperLinkComponent,
        /** 內嵌框架元件 */
        __iframe:           IframeComponent,
        /** 文本编辑元件 */
        __textareaEditor:           TextareaEditorComponent,
        /** 人形圖元件 */
        __humanBody:        HumanBodyComponent,
        /** 評估時間元件 */
        __evaluationTime:   EvaluationTimeComponent,
        /** */
        __externalData:     ExternalDataComponent
        /** ====== 元件類 end ====== */
    },
    listComponent: {
        /** ====== 清單元件 start ====== */
        /** 序號元件 */
        __serialNumber: SerialNumberComponent,
        /** 建立時間元件 */
        __createTime:   CreateTimeComponent,
        /** 創建者元件 */
        __creatorName:  CreatorNameComponent,
        /** 創建者編號元件 */
        __creatorId:    CreatorIdComponent,
        /** 最後修改日元件 */
        __lastUpdTime:  LastUpdTimeComponent,
        /** 最後修改者元件 */
        __lastUpdName:  LastUpdNameComponent,
        /** 最後修改者編號元件 */
        __lastUpdId:    LastUpdIdComponent,
        /** 狀態元件 */
        __status:       StatusComponent,
        /** 版本元件 */
        __currentVersion:      CurrentVersionComponent,
        /** 來源元件 */
        __parentVersion:    ParentVersionComponent
        /** ====== 清單元件 end ====== */
    },
    printComponent: {
        /** ====== 列印元件 start ====== */
        /** 標題元件 */
        __printTitle:   PrintTitleComponent,
        /** 日期元件 */
        __date:         DateComponent,
        /** 頁碼元件 */
        __pageNumber:   PageNumberComponent,
        /** 序號元件 */
        __serialNumber: SerialNumberComponent,
        /** 建立時間元件 */
        __createTime:   CreateTimeComponent,
        /** 創建者元件 */
        __creatorName:  CreatorNameComponent,
        /** 創建者編號元件 */
        __creatorId:    CreatorIdComponent,
        /** 最後修改日元件 */
        __lastUpdTime:  LastUpdTimeComponent,
        /** 最後修改者元件 */
        __lastUpdName:  LastUpdNameComponent,
        /** 最後修改者編號元件 */
        __lastUpdId:    LastUpdIdComponent,
        /** 表頭元件 */
        // __pageTitle:    PageTitleComponent
        /** ====== 列印元件 end ====== */
    },
    queryListComponent: {
        /** ====== 查詢清單元件 start ====== */
        /** 查詢區域元件 */
        __queryListSearch: QueryListSearchComponent,
        /** 按鈕元件 */
        __queryListButton: QueryListButtonComponent
        /** ====== 查詢清單元件 end ====== */
    },
    specialComponent: {
        /** ====== 特殊元件類 start ====== */
        /** 記分元件 */
        __score:        ScoreComponent,
        /** 群組元件 */
        __group:        GroupComponent
        /** ====== 特殊元件類 end ====== */
    },
    /** 生成模組 */
    create(name, ...args) {
        let component = this.baseComponent[name] || this.specialComponent[name]
        if (component === undefined) {
            console.error('找無該類型元件生成，使用基礎生成')
            args.unshift('form-row-div pFormItem', "true")
            args.push("true", 'Y', "false", "true", name, "true")
            args = args.filter(x => x !== undefined)
            component = BaseComponent
        }
        const componentClass = new component(...args)
        // 非元件類不需要註冊元件
        if (componentClass instanceof LabelComponent || componentClass instanceof BreakLineComponent) return componentClass
        componentClass.externalName = componentClass.dataset.bean
        componentClass.seq = ++this.seq
        this.setRegisterComponent(componentClass)
        return componentClass
    },
    /** 生成布局 */
    createLayout(name) {
        let component = this.layoutComponent[name]
        if (component === undefined) {
            console.error('生成元件模組發生錯誤，無此類型元件')
            return false
        }
        const componentClass = new component(++this.layoutSeq)
        this.setLayoutComponent(componentClass)
        return componentClass
    },
    /** 生成清單元件模組 */
    createList(name) {
        const component = this.listComponent[name]
        if (component === undefined) {
            console.error('生成元件模組發生錯誤，無此類型元件')
            return false
        }
        const componentClass = new component('list')
        this.setListComponent(componentClass)
        return componentClass
    },
    /** 生成列印元件模組 */
    createPrint(name) {
        const component = this.printComponent[name]
        if (component === undefined) {
            console.error('生成元件模組發生錯誤，無此類型元件')
            return false
        }
        const componentClass = new component('print')
        componentClass.printSeq = ++this.printSeq
        this.setPrintComponent(componentClass)
        return componentClass
    },
    /** 生成查詢清單元件模組 */
    createQueryList(name, ...args) {
        const component = this.queryListComponent[name]
        if (component === undefined) {
            console.error('生成元件模組發生錯誤，無此類型元件')
            return false
        }
        const componentClass = new component(...args)
        this.setQueryListComponent(componentClass)
        return componentClass
    },
    /** 調整樣式元件 */
    modifyStyleComponent(element) {
        const component = new StyleComponent(element)
        return component
    },
    /** 暫時棄用 */
    // modifyClassComponent(element, classList, classZhList) {
    //     return new ClassComponent(element, classList, classZhList)
    // },
    /** 合併物件模組 */
    assign(unknownComponent) {
        let controlType = unknownComponent.dataset.controlType
        if (controlType === 'file') controlType = 'fileUpload'
        else if (controlType === 'csCanvas') controlType = 'humanBody'
        else if (controlType === 'totalScore') controlType = 'score'
        const name      = `__${ controlType }`
        const component = this.baseComponent[name] || this.specialComponent[name]
        if (component === undefined) {
            console.error('生成元件模組發生錯誤，無此類型元件')
            return false
        }
        const componentClass = Object.assign(new component(unknownComponent.dataset.name, unknownComponent.dataset.name, unknownComponent.dataset.title), unknownComponent)
        if (!unknownComponent.dataset.externalName) componentClass.externalName = unknownComponent.dataset.name
        componentClass.init()
        this.seq = componentClass.seq
        this.setRegisterComponent(componentClass)
        return componentClass
    },
    mergeLayoutComponent(element) {
        let component = this.layoutComponent[`__${ element.dataset.layoutType || 'layout' }`]
        if (component === undefined) {
            console.error('生成元件模組發生錯誤，無此類型元件')
            return false
        }
        const componentClass = new component(element.dataset.seq)
        if (this.layoutSeq < element.dataset.seq) this.layoutSeq = element.dataset.seq - 0
        this.setLayoutComponent(componentClass)
        componentClass.fullComponent = element
        return componentClass
    },
    /** 生成樹狀結構模組 */
    createTreeObject(...args) {
        return new TreeObject(...args)
    },
    /** 註冊元件 */
    setRegisterComponent(component) {
        this.registerComponent[component.seq] = component
    },
    /** 取得指定註冊元件，若無回傳undefined */
    getRegisterComponentBySeq(seq = -1) {
        return this.registerComponent[seq]
    },
    /** 依照元件名稱取得指定註冊元件 */
    getRegisterComponentByName(componentName) {
        for (let seq in this.registerComponent) {
            const beanName = this.registerComponent[seq].dataset.name
            if (componentName === beanName) return this.registerComponent[seq]
        }
        return false
    },
    /** 更新指定已註冊元件 */
    updateRegisterComponent(seq, component) {
        this.registerComponent[seq] = component
    },
    /** 刪除註冊元件 */
    deleteRegisterComponent(seq) {
        delete this.registerComponent[seq]
    },
    deleteRegisterLayout(seq) {
        delete this.usedLayoutComponent[seq]
    },
    /** 建立全部已註冊元件結構 */
    buildAllRegisterComponents() {
        for (let seq in this.registerComponent) {
            this.registerComponent[seq].buildStructure()
        }
    },
    /** 檢查全部元件是否建立成功 */
    checkingAllDone() {
        for (let beanName in this.usedListComponent) {
            const component = this.usedListComponent[beanName]
            const pageBean = document.querySelector(`.web-component[data-type="${ beanName }"]`)
            if (pageBean && isListPage()) pageBean.replaceWith(component.fullComponent)
        }
        for (let seq in this.usedPrintComponent) {
            const component = this.usedPrintComponent[seq]
            const pageBean = document.querySelector(`.web-component[data-type="${ component.dataset.type }"]`)
            if (pageBean && isPrintPage()) pageBean.replaceWith(component.fullComponent)
        }
        for (let seq in this.usedLayoutComponent) {
            const component = this.usedLayoutComponent[seq]
            const pageBean = document.querySelector(`.container-component[data-seq="${ seq }"]`)
            if (pageBean && isAddPage()) pageBean.replaceWith(component.fullComponent)
        }
        for (let seq in this.registerComponent) {
            const component = this.registerComponent[seq]
            const beanName = component.dataset.name
            const pageComponent = document.querySelector(`.pFormItem[data-name="${ beanName }"], .pFormItemGroup[data-name="${ beanName }"]`)
            if (pageComponent && pageComponent !== component.fullComponent && !component.dataset.treeParent) {
                if (isAddPage()) pageComponent.replaceWith(component.fullComponent)
                else if (isListPage()) pageComponent.replaceWith(component.listComponent)
                else if (isPrintPage() && ((component.controlType === 'group' && pageComponent.tagName.toLowerCase() === 'div') || component.controlType !== 'group')) {
                    if (pageComponent.getAttribute('style')) component.printComponent.setAttribute('style', pageComponent.getAttribute('style'))
                    pageComponent.replaceWith(component.printComponent)
                }
            }
        }
    },
    /** 設定布局元件 */
    setLayoutComponent(component) {
        this.usedLayoutComponent[component.seq] = component
    },
    /** 取得單一布局元件 */
    getLayoutComponent(seq) {
        return this.usedLayoutComponent[seq]
    },
    /** 設定清單元件 */
    setListComponent(component) {
        this.usedListComponent[component.dataset.type] = component
    },
    /** 取得單一清單元件 */
    getListComponent(type) {
        return this.usedListComponent[type]
    },
    /** 更新清單元件 */
    updateListComponent(type, component) {
        this.usedListComponent[type] = component
    },
    /** 刪除清單元件 */
    deleteListComponent(type) {
        delete this.usedListComponent[type]
    },
    /** 設定列印元件 */
    setPrintComponent(component) {
        this.usedPrintComponent[component.printSeq] = component
    },
    /** 取得單一列印元件 */
    getPrintComponent(printSeq) {
        return this.usedPrintComponent[printSeq]
    },
    /** 更新列印元件 */
    updatePrintComponent(printSeq, component) {
        this.usedPrintComponent[printSeq] = component
    },
    /** 刪除列印元件 */
    deletePrintComponent(printSeq) {
        delete this.usedPrintComponent[printSeq]
    },
    /** 設定查詢清單元件 */
    setQueryListComponent(component) {
        this.queryListRegisterComponent[component.dataset.uid] = component
    },
    /** 取得查詢清單元件 */
    getQueryListRegisterComponent(uid) {
        return this.queryListRegisterComponent[uid]
    },
    /** 清空註冊元件 */
    clearRegisterComponents() {
        this.registerComponent = {}
        this.usedListComponent = {}
        this.queryListRegisterComponent = {}
        this.seq = 0
    },
    /** 清除元件樹結構 */
    clearComponentTreeStructure() {
        for (let seq in this.registerComponent) {
            this.registerComponent[seq].treeStructure = undefined
        }
    },
    /** 檢查是否有同樣名稱的元件 */
    checkComponentExist(componentName) {
        for (let seq in this.registerComponent) {
            const beanName = this.registerComponent[seq].dataset.name
            if (componentName === beanName) return true
        }
        return false
    },
    exportComponents() {
        const result = []
        for (let seq in this.registerComponent) {
            result.push(this.registerComponent[seq].exportComponent())
        }
        return result
    },
    /** 設定序號 */
    set seq(seq) {
        this._seq = seq
    },
    /** 取得序號 */
    get seq() {
        return this._seq
    },
    /** 設定序號 */
    set printSeq(printSeq) {
        this._printSeq = printSeq
    },
    /** 取得序號 */
    get printSeq() {
        return this._printSeq
    },
    /** 設定序號 */
    set layoutSeq(layoutSeq) {
        this._layoutSeq = layoutSeq
    },
    /** 取得序號 */
    get layoutSeq() {
        return this._layoutSeq
    },
    /** 設定註冊清單 */
    set registerComponent(registerComponent) {
        this._registerComponent = registerComponent
    },
    /** 取得註冊清單 */
    get registerComponent() {
        return this._registerComponent
    },
    /** 設定使用過的布局元件 */
    set usedLayoutComponent(usedLayoutComponent) {
        this._usedLayoutComponent = usedLayoutComponent
    },
    /** 取得使用過的布局元件 */
    get usedLayoutComponent() {
        return this._usedLayoutComponent
    },
    /** 設定使用過的清單元件 */
    set usedListComponent(usedListComponent) {
        this._usedListComponent = usedListComponent
    },
    /** 取得使用過的清單元件 */
    get usedListComponent() {
        return this._usedListComponent
    },
    /** 設定使用過的清單元件 */
    set usedPrintComponent(usedPrintComponent) {
        this._usedPrintComponent = usedPrintComponent
    },
    /** 取得使用過的清單元件 */
    get usedPrintComponent() {
        return this._usedPrintComponent
    },
    /** 設定查詢清單註冊清單 */
    set queryListRegisterComponent(queryListRegisterComponent) {
        this._queryListRegisterComponent = queryListRegisterComponent
    },
    /** 取得查詢清單註冊清單 */
    get queryListRegisterComponent() {
        return this._queryListRegisterComponent
    }
}