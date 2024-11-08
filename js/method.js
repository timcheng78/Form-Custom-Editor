/**
 * [將json物件轉換為xml物件]
 * @param  {number}     [階層:預設 0] 
 * @return {string}     [xml格式]
 */
Object.defineProperty(Object.prototype, 'toXml', {
    value: function (level = 0) {
        let xml = ''
        for (let prop in this) {
            if (typeof this[prop] === 'function' || prop==='twzipcode32') continue
            if (level > 0) {
                for (let i = 0; i < level; ++i) {
                    xml += "\t"
                }
            }
            xml += this[prop] instanceof Array ? '' : "<" + prop + ">"
            if (this[prop] instanceof Array) {
                // object array
                let isObjectArray = true
                for (let array in this[prop]) {
                    if (typeof this[prop][array] !== "object") {
                        isObjectArray = false
                        break
                    }
                    xml += "<" + prop + ">"
                    xml += "\n"
                    xml += new Object(this[prop][array]).toXml(level + 1)
                    if (level > 0) {
                        for (let i = 0; i < level; ++i) {
                            xml += "\t"
                        }
                    }
                    xml += "</" + prop + ">\n"
                }
                // string array
                if (!isObjectArray) {
                    xml += "<" + prop + ">"
                    xml += "\n"
                    for (let array in this[prop]) {
                        if (level > 0) {
                            for (let i = 0; i < level + 1; ++i) {
                                xml += "\t"
                            }
                        }
                        if (this[prop][array] === 'true' || this[prop][array] === 'false') {
                            xml += "<boolean>"
                            xml += (this[prop][array] + "").replace(/</g, '&lt;').replace(/>/g, '&gt;')
                            xml += "</boolean>\n"
                        } else {
                            xml += "<string>"
                            xml += (this[prop][array] + "").replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
                            xml += "</string>\n"
                        }
                    }
                    if (level > 0) {
                        for (let i = 0; i < level; ++i) {
                            xml += "\t"
                        }
                    }
                    xml += "</" + prop + ">\n"
                }
            } else if (typeof this[prop] == "object") {
                xml += "\n"
                xml += new Object(this[prop]).toXml(level + 1)
            } else {
                xml += (this[prop] + "").replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            }
            xml += this[prop] instanceof Array ? '' : "</" + prop + ">\n"
        }
        xml = xml.replace(/<\/?[0-9]{1,}>/g, '')
        return xml
    },
    enumerable: false
})

/**
 * [將json物件轉換為 Element Object]
 * 預設參數
 * @param {Element} ele 預設不用放空物件
 * @param {Boolean} isClone 是否為複製創建
 * @param {Boolean} isFrame 是否為FormFrame創建
 * @return {[Element]}     [元素陣列]
 */
