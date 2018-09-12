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
var tableDefinition4DutyAdd=[
  {"key":"orgname","value":"大队"},
  {"key":"groupname","value":"中队"},
  {"key":"userid","value":"警员编号"},
  {"key":"username","value":"警员姓名"},
  {"key":"eventTypeName","value":"统计类别  "},
  {"key":["sumTime","num"],"value":"统计结果"}
]
$(function(){
  renderSelect($('#dutyTypeId').get(0),baseData.getAddr()+'dutyCheck/queryType4Select.action','khlbid','khlbname',defaultSelectResponse4Dict)
  renderYear($('#year').get(0))
  renderMonth($('#month').get(0))
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
  $(targetSelect).append('<option value="-1"> 请选择 </option>')
  for(var i=0;i<option.length;i++){
    var def=option[i]
    $(targetSelect).append('<option value='+def[key]+'>'+def[name]+'</option>')
  }
}
function renderYear(targetSelect){
  $(targetSelect).children().remove()
  var nowdate=new Date();
  var year=nowdate.getFullYear();
  var lastyear=year-1;
  var preventyear=lastyear-1;
  var data=[year,lastyear,preventyear];
  for(var i=0;i<data.length;i++){
    $(targetSelect).append('<option value='+data[i]+'>'+data[i]+'</option>')
  }
  $(targetSelect).find('option[value='+year+']').attr('selected','true')
}
function renderMonth(targetSelect){
  var month=['01','02','03','04','05','06','07','08','09','10','11','12'];
  month.forEach(function(val){
    $(targetSelect).append('<option value='+val+'>'+val+'</option>')
  })
  $(targetSelect).find('option[value='+month[0]+']').prop('selected',true)
}
//为统计按钮添加事件
$('button:contains("统计")').on('click',function(){
  var dutyTypeId=$('#dutyTypeId option:selected').val();
  var statiCate=$('#tjlb option:selected').val();
  var year=$('#year option:selected').val();
  var month=$('#month option:selected').val();
  if(dutyTypeId=='-1'||statiCate=='-1'){
    //alert('请选择勤务类别和统计类别');
    $.Dialog({
      message:'请选择勤务类别和统计类别！',
      button:[{
        type:'green',
        text:'我知道了'
      }]
    })
    return;
  }
  //渲染图表的ajax
  $.ajax({
    type:'GET',
    url:baseData.getAddr()+'dutyCheck/getDutyCheckResultByEventType.action',
    dataType:'jsonp',
    data:{eventType:dutyTypeId,countType:statiCate,year:year,month:month},
    success:function(data){
      var list=data.data;
      //点击统计按钮后,删除两个图表的dom
      $('#brigade').children().remove();
      $('#lochus').children().remove();
      console.log(list)
      if(statiCate=='0'){
        var text='时长 / 小时';
        for(var i=0,data=[],categories=[];i<list.length;i++){
          categories.push(list[i].orgname);
          data.push({y:list[i].sumTime,color:rancol()});

        }
      }else{
        var text='次数 / 人次';
        for(var i=0,data=[],categories=[];i<list.length;i++){
          categories.push(list[i].orgname);
          data.push({y:list[i].num,color:rancol()});
        }
      }
      //把data数据转为数字类型的
      data.forEach(function(val,i,arr){
        arr[i].y=parseInt(arr[i].y)
      })
      console.log(data)
      var chart = new Highcharts.Chart({
        chart: {
          renderTo: 'brigade',
          type: 'column',
          backgroundColor:'#333'
        },
        title : {
          text: '全部大队',
          style: {
            font: ' 22px microsoft yahei',
            color:'#fafafa'
          }
        },
        xAxis: {
          categories: categories,
          labels:{
            style: {
              font: ' 16px microsoft yahei',
              color:'#fafafa'
            }
          }
        },
        yAxis : {
          min: 0,
          title: {
            text: text,
            style: {
              font: ' 16px microsoft yahei',
              color:'#fafafa'
            }
          },
          labels:{
            style: {
              font: ' 16px microsoft yahei',
              color:'#fafafa'
            }
          },
          gridLineColor:'#555'
        },
        plotOptions: {
          column:{
            pointWidth:30
          },
          series: {
            cursor: 'pointer',
            events: {
              click: function(e) {
                //渲染图标的ajax
                $.ajax({
                  type:'GET',
                  url:baseData.getAddr()+'dutyCheck/getCheckGroupResultByEventType.action',
                  dataType:'jsonp',
                  data:{eventType:dutyTypeId,countType:statiCate,year:year,month:month,orgname:e.point.category},
                  success:function(data){
                    $('#lochus').children().remove()
                    var list=data.data;
                    console.log(list)
                    if(statiCate=='0'){
                      for(var i=0,data=[],categories=[];i<list.length;i++){
                        categories.push(list[i].groupname);
                        data.push({y:list[i].sumTime,color:rancol()});
                      }
                    }else{
                      for(var i=0,data=[],categories=[];i<list.length;i++){
                        categories.push(list[i].groupname);
                        data.push({y:list[i].num,color:rancol()});
                      }
                    }
                    //把data数据转为数字类型的
                    data.forEach(function(val,i,arr){
                      arr[i].y=parseInt(arr[i].y)
                    })
                    var chart = new Highcharts.Chart({
                      chart: {
                        renderTo: 'lochus',
                        type: 'column',
                        backgroundColor:'#333'
                      },
                      title : {
                        text: e.point.category+'各中队',
                        style: {
                          font: ' 22px microsoft yahei',
                          color:'#fafafa'
                        }
                      },
                      xAxis: {
                        categories: categories,
                        labels:{
                          style: {
                            font: ' 16px microsoft yahei',
                            color:'#fafafa'
                          }
                        }
                      },
                      yAxis : {
                        min: 0,
                        title: {
                          text: text,
                          style: {
                            font: ' 16px microsoft yahei',
                            color:'#fafafa'
                          }
                        },
                        labels:{
                          style: {
                            font: ' 16px microsoft yahei',
                            color:'#fafafa'
                          }
                        },
                        gridLineColor:'#555'
                      },
                      plotOptions: {
                        column:{
                          pointWidth:30
                        }
                      },
                      series: [{
                        name:'<b style="color:#fafafa;font-size: 16px">中队</b>',
                        data: data,
                        color:rancol()
                      }],
                      credits: {
                        enabled:false
                      }
                    });
                  },
                  error:function(){
                    $('#lochus').children().remove();
                    console.log('有问题')
                  }
                })
                //渲染表格的ajax
                $.ajax({
                  type:'GET',
                  url:baseData.getAddr()+'dutyCheck/queryTableData.action',
                  dataType:'jsonp',
                  data:{eventType:dutyTypeId,countType:statiCate,year:year,month:month,orgname:e.point.category},
                  success:function(data){
                    console.log(data)
                    var tabledata=data.data;
                    renderTable($('#table').get(0),tabledata,statiCate)
                  },
                  error:function(){
                    console.log('有问题')
                  }
                })
              }
            }
          }
        },
        series: [{
          name:'<b style="color:#fafafa;font-size: 16px">大队</b>',
          data: data,
          color:rancol()
        }],
        credits: {
          enabled:false
        }
      });
    },
    error:function(){
      $('#brigade').children().remove();
      $('#lochus').children().remove();
      console.log('有问题')
    }
  })
  //渲染表格的ajax
  $.ajax({
    type:'GET',
    url:baseData.getAddr()+'dutyCheck/queryTableData.action',
    dataType:'jsonp',
    data:{eventType:dutyTypeId,countType:statiCate,year:year,month:month},
    success:function(data){
      console.log(data)
      var tabledata=data.data;
      renderTable($('#table').get(0),tabledata,statiCate)
    },
    error:function(){
      console.log('有问题')
    }
  })
})
function renderTable(table,tabledata,statiCate){
  $(table).children().remove();
  var $caption=$('<caption>详情</caption>')
  $(table).append($caption)
  var $thead=$('<thead></thead>');
  var $tr=$('<tr></tr>');
  for(var i=0;i<tableDefinition4DutyAdd.length;i++){
    var def=tableDefinition4DutyAdd[i];
    var $th=$('<th></th>');
    $th.append(def.value)
    $tr.append($th)
  }
  $thead.append($tr);
  $(table).append($thead);
  //渲染tbody
  (function(){
    var $tbody=$('<tbody></tbody>')
    for(var i=0;i<tabledata.length;i++){
      var currenttabledata=tabledata[i]
      var $tr=$('<tr></tr>');
      for(var j=0;j<tableDefinition4DutyAdd.length;j++){
        var $td=$('<td></td>');
        var def=deepClone(tableDefinition4DutyAdd[j]);
        var tempDefKey;
        if(def.key.constructor ==Array) {
          //var indexTemp= parseInt(statiCate);
          //def.key[indexTemp]
          def.key=def.key[statiCate];
          //tempDefKey = def.key[statiCate];
        }
        // else {
        //  tempDefKey = def.key;
        //}
        switch(def.key){
          case 'orgname':
            $td.append(currenttabledata[def.key])
            break;
          case 'groupname':
            $td.append(currenttabledata[def.key])
            break;
          case 'userid':
            $td.append(currenttabledata[def.key])
            break;
          case 'username':
            $td.append(currenttabledata[def.key])
            break;
          case 'eventTypeName':
            if(statiCate=='0'){
              $td.append(currenttabledata[def.key]+'/小时')
            }else{
              $td.append(currenttabledata[def.key]+'/次')
            }
            break;
          case 'sumTime':
            $td.append(currenttabledata[def.key])
            break;
          case 'num':
            $td.append(currenttabledata[def.key])
            break;
        }
        $tr.append($td)
      }
      $tbody.append($tr)
    }
    $(table).append($tbody)
  })();
}
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
function rancol(){
  var r=Math.floor(Math.random()*256)
  var g=Math.floor(Math.random()*256)
  var b=Math.floor(Math.random()*256)
  return 'rgba('+r+','+g+','+b+','+0.8+')'
}