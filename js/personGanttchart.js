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
var orgId='';
var dutyTypeId='';
var policeId='';
var dutyDate='';
var pageNum=1;
//设置日期格式
jeDate({
  dateCell:"#date",
  format:"YYYY-MM-DD",
  isinitVal:true,
//  isTime:true, //isClear:false,
//  minDate:"2014-09-19 00:00:00",
  isClear:false,
  skinCell:"jedate red"
})
$(function(){
  //设置日期
  //var nowDate =new Date();
  //nowDate= nowDate.toCNstring();
  //dutyDate=nowDate;
  //$('#date').val(nowDate)
  dutyDate=$('#date').val()
  renderSelect($('#brigade'),baseData.getAddr()+'abscentHistory/getOrgList.action','orgId','orgName',defaultSelectResponse4Dict)
  renderSelect($('#qwlb'),baseData.getAddr()+'abscentHistory/getDutyDmmc.action','dmz','dmmc',defaultSelectResponse4Dict)
  renderTable($('#table'),baseData.getAddr()+'abscentHistory/getGantPageList.action')
  var queryString=location.search;
  var qsArr=queryString.split('=');
  var userId=qsArr[1];
  $.ajax({
    type:'GET',
    url:baseData.getAddr()+'duty/getUserName.action',
    dataType:'jsonp',
    data:{userId:userId},
    success:function(data){
      if(data.data[0]!=='error'){
        $('#lblUserId').html(data.data[0])
      }else{
        //alert('用户姓名请求失败')
        //$.Dialog({
        //  message:'用户姓名请求失败!',
        //  1000
        //})
        $.Dialog({
          message:'用户姓名请求失败！',
          delay:1500
        })
      }
    },
    error:function(){
      console.log('error')
    }
  })
})
var tableDefinition4pgc=[
  {key:'orgName',value:'所属大队'},
  {key:'groupName',value:'所属中队'},
  {key:'policeId',value:'警员编号'},
  {key:'policeName',value:'警员姓名'},
  {key:'dutyList',value:'时间图'}
]
function renderTable($table,url){
  //渲染thead
  $table.children().remove();
  (function(){
    var $thead=$('<thead></thead>');
    var $tr=$('<tr></tr>');
    for(var i=0;i<tableDefinition4pgc.length;i++){
      var def=tableDefinition4pgc[i]
      var $th=$('<th></th>');
      $th.append(def.value)
      $tr.append($th);
    }
    $thead.append($tr);
    $table.append($thead)
  })();
  //渲染tbody
  loadByPage($table,url,orgId,dutyTypeId,policeId,dutyDate,pageNum)
}
//动态为em添加样式
function checkduty($em,i){
  $em.addClass("dutyCheckType_"+i);
}
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
      $(targetSelect).children().remove();
      console.log('error')
    }
  })
}
function defaultSelectResponse(data,targetSelect,key,name){
  var option=data.data;
  $(targetSelect).append('<option value="-1">  请选择 </option>')
  for(var i=0;i<option.length;i++){
    var def=option[i]
    $(targetSelect).append('<option value='+def[key]+'>'+def[name]+'</option>')
  }
}
function defaultSelectResponse4Dict(data,targetSelect,key,name){
  var option=data.data;
  $(targetSelect).append('<option value="-1">  请选择 </option>')
  for(var i=0;i<option.length;i++){
    var def=option[i]
    $(targetSelect).append('<option value='+def[key]+'>'+def[name]+'</option>')
  }
}
function loadByPage($table,url,orgId,dutyTypeId,policeId,dutyDate,pageNum){
  $table.children('tbody').remove()
  $('#page>ul').children().remove()
  $.ajax({
    type:'GET',
    url:url,
    dataType:'jsonp',
    data:{orgid:orgId,eventType:dutyTypeId,userid:policeId,dutyDate:dutyDate,pageNo:pageNum,pageSize:15},
    success:function(data){
      console.log(data)
      duty=data.pageResult.entityList;
      var pageNum=data.pageResult.pageNo;
      var totalPages=data.pageResult.totalPages
      var $tbody=$('<tbody></tbody>');
      for(var i=0;i<duty.length;i++){
        var $tr=$('<tr></tr>');
        var currentDuty=duty[i]
        for(var j=0;j<tableDefinition4pgc.length;j++){
          var def=tableDefinition4pgc[j];
          var $td=$('<td></td>');
          switch(def.key){
            case 'orgName':
              $td.append(currentDuty[def.key]);
              break;
            case 'groupName':
              $td.append(currentDuty[def.key]);
              break;
            case 'policeId':
              $td.append(currentDuty[def.key]);
              break;
            case 'policeName':
              $td.append(currentDuty[def.key]);
              break;
            case 'dutyList':
              $td.addClass('sjt');
              (function(){
                var dutylist=currentDuty[def.key];
                for(var i=0;i<dutylist.length;i++){
                  var currentDutylist=dutylist[i];
                  var $em=$('<em></em>')
                  var dutyTypeId=currentDutylist.dutyTypeId;
                  var starttime=currentDutylist.startTime;
                  var dutyTypeName=currentDutylist.dutyTypeName;
                  var sh=starttime.substr(0,2)
                  var sm=starttime.substr(3,2)
                  var endtime=currentDutylist.endTime;
                  var eh=endtime.substr(0,2)
                  eh=='00'&&(eh='24')
                  var em=endtime.substr(3,2)
                  //总计的分钟
                  var totalm=(eh-sh)*60+(em-sm)
                  //总计的长度
                  var totall=parseInt(totalm/1440*720)
                  $em.addClass('left')
                  var msg=starttime+'-'+endtime+' '+dutyTypeName
                  $em.attr('title',msg)
                  checkduty($em,dutyTypeId)
                  $em.css('width',totall)
                  $em.css('height','15')
                  $td.append($em)
                }
              })();
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
      console.log('error');
    }
  })
}
//为分页的a标记添加点击事件
$('#page').on('click','a',function(e){
  e.preventDefault();
  pageNum=$(this).attr('href');
  if(pageNum!=''){
    loadByPage($('#table'),baseData.getAddr()+'abscentHistory/getGantPageList.action',orgId,dutyTypeId,policeId,dutyDate,pageNum)
  }
})
$('button:contains("查询")').on('click',function(){
  console.log('查询按钮被点击')
  orgId=$('#brigade option:selected').val();
  dutyTypeId=$('#qwlb option:selected').val();
  policeId=$('#policeId').val();
  dutyDate=$('#date').val();
  orgId=='-1'&&(orgId='')
  dutyTypeId=='-1'&&(dutyTypeId='')
  loadByPage($('#table'),baseData.getAddr()+'abscentHistory/getGantPageList.action',orgId,dutyTypeId,policeId,dutyDate,1)
})
Date.prototype.toCNstring=function(){
  if(this.getMonth()<9&&this.getDate()<10) {
    return this.getFullYear() + '-' + '0' + (this.getMonth() + 1) + '-' + '0'+this.getDate()
  }else if(this.getMonth()<9){
    return this.getFullYear() + '-' + '0' + (this.getMonth() + 1) + '-' +this.getDate()
  }else if(this.getDate()<10){
    return this.getFullYear() + '-'  + (this.getMonth() + 1) + '-' + '0' +this.getDate()
  }
  return this.getFullYear()+'-'+(this.getMonth()+1)+'-'+this.getDate()
}