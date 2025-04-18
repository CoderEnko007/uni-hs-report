<template>
  <div class="container">
    <NavBar :showCapsule="true"></NavBar>
    <div class="panel panel-filter">
      <div class="headline">
        <span class="title">职业套牌</span>
        <div class="time-filter">
          <picker mode="selector" :value="tabList.selectedItem" :range="timePickerList" @change="handleHeadTabClick">
            <span class='selector-item'>{{tabList.list[tabList.selectedItem].text}}</span>
            <span class="iconfont" :style="{'vertical-align': 'middle'}">&#xe668;</span>
          </picker>
        </div>
      </div>
      <div class="faction-filter">
        <HeroesPanel :selected="selectedFaction" :dataList="factionIcons" @itemClick="handleIconsClick"></HeroesPanel>
      </div>
      <div class="panel-block">
        <div class="filter-item" :style="{width: 282+'rpx'}">
          <picker mode="selector" :value="selectedDeckIndex" :range="pickerList" @change="handlePickerChange">
            <span class='selector-item'>{{pickerList[selectedDeckIndex]}}</span>
            <img class="picker-icon" :src="filterIcon" mode="aspectFit">
          </picker>
        </div>
        <div class="filter-item" v-for="(item, index) in genOrderFilter" :key="index" @click="handleOrderChange(item)">
          <div class="order-item">
            <span>{{item.name}}</span>
            <img v-if="decksFilter.order && decksFilter.order === item.id" :src="upOrder" mode="aspectFit">
            <img v-else-if="decksFilter.order === '-'+item.id" :src="downOrder" mode="aspectFit">
            <img v-else :src="normalOrder" mode="aspectFit">
          </div>
        </div>
      </div>
    </div>
    <div class="panel panel-list">
      <DecksBoard :list="deckList" :last_30_days="decksFilter.last_30_days" @itemClick="handleDeckClick"></DecksBoard>
      <load-more v-if="more" :loading='true' />
      <load-more v-else-if="!deckList.length" :nodata='true' />
      <load-more v-else :nomore='true' />
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import utils from '@/utils'
import {getDeckList} from "@/api/dbapi";
import DecksBoard from '@/components/DecksBoard';
import loadMore from '@/components/load-more'
import HeroesPanel from '@/components/HeroesPanel'
import NavBar from '@/components/NavBar'

