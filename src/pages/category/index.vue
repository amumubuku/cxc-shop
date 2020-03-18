<template>
  <div class="category-shop">
    <search-box></search-box>
    <div class="top-shop" @click="shopDetail" v-if="CategoryHotShop">
      <div class="shop-content">
        <div class="top-head">
          <div class="bg-cover">
            <img :src="curCategory.bg_cover" alt="">
          </div>
          <div class="badge-icon">
            <img src="https://img.icaixiaochu.com/yx-shop.png" alt />
          </div>
          <div class="shop-info">
            <div class="info-left">
              <img :src="CategoryHotShop.icon" alt />
            </div>
            <div class="info-right">
              <p>{{CategoryHotShop.title}}</p>
              <!-- <div class="shop-tag-list" v-if="false">
                <div class="tag-item">7.43折</div>
              </div>-->
            </div>
          </div>
        </div>
        <div class="food-list">
          <div
            class="food-item"
            v-for="(item,index) in CategoryHotShop.goods"
            :key="index"
            @click.stop="shopDetail(item)"
          >
            <div class="food-cover">
              <img :src="item.cover" alt />
            </div>
            <p class="food-name">{{item.title}}</p>
            <p class="food-price">￥{{item.price}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="category-wrp">
      <div class="categorys">
        <div class="all-category-box">
          <div class="icon">
            <img :src="curCategory.icon" alt />
          </div>
          <p>全部</p>
        </div>
        <div class="make-category"></div>
      </div>
      <div class="category-area-scroll">
        <scroll-view
          class="scroll"
          scroll-x
          style="width:100%"
          scroll-with-animation="true"
          :scroll-into-view="scrollId"
        >
          <div class="category-list">
            <div
              class="category-item"
              v-for="(item,index) in categoryList"
              :key="index"
              @click="changeCategory(item)"
              :id="'scroll' + item.id"
            >
              <div class="icon">
                <img :src="item.icon" alt />
              </div>
              <p
                class="category-name"
                :class="{activeColor : curCategory.id == item.id}"
              >{{item.title}}</p>
              <div class="active" v-if="item.id == curCategory.id"></div>
            </div>
          </div>
        </scroll-view>
      </div>
    </div>
    <div class="category-wrp new-category" v-if="scrollTop > fixTop && CategoryHotShop.length">
      <div class="categorys">
        <div class="all-category-box">
          <div class="icon">
            <img :src="curCategory.icon" alt />
          </div>
          <p>全部</p>
        </div>

        <div class="make-category"></div>
      </div>
      <div class="category-area-scroll">
        <scroll-view
          class="scroll"
          scroll-x
          style="width:100%"
          scroll-with-animation="true"
          :scroll-into-view="scrollId"
        >
          <div class="category-list">
            <div
              class="category-item"
              v-for="(item,index) in categoryList"
              :key="index"
              @click="changeCategory(item)"
              :id="'scroll' + item.id"
            >
              <div class="icon">
                <img :src="item.icon" alt />
              </div>
              <p
                class="category-name"
                :class="{activeColor : curCategory.id == item.id}"
              >{{item.title}}</p>
              <div class="active" v-if="item.id == curCategory.id"></div>
            </div>
          </div>
        </scroll-view>
      </div>
    </div>
    <div class="null-category-shop" v-if="shopList.length < 1">
        <img src="https://img.icaixiaochu.com/null-category.png" alt="">
        <p>产品筹备中，敬请关注</p>
    </div>
    <shop-list :shops="shopList"></shop-list>
  </div>
</template>
<script>
import shopList from '@/components/common/shop-list'
import searchBox from '@/components/common/search-box'
export default {
  components: { shopList, searchBox },
  data () {
    return {
      curCategory: 0,
      fixTop: 0,
      scrollTop: 0,
      categoryList: [],
      page: 1,
      shops: [],
      loading: false,
      shopList: [],
      CategoryHotShop: '',
      scrollId: 'scroll0'
    }
  },
  onUnload () {
    Object.assign(this, this.$options.data())
  },
  methods: {
    getCategoryList () {
      this.$http.post('/fetchNav').then(res => {
        this.categoryList = res.data
        this.getShopList()
      })
    },
    getCategoryHotShop () {
      this.$http
        .post('/goodShop', { nav_id: this.curCategory.id })
        .then(res => {
          this.CategoryHotShop = res.data
        })
    },
    changeCategory (item) {
      this.curCategory = item
      this.page = 1
      this.shopList = []
      this.getShopList()
      this.getCategoryHotShop()
    },
    getShopList () {
      this.$http
        .post('/fetchShopList', {
          page: this.page,
          nav_id: this.curCategory.id
        })
        .then(res => {
          if (res.data.length && !this.loading) {
            this.shopList = this.shopList.concat(res.data)
            return
          } else {
            this.shopList = res.data
          }
          this.loading = true
          if (this.shopList.length && !this.loading) {
            wx.showToast({
              title: '没有更多商家',
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
    shopDetail (item) {
      wx.navigateTo({
        url: `../shop/main?shopId=${this.CategoryHotShop.id}`,
        success: result => {},
        fail: () => {},
        complete: () => {}
      })
    }
  },
  onReachBottom () {
    if (!this.loading) {
      this.page++
      this.fetchShopList()
    }
  },
  mounted () {
    this.curCategory = JSON.parse(this.$root.$mp.query.item)
    var query = wx.createSelectorQuery()
    query
      .select('.category-wrp')
      .boundingClientRect(res => {
        this.fixTop = res.top
      })
      .exec()
    this.getCategoryList()
    this.getCategoryHotShop()
  },
  onPageScroll (e) {
    this.scrollTop = e.scrollTop + 52
  },
  watch: {
    curCategory: {
      handler: function (newVal, oldVal) {
        this.scrollId = `scroll${newVal >= 4 ? 4 - 1 : 0}`
      },
      deep: true
    }
  }
}
</script>

<style lang="less" >
@import "./style";
</style>
