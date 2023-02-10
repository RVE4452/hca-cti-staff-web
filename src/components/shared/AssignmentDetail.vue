<template>
<div class="w-100">
  <neu-spinner class="div-center" v-if="!isLoaded" color="primary" >
  </neu-spinner> 
 <div  class="col-12" v-if="isLoaded">     
  <div class="container-fluid mb-20 pb4 pt3" >
      <div class="row">       
          <div class="col-12 mb-20" v-if="showErrorMsg">                    
          <ErrorNotification  :errorMsg="errorMsg" :errorType="errorType" />
          </div>       
        <div class="col-12">
          <neu-label position="fixed" >Facility
          </neu-label>
          <neu-input 
            type="text"
            name="Facility"
            id="txtFacility"
            :value="currentEvent.facilityName"
            :readonly="enableField.indexOf('facilityName') === -1"            
          />
        </div>
        <div class="col-12 neu-margin--top-20">
          <neu-label for="txtDepartment"  position="fixed" >Department</neu-label>
          <neu-input
            type="text"
            name="Department"
            id="txtDepartment"
            v-model="getDept"
            :value="getDept"
            :readonly="enableField.indexOf('departmentName') < 0"           
          />
        </div>
        <div class="col-12 neu-margin--top-20">
          <neu-label for="txtSkill" position="fixed">Skill</neu-label>
          <neu-input
            type="text"
            name="Skill"
            id="txtSkill"
            v-model="currentEvent.skillDescription"
            :value="currentEvent.skillDescription"
            :readonly="enableField.indexOf('skill') < 0"
          />
        </div>
        <div class="col-12 neu-margin--top-20">
          <neu-label for="txtShift" position="fixed">Shift</neu-label>
          <neu-input
            type="text"
            name="Shift"
            id="txtShift"
            v-model="currentEvent.departmentShiftDescription"
            :value="currentEvent.departmentShiftDescription"
            :readonly="enableField.indexOf('shift') < 0"
          />
        </div>
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

    isLoaded: boolean = true;
    showErrorMsg: boolean = false;
     errorMsg: string = '';
     errorType: string = 'error';

    async mounted() {
        //this.getEventDetail();
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
            return this.currentEvent.departmentCode + " (" + this.currentEvent.departmentName + ")";
        }
  formatDate(date: Date): string {
    return moment(date).format("dddd, MMM DD YYYY");
  }
}
</script>

