
const BASE_URL = 'https://ding.idingdingdian.com/shop'
function request (url, method, data = {}, header = {}) {
  return new Promise((resolve, reject) => {
    wx.showNavigationBarLoading()
    wx.showLoading({
      title: '加载中' // 数据请求前loading
    })
    let token = wx.getStorageSync('token') || ''
    let location = wx.getStorageSync('location') || {}
    let params = Object.assign(data, {
      token: 'oAHSX5E3AbF7oe4joxiKClx499do' || token,
      lat: location.latitude || 0,
      lng: location.longitude || 0
    })
    wx.request({
      url: BASE_URL + url, // 仅为示例，并非真实的接口地址
      method: method,
      data: params,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading()
        wx.hideLoading()
        if (!res.data.status) {
          if (res.data.info === 'fail.empty token') {
            wx.navigateTo({
              url: '../login/main',
              success: (result) => {

              },
              fail: () => {},
              complete: () => {}
            })
            return
          } else {
            wx.showToast({
              title: res.data.info,
              icon: 'none',
              image: '',
              duration: 1500,
              mask: false,
              success: (result) => {

              },
              fail: () => {},
              complete: () => {}
            })
          }
          return
        }
        resolve(res.data)
      },
      fail: () => {
        wx.hideNavigationBarLoading()
        wx.hideLoading()
      },
      complete: function () {

      }
    })
  })
}
export default class Http {
  get (url, data) {
    return request(url, 'GET', data)
  }
  post (url, data) {
    return request(url, 'POST', data)
  }
}
