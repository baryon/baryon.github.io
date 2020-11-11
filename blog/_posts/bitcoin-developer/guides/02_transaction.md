---
title: 指南 - Transactions 交易
summary: 交易允许用户使用 satoshis。每笔交易都由若干部分组成，既可以进行简单的直接支付，也可以进行复杂的交易。
date: 2020-11-01 02:00
tags:

- 比特币
- 翻译
- 比特币开发指南

---

::: info

翻译自[Transactions](https://developer.bitcoin.org/devguide/transactions.html#transactions)
内容在整理，准确性请自己确认

:::

# Transactions 交易[](https://developer.bitcoin.org/devguide/transactions.html#transactions "Permalink to this headline")

Transactions let users spend satoshis. Each transaction is constructed out of several parts which enable both simple direct payments and complex transactions.

事务允许用户使用 satoshis。每笔交易都由若干部分组成，既可以进行简单的直接支付，也可以进行复杂的交易。

## Introduction 引言[](https://developer.bitcoin.org/devguide/transactions.html#introduction "Permalink to this headline")

This section will describe each part and demonstrate how to use them together to build complete transactions.

本节将描述每个部分，并演示如何一起使用它们来构建完整的事务。

To keep things simple, this section pretends coinbase transactions do not exist. Coinbase transactions can only be created by Bitcoin miners and they’re an exception to many of the rules listed below. Instead of pointing out the coinbase exception to each rule, we invite you to read about coinbase transactions in the block chain section of this guide.

为了简单起见，本节假装 coinbase 事务不存在。Coinbase 交易只能由比特币矿工创建，它们是下面列出的许多规则的例外。与其指出每个规则的 coinbase 异常，我们邀请您阅读本指南区块链部分的 coinbase 事务。

![The Parts Of A Transaction](https://developer.bitcoin.org/_images/en-tx-overview.svg)

The Parts Of A Transaction[](https://developer.bitcoin.org/devguide/transactions.html#id1 "Permalink to this image")

交易的部分

The figure above shows the main parts of a Bitcoin transaction. Each transaction has at least one input and one output. Each [input](https://developer.bitcoin.org/glossary.html#term-Input) spends the satoshis paid to a previous output. Each [output](https://developer.bitcoin.org/glossary.html#term-Output) then waits as an Unspent Transaction Output (UTXO) until a later input spends it. When your Bitcoin wallet tells you that you have a 10,000 satoshi balance, it really means that you have 10,000 satoshis waiting in one or more UTXOs.

上图显示了比特币交易的主要部分。每个事务至少有一个输入和一个输出。每个输入花费 satoshis 支付到以前的输出。然后，每个输出作为未使用的事务输出(UTXO)等待，直到稍后的输入使用它。当你的比特币钱包告诉你你有10,000个 satoshi 余额时，这实际上意味着你有10,000个 satoshis 在一个或多个 UTXOs 中等待。

Each transaction is prefixed by a four-byte [transaction version number](https://developer.bitcoin.org/terms.html#term-transaction-version-number) which tells Bitcoin peers and miners which set of rules to use to validate it. This lets developers create new rules for future transactions without invalidating previous transactions.

每个交易都有一个四字节的交易版本号作为前缀，这个版本号告诉比特币同行和挖矿者使用哪组规则来验证它。这使得开发人员可以为未来的事务创建新的规则，而不会使以前的事务无效。

![Spending An Output](https://developer.bitcoin.org/_images/en-tx-overview-spending.svg)

Spending An Output[](https://developer.bitcoin.org/devguide/transactions.html#id2 "Permalink to this image")

支出产出

An output has an implied index number based on its location in the transaction—the index of the first output is zero. The output also has an amount in satoshis which it pays to a conditional pubkey script. Anyone who can satisfy the conditions of that pubkey script can spend up to the amount of satoshis paid to it.

输出具有基于其在事务中的位置的隐含索引号ー第一个输出的索引为零。输出还有一个 satoshis 数量，它支付给一个条件 pubkey 脚本。任何人只要能满足这个公共剧本的条件，就可以花费 satoshis 支付给它的数额。

An input uses a transaction identifier (txid) and an [output index](https://developer.bitcoin.org/terms.html#term-output-index) number (often called “vout” for output vector) to identify a particular output to be spent. It also has a signature script which allows it to provide data parameters that satisfy the conditionals in the pubkey script. (The sequence number and locktime are related and will be covered together in a later subsection.)

输入使用事务标识符(txid)和输出索引号(输出向量通常称为“ vout”)来标识要使用的特定输出。它还有一个签名脚本，允许它提供满足 pubkey 脚本条件的数据参数。(序列号和锁定时间是相关的，将在以后的小节中一起讨论。)

The figures below help illustrate how these features are used by showing the workflow Alice uses to send Bob a transaction and which Bob later uses to spend that transaction. Both Alice and Bob will use the most common form of the standard Pay-To-Public-Key-Hash (P2PKH) transaction type. [P2PKH](https://developer.bitcoin.org/glossary.html#term-P2PKH-address) lets Alice spend satoshis to a typical Bitcoin address, and then lets Bob further spend those satoshis using a simple cryptographic [key pair](https://developer.bitcoin.org/terms.html#term-key-pair).

下面的图表通过显示 Alice 用于向 Bob 发送事务的工作流以及 Bob 稍后用于支出该事务的工作流，帮助说明如何使用这些特性。Alice 和 Bob 都将使用标准的 Pay-To-Public-Key-Hash (P2PKH)事务类型的最常见形式。2pkh 让 Alice 把 satoshis 花到一个典型的比特币地址，然后让 Bob 用一个简单的单密钥对继续花掉这些 satoshis。

![Creating A P2PKH Public Key Hash To Receive Payment](https://developer.bitcoin.org/_images/en-creating-p2pkh-output.svg)

Creating A P2PKH Public Key Hash To Receive Payment[](https://developer.bitcoin.org/devguide/transactions.html#id3 "Permalink to this image")

创建 P2PKH 公钥散列以接收付款

Bob must first generate a private/public [key pair](https://developer.bitcoin.org/terms.html#term-key-pair) before Alice can create the first transaction. Bitcoin uses the Elliptic Curve Digital Signature Algorithm ([ECDSA](https://en.wikipedia.org/wiki/Elliptic_Curve_DSA)) with the [secp256k1](http://www.secg.org/sec2-v2.pdf) curve; [secp256k1](http://www.secg.org/sec2-v2.pdf) [private keys](https://developer.bitcoin.org/glossary.html#term-Private-key) are 256 bits of random data. A copy of that data is deterministically transformed into an [secp256k1](http://www.secg.org/sec2-v2.pdf) [public key](https://developer.bitcoin.org/glossary.html#term-Public-key). Because the transformation can be reliably repeated later, the public key does not need to be stored.

在 Alice 创建第一个事务之前，Bob 必须首先生成一个私有/公共密钥对。比特币使用 secp256k1曲线的 ECDSA 椭圆曲线数字签名算法; secp256k1私钥是256位的随机数据。该数据的副本确定地转换为 secp256k1公钥。因为稍后可以可靠地重复转换，所以不需要存储公钥。

The public key (pubkey) is then cryptographically hashed. This pubkey hash can also be reliably repeated later, so it also does not need to be stored. The hash shortens and obfuscates the public key, making manual transcription easier and providing security against unanticipated problems which might allow reconstruction of private keys from public key data at some later point.

然后对公钥(pubkey)进行加密哈希运算。这个 pubkey 散列在以后也可以可靠地重复，所以它也不需要存储。散列会缩短和模糊公钥，使手工转录更加容易，并且提供了安全性，以防止可能在以后某个时间点从公钥数据重构私钥的意外问题。

Bob provides the pubkey hash to Alice. Pubkey hashes are almost always sent encoded as Bitcoin [addresses](https://developer.bitcoin.org/glossary.html#term-Address), which are base58-encoded strings containing an address version number, the hash, and an error-detection checksum to catch typos. The address can be transmitted through any medium, including one-way mediums which prevent the spender from communicating with the receiver, and it can be further encoded into another format, such as a QR code containing a [“bitcoin:” URI](https://developer.bitcoin.org/terms.html#term-bitcoin-uri).

Bob 向 Alice 提供 pubkey 散列。Pubkey 散列几乎总是以比特币地址的编码方式发送，比特币地址是基于 base58编码的字符串，其中包含地址版本号、散列和一个错误检测校验和，用于捕获输入错误。地址可以通过任何媒介传输，包括阻止挥霍者与接收者通信的单向媒介，还可以进一步编码成另一种格式，比如包含“ bitcoin: ” URI 的二维码。

Once Alice has the address and decodes it back into a standard hash, she can create the first transaction. She creates a standard P2PKH transaction output containing instructions which allow anyone to spend that output if they can prove they control the private key corresponding to Bob’s hashed public key. These instructions are called the [pubkey script](https://developer.bitcoin.org/glossary.html#term-Pubkey-script) or scriptPubKey.

一旦 Alice 获得了地址并将其解码回标准散列，她就可以创建第一个事务。她创建了一个标准的 P2PKH 事务输出，其中包含了一些指令，这些指令允许任何人使用这些输出，只要他们能够证明自己控制了与 Bob 散列公钥对应的私钥。这些指令称为 pubkey 脚本或 scriptPubKey。

Alice broadcasts the transaction and it is added to the block chain. The [network](https://developer.bitcoin.org/devguide/p2p_network.html) categorizes it as an Unspent Transaction Output (UTXO), and Bob’s wallet software displays it as a spendable balance.

Alice 广播事务并将其添加到块链中。网络将其归类为未用事务输出(UTXO) ，Bob 的钱包软件将其显示为可消费余额。

When, some time later, Bob decides to spend the UTXO, he must create an input which references the transaction Alice created by its hash, called a Transaction Identifier (txid), and the specific output she used by its index number ([output index](https://developer.bitcoin.org/terms.html#term-output-index)). He must then create a [signature script](https://developer.bitcoin.org/glossary.html#term-Signature-script)—a collection of data parameters which satisfy the conditions Alice placed in the previous output’s pubkey script. Signature scripts are also called scriptSigs.

一段时间后，当 Bob 决定使用 UTXO 时，他必须创建一个输入，该输入引用由其 hash 创建的事务 Alice (称为 Transaction Identifier (txid)) ，以及由其索引号(输出索引)使用的特定输出。然后，他必须创建一个签名脚本ーー一组数据参数，满足 Alice 在前一个输出的 pubkey 脚本中设置的条件。签名脚本也称为 scriptSigs。

Pubkey scripts and signature scripts combine [secp256k1](http://www.secg.org/sec2-v2.pdf) pubkeys and signatures with conditional logic, creating a programmable authorization mechanism.

Pubkey 脚本和签名脚本将 secp256k1 pubkeys 和签名与条件逻辑结合起来，创建了一个可编程的授权机制。

![Unlocking A P2PKH Output For Spending](https://developer.bitcoin.org/_images/en-unlocking-p2pkh-output.svg)

Unlocking A P2PKH Output For Spending[](https://developer.bitcoin.org/devguide/transactions.html#id4 "Permalink to this image")

解锁一个 P2PKH 输出用于支出

For a P2PKH-style output, Bob’s signature script will contain the following two pieces of data:

对于 p2pkh- 风格的输出，Bob 的签名脚本将包含以下两部分数据:

1. His full (unhashed) public key, so the pubkey script can check that it hashes to the same value as the pubkey hash provided by Alice.
   
   他的完整(反向)公钥，因此 pubkey 脚本可以检查它是否散列到与 Alice 提供的 pubkey 散列相同的值。

2. An [secp256k1](http://www.secg.org/sec2-v2.pdf) [signature](https://developer.bitcoin.org/glossary.html#term-Signature) made by using the [ECDSA](https://en.wikipedia.org/wiki/Elliptic_Curve_DSA) cryptographic formula to combine certain transaction data (described below) with Bob’s private key. This lets the pubkey script verify that Bob owns the private key which created the public key.
   
   通过使用 ECDSA 加密公式将某些事务数据(如下所述)与 Bob 的私钥结合而生成的 secp256k1签名。这使得 pubkey 脚本可以验证 Bob 是否拥有创建公钥的私钥。

Bob’s [secp256k1](http://www.secg.org/sec2-v2.pdf) signature doesn’t just prove Bob controls his private key; it also makes the non-signature-script parts of his transaction tamper-proof so Bob can safely broadcast them over the [peer-to-peer network](https://developer.bitcoin.org/devguide/p2p_network.html).

Bob 的 secp256k1签名不仅证明 Bob 控制了他的私钥，而且还使他的事务的非签名脚本部分成为防篡改的，这样 Bob 就可以通过 p2p 网络安全地广播它们。

![Some Things Signed When Spending An Output](https://developer.bitcoin.org/_images/en-signing-output-to-spend.svg)

Some Things Signed When Spending An Output[](https://developer.bitcoin.org/devguide/transactions.html#id5 "Permalink to this image")

支出产出时签署的一些东西

As illustrated in the figure above, the data Bob signs includes the txid and [output index](https://developer.bitcoin.org/terms.html#term-output-index) of the previous transaction, the previous output’s pubkey script, the pubkey script Bob creates which will let the next recipient spend this transaction’s output, and the amount of satoshis to spend to the next recipient. In essence, the entire transaction is signed except for any signature scripts, which hold the full public keys and [secp256k1](http://www.secg.org/sec2-v2.pdf) signatures.

如上图所示，Bob 签名的数据包括前一个事务的 txid 和输出索引、前一个输出的 pubkey 脚本、 Bob 创建的允许下一个接收者使用该事务输出的 pubkey 脚本，以及用于下一个接收者的 satoshis 数量。实际上，除了包含完整公钥和 secp256k1签名的签名脚本之外，整个事务都是签名的。

After putting his signature and public key in the signature script, Bob broadcasts the transaction to Bitcoin miners through the [peer-to-peer network](https://developer.bitcoin.org/devguide/p2p_network.html). Each peer and miner independently validates the transaction before broadcasting it further or attempting to include it in a new block of transactions.

在签名脚本中放入自己的签名和公钥之后，Bob 通过对等网络向比特币矿工广播交易。在进一步广播事务或试图将其包含到新的事务块中之前，每个对等方和 miner 都独立地验证事务。

## P2PKH Script Validation 2pkh 脚本验证[](https://developer.bitcoin.org/devguide/transactions.html#p2pkh-script-validation "Permalink to this headline")

The validation procedure requires evaluation of the signature script and pubkey script. In a P2PKH output, the pubkey script is:

验证过程需要对签名脚本和 pubkey 脚本进行评估。在 P2PKH 输出中，pubkey 脚本是:

OP_DUP OP_HASH160 <PubkeyHash> OP_EQUALVERIFY OP_CHECKSIG

The spender’s signature script is evaluated and prefixed to the beginning of the script. In a P2PKH transaction, the signature script contains an [secp256k1](http://www.secg.org/sec2-v2.pdf) signature (sig) and full public key (pubkey), creating the following concatenation:

花钱的人的签名脚本是评估和前缀的脚本的开始。在 P2PKH 事务中，签名脚本包含 secp256k1签名(sig)和完整公钥(pubkey) ，创建以下连接:

<Sig> <PubKey> OP_DUP OP_HASH160 <PubkeyHash> OP_EQUALVERIFY OP_CHECKSIG

The script language is a [Forth-like](https://en.wikipedia.org/wiki/Forth_%28programming_language%29) stack-based language deliberately designed to be stateless and not Turing complete. Statelessness ensures that once a transaction is added to the block chain, there is no condition which renders it permanently unspendable. Turing-incompleteness (specifically, a lack of loops or gotos) makes the script language less flexible and more predictable, greatly simplifying the security model.

脚本语言是一种类似于 forth 的基于堆栈的语言，故意设计成无状态的，而不是图灵完成的。无状态状态确保了一旦将事务添加到块链中，就不存在使其永久不可消费的条件。图灵不完整(具体地说，缺少循环或 gotos)使脚本语言更不灵活，更可预测，大大简化了安全模型。

To test whether the transaction is valid, signature script and pubkey script operations are executed one item at a time, starting with Bob’s signature script and continuing to the end of Alice’s pubkey script. The figure below shows the evaluation of a standard P2PKH pubkey script; below the figure is a description of the process.

为了测试事务是否有效，签名脚本和 pubkey 脚本操作一次执行一个项目，从 Bob 的签名脚本开始，一直到 Alice 的 pubkey 脚本结束。下图显示了对标准 P2PKH pubkey 脚本的评价; 下图是对流程的描述。

![P2PKH Stack Evaluation](https://developer.bitcoin.org/_images/en-p2pkh-stack.svg)

P2PKH Stack Evaluation[](https://developer.bitcoin.org/devguide/transactions.html#id6 "Permalink to this image")

P2PKH 堆栈评估

- The signature (from Bob’s signature script) is added (pushed) to an empty stack. Because it’s just data, nothing is done except adding it to the stack. The public key (also from the signature script) is pushed on top of the signature.
  
  签名(来自 Bob 的签名脚本)被添加(推送)到一个空栈中。因为它只是数据，除了将其添加到堆栈之外，什么也不做。公钥(也来自签名脚本)被推到签名的顶部。

- From Alice’s pubkey script, the [“OP_DUP”](https://developer.bitcoin.org/terms.html#term-op-dup) operation is executed. [“OP_DUP”](https://developer.bitcoin.org/terms.html#term-op-dup) pushes onto the stack a copy of the data currently at the top of it—in this case creating a copy of the public key Bob provided.
  
  在 Alice 的 pubkey 脚本中，执行“ op_dup”操作。“ op_dup”将当前位于堆栈顶部的数据的一个副本(在本例中创建 Bob 提供的公钥的一个副本)压入堆栈。

- The operation executed next, [“OP_HASH160”](https://developer.bitcoin.org/terms.html#term-op-hash160), pushes onto the stack a hash of the data currently on top of it—in this case, Bob’s public key. This creates a hash of Bob’s public key.
  
  接下来执行的操作“ OP _ hash160”将当前位于堆栈顶部的数据的散列(在本例中为 Bob 的公钥)推送到堆栈上。这将创建 Bob 的公钥散列。

- Alice’s pubkey script then pushes the pubkey hash that Bob gave her for the first transaction. At this point, there should be two copies of Bob’s pubkey hash at the top of the stack.
  
  Alice 的 pubkey 脚本然后推入 pubkey 散列，这是 Bob 在第一次事务处理时给她的。此时，在堆栈顶部应该有 Bob 的 pubkey 散列的两个副本。

- Now it gets interesting: Alice’s pubkey script executes [“OP_EQUALVERIFY”](https://developer.bitcoin.org/terms.html#term-op-equalverify). [“OP_EQUALVERIFY”](https://developer.bitcoin.org/terms.html#term-op-equalverify) is equivalent to executing [“OP_EQUAL”](https://developer.bitcoin.org/terms.html#term-op-equal) followed by [“OP_VERIFY”](https://developer.bitcoin.org/terms.html#term-op-verify) (not shown).
  
  现在有趣的是: Alice 的 pubkey 脚本执行“ OP _ equalverify” ，“ OP _ equalverify”等同于执行“ OP _ equal” ，后面是“ OP _ verify”(未显示)。
  
  [“OP_EQUAL”](https://developer.bitcoin.org/terms.html#term-op-equal) (not shown) checks the two values at the top of the stack; in this case, it checks whether the pubkey hash generated from the full public key Bob provided equals the pubkey hash Alice provided when she created transaction #1. [“OP_EQUAL”](https://developer.bitcoin.org/terms.html#term-op-equal) pops (removes from the top of the stack) the two values it compared, and replaces them with the result of that comparison: zero (*false*) or one (*true*).
  
  “ OP _ equal”(未显示)检查堆栈顶部的两个值; 在本例中，它检查 Bob 提供的完整公钥所生成的 pubkey 散列是否等于 Alice 在创建 transaction # 1时提供的 pubkey 散列。“ OP _ equal” pops (从堆栈顶部删除)比较的两个值，并用比较的结果替换它们: 0(false)或1(true)。
  
  [“OP_VERIFY”](https://developer.bitcoin.org/terms.html#term-op-verify) (not shown) checks the value at the top of the stack. If the value is *false* it immediately terminates evaluation and the transaction validation fails. Otherwise it pops the *true* value off the stack.
  
  “ op_verify”(未显示)检查堆栈顶部的值。如果值为 false，则立即终止计算，事务验证失败。否则，它将从堆栈中弹出真实值。

- Finally, Alice’s pubkey script executes [“OP_CHECKSIG”](https://developer.bitcoin.org/terms.html#term-op-checksig), which checks the signature Bob provided against the now-authenticated public key he also provided. If the signature matches the public key and was generated using all of the data required to be signed, [“OP_CHECKSIG”](https://developer.bitcoin.org/terms.html#term-op-checksig) pushes the value *true* onto the top of the stack.
  
  最后，Alice 的 pubkey 脚本执行“ OP _ checksig” ，该脚本检查 Bob 提供的签名是否与他提供的现已认证的公钥相符。如果签名与公钥匹配并使用需要签名的所有数据生成，“ op_checksig”将值 true 推送到堆栈顶部。

If *false* is not at the top of the stack after the pubkey script has been evaluated, the transaction is valid (provided there are no other problems with it).

如果在计算 pubkey 脚本之后，false 不在堆栈顶部，那么事务是有效的(前提是它没有其他问题)。

## P2SH Scripts P2SH 脚本[](https://developer.bitcoin.org/devguide/transactions.html#p2sh-scripts "Permalink to this headline")

Pubkey scripts are created by spenders who have little interest what that script does. Receivers do care about the script conditions and, if they want, they can ask spenders to use a particular pubkey script. Unfortunately, custom pubkey scripts are less convenient than short Bitcoin addresses and there was no standard way to communicate them between programs prior to widespread implementation of the now deprecated [BIP70](https://github.com/bitcoin/bips/blob/master/bip-0070.mediawiki)Payment Protocol discussed later.

Pubkey 脚本是由那些花钱大手大脚的人创建的，他们对这个脚本的作用不感兴趣。接收者确实关心脚本条件，如果他们愿意，他们可以要求消费者使用一个特定的 pubkey 脚本。不幸的是，自定义 pubkey 脚本不如短比特币地址方便，在现在已经被广泛使用的 BIP70支付协议之前，没有标准的方式在程序之间进行通信。

To solve these problems, pay-to-script-hash ([P2SH](https://developer.bitcoin.org/glossary.html#term-P2SH-address)) transactions were created in 2012 to let a spender create a pubkey script containing a hash of a second script, the [redeem script](https://developer.bitcoin.org/glossary.html#term-Redeem-script).

为了解决这些问题，在2012年创建了支付脚本散列(P2SH)事务，让挥霍者创建一个包含第二个脚本散列(即赎回脚本)的公共密钥脚本。

The basic P2SH workflow, illustrated below, looks almost identical to the P2PKH workflow. Bob creates a redeem script with whatever script he wants, hashes the redeem script, and provides the redeem script hash to Alice. Alice creates a P2SH-style output containing Bob’s redeem script hash.

基本的 P2SH 工作流，如下图所示，看起来几乎与 P2PKH 工作流完全相同。Bob 用他想要的任何脚本创建一个赎回脚本，对赎回脚本进行散列，并向 Alice 提供赎回脚本散列。Alice 创建一个 p2sh 风格的输出，其中包含 Bob 的 redeem 脚本散列。

![Creating A P2SH Redeem Script And Hash](https://developer.bitcoin.org/_images/en-creating-p2sh-output.svg)

Creating A P2SH Redeem Script And Hash[](https://developer.bitcoin.org/devguide/transactions.html#id7 "Permalink to this image")

创建 P2SH 赎回脚本和散列

When Bob wants to spend the output, he provides his signature along with the full (serialized) redeem script in the signature script. The [peer-to-peer network](https://developer.bitcoin.org/devguide/p2p_network.html) ensures the full redeem script hashes to the same value as the script hash Alice put in her output; it then processes the redeem script exactly as it would if it were the primary pubkey script, letting Bob spend the output if the redeem script does not return false.

当 Bob 希望使用输出时，他会在签名脚本中提供自己的签名以及完整的(序列化的)赎回脚本。P2p 网络确保完整的赎回脚本散列值与 Alice 在其输出中放入的脚本散列值相同; 然后，它会像处理主 pubkey 脚本那样处理赎回脚本，如果赎回脚本没有返回 false，Bob 就可以使用输出。

![Unlocking A P2SH Output For Spending](https://developer.bitcoin.org/_images/en-unlocking-p2sh-output.svg)

Unlocking A P2SH Output For Spending[](https://developer.bitcoin.org/devguide/transactions.html#id8 "Permalink to this image")

释放 P2SH 支出

The hash of the redeem script has the same properties as a pubkey hash—so it can be transformed into the standard Bitcoin address format with only one small change to differentiate it from a standard address. This makes collecting a P2SH-style address as simple as collecting a P2PKH-style address. The hash also obfuscates any public keys in the redeem script, so P2SH scripts are as secure as P2PKH pubkey hashes.

赎回脚本的散列具有与 pubkey 散列相同的属性，因此只需稍作修改，就可以将其转换为标准的比特币地址格式，以区别于标准地址。这使得收集 p2sh 风格的地址就像收集 p2pkh- 风格的地址一样简单。散列还模糊了赎回脚本中的任何公钥，因此 P2SH 脚本与 P2PKH pubkey 散列一样安全。

## Standard Transactions 标准交易[](https://developer.bitcoin.org/devguide/transactions.html#standard-transactions "Permalink to this headline")

After the discovery of several dangerous bugs in early versions of Bitcoin, a test was added which only accepted transactions from the [network](https://developer.bitcoin.org/devguide/p2p_network.html) if their pubkey scripts and signature scripts matched a small set of believed-to-be-safe templates, and if the rest of the transaction didn’t violate another small set of rules enforcing good [network](https://developer.bitcoin.org/devguide/p2p_network.html) behavior. This is the `IsStandard()` test, and transactions which pass it are called standard transactions.

在发现早期版本的比特币中存在几个危险的漏洞之后，又增加了一个测试，该测试只接受来自网络的交易，前提是它们的 pubkey 脚本和签名脚本与一小组被认为是安全的模板相匹配，以及交易的其余部分没有违反另一小组强制实施良好网络行为的规则。这是 IsStandard ()测试，通过它的事务称为标准事务。

Non-standard transactions—those that fail the test—may be accepted by nodes not using the default Bitcoin Core settings. If they are included in blocks, they will also avoid the IsStandard test and be processed.

非标准交易——即那些未能通过测试的交易——可能会被不使用默认比特币核心设置的节点接受。如果它们包含在块中，它们也将避免进行 IsStandard 测试并被处理。

Besides making it more difficult for someone to attack Bitcoin for free by broadcasting harmful transactions, the standard transaction test also helps prevent users from creating transactions today that would make adding new transaction features in the future more difficult. For example, as described above, each transaction includes a version number—if users started arbitrarily changing the version number, it would become useless as a tool for introducing backwards-incompatible features.

标准的交易测试不仅让人们更难以通过广播有害交易来免费攻击比特币，还有助于防止用户今天创建交易，从而使未来增加新的交易功能更加困难。例如，如上所述，每个事务都包含一个版本号ーー如果用户开始随意更改版本号，那么它作为引入向后不兼容特性的工具将毫无用处。

As of Bitcoin Core 0.9, the standard pubkey script types are:

在比特币核心0.9中，标准的 pubkey 脚本类型是:

- Pay To Public Key Hash (P2PKH)
  
  支付到公开密钥散列(P2PKH)

- Pay To Script Hash (P2SH)
  
  支付到脚本散列(P2SH)

- Multisig

- Pubkey

- Null Data
  
  空数据

### Pay To Public Key Hash (P2PKH) 支付到公开密钥散列(P2PKH)[](https://developer.bitcoin.org/devguide/transactions.html#pay-to-public-key-hash-p2pkh "Permalink to this headline")

P2PKH is the most common form of pubkey script used to send a transaction to one or multiple Bitcoin addresses.

2pkh 是 pubkey 脚本最常见的形式，用于向一个或多个比特币地址发送交易。

Pubkey script: OP_DUP OP_HASH160 <PubKeyHash> OP_EQUALVERIFY OP_CHECKSIG
Signature script: <sig> <pubkey>

### Pay To Script Hash (P2SH) 支付到脚本散列(P2SH)[](https://developer.bitcoin.org/devguide/transactions.html#pay-to-script-hash-p2sh "Permalink to this headline")

P2SH is used to send a transaction to a script hash. Each of the standard pubkey scripts can be used as a P2SH redeem script, excluding P2SH itself. As of Bitcoin Core 0.9.2, P2SH transactions can contain any valid redeemScript, making the P2SH standard much more flexible and allowing for experimentation with many novel and complex types of transactions. The most common use of P2SH is the standard multisig pubkey script, with the second most common use being the [Open Assets Protocol](https://github.com/OpenAssets/open-assets-protocol/blob/master/specification.mediawiki).

P2SH 用于将事务发送到脚本散列。每个标准 pubkey 脚本都可以用作 P2SH 赎回脚本，P2SH 本身除外。由于比特币核心0.9.2，P2SH 交易可以包含任何有效的 redeemScript，使得 P2SH 标准更加灵活，并允许对许多新颖和复杂类型的交易进行实验。P2SH 最常见的用途是标准的 multisig pubkey 脚本，其次是开放资产协议。

Another common redeemScript used for P2SH is storing textual data on the blockchain. The first bitcoin transaction ever made included text, and P2SH is a convenient method of storing text on the blockchain as its possible to store up to 1.5kb of text data. An example of storing text on the blockchain using P2SH can be found in this [repository](https://github.com/petertodd/checklocktimeverify-demos/blob/master/lib/python-bitcoinlib/examples/publish-text.py).

用于 P2SH 的另一个常见的 redeemScript 是在区块链上存储文本数据。第一个比特币交易有史以来包括文本，和 P2SH 是一个方便的方法存储文本的封锁链条，因为它可以存储高达1.5 kb 的文本数据。使用 P2SH 在区块链上存储文本的示例可以在这个存储库中找到。

Pubkey script: OP_HASH160 <Hash160(redeemScript)> OP_EQUAL
Signature script: <sig> [sig] [sig...] <redeemScript>

This script combination looks perfectly fine to old nodes as long as the script hash matches the redeem script. However, after the soft fork is activated, new nodes will perform a further verification for the redeem script. They will extract the redeem script from the signature script, decode it, and execute it with the remaining stack items(<sig> [sig] [sig..]part). Therefore, to redeem a P2SH transaction, the spender must provide the valid signature or answer in addition to the correct redeem script.

只要脚本散列符合可赎回脚本，这个脚本组合对于旧节点来说就完全没有问题。但是，在激活软 fork 之后，新节点将对 redemption 脚本执行进一步的验证。他们将从签名脚本中提取赎回脚本，对其进行解码，并用剩余的堆栈项目执行该脚本(< sig > [ sig ][ sig ]。.]部分)。因此，要赎回 P2SH 交易，除了正确的赎回脚本之外，消费者还必须提供有效的签名或答案。

This last step is similar to the verification step in P2PKH or P2Multisig scripts, where the initial part of the signature script(<sig> [sig] [sig..]) acts as the “signature script” in P2PKH/P2Multisig, and the redeem script acts as the “pubkey script”.

最后一步类似于 P2PKH 或 P2Multisig 脚本中的验证步骤，其中签名脚本的初始部分(< sig > [ sig ][ sig ]。.])作为 P2PKH/P2Multisig 中的“签名脚本” ，赎回脚本作为“公钥脚本”。

### Multisig[](https://developer.bitcoin.org/devguide/transactions.html#multisig "Permalink to this headline")

Although P2SH multisig is now generally used for multisig transactions, this base script can be used to require multiple signatures before a UTXO can be spent.

虽然 P2SH multisig 现在通常用于多重信息事务，但是这个基本脚本可以用于在使用 UTXO 之前需要多个签名。

In multisig pubkey scripts, called m-of-n, *m* is the *minimum* number of signatures which must match a public key; *n* is the *number* of public keys being provided. Both *m* and *n* should be opcodes `OP_1` through `OP_16`, corresponding to the number desired.

在称为 m-of-n 的 multisig pubkey 脚本中，m 是必须与公钥匹配的最小签名数; n 是提供的公钥数。M 和 n 都应该是 opcodes OP _ 1到 OP _ 16，对应于所需的数字。

Because of an off-by-one error in the original Bitcoin implementation which must be preserved for compatibility, [“OP_CHECKMULTISIG”](https://developer.bitcoin.org/terms.html#term-op-checkmultisig) consumes one more value from the stack than indicated by *m*, so the list of [secp256k1](http://www.secg.org/sec2-v2.pdf) signatures in the signature script must be prefaced with an extra value (`OP_0`) which will be consumed but not used.

由于在原始的比特币实现中必须保留一个差一错误，为了兼容性，“ OP _ checkmultisig”从堆栈中消耗的值比 m 所指示的多一个，因此签名脚本中的 secp256k1签名列表必须在前面加上一个额外值(OP _ 0) ，这个额外值将被消耗但不会被使用。

The signature script must provide signatures in the same order as the corresponding public keys appear in the pubkey script or redeem script. See the description in [“OP_CHECKMULTISIG”](https://developer.bitcoin.org/terms.html#term-op-checkmultisig) for details.

签名脚本必须按照 pubkey 脚本或赎回脚本中相应的公钥出现的顺序提供签名。有关详细信息，请参阅“ op_checkmultisig”中的描述。

Pubkey script: <m> <A pubkey> [B pubkey] [C pubkey...] <n> OP_CHECKMULTISIG
Signature script: OP_0 <A sig> [B sig] [C sig...]

Although it’s not a separate transaction type, this is a P2SH multisig with 2-of-3:

尽管它不是一个单独的事务类型，但它是一个 P2SH multisig，具有2-of-3:

Pubkey script: OP_HASH160 <Hash160(redeemScript)> OP_EQUAL
Redeem script: <OP_2> <A pubkey> <B pubkey> <C pubkey> <OP_3> OP_CHECKMULTISIG
Signature script: OP_0 <A sig> <C sig> <redeemScript>

### Pubkey[](https://developer.bitcoin.org/devguide/transactions.html#pubkey "Permalink to this headline")

Pubkey outputs are a simplified form of the P2PKH pubkey script, but they aren’t as secure as P2PKH, so they generally aren’t used in new transactions anymore.

Pubkey 输出是 P2PKH Pubkey 脚本的简化形式，但是它们不像 P2PKH 那样安全，所以它们通常不再用于新的事务。

Pubkey script: <pubkey> OP_CHECKSIG
Signature script: <sig>

### Null Data 空数据[](https://developer.bitcoin.org/devguide/transactions.html#null-data "Permalink to this headline")

[Null data](https://developer.bitcoin.org/glossary.html#term-Null-data-transaction) transaction type relayed and mined by default in [Bitcoin Core 0.9.0](https://bitcoin.org/en/release/v0.9.0) and later that adds arbitrary data to a provably unspendable pubkey script that full nodes don’t have to store in their UTXO database. It is preferable to use null data transactions over transactions that bloat the UTXO database because they cannot be automatically pruned; however, it is usually even more preferable to store data outside transactions if possible.

在比特币核心0.9.0以及更高版本中，默认情况下中继和挖掘空数据交易类型，将任意数据添加到一个可证明无法使用的公共密钥脚本中，完整的节点不必存储在它们的 UTXO 数据库中。最好在 UTXO 数据库膨胀的事务上使用空数据事务，因为它们不能被自动裁剪; 然而，如果可能的话，在事务外存储数据通常更可取。

Consensus rules allow null data outputs up to the maximum allowed pubkey script size of 10,000 bytes provided they follow all other consensus rules, such as not having any data pushes larger than 520 bytes.

一致性规则允许空数据输出最大允许的 pubkey 脚本大小为10,000字节，前提是它们遵循所有其他一致性规则，比如不允许任何数据推送大于520字节。

Bitcoin Core 0.9.x to 0.10.x will, by default, relay and mine null data transactions with up to 40 bytes in a single data push and only one null data output that pays exactly 0 satoshis:

在默认情况下，比特币 Core 0.9.x to 0.10.x 将在一个数据推送中使用最多40字节的空数据交易，并且只有一个空数据输出支付0 satoshis:

Pubkey Script: OP_RETURN <0 to 40 bytes of data>
(Null data scripts cannot be spent, so there's no signature script.)

Bitcoin Core 0.11.x increases this default to 80 bytes, with the other rules remaining the same.

11.x 将这个默认值增加到80字节，其他规则保持不变。

Bitcoin Core 0.12.0 defaults to relaying and mining null data outputs with up to 83 bytes with any number of data pushes, provided the total byte limit is not exceeded. There must still only be a single null data output and it must still pay exactly 0 satoshis.

比特币核心0.12.0默认中继和挖掘空数据输出83字节与任何数量的数据推，只要总字节限制不超过。仍然必须只有一个空数据输出，并且仍然必须支付正好0个卫星。

The `-datacarriersize` Bitcoin Core configuration option allows you to set the maximum number of bytes in null data outputs that you will relay or mine.

- datacarriersize Bitcoin Core 配置选项允许您设置空数据输出的最大字节数，您将中继或采矿。

### Non-Standard Transactions 非标准交易[](https://developer.bitcoin.org/devguide/transactions.html#non-standard-transactions "Permalink to this headline")

If you use anything besides a standard pubkey script in an output, peers and miners using the default Bitcoin Core settings will neither accept, broadcast, nor mine your transaction. When you try to broadcast your transaction to a peer running the default settings, you will receive an error.

如果你在输出中使用除了标准的 pubkey 脚本之外的任何东西，使用默认比特币核心设置的同行和矿工将不会接受、广播或挖掘你的交易。当您尝试将事务广播给运行默认设置的对等方时，您将收到一个错误。

If you create a redeem script, hash it, and use the hash in a P2SH output, the [network](https://developer.bitcoin.org/devguide/p2p_network.html) sees only the hash, so it will accept the output as valid no matter what the redeem script says. This allows payment to non-standard scripts, and as of Bitcoin Core 0.11, almost all valid redeem scripts can be spent. The exception is scripts that use unassigned [NOP opcodes](https://en.bitcoin.it/wiki/Script#Reserved_words); these opcodes are reserved for future soft forks and can only be relayed or mined by nodes that don’t follow the standard mempool policy.

如果您创建一个赎回脚本，散列它，并在 P2SH 输出中使用散列，那么网络只能看到散列，因此无论赎回脚本说什么，它都将接受输出为有效。这允许支付非标准的脚本，并作为核心的比特币0.11，几乎所有有效的赎回脚本可以花费。例外的是使用未分配 NOP 操作码的脚本; 这些操作码被预留给未来的软分叉，只能由不遵循标准 mempool 策略的节点中继或挖掘。

Note: standard transactions are designed to protect and help the [network](https://developer.bitcoin.org/devguide/p2p_network.html), not prevent you from making mistakes. It’s easy to create standard transactions which make the satoshis sent to them unspendable.

注意: 标准事务的设计是为了保护和帮助网络，而不是防止你犯错。很容易创建标准的事务，使 satoshis 发送给他们不可消费。

As of [Bitcoin Core 0.9.3](https://bitcoin.org/en/release/v0.9.3), standard transactions must also meet the following conditions:

从比特币核心0.9.3开始，标准交易也必须满足以下条件:

- The transaction must be finalized: either its locktime must be in the past (or less than or equal to the current block height), or all of its sequence numbers must be 0xffffffff.
  
  事务必须完成: 它的锁定时间必须是在过去(或者小于或等于当前块高度) ，或者它的所有序列号必须是0xffffffff。

- The transaction must be smaller than 100,000 bytes. That’s around 200 times larger than a typical single-input, single-output P2PKH transaction.
  
  事务必须小于100,000字节，这大约是典型的单输入单输出 P2PKH 事务的200倍。

- Each of the transaction’s signature scripts must be smaller than 1,650 bytes. That’s large enough to allow 15-of-15 multisig transactions in P2SH using compressed public keys.
  
  每个事务的签名脚本必须小于1,650字节。这个大小足以允许 P2SH 中使用压缩公钥的15个多重信息事务中的15个。

- Bare (non-P2SH) multisig transactions which require more than 3 public keys are currently non-standard.
  
  裸(非 p2sh)多重信息事务需要超过3个公钥，目前是非标准的。

- The transaction’s signature script must only push data to the script evaluation stack. It cannot push new opcodes, with the exception of opcodes which solely push data to the stack.
  
  事务的签名脚本只能将数据推送到脚本计算堆栈。它不能推送新的操作码，除了只将数据推送到堆栈的操作码。

- The transaction must not include any outputs which receive fewer than 1/3 as many satoshis as it would take to spend it in a typical input. That’s [currently 546 satoshis](https://github.com/bitcoin/bitcoin/commit/6a4c196dd64da2fd33dc7ae77a8cdd3e4cf0eff1) for a P2PKH or P2SH output on a Bitcoin Core node with the default relay fee. Exception: standard null data outputs must receive zero satoshis.
  
  交易不得包括任何得到的产出少于一个典型投入所需的卫星数量的1/3。目前有546个 satoshis 用于比特币核心节点上的 P2PKH 或 P2SH 输出，并且默认支付中继费。异常: 标准空数据输出必须接收零卫星数据。

## Signature Hash Types 签名散列类型[](https://developer.bitcoin.org/devguide/transactions.html#signature-hash-types "Permalink to this headline")

[“OP_CHECKSIG”](https://developer.bitcoin.org/terms.html#term-op-checksig) extracts a non-stack argument from each signature it evaluates, allowing the signer to decide which parts of the transaction to sign. Since the signature protects those parts of the transaction from modification, this lets signers selectively choose to let other people modify their transactions.

“ op_checksig”从它计算的每个签名中提取一个非堆栈参数，允许签名者决定签署事务的哪些部分。由于签名保护事务的这些部分不被修改，因此允许签名者有选择地选择让其他人修改他们的事务。

The various options for what to sign are called [signature hash](https://developer.bitcoin.org/glossary.html#term-Signature-hash) types. There are three base SIGHASH types currently available:

签名的各种选项被称为签名散列类型。目前有三种基本 SIGHASH 类型可用:

- [“SIGHASH_ALL”](https://developer.bitcoin.org/glossary.html#term-SIGHASH_ALL), the default, signs all the inputs and outputs, protecting everything except the signature scripts against modification.
  
  默认的“ SIGHASH _ all”为所有输入和输出签名，保护除签名脚本以外的所有内容不被修改。

- [“SIGHASH_NONE”](https://developer.bitcoin.org/glossary.html#term-SIGHASH_NONE) signs all of the inputs but none of the outputs, allowing anyone to change where the satoshis are going unless other signatures using other signature hash flags protect the outputs.
  
  “ SIGHASH _ none”标记所有输入，但没有输出，允许任何人改变 satoshis 的去向，除非其他签名使用其他签名散列标志保护输出。

- [“SIGHASH_SINGLE”](https://developer.bitcoin.org/glossary.html#term-SIGHASH_SINGLE) the only output signed is the one corresponding to this input (the output with the same [output index](https://developer.bitcoin.org/terms.html#term-output-index) number as this input), ensuring nobody can change your part of the transaction but allowing other signers to change their part of the transaction. The corresponding output must exist or the value “1” will be signed, breaking the security scheme. This input, as well as other inputs, are included in the signature. The sequence numbers of other inputs are not included in the signature, and can be updated.
  
  “ SIGHASH _ single”唯一的已签名输出是与此输入对应的输出(输出索引号与此输入相同) ，确保没有人可以更改事务的您部分，但允许其他签名者更改事务的其他部分。相应的输出必须存在，否则将对值“1”进行签名，从而破坏安全方案。这个输入以及其他输入都包含在签名中。其他输入的序列号不包含在签名中，可以更新。

The base types can be modified with the [“SIGHASH_ANYONECANPAY”](https://developer.bitcoin.org/glossary.html#term-SIGHASH_ANYONECANPAY) (anyone can pay) flag, creating three new combined types:

基本类型可以用“ SIGHASH _ anyonecanpay”标志(任何人都可以付费)修改，创建三种新的组合类型:

- `SIGHASH_ALL|SIGHASH_ANYONECANPAY` signs all of the outputs but only this one input, and it also allows anyone to add or remove other inputs, so anyone can contribute additional satoshis but they cannot change how many satoshis are sent nor where they go.
  
  标记所有的输出，但只有这一个输入，它还允许任何人添加或删除其他输入，所以任何人都可以贡献额外的 satoshis，但他们不能改变有多少 satoshis 被发送或他们去哪里。

- `SIGHASH_NONE|SIGHASH_ANYONECANPAY` signs only this one input and allows anyone to add or remove other inputs or outputs, so anyone who gets a copy of this input can spend it however they’d like.
  
  SIGHASH none | SIGHASH anyonecanpay 只签署这一个输入，并允许任何人添加或删除其他输入或输出，所以任何人谁得到这个输入的副本可以花它任何他们想要的。

- `SIGHASH_SINGLE|SIGHASH_ANYONECANPAY` signs this one input and its corresponding output. Allows anyone to add or remove other inputs.
  
  SIGHASH _ single | SIGHASH _ anyonecanpay 为此输入及其相应的输出签名。允许任何人添加或删除其他输入。

Because each input is signed, a transaction with multiple inputs can have multiple signature hash types signing different parts of the transaction. For example, a single-input transaction signed with `NONE` could have its output changed by the miner who adds it to the block chain. On the other hand, if a two-input transaction has one input signed with `NONE` and one input signed with `ALL`, the `ALL` signer can choose where to spend the satoshis without consulting the `NONE` signer—but nobody else can modify the transaction.

因为每个输入都是签名的，所以具有多个输入的事务可以具有多个签名哈希类型，对事务的不同部分进行签名。例如，使用 NONE 签名的单输入事务可能会由将其添加到块链中的采矿者更改其输出。另一方面，如果一个双输入事务有一个输入带 NONE 签名，一个输入带 ALL 签名，则 ALL 签名者可以选择在哪里使用 satoshis，而无需咨询 NONE 签名者ーー但其他任何人都不能修改该事务。

## Locktime And Sequence Number 锁定时间和序列号[](https://developer.bitcoin.org/devguide/transactions.html#locktime-and-sequence-number "Permalink to this headline")

One thing all signature hash types sign is the transaction’s [locktime](https://developer.bitcoin.org/glossary.html#term-Locktime). (Called nLockTime in the Bitcoin Core source code.) The locktime indicates the earliest time a transaction can be added to the block chain.

所有签名的散列类型的标志之一是事务的锁定时间。(在比特币核心源代码中称为 nLockTime)锁定时间表示事务可以添加到块链的最早时间。

Locktime allows signers to create time-locked transactions which will only become valid in the future, giving the signers a chance to change their minds.

Locktime 允许签名者创建只在将来才有效的时间锁定事务，给签名者一个改变他们想法的机会。

If any of the signers change their mind, they can create a new non-locktime transaction. The new transaction will use, as one of its inputs, one of the same outputs which was used as an input to the locktime transaction. This makes the locktime transaction invalid if the new transaction is added to the block chain before the time lock expires.

如果任何签名者改变了主意，他们可以创建一个新的非锁定时间事务。新事务将使用与锁定时间事务相同的输出之一作为其输入之一。如果在时间锁过期之前将新事务添加到块链，则锁定时间事务无效。

Care must be taken near the expiry time of a time lock. The [peer-to-peer network](https://developer.bitcoin.org/devguide/p2p_network.html) allows block time to be up to two hours ahead of real time, so a locktime transaction can be added to the block chain up to two hours before its time lock officially expires. Also, blocks are not created at guaranteed intervals, so any attempt to cancel a valuable transaction should be made a few hours before the time lock expires.

必须在时间锁的到期时间附近小心。对等网络允许块时间提前两个小时，所以锁定时间事务可以在正式时间锁失效前两个小时添加到块链中。此外，块不是按保证的间隔创建的，因此任何取消有价值事务的尝试都应该在时间锁过期之前几个小时进行。

Previous versions of Bitcoin Core provided a feature which prevented transaction signers from using the method described above to cancel a time-locked transaction, but a necessary part of this feature was disabled to prevent denial of service attacks. A legacy of this system are four-byte [sequence numbers](https://developer.bitcoin.org/glossary.html#term-Sequence-number) in every input. Sequence numbers were meant to allow multiple signers to agree to update a transaction; when they finished updating the transaction, they could agree to set every input’s sequence number to the four-byte unsigned maximum (0xffffffff), allowing the transaction to be added to a block even if its time lock had not expired.

早期版本的比特币核心提供了一个功能，可以防止交易签署者使用上述方法取消一个时间锁定的交易，但是这个功能的一个必要部分被禁用，以防止分布式拒绝服务攻击攻击。这个系统的一个遗留问题是每个输入中都有四个字节的序列号。序列号意味着允许多个签名者同意更新事务; 当他们完成更新事务时，他们可以同意将每个输入的序列号设置为四字节的无签名最大值(0xffffffff) ，这样即使事务的时间锁没有过期，也可以将事务添加到一个块中。

Even today, setting all sequence numbers to 0xffffffff (the default in Bitcoin Core) can still disable the time lock, so if you want to use locktime, at least one input must have a sequence number below the maximum. Since sequence numbers are not used by the [network](https://developer.bitcoin.org/devguide/p2p_network.html) for any other purpose, setting any sequence number to zero is sufficient to enable locktime.

即使在今天，将所有序列号设置为0xffffff (比特币核心的默认值)仍然可以禁用时间锁，所以如果你想使用锁定时间，至少有一个输入的序列号必须低于最大值。由于序列号不会被网络用于任何其他目的，所以将任何序列号设置为零就足以启用锁定时间。

Locktime itself is an unsigned 4-byte integer which can be parsed two ways:

Locktime 本身是一个无符号4字节的整数，可以通过两种方式进行解析:

- If less than 500 million, locktime is parsed as a block height. The transaction can be added to any block which has this height or higher.
  
  如果小于5亿，则 locktime 被解析为块高度。事务可以添加到具有此高度或更高的任何块。

- If greater than or equal to 500 million, locktime is parsed using the [Unix epoch time](https://en.wikipedia.org/wiki/Unix_time) format (the number of seconds elapsed since 1970-01-01T00:00 UTC—currently over 1.395 billion). The transaction can be added to any block whose block time is greater than the locktime.
  
  如果大于或等于5亿，则使用 Unix epoch 时间格式解析 locktime (自1970-01-01T00:00 utc ー目前超过13.95亿)。事务可以添加到任何阻塞时间大于锁定时间的块中。

## Transaction Fees And Change 交易费用及变更[](https://developer.bitcoin.org/devguide/transactions.html#transaction-fees-and-change "Permalink to this headline")

Transactions pay fees based on the total byte size of the signed transaction. Fees per byte are calculated based on current demand for space in mined blocks with fees rising as demand increases. The transaction fee is given to the Bitcoin miner, as explained in the [block chain section](https://developer.bitcoin.org/devguide/block_chain.html), and so it is ultimately up to each miner to choose the minimum transaction fee they will accept.

事务根据已签名事务的总字节大小支付费用。每个字节的费用是根据当前开采区块的空间需求计算的，费用随着需求的增加而增加。交易费用是给比特币矿商的，正如块链部分所解释的，因此最终取决于每个矿商选择他们将接受的最低交易费用。

There is also a concept of so-called “[high-priority transactions](https://developer.bitcoin.org/glossary.html#term-High-priority-transaction)” which spend satoshis that have not moved for a long time.

还有一种所谓的“高优先级事务”的概念，即花费很长时间没有移动的 satoshis。

In the past, these “priority” transaction were often exempt from the normal fee requirements. Before Bitcoin Core 0.12, 50 KB of each block would be reserved for these high-priority transactions, however this is now set to 0 KB by default. After the priority area, all transactions are prioritized based on their fee per byte, with higher-paying transactions being added in sequence until all of the available space is filled.

在过去，这些“优先权”交易往往不受正常收费要求的限制。在比特币核心0.12之前，每个块的50 KB 被预留给这些高优先级的交易，但是现在默认设置为0 KB。在优先级区域之后，所有交易都根据每个字节的费用进行优先级排序，并按顺序添加付费较高的交易，直到所有可用空间都被填满。

As of Bitcoin Core 0.9, a [minimum fee](https://developer.bitcoin.org/glossary.html#term-Minimum-relay-fee) (currently 1,000 satoshis) has been required to broadcast a transaction across the [network](https://developer.bitcoin.org/devguide/p2p_network.html). Any transaction paying only the minimum fee should be prepared to wait a long time before there’s enough spare space in a block to include it. Please see the [verifying payment section](https://developer.bitcoin.org/devguide/payment_processing.html#verifying-payment) for why this could be important.

从比特币核心0.9开始，通过网络广播交易需要最低费用(目前是1000个 satoshis)。任何只支付最低费用的交易都应该准备等待很长一段时间，直到一个块中有足够的空闲空间来包含它。请查看核实付款部分为什么这可能是重要的。

Since each transaction spends Unspent Transaction Outputs (UTXOs) and because a UTXO can only be spent once, the full value of the included UTXOs must be spent or given to a miner as a transaction fee. Few people will have UTXOs that exactly match the amount they want to pay, so most transactions include a change output.

由于每个事务都会花费未用的事务输出(UTXOs) ，而且因为一个 UTXO 只能花费一次，所以必须将包含的 UTXOs 的全部价值作为事务费用花费或给予矿工。很少有人拥有与他们想要支付的金额完全匹配的 UTXOs，因此大多数事务都包含一个更改输出。

[Change outputs](https://developer.bitcoin.org/glossary.html#term-Change-address) are regular outputs which spend the surplus satoshis from the UTXOs back to the spender. They can reuse the same P2PKH pubkey hash or P2SH script hash as was used in the UTXO, but for the reasons described in the [next subsection](https://developer.bitcoin.org/devguide/transactions.html#avoiding-key-reuse), it is highly recommended that change outputs be sent to a new P2PKH or P2SH address.

变化输出是将剩余的卫星从 UTXOs 返回到消费者的定期输出。它们可以重用 UTXO 中使用的相同 P2PKH pubkey 散列或 P2SH 脚本散列，但由于下一小节所述的原因，强烈建议将更改输出发送到新的 P2PKH 或 P2SH 地址。

## Avoiding Key Reuse 避免重复使用密钥[](https://developer.bitcoin.org/devguide/transactions.html#avoiding-key-reuse "Permalink to this headline")

In a transaction, the spender and receiver each reveal to each other all public keys or addresses used in the transaction. This allows either person to use the public block chain to track past and future transactions involving the other person’s same public keys or addresses.

在交易中，消费者和接收者各自向对方披露交易中使用的所有公钥或地址。这允许任何一个人使用公共块链来跟踪过去和未来涉及其他人的相同公共密钥或地址的交易。

If the same public key is reused often, as happens when people use Bitcoin addresses (hashed public keys) as static payment addresses, other people can easily track the receiving and spending habits of that person, including how many satoshis they control in known addresses.

如果同一个公钥经常被重用，就像人们使用比特币地址(哈希公钥)作为静态支付地址时发生的情况一样，其他人可以很容易地跟踪这个人的接收和消费习惯，包括他们在已知地址中控制了多少 satoshis。

It doesn’t have to be that way. If each public key is used exactly twice—once to receive a payment and once to spend that payment—the user can gain a significant amount of financial privacy.

事情不一定非得这样。如果每个公钥只被使用两次ーー一次用于接收付款，一次用于支出付款ーー用户就可以获得大量的财务隐私。

Even better, using new public keys or [unique addresses](https://developer.bitcoin.org/terms.html#term-unique-address) when accepting payments or creating change outputs can be combined with other techniques discussed later, such as CoinJoin or [merge avoidance](https://developer.bitcoin.org/terms.html#term-merge-avoidance), to make it extremely difficult to use the block chain by itself to reliably track how users receive and spend their satoshis.

更好的是，在接受付款或创建变更输出时使用新的公钥或唯一地址可以与后面讨论的其他技术结合起来，比如硬币连接或合并规避，这使得单独使用区块链来可靠地跟踪用户如何接收和使用他们的卫星变得极其困难。

Avoiding key reuse can also provide security against attacks which might allow reconstruction of private keys from public keys (hypothesized) or from signature comparisons (possible today under certain circumstances described below, with more general attacks hypothesized).

避免密钥重用还可以提供安全性，防止可能从公钥(假设)或从签名比较(假设有更普遍的攻击)重建私钥的攻击。

1. Unique (non-reused) P2PKH and P2SH addresses protect against the first type of attack by keeping [ECDSA](https://en.wikipedia.org/wiki/Elliptic_Curve_DSA) public keys hidden (hashed) until the first time satoshis sent to those addresses are spent, so attacks are effectively useless unless they can reconstruct private keys in less than the hour or two it takes for a transaction to be well protected by the block chain.
   
   唯一的(不可重用的) P2PKH 和 P2SH 地址通过将 ECDSA 公钥隐藏(散列化)直到第一次发送到这些地址的 satoshis 被使用来防止第一种类型的攻击，因此攻击实际上是没有用的，除非它们能够在不到一两个小时的时间内重构私钥，否则事务就会被块链很好地保护。

2. Unique (non-reused) private keys protect against the second type of attack by only generating one signature per private key, so attackers never get a subsequent signature to use in comparison-based attacks. Existing comparison-based attacks are only practical today when insufficient entropy is used in signing or when the entropy used is exposed by some means, such as a [side-channel attack](https://en.wikipedia.org/wiki/Side_channel_attack).
   
   唯一的(不可重用的)私钥通过每个私钥只生成一个签名来防止第二种类型的攻击，因此攻击者在基于比较的攻击中无法获得后续的签名。现有的基于比较的攻击只有在签名中使用了不充分的熵或者使用了某种方法(如边信道攻击)暴露了熵的情况下才是实用的。

So, for both privacy and security, we encourage you to build your applications to avoid public key reuse and, when possible, to discourage users from reusing addresses. If your application needs to provide a fixed URI to which payments should be sent, please see the [“bitcoin:” URI section](https://developer.bitcoin.org/devguide/payment_processing.html#bitcoin-uri) below.

因此，为了保护隐私和安全，我们鼓励您构建应用程序，以避免公钥重用，并尽可能阻止用户重用地址。如果您的应用程序需要提供一个固定的 URI，支付应该发送，请参阅下面的“比特币: ” URI 部分。

## Transaction Malleability 交易延展性[](https://developer.bitcoin.org/devguide/transactions.html#transaction-malleability "Permalink to this headline")

None of Bitcoin’s signature hash types protect the signature script, leaving the door open for a limited denial of service attack called [transaction malleability](https://developer.bitcoin.org/glossary.html#term-Transaction-malleability){:.term}{:#term-transaction-malleability}. The signature script contains the [secp256k1](http://www.secg.org/sec2-v2.pdf) signature, which can’t sign itself, allowing attackers to make non-functional modifications to a transaction without rendering it invalid. For example, an attacker can add some data to the signature script which will be dropped before the previous pubkey script is processed.

没有一种比特币的签名哈希类型能够保护签名脚本，这就为一种名为交易延展性的有限的分布式拒绝服务攻击攻击敞开了大门。{ : # term-transaction-malability }.签名脚本包含 secp256k1签名，该签名本身不能签名，允许攻击者对事务进行非功能性修改，而不会导致事务无效。例如，攻击者可以向签名脚本添加一些数据，这些数据将在处理前一个 pubkey 脚本之前被删除。

Although the modifications are non-functional—so they do not change what inputs the transaction uses nor what outputs it pays—they do change the computed hash of the transaction. Since each transaction links to previous transactions using hashes as a transaction identifier (txid), a modified transaction will not have the txid its creator expected.

虽然这些修改是非功能性的ーー因此它们不会改变交易使用的输入和支付的输出ーー但它们确实会改变交易的计算散列。由于每个事务使用散列作为事务标识符(txid)链接到以前的事务，因此修改后的事务不会具有预期的 txid 创建者。

This isn’t a problem for most Bitcoin transactions which are designed to be added to the block chain immediately. But it does become a problem when the output from a transaction is spent before that transaction is added to the block chain.

对于大多数比特币交易来说，这不是一个问题，因为它们被设计成立即添加到块链中。但是，当事务的输出在添加到块链之前就被花费时，这就成了一个问题。

Bitcoin developers have been working to reduce transaction malleability among standard transaction types, one outcome of those efforts is [BIP 141: Segregated Witness](https://github.com/bitcoin/bips/blob/master/bip-0141.mediawiki), which is supported by Bitcoin Core and was activated in August 2017. When SegWit is not being used, new transactions should not depend on previous transactions which have not been added to the block chain yet, especially if large amounts of satoshis are at stake.

比特币开发商一直在努力减少标准交易类型之间的交易可塑性，这些努力的成果之一是 BIP 141: Segregated Witness，它得到了比特币核心的支持，于2017年8月被激活。当 SegWit 不被使用时，新的交易不应该依赖于以前的交易，这些交易还没有被添加到区块链中，特别是如果大量的 satoshis 处于危险之中。

Transaction malleability also affects payment tracking. Bitcoin Core’s [RPC](https://developer.bitcoin.org/reference/rpc/index.html) interface lets you track transactions by their txid—but if that txid changes because the transaction was modified, it may appear that the transaction has disappeared from the [network](https://developer.bitcoin.org/devguide/p2p_network.html).

交易延展性也会影响支付跟踪。比特币核心的 RPC 接口可以让你通过它们的 txid 跟踪交易，但是如果由于交易被修改而导致 txid 发生变化，那么这个交易可能看起来已经从网络中消失了。

Current best practices for transaction tracking dictate that a transaction should be tracked by the transaction outputs (UTXOs) it spends as inputs, as they cannot be changed without invalidating the transaction.

当前事务跟踪的最佳实践规定，事务应该由其作为输入花费的事务输出(UTXOs)来跟踪，因为如果不使事务无效，就不能更改事务。

Best practices further dictate that if a transaction does seem to disappear from the [network](https://developer.bitcoin.org/devguide/p2p_network.html) and needs to be reissued, that it be reissued in a way that invalidates the lost transaction. One method which will always work is to ensure the reissued payment spends all of the same outputs that the lost transaction used as inputs.

最佳实践进一步规定，如果事务确实似乎从网络中消失并需要重新发出，则应以使丢失的事务无效的方式重新发出该事务。一种始终有效的方法是确保重新发放的付款使用与损失的交易用作投入的所有产出相同的产出。
