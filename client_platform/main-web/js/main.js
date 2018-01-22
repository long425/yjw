$(function() {
  var self = {};
  self.commonFun = function(type) {
    var $cur;
    $(document).off('click', '.tab-item').on('click', '.tab-item', function(event) {
      //event.preventDefault();
      var index = $(this).index();
      $(".tab-item").find("input")[0].checked = false;

      $(this).find("input")[0].checked = true;
      $(".tab-item").removeClass("on");
      $(this).addClass("on");

      $(".question-point-below-wrap").find('.pcitem').removeClass('on');
      $(".question-point-below-wrap").find('.pcitem').eq(index).addClass('on');
      $cur = $(document).find('.pcitem.on');
      //var type = $box.find('.pcitem.on').attr('data-type');
      if(self[type] && self[type]['tab' + index]) {
        self[type]['tab' + index]($cur);
      }
    });
  };

  self.questionManage = function() {
    $.get('../commonUI/tkData/template/questions-manage.html', function(res) {
      $(".layui-body").html(res);
      self.commonFun('questionManage');
      var tabOn = $('.tab-item.on');
      var onIndex = $('.tab-item.on').index();
      //按知识点
      self.questionManage.tab0 = function(cur) {
        $("#knowledge-tree-point").empty();
        var nodesList = [{name: '数与代数',id: 1,alias: 'daishu',
            children: [{name: '数的认识',id: 11,alias: 'weidu'}, {name: '数的运算',id: 12}, { name: '应用题',id: 13}]},
          {name: '空间与图形',id: 2,spread: true,
            children: [{name: '图形的认识',id: 21,spread: true,
                children: [{name: '测量与作图',id: 211,
                    children: [{name: '测量1',id: 2111}, {name: '测量2',id: 2112}, {name: '作图',id: 2113}]},
                  {name: '图形与变换',id: 212}, {name: '图形与位置',id: 213}]},
              {name: '空间图形',id: 22,
                children: [{name: '空间图形认识',id: 221}, {name: '空间图形运算',id: 222}, {name: '空间图形建模',id: 223}]
             }]
         }];
        layui.use('tree', function() { //树形菜单
          layui.tree({
            elem: '#knowledge-tree-point', //传入元素选择器
            skin: 'shihuang',
            nodes: nodesList,
            click: function(node) {
              console.log(node) //node即为当前点击的节点数据
            }
          });
        });
      };
      //按章节
      self.questionManage.tab1 = function(cur) {
        $("#knowledge-tree-chapter").empty();
        var nodesList = [{name: '第一章',id: 1,alias: '1zhang',children: [{name: '第一节',id: 11,alias: 'weidu'}, {name: '第二节',id: 12}, {name: '第三节',id: 13}]},
          {name: '第二章',id: 2,spread: true,children: [{name: '第一节',id: 21,spread: true,
                children: [{name: '第一小节',id: 211,children: [{name: '测试1',id: 2111}, {name: '测试2',id: 2112}, {name: '测试3',id: 2113}]},
                  {name: '第二小节',id: 212}, {name: '第三小节',id: 213}]},
              {name: '第二节',id: 22,children: [{name: '第一小节',id: 221}, {name: '第二小节',id: 222}, {name: '第三小节',id: 223}]
             }]
         }];
         //创建树形菜单
        layui.use('tree', function() { //树形菜单
          layui.tree({
            elem: '#knowledge-tree-chapter', //传入元素选择器
            skin: 'shihuang',
            nodes: nodesList,
            click: function(node) {
              console.log(node) //node即为当前点击的节点数据
            }
          });
        });
      };
      self.questionManage['tab' + onIndex]();
      
      //点击筛选条件
      var screenList = $(".screen-list");
			screenList.on("click", function() {
  			$(this).addClass("check").siblings(".screen-list").removeClass("check");
			});
			//点击答案与解析
			$(".answer-test").on("click",function(){
				if($(this).find("span").html() == "答案和解析"){
					$(this).find("span").html("收起答案和解析");
					$(".answer-analysis-wrap").show();
				}else{
					$(this).find("span").html("答案和解析");
					$(".answer-analysis-wrap").hide();
				};
			});
    });
  }
  self.commonFun();
  self.questionManage();
});