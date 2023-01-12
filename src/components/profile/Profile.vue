<template>
    <div class="container pheadingNavigation0 containerWidth">
        <neu-container class="row profileMainDiv" v-bind:class="{ 'sidepanel-open': isSharedPanelOpen }">
            <neu-row cols="12">
                <neu-col cols="4" class="profile-desktop-header profile-nav flex40 no-print">
                    <neu-card-content  class="vh-100 vw-20" color="plain-0" col="3">
                        <neu-sub-left-nav name={{userName}} color="plain" side="left">
                            <neu-item :selected="isSelected('EmpDtls')" class="pl-3" @click="routeNavigation('EmployeeDetails')">
                            <neu-stepper slot="start"> <neu-icon slot="start">manage_accounts</neu-icon></neu-stepper>
                            <neu-label>Employee Info</neu-label>
                            <neu-icon v-if="isSelected('EmpDtls')" slot="end">navigate_next</neu-icon>
                            </neu-item>
                            <neu-item :selected="isSelected('SchPref')" class="pl-3"  @click="routeNavigation('SchedulerPreference')" >
                            <neu-stepper slot="start"> <neu-icon slot="start">calendar_month</neu-icon></neu-stepper>
                            <neu-label> Scheduler Preference </neu-label>
                            <neu-icon v-if="isSelected('SchPref')" slot="end">navigate_next</neu-icon>
                            </neu-item>
                            <neu-item :selected="isSelected('PayrollDtls')" class="pl-3" @click="routeNavigation('PayrollDetails')">
                            <neu-stepper slot="start"> <neu-icon slot="start">timer</neu-icon></neu-stepper>
                            <neu-label > Payroll Details </neu-label>
                            <neu-icon slot="end" v-if="isSelected('PayrollDtls')"  >navigate_next</neu-icon>
                            </neu-item>
                        </neu-sub-left-nav>
                    </neu-card-content>
                </neu-col>
                <neu-col cols="4" class="mobile-menu profile-mobile-header no-print">
                    <neu-card-content  class="vh-100 vw-100" color="plain-0" col="3" >
                        <neu-sub-left-nav name="{{userName}}" color="plain" side="left" overlay="true" >
                            <neu-item class="pl-3"  @click="routeNavigation('EmployeeDetails')">
                            <neu-stepper slot="start"> <neu-icon slot="start">manage_accounts</neu-icon></neu-stepper>
                            </neu-item>
                            <neu-item selected="true" class="pl-3"  @click="routeNavigation('SchedulerPreference')">
                            <neu-stepper slot="start"> <neu-icon slot="start">calendar_month</neu-icon></neu-stepper>
                            </neu-item>
                            <neu-item selected="true" class="pl-3"  @click="routeNavigation('PayrollDetails')">
                            <neu-stepper slot="start"> <neu-icon slot="start">timer</neu-icon></neu-stepper>
                            </neu-item>
                            </neu-sub-left-nav>
                    </neu-card-content>
                </neu-col>
                <neu-col cols="8">
                    <neu-card-content  class="vw-80" color="plain-0" col="3" >
                        <main aria-label="content">
                            <!-- MOBILE NAV -->
                            <header class="row neu-margin--bottom-30 flex flex-row w-100 mobile-header ml0">
                                <div class="row neu-margin--top-20 center">
                                    
                                
                                    <neu-card-content center="true">
                                            <h5>
                                                {{ headerCaption }}
                                            </h5>
                                            <div class="neu-text--support small">
                                                {{ pagingNumber }}
                                            </div>
                                    </neu-card-content>
                                    
                                </div>
                            </header>
                            
                            <div v-if="isSelected('EmpDtls')">
                                <EmploymentDetails />
                            </div>
                            
                            <div v-else-if="isSelected('SchPref')">
                                <!-- <SchedulingPref /> -->
                                <neu-lable>SchedulingPref</neu-lable>
                            </div>
                            
                            <div v-else-if="isSelected('PayrollDtls')">
                                <!-- <PayrollDetails /> -->
                                <neu-lable>PayrollDetails</neu-lable>
                            </div>
                            
                        </main>
                    </neu-card-content>
                </neu-col>
            </neu-row>
        </neu-container>
    </div>
