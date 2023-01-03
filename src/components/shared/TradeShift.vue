<template>
  <div class="w-100">
    <loading   :active="isLoading"
                    :can-cancel="false"
                    :height="128"
                    :width="128"
                    :color="loaderColor"
                    :opacity="0.7"
                    :is-full-page="true"/>
    <Detail ref="Detail" :enableField="[]" :currentEvent="currentEvent" />
    <div v-if="!this.data.assignmentLoaded && this.data.shiftDetailLoaded" class="tc z-1">
       <svg
          class="neu-feedback--spinner spinner-height"
          width="100px"
          height="100px"
          viewBox="0 0 66 66"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            class="neu-feedback--spinner__fill"
            fill="none"
            stroke-width="2"
            stroke-linecap="round"
            cx="33"
            cy="33"
            r="30"
          ></circle>
        </svg>
    </div>
    <div v-if="this.data.assignmentLoaded && this.data.shiftDetailLoaded" class="container-fluid pb3 pt3">
      <div v-if="isProductive">
        <div class="col-12 d-flex nt1 progress">
        <div class="col-6 completed">
          <p class="absolute f6 white" data-test="drop">
            1. DROP
          </p>
        </div>
        <div class="col-6" data-test="swap-container" v-bind:class="progressStatus">
          <p class="absolute bg-gray f6 white" data-test="swap">
            2. SWAP
          </p>
        </div>
      </div>
      <div class="col-12 mt2 pt4">
        <p class="tl col-12 f4" v-if="progressStatus === 'todo'" data-test="date-time">
          {{ formatTime(this.assignmentDetail.actualStartTime) }} -
          {{ formatTime(this.assignmentDetail.actualEndTime) }}
        </p>
        <div class="d-flex flex-wrap" v-if="progressStatus === 'completed' ||  data.stage == 'withdraw'">
          <p class="tl col-12 f3 mb3" data-test="potential-trades">Potential Trades</p>

          <div class="col-12 d-flex mb3" data-test="search-input">
            <input
              type="text"
              placeholder="Search by Name or Date"
              class="form-control neu-input__text-field pl1 pR15"
              v-model="data.searchNameDate"
            />
            <i class="material-icons closeBtnSearch" @click="clearSearch()">close</i>
            <div
              class="d-flex"
              >
              <span class="input-group-text" @click="search()">
                <i class="material-icons neu-text--white">search</i>
              </span>
            </div>
          </div>
          <div class="col-12 d-flex mb3">
            <div
              class="col-12"
              >
              <input type="checkbox" id="chk1" class="neu-checkbox__input" v-model="data.recommendedShiftsOnly" checked/>
              <label class="neu-checkbox__label neu-text--caption neu-padding--left-10" for="chk1">Recommended Shifts Only</label>
            </div>
          </div>
          <div class="col-12 mb3">
            <label class="type-short">R</label> - <span class="fs-16 fw-bold">Recommended</span>
          </div>
          <div class="col-12 row mb2">
            <div
              class="col-12 pa0"
              v-for="(shiftMem, index) in data.filteredPotentialMembers"
              :key="index" :staffid="shiftMem.staffId"
              data-test="potential-members"
            >
              <div class="selectable-shift d-flex">
                <div class="col-1 pa0">
                  <!-- <div class="neu-margin--right-20 shift-member-image">
                    <img src="/img/avatar_profile.e9f27bd8.png" alt="Avatar Image"></div> -->
                  <h6 class="bg-gray tc white mr2 initial-name">
                    {{ shiftMem.firstName[0] + shiftMem.lastName[0] }}
                  </h6>
                </div>
                <div class="col-10 fs-13 left-5">
                  <span class="user-name fs-14 fw-bold"
                    >{{ formatAssignmentTime(shiftMem.assignmentStart) }} -
                    {{ formatAssignmentTime(shiftMem.assignmentEnd) }}</span
                  >
                  <br>
                  <span class="fs-12 fw-bold">{{
                    shiftMem.firstName + " " + shiftMem.lastName
                  }}</span
                  >,
                  <span class="gray fs-12"
                    >{{ shiftMem.skill }} ({{ shiftMem.departmentName }})</span
                  >
                  <span v-if="shiftMem.isAutoapprovable" class="ml2 shift-member-skill"
                    ><label class="type-short">R</label></span
                  >
                </div>
                <div class="col-1 pa0">
                  <div class="neu-checkbox neu-margin--bottom-10">
                          <input :disabled="data.stage == 'withdraw'"
                    :checked="selectedPotential(shiftMem)"
                    @change="onPotentialChecked(shiftMem)"
                    :id="shiftMem.assignmentId" type="checkbox" 
                      v-bind:class="[
                      'neu-checkbox__input',
                {
                  ' pointer-event-none disabled-checkbox':data.stage == 'withdraw',
                },
              ]">
                            <label class="neu-checkbox__label" :for="shiftMem.assignmentId"></label>
                          </div>
                </div>
              </div>
            </div>
            <div
              class="col-12"
              v-if="
                data.filteredPotentialMembers.length == 0 &&
                  !data.potentialMemberLoading && !data.isInitialLoad
              "
            >
              No Shift Member Found
            </div>
          </div>
          <div class="absolute col-12 tc z-1" v-if="data.potentialMemberLoading">
            <svg
              class="neu-feedback--spinner spinner-height"
              width="100px"
              height="100px"
              viewBox="0 0 66 66"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                class="neu-feedback--spinner__fill"
                fill="none"
                stroke-width="2"
                stroke-linecap="round"
                cx="33"
                cy="33"
                r="30"
              ></circle>
            </svg>
          </div>
          <div
            class="col-12 justify-content-end row shift-pagination"
            v-if="data.filteredPotentialMembers.length != 0"
          >
            <ul
              v-bind:class="[
                'd-flex list',
                {
                  ' pointer-event-none ': data.potentialMemberLoading,
                },
              ]"
            >
            <li @click="loadOffset('back')" v-bind:class="[
                'mr1 inactive',
                {
                  ' pointer-event-none btn-disabled ': (data.activePageNumber == 1),
                },
              ]">
                <i class="material-icons">chevron_left</i>
              </li>
              <!-- <li
                v-for="page of data.displayPages" :key="page"
                @click="loadOffset(page)"
                v-bind:class="[
                  'mr1',
                  {
                    ' active': data.activePageNumber == page,
                    inactive: data.activePageNumber != page,
                  },
                ]"
              >
                {{page}}
              </li> -->
              
            <li @click="loadOffset('next')" v-bind:class="[
                'mr1 inactive',
                {
                  ' pointer-event-none btn-disabled ': 
                  (data.potentialMembers[data.potentialMembers.length-1].resultOffset == data.potentialMembers[data.potentialMembers.length-1].totalResultCount),
                },
              ]">
                <i class="material-icons">navigate_next</i>
              </li>
            </ul>
          </div>
        </div>
        <template
          v-if="progressStatus === 'todo' && assignmentDetail && assignmentDetail.shiftMembers.length > 0"
        >
          <!-- <p class="col-12 mt2 tl f6 mb2 ff-hca-b">SHIFT MEMBERS</p> -->
          <div class="col-12 neu-margin--top-20 neu-margin--bottom-20">
          <p class="neu-text--tag neu-text--align-left">SHIFT MEMBERS</p>
          </div>
          <div class=" mb2" 
          v-bind:class="[
          ' d-flex flex-wrap mb2',
            {
              'shift-member-container':
                assignmentDetail.shiftMembers.length > 6,
            },
          ]">
            <div
              class="col-12 mt2 mb2"
              v-for="shiftMember in assignmentDetail.shiftMembers"
              :key="shiftMember.username"
            >
            <div class="d-flex">
              <div class="col-auto pa0">
                <h6 class="bg-gray tc white mr2 initial-name">
                  {{ shiftMember.firstName[0] + shiftMember.lastName[0] }}
                </h6>
              </div>            
              <div class="col-auto pa0">
                <div class="row">
                  <div class="col-12">
                    <span
                      class="fw6"
                      v-bind:title="shiftMember.name"
                      >{{
                        (
                          shiftMember.firstName +
                          " " +
                          shiftMember.lastName
                        )
                      }}</span
                    >
                  </div>
                  <div class="col-12">
                    <span class="gray">{{ shiftMember.skill }}</span>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div class="col-12 mb2"
      v-bind:class="[
            {
              'mt5':
                data.stage == 'todo'
            },
          ]"      
      >
        <button
          data-test="fire-action"
          v-bind:class="[
            {
              ' col-12 neu-button btn-disabled white':
                data.stage == 'completed' && data.checkedPotential.length == 0,
              'col-12 neu-button neu-button--primary neu-button--raised':
                data.stage == 'todo' || data.stage == 'withdraw' ||
                (data.stage == 'completed' && data.checkedPotential.length > 0),
              'neu-button--blue-disabled': isImpersonating
            },
          ]"
          @click="FireAction"
          :disabled="isImpersonating"
        >
          {{
            progressStatus === "completed" ? "Send Swap Request" : progressStatus === "todo"  ? "Swap Shift" : "Withdraw Swap Request"
          }}
        </button>
      </div>            
    </div>
    <div v-else>
      <ShiftDetail :currentEvent="currentEvent" />
        <div class="container-fluid tc">
          <div>
            <div class="col-12">
              <h6>Cannot be Modified</h6>
            </div>
          </div>
        </div>
    </div>
  </div>     
  </div>
