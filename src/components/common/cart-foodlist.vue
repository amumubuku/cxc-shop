<template>
  <div class="cart-food-list">
    <popup ref="foodList" type="bottom">
      <div class="food-list-wrp">
        <div class="head-top-box">
          <div class="top-left">
            <p class="icon">*</p>
            <p>包装费{{packingPrice}}元</p>
          </div>
          <div class="top-right" @click="emptyCard">
            <img src="../../../static/images/detele.png" alt />
            <p>清空购物车</p>
          </div>
        </div>
        <div class="cart-food-list">
          <scroll-view scroll-y="true" style="height: 100%">
            <div class="food-item" v-for="(item, index) in initFoodList" :key="index">
              <div class="food-item-left">
                <div class="food-name">{{item.title}}</div>
                <div class="food-attr">
                  <div
                    class="sku-title"
                    v-if="item.skuTitle"
                    style="padding-right:3px"
                  >+{{item.skuTitle}}</div>
                  <div class="attr-list">
                    <p v-for="(item, k) in item.attr" :key="k">+{{item}}</p>
                  </div>
                </div>
              </div>
              <div class="food-item-right">
                <div class="food-price">￥{{item.foodPrice}}</div>
                <div class="cart-button">
                  <div class="reduct extend" @click.stop="reductCart(item)">
                    <img src="../../../static/images/reduct-cart.png" alt />
                  </div>
                  <div class="cart-num">{{item.num}}</div>
                  <div class="add extend" @click.stop="addCart(item)">
                    <img src="../../../static/images/add-cart.png" alt />
                  </div>
                </div>
              </div>
            </div>
          </scroll-view>
        </div>
      </div>
    </popup>
    <div class="shop-cart" @click="showFoodList" v-if="shopinfo && shopinfo.is_business">
      <div class="buy-cart-info">
        <div class="shop-cover">
          <img src="https://img.icaixiaochu.com/cart-logo.png" alt />
          <p class="tip-num" v-if="cartListNum">{{cartListNum}}</p>
        </div>
        <div class="shop-des">
          <p class="price" v-if="totalPrice">¥{{totalPrice}}</p>
          <p
            style="padding-bottom:1px;"
          >{{shopinfo.is_arrival ? '配送费' + shopinfo.shipping_fee + ' | 支持自取' : '配送费' + shopinfo.shipping_fee}}</p>
        </div>
      </div>
      <div
        class="cart-state"
        :class="{active:totalPrice >= shopinfo.price_send }"
        @click.stop="confirmOrder"
      >
        <p>{{totalPrice >= shopinfo.price_send ? '去结算': food.length ? '还差' + (diffPrice || 0)+'元':shopinfo.price_send +'元起送' }}</p>
      </div>
    </div>
    <p class="shop-stop" v-else>本店打烊啦</p>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import popup from '@/components/popup'
