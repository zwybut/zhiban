/**
 * Created by Administrator on 2016-12-19.
 */
/**
 *      说明：生成自定义的下拉选择框
     对象创建：$("#itemSel").customSelect(options)
     参数说明：options:{
                         width:100,   内容宽度
                         show:true,　 初次创建时是否显示
                         heigth:200   内容的高度
                        lineHeight:30,  元素的行高
                        fontSize:"12px"　字体大小
                         }
     事件说明：
            getValue()                 得到选择框的值
            setValue()                 设置选项框显示的值
     　　　 change(function(){.....})  当选择框值发生改变时，触发该事件
            show()  显示控件
            hide()  隐藏控件
         <select id="itemSel">
             <option value="P,Z">全部</option>
             <option value="P">雨量</option>
             <option value="Z" selected="selected">水位</option>
         </select>
 *
 *
 *
     */
;(function($, window, document,undefined) {
    $.fn.customSelect = function(options) {
        var defaults = {
            width: 100,
            height: 250,
            show:true,
            lineHeight:30,
            fontSize:"12px",
            enabled:true
        };
        this.opts = $.extend({}, defaults, options);
        //console.log(this.opts);
        this.wrap = null;
        this.value = "";
        this.mask = null;
        this.disabled = false;
        var _oSelf = this;
        var $this = $(this);
        var index_option;
        var _create = function(){  // 创建对象
            $this.hide();
            var tag_select = $('<div></div>');//div相当于select标签
            _oSelf.wrap = tag_select;
            tag_select.addClass('select_box')
                      .css({
                          "line-height":_oSelf.opts.lineHeight + 'px',
                          "font-size":_oSelf.opts.fontSize
                      });
            var width = _oSelf.opts.width;
            tag_select.width(width);

            tag_select.insertBefore(_oSelf);//插入select_container选中的内容

            //显示框class为select_showbox,插入到创建的tag_select中
            _oSelf.mask = $('<div></div>')
                   .css({
                    position:'absolute',
                    left:0,
                    top:0,
                    background:"rgba(155,155,155,0.4)",
                    height:_oSelf.opts.lineHeight+2 + 'px',
                    width:width+'px',
                    zIndex:9
                }).appendTo(tag_select);


            if(_oSelf.opts.enabled) _oSelf.mask.hide();
            else _oSelf.mask.show();
            //this.mask.show();
            var select_showbox = $('<div></div>');//显示框
            select_showbox.css({
                                cursor:'pointer',
                                "background-position-x": (width - 18) + 'px',
                                height:_oSelf.opts.lineHeight + 'px'
                              })
                          .addClass("select_showbox")
                          .appendTo(tag_select);

            //创建option容器，class为select_option，插入到创建的tag_select中
            var ul_option = $('<ul></ul>');//创建option列表
            ul_option.attr('class', 'select_option');
            ul_option.css({
                "max-height":_oSelf.opts.height,
                "top":(_oSelf.opts.lineHeight + 2) + 'px',
                overflow:"auto",

            });
            ul_option.width(width - 2);
            ul_option.appendTo(tag_select);

            //创建option对象*****************************
            //获取被选中的元素并将其值赋值到显示框中
            var options = $this.find("option");
            var selected_option = options.filter(':selected');
            var selected_index = selected_option.index();
            var showbox = ul_option.prev();
            showbox.text(selected_option.text());
            _oSelf.value = selected_option.attr("value");
            //为每个option建立个li并赋值
            for (var n = 0; n < options.length; n++) {
                var tag_option = $('<li></li>'),//li相当于option
                    txt_option = options.eq(n).text();
                tag_option.text(txt_option).css('cursor', 'pointer').attr("value", options.eq(n).attr("value")).attr("attr", options.eq(n).attr("attr")).appendTo(ul_option);
                //为被选中的元素添加class为selected
                if (n == selected_index) {
                    tag_option.attr('class', 'selected');
                }
            }

            if (!_oSelf.opts.show) _oSelf.wrap.hide();

            //点击显示框切换显示隐藏自定义拉下框
            select_showbox.click(function () {
                $('.select_option').not(ul_option).hide();
                ul_option.toggle();
            });

            // 鼠标点击select之外的区域，自定义下拉框隐藏
            $("body").bind("click", function (event) {
                if ($(event.target).parent('.select_box').length == 0) {
                    li_option.removeClass('hover');
                    ul_option.hide();
                }
            });

            var li_option = ul_option.find('li');

            //点击选择项
            li_option.on('click', function () {
                $(this).addClass('selected').siblings().removeClass('selected');
                var text = $(this).text();
                index_option = $(this).index();
                select_showbox.text(text); // 将选中的内容赋值给select_showbox
                ul_option.attr('display', 'none');  // 隐藏整个下拉框
                li_option.removeClass('hover');
                var value = $(this).attr("value");
                var oldValue = _oSelf.value;
                if (value != _oSelf.value) {
                    _oSelf.value = value;
                    $this.value = value;
                    $this.trigger("change",[oldValue]);
                }
            });

            // 鼠标移到选择项
            li_option.hover(function () {
                $(this).addClass('hover').siblings().removeClass('hover');
            }, function () {
                li_option.removeClass('hover');
            });

        };

        this.getValue = function(){
            return this.value;
        };
        this.getIndex = function(){
            return index_option;
        };
        this.getText = function(){
            var _this = this
            var resultText = ""
            _oSelf.wrap.find("li").each(function(){
                if($(this).attr("value") == _this.value){
                    resultText = $(this).text();
                }
            });
            return resultText;
        };
        this.getAttr = function(){
            var _this = this
            var resultText = ""
            _oSelf.wrap.find("li").each(function(){
                if($(this).attr("value") == _this.value){
                    resultText = $(this).attr("attr");
                }
            });
            return resultText;
        };

        this.change = function(fn){
            var _this = this;
            $this.change($.proxy(fn, _this));
            return this;
        };

        this.show = function(){
            this.wrap.show();
        };
        this.hide = function(){
            this.wrap.hide();
        };

        this.disable =  function(){
            _oSelf.mask.show();
            _oSelf.disabled = true;
        };

        this.enable =  function(){
            _oSelf.mask.hide();
            _oSelf.disabled = false;
        };

        this.setValue = function(value){
            _oSelf.wrap.find("li").each(function(){
                if($(this).attr("value")==value){
                    $(this).trigger("click");
                }
            });
        };
        this.setText = function(value,text){
            _oSelf.wrap.find("li").each(function(){
                if($(this).attr("value")==value){
                    $(this).text(text);
                }
            });
        };

        this.refresh = function(){
            _oSelf.wrap.remove();
            _create();
        }
        this.destroy = function(){
            _oSelf.wrap.remove();

        }
        _create();
        return this;
    };


})(jQuery, window, document);


