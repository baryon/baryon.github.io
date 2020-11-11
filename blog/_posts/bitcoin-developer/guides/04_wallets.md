---
title: 指南 - Wallets 钱包
summary: 比特币钱包既可以指钱包程序，也可以指钱包文件。
date: 2020-11-01 04:00
tags:

- 比特币
- 翻译
- 比特币开发指南

---

::: info

翻译自[Wallets](https://developer.bitcoin.org/devguide/wallets.html#wallets)
内容在整理，准确性请自己确认

:::

# Wallets 钱包[](https://developer.bitcoin.org/devguide/wallets.html#wallets "Permalink to this headline")

A Bitcoin wallet can refer to either a wallet program or a wallet file.

比特币钱包既可以指钱包程序，也可以指钱包文件。

## Introductions 自我介绍[](https://developer.bitcoin.org/devguide/wallets.html#introductions "Permalink to this headline")

Wallet programs create public keys to receive satoshis and use the corresponding private keys to spend those satoshis. Wallet files store private keys and (optionally) other information related to transactions for the wallet program.

钱包程序创建公钥来接收 satoshis 并使用相应的私钥来使用这些 satoshis。钱包文件存储私人钥匙和(可选)与钱包程序交易相关的其他信息。

Wallet programs and wallet files are addressed below in separate subsections, and this document attempts to always make it clear whether we’re talking about wallet programs or wallet files.

钱包程序和钱包文件分别在下面的子部分处理，本文档试图总是清楚地说明我们谈论的是钱包程序还是钱包文件。

## Wallet Programs 钱包程序[](https://developer.bitcoin.org/devguide/wallets.html#wallet-programs "Permalink to this headline")

Permitting receiving and spending of satoshis is the only essential feature of wallet software—but a particular wallet program doesn’t need to do both things. Two wallet programs can work together, one program distributing public keys in order to receive satoshis and another program signing transactions spending those satoshis.

允许收发 satoshis 是钱包软件的唯一基本功能，但是一个特定的钱包程序并不需要两者兼顾。两个钱包程序可以一起工作，一个程序分配公共钥匙以接收 satoshis，另一个程序签名交易花费 satoshis。

Wallet programs also need to interact with the [peer-to-peer network](https://developer.bitcoin.org/devguide/p2p_network.html) to get information from the block chain and to broadcast new transactions. However, the programs which distribute public keys or sign transactions don’t need to interact with the [peer-to-peer network](https://developer.bitcoin.org/devguide/p2p_network.html) themselves.

钱包程序还需要与对等网络互动，以获得信息从块链和广播新的交易。然而，分发公钥或签名事务的程序本身并不需要与对等网络进行交互。

This leaves us with three necessary, but separable, parts of a wallet system: a public key distribution program, a signing program, and a networked program. In the subsections below, we will describe common combinations of these parts.

这样，我们就只剩下一个钱包系统的三个必要但可分离的部分: 一个公钥分发程序、一个签名程序和一个网络程序。在下面的小节中，我们将描述这些部分的常见组合。

Note: we speak about distributing public keys generically. In many cases, P2PKH or P2SH hashes will be distributed instead of public keys, with the actual public keys only being distributed when the outputs they control are spent.

注意: 我们说的是通用的公钥分发。在许多情况下，P2PKH 或 P2SH 散列将代替公钥分发，只有在使用它们控制的输出时才分发实际的公钥。

### Full-Service Wallets 全服务钱包[](https://developer.bitcoin.org/devguide/wallets.html#full-service-wallets "Permalink to this headline")

The simplest wallet is a program which performs all three functions: it generates private keys, derives the corresponding public keys, helps distribute those public keys as necessary, monitors for outputs spent to those public keys, creates and signs transactions spending those outputs, and broadcasts the signed transactions.

最简单的钱包是一个执行所有三个功能的程序: 它生成私钥，得到相应的公钥，帮助分配那些必要的公钥，监视那些公钥的输出，创建和签名那些输出的交易，并广播已签名的交易。

![Full-Service Wallets](https://developer.bitcoin.org/_images/en-wallets-full-service.svg)

Full-Service Wallets[](https://developer.bitcoin.org/devguide/wallets.html#id1 "Permalink to this image")

全服务钱包

As of this writing, almost all popular wallets can be used as full-service wallets.

在写这篇文章的时候，几乎所有的流行钱包都可以作为全服务的钱包使用。

The main advantage of full-service wallets is that they are easy to use. A single program does everything the user needs to receive and spend satoshis.

全服务钱包的主要优点是它们很容易使用。一个程序可以完成用户接收和使用 satoshis 所需的一切工作。

The main disadvantage of full-service wallets is that they store the private keys on a device connected to the Internet. The compromise of such devices is a common occurrence, and an Internet connection makes it easy to transmit private keys from a compromised device to an attacker.

提供全面服务的钱包的主要缺点是，它们将私钥存储在连接到互联网的设备上。这种设备的危害是常见的，因特网连接使得从受损设备向攻击者传输私钥变得容易。

To help protect against theft, many wallet programs offer users the option of encrypting the wallet files which contain the private keys. This protects the private keys when they aren’t being used, but it cannot protect against an attack designed to capture the encryption key or to read the decrypted keys from memory.

为了防止盗窃，许多钱包程序为用户提供加密包含私人钥匙的钱包文件的选择。这可以在私钥不被使用时保护它们，但是它不能保护用于捕获加密密钥或从内存中读取解密密钥的攻击。

### Signing-Only Wallets 签名-只有钱包[](https://developer.bitcoin.org/devguide/wallets.html#signing-only-wallets "Permalink to this headline")

To increase security, private keys can be generated and stored by a separate wallet program operating in a more secure environment. These signing-only wallets work in conjunction with a networked wallet which interacts with the [peer-to-peer network](https://developer.bitcoin.org/devguide/p2p_network.html).

为了提高安全性，可以通过在更安全的环境中运行的单独钱包程序生成和存储私钥。这些只需签名的钱包与一个与对等网络互动的网络钱包一起工作。

Signing-only wallets programs typically use deterministic key creation (described in a later subsection) to create parent private and public keys which can create child private and public keys.

纯签名钱包程序通常使用确定性密钥创建(在后面的小节中进行描述)来创建可以创建子私钥和公钥的父私钥和公钥。

![Signing-Only Wallets](https://developer.bitcoin.org/_images/en-wallets-signing-only.svg)

Signing-Only Wallets[](https://developer.bitcoin.org/devguide/wallets.html#id2 "Permalink to this image")

签名-只有钱包

When first run, the signing-only wallet creates a parent private key and transfers the corresponding parent public key to the networked wallet.

在第一次运行时，只签名的钱包创建一个父私钥并将相应的父公钥传输到网络钱包。

The networked wallet uses the parent public key to derive child public keys, optionally helps distribute them, monitors for outputs spent to those public keys, creates unsigned transactions spending those outputs, and transfers the unsigned transactions to the signing-only wallet.

网络钱包使用父公钥来获取子公钥，可选地帮助分发它们，监视花费到这些公钥的输出，创建使用这些输出的未签名交易，并将未签名交易转移到只签名的钱包。

Often, users are given a chance to review the unsigned transactions’ details (particularly the output details) using the signing-only wallet.

通常，用户有机会使用只签名的钱包来查看未签名事务的细节(特别是输出细节)。

After the optional review step, the signing-only wallet uses the parent private key to derive the appropriate child private keys and signs the transactions, giving the signed transactions back to the networked wallet.

在可选的检查步骤之后，只签名的钱包使用父私钥来获得适当的子私钥并对交易进行签名，将签名的交易返回给网络钱包。

The networked wallet then broadcasts the signed transactions to the [peer-to-peer network](https://developer.bitcoin.org/devguide/p2p_network.html).

然后，网络钱包将已签名的交易广播到对等网络。

The following subsections describe the two most common variants of signing-only wallets: offline wallets and hardware wallets.

下面的小节描述了两个最常见的只签名钱包的变种: 离线钱包和硬件钱包。

#### Offline Wallets 离线钱包[](https://developer.bitcoin.org/devguide/wallets.html#offline-wallets "Permalink to this headline")

Several full-service wallets programs will also operate as two separate wallets: one program instance acting as a signing-only wallet (often called an “offline wallet”) and the other program instance acting as the networked wallet (often called an “online wallet” or “watching-only wallet”).

几个提供全面服务的钱包程序也将作为两个单独的钱包运行: 一个程序实例充当只能签名的钱包(通常称为“离线钱包”) ，另一个程序实例充当网络钱包(通常称为“在线钱包”或“只能观看的钱包”)。

The offline wallet is so named because it is intended to be run on a device which does not connect to any [network](https://developer.bitcoin.org/devguide/p2p_network.html), greatly reducing the number of attack vectors. If this is the case, it is usually up to the user to handle all data transfer using removable media such as USB drives. The user’s workflow is something like:

离线钱包之所以这样命名，是因为它打算在一个不连接任何网络的设备上运行，这大大减少了攻击载体的数量。如果是这种情况，通常是由用户来处理所有的数据传输使用可移动媒体，如 USB 驱动器。用户的工作流程如下:

1. (Offline) Disable all [network](https://developer.bitcoin.org/devguide/p2p_network.html) connections on a device and install the wallet software. Start the wallet software in offline mode to create the parent private and public keys. Copy the parent public key to removable media.
   
   (脱机)关闭设备上的所有网络连接，并安装钱包软件。以脱机模式启动钱包软件，以创建父密钥和公钥。将父公钥复制到可移动媒体。

2. (Online) Install the wallet software on another device, this one connected to the Internet, and import the parent public key from the removable media. As you would with a full-service wallet, distribute public keys to receive payment. When ready to spend satoshis, fill in the output details and save the unsigned transaction generated by the wallet to removable media.
   
   (在线)将钱包软件安装在另一个连接互联网的装置上，并从可移动媒体导入父公开密码匙。就像你会拥有一个全方位服务的钱包一样，分发公共钥匙来接收付款。当准备使用 satoshis 时，填写输出细节并将钱包生成的未签名交易保存到可移动媒体中。

3. (Offline) Open the unsigned transaction in the offline instance, review the output details to make sure they spend the correct amount to the correct address. This prevents malware on the online wallet from tricking the user into signing a transaction which pays an attacker. After review, sign the transaction and save it to removable media.
   
   (脱机)在脱机实例中打开未签名的事务，检查输出详细信息以确保它们将正确的金额花费到正确的地址。这可以防止在线钱包上的恶意软件欺骗用户签署一个支付给攻击者的交易。审查后，签署交易，并保存到可移动媒体。

4. (Online) Open the signed transaction in the online instance so it can broadcast it to the [peer-to-peer network](https://developer.bitcoin.org/devguide/p2p_network.html).
   
   (联机)在联机实例中打开已签名的事务，以便它可以广播到对等网络。

The primary advantage of offline wallets is their possibility for greatly improved security over full-service wallets. As long as the offline wallet is not compromised (or flawed) and the user reviews all outgoing transactions before signing, the user’s satoshis are safe even if the online wallet is compromised.

离线钱包的主要优势是它们比全服务钱包安全性大大提高的可能性。只要离线钱包没有被破坏(或者有缺陷) ，并且用户在签名之前审核所有即将离线的交易，用户的 satoshis 就是安全的，即使在线钱包被破坏。

The primary disadvantage of offline wallets is hassle. For maximum security, they require the user dedicate a device to only offline tasks. The offline device must be booted up whenever funds are to be spent, and the user must physically copy data from the online device to the offline device and back.

离线钱包的主要缺点是麻烦。为了获得最大的安全性，它们要求用户将设备专门用于脱机任务。无论何时使用资金，都必须启动脱机设备，而且用户必须将数据从联机设备实际复制到脱机设备并返回。

#### Hardware Wallets 硬件钱包[](https://developer.bitcoin.org/devguide/wallets.html#hardware-wallets "Permalink to this headline")

Hardware wallets are devices dedicated to running a signing-only wallet. Their dedication lets them eliminate many of the vulnerabilities present in operating systems designed for general use, allowing them to safely communicate directly with other devices so users don’t need to transfer data manually. The user’s workflow is something like:

硬件钱包是专门用于运行只支持手语的钱包的设备。他们的贡献让他们消除了许多为普通用户设计的操作系统中存在的漏洞，使他们能够安全地直接与其他设备通信，这样用户就不需要手动传输数据。用户的工作流程如下:

1. (Hardware) Create parent private and public keys. Connect hardware wallet to a networked device so it can get the parent public key.
   
   (硬件)创建父密钥和公共密钥。连接硬件钱包到一个网络设备，以便它可以得到父公钥。

2. (Networked) As you would with a full-service wallet, distribute public keys to receive payment. When ready to spend satoshis, fill in the transaction details, connect the hardware wallet, and click Spend. The networked wallet will automatically send the transaction details to the hardware wallet.
   
   (联网)就像你拥有一个全方位服务的钱包一样，分发公共钥匙来接收付款。准备使用 satoshis 时，请填写交易细节，连接硬件钱包，然后单击 Spend。网络钱包会自动将交易细节发送到硬件钱包。

3. (Hardware) Review the transaction details on the hardware wallet’s screen. Some hardware wallets may prompt for a passphrase or PIN number. The hardware wallet signs the transaction and uploads it to the networked wallet.
   
   (硬件)查看硬件钱包屏幕上的交易细节。有些硬件钱包可能会提示输入密码或 PIN 号码。硬件钱包签署交易并上传到网络钱包。

4. (Networked) The networked wallet receives the signed transaction from the hardware wallet and broadcasts it to the [network](https://developer.bitcoin.org/devguide/p2p_network.html).
   
   (网络)网络钱包接收来自硬件钱包的签名交易，并将其广播到网络。

The primary advantage of hardware wallets is their possibility for greatly improved security over full-service wallets with much less hassle than offline wallets.

硬件钱包的主要优势在于它们可以大大提高安全性，而不像离线钱包那么麻烦。

The primary disadvantage of hardware wallets is their hassle. Even though the hassle is less than that of offline wallets, the user must still purchase a hardware wallet device and carry it with them whenever they need to make a transaction using the signing-only wallet.

硬件钱包的主要缺点是麻烦。即使麻烦比离线钱包少，用户仍然必须购买一个硬件钱包设备，并随身携带它无论何时他们需要使用签名只钱包进行交易。

An additional (hopefully temporary) disadvantage is that, as of this writing, very few popular wallet programs support hardware wallets—although almost all popular wallet programs have announced their intention to support at least one model of hardware wallet.

另外一个(希望是暂时的)缺点是，截至撰写本文时，很少有流行的钱包程序支持硬件钱包ーー尽管几乎所有流行的钱包程序都宣布他们打算支持至少一种硬件钱包模型。

### Distributing-Only Wallets 分发-只有钱包[](https://developer.bitcoin.org/devguide/wallets.html#distributing-only-wallets "Permalink to this headline")

Wallet programs which run in difficult-to-secure environments, such as webservers, can be designed to distribute public keys (including P2PKH or P2SH addresses) and nothing more. There are two common ways to design these minimalist wallets:

在难以安全的环境中运行的钱包程序，例如网络服务器，可以设计为分发公钥(包括 P2PKH 或 P2SH 地址) ，仅此而已。有两种常见的方法来设计这些极简主义钱包:

![Distributing-Only Wallets](https://developer.bitcoin.org/_images/en-wallets-distributing-only.svg)

Distributing-Only Wallets[](https://developer.bitcoin.org/devguide/wallets.html#id3 "Permalink to this image")

分发-只有钱包

- Pre-populate a database with a number of public keys or addresses, and then distribute on request a pubkey script or address using one of the database entries. To [avoid key reuse](https://developer.bitcoin.org/devguide/transactions.html#avoiding-key-reuse), webservers should keep track of used keys and never run out of public keys. This can be made easier by using parent public keys as suggested in the next method.
  
  使用许多公钥或地址预先填充数据库，然后根据请求使用数据库条目之一分发 pubkey 脚本或地址。为了避免密钥重用，服务器应该跟踪使用过的密钥，并且永远不会用完公共密钥。正如下一个方法中所建议的那样，可以通过使用父公钥简化这个过程。

- Use a parent public key to create child public keys. To avoid key reuse, a method must be used to ensure the same public key isn’t distributed twice. This can be a database entry for each key distributed or an incrementing pointer to the [key index](https://developer.bitcoin.org/terms.html#term-key-index) number.
  
  使用父公钥创建子公钥。为了避免密钥重用，必须使用一种方法来确保同一公钥不被分发两次。这可以是分发的每个密钥的数据库条目，也可以是指向密钥索引号的递增指针。

Neither method adds a significant amount of overhead, especially if a database is used anyway to associate each incoming payment with a separate public key for payment tracking. See the [Payment Processing](https://developer.bitcoin.org/devguide/payment_processing.html) section for details.

这两种方法都不会增加大量的开销，特别是如果使用数据库将每个收到的付款与单独的用于付款跟踪的公钥关联起来。有关详细信息，请参阅支付处理部分。

## Wallet Files 钱包文件[](https://developer.bitcoin.org/devguide/wallets.html#wallet-files "Permalink to this headline")

Bitcoin wallets at their core are a collection of private keys. These collections are stored digitally in a file, or can even be physically stored on pieces of paper.

比特币钱包的核心是一系列私人钥匙。这些集合以数字形式存储在一个文件中，甚至可以物理地存储在纸张上。

### Private Key Formats 私钥格式[](https://developer.bitcoin.org/devguide/wallets.html#private-key-formats "Permalink to this headline")

Private keys are what are used to unlock satoshis from a particular address. In Bitcoin, a private key in standard format is simply a 256-bit number, between the values:

私钥是用来从特定地址解锁 satoshis 的。在比特币中，标准格式的私钥只是一个256位的数字，在两个值之间:

0x01 and 0xFFFF FFFF FFFF FFFF FFFF FFFF FFFF FFFE BAAE DCE6 AF48 A03B BFD2 5E8C D036 4140, representing nearly the entire range of 2256-1 values. The range is governed by the [secp256k1](http://www.secg.org/sec2-v2.pdf) [ECDSA](https://en.wikipedia.org/wiki/Elliptic_Curve_DSA)encryption standard used by Bitcoin.

6afce6 A03B bfd25e8c d0364140，几乎代表了2256-1的整个范围。范围由比特币使用的 secp256k1 ECDSA 加密标准控制。

#### Wallet Import Format (WIF) 钱包导入格式(WIF)[](https://developer.bitcoin.org/devguide/wallets.html#wallet-import-format-wif "Permalink to this headline")

In order to make copying of private keys less prone to error, [Wallet Import Format](https://developer.bitcoin.org/glossary.html#term-Wallet-Import-Format) may be utilized. WIF uses base58Check encoding on a private key, greatly decreasing the chance of copying error, much like standard Bitcoin addresses.

为了使私钥的复制不容易出错，可以使用钱包导入格式。WIF 在私钥上使用 base58Check 编码，大大减少了复制错误的机会，就像标准的比特币地址一样。

1. Take a private key.
   
   使用私人密钥。

2. Add a 0x80 byte in front of it for mainnet addresses or 0xef for testnet addresses.
   
   在它前面添加一个0x80字节表示主网络地址或者0xef 表示 testnet 地址。

3. Append a 0x01 byte after it if it should be used with compressed public keys (described in a later subsection). Nothing is appended if it is used with uncompressed public keys.
   
   如果应该与压缩的公钥一起使用，则在其后附加一个0x01字节(在后面的小节中进行描述)。如果与未压缩的公钥一起使用，则不会追加任何内容。

4. Perform a SHA-256 hash on the extended key.
   
   对扩展密钥执行 SHA-256哈希。

5. Perform a SHA-256 hash on result of SHA-256 hash.
   
   对 SHA-256散列的结果执行 SHA-256散列。

6. Take the first four bytes of the second SHA-256 hash; this is the checksum.
   
   获取第二个 SHA-256散列的前四个字节; 这是校验和。

7. Add the four checksum bytes from point 5 at the end of the extended key from point 2.
   
   从点2开始，将扩展密钥末尾的点5中的4个校验和字节相加。

8. Convert the result from a byte string into a Base58 string using Base58Check encoding.
   
   使用 Base58Check 编码将字节字符串转换为 Base58字符串。

The process is easily reversible, using the Base58 decoding function, and removing the padding.

使用 Base58解码函数并去掉填充，该过程很容易可逆。

#### Mini Private Key Format 迷你私人密码匙格式[](https://developer.bitcoin.org/devguide/wallets.html#mini-private-key-format "Permalink to this headline")

Mini private key format is a method for encoding a private key in under 30 characters, enabling keys to be embedded in a small physical space, such as physical bitcoin tokens, and more damage-resistant QR codes.

迷你私钥格式是一种将私钥编码为30个字符以下的方法，使得密钥可以嵌入到一个小的物理空间中，如物理比特币令牌，以及更具抗损害能力的二维码。

1. The first character of mini keys is ‘S’.
   
   迷你按键的第一个字母是 s。

2. In order to determine if a mini private key is well-formatted, a question mark is added to the private key.
   
   为了确定迷你私钥是否格式化良好，向私钥添加一个问号。

3. The SHA256 hash is calculated. If the first byte produced is a `00’, it is well-formatted. This key restriction acts as a typo-checking mechanism. A user brute forces the process using random numbers until a well-formatted mini private key is produced.
   
   计算 SHA256散列。如果生成的第一个字节是“00” ，那么它是格式化良好的。这个关键限制充当了一种排版检查机制。用户使用随机数字强制执行该过程，直到生成格式良好的迷你私钥。

4. In order to derive the full private key, the user simply takes a single SHA256 hash of the original mini private key. This process is one-way: it is intractable to compute the mini private key format from the derived key.
   
   为了获得完整的私钥，用户只需获取原始迷你私钥的一个 SHA256散列。这个过程是单向的: 从派生的密钥计算迷你私钥格式是很棘手的。

Many implementations disallow the character ‘1’ in the mini private key due to its visual similarity to ‘l’.

许多实现不允许在迷你私钥中使用字符“1” ，因为它在视觉上与“ l”相似。

**Resource:** A common tool to create and redeem these keys is the [Casascius Bitcoin Address Utility](https://github.com/casascius/Bitcoin-Address-Utility).

资源: 创建和赎回这些密钥的常用工具是 Casascius Bitcoin 地址工具。

### Public Key Formats 公开密码匙格式[](https://developer.bitcoin.org/devguide/wallets.html#public-key-formats "Permalink to this headline")

Bitcoin [ECDSA](https://en.wikipedia.org/wiki/Elliptic_Curve_DSA) public keys represent a point on a particular Elliptic Curve (EC) defined in [secp256k1](http://www.secg.org/sec2-v2.pdf). In their traditional uncompressed form, public keys contain an identification byte, a 32-byte X coordinate, and a 32-byte Y coordinate. The extremely simplified illustration below shows such a point on the elliptic curve used by Bitcoin, y2 = x3 + 7, over a field of contiguous numbers.

比特币 ECDSA 公钥表示在 secp256k1中定义的特定椭圆曲线(EC)上的一个点。在传统的未压缩形式中，公钥包含一个标识字节、一个32字节的 x 坐标和一个32字节的 y 坐标。下面极其简化的插图显示了比特币在一个连续数字域上使用的椭圆曲线上的这样一个点，y2 = x3 + 7。

![Point On ECDSA Curve](https://developer.bitcoin.org/_images/en-ecdsa-compressed-public-key.svg)

Point On ECDSA Curve[](https://developer.bitcoin.org/devguide/wallets.html#id4 "Permalink to this image")

ECDSA 曲线上的点

([Secp256k1](http://www.secg.org/sec2-v2.pdf) actually modulos coordinates by a large prime, which produces a field of non-contiguous integers and a significantly less clear plot, although the principles are the same.)

(Secp256k1实际上是由一个大素数组成的模块坐标，它产生一个由不连续的整数组成的字段和一个明显不那么清晰的图形，尽管原理是相同的。)

An almost 50% reduction in public key size can be realized without changing any fundamentals by dropping the Y coordinate. This is possible because only two points along the curve share any particular X coordinate, so the 32-byte Y coordinate can be replaced with a single bit indicating whether the point is on what appears in the illustration as the “top” side or the “bottom” side.

在不改变任何基本原理的情况下，通过删除 y 坐标，可以实现公钥大小减少近50% 。这是可能的，因为沿着曲线只有两个点共享任何特定的 x 坐标，所以32字节的 y 坐标可以替换为一个位，指示该点是在图中显示的“顶部”一侧还是“底部”一侧。

No data is lost by creating these compressed public keys—only a small amount of CPU is necessary to reconstruct the Y coordinate and access the uncompressed public key. Both uncompressed and compressed public keys are described in official [secp256k1](http://www.secg.org/sec2-v2.pdf) documentation and supported by default in the widely-used OpenSSL library.

创建这些压缩的公钥不会丢失数据ー只需要少量的 CPU 就可以重构 y 坐标并访问未压缩的公钥。在官方 secp256k1文档中描述了未压缩和压缩的公钥，并且在广泛使用的 OpenSSL 库中默认支持这两种公钥。

Because they’re easy to use, and because they reduce almost by half the block chain space used to store public keys for every spent output, compressed public keys are the default in Bitcoin Core and are the recommended default for all Bitcoin software.

因为它们易于使用，而且因为它们减少了几乎一半的块链空间，而这些空间用于存储每一次使用输出的公钥，压缩公钥是比特币核心的默认设置，也是所有比特币软件的推荐默认设置。

However, Bitcoin Core prior to 0.6 used uncompressed keys. This creates a few complications, as the hashed form of an uncompressed key is different than the hashed form of a compressed key, so the same key works with two different P2PKH addresses. This also means that the key must be submitted in the correct format in the signature script so it matches the hash in the previous output’s pubkey script.

然而，比特币核心在0.6之前使用的是未压缩的密钥。这就产生了一些复杂性，因为未压缩键的散列形式与压缩键的散列形式不同，所以相同的键使用两个不同的 P2PKH 地址工作。这也意味着密钥必须在签名脚本中以正确的格式提交，以便与前一个输出的 pubkey 脚本中的哈希匹配。

For this reason, Bitcoin Core uses several different identifier bytes to help programs identify how keys should be used:

因此，Bitcoin Core 使用几个不同的标识符字节来帮助程序识别密钥应该如何使用:

- Private keys meant to be used with compressed public keys have 0x01 appended to them before being Base-58 encoded. (See the private key encoding section above.)
  
  用于与压缩公钥一起使用的私钥在进行 Base-58编码之前会附加0x01。(请参阅上面的私钥编码部分。)

- Uncompressed public keys start with 0x04; compressed public keys begin with 0x03 or 0x02 depending on whether they’re greater or less than the midpoint of the curve. These prefix bytes are all used in official [secp256k1](http://www.secg.org/sec2-v2.pdf) documentation.
  
  未压缩的公钥以0x04开始; 压缩的公钥以0x03或0x02开始，具体取决于它们是大于还是小于曲线中点。这些前缀字节都在官方 secp256k1文档中使用。

### Hierarchical Deterministic Key Creation 分层确定性密钥创建[](https://developer.bitcoin.org/devguide/wallets.html#hierarchical-deterministic-key-creation "Permalink to this headline")

The hierarchical deterministic key creation and transfer protocol ([HD protocol](https://developer.bitcoin.org/glossary.html#term-HD-protocol)) greatly simplifies wallet backups, eliminates the need for repeated communication between multiple programs using the same wallet, permits creation of child accounts which can operate independently, gives each parent account the ability to monitor or control its children even if the child account is compromised, and divides each account into full-access and restricted-access parts so untrusted users or programs can be allowed to receive or monitor payments without being able to spend them.

分级确定密钥创建和传输协议(HD 协议)极大地简化了钱包备份，消除了使用同一个钱包的多个程序之间的重复通信需要，允许创建可独立运行的子账户，即使子账户受到威胁，也允许每个父账户监视或控制其子账户的能力，并将每个账户划分为完全访问和受限访问部分，以便不信任的用户或程序可以接收或监视付款，而无法使用它们。

The HD protocol takes advantage of the [ECDSA](https://en.wikipedia.org/wiki/Elliptic_Curve_DSA) public key creation function, [“point()”](https://developer.bitcoin.org/terms.html#term-point-function), which takes a large integer (the private key) and turns it into a graph point (the public key):

HD 协议利用 ECDSA 的公钥创建功能“ point ()” ，它接受一个大整数(私钥)并将其转换为一个图点(公钥) :

point(private_key) == public_key

Because of the way [“point()”](https://developer.bitcoin.org/terms.html#term-point-function) works, it’s possible to create a [child public key](https://developer.bitcoin.org/glossary.html#term-Child-key) by combining an existing [(parent) public key](https://developer.bitcoin.org/glossary.html#term-Parent-key) with another public key created from any integer (*i*) value. This child public key is the same public key which would be created by the [“point()”](https://developer.bitcoin.org/terms.html#term-point-function) function if you added the *i* value to the original (parent) private key and then found the remainder of that sum divided by a global constant used by all Bitcoin software (*p*):

由于“ point ()”的工作方式，可以通过组合现有(父)公钥和从任何整数(i)值创建的另一个公钥来创建子公钥。这个子公钥与“ point ()”函数创建的公钥是相同的，如果您将 i 值添加到原始(父)私钥，然后发现该总和的其余部分除以所有比特币软件使用的全局常量(p) :

point( (parent_private_key + i) % p ) == parent_public_key + point(i)

This means that two or more independent programs which agree on a sequence of integers can create a series of unique [child key](https://developer.bitcoin.org/glossary.html#term-Child-key) pairs from a single [parent key](https://developer.bitcoin.org/glossary.html#term-Parent-key) pair without any further communication. Moreover, the program which distributes new public keys for receiving payment can do so without any access to the private keys, allowing the public key distribution program to run on a possibly-insecure platform such as a public web server.

这意味着两个或两个以上的独立程序可以从单个父密钥对创建一系列唯一的子密钥对，而不需要进一步的通信。此外，分发用于接收付款的新公钥的程序可以在不访问私钥的情况下这样做，从而使公钥分发程序能够在公共网络服务器等可能不安全的平台上运行。

Child public keys can also create their own child public keys (grandchild public keys) by repeating the child key derivation operations:

通过重复子密钥派生操作，子公钥还可以创建自己的子公钥(孙子公钥) :

point( (child_private_key + i) % p ) == child_public_key + point(i)

Whether creating child public keys or further-descended public keys, a predictable sequence of integer values would be no better than using a single public key for all transactions, as anyone who knew one child public key could find all of the other child public keys created from the same parent public key. Instead, a random seed can be used to deterministically generate the sequence of integer values so that the relationship between the child public keys is invisible to anyone without that seed.

无论是创建子公钥还是进一步降级的公钥，可预测的整数值序列都不会比为所有事务使用单个公钥更好，因为任何知道一个子公钥的人都可以找到由同一父公钥创建的所有其他子公钥。相反，可以使用随机种子确定性地生成整数值序列，这样，没有种子的任何人都看不到子公钥之间的关系。

The HD protocol uses a single root seed to create a hierarchy of child, grandchild, and other descended keys with unlinkable deterministically-generated integer values. Each child key also gets a deterministically-generated seed from its parent, called a [chain code](https://developer.bitcoin.org/glossary.html#term-Chain-code), so the compromising of one chain code doesn’t necessarily compromise the integer sequence for the whole hierarchy, allowing the [master chain code](https://developer.bitcoin.org/glossary.html#term-Master-chain-code) to continue being useful even if, for example, a web-based public key distribution program gets hacked.

HD 协议使用单个根种子创建子、孙子和其他下降的键的层次结构，这些键具有不可链接的确定性生成的整数值。每个子密钥也会从它的父密钥中获得一个确定生成的种子，称为链代码，所以一个链代码的泄露不一定会危及整个层次结构的整数数列，这使得主链代码继续有用，即使，例如，一个基于 web 的公钥分发程序被黑客攻击。

![Overview Of Hierarchical Deterministic Key Derivation](https://developer.bitcoin.org/_images/en-hd-overview.svg)

Overview Of Hierarchical Deterministic Key Derivation[](https://developer.bitcoin.org/devguide/wallets.html#id5 "Permalink to this image")

确定性层次密钥推导综述

As illustrated above, HD key derivation takes four inputs:

如上所述，HD 密钥推导需要四个输入:

- The [parent private key](https://developer.bitcoin.org/glossary.html#term-Parent-key) and *parent public key* are regular uncompressed 256-bit [ECDSA](https://en.wikipedia.org/wiki/Elliptic_Curve_DSA) keys.
  
  父私钥和父公钥是常规的未压缩的256位 ECDSA 密钥。

- The [parent chain code](https://developer.bitcoin.org/glossary.html#term-Chain-code) is 256 bits of seemingly-random data.
  
  父链代码是256位的看似随机的数据。

- The [index](https://developer.bitcoin.org/terms.html#term-key-index) number is a 32-bit integer specified by the program.
  
  索引号是由程序指定的32位整数。

In the normal form shown in the above illustration, the parent chain code, the parent public key, and the index number are fed into a one-way cryptographic hash ([HMAC-SHA512](https://en.wikipedia.org/wiki/HMAC)) to produce 512 bits of deterministically-generated-but-seemingly-random data. The seemingly-random 256 bits on the righthand side of the hash output are used as a new child chain code. The seemingly-random 256 bits on the lefthand side of the hash output are used as the integer value to be combined with either the parent private key or parent public key to, respectively, create either a child private key or child public key:

在上图所示的标准形式中，父链代码、父公钥和索引号被输入单向密码散列(HMAC-SHA512) ，以产生512位确定性生成但看似随机的数据。哈希输出右侧看似随机的256位被用作新的子链代码。散列输出左侧看似随机的256位用作整数值，分别与父私钥或父公钥组合，创建子私钥或子公钥:

child_private_key == (parent_private_key + lefthand_hash_output) % G
child_public_key == point( (parent_private_key + lefthand_hash_output) % G )
child_public_key == point(child_private_key) == parent_public_key + point(lefthand_hash_output)

Specifying different index numbers will create different unlinkable child keys from the same parent keys. Repeating the procedure for the child keys using the child chain code will create unlinkable grandchild keys.

指定不同的索引号将从相同的父键创建不同的不可链接的子键。使用子链代码重复子密钥的过程将创建不可链接的孙子密钥。

Because creating child keys requires both a key and a chain code, the key and chain code together are called the [extended key](https://developer.bitcoin.org/glossary.html#term-Extended-key). An [extended private key](https://developer.bitcoin.org/glossary.html#term-Extended-key) and its corresponding [extended public key](https://developer.bitcoin.org/glossary.html#term-Extended-key) have the same chain code. The (top-level parent) [master private key](https://developer.bitcoin.org/glossary.html#term-Master-chain-code) and master chain code are derived from random data, as illustrated below.

因为创建子密钥需要一个密钥和一个链代码，所以密钥和链代码一起称为扩展密钥。扩展私钥及其对应的扩展公钥具有相同的链码。(顶级父级)主私钥和主链代码来自随机数据，如下所示。

![Creating A Root Extended Key Pair](https://developer.bitcoin.org/_images/en-hd-root-keys.svg)

Creating A Root Extended Key Pair[](https://developer.bitcoin.org/devguide/wallets.html#id6 "Permalink to this image")

创建根扩展密钥对

A [root seed](https://developer.bitcoin.org/glossary.html#term-HD-wallet-seed) is created from either 128 bits, 256 bits, or 512 bits of random data. This root seed of as little as 128 bits is the only data the user needs to backup in order to derive every key created by a particular wallet program using particular settings.

根种子由128位、256位或512位的随机数据创建。这个只有128位的根种子是用户唯一需要备份的数据，以便获取特定钱包程序使用特定设置创建的每个密钥。

![Warning icon](https://developer.bitcoin.org/_images/icon_warning.svg) **Warning:** As of this writing, HD wallet programs are not expected to be fully compatible, so users must only use the same HD wallet program with the same HD-related settings for a particular root seed.

警告: 截至本文撰写，高清钱包程序预计不是完全兼容的，所以用户只能使用相同的高清钱包程序与相同的 HD 相关设置为特定的根种子。

The root seed is hashed to create 512 bits of seemingly-random data, from which the master private key and master chain code are created (together, the master extended private key). The master public key is derived from the master private key using [“point()”](https://developer.bitcoin.org/terms.html#term-point-function), which, together with the master chain code, is the master extended public key. The master extended keys are functionally equivalent to other extended keys; it is only their location at the top of the hierarchy which makes them special.

根种子被散列以创建512位看似随机的数据，从这些数据中创建主私钥和主链代码(共同创建主扩展私钥)。主公钥是从使用“ point ()”的主私钥派生而来的，它与主链代码一起是主扩展公钥。主扩展键在功能上等同于其他扩展键; 只是它们在层次结构顶部的位置使它们特殊。

#### Hardened Keys 硬键[](https://developer.bitcoin.org/devguide/wallets.html#hardened-keys "Permalink to this headline")

Hardened extended keys fix a potential problem with normal extended keys. If an attacker gets a normal parent chain code and parent public key, he can brute-force all chain codes deriving from it. If the attacker also obtains a child, grandchild, or further-descended private key, he can use the chain code to generate all of the extended private keys descending from that private key, as shown in the grandchild and great-grandchild generations of the illustration below.

硬化扩展键修复一个潜在的问题与普通扩展键。如果攻击者获得了一个正常的父链码和父公钥，他就可以暴力破解源自它的所有链码。如果攻击者还获得了一个子密钥、孙子密钥或进一步下降的私钥，他可以使用链代码生成所有从该私钥下降的扩展私钥，如下图的孙子密钥和曾孙密钥世代所示。

![Cross-Generational Key Compromise](https://developer.bitcoin.org/_images/en-hd-cross-generational-key-compromise.svg)

Cross-Generational Key Compromise[](https://developer.bitcoin.org/devguide/wallets.html#id7 "Permalink to this image")

跨代关键妥协

Perhaps worse, the attacker can reverse the normal child private key derivation formula and subtract a parent chain code from a child private key to recover the parent private key, as shown in the child and parent generations of the illustration above. This means an attacker who acquires an extended public key and any private key descended from it can recover that public key’s private key and all keys descended from it.

也许更糟糕的是，攻击者可以颠倒正常的子私钥派生公式，从子私钥中减去父链代码来恢复父私钥，如上图的子代和父代所示。这意味着获取扩展公钥和从扩展公钥下降的任何私钥的攻击者可以恢复该公钥的私钥和从该私钥下降的所有密钥。

For this reason, the chain code part of an extended public key should be better secured than standard public keys and users should be advised against exporting even non-extended private keys to possibly-untrustworthy environments.

因此，扩展公钥的链代码部分应该比标准公钥更加安全，并且应该建议用户不要将甚至不扩展的私钥导出到可能不可信的环境中。

This can be fixed, with some tradeoffs, by replacing the normal key derivation formula with a hardened key derivation formula.

这可以通过一些折衷来修复，方法是用一个强化的关键推导公式替换普通的关键推导公式。

The normal key derivation formula, described in the section above, combines together the index number, the parent chain code, and the parent public key to create the child chain code and the integer value which is combined with the parent private key to create the child private key.

上面一节描述的普通密钥派生公式将索引号、父链代码和父公钥组合在一起，以创建子链代码和整数值，后者与父私钥组合在一起，以创建子私钥。

![Creating Child Public Keys From An Extended Private Key](https://developer.bitcoin.org/_images/en-hd-private-parent-to-private-child.svg)

Creating Child Public Keys From An Extended Private Key[](https://developer.bitcoin.org/devguide/wallets.html#id8 "Permalink to this image")

从扩展的私钥创建子公钥

The hardened formula, illustrated above, combines together the index number, the parent chain code, and the parent private key to create the data used to generate the child chain code and child private key. This formula makes it impossible to create child public keys without knowing the parent private key. In other words, parent extended public keys can’t create hardened child public keys.

如上所示，经过强化的公式将索引号、父链代码和父私钥组合在一起，以创建用于生成子链代码和子私钥的数据。这个公式使得在不知道父私钥的情况下不可能创建子公钥。换句话说，父扩展公钥不能创建硬化的子公钥。

Because of that, a [hardened extended private key](https://developer.bitcoin.org/glossary.html#term-Hardened-extended-key) is much less useful than a normal extended private key—however, hardened extended private keys create a firewall through which multi-level key derivation compromises cannot happen. Because hardened child extended public keys cannot generate grandchild chain codes on their own, the compromise of a parent extended public key cannot be combined with the compromise of a grandchild private key to create great-grandchild extended private keys.

正因为如此，加固的扩展私钥远不如普通的扩展私钥有用ー然而，加固的扩展私钥创建了一个防火墙，通过这个防火墙不会发生多级密钥派生妥协。由于经过强化的子扩展公钥不能自己生成孙子链码，因此父扩展公钥的危害不能与孙子私钥的危害相结合来创建重孙子扩展私钥。

The HD protocol uses different index numbers to indicate whether a normal or hardened key should be generated. Index numbers from 0x00 to 0x7fffffff (0 to 231-1) will generate a normal key; index numbers from 0x80000000 to 0xffffffff will generate a hardened key. To make descriptions easy, many developers use the [prime symbol](https://en.wikipedia.org/wiki/Prime_%28symbol%29) to indicate hardened keys, so the first normal key (0x00) is 0 and the first hardened key (0x80000000) is 0´.

HD 协议使用不同的索引号来指示是否应该生成一个正常的或硬化的密钥。从0x00到0x7fffff (0到231-1)的索引号将生成一个普通密钥; 从0x80000000到0xffffffff 的索引号将生成一个强化密钥。为了简化描述，许多开发人员使用素数符号来表示加强键，因此第一个普通键(0x00)为0，第一个加强键(0x80000000)为0。

(Bitcoin developers typically use the ASCII apostrophe rather than the unicode prime symbol, a convention we will henceforth follow.)

(比特币开发者通常使用 ASCII 撇号，而不是 unicode 素数符号，我们将遵循这一惯例。)

This compact description is further combined with slashes prefixed by *m* or *M* to indicate hierarchy and key type, with *m* being a private key and *M* being a public key. For example, m/0’/0/122’ refers to the 123rd hardened private child (by index number) of the first normal child (by index) of the first hardened child (by index) of the master private key. The following hierarchy illustrates prime notation and hardened key firewalls.

这种紧凑的描述进一步结合了前缀为 m 或 m 的斜杠，以表示层次结构和密钥类型，m 是私钥，m 是公钥。例如，m/0’/0/122’引用主私钥的第一个经过硬化的子元素(通过索引)的第一个正常子元素(通过索引)的第123个经过硬化的私有子元素(通过索引)。下面的层次结构说明了基本符号和硬化关键防火墙。

![Example HD Wallet Tree Using Prime Notation](https://developer.bitcoin.org/_images/en-hd-tree.svg)

Example HD Wallet Tree Using Prime Notation[](https://developer.bitcoin.org/devguide/wallets.html#id9 "Permalink to this image")

使用素数表示法的高清钱包树示例

Wallets following the [BIP32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki) HD protocol only create hardened children of the master private key (*m*) to prevent a compromised child key from compromising the master key. As there are no normal children for the master keys, the master public key is not used in HD wallets. All other keys can have normal children, so the corresponding extended public keys may be used instead.

钱包遵循 BIP32高清协议只创建硬化的主私人密钥(m)的子女，以防止一个妥协的子密钥从损害主密钥。由于没有正常的儿童为主密钥，主公钥是不使用的 HD 钱包。所有其他密钥都可以有正常的子密钥，因此可以使用相应的扩展公钥。

The HD protocol also describes a serialization format for extended public keys and extended private keys. For details, please see the [wallet section in the developer reference](https://developer.bitcoin.org/reference/wallets.html) or [BIP32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki) for the full HD protocol specification.

HD 协议还描述了扩展公钥和扩展私钥的序列化格式。详情请参阅开发者参考资料中的钱包部分，或者参阅完整的 HD 协议规范中的 BIP32。

#### Storing Root Seeds 储存根种子[](https://developer.bitcoin.org/devguide/wallets.html#storing-root-seeds "Permalink to this headline")

Root seeds in the HD protocol are 128, 256, or 512 bits of random data which must be backed up precisely. To make it more convenient to use non-digital backup methods, such as memorization or hand-copying, [BIP39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)defines a method for creating a 512-bit root seed from a pseudo-sentence (mnemonic) of common natural-language words which was itself created from 128 to 256 bits of entropy and optionally protected by a password.

HD 协议中的根种子是128、256或512位的随机数据，必须进行精确备份。为了更方便地使用非数字备份方法，如记忆或手工复制，BIP39定义了一种方法，可以从共同自然语言单词的伪句子(助记符)创建一个512位的根种子，该根种子本身由128位到256位熵创建，并可选地由密码保护。

The number of words generated correlates to the amount of entropy used:

生成的单词数量与使用的熵值相关:

| Entropy Bits熵位 | Words文字 |
| -------------- | ------- |
| 128            | 12图12   |
| 160            | 15图15   |
| 192            | 18图18   |
| 224            | 21图21   |
| 256            | 24图24   |

The passphrase can be of any length. It is simply appended to the mnemonic pseudo-sentence, and then both the mnemonic and password are hashed 2,048 times using HMAC-SHA512, resulting in a seemingly-random 512-bit seed. Because any input to the hash function creates a seemingly-random 512-bit seed, there is no fundamental way to prove the user entered the correct password, possibly allowing the user to protect a seed even when under duress.

密码短语可以是任意长度的。它被简单地附加到助记符伪句中，然后使用 HMAC-SHA512对助记符和密码进行了2048次散列处理，产生了一个看似随机的512位种子。由于哈希函数的任何输入都会创建一个看似随机的512位种子，因此没有基本的方法来证明用户输入了正确的密码，这可能使用户即使在胁迫下也能保护种子。

For implementation details, please see [BIP39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki).

有关实施细节，请参阅 BIP39。

### Loose-Key Wallets 宽松的钱包[](https://developer.bitcoin.org/devguide/wallets.html#loose-key-wallets "Permalink to this headline")

Loose-Key wallets, also called “Just a Bunch Of Keys (JBOK)”, are a deprecated form of wallet that originated from the Bitcoin Core client wallet. The Bitcoin Core client wallet would create 100 private key/public key pairs automatically via a Pseudo-Random-Number Generator (PRNG) for later use.

Loose-Key 钱包，也被称为“一串钥匙” ，是源于比特币核心客户端钱包的一种不赞成的钱包形式。比特币核心客户端钱包将通过伪随机数发生器(PRNG)自动创建100个私钥/公钥对，以供以后使用。

These unused private keys are stored in a virtual “key pool”, with new keys being generated whenever a previously-generated key was used, ensuring the pool maintained 100 unused keys. (If the wallet is encrypted, new keys are only generated while the wallet is unlocked.)

这些未使用的私钥存储在一个虚拟的“密钥池”中，每当使用先前生成的密钥时，就会生成新的密钥，从而确保该池维护100个未使用的密钥。(如果钱包是加密的，只有在钱包解锁时才会生成新的密钥。)

This created considerable difficulty in backing up one’s keys, considering backups have to be run manually to save the newly-generated private keys. If a new [key pair](https://developer.bitcoin.org/terms.html#term-key-pair) set is generated, used, and then lost prior to a backup, the stored satoshis are likely lost forever. Many older-style mobile wallets followed a similar format, but only generated a new private key upon user demand.

这在备份密钥方面造成了相当大的困难，因为必须手动运行备份以保存新生成的私有密钥。如果在备份之前生成、使用并丢失了一个新的密钥对集，那么存储的 satoshis 很可能会永远丢失。许多老式的移动钱包遵循类似的格式，但只是根据用户需求生成一个新的私钥。

This wallet type is being actively phased out and discouraged from being used due to the backup hassle.

这种钱包类型正在积极淘汰和劝阻被用于备份麻烦。
