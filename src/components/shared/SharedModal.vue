<template>
   <div class="no-print modal" v-bind:class="isPanelOpen ? 'sideNavPanel' : 'sideNavPanelClose'">
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
                            {{ this.sharedRequest && this.sharedRequest.calSelectedDates && this.sharedRequest.calSelectedDates.startDate ? formatDate(this.sharedRequest.calSelectedDates.startDate) : formatDate(currentEvent.date)  }}
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
            <neu-tablist color="primary-100"  value="assignment">
        <neu-tab tab="assignment" navy="true">Details</neu-tab>
        <neu-tab tab="request" navy="true">Request</neu-tab>
        <neu-tab tab="unavailablity" navy="true">Unavailability</neu-tab>
      </neu-tablist>
       
      
    </div>
</template>

<script lang="ts">
    //import plugins and modules
    import { Options, Vue } from 'vue-class-component';
    import { mapState } from "vuex";
    import AssignmentDetail from "./AssignmentDetail.vue";
    import ShiftDetail from "./ShiftDetail.vue";
    import Detail from "./Detail.vue";
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
             ShiftDetail,
            // // SelfSchedule,
            // Request,
            // RequestedTrade,
            // Unavailability,
            // OpenNeed,
            // TradeShift,
            // SymphonyOperatingRooms,
            NeuHeader,
            NeuRow,
            NeuCol,
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