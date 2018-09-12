var Util={
  getTdIndex:function($td){
    var $tr = $td.parent();
    var $tdArr = $tr.children();
    for(var i=0;i<$tdArr.length;i++){
      if($td.get(0)===$tdArr[i]){
        return i;
      }
    }
  },
  getTrIndex:function($tr){
      var $tbody = $tr.parent();
      var $trArr=$tbody.children();
      for(var j=0;j<$trArr.length;j++){
        if($tr.get(0)===$trArr[j])
        return j+1;
      }
  }
}
