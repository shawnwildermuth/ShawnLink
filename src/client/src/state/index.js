import { ref } from 'vue';
import http from 'axios';
const state = {
  isBusy: ref(false),
  error: ref(''),
  links: ref([]),
  isLoaded: ref(false),
  async loadLinks () {
    this.isBusy.value = true;
    try {
      var result = await http.get('/api/links');
      this.links.value = result.data;
      this.isLoaded.value = true;
    } catch {
      this.error.value = 'Failed to load links';
    } finally {
      this.isBusy.value = false;
    }
  }
};
export default state;
