var screenItem = $(".screen-item");
var yjw = '/yingjiao';

var zTree, treeMenu;
var setting = {
  data: {
    simpleData: {
      enable: false
    }
  },
  callback: {
  	beforeClick:BeforeClick,
    onRightClick: OnRightClick,
    onClick:OnClick
  }
};

//右键点击事件
function OnRightClick(event, treeId, treeNode) {
  zTree.selectNode(treeNode)
  $(event.target.closest('li')).addClass("checkTreeNode");
  showRMenu(event.target.closest('li').getBoundingClientRect().right, event.target.closest('li').getBoundingClientRect().top);
};

// 点击事件之前判断是不是选择父菜单的树形菜单，不是的话则不会触发点击事件
function BeforeClick(treeId, treeNode, clickFlag){
	if(treeId != "treeMenu"){
		return false;
	};
};

var selectPName,selectPId;
//单击事件
function OnClick(event, treeId, treeNode) {
	selectPName = treeNode.name;
	selectPId = treeNode.id;
	//$("#treePNodeName").val(treeNode.name);
  //$("#treePNodeId").val(treeNode.id); 	
};

// 右键点击知识点菜单显示操作菜单
function showRMenu(x, y) {
  if($('.treeMenu').length == 0) {
    var menuHtml =
      "<div class=\"treeMenu\">" +
      "<ul>" +
      "<li onclick=\"addTreeNode()\" ><a href=\"javascript:void(0);\" >新增</a></li>" +
      "<li onclick=\"removeTreeNode()\" class=\"del-menu\"><a href=\"javascript:void(0);\">删除</a></li>" +
      "<li onclick=\"updateTreeNode()\" class=\"upt-menu\"><a href=\"javascript:void(0);\">修改</a></li>" +
      "</ul>" +
      "</div>";
    $('body').append(menuHtml);
    treeMenu = $(".treeMenu");
  };
  var selectNode = zTree.getSelectedNodes()[0];
  if(selectNode && selectNode.id == 0) {
    $('.del-menu,.upt-menu').hide();
  } else {
    $('.del-menu,.upt-menu').show();
  };
  $('.treeMenu').css({
    'position': 'absolute',
    'z-index': 10000,
    'left': x - 130 + 'px',
    'top': y + 18 + 'px',
  }).show();
  $("body").bind("mousedown", onBodyMouseDown);
}

//隐藏操作菜单
function hideRMenu() {
  if(treeMenu) treeMenu.hide();
  $('li').removeClass("checkTreeNode");
  $("body").unbind("mousedown", onBodyMouseDown);
};

function onBodyMouseDown(event) {
  if(!(event.target.id == "treeMenu" || $(event.target).parents(".treeMenu").length > 0)) {
    $('li').removeClass("checkTreeNode");
    treeMenu.hide();
  };
};

//  修改知识点菜单
function updateTreeNode() {
  hideRMenu();
  var selectNode = zTree.getSelectedNodes()[0];
  if(selectNode.getParentNode()){
    $("#treePNodeName").val(selectNode.getParentNode().name);
    $("#treePNodeId").val(selectNode.getParentNode().id); 	
  };
  $("#treeNodeName").val(selectNode.name);
  $("#treeNodeId").val(selectNode.id);
};

//添加知识点子菜单
function addTreeNode() {
  hideRMenu();
  var selectNode = zTree.getSelectedNodes()[0];
  $("#treePNodeName").val(selectNode.name);
  $("#treePNodeId").val(selectNode.id);
};

//添加或修改知识点菜单
layui.use('form', function() {
  var form = layui.form;
  //监听提交
  form.on('submit(showTreeForm)', function(data) {
    var treeFormStr = JSON.stringify(data.field);
    var treeFormData = JSON.parse(treeFormStr);
    treeFormData.springraintoken = 's_e887561f722f4969b766e69121d4a25c';
    treeFormData.schoolId = "7b2f509c01b04e669c281e89803e2768";
    treeFormData.period = $(".study-period.check").attr("data-period");
    treeFormData.subjectId = $(".screen-object.check").attr("data-subjectId");
    $.ajax({
      type: "post",
      url: yjw + "/teach/knowledgepoint/update",
      dataType: "json",
      data: treeFormData,
      async: true,
      success: function(res) {
      	var statusCode = res.statusCode;
      	switch (statusCode) {
      		case '200':
      		layer.msg(res.message, {icon: 6,shade: [0.3, '#000']}); //执行成功提示内容
	      	$(".layui-input").val("");
	  		$(".layui-textarea").val("");
	      	queryKnowledgepointList();
      		break;
      		case '300':
      		console.log("300");
      		break;
      		case '400':
      		console.log("400");
      		break;
      		default:
      		console.log(statusCode);
      	}
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.log("状态码 : " + XMLHttpRequest.status);
        console.log("状态 : " + XMLHttpRequest.readyState);
        console.log("错误信息 : " + textStatus);
      }
    });
    return false;
  });
});

