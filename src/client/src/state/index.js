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
      this.links.value = result.data.sort((a,b) => a.key.localeCompare(b.key));
      this.isLoaded.value = true;
    } catch (e) {
      console.error(e);
      this.setError('Failed to load links');
    } finally {
      this.clearBusy();
    }
  },
  async loadSummaries() {
    this.setBusy("Loading Report");
    this.clearError();
    try {
      var result = await http.get('/api/links/summary');
      return result.data; //.sort((a,b) => a.key.localeCompare(b.key));
    } catch (e) {
      console.error(e);
      this.setError('Failed to load report');
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
