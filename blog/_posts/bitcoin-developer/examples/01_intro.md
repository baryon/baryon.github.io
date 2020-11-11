---
title: 例子 - Introduction 引言
summary: 下面的指南旨在提供示例，帮助您开始构建基于比特币的应用程序。为了充分利用此文档，您可能希望从源文件或预编译的可执行文件安装当前版本的比特币核心。
date: 2020-11-03 01:00
tags:
- 比特币
- 翻译
- 比特币开发指南

---

::: info

翻译自[Introduction](https://developer.bitcoin.org/examples/intro.html#introduction)
内容在整理，准确性请自己确认

:::

# Introduction 引言[](https://developer.bitcoin.org/examples/intro.html#introduction "Permalink to this headline")

The following guide aims to provide examples to help you start building Bitcoin-based applications. To make the best use of this document, you may want to install the current version of Bitcoin Core, either from [source](https://github.com/bitcoin/bitcoin) or from a [pre-compiled executable](https://bitcoin.org/en/download).

下面的指南旨在提供示例，帮助您开始构建基于比特币的应用程序。为了充分利用此文档，您可能希望从源文件或预编译的可执行文件安装当前版本的比特币核心。

Once installed, you’ll have access to three programs: `bitcoind`, `bitcoin-qt`, and `bitcoin-cli`.

一旦安装完毕，您就可以访问三个程序: bitcoind、 bitcoin-qt 和 bitcoin-cli。

- `bitcoin-qt` provides a combination full Bitcoin peer and wallet frontend. From the Help menu, you can access a console where you can enter the [RPC](https://developer.bitcoin.org/reference/rpc/index.html) commands used throughout this document.
  
  比特币 -qt 提供了一个完整的比特币对等网络和钱包前端。从“帮助”菜单中，您可以访问控制台，在其中可以输入贯穿本文档的 RPC 命令。

- `bitcoind` is more useful for programming: it provides a full peer which you can interact with through [RPCs](https://developer.bitcoin.org/reference/rpc/index.html) to port 8332 (or 18332 for testnet).
  
  Bitcoind 对于编程更有用: 它提供了一个完整的对等点，您可以通过 rpc 与之交互到端口8332(或者 testnet 的端口18332)。

- `bitcoin-cli` allows you to send [RPC](https://developer.bitcoin.org/reference/rpc/index.html) commands to `bitcoind` from the command line. For example, `bitcoin-cli help`
  
  比特币-cli 允许您从命令行发送 RPC 命令到 bitcoind

All three programs get settings from `bitcoin.conf` in the `Bitcoin` application directory:

这三个程序都从 Bitcoin.conf 的 Bitcoin 应用目录中获取设置:

- Windows: `%APPDATA%\Bitcoin\`
  
  Windows:% APPDATA% Bitcoin

- OSX: `$HOME/Library/Application Support/Bitcoin/`

- Linux: `$HOME/.bitcoin/`
  
  Linux: $HOME/. bitcoin/

To use `bitcoind` and `bitcoin-cli`, you will need to add a [RPC](https://developer.bitcoin.org/reference/rpc/index.html) password to your `bitcoin.conf` file. Both programs will read from the same file if both run on the same system as the same user, so any long random password will work:

要使用 bitcoind 和 bitcoin-cli，需要在 bitcoin.conf 文件中添加 RPC 密码。如果两个程序都在同一个系统上运行，那么两个程序都会从同一个文件中读取，所以任何长的随机密码都可以工作:

rpcpassword=change_this_to_a_long_random_password

You should also make the `bitcoin.conf` file only readable to its owner. On Linux, Mac OSX, and other Unix-like systems, this can be accomplished by running the following command in the Bitcoin application directory:

您还应该使 bitcoin.conf 文件只能由其所有者读取。在 Linux、 Mac OSX 和其他类 unix 系统上，可以通过在比特币应用程序目录中运行以下命令来实现:

chmod 0600 bitcoin.conf

For development, it’s safer and cheaper to use Bitcoin’s test [network](https://developer.bitcoin.org/devguide/p2p_network.html) (testnet) or regression test mode (regtest) described below.

对于开发来说，使用比特币的测试网络(testnet)或回归测试模式(regtest)更安全，成本也更低。

Questions about Bitcoin use are best sent to the [BitcoinTalk forum](https://bitcointalk.org/index.php?board=4.0) and [IRC channels](https://en.bitcoin.it/wiki/IRC_channels). Errors or suggestions related to documentation on Bitcoin.org can be [submitted as an issue](https://github.com/bitcoin-dot-org/bitcoin.org/issues) or posted to the [bitcoin-documentation mailing list](https://groups.google.com/forum/#!forum/bitcoin-documentation).

关于比特币使用的问题最好发送到 BitcoinTalk 论坛和 IRC 频道。与比特币网站上的文档相关的错误或建议可以作为一个问题提交，或者张贴到比特币文档邮件列表中。

In the following documentation, some strings have been shortened or wrapped: “[…]” indicates extra data was removed, and lines ending in a single backslash “\” are continued below. If you hover your mouse over a paragraph, cross-reference links will be shown in blue. If you hover over a cross-reference link, a brief definition of the term will be displayed in a tooltip.

在下面的文档中，一些字符串被缩短或换行: “[ ... ]”表示删除了额外的数据，以单个反斜杠“”结尾的行继续在下面。如果您将鼠标悬停在一个段落上，交叉引用链接将显示为蓝色。如果您将鼠标悬停在交叉引用链接上，则将在工具提示中显示该术语的简短定义。