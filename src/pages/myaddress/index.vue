<template>
  <div class="my-address">
    <div class="address-list" v-if="address.length">
      <div
        class="address-item"
        v-for="(item, index) in address"
        :key="index"
        @click="selectAddress(item)"
      >
        <div class="address-info">
          <div class="top">
            <div class="user-info">
              <div class="user-name">{{item.name}}</div>
              <div class="user-phone">{{item.tel}}</div>
            </div>
            <div class="address-tag">
              <div
                class="tag"
                :style="{background: item.label === 0 ? '#FF9F1E' :item.label === 1? '#4FBC82' :item.label === 2 ? '#3694FF' : '#fff',color:item.label ===3 ? '#787878': '#fff',border:item.label===3? '1px solid #787878': 'none',boxSizing:item.label===3 ? 'border-box':'content-box',lineHeight:item.label===3 ? '16px' : '18px' }"
              >{{item.label ==0?'住宿':item.label==1? '学校':item.label==2?'公司':'其他'}}</div>
            </div>
          </div>
          <div class="address">
           {{item.address + item.city}}
          </div>
        </div>
        <div class="address-func">
          <div class="delete" @click.stop="deleteAddress(item.id)">
            <img src="../../../static/images/detele.png" mode="aspectFit" alt />
          </div>
          <div class="edit" @click.stop="edit(item)">
            <img src="../../../static/images/edit.png" mode="aspectFit" alt />
          </div>
        </div>
      </div>
    </div>
    <div class="null-address" v-else>
      <img src="https://img.icaixiaochu.com/%E8%B5%84%E6%BA%90%201.png" alt />
      <span>您还没有收货地址!马上添加吧!</span>
    </div>
    <div class="add-address" @click="addAddress">
      <img src="../../../static/images/add-adr.png" alt />
      <p>新增收货地址</p>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      address: []
    }
  },
  computed: {
    // ...mapGetters(['data'])
  },
  components: {},
  onShow () {
    this.getAddress()
  },
  onPullDownRefresh () {
    this.getAddress()
  },
  methods: {
    selectAddress (item) {
      var pages = getCurrentPages()
      var currentPage = pages[pages.length - 2]
      var url = currentPage.route
      if (url === 'pages/submitOrder/main') {
        this.setShipping(item)
        wx.navigateBack({ changed: true })
      }
    },
    edit (item) {
      wx.navigateTo({
        url: `../addaddress/main?id=${item.id}&edit=true`
      })
    },
    deleteAddress (addressid) {
      var _this = this
      wx.showModal({
        title: '提示',
        content: '确定删除收货地址?',
        success (res) {
          if (res.confirm) {
            _this.$http
              .post('/removeAddress', {
                address_id: addressid
              })
              .then(res => {
                _this.getAddress()
              })
          } else if (res.cancel) {
          }
        }
      })
    },
    addAddress () {
      wx.navigateTo({
        url: `../addaddress/main`
      })
    },
    ...mapMutations({
      setShipping: 'SET_SHOP_ADR'
    }),
    getAddress () {
      this.$http.post('/fetchAddress').then(res => {
        this.address = res.data
        wx.stopPullDownRefresh()
      })
    }
  }
}
</script>
<style lang="less">
@import "./style";
</style>
