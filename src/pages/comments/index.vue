<template>
  <div class="order-comments">
    <div class="head-title">您对商家/菜品满意吗？</div>
    <div class="order-centent">
      <div class="shop-flex">
        <div class="shop-cover">
          <img :src="shop.icon" alt />
        </div>
        <p class="shop-name">{{shop.title}}</p>
      </div>
      <div class="hide-comments" @click="take = !take">
        <div class="icon">
          <i class="circle-icon" :class="{'take-active' : take}"></i>
        </div>
        <p>匿名评价</p>
      </div>
    </div>
    <div class="rate-wrp">
      <div class="rate-shop-item">
        <p class="title" v-if="shopLevel">{{LevelText[shopLevel]}}</p>
        <div class="rate-list">
          <li v-for="(item, index) in 5" :key="index" class="rate-item">
            <img
              src="../../../static/images/rate.png"
              v-if="index < shopLevel"
              @click="changedRateLevel(index,0)"
              alt
            />
            <img src="../../../static/images/unRate.png" v-else @click="changedRateLevel(index,0)" alt />
          </li>
        </div>
      </div>
      <div class="rate-item" v-if="shopLevel">
        <p class="label">包装</p>
        <li v-for="(item, index) in 5" :key="index" class="rate-level">
          <img
            src="../../../static/images/rate.png"
            v-if="index < packagingLevel"
            @click="changedRateLevel(index,1)"
            alt
          />
          <img src="../../../static/images/unRate.png" v-else @click="changedRateLevel(index,1)" alt />
        </li>
        <p class="Level-text">{{LevelText[packagingLevel]}}</p>
      </div>
      <div class="rate-item" v-if="shopLevel">
        <p class="label">口味</p>
        <li v-for="(item, index) in 5" :key="index" class="rate-level">
          <img
            src="../../../static/images/rate.png"
            v-if="index < tasteLevel"
            @click="changedRateLevel(index,2)"
            alt
          />
          <img src="../../../static/images/unRate.png" v-else @click="changedRateLevel(index,2)" alt />
        </li>
        <p class="Level-text">{{LevelText[tasteLevel]}}</p>
      </div>
    </div>
    <div class="text-box" v-if="shopLevel">
      <textarea
        placeholder="商品满足您的期待吗？说说你的感受吧"
        auto-focus
        v-model="text"
        class="text"
        maxlength="5000"
      />
    </div>
    <div class="feedback-imgs" v-if="shopLevel">
      <p class="title">相关截图（选填）</p>
      <div class="img-list">
        <div
          class="img-item"
          v-for="(item, index) in selectImgs"
          :key="index"
          @click="previewImage(item)"
        >
          <img :src="item" alt />
          <div class="delete" @click.stop="deteleImg(index)">
            <img src="https://img.icaixiaochu.com/detele-icon.png" alt />
          </div>
        </div>
        <div class="select-img" @click="chooseImage">
          <img src="https://img.icaixiaochu.com/camera-icon.png" alt />
          <p>添加图片</p>
        </div>
      </div>
    </div>
    <div class="submit" @click="submit">提交</div>
  </div>
</template>

<script>
export default {
  components: {},

  data () {
    return {
      selectImgs: [],
      text: '',
      shop: '',
      orderDetail: '',
      shopLevel: 0,
      packagingLevel: 1,
      uploadImgs: '',
      take: true,
      tasteLevel: 1,
      LevelText: ['', '“长路漫漫”', '“差强人意”', '“上下求索”', '“差之毫厘”', '“妙不可言”']
    }
  },
  methods: {
    changedRateLevel (index, type) {
      let level = index + 1
      if (type === 0) {
        this.shopLevel = level
      } else if (type === 1) {
        this.packagingLevel = level
      } else {
        this.tasteLevel = level
      }
    },
    deteleImg (index) {
      this.selectImgs.splice(index, 1)
      this.uploadImgs.splice(index, 1)
    },
    chooseImage () {
      let _this = this
      if (_this.selectImgs.length >= 3) {
        wx.showToast({
          title: '只能上传3张图片',
          icon: 'none',
          image: '',
          duration: 1500,
          mask: false,
          success: result => {},
          fail: () => {},
          complete: () => {}
        })
        return
      }
      wx.chooseImage({
        count: 3 - _this.selectImgs.length,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: result => {
          _this.selectImgs = _this.selectImgs.concat(result.tempFilePaths)
          this.upload(result.tempFilePaths)
        },
        fail: () => {},
        complete: () => {}
      })
    },
    getOrderDetail () {
      this.$http.post('/orderDetail', { order_id: this.orderId }).then(res => {
        this.orderDetail = res.data
        wx.stopPullDownRefresh()
      })
    },
    previewImage (imgUrl) {
      wx.previewImage({
        current: imgUrl, // 当前显示图片的http链接
        urls: this.selectImgs // 需要预览的图片http链接列表
      })
    },
    upload (data) {
      let token = wx.getStorageSync('token') || ''
      data.forEach(ele => {
        wx.uploadFile({
          url: 'https://ding.idingdingdian.com/shop/uploadImg',
          filePath: ele,
          name: '111',
          formData: {
            token
          },
          success: result => {
            this.uploadImgs.push(JSON.parse(result.data).data)
          },
          fail: err => {
            console.log(err)
          },
          complete: () => {}
        })
      })
    },
    submit () {
      if (this.isSuccess) {
        wx.navigateBack({ changed: true })
        return
      }
      let form = {
        shop: this.shopLevel,
        content: this.text,
        image: this.uploadImgs ? this.uploadImgs.join(',') : '',
        shop_id: this.shop.shop_id,
        order_id: this.shop.order_id,
        taste: this.tasteLevel,
        packaging: this.packagingLevel,
        is_anonymous: this.take ? 1 : 0
      }
      this.$http.post('/evaluate', form).then(res => {
        if (res.status) {
          wx.navigateBack({ changed: true })
        }
      })
    }
  },
  mounted () {
    this.shop = JSON.parse(this.$root.$mp.query.shop)
  }
}
</script>
<style lang="less" >
@import "./style";
</style>
