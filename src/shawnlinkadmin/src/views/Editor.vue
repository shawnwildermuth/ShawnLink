<template>
  <div class="md:-w-1/2 mx-auto">
    <h2>{{ title }}</h2>
    <v-form
      novalidate
      @submit.prevent="onSave()"
      v-model="valid"
      class="-border -bg-gray-50 -p-1"
    >
      <v-text-field
        id="key"
        autofocus
        class="form-control"
        v-model="link.key"
        placeholder="Unique Key"
        :disabled="!isNew"
        variant="solo"
        label="Key"
        :rules="[(v) => !!v || 'Key is required']"
      />
      <v-text-field
        label="Url"
        id="url"
        class="form-control"
        v-model="link.url"
        variant="solo"
        placeholder="https://..."
        :rules="[(v) => !!v || 'Url is required']"
      />
      <v-combobox
        label="Domain"
        id="domain"
        class="form-control"
        v-model="link.domain"
        variant="solo"
        :disabled="!isNew"
        :items="domains"
      >
      </v-combobox>
      <div class="-py-1">
        <v-btn type="submit" :disabled="!valid" color="success" class="-mr-1"
          >Save</v-btn
        >
        <v-btn to="/">cancel</v-btn>
      </div>
    </v-form>
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
    domain: { required: false },
  },
  setup(props) {
    const link = ref({
      key: ref(""),
      url: ref(""),
      domain: ref("shawnl.ink"),
    });

    const domains = ref(["shawnl.ink", "imfinel.ink", "manenoughl.ink"]);
    const title = ref("New Shawn Link");
    const isNew = ref(true);
    const valid = ref(false);

    onMounted(() => {
      if (props.editKey) {
        const collection = state.links.value.find(
          (l) => l.domain === props.domain
        );
        if (collection) {
          const found = collection.links.find((l) => l.key === props.editKey);
          if (found) {
            isNew.value = false;
            title.value = "Editing Shawn Link";
            link.value.key = found.key;
            link.value.url = found.url;
            link.value.domain = found.domain;
            return;
          }
        }
        state.error.value = `Can't Find the Key: ${props.editKey}`;
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
          const collection = state.links.value.find(
            (l) => l.domain === props.domain
          );
          if (collection) {
            const loc = collection.links.findIndex((l) => l.key === props.editKey);
            if (loc >= 0) {
              const old = collection.links[loc];
              if (
                old.key != link.value.key ||
                old.url != link.value.url ||
                old.domain != link.value.domain
              ) {
                // It is changed
                const result = await http.put("/api/links", link.value);
                state.links.value.splice(loc, 1, result);
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
    }

    return {
      onSave,
      link,
      title,
      domains,
      isNew,
      valid,
    };
  },
};
</script>
