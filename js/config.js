/** 元件屬性版本 */
let beanAttributeVersion = 0
const skipDatasetAttribute = [
	"data-seq",
	"data-is-bean",
	"data-edit",
	"data-bean",
	"data-role",
	"data-functions",
	"data-form-type",
	"data-form-name",
	"data-form-title",
	"data-form-model",
	"data-style-ver",
	"data-form-tool-version"
]
/** gForm 元件(避免匯出被過濾到 formToolAttribute 請在此添加節點名稱) */
const gFormBaseAttribute = [
	"name",	
	"title",
	"backTitle",
	"controlType",
	"controlMode",
	"width",
	"defaultValue",
	"dontDitto",
	"horizontalFormItem",
	"verticalFormItem",
	"typeFormat",
	"minLimit",
	"maxLimit",
	"uiDesc",
	"uiValue",
	"displayMode",
	"checked",
	"required",
	"promptTips",
	"maxlength",
	"placeholder",
	"uiScore",
	"show",
	"parent",
	"children",
	"uiClass",
	"click",
	"fileMode",
	"totalScoreCons",
	"printShowTitle",
	"backTitleFamily",
	"frontTitleFamily",
	"opBackTitleFamily",
	"opFrontTitleFamily",
]

const oldFormAttribute = [
	"name",
	"title",
	"backTitle",
	"showTitle",
	"dontDitto",
	"printShowTitle",
	"controlType",
	"uiScore",
	"uiDesc",
	"uiValue",
	"displayMode",
	"horizontalFormItem",
	"show",
	"required",
	"promptTips",
	"textSize",
	"totalScoreType"
]

/** 預設元件 (未來調整重點) */
const defaultWebComponent = [
	"patientName",
	"patientMedicalNumber",
	"patientHospitalNumber",
	"patientBirthday",
	"patientIDNumber",
	"patientGender",
	// "patientLiveAddress",
	// "patientDomicileAddress",
	// "patientEducation",
	// "patientReason",
	// "patientMedicalHistory",
	// "patientDrugHistory",
	// "patientDiagnosis",
	// "patientHeWeight",
	// "patientVitalSign",
	// "patientEye",
	"yesOrNo",
	"withOrWithout",
	// "yesOrNoOrUnknown"
]

/** 預設元件名稱對照 (未來調整重點) */
const zhDefaultWebComponent = {
	"patientName": 				"病人名稱",
	"patientMedicalNumber": 	"病歷號",
	"patientHospitalNumber": 	"住院號",
	"patientBirthday": 			"出生日期",
	"patientIDNumber": 			"身分證字號",
	"patientGender": 			"性別",
	"patientLiveAddress": 		"居住地址",
	"patientDomicileAddress": 	"戶籍地址",
	"patientEducation": 		"教育程度",
	"patientReason": 			"就醫原因",
	"patientMedicalHistory": 	"家族病史",
	"patientDrugHistory": 		"藥物史",
	"patientDiagnosis": 		"診斷",
	"patientHeWeight": 			"身體質量",
	"patientVitalSign": 		"生命徵象",
	"patientEye": 				"視力",
	"yesOrNo": 					"有/無",
	"withOrWithout": 			"是/否",
	"yesOrNoOrUnknown": 		"有/無/不詳"
}

/** 預設元件類型對照 (未來調整重點) */
const typeDefaultWebComponent = {
	"patientName": 				"text",
	"patientMedicalNumber": 	"text",
	"patientHospitalNumber": 	"text",
	"patientBirthday": 			"datetime",
	"patientIDNumber": 			"text",
	"patientGender": 			"radio",
	"patientLiveAddress": 		"address",
	"patientDomicileAddress": 	"address",
	"patientEducation": 		"checkbox",
	"patientReason": 			"checkbox",
	"patientMedicalHistory": 	"checkbox",
	"patientDrugHistory": 		"checkbox",
	"patientDiagnosis": 		"checkbox",
	"patientHeWeight": 			"group",
	"patientVitalSign": 		"group",
	"patientEye": 				"group",
	"yesOrNo": 					"radio",
	"withOrWithout": 			"radio",
	"yesOrNoOrUnknown": 		"checkbox"
}

