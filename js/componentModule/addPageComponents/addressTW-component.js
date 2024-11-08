import { ATTRIBUTE_NAMES } from '../../descriptionModule/utils-object.js'
import { BaseComponent } from "../base-component.js"
import { AttributeObject } from '../../descriptionModule/attribute-object.js'

export class AddressTWComponent extends BaseComponent {
    static dragName        = 'addressTW'
    static dragDescription = '地址'
    constructor (name, bean, title) {
        /** 建構式創建 */
        super('form-row-div pFormItem', "true", name, bean, title, "true", 'Y', "false", "true", "addressTW", "true")
        /** 各類型客製化預設設置 - 無 */
        /** 元件預設呈現結構 */
        super.HTMLDescription = [
            {
                'div': {
                    'class':    'col-2',
                    'children': [
                        {
                            'input': {
                                'class':            'form-control address-default',
                                'data-is-address':  'true',
                                'readonly':         'readonly',
                                'placeholder':      '郵遞區號'
                            }
                        }
                    ]
                }
            },
            {
                'div': {
                    'class':    'col-2',
                    'children': [
                        {
                            'select': {
                                'class':            'form-control address-default',
                                'data-is-address':  'true',
                                'disabled':         'disabled',
                                'children':         [
                                    {
                                        'option':   {
                                            'value':    '0',
                                            'text':     '縣市'
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            },
            {
                'div': {
                    'class':    'col-3',
                    'children': [
                        {
                            'select': {
                                'class':            'form-control address-default',
                                'data-is-address':  'true',
                                'disabled':         'disabled',
                                'children':         [
                                    {
                                        'option':   {
                                            'value':    '0',
                                            'text':     '鄉鎮市區'
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            },
            {
                'div': {
                    'class':    'col flex-fill',
                    'children': [
                        {
                            'input': {
                                'class':            'form-control address-default',
                                'data-is-address':  'true',
                                'readonly':         'readonly',
                                'placeholder':      '地址'
                            }
                        }
                    ]
                }
            }
        ]
        /** 註冊屬性 */
        super.attributes = [
            ATTRIBUTE_NAMES.NAME, 
            ATTRIBUTE_NAMES.EXTERNAL_NAME,
            ATTRIBUTE_NAMES.TITLE, 
            ATTRIBUTE_NAMES.DEFAULT_VALUE, 
            ATTRIBUTE_NAMES.DONT_DITTO, 
            ATTRIBUTE_NAMES.REQUIRED, 
            ATTRIBUTE_NAMES.PROMPT_TIPS, 
            ATTRIBUTE_NAMES.SHOW
        ]
        super.modifyAttribute()
        super.init()
    }

    /**
     * 依照各類型轉換特殊屬性節點
     * @param {Object} verStructure
     * @returns 
     */
    convertItByType(verStructure) {
        const typeFormat = {
            'hasZipcode': true,
            'hasCounty': true,
            'hasDistrict': true,
            'hasStreet': true
        }
        verStructure.typeFormat = JSON.stringify(typeFormat)
        return true
    }
}