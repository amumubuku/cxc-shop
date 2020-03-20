<template>
  <div v-if="incomeStatisticsData" class="page-wrap dis-flex vertical flex-middle">
    <div class="money-title">可提现收益</div>
    <div class="money">{{incomeStatisticsData.balance}}</div>
    <div @click="toWithdrawal" class="money-btn"></div>
    <div class="data dis-flex flex-middle">
      <div class="item dis-flex vertical flex-middle flex">
        <div class="item-title">总收益</div>
        <div class="item-money">{{incomeStatisticsData.total_income}}</div>
      </div>
      <div class="item dis-flex vertical flex-middle flex">
        <div class="item-title">今日收益</div>
        <div class="item-money">{{incomeStatisticsData.today_income}}</div>
      </div>
      <div class="item dis-flex vertical flex-middle flex">
        <div class="item-title">分享人数</div>
        <div class="item-money">{{incomeStatisticsData.share_members}}</div>
      </div>
    </div>
    <div class="list dis-flex vertical">
      <div class="title dis-flex flex-middle">
        <div class="block"></div>
        <div class="title-text">累计收益明细</div>
      </div>
      <div v-for="(item,index) in incomeLogListData" :key="index" class="item dis-flex flex-middle flex-between">
        <div class="dis-flex flex-middle">
          <div class="item-img" :style="{
            background: 'url(' + item.avatar_url + ')'
          }"></div>
          <div class="dis-flex vertical">
            <div class="item-name">{{item.nick_name}}</div>
            <div class="item-consumption">消费{{item.money}}</div>
          </div>
        </div>
        <div class="dis-flex vertical flex-bottom">
          <div class="item-money">+{{item.income}}</div>
          <div class="item-time">{{item.created_at}}</div>
        </div>
      </div>
      <div v-if="incomeLogListData.length == 0" class="no-list"></div>
    </div>
    <div class="btn dis-flex flex-middle flex-center">
      <button open-type="share"></button>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 是否达到最大页数
      hasMax: false,

      // 当前页数
      page: 1,
      incomeLogListData: [],
      incomeStatisticsData: null
    }
  },

  onLoad () {
    this.incomeLogList(this.page)
    this.incomeStatistics()
  },

  onReachBottom () {
    if (this.hasMax) {
      return
    }
    this.page++
    this.incomeLogList(this.page)
  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: `叮叮点外卖`,
      path: `pages/index/main?id=${wx.getStorageSync('userInfo').user_id}`
    }
  },

  methods: {

    // 提现
    toWithdrawal () {
      wx.navigateTo({
        url: `../withdrawal/main`
      })
    },

    // 收益统计
    async incomeStatistics () {
      try {
        let { data } = await this.$http.post('/incomeStatistics')
        this.incomeStatisticsData = data
      } catch (err) {
        console.log('获取收益统计失败', err)
      }
    },

    // 累计收益明细
    async incomeLogList (page) {
      try {
        let { data } = await this.$http.post('/incomeLogList', {
          page
        })

        if (data.length === 0) {
          this.hasMax = true
        }

        this.incomeLogListData = [
          ...this.incomeLogListData,
          ...data
        ]
      } catch (err) {
        console.log('获取累计收益明细失败', err)
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import "./style";
</style>
