<template>
  <div class="card-detail">
    <nav-bar :showCapsule="true" navTitle="单卡详情"></nav-bar>
    <div class="header" @click="previewCard">
      <img :src="cardDetail.cardImg" class="card-img" mode="aspectFit" @load="imageLoad">
      <div class="rank-board" v-show="!imageLoaded">
        <SpinKit :mode="'sk-spinner-pulse'"></SpinKit>
      </div>
    </div>
    <div class="detail">
      <p v-show="cardDetail.name" class="name" @click="handleCopyBtn(cardDetail.name)">{{cardDetail.name}}<span class="headline-meta">点击复制</span></p>
      <p v-show="cardDetail.ename" class="normal" @click="handleCopyBtn(cardDetail.ename)"><span class="f3">英文名</span>：{{cardDetail.ename}}</p>
      <p v-show="cardDetail.series" class="normal"><span class="f4">所属系列</span>：{{cardDetail.series}}</p>
      <p v-show="cardDetail.type" class="normal"><span class="f2">类型</span>：{{cardDetail.type}}</p>
      <p v-if="cardDetail.howToEarn" class="normal how-to-earn">
        <span class="label">获取方式：</span>
        <span class="content" v-html='cardDetail.howToEarn'></span>
      </p>
      <p v-if="cardDetail.howToEarnGolden" class="normal how-to-earn">
        <span class="label">获取方式(金卡)：</span>
        <span class="content" v-html='cardDetail.howToEarnGolden'></span>
      </p>
      <div v-show="show_card_desc">
        <p v-show="cardDetail.flavor" class="flavor" @click="handleCopyBtn(cardDetail.flavor)">{{cardDetail.flavor}}</p>
        <p v-show="cardDetail.eflavor" class="flavor" @click="handleCopyBtn(cardDetail.eflavor)">{{cardDetail.eflavor}}</p>
      </div>
    </div>
    <div class="audio-list">
      <div v-show="showEnAudio">
        <div class="title">英文音效</div>
        <div class="en-audio">
            <div class="audio-item" v-for="(item, index) in getEnAudio" :key="index" @click="handleAudioPlay(item)">
              <div class="play-img" :class="{'audio-play': selectedAudio === item.src}"></div>
              <span v-if="index>0">{{item.cname}}</span>
              <span v-else>{{item.cname}}</span>
            </div>
        </div>
      </div>
      <div v-show="showZhAudio">
        <div class="title">中文音效</div>
        <div class="zh-audio">
            <div class="audio-item" v-for="(item, index) in getZhAudio" :key="index" @click="handleAudioPlay(item)">
              <div class="play-img" :class="{'audio-play': selectedAudio === item.src}"></div>
              <span v-if="index>0">{{item.cname}}</span>
              <span v-else>{{item.cname}}</span>
            </div>
        </div>
      </div>
    </div>
    <div class="entourage-block" v-if="genEntourage.length>0">
      <div class="headline"><span class="title">衍生卡</span></div>
      <div class="card-list">
        <div class="card" v-for="(item, index) in genEntourage" :key="index" @click="handleEntourageClick(item.hsId, index)">
          <img :src="item.image" mode="aspectFit">
        </div>
      </div>
    </div>
    <div class="ads" v-if="adsOpenFlag && cardDetail.name && adsType==='video'">
      <ad unit-id="adunit-3f4b7b57a1b47647" ad-type="video" ad-theme="white"></ad>
    </div>
	<div class="ads" v-if="adsOpenFlag && cardDetail.name && adsType!=='video'">
	  <ad unit-id="adunit-5507cac6947d0ea4"></ad>
	</div>
    <div class="deck-list" v-show="cardDetail.collectible">
      <div class="headline">
        <span class="title">相关套牌</span>
        <div class="filter-picker">
          <picker mode="selector" :value="rangePicker.selectedItem" :range="rangePickerList" @change="handleRankRangeChange">
            <span class='selector-item'>{{rangePicker.list[rangePicker.selectedItem].text}}</span>
            <span class="iconfont" :style="{'vertical-align': 'middle'}">&#xe668;</span>
          </picker>
        </div>
      </div>
      <div style="margin: 0 30rpx;" v-if="cardDetail.cardClass==='Neutral'">
        <HeroesPanel :dataList="factionIcons" :selected="selectedFaction" @itemClick="handleIconsClick"></HeroesPanel>
      </div>
      <div class="panel-block">
        <div class="filter-item">
          <div class="table-td table-name"><span>{{factionName}}</span></div>
        </div>
        <div class="filter-item" v-for="(item, index) in filterOrder" :key="index" @click="handleOrderChange(item)">
          <div class="order-item">
            <span>{{item.name}}</span>
            <img v-if="deckListOrder && deckListOrder === item.id" :src="upOrder" mode="aspectFit">
            <img v-else-if="deckListOrder === '-'+item.id" :src="downOrder" mode="aspectFit">
            <img v-else :src="normalOrder" mode="aspectFit">
          </div>
        </div>
      </div>
      <div class="panel panel-list" v-if="deckList">
        <div v-if="pageDeck.length>0">
          <DecksBoard :list="pageDeck" @itemClick="handleDeckClick"></DecksBoard>
          <div style="margin: 10px 0;">
            <uni-pagination show-icon="false" :total="filterdDeckCounts" :current="currentPage" :pageSize="countsPerPage" @change="handlePageChange">
            </uni-pagination>
          </div>
        </div>
        <div class="no-deck" v-else>
          <p>未找到相应套牌</p>
        </div>
      </div>
      <div class="loading" v-else>
        <SpinKit :mode="'sk-spinner-pulse'"></SpinKit>
      </div>
    </div>
    <div :style="{'height': isIphoneX?130+'rpx':90+'rpx'}"></div>
    <div class="footer">
      <preNextBtnGroup @previousClick="handlePrevious" @nextClick="handleNext" :prevBtnEnable="prevBtnEnable" :nextBtnEnable="nextBtnEnable"></preNextBtnGroup>
    </div>
    <!-- <div class="float-btn" v-show="imageLoaded" :style="{'top': isIphoneX?navHeight+barHeight+70+'rpx':navHeight+barHeight+50+'rpx'}">
      <floatBtnGroup showShare="true"></floatBtnGroup>
    </div> -->
  </div>
