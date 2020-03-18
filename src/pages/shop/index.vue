<template>
  <div class="shop">
    <div class="head-top">
      <div class="shop-content" @click="showShopInfo">
        <div class="flex-left">
          <img :src="shopInfo.icon" alt />
        </div>
        <div class="flex-right">
          <div class="shop-name">{{shopInfo.title}}</div>
          <div class="fee-tiem">
            <img src="../../../static/images/fee-time.png" alt />
            <p>配送时间约{{shopInfo.delivery_time}}分钟</p>
          </div>
          <div class="shop-msg">公告: {{shopInfo.announcement}}</div>
          <div class="shop-tag-list">
            <div
              class="tag-item"
              v-for="(item, index) in shopInfo.label"
              :key="index"
              :style="{background:item.title_color}"
            >{{item.title}}</div>
          </div>
        </div>
      </div>
      <div class="shop-coupon-list" v-if="shopInfo && shopInfo.coupons.length">
        <div
          class="shop-coupon-item"
          v-for="(item, index) in shopInfo.coupons"
          :key="index"
          @click="ReceiveCoupon(item,index)"
        >
          <p class="coupon-price">￥{{item.price}}</p>
          <p class="title">领取</p>
        </div>
      </div>
      <div class="nav">
        <div class="nav-list">
          <div class="nav-item" @click="navIndex = 0">
            <p>菜单</p>
            <p class="nav-active" v-if="navIndex === 0"></p>
          </div>
          <div class="nav-item" @click="navIndex = 1">
            <p>评价</p>
            <p class="nav-active" v-if="navIndex === 1"></p>
          </div>
          <div class="nav-item" @click="navIndex = 2">
            <p>商家</p>
            <p class="nav-active" v-if="navIndex === 2"></p>
          </div>
        </div>
        <div class="search" @click="searchFood">
          <div class="search-btn">搜索</div>
        </div>
      </div>
    </div>
    <swiper
      class="content"
      :duration="50"
      @change="swiperChange"
      :current="navIndex"
      :style="{height:swiperHeight + 'px'}"
    >
      <swiper-item class="food-wrp">
        <div class="menu-nav-list">
          <scroll-view
            scroll-y="true"
            style="height:100%;"
            scroll-with-animation="true"
            :scroll-into-view="menuId"
          >
            <div
              class="menu-item"
              v-for="(item, index) in cart"
              :key="index"
              :class="{'active':index === menuIndex}"
              @click="chooseMenu(index)"
              :id="'menu' + index"
            >
              <p>{{item.title}}</p>
              <span class="menu-num" v-if="item.count">{{item.count}}</span>
              <div class="menu-tag" v-if="menuIndex === index"></div>
            </div>
          </scroll-view>
        </div>
        <div class="menu-food">
          <scroll-view
            scroll-y="true"
            class="food-scroll"
            :scroll-top="scrollTop"
            @scroll="foodScroll"
            scroll-with-animation="true"
          >
            <ul class="food-list" v-for="(item, index) in cart" :key="index" :height="index">
              <!-- <div class="category-title">{{item.title}}</div> -->
              <li
                class="food-item"
                v-for="(food, foodIndex) in item.goods"
                :key="foodIndex"
                ref="foodItem"
                @click="foodPopup(food,0,index)"
              >
                <div class="food-cover">
                  <img :src="food.cover" lazy-load="true" alt />
                </div>
                <div class="food-content">
                  <div class="food-top">
                    <p class="food-name">{{food.title}}</p>
                    <!-- <p class="food-sold">月售{{food.sold}}份</p> -->
                    <p class="food-des">{{food.description}}</p>
                  </div>
                  <div class="shop-tag-list">
                    <div
                      class="tag-item"
                      style="color: #FA7B5D;border-color: #FA7B5D}"
                      v-if="food.discount && food.discount.price_value"
                    >{{food.discount.price_value}}折</div>
                    <div
                      class="tag-item"
                      style="color: #FF9F1E;border-color: #FF9F1E}"
                      v-if="food.discount && food.discount.limit_num"
                    >限{{food.discount.limit_num}}份特惠</div>
                  </div>
                  <div class="footer-area" v-if="food.sku.length">
                    <div class="food-price">
                      <span class="tip">￥</span>
                      <p class="price">{{food.sku[0].price}}</p>
                      <p class="normal-price" v-if="food.discount">￥{{food.sku[0].original_price}}</p>
                    </div>
                    <div class="btn-area">
                      <div class="cart-button" v-if="food.sku.length < 2">
                        <div
                          class="reduct extend"
                          @click.stop="reduceCart(food,foodIndex)"
                          v-if="food.count"
                        >
                          <img src="../../../static/images/reduct-cart.png" alt />
                        </div>
                        <div class="food-num" v-if="food.count">{{food.count}}</div>
                        <div class="add extend" @click.stop="addCart(food,foodIndex)">
                          <img src="../../../static/images/add-cart.png" alt />
                        </div>
                      </div>
                      <div class="choose-sku-area" @click.stop="foodPopup(food,1,foodIndex)" v-else>
                        <p class="title">选规格</p>
                        <p class="tip" v-if="food.count">{{food.count}}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </scroll-view>
        </div>
      </swiper-item>
      <swiper-item class="comment-wrp">
        <scroll-view scroll-y="true" style="height:100%;">
          <comment :shopinfo="shopInfo" ref="comment" />
        </scroll-view>
      </swiper-item>
      <swiper-item class="shop-wrp">
        <shop :shopinfo="shopInfo" />
      </swiper-item>
    </swiper>
    <cart-foodlist :shopinfo="shopInfo" v-if="shopInfo" @submit="initCart" :foodList="cartList"></cart-foodlist>
    <div class="shop-modal-wrapper">
      <popup ref="shopModal">
        <div class="shop-popup-wrp">
          <div class="top">{{shopInfo.title}}</div>
          <div class="shop-coupon-wrp" v-if="shopInfo.coupons && shopInfo.coupons.length">
            <div class="head-title">代金券</div>
            <scroll-view scroll-x="true" style="width:100%;">
              <div class="shop-coupon-list">
                <div
                  class="shop-coupon-item"
                  v-for="(item, index) in shopInfo.coupons"
                  :key="index"
                >
                  <div class="shop-coupon-top">
                    <div class="price">
                      <p style="font-size:30px">{{item.price}}</p>
                      <p>元</p>
                    </div>
                    <p class="use-coupon">立即使用</p>
                  </div>
                  <p class="title">满{{item.threshold_price}}可用</p>
                  <p class="time">有效期至 {{item.expired_time}}</p>
                </div>
              </div>
            </scroll-view>
          </div>
          <div class="content-box">
            <div class="itme">
              <h3 class="title">优惠</h3>
              <div class="des">
                <div class="tip">折</div>
                <p>折扣商品7.43折起</p>
              </div>
              <div class="des">
                <div class="tip" style="background:#5DB6FA;">新</div>
                <p>折扣商品7.43折起</p>
              </div>
            </div>
            <div class="itme">
              <h3 class="title">优惠</h3>
              <p
                style="padding-bottom:4px"
              >起送：{{shopInfo.price_send}}元 | 免配送费 | {{shopInfo.delivery_time}}分钟</p>
              <p style="padding-bottom:4px">配送时间：{{shopInfo.business_hours}}</p>
            </div>
            <div class="itme" style="border:none">
              <h3 class="title">公告</h3>
              <p>{{shopInfo.announcement}}</p>
            </div>
          </div>
        </div>
      </popup>
    </div>
    <select-food ref="selectModal"></select-food>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import foodList from '@/components/common/food-list'
