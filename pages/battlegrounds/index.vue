<template>
<div class="container">
  <!-- <NavBar navTitle="酒馆战棋"></NavBar> -->
  <div class="status-bar" :style="{height:barHeight+'px',opacity:statusBarOpacity}"></div>
  <div class="banner">
    <div class="bgs-overview">
      <div class="title">酒馆战棋英雄强度排行</div>
      <div class="meta">
        <div class="bgs-data-panel">
          <p class="label">分&nbsp;&nbsp;段</p>
          <!-- <p class="content">{{mmr_range.desc}}</p> -->
          <p class="content">{{bgsMMRRangeMetaDesc}}</p>
        </div>
        <div class="bgs-data-panel">
          <p class="label">时间范围</p>
          <p class="content">{{time_frame.desc}}</p>
        </div>
        <div class="bgs-data-panel">
          <p class="label">对局数</p>
          <p class="content" v-if="total_games">{{total_games}}</p>
          <p class="content" v-else>N/A</p>
        </div>
      </div>
    </div>
  </div>
  <div class="tier-list">
    <div class="tier-header">
      <div class="hero-name">英&nbsp;&nbsp;雄</div>
      <div class="tier-meta" v-for="(item, index) in tierHeaderMeta" :key="index" @click="handleOrderClick(item)">
        <span>{{item.name}}</span>
        <img v-if="orderBy && orderBy === item.id" :src="upOrder" mode="aspectFit">
        <img v-else-if="orderBy === '-'+item.id" :src="downOrder" mode="aspectFit">
        <img v-else :src="normalOrder" mode="aspectFit">
      </div>
    </div>
    <div class="tier-block" v-for="(item, index) in tierList" :key="index" @click="handlePanelClick(item)">
      <div class="tier-title" v-if="orderBy==='avg_final_placement' && (index === 0 || tierList[index-1].tier !== item.tier)">
        <img :src="tierIcon[item.tier].icon">
        <span class="title">{{tierIcon[item.tier].name}}</span>
        <!-- <p v-if="showListFlag" class="icon iconfont" @click="handleHeaderClick">&#xe602;</p>
        <p v-else class="icon iconfont" @click="handleHeaderClick">&#xe624;</p> -->
      </div>
      <div class="tier-panel">
        <div class="icon">
          <img :src="item.image" mode="aspectFit">
        </div>
        <div class="desc">
          <div class="name">
            <p class="cname">{{item.cname}}</p>
            <p class="ename">{{item.ename}}</p>
          </div>
          <div class="avg">
            <p class="content" :style="{color: item.color}">{{fix2float(item.avg_final_placement)}}</p>
            <div class="table-cell-bar">
              <div class="table-cell-bar__fill" :style="{width:(1-(item.avg_final_placement-1)/8)*120+'rpx', 'background-color': item.color}"></div>
            </div>
          </div>
          <div class="pr">
            <p class="content">{{fix2float(item.pick_rate)}}%</p>
            <div class="table-cell-bar">
              <div class="table-cell-bar__fill" :style="{width:item.pick_rate/100*120+'rpx'}"></div>
            </div>
          </div>
        </div>
        <div class="arrow">
          <span class="iconfont">&#xe600;</span>
        </div>
      </div>
    </div>
  </div>
  <copyRight></copyRight>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import NavBar from '@/components/NavBar'
