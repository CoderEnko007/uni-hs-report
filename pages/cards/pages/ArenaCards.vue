<template>
  <div class="arnea-cards-container">
    <div class="filter">
      <div class="search-bar">
        <SearchBar :search.sync="filter.search" :reset='true' @resetFilter="resetFilter" @handleConfirm="handleSearch" placeholder="请输入卡牌名称"></SearchBar>
      </div>
      <div class="panel-faction">
        <HeroesPanel :dataList="factionIcons" :selected="selectedFaction.id" @itemClick="handleIconsClick"></HeroesPanel>
      </div>
      <CostPanel @itemClick="handleCostClick" ref='costPanel'></CostPanel>
      <div class="list-header">
        <div class="cards-title">
          {{selectedFaction.name?selectedFaction.name:''}}单卡数据
        </div>
        <!--<scroll-view class="order-item" scroll-x="true" :scroll-left="orderScrollLeft">-->
        <div class="order-item">
          <div class="order-block" v-for="(item, index) in listOrder" :key="index" @click="handleOrderChange(item)">
            <span>{{item.name}}</span>
            <img v-if="filter.order && filter.order === item.id" :src="upOrder" mode="aspectFit">
            <img v-else-if="filter.order === '-'+item.id" :src="downOrder" mode="aspectFit">
            <img v-else :src="normalOrder" mode="aspectFit">
          </div>
        </div>
        <!--</scroll-view>-->
      </div>
    </div>
    <div class="cards-list">
      <scroll-view class="scroll-list"
                   scroll-y='true'
                   :style="{height: scrollHeight+'px'}"
                   @scrolltolower="scrollToBottom">
        <div class="cards">
          <div style="width: 302rpx;">
            <DeckCards :cards="cardsList" :ifanrTile="ifanr_arena_card_resource" colNum="1" smallSpacing="false" @cardClick="handleCardClick"></DeckCards>
          </div>
          <div class="data">
            <div class="data-block" v-for="(item, index) in cardsList" :key="index">
              <span>{{item.deck_pop}}%</span>
              <span class="color-green" :class="{'color-red': item.deck_winrate<50}">{{item.deck_winrate}}%</span>
              <!--<span class="color-green" :class="{'color-red': item.played_winrate<50}">{{item.played_winrate}}%</span>-->
              <span>{{item.times_played}}</span>
            </div>
          </div>
        </div>
        <!--<scroll-view class="data" scroll-x="true" @scroll="handleScrollX">-->
            <!--<div class="data-block" v-for="(item, index) in cardsList" :key="index">-->
              <!--<span>{{item.times_played}}</span>-->
              <!--<span>{{item.deck_pop}}%</span>-->
              <!--<span>{{item.deck_winrate}}%</span>-->
              <!--<span>{{item.played_winrate}}%</span>-->
            <!--</div>-->
        <!--</scroll-view>--> 

        <load-more v-if="more" :loading='true' />
        <load-more v-else-if="!cardsList.length" :nodata='true' />
        <load-more v-else :nomore='true' />
      </scroll-view>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import utils from '@/utils'
import { getArenaCards } from "@/api/dbapi";
import HeroesPanel from '@/components/HeroesPanel'
import CostPanel from '@/components/CostPanel'
import loadMore from '@/components/load-more.vue'
import SearchBar from '@/components/SearchBar'
import FilterMenu from '@/components/FilterMenu'
import DeckCards from '@/components/DeckCards'

