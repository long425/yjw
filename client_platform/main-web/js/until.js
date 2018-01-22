/**
 * 作者：李祥龙
 * 日期：2018年1月20日
 * js日常常用方法集
 */

// form表单序列化方法
function serializeObject() {
  var o = {};
  var a = this.serializeArray();
  $.each(a,function(){
  	if(o[this.name] !== undefined){
  		if(!o[this.name].push){
  			o[this.name = [o[this.name]];
  		};
  		o[this.name].push(this.value || '');
  	}else{
  		o[this.name] = this.value || '';
  	};
  });
  return o;
};