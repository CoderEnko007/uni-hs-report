<template>
  <div class="single-card-container">
    <div class="filter">
      <div class="search-bar">
        <SearchBar :search.sync="filter.search" :reset='true' @resetFilter="resetFilter" @handleConfirm="handleSearch" placeholder="请输入卡牌名称、规则或者属性"></SearchBar>
      </div>
      <CostPanel @itemClick="handleCostClick" ref='costPanel'></CostPanel>
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
    <div v-show="selectedFilterTabItem!==null" :class="{mask: true, gray_bgc: selectedFilterTabItem!==null}" @click="handleMaskClick"></div>
    <div class="cards_list">
      <CardList :list="cardsList"
                @cardClick="handleCardClick"
                @scrollToBottom="scrollToBottom"
                @scrollToTop="scrollToTop"
                :largeImg='true'
                :loading="more"
                :nodata="!more&&!cardsList.length"></CardList>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import { getCardPicture } from "@/utils";
  import utils from '@/utils'
  import HeroesPanel from '@/components/HeroesPanel'
  import CostPanel from '@/components/CostPanel'
  import SearchBar from '@/components/SearchBar'
  import FilterMenu from '@/components/FilterMenu'
  import CardList from '@/components/CardList'
  import {getSeriesData, getCardsList, genCardsImageURL} from "@/api/dbapi";

  const defaultFilter = {
    search: null,
    cost: null,
    faction: null,
    mode: null,
    type: null,
    rarity: null,
    series: null,
  }
  const defaultFilterList = [
    {name: 'faction', text: '职业', items: [], selected: '职业'},
    {name: 'mode', text: '游戏模式', items: [], selected: '游戏模式'},
    {name: 'type', text: '类型', items: [], selected: '类型'},
    {name: 'race', text: '种族', items: [], selected: '种族'},
    {name: 'rarity', text: '稀有度', items: [], selected: '稀有度'},
    {name: 'series', text: '扩展包', items: [], selected: '扩展包'}
  ]
  export default {
    name: 'SingleCards',
    components: {
      SearchBar,
      HeroesPanel,
      CostPanel,
      FilterMenu,
      CardList,
    },
    computed: {
      ...mapGetters([
        'fbiVersion',
        'fbiKey',
        'fbiFlag',
        'card_resource',
        'series'
      ]),
    },
    data() {
      return {
        filter: Object.assign({}, defaultFilter),
        selectedFaction: '',
        factionIcons: [],
        filterTabBar: utils.deepCopy(defaultFilterList),
        selectedFilterTabItem: null,
        page: 0,
        more: true,
        cardsList: [],
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
        this.genCardsList(true)
      },
      genFactionIcons() {
        this.factionIcons = []
        for (let key in utils.faction) {
          if (utils.faction.hasOwnProperty(key)) {
            this.factionIcons.push({id: key, name: utils.faction[key].name, image: utils.faction[key].image})
          }
        }
      },
      genSeriesList() {
        this.series.unshift({id: 'all', name: '全部扩展包', mode: 'all'})
        let emptyNum = this.series.length % 3
        if(emptyNum) {
          for (let i=0; i<(3-emptyNum); i++) {
            this.series.push({})
          }
        }
        this.filterTabBar[5].items = this.series
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

        array = utils.mode
        array.unshift({id: 'all', name: '全部模式'})
        this.filterTabBar[1].items = utils.mode

        array = []
        for (let key in utils.type) {
          if (utils.type.hasOwnProperty(key) && key!=='HERO_POWER') {
            array.push({id: key, name: utils.type[key].name})
          }
        }
        array.unshift({id: 'all', name: '全部类型'})
        this.filterTabBar[2].items = array

        array = []
        for (let key in utils.race) {
          if (utils.race.hasOwnProperty(key)) {
            array.push({id: key, name: utils.race[key].name})
          }
        }
        array.unshift({id: 'all', name: '全部种族'})
        this.filterTabBar[3].items = array

        array = []
        for (let key in utils.rarity) {
          if (utils.rarity.hasOwnProperty(key)) {
            array.push({id: key, name: utils.rarity[key].name})
          }
        }
        array.unshift({id: 'all', name: '全部稀有度'})
        this.filterTabBar[4].items = array

        for (let filter of this.filterTabBar) {
          if (filter.name !== 'series' && filter.items.length % 2) {
            filter.items.push({})
          }
        }
      },
      handleIconsClick(item) {
        if (this.selectedFaction === item) {
          this.selectedFaction = ({id: 'ALL'})
        } else {
          this.selectedFaction = item
        }
        this.filter.faction = this.selectedFaction
        this.genCardsList(true)
      },
      handleFilterBarClick(item) {
        this.selectedFilterTabItem = this.selectedFilterTabItem === item.name?null:item.name
      },
      handleCostClick(item) {
        this.filter.cost = this.filter.cost === item?null:item
        this.genCardsList(true)
      },
      handleSearch() {
        this.genCardsList(true)
      },
      handleFilterMenuClick(filter) {
        this.selectedFilterTabItem = null
        switch(filter.name) {
          case 'faction': this.filter.faction = filter.item; this.filterTabBar[0].selected=filter.item.name; break
          case 'mode': this.filter.mode = filter.item; this.filterTabBar[1].selected=filter.item.name; break
          case 'type': this.filter.type = filter.item; this.filterTabBar[2].selected=filter.item.name; break
          case 'race': this.filter.race = filter.item; this.filterTabBar[3].selected=filter.item.name; break
          case 'rarity': this.filter.rarity = filter.item; this.filterTabBar[4].selected=filter.item.name; break
          case 'series': this.filter.series = filter.item; this.filterTabBar[5].selected=filter.item.name; break
          default: console.log(filter.name+' not found');
        }
        this.genCardsList(true)
      },
      handleMaskClick() {
        this.selectedFilterTabItem = null
      },
      handleCardClick(item, index) {
        // 如果过滤器菜单打开则关闭
        if (this.selectedFilterTabItem!==null) {
          this.selectedFilterTabItem = null
          return
        }
        if (!item.dbfId) {
          return
        }
        this.$store.commit('setCardsPageParams', {
          filter: this.filter,
          offset: index,
          counts: this.total_count
        })
        wx.navigateTo({
          url: `/pages/cards/cardDetail/index?id=${item.dbfId}`
        })
      },
      genCardImage(hsId) {
        return getCardPicture(this, hsId, false, this.fbiFlag, this.fbiVersion, this.fbiKey)
      },
      genCardsList(init) {
        if (init) {
          this.page = 0
          this.more = true
          this.cardsList = []
        }
        wx.showNavigationBarLoading();
        getCardsList(this.filter, 21, this.page).then(res => {
          let list = res.objects.map(item => {
            // let image = utils.genCardsImageURL(item.hsId)
            // let image = item.img_card_link
            let image = ''
            if (item.use_backup_img === true || this.card_resource === 'cn') {
              if (item.img_card_link!=null && item.img_card_link.length>0){
                image = item.img_card_link
              } else{
                image = utils.genCardsImageURL(item.hsId)
              }
            } else if (this.card_resource === 'fbi') {
              image = this.genCardImage(item.hsId)
            } else if (this.card_resource === 'hsreplay') {
              image = utils.genCardsImageURL(item.hsId)
            } else {
              image = utils.genCardsImageURL(item.hsId)
            }
            return {dbfId: item.dbfId, name: item.name, image: image}
          })
          if (init) {
            this.cardsList = list
            wx.stopPullDownRefresh();
          } else {
            this.cardsList = this.cardsList.concat(list)
          }
          let emptyNum = this.cardsList.length % 3
          if(emptyNum) {
            for (let i=0; i<(3-emptyNum); i++) {
              this.cardsList.push({})
            }
          }
          if (this.cardsList.length >= res.meta.total_count) {
            this.more = false
          }
          this.total_count = res.meta.total_count
          wx.hideNavigationBarLoading()
          wx.stopPullDownRefresh();
        }).catch(err => {
          console.log(err)
          wx.hideNavigationBarLoading()
          wx.stopPullDownRefresh();
        })
      },
      scrollToBottom() {
        if (!this.more) return false
        this.page += 1
        this.genCardsList(false)
      },
      scrollToTop() {
        this.$store.dispatch('getSeriesData').then(res => {
            this.genSeriesList()
        })
      }
    },
    mounted() {
      this.genSeriesList()
      // this.genFactionIcons()
      this.genFilterMenuItems()
      this.genCardsList(true)
    },
    // onReachBottom() {
    //   if (!this.more) return false
    //   this.page += 1
    //   this.genCardsList(false)
    // },
    // onPullDownRefresh() {
    //   this.obtainSeriesList()
    //   this.genCardsList(true)
    // },
    onShareAppMessage(res) {
      return {
        title: '炉石传说情报站',
        path: '/pages/index/index'
      }
    }
  }
</script>
<style lang="scss" scoped>
  .single-card-container {
    background-color: #fff;
  }
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
		overflow: hidden;
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
  .cards_list {
    position: fixed;
    width: 100%;
    height: 100%;
    padding-top: 232rpx;
  }
  .mask {
    position:fixed;
    left: 0;
    top:0;
    width:100%;
    height: 100%;
    transition: all .2s;
    z-index: 1;
  }
  .gray_bgc {
    background-color: rgba(0, 0, 0, 0.3);
  }

  .filter_item_menu {
    overflow: hidden;
    .menu_block {
      position: absolute;
      width: 100%;
      z-index: 2;
    }
  }
</style>
