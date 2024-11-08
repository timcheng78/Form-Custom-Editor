/** jslint devel: true, newcap: true, white: true */
/**
 * MIT License
 * Copyright(c) 2013 essoduke.org
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 * and associated documentation files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 『AS IS』, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * jQuery TWzipcode 台灣 3+2 碼郵遞區號 jQuery 擴充套件
 * 在網頁上建立多組地址表單元件，使用者只要輸入地址即可取得 3+2 碼郵遞區號，完全不需資料庫。
 *
 * WEBSITE: http://app.essoduke.org/twzipcode32beta/
 * AUTHOR:  Essoduke Chang
 * VERSION: 1.4.0 BETA
 * MODIFY:  2014-01-09
 */
var twzipcode32_defaults = {
    'root': '../customFormV3/js2/',
    'data': 'twzipcode32_data/',
    'county': 'county',
    'district': 'district',
    'zipcode': 'zipcode',
    'address': 'address',
    'countySel': '',
    'districtSel': '',
    'addressSel': '',
    'zipcodeSel': '',
    'onCountyChange'      : null,
    'onDistrictChange'    : null,
    'onAddressChange'    : null,
    'onZipcodeChange'      : null,
    'css': ['county', 'district', 'zipcode', 'address']
},
twzipcode32_data = {
    '基隆市': {'仁愛區': '200', '信義區': '201', '中正區': '202', '中山區': '203', '安樂區': '204', '暖暖區': '205', '七堵區': '206', 'CODE': 'C'},
    '台北市': {'中正區': '100', '大同區': '103', '中山區': '104', '松山區': '105', '大安區': '106', '萬華區': '108', '信義區': '110', '士林區': '111', '北投區': '112', '內湖區': '114', '南港區': '115', '文山區': '116', 'CODE': 'A'},
    '新北市': {
        '萬里區': '207', '金山區': '208', '板橋區': '220', '汐止區': '221', '深坑區': '222', '石碇區': '223',
        '瑞芳區': '224', '平溪區': '226', '雙溪區': '227', '貢寮區': '228', '新店區': '231', '坪林區': '232',
        '烏來區': '233', '永和區': '234', '中和區': '235', '土城區': '236', '三峽區': '237', '樹林區': '238',
        '鶯歌區': '239', '三重區': '241', '新莊區': '242', '泰山區': '243', '林口區': '244', '蘆洲區': '247',
        '五股區': '248', '八里區': '249', '淡水區': '251', '三芝區': '252', '石門區': '253', 'CODE': 'F'
    },
    '宜蘭縣': {
        '宜蘭市': '260', '頭城鎮': '261', '礁溪鄉': '262', '壯圍鄉': '263', '員山鄉': '264', '羅東鎮': '265',
        '三星鄉': '266', '大同鄉': '267', '五結鄉': '268', '冬山鄉': '269', '蘇澳鎮': '270', '南澳鄉': '272',
        '釣魚台列嶼': '290', 'CODE': 'G'
    },
    '新竹市': {'東區': '300', '北區': '300', '香山區': '300', 'CODE': 'O'},
    '新竹縣': {
        '竹北市': '302', '湖口鄉': '303', '新豐鄉': '304', '新埔鎮': '305', '關西鎮': '306', '芎林鄉': '307',
        '寶山鄉': '308', '竹東鎮': '310', '五峰鄉': '311', '橫山鄉': '312', '尖石鄉': '313', '北埔鄉': '314',
        '峨嵋鄉': '315', 'CODE': 'J'
    },
    '桃園縣': {
        '中壢市': '320', '平鎮市': '324', '龍潭鄉': '325', '楊梅鎮': '326', '新屋鄉': '327', '觀音鄉': '328',
        '桃園市': '330', '龜山鄉': '333', '八德市': '334', '大溪鎮': '335', '復興鄉': '336', '大園鄉': '337',
        '蘆竹鄉': '338', 'CODE': 'H'
    },
    '苗栗縣': {
        '竹南鎮': '350', '頭份鎮': '351', '三灣鄉': '352', '南庄鄉': '353', '獅潭鄉': '354', '後龍鎮': '356',
        '通霄鎮': '357', '苑裡鎮': '358', '苗栗市': '360', '造橋鄉': '361', '頭屋鄉': '362', '公館鄉': '363',
        '大湖鄉': '364', '泰安鄉': '365', '銅鑼鄉': '366', '三義鄉': '367', '西湖鄉': '368', '卓蘭鎮': '369',
        'CODE': 'K'
    },
    '台中市': {
        '中區': '400', '東區': '401', '南區': '402', '西區': '403', '北區': '404', '北屯區': '406', '西屯區': '407', '南屯區': '408',
        '太平區': '411', '大里區': '412', '霧峰區': '413', '烏日區': '414', '豐原區': '420', '后里區': '421',
        '石岡區': '422', '東勢區': '423', '和平區': '424', '新社區': '426', '潭子區': '427', '大雅區': '428',
        '神岡區': '429', '大肚區': '432', '沙鹿區': '433', '龍井區': '434', '梧棲區': '435', '清水區': '436',
        '大甲區': '437', '外埔區': '438', '大安區': '439', 'CODE': 'B'
    },
    '彰化縣': {
        '彰化市': '500', '芬園鄉': '502', '花壇鄉': '503', '秀水鄉': '504', '鹿港鎮': '505', '福興鄉': '506',
        '線西鄉': '507', '和美鎮': '508', '伸港鄉': '509', '員林鎮': '510', '社頭鄉': '511', '永靖鄉': '512',
        '埔心鄉': '513', '溪湖鎮': '514', '大村鄉': '515', '埔鹽鄉': '516', '田中鎮': '520', '北斗鎮': '521',
        '田尾鄉': '522', '埤頭鄉': '523', '溪州鄉': '524', '竹塘鄉': '525', '二林鎮': '526', '大城鄉': '527',
        '芳苑鄉': '528', '二水鄉': '530', 'CODE': 'N'
    },
    '南投縣': {
        '南投市': '540', '中寮鄉': '541', '草屯鎮': '542', '國姓鄉': '544', '埔里鎮': '545', '仁愛鄉': '546',
        '名間鄉': '551', '集集鎮': '552', '水里鄉': '553', '魚池鄉': '555', '信義鄉': '556', '竹山鎮': '557',
        '鹿谷鄉': '558', 'CODE': 'M'
    },
    '嘉義市': {'東區': '600', '西區': '600', 'CODE': 'I'},
    '嘉義縣': {
        '番路鄉': '602', '梅山鄉': '603', '竹崎鄉': '604', '阿里山': '605', '中埔鄉': '606', '大埔鄉': '607',
        '水上鄉': '608', '鹿草鄉': '611', '太保市': '612', '朴子市': '613', '東石鄉': '614', '六腳鄉': '615',
        '新港鄉': '616', '民雄鄉': '621', '大林鎮': '622', '溪口鄉': '623', '義竹鄉': '624', '布袋鎮': '625',
        'CODE': 'Q'
    },
    '雲林縣': {
        '斗南鎮': '630', '大埤鄉': '631', '虎尾鎮': '632', '土庫鎮': '633', '褒忠鄉': '634', '東勢鄉': '635',
        '臺西鄉': '636', '崙背鄉': '637', '麥寮鄉': '638', '斗六市': '640', '林內鄉': '643', '古坑鄉': '646',
        '莿桐鄉': '647', '西螺鎮': '648', '二崙鄉': '649', '北港鎮': '651', '水林鄉': '652', '口湖鄉': '653',
        '四湖鄉': '654', '元長鄉': '655', 'CODE': 'P'
    },
    '台南市': {
        '中西區': '700', '東區': '701', '南區': '702', '北區': '704', '安平區': '708', '安南區': '709',
        '永康區': '710', '歸仁區': '711', '新化區': '712', '左鎮區': '713', '玉井區': '714', '楠西區': '715',
        '南化區': '716', '仁德區': '717', '關廟區': '718', '龍崎區': '719', '官田區': '720', '麻豆區': '721',
        '佳里區': '722', '西港區': '723', '七股區': '724', '將軍區': '725', '學甲區': '726', '北門區': '727',
        '新營區': '730', '後壁區': '731', '白河區': '732', '東山區': '733', '六甲區': '734', '下營區': '735',
        '柳營區': '736', '鹽水區': '737', '善化區': '741', '大內區': '742', '山上區': '743', '新市區': '744',
        '安定區': '745', 'CODE': 'D'
    },
    '高雄市': {
        '新興區': '800', '前金區': '801', '苓雅區': '802', '鹽埕區': '803', '鼓山區': '804', '旗津區': '805',
        '前鎮區': '806', '三民區': '807', '楠梓區': '811', '小港區': '812', '左營區': '813',
        '仁武區': '814', '大社區': '815', '岡山區': '820', '路竹區': '821', '阿蓮區': '822', '田寮鄉': '823',
        '燕巢區': '824', '橋頭區': '825', '梓官區': '826', '彌陀區': '827', '永安區': '828', '湖內鄉': '829',
        '鳳山區': '830', '大寮區': '831', '林園區': '832', '鳥松區': '833', '大樹區': '840', '旗山區': '842',
        '美濃區': '843', '六龜區': '844', '內門區': '845', '杉林區': '846', '甲仙區': '847', '桃源區': '848',
        '那瑪夏區': '849', '茂林區': '851', '茄萣區': '852', 'CODE': 'E'
    },
    '屏東縣': {
        '屏東市': '900', '三地門': '901', '霧臺鄉': '902', '瑪家鄉': '903', '九如鄉': '904', '里港鄉': '905',
        '高樹鄉': '906', '鹽埔鄉': '907', '長治鄉': '908', '麟洛鄉': '909', '竹田鄉': '911', '內埔鄉': '912',
        '萬丹鄉': '913', '潮州鎮': '920', '泰武鄉': '921', '來義鄉': '922', '萬巒鄉': '923', '崁頂鄉': '924',
        '新埤鄉': '925', '南州鄉': '926', '林邊鄉': '927', '東港鎮': '928', '琉球鄉': '929', '佳冬鄉': '931',
        '新園鄉': '932', '枋寮鄉': '940', '枋山鄉': '941', '春日鄉': '942', '獅子鄉': '943', '車城鄉': '944',
        '牡丹鄉': '945', '恆春鎮': '946', '滿州鄉': '947', 'CODE': 'T'
    },
    '台東縣': {
        '臺東市': '950', '綠島鄉': '951', '蘭嶼鄉': '952', '延平鄉': '953', '卑南鄉': '954', '鹿野鄉': '955',
        '關山鎮': '956', '海端鄉': '957', '池上鄉': '958', '東河鄉': '959', '成功鎮': '961', '長濱鄉': '962',
        '太麻里鄉': '963', '金峰鄉': '964', '大武鄉': '965', '達仁鄉': '966', 'CODE': 'V'
    },
    '花蓮縣': {
      '花蓮市': '970', '新城鄉': '971', '秀林鄉': '972', '吉安鄉': '973', '壽豐鄉': '974', '鳳林鎮': '975',
      '光復鄉': '976', '豐濱鄉': '977', '瑞穗鄉': '978', '萬榮鄉': '979', '玉里鎮': '981', '卓溪鄉': '982',
      '富里鄉': '983', 'CODE': 'U'
    },
    '金門縣': {'金沙鎮': '890', '金湖鎮': '891', '金寧鄉': '892', '金城鎮': '893', '烈嶼鄉': '894', '烏坵鄉': '896', 'CODE': 'W'},
    '連江縣': {'南竿鄉': '209', '北竿鄉': '210', '莒光鄉': '211', '東引鄉': '212', 'CODE': 'Z'},
    '澎湖縣': {'馬公市': '880', '西嶼鄉': '881', '望安鄉': '882', '七美鄉': '883', '白沙鄉': '884', '湖西鄉': '885', 'CODE': 'X'},
    '南海諸島': {'東沙': '817', '南沙': '819', 'CODE': 'E'}
};(function ($) {
    'use strict';

    // results list
    var results = [],
        lastpos = 0,
        // default settings
        defaults = twzipcode32_defaults,
        /**
         * keys code
         * @enum {number}
         */
        keys = {
            ENTER: 13,
            UP: 38,
            DOWN: 40,
            RIGHT: 39,
            SPACE: 32
        },
        /**
         * Elements ID
         * @enum {string}
         */
        IDs = {
            container: 'twzipcode32-container',
            containerZipcode: 'twzipcode32-container-zipcode',
        },
        // Container DOM
        container = ($('#' + IDs.container).length ? $('#' + IDs.container) : $('<ul/>').attr('id', IDs.container)).addClass(IDs.container),
        containerZipcode = ($('#' + IDs.containerZipcode).length ? $('#' + IDs.containerZipcode) : $('<ul/>').attr('id', IDs.containerZipcode)).addClass(IDs.container),
        // Zipcode JSON data
        data = twzipcode32_data;

    // Ajax setting
    // $.ajaxSetup({
    //     async: true,
    //     global: false,
    //     cache: true,
    //     dataType: 'JSON'
    // });

    /**
     * Regexp for all expressions
     *
     * @override
     * @this {RegExp}
     * @return {array}
     */
    RegExp.prototype.execAll = function (str) {
        var match, matches = [], matchArray = [], i;
        while ((match = this.exec(str)) !== null) {
            matchArray = [];
            for (i in match) {
                if (match.hasOwnProperty(i)) {
                    if (parseInt(i, 10) === i) {
                        matchArray.push(match[i]);
                    }
                }
            }
            matches.push(matchArray);
        }
        return matches;
    };

    /**
     * TWzipcode32 construct
     * @construct
     * @param {object} container DOM
     * @param {object} options Options
     */
    var twzipcode32 = function (element, options, role) {
        var dom = $(element);
        this.settings = $.extend({}, defaults, options);
        this.def = ['<option value="">縣市</option>', '<option value="">鄉鎮市區</option>'];
        this.elements = {
            zipcode: $("#"+role.zipcode),
            county: $("#"+role.county),
            district: $("#"+role.district),
            address: $("#"+role.address)
        };
        this.init();
    };

    /**
     * twzipcode32 prototype
     * @this {twzipcode32}
     */
    twzipcode32.prototype = {
        // constructor
        constructor: twzipcode32,
        /**
         * initialize
         */
        init: function () {
            var wrap = this.elements,
                set = this.settings,
                tpl = [],
                county,
                params = {
                    'self': this,
                    'set': this.settings,
                    'wrap': wrap
                };

            $(this.def[0]).appendTo(wrap.county);
            $(this.def[1]).appendTo(wrap.district);

            for (county in data) {
                if (data.hasOwnProperty(county)) {
                    tpl.push('<option value="' + county + '" data-code="' + data[county].CODE + '">');
                    tpl.push(county);
                    tpl.push('</option>');
                }
            }

            $(tpl.join('')).appendTo(wrap.county);

            // events binding
            container.on('mouseenter', function () {
                container.show();
            }).on('scroll', function () {
                //console.log($(this).scrollTop());
            });
            containerZipcode.on('mouseenter', function () {
                containerZipcode.show();
            }).on('scroll', function () {
                //console.log($(this).scrollTop());
            });
            wrap.county.on('change.twzipcode', params, this.onCountyChange);
            wrap.district.on('change.twzipcode', params, this.onDistrictChange);
            wrap.address.on('focus click', params, this.onAddressFocus)
                        .on('keyup', params, this.onAddressKeyup)
                        .on('keydown', params, this.onAddressKeydown)
                        .on('blur', params, this.onAddressBlur)
                        .on('change', params, this.onAddressChange);
            // Zipcode
            wrap.zipcode.on('focus click', params, this.onZipcodeFocus)
                        .on('change', params, this.onZipcodeChange)
                        .on('blur.twzipcode', function () {
                var obj = $(this),
                    val = '',
                    i   = '',
                    j   = '';
                window.setTimeout(function () {
                    containerZipcode.hide();
                }, 200);
                obj.val(obj.val().replace(/[^0-9\-]/g, ''));
                val = obj.val().toString();
                if (5 === val.length){
                    val = val.substr(0,3);
                }
                if (3 === val.length) {
                    for (i in data) {
                        if ('undefined' !== typeof data[i]) {
                            for (j in data[i]) {
                                if ('undefined' !== typeof data[i][j] &&
                                    val === data[i][j]
                                ) {
                                    wrap.county.val(i).trigger('change.twzipcode');
                                    wrap.district.val(j).trigger('change.twzipcode');
                                    return;
                                }
                            }
                        }
                    }
                }
            });

            // apply default value
            if (set.countySel.length) {
                if (data.hasOwnProperty(set.countySel)) {
                    wrap.county.val(set.countySel).trigger('change');
                }
            }
            if (set.districtSel.length) {
                window.setTimeout(function () {
                    if (-1 !== wrap.district.text().indexOf(set.districtSel)) {
                        wrap.district.val(set.districtSel).trigger('change');
                        if (set.addressSel.length) {
                            window.setTimeout(function () {
                                wrap.address.val(set.addressSel).trigger('keyup');
                                if (set.zipcodeSel.length){
                                    window.setTimeout(function () {
                                        wrap.zipcode.val(set.zipcodeSel).trigger('blur');
                                    }, 100);
                                }
                            }, 100);
                        }
                    }
                }, 1000);
            }
        },
        /**
         * odd or even number comparison
         * @param {number} type Odd or event type (0 = ignore, 1 = odd, 2 = even)
         * @param {number} value Number
         * @return {bool}
         */
        compare: function (type, value) {
            if (-1 !== value.toString().indexOf('.')) {
                value = (0 !== (1 % value) ? (value * 10) : value);
            }
            switch (type) {
            case 0:
                return true;
            case 1:
                return (0 !== value % 2);
            case 2:
                return (0 === value % 2);
            default:
                return false;
            }
        },
        /**
         * Parsing address string for zipcode
         * @param {array} f Formula pattern
         * @param {string} str Input address
         * @return {bool}
         */
        parse: function (f, str) {
            var scope = {},
                s = str.toString().replace('號', 'NO').replace('巷', 'LN').replace('弄', 'ALY'),
                len = f.length,
                re = /([0-9]*\.?[0-9]+)(LN|ALY|NO)/g.execAll(s),
                nr = [],
                j = 0,
                n1,
                n2;

            for (j = 0; j < re.length; j += 1) {
                $.merge(nr, re[j]);
            }

            // regular
            if (5 <= len) {
                scope.type = f[0];
                scope.begin = f[1];
                scope.begin_unit = f[2];
                scope.end = f[3];
                scope.end_unit = f[4];
            }
            // have extend
            if (7 === len) {
                scope.extend = f[5];
                scope.extend_unit = f[6];
            }
            n1 = {
                u: (undefined !== nr[2] ? nr[2] : null),
                v: (undefined !== nr[1] ? parseFloat(nr[1], 10) : 0)
            };
            n2 = {
                u: (undefined !== nr[5] ? re[5] : null),
                v: (undefined !== nr[4] ? parseFloat(nr[4], 10) : 0)
            };
            if (0 === scope.begin) {
                if ((0 === scope.end || n1.v <= scope.end) && (n1.u === scope.end_unit || 0 === scope.end_unit)) {
                    return this.compare(scope.type, n1.v);
                }
            } else if (0 === scope.end) {
                if ((0 === scope.begin || n1.v >= scope.begin) && (n1.u === scope.begin_unit || 0 === scope.begin_unit)) {
                    return this.compare(scope.type, n1.v);
                }
            } else {
                // Array scope of the end
                if ($.isArray(scope.end)) {
                    if (n1.v === scope.begin && n1.u === scope.begin_unit) {
                        if (0 === scope.end[1]) {
                            if ((0 === scope.end[2] || n2.v <= scope.end[2]) && (n2.u === scope.end_unit || 0 === scope.end_unit)) {
                                return this.compare(scope.end[0], n2.v);
                            }
                        } else if (0 === scope.end[2]) {
                            if ((0 === scope.end[1] || n2.v >= scope.end[1]) && (n2.u === scope.end_unit || 0 === scope.end_unit)) {
                                return this.compare(scope.end[0], n2.v);
                            }
                        } else {
                            if ((n2.v >= scope.end[1] && n2.v <= scope.end[2]) && (n2.u === scope.end_unit || 0 === scope.end_unit)) {
                                return this.compare(scope.end[0], n2.v);
                            }
                        }
                    }
                } else {
                    if ((n1.v >= scope.begin && n1.v <= scope.end) && (n1.u === scope.begin_unit || 0 === scope.end_unit)) {
                        return this.compare(scope.type, n1.v);
                    }
                }
            }
            return false;
        },
        /**
         * get road name from address string
         * @param {object} data Address object
         * @param {string} str Address string
         * @return {string} road name
         */
        getRoad: function (data, str) {
            var road, matched = false;
            for (road in data) {
                if (data.hasOwnProperty(road)) {
                    if (-1 !== str.indexOf(road)) {
                        matched = road;
                        break;
                    }
                }
            }
            return matched;
        },
        // county change event
        onCountyChange: function (e) {
            var obj = $(this),
                params = e.data,
                wrap = params.wrap,
                // root = window.location.pathname.replace(/[^\\\/]*$/, ''),
                root = params.set.root,
                code = obj.children('option:selected').data('code');
            //取得該縣市的鄉鎮市區+街道資訊
            $.ajax({
                url: (root + params.set.data + code + '.js?' + (new Date().getTime())),
                type: 'GET',
                async: false,
                global: false,
                cache: true,
                dataType: 'JSON'
            }).done(function (resp) {
                var tpl = [],
                    address = [],
                    district = '',
                    street = '',
                    originValue = wrap.district.val();
                wrap.district.empty();
                if (undefined !== resp[0]) {
                    var countyVal = wrap.county.val(),
                        data_district = [],
                        code_district = {};
                    //找出鄉鎮市區的3碼郵遞區號
                    for (district in resp[0]) {
                        if (resp[0].hasOwnProperty(district)) {
                            if (code_district[district]==undefined){
                                code_district[district] = [];
                            }
                            for (street in resp[0][district]){
                                var code_arr = resp[0][district][street];
                                for (var i=0, len=code_arr.length; i<len; ++i){
                                    var code = (code_arr[i][1]+"").substr(0,3);
                                    if (code_district[district].indexOf(code)==-1){
                                        code_district[district].push(code);
                                    }
                                }
                            }
                        }
                    }
                    //設定鄉鎮市區arr
                    for (district in resp[0]) {
                        if (resp[0].hasOwnProperty(district)) {
                            var code = "---";
                            if (code_district[district].length===1){
                                code = code_district[district][0];
                            }
                            data_district.push({'desc': district, 'code': code, resp: resp[0][district]});
                        }
                    }
                    data_district=data_district.sortJson({'key': 'code','orderby':'asc'});
                    for (var i=0, len=data_district.length; i<len; ++i){
                        tpl.push('<option value="' + data_district[i].desc + '" zipcode="'+data_district[i].code+'">');
                        tpl.push(data_district[i].code+data_district[i].desc);
                        tpl.push('</option>');
                        address.push(data_district[i].resp);
                    }
                    $(tpl.join('')).appendTo(wrap.district);
                    if (wrap.district.find("[value='"+originValue+"']").length>0){
                        wrap.district.val(originValue);
                    }
                    wrap.district.data('address', address).trigger('change');
                }
            });
            // County callback binding
            if ('function' === typeof params.set.onCountyChange) {
                params.set.onCountyChange(this);
            }
        },
        // district change event
        onDistrictChange: function (e) {
            var obj = $(this),
                params = e.data,
                wrap = params.wrap,
                html = [],
                index = obj.prop('selectedIndex'),
                address = obj.data('address')[index],
                road;
            results = [];
            $(this).attr("zipcode", $(this).find("[value='"+this.value+"']").attr("zipcode"));
            wrap.address.attr("zipcode", "").change();

            for (road in address) {
                if (address.hasOwnProperty(road)) {
                    results.push(road);
                    var zipcode = [];
                    for (var i=0, len=address[road].length; i<len; ++i){
                        if (zipcode.indexOf(address[road][i][1])==-1){
                            zipcode[zipcode.length] = address[road][i][1];
                        }
                    }
                    html.push('<li zipcode="'+zipcode.join(',')+'">' + road + '</li>');
                }
            }
            $(html.join('')).appendTo(container.empty());
            container.off('click.container');
            container.on('click.container', 'li', function () {
                wrap.address.val($(this).text()).focus().attr("zipcode", $(this).attr("zipcode")).change();
                container.hide();
            });
            // District callback binding
            if ('function' === typeof params.set.onDistrictChange) {
                params.set.onDistrictChange(this);
            }
        },
        // address focus event
        onAddressFocus: function (e) {
            var obj = $(this),
                params = e.data,
                val = obj.val(),
                wrap = params.wrap;
            wrap.district.trigger('change');

            container.css({
                'top': (obj.offset().top + obj.outerHeight()),
                'left': (obj.offset().left),
                'width': obj.width() + 'px'
            }).show();

            container.find('li').each(function () {
                var me = $(this);
                if (0 === me.text().indexOf(val)) {
                    me.show();
                } else {
                    me.hide();
                }
            });
        },
        // address keydown event
        onAddressKeydown: function (e) {
            if (keys.ENTER === e.keyCode) {
                e.preventDefault();
            }
        },
        // address keyup event
        onAddressKeyup: function (e) {
            var params = e.data,
                wrap = params.wrap,
                obj = $(this),
                li = container.find('li'),
                selected = {},
                item = {},
                val = obj.val(),
                road = '',
                i = 0,
                index = 0,
                address = wrap.district.data('address'),
                formula = [],
                visible = {};
            if (!results.length) {
                container.empty().hide();
                return;
            }
            if (0 !== val.length) {
                container.show();
            }

            li.each(function () {
                var me = $(this);
                if (0 === me.text().indexOf(val)) {
                    me.show();
                } else {
                    me.hide();
                }
            });

            visible = li.filter(':visible');
            selected = visible.filter('.selected');

            if (!selected.length) {
                selected = visible.first().addClass('selected');
            }

            switch (e.keyCode) {
                case keys.UP:
                    e.preventDefault();
                    item = selected.prevAll(':visible:last').length
                         ? selected.removeClass('selected').prevAll(':visible:first')
                         : selected.removeClass('selected').siblings(':visible').removeClass('selected').last();
                    item.addClass('selected');
                    break;
                case keys.DOWN:
                    e.preventDefault();
                    item = selected.nextAll(':visible:first').length
                                 ? selected.removeClass('selected').nextAll(':visible:first')
                                 : selected.removeClass('selected').siblings(':visible').removeClass('selected').first();
                    item.addClass('selected');
                    break;
                case keys.ENTER:
                    e.preventDefault();
                    obj.val(selected.text());
                    container.hide();
                    lastpos = 0;
                    break;
            }

            index = wrap.district.prop('selectedIndex');

            try {
                lastpos += item.position().top;
                if (lastpos > (container.get(0).scrollHeight - container.outerHeight())) {
                    lastpos = container.get(0).scrollHeight - container.outerHeight();
                }
                container.animate({
                    scrollTop: lastpos
                }, 0);
            } catch (ignore) {
                // console.log(ignore.message);
            }
            wrap.address.change();
            // road = params.self.getRoad(address[index], val);
            // formula = false !== road
            //         ? (undefined !== address[index][road] ? address[index][road] : [])
            //         : [];

            // if (formula) {
            //     for (i = 0; i < formula.length; i += 1) {
            //         if (params.self.parse(formula[i][0], val)) {
            //             wrap.zipcode.val(formula[i][1]);
            //             return;
            //         }
            //     }
            // }
        },
        // address blur event
        onAddressBlur: function () {
            window.setTimeout(function () {
                container.hide();
            }, 200);
        },
        // address change event
        onAddressChange: function (e) {
            var params = e.data,
                wrap = params.wrap,
                address = wrap.district.data('address'),
                road = '',
                i = 0,
                formula = false,
                index = wrap.district.prop('selectedIndex'),
                districtZipcode = wrap.district.attr("zipcode"),
                zipcode = wrap.zipcode.val();
            road = params.self.getRoad(address[index], this.value);

            formula = false !== road
                    ? (undefined !== address[index][road] ? address[index][road] : [])
                    : [];

            if (false !== road && formula) {
                var addrZipcode = [];
                for (i in formula) {
                    if (formula[i][1] && addrZipcode.indexOf(formula[i][1])===-1){
                        addrZipcode[addrZipcode.length] = formula[i][1];
                    }
                }
                if (addrZipcode.indexOf(zipcode)===-1){
                    wrap.zipcode.val(addrZipcode[0]).trigger('change');
                }
                wrap.address.attr("zipcode", addrZipcode.join(','));
            }else{
                wrap.zipcode.val(districtZipcode).trigger('change');
                wrap.address.attr("zipcode", "");
            }
            // Address callback binding
            if ('function' === typeof params.set.onAddressChange) {
                params.set.onAddressChange(this);
            }
        },
        // zipcode focus event
        onZipcodeFocus: function (e) {
            var obj = $(this),
                params = e.data,
                wrap = params.wrap,
                zipcode = this.value,
                zipcodeArr = wrap.address.attr("zipcode"),
                html = [];
            if (zipcodeArr){
                zipcodeArr = zipcodeArr.split(",");
                if (zipcodeArr.length>1){
                    zipcodeArr.sort();
                    for (var i=0, len=zipcodeArr.length; i<len; ++i){
                        html.push('<li>' + zipcodeArr[i] + '</li>');
                    }
                    $(html.join('')).appendTo(containerZipcode.empty());
                    containerZipcode.css({
                        'top': (obj.offset().top + obj.outerHeight()),
                        'left': (obj.offset().left),
                        'width': obj.width() + 'px'
                    }).show();
                    containerZipcode.off('click.containerZipcode');
                    containerZipcode.on('click.containerZipcode', 'li', function () {
                        wrap.zipcode.val($(this).text()).trigger('change');
                        containerZipcode.hide();
                    });
                    containerZipcode.show();
                }
            }
        },
        // Zipcode change event
        onZipcodeChange: function (e) {
            var params = e.data;
            // Zipcode callback binding
            if ('function' === typeof params.set.onZipcodeChange) {
                params.set.onZipcodeChange(this);
            }
        }
    };

    /**
     * jQuery TWzipcode32 instance
     * @param {object} options Plugin settings
     * @public
     */
    $.fn.twzipcode32 = function (options, role) {
        container.hide().appendTo('body');
        containerZipcode.hide().appendTo('body');
        return this.each(function () {
            $(this).data('twzipcode32', new twzipcode32(this, options, role));
        });
    };

}(jQuery));