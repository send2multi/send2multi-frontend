<template>
  <h1>Allowance</h1>
  <div class="normal">
    <p>Your address is {{address}}</p>
    <input v-model="sep20Address" type="text" placeholder="Please enter an SEP20 token's address here">
    <button @click="query">Query</button><br/>
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
        alert("Error! "+e)
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
        await sep20Contract.connect(signer).approve(SEND2MULTIADDR, amount)
      } catch (e) {
        alert("Error! "+e)
      }
    }
  },
  async mounted() {
    if (typeof window.ethereum === 'undefined') {
      alertNoWallet()
      return
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    this.address = await signer.getAddress()
  },
}
</script>
