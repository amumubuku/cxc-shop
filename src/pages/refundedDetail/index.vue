<template>
  <div class="refunded" v-if="refundedData">
    <div class="notification" :style="{ background: activeColor }">
      <div class="not-row-left">
        <div class="top" style="padding-bottom:6px;">
          <img v-if="refundedData.refund.refund_status!=3" src="https://img.icaixiaochu.com/succes-icon.png" alt />
          <img v-else src="https://img.icaixiaochu.com/cancel.png" alt />
          <p style="font-size:15px;">{{refundTitle}}</p>
        </div>
        <p v-if="refundedData.refund.refund_status===0">商家将在{{countDownTime.hou}}小时{{countDownTime.min}}分内处理</p>
        <p v-else>{{refundDes}}</p>
      </div>
      <div class="not-row-right" @click="cancelRefunded" v-if="refundedData.refund.refund_status===0">撤销退款申请</div>
    </div>
    <div class="refunded-wrp">
      <div class="refunded-head">
        <div class="refunded-col">
          <p>退款金额</p>
          <span style="color:#FF6304;">{{refundedData.refund.apply_money}}</span>
        </div>
        <div class="refunded-col">
          <p>退款账户</p>
          <span >原支付账户</span>
        </div>
      </div>
      <div class="refund-process">
        <div class="title">退款流程</div>
        <div class="refund-item" v-if="refundedData.refund.refund_status>0">
          <div class="process-state" :class="refundState">3</div>
          <div class="line-bot"></div>
          <div class="process-info">
            <div class="process-col-top">
              <p>{{refundTitle}}</p>
              <div class="time">{{refundedData.refund.time_deal}}</div>
            </div>
            <div class="process-col-bot">
              
              <span>{{refundDes}}</span>
            </div>
          </div>
        </div>
        <div class="refund-item">
          <div class="process-state" :class="refundedData.refund.refund_status ==0? 'state-1':''">2</div>
          <div :class="refundedData.refund.refund_status>0? 'line': 'line-bot'"></div>
          <div class="process-info">
            <div class="process-col-top">
              <p>等待商家处理</p>
             <div class="time"></div>
            </div>
            <div class="process-col-bot">
               <span>商家同意后将退款到您的支付账户</span>
            </div>
          </div>
        </div>
        <div class="refund-item">
          <div class="process-state">1</div>
          <div class="line-top"></div>
          <div class="process-info">
            <div class="process-col-top">
              <p>退款申请已提交</p>
              <div class="time">{{refundedData.refund.time_apply}}</div>
            </div>
            <div class="process-col-bot">
               <span>退款原因：{{refundedData.refund.title}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="goods-wrp">
        <div class="goods-head">
          <p>退款信息</p>
        </div>
        <div class="goods-list">
          <div class="good-item" v-for="(item, index) in refundedData.goods" :key="index">
            <div class="order-detail">
              <div class="good-cover">
                <img :src="item.cover" alt />
              </div>
              <div class="good-des">
                <p>{{item.goods_title}}</p>
                <p class="num">数量X{{item.number}}</p>
              </div>
            </div>
            <div class="good-price">
              <p>¥{{item.real_price}}</p>
            </div>
          </div>
        </div>
        <div class="fee-box">
          <p class="row-text1">退款原因</p>
          <p class="row-text2">{{refundedData.refund.title}}</p>
        </div>
        <div class="fee-box" style="border:none;">
          <p class="row-text1">订单号码</p>
          <p class="row-text2">{{refundedData.order.order_no}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import popup from '@/components/popup'
export default {
  data () {
    return {
      noteText: '',
      imgList: [],
      selectState: false,
      refundedId: '',
      refundedData: '',
      countDownTime: '',
      bgColor: ''
    }
  },
  computed: {

    activeColor () {
      if (!this.refundedData) {
        return ''
      }
      // https://img.icaixiaochu.com/order-status1.png
      var state = this.refundedData.refund.refund_status
      return state === 0 ? '#FABE6D' : state === 1 ? '#77C4FA' : state === 2 ? '#F52D3C' : '#484848'
    },
    arrowColor () {
      if (!this.refundedData) {
        return ''
      }
      let state = this.refundedData.refund.refund_status
      return `12px solid  ${state === 0 ? '#FABE6D' : state === 1 ? '#77C4FA' : state === 2 ? '#F52D3C' : '#484848'}`
    },
    refundState () {
      if (!this.refundedData) {
        return ''
      }
      return this.refundedData.refund.refund_status === 1 ? 'state-2' : this.refundedData.refund.refund_status === 2 ? 'state-3' : 'state-4'
    },
    refundDes () {
      if (!this.refundedData) {
        return ''
      }
      return this.refundedData.refund.refund_status === 1 ? '退款到账预计1-3天内' : this.refundedData.refund.refund_status === 2 ? '商家拒绝了您的退款申请，可联系商家进一步处理' : '订单正常发货'
    },
    refundTitle () {
      if (!this.refundedData) {
        return ''
      }
      return this.refundedData.refund.refund_status === 0 ? '等待商家处理中' : this.refundedData.refund.refund_status === 1 ? '退款成功' : this.refundedData.refund.refund_status === 2 ? '商家拒绝退款' : '自主撤销退款申请'
    }
  },
  components: { popup },
  mounted () {
    this.refundedId = this.$root.$mp.query.id
    this.refundedDetail()
  },
  methods: {
    refundedDetail () {
      this.$http.post('/refundDetail', {order_id: this.refundedId}).then(res => {
        this.refundedData = res.data
        this.countDown()
        wx.stopPullDownRefresh()
      })
    },
    cancelRefunded () {
      wx.showModal({
        title: '确认撤销退款申请',
        content: '撤销后，将无法再次申请',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#797979',
        confirmText: '确定',
        confirmColor: '#FEA835',
        success: (result) => {
          if (result.confirm) {
            let refundId = this.refundedData.refund.id
            this.$http.post('/repealApply', {refund_id: refundId}).then(res => {
              if (res.status) {
                wx.navigateBack({ changed: true })
              }
            })
          }
        },
        fail: () => {},
        complete: () => {}
      })
    },
    timeFormat (param) {
      return param < 10 ? '0' + param : param
    },
    countDown () {
      let newTime = new Date().getTime()
      let countDown = this.refundedData.refund.deal_time

      let endTime = new Date(countDown).getTime()
      let obj = null
      if (endTime - newTime > 0) {
        let time = (endTime - newTime) / 1000
        let day = parseInt(time / (60 * 60 * 24))
        let hou = parseInt((time % (60 * 60 * 24)) / 3600)
        let min = parseInt(((time % (60 * 60 * 24)) % 3600) / 60)
        let sec = parseInt(((time % (60 * 60 * 24)) % 3600) % 60)
        obj = {
          day: this.timeFormat(day),
          hou: this.timeFormat(hou),
          min: this.timeFormat(min),
          sec: this.timeFormat(sec)
        }
      } else {
        obj = {
          day: '00',
          hou: '00',
          min: '00',
          sec: '00'
        }
      }

      this.countDownTime = obj
      setTimeout(this.countDown, 1000)
    },
    toggleOpt (state) {
      this.$refs.optOnCancel.toggle(state)
    },
    toggleSelect (item) {
      var curId = this.goods.findIndex(ele => {
        return ele.goods_id === item.goods_id
      })

      this.goods[curId].select = !this.goods[curId].select
      this.selectState = this.goods.every(ele => {
        return ele.select
      })
    },
    allSelect () {
      var selectState = this.goods.every(ele => {
        return ele.select
      })
      this.goods.forEach(element => {
        element.select = !selectState
      })
      this.selectState = !selectState
    },
    chooseImage () {
      let _this = this
      wx.chooseImage({
        count: 9,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: result => {
          _this.imgList = _this.imgList.concat(result.tempFilePaths)
        },
        fail: () => {},
        complete: () => {}
      })
    },
    previewImage () {
      wx.previewImage({
        current: 'https://img.icaixiaochu.com/map-img.png', // 当前显示图片的http链接
        urls: ['https://img.icaixiaochu.com/map-img.png'] // 需要预览的图片http链接列表
      })
    }
  },
  onPullDownRefresh () {
    this.refundedDetail()
  }
}
</script>
<style lang="less" scoped>
@import "./style";
</style>