// 创建可冻结列表格***************************************begin
    /*
     说明：可对表头和前面几列进行固定
     参数：frozenColCount：；固定的列数
     　　　pDiv:表格的外层div的id号：如下结构中的tableWrap
     <div class="wrap" id="tableWrap" style="width: 300px">
     <table class="t tablesorter mytable" id="myTable">
     <thead>
     <tr>
     <th class="stnm">站名</th>
     <th class="drp">雨量</th>
     <th class="tm">时间</th>
     <th class="stcd">站号</th>
     </tr>
     </thead>
     <tbody>
     <tr>
     <td></td>
     <td></td>
     <td></td>
     <td></td>
     </tr>
     </tbody>
     </table>
     </div>
     　　包涵的css类：
     .t
     　　.table_fixheadLeft
     .table_fixhead
     .table_fixLeft
     事件说明：loadData：第一次用初始化方法，后面表体数据改变用该方法导入表体数据，参数为
     <tr>
     <td></td>
     <td></td>
     <td></td>
     <td></td>
     </tr>
     <tr>
     <td></td>
     <td></td>
     <td></td>
     <td></td>
     </tr>
     ....
     */
;(function($){
    $.fn.splitTable = function(options){
        var defaults = {
            frozenColCount:1,
        };
        this.opts = $.extend({}, defaults, options);
        this.tableWrap = null; // 表的外包对象
        this.mainTableWrap = null; // 表体的外包对象
        this.tableTitle = null;// 新生成的表头对象
        var _this = this;
        var $this = $(this);

        var _create = function() {  // 创建对象

            // 生成全表的外包对象
            _this.tableWrap = $("<div class='splitTable_TableWrap'></div>");
            _this.tableWrap.insertBefore($this);

            // 在源始表外面加一个wrap
            _this.mainTableWrap = $("<div class='splitTable_mainTableWrap'></div>");// 生成表体的外包对象
            _this.mainTableWrap.appendTo( _this.tableWrap);
            $this.appendTo(_this.mainTableWrap);

            // 生成新的表头,并添加表头样式
            _this.tableTitle = $("<table></table>");
            _this.tableTitle.addClass("splitTable_header");
            // 把源始表中的表头放到新生成的表头中
            $(_this.mainTableWrap.find("thead")[0]).appendTo(_this.tableTitle);
            // 把新的表头移到源始表div的前面
            _this.tableTitle.insertBefore(_this.mainTableWrap);


            //var fixheadLeft = $("<div class='table_fixheadLeft'></div>");
            //var fixhead = $("<div class='table_fixhead'></div>");
            //this.fixLeft = $("<div class='table_fixLeft'></div>");
            //
            //var table = pDiv.find("table");
            //var tr_all = table.find("tr");
            //
            //var tableTop = $("<table class='t'></table>");
            //$this.find("thead").appendTo(tableTop);
            //tableTop.appendTo(fixhead);

        };

        _create();
    };



})(jQuery);





    var SplitTable = function (frozenColCount, pDiv) {
        var pDiv = $("#" + pDiv);

        this._frozenColCount = frozenColCount;

        var fixheadLeft = $("<div class='table_fixheadLeft'></div>");
        var fixhead = $("<div class='table_fixhead'></div>");
        this.fixLeft = $("<div class='table_fixLeft'></div>");
        var _this = this;

        var table = pDiv.find("table");
        var tr_all = table.find("tr");
        var tr_header = table.find('thead');

        // 建立表头
        var tableTop = $("<table class='t'></table>");
        $(tr_header).appendTo(tableTop);
        //$(tr_all[1]).appendTo(tableTop);
        tableTop.appendTo(fixhead);

        //建立左侧固定表
        var TableLeft = $("<table class='t'></table>");
        for (var i = 0; i < tr_all.length; i++) {
            var oTr = $("<tr></tr>");
            for (var j = 0; j < this._frozenColCount; j++) {
                $($(tr_all[i]).children()[j]).clone().appendTo(oTr);
            }
            oTr.appendTo(TableLeft);
        }
        TableLeft.appendTo(this.fixLeft);

        // 建立左侧表头
        var LeftTr = $(TableLeft.find("tr")[0]);
        var LeftTr1 = $(TableLeft.find("tr")[1]);
        var headLeft = $("<table class='t'></table>");
        LeftTr.appendTo(headLeft);
        LeftTr1.appendTo(headLeft);
        headLeft.appendTo(fixheadLeft);

        fixheadLeft.insertBefore(pDiv);
        fixhead.insertBefore(pDiv);
        this.fixLeft.insertBefore(pDiv);


        var $this = this;
        pDiv.scroll(function (e, top, left) {
            $this.fixLeft.scrollTop(parseInt(top) * (-1));
            fixhead.scrollLeft(parseInt(left) * (-1));
        });

        this.fixLeft.mousewheel(function (event) {
            event.preventDefault();
            var scrollTop = parseInt($(this).scrollTop()) + ((event.deltaY * event.deltaFactor * 2) * (-1));
            if (scrollTop <= 0) scrollTop = 0;
            pDiv.mCustomScrollbar("scrollTo", [scrollTop]);
        });

        // 鼠标移动时加亮显示当前列
        table.find("tr").mouseover(function () {
            var index = $(this).index();
            $(this).siblings("tr").removeClass('hover');
            $(this).not('.active').addClass('hover');
            _this.fixLeft.find("tr").eq(index).siblings("tr").removeClass('hover');
            _this.fixLeft.find("tr").eq(index).not('.active').addClass('hover');

        });

        table.find("tr").click(function () {
            var index = $(this).index();
            $(this).siblings("tr").removeClass('active');
            $(this).addClass('active');
            _this.fixLeft.find("tr").eq(index).siblings("tr").removeClass('active');
            _this.fixLeft.find("tr").eq(index).addClass('active');
        });

        this.fixLeft.find("tr").mouseover(function () {
            var index = $(this).index() + 1;
            $(this).siblings("tr").removeClass('hover');
            $(this).not('.active').addClass('hover');
            tr_all.eq(index).siblings("tr").removeClass('hover');
            tr_all.eq(index).not('.active').addClass('hover');

        });

        this.fixLeft.find("tr").click(function () {
            var index = $(this).index() + 1;
            $(this).siblings("tr").removeClass('active');
            $(this).addClass('active');
            tr_all.eq(index).siblings("tr").removeClass('active');
            tr_all.eq(index).addClass('active');
        });

    };

