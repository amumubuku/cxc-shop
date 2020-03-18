<script>
export default {
  created () {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (!res.hasUpdate) return
        console.info('检测到版本更新....')
      })
      updateManager.onUpdateReady(function () {
        wx.removeStorageSync('carts')
        updateManager.applyUpdate()
      })
      updateManager.onUpdateFailed(function () {
        // 新版本下载失败
        console.error('新版本下载失败')
      })
    }
    wx.onPageNotFound((res) => {
      wx.navigateTo({
        url: '../index/main',
        success: (result) => {

        },
        fail: () => {},
        complete: () => {}
      })
    })
    wx.getSystemInfo({
      success: (result) => {
        wx.setStorageSync('systemInfo', result)
      },
      fail: () => {},
      complete: () => {}
    })
  }
}
</script>

<style>
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
</style>
