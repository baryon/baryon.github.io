---
title: WhatsOnChain JS库开发
summary: WhatsOnChain是精益进取的BSV浏览器，还提供了初步的API
date: 2020-11-06 13:17
category: 开发
tags:
- 比特币
- 环境

---

# WhatsOnChain JS库开发

WhatsOnChain是精益进取的BSV浏览器，还提供了初步的API。几个月之前我实现了初步的JS包装库。

[GitHub - baryon/whatsonchain: WhatsOnChain API JS Wrapper](https://github.com/baryon/whatsonchain)

并且获得了官方的推荐

[WhatsOnChain API Reference - BSV API](https://developers.whatsonchain.com/#node-js)

今天做了一个更新，主要是对API调用频度限制。目前没有API KEY的话，限制为每秒3个请求。

JS库后面使用axios作为http的核心库，因为频度限制的瓶颈，使用了

[GitHub - kuitos/axios-extensions: 🍱 axios extensions lib, including throttle, cache, retry features etc...](https://github.com/kuitos/axios-extensions)

这个库似乎是蚂蚁金服的程序员们实现的，为axios支持了缓存，瓶颈和重试功能。

查看他的Github还发现了“乾坤”这个前端库。实现的概念是`微前端`

[GitHub - umijs/qiankun: 📦 🚀 Blazing fast, simple and completed solution for micro frontends.](https://github.com/umijs/qiankun)

WoC库使用

```javascript
npm install whatsonchain --save
```

支持几个初始化参数

```javascript
const woc = new WhatsOnChain( 'testnet', 
{ 
apiKey: 'your api key',
userAgent: 'your user agent',
enableCache: true,
timeout: 30000
}  )
```

看测试代码，包括了所有API的调用示例。
