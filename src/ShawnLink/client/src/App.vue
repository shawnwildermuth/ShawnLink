<template>
  <div class="bg-gray-50 text-gray-900 w-full">
    <v-toolbar>
      <v-toolbar-title>Admin</v-toolbar-title>
      <v-toolbar-items>
        <v-btn to="/">List</v-btn>
        <v-btn to="/editor" class="button">New</v-btn>
        <v-btn to="/summaries" class="button">Reports</v-btn>
        <v-btn href="/">Test</v-btn>
        <v-btn href="/signout-oidc" class="button">Logout</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <div class="">
      <v-alert color="danger" v-if="error">{{ error }}</v-alert>
      <v-alert color="info" v-if="isBusy"
        ><i class="fas fa-spin fa-spinner" /> {{ busyMessage }}</v-alert
      >
      <div class="">
        <div class="">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import state from "@/state";

export default {
  setup() {
    return {
      ...state,
    };
  },
};
</script>
