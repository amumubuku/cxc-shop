<template>
  <div class="cart">
    <div class="cart-list">
      <div class="cart-item" v-for="(item, index) in 5" :key="index" :class="{active:index % 2}">
        <div class="cart-top">
          <div class="flex-left">
            <div class="shop-cover">
              <img src alt />
            </div>
            <div class="shop-name"></div>
          </div>
          <div class="flex-right">
            <p>111</p>
          </div>
        </div>
        <div class="food-list">
          <div class="food-list" v-for="(item, k) in 5" :key="k">
            <div class="food-cover">
              <img src alt />
            </div>
            <p class="food-name">11</p>
            <div class="price">11</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['cartList'])
  },
  mounted () {
  }
}
</script>
<style lang="less">
@import "./style";
</style>
