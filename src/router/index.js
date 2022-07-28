import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    // name: "index",
    // component: () => import("../components/HelloWorld.vue"),
    redirect: { name: "openLibrary" },
  },
  {
    path: "/library",
    name: "openLibrary",
    component: () => import("../components/openLibrary.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
