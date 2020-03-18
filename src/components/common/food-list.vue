
<template>
  <div class="food-wrp">
    <ul class="food-list">
      <li
        class="food-item"
        v-for="(food, foodIndex) in foodList"
        :key="foodIndex"
        @click="selectFood(food,0)"
      >
        <div class="food-cover">
          <img :src="food.cover" alt />
        </div>
        <div class="food-content">
          <p class="food-name">{{food.title}}</p>
          <p class="food-des">{{food.description}}</p>
          <div class="shop-tag-list">
            <div
              class="tag-item"
              style="color: #FA7B5D;border-color: #FA7B5D}"
              v-if="food.discount && food.discount.price_value"
            >{{food.discount.price_value}}折</div>
            <div
              class="tag-item"
              style="color: #FF9F1E;border-color: #FF9F1E}"
              v-if="food.discount && food.discount.limit_num"
            >限购{{food.discount.limit_num}}份</div>
          </div>
          <div class="footer-area">
            <div class="food-price" v-if="food.sku.length">
              <span class="tip">￥</span>
              <p class="price">{{food.sku[0].price}}</p>
              <p class="normal-price" v-if="food.discount">￥{{food.discount.price_value}}</p>
            </div>
            <div class="btn-area">
              <div class="btn-area">
                <div class="cart-button" v-if="food.sku.length < 2">
                  <div class="reduct extend" @click.stop="removeCart" v-if="foodNum">
                    <img src="../../../static/images/reduct-cart.png" alt />
                  </div>
                  <div class="food-num" v-if="foodNum">{{foodNum}}</div>
                  <div class="add extend" @click.stop="addCart">
                    <img src="../../../static/images/add-cart.png" alt />
                  </div>
                </div>
                <div class="choose-sku-area" @click.stop="selectSku" v-else>
                  <p class="title">选规格</p>
                  <p class="tip" v-if="foodNum">{{foodNum}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <cart-foodlist :shopinfo="shop"></cart-foodlist>
    <select-food :type="selectType" ref="selectType"></select-food>
  </div>
</template>

<script>
import selectFood from '@/components/common/select-food'
import cartFoodlist from './cart-foodlist'
export default {
  components: { cartFoodlist, selectFood },
  props: {
    foodList: Array,
    shop: Object
  },
  data () {
    return {
      selectType: ''
    }
  },
  computed: {},
  methods: {
    selectFood (food, type) {
      this.$refs.selectModal.showSelect(food, type, this.shop.id)
    }
  }
}
</script>
<style lang="less" scoped>
.food-wrp {
  .food-list {
    .food-item {
      height: 110px;
      border-bottom: 1px solid #f2f2f2;
      display: flex;
      align-items: center;
      padding: 12px 10px 12px 0;
      margin-left: 8px;
      box-sizing: border-box;

      .food-cover {
        flex: 0 0 85px;
        height: 85px;
        border-radius: 5px;
        overflow: hidden;
        margin-right: 10px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .food-content {
        height: 100%;
        flex: 1;
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-between;

        .food-name {
          font-size: 15px;
          font-weight: 800;
          color: rgba(33, 33, 33, 1);
        }

        .food-des {
          font-size: 11px;
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

        .footer-area {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .food-price {
            font-size: 11px;
            font-weight: 400;
            line-height: 16px;
            color: rgba(253, 82, 0, 1);
            display: flex;
            align-items: baseline;

            .tip {
              font-size: 11px;
            }

            .price {
              font-size: 14px;
            }
          }

          .btn-area {
            .choose-sku-area {
              position: relative;
              width: 49px;
              height: 24px;
              background: linear-gradient(
                90deg,
                rgba(244, 186, 28, 1) 0%,
                rgba(255, 159, 30, 1) 100%
              );
              box-shadow: 0px 1px 6px rgba(255, 159, 30, 0.5);
              border-radius: 5px;
              .title {
                width: 100%;
                height: 100%;
                text-align: center;
                line-height: 24px;
                text-align: center;
                font-size: 11px;
                font-weight: 400;
                color: rgba(255, 255, 255, 1);
              }
              .tip {
                position: absolute;
                right: -5px;
                top: -6px;
                width: 14px;
                height: 14px;
                background: rgba(253, 82, 0, 1);
                box-shadow: 0px 1px 6px rgba(253, 82, 0, 0.4);
                border-radius: 50%;
                line-height: 14px;
                text-align: center;
                font-size: 11px;
                font-weight: 400;
                color: rgba(255, 255, 255, 1);
              }
            }
            .cart-button {
              display: flex;
              align-items: center;
              justify-content: center;
              .reduct,
              .add {
                padding: 6px;
                width: 20px;
                position: relative;
                height: 20px;
                background: rgba(255, 255, 255, 1);
                box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-sizing: border-box;

                img {
                  width: 10px;
                  height: 10px;
                }
              }
              .extend::after {
                content: "";
                position: absolute;
                top: -10px;
                left: -10px;
                right: -10px;
                bottom: -10px;
              }

              .food-num {
                height: 21px;
                font-size: 15px;
                font-weight: 300;
                line-height: 21px;
                color: rgba(33, 33, 33, 1);
                margin: 0 13px;
              }
            }
          }
        }
      }
    }
  }
}
</style>