// 载入内容
    SplitTable.prototype.loadData = function (content) {
        var tr_all = $(content);
        this.fixLeft.empty();

        var TableLeft = $("<table class='t'></table>");
        for (var i = 0; i < tr_all.length; i++) {
            var oTr = $("<tr></tr>");
            for (var j = 0; j < this._frozenColCount; j++) {
                $($(tr_all[i]).children()[j]).clone().appendTo(oTr);
            }
            oTr.appendTo(TableLeft);
        }
        TableLeft.appendTo(this.fixLeft);

    };

// 创建可冻结列表格***************************************end
    /*
     <table class="t tablesorter mytable " id="myTable" >
     <thead>
     <tr>
     <th class="tm">时间</th>
     <th class="drp">雨量</th>
     <th class="z">水位</th>
     <th class="zs">涨势</th>
     <th class="w">库容</th>
     <th class="jjz">警戒(m)</th>
     <th class="bzz">保证(m)</th>
     </tr>
     </thead>
     <tbody>
     <tr>
     <td class="tm">aa</td>
     <td class="drp">bb</td>
     <td class="z">cc</td>
     <td class="zs">dd</td>
     <td class="w">ee</td>
     <td class="jjz">ff(m)</td>
     <td class="bzz">gg(m)</td>
     </tr>
     </tbody>
     </table>
     */
    // 创建表头固定表格***************************************begin
    var FixheaderTable = function (pDiv) {
        this.warp = $("#" + pDiv);

        var $this = this;

        // 将显示的表头复制添加到内容表格的表头上并隐藏
        this.tableTitle = $("<table></table>");
        this.tableTitle.addClass(pDiv + "_header")
        $(this.warp.find("thead")[0]).appendTo(this.tableTitle);
        this.tableTitle.insertBefore(this.warp[0]);

        // 鼠标滑动，该行显示效果  线hover，后click ，样式中也需如此顺序
        this.warp.find("tbody tr").hover(function () {
            $(this).parent().find('tr').removeClass('hover');
            $(this).not('.active').addClass('hover');
        }, function () {
            $(this).parent().find('tr').removeClass('hover');
        });


        // 鼠标点击table，该行特殊显示-------
        this.warp.find("tbody tr").on('click', function () {
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
        });

    };
    FixheaderTable.prototype.InitTitle = function (content) {
        this.warp.find("thead").empty();
        this.tableTitle.html(content);
    };

    FixheaderTable.prototype.loadData = function (content) {
        this.warp.find("tbody").empty();
        this.warp.find("tbody").html(content);
    };

