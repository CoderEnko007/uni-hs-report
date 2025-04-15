<template>
  <div class="footer-menu" :style="{'height':isIphoneX?124+'rpx':90+'rpx'}">
    <button open-type="share" class="btn share">
      <span class="icon iconfont">&#xe63b;</span>
      <span>分享给好友</span>
    </button>
    <div class="separator" v-if="showExportBtn"></div>
    <button class="btn" v-if="showExportBtn" @click="handleExportBtn">
      <span class="icon iconfont">&#xe69c;</span>
      <span>导出套牌</span>
    </button>
    <div class="separator" v-if="showCollectBtn"></div>
    <button class="btn like" v-if="showCollectBtn" @click="handleCollect">
      <span class="active icon iconfont" v-if="collected">&#xe601;</span>
      <span class="icon iconfont" v-else>&#xe603;</span>
      <span>收藏套牌</span>
    </button>
    <div class="separator" v-if="showSubscribe"></div>
    <button class="btn" v-if="showSubscribe" @click="handleSubscribe">
      <span class="icon iconfont">&#xe6ad;</span>
      <span>订阅周报</span>
    </button>
    <div class="separator" v-if="link"></div>
    <button class="btn" v-if="link" @click="handleCopyLink">
      <span class="icon iconfont">&#xe789;</span>
      <span>复制网页地址</span>
    </button>
  </div>
</template>
<script>
import { mapGetters } from 'vuex' 
export default {
  name: 'FooterMenu',
  props: ['showCollectBtn', 'showExportBtn', 'showSubscribe', 'collected', 'link'],
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters([
      'isIphoneX'
    ]),
  },
  methods: {
    handleCopyLink() {
      console.log('copy', this.link)
      wx.setClipboardData({
        data: this.link,
        success: function(res) {
          wx.showToast({
            icon: 'none',
            title: '网页已复制到剪贴板'
          })
        }
      })
    },
    handleSubscribe() {
      let tmplIds = 'jR3I60LZRN8RuTDwpiZHuQ24Euvte5hI2RLsIaw0PJQ'
      wx.requestSubscribeMessage({
        tmplIds: [tmplIds],
        success: (res) => {
          let subscription = []
          if (res[tmplIds] === 'accept') {
            subscription.push({
              template_id: tmplIds,
              subscription_type: 'once',
            })
            wx.BaaS.subscribeMessage({subscription}).then(res => {
              // success
              console.log('subscribeMessage success', res)
            }, err => {
              // fail
              console.log('subscribeMessage fail', err)
            })
            wx.showToast({
              title:'订阅成功'
            })
          } else if (res[tmplIds] === 'reject') {
            wx.showModal({
              title:'订阅消息',
              content:'您已拒绝了订阅消息，如需重新订阅请前往设置打开。',
              confirmText:'去设置',
              success: res => {
                if (res.confirm) {
                  wx.openSetting({})
                }
              }
            })
          }
        },
        fail: err => {
          console.log('requestSubscribeMessage err', err)
          wx.showModal({
            title:'订阅消息',
            content:'您关闭了“接收订阅信息”，请前往设置打开！',
            confirmText:'去设置',
            // showCancel:false,
            success: res => {
              if (res.confirm) {
                wx.openSetting({})
              }
            }
          })
        },
      })
    },
    handleExportBtn() {
      this.$emit('exportClick')
    },
    handleCollect() {
      this.$emit('collectClick')
    },
    activeCollectIcon() {
      this.collected = true
    },
    deactiveCollectIcon() {
      this.collected = false
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../style/color";
.footer-menu {
  position: relative;
  display: flex;
  justify-content: space-around;
  flex-wrap: nowrap;
  width: 750rpx;
  border-top: 1rpx solid $palette-bg-gray;
  background-color: #fff;
  border-bottom:1rpx solid $palette-bg-gray;
  box-shadow:0 0 8rpx #c0c0c0;
  .like-block {
    height: 90rpx;
    width: 240rpx;
  }
  .btn {
    width: 240rpx;
    height: 90rpx;
    line-height: 90rpx;
    padding: 0;
    display: inline-block;
    background-color: white;
    border-radius: 0;
    font-size: 26rpx;
    .icon {
      font-size: 32rpx;
      color: $palette-blue;
      margin-right: 20rpx;
    }
    .active {
      color: red;
    }
    &:after {
      border: none;
      border-radius: 0;
    }
  }
  .separator {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    height: 40rpx;
    border-left: 1rpx solid $palette-bg-gray;
    z-index: 1;
  }
}
</style>
