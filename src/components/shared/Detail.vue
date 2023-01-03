<template>
<div  class="col-12" v-if="isLoaded">     
  <div class="bg-black-05 container-fluid neu-margin--bottom-20 pb4 pt3" >
      <div class="row">
          <div class="col-12 neu-margin--bottom-20" v-if="showErrorMsg">                    
          <ErrorNotification  :errorMsg="errorMsg" :errorType="errorType" />
          </div>
        <div class="col-12 fs-26 fw-bold">
            {{ formatDate(this.currentEvent.date) }}
        </div>
        <div class="col-12 neu-margin--top-20 neu-input">
          <label for="txtFacility" class="neu-input__label">Facility</label>
          <input
            type="text"
            name="Facility"
            id="txtFacility"
            v-model="assignmentDetail.facilityName"
            :readonly="enableField.indexOf('facilityName') === -1"
            class="neu-input__text-field readonly_text_field bg-transparent"
          />
        </div>
        <div class="col-12 neu-margin--top-20 neu-input">
          <label for="txtDepartment" class="neu-input__label">Department</label>
          <input
            type="text"
            name="Department"
            id="txtDepartment"
            v-model="getDept"
            :readonly="enableField.indexOf('departmentName') < 0"
            class="neu-input__text-field readonly_text_field bg-transparent"
          />
        </div>
        <div class="col-12 neu-margin--top-20 neu-input">
          <label for="txtSkill" class="neu-input__label">Skill</label>
          <input
            type="text"
            name="Skill"
            id="txtSkill"
            v-model="assignmentDetail.skill"
            :readonly="enableField.indexOf('skill') < 0"
            class="neu-input__text-field readonly_text_field bg-transparent"
          />
        </div>
        <div class="col-12 neu-margin--top-20 neu-input">
          <label for="txtShift" class="neu-input__label">Shift</label>
          <input
            type="text"
            name="Shit"
            id="txtShift"
            v-model="assignmentDetail.shift"
            :readonly="enableField.indexOf('shift') < 0"
            v-bind:class="enableField.indexOf('shift') < -1 ? 'neu-input__text-field' : 'neu-input__text-field readonly_text_field bg-transparent'"
          />
        </div>
      </div>
    </div>
  </div>
</template>
// <script lang="ts">
// import { Component, Vue, Prop } from "vue-property-decorator";
// import ErrorNotification from "./ErrorNotification.vue";
// import { namespace } from "vuex-class";
// const schedule = namespace("schedule");
// import moment from 'moment';
// const profile = namespace("profile");

//  @Component({
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
//     showErrorMsg: boolean = false;
//      errorMsg: string = '';
//      errorType: string = 'error';
//     @Prop() currentEvent: any;
//     @Prop() enableField: any;

//     async mounted() {
//         this.getEventDetail();
//     }

//     getEventDetail() {
//         var payload = { 
//             username: this.profileData.username, 
//             id: this.currentEvent.id
//         };  

//         this.$store
//         .dispatch("schedule/getAssignmentDetail", payload)
//         .then(() => {
//             this.isLoaded = true;
//         });
//     }
//   get getDept() {
//             return this.assignmentDetail.departmentCode + " (" + this.assignmentDetail.departmentName + ")";
//         }
//   formatDate(date: Date): string {
//     return moment(date).format("dddd, MMM DD YYYY");
//   }
// }
// </script>
