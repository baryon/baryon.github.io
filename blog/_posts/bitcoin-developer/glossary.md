---
title: Glossary 词汇表
summary: Glossary 词汇表
date: 2020-11-04 01:00
tags:
- 比特币
- 翻译
- 比特币开发指南

---

::: info

翻译自[Glossary](https://developer.bitcoin.org/glossary.html#glossary)
内容在整理，准确性请自己确认

:::



# Glossary 词汇表[](https://developer.bitcoin.org/glossary.html#glossary "Permalink to this headline")

51 percent attack 51% 的攻击率

Majority attack 多数攻击

The ability of someone controlling a majority of network hash rate to revise transaction history and prevent new transactions from confirming.

控制大多数网络散列速率的人修改事务历史记录并阻止新事务确认的能力。

Address 地址

A 20-byte hash formatted using base58check to produce either a P2PKH or P2SH Bitcoin address. Currently the most common way users exchange payment information.

使用 base58check 格式化的20字节哈希，可以生成 P2PKH 或 P2SH 比特币地址。目前最常见的方式是用户交换支付信息。

**Not to be confused with:** IP address

不要与: IP 地址混淆

Base58check

The method used in Bitcoin for converting 160-bit hashes into P2PKH and P2SH addresses. Also used in other parts of Bitcoin, such as encoding private keys for backup in WIP format. Not the same as other base58 implementations.

比特币中用于将160位散列转换为 P2PKH 和 P2SH 地址的方法。也用于比特币的其他部分，如编码私钥以备份 WIP 格式。不同于其他 base58实现。

**Not to be confused with:** P2PKH address, P2SH address, IP address

不要混淆: P2PKH 地址，P2SH 地址，IP 地址

Block 布洛克

One or more transactions prefaced by a block header and protected by proof of work. Blocks are the data stored on the block chain.

一个或多个事务以块头作为前缀，并受到工作证明的保护。块是存储在块链上的数据。

Block chain 块链

Best block chain 最佳区块链

A chain of blocks with each block referencing the block that preceded it. The most-difficult-to-recreate chain is the best block chain.

一个块链，其中每个块引用其前面的块。最难再造的链是最好的块链。

**Not to be confused with:** Header chain

不要与: Header chain 混淆

Block header 块头

Header 页眉

An 80-byte header belonging to a single block which is hashed repeatedly to create proof of work.

一个80字节的头，属于一个单一的块，它被反复散列以创建工作证明。

Height 身高

Block height 块高度

The number of blocks preceding a particular block on a block chain. For example, the genesis block has a height of zero because zero block preceded it.

在一个块链上某一特定块之前的块数。例如，创世区块的高度为零，因为它的前面是零。

Block reward 阻止奖励

The amount that miners may claim as a reward for creating a block. Equal to the sum of the block subsidy (newly available satoshis) plus the transactions fees paid by transactions included in the block.

矿工可以要求的作为创造一个块的奖励的金额。等于整批补贴(新提供的 satoshis)加上整批交易所支付的交易费。

**Not to be confused with:** Block subsidy, Transaction fees

不要与之混淆: 集体补贴，交易费用

Maximum Block Size 最大块大小

The maximum size of a block according to the consensus rules. The current block size limit is 4 million weight units (1 million vbytes).

根据一致性规则的块的最大大小。当前的块大小限制为400万个重量单位(100万 vbytes)。

**Not to be confused with:** Block, Blockchain, Blockchain size

不要混淆: 块，区块链，区块链大小

Blocks-first sync 第一次同步

Synchronizing the block chain by downloading each block from a peer and then validating it.

通过从对等点下载每个块并验证它来同步块链。

**Not to be confused with:** Headers-first sync

不要和: Headers-first sync 混淆

Bloom filter 布鲁姆过滤器

A filter used primarily by SPV clients to request only matching transactions and merkle blocks from full nodes.

主要由 SPV 客户机使用的一种过滤器，它只请求来自完整节点的匹配事务和 merkle 块。

**Not to be confused with:** Bloom filter (general computer science term, of which Bitcoin’s bloom filters are a specific implementation)

不要与 Bloom filter 混淆(一般的计算机科学术语，其中比特币的 Bloom filter 是一个具体的实现)

Chain code 链码

In HD wallets, 256 bits of entropy added to the public and private keys to help them generate secure child keys; the master chain code is usually derived from a seed along with the master private key

在高清钱包中，256位熵增加到公钥和私钥中，以帮助它们生成安全的子密钥; 主链代码通常来源于一个种子和主私钥

Change address 更改地址

Change output 改变输出

An output in a transaction which returns satoshis to the spender, thus preventing too much of the input value from going to transaction fees.

交易中的一种输出，它将 satoshis 返还给消费者，从而防止过多的输入价值转化为交易费用。

**Not to be confused with:** Address reuse

不要混淆: 地址重用

Child key 子密钥

Child public key 子公开密码匙

Child private key 子私钥

In HD wallets, a key derived from a parent key. The key can be either a private key or a public key, and the key derivation may also require a chain code.

在高清钱包中，从父密钥派生出来的密钥。密钥可以是私钥或公钥，密钥派生还可能需要链代码。

**Not to be confused with:** Public key (derived from a private key, not a parent key)

不要与公钥混淆: 公钥(源自私钥，而非父钥)

Coinbase

A special field used as the sole input for coinbase transactions. The coinbase allows claiming the block reward and provides up to 100 bytes for arbitrary data.

用作 coinbase 事务唯一输入的特殊字段。Coinbase 允许索取块奖励，并为任意数据提供最多100字节。

**Not to be confused with:** Coinbase transaction, Coinbase.com

不要和 Coinbase transaction 混淆: Coinbase transaction，Coinbase.com

Coinbase transaction 硬币交易

Generation transaction 发电事务

The first transaction in a block. Always created by a miner, it includes a single coinbase.

块中的第一个事务。总是由 miner 创建，它包含一个 coinbase。

**Not to be confused with:** Coinbase (the unique part of a coinbase transaction)

不要与 Coinbase 混淆: Coinbase (Coinbase 事务的唯一部分)

CompactSize 紧凑型大小

A type of variable-length integer commonly used in the Bitcoin P2P protocol and Bitcoin serialized data structures.

比特币 P2P 协议和比特币序列化数据结构中常用的一种变长整数。

**Not to be confused with:** VarInt (a data type Bitcoin Core uses for local data storage), Compact (the data type used for nBits in the block header)

不要与 VarInt (比特币核心用于本地数据存储的数据类型)和 Compact (块头中 nBits 使用的数据类型)混淆

Compressed public key 压缩公钥

An ECDSA public key that is 33 bytes long rather than the 65 bytes of an uncompressed public key.

ECDSA 公钥，长度为33个字节，而不是未压缩的公钥的65个字节。

Confirmation score 确认得分

Confirmations 确认

Confirmed transaction 确认交易

Unconfirmed transaction 未经确认的交易

A score indicating the number of blocks on the best block chain that would need to be modified to remove or modify a particular transaction. A confirmed transaction has a confirmation score of one or higher.

指示最佳区块链上需要修改以删除或修改特定事务的区块数的得分。已确认的交易的确认得分为一分或更高。

Consensus 共识

When several nodes (usually most nodes on the network) all have the same blocks in their locally-validated best block chain.

当多个节点(通常是网络上的大多数节点)在其本地验证的最佳块链中拥有相同的块时。

**Not to be confused with:** Social consensus (often used in discussion among developers to indicate that most people agree with a particular plan), Consensus rules (the rules that allow nodes to maintain consensus)

不要混淆: Social Consensus (开发人员在讨论中经常使用，以表明大多数人同意特定的计划) ，Consensus 规则(允许节点保持共识的规则)

Consensus rules 共识规则

The block validation rules that full nodes follow to stay in consensus with other nodes.

完整节点为了与其他节点保持一致而遵循的块验证规则。

**Not to be confused with:** Consensus (what happens when nodes follow the same consensus rules)

不要与 Consensus 混淆(当节点遵循相同的 Consensus 规则时会发生什么)

Child pays for parent 子女为父母支付费用

CPFP

Ancestor mining 祖先挖掘

Selecting transactions for mining not just based on their fees but also based on the fees of their ancestors (parents) and descendants (children).

为采矿选择交易不仅基于他们的费用，还基于他们的祖先(父母)和后代(子女)的费用。

**Not to be confused with:** Replace by Fee, RBF

不要混淆: 取代费，RBF

Denomination 面额

Bitcoins 比特币

Satoshis

Denominations of Bitcoin value, usually measured in fractions of a bitcoin but sometimes measured in multiples of a satoshi. One bitcoin equals 100,000,000 satoshis.

比特币的面值，通常以比特币的分数来计算，但有时也以智慧的倍数来计算。一个比特币等于100,000,000 satoshis。

**Not to be confused with:** Binary bits, a unit of data with two possible values

不要与二进制位混淆: 二进制位是一个数据单位，有两个可能的值

Difficulty 难度

Network difficulty 网络困难

How difficult it is to find a block relative to the difficulty of finding the easiest possible block. The easiest possible block has a proof-of-work difficulty of 1.

找到一个块相对于找到最容易的块是多么困难。最简单的可能块的工作证明难度为1。

**Not to be confused with:** Target threshold (the value from which difficulty is calculated)

不要与: 目标阈值(计算难度的值)混淆

DNS seed DNS 种子

A DNS server which returns IP addresses of full nodes on the Bitcoin network to assist in peer discovery.

一种 DNS 服务器，它返回比特币网络上所有节点的 IP 地址，以帮助同行发现。

**Not to be confused with:** HD wallet seeds

不要与高清钱包种子混淆

Double spend 双重消费

A transaction that uses the same input as an already broadcast transaction. The attempt of duplication, deceit, or conversion, will be adjudicated when only one of the transactions is recorded in the blockchain.

使用与已广播事务相同的输入的事务。重复，欺骗，或转换的企图，将被裁定时，只有一个交易记录在块环链。

Escrow contract 第三方托管合同

A transaction in which a spender and receiver place funds in a 2-of-2 (or other m-of-n) multisig output so that neither can spend the funds until they’re both satisfied with some external outcome.

一种交易，其中支出者和接收者将资金放入2/2(或其他 m/n)的多重输出中，这样任何一方都不能使用资金，直到他们都对某些外部结果感到满意。

Extended key 扩展键

Public extended key 公开扩展密钥

Private extended key 私有扩展密钥

In the context of HD wallets, a public key or private key extended with the chain code to allow them to derive child keys.

在高清钱包的上下文中，一个公钥或私钥与链码一起扩展，以允许他们获得子密钥。

Fork 叉子

When two or more blocks have the same block height, forking the block chain. Typically occurs when two or more miners find blocks at nearly the same time. Can also happen as part of an attack.

当两个或两个以上的块具有相同的块高度时，叉开块链。通常发生在两个或两个以上的矿工在几乎同一时间发现块。也可能发生在攻击的一部分。

**Not to be confused with:** Hard fork (a change in consensus rules that breaks security for nodes that don’t upgrade), Soft fork (a change in consensus rules that weakens security for nodes that don’t upgrade), Software fork (when one or more developers permanently develops a codebase separately from other developers), Git fork (when one or more developers temporarily develops a codebase separately from other developers)

不要混淆: Hard fork (对共识规则的修改，破坏了未升级节点的安全性)、 Soft fork (对共识规则的修改，削弱了未升级节点的安全性)、 Software fork (当一个或多个开发人员永久性地独立于其他开发人员开发代码库)、 Git fork (当一个或多个开发人员暂时独立于其他开发人员开发代码库)

Genesis block 成因区块

Block 0 0座

The first block in the Bitcoin block chain.

比特币区块链的第一个区块。

**Not to be confused with:** Generation transaction (the first transaction in a block)

不要与下面的事务混淆: 生成事务(块中的第一个事务)

Hard fork 硬叉子

A permanent divergence in the block chain, commonly occurs when non-upgraded nodes can’t validate blocks created by upgraded nodes that follow newer consensus rules.

块链中的永久性分歧，通常发生在未升级的节点无法验证升级的节点按照新的一致性规则创建的块时。

**Not to be confused with:** Fork (a regular fork where all nodes follow the same consensus rules, so the fork is resolved once one chain has more proof of work than another), Soft fork (a temporary divergence in the block chain caused by non-upgraded nodes not following new consensus rules), Software fork (when one or more developers permanently develops a codebase separately from other developers), Git fork (when one or more developers temporarily develops a codebase separately from other developers

不要混淆: Fork (一个常规的 Fork，其中所有节点遵循相同的一致性规则，因此当一个链比另一个链拥有更多的工作证明时，Fork 就被解析了)、 Soft Fork (由于没有升级的节点没有遵循新的一致性规则而导致的块链中的暂时分歧)、 Software Fork Fork (当一个或多个开发人员永久地独立于其他开发人员开发一个代码库时)、 Git Fork (当一个或多个开发人员暂时独立于其他开发人员开发一个代码库时)

Hardened extended key 硬化扩展键

A variation on HD wallet extended keys where only the hardened extended private key can derive child keys. This prevents compromise of the chain code plus any private key from putting the whole wallet at risk.

高清钱包扩展密钥的一个变体，其中只有硬化扩展私钥可以派生子密钥。这样可以防止链码和任何私钥的泄露将整个钱包置于危险之中。

HD protocol 高清协议

HD wallet 高清钱包

The Hierarchical Deterministic (HD) key creation and transfer protocol (BIP32), which allows creating child keys from parent keys in a hierarchy. Wallets using the HD protocol are called HD wallets.

层次确定(HD)密钥创建和传输协议(BIP32) ，它允许从层次结构中的父密钥创建子密钥。使用高清协议的钱包被称为高清钱包。

HD wallet seed 高清钱包种子

Root seed 根种子

A potentially-short value used as a seed to generate the master private key and master chain code for an HD wallet.

一个潜在的短价值作为一个种子，用于生成主私钥和主链代码的高清钱包。

**Not to be confused with:** Mnemonic code / mnemonic seed (a binary root seed formatted as words to make it easier for humans to transcribe and possibly remember)

不要与之混淆: 助记代码/助记种子(一种格式化为单词的二进制根种子，以便人们更容易转录和记忆)

Header chain 页眉链

Best header chain 最佳头链

A chain of block headers with each header linking to the header that preceded it; the most-difficult-to-recreate chain is the best header chain

一个块头链，每个头链接到它之前的头; 最难重新创建的链是最好的头链

**Not to be confused with:** Block chain

不要混淆: 块链

Headers-first sync 头部-先同步

Synchronizing the block chain by downloading block headers before downloading the full blocks.

在下载完整块之前，通过下载块标头来同步块链。

**Not to be confused with:** Blocks-first sync (Downloading entire blocks immediately without first getting their headers)

不要混淆: block-first sync (立即下载整个块而不首先获得它们的头)

High-priority transaction 高优先级事务

Free transaction 免费交易

Transactions that don’t have to pay a transaction fee because their inputs have been idle long enough to accumulated large amounts of priority. Note: miners choose whether to accept free transactions.

不需要支付交易费的交易，因为它们的输入已经闲置了足够长的时间以至于积累了大量的优先权。注意: 矿工选择是否接受免费交易。

Initial block download 初始块下载

IBD 炎症性肠病

The process used by a new node (or long-offline node) to download a large number of blocks to catch up to the tip of the best block chain.

一个新节点(或长离线节点)用来下载大量块以捕捉最佳块链顶端的过程。

**Not to be confused with:** Blocks-first sync (syncing includes getting any amount of blocks; IBD is only used for large numbers of blocks)

不要和 block-first 同步混淆(同步包括获得任意数量的块; IBD 只用于大数量的块)

Input 输入

TxIn 天津泰信科技有限公司

An input in a transaction which contains three fields: an outpoint, a signature script, and a sequence number. The outpoint references a previous output and the signature script allows spending it.

包含三个字段的事务中的输入: 一个断点、一个签名脚本和一个序列号。Outpoint 引用以前的输出，而签名脚本允许使用该输出。

Internal byte order 内部字节顺序

The standard order in which hash digests are displayed as strings—the same format used in serialized blocks and transactions.

将散列摘要显示为字符串的标准顺序ー与序列化块和事务中使用的格式相同。

**Not to be confused with:** RPC byte order (where the byte order is reversed)

不要与: RPC 字节顺序混淆(其中的字节顺序是反向的)

Inventory 存货清单

A data type identifier and a hash; used to identify transactions and blocks available for download through the Bitcoin P2P network.

一种数据类型标识符和散列，用于识别可通过比特币 P2P 网络下载的交易和块。

**Not to be confused with:** Inv message (one of the P2P messages that transmits inventories)

不要与: Inv 消息(传输库存的 P2P 消息之一)混淆

Locktime 上锁时间

nLockTime

Part of a transaction which indicates the earliest time or earliest block when that transaction may be added to the block chain.

事务的一部分，它指出最早的时间或最早的块，当该事务可以添加到块链。

Mainnet

The original and main network for Bitcoin transactions, where satoshis have real economic value.

比特币交易的原始和主要网络，satoshis 拥有真正的经济价值。

**Not to be confused with:** Testnet (an open network very similar to mainnet where satoshis have no value), Regtest (a private testing node similar to testnet)

不要与下面的内容混淆: Testnet (一个非常类似于 mainnet 的开放网络，其中 satoshis 没有值)、 Regtest (一个类似于 Testnet 的私有测试节点)

Transaction malleability 事务延展性

Transaction mutability 交易易变性

The ability of someone to change (mutate) unconfirmed transactions without making them invalid, which changes the transaction’s txid, making child transactions invalid.

某人更改(变更)未经确认的事务而不使其无效的能力，这将更改事务的 txid，使子事务无效。

**Not to be confused with:** BIP62 (a proposal for an optional new transaction version that reduces the set of known mutations for common transactions)

不要与 BIP62混淆(一个可选的新事务版本的提议，它减少了一组已知的常见事务的突变)

Miner-activated soft fork 矿工激活软叉

MASF

A Soft Fork activated by through miner signalling.

一个软叉通过矿工信号激活。

**Not to be confused with:** User Activated Soft Fork (a soft fork activated by flag day or node enforcement instead of miner signalling.), Fork (a regular fork where all nodes follow the same consensus rules, so the fork is resolved once one chain has more proof of work than another), Hard fork (a permanent divergence in the block chain caused by non-upgraded nodes not following new consensus rules), Soft fork (a temporary divergence in the block chain caused by non-upgraded nodes not following new consensus rules), Software fork (when one or more developers permanently develops a codebase separately from other developers), Git fork (when one or more developers temporarily develops a codebase separately from other developers

不要混淆: User Activated Soft Fork (由国旗日或节点强制激活的软叉，而不是 miner 信号)、 Fork (所有节点遵循相同的一致性规则的常规分叉，因此当一个链比另一个链有更多的工作证明时，分叉就被解析了)、 Hard Fork (没有升级的节点没有遵循新的一致性规则而导致的块链中的永久性分歧)、 Soft Fork (没有升级的节点没有遵循新的一致性规则而导致的块链中的暂时分歧)、 Software Fork (当一个或多个开发人员永久性地独立于其他开发人员开发代码库时)、 Git Fork (当一个或多个开发人员暂时独立于其他开发人员开发代码库时)

Master chain code 主链码

Master private key 主私钥

In HD wallets, the master chain code and master private key are the two pieces of data derived from the root seed.

在硬盘钱包中，主链码和主私钥是从根种子中派生出来的两部分数据。

Merkle block 梅克尔滑车

A partial merkle tree connecting transactions matching a bloom filter to the merkle root of a block.

一个连接事务的部分 merkle 树，该事务匹配一个 bloom filter 到块的 merkle 根。

**Not to be confused with:** MerkleBlock message (a P2P protocol message that transmits a merkle block)

不要与: MerkleBlock 消息(传输 merkle 块的 P2P 协议消息)混淆

Merkle root 秋水仙根

The root node of a merkle tree, a descendant of all the hashed pairs in the tree. Block headers must include a valid merkle root descended from all transactions in that block.

金鱼树的根节点，是树中所有散列对的后代。块标头必须包含一个从该块中的所有事务传递过来的有效 merkle 根。

**Not to be confused with:** Merkle tree (the tree of which the merkle root is the root node), Merkle block (a partial merkle branch connecting the root to one or more leaves [transactions])

不要与 Merkle 树(其根为根节点的树)、 Merkle 块(将根连接到一个或多个叶子的部分 Merkle 分支[事务])混淆

Merkle tree 默克尔树

A tree constructed by hashing paired data (the leaves), then pairing and hashing the results until a single hash remains, the merkle root. In Bitcoin, the leaves are almost always transactions from a single block.

通过散列成对数据(叶子)构造的树，然后对结果进行配对和散列，直到保留单个散列(merkle 根)。在比特币中，叶子几乎总是来自单个块的交易。

**Not to be confused with:** Partial merkle branch (a branch connecting one or more leaves to the root), Merkle block (a partial merkle branch connecting one or more transactions from a single block to the block merkle root)

不要混淆: Partial Merkle branch (连接一个或多个叶子到根的分支)、 Merkle block (连接单个块到 Merkle 根的一个或多个事务的 Partial Merkle branch)

Message header 消息头

The four header fields prefixed to all messages on the Bitcoin P2P network.

比特币 P2P 网络上的所有消息都以四个头字段为前缀。

Minimum relay fee 最低中继费用

Relay fee 中继费

The minimum transaction fee a transaction must pay (if it isn’t a high-priority transaction) for a full node to relay that transaction to other nodes. There is no one minimum relay fee—each node chooses its own policy.

交易必须支付的最低交易费(如果不是高优先级交易) ，以便整个节点将该交易中继到其他节点。没有最低的中继费用，每个节点选择自己的策略。

**Not to be confused with:** Transaction fee (the minimum relay fee is a policy setting that filters out transactions with too-low transaction fees)

不要与交易费混淆: 交易费(最低中继费是一个过滤掉交易费用过低的政策设置)

Mining 采矿业

Miner 矿工

Mining is the act of creating valid Bitcoin blocks, which requires demonstrating proof of work, and miners are devices that mine or people who own those devices.

挖掘是创建有效的比特币块的行为，这需要证明工作，而挖矿者是采矿设备或拥有这些设备的人。

Multisig

Bare multisig 裸多重信号

A pubkey script that provides *n* number of pubkeys and requires the corresponding signature script provide *m*minimum number signatures corresponding to the provided pubkeys.

一个提供 n 个 pubkey 并需要相应签名脚本的 pubkey 脚本提供 m 个最小数字签名，这些签名对应于所提供的 pubkeys。

**Not to be confused with:** P2SH multisig (a multisig script contained inside P2SH), Advanced scripts that require multiple signatures without using OP_CHECKMULTISIG or OP_CHECKMULTISIGVERIFY

不要与 P2SH multisig 混淆: P2SH multisig (包含在 P2SH 中的一个 multisig 脚本) ，需要多个签名但不使用 OP _ checkmultisig 或 OP _ checkmultisigverify 的高级脚本

nBits 国家信息技术局

Target 目标

The target is the threshold below which a block header hash must be in order for the block to be valid, and nBits is the encoded form of the target threshold as it appears in the block header.

目标是块头哈希必须低于的阈值，以使块有效，nBits 是目标阈值的编码形式，因为它出现在块头中。

**Not to be confused with:** Difficulty (a number measuring the difficulty of finding a header hash relative to the difficulty of finding a header hash with the easiest target)

不要和困难混淆: 困难(这个数字衡量的是找到头部哈希的困难程度，而不是找到最容易的目标头部哈希的困难程度)

Node 节点

Full node 完整节点

Archival node 档案节点

Pruned node 修剪节点

Peer 朋友

A computer that connects to the Bitcoin network.

连接到比特币网络的计算机。

**Not to be confused with:** Lightweight node, SPV node

不要与: 轻量级节点，SPV 节点混淆

Null data transaction 空数据处理

OP_RETURN transaction 返回事务

Data carrier transaction 数据载体事务

A transaction type relayed and mined by default in Bitcoin Core 0.9.0 and later that adds arbitrary data to a provably unspendable pubkey script that full nodes don’t have to store in their UTXO database.

在比特币核心0.9.0及以后的版本中，默认中继和挖掘的交易类型将任意数据添加到可证明无法使用的公共密钥脚本中，完整的节点不必存储在它们的 UTXO 数据库中。

**Not to be confused with:** OP_RETURN (an opcode used in one of the outputs in an OP_RETURN transaction)

不要与 op_return 混淆(op_return 事务中的一个输出中使用的操作码)

Opcode

Data-pushing opcode 数据推送操作码

Non-data-pushing opcode 非数据推送操作码

Operation codes from the Bitcoin Script language which push data or perform functions within a pubkey script or signature script.

来自比特币脚本语言的操作代码，用于在 pubkey 脚本或签名脚本中推送数据或执行函数。

Orphan block 孤儿街区

Blocks whose parent block has not been processed by the local node, so they can’t be fully validated yet.

其父块尚未被本地节点处理的块，因此它们还不能完全验证。

**Not to be confused with:** Stale block

不要混淆: 陈旧的块

Outpoint

The data structure used to refer to a particular transaction output, consisting of a 32-byte TXID and a 4-byte output index number (vout).

用于引用特定事务输出的数据结构，包括一个32字节的 TXID 和一个4字节的输出索引号(vout)。

**Not to be confused with:** Output (an entire output from a transaction), TxOut (same as output)

不要与输出混淆: Output (事务的整个输出) ，TxOut (与输出相同)

Output 输出

TxOut

An output in a transaction which contains two fields: a value field for transferring zero or more satoshis and a pubkey script for indicating what conditions must be fulfilled for those satoshis to be further spent.

事务中包含两个字段的输出: 一个用于传输零个或多个 satoshis 的值字段和一个用于指示必须满足哪些条件才能进一步使用这些 satoshis 的 pubkey 脚本。

**Not to be confused with:** Outpoint (a reference to a particular output)

不要与 Outpoint (对特定输出的引用)混淆

P2PKH address P2PKH 地址

P2PKH output P2PKH 输出

A Bitcoin payment address comprising a hashed public key, allowing the spender to create a standard pubkey script that Pays To PubKey Hash (P2PKH).

一个比特币支付地址包含一个散列公钥，允许挥霍者创建一个标准的公钥脚本，支付给公钥散列(P2PKH)。

**Not to be confused with:** P2PK output (an output paying a public key directly), P2SH address, P2SH output (an address comprising a hashed script, and its corresponding output)

不要与以下输出混淆: P2PK 输出(直接支付公钥的输出)、 P2SH 地址、 P2SH 输出(包含散列脚本的地址及其相应的输出)

P2SH address P2SH 地址

P2SH output P2SH 输出

A Bitcoin payment address comprising a hashed script, allowing the spender to create a standard pubkey script that Pays To Script Hash (P2SH). The script can be almost any valid pubkey script.

一个比特币支付地址包含一个散列脚本，允许挥霍者创建一个标准的公钥脚本，支付到脚本散列(P2SH)。该脚本几乎可以是任何有效的 pubkey 脚本。

**Not to be confused with:** P2PK output (an output paying a public key directly), P2PKH address, P2PKH output (an address comprising a hashed pubkey, and its corresponding output), P2SH multisig (a particular instance of P2SH where the script uses a multisig opcode)

不要与: P2PK 输出(直接支付公钥的输出)、 P2PKH 地址、 P2PKH 输出(包含散列 pubkey 的地址及其相应的输出)、 P2SH multisig (P2SH 的一个特殊实例，其中脚本使用 multisig 操作码)混淆

P2SH multisig 2sh multisig

A P2SH output where the redeem script uses one of the multisig opcodes. Up until Bitcoin Core 0.10.0, P2SH multisig scripts were standard transactions, but most other P2SH scripts were not.

一个 P2SH 输出，其中 redeem 脚本使用一个 multisig 操作码。直到比特币核心0.10.0之前，P2SH multisig 脚本都是标准的事务，但是大多数其他 P2SH 脚本都不是。

**Not to be confused with:** Multisig pubkey scripts (also called “bare multisig”, these multisig scripts don’t use P2SH encapsulation), P2SH (general P2SH, of which P2SH multisig is a specific instance that was special cased up until Bitcoin Core 0.10.0)

不要混淆: Multisig pubkey 脚本(也称为“ bare Multisig” ，这些 Multisig 脚本不使用 P2SH 封装) ，P2SH (通用 P2SH，其中 P2SH Multisig 是一个特殊的实例，直到比特币 Core 0.10.0)

Parent key 父键

Parent public key 父公开密码匙

Parent private key 父私钥

In HD wallets, a key used to derive child keys. The key can be either a private key or a public key, and the key derivation may also require a chain code.

在高清钱包中，一种用于获取子密钥的密钥。密钥可以是私钥或公钥，密钥派生还可能需要链代码。

**Not to be confused with:** Public key (derived from a private key, not a parent key)

不要与公钥混淆: 公钥(源自私钥，而非父钥)

Payment protocol 付款程序

Payment request 付款要求

The deprecated protocol defined in BIP70 (and other BIPs) which lets spenders get signed payment details from receivers.

在 BIP70(和其他 bibs)中定义的弃用协议，允许消费者从接收者那里获得签名的支付细节。

**Not to be confused with:** IP-to-IP payment protocol (an insecure, discontinued protocol included in early versions of Bitcoin)

不要与: ip 到 ip 支付协议混淆(早期版本的比特币中包含的一种不安全、中断的协议)

Private key 私人密码匙

The private portion of a keypair which can create signatures that other people can verify using the public key.

密钥对的私有部分，它可以创建其他人可以使用公钥验证的签名。

**Not to be confused with:** Public key (data derived from the private key), Parent key (a key used to create child keys, not necessarily a private key)

不要与以下密钥混淆: 公钥(从私钥派生的数据)、父密钥(用于创建子密钥的密钥，不一定是私钥)

Proof of work 工作证明

POW 战俘

A hash below a target value which can only be obtained, on average, by performing a certain amount of brute force work—therefore demonstrating proof of work.

一个低于目标值的散列值，平均只能通过执行一定数量的蛮力工作才能获得，因此证明了这种工作。

Pubkey script Pubkey 脚本

ScriptPubKey 1. ScriptPubKey

A script included in outputs which sets the conditions that must be fulfilled for those satoshis to be spent. Data for fulfilling the conditions can be provided in a signature script. Pubkey Scripts are called a scriptPubKey in code.

一种包含在输出中的脚本，它设定了那些 satoshis 必须满足的条件。可以在签名脚本中提供用于满足条件的数据。在代码中，Pubkey 脚本被称为 scriptPubKey。

**Not to be confused with:** Pubkey (a public key, which can be used as part of a pubkey script but don’t provide a programmable authentication mechanism), Signature script (a script that provides data to the pubkey script)

不要与下列脚本混淆: Pubkey (一个公钥，可以作为 Pubkey 脚本的一部分使用，但不提供可编程的身份验证机制) ，Signature script (一个为 Pubkey 脚本提供数据的脚本)

Public key 公开密匙

The public portion of a keypair which can be used to verify signatures made with the private portion of the keypair.

密钥对的公共部分，可用于验证用密钥对的私有部分制作的签名。

**Not to be confused with:** Private key (data from which the public key is derived), Parent key (a key used to create child keys, not necessarily a public key)

不要与以下密钥混淆: 私钥(派生公钥的数据)、父密钥(用于创建子密钥的密钥，不一定是公钥)

Replace by fee 以费用代替

RBF 天生臭脸综合征

Opt-in replace by fee 以收费取代选用服务

Replacing one version of an unconfirmed transaction with a different version of the transaction that pays a higher transaction fee. May use BIP125 signaling.

用支付较高交易费的交易的不同版本替换未确认交易的一个版本。可以使用 BIP125信令。

**Not to be confused with:** Child pays for parent, CPFP

不要混淆: 孩子为父母买单，CPFP

Redeem script 赎回剧本

RedeemScript

A script similar in function to a pubkey script. One copy of it is hashed to create a P2SH address (used in an actual pubkey script) and another copy is placed in the spending signature script to enforce its conditions.

在函数上类似于 pubkey 脚本的脚本。它的一个副本被散列以创建一个 P2SH 地址(在实际的 pubkey 脚本中使用) ，另一个副本被放置在开销签名脚本中以强制其条件。

**Not to be confused with:** Signature script (a script that provides data to the pubkey script, which includes the redeem script in a P2SH input)

不要与: Signature script 混淆(为 pubkey 脚本提供数据的脚本，其中包括 P2SH 输入中的可赎回脚本)

Regtest

Regression test mode 回归测试模式

A local testing environment in which developers can almost instantly generate blocks on demand for testing events, and can create private satoshis with no real-world value.

在本地测试环境中，开发人员几乎可以根据测试事件的需求即时生成块，并且可以创建没有真实价值的私有 satoshis。

**Not to be confused with:** Testnet (a global testing environment which mostly mimics mainnet)

不要与 Testnet 混淆(一个主要模仿 mainnet 的全局测试环境)

RPC byte order RPC 字节顺序

A hash digest displayed with the byte order reversed; used in Bitcoin Core RPCs, many block explorers, and other software.

显示字节顺序颠倒的散列摘要; 用于比特币核心 rpc、许多块探索者和其他软件。

**Not to be confused with:** Internal byte order (hash digests displayed in their typical order; used in serialized blocks and serialized transactions)

不要与内部字节顺序混淆: 内部字节顺序(以其典型顺序显示的哈希摘要; 用于序列化块和序列化事务)

Sequence number 序列号

Part of all transactions. A number intended to allow unconfirmed time-locked transactions to be updated before being finalized; not currently used except to disable locktime in a transaction

所有交易的一部分。一个数字，旨在允许未经确认的时间锁定的事务在最后完成之前进行更新; 目前除了在事务中禁用锁定时间之外不使用

**Not to be confused with:** Output index number / vout (this is the 0-indexed number of an output within a transaction used by a later transaction to refer to that specific output)

不要与输出索引号/vout 混淆(这是后面的事务使用的事务中输出的0索引号，用于引用特定的输出)

Serialized block 序列化块

A complete block in its binary format—the same format used to calculate total block byte size; often represented using hexadecimal.

二进制格式的完整块ー与计算总块字节大小的格式相同; 通常用十六进制表示。

Serialized transaction 连续事务

Raw transaction 原始交易

Complete transactions in their binary format; often represented using hexadecimal. Sometimes called raw format because of the various Bitcoin Core commands with “raw” in their names.

以二进制格式完成事务; 通常使用十六进制表示。有时被称为原始格式，因为各种名字中带有“原始”的比特币核心命令。

SIGHASH_ALL 4. SIGHASH all

Default signature hash type which signs the entire transaction except any signature scripts, preventing modification of the signed parts.

默认的签名散列类型，除了任何签名脚本外，对整个事务进行签名，防止修改已签名的部分。

SIGHASH_ANYONECANPAY 2. SIGHASH anyonecanpay

A signature hash type which signs only the current input.

只对当前输入进行签名的签名散列类型。

**Not to be confused with:** SIGHASH_SINGLE (which signs this input, its corresponding output, and other inputs partially)

不要与: SIGHASH _ single 混淆(它为此输入、其对应的输出和其他部分输入签名)

SIGHASH_NONE 4. SIGHASH none

Signature hash type which only signs the inputs, allowing anyone to change the outputs however they’d like.

只对输入签名的签名散列类型，允许任何人随心所欲地改变输出。

SIGHASH_SINGLE 单身汉

Signature hash type that signs the output corresponding to this input (the one with the same index value), this input, and any other inputs partially. Allows modification of other outputs and the sequence number of other inputs.

签名散列类型，对与此输入(具有相同索引值的输出)、此输入和任何其他输入部分对应的输出进行签名。允许修改其他输出和其他输入的序列号。

**Not to be confused with:** SIGHASH_ANYONECANPAY (a flag to signature hash types that only signs this single input)

不要与 SIGHASH _ anyonecanpay 混淆(一个标志到签名散列类型，只签署这个单一输入)

Signature 签名

A value related to a public key which could only have reasonably been created by someone who has the private key that created that public key. Used in Bitcoin to authorize spending satoshis previously sent to a public key.

与公钥相关的值，该值只能由拥有创建该公钥的私钥的人合理创建。在比特币中用于授权支出 satoshis 以前发送到一个公钥。

Signature hash 签名散列

Sighash

A flag to Bitcoin signatures that indicates what parts of the transaction the signature signs. (The default is SIGHASH_ALL.) The unsigned parts of the transaction may be modified.

比特币签名的一个标志，表示交易的哪些部分需要签名。(默认值是 SIGHASH _ all.)可以修改事务的未签名部分。

**Not to be confused with:** Signed hash (a hash of the data to be signed), Transaction malleability / transaction mutability (although non-default sighash flags do allow optional malleability, malleability comprises any way a transaction may be mutated)

不要与以下内容混淆: 有符号的散列(需要签名的数据的散列)、事务可延展性/事务可变性(虽然非默认的标志允许可选的可延展性，但可延展性包括事务可能发生变异的任何方式)

Signature script 签名脚本

ScriptSig

Data generated by a spender which is almost always used as variables to satisfy a pubkey script. Signature Scripts are called scriptSig in code.

由一个挥金如土的人生成的数据，几乎总是用作变量来满足 pubkey 脚本。签名脚本在代码中称为 scriptSig。

**Not to be confused with:** ECDSA signature (a signature, which can be used as part of a pubkey script in addition to other data)

不要与 ECDSA 签名混淆(签名，除了其他数据之外，还可以作为 pubkey 脚本的一部分使用)

SPV 特殊目的载体

Simplified Payment Verification 简化付款核实程序

Lightweight client 轻量级客户机

Thin client 瘦客户机

A method for verifying if particular transactions are included in a block without downloading the entire block. The method is used by some lightweight Bitcoin clients.

一种在不下载整个块的情况下验证特定事务是否包含在块中的方法。这种方法被一些轻量级的比特币客户使用。

Soft fork 软叉子

A softfork is a change to the bitcoin protocol wherein only previously valid blocks/transactions are made invalid. Since old nodes will recognise the new blocks as valid, a softfork is backward-compatible.

Softfork 是对比特币协议的更改，其中只有以前有效的块/交易被取消。由于旧节点将识别新块为有效的，因此软分叉是向后兼容的。

**Not to be confused with:** Fork (a regular fork where all nodes follow the same consensus rules, so the fork is resolved once one chain has more proof of work than another), Hard fork (a permanent divergence in the block chain caused by non-upgraded nodes not following new consensus rules), Software fork (when one or more developers permanently develops a codebase separately from other developers), Git fork (when one or more developers temporarily develops a codebase separately from other developers

不要和下面这些混淆: Fork (一个常规的 Fork，其中所有节点遵循相同的一致性规则，因此当一个链比另一个链拥有更多的工作证明时，Fork 就被解析了)、 Hard Fork (由于没有升级的节点没有遵循新的一致性规则而导致的块链中的永久性分歧)、 Software Fork (当一个或多个开发人员永久性地独立开发一个代码库时)、 Git Fork (当一个或多个开发人员暂时独立开发一个代码库时)

Stale block 陈旧的积木

Blocks which were successfully mined but which aren’t included on the current best block chain, likely because some other block at the same height had its chain extended first.

那些已经成功开采但没有包含在当前最好的块链中的块，很可能是因为在同一高度的其他块首先扩展了它的链。

**Not to be confused with:** Orphan block (a block whose previous (parent) hash field points to an unknown block, meaning the orphan can’t be validated)

不要与孤立块混淆: 孤立块(一个其上一个(父)散列字段指向未知块的块，这意味着孤立块不能被验证)

Standard Transaction 标准交易

A transaction that passes Bitcoin Core’s IsStandard() and IsStandardTx() tests. Only standard transactions are mined or broadcast by peers running the default Bitcoin Core software.

通过比特币核心 IsStandard ()和 IsStandardTx ()测试的交易。只有标准的交易才会被运行默认比特币核心软件的同行挖掘或广播。

Start string 开始字符串

Network magic 网络魔术

Four defined bytes which start every message in the Bitcoin P2P protocol to allow seeking to the next message.

四个已定义的字节启动比特币 P2P 协议中的每条消息，以便寻找下一条消息。

Testnet

A global testing environment in which developers can obtain and spend satoshis that have no real-world value on a network that is very similar to the Bitcoin mainnet.

一个全球性的测试环境，在这个环境中，开发者可以获取和使用一个与比特币主网非常类似的网络上没有真实价值的 satoshis。

**Not to be confused with:** Regtest (a local testing environment where developers can control block generation)

不要与 Regtest 混淆(开发人员可以控制块生成的本地测试环境)

Token 令牌

A token is a programmable digital asset with its own codebase that resides on an already existing block chain. Tokens are used to help facilitate the creation of decentralized applications.

令牌是一个可编程的数字资产，它有自己的代码库，驻留在一个已经存在的区块链上。令牌用于帮助简化分散应用程序的创建。

**Not to be confused with:** Bitcoins, Satoshis, Security token, Denominations

不要混淆: 比特币，Satoshis，安全令牌，面值

Transaction fee 交易费用

Miners fee 矿工费

The amount remaining when the value of all outputs in a transaction are subtracted from all inputs in a transaction; the fee is paid to the miner who includes that transaction in a block.

从交易中的所有投入中减去交易中的所有产出的价值后剩余的金额; 费用支付给将该交易包括在一个块中的矿工。

**Not to be confused with:** Minimum relay fee (the lowest fee a transaction must pay to be accepted into the memory pool and relayed by Bitcoin Core nodes)

不要混淆: 最低中继费(交易必须支付的最低费用才能被接受进入内存池并由比特币核心节点中继)

Txid

An identifier used to uniquely identify a particular transaction; specifically, the sha256d hash of the transaction.

用于唯一标识特定事务的标识符; 具体地说，是事务的 sha256d 散列。

**Not to be confused with:** Outpoint (the combination of a txid with a vout used to identify a specific output)

不要与 Outpoint (用于标识特定输出的 txid 和 vout 的组合)混淆

User-activated soft fork 用户激活的软叉

UASF

A Soft Fork activated by flag day or node enforcement instead of miner signalling.

通过旗日或节点强制激活的 Soft Fork，而不是 miner 信号。

**Not to be confused with:** Miner Activated Soft Fork (a soft fork activated through miner signalling), Fork (a regular fork where all nodes follow the same consensus rules, so the fork is resolved once one chain has more proof of work than another), Hard fork (a permanent divergence in the block chain caused by non-upgraded nodes not following new consensus rules), Soft fork (a temporary divergence in the block chain caused by non-upgraded nodes not following new consensus rules), Software fork (when one or more developers permanently develops a codebase separately from other developers), Git fork (when one or more developers temporarily develops a codebase separately from other developers

不要混淆: Miner Activated Soft Fork (通过 Miner 信令激活的软分叉)、 Fork (所有节点遵循相同的一致性规则的常规分叉，因此一旦一个链比另一个链有更多的工作证明，分叉就解析了)、 Hard Fork (未升级的节点没有遵循新的一致性规则而导致的块链中的永久性分歧)、 Soft Fork (由于没有升级的节点没有遵循新的一致性规则而导致的块链中的暂时分歧)、 Software Fork (当一个或多个开发人员与其他开发人员永久性地分开开发代码库)、 Git Fork (当一个或多个开发人员暂时分开开发代码库)

UTXO

An Unspent Transaction Output (UTXO) that can be spent as an input in a new transaction.

未使用的事务输出(UTXO) ，可用作新事务中的输入。

**Not to be confused with:** Output (any output, whether spent or not. Outputs are a superset of UTXOs)

不要与输出混淆: Output (任何输出，不管花费与否。输出是 UTXOs 的超集)

Wallet 钱包

Software that stores private keys and monitors the block chain (sometimes as a client of a server that does the processing) to allow users to spend and receive satoshis.

存储私钥并监视块链的软件(有时作为进行处理的服务器的客户端)允许用户使用和接收 satoshis。

**Not to be confused with:** HD wallet (a protocol that allows all of a wallet’s keys to be created from a single seed)

不要混淆: HD 钱包(一个协议，允许钱包的所有钥匙从一个种子创建)

WIF 威富基金

Wallet Import Format 钱包导入格式

A data interchange format designed to allow exporting and importing a single private key with a flag indicating whether or not it uses a compressed public key.

一种数据交换格式，旨在允许导出和导入一个带有标志的私钥，指示其是否使用压缩的公钥。

**Not to be confused with:** Extended private keys (which allow importing a hierarchy of private keys)

不要与扩展私钥混淆: 扩展私钥(允许导入私钥层次结构)

Watch-only address 仅供观看的地址

An address or pubkey script stored in the wallet without the corresponding private key, allowing the wallet to watch for outputs but not spend them.

一种存储在钱包中的地址或公钥脚本，没有相应的私钥，允许钱包观察输出但不使用输出。