<template>
  <div class="order">
    <scroll-view scroll-y="true" style="height:100%;">
      <div class="head-top">
        <div class="fee-content">
          <div class="switch">
            <div :class="curSwitch?'switch-state' : 'switch-state active'" @click="curSwitch = 0">
              <span>外卖配送</span>
              <div class="tag-icon" v-show="!curSwitch && shopDetail.is_arrival">
                <img src="https://img.icaixiaochu.com/arrow-icon-v1.png" alt />
              </div>
            </div>
            <div
              :class="curSwitch?'switch-state active' : 'switch-state '"
              @click="curSwitch = 1"
              v-if="shopDetail.is_arrival"
            >
              <span>到店自取</span>
              <div class="tag-icon" v-show="curSwitch">
                <img src="https://img.icaixiaochu.com/arrow-icon-v1.png" alt />
              </div>
            </div>
          </div>
          <div class="address-info" v-if="!curSwitch">
            <div class="address-des" v-if="address">
              <div class="order-icon">
                <img src="https://img.icaixiaochu.com/order-icon.png" alt />
              </div>
              <div class="addr-content">
                <div class="address-title">
                  <div class="name">{{address.name}}</div>
                  <div class="phone">{{address.tel}}</div>
                </div>
                <div class="but">{{address.city}}{{address.address}}</div>
              </div>
            </div>
            <div class="select-address" v-else @click="addAdr">
              <div class="order-icon">
                <img src="https://img.icaixiaochu.com/order-icon.png" alt />
              </div>
              <p>去添加地址</p>
            </div>
            <div class="more" @click="getAddressList">
              <img src="http://p2.icaixiaochu.com/more.png" alt />
            </div>
          </div>
          <div class="map" v-if="curSwitch">
            <div class="head-wrp">
              <img class="location-icon" src="../../../static/images/location.png" alt />
              <p>{{shopDetail.address}}</p>
            </div>
            <div class="content-wrp">
              <map
                id="map"
                :longitude="lng"
                :latitude="lat"
                scale="14"
                style="width: 100%; height: 100%;"
                :markers="markers"
              ></map>
            </div>
            <div class="fot-wrp">
              <div class="fot-wrp-left" @click="selectTime">
                <div class="box-time">
                  <p class="text1" style="color:#787878">{{delivery_time}}</p>
                  <p class="text2">自取时间</p>
                </div>
                <div class="more">
                  <img src="http://p2.icaixiaochu.com/more.png" alt />
                </div>
              </div>
              <div class="fot-wrp-right">
                <div class="box-phone">
                  <input type="text" v-model="tel" placeholder="手机号" />
                  <p class="text2">预留电话</p>
                </div>
                <div class="more">
                  <img src="http://p2.icaixiaochu.com/more.png" alt />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="food-content">
        <div class="order-top">
          <div class="flex-left">
            <img :src="shopDetail.icon" alt />
            <p class="shop-name">{{shopDetail.title}}</p>
          </div>
          <div class="flex-right" @click="selectTime" v-if="!curSwitch">
            <p>{{feeDateTip }}</p>
            <img src="http://p2.icaixiaochu.com/more.png" alt />
          </div>
        </div>
        <div class="order-foods">
          <collapse :selected="true" :goods="orderDetail.foods"></collapse>
        </div>
      </div>
      <div class="order-info">
        <div class="fee-list">
          <div class="item">
            <div class="left-text">包装费</div>
            <div class="right-text">￥{{orderDetail.packingPrice}}</div>
          </div>
          <div class="item">
            <div class="left-text">配送费</div>
            <div class="right-text">￥{{curSwitch ? 0 : shopDetail.shipping_fee}}</div>
          </div>
        </div>
        <div class="gift-list">
          <div class="item" @click="couponModal(0)" v-if="giftList">
            <div class="left-text">叮叮点红包</div>
            <div class="right-text">
              <p
                class="num"
                v-if="giftList.Effective.length && !selectGift "
              >{{giftList.Effective.length}}</p>
              <p class="tip">{{giftCouponTip}}</p>
              <div class="icon-arrow">
                <img src="http://p2.icaixiaochu.com/more.png" alt />
              </div>
            </div>
          </div>
          <div class="item" @click="couponModal(1)" v-if="shopCouponList">
            <div class="left-text">商家代金券</div>
            <div class="right-text">
              <p class="num" v-if="shopCouponList.num && !selectShopCoupon ">{{shopCouponList.num}}</p>
              <p class="tip">{{shopCouponTip}}</p>
              <div class="icon-arrow">
                <img src="http://p2.icaixiaochu.com/more.png" alt />
              </div>
            </div>
          </div>
        </div>
        <div class="coupon-card-gift" v-if="giftCard.status">
          <div class="card-flex-left">
            <div class="coupon-card-icon">
              <img src="https://img.icaixiaochu.com/red-cred-icon.png" alt />
            </div>
            <div class="coupon-card-info">
              <p class="title">{{giftCard.title}}</p>
              <p class="des" style="padding:3px;">{{giftCard.desc}}</p>
            </div>
          </div>
          <div class="vip-card-msg" v-if="cardState">
            <div class="content">红包已到账，请选择使用!</div>
            <div class="tag"></div>
          </div>
          <div class="card-flex-right" @click="toggleCardState">
            <p>¥{{giftCard.price}}</p>
            <img v-show="cardState" src="https://img.icaixiaochu.com/121.png" alt />
            <div v-show="!cardState" class="select-state"></div>
          </div>
        </div>
      </div>
      <div class="note">
        <div class="note-wrp">
          <span>订单备注</span>
          <input type="text" v-model="remark" placeholder="可输入备注，最多25字" maxlength="25" />
        </div>
        <p>如果收到的商品出现质量、错发、漏发等情况可联系客服</p>
      </div>
    </scroll-view>
    <div class="order-area-footer">
      <div class="submit-left">
        <div class="coupon-price">已优惠2.2</div>
        <div class="total">
          <div class="food-total">
            <p>合计:</p>
            <p>￥{{orderPrice < 0.1 ? 0.1:orderPrice}}</p>
          </div>
          <p class="menber-total" v-if="cardState">含会员开通费{{giftCard.price}}</p>
        </div>
      </div>
      <div class="submit-right" @click="createOrder">提交订单</div>
    </div>
    <popup ref="seleceNow" type="bottom">
      <div class="time-wrp">
        <div class="top">
          选择送达时间
          <div class="cancel" @click="hideSelect">
            <img src="https://img.icaixiaochu.com/cancel.png" alt />
          </div>
        </div>
        <div class="content">
          <div class="month">{{date}}</div>
          <div class="time-list" v-if="timelist">
            <picker-view
              class="picker-view"
              @change="pickerChange"
              indicator-class="picker-box"
              indicator-style="color: #FEBC65;"
              :value="pickerValue"
            >
              <picker-view-column>
                <div v-for="(item, index) in timelist" :key="index">
                  <span style="line-height: 34px">{{item}}</span>
                </div>
              </picker-view-column>
            </picker-view>
          </div>
        </div>
      </div>
    </popup>
    <popup ref="selectCoupon" type="bottom" className="select-coupon" v-if="giftList && shopCouponList">
      <div class="coupon-wrp">
        <div class="title">{{selectCouponType ? '商家代金卷' : '叮叮点红包'}}</div>
        <scroll-view scroll-y="true" class="scroll">
          <div class="gift-coupon-list" v-if="!selectCouponType">
            <div class="effective" v-if="giftList && giftList.Effective.length">
              <div class="divider">
                <p>
                  可使用红包
                  <span class="num">{{giftList.Effective.length}}</span>张
                </p>
              </div>
              <div class="coupon-list-wrap">
                <ul class="coupon-list">
                  <li
                    class="item"
                    v-for="(item, index) in giftList.Effective"
                    :key="index"
                    @click="selectCoupon(item)"
                  >
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
                      <p>· 限非到店自取订单使用</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div class="null-coupon" v-else>
              <img
                src="https://img.icaixiaochu.com/%E8%B5%84%E6%BA%90%2012@2x%20%281%29.png"
                style="height:95px;width:114px"
                v-if="selectCouponType"
                alt
              />
              <img
                src="https://img.icaixiaochu.com/%E8%B5%84%E6%BA%90%203@2x%20%281%29.png"
                style="width:157px;heihgt:114px"
                v-else
                alt
              />
              <p>{{selectCouponType ? '当前无可用商家代金券' : '当前无可用叮叮点红包'}}</p>
            </div>
            <div class="inval-coupon" v-if=" giftList && giftList.Inval.length">
              <div class="divider">
                <p>
                  不可用红包
                  <span class="num">{{giftList.Inval.length}}</span> 张
                </p>
              </div>

              <div class="coupon-list-wrap">
                <ul class="coupon-list">
                  <scroll-view scroll-y="true" style="height:320px;">
                    <li
                      class="item"
                      v-for="(item, index) in giftList.Inval"
                      :key="index"
                      style="opacity:0.7"
                      @click="selectCoupon(item)"
                    >
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
                          <div class="tip">满{{item.threshold_price}}元可用</div>
                        </div>
                      </div>
                      <div class="footer">
                        <p>· 限非到店自取订单使用</p>
                      </div>
                      <div class="coupon-label">
                        <img
                          class="location-icon"
                          :src="item.status === 2 ? 'https://img.icaixiaochu.com/un-use.png' : item.status===3 ? 'https://img.icaixiaochu.com/inval.png': ''"
                          alt
                        />
                      </div>
                    </li>
                  </scroll-view>
                </ul>
              </div>
            </div>
          </div>

          <div class="shop-coupon-list" v-else>
            <div class="effective" v-if="shopCouponList && shopCouponList.Effective.length">
              <div class="divider">
                <p>
                  可用红包
                  <span class="num">{{shopCouponList.Effective.length}}</span>张
                </p>
              </div>
              <li
                class="item"
                v-for="(item, index) in shopCouponList.Effective"
                :key="index"
                @click="selectCoupon(item)"
              >
                <div class="top">
                  <div class="coupon-left">
                    <div class="shop-cover">
                      <img :src="fetchAbleCoupon.shop.icon" alt />
                    </div>
                    <div class="coupon-info">
                      <p class="gift">{{fetchAbleCoupon.shop.title}}</p>
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
            <div class="null-coupon" v-else>
              <img
                src="https://img.icaixiaochu.com/%E8%B5%84%E6%BA%90%2012@2x%20%281%29.png"
                style="height:95px;width:114px"
                v-if="selectCouponType"
                alt
              />
              <img
                src="https://img.icaixiaochu.com/%E8%B5%84%E6%BA%90%203@2x%20%281%29.png"
                style="width:157px;heihgt:114px"
                v-else
                alt
              />
              <p>{{selectCouponType ? '当前无可用商家代金券' : '当前无可用叮叮点红包'}}</p>
            </div>
            <div class="inval-coupon" v-if="shopCouponList.Inval.length">
              <div class="divider">
                <p>
                  不可用待金券
                  <span class="num">{{shopCouponList.Inval.length}}</span>张
                </p>
              </div>
              <li
                class="item"
                v-for="(item, index) in shopCouponList.Inval"
                :key="index"
                style="opacity:.7"
                @click="selectCoupon(item)"
              >
                <div class="top">
                  <div class="coupon-left">
                    <div class="shop-cover">
                      <img :src="fetchAbleCoupon.shop.icon" alt />
                    </div>
                    <div class="coupon-info">
                      <p class="gift">{{fetchAbleCoupon.shop.title}}</p>
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
                </div>
                <div class="coupon-label">
                  <img
                    class="location-icon"
                    :src="item.status === 2 ? 'https://img.icaixiaochu.com/un-use.png' : item.status===3 ? 'https://img.icaixiaochu.com/inval.png': ''"
                    alt
                  />
                </div>
              </li>
            </div>
          </div>
        </scroll-view>
      </div>
      <div class="footer-btn" @click="unCoupon">不使用{{selectCouponType ? '商家红包' : '叮叮点红包'}}</div>
    </popup>
    <popup ref="selectAddress" type="bottom" className="select-address-wrp">
      <div class="address-wrp">
        <div class="top-area">我的收货地址</div>
        <div class="address-list">
          <scroll-view scroll-y="true" style="height:100%;">
            <div
              class="address-item"
              v-for="(item, index) in addressList.delivery"
              :key="index"
              @click="selectAddress(item)"
            >
              <div class="checked-icon" :class="{active: address && address.id === item.id}">
                <img
                  v-if="address && address.id === item.id"
                  src="https://img.icaixiaochu.com/%E6%AD%A3%E7%A1%AE@2x.png"
                  alt
                />
              </div>
              <div class="address-content">
                <div class="top">
                  <i>{{item.name}}</i>
                  <i>{{item.tel}}</i>
                </div>
                <div class="address-des">{{item.city}}{{item.address}}</div>
              </div>
            </div>
            <div
              class="un-vaild-address"
              v-if="addressList.length && addressList.no_delivery.length"
            >
              <div class="title">
                <div class="icon">
                  <img src="../../../static/images/location.png" alt />
                </div>
                <p>超配送范围地址</p>
              </div>
              <div
                class="address-item"
                v-for="(item, index) in addressList.no_delivery"
                :key="index"
                @click="selectAddress(item,type)"
              >
                <div class="address-content">
                  <div class="top">
                    <i>{{item.name}}</i>
                    <i>{{item.tel}}</i>
                  </div>
                  <div class="address-des">{{item.address}}</div>
                </div>
              </div>
            </div>
          </scroll-view>
        </div>
        <div class="footer-btn" @click="addAdr">
          <div class="icon">
            <img src="https://img.icaixiaochu.com/add-address.png" alt />
          </div>
          <p>新增收货地址</p>
        </div>
      </div>
    </popup>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import Collapse from '@/components/collapse'
