var superLink = {}

//表單同步工具syncTool
superLink.syncTool = function() {
    let url = const_gformServiceUrl.replace('/services/DynamicFormService', '/iq-nurs/nursing/customFormSync/index.html')
    window.open(url, '_blank');
}
//小黑dynamicTool (22-6)
superLink.dynamicTool = function() {
    let url = 'http://172.16.100.22:8086/wwwcicms/dynamicTools.html'
    window.open(url, '_blank');
}
//人形圖繪製工具csCanvasTool
superLink.csCanvasTool = function() {
    let url = const_gformServiceUrl.replace('/services/DynamicFormService', '/iq-nurs/nursing/customFormV3/plugins/canvas_BodyRegion/index.html')
    window.open(url, '_blank');
}
// api設計工具
superLink.csApiDefine = function() {
    let url = const_gformServiceUrl.replace('/services/DynamicFormService', '/iq-nurs/nursing/customFormV3/plugins/csApiDefine/index.html')
    window.open(url, '_blank');
}