// Tips/Tips.js
const $api = require('../util/api.js').API;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    course_id: '',
    is_play:0, //是否能够播放，能够播放为0，不能播放为1
    btn_text:'',//按钮的文字
    tips_text:'', //提示文字
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    var course_id = options.course_id;
    let that = this;
    that.setData({
      course_id: course_id
    });

    var userInfo = wx.getStorageSync('userInfo');
    var user_id = userInfo.userid;
    var data = {
      courseid: course_id,
      user_id: user_id
    };
    $api.play(data).then(res => {
     if(res.course_session[1]!=null && res.course_session[1].courseflie==4000){
      that.setData({
        is_play:1,
        btn_text:'回搜索页',
        tips_text:'此课程暂时不支持小程序播放'
      })
     }else{
      that.setData({
        is_play:0,
        btn_text:'立即播放',
        tips_text:'选课成功'
      })
     }
    });
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

  /** 立即播放 */
  bofang: function (res) {
    
    let that = this;
    if(that.data.is_play==0){
      wx.navigateTo({ //选课成功页面跳转到播放页面
        url: '/play/play?course_id=' + that.data.course_id
      })
    }else{
      wx.reLaunch({
        url: '/search/search'
      })
      //wx.reLanch({ url: '/search/search'});
     
      // wx.navigateBack({
      //   delta: 1,  // 返回上一级页面。
      //   success: function() {
      //       console.log('成功！')
      //   }
      // })
    }
    
  }
})