<template>
  <div class="add-cart-wrp">
    <popup ref="selectSku" type="bottom" className="select-sku">
      <div class="food-popup-wrp">
        <div class="food-name">{{food.title}}</div>
        <div class="guide-sku" v-if="food && food.sku.length > 1">
          <p class="title">选择规格：</p>
          <ul class="sku-list">
            <li
              class="sku-item"
              v-for="(item, k) in food.sku"
              :key="k"
              :class="{'active-sku': skuIndex === k}"
              @click="skuIndex = k"
            >{{item.title}}</li>
          </ul>
        </div>
        <div class="food-attribute" v-for="(item, index) in food.attribute" :key="index">
          <p class="title">{{item.title}}:</p>
          <ul class="attribute-list">
            <li
              class="sku-item"
              v-for="(text, k) in item.attrs"
              :key="k"
              :class="{'active-sku': item.curId === text.attribute_id}"
              @click="chooseAttr(index,text.attribute_id)"
            >{{text.title}}</li>
          </ul>
        </div>
        <div class="content-area">
          <div class="food-price" v-if="food">￥{{food.sku[skuIndex].price}}</div>
          <div class="btn-area">
            <div class="reduct" @click="subNum">
              <img src="../../../static/images/reduct-cart.png" alt />
            </div>
            <div class="cart-num">{{num}}</div>
            <div class="add" @click="addNum">
              <img src="../../../static/images/add-cart.png" alt />
            </div>
          </div>
        </div>
        <div class="add-cart" @click="addCart">
          <img src="../../../static/images/add-adr.png" alt />
          <p>加入购物车</p>
        </div>
      </div>
    </popup>
    <popup ref="foodModal" type="bottom" className="food-modal">
      <div class="food-popup-wrp">
        <div class="food-content">
          <div class="food-cover-box">
            <div class="food-cover">
              <img :src="food.cover" alt />
            </div>
            <div class="cancel" @click="closeFoodMoadl">
              <p>关闭</p>
            </div>
          </div>
          <p class="food-name">{{food.title}}</p>
          <p class="food-detail" v-if="food.description">{{food.description}}</p>
        </div>
        <div class="footer" v-if="food.sku">
          <div class="content-area" v-if="food.sku.length <= 1 && food.attribute && food.attribute.length <= 1">
            <div class="food-price" v-if="food.sku.length">￥{{food.sku[0].price}}</div>
            <div class="btn-area">
              <div class="reduct" @click="subNum">
                <img src="../../../static/images/reduct-cart.png" alt />
              </div>
              <div class="cart-num">{{num}}</div>
              <div class="add" @click="addNum">
                <img src="../../../static/images/add-cart.png" alt />
              </div>
            </div>
          </div>
          <div class="add-cart" @click="handleAddCard">
            <img src="../../../static/images/add-adr.png" alt v-if="food.sku.length > 1 || (food.attribute && food.attribute.length != 0)" />
            <p>{{food.sku.length > 1 || (food.attribute && food.attribute.length != 0) ? '选择规格': '加入购物车'}}</p>
          </div>
        </div>
      </div>
    </popup>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import popup from '@/components/popup'