//删除知识点菜单
function removeTreeNode() {
  hideRMenu();
  var selectNode = zTree.getSelectedNodes()[0];
  var treeNodeId = selectNode.id;
  if(selectNode) {
    if(selectNode.isParent) { //删除的市是父级菜单
      var msg = "正在删除的是父节点菜单【" + selectNode.name + "】，将连同子菜单一起删除!";
      layui.use("layer", function() {
        var layer = layui.layer;
        layer.alert(msg, {
          skin: 'layui-layer-molv',
          title: "确认",
          btn: ['确认', '取消'],
          icon: 3,
          yes: function(index, layero) { //确认连同子菜单一块删除
            $.ajax({
              type: "post",
              dataType: "json",
              url: yjw + "/teach/knowledgepoint/delete",
              async: true,
              data: {
                springraintoken: "s_e887561f722f4969b766e69121d4a25c",
                id: treeNodeId
              },
              success: function(res) {
                layer.close();
                layer.msg('菜单删除成功', {icon: 6,shade: [0.3, '#000']}); //执行成功提示内容
                queryKnowledgepointList();
              },
              error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log("状态码 : " + XMLHttpRequest.status);
                console.log("状态 : " + XMLHttpRequest.readyState);
                console.log("错误信息 : " + textStatus);
              }
            });
          }
        });
      });
    } else {
      var msg = "删除这个菜单，是否继续?";
      layui.use("layer", function() {
        var layer = layui.layer;
        layer.alert(msg, {
          skin: 'layui-layer-molv',
          title: "确认",
          btn: ['确认', '取消'],
          icon: 3,
          yes: function(index, layero) { 
            $.ajax({
              type: "post",
              dataType: "json",
              url: yjw + "/teach/knowledgepoint/delete",
              async: true,
              data: {
                springraintoken: "s_e887561f722f4969b766e69121d4a25c",
                id: treeNodeId
              },
              success: function(res) {
                layer.close();
                layer.msg('菜单删除成功', {icon: 6,shade: [0.3, '#000']});
                queryKnowledgepointList();
              },
              error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log("状态码 : " + XMLHttpRequest.status);
                console.log("状态 : " + XMLHttpRequest.readyState);
                console.log("错误信息 : " + textStatus);
              }
            });
          }
        });
      });
    };
  };
};

//选中treeNode
function checkTreeNode(checked) {
  var nodes = zTree.getSelectedNodes();
  if(nodes && nodes.length > 0) {
    zTree.checkNode(nodes[0], checked, true);
  }
  hideRMenu();
}

function resetTree() {
  hideRMenu();
  $.fn.zTree.init($("#treeDemo"), setting);
}

queryGradeType();
/*****
 * 进入页面加载学段和年级
 * ****/
function queryGradeType() {
  $.ajax({
    type: "post",
    dataType: "json",
    url: yjw + "/system/dicdata/gradeType/list/json?springraintoken=s_e887561f722f4969b766e69121d4a25c",
    async: false,
    success: function(res) {
      var resultData = res.data;
      resultData.sort(compare('code'));
      var periodList = "";
      for(var i = 0; i < resultData.length; i++) {
        if(i == 0) {
          periodList += '<div class="screen-item study-period check" data-period="' + resultData[i].code + '">' + resultData[i].name + '</div>';
        } else {
          periodList += '<div class="screen-item study-period" data-period="' + resultData[i].code + '">' + resultData[i].name + '</div>';
        };
      };
      $(".screen-period-wrap").html(periodList);
      //学段点击事件
      $(document).on("click", ".study-period", function() {
        $(this).addClass("check").siblings(".study-period").removeClass("check");
        queryKnowledgepointList();
      });
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      console.log("状态码 : " + XMLHttpRequest.status);
      console.log("状态 : " + XMLHttpRequest.readyState);
      console.log("错误信息 : " + textStatus);
    }
  });
}
//根据数组中某个对象的值对数组进行排序
function compare(property) {
  return function(a, b) {
    var value1 = a[property];
    var value2 = b[property];
    return value1 - value2;
  }
}

