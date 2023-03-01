import { createWebHistory, createRouter } from "vue-router";
import { vuexOidcCreateRouterMiddleware } from 'vuex-oidc'
import Login from "@/components/Login.vue";
import OidcPopupCallback from "@/components/OidcPopupCallback.vue";
import InvalidAccount from "@/components/error/InvalidAccount.vue";
import ErrorAccount from "@/components/error/ErrorAccount.vue";
import SystemMaintenance from "@/components/error/SystemMaintenance.vue";
import MySchedule from "@/components/schedule/MyScheduleView.vue"
import DepartmentView from "@/components/schedule/DepartmentView.vue"
import Profile from "@/components/profile/Profile.vue";
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
        path: '/Schedule',
        name: 'Schedule',
        component: MySchedule,
        props: { viewFlag: 'CalView' }
    },
    {
        path: '/Department',
        component: DepartmentView,
        props: { viewFlag: 'DeptView' }
    }, 
    {
        path: '/profile',
        name: 'Profile',
        component: Profile,
        meta: {key: 'profile', title: 'Schedule Management - Profile'}
    }, 
    {
        path: '/SchedulePreference',
        component: Profile
    },
    {
        path: '/EmployeeDetails',
        component: Profile
    },
    {
        path: '/PayrollDetails',
        component: Profile
    }, 
    {
        path: '/oidc-popup-callback',
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
