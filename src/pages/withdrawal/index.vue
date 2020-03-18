<template>
  <div class="page-wrap dis-flex vertical flex-middle">
    <div class="notice dis-flex flex-middle">发起提现后将于审核通过后到账您的“微信账号”</div>
    <div class="body-wrap dis-flex vertical flex-middle">
      <div class="money">66.00</div>
      <div class="input-wrap dis-flex vertical">
        <div class="input dis-flex flex-middle">
          <div class="money-icon">¥</div>
          <input class="div-input dis-flex flex" type="number" placeholder="最低一元提">
          <div class="input-text">全部</div>
        </div>
        <div class="btn dis-flex flex-middle flex-center">审核通过后到账，确认提现</div>
      </div>
      <div class="nav dis-flex flex-middle">
        <div @click="changeNav(index)" v-for="(item,index) in navList" :key="index" class="item dis-flex vertical flex-middle flex-center" :class="nowNavIndex == index && 'active'">
          <div class="item-text">{{item.title}}</div>
          <div class="item-block"></div>
        </div>
      </div>
      <div class="list dis-flex vertical">
        <div v-for="(item,index) in withdrawListData" :key="index" class="item dis-flex flex-middle flex-between">
          <div class="dis-flex vertical">
            <div class="item-num">{{item.money_arrive}}</div>
            <div class="item-time">{{item.created_at}}</div>
          </div>
          <div class="status dis-flex flex-middle">
            <div class="status-title">{{item.statusStr}}</div>
            <div class="status-icon"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
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

  created () {
    this.withdrawList(1)
  },

  methods: {

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

    // 修改导航栏
    changeNav (index) {
      this.nowNavIndex = index
    },

    // 提现记录列表
    async withdrawList (page) {
      try {
        let { data } = await this.$http.post('/withdrawList', {
          state: this.navList[this.nowNavIndex].state,
          page
        })

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
<style lang="less" scoped>
@import "./style";
</style>