/**
 * 说明：
 * 控件功能：
 * 1、可固定表头，
 * 2、对列进行排序
 *
 *
 *调用说明：
 * id:在表格table外面包div的id
 * $(id).fixheaderTable({
 *      colsWidth:[50,80,100,......]   //设置各列的宽度，可选，对于不设定宽度的列，采用默认值100px
 *　    colsDataType:['number','string','date'], // 各列的数据类型,number,数字类型，string 字符串类型，date 日期类型
 *})
 *
 */
;(function($){
    $.fn.fixHeaderTable = function(options){
        this.defaultcolWidth = 100;
        var defaults = {
            colsWidth:[],// 各列的宽度
            colsDataType:[],// 各列数据类型,默认string类型
            colsCanSort:[],// 各列是否能排序,默认不能
            colsContentType:[], // 内容类型
            height:300,
        };
        this.opts = $.extend({},defaults,options);

        this.tableWrap = null; // 表的外包对象
        this.mainTableWrap = null; // 表体的外包对象
        this.tableTitle = null;// 新生成的表头对象
        var _this = this;
        var $this = $(this);

        var init = function() {

            // 生成全表的外包对象
            _this.tableWrap = $("<div class='fixHeaderTable_TableWrap'></div>");
            _this.tableWrap.insertBefore($this);

            // 在源始表外面加一个wrap
            _this.mainTableWrap = $("<div class='fixHeaderTable_mainTableWrap'></div>");// 生成表体的外包对象
            _this.mainTableWrap.appendTo( _this.tableWrap);
            $this.appendTo(_this.mainTableWrap);

            // 生成新的表头,并添加表头样式
            _this.tableTitle = $("<table></table>");
            _this.tableTitle.addClass("fixHeaderTable_header");
            // 把源始表中的表头放到新生成的表头中
            $(_this.mainTableWrap.find("thead")[0]).appendTo(_this.tableTitle);
            // 把新的表头移到源始表div的前面
            _this.tableTitle.insertBefore(_this.mainTableWrap);

            // 保存有控制作用的列对象列表,列表中包括两列的所有控制列列表
            var $th_NoColSpan = null;

            // ********************得到有控制作用的列对象列表********************************************begin
            if (_this.tableTitle.find("tr").length > 1) { //如果表头有两行时对表头中的单列进行提取，并重新排序
                var $th = _this.tableTitle.find("tr").eq(0).find("th:not([colspan])"); // 得到第一行中没有列合并的对象
                var $th_2 = _this.tableTitle.find("tr").eq(1).find("th"); // 得到第二行的列对象
                var colsNo = 0;
                var $th_2_No = 0; // 保存第二行的列序号

                // 对表头中的两列数组合并成到一起，
                _this.tableTitle.find("tr").eq(0).find("th").each(function () {
                    var colSpan = 0;
                    if ($(this).is('[colspan]')) {
                        colSpan = parseInt($(this).attr("colspan"));
                        for (var i = 0; i < colSpan; i++) {
                            $th.splice(colsNo, 0, $th_2[$th_2_No]);
                            colsNo++;
                            $th_2_No++;
                        }
                    } else {
                        colsNo++;
                    }
                });
                $th_NoColSpan = $th;
            } else { // 如果表头只有一行时
                $th_NoColSpan = _this.tableTitle.find("th");
            }
            // ********************得到有控制作用的列对象列表**********************************************begin

            // ******************控制表头和表体的宽度******************************************************begin
            // 控制表头中各列的宽度
            $th_NoColSpan.each(function (index) {
                if (_this.opts.colsWidth[index] == null) //如果没有设置列的宽度时，用默认值
                    $(this).width(_this.defaultcolWidth);
                else
                    $(this).width(_this.opts.colsWidth[index]);
            });

            // 控制表体中各列的宽度
            if (_this.mainTableWrap.find("tr").length > 0) {
                _this.mainTableWrap.find("tr").each(function(){
                    $(this).find("td").each(function(index){
                        if (_this.opts.colsWidth[index] == null)
                            $(this).width(_this.defaultcolWidth);
                        else
                            $(this).width(_this.opts.colsWidth[index]);
                    });
                });
            };
            _this.mainTableWrap.width(_this.tableTitle.width());
            _this.mainTableWrap.css('margin','0 auto');
            // ******************控制表头和表体的宽度******************************************************end

            // *************用户点击列中表头对表中的列进行排序*********************************************begin
            $th_NoColSpan.each(function(index){
                // 如果index列有设置可排序，对该列进行排序
                if(_this.opts.colsCanSort[index]!=null&&typeof _this.opts.colsCanSort[index]!= undefined&&_this.opts.colsCanSort[index]) {
                    $(this).click(function () {
                        if(typeof $(this).attr("isAsc")=="undefined")
                            $(this).attr("isAsc","true");
                            var flag =$(this).attr("isAsc")=="true"?true:false;
                            flag = !flag;
                            var dataType = typeof _this.opts.colsDataType[index]== undefined||_this.opts.colsDataType[index]==null?"string":_this.opts.colsDataType[index];
                            var contentType = typeof _this.opts.colsContentType[index]== undefined||_this.opts.colsContentType[index]==null?"text":_this.opts.colsContentType[index];
                            //$th_NoColSpan.not($(this)).removeClass("fixHeaderTable_headerSortUp");
                            //$th_NoColSpan.not($(this)).removeClass("fixHeaderTable_headerSortDown");
                            SortTable(flag,index,dataType,contentType);
                            if(flag) {
                                $(this).addClass("fixHeaderTable_headerSortDown");
                                $(this).removeClass("fixHeaderTable_headerSortUp");
                            }// 添加排序小箭头
                            else{
                                $(this).addClass("fixHeaderTable_headerSortUp");
                                $(this).removeClass("fixHeaderTable_headerSortDown");
                            }
                            $(this).attr("isAsc",flag);
                    })
                }
            });
            // *************用户点击列中表头对表中的列进行排序*********************************************begin
            _this.mainTableWrap.height(_this.opts.height - _this.tableTitle.height());

        };
        // 得到列的排序主键值
        var findSortKey = function ($cell,type,contentType){
            var cellValue = "";
            if(contentType!="text") cellValue = $cell.find(contentType).val();
            else cellValue = $cell.text();
            switch(type){
                case "number":
                    if(cellValue==null&&typeof cellValue==undefined) return -9999;
                    var key = parseFloat(cellValue);
                    return isNaN(key) ? -9999 : key;
                    break;
                case "date":
                    if(cellValue==null||$cell.text()=="-") return new Date("1997-1-1").getTime();
                    return new Date(cellValue).getTime();
                    break;
                default: // string或其它
                    if(cellValue==null&&typeof cellValue==undefined) return "";
                   return cellValue;
            }
        };
        // 对表格进行排序
        var SortTable = function(isAsc,sortColNo,dataType,contentType){
            var rows = _this.mainTableWrap.find('tr'); //得到所有行的数组
            // 得到各行的排序字段
            $.each(rows, function(index, row) {
                row.sortValue = findSortKey($(row).children('td').eq(sortColNo),dataType,contentType);
            });
　　　　　　
            // 对行数组进行排序
            rows.sort(function(a, b) {
                if(isAsc) {
                    if (a.sortValue < b.sortValue) return 1;
                    else if(a.sortValue > b.sortValue) return -1;
                    else return 0;
                }
                else{
                    if (a.sortValue > b.sortValue) return 1;
                    else if(a.sortValue < b.sortValue) return -1;
                    else return 0;
                }
            });
　　　　　　
            // 把排好序的数组放入到页面中
            rows.each(function(index){
                rows.eq(index).prependTo(_this.mainTableWrap.find("tbody"));
            });

        };
        init();　// 对控件进行初始化

        // 对表体数据进行更新，导入数据到表体中
        // content表体数据内容，格式为:
        // <tr>
        //      <td>aa</td>
        //      <td>bb</td>
        //      <td>cc</td>
        //      <td>dd</td>
        // </tr>
        // <tr>.....</tr>
        this.loadData = function(content){　
            _this.mainTableWrap.find("tbody").empty();　// 清空表体内容
            _this.mainTableWrap.find("tbody").html(content);　// 把实体数据插入到表体中
            if( _this.mainTableWrap.find("tr").length > 0) { // 如果表体存在内容时,对表体内的第一行数据设置宽度
                _this.mainTableWrap.find("tr").eq(0).find("td").each(function (index) {
                    if (_this.opts.colsWidth[index] == null)//对于没有设置宽度的列，用默认值
                        $(this).width(_this.defaultcolWidth);
                    else
                        $(this).width(_this.opts.colsWidth[index]);
                });
            }
        };
        this.refreshData =function(){
            //_this.mainTableWrap.find("tbody").html();　// 把实体数据插入到表体中
            if( _this.mainTableWrap.find("tr").length > 0) { // 如果表体存在内容时,对表体内的第一行数据设置宽度
                _this.mainTableWrap.find("tr").eq(0).find("td").each(function (index) {
                    if (_this.opts.colsWidth[index] == null)//对于没有设置宽度的列，用默认值
                        $(this).width(_this.defaultcolWidth);
                    else
                        $(this).width(_this.opts.colsWidth[index]);
                });
            }
        }


       return this;
    }
})(jQuery);

