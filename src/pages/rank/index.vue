<template>
  <div class="page-wrap dis-flex vertical flex-middle">
    <div class="time-wrap dis-flex flex-middle">
      <div class="time-des">距离本周结束还剩：</div>
      <div class="time-tag dis-flex flex-middle">146时21分</div>
    </div>
    <div v-if="list.length >= 3" class="rank dis-flex">
      <div class="item dis-flex vertical flex-middle flex item-2">
        <div class="item-user-icon"></div>
        <div class="item-user-head" :style="{
          background: 'url(' + list[1].avatar_url + ')'
        }"></div>
        <div class="user-name">{{list[1].nick_name}}</div>
        <div class="user-money">{{list[1].income}}元</div>
      </div>
      <div class="item dis-flex vertical flex-middle flex item-1">
        <div class="item-user-icon"></div>
        <div class="item-user-head" :style="{
          background: 'url(' + list[0].avatar_url + ')'
        }"></div>
        <div class="user-name">{{list[0].nick_name}}</div>
        <div class="user-money">{{list[0].income}}元</div>
      </div>
      <div class="item dis-flex vertical flex-middle flex item-3">
        <div class="item-user-icon"></div>
        <div class="item-user-head" :style="{
          background: 'url(' + list[2].avatar_url + ')'
        }"></div>
        <div class="user-name">{{list[2].nick_name}}</div>
        <div class="user-money">{{list[2].income}}元</div>
      </div>
    </div>
    <div class="list-wrap">
      <div class="list dis-flex vertical">
        <div v-if="index > 2" v-for="(item,index) in list" :key="index" class="item dis-flex flex-middle">
          <div class="sort">{{index + 1}}</div>
          <div class="line-wrap dis-flex flex-middle flex-between flex">
            <div class="dis-flex flex-middle">
              <div class="user-head" :style="{
                background: 'url(' + item.avatar_url + ')'
              }"></div>
              <div class="user-name">{{item.nick_name}}</div>
            </div>
            <div class="item-money">{{item.income}}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="mine" class="my-info dis-flex flex-middle flex-between">
      <div class="dis-flex flex-middle">
        <div class="sort">{{mine.row_number}}</div>
        <div class="user-head" :style="{
          background: 'url(' + mine.avatar_url + ')'
        }"></div>
        <div class="dis-flex vertical">
          <div class="my-money">{{mine.income}}</div>
          <div class="money-des">我的收益</div>
        </div>
      </div>
      <div class="btn">
        <button open-type="share"></button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      list: [],
      time: '',
      mine: null
    }
  },

  created () {
    this.rank()
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

  methods: {

    // 获取收益榜单
    async rank () {
      try {
        let { data } = await this.$http.post('/rank', {
          state: 10
        })

        this.list = data.list
        this.time = data.countdown
        this.mine = data.mine
      } catch (err) {

      }
    }
  }
}
</script>
<style lang="less" scoped>
@import "./style";
</style>
