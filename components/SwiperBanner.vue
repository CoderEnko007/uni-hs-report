<template>
<div id="swiper">
  <swiper indicator-dots autoplay circular interval="3000" indicator-active-color="#fff" indicator-color="rgba(255, 255, 255, .5)">
    <swiper-item class="item" v-for="(item, index) in banners" :key="item.id" @click="handleClick(item)">
      <img class="swiper-img" :src="item.image" mode="aspectFill">
      <div class="meta" v-if="index===0">
        <h1>今日数据</h1>
        <p>{{updateDate}}</p>
      </div>
    </swiper-item>
  </swiper>
</div>
</template>
<script>
export default {
  props: ['banners', 'date'],
  data() {
    return {

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
    }
  }
}
</script>
<style lang="scss" scoped>
swiper {
  height: 335rpx;
  swiper-item {
    position: relative;
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
  }
}
.swiper-img {
  width: 100%;
  height: 100%;
}
</style>
