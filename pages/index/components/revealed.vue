<template>
  <div class="container">
    <div class="filter">
      <div class="search-bar">
        <SearchBar :search.sync="filter.search" :reset='true' @resetFilter="resetFilter" @handleConfirm="handleSearch" placeholder="请输入卡牌名称、规则或者属性"></SearchBar>
      </div>
      <CostPanel @itemClick="handleCostClick" ref="costPanel"></CostPanel>
      <div class="filter_tabbar">
        <ul class="filter_tab_list">
          <li v-for="(item, index) in filterTabBar"
              :key="index"
              @click="handleFilterBarClick(item)"
              :class="{active_item: selectedFilterTabItem===item.name}">
            <span class="filter_tab_item">{{filterTabBar[index].selected}}</span>
          </li>
        </ul>
        <div class="filter_item_menu">
          <div class="menu_block" v-show="selectedFilterTabItem!==null">
            <FilterMenu v-for="(filter, index) in filterTabBar"
                        :ref="filter.name"
                        :filter="filter"
                        :key="index"
                        :show="selectedFilterTabItem===filter.name"
                        :colNum="filter.name==='series'?3:2"
                        @filterMenuClick="handleFilterMenuClick"
            ></FilterMenu>
          </div>
        </div>
      </div>
    </div>
    <div class="cards_list">
      <CardList :list="cardsList"
                @cardClick="handleCardClick"
                @scrollToBottom="scrollToBottom"
                :wHeight='85'
                :largeImg='false'
                :noTabBar='true'
                :loading="more"
                :nodata="!more&&!cardsList.length"></CardList>
    </div>
  </div>
</template>

<script>
import utils from '@/utils'
import { mapGetters } from 'vuex'
import { getRevealCardsList } from '@/api/dbapi.js'
import SearchBar from '@/components/SearchBar'
import CostPanel from '@/components/CostPanel'
import FilterMenu from '@/components/FilterMenu'
import loadMore from '@/components/load-more'
import NavBar from '@/components/NavBar'
import CardList from '@/components/CardList'

const defaultFilter = {
  card_detail: true,
  search: null,
  type: null,
  rarity: null,
  collectible: 1
}
  
const defaultFilterList = [
  {name: 'faction', text: '职业', items: [], selected: '职业'},
  {name: 'type', text: '类型', items: [], selected: '类型'},
  {name: 'race', text: '种族', items: [], selected: '种族'},
  {name: 'rarity', text: '稀有度', items: [], selected: '稀有度'},
]

