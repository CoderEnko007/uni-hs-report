(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["common/main"],{"2fce":function(t,n,i){"use strict";i.r(n);var e=i("ea1b");for(var o in e)"default"!==o&&function(t){i.d(n,t,function(){return e[t]})}(o);i("571b");var s,c,a=i("2877"),u=Object(a["a"])(e["default"],s,c,!1,null,null,null);n["default"]=u.exports},"48a8":function(t,n,i){},"571b":function(t,n,i){"use strict";var e=i("48a8"),o=i.n(e);o.a},a15f:function(t,n,i){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var e={data:function(){return{clientId:"ec59002ba0fc4c74bf50"}},methods:{Login:function(){this.$store.dispatch("Login").then(function(t){console.log("success",t)}).catch(function(t){console.log("fail",t)})},initDecksName:function(){this.$store.dispatch("getDecksName").then(function(t){})},initCardSeries:function(){this.$store.dispatch("getSeriesData").then(function(t){})},setNavHeight:function(){this.$store.dispatch("setNavHeight").then(function(t){})},setWinWidthHeight:function(){this.$store.dispatch("setWinWidthHeight").then(function(t){})},initSystemSetting:function(){this.$store.dispatch("setSystemSetting").then(function(t){})},setNotice:function(){this.$store.dispatch("getNotice").then(function(t){})}},onLaunch:function(){console.log("App Launch"),wx.BaaS=requirePlugin("sdkPlugin"),wx.BaaS.wxExtend(wx.login,wx.getUserInfo,wx.requestPayment),wx.BaaS.init(this.clientId),this.initSystemSetting(),this.initDecksName(),this.initCardSeries(),this.setNavHeight(),this.setWinWidthHeight(),this.setNotice(),this.Login()},onShow:function(){console.log("App Show")},onHide:function(){console.log("App Hide")}};n.default=e},ea1b:function(t,n,i){"use strict";i.r(n);var e=i("a15f"),o=i.n(e);for(var s in e)"default"!==s&&function(t){i.d(n,t,function(){return e[t]})}(s);n["default"]=o.a}},[["6c33","common/runtime","common/vendor"]]]);