Object.defineProperty(Object.prototype, 'createElemental', {
    value: function(ele = {}, isClone = false, isFrame = false) {
        let result = []
        // 判斷是否為陣列(主要針對初始陣列創建元素)
        if (Object.keys(this)[0] === '0') {
            // 依序創建元素至陣列
            for (let position in this) {
                result.push(this[position].createElemental({}, isClone, isFrame)[0])
            }
        } else {
            // 若為非陣列進入並遍歷全部屬性
            for (let key in this) {
                // 判斷是否值為陣列(針對children)，若有其他為陣列需另補入switch case
                if (Array.isArray(this[key])) {
                    switch (key) {
                        case 'children':
                            if (this[key].length > 0) {
                                for (let obj in this[key]) {
                                    if (ele.tagName.toLowerCase() === 'label' && this[key][obj].br !== undefined) continue
                                    ele.appendChild(this[key][obj].createElemental({}, isClone, isFrame)[0])
                                }
                            }
                            break
                        default:
                            break
                    }
                } else if (typeof this[key] === 'object' && this[key] !== null) {
                    // 若為物件則建立元素節點，若無法建立則略過
                    let elementObject = null
                    try {
                        elementObject = document.createElement(key)
                    } catch (e) {
                        console.error(`createElemental error: ${ e }`)
                    }
                    // 若不為空則將元素屬性遞迴進行綁定屬性動作
                    if (elementObject !== null)
                        result.push(this[key].createElemental(elementObject, isClone, isFrame))
                } else if (typeof this[key] === 'string') {
                    // 進行綁定屬性動作，依照 switch 特例進行修正，否則直接將屬性綁定至元素
                    switch (key) {
                        case 'text':
                                ele.innerHTML = this[key]
                            break
                        case 'id':
                            if (isClone) {
                                const targetElement = $(`#${ this[key] }`)[0]
                                if (targetElement !== null) ele.id = SharedUtils._uuid()
                                else ele.id = this[key]
                            } else ele.id = this[key]
                            break
                        case 'data-name':
                            if (isClone) {
                                const beanElement = document.querySelector(`.pFormItem[data-name="${ this[key] }"], .pFormItemGroup[data-name="${ this[key] }"]`)
                                if (beanElement !== null) ele.dataset.name = `${ this[key] }_clone_${ CreateUtils.createRandomCode() }`
                                else ele.dataset.name = this[key]
                            } else ele.dataset.name = this[key]
                            break
                        default:
                            if (isFrame) {
                                let regex = /^data-/
                                if (!key.match(regex)) ele.setAttribute(key, this[key])
                                if (skipDatasetAttribute.indexOf(key) > -1) ele.setAttribute(key, this[key])
                            } else ele.setAttribute(key, this[key])
                            break
                    }
                } else if (typeof this[key] === 'number' || typeof this[key] === 'boolean') {
                    // 進行綁定屬性動作，依照 switch 特例進行修正，否則直接將屬性綁定至元素
                    if (isFrame) {
                        let regex = /^data-/
                        if (!key.match(regex)) ele.setAttribute(key, this[key])
                        if (key === 'data-edit') ele.setAttribute(key, this[key])
                    } else ele.setAttribute(key, this[key])
                } else if (typeof this[key] === 'function') {
                    // 進行綁定事件動作，依照各事件進行特殊綁定，若有遺漏請自行填充使用
                    switch(key) {
                        case 'click':
                        case 'onclick':
                            ele.onclick = this[key]
                            break
                        case 'change':
                        case 'onchange':
                            ele.onchange = this[key]
                            break
                        case 'onblur':
                        case 'blur':
                            ele.onblur = this[key]
                            break
                        default:
                            ele[key] = this[key]
                            break
                    }
                }
            }
        }
        if (ele instanceof Element) return ele
        else return result
    },
    enumerable: false
})

/**
 * 兩個物件深層比對
 * @param {Object} object1
 * @param {Object} object2
 * @return {Boolean} 
 */
Object.defineProperty(Object, 'deepEqual', {
    value: function(object1, object2) {
        const keys1 = Object.keys(object1)
        const keys2 = Object.keys(object2)
        if (keys1.length !== keys2.length) {
            return false
        }
        for (const key of keys1) {
            const val1 = object1[key]
            const val2 = object2[key]
            const areObjects = isObject(val1) && isObject(val2)
            if (areObjects && !Object.deepEqual(val1, val2) || !areObjects && val1 != val2) {
                console.log(val1, val2)
                return false
            }
        }
        return true

        function isObject(object) {
            return object != null && typeof object === 'object'
        }
    },
    enumerable: false
})

Object.defineProperty(Object.prototype, 'deepClone', {
    value: function() {
        return JSON.parse(JSON.stringify(this))
    },
    enumerable: false,
    writable: true,
    configurable: true
})

Object.defineProperty(Array.prototype, 'deepClone', {
    value: function() {
        return JSON.parse(JSON.stringify(this))
    },
    enumerable: false,
    writable: true,
    configurable: true
})