//请求科目列表
querySubject();
function querySubject(period) {
  $.ajax({
    type: "post",
    dataType: "json",
    url: yjw + "/baseinfo/subject/list/json",
    async: false,
    data: {
      springraintoken: 's_e887561f722f4969b766e69121d4a25c',
      schoolId: '7b2f509c01b04e669c281e89803e2768'
    },
    success: function(res) {
      var resultData = res.data;
      var subjectList = "";
      for(var i = 0; i < resultData.length; i++) {
        if(i == 0) {
          subjectList += '<div class="screen-item screen-object check" data-subjectId="' + resultData[i].id + '">' + resultData[i].name + '</div>';
        } else {
          subjectList += '<div class="screen-item screen-object" data-subjectId="' + resultData[i].id + '">' + resultData[i].name + '</div>';
        };
      };
      $(".screen-subject-wrap").html(subjectList);
      //不同学科的点击事件
      $(document).on("click", ".screen-object", function() {
        $(this).addClass("check").siblings(".screen-object").removeClass("check");
        queryKnowledgepointList();
      });
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      console.log("状态码 : " + XMLHttpRequest.status);
      console.log("状态 : " + XMLHttpRequest.readyState);
      console.log("错误信息 : " + textStatus);
    }
  });
};
queryKnowledgepointList();
//根据条件查询知识点列表
function queryKnowledgepointList() {
  var periodId = $(".study-period.check").attr("data-period");
  var subjectId = $(".screen-object.check").attr("data-subjectId");
  $.ajax({
    type: "post",
    dataType: "json",
    url: yjw + "/teach/knowledgepoint/tree",
    async: false,
    data: {
      springraintoken: 's_e887561f722f4969b766e69121d4a25c',
      //    schoolId: '7b2f509c01b04e669c281e89803e2768',
      period: periodId,
      subjectId: subjectId

    },
    success: function(res) {
      var resultData = res.data;
      var zNode = resultData;
      $.fn.zTree.init($("#treeDemo"), setting, zNode);
      zTree = $.fn.zTree.getZTreeObj("treeDemo");
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      console.log("状态码 : " + XMLHttpRequest.status);
      console.log("状态 : " + XMLHttpRequest.readyState);
      console.log("错误信息 : " + textStatus);
    }
  });
};

// 表单序列化的方法
$.fn.serializeObject = function() {
  var o = {};
  var a = this.serializeArray();
  $.each(a, function() {
    if(o[this.name] !== undefined) {
      if(!o[this.name].push) {
        o[this.name] = [o[this.name]];
      }
      o[this.name].push(this.value || '');
    } else {
      o[this.name] = this.value || '';
    }
  });
  return o;
};

//清空父级菜单
$(".clearParent").on("click",function(){
  $("#treePNodeName").val("");
  $("#treePNodeId").val("");
});

//点击父级输入框选择父级菜单
function selectParentMenu(){
  var treeNodeMenuData = getTreeMenuData();
  var selectParentMenuWrap = $("#selectParentMenuWrap");
  $.fn.zTree.init($("#treeMenu"), setting, treeNodeMenuData);
  layui.use("layer",function(){
  	var layer = layui.layer;
  	var index = layer.open({
  		type:1,
  		area:["500px","300px"],
  		title:"选择父菜单",
  		content:selectParentMenuWrap,
  		btn:["确定"],
  		yes:function(index,layero){
  			layer.close(index);
  			$("#treePNodeName").val(selectPName);
  			$("#treePNodeId").val(selectPId); 
  		},
  	})
  });
  
}
function getTreeMenuData() {
  var zNode;
  var periodId = $(".study-period.check").attr("data-period");
  var subjectId = $(".screen-object.check").attr("data-subjectId");
  $.ajax({
    type: "post",
    dataType: "json",
    url: yjw + "/teach/knowledgepoint/tree",
    async: false,
    data: {
      springraintoken: 's_e887561f722f4969b766e69121d4a25c',
      //    schoolId: '7b2f509c01b04e669c281e89803e2768',
      period: periodId,
      subjectId: subjectId

    },
    success: function(res) {
      var resultData = res.data;
      zNode = resultData;
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      console.log("状态码 : " + XMLHttpRequest.status);
      console.log("状态 : " + XMLHttpRequest.readyState);
      console.log("错误信息 : " + textStatus);
    }
  });
  return zNode;
};