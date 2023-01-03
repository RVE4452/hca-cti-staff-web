import { vuexOidcCreateStoreModule } from "vuex-oidc";

// import NProgress from "nprogress";
import store from "@/store";
import http from "@/store/axios";
import { WebStorageStateStore } from 'oidc-client';
import router from "@/router";

export default vuexOidcCreateStoreModule(
{
    authority: process.env.VUE_APP_AUTHORITY!,
    clientId: process.env.VUE_APP_CLIENTID!,
    redirectUri: process.env.VUE_APP_REDIRECTURI!,
    silentRedirectUri: process.env.VUE_APP_SILENTREDIRECTURI!,
    responseType: "code",
    scope: "openid profile",
    loadUserInfo: false,
    automaticSilentRenew: true,
    automaticSilentSignin: false,
    
    //@ts-ignore
    userStore: new WebStorageStateStore({ store: window.sessionStorage })
},
// Optional OIDC store settings
{
    dispatchEventsOnWindow: true,
},
// Optional OIDC event listeners
{
    userLoaded: (user: any) => {
        localStorage["Token"] = user.access_token;

        http.defaults.headers.common[
            "Authorization"
        ] = `Bearer ${user.access_token}`;

        http.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

        // before a request is made start the nprogress
        http.interceptors.request.use((config) => {
            //NProgress.start();
            return config;
        });

        // before a response is returned stop nprogress
        http.interceptors.response.use((response) => {
           // NProgress.done();
            return response;
        });
        if(process.env.VUE_APP_SYSTEMMAINTENANCE === 'true')
        {
        router.push('/systemmaintenance');
        }
        else
        {
        store.dispatch("profile/getProfileDetails", "");
        }
    },
  }
);
