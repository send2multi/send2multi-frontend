<template>
  <h1>Send Coins to Multiple Addresses</h1>
  <div class="normal">
    <p>This small utility helps you send coins to multiple addresses.</p>
    <p>You can send the <a @click="same" href="">same amount</a> of coins to each of these addresses, or send <a @click="diff" href="">different amount</a> to different address.</p>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    create() {
      this.$router.push('create');
    },
    same() {
      this.$router.push('same');
    },
    diff() {
      this.$router.push('diff');
    }
  }
}
</script>
