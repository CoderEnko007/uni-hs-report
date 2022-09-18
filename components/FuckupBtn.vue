<template>
  <view>
    <button class="fuckup_btn" @click="handleFuckup">
      <p>由于微信服务类目要求变更，暂时无法提供相应数据展示，目前正在办理相应的主体变更手续，希望小程序能尽快恢复正常，对您带来的不便敬请谅解。</p>
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
        console.log('ccc', this.user_fuck_up_flag)
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