</template>
<script lang="ts">
        import { NeuContainer } from '@neutron/vue';
        import { defineComponent } from '@vue/runtime-core';
        import { mapState } from "vuex";
        import EmploymentDetails from "./EmploymentDetails.vue";
        // import SchedulingPref from "./SchedulingPref.vue";
        // import PayrollDetails from "./PayrollDetails.vue";
        export default defineComponent({
            name: 'ProfileComponent',
            data : () =>{
                return { 
                    // oidcUser: '',
                    // profileData: {} as any,
                    userName: "",
                    nameInitials: "",
                    selectedTab: "EmpDtls",
                    headerCaption: "My Employment Details",
                    pagingNumber: "Page 1 of 3",
                    isSelfScheduleAllowed: false,
                    isSharedPanelOpen: false,
                    calenderSelectedDates: {} as any,
                    currentShifts: {} as any,
                    isNotificationMessageVisible: false,
                    msgValue: '',
                    classFlag: '',
                    counter: 0,
                    ssdCounter: 0,
                }
            },
            props: {},
            components: { 
                EmploymentDetails, 
                // SchedulingPref, 
                // SMSPref, 
                // NotificationMgmt,
                //  PayrollDetails,
                //  SaveMsgPopUp
                 },
            computed: {
                ...mapState(["oidcUser"]),
                ...mapState('profile',["profileData"]),
            },
            mounted() {
                this.setDefaultValue()
            },
            methods: {
                setDefaultValue(){
                    if (this.profileData) {
                        this.userName = this.profileData.first + " " + this.profileData.last; 
                        if (this.profileData.first != undefined && this.profileData.last != undefined) {
                            this.nameInitials = this.profileData.first.charAt(0).toUpperCase() + this.profileData.last.charAt(0).toUpperCase();
                        }
    
                        this.isSelfScheduleAllowed = this.profileData.selfSchedule;
                        if (this.isSelfScheduleAllowed){
                            this.pagingNumber = "Page 1 of 5";
                        }
                        
                        var isSelfScheduleDefaultRedirect = (localStorage.getItem("isSelfScheduleDefaultRedirect") == null ? false : localStorage.getItem("isSelfScheduleDefaultRedirect")=='true');
                        
                        if(isSelfScheduleDefaultRedirect){
                            this.clickTab("SelfSchPrefDefault");
                            localStorage.removeItem("isSelfScheduleDefaultRedirect");
                        }
                        let path = window.location.pathname
                        if (path !== '/' && path.split('/').length > 1) {
                            this.routeNavigation(path.split('/')[1])
                        }
                    }
                },
                clickTab(flag: string) {
                if (this.isSelfScheduleAllowed) {
                    if (flag == "EmpDtls") {
                        this.selectedTab = "EmpDtls";
                        this.headerCaption = "My Employment Details";
                        this.pagingNumber = "Page 1 of 3";
                    }
                    //  else if (flag == "SelfSchPrefDefault") {
                    //     this.selectedTab = "SelfSchPrefDefault";
                    //     this.headerCaption = "Self-Scheduling Defaults";
                    //     this.pagingNumber = "Page 2 of 5";
                    // }
                     else if (flag == "SchPref") {
                        this.selectedTab = "SchPref";
                        this.headerCaption = "Scheduling Preferences";
                        this.pagingNumber = "Page 2 of 3";
                    }
                    //  else if (flag == "SMSPref") {
                    //     this.selectedTab = "SMSPref";
                    //     this.headerCaption = "SMS Preferences";
                    //     this.pagingNumber = "Page 4 of 5";
                    // }
                     else if (flag == "PayrollDtls") {
                        this.selectedTab = "PayrollDtls";
                        this.headerCaption = "Employee Payroll Details";
                        this.pagingNumber = "Page 3 of 3";
                    }
    
                    if (this.selectedTab == "SelfSchPrefDefault" && this.ssdCounter != 0) {
                        this.ssdCounter = 0;
                    }
                }
                else {
                    if (flag == "EmpDtls") {
                        this.selectedTab = "EmpDtls";
                        this.headerCaption = "My Employment Details";
                        this.pagingNumber = "Page 1 of 3";
                    } else if (flag == "SchPref") {
                        this.selectedTab = "SchPref";
                        this.headerCaption = "Scheduling Preferences";
                        this.pagingNumber = "Page 2 of 3";
                    } 
                    // else if (flag == "SMSPref") {
                    //     this.selectedTab = "SMSPref";
                    //     this.headerCaption = "SMS Preferences";
                    //     this.pagingNumber = "Page 3 of 4";
                    // }
                     else if (flag == "PayrollDtls") {
                        this.selectedTab = "PayrollDtls";
                        this.headerCaption = "Employee Payroll Details";
                        this.pagingNumber = "Page 3 of 3";
                    }
                }
    
                //else if (flag == "NtfMgmt") {
                //    this.selectedTab = "NtfMgmt";
                //    this.headerCaption = "Notification Management";
                //    this.pagingNumber = "Page 4 of 4";
                //}
                //---Need to add code for Notification Management
                },
    
                isSelected(selectedTabVal: string) {
                    if(this.selectedTab === selectedTabVal){
                        return true;
                    }
                },
                showSidePanel(options:any) {
                    this.isSharedPanelOpen = options.sharedToggle;
                    this.calenderSelectedDates = options.calSelectedDates;
                    this.currentShifts = options.currentShift;
                    this.counter = this.counter + 1;
                },
                routeNavigation(path:string){
                    if(path ==="EmployeeDetails" || path ==="profile"  ){
                        this.clickTab("EmpDtls");
                    }else if(path ==="SchedulerPreference"){
                        this.clickTab("SchPref");
                    }else if(path ==="PayrollDetails"){
                        this.clickTab("PayrollDtls"); 
                    }
                    this.$router.push('/' +path);
                }
            },
        });
    </script>
