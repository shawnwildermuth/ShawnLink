import { ref } from 'vue';
import http from 'axios';
const state = {
  isBusy: ref(false),
  busyMessage: ref(''),
  error: ref(''),
  links: ref([]),
  isLoaded: ref(false),
  async loadLinks () {
    this.setBusy('Loading Links...');
    this.clearError();
    try {
      var result = await http.get('/api/links');
      this.links.value = result.data;
      this.isLoaded.value = true;
    } catch {
      this.setError('Failed to load links');
    } finally {
      this.clearBusy();
    }
  },
  setError(err) { this.error.value = err; },
  clearError() { this.error.value = ''; },
  setBusy(msg) {
    this.isBusy.value = true;
    if (msg) this.busyMessage.value = msg;
  },
  clearBusy() {
    this.isBusy.value = false;
    this.busyMessage.value = '';
  }
};
export default state;
