---

title: 实战比特币脚本编程（2）困局
summary: PUSH ONLY 车到山前，路呢？柳暗花明，村呢？
date: 2020-09-14 16:39:05
tags:
- 比特币
- Bitcoin Script
- mini_forth

---


在前一篇可以想到3种分割完整脚本的办法。

## PUSH ONLY

但现实因为要考虑安全因素，比特币不允许在解锁脚本中放入```OP_ADD```这样的操作符

也就是下面的形式不允许。

第一段解锁脚本（不允许）

```plain
OP_2
OP_3
OP_ADD
```
第二段锁定脚本
```plain
OP_5
OP_EQUAL
```
OP_2和OP_3将2和3推入栈中，而```OP_ADD```对栈进行操作。在比特币节点里有设置```SCRIPT_VERIFY_SIGPUSHONLY```，只允许数据入栈的操作。

```c++
// File: validation.cpp Line:3464
flags |= SCRIPT_VERIFY_SIGPUSHONLY;
```
否则会出现下面的错误
```plain
16: mandatory-script-verify-flag-failed (Only non-push operators allowed in signatures)
```
如果允许解锁脚本带有操作符，那么下面的解锁代码可以解锁任意脚本

```plain
OP_TRUE
OP_RETURN
```
```PUSHONLY```属于一刀切的禁止方式，应该有更好的实现方式。

## Redeem Script

那么是否有绕开的方式呢？曾经有一种机制叫做兑换脚本(RedeemScript)， 用于将脚本完全放在解锁脚本中，这个机制的名字叫做支付到脚本(P2SH)

例子如下

```plain
const redeem = 'OP_ADD OP_5 OP_EQUAL'
const redeemScript = Script.fromASM(redeem)
const redeemScriptHex = redeemScript.toHex()
const redeemScriptBuffer = redeemScript.toBuffer()
const redeemScriptHash = Hash.sha256ripemd160(redeemScriptBuffer)
const unlock = `OP_2 OP_3 ${redeemScriptHex}`
const lockingScript = `OP_HASH160 ${redeemScriptHash.toString('hex')} OP_EQUAL`
```
制作一段兑换脚本，比如```OP_ADD OP_5 OP_EQUAL```，对这段脚本的Hex进行Hash160计算```(sha256(ripedmd160())```, 将得到的hash填入锁定脚本。将hex放入解锁脚本。

比特币节点运行的时候，会先连接解锁脚本和锁定脚本，计算Hex的Hash160，看看Hex是否等于事先的约定代码。如果是，则解释Hex部分组合成兑换脚本，执行

```plain
OP_2 OP_3 OP_ADD OP_5 OP_EQUAL
```
这种兑换脚本(RedeemScript)的方案属于黑盒，无法从公开在区块链上的锁定脚本看出程序的语义。

此方案已经在2020年2月被比特币禁止。

如果还想广播这样的脚本，比特币节点会返回

```plain
16: bad-txns-vout-p2sh
```
## 困局

车到山前，路呢？

柳暗花明，村呢？


> 享受比特币带来的安全自由， 关注使用[NoteSV](https://note.sv)
