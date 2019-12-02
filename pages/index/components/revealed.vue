<template>
  <div class="container">
    <div class="faction-filter">
      <HeroesPanel :selected="selectedFaction" :dataList="factionIcons" @itemClick="handleIconsClick"></HeroesPanel>
    </div>
    <div class="cards_list">
      <CardList :list="cardsList"
                @cardClick="handleCardClick"
                @scrollToBottom="scrollToBottom"
                :largeImg='false'
                :noTabBar='true'
                :loading="more"
                :nodata="!more&&!cardsList.length"></CardList>
    </div>
  </div>
</template>

<script>
import utils from '@/utils'
import { mapGetters } from 'vuex'
import { getRevealCardsList } from '@/api/dbapi.js'
import HeroesPanel from '@/components/HeroesPanel'
import loadMore from '@/components/load-more'
import NavBar from '@/components/NavBar'
import CardList from '@/components/CardList'

export default {
  name: 'RevealedPage',
  components: {
    NavBar,
    HeroesPanel,
    loadMore,
    CardList
  },
  data() {
    return {
      selectedFaction: '',
      factionIcons: [],
      cardsList: [],
      page: 0,
      more: true,
    }
  },
  methods: {
    async initCardList(init) {
      if (init) {
        this.page = 0
        this.more = true
        this.cardsList = []
      }
      let res = await getRevealCardsList({
        card_detail: true,
        faction: this.selectedFaction,
        collectible: 1
      }, 21, this.page, 'cost')
      let list = res.objects.map(item => {
        return {dbfId: item.dbfId, name: item.name, image: item.img_card_link}
      })
      if (init) {
        this.cardsList = list
      } else {
        this.cardsList = this.cardsList.concat(list)
      }
      let emptyNum = this.cardsList.length % 3
      if(emptyNum) {
        for (let i=0; i<(3-emptyNum); i++) {
          this.cardsList.push({})
        }
      }
      if (this.cardsList.length >= res.meta.total_count) {
        this.more = false
      }
    },
    handleIconsClick(item) {
      if (this.selectedFaction === item.id) {
        this.selectedFaction = ''
      } else {
        this.selectedFaction = item.id
      }
      // this.filter.faction = this.selectedFaction
      this.initCardList(true)
    },
    genFactionIcons() {
      this.factionIcons = []
      let factions = {
          'Druid': { name: '德鲁伊', image: '/static/heroIcons/druid.png'},
          'Hunter': { name: '猎人', image: '/static/heroIcons/hunter.png'},
          'Mage': { name: '法师', image: '/static/heroIcons/mage.png'},
          'Paladin': { name: '圣骑士', image: '/static/heroIcons/paladin.png'},
          'Priest': { name: '牧师', image: '/static/heroIcons/priest.png'},
          'Rogue': { name: '潜行者', image: '/static/heroIcons/rogue.png'},
          'Shaman': { name: '萨满', image: '/static/heroIcons/shaman.png'},
          'Warlock': { name: '术士', image: '/static/heroIcons/warlock.png'},
          'Warrior': { name: '战士', image: '/static/heroIcons/warrior.png'},
          'Neutral': { name: '中立', image: '/static/heroIcons/neutral.jpg'}
      }
      for (let key in factions) {
        if (factions.hasOwnProperty(key)) {
          this.factionIcons.push({
            id: key,
            name: factions[key].name,
            image: factions[key].image
          })
        }
      }
    },
    handleCardClick(item, index) {
      if (!item.dbfId) {
        return
      }
      wx.navigateTo({
        url: `/pages/cards/revealCardDetail/index?id=${item.dbfId}`
      })
    },
    scrollToBottom() {
      if (!this.more) return false
      this.page += 1
      this.initCardList(false)
    },
  },
  mounted() {
    console.log('revealed mounted')
    this.genFactionIcons()
    this.initCardList(true)
  }
}
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  .faction-filter {
    padding: 0 30rpx 20rpx;
    box-shadow: 0 1rpx 10rpx -6rpx #000;
  }
  .cards_list {
    position: fixed;
    width: 100%;
    height: 100%;
  }
}
</style>
