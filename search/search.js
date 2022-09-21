// search/search.js
const App = getApp();
const $api = require('../util/api.js').API;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        searchVal: '', //搜索条件
        course_list: [], //课程列表
        currentPageNum: 1, //当前页面
        isnoneData: true,
    },



    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        that.getData();
    },

    //获取数据
    getData() {
        let that = this;
        var data = {
            p: that.data.currentPageNum,
            keyWords: that.data.searchVal
        };
        $api.searchData(data).then(res => {
            if (res.code == 1000) {
                console.log(res)
                if (res.course_list.length > 0) {
                    var currentPageNum = that.data.currentPageNum + 1;
                    var tmpArr = that.data.course_list;
                    tmpArr.push.apply(tmpArr, res.course_list);
                    that.setData({
                        course_list: tmpArr,
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
            wx.showToast({
                title: '请求失败，请检查网络',
                icon: 'none',
                duration: 2000
            })
        })
    },

    //input监听
    bindKeyInput(e) {
        console.log(e.detail.value);
        this.setData({
            course_list: [],
            searchVal: e.detail.value,
            currentPageNum: 1,
        })
        this.getData();
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

    /** 清空搜索事件 */
    resetSearch: function (res) {
        let that = this;
        that.setData({
            course_list: [],
            searchVal: '',
            currentPageNum: 1,
        })
        that.getData();
    },

    /** 去详情页面 */
    toDetails: function (event) {
        console.log('1111')
        console.log(event)
        var course_id = event.currentTarget.dataset.course_id;
        var userInfo = wx.getStorageSync('userInfo');
        console.log(course_id,'====');
        
        var data = {
            courseid:course_id,
            user_id:userInfo.userid
          };

        $api.browseCourses(data).then(res => {
            console.log(res)
            /*if (res.code == 1000) {
              console.log(res);
            } else {
              wx.showToast({
                title: '内部出错，稍后再试',
                icon: 'none',
                duration: 2000
              })
            }*/
          }).catch(err => {
            // wx.showToast({
            //   title: '请求失败，请检查网络',
            //   icon: 'none',
            //   duration: 2000
            // })
          })   

        wx.navigateTo({ //课程列表页面跳转到课程详情页面
            url: '/details/details?course_id=' + course_id
        })
    },
})