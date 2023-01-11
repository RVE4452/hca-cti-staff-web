<template>
  <div class="container-fluid" v-if="isLoaded">
    <div class="neu-margin--bottom-20 pb4 pt3">
         <div class="col-12">
          <p class="f3 h2 tl ttu">
            {{ formatTime(this.assignmentDetail.actualStartTime) }} -
            {{ formatTime(this.assignmentDetail.actualEndTime) }}
          </p>
        </div>
        <div class="col-12 neu-margin--top-20">
          <div v-if="assignmentDetail.shiftMembers.length == 0">          
            <p class="neu-text--tag neu-text--align-left">No Shift Member Found</p>
         </div>
          <div class="row" v-if="assignmentDetail.shiftMembers.length > 0">
            <div class="col-12 "><p class="neu-text--tag neu-text--align-left">SHIFT MEMBERS</p></div>            
            <div class="col-12 row mt3">
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
                      <div class="col-12" v-bind:title="shiftMember.name"><span class="fw6">{{shiftMember.name}}</span></div>
                      <div class="col-12"><span class="gray">{{shiftMember.skill}}</span></div>
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
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { mapState } from "vuex";
import moment from "moment";

class Props{
  currentEvent: any;
}
@Options({
   computed: {
        ...mapState('oidcStore',['oidcUser']),
         ...mapState('schedule',['assignmentDetail','scheduleId']),
        ...mapState('profile', ['profileData', 'appInsightEventData'])
    },
})
export default class AssignmentDetail extends Vue.with(Props) {
 public assignmentDetail!: any;
 public scheduleId!: string;
  public profileData!: any;
  isLoaded: boolean = false;
  
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
      })
      .catch((err: any) => {
        if (err) {
          console.log(err); // Handle errors any way you want
        }
      });
  }

  formatDate(date: Date): string {
    return moment(date).format("ddd, MMM D");
  }
  formatTime(t: Date): string {
    return moment(t).format("h:mm a");
  }
}
</script>
