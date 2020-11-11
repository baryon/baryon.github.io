---
title: 指南 - Contracts 合约
summary: 合同是使用分散的比特币系统来执行金融协议的交易。比特币合同往往可以精心设计，以尽量减少对外部代理人的依赖，比如法院系统，这大大降低了在金融交易中与未知实体打交道的风险。
date: 2020-11-01 03:00
tags:
- 比特币
- 翻译
- 比特币开发指南

---

::: info

翻译自[Contracts](https://developer.bitcoin.org/devguide/contracts.html#contracts)
内容在整理，准确性请自己确认

:::

# Contracts 合约[](https://developer.bitcoin.org/devguide/contracts.html#contracts "Permalink to this headline")

Contracts are transactions which use the decentralized Bitcoin system to enforce financial agreements. Bitcoin contracts can often be crafted to minimize dependency on outside agents, such as the court system, which significantly decreases the risk of dealing with unknown entities in financial transactions.

合同是使用分散的比特币系统来执行金融协议的交易。比特币合同往往可以精心设计，以尽量减少对外部代理人的依赖，比如法院系统，这大大降低了在金融交易中与未知实体打交道的风险。

## Introduction 引言[](https://developer.bitcoin.org/devguide/contracts.html#introduction "Permalink to this headline")

The following subsections will describe a variety of Bitcoin contracts already in use. Because contracts deal with real people, not just transactions, they are framed below in story format.

下面的小节将描述已经在使用的各种比特币合约。因为合同涉及的是真实的人，而不仅仅是交易，它们是以故事的形式构建在下面的框架中的。

Besides the contract types described below, many other contract types have been proposed. Several of them are collected on the [Contracts page](https://en.bitcoin.it/wiki/Contracts) of the Bitcoin Wiki.

除了下面描述的合同类型外，还提出了许多其他合同类型。其中一些是在比特币维基的契约页面上收集的。

## Escrow And Arbitration 第三方托管与仲裁[](https://developer.bitcoin.org/devguide/contracts.html#escrow-and-arbitration "Permalink to this headline")

Charlie-the-customer wants to buy a product from Bob-the-businessman, but neither of them trusts the other person, so they use a contract to help ensure Charlie gets his merchandise and Bob gets his payment.

顾客查理想从商人鲍勃那里购买产品，但是他们都不信任对方，所以他们利用合同来确保查理得到商品，鲍勃得到报酬。

A simple contract could say that Charlie will spend satoshis to an output which can only be spent if Charlie and Bob both sign the input spending it. That means Bob won’t get paid unless Charlie gets his merchandise, but Charlie can’t get the merchandise and keep his payment.

一个简单的合同可以说，查理将花费 satoshis 的产出，只有查理和鲍勃双方签署的投入支出它才能花。这意味着鲍勃不会得到报酬，除非查理得到他的商品，但查理不能得到商品和保持他的付款。

This simple contract isn’t much help if there’s a dispute, so Bob and Charlie enlist the help of Alice-the-arbitrator to create an [escrow contract](https://developer.bitcoin.org/glossary.html#term-Escrow-contract). Charlie spends his satoshis to an output which can only be spent if two of the three people sign the input. Now Charlie can pay Bob if everything is ok, Bob can [refund](https://developer.bitcoin.org/devguide/payment_processing.html#issuing-refunds) Charlie’s money if there’s a problem, or Alice can arbitrate and decide who should get the satoshis if there’s a dispute.

如果有争议，这个简单的合同没有多大帮助，所以 Bob 和 Charlie 在 alice-the-仲裁员的帮助下创建了一个托管合同。查理把他的钱花在一个只有三个人中的两个人签字才能使用的产品上。如果一切顺利，查理可以付钱给鲍勃; 如果有问题，鲍勃可以退钱给查理; 如果有争议，爱丽丝可以仲裁并决定谁应该得到 satoshis。

To create a multiple-signature ([multisig](https://developer.bitcoin.org/glossary.html#term-Multisig)) output, they each give the others a public key. Then Bob creates the following [P2SH multisig](https://developer.bitcoin.org/glossary.html#term-P2SH-multisig) redeem script:

为了创建多重签名(multisig)输出，它们分别为其他签名提供一个公钥。然后 Bob 创建下面的 P2SH multisig redemption 脚本:

OP_2 [A's pubkey] [B's pubkey] [C's pubkey] OP_3 OP_CHECKMULTISIG

(Opcodes to push the public keys onto the stack are not shown.)

(未显示将公钥推入堆栈的操作码。)

`OP_2` and `OP_3` push the actual numbers 2 and 3 onto the stack. `OP_2` specifies that 2 signatures are required to sign; `OP_3` specifies that 3 public keys (unhashed) are being provided. This is a 2-of-3 multisig pubkey script, more generically called a m-of-n pubkey script (where *m* is the *minimum* matching signatures required and *n* in the *number* of public keys provided).

Op2和 op3将实际的数字2和3推入堆栈。OP _ 2指定需要2个签名才能签名; OP _ 3指定提供3个公钥(无需删除) 。这是一个2/3的 multisig pubkey 脚本，通常称为 m/n pubkey 脚本(其中 m 是所需的最小匹配签名，n 是所提供的公钥数)。

Bob gives the redeem script to Charlie, who checks to make sure his public key and Alice’s public key are included. Then he hashes the redeem script to create a P2SH redeem script and pays the satoshis to it. Bob sees the payment get added to the block chain and ships the merchandise.

Bob 将赎回脚本交给 Charlie，Charlie 将进行检查以确保包含他的公钥和 Alice 的公钥。然后他对赎回脚本进行散列，创建一个 P2SH 赎回脚本，并向其支付 satoshis 费用。Bob 看到付款被添加到区块链中，然后将货物运输出去。

Unfortunately, the merchandise gets slightly damaged in transit. Charlie wants a full [refund](https://developer.bitcoin.org/devguide/payment_processing.html#issuing-refunds), but Bob thinks a 10% [refund](https://developer.bitcoin.org/devguide/payment_processing.html#issuing-refunds) is sufficient. They turn to Alice to resolve the issue. Alice asks for photo evidence from Charlie along with a copy of the redeem script Bob created and Charlie checked.

不幸的是，货物在运输途中受到轻微损坏。查理要求全额退款，但鲍勃认为10% 的退款就足够了。他们求助于爱丽丝来解决这个问题。爱丽丝要求查理提供照片证据，以及鲍勃创建的赎回脚本的副本，查理进行了检查。

After looking at the evidence, Alice thinks a 40% [refund](https://developer.bitcoin.org/devguide/payment_processing.html#issuing-refunds) is sufficient, so she creates and signs a transaction with two outputs, one that spends 60% of the satoshis to Bob’s public key and one that spends the remaining 40% to Charlie’s public key.

在看了证据之后，爱丽丝认为40% 的退款就足够了，所以她创建并签署了一个有两个输出的交易，一个是花费60% 的 satoshis 到鲍勃的公共密钥，另一个是花费剩下的40% 到查理的公共密钥。

In the signature script Alice puts her signature and a copy of the unhashed serialized redeem script that Bob created. She gives a copy of the incomplete transaction to both Bob and Charlie. Either one of them can complete it by adding his signature to create the following signature script:

在签名脚本中，爱丽丝放置了她的签名和鲍勃创建的无序序列化赎回脚本的副本。她给了鲍勃和查理一份不完整的交易记录。他们中的任何一个人都可以通过添加他的签名来创建以下签名脚本:

OP_0 [A's signature] [B's or C's signature] [serialized redeem script]

(Opcodes to push the signatures and redeem script onto the stack are not shown. `OP_0` is a workaround for an off-by-one error in the original implementation which must be preserved for compatibility. Note that the signature script must provide signatures in the same order as the corresponding public keys appear in the redeem script. See the description in [“OP_CHECKMULTISIG”](https://developer.bitcoin.org/terms.html#term-op-checkmultisig) for details.)

(没有显示将签名和回赎脚本推送到堆栈的操作码。0是一个在原始实现中为了兼容而必须保留的差一错误工具的解决方案。请注意，签名脚本必须提供与赎回脚本中相应的公钥相同顺序的签名。详情请参阅“ op_checkmultisig”中的描述。)

When the transaction is broadcast to the [network](https://developer.bitcoin.org/devguide/p2p_network.html), each peer checks the signature script against the P2SH output Charlie previously paid, ensuring that the redeem script matches the redeem script hash previously provided. Then the redeem script is evaluated, with the two signatures being used as input data. Assuming the redeem script validates, the two transaction outputs show up in Bob’s and Charlie’s wallets as spendable balances.

当事务广播到网络时，每个对等点根据之前支付的 P2SH 输出检查签名脚本，确保赎回脚本匹配之前提供的赎回脚本散列。然后计算赎回脚本，将两个签名用作输入数据。假设赎回脚本有效，两个交易输出作为可支配余额显示在 Bob 和 Charlie 的钱包中。

However, if Alice created and signed a transaction neither of them would agree to, such as spending all the satoshis to herself, Bob and Charlie can find a new arbitrator and sign a transaction spending the satoshis to another 2-of-3 multisig redeem script hash, this one including a public key from that second arbitrator. This means that Bob and Charlie never need to worry about their arbitrator stealing their money.

然而，如果爱丽丝创建并签署了一个他们都不会同意的交易，比如把所有的 satoshis 都花在自己身上，鲍勃和查理可以找到一个新的仲裁员，并签署一个用 satoshis 到另一个2/3 multisig script hash 的交易，这个交易包括第二个仲裁员的公钥。这意味着鲍勃和查理从来不需要担心他们的仲裁员偷他们的钱。

**Resource:** [BitRated](https://www.bitrated.com/) provides a multisig arbitration service interface using HTML/JavaScript on a GNU AGPL-licensed website.

资源: BitRated 提供了一个使用 GNU agpl 许可的网站上的 HTML/JavaScript 的多重信息仲裁服务接口。

## Micropayment Channel 小额支付渠道[](https://developer.bitcoin.org/devguide/contracts.html#micropayment-channel "Permalink to this headline")

Alice also works part time moderating forum posts for Bob. Every time someone posts to Bob’s busy forum, Alice skims the post to make sure it isn’t offensive or spam. Alas, Bob often forgets to pay her, so Alice demands to be paid immediately after each post she approves or rejects. Bob says he can’t do that because hundreds of small payments will cost him thousands of satoshis in transaction fees, so Alice suggests they use a [micropayment channel](https://developer.bitcoin.org/terms.html#term-micropayment-channel).

爱丽丝还兼职为鲍勃主持论坛帖子。每次有人在 Bob 繁忙的论坛上发帖，Alice 都会删除帖子，以确保它不是冒犯性的或垃圾邮件。唉，鲍勃经常忘记付钱给她，所以爱丽丝要求在她批准或拒绝每个帖子后立即付钱给她。鲍勃说他不能这么做，因为数以百计的小额支付会花费他数以千计的交易费，所以爱丽丝建议他们使用微支付渠道。

Bob asks Alice for her public key and then creates two transactions. The first transaction pays 100 millibitcoins to a P2SH output whose 2-of-2 multisig redeem script requires signatures from both Alice and Bob. This is the bond transaction. Broadcasting this transaction would let Alice hold the millibitcoins hostage, so Bob keeps this transaction private for now and creates a second transaction.

Bob 向 Alice 请求公钥，然后创建两个事务。第一笔交易支付100毫比特币给一个 P2SH 输出，该输出的2/2 multisig 赎回脚本需要 Alice 和 Bob 的签名。这是债券交易。广播这个交易会让 Alice 持有这些毫比特币，所以 Bob 暂时保持这个交易的私有性并创建第二个交易。

The second transaction spends all of the first transaction’s millibitcoins (minus a transaction fee) back to Bob after a 24 hour delay enforced by locktime. This is the [refund](https://developer.bitcoin.org/devguide/payment_processing.html#issuing-refunds) transaction. Bob can’t sign the [refund](https://developer.bitcoin.org/devguide/payment_processing.html#issuing-refunds) transaction by himself, so he gives it to Alice to sign, as shown in the illustration below.

第二笔交易在锁定时间延迟24小时之后，将第一笔交易的所有毫比特币(减去交易费)返还给 Bob。这是退款交易。鲍勃自己不能签署退款交易，所以他把它交给爱丽丝签署，如下图所示。

![Micropayment Channel Example](https://developer.bitcoin.org/_images/en-micropayment-channel.svg)

Micropayment Channel Example[](https://developer.bitcoin.org/devguide/contracts.html#id1 "Permalink to this image")

小额支付渠道例子

Alice checks that the [refund](https://developer.bitcoin.org/devguide/payment_processing.html#issuing-refunds) transaction’s locktime is 24 hours in the future, signs it, and gives a copy of it back to Bob. She then asks Bob for the bond transaction and checks that the [refund](https://developer.bitcoin.org/devguide/payment_processing.html#issuing-refunds) transaction spends the output of the bond transaction. She can now broadcast the bond transaction to the [network](https://developer.bitcoin.org/devguide/p2p_network.html) to ensure Bob has to wait for the time lock to expire before further spending his millibitcoins. Bob hasn’t actually spent anything so far, except possibly a small transaction fee, and he’ll be able to broadcast the [refund](https://developer.bitcoin.org/devguide/payment_processing.html#issuing-refunds) transaction in 24 hours for a full [refund](https://developer.bitcoin.org/devguide/payment_processing.html#issuing-refunds).

爱丽丝检查退款交易的锁定时间是未来的24小时，然后签名，并将副本交还给鲍勃。然后她要求鲍勃进行债券交易，并检查退款交易是否花掉了债券交易的输出。她现在可以将债券交易广播到网络上，以确保鲍勃必须等到时间锁过期后才能继续花费他的数百万比特币。到目前为止，鲍勃实际上还没有花费任何东西，除了一小笔交易费，他可以在24小时内播放全额退款交易。

Now, when Alice does some work worth 1 millibitcoin, she asks Bob to create and sign a new version of the [refund](https://developer.bitcoin.org/devguide/payment_processing.html#issuing-refunds) transaction. Version two of the transaction spends 1 millibitcoin to Alice and the other 99 back to Bob; it does not have a locktime, so Alice can sign it and spend it whenever she wants. (But she doesn’t do that immediately.)

现在，当爱丽丝做一些价值1毫比特币的工作时，她要求鲍勃创建并签署一个新版本的退款交易。第二个版本的交易花费1毫比特币给爱丽丝，另外99毫比特币返还给鲍勃; 它没有锁定时间，所以爱丽丝可以随时签署和花费它。(但她不会马上这么做。)

Alice and Bob repeat these work-and-pay steps until Alice finishes for the day, or until the time lock is about to expire. Alice signs the final version of the [refund](https://developer.bitcoin.org/devguide/payment_processing.html#issuing-refunds) transaction and broadcasts it, paying herself and refunding any remaining balance to Bob. The next day, when Alice starts work, they create a new [micropayment channel](https://developer.bitcoin.org/terms.html#term-micropayment-channel).

Alice 和 Bob 重复这些“工作-付费”步骤，直到 Alice 完成当天的工作，或者直到时间锁即将过期。爱丽丝签署了最终版本的退款交易，并广播它，支付自己和退还任何剩余余额鲍勃。第二天，当爱丽丝开始工作时，他们创建了一个新的微支付渠道。

If Alice fails to broadcast a version of the [refund](https://developer.bitcoin.org/devguide/payment_processing.html#issuing-refunds) transaction before its time lock expires, Bob can broadcast the first version and receive a full [refund](https://developer.bitcoin.org/devguide/payment_processing.html#issuing-refunds). This is one reason [micropayment channels](https://developer.bitcoin.org/terms.html#term-micropayment-channel) are best suited to small payments—if Alice’s Internet service goes out for a few hours near the time lock expiry, she could be cheated out of her payment.

如果 Alice 未能在退款交易的时间锁到期前播放该版本，Bob 可以播放第一个版本并获得全额退款。这就是为什么小额支付渠道最适合小额支付的原因之一ーー如果 Alice 的互联网服务在时间锁到期前停止服务几个小时，她可能会被骗走她的支付。

Transaction malleability, discussed above in the Transactions section, is another reason to limit the value of [micropayment channels](https://developer.bitcoin.org/terms.html#term-micropayment-channel). If someone uses transaction malleability to break the link between the two transactions, Alice could hold Bob’s 100 millibitcoins hostage even if she hadn’t done any work.

事务的可塑性(在上面的 Transactions 部分中讨论)是限制微支付通道价值的另一个原因。如果有人利用交易的延展性来切断两个交易之间的联系，那么即使 Alice 没有做任何工作，她也可以用 Bob 的100毫比特币作为抵押。

For larger payments, Bitcoin transaction fees are very low as a percentage of the total transaction value, so it makes more sense to protect payments with immediately-broadcast separate transactions.

对于大额支付，比特币交易费用在总交易额中所占的百分比非常低，因此，通过立即广播的单独交易来保护支付更有意义。

**Resource:** The [bitcoinj](http://bitcoinj.github.io/) Java library provides a complete set of micropayment functions, an example implementation, and [a tutorial](https://bitcoinj.github.io/working-with-micropayments) all under an Apache license.

资源: bitcoinj Java 库提供了一套完整的微支付函数、一个示例实现和一个教程，所有这些都使用 Apache 许可。

## CoinJoin 硬币连接[](https://developer.bitcoin.org/devguide/contracts.html#coinjoin "Permalink to this headline")

Alice is concerned about her privacy. She knows every transaction gets added to the public block chain, so when Bob and Charlie pay her, they can each easily track those satoshis to learn what Bitcoin addresses she pays, how much she pays them, and possibly how many satoshis she has left.

爱丽丝关心她的隐私。她知道每笔交易都会被添加到公共区块链中，所以当鲍勃和查理付钱给她时，他们可以很容易地追踪那些 satoshis，了解她付了多少比特币地址，付了多少钱，可能还剩下多少 satoshis。

Alice isn’t a criminal, she just wants plausible deniability about where she has spent her satoshis and how many she has left, so she starts up the Tor anonymity service on her computer and logs into an IRC chatroom as “AnonGirl.”

爱丽丝不是罪犯，她只是想知道她在哪里度过了她的似是而非的否认，她还剩下多少，所以她在自己的电脑上启动了 Tor 匿名服务，并登录到 IRC 聊天室成为“ AnonGirl”

Also in the chatroom are “Nemo” and “Neminem.” They collectively agree to transfer satoshis between each other so no one besides them can reliably determine who controls which satoshis. But they’re faced with a dilemma: who transfers their satoshis to one of the other two pseudonymous persons first? The CoinJoin-style contract, shown in the illustration below, makes this decision easy: they create a single transaction which does all of the spending simultaneously, ensuring none of them can steal the others’ satoshis.

聊天室里还有“ Nemo”和“ Neminem”他们集体同意在彼此之间转移 satoshis，这样除了他们之外没有人能够可靠地决定谁控制哪个 satoshis。但是他们面临着一个困境: 谁先把他们的 satoshis 转移给另外两个化名的人之一？如下图所示的 coinjoin 风格的合同使得这个决定变得容易: 他们创建一个单一的交易，同时进行所有的支出，确保没有人能够窃取其他人的 satoshis。

![Example CoinJoin Transaction](https://developer.bitcoin.org/_images/en-coinjoin.svg)

Example CoinJoin Transaction[](https://developer.bitcoin.org/devguide/contracts.html#id2 "Permalink to this image")

CoinJoin 事务示例

Each contributor looks through their collection of Unspent Transaction Outputs (UTXOs) for 100 millibitcoins they can spend. They then each generate a brand new public key and give UTXO details and pubkey hashes to the facilitator. In this case, the facilitator is AnonGirl; she creates a transaction spending each of the UTXOs to three equally-sized outputs. One output goes to each of the contributors’ pubkey hashes.

每个贡献者通过他们收集的未用交易输出(UTXOs)查找他们可以花费的100毫比特币。然后，他们每个人都生成一个全新的公钥，并将 UTXO 的详细信息和 pubkey 散列提供给服务提供者。在这种情况下，主持人是 AnonGirl; 她创建一个事务支出 UTXOs 的每一个到三个同样大小的输出。每个贡献者的 pubkey 散列有一个输出。

AnonGirl then signs her inputs using `SIGHASH_ALL` to ensure nobody can change the input or output details. She gives the partially-signed transaction to Nemo who signs his inputs the same way and passes it to Neminem, who also signs it the same way. Neminem then broadcasts the transaction to the Bitcoin [peer-to-peer network](https://developer.bitcoin.org/devguide/p2p_network.html), mixing all of the millibitcoins in a single transaction.

然后，AnonGirl 使用 SIGHASH _ all 签名她的输入，以确保没有人能够更改输入或输出的细节。她将部分签名的交易交给 Nemo，后者以同样的方式在输入上签名，然后传递给 Neminem，后者也以同样的方式签名。然后 Neminem 将交易广播到比特币对等网络，将所有的毫比特币混合在一个交易中。

As you can see in the illustration, there’s no way for anyone besides AnonGirl, Nemo, and Neminem to confidently determine who received which output, so they can each spend their output with plausible deniability.

正如你在图中看到的，除了 AnonGirl、 Nemo 和 Neminem 之外，没有人能够自信地确定谁获得了哪些产出，所以他们可以把他们的产出花在似是而非的否认上。

Now when Bob or Charlie try to track Alice’s transactions through the block chain, they’ll also see transactions made by Nemo and Neminem. If Alice does a few more CoinJoins, Bob and Charlie might have to guess which transactions made by dozens or hundreds of people were actually made by Alice.

现在，当 Bob 或 Charlie 试图通过块链跟踪 Alice 的交易时，他们也会看到 Nemo 和 Neminem 的交易。如果 Alice 再做几个 coinjoin，Bob 和 Charlie 可能要猜测几十个或几百个人做的哪些交易实际上是 Alice 做的。

The complete history of Alice’s satoshis is still in the block chain, so a determined investigator could talk to the people AnonGirl CoinJoined with to find out the ultimate origin of her satoshis and possibly reveal AnonGirl as Alice. But against anyone casually browsing block chain history, Alice gains plausible deniability.

的 satoshis 的完整历史仍然是在块链，所以一个坚定的调查者可以与 AnonGirl coin 加入的人谈话，找出她 satoshis 的最终来源，并可能揭示 AnonGirl 作为 Alice。但是，相对于任何随意浏览块链历史的人，Alice 获得了似是而非的否认。

The CoinJoin technique described above costs the participants a small amount of satoshis to pay the transaction fee. An alternative technique, purchaser CoinJoin, can actually save them satoshis and improve their privacy at the same time.

上面描述的硬币连接技术需要参与者支付少量的交易费用。另一种技术，购买者硬币连接，实际上可以保存他们 satoshis 和改善他们的隐私在同一时间。

AnonGirl waits in the IRC chatroom until she wants to make a purchase. She announces her intention to spend satoshis and waits until someone else wants to make a purchase, likely from a different merchant. Then they combine their inputs the same way as before but set the outputs to the separate merchant addresses so nobody will be able to figure out solely from block chain history which one of them bought what from the merchants.

AnonGirl 在 IRC 聊天室等待，直到她想要购买。她宣布打算花掉 satoshis，并等待其他人购买，可能是从另一个商人那里购买。然后他们以同样的方式组合他们的输入，但是把输出设置为独立的商家地址，这样没有人能够单独从区块链的历史中找出他们中的哪一个从商家那里购买了什么。

Since they would’ve had to pay a transaction fee to make their purchases anyway, AnonGirl and her co-spenders don’t pay anything extra—but because they reduced overhead by combining multiple transactions, saving bytes, they may be able to pay a smaller aggregate transaction fee, saving each one of them a tiny amount of satoshis.

由于他们无论如何都要支付一笔交易费，AnonGirl 和她的合伙人不需要额外支付任何费用ーー但由于他们通过合并多笔交易减少了管理费用，节省了字节，他们也许可以支付一笔较小的总交易费用，为每个人节省一点 satoshis。

**Current Working Implementations:** As of today, in 2018, [JoinMarket](https://github.com/JoinMarket-Org/) and [Wasabi Wallet](http://wasabiwallet.io/) are the operational CoinJoin implementations for Bitcoin.

目前的工作实现: 截至今天，在2018年，JoinMarket 和 Wasabi Wallet 是可操作的 CoinJoin 实现的比特币。

JoinMarket style CoinJoins differ from the above described scheme by splitting the participants into two sections: market makers and market takers. Market makers are publishing their CoinJoin intentions to an IRC room and waiting for market takers to take their offers. When a taker comes along, it selects a set of makers and creates a shared transaction with them, while also paying a small fee. Unlike the above described scheme, this happens automatically.

JoinMarket 风格的 coinjoin 不同于上述方案，它将参与者分为两部分: 做市商和做市商。做市商将他们的钱加入意向发布到 IRC 聊天室，等待市场接受者接受他们的提议。当一个接受者出现时，它选择一组制造者，与他们共同进行交易，同时也支付少量费用。与上面描述的方案不同，这是自动发生的。

Wasabi Wallet style CoinJoins are called Chaumian CoinJoins. It employs a CoinJoin coordinator, where various peers can register. When the pre-defined number of participants registered, a CoinJoin-round kicks in. In this scheme Chaumian Blind Signatures are utilized to prevent the coordinator and the peers from learning which outputs correspond to which inputs. An example for Chaumian CoinJoin is the following transaction: [8fee07b90f26e85e22e87da13e1618cd9eeaf98f3f3774273c9307cd40ff98e8](https://www.smartbit.com.au/tx/8fee07b90f26e85e22e87da13e1618cd9eeaf98f3f3774273c9307cd40ff98e8)

山葵钱包风格的硬币联接被称为 Chaumian 硬币联接。它采用了一个 CoinJoin 协调器，各种对等点可以注册。当预先确定的参与者人数被记录下来时，一个 CoinJoin-round 就开始了。在这个方案中，Chaumian 盲签名被用来防止协调器和对等点学习哪些输出对应哪些输入。Chaumian CoinJoin 的一个例子是以下交易: 8fe07b90f26e85e22e87da13e1618cd9eeaf98f3f3774273c9307cd40ff98e8
