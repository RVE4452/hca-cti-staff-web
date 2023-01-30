<template>
  <div class="w-100">
       
    <Detail ref="Detail" :enableField="[]" :currentEvent="currentEvent" />
    <div v-if="!data.assignmentLoaded && data.shiftDetailLoaded" class="tc z-1">
       <neu-spinner class="div-center" color="primary" >
      </neu-spinner> 
    </div>
    <div v-if="data.assignmentLoaded && data.shiftDetailLoaded" class="container-fluid pb3 pt3">
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
      <div class="col-12 mt-2 pt4">       
        <div class="d-flex flex-wrap" v-if="progressStatus === 'completed' ||  data.stage == 'withdraw'">
          <neu-label content="Potential Trades" class="tl col-12 f3 mb-3" >
          </neu-label>
          <div class="col-12 d-flex mb-3" data-test="search-input">
            <input
              type="text"
              placeholder="Search by Name or Date"
              class="form-control neu-input__text-field pl1 pR15"
              v-model="data.searchNameDate"
            />
            <neu-icon class="closeBtnSearch neu-icon pointer" @click="clearSearch()">close</neu-icon>
            <div
              class="d-flex"
              >
              <span class="input-group-text" @click="search()">
                <neu-icon class="material-icons neu-icon pointer neu-text--white">search</neu-icon>
              </span>
            </div>
          </div>
          <div class="col-12 d-flex mb-3">
              <neu-checkbox id="chk1" name="chk1"  @v-neu-change="onRecommendedChecked()" :checked="data.recommendedShiftsOnly"></neu-checkbox>
              <neu-label class="ml-1" for="chk1">Recommended Shifts Only</neu-label>
          </div>
          <div class="col-12 mb-3">
            <neu-label class="type-short">R</neu-label> - <span class="fs-16 fw-bold">Recommended</span>
          </div>
          <div class="col-12 row mb-2">
            <div
              class="col-12"
              v-for="(shiftMem, index) in data.filteredPotentialMembers"
              :key="index" :staffid="shiftMem.staffId"
              data-test="potential-members"
            >
              <div class="selectable-shift d-flex">
                <div class="col-1">
                  <neu-avatar color="gray-60" :initials="shiftMem.firstName[0] + shiftMem.lastName[0]"></neu-avatar>                              
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
                    ><neu-label class="type-short">R</neu-label></span
                  >
                </div>
                <div class="col-1 pa0">
                  <div class="neu-margin--bottom-10">
                    <neu-checkbox :disabled="data.stage == 'withdraw'"
                    :checked="selectedPotential(shiftMem)"
                    @v-neu-change="onPotentialChecked(shiftMem)"
                    :id="shiftMem.assignmentId"
                     >
                     <neu-label :for="shiftMem.assignmentId"></neu-label>
                    </neu-checkbox>
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
            <neu-spinner class="div-center" v-if="!isLoaded" color="primary" >
            </neu-spinner> 
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
         <shift-member-detail :currentEvent="currentEvent" />
        </template>
      </div>
      <div class="div-center">      
        <neu-button
          data-test="fire-action" class="col-12"
          :disabled="data.stage == 'completed' && data.checkedPotential.length == 0"
          @click="FireAction" 
        >
          {{
            progressStatus === "completed" ? "Send Swap Request" : progressStatus === "todo"  ? "Swap Shift" : "Withdraw Swap Request"
          }}
        </neu-button>
      </div>            
    </div>
    <div v-else>
      <shift-member-detail :currentEvent="currentEvent" />
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

<script lang="ts">
import moment from "moment";
import Detail from "./Detail.vue";
import ShiftMemberDetail from "./ShiftMemberDetail.vue";
import { Options, Vue } from 'vue-class-component';
import { mapState } from "vuex";
import { useAppInsights } from '../../store/modules/AppInsights'

  class Props{
        currentEvent:any;
    }
 @Options({
   computed: {
        ...mapState('oidcStore',['oidcUser']),
         ...mapState('schedule',['assignmentDetail']),
        ...mapState('profile', ['profileData', 'appInsightEventData','isImpersonating'])
    },
    components: {
            Detail,
            ShiftMemberDetail
        },
    })
