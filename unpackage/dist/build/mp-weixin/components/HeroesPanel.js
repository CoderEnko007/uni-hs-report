(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/HeroesPanel"],{1616:function(t,e,n){"use strict";n.r(e);var a=n("32e4"),c=n("9a9d");for(var i in c)"default"!==i&&function(t){n.d(e,t,function(){return c[t]})}(i);n("2159");var u=n("2877"),r=Object(u["a"])(c["default"],a["a"],a["b"],!1,null,"3ceb791b",null);e["default"]=r.exports},"1b6a":function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a={name:"HeroesPanel",props:["dataList","selected"],data:function(){return{selectedFaction:"Druid"}},methods:{itemClick:function(t){this.selectedFaction=t.id,this.$emit("itemClick",t)}},watch:{selected:function(t){this.selectedFaction=t}}};e.default=a},2159:function(t,e,n){"use strict";var a=n("8fd3"),c=n.n(a);c.a},"32e4":function(t,e,n){"use strict";var a=function(){var t=this,e=t.$createElement;t._self._c},c=[];n.d(e,"a",function(){return a}),n.d(e,"b",function(){return c})},"8fd3":function(t,e,n){},"9a9d":function(t,e,n){"use strict";n.r(e);var a=n("1b6a"),c=n.n(a);for(var i in a)"default"!==i&&function(t){n.d(e,t,function(){return a[t]})}(i);e["default"]=c.a}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/HeroesPanel-create-component',
    {
        'components/HeroesPanel-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("1616"))
        })
    },
    [['components/HeroesPanel-create-component']]
]);                
