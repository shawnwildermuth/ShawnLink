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
      <div class="modal-box w-80">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="closeDialog(false)">✕</button>
        <h3 class="text-lg font-bold text-error mb-1">Confirm Delete</h3>
        <p class="my-3 text-base-content">Are you sure you want to delete <span class="font-mono font-bold text-accent">{{ linkToDelete.key }}</span>?</p>
        <div class="modal-action">
          <button class="btn btn-error btn-sm" @click="closeDialog(true)">Yes, Delete</button>
          <button class="btn btn-ghost btn-sm" @click="closeDialog(false)">Cancel</button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop"><button>close</button></form>
    </dialog>

    <div class="flex items-center justify-between mb-4">
      <h2 class="text-2xl font-bold">Links Management</h2>
      <router-link to="/editor" class="btn btn-primary btn-sm">+ New Link</router-link>
    </div>

    <div class="card bg-base-200 shadow-md">
      <div class="card-body p-0 overflow-x-auto">
        <table class="table table-zebra w-full" v-cloak>
          <tbody>
            <template v-for="g in state.links" :key="g">
              <tr>
                <td colspan="5" class="bg-neutral text-neutral-content font-semibold text-sm py-2 px-4">
                  🌐 {{ g.domain }}
                </td>
              </tr>
              <tr class="bg-base-300 text-base-content text-xs uppercase tracking-wide">
                <th class="w-4"></th>
                <th>Key</th>
                <th>Destination</th>
                <th>Short Link</th>
                <th class="w-44 text-right">Actions</th>
              </tr>
              <tr v-for="l in g.links" :key="l" class="hover">
                <td></td>
                <td class="font-mono text-sm text-nowrap">{{ l.key }}</td>
                <td class="text-sm max-w-xs truncate">
                  <a :href="l.url" :title="l.url" target="_blank" class="link link-hover">{{ shorten(l.url) }}</a>
                </td>
                <td class="text-sm">
                  <a :href="`https://${l.domain}/${l.key}`" target="_blank" class="link link-accent link-hover">
                    {{ `${l.domain}/${l.key}` }}
                  </a>
                </td>
                <td class="text-right">
                  <div class="join">
                    <router-link class="join-item btn btn-primary btn-xs" :to="{
                          name: 'EditLink',
                          params: { editKey: l.key, domain: l.domain },
                        }">Edit</router-link>
                    <button class="join-item btn btn-error btn-xs" @click="deleteLink(l)">Delete</button>
                    <button class="join-item btn btn-warning btn-xs" @click="copyToClipboard(l)">Copy</button>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

