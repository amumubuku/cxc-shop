<template>
  <div class="page-wrap dis-flex vertical flex-middle">
    <div class="notice dis-flex flex-middle">发起提现后将于审核通过后到账您的“微信账号”</div>
    <div class="body-wrap dis-flex vertical flex-middle">
      <div v-if="incomeStatisticsData" class="money">{{incomeStatisticsData.balance}}</div>
      <div class="input-wrap dis-flex vertical">
        <div class="input dis-flex flex-middle">
          <div class="money-icon">¥</div>
          <input v-model="money" placeholder-class="placeholder" class="div-input dis-flex flex" type="number" placeholder="最低一元提">
          <div @click="inputAll" class="input-text">全部</div>
        </div>
        <div @click="applyWithdraw" class="btn dis-flex flex-middle flex-center">审核通过后到账，确认提现</div>
      </div>
      <div class="nav dis-flex flex-middle">
        <div @click="changeNav(index)" v-for="(item,index) in navList" :key="index" class="item dis-flex vertical flex-middle flex-center" :class="nowNavIndex == index && 'active'">
          <div class="item-text">{{item.title}}</div>
          <div class="item-block"></div>
        </div>
      </div>
      <div class="list dis-flex vertical">
        <div @click="toWithdrawalDetail(item.id)" v-for="(item,index) in withdrawListData" :key="index" class="item dis-flex flex-middle flex-between">
          <div class="dis-flex vertical">
            <div class="item-num">{{item.money_arrive}}</div>
            <div class="item-time">{{item.created_at}}</div>
          </div>
          <div class="status dis-flex flex-middle">
            <div class="status-title" :class="'status-' + item.status">{{item.statusStr}}</div>
            <div class="status-icon"></div>
          </div>
        </div>
        <div v-if="withdrawListData.length == 0" class="no-list dis-flex flex-middle flex-center"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      incomeStatisticsData: null,

      // 是否达到最大页数
      hasMax: false,

      // 当前页数
      page: 1,

      // 提现金额
      money: '',

      // 当前分类下表
      nowNavIndex: 0,

      // 分类
      navList: [
        {
          title: '全部',
          state: 0
        },
        {
          title: '提现中',
          state: 1
        },
        {
          title: '完成',
          state: 2
        },
        {
          title: '取消',
          state: 3
        }
      ],

      withdrawListData: []
    }
  },

  onLoad () {
    this.withdrawList(this.page)
    this.incomeStatistics()
  },

  onReachBottom () {
    if (this.hasMax) {
      return
    }
    this.page++
    this.withdrawList(this.page)
  },

  methods: {

    // 提现成功
    toSuccess (id) {
      wx.redirectTo({
        url: `../success/main`
      })
    },

    // 提现详情
    toWithdrawalDetail (id) {
      wx.navigateTo({
        url: `../withdrawalDetail/main?id=${id}`
      })
    },

    // 检查提现金额
    checkMoney () {
      let errResult = ''

      if (this.money === '') {
        errResult = '未填写提现金额'
      }

      if (!errResult && parseFloat(this.money) > parseFloat(this.incomeStatisticsData.balance)) {
        errResult = '提现金额超出余额'
      }

      if (!errResult && parseFloat(this.money) < 2) {
        errResult = '提现金额低于手续费'
      }

      return errResult
    },

    // 确认提现
    async applyWithdraw () {
      var error = this.checkMoney()
      if (error) {
        wx.showModal({
          title: '提示',
          content: error,
          showCancel: false
        })
        return
      }

      wx.showModal({
        title: '提示',
        content: '请确认提现',
        success: async (res) => {
          if (res.confirm) {
            try {
              await this.$http.post('/applyWithdraw', {
                money: this.money
              })
              this.incomeStatistics()
              this.toSuccess()
            } catch (err) {
              console.log('获取收益统计失败', err)
            }
          }
        }
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

    // 全部
    inputAll () {
      this.money = this.incomeStatisticsData.balance
    },

    // 获取状态
    getStatus (status) {
      let str = ''
      switch (parseInt(status)) {
        case 0:
          str = '申请中'
          break
        case 1:
          str = '通过'
          break
        case 2:
          str = '拒绝'
          break
        case 3:
          str = '取消提现'
          break
      }
      return str
    },

    initList () {
      this.hasMax = false
      this.page = 1
      this.withdrawListData = []
    },

    // 修改导航栏
    changeNav (index) {
      this.nowNavIndex = index
      this.initList()
      this.withdrawList(this.page)
    },

    // 提现记录列表
    async withdrawList (page) {
      try {
        let { data } = await this.$http.post('/withdrawList', {
          state: this.navList[this.nowNavIndex].state,
          page
        })

        if (data.length === 0) {
          this.hasMax = true
        }

        data.forEach(item => {
          item.statusStr = this.getStatus(item.status)
        })

        this.withdrawListData = [
          ...this.withdrawListData,
          ...data
        ]
      } catch (err) {
        console.log('提现记录列表', err)
      }
    }
  }
}
</script>
<style lang="less">
@import "./style";
</style>
