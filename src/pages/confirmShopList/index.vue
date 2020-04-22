<template>
  <div class="page-wrap dis-flex vertical flex-middle">
    <div class="top dis-flex flex-middle">
      <div class="input-title dis-flex flex-middle">请填写您所在的桌位号:</div>
      <input :focus="true" v-model="seat" class="input dis-flex flex" type="number">
    </div>
    <div class="body dis-flex vertical">
      <div class="shop-info dis-flex flex-middle">
        <div class="shop-logo" :style="{
          background: 'url(' + shopInfo.icon + ')'
        }"></div>
        <div class="shop-title">{{shopInfo.title}}</div>
      </div>
      <div class="list dis-flex vertical">
        <div v-for="(item, index) in allFoodList" class="item dis-flex flex-between">
          <div class="dis-flex flex-middle">
            <div class="item-img" :style="{
              background: 'url(' + item.cover + ')'
            }"></div>
            <div class="item-wrap dis-flex vertical flex-between flex">
              <div class="dis-flex vertical">
                <div class="item-title">{{item.title}}</div>
                <div class="item-des">{{item.des}}</div>
              </div>
              <div class="num">X {{item.num}}</div>
            </div>
          </div>
          <div class="price dis-flex flex-bottom">
            <div class="price-icon">¥</div>
            {{item.price}}
          </div>
        </div>
      </div>
      <div class="remarks dis-flex flex-middle">
        <div class="remarks-title">用餐备注：</div>
        <input v-model="remark" class="input" type="text" placeholder="非必填，请填写您的需要">
      </div>
      <div class="all-computed dis-flex flex-bottom flex-right">
        <div class="num">共 {{allFoodNum}} 件商品</div>
        <div class="price dis-flex flex-bottom">
          <div class="price-title">小计</div>
          <div class="price-icon">¥</div>
          <div class="price-num">{{allFoodPrice}}</div>
        </div>
      </div>
    </div>
    <div class="tip">— 叮叮点外卖，探索外卖新生态 —</div>
    <div class="bottom dis-flex flex-middle flex-between">
      <div class="dis-flex flex-middle">
        <div class="cart-icon">
          <div class="num">{{allFoodNum}}</div>
        </div>
        <div class="all-price dis-flex flex-bottom">
          <div class="price-icon">¥</div>
          <div class="price-num">{{allFoodPrice}}</div>
        </div>
      </div>
      <div @click="pay" class="btn dis-flex flex-middle flex-center">去支付</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      remark: '',
      seat: ''
    }
  },
  computed: {
    shopInfo () {
      return this.$store.state.shopFood.shopInfo
    },
    allFoodList () {
      return this.$store.getters.allFoodList.cartFoodList
    },
    allFoodNum () {
      return this.$store.getters.allFoodList.cartFoodNum
    },
    allFoodPrice () {
      return this.$store.getters.allFoodList.cartFoodPrice
    }
  },
  methods: {
    // 处理数据
    handleGoodsParams () {
      let data = []
      this.allFoodList.forEach(item => {
        let obj = {
          sku_id: item.sku[item.skuIndex].id,
          number: item.num,
          attribute: item.attribute.map(item => item.attrs[item.attrsIndex].attribute_id)
        }
        data.push(obj)
      })
      return JSON.stringify(data)
    },
    // 检查参数
    checkParams () {
      let err = ''
      if (!this.seat) {
        err = 'seat'
      }
      return err
    },
    // 去支付
    async pay () {
      let err = this.checkParams()
      if (err) {
        wx.showToast({
          title: '请填写您的桌位号',
          icon: 'none',
          duration: 2000
        })
        return
      }
      try {
        // this.toSuccess()
        // return
        let { data } = await this.$http.post('/createForHereOrder', {
          shop_id: 2,
          remark: this.remark,
          seat: this.seat,
          goods: this.handleGoodsParams()
        })
        this.wechatPay(data)
      } catch (err) {
        console.log('获取店铺详情失败', err)
      }
    },
    // 微信支付
    wechatPay (params) {
      wx.requestPayment({
        timeStamp: params.timestamp.toString(),
        nonceStr: params.nonceStr,
        package: params.package,
        signType: 'MD5',
        paySign: params.paySign,
        success: (res) => {
          this.toSuccess()
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
    },
    // 去支付成功
    toSuccess () {
      wx.navigateTo({
        url: `../payShopFoodSuccess/main`
      })
    }
  }
}
</script>

<style scoped lang="less">
  @import url(./style.less);
</style>
