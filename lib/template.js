//模板引擎模块

F.module('lib/template', function (str, data) {
    //模板引擎 处理数据与编译模板入口
    /**
     * 模板引擎 处理数据与编译模板入口
     * @param  {string} str  模板容器id或者模板字符串
     * @param  {[type]} data 渲染数据
     * @return {[type]}      [description]
     */
    var _TplEngine = function (str, data) {
            //如果数据是数组
            if (data instanceof Array) {
                //缓存渲染模板结果
                var html = '',
                    //数据索引
                    i = 0,
                    //数据长度
                    len = data.length;
                //遍历数据
                for (; i < len; i++) {
                    //渲染模板渲染结果，也可写成html+=arguments.callee(str,data[i]);
                    html += _getTpl(str)(data[i]);
                }
                //返回模板渲染最终结果
                return html;
            } else {
                //返回模板渲染结果
                return _getTpl(str)(data[i]);
            }
        },
        /**
         * 获取模板
         * @param  {string} str 模板容器id，或者模板字符串
         * @return {[type]}     [description]
         */
        _getTpl = function (str) {
            //获取元素
            var ele = document.getElementById(str);
            //如果元素存在
            if (ele) {
                //如果是input或者textarea表单元素，则获取该元素的value值，否则获取元素的内容
                var html = /^(textarea|input)$/i.test(ele.nodeName) ? ele.value : ele.innerHTML;
                //编译模板
                return _compileTpl(html);
            } else {
                //编译模板
                return _compileTpl(html);
            }
        },
        /**
         * [_dealTpl description]
         * @param  {[type]} str [description]
         * @return {[type]}     [description]
         */
        _dealTpl = function (str) {
            var _left = '{%', //左分隔符
                _right = '%}'; //右分隔符
            return String(str)
                //转义标签内的< 如：<div>{%if(a&lt;t)%}</div>  -> <div>{%if(a<b)%}</div>
                .replace(/&lt;/g, '<')
                //转义标签内的>
                .replace(/&gt;/g, '>')
                //过滤回车符，制表符，回车符
                .replace(/[\r\t\n]/g, '')
                //替换内容
                .replace(new RegExp(_left + '=(.*?)' + _right, 'g'),
                    ",typeof($1) === 'undefined'?'':$1,''")
                //替换左分隔符
                .replace(new RegExp(_left, 'g'), "');'")
                //替换右分隔符
                .replace(new RegExp(_right, 'g'), "template_array.push('");
        },
        /**
         * 编译执行
         * @param  {string} str 模板数据
         * @return {[type]}     [description]
         */
        _compileTpl = function (str) {
            //编译函数体
            // var fnBody="var template_array=[];\nvar fn=(function(data){\nvar template_key='';\nfor(key in data){\ntemplate_key+=('var'+key+'=data[\"'+key+'\"];');\n eval (template_key);\n template_array.push('"+_dealTpl(str)+"');\n template_key=null;\n })(templateData);\n fn=null;\n return template_array.join('');";
            var fnBody ="var template_array = [];\
            var fn = (function (data) {\
                var  template_key='';\
                for (key in data) {\
                    if (data.hasOwnProperty(key)) {\
                        template_key+=('var '+key+'=data[\"'+key+'\"];');\
                    }\
                }\
                eval(template_key);\
                template_array.push('"+_dealTpl(str)+"');\
                template_key=null;\
            })(templateData);\
            fn=null;\
            return template_array.join('');";
            //编译函数
            // var template_array = [];
            // var fn = (function (data) {
            //     var  template_key='';
            //     for (key in data) {
            //         if (data.hasOwnProperty(key)) {
            //             template_key+=('var '+key+'=data[\"'+key+'\"];');
            //         }
            //     }
            //     eval(template_key);
            //     template_array.push('"+_dealTpl(str)+"');
            //     template_key=null;
            // })(templateData);
            // fn=null;
            // return template_array.join('');
            return new Function("templateData",fnBody)
        };


    return _TplEngine;
})
