<template>
  <div class="sort-shop-wrp" >
    <div class="sort-shop-box" v-if="shoplist.length">
      <div class="sort-content-wrp" v-if="scrollTop <= fixTop - 17">
      <div class="sort-left">
        <div class="sort-item" @click="sortShop">
          <p>{{curSort.label}}</p>
          <img src="http://p2.icaixiaochu.com/down.png" alt />
        </div>
        <!-- <div class="sort-item" @click="chooseValue(sortList[1],0)">
          <p :class="{'active-sort': sortList[1].value === wrapCurSort.value}">{{sortList[1].label}}</p>
        </div>-->
        <div class="sort-item" @click="chooseValue(sortItem,0)">
          <p :class="{'active-sort': sortItem.value === wrapCurSort.value}">{{sortItem.label}}</p>
        </div>
      </div>
      <div class="sort-right" @click="toggleTake">
        <div class="icon">
          <i class="circle-icon" :class="{'take-active' : take || ''}"></i>
        </div>
        <p>支持自取</p>
      </div>
      <div class="sort-list" v-if="maskClass === 'active'">
        <div
          class="sort-item"
          v-for="(item, index) in sortList"
          :key="index"
          @click="chooseValue(item,1)"
          :class="{'active-sort':item.value === curSort.value}"
        >{{item.label}}</div>
      </div>
    </div>
    <div class="sort-content-wrp new-sort-content-wrp" v-else>
      <div class="sort-left">
        <div class="sort-item" @click="sortShop">
          <p>{{curSort.label}}</p>
          <img src="http://p2.icaixiaochu.com/down.png" alt />
        </div>
        <!-- <div class="sort-item" @click="chooseValue(sortList[1],0)">
          <p :class="{'active-sort': sortList[1].value === wrapCurSort.value}">{{sortList[1].label}}</p>
        </div>-->
        <div class="sort-item" @click="chooseValue(sortItem,0)">
          <p :class="{'active-sort': sortItem.value === wrapCurSort.value}">{{sortItem.label}}</p>
        </div>
      </div>
      <div class="sort-right" @click="toggleTake">
        <div class="icon">
          <i class="circle-icon" :class="{'take-active' : take}"></i>
        </div>
        <p>支持自取</p>
      </div>
      <div class="sort-list" v-if="maskClass === 'active'">
        <div
          class="sort-item"
          v-for="(item, index) in sortList"
          :key="index"
          :class="{'active-sort':item.value === curSort.value}"
          @click="chooseValue(item,1)"
        >{{item.label}}</div>
      </div>
    </div>
    <div class="mask" @click="sortShop" :class="maskClass" catchtouchmove="true"></div>
    <shop-list :shops="shoplist"></shop-list>
    </div>
    
  </div>
</template>

