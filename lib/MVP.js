F.module('lib/MVP', function () {
    //MVP构造模式
    var MVP = function () {

    };
    //数据层
    MVP.model = function () {
        var M = {};
        M.data = {};
        M.conf = {};
        return {
            getData: function (m) {
                return M.data[m];
            },
            /**
             * 设置数据
             * @param {[type]} m 模块名称
             * @param {[type]} v 模块数据
             */
            setData: function (m, v) {
                M.data[m] = v;
                return v;
            },
            getConf: function (c) {
                return M.conf[c];
            },
            /**
             * 设置配置
             * @param {[type]} c 配置项名称
             * @param {[type]} v 配置项值
             */
            setConf: function (c, v) {
                M.conf[c] = v;
                return v;
            }
        };
    }();
    //视图层
    MVP.view = function () {
        //子元素或者兄弟元素替换模板
        var REPLACEKEY = '_REPLACEKEY_';
        //获取完整元素模板
        /**
         * 获取完整元素模板
         * @param  {[type]} str        元素字符串
         * @param  {[type]} replacePos 元素类型
         * @return {[type]}            [description]
         */
        function getHTML(str, replacePos) {
            //简化实现，只处理字符串中第一个{}里面的内容
            return str
                .replace(/^(\w+)([^\{\}]*)?(\{([@\w]+)\})?(.*?)$/, function (match, $1,
                    $2, $3, $4, $5) {
                    $2 = $2 || ''; //元素属性参数容错处理
                    $3 = $3 || ''; //{元素内容}参数容错处理
                    $4 = $4 || ''; //元素内容参数容错处理
                    $5 = $5.replace(/\{([@\w]+)\}/g, ''); //去除元素内容后面添加的元素属性中的{}内容
                    //以str=div举例：如果div元素有子元素则生成<div>_REPLACEKEY_</div>,如果div有兄弟元素则表示成<div></div>_REPLACEKEY_,否则生成<div></div>
                    return type === 'in' ? '<' + $1 + $2 + $5 + '>' + $4 +
                        REPLACEKEY + '</' + $1 + '>' : type === 'add' ? '<' + $1 +
                        $2 + $5 + '>' + $4 + '</' + $1 + '>' + REPLACEKEY : '<' +
                        $1 + $2 + $5 + '>' + $4 + '</' + $1 + '>';
                })
                //处理特殊标识#--id属性
                .replace(/#([@\-\w]+)/g, 'id="$1"')
                //处理特殊标识.--class属性
                .replace(/\.([@\-\w]+)/g, 'class="$1"')
                //处理其他属性组
                .replace(/\[(.+)\]/g, function (match, key) {
                    //元素属性组
                    var a = key
                        //过滤其中引号
                        .replace(/'|'/g, '')
                        //以空格分组
                        .split(' '),
                        //属性模板字符串
                        h = '';
                    //遍历属性组
                    for (var j = 0, len = a.length; j < len; j++) {
                        //处理拼接每一个属性
                        h += ' ' + a[j].replace(/=(.*)/g, '="$1"');
                    }
                    //返回属性组模板字符串
                    return h;
                })
                //处理可替换内容，可根据不同模板渲染引擎自由处理
                .replace(/@(\w+)/g, '{#$1#}');
        }
        /**
         * 数组迭代器
         * @param  {[type]}   arr 数组
         * @param  {Function} fn  回调函数
         * @return {[type]}       [description]
         */
        function eachArray(arr, fn) {
            //遍历数组
            for (var i = 0, len = arr.length; i < len; i++) {
                //将索引值、索引值对应值、数组长度传入回调函数中并执行
                fn(i, arr[i], len);
            }
        }
        /**
         * 替换兄弟元素模板或者子元素模板
         * @param  {[type]} str 原始字符串
         * @param  {[type]} rep 兄弟元素模板或者子元素模板
         * @return {[type]}     [description]
         */
        function formateItem(str, rep) {
            //用对应元素字符串替换兄弟元素模板或者子元素模板
            return str.replace(new RegExp(REPLACEKEY, 'g'), rep);
        }
        //模板解析器
        return function (str) {
            //模板层级数组
            var part = str
                //去除首尾空白字符
                .replace(/^\s+|\s+$/g, '')
                //去除>两端空白符
                .replace(/^\s+(>)\s+/g, '$1')
                //以>分组
                .split('>'),
                //模板视图根模板
                html = REPLACEKEY,
                //同层元素
                item,
                //同级元素模板
                nodeTpl;
            //遍历每组元素
            eachArray(part, function (partIndex, partValue, partLen) {
                //为同级元素分组
                item = partValue.split('+');
                //设置同级元素初始模板
                nodeTpl = REPLACEKEY;
                //遍历同级每一个元素
                eachArray(item, function (itemIndex, itemValue, itemLen) {
                    //用渲染元素得到的模板去渲染同级元素模板，此处简化逻辑处理
                    //如果itemIndex（同级元素索引）对应元素不是最后一个 则作为兄弟元素处理
                    //否则，如果partInex（层级索引）对应的层级不是最后一层 则作为父层级元素处理
                    //（该层级有子层级，即该元素是父元素）
                    //否则，该元素无兄弟元素，无子元素
                    nodeTpl = formateItem(html, nodeTpl);
                });
                //用渲染子层级得到的模板去渲染父层级模板
                html = formateItem(html, nodeTpl);
            });
            //返回期望视图模板
            return html;

        };

    }();
    //管理器层
    MVP.presenter = function () {
        var V = MVP.view;
        var M = MVP.model;
        var C = {};
        return {
            //执行方法
            init: function () {
                //遍历内部管理器
                for (i in C) {
                    if (C.hasOwnProperty(i)) {
                        //执行所有管理器内部逻辑
                        C[i] && C[i](M, V, i);
                    }
                }
            }
        };
    }();
    //MVP入口
    MVP.init = function () {
        this.presenter.init();
    };
    //暴露MVP对象，这样即可在外部访问MVP
    return MVP;
});
