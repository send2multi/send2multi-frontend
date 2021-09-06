<template>
  <h1>Allowance</h1>
  <div class="normal">
    <p>Your address is {{address}}</p>
    The SEP20 token's address:
    <input v-model="sep20Address" type="text" placeholder="Please enter an SEP20 token's address here">
    <button @click="query">Query</button><br/>
    (Click <button @click="useBCH">here</button> if you want to send BCH)<br/>
    <div v-show="shown">
    <p>The SEP20 Token's symbol is {{symbol}}, and its name is {{name}}.</p>
    <p>Now send2multi can spend {{allowance}} of your {{symbol}}. </p>
    <p>You can change your allowance to send2multi: 
    <input v-model="newAllowance" type="number" placeholder="Please enter the new allowance here">
    <button @click="approve">Change</button></p>
    <p>You can clear your allowance to send2multi by setting the new allowance to zero</p>
    </div>
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
export default {
  data() {
    return {
      address: "---",
      sep20Address: "",
      symbol: "---",
      name: "---",
      allowance: "0",
      newAllowance: 0,
      shown: false
    }
  },
  methods: {
    useBCH() {
       this.sep20Address = "0x0000000000000000000000000000000000002711"
    },
    async query() {
      if (typeof window.ethereum === 'undefined') {
        alertNoWallet()
        return
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const sep20Contract = new ethers.Contract(this.sep20Address, SEP20ABI, provider);
      try {
        const signer = provider.getSigner()
        this.symbol = await sep20Contract.symbol()
        this.name = await sep20Contract.name()
        const decimals = await sep20Contract.decimals()
	const amount = await sep20Contract.allowance(signer.getAddress(), SEND2MULTIADDR)
        this.allowance = ethers.utils.formatUnits(amount, decimals)
        this.shown = true
      } catch (e) {
        alert("Error! "+e.toString())
      }
    },
    async approve() {
      if (typeof window.ethereum === 'undefined') {
        alertNoWallet()
        return
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const sep20Contract = new ethers.Contract(this.sep20Address, SEP20ABI, provider);
      const signer = provider.getSigner()
      
      try {
        const decimals = await sep20Contract.decimals()
        this.allowance = this.newAllowance
        var amount = ethers.utils.parseUnits(this.newAllowance.toString(), decimals)
        var gasPrice = await provider.getStorageAt("0x0000000000000000000000000000000000002710","0x00000000000000000000000000000000000000000000000000000000000000002")
	if(gasPrice == "0x") {
	  gasPrice = "0x0"
	}
        await sep20Contract.connect(signer).approve(SEND2MULTIADDR, amount, {gasPrice: gasPrice})
      } catch (e) {
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
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    this.address = await signer.getAddress()
  }
}
</script>
