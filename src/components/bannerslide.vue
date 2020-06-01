<template>
  <div class="banner">
    <div class="banner-wrp">
      <swiper
        :indicator-dots="indicatorDots"
        :autoplay="autoplay"
        :interval="interval"
        :duration="duration"
        :circular="circular"
        @change="swiperChange"
        @animationfinish="animationfinish"
        :current="currentPageIndex"
        class="swiper"
      >
        <div v-for="(item, index) in banner" :key="index" @click="jump(item)">
          <swiper-item class="swiper-item">
            <img :src="item.image" class="slide-image" mode="scaleToFill" />
          </swiper-item>
        </div>
      </swiper>
      <div class="dots">
        <span
          class="dot"
          v-for="(item, index) in banner"
          :key="index"
          :class="[index === currentPageIndex ? 'disable' : '']"
        ></span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    banner: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      indicatorDots: false,
      autoplay: true,
      interval: 2500,
      duration: 400,
      circular: true,
      currentPageIndex: 0
    }
  },
  methods: {
    jump (item) {
      let serverHandle = {
        0: (item) => {
          wx.navigateTo({
            url: `../shop/main?shopId=${item.value_id}`
          })
        },
        1: (item) => {
          wx.navigateTo({
            url: `../webview/mai?url=${item.value_id}`
          })
        },
        2: (item) => {}
      }
      let cb = serverHandle[item.jump_type]
      cb(item)
    },
    swiperChange (e) {
      this.currentPageIndex = e.mp.detail.current
    },
    animationfinish (e) {
      this.currentPageIndex = e.mp.detail.current
    }
  }
}
</script>
<style lang="less" scoped>
.banner {
  width: 100%;
  .banner-wrp {
    position: relative;
    .swiper {
      height: 190rpx;
      .swiper-item {
        padding: 0 10px;
        box-sizing: border-box;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;

        .slide-image {
          width: 100%;
          height: 100%;
          margin: 0 auto;
          border-radius: 6px;
        }
      }
    }

    .dots {
      display: flex;
      justify-content: center;
      position: absolute;
      bottom: 20rpx;
      width: 100%;
      .dot {
        width: 6px;
        height: 6px;
        margin: 0 4px;
        background: rgba(255, 255, 255, 1);
        opacity: 0.5;
        border-radius: 50%;
      }
      .disable {
        background-color: #fff;
        opacity: 1;
      }
    }
  }
}
</style>
