---
title: P2P 网络（1）概要
summary: 比特币网络协议允许全节点协作地维护一个P2P（peer-to-peer）对等网络，用于块和交易交换
date: 2020-11-02 10:00
tags:
- 比特币
- 翻译

---

# P2P 网络

::: info

翻译自[P2P Network](https://developer.bitcoin.org/devguide/p2p_network.html#)

:::

比特币网络协议允许全节点协作地维护一个P2P（peer-to-peer）对等网络，用于块和交易交换。

## 引言

全节点下载并验证每个块和交易，然后再将它们转发给其他节点。档案节点是完整的节点，存储整个区块链，并可以提供历史区块给其他节点。剪枝节点是完整的节点但不存储整个区块链。许多 SPV 客户端使用比特币网络协议连接到完整的节点。

共识规则并不涵盖网络，因此比特币程序可能使用替代网络和协议，比如一些矿工使用的高速块中继网络[high-speed block relay network](https://www.mail-archive.com/bitcoin-development@lists.sourceforge.net/msg03189.html)，以及一些钱包使用的专用交易信息服务器[dedicated transaction information servers](https://github.com/spesmilo/electrum-server)，这些钱包提供了 SPV 级别的安全性。

为了提供比特币对等网络的实例，本节使用比特币Core作为代表性的完整节点，[BitcoinJ](http://bitcoinj.github.io/) 作为代表性的 SPV 客户端。这两个程序都是灵活的，因此只描述默认行为。另外，为了保护隐私，下面示例输出中的实际 IP 地址已被 [RFC5737](http://tools.ietf.org/html/rfc5737)保留 IP 地址替换。

## 发现节点

当第一次启动时，程序不知道任何活动中的全节点的 IP 地址。为了发现一些 IP 地址，他们查询一个或多个被硬编码成的 DNS 种子。查找的响应应该包括一个或多个 DNS A 记录，其中包含可能接受新传入连接的全节点的 IP 地址。例如，使用 Unix 的["dig"](https://en.wikipedia.org/wiki/Dig_%28Unix_command%29)命令

```Bash
% dig seed.bitcoin.sipa.be +nostats +nocomments +nocmd

; <<>> DiG 9.10.6 <<>> seed.bitcoin.sipa.be +nostats +nocomments +nocmd
;; global options: +cmd
;seed.bitcoin.sipa.be.        IN    A
seed.bitcoin.sipa.be.    3599    IN    A    51.77.152.20
seed.bitcoin.sipa.be.    3599    IN    A    46.166.175.40
seed.bitcoin.sipa.be.    3599    IN    A    148.251.155.70
seed.bitcoin.sipa.be.    3599    IN    A    178.63.188.60
seed.bitcoin.sipa.be.    3599    IN    A    52.221.215.57
seed.bitcoin.sipa.be.    3599    IN    A    13.233.97.177
.
```

DNS 种子由比特币社区成员维护: 其中一些提供动态 DNS 种子服务器，通过扫描网络自动获取活动节点的 IP 地址; 其他提供手动更新的静态 DNS 种子，更有可能为非活动节点提供 IP 地址。在这两种情况下，如果节点在主网络的默认比特币端口8333或 testnet 的默认端口18333上运行，那么它们将被添加到 DNS 种子中。

DNS 种子结果不被认证，恶意种子操作员或网络中间人攻击者可以返回攻击者控制的节点的 IP 地址，在攻击者自己的网络上隔离一个程序，并允许攻击者向其提供伪造的交易和块。因此，程序不应该完全依赖 DNS 种子。

一旦一个程序连接到网络上，它链接的节点就可以开始向它发送带有网络上其他节点的 IP 地址和端口号的 addr (address)消息，这提供了一种完全分散的节点发现方法。比特币在一个数据库中保存已知对等点的记录，允许它之后直接连接到节点，而不必再使用 DNS 种子。

然而，节点经常离开网络或者更改 IP 地址，所以程序在成功连接之前可能需要在启动时进行几次不同的连接尝试。这可能会大大延迟连接到网络所需的时间，迫使用户在发送交易或检查支付状态之前等待。

为了避免这种可能的延迟，BitcoinJ 总是使用动态 DNS 种子来获取当前活动节点的 IP 地址。比特币Core还试图在尽量减少延迟和避免不要的 DNS 种子使用之间取得平衡: 如果比特币Core在其数据库中有条目，它会花费多达11秒的时间试图连接至少其中一个，然后再回到种子; 如果在这段时间内建立了连接，它不会查询任何种子。

比特币Core和 BitcoinJ 还包括一个硬编码的 IP 地址和端口号列表，这些列表包含了几十个节点，这些节点在该软件的特定版本首次发布时处于活动状态。如果60秒内没有 DNS 种子服务器响应查询，比特币Core将开始尝试连接这些节点，提供一个自动回退选项。

作为一种手动回退选项，比特币Core还提供了几种命令行连接选项，包括能够按 IP 地址从特定节点获取节点列表，或按 IP 地址与特定节点进行持久连接。有关详细信息，请参阅-help 文本。可以通过编程来做同样的事情。

资源: 比特币 Seeder，这个程序由比特币Core和 BitcoinJ 使用。比特币Core DNS 种子策略[DNS Seed Policy](https://github.com/bitcoin/bitcoin/blob/master/doc/dnsseed-policy.md)比特币Core核心和 BitcoinJ 使用的硬编码 IP 地址列表的种子制作脚本[makeseeds script](https://github.com/bitcoin/bitcoin/tree/master/contrib/seeds)。

## 连接到节点

通过发送一个“ version”消息来连接到节点，该消息包含您的版本号、区块和当前时间到远程节点。远程节点用它自己的“version”消息进行响应。然后两个节点向互相发送 `verack`消息，以表明连接已经建立。

一旦连接上，客户端就可以发送到远程节点 `getaddr` 和 `addr`消息来收集其他的节点。

为了维护与对等节点的连接，默认情况下，节点将在30分钟的不活动状态之前向对等节点发送消息。如果90分钟过去了，对等端没有接收到消息，客户端将假定连接已经关闭。

## 初次区块下载

在全节点验证未确认的交易和最近挖掘的块之前，它必须下载并验证从块1(硬编码起源块之后的块)到作为最佳区块链的当前顶端的所有块。这就是初始块下载(IBD)或初始同步。

虽然“初始”这个词意味着这种方法只使用一次，但它也可以在需要下载大量块的任何时候使用，例如在以前遇到的节点长时间处于离线状态时。在这种情况下，节点可以使用 IBD 方法下载自上次联机以来生成的所有块。

比特币Core使用 IBD 方法，任何时候最好的区块链上的最后一个块头时间超过24小时。如果比特币Core0.10.0的本地最佳区块链比本地最佳区块链低144个区块(也就是说，本地区块链在过去大约24小时以上) ，它也将执行 IBD。

### 第一个区块

比特币Core(直到0.9.3版本)使用一个简单的初始块下载(IBD)方法，我们称之为 block-first。目标是按顺序从最好的块链中下载块。

![Overview Of Blocks-First Method](https://developer.bitcoin.org/_images/en-blocks-first-flowchart.svg)

## 块优先方法概述

当一个节点第一次启动时，它的本地最佳块链中只有一个块，即硬编码的起源块(0块)。该节点选择一个远程对等节点(称为同步节点) ，并向其发送如下所示的`getblocks`消息。

![First GetBlocks Message Sent During IBD](https://developer.bitcoin.org/_images/en-ibd-getblocks.svg)

### 在 IBD 期间发送的第一条 GetBlocks 消息

在“ getblocks”消息的 header hash 字段中，这个新节点发送它所拥有的唯一块的创世哈希，即 genesis block (内部字节顺序为6fe2... 0000)。它还将 stop hash 字段设置为全零，以请求最大的响应。

在接收到`getblocks`消息后，同步节点获取第一个(也是唯一的)头部哈希，并用该头部哈希搜索其本地最佳区块链。它发现块0匹配，所以它从块1开始回复500个块数据库存(对`getblocks`消息的最大响应)。它发送的数据在`inv`中的信息说明如下。

![First Inv Message Sent During IBD](https://developer.bitcoin.org/_images/en-ibd-inv.svg)

### IBD 期间发送的第一条 Inv 消息

清单是网络信息的唯一标识符。每个库存`inventory`包含一个类型字段和一个对象实例的唯一标识符。对于块，唯一标识符是块头的哈希。

区块库存在` inv`信息中的出现顺序与它们在区块链中的出现顺序相同，因此第一个`inv`信息包含块1至501的库存。(例如，如上图所示，块1的哈希值为4860... 0000。)

IBD 节点使用接收到的存货清单从下面的`getdata`消息中的同步节点请求128个块。

![First GetData Message Sent During IBD](https://developer.bitcoin.org/_images/en-ibd-getdata.svg)

### 在 IBD 期间发送的第一个 GetData 消息

对于块优先的节点来说，请求块并按顺序发送块非常重要，因为每个块头都引用前面块的头哈希。这意味着 IBD 节点在收到一个块的父块之前不能完全验证该块。由于父块未被接收而无法验证的块称为孤儿块; 下面的一个小节将更详细地描述它们。

一旦接收到`getdata`消息，同步节点就会回复请求的每个块。每个块都被放入序列化的格式，并以单独的`block`消息发送。发送的第一个`block`消息(针对 block 1)如下所示。

![First Block Message Sent During IBD](https://developer.bitcoin.org/_images/en-ibd-block.svg)

### IBD 期间发送的第一个区块消息

IBD 节点下载每个块，验证它，然后请求它尚未请求的下一个块，维护一个最多128个块的下载队列。当它请求每一块有库存的块时，它会向同步节点发送另一个`getblocks`消息，请求多达500块的库存。第二个`getblocks`消息包含多个头哈希，如下所示:

![Second GetBlocks Message Sent During IBD](https://developer.bitcoin.org/_images/en-ibd-getblocks2.svg)

### 在 IBD 期间发送的第二个 GetBlocks 消息

接收到第二个`getblocks`消息后，同步节点在其本地最佳块链中搜索与消息中的一个头哈希匹配的块，并按照接收的顺序尝试每个哈希。如果它找到了匹配的哈希，它就会回复500个从该点开始的下一个块的存货。但是如果没有匹配的哈希(直到停止哈希) ，它假设两个节点的唯一共同块是 block 0，因此它发送一个以 block 1开始的 inv 消息(与上面几个例子中的` inv`消息相同)。

这种重复的搜索允许同步节点发送有用的库存，即使 IBD 节点的本地区块链从同步节点的区块链中发生了分叉。当 IBD 节点越接近块链的顶端时，这个 分叉检测就变得越有用。

当 IBD 节点收到第二个`inv`消息时，它将使用`getdata`消息请求这些块。同步节点将以`block`消息作出响应。然后 IBD 节点将请求更多的库存，并发送另一个`getblocks`消息ーー这个循环将不断重复，直到 IBD 节点与块链的末端同步。此时，节点将接受通过后面小节描述的常规块广播发送的块。

### 块优先的优点和缺点

块优先 IBD 的主要优点是它的简单性。主要的缺点是 IBD 节点依赖于一个同步节点进行所有的下载。这有几个含义:

- **速度限制**: 所有请求都发送到同步节点，因此如果同步节点的上传带宽有限，IBD 节点的下载速度就会很慢。注意: 如果同步节点离线，比特币Core将继续从另一个节点下载，但它仍然一次只从一个同步节点下载。

- **下载重新启动**: 同步节点可以向 IBD 节点发送一个非最佳(但在其他方面是有效的)块链。在初始块下载接近完成之前，IBD 节点无法识别它为非最佳节点，这迫使 IBD 节点重新启动其块链下载，从另一个节点重新下载。比特币Core在开发者选择的不同区块高度附带几个区块链检查点，以帮助 IBD 节点检测它是否被输入了另一个区块链历史记录ーー允许 IBD 节点在过程的早期重新启动下载。

- **磁盘填充攻击**: 与下载重新启动密切相关的是，如果同步节点发送了一个非最佳(但其他方面都是有效的)块链，这个链将被存储在磁盘上，浪费空间，并可能用无用的数据填充磁盘驱动器。

- **高级内存使用**: 无论是恶意的还是偶然的，同步节点都可以发送乱序的数据块，创建孤立的数据块，这些数据块只有在它们的父节点被接收和验证之后才能被验证。孤立块在等待验证时存储在内存中，这可能导致高内存使用。

所有这些问题都可以通过比特币Core 0.10.0中使用的 headers-first IBD 方法部分或全部解决。

**参考资料**: 下表总结了本小节中提到的消息。消息字段中的链接将带您到该消息的参考页面。

| Message                                   | 从→到      | Payload          |
| ----------------------------------------- | -------- | ---------------- |
| [`getblocks`](./reference.html#getblocks) | IBD→Sync | 一个或多个头哈希         |
| [`inv`](./reference.html#inv)             | Sync→IBD | 多达500整批存货(唯一标识符) |
| [`getdata`](./reference.html#getdata)     | IBD→Sync | 一个或多个区块库存        |
| [`block`](./reference.html#block)         | Sync→IBD | 一个序列化块           |

## 头优先

比特币Core0.10.0使用一个名为 headers-first 的初始块下载(IBD)方法。目标是下载最佳链的报头，尽可能对它们进行部分验证，然后并行下载相应的块。这解决了旧的块优先 IBD 方法的几个问题。

![Overview Of Headers-First Method](https://developer.bitcoin.org/_images/en-headers-first-flowchart.svg)

### 头优先方法概述

当一个节点第一次启动时，它的本地最佳块链中只有一个块，即硬编码的起源块(0块)。该节点选择一个远程对等节点，我们将其称为同步节点，并向其发送如下所示的`getheaders`消息。

![First getheaders message](https://developer.bitcoin.org/_images/en-ibd-getheaders.svg)

### 第一条`getheaders`信息

在`getheaders`消息的头部哈希字段中，新节点发送它所拥有的唯一块的创世哈希(genesis 块，内部字节顺序为6fe2... 0000)。它还将 stop hash 字段设置为所有零，以请求最大大小的响应。

在收到`getheaders`消息后，同步节点获取第一个(也是唯一的)头部哈希，并用该头部哈希搜索其本地最佳块链。它发现块0匹配，因此它从块1开始回复2,000个头(最大响应)。它在下面的`header`消息中发送这些 header 哈希。

![First headers message](https://developer.bitcoin.org/_images/en-ibd-headers.svg)

### 第一个头信息

IBD 节点可以部分验证这些块头，方法是确保所有字段遵循一致规则，并根据 nBits 字段确保头的哈希低于目标阈值。(完全验证仍然需要来自相应块的所有交易。)

在 IBD 节点部分验证了块头之后，它可以并行地做两件事:

1. **下载更多头信息**: IBD 节点可以向同步节点发送另一个“ getheaders”消息，请求最佳头信息链上的下一个2000个头信息。这些头信息可以立即进行验证，并重复请求另一个批处理，直到从少于2000个头信息的同步节点接收到“头信息” ，这表明它没有更多头信息可以提供。在写这篇文章的时候，头文件的同步只需要不到200次往返，或者大约32mb 的下载数据。
   
   一旦 IBD 节点从同步节点接收到少于2000个头的`headers`消息，它就会向每个出站节点发送一个`getheaders`消息，以获得它们对最佳头链的视图。通过比较响应，它可以很容易地确定它下载的头是否属于任何出站节点报告的最佳头链。这意味着即使没有使用检查点，不诚实的同步节点也会很快被发现(只要 IBD 节点连接到至少一个诚实的对等点; 如果找不到诚实的对等点，比特币Core将继续提供检查点)。

2. **下载块**: 当 IBD 节点继续下载头部时，在头部下载完成后，IBD 节点将请求并下载每个块。IBD 节点可以使用从头链计算出来的块头哈希来创建`getdata`消息，这些消息通过它们的库存请求它所需要的块。它不需要从同步节点请求这些数据，它可以从任何一个完整的节点对等节点请求这些数据。(尽管并非所有的完整节点都存储所有块。)这使得它可以并行地获取数据块，并且避免将下载速度限制在单个同步节点的上传速度。
   
   为了在多个对等点之间分配负载，比特币核每次只从一个对等点请求16个块。加上最多8个出站连接，这意味着头优先的比特币Core将在 IBD 期间同时请求最多128个块(与阻止同步节点请求的头比特币Core核心的最大数量相同)。

![Simulated Headers-First Download Window](https://developer.bitcoin.org/_images/en-headers-first-moving-window.svg)

### 模拟头优先下载窗口

比特币Core的标题优先模式使用1024块移动下载窗口来最大化下载速度。窗口中高度最低的块是下一个要验证的块; 如果在比特币Core准备验证它的时候，块还没有到比特币Core核心将等待至少两秒钟，等待失速节点发送块。如果阻塞仍然没比特币Core特币核心将断开停止节点，并尝试连接到另一个节点。例如，在上图中，如果节点 a 在至少两秒钟内没有发送块3，它将被断开连接。

一旦 IBD 节点同步到块链的末端，它将接受通过后面的小节描述的规则块广播发送的块。

**参考资料**: 下表总结了本小节中提到的消息。

| Message                                     | From→To    | Payload        |
| ------------------------------------------- | ---------- | -------------- |
| [`getheaders`](./reference.html#getheaders) | IBD→Sync   | 一个或多个头哈希       |
| [`headers`](./reference.html#headers)       | Sync→IBD   | 多达2000个块头      |
| [`getdata`](./reference.html#getdata)       | IBD→*Many* | 一个或多个源自头哈希的块库存 |
| [`block`](./reference.html#block)           | *Many*→IBD | 一个序列化块         |

## 区块广播

当一个矿工发现一个新块，它会使用以下方法之一将新块广播给同行:

- **主动推送区块**: 矿工向每个全节点推送新块，发送一条`block`消息。矿工可以通过这种方式合理地绕过标准转发方法，因为他知道没有其他同行已经有刚刚发现的块。

- **标准区块转发**: 矿工作为一个标准转发节点，向每个节点(包括全节点和 SPV)发送一个` inv`消息，其中包含一个引用新块的库存。最常见的回答是:
  
  - 每个块优先(BF)对等节点希望块回复一个`getdata`消息请求完整块。
  
  - Each headers-first (HF) peer that wants the block replies with a [“getheaders” message](https://developer.bitcoin.org/reference/p2p_networking.html#getheaders) containing the header hash of the highest-height header on its best header chain, and likely also some headers further back on the best header chain to allow fork detection. That message is immediately followed by a [“getdata” message](https://developer.bitcoin.org/reference/p2p_networking.html#getdata) requesting the full block. By requesting headers first, a headers-first peer can refuse orphan blocks as described in the subsection below.
    
    每个头优先(HF)对等节点，希望块与`getheaders`的信息回复，其中包含最高的头在其最好的头链的头哈希最高的头，并可能还有一些头回到最好的头链，以允许叉检测。该消息后面紧接着一个`getdata`消息，请求完整的块。通过首先请求标头，标头优先对等节点可以拒绝下面小节中描述的孤立块。
  
  - Each Simplified Payment Verification (SPV) client that wants the block replies with a [“getdata” message](https://developer.bitcoin.org/reference/p2p_networking.html#getdata) typically requesting a merkle block.
    
    每个简化付款验证(Simplified Payment Verification，SPV)客户机希望块回复一个` getdata`消息，通常请求一个`merkle`块。
  
  The miner replies to each request accordingly by sending the block in a [“block” message](https://developer.bitcoin.org/reference/p2p_networking.html#block), one or more headers in a [“headers” message](https://developer.bitcoin.org/reference/p2p_networking.html#headers), or the merkle block and transactions relative to the SPV client’s bloom filter in a [“merkleblock” message](https://developer.bitcoin.org/reference/p2p_networking.html#merkleblock) followed by zero or more [“tx” messages](https://developer.bitcoin.org/reference/p2p_networking.html#tx).
  
  矿工对每个请求作出相应的响应，方法是在`block`消息中发送块，在`header`消息中发送一个或多个头，或者在`merkleblock`消息中发送与 SPV 客户机的 bloom 过滤器相关的 merkle 块和交易，后面跟着零个或多个`tx`消息。

- [Direct Headers Announcement](https://developer.bitcoin.org/glossary.html#term-Block-header)**:** a relay node may skip the round trip overhead of an [“inv” message](https://developer.bitcoin.org/reference/p2p_networking.html#inv)followed by `getheaders` by instead immediately sending a [“headers” message](https://developer.bitcoin.org/reference/p2p_networking.html#headers) containing the full header of the new block. A HF peer receiving this message will partially validate the block header as it would during headers-first IBD, then request the full block contents with a [“getdata” message](https://developer.bitcoin.org/reference/p2p_networking.html#getdata) if the header is valid. The relay node then responds to the `getdata` request with the full or filtered block data in a `block`or [“merkleblock” message](https://developer.bitcoin.org/reference/p2p_networking.html#merkleblock), respectively. A HF node may signal that it prefers to receive `headers` instead of `inv` announcements by sending a special [“sendheaders” message](https://developer.bitcoin.org/reference/p2p_networking.html#sendheaders) during the connection handshake.
  
  直接宣告公告: 转发节点可以跳过`inv`消息的往返开销，直接发送包含新块的完整标题的`Headers`消息。接收此消息的 HF 对等节点将部分验证块头，就像它在头部时先验证 IBD 一样，然后如果头部是有效的，用`getdata`消息请求完整的块内容。然后，转发节点分别用块或`merkleblock`消息中的完整块数据或经过过滤的块数据响应`getdata`请求。一个 HF 节点可能在连接握手期间发送一个特殊的`sendheaders`消息，表明它更喜欢接收头信息而不是`inv`宣告。
  
  This protocol for block broadcasting was proposed in BIP 130 and has been implemented in Bitcoin Core since version 0.12.
  
  这个块广播协议是在 BIP 130中提出的，自0.12版以来一直在比特币Core中实现。

By default, Bitcoin Core broadcasts blocks using direct headers announcement to any peers that have signalled with [“sendheaders”](https://developer.bitcoin.org/reference/p2p_networking.html#sendheaders) and uses [standard block relay](https://developer.bitcoin.org/terms.html#term-standard-block-relay) for all peers that have not. Bitcoin Core will accept blocks sent using any of the methods described above.

默认情况下，比特币Core通过直接头信息向任何带有`sendheaders`信号的对等节点广播，并为所有没有发送`sendheaders`信号的对等节点使用标准块中比特币Core核心将接受使用上述任何方法发送的块。

Full nodes validate the received block and then advertise it to their peers using the [standard block relay](https://developer.bitcoin.org/terms.html#term-standard-block-relay) method described above. The condensed table below highlights the operation of the messages described above (Relay, BF, HF, and SPV refer to the relay node, a blocks-first node, a headers-first node, and an SPV client; *any* refers to a node using any block retrieval method.)

完整的节点验证接收到的块，然后使用上面描述的标准块转发方法将其通知给节点。下面的压缩表突出显示了上面描述的消息的操作(Relay、 BF、 HF 和 SPV 指的是转发节点、一个块第一节点、一个头第一节点和一个 SPV 客户端; any 指的是使用任何块检索方法的节点。)

| Message信息                                                                                           | From→To从→到  | Payload有效载荷                                                                                         |
| --------------------------------------------------------------------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------- |
| [`inv`](./reference.html#inv)                                                                       | Relay→*Any* | 新块的存货清单                                                                                             |
| [`getdata`](./reference.html#getdata)                                                               | BF→Relay    | 新块的存货清单                                                                                             |
| [“getheaders”](https://developer.bitcoin.org/reference/p2p_networking.html#getheaders)“ getheaders” | HF→Relay    | One or more header hashes on the HF node’s best header chain (BHC)HF 节点的最佳头链(BHC)上有一个或多个头哈希         |
| [“headers”](https://developer.bitcoin.org/reference/p2p_networking.html#headers)“ header”           | Relay→HF    | Up to 2,000 headers connecting HF node’s BHC to relay node’s BHC将短波节点的 BHC 与转发节点的 BHC 连接起来的头高达2000个 |
| [`block`](./reference.html#block)                                                                   | Relay→BF/HF | The new block in [serialized format](./reference.html#serialized-blocks)序列化格式的新块                    |
| [`merkleblock`](./reference.html#merkleblock)                                                       | Relay→SPV   | 新的块过滤成一个 merkle 块                                                                                   |
| [`tx`](https://developer.bitcoin.org/reference/p2p_networking.html#tx)                              | Relay→SPV   | Serialized transactions from the new block that match the bloom filter匹配 bloom 筛选器的新块中的序列化交易        |

### 孤块（Orphan Block）

区块优先的节点可以下载孤立块ーー这些块的前一个块头 hash 字段指的是这个节点尚未看到的块头。换句话说，孤块没有已知的父区块(不像旧块（Stale Block），有已知的父区块，但不再最有分枝上)。

![Difference Between Orphan And Stale Blocks](https://developer.bitcoin.org/_images/en-orphan-stale-definition.svg)

孤块和旧块之间的区别

当区块优先的节点下载孤立块时，它不会验证它。相反，它将向发送孤立块的节点发送一条` getblocks`消息; 广播节点将以一条`inv`消息作为回应，其中包含下载节点丢失的任何块的清单(最多500个) ; 下载节点将以`getdata`消息请求这些块; 广播节点将以`block`消息发送这些块。下载节点将验证这些块，一旦前孤儿块的父代被验证，它将验证前孤儿块。

Headers-first nodes avoid some of this complexity by always requesting block headers with the [“getheaders” message](https://developer.bitcoin.org/reference/p2p_networking.html#getheaders) before requesting a block with the [“getdata” message](https://developer.bitcoin.org/reference/p2p_networking.html#getdata). The broadcasting node will send a [“headers” message](https://developer.bitcoin.org/reference/p2p_networking.html#headers) containing all the block headers (up to 2,000) it thinks the downloading node needs to reach the tip of the best header chain; each of those headers will point to its parent, so when the downloading node receives the [“block” message](https://developer.bitcoin.org/reference/p2p_networking.html#block), the block shouldn’t be an orphan block—all of its parents should be known (even if they haven’t been validated yet). If, despite this, the block received in the [“block” message](https://developer.bitcoin.org/reference/p2p_networking.html#block) is an orphan block, a headers-first node will discard it immediately.

头部优先的节点通过在请求带有`getdata`消息的块头之前总是请求带有`getheaders`消息的块头来避免这种复杂性。广播节点将发送一条`hearders`消息，其中包含所有它认为下载节点需要到达的最佳头链的顶端的所有块头(最多2000个) ; 每个头都指向它的父节点，因此当下载节点收到“block”消息时，该块不应该是孤立的块——它的所有父节点都应该是知道的(即使它们还没有被验证)。尽管如此，如果在`block`消息中接收到的块是一个孤立块，则以头为先的节点将立即丢弃它。

然而，孤立丢弃确实意味着头优先节点将忽略矿工在主动推送中发送的孤立块。

## 交易广播

为了向对等点发送交易，会发送一个`inv`消息。如果接收到 `getdata` 响应消息，则使用 `tx` 发送交易。接收此交易的对等方也以同样的方式转发交易，假定它是一个有效的交易。

### 内存池

Full peers may keep track of unconfirmed transactions which are eligible to be included in the next block. This is essential for miners who will actually mine some or all of those transactions, but it’s also useful for any peer who wants to keep track of unconfirmed transactions, such as peers serving unconfirmed transaction information to SPV clients.

完整的对等点可以跟踪未确认的交易，这些交易有资格包含在下一个块中。这对于那些实际开采部分或全部交易的矿工来说是必不可少的，但对于那些希望跟踪未经证实的交易的对等机构来说也是有用的，比如为 SPV 客户机提供未经证实的交易信息的对等机构。

Because unconfirmed transactions have no permanent status in Bitcoin, Bitcoin Core stores them in non-persistent memory, calling them a memory pool or mempool. When a peer shuts down, its memory pool is lost except for any transactions stored by its wallet. This means that never-mined unconfirmed transactions tend to slowly disappear from the [network](https://developer.bitcoin.org/devguide/p2p_network.html) as peers restart or as they purge some transactions to make room in memory for others.

由于未经证实的交易在比特币中没有永久性地位，比特币Core将它们存储在非永久性内存中，称之为内存池或记忆池。当一个对等点关闭时，它的内存池将丢失，除了它的钱包中存储的交易。这意味着从未挖掘的未确认交易往往会在对等点重新启动或清除某些交易以为其他交易腾出内存空间时从网络中慢慢消失。

Transactions which are mined into blocks that later become stale blocks may be added back into the memory pool. These re-added transactions may be re-removed from the pool almost immediately if the replacement blocks include them. This is the case in Bitcoin Core, which removes stale blocks from the chain one by one, starting with the tip (highest block). As each block is removed, its transactions are added back to the memory pool. After all of the stale blocks are removed, the replacement blocks are added to the chain one by one, ending with the new tip. As each block is added, any transactions it confirms are removed from the memory pool.

挖掘到块中的交易以后变成陈旧的块，这些交易可能会被添加回内存池。如果替换块包含这些重新添加的交易，那么这些重新添加的交易几乎可以立即从池中重新删除。比特币Core就是这种情况，它逐个从链中删除陈旧的块，从提示(最高块)开始。当每个块被删除时，它的交易将被添加回内存池。在删除所有陈旧块之后，替换块将逐个添加到链中，以新的顶端结束。在添加每个块时，它确认的任何交易都将从内存池中删除。

SPV clients don’t have a memory pool for the same reason they don’t relay transactions. They can’t independently verify that a transaction hasn’t yet been included in a block and that it only spends UTXOs, so they can’t know which transactions are eligible to be included in the next block.

SPV 客户机没有内存池的原因与它们不中继交易的原因是一样的。他们不能独立地验证一个交易是否还没有包含在一个块中，而且它只是花费了 UTXOs，所以他们不能知道哪些交易有资格包含在下一个块中。

## 错误的节点

请注意，对于这两种类型的广播，都有惩罚那些通过发送错误信息占用带宽和计算资源的行为不端的节点的机制。如果一个节点的 banscore 高于`-banscore = < n > `阈值，那么将被禁止-`bantime = < n > `定义的秒数，默认为86,400秒(24小时)。

## 警报Alert

在比特币Core0.13.0中已经删除

早期版本的比特币Core允许开发者和受信任的社区成员发布比特币警报，通知用户关键的网络问题。这个消息系比特币Core v0.13.0中退役了; 但是，内部警报、分区检测警告和`-alertnotify` 选项功能仍然保留。
