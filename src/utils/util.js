let time2min = time => {
  let arr = time.split(':')
  return arr[0] * 60 + parseInt(arr[1])
}

let min2time = min => {
  let hour = parseInt(min / 60)
  let minute = min - hour * 60
  if (hour >= 24) {
    hour = hour - 24
  }
  if (minute < 10) {
    minute = '0' + minute
  }
  if (hour < 10) {
    hour = '0' + hour
  }
  return `${hour}:${minute}`
}
export function getSelectTime (start, end, step) {
  let startTime = time2min(start)
  let endTime = time2min(end)
  if (startTime > endTime) {
    endTime += 24 * 60
  }
  let arr = []
  while (startTime < endTime) {
    let right = startTime + step > endTime ? endTime : startTime + step
    arr.push(`${min2time(startTime)}-${min2time(right)}`)
    startTime += step
  }
  return arr
}
export function dobounce (fuc, delay) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fuc.apply(this, args)
    }, delay)
  }
}
export function throttle (fn, delay) {
  var previous = 0
  // 使用闭包返回一个函数并且用到闭包函数外面的变量previous
  return function () {
    var _this = this
    var args = arguments
    var now = new Date()
    if (now - previous > delay) {
      fn.apply(_this, args)
      previous = now
    }
  }
}
/**
 * 封封微信的的request
 */
function request (url, data = {}, method = 'GET') {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // console.log('请求成功，url:', url);
        // console.log('请求参数，data:', data);
        if (res.statusCode === 200) {
          if (res.data.errno === 401) {
            // 需要登录后才可以操作
          } else {
            resolve(res.data)
          }
        } else {
          reject(res.errMsg)
        }
      },
      fail: function (err) {
        reject(err)
        // console.log('请求失败，url', url);
        // console.log('请求参数，data:', data);
      }
    })
  })
}

/**
 * 检查微信会话是否过期
 */
function checkSession () {
  return new Promise(function (resolve, reject) {
    wx.checkSession({
      success: function () {
        resolve(true)
      },
      fail: function () {}
    })
  })
}
/**
 * 调用微信登录
 */
function login () {
  return new Promise(function (resolve, reject) {
    wx.login({
      success: function (res) {
        if (res.code) {
          resolve(res)
        } else {
          reject(res)
        }
      },
      fail: function (err) {
        reject(err)
      }
    })
  })
}
/**
 * 调用微信获取用户信息接口，需要button授权
 */
function getUserInfo () {
  return new Promise(function (resolve, reject) {
    // 查看button是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            withCredentials: true,
            success: function (res) {
              // console.log('获取用户信息成功', res);
              resolve(res)
            },
            fail: function (err) {
              // console.log('获取用户信息失败', err);
              reject(err)
            }
          })
        } else {
          // 没有授权
          // console.log('但获取用户信息失败，未同意button授权');
        }
      }
    })
  })
}

/**
 * @description:  判断用户是否登录，没有登录跳转登录授权页面
 * @param {url}
 * @return: null
 */
function checkLogin (url) {
  if (wx.getStorageSync('userInfo') && wx.getStorageSync('token')) {
    wx.navigateTo({
      url
    })
    return false
  } else {
    wx.navigateTo({
      url: '../login/main'
    })
  }
}

function showErrorToast (msg) {
  wx.showToast({
    title: msg,
    image: '/static/images/icon_error.png'
  })
}

const util = {
  request,
  checkLogin,
  showErrorToast,
  checkSession,
  login,
  getUserInfo
}

export default util
