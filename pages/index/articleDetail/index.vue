<template>
  <div class="container" v-show="detail">
    <nav-bar :showCapsule="true"></nav-bar>
    <div class="skeleton-mask" v-show="!dataReady">
      <ArticleSkeleton :showBanner="detail&&!detail.main_article"></ArticleSkeleton>
    </div>
    <div v-show="dataReady">
      <div class="banner" v-if="detail&&!detail.main_article">
        <img :src="detail&&detail.cover" mode="aspectFill">
      </div>
      <div class="article-detail">
        <div class="title">
          <div><span class="top" v-show="detail&&detail.top">[置顶]</span>{{detail&&detail.title}}</div>
        </div>
        <div class="meta">
          <div class="author">
            <img :src="detail&&detail.logo.path" mode="aspectFit">
            <span class="name">{{detail&&detail.author}}</span>
          </div>
          <div class="date">
            {{detail&&detail.date}}
          </div>
        </div>
        <div class="separator"></div>
        <div class="content">
          <u-parse :content="detail&&detail.content" @preview="preview" @navigate="navigate" :imageProp="{lazyLoad:'true', mode:'aspectFit'}" />
        </div>
        <div class="sub-article">
          <div class='sub-card' v-for="(item, index) in subList" :key="index" @click="handleSubArticleClick(item)">
            <img :src="item.cover" mode="aspectFit" v-if="item.cover">
            <p class="sub-title">{{item.title}}</p>
          </div>
        </div>
        <copyRight></copyRight>
      </div>
      <div class="footer">
        <FooterMenu :link="detail.link"></FooterMenu>
      </div>
    </div>
  </div>
</template>
<script>
  import uParse from '@/components/gaoyia-parse/parse.vue'
  import {
    getArticleDetail,
    getArticleList
  } from "../../../api/dbapi";
  import utils from '@/utils'
  import NavBar from '@/components/NavBar'
  import copyRight from '@/components/copyRight'
  import FooterMenu from '@/components/FooterMenu'
  import ArticleSkeleton from '@/components/ArticleSkeleton'

  export default {
    name: 'articleDetail',
    components: {
      NavBar,
      uParse,
      copyRight,
      FooterMenu,
      ArticleSkeleton
    },
    data() {
      return {
        contentID: null,
        groupID: null,
        detail: null,
        subList: null,
        mainArticleId: null,
        date: null,
        pageDelayFlag: false,
      }
    },
    computed: {
      dataReady() {
        return this.pageDelayFlag && this.detail
      }
    },
    methods: {
      async genArticleDetal() {
        let params = {
          groupID: this.groupID,
          contentID: this.contentID
        }
        this.detail = await getArticleDetail(params)
        this.detail.date = utils.formatTime(new Date(this.detail.created_at * 1000), true)
        this.mainArticleId = this.detail.id
      },
      async genSubArticle() {
        let params = {
          contentGroupID: 1533090852072321,
          groupID: this.groupID,
          contentID: this.contentID,
          mainArticleId: this.mainArticleId,
        }
        let res = await getArticleList(params, 10, 0, 'created_at')
        this.subList = res.objects
      },
      handleSubArticleClick(item) {
        wx.navigateTo({
          url: `/pages/index/articleDetail/index?group_id=${item.group_id}&id=${item.id}`
        })
      },
      preview(src, e) {
        console.log('preview', src, e)
      },
      navigate(href, e) {
        wx.setClipboardData({
          data: href,
          success: function(res) {
            wx.showToast({
              title: '不支持链接跳转，已复制到剪贴板',
              icon: 'none',
              duration: 2500,
            })
          }
        })
      }
    },
    async mounted() {
      setTimeout(() => {
        this.pageDelayFlag = true
      }, 1500)
      // this.contentID = 1561880472705483
      // this.groupID = 1533090852072321
      this.contentID = this.$root.$mp.query.id
      this.groupID = this.$root.$mp.query.group_id
      await this.genArticleDetal()
      await this.genSubArticle()
    },
    onShareAppMessage(res) {
      return {
        title: this.detail.title,
        path: `/pages/index/articleDetail/index?group_id=${this.groupID}&id=${this.contentID}`
      }
    },
  }
</script>
<style lang="scss" scoped>
  @import '../../../style/color';

  .banner {
    width: 100%;
    height: 335rpx;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .article-detail {
    padding: 20rpx 30rpx 80rpx;

    .title {
      font-size: 16px;
      font-weight: bold;

      .top {
        color: red;
        margin-right: 5upx
      }
    }

    .meta {
      display: flex;
      justify-content: space-between;
      flex-wrap: nowrap;
      width: 100%;
      margin: 20rpx 2rpx 0;

      .author {
        position: relative;
        height: 40rpx;
        width: 200rpx;

        img {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          display: inline-block;
          width: 40rpx;
          height: 40rpx;
        }

        .name {
          position: absolute;
          left: 50rpx;
          width: 220rpx;
          line-height: 40rpx;
          font-size: 10px;
          color: #000;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .date {
        line-height: 40rpx;
        font-size: 10px;
        color: $palette-text-gray;
      }
    }

    .content {
      padding: 20rpx 0 0;
    }

    .sub-article {
      color: #0e67fa;
      font-size: 16px;
      text-decoration: underline;
      margin: 25rpx 0 0 0;

      .sub-card {
        height: 60rpx;
        margin-bottom: 25rpx;

        img {
          display: inline-block;
          width: 60rpx;
          height: 60rpx;
          vertical-align: middle;
          margin-right: 10rpx;
        }

        .sub-title {
          line-height: 60rpx;
          display: inline-block;
          vertical-align: middle;
        }
      }
    }
  }

  .separator {
    width: 100%;
    height: 1rpx;
    margin-top: 15rpx;
    background-color: #eee;
  }

  .footer {
    position: fixed;
    bottom: 0;
  }

  .skeleton-mask {
    position: absolute;
    width: 100%;
    background: white;
    // z-index: 1;
  }
</style>
