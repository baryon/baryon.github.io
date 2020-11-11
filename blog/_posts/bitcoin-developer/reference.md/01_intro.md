---
title: 参考 - Introduction 引言
summary: Developer Reference 旨在提供技术细节和 API 信息，以帮助您开始构建基于比特币的应用程序，但它不是一个规范。为了充分利用这个文档，您可能希望从源文件或预编译的可执行文件安装当前版本的比特币核心。
date: 2020-11-02 01:00
tags:
- 比特币
- 翻译
- 比特币开发指南

---

::: info

翻译自[Introduction &#8212; Bitcoin](https://developer.bitcoin.org/reference/intro.html#introduction)
内容在整理，准确性请自己确认

:::

# Introduction 引言[](https://developer.bitcoin.org/reference/intro.html#introduction "Permalink to this headline")

The Developer Reference aims to provide technical details and API information to help you start building Bitcoin-based applications, but it is [not a specification](https://developer.bitcoin.org/reference/intro.html#not-a-specification). To make the best use of this documentation, you may want to install the current version of Bitcoin Core, either from [source](https://github.com/bitcoin/bitcoin) or from a https://bitcoin.org/en/download.

Developer Reference 旨在提供技术细节和 API 信息，以帮助您开始构建基于比特币的应用程序，但它不是一个规范。为了充分利用这个文档，您可能希望从源文件或预编译的可执行文件安装当前版本的比特币核心。

Questions about Bitcoin development are best asked in one of the [Bitcoin development communities](https://bitcoin.org/en/development#devcommunities). Errors or suggestions related to documentation on Bitcoin.org can be [submitted as an issue](https://github.com/bitcoin-dot-org/bitcoin.org/issues) or posted to the [bitcoin-documentation mailing list](https://groups.google.com/forum/#!forum/bitcoin-documentation).

关于比特币开发的问题最好在比特币开发社区中提出。与比特币网站上的文档相关的错误或建议可以作为一个问题提交，或者张贴到比特币文档邮件列表中。

In the following documentation, some strings have been shortened or wrapped: “[…]” indicates extra data was removed, and lines ending in a single backslash “\” are continued below. If you hover your mouse over a paragraph, cross-reference links will be shown in blue. If you hover over a cross-reference link, a brief definition of the term will be displayed in a tooltip.

在下面的文档中，一些字符串被缩短或换行: “[ ... ]”表示删除了额外的数据，以单个反斜杠“”结尾的行继续在下面。如果您将鼠标悬停在一个段落上，交叉引用链接将显示为蓝色。如果您将鼠标悬停在交叉引用链接上，则将在工具提示中显示该术语的简短定义。

## Not A Specification 不是一个规范[](https://developer.bitcoin.org/reference/intro.html#not-a-specification "Permalink to this headline")

The Bitcoin.org Developer Documentation describes how Bitcoin works to help educate new Bitcoin developers, but it is not a specification—and it never will be.

比特币开发者组织的文档描述了比特币如何帮助培养新的比特币开发者，但它不是一个规范，也永远不会是。

Bitcoin security depends on consensus. Should your program diverge from consensus, its security is weakened or destroyed. The cause of the divergence doesn’t matter: it could be a bug in your program, it could be an [error in this documentation](https://github.com/bitcoin-dot-org/bitcoin.org/issues?q=is%3Aissue+label%3A%22Dev+Docs%22) which you implemented as described, or it could be you do everything right but other software on the [network](https://developer.bitcoin.org/devguide/p2p_network.html) [behaves unexpectedly](https://bitcoin.org/en/alert/2013-03-11-chain-fork). The specific cause will not matter to the users of your software whose wealth is lost.

比特币的安全取决于共识。如果您的程序偏离了协商一致意见，那么它的安全性就会被削弱或破坏。分歧的原因并不重要: 它可能是你程序中的一个 bug，可能是你实现的文档中的一个错误，或者可能是你做的每件事都是正确的，但是网络上的其他软件的行为却出乎意料。具体的原因对于那些财富损失的软件用户来说并不重要。

The only correct specification of consensus behavior is the actual behavior of programs on the [network](https://developer.bitcoin.org/devguide/p2p_network.html) which maintain consensus. As that behavior is subject to arbitrary inputs in a large variety of unique environments, it cannot ever be fully documented here or anywhere else.

一致性行为的唯一正确规范是保持一致性的网络上程序的实际行为。由于该行为在各种各样的独特环境中受到任意输入的影响，因此在这里或其他任何地方都不能对其进行完整的文档化。

However, the Bitcoin Core developers are working on making their consensus code portable so other implementations can use it. [Bitcoin Core 0.10.0](https://bitcoin.org/en/release/v0.10.0) provided `libbitcoinconsensus`, as the first attempt at exporting some consensus code. Future versions of Bitcoin Core also provided consensus code that is more complete, more portable, and more consistent in diverse environments.

然而，比特币核心开发人员正在努力使他们的共识代码可移植，以便其他实现可以使用它。0.10.0提供了 libbitcoinconsensus，这是第一次尝试导出一些共识代码。未来版本的比特币核心也提供了一致的代码，更完整，更便携，在不同的环境中更一致。

In addition, we also warn you that this documentation has not been extensively reviewed by Bitcoin experts and so likely contains numerous errors. At the bottom of the menu on the left, you will find links that allow you to report an issue or to edit the documentation on GitHub. Please use those links if you find any errors or important missing information.

此外，我们还警告你，这些文件没有经过比特币专家的广泛审查，因此可能包含许多错误。在左边菜单的底部，你会找到一些链接，可以让你在 GitHub 上报告问题或者编辑文档。如果您发现任何错误或重要信息缺失，请使用这些链接。
