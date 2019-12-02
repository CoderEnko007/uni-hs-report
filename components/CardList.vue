<template>
  <scroll-view scroll-y='true'
    @scrolltolower='scrollToBottom'
    @scrolltoupper="scrollToTop"
    :style="{height: scrollHeight+'px'}">
    <div class="card-list">
      <div class="card" v-for="(item, index) in list" :key="index" @click="handleClick(item, index)">
        <img :class="{'large': largeImg?true:false}" :src="item.image" mode="aspectFit">
        <p>{{item.name}}</p>
      </div>
    </div>
    <div class="load-panel" style="margin-top:-40rpx; margin-bottom:5vh;">
      <load-more v-if="loading" :loading='true' />
      <load-more v-else-if="nodata" :nodata='true' />
      <load-more v-else :nomore='true' />
    </div>
  </scroll-view>
</template>
<script>
  import { mapGetters } from 'vuex'
  import loadMore from '@/components/load-more.vue'
  export default {
    name: 'CardList',
    props: ['list', 'loading', 'nodata', 'largeImg', 'noTabBar'],
    components: {
      loadMore
    },
    computed: {
      ...mapGetters([
        'winWidth',
        'winHeight',
        'navHeight',
        'tabHeight'
      ]),
      scrollHeight() {
        // 89+104+74+60
        const res = wx.getSystemInfoSync()
        const tabHeight = res.screenHeight-res.windowHeight
        console.log(res.windowHeight, this.navHeight, res.windowWidth, tabHeight)
        let ratio = res.windowWidth/750
        if (this.noTabBar) {
          // 85+96
          return res.windowHeight-this.navHeight-(85+96)*ratio+tabHeight
          // return this.winHeight-this.navHeight-82*ratio
        } else {
          return res.windowHeight-this.navHeight-(89+234)*ratio
        }
      }
    },
    methods: {
      handleClick(item, index) {
        this.$emit('cardClick', item, index)
      },
      scrollToBottom(e) {
        // console.log('scroll to bottom', e)
        this.$emit('scrollToBottom')
      },
      scrollToTop(e) {
        // console.log('scroll to top', e)
        this.$emit('scrollToTop')
      },
    },
  }
</script>
<style lang="scss" scoped>
  .card-list {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    box-sizing: border-box;
    padding: 18rpx 18rpx 0;
    margin-top: 15rpx;
    overflow: hidden;

    .card {
      width: 30%;
      height: 260rpx;
      padding: 0 0 8rpx;
      margin-bottom: 65rpx;
      text-align: center;
      font-size: 24rpx;

      img {
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        // transform: scale(1.1);
      }
      .large {
        transform: scale(1.2);
      }

      p {
        width: 100%;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
</style>
