<script setup>
import { useState } from "@/state";

const state = useState();
</script>

<template>
  <div data-theme="business">
    <div class="alert alert-error" v-if="state.error" @click="state.error = ''">{{
      state.error }}</div>
    <div class="alert" v-if="state.isBusy">
      <span class="loading loading-ring loading-lg"></span> {{ state.busyMessage
      }}
    </div>
    <div class="navbar bg-neutral">
      <div class="font-bold text-lg flex-1"><a href="/admin">Admin</a></div>
      <ul class="menu menu-horizontal">
        <li><router-link to="/">List</router-link></li>
        <li><router-link to="/editor">New</router-link></li>
        <li><router-link to="/summaries">Reports</router-link></li>
        <li><a href="/signout-oidc">Logout</a></li>
      </ul>
    </div>
    <div>
      <div class="p-1 bg-base-100">
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
