import { getSetting, getArenaConfig } from "../../api/dbapi";

const settings = {
  state: {
    navHeight: null,
    tabHeight: null,
    barHeight: null,
    isIphoneX: false,
    winWidth: null,
    winHeight: null,
    showBubble: false,
    fbiVersion: null,
    fbiKey: null,
    fbiFlag: true,
    arenaTableID: 70488,
    card_resource: null,
    ifanr_arena_card_resource: false,
    deck_tile_resource: 'hsreplay',
    adsOpenFlag: true,
    insertAdsFlag: true,
    cardsInsertAdsFlag: true,
    adNotice: null,
    current_set: null,
    showRemoveAdsBtn: false,
    ifanrSettings: null,
    user_fuck_up_flag: false //false为不展示，true为展示
  },
  mutations: {
    setFuckupFlag: (state, val) => {
      state.user_fuck_up_flag = val
    },
    setAdsOpenFlag: (state, val) => {
      state.adsOpenFlag = val
    },
    setShowBubbleFlag: (state, val) => {
      state.showBubble = val
    },
    SET_INSERT_ADS_FLAG: (state, val) => {
      state.insertAdsFlag = val
    },
    SET_CARDS_INSERT_ADS_FLAG: (state, val) => {
      state.cardsInsertAdsFlag = val
    },
    SET_NAV_HEIGHT: (state, navHeight) => {
      state.navHeight = navHeight
    },
    SET_BAR_HEIGHT: (state, barHeight) => {
      state.barHeight = barHeight
    },
    SET_TAB_HEIGHT: (state, val) => {
      state.tabHeight = val
    },
    IS_IPHONE_X: (state) => {
      state.isIphoneX = true
    },
    SET_WIN_WIDTH: (state, val) => {
      state.winWidth = val
    },
    SET_WIN_HEIGHT: (state, val) => {
      state.winHeight = val
    },
    SET_FBI_VERSION: (state, val) => {
      state.fbiVersion = val
    },
    SET_FBI_KEY: (state, val) => {
      state.fbiKey = val
    },
    SET_FBI_FLAG: (state, val) => {
      state.fbiFlag = val
    },
    SET_CARD_RESOURCE: (state, val) => {
      state.card_resource = val
    },
    SET_ARENA_TABLEID: (state, val) => {
      state.arenaTableID = val
    },
    SET_IFANR_ARENA_CARD_RESOURCE: (state, val) => {
      state.ifanr_arena_card_resource = val
    },
    SET_DECK_TILE_RESOURCE: (state, val) => {
      state.deck_tile_resource = val
    },
    SET_AD_NOTICE: (state, val) => {
      state.adNotice = val
    },
    SET_CURRENT_SET: (state, val) => {
      state.current_set = val
    },
    SET_SHOW_REMOVE_ADS_FLAG: (state, val) => {
      state.showRemoveAdsBtn = val
    },
    SET_IFANR_SETTINGS: (state, val) => {
      state.ifanrSettings = val
    }
  },
  actions: {
    resetInsertAdsFlag({commit, state}) {
      return new Promise((reolve, reject) => {
        commit('SET_INSERT_ADS_FLAG', false)
        setTimeout(() => {
          commit('SET_INSERT_ADS_FLAG', true)
        }, 1500*60)
      })
    },
    resetCardsInsertAdsFlag({commit, state}) {
      return new Promise((reolve, reject) => {
        commit('SET_CARDS_INSERT_ADS_FLAG', false)
        setTimeout(() => {
          commit('SET_CARDS_INSERT_ADS_FLAG', true)
        }, 1500*60)
      })
    },
    setNavHeight({commit, state}) {
      return new Promise((resolve, reject) => {
        wx.getSystemInfo({
          success: res => {
            //导航高度
            let wWidth = res.windowWidth
            // let navHeight = res.statusBarHeight + (92*wWidth/750)/2;
            // let navHeight = res.statusBarHeight + 46;
            // let navHeight = res.statusBarHeight*2+25
            let navHeight = 88;
            commit('SET_NAV_HEIGHT', navHeight)
            commit('SET_BAR_HEIGHT', res.statusBarHeight)
            console.log(`navHeight:${navHeight}, statusBarHeight:${res.statusBarHeight}`)
            console.log(res.model)
            if (res.model.indexOf('iPhone X')>-1) {
              commit('IS_IPHONE_X')
            }
            resolve(navHeight)
          }, fail(err) {
            console.log(err);
            reject(err)
          }
        })
      })
    },
    setWinWidthHeight({commit, state}) {
      return new Promise((resolve, reject) => {
        wx.getSystemInfo({
          success: res => {
            commit('SET_WIN_WIDTH', res.windowWidth)
            commit('SET_WIN_HEIGHT', res.windowHeight)
            commit('SET_TAB_HEIGHT', res.screenHeight-res.windowHeight)
            console.log(`screenWidth:${res.screenWidth}, screenHeight:${res.screenHeight}`)
            console.log(`windowWidth:${res.windowWidth}, windowHeight:${res.windowHeight}`)
            resolve(res)
          }, fail(err) {
            console.log(err)
            reject(err)
          }
        })
      })
    },
    setSystemSetting({commit, state}) {
      return new Promise((resolve, reject) => {
        getSetting().then(res => {
          if (res.objects.length > 0) {
            commit('SET_FBI_VERSION', res.objects[0].fbi_version)
            commit('SET_FBI_KEY', res.objects[0].fbi_key)
            commit('SET_FBI_FLAG', res.objects[0].fbi_card_switch)
            commit('SET_CARD_RESOURCE', res.objects[0].card_resource)
            commit('SET_ARENA_TABLEID', res.objects[0].arena_table_id)
            commit('SET_IFANR_ARENA_CARD_RESOURCE', res.objects[0].ifanr_arena_card_resource)
            commit('SET_DECK_TILE_RESOURCE', res.objects[0].deck_tile_resource)
            commit('SET_AD_NOTICE', res.objects[0].ad_notice)
            commit('SET_CURRENT_SET', res.objects[0].current_set)
            commit('SET_SHOW_REMOVE_ADS_FLAG', res.objects[0].showRemoveAdsBtn)
            commit('SET_IFANR_SETTINGS', res.objects[0])
          }
          resolve(res.objects)
        }).catch(err => {
          console.log(err)
          reject(err)
        })
      })
    },
  }
}

export default settings
