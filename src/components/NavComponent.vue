<template>
  <neu-header>
    <neu-toolbar v-if="oidcUser" nav fluid color="primary-100">
      <neu-drawer-button slot="start" text="Menu" class="d-md-none" drawer="first">
      </neu-drawer-button>

      <neu-row slot="start" class="row-align-center d-md-none" nav>
        <neu-link nav aria-label="Title Link to Homepage">
          <neu-title class="neu-text-center neu-text-md-left" color="plain-0">
            Schedule Management
          </neu-title>
        </neu-link>
      </neu-row>

      <neu-row slot="start" class="row-align-center" nav>
        <neu-link nav aria-label="Title Link to Homepage" class="d-none d-md-block">
          <neu-title class="neu-text-center neu-text-md-left" color="plain-0">
            Schedule Management
          </neu-title>
        </neu-link>

        <neu-tablist class="d-none d-md-block">
          <neu-tab v-for="page in pages" :class="selectedPage === page ? 'neu-tab--navy-active' : ''" :key="page" navy  @click="routeToPage">
            {{ page }}
          </neu-tab>
        </neu-tablist>
      </neu-row>
      
      <neu-user-controls slot="end" class="d-none d-md-flex"
        :user="oidcUser.firstName.toUpperCase() + ' ' + oidcUser.lastName.toUpperCase()" @click="routeNavigation('profile')">
        <neu-link nav @click="routeNavigation('profile')">
        <neu-avatar class="icon-padding-person" color="plain-0">
          <neu-icon>person</neu-icon>
        </neu-avatar>
        </neu-link>
        <neu-avatar class="icon-padding" color="plain-0">
          <neu-icon>notifications</neu-icon>
        </neu-avatar>
        <neu-avatar class="icon-padding" color="plain-0">
          <neu-icon>help</neu-icon>
        </neu-avatar>
        <neu-link nav :href="appLogoutUrl">
          <neu-avatar class="icon-padding" color="plain-0">
            <neu-icon>logout</neu-icon>
          </neu-avatar>
        </neu-link>
      </neu-user-controls>
    </neu-toolbar>
  </neu-header>

  <neu-drawer v-if="oidcUser" side="start" drawer-id="first" content-id="drawerContent">
    <neu-content id="drawerContent" nav>
      <neu-list lines="full" nav>
        <neu-drawer-toggle auto-hide drawer="first">
        </neu-drawer-toggle>
        <neu-item nav v-for="page in pages" :key="page" :active="selectedPage === page" @click="routeToPage">
          {{ page }}
        </neu-item>

        <neu-item nav>
          <neu-icon>notifications</neu-icon>
          <neu-link nav :href="appLogoutUrl" class="neu-tab-h">
            Notifications
          </neu-link>
        </neu-item>

        <neu-item nav>
          <neu-icon>help</neu-icon>
          <neu-link nav :href="appLogoutUrl" class="neu-tab-h">
            Help
          </neu-link>
        </neu-item>

        <neu-item nav>
          <neu-icon>logout</neu-icon>
          <neu-link nav :href="appLogoutUrl" class="neu-tab-h">
            Logout
          </neu-link>
        </neu-item>
      </neu-list>

        <neu-user-controls :user="oidcUser.firstName.toUpperCase() + ' ' + oidcUser.lastName.toUpperCase()" drawer @click="routeNavigation('profile')" >
          <neu-link nav @click="routeNavigation('profile')">
          <neu-avatar slot="avatar" color="gray-60">
            <neu-icon>person</neu-icon>
          </neu-avatar>
        </neu-link>
        </neu-user-controls>
    </neu-content>
  </neu-drawer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapGetters } from 'vuex'
import {
  NeuContent,
  NeuList,
  NeuDrawer,
  NeuItem,
  NeuDrawerToggle,
  NeuHeader,
  NeuToolbar,
  NeuTab,
  NeuTablist,
  NeuLink,
  NeuIcon,
  NeuAvatar,
  NeuDrawerButton,
  NeuTitle,
  NeuUserControls,
  NeuRow,
} from '@neutron/vue'

export default defineComponent({
  name: 'NavComponent',
  components: {
    NeuContent,
    NeuList,
    NeuDrawer,
    NeuItem,
    NeuDrawerToggle,
    NeuHeader,
    NeuToolbar,
    NeuTab,
    NeuTablist,
    NeuLink,
    NeuIcon,
    NeuAvatar,
    NeuDrawerButton,
    NeuTitle,
    NeuUserControls,
    NeuRow,
  },
  data() {
    return {
      selectedPage: '',
      pages: ['Schedule', 'Department'],
      appLogoutUrl: process.env.VUE_APP_LOGOUT,
    }
  },
  computed: {
    ...mapGetters(['oidcUser'])
  },
  watch: {
    '$route.fullPath': {
      handler() {
        this.setSelectedPage()
      },
      deep: true,
      immediate: true
    }
  },
  methods:{
    setSelectedPage(){
      let newSelectedPage = 'Schedule'
      let path = window.location.pathname
      if (path !== '/' && path.split('/').length > 1) {
          let routePage = path.split('/')[1].split(' ')[0]
          this.pages.forEach((page) => {
            if (page.toLowerCase().replace(' ', '') === routePage.toLowerCase())
            newSelectedPage = page
          })
        }
      this.selectedPage = newSelectedPage
    },
    routeToPage(event: { target: HTMLInputElement; }) {
      this.$router.push('/' + event.target.innerText.split(' ')[0])
    },
    routeNavigation(path:string){
        debugger;
        this.$router.push('/' +path);
      },
  }
})
</script>
