<template>
   <neu-container class= "desktop-view">
        <neu-sub-left-nav  color="plain" side="left" :name="userName">
            <!-- <neu-input type="text" readonly="true"  enterkeyhint="search" :value="userName" id="txtUsername" >
            </neu-input> -->
            
            <!-- Nav: Employee Details Starts -->
            <neu-item :selected="isSelected('EmpDtls')" class="pl-3" @click="routeNavigation('EmployeeDetails')">
            <neu-stepper slot="start"> <neu-icon slot="start">manage_accounts</neu-icon></neu-stepper>
            <neu-label>Employee Info</neu-label>
            </neu-item>
            <!-- Nav: Employee Details Ends -->

            <!-- Nav: Schedule Preference Starts -->
            <neu-item :selected="isSelected('SchPref')" class="pl-3"  @click="routeNavigation('SchedulePreference')" >
            <neu-stepper slot="start"> <neu-icon slot="start">calendar_month</neu-icon></neu-stepper>
            <neu-label> Schedule Preference </neu-label>
            </neu-item>
            <!-- Nav: Schedule Preference Ends -->

            <!-- Nav: Payroll Details Starts -->
            <neu-item :selected="isSelected('PayrollDtls')" class="pl-3" @click="routeNavigation('PayrollDetails')">
            <neu-stepper slot="start"> <neu-icon slot="start">timer</neu-icon></neu-stepper>
            <neu-label > Payroll Details </neu-label>
            </neu-item>
            <!-- Nav: Payroll Details Ends -->

        </neu-sub-left-nav>
        <neu-card-content>
            <main aria-label="content">
            <!-- MOBILE NAV -->
            <header class="row neu-margin--bottom-30 flex flex-row w-80 mobile-header ml0">
            <div class="row neu-margin--top-20 center">
            <neu-card-content center="true">
                    <h5>
                        {{ headerCaption }}
                    </h5>
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
                <PayrollDetails />
                <!-- <neu-lable>PayrollDetails</neu-lable> -->
            </div>
                            
            </main>
        </neu-card-content>
    </neu-container>
</template>
<script lang="ts">
        import { NeuContainer } from '@neutron/vue';
        import { defineComponent } from '@vue/runtime-core';
        import { mapState } from "vuex";
        import EmploymentDetails from "./EmploymentDetails.vue";
        // import SchedulingPref from "./SchedulingPref.vue";
        import PayrollDetails from "./PayrollDetails.vue";
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
                NeuContainer,
                EmploymentDetails, 
                // SchedulingPref, 
                // SMSPref, 
                // NotificationMgmt,
                 PayrollDetails,
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
                        
                        this.userName = this.profileData.firstName + " " + this.profileData.lastName; 
                        
                        if (this.profileData.firstName != undefined && this.profileData.lastName != undefined) {
                            this.nameInitials = this.profileData.firstName.charAt(0).toUpperCase() + this.profileData.lastName.charAt(0).toUpperCase();
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
                    else if (flag == "SchPref") {
                        this.selectedTab = "SchPref";
                        this.headerCaption = "Scheduling Preferences";
                        this.pagingNumber = "Page 2 of 3";
                    }
                   
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
                }},
    
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
                    }else if(path ==="SchedulePreference"){
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
    .desktop-view{
        display: -webkit-inline-box;
        overflow: unset;
    }
    /* Media Query for Mobile Devices */
    @media (max-width: 480px) {
        .desktop-view{
            display: flex;
            overflow: unset;
        }
    }

    @media (min-width: 481px) {
        .desktop-view{
            display: flex;
            overflow: unset;
        }
    }

    /* Media Query for low resolution  Tablets, Ipads */
    @media (min-width: 481px) and (max-width: 767px) {
        .desktop-view{
            display: flex;
            overflow: unset;
        }
    }

    @media (min-width: 768px) and (max-width: 899px) {
        .mobile-header {
            display: block !important;
            width:100vw;

        }
        .desktop-view{
            display: -webkit-inline-box;
            overflow: unset;
        }

        
    }
    /* Media Query for Tablets Ipads portrait mode */
    @media (min-width: 900px) and (max-width: 1024px) {
        .mobile-header{
            width:80vw;
        }
        .desktop-view{
            display: -webkit-inline-box;
            overflow: unset;
        }
    }

    /* Media Query for Laptops and Desktops */
    @media (min-width: 1025px) {
       
        .mobile-header{
            width:80vw;
        }
        .desktop-view{
            display: -webkit-inline-box;
            overflow: unset;
        }
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
            width:100vw;

        }
        .desktop-view{
            display: -webkit-inline-box;
            overflow: unset;
        }
    }
    
    
</style>
