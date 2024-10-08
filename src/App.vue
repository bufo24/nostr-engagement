<script setup lang="ts">
import { ref } from "vue";
import Engagement from "./components/Engagement.vue";

const npub = ref<string>("");
const days = ref<string>("7");
</script>

<template>
  <div class="grid p-8 my-4 w-1/2 mx-auto bg-black rounded-xl grid-cols-2">
    <h2 class="text-white mx-auto">Enter npub</h2>
    <input class="mx-auto my-1" v-model="npub" />
    <h2 class="text-white mx-auto">Enter days</h2>
    <input class="mx-auto" v-model="days" />
  </div>
  <Engagement :npub="npub" :days="days" />
</template>
