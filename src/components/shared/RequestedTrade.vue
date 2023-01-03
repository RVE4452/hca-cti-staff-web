<template>
  <div class="col-12" v-if="data.loadedDetail || showErrorMsg">
    <loading   :active="isLoading"
                    :can-cancel="false"
                    :height="128"
                    :width="128"
                    :color="loaderColor"
                    :opacity="0.7"
                    :is-full-page="true"/>
    <div class="bg-black-05 container-fluid neu-margin--bottom-20 pb4 pt3">
            <div class="row">
                <div class="col-12 neu-margin--bottom-20" v-if="showErrorMsg">
                    <ErrorNotification :errorMsg="errorMsg" :errorType="errorType" />
                </div>
                <div class="col-12 f3">
                    <h5>
                        {{ formatDateShift(currentEvent.date) }}
                    </h5>
                </div>
                <div class="col-12 neu-margin--top-20 neu-input">
                    <label for="txtFacility" class="neu-input__label">Facility</label>
                    <input type="text"
                           name="Facility"
                           id="txtFacility"
                           :value="data.tradeDetail.facilityName"
                           readonly
                           class="readonly_text_field neu-input__text-field" />
                </div>
                <div class="col-12 neu-margin--top-20 neu-input">
                    <label for="txtDepartment" class="neu-input__label">Department</label>
                    <input type="text"
                           name="Department"
                           id="txtDepartment"
                           :value="getDept"
                           readonly
                           class="readonly_text_field neu-input__text-field" />
                </div>
                <div class="col-12 neu-margin--top-20 neu-input">
                    <label for="txtSkill" class="neu-input__label">Skill</label>
                    <input type="text"
                           name="Skill"
                           id="txtSkill"
                           :value="data.tradeDetail.skill"
                           readonly
                           class="readonly_text_field neu-input__text-field" />
                </div>
                <div class="col-12 neu-margin--top-20 neu-input">
                    <label for="txtShift" class="neu-input__label">Shift</label>
                    <input type="text"
                           name="shift"
                           id="txtShift"
                           :value="data.tradeDetail.shiftCode + ' ' + data.tradeDetail.shiftDescription"
                           readonly
                           class="readonly_text_field neu-input__text-field" />
                </div>
            </div>
        </div>
    <div class="container-fluid">
      <div class="d-flex flex-wrap-l neu-margin--bottom-20 pb4">        
        <div class="col-12">
          <div class="mb3">
            <label class="di f4">Trade Requests</label>
          </div>
          <hr />
          <div class="row">
            <div class="col-12 d-flex">
              <div class="col-auto pa0">
                <h6 class="bg-gray tc white mr2 initial-name">
                  {{data.tradeDetail.firstName[0]}} {{data.tradeDetail.lastName[0]}}
                </h6>
              </div>
              <div class="col-auto pa0">
                <div class="row">
                  <div class="col-12">
                    <span v-bind:title="data.tradeDetail.firstName + data.tradeDetail.lastName">{{
                        (
                          data.tradeDetail.firstName +
                          " " +
                          data.tradeDetail.lastName
                        )
                      }}</span>
                  </div>
                  <div class="col-12">
                    <span class="gray">{{ data.tradeDetail.skill}}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12">
              <div class="col-auto">
                <label class="f6 gray"
                  >
                   {{ formatDate(data.tradeDetail.actualStartTime) }} , {{ formatTime(data.tradeDetail.actualStartTime) }} - 
                   {{ formatDate(data.tradeDetail.actualEndTime) }} , {{ formatTime(data.tradeDetail.actualEndTime) }}
                </label>
              </div>
              <div class="col-auto d-flex mb2 mt2">
                <div class="left--1">
                  <i class="material-icons dark-red">
                    location_on
                  </i>
                </div>
                <div class="pl1">
                  {{data.tradeDetail.facilityName}}
                  <br />
                  <span class="gray f6">{{data.tradeDetail.departmentName}}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="row mt4">
            <div class="col-6">
              <button :disabled="disableAll"
                @click="fireAction('deny')"
                :class="[
                  'col-12 d-block neu-button w-100',
                  disableAll
                    ? 'neu-button--blue-disabled'
                    : 'neu-button--primary neu-button--raised',
                ]"
              >
                Decline
              </button>
            </div>
            <div class="col-6">
              <button :disabled="(disableAll || isImpersonating)"
                @click="fireAction('accept')"
                 :class="[
                    'col-12 d-block neu-button w-100',
                    disableAll || isImpersonating
                      ? 'neu-button--blue-disabled'
                      : 'neu-button--primary neu-button--raised'
                  ]"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
//import plugins and modules
import { Options, Vue } from 'vue-class-component';
import moment from "moment";
import { mapState } from "vuex";
import ErrorNotification from "./ErrorNotification.vue";
// import Detail from "./Detail.vue";
// import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
//import bus from '../../eventBus';
import { useAppInsights } from '../../store/modules/AppInsights';

class Props{
   currentEvent: any;
}
@Options({
    components: {
            //Detail,
            ErrorNotification,
            //Loading
        },
        computed: {
                ...mapState('schedule', ['shiftTradeOfferDetail','assignmentDetail']),
                ...mapState('profile', ['profileData','isImpersonating','appInsightEventData']),
                ...mapState('notification', ['notificationList']),
            },
    })
