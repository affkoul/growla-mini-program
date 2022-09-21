// my/my.js
const $api = require('../util/api.js').API;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("1111111111111")
    let that=this;
    var userInfo = wx.getStorageSync('userInfo');
    console.log(userInfo);
    var user_id = userInfo.userid;
    var data = {
      user_id: user_id
    };
    userInfo.head_img=userInfo.avatarUrl;
    userInfo.username=userInfo.nickName;
    that.setData({userInfo:userInfo})
    console.log(userInfo)
    console.log('user_id',user_id)
    $api.myData(data).then(res => {
      if (res.code == 1000) {
        userInfo.head_img = res.userInfo.head_img
        userInfo.username = res.userInfo.username
      
        wx.setStorageSync('userInfo', userInfo)
        console.log(wx.getStorageSync('userInfo'))
      } else {
        wx.showToast({
          title: '内部出错，稍后再试',
          icon: 'none',
          duration: 2000
        })
      }
    }).catch(err => {
      wx.showToast({
        title: '请求失败，请检查网络',
        icon: 'none',
        duration: 2000
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },



  /**浏览记录 */
  toBrowseHistory: function (res) {
    console.log("111");
    wx.navigateTo({ //我的跳转到浏览记录页面
      url: '/history/history',
    })
  },

  /**选课记录 */
  toXuankeHistory: function (res) {
    console.log("222");
    wx.navigateTo({ //我的跳转到选课记录页面
      url: '/courses/courses',
    })
  },

  /**其他 */
  toQita: function (res) {
    console.log("333");
    wx.navigateTo({ //我的跳转到其他
      url: '/other/other',
    })
  },

  /** 去首页 */
  toIndex: function (res) {
    wx.redirectTo({
      url: '/index/index',
    })
  }

})