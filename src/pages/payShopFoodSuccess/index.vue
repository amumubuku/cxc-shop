<template>
  <div class="page-wrap">
    <div class="top dis-flex vertical flex-middle">
      <div class="success-icon"></div>
      <div class="success-title">订单支付成功，努力出餐中！</div>
      <div class="success-des">等待有点无聊？教你如何点外卖赚钱</div>
      <div @click="toOrder" class="btn dis-flex flex-middle flex-center">查看我的订单</div>
    </div>
    <div class="other dis-flex vertical">
      <div class="title">前往小程序，查看更多美食</div>
      <div @click="toIndex" class="item dis-flex flex-middle flex-between">
        <div class="dis-flex flex-middle">
          <div class="item-img"></div>
          <div class="dis-flex vertical flex">
            <div class="item-title">叮叮点共享外卖平台</div>
            <div class="item-des">堂食与外卖同价，分享赚收益，探索外卖新生态</div>
          </div>
        </div>
        <div class="right dis-flex flex-middle flex-right">
          立即前往
          <div class="right-icon"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    // 去订单
    toOrder () {
      wx.navigateTo({
        url: `../orderCopy/main`
      })
    },
    // 去首页
    toIndex () {
      wx.switchTab({
        url: `../index/main`
      })
    }
  }
}
</script>

<style scoped lang="less">
  @import url(./style.less);
</style>
