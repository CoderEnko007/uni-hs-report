<template>
  <div class="container">
    <nav-bar></nav-bar>
    <div class="tab-container">
      <div class="swiper-block">
        <div class="notice-bar" v-show="noticeContent.display">
          <cmd-notice-bar scrollable :text="noticeText.text" mode="close" @click="handleNoticeClick"></cmd-notice-bar>
        </div>
        <SwiperBanner :banners="banners" :date="report_date" @swiperClick="handleBannerClick" v-if="banners"></SwiperBanner>
      </div>
      <div class="rank-panel">
        <div class="headline">
          <span class="title">职业排名</span>
          <div class="game-type-picker">
            <img class="btn-img" :src="rankMode[gameTypePicker.selectedItem].active_icon" mode="aspectFit">
            <picker class="mode-picker" mode="selector" :value="gameTypePicker.selectedItem" :range="gameTypePickerList" @change="handleGameTypeChange">
              <span class='selector-item'>{{gameTypePicker.list[gameTypePicker.selectedItem].text}}</span>
              <span class="iconfont" :style="{'vertical-align': 'middle'}">&#xe668;</span>
            </picker>
          </div>
        </div>
        <div class="content">
          <RankBoard :list="rankData[selectedGameType]" :mode="modeFilter.list[modeFilter.selectedItem].value"></RankBoard>
        </div>
        <div class="extra-btn" v-if="showBtn">
          <div class="data-vision" @click="handleHSVisionClick">
            <img class="btn-img" src="/static/icons-v2/trending.png" mode="aspectFit">
            <span class="text">强度趋势</span>
            <!-- <span class="iconfont">&#xe600;</span> -->
          </div>
          <div class="data-vision" @click="handleTrendingClick">
            <img src="/static/icons-v2/trending1.png" class="btn-img" mode="aspectFit">
            <span class="text">热门卡组</span>
            <!-- <span class="iconfont">&#xe600;</span> -->
          </div>
          <div class="data-vision" @click="handleRevealClick" v-if="newCardBtnIcon">
            <img class="btn-img" :src="newCardBtnIcon" style="width:42rpx" mode="aspectFit">
            <span class="text">新卡发布</span>
            <!-- <span class="iconfont">&#xe600;</span> -->
          </div>
        </div>
      </div>
      <div class="ads" style="margin: 15upx 0 0 0;" v-if="adsOpenFlag&&adsType!=='video'">
        <ad unit-id="adunit-900bbac5f4c50939" @error="handleAdError" @load="handleBannerAdLoaded"></ad>
      </div>
      <div class="video-ads" style="margin: 20rpx 30rpx 0;" v-if="adsOpenFlag&&adsType==='video'">
        <ad unit-id="adunit-03a8570563bafc46" ad-type="video" ad-theme="white" @error="handleAdError" @load="handleVideoAdLoaded"></ad>
      </div>
      <div class="tier-panel">
        <div class="headline">
          <span class="title">梯队排行</span>
          <div class="head-picker">
            <picker mode="selector" :value="rangePicker.selectedItem" :range="rangePickerList" @change="handleRankRangeChange">
              <span class='selector-item'>标准模式 {{rangePicker.list[rangePicker.selectedItem].text}}</span>
              <span class="iconfont" :style="{'vertical-align': 'middle'}">&#xe668;</span>
            </picker>
          </div>
          <div class="head-btn" @click="handleExport">
            <span class="icon iconfont">&#xe69c;&nbsp;</span>
            <span>导出日报</span>
          </div>
        </div>
        <div class="tier-content">
          <div class="tier-block" v-for="(tier, index) in tierList" :key="tier.name">
            <TierList :tierData="tier" @itemClick="handleTierClick" @onCollapse="handleCollapse"></TierList>
          </div>
        </div>
      </div>
      <copyRight></copyRight>
    </div> 
    <x-modal :text='noticeText.text' :no-cancel='true' :no-title='true' confirm-text='朕知道了' :hidden.sync='hideModal'></x-modal>
    <div style="position: fixed; top: 9999999999999px; overflow: hidden">
        <canvas :style="{width: canvasWidth+'px', height: canvasHeight+'px'}" canvas-id="dailyReport"></canvas>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import utils from '@/utils'
  import { gradientColor, formatNowTime, ShadeColor } from '@/utils'
  import { getRankData, getArchetypeList, getBanners, getNotice, getSetting } from '@/api/dbapi.js'
  import NavBar from '@/components/NavBar.vue'
  import SwiperBanner from '@/components/SwiperBanner.vue'
  import cmdNoticeBar from "@/components/cmd-notice-bar/cmd-notice-bar.vue"
  import xModal from "@/components/x-modal/x-modal.vue"
  import RankBoard from '@/components/RankBoard'
  import TierList from '@/components/TierList'
  import copyRight from '@/components/copyRight'
  import FuckupBtn from '@/components/FuckupBtn'

  export default {
    components: {
      NavBar,
      SwiperBanner,
      cmdNoticeBar,
      xModal,
      RankBoard,
      TierList,
      copyRight,
      FuckupBtn
    },
    data() {
      return {
        hideModal: true,
        refreshFlag: 0,
        banners: [],
        report_date: '',
        noticeText: {
          text: '',
          animationData: []
        },
        // rank list参数
        rankMode: utils.gameMode,
        origRankList: [],
        rankData: {
          'standard': [],
          'wild': [],
          'arena': [],
          'classic': [],
          'duels': [],
          'twist': []
        },
        modeFilter: {
          selectedItem: 0,
          list: [
            {text: '按胜率', value: 'win_rate'},
            {text: '按热度', value: 'popularity'}
          ]
        },
        selectedGameType: 'standard',
        // tier list参数
        tierList: [
          {name: 'Tier 1', cname: '第1梯队', icon: '/static/icons-v2/tierlist-t1.png', list: []},
          {name: 'Tier 2', cname: '第2梯队', icon: '/static/icons-v2/tierlist-t2.png', list: []},
          {name: 'Tier 3', cname: '第3梯队', icon: '/static/icons-v2/tierlist-t3.png', list: []},
          {name: 'Tier 4', cname: '第4梯队', icon: '/static/icons-v2/tierlist-t4.png', list: []},
        ],
        tierListNum: 0,
        rangePicker: {
          selectedItem: 0,
          list: [
            {text: '青铜-黄金', rank_range: 'BRONZE_THROUGH_GOLD'},
            {text: '钻石-传说', rank_range: 'DIAMOND_THROUGH_LEGEND'},
            {text: '钻石4-钻石1', rank_range: 'DIAMOND_FOUR_THROUGH_DIAMOND_ONE'},
            {text: '传说分段', rank_range: 'LEGEND'},
            {text: '传说Top1000', rank_range: 'TOP_1000_LEGEND'}
          ]
        },
        gameTypePicker: {
          selectedItem: 0,
          list: [
            {text: '标准模式', value: 'standard'},
            {text: '狂野模式', value: 'wild'},
            {text: '竞技场', value: 'arena'},
          ]
        },
        tempSelectedItem: 0,
        // canvas参数
        canvasWidth: 375,
        canvasHeight: 200,
        adHeight: 160,
        collapseHeight: 0,
        videoAd: null,
        adsType: 'video',
        showBtn: false,
        newCardBtnIcon: null,
      }
    },
    computed: {
      ...mapGetters([
        'adsOpenFlag',
        'winWidth',
        'winHeight',
        'navHeight',
        'noticeContent',
        'decksName',
        'barHeight',
        'ifanrSettings',
        'user_fuck_up_flag'
      ]),
      modePickerList() {
        return this.modeFilter.list.map(item => {
          return item.text
        })
      },
      rangePickerList() {
        return this.rangePicker.list.map(item => {
          return item.text
        })
      },
      gameTypePickerList() {
        return this.gameTypePicker.list.map(item => {
          return item.text
        })  
      },
    },
    methods: {
      async getIfanrSettings() {
        let res = await getSetting()
        this.adsType = res.objects[0].main_ads_type
        this.newCardBtnIcon = res.objects[0].new_package_icon ? res.objects[0].new_package_icon : null
		// this.newCardBtnIcon = 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1lKcWqGQxdLP5RJL.png'
        this.showBtn = true
      },
      async initVideoAds() {
        if (wx.createRewardedVideoAd) {
          this.videoAd = wx.createRewardedVideoAd({
            adUnitId: 'adunit-6c39abb54de729f4'
          })
          this.videoAd.onClose(async (status) => {
            console.log('激励视频关闭', status)
            if (status && status.isEnded || status === undefined) {
              let now = new Date()
              try {
                wx.setStorageSync('ads_video_date', new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()/1000)
              } catch (e) {
                console.log(e)
              }
              this.rangePicker.selectedItem = this.tempSelectedItem
              this.genArchetypeList()
            } else {
              wx.showToast({
                title: '没有完整播放视频哦，喵。。。',
                icon: 'none',
                duration: 2500
              })
            }
          })
          this.videoAd.onError((res) => {
            console.log('激励视频错误', res)
            this.rangePicker.selectedItem = this.tempSelectedItem
            this.genArchetypeList()
            wx.showToast({
              title: '出了点小问题，无法播放激励视频',
              icon: 'none',
              duration: 2500
            })
          })
        }f
      },
      async playVideoAds(index) {
        this.tempSelectedItem = index
        let videoAdUseable = true //wx.canIUse('createRewardedVideoAd')
        if (videoAdUseable) {
          if (this.videoAd) {
            this.videoAd.show().catch(() => {
              // 失败重试
              this.videoAd.load()
                .then(() => videoAd.show())
                .catch(err => {
                  console.log('激励视频 广告显示失败')
                  this.rangePicker.selectedItem = this.tempSelectedItem
                  this.genArchetypeList()
                })
            })
          }
        } else {
          wx.showToast({
            title: '微信版本过低，无法播放激励视频',
            icon: 'none',
            duration: 2500
          })
          this.rangePicker.selectedItem = this.tempSelectedItem
          this.genArchetypeList()
        }
      },
      handleAdError(e) {
        console.log('ad error', e)
        this.adHeight = 40
      },
      handleBannerAdLoaded(e) {
        console.log('banner ad loaded', e)
        this.adHeight = 140
      },
      handleVideoAdLoaded(e) {
        console.log('ad loaded', e)
        this.adHeight = 267
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
      initRankDataArray() {
        this.rankData = {
          'standard': [],
          'wild': [],
          'classic': [],
          'arena': [],
          'duels': [],
          'twist': []
        }
      },
      sortRankData(data) {
        for (let index in this.rankData) {
          if (this.rankData.hasOwnProperty(index)) {
            this.rankData[index] = data.filter(item => {
              return item.game_type.toLowerCase() === index.toLowerCase()
            })
            if (this.modeFilter.list[this.modeFilter.selectedItem].value === 'win_rate') {
              this.rankData[index].sort(this.compareFunction('-win_rate'))
            } else if (this.modeFilter.list[this.modeFilter.selectedItem].value === 'popularity') {
              this.rankData[index].sort(this.compareFunction('-popularity'))
            }
            this.rankData[index].map(val => {
              val.win_rate = parseFloat(val.win_rate).toFixed(1)
              val.popularity = parseFloat(val.popularity).toFixed(1)
            })
            // if (this.rankData[index].length % 10) {
            //   this.rankData[index].push({})
            // }
            while(this.rankData[index].length<12) {
              this.rankData[index].push({})
            }
          }
        }
      },
      stopPullDown(success) {
        if (success) {
          this.refreshFlag += 1;
          if (this.refreshFlag >= 2) {
            uni.stopPullDownRefresh();
            uni.hideNavigationBarLoading()
          }
        } else {
          uni.stopPullDownRefresh();
          uni.hideNavigationBarLoading()
        }
      },
      genBanners() {
        getBanners().then(res => {
          this.banners = res.objects
          this.stopPullDown(true)
        }).catch(err => {
          this.stopPullDown(false)
          console.log(err)
        })
      },
      genNotice() {
        if (this.noticeContent.hasOwnProperty('content') && this.noticeContent.content.length > 0) {
          this.noticeText.text = this.noticeContent.content
        } else {
          this.$store.dispatch('getNotice').then(res => {
            this.noticeText.text = res?res.content:null
          })
        }
      },
      genRankData() {
        let date = formatNowTime(new Date())
        getRankData(date, null, 100).then(res => {
          this.initRankDataArray()
          this.report_date = res.date
          this.origRankList = res.list
          this.sortRankData(this.origRankList)
          this.stopPullDown(true)
        }).catch(err => {
          this.stopPullDown(false)
          console.log(err)
        })
      },
      genArchetypeList() {
        this.tierListNum = 0
        let params = {rankRange: this.rangePicker.list[this.rangePicker.selectedItem].rank_range}
        getArchetypeList(params).then(res => {
          this.tierListNum = res.objects.length
          for (let index in this.tierList) {
            if (this.tierList.hasOwnProperty(index)) {
              this.tierList[index].list = res.objects.filter(item => {
                return item.tier === this.tierList[index].name
              })
            }
          }
          this.stopPullDown(true)
        }).catch(err => {
          console.log(err)
          this.stopPullDown(false)
        })
      },
      getSystemSetting() {
      	this.$store.dispatch('setSystemSetting').then(res => {
      		// console.log('setSystemSetting', res)
      	})
      },
      handleNoticeClick() {
        this.hideModal = false
      },
      handleModeChange(e) {
        this.modeFilter.selectedItem = e.mp.detail.value
        this.sortRankData(this.origRankList)
      },
      modeBtnClick(item) {
        this.selectedGameType = item.mode
      },
      handleRankRangeChange(e) {
        //console.log('aaaaa',e.mp.detail.value, this.rangePicker.selectedItem,this.adsOpenFlag)
        if (e.mp.detail.value!=='0' && e.mp.detail.value!==this.rangePicker.selectedItem && this.adsOpenFlag) {
          try {
            let value = wx.getStorageSync('ads_video_date')
            let now = new Date()
            let today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()/1000
            if (today === value) {
              // Do something with return value
              this.rangePicker.selectedItem = e.mp.detail.value
              this.genArchetypeList()
            } else {
              wx.showModal({
                title: '提示',
                content: '播放完整激励视频即可解锁该功能, 限当日。（默认会播放声音，建议降低手机音量）',
                success: res => {
                  if (res.confirm) {
                    this.playVideoAds(e.mp.detail.value)
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            }
          } catch (e) {
            // Do something when catch error
            this.rangePicker.selectedItem = e.mp.detail.value
            this.genArchetypeList()
          }
        } else {
          this.rangePicker.selectedItem = e.mp.detail.value
          this.genArchetypeList()
        }
      },
      handleGameTypeChange(e) {
        let selected_index = e.mp.detail.value
        this.gameTypePicker.selectedItem = selected_index
        this.selectedGameType = this.gameTypePicker.list[selected_index].value
      },
      handleHSVisionClick() {
        wx.navigateToMiniProgram({
          appId: 'wx010ca9734f850748',
          path: `/pages/rank/main`,
          success(res) {
            // 打开成功
            console.log(res)
          }
        })
      },
      handleTrendingClick() {
        uni.navigateTo({
          url: `/pages/trending/index`
        })
      },
      handleRevealClick() {
        uni.navigateTo({
          url: `/pages/index/revealPage/index`
        })
      },
      handleHSVisionTierClick() {
        wx.navigateToMiniProgram({
          appId: 'wx010ca9734f850748',
          path: `/pages/structure/main`,
          success(res) {
            // 打开成功
            console.log(res)
          }
        })
      },
      handleExport() {
        console.log('handleExport')
        uni.showLoading({
          title: '日报生成中',
          mask: true
        })
        this.saveImageToPhotos()
      },
      handleTierClick(item) {
        uni.navigateTo({
          url: `/pages/decks/archetypeDetail/index?name=${item.archetype_name}`
        })
      },
      handleCollapse(obj) {
        if (!obj.show) {
          this.collapseHeight += obj.num*60
        } else {
          this.collapseHeight -= obj.num*60
        }
      },
      // handleFuckup() {
      //   this.$store.commit('setFuckupFlag', true)
      //   console.log('bbbb', this.ifanrSettings.fuck_up_flag,  this.user_fuck_up_flag)
      // },

      // canvas 绘图
      saveImageToPhotos () {
        let _this = this
        // 相册授权
        uni.getSetting({
          success(res) {
            // 进行授权检测，未授权则进行弹层授权
            if (!res.authSetting['scope.writePhotosAlbum']) {
              uni.authorize({
                scope: 'scope.writePhotosAlbum',
                success () {
                  _this.drawRankCanvas()
                },
                fail() {
                  uni.hideLoading()
                  uni.showModal({
                    content: '您尚未打开相册使用权限，是否去设置打开？',
                    confirmColor: '#433e88',
                    success (res) {
                      if (res.confirm) {
                        uni.openSetting({
                          success(res) {
                            console.log(res.authSetting)
                          }
                        })
                      }
                    }
                  })
                }
              })
            } else {
              // 已授权则直接进行保存图片
              console.log('PhotosAlbum已授权')
              _this.drawRankCanvas()
            }
          },
          fail(res) {
            uni.hideLoading()
            uni.showToast({
              title: '图片保存失败',
              icon: 'none',
              duration: 2000
            })
          }
        })
      },
      drawRankCanvas() {
        let ctx = uni.createCanvasContext('dailyReport')
        let canvasMargin = 0
        this.canvasWidth = 300+canvasMargin
        this.canvasHeight = 720
        let headHeight = 120
        ctx.setFillStyle('#fff')
        ctx.fillRect(0, 0, this.canvasWidth, 3*this.canvasHeight)
        ctx.save()
        ctx.setFillStyle('#fff')
        ctx.fillRect(0, 0, this.canvasWidth, headHeight)
        ctx.restore()
        ctx.save()
        ctx.font = 'normal bold 12px sans-serif';
        ctx.setFillStyle('#433e88')
        ctx.textAlign = 'center'
        ctx.fillText('微信小程序：HS石炉之家', this.canvasWidth/2, 20)
        ctx.setFillStyle('#000')
        ctx.font = 'normal bold 16px sans-serif';
        ctx.fillText('卡组强度排行', this.canvasWidth/2, 45)
        ctx.restore()
        ctx.save()
        let rankRange = this.rangePicker.list[this.rangePicker.selectedItem].text
        ctx.setFillStyle('#000')
        ctx.font = 'normal normal 12px sans-serif';
        ctx.textAlign = 'left'
        ctx.fillText('分段：', canvasMargin+30, 70)
        ctx.font = 'normal bold 13px sans-serif';
        ctx.setFillStyle('red')
        ctx.fillText(rankRange, canvasMargin+65, 70)
        ctx.restore()
        ctx.save()
        ctx.font = 'normal normal 12px sans-serif';
        ctx.setFillStyle('#000')
        ctx.textAlign = 'right'
        let date = new Date()
        ctx.fillText('时间：'+utils.formatNowTime(date), this.canvasWidth-canvasMargin-30, 70)
        ctx.restore()

        ctx.textAlign = 'center'
        ctx.font = 'normal normal 13px sans-serif';
        let colWidth = (this.canvasWidth-10-canvasMargin*2)/4
        ctx.save()
        ctx.setFillStyle('#B5B5B5')
        ctx.fillRect(2, 80, colWidth, 23)
        ctx.fillRect(4+colWidth, 80, colWidth, 23)
        ctx.fillRect(6+colWidth*2, 80, colWidth, 23)
        ctx.fillRect(8+colWidth*3, 80, colWidth, 23)
        ctx.setFillStyle('#000')
        ctx.fillText('强 度', colWidth/2+canvasMargin+2, 96)
        ctx.fillText('卡 组', colWidth+colWidth/2+canvasMargin+4, 96)
        ctx.fillText('胜 率', colWidth*2+colWidth/2+canvasMargin+6, 96)
        ctx.fillText('热 度', colWidth*3+colWidth/2+canvasMargin+8, 96)
        ctx.restore()

        let rankPower = [
          {name: '第1梯队', height:0, num: 0},
          {name: '第2梯队', height:0, num: 0},
          {name: '第3梯队', height:0, num: 0},
          {name: '第4梯队', height:0, num: 0},
        ]
        let factionColor = {'Druid': '#EE7B20', 'Hunter': '#9bbb56', 'Mage': '#6AC8EC', 'Paladin': '#EF8BB7', 'Priest': '#e5e5e5', 
                            'Rogue': '#ffff01', 'Shaman': '#246CB4', 'Warlock': '#9283BC', 'Warrior': '#C79C6F', 'DemonHunter': '#16debc',
                            'DeathKnight': '#C41F3B'}
        let listHeight = 0
        let itemHeight = 25
        let winrateGColor = gradientColor('#239c15', '#297607', this.tierList[0].list.length+this.tierList[1].list.length)
        let winrateRColor = gradientColor('#889400', '#ff5630', this.tierList[2].list.length+this.tierList[3].list.length)
        let winrateColor = [...winrateGColor, ...winrateRColor]
        let itemNums = 0
        for (let tierIndex in this.tierList) {
          if (this.tierList.hasOwnProperty(tierIndex)) {
            if (tierIndex === '__proto__') {
              continue
            }
            rankPower[tierIndex].height=this.tierList[tierIndex].list.length*itemHeight // 每个梯队后面加1px的分割线
            rankPower[tierIndex].num = this.tierList[tierIndex].list.length
            let prevTierHeight = 0
            if (tierIndex > 0) {
              prevTierHeight =  listHeight
            }
            listHeight += rankPower[tierIndex].height
            ctx.save()
            if (tierIndex%2) {
              ctx.setFillStyle('#DCDEDD')
            } else {
              ctx.setFillStyle('#FFFFFF')
            }
            ctx.fillRect(canvasMargin+2, headHeight+prevTierHeight-17+2, colWidth, rankPower[tierIndex].height-2)
            ctx.restore()
            ctx.save()
            ctx.font = 'normal bold 12px sans-serif'
            ctx.setFillStyle('#34383b')
            ctx.fillText(rankPower[tierIndex].name, colWidth/2+canvasMargin+2, headHeight+prevTierHeight)
            ctx.restore()
            let list = this.tierList[tierIndex].list
            for (let itemIndex in list) {
              if (list.hasOwnProperty(itemIndex)) {
                if (itemIndex === '__proto__') {
                  continue
                }
                ctx.save()
                ctx.setFillStyle(factionColor[list[itemIndex].faction])
                ctx.fillRect(canvasMargin+colWidth+4, headHeight+prevTierHeight+itemIndex*itemHeight-17+2, colWidth, itemHeight-2)
                ctx.setFillStyle('#000')
                ctx.font = 'normal bold 12px sans-serif'
                let filterDeck = this.decksName.filter(v => {
                  return v.ename === list[itemIndex].archetype_name
                })
                let cname = filterDeck.length>0?filterDeck[0].cname:list[itemIndex].archetype_name
                ctx.fillText(cname, colWidth/2+canvasMargin+colWidth+4, headHeight+prevTierHeight+itemIndex*itemHeight+1)
                ctx.restore()
                ctx.save()
                if (itemNums%2 === 0) {
                  ctx.setFillStyle('#fff')
                } else {
                  ctx.setFillStyle('#DCDEDD')
                }
                ctx.fillRect(canvasMargin+2*colWidth+6, headHeight+prevTierHeight+itemIndex*itemHeight-17+2, colWidth, itemHeight-2)
                ctx.fillRect(canvasMargin+3*colWidth+8, headHeight+prevTierHeight+itemIndex*itemHeight-17+2, colWidth, itemHeight-2)
                ctx.restore()
                ctx.save()
                ctx.font = 'normal bold 12px sans-serif'
                ctx.setFillStyle(winrateColor[itemNums++])
                ctx.fillText(list[itemIndex].win_rate+'%', colWidth/2+canvasMargin+colWidth*2+6, headHeight+prevTierHeight+itemIndex*itemHeight+1)
                ctx.restore()
                ctx.save()
                ctx.font = 'normal bold 12px sans-serif'
                ctx.setFillStyle('#000')
                if (list[itemIndex].popularity1) {
                  ctx.fillText(list[itemIndex].popularity1.toFixed(1)+'%', colWidth/2+canvasMargin+colWidth*3+8, headHeight+prevTierHeight+itemIndex*itemHeight+1)
                } else {
                  ctx.fillText('暂无', colWidth/2+canvasMargin+colWidth*3+8, headHeight+prevTierHeight+itemIndex*itemHeight+1)
                }
                ctx.restore()
              }
            }
            // ctx.save()
            // ctx.setStrokeStyle('#fff')
            // ctx.moveTo(canvasMargin+2, headHeight+prevTierHeight-17)
            // ctx.lineTo(this.canvasWidth-canvasMargin, headHeight+prevTierHeight-17)
            // ctx.stroke()
            // ctx.restore()
          }
        }
        ctx.setStrokeStyle('#fff')
        ctx.moveTo(canvasMargin, headHeight+listHeight-17)
        ctx.lineTo(this.canvasWidth-canvasMargin, headHeight+listHeight-17)
        ctx.stroke()
        ctx.save()
        ctx.setFillStyle('#fff')
        ctx.fillRect(0, headHeight+listHeight-17, this.canvasWidth, 30)
        ctx.setFillStyle('#433e88')
        ctx.font = 'normal bold 12px sans-serif';
        ctx.textAlign = 'right'
        ctx.fillText('数据源：HSReplay', this.canvasWidth-canvasMargin-10, headHeight+listHeight)
        ctx.restore()
        this.canvasHeight = headHeight+listHeight+10

        let _this = this
        ctx.draw(false, function(e) {
          setTimeout(function() {
            _this.saveCanvasImg()
          }, 1000)
        })
      },
      saveCanvasImg() {
        let pages = getCurrentPages();
        if (pages[pages.length-1].route !== 'pages/index/index') {
          return
        }
        let destWidth = this.canvasWidth//375 * 750 / uni.getSystemInfoSync().windowWidth
        let destHeight = this.canvasHeight//(this.canvasHeight * 375 / this.canvasWidth) * 750 / uni.getSystemInfoSync().windowWidth
        // let destWidth = 375 * 750 / wx.getSystemInfoSync().windowWidth
        // let destHeight = (this.canvasHeight * 375 / this.canvasWidth) * 750 / wx.getSystemInfoSync().windowWidth
        uni.canvasToTempFilePath({
          canvasId: 'dailyReport',
          destWidth: 3*destWidth,
          destHeight: 3*destHeight,
          fileType: 'jpg',
          quality: 1,
          success(res) {
            uni.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success(res) {
                uni.hideLoading()
                uni.showToast({
                  title: '图片已保存到相簿',
                  duration: 2000
                })
              },
              fail(err) {
                uni.hideLoading()
                uni.showToast({
                  title: '图片保存失败',
                  icon: 'none',
                  duration: 2000
                })
              }
            })
          },
          fail(err) {
            console.log('error', err)
            uni.hideLoading()
            uni.showToast({
              title: '图片生成失败',
              icon: 'none',
              duration: 2000
            })
          }
        })
      },
    },
    onLoad() {
      wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
      })
      this.getIfanrSettings()
      this.genBanners()
      this.genRankData()
      this.genArchetypeList()
      this.genNotice()
      this.initVideoAds()
    },
    onPullDownRefresh() {
      this.getSystemSetting()
      this.getIfanrSettings()
      this.genBanners()
      this.genRankData()
      this.genArchetypeList()
      this.genNotice()
      this.$store.dispatch('getDecksName')
    },
    onShareAppMessage(res) {
      return {
        title: '炉石传说情报站',
        path: '/pages/index/index'
      }
    },
    onShareTimeline(res) {
      return {
        title: '炉石传说情报站',
        path: '/pages/index/index'
      }
    }
  }
</script>

<style scoped lang="scss">
@import '../../style/color';
.container {
  .panel-tab {
    position: fixed;
    width: 100%;
    height: 70rpx;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-around;
    background-color: #fff;
    border-bottom: 1rpx solid #eee;
    z-index: 2;
    .tab-item {
      position: relative;
      height: 100%;
      width: 232rpx;
      line-height: 70rpx;
      font-size: 30rpx;
      color: #666;
      text-align: center;
      &:after {
        display: none;
        content: '';
        position: absolute;
        width: 53rpx;
        height: 4rpx;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        background-color: $palette-blue;
      }
    }
    .tab-item-active {
      color: $palette-blue;
      font-weight: bold;
      &:after {
        display: block;
        animation: tabBottomIn .4s;
      }
    }
  }
  .tab-container {
    // margin-top: 85rpx;
    width: 100%;
    z-index: 1;
    .swiper-block {
      position: relative;
      // margin: 0 30rpx;
      // .notice-bar {
      //   border-radius: 15rpx 15rpx 0 0;
      // }
    }
  }
  .rank-panel {
    width: 100%;
    box-sizing: border-box;
    padding: 0 30rpx;
    .headline {
	  position: relative;
      height: 96rpx;
	  .game-type-picker {
		  position: absolute;
		  height: 100%;
		  width: 160rpx;
		  right: 0;
		  display: inline-block;
		  font-size: 24rpx;
		  color: #433e88;
		  .btn-img {
			  position: absolute;
			  top: 50%;
			  width: 32rpx;
			  height: 32rpx;
			  transform: translateY(-50%);
		  }
		  .mode-picker {
			  float: right;
			  width: 120rpx;
			  .selector-item {
				  text-align: justify;
				  text-align-last: justify;
				  display: inline-block;
				  width: 96rpx;
				  white-space: nowrap;
			  }
		  }
	  }
      .mode-filter {
        display: inline-block;
        height: 24rpx;
        line-height: 24rpx;
        margin-left: 16rpx;
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
        align-items: center;
        flex-wrap: nowrap;
        .btn-block {
          position: relative;
          height: 100%;
          display: flex;
          justify-content: space-between;
          flex-wrap: nowrap;
          .btn-img {
            position: absolute;
            width: 32rpx;
            height: 32rpx;
            top: 50%;
            transform: translateY(-50%);
          }
          .c-button {
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
            line-height: 96rpx;
            text-align: center;
            font-size: 28rpx;
            color: #EEEEEE;
          }
        }
      }
    }
  }
  .tier-panel {
    padding: 20rpx 0;
    .headline {
      padding: 0 30rpx;
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
  }
  .extra-btn {
    display: flex;
    justify-content: space-between;
  }
  .data-vision {
   position: relative;
   width: 100%;
   margin: 10px 10rpx 0;
   background: #FAFAFA;
   line-height: 90rpx;
   border-radius: 24rpx;
   img {
     position: absolute;
     top: 50%;
     transform: translateY(-50%);
     margin-left: 10rpx;
     width: 52rpx;
     height: 52rpx;
   }
   .text {
     font-size: 32rpx;
     margin-left: 68rpx;
   }
   .iconfont {
     position: absolute;
     top: 50%;
     transform: translateY(-50%);
     right: 20rpx;
   }
  }
}
.head-btn {
  position: absolute;
  top: 50%;
  right: 55rpx;
  transform: translateY(-50%);
  line-height: 60rpx;
  font-size: 24rpx;
  color: $palette-blue;
}
@keyframes tabBottomIn {
  from {
    width: 100%;
    opacity: 0
  }

  to {
    width: 53rpx;
    opacity: 1
  }
}
</style>