/**
 * 说明：可锁定的编辑输入框控件
 * 功能：1、对编辑框进行状态的切换，不可编辑/可编辑
 *       2、
 * <input value='3' />
 *默认居中
 *
 */
;(function($){
    $.fn.editInput = function(options){
        var defaults ={
            width:50,
            submitFn:null
        };
        this.opts = $.extend({},defaults,options);
        var _this = this;
        var $this_parent = $(this);
        this._$CurInput = null;
        this.oldValue = null;

        $(this).each(function(){

            var $this = $(this);
            var $wrap = null;
            var submitFn = null;

            var init = function(){
                $this.width(_this.opts.width);
                $this.attr("readonly",true);
                $this.addClass("editInput_input");
                $this.attr("oldValue",$this.val());
                $wrap = $("<div class='editInput_wrap'></div>");
                var $edits = $("<div class='editInput_edit'></div>").css({
                    //background: 'url("images/confirm.png") no-repeat left 0'
                });
                var $submit = $ ("<div class='editInput_submit'></div>").css({
                    //background: 'url("images/confirm.png") no-repeat right 0'
                });
                $this.wrap($wrap);
                $edits.insertAfter($this);
                $submit.insertAfter($this);

                $edits.click(function(){
                    //初始化状态
                    $(".editInput_edit").css("display","inline-block");
                    $(".editInput_submit").hide();
                    $this_parent.removeClass("active").attr("readonly",true);
                    //点击改变
                    $(this).hide();
                    $(this).siblings(".editInput_submit").css("display","inline-block");
                    $this.addClass("active").attr("readonly",false);
                    _this._$CurInput = $this.parent("input");
                    $this.attr("oldValue",$this.val());
                    $this.focus().select();
                });


                $submit.click(function(){
                    if($this.val()!=$this.attr("oldValue")){
                       if( _this.opts.submitFn!=null){
                           _this.opts.submitFn($this,$this.attr("oldValue"));
                       }
                    }
                    $this.attr("oldValue",$this.val());
                    // 初始化状态
                    $(this).hide();
                    $(".editInput_edit").css("display","inline-block");
                    $this.removeClass("active").attr("readonly",true);

                });




                $this.blur(function(event){
                    setTimeout(function(){
                        $submit.hide();
                        $edits.css("display","inline-block");
                        $this.removeClass("active").attr("readonly",true);
                        $this.val($this.attr("oldValue"));
                    },200);
                });

            };

            this.updateValue = function(){
                $this.attr("readonly",false);
                $this.attr("oldValue");
                $this.attr("readonly",true);
            }

            this.submit = function(fn){
                submitFn = fn;
            };
            init();

        });

    }
})(jQuery);



