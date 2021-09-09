<template>
  <h1>Holders of SEP20 Token</h1>
  <div class="normal">
    The SEP20 token's address:
    <input v-model="sep20Address" type="text" placeholder="Please enter an SEP20 token's address here">
    <button @click="query">Query</button><br/>
    <pre id="result" style="font-size: 16px">
    </pre>
  </div>
</template>

<style>
input {
    font-size:20px;
    width:500px;
}
button {
    font-size:20px;
}
</style>

<script>
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default {
  data() {
    return {
      sep20Address: "",
    }
  },
  methods: {
    async query() {
      if (typeof window.ethereum === 'undefined') {
        alertNoWallet()
        return
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const sep20Contract = new ethers.Contract(this.sep20Address, SEP20ABI, provider);
      const decimals = await sep20Contract.decimals()
      const symbol = await sep20Contract.symbol()
      var toBlock = await provider.getBlockNumber()
      var filter = {
        address: this.sep20Address,
        topics: [
            ethers.utils.id("Transfer(address,address,uint256)"),
        ]
      }
      const preElem = document.getElementById("result")
      var accounts = {}
      const STEPS = 50000
      while(toBlock > 0) {
        filter.toBlock = toBlock
	filter.fromBlock = Math.max(toBlock-STEPS, 0)
	preElem.innerText = "Scanning blocks "+filter.fromBlock+"~"+filter.toBlock
        const logs = await provider.getLogs(filter)
	for(var i=0; i<logs.length; i++) {
	   accounts["0x"+logs[i].topics[1].substr(26)] = true
	   accounts["0x"+logs[i].topics[2].substr(26)] = true
	}
	toBlock -= STEPS
      }
      var keys = Object.keys(accounts)
      var acc2balance = {}
      for(var i=0; i<keys.length; i++) {
        const addr = ethers.utils.getAddress(keys[i])
	const balanceAmt = await sep20Contract.balanceOf(addr)
        const balance = ethers.utils.formatUnits(balanceAmt, decimals)
	acc2balance[addr] = parseFloat(balance)
        if(i%10==9) {
          preElem.innerText = "Query balances of possible holders: "+(i+1)+" of "+keys.length
	}
	if(i%100==99) {
	  for(var j=0; j<60; j++) {
            preElem.innerText = "Query balances of possible holders: "+(i+1)+" of "+keys.length
            preElem.innerText += "\n Now we need to pause for 1 minute ("+(60-j)+")..."
	    await sleep(1000);
	  }
	}
      }
      var keys = Object.keys(acc2balance)
      keys.sort(function(a,b) {
        return acc2balance[a] < acc2balance[b]
      })
      var allLines = []
      for(var i=0; i<keys.length; i++) {
        const addr = keys[i]
	if(acc2balance[addr] != 0) { 
          allLines.push(i+". "+addr+" "+acc2balance[addr])
	}
      }
      preElem.innerText = "There are "+allLines.length+" accounts owns "+symbol+":\n"
      preElem.innerText += allLines.join("\n")
    }
  }
}
</script>
