---

title: 实战比特币脚本编程（1）两段
summary: 废话不多说，直接看程序，只需基础的程序知识就可以理解
date: 2020-09-13 17:14:18
tags:
- 比特币
- Bitcoin Script
- mini_forth

---

## 比特币脚本执行环境
比特币提供一种程序执行环境，它有

 - 分割为两段的脚本 
 - 多个脚本操作符 
 - 两个栈，叫做主栈(MainStack)和从栈(AltStack)

废话不多说，直接看程序，只需基础的程序知识就可以理解。

## 两段脚本

下面一段完整的脚本执行```2+3=5```

```plain
OP_2
OP_3
OP_ADD
OP_5
OP_EQUAL
```
这是一种基于栈的计算方式。猜测就可以知道写的```2 3 + 5 =```

这种没有括号，数字在前面，操作符在后面的写法叫做逆波兰表达式。有人说这证明了中本聪是日本人，因为日语就是 名词在前面，动词在后面。其实计算机在解释编译数学表达式，程序语言的时候都使用的这种方式。

在比特币中分割这个脚本为下面两段，一个叫做解锁脚本，一个叫做锁定脚本。

第一段

```plain
OP_2
```
第二段
```plain
OP_3
OP_ADD
OP_5
OP_EQUAL
```
第一段叫做解锁脚本，第二段叫做锁定脚本。

**锁定脚本的意思是：什么东西加上3等于5？**

**解锁脚本回答：2**

解锁脚本同锁定脚本连起来结果为“真”，说明解锁成功。

这里的解锁脚本答案显然是唯一的，只有2加3才为5。

## 第二种分法

第一段解锁脚本

```plain
OP_2
OP_3
```
第二段锁定脚本
```plain
OP_ADD
OP_5
OP_EQUAL
```
**锁定脚本的意思是：哪两个数加起来等于5？**

**这时候就有多个答案**，```2+3=5```， ```3+2=5```， ```1+4=5```，```4+1=5```，```0+5=5```， ```5+0=5```，这些都是答案

所以解锁脚本就可以有6种，比如 ```1+4=5```

```plain
OP_1
OP_4
```
## 第三种分法

第一段解锁脚本

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
**锁定脚本的意思是：什么东西等于5？**

显然5等于5，而不是第一段的```2+3```，最简单的解锁脚本是

```plain
OP_5
```
合起来运行就是
```plain
OP_5
OP_5
OP_EQUAL
```
第一段的```2+3```说明解锁可以是个函数，甚至很复杂，只要结果等于```5```，解锁脚本可以是任何东西。比如```6-4+3=5```

```plain
OP_6
OP_4
OP_SUB
OP_3
OP_ADD
```
## 换一种语言

上面的脚本使用原生的比特币脚本关键字，不容易记忆理解。下面使用forth语言重写。

```plain
: main 
  1 2 +
  5 =
  ;
```
上面的程序使用[mini forth](https://github.com/Ljzn/mini_forth)语法书写。
>```: main```表示：主函数，程序从main函数开始执行
>```1 2 +```表示：进行 1+2操作
>```5 =```表示：判断是否等于5
>```;```表示：函数结束
### 改成两段脚本

```plain
: unlock
  2 3
  ;
: locking
  + 5 =
  ;
: main
  unlock
  locking
  ;
```
上面的程序创造了两个函数，unlock是解锁函数，locking是锁定函数。
>main函数顺序调用解锁和锁定两个函数，将把两个函数连接在一起执行。
>locking函数表示“哪两个数加起来等于5？”
>unlock函数提供了2和3两个数字

显然**locking的函数语义用其他的高级语言难以描述**。这就是forth语言的奇妙之处。

### 解锁函数

```plain
: unlock
  6 4 -
  3 +
  ;
: locking
  5 =
  ;
: main
  unlock
  locking
  ;
```
这段代码实现了 ```6-4+3=5```
解锁脚本不只是数据，而是一个函数， 解锁代码提供了```6-4+3```这个答案。


> 享受比特币带来的安全自由， 关注使用[NoteSV](https://note.sv)