<style scoped>
    .div-cursor {
        cursor: pointer;
    }
    .itemcenter{
        display: flex;
        align-items: center;
    }

    /* Media Query for Mobile Devices */
    @media (max-width: 480px) {
        .pheadingNavigation0 {
            padding-left: 15px !important;
            padding-right: 15px !important;
        }

        .mobile-Content {
            max-width: 85%;
        }

        .mobile-menu {
            min-width: 15%;
            display: block;
        }

        .prePageNavigationmobile {
            padding-left: 0px !important;
            padding-right: 5px !important;
            font-size: 0.9rem;
        }

        .nxtPageNavigationmobile {
            padding-left: 5px !important;
            padding-right: 0px !important;
            font-size: 0.9rem;
        }

        .leftArrowMobile {
            margin-right: 0px !important;
        }

        .rightArrowMobile {
            margin-left: 0px !important;
        }

        .pleft5 {
            padding-left: 5px !important;
        }

        .profile-mobile-header {
            display: initial;
        }

        .profile-desktop-header {
            display: none;
        }
        

        .profile-Name {
            height: 45px;
            width: 45px;
            border-radius: 50%;
            margin-left: 4px;
            justify-content: center;
        }

        .profile-Name-Initial {
            padding-top: 8px;
            color: #fff;
        }

        .profile-Navigation-Num {
            /* border: 1px solid #01558C; */
            border-radius: 50%;
            padding: 2px;
            width: 30px
        }

        .profileMainDiv {
            position: relative;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
            transition: width 0.2s ease-in-out;
            width: 100%;
        }
        .desktop-menu {
            display: none;
        }
    }

    @media (min-width: 481px) {
        .profile-mobile-header {
            display: none;
        }

        .profile-desktop-header {
            display: initial;
        }
        .desktop-menu {
            display: none;
        }
    }

    /* Media Query for low resolution  Tablets, Ipads */
    @media (min-width: 481px) and (max-width: 767px) {
        .profile-nav {
            padding-left: 0px;
        }

        .profile-Navigation-Num {
            /* border: 1px solid rgb(1, 85, 140); */
            border-radius: 50%;
            padding: 2px;
            width: 30px;
            height: 30px;
        }

        .containerWidth {
            max-width: 608px;
        }

        .flex40 {
            flex: 0 0 40%;
            max-width: 40%;
        }

        .flex60 {
            flex: 0 0 58%;
            max-width: 58%;
            padding-right: 0;
        }

        .profileMainDiv {
            position: relative;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
            transition: width 0.2s ease-in-out;
            width: 100%;
        }
        .mobile-menu{
            display: none;
        }
        .desktop-menu {
            display: block;
        }
    }

    @media (min-width: 768px) and (max-width: 899px) {
        .profile-Navigation-Num {
            /* border: 1px solid rgb(1, 85, 140); */
            border-radius: 50%;
            padding: 2px;
            width: 30px;
            height: 30px;
        }

        .containerWidth {
            max-width: 800px;
        }

        .mobile-header {
            display: block !important;
        }

        .profileMainDiv {
            position: relative;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
            transition: width 0.2s ease-in-out;
            width: 100%;
        }
    }
    /* Media Query for Tablets Ipads portrait mode */
    @media (min-width: 900px) and (max-width: 1024px) {
        .profile-Navigation-Num {
            /* border: 1px solid #01558C; */
            border-radius: 50%;
            padding: 2px;
            width: 30px
        }

        .profileMainDiv {
            position: relative;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
            transition: width 0.2s ease-in-out;
            width: 100%;
        }

        .sidepanel-open {
            transition: width 0.2s ease-in-out;
            width: 70%;
            margin-right: 0px !important;
            margin-left: 0px !important;
        }
        .mobile-menu{
            display: none;
        }
        .desktop-menu {
            display: block;
        }
    }

    /* Media Query for Laptops and Desktops */
    @media (min-width: 1025px) {
        .profile-Navigation-Num {
            /* border: 1px solid #01558C; */
            border-radius: 50%;
            padding: 2px;
            width: 30px
        }

        .profileMainDiv {
            position: relative;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
            transition: width 0.2s ease-in-out;
            width: 100%;
        }

        .sidepanel-open {
            transition: width 0.2s ease-in-out;
            width: 75%;
            margin-right: 0px !important;
            margin-left: 0px !important;
        }

        .pdleft0 {
            padding-left: 0px !important;
        }
        .mobile-menu{
            display: none;
        }
        .desktop-menu {
            display: block;
        }
    }

    .circleNum {
        border: 1px solid rgb(1, 85, 140);
        border-radius: 50px;
        height: 1.6rem;
        width: 38px;
        display: inline-block;
        text-align: center;
    }

    @media print {
        .w100 {
            flex: 0 0 100%;
            max-width: 100%;
        }

        .desktop-header {
            display: flex;
        }

        .mobile-header {
            display: none;
        }
    }
</style>
