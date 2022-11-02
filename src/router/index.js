import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdminDashboard from '@/views/admin/AdminDashboard.vue'
import AdminObjectView from '@/views/admin/AdminObjectView.vue'
import AdminObjectTypeView from '@/views/admin/AdminObjectTypeView.vue'
import AdminObjectTypesView from '@/views/admin/AdminObjectTypesView.vue'
import AdminCategoriesView from '@/views/admin/AdminCategoriesView.vue'
import AdminCategoryView from '@/views/admin/AdminCategoryView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/login',
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/LoginView.vue')
  },
  {
    path: '/admin',
    name: 'adminarea',
    meta:{
      admin: true
    },

  },
  {
    path: '/admin/dashboard',
    name: 'admindashboard',
    component: AdminDashboard
  },
  {
    path: '/admin/categories',
    name: 'admincategories',
    component: AdminCategoriesView,
  },
  {
    path: '/admin/categories/:id',
    name: 'admincategory',
    component: AdminCategoryView,
  },
  {
    path: '/admin/objecttypes',
    name: 'adminobjecttypes',
    component: AdminObjectTypesView,
  },
  {
    path: '/admin/objecttypes/:id',
    name: 'adminobjecttype',
    component: AdminObjectTypeView,
  },
  {
    path: '/admin/objects',
    name: 'adminobjects',
    component: AdminObjectTypesView,
  },
  {
    path: '/admin/objects/:id',
    name: 'adminobject',
    component: AdminObjectView,
  },
  {
    path: "*",
    component: { render: (h) => h("h1", ["404! Page Not Found!"]) },
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
