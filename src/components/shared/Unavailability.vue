<template>
    <div class="col-12">
         <loading   :active="isLoading"
                    :can-cancel="false"
                    :height="128"
                    :width="128"
                    :color="loaderColor"
                    :opacity="0.7"
                    :is-full-page="true"/>
        <div class="bg-black-05 container-fluid">
            <div class="row">
                <div class="col-12 pt3">
                    <p class="neu-text--caption align-content-center" id="txtRemainingUnavailablityDays">
                        Remaining Schedule Period Unavailability Days:
                        <strong>{{remainingUnavailableDays}}</strong>
                    </p>
                </div>
                <div class="col-12 neu-margin--bottom-20" v-if="showErrorMsg">
                    <ErrorNotification :errorMsg="errorMsg" :errorType="errorType" />
                </div>
                <div class="col-12 pb4" v-if="datesList.length>1">
                    <h4>Dates</h4>
                </div>
                <div class="col-12" v-if="datesList.length>1">
                    <div class="row">

                        <div class="col-6 mb3" v-for="objDL in datesList" :key="'div_' + objDL.id">
                            <div :id="objDL.id"
                                 :class="[disableAll == false ? 'pa2 neu-background--cerulean-25 custom-border pointer' : 'pa2 neu-background--chrome-light custom-border pointer']"
                                 v-on:click="disableAll == false ? toggleDateSelection($event) : null">{{ getDisplayDate(objDL.id)}}</div>
                        </div>
                    </div>
                </div>
                <div class="col-12">
                    <div class="hr-line"></div>
                </div>
                <div class="col-12" v-if="isUnavailabilityEvent || remainingUnavailableDays != 0">
                    <p class="neu-text--caption align-content-center">
                        Selecting preferences does not guarantee that they will be honored.
                    </p>
                </div>
                <div class="col-12 pb4 neu-margin--top-30" v-if="isUnavailabilityEvent || remainingUnavailableDays != 0">
                    <div class="row">
                        <div class="col-12 neu-margin--left-30">
                            <label class="neu-input__label">Availability</label>

                            <div role="radiogroup" class="neu-radiogroup" id="rdbtngrp_Availability">
                                <div class="neu-radio neu-margin--top-05">
                                    <input id="rdbtnAvailable" @change="onAvailableChange()" type="radio" class="neu-radio__input" value="I am available to work" v-model="availabilityStatus" :disabled="disableAll">
                                    <label class="neu-radio__label neu-text--caption" for="rdbtnAvailable">I am available to work</label>
                                </div>
                                <div class="neu-radio neu-margin--top-05">
                                    <input id="rdbtnUnavailable" @change="onUnAvailableChange()" type="radio" class="neu-radio__input" value="I prefer not to work" v-model="availabilityStatus" :disabled="disableAll">
                                    <label class="neu-radio__label neu-text--caption" for="rdbtnUnavailable">I prefer not to work</label>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="row neu-margin--top-30 hideElement">
                        <div class="col-8 neu-margin--left-30">
                            <label for="partof_day" class="neu-input__label">Part Of Day/Hours</label>
                            <input type="text"
                                    name="partOfDay"
                                    id="txtPartOfDay"
                                    :value="profileData.partOfDay + ' - ' + profileData.primaryShift"
                                    readonly
                                    class="readonly_text_field neu-input__text-field cursorNotAllowed" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid" v-if="isUnavailabilityEvent || remainingUnavailableDays != 0">
            <div class="row">
                <div class="col-12">
                    <button @click="addToSchedule"
                            name="btnAddToSchedule"
                            :class="['d-block mb4 mt4 neu-button w-100 neu-text--white', (disableAll || disableSubmitButton || isImpersonating) ? 'neu-button--blue-disabled' : 'neu-background--denim']"
                            :disabled="(disableAll || disableSubmitButton || isImpersonating)">
                        Add to Schedule
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

// <script lang="ts">
//     import { Component, Vue, Prop, Watch } from "vue-property-decorator";
//     import { namespace } from "vuex-class";
//     import ErrorNotification from "./ErrorNotification.vue";
//     import { UnavailabilityModel, Event, ORSchedule } from '@/models';
//     import Loading from 'vue-loading-overlay';
//     import 'vue-loading-overlay/dist/vue-loading.css';
//     import moment from "moment";
//     import { useAppInsights } from '../../store/modules/AppInsights'