import cartFoodlist from '@/components/common/cart-foodlist'
import buyCart from '@/components/common/buy-cart'
import selectFood from '@/components/common/select-food'
import popup from '@/components/popup'
import comment from './comment'
import shop from './shop'
import { formatTime } from '@/utils/index'
export default {
  components: {
    buyCart,
    foodList,
    comment,
    shop,
    popup,
    cartFoodlist,
    selectFood
  },

  data () {
    return {
      menuIndex: 0,
      menuNum: [],
      shopId: 1,
      shopListTop: [1],
      scrollTop: 0,
      scrollId: 'scroll0',
      menuId: '',
      windowHeight: '',
      menuPercent: '',
      foodHeight: 110,
      menuHeight: 0,
      navIndex: 0,
      mentListHeight: 10,
      pageHeight: 0,
      pageWidth: 0,
      shopInfo: '',
      skuIndex: 0,
      skuNum: 1,
      swiperHeight: 0,
      scrollHeight: 0
    }
  },
  onUnload () {
    this.UPTATE_CART(formatTime(new Date()))
    Object.assign(this, this.$options.data())
  },
  computed: {
    ...mapGetters(['cart', 'food'])
  },
  methods: {
    addCart (food, index) {
      let num = food.sku[0].num
      let stock = food.sku[0].stock
      if (stock < 1 || num > stock) {
        wx.showToast({
          title: '商品库存不足',
          icon: 'none',
          image: '',
          duration: 1500,
          mask: false,
          success: result => {},
          fail: () => {},
          complete: () => {}
        })
        return
      }
      if (food.min_buy > 1 && num === 0) {
        wx.showToast({
          title: `商品最小购买${food.min_buy}份`,
          icon: 'none',
          image: '',
          duration: 1500,
          mask: false,
          success: result => {},
          fail: () => {},
          complete: () => {}
        })
        num = food.min_buy
      } else {
        ++num
      }
      this.ADD_CART({ index: food.index, foodIndex: index, num, skuIndex: 0 })
    },
    reduceCart (food, index) {
      let count = 0
      let num = food.sku[0].num
      if (num > food.min_buy) {
        count = num - 1
      } else {
        count = num - food.min_buy
      }

      this.ADD_CART({
        index: food.index,
        foodIndex: index,
        num: count,
        skuIndex: 0
      })
    },
    ReceiveCoupon (item, index) {
      this.$http.post('/getCoupon', { coupon_id: item.id }).then(res => {
        if (res.status) {
          wx.showToast({
            title: '领取成功',
            icon: 'none',
            image: '',
            duration: 1500,
            mask: false,
            success: result => {},
            fail: () => {},
            complete: () => {}
          })
          this.shopInfo.coupons = this.shopInfo.coupons.splice(index, 1)
          if (!this.shopInfo.coupons.length) {
            this.getNodeHeight()
          }
        }
      })
    },
    foodPopup (food, type, index) {
      if (food.sku.length) {
        this.$refs.selectModal.showSelect({ ...food }, type, this.shopId, index)
      }
    },
    searchFood () {
      wx.showToast({
        title: '更功能暂无开放',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
        success: result => {},
        fail: () => {},
        complete: () => {}
      })

      // wx.navigateTo({
      //   url: `../search/main?shopDetail=${JSON.stringify(this.shopInfo)}`,
      //   success: result => {},
      //   fail: () => {},
      //   complete: () => {}
      // })
    },
    showShopInfo () {
      this.$refs.shopModal.toggle('show')
    },
    swiperChange (e) {
      this.navIndex = e.mp.detail.current
      if (this.navIndex) {
        this.$refs.comment.getCommentList()
      }
    },
    chooseMenu (index) {
      this.scrollTop = this.shopListTop[index]
      this.menuIndex = index
    },
    foodScroll (e) {
      let scrollTop = e.mp.detail.scrollTop
      this.shopListTop.forEach((element, index) => {
        if (Math.abs(scrollTop) >= element) {
          this.menuIndex = index
        }
      })
    },
    initCart (data) {
      this.INIT_CART({
        shopId: this.shopInfo.id,
        data,
        cover: this.shopInfo.icon,
        name: this.shopInfo.title,
        food: []
      })
    },
    shopDetail () {
      this.$http.post('/getShopDetail', { shop_id: this.shopId }).then(res => {
        this.shopInfo = res.data
        wx.setNavigationBarTitle({
          title: this.shopInfo.title
        })
      })
      this.shopGoods()
    },
    shopGoods () {
      this.$http.post('/fetchShopGoods', { shop_id: this.shopId }).then(res => {
        this.initCart(res.data)
        let height = 0
        setTimeout(() => {
          this.getNodeHeight()
          this.cart.forEach((ele, index) => {
            height += ele.goods.length * this.foodHeight
            this.shopListTop.push(height)
          })
        }, 172)
      })
    },
    getNodeHeight () {
      var query = wx.createSelectorQuery()
      query
        .select('.food-item')
        .boundingClientRect(res => {
          if (res) {
            this.foodHeight = res.height
          }
        })
        .exec()

      query
        .select('.head-top')
        .boundingClientRect(res => {
          if (res) {
            this.swiperHeight = this.pageHeight - res.height
          }
        })
        .exec()
      query
        .select('.menu-item')
        .boundingClientRect(res => {
          if (res) {
            this.menuHeight = res.height
            this.menuPercent = Math.floor(
              this.swiperHeight / this.menuHeight / 2
            )
          }
        })
        .exec()
      query
        .select('.food-scroll')
        .boundingClientRect(res => {
          this.scrollHeight = res.height - 44
        })
        .exec()
    },
    ...mapMutations(['INIT_CART', 'ADD_CART', 'REDUCT_CART', 'UPTATE_CART'])
  },
  mounted () {
    wx.getLocation({
      type: 'gcj02',
      altitude: false,
      success: result => {
        let location = {
          latitude: result.latitude,
          longitude: result.longitude
        }
        wx.setStorageSync('location', location)
      },
      fail: () => {
        this.authLocation = false
      },
      complete: () => {
        this.shopDetail()
      }
    })
    this.shopId = parseInt(this.$root.$mp.query.shopId)
    var _this = this
    wx.getSystemInfo({
      success: result => {
        _this.pageHeight = result.windowHeight
        _this.pageWidth = result.windowWidth
      },
      fail: () => {},
      complete: () => {}
    })
    this.getNodeHeight()
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
    }
    return {
      title: this.shopInfo.title,
      path: `pages/shop/main?shopId=${this.shopId}`
    }
  },
  watch: {
    menuIndex (newVal, oldVal) {
      this.menuId = `menu${
        newVal >= this.menuPercent ? newVal - (this.menuPercent - 1) : 0
      }`
    }
  }
}
</script>
<style lang="less" scoped>
@import "./style";
</style>
