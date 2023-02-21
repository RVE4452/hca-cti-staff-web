<template>
  <div class="container-fluid" v-if="isLoaded">
    <div class="neu-margin--bottom-20 pb4 pt3">
         <div class="col-12">
          <p class="f3 h2 tl ttu">
            {{ formatTime(currentEvent.startTime) }} -
            {{ formatTime(currentEvent.endTime) }}
          </p>
        </div>
        <div class="col-12 neu-margin--top-20">
          <div v-if="shiftMembersDetail.length == 0">          
            <p class="neu-text--tag neu-text--align-left">No Shift Member Found</p>
         </div>
          <div class="row" v-if="shiftMembersDetail.length > 0">
            <div class="col-12 "><p class="neu-text--tag neu-text--align-left">SHIFT MEMBERS</p></div>            
            <div class="col-12 row mt3">
              <div
                class="col-12 mt2 mb2"
                v-for="shiftMember in shiftMembersDetail"
                :key="shiftMember.username"
              >
                <div class="d-flex">
                  <div>                          
                       <neu-avatar color="gray-60" :initials="shiftMember.firstName[0] + shiftMember.lastName[0]"></neu-avatar>                              
                  </div>
                  <div >
                    <div>
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
         ...mapState('schedule',['shiftMembersDetail','scheduleId']),
        ...mapState('profile', ['profileData', 'appInsightEventData'])
    },
})
export default class AssignmentDetail extends Vue.with(Props) {
 public shiftMembersDetail!: any;
 public scheduleId!: string;
  public profileData!: any;
  isLoaded: boolean = false;
  
  async mounted() {
    this.getEventDetail();
  }

  getEventDetail() {
    var payload = { 
        deptId: this.currentEvent.departmentId,
        start: this.currentEvent.startTime,
        end: this.currentEvent.endTime
    };  

    this.$store
      .dispatch("schedule/getShiftMembersDetail", payload)
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