</template>

// <script lang="ts">
// import moment from "moment";
// import Detail from "./Detail.vue";
// import ShiftDetail from "./ShiftDetail.vue";
// import { Component, Vue, Prop } from "vue-property-decorator";
// import { namespace } from "vuex-class";
// const profile = namespace("profile");
// const schedule = namespace("schedule");
// import Loading from 'vue-loading-overlay';
// import 'vue-loading-overlay/dist/vue-loading.css';
// import { useAppInsights } from '../../store/modules/AppInsights'
//  @Component({
//     components: {
//             Detail,
//             ShiftDetail,
//             Loading
//         },
//     })
// export default class TradeShift extends Vue {
//   data: {
//     oldOffset: number;
//     searchNameDate: string;
//     shiftMembers: never[];
//     potentialMembers: never[];
//     filteredPotentialMembers: never[];
//     stage: string;
//     checkedPotential: never[];
//     activePageNumber: number;
//     potentialMemberLoading: boolean;
//     assignmentLoaded: boolean;
//     shiftDetailLoaded: boolean;
//     totalResultCount: number;
//     displayPages: number[];
//     totalPageCount: number;
//     shiftOffers: Array<any>,
//     cachPotentialTrades: Array<any>;
//     searchStartDate: string;
//     searchEndDate: string;
//     searchFirstName: string;
//     searchLastName: string;
//     recommendedShiftsOnly:boolean;
//     isInitialLoad: boolean;
// } = {
//     oldOffset: 0,
//     searchNameDate: "",
//     shiftMembers: [],
//     potentialMembers: [],
//     filteredPotentialMembers: [],
//     stage: "todo",
//     checkedPotential: [],
//     activePageNumber: 1,
//     potentialMemberLoading: false,
//     assignmentLoaded: false,
//     shiftDetailLoaded: false,
//     totalResultCount: 0,
//     displayPages: [],
//     totalPageCount: 0,
//     shiftOffers: [],
//     cachPotentialTrades: [],
//     searchStartDate: "",
//     searchEndDate: "",
//     searchFirstName: "",
//     searchLastName: "",
//     recommendedShiftsOnly: true,
//     isInitialLoad: true
//   };
//   $refs!: {            
//             Detail:any;
//         };  
//   @profile.State profileData!: any;
//   @profile.State
//   isAdmin!: boolean;
//   @Prop() currentEvent: any;
//   @schedule.State public assignmentDetail!: any;
//   @profile.State appInsightEventData!: any;
//   isLoaded: boolean = false;
//   processMode: boolean = false;
//   isProductive: boolean = false;
//   isLoading:boolean = false;
//   loaderColor: string = "#0085ca";
//     @profile.State
//     isImpersonating!: boolean;

