<template>
  <div class="card-detail">
    <nav-bar :showCapsule="true" navTitle="单卡详情"></nav-bar>
    <div class="header">
      <div style="width: 100%; height: 100%;">
        <swiper class="preview-swiper" circular :duration="200" :current="current" @change="change" v-if="cardFormatted">
          <swiper-item class="item">
            <!-- 英雄卡牌或者是有三连后卡牌的卡牌 -->
            <div v-if="cardDetail.hero||upgradeCard.gold_image">
              <img class="card-img" :src="cardDetail.image" mode="aspectFit" @load="imageLoad" @click="previewImage(cardDetail.image)">
            </div>
            <!-- 没有三连后卡牌的卡牌则用文字代替图片并与原图显示在一个swiper-item中 -->
            <div class="preview-cards" v-else>
              <img class="small-img" :src="cardDetail.image" mode="aspectFit" @load="imageLoad" @click="previewImage(cardDetail.image)">
              <div v-if="!cardDetail.hero" style="width: 40%; height: 68%; padding-right: 20rpx; box-sizing: border-box;">
                <img class="small-img" :src="upgradeCard.gold_image" mode="aspectFit" @load="upgradeImageLoad" @click="previewImage(upgradeCard.gold_image)" v-if="upgradeCard.gold_image">
                <div class="upgrade-text" v-else>
                  <div class="head">
                    <img src="/static/battlegroundIcons/upgrade-icon.png" mode="aspectFit">
                    <span class='title'>三连卡牌:</span>
                  </div>
                  <div class="content">
                    <div class="name">{{cardDetail.name}}</div>
                    <div class="state">
                      <div class="attack">{{cardDetail.attack*2}}</div>
                      <div class="health">{{cardDetail.health*2}}</div>
                    </div>
                    <rich-text class="text" :nodes="cardDetail.upgradeText" v-if="cardDetail.upgradeText"></rich-text>
                    <rich-text class="text" :nodes="cardDetail.text" v-else></rich-text>
                  </div>
                </div>
              </div>
            </div>
          </swiper-item>
          <!-- 英雄卡牌的技能（鼠王有多个技能，因此这里是一个list） -->
          <swiper-item v-if="cardDetail.hero" class="item" v-for="(item, index) in entourageList" :key="index" @click="previewImage(item.image)">
            <img class="card-img" :src="item.image" mode="aspectFit">
          </swiper-item>
          <!-- 随从的三连卡牌 -->
          <swiper-item v-if="!cardDetail.hero && upgradeCard.gold_image" class="item">
            <div class="upgrade-head">
              <img src="/static/battlegroundIcons/upgrade-icon.png" mode="aspectFit">
              <span class='title' style="font-weight: bold;">三连卡牌</span>
            </div>
            <img class="upgrade-img" :src="upgradeCard.gold_image" mode="aspectFit" @load="upgradeImageLoad" @click="previewImage(upgradeCard.gold_image)" v-if="upgradeCard.gold_image">
          </swiper-item>
        </swiper>
        <div class="card-loading" v-show="!imageLoaded">
          <SpinKit :mode="'sk-double-bounce'"></SpinKit>
        </div>
        <div class="arrow-btn" v-show="cardDetail.hero||upgradeCard.gold_image">
          <div class="arrow left-arrow" :class="{'disable-arrow': current===0}" @click="gotoSwiperPrevious">
            <img src="/static/icons-v2/leftarrow.png" mode="aspectFill">
          </div>
          <div class="arrow right-arrow" :class="{'disable-arrow': current===swiperItemCounts-1}" @click="gotoSwiperNext">
            <img src="/static/icons-v2/rightarrow.png" mode="aspectFill">
          </div>
        </div>
      </div>
    </div>
    <div class="detail" v-show="cardDetail.name">
      <p class="name" @click="handleCopyBtn(cardDetail.name)">{{cardDetail.name}}<span class="headline-meta">点击复制</span></p>
      <p class="normal"><span class="f2">类型</span>：{{cardType}}</p>
      <p class="normal"><span class="f2">系列</span>：酒馆战棋</p>
      <p v-show="minionType" class="normal"><span class="f4">随从种类</span>：{{minionType}}</p>
      <p class="normal" v-if="cardDetail.hero" v-show="heroPower" style="display: flex;">
        <span class="f4" style="white-space: nowrap;">英雄技能</span>：
        <rich-text class="text" :nodes="heroPower.text"></rich-text>
      </p>
      <p v-else v-show="cardDetail.text" class="normal" style="display: flex;">
        <span class="f2" style="white-space: nowrap;">描述</span>：
        <rich-text class="text" :nodes="description"></rich-text>
      </p>
      <p v-show="cardDetail.flavor" class="flavor" @click="handleCopyBtn(cardDetail.flavor)">{{cardDetail.flavor}}</p>
    </div>
    <div class="entourage-block" v-if="cardFormatted&&!cardDetail.hero && entourageList.length>0">
      <div class="headline" style="padding: 0 30rpx;"><span class="title">衍生卡</span></div>
      <div class="card-list">
        <div class="card" v-for="(item, index) in entourageList" :key="index" @click="previewImage(item.image)">
          <img :src="item.image" mode="aspectFit">
        </div>
      </div>
    </div>
    <div class="hero-tier-detail" v-if="heroTierDetail">
      <div class="ads" v-if="adsOpenFlag&&adsType=='video'">
        <ad unit-id="adunit-3f4b7b57a1b47647" ad-type="video" ad-theme="white"></ad>
      </div>
      <div class="ads" style="margin: 15upx 0 0 0;" v-if="adsOpenFlag&&adsType!=='video'">
        <ad unit-id="adunit-038fb5d0b45f4699"></ad>
      </div>
      <div class="headline m-30"><span class="title">排名分布</span></div>
      <div class="meta">
        <div class="meta-panel">
          <p class="name">开局出现次数</p>
          <p class="content">{{times_offered}}</p>
        </div>
        <div class="meta-panel">
          <p class="name">选取次数</p>
          <p class="content">{{times_chosen}}</p>
        </div>
        <div class="meta-panel">
          <p class="name">选取率</p>
          <p class="content">{{pick_rate}}</p>
        </div>
        <div class="meta-panel">
          <p class="name">热度</p>
          <p class="content">{{popularity}}</p>
        </div>
        <div class="meta-panel">
          <p class="name">平均排名</p>
          <p class="content">{{avg_final_placement}}</p>
        </div>
      </div>
      <canvas canvas-id="canvasColumn" id="canvasColumn" class="charts" v-if="!chartImg"></canvas>
      <img class="charts" :src="chartImg" mode="aspectFit" v-else>
    </div>
    <div :style="{'height': isIphoneX?134+'rpx':90+'rpx'}"></div>
    <div class="footer">
      <div class="btn-group" :style="{'height':isIphoneX?134+'rpx':90+'rpx'}">
        <button class="btn previous" @click="handlePrevious" :class="{'de-active': !prevBtnEnable}" :style="{'margin-bottom':isIphoneX?40+'rpx':0}"><span>上一张</span></button>
        <button class="btn next" @click="handleNext" :class="{'de-active': !nextBtnEnable}" :style="{'margin-bottom':isIphoneX?40+'rpx':0}"><span>下一张</span></button>
      </div>
    </div>
  </div>
