<template>
<scroll-view class="container"
             scroll-y="true"
             @scrolltolower='scrollToBottom'
             @scrolltoupper="scrollToTop"
             :style="{height: scrollHeight}">
  <div class="card-board" v-for="item in list" :key="item.id" @click="handleBoardClick(item)">
    <div class="cover">
      <img :src="item.cover" mode="aspectFill">
    </div>
    <div class="title">
      <div><span class="top" v-show="item.top">[置顶]</span>{{item.title}}</div>
    </div>
    <div class="desc">
      <p>{{item.description}}</p>
    </div>
    <div class="meta">
      <div class="author">
        <img :src="item.logo.path" mode="aspectFit">
        <span class="name">{{item.author}}</span>
      </div>
      <div class="info">
        <div class="info-item">
          <span class="icon iconfont">&#xe678;</span>
          <span v-if="item.visit_count">{{item.visit_count}}</span>
          <span v-else>0</span>
        </div>
        <div class="info-item">
          <span class="icon iconfont">&#xe658;</span>
          <span>{{item.date}}</span>
        </div>
      </div>
    </div>
  </div>
  <load-more v-if="loading" :loading='true' />
  <load-more v-else-if="nodata" :nodata='true' />
  <load-more v-else :nomore='true' />
</scroll-view>
</template>
<script>
import {mapGetters} from 'vuex'
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
      'navHeight',
      'barHeight'
    ]),
    scrollHeight() {
      let ratio = this.winWidth/750
      let navHeight = (this.navHeight+this.barHeight*2)/2
      return this.winHeight-navHeight-(70+98)*ratio+'px'
      // return this.winHeight-this.navHeight-115.5*ratio+'px'
    }
  },
  data() {
    return {
      more: true,
      page: 0,
    }
  },
  methods: {
    handleBoardClick(item) {
      let tmplIds = 'jR3I60LZRN8RuTDwpiZHuQ24Euvte5hI2RLsIaw0PJQ'
      wx.requestSubscribeMessage({
        tmplIds: [tmplIds],
        success: (res) => {
          let subscription = []
          if (res[tmplIds] === 'accept') {
            subscription.push({
              template_id: tmplIds,
              subscription_type: 'once',
            })
            wx.BaaS.subscribeMessage({subscription}).then(res => {
              // success
              console.log('subscribeMessage success', res)
            }, err => {
              // fail
              console.log('subscribeMessage fail', err)
            })
          }
        },
        fail: err => {
          console.log('requestSubscribeMessage err', err)
        },
        complete: res => {
          uni.navigateTo({
            url: `/pages/index/articleDetail/index?group_id=${item.group_id}&id=${item.id}`
          })
        }
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
    font-size: 32rpx;
    font-weight: bold;
    margin: 18rpx 2rpx 0;
    .top {
      color: red;
      margin-right: 5upx
    }
  }
  .desc {
    font-size: 20rpx;
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
        font-size: 20rpx;
        color: #000;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
    }
    .info {
      line-height: 40rpx;
      font-size: 20rpx;
      color: $palette-text-gray;
      .icon {
        margin-right: 10upx;
      }
      .info-item {
        display: inline-block;
        margin-left: 20upx;
      }
    }
  }
}
.separator {
  height: 20rpx;
  background-color: #eff3f4;
}
</style>
