<template>
  <div class="add-address">
    <form @submit="savaaddress" class="address-wrp">
      <div class="address-item">
        <p>联系人</p>
        <div class="input-content">
          <input type="text" placeholder="姓名" v-model="formData.name" />
        </div>
      </div>
      <div class="address-item">
        <p>手机号码</p>
        <div class="input-content">
          <input type="number" placeholder="11位电话号码" v-model="formData.tel" />
        </div>
      </div>
      <div class="select-city" @click="chooseAddr">
        <div class="select-row">
          <img class="location-icon" src="../../../static/images/location.png" alt />
          <p class="city">选择地址</p>
          <p class="address">{{formData.city}}</p>
          <div class="select-btn" v-if="!formData.city">点击选择</div>
        </div>
        <div class="select-icon">
          <img src="http://p2.icaixiaochu.com/more.png" alt />
        </div>
      </div>
      <div class="address-item">
        <p>楼号门牌:</p>
        <div class="input-content">
          <input type="text" placeholder="详细地址，例A栋7层711室" v-model="formData.address" />
        </div>
      </div>
      <div class="address-type">
        <p>地址类型:</p>
        <div class="label-list">
          <div class="label-item" :class="formData.label == 0 ? 'active' : ''" @click="toggle(0)">住宅</div>
          <div
            class="label-item"
            :class="formData.label == 1 ? 'active1' : ''"
            @click="toggle(1)"
          >学校</div>
          <div
            class="label-item"
            :class="formData.label == 2 ? 'active2' : ''"
            @click="toggle(2)"
          >公司</div>
          <div
            class="label-item"
            :class="formData.label == 3 ? 'active3' : ''"
            @click="toggle(3)"
          >其他</div>
        </div>
      </div>
    </form>
    <div class="address-area">
      <div class="sava-address" @click="saveAddress">保存地址</div>
      <div class="detele-address" v-if="isEdit" @click="deleteAddress">删除</div>
    </div>
  </div>
</template>

<script>
import WeValidator from 'we-validator'
export default {
  data () {
    return {
      formData: {
        name: '',
        city: '',
        address: '',
        tel: '',
        label: 0,
        lng: 0,
        lat: 0
      },
      isEdit: false,
      addressId: ''
    }
  },
  methods: {
    change (e) {
      this.formData.is_default = e.mp.detail.value
    },
    chooseAddr () {
      let _this = this
      wx.getSetting({
        success (res) {
          if (res.authSetting['scope.userLocation']) {
            wx.chooseLocation({
              success: res => {
                _this.formData.lat = res.latitude
                _this.formData.lng = res.longitude
                _this.formData.city = res.name
              }
            })
          } else {
            wx.showModal({
              title: '',
              content: '添加地址需要获取的地理位置,请授权小程序获取你的位置',
              showCancel: false,
              confirmText: '确定',
              confirmColor: '#FEA835',
              success: result => {
                wx.openSetting({
                  success: result => {
                    if (result.authSetting['scope.userLocation']) {
                      wx.chooseLocation({
                        success: res => {
                          let pos = {
                            lat: res.latitude.toString(),
                            lng: res.longitude.toString()
                          }
                          let address = res.name
                          _this.formData.lng = pos.lng
                          _this.formData.lat = pos.lat
                          _this.formData.city = address
                        }
                      })
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        image: '',
                        duration: 1500,
                        mask: false,
                        success: result => {},
                        fail: () => {},
                        complete: () => {}
                      })
                    }
                  },
                  fail: () => {},
                  complete: () => {}
                })
              },
              fail: () => {},
              complete: () => {}
            })
          }
        }
      })
    },

    initValidator () {
      this.validatorInstance = new WeValidator({
        rules: {
          name: {
            required: true
          },
          tel: {
            required: true,
            mobile: true
          },
          city: {
            required: true
          },
          address: {
            required: true
          },
          label: {
            required: true,
            number: true
          },
          lng: {
            required: true,
            number: true
          },
          lat: {
            required: true,
            number: true
          }
        },
        messages: {
          name: {
            required: '请填写收货人名'
          },
          lng: {
            required: '添加地址发送错误'
          },
          lat: {
            required: '添加地址发送错误'
          },
          tel: {
            required: '请输入手机号',
            mobile: '手机号格式不正确'
          },
          city: {
            required: '请选择城市'
          },
          address: {
            required: '请填写详细收货地址'
          }
        }
      })
    },
    toggle (index) {
      this.formData.label = index
    },
    deleteAddress () {
      let _this = this
      wx.showModal({
        title: '确定删除地址?',
        content: '删除地址后不可恢复',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {
          if (result.confirm) {
            _this.$http.post('/removeAddress', {address_id: _this.addressId}).then(res => {
              if (res.status === 1) {
                wx.navigateBack({ changed: true })
              }
            })
          }
        },
        fail: () => {},
        complete: () => {}
      })
    },
    saveAddress () {
      if (!this.validatorInstance.checkData(this.formData)) {
        return
      }
      this.$http.post('/editAddress', this.formData).then(res => {
        if (res.status === 1) {
          wx.navigateBack({ changed: true })
        }
      })
    },
    getAddressInfo () {
      this.$http
        .post('/getAdr', {
          address_id: this.addressId
        })
        .then(res => {
          let address = res.data
          if (address.is_default) {
            address.is_default = true
          }
          address.address_id = address.id
          this.formData = address
        })
    }
  },
  onUnload () {
    Object.assign(this, this.$options.data())
  },
  mounted () {
    let addressId = this.$root.$mp.query.id
    this.isEdit = !!this.$root.$mp.query.edit || false
    if (addressId) {
      this.addressId = addressId
      this.getAddressInfo()
    }
    this.initValidator()
  }
}
</script>
<style lang="less">
@import "./style.less";
</style>
