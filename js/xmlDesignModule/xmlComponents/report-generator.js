import { XMLComponent } from './xml-component.js'

export class ReportGenerator extends XMLComponent {
    constructor(algorithm, resultTable) {
        super()
        /** 查詢區塊 (algorithm) */
        this.algorithm = algorithm
        /** 結果區塊 (resultTable[]) */
        this.resultTable = resultTable
    }

    assignNode(object, session, parentComponent) {
        if (parentComponent.algorithm) this.algorithm = parentComponent.algorithm
        if (parentComponent.resultTable) this.resultTable = parentComponent.resultTable
    }
}