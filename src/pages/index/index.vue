<template>
  <div class="app">
    <div class="header">
      <div class="header-wrp">
        <div class="location-box" @click="selectAdr">
          <img class="location-icon" src="https://img.icaixiaochu.com/location.v2.png" alt />
          <p>{{curAddress.title ? curAddress.title : curAddress.city}}</p>
          <img src="http://p2.icaixiaochu.com/down.png" alt />
        </div>
        <form class="form" @click="toSearchPage">
          <div class="input-box">
            <img src="../../../static/images/search-icon.png" alt />
            <span>搜索商品</span>
          </div>
        </form>
      </div>
    </div>
    <div class="content-wrp">
      <banner :banner="banner" />
      <div class="category">
        <div class="category-wrp">
          <div
            class="category-item"
            v-for="(item,index) in category"
            :key="index"
            @click="jumpCategory(item)"
          >
            <img :src="item.icon" alt mode="aspectFit" />
            <p>{{item.title}}</p>
          </div>
        </div>
      </div>
      <div v-if="incomeStatisticsData" class="distribution dis-flex flex-middle flex-between">
        <div class="dis-flex vertical flex-middle">
          <div class="distribution-money">{{incomeStatisticsData.today_income}}</div>
          <div class="distribution-title">今日收益</div>
        </div>
        <div @click="toRank" class="dis-flex vertical flex-middle">
          <div class="distribution-rank-icon"></div>
          <div class="distribution-title">收益排行</div>
        </div>
        <div @click="toMyIncome" class="dis-flex vertical flex-middle item-a"></div>
      </div>
      <div class="good-shop">
        <title v-if="appInfo && appInfo.good_shop" :info="{'title': appInfo.good_shop.father,'des':appInfo.good_shop.son}" page="../hotshop/main" />
        <div class="optimal-shop">
          <scroll-view width="100%" class="scroll" scroll-x="true">
            <div class="shop-list">
              <div
                class="shop-item"
                v-for="(item,index) in hotShop "
                :key="index"
                @click.stop="shopDetail(item)"
              >
                <div class="top"></div>
                <div class="shop-cover">
                  <img :src="item.icon" alt />
                  <div class="shop-tag-list">
                    <div
                      class="tag-item"
                      v-for="(item, k) in item.label"
                      :key="k"
                      :style="{color:item.title_color,borderColor:item.border_color}"
                    >{{item.title}}</div>
                  </div>
                </div>
                <img :src="item.good[0].cover" alt class="food-cover" />
                <div class="shop-info">
                  <p class="shop-name">{{item.title}}</p>
                  <span>{{item.announcement}}</span>
                </div>
              </div>
            </div>
          </scroll-view>
        </div>
      </div>
      <div class="shop-wrp">
        <title v-if="appInfo" :info="{'title': appInfo.title,'des': appInfo.description}" />
        <sort-shop @sort="sortScorll" ref="shopList"></sort-shop>
      </div>
    </div>
    <div class="auth-location" v-if="!authLocation">
      <div class="icon">
        <img src="https://img.icaixiaochu.com/%E8%B5%84%E6%BA%90%205.png" mode="widthFix" alt />
      </div>
      <h3>定位服务未开启</h3>
      <p class="des">
        请在设置>微信定位>服务开启，同时在
        小程序中开通定位服务。小厨知道你的
        位置才能提供更好的服务
      </p>
      <button open-type="openSetting" @opensetting="opensetting">开通小程序权限</button>
    </div>
  </div>
