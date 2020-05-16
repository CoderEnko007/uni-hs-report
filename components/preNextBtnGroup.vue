<template>
<div class="btn-group">
  <div class="btn-group" :style="{'height':isIphoneX?130+'rpx':90+'rpx'}">
    <button class="btn previous" @click="handlePrevious" :class="{'de-active': !prevBtnEnable}" :style="{'margin-bottom':isIphoneX?40+'rpx':0}"><span>上一张</span></button>
    <button class="btn next" @click="handleNext" :class="{'de-active': !nextBtnEnable}" :style="{'margin-bottom':isIphoneX?40+'rpx':0}"><span>下一张</span></button>
  </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'preNextBtnGroup',
  props: ['prevBtnEnable', 'nextBtnEnable'],
  data() {
    return {
      
    }
  },
  computed: {
    ...mapGetters([
      'isIphoneX',
    ])
  },
  methods: {
    handlePrevious() {
      this.$emit('previousClick')
    },
    handleNext() {
      this.$emit('nextClick')
    },
  }
}
</script>

<style scoped lang="scss">
@import '../style/color';
.btn-group {
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: center;
  width: 750rpx;
  height: 90rpx;
  background-color: #fff;
  .btn {
    width: 40%;
    height: 60rpx;
    line-height: 60rpx;
    text-align: center;
    border-radius: 10rpx;
    background-color: $palette-blue;
    color: #fff;
    font-size: 26rpx;
  }
  .de-active {
    background: rgba(67, 62, 136, .2);
    color: rgba(67, 62, 136, .5);
    border: 1rpx solid rgba(67, 62, 136, .5);
  }
}
</style>