// 创建滑控件***************************************begin
//defaultValue:初始值
//min,max：最小最大值
//isFloat：
//unit：
//透明度滑块拖动
//var scale=function (defaultValue,min,max,isFloat,unit){
//    this.wrap = $(
//        "<div class='scale1'>"+
//        "<div class='leftbar'></div>"+
//        "<span ></span>"+
//        "</div>"+
//        "<div class='transNum'>"+defaultValue+"</div>"+
//        "<div class='unit'>"+unit+"</div>"
//    );
//    $('.pDiv').empty();
//    this.wrap.appendTo('.pDiv');
//    this.content = document.getElementsByClassName('pDiv')[0];
//    this.btn=this.content.getElementsByTagName("span")[0];
//    this.bar=this.content.getElementsByClassName("scale1")[0];
//    this.step=this.bar.getElementsByTagName("div")[0];
//    this.title=this.content.getElementsByClassName("transNum")[0];
//    this._value = defaultValue;
//    this.min = min;
//    this.max = max;
//    this.isFloat = isFloat;
//    this.init();
//    return this;
//};
//
//scale.prototype={
//    init:function (){
//        var f=this,g=document,b=window,m=Math;
//        f.btn.onmousedown=function (e){
//            var x=(e||b.event).clientX;
//            var l=this.offsetLeft;
//            var max=f.bar.offsetWidth-this.offsetWidth;
//            g.onmousemove=function (e){
//                var thisX=(e||b.event).clientX;
//                var to=m.min(max,m.max(-2,l+(thisX-x)));
//                f.btn.style.left = to + 'px';
//                f.ondrag(m.round(m.max(0,to/max)*100),to);
//                b.getSelection ? b.getSelection().removeAllRanges() : g.selection.empty();
//            };
//            g.onmouseup=new Function('this.onmousemove=null');
//        };
//        this.setSlidePos(this._value);
//
//    },
//    ondrag:function (pos,x){
//        this.step.style.width = Math.max(0,x+6)+'px';
//        if(this.isFloat) this.title.innerHTML = this._value= new Number(this.min + (this.max-this.min) * pos /100.0).toFixed(1);
//        else this.title.innerHTML =  this._value = parseInt(this.min + (this.max-this.min) * pos /100) ;
//    },
//    setSlidePos:function(Value){
//        var barWidth = this.bar.offsetWidth;
//        var pos = parseInt((Value - this.min)/(this.max-this.min) * barWidth);
//        this.btn.style.left = pos+'px';
//        this.step.style.width = Math.max(0,pos+6)+'px';
//        if(this.isFloat) this.title.innerHTML = this._value= new Number(Value).toFixed(1);
//        else this.title.innerHTML = this._value= parseInt(Value);
//    },
//    getValue:function(){
//        if(this.isFloat) return new Number(this._value).toFixed(1);
//        else return parseInt(this._value);
//    },
//    slideShow:function(){
//        $('.pDiv').empty();
//        this.wrap.appendTo('.pDiv');
//        this.setSlidePos(this._value);
//    }
//};