export default class TradeShift extends Vue.with(Props) {
    data: any = {
    oldOffset: 0,
    searchNameDate: "",
    shiftMembers: [],
    potentialMembers: [],
    filteredPotentialMembers: [],
    stage: "todo",
    checkedPotential: [],
    activePageNumber: 1,
    potentialMemberLoading: false,
    assignmentLoaded: false,
    shiftDetailLoaded: false,
    totalResultCount: 0,
    displayPages: [],
    totalPageCount: 0,
    shiftOffers: [],
    cachPotentialTrades: [],
    searchStartDate: "",
    searchEndDate: "",
    searchFirstName: "",
    searchLastName: "",
    recommendedShiftsOnly: true,
    isInitialLoad: true
  };
  declare public $refs: {            
            Detail:any;
        };  
  profileData!: any;
  isImpersonating!: boolean;
  assignmentDetail!: any;
  appInsightEventData!: any;
  isLoaded: boolean = false;
  processMode: boolean = false;
  isProductive: boolean = false;
  isLoading:boolean = false;
  loaderColor: string = "#0085ca";

  mounted() {        
    if(this.currentEvent.status== "Scheduled" && this.currentEvent.type == "Assignment"){
      this.getAssignmentDetail();
    } else {
      this.isProductive = true;
      this.getShiftTradeOffer();
    }
  }

  FireAction() {
    if(this.data.stage == "withdraw") {
      this.withdrawPotentialTrade();
      return;
    }
    if (
      (this.data.stage == "completed" &&
        this.data.checkedPotential.length == 0) ||
      (this.processMode && this.data.stage == "completed")
    ) {
      return;
    }
    if (this.data.stage == "completed") {
      this.createShiftOffer();
    }
    if(this.data.stage == "todo") {
      this.data.stage = "completed";
    }
  }

  async getShiftTradeOffer() {
    var payload = { 
        username: this.profileData.username, 
        shiftTradeOfferId:  this.currentEvent.id, 
    };

    await this.$store.dispatch("schedule/getShiftTradeOffer", payload)
      .then((res) =>  {
        this.data.shiftOffers = res.data;
        if(this.data.shiftOffers?.length > 0) {
          this.data.stage = "withdraw";
          this.getPotetialTradeAssignment();
        } else {
              this.getAssignmentDetail();
        }
        this.data.shiftDetailLoaded = true
      })
  }

  getGuidforCreateShift() {
            var uuidValue = "", k, randomValue;
            for (k = 0; k < 32; k++) {
                randomValue = Math.random() * 16 | 0;
                if (k == 8 || k == 12 || k == 16 || k == 20) {
                    uuidValue += "-"
                }
                uuidValue += (k == 12 ? 4 : (k == 16 ? (randomValue & 3 | 8) : randomValue)).toString(16);
            }
            return uuidValue;
  }

  createShiftOffer() {
    let requestBody: any[] = [];
    const checkedPotential: any = this.data.checkedPotential;
    checkedPotential.forEach((checked:any) => {
            requestBody.push({
                id: this.getGuidforCreateShift(),
                username: this.profileData.username,
                firstName: this.profileData.first,
                lastName: this.profileData.last,
                tenantId: this.profileData.tenantId,
                scheduleId: this.assignmentDetail.scheduleId,
                facilityId: this.assignmentDetail.facilityId,
                coid: this.profileData.coid,
                facilityName: this.profileData.facilityName,
                departmentId: this.profileData.deptId,
                facilityCoId: this.assignmentDetail.facilityCoId,
                departmentName: this.assignmentDetail.departmentCode,
                departmentCode: this.profileData.deptCode,
                departmentShiftId: this.assignmentDetail.departmentShiftId,
                shiftCode: this.assignmentDetail.shiftCode,
                shiftDescription: this.assignmentDetail.shiftDescription,
                skill:checked.skill,
                date: this.currentEvent.date,
                startTime: this.assignmentDetail.startTime,
                endTime: this.assignmentDetail.endTime,
                actualStartTime: this.assignmentDetail.actualStartTime,
                actualEndTime: this.assignmentDetail.actualEndTime,
                hours: this.assignmentDetail.hours,
                minutes: this.assignmentDetail.minutes,
                status: 'Offered',
                requestorAssignmentId: this.assignmentDetail.id,
                productiveType: this.assignmentDetail.productiveType,
                acceptorAssignmentId: checked.assignmentId,
                offeredToUsername:  checked.staffUsername,
                offeredToFirstName: checked.firstName,
                offeredToLastName: checked.lastName,
                isAutoapprovable: checked.isAutoapprovable
            });
    });

    this.isLoading = true;
    this.$store
      .dispatch("schedule/createShiftTradeOffers", requestBody)
      .then((res) => {
        if (res.status === 200) {
            this.isLoading = false;
            this.$emit('showSuccessMsgPopUp', true);
            this.$emit('closeSharedModal');
            useAppInsights().trackEvent({name:'ShiftTradesOffered',properties: 
               JSON.parse(JSON.stringify(this.appInsightEventData))
            });
        }
      })
      .catch((err: any) => {
        if (err) {
           this.isLoading = false;
           console.log(err); // Handle errors any way you want
           let parseResponse = err.request.responseText != "" ? JSON.parse(err.request.responseText) : err.request.responseText;                
           this.$refs.Detail.showErrorMsg = true;                            
          this.$refs.Detail.errorMsg = (parseResponse.result != null || parseResponse.result != undefined) ? JSON.parse(parseResponse.result).Message : "An error has occurred. Please try again. If the error persists, contact Facility Scheduler support.";
        }        
      })
      .finally(() => {
        this.isLoading = false;
        this.processMode = false;
        // this.$emit('closeSharedModal');
      });
  }

