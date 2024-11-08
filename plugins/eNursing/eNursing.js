var eNursing;

//用於解決wkhtmltopdf產生pdf時的localStorage問題
var localStoragePDF = (localStorage != undefined) ? localStorage : {"aaa":124,"removeItem" : function (key){delete localStoragePDF[key];}};

!function (global, factory) {

    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = global.document ?
            factory(global, true) :
            function (w) {
                return factory(w);
            };
    } else {
        factory(global);
    }

}(typeof window !== "undefined" ? window : this, function (window, noGlobal) {

    eNursing = function () {
        return new eNursing.init();
    };

    //用於解決wkhtmltopdf產生pdf時的localStorage問題
    var localStorage = localStoragePDF;

    //用於暫存 template 避免因重複調用api浪費資源並造成chrome誤認為是無窮迴圈的情況
    eNursing.templateMap = {};

    /**/
    eNursing.format = "yyyy/MM/dd HH:mm:ss";

    if (!window.console){
        window.console={};
        window.console.log = window.console.error =function(msg){
            //alert(msg); //IE低版本沒有console
        };
    }
    if (!console){
        console={};
        console.log = console.error = function(msg){
            //alert(msg); //IE低版本沒有console
        };
    }

    //判斷ie版本, 回傳true代表是該版本 ex: eNursing.isIE(8)
    eNursing.isIE = function(ver){
        try{
            if (ver===11 || ver==="11" || ver==="edge"){
                return navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0;
            }else{
                var b = document.createElement('b');
                b.innerHTML = '<!--[if IE ' + ver + ']><i></i><![endif]-->';
                return b.getElementsByTagName('i').length === 1;
            }
        }catch(e){
            return false;
        }
    };

    //取得url上的參數
    eNursing.getUrlParameter = function (name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

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
        //民國年
        if (/(ROCY)/.test(format)) {
            format = format.replace(RegExp.$1, ((this.getFullYear()-1911) + ""));
        }
        //西元年
        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    };
    //檢查date格式是否正確
    Date.prototype.isValid = function () {
        // An invalid date object returns NaN for getTime() and NaN is the only
        // object not strictly equal to itself.
        return this.getTime() === this.getTime();
    };
    //計算兩日期之間天數
    eNursing.getDaysDiff = function (sDate1, sDate2) { //eNursing.getDaysDiff("2016/4/28","2016/5/2");
        var errorMsg = "參數格式必須為 yyyy/MM/dd 或 yyyy-MM-dd 或 Date()";
        var isError = false;
        console.log(sDate1);
        console.log(sDate2);
        //轉換 date 為 yyyy/MM/dd
        function changeDateToString(dt){
            if (eNursing.isString(dt)){
                if (dt.length!==10) return eNursing.F2ReportErrorMsg("errorMsg");
                dt = dt.replace(/\-/g, "/");
            }else{
                try{
                    if (!dt.isValid()) return eNursing.F2ReportErrorMsg(errorMsg);
                    dt = dt.format("yyyy/MM/dd");
                }catch(e){
                    isError = true;
                    eNursing.F2ReportErrorMsg(e);
                }
            }
            return dt;
        }
        sDate1 = changeDateToString(sDate1);
        sDate2 = changeDateToString(sDate2);
        if (isError) return eNursing.F2ReportErrorMsg(errorMsg);
        try{
            var aDate, oDate1, oDate2, iDays;
            aDate = sDate1.split("/");
            oDate1 = new Date(aDate[1] + '/' + aDate[2] + '/' + aDate[0]); // 轉換為 06/18/2016 格式
            aDate = sDate2.split("/");
            oDate2 = new Date(aDate[1] + '/' + aDate[2] + '/' + aDate[0]);
            iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24, 10); // 把相差的毫秒數轉換為天數
            return iDays;
        }catch(e){
            return eNursing.F2ReportErrorMsg(errorMsg);
        }
    };

    /*
     *  Function setDefaultDate 設定日期時間
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
                d.setYear(evalByReturn(d.getFullYear() + dateSettingArray[i].substring(0, dateSettingArray[i].indexOf('y'))));
                if (dateSettingArray[i].indexOf('M') > -1) {
                    // y-m
                    d.setMonth(evalByReturn(d.getMonth() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('y') + 1, dateSettingArray[i].indexOf('M'))));
                    if (dateSettingArray[i].indexOf('d') > -1) {
                        // y-m-d
                        d.setDate(evalByReturn(d.getDate() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('M') + 1, dateSettingArray[i].indexOf('d'))));
                        if (dateSettingArray[i].indexOf('h') > -1) {
                            // y-m-d-h
                            d.setHours(evalByReturn(d.getHours() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('d') + 1, dateSettingArray[i].indexOf('h'))));
                            if (dateSettingArray[i].indexOf('m') > -1) {
                                // y-m-d-h-n
                                d.setMinutes(evalByReturn(d.getMinutes() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('h') + 1, dateSettingArray[i].indexOf('m'))));
                                if (dateSettingArray[i].indexOf('s') > -1) {
                                    // y-m-d-h-n-s
                                    d.setSeconds(evalByReturn(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('m') + 1, dateSettingArray[i].indexOf('s'))));
                                }
                            } else {
                                if (dateSettingArray[i].indexOf('s') > -1) {
                                    // y-m-d-h-s
                                    d.setSeconds(evalByReturn(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('h') + 1, dateSettingArray[i].indexOf('s'))));
                                }
                            }
                        } else {
                            if (dateSettingArray[i].indexOf('m') > -1) {
                                // y-m-d-n
                                d.setMinutes(evalByReturn(d.getMinutes() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('d') + 1, dateSettingArray[i].indexOf('m'))));
                                if (dateSettingArray[i].indexOf('s') > -1) {
                                    // y-m-d-n-s
                                    d.setSeconds(evalByReturn(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('m') + 1, dateSettingArray[i].indexOf('s'))));
                                }
                            } else {
                                if (dateSettingArray[i].indexOf('s') > -1) {
                                    // y-m-d-s
                                    d.setSeconds(evalByReturn(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('d') + 1, dateSettingArray[i].indexOf('s'))));
                                }
                            }
                        }
                    } else {
                        if (dateSettingArray[i].indexOf('h') > -1) {
                            // y-m-h
                            d.setHours(evalByReturn(d.getHours() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('M') + 1, dateSettingArray[i].indexOf('h'))));
                            if (dateSettingArray[i].indexOf('m') > -1) {
                                // y-m-h-n
                                d.setMinutes(evalByReturn(d.getMinutes() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('h') + 1, dateSettingArray[i].indexOf('m'))));
                                if (dateSettingArray[i].indexOf('s') > -1) {
                                    // y-m-h-n-s
                                    d.setSeconds(evalByReturn(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('m') + 1, dateSettingArray[i].indexOf('s'))));
                                }
                            } else {
                                if (dateSettingArray[i].indexOf('s') > -1) {
                                    // y-m-h-s
                                    d.setSeconds(evalByReturn(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('h') + 1, dateSettingArray[i].indexOf('s'))));
                                }
                            }
                        } else {
                            if (dateSettingArray[i].indexOf('m') > -1) {
                                // y-m-n
                                d.setMinutes(evalByReturn(d.getMinutes() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('M') + 1, dateSettingArray[i].indexOf('m'))));
                                if (dateSettingArray[i].indexOf('s') > -1) {
                                    // y-m-n-s
                                    d.setSeconds(evalByReturn(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('m') + 1, dateSettingArray[i].indexOf('s'))));
                                }
                            } else {
                                if (dateSettingArray[i].indexOf('s') > -1) {
                                    // y-m-s
                                    d.setSeconds(evalByReturn(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('M') + 1, dateSettingArray[i].indexOf('s'))));
                                }
                            }
                        }
                    }
                } else {
                    if (dateSettingArray[i].indexOf('d') > -1) {
                        // y-d
                        d.setDate(evalByReturn(d.getDate() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('y') + 1, dateSettingArray[i].indexOf('d'))));
                        if (dateSettingArray[i].indexOf('h') > -1) {
                            // y-d-h
                            d.setHours(evalByReturn(d.getHours() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('d') + 1, dateSettingArray[i].indexOf('h'))));
                            if (dateSettingArray[i].indexOf('m') > -1) {
                                // y-d-h-n
                                d.setMinutes(evalByReturn(d.getMinutes() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('h') + 1, dateSettingArray[i].indexOf('m'))));
                                if (dateSettingArray[i].indexOf('s') > -1) {
                                    // y-d-h-n-s
                                    d.setSeconds(evalByReturn(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('m') + 1, dateSettingArray[i].indexOf('s'))));
                                }
                            } else {
                                if (dateSettingArray[i].indexOf('s') > -1) {
                                    // y-d-h-s
                                    d.setSeconds(evalByReturn(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('h') + 1, dateSettingArray[i].indexOf('s'))));
                                }
                            }
                        } else {
                            if (dateSettingArray[i].indexOf('m') > -1) {
                                // y-d-n
                                d.setMinutes(evalByReturn(d.getMinutes() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('d') + 1, dateSettingArray[i].indexOf('m'))));
                                if (dateSettingArray[i].indexOf('s') > -1) {
                                    // y-d-n-s
                                    d.setSeconds(evalByReturn(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('m') + 1, dateSettingArray[i].indexOf('s'))));
                                }
                            } else {
                                if (dateSettingArray[i].indexOf('s') > -1) {
                                    // y-d-s
                                    d.setSeconds(evalByReturn(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('d') + 1, dateSettingArray[i].indexOf('s'))));
                                }
                            }
                        }
                    } else {
                        if (dateSettingArray[i].indexOf('h') > -1) {
                            // y-h
                            d.setHours(evalByReturn(d.getHours() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('y') + 1, dateSettingArray[i].indexOf('h'))));
                            if (dateSettingArray[i].indexOf('m') > -1) {
                                // y-h-n
                                d.setMinutes(evalByReturn(d.getMinutes() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('h') + 1, dateSettingArray[i].indexOf('m'))));
                                if (dateSettingArray[i].indexOf('s') > -1) {
                                    // y-h-n-s
                                    d.setSeconds(evalByReturn(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('m') + 1, dateSettingArray[i].indexOf('s'))));
                                }
                            } else {
                                if (dateSettingArray[i].indexOf('s') > -1) {
                                    // y-h-s
                                    d.setSeconds(evalByReturn(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('h') + 1, dateSettingArray[i].indexOf('s'))));
                                }
                            }
                        } else {
                            if (dateSettingArray[i].indexOf('m') > -1) {
                                // y-n
                                d.setMinutes(evalByReturn(d.getMinutes() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('y') + 1, dateSettingArray[i].indexOf('m'))));
                                if (dateSettingArray[i].indexOf('s') > -1) {
                                    // y-n-s
                                    d.setSeconds(evalByReturn(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('m') + 1, dateSettingArray[i].indexOf('s'))));
                                }
                            } else {
                                if (dateSettingArray[i].indexOf('s') > -1) {
                                    // y-s
                                    d.setSeconds(evalByReturn(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('y') + 1, dateSettingArray[i].indexOf('s'))));
                                }
                            }
                        }
                    }
                }
            } else {
                if (dateSettingArray[i].indexOf('M') > -1) {
                    // m
                    d.setMonth(evalByReturn(d.getMonth() + dateSettingArray[i].substring(0, dateSettingArray[i].indexOf('M'))));
                    if (dateSettingArray[i].indexOf('d') > -1) {
                        // m-d
                        d.setDate(evalByReturn(d.getDate() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('M') + 1, dateSettingArray[i].indexOf('d'))));
                        if (dateSettingArray[i].indexOf('h') > -1) {
                            // m-d-h
                            d.setHours(evalByReturn(d.getHours() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('d') + 1, dateSettingArray[i].indexOf('h'))));
                            if (dateSettingArray[i].indexOf('m') > -1) {
                                // m-d-h-n
                                d.setMinutes(evalByReturn(d.getMinutes() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('h') + 1, dateSettingArray[i].indexOf('m'))));
                                if (dateSettingArray[i].indexOf('s') > -1) {
                                    // m-d-h-n-s
                                    d.setSeconds(evalByReturn(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('m') + 1, dateSettingArray[i].indexOf('s'))));
                                }
                            } else {
                                if (dateSettingArray[i].indexOf('s') > -1) {
                                    // m-d-h-s
                                    d.setSeconds(evalByReturn(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('h') + 1, dateSettingArray[i].indexOf('s'))));
                                }
                            }
                        } else {
                            if (dateSettingArray[i].indexOf('m') > -1) {
                                // m-d-n
                                d.setMinutes(evalByReturn(d.getMinutes() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('d') + 1, dateSettingArray[i].indexOf('m'))));
                                if (dateSettingArray[i].indexOf('s') > -1) {
                                    // m-d-n-s
                                    d.setSeconds(evalByReturn(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('m') + 1, dateSettingArray[i].indexOf('s'))));
                                }
                            } else {
                                if (dateSettingArray[i].indexOf('s') > -1) {
                                    // m-d-s
                                    d.setSeconds(evalByReturn(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('d') + 1, dateSettingArray[i].indexOf('s'))));
                                }
                            }
                        }
                    } else {
                        if (dateSettingArray[i].indexOf('h') > -1) {
                            // m-h
                            d.setHours(evalByReturn(d.getHours() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('M') + 1, dateSettingArray[i].indexOf('h'))));
                            if (dateSettingArray[i].indexOf('m') > -1) {
                                // m-h-n
                                d.setMinutes(evalByReturn(d.getMinutes() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('h') + 1, dateSettingArray[i].indexOf('m'))));
                                if (dateSettingArray[i].indexOf('s') > -1) {
                                    // m-h-n-s
                                    d.setSeconds(evalByReturn(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('m') + 1, dateSettingArray[i].indexOf('s'))));
                                }
                            } else {
                                if (dateSettingArray[i].indexOf('s') > -1) {
                                    // m-h-s
                                    d.setSeconds(evalByReturn(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('h') + 1, dateSettingArray[i].indexOf('s'))));
                                }
                            }
                        } else {
                            if (dateSettingArray[i].indexOf('m') > -1) {
                                // m-n
                                d.setMinutes(evalByReturn(d.getMinutes() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('M') + 1, dateSettingArray[i].indexOf('m'))));
                                if (dateSettingArray[i].indexOf('s') > -1) {
                                    // m-n-s
                                    d.setSeconds(evalByReturn(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('m') + 1, dateSettingArray[i].indexOf('s'))));
                                }
                            } else {
                                if (dateSettingArray[i].indexOf('s') > -1) {
                                    // m-s
                                    d.setSeconds(evalByReturn(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('y') + 1, dateSettingArray[i].indexOf('s'))));
                                }
                            }
                        }
                    }
                } else {
                    if (dateSettingArray[i].indexOf('d') > -1) {
                        // d
                        d.setDate(evalByReturn(d.getDate() + dateSettingArray[i].substring(0, dateSettingArray[i].indexOf('d'))));
                        if (dateSettingArray[i].indexOf('h') > -1) {
                            // d-h
                            d.setHours(evalByReturn(d.getHours() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('d') + 1, dateSettingArray[i].indexOf('h'))));
                            if (dateSettingArray[i].indexOf('m') > -1) {
                                // d-h-n
                                d.setMinutes(evalByReturn(d.getMinutes() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('h') + 1, dateSettingArray[i].indexOf('m'))));
                                if (dateSettingArray[i].indexOf('s') > -1) {
                                    // d-h-n-s
                                    d.setSeconds(evalByReturn(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('m') + 1, dateSettingArray[i].indexOf('s'))));
                                }
                            } else {
                                if (dateSettingArray[i].indexOf('s') > -1) {
                                    // d-h-s
                                    d.setSeconds(evalByReturn(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('h') + 1, dateSettingArray[i].indexOf('s'))));
                                }
                            }
                        } else {
                            if (dateSettingArray[i].indexOf('m') > -1) {
                                // d-n
                                d.setMinutes(evalByReturn(d.getMinutes() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('d') + 1, dateSettingArray[i].indexOf('m'))));
                                if (dateSettingArray[i].indexOf('s') > -1) {
                                    // d-n-s
                                    d.setSeconds(evalByReturn(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('m') + 1, dateSettingArray[i].indexOf('s'))));
                                }
                            } else {
                                if (dateSettingArray[i].indexOf('s') > -1) {
                                    // d-s
                                    d.setSeconds(evalByReturn(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('d') + 1, dateSettingArray[i].indexOf('s'))));
                                }
                            }
                        }
                    } else {
                        if (dateSettingArray[i].indexOf('h') > -1) {
                            // h
                            d.setHours(evalByReturn(d.getHours() + dateSettingArray[i].substring(0, dateSettingArray[i].indexOf('h'))));
                            if (dateSettingArray[i].indexOf('m') > -1) {
                                // h-n
                                d.setMinutes(evalByReturn(d.getMinutes() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('h') + 1, dateSettingArray[i].indexOf('m'))));
                                if (dateSettingArray[i].indexOf('s') > -1) {
                                    // h-n-s
                                    d.setSeconds(evalByReturn(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('m') + 1, dateSettingArray[i].indexOf('s'))));
                                }
                            } else {
                                if (dateSettingArray[i].indexOf('s') > -1) {
                                    // h-s
                                    d.setSeconds(evalByReturn(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('h') + 1, dateSettingArray[i].indexOf('s'))));
                                }
                            }
                        } else {
                            if (dateSettingArray[i].indexOf('m') > -1) {
                                // n
                                d.setMinutes(evalByReturn(d.getMinutes() + dateSettingArray[i].substring(0, dateSettingArray[i].indexOf('m'))));
                                if (dateSettingArray[i].indexOf('s') > -1) {
                                    // n-s
                                    d.setSeconds(evalByReturn(d.getSeconds() + dateSettingArray[i].substring(dateSettingArray[i].indexOf('m') + 1, dateSettingArray[i].indexOf('s'))));
                                }
                            } else {
                                if (dateSettingArray[i].indexOf('s') > -1) {
                                    // s
                                    d.setSeconds(evalByReturn(d.getSeconds() + dateSettingArray[i].substring(0, dateSettingArray[i].indexOf('s'))));
                                }
                            }
                        }
                    }
                }
            }
            dateSettingArray[i] = d.format(format);
        }
        // 拼接兩個
        return dateSettingArray.join(connection);
    };

    /**
     * 日期時間增減 年月日時分
     * @param {int} year 要增加的年份，支援負數
     * @param {int} month 要增加的月份，支援負數
     * @param {int} date 要增加的日期，支援負數
     * @param {int} hours 要增加的小時，支援負數
     * @param {int} minutes 要增加的分鐘，支援負數
     * @returns {Date}
     */
    Date.prototype.addDateTime = function (year, month, date, hours, minutes) {
        var originalDate = {
            "year": this.getFullYear(),
            "month": this.getMonth(),
            "date": this.getDate(),
            "hours": this.getHours(),
            "minutes": this.getMinutes()
        }
        var oldDate = new Date(this);
        this.addMinutes(minutes);
        this.addHours(hours);
        this.addDate(date);
        this.addMonth(month)
        this.addYear(year)

        return this;
    }

    /**
     * 年份增減
     * @param {int} year 要增加的年份，支援負數
     * @returns {Date}
     */
    Date.prototype.addYear = function (year) {
        this.setFullYear(this.getFullYear() + parseInt(year, 10));
        return this;
    }

    /**
     * 月份增減
     * @param {int} month 要增加的月份，支援負數
     * @returns {Date}
     */
    Date.prototype.addMonth = function (month) {
        this.setMonth(this.getMonth() + parseInt(month, 10));
        return this;
    }

    /**
     * 日期增減
     * @param {int} date 要增加的日期，支援負數
     * @returns {Date}
     */
    Date.prototype.addDate = function (date) {
        this.setDate(this.getDate() + parseInt(date, 10));
        return this;
    }

    /**
     * 小時增減
     * @param {int} hours 要增加的小時，支援負數
     * @returns {Date}
     */
    Date.prototype.addHours = function (hours) {
        this.setHours(this.getHours() + parseInt(hours, 10));
        return this;
    }

    /**
     * 分鐘增減
     * @param {int} minutes 要增加的分鐘，支援負數
     * @returns {Date}
     */
    Date.prototype.addMinutes = function (minutes) {
        this.setMinutes(this.getMinutes() + parseInt(minutes, 10));
        return this;
    }

    eNursing.createElemental = function (jsonObject, ele) {
        var result = [];
        if (ele == undefined) ele = {}
        if (Object.keys(jsonObject)[0] == '0') {
            for (var position in jsonObject) {
                result.push(eNursing.createElemental(jsonObject[position], {})[0]);
            }
        } else {
            for (var key in jsonObject) {
                if (Array.isArray(jsonObject[key])) {
                    switch (key) {
                        case 'children':
                            if (jsonObject[key].length > 0) {
                                for (var objs in jsonObject[key]) {
                                    if (typeof jsonObject[key][objs] == 'function') continue;
                                    ele.appendChild(eNursing.createElemental(jsonObject[key][objs], {})[0]);
                                }
                            }
                            break;
                        default:
                            break;
                    }
                } else if (typeof jsonObject[key] == 'object' && jsonObject[key] != null) {
                    var elementObject = document.createElement(key);
                    result.push(eNursing.createElemental(jsonObject[key], elementObject));
                } else if (typeof jsonObject[key] == 'string') {
                    switch (key) {
                        case 'text':
                            if ($(ele).children().length > 0) {
                                var eleChildren = $(ele).children()
                                if (jsonObject["data-icon-position"] && jsonObject["data-icon-position"] == 'before') {
                                    $(ele).html(jsonObject[key]).prepend(eleChildren);
                                } else {
                                    $(ele).html(jsonObject[key]).append(eleChildren);
                                }
                            } else {
                                $(ele).html(jsonObject[key]);
                            }
                            break
                        default:
                            $(ele).attr(key, jsonObject[key]);
                            break;
                    }
                } else if (typeof jsonObject[key] == 'number' || typeof jsonObject[key] == 'boolean') {
                    $(ele).attr(key, jsonObject[key]);
                } else if (typeof jsonObject[key] == 'function') {
                    switch(key) {
                        case 'onclick':
                            $(ele).on('click', jsonObject[key]);
                            break;
                        case 'onchange':
                            $(ele).on('change', jsonObject[key]);
                            break;
                        case 'blur':
                            $(ele).on('blur', jsonObject[key]);
                            break;
                    }
                }
            }
        }
        if (ele.tagName)
            return ele;
        else
            return result;
    };

    //為IE5 IE7 加上indexOf方法
    if(!String.prototype.indexOf){
        String.prototype.indexOf = function(val){
            var value = this;
            for(var i =0; i < value.length; i++){
                if(value[i] == val) return i;
            }
            return -1;
        };
    }
    //為IE5 IE7 加上trim方法
    if(typeof String.prototype.trim !== 'function') {
        String.prototype.trim = function() {
            return this.replace(/^\s+|\s+$/g, '');
        };
    }
    //為IE5 IE7 加上create方法
    if (typeof Object.create !== "function"){
        Object.create = function(o){
            function F() {};
            F.prototype = o;
            return new F();
        };
    }
    //String 取代成html字串
    String.prototype.replaceToHtml = function(){
        var st = this.toString();
        st = st.replace(/\&/g, "&amp;").replace(/\'/g, "&apos;").replace(/\"/g, "&quot;").replace(/\</g, "&lt;").replace(/\>/g, "&gt;").replace(/\r\n/g, "<br/>").replace(/[\r\n]/g, "<br/>").replace(/\s\s/g, "&nbsp;&nbsp;");
        return st;
    };
    //array JSON 排序
    Array.prototype.sortJson = function(){
        var json={};
        var keys=[], orders=[], types=[];
        if (arguments.length==0){
            if (window.console) console.log("排序範例[先按a排序asc；再按a.b排序desc，多個條件組合後邊繼續追加]：Array.sortJson({key:'a',orderby:'asc',type:'string'},{key:'a.b',orderby:'desc',type:'number'})");
            return this;
        }
        for (var i=0, len=arguments.length; i<len; ++i){
            json = arguments[i];
            if (typeof(json)!=="object"){
                if (window.console) console.log("第"+(i+1)+"個數組必需為json,例如{key:'aa',orderby:'desc'}-->"+json);
                return this;
            }
            orderby = (json.orderby!=undefined && typeof(json.orderby)=="string") ? json.orderby.toLowerCase() : "";
            if (orderby!=="asc"&&orderby!=="desc"){
                if (window.console) console.log("第"+(i+1)+"個數組的參數orderby必須為desc或asc-->"+JSON.stringify(json));
                return this;
            }else{
                keys.push(json.key);
                orders.push((json.orderby=="asc") ? -1 : 1);
                types.push((json.type) ? json.type.toLocaleLowerCase() : "string");
            }
        }
        return this.sort(function(a,b){
            var len=keys.length;
            return orderFunction(0);
            function orderFunction(i){
                if (i==len){
                    return 1;
                }else{
                    var node = keys[i].split(".");
                    var aa=$.extend(true,{},a), bb=$.extend(true,{},b);
                    for(var i2=0,len2=node.length; i2<len2; ++i2){
                        aa = aa[node[i2]];
                        bb = bb[node[i2]];
                        if (aa==undefined||bb==undefined)
                            return false;
                    }
                    if (types[i]=="number"){
                        if (eNursing.isString(aa) && eNursing.isString(bb)){
                            aa = parseFloat(aa);
                            bb = parseFloat(bb);
                        }
                    }
                    if (aa<bb){ //asc不交換, desc交換
                        return orders[i];
                    }else if (aa>bb){ //asc交換, desc不交換
                        return orders[i]*-1;
                    }else{ //相同的話則繼續比較 (如果有多組key要排序)
                        return orderFunction(++i);
                    }
                }
            }
        });
    };
    //為IE5 IE7 加上indexOf方法
    if(!Array.prototype.indexOf){
        Array.prototype.indexOf = function(val){
            var value = this;
            for(var i =0; i < value.length; i++){
                if(value[i] == val) return i;
            }
            return -1;
        };
    }
    //為IE5 IE7 加上map方法
    (function(fn){
        if (!fn.map) fn.map=function(f){var r=[];for(var i=0;i<this.length;i++)r.push(f(this[i]));return r;};
        if (!fn.filter) fn.filter=function(func, thisArg) {
            if ( ! ((typeof func === 'function') && this) )
                throw new TypeError();
            var len = this.length >>> 0,
                res = new Array(len), // 預先配置陣列
                c = 0, i = -1;
            if (thisArg === undefined){
                while (++i !== len){
                    // 確認物件的鍵值i是否有被設置
                    if (i in this){
                        if (func(this[i], i, this))
                            res[c++] = this[i];
                    }
                }
            }
            else{
                while (++i !== len){
                    // 確認物件的鍵值i是否有被設置
                    if (i in this){
                        if (func.call(thisArg, this[i], i, this))
                            res[c++] = this[i];
                    }
                }
            }
            res.length = c; // 將陣列縮至適當大小
            return res;
        };
    })(Array.prototype);
    //為IE5 IE7 加上forEach方法
    if (typeof Array.prototype.forEach != 'function') {
        Array.prototype.forEach = function(callback){
            for (var i = 0; i < this.length; i++){
                callback.apply(this, [this[i], i, this]);
            }
        };
    }
    //為IE5 IE7 加上isArray方法
    if (typeof Array.isArray != 'function') {
        Array.isArray = function (obj) {
            return Object.prototype.toString.call(obj) === "[object Array]";
        };
    }

    //為IE5 IE7 加上isArray方法
    if (typeof Array.prototype.reduce != 'function') {
        Array.prototype.reduce = function (callback, optInitialValue) {

            if (null === this || 'undefined' === typeof this) {
                // At the moment all modern browsers, that support strict mode, have
                // native implementation of Array.prototype.reduce. For instance, IE8
                // does not support strict mode, so this check is actually useless.
                throw new TypeError('reduce called on null or undefined');
            }

            if ('function' !== typeof callback) {
                throw new TypeError(callback + ' is not a function');
            }

            var index,
                value,
                length = this.length >>> 0,
                isValueSet = false;

            if (1 < arguments.length) {
                value = optInitialValue;
                isValueSet = true;
            }

            for (index = 0; length > index; ++index) {
                if (this.hasOwnProperty(index)) {
                    if (isValueSet) {
                        value = callback(value, this[index], index, this);
                    } else {
                        value = this[index];
                        isValueSet = true;
                    }
                }
            }

            if (!isValueSet) {
                throw new TypeError('Reduce of empty array with no initial value');
            }

            return value;
        };
    }
    //為IE5 IE7 加上Object.keys方法
    if (!Object.keys) {
        Object.keys = (function () {
            var hasOwnProperty = Object.prototype.hasOwnProperty,
                hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
                dontEnums = [
                    'toString',
                    'toLocaleString',
                    'valueOf',
                    'hasOwnProperty',
                    'isPrototypeOf',
                    'propertyIsEnumerable',
                    'constructor'
                ],
                dontEnumsLength = dontEnums.length;

            return function (obj) {
                if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) throw new TypeError('Object.keys called on non-object');

                var result = [];

                for (var prop in obj) {
                    if (hasOwnProperty.call(obj, prop)) result.push(prop);
                }

                if (hasDontEnumBug) {
                    for (var i=0; i < dontEnumsLength; i++) {
                        if (hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i]);
                    }
                }
                return result;
            };
        })();
    }

    /*设定eNursing日志系统 start*/
    !function logHandler() {
        var divLog = document.getElementById("divLog");
        var divLogF = document.getElementById("divLogF");
        var divLogB = document.getElementById("divLogB");

        function createLog() {
            /*背景层*/
            divLogB = document.createElement("div");
            divLogB.id = "divLogB";
            divLogB.style.display = "none";
            divLogB.style.backgroundColor = "black";
            divLogB.style.width = "100%";
            divLogB.style.height = "100%";
            divLogB.style.opacity = "0.69";
            divLogB.style.position = "fixed";
            divLogB.style.top = "0px";
            divLogB.style.zIndex = "1999";
            /*外框*/
            divLogF = document.createElement("div");
            divLogF.id = "divLogF";
            divLogF.style.display = "none";
            divLogF.style.textAlign = "center";
            divLogF.style.width = "100%";
            divLogF.style.height = "100%";
            divLogF.style.position = "fixed";
            divLogF.style.top = "0px";
            divLogF.style.color = "white";
            divLogF.style.zIndex = "2000";
            /*记录层*/
            divLog = document.createElement("div");
            divLog.id = "divLog";
            divLog.style.textAlign = "left";
            divLog.style.width = "100%";
            divLog.style.height = "89%";
            divLog.style.overflowX = "hidden";
            divLog.style.overflowY = "auto";

            var inputTmpLeave = document.createElement("input");
            inputTmpLeave.id = "leaveLog";
            inputTmpLeave.type = "button";
            inputTmpLeave.className = "btn btn-default";
            inputTmpLeave.style.height = "30px";
            inputTmpLeave.style.padding = "0px 6px";
            inputTmpLeave.value = "close";
            var inputTmpClear = document.createElement("input");
            inputTmpClear.id = "clearLog";
            inputTmpClear.type = "button";
            inputTmpClear.className = "btn btn-default";
            inputTmpClear.style.marginLeft = "10px";
            inputTmpClear.style.height = "30px";
            inputTmpClear.style.padding = "0px 6px";
            inputTmpClear.value = "clear";
            divLogF.appendChild(inputTmpLeave);
            divLogF.appendChild(inputTmpClear);
            divLogF.appendChild(divLog);
            var bodyTmp = document.body;
            bodyTmp.appendChild(divLogF);
            bodyTmp.appendChild(divLogB);
            /*TODO 事件委托绑定*/
            bodyTmp.onclick = function (ev) {
                var e = ev || window.event;
                var target = e.target || e.srcElement;
                if (target.id === 'leaveLog') {
                    divLogF.style.display = "none";
                    divLogB.style.display = "none";
                } else if (target.id === 'clearLog') {
                    divLog.innerHTML = "";
                } else if (target.nodeName.toLocaleLowerCase() === "div" && !(target.id && target.id.match(/^divLog/g))) {
                    eNursing.showLog();
                }
            };
            return divLog;
        }

        function processMsg(level, msg, data, stack) {
            msg = level + "[" + new Date().format() + "]:" + msg;
            var pTmp = document.createElement("p");
            if ("ERROR" === level) {
                pTmp.style.color = "red";
                if (window.console) eNursing.F2ReportErrorMsg(msg);
                if (stack) eNursing.F2ReportErrorMsg(stack);
            }else if (window.console) {
                try{
                    if (isCloseProcessMsg){
                        divLog = divLog || createLog(); //就算關閉log紀錄還是要初始化F2頁面
                        return;
                    }
                }catch(e){
                    console.log("偵測到疑似properties.js未宣告 isCloseProcessMsg")
                }
                console.log(msg);
                if (data !== undefined){
                    try{
                        console.log(JSON.parse(data));
                    }catch(e){
                        console.log(data);
                    }
                }
            }
            if (document.body) {
                pTmp.style.width = "98%";
                pTmp.style.wordBreak = "break-all";
                // pTmp.style.wordWrap = "break-word";
                var dataJ;
                if (data) {
                    dataJ= eNursing.toJson(data);
                }
                pTmp.innerText = msg + (data === undefined ? "" : ((data == null || data.length === 0) ? "null" : (dataJ.substring(0, Math.min(dataJ.length - 1, 169)) + "...")));
                divLog = divLog || createLog();
                var logs = divLog.children;
                if (logs[0]) {
                    divLog.insertBefore(pTmp, logs[0]);
                    if (logs.length === 999) {
                        for (var i = logs.length - 1; i >= 699; i--) {
                            divLog.removeChild(logs[i]);
                        }
                    }
                } else
                    divLog.appendChild(pTmp);
            }
        }

        eNursing.info = function (msg,data) {
            processMsg("INFO", msg,data);
        };
        eNursing.error = function (msg) {
            //檢查是否為localStorage空間不足造成的錯誤
            var isQuotaExceededError = false;
            try{
                if (msg.code===22){ //chrome | IE11 | IE10 | IE9
                    isQuotaExceededError = true;
                }
            }catch(e){}
            try{
                if (msg.number===-2147024882){ //IE8 | IE7 | IE5
                    isQuotaExceededError = true;
                }
            }catch(e){}
            //localStorage空間不足造成的錯誤
            if (isQuotaExceededError){
                console.error('localStorage空間不夠，自動清理localStorage');
                //增加效能用的localStorage
                var garbageLocolStorageArr = [
                    "DynamicFormFrame.", "DynamicFormTemplate."
                ];
                for (key in localStorage){
                    //沒有"."的視為重要參數，不刪
                    if (key.indexOf(".")>-1){
                        var k = key.split(".")[0]+".";
                        //如果是增加效能用的就直接清除
                        if (garbageLocolStorageArr.indexOf(k)===-1){
                            localStorage.removeItem(key);
                        }
                        //如果是json且時間早於半個月前的就清除
                        else{
                            try{
                                var rs = JSON.parse(localStorage[key]);
                                var ts = new Date(rs.data[0].title.ts);
                                //兩個時間相差的天數 > 30天
                                if ((parseInt(new Date() - ts) / 1000 / 60 / 24)>30){
                                    localStorage.removeItem(key);
                                }
                            }catch(e){
                            }
                        }
                    }
                    //刪除跳轉gForm頁面用的參數 (但不刪除當前頁面用的參數)
                    else if (key.indexOf("gFormWeb")>-1 && (multiLevel && key.indexOf(multiLevel)===-1)){
                        localStorage.removeItem(key);
                    }
                }
                // for (key in localStorage){
                //     len2+=localStorage[key].length;
                // }
                //刷新頁面
                location.reload();
            }else{ //其他錯誤
                if (msg.stack)
                    processMsg("ERROR", msg, "", msg.stack);
                else
                    processMsg("ERROR", msg);
            }
        };
        var defaultLogC = 1;
        var defaultLogCMax = 5;
        eNursing.showLog = function () {
            eNursing.showLogC = eNursing.showLogC || defaultLogC;
            if (window.console) console.log(eNursing.showLogC);
            if (eNursing.showLogC > defaultLogCMax) {
                divLogB.style.display = "block";
                divLogF.style.display = "block";
            } else {
                if (eNursing.showLogC > 2) {
                    var oldDivTemp = document.getElementById("showLogC");
                    if (oldDivTemp) {
                        oldDivTemp.style.display = "none";
                        oldDivTemp.id = "";
                    }
                    var divTemp = document.createElement("div");
                    divTemp.id = "showLogC";
                    divTemp.style.width = "100%";
                    divTemp.style.textAlign = "center";
                    divTemp.style.display = "block";
                    divTemp.style.position = "fixed";
                    divTemp.style.zIndex = "1600";
                    var bodyTemp = document.body;
                    divTemp.style.bottom = "9%";
                    divTemp.innerHTML = "再點" + (defaultLogCMax - eNursing.showLogC + 1) + "次調取日誌！";
                    bodyTemp.appendChild(divTemp);
                    setTimeout(function () {
                        bodyTemp.removeChild(divTemp);
                        divTemp = undefined;
                    }, 600);
                } else if (eNursing.showLogC === defaultLogC) {
                    setTimeout(function () {
                        eNursing.showLogC = defaultLogC;
                        if (window.console) console.log("reset eNursing.showLogC");
                    }, 3500);
                }
                eNursing.showLogC++;
            }
        };
    }();
    /*设定eNursing日志系统 end*/

    /*清除MBNIS緩存*/
    eNursing.clearMbnisStorage=function(successCall){
        console.log("清除MBNIS緩存start");
        eNursing.sendMsg("MBNIS.clearMbnisStorage", [{"MBNIS":"清除緩存"}], "清除緩存", eNursing.UUID(), successCall || function (rs) {
            console.log(rs.resultMsg.message);
        }, function (e){console.error(e);});
    };
    /*左上角顯示處理狀態*/
    eNursing.processStatus={
        "callScheduleCount" : 0, //排程的count數
        "show" : function(msg, forceHideMillisecond){ //msg=要顯示的訊息, forceHideMillisecond=強制隱藏的時間(預設不隱藏)
            ++eNursing.processStatus.callScheduleCount;
            var div = document.getElementById("div_eNursingProcessStatus");
            if (div==null){
                this.create();
                div = document.getElementById("div_eNursingProcessStatus");
            }
            if (msg){
                div.innerHTML=msg+"...";
                div.setAttribute("msg", msg);
            }
            div.style.display="block";
            this.setInterval_dot();
            //強制n秒後隱藏
            if (forceHideMillisecond){
                this.setTimeout_hide(forceHideMillisecond);
            }
        }, "hide" : function(isScheduleHide){ //true=排程結束才隱藏 / false=強制隱藏
            if (isScheduleHide){ //排程結束前不隱藏
                if (--eNursing.processStatus.callScheduleCount>0) return false;
            }
            eNursing.processStatus.callScheduleCount = 0; //排程的count數歸零
            var div = document.getElementById("div_eNursingProcessStatus");
            div.style.display="none";
            this.clearInterval_dot();
            return true;
        }, "create" : function(){
            try{
                var div = document.createElement("div");
                div.innerHTML = '讀取資料中';
                div.innerHTML = (languageMode=="Simplified Chinese") ? "读取资料中" : div.innerHTML;
                div.setAttribute("msg", div.innerHTML);
                div.id = 'div_eNursingProcessStatus';
                div.className = 'div_eNursingProcessStatus';
                div.style.display = 'none';
                document.body.insertBefore(div, document.body.firstChild);
            }catch(e){
                console.error(e);
            }
        }, "setInterval_dot" : function(){ //設定msg後方的 "..." 動態效果
            if (!this.interval_dot){
                this.ele = document.getElementById("div_eNursingProcessStatus");
                this.interval_dotCounts = 0;
                this.interval_dot = setInterval(function(){
                    var that = eNursing.processStatus;
                    ++that.interval_dotCounts;
                    that.ele.innerHTML = that.ele.getAttribute("msg")+"...".substr(2-that.interval_dotCounts%3);
                }, 500);
            }
        }, "clearInterval_dot" : function(){ //清除msg後方的 "..." 動態效果
            if (this.interval_dot){
                clearInterval(this.interval_dot);
                this.interval_dot=null;
            }
        }, "setTimeout_hide" : function(n){ //n毫秒後隱藏
            if (this.timeout_hide){
                clearTimeout(this.timeout_hide);
            }
            this.ele = document.getElementById("div_eNursingProcessStatus");
            this.timeout_hide = setTimeout(function(){
                eNursing.processStatus.hide();
            }, n);
        }
    };
    /*处理返回结果*/
    function processResult(data) {
        try {
            var result = JSON.parse(data);
            if (result) {
                // 如果有壓縮過的data，將其還原 壓縮函式：lz-string
                if (result.data_lz_string) {
                    var isHasLzString = false;
                    //測試是否引入 lz-string
                    try{
                        LZString.compressToUTF16('test12345');
                        isHasLzString = true;
                    }catch (e) {
                        console.error('尚未引入 lz-string!');
                    }
                    if (isHasLzString) {
                        try{
                            result.data = JSON.parse(LZString.decompressFromUTF16(result.data_lz_string));
                            result.data_lz_string = null;
                            console.log('lz-string ok!');
                        }catch (e) {
                            console.error('解壓縮 lz-string 失敗!', e, 'data_lz_string=', result.data_lz_string);
                        }
                    }
                }
                var ext = result.resultMsg.ext;
                if (ext) {
                    eNursing.info("processResult: ext:" + ext + (eNursing.processCall ? (" in processCall:" + (ext in eNursing.processCall)) : " processCall is undefined"));
                    if (eNursing.processCall) {
                        var processCall = eNursing.processCall[ext];
                        if (processCall) {

                            // (加快效能) 如果有回調過就不回調
                            try{
                                //未設定加快效能，就直接回調
                                if (processCall[2]===undefined || processCall[2]===false){
                                    _successCall(result);
                                    return;
                                }else if (processCall[2] && processCall[3]){
                                    //未設定加快效能，就直接回調
                                    if (_pfm[processCall[2]] === false){
                                        _successCall(result);
                                        return;
                                    }
                                    //第一次執行，無暫存的data，回調
                                    else if (_pfm[processCall[2]] && !localStorage[processCall[3]]){
                                        _successCall(result);
                                    }
                                }
                                var st_result = JSON.stringify(result);
                                // (加快效能) 將資料存入localStorage，下次調用的時候優先回傳資料
                                if (eNursing.isArray(result.data)&&result.data.length){
                                    if (!localStorage[processCall[3]]){
                                        localStorage[processCall[3]] = st_result;
                                        return;
                                    }
                                    var result_old = JSON.parse(localStorage[processCall[3]]);
                                    localStorage[processCall[3]] = st_result;

                                    result.data[0].title=null;
                                    result_old.data[0].title=null;
                                    //false=要重整 true=不要重整 (是否"不要"在取得新版本的時候重新整理)
                                    if (_pfm.isDisabledRefreshAtNewVersion) {
                                        eNursing.processStatus.hide(true);
                                        return;
                                    }else{
                                        //有新版本要重整
                                        if (compreObj(result.data, result_old.data)===false) {
                                            if (languageMode=="Traditional Chinese"){
                                                eNursing.processStatus.show("發現新版本，即將重整頁面");
                                            }else{
                                                eNursing.processStatus.show("发现新版本，即将重整页面");
                                            }
                                            //如果有兩個以上的表單有新版本，移除上一個的重整線程，新發起一個重整線程
                                            if (eNursing.reloadTimeout){
                                                clearTimeout(eNursing.reloadTimeout);
                                                eNursing.reloadTimeout=null;
                                            }
                                            //1秒後重整
                                            eNursing.reloadTimeout = setTimeout(function () {
                                                location.reload();
                                            }, 1000);
                                        }

                                        //比較兩個object是否一致
                                        function compreObj(obj1, obj2) {
                                            var flag = true;
                                            compre(obj1, obj2);
                                            function compre(obj1, obj2) {
                                                //跳出遞迴
                                                if (flag === false) {
                                                    return false;
                                                }
                                                //比較型態、長度、是否一致(非json及非array)
                                                if (
                                                    (typeof obj1 !== typeof obj2)
                                                    || (Object.keys(obj1).length !== Object.keys(obj2).length)
                                                    || (typeof obj1 !== 'object' && obj1 !== obj2)
                                                ) {
                                                    flag = false;
                                                    return false;
                                                } else {
                                                    //array先排序
                                                    if (Array.isArray(obj1)) {
                                                        obj1 = obj1.sort()
                                                        obj2 = obj2.sort()
                                                    }
                                                    //比較object
                                                    for (var x in obj1) {
                                                        if (obj2.hasOwnProperty(x)) {
                                                            if (obj1[x] !== obj2[x]) {
                                                                compre(obj1[x], obj2[x]);
                                                            }
                                                        } else if (typeof obj1[x] !=='function' && typeof obj2[x] !=='function') {
                                                            flag = false;
                                                            return false;
                                                        }
                                                    }
                                                }
                                            }
                                            if (flag === false) {
                                                return false;
                                            } else {
                                                return true;
                                            }
                                        }
                                    }
                                }else{
                                    localStorage.removeItem(processCall[3]);
                                }
                            }catch(e){
                                eNursing.error(e);
                                _successCall(result);
                            }

                            function _successCall(result){
                                var successCall = processCall[0];
                                if (successCall) {
                                    var t1 = new Date();
                                    successCall(result);
                                    eNursing.info("processCall cast:" + (new Date().getTime() - t1.getTime()) + "ms");
                                }
                            }
                        }
                    }
                }else {
                    /*.guide{
                    width:60px;margin-left:570px;position:fixed;left:50%;bottom:134px;
                    _position:absolute;
                    _top:expression(documentElement.scrollTop+documentElement.clientHeight - this.clientHeight - 134+'px');
                    display:block;}*/
                    var divTemp = document.createElement("div");
                    divTemp.style.width = "100%";
                    divTemp.style.textAlign = "center";
                    divTemp.style.display = "block";
                    divTemp.style.position = "fixed";
                    divTemp.style.zIndex = "1600";
                    var bodyTemp = document.body;
                    divTemp.style.bottom = "9%";
                    divTemp.innerHTML = "数据已更新，请注意查收！";
                    bodyTemp.appendChild(divTemp);
                    !function changeColor() {
                        if (divTemp) {
                            var color = divTemp.style.color;
                            divTemp.style.color = color === "red" ? "yellow" : "red";
                            setTimeout(changeColor, 300);
                        }
                    }();
                    setTimeout(function () {
                        bodyTemp.removeChild(divTemp);
                        divTemp = undefined;
                    }, 2500);
                }
            }
        } catch (e) {
            eNursing.error(e);
        }
    }

    /*设定webSocket*/
    eNursing.socketUrl = const_socketUrl;
    eNursing.createWebSocket=function(onopenCall, onerrorCall) {
        // if (localStorage) {
        //     var socketUrl = localStorage.getItem("socketUrl");
        //     if (socketUrl) {
        //         eNursing.socketUrl = socketUrl;
        //     }
        // }
        // eNursing.socketUrl = "wss://localhost:8443/MBNIS/websocket";
        if (window.WebSocket) {
            try{
                webSocket = new WebSocket(eNursing.socketUrl);
            }catch(e){
                const_socketEnable = false;
                eNursing.error("無法開啟webSocket");
                eNursing.error(e);
                if(const_webserviceEnable){
                    if (webService){
                        eNursing.error("關閉webSocket改用webService接口");
                        eNursing.webSocket = webService;
                        eNursing.sendMsg = eNursing.sendMsgWS;
                    }
                }
            }
        } else {
            try{
                webSocket = new WebSocketImpl(eNursing.socketUrl, "");
                webSocket.connect();
            }catch(e){
                const_socketEnable = false;
                eNursing.error("無法開啟webSocket");
                eNursing.error(e);
                if(const_webserviceEnable){
                    if (webService){
                        eNursing.error("關閉webSocket改用webService接口");
                        eNursing.webSocket = webService;
                        eNursing.sendMsg = eNursing.sendMsgWS;
                    }
                }
            }
        }

        webSocket.onopen = function () {
            eNursing.info("Socket is connected");
            if (!eNursing.isBlankObj(eNursing.waitSendMsg)) {
                eNursing.info('start to resend -->',eNursing.waitSendMsg);
                for (var k in eNursing.waitSendMsg) {
                    if (eNursing.waitSendMsg.hasOwnProperty(k)) {
                        var arguments = eNursing.waitSendMsg[k];
                        /*sendMsg(process, argument, param, ext, successCall, errorCall,action)*/
                        if (arguments) {
                            webSocket.sendMsg.apply(webSocket,arguments);
                        }
                        delete eNursing.waitSendMsg[k];
                    }
                }
            }
            if (onopenCall) onopenCall();
        };

        webSocket.onerror = function (exception) {
            if (webSocket.readyState === WebSocket.OPEN) {
                eNursing.error(exception);
            }
            if (onerrorCall) onerrorCall();
        };

        webSocket.sendMsg = eNursing.sendMsg = function (process, argument, param, ext, successCall, errorCall, rewrite,beCoveredAction, performance,requestUrl,requestType) {
            var processTemp = process + (eNursing.isString(argument) ? "." + argument : "");
            if (webSocket.readyState === WebSocket.OPEN) {
                var tmpMsg = "连线正常，" + processTemp + "发送中...";
                eNursing.info(tmpMsg);
                var uuid = ext || UUID();
                eNursing.tempSendMsg = eNursing.tempSendMsg || {};
                var UUIDs=eNursing.tempSendMsg[processTemp]||[];
                if (beCoveredAction) {
                    var oldUUIDs = eNursing.tempSendMsg[beCoveredAction];
                    if (oldUUIDs) {
                        for (var i = 0; i < oldUUIDs.length; i++) {
                            delete eNursing.processCall[oldUUIDs[i]];
                        }
                    }
                }
                if (rewrite) {
                    if (UUIDs) {
                        for (var i = 0; i < UUIDs.length; i++) {
                            delete eNursing.processCall[UUIDs[i]];
                        }
                        UUIDs = [];
                    }
                }
                UUIDs.push(uuid);
                eNursing.tempSendMsg[processTemp] = UUIDs;
                eNursing.processCall = eNursing.processCall || {};
                eNursing.processCall[uuid] = [successCall, errorCall];
                var json = {
                    process: process,
                    param: param,
                    argument: eNursing.toData(argument),
                    ext: uuid,
                    gformServiceUrl:const_gformServiceUrl,
                    fileServiceUrl:window.const_fileServiceUrl,
                    requestUrl:requestUrl || "",
                    requestType:requestType || ""
                };
                webSocket.send(eNursing.toJson(json));
            } else {
                var tmpMsg = "连线中断，" + processTemp + "已加入待发送队列";
                eNursing.info(tmpMsg);
                eNursing.waitSendMsg = eNursing.waitSendMsg || {};
                if (!eNursing.waitSendMsg.hasOwnProperty(processTemp))
                    eNursing.waitSendMsg[processTemp] = arguments;
            }
        };

        webSocket.onmessage = function (evt) {
            var data = evt.data;
            eNursing.info("webSocket.onmessage,data:",data);
            if (data == null || data.length === 0) {
                eNursing.info("无结果返回!");
            } else {
                setTimeout(processResult, 0, data);
            }
        };

        webSocket.onclose = function (e) {
            eNursing.error("webSocket is closed!");
            eNursing.error(e.reason);
            if (webSocket.dontCreate!=true){
                setTimeout(eNursing.createWebSocket, 10);
            }
        };

        //視窗關閉或location.href時關閉不必要的webSocket連線
        if (window.onbeforeunload!==undefined&&window.closeWs){
            window.onbeforeunload = function() {
                try{
                    webSocket.dontCreate = true;
                    webSocket.close();
                }catch(e){
                }
            };
        }

        //視窗關閉或location.href時關閉不必要的webSocket連線
        if (window.onunload!==undefined&&window.closeWs){
            window.onunload = function() {
                try{
                    webSocket.dontCreate = true;
                    webSocket.close();
                }catch(e){
                }
            };
        }

    };
    var webSocket = {};
    if(const_socketEnable)
        eNursing.createWebSocket();

    /*设定webService*/
    var webService = {};
    var XMLHttp = {};
    eNursing.serviceUrl = const_webserviceUrl;  // 127.0.0.1改localhost會報錯
    if(const_webserviceEnable)
        (function createWebService() {
            // if (localStorage) {
            //     var serviceUrl = localStorage.getItem("serviceUrl");
            //     if (serviceUrl) {
            //         eNursing.serviceUrl = serviceUrl;
            //     }
            // }

            webService.onload=function(evt){
                var data = evt.responseText;
                eNursing.info("webService.onload,data:",data);
                if (data == null || data.length === 0) {
                    eNursing.info("无结果返回!");
                } else {
                    processResult(data);
                }
                eNursing.processStatus.hide(true);
            };
            webService.onerror = function (that,successCall, errorCall) {
                if (that.status==500){
                    eNursing.error("伺服器未響應");
                    eNursing.error(that.statusText);
                    errorCall("伺服器未響應");
                }else{
                    eNursing.error(that.statusText);
                    errorCall(that.statusText);
                }
            };

            XMLHttp = {
                _objPool: [],
                _processIng: false,
                _waitPool: [],
                _getInstance: function (){
                    for (var i = 0; i < this._objPool.length; i ++){
                        // if (this._objPool[i].readyState == 0 || this._objPool[i].readyState == 4){
                        if (this._objPool[i].finish === true){
                            try{
                                this._objPool[i].finish = false;
                            }catch(e){}
                            return this._objPool[i];
                        }
                    }
                    //  IE5中不支持push方法
                    this._objPool[this._objPool.length] = this._createObj();
                    return this._objPool[this._objPool.length - 1];
                },
                _createObj: function (){
                    return window.XMLHttpRequest?new XMLHttpRequest():new ActiveXObject("Microsoft.XMLHTTP");
                },
                sendReq: function(data, successCall, errorCall){
                    var xhr = this._getInstance();
                    xhr.onreadystatechange = function (oEvent) {
                        // [readyState]
                        // 0   UNSENT  最初始状态，还未调用open方法
                        // 1   OPENED  已经调用了open方法
                        // 2   HEADERS_RECEIVED    已经调用了send方法，响应的HTTP头部和状态可以获取
                        // 3   LOADING 正在下载数据，下载的数据还不完整
                        // 4   DONE    数据下载完成
                        if (this.readyState === 2){
                            if (XMLHttp._waitPool.length>0){
                                XMLHttp._processIng = true;
                                XMLHttp._waitPool[0].xhr.send(XMLHttp._waitPool[0].data);
                                XMLHttp._waitPool.splice(0,1);
                            }else{
                                XMLHttp._processIng = false;
                            }
                        }else if (this.readyState === 4) {
                            if (this.status === 200) {
                                this.finish = true;
                                webService.onload(this,successCall, errorCall);
                            } else if (this.status === 500) {
                                webService.onerror(this,successCall, errorCall);
                            } else {
                                webService.onerror(this,successCall, errorCall);
                            }
                        }
                    };
                    xhr.open('POST',eNursing.serviceUrl,true);
                    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                    if (this._processIng===false){
                        this._processIng = true;
                        xhr.send(data);
                    }else{
                        this._waitPool[this._waitPool.length]={xhr: xhr, data: data};
                    }
                }
            };

            webService.sendMsg = eNursing.sendMsgWS = function (process, argument, param, ext, successCall, errorCall, rewrite, beCoveredAction, performance,requestUrl,requestType) {
                //若關閉MBNIS緩存機制，要傳送清除緩存的指令給MBNIS
                try{
                    if (performance && _pfm.isDisabledMbnisStorage){
                        //5秒內清除一次即可，不用連續清
                        if (eNursing.disabledMbnisStorageTimeout){
                            clearTimeout(eNursing.disabledMbnisStorageTimeout);
                        }
                        eNursing.disabledMbnisStorageTimeout = setTimeout(function(){
                            console.log("已關閉MBNIS緩存，自動清除MBNIS緩存-start");
                            eNursing.clearMbnisStorage(function(){
                                console.log("已關閉MBNIS緩存，自動清除MBNIS緩存-success");
                            });
                            delete eNursing.disabledMbnisStorageTimeout;
                        }, 5000);
                    }
                }catch(e){
                    console.error("偵測到疑似properties.js未宣告_pfm.isDisabledMbnisStorage", e);
                }
                //(加快效能) 如果有取過資料，就優先返回資料，然後再於背景查資料
                try{
                    if (performance && _pfm[performance] && localStorage[param.node]){
                        console.log("使用暫存的資料 -> "+performance+"\nparam.node="+param.node);
                        successCall(JSON.parse(localStorage[param.node]));
                    }
                }catch(e){
                    console.error("偵測到疑似properties.js未宣告_pfm[\""+performance+"\"]", e);
                }
                //顯示調用MBNIS的提示訊息
                if (languageMode=="Traditional Chinese"){
                    eNursing.processStatus.show("表單載入中，請耐心等候", 3000);
                }else{
                    eNursing.processStatus.show("表单载入中，请耐心等候", 3000);
                }

                var uuid = ext || UUID();
                var json = {
                    process: process,
                    param: param,
                    argument: eNursing.toData(argument),
                    ext: uuid,
                    gformServiceUrl:const_gformServiceUrl,
                    fileServiceUrl:window.const_fileServiceUrl,
                    requestUrl:requestUrl || "",
                    requestType:requestType || ""
                };
                eNursing.processCall = eNursing.processCall || {};
                eNursing.processCall[uuid] = [successCall, errorCall, performance, param.node];
                XMLHttp.sendReq(eNursing.toJson(json), successCall, errorCall);
            };
        })();

    if (const_socketEnable)
        eNursing.webSocket = webSocket;
    else if(const_webserviceEnable){
        eNursing.info("不啟用webSocket，將webSocket口重新導向webService");
        eNursing.webSocket = webService;
        eNursing.sendMsg = eNursing.sendMsgWS;
    }

    if (const_webserviceEnable)
        eNursing.webService = webService;
    else if(const_socketEnable){
        eNursing.info("不啟用webService，將webService口重新導向webSocket");
        eNursing.webService = webSocket;
        eNursing.sendMsgWS = eNursing.sendMsg;
    }

    !function createWebXMLHttp() {
        var webXMLHttp={};
        webXMLHttp.onmessage=function(evt){
            var data = evt.responseText;
            eNursing.info("webXMLHttp.onmessage,data:",data);
            if (data == null || data.length === 0) {
                eNursing.info("无结果返回!");
            } else {
                data = '{"data":' + data + ',"resultMsg":{"success":true,"ext":"'+evt.ext+'"}}';
                setTimeout(processResult,0,data);
            }
        };
        webXMLHttp.onerror = function (that,successCall, errorCall) {
            if (that.status===500){
                eNursing.error("伺服器未響應");
                eNursing.error(that.statusText);
                errorCall("伺服器未響應");
            }else{
                eNursing.error(that.statusText);
                errorCall(that.statusText);
            }
        };

        var XMLHttp = {
            _objPool: [],
            _processIng: false,
            _waitPool: [],
            _getInstance: function (){
                for (var i = 0; i < this._objPool.length; i ++){
                    // if (this._objPool[i].readyState == 0 || this._objPool[i].readyState == 4){
                    if (this._objPool[i].finish === true){
                        try{
                            this._objPool[i].finish = false;
                        }catch(e){}
                        return this._objPool[i];
                    }
                }
                //  IE5中不支持push方法
                this._objPool[this._objPool.length] = this._createObj();
                return this._objPool[this._objPool.length - 1];
            },
            _createObj: function (){
                return window.XMLHttpRequest?new XMLHttpRequest():new ActiveXObject("Microsoft.XMLHTTP");
            },
            sendRequest: function(customUrl,ext,data, successCall, errorCall){
                var xhr = this._getInstance();
                xhr.onreadystatechange = function (oEvent) {
                    // [readyState]
                    // 0   UNSENT  最初始状态，还未调用open方法
                    // 1   OPENED  已经调用了open方法
                    // 2   HEADERS_RECEIVED    已经调用了send方法，响应的HTTP头部和状态可以获取
                    // 3   LOADING 正在下载数据，下载的数据还不完整
                    // 4   DONE    数据下载完成
                    if (this.readyState === 2){
                        if (XMLHttp._waitPool.length>0){
                            XMLHttp._processIng = true;
                            XMLHttp._waitPool[0].xhr.send(XMLHttp._waitPool[0].data);
                            XMLHttp._waitPool.splice(0,1);
                        }else{
                            XMLHttp._processIng = false;
                        }
                    }else if (this.readyState === 4) {
                        if (this.status === 200) {
                            this.finish = true;
                            this.ext=ext;
                            webXMLHttp.onmessage(this,successCall, errorCall);
                        } else if (this.status === 500) {
                            webXMLHttp.onerror(this,successCall, errorCall);
                        } else {
                            webXMLHttp.onerror(this,successCall, errorCall);
                        }
                    }
                };
                xhr.open('POST',customUrl,true);
                xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                if (!this._processIng){
                    this._processIng = true;
                    xhr.send(data);
                }else{
                    this._waitPool[this._waitPool.length]={xhr: xhr, data: data};
                }
            }
        };

        webXMLHttp.sendMsg = eNursing.sendMsgCustom = function (process, argument, param, ext, successCall, errorCall, rewrite,beCoveredAction) {
            var customUrl = arguments[arguments.length-1];
            if (customUrl) {
                var uuid = ext || UUID();
                eNursing.processCall = eNursing.processCall || {};
                eNursing.processCall[uuid] = [successCall, errorCall];
                XMLHttp.sendRequest(customUrl,uuid,eNursing.toJson(argument), successCall, errorCall);
            }
        };
    }();


    /**
     * @return {string}
     */
    eNursing.UUID=UUID;
    function UUID(len, radix) {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [], i;
        radix = radix || chars.length;

        if (len) {
            // Compact form
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
            // rfc4122, version 4 form
            var r;

            // rfc4122 requires these characters
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';

            // Fill in random data. At i==19 set the high bits of clock sequence as
            // per rfc4122, sec. 4.1.5
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }
        return uuid.join('');
    }

    function getFnName(fn){
        return fn.name || (/^function\s+([^(]+)/g.test(fn) ? RegExp.$1 : "");
    }
    eNursing.getFnName=getFnName;

    eNursing.preload = "preload";

    function evalByReturn(scriptStr){
        return Function('"use strict";return ('+scriptStr+')')();
    }

    function Nursing() {
        this.nodeId = eNursing.getFnName(Nursing);
        this.nodeValue = null;
        this.parent = null;
        this.index = undefined;
        this.data = {};

        this.setNodeId = function (nodeId) {
            this.nodeId = nodeId;
        };
        this.setNodeValue = function (nodeValue) {
            this.nodeValue = nodeValue;
        };

        this.setParent = function (parent) {
            this.parent = parent;
        };
        var class2type = {};
        var toString = class2type.toString;
        var types = "Boolean Number String Function Array Date RegExp Object Error".split(" ");
        for (var i = 0; i < types.length; i++) {
            var name = types[i];
            class2type["[object " + name + "]"] = name.toLowerCase();
        }
        var type = function (obj) {
            if (obj == null) {
                return obj + "";
            }
            return typeof obj === "object" || typeof obj === "function" ?
                class2type[toString.call(obj)] || "object" :
                typeof obj;
        };

        function isNumber(obj) {
            return type(obj) === "number";
        }

        eNursing.isNumber = isNumber;

        function isBoolean(obj) {
            return type(obj) === "boolean";
        }

        eNursing.isBoolean = isBoolean;

        function isString(obj) {
            return type(obj) === "string";
        }

        eNursing.isString = isString;

        function isFunction(obj) {
            return type(obj) === "function";
        }

        eNursing.isFunction = isFunction;

        function isUndefined(obj) {
            return type(obj) === "undefined";
        }

        eNursing.isUndefined = isUndefined;

        var isArray = eNursing.isArray = Array.isArray || function (obj) {
            return type(obj) === "array";
        };

        function isWindow(obj) {
            /* jshint eqeqeq: false */
            return obj != null && obj === obj.window;
        }

        eNursing.isWindow = isWindow;

        function isObject(obj) {
            // Must be an Object.
            // Because of IE, we also have to check the presence of the constructor property.
            // Make sure that DOM nodes and window objects don't pass through, as well
            if (type(obj) === "object") {
                if (obj.nodeType || isWindow(obj)) {
                    return false;
                } else {
                    return true;
                }
            }
            return false;
        }

        eNursing.isObject = isObject;

        function canDirectlyToJson(obj) {
            return isString(obj) || isBoolean(obj) || isNumber(obj);
        }

        eNursing.canDirectlyToJson = canDirectlyToJson;

        function extend() {
            var src, copyIsArray, copy, name, options, clone,
                target = arguments[0] || {},
                i = 1,
                length = arguments.length,
                deep = false;

            // Handle a deep copy situation
            if (isBoolean(target)) {
                deep = target;

                // skip the boolean and the target
                target = arguments[i] || {};
                i++;
            }

            // Handle case when target is a string or something (possible in deep copy)
            if (!(isObject(target) || isFunction(target))) {
                target = {};
            }

            // extend eQuery itself if only one argument is passed
            if (i === length) {
                target = this;
                i--;
            }

            for (; i < length; i++) {
                // Only deal with non-undefined/undefined values
                if ((options = arguments[i]) != null) {
                    // Extend the base object
                    for (name in options) {
                        src = target[name];
                        copy = options[name];

                        // Prevent never-ending loop
                        if (target === copy) {
                            continue;
                        }

                        // Recurse if we're merging plain objects or arrays
                        if (deep && copy && (isObject(copy) || (copyIsArray = isArray(copy)))) {
                            if (copyIsArray) {
                                copyIsArray = false;
                                clone = src && isArray(src) ? src : [];

                            } else {
                                clone = src && isObject(src) ? src : {};
                            }

                            // Never move original objects, clone them
                            target[name] = clone(deep, clone, copy);

                            // Don't bring in undefined values
                        } else /*if (copy !== null)*/ {
                            target[name] = copy;
                        }
                    }
                }
            }

            // Return the modified object
            return target;
        }

        eNursing.extend = extend;

        var clone = this.clone = function () {
            return extend({}, arguments[0] || this);
        };
        var toLowerFirst = eNursing.toLowerFirst = function (node) {
            return node.replace(/^[A-Z]/g,function(v){return v.toLowerCase();});
        };
        this.cloneProperty = function (original) {
            var valueTmp = original[toLowerFirst(this.nodeId)];
            var title;
            if (isObject(valueTmp)) {
                if (isObject(original.title)) {
                    title = original.title;
                }
                original = valueTmp;
            }
            for (var k in this) {
                /*if (this.hasOwnProperty(k)) */
                {
                    var v = this[k],
                        originalV = original[k];
                    if (!isFunction(v))
                        if (originalV) {
                            if (isObject(v)) {
                                if (v instanceof Array) {
                                    var temps = [];
                                    if (v[0] && isObject(v[0])) {
                                        for (var i = 0; i < originalV.length; i++) {
                                            var tmp;
                                            tmp = v[0].clone();
                                            tmp.cloneProperty(originalV[i]);
                                            tmp.index = i;
                                            temps[i] = tmp;

                                        }
                                    } else {
                                        temps = originalV;
                                    }
                                    v = temps;
                                } else if (isFunction(v.cloneProperty)) {
                                    v.cloneProperty(originalV);
                                }
                            } else {
                                v = originalV;
                            }
                            this[k] = v;
                        }
                }
            }
            return new Data(title, this);
        };

        this.getNode = function () {
            if (this.parent != null) {
                if (this.nodeValue != null && this.nodeValue !== '') {
                    return this.parent.getNode() + "." + this.nodeId + "['" + this.nodeValue + "']";
                } else {
                    return this.parent.getNode() + "." + this.nodeId;
                }

            } else {
                return this.nodeId + (this.nodeValue != null && this.nodeValue !== '' ? ("['" + this.nodeValue + "']") : "");
            }
        };

        var regexNode = /\['[^\[\]]+']/g;
        this.getNodeNoValue = function () {
            return this.getNode().replace(regexNode, "");
        };
        var isIndex = function (index) {
            if (index !== undefined) {
                if (isArray(index)) {
                    for (var j = 0; j < index.length; j++) {
                        if (!isIndex(index[j])) {
                            return false;
                        }
                    }
                    return index.length > 0;
                } else if (/^\d+$/g.test(index)) {
                    return true;
                }
            }
            return false;
        };
        this.createSelf = function (index, init, withTitle) {
            var self = evalByReturn("nursing.create" + this.nodeId + "(" + init + ")"),
                item;
            if (isIndex(index)) {
                index = index * 1;
                var dataItem = this.data[index];
                item = self.cloneProperty(dataItem);
            }
            return withTitle ? item : self;
        };
        this.setCurrent = function (currentIndex) {
            this.setCache(currentIndex);
        };
        this.getCurrentIndex = function () {
            this.getData();
            return this.data.currentIndex;
        };
        this.getCurrent = function (init, withTitle) {
            if (!init) {
                var currentIndex = this.getCurrentIndex();
                if (currentIndex !== undefined) {
                    if (isArray(currentIndex)) {
                        var dataTmp = [];
                        for (var i = 0; i < currentIndex.length; i++) {
                            dataTmp.push(this.createSelf(currentIndex[i], init, withTitle));
                        }
                        return dataTmp;
                    } else {
                        return this.createSelf(currentIndex, init, withTitle);
                    }
                }
            } else {
                return this;
            }
        };

        function getNodeValue(target, node) {
            if (target && node) {
                if (isArray(node)) {
                    var nodeValue = [];
                    for (var i = 0; i < node.length; i++) {
                        nodeValue.push(getNodeValue(target, node[i]));
                    }
                    return nodeValue.join(",");
                } else if (isString(node)) {
                    var ind = node.indexOf(".");
                    if (ind > -1) {
                        return getNodeValue(target[node.slice(0, ind)], node.slice(ind));
                    } else {
                        return target[node];
                    }
                }
            }
        }

        this.setCache = function () {
            var type, content, dataDb, node, currentIndex;
            if (arguments) {
                type = arguments[0];
                content = arguments[1];
                dataDb = arguments[2];
                node = arguments[3];
                currentIndex = arguments[4];
                if (isIndex(arguments[0])) {
                    currentIndex = arguments[0];
                    type = undefined;
                } else if (isData(arguments[0])) {
                    content = arguments[0];
                    type = undefined;
                } else if (isArray(arguments[0])) {
                    dataDb = arguments[0];
                    if (isString(arguments[1]) || isArray(arguments[1])) {
                        node = arguments[1];
                    }

                    if (isIndex(arguments[1])) {
                        currentIndex = arguments[2];
                        node = undefined;
                    } else if (isIndex(arguments[2])) {
                        currentIndex = arguments[2];
                    }
                    type = undefined;
                    content = undefined;
                }
            }
            if (isArray(dataDb)) {
                this.clearData();
                content = this.data;
                var tempMap = {}, tempArray = undefined;
                if (node !== undefined) {
                    tempArray = [];
                    for (var i = 0; i < dataDb.length; i++) {
                        var dataItem = dataDb[i][toLowerFirst(this.nodeId)];
                        var nodeV = getNodeValue(dataItem, node);
                        if (tempMap[nodeV]) {
                            if (dataDb[i].title != null && dataDb[i].title.ts != null) {
                                if (new Date(tempMap[nodeV].title.ts).getTime() < new Date(dataDb[i].title.ts).getTime()) {
                                    tempMap[nodeV] = dataDb[i];
                                }
                            }
                        } else {
                            tempMap[nodeV] = dataDb[i];
                            tempArray.push(nodeV);
                        }
                    }
                }
                tempArray = tempArray || dataDb;
                for (var j = 0; j < tempArray.length; j++) {
                    var itSelf = this.createSelf();
                    itSelf.index = j;
                    content[itSelf.index] = itSelf.cloneProperty(tempMap[tempArray[j]] || tempArray[j]);
                    if (node !== undefined) {
                        itSelf.setNodeValue(getNodeValue(itSelf, node));
                    }
                }
                this.data.length = tempArray.length;
                tempMap = undefined;
                tempArray = undefined;
            }
            if (isIndex(currentIndex)) {
                this.data.currentIndex = currentIndex;
                if (content) {
                    content.currentIndex = currentIndex;
                }
            }
            type = type || this.getNodeNoValue();
            content = content || toData(this.data);
            try{
                localStorage[type] = canDirectlyToJson(content) ? content : toJson(content);
            }catch (e) {
                eNursing.error(e);
            }
        };
        this.getCache = function (type, successCall, errorCall) {
            if (isFunction(arguments[0])) {
                if (isFunction(arguments[1])) {
                    errorCall = arguments[1];
                }
                successCall = arguments[0];
                type = undefined;
            }
            var typeTmp = type || this.getNodeNoValue();
            var localStorageElement = localStorage[typeTmp];
            if (localStorageElement) {
                try {
                    var cache = JSON.parse(localStorageElement);
                    successCall(cache);
                } catch (e) {
                    if (isFunction(errorCall)) {
                        errorCall(e);
                    }
                }
            } else {
                if (isFunction(errorCall)) {
                    errorCall("该组没有数据！");
                }
            }
        };
        this.clearData = function () {
            var type = arguments[0],
                index = arguments[1];
            if (isIndex(arguments[0])) {
                index = arguments[0];
                type = undefined;
            }
            type = type || this.getNodeNoValue();

            if (isIndex(index)) {
                if (isArray(index)) {
                    for (var i = 0; i < index.length; i++) {
                        delete this.data[index[i]];
                    }
                } else {
                    delete this.data[index];
                }
                this.setCache();
            } else {
                this.data = {};
                localStorage.removeItem(type);
            }
        };

        function isBlankObj(obj) {
            if (obj) {
                for (var k in obj) {
                    if (obj.hasOwnProperty(k)) {
                        return false;
                    }
                }
            }
            return true;
        }

        eNursing.isBlankObj = isBlankObj;

        function isNotBlankObj(obj) {
            if (obj) {
                for (var k in obj) {
                    if (obj.hasOwnProperty(k)) {
                        return true;
                    }
                }
            }
            return false;
        }

        eNursing.isNotBlankObj = isNotBlankObj;
        /*下标:int，无title:boolean*/
        this.getData = function () {
            var index, noTitle;
            if (arguments) {
                index = arguments[0];
                noTitle = arguments[1];
                if (isBoolean(arguments[0])) {
                    noTitle = arguments[0];
                    index = undefined;
                }
            }
            var data = this.data;
            if (isBlankObj(data)) {
                this.getCache(function (cache) {
                    data = cache || data;
                });
                this.data = data;
            }
            if (noTitle)
                data = toData(data, this.nodeId);
            if (index !== undefined) {
                if (isArray(index)) {
                    var tmp = {};
                    for (var j = 0; j < index.length; j++) {
                        if (isIndex(index[j])) {
                            tmp[index[j]] = data[index[j]];
                        }
                    }
                    return tmp;
                } else if (isIndex(index)) {
                    return data[index];
                }
            } else {
                return data;
            }
        };

        function isData(obj) {
            if (isObject(obj)) {
                for (var k in obj) {
                    if (obj.hasOwnProperty(k)) {
                        if (!(/(^currentIndex$)|(^length$)/g.test(k)
                            || (/(^\d+$)/g.test(k) && isDataDb(obj[k]))
                        )) {
                            return false;
                        }
                    }
                }
                return true;
            }
            return false;
        }

        eNursing.isData = isData;

        function isDataDb(obj) {
            if (isObject(obj)) {
                for (var k in obj) {
                    if (obj.hasOwnProperty(k) && !isFunction(obj[k])) {
                        if (!(k === 'title' || toLowerFirst(obj[k].nodeId) === k)) {
                            return false;
                        }
                    }
                }
                return true;
            }
            return false;
        }

        eNursing.isDataDb = isDataDb;

        function toData(target, reverse) {
            var tmp;
            if (isArray(target)) {
                var arrayTmp = [];
                for (var i = 0; i < target.length; i++) {
                    arrayTmp.push(toData(target[i], reverse));
                }
                return arrayTmp;
            } else if (isData(target)) {
                tmp = {};
                for (var k in target) {
                    if (target.hasOwnProperty(k)) {
                        if (/(^\d+$)/g.test(k)) {
                            tmp[k] = toData(target[k], reverse)
                        } else if (/(^currentIndex$)|(^length$)/g.test(k)) {
                            tmp[k] = target[k];
                        }
                    }
                }
                return tmp;
            } else if (isObject(target.title)) {
                if (reverse) {
                    tmp = target[toLowerFirst(reverse)];
                } else if (isDataDb(target)) {
                    return target;
                } else {
                    var targetC = clone(target);
                    tmp = {title: targetC.title};
                    delete targetC.title;
                    tmp[toLowerFirst(targetC.nodeId)] = targetC;
                }
                return tmp;
            } else {
                return target;
            }
        }

        eNursing.toData = toData;

        function toJson(jsonObj) {
            var getCircularReplacer = function () {
                var seen = [];
                return function (key, value) {
                    if (isObject(value) && value != null) {
                        if (seen.indexOf(value) > -1) {
                            return;
                        }
                        seen.push(value);
                    }
                    return value == null ? undefined : value;
                };
            };
            return JSON.stringify(jsonObj, getCircularReplacer());
        }

        eNursing.toJson = toJson;
        /*发送*/
        this.sendMsg = function (process, argument, param, ext, successCall, errorCall, rewrite,beCoveredAction){
            var customUrl= (window.apiMap||{})[process];
            if(customUrl){
                arguments[arguments.length] = customUrl;
                arguments.length += 1;
                return eNursing.sendMsgCustom.apply(eNursing,arguments);
            }else{
                return eNursing.sendMsg.apply(eNursing,arguments)
            }
        }
    }

    //按F2可以回報ErrorMsg
    localStorage["F2ReportErrorMsg"] = "";
    eNursing.F2ReportErrorMsg = function(msg, errorCall){
        console.error(msg);
        //執行軌跡
        try{
            var ref = new Error('執行軌跡').stack;
            localStorage["F2ReportErrorMsg"] += "\n\n=========="+new Date().format("yyyy-MM-dd HH:mm:ss")+"\n" + ref;
        }catch(e){
            localStorage["F2ReportErrorMsg"] = "\n\n=========="+new Date().format("yyyy-MM-dd HH:mm:ss")+"\n產生Error物件發生錯誤"+e;
        }
        //錯誤訊息
        try{
            if (typeof(msg) === "object"){
                try{
                    msg = JSON.stringify(msg).replace(/\\r\\n/g, "\n").replace(/\\\"/g, "\"").replace(/\\t/g, "\t");
                }catch(e){}
            }
            localStorage["F2ReportErrorMsg"] += "\n\n=========="+new Date().format("yyyy-MM-dd HH:mm:ss")+"\n" + msg;
        }catch(e){
            localStorage["F2ReportErrorMsg"] = "\n\n=========="+new Date().format("yyyy-MM-dd HH:mm:ss")+"\n超過長度限制"+e;
        }
        if (errorCall) errorCall(msg);
        return false;
    };

    eNursing.Nursing = new Nursing();

    function Parameter() {
        this.node = null;
        this.action = null;
    }

    function ResultMsg() {
        this.success = null;
        this.message = null;
        this.ext = null;
        this.refreshDate = null;

    }

    function Data(title, item) {
        this[eNursing.toLowerFirst(Title.name)] = title;
        this[eNursing.toLowerFirst(item.nodeId)] = item;
        this.getItem = function () {
            return item;
        }
    }

    function Title(pk, ts) {
        this.pk = pk;
        this.ts = ts;
    }

    /*设定模组*/
    !function modulesHandler(){
        var modules;
        function put() {
            if (arguments) {
                var key=arguments[0],
                    value=arguments[1];
                if(eNursing.isFunction(arguments[0])){
                    value = arguments[0];
                    key = undefined;
                }
                if(eNursing.isFunction(value)){
                    modules=modules||{};
                    modules[key||eNursing.getFnName(value)]=value;
                    if(eNursing.init&&nursing){
                        if (!nursing["get" + eNursing.getFnName(value)]) {
                            eNursing.processModule(modules, value, nursing);
                        }
                    }
                }
            }
        }
        eNursing.addModule=put;
        function getModules(key) {
            return key?modules[key]:modules;
        }
        eNursing.getModules=getModules;
    }();

    /**/

    var core_strundefined = typeof undefined;
    var
        _eNursing = window.eNursing,
        _$N = window.$N;
    /*释放占用的$N全局变量*/
    eNursing.noConflict = function (deep) {
        if (window.$N === eNursing) {
            window.$N = _$N;
        }

        if (deep && window.eNursing === eNursing) {
            window.eNursing = _eNursing;
        }

        return eNursing;
    };

    if (typeof noGlobal === core_strundefined) {
        window.eNursing = window.$N = eNursing;
    }

    return eNursing;
});
