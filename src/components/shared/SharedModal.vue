<template>
   <div class="modal" v-bind:class="isPanelOpen ? 'sideNavPanel' : 'sideNavPanelClose'">
        <div  style="text-align:center">
        <neu-header class="fs-22 fw-bold modal-header relative" id="modalTitle">           
            <f5><span>{{ requestTypeArray[sharedRequest.type - 1]}} </span></f5>            
            <neu-icon  @click="close" data-test="modal-close" class="btn-close f1 absolute pointer btnSidePanelClose m-3 neu-icon neu-icon--large hydrated">close</neu-icon>
        </neu-header>       
           <template v-if="showDateNavigation()">
            <div >
                <div>
                    <h5>
                    <neu-icon @click="previousDay"
                           class="material-icons pointer calendar-navigation"
                           style="position: relative; top: 4px">
                            chevron_left
                        </neu-icon>
                        <span>
                            {{ sharedRequest && sharedRequest.calSelectedDates && sharedRequest.calSelectedDates.startDate ? formatDate(sharedRequest.calSelectedDates.startDate) : formatDate(currentEvent.date)  }}
                        </span>
                        <neu-icon @click="nextDay"
                           class="material-icons pointer calendar-navigation"
                           style="position: relative; top: 4px">
                            chevron_right
                        </neu-icon>
                    </h5>
                </div>
            </div>
        </template> 
         </div>
        <template v-if="sharedRequest.type === 1">
        <neu-tablist color="primary-100"  value="openneed">
            <neu-tab v-if="currentEvent.status !='0 Needs'" tab="openneed" navy="true">Open Need</neu-tab>
            <neu-tab tab="request" v-if="sharedRequest.request" navy="true">Request</neu-tab>
            <neu-tab tab="unavailablity" v-if="sharedRequest.availability" navy="true">Unavailability</neu-tab>
        </neu-tablist>
        </template>
        <template v-if="sharedRequest.type === 2  && !(sharedRequest.availability)">
        <neu-tablist color="primary-100"  value="assignment">
            <neu-tab v-if="sharedRequest.event" tab="assignment" navy="true">Event</neu-tab>
            <neu-tab v-if="sharedRequest.assignmentDetail" tab="assignment" navy="true">Details</neu-tab>
            <neu-tab tab="request" v-if="sharedRequest.request" navy="true">Request</neu-tab>
            <neu-tab tab="unavailablity" v-if="sharedRequest.availability" navy="true">Unavailability</neu-tab>
        </neu-tablist>
        </template>
        <template v-if="sharedRequest.type === 4">
        <neu-tablist color="primary-100"  value="assignment">
            <neu-tab  v-if="sharedRequest.isSymphonyUser" tab="assignment" navy="true">Procedures</neu-tab>
            <neu-tab  v-if="sharedRequest.tradeShift" tab="assignment" navy="true">Trade Event</neu-tab>
            <neu-tab v-if="sharedRequest.assignmentDetail" tab="assignment" navy="true">Details</neu-tab>
            <neu-tab tab="request" v-if="sharedRequest.request" navy="true">Request</neu-tab>
            <neu-tab tab="unavailablity" v-if="sharedRequest.availability" navy="true">Unavailability</neu-tab>
        </neu-tablist>
        </template>
        <template v-if="sharedRequest.type === 2 && sharedRequest.availability">
            
            <neu-tablist v-model="tabCurrent">
                <span  v-for="(tab,tabId) in tabList" :key="tabId" >
                    <span v-if="tab.show" class="neu-tab">
                        <neu-tab
                        @click="tabSelected(tab.id)"
                        @keyup.space="tabSelected(tab.id)"
                        @keyup.enter="tabSelected(tab.id)"
                        :class="tab.focused?'neu-focused':''"
                        >
                        {{tab.title}}
                        </neu-tab>
                    </span>
                </span>
            </neu-tablist>
                <div v-if="tabCurrent === 'Details'">
                    <detail :enableField="[]" :currentEvent="currentEvent" :key="counter" />
                    <shift-member-detail :currentEvent="currentEvent" :key="counter + 1" />
                    <div class="container-fluid tc">
                        <div>
                            <div class="col-12">
                                <h6>Cannot be Modified</h6>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="tabCurrent === 'Trade'">
                <h3>Menu 1</h3>
                <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                </div>

                <div v-if="tabCurrent === 'Request'">
                <h3>Menu 2</h3>
                <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.</p>
                </div>

                <div v-if="tabCurrent === 'DayPreference'">
                    <day-preference-view />
                </div>
                <div v-if="tabCurrent === 'Procedures'">
                <h3>Menu 3</h3>
                <p>Eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
                </div>

        </template>
           
        <template v-if="sharedRequest.type === 2 && !(sharedRequest.availability)">
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
                <detail :enableField="[]" :currentEvent="currentEvent" :key="counter" />
                <shift-member-detail :currentEvent="currentEvent" :key="counter + 1" />
                <div class="container-fluid tc">
                    <div>
                        <div class="col-12">
                            <h6>Cannot be Modified</h6>
                        </div>
                    </div>
                </div>
            </div>
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
    import AssignmentDetail from "./AssignmentDetail.vue";
    import ShiftMemberDetail from "./ShiftMemberDetail.vue";
    import Detail from "./Detail.vue";
    /*import Approval from "./Approval.vue";*/
    // import PotentialTrade from "./PotentialTrades.vue";
    // import Request from './Request.vue';
    // import RequestedTrade from "./RequestedTrade.vue";
    // import Unavailability from './Unavailability.vue';
    // import OpenNeed from './OpenNeed.vue';
    // import TradeShift from './TradeShift.vue';
    import DayPreferenceView from './DayPreference.vue'
    import TradeShift from './TradeShift.vue';
    
    import moment from "moment";
    import {NeuApp, NeuTablist, NeuTab} from '@neutron/vue';
    //import SymphonyOperatingRooms from './SymphonyOperatingRooms.vue'
     import {
                NeuHeader,
                NeuRow,
                NeuCol
            } from "@neutron/vue";

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
             AssignmentDetail,
            /*Approval,*/
            // PotentialTrade,
             Detail,
             ShiftMemberDetail,
            // // SelfSchedule,
            // Request,
            // RequestedTrade,
            // Unavailability,
            // OpenNeed,
            TradeShift,
            // SymphonyOperatingRooms,
            DayPreferenceView,
            NeuHeader,
            NeuRow,
            NeuCol, NeuTablist, NeuTab
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
        
        tabCurrent:string=  'Details';
        tabList:any[]= [
        {id: 'Details', title: 'Details',show:false,focused:false},
        {id: 'DayPreference', title: 'Day Preference',show:false,focused:false},
        {id: 'Procedures', title: 'Procedures',show:false,focused:false},
        {id: 'Trade', title: 'Trade',show:false,focused:false},
        {id: 'Request', title: 'Request',show:false,focused:false},
        ]
           

        created() {
            //super(props);
            
            const sharedRequest = JSON.parse(JSON.stringify(this.sharedRequest));
            const currentEvent = JSON.parse(JSON.stringify(this.currentEvent));
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
            
            let tabfocused= 0;
            this.tabList.map((item)=>{
                if(sharedRequest.isSymphonyUser && item.id ==="Procedures") {
                    item.show= true;
                    item.focused =tabfocused==0 ?true:false;
                    this.tabCurrent = item.focused?item.id:'Details';
                    tabfocused++;
                }
                if(sharedRequest.tradeShift && item.id ==="Trade") {
                    item.show= true;
                    item.focused =tabfocused==0 ?true:false;
                    this.tabCurrent = item.focused?item.id:'Details';
                    tabfocused++;
                }
                if(sharedRequest.assignmentDetail && item.id ==="Details") {
                    item.show= true;
                    item.focused =tabfocused==0 ?true:false;
                    this.tabCurrent = item.focused?item.id:'Details';
                    tabfocused++;
                }
                if(sharedRequest.request && item.id ==="Request") {
                    item.show= true;
                    item.focused =tabfocused==0 ?true:false;
                    this.tabCurrent = item.focused?item.id:'Details';
                    tabfocused++;
                    
                }
                if(sharedRequest.availability && item.id ==="DayPreference") {
                    item.show= true;
                    item.focused =tabfocused== 0 ?true:false;
                    this.tabCurrent = item.focused?item.id:'Details';
                    tabfocused++;
                }
            })
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
                }else if(sharedRequest.availablity) {
                    activeTab = 11;
                    console.log("hello");
                    console.log(activeTab,this.sharedRequest)
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
            // return 9;
           // this.setTabProperty(sharedRequest);
            return activeTab;
        }
        tabSelected(tabId:any){
            this.tabCurrent = tabId;
            this.tabList.map(item=>{
                item.focused= (item.id===tabId)?true:false
            });
        }
    }
</script>
<style src="@/scss/shared-modal.css" />
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
        top: 0px;
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
        top: 0px;
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
        top: 0;
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
        top: 0;
        width: 30%;
        display: block;
        background-color: #f4f4f4;
        bottom: 0;
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
        top: 0px;
        width: 25%;
        display: flex;
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