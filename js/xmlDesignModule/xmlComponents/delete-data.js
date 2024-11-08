import { QueryData } from "./query-data.js";

export class DeleteData extends QueryData {
    constructor(name, dataSource, sql, test) {
        super(name, dataSource, sql)
        /** if 條件成立進行 (String) */
        this.test = test
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
                                    }
                                ]
                            }
                        },
                        {
                            "div": {
                                "class": "where-block row",
                                "children": [
                                    {
                                        "label": {
                                            "class": "col-sm-2 col-form-label",
                                            "for": "where",
                                            "text": "where條件(where)"
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
                                                        "name": "where",
                                                        "id": "where",
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

    generateContainer() {
        const fullComponent = this.structure.createElemental()
        fullComponent.forEach(element => {
            const nameInput = element.querySelector('#name')
            if (this.seq) element.dataset.seq = this.seq
            if (nameInput && this.name) nameInput.value = this.name
        })
        this.fullComponent = fullComponent
    }

    assignNode(object, session, parentComponent) {
        if (object._name) this.name = object._name
        if (object.test) this.test = object.test
        this.generateContainer()
    }
}