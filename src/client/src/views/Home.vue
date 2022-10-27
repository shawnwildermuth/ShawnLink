<template>
  <div class="row">
    <div class="col-12">
      <h2>Links Management</h2>
      <div class="table-responsive">
        <table class="table table-sm table-bordered" v-cloak>
          <thead>
            <tr>
              <th></th>
              <th>Key</th>
              <th>Destination</th>
              <th>Link</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <template v-for="g in links" :key="g">
              <tr>
                <td colspan="6">Domain: <strong>{{ g.domain }}</strong></td>
              </tr>
              <tr v-for="l in g.links" :key="l">
              <td>&nbsp;</td>
                <td>{{ l.key }}</td>
                <td>
                  <a :href="l.url" :title="l.url">{{ shorten(l.url) }}</a>
                </td>
                <td>
                  <a :href="l.url">https://shawnl.ink/{{ l.key }}</a>
                </td>
                <td>
                  <div class="btn-group" role="group">
                    <router-link
                      :to="{ name: 'EditLink', params: { editKey: l.key } }"
                      type="button"
                      class="btn btn-sm btn-info"
                      >Edit</router-link
                    >
                    <button
                      type="button"
                      class="btn btn-sm btn-info"
                      @click="deleteLink(l)"
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      class="btn btn-sm btn-info"
                      @click="copyToClipboard(l)"
                    >
                      Copy
                    </button>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <pre>
    <!-- {{ links }} -->
  </pre>
</template>

<script>
import state from "@/state";
import { onMounted } from "vue";
import http from "axios";

export default {
  name: "Home",
  setup() {
    onMounted(() => state.loadLinks());

    async function copyToClipboard(link) {
      if (!navigator.clipboard) {
        state.setError("Failed to copy to clipboard: Not supported");
      } else {
        try {
          await navigator.clipboard.writeText(`https://shawnl.ink/${link.key}`);
        } catch {
          state.setError("Failed to copy to clipboard: Exception thrown");
        }
      }
    }

    async function deleteLink(link) {
      state.setBusy("Deleting Links...");
      state.clearError();
      try {
        const result = await http.delete(`/api/links/${link.domain}/${link.key}`);
        if (result.status === 200) {
          const domLoc = state.links.value.findIndex(d => d.domain);
          if (domLoc < 0) throw "Bad Domain Group while deleting item";
          const domain = state.links.value[domLoc];
          const loc = domain.links.indexOf(link);
          if (loc > -1) domain.links.splice(loc, 1);
          if (domain.links.length === 0) state.links.value.splice(domLoc, 1);
        }
      } catch {
        state.setError(`Could not delete ${link.key}`);
      } finally {
        state.clearBusy();
      }
    }

    function shorten(val) {
      const position = val.split("/", 3).join("/").length;
      return val.substring(0, position) + "/...";
    }

    return {
      links: state.links,
      copyToClipboard,
      deleteLink,
      shorten,
    };
  },
};
</script>
