<template>
  <div class="feedback">
    <div class="centent" v-if="!isSuccess">
      <div class="top-title">
        <P style="color:#FF9F1E;margin-right:4px;font-size:15px">*</P>
        <p>问题描述</p>
      </div>
      <div class="text-box">
        <textarea
          placeholder="请填写10字以上的问题，以便我们提供更好的帮助及优化"
          v-model="content"
          class="text"
          maxlength="5000"
        />
      </div>
      <div class="feedback-imgs">
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
          </div>
        </div>
      </div>
    </div>
    <div class="contact-wrp" v-if="!isSuccess">
      <p>输入有效联系方式以便我们联系你(选填)</p>
      <div class="contact">
        <p>联系方式</p>
        <input type="text"  v-model="contact" placeholder="邮箱/手机号" />
      </div>
    </div>

    <div class="isSuccess" v-if="isSuccess">
      <img src="https://img.icaixiaochu.com/%E8%B5%84%E6%BA%90%2013.png" alt />
      <p>意见反馈成功</p>
    </div>
    <form @submit="submit" report-submit="true">
      <div class="btn">
        <p class="submit" @click="submit">{{submitText}}</p>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      content: '',
      isSuccess: false,
      submitText: '提交',
      selectImgs: [],
      uploadImgs: []
    }
  },
  methods: {
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
          success: (result) => {

          },
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
    previewImage (imgUrl) {
      wx.previewImage({
        current: imgUrl, // 当前显示图片的http链接
        urls: this.selectImgs// 需要预览的图片http链接列表
      })
    },
    upload (data) {
      let token = wx.getStorageSync('token') || ''
      data.forEach(element => {
        console.log(element)
        wx.uploadFile({
          url: 'https://ding.idingdingdian.com/shop/uploadImg',
          filePath: element,
          name: 'img',
          formData: {
            token
          },
          success: (result) => {
            this.uploadImgs.push(JSON.parse(result.data).data)
          },
          fail: (err) => {
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
      if (this.text === '') {
        wx.showModal({
          content: '你还未输入意见',
          showCancel: false,
          confirmColor: '#FEA835'
        })
        return
      }
      let form = {
        content: this.text,
        image: this.uploadImgs.join(','),
        contact: this.contact
      }
      this.$http.post('/submitOpinion', form).then(res => {
        if (res.status === 1) {
          this.isSuccess = true
          this.submitText = '完成'
          this.text = ''
        } else {
          wx.showModal({
            content: res.info,
            showCancel: false,
            confirmColor: '#FEA835'
          })
        }
      })
    }
  },
  onUnload () {
    Object.assign(this, this.$options.data())
  },
  mounted () {}
}
</script>
<style lang="less">
@import "./style.less";
</style>

