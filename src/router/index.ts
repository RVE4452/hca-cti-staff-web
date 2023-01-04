import { createWebHistory, createRouter } from "vue-router";
import { vuexOidcCreateRouterMiddleware } from 'vuex-oidc'
import Admin from "@/components/admin/Admin.vue";
import Login from "@/components/Login.vue";
import OidcPopupCallback from "@/components/OidcPopupCallback.vue";
import InvalidAccount from "@/components/error/InvalidAccount.vue";
import ErrorAccount from "@/components/error/ErrorAccount.vue";
import SystemMaintenance from "@/components/error/SystemMaintenance.vue";
import MySchedule from "@/components/schedule/MyScheduleView.vue"
import Profile from "@/components/profile/Profile.vue";
//import NProgress from "nprogress";
import "../css/nprogress.css";

import store from '../store/index'

const routes = [
    {
        path: "/",
        redirect: '/schedule'
    },
    {
        path: '/callback',
        component: Login
    },
    {
        path: '/schedule',
        component: MySchedule,
        props: { viewFlag: 'CalView' }
    },
    {
        path: '/departmentView',
        component: MySchedule,
        props: { viewFlag: 'DeptView' }
    },
    {
        path: '/Schedule',
        name: 'Schedule',
        component: MySchedule,
        meta: {key: 'schedule', title: 'Schedule Management - Schedule'}
      },
      {
        path: '/Deaprtment',
        name: 'Deaprtment View',
        component: MySchedule
      },
    {
        path: '/profile',
        component: Profile
    },
    {
        path: '/admin',
        component: Admin
    },
    {
        path: '/callback-silent',
        name: 'oidcPopupCallback',
        component: OidcPopupCallback,
        meta: {key: 'callbackSilent', title: 'Schedule Management - Callback Silent'}
      },
    {
        path: '/invalidaccount',
        component: InvalidAccount
    },
    {
        path: '/erroraccount',
        component: ErrorAccount
    }
    ,
    {
        path: '/systemmaintenance',
        component: SystemMaintenance
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
  });
  router.beforeEach(vuexOidcCreateRouterMiddleware(store))
  router.beforeResolve((to, from, next) => {
      // If this isn't an initial page load.
      if (to.path) {
          // Start the route progress bar.
         // NProgress.start()
      }
      next()
  })
  
  router.afterEach((to, from) => {
      // Complete the animation of the route progress bar.
      //NProgress.done()
  })
  
  export default router;
