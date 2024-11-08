//CS-Gateway             127.0.0.1:8080
//local連Blue Stacks     127.0.0.1:8090
//某IP連MBNIS            /MBNIS/websocket
//台灣連襄陽              cornerstone.tpddns.cn:28086

var const_socketUrl = "ws://127.0.0.1:99/MBNIS/websocket"; //webSocket接口
var const_socketEnable = false; //是否啟用webSocket接口 (true=啟用, false=不啟用)
var const_webserviceUrl = "http://127.0.0.1:99/MBNIS/hpJson/send.do"; //是否啟用webservice接口
var const_webserviceEnable = true; //是否啟用webservice接口 (true=啟用, false=不啟用)
var const_gformServiceUrl = "http://127.0.0.1/NoteSystem/services/DynamicFormService";
var const_fileApiUrl = "http://127.0.0.1:99/MBNIS/hpJson"
var const_fileServiceUrl = "http://127.0.0.1/NoteSystem/services/FileUploadService"
var const_csFormApiUrl = "http://34.81.136.185:8080/CSFormAPI"


var const_Http = true; //是否啟用httpClienc接口 (true=啟用, false=不啟用(直接调用))
var const_apiDomainSetting = "cs";	//api調用時的url-domain參數取得，用於切換定磐測試機、醫院正式機、醫院測試機等各個api的網域設定，詳細參數來自gform表propAPIListForm的domain
var languageMode = "Traditional Chinese"; //繁體中文(Traditional Chinese), 簡體中文(Simplified Chinese)
//是否關閉websocket
var closeWs=true;
//效能設定 (設為true時，代表直接調用上次獲取的資料，若偵測到有新資料則觸發頁面reload)
var _pfm, _performance;
_pfm = _performance = {
	"isDisabledMbnisStorage" : true, //false=MBNIS要暫存 true=MBIS不暫存 (是否關閉MBNIS的暫存機制)
	"isDisabledRefreshAtNewVersion" : false, //false=要重整 true=不要重整 (是否"不要"在取得新版本的時候重新整理)
	"formVersion" : false,		//暫存在add、upd、list頁取得的formVersion
	"formFrame"   : false,		//暫存在add、upd、list頁取得的formFrame、frameInit
	"formV3"      : false,		//在list頁取得表單data
	"gForm"       : false,		//(gForm)在list頁取得表單data
	"database" 	  : false
};
var isTest = true;
var onlineMode = true;