export default {
  name: 'RevealedPage',
  components: {
    NavBar,
    SearchBar,
    CostPanel,
    FilterMenu,
    loadMore,
    CardList
  },
  data() {
    return {
      filter: Object.assign({}, defaultFilter),
      factionIcons: [],
      filterTabBar: utils.deepCopy(defaultFilterList),
      selectedFilterTabItem: null,
      cardsList: [],
      page: 0,
      more: true,
      total_count: 0
    }
  },
  methods: {
    resetFilter() {
      this.filter = Object.assign({}, defaultFilter)
      for (let index in this.filterTabBar) {
        if (this.filterTabBar.hasOwnProperty(index)) {
          this.filterTabBar[index].selected = defaultFilterList[index].selected
          this.$refs[this.filterTabBar[index].name][0].resetFilter()
        }
      }
      this.$refs.costPanel.clearCost()
      this.initCardList(true)
    },
    async initCardList(init) {
      if (init) {
        this.page = 0
        this.more = true
        this.cardsList = []
      }
      let res = await getRevealCardsList(this.filter, 21, this.page, 0, '-reveal_time')
      let list = res.objects.map(item => {
        return {dbfId: item.dbfId, name: item.name, image: item.img_card_link}
      })
      if (init) {
        this.cardsList = list
      } else {
        this.cardsList = this.cardsList.concat(list)
      }
      let emptyNum = this.cardsList.length % 3
      if(emptyNum) {
        for (let i=0; i<(3-emptyNum); i++) {
          this.cardsList.push({})
        }
      }
      this.total_count = res.meta.total_count
      if (this.cardsList.length >= res.meta.total_count) {
        this.more = false
      }
    },
    handleIconsClick(item) {
      if (this.selectedFaction === item.id) {
        this.selectedFaction = ''
      } else {
        this.selectedFaction = item.id
      }
      // this.filter.faction = this.selectedFaction
      this.initCardList(true)
    },
    genFilterMenuItems() {
      let array = []
      for (let key in utils.faction) {
        if (utils.faction.hasOwnProperty(key)) {
          array.push({id: key, name: utils.faction[key].name})
        }
      }
      array.push({id: 'Neutral', name: '中立'})
      array.unshift({id: 'all', name: '全部职业'})
      this.filterTabBar[0].items = array
    
      array = []
      for (let key in utils.type) {
        if (utils.type.hasOwnProperty(key) && key!=='HERO_POWER') {
          array.push({id: key, name: utils.type[key].name})
        }
      }
      array.unshift({id: 'all', name: '全部类型'})
      this.filterTabBar[1].items = array
    
      array = []
      for (let key in utils.race) {
        if (utils.race.hasOwnProperty(key)) {
          array.push({id: key, name: utils.race[key].name})
        }
      }
      array.unshift({id: 'all', name: '全部种族'})
      this.filterTabBar[2].items = array
    
      array = []
      for (let key in utils.rarity) {
        if (utils.rarity.hasOwnProperty(key)) {
          array.push({id: key, name: utils.rarity[key].name})
        }
      }
      array.unshift({id: 'all', name: '全部稀有度'})
      this.filterTabBar[3].items = array
      
      for (let filter of this.filterTabBar) {
        if (filter.items.length % 2) {
          filter.items.push({})
        }
      }
    },
    handleCardClick(item, index) {
      if (!item.dbfId) {
        return
      }
      this.$store.commit('setCardsPageParams', {
        filter: this.filter,
        offset: index,
        counts: this.total_count
      })
      wx.navigateTo({
        url: `/pages/cards/revealCardDetail/index?id=${item.dbfId}`
      })
    },
    handleSearch() {
      this.initCardList(true)
    },
    handleCostClick(item) {
      this.filter.cost = this.filter.cost === item?null:item
      this.initCardList(true)
    },
    handleFilterBarClick(item) {
      this.selectedFilterTabItem = this.selectedFilterTabItem === item.name?null:item.name
    },
    handleFilterMenuClick(filter) {
      this.selectedFilterTabItem = null
      switch(filter.name) {
        case 'faction': this.filter.faction = filter.item; this.filterTabBar[0].selected=filter.item.name; break
        case 'type': this.filter.type = filter.item; this.filterTabBar[1].selected=filter.item.name; break
        case 'race': this.filter.race = filter.item; this.filterTabBar[2].selected=filter.item.name; break
        case 'rarity': this.filter.rarity = filter.item; this.filterTabBar[3].selected=filter.item.name; break
        default: console.log(filter.name+' not found');
      }
      this.initCardList(true)
    },
    scrollToBottom() {
      if (!this.more) return false
      this.page += 1
      this.initCardList(false)
    },
  },
  mounted() {
    this.genFilterMenuItems()
    this.initCardList(true)
  }
}
</script>

<style scoped lang="scss">
.container {
  position: relative;
  width: 100%;
  .filter {
    position: fixed;
    width: 100%;
    background-color: #fff;
    z-index: 2;
    .search-bar {
      padding: 10rpx 30rpx;
    }
  }
  .panel-faction {
    padding: 0 30rpx 20rpx;
  }
  .filter_tabbar {
    position: relative;
    width: 100%;
    .filter_tab_list {
      display: flex;
      justify-content: space-around;
      width: 100%;
      font-size: 24rpx;
      box-shadow: 0 1rpx 10rpx -6rpx #000;
      padding:0 30rpx;
      box-sizing:border-box;
      li {
        width: 20%;
        height: 60rpx;
        text-align: center;
        transition: all 0.3s;
        .filter_tab_item {
          display: inline-block;
          height: 60rpx;
          line-height: 60rpx;
        }
        span {
          width: 100%;
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
        }
      }
      .active_item {
        background-color: #eee;
      }
    }
  }
  .faction-filter {
    padding: 0 30rpx 20rpx;
    box-shadow: 0 1rpx 10rpx -6rpx #000;
  }
  .cards_list {
    position: fixed;
    width: 100%;
    height: 100%;
    padding-top: 220rpx;
  }
}
</style>
