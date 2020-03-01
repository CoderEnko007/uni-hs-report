<template>
  <div class="container">
    <nav-bar></nav-bar>
    <div class="userinfo">
      <img :src="userInfo.avatar">
      <button v-if="!userInfo.openid" open-type="getUserInfo" @getuserinfo="userInfoHandler">点击登录</button>
      <p v-else>{{userInfo.nickname}}</p>
    </div>
    <div class="panel nga-block">
      <div class="left-block">
        <p class="text">NGA炉石专区</p>
        <p class="desc">更专业的原创内容，更全面的炉石资讯</p>
      </div>
      <div class="logo">
        <img :src="logo" mode="aspectFill">
      </div>
    </div>
    <div class="panel" @click="handleCollectionClick">
      <span class="text">我的收藏</span>
      <span class="iconfont arrowIcon">&#xe600;</span>
    </div>
    <div class="panel" @click="handleHSVisionClick">
      <span class="text">数据可视化</span>
      <span class="iconfont arrowIcon">&#xe600;</span>
    </div>
    <div class="panel" @click="handleAboutClick">
      <span class="text">关于小程序</span>
      <span class="iconfont arrowIcon">&#xe600;</span>
    </div>
    <div class="panel" @click="handleActivateClick" v-if="showRemoveAdsBtn">
      <span class="text">激活码去广告</span>
      <span class="iconfont arrowIcon">&#xe600;</span>
    </div>
    <div class="panel" style="display: flex;align-items: center;justify-content: space-between;flex-wrap: nowrap;" v-else>
      <div class="state" @click="handleRefreshVIP">
        <span>激活状态：</span>
        <span v-if="vipObj.isVip">{{vipObj.timesString}}</span>
        <span v-else>未激活或者激活码到期</span>
        <!-- <span class="iconfont">&#xe67b;</span> -->
      </div>
    </div>
    <!--<div class="panel" @click="handleVideoClick">-->
      <!--<span class="iconfont playIcon">&#xe697;</span>-->
      <!--<span class="text" style="margin-left:5px;">点击播放激励视频给作者加鸡腿（15秒）</span>-->
    <!--</div>-->
    <!-- <div class="code">
      <h1 class="text">赞赏作者</h1>
      <div class="capsule" @click="handleCopyBtn"><span>支付宝推广红包</span></div>
      <div class="content" @click="handleClickCodeImg">
        <p>「炉石传说情报站」小程序由个人独立开发，源于兴趣，旨在免费为大家提供及时的卡组数据。</p>
        <p>您的赞助将用于支付昂贵的服务器费用，感谢您的支持</p>
        <p style="font-weight: bold">点击此处打开赞赏码，长按扫描随意打赏</p>
      </div>
    </div> -->
    <div class="feedback">
      <button open-type="feedback">问题反馈 | 意见建议</button>
    </div>
    <x-modal :text='aliCodeText' :no-cancel='true' :no-title='true' confirm-text='确定' :hidden.sync='hideModal'></x-modal>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import {getUserCollectionDecks, addCustomerSetting, getCustomerSetting, updateCustomerSetting} from "@/api/dbapi";
import NavBar from '@/components/NavBar'
import xModal from "@/components/x-modal/x-modal.vue"

