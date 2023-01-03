<template>
    <div class="container pheadingNavigation0 containerWidth">
        <div class="row profileMainDiv" v-bind:class="{ 'sidepanel-open': isSharedPanelOpen }">
            <!-- MOBILE NAV -->
            <div class="mobile-menu profile-mobile-header no-print">
                <div class="flex flex-column neu-background--white vh-100">
                    <div class="flex flex-row profile-Name neu-margin--top-20 bg-gray" v-if="oidcUser">
                        <h6 class="profile-Name-Initial">
                            {{ nameInitials }}
                        </h6>
                    </div>

                    <div class="flex flex-column neu-margin--top-30">
                        <div class="neu-divider" />
                        <div :class="{'neu-background--cerulean-25 pleft5': isSelected('EmpDtls')}" class="neu-padding--10 div-cursor" @click="clickTab('EmpDtls')">
                            <div class="flex flex-row justify-content-between">
                                <div class="flex">
                                    <div :class="{'neu-background--denim neu-text--white': isSelected('EmpDtls')}"
                                         class="flex justify-content-center profile-Navigation-Num">
                                        <i class="material-icons">
                                            manage_accounts
                                        </i>
                                    </div>
                                </div>
                                <p v-if="isSelected('EmpDtls')" class="material-icons neu-button__icon neu-button__icon--left neu-text--denim align-self-center">chevron_right</p>
                            </div>
                        </div>
                        <div v-if="isSelfScheduleAllowed" class="neu-divider" />
                        <div v-if="isSelfScheduleAllowed" :class="{'neu-background--cerulean-25 pleft5': isSelected('SelfSchPrefDefault')}" class="neu-padding--10 div-cursor" @click="clickTab('SelfSchPrefDefault')">
                            <div class="flex flex-row justify-content-between">
                                <div class="flex">
                                    <div :class="{'neu-background--denim neu-text--white': isSelected('SelfSchPrefDefault')}"
                                         class="flex justify-content-center profile-Navigation-Num">
                                        <i class="material-icons">
                                            calendar_month
                                        </i>
                                    </div>
                                </div>
                                <p v-if="isSelected('SelfSchPrefDefault')" class="material-icons neu-button__icon neu-button__icon--left neu-text--denim align-self-center">chevron_right</p>
                            </div>
                        </div>
                        <div class="neu-divider" />
                        <div :class="{'neu-background--cerulean-25 pleft5': isSelected('SchPref')}" class="neu-padding--10 div-cursor" @click="clickTab('SchPref')">
                            <div class="flex flex-row justify-content-between">
                                <div class="flex">
                                    <div :class="{'neu-background--denim neu-text--white': isSelected('SchPref')}" class="flex justify-content-center profile-Navigation-Num">
                                        <i class="material-icons">
                                            edit_calendar
                                        </i>
                                    </div>
                                </div>
                                <p v-if="isSelected('SchPref')" class="material-icons neu-button__icon neu-button__icon--left neu-text--denim align-self-center">chevron_right</p>
                            </div>
                        </div>
                        <div class="neu-divider" />
                        <div :class="{'neu-background--cerulean-25 pleft5': isSelected('SMSPref')}" class="neu-padding--10 div-cursor" @click="clickTab('SMSPref')">
                            <div class="flex flex-row justify-content-between">
                                <div class="flex">
                                    <div :class="{'neu-background--denim neu-text--white': isSelected('SMSPref')}"
                                         class="flex justify-content-center profile-Navigation-Num">
                                        <i class="material-icons">
                                            message
                                        </i>
                                    </div>
                                </div>
                                <p v-if="isSelected('SMSPref')" class="material-icons neu-button__icon neu-button__icon--left neu-text--denim align-self-center">chevron_right</p>
                            </div>
                        </div>

                        <div class="neu-divider" />
                        <div :class="{'neu-background--cerulean-25 pleft5': isSelected('PayrollDtls')}" class="neu-padding--10 div-cursor" @click="clickTab('PayrollDtls')">
                            <div class="flex flex-row justify-content-between">
                                <div class="flex">
                                    <div :class="{'neu-background--denim neu-text--white': isSelected('PayrollDtls')}"
                                         class="flex justify-content-center profile-Navigation-Num">
                                        <i class="material-icons">
                                            timer
                                        </i>
                                    </div>
                                </div>
                                <p v-if="isSelected('PayrollDtls')" class="material-icons neu-button__icon neu-button__icon--left neu-text--denim align-self-center">chevron_right</p>
                            </div>
                        </div>
                        <div class="neu-divider" />
                    </div>
                </div>
            </div>
            <!-- Desktop NAV -->
            <div class="col-sm-4 profile-desktop-header profile-nav flex40 no-print">
                <div class="flex flex-column neu-background--white vh-100">
                    <div class="flex flex-row w-100 neu-margin--top-20" v-if="oidcUser">
                        <p class="neu-text--product offset-1">
                            {{ userName}}
                        </p>
                    </div>

                    <div class="flex flex-column neu-margin--top-30">
                        <div class="neu-divider" />
                        <div :class="{'neu-background--cerulean-25': isSelected('EmpDtls')}" class="neu-padding--10 div-cursor" @click="clickTab('EmpDtls')">
                            <div class="flex flex-row justify-content-between">
                                <div class="flex">
                                    <div :class="{'neu-background--denim neu-text--white': isSelected('EmpDtls')}"
                                         class="flex justify-content-center profile-Navigation-Num">
                                        <i class="material-icons">
                                            manage_accounts
                                        </i>
                                    </div>
                                    <div :class="{'neu-text--bold': isSelected('EmpDtls')}"
                                         class="neu-text--caption neu-margin--left-10 align-self-center bold">My Employment Details</div>
                                </div>
                                <p v-if="isSelected('EmpDtls')" class="material-icons neu-button__icon neu-button__icon--left neu-text--denim align-self-center">chevron_right</p>
                            </div>
                        </div>
                        <div v-if="isSelfScheduleAllowed" class="neu-divider" />
                        <div v-if="isSelfScheduleAllowed" :class="{'neu-background--cerulean-25': isSelected('SelfSchPrefDefault')}" class="neu-padding--10 div-cursor" @click="clickTab('SelfSchPrefDefault')">
                            <div class="flex flex-row justify-content-between">
                                <div class="flex">
                                    <div :class="{'neu-background--denim neu-text--white': isSelected('SelfSchPrefDefault')}"
                                         class="flex justify-content-center profile-Navigation-Num">
                                        <i class="material-icons">
                                            calendar_month
                                        </i>
                                    </div>
                                    <div :class="{'neu-text--bold': isSelected('SelfSchPrefDefault')}"
                                         class="neu-text--caption neu-margin--left-10 align-self-center bold">Self-Scheduling Defaults</div>
                                </div>
                                <p v-if="isSelected('SelfSchPrefDefault')" class="material-icons neu-button__icon neu-button__icon--left neu-text--denim align-self-center">chevron_right</p>
                            </div>
                        </div>
                        <div class="neu-divider" />
                        <div :class="{'neu-background--cerulean-25': isSelected('SchPref')}" class="neu-padding--10 div-cursor" @click="clickTab('SchPref')">
                            <div class="flex flex-row justify-content-between">
                                <div class="flex">
                                    <div :class="{'neu-background--denim neu-text--white': isSelected('SchPref')}" class="flex justify-content-center profile-Navigation-Num">
                                        <i class="material-icons">
                                            edit_calendar
                                        </i>
                                    </div>
                                    <div :class="{'neu-text--bold': isSelected('SchPref')}"
                                         class="neu-text--caption neu-margin--left-10 align-self-center bold">Schedule Preferences</div>
                                </div>
                                <p v-if="isSelected('SchPref')" class="material-icons neu-button__icon neu-button__icon--left neu-text--denim align-self-center">chevron_right</p>
                            </div>
                        </div>
                        <div class="neu-divider" />
                        <div :class="{'neu-background--cerulean-25': isSelected('SMSPref')}" class="neu-padding--10 div-cursor" @click="clickTab('SMSPref')">
                            <div class="flex flex-row justify-content-between">
                                <div class="flex">
                                    <div :class="{'neu-background--denim neu-text--white': isSelected('SMSPref')}"
                                         class="flex justify-content-center profile-Navigation-Num">
                                        <i class="material-icons">
                                            message
                                        </i>
                                    </div>
                                    <div :class="{'neu-text--bold': isSelected('SMSPref')}"
                                         class="neu-text--caption neu-margin--left-10 align-self-center bold">SMS Opt-In</div>
                                </div>
                                <p v-if="isSelected('SMSPref')" class="material-icons neu-button__icon neu-button__icon--left neu-text--denim align-self-center">chevron_right</p>
                            </div>
                        </div>

                        <div class="neu-divider" />
                        <div :class="{'neu-background--cerulean-25': isSelected('PayrollDtls')}" class="neu-padding--10 div-cursor" @click="clickTab('PayrollDtls')">
                            <div class="flex flex-row justify-content-between">
                                <div class="flex">
                                    <div :class="{'neu-background--denim neu-text--white': isSelected('PayrollDtls')}"
                                         class="flex justify-content-center profile-Navigation-Num">
                                        <i class="material-icons">
                                            timer
                                        </i>
                                    </div>
                                    <div :class="{'neu-text--bold': isSelected('PayrollDtls')}"
                                         class="neu-text--caption neu-margin--left-10 align-self-center bold">Payroll Details</div>
                                </div>
                                <p v-if="isSelected('PayrollDtls')" class="material-icons neu-button__icon neu-button__icon--left neu-text--denim align-self-center">chevron_right</p>
                            </div>
                        </div>
                        <div class="neu-divider" />
                    </div>
                </div>
            </div>

            <div class="col-sm-8 mobile-Content flex60 w100">
                <main aria-label="content">
                    <!-- MOBILE NAV -->
                    <header class="row neu-margin--bottom-30 flex flex-row w-100 mobile-header ml0">
                        <div class="row neu-margin--top-10">
                            <div class="col-md-12 pb2 ph0">
                                <div class="neu-text--align-left dib neu-float--left">
                                    <button class="neu-button neu-text--denim prePageNavigationmobile"
                                            v-if="selectedTab !== 'EmpDtls'"
                                            @click="callPreviousPage()">
                                        <span class="material-icons neu-button__icon neu-button__icon--left leftArrowMobile">chevron_left</span>
                                        Previous Page
                                    </button>
                                </div>
                                <div class="neu-text--align-right dib neu-float--right">
                                    <button class="neu-button  neu-text--denim nxtPageNavigationmobile"
                                            v-if="selectedTab !== 'PayrollDtls'"
                                            @click="callNextPage()">
                                        Next Page
                                        <span class="material-icons neu-button__icon neu-button__icon--right rightArrowMobile">chevron_right</span>
                                    </button>
                                </div>
                            </div>
                            <div class="col-md-12 pb2 ph0">
                                <div style="text-align: center">
                                    <h6>
                                        {{ headerCaption }}
                                    </h6>
                                    <div class="neu-text--support small">
                                        {{ pagingNumber }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                    <!-- Desktop NAV -->
                    <header class="row neu-margin--bottom-30 neu-margin--top-20 flex flex-row w-100 desktop-header">
                        <div class="col-sm-3 neu-text--align-left no-print" v-bind:class="{ 'pdleft0': isSharedPanelOpen }">
                            <button class="neu-button neu-text--denim"
                                    v-bind:class="{ 'pdleft0': isSharedPanelOpen }"
                                    v-if="selectedTab !== 'EmpDtls'"
                                    @click="callPreviousPage()">
                                <span class="material-icons neu-button__icon neu-button__icon--left">chevron_left</span>
                                Previous Page
                            </button>
                        </div>
                        <div class="col-sm-6 neu-text--align-center w100">
                            <h6>
                                {{ headerCaption }}
                            </h6>
                            <div class="neu-text--support small no-print">
                                {{ pagingNumber }}
                            </div>
                        </div>
                        <div class="col-sm-3 neu-text--align-right no-print">
                            <button class="neu-button  neu-text--denim"
                                    v-if="selectedTab !== 'PayrollDtls'"
                                    @click="callNextPage()">
                                Next Page
                                <span class="material-icons neu-button__icon neu-button__icon--right">chevron_right</span>
                            </button>
                        </div>
                    </header>
                    <div v-if="isSelected('EmpDtls')">
                        <EmploymentDetails />
                    </div>
                    <div v-else-if="isSelected('SelfSchPrefDefault')">
                        <SelfSchedulingDefault :ssdCounter="ssdCounter"
                                               @showSidePanelCS="showSidePanel($event);"
                                               @showNotificationModalCS="showNotificationModal($event);" />
                    </div>
                    <div v-else-if="isSelected('SchPref')">
                        <SchedulingPref />
                    </div>
                    <div v-else-if="isSelected('SMSPref')">
                        <SMSPref />
                    </div>
                    <div v-else-if="isSelected('PayrollDtls')">
                        <PayrollDetails />
                    </div>
                    <div v-else-if="isSelected('NtfMgmt')">
                        <NotificationMgmt />
                    </div>
                </main>
            </div>
            <div v-if="isNotificationMessageVisible">
                <SaveMsgPopUp @closeModal="closeSMPModal"
                              :msgValue="msgValue"
                              :classFlag="classFlag"></SaveMsgPopUp>
            </div>
        </div>
        <SharedPanel v-if="isSharedPanelOpen"
                     :isSharedPanelOpen="isSharedPanelOpen"
                     :currentShift="currentShifts"
                     :calSelectedDates="calenderSelectedDates"
                     :counter="counter"
                     :key="counter"
                     @close-modal="closeModal"
                     @showSuccessMesssgPopUp="showSMPModal">
        </SharedPanel>
    </div>
</template>
<script lang="ts">
      import { Options, Vue } from 'vue-class-component';
    import moment from "moment";
    import { mapState } from "vuex";
    import EmploymentDetails from "./EmploymentDetails.vue";
    import SelfSchedulingDefault from "./SelfSchedulingDefault.vue";
    import SchedulingPref from "./SchedulingPref.vue";
    import SMSPref from "./SMSPref.vue";
    import NotificationMgmt from "./NotificationMgmt.vue";
    import PayrollDetails from "./PayrollDetails.vue";
    import SharedPanel from "./SharedPanel.vue"
   
    import SaveMsgPopUp from "@/components/shared/SaveMsgPopUp.vue";

    Options({
        components: { EmploymentDetails, SchedulingPref, SMSPref, NotificationMgmt, PayrollDetails, SelfSchedulingDefault, SharedPanel, SaveMsgPopUp },
        computed: {
            ...mapState(["oidcUser"]),
             ...mapState('profile',["profileData"]),
        },
    })
    export default class Profile extends Vue {
        oidcUser!: any;
       
        public profileData!: any;

        userName: string = "";
        nameInitials: string = "";

        selectedTab = "EmpDtls";
        headerCaption = "My Employment Details";
        pagingNumber = "Page 1 of 4";
        isSelfScheduleAllowed: boolean = false;
        isSharedPanelOpen: boolean = false;
        calenderSelectedDates: any = {};
        currentShifts!: any;
        isNotificationMessageVisible: boolean = false;
        msgValue: string = '';
        classFlag: string = '';
        counter: any = 0;
        ssdCounter: any = 0;

        async mounted() {
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
            }
        }

        clickTab(flag: string) {
            if (this.isSelfScheduleAllowed) {
                if (flag == "EmpDtls") {
                    this.selectedTab = "EmpDtls";
                    this.headerCaption = "My Employment Details";
                    this.pagingNumber = "Page 1 of 5";
                } else if (flag == "SelfSchPrefDefault") {
                    this.selectedTab = "SelfSchPrefDefault";
                    this.headerCaption = "Self-Scheduling Defaults";
                    this.pagingNumber = "Page 2 of 5";
                } else if (flag == "SchPref") {
                    this.selectedTab = "SchPref";
                    this.headerCaption = "Scheduling Preferences";
                    this.pagingNumber = "Page 3 of 5";
                } else if (flag == "SMSPref") {
                    this.selectedTab = "SMSPref";
                    this.headerCaption = "SMS Preferences";
                    this.pagingNumber = "Page 4 of 5";
                } else if (flag == "PayrollDtls") {
                    this.selectedTab = "PayrollDtls";
                    this.headerCaption = "Employee Payroll Details";
                    this.pagingNumber = "Page 5 of 5";
                }

                if (this.selectedTab == "SelfSchPrefDefault" && this.ssdCounter != 0) {
                    this.ssdCounter = 0;
                }
            }
            else {
                if (flag == "EmpDtls") {
                    this.selectedTab = "EmpDtls";
                    this.headerCaption = "My Employment Details";
                    this.pagingNumber = "Page 1 of 4";
                } else if (flag == "SchPref") {
                    this.selectedTab = "SchPref";
                    this.headerCaption = "Scheduling Preferences";
                    this.pagingNumber = "Page 2 of 4";
                } else if (flag == "SMSPref") {
                    this.selectedTab = "SMSPref";
                    this.headerCaption = "SMS Preferences";
                    this.pagingNumber = "Page 3 of 4";
                } else if (flag == "PayrollDtls") {
                    this.selectedTab = "PayrollDtls";
                    this.headerCaption = "Employee Payroll Details";
                    this.pagingNumber = "Page 4 of 4";
                }
            }

            //else if (flag == "NtfMgmt") {
            //    this.selectedTab = "NtfMgmt";
            //    this.headerCaption = "Notification Management";
            //    this.pagingNumber = "Page 4 of 4";
            //}
            //---Need to add code for Notification Management
        }

        isSelected(selectedTabVal: string) {
            return this.selectedTab === selectedTabVal;
        }

        callPreviousPage() {
            if (this.isSelfScheduleAllowed) {
                if (this.selectedTab === "SelfSchPrefDefault") {
                    this.clickTab("EmpDtls");
                } else if (this.selectedTab === "SchPref") {
                    this.clickTab("SelfSchPrefDefault");
                } else if (this.selectedTab === "SMSPref") {
                    this.clickTab("SchPref");
                } else if (this.selectedTab === "PayrollDtls") {
                    this.clickTab("SMSPref");
                }
            }
            else {
                if (this.selectedTab === "SchPref") {
                    this.clickTab("EmpDtls");
                } else if (this.selectedTab === "SMSPref") {
                    this.clickTab("SchPref");
                } else if (this.selectedTab === "PayrollDtls") {
                    this.clickTab("SMSPref");
                }
            }

        }

        callNextPage() {
            if (this.isSelfScheduleAllowed) {
                if (this.selectedTab === "EmpDtls") {
                    this.clickTab("SelfSchPrefDefault");
                } else if (this.selectedTab === "SelfSchPrefDefault") {
                    this.clickTab("SchPref");
                } else if (this.selectedTab === "SchPref") {
                    this.clickTab("SMSPref");
                } else if (this.selectedTab === "SMSPref") {
                    this.clickTab("PayrollDtls");
                }
            }
            else {
                if (this.selectedTab === "EmpDtls") {
                    this.clickTab("SchPref");
                } else if (this.selectedTab === "SchPref") {
                    this.clickTab("SMSPref");
                } else if (this.selectedTab === "SMSPref") {
                    this.clickTab("PayrollDtls");
                }
            }

        }

        showSidePanel(options:any) {
            this.isSharedPanelOpen = options.sharedToggle;
            this.calenderSelectedDates = options.calSelectedDates;
            this.currentShifts = options.currentShift;
            this.counter = this.counter + 1;
        }

        closeModal() {
            this.isSharedPanelOpen = false;
            if (this.ssdCounter >= 0) {
                this.ssdCounter = -1;
            }
            else {
                this.ssdCounter = this.ssdCounter - 1;
            }
        }

        showSMPModal(successFlag: boolean = true, msgValue: string = '') {
            window.scrollTo(0, 0);
            if (msgValue != '') {
                this.msgValue = successFlag ? msgValue : "Failed to save your changes";
            }
            else {
                this.msgValue = successFlag ? "Your changes have been saved." : "Failed to save your changes";
            }
            this.classFlag = successFlag ? "success" : "error";
            this.isNotificationMessageVisible = true;
            
            if (this.ssdCounter <= 0) {
                this.ssdCounter = 1;
            }
            else {
                this.ssdCounter = this.ssdCounter + 1;
            }
            this.isSharedPanelOpen = false;
        }

        closeSMPModal() {
            this.isNotificationMessageVisible = false;
        }

        showNotificationModal(options:any) {
            if (options.msgValue != '') {
                this.msgValue = options.msgValue;
            }
            else {
                this.msgValue = options.successFlag ? "Your changes have been saved." : "Failed to save your changes";
            }
            this.classFlag = options.successFlag ? "success" : "error";
            this.isNotificationMessageVisible = true;
        }
    }
</script>
<style scoped>
    .div-cursor {
        cursor: pointer;
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
            max-width: 15%;
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
    }

    @media (min-width: 481px) {
        .profile-mobile-header {
            display: none;
        }

        .profile-desktop-header {
            display: initial;
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
