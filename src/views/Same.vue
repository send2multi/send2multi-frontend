<template>
  <h1>Send the Same Amount of Coins to Addresses</h1>
  <div class="normal">
   <table style="margin: auto">
   <tr><td><b>SEP20 Token's Address</b><br/>
   (Click <button @click="useBCH">here</button> if you want to send BCH)</td>
   <td><input v-model="sep20Address" type="text" placeholder="Please enter an address in HEX format"></td></tr>
   <tr><td><b>The Amount Sent to Each Address</b></td>
   <td><input v-model="amount" type="number" placeholder="Please enter a number"></td></tr>
   <tr><td><b>Address List</b><br/>You can also paste any text in the right text area, and
   click <button @click="extract">extract</button> to extract addresses from it.</td>
   <td><textarea v-model="addressList" placeholder="Please enter one address in each line" rows="10" cols="100"></textarea></td></tr>
   </table>
   <div style="margin: auto; width: 40%"><br/>
   <button @click="submit" style="font-size: 24px; width: 300px">Send</button></div>
   <!--
   <div style="margin: auto; width: 40%"><br/>
   <button @click="deploy" style="font-size: 24px; width: 300px">Deploy</button></div>
   -->
  </div>
</template>

<style>
input {
    font-size:20px;
    width:500px;
}
textarea {
    font-size:18px;
    width:500px;
}
</style>

<script>
function getAddrList(text) {
  var lines = text.split("\n")
  if (lines.length == 0) {
    alert("No address entered")
    return
  }
  var addrList = []
  for(let line of lines) {
    line = line.trim()
    if(line.length==0) {
      continue
    }
    try {
      addrList.push(ethers.utils.getAddress(line))
    } catch(e) {
      alert("Failed to parse "+line+" Error "+e.toString())
      console.log(e)
    }
  }
  return addrList
}

function extractAddrList(text, sep20Address) {
  var entries = text.split("0x")
  var addrSet = {}
  for(let entry of entries) {
    if(entry.length < 40) {
      continue
    }
    try {
      const addr = ethers.utils.getAddress("0x"+entry.substr(0,40))
      addrSet[addr] = true
    } catch(e) {
      console.log(e)
    }
  }
  delete addrSet[sep20Address]
  var coins = Object.keys(addrSet)
  coins.sort()
  return coins.join("\n")
}