</template>
<script>
import { getCardPicture } from "@/utils";
import { mapGetters } from 'vuex'
import utils from '@/utils'
import {genOrigImageURL, genCardsImageURL, gen512CardsImageURL} from '@/utils'
import {getCardDetail, getCardsList, getDeckList, getSeriesData} from "@/api/dbapi";
import FooterMenu from '@/components/FooterMenu'
import floatBtnGroup from '@/components/floatBtnGroup'
import NavBar from '@/components/NavBar'
import SpinKit from '@/components/SpinKit'
import DecksBoard from '@/components/DecksBoard'
import uniPagination from "@/components/uni-pagination/uni-pagination"
import HeroesPanel from '@/components/HeroesPanel'
import preNextBtnGroup from '@/components/preNextBtnGroup'

const heroes = {
  Druid: {name: '德鲁伊', image: '/static/heroIcons/druid.png'},
  Hunter: {name: '猎人', image: '/static/heroIcons/hunter.png'},
  Mage: {name: '法师', image: '/static/heroIcons/mage.png'},
  Paladin: {name: '圣骑士', image: '/static/heroIcons/paladin.png'},
  Priest: {name: '牧师', image: '/static/heroIcons/priest.png'},
  Rogue: {name: '潜行者', image: '/static/heroIcons/rogue.png'},
  Shaman: {name: '萨满', image: '/static/heroIcons/shaman.png'},
  Warlock: {name: '术士', image: '/static/heroIcons/warlock.png'},
  Warrior: {name: '战士', image: '/static/heroIcons/warrior.png'},
  DemonHunter: {name: '恶魔猎手', image: '/static/heroIcons/demonhunter.png'},
  DeathKnight: {name: '死亡骑士', image: '/static/heroIcons/deathknight.png'},
  Neutral: {name: '中立', image: ''}
}
const defaultCardDetail = {
  name: '',
  ename: '',
  series: '',
  flavor: '',
  type: '',
  bgImg: null,
  cardImg: null,
  heroIcon: null,
}
export default {
  components: {
    FooterMenu,
    floatBtnGroup,
    NavBar,
    SpinKit,
    DecksBoard,
    uniPagination,
    HeroesPanel,
    preNextBtnGroup
  },
  data() {
    return {
      interstitialAd: null,
      cardId: null,
      cardHsId: null,
      cardDetail: Object.assign({}, defaultCardDetail),
      myAudio: null,
      showEnAudio: false,
      showZhAudio: false,
      selectedAudio: '',
      audioPlaying: false,
      imageLoaded: false,
      entourageList: null,
      deckListMode: 'Standard',
      deckList: null,
      countsPerPage: 6,
      totalDecks: 0,
      currentPage: 1,
      rangePicker: {
        selectedItem: 0,
        list: [{
            text: '标准模式',
            mode: 'Standard'
          },
          {
            text: '狂野模式',
            mode: 'Wild'
          },
          {
            text: '幻变模式',
            mode: 'Twist'
          }
        ]
      },
      factionIcons: null,
      selectedFaction: '',
      filterOrder: [{
          id: 'game_count',
          name: '对局数'
        },
        {
          id: 'dust_cost',
          name: '合成花费'
        },
        {
          id: 'win_rate',
          name: '胜率'
        },
      ],
      deckListOrder: '-game_count',
      normalOrder: '/static/icons-v2/rank-normal.png',
      upOrder: '/static/icons-v2/rank-up.png',
      downOrder: '/static/icons-v2/rank-down.png',
      standardSetList: []
    }
  },
  computed: {
    ...mapGetters([
      'navHeight',
      'barHeight',
      'fbiVersion',
      'fbiKey',
      'fbiFlag',
      'card_resource',
      'cardsPageParams',
      'entourageParams',
      'isIphoneX',
      'decksName',
      'cardsInsertAdsFlag',
      'adsOpenFlag',
      'ifanrSettings',
      'show_card_desc'
    ]),
    adsType() {
      console.log( this.ifanrSettings.card_ads_type)
      if (this.ifanrSettings && this.ifanrSettings.card_ads_type) {
        return this.ifanrSettings.card_ads_type
      } else {
        return 'video'
      }
    },
    getEnAudio() {
      if (this.cardDetail.audios) {
        return this.cardDetail.audios.filter(item => {
          return item.type === 'en'
        })
      }
    },
    getZhAudio() {
      if (this.cardDetail.audios) {
        return this.cardDetail.audios.filter(item => {
          return item.type === 'zh'
        })
      }
    },
    genEntourage() {
      if (this.cardDetail.entourage) {
        let formatData = this.cardDetail.entourage.map(v => {
          let hsId = v.replace(/\'/g, '').replace(/"/g, '').replace('[', '').replace(']', '').trim()
          let cardImg = ''
          if (this.card_resource === 'fbi') {
            cardImg = this.genCardImage(hsId)
          } else if (this.card_resource === 'hsreplay') {
            cardImg = utils.genCardsImageURL(hsId)
          } else {
            cardImg = utils.genCardsImageURL(hsId)
          }
          return {
            hsId: hsId,
            image: cardImg
          }
        })
        let emptyNum = formatData.length % 3
        if(emptyNum) {
          for (let i=0; i<(3-emptyNum); i++) {
            formatData.push({})
          }
        }
        // this.entourageList = formatData
        return formatData
      } else {
        return []
      }
    },
    prevBtnEnable() {
      if (this.cardDetail.collectible) {
        return this.cardsPageParams.offset>0
      } else {
        return this.entourageParams.index>0
      }
    },
    nextBtnEnable() {
      if (this.cardDetail.collectible) {
        return this.cardsPageParams.offset<this.cardsPageParams.counts-1
      } else {
        return this.entourageParams.index<this.entourageParams.counts-1
      }
    },
    pageCount() {
      return Math.ceil(this.totalDecks/this.countsPerPage)
    },
    pageDeck() {
      if (this.deckList) {
        let filterdDeckList = this.deckList.filter(v => {
          if (this.selectedFaction !== '') {
            return v.faction === this.selectedFaction
          } else {
            return true
          }
        })
        filterdDeckList.sort(this.compareFunction(this.deckListOrder))
        return filterdDeckList.slice((this.currentPage-1)*this.countsPerPage, this.countsPerPage*this.currentPage)
      } else {
        return []
      }
    },
    filterdDeckCounts() {
      if (this.deckList) {
        let filterdDeckList = this.deckList.filter(v => {
          if (this.selectedFaction !== '') {
            return v.faction === this.selectedFaction
          } else {
            return true
          }
        })
        return filterdDeckList.length
      } else {
        return 0
      }
    },
    rangePickerList() {
      return this.rangePicker.list.map(item => {
        return item.text
      })
    },
    factionName() {
      if (this.selectedFaction) {
        return this.selectedFaction?utils.faction[this.selectedFaction].name:''
      } else {
        return '全职业'
      }
    }
  },
  methods: {
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
    imageLoad(e) {
      this.imageLoaded = true
    },
    genCardImage(hsId) {
      return getCardPicture(this, hsId, false, this.fbiFlag, this.fbiVersion, this.fbiKey)
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
    formatCardDetail(detail) {
      this.cardDetail = detail
      this.cardDetail.bgImg = genOrigImageURL(this.cardDetail.hsId)
      // this.cardDetail.cardImg = gen512CardsImageURL(this.cardDetail.hsId)
      // this.cardDetail.cardImg = this.cardDetail.img_card_link
      if (this.cardDetail.use_backup_img === true || this.card_resource === 'cn') {
        if (this.cardDetail.img_card_link!=null && this.cardDetail.img_card_link.length>0){
          this.cardDetail.cardImg = this.cardDetail.img_card_link
        } else {
          this.cardDetail.cardImg = utils.genCardsImageURL(this.cardDetail.hsId)
        }
      } else if (this.card_resource === 'fbi') {
        this.cardDetail.cardImg = this.genCardImage(this.cardDetail.hsId)
      } else if (this.card_resource === 'hsreplay') {
        this.cardDetail.cardImg = utils.genCardsImageURL(this.cardDetail.hsId)
      } else {
        this.cardDetail.cardImg = utils.genCardsImageURL(this.cardDetail.hsId)
      }
      // this.cardDetail.heroIcon = heroes[this.cardDetail.cardClass].image
      for (let item of this.$store.state.cards.series) {
        if(this.cardDetail.set_id === item.id) {
          this.cardDetail.series = item.name
          if (item.mode === 'Standard') {
            this.cardDetail.series += '（标准）'
          } else if (item.mode === 'Wild') {
            this.cardDetail.series += '（狂野）'
          } else if (item.mode === 'Twist') {
            this.cardDetail.series += '（幻变）'
          }
        }
      }
      let cardClass = ''
      if (this.cardDetail.multiClass && this.cardDetail.multiClass.length) {
        for (let index in this.cardDetail.multiClass) {
          if (this.cardDetail.multiClass.hasOwnProperty(index)) {
            this.cardDetail.multiClass[index] = heroes[this.cardDetail.multiClass[index]].name
          }
        }
        cardClass = this.cardDetail.multiClass.join(', ')
        this.cardDetail.type = cardClass+'-'+utils.type[this.cardDetail.type].name
      } else {
        if (heroes[this.cardDetail.cardClass]) {
          this.cardDetail.type = heroes[this.cardDetail.cardClass].name+'-'+utils.type[this.cardDetail.type].name
        } else {
          this.cardDetail.type = utils.type[this.cardDetail.type].name
        }
      }
      
      if (this.cardDetail.race) {
        this.cardDetail.type += '-'+utils.race[this.cardDetail.race].name
      }
      
      this.cardDetail.audios = [
        {type: 'en', ename: 'audio_play_en', cname: '出场', src: this.cardDetail.audio_play_en!==""?JSON.parse(this.cardDetail.audio_play_en):""},
        {type: 'en', ename: 'audio_attack_en', cname: '攻击', src: this.cardDetail.audio_attack_en!==""?JSON.parse(this.cardDetail.audio_attack_en):""},
        {type: 'en', ename: 'audio_trigger_en', cname: '触发', src: this.cardDetail.audio_trigger_en!==""?JSON.parse(this.cardDetail.audio_trigger_en):""},
        {type: 'en', ename: 'audio_death_en', cname: '阵亡', src: this.cardDetail.audio_death_en!==""?JSON.parse(this.cardDetail.audio_death_en):""},
        {type: 'zh', ename: 'audio_play_zh', cname: '出场', src: this.cardDetail.audio_play_zh!==""?JSON.parse(this.cardDetail.audio_play_zh):""},
        {type: 'zh', ename: 'audio_attack_zh', cname: '攻击', src: this.cardDetail.audio_attack_zh!==""?JSON.parse(this.cardDetail.audio_attack_zh):""},
        {type: 'zh', ename: 'audio_trigger_zh', cname: '触发', src: this.cardDetail.audio_trigger_zh!==""?JSON.parse(this.cardDetail.audio_trigger_zh):""},
        {type: 'zh', ename: 'audio_death_zh', cname: '阵亡', src: this.cardDetail.audio_death_zh!==""?JSON.parse(this.cardDetail.audio_death_zh):""},
      ]
      let audiosList = []
      for (let item of this.cardDetail.audios) {
        if (item.src) {
          for (let index in item.src) {
            if (item.src.hasOwnProperty(index)) {
              let cname = index>0?item.cname+index:item.cname
              audiosList.push({type: item.type, ename: item.ename, cname: cname, src:item.src[index]})
            }
          }
        }
      }
      this.cardDetail.audios = audiosList
      
      if (this.cardDetail.audio_play_en || this.cardDetail.audio_attack_en
        || this.cardDetail.audio_trigger_en || this.cardDetail.audio_death_en) {
        this.showEnAudio = true
      } else {
        this.showEnAudio = false
      }
      if (this.cardDetail.audio_play_zh || this.cardDetail.audio_attack_zh
        || this.cardDetail.audio_trigger_zh || this.cardDetail.audio_death_zh) {
        this.showZhAudio = true
      } else {
        this.showZhAudio = false
      }
      this.initDeckList()
      wx.stopPullDownRefresh();
      wx.hideNavigationBarLoading()
    },
    async initDeckList(mode) {
      this.deckList = null
      this.totalDecks = 0
      this.selectedFaction = ''
      if (mode) {
        this.deckListMode = mode
        for (let i in this.rangePicker.list) {
          if (this.rangePicker.list.hasOwnProperty(i)) {
            if (this.rangePicker.list[i].mode === mode) {
              this.rangePicker.selectedItem=i
            }
          }
        }
      } else {
        let res = this.standardSetList.filter(v => {
          return v.setId === this.cardDetail.set_id
        }).length>0?true:false
        if (res) {
          this.deckListMode = 'Standard'
          this.rangePicker.selectedItem = 0
        } else {
          this.deckListMode = 'Wild'
          this.rangePicker.selectedItem = 1
        }
      }
      let deckRes = await getDeckList({mode: this.deckListMode, last_30_days: false, card: [this.cardDetail.dbfId]}, 1000, 0, '-game_count')
      this.deckList = utils.translateDeckName(deckRes.objects, this.decksName)
      // this.totalDecks = deckRes.meta.total_count
    },
    async initCardDetail() {
      this.showEnAudio = false
      this.showZhAudio = false
      this.standardSetList = await getSeriesData('Standard')
      let cardDetailRes = await getCardDetail({dbfId: parseInt(this.cardId), hsId: this.cardHsId})
      this.formatCardDetail(cardDetailRes[0])
    },
    previewCard() {
      console.log(this.cardDetail.cardImg)
      if (this.cardDetail.cardImg) {
        wx.previewImage({
          // urls: [genCardsImageURL(this.cardDetail.hsId)] // 需要预览的图片http链接列表
          urls: [this.cardDetail.cardImg]
        })
      }
    },
    handleAudioPlay(item) {
      this.selectedAudio = item.src
      if (this.myAudio) {
        if (this.audioPlaying) {
          this.myAudio.stop()
        }
        this.myAudio.autoplay = true
        this.myAudio.src = encodeURI(item.src)
        this.myAudio.play()
      }
    },
    handleCopyBtn(text) {
      wx.setClipboardData({
        data: text,
        success: function (res) {
          wx.showToast({
            title: '复制成功'
          })
        }
      })
    },
    handleEntourageClick(hsId, index) {
      this.entourageList = this.genEntourage.filter(v => {
        return v.hsId
      })
      this.$store.commit('setEntourageParams', {
        list: this.entourageList,
        index: index,
        counts: this.entourageList.length
      })
      if (hsId) {
        wx.navigateTo({
          url: `/pages/cards/cardDetail/index?hsId=${hsId}`
        })
      }
    },
    handlePrevious() {
      if (this.myAudio) {
        this.myAudio.stop()
      }
      if (this.cardDetail.collectible) {
        if (this.cardsPageParams.offset>0) {
          getCardsList(this.cardsPageParams.filter, 21, null, this.cardsPageParams.offset-1).then(res => {
              this.$store.commit('setCardsPageParams', {
                filter: this.cardsPageParams.filter,
                offset: this.cardsPageParams.offset-1,
                counts: this.cardsPageParams.counts
              })
              this.formatCardDetail(res.objects[0])
          })
        }
      } else {
        if (this.entourageParams.index>0) {
          this.cardHsId = this.entourageParams.list[this.entourageParams.index-1].hsId
          this.showEnAudio = false
          this.showZhAudio = false
          getCardDetail({dbfId: null, hsId: this.cardHsId}).then(res => {
            this.formatCardDetail(res[0])
            this.$store.commit('setEntourageParams', {
              list: this.entourageParams.list,
              index: this.entourageParams.index-1,
              counts: this.entourageParams.counts
            })
          }).catch(err => {
            console.log(err)
          })
        }
      }
    },
    handleNext() {
      if (this.myAudio) {
        this.myAudio.stop()
      }
      if (this.cardDetail.collectible) {
        if (this.cardsPageParams.offset<this.cardsPageParams.counts-1) {
          getCardsList(this.cardsPageParams.filter, 21, null, this.cardsPageParams.offset+1).then(res => {
              this.$store.commit('setCardsPageParams', {
                filter: this.cardsPageParams.filter,
                offset: this.cardsPageParams.offset+1,
                counts: this.cardsPageParams.counts
              })
              this.formatCardDetail(res.objects[0])
          })
        }
      } else {
        if (this.entourageParams.index<this.entourageParams.counts-1) {
          this.cardHsId = this.entourageParams.list[this.entourageParams.index+1].hsId
          this.showEnAudio = false
          this.showZhAudio = false
          getCardDetail({dbfId: null, hsId: this.cardHsId}).then(res => {
            this.formatCardDetail(res[0])
            this.$store.commit('setEntourageParams', {
              list: this.entourageParams.list,
              index: this.entourageParams.index+1,
              counts: this.entourageParams.counts
            })
          }).catch(err => {
            console.log(err)
          })
        }
      }
    },
    handleDeckClick(item) {
      wx.navigateTo({
        url: `/pages/decks/deckDetail/index?id=${item.id}&mode=${this.deckListMode}`
      })
    },
    handlePageChange(e) {
      this.currentPage = e.current
    },
    handleRankRangeChange(e) {
      this.currentPage = 1
      this.rangePicker.selectedItem = e.mp.detail.value
      this.deckListMode = this.rangePicker.list[this.rangePicker.selectedItem].mode
      this.initDeckList(this.deckListMode)
    },
    handleIconsClick(item) {
      this.currentPage = 1
      if (this.selectedFaction === item.id) {
        this.selectedFaction = ''
      } else {
        this.selectedFaction = item.id
      }
      let filterdDeckList = this.deckList
      if (this.selectedFaction !== '') {
        filterdDeckList = this.deckList.filter(v => {
          return v.faction === this.selectedFaction
        })
      } 
      this.totalDecks = filterdDeckList.length
    },
    handleOrderChange(item) {
      if (this.deckListOrder.indexOf(item.id) >= 0) {
        this.deckListOrder = this.deckListOrder.split('')[0] === '-' ? item.id : '-' + item.id
      } else {
        this.deckListOrder = '-' + item.id
      }
    },
  },
  onLoad() {
   if (this.adsOpenFlag && wx.createInterstitialAd) {
     this.interstitialAd = wx.createInterstitialAd({
       adUnitId: 'adunit-f0ee7b7386b219dd'
     })
     this.interstitialAd.onLoad(() => {})
     this.interstitialAd.onError((err) => {})
     this.interstitialAd.onClose(() => {
         this.$store.dispatch('resetCardsInsertAdsFlag')
     })
   }
  },
  mounted() {
    // console.log('mounted', this.ifanrSettings)
    this.genFactionIcons()
    this.imageLoaded = false
    this.cardId = this.$root.$mp.query.id
    // this.cardId = '5d44211a053b6358c46abdb1'
    this.cardHsId = this.$root.$mp.query.hsId
    // this.cardHsId = 'ULD_131'
    this.myAudio = wx.createInnerAudioContext()
    this.myAudio.onPlay(() => {
      console.log('start')
      this.audioPlaying = true
    })
    this.myAudio.onCanplay(() => {
      console.log('Canplay')
    })
    this.myAudio.onEnded(() => {
      console.log('end')
      this.selectedAudio = ''
    })
    this.myAudio.onWaiting(() => {
      console.log('waiting...')
      this.audioPlaying = true
    })
    this.myAudio.onError(res => {
      console.log(res.errMsg)
      console.log(res.errCode)
      console.log(res)
    })
    if (this.cardsInsertAdsFlag && this.interstitialAd) {
      this.interstitialAd.show().catch((err) => {
        console.error(err)
      })
    }
    this.initCardDetail()
  },
  onPullDownRefresh() {
    this.initCardDetail()
  },
  onUnload() {
    if (this.myAudio) {
      this.myAudio.stop()
      this.myAudio.destroy()
    }
    this.selectedAudio = ''
    this.cardId = null
    this.cardHsId = null
    this.cardDetail = Object.assign({}, defaultCardDetail)
  },
  onShareAppMessage(res) {
    // if (res.from === 'button') {
    //   return {
    //     title: this.cardDetail.name,
    //     path: `/pages/cards/cardDetail/index?id=${this.cardDetail.dbfId}`
    //   }
    // } else {
    //   return {
    //     title: '炉石传说情报站',
    //     path: '/pages/index/index'
    //   }
    // }
    return {
      title: this.cardDetail.name,
      path: `/pages/cards/cardDetail/index?id=${this.cardDetail.dbfId}`,
      // imageUrl: this.cardDetail.cardImg
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../../style/color';
.card-detail{
  .header {
    position: relative;
    width: 100%;
    height: 700rpx;
    overflow: hidden;
    background: #FAFAFA;
    .bg-img {
      position: absolute;
      width: 100%;
      height: 100%;
      filter: blur(20px);
      transform: scale(1.2);
      overflow: hidden;
      z-index: -999;
    }
    .card-img {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .icon-img {
      position: absolute;
      width: 90rpx;
      height: 90rpx;
      top: 40rpx;
      left: 30rpx;
    }
  }
  .detail {
    width: 100%;
    padding: 30rpx;
    box-sizing: border-box;
    .name {
      font-size: 36rpx;
      font-weight: 700;
      height: 76rpx;
      .headline-meta {
        height: 24rpx;
        line-height: 24rpx;
        margin-left: 16rpx;
        font-size: 19rpx;
        color: #999;
        border: 1rpx solid #ddd;
        border-radius: 24rpx;
        padding: 3rpx 10rpx;
      }
    }
    .normal {
      // height: 50rpx;
      margin-bottom: 10rpx;
      font-size: 28rpx;
    }
    .flavor {
      font-size: 28rpx;
      font-style: italic;
      color: rgba(0, 0, 0, .5);
    }
    .f2 {
      letter-spacing: 2em;
      margin-right: -2em;
    }
    .f3 {
      letter-spacing: 0.5em;
      margin-right: -0.5em;
    }
    .f4 {
      text-align: center;
      width: 4em;
    }
    .how-to-earn {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;  /* 添加这行 */
        width: 100%;             /* 添加这行 */
    }
    
    .how-to-earn .label {
        flex: 0 0 auto;         /* 修改这行 */
        white-space: nowrap;    /* 添加这行 */
    }
    
    .how-to-earn .content {
        flex: 1;               /* 修改这行 */
        margin-left: 0;        /* 修改这行 */
        min-width: 0;         /* 添加这行 */
    }
  }
  .audio-list {
    margin: 0 30rpx 15rpx;
    .title {
      font-size: 28rpx;
      color: #333333;
      line-height: 72rpx;
      font-weight: bold;
    }
    .en-audio, .zh-audio {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      .title {
        font-size: 28rpx;
        color: #333333;
        line-height: 52rpx;
      }
      .audio-item {
        display: flex;
        align-items: center;
        width: 150rpx;
        height: 60rpx;
        line-height: 60rpx;
        margin-right: 20rpx;
        box-sizing:border-box;
        border-radius: 50rpx;
        background: #eee;
        padding-left: 15rpx;
        margin-bottom: 20rpx;
        .play-img {
          display: inline-block;
          width: 30rpx;
          height: 30rpx;
          vertical-align:middle;
          background-size:contain;
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjIyNTMwMTIxNUQzQTExRTU4RTMyOTYyRTE3MjkwRDc5IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjIyNTMwMTIyNUQzQTExRTU4RTMyOTYyRTE3MjkwRDc5Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MjI1MzAxMUY1RDNBMTFFNThFMzI5NjJFMTcyOTBENzkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MjI1MzAxMjA1RDNBMTFFNThFMzI5NjJFMTcyOTBENzkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6TOvvbAAABxUlEQVR42ryXTSiEQRzGd+06ECmRRNRekIOLNyQHRVy4KKX2YkuSz5uLslLKiXxcpD2J2rIXF8rHSYiLkrgo2ZJC+WiVLJ6p573tzHrfxvzr1zPtzOzT/N//OzOv12pq8WgMP/j6y8AMjaaTYJPmxowLwCDoBEsmjR9BB0iAftBjMtUnYJRtsepCU8YiVsEuyAfTJo1FDIMkCIEyncYinaWK/isQBZlgQJdxL5gHMZClGGdXdlDm4dQ4xhVZYEwx7gjcMDOWDuMXrvoHjLOIUoXo32G7WdczPgZ7IC/N+3pIrXVjLOuPUtsVcy+pFU6Nxd47I+nbp9Yo5t9Si50YC9Mw6JP031GLFMbv1Fwnxl7PP4fsCAtTZe+qvYE8KP47h/rmxNg2l2WkkXqumG9vl/duqvpb8nuQuq2YW0291vUe14NWbiYbinF2Vs50GItNI8LimwXPiuJsY/tAh3EXqAIXPCxk0QACIA5OnRZXqohw1VvgQzFuiLomqxO/i2c8l6a/EnSDT7Bs8gayAHzMTtyUcYgV/wQmTN256sAi2yM0N3KhFwWXDVbAeroJvpLygA7jBE1feUNJuj0k3MSUk4+2XwEGAPeSTVRGzJ3zAAAAAElFTkSuQmCC);
        }
        span {
          margin-left: 8rpx;
          font-size: 24rpx;
          vertical-align:middle;
        }
      }
    }
  }
  .card-list {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    box-sizing: border-box;
    padding: 18rpx 18rpx 0;
    overflow: hidden;
    .card {
      width: 30%;
      height: 260rpx;
      padding: 0 0 8rpx;
      margin-bottom: 35rpx;
      text-align: center;
      font-size: 24rpx;
      img {
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        transform:scale(1.3);
      }
    }
  }
  .footer {
    position: fixed;
    bottom: 0;
    box-shadow:0px 0px 4px #c0c0c0;
    z-index: 999;
  }
}
.audio-play {
  position:relative;
  background-repeat:no-repeat;
  background-size:contain;
  animation:audioPlay 2s linear infinite;
}
.headline {
  margin: 0 30rpx;
  .filter-picker {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    box-sizing: border-box;
    font-size: 24rpx;
    height: 38rpx;
    line-height: 38rpx;
    border-radius: 20rpx;
    text-align: center;
    padding: 2rpx 14rpx;
    background: $palette-blue;
    color: #fff;
    border: 1rpx solid $palette-blue;
    font-weight: normal;
  }
}
.float-btn {
  position: fixed;
  top: 200rpx;
  right: 35rpx;
}
.loading {
  position: relative;
  height: 300rpx;
}
.panel-list {
  .no-deck {
    height: 300rpx;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
    font-size: 32rpx;
  }
}
.panel-block {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 86rpx;
  padding: 0 30rpx;
  /*box-shadow: 0 3px 2px -3px #000;*/
  border-bottom: 1rpx solid #eee;
  box-sizing: border-box;
  .filter-item {
    position: relative;
    height: 100%;
    line-height: 86rpx;
    font-size: 26rpx;
    .table-name {
      width: 265rpx;
      color: #999;
      box-sizing: border-box;
      padding-left: 33rpx;
    }
    .picker-icon {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
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
        position: absolute;
        width: 22rpx;
        height: 36rpx;
        margin-left: 5rpx;
        top: 48%;
        transform: translateY(-50%);
      }
    }
  }
}
@keyframes audioPlay {
  0% {background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjM0NEQ3RDg1NUQzQTExRTU4NkE2ODlDNENFMTkyNjMzIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjM0NEQ3RDg2NUQzQTExRTU4NkE2ODlDNENFMTkyNjMzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MzQ0RDdEODM1RDNBMTFFNTg2QTY4OUM0Q0UxOTI2MzMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MzQ0RDdEODQ1RDNBMTFFNTg2QTY4OUM0Q0UxOTI2MzMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7APQCsAAAAW0lEQVR42mL8//8/g5mdKwO9ARPDAIFRi0ctHrV41OLhZzHTQFhcD8Rt9LYYZGkDEKfS22JGWscxCw7xBijNSW+LYZYzDVSq/jdagIxaPGrxqMWjFg+4xQABBgABTAhrvxCDdAAAAABJRU5ErkJggg==);}
  33% {background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjJGMjUxRDc2NUQzQTExRTU4QjA2QUQ3Q0E5NEY2QkRCIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjJGMjUxRDc3NUQzQTExRTU4QjA2QUQ3Q0E5NEY2QkRCIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MkYyNTFENzQ1RDNBMTFFNThCMDZBRDdDQTk0RjZCREIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MkYyNTFENzU1RDNBMTFFNThCMDZBRDdDQTk0RjZCREIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6aWLOjAAAA1klEQVR42mI0tXVhGAjAxDBAYNTiUYsHlcX5QCxDb4sTgXgCEK8DYk56Wgyy8AYQmwJxAT0t/gj19X8gLgdiIXrG8Qkg3gvE/EAcSSuLccmvgtIetLC4HojbcMjtg9L61LYYZGkDEKfikH8MpcWpbTEjrQsQFhziDVAaV16FFSAvqW0xzHJcIWINpS/SKlX/wyEeA6V30DMfWwCxK7QwWU4vi0GFxjxo4usE4nf0sjgYiDWB+Aq0smCgReLCBuZBfb0ZiL/T02IQ6B9t+oxaPGoxNgAQYADwcB2Sjvx+hgAAAABJRU5ErkJggg==);}
  66% {background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjIyNTMwMTIxNUQzQTExRTU4RTMyOTYyRTE3MjkwRDc5IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjIyNTMwMTIyNUQzQTExRTU4RTMyOTYyRTE3MjkwRDc5Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MjI1MzAxMUY1RDNBMTFFNThFMzI5NjJFMTcyOTBENzkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MjI1MzAxMjA1RDNBMTFFNThFMzI5NjJFMTcyOTBENzkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6TOvvbAAABxUlEQVR42ryXTSiEQRzGd+06ECmRRNRekIOLNyQHRVy4KKX2YkuSz5uLslLKiXxcpD2J2rIXF8rHSYiLkrgo2ZJC+WiVLJ6p573tzHrfxvzr1zPtzOzT/N//OzOv12pq8WgMP/j6y8AMjaaTYJPmxowLwCDoBEsmjR9BB0iAftBjMtUnYJRtsepCU8YiVsEuyAfTJo1FDIMkCIEyncYinaWK/isQBZlgQJdxL5gHMZClGGdXdlDm4dQ4xhVZYEwx7gjcMDOWDuMXrvoHjLOIUoXo32G7WdczPgZ7IC/N+3pIrXVjLOuPUtsVcy+pFU6Nxd47I+nbp9Yo5t9Si50YC9Mw6JP031GLFMbv1Fwnxl7PP4fsCAtTZe+qvYE8KP47h/rmxNg2l2WkkXqumG9vl/duqvpb8nuQuq2YW0291vUe14NWbiYbinF2Vs50GItNI8LimwXPiuJsY/tAh3EXqAIXPCxk0QACIA5OnRZXqohw1VvgQzFuiLomqxO/i2c8l6a/EnSDT7Bs8gayAHzMTtyUcYgV/wQmTN256sAi2yM0N3KhFwWXDVbAeroJvpLygA7jBE1feUNJuj0k3MSUk4+2XwEGAPeSTVRGzJ3zAAAAAElFTkSuQmCC);}
  100% {background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjM0NEQ3RDg1NUQzQTExRTU4NkE2ODlDNENFMTkyNjMzIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjM0NEQ3RDg2NUQzQTExRTU4NkE2ODlDNENFMTkyNjMzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MzQ0RDdEODM1RDNBMTFFNTg2QTY4OUM0Q0UxOTI2MzMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MzQ0RDdEODQ1RDNBMTFFNTg2QTY4OUM0Q0UxOTI2MzMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7APQCsAAAAW0lEQVR42mL8//8/g5mdKwO9ARPDAIFRi0ctHrV41OLhZzHTQFhcD8Rt9LYYZGkDEKfS22JGWscxCw7xBijNSW+LYZYzDVSq/jdagIxaPGrxqMWjFg+4xQABBgABTAhrvxCDdAAAAABJRU5ErkJggg==);}
}
</style>
