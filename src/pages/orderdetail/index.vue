<template>
  <div class="order-wrp" v-if="orderDetail">
    <div class="top">
      <div class="order-state">
        <div class="order-icon">
          <img :src="stateIcon" alt />
        </div>
        <p>{{orderDetail.status == 0? '待支付':orderDetail.status == 1? '已支付,等待买家发货':orderDetail.status == 2? '待收货': orderDetail.status == 3?'已完成':orderDetail.status == 4? '商家已接单':'已取消'}}</p>
      </div>
    </div>
    <div class="order-content">
      <div class="order-address" v-if="!orderDetail.delivery_type">
        <div class="address-des">
          <div class="order-icon">
            <img src="https://img.icaixiaochu.com/order-icon.png" alt />
          </div>
          <div class="addr-content">
            <div class="address-title">
              <div class="name">{{orderDetail.extends.shipping_name}}</div>
              <div class="phone">{{orderDetail.extends.tel}}</div>
            </div>
            <div class="but">{{orderDetail.extends.city}}{{orderDetail.extends.address}}</div>
          </div>
        </div>
      </div>
      <div class="map" v-if="orderDetail.delivery_type">
        <div class="head-wrp">
          <img class="location-icon" src="../../../static/images/location.png" alt />
          <p>{{orderDetail.shop.address}}</p>
        </div>
        <div class="content-wrp">
          <map
            id="map"
            :longitude="orderDetail.shop.lng"
            :latitude="orderDetail.shop.lat"
            scale="14"
            style="width: 100%; height: 100%;"
            :markers="markers"
          ></map>
        </div>
        <div class="fot-wrp">
          <div class="fot-wrp-left">
            <div class="box-time">
              <p class="text1">{{orderDetail.extends.time_take_self}}</p>
              <p class="text2">自取时间</p>
            </div>
            <div class="more">
              <img src="http://p2.icaixiaochu.com/more.png" alt />
            </div>
          </div>
          <div class="fot-wrp-right">
            <div class="box-phone">
              <p class="text1" >{{orderDetail.extends.tel}}</p>
              <p class="text2">预留电话</p>
            </div>
            <div class="more">
              <img src="http://p2.icaixiaochu.com/more.png" alt />
            </div>
          </div>
        </div>
      </div>
      <div class="refunded" @click="refundedDetail" v-if="orderDetail.refund">
        <p>退款详情</p>
        <div>
          <span :class="{color:refundState}">{{refundText}}</span>
          <img src="https://img.icaixiaochu.com/more.png" alt />
        </div>
        <div class="tip-icon"></div>
      </div>
      <div class="food-content">
        <div class="order-top">
          <div class="flex-left">
            <img :src="orderDetail.shop.icon" alt />
            <p class="shop-name">{{orderDetail.shop.title}}</p>
          </div>
          <div class="flex-right">
            <p>预计{{orderDetail.time_delivery}}送达</p>
            <img src="http://p2.icaixiaochu.com/more.png" alt />
          </div>
        </div>
        <div class="order-foods">
          <collapse :selected="true" :goods="orderDetail.goods"></collapse>
        </div>
      </div>
      <div class="order-bast-info-area">
        <div class="order-des">
          <div class="order-title">订单信息</div>
          <div class="order-id">订单编号：{{orderDetail.order_no}}</div>
          <div class="order-create-time">创建时间：{{orderDetail.create_at}}</div>
        </div>
      </div>
      <div class="order-price-info">
        <div class="fee-info">
          <div class="item">
            <p class="label">包装费</p>
            <span>{{orderDetail.packing_price}}</span>
          </div>
          <div class="item">
            <p class="label">配送费</p>
            <span>{{orderDetail.extends.shipping_fee}}</span>
          </div>
        </div>
        <div class="coupon-info">
          <div class="item">
            <p class="label">叮叮点红包</p>
            <span>{{orderDetail.extends.red_pack_money}}</span>
          </div>
          <div class="item">
            <p class="label">商家代金券</p>
            <span>{{orderDetail.extends.coupon_money}}</span>
          </div>
        </div>
        <div class="has-gift" v-if="orderDetail.has_gift">
          <div class="gift-content">
            <div class="coupon-card-icon">
              <img src="https://img.icaixiaochu.com/red-cred-icon.png" alt />
            </div>
            <div class="coupon-card-info">
              <p class="title">优惠券礼包</p>
              <p class="des" style="padding:3px;">购买后可得30元礼包，本单已用5元</p>
            </div>
          </div>
          <div class="has-choose">
            <img src="https://img.icaixiaochu.com/121.png" alt />
          </div>
        </div>
        <div class="order-total-price">
          <p class="tip">合计:</p>
          <p class="price">¥{{orderDetail.money_pay}}</p>
        </div>
      </div>
      <div class="order-footer">
        <div class="note">
          订单备注:
          <span
            style="color:rgba(0,0,0,.5);padding-left:6px;"
          >{{orderDetail.extends.remark ? orderDetail.extends.remark :'无'}}</span>
        </div>
        <div class="feedback-msg">如果收到的商品出现质量、错发、漏发等情况可联系客服</div>
      </div>
    </div>

    <div class="order-handle-area">
      <div
        class="kefu-btn"
        v-if="(orderDetail.refund && orderDetail.refund.refund_status > 1) || orderDetail.status ===5 || orderDetail.status ===3"
      >
        <p @click="makePhone">联系客服</p>
      </div>
      <div class="order-wrp-state" v-else>
        <div
          class="left-button"
          @click="cancelRefunded"
          v-if="(orderDetail.refund && orderDetail.refund.refund_status===0) && orderDetail.status"
        >撤销退款申请</div>
        <div
          class="left-button"
          @click="orderHandle"
          v-else
        >{{orderDetail.status && orderDetail.status !=5?'申请退款':'取消订单'}}</div>
        <div class="right-button">
          <div class="parment" @click="payment" v-if="orderDetail.status ===0">
            <p>去支付</p>
            <img src="https://img.icaixiaochu.com/more-icon.png" alt />
          </div>
          <p v-else @click="makePhone">联系商家</p>
        </div>
      </div>
    </div>
    <popup ref="optOnCancel" type="bottom" className="opt-oncancel">
      <div class="options-list">
        <div
          class="opt-item"
          v-for="(item, index) in causes"
          :key="index"
          @click="selectCause(item)"
        >{{item.title}}</div>
        <div class="cancel" @click="cancel">取消</div>
      </div>
    </popup>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import Collapse from '@/components/collapse'
