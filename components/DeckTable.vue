<template>
<div class="data-table">
  <div class="table-tr header">
    <div class="table-td table-name"><span>{{tableName}}</span></div>
    <div class="table-td text-center col-other order"
         :class="{'pr-30': index === tableTitle.length-1}"
         v-for="(item, index) in tableTitle"
         :key="index"
         @click="handleOrderClick(item)">
      <span>{{item.name}}</span>
      <img v-if="orderBy && orderBy === item.id" :src="upOrder" mode="aspectFit">
      <img v-else-if="orderBy === '-'+item.id" :src="downOrder" mode="aspectFit">
      <img v-else :src="normalOrder" mode="aspectFit">
    </div>
  </div>
    <div class="table" v-if="genTableData.length>0">
      <div class="table-tr content" v-for="(item, index) in genTableData" :key="index" @click="handleItemClick(item)">
          <div class="table-td col-1st">
            <img :src="genFactionIcon" mode="aspectFit">
            <div class="deckName">
              <p class="cname">{{item.deckName}}</p>
              <p class="ename">{{item.ename}}</p>
            </div>
          </div>
          <div class="table-td text-center col-other"><span>{{item.format_games}}</span></div>
          <div class="table-td text-center col-other"><span>{{item.popularity}}%</span></div>
          <div class="table-td text-center col-other col-last color-green" :class="{'color-red': item.winrate<50}">
            <span :style="{'font-weight': 'bold'}">{{item.winrate}}%</span>
          </div>
      </div>
    </div>
  <div class="zan-loadmore zan-loadmore--nodata" style="margin-top:100rpx;" v-else>
    <div class="zan-loadmore__tips">{{ nodata_str || '缺少有效数据' }}</div>
  </div>
</div>
</template>
<script>
import utils from '@/utils'
import { mapGetters } from 'vuex'

export default {
  name: 'DeckTable',
  props: ['selectedFaction', 'date', 'tableTitle', 'tableData', 'tableName'],
  data() {
    return {
      orderBy: '',
      normalOrder: '/static/icons-v2/rank-normal.png',
      upOrder: '/static/icons-v2/rank-up.png',
      downOrder: '/static/icons-v2/rank-down.png'
    }
  },
  computed: {
    ...mapGetters([
      'winWidth',
      'winHeight'
    ]),
    genTableData() {
      this.sortTableData()
      this.tableData.map(item => {
        item.format_games = utils.toThousands(item.games)
      })
      return this.tableData
    },
    genFactionIcon() {
      return utils.faction[this.selectedFaction.id].image
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
    handleOrderClick(item) {
      if (this.orderBy.indexOf(item.id)>=0) {
        this.orderBy = this.orderBy.split('')[0]==='-'?item.id:'-'+item.id
      } else {
        this.orderBy = '-'+item.id
      }
      this.sortTableData()
    },
    handleItemClick(item) {
      this.$emit('itemClick', item)
    },
    sortTableData() {
      if (this.orderBy) {
        this.tableData.sort(this.compareFunction(this.orderBy))
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../style/color';
.table {
  display: table;
  width: 100%;
  border-collapse: collapse;
}
.table-tr {
  display: table-row;
  width: 100%;
  font-size: 26rpx;
  .table-td {
    display: table-cell;
    span {
      height: 60rpx;
      line-height: 60rpx;
    }
  }
  .col-1st {
    position: relative;
    width: 265rpx;
    text-align: left;
    box-sizing: border-box;
    padding-left: 30rpx;
    img {
      position: absolute;
      width: 64rpx;
      height: 64rpx;
      top: 50%;
      transform: translateY(-50%);
    }
    .deckName {
      position: absolute;
      display: inline-block;
      top: 50%;
      transform: translateY(-50%);
      margin-left: 90rpx;
      p.cname {
        width:180rpx;
        height: 37rpx;
        line-height: 37rpx;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
      }
      p.ename {
        width:180rpx;
        height: 30rpx;
        line-height: 30rpx;
        font-size: 22rpx;
        color: #999;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
      }
    }
  }
  .col-last {
    padding-right: 30rpx;
  }
  .col-other {
    width: 120rpx;
  }
}
.content {
  background-color: #fff;
  border-bottom:1rpx solid #eee;
  &:active  {
    background: #eee;
  }
  .table-td {
    height: 120rpx;
    line-height: 120rpx;
  }
}
.text-center {
  text-align: center;
}
.float-right {
  float: right;
  margin-right: 40rpx;
}
.header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 86rpx;
  line-height: 86rpx;
  border-bottom: 1rpx solid #eee;
  .table-name {
    width: 265rpx;
    color: #999;
    box-sizing: border-box;
    padding-left: 33rpx;
  }
  .order {
    position: relative;
    font-size: 26rpx;
    color: #333;
    img {
      position:absolute;
      width: 22rpx;
      height: 36rpx;
      line-height:26rpx;
      margin-left: 5rpx;
      /*right:7rpx;*/
      top:50%;
      transform:translateY(-50%);
    }
  }
}
</style>