</template>

<script>
import utils from '@/utils'
import { mapGetters } from 'vuex'
import {getBattlegroundCards, getBattlegroundCardDetail, getBattlegroundHeroTierDetail} from '@/api/dbapi'
import FooterMenu from '@/components/FooterMenu'
import NavBar from '@/components/NavBar'
import SpinKit from '@/components/SpinKit'
import uCharts from '@/components/u-charts/u-charts.js';

let _this;
let barChart=null;

const defaultCardDetail = {
  name: '',
  hero: null,
  tier: null,
  minionType: null,
  keywords: [],
  image: null,
  gold_image: null,
  flavor: null,
  text: null
}
export default {
  components: {
    NavBar,
    SpinKit,
    FooterMenu
  },
  data() {
    return {
      cardId: null,
      cardDetail: Object.assign({}, defaultCardDetail),
      imageLoaded: 0,
      entourageList: null,
      heroPower: null,
      upgradeCard: null,
      cardFormatted: false,
      current: 0,
      swiperItemCounts: 1,
      heroTierDetail: null,
      pixelRatio:1,
      cWidth: 0,
      cHeight: 0,
      chartImg: null,
      interstitialAd: null,
    }
  },
  computed: {
    ...mapGetters([
      'navHeight',
      'entourageParams',
      'cardsPageParams',
      'isIphoneX',
      'adsOpenFlag',
      'ifanrSettings',
      'cardsInsertAdsFlag',
    ]),
    cardType() {
      return this.cardDetail.hero?'英雄':'随从'
    },
    minionType() {
      if (this.cardDetail.hero===0) {
        let res = utils.battlegroundMinionType.filter(item => {
          return item.id === this.cardDetail.minionType
        })
        return res.length?res[0].name:null
      } else {
        return null
      }
    },
    prevBtnEnable() {
      return this.cardsPageParams.offset>0
    },
    nextBtnEnable() {
      return this.cardsPageParams.offset<this.cardsPageParams.counts-1
    },
    showPreview() {
      return this.cardFormatted&&this.imageLoaded>=1
    },
    description() {
      if(!this.cardDetail.hero && (this.upgradeCard&&this.upgradeCard.gold_image)) {
        if (this.current!==0) {
          return this.upgradeCard.text
        } else {
          return this.cardDetail.text
        }
      } else if (!this.upgradeCard) {
        return this.cardDetail.text
      } else {
        return null
      }
    },
    times_offered() {
      if (this.heroTierDetail) {
        return utils.toThousands((this.heroTierDetail.times_offered))
      } else {
        return 'N/A'
      }
    },
    times_chosen() {
      if (this.heroTierDetail) {
        return utils.toThousands((this.heroTierDetail.times_chosen))
      } else {
        return 'N/A'
      }
    },
    pick_rate() {
      if (this.heroTierDetail) {
        return parseFloat(this.heroTierDetail.pick_rate).toFixed(2)+'%'
      } else {
        return 'N/A'
      }
    },
    popularity() {
      if (this.heroTierDetail) {
        return parseFloat(this.heroTierDetail.popularity).toFixed(2)+'%'
      } else {
        return 'N/A'
      }
    },
    avg_final_placement() {
      if (this.heroTierDetail) {
        return parseFloat(this.heroTierDetail.avg_final_placement).toFixed(2)
      } else {
        return 'N/A'
      }
    },
    adsType() {
      if (this.ifanrSettings && this.ifanrSettings.bgs_ads_type) {
        return this.ifanrSettings.bgs_ads_type
      } else {
        return 'video'
      }
    }
  },
  methods: {
    async formatCardDetail(detail) {
      this.current = 0
      this.imageLoaded = 0
      this.cardFormatted = false
      this.cardDetail = detail
      if (this.cardDetail.hero) {
        let power = await getBattlegroundCardDetail({hsId: parseInt(this.cardDetail.entourageID[0])})
        this.heroPower = power.length?power[0]:null
        let tierDetail = await getBattlegroundHeroTierDetail({hero_id: parseInt(this.cardId)})
        this.heroTierDetail = tierDetail.length?tierDetail[0]:null
        if (this.heroTierDetail) {
          let formatChartData = {
            categories: ['1', '2', '3', '4', '5', '6', '7', '8'],
            series: [{'name': '排名百分比', data: [], color: '#78577a', format:(val)=>{return val+'%'}}]
          }
          // #78577a
          console.log(formatChartData.series[0].data, formatChartData.color)
          // formatChartData.series[0].data = this.heroTierDetail.final_placement_distribution.map((item, index) => {
          //   console.log('11', item, index)
          //   return {
          //     vaule: item,
          //     color: index<4?"#c58dc9":"#78577a"
          //   }
          // })
          formatChartData.series[0].data = this.heroTierDetail.final_placement_distribution
          this.showColumn("canvasColumn", formatChartData)
        }
      } else {
        this.heroPower = null
      }
      if (this.cardDetail.entourageID) {
        let list = []
        for (let i=0; i<this.cardDetail.entourageID.length; i++) {
          let card = await getBattlegroundCardDetail({hsId: parseInt(this.cardDetail.entourageID[i])})
          if (card.length&&card[0].image) {
            list.push({
              hsId: card[0].hsId,
              image: card[0].image,
              text: card[0].text
            })
          }
        }
        if (this.cardDetail.hero&&list.length>1 || !this.cardDetail.hero) {
          let temp = this.cardDetail.hero?4:3
          let emptyNum = list.length % temp
          if(emptyNum) {
            for (let i=0; i<(temp-emptyNum); i++) {
              list.push({})
            }
          }
        }
        this.entourageList = list
      } else {
        this.entourageList = null
      }
      if (this.cardDetail.upgradeID) {
        let card = await getBattlegroundCardDetail({hsId: parseInt(this.cardDetail.upgradeID)})
        this.upgradeCard = card.length?card[0]:null
      } else {
        this.upgradeCard = null
      }
      if (this.cardDetail.hero) {
        this.swiperItemCounts = this.entourageList?this.entourageList.length+1:1
      } else if (this.upgradeCard&&this.upgradeCard.gold_image) {
        this.swiperItemCounts = 2
      }
      this.cardFormatted = true
    },
    async initCardDetail() {
      let res = await getBattlegroundCardDetail({hsId: parseInt(this.cardId)})
      this.formatCardDetail(res[0])
    },
    imageLoad(e) {
      this.imageLoaded += 1
    },
    upgradeImageLoad() {
      this.imageLoaded += 1
    },
    heroPowerImageLoad() {
      this.imageLoaded += 1
    },
    previewCard() {
      if (this.cardDetail.image) {
        wx.previewImage({
          urls: [this.cardDetail.image]
        })
      }
    },
    previewImage(url) {
      wx.previewImage({
        urls: [url]
      })
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
    change(e) {
      this.current = e.detail.current;
    },
    gotoSwiperPrevious() {
      if (this.current > 0) {
        this.current -= 1
      }
    },
    gotoSwiperNext() {
      if (this.current < this.swiperItemCounts-1) {
        this.current += 1
      }
    },
    handlePrevious() {
      if (this.cardsPageParams.offset>0) {
        getBattlegroundCards(this.cardsPageParams.filter, 21, null, this.cardsPageParams.offset-1).then(res => {
            this.$store.commit('setCardsPageParams', {
              filter: this.cardsPageParams.filter,
              offset: this.cardsPageParams.offset-1,
              counts: this.cardsPageParams.counts
            })
            this.formatCardDetail(res.objects[0])
        })
      }
    },
    handleNext() {
      if (this.cardsPageParams.offset<this.cardsPageParams.counts-1) {
        getBattlegroundCards(this.cardsPageParams.filter, 21, null, this.cardsPageParams.offset+1).then(res => {
            this.$store.commit('setCardsPageParams', {
              filter: this.cardsPageParams.filter,
              offset: this.cardsPageParams.offset+1,
              counts: this.cardsPageParams.counts
            })
            this.formatCardDetail(res.objects[0])
        })
      }
    },
    showColumn(canvasId,chartData){
      console.log('aa', chartData, this.cWidth, this.cHeight)
    	barChart=new uCharts({
    		$this:_this,
    		canvasId: canvasId,
    		type: 'column',
    		legend:false,
    		fontSize:11,
    		background:'#FFFFFF',
    		pixelRatio:_this.pixelRatio,
    		animation: true,
    		categories: chartData.categories,
    		series: chartData.series,
        yAxis: {
          // max: 10,
          disabled:true
        },
    		width: _this.cWidth*_this.pixelRatio,
    		height: _this.cHeight*_this.pixelRatio,
        extra: {
        	column: {
        		type:'group',
        		width: _this.cWidth*_this.pixelRatio*0.45/chartData.categories.length
        	}
        }
    	});
      barChart.addEventListener('renderComplete', () => {
        setTimeout(() => {
          wx.canvasToTempFilePath({
            width: _this.cWidth*_this.pixelRatio,
            height: _this.cHeight*_this.pixelRatio,
            canvasId: 'canvasColumn',
            success(res) {
              _this.chartImg = res.tempFilePath
            },
            fail(err) {
              console.log(err)
            }
          })
        }, 1000)
      });
    },
    touchColumn(e){
      barChart.showToolTip(e, {
        format: function (item, category) {
          if(typeof item.data === 'object'){
            // return category + ' ' + item.name + ':' + item.data.value 
            return '第'+category+'名:'+item.data.value
          }else{
            // return category + ' ' + item.name + ':' + item.data 
            return '第'+category+'名:'+item.data
          }
        }
      });
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
    _this = this;
    this.cWidth=uni.upx2px(750);
    this.cHeight=uni.upx2px(300);
    this.imageLoaded = 0
    this.cardId = this.$root.$mp.query.id
    this.initCardDetail()
  },
  mounted() {
    if (this.cardsInsertAdsFlag && this.interstitialAd) {
      this.interstitialAd.show().catch((err) => {
        console.error(err)
      })
    }
  },
  onPullDownRefresh() {
    this.initCardDetail()
  },
  onShareAppMessage(res) {
    return {
      title: this.cardDetail.name,
      path: `/pages/cards/cardDetail/index?id=${this.cardDetail.dbfId}`
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../style/color';
.card-detail {
  .header {
    position: relative;
    width: 100%;
    height: 700rpx;
    box-sizing: border-box;
    background: #fafafa;
    overflow: hidden;
    .preview-swiper {
      position: absolute;
      width: 100%;
      height: 100%;
      height: 100%;
      .card-img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        height: 85%;
      }
      .upgrade-img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        height: 75%;
      }
      .upgrade-head {
        display: flex;
        justify-content: center;
        align-items: middle;
        margin: 35rpx auto 0;
        img {
          width: 48rpx;
          height: 48rpx;
          margin-right: 10rpx;
          vertical-align: middle;
        }
        .title {
          font-size: 32rpx;
        }
      }
      .upgrade-text {
        height: 100%;
        padding-top: 30rpx;
        .head {
          height: 60rpx;
          line-height: 60rpx;
          img {
            width: 48rpx;
            height: 48rpx;
            margin-right: 10rpx;
            vertical-align: middle;
          }
          .title {
            font-size: 32rpx;
          }
        }
        .content {
          .name {
            height: 60rpx;
            line-height: 60rpx;
            color: rgb(248, 183, 0);
            font-size: 38rpx;
            font-weight: bold;
          }
          .state {
            height: 100rpx;
            line-height: 100rpx;
            .attack {
              display: inline-block;
              width: 60rpx;
              height: 60rpx;
              background: url('../../../static/battlegroundIcons/attack-icon.png') no-repeat;
              background-size: 100% 100%;
              text-align: center;
              color: #fff;
              font-size: 30rpx;
              font-weight: bold;
              text-shadow: #000 1px 0 0,#000 0 1px 0,#000 -1px 0 0,#000 0 -1px 0;
              line-height: 75rpx;
              background-position: -2rpx 0;
            }
            .health {
              display: inline-block;
              width: 60rpx;
              height: 60rpx;
              background: url('../../../static/battlegroundIcons/health-icon.png') no-repeat;
              background-size: 100% 100%;
              text-align: center;
              color: #fff;
              font-size: 30rpx;
              font-weight: bold;
              text-shadow: #000 1px 0 0,#000 0 1px 0,#000 -1px 0 0,#000 0 -1px 0;
              line-height: 75rpx;
            }
          }
          .text {
            font-size: 32rpx;
          }
        }
      }
    }
    .preview-cards {
      display: flex;
      justify-content: space-around;
      align-items: center;
      height: 100%;
      .small-img {
        // height: 90%;
        width: 55%;
        img {
          width: 100%;
          height: 100%;
        }
        .upgrade-text {
          height: 100%;
          padding-top: 30rpx;
          .head {
            height: 60rpx;
            line-height: 60rpx;
            img {
              width: 48rpx;
              height: 48rpx;
              margin-right: 10rpx;
              vertical-align: middle;
            }
            .title {
              font-size: 32rpx;
            }
          }
          .content {
            .name {
              height: 60rpx;
              line-height: 60rpx;
              color: rgb(248, 183, 0);
              font-size: 38rpx;
              font-weight: bold;
            }
            .state {
              height: 100rpx;
              line-height: 100rpx;
              .attack {
                display: inline-block;
                width: 60rpx;
                height: 60rpx;
                background: url('../../../static/battlegroundIcons/attack-icon.png') no-repeat;
                background-size: 100% 100%;
                text-align: center;
                color: #fff;
                font-size: 30rpx;
                font-weight: bold;
                text-shadow: #000 1px 0 0,#000 0 1px 0,#000 -1px 0 0,#000 0 -1px 0;
                line-height: 75rpx;
                background-position: -2rpx 0;
              }
              .health {
                display: inline-block;
                width: 60rpx;
                height: 60rpx;
                background: url('../../../static/battlegroundIcons/health-icon.png') no-repeat;
                background-size: 100% 100%;
                text-align: center;
                color: #fff;
                font-size: 30rpx;
                font-weight: bold;
                text-shadow: #000 1px 0 0,#000 0 1px 0,#000 -1px 0 0,#000 0 -1px 0;
                line-height: 75rpx;
              }
            }
            .text {
              font-size: 32rpx;
            }
          }
        }
      }
    }
    .arrow-btn {
      .disable-arrow {
        opacity: 0.4;
      }
      .arrow {
        width: 80rpx;
        height: 80rpx;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        img {
          width: 100%;
          height: 100%;
        }
      }
      .left-arrow {
        left: 30rpx;
      }
      .right-arrow {
        right: 30rpx;
      }
    }
  }
  .detail {
    width: 100%;
    padding: 20rpx 30rpx;
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
      min-height: 50rpx;
      font-size: 28rpx;
    }
    .flavor {
      margin-top: 8rpx;
      font-size: 28rpx;
      font-style: italic;
      color: rgba(0, 0, 0, .5);
    }
    .text {
      display: inline-block;
      font-size: 28rpx;
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
  .hero-power {
    padding: 0 30rpx;
    .card {
      height: 260rpx;
      padding: 0 0 8rpx;
      margin-bottom: 35rpx;
      img {
        display: block;
        width: 30%;
        height: 100%;
        margin: 0 auto 35rpx;
      }
    }
  }
  .upgrade-card {
    .card {
      width: 100%;
      height: 260rpx;
      box-sizing: border-box;
      img {
        display: block;
        width: 30%;
        height: 100%;
        margin: 0 auto 35rpx;
      }
    }
  }
  .entourage-block {
    .card-list {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      box-sizing: border-box;
      overflow: hidden;
      .card {
        width: 30%;
        height: 260rpx;
        padding: 0 0 8rpx;
        // margin-bottom: 35rpx;
        text-align: center;
        font-size: 24rpx;
        img {
          width: 100%;
          height: 100%;
          // top: 0;
          // left: 0;
          // transform:scale(1.3);
        }
      }
    }
  }
  .hero-tier-detail {
    width: 750rpx;
    overflow: hidden;
    .meta {
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      background-color: #f8f8f8;
      border-radius: 12rpx;
      margin: 0 30rpx 18rpx;
      .meta-panel {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 220rpx;
        height: 135rpx;
        font-size: 26rpx;
        p {
          text-align: center;
        }
        .content {
          margin-top: 10rpx;
          font-size: 34rpx;
          font-weight: bold;
          color: #50616d;
        }
      }
    }
    .chart-text {
      height:54rpx;
      line-height:54rpx;
      font-size:28rpx;
    }
    .charts {
      width: 750rpx;
      height: 300rpx;
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
</style>
