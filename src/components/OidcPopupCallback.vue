<template>
    <div class="app-page app-page--oidcPopup"></div>
  </template>
  
  <script lang="ts">
    import {defineComponent} from 'vue';
    import {mapActions} from 'vuex';
    import { vuexOidcProcessSilentSignInCallback } from 'vuex-oidc'
    import { oidcSettings } from '@/config/oidcSettings'

    export default defineComponent({
      name: 'OidcPopupCallback',
      created() {
        vuexOidcProcessSilentSignInCallback(oidcSettings)
      },
      methods: {
        ...mapActions('oidcStore', ['oidcSignInPopupCallback'])
      }
    });
  </script>