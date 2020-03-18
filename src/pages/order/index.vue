<template>
  <div class="order">
    <div class="nav">
      <div
        class="nav-item"
        @click="changeCur(index)"
        v-for="(item, index) in navlist"
        :key="index"
      >
        <p :class="{'active':currentIndex === index}">{{item.text}}</p>
        <i class="tag" v-if="currentIndex === index"></i>
      </div>
    </div>
    <div class="order-wrp" v-if="checkLogin">
      <ul class="order-list">
        <li
          class="order-item"
          v-for="(item, index) in orderList"
          :key="index"
        >
          <div class="top" @click="toShopPage(item)">
            <div class="shop-cover">
              <img :src="item.icon" alt />
            </div>
            <div class="guide-right">
              <div class="shop-msg">
                <div class="shop-name">{{item.title}}</div>
                <div class="shop-icon">
                  <img src="../../../static/images/more.png" alt />
                </div>
              </div>
              <div
                class="order-state"
                v-if="item.refund_status!=null"
                :style="{color:item.refund_status==0 ? '#F4BA1C' : item.refund_status ==1 ? '#4FBC4F': item.refund_status == 2 ? '#FF5B34': '#A5A5A5'}"
              >{{item.refund_status == 0 ? '等待商家处理' : item.refund_status == 1 ? '退款成功':item.refund_status == 2 ?'拒绝退款': '撤销退款' }}</div>
              <div
                v-else
                class="order-state"
                :style="{color:item.status ==0 ? '#F4BA1C': item.status == 1 ? '#FF5B34':item.status == 2?'#1E87FF': item.status ==3 ? '#FF5B34' : '#787878'}"
              >{{item.status == 0? '待支付':item.status == 1? '待商家发货':item.status == 2? '待收货': item.status == 3?'订单已完成':item.status == 4? '商家已接单':'已取消'}}</div>
            </div>
          </div>
          <div class="order-foods" @click.stop="orderDetail(item)">
            <div class="food-item" v-for="(food, k) in item.goods" :key="k">
              <div class="food-name">{{food.goods_title}}</div>
              <div class="food-num">X{{food.number}}</div>
            </div>
          </div>
          <div class="footer">
            <p>共{{item.goods.length}}件商品，实付{{item.money_pay}}元</p>
            <div class="order-btn-area">
              <!-- <div class="btn" v-if="item.status===3">再来一单</div> -->
              <div
                class="order-botton"
                @click="orderHandle(item)"
              >{{ item.refund_status !==null ? '退款详情' :item.status == 0? '待支付':item.status == 1 || item.is_evaluated? '查看详情':item.status == 2? '确认收货': item.status == 3?'去评论':item.status == 4? '商家已接单':'查看详情'}}</div>
            </div>
          </div>
        </li>
      </ul>
      <div class="orderNull"  v-if="!orderList.length && loadingStatus">
        <div class="content-wrp">
          <div class="icon">
            <img src="https://img.icaixiaochu.com/%E8%B5%84%E6%BA%90%2010@2x.png" alt />
          </div>
          <p>{{couponText}}</p>
        </div>
      </div>
    </div>
    <div class="login-wrp" v-else>
      <div class="login-icon">
        <img src="https://img.icaixiaochu.com/%E8%B5%84%E6%BA%90%2011@2x.png"  alt />
      </div>
      <p>您还没有登录，请登录后查看订单</p>
      <div class="login-btn" @click="toLogin">登陆</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      currentIndex: 0,
      checkLogin: false,
      navlist: [
        {
          text: '全部订单',
          index: 0
        },
        {
          text: '待评价',
          index: 1
        },
        {
          text: '退款',
          index: 2
        }
      ],
      orderList: [],
      page: 1,
      loading: false,
      loadingStatus: false
    }
  },
  computed: {
    couponText () {
      return this.currentIndex === 0
        ? '一个订单都没有，去逛逛吧'
        : this.currentIndex === 1
          ? '暂无待评价订单'
          : '暂无退款订单'
    }
  },
  methods: {
    orderHandle (item) {
      // {{item.status == 0? '待支付':item.status == 1? '已支付':item.status == 2? '待收货': item.status == 3?'订单已完成':item.status == 4? '商家已接单':'已取消'}}
      let serverHandle = {
        2: item => {
          wx.showModal({
            title: '',
            content: '请确认商品无误',
            showCancel: true,
            cancelText: '取消',
            cancelColor: '#000000',
            confirmText: '确定',
            confirmColor: '#3CC51F',
            success: result => {
              if (result.confirm) {
                this.successOrder(item)
              }
            },
            fail: () => {},
            complete: () => {}
          })
        },
        3: item => {
          if (item.is_evaluated) {
            wx.navigateTo({
              url: `../orderdetail/main?id=${item.order_id}`,
              success: result => {},
              fail: () => {},
              complete: () => {}
            })
          } else {
            wx.navigateTo({
              url: `../comments/main?shop=${JSON.stringify(item)}`,
              success: result => {},
              fail: () => {},
              complete: () => {}
            })
          }
        }
      }
      if (item.refund_status != null) {
        wx.navigateTo({
          url: `../refundedDetail/main?id=${item.order_id}`,
          success: result => {},
          fail: () => {},
          complete: () => {}
        })
        return
      }
      let callback = serverHandle[item.status]
      if (callback) {
        callback(item)
      } else {
        wx.navigateTo({
          url: `../orderdetail/main?id=${item.order_id}`,
          success: result => {},
          fail: () => {},
          complete: () => {}
        })
      }
    },
    toShopPage (item) {
      wx.navigateTo({
        url: `../shop/main?shopId=${item.shop_id}`,
        success: (result) => {

        },
        fail: () => {},
        complete: () => {}
      })
    },
    successOrder (item) {
      this.$http.post('/takeGoods', { order_id: item.order_id }).then(res => {
        this.getOrderList()
      })
    },
    orderDetail (item) {
      wx.navigateTo({
        url: `../orderdetail/main?id=${item.order_id}`,
        success: result => {},
        fail: () => {},
        complete: () => {}
      })
    },
    toLogin () {
      wx.navigateTo({
        url: '../login/main',
        success: result => {},
        fail: () => {},
        complete: () => {}
      })
    },
    getOrderList () {
      let status =
        this.currentIndex === 0
          ? 'all'
          : this.currentIndex === 1
            ? 'waitEvaluate'
            : 'refund'
      this.$http.post('/myOrders', { status, page: this.page }).then(res => {
        this.loadingStatus = true
        if (res.data.length) {
          this.orderList = this.orderList.concat(res.data)
          wx.stopPullDownRefresh()
          return
        }
        this.loading = true
        if (this.orderList.length) {
          wx.showToast({
            title: '没有更多订单了',
            icon: 'none',
            image: '',
            duration: 1500,
            mask: false,
            success: result => {},
            fail: () => {},
            complete: () => {}
          })
        }
      })
    },
    changeCur (index) {
      this.currentIndex = index
      this.orderList = []
      this.page = 1
      this.loading = false
      this.loadingStatus = false
      this.getOrderList()
    }
  },
  onShow () {
    this.orderList = []
    let _this = this
    wx.getStorage({
      key: 'token',
      success (res) {
        _this.checkLogin = !!res.data
        _this.getOrderList()
      }
    })
  },
  onReachBottom () {
    if (!this.loading) {
      this.page++
      this.fetchShopList()
    }
  },
  onPullDownRefresh () {
    this.page = 1
    this.orderList = []
    this.getOrderList()
  }
}
</script>
<style lang="less" >
@import "./style";
</style>
