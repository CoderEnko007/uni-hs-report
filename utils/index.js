const adsOpenFlag = true

function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (date, full=false) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute].map(formatNumber).join(':')

  if (full) {
    return `${t1} ${t2}`
  } else {
    return year+'-'+formatNumber(month)+'-'+formatNumber(day)
  }
}

export function formatTimerTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  
  return `${formatNumber(month)}月${formatNumber(day)}日 ${formatNumber(hour)}:${formatNumber(minute)}:${formatNumber(second)}`
}

export function formatNowTime(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const time = [year, month, day].map(formatNumber).join('-')

  return `${time}`
}

export function timesFun (timesData) {
    //如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
    var dateBegin = new Date(timesData);//将-转化为/，使用new Date
    var dateEnd = new Date();//获取当前时间
    var dateDiff = dateEnd.getTime() - dateBegin.getTime();//时间差的毫秒数
    var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));//计算出相差天数
    var leave1 = dateDiff % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000))//计算出小时数
    //计算相差分钟数
    var leave2 = leave1 % (3600 * 1000)    //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000))//计算相差分钟数
    //计算相差秒数
    var leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数
    var seconds = Math.round(leave3 / 1000);
    var timesString = '';

    if (dayDiff <= 3) {
      if (dayDiff != 0) {
          timesString = dayDiff + '天之前';
      } else if (dayDiff == 0 && hours != 0) {
          timesString = hours + '小时之前';
      } else if (dayDiff == 0 && hours == 0) {
          timesString = minutes + '分钟之前';
      }
      return timesString
    } else {
      return formatTime(new Date(timesData))
    }
}

export function getCardPicture(_this, id, golden, fbigameFlag, version, key) {
  if (!fbigameFlag) {
    return gen512CardsImageURL(id)
  }
  // const version = 'v9'
  // const key = "Fbigame"
  const now = new Date()
  const baseURL = "https://images.fbigames.com"
  let time = [now.getFullYear(), now.getMonth()+1, now.getDate()].join('-')
  let formatTime = new Date(time).getTime()/1000 + 365 * 24 * 60 * 60;
  let filename = ''
  if (golden) {
    filename = `/hs/${version}_premium/${id}_premium.png`
  } else {
    filename = `/hs/${version}/${id}.png`
  }
  let str = `${filename}-${formatTime}-0-0-${key}`
  let md5 = _this.$md5(str)
  let auth_key = `${formatTime}-0-0-${md5}`
  return `${baseURL}${filename}?auth_key=${auth_key}`
}

export function ShadeColor(colorMAX,colorMIN,num){
  colorMAX=colorMAX.toLowerCase();
  colorMIN=colorMIN.toLowerCase();
  let RegHex = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  if(RegHex.test(colorMAX)&&/^rgb/.test(colorMAX)){
    colorMAX="rgb(221,221,221)"
  }else if(RegHex.test(colorMIN)&&/^rgb/.test(colorMIN)){
    colorMIN="rgb(116,116,116)"
  }
  if(RegHex.test(colorMAX)){
    colorMAX=colorMAX.colorRgb()
  }
  if(RegHex.test(colorMIN)){
    colorMIN=colorMIN.colorRgb()
  }

  colorMAX=colorMAX.slice(4,-1).split(",")
  colorMIN=colorMIN.slice(4,-1).split(",")
  console.log(colorMIN);
  let colors= [];
  //默认的最深颜色
  let red = colorMAX[0]-0,green = colorMAX[1]-0, blue = colorMAX[2]-0;
  //最浅颜色是239,239,239 比如：最浅颜色的red是 239 则差值为239-134=105
  let maxRed = colorMIN[0]-0,maxGreen = colorMIN[1]-0,maxBlue = colorMIN[2]-0;
  let level = num;
  while(level--) {
    colors.push( 'rgb('+red +','+green+','+blue+')');
    red += parseInt(maxRed/num);
    green += parseInt(maxGreen/num);
    blue += parseInt(maxBlue/num);
  }
  return colors;
}

const cardsBaseURL = 'https://art.hearthstonejson.com/v1/render/latest/zhCN/256x/'
const cardsBaseURL512 = 'https://art.hearthstonejson.com/v1/render/latest/zhCN/512x/'
const cardsTileURL = 'https://art.hearthstonejson.com/v1/tiles/'
const fbiCardsTileURL = 'https://static.fbigames.com/resource/tiles/'
const iFanrCardsTileURL = 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/'
const cardsOrigURL = 'https://art.hearthstonejson.com/v1/256x/'
// const dustImage = 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1g2xiBmlyPDaVLks.png'
const dustImage = '/static/icons-v2/dust.png'

