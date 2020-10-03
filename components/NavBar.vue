<template>
  <div class="nav-container" :class="{'only-capsule-container':onlyCapsule}" :style="{height: navHeightpx+barHeight+'px', 'background': background}">
    <div class="btn-group" v-if="onlyCapsule">
      <div class="nav-capsule" :style="{'background-color': 'rgba(255,255,255,0.7)', top: capsuleTop+'px'}">
        <div class="nav-back" @click="handleBack">
          <img :src="backImg" mode='aspectFill'>
        </div>
        <div class="separator"></div>
        <div class="nav-home" @click="handleHome">
          <img :src="homeImg" mode='aspectFill'>
        </div>
      </div>
    </div>
    <div class="nav-bar" :style="{height: navHeightpx+'px', paddingTop: barHeight+'px'}" v-else>
    <!-- <div class="nav-bar" :style="{height: 88+'rpx', paddingTop: barHeight+'px'}"> -->
      <div class="nav-title" :style="{top: barHeight+'px'}" v-if="!noTitle">
        <span class="title" v-if="navTitle">{{navTitle}}</span>
        <span class="title" v-else>{{defaultTitle}}</span>
      </div>
      <div class="btn-group" v-if="showCapsule">
        <div class="nav-capsule">
          <div class="nav-back" @click="handleBack">
            <img :src="backImg" mode='aspectFill'>
          </div>
          <div class="separator"></div>
          <div class="nav-home" @click="handleHome">
            <img :src="homeImg" mode='aspectFill'>
          </div>
        </div>
      </div>
    </div>
    <!-- <div :style="{'height': navHeight+'px'}"></div> -->
    <!-- <div :style="{'height': navHeight+'rpx'}"></div> -->
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'NavBar',
  props: ['showCapsule', 'navTitle', 'background', 'onlyCapsule'],
  data() {
    return {
      defaultTitle: 'HS炉石情报站',
      backImg: '/static/icons-v2/back.png',
      homeImg: '/static/icons-v2/home.png'
    }
  },
  computed: {
    ...mapGetters([
      'navHeight',
      'isIphoneX',
      'barHeight'
    ]),
    navHeightpx() {
      return uni.upx2px(this.navHeight)
    },
    capsuleTop() {
      return uni.upx2px(15)+this.barHeight
    }
  },
  methods: {
    handleBack() {
      let pages = getCurrentPages(); // 当前页面
      let beforePage = pages[pages.length - 2]; // 前一个页面
      let _this = this
      if (beforePage === undefined) {
        wx.switchTab({
          url: '/pages/index/index',
          success: function() {
            _this.$emit('navBackHome')
          }
        })
      } else {
        wx.navigateBack({
          success: function() {
            _this.$emit('navBack')
          }
        })
      }
    },
    handleHome() {
      let _this = this
      wx.switchTab({
        url: '/pages/index/index',
        success: function() {
          _this.$emit('navBackHome')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.only-capsule-container {
  position: fixed;
  z-index: 5;
}
.nav-bar {
  position: fixed !important;
  // min-height: 92rpx;
  width: 100%;
  top: 0;
  background: #fff;
  color: #000000;
  z-index: 9999;
  .nav-title {
    position: absolute;
    display: inline-block;
    // height:100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    max-width: 400rpx;
    text-align: center;
    font-size: 32rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 600;
    .title {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: inline;
    }
  }
}
.btn-group {
  position: relative;
  height: 100%;
  width: 174rpx;
  animation: fadeIn 0.5s;
  .nav-capsule {
    position: absolute;
    top: 15rpx;
    // top: 50%;
    left: 15rpx;
    // transform: translateY(-50%);
    // bottom: 18rpx;
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    height: 60rpx;
    border: 1rpx solid rgba(0,0,0,0.1);
    border-radius: 32rpx;
    padding:0 12rpx;
    box-sizing:border-box;
  }
  .separator {
    width: 1rpx;
    height: 32rpx;
    background-color: rgba(0,0,0,0.1);
  }
  .nav-back, .nav-home {
    display: flex;
    width:56rpx;
    height:56rpx;
    text-align: center;
    img {
      width: 32rpx;
      height: 36rpx;
      margin: auto;
    }
  }
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
