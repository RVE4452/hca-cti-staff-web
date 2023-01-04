
import "./router/componentHooks" // <-- Needs to be first
import { createApp } from "vue";
import App from './App.vue';

import router from "./router";
import store from "./store";
// import net from '@/net'
// import Notifications from 'vue-notification'
import 'vue-search-select/dist/VueSearchSelect.css'
//import VueAppInsights from 'vue-application-insights'
import mitt from 'mitt';
import Component from "vue-class-component";
import { NeutronVue } from '@neutron/vue';
//Add all icons to the library so you can use it in your pag
//library.add(fas, far, fab);
const emitter = mitt();

const app = createApp(App);
//app.component("font-awesome-icon", FontAwesomeIcon);
app.config.globalProperties.$store = store;
app.config.globalProperties.emitter = emitter;
//app.provide("$store", store);
app.use(NeutronVue).use(router).mount('#app');


