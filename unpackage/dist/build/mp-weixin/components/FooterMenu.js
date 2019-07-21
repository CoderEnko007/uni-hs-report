(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/FooterMenu"],{"19a9":function(t,n,e){"use strict";e.r(n);var o=e("a1b2"),c=e("2522");for(var i in c)"default"!==i&&function(t){e.d(n,t,function(){return c[t]})}(i);e("b921");var l=e("2877"),a=Object(l["a"])(c["default"],o["a"],o["b"],!1,null,"f7ceb7be",null);n["default"]=a.exports},2522:function(t,n,e){"use strict";e.r(n);var o=e("d05a"),c=e.n(o);for(var i in o)"default"!==i&&function(t){e.d(n,t,function(){return o[t]})}(i);n["default"]=c.a},9557:function(t,n,e){},a1b2:function(t,n,e){"use strict";var o=function(){var t=this,n=t.$createElement;t._self._c},c=[];e.d(n,"a",function(){return o}),e.d(n,"b",function(){return c})},b921:function(t,n,e){"use strict";var o=e("9557"),c=e.n(o);c.a},d05a:function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var o={name:"FooterMenu",props:["showCollectBtn","showExportBtn","collected","link"],data:function(){return{}},methods:{handleCopyLink:function(){console.log("copy",this.link),wx.setClipboardData({data:this.link,success:function(t){wx.showToast({icon:"none",title:"网页已复制到剪贴板"})}})},handleExportBtn:function(){this.$emit("exportClick")},handleCollect:function(){this.$emit("collectClick")},activeCollectIcon:function(){this.collected=!0},deactiveCollectIcon:function(){this.collected=!1}}};n.default=o}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/FooterMenu-create-component',
    {
        'components/FooterMenu-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("19a9"))
        })
    },
    [['components/FooterMenu-create-component']]
]);                
