<script setup>
import { onMounted, reactive, ref } from "vue";
import { useState } from "../state";

const state = useState();

const summaries = reactive([]);

onMounted(async () => {
  const lines = await state.loadSummaries();
  summaries.splice(0, summaries.length, ...lines);
  sort("key")
});

const currentSort = ref("");
const sortDirAscending = ref(true);

function compare() {
  return (a, b) => {
    const first = sortDirAscending.value ? a : b;
    const second = sortDirAscending.value ? b : a;
    if (first[currentSort.value] < second[currentSort.value]) return -1;
    if (first[currentSort.value] > second[currentSort.value]) return 1;
    return 0;
  };
}

function sort(prop) {
  if (prop === currentSort.value) {
    sortDirAscending.value = !sortDirAscending.value;
  } else {
    currentSort.value = prop;
    sortDirAscending.value = true;
  }
  summaries.sort(compare())
}

function indicator(prop) {
  if (currentSort.value === prop)
  {
    if (sortDirAscending.value) return "⌃";
    else return "⌄";
  } 
  return "";
}

</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Usage Report</h2>
    <div class="card bg-base-200 shadow-md">
      <div class="card-body p-0 overflow-x-auto">
        <table class="table table-zebra w-full" v-cloak>
          <thead>
            <tr class="bg-base-300 text-base-content text-sm">
              <th class="cursor-pointer select-none" @click="sort('domain')"
                :class="{ 'text-accent': currentSort === 'domain' }">
                Domain {{ indicator('domain') }}
              </th>
              <th class="cursor-pointer select-none" @click="sort('key')"
                :class="{ 'text-accent': currentSort === 'key' }">
                Short Code {{ indicator('key') }}
              </th>
              <th class="cursor-pointer select-none text-right" @click="sort('clickCount')"
                :class="{ 'text-accent': currentSort === 'clickCount' }">
                Count {{ indicator('clickCount') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in summaries" :key="item.key" class="hover">
              <td class="text-sm">{{ item.domain }}</td>
              <td class="font-mono text-sm">{{ item.key }}</td>
              <td class="text-right">
                <span class="badge badge-accent badge-sm">{{ item.clickCount }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