/**
 * 元素陣列轉換成 json
 * 詳情參照 @function Element.convertToJson()
 * @param {Boolean} needChildren 是否需要子項目
 * @return {Array} jsonObjectArray
 */
Object.defineProperty(Array.prototype, 'convertToJson', {
    value: function (needChildren) {
        let array       = this
        let resultJson  = []
        if (array.length > 0) {
            for (let arrayValue of array) {
                if (arrayValue instanceof Element) {
                    resultJson.push(arrayValue.convertToJson(needChildren))
                }
            }
        }
        return resultJson
    },
    enumerable: false,
    writable: true,
    configurable: true
})

Object.defineProperty(Array.prototype, 'toNodeList', {
    value: function () {
        const fragment = document.createDocumentFragment()
        this.forEach(function(item) {
            fragment.appendChild(item.cloneNode())
        })
        return fragment.childNodes
    },
    enumerable: false,
    writable: true,
    configurable: true
})

Object.defineProperty(HTMLCollection.prototype, 'indexOf', {
    value: function (searchElement, fromIndex) {
        return Array.prototype.slice.call(this).indexOf(searchElement, fromIndex)
    },
    enumerable: false,
    writable: true,
    configurable: true
})

Object.defineProperty(NodeList.prototype, 'indexOf', {
    value: function (searchElement, fromIndex) {
        return Array.prototype.slice.call(this).indexOf(searchElement, fromIndex)
    },
    enumerable: false,
    writable: true,
    configurable: true
})

/**
 * 元素轉換成 json
 * 目前轉換項目
 * 【class, data-*, children, text, value】
 * 目前過濾data項目
 * 【bs.tab, datetimepicker, twzipcode32, structure, originName】
 * 以上導致 stackcall 故過濾
 * 如需各項目請小心引用
 * @param {Boolean} needChildren 是否需要子項目
 * @return {Object} jsonObject
 */
Element.prototype.convertToJson = function(needChildren = false) {
    let tagName     = this.tagName.toLowerCase()
    let resultJson  = {}
    resultJson[tagName] = {}    
    $(this).each(function() {
        let passChild = 0
        /** 檢查日期格式 */
        let regex = new RegExp("^([0-9]{4})[./|-]{1}([0-9]{1,2})[./|-]{1}([0-9]{1,2})([\\s,\\S]{0,1})([0-9]{0,2})[.:]{0,1}([0-9]{0,2})$");
        $.each(this.attributes, function() {
            if(this.specified && this.name.indexOf('data-') === -1) {
                if (this.name === 'class' && this.value.indexOf('selected') > -1) 
                    resultJson[tagName][this.name] = this.value.replace(/selected/g, '')
                else {
                    /** 過濾日期格式值 */
                    if (regex.test(this.value)) resultJson[tagName][this.name] = ''
                    else resultJson[tagName][this.name] = this.value
                } 
            }
        })
        let datasetObject = this.dataset
        for (let key in datasetObject) {
            if (key === 'bs.tab' || key === 'datetimepicker' || key === 'twzipcode32' || key === 'structure' || key === 'originName') continue
            let dataKey = `data-${ key.replace(/[A-Z]/g, function(match, offset, string) { return (offset ? '-' : '') + match.toLowerCase() }) }`
            if (Array.isArray(datasetObject[key]))
                resultJson[tagName][dataKey] = JSON.stringify(datasetObject[key])
            else if (typeof datasetObject[key] === 'object')
                resultJson[tagName][dataKey] = JSON.stringify(datasetObject[key])
            else
                resultJson[tagName][dataKey] = datasetObject[key]
        }
        if (this.children.length > 0) {
            let beanStructure = []
            if (tagName === 'label' && $(this).find('br').length > 0) passChild += $(this).find('br').length
            $.each(this.children, function() {
                let child = this.convertToJson()
                if (child.div !== undefined && child.div.class && child.div.class.indexOf('bean-drop') > -1) return 
                beanStructure.push(child)
            })
            if (this.dataset.isBean === 'Y') {
                resultJson[tagName]['data-structure'] = JSON.stringify(beanStructure)
                if (needChildren || this.classList.contains('pFormItemGroup')) resultJson[tagName].children = beanStructure
            } else
                resultJson[tagName].children = beanStructure
        }
        if ((this.innerHTML !== undefined && this.children.length === passChild) || tagName === 'button') resultJson[tagName].text = this.innerHTML
    })
    return resultJson
}