//   mounted() {        
//     if(this.currentEvent.status== "Scheduled" && this.currentEvent.type == "Assignment"){
//       this.getAssignmentDetail();
//     } else {
//       this.isProductive = true;
//       this.getShiftTradeOffer();
//     }
//   }

//   FireAction() {
//     if(this.data.stage == "withdraw") {
//       this.withdrawPotentialTrade();
//       return;
//     }
//     if (
//       (this.data.stage == "completed" &&
//         this.data.checkedPotential.length == 0) ||
//       (this.processMode && this.data.stage == "completed")
//     ) {
//       return;
//     }
//     if (this.data.stage == "completed") {
//       this.createShiftOffer();
//     }
//     if(this.data.stage == "todo") {
//       this.data.stage = "completed";
//     }
//   }

//   async getShiftTradeOffer() {
//     var payload = { 
//         username: this.profileData.username, 
//         shiftTradeOfferId:  this.currentEvent.id, 
//     };

//     await this.$store.dispatch("schedule/getShiftTradeOffer", payload)
//       .then((res) =>  {
//         this.data.shiftOffers = res.data;
//         if(this.data.shiftOffers?.length > 0) {
//           this.data.stage = "withdraw";
//           this.getPotetialTradeAssignment();
//         } else {
//               this.getAssignmentDetail();
//         }
//         this.data.shiftDetailLoaded = true
//       })
//   }

