import * as VueRouter from "vue-router";

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes: [
    {
      path: "/",
      name: "index",
      component: () => import("@/pages/Index.vue"),
    },
    {
      path: "/designs",
      name: "designs",
      component: () => import("@/pages/Designs.vue"),
    },
    {
      path: "/question",
      name: "question",
      component: () => import("@/pages/Question.vue"),
    },
    {
      path: "/result",
      name: "result",
      component: () => import("@/pages/Result.vue"),
    },
  ],
});

export default router;
