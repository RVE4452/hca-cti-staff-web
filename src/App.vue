<template>
    <div id="app" style="position: relative; min-height: 100vh">
        <!-- TOPNAV -->
        <!-- MOBILE -->
        <nav class="neu-nav neu-topnav--compact mobile-header no-print" role="navigation" id="a11y-menu" style="padding: 0 0.5em">
            <div class="neu-topnav__left-elements">
                <div class="neu-topnav__notifications-on-dark" @click="toggleNavigationPanel()" style="margin-top: -0.2em; margin-right: 0.5em;" >
                    <a>
                        <i class="material-icons neu-text--white">menu</i>
                    </a>
                </div>
                <div class="neu-topnav--compact__text neu-text--white neu-background—hca-navy neu-margin--right-10" role="menuitem">
                    MyScheduler
                </div>
            </div>
            <div class="neu-topnav__left-elements floatRight">
                <div class="pointer relative" @click="toggleNotificationPanel()" v-if="this.profileData && this.profileData.first">
                        <a class="neu-topnav__notifications-on-dark">
                            <i class="material-icons neu-text--white">notifications</i>
                            <span v-if="updatedunreadCount !== 0"
                                class="absolute neu-notification-badge neu-text--support right-0 top-0">{{ updatedunreadCount }}</span>
                        </a>
                    </div>
                    <div class="pointer relative" onclick="javascript:window.print();">
                        <a class="neu-topnav__notifications-on-dark">
                            <i class="material-icons neu-text--white">print</i>
                        </a>
                    </div>
            </div>
        </nav>
        <!-- DESKTOP NAV -->
        <nav class="neu-nav neu-topnav--compact desktop-header no-print" role="navigation" id="a11y-menu">
                <div class="neu-topnav__left-elements">
                    <span class="neu-topnav--compact__text neu-text--white neu-background—hca-navy neu-text--product neu-margin--right-10" role="menuitem">
                        MyScheduler
                    </span>
                    <div class="neu-tablist" role="tablist" v-if="this.profileData && this.profileData.first">
                        <router-link :to="'/schedule'">
                            <button
                                :class="{
                                    'neu-tablist__tab-on-dark--is-active': isSelected('schedule'),
                                }"
                                class="neu-tablist__tab neu-tablist__tab--large neu-tablist__tab--dark"
                                role="tab"
                                aria-selected="false"
                                aria-controls="panel-home"
                                id="tab-calendar">
                                <span class="neu-tablist__tab-text neu-tablist__tab-text-on-dark">
                                    Calendar View
                                </span>
                            </button>
                        </router-link>
                        <router-link :to="'/departmentView'">
                            <button
                                :class="{
                                'neu-tablist__tab-on-dark--is-active': isSelected('departmentView'),
                                }"
                                class="neu-tablist__tab neu-tablist__tab--large neu-tablist__tab--dark"
                                role="tab"
                                aria-selected="false"
                                aria-controls="panel-home"
                                id="tab-profile">
                                <span class="neu-tablist__tab-text neu-tablist__tab-text-on-dark">
                                    Department View
                                </span>
                            </button>
                        </router-link>                        
                    </div>
                </div>
                
                <div class="neu-right-elem">
                    <div style="margin-top: 0.275em" v-if="this.profileData && this.profileData.first">
                        <router-link :to="'/profile'">
                            <a href="#!"
                            name="lnkProfile" :staffId="this.profileData.staffId" 
                            class="neu-topnav--compact__username neu-background—hca-navy d-inline-block neu-topnav--user-profile-on-dark neu-text--white"
                            role="menuitem">
                                {{ this.profileData.first }} {{ this.profileData.last }}
                                <i arial-label="user icon"
                                class="neu-avatar__icon material-icons neu-text--white">account_circle</i>
                            </a>
                        </router-link>
                    </div>
                    <div v-if="this.isAdmin">
                        <router-link :to="'/admin'">
                            <a class="neu-topnav__notifications-on-dark" :style="isImpersonating ? 'Orange' : 'White'">
                                <i class="material-icons" v-bind:class="isImpersonating?'neu-text--hca-orange':'neu-text--white'">settings</i>
                            </a>
                        </router-link>
                    </div>
                    <div class="pointer relative" @click="toggleNotificationPanel()" v-if="this.profileData && this.profileData.first">
                        <a class="neu-topnav__notifications-on-dark">
                            <i class="material-icons neu-text--white">notifications</i>
                            <span v-if="updatedunreadCount !== 0"
                                class="absolute neu-notification-badge neu-text--support right-0 top-0">{{ updatedunreadCount }}</span>
                        </a>
                    </div>
                    <div class="pointer relative" onclick="javascript:window.print();">
                        <a class="neu-topnav__notifications-on-dark">
                            <i class="material-icons neu-text--white">print</i>
                        </a>
                    </div>
                    <div>
                        <a href="../Help/index.htm"
                        target="_blank"
                        class="neu-topnav__notifications-on-dark">
                            <i class="material-icons neu-text--white">help</i>
                        </a>
                    </div>
                    <div v-if="this.profileData && this.profileData.first">
                        <a v-bind:href="logoutUrl"
                        class="neu-topnav__notifications-on-dark">
                            <i class="material-icons neu-text--white">logout</i>
                        </a>
                    </div>
                </div>
        </nav>
        <!-- NOTIFICATION PANEL -->
        <div class="no-print" v-if="this.profileData && this.profileData.first">
            <Notifications @unreadNotification="notificationCountUpdate"
                @close-event="toggleNotificationPanel"
                :toggleStatus="notificationView"></Notifications>
        </div>
        <!-- END TOPNAV -->
        <!-- MOBILE NAV -->
        <div class="neu-padding--bottom-100 no-print" v-if="showNavigation">
            <div>
                <li class="neu-list__item" role="listitem" @click="toggleNavigationPanel()" v-bind:class = "isSelected('schedule')?'neu-background--cerulean-25':''" v-if="this.profileData && this.profileData.first">
                    <div>
                        <router-link :to="'/schedule'">
                            <p class="neu-list__item-text">Calendar View</p>
                        </router-link>
                    </div>
                </li>
                <li class="neu-list__item" role="listitem" @click="toggleNavigationPanel()" v-bind:class = "isSelected('departmentView')?'neu-background--cerulean-25':''" v-if="this.profileData && this.profileData.first">
                    <div>
                        <router-link :to="'/departmentView'">
                            <p class="neu-list__item-text">Department View</p>
                        </router-link>
                    </div>
                </li>
                <li class="neu-list__item" role="listitem" @click="toggleNavigationPanel()" v-if="this.profileData && this.profileData.tenantUrl">
                    <div>
                        <a v-bind:href="this.profileData.tenantUrl">
                            Facility Scheduler
                        </a>
                    </div>
                </li>
                <li class="neu-list__item" role="listitem" @click="toggleNavigationPanel()" v-bind:class = "isSelected('profile')?'neu-background--cerulean-25':''" v-if="this.profileData && this.profileData.first">
                    <div>
                        <router-link :to="'/profile'">
                            <p class="neu-list__item-text">Profile View</p>
                        </router-link>
                    </div>
                </li>
                <li class="neu-list__item" role="listitem" @click="toggleNavigationPanel()" v-bind:class = "isSelected('admin')?'neu-background--cerulean-25':''"  v-if="this.profileData && this.isAdmin">
                    <div>
                        <router-link :to="'/admin'">
                            <p class="neu-list__item-text">Admin</p>
                        </router-link>
                    </div>
                </li>
                <li class="neu-list__item" role="listitem" @click="toggleNavigationPanel()">
                    <div>
                        <a href="../Help/index.htm" target="_blank">
                            Help
                        </a>
                    </div>
                </li>
                <li class="neu-list__item" role="listitem" @click="toggleNavigationPanel()" v-if="this.profileData && this.profileData.first">
                    <div>
                        <a v-bind:href="logoutUrl">
                            Logout
                        </a>
                    </div>
                </li>
            </div>
        </div>
        <!-- END MOBILE NAV -->
        <!-- ROUTER OUTPUT -->
        <router-view v-bind:class = "showNavigation?'hideBody':''" class="neu-padding--bottom-100 paddBottom0" />
        <!-- END ROUTER OUTPUT -->
        <!-- FOOTER -->
        <footer class="neu-footer--compact neu-footer--compact__white no-print"
                role="navigation"
                id="a11y-menu"
                style="position: absolute; bottom: 0; width: 100%">
            <div class="row">
                <div class="col-md-12 col-lg-6">
                    <a href="#!" class="logo">
                        <img src="@/assets/HCA-Horizontal.png"
                             alt="hca healthcare logo"
                             height="20px" />
                    </a>
                </div>
                <div class="col-md-12 col-lg-6">
                    <p class="neu-text--caption neu-margin--left-10 neu-footer--compact__right-elem">
                        v{{ this.appVersion }} - ©2022 HCA, Inc.
                    </p>
                </div>
            </div>
        </footer>
        <!-- END FOOTER -->
    </div>
