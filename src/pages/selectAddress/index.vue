<template>
  <div class="address">
    <div class="head-top">
      <div class="location-box" @click="selectAdr">
        <img src="http://p2.icaixiaochu.com/location.png" alt class="location-icon" />
        <p>{{curAddress.title}}</p>
      </div>
      <div class="form" @click="toSearchPage">
        <div class="input-wrp">
          <img src="../../../static/images/search-icon.png" alt />
          <input type="text" v-model="keyWords" placeholder="请输入地址"  class="input" />
        </div>
      </div>
    </div>
    <div class="cur-address" >{{curAddress.title}}</div>
    <div class="my-adress">
      <div class="top">
        <img src="https://img.icaixiaochu.com/user-icon.png" alt="">
        <p>我的收货地址</p>
      </div>
      <div class="address-list" v-if="myAddressList.length">
        <div class="address-item" v-for="(item, index) in myAddressList" :key="index" @click="selectAddress(item,1)">
          <div class="address-name">{{item.city + '   '+ item.address}}</div>
          <div class="address-info">
           <p class="user-name">{{item.name}}</p>
           <p class="user-tel">{{item.tel}}</p>
          </div>
        </div>
      </div>
      <div class="null-my-addres" v-else>
        <img src="https://img.icaixiaochu.com/%E8%B5%84%E6%BA%90%201.png" alt="">
        <p>您还没有收货地址，请添加</p>
      </div>
    </div>
    <div class="fj-adress">
      <div class="top">
        <img src="https://img.icaixiaochu.com/%E7%8A%B6%E6%80%81%E6%A0%8F@2x%20%281%29.png" alt="">
        <p>附近地址</p>
      </div>
      <div class="address-list">
        <div class="address-item" v-for="(item, index) in addressList" :key="index" @click="selectAddress(item)">
          <p class="address-name">{{item.title}}</p>
          <p class="address-des">
          {{item.address}}
          </p>
        </div>
      </div>
    </div>
    <div class="add-address">
     <img src="https://img.icaixiaochu.com/add-adr-icon.png" alt />
      <p>新增收货地址</p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { dobounce } from '../../utils/util'
import QQMapWX from 'wx-qqmap-jssdk'
const qqMapSdk = new QQMapWX({
  key: '5GXBZ-7PPWJ-UM6F2-K7AUH-KPQNQ-CFBE5'
})
export default {
  computed: {
    ...mapGetters(['curAddress'])
  },
  data () {
    return {
      city: [],
      keyWords: '',
      location: '',
      addressList: '',
      myAddressList: []
    }
  },
  methods: {
    myAddress () {
      this.$http.post('/fetchAddress').then(res => {
        this.myAddressList = res.data
      })
    },
    ...mapMutations({
      setCityname: 'SET_CITYNAME',
      setCity: 'SET_CITY',
      setAddress: 'SET_ADDRESS',
      setLocation: 'SET_LOCATION'
    }),
    selectAddress (item, type) {
      if (type) {
        wx.setStorageSync('location', {latitude: item.lat, longitude: item.lng})
      } else {
        wx.setStorageSync('location', {latitude: item.location.lat, longitude: item.location.lng})
      }
      let location = wx.getStorageSync('location')
      this.setLocation(location)
      this.setAddress(item)
      wx.navigateBack({ changed: true })
    },
    reverseGeocoder () {
      qqMapSdk.reverseGeocoder({
        get_poi: 1,
        location: wx.getStorageSync('location') || '',
        success: res => {
          this.addressList = res.result.pois
        }
      })
    },
    searchAddress () {
      console.log(1)
      let _this = this
      qqMapSdk.search({
        keyword: this.keyWords,
        boundary: 'region(广东,0)',
        success: function (res) {
          _this.addressList = res.data
        }
      })
    }
  },
  onShow () {
    let _this = this
    wx.getStorage({
      key: 'token',
      success: (result) => {
        if (result) {
          _this.myAddress()
        }
      },
      fail: () => {},
      complete: () => {}
    })
  },
  mounted () {
    this.reverseGeocoder()
    this.$watch(
      'keyWords',
      dobounce(newVal => {
        this.keyWords = newVal
        this.searchAddress()
      }, 100)
    )
  }
}
</script>
<style lang="less" scoped>
@import "./style.less";
</style>
