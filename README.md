# CSForm工具元件製作說明

## 元件製作流程

> &nbsp;
>
> 1. 對應資料夾底下新增 `*.js` 檔案。
>    + 新增頁 `/componentModule/addPageComponents`
>    + 清單頁 `/componentModule/listPageComponents`
>    + 查詢清單頁 `/componentModule/queryListComponents`
> 2. 以 `radio-component.js` 當作例子，按以下步驟說明：
>    1. `import { BaseComponent } from "../base-component.js"`
>    2. 繼承 `BaseComponent`
>    3. 將 `dragName` 與 `dragDescription` 賦予對應的名稱
>    4. 建立建構子，並傳入參數 `name`,`bean`,`title`
>    5. 建構子必須 `super()` 相關設定參數，參數可參照 `BaseComponent` 建構子
>    6. 將所需元件的客製化屬性設置在 `this.dataset.*` 內
>    7. 設定 `HTMLDescription` 元件產生的結構
>    8. 若有需要有重複產生的類型則放入 `repeatDescription` 並需要大量客製化
>    9. `import { ATTRIBUTE_NAMES } from "../../descriptionModule/utils-object.js"`
>    10. 註冊元件屬性 `attributes`
>    11. 呼叫父層 `modifyAttribute()` 及 `init()` 初始化
> 3. 至 `init-component.js` 內引入該檔案並註冊在對應位置，且遵循原有命名規則
>    + 新增頁 `baseComponent`
>    + 清單頁 `listComponent`
>    + 查詢清單頁 `queryListComponent`
>    + 特殊不顯示但存在元件 `specialComponent`
> 4. 按上述操作即可產生簡易元件製作，若需要客製化相關內容參照下面說明。
>
> &nbsp;

## 元件相關函數說明

> &nbsp;
>
> + `generateBeforeChanged()`：製作元件前處理函數，若有需要再製作元件前改變元件內相關參數可引入此函數並寫入需要調整的內容
> + `buildAttributeObject()`：製作元件對應的屬性列樣式及內容調整，分為七種類型：
>   1. 輸入文字類型(`text`)：通常放置在 `default` 內且最常使用的類型
>   2. 下拉框類型(`select`)：需要註冊 `optionDescription` 及 `optionValue`
>   3. 多選框類型(`checkbox`)：需要註冊 `optionDescription` 及 `optionValue`
>   4. 單選框類型(`radio`)：需要註冊 `optionDescription` 及 `optionValue`
>   5. 單選圖框類型(`imageRadio`)：需要註冊 `optionDescription` 及 `optionValue`
>   6. 區間拖曳類型(`range`)：需要註冊 `minNumber` 及 `maxNumber`，若無則預設 0 | 50
>   7. 客製化類型(`custom`)：依照需求將 `structure` 結構放入建構子最後一個參數 `*註1`
> + `componentAttributeChanged()`：元件依照屬性進行改變，將會傳入參數 `attributeName` 及 `actualValue`，依照屬性名稱進行分類並處理相關變動事件或呈現方式
> + `boxEditBeforeChanged()`：輸入文字類型編輯結束但尚未賦值前處理函數
> + `boxEditAfterChanged()`：輸入文字類型編輯結束賦值後但尚未改變元件處理函數
> + `editingAfter()`：輸入文字類型編輯結束賦值後但尚未改變元件前處理函數
> + `attributeDataSelected()`：非輸入文字類型編輯變動觸發函數
> + `typeRangeAttributeSelected()`：區間拖曳類型變動觸發函數
> + `typeRadioAttributeSelected()`：單選框類型變動觸發函數
> + `typeCheckboxAttributeSelected()`：多選框類型變動觸發函數
> + `typeSelectAttributeSelected()`：下拉框類型變動觸發函數
> + `typeButtonAttributeSelected()`：按鈕類型變動觸發函數
> + `typeTextAttributeSelected()`：輸入框類型變動觸發函數
> + `formToolAttributeDefaultProcess()`：工具屬性轉入賦值處理函數
> + `convertTypeFormat()`：轉至格式屬性賦值處理函數
> + `convertLimitOrValue()`：轉至上限下限屬性賦值處理函數
> + `cloneComponent()`：克隆元件處理函數
> + `structureExtraction()`：結構萃取函數，依照結構將結構內相關標題放置對應位置
> + `checkingByItself()`：建立結構前處理函數
> + `buildLevelStructure()`：建立層級結構，使用橫向展開屬性或群組元件使用
> + `buildTreeObject()`：建立樹狀結構物件
> + `beforeConvertProcess()`：轉換 `formVersion` 元件結構前處理函數
> + `afterConvertProcess()`：轉換 `formVersion` 元件結構後處理函數
> + `convertItByType()`：轉換 `formVersion` 時，可替某些參數進行變換
>
> &nbsp;
