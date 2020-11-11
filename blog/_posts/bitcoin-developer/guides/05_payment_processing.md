---
title: 指南 - Payment Processing 付款程序
summary: 支付处理包括消费者和接收者执行的步骤，以支付和接受产品或服务的交换。自从商业诞生以来，基本的步骤没有改变，但是技术已经改变了。
date: 2020-11-01 05:00
tags:
- 比特币
- 翻译
- 比特币开发指南

---

::: info

翻译自[Payment Processing](https://developer.bitcoin.org/devguide/payment_processing.html#payment-processing)
内容在整理，准确性请自己确认

:::

# Payment Processing 付款程序[](https://developer.bitcoin.org/devguide/payment_processing.html#payment-processing "Permalink to this headline")

Payment processing encompasses the steps spenders and receivers perform to make and accept payments in exchange for products or services. The basic steps have not changed since the dawn of commerce, but the technology has.

支付处理包括消费者和接收者执行的步骤，以支付和接受产品或服务的交换。自从商业诞生以来，基本的步骤没有改变，但是技术已经改变了。

## Introduction 引言[](https://developer.bitcoin.org/devguide/payment_processing.html#introduction "Permalink to this headline")

This section will explain how receivers and spenders can, respectively, request and make payments using Bitcoin—and how they can deal with complications such as [refunds](https://developer.bitcoin.org/devguide/payment_processing.html#issuing-refunds) and [recurrent rebilling](https://developer.bitcoin.org/devguide/payment_processing.html#rebilling-recurring-payments).

本节将解释接受者和消费者如何分别使用比特币申请和支付，以及如何处理退款和反复退款等复杂问题。

![Bitcoin Payment Processing](https://developer.bitcoin.org/_images/en-payment-processing.svg)

Bitcoin Payment Processing[](https://developer.bitcoin.org/devguide/payment_processing.html#id1 "Permalink to this image")

比特币支付处理

The figure above illustrates payment processing using Bitcoin from a receiver’s perspective, starting with a new order. The following subsections will each address the three common steps and the three occasional or optional steps.

上面的图表从接收者的角度说明了使用比特币的支付过程，从一个新的订单开始。下面的小节将分别介绍三个常见步骤和三个偶尔的或可选的步骤。

It is worth mentioning that each of these steps can be outsourced by using third party APIs and services.

值得一提的是，每个步骤都可以通过使用第三方 api 和服务来外包。

## Pricing Orders 价格订单[](https://developer.bitcoin.org/devguide/payment_processing.html#pricing-orders "Permalink to this headline")

Because of exchange rate variability between satoshis and national currencies ([fiat](https://developer.bitcoin.org/terms.html#term-fiat)), many Bitcoin orders are priced in [fiat](https://developer.bitcoin.org/terms.html#term-fiat) but paid in satoshis, necessitating a price conversion.

由于 satoshis 和各国货币(法定货币)之间的汇率波动，许多比特币订单以法定价格计价，但以 satoshis 支付，因此必须进行价格转换。

Exchange rate data is widely available through HTTP-based APIs provided by currency exchanges. Several organizations also aggregate data from multiple exchanges to create index prices, which are also available using HTTP-based APIs.

汇率数据可以通过货币交换提供的基于 http 的 api 广泛获得。一些组织还聚合来自多个交易所的数据来创建索引价格，这些索引价格也可以使用基于 http 的 api。

Any applications which automatically calculate order totals using exchange rate data must take steps to ensure the price quoted reflects the current general market value of satoshis, or the applications could accept too few satoshis for the product or service being sold. Alternatively, they could ask for too many satoshis, driving away potential spenders.

任何使用汇率数据自动计算订单总量的应用程序都必须采取措施，确保报价反映 satoshis 当前的总体市场价值，否则应用程序可能会接受太少的 satoshis 用于销售产品或服务。或者，他们可以要求太多的 satoshis，赶走潜在的消费者。

To minimize problems, your applications may want to collect data from at least two separate sources and compare them to see how much they differ. If the difference is substantial, your applications can enter a safe mode until a human is able to evaluate the situation.

为了最小化问题，您的应用程序可能需要从至少两个不同的源收集数据，并比较它们以查看它们之间的差异。如果差异很大，那么您的应用程序可以进入安全模式，直到人类能够评估情况。

You may also want to program your applications to enter a safe mode if exchange rates are rapidly increasing or decreasing, indicating a possible problem in the Bitcoin market which could make it difficult to spend any satoshis received today.

如果比特币兑换率快速上升或下降，你可能还需要为应用程序编写程序，使其进入安全模式，这表明比特币市场可能存在一个问题，可能导致今天收到的任何 satoshis 都难以使用。

Exchange rates lie outside the control of Bitcoin and related technologies, so there are no new or planned technologies which will make it significantly easier for your program to correctly convert order totals from [fiat](https://developer.bitcoin.org/terms.html#term-fiat)into satoshis.

比特币和相关技术无法控制汇率，因此没有新的或计划中的技术可以让你的程序更容易地将订单总量从菲亚特正确地转换为 satoshis。

Because the exchange rate fluctuates over time, order totals pegged to [fiat](https://developer.bitcoin.org/terms.html#term-fiat) must expire to prevent spenders from delaying payment in the hope that satoshis will drop in price. Most widely-used payment processing systems currently expire their invoices after 10 to 20 minutes.

由于汇率随着时间的推移而波动，订单总额必须与菲亚特挂钩，以防止消费者推迟付款，希望 satoshis 会降价。目前，大多数广泛使用的付款处理系统的发票在10至20分钟后到期。

Shorter expiration periods increase the chance the invoice will expire before payment is received, possibly necessitating manual intervention to request an additional payment or to issue a [refund](https://developer.bitcoin.org/devguide/payment_processing.html#issuing-refunds). Longer expiration periods increase the chance that the exchange rate will fluctuate a significant amount before payment is received.

较短的到期时间增加了发票在收到付款之前到期的可能性，可能需要人工干预以要求额外付款或发出退款。较长的到期期限增加了汇率在收到付款之前大幅波动的可能性。

## Requesting Payments 要求付款[](https://developer.bitcoin.org/devguide/payment_processing.html#requesting-payments "Permalink to this headline")

Before requesting payment, your application must create a Bitcoin address, or acquire an address from another program such as Bitcoin Core. Bitcoin addresses are described in detail in the [Transactions](https://developer.bitcoin.org/devguide/transactions.html) guide. Also described in that section are two important reasons to avoid using an address more than once—but a third reason applies especially to payment requests:

在请求支付之前，您的应用程序必须创建一个比特币地址，或者从另一个程序(如 Bitcoin Core)获取一个地址。比特币地址在交易指南中有详细描述。本节还介绍了避免多次使用地址的两个重要原因，但第三个原因尤其适用于付款请求:

Using a separate address for each incoming payment makes it trivial to determine which customers have paid their payment requests. Your applications need only track the association between a particular payment request and the address used in it, and then scan the block chain for transactions matching that address.

使用一个单独的地址为每个收到的付款使它的琐碎，以确定哪些客户已经支付他们的付款请求。您的应用程序只需跟踪特定支付请求与其中使用的地址之间的关联，然后扫描块链，寻找与该地址匹配的交易。

The next subsections will describe in detail the following four compatible ways to give the spender the address and amount to be paid. For increased convenience and compatibility, providing all of these options in your payment requests is recommended.

接下来的小节将详细描述以下四种可兼容的方法，以便给出消费者地址和应支付的金额。为了增加方便性和兼容性，建议在您的付款请求中提供所有这些选项。

1. All wallet software lets its users paste in or manually enter an address and amount into a payment screen. This is, of course, inconvenient—but it makes an effective fallback option.
   
   所有钱包软件都允许用户粘贴或手动输入地址和金额到支付屏幕上。这当然不方便，但却是一个有效的备选方案。

2. Almost all desktop wallets can associate with [“bitcoin:” URIs](https://developer.bitcoin.org/terms.html#term-bitcoin-uri), so spenders can click a link to pre-fill the payment screen. This also works with many mobile wallets, but it generally does not work with web-based wallets unless the spender installs a browser extension or manually configures a URI handler.
   
   几乎所有的桌面钱包都可以与“比特币: ” uri 关联，因此消费者可以点击一个链接来预填充支付屏幕。这也适用于许多移动钱包，但它通常不适用于基于 web 的钱包，除非花钱的人安装了浏览器扩展或手动配置 URI 处理程序。

3. Most mobile wallets support scanning [“bitcoin:” URIs](https://developer.bitcoin.org/terms.html#term-bitcoin-uri) encoded in a QR code, and almost all wallets can display them for accepting payment. While also handy for online orders, QR Codes are especially useful for in-person purchases.
   
   大多数移动钱包支持扫描“比特币: ” uri 编码在二维码中，并且几乎所有钱包都可以显示它们来接受支付。二维码对于在线订购也很方便，对于亲自购物尤其有用。

4. Recent wallet updates add support for the new payment protocol providing increased security, authentication of a receiver’s identity using [X.509](https://en.wikipedia.org/wiki/X.509) certificates, and other important features such as [refunds](https://developer.bitcoin.org/devguide/payment_processing.html#issuing-refunds).
   
   最近的钱包更新增加了对新支付协议的支持，提供了更高的安全性、使用 x. 509证书验证接收方的身份，以及其他重要特性，如退款。

![Warning icon](https://developer.bitcoin.org/_images/icon_warning.svg) **Warning:** Special care must be taken to avoid the theft of incoming payments. In particular, private keys should not be stored on web servers, and payment requests should be sent over HTTPS or other secure methods to prevent [man-in-the-middle](https://en.wikipedia.org/wiki/Man-in-the-middle_attack) attacks from replacing your Bitcoin address with the attacker’s address.

警告: 必须特别小心，以避免盗窃收到的付款。特别是，私人密码匙不应储存在网上伺服器上，而支付要求应透过 HTTPS 或其他安全方法发送，以防止中间人攻击以攻击者的地址取代你的比特币地址。

### Plain Text 纯文本[](https://developer.bitcoin.org/devguide/payment_processing.html#plain-text "Permalink to this headline")

To specify an amount directly for copying and pasting, you must provide the address, the amount, and the denomination. An expiration time for the offer may also be specified. For example:

若要指定直接用于复制和粘贴的金额，必须提供地址、金额和面额。也可以规定要约的有效期。例如:

(Note: all examples in this section use testnet addresses.)

(注意: 本节中的所有示例都使用 testnet 地址。)

Pay: mjSk1Ny9spzU2fouzYgLqGUD8U41iR35QN
Amount: 100 BTC
You must pay by: 2014-04-01 at 23:00 UTC

Indicating the denomination is critical. As of this writing, popular Bitcoin wallet software defaults to denominating amounts in either bitcoins (BTC) , millibitcoins (mBTC) or microbitcoins (uBTC, “bits”). Choosing between each unit is widely supported, but other software also lets its users select denomination amounts from some preselected (e.g. Table below) or all [standard 8 decimal places](https://en.bitcoin.it/wiki/Units):

表明面额是至关重要的。截至本文撰写之时，流行的比特币钱包软件默认以比特币(BTC)、毫比特币(mBTC)或微比特币(uBTC，“ bits”)的数额来计值。人们普遍支持在每个单位之间进行选择，但其他软件也允许用户从某些预先选定的单位(例如下表)或所有标准的小数点后8位中选择金额:

| Bitcoins比特币 | Unit (Abbreviation)单位(缩写)                     |
| ----------- | --------------------------------------------- |
| 1.0         | bitcoin (BTC)比特币(BTC)                         |
| 0.01        | bitcent (cBTC)位分(cBTC)                        |
| 0.001       | millibitcoin (mBTC)毫比特币(mBTC)                 |
| 0.000001    | microbitcoin (uBTC, “bits”)微比特币(uBTC，“ bits”) |
| 0.0000001   | finney芬尼                                      |
| 0.00000001  | satoshi智史                                     |

### bitcoin: URI 比特币: URI[](https://developer.bitcoin.org/devguide/payment_processing.html#bitcoin-uri "Permalink to this headline")

The [“bitcoin:” URI](https://developer.bitcoin.org/terms.html#term-bitcoin-uri) scheme defined in [BIP21](https://github.com/bitcoin/bips/blob/master/bip-0021.mediawiki) eliminates denomination confusion and saves the spender from copying and pasting two separate values. It also lets the payment request provide some additional information to the spender. An example:

在 BIP21中定义的“ bitcoin: ” URI 方案消除了面值混淆，并节省了花钱者复制和粘贴两个单独的值。它还允许支付请求向消费者提供一些额外的信息。举个例子:

bitcoin:mjSk1Ny9spzU2fouzYgLqGUD8U41iR35QN?amount=100

Only the address is required, and if it is the only thing specified, wallets will pre-fill a payment request with it and let the spender enter an amount. The amount specified is always in decimal bitcoins (BTC).

只有地址是必需的，如果它是唯一指定的事情，钱包将预先填写一个付款请求，让消费者进入一个金额。指定的数量始终以十进制比特币(BTC)表示。

Two other parameters are widely supported. The [“label”](https://developer.bitcoin.org/terms.html#term-label) parameter is generally used to provide wallet software with the recipient’s name. The [“message”](https://developer.bitcoin.org/terms.html#term-message) parameter is generally used to describe the payment request to the spender. Both the label and the message are commonly stored by the spender’s wallet software—but they are never added to the actual transaction, so other Bitcoin users cannot see them. Both the label and the message must be [URI encoded](https://tools.ietf.org/html/rfc3986).

另外两个参数得到了广泛的支持。“ label”参数通常用于提供带有收件人姓名的钱包软件。“ message”参数通常用于向消费者描述支付请求。比特币的标签和信息通常都存储在比特币消费者的钱包软件中，但它们从未添加到实际交易中，因此其他比特币用户无法看到它们。标签和消息都必须是 URI 编码的。

All four parameters used together, with appropriate URI encoding, can be seen in the line-wrapped example below.

在下面的换行示例中，可以看到所有四个参数一起使用，并带有适当的 URI 编码。

bitcoin:mjSk1Ny9spzU2fouzYgLqGUD8U41iR35QN\
?amount=0.10\
&label=Example+Merchant\
&message=Order+of+flowers+%26+chocolates

The URI scheme can be extended, as will be seen in the payment protocol section below, with both new optional and required parameters. As of this writing, the only widely-used parameter besides the four described above is the payment protocol’s [“r”](https://developer.bitcoin.org/terms.html#term-r-parameter) parameter.

URI 方案可以通过新的可选参数和必需参数进行扩展，如下面的支付协议部分所示。在撰写本文时，除了上述四个参数之外，唯一广泛使用的参数是支付协议的“ r”参数。

Programs accepting URIs in any form must ask the user for permission before paying unless the user has explicitly disabled prompting (as might be the case for micropayments).

接受任何形式 uri 的程序在付费之前必须征得用户的许可，除非用户已经明确禁用了提示(例如微支付)。

### QR Codes 二维码[](https://developer.bitcoin.org/devguide/payment_processing.html#qr-codes "Permalink to this headline")

QR codes are a popular way to exchange [“bitcoin:” URIs](https://developer.bitcoin.org/terms.html#term-bitcoin-uri) in person, in images, or in videos. Most mobile Bitcoin wallet apps, and some desktop wallets, support scanning QR codes to pre-fill their payment screens.

二维码是一种流行的方式来交换“比特币: ” uri 面对面，在图像，或在视频。大多数移动比特币钱包应用程序和一些桌面钱包支持扫描二维码来预填充他们的支付屏幕。

The figure below shows the same [“bitcoin:” URI](https://developer.bitcoin.org/terms.html#term-bitcoin-uri) code encoded as four different [Bitcoin QR codes](https://developer.bitcoin.org/terms.html#term-uri-qr-code) at four different error correction levels. The QR code can include the [“label”](https://developer.bitcoin.org/terms.html#term-label) and [“message”](https://developer.bitcoin.org/terms.html#term-message) parameters—and any other optional parameters—but they were omitted here to keep the QR code small and easy to scan with unsteady or low-resolution mobile cameras.

下图显示了相同的“比特币: ” URI 代码编码为四个不同的比特币二维码在四个不同的错误纠正水平。QR 码可以包括“标签”和“信息”参数以及其他任何可选参数，但是这里省略了这些参数，以保证 QR 码很小，并且很容易被不稳定或低分辨率的移动相机扫描。

![Bitcoin QR Codes](https://developer.bitcoin.org/_images/en-qr-code.svg)

Bitcoin QR Codes[](https://developer.bitcoin.org/devguide/payment_processing.html#id2 "Permalink to this image")

比特币二维码

The error correction is combined with a checksum to ensure the [Bitcoin QR code](https://developer.bitcoin.org/terms.html#term-uri-qr-code) cannot be successfully decoded with data missing or accidentally altered, so your applications should choose the appropriate level of error correction based on the space you have available to display the code. Low-level damage correction works well when space is limited, and quartile-level damage correction helps ensure fast scanning when displayed on high-resolution screens.

错误纠正与校验和相结合，以确保比特币二维码不会因为数据丢失或意外更改而被成功解码，所以你的应用程序应该根据显示代码的可用空间选择适当的错误纠正级别。低水平的损伤修正工程时，空间有限，四分位水平的损伤修正有助于确保快速扫描时显示在高分辨率屏幕上。

### Payment Protocol 付款程序[](https://developer.bitcoin.org/devguide/payment_processing.html#payment-protocol "Permalink to this headline")

![Warning icon](https://developer.bitcoin.org/_images/icon_warning.svg) **Warning:** The payment protocol is considered to be deprecated and will be removed in a later version of Bitcoin Core. The protocol has multiple security design flaws and implementation flaws in some wallets. Users will begin receiving deprecation warnings in Bitcoin Core version 0.18 when using [BIP70](https://github.com/bitcoin/bips/blob/master/bip-0070.mediawiki) URI’s. Merchants should transition away from [BIP70](https://github.com/bitcoin/bips/blob/master/bip-0070.mediawiki) to more secure options such as [BIP21](https://github.com/bitcoin/bips/blob/master/bip-0021.mediawiki). Merchants should never require [BIP70](https://github.com/bitcoin/bips/blob/master/bip-0070.mediawiki) payments and should provide [BIP21](https://github.com/bitcoin/bips/blob/master/bip-0021.mediawiki) fallbacks.

警告: 支付协议被认为是不推荐的，并将被删除在后来版本的比特币核心。该协议存在多种安全设计缺陷，部分钱包存在实现缺陷。当使用 BIP70 URI 时，用户将开始收到比特币核心0.18版本的弃用警告。商家应该从 BIP70过渡到更安全的选择，比如 BIP21。商家永远不应该要求 BIP70支付，应该提供 BIP21备用。

Bitcoin Core 0.9 supports the new [payment protocol](https://developer.bitcoin.org/glossary.html#term-Payment-protocol). The payment protocol adds many important features to payment requests:

比特币核心0.9支持新的支付协议。支付协议为支付请求增加了许多重要功能:

- Supports [X.509](https://en.wikipedia.org/wiki/X.509) certificates and SSL encryption to verify receivers’ identity and help prevent [man-in-the-middle](https://en.wikipedia.org/wiki/Man-in-the-middle_attack) attacks.
  
  支持 x. 509证书和 SSL 加密，以验证接收者的身份，并帮助防止中间人攻击。

- Provides more detail about the requested payment to spenders.
  
  提供更多关于请求支付给消费者的详细信息。

- Allows spenders to submit transactions directly to receivers without going through the [peer-to-peer network](https://developer.bitcoin.org/devguide/p2p_network.html). This can speed up payment processing and work with planned features such as child-pays-for-parent transaction fees and offline NFC or Bluetooth-based payments.
  
  允许消费者直接将事务提交给接收者，而无需通过对等网络。这样可以加快支付处理速度，并且可以使用计划中的功能，比如为父母支付儿童费用的交易费用，以及基于离线 NFC 或蓝牙的支付。

Instead of being asked to pay a meaningless address, such as “mjSk1Ny9spzU2fouzYgLqGUD8U41iR35QN”, spenders are asked to pay the Common Name (CN) description from the receiver’s [X.509](https://en.wikipedia.org/wiki/X.509) certificate, such as “www.bitcoin.org”.

消费者没有被要求支付一个没有意义的地址，如“ mjSk1Ny9spzU2fouzYgLqGUD8U41iR35QN” ，而是被要求从接收人的 x. 509证书中支付通用名称(CN)描述，如“ www.bitcoin.org”。

To request payment using the payment protocol, you use an extended (but backwards-compatible) [“bitcoin:” URI](https://developer.bitcoin.org/terms.html#term-bitcoin-uri). For example:

要使用支付协议请求支付，您可以使用扩展(但向后兼容)的“ bitcoin: ” URI:

bitcoin:mjSk1Ny9spzU2fouzYgLqGUD8U41iR35QN\
?amount=0.10\
&label=Example+Merchant\
&message=Order+of+flowers+%26+chocolates\
&r=https://example.com/pay/mjSk1Ny9spzU2fouzYgLqGUD8U41iR35QN

None of the parameters provided above, except [“r”](https://developer.bitcoin.org/terms.html#term-r-parameter), are required for the payment protocol—but your applications may include them for backwards compatibility with wallet programs which don’t yet handle the payment protocol.

除了“ r”以外，上面提供的参数都不是支付协议所需要的ーー但是你的应用程序可能包含这些参数，以便向后兼容尚未处理支付协议的钱包程序。

The [“r”](https://developer.bitcoin.org/terms.html#term-r-parameter) parameter tells payment-protocol-aware wallet programs to ignore the other parameters and fetch a [PaymentRequest](https://developer.bitcoin.org/terms.html#term-paymentrequest) from the URL provided. The browser, QR code reader, or other program processing the URI opens the spender’s Bitcoin wallet program on the URI.

“ r”参数告诉支付协议感知的钱包程序忽略其他参数，并从提供的 URL 获取 PaymentRequest。浏览器、二维码阅读器或其他处理 URI 的程序会在 URI 上打开挥金如土的比特币钱包程序。

![BIP70 Payment Protocol](https://developer.bitcoin.org/_images/en-payment-protocol.svg)

BIP70 Payment Protocol[](https://developer.bitcoin.org/devguide/payment_processing.html#id3 "Permalink to this image")

支付协议

The Payment Protocol is described in depth in [BIP70](https://github.com/bitcoin/bips/blob/master/bip-0070.mediawiki), [BIP71](https://github.com/bitcoin/bips/blob/master/bip-0071.mediawiki), and [BIP72](https://github.com/bitcoin/bips/blob/master/bip-0072.mediawiki). An example CGI program and description of all the parameters which can be used in the Payment Protocol is provided in the Developer Examples [Payment Protocol](https://developer.bitcoin.org/examples/payment_processing.html#payment-protocol) subsection. In this subsection, we will briefly describe in story format how the Payment Protocol is typically used.

在 BIP70、 BIP71和 BIP72中对支付协议进行了深入的描述。开发人员示例支付协议部分提供了一个 CGI 示例程序和支付协议中可用的所有参数的描述。在本小节中，我们将以故事格式简要描述支付协议的典型使用方式。

Charlie, the client, is shopping on a website run by Bob, the businessman. Charlie adds a few items to his shopping cart and clicks the “Checkout With Bitcoin” button.

客户查理正在商人鲍勃经营的网站上购物。查理在他的购物车里添加了一些商品，然后点击“用比特币结账”按钮。

Bob’s server automatically adds the following information to its invoice database:

的服务器自动将以下信息添加到发票数据库中:

- The details of Charlie’s order, including items ordered and shipping address.
  
  查理订单的详细信息，包括订购的物品和送货地址。

- An order total in satoshis, perhaps created by converting prices in [fiat](https://developer.bitcoin.org/terms.html#term-fiat) to prices in satoshis.
  
  一个 satoshis 总订单，可能是通过将菲亚特价格转换成 satoshis 价格创建的。

- An expiration time when that total will no longer be acceptable.
  
  一个过期时间，当总数将不再是可接受的。

- A pubkey script to which Charlie should send payment. Typically this will be a P2PKH or P2SH pubkey script containing a unique (never before used) [secp256k1](http://www.secg.org/sec2-v2.pdf) public key.
  
  一个查理应该付款的公共剧本。通常，这将是一个 P2PKH 或 P2SH pubkey 脚本，其中包含一个唯一的(以前从未使用过的) secp256k1公钥。

After adding all that information to the database, Bob’s server displays a [“bitcoin:” URI](https://developer.bitcoin.org/terms.html#term-bitcoin-uri) for Charlie to click to pay.

在将所有信息添加到数据库之后，Bob 的服务器显示一个“ bitcoin: ” URI 供 Charlie 单击进行支付。

Charlie clicks on the [“bitcoin:” URI](https://developer.bitcoin.org/terms.html#term-bitcoin-uri) in his browser. His browser’s URI handler sends the URI to his wallet program. The wallet is aware of the Payment Protocol, so it parses the [“r”](https://developer.bitcoin.org/terms.html#term-r-parameter) parameter and sends an HTTP GET to that URL looking for a [PaymentRequest](https://developer.bitcoin.org/terms.html#term-paymentrequest) message.

Charlie 在浏览器中点击“ bitcoin: ” URI。他的浏览器的 URI 处理程序将 URI 发送到他的钱包程序。钱包知道支付协议，因此它解析“ r”参数并向该 URL 发送一个 HTTP GET 以查找 PaymentRequest 消息。

The [PaymentRequest](https://developer.bitcoin.org/terms.html#term-paymentrequest) message returned may include private information, such as Charlie’s mailing address, but the wallet must be able to access it without using prior authentication, such as HTTP cookies, so a publicly accessible HTTPS URL with a guess-resistant part is typically used. The unique public key created for the payment request can be used to create a unique identifier. This is why, in the example URI above, the [PaymentRequest](https://developer.bitcoin.org/terms.html#term-paymentrequest) URL contains the P2PKH address: `https://example.com/pay/mjSk1Ny9spzU2fouzYgLqGUD8U41iR35QN`

返回的 PaymentRequest 消息可能包含私人信息，比如 Charlie 的邮件地址，但钱包必须能够访问它，而不需要使用事先的身份验证，比如 HTTP cookie，因此通常使用一个公开访问的带有防猜测部分的 HTTPS URL。为支付请求创建的唯一公钥可以用来创建一个唯一标识符。这就是为什么在上面的例子 URI 中，PaymentRequest URL 包含 P2PKH 地址: https://example.com/pay/mjsk1ny9spzu2fouzyglqgud8u41ir35qn

After receiving the HTTP GET to the URL above, the [PaymentRequest](https://developer.bitcoin.org/terms.html#term-paymentrequest)-generating CGI program on Bob’s webserver takes the unique identifier from the URL and looks up the corresponding details in the database. It then creates a [PaymentDetails](https://developer.bitcoin.org/terms.html#term-paymentdetails) message with the following information:

在接收到上面的 URL 的 HTTP GET 后，Bob 的 web 服务器上生成 paymentrequest 的 CGI 程序从 URL 中获取唯一标识符，并在数据库中查找相应的详细信息。然后创建一个 PaymentDetails 消息，其中包含以下信息:

- The amount of the order in satoshis and the pubkey script to be paid.
  
  需要支付的 satoshis 和 pubkey 脚本订单的金额。

- A memo containing the list of items ordered, so Charlie knows what he’s paying for. It may also include Charlie’s mailing address so he can double-check it.
  
  一份包含订购物品清单的备忘录，这样查理就知道他要付多少钱了。还可能包括查理的邮寄地址，这样他就可以再次确认。

- The time the [PaymentDetails](https://developer.bitcoin.org/terms.html#term-paymentdetails) message was created plus the time it expires.
  
  创建 PaymentDetails 消息的时间加上它过期的时间。

- A URL to which Charlie’s wallet should send its completed transaction.
  
  一个查理的钱包应该把它完成的交易发送到的 URL。

That [PaymentDetails](https://developer.bitcoin.org/terms.html#term-paymentdetails) message is put inside a [PaymentRequest](https://developer.bitcoin.org/terms.html#term-paymentrequest) message. The payment request lets Bob’s server sign the entire Request with the server’s [X.509](https://en.wikipedia.org/wiki/X.509) SSL certificate. (The Payment Protocol has been designed to allow other signing methods in the future.) Bob’s server sends the payment request to Charlie’s wallet in the reply to the HTTP GET.

PaymentDetails 消息放在 PaymentRequest 消息中。支付请求允许 Bob 的服务器使用服务器的 x. 509 SSL 证书签署整个请求。(支付协议被设计成允许将来使用其他的签名方法。)Bob 的服务器在对 HTTP GET 的回复中将支付请求发送到 Charlie 的钱包。

![Bitcoin Core Showing Validated Payment Request](https://developer.bitcoin.org/_images/en-btcc-payment-request.png)

Bitcoin Core Showing Validated Payment Request[](https://developer.bitcoin.org/devguide/payment_processing.html#id4 "Permalink to this image")

比特币核心显示验证支付请求

Charlie’s wallet receives the [PaymentRequest](https://developer.bitcoin.org/terms.html#term-paymentrequest) message, checks its signature, and then displays the details from the [PaymentDetails](https://developer.bitcoin.org/terms.html#term-paymentdetails) message to Charlie. Charlie agrees to pay, so the wallet constructs a payment to the pubkey script Bob’s server provided. Unlike a traditional Bitcoin payment, Charlie’s wallet doesn’t necessarily automatically broadcast this payment to the [network](https://developer.bitcoin.org/devguide/p2p_network.html). Instead, the wallet constructs a Payment message and sends it to the URL provided in the [PaymentDetails](https://developer.bitcoin.org/terms.html#term-paymentdetails) message as an HTTP POST. Among other things, the Payment message contains:

Charlie 的钱包接收 PaymentRequest 消息，检查其签名，然后将 PaymentDetails 消息的详细信息显示给 Charlie。查理同意支付，所以钱包构建一个支付到 Bob 的服务器提供的 pubkey 脚本。与传统的比特币支付不同，查理的钱包不一定会自动将这种支付广播到网络上。相反，钱包构造一个支付消息，并将其作为一个 HTTP POST 发送到 PaymentDetails 消息中提供的 URL。其中，付款信息包括:

- The signed transaction in which Charlie pays Bob.
  
  查理付钱给鲍勃的签字交易。

- An optional memo Charlie can send to Bob. (There’s no guarantee that Bob will read it.)
  
  查理可以给鲍勃发一个备忘录(鲍勃不一定会读)

- A [refund](https://developer.bitcoin.org/devguide/payment_processing.html#issuing-refunds) address (pubkey script) which Bob can pay if he needs to return some or all of Charlie’s satoshis.
  
  一个退款地址(pubkey 脚本) ，如果鲍勃需要退还部分或全部查理的 satoshis，他可以支付。

Bob’s server receives the Payment message, verifies the transaction pays the requested amount to the address provided, and then broadcasts the transaction to the [network](https://developer.bitcoin.org/devguide/p2p_network.html). It also replies to the HTTP POSTed Payment message with a PaymentACK message, which includes an optional memo from Bob’s server thanking Charlie for his patronage and providing other information about the order, such as the expected arrival date.

Bob 的服务器接收到支付消息，验证事务向提供的地址支付请求的金额，然后将事务广播到网络。它还会回复 HTTP POSTed PaymentACK 消息，其中包括一个可选的备忘录，来自 Bob 的服务器，感谢 Charlie 的惠顾，并提供有关订单的其他信息，如预计到达日期。

Charlie’s wallet sees the PaymentACK and tells Charlie that the payment has been sent. The PaymentACK doesn’t mean that Bob has verified Charlie’s payment—see the Verifying Payment subsection below—but it does mean that Charlie can go do something else while the transaction gets confirmed. After Bob’s server verifies from the block chain that Charlie’s transaction has been suitably confirmed, it authorizes shipping Charlie’s order.

查理的钱包看到了支付包，并告诉查理支付已经发出。PaymentACK 并不意味着鲍勃已经核实了查理的付款(见下文的核实付款部分) ，但它确实意味着，在交易得到确认之前，查理可以去做其他事情。在 Bob 的服务器从区块链验证 Charlie 的事务已经适当确认之后，它将授权发送 Charlie 的订单。

In the case of a dispute, Charlie can generate a cryptographically proven [receipt](https://developer.bitcoin.org/terms.html#term-receipt) out of the various signed or otherwise-proven information.

在发生纠纷的情况下，Charlie 可以从各种经过签名或其他方式证明的信息中生成一个经过加密证明的收据。

- The [PaymentDetails](https://developer.bitcoin.org/terms.html#term-paymentdetails) message signed by Bob’s webserver proves Charlie received an invoice to pay a specified pubkey script for a specified number of satoshis for goods specified in the memo field.
  
  Bob 的 web 服务器签名的 PaymentDetails 消息证明 Charlie 收到了一张发票，用于为备忘录字段中指定的货物支付指定数量的 satoshis 的指定公钥脚本。

- The Bitcoin block chain can prove that the pubkey script specified by Bob was paid the specified number of satoshis.
  
  比特币块链可以证明 Bob 指定的 pubkey 脚本支付了指定数量的 satoshis。

If a [refund](https://developer.bitcoin.org/devguide/payment_processing.html#issuing-refunds) needs to be issued, Bob’s server can safely pay the [refund](https://developer.bitcoin.org/devguide/payment_processing.html#issuing-refunds)-to pubkey script provided by Charlie. See the [Refunds](https://developer.bitcoin.org/devguide/payment_processing.html#issuing-refunds) section below for more details.

如果需要发出退款，Bob 的服务器可以安全地支付由 Charlie 提供的 refund-to pubkey 脚本。详情请参阅下面的退款部分。

## Verifying Payment 核实付款[](https://developer.bitcoin.org/devguide/payment_processing.html#verifying-payment "Permalink to this headline")

As explained in the [Transactions](https://developer.bitcoin.org/devguide/transactions.html) and [Block Chain](https://developer.bitcoin.org/devguide/block_chain.html) sections, broadcasting a transaction to the [network](https://developer.bitcoin.org/devguide/p2p_network.html) doesn’t ensure that the receiver gets paid. A malicious spender can create one transaction that pays the receiver and a second one that pays the same input back to himself. Only one of these transactions will be added to the block chain, and nobody can say for sure which one it will be.

正如在交易和区块链章节中所解释的，向网络广播交易并不能确保接收者得到报酬。一个恶意的挥霍者可以创造一笔交易来支付接收者，而第二笔交易则会支付同样的投入给他自己。这些交易中只有一个会被添加到块链中，没有人能够确切地说出是哪一个。

Two or more transactions spending the same input are commonly referred to as a [double spend](https://developer.bitcoin.org/glossary.html#term-Double-spend).

两个或两个以上支出相同输入的交易通常称为双重支出。

Once the transaction is included in a block, double spends are impossible without modifying block chain history to replace the transaction, which is quite difficult. Using this system, the Bitcoin protocol can give each of your transactions an updating confidence score based on the number of blocks which would need to be modified to replace a transaction. For each block, the transaction gains one [confirmation](https://developer.bitcoin.org/glossary.html#term-Confirmation-score). Since modifying blocks is quite difficult, higher confirmation scores indicate greater protection.

一旦交易被包含在一个块中，如果不修改块链历史来替换交易，双重花费是不可能的，这是相当困难的。使用这个系统，比特币协议可以根据需要修改以替换交易的块数给每笔交易一个更新的置信度评分。对于每个块，事务获得一个确认。由于修改块是相当困难的，更高的确认分数表明更大的保护。

**0 confirmations**: The transaction has been broadcast but is still not included in any block. Zero confirmation transactions (unconfirmed transactions) should generally not be trusted without risk analysis. Although miners usually confirm the first transaction they receive, fraudsters may be able to manipulate the [network](https://developer.bitcoin.org/devguide/p2p_network.html) into including their version of a transaction.

0 confirmations: 事务已被广播，但仍未包含在任何块中。零确认事务(未经确认的事务)通常不应该在没有风险分析的情况下被信任。虽然矿工通常确认他们收到的第一笔交易，但欺诈者也许能够操纵网络，将其版本的交易包括在内。

**1 confirmation**: The transaction is included in the latest block and double-spend risk decreases dramatically. Transactions which pay sufficient transaction fees need 10 minutes on average to receive one confirmation. However, the most recent block gets replaced fairly often by accident, so a double spend is still a real possibility.

1确认: 交易包含在最新的块中，双重支出风险大大降低。支付足够交易费用的交易平均需要10分钟才能收到一份确认书。然而，最近的代码块经常被意外替换，所以双重使用仍然是一个真正的可能性。

**2 confirmations**: The most recent block was chained to the block which includes the transaction. As of March 2014, two block replacements were exceedingly rare, and a two block replacement attack was impractical without expensive mining equipment.

2 confirmations: 最近的块链接到包含事务的块。截至2014年3月，两个区块的替换是极其罕见的，如果没有昂贵的采矿设备，两个区块的替换攻击是不切实际的。

**6 confirmations**: The [network](https://developer.bitcoin.org/devguide/p2p_network.html) has spent about an hour working to protect the transaction against double spends and the transaction is buried under six blocks. Even a reasonably lucky attacker would require a large percentage of the total [network](https://developer.bitcoin.org/devguide/p2p_network.html) hashing power to replace six blocks. Although this number is somewhat arbitrary, software handling high-value transactions, or otherwise at risk for fraud, should wait for at least six confirmations before treating a payment as accepted.

6个确认: 网络花了大约一个小时的时间来保护交易不被重复花费，交易被掩埋在六个区块之下。即使是一个相当幸运的攻击者也需要很大比例的网络散列功率来替换六个块。尽管这个数字有点武断，但是处理高价值事务或有欺诈风险的软件应该等待至少六次确认后再将付款视为接受付款。

Bitcoin Core provides several [RPCs](https://developer.bitcoin.org/reference/rpc/index.html) which can provide your program with the confirmation score for transactions in your wallet or arbitrary transactions. For example, the [“listunspent” RPC](https://developer.bitcoin.org/reference/rpc/listunspent.html) provides an array of every satoshi you can spend along with its confirmation score.

Although confirmations provide excellent double-spend protection most of the time, there are at least three cases where double-spend risk analysis can be required:

尽管确认在大多数情况下都能提供极好的双重支出保护，但在至少三种情况下，可能需要进行双重支出风险分析:

1. In the case when the program or its user cannot wait for a confirmation and wants to accept unconfirmed payments.
   
   在程序或其用户不能等待确认并希望接受未确认付款的情况下。

2. In the case when the program or its user is accepting high value transactions and cannot wait for at least six confirmations or more.
   
   在程序或其用户正在接受高价值事务并且不能等待至少六个确认函数或更多的情况下。

3. In the case of an implementation bug or prolonged attack against Bitcoin which makes the system less reliable than expected.
   
   在出现执行错误或者对比特币长期攻击的情况下，这使得系统不如预期的可靠。

An interesting source of double-spend risk analysis can be acquired by connecting to large numbers of Bitcoin peers to track how transactions and blocks differ from each other. Some third-party APIs can provide you with this type of service.

For example, unconfirmed transactions can be compared among all connected peers to see if any UTXO is used in multiple unconfirmed transactions, indicating a double-spend attempt, in which case the payment can be refused until it is confirmed. Transactions can also be ranked by their transaction fee to estimate the amount of time until they’re added to a block.

例如，可以在所有关联的对等点之间比较未确认的交易，以查看是否在多个未确认的交易中使用了任何 UTXO，这表明存在双重使用企图，在这种情况下，可以拒绝付款，直到确认为止。交易也可以根据交易费用进行排序，以估计添加到块中之前的时间量。

Another example could be to detect a fork when multiple peers report differing block header hashes at the same block height. Your program can go into a safe mode if the fork extends for more than two blocks, indicating a possible problem with the block chain. For more details, see the [Detecting Forks subsection](https://developer.bitcoin.org/devguide/block_chain.html#detecting-forks).

另一个示例是，当多个对等点报告在相同块高度上出现不同块头散列时，可以检测 fork。如果 fork 扩展超过两个块，则程序可以进入安全模式，这表明块链可能存在问题。有关更多细节，请参见检测叉子小节。

Another good source of double-spend protection can be human intelligence. For example, fraudsters may act differently from legitimate customers, letting savvy merchants manually flag them as high risk. Your program can provide a safe mode which stops automatic payment acceptance on a global or per-customer basis.

另一个好的双重开支保护来源可以是人类的智慧。例如，欺诈者的行为可能与合法客户不同，让精明的商家手动将他们标记为高风险客户。您的计划可以提供一个安全的模式，停止自动付款接受在全球或每个客户的基础上。

## Issuing Refunds 发放退款[](https://developer.bitcoin.org/devguide/payment_processing.html#issuing-refunds "Permalink to this headline")

Occasionally receivers using your applications will need to issue [refunds](https://developer.bitcoin.org/devguide/payment_processing.html#issuing-refunds). The obvious way to do that, which is very unsafe, is simply to return the satoshis to the pubkey script from which they came. For example:

偶尔收件人使用您的应用程序将需要发出退款。最明显的方法是将 satoshis 返回到它们来自的 pubkey 脚本，这是非常不安全的。例如:

- Alice wants to buy a widget from Bob, so Bob gives Alice a price and Bitcoin address.
  
  爱丽丝想从鲍勃那里买一个小工具，所以鲍勃给了爱丽丝一个价格和比特币地址。

- Alice opens her wallet program and sends some satoshis to that address. Her wallet program automatically chooses to spend those satoshis from one of its unspent outputs, an output corresponding to the Bitcoin address mjSk1Ny9spzU2fouzYgLqGUD8U41iR35QN.
  
  爱丽丝打开她的钱包程序，发送一些 satoshis 到那个地址。她的钱包程序会自动选择从一个未使用的输出中花掉那些 satoshis，这个输出对应于比特币地址 mjSk1Ny9spzU2fouzYgLqGUD8U41iR35QN。

- Bob discovers Alice paid too many satoshis. Being an honest fellow, Bob [refunds](https://developer.bitcoin.org/devguide/payment_processing.html#issuing-refunds) the extra satoshis to the mjSk… address.
  
  鲍勃发现爱丽丝付了太多的 satoshis。作为一个诚实的家伙，鲍勃退还了额外的 satoshis 到 mjSk... 地址。

This seems like it should work, but Alice is using a centralized multi-user web wallet which doesn’t give [unique addresses](https://developer.bitcoin.org/terms.html#term-unique-address) to each user, so it has no way to know that Bob’s [refund](https://developer.bitcoin.org/devguide/payment_processing.html#issuing-refunds) is meant for Alice. Now the [refund](https://developer.bitcoin.org/devguide/payment_processing.html#issuing-refunds) is a unintentional donation to the company behind the centralized wallet, unless Alice opens a support ticket and proves those satoshis were meant for her.

这看起来应该可行，但是 Alice 使用的是一个集中式的多用户网络钱包，它不会给每个用户提供唯一的地址，所以它无法知道 Bob 的退款是为 Alice 准备的。现在，退款是无意中捐赠给中央钱包背后的公司，除非爱丽丝打开一张支持票，证明那些 satoshis 是为她准备的。

This leaves receivers only two correct ways to issue [refunds](https://developer.bitcoin.org/devguide/payment_processing.html#issuing-refunds):

这使得接管者只有两种正确的退款方式:

- If an address was copy-and-pasted or a basic [“bitcoin:” URI](https://developer.bitcoin.org/terms.html#term-bitcoin-uri) was used, contact the spender directly and ask them to provide a [refund](https://developer.bitcoin.org/devguide/payment_processing.html#issuing-refunds) address.
  
  如果地址是复制粘贴的，或者使用了基本的“ bitcoin: ” URI，直接联系消费者并要求他们提供一个退款地址。

- If the payment protocol was used, send the [refund](https://developer.bitcoin.org/devguide/payment_processing.html#issuing-refunds) to the output listed in the `refund_to` field of the Payment message.
  
  如果使用了付款协议，请将退款发送到付款消息的 refund _ 字段中列出的输出。

Note: it would be wise to contact the spender directly if the [refund](https://developer.bitcoin.org/devguide/payment_processing.html#issuing-refunds) is being issued a long time after the original payment was made. This allows you to ensure the user still has access to the key or keys for the `refund_to`address.

注意: 如果退款是在原始付款后很长一段时间才发出的，直接联系消费者是明智的。这样你就可以确保用户仍然可以访问退款地址的密钥。

## Disbursing Income (Limiting Forex Risk) 支付收入(限制外汇风险)[](https://developer.bitcoin.org/devguide/payment_processing.html#disbursing-income-limiting-forex-risk "Permalink to this headline")

Many receivers worry that their satoshis will be less valuable in the future than they are now, called foreign exchange (forex) risk. To limit forex risk, many receivers choose to disburse newly-acquired payments soon after they’re received.

许多接受者担心他们的 satoshis 在未来的价值会低于现在，这就是所谓的外汇风险。为了限制外汇风险，许多接管人选择在收到新获得的付款后立即支付。

If your application provides this business logic, it will need to choose which outputs to spend first. There are a few different algorithms which can lead to different results.

如果应用程序提供此业务逻辑，则需要选择首先使用哪些输出。有一些不同的算法可以导致不同的结果。

- A [merge avoidance](https://developer.bitcoin.org/terms.html#term-merge-avoidance) algorithm makes it harder for outsiders looking at block chain data to figure out how many satoshis the receiver has earned, spent, and saved.
  
  合并规避算法使得局外人很难查看区块链数据来计算出接收者赚到、花费和保存了多少卫星数据。

- A last-in-first-out (LIFO) algorithm spends newly acquired satoshis while there’s still double spend risk, possibly pushing that risk on to others. This can be good for the receiver’s balance sheet but possibly bad for their reputation.
  
  后进先出(LIFO)算法花费新收购的 satoshis 时，仍然有双重花费的风险，可能将这种风险推给其他人。这可能对接管者的资产负债表有利，但可能对他们的声誉不利。

- A first-in-first-out (FIFO) algorithm spends the oldest satoshis first, which can help ensure that the receiver’s payments always confirm, although this has utility only in a few edge cases.
  
  先进先出(FIFO)算法首先使用最古老的 satoshis，这可以帮助确保接收方的付款总是得到确认，尽管这只在少数边缘情况下有效。

### Merge Avoidance 合并回避[](https://developer.bitcoin.org/devguide/payment_processing.html#merge-avoidance "Permalink to this headline")

When a receiver receives satoshis in an output, the spender can track (in a crude way) how the receiver spends those satoshis. But the spender can’t automatically see other satoshis paid to the receiver by other spenders as long as the receiver uses [unique addresses](https://developer.bitcoin.org/terms.html#term-unique-address) for each transaction.

当接收者在输出中接收到 satoshis 时，挥霍者可以(以一种粗糙的方式)跟踪接收者如何花费 satoshis。但是，只要接收者为每笔交易使用唯一的地址，消费者就不能自动看到其他消费者支付给接收者的其他 satoshis。

However, if the receiver spends satoshis from two different spenders in the same transaction, each of those spenders can see the other spender’s payment. This is called a [merge](https://developer.bitcoin.org/terms.html#term-merge), and the more a receiver merges outputs, the easier it is for an outsider to track how many satoshis the receiver has earned, spent, and saved.

然而，如果接收者在同一笔交易中花掉了来自两个不同消费者的钱，那么每个消费者都可以看到另一个消费者的钱。这就是所谓的合并，接收器合并的产出越多，外部人员就越容易跟踪接收器赚取、花费和保存的卫星数量。

[Merge avoidance](https://developer.bitcoin.org/terms.html#term-merge-avoidance) means trying to avoid spending unrelated outputs in the same transaction. For persons and businesses which want to keep their transaction data secret from other people, it can be an important strategy.

合并回避是指试图避免在同一事务中花费不相关的产出。对于那些希望对他人保密其交易数据的个人和企业来说，这可能是一个重要的策略。

A crude [merge avoidance](https://developer.bitcoin.org/terms.html#term-merge-avoidance) strategy is to try to always pay with the smallest output you have which is larger than the amount being requested. For example, if you have four outputs holding, respectively, 100, 200, 500, and 900 satoshis, you would pay a bill for 300 satoshis with the 500-satoshi output. This way, as long as you have outputs larger than your bills, you avoid merging.

一个简单的合并回避策略是，总是尝试使用比请求的数量更大的最小输出进行支付。例如，如果您有四个输出分别保持100、200、500和900个 satoshis，那么您将为300个 satoshis 支付500个 satoshi 输出的账单。这样，只要你的产出大于你的账单，你就可以避免合并。

More advanced [merge avoidance](https://developer.bitcoin.org/terms.html#term-merge-avoidance) strategies largely depend on enhancements to the payment protocol which will allow payers to avoid merging by intelligently distributing their payments among multiple outputs provided by the receiver.

更先进的合并回避策略主要依赖于支付协议的改进，这将允许支付者通过智能地将他们的支付分配给接收者提供的多个输出来避免合并。

### Last In, First Out (LIFO) 后进先出(LIFO)[](https://developer.bitcoin.org/devguide/payment_processing.html#last-in-first-out-lifo "Permalink to this headline")

Outputs can be spent as soon as they’re received—even before they’re confirmed. Since recent outputs are at the greatest risk of being double-spent, spending them before older outputs allows the spender to hold on to older confirmed outputs which are much less likely to be double-spent.

产出一收到就可以花掉，甚至在确认之前就可以花掉。由于最近的产出最有可能被重复使用，因此在较早的产出之前使用这些产出，使消费者能够保留较早确认的产出，而这些产出不太可能被重复使用。

There are two closely-related downsides to LIFO:

后进先出法有两个密切相关的缺点:

- If you spend an output from one unconfirmed transaction in a second transaction, the second transaction becomes invalid if transaction malleability changes the first transaction.
  
  如果在第二个事务中使用来自一个未确认事务的输出，则如果事务延展性更改了第一个事务，则第二个事务将无效。

- If you spend an output from one unconfirmed transaction in a second transaction and the first transaction’s output is successfully double spent to another output, the second transaction becomes invalid.
  
  如果在第二个事务中使用来自一个未确认事务的输出，并且第一个事务的输出成功地双倍使用到另一个输出，则第二个事务将无效。

In either of the above cases, the receiver of the second transaction will see the incoming transaction notification disappear or turn into an error message.

在上述任何一种情况下，第二个事务的接收方都将看到传入的事务通知消失或变成错误消息。

Because LIFO puts the recipient of secondary transactions in as much double-spend risk as the recipient of the primary transaction, they’re best used when the secondary recipient doesn’t care about the risk—such as an exchange or other service which is going to wait for six confirmations whether you spend old outputs or new outputs.

因为后进先出法将次要交易的接受者置于与主要交易的接受者同样多的双重支出风险中，所以当次要交易接受者不在乎风险时，比如交易所或其他服务，无论您是使用旧输出还是新输出，都要等待六次确认，因此最好使用次要交易。

LIFO should not be used when the primary transaction recipient’s reputation might be at stake, such as when paying employees. In these cases, it’s better to wait for transactions to be fully verified (see the [Verification subsection](https://developer.bitcoin.org/devguide/payment_processing.html#verifying-payment) above) before using them to make payments.

当主要交易接受方的声誉可能受到威胁时，例如在支付雇员薪酬时，不应使用后进先出法。在这些情况下，在使用交易进行支付之前，最好等待交易被完全验证(参见上面的 Verification 小节)。

### First In, First Out (FIFO) 先进先出(FIFO)[](https://developer.bitcoin.org/devguide/payment_processing.html#first-in-first-out-fifo "Permalink to this headline")

The oldest outputs are the most reliable, as the longer it’s been since they were received, the more blocks would need to be modified to double spend them. However, after just a few blocks, a point of rapidly diminishing returns is reached. The [original Bitcoin paper](https://bitcoin.org/en/bitcoin-paper) predicts the chance of an attacker being able to modify old blocks, assuming the attacker has 30% of the total [network](https://developer.bitcoin.org/devguide/p2p_network.html) hashing power:

最古老的输出是最可靠的，因为自收到输出以来，时间越长，需要修改的块数就越多，从而使输出增加一倍。然而，仅仅过了几个街区，就到达了一个快速的报酬递减。最初的比特币论文预测了攻击者修改旧块的几率，假设攻击者拥有总网络散列功率的30% :

| Blocks积木 | Chance of successful modification成功改造的机会 |
| -------- | ---------------------------------------- |
| 5        | 17.73523%                                |
| 10图10    | 4.16605%                                 |
| 15图15    | 1.01008%                                 |
| 20图20    | 0.24804%                                 |
| 25图25    | 0.06132%                                 |
| 30图30    | 0.01522%                                 |
| 35图35    | 0.00379%                                 |
| 40       | 0.00095%                                 |
| 45       | 0.00024%                                 |
| 50       | 0.00006%                                 |

FIFO does have a small advantage when it comes to transaction fees, as older outputs may be eligible for inclusion in the 50,000 bytes set aside for no-fee-required high-priority transactions by miners running the default Bitcoin Core codebase. However, with transaction fees being so low, this is not a significant advantage.

先进先出法在交易费方面确实有一个小的优势，因为较旧的输出可能有资格列入为运行默认比特币核心代码库的矿工提供的无需付费的高优先级交易留出的50000字节。然而，由于交易费用如此之低，这并不是一个显著的优势。

The only practical use of FIFO is by receivers who spend all or most of their income within a few blocks, and who want to reduce the chance of their payments becoming accidentally invalid. For example, a receiver who holds each payment for six confirmations, and then spends 100% of [verified payments](https://developer.bitcoin.org/devguide/payment_processing.html#verifying-payment) to vendors and a savings account on a bi-hourly schedule.

先进先出的唯一实际用途是接收者花费他们的全部或大部分收入在几个块，谁想减少他们的支付意外无效的机会。例如，一个接收人持有六次确认的每次付款，然后按照每两小时的计划花费100% 的经过验证的付款给供应商和一个储蓄账户。

## Rebilling Recurring Payments 返还定期付款[](https://developer.bitcoin.org/devguide/payment_processing.html#rebilling-recurring-payments "Permalink to this headline")

Automated recurring payments are not possible with decentralized Bitcoin wallets. Even if a wallet supported automatically sending non-reversible payments on a regular schedule, the user would still need to start the program at the appointed time, or leave it running all the time unprotected by encryption.

分散式比特币钱包不可能实现自动循环支付。即使钱包支持定期自动发送不可逆付款，用户仍然需要在指定时间启动程序，或者让它一直运行，不受加密保护。

This means automated recurring Bitcoin payments can only be made from a centralized server which handles satoshis on behalf of its spenders. In practice, receivers who want to set prices in [fiat](https://developer.bitcoin.org/terms.html#term-fiat) terms must also let the same centralized server choose the appropriate exchange rate.

这意味着自动循环的比特币支付只能通过一个中央服务器进行，该服务器代表消费者处理 satoshis。在实践中，想要以法定条款设定价格的接受者还必须让相同的中央服务器选择适当的汇率。

Non-automated rebilling can be managed by the same mechanism used before credit-card recurring payments became common: contact the spender and ask them to pay again—for example, by sending them a [PaymentRequest](https://developer.bitcoin.org/terms.html#term-paymentrequest) [“bitcoin:” URI](https://developer.bitcoin.org/terms.html#term-bitcoin-uri) in an HTML email.

在信用卡定期支付变得普遍之前，非自动化的退款可以使用同样的机制来管理: 联系消费者，要求他们再次支付ーー例如，在 HTML 电子邮件中发送 PaymentRequest“ bitcoin: ” URI。

In the future, extensions to the payment protocol and new wallet features may allow some wallet programs to manage a list of recurring transactions. The spender will still need to start the program on a regular basis and authorize payment—but it should be easier and more secure for the spender than clicking an emailed invoice, increasing the chance receivers get paid on time.

未来，支付协议的扩展和新的钱包功能可能允许一些钱包程序管理一系列经常性交易。消费者仍然需要定期启动程序并授权付款ーー但对于消费者来说，这应该比点击电子邮件发票更容易、更安全，从而增加了收购者按时获得付款的机会。
