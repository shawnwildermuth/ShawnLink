import { reactive } from 'vue';
import http from 'axios';

const state = reactive({
  isBusy: false,
  busyMessage: '',
  error: '',
  links: [],
  isLoaded: false,
  async loadLinks () {
    this.setBusy('Loading Links...');
    this.clearError();
    try {
      var result = await http.get('/api/links');
      this.links = result.data;
      this.isLoaded = true;
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
  setError(err) { this.error = err; },
  clearError() { this.error = ''; },
  setBusy(msg) {
    this.isBusy = true;
    if (msg) this.busyMessage = msg;
  },
  clearBusy() {
    this.isBusy = false;
    this.busyMessage = '';
  }
});

export function useState() {
  return state;
}
