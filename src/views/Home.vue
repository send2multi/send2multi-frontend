<template>
  <img src="/favicon.ico">
  <h1>Send Coins to Multiple Addresses</h1>
  <div class="normal">
    <p>This small utility helps you send coins to multiple addresses.</p>
    <p>This is a <a href="https://www.puredapp.org">Pure DApp</a>, which means its contract code and front-end code are both opensource and anyone can deploy them at anywhere.</p>
    <p>You can <a @click="send" href="">send the same amount</a> of coins to each of these addresses. Before using send2multi, you must <a @click="approve" href="">approve some allowance</a> to it.</p>
    <p>To visit specific pages of this site, you can use full URLs. Suppose you are going to send <code>$CATS</code> whose contract address is <code>0x265bD28d79400D55a1665707Fa14A72978FA6043</code>, then <a href="https://send2multi.github.io/send/0x265bD28d79400D55a1665707Fa14A72978FA6043">https://send2multi.github.io/send/0x265bD28d79400D55a1665707Fa14A72978FA6043</a> can lead you to the page to send <code>$CATS</code> and <a href="https://send2multi.github.io/approve/0x265bD28d79400D55a1665707Fa14A72978FA6043">https://send2multi.github.io/approve/0x265bD28d79400D55a1665707Fa14A72978FA6043</a>, the page to approve <code>$CATS</code> to this send2multi DApp.</p>
    <p><b>CAVEAT:</b> This is an opensource software. It is provided “as is”, without warranty of any kind. Please use it <b>AT YOUR OWN RISK</b>.</p>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    create() {
      this.$router.push('create');
    },
    send() {
      this.$router.push('send');
    },
    diff() {
      this.$router.push('diff');
    },
    approve() {
      this.$router.push('approve');
    }
  }
}
</script>
