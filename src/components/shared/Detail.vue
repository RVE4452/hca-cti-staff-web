<template>
<div  class="col-12" v-if="isLoaded">     
  <div class="bg-black-05 container-fluid neu-margin--bottom-20 pb4 pt3" >
      <div class="row">
          <div class="col-12 neu-margin--bottom-20" v-if="showErrorMsg">                    
          <ErrorNotification  :errorMsg="errorMsg" :errorType="errorType" />
          </div>       
        <div class="col-12 neu-margin--top-20">
          <neu-label color="primary" content="Facility" position="fixed" >
          </neu-label>
          <neu-input
            type="text"
            name="Facility"
            id="txtFacility"
            :value="assignmentDetail.facilityName"
            :disabled="enableField.indexOf('facilityName') === -1"            
          />
        </div>
        <div class="col-12 neu-margin--top-20">
          <neu-label for="txtDepartment"  color="primary" content="Department" position="fixed" ></neu-label>
          <neu-input
            type="text"
            name="Department"
            id="txtDepartment"
            v-model="getDept"
            :value="getDept"
            :disabled="enableField.indexOf('departmentName') < 0"           
          />
        </div>
        <div class="col-12 neu-margin--top-20">
          <neu-label for="txtSkill" color="primary" content="Skill" position="fixed"></neu-label>
          <neu-input
            type="text"
            name="Skill"
            id="txtSkill"
            v-model="assignmentDetail.skill"
            :value="assignmentDetail.skill"
            :disabled="enableField.indexOf('skill') < 0"
          />
        </div>
        <div class="col-12 neu-margin--top-20">
          <neu-label for="txtShift" color="primary" content="Shift" position="fixed"></neu-label>
          <neu-input
            type="text"
            name="Shift"
            id="txtShift"
            v-model="assignmentDetail.shift"
            :value="assignmentDetail.shift"
            :disabled="enableField.indexOf('shift') < 0"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import ErrorNotification from "./ErrorNotification.vue";
import { Options, Vue } from 'vue-class-component';
import { mapState } from "vuex";
import moment from "moment";

class Props{
  currentEvent: any;
  enableField: any;
}
 @Options({
   computed: {
        ...mapState('oidcStore',['oidcUser']),
         ...mapState('schedule',['assignmentDetail']),
        ...mapState('profile', ['profileData', 'appInsightEventData'])
    },
    components: {
            ErrorNotification
        },
    })
export default class AssignmentDetail extends Vue.with(Props) {
    public assignmentDetail!: any;
    public profileData!: any;

    isLoaded: boolean = false;
    showErrorMsg: boolean = false;
     errorMsg: string = '';
     errorType: string = 'error';

    async mounted() {
        this.getEventDetail();
    }

    getEventDetail() {
        var payload = { 
            username: this.profileData.username, 
            id: this.currentEvent.id
        };  

        this.$store
        .dispatch("schedule/getAssignmentDetail", payload)
        .then(() => {
            this.isLoaded = true;
        });
    }
  get getDept() {
            return this.assignmentDetail.departmentCode + " (" + this.assignmentDetail.departmentName + ")";
        }
  formatDate(date: Date): string {
    return moment(date).format("dddd, MMM DD YYYY");
  }
}
</script>
