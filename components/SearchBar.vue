<template>
<div class="search-bar">
  <div class="search-bar-form">
    <div class="serach-bar-box">
      <div class="zan-icon zan-icon-search"></div>
      <input type="text" v-model="message" :placeholder="placeholder" @input="handleInput" @confirm="handleConfirm">
    </div>
  </div>
  <div class="reset-btn" v-if="reset">
    <button @click="handleReset">重 置</button>
  </div>
</div>
</template>
<script>
export default {
  name: 'SearchBar',
  props: ["placeholder", "reset"],
  data() {
    return {
      message: ''
    }
  },
  methods: {
    handleConfirm(e) {
      this.$emit('handleConfirm', e.mp.detail.value)
    },
    handleInput(e) {
      this.$emit('update:search', e.mp.detail.value.trim())
    },
    handleReset(e) {
      this.message = ''
      this.$emit('resetFilter')
    }
  },
}
</script>
<style lang="scss" scoped>
@import '../style/color';
.search-bar {
  display: flex;
  /*padding: 20rpx 30rpx;*/
  .search-bar-form {
    position: relative;
    background-color: #f8f8f8;
    flex: auto;
    /*border: 1rpx solid #4f4f4f;*/
    border-radius: 34rpx;
    .serach-bar-box {
      padding-left: 72rpx;
      font-size: 28rpx;
      color: #999;
      .zan-icon {
        position: absolute;
        left: 32rpx;
        top: 50%;
        transform: translateY(-50%);
      }
      input {
        height: 58rpx;
        line-height: 58rpx;
      }
    }
  }
  .reset-btn {
    button {
      float: right;
      height: 100%;
      line-height: 64rpx;
      width: 120rpx;
      padding: 0;
      font-size: 28rpx;
      color: white;
      background-color: $palette-blue;
      border-radius: 74rpx;
      margin-left: 18rpx;
      &:after {
        border: none;
      }
    }
  }
}
</style>
