<script setup lang="ts">
import { BarChart } from "vue-chart-3";
import { getEvents, getFollowList } from "../nostr/engagement";

import { Chart, registerables } from "chart.js";
import { getDay, getHours } from "date-fns";
import { reactive, ref, watch } from "vue";
import { nip19 } from "nostr-tools";

Chart.register(...registerables);

const valid = ref(false);
const loading = ref(false);
const dayData = reactive({} as any);
const timeData = reactive({} as any);

const npubName = ref("");

const dayEventCount = [0, 0, 0, 0, 0, 0, 0];
const timeEventCount = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];

const dayLabels = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saterday",
];

const timeLabels = [
  "00:00",
  "01:00",
  "02:00",
  "03:00",
  "04:00",
  "05:00",
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
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
    const { follows, name } = await getFollowList(npub);

    npubName.value = name || "?";

    const daysInput = days ? +days : 7;
    const events = await getEvents(follows, daysInput);

    for (let event of events) {
      if (!event.created_at) continue;

      const dayIndex = getDay(event.created_at * 1000);

      const timeIndex = getHours(event.created_at * 1000);

      dayEventCount[dayIndex]++;
      timeEventCount[timeIndex]++;
    }

    Object.assign(dayData, {
      labels: dayLabels,
      datasets: [
        {
          data: dayEventCount,
        },
      ],
    });

    Object.assign(timeData, {
      labels: timeLabels,
      datasets: [
        {
          data: timeEventCount,
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
  <h2 v-if="!loading && npubName" class="text-center">
    Found stats for follow list for {{ npubName }}
  </h2>
  <BarChart v-if="!loading" :chart-data="dayData" />
  <BarChart v-if="!loading" :chart-data="timeData" />
</template>