//   getGuidforCreateShift() {
//             var uuidValue = "", k, randomValue;
//             for (k = 0; k < 32; k++) {
//                 randomValue = Math.random() * 16 | 0;
//                 if (k == 8 || k == 12 || k == 16 || k == 20) {
//                     uuidValue += "-"
//                 }
//                 uuidValue += (k == 12 ? 4 : (k == 16 ? (randomValue & 3 | 8) : randomValue)).toString(16);
//             }
//             return uuidValue;
//   }

//   createShiftOffer() {
//     let requestBody: any[] = [];
//     const checkedPotential: any = this.data.checkedPotential;
//     checkedPotential.forEach(checked => {
//             requestBody.push({
//                 id: this.getGuidforCreateShift(),
//                 username: this.profileData.username,
//                 firstName: this.profileData.first,
//                 lastName: this.profileData.last,
//                 tenantId: this.profileData.tenantId,
//                 scheduleId: this.assignmentDetail.scheduleId,
//                 facilityId: this.assignmentDetail.facilityId,
//                 coid: this.profileData.coid,
//                 facilityName: this.profileData.facilityName,
//                 departmentId: this.profileData.deptId,
//                 facilityCoId: this.assignmentDetail.facilityCoId,
//                 departmentName: this.assignmentDetail.departmentCode,
//                 departmentCode: this.profileData.deptCode,
//                 departmentShiftId: this.assignmentDetail.departmentShiftId,
//                 shiftCode: this.assignmentDetail.shiftCode,
//                 shiftDescription: this.assignmentDetail.shiftDescription,
//                 skill:checked.skill,
//                 date: this.currentEvent.date,
//                 startTime: this.assignmentDetail.startTime,
//                 endTime: this.assignmentDetail.endTime,
//                 actualStartTime: this.assignmentDetail.actualStartTime,
//                 actualEndTime: this.assignmentDetail.actualEndTime,
//                 hours: this.assignmentDetail.hours,
//                 minutes: this.assignmentDetail.minutes,
//                 status: 'Offered',
//                 requestorAssignmentId: this.assignmentDetail.id,
//                 productiveType: this.assignmentDetail.productiveType,
//                 acceptorAssignmentId: checked.assignmentId,
//                 offeredToUsername:  checked.staffUsername,
//                 offeredToFirstName: checked.firstName,
//                 offeredToLastName: checked.lastName,
//                 isAutoapprovable: checked.isAutoapprovable
//             });
//     });

//     this.isLoading = true;
//     this.$store
//       .dispatch("schedule/createShiftTradeOffers", requestBody)
//       .then((res) => {
//         if (res.status === 200) {
//             this.isLoading = false;
//             this.$emit('showSuccessMsgPopUp', true);
//             this.$emit('closeSharedModal');
//             useAppInsights().trackEvent({name:'ShiftTradesOffered',properties: 
//                JSON.parse(JSON.stringify(this.appInsightEventData))
//             });
//         }
//       })
//       .catch((err: any) => {
//         if (err) {
//            this.isLoading = false;
//            console.log(err); // Handle errors any way you want
//            let parseResponse = err.request.responseText != "" ? JSON.parse(err.request.responseText) : err.request.responseText;                
//            this.$refs.Detail.showErrorMsg = true;                            
//           this.$refs.Detail.errorMsg = (parseResponse.result != null || parseResponse.result != undefined) ? JSON.parse(parseResponse.result).Message : "An error has occurred. Please try again. If the error persists, contact Facility Scheduler support.";
//         }        
//       })
//       .finally(() => {
//         this.isLoading = false;
//         this.processMode = false;
//         // this.$emit('closeSharedModal');
//       });
//   }

