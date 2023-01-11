<script>
import { onMounted, reactive, defineComponent } from "vue";
import state from "../state";

export default defineComponent({
  name: "SummaryReport",
  setup() {
    const summaries = reactive([]);
    onMounted(async () => {
      const lines = await state.loadSummaries();
      summaries.splice(0, summaries.length, ...lines);
    });

    return {
      summaries,
    };
  },
});
</script>

<template>
  <h2>Usage Report</h2>
  <table class="-table-collapse -w-full" v-cloak>
    <thead>
      <tr>
        <th>Domain</th>
        <th>Short Code</th>
        <th>Count</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in summaries" :key="item.key"  class="hover:-bg-slate-100">
        <td class="-border -border-gray-300 -p-1">{{ item.domain }}</td>
        <td class="-border -border-gray-300 -p-1">{{ item.key }}</td>
        <td class="-border -border-gray-300 -p-1">{{ item.clickCount }}</td>
      </tr>
    </tbody>
  </table>
</template>
