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
      <p v-show="cardDetail.flavor" class="flavor" @click="handleCopyBtn(cardDetail.flavor)">{{cardDetail.flavor}}</p>
      <p v-show="cardDetail.eflavor" class="flavor" @click="handleCopyBtn(cardDetail.eflavor)">{{cardDetail.eflavor}}</p>
    </div>
    <div class="entourage-block" v-if="entourageList.length>0">
      <div class="headline"><span class="title">衍生卡</span></div>
      <div class="card-list">
        <div class="card" v-for="(item, index) in entourageList" :key="index" @click="handleEntourageClick(item)">
          <img :src="item.image" mode="aspectFit" @load="childImageLoad(item)">
          <div class="rank-board" v-show="!item.loaded && item.image">            <SpinKit :mode="'sk-spinner-pulse'"></SpinKit>          </div>
        </div>
      </div>
    </div>
    <div class="ads" v-if="adsOpenFlag">
      <ad unit-id="adunit-3f4b7b57a1b47647" ad-type="video" ad-theme="white"></ad>
    </div>
    <div :style="{'height': isIphoneX?124+'rpx':90+'rpx'}"></div>
    <div class="footer">
      <preNextBtnGroup @previousClick="handlePrevious" @nextClick="handleNext" :prevBtnEnable="prevBtnEnable" :nextBtnEnable="nextBtnEnable"></preNextBtnGroup>
    </div>
  </div>
