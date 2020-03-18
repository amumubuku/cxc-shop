<template>
  <div class="base-shop-list">
    <div class="shop-item" v-for="(item, index) in shopList" :key="index" @click="jumpShop(item)">
      <div class="top">
        <div class="shop-cover">
          <img :src="item.icon" alt />
        </div>
        <div class="shop-info">
          <div class="shop-des">
            <div class="shop-name">{{item.title}}</div>
            <div class="shop-rate">
              <div class="rate-list">
                <img
                  src="https://img.icaixiaochu.com/rate.png"
                  v-for="(item, k) in ~~item.shop_score"
                  :key="k"
                  alt
                />
              </div>
              <p>月售{{item.monthly_sale}}</p>
            </div>
            <div class="fee-des">起送:{{item.price_send}} 元| 配送{{item.shipping_fee}}元</div>
            <div class="shop-tag-list">
               <div class="tag-item" v-for="(item, k) in item.label" :key="k" :style="{color:item.title_color,borderColor:item.border_color}">{{item.title}}</div>
            </div>
          </div>
          <div class="fee-time" @click="shop">
            <div class="btn">进店</div>
            <p>{{item.delivery_time}}分钟 | {{item.distance < 1 ? item.distance * 1000 + 'm':item.distance + '公里'}}</p>
          </div>
        </div>
      </div>
      <div class="foods">
        <div class="food-item" v-for="(ele, k) in item.goods" :key="k">
          <div class="food-img">
            <img :src="ele.cover" alt />
          </div>
          <p class="food-name">{{ele.title}}</p>
          <p class="food-price">￥{{ele.price}}</p>
        </div>
      </div>
      <div class="hot-shop-tag" v-if="false">
        <div class="top-tag">
          <div class="hot-icon">
            <img src="../../../static/images/hot.png" alt />
            <p>热卖商家</p>
          </div>
          <div class="hot-title">附近热卖的商家</div>
        </div>
        <div class="comment" v-if="index % 2">
          <div class="flex-left">
            <img src="../../../static/images/comment-icon.png" alt />
            <span>顾客说</span>
          </div>
          <div class="flex-right">
            第三次点他们家的水果了，水果很新鲜，分
            量足，下次还会继续点第三次点他们家的水
            果，水果很新鲜，分量足，下次还会继续点
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  props: {
    shopList: Array
  },
  methods: {
    jumpShop (item) {
      wx.navigateTo({
        url: `../shop/main?shopId=${item.id}`,
        success: result => {},
        fail: () => {},
        complete: () => {}
      })
    }
  }
}
</script>

<style lang="less" scope>
.base-shop-list {
  .shop-item {
    padding: 0 14px;
    padding-bottom: 24px;
    border-bottom: 1px solid #f2f2f2;

    .top {
      height: 137px;
      display: flex;
      justify-content: space-between;

      .shop-cover {
        margin-top: 20px;
        flex: 0 0 73px;
        height: 73px;
        border-radius: 5px;
        border: 1px solid #e9e9e9;
        background: #fff;
        overflow: hidden;

        img {
          height: 73px;
          width: 100%;
        }
      }

      .shop-info {
        height: 100%;
        padding: 20px 14px;
        padding-right: 0;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;

        .shop-des {
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
          display: flex;
          flex-flow: column nowrap;
          align-items: center;
          justify-content: center;

          p {
            font-size: 13px;
            font-weight: 400;
            line-height: 18px;
            color: rgba(120, 120, 120, 1);
          }

          .btn {
            width: 64px;
            height: 27px;
            background: linear-gradient(
              90deg,
              rgba(244, 186, 28, 1) 0%,
              rgba(255, 159, 30, 1) 100%
            );
            box-shadow: 0px 1px 6px rgba(255, 159, 30, 0.5);
            border-radius: 14px;
            font-size: 15px;
            font-weight: 400;
            line-height: 27px;
            text-align: center;
            color: rgba(255, 255, 255, 1);
            margin-bottom: 9px;
          }
        }
      }
    }

    .foods {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .food-item {
        display: flex;
        flex-flow: column nowrap;
        align-items: center;

        .food-img {
          width: 109px;
          height: 109px;
          background: rgba(233, 233, 233, 1);
          border-radius: 5px;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .food-name {
          padding-top: 8px;
          height: 18px;
          font-size: 13px;
          font-weight: 400;
          line-height: 18px;
          color: rgba(33, 33, 33, 1);
        }

        .food-price {
          height: 21px;
          font-size: 15px;
          font-weight: 400;
          line-height: 21px;
          color: rgba(253, 82, 0, 1);
        }
      }
    }

    .hot-shop-tag {
      padding-top: 25px;

      .top-tag {
        display: flex;
        align-items: center;

        .hot-icon {
          width: 80px;
          height: 26px;
          background: rgba(253, 82, 0, 1);
          border-radius: 5px 5px 10px 5px;
          display: flex;
          align-items: center;

          img {
            width: 12px;
            height: 12px;
            padding: 0 4px;
          }

          p {
            font-size: 13px;
            font-weight: 400;
            line-height: 18px;
            color: rgba(255, 255, 255, 1);
          }
        }

        .hot-title {
          position: relative;
          left: -7px;
          width: 125px;
          height: 26px;
          background: rgba(253, 82, 0, 0.1);
          font-size: 13px;
          font-weight: 400;
          line-height: 26px;
          color: rgba(253, 82, 0, 1);
          text-align: center;
        }
      }

      .comment {
        display: flex;
        justify-content: center;
        padding-top: 8px;
        .flex-left {
          flex: 0 0 80px;
          height: 26px;
          border: 1px solid rgba(201, 201, 201, 1);
          border-radius: 5px;
          margin-right: 10px;
          display: flex;
          align-items: center;
          justify-content: center;

          img {
            width: 14px;
            height: 14px;
            margin-right: 4px;
          }

          span {
            font-size: 13px;
            font-weight: 400;
            color: rgba(33, 33, 33, 1);
          }
        }

        .flex-right {
          flex: 1;
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