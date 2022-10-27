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
  <div class="row">
    <div class="col-12">
      <h2>Usage Report</h2>
      <div class="table-responsive">
        <table class="table table-sm table-bordered" v-cloak>
          <thead>
            <tr>
              <th>Domain</th>
              <th>Short Code</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in summaries" :key="item.key">
              <td>{{ item.domain }}</td>
              <td>{{ item.key }}</td>
              <td>{{ item.clickCount }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
