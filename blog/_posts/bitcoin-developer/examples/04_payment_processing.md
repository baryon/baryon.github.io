---
title: 例子 - Payment Processing 付款程序
summary: 
date: 2020-11-03 04:00
tags:
- 比特币
- 翻译
- 比特币开发指南

---

::: info

翻译自[Payment Processing &#8212; Bitcoin](https://developer.bitcoin.org/examples/payment_processing.html#payment-processing)
内容在整理，准确性请自己确认

:::

# Payment Processing 付款程序[](https://developer.bitcoin.org/examples/payment_processing.html#payment-processing "Permalink to this headline")

## Payment Protocol 付款程序[](https://developer.bitcoin.org/examples/payment_processing.html#payment-protocol "Permalink to this headline")

To request payment using the payment protocol, you use an extended (but backwards-compatible) [“bitcoin:” URI](https://developer.bitcoin.org/terms.html#term-bitcoin-uri). For example:

要使用支付协议请求支付，您可以使用扩展(但向后兼容)的“ bitcoin: ” URI:

![Warning icon](https://developer.bitcoin.org/_images/icon_warning.svg) **Warning:** The payment protocol is considered to be deprecated and will be removed in a later version of Bitcoin Core. The protocol has multiple security design flaws and implementation flaws in some wallets. Users will begin receiving deprecation warnings in Bitcoin Core version 0.18 when using [BIP70](https://github.com/bitcoin/bips/blob/master/bip-0070.mediawiki) URI’s. Merchants should transition away from [BIP70](https://github.com/bitcoin/bips/blob/master/bip-0070.mediawiki) to more secure options such as [BIP21](https://github.com/bitcoin/bips/blob/master/bip-0021.mediawiki). Merchants should never require [BIP70](https://github.com/bitcoin/bips/blob/master/bip-0070.mediawiki) payments and should provide [BIP21](https://github.com/bitcoin/bips/blob/master/bip-0021.mediawiki) fallbacks.

警告: 支付协议被认为是不推荐的，并将被删除在后来版本的比特币核心。该协议存在多种安全设计缺陷，部分钱包存在实现缺陷。当使用 BIP70 URI 时，用户将开始收到比特币核心0.18版本的弃用警告。商家应该从 BIP70过渡到更安全的选择，比如 BIP21。商家永远不应该要求 BIP70支付，应该提供 BIP21备用。

bitcoin:mjSk1Ny9spzU2fouzYgLqGUD8U41iR35QN\
?amount=0.10\
&label=Example+Merchant\
&message=Order+of+flowers+%26+chocolates\
&r=https://example.com/pay.php/invoice%3Dda39a3ee

The browser, QR code reader, or other program processing the URI opens the spender’s Bitcoin wallet program on the URI. If the wallet program is aware of the payment protocol, it accesses the URL specified in the [“r”](https://developer.bitcoin.org/terms.html#term-r-parameter)parameter, which should provide it with a serialized [PaymentRequest](https://developer.bitcoin.org/terms.html#term-paymentrequest) served with the [MIME](https://en.wikipedia.org/wiki/Internet_media_type) type `application/bitcoin-paymentrequest`.

浏览器、二维码阅读器或其他处理 URI 的程序会在 URI 上打开挥金如土的比特币钱包程序。如果钱包程序知道支付协议，它会访问“ r”参数中指定的 URL，这将为它提供与 MIME 类型应用程序/比特币支付请求一起服务的序列化 PaymentRequest。

**Resource:** Gavin Andresen’s [Payment Request Generator](https://github.com/gavinandresen/paymentrequest/blob/master/php/demo_website/createpaymentrequest.php) generates custom example URIs and payment requests for use with testnet.

资源: Gavin Andresen 的支付请求生成器生成用于 testnet 的定制样例 uri 和支付请求。

### PaymentRequest & PaymentDetails 支付请求和支付详细信息[](https://developer.bitcoin.org/examples/payment_processing.html#paymentrequest-paymentdetails "Permalink to this headline")

The [PaymentRequest](https://developer.bitcoin.org/terms.html#term-paymentrequest) is created with data structures built using Google’s [Protocol Buffers](https://developers.google.com/protocol-buffers/). [BIP70](https://github.com/bitcoin/bips/blob/master/bip-0070.mediawiki) describes these data structures in the non-sequential way they’re defined in the payment request [protocol buffer](https://developers.google.com/protocol-buffers/) code, but the text below will describe them in a more linear order using a simple (but functional) Python CGI program. (For brevity and clarity, many normal CGI best practices are not used in this program.)

支付请求是使用谷歌的协议缓冲数据结构创建的。BIP70以非顺序的方式描述了这些数据结构，它们是在支付请求协议缓冲代码中定义的，但是下面的文本将使用一个简单的(但是功能性的) Python CGI 程序以更加线性的顺序描述它们。(为了简洁和清晰，许多常规的 CGI 最佳实践在本程序中没有使用。)

The full sequence of events is illustrated below, starting with the spender clicking a [“bitcoin:” URI](https://developer.bitcoin.org/terms.html#term-bitcoin-uri) or scanning a `bitcoin:` QR code.

完整的事件序列如下图所示，从挥金如土的人点击“比特币: ” URI 或扫描比特币: QR 码开始。

![BIP70 Payment Protocol](https://developer.bitcoin.org/_images/en-payment-protocol.svg)

BIP70 Payment Protocol[](https://developer.bitcoin.org/examples/payment_processing.html#id1 "Permalink to this image")

支付协议

For the script to use the [protocol buffer](https://developers.google.com/protocol-buffers/), you will need a copy of Google’s [Protocol Buffer](https://developers.google.com/protocol-buffers/) compiler (`protoc`), which is available in most modern Linux package managers and [directly from Google.](https://developers.google.com/protocol-buffers/) Non-Google [protocol buffer](https://developers.google.com/protocol-buffers/) compilers are available for a variety of programming languages. You will also need a copy of the [PaymentRequest](https://developer.bitcoin.org/terms.html#term-paymentrequest) [Protocol Buffer description](https://github.com/bitcoin/bitcoin/blob/0.19/src/qt/paymentrequest.proto) from the Bitcoin Core source code.

对于使用协议缓冲区的脚本，您将需要一个 Google 的 Protocol Buffer 编译器(protoc)的副本，这个副本可以在大多数现代 Linux 包管理器中使用，也可以直接从 Google 获得。非谷歌协议缓冲编译器可用于各种编程语言。您还需要一个来自比特币核心源代码的 PaymentRequest 协议缓冲描述的副本。

#### Initialization Code 初始化代码[](https://developer.bitcoin.org/examples/payment_processing.html#initialization-code "Permalink to this headline")

With the Python code generated by `protoc`, we can start our simple CGI program.

使用 protoc 生成的 Python 代码，我们可以启动简单的 CGI 程序。

#!/usr/bin/env python

## This is the code generated by protoc --python_out=./ [paymentrequest][paymentrequest].proto

from paymentrequest_pb2 import *

## Load some functions

from time import time
from sys import stdout
from OpenSSL.crypto import FILETYPE_PEM, load_privatekey, sign

## Copy three of the classes created by protoc into objects we can use

details = [PaymentDetails][paymentdetails]()
request = [PaymentRequest][paymentrequest]()
x509 = [X509Certificates][x509certificates]()

The startup code above is quite simple, requiring nothing but the epoch (Unix date) time function, the standard out file descriptor, a few functions from the OpenSSL library, and the data structures and functions created by `protoc`.

上面的启动代码非常简单，只需要 epoch (Unix date) time 函数、标准输出文件描述符、 OpenSSL 库中的一些函数以及由 protoc 创建的数据结构和函数。

#### Configuration Code 配置代码[](https://developer.bitcoin.org/examples/payment_processing.html#configuration-code "Permalink to this headline")

Next, we’ll set configuration settings which will typically only change when the receiver wants to do something differently. The code pushes a few settings into the `request` ([PaymentRequest](https://developer.bitcoin.org/terms.html#term-paymentrequest)) and `details` ([PaymentDetails](https://developer.bitcoin.org/terms.html#term-paymentdetails)) objects. When we serialize them, [PaymentDetails](https://developer.bitcoin.org/terms.html#term-paymentdetails) will be contained within the [PaymentRequest](https://developer.bitcoin.org/terms.html#term-paymentrequest).

接下来，我们将设置配置设置，这通常只有当接收者想要做一些不同的事情时才会改变。代码将一些设置推送到请求(PaymentRequest)和详细信息(PaymentDetails)对象中。序列化它们时，PaymentDetails 将包含在 PaymentRequest 中。

## SSL Signature method

request.pki_type = "x509+sha256"  ## Default: none

## Mainnet or testnet?

details.[network][network] = "test"  ## Default: main

## Postback URL

details.payment_url = "https://example.com/pay.py"

## [PaymentDetails][paymentdetails] version number

request.payment_details_version = 1  ## Default: 1

## [Certificate chain][certificate chain]

x509.certificate.append(file("/etc/apache2/example.com-cert.[der][der]", "r").read())
#x509.certificate.append(file("/some/intermediate/cert.[der][der]", "r").read())

## Load private SSL key into memory for signing later

priv_key = "/etc/apache2/example.com-key.pem"
pw = "test"  ## Key password
private_key = load_privatekey(FILETYPE_PEM, file(priv_key, "r").read(), pw)

Each line is described below.

每一行都在下面描述。

request.pki_type = "x509+sha256"  ## Default: none

[“pki_type”](https://developer.bitcoin.org/terms.html#term-pp-pki-type): (optional) tell the receiving wallet program what [Public-Key Infrastructure](https://developer.bitcoin.org/terms.html#term-pki) ([PKI](https://developer.bitcoin.org/terms.html#term-pki)) type you’re using to cryptographically sign your [PaymentRequest](https://developer.bitcoin.org/terms.html#term-paymentrequest) so that it can’t be modified by a [man-in-the-middle](https://en.wikipedia.org/wiki/Man-in-the-middle_attack) attack.

“ PKI _ type” : (可选)告诉接收钱包程序你正在使用什么公开金钥基础建设(PKI)类型来对你的付款请求进行加密签名，这样它就不会被中间人攻击修改。

If you don’t want to sign the [PaymentRequest](https://developer.bitcoin.org/terms.html#term-paymentrequest), you can choose a [“pki_type”](https://developer.bitcoin.org/terms.html#term-pp-pki-type) of `none` (the default).

如果您不想签署 PaymentRequest，可以选择“ pki _ type”为 none (默认值)。

If you do choose the sign the [PaymentRequest](https://developer.bitcoin.org/terms.html#term-paymentrequest), you currently have two options defined by [BIP70](https://github.com/bitcoin/bips/blob/master/bip-0070.mediawiki): `x509+sha1`and `x509+sha256`. Both options use the [X.509](https://en.wikipedia.org/wiki/X.509) certificate system, the same system used for HTTP Secure (HTTPS). To use either option, you will need a certificate signed by a certificate authority or one of their intermediaries. (A self-signed certificate will not work.)

如果您确实选择了签名 PaymentRequest，那么您目前有两个由 BIP70定义的选项: x509 + sha1和 x509 + sha256。这两个选项都使用 x. 509证书系统，该系统与 HTTP 安全(HTTPS)使用的系统相同。要使用这两个选项中的任何一个，您都需要由证书颁发机构或其中介机构签署的证书。(自签名证书不起作用。)

Each wallet program may choose which certificate authorities to trust, but it’s likely that they’ll trust whatever certificate authorities their operating system trusts. If the wallet program doesn’t have a full operating system, as might be the case for small hardware wallets, [BIP70](https://github.com/bitcoin/bips/blob/master/bip-0070.mediawiki) suggests they use the [Mozilla Root Certificate Store](https://www.mozilla.org/en-US/about/governance/policies/security-group/certs/). In general, if a certificate works in your web browser when you connect to your webserver, it will work for your [PaymentRequests](https://developer.bitcoin.org/terms.html#term-paymentrequest).

每个钱包程序可以选择要信任的证书颁发机构，但是它们很可能会信任任何操作系统信任的证书颁发机构。如果钱包程序没有一个完整的操作系统，就像小型硬件钱包一样，BIP70建议他们使用 Mozilla 根证书商店。一般来说，如果连接到 web 服务器时证书在您的 web 浏览器中工作，那么它将适用于您的 PaymentRequests。

details.[network][network] = "test"  ## Default: main

`network`: (optional) tell the spender’s wallet program what Bitcoin [network](https://developer.bitcoin.org/devguide/p2p_network.html) you’re using; [BIP70](https://github.com/bitcoin/bips/blob/master/bip-0070.mediawiki) defines “main” for mainnet (actual payments) and “test” for testnet (like mainnet, but fake satoshis are used). If the wallet program doesn’t run on the [network](https://developer.bitcoin.org/devguide/p2p_network.html) you indicate, it will reject the [PaymentRequest](https://developer.bitcoin.org/terms.html#term-paymentrequest).

Network: (可选)告诉消费者的钱包程序你使用的是哪个比特币网络; BIP70为 mainnet 定义了“ main”(实际支付) ，为 testnet 定义了“ test”(比如 mainnet，但使用的是假的 satoshis)。如果钱包程序没有在您指示的网络上运行，它将拒绝 PaymentRequest。

details.payment_url = "https://example.com/pay.py"

`payment_url`: (required) tell the spender’s wallet program where to send the Payment message (described later). This can be a static URL, as in this example, or a variable URL such as `https://example.com/pay.py?invoice=123.` It should usually be an HTTPS address to prevent [man-in-the-middle](https://en.wikipedia.org/wiki/Man-in-the-middle_attack) attacks from modifying the message.

Payment _ url: (必需的)告诉消费者的钱包程序在哪里发送付款消息(后面将描述)。这可以是一个静态 URL，如本例中所示，也可以是一个变量 URL，如 https://example.com/pay.py?invoice=123。它通常应该是一个 HTTPS 地址，以防止中间人攻击修改消息。

request.payment_details_version = 1  ## Default: 1

`payment_details_version`: (optional) tell the spender’s wallet program what version of the [PaymentDetails](https://developer.bitcoin.org/terms.html#term-paymentdetails)you’re using. As of this writing, the only version is version 1.

支付详情版本: (可选)告诉消费者的钱包程序你使用的是哪个版本的支付详情。在写这篇文章时，唯一的版本是版本1。

## This is the pubkey/certificate corresponding to the private SSL key

## that we'll use to sign:

x509.certificate.append(file("/etc/apache2/example.com-cert.[der][der]", "r").read())

`x509certificates`: (required for signed [PaymentRequests](https://developer.bitcoin.org/terms.html#term-paymentrequest)) you must provide the public SSL key/certificate corresponding to the private SSL key you’ll use to sign the [PaymentRequest](https://developer.bitcoin.org/terms.html#term-paymentrequest). The certificate must be in ASN.1/[DER format](https://en.wikipedia.org/wiki/X.690#DER_encoding).

X509certificates: (签名的 PaymentRequests 需要)您必须提供与用于签名 PaymentRequest 的私有 SSL 密钥相对应的公共 SSL 密钥/证书。证书必须是 ASN. 1/DER 格式。

## If the pubkey/cert above didn't have the signature of a root

## certificate authority, we'd then append the [intermediate certificate][intermediate certificate]

## which signed it:

#x509.certificate.append(file("/some/intermediate/cert.[der][der]", "r").read())

You must also provide any [intermediate certificates](https://developer.bitcoin.org/terms.html#term-intermediate-certificate) necessary to link your certificate to the [root certificate](https://developer.bitcoin.org/terms.html#term-root-certificate) of a certificate authority trusted by the spender’s software, such as a certificate from the Mozilla root store.

您还必须提供任何必要的中间证书，以便将证书链接到消费者软件信任的证书颁发机构的证书根证书，例如来自 Mozilla 根存储的证书。

The certificates must be provided in a specific order—the same order used by Apache’s `SSLCertificateFile`directive and other server software. The figure below shows the [certificate chain](https://developer.bitcoin.org/terms.html#term-certificate-chain) of the www.bitcoin.org [X.509](https://en.wikipedia.org/wiki/X.509)certificate and how each certificate (except the [root certificate](https://developer.bitcoin.org/terms.html#term-root-certificate)) would be loaded into the [X509Certificates](https://developer.bitcoin.org/terms.html#term-x509certificates)[protocol buffer](https://developers.google.com/protocol-buffers/) message.

证书必须以特定的顺序提供ーー与 Apache 的 SSLCertificateFile 指令和其他服务器软件使用的顺序相同。下图显示了 www.bitcoin.org x. 509证书的证书链，以及如何将每个证书(根证书证书除外)加载到 X509Certificates protocol buffer 消息中。

![X509Certificates Loading Order](https://developer.bitcoin.org/_images/en-cert-order.svg)

X509Certificates Loading Order[](https://developer.bitcoin.org/examples/payment_processing.html#id2 "Permalink to this image")

To be specific, the first certificate provided must be the [X.509](https://en.wikipedia.org/wiki/X.509) certificate corresponding to the private SSL key which will make the signature, called the [leaf certificate](https://developer.bitcoin.org/terms.html#term-leaf-certificate). Any [intermediate certificates](https://developer.bitcoin.org/terms.html#term-intermediate-certificate) necessary to link that signed public SSL key to the [root certificate](https://developer.bitcoin.org/terms.html#term-root-certificate) (the certificate authority) are attached separately, with each certificate in [DER format](https://en.wikipedia.org/wiki/X.690#DER_encoding) bearing the signature of the certificate that follows it all the way to (but not including) the [root certificate](https://developer.bitcoin.org/terms.html#term-root-certificate).

具体地说，所提供的第一个证书必须是与私有 SSL 密钥相对应的 x. 509证书，该私有 SSL 密钥将生成签名(称为叶证书)。任何必要的中间证书，将签署的公共 SSL 密钥链接到证书中心(认证机构)都是单独附加的，每个 DER 格式的证书都带有证书的签名，一直到(但不包括)根证书中心。

priv_key = "/etc/apache2/example.com-key.pem"
pw = "test"  ## Key password
private_key = load_privatekey(FILETYPE_PEM, file(priv_key, "r").read(), pw)

(Required for signed [PaymentRequests](https://developer.bitcoin.org/terms.html#term-paymentrequest)) you will need a private SSL key in a format your SSL library supports ([DER format](https://en.wikipedia.org/wiki/X.690#DER_encoding) is not required). In this program, we’ll load it from a PEM file. (Embedding your passphrase in your CGI code, as done here, is obviously a bad idea in real life.)

(需要签名的付款请求)您将需要一个您的 SSL 库支持的格式的私有 SSL 密钥(不需要 DER 格式)。在这个程序中，我们将从 PEM 文件加载它。(在 CGI 代码中嵌入密码，就像这里做的一样，在现实生活中显然是个坏主意。)

The private SSL key will not be transmitted with your request. We’re only loading it into memory here so we can use it to sign the request later.

私有 SSL 密钥不会随您的请求一起传输。我们只是将它加载到这里的内存中，这样以后我们就可以使用它来签署请求。

#### Code Variables 代码变量[](https://developer.bitcoin.org/examples/payment_processing.html#code-variables "Permalink to this headline")

Now let’s look at the variables your CGI program will likely set for each payment.

现在让我们来看看您的 CGI 程序可能为每次付款设置的变量。

## Amount of the request

amount = 10000000  ## In satoshis

## P2PKH pubkey hash

pubkey_hash = "2b14950b8d31620c6cc923c5408a701b1ec0a020"

## P2PKH pubkey script entered as hex and converted to binary

# OP_DUP OP_HASH160 <push 20 bytes> <pubKey hash> OP_EQUALVERIFY OP_CHECKSIG

# 76       a9            14       <pubKey hash>        88          ac

hex_script = "76" + "a9" + "14" + pubkey_hash + "88" + "ac"
serialized_script = hex_script.decode("hex")

## Load amount and pubkey script into [PaymentDetails][paymentdetails]

details.outputs.add(amount = amount, script = serialized_script)

## Memo to display to the spender

details.memo = "Flowers & chocolates"

## Data which should be returned to you with the payment

details.merchant_data = "Invoice #123"

Each line is described below.

每一行都在下面描述。

amount = 10000000  ## In satoshis (=100 mBTC)

[“amount”](https://developer.bitcoin.org/terms.html#term-pp-amount): (optional) the [amount](https://developer.bitcoin.org/terms.html#term-pp-amount) you want the spender to pay. You’ll probably get this value from your shopping cart application or [fiat](https://developer.bitcoin.org/terms.html#term-fiat)-to-BTC exchange rate conversion tool. If you leave the amount blank, the wallet program will prompt the spender how much to pay (which can be useful for donations).

“金额” : (可选)你希望消费者支付的金额。您可能会从您的购物车应用程序或菲亚特到 btc 的汇率转换工具得到这个值。如果你留下空白数额，钱包程序将提示消费者支付多少(这可能是有用的捐款)。

pubkey_hash = "2b14950b8d31620c6cc923c5408a701b1ec0a020"

# OP_DUP OP_HASH160 <push 20 bytes> <pubKey hash> OP_EQUALVERIFY OP_CHECKSIG

# 76       a9            14       <pubKey hash>        88          ac

hex_script = "76" + "a9" + "14" + pubkey_hash + "88" + "ac"
serialized_script = hex_script.decode("hex")

[“script”](https://developer.bitcoin.org/terms.html#term-pp-script): (required) You must specify the pubkey script you want the spender to pay—any valid pubkey script is acceptable. In this example, we’ll request payment to a P2PKH pubkey script.

“ script” : (必需的)您必须指定您希望花钱的 pubkey 脚本ー任何有效的 pubkey 脚本都是可以接受的。在这个示例中，我们将请求对 P2PKH pubkey 脚本的支付。

First we get a pubkey hash. The hash above is the hash form of the address used in the URI examples throughout this section, mjSk1Ny9spzU2fouzYgLqGUD8U41iR35QN.

首先我们得到一个 pubkey hash。上面的散列是整个部分的 URI 示例中使用的地址的散列形式，mjSk1Ny9spzU2fouzYgLqGUD8U41iR35QN。

Next, we plug that hash into the standard P2PKH pubkey script using hex, as illustrated by the code comments.

接下来，我们使用十六进制将该散列插入标准 P2PKH pubkey 脚本，如代码注释所示。

Finally, we convert the pubkey script from hex into its serialized form.

最后，我们将 pubkey 脚本从十六进制转换为它的序列化形式。

details.outputs.add(amount = amount, script = serialized_script)

`outputs`: (required) add the pubkey script and (optional) amount to the [PaymentDetails](https://developer.bitcoin.org/terms.html#term-paymentdetails) outputs array.

Output: (必需的)将 pubkey 脚本和(可选的) amount 添加到 PaymentDetails 输出数组。

It’s possible to specify multiple [“scripts”](https://developer.bitcoin.org/terms.html#term-pp-script) and `amounts` as part of a [merge avoidance](https://developer.bitcoin.org/terms.html#term-merge-avoidance) strategy, described later in the [Merge Avoidance subsection](https://developer.bitcoin.org/devguide/payment_processing.html#merge-avoidance). However, effective [merge avoidance](https://developer.bitcoin.org/terms.html#term-merge-avoidance) is not possible under the base [BIP70](https://github.com/bitcoin/bips/blob/master/bip-0070.mediawiki)rules in which the spender pays each [“script”](https://developer.bitcoin.org/terms.html#term-pp-script) the exact amount specified by its paired [“amount”](https://developer.bitcoin.org/terms.html#term-pp-amount). If the amounts are omitted from all [“amount”](https://developer.bitcoin.org/terms.html#term-pp-amount)/[“script”](https://developer.bitcoin.org/terms.html#term-pp-script) pairs, the spender will be prompted to choose an amount to pay.

可以指定多个“脚本”和金额作为合并回避策略的一部分，在后面的合并回避小节中进行描述。然而，有效的合并规避是不可能的基础 BIP70规则，其中支付支付每个“脚本”的确切金额指定的配对“数额”。如果在所有“金额”/“脚本”对中省略了金额，将提示花钱者选择要支付的金额。

details.memo = "Flowers & chocolates"

[“memo”](https://developer.bitcoin.org/terms.html#term-pp-memo): (optional) add a memo which will be displayed to the spender as plain UTF-8 text. Embedded HTML or other markup will not be processed.

“ memo” : (可选)添加一个备忘录，它将以 UTF-8文本的形式显示给消费者。不会处理嵌入式 HTML 或其他标记。

details.merchant_data = "Invoice #123"

[“merchant_data”](https://developer.bitcoin.org/terms.html#term-pp-merchant-data): (optional) add arbitrary data which should be sent back to the receiver when the invoice is paid. You can use this to track your invoices, although you can more reliably track payments by generating a [unique address](https://developer.bitcoin.org/terms.html#term-unique-address) for each payment and then tracking when it gets paid.

“ merchant _ data” : (可选)添加任意数据，这些数据应该在发票付款时发送回收件人。你可以使用这个来跟踪你的发票，虽然你可以通过为每个付款生成一个唯一的地址来更可靠地跟踪付款，然后跟踪付款的时间。

The [“memo”](https://developer.bitcoin.org/terms.html#term-pp-memo) field can be arbitrarily long, but if you make them too long, you’ll run into the 50,000 byte limit on the entire [PaymentRequest](https://developer.bitcoin.org/terms.html#term-paymentrequest), which includes the often several kilobytes given over to storing the [certificate chain](https://developer.bitcoin.org/terms.html#term-certificate-chain). As will be described in a later subsection, the [“memo”](https://developer.bitcoin.org/terms.html#term-pp-memo) field can be used by the spender after payment as part of a cryptographically-proven [receipt](https://developer.bitcoin.org/terms.html#term-receipt).

“ memo”字段可以任意长，但是如果长度太长，就会在整个 PaymentRequest 中遇到50,000字节的限制，这个限制通常包括用于存储证书链的几千字节。如后面的小节所述，“ memo”字段可以作为经过密码验证的收据的一部分，供支付者在付款后使用。

#### Derivable Data 可推导数据[](https://developer.bitcoin.org/examples/payment_processing.html#derivable-data "Permalink to this headline")

Next, let’s look at some information your CGI program can automatically derive.

接下来，让我们看看您的 CGI 程序可以自动获取的一些信息。

## Request creation time

details.time = int(time()) ## Current epoch (Unix) time

## Request expiration time

details.expires = int(time()) + 60 * 10  ## 10 minutes from now

## [PaymentDetails][paymentdetails] is complete; serialize it and store it in [PaymentRequest][paymentrequest]

request.serialized_payment_details = details.SerializeToString()

## Serialized [certificate chain][certificate chain]

request.pki_data = x509.SerializeToString()

## Initialize signature field so we can sign the full [PaymentRequest][paymentrequest]

request.signature = ""

## Sign [PaymentRequest][paymentrequest]

request.signature = sign(private_key, request.SerializeToString(), "sha256")

Each line is described below.

每一行都在下面描述。

details.time = int(time()) ## Current epoch (Unix) time

`time`: (required) [PaymentRequests](https://developer.bitcoin.org/terms.html#term-paymentrequest) must indicate when they were created in number of seconds elapsed since 1970-01-01T00:00 UTC ([Unix epoch time](https://en.wikipedia.org/wiki/Unix_time) format).

PaymentRequests 必须指出它们是在1970-01-01T00:00 UTC (Unix epoch time format)以秒为单位创建的。

details.expires = int(time()) + 60 * 10  ## 10 minutes from now

[“expires”](https://developer.bitcoin.org/terms.html#term-pp-expires): (optional) the [PaymentRequest](https://developer.bitcoin.org/terms.html#term-paymentrequest) may also set an [“expires”](https://developer.bitcoin.org/terms.html#term-pp-expires) time after which they’re no longer valid. You probably want to give receivers the ability to configure the expiration time delta; here we used the reasonable choice of 10 minutes. If this request is tied to an order total based on a [fiat](https://developer.bitcoin.org/terms.html#term-fiat)-to-satoshis exchange rate, you probably want to base this on a delta from the time you got the exchange rate.

“ expires” : (可选) PaymentRequest 还可以设置一个“ expires”时间，在此之后它们将不再有效。您可能希望让接收者能够配置过期时间差; 这里我们使用了10分钟的合理选择。如果此请求与基于菲亚特对萨托希斯汇率的订单总额相关联，那么您可能希望基于从获得汇率时起的增量。

request.serialized_payment_details = details.SerializeToString()

`serialized_payment_details`: (required) we’ve now set everything we need to create the [PaymentDetails](https://developer.bitcoin.org/terms.html#term-paymentdetails), so we’ll use the SerializeToString function from the [protocol buffer](https://developers.google.com/protocol-buffers/) code to store the [PaymentDetails](https://developer.bitcoin.org/terms.html#term-paymentdetails) in the appropriate field of the [PaymentRequest](https://developer.bitcoin.org/terms.html#term-paymentrequest).

Serialized _ payment _ details: (必需的)我们现在已经设置了创建 PaymentDetails 所需的一切，因此我们将使用 protocol buffer 代码中的 SerializeToString 函数将 PaymentDetails 存储在 PaymentRequest 的适当字段中。

request.pki_data = x509.SerializeToString()

`pki_data`: (required for signed [PaymentRequests](https://developer.bitcoin.org/terms.html#term-paymentrequest)) serialize the [certificate chain](https://developer.bitcoin.org/terms.html#term-certificate-chain) [PKI data](https://developer.bitcoin.org/terms.html#term-pp-pki-data) and store it in the [PaymentRequest](https://developer.bitcoin.org/terms.html#term-paymentrequest)

PKI _ data: (需要签名的 PaymentRequests)序列化证书链 PKI 数据并将其存储在 PaymentRequest 中

request.signature = ""

We’ve filled out everything in the [PaymentRequest](https://developer.bitcoin.org/terms.html#term-paymentrequest) except the signature, but before we sign it, we have to initialize the signature field by setting it to a zero-byte placeholder.

除了签名之外，我们已经填写了 PaymentRequest 中的所有内容，但在签名之前，我们必须将签名字段设置为零字节占位符，以初始化签名字段。

request.signature = sign(private_key, request.SerializeToString(), "sha256")

`signature`: (required for signed [PaymentRequests](https://developer.bitcoin.org/terms.html#term-paymentrequest)) now we make the [signature](https://developer.bitcoin.org/terms.html#term-ssl-signature) by signing the completed and serialized [PaymentRequest](https://developer.bitcoin.org/terms.html#term-paymentrequest). We’ll use the private key we stored in memory in the configuration section and the same hashing formula we specified in [“pki_type”](https://developer.bitcoin.org/terms.html#term-pp-pki-type) (sha256 in this case)

Signature: (签名的 PaymentRequests 需要)现在我们通过签名已完成的序列化 PaymentRequest 来签名。我们将使用配置节中存储在内存中的私钥和在“ pki _ type”中指定的相同哈希公式(在本例中为 sha256)

#### Output Code 输出代码[](https://developer.bitcoin.org/examples/payment_processing.html#output-code "Permalink to this headline")

Now that we have [PaymentRequest](https://developer.bitcoin.org/terms.html#term-paymentrequest) all filled out, we can serialize it and send it along with the HTTP headers, as shown in the code below.

现在我们已经完成了 PaymentRequest，我们可以对它进行序列化，并将其与 HTTP 头一起发送，如下面的代码所示。

print "Content-Type: application/bitcoin-[paymentrequest][paymentrequest]"
print "Content-Transfer-Encoding: binary"
print ""

(Required) [BIP71](https://github.com/bitcoin/bips/blob/master/bip-0071.mediawiki) defines the content types for [PaymentRequests](https://developer.bitcoin.org/terms.html#term-paymentrequest), Payments, and PaymentACKs.

(必需的) BIP71定义了 PaymentRequests、 PaymentACKs 和 PaymentACKs 的内容类型。

file.write(stdout, request.SerializeToString())

`request`: (required) now, to finish, we just dump out the serialized [PaymentRequest](https://developer.bitcoin.org/terms.html#term-paymentrequest) (which contains the serialized [PaymentDetails](https://developer.bitcoin.org/terms.html#term-paymentdetails)). The serialized data is in binary, so we can’t use Python’s print() because it would add an extraneous newline.

Request: (必需的)现在，为了完成这个任务，我们只需要转储序列化的 PaymentRequest (它包含序列化的 PaymentDetails)。序列化的数据是二进制的，因此我们不能使用 Python 的 print () ，因为它会添加一个无关的换行符。

The following screenshot shows how the authenticated [PaymentDetails](https://developer.bitcoin.org/terms.html#term-paymentdetails) created by the program above appears in the GUI from Bitcoin Core 0.9.

下面的屏幕截图显示了上面程序创建的经过验证的 PaymentDetails 是如何出现在来自比特币核心0.9的 GUI 中的。

![Bitcoin Core Showing Validated Payment Request](https://developer.bitcoin.org/_images/en-btcc-payment-request.png)

Bitcoin Core Showing Validated Payment Request[](https://developer.bitcoin.org/examples/payment_processing.html#id3 "Permalink to this image")

比特币核心显示验证支付请求