/** 預設元件結構對照 (未來調整重點) */
const structureDefaultWebComponent = {
	"patientName": 				"{\"div\":{\"class\":\"pFormItem form-row-div \",\"draggable\":\"true\",\"data-title\":\"病人名稱\",\"data-name\":\"patientName\",\"data-control-type\":\"text\",\"data-input-type\":\"text\",\"data-show\":\"true\",\"data-required\":\"0\",\"data-dont-ditto\":0,\"data-is-bean\":\"Y\",\"data-edit\":true,\"data-abandoned\":false,\"data-prompt-tips\":\"請輸入病人名稱\",\"data-placeholder\":\"病人名稱\",\"data-structure\":\"[{\\\"input\\\":{\\\"type\\\":\\\"text\\\",\\\"class\\\":\\\"form-control input-default\\\",\\\"id\\\":\\\"411f58c9-ef83-4d20-9828-20fcb602f0a8\\\",\\\"name\\\":\\\"base_input_133349\\\",\\\"placeholder\\\":\\\"病人名稱\\\",\\\"style\\\":\\\"\\\",\\\"readonly\\\":\\\"readonly\\\",\\\"text\\\":\\\"\\\"}}]\"}}",
	"patientMedicalNumber": 	"{\"div\":{\"class\":\"pFormItem form-row-div \",\"draggable\":\"true\",\"data-title\":\"病歷號\",\"data-name\":\"patientMedicalNumber\",\"data-control-type\":\"text\",\"data-input-type\":\"text\",\"data-show\":true,\"data-required\":0,\"data-dont-ditto\":0,\"data-is-bean\":\"Y\",\"data-edit\":true,\"data-abandoned\":false,\"data-prompt-tips\":\"請輸入病歷號\",\"data-placeholder\":\"病歷號\",\"data-structure\":\"[{\\\"input\\\":{\\\"type\\\":\\\"text\\\",\\\"class\\\":\\\"form-control input-default\\\",\\\"id\\\":\\\"a5a6a78b-05a5-4f71-b774-c1a915e4733c\\\",\\\"name\\\":\\\"base_input_134013\\\",\\\"placeholder\\\":\\\"病歷號\\\",\\\"style\\\":\\\"\\\",\\\"readonly\\\":\\\"readonly\\\",\\\"text\\\":\\\"\\\"}}]\"}}",
	"patientHospitalNumber": 	"{\"div\":{\"class\":\"pFormItem form-row-div \",\"draggable\":\"true\",\"data-title\":\"住院號\",\"data-name\":\"patientHospitalNumber\",\"data-control-type\":\"text\",\"data-input-type\":\"text\",\"data-show\":true,\"data-required\":0,\"data-dont-ditto\":0,\"data-is-bean\":\"Y\",\"data-edit\":true,\"data-abandoned\":false,\"data-prompt-tips\":\"請輸入住院號\",\"data-placeholder\":\"住院號\",\"data-structure\":\"[{\\\"input\\\":{\\\"type\\\":\\\"text\\\",\\\"class\\\":\\\"form-control input-default\\\",\\\"id\\\":\\\"3b815675-d5e2-4823-bc63-fe96ba1e0969\\\",\\\"name\\\":\\\"base_input_134538\\\",\\\"placeholder\\\":\\\"住院號\\\",\\\"style\\\":\\\"\\\",\\\"readonly\\\":\\\"readonly\\\",\\\"text\\\":\\\"\\\"}}]\"}}",
	"patientBirthday": 			"{\"div\":{\"class\":\"pFormItem form-row-div \",\"draggable\":\"true\",\"data-title\":\"出生日期\",\"data-name\":\"patientBirthday\",\"data-control-type\":\"datetime\",\"data-datetime-type\":\"date\",\"data-max-limit\":\"+999y-0M-0d-0h-0m\",\"data-min-limit\":\"-999y-0M-0d-0h-0m\",\"data-default-value\":\"-0y-0M-0d-0h-0m\",\"data-type-format\":\"yyyy-MM-dd\",\"data-show\":true,\"data-required\":0,\"data-dont-ditto\":0,\"data-is-bean\":\"Y\",\"data-edit\":true,\"data-abandoned\":false,\"data-prompt-tips\":\"請輸入出生日期\",\"data-placeholder\":\"出生日期\",\"data-structure\":\"[{\\\"input\\\":{\\\"type\\\":\\\"text\\\",\\\"class\\\":\\\"form-control datetime-default\\\",\\\"id\\\":\\\"344ef657-2449-4848-bdbf-4689498f613f\\\",\\\"date-date-enddate\\\":\\\"3020-06-17 13:47:00\\\",\\\"readonly\\\":\\\"readonly\\\",\\\"name\\\":\\\"base_datetime_134700\\\",\\\"placeholder\\\":\\\"出生日期\\\",\\\"data-date-language\\\":\\\"zh-TW\\\",\\\"data-date-format\\\":\\\"yyyy-mm-dd\\\",\\\"data-date-time\\\":true,\\\"data-date-autoclose\\\":true,\\\"data-date-today-btn\\\":true,\\\"data-date-startdate\\\":\\\"1022-06-17\\\",\\\"data-start-view\\\":2,\\\"data-min-view\\\":2,\\\"data-max-view\\\":3,\\\"data-date-enddate\\\":\\\"3020-06-17\\\",\\\"value\\\":\\\"2021-06-17\\\",\\\"text\\\":\\\"\\\"}}]\"}}",
	"patientIDNumber": 			"{\"div\":{\"class\":\"pFormItem form-row-div \",\"draggable\":\"true\",\"data-title\":\"身分證字號\",\"data-name\":\"patientIDNumber\",\"data-control-type\":\"text\",\"data-input-type\":\"text\",\"data-show\":true,\"data-required\":0,\"data-dont-ditto\":0,\"data-is-bean\":\"Y\",\"data-edit\":true,\"data-abandoned\":false,\"data-prompt-tips\":\"請輸入身分證字號\",\"data-placeholder\":\"身分證字號\",\"data-structure\":\"[{\\\"input\\\":{\\\"type\\\":\\\"text\\\",\\\"class\\\":\\\"form-control input-default\\\",\\\"id\\\":\\\"f79ace02-99c0-4597-a207-0ca6147dd3e4\\\",\\\"name\\\":\\\"base_input_134754\\\",\\\"placeholder\\\":\\\"身分證字號\\\",\\\"style\\\":\\\"\\\",\\\"readonly\\\":\\\"readonly\\\",\\\"text\\\":\\\"\\\"}}]\"}}",
	"patientGender": 			"{\"div\":{\"class\":\"pFormItem form-group \",\"draggable\":\"true\",\"data-title\":\"性別\",\"data-name\":\"patientGender\",\"data-control-type\":\"radio\",\"data-ui-desc\":\"男,女\",\"data-horizontal-form-item\":\"|,|\",\"data-checked\":false,\"data-ui-value\":\"男,女\",\"data-display-mode\":\"horizontal\",\"data-show\":true,\"data-required\":0,\"data-dont-ditto\":0,\"data-is-bean\":\"Y\",\"data-edit\":true,\"data-abandoned\":false,\"data-prompt-tips\":\"請輸入性別\",\"data-placeholder\":\"性別\",\"data-structure\":\"[{\\\"div\\\":{\\\"class\\\":\\\"form-check form-check-inline\\\",\\\"children\\\":[{\\\"input\\\":{\\\"type\\\":\\\"radio\\\",\\\"class\\\":\\\"form-check-input radio-default\\\",\\\"value\\\":\\\"男\\\",\\\"name\\\":\\\"patientGender\\\",\\\"id\\\":\\\"31f1877a-da6b-4ae5-8db5-4b069eb0fb3a\\\",\\\"data-score\\\":\\\"\\\",\\\"text\\\":\\\"\\\"}},{\\\"label\\\":{\\\"class\\\":\\\"form-check-label radio-label-default\\\",\\\"for\\\":\\\"31f1877a-da6b-4ae5-8db5-4b069eb0fb3a\\\",\\\"text\\\":\\\"男\\\"}}]}},{\\\"div\\\":{\\\"class\\\":\\\"form-check form-check-inline\\\",\\\"children\\\":[{\\\"input\\\":{\\\"type\\\":\\\"radio\\\",\\\"class\\\":\\\"form-check-input radio-default\\\",\\\"value\\\":\\\"女\\\",\\\"name\\\":\\\"patientGender\\\",\\\"id\\\":\\\"4ac57407-286e-436c-9d65-f3abf5740101\\\",\\\"text\\\":\\\"\\\"}},{\\\"label\\\":{\\\"class\\\":\\\"form-check-label radio-label-default\\\",\\\"for\\\":\\\"4ac57407-286e-436c-9d65-f3abf5740101\\\",\\\"text\\\":\\\"女\\\"}}]}}]\"}}",
	"patientDomicileAddress": 	"{\"div\":{\"class\":\"pFormItem form-row-div \",\"draggable\":\"true\",\"data-title\":\"戶籍地址\",\"data-name\":\"patientDomicileAddress\",\"data-control-type\":\"addressTW\",\"data-dont-ditto\":0,\"data-is-bean\":true,\"data-edit\":true,\"data-required\":\"0\",\"data-prompt-tips\":\"請選擇及輸入戶籍地址\",\"children\":[{\"div\":{\"class\":\"col-2\",\"children\":[{\"input\":{\"type\":\"text\",\"class\":\"form-control address-default\",\"id\":\"b6859a47-51df-4c49-9305-6a3263dc9df9\",\"placeholder\":\"郵遞區號\",\"data-is-address\":true,\"text\":\"\"}}]}},{\"div\":{\"class\":\"col-2\",\"children\":[{\"select\":{\"class\":\"form-control address-default\",\"id\":\"752e45ba-baef-4a6c-9d9f-a5ae93300ede\",\"placeholder\":\"郵遞區號\",\"data-is-address\":true,\"children\":[{\"option\":{\"value\":\"\",\"text\":\"縣市\"}},{\"option\":{\"value\":\"臺北市\",\"data-code\":\"A\",\"text\":\"臺北市\"}},{\"option\":{\"value\":\"基隆市\",\"data-code\":\"B\",\"text\":\"基隆市\"}},{\"option\":{\"value\":\"新北市\",\"data-code\":\"C\",\"text\":\"新北市\"}},{\"option\":{\"value\":\"連江縣\",\"data-code\":\"D\",\"text\":\"連江縣\"}},{\"option\":{\"value\":\"宜蘭縣\",\"data-code\":\"E\",\"text\":\"宜蘭縣\"}},{\"option\":{\"value\":\"釣魚臺\",\"data-code\":\"F\",\"text\":\"釣魚臺\"}},{\"option\":{\"value\":\"新竹市\",\"data-code\":\"G\",\"text\":\"新竹市\"}},{\"option\":{\"value\":\"新竹縣\",\"data-code\":\"H\",\"text\":\"新竹縣\"}},{\"option\":{\"value\":\"桃園市\",\"data-code\":\"I\",\"text\":\"桃園市\"}},{\"option\":{\"value\":\"苗栗縣\",\"data-code\":\"J\",\"text\":\"苗栗縣\"}},{\"option\":{\"value\":\"臺中市\",\"data-code\":\"K\",\"text\":\"臺中市\"}},{\"option\":{\"value\":\"彰化縣\",\"data-code\":\"L\",\"text\":\"彰化縣\"}},{\"option\":{\"value\":\"南投縣\",\"data-code\":\"M\",\"text\":\"南投縣\"}},{\"option\":{\"value\":\"嘉義市\",\"data-code\":\"N\",\"text\":\"嘉義市\"}},{\"option\":{\"value\":\"嘉義縣\",\"data-code\":\"O\",\"text\":\"嘉義縣\"}},{\"option\":{\"value\":\"雲林縣\",\"data-code\":\"P\",\"text\":\"雲林縣\"}},{\"option\":{\"value\":\"臺南市\",\"data-code\":\"Q\",\"text\":\"臺南市\"}},{\"option\":{\"value\":\"高雄市\",\"data-code\":\"R\",\"text\":\"高雄市\"}},{\"option\":{\"value\":\"南海島\",\"data-code\":\"S\",\"text\":\"南海島\"}},{\"option\":{\"value\":\"澎湖縣\",\"data-code\":\"T\",\"text\":\"澎湖縣\"}},{\"option\":{\"value\":\"金門縣\",\"data-code\":\"U\",\"text\":\"金門縣\"}},{\"option\":{\"value\":\"屏東縣\",\"data-code\":\"V\",\"text\":\"屏東縣\"}},{\"option\":{\"value\":\"臺東縣\",\"data-code\":\"W\",\"text\":\"臺東縣\"}},{\"option\":{\"value\":\"花蓮縣\",\"data-code\":\"X\",\"text\":\"花蓮縣\"}}]}}]}},{\"div\":{\"class\":\"col-3\",\"children\":[{\"select\":{\"class\":\"form-control address-default\",\"id\":\"b5a05c02-5d9b-4a69-9fe6-fc517cdad702\",\"placeholder\":\"郵遞區號\",\"data-is-address\":true,\"children\":[{\"option\":{\"value\":\"\",\"text\":\"鄉鎮市區\"}}]}}]}},{\"div\":{\"class\":\"col\",\"children\":[{\"input\":{\"type\":\"text\",\"class\":\"form-control address-default\",\"id\":\"783b6080-1cdd-452c-a111-8b65c07ded06\",\"placeholder\":\"地址\",\"data-is-address\":true,\"text\":\"\"}}]}}]}}",
	"patientLiveAddress": 		"{\"div\":{\"class\":\"pFormItem form-row-div \",\"draggable\":\"true\",\"data-title\":\"居住地址\",\"data-name\":\"patientLiveAddress\",\"data-edit\":true,\"data-is-bean\":true,\"data-dont-ditto\":0,\"data-control-type\":\"addressTW\",\"data-required\":\"0\",\"data-prompt-tips\":\"請選擇及輸入居住地址\",\"children\":[{\"div\":{\"class\":\"pFormItem form-group view-hide\",\"style\":\"\\n\",\"data-required\":1,\"data-name\":\"autoAddress\",\"draggable\":\"true\",\"data-title\":\"自動帶入\",\"data-edit\":true,\"data-is-bean\":true,\"data-dont-ditto\":0,\"data-control-type\":\"checkbox\",\"data-display-mode\":\"vertical\",\"data-ui-desc\":\"同戶籍地址\",\"data-ui-value\":\"同戶籍地址\",\"data-checked\":false,\"children\":[{\"div\":{\"class\":\"form-check d-flex align-items-center\",\"children\":[{\"input\":{\"type\":\"checkbox\",\"class\":\"form-check-input checkbox-default\",\"value\":\"同戶籍地址\",\"name\":\"autoAddress\",\"id\":\"9128e3ca-d75e-4520-b1df-58eb28498458\",\"text\":\"\"}},{\"label\":{\"class\":\"form-check-label checkbox-label-default\",\"for\":\"9128e3ca-d75e-4520-b1df-58eb28498458\",\"text\":\"同戶籍地址\"}}]}}]}},{\"div\":{\"class\":\"col-2\",\"children\":[{\"input\":{\"type\":\"text\",\"class\":\"form-control address-default\",\"id\":\"a7b6a5b6-f403-4c3d-b8ff-f79f2eb1e015\",\"placeholder\":\"郵遞區號\",\"data-is-address\":true,\"text\":\"\"}}]}},{\"div\":{\"class\":\"col-2\",\"children\":[{\"select\":{\"class\":\"form-control address-default\",\"id\":\"ea9b4be7-8577-406d-b1d3-841c5cfe6841\",\"placeholder\":\"郵遞區號\",\"data-is-address\":true,\"children\":[{\"option\":{\"value\":\"\",\"text\":\"縣市\"}},{\"option\":{\"value\":\"臺北市\",\"data-code\":\"A\",\"text\":\"臺北市\"}},{\"option\":{\"value\":\"基隆市\",\"data-code\":\"B\",\"text\":\"基隆市\"}},{\"option\":{\"value\":\"新北市\",\"data-code\":\"C\",\"text\":\"新北市\"}},{\"option\":{\"value\":\"連江縣\",\"data-code\":\"D\",\"text\":\"連江縣\"}},{\"option\":{\"value\":\"宜蘭縣\",\"data-code\":\"E\",\"text\":\"宜蘭縣\"}},{\"option\":{\"value\":\"釣魚臺\",\"data-code\":\"F\",\"text\":\"釣魚臺\"}},{\"option\":{\"value\":\"新竹市\",\"data-code\":\"G\",\"text\":\"新竹市\"}},{\"option\":{\"value\":\"新竹縣\",\"data-code\":\"H\",\"text\":\"新竹縣\"}},{\"option\":{\"value\":\"桃園市\",\"data-code\":\"I\",\"text\":\"桃園市\"}},{\"option\":{\"value\":\"苗栗縣\",\"data-code\":\"J\",\"text\":\"苗栗縣\"}},{\"option\":{\"value\":\"臺中市\",\"data-code\":\"K\",\"text\":\"臺中市\"}},{\"option\":{\"value\":\"彰化縣\",\"data-code\":\"L\",\"text\":\"彰化縣\"}},{\"option\":{\"value\":\"南投縣\",\"data-code\":\"M\",\"text\":\"南投縣\"}},{\"option\":{\"value\":\"嘉義市\",\"data-code\":\"N\",\"text\":\"嘉義市\"}},{\"option\":{\"value\":\"嘉義縣\",\"data-code\":\"O\",\"text\":\"嘉義縣\"}},{\"option\":{\"value\":\"雲林縣\",\"data-code\":\"P\",\"text\":\"雲林縣\"}},{\"option\":{\"value\":\"臺南市\",\"data-code\":\"Q\",\"text\":\"臺南市\"}},{\"option\":{\"value\":\"高雄市\",\"data-code\":\"R\",\"text\":\"高雄市\"}},{\"option\":{\"value\":\"南海島\",\"data-code\":\"S\",\"text\":\"南海島\"}},{\"option\":{\"value\":\"澎湖縣\",\"data-code\":\"T\",\"text\":\"澎湖縣\"}},{\"option\":{\"value\":\"金門縣\",\"data-code\":\"U\",\"text\":\"金門縣\"}},{\"option\":{\"value\":\"屏東縣\",\"data-code\":\"V\",\"text\":\"屏東縣\"}},{\"option\":{\"value\":\"臺東縣\",\"data-code\":\"W\",\"text\":\"臺東縣\"}},{\"option\":{\"value\":\"花蓮縣\",\"data-code\":\"X\",\"text\":\"花蓮縣\"}},{\"option\":{\"value\":\"\",\"text\":\"縣市\"}},{\"option\":{\"value\":\"臺北市\",\"data-code\":\"A\",\"text\":\"臺北市\"}},{\"option\":{\"value\":\"基隆市\",\"data-code\":\"B\",\"text\":\"基隆市\"}},{\"option\":{\"value\":\"新北市\",\"data-code\":\"C\",\"text\":\"新北市\"}},{\"option\":{\"value\":\"連江縣\",\"data-code\":\"D\",\"text\":\"連江縣\"}},{\"option\":{\"value\":\"宜蘭縣\",\"data-code\":\"E\",\"text\":\"宜蘭縣\"}},{\"option\":{\"value\":\"釣魚臺\",\"data-code\":\"F\",\"text\":\"釣魚臺\"}},{\"option\":{\"value\":\"新竹市\",\"data-code\":\"G\",\"text\":\"新竹市\"}},{\"option\":{\"value\":\"新竹縣\",\"data-code\":\"H\",\"text\":\"新竹縣\"}},{\"option\":{\"value\":\"桃園市\",\"data-code\":\"I\",\"text\":\"桃園市\"}},{\"option\":{\"value\":\"苗栗縣\",\"data-code\":\"J\",\"text\":\"苗栗縣\"}},{\"option\":{\"value\":\"臺中市\",\"data-code\":\"K\",\"text\":\"臺中市\"}},{\"option\":{\"value\":\"彰化縣\",\"data-code\":\"L\",\"text\":\"彰化縣\"}},{\"option\":{\"value\":\"南投縣\",\"data-code\":\"M\",\"text\":\"南投縣\"}},{\"option\":{\"value\":\"嘉義市\",\"data-code\":\"N\",\"text\":\"嘉義市\"}},{\"option\":{\"value\":\"嘉義縣\",\"data-code\":\"O\",\"text\":\"嘉義縣\"}},{\"option\":{\"value\":\"雲林縣\",\"data-code\":\"P\",\"text\":\"雲林縣\"}},{\"option\":{\"value\":\"臺南市\",\"data-code\":\"Q\",\"text\":\"臺南市\"}},{\"option\":{\"value\":\"高雄市\",\"data-code\":\"R\",\"text\":\"高雄市\"}},{\"option\":{\"value\":\"南海島\",\"data-code\":\"S\",\"text\":\"南海島\"}},{\"option\":{\"value\":\"澎湖縣\",\"data-code\":\"T\",\"text\":\"澎湖縣\"}},{\"option\":{\"value\":\"金門縣\",\"data-code\":\"U\",\"text\":\"金門縣\"}},{\"option\":{\"value\":\"屏東縣\",\"data-code\":\"V\",\"text\":\"屏東縣\"}},{\"option\":{\"value\":\"臺東縣\",\"data-code\":\"W\",\"text\":\"臺東縣\"}},{\"option\":{\"value\":\"花蓮縣\",\"data-code\":\"X\",\"text\":\"花蓮縣\"}}]}}]}},{\"div\":{\"class\":\"col-3\",\"children\":[{\"select\":{\"class\":\"form-control address-default\",\"id\":\"5a493b07-b12c-4ff4-8111-ff6e27fbaa51\",\"placeholder\":\"郵遞區號\",\"data-is-address\":true,\"children\":[{\"option\":{\"value\":\"\",\"text\":\"鄉鎮市區\"}},{\"option\":{\"value\":\"\",\"text\":\"鄉鎮市區\"}}]}}]}},{\"div\":{\"class\":\"col\",\"children\":[{\"input\":{\"type\":\"text\",\"class\":\"form-control address-default\",\"id\":\"f34bb079-094a-4464-a286-d27d8d37f50c\",\"placeholder\":\"地址\",\"data-is-address\":true,\"text\":\"\"}}]}}]}}",
	"patientEducation": 		"{\"div\":{\"class\":\"pFormItem form-group \",\"draggable\":\"true\",\"data-title\":\"教育程度\",\"data-name\":\"patientEducation\",\"data-checked\":false,\"data-ui-value\":\"不識字,識數字,識字,國小,國中,高中/職,專科,大學,大學以上\",\"data-ui-desc\":\"不識字,識數字,識字,國小,國中,高中/職,專科,大學,大學以上\",\"data-display-mode\":\"horizontal\",\"data-control-type\":\"checkbox\",\"data-dont-ditto\":0,\"data-is-bean\":true,\"data-edit\":true,\"data-required\":\"0\",\"data-prompt-tips\":\"請選擇教育程度\",\"children\":[{\"div\":{\"class\":\"form-check form-check-inline\",\"children\":[{\"input\":{\"type\":\"checkbox\",\"class\":\"form-check-input checkbox-default\",\"value\":\"不識字\",\"name\":\"patientEducation\",\"id\":\"f0d47536-159e-4da0-98c0-b969b220e789\",\"text\":\"\"}},{\"label\":{\"class\":\"form-check-label checkbox-label-default\",\"for\":\"f0d47536-159e-4da0-98c0-b969b220e789\",\"text\":\"不識字\"}}]}},{\"div\":{\"class\":\"form-check form-check-inline\",\"children\":[{\"input\":{\"type\":\"checkbox\",\"class\":\"form-check-input checkbox-default\",\"value\":\"識數字\",\"name\":\"patientEducation\",\"id\":\"d310d275-ded5-4c55-a628-35da11f4d47a\",\"text\":\"\"}},{\"label\":{\"class\":\"form-check-label checkbox-label-default\",\"for\":\"d310d275-ded5-4c55-a628-35da11f4d47a\",\"text\":\"識數字\"}}]}},{\"div\":{\"class\":\"form-check form-check-inline\",\"children\":[{\"input\":{\"type\":\"checkbox\",\"class\":\"form-check-input checkbox-default\",\"value\":\"識字\",\"name\":\"patientEducation\",\"id\":\"50152ed0-f2ae-4cdf-b9b6-a0a461eae316\",\"text\":\"\"}},{\"label\":{\"class\":\"form-check-label checkbox-label-default\",\"for\":\"50152ed0-f2ae-4cdf-b9b6-a0a461eae316\",\"text\":\"識字\"}}]}},{\"div\":{\"class\":\"form-check form-check-inline\",\"children\":[{\"input\":{\"type\":\"checkbox\",\"class\":\"form-check-input checkbox-default\",\"value\":\"國小\",\"name\":\"patientEducation\",\"id\":\"ebc0d4e4-f4ec-44cd-902b-763e21f61c04\",\"text\":\"\"}},{\"label\":{\"class\":\"form-check-label checkbox-label-default\",\"for\":\"ebc0d4e4-f4ec-44cd-902b-763e21f61c04\",\"text\":\"國小\"}}]}},{\"div\":{\"class\":\"form-check form-check-inline\",\"children\":[{\"input\":{\"type\":\"checkbox\",\"class\":\"form-check-input checkbox-default\",\"value\":\"國中\",\"name\":\"patientEducation\",\"id\":\"1369bc20-93f0-487e-9d6a-dee16501fdd1\",\"text\":\"\"}},{\"label\":{\"class\":\"form-check-label checkbox-label-default\",\"for\":\"1369bc20-93f0-487e-9d6a-dee16501fdd1\",\"text\":\"國中\"}}]}},{\"div\":{\"class\":\"form-check form-check-inline\",\"children\":[{\"input\":{\"type\":\"checkbox\",\"class\":\"form-check-input checkbox-default\",\"value\":\"高中/職\",\"name\":\"patientEducation\",\"id\":\"ced28b93-a79e-446f-8561-6a01ef214bc8\",\"text\":\"\"}},{\"label\":{\"class\":\"form-check-label checkbox-label-default\",\"for\":\"ced28b93-a79e-446f-8561-6a01ef214bc8\",\"text\":\"高中/職\"}}]}},{\"div\":{\"class\":\"form-check form-check-inline\",\"children\":[{\"input\":{\"type\":\"checkbox\",\"class\":\"form-check-input checkbox-default\",\"value\":\"專科\",\"name\":\"patientEducation\",\"id\":\"a87d4140-4831-4ab0-a7c8-d590111e8dfd\",\"text\":\"\"}},{\"label\":{\"class\":\"form-check-label checkbox-label-default\",\"for\":\"a87d4140-4831-4ab0-a7c8-d590111e8dfd\",\"text\":\"專科\"}}]}},{\"div\":{\"class\":\"form-check form-check-inline\",\"children\":[{\"input\":{\"type\":\"checkbox\",\"class\":\"form-check-input checkbox-default\",\"value\":\"大學\",\"name\":\"patientEducation\",\"id\":\"0780c2e8-3095-43bd-a24f-ec0a9a851623\",\"text\":\"\"}},{\"label\":{\"class\":\"form-check-label checkbox-label-default\",\"for\":\"0780c2e8-3095-43bd-a24f-ec0a9a851623\",\"text\":\"大學\"}}]}},{\"div\":{\"class\":\"form-check form-check-inline\",\"children\":[{\"input\":{\"type\":\"checkbox\",\"class\":\"form-check-input checkbox-default\",\"value\":\"大學以上\",\"name\":\"patientEducation\",\"id\":\"fa2f5231-8e26-4212-b353-21951f8e017b\",\"text\":\"\"}},{\"label\":{\"class\":\"form-check-label checkbox-label-default\",\"for\":\"fa2f5231-8e26-4212-b353-21951f8e017b\",\"text\":\"大學以上\"}}]}}]}}",
	"patientReason": 			"{\"div\":{\"class\":\"pFormItem form-group\",\"draggable\":\"true\",\"data-title\":\"就醫原因\",\"data-name\":\"patientReason\",\"data-checked\":false,\"data-ui-value\":\"門診,住院,急診,妊娠,其他\",\"data-ui-desc\":\"門診,住院,急診,妊娠,其他\",\"data-display-mode\":\"horizontal\",\"data-control-type\":\"checkbox\",\"data-dont-ditto\":0,\"data-is-bean\":true,\"data-edit\":true,\"data-required\":\"0\",\"data-prompt-tips\":\"請選擇就醫原因\",\"children\":[{\"div\":{\"class\":\"form-check form-check-inline\",\"children\":[{\"input\":{\"type\":\"checkbox\",\"class\":\"form-check-input checkbox-default\",\"value\":\"門診\",\"name\":\"patientReason\",\"id\":\"015fc82b-a9b5-4a2c-891f-8e6d6f95aa5c\",\"text\":\"\"}},{\"label\":{\"class\":\"form-check-label checkbox-label-default\",\"for\":\"015fc82b-a9b5-4a2c-891f-8e6d6f95aa5c\",\"text\":\"門診\"}},{\"div\":{\"class\":\"pFormItem form-group view-hide\",\"data-checked\":false,\"data-ui-value\":\"新確診診斷,定期門診\",\"data-ui-desc\":\"新確診診斷,定期門診\",\"data-display-mode\":\"horizontal\",\"data-control-type\":\"checkbox\",\"data-dont-ditto\":0,\"data-is-bean\":true,\"data-edit\":true,\"draggable\":\"true\",\"data-title\":\"門診\",\"data-name\":\"outPatient\",\"data-required\":\"1\",\"children\":[{\"div\":{\"class\":\"form-check form-check-inline\",\"children\":[{\"input\":{\"type\":\"checkbox\",\"class\":\"form-check-input checkbox-default\",\"value\":\"新確診診斷\",\"name\":\"outPatient\",\"id\":\"75ed5ce2-8386-4765-8a9b-17eb081b5a65\",\"text\":\"\"}},{\"label\":{\"class\":\"form-check-label checkbox-label-default\",\"for\":\"75ed5ce2-8386-4765-8a9b-17eb081b5a65\",\"text\":\"新確診診斷\"}}]}},{\"div\":{\"class\":\"form-check form-check-inline\",\"children\":[{\"input\":{\"type\":\"checkbox\",\"class\":\"form-check-input checkbox-default\",\"value\":\"定期門診\",\"name\":\"outPatient\",\"id\":\"e01f4c85-e3f9-47ca-8fc6-4ded35be9007\",\"text\":\"\"}},{\"label\":{\"class\":\"form-check-label checkbox-label-default\",\"for\":\"e01f4c85-e3f9-47ca-8fc6-4ded35be9007\",\"text\":\"定期門診\"}}]}}]}}]}},{\"div\":{\"class\":\"form-check form-check-inline\",\"children\":[{\"input\":{\"type\":\"checkbox\",\"class\":\"form-check-input checkbox-default\",\"value\":\"住院\",\"name\":\"patientReason\",\"id\":\"f33d28d0-d73d-4734-be32-cd54586a59d1\",\"text\":\"\"}},{\"label\":{\"class\":\"form-check-label checkbox-label-default\",\"for\":\"f33d28d0-d73d-4734-be32-cd54586a59d1\",\"text\":\"住院\"}},{\"div\":{\"class\":\"pFormItem form-group view-hide\",\"data-checked\":false,\"data-ui-value\":\"合併症,控制欠穩\",\"data-ui-desc\":\"合併症,控制欠穩\",\"data-display-mode\":\"horizontal\",\"data-control-type\":\"checkbox\",\"data-dont-ditto\":0,\"data-is-bean\":true,\"data-edit\":true,\"draggable\":\"true\",\"data-title\":\"住院\",\"data-name\":\"inHospital\",\"data-required\":\"1\",\"children\":[{\"div\":{\"class\":\"form-check form-check-inline\",\"children\":[{\"input\":{\"type\":\"checkbox\",\"class\":\"form-check-input checkbox-default\",\"value\":\"合併症\",\"name\":\"inHospital\",\"id\":\"002fc7ad-014d-472d-acf1-9dc76e757695\",\"text\":\"\"}},{\"label\":{\"class\":\"form-check-label checkbox-label-default\",\"for\":\"002fc7ad-014d-472d-acf1-9dc76e757695\",\"text\":\"合併症\"}}]}},{\"div\":{\"class\":\"form-check form-check-inline\",\"children\":[{\"input\":{\"type\":\"checkbox\",\"class\":\"form-check-input checkbox-default\",\"value\":\"控制欠穩\",\"name\":\"inHospital\",\"id\":\"51e33cf1-155e-48f0-ad52-ebf54e3e945f\",\"text\":\"\"}},{\"label\":{\"class\":\"form-check-label checkbox-label-default\",\"for\":\"51e33cf1-155e-48f0-ad52-ebf54e3e945f\",\"text\":\"控制欠穩\"}}]}}]}}]}},{\"div\":{\"class\":\"form-check form-check-inline\",\"children\":[{\"input\":{\"type\":\"checkbox\",\"class\":\"form-check-input checkbox-default\",\"value\":\"急診\",\"name\":\"patientReason\",\"id\":\"fe484c84-bc94-4687-be76-bb7bf6002baa\",\"text\":\"\"}},{\"label\":{\"class\":\"form-check-label checkbox-label-default\",\"for\":\"fe484c84-bc94-4687-be76-bb7bf6002baa\",\"text\":\"急診\"}}]}},{\"div\":{\"class\":\"form-check form-check-inline\",\"children\":[{\"input\":{\"type\":\"checkbox\",\"class\":\"form-check-input checkbox-default\",\"value\":\"妊娠\",\"name\":\"patientReason\",\"id\":\"4e3b4c54-d06f-4dbd-adbf-9ba9092f999f\",\"text\":\"\"}},{\"label\":{\"class\":\"form-check-label checkbox-label-default\",\"for\":\"4e3b4c54-d06f-4dbd-adbf-9ba9092f999f\",\"text\":\"妊娠\"}}]}},{\"div\":{\"class\":\"form-check form-check-inline\",\"children\":[{\"input\":{\"type\":\"checkbox\",\"class\":\"form-check-input checkbox-default\",\"value\":\"其他\",\"name\":\"patientReason\",\"id\":\"0869d4ee-f115-4dc1-a05a-f9896202d7e7\",\"text\":\"\"}},{\"label\":{\"class\":\"form-check-label checkbox-label-default\",\"for\":\"0869d4ee-f115-4dc1-a05a-f9896202d7e7\",\"text\":\"其他\"}},{\"div\":{\"class\":\"pFormItem form-row-div view-hide \",\"data-control-type\":\"input\",\"data-dont-ditto\":0,\"data-is-bean\":true,\"data-edit\":true,\"draggable\":\"true\",\"data-title\":\"其他\",\"data-name\":\"other\",\"data-required\":\"1\",\"children\":[{\"input\":{\"type\":\"text\",\"class\":\"form-control input-default\",\"id\":\"445d1ac4-8ad3-4b64-8cb1-0500ba9afdd6\",\"readonly\":\"readonly\",\"text\":\"\"}}]}}]}}]}}",
	"patientMedicalHistory": 	"{\"div\":{\"class\":\"pFormItem form-group\",\"draggable\":\"true\",\"data-title\":\"家族病史\",\"data-name\":\"patientMedicalHistory\",\"data-checked\":false,\"data-ui-value\":\"無,不詳,有\",\"data-ui-desc\":\"無,不詳,有\",\"data-display-mode\":\"horizontal\",\"data-control-type\":\"checkbox\",\"data-dont-ditto\":0,\"data-is-bean\":true,\"data-edit\":true,\"data-required\":\"0\",\"data-prompt-tips\":\"請選擇家族病史\",\"children\":[{\"div\":{\"class\":\"form-check form-check-inline\",\"children\":[{\"input\":{\"type\":\"checkbox\",\"class\":\"form-check-input checkbox-default\",\"value\":\"無\",\"name\":\"patientMedicalHistory\",\"id\":\"6d897421-5210-4d1a-8ed3-466bcd98a7bd\",\"text\":\"\"}},{\"label\":{\"class\":\"form-check-label checkbox-label-default\",\"for\":\"6d897421-5210-4d1a-8ed3-466bcd98a7bd\",\"text\":\"無\"}}]}},{\"div\":{\"class\":\"form-check form-check-inline\",\"children\":[{\"input\":{\"type\":\"checkbox\",\"class\":\"form-check-input checkbox-default\",\"value\":\"不詳\",\"name\":\"patientMedicalHistory\",\"id\":\"b1786765-f9a6-4f85-abd2-00fbbac8277f\",\"text\":\"\"}},{\"label\":{\"class\":\"form-check-label checkbox-label-default\",\"for\":\"b1786765-f9a6-4f85-abd2-00fbbac8277f\",\"text\":\"不詳\"}}]}},{\"div\":{\"class\":\"form-check form-check-inline\",\"children\":[{\"input\":{\"type\":\"checkbox\",\"class\":\"form-check-input checkbox-default\",\"value\":\"有\",\"name\":\"patientMedicalHistory\",\"id\":\"fa60e21c-73fc-4487-bf19-d6d7bd07da60\",\"text\":\"\"}},{\"label\":{\"class\":\"form-check-label checkbox-label-default\",\"for\":\"fa60e21c-73fc-4487-bf19-d6d7bd07da60\",\"text\":\"有\"}},{\"div\":{\"class\":\"pFormItem form-group view-hide \",\"data-checked\":false,\"data-ui-value\":\"父系,母系,兄弟姊妹,子女\",\"data-ui-desc\":\"父系,母系,兄弟姊妹,子女\",\"data-display-mode\":\"horizontal\",\"data-control-type\":\"checkbox\",\"data-dont-ditto\":0,\"data-is-bean\":true,\"data-edit\":true,\"draggable\":\"true\",\"data-title\":\"有病史\",\"data-name\":\"history\",\"data-required\":\"1\",\"children\":[{\"div\":{\"class\":\"form-check form-check-inline\",\"children\":[{\"input\":{\"type\":\"checkbox\",\"class\":\"form-check-input checkbox-default\",\"value\":\"父系\",\"name\":\"history\",\"id\":\"c2d6d357-fb55-4371-9b9c-5df9a0d924a7\",\"text\":\"\"}},{\"label\":{\"class\":\"form-check-label checkbox-label-default\",\"for\":\"c2d6d357-fb55-4371-9b9c-5df9a0d924a7\",\"text\":\"父系\"}}]}},{\"div\":{\"class\":\"form-check form-check-inline\",\"children\":[{\"input\":{\"type\":\"checkbox\",\"class\":\"form-check-input checkbox-default\",\"value\":\"母系\",\"name\":\"history\",\"id\":\"5aff5925-fce9-4449-b597-ff1588c9a379\",\"text\":\"\"}},{\"label\":{\"class\":\"form-check-label checkbox-label-default\",\"for\":\"5aff5925-fce9-4449-b597-ff1588c9a379\",\"text\":\"母系\"}}]}},{\"div\":{\"class\":\"form-check form-check-inline\",\"children\":[{\"input\":{\"type\":\"checkbox\",\"class\":\"form-check-input checkbox-default\",\"value\":\"兄弟姊妹\",\"name\":\"history\",\"id\":\"24c4b4b7-9669-4030-bb0a-03bde91279b6\",\"text\":\"\"}},{\"label\":{\"class\":\"form-check-label checkbox-label-default\",\"for\":\"24c4b4b7-9669-4030-bb0a-03bde91279b6\",\"text\":\"兄弟姊妹\"}}]}},{\"div\":{\"class\":\"form-check form-check-inline\",\"children\":[{\"input\":{\"type\":\"checkbox\",\"class\":\"form-check-input checkbox-default\",\"value\":\"子女\",\"name\":\"history\",\"id\":\"5bab5a53-2961-4e05-89cb-c934abe05db5\",\"text\":\"\"}},{\"label\":{\"class\":\"form-check-label checkbox-label-default\",\"for\":\"5bab5a53-2961-4e05-89cb-c934abe05db5\",\"text\":\"子女\"}}]}}]}}]}}]}}",
	"patientDrugHistory": 		"{\"div\":{\"class\":\"pFormItem form-group\",\"draggable\":\"true\",\"data-title\":\"藥物史\",\"data-name\":\"patientDrugHistory\",\"data-checked\":false,\"data-ui-value\":\"無,降血壓,降血脂,血管擴張劑,自主神經系統,中樞神經系統,抗組織胺,抗感染,腸胃道,心臟血管,腎臟,其他\",\"data-ui-desc\":\"無,降血壓,降血脂,血管擴張劑,自主神經系統,中樞神經系統,抗組織胺,抗感染,腸胃道,心臟血管,腎臟,其他\",\"data-display-mode\":\"horizontal\",\"data-control-type\":\"checkbox\",\"data-dont-ditto\":0,\"data-is-bean\":true,\"data-edit\":true,\"data-required\":\"0\",\"data-prompt-tips\":\"請選擇藥物史\",\"children\":[{\"div\":{\"class\":\"form-check form-check-inline\",\"children\":[{\"input\":{\"type\":\"checkbox\",\"class\":\"form-check-input checkbox-default\",\"value\":\"無\",\"name\":\"patientDrugHistory\",\"id\":\"fdedacdc-adf8-46b4-95da-e26b61c5d819\",\"text\":\"\"}},{\"label\":{\"class\":\"form-check-label checkbox-label-default\",\"for\":\"fdedacdc-adf8-46b4-95da-e26b61c5d819\",\"text\":\"無\"}}]}},{\"div\":{\"class\":\"form-check form-check-inline\",\"children\":[{\"input\":{\"type\":\"checkbox\",\"class\":\"form-check-input checkbox-default\",\"value\":\"降血壓\",\"name\":\"patientDrugHistory\",\"id\":\"6179fb62-9ed8-4ce4-87dc-ef3eb49d796c\",\"text\":\"\"}},{\"label\":{\"class\":\"form-check-label checkbox-label-default\",\"for\":\"6179fb62-9ed8-4ce4-87dc-ef3eb49d796c\",\"text\":\"降血壓\"}}]}},{\"div\":{\"class\":\"form-check form-check-inline\",\"children\":[{\"input\":{\"type\":\"checkbox\",\"class\":\"form-check-input checkbox-default\",\"value\":\"降血脂\",\"name\":\"patientDrugHistory\",\"id\":\"fa13568c-ddcd-44d9-8edb-34260e61a9f3\",\"text\":\"\"}},{\"label\":{\"class\":\"form-check-label checkbox-label-default\",\"for\":\"fa13568c-ddcd-44d9-8edb-34260e61a9f3\",\"text\":\"降血脂\"}}]}},{\"div\":{\"class\":\"form-check form-check-inline\",\"children\":[{\"input\":{\"type\":\"checkbox\",\"class\":\"form-check-input checkbox-default\",\"value\":\"血管擴張劑\",\"name\":\"patientDrugHistory\",\"id\":\"96aab1e0-5a73-4952-8631-73617609a42e\",\"text\":\"\"}},{\"label\":{\"class\":\"form-check-label checkbox-label-default\",\"for\":\"96aab1e0-5a73-4952-8631-73617609a42e\",\"text\":\"血管擴張劑\"}}]}},{\"div\":{\"class\":\"form-check form-check-inline\",\"children\":[{\"input\":{\"type\":\"checkbox\",\"class\":\"form-check-input checkbox-default\",\"value\":\"自主神經系統\",\"name\":\"patientDrugHistory\",\"id\":\"cfecdcb7-5e99-4719-bfe0-aeb9130ecdfd\",\"text\":\"\"}},{\"label\":{\"class\":\"form-check-label checkbox-label-default\",\"for\":\"cfecdcb7-5e99-4719-bfe0-aeb9130ecdfd\",\"text\":\"自主神經系統\"}}]}},{\"div\":{\"class\":\"form-check form-check-inline\",\"children\":[{\"input\":{\"type\":\"checkbox\",\"class\":\"form-check-input checkbox-default\",\"value\":\"中樞神經系統\",\"name\":\"patientDrugHistory\",\"id\":\"7326fe55-92a1-4e53-8d4e-57217d9b8536\",\"text\":\"\"}},{\"label\":{\"class\":\"form-check-label checkbox-label-default\",\"for\":\"7326fe55-92a1-4e53-8d4e-57217d9b8536\",\"text\":\"中樞神經系統\"}}]}},{\"div\":{\"class\":\"form-check form-check-inline\",\"children\":[{\"input\":{\"type\":\"checkbox\",\"class\":\"form-check-input checkbox-default\",\"value\":\"抗組織胺\",\"name\":\"patientDrugHistory\",\"id\":\"5fab7ecf-5829-4a60-a055-4d95602070e1\",\"text\":\"\"}},{\"label\":{\"class\":\"form-check-label checkbox-label-default\",\"for\":\"5fab7ecf-5829-4a60-a055-4d95602070e1\",\"text\":\"抗組織胺\"}}]}},{\"div\":{\"class\":\"form-check form-check-inline\",\"children\":[{\"input\":{\"type\":\"checkbox\",\"class\":\"form-check-input checkbox-default\",\"value\":\"抗感染\",\"name\":\"patientDrugHistory\",\"id\":\"676afa1e-fe62-4b9f-93a3-9f67d37e286f\",\"text\":\"\"}},{\"label\":{\"class\":\"form-check-label checkbox-label-default\",\"for\":\"676afa1e-fe62-4b9f-93a3-9f67d37e286f\",\"text\":\"抗感染\"}}]}},{\"div\":{\"class\":\"form-check form-check-inline\",\"children\":[{\"input\":{\"type\":\"checkbox\",\"class\":\"form-check-input checkbox-default\",\"value\":\"腸胃道\",\"name\":\"patientDrugHistory\",\"id\":\"89438331-e885-488d-bafa-fe068e85f1da\",\"text\":\"\"}},{\"label\":{\"class\":\"form-check-label checkbox-label-default\",\"for\":\"89438331-e885-488d-bafa-fe068e85f1da\",\"text\":\"腸胃道\"}}]}},{\"div\":{\"class\":\"form-check form-check-inline\",\"children\":[{\"input\":{\"type\":\"checkbox\",\"class\":\"form-check-input checkbox-default\",\"value\":\"心臟血管\",\"name\":\"patientDrugHistory\",\"id\":\"aef4718d-6a74-4d5e-842c-494eda24973e\",\"text\":\"\"}},{\"label\":{\"class\":\"form-check-label checkbox-label-default\",\"for\":\"aef4718d-6a74-4d5e-842c-494eda24973e\",\"text\":\"心臟血管\"}}]}},{\"div\":{\"class\":\"form-check form-check-inline\",\"children\":[{\"input\":{\"type\":\"checkbox\",\"class\":\"form-check-input checkbox-default\",\"value\":\"腎臟\",\"name\":\"patientDrugHistory\",\"id\":\"6a71340e-b1d9-4ea9-8654-825e5d341f01\",\"text\":\"\"}},{\"label\":{\"class\":\"form-check-label checkbox-label-default\",\"for\":\"6a71340e-b1d9-4ea9-8654-825e5d341f01\",\"text\":\"腎臟\"}}]}},{\"div\":{\"class\":\"form-check form-check-inline\",\"children\":[{\"input\":{\"type\":\"checkbox\",\"class\":\"form-check-input checkbox-default\",\"value\":\"其他\",\"name\":\"patientDrugHistory\",\"id\":\"3e815b7c-09e3-40d3-99cc-b435839a7f5b\",\"text\":\"\"}},{\"label\":{\"class\":\"form-check-label checkbox-label-default\",\"for\":\"3e815b7c-09e3-40d3-99cc-b435839a7f5b\",\"text\":\"其他\"}},{\"div\":{\"class\":\"pFormItem form-row-div view-hide \",\"data-control-type\":\"input\",\"data-dont-ditto\":0,\"data-is-bean\":true,\"data-edit\":true,\"draggable\":\"true\",\"data-title\":\"藥物史其他\",\"data-name\":\"mHistoryOther\",\"data-required\":\"1\",\"children\":[{\"input\":{\"type\":\"text\",\"class\":\"form-control input-default\",\"id\":\"f68bf9bc-5809-4d72-b386-bc98b83c3b46\",\"readonly\":\"readonly\",\"text\":\"\"}}]}}]}}]}}",
	"patientDiagnosis": 		"{\"div\":{\"class\":\"pFormItem form-group \",\"draggable\":\"true\",\"data-title\":\"診斷\",\"data-name\":\"patientDiagnosis\",\"data-checked\":false,\"data-ui-value\":\"第一型,第二型,IGT,GDM,其他\",\"data-ui-desc\":\"第一型,第二型,IGT,GDM,其他\",\"data-display-mode\":\"horizontal\",\"data-control-type\":\"checkbox\",\"data-dont-ditto\":0,\"data-is-bean\":true,\"data-edit\":true,\"data-required\":\"0\",\"data-prompt-tips\":\"請選擇診斷\",\"children\":[{\"div\":{\"class\":\"form-check form-check-inline\",\"children\":[{\"input\":{\"type\":\"checkbox\",\"class\":\"form-check-input checkbox-default\",\"value\":\"第一型\",\"name\":\"patientDiagnosis\",\"id\":\"e523b596-8a71-478c-9f3d-adca196a1655\",\"text\":\"\"}},{\"label\":{\"class\":\"form-check-label checkbox-label-default\",\"for\":\"e523b596-8a71-478c-9f3d-adca196a1655\",\"text\":\"第一型\"}}]}},{\"div\":{\"class\":\"form-check form-check-inline\",\"children\":[{\"input\":{\"type\":\"checkbox\",\"class\":\"form-check-input checkbox-default\",\"value\":\"第二型\",\"name\":\"patientDiagnosis\",\"id\":\"86774236-a526-4391-8c21-002f90c596f0\",\"text\":\"\"}},{\"label\":{\"class\":\"form-check-label checkbox-label-default\",\"for\":\"86774236-a526-4391-8c21-002f90c596f0\",\"text\":\"第二型\"}}]}},{\"div\":{\"class\":\"form-check form-check-inline\",\"children\":[{\"input\":{\"type\":\"checkbox\",\"class\":\"form-check-input checkbox-default\",\"value\":\"IGT\",\"name\":\"patientDiagnosis\",\"id\":\"e0e8a02e-3ff7-47b7-a066-633e06090fa3\",\"text\":\"\"}},{\"label\":{\"class\":\"form-check-label checkbox-label-default\",\"for\":\"e0e8a02e-3ff7-47b7-a066-633e06090fa3\",\"text\":\"IGT\"}}]}},{\"div\":{\"class\":\"form-check form-check-inline\",\"children\":[{\"input\":{\"type\":\"checkbox\",\"class\":\"form-check-input checkbox-default\",\"value\":\"GDM\",\"name\":\"patientDiagnosis\",\"id\":\"70799cc8-0a76-459e-a9f6-bf5bc3344c3c\",\"text\":\"\"}},{\"label\":{\"class\":\"form-check-label checkbox-label-default\",\"for\":\"70799cc8-0a76-459e-a9f6-bf5bc3344c3c\",\"text\":\"GDM\"}}]}},{\"div\":{\"class\":\"form-check form-check-inline\",\"children\":[{\"input\":{\"type\":\"checkbox\",\"class\":\"form-check-input checkbox-default\",\"value\":\"其他\",\"name\":\"patientDiagnosis\",\"id\":\"6d1a1afa-e053-4ed6-8fa4-4603ce7b12eb\",\"text\":\"\"}},{\"label\":{\"class\":\"form-check-label checkbox-label-default\",\"for\":\"6d1a1afa-e053-4ed6-8fa4-4603ce7b12eb\",\"text\":\"其他\"}}]}}]}}",
	"patientHeWeight": 			"[{\"div\":{\"class\":\"pFormItem form-row-div \",\"style\":\"width: 150px;\",\"draggable\":\"true\",\"data-title\":\"身高\",\"data-name\":\"height\",\"data-control-type\":\"input\",\"data-dont-ditto\":0,\"data-is-bean\":true,\"data-edit\":true,\"data-width\":15,\"data-required\":0,\"data-prompt-tips\":\"請輸入身高\",\"data-placeholder\":\"\",\"children\":[{\"label\":{\"class\":\"h6 canEditDiv\",\"data-edit\":true,\"text\":\"身高：\"}},{\"input\":{\"type\":\"text\",\"class\":\"form-control input-default\",\"id\":\"e566f467-8798-4288-9141-0093cbe74365\",\"readonly\":\"readonly\",\"placeholder\":\"\",\"text\":\"\"}},{\"label\":{\"class\":\"h6 canEditDiv\",\"data-edit\":true,\"text\":\"cm\"}}]}},{\"div\":{\"class\":\"pFormItem form-row-div \",\"style\":\"width: 150px;\",\"draggable\":\"true\",\"data-title\":\"體重\",\"data-name\":\"weight\",\"data-control-type\":\"input\",\"data-dont-ditto\":0,\"data-is-bean\":true,\"data-edit\":true,\"data-width\":15,\"data-required\":0,\"data-maxlength\":\"請輸入體重\",\"children\":[{\"label\":{\"class\":\"h6 canEditDiv\",\"data-edit\":true,\"text\":\"體重：\"}},{\"input\":{\"type\":\"text\",\"class\":\"form-control input-default\",\"id\":\"65da3fa8-7c20-4533-b1be-862965461278\",\"readonly\":\"readonly\",\"maxlength\":\"請輸入體重\",\"text\":\"\"}},{\"label\":{\"class\":\"h6 canEditDiv\",\"data-edit\":true,\"text\":\"Kg\"}}]}},{\"div\":{\"class\":\"pFormItem form-row-div \",\"style\":\"width: 150px;\",\"draggable\":\"true\",\"data-title\":\"BMI\",\"data-name\":\"bmi\",\"data-control-type\":\"input\",\"data-dont-ditto\":0,\"data-is-bean\":true,\"data-edit\":true,\"data-width\":15,\"data-required\":0,\"data-prompt-tips\":\"請輸入BMI\",\"data-script\":\"[{\\\"name\\\":\\\"計算BMI\\\",\\\"type\\\":\\\"bmi\\\",\\\"options\\\":[1],\\\"range\\\":[]}]\",\"children\":[{\"label\":{\"class\":\"h6 canEditDiv\",\"data-edit\":true,\"text\":\"BMI：\"}},{\"input\":{\"type\":\"text\",\"class\":\"form-control input-default\",\"id\":\"1ac8b24e-784a-4ab1-a9a4-1d09a5fc9805\",\"readonly\":\"readonly\",\"text\":\"\"}}]}}]",
	"patientVitalSign": 		"[{\"div\":{\"class\":\"pFormItem form-row-div \",\"style\":\"width: 120px;\",\"draggable\":\"true\",\"data-title\":\"體溫\",\"data-name\":\"bodyTemperature\",\"data-control-type\":\"input\",\"data-dont-ditto\":0,\"data-is-bean\":true,\"data-edit\":true,\"data-width\":12,\"data-required\":\"0\",\"data-prompt-tips\":\"請輸入體溫\",\"children\":[{\"label\":{\"class\":\"h6 canEditDiv\",\"data-edit\":true,\"text\":\"BT：\"}},{\"input\":{\"type\":\"text\",\"class\":\"form-control input-default\",\"id\":\"57f9330e-4e53-4feb-b720-b0c31e8d2351\",\"readonly\":\"readonly\",\"text\":\"\"}},{\"label\":{\"class\":\"h6 canEditDiv\",\"data-edit\":true,\"text\":\"°C\"}}]}},{\"div\":{\"class\":\"pFormItem form-row-div \",\"style\":\"width: 100px;\",\"draggable\":\"true\",\"data-title\":\"舒張壓\",\"data-name\":\"diastolicBlood\",\"data-control-type\":\"input\",\"data-dont-ditto\":0,\"data-is-bean\":true,\"data-edit\":true,\"data-width\":10,\"data-required\":\"0\",\"data-prompt-tips\":\"請輸入舒張壓\",\"children\":[{\"label\":{\"class\":\"h6 canEditDiv\",\"data-edit\":true,\"text\":\"BP：\"}},{\"input\":{\"type\":\"text\",\"class\":\"form-control input-default\",\"id\":\"459e24f3-15ed-456d-ba5e-8bdc870f23cf\",\"readonly\":\"readonly\",\"text\":\"\"}}]}},{\"div\":{\"class\":\"pFormItem form-row-div \",\"style\":\"width: 140px;\",\"draggable\":\"true\",\"data-title\":\"收縮壓\",\"data-name\":\"systolicBlood\",\"data-control-type\":\"input\",\"data-dont-ditto\":0,\"data-is-bean\":true,\"data-edit\":true,\"data-width\":14,\"data-required\":\"0\",\"data-prompt-tips\":\"請輸入收縮壓\",\"children\":[{\"label\":{\"class\":\"h6 canEditDiv\",\"data-edit\":true,\"text\":\"/　\"}},{\"input\":{\"type\":\"text\",\"class\":\"form-control input-default\",\"id\":\"5657aacc-1a22-4c86-a848-7c4c4a3c846a\",\"readonly\":\"readonly\",\"text\":\"\"}},{\"label\":{\"class\":\"h6 canEditDiv\",\"data-edit\":true,\"text\":\"mmHg\"}}]}},{\"div\":{\"class\":\"pFormItem form-row-div \",\"style\":\"width: 140px;\",\"draggable\":\"true\",\"data-title\":\"心律\",\"data-name\":\"heartRate\",\"data-control-type\":\"input\",\"data-dont-ditto\":0,\"data-is-bean\":true,\"data-edit\":true,\"data-width\":14,\"data-required\":\"0\",\"data-prompt-tips\":\"請輸入心律\",\"children\":[{\"label\":{\"class\":\"h6 canEditDiv\",\"data-edit\":true,\"text\":\"HR：\"}},{\"input\":{\"type\":\"text\",\"class\":\"form-control input-default\",\"id\":\"26d28ac9-16a6-4407-826f-7e7ad67bbb1d\",\"readonly\":\"readonly\",\"text\":\"\"}},{\"label\":{\"class\":\"h6 canEditDiv\",\"data-edit\":true,\"text\":\"bpm\"}}]}},{\"div\":{\"class\":\"pFormItem form-row-div \",\"style\":\"width: 180px;\",\"draggable\":\"true\",\"data-title\":\"呼吸速率\",\"data-name\":\"respiration\",\"data-control-type\":\"input\",\"data-dont-ditto\":0,\"data-is-bean\":true,\"data-edit\":true,\"data-required\":\"0\",\"data-prompt-tips\":\"請輸入呼吸速率\",\"data-width\":18,\"children\":[{\"label\":{\"class\":\"h6 canEditDiv\",\"data-edit\":true,\"text\":\"RR：\"}},{\"input\":{\"type\":\"text\",\"class\":\"form-control input-default\",\"id\":\"ac63e3ca-c99c-403c-8e5e-ac722b541e67\",\"readonly\":\"readonly\",\"text\":\"\"}},{\"label\":{\"class\":\"h6 canEditDiv\",\"data-edit\":true,\"text\":\"mg(μl)/(h·g)\"}}]}}]",
	"patientEye": 				"[{\"div\":{\"class\":\"pFormItem form-row-div \",\"style\":\"width: 210px;\",\"draggable\":\"true\",\"data-title\":\"左眼\",\"data-name\":\"leftEye\",\"data-control-type\":\"input\",\"data-dont-ditto\":0,\"data-is-bean\":true,\"data-edit\":true,\"data-width\":21,\"data-required\":\"0\",\"data-prompt-tips\":\"請輸入視力\",\"children\":[{\"label\":{\"class\":\"h6 canEditDiv\",\"data-edit\":true,\"text\":\"左眼：\"}},{\"input\":{\"type\":\"text\",\"class\":\"form-control input-default\",\"id\":\"9c3b2c9b-a201-4f48-a7f6-319eca4187ef\",\"readonly\":\"readonly\",\"text\":\"\"}}]}},{\"div\":{\"class\":\"pFormItem form-row-div \",\"style\":\"width: 220px;\",\"draggable\":\"true\",\"data-title\":\"右眼\",\"data-name\":\"rightEye\",\"data-control-type\":\"input\",\"data-dont-ditto\":0,\"data-is-bean\":true,\"data-edit\":true,\"data-width\":22,\"data-required\":\"0\",\"data-prompt-tips\":\"請輸入右眼\",\"children\":[{\"label\":{\"class\":\"h6 canEditDiv\",\"data-edit\":true,\"text\":\"右眼：\"}},{\"input\":{\"type\":\"text\",\"class\":\"form-control input-default\",\"id\":\"9edd0125-8c78-4ebc-a057-4e84ae03e523\",\"readonly\":\"readonly\",\"text\":\"\"}}]}}]",
	"yesOrNo": 					"{\"div\":{\"class\":\"pFormItem form-group \",\"draggable\":\"true\",\"data-title\":\"有/無\",\"data-name\":\"yesOrNo\",\"data-control-type\":\"radio\",\"data-ui-desc\":\"有,無\",\"data-horizontal-form-item\":\"|,|\",\"data-checked\":false,\"data-ui-value\":\"有,無\",\"data-display-mode\":\"horizontal\",\"data-show\":true,\"data-required\":0,\"data-dont-ditto\":0,\"data-is-bean\":\"Y\",\"data-edit\":true,\"data-abandoned\":false,\"data-prompt-tips\":\"請輸入有/無\",\"data-placeholder\":\"有/無\",\"data-structure\":\"[{\\\"div\\\":{\\\"class\\\":\\\"form-check form-check-inline\\\",\\\"children\\\":[{\\\"input\\\":{\\\"type\\\":\\\"radio\\\",\\\"class\\\":\\\"form-check-input radio-default\\\",\\\"value\\\":\\\"有\\\",\\\"name\\\":\\\"yesOrNo\\\",\\\"id\\\":\\\"d6cb4a4b-3737-498d-ac5c-f761590dfba4\\\",\\\"data-score\\\":\\\"\\\",\\\"text\\\":\\\"\\\"}},{\\\"label\\\":{\\\"class\\\":\\\"form-check-label radio-label-default\\\",\\\"for\\\":\\\"d6cb4a4b-3737-498d-ac5c-f761590dfba4\\\",\\\"text\\\":\\\"有\\\"}}]}},{\\\"div\\\":{\\\"class\\\":\\\"form-check form-check-inline\\\",\\\"children\\\":[{\\\"input\\\":{\\\"type\\\":\\\"radio\\\",\\\"class\\\":\\\"form-check-input radio-default\\\",\\\"value\\\":\\\"無\\\",\\\"name\\\":\\\"yesOrNo\\\",\\\"id\\\":\\\"97215ffb-e86c-4271-8ee4-4cf1e4fa22fd\\\",\\\"text\\\":\\\"\\\"}},{\\\"label\\\":{\\\"class\\\":\\\"form-check-label radio-label-default\\\",\\\"for\\\":\\\"97215ffb-e86c-4271-8ee4-4cf1e4fa22fd\\\",\\\"text\\\":\\\"無\\\"}}]}}]\"}}",
	"withOrWithout": 			"{\"div\":{\"class\":\"pFormItem form-group \",\"draggable\":\"true\",\"data-title\":\"是/否\",\"data-name\":\"withOrWithout\",\"data-control-type\":\"radio\",\"data-ui-desc\":\"是,否\",\"data-horizontal-form-item\":\"|,|\",\"data-checked\":false,\"data-ui-value\":\"是,否\",\"data-display-mode\":\"horizontal\",\"data-show\":true,\"data-required\":0,\"data-dont-ditto\":0,\"data-is-bean\":\"Y\",\"data-edit\":true,\"data-abandoned\":false,\"data-prompt-tips\":\"請輸入是/否\",\"data-placeholder\":\"是/否\",\"data-structure\":\"[{\\\"div\\\":{\\\"class\\\":\\\"form-check form-check-inline\\\",\\\"children\\\":[{\\\"input\\\":{\\\"type\\\":\\\"radio\\\",\\\"class\\\":\\\"form-check-input radio-default\\\",\\\"value\\\":\\\"是\\\",\\\"name\\\":\\\"withOrWithout\\\",\\\"id\\\":\\\"ef2b1e16-d8c2-40b4-82aa-5a9af58d0885\\\",\\\"data-score\\\":\\\"\\\",\\\"text\\\":\\\"\\\"}},{\\\"label\\\":{\\\"class\\\":\\\"form-check-label radio-label-default\\\",\\\"for\\\":\\\"ef2b1e16-d8c2-40b4-82aa-5a9af58d0885\\\",\\\"text\\\":\\\"是\\\"}}]}},{\\\"div\\\":{\\\"class\\\":\\\"form-check form-check-inline\\\",\\\"children\\\":[{\\\"input\\\":{\\\"type\\\":\\\"radio\\\",\\\"class\\\":\\\"form-check-input radio-default\\\",\\\"value\\\":\\\"否\\\",\\\"name\\\":\\\"withOrWithout\\\",\\\"id\\\":\\\"6dd98ed1-e5d2-4078-8990-7a12edb21ee0\\\",\\\"text\\\":\\\"\\\"}},{\\\"label\\\":{\\\"class\\\":\\\"form-check-label radio-label-default\\\",\\\"for\\\":\\\"6dd98ed1-e5d2-4078-8990-7a12edb21ee0\\\",\\\"text\\\":\\\"否\\\"}}]}}]\"}}",
	"yesOrNoOrUnknown": 			"{\"div\":{\"class\":\"pFormItem form-group \",\"draggable\":\"true\",\"data-title\":\"有/無/不詳\",\"data-name\":\"yesOrNoOrUnknown\",\"data-checked\":false,\"data-ui-value\":\"有,無,不詳\",\"data-ui-desc\":\"有,無,不詳\",\"data-display-mode\":\"horizontal\",\"data-control-type\":\"checkbox\",\"data-dont-ditto\":0,\"data-is-bean\":true,\"data-edit\":true,\"data-required\":\"0\",\"data-prompt-tips\":\"請選擇有無不詳\",\"children\":[{\"div\":{\"class\":\"form-check form-check-inline\",\"children\":[{\"input\":{\"type\":\"checkbox\",\"class\":\"form-check-input checkbox-default\",\"value\":\"有\",\"name\":\"yesOrNoOrUnknown\",\"id\":\"89f3ac1c-2dbb-421e-be13-6c745b692215\",\"text\":\"\"}},{\"label\":{\"class\":\"form-check-label checkbox-label-default\",\"for\":\"89f3ac1c-2dbb-421e-be13-6c745b692215\",\"text\":\"有\"}}]}},{\"div\":{\"class\":\"form-check form-check-inline\",\"children\":[{\"input\":{\"type\":\"checkbox\",\"class\":\"form-check-input checkbox-default\",\"value\":\"無\",\"name\":\"yesOrNoOrUnknown\",\"id\":\"396a4924-d64b-4b64-bc16-2b13b5c24114\",\"text\":\"\"}},{\"label\":{\"class\":\"form-check-label checkbox-label-default\",\"for\":\"396a4924-d64b-4b64-bc16-2b13b5c24114\",\"text\":\"無\"}}]}},{\"div\":{\"class\":\"form-check form-check-inline\",\"children\":[{\"input\":{\"type\":\"checkbox\",\"class\":\"form-check-input checkbox-default\",\"value\":\"不詳\",\"name\":\"yesOrNoOrUnknown\",\"id\":\"72ab5d4b-d10a-4084-a039-905a56c5faba\",\"text\":\"\"}},{\"label\":{\"class\":\"form-check-label checkbox-label-default\",\"for\":\"72ab5d4b-d10a-4084-a039-905a56c5faba\",\"text\":\"不詳\"}}]}}]}}",
}

