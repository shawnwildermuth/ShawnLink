<template>
  <div class="col-6 offset-3">
    <h3>{{ title }}</h3>
    <form novalidate @submit.prevent="onSave()">
      <div class="form-group">
        <label for="key">Key</label>
        <input
          type="text"
          id="key"
          class="form-control"
          v-model="link.key"
          placeholder="Unique Key"
          :disabled="!isNew"
        />
      </div>
      <div class="form-group">
        <label for="url">Url</label>
        <input
          type="text"
          id="url"
          class="form-control"
          v-model="link.url"
          placeholder="https://..."
        />
      </div>
      <div class="form-group">
        <label for="domain">Domain</label>
        <select
          id="domain"
          class="form-control"
          v-model="link.domain"
          :disabled="!isNew"
        >
          <option disabled>Select One...</option>
          <option v-for="d in domains" :key="d">{{ d }}</option>
        </select>
      </div>
      <div class="form-group">
        <input type="submit" class="btn btn-success" value="Save" />
      </div>
    </form>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import state from "@/state";
import http from "axios";
import router from "@/router";

export default {
  props: {
    editKey: { required: false },
  },
  setup(props) {
    const link = ref({
      key: ref(""),
      url: ref(""),
      domain: ref("shawnl.ink"),
    });

    const domains = ref(["shawnl.ink", "imfinel.ink"]);

    const title = ref("New Shawn Link");
    const isNew = ref(true);

    onMounted(() => {
      if (props.editKey) {
        const found = state.links.value.find((l) => l.key === props.editKey);
        if (found) {
          isNew.value = false;
          title.value = "Editing Shawn Link";
          link.value.key = found.key;
          link.value.url = found.url;
        }
      }
    });

    async function onSave() {
      state.setBusy("Saving Link...");
      state.clearError();
      try {
        if (isNew.value) {
          // add to the list
          const result = await http.post("/api/links", link.value);
          state.links.value.push(result.data);
          router.push("/");
        } else {
          // update the Link
          const result = await http.put("/api/links", link.value);
          const loc = state.links.value.find((l) => l.key === result.data.key);
          if (loc > 0) state.links.value.splice(loc, 1, state.data);
          router.push("/");
        }
      } catch {
        state.setError("Could not save");
      } finally {
        state.clearBusy();
      }
    }

    return {
      onSave,
      link,
      title,
      domains,
      isNew,
    };
  },
};
</script>
