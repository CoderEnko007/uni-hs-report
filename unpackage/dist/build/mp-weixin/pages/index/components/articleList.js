(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/index/components/articleList"],{"0531":function(t,n,e){"use strict";var o=e("b0c1"),r=e.n(o);r.a},"0880":function(t,n,e){"use strict";var o=function(){var t=this,n=t.$createElement;t._self._c},r=[];e.d(n,"a",function(){return o}),e.d(n,"b",function(){return r})},1418:function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var o={name:"uni-load-more",props:{status:{type:String,default:"more"},showIcon:{type:Boolean,default:!0},color:{type:String,default:"#777777"},contentText:{type:Object,default:function(){return{contentdown:"上拉显示更多",contentrefresh:"正在加载...",contentnomore:"没有更多数据了"}}}},data:function(){return{}}};n.default=o},"19a8":function(t,n,e){},2721:function(t,n,e){"use strict";e.r(n);var o=e("7ec0"),r=e("610e");for(var u in r)"default"!==u&&function(t){e.d(n,t,function(){return r[t]})}(u);e("0531");var c=e("2877"),a=Object(c["a"])(r["default"],o["a"],o["b"],!1,null,"9802f438",null);n["default"]=a.exports},"32ed":function(t,n,e){"use strict";e.r(n);var o=e("1418"),r=e.n(o);for(var u in o)"default"!==u&&function(t){e.d(n,t,function(){return o[t]})}(u);n["default"]=r.a},"3d45":function(t,n,e){"use strict";(function(t){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var o=e("2f62");r(e("7d2d"));function r(t){return t&&t.__esModule?t:{default:t}}function u(t){for(var n=1;n<arguments.length;n++){var e=null!=arguments[n]?arguments[n]:{},o=Object.keys(e);"function"===typeof Object.getOwnPropertySymbols&&(o=o.concat(Object.getOwnPropertySymbols(e).filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),o.forEach(function(n){c(t,n,e[n])})}return t}function c(t,n,e){return n in t?Object.defineProperty(t,n,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[n]=e,t}var a=function(){return e.e("components/load-more").then(e.bind(null,"e201"))},i={name:"articleList",props:["list","loading","nodata"],components:{loadMore:a},computed:u({},(0,o.mapGetters)(["winWidth","winHeight","navHeight"])),data:function(){return{more:!0,page:0}},methods:{handleBoardClick:function(n){t.navigateTo({url:"/pages/index/articleDetail/index?group_id=".concat(n.group_id,"&id=").concat(n.id)})},scrollToBottom:function(t){this.$emit("scrollToBottom")},scrollToTop:function(t){this.$emit("scrollToTop")}}};n.default=i}).call(this,e("543d")["default"])},"610e":function(t,n,e){"use strict";e.r(n);var o=e("3d45"),r=e.n(o);for(var u in o)"default"!==u&&function(t){e.d(n,t,function(){return o[t]})}(u);n["default"]=r.a},"7d2d":function(t,n,e){"use strict";e.r(n);var o=e("0880"),r=e("32ed");for(var u in r)"default"!==u&&function(t){e.d(n,t,function(){return r[t]})}(u);e("c984");var c=e("2877"),a=Object(c["a"])(r["default"],o["a"],o["b"],!1,null,null,null);n["default"]=a.exports},"7ec0":function(t,n,e){"use strict";var o=function(){var t=this,n=t.$createElement;t._self._c},r=[];e.d(n,"a",function(){return o}),e.d(n,"b",function(){return r})},b0c1:function(t,n,e){},c984:function(t,n,e){"use strict";var o=e("19a8"),r=e.n(o);r.a}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'pages/index/components/articleList-create-component',
    {
        'pages/index/components/articleList-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("2721"))
        })
    },
    [['pages/index/components/articleList-create-component']]
]);                
