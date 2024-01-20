<script setup>
import { onMounted, ref, reactive } from "vue";
import { useState } from "@/state";
import http from "axios";
import router from "@/router";
import { z } from "zod";

const state = useState();

const errors = ref({});

const props = defineProps({
  editKey: { type: String, required: false },
  domain: { type: String, required: false },
});

const link = reactive({
  key: "",
  url: "",
  domain: "shawnl.ink",
});

const schema = z.object({
  key: z.string().min(2),
  url: z.string().url(),
  domain: z.string()
});

const domains = ref(["shawnl.ink", "imfinel.ink", "manenoughl.ink"]);
const title = ref("New Shawn Link");
const isNew = ref(true);
const valid = ref(false);

onMounted(() => {
  if (props.editKey) {
    const collection = state.links.find(
      (l) => l.domain === props.domain
    );
    if (collection) {
      const found = collection.links.find((l) => l.key === props.editKey);
      if (found) {
        isNew.value = false;
        title.value = "Editing Shawn Link";
        link.key = found.key;
        link.url = found.url;
        link.domain = found.domain;
        return;
      }
    }
    state.error = `Can't Find the Key: ${props.editKey}`;
  }
});

async function onSave() {
  state.setBusy("Saving Link...");
  state.clearError();
  try {
    if (isNew.value) {
      // add to the list
      const result = await http.post("/api/links", link);
      state.links.push(result.data);
      router.push("/");
    } else {
      // update the Link
      const collection = state.links.find(
        (l) => l.domain === props.domain
      );
      if (collection) {
        const loc = collection.links.findIndex((l) => l.key === props.editKey);
        if (loc >= 0) {
          const old = collection.links[loc];
          if (
            old.key != link.key ||
            old.url != link.url ||
            old.domain != link.domain
          ) {
            // It is changed
            const result = await http.put("/api/links", link.value);
            state.links.splice(loc, 1, result);
          } else {
            // since no change, just log that no change and return
            console.log("No change");
          }
          router.push("/");
        } else {
          state.setError(`couldn't find key - internal error - ${old}`);
        }
      } else {
        state.setError("Couldn't find the domain in the collection");
      }
    }
  } catch (e) {
    state.setError(`Could not save: ${e}`);
  } finally {
    state.clearBusy();
  }
};

let hasTabbed = false;

function validate(e) {
  const result = schema.safeParse(link);
  valid.value = result.success;
  if (e.code === "Tab") hasTabbed = true;
  if (hasTabbed) {
    errors.value = result.error ? result.error.format() : {};
  }
}


</script>

<template>
  <div class="md:w-1/2 mx-auto">
    <h2 class="text-xl font-bold">{{ title }}</h2>
    <form novalidate @submit.prevent="onSave()"
      class="bg-neutral border-base-300 p-1">
      <div class="form-control">
        <div class="label">
          <span class="label-text">Key</span>
        </div>
        <input class="input input-bordered" @keyup="validate" autofocus
          v-model="link.key" placeholder="Unique Key" :disabled="!isNew" />
        <div class="label" v-if="errors && errors.key">
          <div class="label-text text-error" v-for="e in errors.key._errors">{{ e
          }}</div>
        </div>
      </div>
      <div class="form-control">
        <div class="label">
          Url
        </div>
        <input class="input input-bordered" v-model="link.url" @keyup="validate"
          placeholder="https://..." />
        <div class="label" v-if="errors && errors.url">
          <div class="label-text text-error" v-for="e in errors.url._errors">{{ e
          }}</div>
        </div>
      </div>
      <div class="form-control">
        <div class="label">
          Domain
        </div>
        <select label="Domain" class="select" v-model="link.domain"
          @change="validate" :disabled="!isNew" :items="domains">
          <option default disabled>Pick One</option>
          <option v-for="d in domains">{{ d }}</option>
        </select>
        <div class="label" v-if="errors && errors.domain">
          <div class="label-text text-error" v-for="e in errors.domain._errors">{{ e
          }}</div>
        </div>
      </div>
      <div class="py-1 flex justify-end">
        <button type="submit" :disabled="!valid"
          class="btn btn-success">Save</button>
        <router-link to="/" class="btn btn-neutral">Cancel</router-link>
      </div>
    </form>
  </div>
  <pre>{{ errors }}</pre>
  <pre>{{ link }}</pre>
</template>

<style scoped>
input[type=text],
select {
  @apply input input-bordered;
}
</style>