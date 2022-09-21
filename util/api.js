const app = getApp();

const GET = 'GET';
const POST = 'POST';
const PUT = 'PUT';
const FORM = 'FORM';
const DELETE = 'DELETE';

//const baseURL = 'https://growlaglobal.com/web/api/v1/';
const baseURL = 'https://wechat.growlaasia.com/web/api/v1/';

//弃用
function request_start(method, url, data, is_token = true, time = 5000) {
  return new Promise(function (resolve, reject) {
    var requests;
    if (is_token) {
      wx.getStorage({
        key: 'user_info',
        success(res) {
          data.token = res.data.token;
          requests = request(method, url, data, time).then(res => {
            resolve(res)
          }).catch(err => {
            reject(err)
          });
        },
        fail(res) {
          //token 不存在
          wx.redirectTo({ //已经弃用
            url: '/pages/login/login',
          })
          return false;
        }
      })
    } else {
      requests = request(method, url, data, time).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      });
    }
  })
}


//封装requst方法
function request(method, url, data, time) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: baseURL + url,
      method: method,
      data: method === POST ? JSON.stringify(data) : data,
      header: {
        'content-type': 'application/json',
        'accept-language': 'zh-CN',
      },
      timeout: time,
      success(res) {
        switch (res.data.code) {
          case 1:
            resolve(res.data);
            break;
          case 301:
            wx.removeStorageSync('userInfo');
            wx.redirectTo({
              url: '/loading/loading',
            })
            break;
          default:
            if (res.data.code > 600) {
              resolve(res.data);
            } else {
              reject(res.data);
            }
            break;
        }
      },
      fail(err) {
        if (err.errMsg = 'request:fail timeout') {
          reject({
            code: 0,
            msg: '请求超时'
          });
        }
        reject({
          code: 0,
          msg: '请求错误'
        });
      }
    })
  })
}

const API = {
  //  getOpenid: (data) => request(POST, `wechatxcx.php`, data, false), //获取openid
  //  getPhone:(data)=>request(POST,`wechatxcx.php`,data,false),//取手机号
  //  userlogin: (data) => request(GET, `wechatxcx.php`, data, false), //登录
  indexData: (data) => request(GET, `index.php`, data, false), //首页
  searchData: (data) => request(GET, `search.php`, data, false), //搜索
  myData: (data) => request(GET, `my.php`, data, false), //我的
  myCourseData: (data) => request(GET, `myCourse.php`, data, false), //我的课程
  recentlyCourseData: (data) => request(GET, `recentlyCourse.php`, data, false), //我的浏览课程列表
  browseCourses: (data) => request(POST, `browseCourses.php`, data, false), //我的浏览课程，新增加入浏览课程
  detailData: (data) => request(GET, `detail.php`, data, false), //课程详情
  play: (data) => request(GET, `view.php`, data, false), //立即播放
  getCourseVideo: (data) => request(GET, `getView.php`, data, false), //获取课程视频
  joinCourseData: (data) => request(GET, `joinCourse.php`, data, false), //加入课程
  toFeedbackData: (data) => request(GET, `feedback.php`, data, false), //意见反馈获取
  doFeedbackData: (data) => request(POST, `feedback.php`, data, false), //意见反馈提交
  downApp: (data) => request(GET, `downapp.php`, data, false), //下载app
};



module.exports = {
  API: API,
}