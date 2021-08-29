<template>
  <h1>Allowance</h1>
  <div class="normal">
    <input v-model="sep20token" type="text" placeholder="Please enter an SEP20 token's address here">
    <button @click="query">Query</button><br/>
    <p>The SEP20 Token ---'s symbol is ---, and its name is ---.</p>
    <p>Now send2multi can spend --- of your ---. </p>
    <p>You can change your allowance to send2multi: 
    <input v-model="allowance" type="number" placeholder="Please enter the new allowance here">
    <button @click="approve">Change</button></p>
    <p>You can clear your allowance to send2multi by setting the new allowance to zero</p>
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
