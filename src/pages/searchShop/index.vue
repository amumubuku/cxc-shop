<template>
  <div class="page-wrap dis-flex vertical">
    <div class="search-wrap dis-flex flex-middle">
      <div class="input-wrap dis-flex flex-middle flex">
        <div class="input-icon"></div>
        <input v-model="searchKey" class="input dis-flex flex" type="text">
        <div v-if="searchKey" @click="clearSearchKey" class="clear"></div>
      </div>
      <div @click="search" class="btn">搜索</div>
      <div class="cart-icon">
        <div class="num">{{allFoodNum}}</div>
      </div>
    </div>
    <div v-if="searchResult.length" class="list">
      <div v-for="(item, index) in searchResult" :key="index" class="item dis-flex vertical flex-middle">
        <div class="item-img" :style="{
          background: 'url(' + item.cover + ')'
        }"></div>
        <div class="item-title clamp-2">{{item.title}}</div>
        <div class="sales-stock dis-flex flex-middle">
          <div class="sales">月售 {{item.monthly_sale}}</div>
          <div class="stock">库存 {{item.stock}}</div>
        </div>
        <div class="price-add dis-flex flex-middle flex-between">
          <div class="price">¥{{item.sku[item.skuIndex].price}}</div>
          <!-- <div class="add-btn">+</div> -->
          <div @click="selectClass(item)" v-if="item.hasMoreAttrs" class="btn dis-flex flex-middle flex-center">选规格</div>
          <div v-else class="select-num dis-flex flex-middle">
            <div v-if="item.num" @click="changeNum(item.index, item._index, -1, item.num, item)" class="change-num-btn">-</div>
            <div v-if="item.num" class="num">{{item.num}}</div>
            <div @click="changeNum(item.index, item._index, +1, item.num, item)" class="change-num-btn active">+</div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="no-list dis-flex vertical flex-middle flex-center flex">
      <div class="no-list-icon"></div>
      <div class="no-list-str">哎呀！商品还没添加</div>
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
      searchKey: '',
      // 黑色遮罩
      blackOff: false,
      // 加入购物车弹窗
      addCartOff: false,
      // 购物车列表
      cartListOff: false,
      // 当前选择商品信息
      nowSelectGoodsInfo: null
    }
  },
  computed: {
    searchResult () {
      return this.$store.getters.searchResult
    },
    allFoodNum () {
      return this.$store.getters.allFoodList.cartFoodNum
    },
    allFoodList () {
      return this.$store.getters.allFoodList.cartFoodList
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
  methods: {
    // 搜索
    search () {
      this.$store.commit('SET_SEARCH_KEY', this.searchKey)
    },
    // 清空搜索
    clearSearchKey () {
      this.searchKey = ''
      this.$store.commit('SET_SEARCH_KEY', '')
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
