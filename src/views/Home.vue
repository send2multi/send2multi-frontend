<template>
  <h1>Send Coins to Multiple Addresses</h1>
  <div class="normal">
    <p>This small utility helps you send coins to multiple addresses. This is a <a href="https://www.puredapp.org">Pure DApp</a>, which means its contract code and front-end code are both opensource and anyone can deploy them at anywhere.</p>
    <p>You can send the <a @click="same" href="">same amount</a> of coins to each of these addresses, or send <a @click="diff" href="">different amount</a> to different address. Before using send2multi, you must approve some <a @click="allowance" href="">allowance</a> to it.</p>
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
    },
    allowance() {
      this.$router.push('allowance');
    }
  }
}
</script>
