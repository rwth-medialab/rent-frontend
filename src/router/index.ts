import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/HomeView.vue"),
    },
    {
      path: "/admin/inventory/rental",
      name: "rentalinventoryview",
      component: () =>
        import("@/views/admin/inventory/RentalInventoryView.vue"),
    },
    {
      path: "/admin/inventory/tags",
      name: "tagsView",
      component: () => import("@/views/admin/inventory/TagView.vue"),
    },
    {
      path: "/admin/settings/users",
      name: "userManagement",
      component: () => import("@/views/admin/settings/UserManagementView.vue"),
    },
    {
      path: "/admin/settings/texts",
      name: "textManagement",
      component: () => import("@/views/admin/settings/TextManagementView.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/LoginView.vue"),
    },
    {
      path: "/type/:id",
      component: () => import("@/views/TypeView.vue"),
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