export default {
  components: { popup },
  data () {
    return {
      num: 1,
      skuIndex: 0,
      showType: '',
      shopId: '',
      food: '',
      index: 0
    }
  },
  onUnload () {
    Object.assign(this, this.$options.data())
  },
  methods: {
    chooseAttr (index, text) {
      let attribute = this.food.attribute
      attribute[index].curId = text
      this.food.attribute = [].concat(attribute)
    },
    subNum () {
      if (this.num <= 1) {
        return
      }
      this.num--
    },
    addNum () {
      if (this.num > this.food.sku[this.skuIndex].stock) {
        wx.showToast({
          title: '商品库存不足',
          icon: 'none',
          image: '',
          duration: 1500,
          mask: false,
          success: result => {},
          fail: () => {},
          complete: () => {}
        })
      }
      this.num++
    },
    showSelect (food, type, shopid, index) {
      this.index = index
      this.shopId = shopid
      this.skuIndex = 0
      this.showType = type
      if (food.attribute) {
        food.attribute.forEach(ele => {
          ele.curId = ele.attrs[0].attribute_id
        })
      }
      this.food = food
      this.num = this.food.sku[this.skuIndex].num >= 1 ? this.food.sku[this.skuIndex].num : 1
      if (type) {
        if (this.food.attribute) {
          this.food.attribute.forEach(ele => {
            ele.curId = ele.attrs[0].attribute_id
          })
        }
        this.$refs.selectSku.toggle('show')
        this.$refs.foodModal.toggle('hide')
      } else {
        this.$refs.foodModal.toggle('show')
        this.$refs.selectSku.toggle('hide')
      }
    },
    closeFoodMoadl () {
      this.$refs.foodModal.toggle('hide')
    },
    selectSku () {
      this.$refs.selectSku.toggle()
    },
    handleAddCard () {
      if ((this.food && this.food.sku.length > 1) || this.food.attribute.length) {
        this.closeFoodMoadl()
        this.selectSku()
        return
      }
      this.addCart()
    },
    addCart () {
      let food = this.food
      let count = 0
      food.sku[this.skuIndex].num = this.num

      food.sku.forEach(sku => {
        count += sku.num
      })

      let attr = this.food.attribute.map(attr => {
        return attr.curId
      })
      this.SKU_CART_CART({index: this.food.index, foodIndex: this.food.foodIndex, count, num: this.num, skuIndex: this.skuIndex, attr: attr, skuTitle: this.food.sku[this.skuIndex].title})
      this.$refs.selectSku.toggle('hide')
      this.$refs.foodModal.toggle('hide')
    },
    ...mapMutations([
      'HANDLE_CART',
      'SKU_CART_CART'
    ])
  },
  watch: {
    skuIndex (newVal, oldVal) {
      if (this.food) {
        this.num = this.food.sku[newVal].num >= 1 ? this.food.sku[newVal].num : 1
      }
    }
  }
}
</script>

