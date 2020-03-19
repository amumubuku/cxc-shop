<template>
  <div class="page-wrap dis-flex vertical flex-middle">
    <div class="icon"></div>
    <div class="title">提现成功</div>
    <div class="des">我们将在三个工作日内处理您的提现申请</div>
    <div @click="toBack" class="btn"></div>
  </div>
</template>
<script>
export default {
  methods: {

    // 提现详情
    toBack (id) {
      wx.navigateBack({
        delta: 1
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import "./style";
</style>
