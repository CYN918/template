// author：cyn
// 全局定义
export default {
	PHP_API:'http://test.qlylian.com/m',
	DOMAIN:'https://api.hxbschool.com:8088/v1/',
  imgCut (canvas, context, img, file, callback) {
    img.onload = function () {
      // 图片原始尺寸
      var originWidth = this.width;
      var originHeight = this.height;
      // 最大尺寸限制
      var maxWidth = 750,
        maxHeight = 1334;
      // 目标尺寸
      var targetWidth = originWidth;
      var targetHeight = originHeight;
      // 图片尺寸超过iphone6的限制
      if (originWidth > maxWidth || originHeight > maxHeight) {
        if (originWidth / originHeight > maxWidth / maxHeight) {
          // 更宽，按照宽度限定尺寸
          targetWidth = maxWidth;
          targetHeight = Math.round(maxWidth * (originHeight / originWidth));
        } else {
          targetHeight = maxHeight;
          targetWidth = Math.round(maxHeight * (originWidth / originHeight));
        };
      };
      // canvas对图片进行缩放
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      // 清除画布
      context.clearRect(0, 0, targetWidth, targetHeight);
      // 图片压缩
      context.drawImage(img, 0, 0, targetWidth, targetHeight);
      // iphone6兼容toBlob
      if (!HTMLCanvasElement.prototype.toBlob) {
        Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
          value: function (callback, type, quality) {
            var binStr = atob(this.toDataURL(type, quality).split(',')[1]);
            var len = binStr.length;
            var arr = new Uint8Array(len);
            for (var i = 0; i < len; i++) {
              arr[i] = binStr.charCodeAt(i);
            }
            callback(new Blob([arr], {
              type: type || 'image/png'
            }));
          }
        });
      }

      canvas.toBlob(function (blob) {
        var extName = Date.parse(new Date()) + file.name.substring(file.name.lastIndexOf('.'), file.name.length);
        callback(blob, extName, img);
      }, file.type || 'image/png');
    };
  },
  getScrollTop () {
    var scrollTop = 0;
    if (document.documentElement && document.documentElement.scrollTop) {
      scrollTop = document.documentElement.scrollTop;
    } else if (document.body) {
      scrollTop = document.body.scrollTop;
    }
    return scrollTop;
  },
  getClientHeight () {
    var clientHeight = 0;
    if (document.body.clientHeight && document.documentElement.clientHeight) {
      clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight);
    } else {
      clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
    }
    return clientHeight;
  },
  getScrollHeight () {
    return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
  },
  Setcookie (name, value, time) { /* 存入cookie值 */
    // 设置名称为name,值为value的Cookie
    var expdate = new Date(); // 初始化时间
  	expdate.setTime(expdate.getTime() + time); // 时间单位毫秒
    document.cookie = name + '=' + value + ';expires=' + expdate.toGMTString() + ';path=/';
    // 即document.cookie= name+"="+value+";path=/";时间默认为当前会话可以不要，但路径要填写，因为JS的默认路径是当前页，如果不填，此cookie只在当前页面生效！
  },
  getCookie (c_name) { /* 取出cookie值 */
    if (document.cookie.length > 0) {
      let c_start = document.cookie.indexOf(c_name + '=');
      if (c_start != -1) {
        c_start = c_start + c_name.length + 1;
        let c_end = document.cookie.indexOf(';', c_start);
        if (c_end == -1) c_end = document.cookie.length;
        return unescape(document.cookie.substring(c_start, c_end));
      };
    };
    return '';
  },
  getParam (urlParam) {
    var theRequest = new Object();
    if (urlParam.indexOf('?') != -1) {
      var str = urlParam.substr(1);
      var strs = str.split('&');
      for (var i = 0; i < strs.length; i++) {
        theRequest[strs[i].split('=')[0]] = (strs[i].split('=')[1]);
      };
    };
    return theRequest;
  },
  errTipFn (e, self) { // 错误提示
    if (e.msg && e.msg != '') {
      self.errTipMsg = e.msg;
      if (!self.isShowTip) {
        self.isShowTip = true;
        self.baseCont.hideErrorInfo(self);
      };
    } else {
      if (e.data && e.data != '') {
        if (e.data[0]) {
          self.errTipMsg = e.data[0].msg;
          if (!self.isShowTip) {
            self.isShowTip = true;
            self.baseCont.hideErrorInfo(self);
          };
        } else {
          self.errTipMsg = '未知错误';
          if (!self.isShowTip) {
            self.isShowTip = true;
            self.baseCont.hideErrorInfo(self);
          };
        };
      };
    };
  },
  hideErrorInfo (myself) { // 错误提示信息延迟消失
    setTimeout(() => {
      myself.isShowTip = !myself.isShowTip;
    }, 1500);
  },
  //封装的接口
  
  noWeixin (mySelf, desc) {
    var sourceUrl = location.href;
    if (location.search != '' && location.search) {
      var inviteCode = mySelf.baseCont.getParam(location.search);
      if (inviteCode.invite_code) {
        mySelf.baseCont.Setcookie('inviteCode', inviteCode.invite_code, 7 * 12 * 60 * 60 * 1000);
      };
    };
    /* 微信浏览器打开 */
    if (navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1) {
      /* 是否微信授权登录 */
      if (mySelf.baseCont.getCookie('wxOpenId') == null ||
        mySelf.baseCont.getCookie('wxOpenId') == '' ||
        mySelf.baseCont.getCookie('wxOpenId') == 0) {
        /*location.assign('http://m.yibeishop.com/apis/consumer/wx?target_url=' + encodeURIComponent(sourceUrl));
        return false;*/
      };
    };
    /* 公众号平台是否登录 */
    mySelf.axios.post('http://test.qlylian.com/v1/task/test', {}).then((response) => {  //此处放判断是否登录的接口
      if (response.data.status != 'success' && response.data.msg == '未登录') {
        if (!desc) {
          /* 未登陆跳转登录 */
          var index = sourceUrl.lastIndexOf('\/');
          sourceUrl = '/' + sourceUrl.substring(index + 1, sourceUrl.length);
          mySelf.$router.push({
            path: '/login',
            query: {
              redirect: sourceUrl
            }
          });
        } else {
          /* 不登录也可以访问 */
          mySelf.inPage = true;
          mySelf.initData();
        };
      } else {
        mySelf.inPage = true;
        mySelf.initData(response.data.data.user);
      };
    }).catch((err) => {
      console.log(err);
    });
  }
};
