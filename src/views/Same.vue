<template>
  <h1>Send the Same Amount of Coins to Addresses</h1>
  <div class="normal">
   <table style="margin: auto">
   <tr><td>SEP20 Token's Address<br/>(enter 0x2711 for BCH)</td>
   <td><input v-model="sep20Address" type="text" placeholder="Please enter an address in HEX format"></td></tr>
   <tr><td>The Amount Sent to Each Address</td>
   <td><input v-model="amount" type="number" placeholder="Please enter a number"></td></tr>
   <tr><td>Address List</td>
   <td><textarea v-model="addressList" placeholder="Please enter one address in each line" rows="10" cols="100"></textarea></td></tr>
   </table>
   <div style="margin: auto; width: 40%"><br/>
   <button @click="submit" style="font-size: 24px; width: 300px">Send</button></div>
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
      alert("Failed to parse "+line+" Error "+e)
    }
  }
  return addrList
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
    async deploy() {
      const bytecode = "0x608060405234801561001057600080fd5b50610425806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c8063c44465a71461003b578063f438249c14610050575b600080fd5b61004e61004936600461032c565b610063565b005b61004e61005e3660046102db565b61013e565b60005b8181101561013757846001600160a01b03166323b872dd3385858581811061009e57634e487b7160e01b600052603260045260246000fd5b90506020020160208101906100b391906102ba565b876040518463ffffffff1660e01b81526004016100d2939291906103a4565b602060405180830381600087803b1580156100ec57600080fd5b505af1158015610100573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101249190610384565b508061012f816103c8565b915050610066565b5050505050565b60005b8181101561024f57600083838381811061016b57634e487b7160e01b600052603260045260246000fd5b9050602002013590506000606085858581811061019857634e487b7160e01b600052603260045260246000fd5b90506020020135901c60601b60601c9050856001600160a01b03166323b872dd3383856bffffffffffffffffffffffff166040518463ffffffff1660e01b81526004016101e7939291906103a4565b602060405180830381600087803b15801561020157600080fd5b505af1158015610215573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102399190610384565b5050508080610247906103c8565b915050610141565b50505050565b80356001600160a01b038116811461026c57600080fd5b919050565b60008083601f840112610282578182fd5b50813567ffffffffffffffff811115610299578182fd5b60208301915083602080830285010111156102b357600080fd5b9250929050565b6000602082840312156102cb578081fd5b6102d482610255565b9392505050565b6000806000604084860312156102ef578182fd5b6102f884610255565b9250602084013567ffffffffffffffff811115610313578283fd5b61031f86828701610271565b9497909650939450505050565b60008060008060608587031215610341578081fd5b61034a85610255565b935060208501359250604085013567ffffffffffffffff81111561036c578182fd5b61037887828801610271565b95989497509550505050565b600060208284031215610395578081fd5b815180151581146102d4578182fd5b6001600160a01b039384168152919092166020820152604081019190915260600190565b60006000198214156103e857634e487b7160e01b81526011600452602481fd5b506001019056fea2646970667358221220ab52d632f694c62c7bd930c2b47a45a627772a1b3aa28b4f8c6fe65c81a205d964736f6c63430008000033";
  
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
        alert("Error! "+e)
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
	if(this.amount == 0) {
	  alert("Cannot send zero coins!")
	  return
	}
	const neededAmt = this.amount * addrList.length
	if(balance < this.amount * addrList.length) {
	  alert("You do not own enough "+symbol+" to send! "
	    + balance + " < " + neededAmt)
	  return
	}
	if(allowance < neededAmt) {
	  alert("You have not approved enough "+symbol+" to the send2multi contract! "
	    + allowance + " < " + neededAmt)
	  return
	}
	const okToSend = confirm("Are you sure to send "+neededAmt+" "+symbol+" to the addresses?")
	if(!okToSend) {
	  return
	}
        const sendAmt = ethers.utils.parseUnits(neededAmt.toString(), decimals)
        await s2mContract.connect(signer).sendWithSameValue(this.sep20Address, sendAmt, addrList)
      } catch(e) {
        alert("Error! "+e)
      }
    }
  }
}
</script>
