const app = getApp();
const $api = require('../util/api.js').API;

Page({
  data: {

  },

  onLoad() {
    // var userinfo={'id':11,'username':'张三','phone':'13555525252'};
    // wx.setStorageSync('userinfo', userinfo)
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var userInfo= wx.getStorageSync("userInfo");
    // wx.getStorage({ key: 'userInfo', success: function(res) {
    //    userInfo=res.data 
    //    console.log(res.data);
    //   } })
    if(userInfo!=null && userInfo!=undefined &&userInfo!="" && 
    userInfo.telphone!=null && userInfo.telphone!=undefined &&userInfo.telphone!=""){ 
      setTimeout(function () {
        wx.redirectTo({ //欢迎加载页面跳转到
          url: '/index/index'
        })
      }, 2000);
    }else{
      /*wx.showModal({
        title: '提示',
        content: '您未登录，请先登录！',
        success (res) {
          wx.navigateTo({  //已经注释掉了
            url: '/empower/empower',
          })
        }
      })*/
      wx.redirectTo({
        url: '/empower/empower',
      })
    }
  },
})