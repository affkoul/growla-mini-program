App({
  onLaunch() {
    // 获取顶部栏信息
    wx.getSystemInfo({
      success: res => {
        //导航高度
        this.globalData.navHeight = res.statusBarHeight + 46;
      },
      fail(err) {
        console.log(err);
      }
    })
  },
  globalData:{
    userInfo:null,
    navHeight:0,
    baseURL:'https://wechat.growlaasia.com/web/api/v1/'
  }
})