export default {
  components: { popup },
  props: {
    shopinfo: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      totalPrice: '',
      cartListNum: 0,
      packingPrice: 0,
      diffPrice: 0,
      foods: []
    }
  },
  onUnload () {
    Object.assign(this, this.$options.data())
  },
  computed: {
    ...mapGetters(['food']),
    initFoodList: function () {
      let foods = []
      let num = 0
      let totalPrice = 0
      let packingPrice = 0
      this.food.forEach(ele => {
        num += ele.count
        if (ele.sku.length > 1) {
          ele.sku.forEach(sku => {
            if (sku.num) {
              let foodPrice = 0
              if (ele.discount && ele.discount.limit_num) {
                if (sku.num > ele.discount.limit_num && ele.discount.limit_num) {
                  foodPrice = (sku.num - ele.discount.limit_num) * sku.original_price + ele.discount.limit_num * sku.price
                } else {
                  foodPrice = sku.num * sku.price
                }
              } else {
                foodPrice = sku.num * sku.price
              }
              totalPrice += foodPrice
              ele.foodPrice = foodPrice.toFixed(2)
              packingPrice += parseFloat(sku.packing_price * sku.num)
              foods.push({...sku, ...ele})
            }
          })
        } else {
          let sku = ele.sku[0]
          let foodPrice = 0
          if (ele.discount && ele.discount.limit_num) {
            if (sku.num > ele.discount.limit_num && ele.discount.limit_num) {
              foodPrice = (sku.num - ele.discount.limit_num) * sku.original_price + ele.discount.limit_num * sku.price
            } else {
              foodPrice = sku.num * sku.price
            }
          } else {
            foodPrice = sku.num * sku.price
          }
          totalPrice += foodPrice
          packingPrice += parseFloat(sku.packing_price * sku.num)
          ele.foodPrice = foodPrice.toFixed(2)
          foods.push({...sku, ...ele})
        }
      })
      this.cartListNum = num
      this.diffPrice = (this.shopinfo.price_send - totalPrice).toFixed(2)
      this.totalPrice = (packingPrice + totalPrice).toFixed(2)
      this.packingPrice = packingPrice.toFixed(2)
      this.foods = foods
      return foods
    }
  },
  methods: {
    emptyCard () {
      wx.showModal({
        // title: '确定清空购物车吗?',
        content: '确定清空购物车吗',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: result => {
          if (result.confirm) {
            this.EMPTY_CART(this.shopinfo.id)
            this.$refs.foodList.toggle()
          }
        },
        fail: () => {},
        complete: () => {}
      })
    },
    addCart (item) {
      if (item.num >= item.stock) {
        wx.showToast({
          title: '购买的商品库存不足',
          icon: 'none',
          image: '',
          duration: 1500,
          mask: false,
          success: result => {},
          fail: () => {},
          complete: () => {}
        })
        return false
      }
      this.ADD_CART({index: item.index, foodIndex: item.foodIndex, num: ++item.num, skuIndex: item.skuIndex})
    },
    reductCart (item) {
      let count = 0
      let num = item.sku[item.skuIndex].num
      if (num > item.min_buy) {
        count = num - 1
      } else {
        count = num - item.min_buy
      }
      this.ADD_CART({index: item.index, foodIndex: item.foodIndex, num: count, skuIndex: item.skuIndex})
    },
    showFoodList () {
      if (this.food.length) {
        this.$refs.foodList.toggle()
      }
    },
    confirmOrder () {
      if (this.totalPrice >= this.shopinfo.price_send) {
        if (wx.getStorageSync('token')) {
          let shopDetail = JSON.stringify(this.shopinfo)
          let orderDetail = JSON.stringify(this.$data)
          wx.navigateTo({
            url: `../submitOrder/main?shopDetail=${shopDetail}&orderDetail=${orderDetail}`,
            success: result => {},
            fail: () => {},
            complete: () => {}
          })
        } else {
          wx.navigateTo({
            url: '../login/main',
            success: result => {},
            fail: () => {},
            complete: () => {}
          })
        }
      }
    },
    ...mapMutations(['EMPTY_CART', 'ADD_CART', 'REDUCT_CART'])
  },
  watch: {
    food (newVal, oldVal) {
      if (newVal.length < 1) {
        this.$refs.foodList.toggle('hide')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cart-food-list {
  position: relative;
  .food-list-wrp {
    background-color: #fff;
    position: absolute;
    bottom: 52px;
    border-radius: 20px 20px 0px 0px;
    overflow: hidden;
    width: 100%;
    border-bottom: 19px solid #fff;

    .head-top-box {
      padding: 0 14px;
      box-sizing: border-box;
      height: 44px;
      background: rgba(246, 246, 246, 1);
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-radius: 20px 20px 0px 0px;
      .top-left {
        display: flex;
        align-items: center;
        flex: 1;
        height: 100%;
        .icon {
          position: relative;
          top: 4px;
          font-size: 14px;
          color: #fd5200;
          padding-right: 2px;
        }
      }
      p {
        font-size: 11px;
        font-weight: 400;
        color: rgba(120, 120, 120, 1);
      }
      .top-right {
        flex: 1;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        img {
          width: 10px;
          height: 11px;
          padding: 4px;
        }
      }
    }
    .cart-food-list {
      max-height: 254px;
      overflow-y: scroll;
      .food-item {
        height: 62px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 14px;
        border-bottom: 1px solid #f2f2f2;
        .food-item-left {
          flex: 1;
        }
        .food-item-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .cart-button {
            display: flex;
            align-items: center;
            justify-content: center;
            .reduct,
            .add {
              position: relative;
              width: 20px;
              height: 20px;
              background: rgba(255, 255, 255, 1);
              box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              img {
                width: 10px;
                height: 10px;
              }
            }
            .extend::after {
              content: " ";
              position: absolute;
              top: -10px;
              left: -10px;
              right: -10px;
              bottom: -10px;
            }
            .cart-num {
              width: 9px;
              height: 21px;
              font-size: 15px;
              font-weight: 800;
              line-height: 21px;
              color: rgba(33, 33, 33, 1);
              margin: 0 12px;
            }
          }
        }
        .food-name {
          font-size: 13px;
          font-weight: 400;
          color: rgba(33, 33, 33, 1);
          padding-bottom: 4px;
        }
        .food-attr {
          display: flex;
          align-items: center;
          font-size: 11px;
          font-weight: 400;
          line-height: 16px;
          color: rgba(165, 165, 165, 1);
          .attr-list {
            display: flex;
            align-items: center;

            p {
              padding-right: 3px;
            }
          }
        }
        .food-price {
          font-size: 15px;
          font-weight: 800;
          color: rgba(253, 82, 0, 1);
        }
        .btn-area {
          display: flex;
          align-items: center;
          justify-content: center;

          .reduct,
          .add {
            width: 20px;
            height: 20px;
            background: rgba(255, 255, 255, 1);
            box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;

            img {
              width: 10px;
              height: 10px;
            }
          }

          .cart-num {
            width: 9px;
            height: 21px;
            font-size: 15px;
            font-weight: 300;
            line-height: 21px;
            color: rgba(33, 33, 33, 1);
            margin: 0 8px;
          }
        }
      }
    }
  }
  .shop-stop {
    width: 375px;
    height: 52px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(69, 67, 70, 1);
    box-shadow: 0px -1px 6px rgba(71, 71, 71, 0.1);
    font-size: 17px;
    font-weight: 400;
    line-height: 52px;
    color: rgba(255, 255, 255, 1);
    text-align: center;
    z-index: 99;
  }
  .shop-cart {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 52px;
    background: #454346;
    display: flex;
    justify-content: space-between;
    z-index: 99;

    .buy-cart-info {
      padding-left: 18px;
      display: flex;
      align-items: center;
      flex: 1;
      position: relative;

      .shop-cover {
        position: relative;
        top: -5px;
        width: 53px;
        height: 53px;
        background: rgba(255, 255, 255, 1);
        border: 5px solid rgba(69, 67, 70, 1);
        box-shadow: 0px -3px 5px rgba(0, 0, 0, 0.16);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          width: 100%;
          height: 100%;
        }
        .tip-num {
          position: absolute;
          top: -6px;
          right: -4px;
          width: 21px;
          height: 14px;
          background: rgba(253, 82, 0, 1);
          box-shadow: 0px 1px 6px rgba(253, 82, 0, 0.4);
          border-radius: 7px;
          font-size: 11px;
          font-weight: 400;
          line-height: 14px;
          color: rgba(255, 255, 255, 1);
          text-align: center;
        }
      }

      .shop-des {
        margin-left: 12px;
        font-size: 11px;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        box-sizing: border-box;
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;

        .price {
          font-size: 21px;
          font-weight: bold;
          color: rgba(255, 255, 255, 1);
          padding-bottom: 6px;
          line-height: 20px;
        }
      }
    }

    .cart-state {
      flex: 0 0 110px;
      height: 52px;
      background: rgba(255, 255, 255, 0.16);
      color: rgba(165, 165, 165, 1);

      p {
        text-align: center;
        font-size: 15px;
        font-weight: 400;
        line-height: 52px;
      }
    }
    .active {
      color: #fff;
      background: linear-gradient(
        270deg,
        rgba(255, 159, 30, 1) 0%,
        rgba(246, 119, 15, 1) 100%
      );
    }
  }
}
</style>