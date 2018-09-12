/**
 * Created by Administrator on 2017/5/19.
 */
(function($){
  var Dialog=function(config){
    var _this_=this;
    this.config={
      //对话框的宽度
      width:'auto',
      //对话框的高度
      height:'auto',
      //对话框的消息
      message:null,
      //对话框的类型
      type:'warning',
      //对话框的延迟时间
      delay:null,
      //对话框的按钮,
      button:null,
      //对话框遮罩层的透明度
      maskOpacity:null,
      //
      effect:true
    }
    if(config&&$.isPlainObject(config)){
      $.extend(this.config,config)
    }else{
      this.isConfig=true
    }
    console.log(this.config)
    //创建基本的Dom
    this.body=$('body')
    //创建遮罩层
    this.mask=$('<div class="g-dialog-container">')
    //创建弹出框
    this.win=$('<div class="dialog-window">')
    //创建弹出框头部
    this.winheader=$('<div class="dialog-header">')
    //创建提示信息
    this.wincontent=$('<div class="dialog-content">')
    //创建按钮组
    this.winfooter=$('<div class="dialog-footer">')
    //创建对话框
    this.create()
  };
  Dialog.zIndex=10000;
  Dialog.prototype={
    //创建动画的函数
    animate:function(){
      var _this_=this;
      this.win.css('transform','scale(0,0)')
      setTimeout(function(){
        _this_.win.css('transform','scale(1,1)')
      },100)
    },
    create:function(){
      var _this_=this,
        config=this.config,
        mask=this.mask,
        win=this.win,
        header=this.winheader,
        content=this.wincontent,
        footer=this.winfooter,
        body=this.body;
      Dialog.zIndex++;
      mask.css('zIndex',Dialog.zIndex)
      //如果没有传递任何参数
      //就弹出一个等待图标的对话框
      if(this.isConfig){
        win.append(header.addClass(config.type))
        mask.append(win)
        body.prepend(mask)
        if(config.effect){
          this.animate()
        }
        setTimeout(function(){
          _this_.close()
        },3000)
      }else{
        win.append(header.addClass(config.type))
        if(config.width){
          win.width(config.width)
        }
        if(config.height){
          win.height(config.height)
        }
        if(config.maskOpacity){
          mask.css('background','rgba(0,0,0,+'+config.maskOpacity+')')
        }
        if(config.message){
          win.append(content.append(config.message))
        }
        if(config.delay&&config.delay!=0){
          setTimeout(function(){
            _this_.close()
          },config.delay)
        }
        if(config.button){
          this.createButtons(config.button,footer);
          win.append(footer)
        }
        if(config.effect){
          this.animate()
        }
        mask.append(win)
        body.prepend(mask)
      }
    },
    //创建buttons的方法
    createButtons:function(buttons,footer){
      var _this_=this
      $(buttons).each(function(i){
        var type=this.type?'class='+this.type:''
        var text=this.text?this.text:'按钮'+(++i)
        var callback=this.cb?this.cb:null
        var button=$('<button '+type+'>'+text+'</button>')
        if(callback){
          button.on('click',function(){
            var isClose=callback()
            if(isClose!=false){
              _this_.close()
            }
          })
        }else{
          button.on('click',function(){
            _this_.close()
          })
        }
        footer.append(button)
      })
    },
    close:function(){
      this.mask.remove()
    }
  }
  window.Dialog=Dialog
  $.Dialog=function(config){
    return new Dialog(config)
  }
})($)
$(function(){
  window.dia=$.Dialog({
    type:'waiting',
    message:'正在拼命加载，请稍后！'
  })
  var queryString=location.search;
  var qsArr=queryString.split('=');
  var userId=qsArr[1];
  console.log('userID is '+userId)
  sessionStorage['userId'] = userId;
  //sessionStorage['userId']='012855';
  //$('#lblUserId').html(sessionStorage['userId'])
  renderSelect($('#spzt').get(0),
    baseData.getAddr()+'duty/querySpztList.action',
    "dmz",
    "dmmc",
    defaultSelectResponse4Dict
  );
  renderSelect($('#pbzt').get(0),
    baseData.getAddr()+'duty/queryPbztList.action',
    "dmz",
    "dmmc",
    defaultSelectResponse4Dict
  );
  renderSelect($('#ssdd').get(0),
    baseData.getAddr()+'duty/getOrgList4User.action?userId='+sessionStorage['userId'],
    "orgId",
    "orgName",
    defaultSelectResponse4Dict
  );
  renderTable($('#table'),baseData.getAddr()+'duty/query4DutyPage.action')
  $.ajax({
    type:'GET',
    url:baseData.getAddr()+'duty/getUserName.action',
    dataType:'jsonp',
    data:{userId:userId},
    success:function(data){
      if(data.data[0]!=='error'){
        sessionStorage['userName']=data.data[0];
        $('#lblUserId').html(sessionStorage['userName'])
      }else{
        $.Dialog({
          //type:'waiting',
          message:'用户姓名请求失败',
          delay:1500
        })
      }
    },
    error:function(){
      $.Dialog({
        message:'数据请求失败',
        delay:1500
      })
      console.log('error')
    }
  })
})
var tableDefinition4DutyAdd=[
  {"key":"dutyid","value":"排班编号"},
  {"key":"orgname","value":"所属大队"},
  {"key":"startdate","value":"起始时间"},
  {"key":"enddate","value":"结束时间"},
  {"key":"pbzt","value":"排班状态"},
  {'key':"spzt",'value':'审批状态'},
  {'key':"operateList",'value':'操作'}
];
//定义大队的id的全局变量orgid
var orgid;
//定义排班状态的全局变量audtistate
var audtistate;
//定义审批状态的全局变量state
var state;
//定义duty用来保存所有的duty
var duty;
//定义当前的duty
var currentDuty;
//定义当前页数
var pn;
//定义渲染select的公共方法
function renderSelect(targetSelect,url,key,name,doResponse){
  if(!doResponse){
    doResponse=defaultSelectResponse;
  }
  $.ajax({
    type:'GET',
    url:url,
    dataType:'jsonp',
    success:function(data){
      $(targetSelect).children().remove();
      doResponse(data,targetSelect,key,name)
    },
    error:function(){
      dia.close()
      $.Dialog({
        //type:'warning',
        message:'数据请求失败！',
        delay:1500
      })
      $(targetSelect).children().remove();
      console.log('error')
    }
  })
}
//处理响应消息的函数
function defaultSelectResponse(data,targetSelect,key,name){
  var option=data.data;
  for(var i=0;i<option.length;i++){
    var def=option[i]
    $(targetSelect).append('<option value='+def[key]+'>'+def[name]+'</option>')
  }
}
function defaultSelectResponse4Dict(data,targetSelect,key,name){
  var option=data.data;
  $(targetSelect).append('<option value="-1"> 全部</option>')
  for(var i=0;i<option.length;i++){
    var def=option[i]
    $(targetSelect).append('<option value='+def[key]+'>'+def[name]+'</option>')
  }
  if(option.length==1){
    sessionStorage['orgName']=option[0][name]
    sessionStorage['orgId']=option[0][key]
  }
}
function renderTable($table,url){
  $table.children().remove();
  //渲染thead
  (function(){
    var $thead=$('<thead></thead>');
    var $tr=$('<tr></tr>');
    for(var i=0;i<tableDefinition4DutyAdd.length;i++){
      var def=tableDefinition4DutyAdd[i];
      var $th=$('<th></th>');
      if(def.value=='操作'){
        $th.addClass('operate')
      }
      $th.append(def.value);
      $tr.append($th)
    }
    $thead.append($tr)
    $table.append($thead)
  })();
  //渲染tbody
  orgid='';
  audtistate='';
  state='';
  pn=1
  loadByPage($table,url,orgid,audtistate,state,pn);
}
function loadByPage($table,url,orgid,audtistate,state,pageNum){
  $table.children('tbody').remove()
  $('#page>ul').children().remove()
  $.ajax({
    type:'GET',
    url:url,
    dataType:'jsonp',
    data:{orgid:orgid,currentstate:audtistate,state:state,pageNo:pageNum,pageSize:15,userId:sessionStorage['userId']},
    success:function(data){
      dia.close()
      console.log(data)
      console.log(data.pageResult.showAdd)
      sessionStorage['showAdd']=data.pageResult.showAdd;
      if(sessionStorage['showAdd']==='false'){
        $('a:contains(添加)').css('visibility','hidden')
      }
      duty=data.pageResult.entityList;
      var pageNum=data.pageResult.pageNo;
      var totalPages=data.pageResult.totalPages
      var $tbody=$('<tbody></tbody>');
      for(var i=0;i<duty.length;i++){
        var $tr=$('<tr></tr>');
        var currentDuty=duty[i]
        for(var j=0;j<tableDefinition4DutyAdd.length;j++){
          var def=tableDefinition4DutyAdd[j];
          var $td=$('<td></td>');
          switch(def.key){
            case 'dutyid':{
              $td.append(currentDuty[def.key]);
              break;
            };
            case 'orgname':{
              $td.append(currentDuty[def.key]);
              break;
            };
            case 'startdate':{
              $td.append(currentDuty[def.key]);
              break;
            };
            case 'enddate':{
              $td.append(currentDuty[def.key]);
              break;
            };
            case 'pbzt':{
              if(currentDuty[def.key]==''){
                $td.append('未开始')
              }else{
                $td.append(currentDuty[def.key]);
              }
              break;
            };
            case 'spzt':{
              $td.append(currentDuty[def.key]);
              break;
            };
            case 'operateList':{
              var optobj=currentDuty[def.key];
              (function(){
                for(var i=0;i<optobj.length;i++){
                  var def=optobj[i]
                  //var $a=$('<a href=dutyAdd.html id='+currentDuty.dutyid+'></a>')
                  //$a.append(def.name);
                  //$td.addClass('operate')
                  switch (def.name){
                    case '查看':{
                      var $a=$('<a href=dutyAdd.html id='+currentDuty.dutyid+'></a>')
                      $a.append(def.name);
                      $td.addClass('operate')
                      $a.on('click',showOpt)
                      $td.append($a).append('&nbsp;&nbsp;&nbsp;&nbsp;')
                      break;
                    }
                    case '修改':{
                      if(sessionStorage['showAdd']=='false'){
                        break;
                      }
                      var $a=$('<a href=dutyAdd.html id='+currentDuty.dutyid+'></a>')
                      $a.append(def.name);
                      $td.addClass('operate')
                      $a.on('click',updateOpt)
                      $td.append($a).append('&nbsp;&nbsp;&nbsp;&nbsp;')
                      break;
                    }
                    case '删除':{
                      if(sessionStorage['showAdd']=='false'){
                        break;
                      }
                      var $a=$('<a href=dutyAdd.html id='+currentDuty.dutyid+'></a>')
                      $a.append(def.name);
                      $td.addClass('operate')
                      $a.on('click',deleteOpt)
                      $td.append($a).append('&nbsp;&nbsp;&nbsp;&nbsp;')
                      break;
                    }
                    case '复制':{
                      if(sessionStorage['showAdd']=='false'){
                        break;
                      }
                      var $a=$('<a href=dutyAdd.html id='+currentDuty.dutyid+'></a>')
                      $a.append(def.name);
                      $td.addClass('operate')
                      $a.on('click',copyOpt)
                      $td.append($a).append('&nbsp;&nbsp;&nbsp;&nbsp;')
                      break;
                    }
                    case '提交':{
                      if(sessionStorage['showAdd']=='false'){
                        break;
                      }
                      var $a=$('<a href=dutyAdd.html id='+currentDuty.dutyid+'></a>')
                      $a.append(def.name);
                      $td.addClass('operate')
                      $a.on('click',submitOpt)
                      $td.append($a).append('&nbsp;&nbsp;&nbsp;&nbsp;')
                      break;
                    }
                    case '审批':{
                      var $a=$('<a href=dutyAdd.html id='+currentDuty.dutyid+'></a>')
                      $a.append(def.name);
                      $td.addClass('operate')
                      $a.on('click',approvalOpt)
                      $td.append($a)
                    }
                  };
                }
              })()
            };
          }
          $tr.append($td)
        }
        $tbody.append($tr)
      }
      $table.append($tbody)
      var html='';
      if(totalPages==0){
        pageNum=0
      }
      html+='<li><span><b>第 '+pageNum+' 页/共 '+totalPages+' 页</b></span></li>';
      if(pageNum==1||pageNum==0) {
        html += '<li><a href="" style="color:darkgray">首页</a></li> '
      }else{html += '<li><a href=1>首页</a></li> '}
      if(pageNum>1) {
        html += '<li><a href='+(pageNum-1)+'>上一页</a></li> '
      }else{
        html += '<li><a  href="" style="color: darkgray">上一页</a></li> '
      }
      if(pageNum<totalPages){
        html += '<li><a href='+(pageNum+1)+'>下一页</a></li> '
      }else{
        html += '<li><a  href="" style="color: darkgray">下一页</a></li> '
      }
      if(pageNum==totalPages){
        html += '<li><a href="" style="color: darkgray">尾页</a></li> '
      }else{
        html += '<li><a href='+totalPages+'>尾页</a></li> '
      }
      $('#page>ul').html(html)
    },
    error:function(){
      dia.close()
      $.Dialog({
        type:'warning',
        message:'数据请求失败!',
        delay:1500
      })
      console.log('error');
    }
  })
}
$('#search').on('click',function(){
  orgid=$('#ssdd option:selected').val();
  audtistate=$('#pbzt option:selected').val();
  state=$('#spzt option:selected').val();
  orgid=='-1'&&(orgid='');
  audtistate=='-1'&&(audtistate='');
  state=='-1'&&(state='');
  loadByPage($('#table'),baseData.getAddr()+'duty/query4DutyPage.action',orgid,audtistate,state,1)
})
$('#page').on('click','a',function(e){
  e.preventDefault();
  pn=$(this).attr('href');
  if(pn!='') {
    loadByPage($('#table'),baseData.getAddr()+'duty/query4DutyPage.action',orgid,audtistate,state,pn)
  }
})
$('#table').on('click','a',function(){
  sessionStorage['id']=$(this).attr('id');
})
$('#top a').on('click',function(){
  sessionStorage['id']='';
  sessionStorage['option']='添加'
})
function showOpt(){
  console.log('你点击了查看按钮')
  sessionStorage['option']='查看'
}
function updateOpt(e){
  //e.preventDefault();
  sessionStorage['option']='修改'
  console.log('你点击了修改按钮')
}
function deleteOpt(e){
  e.preventDefault();
  trIndex = Util.getTrIndex($(this).parent().parent());
  currentDuty=duty[trIndex-1];
  var deleteDutyId=currentDuty.dutyid;
  console.log(deleteDutyId)
  //var bool=confirm('确认删除排班编号'+currentDuty.dutyid+'吗?')
  $.Dialog({
    message:'确认删除排班编号'+currentDuty.dutyid+'吗?',
    button:[
      {
        type:'red',
        text:'确定',
        cb:function(){
          deleteduty()
        }
      },
      {
        type:'green',
        text:'取消'
      }
    ]
  })
  function deleteduty(){
    console.log('调用了delete')
    $.ajax({
      type:'GET',
      url:baseData.getAddr()+'duty/deleteDuty.action',
      dataType:'jsonp',
      data:{dutyid:deleteDutyId,userId:sessionStorage['userId']},
      success:function(data){
        console.log(data)
        if(data.data[0]!=='error'){
          duty.splice(trIndex-1,1)
          //alert('删除成功,请及时提交.')
          $.Dialog({
            type:'ok',
            message:'删除成功,请及时提交!',
            button:[
              {
                type:'green',
                text:'我知道了'
              }
            ]
          })
          loadByPage($('#table'),baseData.getAddr()+'duty/query4DutyPage.action',orgid,audtistate,state,pn);
        }else{
          $.Dialog({
            message:'删除失败,请重新操作!',
            button:[
              {
                type:'green',
                text:'我知道了'
              }
            ]
          })
        }
      },
      error:function(){
        alert('响应完成,但有问题')
      }
    })
  }
  console.log('你点击了删除按钮')
}
function copyOpt(){
  sessionStorage['option']='复制'
  console.log('你点击了复制按钮')
}
function submitOpt(){
  sessionStorage['option']='提交';
  console.log('你点击了提交按钮')
}
function approvalOpt(){
  sessionStorage['option']='审批'
  console.log('你点击了审批按钮')
}

