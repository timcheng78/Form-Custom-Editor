import { XMLComponent } from './xml-component.js'

export class ProcessHeadTail extends XMLComponent {
    constructor(level) {
        super()
        /** 處理次數 (level) */
        this.level = level
        /** 新增資料欄位 (NewData[]) */
        this.newData = []
        /** 更新資料欄位 (UpdateData[]) */
        this.updateData = []
        /** 刪除資料欄位 (DeleteData[]) */
        this.deleteData = []
        /** 表單欄位 (GFormData[]) */
        this.gFormData = []
    }

    deleteNodes(seq) {
        const factory = window.ComponentFactory
        const queryData = factory.getRegisterComponentBySeq(seq)
        queryData.deleteNodes()
        for (let name in this) {
            if (!Array.isArray(this[name])) continue
            this.eachNodeDelete(name, seq)
        }
    }

    eachNodeDelete(name, seq) {
        for (let index in this[name]) {
            const data = this[name][index]
            if (data.seq === seq) {
                this[name].splice(index, 1)
                break
            }
        }
    }

    assignNode(object, session, parentComponent) {
        if (object.level) this.level = object.level
        if (parentComponent.newData) this.newData = [parentComponent.newData]
        if (parentComponent.updateData) this.updateData = [parentComponent.updateData]
        if (parentComponent.deleteData) this.deleteData = [parentComponent.deleteData]
        if (parentComponent.gFormData) this.gFormData = [parentComponent.gFormData]
    }
}