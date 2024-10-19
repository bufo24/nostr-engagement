<script setup lang="ts">
import { ref } from "vue";
import Engagement from "./components/Engagement.vue";

const npub = ref<string>("");
const days = ref<string>("7");
</script>

<template>
  <h1 class="text-center text-xl m-5">
    Check the Vibrancy of your Nostr npub!
  </h1>
  <div
    class="grid p-8 my-4 w-1/2 mx-auto bg-black rounded-xl grid-cols-2 text-white"
  >
    <h2 class="mx-auto">Enter npub</h2>
    <input class="mx-auto my-1 text-black" v-model="npub" />
    <h2 class="mx-auto">Enter days</h2>
    <input class="mx-auto text-black" v-model="days" />
  </div>
  <Engagement :npub="npub" :days="days" />
</template>
