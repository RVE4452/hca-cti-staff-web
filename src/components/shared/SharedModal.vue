<template>
    <div class="no-print" v-bind:class="isPanelOpen ? 'sideNavPanel' : 'sideNavPanelClose'">
        <header class="fs-22 fw-bold modal-header flex relative" id="modalTitle">
            <span class="panHeading">{{ requestTypeArray[sharedRequest.type - 1]}} </span>
            <button type="button"
                    class="btn-close f1 absolute pointer btnSidePanelClose"
                    @click="close"
                    data-test="modal-close"
                    aria-label="Close Modal">
                &times;
            </button>
        </header>
        <template v-if="showDateNavigation()">
            <div class="col-md calender-nav">
                <div style="text-align: center">
                    <h5>
                        <i @click="previousDay"
                           class="material-icons pointer calendar-navigation"
                           style="position: relative; top: 4px">
                            chevron_left
                        </i>
                        <span>
                            {{ this.sharedRequest && this.sharedRequest.calSelectedDates && this.sharedRequest.calSelectedDates.startDate ? formatDate(this.sharedRequest.calSelectedDates.startDate) : formatDate(currentEvent.date)  }}
                        </span>
                        <i @click="nextDay"
                           class="material-icons pointer calendar-navigation"
                           style="position: relative; top: 4px">
                            chevron_right
                        </i>
                    </h5>
                </div>
            </div>
        </template> 
        <!-- To-Do: Changing tab visibility logic need to update tab content visibility and this.getActiveTab() logic-->      
        <div class="neu-tablist" role="tablist">
            <template v-if="sharedRequest.type === 1">
                <button v-if="sharedRequest.selfSchedule && this.currentEvent.status !='0 Needs'"
                        v-bind:id="'tabBtn-' + (sharedRequest.status == 'Posted' ? 'OpenNeeds' : 'SelfSchedule')"
                        v-on="{ click: () => (activeTab = 0) }"
                        v-bind:class="
        ` ${
            activeTab == 0 ? 'neu-tablist__tab-on-light--is-active' : ''
        }`
        "
                        class="neu-tablist__tab neu-tablist__tab-on-light padding-left1 padding-right1 pb3 pt3"
                        role="tab"
                        aria-selected="true"
                        aria-controls="panel-name1">
                    <span class="neu-tablist__tab-text neu-tablist__tab-text-on-light" v-text="sharedRequest.status == 'Posted' ? 'Open Needs' : 'Self Schedule'">
                    </span>
                </button>
                <button v-if="sharedRequest.request"
                        id="tabBtn-Request"
                        v-on="{ click: () => (activeTab = 1) }"
                        v-bind:class="
        ` ${
            activeTab == 1 ? 'neu-tablist__tab-on-light--is-active' : ''
        }`
        "
                        class="neu-tablist__tab neu-tablist__tab-on-light padding-left1 padding-right1 pb3 pt3"
                        role="tab"
                        aria-selected="true"
                        aria-controls="panel-name1">
                    <span class="neu-tablist__tab-text neu-tablist__tab-text-on-light">{{ !sharedRequest.availability ? "Request Detail" : "Request"}}</span>
                </button>
                <!--<button v-if="sharedRequest.needApproval"
                                v-on="{ click: () => (activeTab = 2) }"
                                v-bind:class="
                ` ${
                activeTab == 2 ? 'neu-tablist__tab-on-light--is-active' : ''
                }`
            "
                                class="neu-tablist__tab neu-tablist__tab-on-light padding-left1 padding-right1 pb3 pt3"
                                role="tab"
                                aria-selected="false"
                                aria-controls="panel-name2">
                            <span class="neu-tablist__tab-text neu-tablist__tab-text-on-light">Need Approval</span>
                        </button>-->
                <button v-if="sharedRequest.availability"
                        id="tabBtn-Unvailability"
                        v-on="{ click: () => (activeTab = 2) }"
                        v-bind:class="
        ` ${
            activeTab == 2 ? 'neu-tablist__tab-on-light--is-active' : ''
        }`
        "
                        class="neu-tablist__tab neu-tablist__tab-on-light padding-left1 padding-right1 pb3 pt3"
                        role="tab"
                        aria-selected="false"
                        aria-controls="panel-name2">
                    <span class="neu-tablist__tab-text neu-tablist__tab-text-on-light">Unavailability</span>
                </button>
                <button v-if="sharedRequest.vacationBidding"
                        id="tabBtn-VacationBidding"
                        v-on="{ click: () => (activeTab = 3) }"
                        v-bind:class="
        ` ${
            activeTab == 3 ? 'neu-tablist__tab-on-light--is-active' : ''
        }`
        "
                        class="neu-tablist__tab neu-tablist__tab-on-light padding-left1 padding-right1 pb3 pt3"
                        role="tab"
                        aria-selected="false"
                        aria-controls="panel-name2">
                    <span class="neu-tablist__tab-text neu-tablist__tab-text-on-light">Vacation Bidding</span>
                </button>
                <button v-if="sharedRequest.additionalRequest"
                        id="tabBtn-AdditionalRequest"
                        v-on="{ click: () => (activeTab = 4) }"
                        v-bind:class="
        ` ${
            activeTab == 4 ? 'neu-tablist__tab-on-light--is-active' : ''
        }`
        "
                        class="neu-tablist__tab neu-tablist__tab-on-light padding-left1 padding-right1 pb3 pt3"
                        role="tab"
                        aria-selected="false"
                        aria-controls="panel-name2">
                    <span class="neu-tablist__tab-text neu-tablist__tab-text-on-light">Request</span>
                </button>
            </template>
            <template v-if="sharedRequest.type === 2">
                <button v-if="sharedRequest.isSymphonyUser && sharedRequest.status == 'Posted'"
                        id="tabBtn-ORProcedure"
                        v-on="{ click: () => (activeTab = 0) }"
                        v-bind:class="
        ` ${
            activeTab == 0 ? 'neu-tablist__tab-on-light--is-active' : ''
        }`
        "
                        class="neu-tablist__tab neu-tablist__tab-on-light padding-left1 padding-right1 pb3 pt3"
                        role="tab"
                        aria-selected="false"
                        aria-controls="panel-name2">
                    <span class="neu-tablist__tab-text neu-tablist__tab-text-on-light">Procedures</span>
                </button>
                <button v-if="sharedRequest.event"
                        id="tabBtn-Event"
                        v-on="{ click: () => (activeTab = 1) }"
                        v-bind:class="
        ` ${
            activeTab == 1 ? 'neu-tablist__tab-on-light--is-active' : ''
        }`
        "
                        class="neu-tablist__tab neu-tablist__tab-on-light padding-left1 padding-right1 pb3 pt3"
                        role="tab"
                        aria-selected="false"
                        aria-controls="panel-name2">
                    <span class="neu-tablist__tab-text neu-tablist__tab-text-on-light">Event</span>
                </button>
                <button v-if="sharedRequest.assignmentDetail"
                        id="tabBtn-Detail"
                        v-on="{ click: () => (activeTab = 2) }"
                        v-bind:class="
        ` ${
            activeTab == 2 ? 'neu-tablist__tab-on-light--is-active' : ''
        }`
        "
                        class="neu-tablist__tab neu-tablist__tab-on-light padding-left1 padding-right1 pb3 pt3"
                        role="tab"
                        aria-selected="false"
                        aria-controls="panel-name2">
                    <span class="neu-tablist__tab-text neu-tablist__tab-text-on-light">Detail</span>
                </button>
            </template>
            <template v-if="sharedRequest.type === 3">
                <!-- third box -->
            </template>
            <template v-if="sharedRequest.type === 4">
                <!-- trade box -->
                <button v-if="sharedRequest.isSymphonyUser"
                        id="tabBtn-ORProcedure"
                        v-on="{ click: () => (activeTab = 0) }"
                        v-bind:class="
        ` ${
            activeTab == 0 ? 'neu-tablist__tab-on-light--is-active' : ''
        }`
        "
                        class="neu-tablist__tab neu-tablist__tab-on-light padding-left1 padding-right1 pb3 pt3"
                        role="tab"
                        aria-selected="false"
                        aria-controls="panel-name2">
                    <span class="neu-tablist__tab-text neu-tablist__tab-text-on-light">Procedures</span>
                </button>
                <button v-if="sharedRequest.tradeShift"
                        id="tabBtn-TradeShift"
                        v-on="{ click: () => (activeTab = 1) }"
                        v-bind:class="
        ` ${
            activeTab == 1 ? 'neu-tablist__tab-on-light--is-active' : ''
        }`
        "
                        class="neu-tablist__tab neu-tablist__tab-on-light padding-left1 padding-right1 pb3 pt3"
                        role="tab"
                        aria-selected="false"
                        aria-controls="panel-name2">
                    <span class="neu-tablist__tab-text neu-tablist__tab-text-on-light">Trade Event</span>
                </button>               
                 <button v-if="sharedRequest.assignmentDetail"
                        id="tabBtn-Detail"
                        v-on="{ click: () => (activeTab = 2) }"
                        v-bind:class="
        ` ${
            activeTab == 2 ? 'neu-tablist__tab-on-light--is-active' : ''
        }`
        "
                        class="neu-tablist__tab neu-tablist__tab-on-light padding-left1 padding-right1 pb3 pt3"
                        role="tab"
                        aria-selected="false"
                        aria-controls="panel-name2">
                    <span class="neu-tablist__tab-text neu-tablist__tab-text-on-light">Details</span>
                </button>
                 <button v-if="sharedRequest.request"
                        id="tabBtn-Request"
                        v-on="{ click: () => (activeTab = 3) }"
                        v-bind:class="
        ` ${
            activeTab == 3 ? 'neu-tablist__tab-on-light--is-active' : ''
        }`
        "
                        class="neu-tablist__tab neu-tablist__tab-on-light padding-left1 padding-right1 pb3 pt3"
                        role="tab"
                        aria-selected="false"
                        aria-controls="panel-name2">
                    <span class="neu-tablist__tab-text neu-tablist__tab-text-on-light">Request</span>
                </button>
            </template>
        </div>
        <template v-if="sharedRequest.type === 1">
            <div class="pb3 row" v-if="activeTab == 0 && this.currentEvent.status !='0 Needs'" id="tab">
                <div v-if="sharedRequest.status == 'Posted'">
                    <OpenNeed :currentEvent="currentEvent" :scheduleStartDate="scheduleStartDate"
                     :scheduleEndDate="scheduleEndDate" @closeSharedModal="close" @showSuccessMsgPopUp="showSuccessModal" />
                </div>                
                <div v-else>
                    <SelfSchedule :currentEvent="currentEvent" :dayChanged="currentEvent.date" :scheduleStatus="sharedRequest.status" :isSelfScheduledEvent="sharedRequest.isSelfScheduledEvent" :departmentsCanSelfSchedule="sharedRequest.SelfScheduleDepartments" @closeSharedModal="close" @showSuccessMsgPopUp="showSuccessModal" :calSelectedDates="sharedRequest.calSelectedDates" :scheduleId="sharedRequest.scheduleId"/>
                </div>


                <!-- enabledd -->
                <!-- <Detail :enableField="['shift']" :currentEvent="currentEvent" />
                <ShiftDetail :currentEvent="currentEvent" />
                <div class="container-fluid">
            <div>
                <div class="col-12">
                <button name="btnWithdrawal"
                    class="d-block mb4 mt4 neu-background--denim neu-button w-100 white"
                >
                    Withdraw
                </button>
                </div>
            </div>
                </div> -->
            </div>
            <div class="pb3 row" id="tab" v-if="activeTab == 1">
                <Request :currentEvent="currentEvent" :additionalRequestEvent="false" :dayChanged="currentEvent.date" :calSelectedDates="sharedRequest.calSelectedDates" @closeSharedModal="close" @showSuccessMsgPopUp="showSuccessModal" :key="counter" />
            </div>
            <!--<div class="pb3 row" v-if="activeTab == 2">
            <Approval @closeSharedModal="close" />
        </div>-->
            <div class="pb3 row" v-if="activeTab == 2">
                <Unavailability :isUnavailabilityEvent="sharedRequest.isUnavailabilityEvent" :calSelectedDates="sharedRequest.calSelectedDates" :currentEvent="currentEvent" @closeSharedModal="close" @showSuccessMsgPopUp="showSuccessModal" :key="counter" />
            </div>
            <div class="container-fluid" id="tab" v-if="activeTab == 3">
                <div class="pb3 row">
                    <div class="col-12 pt3">
                        test tab6
                    </div>
                </div>
            </div>
            <div class="pb3 row" id="tab" v-if="activeTab == 4">
                <Request :currentEvent="currentEvent" :additionalRequestEvent="true" :dayChanged="currentEvent.date" :calSelectedDates="sharedRequest.calSelectedDates" @closeSharedModal="close" @showSuccessMsgPopUp="showSuccessModal" :key="counter" />
            </div>
            <div class="pb3 row" id="tab" v-if="activeTab == 5">
                <div class="bg-black-05" style="width: 100%; min-height: 200px; display: flex; align-items: center; justify-content: center;margin-top:50px;margin-bottom:50px;">
                    <h4>No events to display.</h4>
                </div>
            </div>
        </template>
        <template v-if="sharedRequest.type === 2">
            <div class="pb3 row" v-if="activeTab == 0 && sharedRequest.isSymphonyUser == true && sharedRequest.status == 'Posted'">
                <SymphonyOperatingRooms :key="counter" :currentEvent="currentEvent" @closeSharedModal="close" />
            </div>
            <div class="pb3 row" v-if="activeTab == 1">
                <Detail :enableField="[]" :currentEvent="currentEvent" :key="counter" />
                <PotentialTrade :key="counter + 1" />
                <ShiftDetail :currentEvent="currentEvent" :key="counter + 2" />
                <div class="container-fluid">
                    <div>
                        <div class="col-12">
                            <button name="btnSwapShift" class="d-block mb4 mt4 neu-background--denim neu-button w-100 white">
                                Swap Shift
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="pb3 row" v-if="activeTab == 2">
                <!-- <AssignmentDetail :currentEvent="currentEvent" /> -->
                <Detail :enableField="[]" :currentEvent="currentEvent" :key="counter" />
                <ShiftDetail :currentEvent="currentEvent" :key="counter + 1" />
                <div class="container-fluid tc">
                    <div>
                        <div class="col-12">
                            <h6>Cannot be Modified</h6>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template v-if="sharedRequest.type === 3">
            <RequestedTrade :key="counter" :currentEvent="currentEvent" @closeSharedModal="close" @showSuccessMsgPopUp="showSuccessModal" />
        </template>
        <template v-if="sharedRequest.type === 4">
            <div class="pb3 row" v-if="activeTab == 0 && sharedRequest.isSymphonyUser == true">
                <SymphonyOperatingRooms :key="counter" :currentEvent="currentEvent" @closeSharedModal="close" />
            </div>
            <div class="pb3 row" v-if="activeTab == 1">
                <TradeShift :key="counter" :currentEvent="currentEvent" @showSuccessMsgPopUp="showSuccessModal" @closeSharedModal="close" />
            </div>
             <div class="pb3 row" id="tab" v-if="activeTab == 2">
                <Detail :enableField="[]" :currentEvent="currentEvent" :key="counter" />
                <ShiftDetail :currentEvent="currentEvent" :key="counter + 1" />
                <div class="container-fluid tc">
                    <div>
                        <div class="col-12">
                            <h6>Cannot be Modified</h6>
                        </div>
                    </div>
                </div>
            </div>
            <div class="pb3 row" id="tab" v-if="activeTab == 3">
                <Request :key="counter" :currentEvent="currentEvent" :additionalRequestEvent="false" :calSelectedDates="sharedRequest.calSelectedDates" @closeSharedModal="close" @showSuccessMsgPopUp="showSuccessModal" />
            </div>           
        </template>
    </div>
