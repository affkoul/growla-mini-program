// other/other.js
const $api = require('../util/api.js').API;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    feedback_list: {},
    feekbackIds:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();

  },

  getData() {
    let that = this;
    $api.toFeedbackData({}).then(res => {
      if (res.code == 1000) {
        console.log(res);
        // for(feedback in res.feedback_list ){
        //   console.log(feedback);
        //   //console.log(key+':'+people[key]);
        // }
        var feedback_list=[];
        for(let key in  res.feedback_list ){
          if(res.feedback_list[key].title !=null && res.feedback_list[key].title !='' && res.feedback_list[key].title !=undefined){
            feedback_list.push(res.feedback_list[key]);
          }
          //console.log(key+':'+res.feedback_list[key].title);
        }
        //console.log(feedback_list);
        that.setData({
          feedback_list: feedback_list
        });
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

  checkboxChange(e) {
    let that=this;
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    var arr = e.detail.value;
    var feekbackIds='';
    arr.forEach(function (val, index, arr) {
        feekbackIds=feekbackIds+','+val;
    });
    feekbackIds=feekbackIds.substr(1); 
    that.setData({
      feekbackIds:feekbackIds
    });
  },

   /**提交反馈 */
   submit_fankui: function () {
    let that=this;
    var feekbackIds=that.data.feekbackIds;
    var userInfo = wx.getStorageSync('userInfo');
    
    var user_id = userInfo.userid;
    var data = {
      feekbackIds:feekbackIds,
      user_id: user_id
    };
    console.log(feekbackIds);
    if(feekbackIds!=null && feekbackIds!=''){
      $api.doFeedbackData(data).then(res => {
        if (res.code == 1000) {
          console.log(res);
          wx.navigateTo({ //提交反馈跳转到成功页面
            url: '/success/success'
          })
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
    }else{
      wx.showToast({
        title: '请选择提交的选项',
        icon: 'none',
        duration: 2000
      })
    }
    
   
  },
  
  dwonApp:function(){
    var  info = wx.getSystemInfoSync()
    var data={
      user_id:4
    };
    if (info.platform === 'android') {
      // android 需要执行的代码
      console.log("安卓");
      data.type='post';
    } else {
      // ios 需要执行的代码
      data.type='ios';
      console.log("ios");
    }
   
    $api.downApp(data).then(res => {
      if (res.code == 1000) {
        var downAppUrl=res.url;
        console.log(res);
        wx.navigateTo({ //提交反馈跳转到成功页面
          url: '/dwonapp/dwonapp?downAppUrl='+downAppUrl
        })
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

 
})