  withdrawPotentialTrade() {
    this.isLoading = true;
    this.$store
      .dispatch("schedule/withdrawPotentialTrade", this.assignmentDetail.id)
      .then(() => {
        this.isLoading = false;
        this.$emit('showSuccessMsgPopUp', true);
        this.$emit('closeSharedModal');
      })
      .catch((err: any) => {
        if (err) {
          this.isLoading = false;
          console.log(err); // Handle errors any way you want          
          let parseResponse = err.request.responseText != "" ? JSON.parse(err.request.responseText) : err.request.responseText;                        
          this.$refs.Detail.showErrorMsg = true;                            
          this.$refs.Detail.errorMsg = (parseResponse.result != null || parseResponse.result != undefined) ? JSON.parse(parseResponse.result).Message : "An error has occurred. Please try again. If the error persists, contact Facility Scheduler support.";
        }         
      });
  }

  async getAssignmentDetail() {
    var payload = { 
      username: this.profileData.username, 
      id: this.currentEvent.id
    };  

    await this.$store.dispatch("schedule/getAssignmentDetail", payload);
    this.data.assignmentLoaded = true;
    this.data.shiftDetailLoaded = true;    
    this.isProductive = (this.assignmentDetail.productiveType == "Productive" || this.assignmentDetail.productiveTypeId == 1) ? true : false;     
  }

  async getPotetialTradeAssignment(offsetVal = 0, searchFirstNameLike = '', searchLastNameLike = '',searchStartDate='', searchEndDate='') {
    const checkIfCached = this.data.cachPotentialTrades.find((trades:any) => this.data.activePageNumber == Number(Object.keys(trades)[0]));
    if(checkIfCached) {
      this.handlePotentialShiftResponse(checkIfCached[this.data.activePageNumber]);
      this.data.cachPotentialTrades.pop();
      return;
    }
    this.data.potentialMemberLoading = true;
    this.isLoading = true;
    await this.$store
      .dispatch("schedule/getPotetialTradeAssignment", {              
        assignmentId: this.currentEvent.id,
        currentPage:  Math.ceil(offsetVal/6) > 1 ? Math.ceil(offsetVal/6) : 1,
        autoApprovableOnly: this.data.recommendedShiftsOnly,
        searchFirstNameLike:searchFirstNameLike,
        searchLastNameLike:searchLastNameLike,
        searchStartDate:searchStartDate,
        searchEndDate:searchEndDate,
        primaryDeptOnly:false

      }).then((response) => {
              this.isLoading = false;
              if(response) {
                if(this.data.activePageNumber == 1) {
                  this.data.totalResultCount = response.length > 0 ? response[0].totalResultCount : 0;
                  this.data.totalPageCount = Math.ceil(this.data.totalResultCount/6); // here 6 is current page display limit
                }

                this.handlePotentialShiftResponse(response);
              }
              this.data.potentialMemberLoading = false;
              this.data.assignmentLoaded = true;
      });
  }

  handlePotentialShiftResponse(response:any) {
    this.data.potentialMembers = response;
    this.data.filteredPotentialMembers = response;
    this.data.shiftOffers?.forEach((potential:any) => {
      this.onPotentialChecked({assignmentId: potential.acceptorAssignmentId});
    });
  }

  selectedPotential(assignment:any) {
    const checkedPotential: any = this.data.checkedPotential;
    return checkedPotential.some((potential:any) => potential.assignmentId == assignment.assignmentId);
  }

  get progressStatus() {
    return this.data.stage; // todo calculate class
  }

  showNextPage() {
    // todo pagenumber to dynamic and show next three
    if (this.$refs.Detail.showErrorMsg) {
      this.$refs.Detail.showErrorMsg = false;
      this.$refs.Detail.errorMsg = "";
    }  
  }