//     const schedule = namespace("schedule");
//     const profile = namespace("profile");

//     @Component({
//         components: {
//             ErrorNotification,
//             Loading
//         },
//     })
//     export default class Unavailability extends Vue {

//         @profile.State
//         public profileData!: any;
//         @profile.State
//         isAdmin!: boolean;
//         @schedule.State
//         public userSchedules!: any;

//         @profile.State
//         isImpersonating!: boolean;

//         @profile.State
//         appInsightEventData!: any;

//         @Prop() currentEvent!: any;
//         @Prop() calSelectedDates!: any;
//         @Prop() isUnavailabilityEvent!: any;

//         oldAvailStatus: string = "";
//         isAvailStatusChanged: boolean = false;
//         datesList: any = [];
//         currentId: number = 0;
//         showErrorMsg: boolean = false;
//         errorMsg: string = '';
//         errorType: string = 'error';

//         availabilityStatus: string = "";
//         alreadyUnavailableCount: number = 0;
//         maxUnavailableDays: number = 0;
//         remainingUnavailableDays: number = 0; //        
//         currentSchedule!: ORSchedule;
//         disableAll: boolean = false;
//         disableSubmitButton: boolean = false;
//         isLoading:boolean = false;
//         loaderColor: string = "#0085ca";
        
//         async mounted() {                  
//             await this.getCurrentSchedule();              
//             if (this.currentEvent.type == "Unavailability") //--Clicked only single date which is already unavailable 
//             {
//                 let singleDate = {
//                     id: this.currentEvent.id,
//                     dateValue: this.currentEvent.date,
//                     isSelected: true,
//                     isAlreadyUnavailable: true
//                 }
//                 this.datesList[0] = JSON.parse(JSON.stringify(singleDate));
//                 this.availabilityStatus = "I prefer not to work";
//                 this.oldAvailStatus = "I prefer not to work";
//                 let startDt = this.currentEvent.date;
//                 let currDt = new Date(new Date().setHours(0,0,0,0));
//                 this.disableAll = (new Date(startDt) < new Date(currDt) ? true : false);
//                 this.disableSubmitButton = true;
//             }
//             else //--Dragged the dates from calender 
//             {
//                 this.showCalenderSelectedDates();
//             }
//             await this.findRemainingUnavailableDays();
//         }

//         async getCurrentSchedule() {
//             let startDate: Date = ((this.currentEvent.type == "Unavailability") ? this.currentEvent.date : this.calSelectedDates.startDate );
            
//             this.userSchedules.forEach((schedule: ORSchedule) => {
//                 if (this.currentSchedule == undefined) {
//                     let startDt, endDt, currDt;
//                     startDt = schedule.startDate;
//                     currDt = startDate;
//                     endDt = schedule.endDate;

//                     if (new Date(startDt) <= new Date(currDt) && new Date(endDt) >= new Date(currDt)) {
//                        this.currentSchedule = JSON.parse(JSON.stringify(schedule));//-- set current schedule
//                     }
//                 }
//                  else {
//                     return false;
//                 }
//             });
//         }

//         async showCalenderSelectedDates() {
//             var startSD = moment(this.calSelectedDates.startDate, 'M/D/YYYY');
//             var endSD = moment(this.calSelectedDates.endDate, 'M/D/YYYY');
//             var diffDays = endSD.diff(startSD, 'days');
//             let calCurrentDate: Date = new Date(this.calSelectedDates.startDate);
//             let availableCount: number = 0;
//             let unavailableCount: number = 0;
//             let selectedDatesCount: number = 0;

//             let todayDate: Date = new Date();
//             if (calCurrentDate < todayDate) {

//                 calCurrentDate = todayDate;
//                 let currentDiffDays = (moment(todayDate, 'M/D/YYYY')).diff(startSD, 'days');
//                 diffDays = diffDays - currentDiffDays;
//             }

