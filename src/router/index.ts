import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("@/views/HomeView.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/LoginView.vue"),
    },
    {
      // redirect rental button to a default case in this case the rental dashboard
      path: "/admin",
      redirect: () => {
        return { path: "/admin/rental/dashboard" };
      },
    },
    {
      // redirect rental button to a default case in this case the rental dashboard
      path: "/admin/rental",
      redirect: () => {
        return { path: "/admin/rental/dashboard" };
      },
    },
    {
      // default case
      path: "/admin/settings",
      redirect: () => {
        return { path: "/admin/settings/texts" };
      },
    },
    {
      //default case
      path: "/admin/inventory",
      redirect: () => {
        return { path: "/admin/inventory/rental" };
      },
    },
    {
      path: "/:catchAll(.*)",
      component: () => import("@/views/errorpages/404CatchAll.vue"),
    },
  ],
});

export default router;
