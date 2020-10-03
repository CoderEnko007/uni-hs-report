<template>
<div class="container">
  <nav-bar :showCapsule="true" navTitle="HS炉石情报站"></nav-bar>
  <div class="panel">
    <div class="state">
      <span>激活状态：</span>
      <span v-if="vipObj.isVip">{{vipObj.timesString}}</span>
      <span v-else>未激活或者激活码到期</span>
    </div>
    <div class="title">
      <span class="text">请输入激活码：</span>
      <input type="text" placeholder="点击粘贴即可复制激活码" :value="activate_code" >
    </div>
    <div class="btn-group">
      <button style="float: left;" @click="handlePasteCode">粘 贴</button>
      <button style="float: right; margin-left: 30rpx;" @click="handleActivate">激 活</button>
    </div>
  </div>
  <div class="panel">
    <div class="headline">
      <span>说明</span>
    </div>
    <div class="desc">
      <p>· 很多朋友在后台向我抱怨小程序中广告太多了，非常影响体验，这个问题我也明白，在小程序上线初期，我加的广告非常少，并且尽量放在不会影响使用体验的地方，平时靠大家首页公告提醒大家帮我点击广告产生收益，当时有很多朋友还给我留言说想帮我点广告但是找不到广告在哪。但是时间久了就没多少人去点击广告，而且坑爹的TX还要从中扣出很大一部分，每天收益最低的时候就几块钱。</p>
      <p>· 后来我把广告换成了按每千次曝光产生收益的方式，但是这些广告要么需要观看一段视频，要么会弹窗，要么会占据很大一篇区域，体验都不是很好，但是至少能基本维持日常开销和维护成本了。</p>
      <p>· 前段时间有朋友在后台留言建议添加付费去广告的功能，表示理解运营的问题，但是希望通过支付一定的费用获得一个纯净的使用体验，我思考了一下就做了这个功能。</p>
    </div>
    <div class="headline">
      <span>费用</span>
    </div>
    <div class="desc">
      <p>12元/月 30元/三月 100元/一年</p>
    </div>
    <div class="headline">
      <span>支付方式</span>
    </div>
    <div class="desc">
      <p>添加我的微信发送红包，我会给你一个激活码，在上方激活即可。</p>
      <img :src="QRCode" mode="aspectFit" @click="previewQRCode">
    </div>
  </div>
</div>
</template>

<script>
import utils from '@/utils'
import { mapGetters } from 'vuex'
import { getActivateCode, setActivateCode } from '@/api/dbapi.js'
import NavBar from '@/components/NavBar'
export default {
  components: {
    NavBar,
  },
  computed: {
    ...mapGetters([
      'userInfo',
    ]),
  },
  data() {
    return {
      activate_code: null,
      vipObj: {
        isVip: false,
        timesString: ''
      },
      QRCode: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1ioMqEnqcq134VsC.jpg'
    }
  },
  methods: {
    previewQRCode() {
      wx.previewImage({
        urls: [this.QRCode]
      })
    },
    handlePasteCode() {
      wx.getClipboardData({
        success: res => {
          console.log(res.data)
          this.activate_code = res.data
        }
      })
    },
    handleActivate() {
      wx.BaaS.auth.getCurrentUser()
        .then(async user => {
          let left_time = 0
          if (this.userInfo.activate_state) {
            let temp = this.userInfo.activate_state.expired_time-new Date().getTime()
            console.log(this.userInfo.activate_state, temp)
            left_time = temp>0?temp:0
          }
          console.log('a', left_time)
          let code_detail = await getActivateCode(this.activate_code)
          if (code_detail.length<=0) {
            return {
              status: 1001 //无效的激活码
            }
          }
          code_detail = code_detail[0]
          if (code_detail && code_detail.state===0) {
            left_time = left_time+code_detail.hours*60*60*1000
          } else {
            return {
              status: 1002 //激活码已使用过
            }
          }
          console.log('b', left_time)
          let new_state = {
            active_time: new Date().getTime(),
            expired_time: new Date(new Date().getTime()+left_time).getTime()
          }
          console.log('c', new_state, code_detail)
          user.set('activate_state', new_state).update()
          this.userInfo.activate_state = new_state
          this.$store.commit('SET_USERINFO', this.userInfo)
          this.$store.commit('setAdsOpenFlag', false)
          return {
            status: 1000,
            user: this.userInfo.id,
            codeId: code_detail.id
          }
        }).then(async res => {
          if (res.status === 1000) {
            // success 修改code状态
            let result = await setActivateCode(res.codeId, {
              state: 1,
              user: res.user
            })
            wx.showModal({
              content: '去广告激活成功',
              showCancel: false,
              success: res => {
                if (res.confirm) {
                  console.log('用户点击确定')
                  // wx.switchTab({
                  //   url: '/pages/mine/index',
                  // })
                  this.getVIPLeftTime()
                }
              }
            })
            console.log('aaa', result)
          } else if (res.status === 1001) {
            wx.showModal({
              content: '无效的激活码',
              showCancel: false,
            })
          } else if (res.status === 1002) {
            wx.showModal({
              content: '该激活码已使用过',
              showCancel: false,
            })
          }
        }).catch(err => {
          // err 为 HError 对象
        })
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
  },
  onShow() {
    this.getVIPLeftTime()
  },
  onPullDownRefresh() {
    this.getVIPLeftTime()
  }
}
</script>

<style scoped lang="scss">
@import '../../../style/color';
.panel {
  width: 100%;
  padding: 15px;
  box-sizing: border-box;
  .state {
    padding: 10rpx 0;
    font-size: 32rpx;
  }
  .title {
    padding: 10rpx 0;
    font-size: 32rpx;
    .text {
      float: left;
      line-height: 60rpx;
    }
    input {
      height: 60rpx;
      line-height: 60rpx;
      border: 1rpx solid #ccc;
      border-radius: 10rpx;
      box-sizing: border-box;
      font-size: 28rpx;
      background-color: #f8f8f8;
      // text-align: center;
      padding: 0 10rpx;
    }
  }
  .btn-group {
    float: right;
    margin-top: 10rpx;
    button {
      width: 160rpx;
      font-size: 26rpx;
      font-weight: 600;
      color: white;
      background-color: $palette-blue;
      border-radius: 25rpx;
      &:after {
        border: none;
      }
    }
  }
  .header {
    font-size: 48rpx;
    font-weight: bold;
  }
  .desc {
    position:relative;
    font-size: 26rpx;
    color: #666666;
    line-height: 40rpx;
    margin-bottom: 10rpx;
    p {
      margin-bottom: 1em;
    }
  }
}
</style>
