---

title: 取代BIP编号的BRFC规格
summary: BRFC规格对比特币技术规格文档的发布做了一些非严格的规定，可以取代BIP的编号体制。基于BRFC规格发布的文档描述了整个比特币生态系统的方方面面。
date: 2020-07-28 12:37:45
tags:
- 比特币
- BRFC

---


# BRFC规格
[BRFC (Bitcoin SV Request-For-Comments)](https://bsvalias.org/01-brfc-specifications.html)规格对比特币技术规格文档的发布做了一些非严格的规定，可以取代[BIP(Bitcoin Improvement Proposals)](https://github.com/bitcoin/bips)的**编号体制**。基于BRFC规格发布的文档描述了整个比特币生态系统的方方面面。

它最初用于描述了一系列 bsvalias 协议和 paymail 实现。

基于 BRFC 规格发布的文档没有固定的格式。 它们可以作为markdown格式编写，存放在 GitHub 存储库中，发布到公司网站上，嵌入到比特币 SV 区块链中，在邮件列表中共享，或者以作者认为合适的任何其他方式发布。

但是，建议至少在文件的某个地方列入下列元数据:

| 标题   | 是否必需 | 描述  |
| ---------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| title      | 必须      | 提案标题 |
| author     |               | 自由格式，可以包括姓名、别名、paymail地址、 github / 社交账号等 |
| version    |               | 自由格式，可以是序列号、发布日期或任何其他形式|
| supersedes |               | 此文档取代的 BRFC ID (或一组ID) |


对于markdown文件，建议将这些字段作为 YAML 前端内容嵌入。

对 BRFC 文档进行唯一标识是可取的。 由于没有一个中央权威机构来发布识别号码，我们选择从比特币中借鉴灵感，使用内容的散列。

基于BRFC规格技术文档的识别ID是唯一的， 由于没有一个中央权威机构来发布识别ID，我们从比特币中借鉴灵感，按照以下方式创建。

取 title、 author 和 version 元数据字段的UTF8字符串值(省略不存在的字段)，删除前导和尾随的空格(保留中间空格)，将每个值连接起来，然后将字符串重新解释为字节数组，并应用双 SHA256散列。

```
    let hash = sha256d(
      spec.title.trim() +
      (spec.author || '').trim() +
      (spec.version || '').trim()
    );
```

反转数据，转换哈希值为十六进制格式。

```
    let bitcoinDisplayHash = hash
      .reverse()
      .toString('hex');
```

得到字符串的前12个字符(也即 sha256d 值的最后6个字节)

```
    let brfcId = bitcoinDisplayHash.substring(0, 12);
```


测试案例

```
    title: BRFC Specifications
    author: andy (nChain)
    version: 1
```

得到BRFC ID: 57dd1f54fc67


```
    title: bsvalias Payment Addressing (PayTo Protocol Prefix)
    author: andy (nChain)
    version: 1
```

得到BRFC ID: 74524c4d6274


```
    title: bsvalias Integration with Simplified Payment Protocol
    author: andy (nChain)
    version: 1
```

得到BRFC ID: 0036f9b8860f

### 注意

- 任何更改，无论多么小(比如错误修复) ，都会创建一个全新的规范 id
- 不同的平台处理行尾的方式不同，不同的源代码控制和编辑软件可以在没有警告的情况下替换这些行尾。 这将导致在看似相同的文档中出现不稳定的哈希值
- 有些文件格式甚至在内容保持不变时更新元数据。 同样，这将导致在本来稳定的内容上出现不稳定的哈希值



原文发布于： [https://wiki.bsv.info/zh/BRFC%E8%A7%84%E6%A0%BC](https://wiki.bsv.info/zh/BRFC%E8%A7%84%E6%A0%BC)

使用 [NoteSV](https://note.sv) 保护您的互联网财产