export function genCardsImageURL(hsId) {
  return cardsBaseURL+hsId+'.png'
}
export function gen512CardsImageURL(hsId) {
  return cardsBaseURL512+hsId+'.png'
}
export function genOrigImageURL(hsId) {
  return cardsOrigURL+hsId+'.jpg'
}
export function genTileImageURL(hsId, source) {
  if (source === 'fbi') {
    return fbiCardsTileURL+hsId+'.jpg'
  } else {
    return cardsTileURL+hsId+'.png'
  }
}
export function iFanrTileImageURL(tile) {
  return iFanrCardsTileURL+tile
}
export function deckModeImg(mode) {
  if (mode.toLowerCase() === 'standard') {
    return '/static/icons-v2/standard_1.png'
  } else if (mode.toLowerCase() === 'wild') {
    return '/static/icons-v2/wild_1.png'
  } else if (mode.toLowerCase() === 'twist') {
    return '/static/icons-v2/twist_1.png'
  } else {
    return ''
  }
}

export const getComponentByTag = (parent, tag) => {
  for (let c of parent.$children) {
    if (c.$options._componentTag === tag) {
      return c
    }
  }
}
export function translateDeckName(decksList, decksName) {
  for (let index in decksList) {
    if (decksList.hasOwnProperty(index)) {
      let temp = decksName.filter(item => {
        return item.ename === decksList[index].deck_name
      })
      if (temp[0] && temp[0].cname) {
        decksList[index].cname = temp[0].cname
      } else {
        decksList[index].cname = decksList[index].deck_name
      }
    }
  }
  return decksList
}

export function getImageInfoAsync(url) {
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: url,
      success: res => {
        resolve(res)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

/*
// startColor：开始颜色hex
// endColor：结束颜色hex
// step:几个阶级（几步）
*/
export function gradientColor(startColor,endColor,step){
  let startRGB = colorToRgb(startColor);//转换为rgb数组模式
  let startR = startRGB[0];
  let startG = startRGB[1];
  let startB = startRGB[2];

  let endRGB = colorToRgb(endColor);
  let endR = endRGB[0];
  let endG = endRGB[1];
  let endB = endRGB[2];

  let sR = (endR-startR)/step;//总差值
  let sG = (endG-startG)/step;
  let sB = (endB-startB)/step;

  let colorArr = [];
  for(let i=0;i<step;i++){
    //计算每一步的hex值
    let hex = colorToHex('rgb('+parseInt((sR*i+startR))+','+parseInt((sG*i+startG))+','+parseInt((sB*i+startB))+')');
    colorArr.push(hex);
  }
  return colorArr;
}

// 将hex表示方式转换为rgb表示方式(这里返回rgb数组模式)
function colorToRgb(sColor){
  let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  sColor = sColor.toLowerCase();
  if(sColor && reg.test(sColor)){
    if(sColor.length === 4){
      let sColorNew = "#";
      for(let i=1; i<4; i+=1){
        sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));
      }
      sColor = sColorNew;
    }
    //处理六位的颜色值
    let sColorChange = [];
    for(let i=1; i<7; i+=2){
      sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));
    }
    return sColorChange;
  }else{
    return sColor;
  }
};

