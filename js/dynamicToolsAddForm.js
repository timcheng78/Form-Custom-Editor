// 表單元件(殼)
function DynamicFormItem() {
    this.name = "";                     // (String) 元件英文名稱
    this.title = "";                    // (String) 元件中文名稱(標題)
    this.showTitle = "false";           // (boolean) 是否顯示中文名稱(標題)
    this.backTitle = "";                // (String) 元件後顯示的文字
    this.printShowTitle = "";           // (boolean) 列印時是否顯示中文名稱(標題)
    this.controlType = "";              // (String) 元件類型
    this.controlMode = "";              // (String) 元件型態
    this.fileMode = "";                 // (String) 檔案模式 (限 ControlType = file)
    this.width = "";                    // (String) 元件寬度
    this.defaultValue = "";             // (String) 預設值
    this.dontDitto = "";                // (boolean) 不帶入上次新增的資料
    this.uiClass = "";                  // (String) 元素標籤內的類別
    this.horizontalFormItem = "";       // (String) 橫向展開項目
    this.verticalFormItem = "";         // (String) 向下展開項目
    this.typeFormat = "";               // (String) 日期時間格式 (限 ControlType = date/time/datetime)
    this.minLimit = "";                 // (String) 最小值
    this.maxLimit = "";                 // (String) 最大值
    this.uiScore = "";                  // (String) 分數 (目前無實際用途 可廢)
    this.uiDesc = "";                   // (String) 各項目的文字
    this.uiValue = "";                  // (String) 各項目的值
    this.displayMode = "";              // (String) 顯示方式
    this.hasOther = "";                 // (boolean) 是否有其他值
    this.otherTitle = "";               // (String) 其他值的文字
    this.otherBackTitle = "";           // (String) 其他值後顯示的文字
    this.otherWidth = "";               // (String) 其他值的寬度
    this.checked = "";                  // (St5ring) 各項目預設勾選
    this.show = "";                     // (boolean) 是否顯示元件
    this.required = "";                 // (boolean) 是否必填
    this.promptTips = "";               // (String) 元件提示文字
    this.maxlength = "";                // (integer) 最大字元長度
    this.placeholder = "";              // (String) 預設提示項目文字
    this.placeholderdate = "";          // (String) 預設提示項目文字(日期)
    this.placeholdertime = "";          // (String) 預設提示項目文字(時間)
    this.parent = "";                   // (String) 父層節點 (綁定Group元件)
    this.children = "";                 // (String) 子層節點 (綁定Group元件)
    this.click = "";                    // (String) 點擊事件 (可廢)
    this.onkeydown = "";                // (String) 鍵盤輸入是件 (可廢)
    this.blur = "";                     // (String) 失焦事件 (可廢)
    this.focus = "";                    // (String) 聚焦事件 (可廢)
    this.change = "";                   // (String) 改變事件 (可廢)
    this.tab = "";                      // (String) 所屬頁籤
    this.sortNo = "";                   // (String) 排序
    this.rowLevel = "";                 // (String) 跨行配置
    this.description = "";              // (String) 備註說明
    this.planNos = "";                  // (String) 不明白用途
    this.educationNos = "";             // (String) 不明白用途
    this.dataAdapter = "";              // (String) 不明白用途
    this.dataType = "";                 // (String) 不明白用途
    this.dataUnit = "";                 // (String) 不明白用途
    this.objAttr = "";                  // (String) 不明白用途
    this.objAttrCon = "";               // (String) 不明白用途
    this.recordItems = "";              // (String) 不明白用途
};
// 表單外框(殼)
function DynamicFormTemplate(formName, formType, ditto) {
    this.formName = formName;          // 表單中文名稱
    this.formType = formType;          // 表單英文名稱
    this.formModel = formType;         // 表單英文名稱(為了xml 實際用途不明)
    this.ditto = ditto;                // 新增是否自動帶入上次資料
    this.interlocking = "";            // (為了xml 實際用途不明)
    this.verification = "";            // (為了xml 實際用途不明)
    this.items = [                     // 表單元件陣列
        new DynamicFormItem()
    ];                   
    this.peopleCategory = "adult";     // (為了xml 實際用途不明)
    this.extData = "";                 // (為了xml 實際用途不明)
    this.version = "0";                // 版本號 (實際用途不明)
};

DynamicFormTemplate.prototype.Xmlify = function () {
    OBJtoXML({"DynamicFormTemplate": this}, 0)
}


(function() {
    'use strict';
    window.addEventListener('load', function() {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName('needs-validation');
        // Loop over them and prevent submission
        var validation = Array.prototype.filter.call(forms, function(form) {
            form.addEventListener('change', function(event) {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        });
    }, false);
})();

function showDitto(that) {
    $('#formditto-check').parent().removeClass('hide');
    $(that).hide();
}


// modal 內確定新增按鈕監聽
function newFormAdd(that) {
    var forms           = document.getElementById('modal-form');
    var formtypename    = document.getElementById('formtype-name').value;
    var formtitletext   = document.getElementById('formtitle-text').value;
    var formditto       = document.getElementById('formditto-check').checked;
    var formtype        = document.getElementById('formType');
    if (forms.checkValidity() === false) {
        return;
    }
    formtype.value = formtypename;
    var formTemplate = new DynamicFormTemplate(formtypename, formtitletext, formditto);

    $('#selectEditor').click();
    versionCodeMirror.setValue(formTemplate.parseToXml);
}

// 物件轉xml
function OBJtoXML(obj, level) {
    var xml = '';
    for (var prop in obj) {
        if (level > 0) {
            for (var i = 0; i < level; ++i) {
                xml += "\t";
            }
        }
        xml += obj[prop] instanceof Array ? '' : "<" + prop + ">";
        if (obj[prop] instanceof Array) {
            for (var array in obj[prop]) {
                console.log(typeof obj[prop][array]);
                if (typeof obj[prop][array] != "object") continue;
                xml += "<" + prop + ">";
                xml += "\n";
                xml += OBJtoXML(new Object(obj[prop][array]), level+1);
                if (level > 0) {
                    for (var i = 0; i < level; ++i) {
                        xml += "\t";
                    }
                }
                xml += "</" + prop + ">\n";
            }
        } else if (typeof obj[prop] == "object") {
            xml += "\n";
            xml += OBJtoXML(new Object(obj[prop]), level+1);
        } else {
            xml += obj[prop];
        }
        xml += obj[prop] instanceof Array ? '' : "</" + prop + ">\n";
    }
    var xml = xml.replace(/<\/?[0-9]{1,}>/g, '');
    return xml
}


