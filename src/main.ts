import Vue from 'vue'
import "./router/componentHooks" // <-- Needs to be first
import { createApp } from "vue";
import App from './App.vue';
import router from "./router";
import store from "./store";
import mitt from 'mitt';
import { NeutronVue } from '@neutron/vue';
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
//Add all icons to the library so you can use it in your pag
//library.add(fas, far, fab);
const emitter = mitt();

const app = createApp(App);
//app.component("font-awesome-icon", FontAwesomeIcon);
app.config.globalProperties.$store = store;
app.config.globalProperties.emitter = emitter;
//app.provide("$store", store);
app.use(NeutronVue).use(router).mount('#app');