import { getSelectTime } from '@/utils/util'
import popup from '@/components/popup'
export default {
  data () {
    return {
      shopDetail: '',
      lng: 0,
      lat: 0,
      date: '',
      address: '',
      price: '',
      feeTime: '',
      remark: '',
      curSwitch: 0,
      tel: '',
      selectGift: '',
      selectShopCoupon: '',
      delivery: '',
      delivery_time: '',
      cardState: false,
      value: [],
      activityGift: '',
      totalPrice: 0,
      packingPrice: '',
      selectCouponType: 0,
      couponPrice: 0,
      addressList: [],
      CouponList: '',
      timelist: [],
      pickerValue: [0],
      orderDetail: [],
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
            content: '菜小厨生鲜商城',
            color: '#000000',
            display: 'ALWAYS'
          }
        }
      ],
      locked: false,
      fetchAbleCoupon: [],
      giftList: '',
      shopCouponList: '',
      giftCard: []
    }
  },
  computed: {
    ...mapGetters(['food']),
    feeDateTip () {
      return this.delivery_time !== this.timelist[0] && !this.curSwitch
        ? `指定时间(${this.delivery_time})`
        : `立即送达(约${this.feeTime})`
    },
    giftCouponTip () {
      if (this.giftList) {
        if (this.selectGift) {
          return -this.selectGift.price
        }
        return this.giftList.Effective.length ? '张可用' : '暂无可用'
      }
      return ''
    },
    shopCouponTip () {
      if (this.shopCouponList) {
        if (this.selectShopCoupon) {
          return -this.selectShopCoupon.price
        }
        return this.shopCouponList.num ? '张可用' : '暂无可用'
      }
      return ''
    },
    orderPrice: function () {
      let orderTotal = 0
      let totalPrice = parseFloat(this.orderDetail.totalPrice)
      let giftCouponPrice = this.selectGift ? this.selectGift.price : 0
      let shopCouponPrice = this.selectShopCoupon
        ? this.selectShopCoupon.price
        : 0
      let MemberGift = this.cardState ? parseFloat(this.giftCard.price) : 0
      let feePrice = this.curSwitch
        ? 0
        : parseFloat(this.shopDetail.shipping_fee)
      orderTotal = (
        totalPrice +
        feePrice -
        giftCouponPrice -
        shopCouponPrice +
        MemberGift
      ).toFixed(2)

      return orderTotal
    }
  },
  components: {
    Collapse,
    popup
  },
  onUnload () {
    Object.assign(this, this.$options.data())
  },
  onShow () {
    this.getDefalutAddress()
  },
  mounted () {
    this.shopDetail = JSON.parse(this.$root.$mp.query.shopDetail)
    this.orderDetail = JSON.parse(this.$root.$mp.query.orderDetail)
    this.markers[0].iconPath = this.shopDetail.icon
    this.markers[0].callout.content = this.shopDetail.title
    this.markers[0].latitude = this.shopDetail.lat
    this.markers[0].longitude = this.shopDetail.lng
    this.lat = this.shopDetail.lat
    this.lng = this.shopDetail.lng
    this.couponGift()
    this.selectTime()
    setTimeout(() => {
      this.getDefalutAddress()
      this.getCouponList()
    }, 300)
  },
  methods: {
    selectAddress (item, type) {
      if (type) {
        wx.showToast({
          title: '地址超出配送范围',
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
      this.address = item
      this.$refs.selectAddress.toggle()
    },
    unCoupon () {
      if (this.selectCouponType) {
        this.selectShopCoupon = ''
      } else {
        this.selectGift = ''
      }
      this.$refs.selectCoupon.toggle()
    },

    couponModal (type) {
      this.selectCouponType = type
      this.$refs.selectCoupon.toggle()
    },
    selectCoupon (item) {
      if (item.status === 1) {
        if (this.selectCouponType) {
          this.selectShopCoupon = item
        } else {
          this.selectGift = item
        }
        this.$refs.selectCoupon.toggle()
      } else {
        wx.showToast({
          title: '当前优惠劵不可使用',
          icon: 'none',
          image: '',
          duration: 1500,
          mask: false,
          success: result => {},
          fail: () => {},
          complete: () => {}
        })
      }
    },
    couponGift () {
      this.$http.post('/couponsGift').then(res => {
        this.giftCard = res.data
      })
    },
    addAdr () {
      wx.navigateTo({
        url: '../addaddress/main',
        success: result => {},
        fail: () => {},
        complete: () => {}
      })
    },
    getAddressList () {
      this.$http
        .post('/fetchDeliveryAddress', { shop_id: this.shopDetail.id })
        .then(res => {
          this.addressList = res.data
          this.$refs.selectAddress.toggle()
        })
    },
    getDefalutAddress () {
      this.$http
        .post('/getRecentlyAddress', { shop_id: this.shopDetail.id })
        .then(res => {
          this.address = res.data[0]
        })
    },
    getCouponList () {
      this.$http
        .post('/fetchAbleCoupon', {
          type: 1,
          price: this.totalPrice,
          shop_id: this.shopDetail.id
        })
        .then(res => {
          this.fetchAbleCoupon = res.data
          let data = res.data
          Object.keys(data).forEach((item, index) => {
            let normalData = {
              num: 0,
              data: [],
              Effective: [],
              Inval: []
            }
            data[item].forEach(ele => {
              if (ele.status === 1) {
                normalData.num++
                normalData.Effective.push(ele)
              } else {
                normalData.Inval.push(ele)
              }
              normalData.data.push(ele)
            })
            if (index === 0) {
              this.giftList = normalData
            } else {
              this.shopCouponList = normalData
            }
          })
        })
    },
    toggleCardState () {
      this.cardState = !this.cardState
    },
    DeliveryInfo () {
      this.$http.post('/getPriceSend').then(res => {
        this.delivery = res.data
        if (this.goodTotal < this.delivery.price_send) {
          this.curSwitch = 1
        }
      })
    },
    selectCoupons () {
      wx.navigateTo({
        url: `../coupons/main?total=${this.goodTotal}&has_gif=${this.cardState}`
      })
    },
    getShippingFee () {
      this.$http.get('/getShippingFee').then(res => {
        this.fee = res.data
      })
    },
    hideSelect () {
      this.$refs.seleceNow.toggle('hide')
    },
    pickerChange (e) {
      this.delivery_time = this.timelist[e.mp.detail.value[0]]
      this.pickerValue[0] = e.mp.detail.value[0]
    },
    selectTime (type) {
      var now = new Date()
      var time = now.getTime() + 1000 * 60 * this.shopDetail.delivery_time
      var date = new Date(time)
      var nowMonth = date.getMonth() + 1
      var strDate = date.getDate()
      let stateTime = `${date.getHours()}:${date.getMinutes()}`
      this.feeTime = stateTime
      this.date = `${nowMonth}月${strDate}日`
      this.timelist = getSelectTime(stateTime, '20:00', 15)
      this.delivery_time = this.timelist[0]
      if (type) {
        this.$refs.seleceNow.toggle()
      }
    },
    ...mapMutations({
      emptyCart: 'EMPTY_CART'
    }),
    createOrder () {
      if (this.locked) {
        wx.showToast({
          title: '订单创建成功正在启动支付...',
          icon: 'none',
          image: '',
          duration: 1500,
          mask: false,
          success: (result) => {

          },
          fail: () => {},
          complete: () => {}
        })
        return
      }
      let _this = this
      if (!this.curSwitch) {
        if (!this.address) {
          wx.showToast({
            title: '请选择收货地址',
            icon: 'none',
            image: '',
            duration: 1500,
            mask: true,
            success: result => {},
            fail: () => {},
            complete: () => {}
          })
          return
        }
      } else {
        if (!this.delivery_time && !this.tel) {
          wx.showToast({
            title: '请选择到店时间和预留手机号',
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
        if (!/^1[3456789]\d{9}$/.test(this.tel)) {
          wx.showToast({
            title: '请填写正确的预留手机号',
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
      }
      let goods = this.orderDetail.foods.map(ele => {
        return {
          sku_id: ele.id,
          number: ele.num,
          attribute: ele.attribute.map(e => e).join(',')
        }
      })

      let formData = {
        shop_id: this.shopDetail.id,
        address_id: this.address ? this.address.id : 0,
        goods: JSON.stringify(goods),
        tel: this.tel,
        time_take_self: this.curSwitch ? this.delivery_time : this.feeTime,
        remark: this.remark,
        red_pack: this.selectGift ? this.selectGift.id : '',
        coupon_id: this.selectShopCoupon ? this.selectShopCoupon.id : '',
        has_gift: this.cardState ? 1 : 0,
        is_used_gift: this.selectGift.id === 1 ? 1 : 0,
        delivery_type: this.curSwitch
      }
      this.locked = true
      this.$http.post('/createOrder', formData).then(res => {
        let result = res.data
        let orderId = res.data.order_id
        wx.requestPayment({
          timeStamp: result.timestamp.toString(),
          nonceStr: result.nonceStr,
          package: result.package,
          signType: 'MD5',
          paySign: result.paySign,
          success: function (res) {
            _this.emptyCart(_this.shopDetail.id)
          },
          fail: function (err) {
            console.log(err)
          },
          complete: function () {
            wx.redirectTo({
              url: `../orderdetail/main?id=${orderId}`
            })
          }
        })
      })
    }
  },
  watch: {
    cardState (newVal, oldVal) {
      if (newVal) {
        let coupon = this.giftCard.coupon
        this.giftList.Effective = this.giftList.Effective.concat(coupon)
      } else if (this.giftList.Effective.every(item => item.id === 1)) {
        if (this.selectGift.id) {
          this.selectGift = ''
        }
        let lng = this.giftList.Effective.length - this.giftCard.coupon.length
        this.giftList.Effective = this.giftList.Effective.slice(0, lng)
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import "./style";
</style>
