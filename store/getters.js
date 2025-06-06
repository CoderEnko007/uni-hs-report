const getters = {
  openID: state => state.user.openID,
  userInfo: state => state.user.userInfo,
  series: state => state.cards.series,
  heroesID: state => state.cards.heroesID,
  decksName: state => state.cards.decksName,
  collectedDecks: state => state.cards.collectedDecks,
  archetypeList: state => state.cards.archetypeList,
  noticeContent: state => state.cards.noticeContent,
  deckTabFilter: state => state.cards.deckTabFilter,
  cardsPageParams: state => state.cards.cardsPageParams,
  entourageParams: state => state.cards.entourageParams,
  navHeight: state => state.settings.navHeight,
  tabHeight: state => state.settings.tabHeight,
  barHeight: state => state.settings.barHeight,
  isIphoneX: state => state.settings.isIphoneX,
  winWidth: state => state.settings.winWidth,
  winHeight: state => state.settings.winHeight,
  showBubble: state => state.settings.showBubble,
  adsOpenFlag: state => state.settings.adsOpenFlag,
  insertAdsFlag: state => state.settings.insertAdsFlag,
  cardsInsertAdsFlag: state => state.settings.cardsInsertAdsFlag,
  fbiVersion: state => state.settings.fbiVersion,
  fbiKey: state => state.settings.fbiKey,
  fbiFlag: state => state.settings.fbiFlag,
  card_resource: state => state.settings.card_resource,
  ifanr_arena_card_resource: state => state.settings.ifanr_arena_card_resource,
  deck_tile_resource: state => state.settings.deck_tile_resource,
  arenaTableID: state => state.settings.arenaTableID,
  adNotice: state => state.settings.adNotice,
  currentSet: state => state.settings.current_set,
  showRemoveAdsBtn: state => state.settings.showRemoveAdsBtn,
  ifanrSettings: state => state.settings.ifanrSettings,
  user_fuck_up_flag: state => state.settings.user_fuck_up_flag,
  show_card_desc: state => state.settings.show_card_desc,
  compareDeck1: state => state.compare.compareDeck1,
  compareDeck2: state => state.compare.compareDeck2
}

export default getters
