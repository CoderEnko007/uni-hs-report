<template>
<scroll-view class="container"
             scroll-y="true"
             @scrolltolower='scrollToBottom'
             @scrolltoupper="scrollToTop"
             :style="{height: winHeight-navHeight-41+'px'}">
  <div class="card-board" v-for="(item, index) in list" :key="item.id" @click="handleBoardClick(item)">
    <div class="cover">
      <img :src="item.cover" mode="aspectFill">
    </div>
    <div class="title">
      <p>{{item.title}}</p>
    </div>
    <div class="desc">
      <p>{{item.description}}</p>
    </div>
    <div class="meta">
      <div class="author">
        <img :src="item.logo.path" mode="aspectFit">
        <span class="name">{{item.author}}</span>
      </div>
      <div class="date">
        {{item.date}}
      </div>
    </div>
  </div>
  <load-more v-if="loading" :loading=true />
  <load-more v-else-if="nodata" :nodata=true />
  <load-more v-else :nomore=true />
</scroll-view>
</template>
<script>
import {mapGetters} from 'vuex'
import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
import loadMore from '@/components/load-more.vue'

export default {
  name: 'articleList',
  props: ['list', 'loading', 'nodata'],
  components: {
    loadMore
  },
  computed: {
    ...mapGetters([
      'winWidth',
      'winHeight',
      'navHeight'
    ]),
  },
  data() {
    return {
      more: true,
      page: 0,
    }
  },
  methods: {
    handleBoardClick(item) {
      uni.navigateTo({
        url: `/pages/index/articleDetail/index?group_id=${item.group_id}&id=${item.id}`
      })
    },
    scrollToBottom(e) {
      this.$emit('scrollToBottom')
    },
    scrollToTop(e) {
      this.$emit('scrollToTop')
    },
  },
}
</script>
<style lang="scss" scoped>
@import '../../../style/color';
.container {
  overflow:scroll;
  background-color: #eff3f4;
}
.card-board {
  position: relative;
  width: 100%;
  padding: 20rpx 30rpx;
  box-sizing: border-box;
  background-color: white;
  margin-bottom: 20rpx;
  .cover {
    position: relative;
    width: 100%;
    height: 250rpx;
    img {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      border-radius: 15rpx;
    }
  }
  .title {
    font-size: 16px;
    font-weight: bold;
    margin: 18rpx 2rpx 0;
  }
  .desc {
    font-size: 10px;
    color: $palette-text-gray;
    margin: 12rpx 2rpx 0;
    overflow:hidden;
    display: -webkit-box;
    text-overflow: ellipsis;
    -webkit-line-clamp:2;
    -webkit-box-orient:vertical;
    white-space:normal;
  }
  .meta {
    display: flex;
    justify-content: space-between;
    flex-wrap: nowrap;
    width: 100%;
    margin: 20rpx 2rpx 0;
    .author {
      position: relative;
      height: 40rpx;
      width:200rpx;
      img {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        display: inline-block;
        width: 50rpx;
        height: 50rpx;
      }
      .name {
        position:absolute;
        left:60rpx;
        width: 220rpx;
        line-height: 40rpx;
        font-size: 10px;
        color: #000;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
    }
    .date {
      line-height: 40rpx;
      font-size: 10px;
      color: $palette-text-gray;
    }
  }
}
.separator {
  height: 20rpx;
  background-color: #eff3f4;
}
</style>