/** =========================================== 元素區塊(start) =========================================== */

/** 標題h5元素 */
const hFiveElemental = {
	"h5": {
		"class": 	"",
		"text": 	""
	}
}

/** 提示i元素 */
const informationElemental = {
	"i": {
		"class": 	"",
		"text": 	"",
		"children": []
	}
}

/** 標題label元素 */
const titleElemental = {
	"label": {
		"class": 	"h6 canEditDiv",
		"text": 	"標題"
	}
}

/** 換行br元素 */
const breakElemental = {
	"br": {}
}

/** 按鈕button元素 */
const buttonElemental = {
	"button": {
		"class": "btn btn-default",
		"type": "button",
		"text": "按鈕",
		"children": []
	}
}

/** 區塊div元素 */
const divElemental = {
	"div": {
		"class": "",
		"text": "",
		"children": []
	}
}

/** 段落p元素 */
const pElemental = {
	"p": {
		"text": ""
	}
}

/** 多選框checkbox元素 */
const checkboxElemental = {
	"div": {
		"class": "form-check d-flex align-items-center",
		"children": [
			{
				"input": {
					"type": 	"checkbox",
					"class": 	"form-check-input checkbox-default",
					"value": 	"1",
					"name": 	"chk",
					"id": 		"chk",
				},
			},
			{
				"label": {
					"class": 	"form-check-label checkbox-label-default",
					"for": 		"chk",
					"text": 	"選項",
					"children": []
				}
			}
		]
	}
}

