<script>
	export default {
		data() {
			return {
				clientId: 'ec59002ba0fc4c74bf50',
			}
		},
		methods: {
      hotUpdate() {
        if (wx.canIUse('getUpdateManager')) {
          const updateManager = wx.getUpdateManager()
          updateManager.onCheckForUpdate(res => {
            console.log('onCheckForUpdate====', res)
            // 请求完新版本信息的回调
            if (res.hasUpdate) {
              console.log('res.hasUpdate====')
              updateManager.onUpdateReady(function () {
                wx.showModal({
                  title: '更新提示',
                  content: '新版本已经准备好，是否重启应用？',
                  success: function (res) {
                    console.log('success====', res)
                    // res: {errMsg: "showModal: ok", cancel: false, confirm: true}
                    if (res.confirm) {
                      // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                      updateManager.applyUpdate()
                    }
                  }
                })
              })
              updateManager.onUpdateFailed(function () {
                // 新的版本下载失败
                wx.showModal({
                  title: '已经有新版本了哟~',
                  content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
                })
              })
            }
          })
        }
      },
			Login() {
				this.$store.dispatch('Login').then(res => {
					console.log('success', res)
          if (res.result.data.activate_state) {
            let activate_state = res.result.data.activate_state
            if (activate_state.hasOwnProperty('expired_time')&&(activate_state.expired_time>new Date().getTime())) {
              this.$store.commit('setAdsOpenFlag', false)
            } else {
              this.$store.commit('setAdsOpenFlag', true)
            }
          } else {
            this.$store.commit('setAdsOpenFlag', true)
          }
          this.$store.dispatch('getCollectedDecks', res.result.data.id).then(res => {
            // console.log('aaa', res)
          })
				}).catch(err => {
					console.log('fail', err)
				})
			},
			initDecksName() {
				this.$store.dispatch('getDecksName').then(res => {
					// console.log('decksname', res)
				})
			},
			initCardSeries() {
				this.$store.dispatch('getSeriesData').then(res => {
					// console.log('series', res)
				})
			},
			setNavHeight() {
				this.$store.dispatch('setNavHeight').then(res => {
					// console.log(res)
				})
			},
			setWinWidthHeight() {
				this.$store.dispatch('setWinWidthHeight').then(res => {
					// console.log(res)
				})
			},
			initSystemSetting() {
				this.$store.dispatch('setSystemSetting').then(res => {
					// console.log('setSystemSetting', res)
				})
			},
			setNotice() {
				this.$store.dispatch('getNotice').then(res => {
					// console.log('setNotice', res)
				})
			}
		},
		onLaunch: function() {
			console.log('App Launch')
			wx.BaaS = requirePlugin('sdkPlugin')
			wx.BaaS.wxExtend(wx.login, wx.getUserInfo, wx.requestPayment)
			wx.BaaS.init(this.clientId)
      
      wx.preloadVideoAd && wx.preloadVideoAd(['adunit-0f4e12c094385f56'])

			// 业务逻辑代码
      this.hotUpdate()
			this.initSystemSetting()
			this.initDecksName()
			this.initCardSeries()
			this.setNotice()
			this.Login()
      this.setNavHeight()
      this.setWinWidthHeight()
		},
		onShow: function(options) {
			wx.BaaS.reportTemplateMsgAnalytics(options)
    },
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
@import url("/components/gaoyia-parse/parse.css");
@import "style/zanui.wxss";
@import "style/color";
/*每个页面公共css */
.container {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
.m-30 {
  margin: 0 30rpx;
}
.p-30 {
  padding: 0 30rpx;
}
.pr-30 {
  padding-right: 30rpx;
}
.color-green {
  color: $palette-green;
}
.color-light-green {
  color: $palette-light-green;
}
.color-red {
  color: $palette-orange;
}
.float-left {
  float: left;
}
.float-right {
  float: right;
}
.font-bold {
  font-weight: 700;
}
.clear {
  &:after {
    content:"";
    display:block;
    clear: both;
  }
}
.ads {
  ad {
    transform: scale(0.9) !important;
  }
}
.header-title {
  width: 100%;
  height: 60rpx;
  line-height: 60rpx;
  color: white;
  font-size: 28rpx;
  font-weight: 500;
  border-radius: 10rpx;
  margin: 5px 0;
  padding-left: 28rpx;
  .header-btn {
    float: right;
    height:100%;
    line-height:60rpx;
    margin-right: 30rpx;
    border-radius: 20rpx;
  }
}
.headline {
  position: relative;
  height: 96rpx;
  line-height: 96rpx;
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  .head-picker {
    display: inline-block;
    height: 24rpx;
    line-height: 24rpx;
    margin-left: 16rpx;
    font-size: 19rpx;
    color: #7e7e7e;
    border: 1rpx solid #ddd;
    border-radius: 24rpx;
    padding: 3rpx 10rpx;
    // background: $palette-blue;
    // color: #fff;
    // font-weight: normal;
    // border: 1rpx solid $palette-blue;
  }
  .right-meta {
    float: right;
    height:100%;
    line-height:96rpx;
    font-size:28rpx;
    color: $palette-blue;
  }
}
.c-button {
  background-color: white;
  border-radius: 0;
  margin: 0;
  padding: 0;
  &:after {
    border: none;
  }
}
.grad-header-light-blue {
  background: linear-gradient(65deg,#1d3657,#bed6ff calc(100% - 120px),rgba(49,49,49,0) calc(100% - 50px),rgba(49,49,49,0));
}
.grad-header-gray {
  background: linear-gradient(65deg,#555,#eee calc(100% - 120px),rgba(49,49,49,0) calc(100% - 50px),rgba(49,49,49,0));
}
.loading {
  width: 100%;
  text-align: center;
  font-size: 26rpx;
  color: #ddd;
}
.notice-bar {
  position: absolute;
  width:100%;
  margin-top: 0;
  z-index:2;
  background: rgba(0,0,0,.3);
  &:after {
    border: none;
  }
}
::-webkit-scrollbar{
  width: 0;
  height: 0;
  color: transparent;
}
.pulse {
  $from: #f5f5f5;
  $to: scale-color($from, $lightness: -10%);

  height: 100%;
  width: 100%;
  background: linear-gradient(-90deg, #efefef 0%, #fcfcfc 50%, #efefef 100%);
  background-size: 400% 400%;
  background-color: #f5f5f5;
  animation: pulse 1.2s ease-in-out infinite;

  @keyframes pulse {
    0% {
      background-position: 0% 0%
    }

    100% {
      background-position: -135% 0%
    }
  }
}
</style>
