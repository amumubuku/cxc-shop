<template>
  <div class="app">
    <div class="header">
      <div class="location" @click="selectAdr">
        <img
          src="/static/images/new-location.png"
          mode="aspectFill"
          class="location-icon"
          alt=""
        />
        <div class="location-title">
          {{ curAddress ? curAddress.title : curAddress.city }}
        </div>
        <img
          src="/static/images/new-more.png"
          mode="aspectFill"
          class="location-arrow"
          alt=""
        />
      </div>
      <div class="search-box" @click="toSearchPage">
        <img src="/static/images/new-search.png" mode="aspectFill" alt="" />
        <p>湘味老坛酸菜鱼</p>
      </div>
    </div>
    <div class="content-wrp">
      <div class="category">
        <swiper
          @change="categoryChange"
          :current="currentCategoryIndex"
          class="category-wrap"
        >
          <swiper-item
            class="category-list"
            v-for="(item, index) in category"
            :key="index"
            @click="jumpCategory(item)"
          >
            <div class="category-item" v-for="(ele, k) in item" :key="k">
              <img :src="ele.icon" alt mode="aspectFit" />
              <p>{{ ele.title }}</p>
            </div>
          </swiper-item>
        </swiper>
        <div class="dots">
          <span
            class="dot"
            v-for="(item, index) in category"
            :key="index"
            :class="[index === currentCategoryIndex ? 'disable' : '']"
          ></span>
        </div>
      </div>
      <div class="activity-wrap">
        <div class="left" @click="navTo('../hotshop/main')">
          <img
            src="https://demoaz.oss-cn-beijing.aliyuncs.com/activity-bg-1.png"
            mode="aspectFill"
            alt=""
          />
        </div>
        <div class="right">
          <div class="top" @click="navTo()">
            <img
              src="https://demoaz.oss-cn-beijing.aliyuncs.com/activity-bg-3.png"
              mode="aspectFill"
              alt=""
            />
          </div>
          <div class="bottom" @click="navTo()">
            <img
              src="https://demoaz.oss-cn-beijing.aliyuncs.com/activity-bg-2.png"
              mode="aspectFill"
              alt=""
            />
          </div>
        </div>
      </div>
      <div v-if="false" class="distribution dis-flex flex-middle flex-between">
        <div class="dis-flex vertical flex-middle">
          <div class="distribution-money">
            {{ incomeStatisticsData.today_income }}
          </div>
          <div class="distribution-title">今日收益</div>
        </div>
        <div @click="toRank" class="dis-flex vertical flex-middle">
          <div class="distribution-rank-icon"></div>
          <div class="distribution-title">收益排行</div>
        </div>
        <div
          @click="toMyIncome"
          class="dis-flex vertical flex-middle item-a"
        ></div>
      </div>
      <div class="good-shop">
        <title :info="activity" />
        <div class="optimal-shop">
          <scroll-view width="100%" class="scroll" scroll-x="true">
            <div class="shop-list">
              <div
                class="shop-item"
                v-for="(item, index) in hotShop"
                :key="index"
                @click.stop="shopDetail(item)"
              >
                <div class="food-cover">
                  <img
                    :src="item.good[0].cover"
                    alt
                   mode="aspectFill"
                  />
                </div>

                <div class="shop-info">
                  <p class="shop-name">{{ item.title }}</p>
                  <p class="price-box">
                    <span class="tip">￥</span
                    ><span class="price">{{ item.good[0].price }}</span>
                  </p>
                </div>
              </div>
            </div>
          </scroll-view>
        </div>
      </div>
      <banner :banner="banner" />
      <div class="errand-box">
        <title :info="errand" />
        <div class="service-list">
          <div
            class="service-item"
            v-for="(item, index) in services"
            :key="index"
            @click="navTo()"
          >
            <!-- <p class="title">{{ item.title }}</p>
            <p class="des">{{ item.des }}</p> -->
            <img :src="item.icon" alt="" />
          </div>
        </div>
      </div>
      <div class="shop-wrp">
        <sort-shop @sort="sortScorll" ref="shopList"></sort-shop>
      </div>
    </div>
    <div class="auth-location" v-if="!authLocation">
      <div class="icon">
        <img
          src="https://img.icaixiaochu.com/%E8%B5%84%E6%BA%90%205.png"
          mode="widthFix"
          alt
        />
      </div>
      <h3>定位服务未开启</h3>
      <p class="des">
        请在设置>微信定位>服务开启，同时在 小程序中开通定位服务。小厨知道你的
        位置才能提供更好的服务
      </p>
      <button open-type="openSetting" @opensetting="opensetting">
        开通小程序权限
      </button>
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
      banner: [{image: 'https://img.icaixiaochu.com/banner-v2.png'}],
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
      parentId: null,
      currentCategoryIndex: 0,
      errand: {
        icon: 'https://img.icaixiaochu.com/Errands@3x@2x.png',
        title: '跑腿服务'
      },
      activity: {
        icon: 'https://img.icaixiaochu.com/activity@3x@2x.png',
        title: '为你推荐'
      },
      services: [
        {
          title: '帮我买',
          des: '药品/文具',
          icon: 'https://img.icaixiaochu.com/service1.png',
          path: ''
        },
        {
          title: '帮我买',
          des: '药品/文具',
          icon: 'https://img.icaixiaochu.com/service2.png',
          path: ''
        },
        {
          title: '帮我买',
          des: '药品/文具',
          icon: 'https://img.icaixiaochu.com/service3.png',
          path: ''
        }
      ]
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
    if (
      wx.getStorageSync('userInfo') &&
      wx.getStorageSync('userInfo').user_id
    ) {
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
        success: (result) => {
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

    this.$http.post('/centerTitle').then((res) => {
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
    categoryChange (e) {
      this.currentCategoryIndex = e.mp.detail.current
    },

    // 我的收入
    toMyIncome () {
      wx.navigateTo({
        url: `../myIncome/main`
      })
    },

    navTo (path) {
      if (path) {
        wx.navigateTo({
          url: path
        })
      } else {
        wx.showToast({
          title: '功能开发中...',
          icon: 'none',
          image: '',
          duration: 1500,
          mask: false,
          success: (result) => {},
          fail: () => {},
          complete: () => {}
        })
      }
    },

    // 排行榜
    toRank () {
      wx.navigateTo({
        url: `../rank/main`
      })
    },

    // 绑定关系
    async bindParent (id) {
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
          success: (result) => {
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
        success: (result) => {},
        fail: () => {},
        complete: () => {}
      })
    },
    reverseGeocoder () {
      qqMapSdk.reverseGeocoder({
        get_poi: 1,
        location: wx.getStorageSync('location') || '',
        success: (res) => {
          this.setAddress(res.result.pois[0])
        },
        fail: (err) => {
          if (err.message === 'getLocation:fail auth deny') {
            this.authLocation = false
          }
        }
      })
    },
    home () {
      this.$http.post('/indexShow').then((res) => {
        let data = res.data
        // this.banner = data.slide_show
        let category = []
        for (var i = 0; i < data.nav.length; i += 5) {
          category.push(data.nav.slice(i, i + 5))
        }
        this.category = category
        this.hotShop = data.good_shop
        wx.stopPullDownRefresh()
      })
    },
    toSearchPage () {
      wx.navigateTo({
        url: '../search/main',
        success: (result) => {},
        fail: () => {},
        complete: () => {}
      })
    },
    selectAdr () {
      wx.navigateTo({
        url: '../selectAddress/main',
        success: (result) => {},
        fail: () => {},
        complete: () => {}
      })
    },
    jumpCategory (item) {
      let category = JSON.stringify(item)
      wx.navigateTo({
        url: `../category/main?item=${category}`,
        success: (result) => {},
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
<style lang="less">
@import "./style";
</style>
