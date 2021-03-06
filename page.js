//初始化翻页
        Pagination:function (config) {
            var con = $(config.container),
                total = config.total,
                fn = function(){},
                before = config.beforeChange || fn,
                change = config.change || fn,
                after = config.afterChange || fn,
                cur = config.currentPage || 1,
                max = config.maxSize || 10,
                firstLoad = true;

            total = Math.ceil(total/max);

            render(cur);

            function render (cur) {
                
                var min = Math.ceil(max/2),
                    pageNum=[],
                    i=0;

                if (cur<=min || total<=max) {
                    for (i = 1,len=Math.min(max,total); i <= len ; i++) {
                        pageNum.push(i);
                    }
                } else {
                    for (i = cur-2,len= Math.min(cur+2,total); i <= len; i++) {
                        pageNum.push(i);
                    }
                }
                var tpl = [
                    '<a class="pagenum first  {{cur>3 ? "":"hidden"}} {{max<total ? "":"hidden"}}" data-id="1">1</a>',
                    '<a class="prev {{cur>1 ? "":"hidden"}}"  id="prev" >上一页</a> ',
                    '{{each pageNum as list}}',
                    '<a class="pagenum {{list==cur? "pagecur" : ""}}" data-id="{{list}}">{{list}}</a>',
                    '{{/each}}',
                    '<a class="next {{cur == total ? "hidden":""}}"  id="next" >下一页</a> ',
                    '<span class="ellipsis {{max<total ? "":"hidden"}} {{cur<total-2 ? "":"hidden"}}">…</span>',
                    '<a class="pagenum last  {{cur<total-2 ? "":"hidden"}} {{max<total ? "":"hidden"}}" data-id="{{total}}">{{total}}</a> ',
                    '<span href="">{{cur}}/{{total}} 页</span>  '
                ].join(''),
                render = template.compile(tpl),
                html = render({
                    pageNum:pageNum,
                    total:total,
                    cur:cur,
                    max:max
                });
                firstLoad ? "" : change(cur);
                firstLoad = false;
                con.html(html);
            }

            function changeMethd (cur) {
                render(cur);
                after(cur);
            }
            
            con.on('click','.next',function () {
                before(cur);
                cur++;
                if (cur<=total) {
                    changeMethd(cur);
                }
            });

            con.on('click','.prev',function () {
                before(cur);
                cur--;
                if (cur>=1) {
                    changeMethd(cur);
                }
            });


            con.on('click','.pagenum',function () {
                before(cur);
                cur = $(this).data('id');
                changeMethd(cur);
            });

        },