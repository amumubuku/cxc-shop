<template>
  <div class="shop">
     商家
  </div>
</template>

<script>
export default {
  components: {
  },

  data () {
    return {
    }
  },
  methods: {
    submit (text) {
      console.log(text)
    },
    cancel (text) {
      console.log(text)
    },
    toggle () {
      this.$refs.kefuModal.toggle()
    }
  },
  mounted () {
    setTimeout(() => {
      this.$refs.kefuModal.toggle()
    }, 300)
  }
}
</script>

<style lang="less" >
@import "./style";
</style>
