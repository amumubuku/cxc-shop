<template>
  <div class="title-cell">
    <div class="title">{{ info.title }}</div>
    <img :src="info.icon" mode="aspectFill" alt="">
  </div>
</template>

<script>
export default {
  data () {
    return {
      data: []
    }
  },
  props: {
    info: {
      type: Object,
      default: {
        title: '今日推荐',
        des: 'activity'
      }
    }
  },
  methods: {},
  mounted () {}
}
</script>
<style lang="less" scoped>
.title-cell {
  display: flex;
  align-items: center;
  .title {
    font-size: 40rpx;
    font-weight: 800;
    color: rgba(51, 51, 51, 1);
    margin-right: 10rpx;
  }
  img {
    width: 161rpx;
    height: 47rpx;
  }
}
</style>
