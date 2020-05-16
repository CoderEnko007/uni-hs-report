<template>
  <div class="cost_filter">
    <ul class="cards_cost">
      <li v-for="i in costList" :key="i.cost">
        <div :class="{type_icon: true, type_icon_active: i.cost===cost}" @click="handleCostClick(i.cost)">
          <img class="cost_num" :src="i.icon" mode="aspectFit">
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'CostPanel',
  props: [''],
  data() {
    return {
      cost: null,
      costList: [
        {cost: 0, icon: '/static/mana/0.png'},
        {cost: 1, icon: '/static/mana/1.png'},
        {cost: 2, icon: '/static/mana/2.png'},
        {cost: 3, icon: '/static/mana/3.png'},
        {cost: 4, icon: '/static/mana/4.png'},
        {cost: 5, icon: '/static/mana/5.png'},
        {cost: 6, icon: '/static/mana/6.png'},
        {cost: 7, icon: '/static/mana/7+.png'}
      ],
    }
  },
  methods: {
    handleCostClick(item) {
      this.cost = this.cost === item?null:item
      this.$emit('itemClick', item)
    },
    clearCost() {
      this.cost = null
    }
  }
}
</script>

<style scoped lang="scss">
.cost_filter {
  position: relative;
  padding: 0 30rpx;
  .cards_cost {
    display: flex;
    justify-content: space-around;
    width: 100%;
    height: 75rpx;
    li {
      display:flex;
      text-align:center;
      position: relative;
      height: 54rpx;
      line-height: 54rpx;
      .type_icon {
        position: relative;
        width: 54rpx;
        height: 100%;
        background: url('../static/mana/mana1.png') no-repeat;
        background-size: 100% 100%;
        &::before {
          content: "";
          position: absolute;
          top: -13px;
          left: -10px;
          right: -12px;
          bottom: -10px;
          opacity: 0;
          background: url('../static/mana/mana_active_1.png') center center / contain no-repeat;
          transition: opacity 0.15s ease 0s;
        }
      }
      .type_icon_active {
        // position: relative;
        // width: 54rpx;
        // height: 54rpx;
        // display: inline-block;
        // background: url('../static/mana/mana_active.png') no-repeat;
        // background-size: 100% 100%;
        &::before {
          opacity: 1 !important;
        }
      }
      .cost_num {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        width: 44rpx;
        height: 34rpx;
      }
    }
  }
}
</style>
