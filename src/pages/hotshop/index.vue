<template>
  <div class="shop">
    <banner :banner="banner" />
    <base-shoplist :shopList="shopList"></base-shoplist>
  </div>
</template>

<script>
import banner from '@/components/bannerslide'
import BaseShoplist from '@/components/common/base-shop-list'
export default {
  components: {
    banner,
    BaseShoplist
  },

  data () {
    return {
      shopList: [],
      banner: '',
      page: 1,
      loading: false
    }
  },
  methods: {
    getShopList () {
      this.$http.post('/preferShop', {page: this.page}).then(res => {
        if (res.data.length) {
          this.shopList = this.shopList.concat(res.data)
          return
        }
        this.loading = true
        if (this.shopList.length) {
          wx.showToast({
            title: '没有更多商家了',
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
    getBanner () {
      this.$http.post('/slideShow').then(res => {
        this.banner = res.data
      })
    },
    jumpShop (item) {
      wx.navigateTo({
        url: `../shop/main?shopID=${item.id}`,
        success: result => {},
        fail: () => {},
        complete: () => {}
      })
    }
  },
  onReachBottom () {
    if (!this.loading) {
      this.page++
      this.getShopList()
    }
  },
  mounted () {
    this.getBanner()
    this.getShopList()
  }
}
</script>
<style lang="less" scoped>
@import "./style";
</style>