//叠加等值面滑块拖动
var scale=function (PDiv,title,defaultValue,min,max,isFloat,unit,ondragFn){
    this._pDiv = PDiv;
    this.wrap = $(
        "<div class='ec1'>" +
        "<div class='ec1_1'></div>"+
        "<div class='ec1_2' >"+title+"</div>"+
        "<div class='ec1_3'>"+min+"</div>"+
        "<div class='ec1_4'>"+
        "<div class='scale'>"+
        "<div class='leftbar'></div>"+
        "<span class='barBtn'></span>"+
        "</div>"+
        "</div>"+
        "<div class='ec1_5'>"+max+"</div>"+
        "<div class='ec1_6' >"+defaultValue+"</div>"+
        "<strong>"+ unit+"</strong>"+
        "</div>");
    $("#"+PDiv).empty();
    this.wrap.appendTo("#"+PDiv);
    this.content = document.getElementById(PDiv);
    this.btn=this.content.getElementsByTagName("span")[0];
    this.bar=this.content.getElementsByClassName("scale")[0];
    this.title=this.content.getElementsByClassName("ec1_6")[0];
    this.step=this.bar.getElementsByTagName("div")[0];
    this._value = defaultValue;
    this.min = min;
    this.max = max;
    this.isFloat = isFloat;
    this.init(ondragFn);
    return this;
};

/*;(function($){
    $.fn.scale = function (){
        var PDiv,title,defaultValue,min,max,isFloat,unit
        var defaults ={
            ondrag:null
        };
        this.opts = $.extend({},defaults,options);
        PDiv = this.opts ;
        title = this.opts.title;
        defaultValue = this.opts.defaultValue;
        min = this.opts.min;
        max = this.opts.max;
        isFloat = this.opts.isFloat;
        unit = this.opts.unit;
        this.wrap = $(
            "<div class='ec1'>" +
            "<div class='ec1_1'></div>"+
            "<div class='ec1_2' >"+title+"</div>"+
            "<div class='ec1_3'>"+min+"</div>"+
            "<div class='ec1_4'>"+
            "<div class='scale'>"+
            "<div class='leftbar'></div>"+
            "<span ></span>"+
            "</div>"+
            "</div>"+
            "<div class='ec1_5'>"+max+"</div>"+
            "<div class='ec1_6' >"+defaultValue+"</div>"+
            "<strong>"+ unit+"</strong>"+
            "</div>");
        $("#"+PDiv).empty();
        this.wrap.appendTo("#"+PDiv);
        this.content = document.getElementById(PDiv);
        this.btn=this.content.getElementsByTagName("span")[0];
        this.bar=this.content.getElementsByClassName("scale")[0];
        this.title=this.content.getElementsByClassName("ec1_6")[0];
        this.step=this.bar.getElementsByTagName("div")[0];
        this._value = defaultValue;
        this.min = min;
        this.max = max;
        this.isFloat = isFloat;
        this.init();

        return this;
    };
})(jQuery);*/


scale.prototype={
    init:function (ondragFn){
        var f=this,g=document,b=window,m=Math;
        f.btn.onmousedown=function (e){
            var x=(e||b.event).clientX;
            var l=this.offsetLeft;
            var max=f.bar.offsetWidth-this.offsetWidth;
            g.onmousemove=function (e){
                var thisX=(e||b.event).clientX;
                var to=m.min(max,m.max(-2,l+(thisX-x)));
                f.btn.style.left=to+'px';
                if(ondragFn!=null){
                    ondragFn();
                }
                f.ondrag(m.round(m.max(0,to/max)*100),to);

                b.getSelection ? b.getSelection().removeAllRanges() : g.selection.empty();
            };
            g.onmouseup=new Function('this.onmousemove=null');
        };
        this.setSlidePos(this._value);

    },
    ondrag:function (pos,x){
        this.step.style.width = Math.max(0,x+6)+'px';
        if(this.isFloat) this.title.innerHTML = this._value= new Number(this.min + (this.max-this.min) * pos /100.0).toFixed(1);
        else this.title.innerHTML =  this._value = parseInt(this.min + (this.max-this.min) * pos /100) ;
    },
    setSlidePos:function(Value){
        var barWidth = this.bar.offsetWidth;
        var pos = parseInt((Value - this.min)/(this.max-this.min) * barWidth);
        this.btn.style.left = pos+'px';
        this.step.style.width = Math.max(0,pos+6)+'px';
        if(this.isFloat) this.title.innerHTML = this._value= new Number(Value).toFixed(1);
        else this.title.innerHTML = this._value= parseInt(Value);
    },
    getValue:function(){
        if(this.isFloat) return new Number(this._value).toFixed(1);
        else return parseInt(this._value);
    },
    slideShow:function(){
        $("#"+this._pDiv).empty();
        this.wrap.appendTo("#" + this._pDiv);
        this.setSlidePos(this._value);
    }
};
// 创建滑控件***************************************end


//弹出提示框*****************************************begin
/**
 对象创建：$.confirmWin(options)
 参数说明：options:{
                         width:100,   弹框宽度
                         height:true,　 弹框高度
                         title:"html格式的主标题"，   弹框主标题
                        text:"html格式内容",  主体内容，可用html标签
                        btnVal:"删除"　提交按钮
                        inputCss：{ }  input样式
                        submitFn：function(){}  点击提交按钮执行的函数
                         }
 事件说明：

 *
 */
