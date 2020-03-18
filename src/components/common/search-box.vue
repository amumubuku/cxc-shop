<template>
  <div class="search-box" @click="toSearchPage">
    <div class="input-box">
      <img src="../../../static/images/search-icon.png" alt />
      <span>{{keyWords}}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    keyWords: {
      type: String,
      default: '搜索菜名'
    }
  },

  methods: {
    toSearchPage () {
      wx.navigateTo({
        url: '../search/main',
        success: (result) => {

        },
        fail: () => {},
        complete: () => {}
      })
    }
  }
}
</script>
<style lang="less">
.search-box {
  padding: 0 14px;
  position: fixed;
  padding-bottom: 8px;
  left: 0;
  right: 0;
  top: 0;
  z-index: 999;
  background: #fff;
  .input-box {
    display: flex;
    align-items: center;
    background: #F6F6F6;
    border-radius: 32px;
    height: 32px;
    padding-left: 10px;
    

    ._img {
      width: 14px;
      height: 14px;
      margin-right: 4px;
    }

    ._span {
      font-size: 11px;
      font-weight: 500;
      line-height: 16px;
      color: rgba(172, 172, 172, 1);
    }
  }
}
</style>