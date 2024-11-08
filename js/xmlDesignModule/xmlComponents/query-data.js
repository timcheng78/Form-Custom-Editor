import { XMLComponent } from './xml-component.js'

export class QueryData extends XMLComponent {
    constructor(name, dataSource, sql) {
        super()
        /** 名稱 */
        this.name = name
        /** 資料來源 */
        this.dataSource = dataSource
        /** select 欄位 (String) */
        this.column = null
        /** where 條件 (String) */
        this.where = null
        /** groupBy 字串 (String) */
        this.groupBy = null
        /** orderBy 字串 (String) */
        this.orderBy = null
        /** sql 字串 (String) */
        this.sql = this.setStatement(sql)
        /** 輸出結果集陣列 (Field[]) */
        this.field = []
        /** 資料存入 (Object) */
        this.data = sql
        this.structure = [
            {
                "div": {
                    "class": "d-flex flex-column",
                    "data-seq": "",
                    "children": [
                        {
                            "div": {
                                "class": "attribute-block form-group row",
                                "children": [
                                    {
                                        "label": {
                                            "class": "col-sm-2 col-form-label",
                                            "for": "name",
                                            "text": "名稱(NAME)"
                                        }
                                    },
                                    {
                                        "div": {
                                            "class": "col-sm-4",
                                            "children": [
                                                {
                                                    "input": {
                                                        "class": "form-control",
                                                        "type": "text",
                                                        "name": "name",
                                                        "id": "name",
                                                        "value": "",
                                                        "onchange": super.valueChanged.bind(this)
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        "label": {
                                            "class": "col-sm-2 col-form-label",
                                            "for": "dataSource",
                                            "text": "來源庫(DataSource)"
                                        }
                                    },
                                    {
                                        "div": {
                                            "class": "col-sm-4",
                                            "children": [
                                                {
                                                    "input": {
                                                        "class": "form-control",
                                                        "type": "text",
                                                        "name": "dataSource",
                                                        "id": "dataSource",
                                                        "value": "",
                                                        "onchange": super.valueChanged.bind(this)
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        // {
                        //     "div": {
                        //         "class": "column-block",
                        //         "children": []
                        //     }
                        // },
                        // {
                        //     "div": {
                        //         "class": "where-block",
                        //         "children": []
                        //     }
                        // },
                        // {
                        //     "div": {
                        //         "class": "groupBy-block",
                        //         "children": []
                        //     }
                        // },
                        // {
                        //     "div": {
                        //         "class": "orderBy-block",
                        //         "children": []
                        //     }
                        // },
                        {
                            "div": {
                                "class": "sql-block row",
                                "children": [
                                    {
                                        "label": {
                                            "class": "col-sm-2 col-form-label",
                                            "for": "sql",
                                            "text": "SQL語法(Sql)"
                                        }
                                    },
                                    {
                                        "div": {
                                            "class": "col-sm-10",
                                            "children": [
                                                {
                                                    "input": {
                                                        "class": "form-control",
                                                        "type": "text",
                                                        "name": "sql",
                                                        "id": "sql",
                                                        "value": "",
                                                        "onchange": super.valueChanged.bind(this)
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "div": {
                                "class": "field-block row",
                                "children": [
                                    {
                                        "label": {
                                            "class": "col-sm-2 col-form-label",
                                            "for": "sql",
                                            "text": "查詢參數(Field)"
                                        }
                                    },
                                    {
                                        "div": {
                                            "class": "col-sm-10",
                                            "children": [
                                                {
                                                    "button": {
                                                        "class": "btn btn-primary",
                                                        "onclick": "addField(this)",
                                                        "text": "添加查詢參數"
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        "div": {
                                            "class": "col-sm-12 row field-list",
                                            "children": []
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        ]
        this.generateContainer()
    }

    set name(name) {
        this._name = name
    }

    get name() {
        return this._name
    }

    set dataSource(dataSource) {
        this._dataSource = dataSource
    }

    get dataSource() {
        return this._dataSource
    }

    generateContainer() {
        const fullComponent = this.structure.createElemental()
        fullComponent.forEach(element => {
            const nameInput = element.querySelector('#name')
            const dataSourceInput = element.querySelector('#dataSource')
            const fieldList = element.querySelector('.field-list')
            const sql = element.querySelector('#sql')
            if (this.seq) element.dataset.seq = this.seq
            if (nameInput && this.name) nameInput.value = this.name
            if (dataSourceInput && this.dataSource) dataSourceInput.value = this.dataSource
            if (fieldList && this.field) this.field.forEach(component => fieldList.appendChild(component.fullComponent[0]))
            if (sql && this.sql) sql.value = this.sql
        })
        this.fullComponent = fullComponent
    }

    deleteNodes(seq) {
        const factory = window.ComponentFactory
        if (this.field) {
            if (seq) {
                for (let index in this.field) {
                    const object = this.field[index]
                    if (object.seq === seq) {
                        factory.removeNodeBySeq(seq)
                        this.field.splice(index, 1)
                        break
                    }
                }
            } else {
                for (let object of this.field) {
                    factory.removeNodeBySeq(object.seq)
                }
            }
        }
    }

    setStatement(jsonObject) {
        let resultSql = `select * from ${ this.dataSource }.${ this.name }`
        return resultSql
    }

    joinTable() {
        if (!this.data.conTable) return false
        const resultNodes = []
        let resultSql = `select * from ${ this.dataSource }.${ this.name }`
        for (let i = 0, len = this.data.conTable.length; i < len; ++i) {
            resultSql += ` left join ${ this.dataSource }.${ this.data.conTable[i].value } on ${ this.getJoinSqlColumn(this.data.conTable[i]) }`
            resultNodes.push(this.data.conTable[i].nodes)
        }
        this.sql = resultSql
        this.fullComponent[0].querySelector('#sql').value = this.sql
        return resultNodes
    }

    getJoinSqlColumn(tableObject) {
        let result = ''
        for (let i = 0, lenI = this.data.nodes.length; i < lenI; ++i) {
            if (!this.data.nodes[i].foreignKey) continue
            for (let j = 0, lenJ = tableObject.nodes.length; j < lenJ; ++j) {
                if (this.data.nodes[i].connectColumn === tableObject.nodes[j].value) {
                    if (result.length > 0) result += ' and '
                    result += `${ this.name }.${ this.data.nodes[i].connectColumn } = ${ tableObject.value }.${ tableObject.nodes[j].value }`
                }
            }
        }
        return result
    }

    assignNode(object, session, parentComponent) {
        if (object._name) {
            this.name = object._name
            const data = super.findSession(session)
            if (data) this.data = data
        }
        if (object._dataSource) this.dataSource = object._dataSource
        if (object.sql) this.sql = object.sql
        let parentObject
        if (Array.isArray(parentComponent)) parentObject = parentComponent
        else {
            if (Array.isArray(parentComponent.field)) parentObject = parentComponent.field
            else parentObject = [parentComponent.field]
        }
        this.field = parentObject
        for (let component of parentObject) {
            component.queryData = this
        }
        this.generateContainer()
    }
}
