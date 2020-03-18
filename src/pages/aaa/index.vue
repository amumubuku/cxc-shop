<template>
  <div v-if="withdrawDetailData" class="page-wrap dis-flex vertical flex-middle">
    <div class="step dis-flex flex-middle flex-between" :class="'status-' + withdrawDetailData.status">
      <div class="circle circle-1 yellow"></div>
      <div class="line line-1 line-yellow-blue dis-flex flex"></div>
      <div class="circle circle-2"></div>
      <div class="line line-2 dis-flex flex"></div>
      <div class="circle circle-3"></div>
    </div>
    <div class="status dis-flex flex-middle flex-between" :class="'status-' + withdrawDetailData.status">
      <div class="item item-1 dis-flex vertical flex-middle">
        <div class="item-title">提交成功</div>
        <div class="item-time">{{withdrawDetailData.created_at}}</div>
      </div>
      <div class="item item-2 dis-flex vertical flex-middle">
        <div class="item-title">审核中</div>
        <div class="item-time">{{withdrawDetailData.deal_at}}</div>
      </div>
      <div class="item item-3 dis-flex vertical flex-middle active">
        <div class="item-title">{{withdrawDetailData.statusStr}}</div>
        <div class="item-time">{{withdrawDetailData.deal_at}}</div>
      </div>
    </div>
    <div class="data-wrap dis-flex vertical flex-middle">
      <div class="data-title">实际到账</div>
      <div class="data-money">{{withdrawDetailData.money_arrive}}</div>
      <div class="list dis-flex vertical">
        <div class="item dis-flex flex-middle flex-between">
          <div class="item-des">提现金额</div>
          <div class="item-data">{{withdrawDetailData.money_apply}}</div>
        </div>
        <div class="item dis-flex flex-middle flex-between">
          <div class="item-des">手续费</div>
          <div class="item-data">{{withdrawDetailData.fees}}</div>
        </div>
        <div class="item dis-flex flex-middle flex-between">
          <div class="item-des">提现时间</div>
          <div class="item-data">{{withdrawDetailData.created_at}}</div>
        </div>
        <div class="item dis-flex flex-middle flex-between">
          <div class="item-des">流水号</div>
          <div class="item-data">{{withdrawDetailData.order_no}}</div>
        </div>
      </div>
    </div>
    <div v-if="withdrawDetailData.status == 2" class="customer-service dis-flex flex-middle flex-center">联系客服</div>

    <div @click="cancelWithdraw" v-if="withdrawDetailData.status == 0" class="customer-service dis-flex flex-middle flex-center">取消提现</div>
  </div>
</template>
<script>
export default {

  data () {
    return {
      id: null,
      withdrawDetailData: null
    }
  },

  onLoad (option) {
    this.id = option.id
    this.withdrawDetail()
  },

  methods: {

    navigateBack () {
      wx.navigateBack({
        delta: 1
      })
    },

    // 取消提现
    async cancelWithdraw () {
      try {
        await this.$http.post('/cancelWithdraw', {
          id: this.id
        })
        wx.showToast({
          title: '取消成功'
        })
        this.withdrawDetail()
      } catch (err) {
        console.log('取消提现', err)
      }
    },

    // 文案
    getStatusStr (status) {
      let str = ''
      switch (parseInt(status)) {
        case 0:
          str = ' '
          break
        case 1:
          str = '完成'
          break
        case 2:
          str = '审核未通过'
          break
        case 3:
          str = '已取消'
          break
      }
      return str
    },

    // 收益统计
    async withdrawDetail () {
      try {
        let { data } = await this.$http.post('/withdrawDetail', {
          id: this.id
        })
        data.statusStr = this.getStatusStr(data.status)
        if (data.status === 0) {
          data.statusStr = '处理中'
          data.deal_at = data.created_at
        }
        this.withdrawDetailData = data
      } catch (err) {
        console.log('提现详情失败', err)
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import "./style";
</style>