export default class RequestedTrade extends Vue.with(Props) {
  data:any= {
    tradeDetail: {} as any,
    loadedDetail: false
  }
  showErrorMsg: boolean = false;
    errorMsg: string = '';
    errorType: string = 'error';
 
  disableAll: boolean= false;
  shiftTradeOfferDetail!: any;
  public assignmentDetail!: any;
  isLoading:boolean = false;
  loaderColor: string = "#0085ca";
  public profileData!: any;
  isImpersonating!: boolean;
  public notificationList!: any;
  appInsightEventData!: any;
  
 declare $refs: {            
    Detail:any;
  };
  async mounted() {
    this.getShiftTradeOffer();
  }

  getShiftTradeOffer() {            
    var payload = { 
      username: this.profileData.username, 
      shiftTradeOfferId: this.currentEvent.id,
    };

    this.$store
      .dispatch("schedule/getShiftTradeRequested", payload)
      .then((res: any) => {
        this.data.tradeDetail = res;
        this.data.loadedDetail = true;
        if(res.status === 'Accepted') {
          this.disableAll = true;
        }
      })
      .catch((err: any) => {
        if (err) {
          console.log(err); // Handle errors any way you want
          let parseResponse = err.request.responseText != "" ? JSON.parse(err.request.responseText) : err.request.responseText;                             
          this.showErrorMsg = true;                            
          this.errorMsg = (parseResponse.result != null || parseResponse.result != undefined) ? JSON.parse(parseResponse.result).Message : "An error has occurred. Please try again. If the error persists, contact Facility Scheduler support.";
        }        
      });
  }

  fireAction(type: string): void {
      const requestBody = [{
          id: this.currentEvent.id,
          username: this.data.tradeDetail.username,
          firstName: this.data.tradeDetail.firstName,
          lastName: this.data.tradeDetail.lastName,
          tenantId: this.data.tradeDetail.tenantId,
          scheduleId: this.data.tradeDetail.scheduleId,
          facilityId: this.data.tradeDetail.facilityId,
          coid: this.data.tradeDetail.coid,
          facilityName: this.data.tradeDetail.facilityName,
          departmentId: this.data.tradeDetail.departmentId,
          // facilityCoId: this.assignmentDetail.facilityCoId,
          departmentName: this.data.tradeDetail.departmentName,
          departmentCode:  this.data.tradeDetail.departmentCode,
          departmentShiftId: this.data.tradeDetail.departmentShiftId, // todo not sure of value
          shiftCode: this.data.tradeDetail.shiftCode,
          shiftDescription: this.data.tradeDetail.shiftDescription,
          skill: this.data.tradeDetail.skill,
          date: this.data.tradeDetail.date,
          startTime: this.data.tradeDetail.startTime,
          endTime: this.data.tradeDetail.endTime,
          actualStartTime: this.data.tradeDetail.actualStartTime,
          actualEndTime: this.data.tradeDetail.actualEndTime,
          hours: this.data.tradeDetail.hours,
          minutes: this.data.tradeDetail.minutes,
          status: "",
          requestorAssignmentId: this.data.tradeDetail.requestorAssignmentId,
          acceptorAssignmentId: this.data.tradeDetail.acceptorAssignmentId,
          offeredToUsername: this.data.tradeDetail.offeredToUsername,
          offeredToFirstName: this.data.tradeDetail.offeredToFirstName,
          offeredToLastName: this.data.tradeDetail.offeredToLastName,
          isAutoapprovable: this.data.tradeDetail.isAutoapprovable,
          notificationId: null,
          productiveType: this.data.tradeDetail.productiveType
      }];
      requestBody[0].status = type === "deny" ? 'Rejected' : 'Accepted';

      //get Notification Id
      var notification = this.notificationList.filter((notify:any) => notify.shiftTradeOfferId == this.currentEvent.id);
      if(notification != undefined && notification.length > 0){
        requestBody[0].notificationId = notification[0].id;
      }

      this.isLoading = true;
      var appinsightTitle = 'ShiftTrades' + requestBody[0].status;
      this.$store
        .dispatch("schedule/acceptShiftTradeOffer", requestBody)
        .then(() => {
          this.isLoading = false;
          this.$emit('showSuccessMsgPopUp', true);
          this.$emit('closeSharedModal');
          //bus.$emit('shiftTradenotificationchanged');
          useAppInsights().trackEvent({name:appinsightTitle ,properties: 
               JSON.parse(JSON.stringify(this.appInsightEventData))
            });
        })
        .catch((err: any) => {
          this.isLoading = false;
          this.$emit('showSuccessMsgPopUp', false);
          let parseResponse = err.request.responseText;                            
          this.showErrorMsg = true;                            
          this.errorMsg = (parseResponse != null || parseResponse != undefined) ? parseResponse : "An error has occurred. Please try again. If the error persists, contact Facility Scheduler support.";
          //bus.$emit('shiftTradenotificationchanged');
        });
  }
  get getDept() {
            return this.data.tradeDetail.departmentName + " (" + this.data.tradeDetail.departmentCode + ")";
        }

  formatDate(date: Date): string {
    return moment(date).format("ddd, MMM D");
  }

  formatDateShift(date: Date): string {
    return moment(date).format('dddd MMMM D yy');
  }

    formatTime(t: Date): string {
    return moment(t).format("h:mm A");
  }
}
</script>