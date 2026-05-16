<script setup>
import { useState } from "@/state";

const state = useState();
</script>

<template>
  <div data-theme="business">
    <div class="toast toast-bottom toast-end z-50" v-if="state.error">
      <div class="alert alert-error cursor-pointer shadow-lg" @click="state.error = ''">
        <span>{{ state.error }}</span>
        <span class="text-xs opacity-70">(click to dismiss)</span>
      </div>
    </div>
    <div class="toast toast-bottom toast-start z-50" v-if="state.isBusy">
      <div class="alert alert-info shadow-lg">
        <span class="loading loading-spinner loading-sm"></span>
        <span>{{ state.busyMessage }}</span>
      </div>
    </div>
    <div class="navbar bg-neutral shadow-md px-4">
      <div class="flex-1 flex items-center gap-2">
        <a href="/admin" class="text-xl font-extrabold tracking-wide text-accent">🔗 ShawnLink</a>
        <span class="badge badge-outline badge-sm text-base-content opacity-60">Admin</span>
      </div>
      <ul class="menu menu-horizontal gap-1">
        <li><router-link to="/" class="rounded-btn">List</router-link></li>
        <li><router-link to="/editor" class="rounded-btn">New</router-link></li>
        <li><router-link to="/summaries" class="rounded-btn">Reports</router-link></li>
        <li><a href="/signout-oidc" class="rounded-btn opacity-70 hover:opacity-100">Logout</a></li>
      </ul>
    </div>
    <div class="bg-base-100 min-h-screen">
      <div class="max-w-6xl mx-auto p-6">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style>
a {
  @apply hover:text-accent;
}
</style>
