<template>
  <div class="about-shop">
    <div class="about-shop-wrp">
      <div class="address-shop">
        <div class="flex-left">
          <div class="iocn">
            <img src="https://img.icaixiaochu.com/%E7%8A%B6%E6%80%81%E6%A0%8F@2x%20%281%29.png" alt />
          </div>
          <p>{{shopinfo.address}}</p>
        </div>
        <div class="make-phone" @click="makePhone">
          <img src="https://img.icaixiaochu.com/make-phone.png" alt />
        </div>
      </div>
      <div class="fee-time">
        <div class="iocn">
          <img src="https://img.icaixiaochu.com/time-icon-v2.png" alt />
        </div>
        <p>配送时间：{{shopinfo.business_hours}}</p>
      </div>
      <div class="service-shop">
        <div class="iocn">
          <img src="https://img.icaixiaochu.com/time-icon-v2.png" alt />
        </div>
        <p>商家服务：到店自取（享优惠）</p>
      </div>
      <!-- <div class="coupon-shop-wrp">
        <div class="shop-coupon-list">
          <div class="shop-coupon-item" v-for="(item, index) in 3" :key="index">
            <div class="coupon-icon">满</div>
            <p>满25减2；满28减3；满58减6（在线支付专享）</p>
          </div>
        </div>
      </div>-->
    </div>
  </div>
</template>

<script>
export default {
  props: ['shopinfo'],
  methods: {
    makePhone () {
      wx.makePhoneCall({
        phoneNumber: this.shopinfo.tel // 仅为示例，并非真实的电话号码
      })
    }
  }
}
</script>

<style lang="less" scope>
.about-shop {
  .about-shop-wrp {
    .fee-time,
    .service-shop {
      height: 54px;
      display: flex;
      align-items: center;
      padding: 0 14px;
      border-bottom: 1px solid #f2f2f2;

      .iocn {
        flex: 0 0 15px;
        height: 15px;
        margin-right: 8px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      p {
        flex: 1;
        font-size: 13px;
        font-weight: 400;
        color: rgba(33, 33, 33, 1);
      }
    }
    .address-shop {
      height: 54px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 14px;

      border-bottom: 1px solid #f2f2f2;
      .flex-left {
        flex: 1;
        display: flex;
        align-items: center;
        .iocn {
          flex: 0 0 14px;
          height: 16px;
          margin-right: 8px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        p {
          flex: 1;
          font-size: 13px;
          font-weight: 400;
          color: rgba(33, 33, 33, 1);
        }
      }
      .make-phone {
        width: 22px;
        height: 22px;
        background: linear-gradient(
          179deg,
          rgba(244, 186, 28, 1) 0%,
          rgba(255, 159, 30, 1) 100%
        );
        box-shadow: 0px 1px 6px rgba(255, 159, 30, 0.5);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          width: 14px;
          height: 14px;
        }
      }
    }

    .coupon-shop-wrp {
      padding: 0 14px;
      padding-top: 18px;
      .shop-coupon-list {
        .shop-coupon-item {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
          .coupon-icon {
            width: 15px;
            height: 15px;
            background: rgba(255, 159, 30, 1);
            text-align: center;
            line-height: 15px;
            border-radius: 2px;
            font-size: 11px;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
            margin-right: 8px;
          }
          p {
            font-size: 11px;
            font-weight: 400;
            color: rgba(120, 120, 120, 1);
          }
        }
      }
    }
  }
}
</style>