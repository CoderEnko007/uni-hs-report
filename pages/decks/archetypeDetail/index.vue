<template>
  <div class="container" :style="{'padding-bottom': isIphoneX?120+'rpx':80+'rpx'}">
    <div class="status-bar" :style="{height:statusBarHeight, opacity:statusBarOpacity}">
      <p class="cname">{{genArchetypeName}}</p>
    </div>
    <nav-bar :onlyCapsule="true"></nav-bar>
    <div class="banner">
      <div class="bg-image">
        <img :src="bannerImg" mode='aspectFit' @load="bannerImgLoaded">
      </div>
      <div class="overview" v-show="bImgLoaded">
        <div class="archetype-name">
          <div class="icon">
            <img :src="genFactionIcon" mode="aspectFit">
          </div>
          <div class="name">
            <p class="cname">{{genArchetypeName}}</p>
            <p class="ename">{{archetypeDetail.archetype}}</p>
          </div>
        </div>
        <div class="desc">
          <div class="desc-item">
            <p class="item-name">总胜率</p>
            <p class="item-meta color-light-green" :class="{'color-red': archetypeDetail.real_winrate<50}" v-if="archetypeDetail.real_winrate">{{archetypeDetail.real_winrate}}%</p>
            <p class="item-meta" v-else>N/A</p>
          </div>
          <div class="desc-item">
            <p class="item-name">总对局数</p>
            <p class="item-meta" v-if="archetypeDetail.real_games">{{archetypeDetail.real_games}}</p>
            <p class="item-meta" v-else>N/A</p>
          </div>
          <div class="desc-item">
            <p class="item-name">热度</p>
            <p class="item-meta" v-if="archetypeDetail.popularity">{{archetypeDetail.popularity}}%</p>
            <p class="item-meta" v-else>N/A</p>
          </div>
          <div class="desc-item">
            <p class="item-name">职业占比</p>
            <p class="item-meta" v-if="archetypeDetail.faction_popularity">{{archetypeDetail.faction_popularity}}%</p>
            <p class="item-meta" v-else>N/A</p>
          </div>
        </div>
      </div>
    </div>
    <div class="pop-deck">
      <div class="headline">
        <span class="title">热门套牌</span>
        <div class="more-btn" @click="gotoDecks">
          <span class="name">全部相关套牌</span>
          <span class="iconfont">&#xe600;</span>
        </div>
      </div>
      <div class="board-panel" v-if="popDeck.show || bestDeck.show">
        <div class="board" v-show="popDeck.show">
          <div class="deck-item" @click="handlePopDeckClick">
            <div class="icon">
              <img :src="genFactionIcon" mode="aspectFit">
            </div>
            <div class="tier-desc">
              <div class="desc-left">
                <p class="name">
                  <span>{{popDeck.cname}}</span>
                  <span class="name-meta">对局最多</span>
                </p>
                <p class="desc-meta">对局数 {{popDeck.game_count}}</p>
              </div>
              <div class="desc-right">
                <p class="name">胜率</p>
                <p class="desc-meta" :style="{color: '#000'}">{{popDeck.win_rate}}</p>
              </div>
            </div>
            <span class="iconfont">&#xe600;</span>
          </div>
        </div>
        <div class="board" v-show="bestDeck.show">
          <div class="deck-item" @click="handleBestDeckClick">
            <div class="icon">
              <img :src="genFactionIcon" mode="aspectFit">
            </div>
            <div class="tier-desc">
              <div class="desc-left">
                <p class="name">
                  <span>{{bestDeck.cname}}</span>
                  <span class="name-meta">胜率最高</span>
                </p>
                <p class="desc-meta">对局数 {{bestDeck.game_count}}</p>
              </div>
              <div class="desc-right">
                <p class="name">胜率</p>
                <p class="desc-meta" :style="{color: '#000'}">{{bestDeck.win_rate}}</p>
              </div>
            </div>
            <span class="iconfont">&#xe600;</span>
          </div>
        </div>
      </div>
      <div class="board-panel" v-else-if="!detailLoaded">
        <div class="loading">
          <h1>加载中</h1>
        </div>
      </div>
      <div class="board-panel" v-else>
        <div class="no-data">
          <h1>样本过少，暂无数据</h1>
        </div>
      </div>
    </div>
    <div class="bw-game-panel">
      <div class="headline"><span class="title">优劣对局</span></div>
      <div class="board-panel" v-if="bestMatchup.show || worstMatchup.show">
        <div class="board" v-show="bestMatchup.show">
          <div class="deck-item" @click="handleBestMatchupClick">
            <div class="icon">
              <img :src="bestMatchup.image" mode="aspectFit">
            </div>
            <div class="tier-desc">
              <div class="desc-left">
                <p class="name">
                  <span>{{bestMatchup.cname}}</span>
                  <span class="name-meta">最优势对局</span>
                </p>
                <p class="desc-meta">对局数 {{bestMatchup.game_count}}</p>
              </div>
              <div class="desc-right">
                <p class="name">胜率</p>
                <p class="desc-meta" :class="{'color-green': bestMatchup.win_rate>50, 'color-red': bestMatchup.win_rate<50}">{{bestMatchup.win_rate}}%</p>
              </div>
            </div>
            <span class="iconfont">&#xe600;</span>
          </div>
        </div>
        <div class="board" v-show="worstMatchup.show">
          <div class="deck-item" @click="handleWorstMatchupClick">
            <div class="icon">
              <img :src="worstMatchup.image" mode="aspectFit">
            </div>
            <div class="tier-desc">
              <div class="desc-left">
                <p class="name">
                  <span>{{worstMatchup.cname}}</span>
                  <span class="name-meta">最劣势对局</span>
                </p>
                <p class="desc-meta">对局数 {{worstMatchup.game_count}}</p>
              </div>
              <div class="desc-right">
                <p class="name">胜率</p>
                <p class="desc-meta" :class="{'color-green': worstMatchup.win_rate>50, 'color-red': worstMatchup.win_rate<50}">{{worstMatchup.win_rate}}%</p>
              </div>
            </div>
            <span class="iconfont">&#xe600;</span>
          </div>
        </div>
      </div>
      <div class="board-panel" v-else-if="!detailLoaded">
        <div class="loading">
          <h1>加载中</h1>
        </div>
      </div>
      <div class="board-panel" v-else>
        <div class="no-data">
          <h1>样本过少，暂无数据</h1>
        </div>
      </div>
    </div>
    <!--<div class="separator"></div>-->
    <div class="headline"><span class="title">形态构筑</span></div>
    <div class="panel card-list">
      <div class="core-cards">
        <div class="title"><span>核心组件</span></div>
        <DeckCards :cards="archetypeDetail.core_cards" @cardClick="handleCardClick"></DeckCards>
      </div>
      <div class="pop-cards" v-show="archetypeDetail.pop_cards.length>2">
        <div class="title"><span>热门卡牌</span></div>
        <DeckCards :cards="archetypeDetail.pop_cards" @cardClick="handleCardClick"></DeckCards>
      </div>
    </div>
    <div class="ads" v-if="adsOpenFlag && adsType==='video'">
      <ad unit-id="adunit-482444647f55f355" ad-type="video" ad-theme="white"></ad>
    </div>
    <div class="ads" v-if="adsOpenFlag && adsType!=='video'">
      <ad unit-id="adunit-5507cac6947d0ea4"></ad>
    </div>
    <div class="matchup">
      <div class="headline"><span class="title">对抗情况</span></div>
      <div class="panel">
        <HeroesPanel :dataList="factionIcons" :selected="selectedFaction.id" @itemClick="handleIconsClick"></HeroesPanel>
      </div>
      <div class="panel-block">
        <DeckTable :selectedFaction="selectedFaction" :date="updateDate" :tableTitle="tableTitle" :tableData="selectedFaction.data"
          :tableName="'对阵'+selectedFaction.name" @itemClick="handleDeckItemClick"></DeckTable>
      </div>
    </div>
    <load-more :nomore='true' />
  </div>
