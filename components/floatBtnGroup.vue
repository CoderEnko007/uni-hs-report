<template>
<div class="group">
  <!--<button open-type="share" class="share"><img src="/static/icons-v2/share.png"></button>-->
  <!--<button open-type="contact" class="contact"><img src="/static/img/wechat.png"></button>-->
  <div class="badge__count" v-show="badgeCount>0">{{badgeCount}}</div>
  <button class="clickBtn" @click="handleCompareClick" v-if="showCompare"><span>对比</span></button>
  <!-- <button open-type="share" class="share" v-if="showShare"><img src="/static/icons-v2/share.png"></button> -->
  <button open-type="share" class="share" v-if="showShare"><span class="icon iconfont">&#xe63b;</span></button>
</div>
</template>
<script>
export default {
  name: 'floatBtnGroup',
  props: ['badgeCount', 'showCompare', 'showShare'],
  methods: {
    handleCompareClick() {
      this.$emit('onCompare')
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../style/color';
.group {
  .clickBtn::after {
    border: none;
  }
  .clickBtn {
    width: 90rpx;
    height: 90rpx;
    line-height: 90rpx;
    padding: 0;
    margin: 0 0 10rpx;
    /*background: rgba(0,0,0,0.48);*/
    font-size: 28rpx;
    text-align: center;
    border-radius: 50%;
    color:#000;
    background-color:#fff;
    /*box-shadow:0 4px 24px #eee;*/
    box-shadow: 0 6rpx 12rpx rgba(0, 0, 0, 0.16), 0 6rpx 12rpx rgba(0, 0, 0, 0.23);
    // border:1rpx solid #eee;
    .imageBtn {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 50rpx;
      height: 50rpx;
    }
  }
  .badge__count {
    position:absolute;
    top:-22rpx;
    right:12rpx;
    height:1.6em;
    min-width:1.6em;
    line-height:1.6;
    padding:0 .4em;
    font-size:40rpx;
    border-radius:.8em;
    background:#f44;
    color:#fff;
    text-align:center;
    white-space:nowrap;
    transform:translateX(50%) scale(0.5);
    transform-origin:center;
    z-index:10;
    box-sizing:border-box;
  }
  .share {
    .icon {
      font-size: 42rpx;
      color: #3b2e7e;
      color: $palette-blue;
    }
  }
}
</style>