export default {
  data() {
    return {
      sep20Address: "",
      amount: 0,
      addressList: ""
    }
  },
  methods: {
    extract() {
       this.addressList = extractAddrList(this.addressList, this.sep20Address)
    },
    useBCH() {
       this.sep20Address = "0x0000000000000000000000000000000000002711"
    },
    async deploy() {
      const bytecode = "0x608060405234801561001057600080fd5b506104f1806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c8063c44465a71461003b578063f438249c14610050575b600080fd5b61004e6100493660046103bf565b610063565b005b61004e61005e36600461036e565b610188565b60005b8181101561018157600080866001600160a01b03163386868681811061009c57634e487b7160e01b600052603260045260246000fd5b90506020020160208101906100b1919061034d565b886040516024016100c493929190610470565b60408051601f198184030181529181526020820180516001600160e01b03166323b872dd60e01b179052516100f99190610437565b6000604051808303816000865af19150503d8060008114610136576040519150601f19603f3d011682016040523d82523d6000602084013e61013b565b606091505b50915091506000818060200190518101906101569190610417565b90508280156101625750805b61016b57600080fd5b505050808061017990610494565b915050610066565b5050505050565b60005b818110156102e25760008383838181106101b557634e487b7160e01b600052603260045260246000fd5b905060200201359050600060608585858181106101e257634e487b7160e01b600052603260045260246000fd5b90506020020135901c60601b60601c9050600080876001600160a01b03163384866bffffffffffffffffffffffff1660405160240161022393929190610470565b60408051601f198184030181529181526020820180516001600160e01b03166323b872dd60e01b179052516102589190610437565b6000604051808303816000865af19150503d8060008114610295576040519150601f19603f3d011682016040523d82523d6000602084013e61029a565b606091505b50915091506000818060200190518101906102b59190610417565b90508280156102c15750805b6102ca57600080fd5b505050505080806102da90610494565b91505061018b565b50505050565b80356001600160a01b03811681146102ff57600080fd5b919050565b60008083601f840112610315578182fd5b50813567ffffffffffffffff81111561032c578182fd5b602083019150836020808302850101111561034657600080fd5b9250929050565b60006020828403121561035e578081fd5b610367826102e8565b9392505050565b600080600060408486031215610382578182fd5b61038b846102e8565b9250602084013567ffffffffffffffff8111156103a6578283fd5b6103b286828701610304565b9497909650939450505050565b600080600080606085870312156103d4578081fd5b6103dd856102e8565b935060208501359250604085013567ffffffffffffffff8111156103ff578182fd5b61040b87828801610304565b95989497509550505050565b600060208284031215610428578081fd5b81518015158114610367578182fd5b60008251815b81811015610457576020818601810151858301520161043d565b818111156104655782828501525b509190910192915050565b6001600160a01b039384168152919092166020820152604081019190915260600190565b60006000198214156104b457634e487b7160e01b81526011600452602481fd5b506001019056fea2646970667358221220a410123655bf29aa374de2c8aadd8cae3f3002dd307121dfb7af768fb0e610a264736f6c63430008000033";
  
      // A Human-Readable ABI; we only need to specify relevant fragments,
      // in the case of deployment this means the constructor
      const abi = [
          "constructor() public"
      ];
      
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      try {
        const signer = provider.getSigner()
        const factory = new ethers.ContractFactory(abi, bytecode, signer)
        const contract = await factory.deploy();
        console.log("address:", contract.address)
        const receipt = await contract.deployTransaction.wait();
	console.log(receipt)
      } catch(e) {
        alert("Error! "+e.toString())
      }
    },
    async submit() {
      if (typeof window.ethereum === 'undefined') {
        alertNoWallet()
        return
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const sep20Contract = new ethers.Contract(this.sep20Address, SEP20ABI, provider);
      const s2mContract = new ethers.Contract(SEND2MULTIADDR, SEND2MULTIABI, provider);
      try {
        const signer = provider.getSigner()
        const symbol = await sep20Contract.symbol()
        const decimals = await sep20Contract.decimals()
	const allowanceAmt = await sep20Contract.allowance(signer.getAddress(), SEND2MULTIADDR)
        const allowance = ethers.utils.formatUnits(allowanceAmt, decimals)
	const balanceAmt = await sep20Contract.balanceOf(signer.getAddress())
        const balance = ethers.utils.formatUnits(balanceAmt, decimals)
	const addrList = getAddrList(this.addressList)
	if(addrList.length == 0) {
	  return
	}
	//if(this.amount == 0) {
	//  alert("Cannot send zero coins!")
	//  return
	//}
	const totalAmt = this.amount * addrList.length
	if(balance < this.amount * addrList.length) {
	  alert("You do not own enough "+symbol+" to send! "
	    + balance + " < " + totalAmt)
	  return
	}
	if(allowance < totalAmt) {
	  alert("You have not approved enough "+symbol+" to the send2multi contract! "
	    + allowance + " < " + totalAmt)
	  return
	}
	const okToSend = confirm("Are you sure to send "+this.amount+" "+symbol+" to the addresses (totally "+totalAmt+")?")
	if(!okToSend) {
	  return
	}
        const sendAmt = ethers.utils.parseUnits(this.amount.toString(), decimals)
	const connectedContract = s2mContract.connect(signer)
        const gas = await connectedContract.estimateGas.sendWithSameValue(this.sep20Address, sendAmt, addrList)
	if(gas > 9000000) {
	  alert("The gas consumption is too high! Transaction may fail. Please reduce the address count.")
	  return
	}
        var gasPrice = await provider.getStorageAt("0x0000000000000000000000000000000000002710","0x00000000000000000000000000000000000000000000000000000000000000002")
	if(gasPrice == "0x") {
	  gasPrice = "0x0"
	}
        await connectedContract.sendWithSameValue(this.sep20Address, sendAmt, addrList, {gasPrice: gasPrice})
      } catch(e) {
        alert("Error! "+e.toString())
	console.log(e)
      }
    }
  },
  async mounted() {
    if (typeof window.ethereum === 'undefined') {
      alertNoWallet()
      return
    }
    if (this.$route.params.sep20Address && this.$route.params.sep20Address.length != 0) {
       try {
         const addr = ethers.utils.getAddress(this.$route.params.sep20Address)
	 this.sep20Address = this.$route.params.sep20Address
      } catch(e) {
         alert(this.$route.params.sep20Address+" is not a valid address! "+e.toString())
	 console.log(e)
       }
    }
  }
}
</script>