</template>

<script lang="ts">
    //import plugins and modules
    import { Options, Vue } from 'vue-class-component';
    import { mapState } from "vuex";
    // import AssignmentDetail from "./AssignmentDetail.vue";
    // import ShiftDetail from "./ShiftDetail.vue";
    // import Detail from "./Detail.vue";
    /*import Approval from "./Approval.vue";*/
    // import PotentialTrade from "./PotentialTrades.vue";
    // import SelfSchedule from './SelfSchedule.vue';
    // import Request from './Request.vue';
    // import RequestedTrade from "./RequestedTrade.vue";
    // import Unavailability from './Unavailability.vue';
    // import OpenNeed from './OpenNeed.vue';
    // import TradeShift from './TradeShift.vue';
    
    import moment from "moment";
    //import SymphonyOperatingRooms from './SymphonyOperatingRooms.vue'

    class Props {
         readonly isPanelOpen!: boolean;
         sharedRequest!: any;
         currentEvent!: any;
         additionalRequestEvent!: any;
         selectedDate!: any;
         counter!: any;
         scheduleStartDate!: Date;
         scheduleEndDate!: Date;
    }
    @Options({
    //     props: {
    //     sharedRequest: {
    //     type: Object
    //     }
    // },
        components: {
            // AssignmentDetail,
            /*Approval,*/
            // PotentialTrade,
            // Detail,
            // ShiftDetail,
            // SelfSchedule,
            Request,
            // RequestedTrade,
            // Unavailability,
            // OpenNeed,
            // TradeShift,
            // SymphonyOperatingRooms
        },
         computed: {
                ...mapState('schedule', ['assignmentDetail']),
            },
    })
    export default class SharedModal extends Vue.with(Props) {
        
        public assignmentDetail!: any;
        requestTypeArray = ["New Request", "Scheduled Event", "Scheduled Event",  "Scheduled Event"];
        // todo manage this array

        activeTab: number = 10;
        isLoaded: boolean = false;
        singleTab: boolean = false;
        isProductive: boolean = false;

        created() {
            //super(props);
            const sharedRequest = JSON.parse(JSON.stringify(this.sharedRequest));
            delete sharedRequest.type;
            delete sharedRequest.calSelectedDates;
            //const updatedArray = Object.entries(sharedRequest);
            //this.activeTab = Number(
            //    Object.keys(updatedArray).find((key) => {
            //        return updatedArray[key][1];
            //    })
            //);  
            this.activeTab = this.getActiveTab(this.sharedRequest);
            //this.setActiveTab(this.sharedRequest);
        }  

        //@Watch('isPanelOpen', {immediate: true}) 
        onMatchChanged() {
            if(this.isPanelOpen) {
                document.getElementsByClassName('neu-padding--bottom-100')[0].classList.add('postion-relative', 'overflow-hidden');
            } else {
                document.getElementsByClassName('neu-padding--bottom-100')[0].classList.remove('postion-relative', 'overflow-hidden');
            }
        }
        showSuccessModal(flag: boolean = true, msgValue: string = '') {
            this.$emit("showSuccessModal", flag, msgValue);
        }


        close() {
            this.$emit("close-modal");
        }
        formatDate(date: Date): string {
            return moment(date).format("MMMM DD, yyyy");
        }
        previousDay() {
            let clickEventNextDate: Date;
            if (this.sharedRequest && this.sharedRequest.calSelectedDates && this.sharedRequest.calSelectedDates.startDate) {
                clickEventNextDate = new Date(this.sharedRequest.calSelectedDates.startDate);
            }
            else {
                clickEventNextDate = new Date(this.currentEvent.date);
            }
            clickEventNextDate.setDate(clickEventNextDate.getDate() - 1);
            this.$emit("raiseClickEvent", clickEventNextDate);
        }
        nextDay() {
            let clickEventNextDate: Date;
            if (this.sharedRequest && this.sharedRequest.calSelectedDates && this.sharedRequest.calSelectedDates.startDate) {
                clickEventNextDate = new Date(this.sharedRequest.calSelectedDates.startDate);
            }
            else {
                clickEventNextDate = new Date(this.currentEvent.date);
            }
            clickEventNextDate.setDate(clickEventNextDate.getDate() + 1);
            this.$emit("raiseClickEvent", clickEventNextDate);            
        }
        showDateNavigation() {
            var startDate: any;
            var endDate: any;
            var ret = true;
            if (this.sharedRequest && this.sharedRequest.calSelectedDates && !this.sharedRequest.availability) {
                startDate = moment(this.sharedRequest.calSelectedDates.startDate).format("MMMM DD, yyyy");
                endDate = moment(this.sharedRequest.calSelectedDates.endDate).add(-1, 'days').format("MMMM DD, yyyy");                
                if (startDate === endDate)
                    ret = true;
                else
                    ret = false;
            }
            return ret;
        }
        getActiveTab(sharedRequest:any) {
            var activeTab = 10;
            if (sharedRequest.type === 1) {                
                if (sharedRequest.selfSchedule && this.currentEvent.status !='0 Needs') {
                    activeTab = 0;
                }
                else if (sharedRequest.request) {
                    activeTab = 1;
                }
                else if (sharedRequest.availability) {
                    activeTab = 2;
                }
                else if (sharedRequest.vacationBidding) {
                    activeTab = 3;
                }
                else if (sharedRequest.additionalRequest) {
                    activeTab = 4;
                }
                else {
                    activeTab = 5;
                }
            }
            else if (sharedRequest.type === 2) {
                if (sharedRequest.isSymphonyUser) {
                    activeTab = 0;
                } 
                else if (sharedRequest.event) {
                    activeTab = 1;
                }
                else if (sharedRequest.assignmentDetail) {
                    activeTab = 2;
                }
            }
            else if (sharedRequest.type === 4) {
                if (sharedRequest.isSymphonyUser) {
                    activeTab = 0;
                }
                else if (sharedRequest.tradeShift) {
                    activeTab = 1;
                }
                else if (sharedRequest.assignmentDetail) {
                    activeTab = 2;
                } else if(sharedRequest.request){
                    activeTab = 3;
                }
            }
            return activeTab;
        }
    }
