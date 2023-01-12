import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/user";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/HomeView.vue"),
      meta: { requiresAdmin: false },
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/LoginView.vue"),
      meta: { requiresAdmin: false },
    },
    {
      path: "/type/:id",
      component: () => import("@/views/TypeView.vue"),
      meta: { requiresAdmin: false },
    },
    {
      path: "/register",
      name: "registerView",
      component: () => import("@/views/RegisterView.vue"),
      meta: { requiresAdmin: false },
    },
    {
      path: "/cart",
      name: "cartView",
      component: () => import("@/views/CartView.vue"),
      meta: { requiresAdmin: false },
    },
    {
      path: "/validate/:hash",
      name: "EmailValidationView",
      component: () => import("@/views/EmailValidationView.vue"),
      meta: { requiresAdmin: false },
    },
    {
      path: "/admin/inventory/rental",
      name: "rentalinventoryview",
      component: () =>
        import("@/views/admin/inventory/RentalInventoryView.vue"),
      meta: { requiresAdmin: true },
    },
    {
      path: "/admin/inventory/tags",
      name: "tagsView",
      component: () => import("@/views/admin/inventory/TagView.vue"),
      meta: { requiresAdmin: true },
    },
    {
      path: "/admin/inventory/priorities",
      name: "priorityManagement",
      component: () => import("@/views/admin/inventory/PriorityManagementView.vue"),
      meta: { requiresAdmin: true },
    },
    {
      path: "/admin/settings/users",
      name: "userManagement",
      component: () => import("@/views/admin/settings/UserManagementView.vue"),
      meta: { requiresAdmin: true },
    },
    {
      path: "/admin/settings/texts",
      name: "textManagement",
      component: () => import("@/views/admin/settings/TextManagementView.vue"),
      meta: { requiresAdmin: true },
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

router.beforeEach((to) => {
  // only allow access to areas that people are supposed
  const userStore = useUserStore();
  if (to.meta.requiresAdmin && !userStore.is_staff) {
    return { path: "/" };
  }
});

export default router;
