<template>
  <div class="container">
    <div class="tier-header">
      <div class="tier-title">
        <div class="title-block">
          <img :src="tierData.icon">
          <span class="title">{{tierData.cname}}</span>
          <p v-if="showListFlag" class="icon iconfont" @click="handleHeaderClick">&#xe602;</p>
          <p v-else class="icon iconfont" @click="handleHeaderClick">&#xe624;</p>
        </div>
      </div>
    </div>
    <div class="tier-block" :style="{'margin-top': showListFlag?'0':'-'+listHeight*2+'rpx'}">
      <div class="tier-item"
           v-for="item in genTierList" :key="item.id"
           @click="handleItemClick(item)">
        <div class="icon">
          <img :src="item.image" mode="aspectFit">
        </div>
        <div class="tier-desc">
          <div class="desc-left">
            <p class="name">{{item.cname}}</p>
            <p class="desc-meta" v-if="item.game_count">对局数 {{item.game_count}}</p>
            <p class="desc-meta" v-else>{{item.archetype_name}}</p>
          </div>
          <div class="desc-right">
            <p class="name">胜率</p>
            <p class="desc-meta color-green" :class="{'color-red': item.win_rate<50}">{{item.win_rate}}%</p>
          </div>
          <span class="iconfont">&#xe600;</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import utils from '@/utils'
export default {
  name: 'TierList',
  props: ['tierData'],
  data() {
    return {
      bgImage: 'https://art.hearthstonejson.com/v1/256x/HERO_04b.jpg',
      showListFlag: true,
    }
  },
  computed: {
    listHeight() {
      return this.tierData.list.length*60
    },
    genTierList() {
      let val = this.tierData
      let deckName = this.$store.state.cards.decksName
      for (let index in val.list) {
        if(val.list.hasOwnProperty(index)) {
          let deck = deckName.filter(deck => {
            return deck.ename === val.list[index].archetype_name
          })[0]
          if(deck && deck.cname) {
            val.list[index].cname = deck.cname
          } else {
            val.list[index].cname = val.list[index].archetype_name
          }
          if (val.list[index].faction) {
            val.list[index].image = utils.faction[val.list[index].faction].image
            val.list[index].bgImage = utils.faction[val.list[index].faction].bgImage
          }
          val.list[index].game_count = utils.toThousands(val.list[index].game_count)
        }
      }
      return this.tierData.list
    },
    showList() {
      return this.showListFlag
    }
  },
  methods: {
    handleItemClick(item) {
      this.$emit('itemClick', item)
    },
    handleHeaderClick() {
      this.showListFlag = !this.showListFlag
      this.$emit('onCollapse', {show: this.showListFlag, num:this.tierData.list.length})
    }
  },
}
</script>
<style lang="scss" scoped>
@import '../style/color';
.container {
  overflow: hidden;
  .tier-header {
    position: relative;
    width: 100%;
    height: 80rpx;
    overflow: hidden;
    background:white;
    z-index:1;
    .tier-title {
      position: absolute;
      width: 100%;
      height: 100%;
      line-height: 80rpx;
      .title-block {
        padding:0 30rpx;
        font-size: 28rpx;
        font-weight: 700;
        color: #333;
        .title {
          margin-left: 52rpx;
        }
      }
      .icon {
        width:80rpx;
        text-align:center;
        float: right;
        font-size: 40rpx;
        font-weight:100;
        color: #999;
      }
      img {
        position:absolute;
        width: 40rpx;
        height: 30rpx;
        top:50%;
        transform:translateY(-50%);
      }
    }
  }
  .tier-block {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    width: 100%;
    /*padding:0 30rpx;*/
    box-sizing:border-box;
    transition: all .3s ease-in;
    .tier-item {
      position: relative;
      width: 100%;
      height: 120rpx;
      line-height: 120rpx;
      font-size: 28rpx;
      background: #fff;
      padding:0 30rpx;
      &:active  {
        background: #eee;
      }
      .icon {
        position: relative;
        float: left;
        width: 70rpx;
        height: 100%;
        img {
          position: absolute;
          width: 70rpx;
          height: 70rpx;
          top: 50%;
          transform: translateY(-50%);
        }
      }
      .tier-desc {
        position: relative;
        height: 100%;
        margin-left: 90rpx;
        border-bottom: 1rpx solid #eee;
        box-sizing:border-box;
        .desc-left {
          position:absolute;
          top:50%;
          transform:translateY(-50%);
          .name {
            height: 37rpx;
            line-height: 37rpx;
            font-size: 26rpx;
            color: #333;
          }
          .single-name {
            font-size: 26rpx;
            color: #333;
          }
          .desc-meta {
            height: 30rpx;
            line-height: 30rpx;
            margin-top: 4rpx;
            font-size: 22rpx;
            color: #999;
          }
        }
        .desc-right {
          position:absolute;
          top:50%;
          right:40rpx;
          transform:translateY(-50%);
          text-align: right;
          .name {
            height: 22rpx;
            line-height: 22rpx;
            font-size: 22rpx;
            color: #999;
          }
          .desc-meta {
            height: 32rpx;
            line-height: 32rpx;
            margin-top: 10rpx;
            font-size: 28rpx;
            font-weight: bold;
            /*color: #333;*/
          }
        }
      }
      .iconfont {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        color: #999;
        font-size: 28rpx;
      }
    }
  }
}
</style>
