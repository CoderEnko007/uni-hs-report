<template>
  <div class="container">
    <div class="status-bar" :style="{height:statusBarHeight, opacity:statusBarOpacity}"></div>
    <NavBar :onlyCapsule="true"></NavBar>
    <div class="banner">
      <div class="meta">
        <h1>热门套牌</h1>
        <p class="date">{{updateDate}}</p>
        <p class="desc">最近48小时内热度持续上升的精选套牌</p>
      </div>
    </div>
    <div class="deck-list">
      <DeckList :list="deckList" @itemClick="handleDeckClick"></DeckList>
    </div>
    <!-- <div class="ads" v-if="adsOpenFlag">
      <ad unit-id="adunit-4c3a7a55067c0f6e"></ad>
    </div> -->
    <div class="video-ads" style="margin: 10rpx 30rpx;" v-if="adsOpenFlag && deckList">
      <ad unit-id="adunit-584598492a083dc8" ad-type="video" ad-theme="white"></ad>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import utils from '@/utils'
import {getTrendingList} from "@/api/dbapi";
import DeckList from '@/components/DeckList';
import NavBar from '@/components/NavBar'

export default {
  components: {
    DeckList,
    NavBar,
  },
  data() {
    return {
      deckList: null,
      report_date: '',
      interstitialAd: null,
      scrollTop: 0,
    }
  },
  computed: {
    ...mapGetters([
      'adsOpenFlag',
      'decksName',
      'navHeight',
      'barHeight'
    ]),
    updateDate() {
      if (this.report_date) {
        let formatDate = new Date(this.report_date)
        return formatDate.getMonth()+1 + '月' + formatDate.getDate() + '日更新'
      }
    },
    statusBarHeight() {
      return uni.upx2px(this.navHeight)+this.barHeight+'px'
    },
    statusBarOpacity() {
      let navHeight = uni.upx2px(this.navHeight)+this.barHeight
      let opacity = (this.scrollTop-uni.upx2px(300))/(uni.upx2px(200)-navHeight)
      opacity = opacity<=1?opacity:1
      return opacity
    }
    // adsOpenFlag() {
    //   return utils.adsOpenFlag
    // },
  },
  methods: {
    formatDeckList() {
      for (let item of this.deckList) {
        item.image = utils.faction[item.faction].image
        let temp = this.decksName.filter(val => {
          return val.ename === item.deck_name
        })
        if (temp[0] && temp[0].cname) {
          item.cname = temp[0].cname
        } else {
          item.cname = item.deck_name
        }
        item.win_rate = item.win_rate.toFixed(1)
      }
    },
    genTrendingList() {
      uni.showNavigationBarLoading();
      getTrendingList().then(res => {
        this.deckList = res.list
        this.formatDeckList()
        this.report_date = res.date
        uni.stopPullDownRefresh();
        uni.hideNavigationBarLoading()
      }).catch(err => {
        console.log(err)
        uni.stopPullDownRefresh();
        uni.hideNavigationBarLoading()
      })
    },
    handleDeckClick(item) {
      uni.navigateTo({
        url: `/pages/decks/deckDetail/index?id=${item.id}&trending=1`
      })
    }
  },
  mounted() {
    this.genTrendingList()
    if (this.interstitialAd) {
      this.interstitialAd.show().catch((err) => {
        console.error(err)
      })
    }
  },
  onLoad() {
    if (uni.createInterstitialAd) {
      this.interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-47f9875b7cdea202'
      })
    }
  },
  onPageScroll(e) {
    this.scrollTop = e.scrollTop
  },
  onPullDownRefresh() {
    this.genTrendingList()
  },
  onShareAppMessage(res) {
    return {
      title: '炉石传说情报站',
      path: '/pages/trending/index'
    }
  },
}
</script>
<style lang="scss" scoped>
@import '../../style/color';
.status-bar {
  position: fixed;
  width: 100%;
  z-index: 2;
  opacity: 0;
  background-color: white;
}
.banner {
  position: relative;
  width: 100%;
  height: 500rpx;
  overflow: hidden;
  background: url("https://cloud-minapp-18282.cloud.ifanrusercontent.com/1jbgGJ2LFovO5C11.jpg") no-repeat 0 0;
  background-size: 100%;
  .meta {
    position: relative;
    width: 100%;
    height: 100%;
    padding-top: 180rpx;
    padding-left: 30rpx;
    color: #fff;
    box-sizing:border-box;
    h1 {
      height: 56rpx;
      line-height: 56rpx;
      font-size: 56rpx;
      font-weight: bold;
    }
    p.date {
      height: 44rpx;
      line-height: 44rpx;
      font-size: 26rpx;
      margin-top: 9rpx;
    }
    p.desc {
      position: absolute;
      height: 44rpx;
      right: 30rpx;
      bottom: 30rpx;
      font-size: 26rpx;
    }
  }
}
.deck-list {
  width: 100%;
  box-sizing:border-box;
  overflow: hidden;
  z-index: -1;
}
</style>
