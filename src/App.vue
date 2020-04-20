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

.dis-flex {
  display: flex;
  flex-direction: row;
}
.vertical {
  display: flex;
  flex-direction: column;
}
.flex {
  flex: 1;
}
.flex-top {
  align-items: flex-start;
}
.flex-middle {
  align-items: center;
}
.flex-bottom {
  align-items: flex-end;
}
.flex-center {
  justify-content: center;
}
.flex-left {
  justify-content: flex-start;
}
.flex-right {
  justify-content: flex-end;
}
.flex-around {
  justify-content: space-around;
}
.flex-between {
  justify-content: space-between;
}
.flex-wrap {
  flex-wrap: wrap;
}
.flex-middle-center {
  align-items: center;
  justify-content: center;
}

/*行数省略*/
.clamp-1 {
    display:-webkit-box;
    overflow:hidden;
    -webkit-box-orient:vertical;
    -webkit-line-clamp:1;
    line-height: 1.5;
}
.clamp-2 {
    display:-webkit-box;
    overflow:hidden;
    -webkit-box-orient:vertical;
    -webkit-line-clamp:2;
    line-height: 1.5;
}
.clamp-3 {
    display:-webkit-box;
    overflow:hidden;
    -webkit-box-orient:vertical;
    -webkit-line-clamp:3;
    line-height: 1.5;
}
</style>
