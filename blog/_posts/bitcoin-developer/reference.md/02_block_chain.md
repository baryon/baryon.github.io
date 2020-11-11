---
title: 参考 - Blockchain 区块链
summary: 下面的小节简要记录了核心块的细节
date: 2020-11-02 02:00
tags:
- 比特币
- 翻译
- 比特币开发指南

---

::: info

翻译自[Block Chain &#8212; Bitcoin](https://developer.bitcoin.org/reference/block_chain.html#block-chain)
内容在整理，准确性请自己确认

:::

# Block Chain 块链[](https://developer.bitcoin.org/reference/block_chain.html#block-chain "Permalink to this headline")

The following subsections briefly document core block details.

下面的小节简要记录了核心块的细节。

## Block Headers 块标题[](https://developer.bitcoin.org/reference/block_chain.html#block-headers "Permalink to this headline")

Block headers are serialized in the 80-byte format described below and then hashed as part of Bitcoin’s proof-of-work algorithm, making the serialized header format part of the consensus rules.

块头按照下面描述的80字节格式进行序列化，然后作为比特币的工作证明算法的一部分进行哈希处理，使序列化头格式成为共识规则的一部分。

| Bytes | Name                                                                                                   | Data Type | Description                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ----- | ------------------------------------------------------------------------------------------------------ | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 4     | version                                                                                                | int32_t   | The [block version](https://developer.bitcoin.org/glossary.html#term-Block) number indicates which set of block validation rules to follow. See the list of block versions below.块版本号指示要遵循的块验证规则集。请参阅下面的块版本列表。                                                                                                                                                                                                                        |
| 32    | [previous block header hash](https://developer.bitcoin.org/terms.html#term-previous-block-header-hash) | char[32]  | A SHA256(SHA256()) hash in internal byte order of the previous block’s header. This ensures no previous block can be changed without also changing this block’s header.按前一块头的内部字节顺序排列的 SHA256(SHA256())哈希。这样可以确保在不改变这个块头的情况下，不能更改以前的块。                                                                                                                                                                                                |
| 32    | merkle root hash                                                                                       | char[32]  | A SHA256(SHA256()) hash in internal byte order. The merkle root is derived from the hashes of all transactions included in this block, ensuring that none of those transactions can be modified without modifying the header. See the [merkle trees section](https://developer.bitcoin.org/reference/block_chain.html#merkle-trees) below.按内部字节顺序排列的 SHA256(SHA256())哈希。Merkle 根是从该块中包含的所有事务的散列中派生出来的，确保在不修改头的情况下不能修改这些事务。参见下面的金鱼树部分。 |
| 4     | time                                                                                                   | uint32_t  | The block time is a [Unix epoch time](https://en.wikipedia.org/wiki/Unix_time) when the miner started hashing the header (according to the miner). Must be strictly greater than the median time of the previous 11 blocks. Full nodes will not accept blocks with headers more than two hours in the future according to their clock.块时间是一个 Unix 新纪元时间，当矿工开始散列头(根据矿工)。必须严格大于前11个区块的中位时间。根据时钟，满节点将来不会接受头部超过两小时的块。                     |
| 4     | nBits                                                                                                  | uint32_t  | An encoded version of the target threshold this block’s header hash must be less than or equal to. See the nBits format described below.此块的头哈希必须小于或等于目标阈值的编码版本。请参阅下面描述的 nBits 格式。                                                                                                                                                                                                                                                     |
| 4     | nonce                                                                                                  | uint32_t  | An arbitrary number miners change to modify the header hash in order to produce a hash less than or equal to the target threshold. If all 32-bit values are tested, the time can be updated or the coinbase transaction can be changed and the merkle root updated.任意数字挖掘器更改以修改标头哈希，从而生成小于或等于目标阈值的哈希。如果测试了所有32位值，则可以更新时间或更改 coinbase 事务并更新 merkle 根。                                                                                  |

The hashes are in internal byte order; the other values are all in little-endian order.

散列是按内部字节顺序排列的; 其他值都是按 little-endian 顺序排列的。

An example header in hex:

02000000 ........................... Block version: 2
b6ff0b1b1680a2862a30ca44d346d9e8
910d334beb48ca0c0000000000000000 ... Hash of previous block's header
9d10aa52ee949386ca9385695f04ede2
70dda20810decd12bc9b048aaab31471 ... Merkle root
24d95a54 ........................... [Unix time][unix epoch time]: 1415239972
30c31b18 ........................... Target: 0x1bc330 * 256**(0x18-3)
fe9f0864 ........................... Nonce

### Block Versions 块版本[](https://developer.bitcoin.org/reference/block_chain.html#block-versions "Permalink to this headline")

- **Version 1** was introduced in the genesis block (January 2009).
  
  版本1引入了创世区块(2009年1月)。

- [Version 2](https://developer.bitcoin.org/terms.html#term-v2-block) was introduced in [Bitcoin Core 0.7.0](https://bitcoin.org/en/release/v0.7.0) (September 2012) as a soft fork. As described in [BIP34](https://github.com/bitcoin/bips/blob/master/bip-0034.mediawiki), valid [version 2 blocks](https://developer.bitcoin.org/terms.html#term-v2-block) require a [block height parameter in the coinbase](https://developer.bitcoin.org/terms.html#term-coinbase-block-height). Also described in [BIP34](https://github.com/bitcoin/bips/blob/master/bip-0034.mediawiki) are rules for rejecting certain blocks; based on those rules, [Bitcoin Core 0.7.0](https://bitcoin.org/en/release/v0.7.0) and later versions began to reject [version 2 blocks](https://developer.bitcoin.org/terms.html#term-v2-block) without the block height in coinbase at block height 224,412 (March 2013) and began to reject new version 1 blocks three weeks later at block height 227,930.
  
  版本2在比特币核心0.7.0(2012年9月)中作为一个软叉引入。正如在 BIP34中所描述的，有效的版本2块需要 coinbase 中的块高度参数。BIP34中还描述了拒绝某些块的规则; 根据这些规则，比特币核心0.7.0及以后的版本开始拒绝在块高度224,412(2013年3月)处没有块高度的版本2块，并在三周后在块高度227,930处开始拒绝新版本1块。

- **Version 3** blocks were introduced in [Bitcoin Core 0.10.0](https://bitcoin.org/en/release/v0.10.0) (February
  
  版本3块引入了比特币核心0.10.0(2月)
  
  2015. as a soft fork. When the fork reached full enforcement (July 2015), it required strict [DER](https://en.wikipedia.org/wiki/X.690#DER_encoding) encoding of all [ECDSA](https://en.wikipedia.org/wiki/Elliptic_Curve_DSA) signatures in new blocks as described in [BIP66](https://github.com/bitcoin/bips/blob/master/bip-0066.mediawiki). Transactions that do not use strict [DER](https://en.wikipedia.org/wiki/X.690#DER_encoding)encoding had previously been non-standard since [Bitcoin Core 0.8.0](https://bitcoin.org/en/release/v0.8.0) (February 2012).
        
        作为一个软叉子。当分叉达到充分执行(2015年7月) ，它要求严格的 DER 编码所有 ECDSA 签名在新的块，如 BIP66所述。自从比特币核心0.8.0(2012年2月)以来，不使用严格 DER 编码的交易一直是非标准的。

- **Version 4** blocks specified in BIP65 and introduced in [Bitcoin Core 0.11.2](https://bitcoin.org/en/release/v0.11.2) (November 2015) as a soft fork became active in December 2015. These blocks now support the new `OP_CHECKLOCKTIMEVERIFY` opcode described in that BIP.
  
  在 BIP65中指定并在 Bitcoin Core 0.11.2(2015年11月)中引入的第4版块是一个软叉子，于2015年12月激活。这些块现在支持那个 BIP 中描述的 op_checklocktimeverify 操作码。

The mechanism used for the version 2, 3, and 4 upgrades is commonly called IsSuperMajority() after the function added to Bitcoin Core to manage those soft forking changes. See [BIP34](https://github.com/bitcoin/bips/blob/master/bip-0034.mediawiki) for a full description of this method.

用于版本2、3和4升级的机制通常被称为 IsSuperMajority () ，因为在比特币核心中添加了管理这些软分支变化的功能。有关此方法的完整描述，请参阅 BIP34。

As of this writing, a newer method called *version bits* is being designed to manage future soft forking changes, although it’s not known whether version 4 will be the last soft fork to use the IsSuperMajority() function. Draft [BIP9](https://github.com/bitcoin/bips/blob/master/bip-0009.mediawiki) describes the version bits design as of this writing, although it is still being actively edited and may substantially change while in the draft state.

在写这篇文章的时候，一种叫做 version bits 的新方法正在被设计用来管理未来的软分支更改，尽管还不知道 version 4是否是最后一个使用 IsSuperMajority ()函数的软分支。草案 BIP9描述的版本比特设计截至本文写作，虽然它仍在积极编辑和可能大幅度改变，而在草案状态。

### Merkle Trees 默克尔树[](https://developer.bitcoin.org/reference/block_chain.html#merkle-trees "Permalink to this headline")

The merkle root is constructed using all the TXIDs of transactions in this block, but first the TXIDs are placed in order as required by the consensus rules:

Merkle 根是使用该块中的所有 txid 来构造的，但是首先按照一致性规则的要求按顺序排列 txid:

- The coinbase transaction’s TXID is always placed first.
  
  Coinbase 事务的 TXID 始终位于第一位。

- Any input within this block can spend an output which also appears in this block (assuming the spend is otherwise valid). However, the TXID corresponding to the output must be placed at some point before the TXID corresponding to the input. This ensures that any program parsing block chain transactions linearly will encounter each output before it is used as an input.
  
  这个块中的任何输入都可以使用同样出现在这个块中的输出(假设这个输入是有效的)。但是，必须将与输出对应的 TXID 放在与输入对应的 TXID 之前的某个位置。这可以确保任何程序解析块链事务线性地遇到每个输出，然后才将其用作输入。

If a block only has a coinbase transaction, the coinbase TXID is used as the merkle root hash.

如果一个块只有一个 coinbase 事务，那么 coinbase TXID 将被用作 merkle root 散列。

If a block only has a coinbase transaction and one other transaction, the TXIDs of those two transactions are placed in order, concatenated as 64 raw bytes, and then SHA256(SHA256()) hashed together to form the merkle root.

如果一个块只有一个 coinbase 事务和一个其他事务，那么这两个事务的 txid 按顺序排列，串联为64个原始字节，然后 SHA256(SHA256())散列在一起形成 merkle 根。

If a block has three or more transactions, intermediate merkle tree rows are formed. The TXIDs are placed in order and paired, starting with the coinbase transaction’s TXID. Each pair is concatenated together as 64 raw bytes and SHA256(SHA256()) hashed to form a second row of hashes. If there are an odd (non-even) number of TXIDs, the last TXID is concatenated with a copy of itself and hashed. If there are more than two hashes in the second row, the process is repeated to create a third row (and, if necessary, repeated further to create additional rows). Once a row is obtained with only two hashes, those hashes are concatenated and hashed to produce the merkle root.

如果一个块有三个或多个事务，则形成中间的 merkle 树行。TXID 按顺序排列并配对，从 coinbase 事务的 TXID 开始。将每个对连接在一起，形成64个原始字节和 SHA256(SHA256())散列，从而形成第二行散列。如果 TXID 的数量是奇数(非偶数) ，则最后一个 TXID 将与自身的一个副本连接并进行散列。如果第二行中有两个以上的散列，则重复该过程以创建第三行(如果必要，还可以进一步重复以创建其他行)。一旦只使用两个散列获得一行，就会将这些散列串联起来并进行散列处理，以生成 merkle 根。

![Example Merkle Tree Construction](https://developer.bitcoin.org/_images/en-merkle-tree-construction.svg)

Example Merkle Tree Construction[](https://developer.bitcoin.org/reference/block_chain.html#id1 "Permalink to this image")

默克尔树结构示例

TXIDs and intermediate hashes are always in internal byte order when they’re concatenated, and the resulting merkle root is also in internal byte order when it’s placed in the block header.

Txid 和中间散列在连接时总是按内部字节顺序排列的，而产生的 merkle 根放在块头中时也是按内部字节顺序排列的。

### Target nBits 目标 nBits[](https://developer.bitcoin.org/reference/block_chain.html#target-nbits "Permalink to this headline")

The target threshold is a 256-bit unsigned integer which a header hash must be equal to or below in order for that header to be a valid part of the block chain. However, the header field *nBits* provides only 32 bits of space, so the target number uses a less precise format called “compact” which works like a base-256 version of scientific notation:

目标阈值是一个256位无符号整数，为了使标头成为块链的有效部分，标头哈希值必须等于或低于该值。然而，头字段 nBits 只提供32位的空间，因此目标数字使用一种不太精确的格式，称为“压缩” ，它的工作原理类似于 base-256版本的科学记数法:

![Converting nBits Into A Target Threshold](https://developer.bitcoin.org/_images/en-nbits-overview.svg)

Converting nBits Into A Target Threshold[](https://developer.bitcoin.org/reference/block_chain.html#id2 "Permalink to this image")

将 nBits 转换为目标阈值

As a base-256 number, nBits can be quickly parsed as bytes the same way you might parse a decimal number in base-10 scientific notation:

作为一个以256为基数的数字，nBits 可以像以10为基数的十进制数字一样快速解析为字节:

![Quickly Converting nBits](https://developer.bitcoin.org/_images/en-nbits-quick-parse.svg)

Quickly Converting nBits[](https://developer.bitcoin.org/reference/block_chain.html#id3 "Permalink to this image")

快速转换 nBits

Although the target threshold should be an unsigned integer, the original nBits implementation inherits properties from a signed data class, allowing the target threshold to be negative if the high bit of the significand is set. This is useless—the header hash is treated as an unsigned number, so it can never be equal to or lower than a negative target threshold. Bitcoin Core deals with this in two ways:

虽然目标阈值应该是一个无符号整数，但是原始 nBits 实现继承了一个有符号数据类的属性，如果设置了有意义的高位，则允许目标阈值为负。这是没有用的ー头哈希被视为无符号数，因此它永远不能等于或低于负目标阈值。比特币核心以两种方式处理这个问题:

- When parsing nBits, Bitcoin Core converts a negative target threshold into a target of zero, which the header hash can equal (in theory, at least).
  
  在解析 nBits 时，比特币核心将负目标阈值转换为零的目标，头部散列值可以等于零(至少在理论上是这样)。

- When creating a value for nBits, Bitcoin Core checks to see if it will produce an nBits which will be interpreted as negative; if so, it divides the significand by 256 and increases the exponent by 1 to produce the same number with a different encoding.
  
  当为 nBits 创建一个值时，比特币核心会检查是否会产生一个 nBits，这个 nBits 将被解释为负数; 如果是这样，它将有效数除以256，并将指数增加1，以产生一个不同编码的同一个数字。

Some examples taken from the Bitcoin Core test cases:

比特币核心测试案例中的一些例子:

| nBits国家信息技术局 | Target目标                 | Notes注释                                         |
| ------------ | ------------------------ | ----------------------------------------------- |
| 0x01003456   | 0x00                     |                                                 |
| 0x01123456   | 0x12第一季，第12集             |                                                 |
| 0x02008000   | 0x80                     |                                                 |
| 0x05009234   | 0x92340000               |                                                 |
| 0x04923456   | -0x12345600- 0 x12345600 | High bit set (0x80 in 0x92).高位设置(0x80 in 0x92)。 |
| 0x04123456   | 0x12345600               | Inverse of above; no high bit.与上面的数字相反; 没有高位。   |

Difficulty 1, the minimum allowed difficulty, is represented on mainnet and the current testnet by the nBits value 0x1d00ffff. Regtest mode uses a different difficulty 1 value—0x207fffff, the highest possible value below uint32_max which can be encoded; this allows near-instant building of blocks in regtest mode.

难度1，允许的最小难度，在主网络和当前的 testnet 上用 nBits 值0x1d00ffff 表示。Regtest 模式使用一个不同的难度值1ー0x207fff，这是可以编码的 uint32max 以下的最高可能值; 这允许在 Regtest 模式下几乎立即构建块。

## Serialized Blocks 序列化块[](https://developer.bitcoin.org/reference/block_chain.html#serialized-blocks "Permalink to this headline")

Under current consensus rules, a block is not valid unless its serialized size is less than or equal to 1 MB. All fields described below are counted towards the serialized size.

根据当前的一致同意规则，除非块的序列化大小小于或等于1 MB，否则该块无效。下面描述的所有字段都计入序列化大小。

| Bytes字节    | Name姓名         | Data Type数据类型         | Description描述                                                                                                                                                                                                                                                                                                                                                                                                         |
| ---------- | -------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 80         | block header集箱 | block_header块头        | The block header in the format described in the [block header section](https://developer.bitcoin.org/reference/block_chain.html#block-headers).块头部分中描述的格式的块头。                                                                                                                                                                                                                                                         |
| *Varies*不同 | txn_count计数    | compactSize uint紧凑型尺寸 | The total number of transactions in this block, including the coinbase transaction.此块中的事务总数，包括 coinbase 事务。                                                                                                                                                                                                                                                                                                           |
| *Varies*不同 | txns           | raw transaction原始交易   | Every transaction in this block, one after another, in raw transaction format. Transactions must appear in the data stream in the same order their TXIDs appeared in the first row of the merkle tree. See the [merkle tree section](https://developer.bitcoin.org/reference/block_chain.html#merkle-trees) for details.此块中的每个事务，一个接一个，采用原始事务格式。事务在数据流中的出现顺序必须与它们的 txid 在 merkle 树的第一行中的出现顺序相同。有关详细信息，请参阅 merkle 树部分。 |

The first transaction in a block must be a [coinbase transaction](https://developer.bitcoin.org/glossary.html#term-Coinbase-transaction) which should collect and spend any transaction fees paid by transactions included in this block.

一个块中的第一笔交易必须是一个硬币交易，该交易应该收取和支出该块中包含的交易所支付的任何交易费用。

All blocks with a block height less than 6,930,000 are entitled to receive a block subsidy of newly created bitcoin value, which also should be spent in the coinbase transaction. (The block subsidy started at 50 bitcoins and is being halved every 210,000 blocks—approximately once every four years. As of November 2017, it’s 12.5 bitcoins.)

所有块高度小于6,930,000的块有权获得新创造的比特币价值的块补贴，这也应该用于硬币交易。(大额补贴最初为50比特币，现在每21万个街区减半——大约每四年一次。截至2017年11月，比特币数量为12.5枚。)

Together, the transaction fees and block subsidy are called the [block reward](https://developer.bitcoin.org/glossary.html#term-Block-reward). A coinbase transaction is invalid if it tries to spend more value than is available from the block reward.

交易费和大额补贴一起称为大额奖励。如果一个 coinbase 事务试图花费比块奖励更多的值，那么该事务是无效的。