// 将rgb表示方式转换为hex表示方式
function colorToHex(rgb){
  let _this = rgb;
  let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  if(/^(rgb|RGB)/.test(_this)){
    let aColor = _this.replace(/(?:\(|\)|rgb|RGB)*/g,"").split(",");
    let strHex = "#";
    for(let i=0; i<aColor.length; i++){
      let hex = Number(aColor[i]).toString(16);
      hex = hex<10 ? 0+''+hex :hex;// 保证每个rgb的值为2位
      if(hex === "0"){
        hex += hex;
      }
      strHex += hex;
    }
    if(strHex.length !== 7){
      strHex = _this;
    }

    return strHex;
  }else if(reg.test(_this)){
    let aNum = _this.replace(/#/,"").split("");
    if(aNum.length === 6){
      return _this;
    }else if(aNum.length === 3){
      let numHex = "#";
      for(let i=0; i<aNum.length; i+=1){
        numHex += (aNum[i]+aNum[i]);
      }
      return numHex;
    }
  }else{
    return _this;
  }
}

function deepCopy(o) {
  if (o instanceof Array) {
    let n = [];
    for (let i = 0; i < o.length; ++i) {
      n[i] = deepCopy(o[i]);
    }
    return n;

  } else if (o instanceof Object) {
    let n = {}
    for (let i in o) {
      n[i] = deepCopy(o[i]);
    }
    return n;
  } else {
    return o;
  }
}

function toThousands(num) {
  return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
}

const faction = {
  'Druid': { name: '德鲁伊', shortName: '德', bgImage: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1jfbf9STGxeT3Wy5.jpg', bgImage1: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1jfbdCURM4MDXXal.jpg', image: '/static/heroIcons/druid.png', image1: '/static/heroIcons/druid-1.jpg', image2: '/static/heroIcons/druid-2.jpg'},
  'Hunter': { name: '猎人', shortName: '猎', bgImage: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1jfbf9jvLoBl5N73.jpg', bgImage1: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1jfbdCsecFZ9adKD.jpg', image: '/static/heroIcons/hunter.png', image1: '/static/heroIcons/hunter-1.jpg', image2: '/static/heroIcons/hunter-2.jpg'},
  'Mage': { name: '法师', shortName: '法', bgImage: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1jfbfAtwmQwp9FwS.jpg', bgImage1: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1jfbdCP0PJFMdsmu.jpg', image: '/static/heroIcons/mage.png', image1: '/static/heroIcons/mage-1.jpg', image2: '/static/heroIcons/mage-2.jpg'},
  'Paladin': { name: '圣骑士', shortName: '骑', bgImage: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1jfbfALe26GDEHR9.jpg', bgImage1: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1jfbdCDrmv6JlF7c.jpg', image: '/static/heroIcons/paladin.png', image1: '/static/heroIcons/paladin-1.jpg', image2: '/static/heroIcons/paladin-2.jpg'},
  'Priest': { name: '牧师', shortName: '牧', bgImage: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1jfbfAMdc4qZUtva.jpg', bgImage1: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1jfbdCzq8ZJ1Au99.jpg', image: '/static/heroIcons/priest.png', image1: '/static/heroIcons/priest-1.jpg', image2: '/static/heroIcons/priest-2.jpg'},
  'Rogue': { name: '潜行者', shortName: '贼', bgImage: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1jfbfAMks6tsdFY7.jpg', bgImage1: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1jfbdCMWYb5DeXP4.jpg', image: '/static/heroIcons/rogue.png', image1: '/static/heroIcons/rogue-1.jpg', image2: '/static/heroIcons/rogue-2.jpg'},
  'Shaman': { name: '萨满', shortName: '萨', bgImage: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1jfbfAmJwEv1mgf0.jpg', bgImage1: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1jfbdDtdGiOQJshX.jpg', image: '/static/heroIcons/shaman.png', image1: '/static/heroIcons/shaman-1.jpg', image2: '/static/heroIcons/shaman-2.jpg'},
  'Warlock': { name: '术士', shortName: '术', bgImage: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1jfbfAv8vsg1QJg2.jpg',bgImage1: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1jfbdDtyGgnVllX0.jpg', image: '/static/heroIcons/warlock.png', image1: '/static/heroIcons/warlock-1.jpg', image2: '/static/heroIcons/warlock-2.jpg'},
  'Warrior': { name: '战士', shortName: '战', bgImage: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1jfbfADd5BwIMNqU.jpg', bgImage1: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1jfbdDGl6vGDNJdQ.jpg', image: '/static/heroIcons/warrior.png', image1: '/static/heroIcons/warrior-1.jpg', image2: '/static/heroIcons/warrior-2.jpg'},
  'DemonHunter': { name: '恶魔猎手', shortName: 'DH', bgImage: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1jfbf9hdDn6CNuRb.jpg', bgImage1: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1jfbdCJVfo7UDhHL.jpg', image: '/static/heroIcons/demonhunter.png', image1: '/static/heroIcons/dh-1.jpg', image2: '/static/heroIcons/dh-2.jpg'},
  'DeathKnight': { name: '死亡骑士', shortName: '死骑', bgImage: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1p0fNYBE9FPIigxs.jpg', bgImage1: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1p0fNYWC8Tliauwy.jpg', image: '/static/heroIcons/deathknight.png', image1: '/static/heroIcons/dk-1.jpg', image2: '/static/heroIcons/dk-2.jpg'},
}

const mode = [
  {id: 'Standard', name: '标准模式'},
  {id: 'Wild', name: '狂野模式'},
  {id: 'Tiwst', name: '幻变模式'},
]

const rarity = {
  'free': {name: '基础', color: '#5e5e5e'},
  'common': {name: '普通', color: '#5e5e5e'},
  'rare': {name: '稀有', color: '#1768c6'},
  'epic': {name: '史诗', color: '#705dc7'},
  'legendary': {name: '传说', color: '#f5a623'}
}

const type = {
  'MINION': {name: '随从'},
  'SPELL': {name: '法术'},
  'WEAPON': {name: '武器'},
  'HERO': {name: '英雄'},
  'HERO_POWER': {name: '英雄技能'},
  'LOCATION': {name: '地标'}
}

const race = {
  'ALL': {name: '全部'},
  'DRAGON': {name: '龙'},
  'DEMON': {name: '恶魔'},
  'PIRATE': {name: '海盗'},
  'BEAST': {name: '野兽'},
  'TOTEM': {name: '图腾'},
  'MURLOC': {name: '鱼人'},
  'ELEMENTAL': {name: '元素'},
  'MECHANICAL': {name: '机械'},
  'QUILBOAR': {name: '野猪人'},
  'NAGA': {name: '娜迦'},
  'UNDEAD': {name: '亡灵'},
  'DRAENEI': {name: '德莱尼'}
}

// 弃用，现在从服务器上获取heroesID
const heroesID = {
  'Druid': [274, 50484, 57761],
  'Hunter': [31, 2826, 57759, 60335],
  'Mage': [637, 39117, 2829, 57765],
  'Paladin': [671, 53187, 46116, 2827, 57757],
  'Priest': [813, 54816, 41887, 57767],
  'Rogue': [930, 40195, 57755],
  'Shaman': [1066, 55963, 53237, 40183, 57753, 60673],
  'Warlock': [893, 51834, 47817, 57763],
  'Warrior': [7, 2828, 57751, 58787],
  'DemonHunter': [56550, 60238],
  'DeathKnight': [78065, 78066]
}

const gameMode = [
  {mode: 'standard', icon: '/static/icons-v2/standard.png', active_icon: '/static/icons-v2/standard_active.png', text: '标准模式'},
  {mode: 'wild', icon: '/static/icons-v2/wild.png', active_icon: '/static/icons-v2/wild_active.png', text: '狂野模式'},
  // {mode: 'classic', icon: '/static/icons-v2/classic.png', active_icon: '/static/icons-v2/classic_active.png', text: '经典模式'},
  {mode: 'arena', icon: '/static/icons-v2/arena.png', active_icon: '/static/icons-v2/arena_active.png', text: '竞技场'},
  // {mode: 'duels', icon: '/static/icons-v2/duels.png', active_icon: '/static/icons-v2/duels_active.png', text: '对决模式'},
  // {mode: 'twist', icon: '/static/icons-v2/twist.png', active_icon: '/static/icons-v2/twist_active.png', text: '幻变模式'},
]

const rankMode = [
  {mode: 'Standard', icon: '/static/icons-v2/standard.png', active_icon: '/static/icons-v2/standard_active.png', text: '标准'},
  {mode: 'Wild', icon: '/static/icons-v2/wild.png', active_icon: '/static/icons-v2/wild_active.png', text: '狂野'},
  // {mode: 'Twist', icon: '/static/icons-v2/twist.png', active_icon: '/static/icons-v2/twist_active.png', text: '幻变'},
]

const factionColors = ['#ff7d0a', '#abd473', '#69ccf0', '#f58cba', '#ccc', '#fff569', '#0070de', '#9482c9', '#c79c6e', '#A330C9', '#C41F3B']

const battlegroundMinionType = [
  {id: 15, name: '恶魔'},
  {id: 17, name: '机械'},
  {id: 26, name: '全部'},
  {id: 20, name: '野兽'},
  {id: 24, name: '龙'},
  {id: 14, name: '鱼人'},
  {id: 23, name: '海盗'},
  {id: 18, name: '元素'}
]

const battlegroundKeywords = [
  {id: 61, name: '超杀', ename: 'overkill'},
  {id: 1, name: '嘲讽', ename: 'taunt'},
  {id: 4, name: '冲锋', ename: 'charge'},
  {id: 66, name: '磁力', ename: 'modular'},
  {id: 21, name: '发现', ename: 'discover'},
  {id: 11, name: '风怒', ename: 'windfury'},
  {id: 78, name: '复生', ename: 'reborn'},
  {id: 34, name: '进化', ename: 'adapt'},
  {id: 32, name: '剧毒', ename: 'poisonous'},
  {id: 17, name: '免疫', ename: 'immune'},
  {id: 3, name: '圣盾', ename: 'divine-shield'},
  {id: 12, name: '亡语', ename: 'deathrattle'},
  {id: 8, name: '战吼', ename: 'battlecry'}
]

export default {
  adsOpenFlag,
  formatNumber,
  formatTime,
  formatTimerTime,
  formatNowTime,
  timesFun,
  genCardsImageURL,
  getComponentByTag,
  translateDeckName,
  deckModeImg,
  getCardPicture,
  deepCopy,
  faction,
  mode,
  rarity,
  type,
  race,
  heroesID,
  factionColors,
  image: {
    dustImage
  },
  gameMode,
  rankMode,
  battlegroundMinionType,
  battlegroundKeywords,
  toThousands
}
