---
title: 如何运行一个BSV创世全节点
summary: 运行一个BSV节点是入门实践的第一步![](./images/bsv-dragon.jpg)
date: 2020-05-12 16:00
lang: zh
tags: 
  - 比特币
  - 运行环境
---

运行一个BSV节点是入门实践的第一步

![在这里插入图片描述](./images/bsv-dragon.jpg)

我们有一台ubuntu服务器，4T SSD，16G MEMORY

文件下载网页

[https://bitcoinsv.io/genesis-hard-fork/#downloads](https://bitcoinsv.io/genesis-hard-fork/#downloads)

可参考的BTC的教程

[https://www.buildblockchain.tech/blog/btc-node-developers-guide](https://www.buildblockchain.tech/blog/btc-node-developers-guide)

首先下载BSV release包

（请下载使用最新版，目前是1.0.3， 以下的演示的版本为1.0.0）

> $ wget
> https://download.bitcoinsv.io/bitcoinsv/1.0.0.beta/bitcoin-sv-1.0.0.beta-x86_64-linux-gnu.tar.gz

具体下载地址请参照BSV网站，最好进行checksum校验

解压缩

> $ tar -zxvf bitcoin-sv-1.0.0.beta-x86_64-linux-gnu.tar.gz
> 
> $ls bitcoin-sv-1.0.0.beta
> 
> bin include lib README.md share

运行bitcoind

> $ ~/bitcoin-sv-1.0.0.beta/bin/bitcoind -daemon

查看log

> $ tail -f ~/.bitcoin/bitcoind.log

创建编辑bitcoin配置文件

> $ nano ./.bitcoin/bitcoin.conf

```bash
# Accept command line and JSON-RPC commands
server=1
# Index all transactions
txindex=1
# Whitelist only my Mac's local IP for JSON-RPC calls
rpcallowip=192.168.11.0/24
rpcport=8332
rpcuser=bitcoinsv
rpcpassword=satoshi.nakamoto
```

停止节点

> $ ./bitcoin-sv-1.0.0.beta/bin/bitcoin-cli stop
> 
> Bitcoin server stopping

启动节点

> $ ./bitcoin-sv-1.0.0.beta/bin/bitcoind -daemon
> 
> Bitcoin server starting

查看节点情况

> $ ./bitcoin-cli -rpcuser=bitcoinsv -rpcpassword=satoshi.nakamoto
> getinfo

```bash
{
  "version": 101000000,
  "protocolversion": 70015,
  "walletversion": 160300,
  "balance": 0.00000000,
  "blocks": 245344,
  "timeoffset": 0,
  "connections": 2,
  "proxy": "",
  "difficulty": 21335329.113983,
  "testnet": false,
  "stn": false,
  "keypoololdest": 1577154900,
  "keypoolsize": 2000,
  "paytxfee": 0.00000000,
  "relayfee": 0.00001000,
  "errors": "",
  "maxblocksize": 9223372036854775807,
  "maxminedblocksize": 128000000
}
```

从开发机器调用rpc访问节点

> % curl --user bitcoinsv --data-binary '{"jsonrpc": "1.0",
> "id":"curltest", "method": "getnetworkinfo", "params": [] }' -H
> 'content-type: text/plain;' http://192.168.11.220:8332
> 
> Enter host password for user 'bitcoinsv':
> 
> {"result":{"version":101000000,"subversion":"/Bitcoin
> SV:1.0.0(EB9223372036854.7)/","protocolversion":70015,"localservices":"0000000000000025","localrelay":true,"timeoffset":0,"txnpropagationfreq":250,"txnpropagationqlen":0,"networkactive":true,"connections":8,"addresscount":10354,"networks":[{"name":"ipv4","limited":false,"reachable":true,"proxy":"","proxy_randomize_credentials":false},{"name":"ipv6","limited":false,"reachable":true,"proxy":"","proxy_randomize_credentials":false},{"name":"onion","limited":true,"reachable":false,"proxy":"","proxy_randomize_credentials":false}],"relayfee":0.00001000,"excessutxocharge":0.00000000,"localaddresses":[],"warnings":""},"error":null,"id":"curltest"}

测试网络配置的介绍

[https://bitcoinsv.io/genesis-hard-fork/#config](https://bitcoinsv.io/genesis-hard-fork/#config)

GT测试网络浏览器

[https://gt.whatsonchain.com/](https://gt.whatsonchain.com/)

传统测试网络配置

```bash
# turn testnet on
testnet=3
# Accept command line and JSON-RPC commands
server=1


# Index all transactions
txindex=1


# Whitelist only my Mac's local IP for JSON-RPC calls
rpcallowip=192.168.11.0/24
rpcport=8332


rpcuser=bitcoinsv
rpcpassword=satoshi.nakamoto
```

GT测试网加入下面的设置

```bash
# turn GT testnet
stn=1
prune=10000
checkpoints=false 
minimumchainwork=0000000000000000000000000000000000000000000000000000000000000000 
magicbytes=a86b6744 
addnode=167.99.181.129:18333 
genesisactivationheight=290



# Accept command line and JSON-RPC commands
server=1


# Index all transactions, prune mode don&t support txindex
# txindex=1


# Whitelist only my Mac's local IP for JSON-RPC calls
rpcallowip=192.168.11.0/24
rpcport=8332


rpcuser=bitcoinsv
rpcpassword=satoshi.nakamoto
```

跟踪测试网络的log

> tail -f ~/.bitcoin/stn/bitcoind.log

享受真正的比特币，使用 [Note.SV](https://Note.SV)
