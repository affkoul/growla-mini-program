// index/index.js
const App = getApp();
const $api = require('../util/api.js').API;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: false, //是否显示面板指示点
    autoplay: true, //是否自动播放
    interval: 2000, //停留时间间隔
    duration: 1000, //播放时长
    previousMargin: '40rpx', //前边距，可用于露出前一项的一小部分，接受 px 和 rpx 值
    nextMargin: '40rpx', //后边距，可用于露出后一项的一小部分，接受 px 和 rpx 值
    circular: true, //是否采用衔接滑动
    currentSwiperIndex: 0, //swiper当前索引
    imgUrls: {}, //轮播图
    expert_list: {},
  },


  swiperBindchange(e) {
    this.setData({
      currentSwiperIndex: e.detail.current
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let that = this;
    //自定义头部方法,用于搜索框
    that.setData({
      navH: App.globalData.navHeight
    });
    // that.setData({
    //   imgUrls:[{id:1,file:'/../images/banner01.png'},{id:2,file:'/../images/banner01.png'},{id:3,file:'/../images/banner01.png'}]
    // });


    $api.indexData({}).then(res => {
      if (res.code == 1000) {
        that.setData({
          imgUrls: res.banner_list,
          expert_list: res.expert_list
        });
      } else {
        wx.showToast({
          title: '内部出错，稍后再试',
          icon: 'none',
          duration: 2000
        })
      }
      console.log(res);
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

  /** 搜索触发事件 */
  toSearch: function (res) {
    wx.navigateTo({ //首页跳转到课程列表页面
      url: '/search/search'
    })
  },

  /**去我的 */
  toMyhome: function (res) {
    wx.redirectTo({
      url: '/my/my'
    });
  },

  //跳转课程详情
  coursesDetail: function (res) {
    var courses_id = res.currentTarget.dataset['courses_id'];
    //console.log(courses_id);
    // wx.redirectTo({
    //   url: '/my/my'
    // });
    wx.navigateTo({ //课程列表页面跳转到课程详情页面
      url: '/details/details?course_id=' + courses_id
    })
  }
  
})