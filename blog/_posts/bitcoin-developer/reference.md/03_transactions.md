---
title: 参考 - Transactions 交易
summary: 下面的小节将简要记录核心事务细节。
date: 2020-11-02 03:00
tags:
- 比特币
- 翻译
- 比特币开发指南

---

::: info

翻译自[Transactions &#8212; Bitcoin](https://developer.bitcoin.org/reference/transactions.html#transactions)
内容在整理，准确性请自己确认

:::

# Transactions 交易[](https://developer.bitcoin.org/reference/transactions.html#transactions "Permalink to this headline")

The following subsections briefly document core transaction details.

下面的小节将简要记录核心事务细节。

## OpCodes[](https://developer.bitcoin.org/reference/transactions.html#opcodes "Permalink to this headline")

The opcodes used in the pubkey scripts of standard transactions are:

在标准事务的 pubkey 脚本中使用的操作码是:

- Various data pushing opcodes from 0x00 to 0x4e (1–78). These aren’t typically shown in examples, but they must be used to push signatures and public keys onto the stack. See the link below this list for a description.
  
  从0x00到0x4e (1-78)的各种数据压入操作码。这些通常不会在示例中显示，但必须使用它们将签名和公钥推送到堆栈上。请参阅下面的链接了解详情。

- `OP_TRUE`/`OP_1` (0x51) and `OP_2` through `OP_16` (0x52–0x60), which push the values 1 through 16 to the stack.
  
  OP _ true/OP _ 1(0x51)和 OP _ 2至 OP _ 16(0x52-0x60) ，将值1至16推送到堆栈。

- [“OP_CHECKSIG”](https://developer.bitcoin.org/terms.html#term-op-checksig) consumes a signature and a full public key, and pushes true onto the stack if the transaction data specified by the SIGHASH flag was converted into the signature using the same [ECDSA](https://en.wikipedia.org/wiki/Elliptic_Curve_DSA)private key that generated the public key. Otherwise, it pushes false onto the stack.
  
  “ OP _ checksig”使用一个签名和一个完整的公钥，如果 SIGHASH 标志指定的事务数据使用生成公钥的 ECDSA 私钥转换为签名，则将 true 推送到堆栈上。否则，它会将 false 推送到堆栈上。

- [“OP_DUP”](https://developer.bitcoin.org/terms.html#term-op-dup) pushes a copy of the topmost stack item on to the stack.
  
  “ op_dup”将最顶层堆栈项的一个副本推到堆栈上。

- [“OP_HASH160”](https://developer.bitcoin.org/terms.html#term-op-hash160) consumes the topmost item on the stack, computes the RIPEMD160(SHA256()) hash of that item, and pushes that hash onto the stack.
  
  “ OP _ hash160”使用堆栈上最顶端的项，计算该项的 RIPEMD160(SHA256())散列，并将该散列推送到堆栈上。

- [“OP_EQUAL”](https://developer.bitcoin.org/terms.html#term-op-equal) consumes the top two items on the stack, compares them, and pushes true onto the stack if they are the same, false if not.
  
  “ op_equal”使用堆栈上的顶部两个项，对它们进行比较，如果它们相同，则将 true 推送到堆栈上，如果不相同，则为 false。

- [“OP_VERIFY”](https://developer.bitcoin.org/terms.html#term-op-verify) consumes the topmost item on the stack. If that item is zero (false) it terminates the script in failure.
  
  “ op_verify”消耗堆栈上最顶端的项。如果该项为零(false) ，则在失败时终止脚本。

- [“OP_EQUALVERIFY”](https://developer.bitcoin.org/terms.html#term-op-equalverify) runs [“OP_EQUAL”](https://developer.bitcoin.org/terms.html#term-op-equal) and then [“OP_VERIFY”](https://developer.bitcoin.org/terms.html#term-op-verify) in sequence.
  
  “ op_equalverify”按顺序运行“ op_equal”和“ op_verify”。

- [“OP_CHECKMULTISIG”](https://developer.bitcoin.org/terms.html#term-op-checkmultisig) consumes the value (n) at the top of the stack, consumes that many of the next stack levels (public keys), consumes the value (m) now at the top of the stack, and consumes that many of the next values (signatures) plus one extra value.
  
  “ OP _ checkmultisig”使用堆栈顶部的值(n) ，使用下一个堆栈级别的许多值(公钥) ，使用堆栈顶部的值(m) ，并使用下一个值(签名)加上一个额外值。
  
  The “one extra value” it consumes is the result of an off-by-one error in the Bitcoin Core implementation. This value is not used, so signature scripts prefix the list of [secp256k1](http://www.secg.org/sec2-v2.pdf) signatures with a single OP_0 (0x00).
  
  它消耗的“一个额外价值”是比特币核心实现中的一个差一错误的结果。这个值没有被使用，所以签名脚本在 secp256k1签名列表的前面加上一个 OP _ 0(0x00)。
  
  [“OP_CHECKMULTISIG”](https://developer.bitcoin.org/terms.html#term-op-checkmultisig) compares the first signature against each public key until it finds an [ECDSA](https://en.wikipedia.org/wiki/Elliptic_Curve_DSA) match. Starting with the subsequent public key, it compares the second signature against each remaining public key until it finds an [ECDSA](https://en.wikipedia.org/wiki/Elliptic_Curve_DSA) match. The process is repeated until all signatures have been checked or not enough public keys remain to produce a successful result.
  
  “ op_checkmultisig”将第一个签名与每个公钥进行比较，直到找到 ECDSA 匹配。从后续的公钥开始，它将第二个签名与每个剩余的公钥进行比较，直到找到 ECDSA 匹配。重复这个过程，直到检查完所有的签名，或者没有足够的公钥来产生成功的结果。
  
  Because public keys are not checked again if they fail any signature comparison, signatures must be placed in the signature script using the same order as their corresponding public keys were placed in the pubkey script or redeem script. See the [“OP_CHECKMULTISIG”](https://developer.bitcoin.org/terms.html#term-op-checkmultisig) warning below for more details.
  
  因为如果公钥无法进行任何签名比较，就不会再次检查公钥，所以签名必须按照公钥放在 pubkey 脚本或赎回脚本中的顺序放在签名脚本中。详细信息请参阅下面的“ op_checkmultisig”警告。

- [“OP_RETURN”](https://developer.bitcoin.org/terms.html#term-op-return) terminates the script in failure when executed.
  
  “ op_return”在执行失败时终止脚本。

A complete list of opcodes can be found on the Bitcoin Wiki [Script Page](https://en.bitcoin.it/wiki/Script), with an authoritative list in the `opcodetype` enum of the Bitcoin Core [script header file](https://github.com/bitcoin/bitcoin/blob/master/src/script/script.h)

完整的操作码列表可以在比特币维基脚本页面上找到，在比特币核心脚本头文件的操作码类型 enum 中有一个权威列表

![Warning icon](https://developer.bitcoin.org/_images/icon_warning.svg) **Signature script modification warning:** Signature scripts are not signed, so anyone can modify them. This means signature scripts should only contain data and data-pushing opcodes which can’t be modified without causing the pubkey script to fail. Placing non-data-pushing opcodes in the signature script currently makes a transaction non-standard, and future consensus rules may forbid such transactions altogether. (Non-data-pushing opcodes are already forbidden in signature scripts when spending a P2SH pubkey script.)

签名脚本修改警告: 签名脚本没有签名，所以任何人都可以修改它们。这意味着签名脚本应该只包含数据和数据推送操作码，这些操作码不能修改，否则会导致 pubkey 脚本失败。目前，在签名脚本中放置非数据推送操作码会导致事务不标准，而且未来的一致性规则可能完全禁止此类事务。(在使用 P2SH pubkey 脚本时，签名脚本中已经禁止使用非数据推送操作码。)

![Warning icon](https://developer.bitcoin.org/_images/icon_warning.svg) [“OP_CHECKMULTISIG”](https://developer.bitcoin.org/terms.html#term-op-checkmultisig)**warning:** The multisig verification process described above requires that signatures in the signature script be provided in the same order as their corresponding public keys in the pubkey script or redeem script. For example, the following combined signature and pubkey script will produce the stack and comparisons shown:

“ OP _ checkmultisig”警告: 上面描述的 multisig 验证过程要求签名脚本中的签名与 pubkey 脚本或赎回脚本中相应的公钥按相同的顺序提供。例如，下面的组合签名和 pubkey 脚本将生成如下所示的堆栈和比较:

OP_0 <A sig> <B sig> OP_2 <A pubkey> <B pubkey> <C pubkey> OP_3
Sig Stack       Pubkey Stack  (Actually a single stack)

---------       ------------

B sig           C pubkey
A sig           B pubkey
OP_0            A pubkey

1. B sig compared to C pubkey (no match)
2. B sig compared to B pubkey (match #1)
3. A sig compared to A pubkey (match #2)
   Success: two matches found

But reversing the order of the signatures with everything else the same will fail, as shown below:

但是如果将签名的顺序颠倒过来，其他所有的顺序都一样，那么就会失败，如下所示:

OP_0 <B sig> <A sig> OP_2 <A pubkey> <B pubkey> <C pubkey> OP_3
Sig Stack       Pubkey Stack  (Actually a single stack)

---------       ------------

A sig           C pubkey
B sig           B pubkey
OP_0            A pubkey

1. A sig compared to C pubkey (no match)
2. A sig compared to B pubkey (no match)
   Failure, aborted: two signature matches required but none found so far, and there's only one pubkey remaining

## Address Conversion 地址转换[](https://developer.bitcoin.org/reference/transactions.html#address-conversion "Permalink to this headline")

The hashes used in P2PKH and P2SH outputs are commonly encoded as Bitcoin addresses. This is the procedure to encode those hashes and decode the addresses.

在 P2PKH 和 P2SH 输出中使用的散列通常被编码为比特币地址。这是对这些散列进行编码和解码地址的过程。

First, get your hash. For P2PKH, you RIPEMD-160(SHA256()) hash a [ECDSA](https://en.wikipedia.org/wiki/Elliptic_Curve_DSA) public key derived from your 256-bit [ECDSA](https://en.wikipedia.org/wiki/Elliptic_Curve_DSA) private key (random data). For P2SH, you RIPEMD-160(SHA256()) hash a redeem script serialized in the format used in raw transactions (described in a [following sub-section](https://developer.bitcoin.org/reference/transactions.html#raw-transaction-format)). Taking the resulting hash:

首先，拿上你的大麻。对于 P2PKH，您可以使用从256位 ECDSA 私钥(随机数据)派生出来的 ECDSA 公钥散列(RIPEMD-160(SHA256())。对于 P2SH，您可以使用 RIPEMD-160(SHA256())散列按照原始事务中使用的格式序列化的赎回脚本(在下面的子节中进行描述)。将得到的散列:

1. Add an address version byte in front of the hash. The version bytes commonly used by Bitcoin are:
   
   在散列前加入地址版本字节。比特币通常使用的版本字节如下:
   
   - 0x00 for P2PKH addresses on the main Bitcoin [network](https://developer.bitcoin.org/devguide/p2p_network.html) (mainnet)
     
     0x00用于比特币主网络(主网)上的 P2PKH 地址
   
   - 0x6f for P2PKH addresses on the Bitcoin testing [network](https://developer.bitcoin.org/devguide/p2p_network.html) (testnet)
   
   - 0x05 for P2SH addresses on mainnet
   
   - 0xc4 for P2SH addresses on testnet
     
     0xc4 for P2SH addresson testnet

2. Create a copy of the version and hash; then hash that twice with SHA256: `SHA256(SHA256(version .hash))`
   
   创建版本和散列的副本; 然后使用 SHA256进行两次散列: SHA256(SHA256(version. hash))

3. Extract the first four bytes from the double-hashed copy. These are used as a checksum to ensure the base hash gets transmitted correctly.
   
   从双哈希的副本中提取前四个字节。这些用作校验和，以确保正确地传输基本哈希。

4. Append the checksum to the version and hash, and encode it as a base58 string: `BASE58(version .hash . checksum)`
   
   将校验和追加到 version 和 hash，并将其编码为 BASE58字符串: BASE58(version. hash. checksum)

Bitcoin’s base58 encoding, called [Base58Check](https://developer.bitcoin.org/glossary.html#term-Base58check) may not match other implementations. Tier Nolan provided the following example encoding algorithm to the Bitcoin Wiki [Base58Check encoding](https://en.bitcoin.it/wiki/Base58Check_encoding) page under the [Creative Commons Attribution 3.0 license](https://creativecommons.org/licenses/by/3.0/):

比特币的 base58编码，即 Base58Check 可能与其他实现不匹配。在比特币 Wiki Base58Check 编码页面上，Tier Nolan 提供了下面的例子编码算法，这个页面属于比特币知识共享署名3.0许可:

code_string = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
x = convert_bytes_to_big_integer(hash_result)

output_string = ""

while(x > 0)
   {
       (x, remainder) = divide(x, 58)
       output_string.append(code_string[remainder])
   }

repeat(number_of_leading_zero_bytes_in_hash)
   {
   output_string.append(code_string[0]);
   }

output_string.reverse();

Bitcoin’s own code can be traced using the [base58 header file](https://github.com/bitcoin/bitcoin/blob/master/src/base58.h).

比特币自身的代码可以通过 base58头文件追踪。

To convert addresses back into hashes, reverse the base58 encoding, extract the checksum, repeat the steps to create the checksum and compare it against the extracted checksum, and then remove the version byte.

要将地址转换回散列，反转 base58编码，提取校验和，重复以下步骤创建校验和，并将其与提取的校验和进行比较，然后删除版本字节。

## Raw Transaction Format 原始交易格式[](https://developer.bitcoin.org/reference/transactions.html#raw-transaction-format "Permalink to this headline")

Bitcoin transactions are broadcast between peers in a serialized byte format, called [raw format](https://developer.bitcoin.org/glossary.html#term-Serialized-transaction). It is this form of a transaction which is SHA256(SHA256()) hashed to create the TXID and, ultimately, the merkle root of a block containing the transaction—making the transaction format part of the consensus rules.

比特币交易以序列化的字节格式(称为原始格式)在对等节点之间广播。正是这种形式的事务被 SHA256(SHA256())散列以创建 TXID，并最终创建包含事务的块的 merkle 根ー使事务格式成为协商一致规则的一部分。

Bitcoin Core and many other tools print and accept raw transactions encoded as hex.

比特币核心和许多其他工具打印和接受编码为十六进制的原始交易。

As of [Bitcoin Core 0.9.3](https://bitcoin.org/en/release/v0.9.3) (October 2014), all transactions use the version 1 format described below. (Note: transactions in the block chain are allowed to list a higher version number to permit soft forks, but they are treated as version 1 transactions by current software.)

截至比特币核心0.9.3(2014年10月) ，所有交易都使用下面描述的1版本格式。(注意: 块链中的事务允许列出较高的版本号以允许软叉，但它们被当前软件视为版本1事务。)

A raw transaction has the following top-level format:

原始事务具有以下顶级格式:

| Bytes字节    | Name姓名           | Data Type数据类型         | Description描述                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ---------- | ---------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 4图4        | version版本        | int32_t32t            | [Transaction version number](https://developer.bitcoin.org/terms.html#term-transaction-version-number) (note, this is signed); currently version 1 or 2. Programs creating transactions using newer consensus rules may use higher version numbers. Version 2 means that [BIP 68](https://github.com/bitcoin/bips/blob/master/bip-0068.mediawiki#specification) applies.事务版本号(注意，已签名) ; 当前版本1或2。使用新的一致性规则创建事务的程序可能使用更高的版本号。版本2意味着 bip68适用。 |
| *Varies*不同 | tx_in count数到十   | compactSize uint紧凑型尺寸 | Number of inputs in this transaction.此事务中的输入数量。                                                                                                                                                                                                                                                                                                                                                                                            |
| *Varies*不同 | tx_in天津          | txIn天津泰信科技有限公司        | Transaction inputs. See description of txIn below.事务输入。请参阅下面对 txIn 的描述。                                                                                                                                                                                                                                                                                                                                                                    |
| *Varies*不同 | tx_out count出局计数 | compactSize uint紧凑型尺寸 | Number of outputs in this transaction.此事务中的输出数。                                                                                                                                                                                                                                                                                                                                                                                            |
| *Varies*不同 | tx_out通话完毕       | txOut                 | Transaction outputs. See description of txOut below.事务输出。请参阅下面对 txOut 的描述。                                                                                                                                                                                                                                                                                                                                                                 |
| 4图4        | lock_time锁定时间    | uint32_t32t           | A time ([Unix epoch time](https://en.wikipedia.org/wiki/Unix_time)) or block number. See the [locktime parsing rules](https://developer.bitcoin.org/devguide/transactions.html#locktime_parsing_rules).一个时间(Unix 新纪元时间)或块号。                                                                                                                                                                                                                |

A transaction may have multiple inputs and outputs, so the txIn and txOut structures may recur within a transaction. CompactSize unsigned integers are a form of variable-length integers; they are described in the [CompactSize section](https://developer.bitcoin.org/reference/transactions.html#compactsize-unsigned-integers).

一个事务可能有多个输入和输出，因此 txIn 和 txOut 结构可能会在一个事务中重复出现。CompactSize 无符号整数是可变长度整数的一种形式; 它们在 CompactSize 部分中进行了描述。

### TxIn: A Transaction Input (Non-Coinbase) 一个事务输入(Non-Coinbase)[](https://developer.bitcoin.org/reference/transactions.html#txin-a-transaction-input-non-coinbase "Permalink to this headline")

Each non-coinbase input spends an outpoint from a previous transaction. (Coinbase inputs are described separately after the example section below.)

每个非 Coinbase 输入都会消耗前一个事务的一个 outpoint (Coinbase 输入在下面的示例部分之后单独描述)

| Bytes字节    | Name姓名               | Data Type数据类型         | Description描述                                                                                                                                                                                                                                                                                                               |
| ---------- | -------------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 36图36      | previous_output前面的输出 | outpoint突出点           | The previous outpoint being spent. See description of outpoint below.前一个支出点正在使用。请参阅下面的支出点描述。                                                                                                                                                                                                                                |
| *Varies*不同 | script bytes脚本字节     | compactSize uint紧凑型尺寸 | The number of bytes in the signature script. Maximum is 10,000 bytes.签名脚本中的字节数。最大为10,000字节。                                                                                                                                                                                                                                 |
| *Varies*不同 | signature script签名脚本 | char[]马沙[]            | A script-language script which satisfies the conditions placed in the outpoint’s pubkey script. Should only contain data pushes; see the [signature script modification warning](https://developer.bitcoin.org/terms.html#signature-script-modification-warning).满足 outpoint 的 pubkey 脚本中的条件的脚本语言脚本。应该只包含数据推送; 请参阅签名脚本修改警告。 |
| 4图4        | sequence序列           | uint32_t32t           | Sequence number. Default for Bitcoin Core and almost all other programs is 0xffffffff.序列号。比特币核心和几乎所有其他程序的默认值是0xffffff。                                                                                                                                                                                                      |

### Outpoint: The Specific Part Of A Specific Output 特点: 特定产出的特定部分[](https://developer.bitcoin.org/reference/transactions.html#outpoint-the-specific-part-of-a-specific-output "Permalink to this headline")

Because a single transaction can include multiple outputs, the outpoint structure includes both a TXID and an [output index](https://developer.bitcoin.org/terms.html#term-output-index) number to refer to specific output.

因为单个事务可以包含多个输出，所以 outpoint 结构包含 TXID 和输出索引号，用于引用特定的输出。

| Bytes字节 | Name姓名  | Data Type数据类型 | Description描述                                                                                                                                                                                 |
| ------- | ------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 32图32   | hash大麻  | char[32][32]  | The TXID of the transaction holding the output to spend. The TXID is a hash provided here in internal byte order.保存要花费的输出的事务的 TXID。TXID 是以内部字节顺序提供的散列。                                        |
| 4图4     | index索引 | uint32_t32t   | The [output index](https://developer.bitcoin.org/terms.html#term-output-index) number of the specific output to spend from the transaction. The first output is 0x00000000.事务中要花费的特定输出的输出索引号。 |

### TxOut: A Transaction Output TxOut: 一个事务输出[](https://developer.bitcoin.org/reference/transactions.html#txout-a-transaction-output "Permalink to this headline")

Each output spends a certain number of satoshis, placing them under control of anyone who can satisfy the provided pubkey script.

每个输出花费一定数量的 satoshis，将它们置于任何能满足所提供的 pubkey 脚本的人的控制之下。

| Bytes字节    | Name姓名              | Data Type数据类型         | Description描述                                                                                                                                                                                                                                                                                                                               |
| ---------- | ------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 8图8        | value价值             | int64_t64t            | Number of satoshis to spend. May be zero; the sum of all outputs may not exceed the sum of satoshis previously spent to the outpoints provided in the input section. (Exception: coinbase transactions spend the block subsidy and collected transaction fees.)可供消费的 satoshis 数量。可以为零; 所有输出的总和不得超过先前用于输入部分提供的支出点的总和。(例外: 硬币交易花费块补贴和收取交易费用。) |
| 1+1 +      | pk_script bytes脚本字节 | compactSize uint紧凑型尺寸 | Number of bytes in the pubkey script. Maximum is 10,000 bytes.Pubkey 脚本中的字节数。最大为10,000字节。                                                                                                                                                                                                                                                   |
| *Varies*不同 | pk_script脚本         | char[]马沙[]            | Defines the conditions which must be satisfied to spend this output.定义使用此输出必须满足的条件。                                                                                                                                                                                                                                                         |

**Example**

例子

The sample raw transaction itemized below is the one created in the [Simple Raw Transaction section](https://developer.bitcoin.org/examples/transactions.html#simple-raw-transaction) of the Developer Examples. It spends a previous pay-to-pubkey output by paying to a new pay-to-pubkey-hash (P2PKH) output.

下面列出的示例原始事务是在“开发人员示例”的“简单原始事务”部分中创建的事务。它通过向新的 pay-to-pubkey-hash (P2PKH)输出支付费用来花费先前的 pay-to-pubkey 输出。

01000000 ................................... Version
01 ......................................... Number of inputs
|
| 7b1eabe0209b1fe794124575ef807057
| c77ada2138ae4fa8d6c4de0398a14f3f ......... Outpoint TXID
| 00000000 ................................. Outpoint index number
|
| 49 ....................................... Bytes in sig. script: 73
| | 48 ..................................... Push 72 bytes as data
| | | 30450221008949f0cb400094ad2b5eb3
| | | 99d59d01c14d73d8fe6e96df1a7150de
| | | b388ab8935022079656090d7f6bac4c9
| | | a94e0aad311a4268e082a725f8aeae05
| | | 73fb12ff866a5f01 ..................... [Secp256k1][secp256k1] signature
|
| ffffffff ................................. Sequence number: UINT32_MAX
01 ......................................... Number of outputs
| f0ca052a01000000 ......................... Satoshis (49.99990000 BTC)
|
| 19 ....................................... Bytes in pubkey script: 25
| | 76 ..................................... OP_DUP
| | a9 ..................................... OP_HASH160
| | 14 ..................................... Push 20 bytes as data
| | | cbc20a7664f2f69e5355aa427045bc15
| | | e7c6c772 ............................. PubKey hash
| | 88 ..................................... OP_EQUALVERIFY
| | ac ..................................... OP_CHECKSIG
00000000 ................................... locktime: 0 (a block height)

### Coinbase Input: The Input Of The First Transaction In A Block Coinbase 输入: 块中第一个事务的输入[](https://developer.bitcoin.org/reference/transactions.html#coinbase-input-the-input-of-the-first-transaction-in-a-block "Permalink to this headline")

The first transaction in a block, called the coinbase transaction, must have exactly one input, called a coinbase. The coinbase input currently has the following format.

一个块中的第一个事务(称为 coinbase 事务)必须只有一个输入(称为 coinbase)。Coinbase 输入目前具有以下格式。

| Bytes字节          | Name姓名                             | Data Type数据类型         | Description描述                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ---------------- | ---------------------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 32图32            | hash (null)散列(空)                   | char[32][32]          | A 32-byte null, as a coinbase has no previous outpoint.32字节的 null，作为 coinbase，以前没有 outpoint。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 4图4              | index (UINT32_MAX)索引(UINT32 _ max) | uint32_t32t           | 0xffffffff, as a coinbase has no previous outpoint.作为一个基地没有以前的出发点，as a coinbase has no previously outpoint。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| *Varies*不同       | script bytes脚本字节                   | compactSize uint紧凑型尺寸 | The number of bytes in the coinbase script, up to a maximum of 100 bytes.Coinbase 脚本中的字节数，最多为100个字节。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| *Varies*(4)不同(4) | height高度                           | script脚本              | The [block height](https://developer.bitcoin.org/glossary.html#term-Coinbase) of this block as required by [BIP34](https://github.com/bitcoin/bips/blob/master/bip-0034.mediawiki). Uses script language: starts with a data-pushing opcode that indicates how many bytes to push to the stack followed by the block height as a little-endian unsigned integer. This script must be as short as possible, otherwise it may be rejected. The data-pushing opcode will be 0x03 and the total size four bytes until block 16,777,216 about 300 years from now.按照 BIP34的要求，这个块的高度。使用脚本语言: 以数据推送操作码开始，该操作码指示要推送到堆栈的字节数，后跟块高度作为小尾数无符号整数。此脚本必须尽可能短，否则可能会被拒绝。数据推送操作码将是0x03，总大小为4字节，直到大约300年后的块16,777,216。 |
| *Varies*不同       | coinbase script硬币脚本                | *None*没有              | The [coinbase field](https://developer.bitcoin.org/glossary.html#term-Coinbase): Arbitrary data not exceeding 100 bytes minus the (4) height bytes. Miners commonly place an extra nonce in this field to update the block header merkle root during hashing.Coinbase 字段: 不超过100字节的任意数据减去(4)高度字节。矿工通常在此字段中放置一个额外的 nonce 来更新散列期间的块头 merkle 根。                                                                                                                                                                                                                                                                                                                                                       |
| 4图4              | sequence序列                         | uint32_t32t           | Sequence number.序列号。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |

Most (but not all) blocks prior to block height 227,836 used block version 1 which did not require the height parameter to be prefixed to the coinbase script. The block height parameter is now required.

在块高度227,836之前，大多数(但不是所有)块使用了块版本1，它不需要在 coinbase 脚本前面加上 height 参数。现在需要块高度参数。

Although the coinbase script is arbitrary data, if it includes the bytes used by any signature-checking operations such as [“OP_CHECKSIG”](https://developer.bitcoin.org/terms.html#term-op-checksig), those signature checks will be counted as signature operations (sigops) towards the block’s sigop limit. To avoid this, you can prefix all data with the appropriate push operation.

虽然 coinbase 脚本是任意数据，但是如果它包含任何签名检查操作(如“ OP _ checksig”)所使用的字节，那么这些签名检查将被视为针对块的 sigop 限制的签名操作(sigops)。为了避免这种情况，可以在所有数据前加上适当的 push 操作作为前缀。

An itemized coinbase transaction:

一个逐条列出的 coinbase 事务:

01000000 .............................. Version
01 .................................... Number of inputs
| 00000000000000000000000000000000
| 00000000000000000000000000000000 ...  Previous outpoint TXID
| ffffffff ............................ Previous outpoint index
|
| 29 .................................. Bytes in coinbase
| |
| | 03 ................................ Bytes in height
| | | 4e0105 .......................... Height: 328014
| |
| | 062f503253482f0472d35454085fffed
| | f2400000f90f54696d65202620486561
| | 6c74682021 ........................ Arbitrary data
| 00000000 ............................ Sequence
01 .................................... Output count
| 2c37449500000000 .................... Satoshis (25.04275756 BTC)
| 1976a914a09be8040cbf399926aeb1f4
| 70c37d1341f3b46588ac ................ P2PKH script
| 00000000 ............................ Locktime

#### CompactSize Unsigned Integers 无符号整数[](https://developer.bitcoin.org/reference/transactions.html#compactsize-unsigned-integers "Permalink to this headline")

The raw transaction format and several [peer-to-peer network](https://developer.bitcoin.org/devguide/p2p_network.html) messages use a type of variable-length integer to indicate the number of bytes in a following piece of data.

原始事务格式和几个对等网络消息使用一种可变长度的整数类型来指示下面一段数据中的字节数。

Bitcoin Core code and this document refers to these variable length integers as compactSize. Many other documents refer to them as var_int or varInt, but this risks conflation with other variable-length integer encodings—such as the CVarInt class used in Bitcoin Core for serializing data to disk. Because it’s used in the transaction format, the format of compactSize unsigned integers is part of the consensus rules.

比特币核心代码和本文档将这些可变长度的整数称为 compactSize。许多其他文档将它们称为 var _ int 或 varInt，但这有可能与其他可变长度的整数编码(比如比特币核心中用于将数据序列化到磁盘的 CVarInt 类)合并在一起。因为它是在事务格式中使用的，所以 compactSize 无符号整数的格式是一致性规则的一部分。

For numbers from 0 to 252, compactSize unsigned integers look like regular unsigned integers. For other numbers up to 0xffffffffffffffff, a byte is prefixed to the number to indicate its length—but otherwise the numbers look like regular unsigned integers in little-endian order.

对于0到252之间的数字，compactSize 无符号整数看起来像正则无符号整数。对于最大为0xffffffff 的其他数字，数字前面会加一个字节来表示它的长度ー但是否则这些数字看起来就像小尾数顺序的正则无符号整数。

| Value价值                                                                      | Bytes Used使用的字节数 | Format格式                                                  |
| ---------------------------------------------------------------------------- | ---------------- | --------------------------------------------------------- |
| >= 0 && <= 252> = 0 & & < = 252                                              | 1                | uint8_t我不知道你在说什么                                          |
| >= 253 && <= 0xffff253 & & & < = 0xffff                                      | 3图3              | 0xfd followed by the number as uint16_t后面的数字是 uint16t     |
| >= 0x10000 && <= 0xffffffff> = 0x10000 & & & < = 0xffffff                    | 5                | 0xfe followed by the number as uint32_t0xfe 后面是数字 uint32t |
| >= 0x100000000 && <= 0xffffffffffffffff> = 0x10000000 & & & & < = 0xffffffff | 9图9              | 0xff followed by the number as uint64_t0xff 后面是数字 uint64t |

For example, the number 515 is encoded as 0xfd0302.

例如，数字515被编码为0xfd0302。
