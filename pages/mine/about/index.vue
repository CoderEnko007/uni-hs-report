<template>
<div class="container">
  <nav-bar :showCapsule="true" navTitle="关于"></nav-bar>
  <div class="banner">
    <img :src="bannerImg" mode="aspectFill">
    <div class="text">
      <h1>炉石传说情报站</h1>
      <p>祝大家早日上传说</p>
    </div>
  </div>
  <div class="content">
    <div class="panel">
      <div class="headline">
        <span class="title">数据说明</span>
      </div>
      <div class="desc" v-if="description.length>0">
        <p v-for="(item, index) in description" :key="index">· {{item}}</p>
      </div>
      <div class="desc" v-else>
        <SpinKit :mode="'sk-spinner-pulse'"></SpinKit>
      </div>
      <div class="separator"></div>
    </div>
  </div>
  <div class="contact">
    <div class="headline">
      <span class="title">联系作者</span>
    </div>
    <p class="text">在使用中发现什么bug或者有什么建议，欢迎大家联系我。</p>
    <div class="email">
      <span class="text">发邮件</span>
      <div class="capsule" @click="handleCopyBtn"><span>复制</span></div>
      <span class="desc">{{email}}</span>
    </div>
  </div>
  <!-- <div class="block">
    <div class="headline">
      <span class="title">用爱发电</span>
    </div>
    <div class="videoAd" @click="handleVideoClick">
      <span class="text">点击此处播放激励视频(15秒)</span>
      <span class="iconfont play">&#xe697;</span>
    </div>
  </div> -->
  <!-- <div class="ads" v-if="adsOpenFlag">
    <ad unit-id="adunit-3df610deaf7d2cbd"></ad>
  </div> -->
</div>
</template>
<script>
import utils from '@/utils'
import { mapGetters } from 'vuex'
import {getAboutDescription, addCustomerSetting, getCustomerSetting, updateCustomerSetting} from '@/api/dbapi'
import NavBar from '@/components/NavBar'
import SpinKit from '@/components/SpinKit'

export default {
  components: {
    NavBar,
    SpinKit
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'navHeight'
    ]),
    // adsOpenFlag() {
    //   return utils.adsOpenFlag
    // },
  },
  data() {
    return {
      videoAd: null,
      bannerImg: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1gDPyMJP8arlwMXm.png',
      email: 'yf381966217@163.com',
      description: [],
    }
  },
  methods: {
    handleCopyBtn() {
      wx.setClipboardData({
        data: this.email,
        success: function (res) {
          wx.showToast({
            title: '复制成功'
          })
        }
      })
    },
    async handleVideoClick() {
      let videoAdUseable = true //wx.canIUse('createRewardedVideoAd')
      if (videoAdUseable) {
        if (this.videoAd) {
          this.videoAd.show().catch(() => {
            // 失败重试
            this.videoAd.load()
              .then(() => videoAd.show())
              .catch(err => {
                console.log('激励视频 广告显示失败')
              })
          })
        }
      } else {
        wx.showToast({
          title: '微信版本过低，无法播放激励视频',
          icon: 'none',
          duration: 2500
        })
      }
    }
  },
  mounted() {
    getAboutDescription().then(res => {
      this.description = res.objects.map(item => {
        return item.text
      })
    }).catch(err => {
      console.log(err)
    })
  },
  onLoad() {
    if (wx.createRewardedVideoAd) {
      this.videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-6c39abb54de729f4'
      })
      this.videoAd.onClose(async (status) => {
        console.log('激励视频关闭', status)
        if (status && status.isEnded || status === undefined) {
          let res = await getCustomerSetting(this.userInfo.id)
          console.log(res)
          let temp = ''
          if (res.meta.total_count > 0) {
            let ad_click_num = res.objects[0].ad_click_num + 1
            temp = await updateCustomerSetting({
              ad_click_num: ad_click_num,
            }, res.objects[0].id)
          } else {
            temp = await addCustomerSetting({}, this.userInfo.id)
          }
          let now = new Date()
          try {
            wx.setStorageSync('ads_video_date', new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()/1000)
          } catch (e) {
            console.log(e)
          }
          wx.showToast({
            title: '感谢！',
            icon: 'none',
            duration: 2500
          })
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
        wx.showToast({
          title: '出了点小问题，无法播放激励视频',
          icon: 'none',
          duration: 2500
        })
      })
    }
  },
  onShareAppMessage(res) {
    return {
      title: 'HS石炉之家',
      path: '/pages/mine/about/index'
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../../style/color';
.container {
  .banner {
    position: relative;
    height: 325rpx;
    img {
      height: 100%;
      width: 100%;
    }
    .text {
      position: absolute;
      left: 30rpx;
      top: 64rpx;
      h1 {
        font-size: 56rpx;
        color: #FFFFFF;
        line-height: 56rpx;
      }
      p {
        margin-top: 9rpx;
        font-size: 26rpx;
        color: #FFFFFF;
        line-height: 44rpx;
      }
    }
  }
  .content {
    margin: 0 30rpx;
    .panel{
      .headline {
        &:before {
          display: none;
        }
        .title {
          margin: 0;
        }
      }
      .desc {
        position:relative;
        min-height:200rpx;
        font-size: 26rpx;
        color: #666666;
        line-height: 40rpx;
        margin-bottom: 10rpx;
        p {
          margin-bottom: 1em;
        }
      }
      .separator {
        width: 100%;
        box-sizing: border-box;
        border-bottom: 1rpx solid #eee;
        margin: 20rpx 0;
      }
    }
  }
  .contact {
    margin: 0 30rpx;
    .headline {
      &:before {
        display: none;
      }
      .title {
        margin: 0;
      }
    }
    p.text {
      font-size: 26rpx;
      color: #666666;
      line-height: 80rpx;
    }
    .email, .videoAd {
      height: 120rpx;
      box-sizing:border-box;
      border-bottom:1rpx solid #eee;
      .text {
        line-height:120rpx;
        font-size: 30rpx;
        color: #333333;
      }
      .desc {
        float: right;
        right: 101rpx;
        height: 40rpx;
        font-size: 26rpx;
        color: #999999;
        margin-right:13rpx;
        margin-top:40rpx;
      }
      .capsule {
        float: right;
        right: 0;
        height: 40rpx;
        width: 88rpx;
        padding:0 15rpx;
        font-size: 24rpx;
        border-radius: 20rpx;
        box-sizing: border-box;
        border: 1rpx solid #ddd;
        text-align: center;
        margin-top:40rpx;
        color: #999999;
      }
    }
  }
  .block {
    margin: 30rpx;
    box-sizing: border-box;
    border-radius: 24rpx;
    border: 1rpx solid #f8f8fc;
    .videoAd {
      height: 120 rpx;
      box-sizing: border-box;
      border-bottom: 1 rpx solid #eee;
      .text {
        line-height: 120 rpx;
        font-size: 30rpx;
        color: #333333;
      }
      .play {
        font-size: 40rpx;
        line-height: 42rpx;
        vertical-align:middle;
        display:inline-block;
        margin-left: 10rpx;
      }
    }
  }
  .feedback {
    margin: 10rpx 10rpx 20rpx;
    font-size: 24rpx;
    color: $palette-light-blue;
    p {
      text-align:center;
    }
  }
}
</style>
