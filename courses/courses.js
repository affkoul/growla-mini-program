// courses/courses.js
const App = getApp();
const $api = require('../util/api.js').API;
Page({

    /**
     * 页面的初始数据
     */
    data: {
      my_course: [], //列表
      currentPageNum: 1, //当前页面
      isnoneData: true, //是否还有数据
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      console.log("===============")
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
      $api.myCourseData(data).then(res => {
        if (res.code == 1000) {
          console.log(res);
          if (res.my_course!=null) {
            console.log("11111111111111111111");
            var currentPageNum = that.data.currentPageNum + 1;
            var tmpArr = that.data.my_course;
            tmpArr.push.apply(tmpArr, res.my_course);
            that.setData({
              my_course: tmpArr,
              currentPageNum: currentPageNum,
              isnoneData: true,
            });
            console.log(that.data.my_course);
          } else {
            that.setData({
              isnoneData: false
            });
          }
        } else {
          console.log("333333333333333333333");
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
    


   
    
})
