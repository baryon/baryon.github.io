---
title: 例子 - P2P 网络
summary: 比特币网络协议允许全节点协作地维护一个P2P（peer-to-peer）对等网络，用于块和交易交换
date: 2020-11-03 05:00
tags:
- 比特币
- 翻译
- 比特币开发指南

---

# P2P 网络例子

::: info

翻译自[P2P Network](https://developer.bitcoin.org/examples/p2p_networking.html)

:::

## 创建一个布隆过滤器 Bloom Filter

In this section, we’ll use variable names that correspond to the field names in the [`filterload` message documentation](https://developer.bitcoin.org/reference/p2p_networking.html#filterload). Each code block precedes the paragraph describing it.

在本节中，我们将使用与“ filterload”消息文档中的字段名对应的变量名。每个代码块都位于描述它的段落之前。

#!/usr/bin/env python

BYTES_MAX = 36000
FUNCS_MAX = 50

nFlags = 0

We start by setting some maximum values defined in [BIP37](https://github.com/bitcoin/bips/blob/master/bip-0037.mediawiki): the maximum number of bytes allowed in a filter and the maximum number of hash functions used to hash each piece of data. We also set nFlags to zero, indicating we don’t want the remote node to update the filter for us. (We won’t use nFlags again in the sample program, but real programs will need to use it.)

我们首先设置一些在 BIP37中定义的最大值: 过滤器中允许的最大字节数和哈希函数用于哈希每个数据块的最大数。我们还将 nFlags 设置为零，表示不希望远程节点为我们更新筛选器。(我们不会在示例程序中再次使用 nFlags，但真正的程序将需要使用它。)

n = 1
p = 0.0001

We define the number (n) of elements we plan to insert into the filter and the false positive rate (p) we want to help protect our privacy. For this example, we will set *n* to one element and *p* to a rate of 1-in-10,000 to produce a small and precise filter for illustration purposes. In actual use, your filters will probably be much larger.

我们定义计划插入到过滤器中的元素的数量(n)和我们希望帮助保护隐私的假阳性率(p)。对于这个示例，我们将 n 设置为一个元素，将 p 设置为1/10,000，以生成一个小而精确的过滤器，以便进行说明。在实际使用中，您的过滤器可能会大得多。

from math import log
nFilterBytes = int(min((-1 / log(2)**2 * n * log(p)) / 8, BYTES_MAX))
nHashFuncs = int(min(nFilterBytes * 8 / n * log(2), FUNCS_MAX))

from bitarray import bitarray  # from pypi.python.org/pypi/bitarray
vData = nFilterBytes * 8 * bitarray('0', endian="little")

Using the formula described in [BIP37](https://github.com/bitcoin/bips/blob/master/bip-0037.mediawiki), we calculate the ideal size of the filter (in bytes) and the ideal number of hash functions to use. Both are truncated down to the nearest whole number and both are also constrained to the maximum values we defined earlier. The results of this particular fixed computation are 2 filter bytes and 11 hash functions. We then use *nFilterBytes* to create a little-endian bit array of the appropriate size.

使用 BIP37中描述的公式，我们计算过滤器的理想大小(以字节为单位)和要使用的哈希函数的理想数量。两者都被截断为最接近的整数，并且都被限制为我们前面定义的最大值。这种固定计算的结果是2个过滤字节和11个哈希函数。然后，我们使用 nFilterBytes 创建适当大小的小尾位数组。

nTweak = 0

We also should choose a value for *nTweak*. In this case, we’ll simply use zero.

我们还应该为 nTweak 选择一个值。

import pyhash  # from https://github.com/flier/pyfasthash
murmur3 = pyhash.murmur3_32()

def bloom_hash(nHashNum, data):
    seed = (nHashNum * 0xfba4c795 + nTweak) & 0xffffffff
    return( murmur3(data, seed=seed) % (nFilterBytes * 8) )

We setup our hash function template using the formula and 0xfba4c795 constant set in [BIP37](https://github.com/bitcoin/bips/blob/master/bip-0037.mediawiki). Note that we limit the size of the seed to four bytes and that we’re returning the result of the hash modulo the size of the filter in bits.

我们使用 BIP37中的公式和0xfba4c795常量集设置散列函数模板。注意，我们将种子的大小限制为四个字节，并且我们返回的散列模数的结果是以位为单位的过滤器的大小。

data_to_hash = "019f5b01d4195ecbc9398fbf3c3b1fa9" \
               + "bb3183301d7a1fb3bd174fcfa40a2b65"
data_to_hash = data_to_hash.decode("hex")

For the data to add to the filter, we’re adding a TXID. Note that the TXID is in internal byte order.

对于要添加到过滤器的数据，我们添加一个 TXID。请注意，TXID 是按内部字节顺序排列的。

print "                             Filter (As Bits)"
print "nHashNum   nIndex   Filter   0123456789abcdef"
print "~~~~~~~~   ~~~~~~   ~~~~~~   ~~~~~~~~~~~~~~~~"
for nHashNum in range(nHashFuncs):
    nIndex = bloom_hash(nHashNum, data_to_hash)

    ## Set the bit at nIndex to 1
    vData[nIndex] = True
    
    ## Debug: print current state
    print ' {0:2} {1:2} {2} {3}'.format(
        nHashNum,
        hex(int(nIndex)),
        vData.tobytes().encode("hex"),
        vData.to01()
    )

print
print "Bloom filter:", vData.tobytes().encode("hex")

Now we use the hash function template to run a slightly different hash function for *nHashFuncs* times. The result of each function being run on the transaction is used as an index number: the bit at that index is set to 1. We can see this in the printed debugging output:

现在，我们使用 hash 函数模板为 nHashFuncs 时间运行稍微不同的 hash 函数。在事务上运行的每个函数的结果都用作索引号: 该索引处的位被设置为1。我们可以在打印的调试输出中看到这一点:

                             Filter (As Bits)

nHashNum   nIndex   Filter   0123456789abcdef

~~~~~~~~   ~~~~~~   ~~~~~~   ~~~~~~~~~~~~~~~~
       0      0x7     8000   0000000100000000
       1      0x9     8002   0000000101000000
       2      0xa     8006   0000000101100000
       3      0x2     8406   0010000101100000
       4      0xb     840e   0010000101110000
       5      0x5     a40e   0010010101110000
       6      0x0     a50e   1010010101110000
       7      0x8     a50f   1010010111110000
       8      0x5     a50f   1010010111110000
       9      0x8     a50f   1010010111110000
      10      0x4     b50f   1010110111110000
Bloom filter: b50f

Notice that in iterations 8 and 9, the filter did not change because the corresponding bit was already set in a previous iteration (5 and 7, respectively). This is a normal part of bloom filter operation.

注意，在第8和第9次迭代中，过滤器没有改变，因为相应的位已经在前一次迭代中设置好了(分别是第5和第7次迭代)。这是开花过滤器正常运行的一部分。

We only added one element to the filter above, but we could repeat the process with additional elements and continue to add them to the same filter. (To maintain the same false-positive rate, you would need a larger filter size as computed earlier.)

我们只在上面的过滤器中添加了一个元素，但是我们可以使用其他元素重复这个过程，并继续将它们添加到同一个过滤器中。(为了保持相同的假阳性率，您需要像前面计算的那样使用更大的过滤器大小。)

Note: for a more optimized Python implementation with fewer external dependencies, see [python-bitcoinlib’s](https://github.com/petertodd/python-bitcoinlib)bloom filter module which is based directly on Bitcoin Core’s C++ implementation.

注意: 如果想要一个外部依赖性更少的优化 Python 实现，请参见 Python-bitcoinlib 的 bloom filter 模块，该模块直接基于 Bitcoin Core 的 c + + 实现。

Using the [`filterload` message](https://developer.bitcoin.org/reference/p2p_networking.html#filterload) format, the complete filter created above would be the binary form of the annotated hexdump shown below:

使用“ filterload”消息格式，上面创建的完整过滤器将是下面所示的带注释的 hexdump 的二进制形式:

02 ......... Filter bytes: 2
b50f ....... Filter: 1010 1101 1111 0000
0b000000 ... nHashFuncs: 11
00000000 ... nTweak: 0/none
00 ......... nFlags: BLOOM_UPDATE_NONE

## 评估布隆过滤器

Using a bloom filter to find matching data is nearly identical to constructing a bloom filter—except that at each step we check to see if the calculated index bit is set in the existing filter.

使用 bloom filter 查找匹配数据几乎与构造 bloom filter 相同ーー除了在每一步我们都要检查计算出的索引位是否设置在现有的 filter 中。

vData = bitarray(endian='little')
vData.frombytes("b50f".decode("hex"))
nHashFuncs = 11
nTweak = 0
nFlags = 0

Using the bloom filter created above, we import its various parameters. Note, as indicated in the section above, we won’t actually use *nFlags* to update the filter.

使用上面创建的 bloom filter，我们导入它的各种参数。注意，如上面一节所示，我们实际上不会使用 nFlags 来更新过滤器。

def contains(nHashFuncs, data_to_hash):
    for nHashNum in range(nHashFuncs):
        ## bloom_hash as defined in previous section
        nIndex = bloom_hash(nHashNum, data_to_hash)

        if vData[nIndex] != True:
            print "MATCH FAILURE: Index {0} not set in {1}".format(
                hex(int(nIndex)),
                vData.to01()
            )
            return False

We define a function to check an element against the provided filter. When checking whether the filter might contain an element, we test to see whether a particular bit in the filter is already set to 1 (if it isn’t, the match fails).

我们定义了一个函数，用于根据提供的过滤器检查元素。在检查过滤器是否可能包含元素时，我们会测试过滤器中的特定位是否已经设置为1(如果不是，匹配就失败)。

## Test 1: Same TXID as previously added to filter

data_to_hash = "019f5b01d4195ecbc9398fbf3c3b1fa9" \
               + "bb3183301d7a1fb3bd174fcfa40a2b65"
data_to_hash = data_to_hash.decode("hex")
contains(nHashFuncs, data_to_hash)

Testing the filter against the data element we previously added, we get no output (indicating a possible match). Recall that bloom filters have a zero false negative rate—so they should always match the inserted elements.

根据我们前面添加的数据元素测试过滤器时，没有得到输出(表示可能的匹配)。回想一下 bloom 过滤器的误报率为零，所以它们应该始终匹配插入的元素。

## Test 2: Arbitrary string

data_to_hash = "1/10,000 chance this ASCII string will match"
contains(nHashFuncs, data_to_hash)

Testing the filter against an arbitrary element, we get the failure output below. Note: we created the filter with a 1-in-10,000 false positive rate (which was rounded up somewhat when we truncated), so it was possible this arbitrary string would’ve matched the filter anyway. It is not possible to set a bloom filter to a false positive rate of zero, so your program will always have to deal with false positives. The output below shows us that one of the hash functions returned an index number of 0x06, but that bit wasn’t set in the filter, causing the match failure:

测试针对任意元素的过滤器，我们得到下面的故障输出。注意: 我们创建了一个1/10,000的假阳性率的过滤器(当我们截断时，这个假阳性率被舍入了一些) ，所以这个任意的字符串可能已经匹配了这个过滤器。不可能将 bloom filter 设置为假阳性率为零，因此您的程序将总是不得不处理假阳性。下面的输出显示，其中一个散列函数返回的索引号为0x06，但是这个位没有在过滤器中设置，导致匹配失败:

MATCH FAILURE: Index 0x6 not set in 1010110111110000

## Retrieving A MerkleBlock 检索 MerkleBlock

For the [`merkleblock` message](https://developer.bitcoin.org/reference/p2p_networking.html#merkleblock) documentation on the reference page, an actual merkle block was retrieved from the [network](https://developer.bitcoin.org/devguide/p2p_network.html) and manually processed. This section walks through each step of the process, demonstrating basic [network](https://developer.bitcoin.org/devguide/p2p_network.html) communication and merkle block processing.

对于参考页面上的`merkleblock`消息文档，实际的 merkle 块是从网络中检索并手动处理的。本节将介绍该过程的每个步骤，演示基本的网络通信和 merkle 块处理。

#!/usr/bin/env python

from time import sleep
from hashlib import sha256
import struct
import sys

network_string = "f9beb4d9".decode("hex")  # Mainnet

def send(msg,payload):
    ## Command is ASCII text, null padded to 12 bytes
    command = msg + ( ( 12 - len(msg) ) * "\00" )

    ## Payload length is a uint32_t
    payload_raw = payload.decode("hex")
    payload_len = struct.pack("I", len(payload_raw))
    
    ## Checksum is first 4 bytes of SHA256(SHA256(<payload>))
    checksum = sha256(sha256(payload_raw).digest()).digest()[:4]
    
    sys.stdout.write(
        network_string
        + command
        + payload_len
        + checksum
        + payload_raw
    )
    sys.stdout.flush()

To connect to the P2P [network](https://developer.bitcoin.org/devguide/p2p_network.html), the trivial Python function above was developed to compute message headers and send payloads decoded from hex.

为了连接到 P2P 网络，开发了上面的微型 Python 函数来计算消息报头并发送由十六进制解码的有效负载。

## Create a version message

send("version",
      "71110100" # ........................ Protocol Version: 70001
    + "0000000000000000" # ................ Services: Headers Only (SPV)
    + "c6925e5400000000" # ................ Time: 1415484102
    + "00000000000000000000000000000000"
    + "0000ffff7f000001208d" # ............ Receiver IP Address/Port
    + "00000000000000000000000000000000"
    + "0000ffff7f000001208d" # ............ Sender IP Address/Port
    + "0000000000000000" # ................ Nonce (not used here)
    + "1b" # .............................. Bytes in version string
    + "2f426974636f696e2e6f726720457861"
    + "6d706c653a302e392e332f" # .......... Version string
    + "93050500" # ........................ Starting block height: 329107
    + "00" # .............................. Relay transactions: false
)

Peers on the [network](https://developer.bitcoin.org/devguide/p2p_network.html) will not accept any requests until you send them a [`version` message](https://developer.bitcoin.org/reference/p2p_networking.html#version). The receiving node will reply with their [`version` message](https://developer.bitcoin.org/reference/p2p_networking.html#version) and a [`verack` message](https://developer.bitcoin.org/reference/p2p_networking.html#verack).

网络上的对等点将不会接受任何请求，直到您向他们发送“版本”消息。接收节点将用`version`消息和`verack`消息进行回复。

sleep(1)
send("verack", "")

We’re not going to validate their [`version` message](https://developer.bitcoin.org/reference/p2p_networking.html#version) with this simple script, but we will sleep a short bit and send back our own [`verack` message](https://developer.bitcoin.org/reference/p2p_networking.html#verack) as if we had accepted their [`version` message](https://developer.bitcoin.org/reference/p2p_networking.html#version).

我们不会用这个简单的脚本来验证他们的`version`消息，但是我们会睡一小会儿，然后发回我们自己的`verack`消息，就好像我们已经接受了他们的“`version`息一样。

send("filterload",
      "02"  # ........ Filter bytes: 2
    + "b50f" # ....... Filter: 1010 1101 1111 0000
    + "0b000000" # ... nHashFuncs: 11
    + "00000000" # ... nTweak: 0/none
    + "00" # ......... nFlags: BLOOM_UPDATE_NONE
)

We set a bloom filter with the [`filterload` message](https://developer.bitcoin.org/reference/p2p_networking.html#filterload). This filter is described in the two preceeding sections.

我们设置了一个带有“ filterload”消息的 bloom filter。

send("getdata",
      "01" # ................................. Number of inventories: 1
    + "03000000" # ........................... Inventory type: filtered block
    + "a4deb66c0d726b0aefb03ed51be407fb"
    + "ad7331c6e8f9eef231b7000000000000" # ... Block header hash
)

We request a merkle block for transactions matching our filter, completing our script.

我们为事务请求一个与我们的过滤器匹配的 merkle 块，完成我们的脚本。

To run the script, we simply pipe it to the Unix `` `netcat`` command <[netcat - Wikipedia](https://en.wikipedia.org/wiki/Netcat)>`__ or one of its many clones, one of which is available for practically any platform. For example, with the original netcat and using hexdump (`hd`) to display the output:

为了运行这个脚本，我们只需将它通过管道传送到 Unix 的 netcat 命令 < https://en.wikipedia.org/wiki/netcat > ’或者它的许多克隆中的一个，其中一个实际上可用于任何平台。例如，使用原始的 netcat 并使用 hexdump (hd)来显示输出:

## Connect to the Bitcoin Core peer running on localhost

python get-merkle.py | nc localhost 8333 | hd

Part of the response is shown in the section below.

响应的一部分显示在下面一节中。

## Parsing A MerkleBlock 解析 MerkleBlock

In the section above, we retrieved a merkle block from the [network](https://developer.bitcoin.org/devguide/p2p_network.html); now we will parse it. Most of the block header has been omitted. For a more complete hexdump, see the example in the `` `merkleblock`` message section <../reference/p2p_networking.html#merkleblock>`__.

在上面的部分中，我们从网络中检索了一个 merkle 块; 现在我们将解析它。大多数块头被省略了。有关更完整的 hexdump，请参见“ merkleblock message”部分中的示例 < 。./reference/p2p _ networking.html # merkleblock > ‘ _。

7f16c5962e8bd963659c793ce370d95f
093bc7e367117b3c30c1f8fdd0d97287 ... Merkle root
07000000 ........................... Transaction count: 7
04 ................................. Hash count: 4
3612262624047ee87660be1a707519a4
43b1c1ce3d248cbfc6c15870f6c5daa2 ... Hash #1
019f5b01d4195ecbc9398fbf3c3b1fa9
bb3183301d7a1fb3bd174fcfa40a2b65 ... Hash #2
41ed70551dd7e841883ab8f0b16bf041
76b7d1480e4f0af9f3d4c3595768d068 ... Hash #3
20d2a7bc994987302e5b1ac80fc425fe
25f8b63169ea78e68fbaaefa59379bbf ... Hash #4
01 ................................. Flag bytes: 1
1d ................................. Flags: 1 0 1 1 1 0 0 0

We parse the above [`merkleblock` message](https://developer.bitcoin.org/reference/p2p_networking.html#merkleblock) using the following instructions. Each illustration is described in the paragraph below it.

我们使用下面的说明来解析上面的`merkleblock`消息。

![Parsing A MerkleBlock](https://developer.bitcoin.org/_images/en-merkleblock-parsing-001.svg)

Parsing A MerkleBlock[](https://developer.bitcoin.org/examples/p2p_networking.html#id1 "Permalink to this image")

解析 MerkleBlock

We start by building the structure of a merkle tree based on the number of transactions in the block.

我们首先根据块中的事务数量构建 merkle 树的结构。

![Parsing A MerkleBlock](https://developer.bitcoin.org/_images/en-merkleblock-parsing-002.svg)

Parsing A MerkleBlock[](https://developer.bitcoin.org/examples/p2p_networking.html#id2 "Permalink to this image")

解析 MerkleBlock

The first flag is a 1 and the merkle root is (as always) a non-TXID node, so we will need to compute the hash later based on this node’s children. Accordingly, we descend into the merkle root’s left child and look at the next flag for instructions.

第一个标志是1，merkle root (一如既往)是非 txid 节点，因此稍后我们需要根据该节点的子节点计算散列。因此，我们下降到 merkle 根的左子节点，查看下一个标志以获取指令。

![Parsing A MerkleBlock](https://developer.bitcoin.org/_images/en-merkleblock-parsing-003.svg)

Parsing A MerkleBlock[](https://developer.bitcoin.org/examples/p2p_networking.html#id3 "Permalink to this image")

解析 MerkleBlock

The next flag in the example is a 0 and this is also a non-TXID node, so we apply the first hash from the [`merkleblock` message](https://developer.bitcoin.org/reference/p2p_networking.html#merkleblock) to this node. We also don’t process any child nodes—according to the peer which created the [`merkleblock` message](https://developer.bitcoin.org/reference/p2p_networking.html#merkleblock), none of those nodes will lead to TXIDs of transactions that match our filter, so we don’t need them. We go back up to the merkle root and then descend into its right child and look at the next (third) flag for instructions.

示例中的下一个标志是0，这也是一个非 txid 节点，因此我们将`merkleblock`消息中的第一个散列应用到该节点。我们也不处理任何子节点ー根据创建“`merkleblock`息的对等节点，这些节点都不会导致匹配我们过滤器的事务的 txid，因此我们不需要它们。我们返回到 merkle 根，然后下降到它的右子节点，并查看下一个(第三个)标志以获取指令。

![Parsing A MerkleBlock](https://developer.bitcoin.org/_images/en-merkleblock-parsing-004.svg)

Parsing A MerkleBlock[](https://developer.bitcoin.org/examples/p2p_networking.html#id4 "Permalink to this image")

解析 MerkleBlock

The third flag in the example is another 1 on another non-TXID node, so we descend into its left child.

该示例中的第三个标志是另一个非 txid 节点上的另一个1，因此我们深入到它的左子节点。

![Parsing A MerkleBlock](https://developer.bitcoin.org/_images/en-merkleblock-parsing-005.svg)

Parsing A MerkleBlock[](https://developer.bitcoin.org/examples/p2p_networking.html#id5 "Permalink to this image")

解析 MerkleBlock

The fourth flag is also a 1 on another non-TXID node, so we descend again—we will always continue descending until we reach a TXID node or a non-TXID node with a 0 flag (or we finish filling out the tree).

第四个标志也是另一个非 TXID 节点上的1，因此我们再次下降ーー我们将始终继续下降，直到到达一个 TXID 节点或一个带有0标志的非 TXID 节点(或者我们完成了树的填充)。

![Parsing A MerkleBlock](https://developer.bitcoin.org/_images/en-merkleblock-parsing-006.svg)

Parsing A MerkleBlock[](https://developer.bitcoin.org/examples/p2p_networking.html#id6 "Permalink to this image")

解析 MerkleBlock

Finally, on the fifth flag in the example (a 1), we reach a TXID node. The 1 flag indicates this TXID’s transaction matches our filter and that we should take the next (second) hash and use it as this node’s TXID.

最后，在示例(a 1)中的第五个标志上，我们到达一个 TXID 节点。1标志表示这个 TXID 的事务与我们的过滤器匹配，我们应该接受下一个(第二个)散列并将其用作这个节点的 TXID。

![Parsing A MerkleBlock](https://developer.bitcoin.org/_images/en-merkleblock-parsing-007.svg)

Parsing A MerkleBlock[](https://developer.bitcoin.org/examples/p2p_networking.html#id7 "Permalink to this image")

解析 MerkleBlock

The sixth flag also applies to a TXID, but it’s a 0 flag, so this TXID’s transaction doesn’t match our filter; still, we take the next (third) hash and use it as this node’s TXID.

第六个标志也应用于 TXID，但它是一个0标志，因此该 TXID 的事务与我们的过滤器不匹配; 但是，我们仍然使用下一个(第三个)散列并将其作为该节点的 TXID。

![Parsing A MerkleBlock](https://developer.bitcoin.org/_images/en-merkleblock-parsing-008.svg)

Parsing A MerkleBlock[](https://developer.bitcoin.org/examples/p2p_networking.html#id8 "Permalink to this image")

解析 MerkleBlock

We now have enough information to compute the hash for the fourth node we encountered—it’s the hash of the concatenated hashes of the two TXIDs we filled out.

现在我们有足够的信息来计算遇到的第四个节点的哈希值ーー它是我们填写的两个 txid 的连接哈希的哈希值。

![Parsing A MerkleBlock](https://developer.bitcoin.org/_images/en-merkleblock-parsing-009.svg)

Parsing A MerkleBlock[](https://developer.bitcoin.org/examples/p2p_networking.html#id9 "Permalink to this image")

解析 MerkleBlock

Moving to the right child of the third node we encountered, we fill it out using the seventh flag and final hash—and discover there are no more child nodes to process.

移动到我们遇到的第三个节点的正确子节点，我们使用第七个标志和最终散列填充它，然后发现没有更多的子节点需要处理。

![Parsing A MerkleBlock](https://developer.bitcoin.org/_images/en-merkleblock-parsing-011.svg)

Parsing A MerkleBlock[](https://developer.bitcoin.org/examples/p2p_networking.html#id10 "Permalink to this image")

解析 MerkleBlock

We hash as appropriate to fill out the tree. Note that the eighth flag is not used—this is acceptable as it was required to pad out a flag byte.

我们根据需要散列以填写这棵树。注意，第八个标志没有被使用ーー这是可以接受的，因为它需要填充一个标志字节。

The final steps would be to ensure the computed merkle root is identical to the merkle root in the header and check the other steps of the parsing checklist in the [`merkleblock` message](https://developer.bitcoin.org/reference/p2p_networking.html#merkleblock) section.

最后的步骤是确保计算出的 merkle 根与头中的 merkle 根相同，并在`merkleblock`消息部分中检查解析清单的其他步骤。
