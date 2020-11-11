---
title: 指南 - Operating Modes 运作模式
summary: 为了验证区块链，比特币软件有不同程度的安全和权衡。
date: 2020-11-01 06:00
tags:
- 比特币
- 翻译
- 比特币开发指南

---

::: info

翻译自[Operating Modes](https://developer.bitcoin.org/devguide/operating_modes.html)
内容在整理，准确性请自己确认

:::

# Operating Modes 运作模式[](https://developer.bitcoin.org/devguide/operating_modes.html#operating-modes "Permalink to this headline")

The Bitcoin software has different levels of security and tradeoffs in order to verify the blockchain.

为了验证区块链，比特币软件有不同程度的安全和权衡。

## Introduction 引言[](https://developer.bitcoin.org/devguide/operating_modes.html#introduction "Permalink to this headline")

Currently there are two primary methods of validating the block chain as a client: Full nodes and SPV clients. Other methods, such as server-trusting methods, are not discussed as they are not recommended.

目前有两种主要的方法来验证作为客户端的块链: 完整节点和 SPV 客户端。由于不推荐使用其他方法，如服务器信任方法，因此不对其进行讨论。

## Full Node 完整节点[](https://developer.bitcoin.org/devguide/operating_modes.html#full-node "Permalink to this headline")

The first and most secure model is the one followed by Bitcoin Core, also known as a “thick” or “full chain” client. This security model assures the validity of the block chain by downloading and validating blocks from the genesis block all the way to the most recently discovered block. This is known as using the *height* of a particular block to verify the client’s view of the [network](https://developer.bitcoin.org/devguide/p2p_network.html).

第一种也是最安全的模式是比特币核心(Bitcoin Core) ，也称为“厚链”或“全链”客户端。这种安全模型通过下载和验证块从起源块一直到最近发现的块来保证块链的有效性。这被称为使用特定块的高度来验证客户端对网络的视图。

For a client to be fooled, an adversary would need to give a complete alternative block chain history that is of greater difficulty than the current “true” chain, which is computationally expensive (if not impossible) due to the fact that the chain with the most cumulative proof of work is by definition the “true” chain. Due to the computational difficulty required to generate a new block at the tip of the chain, the ability to fool a full node becomes very expensive after 6 confirmations. This form of verification is highly resistent to sybil attacks—only a single honest [network](https://developer.bitcoin.org/devguide/p2p_network.html) peer is required in order to receive and verify the complete state of the “true” block chain.

如果要欺骗客户，对手需要提供一个完整的替代区块链历史，这比目前的”真实”链难度更大，因为具有最多工作累积证明的链按定义是”真实”链，所以计算费用昂贵(如果不是不可能的话)。由于在链的顶端生成一个新的块需要计算困难，在6次确认后欺骗一个完整的节点的能力变得非常昂贵。这种验证形式对于 sybil 攻击具有很强的抵抗力ーー只需要一个诚实的网络对等点就可以接收和验证“真实”块链的完整状态。

![Block Height Compared To Block Depth](https://developer.bitcoin.org/_images/en-block-height-vs-depth.svg)

Block Height Compared To Block Depth[](https://developer.bitcoin.org/devguide/operating_modes.html#id1 "Permalink to this image")

块高度与块深度的比较

## Simplified Payment Verification (SPV) 简化付款核实(SPV)[](https://developer.bitcoin.org/devguide/operating_modes.html#simplified-payment-verification-spv "Permalink to this headline")

An alternative approach detailed in the [original Bitcoin paper](https://bitcoin.org/en/bitcoin-paper) is a client that only downloads the headers of blocks during the initial syncing process and then requests transactions from full nodes as needed. This scales linearly with the height of the block chain at only 80 bytes per block header, or up to 4.2MB per year, regardless of total block size.

在原始的比特币文件中详细描述的另一种方法是一个客户机，它只在初始同步过程中下载块头，然后根据需要从完整的节点请求交易。这随着块链的高度线性地扩展，每个块头只有80个字节，或者每年最多4.2 MB，与总块大小无关。

As described in the white paper, the merkle root in the block header along with a merkle branch can prove to the SPV client that the transaction in question is embedded in a block in the block chain. This does not guarantee validity of the transactions that are embedded. Instead it demonstrates the amount of work required to perform a double-spend attack.

正如白皮书所描述的那样，块头中的 merkle 根和 merkle 分支可以向 SPV 客户机证明所涉及的事务嵌入在块链中的一个块中。这不能保证嵌入事务的有效性。相反，它演示了执行双重使用攻击所需的工作量。

The block’s depth in the block chain corresponds to the cumulative difficulty that has been performed to build on top of that particular block. The SPV client knows the merkle root and associated transaction information, and requests the respective merkle branch from a full node. Once the merkle branch has been retrieved, proving the existence of the transaction in the block, the SPV client can then look to block *depth* as a proxy for transaction validity and security. The cost of an attack on a user by a malicious node who inserts an invalid transaction grows with the cumulative difficulty built on top of that block, since the malicious node alone will be mining this forged chain.

块的深度在块链对应的累积困难，已执行建立在该特定块的顶部。SPV 客户机知道 merkle 根和关联的事务信息，并从完整的节点请求各自的 merkle 分支。一旦检索到 merkle 分支，证明块中存在事务，SPV 客户机就可以将块深度作为事务有效性和安全性的代理。恶意节点插入无效事务对用户进行攻击的成本随着该块顶部累积难度的增加而增加，因为只有恶意节点才能挖掘这个伪造的链。

### Potential SPV Weaknesses 潜在的特殊目的机构弱点[](https://developer.bitcoin.org/devguide/operating_modes.html#potential-spv-weaknesses "Permalink to this headline")

If implemented naively, an SPV client has a few important weaknesses.

如果以天真的方式实现，SPV 客户机有一些重要的弱点。

First, while the SPV client can not be easily fooled into thinking a transaction is in a block when it is not, the reverse is not true. A full node can simply lie by omission, leading an SPV client to believe a transaction has not occurred. This can be considered a form of Denial of Service. One mitigation strategy is to connect to a number of full nodes, and send the requests to each node. However this can be defeated by [network](https://developer.bitcoin.org/devguide/p2p_network.html) partitioning or Sybil attacks, since identities are essentially free, and can be bandwidth intensive. Care must be taken to ensure the client is not cut off from honest nodes.

首先，尽管 SPV 客户机不会轻易被欺骗，认为事务处于一个块中，但事务并非如此，反之则不然。一个完整的节点可以简单地因为省略而撒谎，导致 SPV 客户端相信事务没有发生。这可以被认为是分布式拒绝服务攻击的一种形式。一种缓解策略是连接到许多完整的节点，并将请求发送到每个节点。然而，这可以被网络分区或 Sybil 攻击击败，因为标识本质上是免费的，并且可能是带宽密集型的。必须注意确保客户机不会与诚实的节点断开连接。

Second, the SPV client only requests transactions from full nodes corresponding to keys it owns. If the SPV client downloads all blocks and then discards unneeded ones, this can be extremely bandwidth intensive. If they simply ask full nodes for blocks with specific transactions, this allows full nodes a complete view of the public addresses that correspond to the user. This is a large privacy leak, and allows for tactics such as denial of service for clients, users, or addresses that are disfavored by those running full nodes, as well as trivial linking of funds. A client could simply spam many fake transaction requests, but this creates a large strain on the SPV client, and can end up defeating the purpose of thin clients altogether.

其次，SPV 客户机只从与它所拥有的密钥对应的完整节点请求事务。如果 SPV 客户端下载所有块，然后丢弃不需要的块，这可能是极端带宽密集型的。如果它们只是简单地请求具有特定事务的块的完整节点，这将允许完整节点获得与用户对应的公共地址的完整视图。这是一个大规模的隐私泄露，并且允许使用一些策略，比如为客户、用户或者那些运行完整节点的不喜欢的地址使用分布式拒绝服务攻击，以及简单的资金链接。客户机可以简单地发送许多伪造的交易请求，但这会给 SPV 客户机带来很大的压力，最终可能会破坏瘦客户机的用途。

To mitigate the latter issue, Bloom filters have been implemented as a method of obfuscation and compression of block data requests.

为了缓解后一个问题，Bloom 过滤器被实现为一种模糊和压缩块数据请求的方法。

### Bloom Filters 布鲁姆过滤器[](https://developer.bitcoin.org/devguide/operating_modes.html#bloom-filters "Permalink to this headline")

A Bloom filter is a space-efficient probabilistic data structure that is used to test membership of an element. The data structure achieves great data compression at the expense of a prescribed false positive rate.

Bloom 过滤器是一种空间有效的概率数据结构，用于测试元素的隶属度。数据结构以规定的假阳性率为代价获得了巨大的数据压缩。

A Bloom filter starts out as an array of n bits all set to 0. A set of k random hash functions are chosen, each of which output a single integer between the range of 1 and n.

Bloom 过滤器开始时是一个 n 位数组，全部设置为0。选择一组 k 个随机哈希函数，每个函数输出1到 n 范围内的一个整数。

When adding an element to the Bloom filter, the element is hashed k times separately, and for each of the k outputs, the corresponding Bloom filter bit at that index is set to 1.

当向 Bloom filter 添加一个元素时，该元素被分别散列 k 次，并且对于每个 k 输出，该索引处对应的 Bloom filter 位被设置为1。

Querying of the Bloom filter is done by using the same hash functions as before. If all k bits accessed in the bloom filter are set to 1, this demonstrates with high probability that the element lies in the set. Clearly, the k indices could have been set to 1 by the addition of a combination of other elements in the domain, but the parameters allow the user to choose the acceptable false positive rate.

对 Bloom 筛选器的查询是使用与前面相同的散列函数完成的。如果在 bloom filter 中访问的所有 k 位都设置为1，这很可能表明元素位于设置中。显然，k 指数可以通过在域中添加其他元素的组合来设置为1，但参数允许用户选择可接受的误报率。

Removal of elements can only be done by scrapping the bloom filter and re-creating it from scratch.

去除的元素只能通过废弃的布鲁姆过滤器和重新创建它从头开始。

### Application Of Bloom Filters Bloom 过滤器的应用[](https://developer.bitcoin.org/devguide/operating_modes.html#application-of-bloom-filters "Permalink to this headline")

Rather than viewing the false positive rates as a liability, it is used to create a tunable parameter that represents the desired privacy level and bandwidth trade-off. A SPV client creates their Bloom filter and sends it to a full node using the message `filterload`, which sets the filter for which transactions are desired. The command `filteradd` allows addition of desired data to the filter without needing to send a totally new Bloom filter, and `filterclear` allows the connection to revert to standard block discovery mechanisms. If the filter has been loaded, then full nodes will send a modified form of blocks, called a merkle block. The merkle block is simply the block header with the merkle branch associated with the set Bloom filter.

与其将误报率视为一种负担，不如用它创建一个可调参数，表示所需的隐私级别和带宽折衷。SPV 客户机创建它们的 Bloom 过滤器，并使用消息过滤加载将其发送到一个完整的节点，该过滤器设置所需的事务。命令 filteradd 允许向过滤器添加所需的数据，而不需要发送一个全新的 Bloom 过滤器，filterclear 允许连接恢复到标准的块发现机制。如果过滤器已经加载，那么满节点将发送一个修改形式的块，称为 merkle 块。Merkle 块是简单的块头，其中 merkle 分支与设置 Bloom 滤波器相关联。

An SPV client can not only add transactions as elements to the filter, but also public keys, data from signature scripts and pubkey scripts, and more. This enables P2SH transaction finding.

SPV 客户机不仅可以将事务作为元素添加到过滤器，还可以添加公钥、来自签名脚本和 pubkey 脚本的数据等等。这使得 P2SH 事务查找成为可能。

If a user is more privacy-conscious, he can set the Bloom filter to include more false positives, at the expense of extra bandwidth used for transaction discovery. If a user is on a tight bandwidth budget, he can set the false-positive rate to low, knowing that this will allow full nodes a clear view of what transactions are associated with his client.

如果用户更注重隐私，他可以将 Bloom 过滤器设置为包含更多误报，以牺牲用于事务发现的额外带宽为代价。如果用户的带宽预算很紧张，他可以将误报率设置为较低，因为他知道这样可以让满节点清楚地看到与他的客户机关联的事务。

**Resources:** [BitcoinJ](http://bitcoinj.github.io/), a Java implementation of Bitcoin that is based on the SPV security model and Bloom filters. Used in most Android wallets.

参考资料: BitcoinJ，一个基于 SPV 安全模型和 Bloom 过滤器的比特币的 Java 实现。用于大多数安卓钱包。

Bloom filters were standardized for use via [BIP37](https://github.com/bitcoin/bips/blob/master/bip-0037.mediawiki). Review the BIP for implementation details.

Bloom 过滤器通过 BIP37标准化使用。

## Future Proposals 未来的建议[](https://developer.bitcoin.org/devguide/operating_modes.html#future-proposals "Permalink to this headline")

There are future proposals such as Unspent Transaction Output (UTXO) commitments in the block chain to find a more satisfactory middle-ground for clients between needing a complete copy of the block chain, or trusting that a majority of your connected peers are not lying. UTXO commitments would enable a very secure client using a finite amount of storage using a data structure that is authenticated in the block chain. These type of proposals are, however, in very early stages, and will require soft forks in the [network](https://developer.bitcoin.org/devguide/p2p_network.html).

未来还有一些建议，比如在区块链中作出未用交易输出(UTXO)承诺，以便为客户在需要一个完整的区块链副本，或相信大多数连接的同行没有撒谎之间找到一个更令人满意的中间立场。UTXO 承诺将使用块链中经过身份验证的数据结构使用有限存储量的非常安全的客户机成为可能。然而，这些类型的建议还处于非常早期的阶段，需要在网络中进行软分支。

Until these types of operating modes are implemented, modes should be chosen based on the likely threat model, computing and bandwidth constraints, and liability in bitcoin value.

在实现这些类型的操作模式之前，应该根据可能的威胁模型、计算和带宽限制以及比特币价值的可靠性来选择模式。

**Resources:** [Original Thread on UTXO Commitments](https://bitcointalk.org/index.php?topic=88208.0)

参考资料: 关于 UTXO 承诺的原始线索