<style lang="less" scoped>
.add-cart-wrp {
  .food-modal {
    position: relative;
    z-index: 9999;
    .food-popup-wrp {
      background: rgba(255, 255, 255, 1);
      position: relative;
      display: flex;
      flex-flow: column;
      border-radius: 15px 15px 0 0;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      .food-content {
        width: 100%;
        .food-cover-box {
          width: 100%;
          height: 375px;
          overflow: hidden;
          position: relative;
          .food-cover {
            width: 100%;
            height: 100%;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .cancel {
            width: 120px;
            height: 120px;
            background: rgba(0, 0, 0, 0.7);
            border-radius: 50%;
            position: absolute;
            top: -60px;
            right: -60px;
            p {
              position: absolute;
              top: 72px;
              left: 16px;
              font-size: 17px;
              font-weight: 400;
              line-height: 24px;
              color: rgba(255, 255, 255, 1);
            }
          }
        }
        .food-name {
          font-size: 19px;
          font-weight: 800;
          color: rgba(33, 33, 33, 1);
          padding: 10px 0;
          padding-left: 24px;
        }
        .food-detail {
          font-size: 13px;
          font-weight: 400;
          line-height: 18px;
          color: rgba(120, 120, 120, 1);
          padding-bottom: 10px;
          padding-left: 24px;
        }
      }

      .footer {
        padding-bottom: 24px;
        .content-area {
          height: 66px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid #f2f2f2;
          .food-price {
            font-size: 23px;
            font-weight: 800;
            color: rgba(253, 82, 0, 1);
          }
          .btn-area {
            display: flex;
            align-items: center;
            justify-content: center;
            .reduct,
            .add {
              width: 20px;
              height: 20px;
              background: rgba(255, 255, 255, 1);
              box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;

              img {
                width: 10px;
                height: 10px;
              }
            }

            .cart-num {
              height: 21px;
              font-size: 15px;
              font-weight: 300;
              line-height: 21px;
              color: rgba(33, 33, 33, 1);
              margin: 0 13px;
            }
          }
        }
        .add-cart {
          bottom: 26px;
          width: 327px;
          height: 50px;
          margin: 0 auto;
          background: linear-gradient(
            90deg,
            rgba(255, 159, 30, 1) 0%,
            rgba(246, 119, 15, 1) 100%
          );
          box-shadow: 0px 3px 10px rgba(246, 119, 15, 0.4);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          img {
            height: 14px;
            width: 14px;
            margin-right: 5px;
          }

          p {
            font-size: 17px;
            font-weight: 400;
            line-height: 46px;
            color: rgba(255, 255, 255, 1);

            text-align: center;
          }
        }
      }
    }
  }

  .select-sku {
    position: relative;
    z-index: 9999;
    .food-popup-wrp {
      background: rgba(255, 255, 255, 1);
      border-radius: 20px 20px 0px 0px;
      position: relative;
      padding: 24px;
      padding-bottom: 76px;

      .food-name {
        font-size: 19px;
        font-weight: 800;
        color: rgba(33, 33, 33, 1);
        padding-bottom: 24px;
      }
      .guide-sku {
        .title {
          font-size: 13px;
          font-weight: 400;
          color: rgba(33, 33, 33, 1);
          padding-bottom: 10px;
        }
        .sku-list {
          display: flex;
          align-items: center;
          flex-flow: row wrap;
          justify-content: space-between;
          .sku-item {
            width: 90px;
            height: 29px;
            border: 3px solid rgba(232, 232, 232, 1);
            border-radius: 5px;
            margin-bottom: 16px;
            border-radius: 5px;
            font-size: 15px;
            font-weight: 400;
            line-height: 29px;
            text-align: center;
            color: rgba(165, 165, 165, 1);
          }
          .active-sku {
            background: linear-gradient(
              90deg,
              rgba(244, 186, 28, 1) 0%,
              rgba(255, 159, 30, 1) 100%
            );
            box-shadow: 0px 1px 6px rgba(255, 159, 30, 0.5);
            color: #fff;
            border: none;
            width: 96px;
            height: 35px;
            line-height: 35px;
          }
        }
      }
      .food-attribute {
        .title {
          font-size: 13px;
          font-weight: 400;
          color: rgba(33, 33, 33, 1);
          padding-bottom: 10px;
        }
        .attribute-list {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-flow: row wrap;
          .sku-item {
            width: 90px;
            height: 29px;
            border: 3px solid rgba(232, 232, 232, 1);
            border-radius: 5px;
            margin-bottom: 16px;
            border-radius: 5px;
            font-size: 15px;
            font-weight: 400;
            line-height: 29px;
            text-align: center;

            color: rgba(165, 165, 165, 1);
          }
          .active-sku {
            background: linear-gradient(
              90deg,
              rgba(244, 186, 28, 1) 0%,
              rgba(255, 159, 30, 1) 100%
            );
            box-shadow: 0px 1px 6px rgba(255, 159, 30, 0.5);
            color: #fff;
            border: none;
            width: 96px;
            height: 35px;
            line-height: 35px;
          }
        }
      }
      .content-area {
        height: 66px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-top: 1px solid #f2f2f2;
        .food-price {
          font-size: 23px;
          font-weight: 800;
          color: rgba(253, 82, 0, 1);
        }
        .btn-area {
          display: flex;
          align-items: center;
          justify-content: center;

          .reduct,
          .add {
            width: 20px;
            height: 20px;
            background: rgba(255, 255, 255, 1);
            box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;

            img {
              width: 10px;
              height: 10px;
            }
          }

          .cart-num {
            height: 21px;
            font-size: 15px;
            font-weight: 300;
            line-height: 21px;
            color: rgba(33, 33, 33, 1);
            margin: 0 13px;
          }
        }
      }
      .add-cart {
        position: absolute;
        bottom: 26px;
        width: 327px;
        height: 50px;
        left: 0;
        right: 0;
        margin: 0 auto;
        background: linear-gradient(
          90deg,
          rgba(255, 159, 30, 1) 0%,
          rgba(246, 119, 15, 1) 100%
        );
        box-shadow: 0px 3px 10px rgba(246, 119, 15, 0.4);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          height: 14px;
          width: 14px;
          margin-right: 5px;
        }

        p {
          font-size: 17px;
          font-weight: 400;
          line-height: 46px;
          color: rgba(255, 255, 255, 1);

          text-align: center;
        }
      }
    }
  }
}
</style>
