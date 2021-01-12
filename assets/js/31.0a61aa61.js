(window.webpackJsonp=window.webpackJsonp||[]).push([[31],{568:function(t,a,s){"use strict";s.r(a);var n=s(8),e=Object(n.a)({},(function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h1",{attrs:{id:"whatsonchain-js库开发"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#whatsonchain-js库开发"}},[t._v("#")]),t._v(" WhatsOnChain JS库开发")]),t._v(" "),s("p",[t._v("WhatsOnChain是精益进取的BSV浏览器，还提供了初步的API。几个月之前我实现了初步的JS包装库。")]),t._v(" "),s("p",[s("a",{attrs:{href:"https://github.com/baryon/whatsonchain",target:"_blank",rel:"noopener noreferrer"}},[t._v("GitHub - baryon/whatsonchain: WhatsOnChain API JS Wrapper"),s("OutboundLink")],1)]),t._v(" "),s("p",[t._v("并且获得了官方的推荐")]),t._v(" "),s("p",[s("a",{attrs:{href:"https://developers.whatsonchain.com/#node-js",target:"_blank",rel:"noopener noreferrer"}},[t._v("WhatsOnChain API Reference - BSV API"),s("OutboundLink")],1)]),t._v(" "),s("p",[t._v("今天做了一个更新，主要是对API调用频度限制。目前没有API KEY的话，限制为每秒3个请求。")]),t._v(" "),s("p",[t._v("JS库后面使用axios作为http的核心库，因为频度限制的瓶颈，使用了")]),t._v(" "),s("p",[s("a",{attrs:{href:"https://github.com/kuitos/axios-extensions",target:"_blank",rel:"noopener noreferrer"}},[t._v("GitHub - kuitos/axios-extensions: 🍱 axios extensions lib, including throttle, cache, retry features etc..."),s("OutboundLink")],1)]),t._v(" "),s("p",[t._v("这个库似乎是蚂蚁金服的程序员们实现的，为axios支持了缓存，瓶颈和重试功能。")]),t._v(" "),s("p",[t._v("查看他的Github还发现了“乾坤”这个前端库。实现的概念是"),s("code",[t._v("微前端")])]),t._v(" "),s("p",[s("a",{attrs:{href:"https://github.com/umijs/qiankun",target:"_blank",rel:"noopener noreferrer"}},[t._v("GitHub - umijs/qiankun: 📦 🚀 Blazing fast, simple and completed solution for micro frontends."),s("OutboundLink")],1)]),t._v(" "),s("p",[t._v("WoC库使用")]),t._v(" "),s("div",{staticClass:"language-javascript extra-class"},[s("pre",{pre:!0,attrs:{class:"language-javascript"}},[s("code",[t._v("npm install whatsonchain "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("--")]),t._v("save\n")])])]),s("p",[t._v("支持几个初始化参数")]),t._v(" "),s("div",{staticClass:"language-javascript extra-class"},[s("pre",{pre:!0,attrs:{class:"language-javascript"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" woc "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("WhatsOnChain")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'testnet'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" \n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" \napiKey"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'your api key'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\nuserAgent"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'your user agent'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\nenableCache"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("true")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\ntimeout"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("30000")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),s("p",[t._v("看测试代码，包括了所有API的调用示例。")])])}),[],!1,null,null,null);a.default=e.exports}}]);