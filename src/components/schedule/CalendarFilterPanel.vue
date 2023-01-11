<template >

  <div v-if="toggleStatus" class="overflow-hidden absolute bottom-0 fr filterwidth right-0 z-999 no-print" :style="customTop">
    <div class="bg-near-white h-100 ml-auto relative rightnav-drawer-filter"  :style="this.toggleStatus ? 'left: 0' : 'left:502px'">
      <div class="bg-near-white z-999">
        <div class="align-items-xl-center bg-white container-fluid flex  w-100 h-20">
          <span @click="closeNav()" class="material-icons pointer tr-ns">close</span>
          <h6 class="tc w-100">Filters</h6>
        </div>
        <div class="container L5">
          <div class="row neu-margin--top-10">
            <div class="col-sm-12 neu-margin--top-10">
              <h7 class="tc w-100" style=" text-align:left;font-weight:bold">VIEW ON CALENDAR</h7>
              <div class="neu-checkbox neu-margin--top-10">
                <input id="chk_All" type="checkbox" class="neu-checkbox__input neu-margin--top-10" v-model="checkALLOption" @change="onCheckAllOption($event)">
                  <label class="neu-checkbox__label neu-text--caption" for="chk_All">ALL</label>
                </div>
              <div class="neu-checkbox neu-margin--top-10">
                <input id="chk_SchedEvents" type="checkbox" class="neu-checkbox__input" v-model="checkSchedEventsOption"  @change="onCheckSchedEvents($event)" >
                  <label class="neu-checkbox__label neu-text--caption" for="chk_SchedEvents">My Scheduled Events</label>
                </div>
              <div class="neu-checkbox neu-margin--top-10">
                <input id="chk_PendRequests" type="checkbox" class="neu-checkbox__input" v-model="checkPendRequestsOption"  @change="onCheckPendRequestsOption($event)" >
                  <label class="neu-checkbox__label neu-text--caption" for="chk_PendRequests">Pending Requests</label>
                </div>
              <div class="neu-checkbox neu-margin--top-10">
                <input id="chk_DepartNeeds" type="checkbox" class="neu-checkbox__input" v-model="checkDepartNeedsOption"  @change="onCheckDepartNeedsOption($event)" >
                  <label class="neu-checkbox__label neu-text--caption" for="chk_DepartNeeds">Departmental Needs</label>
                </div>              
              <div class="neu-checkbox neu-margin--top-10">
                <input id="chk_TradeShifts" type="checkbox" class="neu-checkbox__input" v-model="checkTradeShiftsOption"  @change="onCheckTradeShiftsOption($event)" >
                  <label class="neu-checkbox__label neu-text--caption" for="chk_TradeShifts">Shift Trades</label>
                </div>
              <div>
                <div class="neu-checkbox neu-margin--top-10">
                  <input id="chk_Unavailability" type="checkbox" class="neu-checkbox__input" v-model="checkUnavailabilityOption"  @change="onCheckUnavailabilityOption($event)" >
                    <label class="neu-checkbox__label neu-text--caption" for="chk_Unavailability">Unavailability</label>
                  </div>
                </div>
              </div>           
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
 import {
    NeuButton,
    NeuInput,
    NeuContainer,
    NeuRow,
    NeuCol,
    NeuCheckbox
} from "@neutron/vue";

@Options({  
  data:() => {
  return {

  }
  },
  props: {
        toggleStatus: {
        type: Boolean
        }
    },
    components:{
      NeuButton,
    NeuInput,
    NeuContainer,
    NeuRow,
    NeuCol,
    NeuCheckbox

    },
  watch: {
    onMatchChanged(toggleStatus) {
    if (this.toggleStatus) {
      this.headerHeight = "12.5px";
      this.firstClick = true;
    }}}
  
})
export default class CalendarFilterPanel extends Vue {
  checkALLOption: boolean = true;
  checkSchedEventsOption: boolean = true;
  checkPendRequestsOption: boolean = true;
  checkDepartNeedsOption: boolean = true;
  checkTradeShiftsOption: boolean = true;
  checkUnavailabilityOption: boolean = true;
  checkALLDefaultOption: boolean = false;

  headerHeight: string = "";
  
