<template>
  <div class="page-wrap dis-flex vertical flex-middle">
    <div v-if="incomeStatisticsData" class="top-wrap dis-flex vertical flex-middle">
      <div class="card-wrap dis-flex vertical flex-between">
        <div class="dis-flex vertical">
          <div class="des-wrap dis-flex flex-middle">
            总收益
            <div class="des-icon"></div>
          </div>
          <div class="money">{{incomeStatisticsData.total_income}}</div>
        </div>
        <div class="data dis-flex flex-middle">
          <div class="item dis-flex vertical flex">
            <div class="item-title">今日收益（元）</div>
            <div class="item-num">{{incomeStatisticsData.today_income}}</div>
          </div>
          <div class="item dis-flex vertical flex">
            <div class="item-title">分享人数</div>
            <div class="item-num">{{incomeStatisticsData.share_members}}</div>
          </div>
        </div>
        <div class="description"></div>
      </div>
      <div class="income-wrap dis-flex flex-middle flex-between">
        <div class="dis-flex flex-middle">
          <div class="income-des">可体现收益（元）</div>
          <div class="income-num">{{incomeStatisticsData.balance}}</div>
        </div>
        <div @click="toWithdrawal" class="income-btn dis-flex flex-middle">
          提现
          <div class="income-icon"></div>
        </div>
      </div>
    </div>
    <div v-if="rankData" class="rank-wrap dis-flex vertical">
      <div @click="toRank" class="title-wrap dis-flex flex-middle flex-between">
        <div class="dis-flex flex-middle">
          <div class="title-block"></div>
          <div class="title-text">本周收益榜</div>
        </div>
        <div class="right-icon"></div>
      </div>
      <div class="rank dis-flex">
        <div class="item dis-flex vertical flex-middle flex item-2">
          <div class="item-img-icon"></div>
          <div class="item-img" :style="{
            background: 'url(' + rankData[1].avatar_url + ')'
          }"></div>
          <div class="item-name">{{rankData[1].nick_name}}</div>
          <div class="money">{{rankData[1].income}}</div>
        </div>
        <div class="item dis-flex vertical flex-middle flex item-1">
          <div class="item-img-icon"></div>
          <div class="item-img" :style="{
            background: 'url(' + rankData[0].avatar_url + ')'
          }"></div>
          <div class="item-name">{{rankData[0].nick_name}}</div>
          <div class="money">{{rankData[0].income}}</div>
        </div>
        <div class="item dis-flex vertical flex-middle flex item-3">
          <div class="item-img-icon"></div>
          <div class="item-img" :style="{
            background: 'url(' + rankData[2].avatar_url + ')'
          }"></div>
          <div class="item-name">{{rankData[2].nick_name}}</div>
          <div class="money">{{rankData[2].income}}</div>
        </div>
      </div>
    </div>
    <div class="list dis-flex vertical">
      <div class="title-wrap dis-flex flex-middle">
        <div class="title-block"></div>
        <div class="title-text">我的分享人员</div>
        <div class="problem-icon dis-flex flex-middle flex-center">?</div>
      </div>
      <div v-for="(item,index) in childRankData" :key="index" class="item dis-flex flex-middle flex-between">
        <div class="dis-flex flex-middle">
          <div class="item-icon" :class="'item-icon-' + index">{{index > 2 ? index : ''}}</div>
          <div class="item-img" :style="{
            background: 'url(' + item.avatar_url + ')'
          }"></div>
          <div class="name-consumption dis-flex vertical">
            <div class="item-name">{{item.nick_name}}</div>
            <div class="consumption">消费{{item.money_consume}}</div>
          </div>
        </div>
        <div class="dis-flex vertical flex-bottom">
          <div class="status">+{{item.income}}</div>
          <div class="status-des">您的收益</div>
        </div>
      </div>
      <div v-if="childRankData.length == 0" class="no-list"></div>
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
      incomeStatisticsData: null,
      rankData: null,
      childRankData: []
    }
  },

  created () {
    this.incomeStatistics()
    this.rank()
    this.childRank(this.page)
  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: '叮叮点外卖',
      path: `pages/index/main?id=${wx.getStorageSync('userInfo').user_id}`
    }
  },

  onReachBottom () {
    if (this.hasMax) {
      return
    }
    this.page++
    this.childRank(this.page)
  },

  methods: {

    // 提现
    toWithdrawal () {
      wx.navigateTo({
        url: `../withdrawal/main`
      })
    },

    // 排行榜
    toRank () {
      wx.navigateTo({
        url: `../rank/main`
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

    // 获取收益榜单
    async rank () {
      try {
        let { data } = await this.$http.post('/rank', {
          state: 3
        })

        this.rankData = data.list
      } catch (err) {
        console.log('获取收益榜单失败', err)
      }
    },

    // 下级人员
    async childRank (page) {
      try {
        let { data } = await this.$http.post('/childRank', {
          page
        })

        if (data.length === 0) {
          this.hasMax = true
        }

        this.childRankData = [
          ...this.childRankData,
          ...data
        ]
      } catch (err) {
        console.log('获取下级人员失败', err)
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import "./style";
</style>
