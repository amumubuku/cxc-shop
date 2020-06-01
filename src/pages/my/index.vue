<template>
  <div class="my">
    <div class="head-top">
      <img
        src="/static/my/user-bg.png"
        class="user-bg"
        mode="aspectFill"
        alt=""
      />
      <div class="user-wrp" @click="toLogin">
        <div class="user-cover">
          <img src="/static/my/avatar-bg.png" class="user-bg" mode="widthFix" alt="">
          <img :src="user ? user.avatar_url : '/static/my/user-avatar.png'" class="user-icon" mode="widthFix" alt />
        </div>
        <div class="user-info">
          <p class="user-name">{{ user ? user.nick_name : "点击登录" }}</p>
          <p class="des">{{ user ? "再忙，也要记得吃饭哟" : "登录更精彩" }}</p>
        </div>
      </div>
      <div class="coupon-wrap">
        <div class="red-pack" @click="navTo('../mycoupon/main?type=0')">
          <p class="title">叮叮代金券</p>
          <p class="num">{{ couponStatus.red_pack || 0 }}</p>
        </div>
        <div class="coupon" @click="navTo('../mycoupon/main?type=1')">
          <p class="title">我的优惠券</p>
          <p class="num">{{ couponStatus.shop_coupon || 0 }}</p>
        </div>
      </div>
    </div>

    <div class="member-box" @click="handleView">
      <img
        src="https://img.icaixiaochu.com/new-coupon-bg.png"
        class="member-bg"
        mode="aspectFill"
        alt=""
      />
      <!-- <div class="left">
        <div class="title">
          <p>平台尊享</p>
          <img src="" alt="" />
        </div>
        <div class="des">开通后每单立减<span>2</span> 元，不限商家</div>
      </div>
      <div class="right">
        0.1元开通
      </div> -->
      <div class="tip-box">
        开发中
      </div>
    </div>
    <div class="views">
      <div class="view-item" v-for="(item, index) in views" :key="index">
        <div class="title">{{ item.title }}</div>
        <div class="view-list">
          <div class="view" v-for="(ele, k) in item.view" :key="k" @click="handleView(ele)">
            <img :src="ele.icon" mode="aspectFill" :class="index === 0 ? 'small' : 'mini'" alt="" />
            <p>{{ ele.name }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="login-out" v-if="user" @click="loginOut">
      退出登录
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  components: {},
  data () {
    return {
      checkLogin: false,
      couponStatus: '',
      views: [
        {
          title: '常用功能',
          view: [
            {
              name: '邀请有礼',
              icon: '/static/my/icon_1.png',
              path: '',
              type: 0
            },
            {
              name: '我的评价',
              icon: '/static/my/icon_2.png',
              path: '',
              type: 0
            },
            {
              name: '我的收藏',
              icon: '/static/my/icon_3.png',
              path: '',
              type: 0
            },
            {
              name: '地址管理',
              icon: '/static/my/icon_4.png',
              path: '../myaddress/main',
              type: 0
            }
          ]
        },
        {
          title: '更多服务',
          view: [
            {
              name: '联系客服',
              icon: '/static/my/icon_5.png',
              path: '',
              type: 0
            },
            {
              name: '意见反馈',
              icon: '/static/my/icon_6.png',
              path: '../feedback/main',
              type: 0
            },
            {
              name: '骑手求职',
              icon: '/static/my/icon_7.png',
              path: '',
              type: 0
            },
            {
              name: '商家入驻',
              icon: '/static/my/icon_8.png',
              path: '',
              type: 0
            },
            {
              name: '加盟合作',
              icon: '/static/my/icon_9.png',
              path: '',
              type: 0
            },
            {
              name: '差价举报',
              icon: '/static/my/icon_10.png',
              path: '',
              type: 0
            },
            {
              name: '关于我们',
              icon: '/static/my/icon_11.png',
              path: '',
              type: 0
            }
          ]
        }
      ]
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
          success: (result) => {},
          fail: () => {},
          complete: () => {}
        })
      } else {
        this.toLogin()
      }
    },
    loginOut () {
      wx.showModal({
        title: '提示',
        content: '确定退出登录么？',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {
          if (result.confirm) {
            this.LoginOut()
          }
        },
        fail: () => {},
        complete: () => {}
      })
    },
    handleView (item) {
      console.log(item)
      if (item.path) {
        wx.navigateTo({
          url: item.path
        })
      } else {
        wx.showToast({
          title: '功能开发中...',
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
    toLogin () {
      wx.navigateTo({
        url: '../login/main',
        success: (result) => {},
        fail: () => {},
        complete: () => {}
      })
    },
    myInfo () {
      this.$http.post('/getCouponCount').then((res) => {
        this.couponStatus = res.data
      })
    },
    ...mapMutations({
      setCityname: 'SET_CITYNAME',
      setCity: 'SET_CITY',
      setAddress: 'SET_ADDRESS',
      LoginOut: 'LOGIN_OUT'
    })
  },
  onShow () {
    this.checkLogin = !!wx.getStorageSync('token')
    if (this.checkLogin) {
      this.myInfo()
    }
  }
}
</script>
<style lang="less">
@import "./style";
</style>
