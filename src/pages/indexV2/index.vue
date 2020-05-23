<template>
  <div class="page-wrap dis-flex vertical flex-middle">
    <div class="adress dis-flex flex-middle">
      <div class="adress-icon"></div>
      <div class="adress-title">地址</div>
      <div class="item-right-icon"></div>
    </div>
    <div class="search-wrap dis-flex flex-middle">
      <div class="search-icon"></div>
      <div class="input-wrap dis-flex flex">
        <input type="text" class="input dis-flex flex">
      </div>
    </div>
    <div class="nav dis-flex flex-middle">
      <div class="item dis-flex vertical flex-middle flex">
        <div class="item-icon"></div>
        <div class="item-title">分类标题</div>
      </div>
    </div>
    <div class="high-quality dis-flex flex-middle flex-between">
      <div class="high-quality-left"></div>
      <div class="high-quality-right dis-flex vertical flex-middle">
        <div class="high-quality-right-top"></div>
         <div class="high-quality-right-bottom"></div>
      </div>
    </div>
    <div class="remain-wrap dis-flex vertical flex-middle">
      <div class="remain-title dis-flex flex-middle flex-between">
        <div class="remain-title-str dis-flex flex-middle">今日推荐</div>
        <div class="remain-title-more dis-flex flex-middle">更多</div>
      </div>
      <div class="goods-list dis-flex flex-middle">
        <div class="item dis-flex vertical flex-middle">
          <div class="item-img dis-flex vertical flex-top">
            <div class="item-tag"></div>
          </div>
          <div class="item-title clamp-1">标题限制一行</div>
          <div class="dis-flex flex-middle">
            <div class="now-price">17</div>
            <div class="last-price">¥30</div>
          </div>
        </div>
      </div>
    </div>
    <div class="banner"></div>
    <div class="errands dis-flex flex-middle flex-between">
      <div class="item dis-flex vertical">
        <div class="item-title">帮我买</div>
        <div class="item-des">药品/文具</div>
      </div>
      <div class="item dis-flex vertical">
        <div class="item-title">帮我取</div>
        <div class="item-des">快递/文件</div>
      </div>
      <div class="item dis-flex vertical">
        <div class="item-title">帮我送</div>
        <div class="item-des">花/情书/资料</div>
      </div>
    </div>
    <div class="select-nav dis-flex flex-middle">
      <div class="item dis-flex vertical flex-middle">
        <div class="item-title">全部</div>
        <div class="item-tag">周边好店</div>
      </div>
      <div class="item dis-flex vertical flex-middle">
        <div class="item-title">到店自取</div>
        <div class="item-tag">免配送费</div>
      </div>
      <div class="item dis-flex vertical flex-middle">
        <div class="item-title">堂食商家</div>
        <div class="item-tag">提前预定</div>
      </div>
    </div>
    <div class="search-params-wrap dis-flex flex-middle flex-between">
      <div class="dis-flex flex-middle">
        <div class="params-sort">综合排序</div>
        <div class="params-sales">销量</div>
        <div class="params-time">用时</div>
      </div>
      <div class="params-filter">筛选</div>
    </div>
    <div class="goods-list dis-flex vertical flex-middle">
      <div class="item dis-flex flex-middle">
        <div class="shop-img"></div>
        <div class="shop-info dis-flex vertical">
          <div class="shop-title">商铺名称</div>
          <div class="start-sales-time-km dis-flex flex-middle flex-between">
            <div class="dis-flex flex-middle">
              <div class="item-start"></div>
              <div class="item-salse">月售11</div>
            </div>
            <div class="dis-flex flex-middle">
              <div class="item-time">20分钟</div>
              <div class="item-km">1km</div>
            </div>
          </div>
          <div class="shop-price">起松¥30 配送¥10</div>
          <div class="tag-list dis-flex flex-middle">
            <div class="item-tag dis-flex flex-middle flex-center">x x x</div>
          </div>
          <div class="shop-goods-list dis-flex flex-middle">
            <div class="item dis-flex vertical flex-middle">
              <div class="item-img dis-flex">
                <div class="goods-tag">xxx</div>
              </div>
              <div class="goods-title dis-flex">xxx</div>
              <div class="goods-price dis-flex flex-middle">19</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
}
</script>
<style lang="less" scoped>
@import "./style";
</style>