</template>
<script>
import { getCardPicture } from "@/utils";
import { mapGetters } from 'vuex'
import utils from '@/utils'
import {genOrigImageURL, genCardsImageURL, gen512CardsImageURL} from '@/utils'
import {getRevealCardDetail, getRevealCardsList, getSeriesData} from "@/api/dbapi";
import NavBar from '@/components/NavBar'
import SpinKit from '@/components/SpinKit'
import preNextBtnGroup from '@/components/preNextBtnGroup'
import uniPagination from "@/components/uni-pagination/uni-pagination"

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
  Neutral: {name: '中立', image: ''}
}
const defaultCardDetail = {
  name: '',
  ename: '',
  series: '',
  flavor: '',
  type: '',
  cardImg: null,
  heroIcon: null,
}
export default {
  components: {
    NavBar,
    SpinKit,
    uniPagination,
    preNextBtnGroup
  },
  data() {
    return {
      cardId: null,
      cardHsId: null,
      cardDetail: Object.assign({}, defaultCardDetail),
      imageLoaded: false,
      entourageList: [],
      standardSetList: [],
    }
  },
  computed: {
    ...mapGetters([
      'navHeight',
      'fbiVersion',
      'fbiKey',
      'fbiFlag',
      'card_resource',
      'cardsPageParams',
      'entourageParams',
      'isIphoneX',
      'decksName',
      'adsOpenFlag'
    ]),
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
  },
  methods: {
    imageLoad(e) {
      this.imageLoaded = true
    },
    childImageLoad(item) {
      item.loaded = true
    },
    genCardImage(hsId) {
      return getCardPicture(this, hsId, false, this.fbiFlag, this.fbiVersion, this.fbiKey)
    },
    async formatCardDetail(detail) {
      this.cardDetail = detail
      this.cardDetail.cardImg = this.cardDetail.img_card_link
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
        this.cardDetail.type = utils.type[this.cardDetail.type].name
      }
      // if (heroes[this.cardDetail.cardClass]) {
      //   this.cardDetail.type = heroes[this.cardDetail.cardClass].name+'-'+utils.type[this.cardDetail.type].name
      // } else {
      //   this.cardDetail.type = utils.type[this.cardDetail.type].name
      // }
      if (this.cardDetail.race) {
        this.cardDetail.type += '-'+utils.race[this.cardDetail.race].name
      }
      for (let item of this.$store.state.cards.series) {
        if(this.cardDetail.set_id === item.id) {
          this.cardDetail.series = item.name
          if (item.mode === 'Standard') {
            this.cardDetail.series += '（标准）'
          } else if (item.mode === 'Wild') {
            this.cardDetail.series += '（狂野）'
          }
        }
      }
      if (this.cardDetail.entourage) {
        let childList = await getRevealCardsList({
          'childList': this.cardDetail.entourage,
        })
        this.entourageList = childList.objects.map(item => {
          return {
            name: item.name,
            dbfId: item.dbfId,
            image: item.img_card_link,
            loaded: false
          }
        })
        let emptyNum = this.entourageList.length % 3
        if(emptyNum) {
          for (let i=0; i<(3-emptyNum); i++) {
            this.entourageList.push({})
          }
        }
      } else {
        this.entourageList = []
      }
    },
    async initCardDetail() {
      this.standardSetList = await getSeriesData('Standard')
      let cardDetailRes = await getRevealCardDetail({dbfId: parseInt(this.cardId), hsId: this.cardHsId})
      this.formatCardDetail(cardDetailRes[0])
    },
    previewCard() {
      if (this.cardDetail.cardImg) {
        wx.previewImage({
          urls: [this.cardDetail.cardImg]
        })
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
    handlePrevious() {
      if (this.cardDetail.collectible) {
        if (this.cardsPageParams.offset>0) {
          getRevealCardsList(this.cardsPageParams.filter, 21, null, this.cardsPageParams.offset-1).then(res => {
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
          getRevealCardDetail({dbfId: null, hsId: this.cardHsId}).then(res => {
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
      if (this.cardDetail.collectible) {
        if (this.cardsPageParams.offset<this.cardsPageParams.counts-1) {
          getRevealCardsList(this.cardsPageParams.filter, 21, null, this.cardsPageParams.offset+1).then(res => {
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
          getRevealCardDetail({dbfId: null, hsId: this.cardHsId}).then(res => {
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
    handleEntourageClick(item) {
      wx.navigateTo({
        url: `/pages/cards/revealCardDetail/index?id=${item.dbfId}`
      })
    },
  },
  mounted() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    this.imageLoaded = false
    this.cardId = this.$root.$mp.query.id
    this.cardHsId = this.$root.$mp.query.hsId
    this.initCardDetail()
  },
  onPullDownRefresh() {
    this.initCardDetail()
  },
  onUnload() {
    this.selectedAudio = ''
    this.cardId = null
    this.cardHsId = null
    this.cardDetail = Object.assign({}, defaultCardDetail)
  },
  onShareAppMessage(res) {
    return {
      title: this.cardDetail.name,
      path: `/pages/cards/revealCardDetail/index?id=${this.cardDetail.dbfId}`
    }
  },
  onShareTimeline(res) {
    return {
      title: this.cardDetail.name,
      query: `/pages/cards/revealCardDetail/index?id=${this.cardDetail.dbfId}`
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
    .card-img {
      position: absolute;
      width: 100%;
      height: 600rpx;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
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
      height: 50rpx;
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
      position: relative;
      width: 30%;
      height: 260rpx;
      padding: 0 0 8rpx;
      margin-bottom: 35rpx;
      text-align: center;
      font-size: 24rpx;
      img {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }
    }
  }
  .footer {
    position: fixed;
    bottom: 0;
    box-shadow:0px 0px 4px #c0c0c0;
    z-index: 999;
    .btn-group {
      position: relative;
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-around;
      align-items: center;
      width: 750rpx;
      height: 90rpx;
      background-color: #fff;
      .btn {
        width: 40%;
        height: 60rpx;
        line-height: 60rpx;
        text-align: center;
        border-radius: 10rpx;
        background-color: $palette-blue;
        color: #fff;
        font-size: 26rpx;
      }
      .de-active {
        background: rgba(67, 62, 136, .2);
        color: rgba(67, 62, 136, .5);
        border: 1rpx solid rgba(67, 62, 136, .5);
      }
    }
  }
}
.headline {
  margin: 0 30rpx;
  .filter-picker {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    font-size: 20rpx;
    height: 32rpx;
    line-height: 32rpx;
    border-radius: 20rpx;
    text-align: center;
    padding: 2rpx 12rpx;
    background: $palette-blue;
    color: #fff;
    border: 1rpx solid $palette-blue;
    font-weight: normal;
  }
}
.float-btn {
  position: fixed;
  top: 200rpx;
  right: 20rpx;
}
.loading {
  position: relative;
  height: 300rpx;
}
</style>