</template>
<script>
import banner from '@/components/bannerslide'
import title from '@/components/title'
import { mapGetters, mapMutations } from 'vuex'
import QQMapWX from 'wx-qqmap-jssdk'
import sortShop from '@/components/common/sort-shop'
const qqMapSdk = new QQMapWX({
  key: '5GXBZ-7PPWJ-UM6F2-K7AUH-KPQNQ-CFBE5'
})
export default {
  data () {
    return {
      category: [],
      banner: [],
      limit: [],
      loading: false,
      address: '',
      scrollTop: 0,
      maskClass: 'none',
      active: false,
      hotShop: [],
      shoplist: [],
      authLocation: true,
      appInfo: '',
      incomeStatisticsData: null,
      parentId: null
    }
  },
  computed: {
    ...mapGetters(['curAddress', 'location'])
  },
  components: {
    banner,
    title,
    sortShop
  },
  onLoad (option) {
    if (option.id) {
      this.parentId = option.id
    }
  },
  onShow () {
    if (wx.getStorageSync('userInfo') && wx.getStorageSync('userInfo').user_id) {
      if (this.parentId) {
        this.bindParent(this.parentId)
      }
      this.incomeStatistics()
    } else {
      if (this.parentId) {
        wx.setStorageSync('parent_id', this.parentId)
      }
    }
  },
  mounted (option) {
    if (wx.getStorageSync('location')) {
      this.home()
      this.reverseGeocoder()
      this.$refs.shopList.fetchShopList()
    } else {
      wx.getLocation({
        type: 'gcj02',
        altitude: false,
        success: result => {
          let location = {
            latitude: result.latitude,
            longitude: result.longitude
          }
          wx.setStorageSync('location', location)
          this.home()
          this.reverseGeocoder()
          this.$refs.shopList.fetchShopList()
        },
        fail: () => {
          this.authLocation = false
        },
        complete: () => {}
      })
    }

    this.$http.post('/centerTitle').then(res => {
      this.appInfo = res.data
    })
  },
  methods: {

    // 收益统计
    async incomeStatistics () {
      try {
        let { data } = await this.$http.post('/incomeStatistics')
        this.incomeStatisticsData = data
      } catch (err) {
        console.log('获取收益统计失败', err)
      }
    },

    // 我的收入
    toMyIncome () {
      wx.navigateTo({
        url: `../myIncome/main`
      })
    },

    // 排行榜
    toRank () {
      wx.navigateTo({
        url: `../rank/main`
      })
    },

    // 绑定关系
    async bindParent (id) {
      wx.showModal({
        title: '绑定id',
        content: '' + id,
        showCancel: false
      })
      try {
        await this.$http.post('/bindParent', {
          parent_id: id
        })
      } catch (err) {
        console.log('绑定关系', err)
      }
    },

    opensetting (e) {
      this.authLocation = e.mp.detail.authSetting['scope.userLocation']
      if (this.authLocation) {
        wx.getLocation({
          type: 'gcj02',
          altitude: false,
          success: result => {
            this.authLocation = true
            wx.setStorageSync('location', result)
            this.home()
            this.$refs.shopList.fetchShopList()
            this.reverseGeocoder()
          },
          fail: () => {
            this.authLocation = false
          },
          complete: () => {}
        })
      }
    },
    transitionEnd () {
      if (!this.show) {
        this.componentDisplay = 'none'
      }
    },
    toggle (type) {
      if (type === 'hide') {
        this.show = false
      } else if (type === 'show') {
        this.show = true
      } else {
        this.show = !this.show
      }

      if (this.show) {
        this.componentDisplay = 'block'
      }
    },
    clickMask () {
      let clickMaskClose = this.clickMaskClose
      if (clickMaskClose) {
        this.toggle('hide')
      }
    },
    sortShop () {
      this.maskClass = 'active'
      wx.pageScrollTo({
        scrollTop: this.scrollTop,
        duration: 300
      })
    },
    shopDetail (item) {
      wx.navigateTo({
        url: `../shop/main?shopId=${item.shop_id}`,
        success: result => {},
        fail: () => {},
        complete: () => {}
      })
    },
    reverseGeocoder () {
      qqMapSdk.reverseGeocoder({
        get_poi: 1,
        location: wx.getStorageSync('location') || '',
        success: res => {
          this.setAddress(res.result.pois[0])
        },
        fail: err => {
          if (err.message === 'getLocation:fail auth deny') {
            this.authLocation = false
          }
        }
      })
    },
    home () {
      this.$http.post('/indexShow').then(res => {
        let data = res.data
        this.banner = data.slide_show
        this.category = data.nav
        this.hotShop = data.good_shop
        wx.stopPullDownRefresh()
      })
    },
    toSearchPage () {
      wx.navigateTo({
        url: '../search/main',
        success: result => {},
        fail: () => {},
        complete: () => {}
      })
    },
    selectAdr () {
      wx.navigateTo({
        url: '../selectAddress/main',
        success: result => {},
        fail: () => {},
        complete: () => {}
      })
    },
    jumpCategory (item) {
      let category = JSON.stringify(item)
      wx.navigateTo({
        url: `../category/main?item=${category}`,
        success: result => {},
        fail: () => {},
        complete: () => {}
      })
    },
    ...mapMutations({
      setCityname: 'SET_CITYNAME',
      setCity: 'SET_CITY',
      setAddress: 'SET_ADDRESS'
    })
  },
  onPullDownRefresh () {
    this.$refs.shopList.page = 1
    this.$refs.shopList.loading = false
    this.$refs.shopList.shoplist = []
    this.$refs.shopList.fetchShopList()
    this.home()
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: '叮叮点外卖',
      path: 'pages/index/main'
    }
  },
  watch: {
    location (newVal, oldVal) {
      this.home()
      this.loading = false
      this.$refs.shopList.page = 1
      this.$refs.shopList.shoplist = []
      this.$refs.shopList.fetchShopList()
    }
  }
}
</script>
<style lang="less" scoped>
@import "./style";
</style>
