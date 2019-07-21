(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/index/index"],{"1d41":function(t,e,n){"use strict";var i=function(){var t=this,e=t.$createElement;t._self._c},a=[];n.d(e,"a",function(){return i}),n.d(e,"b",function(){return a})},2695:function(t,e,n){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var i=n("2f62"),a=o(n("eaab")),r=n("6110");function o(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)if(Object.prototype.hasOwnProperty.call(t,n)){var i=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(t,n):{};i.get||i.set?Object.defineProperty(e,n,i):e[n]=t[n]}return e.default=t,e}function s(t){return u(t)||c(t)||l()}function l(){throw new TypeError("Invalid attempt to spread non-iterable instance")}function c(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}function u(t){if(Array.isArray(t)){for(var e=0,n=new Array(t.length);e<t.length;e++)n[e]=t[e];return n}}function f(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{},i=Object.keys(n);"function"===typeof Object.getOwnPropertySymbols&&(i=i.concat(Object.getOwnPropertySymbols(n).filter(function(t){return Object.getOwnPropertyDescriptor(n,t).enumerable}))),i.forEach(function(e){h(t,e,n[e])})}return t}function h(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var d=function(){return n.e("components/NavBar").then(n.bind(null,"661f"))},g=function(){return n.e("components/SwiperBanner").then(n.bind(null,"15cf"))},p=function(){return n.e("components/cmd-notice-bar/cmd-notice-bar").then(n.bind(null,"03a2"))},m=function(){return n.e("components/x-modal/x-modal").then(n.bind(null,"6d2d"))},v=function(){return n.e("components/RankBoard").then(n.bind(null,"8c84"))},y=function(){return n.e("components/TierList").then(n.bind(null,"298a"))},x=function(){return n.e("pages/index/components/articlePage").then(n.bind(null,"d804"))},b={components:{NavBar:d,SwiperBanner:g,cmdNoticeBar:p,xModal:m,RankBoard:v,TierList:y,articlePage:x},data:function(){return{hideModal:!0,refreshFlag:0,banners:[],report_date:"",noticeText:{text:"",animationData:[]},tabbar:[{id:"report",text:"日报"},{id:"article",text:"周报"}],activeIndex:0,currentTab:0,rankMode:a.default.gameMode,origRankList:[],rankData:{standard:[],wild:[],arena:[]},modeFilter:{selectedItem:0,list:[{text:"按胜率",value:"win_rate"},{text:"按热度",value:"popularity"}]},selectedGameType:"standard",tierList:[{name:"Tier 1",cname:"第1梯队",icon:"/static/icons-v2/tierlist-t1.png",list:[]},{name:"Tier 2",cname:"第2梯队",icon:"/static/icons-v2/tierlist-t2.png",list:[]},{name:"Tier 3",cname:"第3梯队",icon:"/static/icons-v2/tierlist-t3.png",list:[]},{name:"Tier 4",cname:"第4梯队",icon:"/static/icons-v2/tierlist-t4.png",list:[]}],tierListNum:0,rangePicker:{selectedItem:0,list:[{text:"全分段",rank_range:"All"},{text:"R5-R1分段",rank_range:"One_Through_Five"},{text:"传说分段",rank_range:"Legend_Only"}]},canvasWidth:375,canvasHeight:200}},computed:f({},(0,i.mapGetters)(["winWidth","winHeight","navHeight","noticeContent","decksName"]),{contentHeight:function(){return 0==this.activeIndex?578+60*this.tierListNum+10+"px":this.winHeight-this.navHeight-41+"px"},modePickerList:function(){return this.modeFilter.list.map(function(t){return t.text})},rangePickerList:function(){return this.rangePicker.list.map(function(t){return t.text})}}),methods:{compareFunction:function(t){return function(e,n){var i=t.replace("-","");return-1!==t.indexOf("-")?n[i]-e[i]:e[i]-n[i]}},initRankDataArray:function(){this.rankData={standard:[],wild:[],arena:[]}},sortRankData:function(t){var e=this,n=function(n){e.rankData.hasOwnProperty(n)&&(e.rankData[n]=t.filter(function(t){return t.game_type.toLowerCase()===n.toLowerCase()}),"win_rate"===e.modeFilter.list[e.modeFilter.selectedItem].value?e.rankData[n].sort(e.compareFunction("-win_rate")):"popularity"===e.modeFilter.list[e.modeFilter.selectedItem].value&&e.rankData[n].sort(e.compareFunction("-popularity")),e.rankData[n].map(function(t){t.win_rate=parseFloat(t.win_rate).toFixed(1),t.popularity=parseFloat(t.popularity).toFixed(1)}),e.rankData[n].push({}))};for(var i in this.rankData)n(i)},stopPullDown:function(e){e?(this.refreshFlag+=1,this.refreshFlag>=2&&(t.stopPullDownRefresh(),t.hideNavigationBarLoading())):(t.stopPullDownRefresh(),t.hideNavigationBarLoading())},genBanners:function(){var t=this;(0,r.getBanners)().then(function(e){t.banners=e.objects,t.stopPullDown(!0)}).catch(function(e){t.stopPullDown(!1),console.log(e)})},genNotice:function(){var t=this;this.noticeContent.hasOwnProperty("content")&&this.noticeContent.content.length>0?this.noticeText.text=this.noticeContent.content:this.$store.dispatch("getNotice").then(function(e){t.noticeText.text=e.content})},genRankData:function(){var t=this,e=(0,a.formatNowTime)(new Date);(0,r.getRankData)(e,null,27).then(function(e){t.initRankDataArray(),t.report_date=e.date,t.origRankList=e.list,t.sortRankData(t.origRankList),t.stopPullDown(!0)}).catch(function(e){t.stopPullDown(!1),console.log(e)})},genArchetypeList:function(){var t=this;this.tierListNum=0;var e={rankRange:this.rangePicker.list[this.rangePicker.selectedItem].rank_range};(0,r.getArchetypeList)(e).then(function(e){t.tierListNum=e.meta.total_count;var n=function(n){t.tierList.hasOwnProperty(n)&&(t.tierList[n].list=e.objects.filter(function(e){return e.tier===t.tierList[n].name}))};for(var i in t.tierList)n(i);t.stopPullDown(!0)}).catch(function(e){console.log(e),t.stopPullDown(!1)})},handleBannerClick:function(e){e.articleID&&t.navigateTo({url:"/pages/index/articleDetail/index?group_id=".concat(e.articleGroupID,"&id=").concat(e.articleID)})},handleNoticeClick:function(){this.hideModal=!1},handleTabBarClick:function(t){this.activeIndex=t.currentTarget.id,this.currentTab=this.activeIndex},swiperChange:function(t){this.currentTab=t.mp.detail.current,this.activeIndex=this.currentTab},handleModeChange:function(t){this.modeFilter.selectedItem=t.mp.detail.value,this.sortRankData(this.origRankList)},modeBtnClick:function(t){this.selectedGameType=t.mode},handleRankRangeChange:function(t){this.rangePicker.selectedItem=t.mp.detail.value,this.genArchetypeList()},handleExport:function(){console.log("handleExport"),t.showLoading({title:"日报生成中",mask:!0}),this.saveImageToPhotos()},handleTierClick:function(e){t.navigateTo({url:"/pages/decks/archetypeDetail/index?name=".concat(e.archetype_name)})},saveImageToPhotos:function(){var e=this;t.getSetting({success:function(n){n.authSetting["scope.writePhotosAlbum"]?(console.log("PhotosAlbum已授权"),e.drawRankCanvas()):t.authorize({scope:"scope.writePhotosAlbum",success:function(){e.drawRankCanvas()},fail:function(){t.hideLoading(),t.showModal({content:"您尚未打开相册使用权限，是否去设置打开？",confirmColor:"#433e88",success:function(e){e.confirm&&t.openSetting({success:function(t){console.log(t.authSetting)}})}})}})},fail:function(e){t.hideLoading(),t.showToast({title:"图片保存失败",icon:"none",duration:2e3})}})},drawRankCanvas:function(){var e=this,n=t.createCanvasContext("dailyReport"),i=0;this.canvasWidth=300+i,this.canvasHeight=720;var r=120;n.save(),n.setFillStyle("#fff"),n.fillRect(0,0,this.canvasWidth,r),n.restore(),n.save(),n.font="normal bold 12px sans-serif",n.setFillStyle("#433e88"),n.textAlign="center",n.fillText("微信小程序：炉石传说情报站",this.canvasWidth/2,20),n.setFillStyle("#000"),n.font="normal bold 16px sans-serif",n.fillText("卡组强度排行",this.canvasWidth/2,45),n.restore();var o=this.rangePicker.list[this.rangePicker.selectedItem].text;n.font="normal normal 12px sans-serif",n.textAlign="left",n.fillText("分段：",i+30,70),n.save(),n.font="normal bold 13px sans-serif",n.setFillStyle("red"),n.fillText(o,i+65,70),n.restore(),n.save(),n.font="normal normal 12px sans-serif",n.setFillStyle("#000"),n.textAlign="right";var l=new Date;n.fillText("时间："+a.default.formatNowTime(l),this.canvasWidth-i-30,70),n.restore(),n.textAlign="center",n.font="normal normal 13px sans-serif";var c=(this.canvasWidth-2*i)/4;n.fillText("强 度",c/2+i,95),n.fillText("卡 组",c+c/2+i,95),n.fillText("胜 率",2*c+c/2+i,95),n.fillText("热 度",3*c+c/2+i,95);var u=[{name:"第1梯队",height:0,num:0},{name:"第2梯队",height:0,num:0},{name:"第3梯队",height:0,num:0},{name:"第4梯队",height:0,num:0}],f={Druid:"#f79647",Hunter:"#9bbb56",Mage:"#b8dee9",Paladin:"#e6b8b8",Priest:"#e5e5e5",Rogue:"#ffff01",Shaman:"#538dd6",Warlock:"#cdc0da",Warrior:"#c5bd98"},h=0,d=25,g=(0,a.gradientColor)("#239c15","#297607",this.tierList[0].list.length+this.tierList[1].list.length),p=(0,a.gradientColor)("#889400","#ff5630",this.tierList[2].list.length+this.tierList[3].list.length),m=[].concat(s(g),s(p)),v=0;for(var y in this.tierList)if(this.tierList.hasOwnProperty(y)){var x=function(){if("__proto__"===y)return"continue";u[y].height=e.tierList[y].list.length*d+1,u[y].num=e.tierList[y].list.length;var t=0;y>0&&(t=h),h+=u[y].height,n.save(),n.setFillStyle("#fbf3e8"),n.fillRect(i,r+t-17,c,u[y].height),n.restore(),n.save(),n.font="normal bold 12px sans-serif",n.setFillStyle("#34383b"),n.fillText(u[y].name,c/2+i,r+t),n.restore();var a=e.tierList[y].list,o=function(o){if(a.hasOwnProperty(o)){if("__proto__"===o)return"continue";n.save(),n.setFillStyle(f[a[o].faction]),n.fillRect(i+c,r+t+o*d-17,c,d),n.setFillStyle("#000"),n.font="normal normal 12px sans-serif";var s=e.decksName.filter(function(t){return t.ename===a[o].archetype_name}),l=s.length>0?s[0].cname:a[o].archetype_name;n.fillText(l,c/2+i+c,r+t+o*d),n.restore(),n.save(),v%2===0?n.setFillStyle("#fff"):n.setFillStyle("#faf8f9"),n.fillRect(i+2*c,r+t+o*d-17,2*c,d),n.setFillStyle("#faf8f9"),n.restore(),n.save(),n.font="normal bold 12px sans-serif",n.setFillStyle(m[v++]),n.fillText(a[o].win_rate+"%",c/2+i+2*c,r+t+o*d),n.restore(),a[o].popularity1?n.fillText(a[o].popularity1.toFixed(1)+"%",c/2+i+3*c,r+t+o*d):n.fillText("暂无",c/2+i+3*c,r+t+o*d)}};for(var s in a)o(s);n.save(),n.setStrokeStyle("#ccc"),n.moveTo(i,r+t-17),n.lineTo(e.canvasWidth-i,r+t-17),n.stroke(),n.restore()}();if("continue"===x)continue}n.setStrokeStyle("#ccc"),n.moveTo(i,r+h-17),n.lineTo(this.canvasWidth-i,r+h-17),n.stroke(),n.save(),n.setFillStyle("#fff"),n.fillRect(0,r+h-17,this.canvasWidth,30),n.setFillStyle("#433e88"),n.font="normal bold 12px sans-serif",n.textAlign="right",n.fillText("数据源：HSReplay",this.canvasWidth-i-10,r+h),n.restore(),this.canvasHeight=r+h+10;var b=this;n.draw(!1,function(t){setTimeout(function(){b.saveCanvasImg()},1e3)})},saveCanvasImg:function(){var e=getCurrentPages();if("pages/index/index"===e[e.length-1].route){var n=281250/t.getSystemInfoSync().windowWidth,i=375*this.canvasHeight/this.canvasWidth*750/t.getSystemInfoSync().windowWidth;t.canvasToTempFilePath({canvasId:"dailyReport",destWidth:n,destHeight:i,fileType:"jpg",quality:1,success:function(e){t.saveImageToPhotosAlbum({filePath:e.tempFilePath,success:function(e){t.hideLoading(),t.showToast({title:"图片已保存到相簿",duration:2e3})},fail:function(e){t.hideLoading(),t.showToast({title:"图片保存失败",icon:"none",duration:2e3})}})},fail:function(e){console.log("error",e),t.hideLoading(),t.showToast({title:"图片生成失败",icon:"none",duration:2e3})}})}}},onLoad:function(){this.genBanners(),this.genRankData(),this.genArchetypeList(),this.genNotice()},onPullDownRefresh:function(){this.genBanners(),this.genRankData(),this.genArchetypeList(),this.$refs.articlePage.genDataList(!0)}};e.default=b}).call(this,n("543d")["default"])},affb:function(t,e,n){"use strict";var i=n("c6e8"),a=n.n(i);a.a},c5a7:function(t,e,n){"use strict";n.r(e);var i=n("2695"),a=n.n(i);for(var r in i)"default"!==r&&function(t){n.d(e,t,function(){return i[t]})}(r);e["default"]=a.a},c6e8:function(t,e,n){},d815:function(t,e,n){"use strict";n.r(e);var i=n("1d41"),a=n("c5a7");for(var r in a)"default"!==r&&function(t){n.d(e,t,function(){return a[t]})}(r);n("affb");var o=n("2877"),s=Object(o["a"])(a["default"],i["a"],i["b"],!1,null,"20c1185a",null);e["default"]=s.exports}},[["4ff1","common/runtime","common/vendor"]]]);