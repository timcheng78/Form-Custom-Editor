import { XMLComponent } from './xml-component.js'

export class ProcessDetail extends XMLComponent {
    constructor(queryData) {
        super()
        /** 處理表 欄位 (QueryData[]) */
        this.queryData = [queryData]
    }

    deleteNodes(seq) {
        const factory = window.ComponentFactory
        const queryData = factory.getRegisterComponentBySeq(seq)
        queryData.deleteNodes()
        for (let index in this.queryData) {
            const data = this.queryData[index]
            if (data.seq === seq) {
                this.queryData.splice(index, 1)
                break
            }
        }
    }

    assignNode(object, session, parentComponent) {
        parentComponent = parentComponent.queryData
        if (!Array.isArray(parentComponent)) parentComponent = [parentComponent]
        this.queryData = parentComponent
    }
}