<template>
  <div class="battleground-container">
    <div class="filter">
      <div class="search-bar">
        <SearchBar :search.sync="filter.search" :reset='true' @resetFilter="resetFilter" @handleConfirm="handleSearch" placeholder="请输入卡牌名称、规则或者属性"></SearchBar>
      </div>
      <div class="tier-filter">
        <ul class="cards-tier">
          <li v-for="i in tierList" :key="i.tier">
            <a :class="{'type-icon': true, 'type-icon-active': i.tier===filter.tier}" @click="handleTierClick(i.tier)">
              <img class="tier-num" :src="i.icon" mode="aspectFit">
            </a>
          </li>
        </ul>
      </div>
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
                :loading="more"
                :nodata="!more&&!cardsList.length"></CardList>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import utils from '@/utils'
  import SearchBar from '@/components/SearchBar'
  import FilterMenu from '@/components/FilterMenu'
  import CardList from '@/components/CardList'
  import {getBattlegroundCards} from '@/api/dbapi'
  
  const defaultFilter = {
    search: null,
    hero: null,
    tier: null,
    type: null,
    attack: null,
    health: null,
    keywords: null,
    orderBy: null
  }
  const defaultFilterList = [
    {name: 'hero', text: '卡牌类型', items: [], selected: '卡牌类型'},
    {name: 'type', text: '随从种类', items: [], selected: '随从种类'},
    {name: 'attack', text: '攻击力', items: [], selected: '攻击力'},
    {name: 'health', text: '生命值', items: [], selected: '生命值'},
    {name: 'keywords', text: '关键词', items: [], selected: '关键词'},
    {name: 'orderBy', text: '排序', items: [], selected: '排序'}
  ]
  export default {
    name: 'BattlegroundCards',
    components: {
      SearchBar,
      FilterMenu,
      CardList,
    },
    data() {
      return {
        filter: Object.assign({}, defaultFilter),
        tierList: [
          {tier: 1, icon: '/static/mana/1.png'},
          {tier: 2, icon: '/static/mana/2.png'},
          {tier: 3, icon: '/static/mana/3.png'},
          {tier: 4, icon: '/static/mana/4.png'},
          {tier: 5, icon: '/static/mana/5.png'},
          {tier: 6, icon: '/static/mana/6.png'},
        ],
        filterTabBar: utils.deepCopy(defaultFilterList),
        selectedFilterTabItem: null,
        page: 0,
        more: true,
        cardsList: [],
        total_count: 0
      }
    },
    methods: {
      genFilterMenuItems() {
        this.filterTabBar[0].items = [
          {id: 'all', name: '全部类型'},
          {id: 1, name: '英雄', icon: '/static/battlegroundIcons/bg-hero.png'},
          {id: 0, name: '随从', icon: '/static/battlegroundIcons/bg-card.png'}
        ]
        
        let array = []
        array = utils.battlegroundMinionType
        array.unshift({id: 'all', name: '任意种类'})
        this.filterTabBar[1].items = array
        
        this.filterTabBar[2].items = [
          {id: 'all', name: '任意攻击力'},
          {id: 0, name: '攻击力：0'},
          {id: 1, name: '攻击力：1'},
          {id: 2, name: '攻击力：2'},
          {id: 3, name: '攻击力：3'},
          {id: 4, name: '攻击力：4'},
          {id: 5, name: '攻击力：5'},
          {id: 6, name: '攻击力：6'},
          {id: 7, name: '攻击力：7'},
          {id: 8, name: '攻击力：8'},
          {id: 9, name: '攻击力：9'},
          {id: 10, name: '攻击力：10+'},
        ]
        
        this.filterTabBar[3].items = [
          {id: 'all', name: '任意生命值'},
          {id: 0, name: '生命值：0'},
          {id: 1, name: '生命值：1'},
          {id: 2, name: '生命值：2'},
          {id: 3, name: '生命值：3'},
          {id: 4, name: '生命值：4'},
          {id: 5, name: '生命值：5'},
          {id: 6, name: '生命值：6'},
          {id: 7, name: '生命值：7'},
          {id: 8, name: '生命值：8'},
          {id: 9, name: '生命值：9'},
          {id: 10, name: '生命值：10+'},
        ]
        
        array = utils.battlegroundKeywords
        array.unshift({id: 'all', name: '任意关键词'})
        this.filterTabBar[4].items = array
        
        this.filterTabBar[5].items = [
          {id: 'tier', name: '等级：从低到高'},
          {id: '-tier', name: '等级：从高到低'},
          {id: 'attack', name: '攻击力：从低到高'},
          {id: '-attack', name: '攻击力：从高到低'},
          {id: 'health', name: '生命值：从低到高'},
          {id: '-health', name: '生命值：从高到低'},
        ]
        
        for (let filter of this.filterTabBar) {
          if (filter.items.length % 2) {
            filter.items.push({})
          }
        }
      },
      async genCardsList(init) {
        if (init) {
          this.page = 0
          this.more = true
          this.cardsList = []
        }
        let orderBy = null
        if (this.filter.orderBy) {
          orderBy = this.filter.orderBy.id
        }
        let res = await getBattlegroundCards(this.filter, 21, this.page)
        if (init) {
          this.cardsList = res.objects
        } else {
          this.cardsList = this.cardsList.concat(res.objects)
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
      },
      handleSearch() {
        this.genCardsList(true)
      },
      resetFilter() {
        this.filter = Object.assign({}, defaultFilter)
        for (let index in this.filterTabBar) {
          if (this.filterTabBar.hasOwnProperty(index)) {
            this.filterTabBar[index].selected = defaultFilterList[index].selected
            this.$refs[this.filterTabBar[index].name][0].resetFilter()
          }
        }
        this.genCardsList(true)
      },
      handleTierClick(item) {
        this.filter.tier = this.filter.tier === item?null:item
        this.genCardsList(true)
      },
      handleFilterBarClick(item) {
        this.selectedFilterTabItem = this.selectedFilterTabItem === item.name?null:item.name
      },
      handleFilterMenuClick(filter) {
        this.selectedFilterTabItem = null
        switch(filter.name) {
          case 'hero': this.filter.hero = filter.item; this.filterTabBar[0].selected=filter.item.name; break
          case 'type': this.filter.type = filter.item; this.filterTabBar[1].selected=filter.item.name; break
          case 'attack': this.filter.attack = filter.item; this.filterTabBar[2].selected=filter.item.name; break
          case 'health': this.filter.health = filter.item; this.filterTabBar[3].selected=filter.item.name; break
          case 'keywords': this.filter.keywords = filter.item; this.filterTabBar[4].selected=filter.item.name; break
          case 'orderBy': this.filter.orderBy = filter.item; this.filterTabBar[5].selected=filter.item.name; break
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
        if (!item.hsId) {
          return
        }
        this.$store.commit('setCardsPageParams', {
          filter: this.filter,
          offset: index,
          counts: this.total_count
        })
        wx.navigateTo({
          url: `/pages/cards/battlegroundCardDetail/index?id=${item.hsId}`
        })
      },
      scrollToBottom() {
        if (!this.more) return false
        this.page += 1
        this.genCardsList(false)
      },
      scrollToTop() {
        // this.$store.dispatch('getSeriesData').then(res => {
        //     this.genSeriesList()
        // })
      }
    },
    mounted() {
      this.genFilterMenuItems()
      this.genCardsList(true)
    }
  }
</script>

<style scoped lang="scss">
.battleground-container {
  background: #fff;
}
.filter {
  position: fixed;
  width: 100%;
  background-color: #fff;
  z-index: 2;
  .search-bar {
    padding: 20rpx 30rpx 10rpx;
  }
  .tier-filter {
    position: relative;
    padding: 0 30rpx 10rpx;
    .cards-tier {
      display: flex;
      justify-content: space-around;
      width: 100%;
      li {
        display:flex;
        text-align:center;
        position: relative;
        height: 75rpx;
        line-height: 75rpx;
        a {
          margin: auto;
        }
        .type-icon {
          position: relative;
          width: 54rpx;
          height: 54rpx;
          display: inline-block;
          background: url('../../../static/mana/bg-coin.png') no-repeat;
          background-size: 100% 100%;
        }
        .type-icon-active {
          position: relative;
          width: 54rpx;
          height: 54rpx;
          display: inline-block;
          background: url('../../../static/mana/bg-coin-active.png') no-repeat;
          background-size: 100% 100%;
        }
        .tier-num {
          position: absolute;
          width: 44rpx;
          height: 34rpx;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
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
          width: 95%;
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
</style>
