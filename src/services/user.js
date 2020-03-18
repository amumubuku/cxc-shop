/**
 * 用户相关服务
 */
import Http from '@/utils/request'
const request = new Http()
/**
 * 调用微信登录
 */
function loginByWeixin (iv, encryptedData, code) {
  return new Promise(function (resolve, reject) {
    request.post('/login', {
      code,
      iv,
      encryptedData
    }).then(res => {
      if (res.status) {
        wx.setStorageSync('userInfo', res.data.user)
        wx.setStorageSync('token', res.data.token)
        resolve(res.data)
      } else {
        reject(res)
      }
    }).catch((err) => {
      reject(err)
    })
  })
}
/**
 * 判断用户是否登录
 */
function checkLogin () {
  return new Promise(function (resolve, reject) {
    if (wx.getStorageSync('userInfo') && wx.getStorageSync('token')) {
      resolve(true)
    } else {
    }
  })
}

const user = {
  loginByWeixin,
  checkLogin
}

export default user