//   withdrawPotentialTrade() {
//     this.isLoading = true;
//     this.$store
//       .dispatch("schedule/withdrawPotentialTrade", this.assignmentDetail.id)
//       .then(() => {
//         this.isLoading = false;
//         this.$emit('showSuccessMsgPopUp', true);
//         this.$emit('closeSharedModal');
//       })
//       .catch((err: any) => {
//         if (err) {
//           this.isLoading = false;
//           console.log(err); // Handle errors any way you want          
//           let parseResponse = err.request.responseText != "" ? JSON.parse(err.request.responseText) : err.request.responseText;                        
//           this.$refs.Detail.showErrorMsg = true;                            
//           this.$refs.Detail.errorMsg = (parseResponse.result != null || parseResponse.result != undefined) ? JSON.parse(parseResponse.result).Message : "An error has occurred. Please try again. If the error persists, contact Facility Scheduler support.";
//         }         
//       });
//   }

//   async getAssignmentDetail() {
//     var payload = { 
//       username: this.profileData.username, 
//       id: this.currentEvent.id
//     };  

//     await this.$store.dispatch("schedule/getAssignmentDetail", payload);
//     this.data.assignmentLoaded = true;
//     this.data.shiftDetailLoaded = true;    
//     this.isProductive = (this.assignmentDetail.productiveType == "Productive" || this.assignmentDetail.productiveTypeId == 1) ? true : false;     
//   }

//   async getPotetialTradeAssignment(offsetVal = 0, searchFirstNameLike = '', searchLastNameLike = '',searchStartDate='', searchEndDate='') {
//     const checkIfCached = this.data.cachPotentialTrades.find((trades) => this.data.activePageNumber == Number(Object.keys(trades)[0]));
//     if(checkIfCached) {
//       this.handlePotentialShiftResponse(checkIfCached[this.data.activePageNumber]);
//       this.data.cachPotentialTrades.pop();
//       return;
//     }
//     this.data.potentialMemberLoading = true;
//     this.isLoading = true;
//     await this.$store
//       .dispatch("schedule/getPotetialTradeAssignment", {              
//         assignmentId: this.currentEvent.id,
//         currentPage:  Math.ceil(offsetVal/6) > 1 ? Math.ceil(offsetVal/6) : 1,
//         autoApprovableOnly: this.data.recommendedShiftsOnly,
//         searchFirstNameLike:searchFirstNameLike,
//         searchLastNameLike:searchLastNameLike,
//         searchStartDate:searchStartDate,
//         searchEndDate:searchEndDate,
//         primaryDeptOnly:false

//       }).then((response) => {
//               this.isLoading = false;
//               if(response) {
//                 if(this.data.activePageNumber == 1) {
//                   this.data.totalResultCount = response.length > 0 ? response[0].totalResultCount : 0;
//                   this.data.totalPageCount = Math.ceil(this.data.totalResultCount/6); // here 6 is current page display limit
//                 }

//                 this.handlePotentialShiftResponse(response);
//               }
//               this.data.potentialMemberLoading = false;
//               this.data.assignmentLoaded = true;
//       });
//   }

//   handlePotentialShiftResponse(response) {
//     this.data.potentialMembers = response;
//     this.data.filteredPotentialMembers = response;
//     this.data.shiftOffers?.forEach(potential => {
//       this.onPotentialChecked({assignmentId: potential.acceptorAssignmentId});
//     });
//   }

//   selectedPotential(assignment) {
//     const checkedPotential: any = this.data.checkedPotential;
//     return checkedPotential.some((potential) => potential.assignmentId == assignment.assignmentId);
//   }

//   get progressStatus() {
//     return this.data.stage; // todo calculate class
//   }

//   showNextPage() {
//     // todo pagenumber to dynamic and show next three
//     if (this.$refs.Detail.showErrorMsg) {
//       this.$refs.Detail.showErrorMsg = false;
//       this.$refs.Detail.errorMsg = "";
//     }  
//   }

//   loadOffset(action: string) {
//     this.data.searchNameDate = '';
//     let resultOffset = 0;
//     const lastPotentialMember: any = this.data.potentialMembers[this.data.potentialMembers.length-1];
//     resultOffset = this.data.activePageNumber * 6;
//     if(action == 'next' &&   resultOffset != lastPotentialMember.totalResultCount) {      
//       this.data.cachPotentialTrades.push({[this.data.activePageNumber]: this.data.potentialMembers});
//       this.data.activePageNumber = this.data.activePageNumber + 1;
//       this.getPotetialTradeAssignment(resultOffset + 1,this.data.searchFirstName, this.data.searchLastName,this.data.searchStartDate);
//     } else if(action == 'back' && this.data.activePageNumber != 1) {
//       resultOffset = Number(Object.keys(this.data.cachPotentialTrades[this.data.cachPotentialTrades.length -1])[0]);
//       this.data.activePageNumber = this.data.activePageNumber - 1;
//       this.getPotetialTradeAssignment(resultOffset,this.data.searchFirstName,this.data.searchLastName,this.data.searchStartDate);
//     }
   
