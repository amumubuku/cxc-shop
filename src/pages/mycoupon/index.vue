<template>
  <div class="my-coupon">
    <div class="coupon-wrp">
      <ul class="coupon-list" v-if="!couponType">
        <li class="item" v-for="(item, index) in couponList" :key="index">
          <div class="top">
            <div class="coupon-left">
              <p class="gift">会员红包</p>
              <p class="tip">有效期至 {{item.expire_time}}</p>
            </div>
            <div class="coupon-right">
              <div class="coupon-content">
                <div class="title">{{item.price}}</div>
                <div class="price">元</div>
              </div>
              <div class="tip">{{item.type ? '无门槛': '满' + item.threshold_price+ '元可用'}}</div>
            </div>
          </div>
          <div class="footer">
            <p>
             ·可与其它活动优惠同时享用，在线支付专享
            </p>
          </div>
        </li>
      </ul>
      <div class="shop-coupon" v-else>
        <li class="item" v-for="(item, index) in couponList" :key="index" @click="useCoupon(item)">
          <div class="top">
            <div class="coupon-left">
              <div class="shop-cover">
                <img :src="item.icon" alt />
              </div>
              <div class="coupon-info">
                <p class="gift">{{item.title}}</p>
                <div class="tag">同享券</div>
                <p class="tip">有效期至 {{item.expire_time}}</p>
              </div>
            </div>
            <div class="coupon-right">
              <div class="coupon-content">
                <div class="title">{{item.price}}</div>
                <div class="price">元</div>
              </div>
             <div class="tip">{{item.type ? '无门槛': '满' + item.threshold_price+ '元可用'}}</div>
            </div>
          </div>
          <div class="footer">
            <p>·可与其它活动优惠同时享用，在线支付专享</p>
            <div class="use-coupon">立即使用</div>
          </div>
        </li>
      </div>
    </div>
    <div class="null-coupon-box" v-if="couponList.length < 1">
      <div class="content-wrp">
         <div class="icon">
           <img src="https://img.icaixiaochu.com/%E8%B5%84%E6%BA%90%2012@2x%20%281%29.png" style="height:95px;width:114px" v-if="couponType" alt="">
          <img src="https://img.icaixiaochu.com/%E8%B5%84%E6%BA%90%203@2x%20%281%29.png" style="width:157px;heihgt:114px" v-else alt />
        </div>
        <p>{{couponType ? '你还没有代金券哦' : '你还没有红包哦'}}</p>
      </div>
    </div>
    <div class="invalid-coupon" @click="invalidCoupon">没有更多券了| 查看无效券</div>
  </div>
</template>

<script>
export default {
  components: {},

  data () {
    return {
      couponType: 0,
      couponList: []
    }
  },
  methods: {
    invalidCoupon () {
      wx.navigateTo({
        url: `../invalidCoupon/main?type=${this.couponType}`,
        success: result => {},
        fail: () => {},
        complete: () => {}
      })
    },
    useCoupon (item) {
      wx.navigateTo({
        url: `../shop/main?id=${item.shop_id}`,
        success: result => {},
        fail: () => {},
        complete: () => {}
      })
    },
    getCoupon () {
      let couponType = this.couponType ? 'coupon' : 'redPack'
      this.$http
        .post('/myCoupons', { is_platform: couponType, status: 'effective' })
        .then(res => {
          this.couponList = res.data
        })
    }
  },
  mounted () {
    this.couponType = parseInt(this.$root.$mp.query.type)
    wx.setNavigationBarTitle({
      title: this.couponType ? '商家代金券' : '叮叮点红包',
      success: result => {},
      fail: () => {},
      complete: () => {}
    })

    this.getCoupon()
  }
}
</script>
<style lang="less" >
@import "./style";
</style>