</template>

<script lang="ts">
    //import plugins and modules
    import { Options, Vue } from 'vue-class-component';
    import moment from "moment";
    import { mapState } from "vuex";
    import Notifications from "./components/notifications/Notifications.vue";
    
    import * as signalR from "@microsoft/signalr";
    //import bus from '../src/eventBus'
    import { useAppInsights } from './store/modules/AppInsights'
    const dotenv = require("dotenv");

    @Options({
        components: { Notifications },
        computed: {
            ...mapState('profile',["profileData",'isAdmin','isImpersonating',]),
            ...mapState(["oidcUser"]),
        },
    })
    export default class App extends Vue {
        appVersion: string = "";
        notificationView: boolean = false;
        oidcUser!: any;
        profileData!: any;
        isAdmin!: boolean;
        isImpersonating!: boolean;
        showNavigation: boolean = false;
        updatedunreadCount: number = 0;
        appInsightEventData!: any;
        //Signal R
        token = localStorage.getItem("token");
        logoutUrl: any = `${process.env.VUE_APP_AUTHORITY}/SSOLogout/logout.jsp`
        
        connection = new signalR.HubConnectionBuilder()
            .withUrl(process.env.VUE_APP_SIGNALR_HUB_URL!, {
                accessTokenFactory: () => this.token!,
            })
            .withAutomaticReconnect([2000])
            .configureLogging(signalR.LogLevel.Information)
            .build();

        create() {
            

            //subscribe event to get signal r notification
            // this.connection.on("notificationRecieved", (message: string) => {
            //     bus.$emit("assignmentchanged", "Hello");
            // });

            // this.connection.on("messagereceived", (msgEvent: any) => {
            //     if (msgEvent.type == 1) {
            //         bus.$emit("assignmentchanged", msgEvent.message);
            //     }
            //     else if (msgEvent.type == 2) {
            //         bus.$emit("smsprefchanged", msgEvent.message);
            //     }
            //     else if (msgEvent.type == 3) {
            //         bus.$emit("notificationchanged", msgEvent.message);
            //     }
            // });

            //start signal r connection
            //this.connection.start().catch((err) => console.log(err));
            this.appVersion = process.env.VUE_APP_PORTALVER!; 
            localStorage.setItem("isUserLoggedIn", 'true'); 
        }

        
        isSelected(route: string) {
            return this.$route.path.includes(route);
        }

        toggleNavigationPanel() {
            this.showNavigation = !this.showNavigation;
        }

        toggleNotificationPanel() {
            this.notificationView = !this.notificationView;
        }

        notificationCountUpdate(unreadCount: any) {
            this.updatedunreadCount = unreadCount.count;
        }
        NavigateToFS(){
            useAppInsights().trackEvent({name:'UserNavigatedToFS',properties: 
               this.appInsightEventData
            });
        }
    }
</script>

<style src="./css/lib.scss" lang="scss" />

<style type="scss">
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}

a {text-decoration: none; }

@media all and (min-width: 899px) {
    .desktop-header {
        display: flex;
    }
    .mobile-header {
        display: none;
    }
}

@media (max-width: 900px) {
    .desktop-header {
        display: none;
    }
    .mobile-header {
        display: flex;
    }
}

@media (min-width: 900px) and (max-width: 1100px){
        .neu-nav{
            padding: 0 1.8rem !important;
        }
    }

.floatRight{
    float:right;
    right: 0;
    position: absolute;
}
.hideBody {
    display: none;
}

@media print
{
    .no-print, .no-print
    {
        display: none !important;
    }

    .paddBottom0{
        padding-bottom: 0!important;
    }

    body {
        -webkit-print-color-adjust: exact !important;
    }
}
@media print and (max-width: 899px) 
{ 
    body,html{ 
        min-width: 1100px;
    }
}


</style>
