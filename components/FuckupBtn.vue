<template>
  <view>
    <button class="fuckup_btn" @click="handleFuckup">
      <p>小程序维护中，请稍后再来吧，对您带来的不便敬请谅解，感谢支持。</p>
    </button>
  </view>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name:"FuckupBtn",
    data() {
      return {
        
      };
    },
    computed: {
      ...mapGetters([
        'ifanrSettings',
        'user_fuck_up_flag'
      ]),
    },
    methods: {
      handleFuckup(e) {
        this.$emit('fuckupClick')
        this.$store.commit('setFuckupFlag', true)
      }
    }
  }
</script>

<style lang="scss" scoped>
.fuckup_btn {
  font-size: 14px;
  text-align: left;
  line-height: 2;
}

</style>