;(function($){
    $.confirmWin = function(options){
        var defaults = {
            width:400,
            height:300,
            title:"html格式的主标题",
            text:"html格式内容",
            btnVal:"删除",
            submitFn:function(){},
            cancelFn:function(){},
            errorCheck:function(){},
            inputCss:{
                width: "398px",
                height: "28px",
                padding: "0 30px 0 10px",
                marginBottom: "10px",
            }
        };
        this.opts = $.extend({},defaults,options);
        this.isError = false;
        this.content = null;
        var _this = this;
        var init = function(){
            var maskDiv = $("<div class='confirmWin_mask'></div>");

            var winDiv = $("<div class='confirmWin_winFrame'></div>").css({
                    width: _this.opts.width,
                    height: _this.opts.height,
                }
            );

            var titleDiv = $("<div class='confirmWin_titleDiv'><div class='confirmWin_title'>"
                            + _this.opts.title + "</div><div class='confirmWin_closeIcon'></div></div>");

            var contentDiv = $("<div class='confirmWin_content'>"+_this.opts.text+"</div>");
            _this.content = contentDiv;
            if(contentDiv.find("input").length > 0) {
                contentDiv.find("input").css(_this.opts.inputCss);

                contentDiv.find("input").each(function(){
                    $(this).blur(function(){
                        if($(this).attr("required")){
                            this.isError = _this.opts.errorCheck.call($(this).parent());
                        }
                    })
                })

            }

            var btnDiv = $("<div class='confirmWin_btnDiv'><div class='confirmWin_enterBtn'>"+_this.opts.btnVal+"</div><div class='confirmWin_cancleBtn'>取消</div>");

            maskDiv.appendTo($('body'));
            titleDiv.appendTo(winDiv);
            contentDiv.insertAfter(titleDiv);
            btnDiv.insertAfter(contentDiv);
            winDiv.insertAfter(maskDiv);

            winDiv.css({
               top:($(document).height()/2 - $(winDiv).height()/2)+'px',
                left:($(document).width()/2 - $(winDiv).width()/2)+'px',
            });

            maskDiv.show();
            winDiv.show();

            var closeWin = function(){
                maskDiv.fadeOut(300);
                winDiv.fadeOut(300);
                winDiv.remove();
                maskDiv.remove();

            };
            var cancelInfo = function(){
                if( _this.opts.cancelFn!=null){
                    _this.opts.cancelFn();
                }
                closeWin();
            };

            $(".confirmWin_closeIcon").click(cancelInfo);
            $(".confirmWin_cancleBtn").click(cancelInfo);
            $(".confirmWin_enterBtn").click(function(){
                var returnValue = _this.opts.submitFn.call(_this.content);
                if(returnValue||returnValue==null){
                    closeWin();
                };
            });
        };
        init();


       //return this;

    }

})(jQuery);

//*********弹出提示框****************************************end

//*********圆环进度控件*****************************************begin
/**
 对象创建：


 参数说明：


 事件说明：


 */

;(function($) {
    $.fn.svgCircle = function(options) {
        var opts= $.extend({
            parent: null,
            w: 75,
            R: 30,
            sW: 20,
            color: ["#000", "#000"],
            perent: [100, 100],
            speed: 0,
            delay: 1000
        }, options);
        return this.each(function() {
            var e = opts.parent;
            if (!e) return false;
            var w = opts.w;
            //$("")
            var r = Raphael(e, w, w),
                R = opts.R,
                init = true,
                param = {
                    stroke: "#ced3dd",
                    "stroke-width": 15,
                    "stroke-linecap": "round",  //开放路径的终结,圆形
                    "filter":"url(#blurFilter2)"
                },
                hash = document.location.hash,
                marksAttr = {
                    fill: hash || "#444",
                    stroke: "none"
                };

            var filterStr = ' <filter id="Filter1" y="-10" height="40" x="-10" width="150">'+
                '<feOffset in="SourceAlpha" dx="3" dy="3" result="offset2" />'+
                '<feGaussianBlur in="offset2" stdDeviation="3"  result="blur2"/>'+
                '<feMerge>'+
                '<feMergeNode in="blur2" />'+
                '<feMergeNode in="SourceGraphic" />'+
                '</feMerge>'+
                '</filter>';

            $(filterStr).appendTo($(r.defs));
            //console.log(r.path());
            r.customAttributes.arc = function(b, c, R) {
                var d = 360 / c * b,
                    a = (90 - d) * Math.PI / 180,
                    x = w / 2 + R * Math.cos(a),
                    y = w / 2 - R * Math.sin(a),
                    color = opts.color,
                    path;
                if (c == b) {
                    path = [
                        ["M", w / 2, w / 2 - R],
                        ["A", R, R, 0, 1, 1, w / 2 - 0.01, w / 2 - R]
                    ]
                } else {
                    path = [
                        ["M", w / 2, w / 2 - R],
                        ["A", R, R, 0, +(d > 180), 1, x, y]
                    ]
                }
                return {
                    path: path
                }
            };
            var f = r.path().attr({
                stroke: "#e5ebf6",
                "stroke-width": opts.sW
            }).attr({
                arc: [110, 110, R]
            }).attr({filter:"url(#Filter1)"});

            var g = r.path().attr({
                stroke: "#ff0000",
                "stroke-width": opts.sW
            }).attr(param).attr({
                arc: [0.01, opts.speed, R]
            });
            var h;
            if (opts.perent[1] > 0) {
                setTimeout(function() {
                    g.animate({
                        stroke: opts.color[1],
                        arc: [opts.perent[1], 100, R]
                    }, 900, ">")
                }, opts.delay)
            } else {
                g.hide()
            }
        })
    }
})(jQuery);
//*********圆环进度控件*****************************************end
