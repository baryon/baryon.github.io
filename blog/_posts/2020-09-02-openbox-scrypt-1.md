---

title: 打开sCrypt的盒子（1）P2PKH合约
summary: 我们看看sCrypt最简单的Demo合约，看看它的有趣之处。
date: 2020-09-02 20:44:55
lang: zh
tags: 
  - 比特币
  - sCrypt
  
---
sCrypt是比特币合约走出来的第一步。我们打开sCrypt的P2PKH合约的盒子，看看它是否真的工作。

基本操作请参考下面的文章
[比特币智能合约入门（4）- sCrypt 合约实战篇 - P2PKH 合约化](https://blog.csdn.net/freedomhero/article/details/107235041)

下面分析它生成的脚本是否正确。

> 这里使用的sCrypt 编译器版本是0.1.22，最新的编译器版本结果不同，请自行分析

通过log显示了构造出来的锁定脚本为
```javascript
  'OP_1 40 00 51 b1 b2 OP_NOP $pubKeyHash OP_0 OP_1 OP_PICK OP_1 OP_ROLL OP_DROP OP_NOP OP_8 OP_PICK OP_HASH160 OP_1 OP_PICK OP_EQUAL OP_VERIFY OP_9 OP_PICK OP_9 OP_PICK OP_CHECKSIG OP_NIP OP_NIP OP_NIP OP_NIP OP_NIP OP_NIP OP_NIP OP_NIP OP_NIP OP_NIP'
```
这同标准脚本`OP_DUP OP_HASH160 $pubKeyHash OP_EQUALVERIFY OP_CHECKSIG`并不一致。两段脚本是否等价呢？

所有的脚本操作符的含义请参见 [比特币交易脚本语言操作符，常量和符号](https://blog.csdn.net/weixin_47461167/article/details/108278999)

P2PKH解锁的时候需要一个签名 `sig` 和一个公钥 `pk`
为了说明更容易，先在堆栈中放入 sig pk

| 操作符 | 意思 | 堆栈（右侧是栈顶）|
|--|--|-- |
|  | 解锁脚本入栈 | sig pk |
| 'OP_1' | 将数字1入栈 | sig pk 1 |
| '40' | 将0x40入栈 | sig pk 1 40 | 
| '00' | 入栈 | sig pk 1 40 00 |
| '51' | 入栈 | sig pk 1 40 00 51 |
|  'b1' | 入栈 | sig pk 1 40 00 51 b1 |
|  'b2' | 入栈 | sig pk 1 40 00 51 b1 b2 |
|  'OP_NOP' | 什么也不做 | sig pk 1 40 00 51 b1 b2 |
|   'b4...9d' | 入栈公钥哈希, 20个字节 | sig pk 1 40 00 51 b1 b2 pkh | 
|  'OP_0' | 空字节入栈 | sig pk 1 40 00 51 b1 b2 pkh empty |
|  'OP_1' | 1 入栈 | sig pk 1 40 00 51 b1 b2 pkh empty 1 |
|  'OP_PICK' | 把堆栈的第1 个元素拷贝到栈顶（去掉1之后的栈顶是empty，它是第0个元素，那第一个元素就是pkh） |  sig pk 1 40 00 51 b1 b2 pkh empty pkh |
|  'OP_1' | 1 入栈 | sig pk 1 40 00 51 b1 b2 pkh empty pkh 1 |
|  'OP_ROLL' | 把堆栈的第1 个元素移动到栈顶 | sig pk 1 40 00 51 b1 b2 pkh pkh empty |
|  'OP_DROP' | 删除栈顶元素 |  sig pk 1 40 00 51 b1 b2 pkh pkh |
|   'OP_NOP' | 无操作 | sig pk 1 40 00 51 b1 b2 pkh pkh |
|   'OP_8' | 数字8 入栈 | sig pk 1 40 00 51 b1 b2 pkh pkh 8 |
|   'OP_PICK' | 把堆栈的第8 个元素拷贝到栈顶 | sig pk 1 40 00 51 b1 b2 pkh pkh pk |
|    'OP_HASH160' | 对斩顶的pk计算哈希 | sig pk 1 40 00 51 b1 b2 pkh pkh pkh2 |
|   'OP_1' |  1 入栈 | sig pk 1 40 00 51 b1 b2 pkh pkh pkh2 1 |
|   'OP_PICK' | 把堆栈的第1个元素拷贝到栈顶 | sig pk 1 40 00 51 b1 b2 pkh pkh pkh2 pkh |
|  'OP_EQUAL' | 栈顶的两个元素判断是否相等 | sig pk 1 40 00 51 b1 b2 pkh pkh true |
|  'OP_VERIFY'|检查栈顶元素是否为真| sig pk 1 40 00 51 b1 b2 pkh pkh true|
| 'OP_9'|10进制9入栈| sig pk 1 40 00 51 b1 b2 pkh pkh 9|
|'OP_PICK'|把堆栈的第9个元素拷贝到栈顶| sig pk 1 40 00 51 b1 b2 pkh pkh sig|
|'OP_9'|10进制9入栈| sig pk 1 40 00 51 b1 b2 pkh pkh sig 9|
| 'OP_PICK'|把堆栈的第9 个元素拷贝到栈顶| sig pk 1 40 00 51 b1 b2 pkh pkh sig pk|
|'OP_CHECKSIG'|检查栈顶两个元素的签名| sig pk 1 40 00 51 b1 b2 pkh pkh true|
|'OP_NIP'|删除栈顶的下一个元素| sig pk 1 40 00 51 b1 b2 pkh true|
|'OP_NIP'|删除栈顶的下一个元素| sig pk 1 40 00 51 b1 b2 true|
|'OP_NIP'|删除栈顶的下一个元素| sig pk 1 40 00 51 b1 true|
|'OP_NIP'|删除栈顶的下一个元素| sig pk 1 40 00 51 true|
|'OP_NIP'|删除栈顶的下一个元素| sig pk 1 40 00 true|
|'OP_NIP'|删除栈顶的下一个元素|  sig pk 1 40 true|
|'OP_NIP'|删除栈顶的下一个元素| sig pk 1 true|
|'OP_NIP'|删除栈顶的下一个元素|  sig pk true|
|'OP_NIP'|删除栈顶的下一个元素|  sig true|
|'OP_NIP'|删除栈顶的下一个元素|  true|

到此脚本结束，栈顶返回true，正常解锁

这段脚本比标准脚本`OP_DUP OP_HASH160 $pubKeyHash OP_EQUALVERIFY OP_CHECKSIG`多了一些无用的操作符。但是等价。多出来的操作符应该是脚本语言占位所需，另也许有代码混淆的目的。

每一笔带satoshi的锁定输出，都需要解锁才能花费。锁定部分，在某个交易中的位置叫做 outpoint， 包括其所在的交易`txid`和位置`outputIndex` 。对下一次花费来说，这个outpoint就是UTXO
花费的时候需要数据服务商或者钱包可以找到这个UTXO。如果脚本可变，找到某个地址对应的UTXO需要设计算法。

目前[whatsonchain](https://developers.whatsonchain.com/#get-unspent-transactions)支持sCrypt版本P2PKH合约脚本的获取。

脚本类型的不同，对钱包如何提供解锁脚本也是一个挑战。

>  比特币带来的安全自由， 关注使用[NoteSV](https://note.sv)

