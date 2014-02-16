;(function (window, $, undefined) {
    function Vote () {
    }
    
    Vote.prototype = {
        init: function () {
            this.bindEvt();
            this.initDatePicker();
        },
        
        bindEvt: function () {
            $('a.delBtn').on('click', this.onDelBtnClick);
            $('#addItemBtn').on('click', this, this.onAddItemBtnClick);
            $('#itemSel').on('dblclick', this, this.onItemSelDblclick);
        },
        
        onDelBtnClick: function () {
            var id = this.id;
            if (confirm('确定要删除该记录吗？')) {
                window.location.href = '/delVote/'+id;
            }
        },
        
        onDateIconClick: function () {
            $(this).datetimepicker();
        },
        
        initDatePicker: function () {
            $('#datePicker').datetimepicker({
                language:  'zh-CN',
                weekStart: 1,
                todayBtn:  0,
                autoclose: 1,
                todayHighlight: 1,
                startView: 2,
                minView: 2,
                forceParse: 0
            });
        },
        
        onAddItemBtnClick: function (e) {
            var $newItemTxt = $('#newItemTxt'),
                newVal = $newItemTxt.val(),
                $itemSel = $('#itemSel'),
                that = e.data;
            // TODO check newVal
            $itemSel.prepend('<option>'+newVal+'</option>');
            $newItemTxt.val('');
            that.resetProjItems();
        },
        
        onItemSelDblclick: function (e) {
            var that = e.data;
            $(e.target).remove();
            that.resetProjItems();
        },
        
        resetProjItems: function () {
            var $itemSel = $('#itemSel'),
                $opts = $itemSel.find('option'),
                i, len = $opts.length,
                $projItems = $('input[name=projItems]'),
                items = [];
            for (i=0; i<len; i++) {
                items.push($($opts[i]).text());
            }
            $projItems.val(items.join('||'));
        }
    }
    
    new Vote().init();
    
})(window, jQuery);