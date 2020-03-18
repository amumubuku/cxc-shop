<template>
  <div class="confirm-modal">
    <popup ref="confirmModal" class="confirm-modal">
      <div class="modal-wrp">
        <div class="title"></div>
        <div class="text"></div>
        <div class="btn-area">
          <div class="cancel-btn">取消</div>
          <div class="confirm-btn">确定</div>
        </div>
      </div>
    </popup>
  </div>
</template>

<script>
import popup from '../popup'
export default {
  components: { popup },
  props: {
    title: {
      type: String,
      defalut: '确定?'
    },
    text: {
      type: String,
      defalut: '确定提交么'
    }
  },
  methods: {
    cancel () {
      this.$emit('cancel')
    },
    confirm () {
      this.$emit('confirm')
    }
  },
  mounted () {
    setTimeout(() => {
      this.$refs.confirmModal.toggle()
    }, 300)
  }
}
</script>
<style lang="less">
.confirm-modal {
  .modal-wrp {
    width: 301px;
    height: 225px;
    background: rgba(255, 255, 255, 1);
    border-radius: 10px;
    padding: 32px;
    box-sizing: border-box;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    .title {
      width: 105px;
      height: 29px;
      font-size: 21px;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 29px;
      color: rgba(33, 33, 33, 1);
      opacity: 1;
    }
    .text {
      width: 238px;
      height: 48px;
      font-size: 17px;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 24px;
      color: rgba(120, 120, 120, 1);
      opacity: 1;
    }
    .btn-area {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .cancel-btn {
        width: 111px;
        height: 40px;
        border: 1px solid rgba(255, 159, 30, 1);
        opacity: 0.5;
        border-radius: 20px;
      }
      .confirm-btn {
        width: 111px;
        height: 40px;
        background: linear-gradient(
          90deg,
          rgba(244, 186, 28, 1) 0%,
          rgba(255, 159, 30, 1) 100%
        );
        box-shadow: 0px 1px 6px rgba(255, 159, 30, 0.5);
        opacity: 1;
        border-radius: 20px;
      }
    }
  }
}
</style>