const defaultFilter = {
  faction: 'ALL',
  cost: null,
  search: null,
  order: '-times_played'
}
export default {
  name: 'ArenaCards',
  components: {
    loadMore,
    SearchBar,
    FilterMenu,
    HeroesPanel,
    CostPanel,
    DeckCards
  },
  data() {
    return {
      costList: [
        {cost: 0, icon: '/static/mana/0.png'},
        {cost: 1, icon: '/static/mana/1.png'},
        {cost: 2, icon: '/static/mana/2.png'},
        {cost: 3, icon: '/static/mana/3.png'},
        {cost: 4, icon: '/static/mana/4.png'},
        {cost: 5, icon: '/static/mana/5.png'},
        {cost: 6, icon: '/static/mana/6.png'},
        {cost: 7, icon: '/static/mana/7+.png'}
      ],
      factionIcons: [],
      selectedFaction: '',
      filter: Object.assign({}, defaultFilter),
      listOrder: [
        {id: 'deck_pop', name: '出现率'},
        {id: 'deck_winrate', name: '卡组胜率'},
        // {id: 'played_winrate', name: '打出胜率'}
        {id: 'times_played', name: '打出次数'},
      ],
      normalOrder: '/static/icons-v2/rank-normal.png',
      upOrder: '/static/icons-v2/rank-up.png',
      downOrder: '/static/icons-v2/rank-down.png',
      orderScrollLeft: 0,
      scrollLeft: 0,

      cardsList: [],
      more: true,
      page: 0,
    }
  },
  computed:{
    ...mapGetters([
      'navHeight',
      'isIphoneX',
      'winWidth',
      'winHeight',
      'arenaTableID',
      'ifanr_arena_card_resource',
      'barHeight'
    ]),
    scrollHeight() {
      const res = wx.getSystemInfoSync()
      const navHeight = uni.upx2px(this.navHeight)+this.barHeight
      const ratio = res.windowWidth/750
      // return res.windowHeight-navHeight-89*ratio-383*ratio
      return res.windowHeight-navHeight-89*ratio-362*ratio
    }
  },
  methods: {
    resetFilter() {
      this.filter = Object.assign({}, defaultFilter)
      this.selectedFaction = ''
      this.$refs.costPanel.clearCost()
      this.genCardsList(true)
    },
    genFactionIcons() {
      this.factionIcons = []
      for (let key in utils.faction) {
        if (utils.faction.hasOwnProperty(key)) {
          this.factionIcons.push({id: key.toUpperCase(), name: utils.faction[key].name, image: utils.faction[key].image})
        }
      }
    },
    genCardsList(init) {
      if (init) {
        this.page = 0
        this.more = true
        this.cardsList = []
      }
      getArenaCards(this.filter, this.arenaTableID, 20, this.page, this.filter.order).then(res => {
        if (init) {
          this.cardsList = res.objects
        } else {
          this.cardsList = this.cardsList.concat(res.objects)
        }
        this.cardsList = this.cardsList.map(val => {
          val.card_hsid = val.hsId
          val.cname = val.name
          val.deck_pop = parseFloat(val.deck_pop).toFixed(1)
          val.deck_winrate = parseFloat(val.deck_winrate).toFixed(1)
          val.played_winrate = parseFloat(val.played_winrate).toFixed(1)
          val.times_played = utils.toThousands(val.times_played)
          return val
        })
        if (this.cardsList.length >= res.meta.total_count) {
          this.more = false
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handleCostClick(item) {
      this.filter.cost = this.filter.cost === item?null:item
      this.genCardsList(true)
    },
    handleIconsClick(item) {
      if (this.selectedFaction === item) {
        this.selectedFaction = ({id: 'ALL'})
      } else {
        this.selectedFaction = item
      }
      this.filter.faction = this.selectedFaction.id
      this.genCardsList(true)
    },
    handleOrderChange(item) {
      if (this.filter.order.indexOf(item.id)>=0) {
        this.filter.order = this.filter.order.split('')[0]==='-'?item.id:'-'+item.id
      } else {
        this.filter.order = '-'+item.id
      }
      this.genCardsList(true)
    },
    handleCardClick(item) {
      wx.navigateTo({
        url: `/pages/cards/cardDetail/index?id=${item.dbfId}`
      })
    },
    handleSearch() {
      this.genCardsList(true)
    },
    scrollToBottom() {
      if (!this.more) return false
      this.page += 1
      this.genCardsList(false)
    },
    handleScrollX(e) {
      this.orderScrollLeft = e.mp.detail.scrollLeft
      // this.scrollLeft = parseInt((e.mp.detail.scrollLeft+45)/95) * 95
    },
  },
  mounted() {
    this.genFactionIcons()
    this.genCardsList(true)
  }
}
</script>
<style lang="scss" scoped>
.filter {
  position: fixed;
  width: 100%;
  background-color: #fff;
  z-index: 2;
  .search-bar {
    padding: 20rpx 30rpx;
  }
}
.panel-faction {
  padding: 0 30rpx 20rpx;
}
.cards-list {
  padding: 360rpx 21rpx 0;
  .scroll-list {
    display: flex;
    flex-wrap: nowrap;
    .cards {
      display:flex;
      justify-content: space-between;
      flex-wrap: nowrap;
      vertical-align: top;
      width: 100%;
      box-sizing:border-box;
      .data {
        display:inline-block;
        vertical-align: top;
        width: 410rpx;
        box-sizing: border-box;
        .data-block {
          width:100%;
          height:58rpx;
          line-height: 58rpx;
          display:flex;
          justify-content:space-around;
          padding-top: 20rpx;
          span {
            display: inline-block;
            width: 136rpx;
            text-align: center;
            font-size: 28rpx;
            font-weight: bold;
            /*color: #333333;*/
          }
        }
      }
    }
  }
}
.list-header {
  display:flex;
  height: 88rpx;
  width: 100%;
  padding: 0 20rpx;
  font-size: 26rpx;
  color: #333333;
  text-align: center;
  line-height: 88rpx;
  box-sizing: border-box;
  border-bottom:1rpx solid #eee;
  border-top: 1rpx solid #eee;
  .cards-title {
    display:inline-block;
    width: 300rpx;
  }
  .order-item {
    display:inline-block;
    width: 410rpx;
    height: 100%;
    overflow: hidden;
    white-space: nowrap;
    .order-block {
      display: inline-block;
      position: relative;
      height: 100%;
      width: 136rpx;
      text-align: center;
      img {
        position:absolute;
        width: 22rpx;
        height: 36rpx;
        top:48%;
        transform:translateY(-50%);
      }
    }
  }
}
</style>
