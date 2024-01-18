<template>
  <div>
    <v-dialog v-model="showDialog" width="300" persistent>
        <v-card>
          <v-card-title> Are you Sure? </v-card-title>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="deleteConfirmation(true)"
              >Yes</v-btn
            >
            <v-btn text @click="deleteConfirmation(false)">No</v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>
    <h2>Links Management</h2>
    <table class="-table-collapse -w-full" v-cloak>
      <tbody>
        <template v-for="g in links" :key="g">
          <tr>
            <td colspan="6" class="-bg-slate-800 -text-white -p-1">
              Domain: <strong>{{ g.domain }}</strong>
            </td>
          </tr>
          <tr>
            <th></th>
            <th>Key</th>
            <th>Destination</th>
            <th>Link</th>
            <th></th>
          </tr>
          <tr v-for="l in g.links" :key="l" class="hover:-bg-slate-100">
            <td>&nbsp;</td>
            <td class="-border -border-gray-300 -p-1">{{ l.key }}</td>
            <td class="-border -border-gray-300 -p-1">
              <a :href="l.url" :title="l.url">{{ shorten(l.url) }}</a>
            </td>
            <td class="-border -border-gray-300 -p-1">
              <a :href="`https://${l.domain}/${l.key}`">{{
                `https://${l.domain}/${l.key}`
              }}</a>
            </td>
            <td class="-border -border-gray-300 -p-1">
              <v-btn
                :to="{
                  name: 'EditLink',
                  params: { editKey: l.key, domain: l.domain },
                }"
                color="green"
                variant="plain"
                >Edit</v-btn
              >
              <v-btn color="red" variant="plain" @click="deleteLink(l)">
                Delete
              </v-btn>
              <v-btn color="grey" variant="plain" @click="copyToClipboard(l)">
                Copy
              </v-btn>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
  <pre>
    <!-- {{ links }} -->
  </pre>
</template>

<script>
import state from "@/state";
import { onMounted, ref } from "vue";
import http from "axios";

export default {
  name: "Home",
  setup() {
    onMounted(() => state.loadLinks());

    const showDialog = ref(false);
    const linkToDelete = ref(null);

    async function copyToClipboard(link) {
      if (!navigator.clipboard) {
        state.setError("Failed to copy to clipboard: Not supported");
      } else {
        try {
          await navigator.clipboard.writeText(
            `https://${link.domain}/${link.key}`
          );
        } catch {
          state.setError("Failed to copy to clipboard: Exception thrown");
        }
      }
    }



    function deleteLink(link) {
      linkToDelete.value = link;
      showDialog.value = true;
    }

    async function deleteConfirmation(agreed) {
      showDialog.value = false;
      const link = linkToDelete.value;
      linkToDelete.value = null;
      if (agreed) {
        state.setBusy("Deleting Links...");
        state.clearError();
        try {
          const result = await http.delete(
            `/api/links/${link.domain}/${link.key}`
          );
          if (result.status === 200) {
            const domLoc = state.links.value.findIndex((d) => d.domain);
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
    }

    function shorten(val) {
      const position = val.split("/", 3).join("/").length;
      return val.substring(0, position) + "/...";
    }

    return {
      links: state.links,
      copyToClipboard,
      deleteLink,
      deleteConfirmation,
      shorten,
      showDialog
    };
  },
};
</script>