/** 單選框radio元素 */
const radioElemental = {
	"div": {
		"class": "form-check d-flex align-items-center",
		"children": [
			{
				"input": {
					"type": 	"radio",
					"class": 	"form-check-input radio-default",
					"value": 	"1",
					"name": 	"rdo",
					"id": 		"rdo",
				}
			},
			{
				"label": {
					"class": 	"form-check-label radio-label-default",
					"for": 		"rdo",
					"text": 	"選項",
					"children": []
				}
			}
		]
	}
}

/** 下拉框select元素 */
const selectElemental = {
	"select": {
		"class": 	"form-control select-default",
		"id": 	 	"sct",
		"children": [
		]
	}
}

/** 選項option元素 */
const optionElemental = {
	"option": {
		"class": "",
		"text":  "選項",
		"value": "選項值"
	}
}

/** 輸入框input元素 */
const inputElemental = {
	"input": {
		"type": 	"text",
		"class": 	"form-control input-default",
		"id": 		"ipt"
	}
}

const fileElemental = {
	"input": {
		"type": 	"file",
		"class": 	"form-control-file",
		"id": 		"file"
	}
}

const superLinkElemental = {
	"img": {
		"type": 	"superLink",
		"class": 	"form-control-superLinkIcon",
		"src": 		"icon/book.png",
		"id": 		"superLink",
		"width":	"50px",
		"height":	"50px"
	}
}

const iconDefaultElemental = {
	"img": {
		"type": 	"superLinkIcon",
		"class": 	"form-control-superLinkIcon",
		"src": 		"icon/book.png",
		"name": 	"superLinkIcon",
		"width":	"50px",
		"height":	"50px",
		"style":"cursor: pointer;"
	}
}

const icon1Elemental = {
	"img": {
		"type": 	"superLinkIcon",
		"class": 	"form-control-superLinkIcon",
		"src": 		"icon/link1.png",
		"name": 	"superLinkIcon",
		"width":	"50px",
		"height":	"50px",
		"style":"margin-left:25px;cursor: pointer;"
	}
}

const icon2Elemental = {
	"img": {
		"type": 	"superLinkIcon",
		"class": 	"form-control-superLinkIcon",
		"src": 		"icon/link2.png",
		"name": 	"superLinkIcon",
		"width":	"50px",
		"height":	"50px",
		"style":"margin-left:25px;cursor: pointer;"
	}
}

const iframeElemental = {
	"div": {
		"class": "iframe-block text-center",
		"children": [
			{
				"label": {
					"class": "iframe-text",
					"text": "IFRAME"
				}
			}
		]
	}
}

const csCanvasElemental = {
	"img": {
		"type": 	"csCanvas",
		"class": 	"form-control-csCanvas",
		"src": 		"img/csCanvasExample.jpg",
		"id": 		"csCanvas"
	}
}

/** 文字框textarea元素 */
const textareaElemental = {
	"textarea": {
		"class": 	"form-control",
		"id": 		"textarea"
	}
}

/** 日期框datetime元素 */
const datetimeElemental = {
	"input": {
		"type": 	"text",
		"class": 	"form-control datetime-default",
		"id": 		"dat"
	}
}

/** 表格列tr元素 */
const tablerowElemental = {
	"tr": {
		"children": []
	}
}

/** 表格標題th元素 */
const tableheadElemental = {
	"th": {
		"scope": 	"col",
		"text": 	"\xa0",
		"children": []
	}
}

/** 表格資料td元素 */
const tabledataElemental = {
	"td": {
		"text": 	"\xa0",
		"children": []
	}
}

/** 表格table元素 */
const tableElemental = {
	"table": {
		"class": 	"table table-striped table-bordered",
		"id": 		"table",
		"children": [
			{
				"thead": {
					"children": [
						
					]
				}
			},
			{
				"tbody": {
					"children": [
						
					]
				}
			}
		]
	}
}

/** 容器span元素 */
const spanElemental = {
	"span": {
		"class": 	"span-default",
		"text": 	"文字",
		"children": []
	}
}

/** 頁籤nav樣式 */
const navElemental = {
	"ul": {
		"class": 	"nav nav-tabs",
		"id": 		"tabs",
		"role": 	"tablist",
		"children": [
			{
				"li": {
					"class": 	"nav-item",
					"children": [
						{
							"a": {
								"class": 			"nav-link canEditDiv active",
								"id": 				"tabTag1",
								"href": 			"#tab1",
								"role": 			"tab",
								"aria-controls": 	"tab1",
								"aria-selected": 	"true",
								"data-toggle": 		"tab",
								"text": 			"頁籤"
							}
						}
					]
				}
			},
			{
				"li": {
					"class": 	"nav-item add-nav-item",
					"children": [
						{
							"a": {
								"class": 			"nav-link view-hide",
								"id": 				"plus-tab ",
								"aria-selected": 	"false",
								"text": 			"+"
							}
						}
					]
				}
			}
		]
	}
}

/** 標籤li樣式 */
const tabElemental = {
	"li": {
		"class": 	"nav-item",
		"children": [
			{
				"a": {
					"class": 		"nav-link canEditDiv",
					"id": 		 	"tabTag",
					"data-Toggle": 	"tab",
					"href": 		"#tab",
					"role": 		"tab",
					"aria-controls":"tab",
					"aria-selected":"false",
					"text": 		"頁籤"
				}
			}
		]
	}
}

/** 內容div樣式 */
const contentElemental = {
	"div": {
		"class": 			"tab-pane fade h-100",
		"id": 				"tab",
		"role": 			"tabpanel",
		"aria-labelledby": 	"tabTag",
		"children": []
	}
}

/** 編輯樣式 */
const editElemental = {
	"div": {
		"class": "input-group focus-edit",
		"children": [
			{
				"input": {
					"type": 	"text",
					"class": 	"form-control"
				}
			},
			{
				"div": {
					"class": "input-group-append",
					"children": [
						{
							"button": {
								"class": 	"btn btn-danger",
								"type":  	"button",
								"onclick":  "editEnd(event, false)",
								"children": [
									{
										"i": {
											"class": "bi bi-x"
										}
									}
								]
							}
						},
						{
							"button": {
								"class": 	"btn btn-success",
								"type":  	"button",
								"onclick":  "editEnd(event, true)",
								"children": [
									{
										"i": {
											"class": "bi bi-check"
										}
									}
								]
							}
						}
					]
				}
			}
		]
	}
}

