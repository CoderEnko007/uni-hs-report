<template>
  <scroll-view class="container" scroll-y="true" @scrolltolower='scrollToBottom' :style="{height: scrollHeight}">
    <div class="head-tab">
      <HeadTab :tabList="tabList.list" :selectedItem="tabList.selectedItem" @itemClick="handleHeadTabClick"></HeadTab>
    </div>
    <div class="card-wrap" v-for="(item, index) in cardList" :key='index' @click="handleTimerBlockClick(item)">
      <div class="left">
        <div class="cover">
          <img :src="item.cover" mode="aspectFit">
        </div>
      </div>
      <div class="right">
        <div class="timer-wrap" v-if="!revealed">
          <div class="group hours">
            <p class="counter">{{remainingTime(item).hour}}</p>
            <p class="desc">小时</p>
          </div>
          <div class="group minutes">
            <p class="counter">{{remainingTime(item).minute}}</p>
            <p class="desc">分钟</p>
          </div>
          <div class="group seconds">
            <p class="counter">{{remainingTime(item).second}}</p>
            <p class="desc">秒</p>
          </div>
        </div>
        <div class="timer-reveald" v-else>
          <p>已发布</p>
        </div>
        <div class="bottom">
          <p class="time">{{timerDesc(item)}}</p>
        </div>
      </div>
    </div>
    <load-more v-if="more" :loading='true' />
    <load-more v-else-if="!more&&!cardList.length" :nodata='true' />
    <load-more v-else :nomore='true' />
  </scroll-view>
</template>

<script>
import utils from '@/utils/index.js'
import {mapGetters} from 'vuex'
import { getRevealCardsList } from '@/api/dbapi.js'
import loadMore from '@/components/load-more.vue'
import HeadTab from '@/components/HeadTab.vue'

export default {
  name: 'UnrevealedPage',
  components: {
    loadMore,
    HeadTab
  },
  computed: {
    ...mapGetters([
      'winWidth',
      'winHeight',
      'navHeight',
      'barHeight',
      'tabHeight'
    ]),
    timerDesc() {
      return item => {
        let formatTime = utils.formatTimerTime(new Date(item.reveal_time*1000))
        if (item.reveal_by) {
          return `${item.reveal_by} ：${formatTime}`
        } else {
          return `${formatTime} 发布`
        }
      }
    },
    remainingTime() {
      return item => {
        if (this.timerCounts > 0) {
          let remainingTime = item.reveal_time-this.timerDiff
          let hour = Math.floor(remainingTime/3600)
          let minute = Math.floor(remainingTime%3600/60)
          let second = Math.floor(remainingTime%60)
          return {
            'hour': hour,
            'minute': minute,
            'second': second
          }
        } else {
          return {
            'hour': '-',
            'minute': '-',
            'second': '-'
          } 
        }
        
      }
    },
    scrollHeight() {
      const navHeight = (this.navHeight+this.barHeight*2)/2
      const res = wx.getSystemInfoSync()
      const ratio = res.windowWidth/750
      return res.windowHeight-navHeight-85*ratio+'px'
    }
  },
  data() {
    return {
      cardList: [],
      timerSeconds: 0,
      timer: null,
      timerCounts: 0,
      timerDiff: 0,
      more: true,
      page: 0,
      tabList: {
        selectedItem: 0,
        list: [
          {id: 0, text: '未发布', revealed: false},
          {id: 1, text: '已发布', revealed: true}
        ]
      },
      revealed: false
    }
  },
  methods: {
    async initCardList(init) {
      if (init) {
        this.page = 0
        this.more = true
        this.cardList = []
      }
      let orderBy = this.revealed?'-reveal_time':'reveal_time'
      let res = await getRevealCardsList({
        revealed: this.revealed,
      }, 20, this.page, 0, orderBy)
      if (init) {
        this.cardList = res.objects
      } else {
        this.cardList = this.cardList.concat(res.objects)
      }
      if (this.cardList.length >= res.meta.total_count) {
        this.more = false
      }
    },
    scrollToBottom() {
      if (!this.more) return false
      this.page += 1
      this.initCardList(false)
    },
    handleHeadTabClick(e) {
      if (this.tabList.selectedItem !== e.id) {
        this.tabList.selectedItem = e.id
        this.revealed = e.revealed
        this.initCardList(true)
      }
    },
    handleTimerBlockClick(item) {
      if (item.dbfId) {
        wx.navigateTo({
          url: `/pages/cards/revealCardDetail/index?id=${item.dbfId}`
        })
      } else {
        if (this.revealed) {
          wx.showModal({
            title: '提示',
            content: '暂未录入卡牌信息，请稍后再试',
            showCancel: false,
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '该卡牌还未发布',
            showCancel: false,
          })
        }
      }
    }
  },
  mounted() {
    this.initCardList(true)
    let now = Math.round(new Date().getTime()/1000)
    this.timer = setInterval(() => {
      this.timerCounts += 1
      this.timerDiff = now + this.timerCounts
    }, 1000)
  }
}
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  padding: 0 30rpx;
  .head-tab {
    margin: 20rpx 0;
  }
}
.card-wrap {
  position: relative;
  display: flex;
  justify-content: space-between;
  height: 220rpx;
  width: 680rpx;
  padding: 10rpx;
  box-sizing: border-box;
  box-shadow: 0 3rpx 6rpx rgba(0,0,0,0.16), 0 3rpx 6rpx rgba(0,0,0,0.23);
  margin: 0 auto 20rpx;
  border-radius: 5rpx;
  .left {
    position: relative;
    width: 30%;
    .cover {
      position: absolute;
      width: 175rpx;
      height: 175rpx;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      img {
        width: 100%;
        height: 100%;
        border-radius: 15rpx;
      }
    }
  }
  .right {
    position: relative;
    width: 67%;
    .timer-wrap {
      position: absolute;
      right: 0;
      width: 450rpx;
      height: 100%;
      display: flex;
      justify-content: space-between;
      flex-wrap: nowrap;
      margin-bottom: 10rpx;
      .group {
        width: 140rpx;
        height: 140rpx;
        .counter {
          line-height: 60rpx;
          padding: 8rpx 40rpx;
          text-align: center;
          vertical-align: middle;
          font-size: 40rpx;
          margin-bottom: 10rpx;
          background: rgba(0, 0, 0, .05);
        }
        .desc {
          line-height: 48rpx;
          padding: 5rpx;
          font-size: 25rpx;
          text-align: center;
          background: rgba(0, 0, 0, .05);
        }
      }
      .group+.group {
        margin-left: 10rpx;
      }
    }
    .timer-reveald {
      display: flex;
      height: 140rpx;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, .05);
    }
    .bottom {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 50rpx;
      line-height: 50rpx;
      box-sizing: border-box;
      font-size: 28rpx;
      text-align: right;
    }
  }
}
.card-wrap:first-child {
  margin-top: 20rpx;
}
::-webkit-scrollbar{
  width: 0;
  height: 0;
  color: transparent;
}
</style>
