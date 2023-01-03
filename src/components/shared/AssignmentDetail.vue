<template>
     <div class="col-12" v-if="isLoaded">
                <div class="bg-black-05 container-fluid">
                <div class="d-flex flex-wrap-l neu-margin--bottom-20 pb4 pt3">
                  <div class="col-12 neu-margin--bottom-20" v-if="showErrorMsg">                   
                    <ErrorNotification  :errorMsg="errorMsg" :errorType="errorType" />
                  </div>  
                  <div class="col-sm-12 f3">
                    Details
                  </div>
                  <div class="col-sm-6 neu-margin--top-20 neu-input">
                    <label for="txtFacility" class="neu-input__label"
                      >Facility</label
                    ><input
                      type="text"
                      name="Facility"
                      id="txtFacility"
                      v-model="assignmentDetail.facilityName"
                      readonly="readonly"
                      class="readonly_text_field"
                    />
                  </div>
                  <div class="col-sm-6 neu-margin--top-20 neu-input">
                    <label for="txtDepartment" class="neu-input__label"
                      >Department</label
                    ><input
                      type="text"
                      name="Department"
                      id="txtDepartment"
                      v-model="getDept"
                      readonly="readonly"
                      class="readonly_text_field"
                    />
                  </div>
                  <div class="col-sm-6 neu-margin--top-20 neu-input">
                    <label for="txtSkill" class="neu-input__label">Skill</label
                    ><input
                      type="text"
                      name="Skill"
                      id="txtSkill"
                      v-model="assignmentDetail.skill"
                      readonly="readonly"
                      class="readonly_text_field"
                    />
                  </div>
                  <div class="col-sm-6 neu-margin--top-20 neu-input">
                    <label for="txtShift" class="neu-input__label">Shift</label
                    ><input
                      type="text"
                      name="Shit"
                      id="txtShift"
                      v-model="assignmentDetail.shift"
                      readonly="readonly"
                      class="readonly_text_field"
                    />
                  </div>
                </div>
              </div>
              <div class="container-fluid">
                <div class="d-flex flex-wrap-l mt4">
                  <div class="col-6">
                     <p class="f3 h2 tl ttu">
                        {{ formatTime(this.assignmentDetail.actualStart) }} -
                        {{ formatTime(this.assignmentDetail.actualEnd) }}
                      </p>
                      <span class="fw1">
                        {{ formatDate(this.currentEvent.date) }}</span
                      >
                  </div>
                  <div class="col-6">
                     <div class="row" v-if="assignmentDetail.shiftMembers.length == 0">          
                        <div class="col-12">
                          <p class="neu-text--tag neu-text--align-left">No Shift Member Found</p>
                        </div>
                      </div>
                    <div class="row" v-if="assignmentDetail.shiftMembers.length > 0">
                      <div class="col-12"><p class="neu-text--tag neu-text--align-left">SHIFT MEMBERS</p></div>
                      <div class="col-12 row mt3">
                        <div class="col-6 mt2 mb2"  v-for="shiftMember in assignmentDetail.shiftMembers" :key="shiftMember.username">
                          <div class="d-flex">
                            <div class="col-auto pa0">
                              <!-- <img
                                class="br-100 h3"
                                src="https://findicons.com/files/icons/1786/oxygen_refit/128/stock_people.png"
                                v-bind:alt="shiftMember.first[0] + shiftMember.last[0]"
                              /> -->
                              <h6 class="bg-gray tc white mr2 initial-name">{{shiftMember.firstName[0] + shiftMember.lastName[0]}}</h6>
                            </div>
                            <div class="col-auto pa0">
                              <div class="row">
                                <div class="col-12" v-bind:title="shiftMember.name"><span class="fw6">{{shiftMember.name}}</span></div>
                                <div class="col-12"><span class="gray">{{shiftMember.skill}}</span></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-12 mt5 mb4 tc">
                    <h6>Cannot be Modified</h6>
                  </div>
                </div>
              </div>
        </div>
</template>


// <script lang="ts">
// import { Component, Vue, Prop } from "vue-property-decorator";
// import { namespace } from "vuex-class";
// import moment from "moment";
// import ErrorNotification from "./ErrorNotification.vue";
// const schedule = namespace("schedule"); 
// const profile = namespace("profile");

// @Component({
//     components: {
//             ErrorNotification
//         },
//     })
// export default class AssignmentDetail extends Vue {
//     @schedule.State 
//     public assignmentDetail!: any;
//     @profile.State
//     public profileData!: any;

//     isLoaded: boolean = false;
//     @Prop() currentEvent: any;
//     errorMsg: string = '';
//     errorType: string = 'error';
//     showErrorMsg: boolean = false;
    
//     async mounted() {
//         this.getEventDetail();
//     }

//     getEventDetail() {   
//       var payload = { 
//           username: this.profileData.username, 
//           id: this.currentEvent.id
//       };  
      
//       this.$store
//         .dispatch("schedule/getAssignmentDetail", payload)
//         .then(() => {
//             this.isLoaded = true;            
//         })
//         .catch((err: any) => {
//             if (err) {
//                 console.log(err); // Handle errors any way you want
//                 this.showErrorMsg = true;
//                 this.errorMsg = "An error has occurred. Please try again. If the error persists, contact Facility Scheduler support.";
//             }
//         });
//     }
      
//         get getDept() {
//             return this.assignmentDetail.departmentCode + " (" + this.assignmentDetail.departmentName + ")";
//         }

//   formatDate(date: Date): string {
//     return moment(date).format("ddd, MMM D");
//   }
//   formatTime(t: Date): string {
//     return moment(t).format("h:mm a");
//   }

// }
// </script>
