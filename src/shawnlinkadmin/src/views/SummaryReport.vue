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
  <h2>Usage Report</h2>
  <table class="table table-zebra" v-cloak>
    <thead>
      <tr>
        <th class="cursor-pointer" @click="sort('domain')"
          :class="{ 'text-white': currentSort === 'domain' }">
          Domain {{ indicator('domain') }}
        </th>
        <th class="cursor-pointer" @click="sort('key')"
          :class="{ 'text-white': currentSort === 'key' }">Short Code {{ indicator('key') }}</th>
        <th class="cursor-pointer" @click="sort('clickCount')"
          :class="{ 'text-white': currentSort === 'clickCount' }">Count {{ indicator('clickCount') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in summaries" :key="item.key" class="hover">
        <td>{{ item.domain }}</td>
        <td>{{ item.key }}</td>
        <td>{{ item.clickCount }}</td>
      </tr>
    </tbody>
  </table>
</template>
