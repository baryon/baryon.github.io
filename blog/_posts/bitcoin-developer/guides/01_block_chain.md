---
title: 指南 - Blockchain 区块链
summary: 区块链提供了比特币的公共分类账，一个有序和有时间标记的交易记录。此系统用于防止重复支出和修改以前的交易记录。
date: 2020-11-01 01:00
tags:
- 比特币
- 翻译
- 比特币开发指南

---


::: info

翻译自[Block Chain](https://developer.bitcoin.org/devguide/block_chain.html)
内容在整理，准确性请自己确认

:::

# Block Chain 块链[](https://developer.bitcoin.org/devguide/block_chain.html#block-chain "Permalink to this headline")

The block chain provides Bitcoin’s public ledger, an ordered and timestamped record of transactions. This system is used to protect against double spending and modification of previous transaction records.

区块链提供了比特币的公共分类账，一个有序和有时间标记的交易记录。此系统用于防止重复支出和修改以前的交易记录。

## Introduction 引言[](https://developer.bitcoin.org/devguide/block_chain.html#introduction "Permalink to this headline")

Each full node in the Bitcoin [network](https://developer.bitcoin.org/devguide/p2p_network.html) independently stores a block chain containing only blocks validated by that node. When several nodes all have the same blocks in their block chain, they are considered to be in [consensus](https://developer.bitcoin.org/glossary.html#term-Consensus). The validation rules these nodes follow to maintain consensus are called [consensus rules](https://developer.bitcoin.org/glossary.html#term-Consensus-rules). This section describes many of the consensus rules used by Bitcoin Core.

比特币网络中的每个完整节点都独立存储一个块链，其中只包含由该节点验证的块。当几个节点在它们的块链中都有相同的块时，它们被认为是一致的。这些节点为维护一致性而遵循的验证规则称为一致性规则。本节描述了比特币核心使用的许多共识规则。

![Block Chain Overview](https://developer.bitcoin.org/_images/en-blockchain-overview.svg)

Block Chain Overview[](https://developer.bitcoin.org/devguide/block_chain.html#id1 "Permalink to this image")

块链概述

The illustration above shows a simplified version of a block chain. A [block](https://developer.bitcoin.org/glossary.html#term-Block) of one or more new transactions is collected into the transaction data part of a block. Copies of each transaction are hashed, and the hashes are then paired, hashed, paired again, and hashed again until a single hash remains, the [merkle root](https://developer.bitcoin.org/glossary.html#term-Merkle-root) of a merkle tree.

上面的插图显示了一个简化版本的块链。一个或多个新事务块被收集到一个块的事务数据部分中。每个事务的副本都被散列化，然后这些散列被配对，散列化，再配对，再配对，直到剩下一个散列，即 merkle 树的 merkle 根。

The merkle root is stored in the block header. Each block also stores the hash of the previous block’s header, chaining the blocks together. This ensures a transaction cannot be modified without modifying the block that records it and all following blocks.

Merkle 根存储在块头中。每个块还存储前一个块头的散列，将这些块链接在一起。这样可以确保在不修改记录事务的块和以下所有块的情况下不能修改事务。

Transactions are also chained together. Bitcoin wallet software gives the impression that satoshis are sent from and to wallets, but bitcoins really move from transaction to transaction. Each transaction spends the satoshis previously received in one or more earlier transactions, so the input of one transaction is the output of a previous transaction.

事务也被链接在一起。比特币钱包软件给人的印象是 satoshis 是从钱包发送到钱包的，但比特币真的是从一个交易转移到另一个交易。每个事务都会使用先前在一个或多个早期事务中接收到的 satoshis，因此一个事务的输入是先前事务的输出。

![Transaction Propagation](https://developer.bitcoin.org/_images/en-transaction-propagation.svg)

Transaction Propagation[](https://developer.bitcoin.org/devguide/block_chain.html#id2 "Permalink to this image")

事务传播

A single transaction can create multiple outputs, as would be the case when sending to multiple addresses, but each output of a particular transaction can only be used as an input once in the block chain. Any subsequent reference is a forbidden double spend—an attempt to spend the same satoshis twice.

单个事务可以创建多个输出，就像发送到多个地址时那样，但是特定事务的每个输出只能在块链中作为输入使用一次。随后的任何引用都是被禁止的重复使用ーー试图重复使用同一个 satoshis。

Outputs are tied to [transaction identifiers (TXIDs)](https://developer.bitcoin.org/glossary.html#term-Txid), which are the hashes of signed transactions.

输出与事务标识符(txid)绑定，后者是已签名事务的散列。

Because each output of a particular transaction can only be spent once, the outputs of all transactions included in the block chain can be categorized as either [Unspent Transaction Outputs (UTXOs)](https://developer.bitcoin.org/glossary.html#term-UTXO) or spent transaction outputs. For a payment to be valid, it must only use UTXOs as inputs.

因为特定事务的每个输出只能使用一次，所以块链中包含的所有事务的输出可以归类为未使用的事务输出(UTXOs)或已使用的事务输出。为了使付款有效，它必须只使用 UTXOs 作为输入。

Ignoring coinbase transactions (described later), if the value of a transaction’s outputs exceed its inputs, the transaction will be rejected—but if the inputs exceed the value of the outputs, any difference in value may be claimed as a [transaction fee](https://developer.bitcoin.org/glossary.html#term-Transaction-fee) by the Bitcoin [miner](https://developer.bitcoin.org/glossary.html#term-Mining) who creates the block containing that transaction. For example, in the illustration above, each transaction spends 10,000 satoshis fewer than it receives from its combined inputs, effectively paying a 10,000 satoshi transaction fee.

忽略货币基础交易(后面将描述) ，如果交易的输出价值超过其输入，交易将被拒绝ー但是如果输入超过输出价值，任何价值上的差异都可以由创建包含该交易的块的比特币矿工声称为交易费。例如，在上面的例子中，每笔交易花费10,000 satoshis 少于它从其综合投入收到，实际上支付了10,000 satoshi 交易费。

## Proof Of Work 工作证明[](https://developer.bitcoin.org/devguide/block_chain.html#proof-of-work "Permalink to this headline")

The block chain is collaboratively maintained by anonymous peers on the [network](https://developer.bitcoin.org/devguide/p2p_network.html), so Bitcoin requires that each block prove a significant amount of work was invested in its creation to ensure that untrustworthy peers who want to modify past blocks have to work harder than honest peers who only want to add new blocks to the block chain.

区块链是由网络上的匿名同行共同维护的，因此比特币要求每个区块证明其创建过程中投入了大量工作，以确保那些想修改过去区块的不可信的同行必须比那些只想在区块链中添加新区块的诚实同行更加努力工作。

Chaining blocks together makes it impossible to modify transactions included in any block without modifying all subsequent blocks. As a result, the cost to modify a particular block increases with every new block added to the block chain, magnifying the effect of the proof of work.

将块链接在一起使得不可能在不修改所有后续块的情况下修改包含在任何块中的事务。因此，修改一个特定块的成本随着每个新块添加到块链中而增加，放大了工作证明的效果。

The [proof of work](https://developer.bitcoin.org/glossary.html#term-Proof-of-work) used in Bitcoin takes advantage of the apparently random nature of cryptographic hashes. A good cryptographic hash algorithm converts arbitrary data into a seemingly random number. If the data is modified in any way and the hash re-run, a new seemingly random number is produced, so there is no way to modify the data to make the hash number predictable.

比特币使用的工作证明利用了加密哈希表面上的随机性。一个好的加密散列算法可以将任意数据转换成看似随机的数字。如果以任何方式修改数据并重新运行散列，就会产生一个新的看似随机的数字，因此无法修改数据以使散列数可预测。

To prove you did some extra work to create a block, you must create a hash of the block header which does not exceed a certain value. For example, if the maximum possible hash value is 2256 − 1, you can prove that you tried up to two combinations by producing a hash value less than 2255.

为了证明你做了一些额外的工作来创建一个块，你必须创建一个不超过一定值的块头的散列。例如，如果最大可能哈希值为2256-1，则可以通过生成小于2255的哈希值来证明尝试了多达两种组合。

In the example given above, you will produce a successful hash on average every other try. You can even estimate the probability that a given hash attempt will generate a number below the [target](https://developer.bitcoin.org/glossary.html#term-nBits) threshold. Bitcoin assumes a linear probability that the lower it makes the target threshold, the more hash attempts (on average) will need to be tried.

在上面给出的示例中，平均每隔一次尝试就会生成一个成功的散列。您甚至可以估计给定的散列尝试将生成低于目标阈值的数字的概率。比特币假设一个线性概率，它使目标阈值越低，越多的散列尝试(平均而言)将需要尝试。

New blocks will only be added to the block chain if their hash is at least as challenging as a [difficulty](https://developer.bitcoin.org/glossary.html#term-Difficulty) value expected by the consensus protocol. Every 2,016 blocks, the [network](https://developer.bitcoin.org/devguide/p2p_network.html) uses timestamps stored in each block header to calculate the number of seconds elapsed between generation of the first and last of those last 2,016 blocks. The ideal value is 1,209,600 seconds (two weeks).

新块只有在其哈希值至少与协商一致议定书预期的难度值一样具有挑战性时，才会被添加到块链中。每2,016个块，网络使用存储在每个块头中的时间戳来计算生成最后2,016个块中的第一个和最后一个块之间经过的秒数。理想值是1,209,600秒(两周)。

- If it took fewer than two weeks to generate the 2,016 blocks, the expected difficulty value is increased proportionally (by as much as 300%) so that the next 2,016 blocks should take exactly two weeks to generate if hashes are checked at the same rate.
  
  如果生成2016个块花费的时间少于两周，那么预期的难度值会按比例增加(增加300%) ，因此，如果哈希值以相同的速度检查，那么接下来的2016个块应该正好需要两周才能生成。

- If it took more than two weeks to generate the blocks, the expected difficulty value is decreased proportionally (by as much as 75%) for the same reason.
  
  如果花费两周以上的时间来生成积木，那么由于同样的原因，期望的难度值会成比例地降低(多达75%)。

(Note: an off-by-one error in the Bitcoin Core implementation causes the difficulty to be updated every 2,01*6*blocks using timestamps from only 2,01*5* blocks, creating a slight skew.)

(注意: 比特币核心实现中的一个时间差一错误导致每2016个块使用仅有的2015个块的时间戳难以更新，产生了一个轻微的倾斜。)

Because each block header must hash to a value below the target threshold, and because each block is linked to the block that preceded it, it requires (on average) as much hashing power to propagate a modified block as the entire Bitcoin [network](https://developer.bitcoin.org/devguide/p2p_network.html) expended between the time the original block was created and the present time. Only if you acquired a majority of the [network’s](https://developer.bitcoin.org/devguide/p2p_network.html) hashing power could you reliably execute such a [51 percent attack](https://developer.bitcoin.org/glossary.html#term-51-percent-attack)against transaction history (although, it should be noted, that even less than 50% of the hashing power still has a good chance of performing such attacks).

因为每个块头必须散列到低于目标阈值的值，而且因为每个块都链接到它之前的块，所以它需要(平均而言)散列功率来传播一个修改后的块，这相当于从创建原始块到目前这段时间花费的整个比特币网络的功率。只有获得了网络散列功能的大部分，才能可靠地执行这种针对事务历史记录的51% 的攻击(尽管，应该注意的是，即使只有不到50% 的散列功能仍然有很好的机会执行这种攻击)。

The block header provides several easy-to-modify fields, such as a dedicated nonce field, so obtaining new hashes doesn’t require waiting for new transactions. Also, only the 80-byte block header is hashed for proof-of-work, so including a large volume of transaction data in a block does not slow down hashing with extra I/O, and adding additional transaction data only requires the recalculation of the ancestor hashes in the merkle tree.

块头提供了几个易于修改的字段，例如一个专用的 nonce 字段，因此获得新的散列不需要等待新的事务。此外，为了验证工作，只对80字节的块头进行哈希处理，因此在一个块中包含大量事务数据并不会减慢使用额外 I/O 进行哈希处理的速度，而添加额外的事务数据只需重新计算 merkle 树中的祖先哈希。

## Block Height And Forking 块高度和分叉[](https://developer.bitcoin.org/devguide/block_chain.html#block-height-and-forking "Permalink to this headline")

Any Bitcoin miner who successfully hashes a block header to a value below the target threshold can add the entire block to the block chain (assuming the block is otherwise valid). These blocks are commonly addressed by their [block height](https://developer.bitcoin.org/glossary.html#term-Block-height)—the number of blocks between them and the first Bitcoin block (block 0, most commonly known as the [genesis block](https://developer.bitcoin.org/glossary.html#term-Genesis-block)). For example, block 2016 is where difficulty could have first been adjusted.

任何比特币矿工，只要成功地将一个块头的值压缩到低于目标阈值，就可以将整个块添加到该块链(假设该块在其他方面是有效的)。这些块通常是通过它们的块高度(它们与第一个比特币块(block 0，通常称为 genesis block)之间的块数)来定位的。例如，2016年是难度调整的第一年。

![Common And Uncommon Block Chain Forks](https://developer.bitcoin.org/_images/en-blockchain-fork.svg)

Common And Uncommon Block Chain Forks[](https://developer.bitcoin.org/devguide/block_chain.html#id3 "Permalink to this image")

常用和不常用的块状链叉

Multiple blocks can all have the same block height, as is common when two or more miners each produce a block at roughly the same time. This creates an apparent [fork](https://developer.bitcoin.org/glossary.html#term-Fork) in the block chain, as shown in the illustration above.

多个区块都可以具有相同的区块高度，这在两个或两个以上的矿工在大致相同的时间生产一个区块时很常见。这在块链中创建了一个明显的分叉，如上图所示。

When miners produce simultaneous blocks at the end of the block chain, each node individually chooses which block to accept. In the absence of other considerations, discussed below, nodes usually use the first block they see.

当矿工在块链末端同时生成块时，每个节点单独选择接受哪个块。在没有其他考虑因素的情况下，节点通常使用它们看到的第一个块。

Eventually a miner produces another block which attaches to only one of the competing simultaneously-mined blocks. This makes that side of the fork stronger than the other side. Assuming a fork only contains valid blocks, normal peers always follow the most difficult chain to recreate and throw away [stale blocks](https://developer.bitcoin.org/glossary.html#term-Stale-block) belonging to shorter forks. (Stale blocks are also sometimes called orphans or orphan blocks, but those terms are also used for true orphan blocks without a known parent block.)

最终，一个采矿者生产出另一个区块，它只连接到一个竞争的同时开采的区块。这使得叉子的那一面比另一面更坚固。假设 fork 只包含有效块，一般的伙伴总是遵循最难重新创建的链，并丢弃属于较短的 fork 的陈旧块。(陈旧块有时也称为孤儿或孤儿块，但这些术语也用于没有已知父块的真正孤儿块。)

Long-term forks are possible if different miners work at cross-purposes, such as some miners diligently working to extend the block chain at the same time other miners are attempting a 51 percent attack to revise transaction history.

如果不同的矿工工作目标相互矛盾，长期分支就是可能的，例如一些矿工努力扩大区块链，而其他矿工却试图用51% 的攻击来修改交易历史。

Since multiple blocks can have the same height during a block chain fork, block height should not be used as a globally unique identifier. Instead, blocks are usually referenced by the hash of their header (often with the byte order reversed, and in hexadecimal).

因为在一个块链叉期间，多个块的高度可以相同，所以块的高度不应该用作全局唯一标识符。相反，块通常由它们的头的散列引用(通常是字节顺序颠倒的，并且是十六进制的)。

## Transaction Data 交易数据[](https://developer.bitcoin.org/devguide/block_chain.html#transaction-data "Permalink to this headline")

Every block must include one or more transactions. The first one of these transactions must be a coinbase transaction, also called a generation transaction, which should collect and spend the block reward (comprised of a block subsidy and any transaction fees paid by transactions included in this block).

每个块必须包含一个或多个事务。这些交易中的第一项交易必须是货币基础交易，也称为发电交易，该交易应收取和支出整笔奖金(包括整笔补贴和该整笔交易所支付的任何交易费)。

The UTXO of a coinbase transaction has the special condition that it cannot be spent (used as an input) for at least 100 blocks. This temporarily prevents a miner from spending the transaction fees and block reward from a block that may later be determined to be stale (and therefore the coinbase transaction destroyed) after a block chain fork.

Coinbase 事务的 UTXO 具有一个特殊条件，即至少100个块不能使用它(用作输入)。这暂时阻止了矿工支出的交易费用，并阻止奖励块后来可能被确定为陈旧(因此硬币交易破坏)后，块链叉。

Blocks are not required to include any non-coinbase transactions, but miners almost always do include additional transactions in order to collect their transaction fees.

区块不要求包括任何非货币基础交易，但矿商几乎总是包括额外交易，以收取交易费。

All transactions, including the coinbase transaction, are encoded into blocks in binary raw transaction format.

所有事务(包括 coinbase 事务)都以二进制原始事务格式编码为块。

The raw transaction format is hashed to create the transaction identifier (txid). From these txids, the [merkle tree](https://developer.bitcoin.org/glossary.html#term-Merkle-tree)is constructed by pairing each txid with one other txid and then hashing them together. If there are an odd number of txids, the txid without a partner is hashed with a copy of itself.

对原始事务格式进行散列以创建事务标识符(txid)。在这些 txid 中，通过将每个 txid 与另一个 txid 配对，然后将它们一起散列，构造出 merkle 树。如果 txid 的数目是奇数，则使用 txid 本身的一个副本对没有合作伙伴的 txid 进行散列。

The resulting hashes themselves are each paired with one other hash and hashed together. Any hash without a partner is hashed with itself. The process repeats until only one hash remains, the merkle root.

由此产生的哈希本身与另一个哈希配对并一起进行哈希运算。任何没有搭档的散列都是自己散列的。这个过程不断重复，直到只剩下一个 hash，即 merkle 根。

For example, if transactions were merely joined (not hashed), a five-transaction merkle tree would look like the following text diagram:

例如，如果事务仅仅是连接(而不是散列) ，一个五事务 merkle 树看起来就像下面的文本图:

       ABCDEEEE .......Merkle root
      /        \

   ABCD        EEEE
  /    \      /
 AB    CD    EE .......E is paired with itself
/  \  /  \  /
A  B  C  D  E .........Transactions

As discussed in the Simplified Payment Verification (SPV) subsection, the merkle tree allows clients to verify for themselves that a transaction was included in a block by obtaining the merkle root from a block header and a list of the intermediate hashes from a full peer. The full peer does not need to be trusted: it is expensive to fake block headers and the intermediate hashes cannot be faked or the verification will fail.

正如在简化支付验证(Simplified Payment Verification，SPV)小节中所讨论的，merkle 树允许客户机通过从块头获取 merkle 根和从完整对等机获取中间散列列表，自行验证事务是否包含在块中。完整的对等节点不需要被信任: 伪造块头是昂贵的，中间的散列不能被伪造，否则验证就会失败。

For example, to verify transaction D was added to the block, an SPV client only needs a copy of the C, AB, and EEEE hashes in addition to the merkle root; the client doesn’t need to know anything about any of the other transactions. If the five transactions in this block were all at the maximum size, downloading the entire block would require over 500,000 bytes—but downloading three hashes plus the block header requires only 140 bytes.

例如，为了验证事务 d 被添加到块中，SPV 客户机除了 merkle 根目录外只需要 c、 AB 和 EEEE 哈希的副本; 客户机不需要了解任何其他事务。如果这个块中的5个事务都处于最大大小，那么下载整个块将需要超过50万字节ー但是下载3个哈希加上块头只需要140字节。

Note: If identical txids are found within the same block, there is a possibility that the merkle tree may collide with a block with some or all duplicates removed due to how unbalanced merkle trees are implemented (duplicating the lone hash). Since it is impractical to have separate transactions with identical txids, this does not impose a burden on honest software, but must be checked if the invalid status of a block is to be cached; otherwise, a valid block with the duplicates eliminated could have the same merkle root and block hash, but be rejected by the cached invalid outcome, resulting in security bugs such as [CVE-2012-2459](https://en.bitcoin.it/wiki/CVEs#CVE-2012-2459).

注意: 如果在同一个块中发现相同的 txids，由于实现不平衡的 merkle 树(复制单散列)的方式，merkle 树可能会与一个块发生碰撞，并移除部分或全部重复值。由于使用相同的 txids 进行单独的事务处理是不切实际的，因此这不会给诚实的软件带来负担，但是如果要缓存块的无效状态，则必须检查它; 否则，一个被消除重复项的有效块可能具有相同的 merkle root 和 block hash，但是被缓存的无效结果拒绝，从而导致出现安全错误，如 CVE-2012-2459。

## Consensus Rule Changes 共识规则的改变[](https://developer.bitcoin.org/devguide/block_chain.html#consensus-rule-changes "Permalink to this headline")

To maintain consensus, all full nodes validate blocks using the same consensus rules. However, sometimes the consensus rules are changed to introduce new features or prevent [network](https://developer.bitcoin.org/devguide/p2p_network.html) abuse. When the new rules are implemented, there will likely be a period of time when non-upgraded nodes follow the old rules and upgraded nodes follow the new rules, creating two possible ways consensus can break:

为了保持一致性，所有完整节点使用相同的一致性规则验证块。然而，有时为了引入新的特性或防止网络滥用，共识规则被修改。当新规则实现时，未升级的节点可能会有一段时间遵循旧规则，而升级的节点遵循新规则，从而创建可能破坏共识的两种方式:

1. A block following the new consensus rules is accepted by upgraded nodes but rejected by non-upgraded nodes. For example, a new transaction feature is used within a block: upgraded nodes understand the feature and accept it, but non-upgraded nodes reject it because it violates the old rules.
   
   升级的节点可以接受遵循新的一致性规则的块，但未升级的节点不能接受。例如，在一个块中使用一个新的事务特性: 升级的节点理解该特性并接受它，但未升级的节点拒绝它，因为它违反了旧的规则。

2. A block violating the new consensus rules is rejected by upgraded nodes but accepted by non-upgraded nodes. For example, an abusive transaction feature is used within a block: upgraded nodes reject it because it violates the new rules, but non-upgraded nodes accept it because it follows the old rules.
   
   违反新一致规则的块被升级的节点拒绝，但是被未升级的节点接受。例如，在一个块中使用了一个滥用的事务特性: 升级的节点拒绝它，因为它违反了新规则，但未升级的节点接受它，因为它遵循旧规则。

In the first case, rejection by non-upgraded nodes, mining software which gets block chain data from those non-upgraded nodes refuses to build on the same chain as mining software getting data from upgraded nodes. This creates permanently divergent chains—one for non-upgraded nodes and one for upgraded nodes—called a [hard fork](https://developer.bitcoin.org/glossary.html#term-Hard-fork).

在第一种情况下，未升级的节点拒绝访问，从未升级的节点获取块链数据的挖掘软件拒绝建立与从升级的节点获取数据的挖掘软件相同的链。这就产生了永久性的分叉链(一个用于未升级的节点，另一个用于升级的节点) ，称为硬分叉。

![Hard Fork](https://developer.bitcoin.org/_images/en-hard-fork.svg)

Hard Fork[](https://developer.bitcoin.org/devguide/block_chain.html#id4 "Permalink to this image")

In the second case, rejection by upgraded nodes, it’s possible to keep the block chain from permanently diverging if upgraded nodes control a majority of the hash rate. That’s because, in this case, non-upgraded nodes will accept as valid all the same blocks as upgraded nodes, so the upgraded nodes can build a stronger chain that the non-upgraded nodes will accept as the best valid block chain. This is called a [soft fork](https://developer.bitcoin.org/glossary.html#term-Soft-fork).

在第二种情况下，被升级的节点拒绝，如果升级的节点控制了大部分的散列速率，就有可能防止块链永久地发散。这是因为，在这种情况下，未升级的节点将接受与升级的节点相同的所有块为有效节点，因此升级的节点可以构建一个更强大的链，未升级的节点将接受这个链作为最佳有效的块链。这叫做软叉子。

![Soft Fork](https://developer.bitcoin.org/_images/en-soft-fork.svg)

Soft Fork[](https://developer.bitcoin.org/devguide/block_chain.html#id5 "Permalink to this image")

软叉

Although a fork is an actual divergence in block chains, changes to the consensus rules are often described by their potential to create either a hard or soft fork. For example, “increasing the block size above 1 MB requires a hard fork.” In this example, an actual block chain fork is not required—but it is a possible outcome.

尽管 fork 是块链中实际存在的分歧，但是一致性规则的更改通常被描述为它们创建硬或软 fork 的潜力。例如，“将块大小增加到1 MB 以上需要一个硬叉。”在这个例子中，实际的块链叉并不是必需的ーー但它是一个可能的结果。

Consensus rule changes may be activated in various ways. During Bitcoin’s first two years, Satoshi Nakamoto performed several soft forks by just releasing the backwards-compatible change in a client that began immediately enforcing the new rule. Multiple soft forks such as [BIP30](https://github.com/bitcoin/bips/blob/master/bip-0030.mediawiki) have been activated via a flag day where the new rule began to be enforced at a preset time or block height. Such forks activated via a flag day are known as [User Activated Soft Forks](https://developer.bitcoin.org/glossary.html#term-UASF) (UASF) as they are dependent on having sufficient users (nodes) to enforce the new rules after the flag day.

协商一致规则的更改可以通过多种方式激活。在比特币诞生的头两年，中本聪通过发布客户端向后兼容的改变，完成了几个软叉子，客户端立即开始执行新规则。多个软叉，如 BIP30已经通过国旗日被激活，新规则开始强制在预设的时间或块高度。这样的叉子激活通过一个国旗日被称为用户激活软叉(UASF) ，因为他们是依赖于有足够的用户(节点)来执行新的规则后，国旗日。

Later soft forks waited for a majority of hash rate (typically 75% or 95%) to signal their readiness for enforcing the new consensus rules. Once the signalling threshold has been passed, all nodes will begin enforcing the new rules. Such forks are known as [Miner Activated Soft Forks](https://developer.bitcoin.org/glossary.html#term-MASF) (MASF) as they are dependent on miners for activation.

之后，软叉子等待大多数的哈希率(通常是75% 或95%)来表明他们已经准备好执行新的一致同意规则。一旦通过了信令阈值，所有节点将开始实施新规则。这种叉子被称为矿工激活软叉(MASF) ，因为它们依赖于矿工的激活。

**Resources:** [BIP16](https://github.com/bitcoin/bips/blob/master/bip-0016.mediawiki), [BIP30](https://github.com/bitcoin/bips/blob/master/bip-0030.mediawiki), and [BIP34](https://github.com/bitcoin/bips/blob/master/bip-0034.mediawiki) were implemented as changes which might have lead to soft forks. [BIP50](https://github.com/bitcoin/bips/blob/master/bip-0050.mediawiki)describes both an accidental hard fork, resolved by temporary downgrading the capabilities of upgraded nodes, and an intentional hard fork when the temporary downgrade was removed. A document from Gavin Andresen outlines [how future rule changes may be implemented](https://gist.github.com/gavinandresen/2355445).

参考资料: BIP16、 BIP30和 BIP34被实现为可能导致软叉的变更。BIP50描述了一个偶然的硬分叉，通过临时降级升级的节点的能力来解决，以及一个故意的硬分叉，当临时降级被移除时。来自 Gavin Andresen 的一份文档概述了未来规则变更可能如何实现。

## Detecting Forks 探测叉子[](https://developer.bitcoin.org/devguide/block_chain.html#detecting-forks "Permalink to this headline")

Non-upgraded nodes may use and distribute incorrect information during both types of forks, creating several situations which could lead to financial loss. In particular, non-upgraded nodes may relay and accept transactions that are considered invalid by upgraded nodes and so will never become part of the universally-recognized best block chain. Non-upgraded nodes may also refuse to relay blocks or transactions which have already been added to the best block chain, or soon will be, and so provide incomplete information.

未升级的节点可能在这两种分支中使用和分发不正确的信息，造成可能导致财务损失的几种情况。特别是，未升级的节点可能中继和接受被升级的节点认为无效的事务，因此永远不会成为公认的最佳块链的一部分。未升级的节点也可能拒绝中继已经添加到最佳块链中的块或事务，或者即将添加到最佳块链中的块或事务，从而提供不完整的信息。

Bitcoin Core includes code that detects a hard fork by looking at block chain proof of work. If a non-upgraded node receives block chain headers demonstrating at least six blocks more proof of work than the best chain it considers valid, the node reports a warning in the [“getnetworkinfo” RPC](https://developer.bitcoin.org/reference/rpc/getnetworkinfo.html) results and runs the `-alertnotify`command if set. This warns the operator that the non-upgraded node can’t switch to what is likely the best block chain.

比特币核心包括代码，检测硬叉看块链证明的工作。如果一个没有升级的节点收到块链标题，显示至少比它认为有效的最佳链多六个块的工作证明，该节点在“ getnetworkinfo” RPC 结果中报告一个警告，并在设置时运行-alertnotify 命令。这警告操作员，未升级的节点不能切换到可能是最好的块链。

Full nodes can also check block and transaction version numbers. If the block or transaction version numbers seen in several recent blocks are higher than the version numbers the node uses, it can assume it doesn’t use the current consensus rules. Bitcoin Core reports this situation through the [“getnetworkinfo” RPC](https://developer.bitcoin.org/reference/rpc/getnetworkinfo.html) and `-alertnotify` command if set.

完整节点还可以检查块和事务版本号。如果在最近几个块中看到的块或事务版本号高于节点使用的版本号，则可以假定它没有使用当前的一致性规则。比特币核心通过“ getnetworkinfo” RPC 和-alertnotify 命令(如果设置)报告这种情况。

In either case, block and transaction data should not be relied upon if it comes from a node that apparently isn’t using the current consensus rules.

无论哪种情况，如果块和事务数据来自一个显然不使用当前一致性规则的节点，则不应该依赖它们。

SPV clients which connect to full nodes can detect a likely hard fork by connecting to several full nodes and ensuring that they’re all on the same chain with the same block height, plus or minus several blocks to account for transmission delays and stale blocks. If there’s a divergence, the client can disconnect from nodes with weaker chains.

连接到完整节点的 SPV 客户机可以通过连接到几个完整节点并确保它们都在同一个链上，具有相同的块高度，加上或减去几个块来解释传输延迟和过时块，从而检测到一个可能的硬分叉。如果发生分歧，客户端可以断开与链条较弱的节点的连接。

SPV clients should also monitor for block and [transaction version number](https://developer.bitcoin.org/terms.html#term-transaction-version-number) increases to ensure they process received transactions and create new transactions using the current consensus rules.

SPV 客户机还应该监视块和事务版本号的增加，以确保它们处理收到的事务，并使用当前的一致性规则创建新的事务。
