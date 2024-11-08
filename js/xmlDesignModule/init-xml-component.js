import { ReportGenerator } from './xmlComponents/report-generator.js'
import { Algorithm } from './xmlComponents/algorithm.js'
import { ResultTable } from './xmlComponents/result-table.js'
import { MainFile } from './xmlComponents/main-file.js'
import { ProcessDetail} from './xmlComponents/process-detail.js'
import { ProcessHeadTail } from './xmlComponents/process-head-tail.js'
import { NewData } from './xmlComponents/new-data.js'
import { QueryData } from './xmlComponents/query-data.js'
import { DeleteData } from './xmlComponents/delete-data.js'
import { UpdateData } from './xmlComponents/update-data.js'
import { GFormData } from './xmlComponents/g-form-data.js'
import { Key } from './xmlComponents/key.js'
import { Field } from './xmlComponents/field.js'

window.ComponentFactory = {
    seq: 1,
    components: {
        __reportGenerator: ReportGenerator,
        __algorithm: Algorithm,
        __resultTable: ResultTable,
        __mainFile: MainFile,
        __processDetail: ProcessDetail,
        __processHeadTail: ProcessHeadTail,
        __newData: NewData,
        __queryData: QueryData,
        __deleteData: DeleteData,
        __updateData: UpdateData,
        __gFormData: GFormData,
        __key: Key,
        __field: Field
    },
    _beforeDeleteData: {},
    _registerComponent: {},
    create(name, ...args) {
        const component = this.components[name]
        if (component === undefined) {
            console.error('生成元件模組發生錯誤，無此類型元件')
            return false
        }
        const componentClass = new component(...args)
        this.setRegisterComponent(componentClass)
        return componentClass
    },
    getRegisterComponentBySeq(seq) {
        return this.registerComponent[seq]
    },
    setRegisterComponent(component) {
        component.seq = this.seq
        this.registerComponent[this.seq++] = component
    },
    getMainTable() {
        for (let seq in this.registerComponent) {
            if (this.registerComponent[seq].constructor.name !== 'MainFile') continue
            return this.registerComponent[seq]
        }
        return null
    },
    getProcessDetail() {
        for (let seq in this.registerComponent) {
            if (this.registerComponent[seq].constructor.name !== 'ProcessDetail') continue
            return this.registerComponent[seq]
        }
        return null
    },
    getProcessHeadTail() {
        for (let seq in this.registerComponent) {
            if (this.registerComponent[seq].constructor.name !== 'ProcessHeadTail') continue
            return this.registerComponent[seq]
        }
        return null
    },
    getResultTable() {
        const result = []
        for (let seq in this.registerComponent) {
            if (this.registerComponent[seq].constructor.name !== 'ResultTable') continue
            result.push(this.registerComponent[seq])
        }
        return result
    }, 
    getBeforeDelete() {
        return this.beforeDeleteData
    },
    setBeforeDelete(deleteData) {
        this.beforeDeleteData = deleteData
    },
    removeBeforeDelete() {
        if (Object.keys(this.beforeDeleteData).length === 0) return null
        this.beforeDeleteData.deleteNodes()
        this.removeNodeBySeq(this.beforeDeleteData.seq)
        this.beforeDeleteData = {}
    },
    removeMainTable() {
        for (let seq in this.registerComponent) {
            if (this.registerComponent[seq].constructor.name !== 'MainFile') continue
            this.registerComponent[seq].deleteNodes()
            delete this.registerComponent[seq]
            break
        }
    },
    removeNodeBySeq(seq) {
        delete this.registerComponent[seq]
    },
    importXML(xmlString) {
        const factory = this
        const x2js = new X2JS({
            switchNodeName: {
                ReportGenerator: "reportGenerator",
                Algorithm: "algorithm",
                QueryData: "queryData",
                NewData: "newData",
                DeleteData: "deleteData",
                UpdateData: "updateData",
                MainFile: "mainFile",
                Key: "key",
                Process_Detail: "processDetail",
                Process_Tail: "processHeadTail",
                ResultTable: "resultTable",
                Field: "field",
                GformData: "gFormData",
            },
            switchAttributeName: {
                TotalLevel: "totalLevel",
                NAME: "name",
                Level: "level",
                Description: "description",
                DataSource: "dataSource",
            }
        })
        const json = x2js.xml_str2json(xmlString)
        const reportGenerator = recursiveObject(json, queryListLocalSession)
        reportGenerator.reportGenerator.algorithm.showView()


        function recursiveObject(jsonObject, session) {
            if (Array.isArray(jsonObject)) {
                for (let item of jsonObject) {
                    recursiveObject(item, session)
                }
            } else if (typeof jsonObject === 'object') {
                const resultObject = {}
                for (let node in jsonObject) {
                    if (typeof jsonObject[node] === 'object' && !Array.isArray(jsonObject[node])) {
                        const resultComponent = recursiveObject(jsonObject[node], session)
                        if (factory.components[`__${ node }`]) {
                            const tempComponent = factory.create(`__${ node }`)
                            tempComponent.assignNode(jsonObject[node], session, resultComponent)
                            resultObject[node] = tempComponent
                            if (node === 'resultTable') tempComponent.bindingTableAction(resultObject.algorithm.processTail)
                        }
                    } else if (typeof jsonObject[node] === 'object' && Array.isArray(jsonObject[node])) {
                        const resultArray = []
                        for (let item of jsonObject[node]) {
                            const component = recursiveObject(item, session)
                            const tempComponent = factory.create(`__${ node }`)
                            tempComponent.assignNode(item, session, component)
                            if (node === 'resultTable') tempComponent.bindingTableAction(resultObject.algorithm.processTail)
                            resultArray.push(tempComponent)
                        }
                        resultObject[node] = resultArray
                    }
                }
                return resultObject
            }
        }
    },
    exportXML() {
        const mainFile = this.getMainTable()
        const processDetail = this.getProcessDetail()
        const processHeadTail = this.getProcessHeadTail()
        const algorithm = new Algorithm(this.beforeDeleteData, mainFile, processDetail, processHeadTail)
        const reportGenerator = new ReportGenerator(algorithm, this.getResultTable())
        const x2js = new X2JS({
            emptyNodeForm: "object",
            canEmpty: [
                "newData",
                "updateData",
                "gFormData"
            ],
            ignoreNode: [
                "data",
                "structure",
                "mainTree"
            ],
            ignoreAttribute: [
                "_fullComponent", 
                "_seq", 
                "_fields",
                "_columnOptions",
                "_resultTable",
                "_queryData",
                "_type",
                "_mainFile",
                "_subFile"
            ],
            switchNodeName: {
                reportGenerator: "ReportGenerator",
                algorithm: "Algorithm",
                queryData: "QueryData",
                newData: "NewData",
                deleteData: "DeleteData",
                updateData: "UpdateData",
                mainFile: "MainFile",
                key: "Key",
                processDetail: "Process_Detail",
                processTail: "Process_Tail",
                resultTable: "ResultTable",
                field: "Field",
                gFormData: "GformData"
            },
            switchAttributeName: {
                totalLevel: "TotalLevel",
                name: "NAME",
                level: "Level",
                description: "Description",
                dataSource: "DataSource",
            }
        })
        return x2js.json2xml_str({reportGenerator})
    },
    resetComponent() {
        this.seq = 1
        this.registerComponent = {}
        this.beforeDeleteData = {}
    },
    set registerComponent(registerComponent) {
        this._registerComponent = registerComponent
    },
    get registerComponent() {
        return this._registerComponent
    },
    set beforeDeleteData(beforeDeleteData) {
        this._beforeDeleteData = beforeDeleteData
    },
    get beforeDeleteData() {
        return this._beforeDeleteData
    }
}