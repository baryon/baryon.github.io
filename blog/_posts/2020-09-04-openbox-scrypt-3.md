---

title: 打开sCrypt的盒子（3）原像PreImage
summary: 对数据签名，获取的sig叫签名，生成这个签名的原始数据就叫做：原像PreImage
date: 2020-09-04 19:50:59
lang: zh
tags: 
  - 比特币
  - sCrypt
  
---
sCrypt是比特币合约走出来的第一步。我们看看sCrypt用到的基础知识：原像PreImage

对数据签名，获取的sig叫签名，生成这个签名的原始数据就叫做：原像PreImage

在[P2PKH合约](https://blog.csdn.net/weixin_47461167/article/details/108368848)中解锁一个锁定脚本的关键是要提供sig和公钥pk，有了pk和sig以及```交易本身```，比特币节点通过```OP_CHECKSIG```操作符进行检查，看检查结果是否为True，交易是否有效。

在sCrypt中检查原像的合约代码是

```javascript
  public function testPreimageParsing(bytes preimage) {
    require(Tx.checkPreimage(preimage));
    bytes preimage_ = Util.nVersion(preimage) + Util.hashPrevouts(preimage) + Util.hashSequence(preimage) +
    Util.outpoint(preimage) + Util.writeVarint(Util.scriptCode(preimage)) + Util.valueRaw(preimage) +
    Util.nSequenceRaw(preimage) + Util.hashOutputs(preimage) + Util.nLocktimeRaw(preimage) + Util.sigHashType(preimage);
    require(preimage == preimage_);
  }
```

原像preimage作为解锁参数。

让人迷惑的是```OP_CHECKSIG```操作的时候，```交易本身```当然可以知道。但sCrypt中却在交易构建的过程中就拿到了sig的原像Preimage， 作为解锁参数。这说明```交易本身```并不等于原像Preimage， ```OP_CHECKSIG```操作的时候对```交易本身```做了处理，抽出了一部分内容，这些内容是在构造交易之前就可以获得的。原像就是由交易的某些部分构成。这些组合部分从上面的合约代码就可以看出。

[原始资料](https://github.com/bitcoin-sv/bitcoin-sv/blob/master/doc/abc/replay-protected-sighash.md)说明原像是由下面的部分构成的


> 1. 交易版本 (4个字节）
> 2. hashPrevouts (输入outpoint的哈希32字节哈希)
> 3. hashSequence  (输入sequence的哈希32字节哈希) 
> 4. 当前输入outpoint (32字节txid + 4字节位置)
> 5. 当前输入的锁定脚本（Varint格式)
> 6. 从当前输入所花费的satoshi(8字节)
> 7. 当前输入的 nSequence (4字节)
> 8. hashOutputs (输出的satoshi+输出脚本组合的32字节哈希) 
> 9. 交易的nLocktime (4字节）
> 10. 签名的类型(4字节)

其中第2,3,8项同第10项的签名类型有关。4到7项同当前输入有关，输入的锁定脚本作为第5项。第2项同所有输入有关，第8项同所有输出有关。

注意⚠️这个原像的构造在2017年比特币升级时做了修改。2017年之前的版本有所不同。

原像的基础知识对比特币上的Token非常重要，有了它才有了```OP_PUSH_TX```
下一篇文章，我们打开```OP_PUSH_TX```看看里面是什么。

>  享受比特币带来的安全自由， 关注使用[NoteSV](https://note.sv)