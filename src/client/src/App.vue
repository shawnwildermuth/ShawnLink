<template>
  <div class="bg-white text-dark">
    <nav class="navbar navbar-dark bg-dark">
      <ul class="nav nav-pill">
        <li class="nav-item">
          <router-link to="/" class="nav-link">List</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/editor" class="nav-link">New</router-link>
        </li>
      </ul>
    </nav>
    <div class="row">
      <div class="col-12">
        <div class="alert alert-danger" v-if="error">{{ error }}</div>
        <div class="alert alert-info" v-if="isBusy"><i class="fas fa-spin fa-spinner" /> {{ busyMessage }}</div>
        <div class="row">
          <div class="col-12">
            <router-view />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import state from '@/state';

export default {
  setup () {
    return {
      ...state
    };
  }
};
</script>
