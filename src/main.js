import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'

window.alertNoWallet = () => {
      alert("No wallet installed! Please install MetaMask or other web3 wallet to use this App.");
}

window.SEP20ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function totalSupply() external view returns (uint256)",
    "function balanceOf(address account) external view returns (uint256)",
    "function transfer(address recipient, uint256 amount) external returns (bool)",
    "function allowance(address owner, address spender) external view returns (uint256)",
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function transferFrom(address sender, address recipient, uint256 amount) external returns (bool)",
    "event Transfer(address indexed from, address indexed to, uint256 value)",
    "event Approval(address indexed owner, address indexed spender, uint256 value)"]

window.SEND2MULTIABI = [
    "function sendWithSameValue(address coinType, uint amount, address[] calldata receiverList)",
    "function sendWithDifferentValues(address coinType, uint[] calldata receiverAndAmountList)"]

window.SEND2MULTIADDR = "0xE221d4200F909e04c13AAb84fe3B7917f8D06cEE"

if (typeof window.ethereum === 'undefined') {
  alertNoWallet()
} else {
  ethereum.request({ method: 'eth_requestAccounts' })
}

createApp(App).use(router).mount('#app')

