<template>
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
</template>

<script>
export default {
  props: {
    food: Object
  },
  computed: {
    foodNum: function () {
      if (this.food.sku && this.food.sku.length) {
        let num = 0
        this.food.sku.forEach(element => {
          num += element.num ? element.num : 0
        })
        return num
      }
    }
  },
  methods: {
    selectSku () {
      this.$emit('selectSku', {...this.food})
    },
    addCart () {
      if (this.food.sku.length) {
        this.food.sku[0].num++
      } else {
        wx.showToast({
          title: '加入购物车发生未知错误!',
          icon: 'none',
          image: '',
          duration: 1500,
          mask: false,
          success: result => {},
          fail: () => {},
          complete: () => {}
        })
      }
    },
    removeCart () {
      this.food.sku[0].num--
    }
  }
}
</script>
<style lang="less" scoped>
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
</style>
