<template>
  <div>
    <h2>Links Management</h2>
    <table class="table table-sm table-bordered" v-cloak>
      <thead>
        <tr>
          <th>Key</th>
          <th>Destination</th>
          <th>Link</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="l in links" :key="l">
          <td>{{ l.key }}</td>
          <td>{{ l.url }}</td>
          <td>
            <a :href="l.url">https://shawnl.ink/{{ l.key }}</a>
          </td>
          <td>
            <div class="btn-group" role="group">
              <router-link :to="{ name: 'EditLink', params: { editKey: l.key } }" type="button" class="btn btn-sm btn-info">Edit</router-link>
              <button type="button" class="btn btn-sm btn-info" @click="deleteLink(l)">Delete</button>
              <button type="button" class="btn btn-sm btn-info" @click="copyToClipboard(l)">Copy</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import state from '@/state';
import { onMounted } from 'vue';
import http from 'axios';

export default {
  name: 'Home',
  setup () {
    onMounted(() => state.loadLinks());

    async function copyToClipboard (link) {
      if (!navigator.clipboard) {
        state.setError('Failed to copy to clipboard: Not supported');
      } else {
        try {
          await navigator.clipboard.writeText(`https://shawnl.ink/${link.key}`);
        } catch {
          state.setError('Failed to copy to clipboard: Exception thrown');
        }
      }
    }

    async function deleteLink(link) {
      state.setBusy('Deleting Links...');
      state.clearError();
      try {
        const result = await http.delete(`/api/links/${link.key}`);
        if (result.status === 200) {
          const loc = state.links.value.indexOf(link);
          if (loc > -1) state.links.value.splice(loc, 1);
        }
      } catch {
        state.setError(`Could not delete ${link.key}`);
      } finally {
        state.clearBusy();
      }
    }

    return {
      links: state.links,
      copyToClipboard,
      deleteLink
    };
  }
};
</script>
