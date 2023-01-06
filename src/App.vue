<template>
  <neu-app>
    <nav-component> </nav-component>
    <neu-content :scroll-y="true">
      <router-view />
    </neu-content>
    <footer-component></footer-component>
  </neu-app>
</template>

<script>
import { defineComponent } from 'vue'
import { NeuApp, NeuContent } from '@neutron/vue'
import NavComponent from '@/components/NavComponent.vue'
import FooterComponent from '@/components/FooterComponent.vue'

export default defineComponent({
  name: 'App',
  components: {
    FooterComponent,
    NavComponent,
    NeuApp,
    NeuContent,
  },
  data() {
    return {}
  },
})
</script>

<style lang="scss">
@import '~@neutron/core/css/neutron.min.css';
@import './scss/main.scss';
@import 'vue-multiselect/dist/vue-multiselect.css';
@import url("https://fonts.googleapis.com/icon?family=Material+Icons"); //Material Design Fonts
@import url("https://unpkg.com/tachyons@4/css/tachyons.min.css"); //tachyons
</style>