</script>
<style src="@/css/shared-modal.css" />
<style scoped>
.padding-right1{
    padding-right: 0.4rem;
}
.padding-left1{
    padding-left: 0.4rem;
}
.neu-tablist{
    height:auto !important;
}

.calender-nav{
    padding-left: 10px;
    padding-right: 10px;
}

/* Media Query for Mobile Devices */
@media (max-width: 480px) {
    .sideNavPanel{
        position: absolute;
        right: 0;
        top: 70px;
        background-color: #f4f4f4;
        bottom: 92px;
        z-index: 99;
        border-left-style: solid;
        border-left-width: 1px;
        width:100%;
        transition: left 1s ease-in-out;
        overflow-x: hidden;
        overflow-y: auto;
    }

    .sideNavPanelClose{
        display:none; 
        left: 502px;
        transition: left 1s ease-in-out;
    }

    .btnSidePanelClose{
        display: inline-block !important;
        width: 40px !important;
    }

    .panHeading{
        margin-right: 50px !important;
    }
    @keyframes fade_in_show {
        0% {
            opacity: 0;
            transform: scale(0)
        }

        100% {
            opacity: 1;
            transform: scale(1)
        }
    }
}
          
/* Media Query for low resolution  Tablets, Ipads */
@media (min-width: 481px) and (max-width: 767px) {
     .sideNavPanel{
        position: absolute;
        right: 0;
        top: 70px;
        background-color: #f4f4f4;
        bottom: 92px;
        z-index: 99;
        border-left-style: solid;
        border-left-width: 1px;
        width:100%;
        transition: left 1s ease-in-out;
        overflow-x: hidden;
        overflow-y: auto;
    }

    .sideNavPanelClose{
        display:none; 
        left: 502px;
        transition: left 1s ease-in-out;
    }

    @keyframes fade_in_show {
        0% {
            opacity: 0;
            transform: scale(0)
        }

        100% {
            opacity: 1;
            transform: scale(1)
        }
    }       
}

