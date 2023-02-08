<template>
  <div  class="col-12" >     
  <div class="container-fluid neu-margin--bottom-20 pb4 pt3" >
    <div class="row">
      <neu-label>Select Day Preference</neu-label>
    </div>
    <div class="row">
      <div class="row neu-margin--top-20">
        <neu-radio-group :value="dayPreference"  @v-neu-change="selectionChange(value)">
          <!-- @v-neu-change="preferenceSelected()" -->
        
        
        <div class="col-12 neu-margin--top-05">
            <!-- <neu-radio  color="primary" ></neu-radio> -->
            <neu-radio value="Required"></neu-radio>
            <neu-label class="col-4 ">Required</neu-label>
        </div>
        <div class="col-12 neu-margin--top-05">
            <!-- <neu-radio  color="primary" ></neu-radio> -->
            <neu-radio value="Available"></neu-radio>
        
            <neu-label class="col-4 ">Available</neu-label>
        </div>
        <div class="col-12 neu-margin--top-05">
            <!-- <neu-radio  color="primary" ></neu-radio> -->
            <neu-radio value="Neutral"></neu-radio>
            <neu-label class="col-4 ">Neutral</neu-label>
        </div>
        <div class="col-12 neu-margin--top-05">
            <!-- <neu-radio  color="primary" ></neu-radio> -->
            <neu-radio value="Unavailable"></neu-radio>
            <neu-label class="col-4 ">Unavailable</neu-label>
        </div>
        
        </neu-radio-group>
      </div>
    </div>
    <div class="row">
      <div class="row neu-margin--top-20 neu-margin--left-30" style="width:100%" >
        <neu-button :color="enableSave?'primary':'gray-50'" full="true" type="submit" fill="raised"  style="width:100%"  @click="savePreference()">
              Save
        </neu-button>
      </div>
    </div>
  </div>
  </div>
  <neu-container></neu-container>
  </template>
  
  <script lang="ts">
  import { NeuContainer } from '@neutron/vue';
import { mapState } from "vuex";
  
  export default {
    name: 'DayPreferenceView',
    components: { NeuContainer },
    props: {},
    computed: {
      ...mapState('profile',["profileData"]),
    },
    data : () =>{
      return {
        dayPreference:'',
        enableSave:false,
      }
    },
    methods : {

      selectionChange(value){
      // if (this.dayPreference == value){
      //   return 0;
      // }
        this.dayPreference = value;
        this.enableSave =true;
      },
      
      
      async savePreference(){
            var payload = {
                staffId: this.profileData.staffId,
                schedulePreferenceId: this.dayPreference,
                date: "2023-02-07T14:19:32.052Z"
            };
            
            await this.$store.dispatch('schedule/saveDayPreference', payload)
                .then((res: any) => {
                    console.log(res);
                    this.enableSave = !this.enableSave;
                })
                .catch((err: any) => {
                    if (err) {
                        console.log(err);
                    }
                });
        
      },
    }
    
    
    
  }
  </script>
  