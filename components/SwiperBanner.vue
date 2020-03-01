<template>
<div class="container">
  <swiper class="swiper-box" autoplay circular duration='200' @change="change">
    <swiper-item class="item" v-for="(item, index) in banners" :key="item.id" @click="handleClick(item)">
      <img class="swiper-img" :src="item.image" mode="aspectFill">
      <div class="meta" v-if="index===0">
        <h1>今日数据</h1>
        <p>{{updateDate}}</p>
      </div>
    </swiper-item>
  </swiper>
  <!-- 轮播指示点样式修改 -->
  <view class="dots">
  	<block v-for="(item,index) in banners" :key="item.id">
  		<view class="dot" :class="index==currentIndex ? ' active' : ''"></view>
  	</block>
  </view>
</div>
</template>
<script>
export default {
  props: ['banners', 'date'],
  data() {
    return {
      currentIndex: 0,
      mode: 'round'
    }
  },
  computed: {
    updateDate() {
      if (this.date) {
        let formatDate = new Date(this.date)
        return formatDate.getMonth()+1 + '月' + formatDate.getDate() + '日更新'
      }
    }
  },
  methods: {
    handleClick(item) {
      this.$emit('swiperClick', item)
    },
    change(e) {
      // console.log('start', this.currentIndex)
    	this.currentIndex = e.detail.current;
      // console.log('end', this.currentIndex)
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  position: relative;
  .swiper-box {
    position: relative;
    width: 100%;
    height: 335rpx;
    // border-radius: 15rpx;
    .meta {
      position: absolute;
      top: 64rpx;
      left: 30rpx;
      color: #FFF;
      h1 {
        height: 56rpx;
        line-height: 56rpx;
        font-size: 56rpx;
        font-weight: bold;
      }
      p {
        height: 44rpx;
        line-height: 44rpx;
        margin-top: 9rpx;
        font-size: 26rpx;
      }
    }
    .swiper-img {
      width: 100%;
      height: 100%;
    }
  }
  .dots {
    position: absolute;
    bottom: 20rpx;
    left: 50%;
    // 这里一定要注意兼容不然很可能踩坑
    transform: translate(-50%, 0);
    -webkit-transform: translate(-50%, 0);			
    z-index: 99;
    display: flex;
    flex-direction: row;
    justify-content: center;
    .dot {
      width: 30rpx;
      height: 6rpx;
      // transition: all .1s;
      background: rgba(255, 255, 255, .4);
      margin-right: 10rpx;
    }
    .active {
      width: 30rpx;
      height: 6rpx;
      background: #ffffff;
    }
  }
}
</style>
