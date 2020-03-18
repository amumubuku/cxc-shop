<template>
  <div v-if="withdrawDetailData" class="page-wrap dis-flex vertical flex-middle">
    <div class="step dis-flex flex-middle flex-between">
      <div class="circle yellow"></div>
      <div class="line line-yellow-blue dis-flex flex"></div>
      <div class="circle blue-big"></div>
      <div class="line dis-flex flex"></div>
      <div class="circle"></div>
    </div>
    <div class="status dis-flex flex-middle flex-between">
      <div class="item dis-flex vertical flex-middle">
        <div class="item-title">提交成功</div>
        <div class="item-time">{{withdrawDetailData.created_at}}</div>
      </div>
      <div class="item dis-flex vertical flex-middle">
        <div class="item-title">审核中</div>
        <div class="item-time">{{withdrawDetailData.deal_at}}</div>
      </div>
      <div class="item dis-flex vertical flex-middle active">
        <div class="item-title">完成</div>
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
  </div>
</template>
<script>
export default {

  data () {
    return {
      withdrawDetailData: null
    }
  },

  created () {
    this.withdrawDetail()
  },

  methods: {

    // 收益统计
    async withdrawDetail () {
      try {
        let { data } = await this.$http.post('/withdrawDetail', {
          id: 1
        })
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
