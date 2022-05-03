import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '@/views/Home';
import Editor from '@/views/Editor';
import SummaryReport from '@/views/SummaryReport';
import state from '@/state';

const confirmLoaded = (to, from, next) => {
  if (!state.isLoaded.value) {
    next('/');
  } else {
    next();
  }
};

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/editor/:editKey',
    name: 'EditLink',
    component: Editor,
    props: true,
    beforeEnter: confirmLoaded
  },
  {
    path: '/editor',
    name: 'NewLink',
    component: Editor,
    beforeEnter: confirmLoaded
  },
  {
    path: '/summaries',
    name: 'Summaries',
    component: SummaryReport
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
