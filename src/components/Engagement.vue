<script setup lang="ts">
import { BarChart } from "vue-chart-3";
import { getEvents, getFollowList } from "../nostr/engagement";

import { Chart, registerables } from "chart.js";
import { getDay } from "date-fns";
import { reactive, ref, watch } from "vue";
import { nip19 } from "nostr-tools";

Chart.register(...registerables);

const valid = ref(false);
const loading = ref(false);
const chartData = reactive({} as any);

const eventCount = [0, 0, 0, 0, 0, 0, 0];
const dayLabels = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saterday",
];

const props = defineProps({
  npub: String,
  days: String,
});

watch(
  () => props.npub,
  async (npub) => {
    await doMagic(npub, props.days);
  }
);

watch(
  () => props.days,
  async (days) => {
    await doMagic(props.npub, days);
  }
);

async function doMagic(npub?: string, days?: string) {
  if (!npub) {
    valid.value = false;
    return;
  }

  loading.value = true;

  try {
    const f = nip19.decode(npub);
    valid.value = f.type === "npub";

    if (!valid.value) return;
    const followNpubs = await getFollowList(npub);

    const daysInput = days ? +days : 7;
    const events = await getEvents(followNpubs, daysInput);

    for (let event of events) {
      if (!event.created_at) continue;

      const dayIndex = getDay(event.created_at * 1000);

      eventCount[dayIndex]++;
    }

    Object.assign(chartData, {
      labels: dayLabels,
      datasets: [
        {
          data: eventCount,
        },
      ],
    });
    loading.value = false;
  } catch (e) {
    valid.value = false;
    loading.value = false;
  }
}
</script>
<template>
  <div class="flex">
    <h2 v-if="loading" class="mx-auto">Loading!</h2>
  </div>
  <BarChart v-if="!loading" :chart-data="chartData" />
</template>
