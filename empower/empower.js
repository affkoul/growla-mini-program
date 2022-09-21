const app = getApp();
const $api = require('../util/api.js').API;
const baseURL = 'https://wechat.growlaasia.com/web/api/v1/';
// empower/empower.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}, //用户信息
    canIUseGetUserProfile: false, //用户信息获取方法是getUserinfo还是getUserProfile
    isuserInfo: false, //用户信息是否存在
    isuserTelphone: false, //用户手机号是否存在
    isradioval: false, //同意radio的值
    userLocation: '', //用戶经纬度
    province:'',//省
    city:'',//市
    detail_address: '',//用户地址详情
    openId: '', //用户openId
    session_key: '',//取手机号用到的(Mass添加)
    //userInfo:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let needGetWXUserInfo = true;//是否需要去微信取用户信息和手机号、地址定位

    //取本地用户信息
    let userInfo = wx.getStorageSync('userInfo')
    //console.log('00000')
console.log(userInfo)
    //如果本地用户信息为空，则需要取各项信息
    if (userInfo == "" || userInfo == undefined || userInfo == null) { //用户信息为空
      //console.log('1111')
    } else {
      //如果用户电话号码为空，因为仍然需要用到openid和session_key，所以直接重新取用户信息和手机号
      if (userInfo.phone == "" || userInfo.phone == undefined || userInfo.phone == null) {

      } else if(userInfo.userid == "" || userInfo.userid == undefined || userInfo.userid == null){

      //只有户信息不为空且手机号和userid也不为空，不用取用户信息，直接跳到首页
      }else{
 
        needGetWXUserInfo = false;
        that.setData({
          isuserInfo: false,
          isuserTelphone: false
        })
        wx.redirectTo({
          url: '/index/index'
        })
      }
    }

    if (needGetWXUserInfo) {
      //获取用户经纬度
      that.getWxLocation();
      that.setData({
        isuserInfo: true,
        isuserTelphone: false
      })
      if (wx.getUserProfile) { //判断获取用户信息用新方法还是旧方法
        this.setData({
          canIUseGetUserProfile: true
        })
      }
    }
  },

  //获取用户经纬度
  getWxLocation() {
    let that = this;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude; //纬度
        const longitude = res.longitude;
        const speed = res.speed;
        const accuracy = res.accuracy;
        let loctionData = {
          "latitude": latitude,
          "longitude": longitude,
          "speed": speed,
          "accuracy": accuracy
        };
        wx.request({
          url: 'https://api.map.baidu.com/geocoder?location=' + latitude + ',' + longitude + '30.36251,118.601253&output=json&key=wKoEIfgvt579dGC9Qp6Zx5x10yTYYB6n',
          header: {
            'Content-Type': 'application/json'
          },
          method: 'GET',
          success: (res) => {
            console.log(res)
            if (res.statusCode == 200 && res.data.status == 'OK') {
              var province = res.data.result.addressComponent.province; //省
              var district = res.data.result.addressComponent.district; //市
              var street = res.data.result.addressComponent.street; //街道
              var detail_address = province + "," + district + "," + street;
              that.setData({
                userLocation: loctionData.latitude + ',' + loctionData.longitude,
                detail_address: detail_address,
                province:province,
                city:district
              });
            }
          }
        })
      }
    })
  },

  //点击同意
  radioChange(e) {
    this.setData({
      isradioval: true,
    })
  },

  //获取用户信息新方法
  getUserProfile(e) { //获取用户信息
    if (!this.data.isradioval) { //判断是否勾选同意
      let msg = "请先勾选阅读并同意《服务协议》和《用户保护政策》";
      wx.showModal({
        title: '提示',
        content: msg,
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return false;
    }
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.getOpenId(res);
      }
    })
  },

  //获取用户信息旧方法
  getUserInfo(e) {
    if (!this.data.isradioval) { //判断是否勾选同意
      let msg = "请先勾选阅读并同意《服务协议》和《用户保护政策》";
      wx.showModal({
        title: '提示',
        content: msg,
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return false;
    }
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    this.getOpenId(e.detail);
  },

  //获取openid
  getOpenId(res) {
    let that = this;
    that.setData({
      userInfo: res.userInfo,
      isuserInfo: false,
      isuserTelphone: true
    });
    wx.login({
      success(res) {
        
        if (res.code) {
          console.log(res.code)
          wx.request({
            url: baseURL+'/wechatxcx.php',
            data: {
              apiName: 'getOpenid',
              code: res.code
            },//jscode
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function (res) {
              console.log(res)
              var content = res.data.data;
              //console.log(content)
              that.setData({
                openId: content.openid,
                session_key: content.session_key
              });
              //增加其他属性到userInfo
              let userInfo = that.data.userInfo

              userInfo.apiName = 'login',
              userInfo.token = 'login', 
              userInfo.userid = '',//用户id，因为没有还没到后台取，设置为空
              userInfo.openId = that.data.openId,//openid
              userInfo.openid = that.data.openId,//因为要传给后端，后端名称是这个
              userInfo.nickname = that.data.userInfo.nickName, //昵称，因为要传给后端，后端名称是这个
              //userInfo.phone = '', //用户手机号，在取手机号的时候修改
              userInfo.city = that.data.detail_address, //详细地址
              userInfo.unionid = 'test',//国家id?
              userInfo.userLocation = that.data.userLocation, //用户经纬度
              /*以下为从微信取得，在userInfo中已经有了
//                nickName: that.data.userInfo.nickName, //昵称
//                gender: that.data.userInfo.gender, //0：未知，1：男，2：女
//                photo: that.data.userInfo.avatarUrl, // 头像
//                country: '',//国家
//                province: that.data.province,//省份
*/
              that.setData({userInfo})
              wx.setStorageSync('userInfo', userInfo)
              //增加属性到userInfo结束
            }
          })
        }
      }
    })
  },
  //获取电话号码
  getPhone(e) {
    let that = this
console.log(e.detail.encryptedData)
console.log(e.detail.iv)
console.log(that.data.session_key)
        wx.request({
          url: 'https://growlaasia.com/web/api/v1/wechatxcx.php',
          data:{
            apiName:'decryptData',
            encryptedData: e.detail.encryptedData,
            iv:e.detail.iv,
            sk:that.data.session_key
          },//jscode
          method:'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success: function(res) {
            console.log(res)
            let mobile=JSON.parse(res.data.data).phoneNumber
            //增加其他属性到userInfo
            let userInfo = that.data.userInfo
            userInfo.phone = mobile //用户手机号，在取手机号的时候修改
            that.setData({userInfo})
            wx.setStorageSync('userInfo', userInfo)
            //增加属性到userInfo结束
            //console.log(userInfo)
            //console.log(wx.getStorageSync('userInfo'))

            that.member_login()

          }
        })
  },
  //用户登录
  member_login() {
    let that = this;
    let userInfo = that.data.userInfo
    wx.request({
      url: 'https://growlaasia.com/web/api/v1/wechatxcx.php',
      apiName:'login',
      data: userInfo,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {//取回来的phone字段是phone1
        //console.log('xxxxx')
        //console.log(res.data.data.id)
        //console.log(res)


        userInfo.userid = res.data.data.id
        that.setData({userInfo})
        wx.setStorageSync('userInfo', userInfo)
        //console.log('yyyy')






        //console.log(that.data.userInfo)
        //console.log(wx.getStorageSync('userInfo'))
        //userData.userid=res.data.
        //wx.setStorageSync('userInfo', userData)
        //跳转到首页
        wx.redirectTo({
          url: '/index/index'
        })
      }
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

  /**去服务说明页面 */
  toService: function () {
    //console.log("111");
    wx.navigateTo({ //授权页面跳转到服务说明
      url: '/service/service'
    })
  },

  /**去协议页面 */
  toPolicy: function () {
    wx.navigateTo({ //授权页面跳转到协议说明
      url: '/policy/policy'
    })
  },

})