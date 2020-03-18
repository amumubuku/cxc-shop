<template>
  <div class="shop-list-box" v-if="shops.length">
    <div class="shop-item" v-for="(item, index) in shops" :key="index" @click="shopDetail(item)">
      <div class="shop-cover">
        <img :src="item.icon" alt />
      </div>
      <div class="shop-info">
        <div class="shop-des">
          <div class="shop-name">{{item.title}}</div>
          <div class="shop-area">
            <div class="shop-rate">
              <div class="rate-list">
                <img src="https://img.icaixiaochu.com/rate.png" v-for="(item, k) in ~~item.shop_score" :key="k" alt />
              </div>
              <p>月售{{item.monthly_sale}}</p>
            </div>
            <p
              class="fee-time"
            >{{item.delivery_time}}分钟 | {{item.distance < 1 ? item.distance * 1000 + 'm':item.distance + 'km'}}</p>
          </div>
          <div class="fee-des">起送: {{item.price_send}}元 | 配送{{item.shipping_fee}}元</div>
          <div class="shop-tag-list">
           <div class="tag-item" v-for="(item, k) in item.label" :key="k" :style="{color:item.title_color,borderColor:item.border_color}">{{item.title}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['shops'],
  methods: {
    shopDetail (item) {
      wx.navigateTo({
        url: `../shop/main?shopId=${item.id}`,
        success: result => {},
        fail: () => {},
        complete: () => {}
      })
    }
  },
  mounted () {
  }
}
</script>

<style lang="less" scoped>
.shop-list-box {
  .shop-item {
    height: 137px;
    display: flex;
    justify-content: space-between;
    padding-left: 20px;

    .shop-cover {
      margin-top: 20px;
      flex: 0 0 73px;
      height: 73px;
      background: #F6F6F6;
      border-radius: 5px;
      border: 1px solid #E9E9E9;
      overflow: hidden;
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
        flex: 1;
        .shop-name {
          font-size: 17px;
          font-weight: bold;
          color: rgba(33, 33, 33, 1);
        }
        .shop-area {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .shop-rate {
            flex: 1;
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
          .fee-time {
            flex: 1;
            font-size: 13px;
            font-weight: 400;
            line-height: 18px;
            color: rgba(120, 120, 120, 1);
            text-align: end;
          }
        }

        .fee-des {
          font-size: 13px;
          font-weight: 400;
          color: rgba(120, 120, 120, 1);
        }
        .shop-tag-list {
          height: 16px;
          display: flex;
          .tag-item {
            margin-right: 4px;
            padding: 0 4px;
            background: rgba(255, 255, 255, 1);
            border: 1px solid #E8E8E8;
            box-sizing: content-box;
            font-size: 11px;
            font-weight: 500;
            line-height: 14px;
            color: rgba(250, 123, 93, 1);
            border-radius: 5px;
            text-align: center;
            
          }
        }
      }
    }
  }
}
</style>