//             selectedDatesCount = diffDays;
//             for (var i = 0; i < diffDays; i++) {
//                 let singleDate = {
//                     id: i,
//                     dateValue: calCurrentDate,
//                     isSelected: true,
//                     isAlreadyUnavailable: this.checkAlreadyUnavailable(calCurrentDate)
//                 }
//                 this.datesList[i] = JSON.parse(JSON.stringify(singleDate));
//                 calCurrentDate.setDate(calCurrentDate.getDate() + 1);

//                 if (this.datesList[i].isAlreadyUnavailable) {
//                     unavailableCount++;
//                 }
//                 else {
//                     availableCount++;
//                 }
//             }

//             this.availabilityStatus = (this.alreadyUnavailableCount > 0 ? "I prefer not to work" : "I am available to work");
//             this.oldAvailStatus = (this.alreadyUnavailableCount > 0 ? "I prefer not to work" : "I am available to work");

//             if (selectedDatesCount > 0) {
//                 if (availableCount == selectedDatesCount) {
//                     this.availabilityStatus = "I am available to work";
//                     this.oldAvailStatus = "I am available to work";
//                     this.disableAll = false;
//                     this.disableSubmitButton = true;
//                 }
//                 else if (unavailableCount == selectedDatesCount) {
//                     this.availabilityStatus = "I prefer not to work";
//                     this.oldAvailStatus = "I prefer not to work";
//                     this.disableAll = false;
//                     this.disableSubmitButton = true;
//                 }
//                 else {
//                     this.availabilityStatus = "I am available to work";
//                     this.oldAvailStatus = "I am available to work";
//                     this.disableAll = true;
//                     this.disableSubmitButton = true;
//                     this.showErrorMsg = true;
//                     this.errorType = "warning";
//                     this.errorMsg = "Your date selections must have the same availability/unavailability status in order to proceed.";
//                 }
//             }
//         }

//         onAvailableChange() {
//             if (this.showErrorMsg) {
//                 this.showErrorMsg = false;
//                 this.errorMsg = "";
//             }
//         }

//         onUnAvailableChange() {
//             if (this.showErrorMsg) {
//                 this.showErrorMsg = false;
//                 this.errorMsg = "";
//             }
//         }

//         checkAlreadyUnavailable(dateValue: Date) {
//             if (this.currentSchedule != undefined || this.currentSchedule != null) {
//                 let eventAlreadyUnavail = this.currentSchedule.events.find((event: Event) => event.type == "Unavailability" && moment(event.date).format('YYYY-MM-DD') == moment(dateValue).format('YYYY-MM-DD'));
//                 if (eventAlreadyUnavail != undefined || eventAlreadyUnavail != null) {
//                     this.alreadyUnavailableCount++;
//                     return true;
//                 }
//                 else
//                     return false;
//             }
//             else {
//                 return false; //await this.getCurrentSchedule();
//             }
//         }

//         async findRemainingUnavailableDays() {
//             this.maxUnavailableDays = Number(this.profileData.maxUnavailableDays);

//             if (this.currentSchedule != undefined || this.currentSchedule != null) {
//                 this.getRemainingUnavailDays();
//             }
//         }

//         getRemainingUnavailDays() {
//             let alreadyUnavailList: Event[] = this.currentSchedule.events.filter((event: Event) => event.type == "Unavailability");
//             if (alreadyUnavailList != undefined) {
//                 this.remainingUnavailableDays = (Number(this.maxUnavailableDays) - Number(alreadyUnavailList.length));
//             }
//             else {
//                 this.remainingUnavailableDays = this.maxUnavailableDays;
//             }

