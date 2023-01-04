// https://github.com/perarnborg/vuex-oidc-example/blob/master/src/config/oidc.js

import { VuexOidcClientSettings } from 'vuex-oidc'
export const oidcSettings = {
  authority: process.env.VUE_APP_AUTHORITY,
  clientId: process.env.VUE_APP_CLIENTID,
  redirectUri: process.env.VUE_APP_REDIRECTURI,
  silentRedirectUri: process.env.VUE_APP_SILENTREDIRECTURI,
  responseType: 'code',
  scope: 'openid profile',
  loadUserInfo: false,
  automaticSilentRenew: true,
  automaticSilentSignin: false
} as VuexOidcClientSettings