<template>
<div class="container" v-show='show'>
  <ul class="menu-list">
    <li :class="{'menu-item': true, 'menu-item-action': selectedItem===item.id, 'menu-item-empty': !item.name}"
        :style="{'width': colNum===3?'28%':'45%'}"
        v-for="(item, index) in filter.items"
        :key="index"
        @click="handleClick(item)">
      <div class="name">
        <img :src="item.icon" mode="aspectFit" v-if='item.icon'>
        <div class="text" :style="{'margin-left': item.icon?'40rpx': 0}">
          <span>{{item.name}}</span>
          <span v-if="item.ename">（{{item.ename}}）</span>
        </div>
      </div>
    </li>
  </ul>
</div>
</template>
<script>
export default {
  name: 'FilterMenu',
  props: ['filter', 'colNum', 'show'],
  data() {
    return {
      selectedItem: 'all'
    }
  },
  methods: {
    handleClick(item) {
      if (!item.name) return
      this.selectedItem = item.id
      this.$emit('filterMenuClick', {name: this.filter.name, item})
    },
    resetFilter() {
      this.selectedItem = 'all'
    }
  },
}
</script>
<style lang="scss" scoped>
@import '../style/color';
.container {
  .menu-list {
    box-sizing: border-box;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    width: 100%;
    padding: 10rpx 2rpx 5rpx;
    font-size: 24rpx;
    background-color: $palette-bg-gray;
    .menu-item {
      // width: 45%;
      height: 44rpx;
      line-height: 44rpx;
      margin: 10rpx;
      border: 2rpx solid black;
      border-radius: 10rpx;
      text-align: center;
    }
    .menu-item-action {
      color: #fff;
      background-color: $palette-blue-normal;
      border: 2rpx solid $palette-blue-normal;
    }
    .menu-item-empty {
      border: none
    }
  }
  .name {
    position: relative;
    width: 100%;
    height: 100%;
    img {
      position: absolute;
      width: 30rpx;
      height: 30rpx;
      margin-right: 10rpx;
      top: 50%;
      transform: translateY(-50%);
    }
    .text {
      max-width: 95%;
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>
