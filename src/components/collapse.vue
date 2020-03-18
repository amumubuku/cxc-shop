<template>
  <div class="collapse ">
    <div class="food-list"
      role="tab"
      :aria-expanded="active ? 'true' : 'false'"
      :class="active ? 'collapse-header' : 'is-active'">
      <div class="food-item"
        v-for="(item, index) in goods"
        :key="index">
        <div class="food-img">
          <img :src="item.cover"
            alt />
        </div>
        <div class="foods-box">
          <div class="food-info">
            <p>{{item.title ? item.title :item.goods_title}}</p>
            <p class="num">数量X{{item.num ? item.num : item.number}}</p>
          </div>
          <div class="food-price">¥{{item.foodPrice ? item.foodPrice : item.real_price}}</div>
        </div>
      </div>
    </div>
    <div class="collapse-footer"
      @click.stop="toggle"
      v-if="goods.length > 2"
      >
      <p style="padding-right:4px">{{active ? "展开更多" : "收起"}}</p>
      <img src="http://p2.icaixiaochu.com/more.png"
        alt
        :class="active ? '' : 'normal'" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'Collapse',
  data () {
    return {
      active: false,
      text: '展开更多',
      hide: true
    }
  },
  props: {
    selected: {
      type: Boolean,
      default: false
    },
    goods: {
      type: Array,
      default: []
    }
  },
  ready () {
    if (this.active) {
      this.$emit('collapse-open', this.index)
    }
  },
  methods: {
    toggle () {
      this.active = !this.active
    }
  }
}
</script>
<style lang="less" scoped>
.is-active {
  height: auto;
  transition: height 0.3s;
}

.collapse {
  width: 100%;
  .food-list {
    .food-item {
      padding-left: 14px;
      height: 85px;
      display: flex;
      align-items: center;
      .food-img {
        margin-right: 10px;
        height: 60px;
        flex: 0 0 60px;
        background: #ccc;
        border-radius: 5px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .foods-box {
        height: 100%;
        padding: 12px 0;
        padding-right: 14px;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #f2f2f2;
        box-sizing: border-box;
        .food-info {
          display: flex;
          flex-flow: column nowrap;
          justify-content: space-between;
          height: 100%;
          p {
            font-size: 13px;
            font-weight: 800;
            color: rgba(33, 33, 33, 1);
          }
          .num {
            font-size: 13px;
            font-weight: 400;
            color: rgba(165, 165, 165, 1);
          }
        }
        .food-price {
          font-size: 15px;
          font-weight: 800;
          color: rgba(253, 82, 0, 1);
        }
      }
      .foods-box:last-child {
        border:  none;
      }
      
    }

    .food-item:last-child {
      margin-bottom: 0;
    }
  }
}

.collapse-header {
  height: 170px;
  overflow: hidden;
}

.collapse-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  background-color: #fff;
  padding: 0 16px;
  box-sizing: content-box;
  position: relative;

  // &:after {
  //   content: " ";
  //   position: absolute;
  //   top: 0px;
  //   display: block;
  //   height: 1px;
  //   width: 342px;
  //   background-color: #f0f0f0;
  // }

  img {
    transition: all 0.5s;
    width: 15px;
    height: 15px;
    transform: rotate(90deg);
  }

  .normal {
    transform: rotate(270deg);
  }

  p {
    font-size: 13px;
    font-weight: 500;
    line-height: 18px;
    color: rgba(0, 0, 0, 0.6);
  }
}
</style>