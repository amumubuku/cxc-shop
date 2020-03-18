<template>
  <div class="search">
    <div class="search-box">
      <img src="../../../static/images/search-icon.png" alt />
      <input type="text" v-model="keyWords" placeholder="请搜索商品" />
    </div>
    <div class="search-wrp" v-show="!keyWords">
      <div class="search-hitory" v-if="hitory.length && !shopinfo">
        <div class="head-title">
          <p>历史搜索</p>
          <img src="../../../static/images/detele.png" alt />
        </div>
        <div class="search-list">
          <div class="item" v-for="(item,index) in hitory" :key="index" @click="keyWords = item">{{item}}</div>
        </div>
      </div>
      <div class="search-hot" v-if="!shopinfo">
        <div class="head-title">
          <p>热门搜索</p>
        </div>
        <div class="search-list">
          <div
            class="item"
            v-for="(item,index) in hotSearch"
            :key="index"
            @click="keyWords = item"
          >{{item}}</div>
        </div>
      </div>
    </div>
    <div class="search-results" v-show="keyWords">
      <scroll-view scroll-y="true" style="height:100%;">
        <div class="search-shop-wrp" v-if="!shopinfo">
          <base-shoplist :shopList="shops" v-if="shops.length"></base-shoplist>
          <div class="search-shop-shop-null" v-else>
            <div class="content-wrp">
              <div class="icon">
                <img src="https://img.icaixiaochu.com/%E8%B5%84%E6%BA%90%204.png"  mode="widthFix" alt />
              </div>
              <p>该商店内没有相关的商品哦~</p>
            </div>
          </div>
        </div>

        <food-list :shop="shopinfo" :foodList="foodList" v-if="foodList.length"></food-list>
        <div class="recommend-shop" v-if="!shopinfo && recommendShop.length">
          <p class="title">热门商家</p>
          <shop-list :shops="recommendShop"></shop-list>
        </div>
      </scroll-view>
    </div>
    <div class="search-shop-food-null" v-if="foodList.length < 1 && keyWords && shopId">
      <div class="content-wrp">
        <div class="icon">
          <img src="https://img.icaixiaochu.com/%E8%B5%84%E6%BA%90%203.png" mode="widthFix" alt />
        </div>
        <p>该商店内没有相关的商品哦~</p>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import foodList from '@/components/common/food-list'
import BaseShoplist from '@/components/common/base-shop-list'
import shopList from '@/components/common/shop-list'
import { dobounce } from '../../utils/util'
export default {
  components: { foodList, BaseShoplist, shopList },
  computed: {
    ...mapGetters(['hitory'])
  },
  data () {
    return {
      text: '搜索商品',
      keyWords: '',
      hotSearch: [],
      searchResult: [],
      recommendShop: [],
      searchState: false,
      shops: [],
      foodList: [],
      shopinfo: ''
    }
  },
  onUnload () {
    Object.assign(this, this.$options.data())
  },
  methods: {
    searchFood () {
      this.$http
        .post('/shopSearch', { shop_id: this.shopinfo.id, key: this.keyWords })
        .then(res => {
          this.foodList = res.data
        })
    },
    searchShop () {
      this.$http.post('/keySearch', { key: this.keyWords }).then(res => {
        if (res.data.length) {
          this.saveSearchHitory(this.keyWords)
          this.shops = res.data
        } else {
          this.recommend()
        }
      })
    },
    empty () {
      this.searchState = false
      this.keyWords = ''
      this.searchResult = []
    },
    HotSearch () {
      this.$http.post('/searchHot').then(res => {
        this.hotSearch = res.data
      })
    },

    clearHistory () {
      this.clearSearchHitory()
    },
    recommend () {
      this.shops = []
      this.$http.post('/guessLike').then(res => {
        this.recommendShop = res.data
      })
    },
    search (item) {
      this.keyWords = item
      if (this.shopinfo) {
        this.searchFood()
      } else {
        this.searchShop()
      }
    },

    ...mapActions([
      'saveSearchHitory',
      'clearSearchHitory',
      'deleteSearchHitory'
    ])
  },
  mounted () {
    this.shopinfo = this.$root.$mp.query.shopDetail ? JSON.parse(this.$root.$mp.query.shopDetail) : ''
    this.HotSearch()
    this.$watch(
      'keyWords',
      dobounce(newVal => {
        if (!newVal) return
        this.search(newVal)
      }, 500)
    )
  }
}
</script>
<style lang="less" scoped>
@import "./style";
</style>
