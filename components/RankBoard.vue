<template>
  <div class="rank-board" v-if="list.length">
    <div class="faction-block" v-for="(item, index) in list" :key="item.id">
      <div class="number" v-if="item.faction"><span>{{index+1}}</span></div>
      <img :src="item.faction?factions[item.faction].image:''">
      <div class="faction"><span>{{item.faction?factions[item.faction].name:''}}</span></div>
      <div class="data-rate" v-if="mode==='win_rate'">
        <span :class="{'color-green': item.win_rate>=50, 'color-red': item.win_rate<50}" v-if="item.win_rate">{{item.win_rate}}%</span>
      </div>
      <div class="data-rate" v-if="mode==='popularity'">
        <span v-if="item.popularity">{{item.popularity}}%</span>
      </div>
    </div>
  </div>
  <div class="rank-board" v-else>
    <SpinKit :mode="'sk-spinner-pulse'"></SpinKit>
  </div>
</template>
<script>
import utils from '@/utils'
import SpinKit from '@/components/SpinKit'
export default {
  name: 'RankBoard',
  props: ['list', 'mode'],
  components: {
    SpinKit
  },
  data() {
    return {

    }
  },
  computed: {
    factions() {
      return utils.faction
    },
  },
  watch: {
    // list(val) {
    //   console.log(val)
    //   console.log(utils.faction)
    // }
  }
}
</script>
<style lang="scss" scoped>
.rank-board {
	position: relative;
  height: 440rpx;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  flex-direction: column;
  background: #FAFAFA;
  border-radius: 24rpx;
  .faction-block {
    position: relative;
    display: flex;
    justify-content: flex-start;
    flex-wrap: nowrap;
    align-items:center;
    width: 345rpx;
    height: 74rpx;
    .number {
      width: 59rpx;
      height: 30rpx;
      // margin-left: 29rpx;
      text-align: center;
      font-size: 26rpx;
      color: #999999;
      line-height: 30rpx;
    }
    img {
      width: 40rpx;
      height: 40rpx;
      margin-left: 5rpx;
    }
    .faction {
      font-size: 26rpx;
      color: #333333;
      line-height: 30rpx;
      margin-left: 14.5rpx;
    }
    .data-rate {
      position: absolute;
      right: 30rpx;
      line-height: 26rpx;
      font-size: 26rpx;
      font-weight: bold;
      /*color: #333333;*/
      text-align: right;
    }
  }
}
</style>
