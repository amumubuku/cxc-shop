<template>
  <div class="login">
    <img src="https://img.icaixiaochu.com/login-icon.png" mode="aspectFit" alt />
    <button
      class="login-btn"
      type="primary"
      open-type="getUserInfo"
      @getuserinfo="getUserInfo"
      lang="zh_CN"
    >微信用户一键登录</button>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import user from '@/services/user'
export default {
  data () {
    return {
      code: ''
    }
  },
  methods: {
    // 绑定关系
    async bindParent (id) {
      wx.showModal({
        title: '绑定id',
        content: '' + id,
        showCancel: false
      })
      try {
        await this.$http.post('/bindParent', {
          parent_id: id
        })
      } catch (err) {
        console.log('绑定关系', err)
      }
    },

    getUserInfo (e) {
      if (e.mp.detail) {
        let { encryptedData, iv } = e.mp.detail
        wx.checkSession({
          success: (result) => {
            user.loginByWeixin(iv, encryptedData, this.code).then(res => {
              this.setUser(res.user)
              let id = wx.getStorageSync('parent_id')
              if (id) {
                console.log(id)
                this.bindParent(id)
              }
              wx.navigateBack({ changed: true })
            })
          },
          fail: () => {
            wx.login({
              timeout: 10000,
              success: (result) => {
                user.loginByWeixin(iv, encryptedData, result.code).then(res => {
                  this.setUser(res.user)
                  wx.navigateBack({ changed: true })
                })
              },
              fail: () => {},
              complete: () => {}
            })
          },
          complete: () => {}
        })
      } else {
        wx.showToast({
          title: '取消登录',
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
    },
    ...mapActions(['setUser'])
  },
  mounted () {
    wx.login({
      timeout: 10000,
      success: (result) => {
        this.code = result.code
      },
      fail: () => {},
      complete: () => {}
    })
  }
}
</script>
<style lang="less" scoped>
@import "./style.less";
</style>

