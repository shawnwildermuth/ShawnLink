import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Editor from '@/views/Editor.vue';
import SummaryReport from '@/views/SummaryReport.vue';
import { useState } from '@/state';

const state = useState();

const confirmLoaded = (to, from, next) => {
  if (!state.isLoaded) {
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
    path: '/editor/:domain/:editKey',
    name: 'EditLink',
    component: Home,
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