</template>
<script>
  import utils from '@/utils'
  import { mapGetters} from 'vuex'
  import { getArchetypeDetail, getSetting } from "@/api/dbapi";
  import DeckCards from '@/components/DeckCards'
  import DeckTable from '@/components/DeckTable'
  import HeroesPanel from '@/components/HeroesPanel'
  import NavBar from '@/components/NavBar'
  import loadMore from '@/components/load-more.vue'

  const defaultDetail = {
    faction: '',
    archetype_name: '',
    game_count: '',
    win_rate: '',
    popularity: '',
    core_cards: [],
    pop_cards: [],
    best_matchup: [],
    worst_matchup: [],
    matchup: []
  }
  const defaultPopDeck = {
    show: false,
    deck_id: '',
    cname: '',
    win_rate: '',
    game_count: ''
  }
  const defaultBestDeck = {
    show: false,
    deck_id: '',
    cname: '',
    win_rate: '',
    game_count: ''
  }
  const defaultBWGame = {
    show: false,
    ename: '',
    cname: '',
    win_rate: '',
    game_count: '',
    image: ''
  }

  export default {
    components: {
      DeckCards,
      DeckTable,
      HeroesPanel,
      NavBar,
      loadMore
    },
    data() {
      return {
        interstitialAd: null,
        archetypeId: '5bc4333d02eed116ab1d4a84',
        archetypeName: '',
        archetypeDetail: Object.assign({}, defaultDetail),
        bannerImg: null,
        factionIcons: [],
        updateDate: null,
        selectedFaction: { id: 'Druid', name: '德鲁伊', data: [] },
        tableTitle: [
          { id: 'games', name: '对局数' },
          { id: 'popularity', name: '对局占比' },
          { id: 'winrate', name: '胜率' },
        ],
        factions: ['Druid', 'Hunter', 'Mage', 'Paladin', 'Priest', 'Rogue', 'Shaman', 'Warlock', 'Warrior', 'DemonHunter', 'DeathKnight'],
        matchupDetail: {
          'Druid': [],
          'Hunter': [],
          'Mage': [],
          'Paladin': [],
          'Priest': [],
          'Rogue': [],
          'Shaman': [],
          'Warlock': [],
          'Warrior': [],
          'DemonHunter': [],
          'DeathKnight': []
        },
        popDeck: Object.assign({}, defaultPopDeck),
        bestDeck: Object.assign({}, defaultBestDeck),
        bestMatchup: Object.assign({}, defaultBWGame),
        worstMatchup: Object.assign({}, defaultBWGame),
        scrollTop: 0,
        bImgLoaded: false
      }
    },
    computed: {
      ...mapGetters([
        'decksName',
        'navHeight',
        'barHeight',
        'archetypeList',
        'insertAdsFlag',
        'adsOpenFlag',
        'ifanrSettings'
      ]),
      detailLoaded() {
        return this.archetypeDetail.archetype !== undefined
      },
      genArchetypeName() {
        return this.getDeckCName(this.archetypeDetail.archetype)
      },
      genFactionIcon() {
        if (this.archetypeDetail.faction) {
          return utils.faction[this.archetypeDetail.faction].image
        }
      },
      adsType() {
        if (this.ifanrSettings && this.ifanrSettings.arch_ads_type) {
          return this.ifanrSettings.arch_ads_type
        } else {
          return 'video'
        }
      },
      statusBarHeight() {
        return uni.upx2px(this.navHeight)+this.barHeight+'px'
      },
      statusBarOpacity() {
        let navHeight = uni.upx2px(this.navHeight)+this.barHeight
        let opacity = (this.scrollTop-uni.upx2px(550))/(uni.upx2px(200)-navHeight)
        opacity = Math.min(Math.max(opacity, 0), 1) 
        return opacity
      }
    },
    methods: {
      bannerImgLoaded() {
        this.bImgLoaded = true
      },
      resetPageData() {
        this.archetypeDetail = Object.assign({}, defaultDetail)
        this.bannerImg = null
        this.selectedFaction = {
          id: 'Druid',
          name: '德鲁伊',
          data: []
        }
        this.matchupDetail = { 
          'Druid': [], 'Hunter': [], 'Mage': [], 'Paladin': [], 'Priest': [], 'Rogue': [],
          'Shaman': [], 'Warlock': [], 'Warrior': [], 'DemonHunter': [], 'DeathKnight': []
        }
        this.popDeck = Object.assign({}, defaultPopDeck)
        this.bestDeck = Object.assign({}, defaultBestDeck)
        this.bestMatchup = Object.assign({}, defaultBWGame),
        this.worstMatchup = Object.assign({}, defaultBWGame)
      },
      getDeckCName(name) {
        for (let item of this.decksName) {
          if (item.ename === name) {
            return item.cname
          }
        }
        return name
      },
      async genArchetypeDetail() {
        wx.showLoading({
          title: '加载中',
          mask: false
        })
        let params = {}
        if (this.archetypeId) {
          params = {
            recordID: this.archetypeId
          }
        } else if (this.archetypeName) {
          params = {
            name: this.archetypeName
          }
        } else {
          wx.hideLoading()
          return
        }
        const res = await getArchetypeDetail(params)
        if (!res) {
          wx.hideLoading()
          wx.showModal({
            title: '提示',
            content: '抱歉，暂无该卡组详情',
            showCancel: false,
            success(res) {
              wx.navigateBack()
            }
          })
        } else {
          this.archetypeDetail = res
          this.archetypeDetail.real_games = utils.toThousands(res.real_games)
          this.updateDate = this.archetypeDetail.update_time
          this.bannerImg = utils.faction[this.archetypeDetail.faction].bgImage.replace('256x', '512x')
          let matchupData = JSON.parse(this.archetypeDetail.matchup)
          for (let index in matchupData) {
            if (matchupData.hasOwnProperty(index)) {
              this.matchupDetail[this.factions[index]] = matchupData[index]
            }
          }
          this.genTableData(this.matchupDetail[this.selectedFaction.id])

          let popDeckData = JSON.parse(this.archetypeDetail.pop_deck)
          if (popDeckData.length > 0) {
            this.popDeck.cname = this.getDeckCName(this.archetypeDetail.archetype)
            this.popDeck.deck_id = popDeckData[0]
            this.popDeck.win_rate = popDeckData[1]
            this.popDeck.game_count = utils.toThousands(popDeckData[2])
            this.popDeck.show = true
          }
          let BestDeckData = JSON.parse(this.archetypeDetail.best_deck)
          if (BestDeckData.length > 0) {
            this.bestDeck.cname = this.getDeckCName(this.archetypeDetail.archetype)
            this.bestDeck.deck_id = BestDeckData[0]
            this.bestDeck.win_rate = BestDeckData[1]
            this.bestDeck.game_count = utils.toThousands(BestDeckData[2])
            this.bestDeck.show = true
          }

          let bestMatchupData = JSON.parse(this.archetypeDetail.best_matchup)
          if (bestMatchupData.length > 0) {
            this.bestMatchup.ename = bestMatchupData[0]
            this.bestMatchup.cname = this.getDeckCName(bestMatchupData[0])
            this.bestMatchup.win_rate = parseFloat(bestMatchupData[1]).toFixed(2)
            this.bestMatchup.game_count = utils.toThousands(bestMatchupData[2])
            if (bestMatchupData.length === 4) {
              var bestMatchupFaction = bestMatchupData[3]
            } else {
              var bestMatchupFaction = bestMatchupData[0].split(' ')
              bestMatchupFaction = bestMatchupData[0] === 'Handlock' ? 'Warlock' : bestMatchupFaction[bestMatchupFaction.length - 1]
              if (bestMatchupFaction.indexOf('Demon Hunter')>0) {
                bestMatchupFaction = 'DemonHunter'
              }
              if (bestMatchupFaction.indexOf('Death Knight')>0) {
                bestMatchupFaction = 'DeathKnight'
              }
            }
            this.bestMatchup.image = utils.faction[bestMatchupFaction].image
            this.bestMatchup.faction = bestMatchupFaction
            this.bestMatchup.show = true
          }

          let worstMatchupData = JSON.parse(this.archetypeDetail.worst_matchup)
          if (worstMatchupData.length > 0) {
            this.worstMatchup.ename = worstMatchupData[0]
            this.worstMatchup.cname = this.getDeckCName(worstMatchupData[0])
            this.worstMatchup.win_rate = parseFloat(worstMatchupData[1]).toFixed(2)
            this.worstMatchup.game_count = utils.toThousands(worstMatchupData[2])
            if (worstMatchupData.length === 4) {
              var worstMatchupFaction = worstMatchupData[3]
            } else {
              var worstMatchupFaction = worstMatchupData[0].split(' ')
              worstMatchupFaction = worstMatchupData[0] === 'Handlock' ? 'Warlock' : worstMatchupFaction[worstMatchupFaction.length - 1]
              if (worstMatchupFaction.indexOf('DemonHunter')>0) {
                worstMatchupFaction = 'DemonHunter'
              }
              if (worstMatchupFaction.indexOf('Death Knight')>0) {
                worstMatchupFaction = 'DeathKnight'
              }
            }
            this.worstMatchup.image = utils.faction[worstMatchupFaction].image
            this.worstMatchup.faction = worstMatchupFaction
            this.worstMatchup.show = true
          }
          wx.hideLoading()
        }
      },
      genFactionIcons() {
        this.factionIcons = []
        for (let key in utils.faction) {
          if (utils.faction.hasOwnProperty(key)) {
            this.factionIcons.push({
              id: key,
              name: utils.faction[key].name,
              image: utils.faction[key].image
            })
          }
        }
      },
      handleCardClick(item) {
        wx.navigateTo({
          url: `/pages/cards/cardDetail/index?id=${item.dbfId}`
        })
      },
      compareFunction(key) {
        return function(obj1, obj2) {
          let formatKey = key.replace('-', '')
          if (key.indexOf('-') !== -1) {
            return obj2[formatKey] - obj1[formatKey]
          } else {
            return obj1[formatKey] - obj2[formatKey]
          }
        }
      },
      genTableData(tableData) {
        let table_array = []
        for (let data of tableData) {
          let name = this.decksName.filter(item => {
            return item.ename === data[0] && item.faction === this.selectedFaction.id
          })[0]
          let formatData = {
            deckName: name ? name.cname : data[0],
            ename: data[0],
            games: parseInt(data[3].replace(',', '')),
            winrate: parseFloat(data[1].replace('%', '')).toFixed(1),
            popularity: parseFloat(data[2].replace('%', ''))
          }
          table_array.push(formatData)
        }
        this.selectedFaction.data = table_array.sort(this.compareFunction('-games'))
      },
      handleIconsClick(item) {
        this.selectedFaction = {
          id: item.id,
          name: item.name,
          data: []
        }
        this.genTableData(this.matchupDetail[item.id])
      },
      handleDeckItemClick(item) {
        wx.navigateTo({
          url: `/pages/decks/archetypeDetail/index?name=${item.ename}`
        })
      },
      handlePopDeckClick() {
        wx.navigateTo({
          url: `/pages/decks/deckDetail/index?deckID=${this.popDeck.deck_id}`
        })
      },
      handleBestDeckClick() {
        wx.navigateTo({
          url: `/pages/decks/deckDetail/index?deckID=${this.bestDeck.deck_id}`
        })
      },
      gotoDecks() {
        wx.navigateTo({
          url: `/pages/decks/decksList/index?id=${this.archetypeDetail.faction}&name=${this.archetypeDetail.archetype}`
        })
      },
      handleWorstMatchupClick() {
        wx.navigateTo({
          url: `/pages/decks/archetypeDetail/index?name=${this.worstMatchup.ename}`
        })
      },
      handleBestMatchupClick() {
        wx.navigateTo({
          url: `/pages/decks/archetypeDetail/index?name=${this.bestMatchup.ename}`
        })
      },
      async getIfanrSettings() {
        if (this.adsOpenFlag) {
          if (wx.createInterstitialAd) {
            this.interstitialAd = wx.createInterstitialAd({
              adUnitId: 'adunit-6f9a474b5991f367'
            })
            this.interstitialAd.onLoad(() => {})
            this.interstitialAd.onError((err) => {})
            this.interstitialAd.onClose(() => {
                this.$store.dispatch('resetInsertAdsFlag')
            })
          }
        }
      }
    },
    async mounted() {
      this.archetypeId = this.$root.$mp.query.id
      // this.archetypeName = 'Spell Druid'
      this.archetypeName = this.$root.$mp.query.name
      await Promise.all([
        this.genFactionIcons(),
        this.genArchetypeDetail()
      ])
      if (this.insertAdsFlag && this.interstitialAd) {
        this.interstitialAd.show().catch((err) => {
          console.error(err)
        })
      }
    },
    onLoad() {
      this.getIfanrSettings()
    },
    onPageScroll(e) {
      this.scrollTop = e.scrollTop
    },
    onShareAppMessage(res) {
      return {
        title: this.genArchetypeName,
        path: `/pages/decks/archetypeDetail/index?name=${this.archetypeName}`
      }
    },
    onPullDownRefresh() {
      this.genArchetypeDetail()
    }
  }
