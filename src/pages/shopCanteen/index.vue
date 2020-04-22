<template>
  <div class="page-wrap dis-flex vertical">
    <div v-if="shopInfo" class="top dis-flex flex-middle">
      <div class="logo" :style="{
        background: 'url(' + shopInfo.icon + ')'
      }"></div>
      <div class="dis-flex vertical flex">
        <div class="shop-title dis-flex flex-middle">
          <div class="shop-title-str dis-flex flex-middle flex">{{shopInfo.title}}</div>
          <div @click="toSearch" class="search dis-flex flex-middle">
            <div class="search-icon"></div>
            <div class="search-str">搜索</div>
          </div>
        </div>
        <div class="shop-des clamp-2">{{shopInfo.announcement}}</div>
      </div>
    </div>
    <div v-if="shopList.length" class="body dis-flex flex">
      <div class="class-list">
        <div @click="setClassIndex(index)" v-for="(item, index) in shopList" :key="index" class="item" :class="nowClassIndex == index && 'active'">
          <span class="clamp-2">{{item.title}}</span>
        </div>
      </div>
      <scroll-view class="food-list" :scroll-top="scrollTop" scroll-y="true" @scroll="scrollRight($event)" @scrolltolower="scrolltolower">
        <div v-if="!titleHeight && !itemHeight" class="item-list opacity dis-flex vertical">
          <div id="get-title" class="item-list-title">测试</div>
          <div id="get-item" class="list dis-flex vertical">
            <div class="item dis-flex flex-middle">
              <div class="item-img"></div>
              <div class="item-wrap dis-flex vertical flex-between flex">
                <div class="dis-flex vertical">
                  <div class="food-title">123</div>
                  <div class="sales-stock dis-flex flex-middle">
                    <div class="sales">月售</div>
                    <div class="sales">库存</div>
                  </div>
                </div>
                <div class="price-operating dis-flex flex-middle flex-between">
                  <div class="price DINN">￥123</div>
                  <div class="btn dis-flex flex-middle flex-center">选规格</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-for="(item, index) in shopList" :key="index" class="item-list dis-flex vertical">
          <div class="item-list-title">{{item.title}}</div>
          <div class="list dis-flex vertical">
            <div v-for="(_item, _index) in item.goods" :key="_index" class="item dis-flex flex-middle" :class="_item.goods_status">
              <div class="item-img" :style="{
                background: 'url(' + _item.cover + ')'
              }"></div>
              <div class="item-wrap dis-flex vertical flex-between flex">
                <div class="dis-flex vertical">
                  <div class="food-title">{{_item.title}}</div>
                  <div class="sales-stock dis-flex flex-middle">
                    <div class="sales">月售{{_item.monthly_sale}}</div>
                    <div class="sales">库存{{_item.stock}}</div>
                  </div>
                </div>
                <div class="price-operating dis-flex flex-middle flex-between">
                  <div class="price DINN">￥{{_item.sku[_item.skuIndex].price}}</div>
                  <div @click="selectClass(_item)" v-if="_item.hasMoreAttrs" class="btn dis-flex flex-middle flex-center">选规格</div>
                  <div v-else class="select-num dis-flex flex-middle">
                    <div v-if="_item.num" @click="changeNum(index, _index, -1, _item.num, _item)" class="change-num-btn">-</div>
                    <div v-if="_item.num" class="num">{{_item.num}}</div>
                    <div @click="changeNum(index, _index, +1, _item.num, _item)" class="change-num-btn active">+</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </scroll-view>
    </div>
    <div @click="openCartList" class="bottom dis-flex flex-middle flex-between">
      <div class="dis-flex flex-middle">
        <div class="cart-icon" :class="allFoodNum && 'active'">
          <div v-if="allFoodNum" class="num">{{allFoodNum}}</div>
        </div>
        <div class="all-price dis-flex flex-bottom">
          <div class="price-icon">¥</div>
          <div class="price-num">{{allFoodPrice}}</div>
        </div>
      </div>
      <div @click.stop="confirmOrder" class="btn dis-flex flex-middle flex-center" :class="allFoodNum && 'active'">选好了</div>
    </div>

    <div @click="toOrder" class="float-icon dis-flex flex-middle">
      <div class="float-img-icon"></div>
      <div class="float-icon-str">我的订单</div>
    </div>

    <div @click="closeModal" v-if="blackOff" class="black-bg" :class="cartListOff && 'cart-list-bg'"></div>

    <div v-if="cartListOff" class="cart-list dis-flex vertical">
      <div class="cart-list-title dis-flex flex-right">
        <div @click="clearCartList" class="clear-cart dis-flex flex-middle">
          <div class="clear-icon"></div>
          <div class="clear-str">清空购物车</div>
        </div>
      </div>
      <div class="list dis-flex vertical">
        <div v-for="(item, index) in allFoodList" :key="index" class="item dis-flex flex-middle flex-between">
          <div class="dis-flex flex-middle flex">
            <div class="item-img" :style="{
              background: 'url(' + item.cover + ')'
            }"></div>
            <div>
              <div class="item-wrap dis-flex vertical flex-between">
                <div class="dis-flex vertical">
                  <div class="item-title">{{item.title}}</div>
                  <div class="item-des">{{item.des}}</div>
                </div>
                <div class="item-price DINN dis-flex flex-bottom">
                  <div class="price-icon">¥</div>
                  <div class="price">{{item.price}}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="select-num dis-flex flex-middle">
            <div @click="changeAddCartNum(item, -1)" class="change-num-btn">-</div>
            <div class="num">{{item.num}}</div>
            <div @click="changeAddCartNum(item, +1)" class="change-num-btn">+</div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="addCartOff && nowSelectGoodsInfo" class="add-cart dis-flex vertical flex-middle">
      <div class="food-info dis-flex flex-middle flex-between">
        <div class="dis-flex flex-middle">
          <div class="food-img" :style="{
            background: 'url(' + nowSelectGoodsInfo.cover + ')'
          }"></div>
          <div class="dis-flex vertical">
            <div class="food-title">{{nowSelectGoodsInfo.title}}</div>
            <div class="food-price">¥{{selectShowPrice}}</div>
          </div>
        </div>
        <div class="select-num dis-flex flex-middle">
          <div @click="changeSelectGoodsNum(-1)" class="change-num-btn">-</div>
          <div class="num">{{nowSelectGoodsInfo.num}}</div>
          <div @click="changeSelectGoodsNum(+1)" class="change-num-btn">+</div>
        </div>
      </div>
      <div class="attr-list dis-flex vertical">
        <div class="attr-item dis-flex vertical">
          <div class="item-title">规格</div>
          <div class="item-list dis-flex flex-middle flex-wrap">
            <div @click="changeSku(index)" v-for="(item,index) in nowSelectGoodsInfo.sku" :key="index" class="item dis-flex flex-middle flex-center" :class="index == nowSelectGoodsInfo.skuIndex && 'active'">{{item.title}}</div>
          </div>
        </div>
        <div v-for="(item, index) in nowSelectGoodsInfo.attribute" :key="index" class="attr-item dis-flex vertical">
          <div class="item-title">{{item.title}}</div>
          <div class="item-list dis-flex flex-middle flex-wrap">
            <div v-if="_item.title" @click="changeAttr(index, _index)" v-for="(_item, _index) in item.attrs" :key="_index" class="item dis-flex flex-middle flex-center" :class="_index == item.attrsIndex && 'active'">{{_item.title}}</div>
          </div>
        </div>
      </div>
      <div class="select-attr dis-flex flex-middle">
        <div class="select-title">已选规格：</div>
        <div class="select-str">{{selectShowStr}}</div>
      </div>
      <div @click="addCart" class="btn dis-flex flex-middle flex-center">+ 加入购物车</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 黑色遮罩
      blackOff: false,
      // 加入购物车弹窗
      addCartOff: false,
      // 购物车列表
      cartListOff: false,
      // 商家信息
      shopInfo: null,
      // 当前菜单款式下标
      nowClassIndex: 0,
      // 当前选择商品信息
      nowSelectGoodsInfo: null,
      // 标题高度
      titleHeight: 0,
      // item高度
      itemHeight: 0,
      // 滚动区间
      scrollInterval: [],
      // 滚动条位置
      scrollTop: 0
    }
  },
  computed: {
    shopCartList () {
      return this.$store.state.shopFood.shopCartList
    },
    shopList () {
      return this.$store.state.shopFood.shopList
    },
    allFoodList () {
      return this.$store.getters.allFoodList.cartFoodList
    },
    allFoodNum () {
      return this.$store.getters.allFoodList.cartFoodNum
    },
    allFoodPrice () {
      return this.$store.getters.allFoodList.cartFoodPrice
    },
    // 选择款式价格
    selectShowPrice () {
      let price = 0
      if (this.nowSelectGoodsInfo) {
        price = this.nowSelectGoodsInfo.sku[this.nowSelectGoodsInfo.skuIndex].price
      }
      return price
    },
    // 已选规格
    selectShowStr () {
      let str = []
      if (this.nowSelectGoodsInfo) {
        str.push(this.nowSelectGoodsInfo.sku[this.nowSelectGoodsInfo.skuIndex].title)
        this.nowSelectGoodsInfo.attribute.forEach(item => {
          str.push(item.attrs[item.attrsIndex].title)
        })
      }
      return str.join('、')
    }
  },
  onLoad () {
    this.getForHereShop()
    this.fetchForHereShopGoods()
  },
  methods: {
    // 右侧滚动
    scrollRight (e) {
      let { scrollTop } = e.target

      let findIndex = this.scrollInterval.findIndex(item => {
        if (scrollTop >= item[0] && scrollTop < item[1]) {
          return item
        }
      })
      if (this.nowClassIndex !== findIndex) {
        this.nowClassIndex = findIndex
      }
    },
    // 获取dom数据
    getRect (id) {
      return new Promise((resolve, reject) => {
        wx.createSelectorQuery().select(id).boundingClientRect(function (rect) {
          resolve(rect.height)
        }).exec()
      })
    },
    // 去订单
    toOrder () {
      wx.switchTab({
        url: `../order/main`
      })
    },
    // 确认订单
    confirmOrder () {
      if (!this.allFoodNum) {
        return
      }
      wx.navigateTo({
        url: `../confirmShopList/main`
      })
    },
    // 搜索
    toSearch () {
      this.$store.commit('SET_SEARCH_KEY', null)
      wx.navigateTo({
        url: `../searchShop/main`
      })
    },
    // 多款式添加购物车
    addCart () {
      this.$store.commit('ADD_SHOP_MORE_ATTRS_LIST', JSON.parse(JSON.stringify(this.nowSelectGoodsInfo)))
      this.closeModal()
    },
    // 修改规格
    changeSku (index) {
      this.nowSelectGoodsInfo.skuIndex = index
    },
    // 修改购物车列表数量
    changeAddCartNum (item, changeNum) {
      if (item.hasMoreAttrs) {
        let catchItem = JSON.parse(JSON.stringify(item))
        catchItem.num += changeNum
        this.$store.commit('ADD_SHOP_MORE_ATTRS_LIST', catchItem)
      } else {
        this.changeNum(item.index, item._index, changeNum)
      }
    },
    // 修改商品数量
    changeNum (index, _index, changeNum, num, item) {
      let err = this.beforeAddCartCheck(item)
      if (err) {
        return
      }
      if (changeNum === -1 && num === 1) {
        wx.showModal({
          title: '提示',
          content: '是否删除',
          success: (res) => {
            if (res.confirm) {
              this.$store.commit('SET_SHOP_FOOD_NUM', [index, _index, changeNum])
            }
          }
        })
      } else {
        this.$store.commit('SET_SHOP_FOOD_NUM', [index, _index, changeNum])
      }
    },
    // 清空购物车
    clearCartList () {
      this.$store.commit('CLEAR_CART', [])
    },
    // 打开购物车列表
    openCartList () {
      this.controlBlackOff(true)
      this.controlCartListOff(true)
    },
    // 修改选择款式属性下标
    changeAttr (index, _index) {
      this.nowSelectGoodsInfo.attribute[index].attrsIndex = _index
      this.nowSelectGoodsInfo.num++
      this.nowSelectGoodsInfo.num--
    },
    // 修改选择款式数量
    changeSelectGoodsNum (changNum) {
      this.nowSelectGoodsInfo.num += changNum
      if (this.nowSelectGoodsInfo.num <= 1) {
        this.nowSelectGoodsInfo.num = 1
      }
    },
    // 关闭所有弹窗
    closeModal () {
      this.controlBlackOff(false)
      this.controlAddCartOff(false)
      this.controlCartListOff(false)
    },
    // 检测
    beforeAddCartCheck (item) {
      let error = ''
      if (item.goods_status) {
        error = 'item.goods_status'
        wx.showToast({
          title: '商品不支持加入购物车',
          icon: 'none',
          duration: 2000
        })
      }
      return error
    },
    // 选规格
    selectClass (item) {
      let err = this.beforeAddCartCheck(item)
      if (err) {
        return
      }
      this.nowSelectGoodsInfo = item
      this.nowSelectGoodsInfo.num = 1
      this.controlBlackOff(true)
      this.controlAddCartOff(true)
    },
    // 处理数据
    handleData (data) {
      data.forEach((item, index) => {
        item.goods && item.goods.forEach((_item, _index) => {
          // 兼容处理
          if (!_item.attribute) {
            _item.attribute = []
          }

          // 设置单属性描述(购物车列表有用)
          _item.des = ''
          if (_item.attribute && _item.attribute.length === 1) {
            _item.des += _item.attribute[0].title
          }

          if (_item.sku && _item.sku.length === 1) {
            _item.des += _item.sku[0].title
          }

          // 打上下标标签(加减要使用)
          _item.index = index
          _item._index = _index

          // 处理属性下标
          if (_item.attribute && _item.attribute.length >= 1) {
            _item.attribute.forEach((__item) => {
              __item.attrsIndex = 0
            })
          }

          // 处理规格下标
          if (_item.sku && _item.sku.length >= 1) {
            _item.skuIndex = 0
          }

          // 设置状态 售罄 || 下架
          item.goods_status = ''
          if (_item.stock <= 0) {
            _item.goods_status = 'no-stock'
          }
          if (_item.is_putaway !== 1) {
            _item.goods_status = 'off-shelf'
          }

          // 设置数量
          _item.num = 0

          // 设置是否多款式
          _item.hasMoreAttrs = 0
          if (_item.attribute && _item.attribute.length > 1) {
            _item.hasMoreAttrs = 1
          }

          if (_item.sku && _item.sku.length > 1) {
            _item.hasMoreAttrs = 1
          }
        })
      })
      return data
    },
    // 修改左侧菜品种类
    setClassIndex (index) {
      this.nowClassIndex = index
      this.scrollTop = this.scrollInterval[index][0]
    },
    // 设置高度
    setHeight (data) {
      let catchData = data
      let nowHeight = 0
      catchData.forEach(item => {
        let titleHeight = this.titleHeight
        let itemHeight = this.itemHeight * item.goods.length + item.goods.length
        item.height = nowHeight
        let starTop = nowHeight
        nowHeight = nowHeight + titleHeight + itemHeight
        let endTop = nowHeight
        if (starTop !== endTop) {
          this.scrollInterval.push([starTop, endTop])
        }
      })
      this.$store.commit('SET_SHOP_LIST', catchData)
    },
    // 店铺菜单
    async fetchForHereShopGoods () {
      try {
        let { data } = await this.$http.post('/fetchForHereShopGoods', {
          shop_id: 2
        })
        data = this.handleData(data)
        this.$store.commit('SET_SHOP_LIST', data)
        this.$nextTick(async () => {
          let titleHeight = await this.getRect('#get-title')
          let itemHeight = await this.getRect('#get-item')
          this.titleHeight = titleHeight
          this.itemHeight = itemHeight
          this.setHeight(data)
        })
      } catch (err) {
        console.log('获取店铺菜单失败', err)
      }
    },
    // 店铺详情
    async getForHereShop () {
      try {
        let { data } = await this.$http.post('/getForHereShop', {
          shop_id: 2
        })
        this.shopInfo = data
        this.$store.commit('SET_SHOP_INFO', data)
      } catch (err) {
        console.log('获取店铺详情失败', err)
      }
    },
    // 控制黑色遮罩
    controlBlackOff (status) {
      this.blackOff = status
    },

    // 控制加入购物车弹窗
    controlAddCartOff (status) {
      this.addCartOff = status
    },

    // 控制购物车列表弹窗
    controlCartListOff (status) {
      this.cartListOff = status
    }
  }
}
</script>

<style scoped lang="less">
  @import url(./style.less);
</style>