/**
 * 取得元素本體在父層內的位置
 * @return {number}
 */
Element.prototype.selfPosition = function () {
    if (!this.parentNode) return -1
    return this.parentNode.children.indexOf(this)
}

//array JSON 排序
Object.defineProperty(Array.prototype, 'sortJson', {
    value: function () {
        let json = {}
        let keys = [], orders = []
        if (arguments.length === 0) {
            console.log("排序範例：Array.sortJson({key:'a',orderby:'asc'},{key:'a.b',orderby:'desc'})")
            return this
        }
        for (let i = 0, len = arguments.length; i < len; ++i) {
            json = arguments[i]
            if (typeof(json) !== "object") {
                console.log("第" + (i + 1) + "個數組必需為json,例如{key:'aa',orderby:'desc'}-->" + json)
                return this;
            }
            orderby = (json.orderby !== undefined && typeof(json.orderby) === "string") ? json.orderby.toLowerCase() : ""
            if (orderby !== "asc" && orderby !== "desc") {
                console.log("第" + ( i + 1 ) + "個數組的參數orderby必須為desc或asc-->" + JSON.stringify(json))
                return this
            }else{
                keys.push(json.key)
                orders.push((json.orderby === "asc") ? -1 : 1)
            }
        }
        return this.sort( function(a, b) {
            let len = keys.length
            return orderFunction(0)
            function orderFunction(i) {
                if (i === len) {
                    return 1
                } else {
                    let node = keys[i].split('.')
                    let aa = $.extend(true, {}, a), bb = $.extend(true, {}, b)
                    for(let i2 = 0, len2 = node.length; i2 < len2; ++i2) {
                        aa = aa[node[i2]]
                        bb = bb[node[i2]]
                        if (aa === undefined || bb === undefined)
                            return false
                    }
                    if (aa < bb) { //asc不交換, desc交換
                        return orders[i]
                    } else if (aa > bb) { //asc交換, desc不交換
                        return orders[i] * -1
                    } else { //相同的話則繼續比較 (如果有多組key要排序)
                        return orderFunction(++i)
                    }
                }
            }
        })
    },
    enumerable: false
})