/** 規則樣式 */
const scriptParamRowElemental = {
	'div': {
		'class': 	'col-12 row form-group script-row send-param-edit',
		'children': [
			{
				'div': {
					'class': 	'col-md-3',
					'children': [
						{
							'input': {
								'type': 		'text',
								'class': 		'form-control',
								'placeholder': 	'參數名稱',
								'name': 		'paramName',
							}
						}
					]
				}
			},
			{
				'div': {
					'class': 	'col-md-4',
					'children': [
						{
							'select': {
								'class': 'form-control',
								'name': 'paramType',
								'children': [
									{
										'option': {
											'value': 'default',
											'text': '預設'
										}
									},
									{
										'option': {
											'value': 'add',
											'text': '開啟時'
										}
									},
									{
										'option': {
											'value': 'upd',
											'text': '編輯/列印時'
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
					'class': 	'col-md-4 input-group param-package',
					'children': []
				}
			},
			{
				'div': {
					'class': 	'col-md-1',
					'children': [
						{
							'button': {
								'class': 	'btn btn-danger skip',
								'type':  	'button',
								'onclick': 	'this.parentNode.parentNode.remove()',
								'children': [
									{
										'i': {
											'class': 'bi bi-x',
										}
									}
								]
							}
						}
					]
				}
			}
		]
	}
}

/** 選擇參數包裝 */
const paramValueElemental = [
	{
		'input': {
			'type': 		'text',
			'class': 		'form-control param-value-input final-input',
			'placeholder': 	'參數值(可直接編輯或雙擊)',
			'title': 		'雙擊滑鼠進行編輯'
		}
	},
	{
		'select': {
			'class': 'form-control edit-select select-step-1 hide',
			'name': 'selectStep1',
			'children': []
		}
	},
	{
		'select': {
			'class': 'form-control edit-select select-step-2 local hide',
			'name': 'selectLocalStep2',
			'children': []
		}
	},
	{
		'select': {
			'class': 'form-control edit-select select-step-2 gFormData hide',
			'name': 'selectgFormDataStep2',
			'children': []
		}
	},
	{
		'select': {
			'class': 'form-control edit-select select-step-2 eleId hide',
			'name': 'selecteleIdStep2',
			'children': []
		}
	},
	{
		'input': {
			'class': 'form-control edit-select select-step-2 default hide',
			'name': 'selectDefaultStep2',
			'type': 'text'
		}
	},
	{
		'button': {
			'class': 'btn btn-secondary select-step-2 default skip hide',
			'name': 'selectDefaultStep2',
			'text': '',
			'title': '完成',
			'children':  [
				{
					'i': {
						'class': 'bi bi-check'
					}
				}
			]
		}
	}
]

/** 規則樣式 */
const ruleElemental = {
	'div': {
		'class': 	'col-12 row form-group ruleRow',
		'children': [
			{
				'div': {
					'class': 	'col-md-1',
					'children': [
						{
							'button': {
								'class': 	'btn btn-danger',
								'type':  	'button',
								'onclick': 	'$(this).parent().parent().remove()',
								'children': [
									{
										'i': {
											'class': 'bi bi-x',
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
					'class': 	'col-md-3',
					'children': [
						{
							'input': {
								'type': 		'number',
								'class': 		'form-control',
								'placeholder': 	'最小值(>)',
								'name': 		'min-limit',
							}
						}
					]
				}
			},
			{
				'div': {
					'class': 	'col-md-3',
					'children': [
						{
							'input': {
								'type': 		'number',
								'class': 		'form-control',
								'placeholder': 	'最大值(<=)',
								'name': 		'max-limit',
							}
						}
					]
				}
			},
			{
				'div': {
					'class': 	'col-md-3',
					'children': [
						{
							'input': {
								'type': 		'text',
								'class': 		'form-control',
								'placeholder': 	'提示文字(選填)',
								'name': 		'warning-text',
							}
						}
					]
				}
			},
			{
				'div': {
					'class': 	'col-md-2',
					'children': [
						{
							'input': {
								'class': 	'inputColor',
								'name': 	'rule-color',
								'value': 	'blue',
								'type': 	'color'
							}
						}
					]
				}
			}
		]
	}
}

/** api 參數對照組列 */
const apiParamElemental = [
	{
		'div': {
			'class': 	'col-md-3',
			'children': [
				{
					'br': {}
				}
			]
		}
	},
	{
		'div': {
			'class': 	'col-md-3',
			'children': [
				{
					'input': {
						'type': 		'text',
						'class': 		'form-control',
						'placeholder': 	'參數值',
						'name': 		'paramValue',
					}
				}
			]
		}
	},
	{
		'div': {
			'class': 	'col-md-3',
			'children': [
				{
					'input': {
						'type': 		'text',
						'class': 		'form-control',
						'placeholder': 	'改變值',
						'name': 		'finalValue',
					}
				}
			]
		}
	},
	{
		'div': {
			'class': 	'col-md-1',
			'children': [
				{
					'button': {
						'class': 	'btn btn-danger',
						'type':  	'button',
						'onclick': 	'$(this).parent().parent().remove()',
						'children': [
							{
								'i': {
									'class': 'bi bi-x',
								}
							}
						]
					}
				}
			]
		}
	}
]

/** queryList 腳本列 */
const qlAddScriptElemental = {
    "div": {
        "class": "col-12 row form-group",
        "children": [
            {
                "div": {
                    "class": "col-md-1 text-center",
                    "children": [
                        {
                            "button": {
                                "class": "btn btn-danger",
                                "type": "button",
                                "children": [
                                    {
                                        "i": {
                                            "class": "bi bi-x"
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
                    "class": "col-md-11",
                    "children": [
                        {
                            "select": {
                                "class": "form-control",
                                "name": "modalSelectType",
                                "id": "modalSelectType",
                                "children": [
                                    {
                                        "option": {
                                            "value": "0",
											"data-level": "main,sub",
                                            "text": "請選擇"
                                        }
                                    },
                                    {
                                        "option": {
                                            "value": "getMainListToTm",
											"data-level": "main",
                                            "text": "取得主表欄位並轉換日期格式"
                                        }
                                    },
                                    {
                                        "option": {
                                            "value": "getSubListToTm",
											"data-level": "sub",
                                            "text": "取得次表欄位並轉換日期格式"
                                        }
                                    },
                                    {
                                        "option": {
                                            "value": "getMainListValue",
											"data-level": "main",
                                            "text": "取得主表第一筆欄位資料"
                                        }
                                    },
                                    {
                                        "option": {
                                            "value": "getSubListValue",
											"data-level": "sub",
                                            "text": "取得次表第一筆欄位資料"
                                        }
                                    },
                                    {
                                        "option": {
                                            "value": "getListValueToJsonString",
											"data-level": "main",
                                            "text": "取得主表欄位轉換為JSON字串"
                                        }
                                    },
                                    {
                                        "option": {
                                            "value": "getStrEmpVal",
											"data-level": "sub",
                                            "text": "取得次表欄位輸出字串結果"
                                        }
                                    },
                                    {
                                        "option": {
                                            "value": "getMapCount",
											"data-level": "main",
                                            "text": "取得主表欄位結果數量"
                                        }
                                    },
                                    {
                                        "option": {
                                            "value": "getMap",
											"data-level": "main",
                                            "text": "取得主表欄位資料"
                                        }
                                    },
                                    {
                                        "option": {
                                            "value": "searchListHasVal",
											"data-level": "sub",
                                            "text": "判斷次表欄位是否存在指定值"
                                        }
                                    },
                                    {
                                        "option": {
                                            "value": "searchListFirstHasVal",
											"data-level": "sub",
                                            "text": "判斷次表第一筆欄位是否存在指定值"
                                        }
                                    },
                                    {
                                        "option": {
                                            "value": "getCheckboxItemValue",
											"data-level": "sub",
                                            "text": "取得次表多個欄位並分割取代輸出複選框資料(逗號分割(,))"
                                        }
                                    },
                                    {
                                        "option": {
                                            "value": "getCheckboxOtherItemValue",
											"data-level": "sub",
                                            "text": "取得次表多個欄位並分割取代輸出複選框其他資料(直線分割(|))"
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
                    "class": "col-md-12 row modal-row-padding",
					"id": "modalCustomRow",
                   	"children": []
                }
            }
        ]
    }
}

/** 新增更新頁樣式 */
const addAndUpdFormStyle = [
	{
		"div": {
			"class": 	"container-fluid row title-bar versionInfo",
			"children": [
				{
					"div": {
						"class": 	"title-bar-text",
						"children": []
					}
				},
				{
					"div": {
						"class": 	"mobile-fixed",
						"id": 		"mobile-fixed",
						"children": [
							{
								"button": {
									"class": 	"btn btn-sm btn-other btn-secondary",
									"type":  	"button",
									"text": 	"",
									"children": [
										{
											"i": {
												"class": "feather-x"
											}
										},
										{
											"span": {
												"text": "取消"
											}
										}
									]
								}
							},
							{
								"button": {
									"class": 	"btn btn-sm btn-other btn-success",
									"type":  	"button",
									"text": 	"",
									"children": [
										{
											"i": {
												"class": "feather-archive"
											}
										},
										{
											"span": {
												"text": "暫存"
											}
										}
									]
								}
							},
							{
								"button": {
									"class": 	"btn btn-sm btn-main btn-primary",
									"type":  	"button",
									"text": 	"",
									"children": [
										{
											"i": {
												"class": "feather-save"
											}
										},
										{
											"span": {
												"text": "儲存"
											}
										}
									]
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
			"class": 	"tab-content-block",
			"children": [
				{
					"div": {
						"class": "tab-menu",
						"children": [
							{
								"div": {
									"class": "tab-menu-toggle show",
									"children": [
										{
											"i": {
												"class": "feather-chevron-down"
											}
										}
									]
								}
							},
							{
								"ul": {
									"class": 	"nav nav-tabs",
									"id": 		"tabs",
									"role": 	"tablist",
									"children": [
										{
											"li": {
												"class": 	"nav-item",
												"children": [
													{
														"a": {
															"class": 			"nav-link canEditDiv active",
															"id": 				"tabTag1",
															"href": 			"#tab1",
															"role": 			"tab",
															"aria-controls": 	"tab1",
															"aria-selected": 	"true",
															"data-toggle": 		"tab",
															"text": 			"頁籤"
														}
													}
												]
											}
										},
										{
											"li": {
												"class": 	"nav-item add-nav-item",
												"children": [
													{
														"a": {
															"class": 			"nav-link view-hide",
															"id": 				"plus-tab",
															"aria-selected": 	"false",
															"text": 			"+"
														}
													}
												]
											}
										}
									]
								},
							}
						]
					}
				},
				{
					"div": {
						"class": 	"tab-content border flex-fill",
						"id": 		"tabContent",
						"children": [
							{
								"div": {
									"class": 			"tab-pane h-100 fade show active",
									"id": 				"tab1",
									"role": 			"tabpanel",
									"aria-labelledby": 	"tabTag1",
									"children": [
										// {
										// 	"div": {
										// 		"class": "cards"
										// 	}
										// }
										{
											"table": {
												"class": 	"table-fixed table table-striped table-bordered",
												"children": [
													{
														"tbody": {
															"children": [
																{
																	"tr": {
																		"children": [
																			{
																				"td": {
																					"class": 		"",
																					"data-role": 	"drag-drop-container",
																					"text": 		" "
																				}
																			},
																			{
																				"td": {
																					"class": 		"",
																					"data-role": 	"drag-drop-container",
																					"text": 		" "
																				}
																			}
																		]
																	}
																}
															]
														}
													}
												]
											}
										}
									]
								}
							}
						]
					}
				}
			]
		}
	}
]

/** 清單樣式 */
const listFormStyle = [
	{
		"div": {
			"class": 	"container-fluid title-bar versionInfo",
			"children": [
				{
					"div": {
						"class": 	"title-bar-text",
						"children": []
					}
				},
				{
					"div": {
						"class": 	"mobile-fixed",
						"id": "mobile-fixed",
						"children": [
							{
								"button": {
									"class": 	"btn btn-sm btn-main btn-primary",
									"type":  	"button",
									"text": 	"",
									"children": [
										{
											"i": {
												"class": "feather-plus"
											}
										},
										{
											"span": {
												"text": "新增"
											}
										}
									]
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
			"class": 	"flex-fill",
			"id": 		"listContent",
			"children": [
				{
					"div": {
						"class": 			"tab-pane h-100 fade show active",
						"id": 				"list",
						"children": [
							{
								"table": {
									"class": 	"table table-list table-striped table-bordered",
									"id": 		"tableList",
									"children": [
										{
											"thead": {
												"children": [
													{
														"tr": {
															"children": [
																{
																	"th": {
																		"scope": 	"col",
																		"class": 	"text-center canEditDiv",
																		"text": 	"序號"
																	}
																},
																{
																	"th": {
																		"scope": 	"col",
																		"class": 	"text-center canEditDiv",
																		"text": 	"狀態"
																	}
																},
																{
																	"th": {
																		"scope": 	"col",
																		"class": 	"text-center canEditDiv",
																		"text": 	"最後修改日"
																	}
																},
																{
																	"th": {
																		"scope": 	"col",
																		"class": 	"text-center canEditDiv",
																		"text": 	"最後修改者"
																	}
																},
																{
																	"th": {
																		"scope": 	"col",
																		"class": 	"text-center canEditDiv",
																		"text": 	"功能"
																	}
																}
															]
														}
													}
												]
											}
										},
										{
											"tbody": {
												"children": [
													{
														"tr": {
															"children": [
																{
																	"th": {
																		"class": 	"text-center",
																		"scope":	"col",
																		"data-role":"drag-drop-container",
																		"children": [
																			{
																				"listEle": {
																					'class':   			'listEle',
																					'data-ele-name':	'serialNumber'
																				}
																			}
																		]
																	}
																},
																{
																	"th": {
																		"class": 	"text-center",
																		"scope":	"col",
																		"data-role":"drag-drop-container",
																		"children": [
																			{
																				"listEle": {
																					'class':   			'listEle',
																					'data-ele-name':	'status'
																				}
																			}
																		]
																	}
																},
																{
																	"th": {
																		"class": 	"text-center",
																		"scope":	"col",
																		"data-role":"drag-drop-container",
																		"children": [
																			{
																				"listEle": {
																					'class':   			'listEle',
																					'data-ele-name':	'lastUpdTime'
																				}
																			}
																		]
																	}
																},
																{
																	"th": {
																		"class": 	"text-center",
																		"scope":	"col",
																		"data-role":"drag-drop-container",
																		"children": [
																			{
																				"listEle": {
																					'class':   			'listEle',
																					'data-ele-name':	'lastUpdName'
																				}
																			}
																		]
																	}
																},
																{
																	"th": {
																		"class": 	"text-center table-td-btn button-block",
																		"children": [
																			{
																				"div": {
																					"class": "table-btn-mobile-show"
																				}
																			},
																			{
																				"span": {
																					"class": "table-more show",
																					"children": [
																						{
																							"i": {
																								"class": "feather-more-horizontal"
																							}
																						}
																					]
																				}
																			},
																			{
																				"div": {
																					"class": "table-btn-mobile-hide",
																					"children": [
																						{
																							"div": {
																								"class": "table-btn-block",
																								"children": [
																									{
																										"button": {
																											"class": 	"btn btn-other btn-success",
																											"type":  	"button",
																											"text": 	"",
																											"children": [
																												{
																													"i": {
																														"class": "feather-edit-2"
																													}
																												},
																												{
																													"span": {
																														"text": "編輯"
																													}
																												}
																											]
																										}
																									},
																									{
																										"button": {
																											"class": 	"btn btn-other btn-secondary",
																											"type":  	"button",
																											"text": 	"",
																											"children": [
																												{
																													"i": {
																														"class": "feather-printer"
																													}
																												},
																												{
																													"span": {
																														"text": "列印"
																													}
																												}
																											]
																										}
																									},
																									{
																										"button": {
																											"class": 	"btn btn-other btn-danger",
																											"type":  	"button",
																											"text": 	"",
																											"children": [
																												{
																													"i": {
																														"class": "feather-trash-2"
																													}
																												},
																												{
																													"span": {
																														"text": "刪除"
																													}
																												}
																											]
																										}
																									}
																								]
																							}
																						}
																					]
																				}
																			}
																		]
																	}
																}
															]
														}
													}
												]
											}
										}
									]
								}
							}
						]
					}
				}
			]
		}
	}
]

/** 添加表頭按鈕 */
const addPrintTitleButton = {
	"button": {
		"class": "btn btn-primary add-title-button w-100",
		"type": "button",
		"onclick": "CreateUtils.addPrintTitle(event)",
		"text": "添加表頭"
	}
}

/** 編輯欄寬按鈕 */
const customizeButton = {
	"button": {
		"class": "customize-col-btn btn btn-primary w-100",
		"type": "button",
		"onclick": "toggleCustomizeCol('resultTable')",
		"text": "編輯欄寬",
		"children": [
			{
				"span":{
					"class":"customize-col-tooltip bi bi-info",
					"children":[
						{
							"ol":{
								"class":"tooltip-content",
								"text":"功能說明:",
								"children":[
									{
										"li":{
											"text": "點擊編輯欄寬可以展開或收合欄寬設定功能列"
										}
									},
									{
										"li": {
											"text": "欄寬設定列中所顯示數字為該欄位每行可容納中文字數"
										}
									},
									{
										"li":{
											"text": "未顯示數字的欄位即為自適應，僅容許一欄為自適應欄位"
										}
									},
									{
										"li":{
											"text":"雙擊兩下有設定字數的欄位可將其設為自適應欄位"
										}
									}
								]
							}
						}
					]
				}
			}
		]
	}
}

/** 列印樣式 */
const printFormStyle = [
	{
		"div": {
			"class": "resultGroup",
			"children": [
				{
					"div": {
						"class": "pageHeader model",
						"children": [
							{
								"div": {
									"class": "left print-container",
									"data-role": "drag-drop-container",
									"text": "&nbsp;"
								}
							},
							{
								"div": {
									"class": "middle print-container",
									"data-role": "drag-drop-container",
									"children": [
										{
											"label": {
												"class": "h6 canEditDiv",
												"text": "${ systemValue.local:hospital_name }"
											}
										}
									]
								}
							},
							{
								"div": {
									"class": "right print-container",
									"data-role": "drag-drop-container",
									"text": "&nbsp;"
								}
							}
						]
					}
				},
				{
					"div": {
						"class": "pageTitle model border",
						"children": [
							{
								"table": {
									"class": "output-table",
									"children": [
										{
											"tbody": {
												"children": [
													{
														"tr": {
															"children": [
																{
																	"td": {
																		"class": ""
																	}
																},
																{
																	"td": {
																		"class": "text-center"
																	}
																},
																{
																	"td": {
																		"class": ""
																	}
																}
															]
														}
													}
												]
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
						"class": "pageFooter model",
						"children": [
							{
								"div": {
									"class": "left print-container",
									"data-role": "drag-drop-container",
									"text": "&nbsp;"
								}
							},
							{
								"div": {
									"class": "middle print-container",
									"data-role": "drag-drop-container",
									"text": "&nbsp;"
								}
							},
							{
								"div": {
									"class": "right print-container",
									"data-role": "drag-drop-container",
									"text": "&nbsp;"
								}
							}
						]
					}
				}
			]
		}
	}
]

/** Query List 清單樣式 */
const queryListStyle = [
	{
		"div": {
			"class": 	"container-fluid row title-bar vertical",
			"children": [
				{
					"div": {
						"class": 	"container-fluid row title-block",
						"children": [
							{
								"div": {
									"class": 	"title-bar-text",
									"children": [
										
									]
								}
							}
						]
					}
				}
			]
		}
	},
	{
		"nav": {
			"class": "navbar navbar-light bg-light",
			"children": [
				{
					"a": {
						"class": "navbar-brand",
						"href": "#",
						"text": "查詢條件"
					}
				},
				{
					"form": {
						"class": "form-inline",
						"id": "search-bar",
						"onsubmit": "return false;",
						"children": [
							{
								"div": {
									"class": "flex border not-export",
									"style": "min-width: 5rem;",
									"data-role": "drag-drop-container-search",
									"text": "drop here",
									"id": "dropSearchContainer"
								}
							},
							{
								"button": {
									"class": "btn btn-outline-secondary my-2 my-sm-0",
									"id": "reset-button",
									"type": "button",
									"text": "復原"
								}
							},
							{
								"button": {
									"class": "btn btn-outline-success my-2 my-sm-0",
									"id": "search-button",
									"type": "submit",
									"text": "查詢"
								}
							}
						]
					}
				}
			]
		}
	},
	{
		"br": {
			"text": ""
		}
	},
	{
		"table": {
			"class": "table table-bordered table-sort-module",
			"id": "tableData",
			"children": [
				{
					"tbody": {
						"children": [
							{
								"tr": {
									"class": "text-center",
									"children": [
										{
											"td": {
												"class": "canEditDiv",
												"scope": "col",
												"text": "標題"
											}
										},
										{
											"td": {
												"class": "canEditDiv",
												"scope": "col",
												"text": "標題"
											}
										}
									]
								}
							},
							{
								"tr": {
									"class": "text-center",
									"children": [
										{
											"td": {
												"scope": "col",
												"class": "",
												"data-role": "drag-drop-container-data",
												"test": ""
											}
										},
										{
											"td": {
												"scope": "col",
												"data-role": "drag-drop-container-data",
												"text": ""
											}
										}
									]
								}
							}
						]
					}
				}
			]
		}
	}
]

/** xml 模板樣式 */
const xmlTemplateStyle = [
	{
		"div": {
			"class": 	"container-fluid row title-bar vertical",
			"children": [
				{
					"div": {
						"class": 	"container-fluid row title-block",
						"children": [
							{
								"div": {
									"class": 	"title-bar-text",
									"children": [
										
									]
								}
							}
						]
					}
				}
			]
		}
	},
	{
		"table": {
			"class": "table table-bordered",
			"id": "tableData",
			"children": [
				{
					"tbody": {
						"children": [
							{
								"tr": {
									"class": "text-center",
									"children": [
										{
											"td": {
												"class": "canEditDiv",
												"scope": "col",
												"text": "標題"
											}
										},
										{
											"td": {
												"scope": "col",
												"class": "",
												"data-role": "drag-drop-container-data",
												"test": ""
											}
										}
									]
								}
							},
							{
								"tr": {
									"class": "text-center",
									"children": [
										{
											"td": {
												"class": "canEditDiv",
												"scope": "col",
												"text": "標題"
											}
										},
										{
											"td": {
												"scope": "col",
												"data-role": "drag-drop-container-data",
												"text": ""
											}
										}
									]
								}
							}
						]
					}
				}
			]
		}
	}
]

/** 彈出視窗 - 提醒樣式 */
const alertModal = {
	"div": {
		"class": 			"modal fade",
		"tabindex": 		"-1",
		"role": 			"dialog",
		"data-backdrop": 	"static",
		"data-keyboard": 	"false",
		"children": [
			{
				"div": {
					"class": 	"modal-dialog",
					"role": 	"document",
					"children": [
						{
							"div": {
								"class": 	"modal-content",
								"children": [
									{
										"div": {
											"class": 	"modal-header bg-danger text-white",
											"children": [
												{
													"h5": {
														"class": 	"modal-title",
														"text": 	"提示"
													}
												},
												{
													"button": {
														"type": 		"button",
														"class": 		"close text-white",
														"data-dismiss": "modal",
														"aria-label": 	"Close",
														"onclick": 		"setTimeout(() => {$('#momentModal').remove()}, 200)",
														"children": [
															{
																"span": {
																	"aria-hidden": 	"true",
																	"text": 		"&times;"
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
											"class": 	"modal-body",
											"children": [
												{
													"p": {
														"text": "Modal text goes here."
													}
												}
											]
										}
									},
									{
										"div": {
											"class": 	"modal-footer",
											"children": [
												{
													"button": {
														"type": 		"button",
														"class": 		"btn btn-primary",
														"data-dismiss": "modal",
														"onclick": 		"setTimeout(() => {$('#momentModal').remove()}, 200)",
														"text": 		"確定"
													}
												}
											]
										}
									}
								]
							}
						}
					]
				}
			}
		]
	}
}

/** 彈出視窗-詢問樣式 */
const confirmModal = {
	"div": {
		"class": 			"modal fade",
		"tabindex": 		"-1",
		"role": 			"dialog",
		"data-backdrop": 	"static",
		"data-keyboard": 	"false",
		"children": [
			{
				"div": {
					"class": 	"modal-dialog",
					"role": 	"document",
					"children": [
						{
							"div": {
								"class": 	"modal-content",
								"children": [
									{
										"div": {
											"class": 	"modal-header bg-primary text-white",
											"children": [
												{
													"h5": {
														"class": 	"modal-title",
														"text": 	"詢問"
													}
												},
												{
													"button": {
														"type": 		"button",
														"class": 		"close text-white",
														"data-dismiss": "modal",
														"aria-label": 	"Close",
														"onclick": 		"setTimeout(() => {$('#momentModal').remove()}, 200)",
														"children": [
															{
																"span": {
																	"aria-hidden": 	"true",
																	"text": 		"&times;"
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
											"class": 	"modal-body",
											"children": [
												{
													"p": {
														"text": "Modal text goes here."
													}
												}
											]
										}
									},
									{
										"div": {
											"class": 	"modal-footer",
											"children": [
												{
													"button": {
														"type": 		"button",
														"class": 		"btn btn-secondary",
														"data-dismiss": "modal",
														"text": 		"取消"
													}
												},
												{
													"button": {
														"type": 		"button",
														"class": 		"btn btn-primary",
														"data-dismiss": "modal",
														"text": 		"確定"
													}
												}
											]
										}
									}
								]
							}
						}
					]
				}
			}
		]
	}
}

/** 彈出視窗-輸入樣式 */
const promptModal = {
	"div": {
		"class": 			"modal fade",
		"tabindex": 		"-1",
		"role": 			"dialog",
		"data-backdrop": 	"static",
		"data-keyboard": 	"false",
		"children": [
			{
				"div": {
					"class": 	"modal-dialog",
					"role": 	"document",
					"children": [
						{
							"div": {
								"class": 	"modal-content",
								"children": [
									{
										"div": {
											"class": 	"modal-header bg-success text-white",
											"children": [
												{
													"h5": {
														"class": 	"modal-title",
														"text": 	"提示"
													}
												},
												{
													"button": {
														"type": 		"button",
														"class": 		"close text-white",
														"data-dismiss": "modal",
														"aria-label": 	"Close",
														"onclick": 		"setTimeout(() => {$('#momentModal').remove()}, 200)",
														"children": [
															{
																"span": {
																	"aria-hidden": 	"true",
																	"text": 		"&times;"
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
											"class": 	"modal-body",
											"children": [
												{
													"form": {
														"onsubmit": "return false",
														"children": [
															{
																'div': {
																	'class': 	'form-group row',
																	'children': [
																		{
																			'div': {
																				'class':    'col-sm-12',
																				'children': [
																					{
																						'input': {
																							'type':         'text',
																							'class':        'form-control',
																							'id':           'modalInput',
																							'name': 		'modalInput'
																						}
																					}
																				]
																			}
																		}
																	]
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
											"class": 	"modal-footer",
											"children": [
												{
													"button": {
														"type": 		"button",
														"class": 		"btn btn-secondary",
														"data-dismiss": "modal",
														"text": 		"取消"
													}
												},
												{
													"button": {
														"type": 		"button",
														"class": 		"btn btn-primary",
														"data-dismiss": "modal",
														"text": 		"確定"
													}
												}
											]
										}
									}
								]
							}
						}
					]
				}
			}
		]
	}
}

/** 彈出視窗-客製樣式 */
const customModal = {
	"div": {
		"class": 			"modal fade",
		"tabindex": 		"-1",
		"role": 			"dialog",
		"data-backdrop": 	"static",
		"data-keyboard": 	"false",
		"children": [
			{
				"div": {
					"class": 	"modal-dialog modal-xl",
					"role": 	"document",
					"children": [
						{
							"div": {
								"class": 	"modal-content",
								"children": [
									{
										"div": {
											"class": 	"modal-header",
											"children": [
												{
													"h5": {
														"class": 	"modal-title",
														"text": 	"標題"
													}
												},
												{
													"button": {
														"type": 		"button",
														"class": 		"close",
														"data-dismiss": "modal",
														"aria-label": 	"Close",
														"onclick": 		"setTimeout(() => {$('#momentModal').remove()}, 200)",
														"children": [
															{
																"span": {
																	"aria-hidden": 	"true",
																	"text": 		"&times;"
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
											"class": 	"modal-body",
											"children": [
												
											]
										}
									},
									{
										"div": {
											"class": 	"modal-footer",
											"children": [
												
											]
										}
									}
								]
							}
						}
					]
				}
			}
		]
	}
}

/** 新增表單彈出視窗內文區塊 */
const newFormBody = {
	"form": {
		"onsubmit": "return false",
		"children": [
			{
				'div': {
					'class': 	'form-group row',
					'children': [
						{
							'label': {
								'class':    'col-sm-3 col-form-label',
								'for':      'modalNewFormName',
								'text':     '表單英文名稱(formName)'
							}
						},
						{
							'div': {
								'class':    'col-sm-9',
								'children': [
									{
										'input': {
											'type':         'text',
											'class':        'form-control',
											'id':           'modalNewFormName',
											'name': 		'modalNewFormName',
											'placeholder':  'formName'
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
					'class': 	'form-group row',
					'children': [
						{
							'label': {
								'class':    'col-sm-3 col-form-label',
								'for':      'modalNewFormTitle',
								'text':     '表單中文名稱(formTitle)'
							}
						},
						{
							'div': {
								'class':    'col-sm-9',
								'children': [
									{
										'input': {
											'type':         'text',
											'class':        'form-control',
											'id':           'modalNewFormTitle',
											'name': 		'modalNewFormTitle',
											'placeholder':  '表單名稱'
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
					'class': 	'form-group row',
					'children': [
						{
							'label': {
								'class': 	'col-sm-3 col-form-label',
								'for': 		'modalNewFormType',
								'text': 	'表單類型'
							}
						},
						{
							'div': {
								'class': 	'col-sm-9',
								'children': [
									{
										'select': {
											'class': 	'custom-select',
											'id': 		'modalNewFormType',
											'name': 	'modalNewFormType',
											'children': [
												{
													'option': {
														'value': 	'add',
														'text': 	'新增/更新頁'
													}
												}
											]
										}
									}
								]
							}
						}
					]
				}
			}
		]
	}
}

/** 表單類型彈出視窗內文區塊 */
const formFormatBody = {
	"form": {
		"onsubmit": "return false",
		"children": [
			{
				'div': {
					'class': 	'form-group row',
					'children': [
						{
							'label': {
								'class': 	'col-sm-3 col-form-label',
								'for': 		'formFormatFormType',
								'text': 	'表單類型'
							}
						},
						{
							'div': {
								'class': 	'col-sm-9',
								'children': [
									{
										'select': {
											'class': 	'custom-select',
											'id': 		'formFormatFormType',
											'name': 	'formFormatFormType',
											'children': [
												{
													'option': {
														'value': 	'0',
														'text': 	'請選擇'
													}
												},
												{
													'option': {
														'value': 		'add',
														'text': 		'新增/更新頁'
													}
												},
												{
													'option': {
														'value': 		'appadd',
														'text': 		'新增/更新頁(App版)'
													}
												},
												{
													'option': {
														'value': 		'list',
														'text': 		'清單頁'
													}
												},
												{
													'option': {
														'value': 		'applist',
														'text': 		'清單頁(App版)'
													}
												},
												{
													'option': {
														'value': 		'print',
														'text': 		'列印頁'
													}
												},
												{
													'option': {
														'value': 		'print_old',
														'text': 		'列印頁(舊)'
													}
												}
											]
										}
									}
								]
							}
						}
					]
				}
			}
		]
	}
}

/** 表單樣式彈出視窗內文區塊 */
const formStyleBody = {
	"form": {
		"onsubmit": "return false",
		"children": [
			{
				'div': {
					'class': 	'form-group row',
					'children': [
						{
							'label': {
								'class': 	'col-sm-3 col-form-label',
								'for': 		'modalFormTitleStyle',
								'text': 	'標題樣式'
							}
						},
						{
							'div': {
								'class': 	'col-sm-9',
								'children': [
									{
										'select': {
											'class': 	'custom-select',
											'id': 		'modalFormTitleStyle',
											'name': 	'modalFormTitleStyle',
											'children': [
												{
													'option': {
														'value': 		'0',
														'text': 		'請選擇'
													}
												},
												{
													'option': {
														'value': 		'default',
														'text': 		'預設',
														'data-type': 	'list,print'
													}
												},
												{
													'option': {
														'value': 		'none',
														'text': 		'無標題',
														'data-type': 	'add'
													}
												},
												{
													'option': {
														'value': 		'styleI',
														'text': 		'樣式一(標題按鈕水平)',
														'data-type': 	'add'
													}
												},
												{
													'option': {
														'value': 		'styleSearch',
														'text': 		'查詢樣式(包含查詢日期及列印清單)',
														'data-type': 	'list'
													}
												}
												// {
												// 	'option': {
												// 		'value': 		'styleII',
												// 		'text': 		'樣式二(標題按鈕垂直)',
												// 		'data-type': 	'add'
												// 	}
												// }
											]
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
					'class': 	'form-group row',
					'data-type': 'add',
					'children': [
						{
							'label': {
								'class': 	'col-sm-3 col-form-label',
								'for': 		'modalFormNavStyle',
								'text': 	'頁籤'
							}
						},
						{
							'div': {
								'class': 	'col-sm-9',
								'children': [
									{
										'select': {
											'class': 	'custom-select',
											'id': 		'modalFormNavStyle',
											'name': 	'modalFormNavStyle',
											'children': [
												{
													'option': {
														'value': 		'0',
														'text': 		'請選擇'
													}
												},
												{
													'option': {
														'value': 		'default',
														'text': 		'預設',
														'data-type': 	'list,print'
													}
												},
												{
													'option': {
														'value': 		'styleI',
														'text': 		'有頁籤',
														'data-type': 	'add'
													}
												},
												{
													'option': {
														'value': 		'styleII',
														'text': 		'無頁籤',
														'data-type': 	'add'
													}
												}
											]
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
					'class': 	'form-group row',
					'data-type': 'add,list,print',
					'children': [
						{
							'label': {
								'class': 	'col-sm-3 col-form-label',
								'for': 		'modalFormTitle',
								'text': 	'表頭'
							}
						},
						{
							'div': {
								'class': 	'col-sm-9',
								'children': [
									{
										'select': {
											'class': 	'custom-select',
											'id': 		'modalFormTitle',
											'name': 	'modalFormTitle',
											'children': [
												{
													'option': {
														'value': 	'0',
														'text': 	'請選擇'
													}
												},
												{
													'option': {
														'value': 	'styleI',
														'text': 	'有表頭'
													}
												},
												{
													'option': {
														'value': 	'styleII',
														'text': 	'無表頭'
													}
												}
											]
										}
									}
								]
							}
						}
					]
				}
			},
			// {
			// 	'div': {
			// 		'class': 	'form-group row add',
			// 		'children': [
			// 			{
			// 				'label': {
			// 					'class': 	'col-sm-3 col-form-label',
			// 					'for': 		'modalFormInformationBlock',
			// 					'text': 	'側邊區域'
			// 				}
			// 			},
			// 			{
			// 				'div': {
			// 					'class': 	'col-sm-9',
			// 					'children': [
			// 						{
			// 							'select': {
			// 								'class': 	'custom-select',
			// 								'id': 		'modalFormInformationBlock',
			// 								'name': 	'modalFormInformationBlock',
			// 								'title': 	'必須由工具產出才可添加區域',
			// 								'children': [
			// 									{
			// 										'option': {
			// 											'value': 	'0',
			// 											'text': 	'請選擇'
			// 										}
			// 									},
			// 									{
			// 										'option': {
			// 											'value': 	'none',
			// 											'text': 	'無'
			// 										}
			// 									},
			// 									{
			// 										'option': {
			// 											'value': 	'left',
			// 											'text': 	'左側'
			// 										}
			// 									},
			// 									{
			// 										'option': {
			// 											'value': 	'right',
			// 											'text': 	'右側'
			// 										}
			// 									}
			// 								]
			// 							}
			// 						}
			// 					]
			// 				}
			// 			}
			// 		]
			// 	}
			// },
			{
				'div': {
					'class': 	'form-group row',
					'data-type': 'add,list',
					'children': [
						{
							'label': {
								'class': 	'col-sm-3 col-form-label',
								'for': 		'modalFormStyle',
								'text': 	'畫面風格'
							}
						},
						{
							'div': {
								'class': 	'col-sm-9',
								'children': [
									{
										'select': {
											'class': 	'custom-select',
											'id': 		'modalFormStyle',
											'name': 	'modalFormStyle',
											'children': [
												{
													'option': {
														'value': 	'style1-1',
														'text': 	'藍色',
														'selected': 'selected'
													}
												},
												{
													'option': {
														'value': 	'style1-2',
														'text': 	'綠色'
													}
												},
												{
													'option': {
														'value': 	'style1-3',
														'text': 	'藍色(for陽明)'
													}
												}
											]
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
					'class': 	'form-group row',
					'data-type': 'print',
					'children': [
						{
							'label': {
								'class': 	'col-sm-3 col-form-label',
								'for': 		'modalprintFormat',
								'text': 	'列印模式'
							}
						},
						{
							'div': {
								'class': 	'col-sm-9',
								'children': [
									{
										'select': {
											'class': 	'custom-select',
											'id': 		'modalprintFormat',
											'name': 	'modalprintFormat',
											'children': [
												{
													'option': {
														'value': 	'portrait,single',
														'text': 	'直向(單張式)',
														'selected': 'selected'
													}
												},
												{
													'option': {
														'value': 	'portrait,report',
														'text': 	'直向(報表式)※警告※將會移除全部預設表格及元件，且無法復原！'
													}
												},
												{
													'option': {
														'value': 	'landscape,report',
														'text': 	'橫向(報表式)※警告※將會移除全部預設表格及元件，且無法復原！'
													}
												}
											]
										}
									}
								]
							}
						}
					]
				}
			}
		]
	}
}

/** 開啟表單彈出視窗內文區塊 */
const openFormBody = [
	{
		"div": {
			"class": 	"col-12 form-group row",
			"children": [
				{
					'label': {
						'class': 	'col-sm-3 col-form-label text-center',
						'for': 		'modalSearchForm',
						'text': 	'查詢表單'
					}
				},
				{
					'div': {
						'class': 	'col-sm-9',
						'children': [
							{
								'input': {
									'class': 		'form-control',
									'type': 		'text',
									'name': 		'modalSearchForm',
									'id': 			'modalSearchForm',
									'placeholder': 	'英文或中文皆可查詢'
								}
							}
						]
					}
				}
			]
		}
	},
	{
		"table": {
			"class": 	"table table-striped table-borderless",
			"id": 		"openFormTable",
			"children": [
				{
					"thead": {
						"children": [
							{
								"tr": {
									"class": "table-info",
									"children": [
										{
											"th": {
												"scope": 	"col",
												"class": 	"text-center",
												"text": 	"表單名稱(formName)"
											}
										},
										{
											"th": {
												"scope": 	"col",
												"class": 	"text-center",
												"text": 	"表單類型(formType)"
											}
										},
										{
											"th": {
												"scope": 	"col",
												"class": 	"text-center",
												"text": 	"時戳"
											}
										},
										{
											"th": {
												"scope": 	"col",
												"class": 	"text-center",
												"text": 	"功能"
											}
										}
									]
								}
							}
						]
					}
				},
				{
					"tbody": {
						"children": [
	
						]
					}
				}
			]
		}
	}
]

/** 匯入表單彈出視窗內文區塊 */
const importFormBody = {
	"form": {
		"onsubmit": "return false",
		"children": [
			{
				'div': {
					'class': 	'form-group row',
					'children': [
						{
							'label': {
								'class': 	'col-sm-3 col-form-label',
								'for': 		'modalImportTemplate',
								'text': 	'表單模板(XML File)'
							}
						},
						{
							'div': {
								'class': 	'col-sm-9 input-group',
								'children': [
									{
										'div': {
											'class': 'custom-file',
											'children': [
												{
													'input': {
														'type':         'file',
														'class':        'custom-file-input',
														'id':           'modalImportTemplate',
														'name': 		'modalImportTemplate',
														'accept': 		'.xml'
													}
												},
												{
													'label': {
														'class': 		'custom-file-label',
														'for': 			'modalImportTemplate',
														'text': 		'選擇檔案...'
													}
												}
											]
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
					'class': 	'form-group row',
					'children': [
						{
							'label': {
								'class': 	'col-sm-3 col-form-label',
								'for': 		'modalImportSubTemplates',
								'text': 	'表單子模板'
							}
						},
						{
							'div': {
								'class': 	'col-sm-9 input-group',
								'children': [
									{
										'div': {
											'class': 'custom-file',
											'children': [
												{
													'input': {
														'type':         'file',
														'class':        'custom-file-input',
														'id':           'modalImportSubTemplates',
														'name': 		'modalImportSubTemplates',
														'multiple': 	'true'
													}
												},
												{
													'label': {
														'class': 		'custom-file-label',
														'for': 			'modalImportSubTemplates',
														'text': 		'選擇檔案...'
													}
												}
											]
										}
									}
								]
							}
						}
					]
				}
			}
		]
	}
}

/** 新增腳本彈出視窗內文區塊 */
const beanScriptBody = {
	"form": {
		"onsubmit": "return false",
		"children": [
			{
				'div': {
					'class': 	'form-group row',
					'children': [
						{
							'label': {
								'class': 	'col-sm-3 col-form-label',
								'text': 	'元件項目'
							}
						},
						{
							'div': {
								'class': 	'col-sm-9 align-middle modal-container',
								'id': 		'modalBeanContainer',
								'children': [ ]
							}
						}
					]
				}
			},
			{
				'div': {
					'class': 	'form-group row',
					'children': [
						{
							'label': {
								'class': 	'col-sm-3 col-form-label',
								'text': 	'腳本名稱'
							}
						},
						{
							'div': {
								'class': 	'col-sm-9',
								'children': [
									{
										'input': {
											'type':         'text',
											'class':        'form-control',
											'id':           'modalScriptName',
											'name': 		'modalScriptName',
											'placeholder':  '腳本名稱'
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
					'class': 	'form-group row',
					'children': [
						{
							'label': {
								'class': 	'col-sm-3 col-form-label',
								'for': 		'beanScriptType',
								'text': 	'腳本類別'
							}
						},
						{
							'div': {
								'class': 	'col-sm-9',
								'children': [
									{
										'select': {
											'class': 	'custom-select',
											'id': 		'beanScriptType',
											'name': 	'beanScriptType',
											'children': [
												{
													'option': {
														'value': 	'0',
														'text': 	'請選擇'
													}
												},
												{
													'option': {
														'value': 	 'disabled',
														'text': 	 '選取該選項，其餘不可選',
														'data-type': 'checkbox,radio'
													}
												},
												{
													'option': {
														'value': 	 'display',
														'text': 	 '選取該選項顯示/隱藏指定區域/元件',
														'data-type': 'checkbox,radio,select'
													}
												},
												{
													'option': {
														'value': 	 'required',
														'text': 	 '選取選項必須勾選',
														'data-type': 'checkbox,radio'
													}
												},
												{
													'option': {
														'value': 	 'create',
														'text': 	 '建立/移除重複選取區域',
														'data-type': 'button'
													}
												},
												{
													'option': {
														'value': 	 'address',
														'text': 	 '勾選帶入戶籍地址',
														'data-type': 'checkbox'

													}
												},
												{
													'option': {
														'value': 	 'bmi',
														'text': 	 '計算BMI',
														'data-type': 'text'
													}
												},
												{
													'option': {
														'value': 	 'ibw',
														'text': 	 '計算IBW',
														'data-type': 'text'
													}
												},
												{
													'option': {
														'value': 	 'import',
														'text': 	 '引入資料來源',
														'data-type': 'externalData'
													}
												}
											]
										}
									}
								]
							}
						},
						{
							'select': {
								'class': 	'init-script-select custom-select',
								'multiple': 'true',
								'size': 	'15',
								'name': 	'initScript',
								'id': 		'initScript',
								'children': [ ]
							}
						}
					]
				}
			},
			{
				'div': {
					'class': 	'form-group',
					'children': [
						{
							'label': {
								'class': 	'col-sm-12 select-range col-form-label hide',
								'text': 	'選擇區域'
							}
						},
						{
							'div': {
								'class': 	'col-sm-12 select-range structure1 hide',
								'id': 		'selectRange',
								'children': [ ]
							}
						}
					]
				}
			},
			{
				'div': {
					'class': 	'form-group count-bmi count-ibw row hide',
					'children': [
						{
							'label': {
								'class': 	'col-sm-3 col-form-label',
								'text': 	'選擇元件'
							}
						},
						{
							'div': {
								'class': 	'col-sm-9 row',
								'children': [
									{
										'select': {
											'class': 	'form-control count-bmi count-ibw col-sm-4',
											'id': 		'modalHeightBean',
											'name': 	'modalHeightBean',
											'children': [
												{
													'option': {
														'value': 	'0',
														'text': 	'請選擇身高元件'
													}
												}
											]
										}
									},
									{
										'div': {
											'class': 	'col-sm-1',
											'text': 	'&nbsp;'
										}
									},
									{
										'select': {
											'class': 	'form-control count-bmi col-sm-4',
											'id': 		'modalWeightBean',
											'name': 	'modalWeightBean',
											'children': [
												{
													'option': {
														'value': 	'0',
														'text': 	'請選擇體重元件'
													}
												}
											]
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
					'class': 	'form-group import-external-data row hide',
					'children': [
						{
							'label': {
								'class': 	'col-sm-3 col-form-label',
								'text': 	'選擇來源'
							}
						},
						{
							'div': {
								'class': 	'col-sm-9 row',
								'children': [
									{
										'select': {
											'class': 	'form-control import-external-data',
											'id': 		'modalSelectForm',
											'name': 	'modalSelectForm',
											'children': [
												{
													'option': {
														'value': 	'0',
														'text': 	'請選擇表單'
													}
												}
											]
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
					'class': 	'form-group import-external-data row hide',
					'children': [
						{
							'label': {
								'class': 	'col-sm-3 col-form-label',
								'text': 	'彈出選擇視窗'
							}
						},
						{
							'div': {
								'class': 	'col-sm-9 row',
								'children': [
									{
										'div': {
											'class': 	'form-check-inline',
											'children': [
												{
													'input': {
														'class': 	'form-check-input',
														'type': 	'radio',
														'id': 		'modalIsShowDiv0',
														'name': 	'modalIsShowDiv',
														'value': 	'true'
													}
												},
												{
													'label': {
														'class': 	'form-check-label',
														'for': 		'modalIsShowDiv0',
														'text': 	'是'
													}
												}
											]
										}
									},
									{
										'div': {
											'class': 	'form-check-inline',
											'children': [
												{
													'input': {
														'class': 	'form-check-input',
														'type': 	'radio',
														'id': 		'modalIsShowDiv1',
														'name': 	'modalIsShowDiv',
														'value': 	'false'
													}
												},
												{
													'label': {
														'class': 	'form-check-label',
														'for': 		'modalIsShowDiv1',
														'text': 	'否'
													}
												}
											]
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
					'class': 	'form-group import-external-data row hide',
					'children': [
						{
							'label': {
								'class': 	'col-sm-3 col-form-label',
								'text': 	'顯示資料'
							}
						},
						{
							'div': {
								'class': 	'col-sm-9 row',
								'children': [
									{
										'div': {
											'class': 	'form-check-inline',
											'children': [
												{
													'input': {
														'class': 	'form-check-input',
														'type': 	'radio',
														'id': 		'modalIsKeepDataNewest0',
														'name': 	'modalIsKeepDataNewest',
														'value': 	'true'
													}
												},
												{
													'label': {
														'class': 	'form-check-label',
														'for': 		'modalIsKeepDataNewest0',
														'text': 	'永遠最新資料'
													}
												}
											]
										}
									},
									{
										'div': {
											'class': 	'form-check-inline',
											'children': [
												{
													'input': {
														'class': 	'form-check-input',
														'type': 	'radio',
														'id': 		'modalIsKeepDataNewest1',
														'name': 	'modalIsKeepDataNewest',
														'value': 	'false'
													}
												},
												{
													'label': {
														'class': 	'form-check-label',
														'for': 		'modalIsKeepDataNewest1',
														'text': 	'維持當次帶入資料'
													}
												}
											]
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
					'class': 	'form-group is-show-div row hide',
					'children': [
						{
							'label': {
								'class': 	'col-sm-3 col-form-label',
								'text': 	'勾選模式'
							}
						},
						{
							'div': {
								'class': 	'col-sm-9 row',
								'children': [
									{
										'div': {
											'class': 	'form-check-inline',
											'children': [
												{
													'input': {
														'class': 	'form-check-input',
														'type': 	'radio',
														'id': 		'modalCheckType0',
														'name': 	'modalCheckType',
														'value': 	'checkBox'
													}
												},
												{
													'label': {
														'class': 	'form-check-label',
														'for': 		'modalCheckType0',
														'text': 	'複選框'
													}
												}
											]
										}
									},
									{
										'div': {
											'class': 	'form-check-inline',
											'children': [
												{
													'input': {
														'class': 	'form-check-input',
														'type': 	'radio',
														'id': 		'modalCheckType1',
														'name': 	'modalCheckType',
														'value': 	'radio'
													}
												},
												{
													'label': {
														'class': 	'form-check-label',
														'for': 		'modalCheckType1',
														'text': 	'單選框'
													}
												}
											]
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
					'class': 	'form-group import-external-data row hide',
					'children': [
						{
							'label': {
								'class': 	'col-sm-3 col-form-label',
								'text': 	'設定參數'
							}
						},
						{
							'div': {
								'class': 	'col-sm-9 row',
								'children': [
									{
										'button': {
											'class': 	'btn btn-primary skip',
											'type':  	'button',
											'text': 	'新增參數',
											'id': 		'addParam'
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
					'class': 'col-12 send-param-edit send-param-row row hide',
					'children': [
						{
							'div': {
								'class': 'col-3 bg-dark',
								'children': [
									{
										'label': {
											'class': 'text-light',
											'text': '參數名稱'
										}
									}
								]
							}
						},
						{
							'div': {
								'class': 'col-4 bg-dark',
								'children': [
									{
										'label': {
											'class': 'text-light',
											'text': '參數類型'
										}
									}
								]
							}
						},
						{
							'div': {
								'class': 'col-5 bg-dark',
								'children': [
									{
										'label': {
											'class': 'text-light',
											'text': '參數值'
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
					'class': 	'col-12 import-external-data',
					'id': 		'paramList',
					'children': [ ]
				}
			}
		]
	}
}

const adjustOptionsDataRow = {
	'tr': {
		'children': [
			{
				'td': {
					"scope": 	"col",
					"class": 	"text-center sort-column",
					"text": 	"1"
				}
			},
			{
				'td': {
					"scope": 	"col",
					"class": 	"text-center canEditDiv desc-column",
					"text": 	"選項"
				}
			},
			{
				'td': {
					"scope": 	"col",
					"class": 	"text-center canEditDiv value-column",
					"text": 	"1"
				}
			},
			{
				'td': {
					"scope": 	"col",
					"class": 	"text-center canEditDiv score-column",
					"text": 	""
				}
			},
			{
				'td': {
					"scope": 	"col",
					"class": 	"text-center canEditDiv default-column",
					"children": [
						{
							"input": {
								"type": "checkbox",
								"name": "defaultCheck",
								"style": "transform: scale(2);"
							}
						}
					]
				}
			},
			{
				'td': {
					"scope": 	"col",
					"class": 	"text-center guid-column",
					"text": 	""
				}
			}
		]
	}
}

const adjustOptionsTabContent = [
	{
		'div': {
			'class': 	'col-sm-12 input-group form-type-group toggle-block',
			'style': 	'padding: 1rem 0',
			'children': [
				{
					'label': {
						'class': 	'col-md-1 col-form-label text-center toggle-switch',
						'text': 	'元件：'
					}
				},
				{
					'select': {
						'class':        'form-control toggle-switch',
						'name': 		'modalBeanSelect',
						'children': 	[
							{
								'option': {
									'value': 	'0',
									'text': 	'請選擇'
								}
							}
						]
					}
				},
				{
					'label': {
						'class': 	'col-md-1 col-form-label text-center toggle-switch hide',
						'text': 	'元件名稱：'
					}
				},
				{
					'input': {
						'class': 		'form-control toggle-switch hide',
						'type':  		'text',
						'name': 		'modalBeanName',
						'placeholder': 	'beanName'
					}
				},
				{
					'label': {
						'class': 	'col-md-1 col-form-label text-center toggle-switch hide',
						'text': 	'元件標題：'
					}
				},
				{
					'input': {
						'class': 		'form-control toggle-switch hide',
						'type':  		'text',
						'name': 		'modalBeanTitle',
						'placeholder': 	'中文標題'
					}
				},
				{
					'label': {
						'class': 	'col-md-1 col-form-label text-center toggle-switch hide',
						'text': 	'元件類型：'
					}
				},
				{
					'select': {
						'class':        'form-control toggle-switch hide',
						'name': 		'modalBeanControlType',
						'children': 	[
							{
								'option': {
									'value': 	'0',
									'text': 	'請選擇'
								}
							},
							{
								'option': {
									'value': 	'checkbox',
									'text': 	'多選框'
								}
							},
							{
								'option': {
									'value': 	'radio',
									'text': 	'單選框'
								}
							},
							{
								'option': {
									'value': 	'select',
									'text': 	'下拉框'
								}
							}
						]
					}
				},
				{
					'button': {
						'class': 	'btn btn-secondary',
						'type': 	'button',
						'name': 	'modalSwitchButton',
						'children': [
							{
								'i': {
									'class': 'bi bi-arrow-left-right'
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
			'class': 'col-12 table-block',
			'style': 'display: flex',
			'children': [
				{
					"table": {
						"class": 	"table-fixed table table-striped table-bordered",
						"name": 	"optionsTable",
						"children": [
							{
								'thead': {
									'children': [
										{
											'tr': {
												'children': [
													{
														'th': {
															"scope": 	"col",
															"class": 	"text-center",
															"text": 	"排序"
														}
													},
													{
														'th': {
															"scope": 	"col",
															"class": 	"text-center",
															"text": 	"選項名稱*"
														}
													},
													{
														'th': {
															"scope": 	"col",
															"class": 	"text-center",
															"text": 	"選項值*"
														}
													},
													{
														'th': {
															"scope": 	"col",
															"class": 	"text-center",
															"text": 	"計分項目(可選)"
														}
													},
													{
														'th': {
															"scope": 	"col",
															"class": 	"text-center",
															"text": 	"預設選取(可選)"
														}
													},
													{
														'th': {
															"scope": 	"col",
															"class": 	"text-center",
															"text": 	"GUID(無法調整)"
														}
													}
												]
											}
										}
									]
								}
							},
							{
								'tbody': {
									
								}
							}
						]
					}
				},
				{
					'div': {
						'class': 'button-block d-flex flex-column',
						'style': 'width: 10rem; padding: 0 1rem;',
						'children': [
							{
								'button': {
									'class': 	'btn btn-primary',
									'style': 	'margin-bottom: .3rem',
									'type':  	'button',
									'text': 	'新增選項',
									'name': 	'addOption'
								}
							},
							{
								'button': {
									'class': 	'btn btn-danger',
									'style': 	'margin-bottom: .3rem',
									'type':  	'button',
									'text': 	'移除選項',
									'name': 	'removeOption',
									'disabled': 'true'
								}
							},
							{
								'button': {
									'class': 	'btn btn-info',
									'style': 	'margin-bottom: .3rem',
									'type':  	'button',
									'text': 	'還原選項',
									'name': 	'returnOption',
									'disabled': 'true'
								}
							},
							{
								'button': {
									'class': 	'btn btn-light',
									'style': 	'margin-bottom: .3rem',
									'type':  	'button',
									'text': 	'剪下',
									'name': 	'cutOption',
									'disabled': 'true'
								}
							},
							{
								'button': {
									'class': 	'btn btn-light',
									'style': 	'margin-bottom: .3rem',
									'type':  	'button',
									'text': 	'貼上',
									'name': 	'pasteOption',
									'disabled': 'true'
								}
							},
							{
								'button': {
									'class': 	'btn btn-secondary',
									'style': 	'margin-bottom: .3rem',
									'type':  	'button',
									'text': 	'',
									'name': 	'optionUp',
									'disabled': 'true',
									'children': [
										{
											'i': {
												'class': 'bi bi-arrow-up'
											}
										}
									]
								}
							},
							{
								'button': {
									'class': 	'btn btn-secondary',
									'type':  	'button',
									'text': 	'',
									'name': 	'optionDown',
									'disabled': 'true',
									'children': [
										{
											'i': {
												'class': 'bi bi-arrow-down'
											}
										}
									]
								}
							}
						]
					}
				}
			]
		}
	}
]

const adjustOptionsBody = {
	"div": {
		"class": 	"tab-content-block",
		"children": [
			{
				"div": {
					"class": "tab-menu",
					"children": [
						{
							"ul": {
								"class": 	"nav nav-tabs",
								"id": 		"tabs",
								"role": 	"tablist",
								"children": [
									{
										"li": {
											"class": 	"nav-item",
											"children": [
												{
													"a": {
														"class": 			"nav-link active",
														"id": 				"tabOptionTag1",
														"href": 			"#optionTab1",
														"role": 			"tab",
														"aria-controls": 	"optionTab1",
														"aria-selected": 	"true",
														"data-toggle": 		"tab",
														"text": 			"頁籤"
													}
												}
											]
										}
									},
									{
										"li": {
											"class": 	"nav-item add-nav-item",
											"children": [
												{
													"a": {
														"class": 			"nav-link",
														"id": 				"plus-tab",
														"aria-selected": 	"false",
														"text": 			"+"
													}
												}
											]
										}
									}
								]
							},
						}
					]
				}
			},
			{
				"div": {
					"class": 	"tab-content border flex-fill",
					"id": 		"tabContent",
					"children": [
						{
							"div": {
								"class": 			"tab-pane h-100 fade show active",
								"id": 				"optionTab1",
								"role": 			"tabpanel",
								"aria-labelledby": 	"tabOptionTag1",
								"children": adjustOptionsTabContent
							}
						}
					]
				}
			}
		]
	}
}

const exportConfirmBody = {
	"form": {
		"onsubmit": "return false",
		"children": [
			{
				'div': {
					'class': 	'form-group row add-row hide',
					'children': [
						{
							'label': {
								'class': 	'col-sm-3 col-form-label',
								'text': 	'新增頁調整描述'
							}
						},
						{
							'div': {
								'class': 	'col-sm-9',
								'children': [
									{
										'input': {
											'type':         'text',
											'class':        'form-control',
											'id':           'modalAddDescription',
											'name': 		'modalAddDescription',
											'placeholder':  '新增頁調整.....'
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
					'class': 	'form-group row app-add-row hide',
					'children': [
						{
							'label': {
								'class': 	'col-sm-3 col-form-label',
								'text': 	'新增頁(App版)調整描述'
							}
						},
						{
							'div': {
								'class': 	'col-sm-9',
								'children': [
									{
										'input': {
											'type':         'text',
											'class':        'form-control',
											'id':           'modalAppAddDescription',
											'name': 		'modalAppAddDescription',
											'placeholder':  '新增頁(App版)調整.....'
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
					'class': 	'form-group row list-row hide',
					'children': [
						{
							'label': {
								'class': 	'col-sm-3 col-form-label',
								'text': 	'清單頁調整描述'
							}
						},
						{
							'div': {
								'class': 	'col-sm-9',
								'children': [
									{
										'input': {
											'type':         'text',
											'class':        'form-control',
											'id':           'modalListDescription',
											'name': 		'modalListDescription',
											'placeholder':  '清單頁調整.....'
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
					'class': 	'form-group row app-list-row hide',
					'children': [
						{
							'label': {
								'class': 	'col-sm-3 col-form-label',
								'text': 	'清單頁(App版)調整描述'
							}
						},
						{
							'div': {
								'class': 	'col-sm-9',
								'children': [
									{
										'input': {
											'type':         'text',
											'class':        'form-control',
											'id':           'modalAppListDescription',
											'name': 		'modalAppListDescription',
											'placeholder':  '清單頁(App版)調整.....'
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
					'class': 	'form-group row print-row hide',
					'children': [
						{
							'label': {
								'class': 	'col-sm-3 col-form-label',
								'text': 	'列印頁調整描述'
							}
						},
						{
							'div': {
								'class': 	'col-sm-9',
								'children': [
									{
										'input': {
											'type':         'text',
											'class':        'form-control',
											'id':           'modalPrintDescription',
											'name': 		'modalPrintDescription',
											'placeholder':  '列印頁調整.....'
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
					'class': 	'form-group row print-old-row hide',
					'children': [
						{
							'label': {
								'class': 	'col-sm-3 col-form-label',
								'text': 	'列印頁(舊版)調整描述'
							}
						},
						{
							'div': {
								'class': 	'col-sm-9',
								'children': [
									{
										'input': {
											'type':         'text',
											'class':        'form-control',
											'id':           'modalPrintOldDescription',
											'name': 		'modalPrintOldDescription',
											'placeholder':  '列印頁(舊版)調整.....'
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
					'class': 	'form-group row',
					'children': [
						{
							'label': {
								'class': 	'col-sm-3 col-form-label',
								'text': 	'啟用狀態'
							}
						},
						{
							'div': {
								'class': 	'col-sm-9 row',
								'children': [
									{
										'div': {
											'class': 	'form-check-inline',
											'children': [
												{
													'input': {
														'class': 	'form-check-input',
														'type': 	'radio',
														'id': 		'modalTemplateStatus0',
														'name': 	'modalTemplateStatus',
														'value': 	'0'
													}
												},
												{
													'label': {
														'class': 	'form-check-label',
														'for': 		'modalTemplateStatus0',
														'text': 	'非正式(暫存)'
													}
												}
											]
										}
									},
									{
										'div': {
											'class': 	'form-check-inline',
											'children': [
												{
													'input': {
														'class': 	'form-check-input',
														'type': 	'radio',
														'id': 		'modalTemplateStatus1',
														'name': 	'modalTemplateStatus',
														'value': 	'1'
													}
												},
												{
													'label': {
														'class': 	'form-check-label',
														'for': 		'modalTemplateStatus1',
														'text': 	'正式'
													}
												}
											]
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
					'class': 	'form-group row',
					'children': [
						{
							'label': {
								'class': 	'col-sm-3 col-form-label',
								'text': 	'匯出選擇'
							}
						},
						{
							'div': {
								'class': 	'col-sm-9 row',
								'children': [
									{
										'div': {
											'class': 	'form-check-inline',
											'children': [
												{
													'input': {
														'class': 	'form-check-input',
														'type': 	'radio',
														'id': 		'modalTemplateType0',
														'name': 	'modalTemplateType',
														'value': 	'0',
														'checked': 	'true'
													}
												},
												{
													'label': {
														'class': 	'form-check-label',
														'for': 		'modalTemplateType0',
														'text': 	'一般匯出'
													}
												}
											]
										}
									},
									{
										'div': {
											'class': 	'form-check-inline',
											'children': [
												{
													'input': {
														'class': 	'form-check-input',
														'type': 	'radio',
														'id': 		'modalTemplateType1',
														'name': 	'modalTemplateType',
														'value': 	'1'
													}
												},
												{
													'label': {
														'class': 	'form-check-label',
														'for': 		'modalTemplateType1',
														'text': 	'特殊三總舊版xml'
													}
												}
											]
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
					'class': 	'form-group row form-version-block hide',
					'children': [
						{
							'textarea': {
								'class': 'col-12',
								'id': 'formVersion',
								'name': 'formVersion'
							}
						}
					]
				}
			}
		]
	}
}

/** 元件計分彈出視窗內文區塊 */
const scoreScriptBody = {
	"form": {
		"onsubmit": "return false",
		"children": [
			{
				'div': {
					'class': 	'form-group row',
					'children': [
						{
							'label': {
								'class': 	'col-sm-3 col-form-label',
								'text': 	'計分元件名稱(En)'
							}
						},
						{
							'div': {
								'class': 	'col-sm-9',
								'children': [
									{
										'input': {
											'type':         'text',
											'class':        'form-control',
											'id':           'modalScoreBeanName',
											'name': 		'modalScoreBeanName',
											'placeholder':  'beanName'
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
					'class': 	'form-group row',
					'children': [
						{
							'label': {
								'class': 	'col-sm-3 col-form-label',
								'text': 	'計分元件標題(zh)'
							}
						},
						{
							'div': {
								'class': 	'col-sm-9',
								'children': [
									{
										'input': {
											'type':         'text',
											'class':        'form-control',
											'id':           'modalScoreBeanTitle',
											'name': 		'modalScoreBeanTitle',
											'placeholder':  '元件中文標題',
											'value': 		'總分'
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
					'class': 	'form-group row',
					'children': [
						{
							'label': {
								'class': 	'col-sm-3 col-form-label',
								'text': 	'分數條件'
							}
						},
						{
							'div': {
								'class': 	'col-sm-9',
								'children': [
									{
										'button': {
											'class': 	'btn btn-primary',
											'type':  	'button',
											'text': 	'新增條件',
											'id': 		'addRuleBtn'
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
					'class': 	'col-12',
					'id': 		'ruleList',
					'children': [ ]
				}
			}
		]
	}
}

/** 元件差異彈出視窗內文區塊 */
const beanDifferentBody = {
	"table": {
		"class": 	"table table-striped table-borderless",
		"children": [
			{
				"thead": {
					"children": [
						{
							"tr": {
								"class": "table-info",
								"children": [
									{
										"th": {
											"scope": 	"col",
											"class": 	"text-center",
											"children": [
												{
													"button": {
														"class": 	"btn btn-primary",
														"type":  	"button",
														"text":  	"全選",
														"onclick": 	"$('.modal table tbody').find('tr').addClass('active')"
													}
												}
											]
										}
									},
									{
										"th": {
											"scope": 	"col",
											"class": 	"text-center",
											"text": 	"元件英文名稱(beanName)"
										}
									},
									{
										"th": {
											"scope": 	"col",
											"class": 	"text-center",
											"text": 	"元件中文名稱(beanTitle)"
										}
									},
									{
										"th": {
											"scope": 	"col",
											"class": 	"text-center",
											"text": 	"狀態"
										}
									},
									{
										"th": {
											"scope": 	"col",
											"class": 	"text-center",
											"text": 	"功能"
										}
									}
								]
							}
						}
					]
				}
			},
			{
				"tbody": {
					"children": [ ]
				}
			}
		]
	}
}

/** API選擇器 */
const apiSelect = {
	'select': {
		'class':        'form-control',
		'id':           'modalApiSelectName',
		'name': 		'modalApiSelectName',
		'children': 	[
			{
				'option': {
					'value': 	'0',
					'text': 	'請選擇'
				}
			},
			{
				'optgroup': {
					'label': 	'表單前帶值',
					'children': []
				}
			},
			{
				'optgroup': {
					'label': 	'表單中查詢',
					'children': []
				}
			},
			{
				'optgroup': {
					'label': 	'表單後拋轉',
					'children': []
				}
			},
			{
				'optgroup': {
					'label': 	'表單正式保存後拋轉',
					'children': []
				}
			},
			{
				'optgroup': {
					'label': 	'表單刪除後拋轉',
					'children': []
				}
			},
			{
				'optgroup': {
					'label': 	'表單正式刪除後拋轉',
					'children': []
				}
			}
		]
	}
}

/** API 輸入參數區塊 */
const apiSendParamBlock = {
	'div': {
		'class': 	'form-group row',
		'children': [
			{
				'label': {
					'class': 	'col-sm-3 col-form-label',
					'text': 	'輸入參數'
				}
			},
			{
				'div': {
					'class':	'col-sm-9',
					'children': [
						{
							'div': {
								'class': 	'form-row-div',
								'children': [
									{
										'div': {
											'class': 	'form-check-inline',
											'children': [
												{
													'input': {
														'class': 	'form-check-input edit-checkbox',
														'type': 	'checkbox',
														'id': 		'modalSendParamEditBox',
														'name': 	'modalSendParamEditBox',
														'value': 	'1',
														'data-tar': '#modalSendTable'
													}
												},
												{
													'label': {
														'class': 	'form-check-label',
														'for': 		'modalSendParamEditBox',
														'text': 	'編輯'
													}
												}
											]
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
					'class': 	'col-sm-12 send-param-edit row hide',
					'id': 		'modalSendTable',
					'children': [
						{
							'div': {
								'class': 	'col-sm-12 row',
								'children': [
									{
										'div': {
											'class': 	'col-sm-3 bg-dark',
											'children': [
												{
													'label': {
														'class': 'text-light',
														'text': '輸入參數名稱'
													}
												}
											]
										}
									},
									{
										'div': {
											'class': 	'col-sm-3 bg-dark',
											'children': [
												{
													'label': {
														'class': 'text-light',
														'text': '來源參數'
													}
												}
											]
										}
									},
									{
										'div': {
											'class': 	'col-sm-6 bg-dark',
											'children': [
												{
													'label': {
														'class': 'text-light',
														'text': '設定參數規則'
													}
												}
											]
										}
									}
								]
							}
						}
					]
				}
			}
		]
	}
}

/** 新增 Api 彈出視窗內容 */
const apiAddBody = {
	"form": {
		"onsubmit": "return false",
		"children": [
			{
				'div': {
					'class': 	'form-group row',
					'children': [
						{
							'label': {
								'class': 	'col-sm-3 col-form-label',
								'text': 	'選擇API'
							}
						},
						{
							'div': {
								'class': 	'col-sm-7 toggle-block',
								'children': [
									apiSelect
								]
							}
						}
					]
				}
			},
			apiSendParamBlock,
			{
				'div': {
					'class': 	 'form-group row modal-advance-api',
					'data-type': 'F,M',
					'children':  [
						{
							'label': {
								'class': 	'col-sm-3 col-form-label',
								'text': 	'輸出參數'
							}
						},
						{
							'div': {
								'class':	'col-sm-9',
								'children': [
									{
										'div': {
											'class': 	'form-row-div',
											'children': [
												{
													'div': {
														'class': 	'form-check-inline',
														'children': [
															{
																'input': {
																	'class': 	'form-check-input edit-checkbox',
																	'type': 	'checkbox',
																	'id': 		'modalReceiveParamEditBox',
																	'name': 	'modalReceiveParamEditBox',
																	'value': 	'1',
																	'data-tar': '#modalReceiveTable'
																}
															},
															{
																'label': {
																	'class': 	'form-check-label',
																	'for': 		'modalReceiveParamEditBox',
																	'text': 	'編輯'
																}
															}
														]
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
								'class': 	'col-sm-12 receive-param-edit row hide',
								'id': 		'modalReceiveTable',
								'children': [
									{
										'div': {
											'class': 	'col-sm-12 row',
											'children': [
												{
													'div': {
														'class': 	'col-sm-3 bg-dark',
														'children': [
															{
																'label': {
																	'class': 'text-light',
																	'text': '輸出參數名稱'
																}
															}
														]
													}
												},
												{
													'div': {
														'class': 	'col-sm-3 bg-dark',
														'children': [
															{
																'label': {
																	'class': 'text-light',
																	'text': '對應元件'
																}
															}
														]
													}
												},
												{
													'div': {
														'class': 	'col-sm-5 bg-dark',
														'children': [
															{
																'label': {
																	'class': 'text-light',
																	'text': '設定參數規則'
																}
															}
														]
													}
												},
												{
													'div': {
														'class': 	'col-sm-1 bg-dark',
														'children': [
															{
																'label': {
																	'class': 'text-light',
																	'text': ''
																}
															}
														]
													}
												}
											]
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
					'class': 	'form-group row',
					'children': [
						{
							'label': {
								'class': 	'col-sm-3 col-form-label',
								'text': 	'綁定元件'
							}
						},
						{
							'div': {
								'class': 	'col-sm-9',
								'children': [
									{
										'div': {
											'class': 	'form-row-div',
											'children': [
												{
													'div': {
														'class': 	'form-check-inline',
														'children': [
															{
																'input': {
																	'class': 	'form-check-input',
																	'type': 	'checkbox',
																	'id': 		'modalAutoCreate',
																	'name': 	'modalCombineBean',
																	'disabled': 'disabled',
																	'value': 	'1'
																}
															},
															{
																'label': {
																	'class': 	'form-check-label',
																	'for': 		'modalAutoCreate',
																	'text': 	'自動生成元件'
																}
															}
														]
													}
												},
												{
													'div': {
														'class': 	'form-check-inline modal-advance-api',
														'children': [
															{
																'input': {
																	'class': 	'form-check-input',
																	'type': 	'checkbox',
																	'id': 		'modalGFormStructure',
																	'name': 	'modalCombineBean',
																	'value': 	'2'
																}
															},
															{
																'label': {
																	'class': 	'form-check-label',
																	'for': 		'modalGFormStructure',
																	'text': 	'組成 GForm 結構'
																}
															}
														]
													}
												},
												{
													'div': {
														'class': 	'form-check-inline modal-advance-api',
														'children': [
															{
																'input': {
																	'class': 	'form-check-input',
																	'type': 	'checkbox',
																	'id': 		'modalAutoSetValue',
																	'name': 	'modalCombineBean',
																	'value': 	'3'
																}
															},
															{
																'label': {
																	'class': 	'form-check-label',
																	'for': 		'modalAutoSetValue',
																	'text': 	'自動賦值'
																}
															}
														]
													}
												}
											]
										}
									}
								]
							}
						}
					]
				}
			}
		]
	}
}

/** Query List 新增對照組彈出視窗內容 */
const qlAddParamComparison = {
	"form": {
		"onsubmit": "return false",
		"children": [
			{
				'div': {
					'class': 	'form-group row',
					'children': [
						{
							'div': {
								'class': 	'col-sm-12',
								'children': [
									{
										'button': {
											'class': 	'btn btn-primary',
											'type':  	'button',
											'text': 	'新增對照組',
											'id': 		'addParamRow'
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
					'class': 	'col-12',
					'id': 		'paramRowList',
					'children': [ ]
				}
			}
		]
	}
}

/** Query List 新增對照組列 */
const qlAddParamRowElemental = {
	'div': {
		'class': 	'col-12 row form-group ruleRow',
		'children': [
			{
				'div': {
					'class': 	'col-md-2 text-center',
					'children': [
						{
							'button': {
								'class': 	'btn btn-danger',
								'type':  	'button',
								'onclick': 	'$(this).parent().parent().remove()',
								'children': [
									{
										'i': {
											'class': 'bi bi-x',
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
					'class': 	'col-md-5',
					'children': [
						{
							'input': {
								'type': 		'text',
								'class': 		'form-control',
								'placeholder': 	'參數值',
								'name': 		'modalInParam',
							}
						}
					]
				}
			},
			{
				'div': {
					'class': 	'col-md-5',
					'children': [
						{
							'input': {
								'type': 		'text',
								'class': 		'form-control',
								'placeholder': 	'顯示值',
								'name': 		'modalOutParam',
							}
						}
					]
				}
			}
		]
	}
}

/** Query List 新增腳本彈出視窗內容 */
const qlButtonAddScriptBody = {
	"form": {
		"onsubmit": "return false",
		"children": [
			{
				'div': {
					'class': 	'form-group row',
					'children': [
						{
							'label': {
								'class': 	'col-sm-3 col-form-label',
								'text': 	'選擇類型'
							}
						},
						{
							'div': {
								'class': 	'col-sm-7 toggle-block',
								'children': [
									{
										'select': {
											'class':        'form-control',
											'id':           'modalScriptTypeSelect',
											'name': 		'modalScriptTypeSelect',
											'children': 	[
												{
													'option': {
														'value': 	'0',
														'text': 	'請選擇'
													}
												},
												{
													'option': {
														'value': 	'guide',
														'text': 	'導頁'
													}
												},
												{
													'option': {
														'value': 	'group',
														'text': 	'選項群組'
													}
												}
											]
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
					'class': 	'form-group set-row guide row hide',
					'children': [
						{
							'label': {
								'class': 	'col-sm-3 col-form-label',
								'text': 	'導頁規則'
							}
						},
						{
							'div': {
								'class': 	'col-sm-7 toggle-block',
								'children': [
									{
										'select': {
											'class':        'form-control',
											'id':           'modalGuideRuleSelect',
											'name': 		'modalGuideRuleSelect',
											'children': 	[
												{
													'option': {
														'value': 	'0',
														'text': 	'請選擇'
													}
												},
												{
													'option': {
														'value': 	'none',
														'text': 	'無條件'
													}
												}
											]
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
					'class': 	'form-group set-row-second rule row hide',
					'children': [
						{
							'label': {
								'class': 	'col-sm-3 col-form-label',
								'text': 	'添加腳本'
							}
						},
						{
							'div': {
								'class': 	'col-sm-7 toggle-block',
								'children': [
									{
										'button': {
											'class': 'btn btn-primary',
											'type':  'button',
											'id': 	 'modalAddRuleButton',
											'text':  '新增'
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
					'class': 	'col-12',
					'id': 		'ruleRowList',
					'children': [ ]
				}
			},
			{
				'div': {
					'class': 	'form-group group row hide',
					'children': [
						{
							'label': {
								'class': 	'col-sm-3 col-form-label',
								'text': 	'上層元件'
							}
						},
						{
							'div': {
								'class': 	'col-sm-7 toggle-block',
								'children': [
									{
										'select': {
											'class':        'form-control',
											'id':           'modalGroupComponentSelect',
											'name': 		'modalGroupComponentSelect',
											'children': 	[ ]
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
					'class': 	'col-12',
					'id': 		'groupRowList',
					'children': [ ]
				}
			}
		]
	}
}

/** Query List 新增腳本添加腳本列 */
const qlButtonAddScriptRowElemental = {
	"div": {
		'class': 'col-sm-12 row form-group ruleRow',
		'children': [
			{
				'div': {
					'class': 	'col-md-1 text-center form-group',
					'children': [
						{
							'button': {
								'class': 	'btn btn-danger',
								'type':  	'button',
								'onclick': 	'$(this).parent().parent().remove()',
								'children': [
									{
										'i': {
											'class': 'bi bi-x',
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
					'class': 	'col-md-2 form-group text-center has-rule hide',
					'children': [
						{
							'input': {
								'class': 	'form-control',
								'type':  	'text',
								'name': 	'modalRuleParamInput',
								'id': 		'modalRuleParamInput',
								'placeholder': '條件值'
							}
						}
					]
				}
			},
			{
				'div': {
					'class': 	'col-md-2 form-group text-center',
					'children': [
						{
							'select': {
								'class':        'form-control',
								'id':           'modalGuideTargetSelect',
								'name': 		'modalGuideTargetSelect',
								'children': 	[
									{
										'option': {
											'value': 	'default',
											'text': 	'預設'
										}
									},
									{
										'option': {
											'value': 	'_blank',
											'text': 	'開新分頁/視窗'
										}
									},
									{
										'option': {
											'value': 	'_top',
											'text': 	'整頁'
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
					'class': 	'col-md-2 form-group text-center',
					'children': [
						{
							'select': {
								'class':        'form-control',
								'id':           'modalGuideTypeSelect',
								'name': 		'modalGuideTypeSelect',
								'children': 	[
									{
										'option': {
											'value': 	'0',
											'text': 	'請選擇'
										}
									},
									{
										'option': {
											'value': 	'url',
											'text': 	'網址'
										}
									},
									{
										'option': {
											'value': 	'form',
											'text': 	'表單'
										}
									},
									{
										'option': {
											'value': 	'system',
											'text': 	'系統'
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
					'class': 	'col-md-3 form-group url system type-row text-center hide',
					'children': [
						{
							'input': {
								'class':        'form-control',
								'type': 		'text',
								'id':           'modalURLInput',
								'name': 		'modalURLInput'
							}
						}
					]
				}
			},
			{
				'div': {
					'class': 	'col-md-2 form-group url system type-row text-left hide',
					'children': [
						{
							'button': {
								'class': 'btn btn-primary',
								'type':  'button',
								'id': 	 'modalURLAddParamButton',
								'text':  '添加條件'
							}
						}
					]
				}
			},
			{
				'div': {
					'class': 	'col-md-12 url system type-row hide',
					'id': 		'URLParamRowList',
					'children': []
				}
			},
			{
				'div': {
					'class': 	'col-md-12 form-group form type-row text-center row no-padding hide',
					'children': [
						{
							'div': {
								'class': 	'col-sm-5 toggle-block',
								'children': [
									{
										'label': {
											'class': 'col-form-label',
											'text': '表單名稱'
										}
									}
								]
							}
						},
						{
							'div': {
								'class': 	'col-sm-2 toggle-block',
								'children': [
									{
										'label': {
											'class': 'col-form-label',
											'text': '表單類型'
										}
									}
								]
							}
						},
						{
							'div': {
								'class': 	'col-sm-3 toggle-block',
								'children': [
									{
										'label': {
											'class': 'col-form-label',
											'text': '來源編號(sourceId)'
										}
									}
								]
							}
						},
						{
							'div': {
								'class': 	'col-sm-2 upd print print2 toggle-block',
								'children': [
									{
										'label': {
											'class': 'col-form-label',
											'text': '表單(formId)'
										}
									}
								]
							}
						},
						{
							'div': {
								'class': 	'col-sm-5 toggle-block',
								'children': [
									{
										'select': {
											'class':        'form-control',
											'id':           'modalFormSelect',
											'name': 		'modalFormSelect',
											'children': 	[
												{
													"option": {
														"value": "0",
														"text": "請選擇"
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
								'class': 	'col-sm-2 toggle-block',
								'children': [
									{
										'select': {
											'class':        'form-control',
											'id':           'modalFormTypeSelect',
											'name': 		'modalFormTypeSelect',
											'children': 	[
												{
													"option": {
														"value": "add",
														"text": "新增頁"
													}
												},
												{
													"option": {
														"value": "upd",
														"text": "更新頁"
													}
												},
												{
													"option": {
														"value": "list",
														"text": "清單頁"
													}
												},
												{
													"option": {
														"value": "print",
														"text": "列印頁(舊)"
													}
												},
												{
													"option": {
														"value": "print2",
														"text": "列印頁(新)"
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
								'class': 	'col-sm-3 input-group form-type-group toggle-block',
								'children': [
									{
										'select': {
											'class':        'form-control toggle-switch',
											'id':           'modalFormSourceSelect',
											'name': 		'modalFormSourceSelect',
											'children': 	[
												{
													'option': {
														'value': 	'0',
														'text': 	'請選擇'
													}
												}
											]
										}
									},
									{
										'input': {
											'class': 	'form-control toggle-switch hide',
											'type':  	'text',
											'name': 	'modalFormSourceValue',
											'id': 		'modalFormSourceValue'
										}
									},
									{
										'button': {
											'class': 	'btn btn-secondary',
											'type': 	'button',
											'id': 		'modalSwitchButton',
											'children': [
												{
													'i': {
														'class': 'bi bi-arrow-left-right'
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
								'class': 	'col-sm-2 form-id-select upd print print2 toggle-block',
								'children': [
									{
										'select': {
											'class':        'form-control',
											'id':           'modalFormIdSelect',
											'name': 		'modalFormIdSelect',
											'children': 	[
												{
													"option": {
														"value": "0",
														"text": "請選擇"
													}
												}
											]
										}
									}
								]
							}
						}
					]
				}
			}
		]
	}
}

/** Query List 新增腳本添加網址參數列 */
const qlURLParamRowElemental = {
	"div": {
		'class': 'col-sm-12 row form-group paramRow',
		'children': [
			{
				'div': {
					'class': 	'col-md-1 text-center',
					'children': [
						{
							'button': {
								'class': 	'btn btn-danger',
								'type':  	'button',
								'onclick': 	'$(this).parent().parent().remove()',
								'children': [
									{
										'i': {
											'class': 'bi bi-x',
										}
									}
								]
							}
						}
					]
				}
			},
			{
				'label': {
					'class': 	'col-md-1 col-form-label text-center',
					'text': 	'參數名稱'
				}
			},
			{
				'div': {
					'class': 	'col-md-3 text-center',
					'children': [
						{
							'input': {
								'class': 	'form-control',
								'type':  	'text',
								'name': 	'modalURLParamInput',
								'id': 		'modalURLParamInput',
								'placeholder': '參數名稱'
							}
						}
					]
				}
			},
			{
				'label': {
					'class': 	'col-md-1 col-form-label text-center',
					'text': 	'參數值'
				}
			},
			{
				'div': {
					'class': 	'col-md-4 input-group text-center',
					'children': [
						{
							'select': {
								'class':        'form-control toggle-switch',
								'id':           'modalURLParamSelect',
								'name': 		'modalURLParamSelect',
								'children': 	[
									{
										'option': {
											'value': 	'0',
											'text': 	'請選擇'
										}
									}
								]
							}
						},
						{
							'input': {
								'class': 	'form-control toggle-switch hide',
								'type':  	'text',
								'name': 	'modalURLParamValue',
								'id': 		'modalURLParamValue',
								'placeholder': '參數值'
							}
						},
						{
							'button': {
								'class': 	'btn btn-secondary',
								'type': 	'button',
								'id': 		'modalSwitchButton',
								'children': [
									{
										'i': {
											'class': 'bi bi-arrow-left-right'
										}
									}
								]
							}
						}
					]
				}
			}
		]
	}
}

const flexColElemental = {
	'div': {
		'class': 'p-2 flex-fill',
		'data-role': 'drag-drop-container',
		'text':'&nbsp;'
	}
}

const flexRowElemental={
	'div': {
		'class': 'd-flex flex-row',
		'children': [
			flexColElemental
		]
	}
}

/** xml 模板新增腳本彈出視窗內容 */
const xmlTemplateAddScriptBody = {
	"form": {
		"onsubmit": "return false",
		"children": [
			{
				'div': {
					'class': 	'form-group row',
					'children': [
						{
							'label': {
								'class': 	'col-sm-3 col-form-label',
								'text': 	'腳本敘述'
							}
						},
						{
							'div': {
								'class': 	'col-sm-7 toggle-block',
								'children': [
									{
										'input': {
											'class':        'form-control',
											'id':           'modalScript',
											'name': 		'modalScript'
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
					'class': 	'form-group row',
					'children': [
						{
							'label': {
								'class': 	'col-sm-3 col-form-label',
								'text': 	'腳本'
							}
						},
						{
							'div': {
								'class': 	'col-sm-9',
								'children': [
									{
										'button': {
											'class': 	'btn btn-primary',
											'type':  	'button',
											'text': 	'新增腳本',
											'id': 		'addScriptBtn'
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
					'class': 	'col-12',
					'id': 		'ruleList',
					'children': [

					]
				}
			}
		]
	}
}

/** 輸入框設定驗證規則彈出視窗內容 */
const inputTypeSettingBody = {
	"form": {
		"onsubmit": "return false",
		"children": [
			{
				'div': {
					'class': 	'form-group row',
					'children': [
						{
							'label': {
								'class': 	'col-sm-3 col-form-label',
								'text': 	'選擇類型'
							}
						},
						{
							'div': {
								'class': 	'col-sm-7 toggle-block',
								'children': [
									{
										'select': {
											'class':        'form-control',
											'id':           'modalInputTypeSelect',
											'name': 		'modalInputTypeSelect',
											'children': 	[
												{
													'option': {
														'value': 	'0',
														'text': 	'請選擇'
													}
												},
												{
													'option': {
														'value': 	'number',
														'text': 	'數值'
													}
												},
												{
													'option': {
														'value': 	'pid',
														'text': 	'身分證'
													}
												},
												{
													'option': {
														'value': 	'email',
														'text': 	'E-mail'
													}
												},
												{
													'option': {
														'value': 	'tel',
														'text': 	'電話'
													}
												},
												{
													'option': {
														'value': 	'regex',
														'text': 	'自訂'
													}
												}
											]
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
					'class': 	'form-group set-row number row hide',
					'children': [
						{
							'label': {
								'class': 	'col-sm-3 col-form-label',
								'text': 	'數值類型'
							}
						},
						{
							'div': {
								'class': 	'col-sm-7 toggle-block',
								'children': [
									{
										'div': {
											'class': 	'form-check-inline',
											'children': [
												{
													'input': {
														'class': 	'form-check-input',
														'type': 	'radio',
														'id': 		'modalNumberType0',
														'name': 	'modalNumberType',
														'value': 	'0'
													}
												},
												{
													'label': {
														'class': 	'form-check-label',
														'for': 		'modalNumberType0',
														'text': 	'不限'
													}
												}
											]
										}
									},
									{
										'div': {
											'class': 	'form-check-inline',
											'children': [
												{
													'input': {
														'class': 	'form-check-input',
														'type': 	'radio',
														'id': 		'modalNumberType1',
														'name': 	'modalNumberType',
														'value': 	'1'
													}
												},
												{
													'label': {
														'class': 	'form-check-label',
														'for': 		'modalNumberType1',
														'text': 	'整數'
													}
												}
											]
										}
									},
									{
										'div': {
											'class': 	'form-check-inline',
											'children': [
												{
													'input': {
														'class': 	'form-check-input',
														'type': 	'radio',
														'id': 		'modalNumberType2',
														'name': 	'modalNumberType',
														'value': 	'2'
													}
												},
												{
													'label': {
														'class': 	'form-check-label',
														'for': 		'modalNumberType2',
														'text': 	'小數'
													}
												}
											]
										}
									},
									{
										'div': {
											'class': 	'form-check-inline',
											'children': [
												{
													'input': {
														'class': 	'form-control hide',
														'type': 	'number',
														'id': 		'modalNumberTypeFloat',
														'name': 	'modalNumberTypeFloat',
														'placeholder': '小數點後幾位'
													}
												}
											]
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
					'class': 	'form-group set-row number row hide',
					'children': [
						{
							'label': {
								'class': 	'col-sm-3 col-form-label',
								'text': 	'數值間距'
							}
						},
						{
							'div': {
								'class': 	'col-sm-7 toggle-block',
								'children': [
									{
										'div': {
											'class': 	'form-check-inline',
											'children': [
												{
													'input': {
														'class': 	'form-control',
														'type': 	'number',
														'id': 		'modalNumberMinLimit',
														'name': 	'modalNumberMinLimit',
														'placeholder': '最小值'
													}
												}
											]
										}
									},
									{
										'div': {
											'class': 	'form-check-inline',
											'children': [
												{
													'input': {
														'class': 	'form-control',
														'type': 	'number',
														'id': 		'modalNumberMaxLimit',
														'name': 	'modalNumberMaxLimit',
														'placeholder': '最大值'
													}
												}
											]
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
					'class': 	'form-group set-row pid row hide',
					'children': [
						{
							'label': {
								'class': 	'col-sm-3 col-form-label',
								'text': 	'類型'
							}
						},
						{
							'div': {
								'class': 	'col-sm-7 toggle-block',
								'children': [
									{
										'select': {
											'class':        'form-control',
											'id':           'modalPidSelect',
											'name': 		'modalPidSelect',
											'children': 	[
												{
													'option': {
														'value': 	'origin',
														'text': 	'國民身分證'
													}
												},
												{
													'option': {
														'value': 	'newStyle',
														'text': 	'新式外僑'
													}
												},
												{
													'option': {
														'value': 	'oldStyle',
														'text': 	'舊式外僑'
													}
												},
												{
													'option': {
														'value': 	'cnStyle',
														'text': 	'大陸身分證號'
													}
												}
											]
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
					'class': 	'form-group set-row tel row hide',
					'children': [
						{
							'label': {
								'class': 	'col-sm-3 col-form-label',
								'text': 	'類型'
							}
						},
						{
							'div': {
								'class': 	'col-sm-7 toggle-block',
								'children': [
									{
										'select': {
											'class':        'form-control',
											'id':           'modalTelSelect',
											'name': 		'modalTelSelect',
											'children': 	[
												{
													'option': {
														'value': 	'phone',
														'text': 	'家用(台)'
													}
												},
												{
													'option': {
														'value': 	'cell',
														'text': 	'手機(台)'
													}
												},
												{
													'option': {
														'value': 	'phoneC',
														'text': 	'家用(中)'
													}
												},
												{
													'option': {
														'value': 	'cellC',
														'text': 	'手機(中)'
													}
												}
											]
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
					'class': 	'form-group set-row regex row hide',
					'children': [
						{
							'label': {
								'class': 	'col-sm-3 col-form-label',
								'text': 	'驗證規則'
							}
						},
						{
							'div': {
								'class': 	'col-sm-7 toggle-block',
								'children': [
									{
										'input': {
											'class':        'form-control',
											'type': 		'text',
											'id':           'modalRegexInput',
											'name': 		'modalRegexInput',
											'placeholder': 	'正則表達式。Ex: /[a-Z]/g'											
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
					'class': 	'form-group row',
					'children': [
						{
							'label': {
								'class': 	'col-sm-3 col-form-label',
								'text': 	'錯誤提示文字'
							}
						},
						{
							'div': {
								'class': 	'col-sm-7 toggle-block',
								'children': [
									{
										'input': {
											'class':        'form-control',
											'type': 		'text',
											'id':           'modalWarningText',
											'name': 		'modalWarningText',
											'placeholder': 	'驗證失敗，請輸入正確格式'											
										}
									}
								]
							}
						}
					]
				}
			}
		]
	}
}

/** 列印頁添加表頭彈出視窗表身 */
const printTitleBody = {
	"form": {
		"onsubmit": "return false",
		"children": [
			{
				'div': {
					'class': 	'form-group row',
					'children': [
						{
							'label': {
								'class': 	'col-sm-2 col-form-label',
								'text': 	'欄數'
							}
						},
						{
							'div': {
								'class': 	'col-sm-3',
								'children': [
									{
										'input': {
											'type':         'number',
											'class':        'form-control',
											'id':           'col',
											'value': 		'4'
										}
									}
								]
							}
						},
						{
							'label': {
								'class': 	'col-sm-2 col-form-label',
								'text': 	'列數'
							}
						},
						{
							'div': {
								'class': 	'col-sm-3',
								'children': [
									{
										'input': {
											'type':         'number',
											'class':        'form-control',
											'id':           'row',
											'value': 		'4'
										}
									}
								]
							}
						},
						{
							'button': {
								'class': 	'col-sm-2 btn btn-primary',
								'id': 		'createTableButton',
								'text': 	'產生'
							}
						}
					]
				}
			},
			{
				'div': {
					'class': 	'form-group row',
					'children': [
						{
							'label': {
								'class': 	'col-sm-3 col-form-label',
								'text': 	'資料來源'
							}
						},
						{
							'div': {
								'class': 	'col-sm-2',
								'children': [
									{
										'div': {
											'class': 	'form-check-inline',
											'children': [
												{
													'input': {
														'class': 	'form-check-input',
														'type': 	'radio',
														'id': 		'modalResourceSource0',
														'name': 	'modalResourceSource',
														'value': 	'none',
														'checked': 	'checked'
													}
												},
												{
													'label': {
														'class': 	'form-check-label',
														'for': 		'modalResourceSource0',
														'text': 	'無'
													}
												}
											]
										}
									},
									{
										'div': {
											'class': 	'form-check-inline',
											'children': [
												{
													'input': {
														'class': 	'form-check-input',
														'type': 	'radio',
														'id': 		'modalResourceSource1',
														'name': 	'modalResourceSource',
														'value': 	'api',
													}
												},
												{
													'label': {
														'class': 	'form-check-label',
														'for': 		'modalResourceSource1',
														'text': 	'API'
													}
												}
											]
										}
									},
									{
										'div': {
											'class': 	'form-check-inline',
											'children': [
												{
													'input': {
														'class': 	'form-check-input',
														'type': 	'radio',
														'id': 		'modalResourceSource2',
														'name': 	'modalResourceSource',
														'value': 	'form'
													}
												},
												{
													'label': {
														'class': 	'form-check-label',
														'for': 		'modalResourceSource2',
														'text': 	'表單'
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
								'class': 	'col-sm-7',
								'children': [
									apiSelect
								]
							}
						}
					]
				}
			},
			apiSendParamBlock,
			{
				'div': {
					'class': 	'col-12',
					'id': 		'tableView',
					'children': [ ]
				}
			}
		]
	}
}

/** 元件提示窗 */
const toolTipElemental = {
	'div': {
		'class': 	'tooltip fade show bs-tooltip-bottom',
		'role': 	'tooltip',
		'style': 	'position: absolute; will-change: transform; top: 0px; left: 0px',
		'children': [
			{
				'div': {
					'class': 	'tooltip-inner',
					'children': []
				}
			}
		]
	}
}

/** 局部載入中樣式 */
const loadingStyle = {
	'div': {
		'class': 	'lds-ellipsis-parent',
		'children': [
			{
				'div': {
					'class': 	'lds-ellipsis',
					'children': [
						{
							'div': { }
						},
						{
							'div': { }
						},
						{
							'div': { }
						},
						{
							'div': { }
						}
					]
				}
			}
		]
	}
}

/** 來源參數類型選項 */
const sourceTypeOptions = [
	{
		'option': {
			'value': '0',
			'text': '請選擇'
		}
	},
	{
		'option': {
			'value': 'local',
			'text': '網頁暫存 (localStorage)'
		}
	},
	{
		'option': {
			'value': 'form',
			'text': '表單元件 (beanName)'
		}
	},
	{
		'option': {
			'value': 'eleId',
			'text': '元素名稱 (element ID)'
		}
	},
	{
		'option': {
			'value': 'fixed',
			'text': '固定值'
		}
	},
	{
		'option': {
			'value': 'gFormData',
			'text': '其他 (進階用法)'
		}
	}
]

/** 網頁暫存選項 */
const localStorageOptions = [
	{
		'option': {
			'value': '0',
			'text': '請選擇'
		}
	},
	{
		'option': {
			'value': 'gForm_userId',
			'text': '登入者ID'
		}
	},
	{
		'option': {
			'value': 'gForm_userName',
			'text': '登入者姓名'
		}
	},
	{
		'option': {
			'value': 'gForm_sourceId',
			'text': '表單來源'
		}
	},
	{
		'option': {
			'value': 'repplyCaseNo',
			'text': '照會回復病患住院號'
		}
	},
	{
		'option': {
			'value': 'repplyHistnum',
			'text': '照會回復病患病歷號'
		}
	}
]

/** 進階用法選項 */
const gFormDataOptions = [
	{
		'option': {
			'value': '0',
			'text': '請選擇'
		}
	},
	{
		'option': {
			'value': 'sourceId',
			'text': 'sourceId'
		}
	},
	{
		'option': {
			'value': 'formId',
			'text': 'formId'
		}
	},
	{
		'option': {
			'value': 'formType',
			'text': 'formType'
		}
	},
	{
		'option': {
			'value': 'status',
			'text': '表單狀態status(Y:正式,N:暫存,D:刪除,...)'
		}
	},
	{
		'option': {
			'value': 'evaluationTime',
			'text': '評估日期evaluationTime'
		}
	},
	{
		'option': {
			'value': 'formVersionId',
			'text': 'formVersionId'
		}
	},
	{
		'option': {
			'value': 'creatorId',
			'text': '創建者creatorId'
		}
	},
	{
		'option': {
			'value': 'creatorName',
			'text': '創建者creatorName'
		}
	},
	{
		'option': {
			'value': 'createTime',
			'text': '創建者createTime'
		}
	},
	{
		'option': {
			'value': 'modifyUserId',
			'text': '最後修改者modifyUserId'
		}
	},
	{
		'option': {
			'value': 'modifyUserName',
			'text': '最後修改者modifyUserName'
		}
	},
	{
		'option': {
			'value': 'modifyTime',
			'text': '最後修改者modifyTime'
		}
	},
	{
		'option': {
			'value': 'totalScore',
			'text': 'totalScore'
		}
	}
]

/** Query List 新增表單類型 */
const qlNewFormOptions = [
	{
		'option': {
			'value': 	'query',
			'text': 	'查詢清單'
		}
	}
]

/** Query List 添加查詢條件及排序條件彈出視窗內容 */
const qlSqlModalBody = {
    "form": {
		"onsubmit": "return false",
		"children": [ ]
	}
}

/** Query List 新增查詢條件列 */
const qlSqlConditionRowElement = {
	'div': {
		'class': 	'form-group row',
		'children': [
			{
				'label': {
					'class': 	'col-sm-2 col-form-label',
					'text': 	'查詢條件'
				}
			},
			{
				'div': {
					'class': 	'col-sm-4 toggle-block',
					'children': [
						{
							'input': {
								'class':        'form-control',
								'type': 		'text',
								'id':           'modalWhereStatement',
								'name': 		'modalWhereStatement',
								'placeholder': 	'A = ? AND B > ? AND C LIKE "%x%"'											
							}
						}
					]
				}
			},
			{
				'label': {
					'class': 	'col-sm-2 col-form-label',
					'text': 	'查詢條件'
				}
			},
			{
				'div': {
					'class': 	'col-sm-4 toggle-block',
					'children': [
						{
							'input': {
								'class':        'form-control',
								'type': 		'text',
								'id':           'modalOrderStatement',
								'name': 		'modalOrderStatement',
								'placeholder': 	'A DESC, B ASC'											
							}
						}
					]
				}
			}
		]
	}
}

/** =========================================== 元素區塊(end) =========================================== */

/** 元素&元件樣式全表 */
const elementObjectList = {
	"h5": 					hFiveElemental,
	"i": 					informationElemental,
	"label": 				titleElemental,
	"br": 					breakElemental,
	"button": 				buttonElemental,
	"div": 					divElemental,
	"p":					pElemental,
	"checkbox": 			checkboxElemental,
	"radio": 				radioElemental,
	"select": 				selectElemental,
	"option": 				optionElemental,
	"text": 				inputElemental,
	"file": 				fileElemental,
	"textarea": 			textareaElemental,
	"datetime": 			datetimeElemental,
	"table": 				tableElemental,
	"tablerow": 			tablerowElemental,
	"tablehead": 			tableheadElemental,
	"tabledata": 			tabledataElemental,
	"span": 				spanElemental,
	"iframe": 				iframeElemental,
	// 以上原生，以下自建
	"ul":					navElemental,
	"tab": 					tabElemental,
	"content": 				contentElemental,
	"editBox": 				editElemental,
	"ruleLine": 			ruleElemental,
	"scriptParamRow": 		scriptParamRowElemental,
	"csCanvas": 			csCanvasElemental,
	"apiLine": 				apiParamElemental,
	"toolTip": 				toolTipElemental,
	"paramValuePackage": 	paramValueElemental,
	"superLinkIconDefault": iconDefaultElemental,
	"superLink": 			superLinkElemental,
	"superLinkIcon1": 		icon1Elemental,
	"superLinkIcon2": 		icon2Elemental,
	// Query List
	"qlSqlConditionRow": 	qlSqlConditionRowElement,
	"qlAddScriptRow": 		qlAddScriptElemental,
	"qlAddParamRow": 		qlAddParamRowElemental,
	"qlButtonAddRow": 		qlButtonAddScriptRowElemental,
	"qlURLParamRow": 		qlURLParamRowElemental,
	//flex
	"flexRow": 				flexRowElemental,
	"flexCol": 				flexColElemental,
}

/** 頁面對照樣式 */
const pageFormat = {
	"add": 		addAndUpdFormStyle,
	"appadd": 	addAndUpdFormStyle,
	"list":		listFormStyle,
	"applist":	listFormStyle,
	"print": 	printFormStyle,
	"query": 	queryListStyle,
	"xmlTemplate": xmlTemplateStyle
}

/** 彈出視窗對照樣式 */
const modalTypeList = {
	"alert": 	alertModal,
	"confirm":	confirmModal,
	"prompt": 	promptModal,
	"custom": 	customModal
}

/** (全域) 元件樹結構 */
const beanTreeStructure = [
	{
		text: "表單雲",
		type: "cloud",
		value: "cloudBeans",
		nodes: []
	},
	{
		text: "表單庫",
		type: "folder",
		value: "localBeans",
		nodes: []
	}
]
/** (全域) 24 文件模式 */
let fileModeTest = false
/** (全域) 目錄主鍵 */
let dircataId
/** (全域) 目錄轉至登入者 */
let dirUserId
/** (全域) 操作模式 */
let operation
/** (全域) 醫院名稱 */
let hospitalName
/** (全域) 醫院標題 */
let hospitalTitle
/** (全域) 程式碼控制 */
let isCodeControl = false
/** (全域) 結構審查 */
let structurePass = false
/** (全域) token */
let token
/** (全域) 版本紀錄 */
let pdVersion = 0
/** (全域) 版本號紀錄 */
let pcvctId
/** (全域) 最後版本號 */
let lastVersionRecord = 0
/** (全域) 版本物件 */
let versionObject = {}
/** (全域) Query List 資料表條件及排序 */
let qlSQLCondition = {}
/** (全域) Query List 樹狀結構暫存 */
let queryListLocalSession = {}
/** (全域) 驗證規則陣列 */
let verificationVersion = []
/** (全域) 基礎表單容器 */
let basicParam = {}
/** (全域) 動態表單容器 */
let dynamicForm = {}
/** (全域) 計時器 */
let timer
/** (全域) 新增頁面暫存 */
let addFrame
/** (全域) 新增初始化頁面暫存 */
let addInit
/** (全域) app新增頁面暫存 */
let appAddFrame
/** (全域) app新增初始化頁面暫存 */
let appAddInit
/** (全域) 清單頁面暫存 */
let	listFrame
/** (全域) 清單初始化頁面暫存 */
let listInit 
/** (全域) app清單頁面暫存 */
let	appListFrame
/** (全域) app清單初始化頁面暫存 */
let appListInit 
/** (全域) 列印頁面暫存 */
let printFrame
/** (全域) 列印初始化頁面暫存 */
let printInit 
/** (全域) 舊版列印初始化頁面暫存 */
let printOldInit
/** (全域) Query List 初始化頁面暫存 */
let queryInit
/** (全域) frame編輯器 */
let frameEditMirror
/** (全域) init編輯器 */
let initEditMirror
/** (全域) formVersion 清單 */
let formVersionList
/** (全域) localStorage 清單 */
let localStorageParam
/** (全域) 錯誤代碼及相關敘述 */
const errorCodeDescription = {
	ED0001: "初始化元件失敗，錯誤代碼：ED0001",
	ED0002: "初始化按鈕失敗，錯誤代碼：ED0002",
	ED0003: "表單相關事件綁定失敗，錯誤代碼：ED0003",
	ED0004: "放置元件容器綁定事件失敗，錯誤代碼：ED0004",
	ED0005: "啟用編輯失敗，錯誤代碼：ED0005",
	ED0006: "複製失敗，錯誤代碼：ED0006",
	ED0007: "貼上失敗，錯誤代碼：ED0007",
	ED0008: "處理剪貼簿資料發生錯誤，錯誤代碼：ED0008",
	ED0009: "生成元件失敗，錯誤代碼：ED0009",
	ED0010: "生成清單元件失敗，錯誤代碼：ED0010",
	ED0011: "生成新增欄位按鈕失敗，錯誤代碼：ED0011",
	ED0012: "上下新增表格發生錯誤，錯誤代碼：ED0012",
	ED0013: "左右新增表格發生錯誤，錯誤代碼：ED0013",
	ED0014: "API頁籤取得資料有誤，錯誤代碼：ED0014",
	ED0015: "API查詢發生錯誤，錯誤代碼：ED0015",
	ED0016: "已存在其他元件，每個區域只可以存在一個元件，錯誤代碼：ED0016",
	ED0017: "合併儲存格無法整列選取，錯誤代碼：ED0017",
	ED0018: "只能選取連續的儲存格，錯誤代碼：ED0018",
	ED0019: "只能選取水平儲存格，錯誤代碼：ED0019",
	ED0020: "只能選取垂直儲存格，錯誤代碼：ED0020",
	ED0021: "已經合併的儲存格無法再與其他欄位合併，錯誤代碼：ED0021",
	ED0022: "表格無法移除，錯誤代碼：ED0022",
	ED0023: "查詢表單清單出錯，錯誤代碼：ED0023",
	ED0024: "上傳檔案不合法，只能上傳json檔案，錯誤代碼：ED0024"
}
/** 工具版本 */
const FORM_TOOL_VERSION = 1
/** 版本敘述 */
const FORM_TOOL_VERSION_DESCRIPTION = {
	1: "調整為 RWD 呈現，修正呈現樣式"
}