<script>
import shopList from '@/components/common/shop-list'
export default {
  data () {
    return {
      scrollTop: 0,
      maskClass: 'none',
      take: false,
      active: false,
      fixTop: 0,
      shoplist: [],
      page: 1,
      loading: false,
      curSort: {
        label: '综合排序',
        value: 0
      },
      sortItem: {
        label: '销量最高',
        value: 3
      },
      wrapCurSort: '',
      sortList: [
        {
          label: '综合排序',
          value: 0
        },
        {
          label: '起送价最低',
          value: 1
        },
        {
          label: '配送费最低',
          value: 2
        }
      ]
    }
  },
  components: { shopList },
  methods: {
    fetchShopList (type) {
      this.$http
        .post('/fetchShopList', {
          page: this.page,
          status: type
            ? this.wrapCurSort.value
            : this.curSort
              ? this.curSort.value
              : 0,
          is_arrival: this.take ? 1 : 0
        })
        .then(res => {
          if (!this.fixTop) {
            this.getNodeHeight()
          }
          if (res.data.length && this.page > 1) {
            this.shoplist = this.shoplist.concat(res.data)
            return
          }
          if (!res.data.length && this.page > 1) {
            this.loading = true
            wx.showToast({
              title: '没有更多商家了',
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
          this.shoplist = res.data
        })
    },
    chooseValue (item, type) {
      this.page = 1
      this.active = false
      this.maskClass = 'none'
      if (type) {
        if (item.value === this.curSort.value) {
          return
        }
        this.curSort = item
        this.wrapCurSort = ''
        this.fetchShopList(0)
      } else {
        if (item.value === this.wrapCurSort.value) {
          return
        }
        this.wrapCurSort = item
        this.fetchShopList(1)
      }
    },
    toggleTake () {
      this.take = !this.take
      this.page = 1
      this.loading = false
      this.fetchShopList()
    },
    clickMask () {
      this.active = false
    },
    sortShop () {
      this.active = !this.active
      this.maskClass = this.maskClass === 'active' ? 'none' : 'active'
      wx.pageScrollTo({
        // selector: '.sort-shop-wrp',
        scrollTop: this.fixTop,
        duration: 300
      })
    },
    getNodeHeight () {
      var query = wx.createSelectorQuery()
      query
        .select('.sort-shop-wrp')
        .boundingClientRect(res => {
          this.fixTop = res.top
        })
        .exec()
    }
  },
  onPageScroll (e) {
    this.scrollTop = e.scrollTop
  },
  onReachBottom () {
    if (!this.loading) {
      this.page++
      this.fetchShopList()
    }
  }
}
</script>

<style lang="less" scoped>
.sort-shop-wrp {
  .sort-content-wrp {
    position: relative;
    top: -2px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 14px;
    background: #fff;
    z-index: 99;
    box-sizing: border-box;
    .sort-left {
      flex: 1;
      display: flex;
      align-items: center;
      .sort-item {
        display: flex;
        align-items: center;
        margin-right: 14px;
        p {
          font-size: 13px;
          font-weight: 400;
          color: #787878;
          margin-right: 2px;
        }
        img {
          height: 8px;
          width: 8px;
        }
      }
      .active-sort {
        color: #212121 !important;
        font-weight: bold !important;
      }
      .item {
        margin-right: 26px;
      }
    }
    .sort-right {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      flex: 0 0 80px;
      .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid rgba(232, 232, 232, 1);
        border-radius: 50%;
        margin-right: 2px;
        box-sizing:border-box;
        .circle-icon {
          position: relative;
          width: 6px;
          height: 6px;
           border: 2px solid #fff;
          background: #e8e8e8;
          box-shadow: 0px 0px 3px rgba(255, 159, 30, 0.2);
          border-radius: 50%;
        }
        .take-active {
          background: rgba(255, 159, 30, 1);
        }
      }
      p {
        font-size: 13px;
        font-weight: 400;
        color: rgba(120, 120, 120, 1);
      }
    }
    .sort-list {
      width: 100%;
      position: absolute;
      top: 40px;
      left: 0;
      background: rgba(255, 255, 255, 1);
      border-radius: 0px 0px 10px 10px;
      .sort-item {
        padding-left: 14px;
        height: 50px;
        font-size: 13px;
        line-height: 50px;
        font-weight: 500;
        color: #212121;
        border-bottom: 1px solid #f2f2f2;
        &:last-child {
          border: none;
        }
      }
      .active-sort {
        font-weight: bold !important;
      }
    }
  }
  .new-sort-content-wrp {
    position: fixed;
    top: 40px;
    bottom: 0;
    width: 100%;
    z-index: 9999;
  }
  .mask {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: all 0.3s ease;
    z-index: 98;
    background: rgba(0, 0, 0, 0.7);
    &.active {
      opacity: 1;
    }
    &.none {
      display: none;
    }
  }
  .shop-list {
    .shop-item {
      height: 137px;
      display: flex;
      justify-content: space-between;
      padding-left: 20px;

      .shop-cover {
        margin-top: 20px;
        flex: 0 0 73px;
        height: 73px;
        background: #aeaeae;
        border-radius: 5px;
        img {
          height: 73px;
          width: 100%;
        }
      }

      .shop-info {
        height: 100%;
        padding: 20px 14px;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid rgba(242, 242, 242, 1);
        box-sizing: border-box;

        .shop-des {
          width: 100%;
          height: 100%;
          display: flex;
          flex-flow: column;
          justify-content: space-between;
          align-content: space-between;
          .shop-name {
            font-size: 17px;
            font-weight: bold;
            color: rgba(33, 33, 33, 1);
          }
          .shop-rate {
            display: flex;

            .rate-list {
              display: flex;
              align-items: center;
              margin-right: 3px;

              img {
                margin-right: 2px;
                height: 12px;
                width: 12px;
              }
            }

            p {
              font-size: 13px;
              font-weight: 400;
              color: rgba(120, 120, 120, 1);
            }
          }

          .fee-des {
            font-size: 13px;
            font-weight: 400;
            color: rgba(120, 120, 120, 1);
          }
          .shop-tag-list {
            display: flex;
            .tag-item {
              margin-right: 4px;
              padding: 0 4px;
              width: 35px;
              height: 16px;
              background: rgba(255, 255, 255, 1);
              border: 1px solid rgba(250, 123, 93, 0.5019607843137255);
              font-size: 11px;
              font-weight: 500;
              line-height: 16px;
              color: rgba(250, 123, 93, 1);
              border-radius: 5px;
              text-align: center;
            }
          }
        }

        .fee-time {
          font-size: 13px;
          font-weight: 400;
          line-height: 18px;
          color: rgba(120, 120, 120, 1);
        }
      }
    }
  }
}
</style>