Date.prototype.format = function (format) {
    format = format || eNursing.format;
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "H+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}

/*
 *  設定日期時間
 *
 *  依照格式內規範回傳對應日期時間
 *  格式 ex1: {-0y-0M-0d-0h-0m-0s}
 *  格式 ex2: {+0y+0M+0d-0h-0m-0s} ~ {+0y+0M+0d-0h-0m-0s}
 *  英文字母前的為數學加減式 ( -1y 為前一年 )
 *
 *  @param defaultString    預設格式
 *  @param format           日期格式
 */
Date.prototype.setDefaultDate = function (defaultString, format) {
    /*
     *  參數說明
     *  dateSettingArray    存放 defaultString 值的陣列
     *  connection          兩個大括弧中間的連接號
     *  dateYear            傳入值 - 年份
     *  dateMonth           傳入值 - 月份
     *  dateDays            傳入值 - 日期
     *  dateHours           傳入值 - 小時
     *  dateMins            傳入值 - 分鐘
     *  dateSecs            傳入值 - 秒數
     *  format              預設 eNursing 內建格式
     */
    var dateSettingArray    = [];
    var connection          = "";
    var dateYear            = this.getFullYear();
    var dateMonth           = this.getMonth();
    var dateDays            = this.getDate();
    var dateHours           = this.getHours();
    var dateMins            = this.getMinutes();
    var dateSecs            = this.getSeconds();
    format                  = format || eNursing.format;
    // 將 defaultString 內的物件取出存入陣列
    // 若有連接符號則另外儲存
    for (var i = 0, len = defaultString.length; i < len; ++i) {
        try {
            var indexStart  = defaultString.indexOf('{', i);
            var indexEnd    = defaultString.indexOf('}', i);
            if (indexStart === -1 || indexEnd === -1) {
                throw new Error("defaultString 錯誤格式 \n ex1: {-0y-0M-0d} \n ex2: {+0y+0M+0d} ~ {+0y+0M+0d} \n function setDefaultDate() in eNursing.js");
            }
            dateSettingArray.push(defaultString.substring(indexStart + 1, indexEnd));
            if (dateSettingArray.length > 1) {
                connection  = defaultString.substring(i, indexStart);
            }
            i += indexEnd;
        } catch (e) {
            console.log(e)
            return;
        }
    }
    // 日期計算及轉換最終格式, 並存入原始陣列
    for (var i = 0, len = dateSettingArray.length; i < len; ++i) {
        // dateSettingArray[i] = dateSettingArray[i].toLowerCase();
        var d               = new Date();
        d.setDate(dateDays);
        d.setMonth(dateMonth);
        d.setYear(dateYear);
        d.setHours(dateHours);
        d.setMinutes(dateMins);
        d.setSeconds(dateSecs);
        if (dateSettingArray[i].indexOf('y') > -1) {
            // y
            d.setYear(eval(d.getFullYear() + dateSettingArray[i].substring(0, dateSettingArray[i].indexOf('y'))));
            if (dateSettingArray[i].indexOf('M') > -1) {
                // y-m
                d.setMonth(eval(d.getMonth() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('y') + 1, dateSettingArray[i].indexOf('M'))));
                if (dateSettingArray[i].indexOf('d') > -1) {
                    // y-m-d
                    d.setDate(eval(d.getDate() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('M') + 1, dateSettingArray[i].indexOf('d'))));
                    if (dateSettingArray[i].indexOf('h') > -1) {
                        // y-m-d-h
                        d.setHours(eval(d.getHours() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('d') + 1, dateSettingArray[i].indexOf('h'))));
                        if (dateSettingArray[i].indexOf('m') > -1) {
                            // y-m-d-h-n
                            d.setMinutes(eval(d.getMinutes() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('h') + 1, dateSettingArray[i].indexOf('m'))));
                            if (dateSettingArray[i].indexOf('s') > -1) {
                                // y-m-d-h-n-s
                                d.setSeconds(eval(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('m') + 1, dateSettingArray[i].indexOf('s'))));
                            }
                        } else {
                            if (dateSettingArray[i].indexOf('s') > -1) {
                                // y-m-d-h-s
                                d.setSeconds(eval(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('h') + 1, dateSettingArray[i].indexOf('s'))));
                            }
                        }
                    } else {
                        if (dateSettingArray[i].indexOf('m') > -1) {
                            // y-m-d-n
                            d.setMinutes(eval(d.getMinutes() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('d') + 1, dateSettingArray[i].indexOf('m'))));
                            if (dateSettingArray[i].indexOf('s') > -1) {
                                // y-m-d-n-s
                                d.setSeconds(eval(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('m') + 1, dateSettingArray[i].indexOf('s'))));
                            }
                        } else {
                            if (dateSettingArray[i].indexOf('s') > -1) {
                                // y-m-d-s
                                d.setSeconds(eval(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('d') + 1, dateSettingArray[i].indexOf('s'))));
                            }
                        }
                    }
                } else {
                    if (dateSettingArray[i].indexOf('h') > -1) {
                        // y-m-h
                        d.setHours(eval(d.getHours() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('M') + 1, dateSettingArray[i].indexOf('h'))));
                        if (dateSettingArray[i].indexOf('m') > -1) {
                            // y-m-h-n
                            d.setMinutes(eval(d.getMinutes() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('h') + 1, dateSettingArray[i].indexOf('m'))));
                            if (dateSettingArray[i].indexOf('s') > -1) {
                                // y-m-h-n-s
                                d.setSeconds(eval(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('m') + 1, dateSettingArray[i].indexOf('s'))));
                            }
                        } else {
                            if (dateSettingArray[i].indexOf('s') > -1) {
                                // y-m-h-s
                                d.setSeconds(eval(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('h') + 1, dateSettingArray[i].indexOf('s'))));
                            }
                        }
                    } else {
                        if (dateSettingArray[i].indexOf('m') > -1) {
                            // y-m-n
                            d.setMinutes(eval(d.getMinutes() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('M') + 1, dateSettingArray[i].indexOf('m'))));
                            if (dateSettingArray[i].indexOf('s') > -1) {
                                // y-m-n-s
                                d.setSeconds(eval(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('m') + 1, dateSettingArray[i].indexOf('s'))));
                            }
                        } else {
                            if (dateSettingArray[i].indexOf('s') > -1) {
                                // y-m-s
                                d.setSeconds(eval(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('M') + 1, dateSettingArray[i].indexOf('s'))));
                            }
                        }
                    }
                }
            } else {
                if (dateSettingArray[i].indexOf('d') > -1) {
                    // y-d
                    d.setDate(eval(d.getDate() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('y') + 1, dateSettingArray[i].indexOf('d'))));
                    if (dateSettingArray[i].indexOf('h') > -1) {
                        // y-d-h
                        d.setHours(eval(d.getHours() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('d') + 1, dateSettingArray[i].indexOf('h'))));
                        if (dateSettingArray[i].indexOf('m') > -1) {
                            // y-d-h-n
                            d.setMinutes(eval(d.getMinutes() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('h') + 1, dateSettingArray[i].indexOf('m'))));
                            if (dateSettingArray[i].indexOf('s') > -1) {
                                // y-d-h-n-s
                                d.setSeconds(eval(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('m') + 1, dateSettingArray[i].indexOf('s'))));
                            }
                        } else {
                            if (dateSettingArray[i].indexOf('s') > -1) {
                                // y-d-h-s
                                d.setSeconds(eval(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('h') + 1, dateSettingArray[i].indexOf('s'))));
                            }
                        }
                    } else {
                        if (dateSettingArray[i].indexOf('m') > -1) {
                            // y-d-n
                            d.setMinutes(eval(d.getMinutes() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('d') + 1, dateSettingArray[i].indexOf('m'))));
                            if (dateSettingArray[i].indexOf('s') > -1) {
                                // y-d-n-s
                                d.setSeconds(eval(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('m') + 1, dateSettingArray[i].indexOf('s'))));
                            }
                        } else {
                            if (dateSettingArray[i].indexOf('s') > -1) {
                                // y-d-s
                                d.setSeconds(eval(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('d') + 1, dateSettingArray[i].indexOf('s'))));
                            }
                        }
                    }
                } else {
                    if (dateSettingArray[i].indexOf('h') > -1) {
                        // y-h
                        d.setHours(eval(d.getHours() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('y') + 1, dateSettingArray[i].indexOf('h'))));
                        if (dateSettingArray[i].indexOf('m') > -1) {
                            // y-h-n
                            d.setMinutes(eval(d.getMinutes() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('h') + 1, dateSettingArray[i].indexOf('m'))));
                            if (dateSettingArray[i].indexOf('s') > -1) {
                                // y-h-n-s
                                d.setSeconds(eval(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('m') + 1, dateSettingArray[i].indexOf('s'))));
                            }
                        } else {
                            if (dateSettingArray[i].indexOf('s') > -1) {
                                // y-h-s
                                d.setSeconds(eval(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('h') + 1, dateSettingArray[i].indexOf('s'))));
                            }
                        }
                    } else {
                        if (dateSettingArray[i].indexOf('m') > -1) {
                            // y-n
                            d.setMinutes(eval(d.getMinutes() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('y') + 1, dateSettingArray[i].indexOf('m'))));
                            if (dateSettingArray[i].indexOf('s') > -1) {
                                // y-n-s
                                d.setSeconds(eval(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('m') + 1, dateSettingArray[i].indexOf('s'))));
                            }
                        } else {
                            if (dateSettingArray[i].indexOf('s') > -1) {
                                // y-s
                                d.setSeconds(eval(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('y') + 1, dateSettingArray[i].indexOf('s'))));
                            }
                        }
                    }
                }
            }
        } else {
            if (dateSettingArray[i].indexOf('M') > -1) {
                // m
                d.setMonth(eval(d.getMonth() + dateSettingArray[i].substring(0, dateSettingArray[i].indexOf('M'))));
                if (dateSettingArray[i].indexOf('d') > -1) {
                    // m-d
                    d.setDate(eval(d.getDate() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('M') + 1, dateSettingArray[i].indexOf('d'))));
                    if (dateSettingArray[i].indexOf('h') > -1) {
                        // m-d-h
                        d.setHours(eval(d.getHours() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('d') + 1, dateSettingArray[i].indexOf('h'))));
                        if (dateSettingArray[i].indexOf('m') > -1) {
                            // m-d-h-n
                            d.setMinutes(eval(d.getMinutes() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('h') + 1, dateSettingArray[i].indexOf('m'))));
                            if (dateSettingArray[i].indexOf('s') > -1) {
                                // m-d-h-n-s
                                d.setSeconds(eval(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('m') + 1, dateSettingArray[i].indexOf('s'))));
                            }
                        } else {
                            if (dateSettingArray[i].indexOf('s') > -1) {
                                // m-d-h-s
                                d.setSeconds(eval(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('h') + 1, dateSettingArray[i].indexOf('s'))));
                            }
                        }
                    } else {
                        if (dateSettingArray[i].indexOf('m') > -1) {
                            // m-d-n
                            d.setMinutes(eval(d.getMinutes() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('d') + 1, dateSettingArray[i].indexOf('m'))));
                            if (dateSettingArray[i].indexOf('s') > -1) {
                                // m-d-n-s
                                d.setSeconds(eval(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('m') + 1, dateSettingArray[i].indexOf('s'))));
                            }
                        } else {
                            if (dateSettingArray[i].indexOf('s') > -1) {
                                // m-d-s
                                d.setSeconds(eval(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('d') + 1, dateSettingArray[i].indexOf('s'))));
                            }
                        }
                    }
                } else {
                    if (dateSettingArray[i].indexOf('h') > -1) {
                        // m-h
                        d.setHours(eval(d.getHours() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('M') + 1, dateSettingArray[i].indexOf('h'))));
                        if (dateSettingArray[i].indexOf('m') > -1) {
                            // m-h-n
                            d.setMinutes(eval(d.getMinutes() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('h') + 1, dateSettingArray[i].indexOf('m'))));
                            if (dateSettingArray[i].indexOf('s') > -1) {
                                // m-h-n-s
                                d.setSeconds(eval(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('m') + 1, dateSettingArray[i].indexOf('s'))));
                            }
                        } else {
                            if (dateSettingArray[i].indexOf('s') > -1) {
                                // m-h-s
                                d.setSeconds(eval(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('h') + 1, dateSettingArray[i].indexOf('s'))));
                            }
                        }
                    } else {
                        if (dateSettingArray[i].indexOf('m') > -1) {
                            // m-n
                            d.setMinutes(eval(d.getMinutes() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('M') + 1, dateSettingArray[i].indexOf('m'))));
                            if (dateSettingArray[i].indexOf('s') > -1) {
                                // m-n-s
                                d.setSeconds(eval(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('m') + 1, dateSettingArray[i].indexOf('s'))));
                            }
                        } else {
                            if (dateSettingArray[i].indexOf('s') > -1) {
                                // m-s
                                d.setSeconds(eval(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('y') + 1, dateSettingArray[i].indexOf('s'))));
                            }
                        }
                    }
                }
            } else {
                if (dateSettingArray[i].indexOf('d') > -1) {
                    // d
                    d.setDate(eval(d.getDate() + dateSettingArray[i].substring(0, dateSettingArray[i].indexOf('d'))));
                    if (dateSettingArray[i].indexOf('h') > -1) {
                        // d-h
                        d.setHours(eval(d.getHours() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('d') + 1, dateSettingArray[i].indexOf('h'))));
                        if (dateSettingArray[i].indexOf('m') > -1) {
                            // d-h-n
                            d.setMinutes(eval(d.getMinutes() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('h') + 1, dateSettingArray[i].indexOf('m'))));
                            if (dateSettingArray[i].indexOf('s') > -1) {
                                // d-h-n-s
                                d.setSeconds(eval(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('m') + 1, dateSettingArray[i].indexOf('s'))));
                            }
                        } else {
                            if (dateSettingArray[i].indexOf('s') > -1) {
                                // d-h-s
                                d.setSeconds(eval(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('h') + 1, dateSettingArray[i].indexOf('s'))));
                            }
                        }
                    } else {
                        if (dateSettingArray[i].indexOf('m') > -1) {
                            // d-n
                            d.setMinutes(eval(d.getMinutes() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('d') + 1, dateSettingArray[i].indexOf('m'))));
                            if (dateSettingArray[i].indexOf('s') > -1) {
                                // d-n-s
                                d.setSeconds(eval(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('m') + 1, dateSettingArray[i].indexOf('s'))));
                            }
                        } else {
                            if (dateSettingArray[i].indexOf('s') > -1) {
                                // d-s
                                d.setSeconds(eval(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('d') + 1, dateSettingArray[i].indexOf('s'))));
                            }
                        }
                    }
                } else {
                    if (dateSettingArray[i].indexOf('h') > -1) {
                        // h
                        d.setHours(eval(d.getHours() + dateSettingArray[i].substring(0, dateSettingArray[i].indexOf('h'))));
                        if (dateSettingArray[i].indexOf('m') > -1) {
                            // h-n
                            d.setMinutes(eval(d.getMinutes() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('h') + 1, dateSettingArray[i].indexOf('m'))));
                            if (dateSettingArray[i].indexOf('s') > -1) {
                                // h-n-s
                                d.setSeconds(eval(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('m') + 1, dateSettingArray[i].indexOf('s'))));
                            }
                        } else {
                            if (dateSettingArray[i].indexOf('s') > -1) {
                                // h-s
                                d.setSeconds(eval(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('h') + 1, dateSettingArray[i].indexOf('s'))));
                            }
                        }
                    } else {
                        if (dateSettingArray[i].indexOf('m') > -1) {
                            // n
                            d.setMinutes(eval(d.getMinutes() + dateSettingArray[i].substring(0, dateSettingArray[i].indexOf('m'))));
                            if (dateSettingArray[i].indexOf('s') > -1) {
                                // n-s
                                d.setSeconds(eval(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('m') + 1, dateSettingArray[i].indexOf('s'))));
                            }
                        } else {
                            if (dateSettingArray[i].indexOf('s') > -1) {
                                // s
                                d.setSeconds(eval(d.getSeconds() + dateSettingArray[i].substring(0, dateSettingArray[i].indexOf('s'))));
                            }
                        }
                    }
                }
            }
        }
        dateSettingArray[i] = d.format(format);
    }
    return dateSettingArray.join(connection);
}