  public firstClick: boolean = false;
  get customTop() {
    if (this.firstClick) {
      return `top:${this.headerHeight}`;
    } else {
      return "";
    }
  }

  onCheckAll() {
    this.checkSchedEventsOption = this.checkALLOption;
    this.checkPendRequestsOption = this.checkALLOption;
    this.checkDepartNeedsOption = this.checkALLOption;
    this.checkTradeShiftsOption = this.checkALLOption;
  }

  onCheckSchedEvents() {
    try {
      this.validateEventTypes("scheduledEvents");
      //this.$emit("sched-event", this.checkSchedEventsOption);
    } catch (e) {
      console.log(e);
    }
  }

  onCheckPendRequestsOption() {
    try {
      this.validateEventTypes("pendingEvents");
     // this.$emit("check-pend-event", this.checkPendRequestsOption);
    } catch (e) {
      console.log(e);
    }
  }

  onCheckDepartNeedsOption() {
    try {
      this.validateEventTypes("openneedEvents");
      //this.$emit("check-depart-need-event", this.checkDepartNeedsOption);
    } catch (e) {
      console.log(e);
    }
  }

  onCheckTradeShiftsOption() {
    try {
      this.validateEventTypes("tradeEvents");
      //this.$emit("check-trade-shift-event", this.checkTradeShiftsOption);
    } catch (e) {
      console.log(e);
    }
  }

  onCheckUnavailabilityOption() {
    try {
      this.validateEventTypes("unavailEvents");
      //this.$emit("check-unavailability-event", this.checkUnavailabilityOption);
    } catch (e) {
      console.log(e);
    }
  }

  onCheckAllOption() {
    try {
      this.checkSchedEventsOption = this.checkALLOption;
      this.checkPendRequestsOption = this.checkALLOption;
      this.checkDepartNeedsOption = this.checkALLOption;
      this.checkTradeShiftsOption = this.checkALLOption;
      this.checkUnavailabilityOption = this.checkALLOption;
      //this.$emit("check-all", this.checkALLOption);
    } catch (e) {
      console.log(e);
    }
  }

  closeNav() {
    try {
      //this.$emit("close-event");
    } catch (e) {
      console.log(e);
    }
  }

  validateEventTypes(flag:any) {
            let schedEvents = this.checkSchedEventsOption;
            let pendEvents = this.checkPendRequestsOption;
            let openneedEvents = this.checkDepartNeedsOption;
            let tradeshiftEvents = this.checkTradeShiftsOption;
            let unavailEvents = this.checkUnavailabilityOption;

            if (flag == 'scheduledEvents') {
                if (unavailEvents == true && pendEvents == true && openneedEvents == true && tradeshiftEvents == true) {
                    this.checkALLOption = schedEvents;
                }
            }
            else if (flag == 'pendingEvents') {
                if (schedEvents == true && openneedEvents == true && tradeshiftEvents == true && unavailEvents == true) {
                    this.checkALLOption = pendEvents;
                }
            }
            else if (flag == 'openneedEvents') {
                if (schedEvents == true && tradeshiftEvents == true && pendEvents == true && unavailEvents == true) {
                    this.checkALLOption = openneedEvents;
                }
            }
            else if (flag == 'tradeEvents') {
                if (schedEvents == true && pendEvents == true && unavailEvents == true && openneedEvents == true) {
                    this.checkALLOption = tradeshiftEvents;
                }
            }
            else if (flag == 'unavailEvents') {
                if (schedEvents == true && pendEvents == true && tradeshiftEvents == true && openneedEvents == true) {
                    this.checkALLOption = unavailEvents;
                }
            }
        }

}
</script>
<style scoped="">
.rightnav-drawer-filter {
  transition: left 1s;
}

.filterwidth {
  width: 20%;
  height: 98.7%;
  border:gray 1px solid;
  margin-right: -3px;         
}

.L5 {
  margin-left: 5px; 
}

/* Media Query for Mobile Devices */
  @media (max-width: 480px) {
      .filterwidth {
          width: 70% !important;
      }
  }

/* Media Query for low resolution  Tablets, Ipads */
  @media (min-width: 481px) and (max-width: 930px) {
       .filterwidth {
          width: 45% !important;
      }
  }
</style>