const defaultFilter = {
  faction: 'Druid',
  archetype: 'all',
  mode: 'Standard',
  last_30_days: false,
  currentSet: null,
  order: '-game_count'
}
const defaultOrder = [
  {id: 'game_count', name: '样本大小'},
  {id: 'dust_cost', name: '合成花费'},
  {id: 'win_rate', name: '总体胜率'},
]
const last30dOrder = [
  {id: 'real_game_count', name: '样本大小'},
  {id: 'dust_cost', name: '合成花费'},
  {id: 'real_win_rate', name: '总体胜率'},
]
export default {
  components: {
    NavBar,
    DecksBoard,
    HeroesPanel,
    loadMore,
  },
  data() {
    return {
      selectedFaction: '',
      factionIcons: null,
      selectedDeckIndex: 0,
      deckPickerList: [],
      decksName: [],
      deckList: [],
      orderFilter: Object.assign({}, defaultOrder),
      decksFilter: Object.assign({}, defaultFilter),
      page: 0,
      more: true,
      normalOrder: '/static/icons-v2/rank-normal.png',
      upOrder: '/static/icons-v2/rank-up.png',
      downOrder: '/static/icons-v2/rank-down.png',
      filterIcon: '/static/icons-v2/filter-active.png',
      tabList: {
        selectedItem: 0,
        list: [
          {text: '当前赛季卡组', last_30_days: false},
          {text: '至少包含一张新卡牌', last_30_days: false, currentSet: -1 },
          {text: '最近30天卡组', last_30_days: true}
        ]
      },
    }
  },
  computed: {
    ...mapGetters([
      'currentSet',
      'navHeight',
    ]),
    pickerList() {
      return this.deckPickerList.map(item => {
        return item.name
      })
    },
    genOrderFilter() {
      if (this.decksFilter.last_30_days) {
        return last30dOrder
      } else {
        return defaultOrder
      }
    },
    timePickerList() {
      return this.tabList.list.map(item => {
        return item.text
      })
    },
  },
  methods: {
    genDeckList(init) {
      if (init) {
        this.page = 0
        this.more = true
      }
      wx.showNavigationBarLoading();
      let order = this.decksFilter.order.replace('-', '')
      if (this.decksFilter.last_30_days) {
        for (let index in defaultOrder) {
          if (defaultOrder.hasOwnProperty(index)) {
            if (defaultOrder[index].id === order) {
              this.decksFilter.order = this.decksFilter.order.replace(order, last30dOrder[index].id)
            }
          }
        }
      } else {
        for (let index in last30dOrder) {
          if (last30dOrder.hasOwnProperty(index)) {
            if (last30dOrder[index].id === order) {
              this.decksFilter.order = this.decksFilter.order.replace(order, defaultOrder[index].id)
            }
          }
        }
      }
      getDeckList(this.decksFilter, 12, this.page, this.decksFilter.order).then(res => {
        if (init) {
          this.deckList = utils.translateDeckName(res.objects, this.$store.state.cards.decksName)
          wx.stopPullDownRefresh();
        } else {
          let temp = utils.translateDeckName(res.objects, this.$store.state.cards.decksName)
          this.deckList = this.deckList.concat(temp)
        }
        this.deckList.map(item => {
          item.win_rate = parseFloat(item.win_rate).toFixed(1)
          item.real_win_rate = parseFloat(item.real_win_rate).toFixed(1)
          item.game_count = utils.toThousands(item.game_count)
          item.real_game_count = utils.toThousands(item.real_game_count)
          return item
        })
        if (this.deckList.length >= res.meta.total_count) {
          this.more = false
        }
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh();
      }).catch(err => {
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh();
        console.log(err)
      })
    },
    genPickerList() {
      this.selectedDeckIndex = 0
      this.deckPickerList = [{id: 'all', name: '全部类型'}]
      let filterDecksName = this.decksName.filter(item => {
        if ((item.mode === this.decksFilter.mode)
          || item.mode==='All') {
          return true
        }
      })
      for (let item of filterDecksName) {
        if (this.selectedFaction) {
          if (item.faction === this.selectedFaction && item.ename !== item.faction) {
            this.deckPickerList.push({id: item.ename, name: item.cname})
          }
        } else {
          if (item.ename !== item.faction) {
            this.deckPickerList.push({id: item.ename, name: item.cname})
          }
        }
      }
      this.deckPickerList.push({id: this.selectedFaction, name: '其他'})
    },
    genFactionIcons() {
      this.factionIcons = []
      for (let key in utils.faction) {
        if (utils.faction.hasOwnProperty(key)) {
          this.factionIcons.push({id: key, name: utils.faction[key].name, image: utils.faction[key].image})
        }
      }
    },
    handleIconsClick(item) {
      if (this.selectedFaction === item.id) {
        this.selectedFaction = ''
      } else {
        this.selectedFaction = item.id
      }
      this.decksFilter.faction = this.selectedFaction
      this.decksFilter.archetype = 'all'
      this.genPickerList()
      this.genDeckList(true)
    },
    handlePickerChange(e) {
      this.selectedDeckIndex = e.mp.detail.value
      this.decksFilter.archetype = this.deckPickerList[this.selectedDeckIndex].id
      this.genDeckList(true)
    },
    handleOrderChange(item) {
      if (this.decksFilter.order.indexOf(item.id)>=0) {
        this.decksFilter.order = this.decksFilter.order.split('')[0]==='-'?item.id:'-'+item.id
      } else {
        this.decksFilter.order = '-'+item.id
      }
      this.genDeckList(true)
    },
    handleDeckClick(item) {
      wx.navigateTo({
        url: `/pages/decks/deckDetail/index?id=${item.id}&mode=${this.decksFilter.mode}`
      })
    },
    handleHeadTabClick(e) {
      this.deckList = []
      this.tabList.selectedItem = e.mp.detail.value
      this.decksFilter.last_30_days = this.tabList.list[this.tabList.selectedItem].last_30_days
      // 处理“至少包含一张新卡牌”的选项
      if (this.tabList.selectedItem == 1) {
        this.decksFilter.currentSet = this.currentSet
      } else {
        this.decksFilter.currentSet = null
      }
      this.genDeckList(true)
    },
  },
  mounted() {
    console.log('mounted')
    if (this.$root.$mp.query.name) {
      this.decksFilter.archetype = this.$root.$mp.query.name
    }
    this.selectedFaction = this.$root.$mp.query.id
    this.decksFilter.faction = this.$root.$mp.query.id
    this.decksName = this.$store.state.cards.decksName
    this.genFactionIcons()
    this.genPickerList()
    for (let index in this.deckPickerList) {
      if (this.deckPickerList.hasOwnProperty(index)) {
        if (this.deckPickerList[index].id === this.decksFilter.archetype) {
          this.selectedDeckIndex = index
        }
      }
    }
    this.genDeckList(true)
  },
  onUnload() {
    console.log('onUnload')
    this.tabList.selectedItem = 0
    this.decksFilter = Object.assign({}, defaultFilter)
    this.selectedFaction = ''
    this.selectedDeckIndex = 0
    this.deckList = []
  },
  onPullDownRefresh() {
    this.genDeckList(true)
  },
  onReachBottom() {
    if (!this.more) return false
    this.page += 1
    this.genDeckList(false)
  },
  onShareAppMessage(res) {
    return {
      title: '炉石传说情报站',
      path: '/pages/index/index'
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../../style/color';
.container {
  width: 100%;
  .head-tab {
    margin: 30rpx 30rpx 18rpx;
  }
  .panel-filter {
    position: fixed;
    width: 100%;
    background-color: white;
    z-index: 1;
    .headline {
      margin: 0 30rpx;
      .time-filter {
        display: inline-block;
        height: 24rpx;
        line-height: 24rpx;
        margin-left:16rpx;
        font-size: 19rpx;
        color: #999;
        border: 1rpx solid #ddd;
        border-radius: 24rpx;
        padding: 3rpx 10rpx;
      }
      .btn-group {
        position: absolute;
        height: 100%;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        display: flex;
        justify-content: space-between;
        flex-wrap: nowrap;
        .btn-block {
          position: relative;
          height: 100%;
          display:flex;
          justify-content:space-between;
          flex-wrap:nowrap;
          .btn-img {
            position: absolute;
            width: 32rpx;
            height: 32rpx;
            top: 50%;
            transform: translateY(-50%);
          }
          button {
            height: 100%;
            line-height: 96rpx;
            margin-left: 40rpx;
            font-size: 28rpx;
            font-weight: normal;
            color: #999;
          }
          .btn-active {
            color: $palette-blue;
            font-weight: bold;
          }
          .separator {
            width: 25rpx;
            height: 32rpx;
            line-height:96rpx;
            text-align: center;
            font-size: 28rpx;
            color: #EEEEEE;
          }
        }
      }
    }
    .faction-filter {
      margin: 0 30rpx 20rpx;
    }
    .panel-block {
      display: flex;
      justify-content: space-between;
      width: 100%;
      height: 86rpx;
      padding: 0 30rpx;
      box-shadow: 0 3px 2px -3px #000;
      box-sizing: border-box;
      .filter-item {
        position: relative;
        height: 100%;
        line-height: 86rpx;
        font-size: 24rpx;
        .picker-icon {
          position:absolute;
          top:50%;
          transform:translateY(-50%);
          width: 25rpx;
          height: 25rpx;
          margin-left: 10rpx;
        }
        .selector-item {
          text-align: center;
          font-size: 26rpx;
          color: $palette-blue;
        }
        .order-item {
          position: relative;
          width: 134rpx;
          text-align: center;
          img {
            position:absolute;
            width: 22rpx;
            height: 36rpx;
            margin-left: 5rpx;
            top:48%;
            transform:translateY(-50%);
          }
        }
        ._picker {
          width: 285rpx;
        }
      }
    }
  }
  .panel-list {
    padding-top: 280rpx;
    z-index: -1;
  }
}
</style>
