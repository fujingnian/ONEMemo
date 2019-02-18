const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const sortBy = (arr, prop, desc) => {
  let props = [],
    ret = [],
    i = 0,
    len = arr.length;
  if (typeof prop == 'string') {
    for (; i < len; i++) {
      let oI = arr[i];
      (props[i] = new String(oI && oI[prop] || ''))._obj = oI;
    }
  }
  if (typeof prop == 'Function') {
    for (; i < len; i++) {
      var oI = arr[i];
      (props[i] = new String(oI && prop(oI) || ''))._obj = oI;
    }
  } else {
    throw '参数类型错误';
  }
  props.sort();
  for (i = 0; i < len; i++) {
    ret[i] = props[i]._obj;
  }
  if (desc) ret.reverse();
  return ret;
}
const formatDate2 =  ()=> {
  var date = new Date();
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var nowYear = (new Date()).getFullYear();
  var nowMonth = (new Date()).getMonth() + 1;


  return year + '-' + month + '-' + day;

  // return [ month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

module.exports = {
  formatTime: formatTime,
  sortBy: sortBy,
  formatDate2: formatDate2,
}