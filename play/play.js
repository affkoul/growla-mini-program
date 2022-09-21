// play/play.js
const app = getApp();
const $api = require('../util/api.js').API;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        course_id: '',
        course_session: [],
        course_length: 0,
        current_Index: 0,
        current_Mp4: '',
        current_title: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        var course_id = options.course_id;
        var userInfo = wx.getStorageSync('userInfo');
        console.log(userInfo);
        var user_id = userInfo.userid;
        var data = {
            courseId: course_id,
            user_id: user_id
        };
        $api.play(data).then(res => {
            console.log(res);
            if (res.course_session.length > 0) {
                that.setData({
                    course_session: res.course_session,
                    course_length: res.course_session.length,
                    current_Index: 0,
                    course_id: course_id
                    //current_Mp4: res.course_session[0][0].classLink
                })
                that.getCourseVideo();
            }
        });

        console.log(that.data)
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

    getCourseVideo: function () {
        // 英文绘本视频——我的第一本故事书（第二辑）
        //https://wechat.growlaasia.com/web/api/v1/getView.php?courseId=231&section_id=1437&module_id=2797
        var that = this;
        var userInfo = wx.getStorageSync('userInfo');
        var user_id = userInfo.userid;
        var courseId = that.data.course_id;
        var course_session = that.data.course_session;
        var current_Index = that.data.current_Index;
        var section_id = course_session[current_Index].section_id;
        var module_id = course_session[current_Index].module_id;
        var courseData = {
            user_id: user_id,
            courseId: courseId,
            section_id: section_id,
            module_id: module_id
        };
        console.log('11111111')
        console.log(courseData);
        $api.getCourseVideo(courseData).then(video_res => {
            that.setData({
                current_Mp4: video_res.courseflie,
                current_title: video_res.sectionname
            });
            console.log(video_res)
        });
    },

    /**左一曲 */
    leftTap: function (res) {
        var that = this;
        if (that.data.current_Index == 0) {
            wx.showToast({
                title: '已经是第一个了',
                icon: 'error',
                duration: 2000
            })
        } else {
            let current_Index = that.data.current_Index - 1;
            that.setData({
                current_Index: current_Index
            })
            that.getCourseVideo();

        }
        console.log("左左左");
    },

    /**右一曲 */
    rightTap: function (res) {
        var that = this;

        if (that.data.current_Index == that.data.course_length - 1) {
            wx.showToast({
                title: '已经是最后一个了',
                icon: 'error',
                duration: 2000
            })
        } else {
            let current_Index = that.data.current_Index + 1;
            that.setData({
                current_Index: current_Index,
            })
            that.getCourseVideo();
        }
        console.log("右右右");
    },



})