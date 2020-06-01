<template>
  <div class="shop-list-box" v-if="shops.length">
    <div
      class="shop-item"
      v-for="(item, index) in shops"
      :key="index"
      @click="shopDetail(item)"
    >
      <div class="shop-cover">
        <img :src="item.icon" alt />
      </div>
      <div class="shop-info">
        <div class="shop-des">
          <div class="shop-name">{{ item.title }}</div>
          <div class="shop-area">
            <div class="shop-rate">
              <div class="rate-list">
                <img src="/static/images/new-rate.png" :key="k" alt />
                <p>{{ item.shop_score }}</p>
              </div>

              <p>月售{{ item.monthly_sale }}</p>
            </div>
            <p class="fee-time">
              <span style="margin-right: 20rpx;"
                >{{ item.delivery_time }}分钟</span
              >
              <span>{{
                item.distance < 1
                  ? item.distance * 1000 + "m"
                  : item.distance + "km"
              }}</span>
            </p>
          </div>
          <div class="fee-des">
            <span style="margin-right: 21rpx;"
              >起送:{{ item.price_send }}元</span
            >
            <span>配送{{ item.shipping_fee }}元</span>
          </div>
          <div class="shop-tag-list">
            <div
              class="tag-item"
              v-for="(item, k) in item.label"
              :key="k"
              :style="{
                color: item.title_color,
                borderColor: item.border_color,
              }"
            >
              {{ item.title }}
            </div>
          </div>
          <div class="foods">
            <scroll-view width="100%" class="scroll" scroll-x="true">
              <div class="food-list">
                <div class="food-item" v-for="(ele, k) in item.goods" :key="k">
                  <div class="food-img">
                    <img :src="ele.cover" mode="aspectFill" alt />
                  </div>
                  <p class="food-name">{{ ele.title }}</p>
                  <p class="price-box">
                    <span class="tip">￥</span
                    ><span class="price">{{ ele.price }}</span>
                  </p>
                </div>
              </div>
            </scroll-view>
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
        success: (result) => {},
        fail: () => {},
        complete: () => {}
      })
    }
  },
  mounted () {}
}
</script>

<style lang="less" scoped>
.shop-list-box {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  .shop-item {
    width: 702rpx;
    display: flex;
    justify-content: space-between;
    background: #fff;
    margin-bottom: 12rpx;
    padding: 30rpx;
    padding-right: 0;
    box-sizing: border-box;
    border-radius: 8rpx;
    .shop-cover {
      flex: 0 0 121rpx;
      height: 121rpx;
      background: #f6f6f6;
      border-radius: 5px;
      border: 1px solid #e9e9e9;
      overflow: hidden;
      img {
        height: 121rpx;
        width: 100%;
      }
    }

    .shop-info {
      width: 1px;
      margin-left: 15rpx;
      height: 100%;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
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
          padding: 10rpx 0;
          padding-right: 25rpx;
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
                margin-right: 6rpx;
              }
              p {
                font-weight: bold;
                color: rgba(253, 123, 29, 1);
              }
            }

            p {
              font-size: 20rpx;
              font-weight: 500;
              color: rgba(102, 102, 102, 1);
            }
          }
          .fee-time {
            flex: 1;
            font-size: 20rpx;
            font-weight: 500;
            line-height: 18px;
            color: rgba(102, 102, 102, 1);
            text-align: end;
          }
        }

        .fee-des {
          font-size: 20rpx;
          font-weight: 500;
          color: rgba(102, 102, 102, 1);
          padding-bottom: 10rpx;
        }
        .shop-tag-list {
          display: flex;
          .tag-item {
            margin-right: 10rpx;
            background: rgba(255, 255, 255, 1);
            border: 1px solid #e8e8e8;
            padding: 0 12rpx;
            box-sizing: content-box;
            font-size: 11px;
            font-weight: 500;
            height: 34rpx;
            line-height: 34rpx;
            color: rgba(250, 123, 93, 1);
            border-radius: 18rpx;
            text-align: center;
          }
        }
        .foods {
          width: 100%;
          padding-top: 30rpx;
          .scroll {
            .food-list {
              display: flex;
              align-items: center;
              justify-content: space-between;
              .food-item {
                display: flex;
                flex-flow: column nowrap;
                align-items: flex-start;
                justify-content: flex-start;
                margin-right: 20rpx;
                .food-img {
                  width: 180rpx;
                  height: 180rpx;
                  background: rgba(233, 233, 233, 1);
                  border-radius: 8rpx;
                  overflow: hidden;
                  img {
                    width: 100%;
                    height: 100%;
                  }
                }

                .food-name {
                  width: 180rpx;
                  padding-top: 8px;
                  height: 18px;
                  font-size: 28rpx;
                  font-weight: 700;
                  line-height: 40rpx;
                  color: rgba(51, 51, 51, 1);
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }

                .price-box {
                  width: 100%;
                  display: flex;
                  align-items: baseline;
                  .price {
                    font-family: DIN;
                    font-size: 32rpx;
                    font-weight: 400;
                    line-height: 39rpx;
                    color: rgba(255, 61, 0, 1);
                  }
                  .tip {
                    font-family: DIN;
                    font-size: 16rpx;
                    color: rgba(255, 61, 0, 1);
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
