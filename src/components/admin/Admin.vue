<template>
  <form>
    <div>
      <div class="neu-width--70 neu-margin--vert-0 neu-margin--horiz-auto">
       
        <h1 class="adminTitle">MyScheduler Administration</h1>
         <div style="margin-left:-10px;" class="col-12 neu-margin--bottom-20" v-if="showErrorMsg">
                    <ErrorNotification :errorMsg="errorMsg" :errorType="errorType" />
           </div>
        <div>To impersonate an employee <font style="color:#FF0000;">in your department(s),</font> enter their 3/4 ID below and click Save. 
          <br><br>Click the settings icon in the MyScheduler navigation bar to return to this screen</div>
         <br>
         <label><b>Note:</b> Impersonating an employee provides<b> read-only</b> access to the employee's MyScheduler views.</label>
        <div class="row neu-margin--bottom-10">          
           <div class="col-sm-12 neu-margin--top-20 neu-input">
            <label for="txtUserId" style="color:#FF0000;" class="neu-input__label"
              ><b>Employee 3/4 Id</b></label
            >
          </div>
          <div class="col-sm-4  neu-input">
            <input
              required
              class="neu-input__text-field form-control input-sm"
              type="text"
              id="txtUserId"
              v-model="userId"
            />
          </div>
          <div class="col-sm-4 ptop1">
            <notifications group="userid" position="top center" />
            <button v-if="this.isAdmin"
              @click.prevent="saveUserId()"
              class="neu-button--primary neu-button neu-button--raised maxbutton_width"
            >
              Save
            </button>
          </div>
        </div>
        <div v-if="token">
          <label><b>Your token is</b> : Bearer {{ token }}</label>
        </div>
        <router-view />
      </div>
    </div>
  </form>
</template>

<script lang="ts">
    import { Options, Vue } from 'vue-class-component';
    import moment from "moment";
    import { mapState } from "vuex";
//import bus from '../../eventBus'
import ErrorNotification from "../shared/ErrorNotification.vue";

@Options({
  components: {ErrorNotification},
  computed: {
    ...mapState(["oidcUser"]),
    ...mapState(['profile',"profileData",'isAdmin','isStaffManager']),
  },
})
export default class Admin extends Vue {
  oidcUser!: any;
  userName: string ="";
  public profileData!: any;
  isAdmin!: boolean;
  isStaffManager!: boolean;
 
  token = localStorage["Token"];

  userId: string = "";
  errorMsg: string = "";
  showErrorMsg: boolean = false;
  errorType: string = "error";
                  

  constructor() {
    super();
    
    // bus.$on("profileLoaded", (msg:string) => {
    //   this.token = localStorage["Token"];
    //   this.updateUserName();
    // });
  }

  async created()
  {
    if(this.profileData.first == null || this.profileData.first == undefined)
    {
      await this.$store.dispatch('profile/getProfileDetails','') ;   
    }
      if(!this.isAdmin)
      {
        this.$router.push('/invalidaccount')
      }
  }

  updateUserName()
  {
    if (this.profileData.first != null) {
      this.userName = this.profileData.first + " " + this.profileData.last;
    } 
    else {
      this.userName = this.oidcUser.firstName + " " + this.oidcUser.lastName;
    }
  }

  async saveUserId() {    
     this.showErrorMsg = false;
    if (this.userId != "") {
      await this.$store.dispatch("profile/checkStaffManager",this.userId.trim().toUpperCase()).then(async(res) => {                 
                 if(this.isStaffManager)
                 {
                    await this.$store.dispatch("profile/getProfileDetails", this.userId.trim().toUpperCase()); 
                 } 
                 else
                 {
                    this.showErrorMsg = true;
                    this.errorMsg = "The 3/4 ID you entered does not match any employees within your department(s). Please check the number and try again."
                    return;
                 }            
             })     
      //  this.$notify({
      //   group: "userid",
      //   title: "",
      //   text: `User 3/4 id (${this.userId}) saved successfully!`,       
      //});         
      this.userId = "";
    }
  }
}
</script>

<style>
label {
  word-wrap: break-word;
  width: 600px;
}

/* Media Query for Mobile Devices */
@media (max-width: 480px) {
    .ptop1 {
        padding-top: 1rem !important;
    }

    .adminTitle{
      line-height: 2.775rem;
    }
}
</style>
