<template>
  <div class="container">
    <nav-bar :showCapsule="true"></nav-bar>
    <div class="panel-tab">
      <block v-for="(item,index) in tabbar" :key="item.id">
        <div :id="index" :class="{'tab-item': true, 'tab-item-active': activeIndex==index}" @click="handleTabBarClick">
          {{item.text}}
        </div>
      </block>
    </div>
    <div class="tab-container">
      <swiper class="content" :easing-function="easeInOutCubic" :duration="100" @change="swiperChange" :current="currentTab" :style="'height:'+contentHeight">
        <swiper-item>
          <UnrevealedPage></UnrevealedPage>
        </swiper-item>
        <swiper-item>
          <RevealedPage></RevealedPage>
        </swiper-item>
      </swiper>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import NavBar from '@/components/NavBar'
  import UnrevealedPage from '../components/unrevealed.vue'
  import RevealedPage from '../components/revealed.vue'
  export default {
    name: 'RevealPage',
    components: {
      NavBar,
      UnrevealedPage,
      RevealedPage
    },
    computed: {
      ...mapGetters([
        'winWidth',
        'winHeight',
        'navHeight'
      ]),
      contentHeight() {
        return this.winHeight + "px";
      }
    },
    data() {
      return {
        tabbar: [
          {id: 'n_revealed', text: '发布日程' },
          {id: 'revealed', text: '新卡预览' }
        ],
        activeIndex: 0,
        currentTab: 0,
      }
    },
    methods: {
      handleTabBarClick(e) {
        this.activeIndex = e.currentTarget.id;
        this.currentTab = this.activeIndex;
      },
      swiperChange(e) {
        this.currentTab = e.mp.detail.current;
        this.activeIndex = this.currentTab;
      },
    }
  }
</script>

<style scoped lang="scss">
@import '../../../style/color';
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
  position: fixed;
  margin-top: 85rpx;
  width: 100%;
  z-index: 1;
}
</style>