</script>
<style lang="scss" scoped>
@import '../../../style/color';
@import '../../../style/common';
.container {
  width: 100%;
  .status-bar {
    position: fixed;
    width: 100%;
    z-index: 3;
    opacity: 0;
    background-color: white;
    .cname {
      position: absolute; 
      width: 40%;
      top: 62%;
      left: 50%; 
      transform: translate(-50%, -50%); 
      color: #333;
      text-align: center;
      font-size: 36rpx;
      font-weight: bold;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .banner {
    position: relative;
    width: 100%;
    height: 750rpx;
    overflow: hidden;
    background-size: 100%;
    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, .35));
      z-index: 1;
    }
    .bg-image {
      position: absolute;
      width: 100%;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .overview {
      width: 100%;
      padding: 289rpx 0 40rpx;
      box-sizing: border-box;
      .archetype-name {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        z-index: 2;
        .icon {
          width: 88rpx;
          img {
            width: 88rpx;
            height: 88rpx;
            border: 4rpx solid #a79179;
            border-radius: 100%;
          }
        }
        .name {
          height: 100%;
          margin-top: 23rpx;
          color: #fff;
          text-align: center;
          .cname {
            height: 44rpx;
            line-height: 44rpx;
            font-size: 44rpx;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .ename {
            height: 44rpx;
            line-height: 44rpx;
            margin-top: 13rpx;
            font-size: 24rpx;
          }
        }
      }
      .desc {
        display: flex;
        justify-content: space-between;
        flex-wrap: nowrap;
        padding: 0 30rpx;
        margin-top: 74rpx;
        box-sizing: border-box;
        .desc-item {
          position: relative;
          width: 172rpx;
          height: 130rpx;
          color: white;
          text-align: center;
          z-index: 2;
          .item-name {
            margin-top: 21rpx;
            font-size: 26rpx;
          }
          .item-meta {
            margin-top: 7rpx;
            font-weight: bold;
            font-size: 32rpx;
          }
        }
      }
    }
  }
  .pop-deck, .board-panel {
    .no-data, .loading {
      padding: 0 30rpx;
      font-size: 26rpx;
      color: #999;
      height: 80rpx;
      text-align: center;
      line-height: 80rpx;
      box-sizing: border-box;
    }
    .tier-desc {
      border-bottom: 1rpx solid #eee;
      box-sizing: border-box;
    }
  }
  .bw-game-panel, .pop-deck {
    .board-panel {
      margin-bottom: 10rpx;
      .board {
        .deck-item .tier-desc .desc-left .name {
          display: flex;
          align-items: center;
          .name-meta {
            height: 24rpx;
            line-height: 24rpx;
            margin-left: 16rpx;
            font-size: 19rpx;
            color: #666;
            border: 1rpx solid #ddd;
            border-radius: 24rpx;
            padding: 3rpx 10rpx;
          }
        }
      }
    }
  }
  .card-list {
    margin-bottom: 40rpx !important;
    .core-cards, .pop-cards {
      .title {
        position: relative;
        height: 33rpx;
        line-height: 33rpx;
        margin-bottom: 20rpx;
        font-size: 24rpx;
        color: #999;
        text-align: center;
        &:after, &:before {
          position: absolute;
          top: 50%;
          background: #ddd;
          content: "";
          height: 2rpx;
          width: 64rpx
        }
        &:before {
          left: 420rpx;
        }
        &:after {
          right: 420rpx;
        }
      }
    }
    .pop-cards {
      margin-top: 30rpx;
    }
  }
  .headline {
    margin: 0 30rpx;
    .more-btn {
      position: relative;
      float: right;
      height: 100%;
      line-height: 96rpx;
      font-weight: normal;
      .name {
        margin-right: 10rpx;
        color: $palette-blue;
        font-size: 26rpx;
      }
      .iconfont {
        color: $palette-blue;
      }
    }
  }
  .panel {
    margin: 0 30rpx;
  }
  .separator {
    width: 100%;
    box-sizing: border-box;
    border-bottom: 1rpx solid #eee;
    margin: 20rpx 0;
  }
  .deck-item {
    padding: 0 30rpx;
    box-sizing: border-box;
    background-color: #fff;
    &:active {
      background-color: #eee;
    }
    .iconfont {
      right: 30rpx
    }
  }
  .banner-ads {
    margin: 20rpx 30rpx 0;
  }
}
</style>
