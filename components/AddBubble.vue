<template>
<div class="bubble">
  <p class="text">点击</p>
  <img src="/static/icons-v2/setting.png" mode="aspectFit">
  <p class="text">添加到我的小程序，可快捷访问</p>
</div>
</template>

<script>
export default {
  name: "AddBubble",
  data() {
    return {

    }
  }
};
</script>

<style lang="scss" scoped>
.bubble {
  height: 46rpx;
  line-height: 46rpx;
  background-color: rgba(255,255,255,.7);
  border-radius: 20rpx;
  padding: 0 16rpx;
  overflow: hidden;
  p {
    line-height: 46rpx;
    display: inline-block;
    font-size: 24rpx;
    vertical-align:middle;
  }
  img {
    display: inline-block;
    width: 32rpx;
    height: 32rpx;
    margin:0 10rpx;
    vertical-align:middle;
  }
  &:after {
    position: absolute;
    top: -36rpx;
    right: 120rpx;
    content: '';
    border-style: solid;
    border-width: 19rpx;
    border-color: transparent transparent rgba(255,255,255,.7) transparent;
    width: 0;
    height: 0;
    overflow: hidden;
  }
}
</style>