import popup from '@/components/popup'
export default {
  components: { Collapse, popup },
  data () {
    return {
      orderId: '',
      orderDetail: '',
      fee: '',
      causes: [],
      causeId: '',
      causeTitle: '',
      coupons: [],
      markers: [
        {
          iconPath:
            'https://hbimg.huabanimg.com/b4446d67ed140d12259658a5c30f65f6b4992d8a9cc9-towM5u',
          id: 0,
          latitude: 0,
          longitude: 0,
          width: 34,
          height: 34,
          callout: {
            content: '日记传承特色牛奶甜品',
            color: '#000000',
            display: 'ALWAYS'
          }
        }
      ]
    }
  },

  computed: {
    stateIcon () {
      let orderState = this.orderDetail.status
      return orderState === 0
        ? 'http://p2.icaixiaochu.com/3q60ua1hd1r4Hczi.png'
        : orderState === 1
          ? 'http://p2.icaixiaochu.com/pJhA7sAoC5bZEqab.png'
          : orderState === 2
            ? 'http://p2.icaixiaochu.com/peisongzhong.png'
            : orderState === 3
              ? 'http://p2.icaixiaochu.com/PZAElTLByI7WZW6d.png'
              : orderState === 4
                ? 'http://p2.icaixiaochu.com/pJhA7sAoC5bZEqab.png'
                : 'http://p2.icaixiaochu.com/cancel.png'
    },
    refundState () {
      if (this.orderDetail.refund) {
        let state = this.orderDetail.refund.refund_status
        /**
         * fail #FD5200
         * wait #5DB6FA
         * success #4FBC4F
         * other #787878
         */
        return state === 0
          ? '#4FBC4F'
          : state === 1
            ? '#5DB6FA'
            : state === 2
              ? '#FD5200'
              : ''
      }
      return ''
    },
    refundText () {
      if (this.orderDetail.refund) {
        let state = this.orderDetail.refund.refund_status
        return state === 0
          ? '等待商家处理'
          : state === 1
            ? '退款成功'
            : state === 2
              ? '商家拒绝退款'
              : '自主撤销申请'
      }
      return ''
    }
  },
  onUnload () {
    Object.assign(this, this.$options.data())
  },
  methods: {
    makePhone () {
      wx.makePhoneCall({
        phoneNumber: this.orderDetail.shop.tel,
        success: (result) => {

        },
        fail: () => {},
        complete: () => {}
      })
    },
    previewImage () {
      wx.previewImage({
        current: 'https://img.icaixiaochu.com/address-map.png', // 当前显示图片的http链接
        urls: ['https://img.icaixiaochu.com/address-map.png'] // 需要预览的图片http链接列表
      })
    },
    selectCause (item) {
      this.causeId = item.id
      this.causeTitle = item.title
      this.$http
        .post('/cancelOrder', {
          cancel_id: this.causeId,
          order_id: this.orderId
        })
        .then(res => {
          if (res.status) {
            wx.navigateBack({ changed: true })
          }
        })
    },
    orderHandle () {
      if (this.orderDetail.status) {
        wx.navigateTo({
          url: `../refunded/main?id=${this.orderId}`,
          success: result => {},
          fail: () => {},
          complete: () => {}
        })
      } else {
        this.$http.post('/fetchCancelCause').then(res => {
          this.causes = res.data
          this.$refs.optOnCancel.toggle('show')
        })
      }
    },
    refundedDetail () {
      wx.navigateTo({
        url: `../refundedDetail/main?id=${this.orderId}`,
        success: result => {},
        fail: () => {},
        complete: () => {}
      })
    },
    cancelRefunded () {
      let _this = this
      let refundId = this.orderDetail.refund.refund_id
      wx.showModal({
        title: '确认撤销退款申请',
        content: '撤销后，将无法再次申请',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#797979',
        confirmText: '确定',
        confirmColor: '#FEA835',
        success: result => {
          if (result.confirm) {
            _this.$http
              .post('/repealApply', { refund_id: refundId })
              .then(res => {
                _this.getOrderDetail()
              })
          }
        },
        fail: () => {},
        complete: () => {}
      })
    },
    cancel () {
      this.$refs.optOnCancel.toggle('hide')
    },
    payment () {
      let _this = this
      this.$http
        .post('/repay', {
          order_id: this.orderDetail.order_id
        })
        .then(res => {
          let result = res.data
          wx.requestPayment({
            timeStamp: result.timestamp.toString(),
            nonceStr: result.nonceStr,
            package: result.package,
            signType: 'MD5',
            paySign: result.paySign,
            success: function (res) {
              _this.getOrderDetail()
              _this.emptyCart(_this.orderDetail.shop_id)
            },
            fail: function (res) {
              wx.showToast({
                title: '取消支付',
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
          })
        })
    },
    getOrderDetail () {
      this.$http.post('/orderDetail', { order_id: this.orderId }).then(res => {
        if (res.data.shop) {
          this.markers[0].callout.content = res.data.shop.title
          this.markers[0].iconPath = res.data.shop.icon
        }
        let PackingPrice = 0
        res.data.goods.forEach(element => {
          PackingPrice += element.packing_price
        })
        res.data.packing_price = PackingPrice
        this.orderDetail = res.data
        wx.stopPullDownRefresh()
      })
    },
    ...mapMutations({
      emptyCart: 'EMPTY_CART'
    })
  },
  onShow () {
    this.orderId = this.$root.$mp.query.id
    this.getOrderDetail()
  },
  onPullDownRefresh () {
    this.getOrderDetail()
  }
}
</script>
<style lang="less" >
@import "./style.less";
</style>
