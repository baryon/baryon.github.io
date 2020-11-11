---
title: 例子 - Testing Applications 测试应用
summary: 比特币核心提供测试工具，旨在让开发者测试他们的应用程序，减少风险和限制。
date: 2020-11-03 02:00
tags:
- 比特币
- 翻译
- 比特币开发指南

---

::: info

翻译自[Testing Applications &#8212; Bitcoin](https://developer.bitcoin.org/examples/testing.html#testing-applications)
内容在整理，准确性请自己确认

:::

# Testing Applications 测试应用[](https://developer.bitcoin.org/examples/testing.html#testing-applications "Permalink to this headline")

Bitcoin Core provides testing tools designed to let developers test their applications with reduced risks and limitations.

比特币核心提供测试工具，旨在让开发者测试他们的应用程序，减少风险和限制。

## Testnet[](https://developer.bitcoin.org/examples/testing.html#testnet "Permalink to this headline")

When run with no arguments, all Bitcoin Core programs default to Bitcoin’s main [network](https://developer.bitcoin.org/devguide/p2p_network.html) ([mainnet](https://developer.bitcoin.org/glossary.html#term-Mainnet)). However, for development, it’s safer and cheaper to use Bitcoin’s test [network](https://developer.bitcoin.org/devguide/p2p_network.html) (testnet) where the satoshis spent have no real-world value. Testnet also relaxes some restrictions (such as standard transaction checks) so you can test functions which might currently be disabled by default on mainnet.

当没有参数运行时，所有的比特币核心程序都默认使用比特币的主网络(主网络)。然而，对于开发来说，使用比特币的测试网络(testnet)更加安全和廉价，因为在这个网络中，比特币没有任何现实价值。Testnet 还放松了一些限制(比如标准事务检查) ，这样您就可以测试默认情况下可能在 mainnet 上禁用的函数。

To use testnet, use the argument `-testnet` with `bitcoin-cli`, `bitcoind` or `bitcoin-qt` or add `testnet=1` to your `bitcoin.conf` file as [described earlier](https://developer.bitcoin.org/examples/index.html). To get free satoshis for testing, use [Piotr Piasecki’s testnet faucet](https://tpfaucet.appspot.com/). Testnet is a public resource provided for free by members of the community, so please don’t abuse it.

要使用 testnet，可以使用参数 -testnet 和 bitcoin-cli、 bitcoind 或 bitcoin-qt，或者像前面描述的那样将 testnet = 1添加到 bitcoin.conf 文件中。要免费测试 satoshis，可以使用 Piotr Piasecki 的测试网络水龙头。Testnet 是社区成员免费提供的公共资源，所以请不要滥用它。

## Regtest Mode Regtest 模式[](https://developer.bitcoin.org/examples/testing.html#regtest-mode "Permalink to this headline")

For situations where interaction with random peers and blocks is unnecessary or unwanted, Bitcoin Core’s regression test mode (regtest mode) lets you instantly create a brand-new private block chain with the same basic rules as testnet—but one major difference: you choose when to create new blocks, so you have complete control over the environment.

对于不需要或不需要与随机对等点和块进行交互的情况，比特币核心的回归测试模式(regtest 模式)可以让你立即创建一个全新的私有块链，其基本规则与 testnet 相同，但有一个主要区别: 你可以选择何时创建新块，这样你就可以完全控制环境。

Many developers consider regtest mode the preferred way to develop new applications. The following example will let you create a regtest environment after you first [configure bitcoind](https://developer.bitcoin.org/examples/index.html).

许多开发人员认为 regtest 模式是开发新应用程序的首选方式。下面的示例将允许您在首次配置 bitcoind 之后创建 regtest 环境。

> bitcoind -regtest -daemon
> Bitcoin server starting

Start `bitcoind` in regtest mode to create a private block chain.

在 regtest 模式下启动 bitcoind 以创建一个私有块链。

## Bitcoin Core 0.10.1 and earlier

bitcoin-cli -regtest setgenerate true 101

## Bitcoin Core 17.1 and earlier

bitcoin-cli -regtest generate 101

## Bitcoin Core 18.0 and later

bitcoin-cli -regtest generatetoaddress 101 $(bitcoin-cli -regtest getnewaddress)

Generate 101 blocks using a special [RPC](https://developer.bitcoin.org/reference/rpc/index.html) which is only available in regtest mode. This takes less than a second on a generic PC. Because this is a new block chain using Bitcoin’s default rules, the first blocks pay a block reward of 50 bitcoins. Unlike mainnet, in regtest mode only the first 150 blocks pay a reward of 50 bitcoins. However, a block must have 100 confirmations before that reward can be spent, so we generate 101 blocks to get access to the coinbase transaction from block #1.

使用只能在 regtest 模式下使用的特殊 RPC 生成101个块。这在一般的个人电脑上只需要不到一秒钟。因为这是一个使用比特币默认规则的新块链，第一个块支付50比特币的块奖励。与 mainnet 不同，在 regtest 模式下，只有前150个块支付50个比特币的奖励。但是，一个块必须经过100次确认才能花费奖励，所以我们生成了101个块来访问第1块的 coinbase 事务。

bitcoin-cli -regtest getbalance
50.00000000

Verify that we now have 50 bitcoins available to spend.

确认我们现在有50个比特币可供使用。

You can now use Bitcoin Core [RPCs](https://developer.bitcoin.org/reference/rpc/index.html) prefixed with `bitcoin-cli -regtest`.

您现在可以使用比特币核心 rpc 前缀比特币-克里-雷格测试。

Regtest wallets and block chain state (chainstate) are saved in the `regtest` subdirectory of the Bitcoin Core configuration directory. You can safely delete the `regtest` subdirectory and restart Bitcoin Core to start a new regtest. (See the [Developer Examples Introduction](https://developer.bitcoin.org/examples/index.html) for default configuration directory locations on various operating systems. Always back up mainnet wallets before performing dangerous operations such as deleting.)

Regtest 钱包和块链状态(chainstate)保存在比特币核心配置目录的 Regtest 子目录中。您可以安全地删除 regtest 子目录并重新启动 Bitcoin Core 以启动新的 regtest。(请参阅开发人员示例介绍，了解各种操作系统上的默认配置目录位置。在执行诸如删除之类的危险操作之前，一定要备份主网钱包。)