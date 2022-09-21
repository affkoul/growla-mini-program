// details/details.js
const $api = require('../util/api.js').API;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    	// "isSelectCourse": "false", 是否选课默认false 
      // "id": "6", id
      // "title": " 0-3岁家庭活动", 课程名称
      // "desc": " 0-3岁家庭活动课程提供多种涵盖各学科的丰富的资源，共家长和孩子在家庭环境中使用。&nbsp;", 课程简介
      // "startdate": "2021-09-16", 课程开始时间
      // "type": "免费",  课程类型 
      // "code": "1000"
      course_details:{}, //课程详情
      select_text:'选课',
      is_select:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var course_id = options.course_id;
    var userInfo = wx.getStorageSync('userInfo');
    console.log(userInfo);
    var user_id = userInfo.userid;
    console.log(options.course_id,course_id);
    let that = this;
    var data = {
      id:course_id,
      user_id:user_id
    };
    $api.detailData(data).then(res => {
      console.log(res);
      if (res.code == 1000) {
        that.setData({
            course_details:res,
        });

        if(res.isSelectCourse=='true'){
            that.setData({
              select_text: '立即播放',
              is_select:true
            })
          }else{
            that.setData({
              select_text: '选课'
            })
          }
        
      
      } else {
        console.log(res)
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

  xuanke: function (event) {
    let that =this
    var course_id = event.currentTarget.dataset.course_id;
    var userInfo = wx.getStorageSync('userInfo');
    var data = {
      id:course_id,
      userid:userInfo.userid
    };
    if(that.data.is_select==true){
      wx.navigateTo({ //选课成功页面跳转到播放页面
        url: '/play/play?course_id=' + course_id
      })
    }else{
    $api.joinCourseData(data).then(res => {
      if (res.code == 1000) {
        wx.navigateTo({  //课程详情跳转到选课成功页面
          url: '/Tips/Tips?course_id='+course_id
        })
        console.log(res);
      } else {
        console.log(res);
        wx.showToast({
          title: '不支持选课！',
          icon: 'none',
          duration: 2000,
          success: function () {
            setTimeout(function () {
              wx.reLaunch({
                url: '/search/search'
              })
            }, 2000);
          }
        })
      }
    }).catch(err => {
      console.log(res)
      wx.showToast({
        title: '请求失败，请检查网络',
        icon: 'none',
        duration: 2000
      })
    })
  }   
  }
})