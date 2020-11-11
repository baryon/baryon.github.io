---
title: 参考 - Wallets 钱包
summary: 
date: 2020-11-02 04:00
tags:
- 比特币
- 翻译
- 比特币开发指南

---

::: info

翻译自[Block Chain](https://developer.bitcoin.org/devguide/block_chain.html)
内容在整理，准确性请自己确认

:::

# Wallets 钱包[](https://developer.bitcoin.org/reference/wallets.html#wallets "Permalink to this headline")

## Deterministic Wallet Formats 确定性钱包格式[](https://developer.bitcoin.org/reference/wallets.html#deterministic-wallet-formats "Permalink to this headline")

### Type 1: Single Chain Wallets 类型1: 单链钱包[](https://developer.bitcoin.org/reference/wallets.html#type-1-single-chain-wallets "Permalink to this headline")

Type 1 deterministic wallets are the simpler of the two, which can create a single series of keys from a single seed. A primary weakness is that if the seed is leaked, all funds are compromised, and wallet sharing is extremely limited.

类型1确定性钱包是简单的两个，它可以创建一个单一的种子一系列的钥匙。一个主要的弱点是，如果种子被泄露，所有的资金都受到威胁，钱包分享是极其有限的。

### Type 2: Hierarchical Deterministic (HD) Wallets 类型2: 等级确定性(HD)钱包[](https://developer.bitcoin.org/reference/wallets.html#type-2-hierarchical-deterministic-hd-wallets "Permalink to this headline")

![Overview Of Hierarchical Deterministic Key Derivation](https://developer.bitcoin.org/_images/en-hd-overview.svg)

Overview Of Hierarchical Deterministic Key Derivation[](https://developer.bitcoin.org/reference/wallets.html#id1 "Permalink to this image")

确定性层次密钥推导综述

For an overview of HD wallets, please see the [developer guide section](https://developer.bitcoin.org/devguide/wallets.html). For details, please see [BIP32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki).

有关高清钱包的概述，请参阅开发者指南部分。详情请参阅 BIP32。
