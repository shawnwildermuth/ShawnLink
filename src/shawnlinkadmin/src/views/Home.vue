<script setup>
import { useState } from "@/state";
import { onMounted, ref } from "vue";
import http from "axios";

const state = useState();
const confirmationDialog = ref(null);

onMounted(async () => state.loadLinks());

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
  confirmationDialog.value.showModal();
}

async function closeDialog(agreed) {
  confirmationDialog.value.close();
  if (agreed) await deleteConfirmation();
}

async function deleteConfirmation() {
  const link = linkToDelete.value;
  linkToDelete.value = null;
  state.setBusy("Deleting Links...");
  state.clearError();
  try {
    const result = await http.delete(
      `/api/links/${link.domain}/${link.key}`
    );
    if (result.status === 200) {
      const domLoc = state.links.findIndex((d) => d.domain);
      if (domLoc < 0) throw "Bad Domain Group while deleting item";
      const domain = state.links[domLoc];
      const loc = domain.links.indexOf(link);
      if (loc > -1) domain.links.splice(loc, 1);
      if (domain.links.length === 0) state.links.value.splice(domLoc, 1);
    }
  } catch (e) {
    state.setError(`Could not delete ${link.key}: {e}`);
  } finally {
    state.clearBusy();
  }
}

function shorten(val) {
  const position = val.split("/", 3).join("/").length;
  return val.substring(0, position) + "/...";
}
</script>

<template>
  <div>
    <dialog ref="confirmationDialog" @close="closeDialog(false)" class="modal" v-if="linkToDelete">
      <div class="modal-box w-72">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="closeDialog(false)">✕</button>
        <div class="text-lg font-bold"> Are you Sure? </div>
        <p class="my-2">Do you want to delete: {{ linkToDelete.key }}</p>
        <div class="modal-actions">
          <button class="btn btn-sm btn-primary"
            @click="closeDialog(true)">Yes</button>
          <button class="btn btn-sm btn-ghost" @click="closeDialog(false)">No</button>
        </div>
      </div>
    </dialog>
    <div>
      <h2 class="text-xl font-bold">Links Management</h2>
      <table class="table overflow-x-auto" v-cloak>
        <tbody>
          <template v-for="g in state.links" :key="g">
            <tr>
              <td colspan="6" class="bg-slate-800 text-white -p-1">
                Domain: <strong>{{ g.domain }}</strong>
              </td>
            </tr>
            <tr>
              <th></th>
              <th>Key</th>
              <th>Destination</th>
              <th>Link</th>
              <th class="w-36"></th>
            </tr>
            <tr v-for="l in g.links" :key="l" class="hover">
              <td>&nbsp;</td>
              <td class="border border-gray-300 p-0.5 text-nowrap">{{ l.key }}
              </td>
              <td class="border border-gray-300 p-0.5">
                <a :href="l.url" :title="l.url" target="_blank">{{ shorten(l.url)
                }}</a>
              </td>
              <td class="border border-gray-300 p-1">
                <a :href="`https://${l.domain}/${l.key}`" target="_blank">{{
                  `${l.domain}/${l.key}`
                }}</a>
              </td>
              <td class="border border-gray-300 p-1">
                <div class="join">
                  <router-link class="join-item btn btn-primary btn-xs rounded-none" :to="{
                        name: 'EditLink',
                        params: { editKey: l.key, domain: l.domain },
                      }">Edit</router-link>
                  <button class="join-item btn btn-error btn-xs  rounded-none"
                    @click="deleteLink(l)">
                    Delete
                  </button>
                  <button class="join-item btn btn-warning btn-xs  rounded-none"
                    @click="copyToClipboard(l)">
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
  <!-- <pre>
  {{ state.links }}
  </pre> -->
</template>