import { getBattlegroundTierList } from '@/api/dbapi.js'
import { gradientColor, toThousands } from '@/utils/index.js'
import copyRight from '@/components/copyRight'
export default {
  components: {
    NavBar,
    copyRight,
  },
  data() {
    return {
      tierList: [],
      mmr_range: {key: 'TOP_50_PERCENT', desc: '前50%(6,000+)'},
      time_frame: {key: 'LAST_7_DAYS', desc: '最近7天'},
      total_games: '',
      tierItemColorList: [],
      scrollTop: 0,
      tierHeaderMeta: [
        { id: 'avg_final_placement', name: '平均排名' },
        { id: 'pick_rate', name: '选取率' },
      ],
      normalOrder: '/static/icons-v2/rank-normal.png',
      upOrder: '/static/icons-v2/rank-up.png',
      downOrder: '/static/icons-v2/rank-down.png',
      orderBy: 'avg_final_placement',
      tierIcon: {
        'T1': {name: '第1梯队', icon: '/static/icons-v2/tierlist-t1.png'},
        'T2': {name: '第2梯队', icon: '/static/icons-v2/tierlist-t2.png'},
        'T3': {name: '第3梯队', icon: '/static/icons-v2/tierlist-t3.png'},
        'T4': {name: '第4梯队', icon: '/static/icons-v2/tierlist-t4.png'}
      }
    }
  },
  computed: {
    ...mapGetters([
      'ifanrSettings',
      'barHeight'
    ]),
    fix2float() {
      return function(x) {
        return parseFloat(x).toFixed(2)
      }
    },
    tierItemColor() {
      return function(index) {
        return this.tierItemColorList[index]
      }
    },
    statusBarOpacity() {
      return this.scrollTop/(uni.upx2px(425)-this.barHeight)
    },
    bgsMMRRangeMetaDesc() {
      return this.ifanrSettings.bgs_meta_1
    }
  },
  methods: {
    compareFunction(key) {
      return function(obj1, obj2) {
        let formatKey = key.replace('-', '')
        if (key.indexOf('-') !== -1) {
          return obj2[formatKey]-obj1[formatKey]
        } else {
          return obj1[formatKey]-obj2[formatKey]
        }
      }
    },
    sortTableData() {
      if (this.orderBy) {
        this.tierList.sort(this.compareFunction(this.orderBy))
      }
    },
    initTierList() {
      getBattlegroundTierList().then(res => {
        this.tierList = res.objects
        this.total_games = toThousands(this.tierList[0].total_games)
        // let upperColor = gradientColor('#239c15', '#889400', this.tierList.filter(v => {return v.tier === 'T1' || v.tier === 'T2'}).length)
        // let lowerColor = gradientColor('#889400', '#c87979', this.tierList.filter(v => {return v.tier === 'T3' || v.tier === 'T4'}).length)
        let upperColor = gradientColor('#79c879', '#c8c879', this.tierList.filter(v => {return v.tier === 'T1' || v.tier === 'T2'}).length)
        let lowerColor = gradientColor('#c8c879', '#c87979', this.tierList.filter(v => {return v.tier === 'T3' || v.tier === 'T4'}).length)
        this.tierItemColorList = [...upperColor, ...lowerColor]
        for (let index in this.tierList) {
          if (this.tierList.hasOwnProperty(index)) {
            this.tierList[index].color = this.tierItemColorList[index]
          }
        }
        uni.stopPullDownRefresh();
        uni.hideNavigationBarLoading()
      }).catch(err => {
        console.log(err)
        uni.stopPullDownRefresh();
        uni.hideNavigationBarLoading()
      })
    },
    handlePanelClick(item) {
      wx.navigateTo({
        url: `/pages/cards/battlegroundCardDetail/index?id=${item.hero_id}`
      })
    },
    handleOrderClick(item) {
      if (this.orderBy.indexOf(item.id)>=0) {
        this.orderBy = this.orderBy.split('')[0]==='-'?item.id:'-'+item.id
      } else {
        this.orderBy = '-'+item.id
      }
      this.sortTableData()
    }
  },
  mounted() {
    this.initTierList()
  },
  onPageScroll(e) {
    this.scrollTop = e.scrollTop
  },
  onPullDownRefresh() {
    this.initTierList()
  },
  onShareAppMessage(res) {
    return {
      title: '炉石传说情报站',
      path: '/pages/battlegrounds/index'
    }
  },
}
</script>