export default {
  components: {
    NavBar,
    xModal,
  },
  data() {
    return {
      deckList: [],
      logo: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1g9QyXTPpyOMVypO.png',
      codeImg: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1g9oGSrxprEojAfB.jpg',
      aliCodeText: '打开支付宝，首页搜索栏中直接粘贴，即可领取每日红包，金额随机',
      hideModal: true,
      vipObj: {
        isVip: false,
        timesString: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'navHeight',
      'showRemoveAdsBtn'
    ]),
  },
  methods: {
    userInfoHandler(data) {
      this.$store.dispatch('getUserInfo', data).then(res => {
        this.genUserCollection()
      }).catch(err => {
        console.log(err)
      })
    },
    genUserCollection() {
      if (this.userInfo.id) {
        wx.showNavigationBarLoading();
        this.$store.dispatch('getCollectedDecks', this.userInfo.id).then(res => {
          this.deckList = res.list.filter(val => {
            return !(!val || val === "");
          })
          wx.hideNavigationBarLoading()
          wx.stopPullDownRefresh();
        }).catch(err => {
          console.log(err)
          wx.hideNavigationBarLoading()
          wx.stopPullDownRefresh();
        })
      } else {
        wx.stopPullDownRefresh();
      }
    },
    getVIPLeftTime() {
      let activate_state = this.userInfo.activate_state
      let now = new Date().getTime()
      if (activate_state&&activate_state.expired_time && activate_state.expired_time>now) {
        let dateDiff = activate_state.expired_time - now
        let dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));//计算出相差天数
        let leave1 = dateDiff % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
        let hours = Math.floor(leave1 / (3600 * 1000))//计算出小时数
        let leave2 = dateDiff % (3600 * 1000)
        let minutes = Math.floor(leave2 / (60 * 1000))
        let timesString = '剩余'
        if (dayDiff != 0) {
            timesString += dayDiff + '天';
        }
        if (hours != 0 || dayDiff != 0) {
            timesString += hours + '小时';
        } 
        if (minutes != 0 || hours != 0 || dayDiff != 0) {
            timesString += minutes + '分钟';
        } 
        if (dayDiff===0 && hours===0 && minutes===0) {
          let leave3 = dateDiff % (60 * 1000)
          let seconds = Math.floor(leave3 / 1000)
          timesString += seconds + '秒';
        }
        console.log(timesString)
        this.vipObj.timesString = timesString
        this.vipObj.isVip = true
      } else {
        this.vipObj.isVip = false
      }
      wx.stopPullDownRefresh();
    },
    handleDeckClick(item) {
      let url = ''
      if (item.trending) {
        url = `/pages/decks/deckDetail/index?id=${item.id}&trending=1`
      } else {
        url = `/pages/decks/deckDetail/index?id=${item.id}`
      }
      wx.navigateTo({
        url: url
      })
    },
    handleAboutClick() {
      wx.navigateTo({
        url: `/pages/mine/about/index`
      })
    },
    handleCollectionClick() {
      if (this.userInfo.id) {
        wx.navigateTo({
          url: `/pages/mine/collection/index`
        })
      } else {
        wx.showToast({
          title: '请登录',
          icon: 'none'
        })
      }
    },
    handleHSVisionClick() {
      wx.navigateToMiniProgram({
        appId: 'wx010ca9734f850748',
        path: `/pages/index/main`,
        success(res) {
          // 打开成功
          console.log(res)
        }
      })
    },
    handleClickCodeImg() {
      wx.previewImage({
        urls: [this.codeImg]
      })
    },
    handleCopyBtn() {
      wx.setClipboardData({
        data: '558391916',
        success: res => {
          // wx.hideToast();
          this.hideModal = false
        }
      })
    },
    handleRefreshVIP() {
      this.getVIPLeftTime()
    },
    handleActivateClick() {
      if (this.userInfo.id) {
        wx.navigateTo({
          url: `/pages/mine/activation/index`
        })
      } else {
        wx.showToast({
          title: '请登录',
          icon: 'none'
        })
      }
    },
    getSystemSetting() {
    	this.$store.dispatch('setSystemSetting').then(res => {
    		// console.log('setSystemSetting', res)
    	})
    },
  },
  onShow() {
    // this.genUserCollection()
    this.getSystemSetting()
    this.getVIPLeftTime()
  },
  onShareAppMessage(res) {
    return {
      title: '炉石传说情报站',
      path: '/pages/index/index'
    }
  },
  onPullDownRefresh() {
    // this.genUserCollection()
    this.getSystemSetting()
    this.getVIPLeftTime()
  },
}
</script>
<style lang="scss" scoped>
@import '../../style/color';
.banner {
  position: relative;
  height: 80rpx;
  width: 100%;
  padding: 10rpx 0;
  background-color: #fff0cd;
  img {
    width: 200rpx;
    height: 100%;
    margin-left: 24rpx;
  }
  .desc {
    position: absolute;
    bottom: 10rpx;
    left: 90rpx;
    right: 10rpx;
    color: #591804;
    font-size: 24rpx;
    font-weight: 700;
    text-align: right;
  }
}
.userinfo {
  position: relative;
  background-color: #fff;
  button, p {
    font-size: 30rpx;
    height: 60rpx;
    line-height: 60rpx;
    padding: 0;
    text-align: center;
    background-color: transparent;
    border: none;
  }
  button::after{
    border: none;
  }
  img {
    display: block;
    width: 140rpx;
    height: 140rpx;
    border-radius: 50%;
    margin: 50rpx auto 20rpx;
  }
}
.panel {
  height: 120rpx;
  margin: 0 30rpx;
  box-sizing: border-box;
  border-bottom:1rpx solid #eee;
  .text {
    height: 42rpx;
    line-height: 120rpx;
    font-size: 30rpx;
  }
  .arrowIcon {
    float: right;
    line-height:120rpx
  }
  .playIcon {
    font-size: 40rpx;
    line-height: 120rpx;
    vertical-align: middle;
    display: inline-block;
  }
  .refresh-btn {
    border: 1rpx solid #5a5a5a;
    border-radius: 30rpx;
  }
}
.nga-block {
  position: relative;
  .left-block {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    .text {
      height: 42rpx;
      line-height: 42rpx;
      font-size: 30rpx;
      color: #333;
    }
    .desc {
      height: 22rpx;
      line-height: 22rpx;
      margin-top: 13rpx;
      font-size: 22rpx;
      color: #999;
    }
  }
  .logo {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 200rpx;
    height: 90rpx;
    background-color: #FFEFCD;
    border-radius: 24rpx;
    img {
      position:absolute;
      top:0;
      right:0;
      left:0;
      bottom:0;
      margin:auto;
      width: 160rpx;
      height: 63rpx;
    }
  }
}
.code {
  margin: 30rpx 30rpx 0;
  box-sizing: border-box;
  border-radius: 24rpx;
  background: #f8f8fc;
  padding: 30rpx;
  p {
    font-size: 24rpx;
    line-height: 44rpx;
  }
  h1 {
    display:inline-block;
    /*margin-top: 38rpx;*/
    margin-bottom: 24rpx;
    font-size: 30rpx;
    color: #333333;
  }
  img {
    display: block;
    width: 440rpx;
    margin: 0 auto;
  }
  .capsule {
    display: inline-block;
    /*float: right;*/
    /*right: 0;*/
    width: 200rpx;
    height: 40rpx;
    line-height: 40rpx;
    padding:0 15rpx;
    margin-left:300rpx;
    font-size: 24rpx;
    border-radius: 20rpx;
    box-sizing: border-box;
    border: 1rpx solid red;
    text-align: center;
    /*margin-top:13rpx;*/
    color: red;
  }
}
.feedback {
  margin: 10rpx 10rpx 20rpx;
  button {
    font-size: 24rpx;
    color: $palette-blue-normal;
    text-align:center;
    background-color: transparent;
    border: none;
    &:after {
      border: none;
    }
  }
}
</style>