//             if(this.remainingUnavailableDays == 0){
//                 var txtRemainingUnavailablityDays = document.getElementById('txtRemainingUnavailablityDays') as HTMLElement;
//                 txtRemainingUnavailablityDays.style.color = "red";
//             }
//             if (this.currentEvent.type != "Unavailability") {
//                 if (this.remainingUnavailableDays == 0) {
//                     let unavailCount = 0;
//                     for (var j = 0; j < this.datesList.length; j++) {
//                         if (this.datesList[j].isSelected == true && this.datesList[j].isAlreadyUnavailable == true) //
//                         { unavailCount++; }
//                     }
//                     if (this.datesList.length == unavailCount) {
//                         this.disableAll = false;
//                     }
//                     else {
//                         this.disableAll = true;
//                         this.showErrorMsg = false;
//                         this.errorType = "";
//                         this.errorMsg = "";
//                     }
//                 }
//                 else {
//                     if (this.errorType == "warning") {
//                         this.disableAll = true;
//                     }
//                     else {
//                         this.disableAll = false;
//                     }
//                 }
//             }
//         }

//         toggleDateSelection(event) {
//             let currentId = event.currentTarget.id;

//             for (var i = 0; i < this.datesList.length; i++) {
//                 if (this.datesList[i].id == currentId) {
//                     let currentStatus: boolean = (this.datesList[i].isSelected);
//                     this.datesList[i].isSelected = !(this.datesList[i].isSelected);
//                     if (currentStatus) {
//                         event.currentTarget.classList.remove("neu-background--cerulean-25");
//                         event.currentTarget.classList.add("neu-background--white");
//                     }
//                     else {
//                         event.currentTarget.classList.remove("neu-background--white");
//                         event.currentTarget.classList.add("neu-background--cerulean-25");
//                         if (this.showErrorMsg) {
//                             this.showErrorMsg = false;
//                             this.errorMsg = "";
//                         }
//                     }
//                 }
//             }
//             if (this.showErrorMsg) {
//                 let selectedCount: number = 0;
//                 for (var j = 0; j < this.datesList.length; j++) {
//                     if (this.datesList[j].isSelected) {
//                         selectedCount++;
//                     }
//                 }
//                 if (this.remainingUnavailableDays >= selectedCount) {
//                     this.showErrorMsg = false;
//                     this.errorMsg = "";
//                 }
//             }
//         }

//         getDisplayDate(currentId) {
//             for (var i = 0; i < this.datesList.length; i++) {
//                 if (this.datesList[i].id == currentId) {
//                     return moment(this.datesList[i].dateValue).format("dddd, MMMM D");
//                 }
//             }
//             return "";
//         }

//         validateBeforeSave() {
//             let selectedDatesCount: number = 0;
//             let availableCount: number = 0;
//             let unavailableCount: number = 0;
//             for (var i = 0; i < this.datesList.length; i++) {
//                 if (this.datesList[i].isSelected) {
//                     selectedDatesCount++;
//                     if (this.datesList[i].isAlreadyUnavailable) {
//                         unavailableCount++;
//                     }
//                     else {
//                         availableCount++;
//                     }
//                 }
//             }
//             if (selectedDatesCount > 0) {
//                 if (this.availabilityStatus == "I prefer not to work") {
//                     if ((selectedDatesCount - unavailableCount) > (this.remainingUnavailableDays)) {
//                         let dateCaption = (this.remainingUnavailableDays > 1 ? this.remainingUnavailableDays + " days " : "1 day")
//                         this.showErrorMsg = true;
//                         this.errorType = "error";
//                         this.errorMsg = "Please select only " + dateCaption + " for Unavailability";
//                         return false;
//                     }
//                 }
//                 return true;
//             }
//             else {
//                 this.showErrorMsg = true;
//                 this.errorType = "error";
//                 this.errorMsg = "Please select atleast one date";
//                 return false;
//             }
//         }