  loadOffset(action: string) {
    this.data.searchNameDate = '';
    let resultOffset = 0;
    const lastPotentialMember: any = this.data.potentialMembers[this.data.potentialMembers.length-1];
    resultOffset = this.data.activePageNumber * 6;
    if(action == 'next' &&   resultOffset != lastPotentialMember.totalResultCount) {      
      this.data.cachPotentialTrades.push({[this.data.activePageNumber]: this.data.potentialMembers});
      this.data.activePageNumber = this.data.activePageNumber + 1;
      this.getPotetialTradeAssignment(resultOffset + 1,this.data.searchFirstName, this.data.searchLastName,this.data.searchStartDate);
    } else if(action == 'back' && this.data.activePageNumber != 1) {
      resultOffset = Number(Object.keys(this.data.cachPotentialTrades[this.data.cachPotentialTrades.length -1])[0]);
      this.data.activePageNumber = this.data.activePageNumber - 1;
      this.getPotetialTradeAssignment(resultOffset,this.data.searchFirstName,this.data.searchLastName,this.data.searchStartDate);
    }
   
    if (this.$refs.Detail.showErrorMsg) {
      this.$refs.Detail.showErrorMsg = false;
      this.$refs.Detail.errorMsg = "";
    }  
  }

  search() {
    this.data.isInitialLoad = false;
    if (this.data.searchNameDate == "") {
      this.getPotetialTradeAssignment();
      return;
    }
  
  // check if its a date search
   let isDateSearch = false;

    if(moment(this.data.searchNameDate).isValid()){
      isDateSearch = true;
      this.data.searchStartDate = (moment(this.data.searchNameDate).format('MM-DD-YYYY')).toString();
    }

    if(isDateSearch){    
        // date search        
        this.getPotetialTradeAssignment(0,'','',this.data.searchStartDate); 
        this.data.searchFirstName = "";
        this.data.searchLastName = "";      
    } else {
      this.data.searchStartDate = "";
      // name search
      const regex = /\d/;
      if(regex.test(this.data.searchNameDate)){
        // invalid search term - not a date nor a name 
        this.data.filteredPotentialMembers = this.data.potentialMembers;
        return;
      }

      var nameSearch = this.data.searchNameDate.split(" ");      
      const alphaRegex =  /^[a-zA-Z()]+$/;
     

      if(nameSearch.length == 1){
        
        this.data.searchFirstName = this.data.searchNameDate;
        this.data.searchLastName = this.data.searchNameDate;
        
        if(!alphaRegex.test(this.data.searchFirstName)){
          
          this.data.filteredPotentialMembers = this.data.potentialMembers;
          return;
        }

        this.getPotetialTradeAssignment(0,this.data.searchFirstName,this.data.searchLastName);
       
      } else {
        
        this.data.searchFirstName =nameSearch[0].substring(0,30);
        this.data.searchLastName = nameSearch[1].substring(0,30);
        const isFirstNameIsAlphabetic = alphaRegex.test(this.data.searchFirstName);
        const isLastNameAlphabetic = alphaRegex.test(this.data.searchLastName)
        
        if(!isFirstNameIsAlphabetic && !isLastNameAlphabetic){
          
          this.data.filteredPotentialMembers = this.data.potentialMembers;
          return;
        
        } else if(isFirstNameIsAlphabetic && !isLastNameAlphabetic){

          this.getPotetialTradeAssignment(0,this.data.searchFirstName);

        }else if(isLastNameAlphabetic && !isFirstNameIsAlphabetic){

          this.getPotetialTradeAssignment(0,'',this.data.searchLastName);

        }else{

          this.getPotetialTradeAssignment(0,this.data.searchFirstName,this.data.searchLastName);          
        }
       
      }
    
    }

    if (this.$refs.Detail.showErrorMsg) {
      this.$refs.Detail.showErrorMsg = false;
      this.$refs.Detail.errorMsg = "";
    }  
  }

  formatAssignmentTime(date: Date): string {
    return moment(date).format("ddd, MMM D - h:mm A");
  }

  formatDate(date: Date): string {
    return moment(date).format("ddd, MMM D");
  }
  formatTime(t: Date): string {
    return moment(t).format("h:mm A");
  }
  onRecommendedChecked()
  {
    this.data.recommendedShiftsOnly = ! this.data.recommendedShiftsOnly
  }
  onPotentialChecked(potential:any) {
    const checkedPotential: any = this.data.checkedPotential;
    if (!checkedPotential.some((e:any) => e.assignmentId === potential.assignmentId)) {
      checkedPotential.push(potential);
    } else {
      const filteredOne = this.data.checkedPotential.filter((potentials: any) => {
        return potential.assignmentId != potentials.assignmentId;
      });
      this.data.checkedPotential = filteredOne;
    }
    if (this.$refs.Detail.showErrorMsg) {
      this.$refs.Detail.showErrorMsg = false;
      this.$refs.Detail.errorMsg = "";
    }  
  }

  clearSearch(){    
    this.data.searchNameDate = '';    
      // reset search
      this.data.searchFirstName = "";
      this.data.searchStartDate = "";
      this.data.searchLastName = "";
  }
}
</script>
