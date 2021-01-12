(window.webpackJsonp=window.webpackJsonp||[]).push([[55],{593:function(t,s,a){"use strict";a.r(s);var n=a(8),e=Object(n.a)({},(function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("p",[t._v("sCrypt是比特币合约走出来的第一步。我们看看sCrypt用到的基础知识：原像PreImage")]),t._v(" "),a("p",[t._v("对数据签名，获取的sig叫签名，生成这个签名的原始数据就叫做：原像PreImage")]),t._v(" "),a("p",[t._v("在"),a("a",{attrs:{href:"https://blog.csdn.net/weixin_47461167/article/details/108368848",target:"_blank",rel:"noopener noreferrer"}},[t._v("P2PKH合约"),a("OutboundLink")],1),t._v("中解锁一个锁定脚本的关键是要提供sig和公钥pk，有了pk和sig以及"),a("code",[t._v("交易本身")]),t._v("，比特币节点通过"),a("code",[t._v("OP_CHECKSIG")]),t._v("操作符进行检查，看检查结果是否为True，交易是否有效。")]),t._v(" "),a("p",[t._v("在sCrypt中检查原像的合约代码是")]),t._v(" "),a("div",{staticClass:"language-javascript extra-class"},[a("pre",{pre:!0,attrs:{class:"language-javascript"}},[a("code",[t._v("  "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("testPreimageParsing")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("bytes preimage")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("require")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("Tx"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("checkPreimage")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("preimage"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    bytes preimage_ "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" Util"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("nVersion")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("preimage"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),t._v(" Util"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("hashPrevouts")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("preimage"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),t._v(" Util"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("hashSequence")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("preimage"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),t._v("\n    Util"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("outpoint")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("preimage"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),t._v(" Util"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("writeVarint")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("Util"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("scriptCode")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("preimage"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),t._v(" Util"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("valueRaw")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("preimage"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),t._v("\n    Util"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("nSequenceRaw")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("preimage"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),t._v(" Util"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("hashOutputs")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("preimage"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),t._v(" Util"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("nLocktimeRaw")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("preimage"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),t._v(" Util"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("sigHashType")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("preimage"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("require")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("preimage "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("==")]),t._v(" preimage_"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),a("p",[t._v("原像preimage作为解锁参数。")]),t._v(" "),a("p",[t._v("让人迷惑的是"),a("code",[t._v("OP_CHECKSIG")]),t._v("操作的时候，"),a("code",[t._v("交易本身")]),t._v("当然可以知道。但sCrypt中却在交易构建的过程中就拿到了sig的原像Preimage， 作为解锁参数。这说明"),a("code",[t._v("交易本身")]),t._v("并不等于原像Preimage， "),a("code",[t._v("OP_CHECKSIG")]),t._v("操作的时候对"),a("code",[t._v("交易本身")]),t._v("做了处理，抽出了一部分内容，这些内容是在构造交易之前就可以获得的。原像就是由交易的某些部分构成。这些组合部分从上面的合约代码就可以看出。")]),t._v(" "),a("p",[a("a",{attrs:{href:"https://github.com/bitcoin-sv/bitcoin-sv/blob/master/doc/abc/replay-protected-sighash.md",target:"_blank",rel:"noopener noreferrer"}},[t._v("原始资料"),a("OutboundLink")],1),t._v("说明原像是由下面的部分构成的")]),t._v(" "),a("blockquote",[a("ol",[a("li",[t._v("交易版本 (4个字节）")]),t._v(" "),a("li",[t._v("hashPrevouts (输入outpoint的哈希32字节哈希)")]),t._v(" "),a("li",[t._v("hashSequence  (输入sequence的哈希32字节哈希)")]),t._v(" "),a("li",[t._v("当前输入outpoint (32字节txid + 4字节位置)")]),t._v(" "),a("li",[t._v("当前输入的锁定脚本（Varint格式)")]),t._v(" "),a("li",[t._v("从当前输入所花费的satoshi(8字节)")]),t._v(" "),a("li",[t._v("当前输入的 nSequence (4字节)")]),t._v(" "),a("li",[t._v("hashOutputs (输出的satoshi+输出脚本组合的32字节哈希)")]),t._v(" "),a("li",[t._v("交易的nLocktime (4字节）")]),t._v(" "),a("li",[t._v("签名的类型(4字节)")])])]),t._v(" "),a("p",[t._v("其中第2,3,8项同第10项的签名类型有关。4到7项同当前输入有关，输入的锁定脚本作为第5项。第2项同所有输入有关，第8项同所有输出有关。")]),t._v(" "),a("p",[t._v("注意⚠️这个原像的构造在2017年比特币升级时做了修改。2017年之前的版本有所不同。")]),t._v(" "),a("p",[t._v("原像的基础知识对比特币上的Token非常重要，有了它才有了"),a("code",[t._v("OP_PUSH_TX")]),t._v("\n下一篇文章，我们打开"),a("code",[t._v("OP_PUSH_TX")]),t._v("看看里面是什么。")]),t._v(" "),a("blockquote",[a("p",[t._v("享受比特币带来的安全自由， 关注使用"),a("a",{attrs:{href:"https://note.sv",target:"_blank",rel:"noopener noreferrer"}},[t._v("NoteSV"),a("OutboundLink")],1)])])])}),[],!1,null,null,null);s.default=e.exports}}]);