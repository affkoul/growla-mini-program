// history/history.js
const $api = require('../util/api.js').API;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recently_course: [], //列表
    currentPageNum: 1, //当前页面
    isnoneData: true, //是否还有数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
  },


  getData() {
    let that = this;
    var userInfo = wx.getStorageSync('userInfo');
    var user_id = userInfo.userid;
    var data = {
      user_id: user_id,
      p: that.data.currentPageNum,
    };
    $api.recentlyCourseData(data).then(res => {
      if (res.code == 1000) {
        console.log(res);
        if (res.recently_course!=null) {
          var currentPageNum = that.data.currentPageNum + 1;
          var tmpArr = that.data.recently_course;
          tmpArr.push.apply(tmpArr, res.recently_course);
          that.setData({
            recently_course: tmpArr,
            currentPageNum: currentPageNum,
            isnoneData: true,
          });
        } else {
          that.setData({
            isnoneData: false
          });
        }
      } else {
        wx.showToast({
          title: '内部出错，稍后再试',
          icon: 'none',
          duration: 2000
        })
      }
    }).catch(err => {
      console.log(err);
      wx.showToast({
        title: '请求失败，请检查网络',
        icon: 'none',
        duration: 2000
      })
    })
  },


  goToDetail(event) {
    var course_id = event.currentTarget.dataset.course_id;
    wx.navigateTo({ //我的历史列表页面跳转课程详情
      url: '/details/details?course_id=' + course_id
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
    console.log("22222");
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("111");
    let that = this;
    if (that.data.isnoneData) {
      that.getData();
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

})