//         async addToSchedule() {       
//             if (this.validateBeforeSave()) {
//                 if (this.availabilityStatus == "I prefer not to work") {
//                     let item = 0;
//                     let unavailList: any= [];
//                     for (var i = 0; i < this.datesList.length; i++) {
//                         if (this.datesList[i].isSelected == true && this.datesList[i].isAlreadyUnavailable == false) //
//                         {
//                             let objUA = {
//                                 staffAvailabilityId: 0,
//                                 staffId: this.profileData.staffId,
//                                 tenantId: this.profileData.tenantId,
//                                 startDate: moment(this.datesList[i].dateValue).format("YYYY-MM-DD"),
//                                 endDate: moment(this.datesList[i].dateValue).format("YYYY-MM-DD"),
//                                 isUnavailable: true
//                             }
//                             unavailList.push(JSON.parse(JSON.stringify(objUA)));
//                             item++;
//                         }
//                     }
//                     this.isLoading = true;
//                     await this.$store.dispatch('schedule/SaveUnavailabilityDetails', unavailList)
//                         .then((res: any) => {
//                             // showing message in MyScheduleView Screen
//                             this.$emit('showSuccessMsgPopUp');
//                             this.$emit('closeSharedModal');
//                             this.isLoading = false;
//                             useAppInsights().trackEvent({name:'Unavailability',properties: 
//                                 JSON.parse(JSON.stringify(this.appInsightEventData))
//                             });
//                         })
//                         .catch((err: any) => {
//                             if (err) {
//                                 let parseResponse = this.isJsonString(err.request.responseText) ? JSON.parse(err.request.responseText) : err.request.responseText;
//                                 this.showErrorMsg = true;
//                                 this.errorType = "error";
//                                 this.errorMsg = parseResponse != '' ? parseResponse : "An error has occurred. Please try again. If the error persists, contact Facility Scheduler support.";
//                                 //this.errorMsg = (parseResponse.result != null || parseResponse.result != undefined) ? JSON.parse(parseResponse.result).Message : "An error has occurred. Please try again. If the error persists, contact Facility Scheduler support.";
//                                 this.isLoading = false;
//                             }

//                         })
//                         .finally(() => {
//                             this.isLoading = false;
//                         });
//                 }
//                 else {
//                     //-- check here whether its not already unavailable                   
//                     var unavailabilityIds: string[] = [];
//                     for (var j = 0; j < this.datesList.length; j++) {
//                         if (this.datesList[j].isSelected == true && this.datesList[j].isAlreadyUnavailable == true) //
//                         {
//                             if (this.currentSchedule != undefined || this.currentSchedule != null) //
//                             {
//                                 let alreadyUnavailEvent = this.currentSchedule.events.find((event: Event) => event.type == "Unavailability" && moment(event.date).format('YYYY-MM-DD') == moment(this.datesList[j].dateValue).format('YYYY-MM-DD'));
//                                 if (alreadyUnavailEvent != undefined || alreadyUnavailEvent != null) //
//                                 {
//                                     unavailabilityIds.push(alreadyUnavailEvent.id);
//                                 }
//                             }
//                         }
//                     }
//                     if(unavailabilityIds.length>0){
//                         this.isLoading = true;
//                         await this.$store.dispatch('schedule/DeleteUnavailabilityDetails', unavailabilityIds.join())
//                             .then((res: any) => {
//                                 this.$emit('showSuccessMsgPopUp');
//                                 this.$emit('closeSharedModal');
//                                 this.isLoading = false;
//                             })
//                             .catch((err: any) => {
//                                 if (err) {
//                                     console.log(err);
//                                     let parseResponse = this.isJsonString(err.request.responseText) ? JSON.parse(err.request.responseText) : err.request.responseText;
//                                     this.showErrorMsg = true;
//                                     this.errorType = "error";
//                                     this.errorMsg = parseResponse != '' ? parseResponse : "An error has occurred. Please try again. If the error persists, contact Facility Scheduler support.";
//                                     //this.errorMsg = (parseResponse.result != null || parseResponse.result != undefined) ? JSON.parse(parseResponse.result).Message : "An error has occurred. Please try again. If the error persists, contact Facility Scheduler support.";
//                                     this.isLoading = false;
//                                 }
//                             })
//                             .finally(() => {
//                                 this.isLoading = false;
//                             });
//                     }
//                 }
//             }
//         }

//         isJsonString(str) {
//             try{
//                 JSON.parse(str);
//             }
//             catch(e){
//                 return false;
//             }
//             return true;
//         }
//         get getAvailStatus() {
//             return this.availabilityStatus;
//         }

//         @Watch("getAvailStatus")
//         onttchanges(newValue: string) {
//             if (this.oldAvailStatus != newValue) {
//                 this.disableSubmitButton = false;
//             }
//             else {
//                 this.disableSubmitButton = true;
//             }
//         }
//     }
// </script>