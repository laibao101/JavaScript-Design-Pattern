/**
 * @file: 第37章 Widget模式
 * @author: bohai (bohai@100.com). 感谢本书作者 张容铭；感谢网友 雨夜清荷 对这段代码错误的修正
 * @date: 15/12/10
 */
window.me = window.me || {};
window.me.template = (function (window, document, undefined) {

    /**
     * 内容替换
     * @param str
     * @private
     */
    function _dealTpl(str) {
        var _left = '{%',
            _right = '%}';

        return String(str)
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/[\r\t\n]/g, '')
            .replace(new RegExp(_left + '=(.*?)' + _right, 'g'), "',typeof($1)==='undefined'?'':$1,'")
            .replace(new RegExp(_left, 'g'), "');")
            .replace(new RegExp(_right, 'g'), "template_array.push('");
    }

    /**
     * 编译模版
     * @param str
     * @private
     */
    function _compileTpl(str) {
        var fnBody = "var template_array=[];\n" +
            "var fn=(function(data){\n" +
            "var template_key='';\n" +
            "for(key in data) {\n" +
            "template_key+=('var ' + key+'=data[\"'+key+'\"];');\n" +
            "}\n" +
            "eval(template_key);\n" +
            "template_array.push('" + _dealTpl(str) + "');\n" +
            "template_key=null;\n" +
            "})(templateData);\n" +
            "fn = null;\n" +
            "return template_array.join('');";

        return new Function('templateData', fnBody);
    }

    /**
     * 获取模版
     * @param str
     * @private
     */
    function _getTpl(str) {
        var ele = document.getElementById(str);

        if (ele) {
            var html = /^(texttarea|input)$/i.test(ele.nodeName) ? ele : ele.innerHTML;
            return _compileTpl(html);
        } else {
            return _compileTpl(str);
        }
    }


    return {
        /**
         * 模版引擎，处理数据于编译模版的入口
         * @param str
         * @param data
         * @private
         */
        tplEngine: function (str, data) {
            if (data instanceof Array) {
                var html = '',
                    i = 0,
                    len = data.length;

                for (; i < len; i++) {
                    html += _getTpl(str)(data[i]);
                }

                return html;
            } else {
                return _getTpl(str)(data);
            }
        }
    }
}(window, document, undefined));

var data = {
    tagCloud: [
        {
            is_selected: true,
            title: '设计模式',
            text: '设计模式吧啦吧吧啦吧啦吧啦'
        },
        {
            is_selected: false,
            title: 'html',
            text: 'hmtlbababababababababab'
        },
        {
            is_selected: null,
            title: 'CSS',
            text: 'cssbababababababbabababa'
        },
        {
            is_selected: '',
            title: 'Javascript',
            text: 'jsbabababababababababab'
        }
    ]
};

var html = window.me.template.tplEngine('demo_tag', data);

console.log(html);