<style lang="scss" scoped>
.container {
  .status-bar {
    position: fixed;
    width: 100%;
    z-index: 2;
    opacity: 0;
    background-color: white;
  }
  .banner {
    position: relative;
    width: 100%;
    height: 425rpx;
    overflow: hidden;
    background: url("https://cloud-minapp-18282.cloud.ifanrusercontent.com/1kV9x2IudeAPW3EV.jpg") no-repeat 0 -60rpx;
    background-size: 100%;
    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background: linear-gradient(to bottom, rgba(0, 0, 0, .1), rgba(0, 0, 0, .4));
      z-index: 1;
    }
    .bgs-overview {
      position: relative;
      width: 100%;
      height: 100%;
      padding: 145rpx 0 40rpx;
      box-sizing: border-box;
      z-index: 2;
      color: #fff;
      .title {
        position: absolute;
        height: 50rpx;
        line-height: 50rpx;
        font-size: 50rpx;
        font-weight: bold;
        margin-left: 55rpx;
      }
      .meta {
        position: absolute;
        bottom: 50rpx;
        display: flex;
        justify-content: space-between;
        flex-wrap: nowrap;
        width: 100%;
        padding: 0 30rpx;
        box-sizing: border-box;
        .bgs-data-panel {
          width: 172rpx;
          height: 130rpx;
          text-align: center;
          .label {
            margin-top: 21rpx;
            font-size: 26rpx;
          }
          .content {
            font-weight: bold;
            font-size: 32rpx;
          }
        }
        .bgs-data-panel:nth-child(2), .bgs-data-panel:nth-child(3) {
          .content {
            margin-top: 20rpx;
          }
        }
      }
    }
  }
  .tier-list {
    .tier-header {
      display: flex;
      justify-content: space-between;
      font-size: 28rpx;
      height: 70rpx;
      align-items: center;
      border-bottom: 2rpx solid #eee;
      padding-right: 20rpx;
      .hero-name {
        width: 430rpx;
        text-align: center;
      }
      .tier-meta {
        display: flex;
        justify-content: center;
        width: 170rpx;
        height: 100%;
        line-height: 70rpx;
        img {
          width: 22rpx;
          height: 100%;
          margin-left: 5rpx;
        }
      }
    }
    .tier-block {
      .tier-title {
        display: flex;
        align-items: center;
        height: 60rpx;
        margin: 10rpx 30rpx;
        font-size: 28rpx;
        color: #333;
        background-color: #f0f0f0;
        box-sizing: border-box;
        padding-left: 15rpx;
        border-radius: 12rpx;
        .title {
          margin-left: 22rpx;
        }
        img {
          width: 40rpx;
          height: 30rpx;
        }
      }
    }
    .tier-panel {
      position: relative;
      height: 160rpx;
      padding: 0 20rpx;
      background-color: #fff;
      &:active  {
        background-color: #eee;
      }
      .icon {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 140rpx;
        height: 100%;
        img {
          width: 145rpx;
          height: 145rpx;
        }
      }
      .desc {
        position: absolute;
        display: flex;
        justify-content: space-between;
        left: 172rpx;
        width: 558rpx;
        height: 100%;
        border-bottom: 1rpx solid #eee;
        box-sizing: border-box;
        .name {
          display: flex;
          justify-content: center;
          flex-direction: column;
          width: 45%;
          // padding-left: 15rpx;
          .cname {
            width: 215rpx;
            height: 37rpx;
            line-height: 37rpx;
            // font-weight: bold;
            font-size: 30rpx;
            color: #50616D;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
          .ename {
            width: 215rpx;
            height: 30rpx;
            line-height: 30rpx;
            margin-top: 15rpx;
            font-size: 22rpx;
            color: #999;
          }
        }
        .avg, .pr {
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: center;
          width: 170rpx;
          // padding-top: 8rpx;
          .label {
            color: #999;
            font-size: 24rpx;
          }
          .content {
            // padding-top: 15rpx;
            font-size: 28rpx;
            font-weight: bold;
            color: #758a99;
          }
        }
        .avg .table-cell-bar, .pr .table-cell-bar {
          position: relative;
          width: 120rpx;
          height: 26rpx;
          border-radius: 6rpx;
          margin-top: 15rpx;
          background-color: #eee;
          .table-cell-bar__fill {
            position: absolute;
            height: 100%;
            left: 0;
            top: 0;
            border-radius: 6rpx;
          }
        }
        .pr .table-cell-bar .table-cell-bar__fill {
          background-color: #758a99;
        }
      }
      .arrow {
        position: absolute;
        width: 20rpx;
        height: 100%;
        text-align: right;
        right: 13rpx;
        .iconfont {
          line-height: 160rpx;
          color: #999;
        }
      }
    }
  }
}
</style>
