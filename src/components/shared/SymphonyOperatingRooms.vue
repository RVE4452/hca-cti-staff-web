<template>
  <div class="w-100">
    <loading
      :active="isLoading"
      :can-cancel="false"
      :height="128"
      :width="128"
      :color="loaderColor"
      :opacity="0.7"
      :is-full-page="true"
    />
    <div v-if="!this.assignmentLoaded" class="tc z-1">
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
    <div v-else>
      <div class="bg-black-05 container-fluid neu-margin--bottom-20 pb4 pt3">
        <div class="col-12 fs-26 fw-bold">
          {{ formatDate(this.currentEvent.date) }}
        </div>
        <div v-if="orAssignmentDetail == null || orAssignmentDetail == ''">
          <p class="neu-margin--left-20 neu-margin--top-20 neu-text--tag neu-text--align-left">
            No Assignments Scheduled
          </p>
        </div>
        <div v-else-if="orAssignmentDetail.length > 0">
          <div
            class="col-12 neu-margin--top-20 neu-margin--bottom-20 neu-input fw-bold"
          >
            Location - Room - Start Time - Role
          </div>
          <div
            class="col-12 neu-input"
            v-for="(objAssignment, index) in orAssignmentDetail"
            :key="index"
          >
            <input
              type="radio"
              :value="objAssignment"
              name="rdoOR"
              @change="onRoomChange(objAssignment)"
              v-bind:checked="index === 0"
            />
            {{ objAssignment.location }} - {{ objAssignment.room }} -
            {{ formatTime(objAssignment.startTime) }} - {{ objAssignment.role }}
          </div>
          <div class="col-12 neu-margin--top-20 neu-input fw-bold">
            Procedure
          </div>
          <div class="col-12 neu-input">
            {{ selectedOR.procedure }}
          </div>
          <div class="col-12 neu-margin--top-20 neu-input fw-bold">
            Surgeon / Specialty
          </div>
          <div class="col-12 neu-input">
            {{ selectedOR.surgeon }} / {{ selectedOR.specialty }}
          </div>

          <div class="col-12 neu-margin--top-20">
            <div v-if="selectedOR.teamMembers.length == 0">
              <p class="neu-text--tag neu-text--align-left">
                No Surgical Team Member Found
              </p>
            </div>
            <div class="row" v-if="selectedOR.teamMembers.length > 0">
              <div class="col-12 ">
                <p class="neu-text--tag neu-text--align-left">
                  SURGICAL TEAM MEMBERS
                </p>
              </div>
              <div class="col-12 row mt3">
                <div
                  class="col-12 mt2 mb2"
                  v-for="shiftMember in selectedOR.teamMembers"
                  :key="shiftMember.name"
                >
                  <div class="d-flex">
                    <div class="col-auto pa0">
                      <h6 class="bg-gray tc white mr2 initial-name">
                        {{
                          shiftMember.name.split(" ")[0][0] +
                            shiftMember.name.split(" ")[1][0]
                        }}
                      </h6>
                    </div>
                    <div class="col-auto pa0">
                      <div class="row">
                        <div class="col-12" v-bind:title="shiftMember.name">
                          <span class="fw6">{{ shiftMember.name }}</span>
                        </div>
                        <div class="col-12">
                          <span class="gray">{{ shiftMember.role }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

// <script lang="ts">
// import moment from "moment";
// import { Component, Vue, Prop } from "vue-property-decorator";
// import { namespace } from "vuex-class";
// const profile = namespace("profile");
// const schedule = namespace("schedule");
// import Loading from "vue-loading-overlay";
// import "vue-loading-overlay/dist/vue-loading.css";
// @Component({
//   components: {
//     Loading,
//   },
// })
// export default class SymphonyOperatingRooms extends Vue {
//   @profile.State profileData!: any;

//   @Prop() currentEvent: any;

//   assignmentLoaded: boolean = false;

//   isLoading: boolean = false;
//   loaderColor: string = "#0085ca";

//   @schedule.State
//   public orAssignmentDetail!: any;
//   public selectedOR: any = [];

//   mounted() {
//     this.getORAssignmentDetail();
//   }

//   getORAssignmentDetail() {
//     var payload = {
//       username: this.profileData.username,
//       date: this.currentEvent.date,
//     };

//     this.$store
//       .dispatch("schedule/getORAssignmentDetails", payload)
//       .then(() => {
//         //this.isLoaded = true;
//         this.assignmentLoaded = true;
//         if (this.orAssignmentDetail != null) {
//           this.selectedOR = this.orAssignmentDetail[0];
//         }
//       });
//   }

//   onRoomChange(selectedObj: any) {
//     var selectedShift = this.orAssignmentDetail.find(
//       (x) =>
//         x.startTime == selectedObj.startTime &&
//         x.room == selectedObj.room &&
//         x.location == selectedObj.location
//     );
//     this.selectedOR = selectedShift;
//   }
//   formatAssignmentTime(date: Date): string {
//     return moment(date).format("ddd, MMM D - h:mm A");
//   }

//   formatDate(date: Date): string {
//     return moment(date).format("dddd, MMM DD YYYY");
//   }
//   formatTime(t: Date): string {
//     return moment(t).format("h:mm A");
//   }
// }
// </script>