@media (min-width: 768px) and (max-width: 899px) {
     .sideNavPanel{
        position: absolute;
        right: 0;
        top: 70px;
        background-color: #f4f4f4;
        bottom: 92px;
        z-index: 99;
        border-left-style: solid;
        border-left-width: 1px;
        width:100%;
        transition: left 1s ease-in-out;
        overflow-x: hidden;
        overflow-y: auto;
    }

    .sideNavPanelClose{
        display:none; 
        left: 502px;
        transition: left 1s ease-in-out;
    }

    @keyframes fade_in_show {
        0% {
            opacity: 0;
            transform: scale(0)
        }

        100% {
            opacity: 1;
            transform: scale(1)
        }
    }       
}
          
/* Media Query for Tablets Ipads portrait mode */
@media (min-width: 900px) and (max-width: 1024px){
     .sideNavPanel{
        position: absolute;
        right: 0;
        top: 70px;
        width: 30%;
        display: block;
        background-color: #f4f4f4;
        bottom: 92px;
        overflow-x: hidden;
        overflow-y: auto;
    }

    .sideNavPanelClose{
        display:none;
    }

    @keyframes fade_in_show {
        0% {
            opacity: 0;
            transform: scale(0)
        }

        100% {
            opacity: 1;
            transform: scale(1)
        }
    }        
}
          
/* Media Query for Laptops and Desktops */
@media (min-width: 1025px) {
    .sideNavPanel{
        position: absolute;
        right: 0;
        top: 60px;
        width: 25%;
        display: block;
        background-color: #f4f4f4;
        bottom: 92px;
        overflow-x: hidden;
        overflow-y: auto;
    }

    .sideNavPanelClose{
        display:none;
    }

    @keyframes fade_in_show {
        0% {
            opacity: 0;
            transform: scale(0)
        }

        100% {
            opacity: 1;
            transform: scale(1)
        }
    }            
}
</style>