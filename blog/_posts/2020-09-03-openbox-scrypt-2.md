---
title: 打开sCrypt的盒子（2）Demo合约
summary: 我们看看sCrypt最简单的Demo合约，看看它的有趣之处。
date: 2020-09-03 18:31:52
lang: zh
tags: 

- 比特币
- sCrypt

---

sCrypt是比特币合约走出来的第一步。我们看看sCrypt最简单的Demo合约，看看它的有趣之处。

合约原文代码
[Demo 合约](https://github.com/scrypt-sv/boilerplate/blob/master/contracts/demo.scrypt)

原文比较简单，贴在此处

```javascript
 contract Demo {
  int x;
  int y;

  constructor(int x, int y) {
      this.x = x;
      this.y = y;
  }

  function sum(int a, int b) returns (int) {
      return a + b;
  }

  public function add(int z) {
      require(z == this.sum(this.x, this.y));
  }

  public function sub(int z) {
      require(z == this.x - this.y);
  }
}
```

这个合约提供两个public属性的函数，一个add和一个sub。
将上述脚本的编译结果打出来

```javascript
    const Demo = buildContractClass(compileContract('demo.scrypt'));
    console.log('Demo',Demo)
    demo = new Demo(7, 4);
```

可以看到abi接口，注意public函数有index索引，这个索引将在后面使用

```javascript
 abi: [
   { type: 'function', name: 'add', index: 0, params: [Array] },
   { type: 'function', name: 'sub', index: 1, params: [Array] },
   { type: 'constructor', name: 'constructor', params: [Array] }
```

合约的编译结果比较长，暂时不去分析它，只把它当成一个黑盒，从外部测试。需要知道```demo = new Demo(7, 4);```这句已经将7和4两个数字写入了脚本，没法再更改。

合约的编译结果就是锁定脚本。而解锁脚本就是public函数的参数。

从外部调用的时候, 看下面的代码注释

```javascript
    //公开函数可以进行调用, addFn是一个函数调用，7+4的结果11是参数，进行函数调用
    const addFn = demo.add(11)
    console.log(addFn, addFn.unlockingScript.chunks)
    //解锁脚本是两个数字，11和1，第一个是参数11。第2参数1是add的索引+1
    result = addFn.verify()
    console.log(result)
    //result包含两个字段 success， true是成功，否则为false， error字段是出错原因，没出错则为空字符串
    console.log(addFn.toScript())
    //Script { chunks: [ { opcodenum: 91 }, { opcodenum: 81 } ] }
```

我不知道add的索引为什么+1，需要看实现细节。这个索引并不需要自己管理，在```addFn```中内部实现。

```addFn```包含两个关键的方法，一个是```verify()```, 一个是```toScript()```
```verify()```会使用将参数和函数索引押入栈中，然后同锁定脚本组合，跑一遍程序，最后检查栈顶是否为true
```toScript()```只是输出参数和函数索引组合起来的解锁脚本，并不去校验。

```verify()```非常适合在将解锁交易发送到比特币节点之前，在本地做校验。如果不做这个校验直接广播，在比特币节点中也会自动跑脚本，如果解锁失败，将会返回```"16: mandatory-script-verify-flag-failed (Script evaluated without error but finished with a false/empty top stack element)"```的错误。如果解锁成功，则锁定脚本所在的UTXO将被花费，里面的比特币satoshi被取出。

那我们做个自动自动扫描程序，检查所有的交易，发现有人提交这个demo锁定脚本，立即解锁，把币拿走可不可以呢？你要是会写这个程序，请联系我。

>  比特币带来的安全自由， 关注使用[NoteSV](https://note.sv)
