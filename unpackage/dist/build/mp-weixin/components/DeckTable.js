(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/DeckTable"],{"0d18":function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var r=i(n("eaab")),a=n("2f62");function i(t){return t&&t.__esModule?t:{default:t}}function o(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{},r=Object.keys(n);"function"===typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(t){return Object.getOwnPropertyDescriptor(n,t).enumerable}))),r.forEach(function(e){c(t,e,n[e])})}return t}function c(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var u={name:"DeckTable",props:["selectedFaction","date","tableTitle","tableData","tableName"],data:function(){return{orderBy:"",normalOrder:"/static/icons-v2/rank-normal.png",upOrder:"/static/icons-v2/rank-up.png",downOrder:"/static/icons-v2/rank-down.png"}},computed:o({},(0,a.mapGetters)(["winWidth","winHeight"]),{genTableData:function(){return this.sortTableData(),this.tableData},genFactionIcon:function(){return r.default.faction[this.selectedFaction.id].image}}),methods:{compareFunction:function(t){return function(e,n){var r=t.replace("-","");return-1!==t.indexOf("-")?n[r]-e[r]:e[r]-n[r]}},handleOrderClick:function(t){this.orderBy.indexOf(t.id)>=0?this.orderBy="-"===this.orderBy.split("")[0]?t.id:"-"+t.id:this.orderBy="-"+t.id,this.sortTableData()},handleItemClick:function(t){this.$emit("itemClick",t)},sortTableData:function(){this.orderBy&&this.tableData.sort(this.compareFunction(this.orderBy))}}};e.default=u},"2c4e":function(t,e,n){},"4f6a":function(t,e,n){"use strict";var r=function(){var t=this,e=t.$createElement;t._self._c},a=[];n.d(e,"a",function(){return r}),n.d(e,"b",function(){return a})},"6a99":function(t,e,n){"use strict";var r=n("2c4e"),a=n.n(r);a.a},"74e4":function(t,e,n){"use strict";n.r(e);var r=n("0d18"),a=n.n(r);for(var i in r)"default"!==i&&function(t){n.d(e,t,function(){return r[t]})}(i);e["default"]=a.a},"9edf":function(t,e,n){"use strict";n.r(e);var r=n("4f6a"),a=n("74e4");for(var i in a)"default"!==i&&function(t){n.d(e,t,function(){return a[t]})}(i);n("6a99");var o=n("2877"),c=Object(o["a"])(a["default"],r["a"],r["b"],!1,null,"096e69f7",null);e["default"]=c.exports}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/DeckTable-create-component',
    {
        'components/DeckTable-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("9edf"))
        })
    },
    [['components/DeckTable-create-component']]
]);                
