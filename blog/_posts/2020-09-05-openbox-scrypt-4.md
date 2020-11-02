---
title: 打开sCrypt的盒子（4）OP_PUSH_TX
summary: ```OP_PUSH_TX```以```OP```开始，但它不是比特币脚本的操作符，是一个将交易原像放入解锁脚本，从而判断新的输出是否符合规定的技术
date: 2020-09-07 12:06:56
lang: zh
tags: 
  - 比特币
  - sCrypt
---
sCrypt是比特币合约走出来的第一步。我们看看sCrypt创造的新技术：```OP_PUSH_TX```

```OP_PUSH_TX```以```OP```开始，但它不是比特币脚本的操作符，是一个将交易原像放入解锁脚本，从而判断新的输出是否符合规定的技术。

假设已经有了一个交易TX1的输出out_1，其中的锁定脚本要求：解锁它的解锁脚本必须拥有一样代码逻辑，变化的只是最后包括的数字。这个TX2应该怎么做呢？TX1的锁定脚本是如何实现的呢？

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200617102420846.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ZyZWVkb21oZXJv,size_16,color_FFFFFF,t_70#pic_center#pic_center)
实现的技术就是```OP_PUSH_TX```， 它要求解锁参数是新交易TX2的原像

```OP_PUSH_TX```的官方文档在[sCrypt语言参考](https://scryptdoc.readthedocs.io/en/latest/contracts.html#contract-op-push-tx)

官方Counter代码例子

```javascript
contract Counter {
  public function increment(bytes txPreimage, int amount) {
    require(Tx.checkPreimage(txPreimage));

    bytes scriptCode = Util.scriptCode(txPreimage);
    int scriptLen = length(scriptCode);

    // state (i.e., counter value) is at the end
    int counter = unpack(scriptCode[scriptLen - Util.DataLen : ]);
    // increment counter
    bytes scriptCode_ = scriptCode[ : scriptLen - Util.DataLen] + num2bin(counter + 1, Util.DataLen);
    // output: amount + scriptlen + script
    Sha256 hashOutputs = hash256(num2bin(amount, Util.OutputValueLen) + Util.writeVarint(scriptCode_));
    // ensure output is expected: amount is same with specified
    // also output script is the same with scriptCode except counter incremented
    require(hashOutputs == Util.hashOutputs(txPreimage));
  }
}
```

```Tx.checkPreimage```是名叫Tx合约中的静态函数，它检查原像是否同当前交易一致。调用increment函数时，原像中包括了前一个交易锁定脚本。```Tx.checkPreimage```函数内部使用了```OP_CHECKSIG```，进行签名检查。签名检查用随机生成的公钥私钥。从而确认解锁参数提供的原像就是TX2的原像。

这就像DNA遗传，新诞生的小鸡必须同母鸡拥有一致的DNA，但在某些地方可以有变化。必须一致的DNA代码就写在锁定脚本中。每个新的生命，都有必须一致的那部分。

可以改变的部分，也必须符合规定。继续看一下上面的例子

```bytes scriptCode = Util.scriptCode(txPreimage)```这一句获取了原像TX1_OUT_1中的锁定脚本。它的最后包含数据```OP_RETURN 00```（不同的脚本也可能不包含数据）

有趣的是```scriptCode```如何写入原像的(虽然同本文无关)。```scriptCode```用Varint格式保存锁定脚本。Varint是一个字符串的表现形式，基本上是一个header表明数据字节长度站几个字节，是1，2，4还是8，然后获取长度len，剩下的其余部分是数据。 一个很好的资料可以看 [https://learnmeabitcoin.com/technical/varint](https://learnmeabitcoin.com/technical/varint)

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200905172914121.png#pic_center)



然后从原像最后一个字节取出 counter ```00```, 加一，置换原像最后一个字节为 ```01```

counter就是可变部分，他要求新的输出TX2中的锁定脚本的最后一个字节必须是```01```。如果再有新的交易TX3,TX4，每一次counter的数字都加一。

判断的办法是检查原像中的```hashOutputs```， 在签名类型为ALL的时候，会对TX2的**所有输出**，采用 ```satoshis(8个字节， UInt64LE类型) + 锁定脚本(Varint格式)```串接成字节数组，最后sha256(sha256(b)) 。

在脚本中计算的```hashOutputs```同原像中的```hashOutputs```一致，可以说明新的TX2输出符合要求。

注意⚠️计算```hashOutputs```是TX2的**所有输出**，这里是可能遇到的难点。在官方例子中严格假设只有一个输入和一个输出。在别的例子中要求一个输入两个输出，或者两个输入一个输出。

另外一个问题就是```OP_RETURN```后面的数据格式，目前采用字节拼接的方式
```counter.dataLoad = num2bin(0, DataLen)```
虽然可行，但也许有更加好的方案。

想要比特币上的Token吗？敬请期待...

> 享受比特币带来的安全自由， 关注使用[NoteSV](https://note.sv)
