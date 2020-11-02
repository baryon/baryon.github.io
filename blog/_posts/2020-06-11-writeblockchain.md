---

title: 写一个区块链的概念原型
summary: 一段代码演示了区块链的基本概念：区块，链，挖矿，难度
date: 2020-06-11 16:00
lang: zh
tags: 
- 区块链
- 运行环境

---

# 一个区块链原型

比特币区块链说神秘说复杂，它也是人创造出来。我们用几行代码写一个简单的原型。

说明都写在每行代码前面

```js
const tracer = require('tracer').colorConsole()
const console = tracer
const bitcoin = require('bsv')

//挖矿的尝试次数
const maxTried = 100000//Number.MAX_VALUE

//区块
class Block {
    constructor(data, previousHash, difficulty) {
        this.data = data.toString() //区块数据
        this.previousHash = previousHash //前一个区块的哈希值
        this.timestamp = Date.now().toString() //当前区块的时间戳
        this.difficulty = difficulty //难度
        this.mine() //挖矿，计算本区块的哈希值
    }

    //计算哈希值
    hash256() {
        const str = this.previousHash + this.data + this.timestamp + this.answer.toString()
        return bitcoin.crypto.Hash.sha256(Buffer.from(str, 'utf8')).toString('hex')
    }

    //挖矿
    mine() {
        //不断修改answer的值，计算区块哈希值，要求获取的哈希值前面必须有指定难度数量的0
        this.answer = -1
        do {
            this.answer++
            if(this.answer >= maxTried) {
                throw Error('No Answer')
            }
            this.hash = this.hash256()
        } while(this.hash.substr(0, this.difficulty) !== '0'.repeat(this.difficulty))
    }


}

//区块链
class Blockchain {
    constructor(genesis) {   
        //包含创世区块 
        this.chain = [genesis]
    }

    //检测区块是否有效，要求每一个新的区块都包含前一个区块的哈希值
    isValid() {
        //循环检测除创世区块之外的所有区块
        for(let i=1; i<this.chain.length; i++) {
            const currentBlock = this.chain[i]
            const previoudBlock = this.chain[i-1]
            //计算当前区块的哈希值是否正确地被计算
            if(currentBlock.hash != currentBlock.hash256()) {
                console.debug(currentBlock.hash, currentBlock.hash256())
                return false
            }
            //前一个区块的哈希值应该等于当前区块保存的值
            if(previoudBlock.hash != currentBlock.previousHash) {
                console.debug(previoudBlock.hash, currentBlock.previousHash)
                return false
            }
            //当前区块的哈希值符合难度要求
            if(currentBlock.hash.substr(0, currentBlock.difficulty) !== '0'.repeat(currentBlock.difficulty)) {
                console.debug(currentBlock.hash.substr(0, currentBlock.difficulty) , '0'.repeat(currentBlock.difficulty))
                return false
            }
        }
        return true
    }

    //添加一个新的区块
    append(data, difficulty) {
        const newBlock = new Block(data, this.chain[this.chain.length-1].hash, difficulty)
        this.chain.push(newBlock)
    }

}

//创世区块, 前一个区块的哈希值设为0， 难度为0，也就是hash前面不需要有0
const genesisBlock = new Block('Born', 0, 0)
//创建区块链
const blockchain = new Blockchain(genesisBlock)
//不断追加新的区块，难度不断增加
blockchain.append('Love', 1)
blockchain.append('Marry', 2)
blockchain.append('Life', 3)
blockchain.append('How to change your wife(life) in 21 days', 4)
//输出所有的区块
console.log(blockchain.chain)
//检查区块链的有效性
console.log(blockchain.isValid())
```

**一种可能**的运行结果

```bash
[
  Block {
    data: 'Born',
    previousHash: 0,
    timestamp: '1591838675564',
    difficulty: 0,
    answer: 0,
    hash: '01cf61bbf7046125aeebb26970fc1c0634860a15ba281c9bd4026dc743e20d2d'
  },
  Block {
    data: 'Love',
    previousHash: '01cf61bbf7046125aeebb26970fc1c0634860a15ba281c9bd4026dc743e20d2d',
    timestamp: '1591838675565',
    difficulty: 1,
    answer: 2,
    hash: '0fe6e95260b8ab357761eec89032e354ff67a8b56cb2d61d0e4aa505acab3211'
  },
  Block {
    data: 'Marry',
    previousHash: '0fe6e95260b8ab357761eec89032e354ff67a8b56cb2d61d0e4aa505acab3211',
    timestamp: '1591838675565',
    difficulty: 2,
    answer: 9,
    hash: '005a3cadb9caa0dd2f5488325fc29f0b448d9c0ceb4b1ae2a1cdd78c4f5190a7'
  },
  Block {
    data: 'Life',
    previousHash: '005a3cadb9caa0dd2f5488325fc29f0b448d9c0ceb4b1ae2a1cdd78c4f5190a7',
    timestamp: '1591838675565',
    difficulty: 3,
    answer: 1277,
    hash: '0002a9bf4f568a9c4b3f8694de2aeef6a6f8e1a459486883859249d0ab23cf66'
  },
  Block {
    data: 'How to change your wife(life) in 21 days',
    previousHash: '0002a9bf4f568a9c4b3f8694de2aeef6a6f8e1a459486883859249d0ab23cf66',
    timestamp: '1591838675575',
    difficulty: 4,
    answer: 20139,
    hash: '0000ee25262cb5701b95d655e73eeed4c551384ce71b0815e694d0bc30455010'
  }
]
```

为什么说是“一种可能的运行结果“呢？聪明的你可以给我留言。

可以运行的代码库在：[https://github.com/baryon/blockchain-prototype](https://github.com/baryon/blockchain-prototype) 

享受真正的比特币，使用 [Note.SV](https://Note.SV)