//     if (this.$refs.Detail.showErrorMsg) {
//       this.$refs.Detail.showErrorMsg = false;
//       this.$refs.Detail.errorMsg = "";
//     }  
//   }

//   search() {
//     this.data.isInitialLoad = false;
//     if (this.data.searchNameDate == "") {
//       this.getPotetialTradeAssignment();
//       return;
//     }
  
//   // check if its a date search
//    let isDateSearch = false;

//     if(moment(this.data.searchNameDate).isValid()){
//       isDateSearch = true;
//       this.data.searchStartDate = (moment(this.data.searchNameDate).format('MM-DD-YYYY')).toString();
//     }

//     if(isDateSearch){    
//         // date search        
//         this.getPotetialTradeAssignment(0,'','',this.data.searchStartDate); 
//         this.data.searchFirstName = "";
//         this.data.searchLastName = "";      
//     } else {
//       this.data.searchStartDate = "";
//       // name search
//       const regex = /\d/;
//       if(regex.test(this.data.searchNameDate)){
//         // invalid search term - not a date nor a name 
//         this.data.filteredPotentialMembers = this.data.potentialMembers;
//         return;
//       }

//       var nameSearch = this.data.searchNameDate.split(" ");      
//       const alphaRegex =  /^[a-zA-Z()]+$/;
     

//       if(nameSearch.length == 1){
        
//         this.data.searchFirstName = this.data.searchNameDate;
//         this.data.searchLastName = this.data.searchNameDate;
        
//         if(!alphaRegex.test(this.data.searchFirstName)){
          
//           this.data.filteredPotentialMembers = this.data.potentialMembers;
//           return;
//         }

//         this.getPotetialTradeAssignment(0,this.data.searchFirstName,this.data.searchLastName);
       
//       } else {
        
//         this.data.searchFirstName =nameSearch[0].substring(0,30);
//         this.data.searchLastName = nameSearch[1].substring(0,30);
//         const isFirstNameIsAlphabetic = alphaRegex.test(this.data.searchFirstName);
//         const isLastNameAlphabetic = alphaRegex.test(this.data.searchLastName)
        
//         if(!isFirstNameIsAlphabetic && !isLastNameAlphabetic){
          
//           this.data.filteredPotentialMembers = this.data.potentialMembers;
//           return;
        
//         } else if(isFirstNameIsAlphabetic && !isLastNameAlphabetic){

//           this.getPotetialTradeAssignment(0,this.data.searchFirstName);

//         }else if(isLastNameAlphabetic && !isFirstNameIsAlphabetic){

//           this.getPotetialTradeAssignment(0,'',this.data.searchLastName);

//         }else{

//           this.getPotetialTradeAssignment(0,this.data.searchFirstName,this.data.searchLastName);          
//         }
       
//       }
    
//     }

//     if (this.$refs.Detail.showErrorMsg) {
//       this.$refs.Detail.showErrorMsg = false;
//       this.$refs.Detail.errorMsg = "";
//     }  
//   }

//   formatAssignmentTime(date: Date): string {
//     return moment(date).format("ddd, MMM D - h:mm A");
//   }

//   formatDate(date: Date): string {
//     return moment(date).format("ddd, MMM D");
//   }
//   formatTime(t: Date): string {
//     return moment(t).format("h:mm A");
//   }
//   onPotentialChecked(potential) {
//     const checkedPotential: any = this.data.checkedPotential;
//     if (!checkedPotential.some(e => e.assignmentId === potential.assignmentId)) {
//       checkedPotential.push(potential);
//     } else {
//       const filteredOne = this.data.checkedPotential.filter((potentials: any) => {
//         return potential.assignmentId != potentials.assignmentId;
//       });
//       this.data.checkedPotential = filteredOne;
//     }
//     if (this.$refs.Detail.showErrorMsg) {
//       this.$refs.Detail.showErrorMsg = false;
//       this.$refs.Detail.errorMsg = "";
//     }  
//   }

//   clearSearch(){    
//     this.data.searchNameDate = '';    
//       // reset search
//       this.data.searchFirstName = "";
//       this.data.searchStartDate = "";
//       this.data.searchLastName = "";
//   }
// }
// </script>
