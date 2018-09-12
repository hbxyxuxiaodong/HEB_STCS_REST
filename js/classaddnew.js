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
//DOM加载完成开始渲染table
//定义大队的id
var orgid;
var orgname;
$(function(){
  window.dia=$.Dialog({
    type:'waiting',
    message:'正在拼命加载,请稍后！'
  })
  $('#lblUserId').html(sessionStorage['userName'])
  var opt = sessionStorage['option'];
  renderSelect($('#brigade').get(0),baseData.getAddr()+'duty/getOrgList4User.action?userId='+userid,
    "orgId",
    "orgName",
    defaultSelectResponse4Dict)
  renderTable($('#table'),baseData.getAddr()+'duty/findDutyAll.action')
  renderAuditTable($('#tabsp'))
  if(opt=='复制'){
    $('#brigade').find('option[value=' + orgid + ']').attr('selected', true)
      $('#top ul').css('visibility','visible')
      $('#brigade').attr('disabled','disabled');
      $('#header>.container>#button').css('display','none')
      $('#header #pbwc').addClass('show')
      $('#header #copyDiv').addClass('show')
      //$('#header>.container>button').css('display','none')
      $('#top [type="button"]').on('click',function(){
        var date=$('#date').val();
        if(!date){
          $.Dialog({
            message:'请选择日期',
            button:[{
              type:'green',
              text:'我知道了'
            }]
          })
          return;
        }
        var inputval=$('#date').val();
        //获取当前日期时间
        var currentDate=new Date();
        //获取用户选择的日期
        var choosedate=new Date(inputval)
        //定义用户选择的当前年,月,日
        var cy=choosedate.getFullYear();
        var cm=choosedate.getMonth();
        var cd=choosedate.getDate();
        //定义当前时间的年,月,日
        console.log(cy,cm,cd)
        var year=currentDate.getFullYear();
        var month=currentDate.getMonth();
        var date=currentDate.getDate();
        console.log(year,month,date)
        if(cy<=year&&cm<=month&&cd<date){
          $.Dialog({
            message:'选择日期不能小于当前日期且选择周一对应的日期',
            button:[{
              type:'green',
              text:'我知道了'
            }]
          })
          //alert('选择日期不能小于当前日期且选择周一对应的日期')
          //$('input[type="button"]').prop('disabled',true)
          return;
        }else if(cy<=year&&cm<month){
          //$('input[type="button"]').prop('disabled',true)
          //alert('选择日期不能小于当前日期且选择周一对应的日期')
          $.Dialog({
            message:'选择日期不能小于当前日期且选择周一对应的日期',
            button:[{
              type:'green',
              text:'我知道了'
            }]
          })
          return;
        }else if(cy<year){
          //$('input[type="button"]').prop('disabled',true)
          $.Dialog({
            message:'选择日期不能小于当前日期且选择周一对应的日期',
            button:[{
              type:'green',
              text:'我知道了'
            }]
          })
          //alert('选择日期不能小于当前日期且选择周一对应的日期')
          return;
        }
        var week=getMyDay(new Date(inputval));
        if(week==='周一'){
          //$('input[type="button"]').removeAttr('disabled')
        }else{
          //$('input[type="button"]').prop('disabled',true)
          //alert('请选择周一对应的日期')
          $.Dialog({
            message:'请选择周一对应的日期',
            button:[{
              type:'green',
              text:'我知道了'
            }]
          })
          return ;
        }
        $.ajax({
          type:'GET',
          dataType:'jsonp',
          url:baseData.getAddr()+'duty/checkDuty.action',
          data:{orgid:orgid,startdate:inputval,userId:userid},
          success:function(data){
            console.log(data)
            if(data.data[0]!=='error'){
              $('#top ul').css('visibility','hidden')
              //$('.zclip').css('marginLeft','-134px')
              //$('#header #pbwc').removeClass('show')
              //$('#header #copyDiv').removeClass('show')
              //$('#header>.container>#button').css('display','block')
              sessionStorage['id']=data.data[0].dutyid;
              dutyid=sessionStorage['id']
              startdate=data.data[0].startdate
              var enddate=data.data[0].enddate
              var sm=startdate.substr(5,2)
              var sd=startdate.substr(8,2)
              var em=enddate.substr(5,2)
              var ed=enddate.substr(8,2)
              $('#header h4').html(orgname+sm+'月'+sd+'号-'+em+'月'+ed+'号勤务周报表');
              (function(){
                try{
                  for(var i =0;i<duty.length;i++){
                    currentDutyItem = duty[i];
                    delete currentDutyItem.dutyAtomFromDutyItemResultVo;
                    deldutyAtomList(currentDutyItem.monday)
                    deldutyAtomList(currentDutyItem.tuesday)
                    deldutyAtomList(currentDutyItem.wednesday)
                    deldutyAtomList(currentDutyItem.thursday)
                    deldutyAtomList(currentDutyItem.friday)
                    deldutyAtomList(currentDutyItem.saturday)
                    deldutyAtomList(currentDutyItem.sunday)
                    $.ajax({
                      type:'POST',
                      dataType:'jsonp',
                      url:baseData.getAddr()+'duty/checkDutyAtom.action',//insertDutyAll.action
                      data:{currentDutyItem:currentDutyItem,dutyId:dutyid,userId:sessionStorage['userId']},
                      success:function(data){
                        console.log("添加排班",data);
                      },
                      error:function(){
                        console.log('有问题')
                        throw new Error('复制失败')
                      }
                    })
                  }
                }
                catch(err){
                  console.log(err)
                  alert("操作失败,请删除已复制的排班,并重试");
                  return;
                }
                //$('#brigade').attr('disabled','');

                //alert('复制排班成功,2秒后跳转到大队排班管理页面')
                $.Dialog({
                  type:'ok',
                  width:400,
                  message:'复制排班成功,2秒后跳转到大队排班管理页面',
                  delay:2000
                })
                //sessionStorage['option']='修改'
                setTimeout(function(){location.href='dutyManage.html?userId='+sessionStorage['userId']},2000)
              })();
            }
            else{
              //alert('该排班日期已存在,请重新选择日期')
              $.Dialog({
                message:'该排班日期已存在,请重新选择日期!',
                button:[{
                  type:'green',
                  text:'我知道了'
                }]
              })
            }
          },
          error:function(){
            console.log('有问题')
          }
        })
      })

  }
  //提交
  if(opt=='提交'){
    $('#footer ul li:nth-child(3)').addClass('show').css('marginLeft','0px')
    $('#footer ul li:nth-child(4)').addClass('show')
    renderSelect($('#xjsp').get(0),baseData.getAddr()+'duty/getFirstPersonList.action?userId='+userid,'userId','userName',defaultSelectResponse4Dict)
    $('button:contains(提交)').on('click',function(){
      var xjsp=$('#xjsp option:selected').val();
      if(xjsp=='-1'){
        //alert('请选择下级审批人');
        $.Dialog({
          message:'请选择下级审批人!',
          button:[{
            type:'green',
            text:'我知道了'
          }]
        })
        return
      }
      var dia=$.Dialog({
        type:'waiting',
        message:'正在提交,请稍后！'
      })
      $.ajax({
        type:'GET',
        dataType:'jsonp',
        url:baseData.getAddr()+'duty/processSubmit.action',
        data:{userId:userid,dutyId:dutyid,nextAuditPersonId:xjsp},
        success:function(data){
          var msg=data.data;
          if(msg=='success'){
            //alert('提交成功!2秒后返回大队排班管理页面')
            dia.close();
            $.Dialog({
              type:'ok',
              message:'提交成功!2秒后返回大队排班管理页面!',
              delay:2000
            })
            setTimeout(function(){location.href="dutyManage.html?userId="+sessionStorage['userId']},2000)
          }else{
            dia.close();
            $.Dialog({
              message:'提交失败!请重新提交！',
              button:[{
                type:'green',
                text:'我知道了'
              }]
            })
            //alert('提交失败')
          }
        },
        error:function(){
          console.log('有问题')
        }
      })
    })
  }
  if(opt=='审批'){
    $('#footer ul li:not(:nth-child(4))').addClass('show');
    renderSelect($('#xjsp').get(0),baseData.getAddr()+'duty/getSecondPersonList.action?userId='+userid,'userId','userName',defaultSelectResponse4Dict)
    $('#spyj').on('change',function(){
      var spyj=$('#spyj option:selected').val();
      if(spyj==='0'){
        if($('#xjsp option').size()==2){
          renderSelect($('#xjsp').get(0),baseData.getAddr()+'duty/getSecondPersonList.action?userId='+userid,'userId','userName',defaultSelectResponse4Dict)
        }
      }else if(spyj==='1'){
        renderSelect($('#xjsp').get(0),baseData.getAddr()+'duty/getInitialator.action?userId='+userid+'&dutyId='+dutyid,'userId','userName',defaultSelectResponse4Dict)
      }
    })
    $('button:contains(确定)').on('click',function(){
      var spyj=$('#spyj option:selected').val();
      var xjsp=$('#xjsp option:selected').val();
      var xjspSize=$('#xjsp option').size();
      var content=$('#spnr').val()
      if(spyj==='-1'){
        $.Dialog({
          message:'请选择审批意见！',
          button:[{
            type:'green',
            text:'我知道了'
          }]
        })
        //alert('请选择审批意见')
        return
      }
      if(xjsp==='-1'&&xjspSize>1){
        //alert('请选择下级审批人')
        $.Dialog({
          message:'请选择下级审批人！',
          button:[{
            type:'green',
            text:'我知道了'
          }]
        })
        return
      }
      var dia=$.Dialog({
        type:'waiting',
        message:'正在提交,请稍后！'
      })
      $.ajax({
        type:'GET',
        url:baseData.getAddr()+'duty/audit.action',
        dataType:'jsonp',
        data:{userId:userid,content:content,status:spyj,nextAuditPersonId:xjsp,dutyId:dutyid},
        success:function(data){
          var msg=data.data;
          if(msg=='success'){
            //alert('审批成功!2秒后返回大队排班管理页面')
            dia.close()
            $.Dialog({
              type:'ok',
              message:'审批成功!2秒后返回大队排班管理页面！',
              delay:2000
            })
            setTimeout(function(){location.href="dutyManage.html?userId="+sessionStorage['userId']},2000)
          }else{
            //alert('审批失败')
            dia.close()
            $.Dialog({
              message:'审批失败！',
              button:[{
                type:'green',
                text:'我知道了'
              }]
            })
          }
        },
        error:function(){
          dia.close()
          console.log('有问题')
        }
      })
    })
  }
})
//接收上个页面传过来的dutyId
var dutyid=sessionStorage['id'];
if(dutyid==''){
  //页面头部确定按钮点击后的事件
  //$('#brigade').attr('disabled','')
  $('#top ul').css('visibility','visible')
  $('#header h4').html(sessionStorage['orgName']+'勤务周报表')
  $('#brigade').attr('disabled','disabled');
  if(!duty){
    $('#header>.container>#button').css('display','none')
    $('#header #pbwc').addClass('show')
    $('#header #copyDiv').addClass('show')
    $('#top [type="button"]').on('click',function(){
      var orgId=$('#brigade option:selected').val();
      var date=$('#date').val();
      if(orgId=='-1'&&!date){
        alert('请选择所属大队和日期')
        return;
      }else if(orgId=='-1'){
        alert('请选择所属大队')
        return
      }else if(!date){
        //alert('请选择日期')
        $.Dialog({
          message:'请选择日期',
          button:[{
            type:'green',
            text:'我知道了'
          }]
        })
        return
      }
      var inputval=$('#date').val();
      //获取当前日期时间
      var currentDate=new Date();
      //获取用户选择的日期
      var choosedate=new Date(inputval)
      //定义用户选择的当前年,月,日
      var cy=choosedate.getFullYear();
      var cm=choosedate.getMonth();
      var cd=choosedate.getDate();
      //定义当前时间的年,月,日
      var year=currentDate.getFullYear();
      var month=currentDate.getMonth();
      var date=currentDate.getDate();
      if(cy<=year&&cm<=month&&cd<date){
        //alert('选择日期不能小于当前日期且选择周一对应的日期')
        //$('input[type="button"]').prop('disabled',true)
        $.Dialog({
          message:'选择日期不能小于当前日期且选择周一对应的日期!',
          button:[{
            type:'green',
            text:'我知道了'
          }]
        })
        return;
      }else if(cy<=year&&cm<month){
        //$('input[type="button"]').prop('disabled',true)
        //alert('选择日期不能小于当前日期且选择周一对应的日期')
        $.Dialog({
          message:'选择日期不能小于当前日期且选择周一对应的日期!',
          button:[{
            type:'green',
            text:'我知道了'
          }]
        })
        return;
      }else if(cy<year){
        //$('input[type="button"]').prop('disabled',true)
        //alert('选择日期不能小于当前日期且选择周一对应的日期')
        $.Dialog({
          message:'选择日期不能小于当前日期且选择周一对应的日期!',
          button:[{
            type:'green',
            text:'我知道了'
          }]
        })
        return;
      }
      var week=getMyDay(new Date(inputval));
      if(week==='周一'){
        //$('input[type="button"]').removeAttr('disabled')
      }else{
        //$('input[type="button"]').prop('disabled',true)
        //alert('请选择周一对应的日期')
        $.Dialog({
          message:'请选择周一对应的日期!',
          button:[{
            type:'green',
            text:'我知道了'
          }]
        })
        return ;
      }
      $.ajax({
        type:'GET',
        dataType:'jsonp',
        url:baseData.getAddr()+'duty/checkDuty.action',
        data:{orgid:orgId,startdate:inputval,userId:userid},
        success:function(data){
          console.log(data)
          if(data.data[0]!=='error'){
            //$('#top ul').css('visibility','hidden')
            //$('.zclip').css('left','1480px')
            //$('#header #pbwc').removeClass('show')
            //$('#header #copyDiv').removeClass('show')
            sessionStorage['id']=data.data[0].dutyid;
            //dutyid=sessionStorage['id']
            //console.log(dutyid);
            //duty=data.data[0].dutyItemResultVo;
            //orgid=data.data[0].orgId;
            //orgname=data.data[0].orgname;
            //startdate=data.data[0].startdate
            //var enddate=data.data[0].enddate
            //var sm=startdate.substr(5,2)
            //var sd=startdate.substr(8,2)
            //var em=enddate.substr(5,2)
            //var ed=enddate.substr(8,2)
            //$('#header h4').html(orgname+sm+'月'+sd+'号-'+em+'月'+ed+'号勤务周报表')
            //$('#header>.container>button').css('display','block')
            location.href='dutyAdd.html'
          }else{
            //alert('该排班日期已存在,请重新选择日期')
            $.Dialog({
              message:'该排班日期已存在,请重新选择日期!',
              button:[{
                type:'green',
                text:'我知道了'
              }]
            })
          }
        },
        error:function(){
          console.log('有问题')
        }
      })
    })
  }
}
else{
  $('#top ul').css('visibility','hidden')
}
if(sessionStorage['option']=='查看'||sessionStorage['option']=='提交'||sessionStorage['option']=='审批'||sessionStorage['showAdd']=='false'){
  $('#header>.container>#button').css('display','none')
  $('#header #pbwc').addClass('show')
  $('#header #copyDiv').addClass('show')
}
//用户的id编号
var userid=sessionStorage['userId']
var tableDefinition4DutyAdd=[
  {"key":"org","value":"所属班组","dataTYpe":"simple"},
  {"key":"leader","value":"带队领导","dataTYpe":"simple"},
  {"key":"postType","value":"岗位类别","dataTYpe":"simple"},
  {"key":"post","value":"岗位名称","dataTYpe":"simple"},
  {"key":"interval","value":"时段类别","dataTYpe":"simple"},
  {'key':"monday",'value':'周一',"dataTYpe":"complex"},
  {'key':"tuesday",'value':'周二',"dataTYpe":"complex"},
  {'key':"wednesday",'value':'周三',"dataTYpe":"complex"},
  {'key':"thursday",'value':'周四',"dataTYpe":"complex"},
  {'key':"friday",'value':'周五',"dataTYpe":"complex"},
  {'key':"saturday",'value':'周六',"dataTYpe":"complex"},
  {'key':"sunday",'value':'周日',"dataTYpe":"complex"},
  {"key":"operateList","value":"操作","dataTYpe":"opt"}
];
var tableDefinition4ItemEdit=[
  {'key':"monday",'value':'周一'},
  {'key':"tuesday",'value':'周二'},
  {'key':"wednesday",'value':'周三'},
  {'key':"thursday",'value':'周四'},
  {'key':"friday",'value':'周五'},
  {'key':"saturday",'value':'周六'},
  {'key':"sunday",'value':'周日'},
];
var tableDefinition4Audit=[
  {'key':'auditType','value':'审批类型	'},
  {'key':'state','value':'审批意见'},
  {'key':'content','value':'审批内容'}
];
var duty;//接收所有的duty
var trIndex;
var startdate;
var currentDutyItem;
var currentDutyAtom;
var currentDutyAtomIdArr;
var currentDutyAtomNameArr;
var dutyItemCurrentTdIndex;
var dutyItemCurrentTrIndex;
var dutyItemCurrentOpt;//0 查看  1 修改  2 添加
var editable4DutyItem;//deprecated
var editable4DutyAtom;
var dutyAtomIdArr4Current=[];//当前原子项目的idArr
var dutyAtomNameArr4Current=[];//当前原子项目的nameArr
function renderAuditTable($table){
  //渲染thead的方法
  $table.children().remove();
  (function(){
    var $thead =$("<thead></thead>");
    var $tr = $("<tr></tr>");
    for(var i =0;i<tableDefinition4Audit.length;i++){
      var $th=$("<th></th>")
      $th.append(tableDefinition4Audit[i].value);
      $tr.append($th);
    }
    $thead.append($tr);
    $table.append($thead)
  })();
  //异步请求审批信息
  if(dutyid==''){
    return;
  }
  $.ajax({
    type:'GET',
    url:baseData.getAddr()+'duty/selectAuditList.action',
    data:{userId:userid,dutyId:dutyid},
    dataType:'jsonp',
    success:function(data){
      console.log(data)
      if(data.data[0]!=='error'){
        var auditData=data.data;
        var $tbody=$('<tbody></tbody>');
        for(var i =0;i<auditData.length;i++){
          var  DutyItem4Temp = auditData[i];
          var $tr=$('<tr></tr>');
          for(var j=0;j<tableDefinition4Audit.length;j++){
            //定义数组中的一个对象用def保存;
            var def=tableDefinition4Audit[j]
            var $td=$('<td></td>')
            switch(def.key){
              case 'auditType':
                var module=DutyItem4Temp['module']
                module=='Duty11'?module='添加':module=='Duty12'?module='修改':module='删除'
                $td.append(module+'--'+DutyItem4Temp[def.key])
                break;
              case 'state':
                var state=DutyItem4Temp[def.key];
                state=='0'?$td.append('通过'):$td.append('不通过')
                break;
              case 'content':
                $td.append(DutyItem4Temp[def.key])
                break;
            }
            $tr.append($td)
          }
          $tbody.append($tr)
        }
        $table.append($tbody)
      }else{
        //alert('审批信息查询失败')
        $.Dialog({
          message:'审批信息查询失败!',
          button:[{
            type:'green',
            text:'我知道了'
          }]
        })
      }
  },
    error:function(){
      console.log('error')
    }
  })
}
function renderTable($table,url){
  //渲染thead的方法
  $table.children().remove();
  (function(){
    var $thead =$("<thead></thead>");
    var $tr = $("<tr></tr>");
    for(var i =0;i<tableDefinition4DutyAdd.length;i++){
      var $th=$("<th></th>")
      $th.append(tableDefinition4DutyAdd[i].value);
      $tr.append($th);
    }
    $thead.append($tr);
    $table.append($thead)
  })();
  //渲染tbody的方法

  if(dutyid==''){
    dia.close()
    return;
  }
  $.ajax({
    type:'GET',
    url:url,
    dataType:'jsonp',
    data:{dutyid:dutyid},
    success:function(data){
      console.log(data)
      dia.close()
      duty=data.data[0].dutyItemResultVo;
      orgid=data.data[0].orgId;
      orgname=data.data[0].orgname;
      startdate=data.data[0].startdate
      var enddate=data.data[0].enddate
      var sm=startdate.substr(5,2)
      var sd=startdate.substr(8,2)
      var em=enddate.substr(5,2)
      var ed=enddate.substr(8,2)
      $('#header h4').html(orgname+sm+'月'+sd+'号-'+em+'月'+ed+'号勤务周报表')
      var table =$("#table").get(0);
      renderDuty(table);
      renderSelect($('#brigade').get(0),baseData.getAddr()+'duty/getOrgList4User.action?userId='+userid,
        "orgId",
        "orgName",
        defaultSelectResponse4Dict);
    },
    error:function() {
      dia.close()
      console.log("error")
    }
  });
}
function renderDuty(table){
    $(table).children('tbody').remove();
    var $tbody=$('<tbody></tbody>');
    for(var i =0;i<duty.length;i++){
      var  DutyItem4Temp = duty[i];
      var $tr=$('<tr></tr>');
      for(var j=0;j<tableDefinition4DutyAdd.length;j++){
        //定义数组中的一个对象用def保存;
        var $td=$('<td></td>')
        var def=tableDefinition4DutyAdd[j];
        switch(def.dataTYpe){

          case "simple":{
            if(DutyItem4Temp[def.key]!==null){
              $td.append(DutyItem4Temp[def.key].val);
            }
            break;
          };
          case "complex":{
            $td.addClass('week')
            var weekobj=DutyItem4Temp[def.key];
            (function(){
              var $ul=$('<ul></ul>');
              for(var i=0;i<weekobj.length;i++){
                  for(var j =0;j<weekobj.length;j++) {
                    var def=weekobj[j];
                    if(def.index==i+1){
                    $ul.append('<li>'+def.timeName+':'+def.username+'</li>');
                      break;
                    }
                  }
              }
              $td.append($ul)
            })();
            break;
          };
          case "opt":{
            $td.addClass('operate')
            var optobj=DutyItem4Temp[def.key];
            (function(){
              for(var i=0;i<optobj.length;i++){
                var def=optobj[i];
                switch(def.name){
                  case '查看':{
                    var $a=$('<a>'+def.name+'</a>');
                    $td.append($a).append('&nbsp;&nbsp;');
                    $a.on('click',showOpt);
                    break;
                  }
                  case '修改':{
                    if(sessionStorage['option']=='查看'||sessionStorage['option']=='提交'||sessionStorage['option']=='审批'||sessionStorage['option']=='复制'||sessionStorage['showAdd']=='false'){
                      break;
                    }
                    var $a=$('<a>'+def.name+'</a>');
                    $td.append($a).append('&nbsp;&nbsp;');
                    $a.on('click',updateOpt);
                    break;
                  }
                  case '删除':{
                    if(sessionStorage['option']=='查看'||sessionStorage['option']=='提交'||sessionStorage['option']=='审批'||sessionStorage['option']=='复制'||sessionStorage['showAdd']=='false'){
                      break;
                    }
                    var $a=$('<a>'+def.name+'</a>');
                    $td.append($a);
                    $a.on('click',deleteOpt);
                  }
                }
              }
            })();
          }
        }
        $tr.append($td)
      }
      $tbody.append($tr);
    }
    $(table).append($tbody)
}
function renderDutyAtom(){
  var $dutyAtomIntputs = $("#zzc2 input:not(#unsel)");
    for(var i =0;i<$dutyAtomIntputs.length;i++){
     $($dutyAtomIntputs[i]).prop("checked",false);
      for(var j = 0;j<currentDutyAtomIdArr.length;j++) {
        if($($dutyAtomIntputs[i]).attr("id")==currentDutyAtomIdArr[j]){
          $($dutyAtomIntputs[i]).prop("checked",true);
        }
      }
    }
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
  for(var i=0;i<option.length;i++){
    var def=option[i]
    $(targetSelect).append('<option value='+def[key]+'>'+def[name]+'</option>')
  }
}
function defaultSelectResponse4Dict(data,targetSelect,key,name){
  var option=data.data;
  console.log(option)
  $(targetSelect).append('<option value="-1" selected> 请选择 </option>')
  if(targetSelect==$('#xjsp').get(0)&&option.join('')==''){
      $('#footer ul li:nth-child(3)').removeClass('show')
  }else if(targetSelect==$('#xjsp').get(0)&&option.join('')!==''){
    $('#footer ul li:nth-child(3)').addClass('show')
  }
  for(var i=0;i<option.length;i++){
    var def=option[i]
    $(targetSelect).append('<option value='+def[key]+'>'+def[name]+'</option>')
  }
  $(targetSelect).find('option[value=' + orgid + ']').attr('selected', true)
  if(targetSelect==$('#brigade').get(0)){
    $(targetSelect).find('option:eq(1)').attr("selected",true);
  }
  if(currentDutyItem) {
    $(targetSelect).find('option[value=' + orgid + ']').attr('selected', true)
    $(targetSelect).find('option[value=' + currentDutyItem.org.key + ']').attr('selected', true)
    if (currentDutyItem.leader !== null) {
      $(targetSelect).find('option[value=' + currentDutyItem.leader.key + ']').attr('selected', true)
    }
    $(targetSelect).find('option[value=' + currentDutyItem.postType.key + ']').attr('selected', true)
    $(targetSelect).find('option[value=' + currentDutyItem.post.key + ']').attr('selected', true)
    $(targetSelect).find('option[value=' + currentDutyItem.interval.key + ']').attr('selected', true)
  }
}
function showOpt(){
  $('#zzc').css('display','block');
  trIndex = Util.getTrIndex($(this).parent().parent());
  currentDutyItem= duty[trIndex-1];
  renderSelect($('#ssdd').get(0),baseData.getAddr()+'duty/findOrgList.action',"orgId",
    "orgName",defaultSelectResponse4Dict)
  renderSelect($('#ssbz').get(0),baseData.getAddr()+'duty/getGroupListByOrgId.action?orgId='+orgid,"groupId",
    "groupName",defaultSelectResponse4Dict)
  renderSelect($('#ddld').get(0),baseData.getAddr()+'duty/getGroupListByOrgId.action?orgId='+orgid,"leaderId",
    "leaderName",defaultSelectResponse4Dict)
  renderSelect($('#gwlb').get(0),baseData.getAddr()+'post/getAllPostType.action',"dmz",
    "dmmc",defaultSelectResponse4Dict)
  renderSelect($('#gwmc').get(0),baseData.getAddr()+'duty/getPostList.action?userId='+userid+'&groupId='+currentDutyItem.org.key+'&postType='+currentDutyItem.postType.key,
    'postId','postName',defaultSelectResponse4Dict)
  renderSelect($('#sdlx').get(0),baseData.getAddr()+'timeType/getTimeTypeByPostType.action?postType='+currentDutyItem.postType.key,
    'intervalId','intervalTypeName',defaultSelectResponse4Dict)
//渲染#tablepb的thead
  var table1 = $("#tabpb").get(0);
  renderDutyItem(table1);
  dutyItemCurrentOpt='0';
  if(dutyItemCurrentOpt=='0'){
    $('#zzc button:contains("确定")').css('display','none')
    $('#zzc button:contains("重置")').css('display','none')
    $('#zzc button:contains("提交")').css('display','none')
    $('#zzc td').off('mouseenter').off('mouseleave');
    $('#zzc select').attr('disabled','disabled')
  }
}
function updateOpt(){
  $('#zzc').css('display','block');
  trIndex = Util.getTrIndex($(this).parent().parent());
  var newduty=deepClone(duty);
  currentDutyItem= newduty[trIndex-1];
  renderSelect($('#ssdd').get(0),baseData.getAddr()+'duty/findOrgList.action',"orgId",
    "orgName",defaultSelectResponse4Dict)
  renderSelect($('#ssbz').get(0),baseData.getAddr()+'duty/getGroupListByOrgId.action?orgId='+orgid,"groupId",
    "groupName",defaultSelectResponse4Dict)
  renderSelect($('#ddld').get(0),baseData.getAddr()+'duty/getGroupListByOrgId.action?orgId='+orgid,"leaderId",
    "leaderName",defaultSelectResponse4Dict)
  renderSelect($('#gwlb').get(0),baseData.getAddr()+'post/getAllPostType.action',"dmz",
    "dmmc",defaultSelectResponse4Dict)
  renderSelect($('#gwmc').get(0),baseData.getAddr()+'duty/getPostList.action?userId='+userid+'&groupId='+currentDutyItem.org.key+'&postType='+currentDutyItem.postType.key,
    'postId','postName',defaultSelectResponse4Dict)
  renderSelect($('#sdlx').get(0),baseData.getAddr()+'timeType/getTimeTypeByPostType.action?postType='+currentDutyItem.postType.key,
    'intervalId','intervalTypeName',defaultSelectResponse4Dict)
//渲染#tablepb的thead
  var table1 = $("#tabpb").get(0);
  renderDutyItem(table1);
  dutyItemCurrentOpt='1';
  if(dutyItemCurrentOpt=='1'){
    $('#zzc button:contains("确定")').css('display','block')
    $('#zzc button:contains("重置")').css('display','inline-block')
    $('#zzc button:contains("提交")').css('display','inline-block')
    $("#zzc select").removeAttr('disabled')
    $("#zzc select:not(#sdlx)").prop('disabled',true)
  }
  //动态渲染警员input按钮
  (function(){
    $('#jy ul').children().remove();
    $.ajax({
      type:'GET',
      url:baseData.getAddr()+'duty/getUserListByGroupId.action',
      dataType:'jsonp',
      data:{groupId:currentDutyItem.org.key},
      success:function(data){
        var inputs=data.data;
        for(var i=0;i<inputs.length;i++){
          var input=inputs[i]
          if(i<15){
            $('#jy .one').append(
              '<li><input type=checkbox id='+input.userId+'><label for='+input.userId+'>'+input.userName+'</label></li>'
            )
          }else{
            $('#jy .two').append(
              '<li><input type="checkbox"  id='+input.userId+'><label for='+input.userId+'>'+input.userName+'</label></li>'
             )
          }
        }
      },
      error:function(){
        console.log('有问题')
      }
    })
  })();
  //动态渲染辅警input按钮
  (function(){
    $('#fj ul').children().remove();
    $.ajax({
      type:'GET',
      url:baseData.getAddr()+'duty/getAssistantListByGroupId.action',
      dataType:'jsonp',
      data:{groupId:currentDutyItem.org.key},
      success:function(data){
        var inputs=data.data;
        for(var i=0;i<inputs.length;i++){
          var input=inputs[i]
          if(i<15){
            $('#fj .one').append(
              '<li><input type="checkbox" id='+input.userId+'><label for='+input.userId+'>'+input.userName+'</label></li>'
             )
          }else{
            $('#fj .two').append(
              '<li><input type="checkbox"  id='+input.userId+'><label for='+input.userId+'>'+input.userName+'</label></li>'
             )
          }
        }
      },
      error:function(){
        console.log('youwent')
      }
    })
  })();
  //动态渲染警车input按钮
  (function(){
    $('#car ul').children().remove();
    $.ajax({
      type:'GET',
      url:baseData.getAddr()+'duty/getCarListByGroupId.action',
      dataType:'jsonp',
      data:{groupId:currentDutyItem.org.key},
      success:function(data){
        var inputs=data.data;
        for(var i=0;i<inputs.length;i++){
          var input=inputs[i]
            $('#car .one').append(
              '<li><input type="checkbox" id='+input.carId+'><label for='+input.carId+'>'+input.carId+'</label></li>'
            )
        }
      },
      error:function(){
        console.log('youwent')
      }
    })
  })();
}
function deleteOpt(){
  trIndex = Util.getTrIndex($(this).parent().parent());
  var newduty=deepClone(duty);
  currentDutyItem= newduty[trIndex-1];
  var deleteId=currentDutyItem.itemId;
  //console.log(deleteId)
  //var bool=confirm("确认要删除吗?")
    $.Dialog({
      message:'确认删除吗?',
      button:[
        {
          type:'red',
          text:'确定',
          cb:function(){
            deletedutyitem()
          }
        },
        {
          type:'green',
          text:'取消'
        }
      ]
    })
    function deletedutyitem(){
      $.ajax({
        type:'GET',
        url:baseData.getAddr()+'duty/deleteDutyAll.action',
        data:{itemid:deleteId,userId:sessionStorage['userId']},
        dataType:'jsonp',
        success:function(data){
          console.log(data);
          if(data.data[0]=='success'){
            duty.splice(trIndex-1,1);
            renderDuty($('#table'));
            $.Dialog({
              type:'ok',
              message:'删除成功!请及时提交！',
              delay:1500
            })
          }else{
            //alert('删除失败,请重新操作')
            $.Dialog({
              message:'删除失败,请重新操作！',
              button:[{
                type:'green',
                text:'我知道了'
              }]
            })
          }
        },
        error:function(){
          console.log('有问题')
        }
      })
    }

  //else{
  //  alert('你取消了此操作')
  //}
}
//checkAll为所有岗位选择添加验证
function checkAll(){
  var ssdd =$('#ssdd option:selected').val();
  var ssbz =$('#ssbz option:selected').val();
  var ddld =$('#ddld option:selected').val();
  var gwlb =$('#gwlb option:selected').val();
  var gwmc =$('#gwmc option:selected').val();
  var sdlx =$('#sdlx option:selected').val();
  if(ssdd=='-1'||ssbz=='-1'||ddld=='-1'||gwlb=='-1'||gwmc=='-1'||sdlx=='-1'){
    //alert('请选择所有班组信息')
    $.Dialog({
      message:'请选择所有班组信息!',
      button:[{
        type:'green',
        text:'我知道了'
      }]
    })
    return true;
  }
  return false
}
//为排班完成添加返回上个页面事件
$('#pbwc').on('click',function(){
  location.href="dutyManage.html?userId="+sessionStorage['userId']
})
//为添加排班按钮添加事件
$('#button').on('click',function(){
    dutyItemCurrentOpt='2'
    $('#zzc').css('display',"block")
    $('#tabpb').children().remove();
    currentDutyItem=new DutyItem();
    //var queryString=location.search;
    //var urlarr=queryString.split('=');
    //定义接收到userid
    //userid=urlarr[1];
  //解除所有select的禁用
  $('#zzc button:contains("重置")').css('display','none')
  $('#zzc button:contains("提交")').css('display','none')
  $("#zzc select").removeAttr('disabled')
  //把确定按钮设置为隐藏
  $('#zzc button:contains("确定")').css('display','none');
  //删除所有select的子元素
  $('#zzc select').children().remove();
    renderSelect($('#ssdd').get(0),baseData.getAddr()+'duty/getOrgList4User.action?userId='+userid,
      "orgId","orgName",defaultSelectResponse4Dict)
    $('#ssdd').prop('disabled',true)
    renderSelect($('#ssbz').get(0),baseData.getAddr()+'duty/getGroupListByOrgId.action?orgId='+orgid,
      "groupId","groupName"
      ,defaultSelectResponse4Dict)
    renderSelect($('#gwlb').get(0),baseData.getAddr()+'post/getAllPostType.action',"dmz",
      "dmmc",defaultSelectResponse4Dict)
  //为时段类型添加事件,选中后确定按钮显示
  $('#sdlx').on('change',function(){
    $('#zzc button:contains("确定")').css('display','block');
  })
  $('#ssbz').on('change',function(){
    renderSelect($('#ddld').get(0),baseData.getAddr()+'duty/getLeardIdByGroupId.action?groupId='+$(this).val(),"leaderId",
      "leaderName",defaultSelectResponse4Dict)
    $('#ssbz').prop('disabled',true)
  })
  $('#ddld').on('change',function(){
    $('#ddld').prop('disabled',true)
  })
//为岗位类别按钮添加change事件
  $('#gwlb').on('change',function(){
    //根据所属班组类别请求岗位名称
    renderSelect($('#gwmc').get(0),baseData.getAddr()+'duty/getPostList.action?userId='+userid+'&groupId='+$('#ssbz option:selected').val()+'&postType='+$(this).val()+'&atomdate='+startdate,
      'postId','postName',defaultSelectResponse4Dict)
    //根据岗位类别请求时段类型
    renderSelect($('#sdlx').get(0),baseData.getAddr()+'timeType/getTimeTypeByPostType.action?postType='+$(this).val(),
      'intervalId','intervalTypeName',defaultSelectResponse4Dict)
    $('#gwlb').prop('disabled',true)
  })
  $('#gwmc').on('change',function(){
    $(this).prop('disabled',true)
  })
})
//为zzc确定按钮添加事件,动态渲染tbody
$('#zzc button:contains("确定")').on('click',function(){
  var bool=checkAll();
  if(bool){
    return
  }
  switch(dutyItemCurrentOpt){
    //2添加
    case '2':{
      var postType=$('#sdlx option:selected').val();
      if(postType=='-1'){
        alert('请选择时段类型')
        return
      }
      //所有select禁用
      $('#zzc select').attr('disabled','disabled')
      $('#zzc button:contains("重置")').css('display','inline-block')
      $('#zzc button:contains("提交")').css('display','inline-block')
      //为currenDutyitem赋值
      currentDutyItem.org.key=$('#ssbz option:selected').val();
      currentDutyItem.org.val=$('#ssbz option:selected').html();
      currentDutyItem.leader.key=$('#ddld option:selected').val();
      currentDutyItem.leader.val=$('#ddld option:selected').html();
      currentDutyItem.postType.key=$('#gwlb option:selected').val();
      currentDutyItem.postType.val=$('#gwlb option:selected').html();
      currentDutyItem.post.key=$('#gwmc option:selected').val();
      currentDutyItem.post.val=$('#gwmc option:selected').html();
      currentDutyItem.interval.key=$('#sdlx option:selected').val();
      currentDutyItem.interval.val=$('#sdlx option:selected').html();
      $.ajax({
        type:'GET',
        url:baseData.getAddr()+'timeManage/getTimeListByTimeType.action',
        dataType:'jsonp',
        data:{timeType:postType},
        success:function(data) {
          var sdlxdata = data.data;
          console.log(sdlxdata);
          if(sdlxdata.length === 0){
            $.Dialog({
              type:'warning',
              message:'请先录入时段类型数据！',
              delay:2000
            })
            return
          }
          //为currentDutyItem添加内容
          (function () {
            currentDutyItem.monday=[];
            currentDutyItem.tuesday=[];
            currentDutyItem.wednesday=[];
            currentDutyItem.friday=[];
            currentDutyItem.thursday=[];
            currentDutyItem.saturday=[];
            currentDutyItem.sunday=[];
            for (var i = 0; i < sdlxdata.length; i++) {
              var def = sdlxdata[i];
              (function () {
                var timeObj = {};
                timeObj.index = def.index;
                timeObj.timeName = def.timeName;
                timeObj.timeId = def.timeId;
                timeObj.timeValue = def.timeStart + "-" + def.timeEnd;
                timeObj.username = [];
                timeObj.policeids = [];
                currentDutyItem.monday.push(deepClone(timeObj));
                currentDutyItem.tuesday.push(deepClone(timeObj));
                currentDutyItem.wednesday.push(deepClone(timeObj));
                currentDutyItem.thursday.push(deepClone(timeObj));
                currentDutyItem.friday.push(deepClone(timeObj));
                currentDutyItem.saturday.push(deepClone(timeObj));
                currentDutyItem.sunday.push(deepClone(timeObj));
              })();
            }
          })();
          renderDutyItem($('#tabpb').get(0))
        },
        error:function(){
          console.log('有问题')
        }
      });
      //动态渲染警员input按钮
      (function(){
        $.ajax({
          type:'GET',
          url:baseData.getAddr()+'duty/getUserListByGroupId.action',
          dataType:'jsonp',
          data:{groupId:currentDutyItem.org.key},
          success:function(data){
            $('#jy ul').children().remove();
            var inputs=data.data;
            for(var i=0;i<inputs.length;i++){
              var input=inputs[i]
              if(i<15){
                $('#jy .one').append(
                  '<li><input type=checkbox id='+input.userId+'><label for='+input.userId+'>'+input.userName+'</label></li>'
                )
              }else{
                $('#jy .two').append(
                  '<li><input type="checkbox"  id='+input.userId+'><label for='+input.userId+'>'+input.userName+'</label></li>'
                )
              }
            }
          },
          error:function(){
            $('#jy ul').children().remove();
            console.log('有问题')
          }
        })
      })();
      //动态渲染辅警input按钮
      (function(){
        $.ajax({
          type:'GET',
          url:baseData.getAddr()+'duty/getAssistantListByGroupId.action',
          dataType:'jsonp',
          data:{groupId:currentDutyItem.org.key},
          success:function(data){
            $('#fj ul').children().remove();
            var inputs=data.data;
            for(var i=0;i<inputs.length;i++){
              var input=inputs[i]
              if(i<15){
                $('#fj .one').append(
                  '<li><input type="checkbox" id='+input.userId+'><label for='+input.userId+'>'+input.userName+'</label></li>'
                )
              }else{
                $('#fj .two').append(
                  '<li><input type="checkbox"  id='+input.userId+'><label for='+input.userId+'>'+input.userName+'</label></li>'
                )
              }
            }
          },
          error:function(){
            $('#fj ul').children().remove();
            console.log('youwent')
          }
        })
      })();
      //动态渲染警车input按钮
      (function(){
        $.ajax({
          type:'GET',
          url:baseData.getAddr()+'duty/getCarListByGroupId.action',
          dataType:'jsonp',
          data:{groupId:currentDutyItem.org.key},
          success:function(data){
            $('#car ul').children().remove();
            var inputs=data.data;
            for(var i=0;i<inputs.length;i++){
              var input=inputs[i]
              $('#car .one').append(
                '<li><input type="checkbox" id='+input.carId+'><label for='+input.carId+'>'+input.carId+'</label></li>'
              )
            }
          },
          error:function(){
            $('#car ul').children().remove();
            console.log('youwent')
          }
        })
      })();
      break;
    };
    //1修改
    case '1':{
        currentDutyItem.monday=[];
        currentDutyItem.tuesday=[];
        currentDutyItem.wednesday=[];
        currentDutyItem.thursday=[];
        currentDutyItem.friday=[];
        currentDutyItem.saturday=[];
        currentDutyItem.sunday=[];
      var postType=$('#sdlx option:selected').val();
      if(postType=='-1'){
        alert('请选择时段类型')
        return
      }
      $('#zzc select').attr('disabled','disabled')
      $.ajax({
        type:'GET',
        url:baseData.getAddr()+'timeManage/getTimeListByTimeType.action',
        dataType:'jsonp',
        data:{timeType:postType},
        success:function(data) {
          var sdlxdata = data.data;
          console.log(sdlxdata);
          //为currentDutyItem添加内容
          (function () {
            currentDutyItem.monday=[];
            currentDutyItem.tuesday=[];
            currentDutyItem.wednesday=[];
            currentDutyItem.friday=[];
            currentDutyItem.thursday=[];
            currentDutyItem.saturday=[];
            currentDutyItem.sunday=[];
            for (var i = 0; i < sdlxdata.length; i++) {
              var def = sdlxdata[i];
              (function () {
                var timeObj = {};
                timeObj.index = def.index;
                timeObj.timeName = def.timeName;
                timeObj.timeId = def.timeId;
                timeObj.timeValue = def.timeStart + "-" + def.timeEnd;
                timeObj.username = [];
                timeObj.policeids = [];
                currentDutyItem.monday.push(deepClone(timeObj));
                currentDutyItem.tuesday.push(deepClone(timeObj));
                currentDutyItem.wednesday.push(deepClone(timeObj));
                currentDutyItem.thursday.push(deepClone(timeObj));
                currentDutyItem.friday.push(deepClone(timeObj));
                currentDutyItem.saturday.push(deepClone(timeObj));
                currentDutyItem.sunday.push(deepClone(timeObj));
              })();
            }
          })();
          renderDutyItem($('#tabpb').get(0))
        },
        error:function(){
          console.log('有问题')
        }
      })
      //为currenDutyitem赋值
      currentDutyItem.org.key=$('#ssbz option:selected').val();
      currentDutyItem.org.val=$('#ssbz option:selected').html();
      currentDutyItem.leader.key=$('#ddld option:selected').val();
      currentDutyItem.leader.val=$('#ddld option:selected').html();
      currentDutyItem.postType.key=$('#gwlb option:selected').val();
      currentDutyItem.postType.val=$('#gwlb option:selected').html();
      currentDutyItem.post.key=$('#gwmc option:selected').val();
      currentDutyItem.post.val=$('#gwmc option:selected').html();
      currentDutyItem.interval.key=$('#sdlx option:selected').val();
      currentDutyItem.interval.val=$('#sdlx option:selected').html();
      //动态渲染警员input按钮
      (function(){
        $.ajax({
          type:'GET',
          url:baseData.getAddr()+'duty/getUserListByGroupId.action',
          dataType:'jsonp',
          data:{groupId:currentDutyItem.org.key},
          success:function(data){
            $('#jy ul').children().remove();
            var inputs=data.data;
            for(var i=0;i<inputs.length;i++){
              var input=inputs[i]
              if(i<15){
                $('#jy .one').append(
                  '<li><input type=checkbox id='+input.userId+'><label for='+input.userId+'>'+input.userName+'</label></li>'
                )
              }else{
                $('#jy .two').append(
                  '<li><input type="checkbox"  id='+input.userId+'><label for='+input.userId+'>'+input.userName+'</label></li>'
                )
              }
            }
          },
          error:function(){
            $('#jy ul').children().remove();
            console.log('有问题')
          }
        })
      })();
      //动态渲染辅警input按钮
      (function(){
        $.ajax({
          type:'GET',
          url:baseData.getAddr()+'duty/getAssistantListByGroupId.action',
          dataType:'jsonp',
          data:{groupId:currentDutyItem.org.key},
          success:function(data){
            $('#fj ul').children().remove();
            var inputs=data.data;
            for(var i=0;i<inputs.length;i++){
              var input=inputs[i]
              if(i<15){
                $('#fj .one').append(
                  '<li><input type="checkbox" id='+input.userId+'><label for='+input.userId+'>'+input.userName+'</label></li>'
                )
              }else{
                $('#fj .two').append(
                  '<li><input type="checkbox"  id='+input.userId+'><label for='+input.userId+'>'+input.userName+'</label></li>'
                )
              }
            }
          },
          error:function(){
            $('#fj ul').children().remove();
            console.log('youwent')
          }
        })
      })();
      //动态渲染警车input按钮
      (function(){
        $.ajax({
          type:'GET',
          url:baseData.getAddr()+'duty/getCarListByGroupId.action',
          dataType:'jsonp',
          data:{groupId:currentDutyItem.org.key},
          success:function(data){
            $('#car ul').children().remove();
            var inputs=data.data;
            for(var i=0;i<inputs.length;i++){
              var input=inputs[i]
              $('#car .one').append(
                '<li><input type="checkbox" id='+input.carId+'><label for='+input.carId+'>'+input.carId+'</label></li>'
              )
            }
          },
          error:function(){
            $('#car ul').children().remove();
            console.log('youwent')
          }
        })
      })();
    }
  }
})
$('#zzc .end').on('click',function(){
  $('#zzc').css('display',"none")
})
$('#zzc2 .end').on('click',function(){
  $('#zzc2').css('display',"none")
})
$('#zzc2 .reset').on('click',function(){
  renderDutyAtom()
  //$('#zzc2').css('display',"none")
})
//为全不选按钮添加事件
$('#zzc2 #unsel').on('click',function(){
  if($(this).prop('checked')==true){
    $('input:checked').prop('checked',false);
    $(this).prop('checked',true)
  }
})
$('#zzc2').on('click','input:not(#unsel)',function(){
  console.log('check')
  $('#unsel').prop('checked',false)
})
$('#zzc2 #bot .ok').on('click',function(){
  currentDutyAtomIdArr=[];
  currentDutyAtomNameArr=[];
  var inpchk=$('input:checked:not(#unsel)')
  for(var i=0;i<inpchk.length;i++){
    currentDutyAtomIdArr.push($(inpchk[i]).attr('id'))
    var name = ($(inpchk[i]).next().html());
    currentDutyAtomNameArr.push(name);
  }
  var currentDutyItemKey =  tableDefinition4ItemEdit[dutyItemCurrentTdIndex-1].key;
  var currentList = currentDutyItem[currentDutyItemKey];
  for(var  i = 0;i<currentList.length;i++) {
    if(currentList[i].index==dutyItemCurrentTrIndex){
      currentList[i].policeids=currentDutyAtomIdArr;
      currentList[i].username=currentDutyAtomNameArr;
      break;
    }
  }
  renderDutyItem($("#tabpb").get(0));
  $('#zzc2').css('display',"none")
})
function renderDutyItem(table){
  $(table).children().remove();
  //渲染thead
  (function(){
    var $thead=$('<thead></thead>');
    var $tr=$('<tr></tr>');
    $tr.append($('<th></th>'))
    for(var i=0;i<tableDefinition4ItemEdit.length;i++){
      var $th=$('<th></th>')
      var def=tableDefinition4ItemEdit[i]
      $th.append(def.value)
      $tr.append($th)
    }
    $thead.append($tr)
      $(table).append($thead)
  })();
  //渲染tbody
  (function(){
        //定义一周任意一天的时段类型;
        var sdlx=currentDutyItem[tableDefinition4ItemEdit[0].key];
        //创建tbody
        (function(){
          var $tbody=$('<tbody></tbody>');
          for(var i=0;i<sdlx.length;i++){
            var $tr=$('<tr></tr>');
            for(var j=0;j<=tableDefinition4ItemEdit.length;j++){
              $tr.append($('<td></td>'))
            }
            $tbody.append($tr)
          }
          //为tbody列头赋值;
            $(table).append($tbody)
        })();
        //为tbody列头赋值;
        (function(){
          for(var i=0;i<sdlx.length;i++){
            var def=sdlx[i];
            for(var j=0;j<sdlx.length;j++){
              if(def.index==j+1){
                  $(table).find('tbody tr:nth-child('+(j+1)+') td:first-child').append(def.timeName);
                break;
              }
            }
          }
        })();
        //添加内容
        (function(){
          //1.拿到所有需要填写的td
          var $tds=$('#tabpb tbody td:not(:first-child)');
          //2.便历所有的td,保存对应的td坐标
          for(var i=0;i<$tds.length;i++){
            var $td=$($tds[i]);
            var currentTdIndex=Util.getTdIndex($($tds[i]));
            var currentTrIndex=Util.getTrIndex($($tds[i]).parent());
            (function(){
              var currentTdKey=tableDefinition4ItemEdit[currentTdIndex-1].key;
              var currentDayArr=currentDutyItem[currentTdKey];
              for(var i=0;i<currentDayArr.length;i++){
                var currentDay=currentDayArr[i];
                if(currentDay.index==currentTrIndex){
                  $td.append(currentDay.username.join(','))
                }
              }
            })();
          }
        })();
  })();
  //打开了dutyItem   进行遍历
  $('#tabpb tbody td:not(:first-child)').hover(
      function(){
        var $addBtn=$("<button class='add'>修改</button>");
        $(this).append($addBtn);
        $(this).find('button').css('display','inline-block');
        $('#zzc tbody td button.add').on('click',function(){
          $('#zzc2').css('display',"block");
          $('#zzc2 #unsel').prop('checked',false)
          $('#zzc2 h2').html(currentDutyItem.org.val+'班组资源')
          var $dutyItemCurrentTd = $(this).parent();
          dutyItemCurrentTdIndex = Util.getTdIndex($dutyItemCurrentTd);
          dutyItemCurrentTrIndex = Util.getTrIndex($dutyItemCurrentTd.parent());
          var currentDutyItemKey =  tableDefinition4ItemEdit[dutyItemCurrentTdIndex-1].key;
          var currentAtomArr =currentDutyItem[currentDutyItemKey];
          currentDutyAtomIdArr=null;
          currentDutyAtomNameArr=null;
          (function() {
            for(var i =0;i<currentAtomArr.length;i++){
              var tempDutyAtom = currentAtomArr[i];
              if(tempDutyAtom.index==dutyItemCurrentTrIndex) {
                currentDutyAtomIdArr=tempDutyAtom.policeids;
                currentDutyAtomNameArr = tempDutyAtom.username;
                break;
              }
            }
          })();
          renderDutyAtom();
        })
      },
      function(){$(this).children().remove()}
  )
}
function deldutyAtomList(arr){
  for(var j=0;j<arr.length;j++){
    delete arr[j].dutyAtomList
  }
}
$('#zzc button:contains("提交")').on('click',function(){
  var tds=$('#tabpb tbody td:not(:first-child)')
  for(var i=0;i<tds.length;i++){
    var currentTd=tds[i];
    if($(currentTd).html()==''){
      //alert('请把表格内容填满')
      $.Dialog({
        message:'请把表格内容填满!',
        button:[{
          type:'green',
          text:'我知道了'
        }]
      })
      return;
    }
  }
  delete currentDutyItem.dutyAtomFromDutyItemResultVo;
  deldutyAtomList(currentDutyItem.monday)
  deldutyAtomList(currentDutyItem.tuesday)
  deldutyAtomList(currentDutyItem.wednesday)
  deldutyAtomList(currentDutyItem.thursday)
  deldutyAtomList(currentDutyItem.friday)
  deldutyAtomList(currentDutyItem.saturday)
  deldutyAtomList(currentDutyItem.sunday);;
  //console.log((currentTd).html())
  var dia=$.Dialog({
    type:'waiting',
    message:'正在提交,请稍后！'
  })
  switch(dutyItemCurrentOpt){
      //添加
      case '2':{
        $.ajax({
          type:'POST',
          dataType:'jsonp',
          url:baseData.getAddr()+'duty/checkDutyAtom.action',//insertDutyAll.action
          data:{currentDutyItem:currentDutyItem,dutyId:dutyid,userId:sessionStorage['userId']},
          success:function(data){
            console.log(data)
            if(data.data[0]==='success'){
              currentDutyItem.itemId=data.data[1];
              duty.push(deepClone(currentDutyItem))
              dia.close()
              //alert('保存数据成功')
              $.Dialog({
                type:'ok',
                message:'添加成功,请及时提交!',
                delay:1500
              })
              $('#zzc').css('display',"none")
              renderDuty($('#table'))
            }else{
              var msg=data.data;
              msg=msg.join('\n')
              dia.close()
              $.Dialog({
                width:380,
                message:msg,
                //delay:1000
                button:[{
                  type:'green',
                  text:'我知道了'
                }]
              })
              //alert(msg)
            }
          },
          error:function(){
            dia.close()
            console.log('有问题')
          }
        })
        break;
      };
      //修改
      case '1':{
        var postType=$('#sdlx option:selected').val();
        if(postType=='-1'){
          //alert('请选择时段类型')
          $.Dialog({
            message:'请选择时段类型!',
            delay:1000
          })
          return
        }
        console.log($('#tabpb').children('tbody'))
        $.ajax({
          type:'POST',
          dataType:'jsonp',
          url:baseData.getAddr()+'duty/updateDutyAll.action',
          data:{currentDutyItem:currentDutyItem,startdate:startdate,userId:sessionStorage['userId']},
          success:function(data){
            if(data.data[0]==='success'){
              duty[trIndex-1]=deepClone(currentDutyItem)
              //alert('保存数据成功')
              dia.close()
              $.Dialog({
                type:'ok',
                message:'修改成功,请及时提交!',
                delay:1500
              })
              $('#zzc').css('display',"none")
              renderDuty($('#table'))
            }else{
              var msg=data.data;
              msg=msg.join('\n')
              dia.close()
              $.Dialog({
                width:380,
                message:msg,
                //delay:1000
                button:[{
                  type:'green',
                  text:'我知道了'
                }]
              })
            }
          },
          error:function(){
            dia.close()
            console.log('有问题')
          }
        })
      }
    }
})
//为zzc重置按钮添加事件
$('#zzc button:contains("重置")').on('click',function(){
  switch(dutyItemCurrentOpt){
      //添加
      case '2':{
      (function () {
        resetDutyAtom(currentDutyItem.monday);
        resetDutyAtom(currentDutyItem.tuesday);
        resetDutyAtom(currentDutyItem.wednesday);
        resetDutyAtom(currentDutyItem.thursday);
        resetDutyAtom(currentDutyItem.friday);
        resetDutyAtom(currentDutyItem.saturday);
        resetDutyAtom(currentDutyItem.sunday);
        function resetDutyAtom(arr) {
          for(var i=0;i<arr.length;i++) {
            arr[i].username=[];
            arr[i].policeids=[];
          }
        }
      })();
        var table1 = $("#tabpb").get(0);
        renderDutyItem(table1);
        break;
      };
      //修改
      case '1':{
        currentDutyItem=deepClone(duty[trIndex-1]);
        var table1 = $("#tabpb").get(0);
        renderDutyItem(table1);
        $('#sdlx').find('option[value=' + currentDutyItem.interval.key + ']').attr('selected', true).end().removeAttr('disabled')
        break;
      };
  }
});
//定义克隆一个新duty
function deepClone(obj){
  var o,i,j,k;
  if(typeof(obj)!="object" || obj===null)return obj;
  if(obj instanceof(Array))
  {
    o=[];
    i=0;j=obj.length;
    for(;i<j;i++)
    {
      if(typeof(obj[i])=="object" && obj[i]!=null)
      {
        o[i]=arguments.callee(obj[i]);
      }
      else
      {
        o[i]=obj[i];
      }
    }
  }
  else
  {
    o={};
    for(i in obj)
    {
      if(typeof(obj[i])=="object" && obj[i]!=null)
      {
        o[i]=arguments.callee(obj[i]);
      }
      else
      {
        o[i]=obj[i];
      }
    }
  }
  return o;
}
function DutyItem(){
      this.itemId={},
      this.friday=[],
      this.interval={"dataType":"simple"},
      this.leader={"dataType":"simple"},
      this.monday=[],
      this.operateList=[{dataType:"",editAble:"",key:"",name: "查看",url:"",val:""},{dataType:"",editAble:"",key:"",name: "修改",url:"",val:""},{dataType:"",editAble:"",key:"",name: "删除",url:"",val:""}],
      this.org={"dataType":"simple"},
      this.post={"dataType":"simple"},
      this.postType={"dataType":"simple"},
      this.saturday=[],
      this.sunday=[],
      this.thursday=[],
      this.tuesday=[],
      this.wednesday=[]
}
/*$('#date.datainp').on('change',function(){
  console.log('dsvfjhdsvhjovdnjovfd')
  var inputval=$('#date').val();
  //获取当前日期时间
  var currentDate=new Date();
  //获取用户选择的日期
  var choosedate=new Date(inputval)
  //定义用户选择的当前年,月,日
  var cy=choosedate.getFullYear();
  var cm=choosedate.getMonth();
  var cd=choosedate.getDate();
  //定义当前时间的年,月,日
  console.log(cy,cm,cd)
  var year=currentDate.getFullYear();
  var month=currentDate.getMonth();
  var date=currentDate.getDate();
  console.log(year,month,date)
   if(cy<=year&&cm<=month&&cd<date){
     alert('选择日期不能小于当前日期且选择周一对应的日期')
     $('input[type="button"]').prop('disabled',true)
     return;
   }else if(cy<=year&&cm<month){
     $('input[type="button"]').prop('disabled',true)
     alert('选择日期不能小于当前日期且选择周一对应的日期')
     return;
   }else if(cy<year){
     $('input[type="button"]').prop('disabled',true)
     alert('选择日期不能小于当前日期且选择周一对应的日期')
     return;
   }
  var week=getMyDay(new Date(inputval));
  if(week==='周一'){
    $('input[type="button"]').removeAttr('disabled')
  }else{
    $('input[type="button"]').prop('disabled',true)
    alert('请选择周一对应的日期')
  }
})
*/
function getMyDay(date){
  var week;
  if(date.getDay()==0) week="周日"
  if(date.getDay()==1) week="周一"
  if(date.getDay()==2) week="周二"
  if(date.getDay()==3) week="周三"
  if(date.getDay()==4) week="周四"
  if(date.getDay()==5) week="周五"
  if(date.getDay()==6) week="周六"
  return week;
}

