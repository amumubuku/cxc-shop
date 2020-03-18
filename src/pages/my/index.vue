<template>
  <div class="my">
    <div class="head-top">
      <div class="bg" v-if="user"></div>
      <div class="user-wrp" @click="toLogin">
        <div class="user-cover">
          <img :src="user ? user.avatar_url : 'https://img.icaixiaochu.com/login-cover.png'" mode="widthFix" alt />
        </div>
        <div class="user-info">
          <p class="user-name">{{user ? user.nick_name : '登陆/注册'}}</p>
        </div>
      </div>
    </div>
    <div class="main-content">
      <div class="main-content-wrp">
        <div class="content-top">
          <div class="flex-left" @click="navTo('../mycoupon/main?type=0')">
            <div class="text-box">
              <p :class="{'un-active':!checkLogin}">叮叮点红包</p>
              <span class="num">
                <i style="font-size:21px;font-weight:700;padding-right:4px;">{{couponStatus.red_pack || 0}}</i> 张
              </span>
            </div>
            <div class="icon">
              <img src="../../../static/images/more.png" alt />
            </div>
          </div>
          <div class="flex-right" @click="navTo('../mycoupon/main?type=1')">
            <div class="text-box">
              <p :class="{'un-active':!checkLogin}">我的优惠券</p>
              <span class="num">
                <i style="font-size:21px;font-weight:700;padding-right:4px;">{{couponStatus.shop_coupon || 0}}</i> 张
              </span>
            </div>
            <div class="icon">
              <img src="../../../static/images/more.png" alt />
            </div>
          </div>
        </div>
        <div class="func-list">
          <div class="func-item" @click="navTo('../myaddress/main')">
            <div class="item-left">
              <img src="../../../static/images/location.png" alt mode="aspectFit" />
              <p :class="{'un-active':!checkLogin}">我的地址</p>
            </div>
            <div class="icon">
              <img src="../../../static/images/more.png" alt />
            </div>
          </div>
          <button class="func-item" open-type="contact" :disabled="!checkLogin">
            <div class="item-left">
              <img src="../../../static/images/kefu-icon.png" alt mode="aspectFit" />
              <p :class="{'un-active':!checkLogin}">客服中心</p>
            </div>
            <div class="icon">
              <img src="../../../static/images/more.png" alt />
            </div>
          </button>
          <div class="func-item" @click="navTo('../feedback/main')">
            <div class="item-left">
              <img src="../../../static/images/feedback.png" alt mode="aspectFit" />
              <p>意见反馈</p>
            </div>
            <div class="icon">
              <img src="../../../static/images/more.png" alt />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  components: {},
  data () {
    return {
      checkLogin: false,
      couponStatus: ''
    }
  },
  computed: {
    ...mapGetters(['user'])
  },

  methods: {
    navTo (url) {
      if (this.checkLogin) {
        wx.navigateTo({
          url,
          success: (result) => {

          },
          fail: () => {},
          complete: () => {}
        })
      } else {
        wx.navigateTo({
          url: `../login/main`,
          success: (result) => {

          },
          fail: () => {},
          complete: () => {}
        })
      }
    },
    toLogin () {
      wx.navigateTo({
        url: '../login/main',
        success: (result) => {

        },
        fail: () => {},
        complete: () => {}
      })
    },
    myInfo () {
      this.$http.post('/getCouponCount').then(res => {
        this.couponStatus = res.data
      })
    }

  },
  onShow () {
    this.checkLogin = !!wx.getStorageSync('token')
    if (this.checkLogin) {
      this.myInfo()
    }
  }
}
</script>
<style lang="less" scoped>
@import "./style";
</style>
