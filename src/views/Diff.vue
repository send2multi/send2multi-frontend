<template>
  <h1>Send Different Amounts of Coins to Addresses</h1>
  <div class="normal">
   <table style="margin: auto">
   <tr><td>SEP20 Token's Address<br/>(enter 0x2711 for BCH)</td>
   <td><input v-model="coinType" type="text" placeholder="Please enter an address in HEX format"></td></tr>
   <tr><td>Addresses and Amounts<br/>(use "," to seperate address<br/>and amount; one address <br/> and one amount at each line)</td>
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
    font-size:20px;
    width:500px;
}
</style>
