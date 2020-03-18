<template>
  <div class="content-wrp">
    <div class="content">
      <div class="tip-icon"></div>
      <div class="title">{{info.title}}</div>
      <p>{{info.des}}</p>
    </div>
    <div class="page-box" v-if="page" @click="toPage">
      <p>更多</p>
    </div>
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
        title: '菜小厨',
        des: '乐享生活',
        icon: ''
      }
    },
    showBorder: {
      type: Boolean,
      default: false
    },
    page: {
      type: String,
      default: ''
    }
  },
  methods: {
    toPage () {
      let page = this.page
      wx.navigateTo({
        url: page,
        success: result => {},
        fail: () => {
          wx.switchTab({
            url: page,
            success: result => {},
            fail: () => {},
            complete: () => {}
          })
        },
        complete: () => {}
      })
    },
    emitMore () {
      this.$emit('emitMore')
    }
  },
  mounted () {}
}
</script>
<style lang="less" scoped>
.content-wrp {
  height: 49px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  .content {
    display: flex;
    align-items: center;
    .tip-icon {
      position: relative;
      top: 1px;
      width: 6px;
      height: 19px;
      background: rgba(255, 159, 30, 1);
      border-radius: 3px;
      margin-right: 6px;
    }
    .title {
      font-size: 19px;
      font-weight: bold;
      color: #212121;
      padding-right: 12px;
    }
    p {
      font-size: 11px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.5);
    }
  }
  .page-box {
    width: 46px;
    height: 20px;
    border: 3px solid #ffcf8e;
    border-radius: 30px;
    font-size: 11px;
    font-weight: 500;
    line-height: 20px;
    text-align: center;
    color: rgba(0, 0, 0, 1);
  }
}
</style>
